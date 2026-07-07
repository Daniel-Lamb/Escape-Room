// ROOM 1 — The Oubliette. Tutorial difficulty.
// Puzzle: Edmund's verse grate — count crows (7), rats (4), chains (2),
// set the three numeral rings to VII / IV / II.

import { registerItems } from '../../../shared/js/items.js';

registerItems({
  candle_stub: {
    name: 'Tallow Candle Stub',
    description: 'Half a finger of grease and a blackened wick. It wants a flame.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="16" width="12" height="22" rx="2" fill="#e8d9b0"/>
      <path d="M18 18 Q21 22 19 26 L18 26 Z" fill="#d9c493"/>
      <line x1="24" y1="16" x2="24" y2="10" stroke="#4a4a4a" stroke-width="2"/>
      <rect x="14" y="38" width="20" height="4" rx="2" fill="#8a6d1c"/>
    </svg>`,
  },
  bent_spoon: {
    name: 'Bent Dose-Spoon',
    description: 'A worn dose-spoon, its bowl marked with a single notch. Junk — probably.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="16" cy="14" rx="9" ry="7" fill="none" stroke="#9a9a8a" stroke-width="2.5"/>
      <path d="M22 19 Q30 26 34 38" fill="none" stroke="#9a9a8a" stroke-width="3" stroke-linecap="round"/>
      <line x1="13" y1="10" x2="16" y2="13" stroke="#9a9a8a" stroke-width="1.5"/>
    </svg>`,
  },
});

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

function grateOpen(state) { return !!state.flags.oubliette_grateOpen; }

export default {
  id: 'oubliette',
  title: 'The Oubliette',
  intro: 'You wake on wet straw at the bottom of a stone throat. Far above, a torch gutters. They said: at dawn, the rope. But scratched into the wall beside you, in an old man\'s careful hand, someone has left... verses.',

  scene(state) {
    const candleHere = !state.inventory.includes('candle_stub') && !state.flags.oubliette_candleTaken;
    const spoonHere = !state.inventory.includes('bent_spoon') && !state.flags.oubliette_spoonTaken;
    const open = grateOpen(state);

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gd_oub_wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#131725"/>
          <stop offset="0.55" stop-color="#232736"/>
          <stop offset="1" stop-color="#2e3242"/>
        </linearGradient>
        <radialGradient id="gd_oub_torch" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(255,169,77,0.55)"/>
          <stop offset="0.4" stop-color="rgba(255,169,77,0.22)"/>
          <stop offset="1" stop-color="rgba(255,169,77,0)"/>
        </radialGradient>
        <radialGradient id="gd_oub_floor" cx="0.5" cy="0.3" r="0.9">
          <stop offset="0" stop-color="#3d3627"/>
          <stop offset="0.6" stop-color="#2b2619"/>
          <stop offset="1" stop-color="#171410"/>
        </radialGradient>
        <linearGradient id="gd_oub_grate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#3c4152"/>
          <stop offset="1" stop-color="#20242f"/>
        </linearGradient>
      </defs>

      <!-- curved pit wall -->
      <rect x="0" y="0" width="1600" height="640" fill="url(#gd_oub_wall)"/>
      <!-- ashlar block courses, curving -->
      <g stroke="#11141f" stroke-width="5" fill="none" opacity="0.8">
        ${[80, 170, 262, 356, 452, 550].map(y =>
          `<path d="M0 ${y} Q800 ${y + 28} 1600 ${y}"/>`).join('')}
        ${[140, 420, 700, 980, 1260, 1540].map((x, i) =>
          `<line x1="${x}" y1="${i % 2 ? 90 : 20}" x2="${x + 12}" y2="620"/>`).join('')}
      </g>
      <!-- damp streaks -->
      <path d="M310 0 q-8 300 6 620" stroke="rgba(10,14,24,0.55)" stroke-width="40" fill="none"/>
      <path d="M1210 0 q10 320 -4 620" stroke="rgba(10,14,24,0.45)" stroke-width="56" fill="none"/>

      <!-- straw floor -->
      <ellipse cx="800" cy="780" rx="980" ry="220" fill="url(#gd_oub_floor)"/>
      <g stroke="#6b5a2a" stroke-width="3" stroke-linecap="round" opacity="0.7">
        <line x1="420" y1="800" x2="500" y2="784"/><line x1="530" y1="820" x2="610" y2="812"/>
        <line x1="700" y1="836" x2="790" y2="820"/><line x1="900" y1="830" x2="985" y2="842"/>
        <line x1="1080" y1="800" x2="1160" y2="816"/><line x1="1220" y1="840" x2="1300" y2="826"/>
        <line x1="620" y1="790" x2="690" y2="800"/><line x1="980" y1="786" x2="1050" y2="778"/>
      </g>

      <!-- torch, high on the wall -->
      <g>
        <ellipse cx="800" cy="120" rx="330" ry="200" fill="url(#gd_oub_torch)" class="glow"/>
        <rect x="787" y="120" width="26" height="90" rx="6" fill="#4a3520"/>
        <path class="torch-flame" d="M800 40 Q824 76 806 112 Q800 120 794 112 Q776 76 800 40 Z" fill="#ffa94d"/>
        <path class="torch-flame fast" d="M800 62 Q812 84 803 108 Q800 113 797 108 Q788 84 800 62 Z" fill="#ffd9a0"/>
        <circle cx="800" cy="112" r="16" fill="#e07b2a" opacity="0.8"/>
      </g>

      <!-- MURAL: gallows tree with 7 crows (chalk) -->
      <g stroke="#cfd4de" stroke-width="4" fill="none" opacity="0.75" stroke-linecap="round">
        <line x1="300" y1="420" x2="300" y2="250"/>
        <line x1="300" y1="250" x2="470" y2="250"/>
        <line x1="440" y1="250" x2="440" y2="300"/>
        <circle cx="440" cy="316" r="16"/>
      </g>
      <g fill="#cfd4de" opacity="0.85">
        ${[[320, 236], [360, 222], [400, 234], [430, 218], [468, 240], [285, 300], [318, 350]].map(([x, y]) =>
          `<path d="M${x} ${y} q7 -10 14 0 q-4 4 -7 3 l-6 6 z"/>`).join('')}
      </g>

      <!-- MURAL: 4 rats about a loaf (chalk) -->
      <g stroke="#cfd4de" stroke-width="4" fill="none" opacity="0.7" stroke-linecap="round">
        <ellipse cx="1240" cy="300" rx="46" ry="27"/>
        ${[[1160, 268, 1], [1320, 262, -1], [1170, 344, 1], [1312, 348, -1]].map(([x, y, d]) =>
          `<g><ellipse cx="${x}" cy="${y}" rx="24" ry="12"/><circle cx="${x + d * 26}" cy="${y - 5}" r="8"/><path d="M${x - d * 22} ${y} q${-d * 26} 8 ${-d * 36} -2"/></g>`).join('')}
      </g>

      <!-- MURAL: kneeling monk (chalk) -->
      <g stroke="#cfd4de" stroke-width="4" fill="none" opacity="0.6" stroke-linecap="round">
        <circle cx="640" cy="300" r="18"/>
        <path d="M640 318 q-6 30 -28 44 l40 0 q-8 -22 -12 -44"/>
        <path d="M640 330 q22 8 30 26"/>
        <path d="M628 296 a14 14 0 0 1 24 0" opacity="0.8"/>
      </g>

      <!-- chains: two, with empty shackles -->
      <g class="sway slow">
        <g stroke="#565b6c" stroke-width="7" fill="none">
          <path d="M980 180 q6 60 0 130 q-4 50 4 96"/>
        </g>
        <circle cx="984" cy="426" r="26" fill="none" stroke="#565b6c" stroke-width="9"/>
      </g>
      <g class="sway">
        <g stroke="#565b6c" stroke-width="7" fill="none">
          <path d="M1060 190 q-6 66 2 128 q4 44 -2 84"/>
        </g>
        <circle cx="1058" cy="422" r="24" fill="none" stroke="#565b6c" stroke-width="9"/>
      </g>

      <!-- the verse, scratched beside the grate -->
      <g font-family="Palatino Linotype, Georgia, serif" fill="#b9bfcf" opacity="0.85">
        <text x="470" y="500" font-size="26" font-style="italic">"Count the crows upon the gallows-tree..."</text>
        <text x="470" y="534" font-size="20" opacity="0.75">— faint verses, scratched deep. E.</text>
      </g>

      <!-- drain grate with three numeral rings -->
      <g>
        <ellipse cx="700" cy="742" rx="150" ry="64" fill="#0c0f18"/>
        ${open
          ? `<ellipse cx="700" cy="742" rx="132" ry="52" fill="#05070d"/>
             <path d="M582 742 a118 46 0 0 1 236 0" fill="none" stroke="#3c4152" stroke-width="10"/>
             <g transform="translate(818 700) rotate(24)">
               <ellipse cx="0" cy="0" rx="132" ry="52" fill="url(#gd_oub_grate)"/>
               ${[-90, -45, 0, 45, 90].map(x => `<line x1="${x}" y1="-46" x2="${x}" y2="46" stroke="#161a26" stroke-width="8"/>`).join('')}
             </g>`
          : `<ellipse cx="700" cy="742" rx="132" ry="52" fill="url(#gd_oub_grate)"/>
             ${[-90, -45, 0, 45, 90].map(x => `<line x1="${700 + x}" y1="${742 - Math.sqrt(1 - (x / 132) ** 2) * 48}" x2="${700 + x}" y2="${742 + Math.sqrt(1 - (x / 132) ** 2) * 48}" stroke="#161a26" stroke-width="8"/>`).join('')}
             <ellipse cx="700" cy="742" rx="132" ry="52" fill="none" stroke="#494f63" stroke-width="5"/>
             <g font-family="Palatino Linotype, Georgia, serif" font-size="22" fill="#c9a227" text-anchor="middle">
               <text x="640" y="750">${ROMAN[(state.flags.oubliette_r1 ?? 0)]}</text>
               <text x="700" y="756">${ROMAN[(state.flags.oubliette_r2 ?? 0)]}</text>
               <text x="760" y="750">${ROMAN[(state.flags.oubliette_r3 ?? 0)]}</text>
             </g>`}
      </g>

      <!-- sun-mark #1: seven rays, letter R, beside the grate -->
      <g class="beckon">
        <circle cx="530" cy="700" r="16" fill="none" stroke="#c9a227" stroke-width="3.5"/>
        ${Array.from({ length: 7 }, (_, i) => {
          const a = (i / 7) * Math.PI * 2 - Math.PI / 2;
          return `<line x1="${530 + Math.cos(a) * 21}" y1="${700 + Math.sin(a) * 21}"
                        x2="${530 + Math.cos(a) * 32}" y2="${700 + Math.sin(a) * 32}"
                        stroke="#c9a227" stroke-width="3.5" stroke-linecap="round"/>`;
        }).join('')}
        <text x="530" y="762" text-anchor="middle" font-size="26" fill="#c9a227"
          font-family="Palatino Linotype, Georgia, serif">R</text>
      </g>

      <!-- bread board with loaf ${spoonHere ? '+ spoon' : ''} -->
      <g>
        <rect x="1150" y="756" width="220" height="26" rx="8" fill="#4a3520"/>
        <ellipse cx="1225" cy="744" rx="58" ry="26" fill="#8a6d3c"/>
        <path d="M1180 738 q18 -14 44 -10" stroke="#6b5330" stroke-width="4" fill="none"/>
        <path d="M1262 726 q14 8 12 20 l-24 -6 z" fill="#5d4626"/>
        ${spoonHere ? `
        <g transform="translate(1318 742) rotate(18)">
          <ellipse cx="0" cy="0" rx="13" ry="9" fill="none" stroke="#9a9a8a" stroke-width="3"/>
          <path d="M10 6 q12 10 16 26" fill="none" stroke="#9a9a8a" stroke-width="4" stroke-linecap="round"/>
        </g>` : ''}
      </g>

      <!-- candle stub glinting in the straw -->
      ${candleHere ? `
      <g class="beckon">
        <rect x="452" y="812" width="20" height="30" rx="4" fill="#e8d9b0" transform="rotate(-12 462 827)"/>
        <line x1="466" y1="808" x2="470" y2="800" stroke="#4a4a4a" stroke-width="3"/>
        <ellipse cx="462" cy="824" rx="26" ry="12" fill="rgba(232,217,176,0.12)"/>
      </g>` : ''}

      <!-- foreground shadow lip of the pit -->
      <path d="M0 900 L0 840 Q800 920 1600 840 L1600 900 Z" fill="#05070d"/>
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const open = grateOpen(state);

    spots.push({
      id: 'verse', x: 440, y: 440, w: 560, h: 130, label: "Edmund's verses",
      onInteract(game) {
        game.journal.add('note_verse', {
          title: "Edmund's Verse (Oubliette wall)",
          category: 'note',
          html: `<div class="parchment-note aged"><div class="note-title">Scratched into the stone</div>
            <p>"Count the crows upon the gallows-tree,<br>
            count the rats that share my bread,<br>
            count the chains that held me to this stone —<br>
            turn them so, and follow where I fled.<br>
            <strong>Mark each sun along the road.</strong> — E."</p></div>`,
        });
        game.dialog({
          title: 'Verses in the Stone',
          html: `<div class="parchment-note aged"><div class="note-title">An old man's careful hand</div>
            <p>"Count the crows upon the gallows-tree,<br>
            count the rats that share my bread,<br>
            count the chains that held me to this stone —<br>
            turn them so, and follow where I fled.<br>
            <strong>Mark each sun along the road.</strong> — E."</p></div>
            <p style="margin-top:14px; color: var(--text-dim); font-style: italic;">Forty years of grime
            sit in the letters. Whoever E was, he wanted this found. Copied to your journal.</p>`,
        });
      },
    });

    spots.push({
      id: 'gallows', x: 250, y: 190, w: 260, h: 200, label: 'Chalk gallows',
      onInteract(game) {
        game.journal.add('note_gallows', {
          title: 'Chalk mural — the gallows-tree',
          category: 'note',
          html: '<p>A gallows crowded with birds. You count them twice to be sure: <strong>seven crows</strong>.</p>',
        });
        game.say('A gallows-tree drawn in chalk, crowded with birds. You count twice to be certain: seven crows.');
      },
    });

    spots.push({
      id: 'rats', x: 1120, y: 230, w: 260, h: 160, label: 'Chalk rats',
      onInteract(game) {
        game.journal.add('note_rats', {
          title: 'Chalk mural — rats at the loaf',
          category: 'note',
          html: '<p>Rats ringing a drawn loaf of bread: <strong>four rats</strong>, whiskers and all.</p>',
        });
        game.say('Rats drawn ringing a loaf — his bread, shared. Four rats, whiskers and all.');
      },
    });

    spots.push({
      id: 'monk', x: 590, y: 260, w: 130, h: 130, label: 'Chalk figure',
      onInteract(game) {
        game.say('A kneeling monk, hood back, face turned up toward the torch. Drawn by someone who missed being one.');
      },
    });

    spots.push({
      id: 'chains', x: 930, y: 170, w: 180, h: 290, label: 'Wall chains',
      onInteract(game) {
        game.journal.add('note_chains', {
          title: 'The wall chains',
          category: 'note',
          html: '<p><strong>Two chains</strong>, two empty shackles, bolted deep into the stone. Whoever wore them is long gone.</p>',
        });
        game.say('Two chains, two empty shackles. The bolts have wept forty years of rust down the wall.');
      },
    });

    spots.push({
      id: 'sun1', x: 480, y: 650, w: 110, h: 130, label: 'A carved sun',
      onInteract(game) {
        game.journal.add('sun1', {
          title: 'Oubliette — beside the grate',
          category: 'sun',
          sun: { rays: 7, letter: 'R' },
        });
        game.say('A small sun, carved with patience: seven rays, and beneath it the letter R. "Mark each sun along the road."');
      },
    });

    if (!state.inventory.includes('candle_stub') && !state.flags.oubliette_candleTaken) {
      spots.push({
        id: 'candle', x: 410, y: 780, w: 120, h: 90, label: 'Something in the straw',
        onInteract(game) {
          game.setFlag('oubliette_candleTaken');
          game.addItem('candle_stub', { from: { x: 462, y: 824 } });
          game.refreshScene();
        },
      });
    }

    spots.push({
      id: 'board', x: 1140, y: 690, w: 250, h: 110, label: 'Bread board',
      onInteract(game) {
        if (!state.inventory.includes('bent_spoon') && !state.flags.oubliette_spoonTaken) {
          game.setFlag('oubliette_spoonTaken');
          game.addItem('bent_spoon', { from: { x: 1318, y: 742 } });
          game.say('Beside the gnawed loaf, a bent dose-spoon — one notch filed into the bowl. Odd thing to leave a prisoner.');
          game.refreshScene();
        } else {
          game.say('The loaf is stone-hard. The rats in the mural have better bread.');
        }
      },
    });

    spots.push({
      id: 'torch', x: 720, y: 20, w: 160, h: 200, label: 'The torch',
      onInteract(game) {
        game.say('Too high to reach. It has watched a hundred prisoners and helped none of them.');
      },
    });

    if (!open) {
      spots.push({
        id: 'grate', x: 550, y: 680, w: 300, h: 130, label: 'Drain grate — numbered rings',
        onInteract(game) { openGratePuzzle(game); },
      });
    } else {
      spots.push({
        id: 'grate_open', x: 550, y: 680, w: 300, h: 130, label: 'The way down',
        onInteract(game) {
          if (!state.flags.oubliette_candleTaken || !state.flags.oubliette_spoonTaken) {
            game.say('The shaft below is black as a closed book. A prisoner leaves nothing behind — take what little this cell offers first.');
            return;
          }
          if (!game.journal.has('sun1')) {
            game.say('Edmund\'s verse nags at you as you crouch: "Mark each sun along the road." His sun is carved right beside this grate — look at it before you go.');
            return;
          }
          game.completeRoom({ delay: 600 });
        },
      });
    }

    return spots;
  },

  hints: [
    { text: "Edmund's verse is a list. The grate has three rings. Lists have an order.", cost: 60 },
    { text: 'Count what the verse tells you to count: the crows in the chalk drawing, the rats in the chalk drawing, the chains on the wall. Three counts, three rings, same order.', cost: 120 },
    { text: 'Seven crows, four rats, two chains: set the rings to VII, IV, II.', cost: 240 },
  ],
};

function openGratePuzzle(game) {
  const values = [
    game.getFlag('oubliette_r1') ?? 0,
    game.getFlag('oubliette_r2') ?? 0,
    game.getFlag('oubliette_r3') ?? 0,
  ];

  game.openPuzzle({
    id: 'oubliette_grate',
    title: 'The Verse Grate',
    render(body, api) {
      body.innerHTML = `
        <p class="puzzle-desc">Three brass rings, each engraved I through IX, ringing the drain.
        Above them, Edmund's verse waits like a key without a lock:
        <em>crows... rats... chains... turn them so.</em></p>
        <div class="puzzle-row" id="oub-dials"></div>
        <div class="puzzle-row">
          <button class="btn btn-primary" id="oub-try">Turn the Rings</button>
        </div>
        <div class="puzzle-feedback"></div>`;

      const row = body.querySelector('#oub-dials');
      values.forEach((v, i) => {
        const dial = document.createElement('div');
        dial.className = 'dial';
        dial.innerHTML = `
          <button class="dial-btn" data-d="1" aria-label="ring up">&#9650;</button>
          <div class="dial-face">${ROMAN[v]}</div>
          <button class="dial-btn" data-d="-1" aria-label="ring down">&#9660;</button>`;
        const face = dial.querySelector('.dial-face');
        dial.querySelectorAll('.dial-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            values[i] = (values[i] + Number(btn.dataset.d) + 9) % 9;
            face.textContent = ROMAN[values[i]];
            face.classList.remove('tick');
            void face.offsetWidth;
            face.classList.add('tick');
            game.playSfx('click');
            game.setFlag(`oubliette_r${i + 1}`, values[i]);
          });
        });
        row.appendChild(dial);
      });

      body.querySelector('#oub-try').addEventListener('click', () => {
        // VII, IV, II -> indices 6, 3, 1
        if (values[0] === 6 && values[1] === 3 && values[2] === 1) {
          game.setFlag('oubliette_grateOpen');
          game.playSfx('stone');
          api.solved({ message: 'Deep in the wall, counterweights shift. The grate swings up on a hidden hinge — below, a dry cistern shaft, and hand-holds cut into the stone. Edmund fled downward.' });
          game.refreshScene();
        } else {
          api.fail('The rings grind and spring back. Not the count Edmund meant.');
        }
      });
    },
  });
}
