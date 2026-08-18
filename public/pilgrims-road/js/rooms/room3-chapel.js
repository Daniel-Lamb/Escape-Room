// ROOM 3 — The Chapel.
// Puzzle: the Lily Carillon — ring the bells C, E, A, D, B, C
// (saints ordered by lilies held; the shepherd Cuthbert rings first AND last).

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

      <!-- background plate (generated); stained glass, bells, altar & props layer on top -->
      <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="art/chapel.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="art/chapel.mp4" type="video/mp4"/></video></foreignObject>

      <!-- five-panel stained glass window -->
      <g>
        ${BELLS.map((b, i) => {
          const x = 330 + i * 130;
          const arch = `M${x} 340 L${x} 130 Q${x + 55} 70 ${x + 110} 130 L${x + 110} 340 Z`;
          return `
          <g>
            <clipPath id="clip_saint_${i}"><path d="${arch}"/></clipPath>
            <image href="art/ch-saint-${i}.webp" x="${x - 4}" y="66" width="118" height="278"
              preserveAspectRatio="xMidYMid slice" clip-path="url(#clip_saint_${i})"/>
            <path d="${arch}" fill="none" stroke="#0a0d15" stroke-width="6"/>
            <!-- authoritative lily count (this saint's puzzle number) -->
            <rect x="${x + 55 - b.lilies * 10}" y="284" width="${b.lilies * 20}" height="26" rx="9" fill="rgba(6,10,20,0.68)"/>
            ${Array.from({ length: b.lilies }, (_, k) =>
              `<g transform="translate(${x + 55 - (b.lilies - 1) * 10 + k * 20} 297)">
                 <path d="M0 7 q-6 -11 0 -15 q6 4 0 15 M0 7 q-10 -2 -10 -9 M0 7 q10 -2 10 -9"
                   stroke="#ffffff" stroke-width="2.6" fill="none" stroke-linecap="round"/>
               </g>`).join('')}
            <!-- name scroll -->
            <rect x="${x + 12}" y="314" width="86" height="20" rx="4" fill="#e8d9b0" opacity="0.92"/>
            <text x="${x + 55}" y="329" text-anchor="middle" font-size="14" fill="#2b2015"
              font-family="Palatino Linotype, Georgia, serif" font-weight="bold">${b.saint.toUpperCase()}</text>
          </g>`;
        }).join('')}
        <!-- moonbeam through the window -->
        <path d="M320 120 L1100 120 L1350 900 L560 900 Z" fill="url(#gd_ch_moon)" class="moonbeam"/>
      </g>

      <!-- brass plaque beneath window -->
      <image href="art/ch-plaque.webp" x="556" y="362" width="448" height="72" preserveAspectRatio="none"/>
      <text x="780" y="396" text-anchor="middle" font-size="17" fill="#2b1f08" font-weight="bold"
        font-family="Palatino Linotype, Georgia, serif" letter-spacing="1">SING AS THE LILIES BLOOM;</text>
      <text x="780" y="417" text-anchor="middle" font-size="17" fill="#2b1f08" font-weight="bold"
        font-family="Palatino Linotype, Georgia, serif" letter-spacing="1">LET THE SHEPHERD SING FIRST AND LAST.</text>

      <!-- bell frame -->
      <g>
        <rect x="380" y="470" width="800" height="18" rx="6" fill="#4a3520"/>
        <rect x="380" y="470" width="18" height="180" fill="#4a3520"/>
        <rect x="1162" y="470" width="18" height="180" fill="#4a3520"/>
        ${BELLS.map((b, i) => {
          const x = 470 + i * 160;
          return `
          <g id="bell_chapel_${i}" class="chapel-bell">
            <image href="art/ch-bell.webp" x="${x - 28}" y="486" width="56" height="120" preserveAspectRatio="xMidYMid meet"/>
            <text x="${x}" y="556" text-anchor="middle" font-size="22" fill="#fff2cf" stroke="#5a4410" stroke-width="0.6"
              font-family="Palatino Linotype, Georgia, serif" font-weight="bold">${b.note}</text>
            <text x="${x}" y="628" text-anchor="middle" font-size="13" fill="#cbb98f"
              font-family="Palatino Linotype, Georgia, serif" font-style="italic">${b.saint}</text>
          </g>`;
        }).join('')}
      </g>

      <!-- votive candles -->
      <g>
        <ellipse cx="180" cy="520" rx="150" ry="110" fill="url(#gd_ch_candle)" class="glow fast"/>
        ${[[120, 560], [160, 545], [205, 558], [245, 548]].map(([x, y]) => `
          <rect x="${x - 6}" y="${y}" width="12" height="26" rx="2" fill="#e8d9b0"/>
          <path class="torch-flame fast" d="M${x} ${y - 16} q5 7 0 14 q-5 -7 0 -14z" fill="#ffd9a0"/>`).join('')}
        <rect x="90" y="586" width="190" height="12" rx="4" fill="#3a2d1c"/>
      </g>

      <!-- lectern with psalter -->
      <g>
        <path d="M1300 640 l60 0 -8 -110 -44 0 z" fill="#4a3520"/>
        <rect x="1272" y="512" width="116" height="24" rx="4" fill="#38290f" transform="rotate(-12 1330 524)"/>
        <rect x="1280" y="496" width="100" height="18" rx="2" fill="#7a1f2b" transform="rotate(-12 1330 505)"/>
      </g>

      <!-- altar + reliquary -->
      <g>
        <rect x="620" y="660" width="320" height="30" rx="6" fill="#3a3e4f"/>
        <rect x="650" y="690" width="260" height="120" fill="#2a2d3a"/>
        <g>
          ${solved ? `
            <image href="art/ch-reliquary-open.webp" x="705" y="614" width="150" height="178" preserveAspectRatio="xMidYMid meet"/>
            <ellipse cx="780" cy="740" rx="70" ry="18" fill="rgba(255,190,110,0.10)"/>
            ${taken ? '' : `
              <g class="beckon">
                <image href="art/ch-key.webp" x="726" y="700" width="38" height="58" preserveAspectRatio="xMidYMid meet"/>
                <image href="art/ch-oil.webp" x="796" y="698" width="42" height="60" preserveAspectRatio="xMidYMid meet"/>
              </g>`}`
          : `<image href="art/ch-reliquary.webp" x="690" y="652" width="180" height="98" preserveAspectRatio="xMidYMid meet"/>`}
        </g>
      </g>

      <!-- crypt-stair arch with sun-mark #3 -->
      <g>
        <path d="M60 640 L60 380 Q140 300 220 380 L220 640 Z" fill="#05070d"/>
        <path d="M60 640 L60 380 Q140 300 220 380 L220 640" fill="none" stroke="#3a3e4f" stroke-width="10"/>
        <g class="beckon">
          <image href="art/oub-sun.webp" x="108" y="322" width="64" height="66" preserveAspectRatio="xMidYMid meet"/>
          <text x="182" y="362" font-size="20" fill="#e8c85a" font-family="Palatino Linotype, Georgia, serif">U</text>
        </g>
      </g>

      <path d="M0 900 L0 858 Q800 908 1600 858 L1600 900 Z" fill="#05070d"/>
    </svg>`;
  },

  hotspots(state) {
    const solved = !!state.flags.chapel_reliquaryOpen;
    const taken = !!state.flags.chapel_itemsTaken;
    const spots = [];

    spots.push({
      id: 'window', x: 320, y: 70, w: 790, h: 290, label: 'The saints\' window',
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
      id: 'plaque', x: 560, y: 366, w: 440, h: 66, label: 'Brass plaque',
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
      id: 'candles', x: 80, y: 500, w: 210, h: 110, label: 'Votive candles',
      onInteract(game) { game.say('Four small flames for four small prayers. Someone still lights them — the castle is not as godless as its lord.'); },
    });

    spots.push({
      id: 'psalter', x: 1265, y: 480, w: 130, h: 160, label: 'The psalter',
      onInteract(game) { game.say('A psalter open to the office of Lauds — the dawn prayer. You would rather not be here to hear it sung.'); },
    });

    spots.push({
      id: 'sun3', x: 90, y: 310, w: 120, h: 90, label: 'A carved sun',
      onInteract(game) {
        game.journal.add('sun3', { title: 'Chapel — the crypt-stair arch', category: 'sun', sun: { rays: 4, letter: 'U' } });
        game.say('On the keystone of the crypt arch: a sun of four rays, and the letter U. Edmund passed this way.');
      },
    });

    spots.push({
      id: 'crypt', x: 66, y: 380, w: 150, h: 250, label: 'Crypt stair',
      onInteract(game) { game.say('Steps down into standing water and bones. Edmund\'s road does not drown; it climbs. The mark is on the arch, not the stair.'); },
    });

    if (!solved) {
      spots.push({
        id: 'reliquary', x: 690, y: 670, w: 180, h: 90, label: 'Bronze reliquary — locked',
        onInteract(game) {
          game.say('A bronze reliquary bound to the altar, no keyhole at all. Around its lid, engraved: five tiny bells. It listens, rather than opens.');
        },
      });
    } else if (!taken) {
      spots.push({
        id: 'reliquary_open', x: 690, y: 670, w: 180, h: 90, label: 'Inside the reliquary',
        onInteract(game) {
          game.setFlag('chapel_itemsTaken');
          game.addItem('silver_key', { from: { x: 750, y: 722 }, silent: true });
          game.addItem('holy_oil', { from: { x: 805, y: 716 }, silent: true });
          game.say('Inside, on faded velvet: a silver key tagged "Scriptorium", and a vial of amber oil — "for the easing of hinges and of souls."');
          game.refreshScene();
        },
      });
    }

    spots.push({
      id: 'door', x: 1440, y: 360, w: 150, h: 300, label: 'Door to the cloister',
      onInteract(game) {
        if (!solved) {
          game.say('A stout door to the cloister garth — locked. The lock plate is stamped with a quill: the scriptorium\'s key opens it, wherever that key is.');
        } else if (!taken) {
          game.say('Locked still. Whatever the reliquary holds, you will want it before you cross the garth.');
        } else if (!game.journal.has('sun3')) {
          game.say('"Mark each sun along the road." Edmund\'s mark watches you from the crypt-stair arch — sketch it before you cross the garth.');
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
