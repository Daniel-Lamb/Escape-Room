// DECK 2 — Hydroponics Ring.
// Puzzle: rotate seized pipe tiles (clockwise only) to route nutrient flow
// from the inlet (mid-left) to the return (mid-right). Live connectivity
// check; loop fills green on success and the grow racks bloom.

import { registerItems } from '../../../shared/js/items.js';
import { kitDefs, panel, shadow } from '../../../shared/js/scenekit.js';

registerItems({
  uv_lamp: {
    name: 'UV Grow-Lamp',
    description: 'A hand-length blacklight tube, warm from the rack. Makes the invisible embarrassing.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="20" width="32" height="9" rx="4.5" fill="#3a2a5f" stroke="#7a5fd0" stroke-width="2"/>
      <rect x="4" y="19" width="6" height="11" rx="2" fill="#39485a"/>
      <rect x="38" y="19" width="6" height="11" rx="2" fill="#39485a"/>
      <g stroke="#a88fff" stroke-width="1.6" opacity="0.8">
        <line x1="14" y1="14" x2="14" y2="9"/><line x1="24" y1="13" x2="24" y2="7"/><line x1="34" y1="14" x2="34" y2="9"/>
      </g>
    </svg>`,
  },
});

// ---- pipe grid definition (see docs/DESIGN-STARFALL.md) ----
// dirs: 0=N 1=E 2=S 3=W. straight base ports [0,2]; elbow base ports [0,1].
// grid[row][col] = { t: 'S'|'L', need: rot for solution path, or null for decoy }
const GRID = [
  [{ t: 'L', need: null }, { t: 'L', need: 1 }, { t: 'S', need: 1 }, { t: 'L', need: 2 }],
  [{ t: 'S', need: 1 },    { t: 'L', need: 3 }, { t: 'S', need: null }, { t: 'L', need: 0 }],
  [{ t: 'L', need: null }, { t: 'S', need: null }, { t: 'L', need: null }, { t: 'S', need: null }],
];
const ROWS = 3, COLS = 4;
const SHEARED = { r: 1, c: 2 };            // the centre coupling the service note warns about

// Layout — read off the plate (art/hydroponics.webp). Shared with hotspots().
const RACK_L = { x: 0, y: 40, w: 440, h: 700, tiers: [220, 470, 700] };
const RACK_R = { x: 1200, y: 226, w: 340, h: 330, tiers: [330, 430, 540] };
const LAMP = { x: 110, y: 300, w: 260 };
const TANK = { x: 800, y: 340, w: 104, h: 270 };
const PIPE = { x: 586, y: 450, w: 168, h: 180 };
const NOTE = { x: 594, y: 268, w: 150, h: 92 };
const IRIS = { cx: 1066, cy: 338, r: 92 };
const R = {
  racks:  { x: 230, y: 360, w: 210, h: 380 },
  racksR: { x: 1200, y: 230, w: 340, h: 320 },
  shard2: { x: TANK.x + 20, y: TANK.y - 44, w: 64, h: 70 },
  pipes:  { x: PIPE.x - 6, y: PIPE.y - 6, w: PIPE.w + 12, h: PIPE.h + 12 },
  note:   { x: NOTE.x - 4, y: NOTE.y - 6, w: NOTE.w + 8, h: NOTE.h + 12 },
  lamp:   { x: LAMP.x, y: LAMP.y - 24, w: LAMP.w, h: 70 },
  iris:   { x: IRIS.cx - 110, y: IRIS.cy - 110, w: 220, h: 220 },
};
const INLET = { r: 1, c: 0, enter: 3 };   // flow enters (1,0) from the west
const OUTLET = { r: 1, c: 3, exit: 1 };   // must leave (1,3) to the east

function ports(tile, rot) {
  const base = tile.t === 'S' ? [0, 2] : [0, 1];
  return base.map(p => (p + rot) % 4);
}

// trace the flow; returns { solved, path:Set("r,c") }
function trace(rots) {
  const path = new Set();
  let r = INLET.r, c = INLET.c, enter = INLET.enter;
  for (let steps = 0; steps < ROWS * COLS + 1; steps++) {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return { solved: false, path };
    const tile = GRID[r][c];
    const p = ports(tile, rots[r][c]);
    if (!p.includes(enter)) return { solved: false, path };
    path.add(`${r},${c}`);
    const exit = p.find(d => d !== enter);
    if (r === OUTLET.r && c === OUTLET.c && exit === OUTLET.exit) return { solved: true, path };
    // move to next tile
    if (exit === 0) { r -= 1; enter = 2; }
    else if (exit === 1) { c += 1; enter = 3; }
    else if (exit === 2) { r += 1; enter = 0; }
    else { c -= 1; enter = 1; }
  }
  return { solved: false, path };
}

export default {
  id: 'hydroponics',
  solution: () => {
    // the route the tiles' own correct turns make (the lint flags it if they no longer reach the outlet)
    const { solved, path } = trace(GRID.map(row => row.map(t => t.need ?? 0)));
    if (!solved) return ['the needed turns do not reach the outlet'];
    const cells = [...path].map(k => k.split(',').map(Number));
    const words = new Set(cells.slice(1).map(([r, c], i) => (r < cells[i][0] ? 'up' : r > cells[i][0] ? 'down' : c > cells[i][1] ? 'right' : 'left')));
    return [...words];
  },
  lintStates: [{ label: 'flowing', flags: { hydro_flow: true } }],
  title: 'Hydroponics Ring',
  intro: 'The ring section curves away in both directions, racked floor to ceiling with dead brown rows. It smells of old soil and older regret. "The nutrient loop froze during the evac," says Gus. "Fix the flow and this deck will forgive us. Plants are quick to forgive. It\'s one of their best features."',

  scene(state) {
    const flow = !!state.flags.hydro_flow;
    const lampHere = flow && !state.flags.hydro_lampTaken;

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${kitDefs()}
        <linearGradient id="gd_hy_wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#101a16"/>
          <stop offset="1" stop-color="#18261f"/>
        </linearGradient>
        <radialGradient id="gd_hy_glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(122,95,208,0.4)"/>
          <stop offset="1" stop-color="rgba(122,95,208,0)"/>
        </radialGradient>
        <radialGradient id="gd_hy_bloom" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(123,196,127,0.35)"/>
          <stop offset="1" stop-color="rgba(123,196,127,0)"/>
        </radialGradient>
      </defs>

      <!-- background plate: grow racks on both walls, the valve bulkhead (left of centre) and the
           round vault iris at the end of the corridor. Everything below sits on those. -->
      <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="art/hydroponics.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="art/hydroponics.mp4" type="video/mp4"/></video></foreignObject>

      <!-- the painted racks: withered brown while the loop is dead, green and glowing once it flows -->
      ${[RACK_L, RACK_R].map(r => flow
        ? `<ellipse cx="${r.x + r.w / 2}" cy="${r.y + r.h / 2}" rx="${r.w * 0.7}" ry="${r.h * 0.6}" fill="url(#gd_hy_bloom)" class="glow"/>
           ${r.tiers.map(y => `<g>${Array.from({ length: 6 }, (_, k) => `<path d="M${r.x + 30 + k * (r.w - 60) / 5} ${y} q6 -22 0 -30 M${r.x + 30 + k * (r.w - 60) / 5} ${y} q-8 -16 2 -26" stroke="#7bc47f" stroke-width="3.5" fill="none" stroke-linecap="round"/>`).join('')}</g>`).join('')}`
        : `<g data-fx="tint"><rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="#3a2a12" opacity="0.45" style="mix-blend-mode:color"/>
           <rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="#05070a" opacity="0.25"/></g>`).join('')}

      <!-- the UV grow-tube, clipped under the second tier of the left rack -->
      ${lampHere ? `
        <g class="beckon" data-mount="bracket">
          <ellipse cx="${LAMP.x + LAMP.w / 2}" cy="${LAMP.y + 26}" rx="${LAMP.w * 0.6}" ry="36" fill="url(#gd_hy_glow)"/>
          <rect x="${LAMP.x}" y="${LAMP.y}" width="${LAMP.w}" height="12" rx="6" fill="#3a2a5f" stroke="#7a5fd0" stroke-width="2.5"/>
          ${[LAMP.x + 20, LAMP.x + LAMP.w - 20].map(x => `<rect x="${x - 5}" y="${LAMP.y - 10}" width="10" height="12" fill="#5c6675"/>`).join('')}
        </g>` : ''}

      <!-- nutrient tank (photoreal), standing on the deck against the left wall, shard on its cap -->
      <g data-mount="floor">
        ${shadow(TANK.x + TANK.w / 2, TANK.y + TANK.h, TANK.w * 0.62, 12)}
        <image href="art/hydro-tank.webp" x="${TANK.x}" y="${TANK.y}" width="${TANK.w}" height="${TANK.h}" preserveAspectRatio="xMidYMax meet"/>
        <rect x="${TANK.x + TANK.w / 2 - 15}" y="${TANK.y - 30}" width="30" height="40" rx="6" fill="#0d1720" stroke="#2f9e97" stroke-width="2" class="beckon"/>
        <text x="${TANK.x + TANK.w / 2}" y="${TANK.y - 3}" text-anchor="middle" font-size="15" fill="#4fd8d0">▮</text>
        <text x="${TANK.x + TANK.w / 2}" y="${TANK.y + TANK.h + 22}" text-anchor="middle" font-size="11" fill="#8fa3b8" font-family="Consolas, monospace" paint-order="stroke" stroke="#04070d" stroke-width="3">NUTRIENT RESERVE</text>
      </g>

      <!-- the junction access hatch, bolted to the painted valve bulkhead under its wheel -->
      ${panel({ ...PIPE, material: 'steel', mount: 'bolts', rx: 8, body: `
        <rect x="${PIPE.x + 14}" y="${PIPE.y + 14}" width="${PIPE.w - 28}" height="${PIPE.h - 60}" rx="6" fill="#141f18" stroke="${flow ? '#7bc47f' : '#ffb45e'}" stroke-width="3" class="${flow ? '' : 'beckon'}"/>
        <g stroke="${flow ? '#7bc47f' : '#39485a'}" stroke-width="8" fill="none" transform="translate(${PIPE.x - 1000} ${PIPE.y - 380})">
          <path d="M1018 420 L1062 420 L1062 470 L1122 470"/>
          <path d="M1018 520 L1050 520 L1050 492"/>
        </g>
        <text x="${PIPE.x + PIPE.w / 2}" y="${PIPE.y + PIPE.h - 26}" text-anchor="middle" font-size="11" fill="${flow ? '#7bc47f' : '#ffb45e'}"
          font-family="Consolas, monospace">${flow ? 'LOOP: CLOSED ✓' : 'LOOP: BROKEN'}</text>` })}

      <!-- the service note, taped to the bulkhead above the hatch -->
      ${panel({ ...NOTE, material: 'paper', mount: 'pinned', tilt: 3, body: `
        <g font-family="Consolas, monospace" fill="#26221a" transform="rotate(3 ${NOTE.x + NOTE.w / 2} ${NOTE.y + NOTE.h / 2})">
          <text x="${NOTE.x + 10}" y="${NOTE.y + 24}" font-size="11" font-weight="bold">SVC NOTE · JCT 2-B</text>
          <text x="${NOTE.x + 10}" y="${NOTE.y + 42}" font-size="11.5">centre coupling</text>
          <text x="${NOTE.x + 10}" y="${NOTE.y + 58}" font-size="11.5">SHEARED in evac.</text>
          <text x="${NOTE.x + 10}" y="${NOTE.y + 75}" font-size="11.5">route OVER it.</text>
        </g>` })}

      <!-- the vault iris at the corridor's end (painted), with its blades drawn closed or open -->
      <g data-mount="wall">
        ${flow
          ? `<circle cx="${IRIS.cx}" cy="${IRIS.cy}" r="${IRIS.r * 0.6}" fill="#04070d" stroke="rgba(79,216,208,0.45)" stroke-width="3"/>`
          : `<g opacity="0.85">${[0, 60, 120, 180, 240, 300].map(a => `<path d="M${IRIS.cx} ${IRIS.cy} L${IRIS.cx + IRIS.r * Math.cos(a * Math.PI / 180)} ${IRIS.cy + IRIS.r * Math.sin(a * Math.PI / 180)}" stroke="#1a2a20" stroke-width="18"/>`).join('')}</g>
             <circle cx="${IRIS.cx}" cy="${IRIS.cy}" r="12" fill="#ffb45e" opacity="0.7" class="beckon"/>`}
      </g>

      <path d="M0 900 L0 860 Q800 905 1600 860 L1600 900 Z" fill="#04070d"/>
    </svg>`;
  },

  hotspots(state) {
    const flow = !!state.flags.hydro_flow;
    const spots = [];

    spots.push({
      id: 'racks', plate: 'the grow racks', ...R.racks, label: flow ? 'The racks (blooming)' : 'Dead grow racks',
      onInteract(game) {
        game.say(flow
          ? 'Green is happening at speed. Bioluminescent algae climb the drip lines like they have somewhere to be. The ring smells alive.'
          : 'Row after row of freeze-dried salad. Someone laughed here once about growing tomatoes in orbit. The memory arrives without your permission.');
      },
    });

    spots.push({
      id: 'racksR', plate: 'the far grow racks', ...R.racksR, label: flow ? 'The far racks (blooming)' : 'The far racks',
      onInteract(game) {
        game.say(flow
          ? 'The far racks have caught up: leaf on leaf, a green you can smell.'
          : 'Brown, brittle, waiting. A drip line hangs dry above every tray.');
      },
    });

    spots.push({
      id: 'note', ...R.note, label: 'Service note',
      onInteract(game) {
        const html = `<div class="datapad"><div class="pad-title">Service note · Junction 2-B</div>
          Centre coupling <span class="pad-bad">SHEARED</span> during evacuation.<br>
          Flow cannot pass the middle of the junction — <strong>route over it</strong>.<br>
          <span style="opacity:0.7">Valves seized: clockwise only. — J.O.</span></div>`;
        game.journal.add('note_hydro_svc', { title: 'Service note (Hydroponics)', category: 'note', html });
        game.dialog({ title: 'Taped to the Bulkhead', html });
      },
    });

    spots.push({
      id: 'shard2', ...R.shard2, label: 'A shard on the tank',
      onInteract(game) {
        game.journal.add('shard2', { title: 'Hydroponics — the nutrient tank', category: 'sun', sun: { rays: 3, letter: 'A' } });
        game.say('A memory shard, tucked above the waterline: —green rows under grow-lights; someone laughing about tomatoes in orbit— You put it away carefully, like it might bruise.');
      },
    });

    spots.push({
      id: 'pipes', ...R.pipes, label: flow ? 'Pipe access (flowing)' : 'Pipe access panel',
      onInteract(game) {
        if (flow) { game.say('The loop hums, closed and content. Somewhere a pump is having the best day of its year.'); return; }
        openPipePuzzle(game);
      },
    });

    if (flow && !state.flags.hydro_lampTaken) {
      spots.push({
        id: 'lamp', ...R.lamp, label: 'UV grow-lamp',
        onInteract(game) {
          game.setFlag('hydro_lampTaken');
          game.addItem('uv_lamp', { from: { x: LAMP.x + LAMP.w / 2, y: LAMP.y } });
          game.say('You unclip a UV tube from the rack. The algae will share. Blacklight has other talents — fingerprints, for instance, glow like confessions.');
          game.refreshScene();
        },
      });
    }

    spots.push({
      id: 'iris', ...R.iris, label: flow ? 'Iris door — open' : 'Iris door — sealed',
      onInteract(game) {
        if (!flow) { game.say('The iris door stays clenched. Its interlock is plumbed straight into the nutrient loop — no flow, no thoroughfare. Stations have opinions about dead decks.'); return; }
        if (!state.flags.hydro_lampTaken) { game.say('Gus bumps your shoulder, gently, like a cat made of bolts: "The grow-lamp. Take it. Where we are going, there are things only blacklight will admit to."'); return; }
        if (!game.journal.has('shard2')) { game.say('"Shard on the tank," says Gus, not moving. "Please. They matter more than you currently understand."'); return; }
        game.say('The iris spirals open and the corridor beyond breathes crew-quarters air: dust, coffee ghosts, someone\'s abandoned cologne.');
        game.completeRoom({ delay: 700 });
      },
    });

    return spots;
  },

  hints: [
    { text: 'Water wants one unbroken road from the inlet valve to the return. Read the service note taped above the access hatch before you start turning things.', cost: 60 },
    { text: 'The valves are seized — every tile turns CLOCKWISE only. Plan each tile\'s final facing before you spin past it; a straight has two useful facings, an elbow four.', cost: 120 },
    { text: 'Route the middle row up and over the blocked center: right from the inlet, up at the second column, across the top, down at the far corner, out. Turn each tile until the highlighted flow reaches the return.', cost: 240 },
  ],
};

/* ---------------- the pipe junction ---------------- */

function pipePath(tile, rot, x, y, sz) {
  const half = sz / 2;
  const cx = x + half, cy = y + half;
  const pt = (d) => d === 0 ? [cx, y] : d === 1 ? [x + sz, cy] : d === 2 ? [cx, y + sz] : [x, cy];
  const p = ports(tile, rot);
  const [ax, ay] = pt(p[0]);
  const [bx, by] = pt(p[1]);
  if (tile.t === 'S') return `M${ax} ${ay} L${bx} ${by}`;
  return `M${ax} ${ay} L${cx} ${cy} L${bx} ${by}`;
}

function openPipePuzzle(game) {
  // restore persisted rotations or scramble (path tiles start 2 turns off)
  const rots = GRID.map((row, r) => row.map((tile, c) => {
    const saved = game.getFlag(`hydro_r${r}${c}`);
    if (saved !== undefined) return saved;
    if (tile.need !== null) return (tile.need + 2) % 4;
    return (r + c) % 4;
  }));

  game.openPuzzle({
    id: 'hydro_pipes',
    title: 'Nutrient Loop Junction',
    wide: true,
    render(body, api) {
      const SZ = 86, GAP = 8;
      body.innerHTML = `
        <div class="puzzle-hero" style="background-image:url(art/pz-junction.webp)"></div>
        <p class="puzzle-desc">The junction grid, frozen mid-evacuation. Flow enters at the
        <strong style="color:#4fd8d0;">left valve</strong> and must reach the
        <strong style="color:#7bc47f;">right return</strong>. The valves are seized:
        every tile rotates <strong>clockwise only</strong>. Click a tile to turn it.</p>
        <div style="display:flex; justify-content:center;">
          <svg id="hy-grid" viewBox="-40 0 ${COLS * (SZ + GAP) + 72} ${ROWS * (SZ + GAP)}"
               style="width:min(70vw,460px); height:auto;"></svg>
        </div>
        <div class="puzzle-feedback"></div>`;

      const svg = body.querySelector('#hy-grid');

      function paint() {
        const { solved, path } = trace(rots);
        let out = `
          <path d="M-36 ${(SZ + GAP) + SZ / 2} L0 ${(SZ + GAP) + SZ / 2}" stroke="#4fd8d0" stroke-width="12" stroke-linecap="round"/>
          <path d="M${COLS * (SZ + GAP) - GAP} ${(SZ + GAP) + SZ / 2} L${COLS * (SZ + GAP) + 28} ${(SZ + GAP) + SZ / 2}"
                stroke="${solved ? '#7bc47f' : '#39485a'}" stroke-width="12" stroke-linecap="round"/>`;
        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            const x = c * (SZ + GAP), y = r * (SZ + GAP);
            const inPath = path.has(`${r},${c}`);
            out += `
              <g data-rc="${r},${c}" style="cursor:pointer;">
                <rect x="${x}" y="${y}" width="${SZ}" height="${SZ}" rx="12"
                  fill="#141f18" stroke="${inPath ? (solved ? '#7bc47f' : '#4fd8d0') : '#26313f'}" stroke-width="2.5"/>
                <path d="${pipePath(GRID[r][c], rots[r][c], x, y, SZ)}"
                  fill="none" stroke="${inPath ? (solved ? '#7bc47f' : '#4fd8d0') : '#4a5a6a'}"
                  stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
                ${r === SHEARED.r && c === SHEARED.c ? `
                  <path d="M${x + SZ * 0.3} ${y + SZ * 0.25} l${SZ * 0.14} ${SZ * 0.22} -${SZ * 0.1} ${SZ * 0.08} l${SZ * 0.16} ${SZ * 0.24}" stroke="#e05252" stroke-width="4" fill="none"/>
                  <text x="${x + SZ / 2}" y="${y + SZ - 8}" text-anchor="middle" font-size="11" fill="#e05252" font-family="Consolas, monospace">SHEARED</text>` : ''}
              </g>`;
          }
        }
        svg.innerHTML = out;
        svg.querySelectorAll('[data-rc]').forEach(g => {
          g.addEventListener('click', () => {
            if (trace(rots).solved) return;
            const [r, c] = g.dataset.rc.split(',').map(Number);
            rots[r][c] = (rots[r][c] + 1) % 4;
            game.setFlag(`hydro_r${r}${c}`, rots[r][c]);
            game.playSfx('click');
            paint();
            const now = trace(rots);
            if (now.solved) {
              game.setFlag('hydro_flow');
              game.playSfx('pour');
              setTimeout(() => {
                api.solved({ message: 'The loop seals and the whole ring gulps — pumps waking, drip lines ticking, green light climbing the racks like a rumor. The iris door\'s interlock clunks open.' });
                game.refreshScene();
              }, 700);
            }
          });
        });
      }

      paint();
    },
  });
}
