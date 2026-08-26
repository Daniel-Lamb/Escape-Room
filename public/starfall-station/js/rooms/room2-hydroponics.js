// DECK 2 — Hydroponics Ring.
// Puzzle: rotate seized pipe tiles (clockwise only) to route nutrient flow
// from the inlet (mid-left) to the return (mid-right). Live connectivity
// check; loop fills green on success and the grow racks bloom.

import { registerItems } from '../../../shared/js/items.js';

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
  title: 'Hydroponics Ring',
  intro: 'The ring section curves away in both directions, racked floor to ceiling with dead brown rows. It smells of old soil and older regret. "The nutrient loop froze during the evac," says Gus. "Fix the flow and this deck will forgive us. Plants are quick to forgive. It\'s one of their best features."',

  scene(state) {
    const flow = !!state.flags.hydro_flow;
    const lampHere = flow && !state.flags.hydro_lampTaken;

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
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

      <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="art/hydroponics.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="art/hydroponics.mp4" type="video/mp4"/></video></foreignObject>

      <!-- grow racks, dead or blooming -->
      ${[80, 420, 1180].map((x, i) => `
      <g>
        <image href="art/hydro-rack.webp" x="${x - 6}" y="186" width="312" height="464" preserveAspectRatio="xMidYMax meet"/>
        ${[250, 340, 430, 520].map(y => flow
            ? `<g>${[0, 1, 2, 3, 4].map(k => `<path d="M${x + 40 + k * 55} ${y} q6 -22 0 -30 M${x + 40 + k * 55} ${y} q-8 -16 2 -26" stroke="#7bc47f" stroke-width="3.5" fill="none" stroke-linecap="round" class="beckon"/>`).join('')}</g>`
            : `<g>${[0, 1, 2, 3, 4].map(k => `<path d="M${x + 40 + k * 55} ${y} q4 -12 0 -18" stroke="#4a4434" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('')}</g>`
        ).join('')}
        ${flow ? `<ellipse cx="${x + 150}" cy="400" rx="180" ry="200" fill="url(#gd_hy_bloom)" class="glow"/>` : ''}
        ${i === 1 && lampHere ? `
          <g class="beckon">
            <rect x="${x + 60}" y="216" width="180" height="12" rx="6" fill="#3a2a5f" stroke="#7a5fd0" stroke-width="2.5"/>
            <ellipse cx="${x + 150}" cy="222" rx="120" ry="30" fill="url(#gd_hy_glow)"/>
          </g>` : ''}
      </g>`).join('')}

      <!-- nutrient tank (photoreal) with shard 2 -->
      <g>
        <image href="art/hydro-tank.webp" x="836" y="322" width="128" height="308" preserveAspectRatio="xMidYMax meet"/>
        <rect x="884" y="300" width="32" height="44" rx="6" fill="rgba(16,26,38,0.9)" stroke="#2f9e97" stroke-width="2" class="beckon"/>
        <text x="900" y="330" text-anchor="middle" font-size="16" fill="#4fd8d0">▮</text>
        <text x="900" y="656" text-anchor="middle" font-size="12" fill="#8fa3b8" font-family="Consolas, monospace" paint-order="stroke" stroke="#04070d" stroke-width="3">NUTRIENT RESERVE</text>
      </g>

      <!-- pipe access panel (the puzzle) -->
      <g>
        <rect x="1000" y="380" width="150" height="220" rx="10" fill="rgba(20,31,24,0.85)" stroke="${flow ? '#7bc47f' : '#ffb45e'}" stroke-width="4" class="${flow ? '' : 'beckon'}"/>
        <g stroke="${flow ? '#7bc47f' : '#39485a'}" stroke-width="9" fill="none">
          <path d="M1015 420 L1075 420 L1075 480 L1135 480"/>
          <path d="M1015 540 L1055 540 L1055 500"/>
        </g>
        <text x="1075" y="628" text-anchor="middle" font-size="12" fill="${flow ? '#7bc47f' : '#ffb45e'}"
          font-family="Consolas, monospace">${flow ? 'LOOP: CLOSED ✓' : 'LOOP: BROKEN'}</text>
      </g>

      <!-- exit iris -->
      <g>
        <circle cx="1490" cy="440" r="120" fill="rgba(11,19,30,0.3)" stroke="rgba(79,216,208,0.35)" stroke-width="6"/>
        ${flow
          ? `<circle cx="1490" cy="440" r="60" fill="#04070d" stroke="rgba(79,216,208,0.4)" stroke-width="3"/>`
          : `${[0, 60, 120, 180, 240, 300].map(a => `<path d="M1490 440 L${1490 + 115 * Math.cos(a * Math.PI / 180)} ${440 + 115 * Math.sin(a * Math.PI / 180)}" stroke="#1a2a20" stroke-width="26"/>`).join('')}`}
      </g>

      <path d="M0 900 L0 860 Q800 905 1600 860 L1600 900 Z" fill="#04070d"/>
    </svg>`;
  },

  hotspots(state) {
    const flow = !!state.flags.hydro_flow;
    const spots = [];

    spots.push({
      id: 'racks', x: 70, y: 190, w: 660, h: 440, label: flow ? 'The racks (blooming)' : 'Dead grow racks',
      onInteract(game) {
        game.say(flow
          ? 'Green is happening at speed. Bioluminescent algae climb the drip lines like they have somewhere to be. The ring smells alive.'
          : 'Row after row of freeze-dried salad. Someone laughed here once about growing tomatoes in orbit. The memory arrives without your permission.');
      },
    });

    spots.push({
      id: 'shard2', x: 870, y: 285, w: 60, h: 75, label: 'A shard on the tank',
      onInteract(game) {
        game.journal.add('shard2', { title: 'Hydroponics — the nutrient tank', category: 'sun', sun: { rays: 3, letter: 'A' } });
        game.say('A memory shard, tucked above the waterline: —green rows under grow-lights; someone laughing about tomatoes in orbit— You put it away carefully, like it might bruise.');
      },
    });

    spots.push({
      id: 'pipes', x: 990, y: 370, w: 170, h: 240, label: flow ? 'Pipe access (flowing)' : 'Pipe access panel',
      onInteract(game) {
        if (flow) { game.say('The loop hums, closed and content. Somewhere a pump is having the best day of its year.'); return; }
        openPipePuzzle(game);
      },
    });

    if (flow && !state.flags.hydro_lampTaken) {
      spots.push({
        id: 'lamp', x: 460, y: 200, w: 220, h: 60, label: 'UV grow-lamp',
        onInteract(game) {
          game.setFlag('hydro_lampTaken');
          game.addItem('uv_lamp', { from: { x: 570, y: 222 } });
          game.say('You unclip a UV tube from the rack. The algae will share. Blacklight has other talents — fingerprints, for instance, glow like confessions.');
          game.refreshScene();
        },
      });
    }

    spots.push({
      id: 'iris', x: 1370, y: 320, w: 230, h: 240, label: flow ? 'Iris door — open' : 'Iris door — sealed',
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
    { text: 'Water wants one unbroken road from the inlet valve to the return. The access panel opens the whole junction.', cost: 60 },
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
