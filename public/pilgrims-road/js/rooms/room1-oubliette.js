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

      <!-- background plate (generated); murals/props/effects layer on top -->
      <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="art/oubliette.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="art/oubliette.mp4" type="video/mp4"/></video></foreignObject>

      <!-- warm animated glow over the plate's painted wall-torch (upper centre) -->
      <ellipse cx="800" cy="150" rx="340" ry="220" fill="url(#gd_oub_torch)" class="glow"/>

      <!-- MURAL: gallows tree with 7 crows (photoreal chalk, screen-blended onto the stone) -->
      <image href="art/oub-gallows.webp" x="230" y="179" width="300" height="222" preserveAspectRatio="xMidYMid meet" style="mix-blend-mode:screen"/>

      <!-- MURAL: 4 rats about a loaf (photoreal chalk, screen-blended) -->
      <image href="art/oub-rats.webp" x="1105" y="230" width="285" height="166" preserveAspectRatio="xMidYMid meet" style="mix-blend-mode:screen"/>

      <!-- MURAL: kneeling monk (photoreal chalk, screen-blended) -->
      <image href="art/oub-monk.webp" x="595" y="224" width="120" height="202" preserveAspectRatio="xMidYMid meet" style="mix-blend-mode:screen"/>

      <!-- chains: two, with empty shackles (photoreal) -->
      <image href="art/oub-chains.webp" x="952" y="168" width="135" height="300" preserveAspectRatio="xMidYMid meet" class="sway slow"/>

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
             <g transform="translate(818 700) rotate(24)"><image href="art/oub-grate.webp" x="-140" y="-86" width="280" height="172" preserveAspectRatio="none"/></g>`
          : `<image href="art/oub-grate.webp" x="580" y="662" width="240" height="156" preserveAspectRatio="none"/>
             <rect x="628" y="732" width="144" height="30" rx="8" fill="#161009" stroke="#57432a" stroke-width="2" opacity="0.92"/>
             <g font-family="Palatino Linotype, Georgia, serif" font-size="22" fill="#e8c85a" text-anchor="middle">
               <text x="662" y="755">${ROMAN[(state.flags.oubliette_r1 ?? 0)]}</text>
               <text x="700" y="755">${ROMAN[(state.flags.oubliette_r2 ?? 0)]}</text>
               <text x="738" y="755">${ROMAN[(state.flags.oubliette_r3 ?? 0)]}</text>
             </g>`}
      </g>

      <!-- sun-mark #1: carved gilded sun (photoreal), scratched letter R below -->
      <g class="beckon">
        <image href="art/oub-sun.webp" x="470" y="646" width="100" height="102" preserveAspectRatio="xMidYMid meet"/>
        <text x="520" y="784" text-anchor="middle" font-size="24" fill="#e8c85a"
          font-family="Palatino Linotype, Georgia, serif">R</text>
      </g>

      <!-- bread board with loaf ${spoonHere ? '+ spoon' : ''} -->
      <g>
        <image href="art/oub-board.webp" x="1128" y="694" width="240" height="146" preserveAspectRatio="xMidYMid meet"/>
        ${spoonHere ? `
        <g transform="translate(1318 742) rotate(18)">
          <ellipse cx="0" cy="0" rx="13" ry="9" fill="none" stroke="#9a9a8a" stroke-width="3"/>
          <path d="M10 6 q12 10 16 26" fill="none" stroke="#9a9a8a" stroke-width="4" stroke-linecap="round"/>
        </g>` : ''}
      </g>

      <!-- candle stub glinting in the straw -->
      ${candleHere ? `
      <image href="art/oub-candle.webp" x="430" y="758" width="52" height="112" preserveAspectRatio="xMidYMid meet" class="beckon"/>` : ''}

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
        <div class="puzzle-hero" style="background-image:url(art/pz-rings.webp)"></div>
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
