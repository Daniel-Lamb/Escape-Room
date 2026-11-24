#!/usr/bin/env node
// Touch hit areas (shared/js/hit-area.js), over every game, role, room and
// declared state: a small hotspot's grown touch area must never meet another
// hotspot's area (unless the two overlap by design), enter Gus's corner, or
// leave the scene. Also reports how much bigger the small hotspots get.
//
//   node tools/touch-check.mjs        (npm run check:touch)
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const PUB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public');
const { touchGrowth, grown, SMALL, GUS_ZONE } = await import(pathToFileURL(path.join(PUB, 'shared/js/hit-area.js')).href);
const GAMES = { 'pilgrims-road': null, 'starfall-station': null, 'wild-court': null, 'gate-of-life': null, 'tomb-of-the-scarab': null,
  'signal-towers': ['signal-towers-role', 2], 'looking-glass': ['looking-glass-role', 2], 'silent-alarm': ['silent-alarm-role', 2],
  'deep-six': ['deep-six-role', 2], 'the-vault': ['the-vault-role', 4], 'trial-by-jury': ['trial-by-jury-role', 4] };
const store = new Map();
globalThis.localStorage = { getItem: k => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: k => store.delete(k) };
const meets = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
const errors = [];
let views = 0, small = 0, helped = 0;
const before = [], after = [];
for (const [game, rk] of Object.entries(GAMES)) {
  for (const role of rk ? Array.from({ length: rk[1] }, (_, i) => `p${i + 1}`) : [null]) {
    if (rk) store.set(rk[0], role);
    const rooms = (await import(pathToFileURL(path.join(PUB, game, 'js/rooms/index.js')).href + `?r=${role}`)).default;
    for (const room of rooms) for (const st of [{ label: 'fresh' }, ...(room.lintStates || [])]) {
      const state = { currentRoom: 0, timeLeft: 3600, hintsUsed: {}, started: true, flags: { ...(st.flags || {}) }, inventory: [...(st.inventory || [])], journal: (st.journal || []).map(id => ({ id })) };
      let spots; try { spots = room.hotspots(state) || []; } catch { continue; }
      const g = touchGrowth(spots);
      const areas = spots.map((s, i) => grown(s, g[i]));
      const where = `${game}${role ? ' ' + role : ''} ${room.id}@${st.label}`;
      spots.forEach((s, i) => {
        views++;
        const a = areas[i];
        if (a.x < 0 || a.y < 0 || a.x + a.w > 1600 || a.y + a.h > 900) errors.push(`${where}: ${s.id} grows off the scene`);
        if (meets(a, GUS_ZONE) && !meets(s, GUS_ZONE)) errors.push(`${where}: ${s.id} grows into Gus's corner`);
        spots.forEach((o, j) => { if (j > i && !meets(s, o) && meets(a, areas[j])) errors.push(`${where}: ${s.id} and ${o.id} touch areas meet`); });
        if (Math.min(s.w, s.h) < SMALL) {
          small++;
          const grew = g[i].l + g[i].r + g[i].t + g[i].b > 0;
          if (grew) helped++;
          before.push(Math.min(s.w, s.h)); after.push(Math.min(a.w, a.h));
        }
      });
    }
  }
}
const q = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return Math.round(s[Math.floor(p * (s.length - 1))]); };
console.log(`hotspot views ${views}; small ${small}; given a bigger touch area ${helped}`);
console.log(`small hotspots' short side (scene units) — before: min ${q(before, 0)}, median ${q(before, 0.5)}; after: min ${q(after, 0)}, median ${q(after, 0.5)}`);
console.log(`at a phone held sideways (x0.2875): median ${Math.round(q(before, 0.5) * 0.2875)}px -> ${Math.round(q(after, 0.5) * 0.2875)}px`);
console.log(`errors: ${errors.length}`);
for (const e of [...new Set(errors)].slice(0, 20)) console.log('  ' + e);
process.exitCode = errors.length ? 1 : 0;
