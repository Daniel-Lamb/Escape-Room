// CHAMBER 5 — The Hypogeum. Breather with teeth.
// Puzzle: guided maze. The bronze mirror lights Felix's chalk plan; the plan
// navigates a 4x4 tunnel lattice with turn-only Sinistra/Dextra and Perge.
// Dens (B1, D3) reset you to the Lion Gate; the revealed map persists.
// Gus's old cage holds token 5 (palm frond, "O"); the wrecked capstan holds
// the crank handle.

import { registerItems } from '../../../shared/js/items.js';
import { kitDefs, shadow, wallDoor } from '../../../shared/js/scenekit.js';

registerItems({
  crank_handle: {
    name: 'Crank Handle',
    description: 'An oak-and-iron capstan bar, fire-scarred at one end and true at the other. It remembers being part of a machine.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 38 L26 22 L26 12" fill="none" stroke="#6b4f2c" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="21" y="6" width="10" height="10" rx="2" fill="#8a8f96" stroke="#3a3e44" stroke-width="2"/>
      <circle cx="10" cy="38" r="5" fill="#453a2e"/>
    </svg>`,
  },
});

// Maze topology. Cells addressed as "A1".."D4" (col A-D west->east, row 1-4
// south->north). Enter at A1 facing north; the stair is D4.
const OPEN = new Set([
  'A1|A2', 'A2|A3', 'A3|A4', 'A3|B3', 'B3|C3', 'C3|C2', 'C3|D3', 'C3|C4',
  'C4|B4', 'C4|D4', 'A1|B1',
]);
const RUBBLE = new Set(['B2', 'C1', 'D1', 'D2']);
const DENS = { B1: 'Wolf-stink and a rush of low grey bodies — you scramble back to the Lion Gate with your heart in your teeth.', D3: 'The fallen vault: darkness, heat, and something very large breathing an arm\'s length away. You retreat to the Lion Gate at a speed you will not brag about.' };
const DEADENDS = { A4: 'An empty bear cage, door long rusted open. Nothing but old straw and older smells.', C2: 'Flooded footing — black water over the boards, ankle-deep and rising nowhere. A dead end.', B4: 'The old feed store: empty racks, a smell of grain ghosts. No way on.' };
const GOAL = 'D4';
// The way from the Lion Gate (A1, facing north) to the stair, found through
// OPEN, written the way Felix's plan reads: onward n, turn right / left.
function route() {
  const cols = ['A', 'B', 'C', 'D'], dirs = ['N', 'E', 'S', 'W'];
  const step = (cell, d) => { let c = cols.indexOf(cell[0]), r = Number(cell[1]); if (d === 'N') r++; if (d === 'S') r--; if (d === 'E') c++; if (d === 'W') c--; return `${cols[c]}${r}`; };
  const open = (a, b) => OPEN.has(`${a}|${b}`) || OPEN.has(`${b}|${a}`);
  const prev = new Map([['A1', null]]), queue = ['A1'];
  while (queue.length) { const cur = queue.shift(); for (const d of dirs) { const nx = step(cur, d); if (!prev.has(nx) && open(cur, nx)) { prev.set(nx, cur); queue.push(nx); } } }
  const path = []; for (let c = GOAL; c; c = prev.get(c)) path.unshift(c);
  const words = ['', 'one', 'two', 'three', 'four'], out = [];
  let facing = 'N', run = 0;
  for (let i = 1; i < path.length; i++) {
    const d = dirs.find(x => step(path[i - 1], x) === path[i]);
    if (d !== facing) { out.push(`onward ${words[run]}`); out.push((dirs.indexOf(d) - dirs.indexOf(facing) + 4) % 4 === 1 ? 'turn right' : 'turn left'); facing = d; run = 0; }
    run++;
  }
  out.push(`onward ${words[run]}`);
  return out;
}
const COLS = ['A', 'B', 'C', 'D'];
const DIRS = ['N', 'E', 'S', 'W'];
const FACES = { N: '↑', E: '→', S: '↓', W: '←' };

function edge(a, b) { return OPEN.has(`${a}|${b}`) || OPEN.has(`${b}|${a}`); }
function step(cell, dir) {
  let c = COLS.indexOf(cell[0]), r = Number(cell[1]);
  if (dir === 'N') r += 1; if (dir === 'S') r -= 1;
  if (dir === 'E') c += 1; if (dir === 'W') c -= 1;
  if (c < 0 || c > 3 || r < 1 || r > 4) return null;
  return `${COLS[c]}${r}`;
}

// Layout — the plate (art/hypogeum.webp): a corridor of arches (centre), a big
// barred cage (right), a torch on the left wall, the corridor-mouth pillar.
const GATE = { x: 500, y: 430, w: 270, h: 360 };
const NICHE_DX = -548;                        // Felix's niche -> left wall
const CAGE_DX = 90, CAGE_DY = 20;             // name board, shelf, trough -> in the painted cage
const SDOOR = { x1: 1452, y1: 380, h1: 380, x2: 1590, y2: 340, h2: 470 };

export default {
  id: 'hypogeum',
  solution: route(),
  lintStates: [{ label: 'plan read', flags: { hypogeum_planSeen: true }, journal: ['note_plan'] }, { label: 'solved', flags: { hypogeum_mazeDone: true }, inventory: ['crank_handle', 'bronze_mirror'] }],
  title: 'The Hypogeum',
  intro: 'The stair lets you out under the arena floor itself — a lattice of cage-tunnels and lift shafts where the ceiling is planking and the planking leaks knife-blades of dusty light and thin continuous sand, and somewhere above you eighty thousand people stamp their feet on your roof.',

  scene(state) {
    const planSeen = !!state.flags.hypogeum_planSeen;
    const mazeDone = !!state.flags.hypogeum_mazeDone;
    const crankHere = !state.flags.hypogeum_crankTaken;

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${kitDefs()}
        <linearGradient id="gd_hyp_wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#1d1812"/>
          <stop offset="1" stop-color="#2b2318"/>
        </linearGradient>
        <linearGradient id="gd_hyp_floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#241c12"/>
          <stop offset="1" stop-color="#100c07"/>
        </linearGradient>
        <radialGradient id="gd_hyp_blade" cx="0.5" cy="0" r="1">
          <stop offset="0" stop-color="rgba(232,207,150,0.4)"/>
          <stop offset="1" stop-color="rgba(232,207,150,0)"/>
        </radialGradient>
        <radialGradient id="gd_hyp_torch" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(255,169,77,0.5)"/>
          <stop offset="1" stop-color="rgba(255,169,77,0)"/>
        </radialGradient>
      </defs>

      <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="art/hypogeum.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="art/hypogeum.mp4" type="video/mp4"/></video></foreignObject>

      <!-- overhead lift machinery (flavor art) -->
      <g stroke="#453a2e" stroke-width="8" fill="none" opacity="0.9">
        <path d="M700 140 v90 M980 140 v70"/>
        <circle cx="700" cy="252" r="22"/>
        <circle cx="980" cy="232" r="18"/>
        <path d="M700 274 q60 40 120 6 M980 250 q-40 36 -90 20" stroke-width="5"/>
      </g>

      <!-- warmth over the plate's torch on the left wall -->
      <ellipse cx="217" cy="250" rx="80" ry="70" fill="url(#gd_hyp_torch)" class="glow"/>

      <!-- the Lion Gate: mouth of the maze, hung in the first arch of the corridor (photoreal barred gate) -->
      <g data-mount="wall">
        ${shadow(GATE.x + GATE.w / 2, GATE.y + GATE.h, GATE.w * 0.55, 12)}
        <image href="art/hyp-gate.webp" x="${GATE.x}" y="${GATE.y}" width="${GATE.w}" height="${GATE.h}" preserveAspectRatio="xMidYMax meet"/>
        <rect x="${GATE.x + GATE.w / 2 - 90}" y="${GATE.y - 40}" width="180" height="30" rx="4" fill="url(#sk_stone)" stroke="#2c2418" stroke-width="2"/>
        <text x="${GATE.x + GATE.w / 2}" y="${GATE.y - 19}" text-anchor="middle" font-size="14" letter-spacing="3" fill="#2c2418"
          font-family="Palatino Linotype, Georgia, serif">PORTA LEONVM</text>
      </g>

      <!-- the niche with Felix's chalk plan, cut into the left wall -->
      <g data-mount="inset" transform="translate(${NICHE_DX} 0)">
        <rect x="592" y="412" width="166" height="206" rx="8" fill="#000" opacity="0.5"/>
        <rect x="600" y="420" width="150" height="190" rx="6" fill="#171209"/>
        ${planSeen
          ? `<g font-family="Palatino Linotype, Georgia, serif" fill="#e8dcc0" opacity="0.9">
               <text x="675" y="460" text-anchor="middle" font-size="13">PERGE II</text>
               <text x="675" y="484" text-anchor="middle" font-size="13">DEXTRA</text>
               <text x="675" y="508" text-anchor="middle" font-size="13">PERGE II</text>
               <text x="675" y="532" text-anchor="middle" font-size="13">SINISTRA</text>
               <text x="675" y="556" text-anchor="middle" font-size="13">PERGE I &middot; DEXTRA</text>
               <text x="675" y="580" text-anchor="middle" font-size="13">PERGE I &middot; SCALAE</text>
             </g>`
          : `<path d="M620 470 q40 -12 80 4 M615 520 q50 -8 100 6 M625 570 q40 -6 84 4" stroke="#3a3126" stroke-width="7" fill="none" opacity="0.8"/>`}
      </g>

      <!-- Gus's old cage: the barred gate is painted into the plate (right);
           keep the name board, the kindly-built shelf + trough, and token 5 -->
      <g data-mount="bolts" transform="translate(${CAGE_DX} ${CAGE_DY})">
        ${shadow(1180, 762, 100, 9)}
        <rect x="1140" y="368" width="120" height="30" rx="4" fill="#6b4f2c" stroke="#2b2015" stroke-width="2"/>
        <text x="1200" y="389" text-anchor="middle" font-size="16" letter-spacing="3" fill="#e8dcc0"
          font-family="Palatino Linotype, Georgia, serif">GVSTVS</text>
        <rect x="1090" y="640" width="180" height="20" rx="6" fill="#6b4f2c"/>
        <rect x="1100" y="660" width="16" height="100" fill="#453a2e"/>
        <rect x="1244" y="660" width="16" height="100" fill="#453a2e"/>
        <path d="M1290 720 h60 a8 8 0 0 1 -6 14 h-48 a8 8 0 0 1 -6 -14 z" fill="#5c5546"/>
        ${!state.journal.some(e => e.id === 'token5') ? `<circle cx="1332" cy="732" r="5" fill="#e8dcc0" class="beckon"/>` : ''}
      </g>

      <!-- broken capstan (photoreal), fallen on the floor -->
      <g data-mount="floor">
        ${shadow(852, 758, 70, 9)}
        <image href="art/hyp-capstan.webp" x="788" y="662" width="128" height="96" preserveAspectRatio="xMidYMax meet"/>
        ${crankHere ? `<g class="beckon"><path d="M905 736 L952 704 L952 678" fill="none" stroke="#c9a227" stroke-width="9" stroke-linecap="round"/></g>` : ''}
      </g>

      <!-- claw grooves (flavor), raked into the painted pillar at the corridor mouth -->
      <g data-mount="inset" stroke-linecap="round">
        <path d="M318 440 v130 M332 420 v160 M346 450 v120" stroke="#0e0a06" stroke-width="6"/>
        <path d="M318 440 v130 M332 420 v160 M346 450 v120" stroke="#8a7a5c" stroke-width="2" opacity="0.6" transform="translate(2 0)"/>
      </g>

      <!-- old feed trough (flavor), on the floor -->
      ${shadow(140, 748, 90, 7)}
      <path d="M60 730 h160 a10 10 0 0 1 -8 16 h-144 a10 10 0 0 1 -8 -16 z" fill="#453a2e"/>

      <!-- stair door, in the right wall beyond the cage: barred from within until the maze is walked -->
      ${wallDoor({ ...SDOOR, open: mazeDone, barred: !mazeDone, label: mazeDone ? 'SCALAE' : 'BARRED' })}
      <path d="M0 900 L0 866 Q800 904 1600 866 L1600 900 Z" fill="#0a0705"/>
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const mazeDone = !!state.flags.hypogeum_mazeDone;

    spots.push({
      id: 'niche', x: 590 + NICHE_DX, y: 410, w: 170, h: 210, label: "Felix's niche",
      onInteract(game) {
        if (game.getFlag('hypogeum_planSeen')) {
          showPlan(game, false);
          return;
        }
        if (game.selectedItem === 'bronze_mirror') {
          game.setFlag('hypogeum_planSeen');
          game.playSfx('page');
          showPlan(game, true);
          game.say('You angle the bronze mirror into the light-blade from the planks, and Felix\'s chalk comes up out of the shadow like a photograph of a plan — his hand steady, his Latin kind enough to translate itself.');
          game.refreshScene();
        } else {
          game.say('Smudged chalk on the niche wall — a plan, once. The light-blade from the planking falls just beside it, close enough to mock. Something in your loculus throws light.');
        }
      },
    });

    spots.push({
      id: 'gate', x: GATE.x, y: GATE.y - 40, w: GATE.w, h: GATE.h + 40, label: 'The Lion Gate — into the dark',
      onInteract(game) {
        if (game.getFlag('hypogeum_mazeDone')) {
          game.say('The tunnels beyond the Lion Gate hold no more surprises — you know the road now, and the things in the wrong rooms know you know it.');
          return;
        }
        openMaze(game);
      },
    });

    spots.push({
      id: 'cage', x: 1160, y: 220, w: 280, h: 600, label: "The lion's old cage",
      onInteract(game) {
        if (!game.journal.has('token5')) {
          game.journal.add('token5', {
            title: "in the lion's old cage", category: 'sun',
            sun: { rays: 6, letter: 'O', emblem: 'palm' },
          });
          game.say('GVSTVS, says the name board, over a keeper\'s tally of years. The sleeping shelf is Felix\'s carpentry — built too kindly for regulation. Wedged under the water trough: a bone tessera. A palm frond — the victory token — and the letter O. Gus waits outside the bars. He does not go in.');
        } else {
          game.say('The cage stands open, gate rusted back a generation. Gus looks at it the way men look at old letters. "He built the shelf in an afternoon," he says. "The lanista docked him a day\'s bread for the timber." Nothing else.');
        }
      },
    });

    if (!state.flags.hypogeum_crankTaken) {
      spots.push({
        id: 'capstan', x: 780, y: 650, w: 190, h: 140, label: 'The wrecked capstan',
        onInteract(game) {
          game.setFlag('hypogeum_crankTaken');
          game.addItem('crank_handle', { from: { x: 925, y: 710 } });
          game.say('The capstan burned in the fire and died where it stood, but one bar survived it — oak and iron, scarred at one end and true at the other. A crank handle. The great winch upstairs lost all of hers.');
          game.refreshScene();
        },
      });
    }

    spots.push({
      id: 'machinery', x: 620, y: 150, w: 460, h: 140, label: 'The lift machinery',
      onInteract(game) {
        game.say('Sheaves, shafts, and counterweight channels overhead — your own designs, built true. You check the joints out of habit, the way a parent checks a sleeping child\'s breathing. Whoever maintained these after Felix knew what they were doing. Nobody maintained them like Felix.');
      },
    });

    spots.push({
      id: 'clawpost', x: 290, y: 390, w: 90, h: 240, label: 'A grooved post',
      onInteract(game) {
        game.say('An oak post taller than a man, grooved deep by claws at a height that makes you stand very still for a moment. Gus examines the marks with connoisseurship. "Before my time," he says. "Amateur work."');
      },
    });

    spots.push({
      id: 'trough', x: 50, y: 700, w: 190, h: 80, label: 'The feed trough',
      onInteract(game) {
        game.say('An old feed trough, scrubbed and empty. Someone still cleans it. Nobody will say who, and nobody will say for whom, and the register says there are no beasts on this level. The register says a lot of things.');
      },
    });

    spots.push({
      id: 'stair', x: 1446, y: 340, w: 152, h: 470,
      label: mazeDone ? 'The stair to the winch gallery' : 'The barred stair door',
      onInteract(game) {
        if (!mazeDone) {
          game.say('Barred from within — the bar lifts from the tunnel side, and the tunnels answer to the Lion Gate. Felix\'s chalk knew the road.');
          return;
        }
        if (!game.hasItem('crank_handle')) {
          game.say('"The capstan bar," says Gus, nodding at the wreck. "The great winch upstairs lost all of hers to the fire. Felix would already have it under his arm."');
          return;
        }
        if (!game.journal.has('token5')) {
          game.say('Gus does not move from the stair. "His cage. Under the trough. Felix left one for me to keep, and I have no pockets."');
          return;
        }
        if (!game.journal.has('note_plan')) {
          game.say('"The niche first," says Gus. "Copy Felix\'s plan into your tablets. Roads you have walked once have a way of growing new turnings in the memory."');
          return;
        }
        game.say('The stair climbs toward the groan of rope and the smell of grease: the winch gallery, the last machine between you and the gate.');
        game.completeRoom({ delay: 700 });
      },
    });

    return spots;
  },

  hintContext(state) {
    return state.flags.hypogeum_planSeen ? 'maze' : 'plan';
  },

  hints(state) {
    if (state.flags.hypogeum_planSeen) {
      return [
        { text: 'Dextra is your sword hand, sinistra your shield hand, and you start facing the dark — north. The turns do not move you; only Perge moves you.', cost: 60 },
        { text: 'Follow the plan exactly, one instruction at a time. The wrong rooms are occupied, but the map remembers where you have been.', cost: 120 },
        { text: 'Onward two. Turn right, onward two. Turn left, onward one. Turn right, onward one. The stair is the far corner.', cost: 240 },
      ];
    }
    return [
      { text: 'Felix chalked the road, but chalk fades — the niche by the Lion Gate wants more light than the planks let down.', cost: 60 },
      { text: 'Something in your loculus throws light. Hold it, then touch the niche.', cost: 120 },
      { text: 'Hold the bronze mirror and use it on the niche: it catches the light-blade and the plan reads clean.', cost: 240 },
    ];
  },
};

function showPlan(game, first) {
  const html = `<div class="wax-tablet"><div class="tab-title">Felix's chalk plan — by mirror-light</div>
    <em class="tab-carve">FROM THE LION GATE, FACING THE DARK:<br>
    PERGE II &middot; DEXTRA &middot; PERGE II &middot; SINISTRA &middot;<br>
    PERGE I &middot; DEXTRA &middot; PERGE I &middot; THE STAIR.<br><br>
    <span style="opacity:0.8">(Perge — onward. Dextra — turn to the sword hand.
    Sinistra — turn to the shield hand.)</span></em></div>`;
  if (first) game.journal.add('note_plan', { title: "Felix's chalk plan (Hypogeum)", category: 'note', html });
  game.dialog({ title: 'The Chalk Plan', html });
}

function openMaze(game) {
  let pos = 'A1';
  let facing = 'N';
  const visited = new Set(game.getFlag('hypogeum_visited') || ['A1']);

  game.openPuzzle({
    id: 'hypogeum_maze',
    title: 'The Tunnels Beyond the Lion Gate',
    wide: true,
    render(body, api) {
      const planKnown = game.journal.has('note_plan');
      body.innerHTML = `
        <div class="puzzle-hero" style="background-image:url(art/pz-hypogeum.webp)"></div>
        <p class="puzzle-desc">Dark tunnels under the arena floor. The turns do not move
        you — <strong>Sinistra</strong> and <strong>Dextra</strong> only turn you in
        place; only <strong>Perge</strong> steps ahead. The stair is out there. So are
        the reasons the guards don't come down here.</p>
        ${planKnown ? `<p class="puzzle-desc" style="text-align:center;"><em>Felix:
          PERGE II &middot; DEXTRA &middot; PERGE II &middot; SINISTRA &middot; PERGE I
          &middot; DEXTRA &middot; PERGE I &middot; THE STAIR. (Facing the dark — north.)</em></p>` : ''}
        <div class="maze-grid" id="hyp-grid"></div>
        <div class="puzzle-row">
          <button class="btn" id="hyp-left">&#8630; Sinistra</button>
          <button class="btn btn-primary" id="hyp-fwd">Perge &#8593;</button>
          <button class="btn" id="hyp-right">Dextra &#8631;</button>
        </div>
        <div class="puzzle-feedback"></div>`;

      const gridEl = body.querySelector('#hyp-grid');
      const paint = () => {
        gridEl.innerHTML = '';
        // render rows top (r=4) to bottom (r=1)
        for (let r = 4; r >= 1; r--) {
          for (let c = 0; c < 4; c++) {
            const cell = `${COLS[c]}${r}`;
            const el = document.createElement('div');
            el.className = 'maze-cell'
              + (RUBBLE.has(cell) ? ' rubble' : '')
              + (visited.has(cell) ? ' seen' : '')
              + (cell === pos ? ' here' : '');
            if (cell === pos) el.innerHTML = `<span class="maze-face">${FACES[facing]}</span>`;
            else if (visited.has(cell) && cell === GOAL) el.textContent = '▤';
            gridEl.appendChild(el);
          }
        }
      };
      paint();

      const turn = (delta) => {
        facing = DIRS[(DIRS.indexOf(facing) + delta + 4) % 4];
        game.playSfx('click');
        paint();
      };
      body.querySelector('#hyp-left').addEventListener('click', () => turn(-1));
      body.querySelector('#hyp-right').addEventListener('click', () => turn(1));

      body.querySelector('#hyp-fwd').addEventListener('click', () => {
        const next = step(pos, facing);
        if (!next || RUBBLE.has(next) || !edge(pos, next)) {
          game.playSfx('stone');
          api.setFeedback('Stone. The tunnel does not go that way.', 'bad');
          return;
        }
        visited.add(next);
        game.setFlag('hypogeum_visited', [...visited]);
        if (DENS[next]) {
          pos = 'A1';
          facing = 'N';
          game.playSfx('wrong');
          api.setFeedback(DENS[next], 'bad');
          paint();
          return;
        }
        pos = next;
        game.playSfx('creak');
        if (DEADENDS[pos]) api.setFeedback(DEADENDS[pos], '');
        else api.setFeedback('', '');
        paint();
        if (pos === GOAL) {
          game.setFlag('hypogeum_mazeDone');
          api.solved({ message: 'The last tunnel ends in a stair and a bar that lifts from your side — Felix\'s road, walked to its end. Behind you the dark exhales, disappointed.' });
          game.refreshScene();
        }
      });
    },
  });
}
