// DECK 6 — Reactor Control. Peak 2.
// Puzzle: distribute emergency cells (40/25/15/10) across three buses with
// exact demands — LIFE SUPPORT 50, DOOR SERVOS 25, UPLINK PRE-CHARGE 15 —
// under the stamped rule MAX TWO CELLS PER BUS. Unique: 40+10 / 25 / 15.
// First: extract the slagged fuse with the magnet stylus.
// Reward: charged capacitor (needed at the uplink). Shard 6 (7 peaks, P).

import { registerItems } from '../../../shared/js/items.js';
import { kitDefs, panel, shadow } from '../../../shared/js/scenekit.js';

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

// Layout — read off the plate (art/reactor.webp): the torus left of centre, the
// glowing cell bank on the right wall, the round servo hatch at the far right.
const MAN = { x: 70, y: 540, w: 230, h: 160 };
const CELLSTRIP = { x: 986, y: 458, w: 300, h: 76 };
const BUS = { x: 1010, y: 580, w: 440, h: 260 };
const CAP = { x: 1470, y: 760 };
const DOOR = { cx: 1450, cy: 360, r: 120 };
const R = {
  torus:  { x: 230, y: 80, w: 700, h: 420 },
  shard6: { x: MAN.x + MAN.w / 2 - 32, y: MAN.y + 26, w: 64, h: 70 },
  rack:   { x: 980, y: 260, w: 310, h: 280 },
  panel:  { x: BUS.x - 6, y: BUS.y - 6, w: BUS.w + 12, h: BUS.h + 12 },
  door:   { x: DOOR.cx - 120, y: DOOR.cy - 130, w: 240, h: 260 },
};

export default {
  id: 'reactor',
  solution: () => {
    // which cells sum to each bus's need, each cell used once
    const out = [];
    const left = [...CELLS];
    for (const bus of BUSES) {
      let pick = null;
      for (let m = 1; m < 1 << left.length && !pick; m++) {
        const set = left.filter((_, i) => m & (1 << i));
        if (set.reduce((a, b) => a + b, 0) === bus.need) pick = set;
      }
      if (!pick) return [`nothing powers ${bus.name}`];
      pick.forEach(v => left.splice(left.indexOf(v), 1));
      out.push(pick.sort((a, b) => b - a).join('+'));
    }
    return out;
  },
  lintStates: [{ label: 'fuse out', flags: { reactor_fuseOut: true } },
    { label: 'balanced', flags: { reactor_fuseOut: true, reactor_balanced: true } }],
  title: 'Reactor Control',
  intro: 'The reactor hall is the station\'s one honest heartbeat — a torus of caged light, still faithfully turning fuel into tomorrow for a crew that left. The control pit is dark, though. Somebody pulled the emergency cells during the evac and left them racked like books nobody meant to return.',

  scene(state) {
    const fuseOut = !!state.flags.reactor_fuseOut;
    const solved = !!state.flags.reactor_balanced;
    const capTaken = !!state.flags.reactor_capTaken;

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${kitDefs()}
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

      <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="art/reactor.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="art/reactor.mp4" type="video/mp4"/></video></foreignObject>

      <!-- the reactor torus is carried by the footage; only a faint heat-bloom accent over it -->
      <ellipse cx="560" cy="320" rx="300" ry="190" fill="url(#gd_rx_torus)" class="glow" opacity="0.45"/>

      <!-- coolant manifold: a pipe block standing on the platform rim, shard 6 in its sample port -->
      <g data-mount="floor">
        ${shadow(MAN.x + MAN.w / 2, MAN.y + MAN.h, MAN.w * 0.6, 12)}
        ${[0, 1, 2].map(k => `<path d="M${MAN.x + 40 + k * 70} ${MAN.y} L${MAN.x + 40 + k * 70} ${MAN.y - 70 + k * 10} Q${MAN.x + 40 + k * 70} ${MAN.y - 110 + k * 10} ${MAN.x + 90 + k * 70} ${MAN.y - 110 + k * 10} L${MAN.x + 260} ${MAN.y - 110 + k * 10}" stroke="#2b3547" stroke-width="12" fill="none"/>`).join('')}
        <rect x="${MAN.x}" y="${MAN.y}" width="${MAN.w}" height="${MAN.h}" rx="12" fill="url(#sk_steel)" stroke="#0f1217" stroke-width="3"/>
        <rect x="${MAN.x + MAN.w / 2 - 13}" y="${MAN.y + 40}" width="26" height="38" rx="4" fill="#101a26" stroke="#2f9e97" stroke-width="2" class="beckon"/>
        <text x="${MAN.x + MAN.w / 2}" y="${MAN.y + 66}" text-anchor="middle" font-size="14" fill="#4fd8d0">▮</text>
        <text x="${MAN.x + MAN.w / 2}" y="${MAN.y + MAN.h - 16}" text-anchor="middle" font-size="11" fill="#cfd8e3" font-family="Consolas, monospace">COOLANT MANIFOLD</text>
      </g>

      <!-- the painted cell bank on the right wall: its four cells' charge, on a strip bolted beneath -->
      ${panel({ ...CELLSTRIP, material: 'steel', mount: 'bolts', rx: 6, body: `
        <text x="${CELLSTRIP.x + CELLSTRIP.w / 2}" y="${CELLSTRIP.y + 20}" text-anchor="middle" font-size="11" fill="#cfd8e3" font-family="Consolas, monospace">EMERGENCY CELL RACK</text>
        ${CELLS.map((v, i) => `
          <rect x="${CELLSTRIP.x + 14 + i * 70}" y="${CELLSTRIP.y + 30}" width="60" height="34" rx="6" fill="#0d0a12" stroke="#39485a" stroke-width="2"/>
          <text x="${CELLSTRIP.x + 44 + i * 70}" y="${CELLSTRIP.y + 54}" text-anchor="middle" font-size="18" fill="#8ff0ea" font-family="Consolas, monospace">${v}</text>`).join('')}` })}

      <!-- the bus panel: a console standing on the deck in front of the cell bank -->
      ${panel({ ...BUS, material: 'steel', mount: 'console', floorY: 890, rx: 14, body: `
        <rect x="${BUS.x + 4}" y="${BUS.y + 4}" width="${BUS.w - 8}" height="${BUS.h - 8}" rx="12" fill="none" stroke="${solved ? '#7bc47f' : fuseOut ? '#4fd8d0' : '#e05252'}" stroke-width="3" class="${solved ? '' : 'beckon'}"/>
        <text x="${BUS.x + BUS.w / 2}" y="${BUS.y + 30}" text-anchor="middle" font-size="13" fill="#cfd8e3" letter-spacing="2" font-family="Consolas, monospace">EMERGENCY POWER — BUS PANEL</text>
        <text x="${BUS.x + BUS.w / 2}" y="${BUS.y + 50}" text-anchor="middle" font-size="11.5" fill="#ffb45e" font-family="Consolas, monospace">⚠ MAX TWO CELLS PER BUS ⚠</text>
        ${BUSES.map((b, i) => `
          <g>
            <rect x="${BUS.x + 22}" y="${BUS.y + 64 + i * 62}" width="${BUS.w - 44}" height="52" rx="8" fill="#0d0a12" stroke="#26313f" stroke-width="2"/>
            <text x="${BUS.x + 36}" y="${BUS.y + 85 + i * 62}" font-size="11" fill="#9fb0c4" font-family="Consolas, monospace">${b.name}</text>
            <text x="${BUS.x + 36}" y="${BUS.y + 105 + i * 62}" font-size="13" fill="${solved ? '#7bc47f' : '#8fa3b8'}" font-family="Consolas, monospace">NEED ${b.need} ${solved ? '— FED ✓' : ''}</text>
          </g>`).join('')}
        ${fuseOut ? '' : `
          <g class="flicker">
            <rect x="${BUS.x + BUS.w - 110}" y="${BUS.y + 68}" width="80" height="44" rx="6" fill="#0d0a12" stroke="#e05252" stroke-width="3"/>
            <path d="M${BUS.x + BUS.w - 96} ${BUS.y + 80} q26 22 52 4 M${BUS.x + BUS.w - 90} ${BUS.y + 104} q22 -18 46 -6" stroke="#e05252" stroke-width="4" fill="none"/>
          </g>`}` })}
      ${solved && !capTaken ? `
        <g class="beckon" data-mount="table">
          ${shadow(CAP.x + 22, CAP.y + 62, 30, 6)}
          <rect x="${CAP.x}" y="${CAP.y}" width="44" height="60" rx="8" fill="#1c2734" stroke="#ffb45e" stroke-width="3"/>
          <path d="M${CAP.x + 16} ${CAP.y + 16} L${CAP.x + 28} ${CAP.y + 32} L${CAP.x + 19} ${CAP.y + 32} L${CAP.x + 26} ${CAP.y + 48}" stroke="#ffb45e" stroke-width="3" fill="none" stroke-linecap="round"/>
        </g>` : ''}

      <!-- the servo door: the painted round hatch on the right, its status lamp beside it -->
      <g data-mount="wall">
        ${solved ? `<circle cx="${DOOR.cx}" cy="${DOOR.cy}" r="${DOOR.r}" fill="#04070d" opacity="0.55"/>` : ''}
        ${panel({ x: DOOR.cx - 60, y: DOOR.cy + DOOR.r + 12, w: 120, h: 30, material: 'steel', mount: 'bolts', rx: 4, body: `
          <text x="${DOOR.cx}" y="${DOOR.cy + DOOR.r + 32}" text-anchor="middle" font-size="11" fill="${solved ? '#7bc47f' : '#e05252'}"
            font-family="Consolas, monospace" ${solved ? 'class="flicker"' : ''}>${solved ? 'SERVOS LIVE' : 'SERVOS DARK'}</text>` })}
      </g>

      <path d="M0 900 L0 860 Q800 905 1600 860 L1600 900 Z" fill="#04070d"/>
    </svg>`;
  },

  hotspots(state) {
    const fuseOut = !!state.flags.reactor_fuseOut;
    const solved = !!state.flags.reactor_balanced;
    const spots = [];

    spots.push({
      id: 'torus', ...R.torus, label: 'The reactor torus',
      onInteract(game) {
        game.say('The torus turns its caged orange light, steady as a promise. It will keep burning right through re-entry — loyal to the end, which is the saddest thing you can say about a machine. Present company excepted.');
      },
    });

    spots.push({
      id: 'shard6', ...R.shard6, label: 'A shard in the manifold',
      onInteract(game) {
        game.journal.add('shard6', { title: 'Reactor — the coolant manifold', category: 'sun', sun: { rays: 7, letter: 'P' } });
        game.say('The last shard, tucked into the coolant manifold where only a maintenance drone would ever look: —a small drone\'s eye-light in the dark: "I will remember for both of us."— Behind you, Gus\'s fans stutter, just once.');
      },
    });

    spots.push({
      id: 'rack', ...R.rack, label: 'Emergency cell rack',
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
      id: 'panel', ...R.panel, label: fuseOut ? 'Bus panel' : 'Bus panel — fuse slagged',
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
            game.addItem('charged_capacitor', { from: { x: CAP.x + 22, y: CAP.y + 30 } });
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
      id: 'door', plate: 'the servo door', ...R.door, label: solved ? 'Servo door' : 'Servo door — dark',
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
          <div class="puzzle-hero" style="background-image:url(art/pz-reactor.webp)"></div>
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
