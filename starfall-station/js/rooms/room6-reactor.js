// DECK 6 — Reactor Control. Peak 2.
// Puzzle: distribute emergency cells (40/25/15/10) across three buses with
// exact demands — LIFE SUPPORT 50, DOOR SERVOS 25, UPLINK PRE-CHARGE 15 —
// under the stamped rule MAX TWO CELLS PER BUS. Unique: 40+10 / 25 / 15.
// First: extract the slagged fuse with the magnet stylus.
// Reward: charged capacitor (needed at the uplink). Shard 6 (7 peaks, P).

import { registerItems } from '../../../shared/js/items.js';

registerItems({
  charged_capacitor: {
    name: 'Charged Capacitor',
    description: 'A fist-sized cell, warm and faintly humming. Enough juice for one great shout into the dark.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="10" width="20" height="28" rx="5" fill="#1c2734" stroke="#ffb45e" stroke-width="2.5"/>
      <line x1="24" y1="4" x2="24" y2="10" stroke="#ffb45e" stroke-width="3"/>
      <path d="M22 18 L27 24 L23 24 L26 31" stroke="#ffb45e" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <rect x="17" y="38" width="14" height="4" rx="2" fill="#39485a"/>
    </svg>`,
  },
});

const CELLS = [40, 25, 15, 10];
const BUSES = [
  { key: 'ls', name: 'LIFE SUPPORT', need: 50 },
  { key: 'door', name: 'DOOR SERVOS', need: 25 },
  { key: 'up', name: 'UPLINK PRE-CHARGE', need: 15 },
];

export default {
  id: 'reactor',
  title: 'Reactor Control',
  intro: 'The reactor hall is the station\'s one honest heartbeat — a torus of caged light, still faithfully turning fuel into tomorrow for a crew that left. The control pit is dark, though. Somebody pulled the emergency cells during the evac and left them racked like books nobody meant to return.',

  scene(state) {
    const fuseOut = !!state.flags.reactor_fuseOut;
    const solved = !!state.flags.reactor_balanced;
    const capTaken = !!state.flags.reactor_capTaken;

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gd_rx_wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#151019"/>
          <stop offset="1" stop-color="#241a26"/>
        </linearGradient>
        <radialGradient id="gd_rx_torus" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(255,180,94,0.5)"/>
          <stop offset="0.6" stop-color="rgba(255,140,70,0.15)"/>
          <stop offset="1" stop-color="rgba(255,140,70,0)"/>
        </radialGradient>
      </defs>

      <rect width="1600" height="640" fill="url(#gd_rx_wall)"/>
      <rect y="640" width="1600" height="260" fill="#120d15"/>
      <g stroke="#0b070d" stroke-width="3" opacity="0.7">
        ${[700, 770, 845].map(y => `<line x1="0" y1="${y}" x2="1600" y2="${y}"/>`).join('')}
      </g>

      <!-- the reactor torus -->
      <g>
        <ellipse cx="800" cy="300" rx="330" ry="200" fill="url(#gd_rx_torus)" class="glow"/>
        <ellipse cx="800" cy="300" rx="250" ry="130" fill="none" stroke="#3a2c1c" stroke-width="34"/>
        <ellipse cx="800" cy="300" rx="250" ry="130" fill="none" stroke="#ffb45e" stroke-width="7" opacity="0.85" class="flicker"/>
        <ellipse cx="800" cy="300" rx="250" ry="130" fill="none" stroke="rgba(255,220,160,0.6)" stroke-width="2" class="spin slow"/>
        ${[0, 60, 120, 180, 240, 300].map(a => {
          const x = 800 + 250 * Math.cos(a * Math.PI / 180), y = 300 + 130 * Math.sin(a * Math.PI / 180);
          return `<rect x="${x - 14}" y="${y - 20}" width="28" height="40" rx="6" fill="#241a10" stroke="#3a2c1c" stroke-width="3"/>`;
        }).join('')}
      </g>

      <!-- coolant manifold with shard 6 -->
      <g>
        <rect x="120" y="380" width="240" height="240" rx="12" fill="#1a141f" stroke="#2b2233" stroke-width="4"/>
        ${[0, 1, 2].map(k => `<path d="M${150 + k * 60} 380 L${150 + k * 60} 300 Q${150 + k * 60} 270 ${180 + k * 60} 270 L360 270" stroke="#2b3547" stroke-width="12" fill="none"/>`).join('')}
        <rect x="220" y="470" width="26" height="38" rx="4" fill="#101a26" stroke="#2f9e97" stroke-width="2" class="beckon"/>
        <text x="233" y="496" text-anchor="middle" font-size="14" fill="#4fd8d0">▮</text>
        <text x="240" y="590" text-anchor="middle" font-size="11" fill="#5d7080" font-family="Consolas, monospace">COOLANT MANIFOLD</text>
      </g>

      <!-- control pit: bus panel -->
      <g>
        <rect x="1080" y="330" width="440" height="300" rx="14" fill="#161019" stroke="${solved ? '#7bc47f' : fuseOut ? '#4fd8d0' : '#e05252'}" stroke-width="5" class="${solved ? '' : 'beckon'}"/>
        <text x="1300" y="362" text-anchor="middle" font-size="14" fill="#8fa3b8" letter-spacing="2" font-family="Consolas, monospace">EMERGENCY POWER — BUS PANEL</text>
        <text x="1300" y="384" text-anchor="middle" font-size="11.5" fill="#ffb45e" font-family="Consolas, monospace">⚠ MAX TWO CELLS PER BUS ⚠</text>
        ${BUSES.map((b, i) => `
          <g>
            <rect x="1104" y="${400 + i * 70}" width="392" height="54" rx="8" fill="#0d0a12" stroke="#26313f" stroke-width="2"/>
            <text x="1118" y="${422 + i * 70}" font-size="11" fill="#8fa3b8" font-family="Consolas, monospace">${b.name}</text>
            <text x="1118" y="${442 + i * 70}" font-size="13" fill="${solved ? '#7bc47f' : '#5d7080'}" font-family="Consolas, monospace">NEED ${b.need} ${solved ? '— FED ✓' : ''}</text>
          </g>`).join('')}
        ${fuseOut ? '' : `
          <g class="flicker">
            <rect x="1400" y="404" width="80" height="46" rx="6" fill="#0d0a12" stroke="#e05252" stroke-width="3"/>
            <path d="M1414 416 q26 22 52 4 M1420 442 q22 -18 46 -6" stroke="#e05252" stroke-width="4" fill="none"/>
            <text x="1440" y="470" text-anchor="middle" font-size="9.5" fill="#e05252" font-family="Consolas, monospace">FUSE SLAGGED</text>
          </g>`}
        ${solved && !capTaken ? `
          <g class="beckon">
            <rect x="1424" y="544" width="44" height="60" rx="8" fill="#1c2734" stroke="#ffb45e" stroke-width="3"/>
            <path d="M1440 560 L1452 576 L1443 576 L1450 592" stroke="#ffb45e" stroke-width="3" fill="none" stroke-linecap="round"/>
            <text x="1446" y="620" text-anchor="middle" font-size="9" fill="#ffb45e" font-family="Consolas, monospace">EJECTED</text>
          </g>` : ''}
      </g>

      <!-- cell rack -->
      <g>
        <rect x="1080" y="120" width="440" height="130" rx="12" fill="#141019" stroke="#2b2233" stroke-width="4"/>
        <text x="1300" y="148" text-anchor="middle" font-size="12" fill="#8fa3b8" font-family="Consolas, monospace">EMERGENCY CELL RACK</text>
        ${CELLS.map((v, i) => `
          <g>
            <rect x="${1110 + i * 105}" y="162" width="78" height="66" rx="8" fill="#0d0a12" stroke="#39485a" stroke-width="3"/>
            <text x="${1149 + i * 105}" y="202" text-anchor="middle" font-size="20" fill="#8ff0ea" font-family="Consolas, monospace">${v}</text>
          </g>`).join('')}
      </g>

      <!-- servo door -->
      <g>
        <path d="M40 640 L40 320 Q120 260 200 320 L200 640 Z" fill="${solved ? '#0b131e' : '#191320'}" stroke="#2b2233" stroke-width="8"/>
        <text x="120" y="480" text-anchor="middle" font-size="12" fill="${solved ? '#7bc47f' : '#e05252'}"
          font-family="Consolas, monospace" ${solved ? 'class="flicker"' : ''}>${solved ? 'SERVOS LIVE' : 'SERVOS DARK'}</text>
      </g>

      <path d="M0 900 L0 860 Q800 905 1600 860 L1600 900 Z" fill="#04070d"/>
    </svg>`;
  },

  hotspots(state) {
    const fuseOut = !!state.flags.reactor_fuseOut;
    const solved = !!state.flags.reactor_balanced;
    const spots = [];

    spots.push({
      id: 'torus', x: 520, y: 130, w: 560, h: 340, label: 'The reactor torus',
      onInteract(game) {
        game.say('The torus turns its caged orange light, steady as a promise. It will keep burning right through re-entry — loyal to the end, which is the saddest thing you can say about a machine. Present company excepted.');
      },
    });

    spots.push({
      id: 'shard6', x: 205, y: 455, w: 60, h: 70, label: 'A shard in the manifold',
      onInteract(game) {
        game.journal.add('shard6', { title: 'Reactor — the coolant manifold', category: 'sun', sun: { rays: 7, letter: 'P' } });
        game.say('The last shard, tucked into the coolant manifold where only a maintenance drone would ever look: —a small drone\'s eye-light in the dark: "I will remember for both of us."— Behind you, Gus\'s fans stutter, just once.');
      },
    });

    spots.push({
      id: 'rack', x: 1070, y: 110, w: 460, h: 150, label: 'Emergency cell rack',
      onInteract(game) {
        const html = `<div class="datapad"><div class="pad-title">Emergency cells — rack manifest</div>
          CELL 1: 40 units &nbsp;·&nbsp; CELL 2: 25 units<br>
          CELL 3: 15 units &nbsp;·&nbsp; CELL 4: 10 units<br>
          <span class="pad-warn">Bus demands — LIFE SUPPORT: 50 · DOOR SERVOS: 25 · UPLINK PRE-CHARGE: 15</span><br>
          <span style="opacity:0.7">Stamped on the frame: MAX TWO CELLS PER BUS.</span></div>`;
        game.journal.add('note_cells', { title: 'Cell rack & bus demands (Reactor)', category: 'note', html });
        game.dialog({ title: 'The Cell Rack', html });
      },
    });

    spots.push({
      id: 'panel', x: 1070, y: 320, w: 460, h: 320, label: fuseOut ? 'Bus panel' : 'Bus panel — fuse slagged',
      onInteract(game) {
        if (!fuseOut) {
          if (game.selectedItem === 'magnet_stylus') {
            game.selectedItem = null;
            game.setFlag('reactor_fuseOut');
            game.playSfx('unlock');
            game.say('The magnet stylus kisses the slagged fuse and draws it whole from the socket, trailing a whiff of burnt decision-making. The bus panel blinks awake, hungry for cells.');
            game.refreshScene();
          } else {
            game.say('The LIFE SUPPORT socket holds the corpse of a fuse — slagged flat into its housing, live current on both sides. You know better than to use fingers, and you own something better than fingers.');
          }
          return;
        }
        if (solved) {
          if (!state.flags.reactor_capTaken) {
            game.setFlag('reactor_capTaken');
            game.addItem('charged_capacitor', { from: { x: 1446, y: 574 } });
            game.say('The UPLINK PRE-CHARGE bus finishes its cycle and ejects a charged capacitor, hot and humming. One great shout\'s worth of power, packaged to go.');
            game.refreshScene();
          } else {
            game.say('All three buses fed exactly. The panel radiates the smugness of balanced books.');
          }
          return;
        }
        openBusPuzzle(game);
      },
    });

    spots.push({
      id: 'door', x: 30, y: 310, w: 190, h: 330, label: solved ? 'Servo door' : 'Servo door — dark',
      onInteract(game) {
        if (!solved) { game.say('The door servos are dark. No power on the DOOR SERVOS bus, no dignity in pushing — it\'s rated for eight tons.'); return; }
        if (!state.flags.reactor_capTaken) { game.say('The ejected capacitor is still sitting in the panel. "Take it," says Gus. "Trust me. Where we are going, we will want to be loud."'); return; }
        if (!game.journal.has('shard6')) { game.say('"Last shard," says Gus, hovering by the coolant manifold. "Mine, in a manner of speaking. I would like you to have it."'); return; }
        game.say('The servos hum the door aside. Beyond: the pod bay — and past it, half-lit, the skeletal frame of the uplink array. Nearly home. One way or another.');
        game.completeRoom({ delay: 700 });
      },
    });

    return spots;
  },

  hintContext(state) {
    return state.flags.reactor_fuseOut ? 'balance' : 'fuse';
  },

  hints(state) {
    if (!state.flags.reactor_fuseOut) {
      return [
        { text: 'The panel is dead until the slagged fuse comes out — and it is jammed in a live socket.', cost: 60 },
        { text: 'Metal slug, deep socket, live current. The cryo bay junk drawer already solved this for you.', cost: 120 },
        { text: 'Hold the magnet stylus and click the bus panel.', cost: 240 },
      ];
    }
    return [
      { text: 'Three demands, four cells, and a two-cell limit stamped on the frame. Do the arithmetic before the plugging.', cost: 60 },
      { text: 'Fifty is the trap: 25+15+10 makes it with three cells — forbidden. Only one PAIR reaches fifty. Start there and the rest places itself.', cost: 120 },
      { text: '40+10 to life support, 25 alone to door servos, 15 alone to uplink pre-charge.', cost: 240 },
    ];
  },
};

function openBusPuzzle(game) {
  // assignment: cell index -> bus key or null
  const assign = [null, null, null, null];

  game.openPuzzle({
    id: 'reactor_bus',
    title: 'Emergency Power Distribution',
    wide: true,
    render(body, api) {
      function busLoad(key) {
        return assign.reduce((sum, b, i) => sum + (b === key ? CELLS[i] : 0), 0);
      }
      function busCount(key) {
        return assign.filter(b => b === key).length;
      }

      let held = null;   // cell index currently picked up

      function draw() {
        body.innerHTML = `
          <p class="puzzle-desc">Feed each bus its <em>exact</em> demand.
          <strong style="color:#ffb45e;">MAX TWO CELLS PER BUS</strong> — the frame stamp is not a suggestion,
          it is a fire marshal. Click a cell, then a bus. Click a placed cell to pull it back.</p>
          <div class="puzzle-row" style="gap:10px;">
            ${CELLS.map((v, i) => assign[i] === null ? `
              <button class="tile" data-cell="${i}" style="min-width:74px; ${held === i ? 'border-color: var(--gold-bright); box-shadow: 0 0 14px rgba(79,216,208,0.4);' : ''}">
                <span style="font-family:Consolas, monospace; font-size:19px; color:#8ff0ea;">${v}</span>
              </button>` : '').join('')}
            ${assign.every(a => a !== null) ? '<span style="color:var(--text-dim); font-style:italic;">rack empty</span>' : ''}
          </div>
          <div style="display:flex; flex-direction:column; gap:10px; max-width:520px; margin: 16px auto 0;">
            ${BUSES.map(b => {
              const load = busLoad(b.key);
              const ok = load === b.need;
              return `
              <div class="tile slot-target" data-bus="${b.key}" style="display:flex; align-items:center; justify-content:space-between; padding: 10px 16px; cursor:pointer; min-height:56px; ${ok ? 'border-color:#7bc47f; border-style:solid;' : ''}">
                <span style="font-family:Consolas, monospace; font-size:12.5px; color:var(--text-dim);">${b.name}<br>
                  <span style="font-size:15px; color:${ok ? '#7bc47f' : load > b.need ? '#ff8f8f' : '#8ff0ea'};">${load} / ${b.need}</span></span>
                <span style="display:flex; gap:8px;">
                  ${assign.map((a, i) => a === b.key ? `
                    <button class="tile" data-placed="${i}" style="min-width:56px; min-height:40px; padding:4px;">
                      <span style="font-family:Consolas, monospace; font-size:15px; color:#8ff0ea;">${CELLS[i]}</span>
                    </button>` : '').join('')}
                </span>
              </div>`;
            }).join('')}
          </div>
          <div class="puzzle-feedback"></div>`;

        body.querySelectorAll('[data-cell]').forEach(b => b.addEventListener('click', () => {
          held = held === Number(b.dataset.cell) ? null : Number(b.dataset.cell);
          game.playSfx('click');
          draw();
        }));
        body.querySelectorAll('[data-placed]').forEach(b => b.addEventListener('click', (ev) => {
          ev.stopPropagation();
          assign[Number(b.dataset.placed)] = null;
          held = null;
          game.playSfx('click');
          draw();
        }));
        body.querySelectorAll('[data-bus]').forEach(b => b.addEventListener('click', () => {
          if (held === null) return;
          const key = b.dataset.bus;
          if (busCount(key) >= 2) {
            api.fail('The frame stamp flashes: MAX TWO CELLS PER BUS. It means it.');
            return;
          }
          assign[held] = key;
          held = null;
          game.playSfx('stone');
          draw();
          if (BUSES.every(bus => busLoad(bus.key) === bus.need)) {
            game.setFlag('reactor_balanced');
            game.playSfx('unlock');
            setTimeout(() => {
              api.solved({ message: 'Three buses drink their exact fill. Life support exhales, the door servos flex — and the uplink pre-charge cycle spins up with a rising whine, cooking one capacitor to full.' });
              game.refreshScene();
            }, 500);
          }
        }));
      }

      draw();
    },
  });
}
