#!/usr/bin/env node
// Room layout + logic lint.
//
//   node tools/room-lint.mjs            lint every game, every role
//   node tools/room-lint.mjs wild-court lint one game
//
// Loads each game's room modules under Node (they only touch the DOM inside
// puzzle callbacks), renders scene(state) + hotspots(state) for the fresh state
// and for any `lintStates` a room exports, and checks:
//
//   GUS        a hotspot intrudes on the top-left 220x250 reserve zone   (error)
//   OOB        a hotspot leaves the 1600x900 frame                       (error)
//   DUP        two hotspots share an id                                  (error)
//   FLOAT      a large translucent card/panel is drawn with no mount —
//              i.e. not inside an element carrying data-mount (lighting
//              washes opt out with data-fx)                              (error)
//   SMALL      a hotspot under 60 scene units on a side                  (warn)
//   OVERLAP    two hotspots overlap by more than half the smaller one    (warn)
//   HINTS      a room doesn't ship exactly three hint tiers              (error)
//   TINYTEXT   scene text under 11 units after scaling (warn), under 9
//              (error) — about 5 px on a phone                           (warn/error)
//   HIDDEN     a hotspot lies wholly under a later one (the engine stacks
//              later hotspots on top), so it can never be clicked       (error)
//   ANSWER     the last hint tier doesn't state the room's answer        (warn)
//   SPOILER    the first hint tier gives the answer away                 (error)
//
// The answer comes from the room's own `solution` (a string, or a function of
// the role) when it has one, else from the answer constants in its source —
// ANSWER, MY_ANSWER, SOLUTION, MYCODE, MY_CODE, COMBO, CODE, WORD — picking the
// current role's entry when the constant is keyed by role.
//
// Exit code 1 when any error is found.

import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { answersFor, norm } from './room-answers.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUB = path.join(ROOT, 'public');

const GUS = { x: 0, y: 0, w: 220, h: 250 };

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

// ---------------------------------------------------------------- child mode
async function lintOne(game, roleKey, role) {
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
  const out = [];
  for (const room of rooms) {
    const states = [{ label: 'fresh', flags: {}, inventory: [] }, ...(room.lintStates || [])];
    const hintSets = [];
    for (const st of states) {
      const state = { currentRoom: 0, timeLeft: 3600, journal: [], hintsUsed: {}, started: true, flags: { ...(st.flags || {}) }, inventory: [...(st.inventory || [])] };
      const where = `${game}${role ? `[${role}]` : ''}/${room.id}${st.label === 'fresh' ? '' : `@${st.label}`}`;
      let spots = [];
      let svg = '';
      try { svg = room.scene(state); } catch (e) { out.push({ level: 'error', where, code: 'SCENE', msg: e.message }); }
      try { spots = room.hotspots(state) || []; } catch (e) { out.push({ level: 'error', where, code: 'SPOTS', msg: e.message }); }
      checkSpots(spots, where, out);
      checkFloating(svg, where, out);
      checkText(svg, where, out);
      if (st.label === 'fresh') checkHints(room, state, where, out);
      try { hintSets.push(typeof room.hints === 'function' ? room.hints(state) : room.hints); } catch { /* checked above */ }
    }
    const src = sources.find(t => t.includes(`id: '${room.id}'`)) || '';
    checkAnswer(room, hintSets, role, src, `${game}${role ? `[${role}]` : ''}/${room.id}`, out);
  }
  process.stdout.write(JSON.stringify(out));
}

const inter = (a, b) =>
  Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) *
  Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));

function checkSpots(spots, where, out) {
  const seen = new Set();
  for (const s of spots) {
    if (seen.has(s.id)) out.push({ level: 'error', where, code: 'DUP', msg: s.id });
    seen.add(s.id);
    if (inter(s, GUS) > 0) out.push({ level: 'error', where, code: 'GUS', msg: `${s.id} @${s.x},${s.y}` });
    if (s.x < 0 || s.y < 0 || s.x + s.w > 1600 || s.y + s.h > 900) out.push({ level: 'error', where, code: 'OOB', msg: s.id });
    if (s.w < 60 || s.h < 60) out.push({ level: 'warn', where, code: 'SMALL', msg: `${s.id} ${s.w}x${s.h}` });
  }
  for (let i = 0; i < spots.length; i++) {
    for (let j = i + 1; j < spots.length; j++) {
      const a = spots[i], b = spots[j];
      const o = inter(a, b), m = Math.min(a.w * a.h, b.w * b.h);
      if (a.w * a.h && o >= a.w * a.h) { out.push({ level: 'error', where, code: 'HIDDEN', msg: `${a.id} is wholly under ${b.id}` }); continue; }
      if (b.w * b.h && o >= b.w * b.h) continue; // a small thing deliberately set on top of a bigger one
      if (m && o > 0.5 * m) out.push({ level: 'warn', where, code: 'OVERLAP', msg: `${a.id}/${b.id} ${Math.round((100 * o) / m)}%` });
    }
  }
}

function alphaOf(attrs) {
  let a = 1;
  const op = /\sopacity="([\d.]+)"/.exec(attrs);
  if (op) a *= Number(op[1]);
  const fo = /fill-opacity="([\d.]+)"/.exec(attrs);
  if (fo) a *= Number(fo[1]);
  const rgba = /fill="rgba\([^)]*,\s*([\d.]+)\)"/.exec(attrs);
  if (rgba) a *= Number(rgba[1]);
  if (/fill="none"/.test(attrs)) a = 0;
  return a;
}

// A "floating card" is a big, see-through rectangle (the flat UI-panel look)
// that nothing in the scene holds up. Panels drawn by scenekit carry
// data-mount on their group, which is what marks them as attached.
function checkFloating(svg, where, out) {
  const tag = /<(\/?)([a-zA-Z][\w:-]*)([^>]*?)(\/?)>/g;
  const stack = [];
  let m;
  while ((m = tag.exec(svg))) {
    const [, close, name, attrs, selfClose] = m;
    if (close) { while (stack.length && stack.pop().name !== name); continue; }
    const mounted = /data-(mount|fx)="/.test(attrs) || stack.some(s => s.mounted);
    if (!selfClose) stack.push({ name, mounted });
    if (name !== 'rect' || mounted) continue;
    const w = Number(/\swidth="([\d.]+)"/.exec(attrs)?.[1] || 0);
    const h = Number(/\sheight="([\d.]+)"/.exec(attrs)?.[1] || 0);
    if (w >= 1500 && h >= 800) continue; // full-frame tints are lighting, not panels
    if (w < 150 || h < 70) continue;
    const a = alphaOf(attrs);
    if (a > 0.05 && a < 0.95) {
      const x = /\sx="([\d.-]+)"/.exec(attrs)?.[1], y = /\sy="([\d.-]+)"/.exec(attrs)?.[1];
      out.push({ level: 'error', where, code: 'FLOAT', msg: `translucent ${w}x${h} panel at ${x},${y}` });
    }
  }
}

// Scene text is drawn in 1600-wide scene units; on a phone the frame is about
// 800 px across, so 1 unit is ~0.5 px. Text that ends up under 11 units (after
// any scale() it sits inside) is too small to read there; under 9 is
// unreadable anywhere. The docked kit is exempt: it is a thumbnail of a card
// that opens full-size when clicked.
const TEXT_WARN = 11, TEXT_ERROR = 9;
function checkText(svg, where, out) {
  const tag = /<(\/?)([a-zA-Z][\w:-]*)([^>]*?)(\/?)>/g;
  const stack = [{ name: 'root', scale: 1, size: 16, hud: false }];
  const small = [];
  let m;
  while ((m = tag.exec(svg))) {
    const [, close, name, attrs, selfClose] = m;
    if (close) { while (stack.length > 1 && stack.pop().name !== name); continue; }
    const top = stack[stack.length - 1];
    const sc = /\bscale\(([\d.]+)/.exec(/\stransform="([^"]*)"/.exec(attrs)?.[1] || '')?.[1];
    const fs = /\sfont-size="([\d.]+)"/.exec(attrs)?.[1];
    const frame = { name, scale: top.scale * (sc ? Number(sc) : 1), size: fs ? Number(fs) : top.size, hud: top.hud || /data-mount="hud"/.test(attrs) };
    // the docked kit is a thumbnail: clicking it opens the full card at size
    if (name === 'text' && !frame.hud && !/data-fx="/.test(attrs)) {
      const eff = frame.size * frame.scale;
      const body = svg.slice(tag.lastIndex, svg.indexOf('</text>', tag.lastIndex)).replace(/<[^>]+>/g, '').trim();
      if (eff > 0 && eff < TEXT_WARN && body) small.push({ eff, body: body.slice(0, 28) }); // size 0 = deliberately hidden
    }
    if (!selfClose) stack.push(frame);
  }
  for (const t of small) {
    out.push({ level: t.eff < TEXT_ERROR ? 'error' : 'warn', where, code: 'TINYTEXT', msg: `${t.eff.toFixed(1)}u "${t.body}"` });
  }
}

function checkHints(room, state, where, out) {
  let hints = room.hints;
  try { if (typeof hints === 'function') hints = hints(state); } catch { return; }
  if (!Array.isArray(hints) || hints.length !== 3) out.push({ level: 'error', where, code: 'HINTS', msg: `${Array.isArray(hints) ? hints.length : typeof hints} tiers` });
}

// An answer counts as stated when it appears in the hint: digit answers by
// their digits in order ("3-7-1" states 371); word answers as whole words or a
// phrase ("tree-frog", "HOLD" but not inside "holds"), or spelled out
// letter by letter ("C-E-A-D-B-C").
function states(hintText, ans) {
  const words = ` ${hintText.toUpperCase().replace(/[^A-Z0-9]+/g, ' ')} `;
  const a = norm(ans);
  if (/[A-Z]/.test(a)) {
    const phrase = String(ans).toUpperCase().replace(/[^A-Z0-9]+/g, ' ').trim();
    return words.includes(` ${phrase} `) || words.includes(` ${a.split('').join(' ')} `);
  }
  return norm(hintText).includes(a);
}

/** Across every state the room declares: some last tier states each answer; no first tier does. */
function checkAnswer(room, hintSets, role, src, where, out) {
  const sets = hintSets.filter(h => Array.isArray(h) && h.length >= 3);
  if (!sets.length) return;
  const text = (h, i) => (typeof h[i] === 'string' ? h[i] : h[i]?.text || '');
  const answers = answersFor(room, role, src);
  out.push({ level: 'info', where, code: answers.length ? 'CHECKED' : 'NOANSWER', msg: '' });
  for (const ans of answers) {
    if (!sets.some(h => states(text(h, 2), ans))) out.push({ level: 'warn', where, code: 'ANSWER', msg: `last hint never states "${ans}"` });
    if (norm(ans).length >= 3 && sets.some(h => states(text(h, 0), ans))) out.push({ level: 'error', where, code: 'SPOILER', msg: `first hint gives away "${ans}"` });
  }
}

// --------------------------------------------------------------- parent mode
function main() {
  const only = process.argv.slice(2).find(a => !a.startsWith('--'));
  const games = only ? [only] : gamesWithRooms();
  const verbose = process.argv.includes('--verbose');
  let errors = 0, warns = 0, checked = 0, tiny = 0;
  const unchecked = [];
  for (const game of games) {
    for (const { key, role } of rolesFor(game)) {
      const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), '--child', game, key || '', role || ''], { encoding: 'utf8' });
      if (r.status !== 0 || !r.stdout) {
        errors++;
        console.log(`ERROR ${game}${role ? `[${role}]` : ''}: failed to load\n${r.stderr}`);
        continue;
      }
      const issues = JSON.parse(r.stdout);
      for (const i of issues.filter(x => x.level === 'info')) {
        if (i.code === 'CHECKED') checked++; else unchecked.push(i.where);
      }
      for (const i of issues.filter(x => x.level !== 'info')) {
        if (i.level === 'error') errors++; else warns++;
        // small-but-legible labels are many and minor: count them unless asked
        if (i.code === 'TINYTEXT' && i.level === 'warn' && !verbose) { tiny++; continue; }
        console.log(`${i.level === 'error' ? 'ERROR' : 'warn '} ${i.code.padEnd(7)} ${i.where}  ${i.msg}`);
      }
    }
  }
  console.log(`\nAnswers cross-checked against hints in ${checked} of ${checked + unchecked.length} room views` +
    (verbose && unchecked.length ? `; no declared answer in:\n  ${unchecked.join('\n  ')}` : '.'));
  if (tiny) console.log(`${tiny} labels between 9 and 11 units (legible on desktop, small on a phone); --verbose lists them.`);
  console.log(`${games.length} game(s) checked: ${errors} error(s), ${warns} warning(s).`);
  process.exit(errors ? 1 : 0);
}

if (process.argv[2] === '--child') {
  const [, , , game, key, role] = process.argv;
  lintOne(game, key || null, role || null).catch(e => { console.error(e.stack); process.exit(1); });
} else {
  main();
}
