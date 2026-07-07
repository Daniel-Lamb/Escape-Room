// CHAMBER 5 — The Hypogeum. Breather with teeth.
// Puzzle: guided maze. The bronze mirror lights Felix's chalk plan; the plan
// navigates a 4x4 tunnel lattice with turn-only Sinistra/Dextra and Perge.
// Dens (B1, D3) reset you to the Lion Gate; the revealed map persists.
// Gus's old cage holds token 5 (palm frond, "O"); the wrecked capstan holds
// the crank handle.

import { registerItems } from '../../../shared/js/items.js';

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

export default {
  id: 'hypogeum',
  title: 'The Hypogeum',
  intro: 'The stair lets you out under the arena floor itself — a lattice of cage-tunnels and lift shafts where the ceiling is planking and the planking leaks knife-blades of dusty light and thin continuous sand, and somewhere above you eighty thousand people stamp their feet on your roof.',

  scene(state) {
    const planSeen = !!state.flags.hypogeum_planSeen;
    const mazeDone = !!state.flags.hypogeum_mazeDone;
    const crankHere = !state.flags.hypogeum_crankTaken;

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
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

      <rect width="1600" height="900" fill="url(#gd_hyp_wall)"/>

      <!-- the arena floor as ceiling: planks + joists -->
      <g>
        <rect width="1600" height="140" fill="#332a1e"/>
        ${[0, 200, 400, 600, 800, 1000, 1200, 1400].map(x => `<rect x="${x}" y="0" width="12" height="140" fill="#241c12"/>`).join('')}
        ${[46, 92].map(y => `<line x1="0" y1="${y}" x2="1600" y2="${y}" stroke="#241c12" stroke-width="6"/>`).join('')}
      </g>
      <!-- light blades through the planking -->
      <polygon points="500,140 540,140 620,760 540,760" fill="url(#gd_hyp_blade)" class="moonbeam"/>
      <polygon points="1210,140 1240,140 1300,600 1240,600" fill="url(#gd_hyp_blade)" class="moonbeam" style="animation-delay:-3s"/>
      <!-- falling sand motes -->
      <g fill="#c9a45f" opacity="0.4">
        <circle cx="560" cy="300" r="2" class="float"/>
        <circle cx="580" cy="480" r="1.5" class="float" style="animation-delay:-2s"/>
        <circle cx="1250" cy="330" r="1.7" class="float" style="animation-delay:-1s"/>
        <circle cx="1268" cy="470" r="1.4" class="float" style="animation-delay:-3.4s"/>
      </g>

      <rect y="760" width="1600" height="140" fill="url(#gd_hyp_floor)"/>

      <!-- overhead lift machinery (flavor art) -->
      <g stroke="#453a2e" stroke-width="8" fill="none" opacity="0.9">
        <path d="M700 140 v90 M980 140 v70"/>
        <circle cx="700" cy="252" r="22"/>
        <circle cx="980" cy="232" r="18"/>
        <path d="M700 274 q60 40 120 6 M980 250 q-40 36 -90 20" stroke-width="5"/>
      </g>

      <!-- torch by the Lion Gate -->
      <g>
        <rect x="308" y="330" width="12" height="58" rx="4" fill="#3a2b18"/>
        <ellipse cx="314" cy="316" rx="40" ry="34" fill="url(#gd_hyp_torch)" class="glow"/>
        <path class="torch-flame" d="M314 330 q11 -19 0 -34 q-11 15 0 34z" fill="#ffa94d"/>
      </g>

      <!-- the Lion Gate: mouth of the maze -->
      <g>
        <path d="M360 760 L360 430 Q460 370 560 430 L560 760 Z" fill="#0f0c08" stroke="#453a2e" stroke-width="8"/>
        ${[395, 430, 465, 500, 525].map(x => `<line x1="${x}" y1="${x === 395 || x === 525 ? 448 : 415}" x2="${x}" y2="760" stroke="#453a2e" stroke-width="9"/>`).join('')}
        <text x="460" y="408" text-anchor="middle" font-size="14" letter-spacing="3" fill="#8a7f6a"
          font-family="Palatino Linotype, Georgia, serif">PORTA LEONVM</text>
      </g>

      <!-- the niche with Felix's chalk plan -->
      <g>
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

      <!-- Gus's old cage -->
      <g>
        <path d="M1040 760 L1040 400 L1360 400 L1360 760 Z" fill="#14100a" stroke="#453a2e" stroke-width="7"/>
        <path d="M1052 400 L1120 348 L1290 348 L1360 400" fill="#241c12" stroke="#453a2e" stroke-width="5"/>
        ${[1080, 1130, 1180, 1230, 1280, 1330].map(x => `<line x1="${x}" y1="404" x2="${x}" y2="760" stroke="#453a2e" stroke-width="8"/>`).join('')}
        <!-- cage gate rusted open -->
        <path d="M1040 760 L980 700 L980 460 L1040 410" fill="none" stroke="#5c4a2e" stroke-width="8"/>
        <!-- name board -->
        <rect x="1140" y="368" width="120" height="30" rx="4" fill="#6b4f2c"/>
        <text x="1200" y="389" text-anchor="middle" font-size="16" letter-spacing="3" fill="#e8dcc0"
          font-family="Palatino Linotype, Georgia, serif">GVSTVS</text>
        <!-- kindly-built sleeping shelf, water trough -->
        <rect x="1090" y="640" width="180" height="20" rx="6" fill="#6b4f2c"/>
        <rect x="1100" y="660" width="16" height="100" fill="#453a2e"/>
        <rect x="1244" y="660" width="16" height="100" fill="#453a2e"/>
        <path d="M1290 720 h60 a8 8 0 0 1 -6 14 h-48 a8 8 0 0 1 -6 -14 z" fill="#5c5546"/>
        ${!state.journal.some(e => e.id === 'token5') ? `<circle cx="1332" cy="732" r="5" fill="#e8dcc0" class="beckon"/>` : ''}
      </g>

      <!-- broken capstan -->
      <g>
        <circle cx="850" cy="720" r="52" fill="#3a2d1c" stroke="#241c12" stroke-width="6"/>
        <circle cx="850" cy="720" r="12" fill="#171209"/>
        <path d="M810 690 l-40 -34 M886 688 l36 -40" stroke="#453a2e" stroke-width="10" stroke-linecap="round"/>
        ${crankHere ? `<g class="beckon"><path d="M900 740 L950 706 L950 680" fill="none" stroke="#6b4f2c" stroke-width="9" stroke-linecap="round"/></g>` : ''}
      </g>

      <!-- claw-grooved post (flavor) -->
      <g>
        <rect x="240" y="360" width="34" height="400" rx="8" fill="#3a2d1c"/>
        <path d="M248 420 v120 M256 400 v150 M264 430 v110" stroke="#241c12" stroke-width="3"/>
      </g>

      <!-- old feed trough (flavor) -->
      <path d="M60 730 h160 a10 10 0 0 1 -8 16 h-144 a10 10 0 0 1 -8 -16 z" fill="#453a2e"/>

      <!-- stair door, far right -->
      <g>
        <path d="M1450 760 L1450 380 Q1520 340 1590 380 L1590 760 Z" fill="${mazeDone ? '#0f0c08' : '#241c12'}" stroke="#453a2e" stroke-width="7"/>
        ${mazeDone
          ? `<g stroke="#8a7f6a" stroke-width="4">${[700, 660, 620, 580].map((y, i) => `<line x1="${1470 + i * 8}" y1="${y}" x2="${1570 - i * 8}" y2="${y}"/>`).join('')}</g>
             <text x="1520" y="470" text-anchor="middle" font-size="13" fill="#e8cf96" class="flicker"
               font-family="Palatino Linotype, Georgia, serif">SCALAE</text>`
          : `<line x1="1442" y1="540" x2="1598" y2="540" stroke="#5c5546" stroke-width="13"/>
             <text x="1520" y="510" text-anchor="middle" font-size="12" fill="#8a7f6a"
               font-family="Palatino Linotype, Georgia, serif">barred from within</text>`}
      </g>

      <path d="M0 900 L0 866 Q800 904 1600 866 L1600 900 Z" fill="#0a0705"/>
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const mazeDone = !!state.flags.hypogeum_mazeDone;

    spots.push({
      id: 'niche', x: 590, y: 410, w: 170, h: 210, label: "Felix's niche",
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
      id: 'gate', x: 350, y: 420, w: 220, h: 340, label: 'The Lion Gate — into the dark',
      onInteract(game) {
        if (game.getFlag('hypogeum_mazeDone')) {
          game.say('The tunnels beyond the Lion Gate hold no more surprises — you know the road now, and the things in the wrong rooms know you know it.');
          return;
        }
        openMaze(game);
      },
    });

    spots.push({
      id: 'cage', x: 1030, y: 340, w: 340, h: 420, label: "The lion's old cage",
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
      id: 'clawpost', x: 230, y: 350, w: 90, h: 410, label: 'A grooved post',
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
      id: 'stair', x: 1440, y: 370, w: 158, h: 390,
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
