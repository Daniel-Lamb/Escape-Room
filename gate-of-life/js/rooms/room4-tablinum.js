// CHAMBER 4 — The Lanista's Tablinum. Peak 1.
// Puzzle: the SATOR square. Row 3 (TENET) is riveted; row 1 comes from the
// R3 charm; row 2 (AREPO) hides under re-waxed tablet, shaved by the strigil;
// rows 4-5 derive from the four-ways rule. Strongroom holds the winch key,
// token 4, and the ledger that explains Felix and Gus both.

import { registerItems } from '../../../shared/js/items.js';

registerItems({
  winch_key: {
    name: 'Winch Key',
    description: 'A bronze key with a square socket end, on a ring tagged MACHINAE. Made to free a brake, not a door.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="15" r="8" fill="none" stroke="#b8893a" stroke-width="4"/>
      <path d="M20 20 L36 36" stroke="#b8893a" stroke-width="5" stroke-linecap="round"/>
      <rect x="32" y="32" width="11" height="11" rx="2" fill="none" stroke="#b8893a" stroke-width="4"/>
    </svg>`,
  },
});

const SQUARE = ['SATOR', 'AREPO', 'TENET', 'OPERA', 'ROTAS'];
const TRAY = 'AAAAOOOORRRRSSTTEEPPCVM'.split('');

export default {
  id: 'tablinum',
  title: "The Lanista's Tablinum",
  intro: 'The lanista\'s office is small, airless, and arranged the way money likes to be arranged — every scroll a debt, every tablet a man — and its strongroom door carries no lock at all, only a bronze frame of five-by-five letter tiles, because down here superstition holds better than iron.',

  scene(state) {
    const scraped = !!state.flags.tablinum_waxScraped;
    const open = !!state.flags.tablinum_squareSolved;

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gd_tab_wall2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#28211a"/>
          <stop offset="1" stop-color="#382d22"/>
        </linearGradient>
        <linearGradient id="gd_tab_floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#2b2216"/>
          <stop offset="1" stop-color="#14100a"/>
        </linearGradient>
        <radialGradient id="gd_tab_lamp" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(255,190,90,0.5)"/>
          <stop offset="1" stop-color="rgba(255,190,90,0)"/>
        </radialGradient>
      </defs>

      <rect width="1600" height="650" fill="url(#gd_tab_wall2)"/>
      <rect y="650" width="1600" height="250" fill="url(#gd_tab_floor)"/>
      <g stroke="#171209" stroke-width="4" opacity="0.6">
        ${[150, 300, 450].map(y => `<line x1="0" y1="${y}" x2="1600" y2="${y}"/>`).join('')}
      </g>

      <!-- fresco: the amphitheatre in cutaway (your drawings, stolen) -->
      <g>
        <rect x="620" y="80" width="420" height="170" rx="8" fill="#3a3126" stroke="#453a2e" stroke-width="4"/>
        <path d="M660 220 q170 -120 340 0" fill="none" stroke="#c9b98f" stroke-width="3"/>
        <path d="M690 220 q140 -95 280 0 M720 220 q110 -70 220 0" fill="none" stroke="#8a7f6a" stroke-width="2"/>
        <g stroke="#8a7f6a" stroke-width="2">
          <line x1="770" y1="220" x2="770" y2="196"/><line x1="830" y1="220" x2="830" y2="182"/>
          <line x1="890" y1="220" x2="890" y2="182"/><line x1="950" y1="220" x2="950" y2="196"/>
        </g>
        <text x="830" y="112" text-anchor="middle" font-size="13" fill="#c9b98f" letter-spacing="3"
          font-family="Palatino Linotype, Georgia, serif">SVBTERRANEA AMPHITHEATRI</text>
      </g>

      <!-- oil lamp on the desk -->
      <ellipse cx="480" cy="520" rx="60" ry="46" fill="url(#gd_tab_lamp)" class="glow"/>

      <!-- desk with tablets + abacus -->
      <g>
        <rect x="260" y="560" width="400" height="26" rx="8" fill="#6b4f2c"/>
        <rect x="290" y="586" width="26" height="140" fill="#453a2e"/>
        <rect x="600" y="586" width="26" height="140" fill="#453a2e"/>
        <!-- the re-waxed tablet -->
        <g transform="rotate(-5 400 540)">
          <rect x="340" y="516" width="120" height="52" rx="5" fill="#6b4f2c"/>
          <rect x="348" y="522" width="104" height="40" rx="3" fill="${scraped ? '#3a2d1c' : '#1d1812'}"/>
          ${scraped ? `<text x="400" y="548" text-anchor="middle" font-size="15" letter-spacing="4" fill="#e8dcc0"
            font-family="Palatino Linotype, Georgia, serif">AREPO</text>` : ''}
        </g>
        <!-- lamp -->
        <path d="M470 540 q10 -8 20 0 l-4 8 q-6 4 -12 0 z" fill="#8a5a1c"/>
        <path class="torch-flame" d="M480 538 q6 -10 0 -18 q-6 8 0 18z" fill="#ffd9a0"/>
        <!-- abacus -->
        <g transform="rotate(3 560 540)">
          <rect x="520" y="524" width="80" height="44" rx="5" fill="#453a2e"/>
          ${[534, 548, 562].map(y => `<line x1="526" y1="${y}" x2="594" y2="${y}" stroke="#241f1a" stroke-width="2"/>`).join('')}
          ${[534, 552, 570, 588].map((x, i) => `<circle cx="${x - 2}" cy="${534 + (i % 3) * 14}" r="4" fill="#c9a227"/>`).join('')}
        </g>
      </g>

      <!-- scroll shelves -->
      <g>
        <rect x="240" y="220" width="300" height="200" rx="6" fill="#3a2d1c" stroke="#241f1a" stroke-width="5"/>
        ${[250, 320, 390, 460].map(x => [250, 310, 370].map(y =>
          `<circle cx="${x + 24}" cy="${y + 22}" r="17" fill="#1d1812" stroke="#6b5a3a" stroke-width="3"/>
           <circle cx="${x + 24}" cy="${y + 22}" r="5" fill="#8a7f6a"/>`).join('')).join('')}
      </g>

      <!-- strongroom door with the letter frame -->
      <g>
        <path d="M1080 650 L1080 220 L1440 220 L1440 650 Z" fill="${open ? '#0f0c08' : '#453a2e'}" stroke="#241f1a" stroke-width="9"/>
        ${open
          ? `<rect x="1110" y="250" width="300" height="380" fill="#171008"/>
             <!-- strongroom interior glints -->
             <g class="beckon">
               <circle cx="1180" cy="520" r="9" fill="none" stroke="#d1a53f" stroke-width="4"/>
               <path d="M1188 528 l24 24" stroke="#d1a53f" stroke-width="5" stroke-linecap="round"/>
               <rect x="1250" y="430" width="120" height="70" rx="4" fill="#d9c493" transform="rotate(-4 1310 465)"/>
               <rect x="1300" y="540" width="42" height="30" rx="5" fill="#e8dcc0"/>
             </g>`
          : `<g>
             ${SQUARE.map((row, r) => row.split('').map((ch, c) => {
              const x = 1140 + c * 50, y = 300 + r * 50;
              const fixed = r === 2;
              return `<rect x="${x}" y="${y}" width="44" height="44" rx="6"
                  fill="${fixed ? '#5c5546' : '#2b2015'}" stroke="#171209" stroke-width="2.5"/>
                ${fixed ? `<text x="${x + 22}" y="${y + 30}" text-anchor="middle" font-size="22" fill="#e8c85a"
                  font-family="Palatino Linotype, Georgia, serif">${ch}</text>` : ''}`;
            }).join('')).join('')}
             <text x="1260" y="272" text-anchor="middle" font-size="15" letter-spacing="3" fill="#cfc6b4"
               font-family="Palatino Linotype, Georgia, serif">QVATTVOR VIIS LEGITVR</text>
             </g>`}
      </g>

      <!-- corridor door -->
      <g>
        <path d="M1490 650 L1490 340 Q1545 306 1596 340 L1596 650 Z" fill="${open ? '#0f0c08' : '#2b2015'}" stroke="#241f1a" stroke-width="6"/>
        ${open ? '' : `<line x1="1484" y1="480" x2="1600" y2="480" stroke="#5c5546" stroke-width="12"/>`}
      </g>

      <!-- strongbox (flavor detail near desk) -->
      <rect x="700" y="700" width="150" height="100" rx="8" fill="#3a2d1c" stroke="#241f1a" stroke-width="5"/>
      <path d="M700 740 h150" stroke="#241f1a" stroke-width="4"/>
      <circle cx="775" cy="740" r="12" fill="#171209" stroke="#5c5546" stroke-width="3"/>

      <path d="M0 900 L0 862 Q800 906 1600 862 L1600 900 Z" fill="#0a0705"/>
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const open = !!state.flags.tablinum_squareSolved;

    spots.push({
      id: 'desk', x: 300, y: 490, w: 240, h: 110, label: 'The re-waxed tablet',
      onInteract(game) {
        if (game.getFlag('tablinum_waxScraped')) {
          const html = `<div class="wax-tablet"><div class="tab-title">Beneath the wax — an old hand</div>
            <em class="tab-carve">A R E P O — the Sower's own name, whatever it means.
            The square held while I scraped it. — F.</em></div>`;
          game.dialog({ title: 'The Palimpsest', html });
          return;
        }
        if (game.selectedItem === 'strigil') {
          game.setFlag('tablinum_waxScraped');
          game.playSfx('page');
          const html = `<div class="wax-tablet"><div class="tab-title">Beneath the wax — an old hand</div>
            <em class="tab-carve">A R E P O — the Sower's own name, whatever it means.
            The square held while I scraped it. — F.</em></div>`;
          game.journal.add('note_palimpsest', { title: 'The palimpsest (Tablinum)', category: 'note', html });
          game.dialog({ title: 'The Palimpsest', html });
          game.say('The strigil shaves the new wax in one clean curl — a bathhouse tool, made for exactly this patience — and an older writing rises out of the wood.');
          game.refreshScene();
        } else {
          game.say('An old tablet, re-waxed smooth over something. Your thumbnail gouges the wax and reveals nothing but a ruined thumbnail. This wants a barber\'s patience — or a bathhouse tool.');
        }
      },
    });

    spots.push({
      id: 'frame', x: 1090, y: 230, w: 340, h: 410,
      label: open ? 'The strongroom' : 'The lettered frame',
      onInteract(game) {
        if (!open) { openSquare(game); return; }
        game.playSfx('page');
        const html = `<div class="parchment-note aged"><div class="note-title">The Lanista's Ledger — old pages</div>
          FELIX, carpenter of beasts — rudis petitioned, <strong>DENIED</strong>. Too useful below.<br><br>
          The old lion GVSTVS: crowd-shy, will not perform. <strong>To be destroyed when the games close.</strong></div>
          <p style="margin-top:12px; font-style:italic; color:var(--text-dim);">Gus reads it over
          your shoulder and says nothing, which is worse.</p>`;
        game.journal.add('note_ledger', { title: "The lanista's ledger (Tablinum)", category: 'note', html });
        if (!game.hasItem('winch_key') && !game.getFlag('tablinum_keyTaken')) {
          game.setFlag('tablinum_keyTaken');
          game.addItem('winch_key', { from: { x: 1190, y: 530 } });
        }
        if (!game.journal.has('token4')) {
          game.journal.add('token4', {
            title: "in the lanista's strongroom", category: 'sun',
            sun: { rays: 5, letter: 'I', emblem: 'griffin' },
          });
          game.say('The strongroom gives up three things: a bronze winch key on a ring tagged MACHINAE, a bone tessera — griffin emblem, letter I — and the ledger. Read the ledger. Both lines.');
        }
        game.dialog({ title: "The Lanista's Ledger", html });
      },
    });

    spots.push({
      id: 'fresco', x: 610, y: 70, w: 440, h: 190, label: 'The fresco',
      onInteract(game) {
        game.say('The amphitheatre in cutaway: lift shafts, winch galleries, the western works. Your drawings — you\'d know your own line-weight anywhere — copied by a workshop hand and signed by a man who never held a pen underground. You check the fresco for errors out of habit. There are two.');
      },
    });

    spots.push({
      id: 'abacus', x: 510, y: 500, w: 110, h: 90, label: 'The abacus',
      onInteract(game) {
        game.say('The beads stand mid-sum: somebody was interrupted counting other people\'s lives. You resist the architect\'s urge to finish the arithmetic. It would not come out in anyone\'s favor.');
      },
    });

    spots.push({
      id: 'scrolls', x: 230, y: 210, w: 320, h: 220, label: 'The scroll shelves',
      onInteract(game) {
        game.say('Contracts, purchases, appeals. Every scroll a man; every seal a decision made over lunch. Somewhere in this wall is the scroll with your name on it, and there is no time in the world you would spend finding it.');
      },
    });

    spots.push({
      id: 'door', x: 1480, y: 330, w: 118, h: 320,
      label: open ? 'Down to the hypogeum' : 'The barred corridor door',
      onInteract(game) {
        if (!open) {
          game.say('Barred from this side — the bar is linked to the strongroom frame. Superstition is the lock and the key both, down here.');
          return;
        }
        if (!game.hasItem('winch_key')) {
          game.say('"The key," says Gus, glancing at the strongroom. "MACHINAE means the great winch, and the great winch is between us and the gate."');
          return;
        }
        if (!game.journal.has('token4')) {
          game.say('"The strongroom," Gus says. "Felix paid a tessera into the lanista\'s own box. He had a sense of humor about these things."');
          return;
        }
        if (!game.journal.has('note_ledger')) {
          game.say('Gus stands square in the doorway. "Read the ledger first. You should know what this place decided about Felix. And about me."');
          return;
        }
        game.say('The stair beyond the door drops into cool animal dark: the hypogeum, the underworld you drew.');
        game.completeRoom({ delay: 700 });
      },
    });

    return spots;
  },

  hintContext(state) {
    return state.flags.tablinum_waxScraped ? 'square' : 'wax';
  },

  hints(state) {
    if (state.flags.tablinum_waxScraped) {
      return [
        { text: 'You hold the first two lines of the square; the frame fixes the third. The plaque above tells you the rest.', cost: 60 },
        { text: 'It reads the same four ways: the last row is the first row backward, the fourth is the second backward.', cost: 120 },
        { text: 'SATOR / AREPO / TENET / OPERA / ROTAS.', cost: 240 },
      ];
    }
    return [
      { text: 'The door wants the doorpost charm from the shrine — all five lines of it. You have one line; the desk hides another, under new wax.', cost: 60 },
      { text: 'Old tablets get re-waxed, not erased. Shave the wax with something a bathhouse would lend you.', cost: 120 },
      { text: 'Hold the strigil and use it on the desk tablet: A-R-E-P-O, the second line.', cost: 240 },
    ];
  },
};

function openSquare(game) {
  // grid[r][c] = letter or null; row 2 (index) fixed TENET
  const grid = SQUARE.map((row, r) => row.split('').map(ch => (r === 2 ? ch : null)));
  let tray = TRAY.slice();
  let picked = -1; // index into tray

  game.openPuzzle({
    id: 'tablinum_square',
    title: "The Sower's Square",
    wide: true,
    render(body, api) {
      body.innerHTML = `
        <p class="puzzle-desc">Five by five, the middle row riveted fast: T E N E T.
        Above the frame: <em>QVATTVOR VIIS LEGITVR — it reads by four roads</em> — the
        same left to right, right to left, top to bottom, bottom to top. Pick a tile,
        then a cell; click a placed tile to take it back.</p>
        <div class="sator-grid" id="tab-grid"></div>
        <div class="sator-tray" id="tab-tray"></div>
        <div class="puzzle-row"><button class="btn btn-primary" id="tab-try">Turn the Frame</button></div>
        <div class="puzzle-feedback"></div>`;

      const gridEl = body.querySelector('#tab-grid');
      const trayEl = body.querySelector('#tab-tray');

      const paint = () => {
        gridEl.innerHTML = '';
        grid.forEach((row, r) => row.forEach((ch, c) => {
          const cell = document.createElement('button');
          cell.className = 'sator-cell' + (r === 2 ? ' fixed' : '');
          cell.textContent = ch || '';
          if (r !== 2) {
            cell.addEventListener('click', () => {
              if (grid[r][c]) {           // take the tile back
                tray.push(grid[r][c]);
                grid[r][c] = null;
              } else if (picked >= 0) {   // place the picked tile
                grid[r][c] = tray[picked];
                tray.splice(picked, 1);
                picked = -1;
              }
              game.playSfx('click');
              paint();
            });
          }
          gridEl.appendChild(cell);
        }));
        trayEl.innerHTML = '';
        tray.forEach((ch, i) => {
          const tile = document.createElement('button');
          tile.className = 'sator-tile' + (i === picked ? ' picked' : '');
          tile.textContent = ch;
          tile.addEventListener('click', () => {
            picked = (picked === i) ? -1 : i;
            game.playSfx('click');
            paint();
          });
          trayEl.appendChild(tile);
        });
      };
      paint();

      body.querySelector('#tab-try').addEventListener('click', () => {
        const ok = grid.every((row, r) => row.join('') === SQUARE[r]);
        if (ok) {
          game.setFlag('tablinum_squareSolved');
          game.playSfx('unlock');
          api.solved({ message: 'The frame turns a full quarter with a sound like a millstone forgiving someone, and the strongroom door — held shut its whole life by superstition — remembers it is only a door.' });
          game.refreshScene();
        } else {
          api.fail('The frame refuses to turn. Somewhere in the square, a road reads wrong.');
        }
      });
    },
  });
}
