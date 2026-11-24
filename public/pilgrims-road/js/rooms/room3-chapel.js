// ROOM 3 — The Chapel.
// Puzzle: the Lily Carillon — ring the bells C, E, A, D, B, C
// (saints ordered by lilies held; the shepherd Cuthbert rings first AND last).

import { kitDefs, panel, shadow, grounded } from '../../../shared/js/scenekit.js';
import { registerItems } from '../../../shared/js/items.js';

registerItems({
  silver_key: {
    name: 'Silver Key',
    description: 'Fine silverwork, cold as chapel air. The tag reads: "Scriptorium".',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="15" r="8" fill="none" stroke="#c8d4e8" stroke-width="3"/>
      <path d="M21 21 L38 38 M32 32 l6 -2 M35 38 l5 -4" stroke="#c8d4e8" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`,
  },
  holy_oil: {
    name: 'Vial of Holy Oil',
    description: '"For the easing of hinges and of souls." Amber, and slow to pour.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 8 h8 v8 q8 4 8 14 q0 12 -12 12 q-12 0 -12 -12 q0 -10 8 -14 z" fill="none" stroke="#c9a227" stroke-width="3"/>
      <path d="M15 30 q9 -6 18 0 q0 9 -9 9 q-9 0 -9 -9z" fill="#e8973a" opacity="0.85"/>
      <rect x="19" y="4" width="10" height="5" rx="2" fill="#8a6d1c"/>
    </svg>`,
  },
});

// bell definitions: saint, note letter, frequency, lilies in their window panel
// Layout — read off the plate (art/chapel.webp) and shared with hotspots().
const WIN = { x: 664, top: 112, bottom: 344, light: 54, gap: 8, get w() { return this.light * 5 + this.gap * 4; } };
const BEAM = { x1: 520, x2: 1080, y: 452 };
const bellX = i => BEAM.x1 + 40 + i * ((BEAM.x2 - BEAM.x1 - 80) / 4);
const CRYPT = 'M222 782 L222 472 Q291 404 360 472 L360 782 Z';
const SUN3 = { cx: 291, cy: 392 };
const R = {
  window:    { x: 650, y: 84, w: 320, h: 286 },
  plaque:    { x: 630, y: 376, w: 360, h: 60 },
  candles:   { x: 40, y: 680, w: 180, h: 150 },
  psalter:   { x: 1180, y: 540, w: 150, h: 250 },
  sun3:      { x: 236, y: 348, w: 120, h: 80 },
  crypt:     { x: 224, y: 450, w: 136, h: 320 },
  reliquary: { x: 700, y: 580, w: 200, h: 120 },
  door:      { x: 1450, y: 350, w: 140, h: 440 },
};

const BELLS = [
  { saint: 'Cuthbert', note: 'C', freq: 261.63, lilies: 1, crook: true },
  { saint: 'Edmund',   note: 'E', freq: 329.63, lilies: 2, crook: false },
  { saint: 'Agnes',    note: 'A', freq: 440.00, lilies: 3, crook: false },
  { saint: 'Dunstan',  note: 'D', freq: 293.66, lilies: 4, crook: false },
  { saint: 'Brendan',  note: 'B', freq: 246.94, lilies: 5, crook: false },
];
const SOLUTION = ['C', 'E', 'A', 'D', 'B', 'C'];

let seq = [];   // in-progress ring sequence (module scope survives refreshScene)

const GLASS_COLORS = ['#4a6fa5', '#7a4a8f', '#3f7a5e', '#8f4a4a', '#8a6d3c'];

export default {
  id: 'chapel',
  lintStates: [{ label: 'open', flags: { chapel_reliquaryOpen: true } }],
  title: 'The Chapel',
  intro: 'The stair opens behind the altar of a narrow chapel. Moonlight falls in five colours through the saints\' window, and five hand bells wait in their frame — the old monks\' carillon, silent these forty years. Dust like held breath.',

  scene(state) {
    const solved = !!state.flags.chapel_reliquaryOpen;
    const taken = !!state.flags.chapel_itemsTaken;

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <style>
        @keyframes chapel_bellring {
          0% { transform: rotate(0deg); } 20% { transform: rotate(-16deg); }
          45% { transform: rotate(13deg); } 70% { transform: rotate(-8deg); }
          88% { transform: rotate(4deg); } 100% { transform: rotate(0deg); }
        }
        .chapel-bell { transform-box: fill-box; transform-origin: 50% 0%; }
        .chapel-bell.bell-ring { animation: chapel_bellring 0.9s ease-out; }
      </style>
      <defs>
        ${kitDefs()}
        <linearGradient id="gd_ch_wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#10141f"/>
          <stop offset="1" stop-color="#1e2433"/>
        </linearGradient>
        <linearGradient id="gd_ch_moon" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stop-color="rgba(174,191,221,0.32)"/>
          <stop offset="1" stop-color="rgba(174,191,221,0)"/>
        </linearGradient>
        <linearGradient id="gd_ch_floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#20242f"/>
          <stop offset="1" stop-color="#0e1119"/>
        </linearGradient>
        <radialGradient id="gd_ch_candle" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(255,190,110,0.5)"/>
          <stop offset="1" stop-color="rgba(255,190,110,0)"/>
        </radialGradient>
      </defs>

      <!-- background plate (generated): tall blind lancet arch (centre), altar, candle ledge (left),
           the crypt-stair arch (left wall). Glass, bells and furniture are set into those. -->
      <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="art/chapel.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="art/chapel.mp4" type="video/mp4"/></video></foreignObject>

      <!-- five-light saints' window, glazed into the painted lancet arch -->
      <g data-mount="inset">
        <path d="M${WIN.x - 14} ${WIN.bottom + 4} L${WIN.x - 14} ${WIN.top + 30} Q${WIN.x - 10} ${WIN.top - 50} ${WIN.x + WIN.w / 2} ${WIN.top - 76} Q${WIN.x + WIN.w + 10} ${WIN.top - 50} ${WIN.x + WIN.w + 14} ${WIN.top + 30} L${WIN.x + WIN.w + 14} ${WIN.bottom + 4} Z" fill="#06080e" opacity="0.88"/>
        ${BELLS.map((b, i) => {
          const x = WIN.x + i * (WIN.light + WIN.gap);
          const L = WIN.light;
          const arch = `M${x} ${WIN.bottom} L${x} ${WIN.top + 26} Q${x + L / 2} ${WIN.top - 18} ${x + L} ${WIN.top + 26} L${x + L} ${WIN.bottom} Z`;
          return `
          <g>
            <clipPath id="clip_saint_${i}"><path d="${arch}"/></clipPath>
            <image href="art/ch-saint-${i}.webp" x="${x - 30}" y="${WIN.top - 20}" width="${L + 60}" height="${WIN.bottom - WIN.top + 20}"
              preserveAspectRatio="xMidYMid slice" clip-path="url(#clip_saint_${i})"/>
            <path d="${arch}" fill="none" stroke="#0a0d15" stroke-width="5"/>
            <!-- authoritative lily count (this saint's puzzle number), stacked in the glass -->
            <rect x="${x + 6}" y="${WIN.bottom - 16 - b.lilies * 17}" width="${L - 12}" height="${b.lilies * 17 + 8}" rx="7" fill="rgba(6,10,20,0.72)"/>
            ${Array.from({ length: b.lilies }, (_, k) =>
              `<g transform="translate(${x + L / 2} ${WIN.bottom - 18 - k * 17})">
                 <path d="M0 6 q-5 -10 0 -13 q5 3 0 13 M0 6 q-9 -2 -9 -8 M0 6 q9 -2 9 -8"
                   stroke="#ffffff" stroke-width="2.4" fill="none" stroke-linecap="round"/>
               </g>`).join('')}
          </g>`;
        }).join('')}
        <!-- stone sill with the saints' names cut into it -->
        <rect x="${WIN.x - 16}" y="${WIN.bottom}" width="${WIN.w + 32}" height="22" fill="url(#sk_stone)" stroke="#2c2418" stroke-width="2"/>
        ${BELLS.map((b, i) => `<text x="${WIN.x + i * (WIN.light + WIN.gap) + WIN.light / 2}" y="${WIN.bottom + 16.5}" text-anchor="middle" font-size="11.5" fill="#1e170d"${b.saint.length > 5 ? ` textLength="${WIN.light - 4}" lengthAdjust="spacingAndGlyphs"` : ''}
            font-family="Palatino Linotype, Georgia, serif" font-weight="bold">${b.saint.toUpperCase()}</text>`).join('')}
        <!-- moonlight through the glass -->
        <path d="M${WIN.x} ${WIN.top} L${WIN.x + WIN.w} ${WIN.top} L1260 900 L420 900 Z" fill="url(#gd_ch_moon)" class="moonbeam"/>
      </g>

      <!-- brass plaque, bolted to the wall beneath the window -->
      ${panel({ ...R.plaque, material: 'brass', mount: 'bolts', rx: 4, body: `
        <text x="${R.plaque.x + R.plaque.w / 2}" y="${R.plaque.y + 24}" text-anchor="middle" font-size="13.5" fill="#2b1f08" font-weight="bold"
          font-family="Palatino Linotype, Georgia, serif">SING AS THE LILIES BLOOM;</text>
        <text x="${R.plaque.x + R.plaque.w / 2}" y="${R.plaque.y + 43}" text-anchor="middle" font-size="13.5" fill="#2b1f08" font-weight="bold"
          font-family="Palatino Linotype, Georgia, serif">LET THE SHEPHERD SING FIRST AND LAST.</text>` })}

      <!-- the bell-beam, its ends set on stone corbels in the two piers; each saint's name cut into it -->
      <g data-mount="bracket">
        ${[BEAM.x1, BEAM.x2].map(x => `<path d="M${x - 26} ${BEAM.y + 28} L${x + 26} ${BEAM.y + 28} L${x + 14} ${BEAM.y + 58} L${x - 14} ${BEAM.y + 58} Z" fill="url(#sk_stone)" stroke="#2c2418" stroke-width="2"/>`).join('')}
        <rect x="${BEAM.x1 - 30}" y="${BEAM.y}" width="${BEAM.x2 - BEAM.x1 + 60}" height="28" rx="3" fill="url(#sk_darkwood)" stroke="#120b05" stroke-width="2" filter="url(#sk_drop)"/>
        ${BELLS.map((b, i) => `<text x="${bellX(i)}" y="${BEAM.y + 19}" text-anchor="middle" font-size="11" fill="#d8c79c" font-style="italic"
            font-family="Palatino Linotype, Georgia, serif">${b.saint}</text>`).join('')}
        ${BELLS.map((b, i) => `
          <g id="bell_chapel_${i}" class="chapel-bell">
            <line x1="${bellX(i)}" y1="${BEAM.y + 28}" x2="${bellX(i)}" y2="${BEAM.y + 36}" stroke="#3b3f48" stroke-width="4"/>
            <image href="art/ch-bell.webp" x="${bellX(i) - 26}" y="${BEAM.y + 32}" width="52" height="104" preserveAspectRatio="xMidYMid meet"/>
            <text x="${bellX(i)}" y="${BEAM.y + 98}" text-anchor="middle" font-size="20" fill="#fff2cf" stroke="#5a4410" stroke-width="0.6"
              font-family="Palatino Linotype, Georgia, serif" font-weight="bold">${b.note}</text>
          </g>`).join('')}
      </g>

      <!-- candlelight over the painted votive ledge -->
      <ellipse cx="140" cy="760" rx="160" ry="120" fill="url(#gd_ch_candle)" class="glow fast"/>

      <!-- lectern with the psalter, standing on the floor by the right wall -->
      ${grounded({ cx: 1255, baseY: 802, w: 130, body: `<image href="art/ch-lectern.webp" x="1180" y="520" width="150" height="282" preserveAspectRatio="xMidYMid meet"/>` })}

      <!-- reliquary on the painted altar top -->
      <g data-mount="table">
        ${solved ? `
          ${shadow(800, 690, 70, 8)}
          <image href="art/ch-reliquary-open.webp" x="740" y="566" width="120" height="128" preserveAspectRatio="xMidYMid meet"/>
          <ellipse cx="800" cy="680" rx="60" ry="14" fill="rgba(255,190,110,0.10)"/>
          ${taken ? '' : `
            <g class="beckon">
              <image href="art/ch-key.webp" x="756" y="628" width="32" height="50" preserveAspectRatio="xMidYMid meet"/>
              <image href="art/ch-oil.webp" x="808" y="626" width="36" height="52" preserveAspectRatio="xMidYMid meet"/>
            </g>`}`
        : `${shadow(800, 690, 86, 9)}<image href="art/ch-reliquary.webp" x="712" y="604" width="176" height="90" preserveAspectRatio="xMidYMid meet"/>`}
      </g>

      <!-- the crypt stair, seen through the painted arch on the left wall; sun-mark #3 on its keystone -->
      <g>
        <clipPath id="clip_ch_crypt"><path d="${CRYPT}"/></clipPath>
        <image href="art/ch-crypt.webp" x="214" y="420" width="152" height="360" preserveAspectRatio="xMidYMid slice" clip-path="url(#clip_ch_crypt)" opacity="0.92"/>
        <g class="beckon" data-mount="inset">
          ${[0, 1, 2, 3].map(i => {
            const a = (i / 4) * Math.PI * 2 - Math.PI / 4;
            return `<line x1="${SUN3.cx + Math.cos(a) * 11}" y1="${SUN3.cy + Math.sin(a) * 11}" x2="${SUN3.cx + Math.cos(a) * 25}" y2="${SUN3.cy + Math.sin(a) * 25}" stroke="#e8c85a" stroke-width="3" stroke-linecap="round"/>`;
          }).join('')}
          <circle cx="${SUN3.cx}" cy="${SUN3.cy}" r="8" fill="none" stroke="#e8c85a" stroke-width="3"/>
          <text x="${SUN3.cx + 34}" y="${SUN3.cy + 7}" font-size="20" fill="#e8c85a" font-family="Palatino Linotype, Georgia, serif">U</text>
        </g>
      </g>

      <!-- door to the cloister, set into the right wall (perspective) -->
      <g data-mount="wall">
        <path d="M1452 392 L1584 336 L1584 806 L1452 752 Z" fill="url(#sk_darkwood)" stroke="#0b0703" stroke-width="5"/>
        ${[0.25, 0.5, 0.75].map(t => `<line x1="1452" y1="${392 + (752 - 392) * t}" x2="1584" y2="${336 + (806 - 336) * t}" stroke="#2b2116" stroke-width="7"/>`).join('')}
        <path d="M1452 392 L1584 336 L1584 806 L1452 752 Z" fill="#000" opacity="0.45"/>
        <circle cx="1478" cy="580" r="9" fill="none" stroke="#7d8494" stroke-width="3"/>
        ${shadow(1518, 790, 80, 10)}
      </g>

      <path d="M0 900 L0 858 Q800 908 1600 858 L1600 900 Z" fill="#05070d"/>
    </svg>`;
  },

  hotspots(state) {
    const solved = !!state.flags.chapel_reliquaryOpen;
    const taken = !!state.flags.chapel_itemsTaken;
    const spots = [];

    spots.push({
      id: 'window', ...R.window, label: 'The saints\' window',
      onInteract(game) {
        const html = `<p>Five saints in coloured glass, each holding lilies:</p>
          <ul style="line-height:2; margin: 8px 0 8px 22px;">
            <li><strong>Cuthbert</strong> — <strong>1 lily</strong>, and a <strong>shepherd's crook</strong> (he alone carries one)</li>
            <li><strong>Edmund</strong> — <strong>2 lilies</strong></li>
            <li><strong>Agnes</strong> — <strong>3 lilies</strong></li>
            <li><strong>Dunstan</strong> — <strong>4 lilies</strong></li>
            <li><strong>Brendan</strong> — <strong>5 lilies</strong></li>
          </ul>
          <p style="color:var(--text-dim); font-style:italic;">The moon lights each count plainly. No squinting required.</p>`;
        game.journal.add('note_window', { title: "The saints' window (Chapel)", category: 'note', html });
        game.dialog({ title: 'The Saints in Glass', wide: true, html });
      },
    });

    spots.push({
      id: 'plaque', ...R.plaque, label: 'Brass plaque',
      onInteract(game) {
        const html = `<div class="parchment-note"><div class="note-title">Brass, polished by centuries of thumbs</div>
          <p>"SING AS THE LILIES BLOOM;<br>LET THE SHEPHERD SING FIRST AND LAST."</p></div>`;
        game.journal.add('note_plaque', { title: 'Carillon plaque (Chapel)', category: 'note', html });
        game.dialog({ title: 'The Plaque', html });
      },
    });

    // the five bells — playable directly in the scene
    BELLS.forEach((bell, i) => {
      spots.push({
        id: `bell_${i}`, x: 470 + i * 160 - 55, y: 500, w: 110, h: 140, label: `${bell.saint}'s bell (${bell.note})`,
        onInteract(game) { ringBell(game, i); },
      });
    });

    spots.push({
      id: 'candles', ...R.candles, label: 'Votive candles',
      onInteract(game) { game.say('Four small flames for four small prayers. Someone still lights them — the castle is not as godless as its lord.'); },
    });

    spots.push({
      id: 'psalter', ...R.psalter, label: 'The psalter',
      onInteract(game) { game.say('A psalter open to the office of Lauds — the dawn prayer. You would rather not be here to hear it sung.'); },
    });

    spots.push({
      id: 'sun3', ...R.sun3, label: 'A carved sun',
      onInteract(game) {
        game.journal.add('sun3', { title: 'Chapel — the crypt-stair arch', category: 'sun', sun: { rays: 4, letter: 'U' } });
        game.say('On the keystone of the crypt arch: a sun of four rays, and the letter U. Edmund passed this way.');
      },
    });

    spots.push({
      id: 'crypt', ...R.crypt, label: 'Crypt stair',
      onInteract(game) { game.say('Steps down into standing water and bones. Edmund\'s road does not drown; it climbs. The mark is on the arch, not the stair.'); },
    });

    if (!solved) {
      spots.push({
        id: 'reliquary', ...R.reliquary, label: 'Bronze reliquary — locked',
        onInteract(game) {
          game.say('A bronze reliquary bound to the altar, no keyhole at all. Around its lid, engraved: five tiny bells. It listens, rather than opens.');
        },
      });
    } else if (!taken) {
      spots.push({
        id: 'reliquary_open', ...R.reliquary, label: 'Inside the reliquary',
        onInteract(game) {
          game.setFlag('chapel_itemsTaken');
          game.addItem('silver_key', { from: { x: 772, y: 652 }, silent: true });
          game.addItem('holy_oil', { from: { x: 826, y: 652 }, silent: true });
          game.say('Inside, on faded velvet: a silver key tagged "Scriptorium", and a vial of amber oil — "for the easing of hinges and of souls."');
          game.refreshScene();
        },
      });
    }

    spots.push({
      id: 'door', ...R.door, label: 'Door to the cloister',
      onInteract(game) {
        if (!solved) {
          game.say('A stout door to the cloister garth — locked. The lock plate is stamped with a quill: the scriptorium\'s key opens it, wherever that key is.');
        } else if (!taken) {
          game.say('Locked still. Whatever the reliquary holds, you will want it before you cross the garth.');
        } else if (!game.journal.has('sun3')) {
          game.journal.add('sun3', { title: 'Chapel — the crypt-stair arch', category: 'sun', sun: { rays: 4, letter: 'U' } });
          game.say('Passing the crypt-stair you glance up: a sun of four rays on the keystone, and the letter U. You copy it down, turn the silver key, and slip across the paling garth.');
          game.completeRoom({ delay: 3000 });
        } else {
          game.say('The silver key turns like it was oiled yesterday. You slip across the moonlit garth — the sky at its edges has begun, very faintly, to pale.');
          game.completeRoom({ delay: 900 });
        }
      },
    });

    return spots;
  },

  hints: [
    { text: 'The window is the hymn sheet. What differs between the five saints in the glass?', cost: 60 },
    { text: 'Order the bells by each saint\'s lilies, one to five. And one saint carries a shepherd\'s crook — the plaque gives him two turns: first AND last.', cost: 120 },
    { text: 'Ring: Cuthbert, Edmund, Agnes, Dunstan, Brendan, then Cuthbert again — C, E, A, D, B, C.', cost: 240 },
  ],
};

function ringBell(game, i) {
  const bell = BELLS[i];
  game.playBell(bell.freq);

  // swing animation on the scene element
  const el = document.getElementById(`bell_chapel_${i}`);
  if (el) {
    el.classList.remove('bell-ring');
    void el.getBoundingClientRect();
    el.classList.add('bell-ring');
  }

  if (game.getFlag('chapel_reliquaryOpen')) return;   // free play after solving

  seq.push(bell.note);
  const target = SOLUTION.slice(0, seq.length);
  if (seq.join('') !== target.join('')) {
    seq = [];
    setTimeout(() => game.playSfx('wrong'), 350);
    game.say('The note lands wrong — a flat, embarrassed discord. The chapel forgets the phrase; begin again.');
    return;
  }
  if (seq.length === SOLUTION.length) {
    seq = [];
    game.setFlag('chapel_reliquaryOpen');
    setTimeout(() => {
      game.playSfx('solve');
      game.say('The last C rings against the first like a returning tide — and inside the altar, something bronze answers. The reliquary lid lifts on silent hinges.');
      game.refreshScene();
    }, 700);
  } else if (seq.length === 3) {
    game.say('The phrase is holding together. The dust itself seems to lean in.');
  }
}
