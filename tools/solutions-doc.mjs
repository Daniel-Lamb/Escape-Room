#!/usr/bin/env node
// Writes docs/SOLUTIONS.md from the room code, so the solutions can't drift
// from the puzzles again.
//
//   node tools/solutions-doc.mjs           (npm run docs:solutions)
//
// For every game, role and room it takes the room's hint ladder — every phase
// the room declares (fresh, plus each `lintStates` entry): the middle tier is
// the logic, the last tier the answer (room-lint checks that last tier against
// the room's own answer constants). It adds the collectible each role picks up
// in each room, and the order the pooled collectibles spell at the finale
// (from room-walk).

import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUB = path.join(ROOT, 'public');

// Series order, with the names the dashboard uses.
const GAMES = [
  ['pilgrims-road', "The Pilgrim's Road"],
  ['starfall-station', 'Starfall Station'],
  ['wild-court', 'The Wild Court'],
  ['gate-of-life', 'The Gate of Life'],
  ['tomb-of-the-scarab', 'The Tomb of the Scarab'],
  ['signal-towers', 'Twin Signal Towers'],
  ['looking-glass', 'The Looking Glass'],
  ['silent-alarm', 'Silent Alarm'],
  ['deep-six', 'Deep Six'],
  ['the-vault', 'The Vault'],
  ['trial-by-jury', 'Trial by Jury'],
];

function rolesFor(game) {
  const rolePath = path.join(PUB, game, 'js/role.js');
  if (!existsSync(rolePath)) return [{ key: null, role: null }];
  const src = readFileSync(rolePath, 'utf8');
  const key = /ROLE_KEY\s*=\s*'([^']+)'/.exec(src)?.[1];
  const roles = src.includes("p4:") ? ['p1', 'p2', 'p3', 'p4'] : ['p1', 'p2'];
  return roles.map(role => ({ key, role }));
}

// ---------------------------------------------------------------- child mode
async function readGame(game, roleKey, role) {
  const store = new Map();
  if (roleKey && role) store.set(roleKey, role);
  globalThis.localStorage = { getItem: k => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: k => store.delete(k) };
  const roleMod = role ? await import(pathToFileURL(path.join(PUB, game, 'js/role.js')).href) : {};
  const roleName = ['towerName', 'sideName', 'roleName', 'crewName', 'jurorName', 'stationName', 'ownName']
    .map(f => roleMod[f]).find(f => typeof f === 'function');
  const rooms = (await import(pathToFileURL(path.join(PUB, game, 'js/rooms/index.js')).href)).default;
  const text = h => (typeof h === 'string' ? h : h?.text || '');
  const out = [];
  for (const room of rooms) {
    const states = [{ flags: {}, inventory: [] }, ...(room.lintStates || [])];
    const phases = [];
    for (const st of states) {
      const state = { currentRoom: 0, timeLeft: 3600, journal: [], hintsUsed: {}, started: true, flags: { ...(st.flags || {}) }, inventory: [...(st.inventory || [])] };
      let hints;
      try { hints = typeof room.hints === 'function' ? room.hints(state) : room.hints; } catch { continue; }
      if (!Array.isArray(hints) || hints.length < 3) continue;
      const ph = { logic: text(hints[1]), answer: text(hints[2]) };
      if (!phases.some(p => p.answer === ph.answer)) phases.push(ph);
    }
    // the collectible this role can pick up here (clicking around the fresh room)
    const state = { flags: {}, inventory: [], journal: [], hintsUsed: {} };
    const stub = new Proxy({
      get state() { return state; },
      journal: { add(id, e) { if (!state.journal.some(x => x.id === id)) state.journal.push({ id, ...e }); }, has: id => state.journal.some(e => e.id === id) },
      hasItem: () => false, getFlag: k => state.flags[k], setFlag(k, v = true) { state.flags[k] = v; },
    }, { get: (t, p) => (p in t ? t[p] : () => undefined) });
    try { for (const s of room.hotspots(state) || []) { try { s.onInteract(stub); } catch { /* DOM path */ } } } catch { /* no spots */ }
    const picks = state.journal.filter(e => e.category === 'sun').map(e => ({ n: e.sun?.rays, letter: e.sun?.letter }));
    let title = room.title;
    try { if (typeof title === 'function') title = title(state); } catch { title = room.id; }
    out.push({ id: room.id, title: String(title || room.id), phases, picks });
  }
  process.stdout.write(JSON.stringify({ roleName: roleName ? roleName() : null, rooms: out }));
}

// --------------------------------------------------------------- parent mode
function child(args) {
  const r = spawnSync(process.execPath, args, { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`${args.join(' ')}\n${r.stderr}`);
  return r.stdout;
}

function main() {
  const walk = child([path.join(ROOT, 'tools/room-walk.mjs')]);
  const order = Object.fromEntries([...walk.matchAll(/^ok\s+SET\s+(\S+)\s+\d+ collectibles( \(unnumbered\))?(?:, in order)?: (.+)$/gm)]
    .map(m => [m[1], { unnumbered: !!m[2], letters: m[3].trim().replace(/ /g, '').split('') }]));
  const lines = [
    '# Escape Room Series — Puzzle Logic & Solutions',
    '',
    'Full spoilers. **Generated from the room code** by `npm run docs:solutions`',
    '(`tools/solutions-doc.mjs`) — edit the rooms, not this file. For each room: the',
    'logic (the second hint tier) and the answer (the third tier, which `npm run',
    'lint:rooms` checks against the answer the room\'s own code accepts). In the duo and',
    'group games each role has its own ladder: one player holds the data, the other the rule.',
    '',
    'Every game ends on a meta-puzzle built from the collectibles found along the way; the',
    'order they spell is checked end to end by `npm run walk:rooms`.',
    '',
  ];
  GAMES.forEach(([game, name], gi) => {
    const roles = rolesFor(game);
    const runs = roles.map(({ key, role }) => ({ role, ...JSON.parse(child([fileURLToPath(import.meta.url), '--child', game, key || '', role || ''])) }));
    const mode = roles.length === 1 ? 'single-player' : roles.length === 2 ? 'two-player' : `${roles.length}-player`;
    lines.push('---', '', `## ${gi + 1}. ${name} (${mode}, ${runs[0].rooms.length} rooms)`, '');
    if (roles.length > 1) lines.push(`Roles: ${runs.map(r => `${r.roleName || r.role} = ${r.role.toUpperCase()}`).join(' · ')}.`, '');
    runs[0].rooms.forEach((room, ri) => {
      const title = room.title.replace(/^[^·]*·\s*/, '');
      lines.push(`**${ri + 1}. ${title}**`, '');
      for (const run of runs) {
        const r = run.rooms[ri];
        const who = roles.length > 1 ? `*${run.roleName || run.role}:* ` : '';
        r.phases.forEach((p, pi) => {
          const step = r.phases.length > 1 ? `(${pi + 1}) ` : '';
          lines.push(`- ${who}${step}${p.logic} → **${p.answer}**`);
        });
        for (const k of r.picks) lines.push(`- ${who}Collectible: **${k.letter}**${k.n != null ? ` (${k.n})` : ''}`);
      }
      lines.push('');
    });
    const o = order[game];
    if (o) lines.push(o.unnumbered
      ? `**Collectibles pooled across the game** (unnumbered): ${o.letters.join(', ')} — the finale's entry above says how they are read.`
      : `**Collectibles pooled across the game, by number:** ${o.letters.join(' ')} — the finale's entry above says how they are read.`, '');
  });
  writeFileSync(path.join(ROOT, 'docs/SOLUTIONS.md'), lines.join('\n'));
  console.log(`docs/SOLUTIONS.md written: ${GAMES.length} games.`);
}

if (process.argv[2] === '--child') {
  const [, , , game, key, role] = process.argv;
  readGame(game, key || null, role || null).catch(e => { console.error(e.stack); process.exit(1); });
} else {
  main();
}
