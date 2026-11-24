#!/usr/bin/env node
// No-soft-lock walk.
//
//   node tools/room-walk.mjs            every game, every role
//   node tools/room-walk.mjs deep-six   one game
//
// For every room that declares a solved state (the flags of all its
// `lintStates`, merged — the furthest-on state the room describes — or, if it
// declares none, the flags its own done()/open() check reads), plays the
// room from there with a stand-in for the engine's `game` API: clicks every
// hotspot in turn, re-reading the hotspots after each pass as the engine does,
// until the room completes. Puzzles (openPuzzle) and dialogs do nothing here —
// the solved state stands in for them; each hotspot is also tried with each
// item carried, as a player would use it. Things picked up and progress made
// are kept; a switch turned back off on the way is put back (a solved room
// shouldn't be un-solved by wandering, e.g. rowing back across the pool).
// Timers run at once. A finale that ends inside its own puzzle is worked with
// tools/puzzle-driver.mjs: its declared answer typed or dialled in, or every
// dial / lever / choice setting tried. So what this proves is that once the
// puzzle is done, the way out can always be taken: nothing the exit insists on
// is missing, out of reach, or hidden under another hotspot.
//
//   SOFTLOCK   a solved room never completes                         (error)
//   SET        the game's collectibles, pooled across every role, are
//              not one full run (a number missing or found twice)     (error)
//   UNWALKED   a room declares no solved state, so it was not walked   (listed)
//
// Collectibles carry from room to room within a role, as they do in play, so a
// finale that needs "all your shards" sees the ones picked up before it.

import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { answersFor } from './room-answers.mjs';
import { drivePuzzle, installFakeDocument } from './puzzle-driver.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUB = path.join(ROOT, 'public');

function gamesWithRooms() {
  return readdirSync(PUB, { withFileTypes: true })
    .filter(d => d.isDirectory() && existsSync(path.join(PUB, d.name, 'js/rooms/index.js')))
    .map(d => d.name)
    .sort();
}

function rolesFor(game) {
  const rolePath = path.join(PUB, game, 'js/role.js');
  if (!existsSync(rolePath)) return [{ key: null, role: null }];
  const src = readFileSync(rolePath, 'utf8');
  const key = /ROLE_KEY\s*=\s*'([^']+)'/.exec(src)?.[1];
  const roles = src.includes("p4:") ? ['p1', 'p2', 'p3', 'p4'] : ['p1', 'p2'];
  return roles.map(role => ({ key, role }));
}

const inside = (a, b) => a.x >= b.x && a.y >= b.y && a.x + a.w <= b.x + b.w && a.y + a.h <= b.y + b.h;

// ---------------------------------------------------------------- child mode
async function walkOne(game, roleKey, role) {
  const store = new Map();
  if (roleKey && role) store.set(roleKey, role);
  globalThis.localStorage = {
    getItem: k => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: k => store.delete(k),
  };
  const rooms = (await import(pathToFileURL(path.join(PUB, game, 'js/rooms/index.js')).href)).default;
  const roomDir = path.join(PUB, game, 'js/rooms');
  const sources = readdirSync(roomDir).filter(f => f.endsWith('.js') && f !== 'index.js')
    .map(f => readFileSync(path.join(roomDir, f), 'utf8'));
  installFakeDocument();
  // exits often finish on a timer (after the line of narration): run timers at once
  globalThis.setTimeout = /** @type {any} */ ((f, _ms, ...a) => { try { f(...a); } catch { /* DOM-only */ } return 0; });
  const kitSrc = readdirSync(path.join(PUB, game, 'js')).filter(f => f.endsWith('.js'))
    .map(f => readFileSync(path.join(PUB, game, 'js', f), 'utf8')).join('\n');
  const journal = [];
  const out = [];
  for (const [index, room] of rooms.entries()) {
    const finale = index === rooms.length - 1;
    // the solved state: the room's lintStates merged, else the flag(s) its
    // own done()/open()/lit() check reads
    const src = sources.find(t => t.includes(`id: '${room.id}'`)) || '';
    const derived = [...src.matchAll(/^function \w+\(state\) \{ return !!state\.flags\.(\w+); \}/gm)].map(m => m[1]);
    // the duo/group kits' convention: a room is open when <id>_open (or <slug>_open) is set
    if (!derived.length && src.includes(`flags.${room.id}_open`)) derived.push(`${room.id}_open`);
    const slug = /\bslug: '(\w+)'/.exec(src)?.[1];
    if (!derived.length && slug && kitSrc.includes('${slug}_open')) derived.push(`${slug}_open`);
    const declared = room.lintStates?.length ? room.lintStates : derived.length ? [{ flags: Object.fromEntries(derived.map(f => [f, true])) }] : null;
    if (!declared && !finale) { out.push({ room: room.id, walked: false, finale }); continue; }
    const states = declared || [{ flags: {} }];
    const flags = Object.assign({}, ...states.map(s => s.flags || {}));
    const inventory = [...new Set(states.flatMap(s => s.inventory || []))];
    // notes a declared state says the player already has
    for (const id of new Set(states.flatMap(s => s.journal || []))) if (!journal.some(e => e.id === id)) journal.push({ id, category: 'note' });
    const state = { currentRoom: 0, timeLeft: 3600, hintsUsed: {}, started: true, flags, inventory, journal };
    let completed = false;
    let how = '';
    const api = {
      get state() { return state; },
      selectedItem: null,
      addItem(id) { if (!state.inventory.includes(id)) state.inventory.push(id); },
      hasItem(id) { return state.inventory.includes(id); },
      removeItem(id) { const i = state.inventory.indexOf(id); if (i >= 0) state.inventory.splice(i, 1); },
      useSelected() { const id = api.selectedItem; if (id) { api.removeItem(id); api.selectedItem = null; } return id; },
      setFlag(k, v = true) { state.flags[k] = v; },
      getFlag(k) { return state.flags[k]; },
      journal: {
        add(id, e) { if (!state.journal.some(x => x.id === id)) state.journal.push({ id, ...e }); },
        has(id) { return state.journal.some(e => e.id === id); },
      },
      completeRoom() { completed = true; },
      // a dialog that asks something: take its primary answer, as a player would
      dialog(o = {}) { (o.buttons || []).find(b => /primary/.test(b.class || ''))?.onClick?.(); },
    };
    const stub = new Proxy(api, { get: (t, p) => (p in t ? t[p] : () => undefined) });
    const clicked = [];
    for (let pass = 0; pass < 8 && !completed; pass++) {
      let spots = [];
      try { spots = room.hotspots(state) || []; } catch (e) { if (process.env.WALK_DEBUG) console.error(room.id, e.stack); break; }
      // only what can actually be clicked: not wholly under a later hotspot
      const reachable = spots.filter((s, i) => !spots.slice(i + 1).some(t => inside(s, t)));
      for (const s of reachable) {
        // as the player would: try it bare, then with each thing you carry
        for (const item of [null, ...state.inventory]) {
          // a player who has solved the room picks things up on the way out
          // but doesn't undo the room: keep what's gained, put switches back
          const flagsBefore = { ...state.flags }, invBefore = [...state.inventory];
          api.selectedItem = item;
          try { s.onInteract(stub); } catch { /* a DOM-only path; the solved state covers it */ }
          if (completed) break;
          // keep progress (new flags, counters going up); undo only a switch turned back off
          state.flags = Object.fromEntries(Object.entries({ ...flagsBefore, ...state.flags })
            .map(([k, v]) => [k, (k in flagsBefore && flagsBefore[k] && !v) ? flagsBefore[k] : v]));
          state.inventory = [...new Set([...invBefore, ...state.inventory])];
        }
        api.selectedItem = null;
        clicked.push(s.id);
        if (completed) break;
      }
    }
    // A finale usually ends inside its own puzzle: from the state before it
    // (what the player carries in), open every puzzle the room offers and work
    // it with the room's own answer, or every dial/lever setting.
    if (finale && !completed) {
      const answers = answersFor(room, role, src);
      // the state just before the last puzzle: fresh, each declared state, or
      // everything declared except the room's own done flag(s)
      const minusDone = Object.fromEntries(Object.entries(flags).filter(([k]) => !derived.includes(k)));
      for (const preFlags of [{}, ...states.map(s => s.flags || {}), minusDone]) {
        if (completed) break;
        const pre = { ...state, flags: { ...preFlags }, inventory: [...inventory] };
        const defs = [];
        const preApi = new Proxy({ ...api, get state() { return pre; }, openPuzzle(def) { defs.push(def); },
          setFlag(k, v = true) { pre.flags[k] = v; }, getFlag(k) { return pre.flags[k]; },
          hasItem(id) { return pre.inventory.includes(id); } }, { get: (t, p) => (p in t ? t[p] : () => undefined) });
        let spots = [];
        try { spots = room.hotspots(pre) || []; } catch { continue; }
        for (const s of spots) {
          for (const item of [null, ...pre.inventory]) { preApi.selectedItem = item; try { s.onInteract(preApi); } catch { /* DOM path */ } }
        }
        for (const def of defs) {
          if (completed) break;
          try { const r = drivePuzzle(def, { answers, done: () => completed }); if (r.ok) how = r.how; } catch (e) { how = `driver error: ${e.message}`; }
        }
      }
    }
    out.push({ room: room.id, walked: true, completed, finale, how, clicked: [...new Set(clicked)] });
  }
  const picked = journal.filter(e => e.category === 'sun').map(e => ({ id: e.id, n: e.sun?.rays, letter: e.sun?.letter }));
  process.stdout.write(JSON.stringify({ rooms: out, picked }));
}

// --------------------------------------------------------------- parent mode
function main() {
  const only = process.argv.slice(2).find(a => !a.startsWith('--'));
  const games = only ? [only] : gamesWithRooms();
  let errors = 0, walked = 0, total = 0;
  const finales = [];
  const unwalked = [];
  for (const game of games) {
    const pooled = [];
    let complete = true;
    for (const { key, role } of rolesFor(game)) {
      const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), '--child', game, key || '', role || ''], { encoding: 'utf8' });
      const where = `${game}${role ? `[${role}]` : ''}`;
      if (r.status !== 0 || !r.stdout) { errors++; console.log(`ERROR ${where}: failed to load\n${r.stderr}`); continue; }
      const res = JSON.parse(r.stdout);
      for (const rm of res.rooms) {
        total++;
        if (!rm.walked) { unwalked.push(`${where}/${rm.room}`); if (!rm.finale) complete = false; continue; }
        walked++;
        if (!rm.completed) { errors++; console.log(`ERROR SOFTLOCK ${where}/${rm.room}  ${rm.finale ? 'the finale never finishes' : 'solved, but no way out'} (clicked: ${rm.clicked.join(', ') || 'nothing'})`); }
        else if (rm.finale) finales.push(`${where}/${rm.room}${rm.how ? ` — ${rm.how}` : ' — walked out'}`);
      }
      pooled.push(...res.picked.map(p => ({ ...p, role })));
    }
    if (pooled.length && !complete) {
      console.log(`--    SET      ${game}  not every room walked; collectibles seen so far: ${[...pooled].sort((a, b) => a.n - b.n).map(p => p.letter).join('')}`);
    } else if (pooled.length && pooled.every(p => p.n == null)) {
      const ids = pooled.map(p => p.id), dup = ids.filter((x, i) => ids.indexOf(x) !== i);
      if (dup.length) { errors++; console.log(`ERROR SET      ${game}  collected twice: ${dup.join(', ')}`); }
      else console.log(`ok    SET      ${game}  ${pooled.length} collectibles (unnumbered): ${pooled.map(p => p.letter).join(' ')}`);
    } else if (pooled.length) {
      const nums = pooled.map(p => p.n).filter(n => n != null).sort((a, b) => a - b);
      const dupes = nums.filter((n, i) => nums[i - 1] === n);
      // a run with an even step (1,2,3… or Deep Six's 5,8,11… fathoms)
      const min = Math.min(...nums), max = Math.max(...nums);
      const step = Math.min(...nums.slice(1).map((n, i) => n - nums[i]).filter(d => d > 0), Infinity);
      const missing = Number.isFinite(step) ? Array.from({ length: Math.round((max - min) / step) + 1 }, (_, i) => min + i * step).filter(n => !nums.includes(n)) : [];
      const word = [...pooled].sort((a, b) => a.n - b.n).map(p => p.letter).join('');
      if (dupes.length || missing.length) {
        errors++;
        console.log(`ERROR SET      ${game}  collectibles ${word}: ${missing.length ? `missing ${missing.join(',')}` : ''}${dupes.length ? ` duplicated ${dupes.join(',')}` : ''}`);
      } else {
        console.log(`ok    SET      ${game}  ${nums.length} collectibles, in order: ${word}`);
      }
    }
  }
  if (finales.length) console.log(`\nFinales finished:\n  ${finales.join('\n  ')}`);
  console.log(`\nWalked ${walked} of ${total} room views from their solved state` +
    (process.argv.includes('--verbose') && unwalked.length ? `; no solved state declared in:\n  ${unwalked.join('\n  ')}` : '.'));
  console.log(`${games.length} game(s): ${errors} error(s).`);
  process.exit(errors ? 1 : 0);
}

if (process.argv[2] === '--child') {
  const [, , , game, key, role] = process.argv;
  walkOne(game, key || null, role || null).catch(e => { console.error(e.stack); process.exit(1); });
} else {
  main();
}
