// ROOM 2 — The Guard Room.
// Puzzle: the Watch-Order Bolts — five beast-stamped bolts drawn in the order
// the companies stand watch: Boar -> Serpent -> Wolf -> Stag -> Falcon.
// Then: pry the concealed door behind the cabinet with the iron crow.

import { registerItems, registerCombos } from '../../../shared/js/items.js';

registerItems({
  iron_crow: {
    name: 'Iron Crow',
    description: 'A prying bar, heavy and honest. Doors respect it.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 40 L34 12 q4 -5 8 -1 q3 4 -2 7 l-4 2" fill="none" stroke="#7d8494" stroke-width="5" stroke-linecap="round"/>
      <path d="M12 40 l-3 -6 6 -1 z" fill="#7d8494"/>
    </svg>`,
  },
  flint_steel: {
    name: 'Flint & Steel',
    description: 'A striker and a good grey flint. Fire, whenever you ask for it.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 30 q6 -12 18 -10 q-2 10 -12 14 q-5 1 -6 -4z" fill="#8b8878"/>
      <path d="M28 14 q10 2 10 12 q0 8 -8 10" fill="none" stroke="#a9b0c0" stroke-width="4" stroke-linecap="round"/>
      <g stroke="#ffd9a0" stroke-width="2" stroke-linecap="round">
        <line x1="30" y1="28" x2="34" y2="24"/><line x1="33" y1="31" x2="38" y2="29"/>
      </g>
    </svg>`,
  },
  lit_candle: {
    name: 'Lit Candle',
    description: 'A private, portable star. Guard the flame.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="20" width="12" height="18" rx="2" fill="#e8d9b0"/>
      <line x1="24" y1="20" x2="24" y2="15" stroke="#4a4a4a" stroke-width="2"/>
      <path d="M24 4 q6 8 0 12 q-6 -4 0 -12" fill="#ffa94d"/>
      <path d="M24 8 q3 5 0 8 q-3 -3 0 -8" fill="#ffd9a0"/>
      <rect x="14" y="38" width="20" height="4" rx="2" fill="#8a6d1c"/>
    </svg>`,
  },
});

registerCombos([
  {
    pair: ['flint_steel', 'candle_stub'],
    onCombine(game) {
      game.removeItem('candle_stub');
      game.addItem('lit_candle', { silent: true });
      game.playSfx('hint');
      game.say('You strike sparks into the blackened wick. It catches — a small, defiant flame. The dark backs off a pace.');
    },
  },
]);

const BEASTS = [
  { key: 'boar',    name: 'Boar',    glyph: `<path d="M8 26 q2 -12 16 -12 q10 0 12 8 l6 -2 -2 7 q2 3 -1 6 q-4 5 -15 5 q-14 0 -16 -12z" fill="none" stroke="currentColor" stroke-width="3"/><path d="M36 22 q5 -1 6 -6" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="20" cy="22" r="2" fill="currentColor"/>` },
  { key: 'stag',    name: 'Stag',    glyph: `<path d="M24 22 q-2 12 0 20 M24 22 q-8 -2 -10 -12 m10 12 q8 -2 10 -12 M14 12 q-4 2 -8 0 m8 0 q0 -6 -4 -8 M34 12 q4 2 8 0 m-8 0 q0 -6 4 -8" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="24" cy="28" r="5" fill="none" stroke="currentColor" stroke-width="3"/>` },
  { key: 'wolf',    name: 'Wolf',    glyph: `<path d="M10 34 q0 -14 10 -18 l-2 -8 8 6 8 -6 -2 8 q10 4 10 18 q-8 -6 -16 -6 q-8 0 -16 6z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><circle cx="19" cy="26" r="2" fill="currentColor"/><circle cx="29" cy="26" r="2" fill="currentColor"/>` },
  { key: 'falcon',  name: 'Falcon',  glyph: `<path d="M24 8 q14 6 16 22 q-8 -4 -12 -2 l4 12 -8 -6 -8 6 4 -12 q-4 -2 -12 2 q2 -16 16 -22z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>` },
  { key: 'serpent', name: 'Serpent', glyph: `<path d="M12 10 q16 0 16 9 t-16 9 q16 0 16 9 l-4 4 m4 -4 l4 -2 M12 10 l-2 -4 m2 4 l-4 2" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" fill-rule="evenodd"/>` },
];
const ORDER = ['boar', 'serpent', 'wolf', 'stag', 'falcon'];

export default {
  id: 'guardroom',
  title: "The Guard Room",
  intro: 'You haul yourself out of the cistern shaft into warmth: a low timbered room, a banked brazier, dice abandoned mid-game. The garrison has gone to the walls — all of them. Something has the castle holding its breath tonight.',

  scene(state) {
    const bolts = !!state.flags.guardroom_boltsOpen;
    const back = !!state.flags.guardroom_backdoorOpen;
    const crowHere = !state.inventory.includes('iron_crow') && !state.flags.guardroom_crowTaken;
    const flintHere = !state.inventory.includes('flint_steel') && !state.flags.guardroom_flintTaken;

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gd_gr_wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#191524"/>
          <stop offset="1" stop-color="#2b2433"/>
        </linearGradient>
        <radialGradient id="gd_gr_brazier" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(255,140,60,0.5)"/>
          <stop offset="0.5" stop-color="rgba(255,140,60,0.18)"/>
          <stop offset="1" stop-color="rgba(255,140,60,0)"/>
        </radialGradient>
        <linearGradient id="gd_gr_floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#241e2b"/>
          <stop offset="1" stop-color="#120e18"/>
        </linearGradient>
        <linearGradient id="gd_gr_cab" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#4a3a26"/>
          <stop offset="1" stop-color="#2e2417"/>
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="1600" height="620" fill="url(#gd_gr_wall)"/>
      <!-- timber beams -->
      <g fill="#241a2b">
        <rect x="0" y="70" width="1600" height="34"/>
        <rect x="200" y="0" width="30" height="620"/>
        <rect x="760" y="0" width="30" height="620"/>
        <rect x="1330" y="0" width="30" height="620"/>
        <path d="M200 104 L440 300 l-20 18 L200 140 Z" opacity="0.8"/>
        <path d="M790 104 L560 300 l20 18 L790 140 Z" opacity="0.8"/>
      </g>
      <rect x="0" y="620" width="1600" height="280" fill="url(#gd_gr_floor)"/>
      <g stroke="#0c0912" stroke-width="4" opacity="0.7">
        ${[660, 705, 755, 810, 868].map(y => `<line x1="0" y1="${y}" x2="1600" y2="${y}"/>`).join('')}
      </g>

      <!-- duty roster parchment on wall -->
      <g class="sway slow">
        <rect x="285" y="180" width="190" height="240" rx="4" fill="#d9c493" transform="rotate(-2 380 300)"/>
        <g font-family="Palatino Linotype, Georgia, serif" fill="#4a3a1c" transform="rotate(-2 380 300)">
          <text x="380" y="215" font-size="22" text-anchor="middle" font-weight="bold">DUTY ROSTER</text>
          <line x1="310" y1="228" x2="450" y2="228" stroke="#4a3a1c" stroke-width="2"/>
          ${['Dusk', 'Evensong', 'Dead of Night', 'Cock-crow', 'Dawn'].map((w, i) =>
            `<text x="310" y="${262 + i * 30}" font-size="17">${w} .......</text>`).join('')}
        </g>
      </g>

      <!-- slate tally board -->
      <rect x="60" y="200" width="160" height="200" rx="6" fill="#1e222e" stroke="#3a3e4f" stroke-width="5"/>
      <g stroke="#cfd4de" stroke-width="3" opacity="0.8" stroke-linecap="round">
        ${[0, 1, 2].map(r => [0, 1, 2, 3].map(c =>
          `<line x1="${86 + c * 26}" y1="${240 + r * 46}" x2="${86 + c * 26}" y2="${268 + r * 46}"/>`).join('')).join('')}
        <line x1="80" y1="268" x2="164" y2="240"/>
      </g>

      <!-- brazier -->
      <g>
        <ellipse cx="260" cy="560" rx="240" ry="150" fill="url(#gd_gr_brazier)" class="glow"/>
        <ellipse cx="260" cy="580" rx="85" ry="26" fill="#2b2233"/>
        <path d="M185 580 q0 -46 75 -46 q75 0 75 46 z" fill="#3c3040"/>
        <g class="torch-flame">
          <path d="M260 470 q30 36 12 92 q-6 14 -12 14 q-6 0 -12 -14 q-18 -56 12 -92z" fill="#ffa94d"/>
          <path d="M260 500 q16 26 6 58 q-3 8 -6 8 q-3 0 -6 -8 q-10 -32 6 -58z" fill="#ffd9a0"/>
        </g>
        ${[0, 1, 2].map(i => `<circle cx="${230 + i * 30}" cy="${566 - (i % 2) * 10}" r="6" fill="#e07b2a" class="flicker"/>`).join('')}
      </g>
      ${crowHere ? `
      <g class="beckon">
        <path d="M360 640 L390 480 q3 -12 12 -8 q8 4 2 14 l-6 8" fill="none" stroke="#7d8494" stroke-width="10" stroke-linecap="round"/>
      </g>` : ''}

      <!-- trestle table -->
      <g>
        <rect x="560" y="520" width="500" height="34" rx="6" fill="#4a3a26"/>
        <rect x="590" y="554" width="26" height="150" fill="#38290f"/>
        <rect x="1000" y="554" width="26" height="150" fill="#38290f"/>
        <!-- dice -->
        <rect x="700" y="498" width="24" height="24" rx="5" fill="#e8d9b0"/>
        <circle cx="712" cy="510" r="2.6" fill="#2b2015"/>
        <rect x="732" y="502" width="22" height="22" rx="5" fill="#e8d9b0" transform="rotate(14 743 513)"/>
        <g fill="#2b2015"><circle cx="739" cy="509" r="2.2"/><circle cx="748" cy="518" r="2.2"/></g>
        <!-- cups -->
        <path d="M840 470 l26 0 -4 40 -18 0 z" fill="#6b5330"/>
        <path d="M880 476 l24 0 -4 34 -16 0 z" fill="#6b5330" transform="rotate(-8 892 493)"/>
        <!-- unfinished letter + quill -->
        <rect x="930" y="486" width="98" height="52" rx="3" fill="#e8d9b0" transform="rotate(-5 979 512)"/>
        <g stroke="#8a7a50" stroke-width="2" transform="rotate(-5 979 512)">
          <line x1="940" y1="500" x2="1015" y2="500"/><line x1="940" y1="510" x2="1008" y2="510"/>
          <line x1="940" y1="520" x2="990" y2="520"/>
        </g>
        <path d="M1010 470 q20 -18 34 -20 q-8 14 -24 26z" fill="#cfd4de"/>
        ${flintHere ? `<g class="beckon"><path d="M640 500 q5 -10 15 -8 q-2 8 -10 11 q-4 1 -5 -3z" fill="#8b8878"/><path d="M655 488 q9 2 9 10 q0 6 -6 8" fill="none" stroke="#a9b0c0" stroke-width="3.5" stroke-linecap="round"/></g>` : ''}
        <!-- knife-carved words -->
        <text x="810" y="546" font-size="15" fill="#2b2015" font-style="italic"
          font-family="Palatino Linotype, Georgia, serif" text-anchor="middle" opacity="0.9">"the serpent slithers in the moment the boar lies down"</text>
      </g>

      <!-- armory cabinet with five beast bolts -->
      <g>
        <rect x="1180" y="200" width="330" height="440" rx="10" fill="url(#gd_gr_cab)" stroke="#1c1610" stroke-width="6"/>
        ${back ? `
          <rect x="1210" y="240" width="270" height="370" fill="#05070d"/>
          <path d="M1210 240 L1480 240 L1480 610 L1210 610 Z" fill="none" stroke="#3c4152" stroke-width="4"/>
          <g stroke="#2b3242" stroke-width="6" opacity="0.9">
            ${[300, 370, 440, 510].map(y => `<line x1="1240" y1="${y + 40}" x2="1450" y2="${y}"/>`).join('')}
          </g>
          <ellipse cx="1345" cy="330" rx="60" ry="30" fill="rgba(154,196,255,0.06)" class="fog"/>`
        : bolts ? `
          <rect x="1210" y="240" width="270" height="370" fill="#16110b"/>
          ${[0, 1, 2, 3].map(i => `<circle cx="${1250 + i * 64}" cy="300" r="7" fill="#4a3a26"/>`).join('')}
          ${[0, 1, 2, 3].map(i => `<circle cx="${1250 + i * 64}" cy="420" r="7" fill="#4a3a26"/>`).join('')}
          <text x="1345" y="530" font-size="18" fill="#8b8878" text-anchor="middle" font-style="italic"
            font-family="Palatino Linotype, Georgia, serif">empty pegs — a cold draft</text>`
        : `
          <rect x="1210" y="240" width="270" height="370" fill="#241a10"/>
          ${BEASTS.map((b, i) => `
            <g transform="translate(1240 ${268 + i * 68})">
              <rect x="0" y="0" width="210" height="46" rx="8" fill="#3a2d1c" stroke="#57432a" stroke-width="3"/>
              <rect x="6" y="8" width="120" height="30" rx="6" fill="#6d7d9c"/>
              <g transform="translate(150 0) scale(0.9)" color="#c9a227">${b.glyph}</g>
            </g>`).join('')}
        `}
      </g>

      <!-- sun-mark #2: three rays, letter A, above the bolt rack -->
      <g class="beckon">
        <circle cx="1345" cy="150" r="13" fill="none" stroke="#c9a227" stroke-width="3"/>
        ${[0, 1, 2].map(i => {
          const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
          return `<line x1="${1345 + Math.cos(a) * 17}" y1="${150 + Math.sin(a) * 17}"
                        x2="${1345 + Math.cos(a) * 27}" y2="${150 + Math.sin(a) * 27}"
                        stroke="#c9a227" stroke-width="3" stroke-linecap="round"/>`;
        }).join('')}
        <text x="1378" y="160" font-size="22" fill="#c9a227" font-family="Palatino Linotype, Georgia, serif">A</text>
      </g>

      <!-- open cistern hatch you climbed from -->
      <ellipse cx="520" cy="810" rx="90" ry="30" fill="#05070d"/>
      <path d="M430 810 a90 30 0 0 1 180 0" fill="none" stroke="#3a3e4f" stroke-width="6"/>

      <path d="M0 900 L0 856 Q800 910 1600 856 L1600 900 Z" fill="#05070d"/>
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const bolts = !!state.flags.guardroom_boltsOpen;
    const back = !!state.flags.guardroom_backdoorOpen;

    spots.push({
      id: 'roster', x: 280, y: 170, w: 210, h: 260, label: 'Duty roster',
      onInteract(game) {
        const html = `<div class="parchment-note"><div class="note-title">Duty Roster</div>
          <p>"Five companies, five watches: <strong>Dusk, Evensong, Dead of Night, Cock-crow, Dawn.</strong>
          Bolts drawn as the watches pass."</p>
          <p>Below, in a sergeant's hand: <em>"The Wolf stands neither the first watch nor the last."</em></p></div>`;
        game.journal.add('note_roster', { title: 'Duty roster (Guard Room)', category: 'note', html });
        game.dialog({ title: 'The Duty Roster', html });
      },
    });

    spots.push({
      id: 'tally', x: 50, y: 190, w: 190, h: 220, label: 'Slate tally board',
      onInteract(game) {
        const html = `<p>Chalk tallies, and one line pressed hard enough to score the slate:</p>
          <div class="parchment-note aged"><p>"First watch to the company of <strong>the tusked</strong>."</p></div>`;
        game.journal.add('note_tally', { title: 'Tally board (Guard Room)', category: 'note', html });
        game.dialog({ title: 'The Tally Board', html });
      },
    });

    spots.push({
      id: 'carving', x: 640, y: 524, w: 360, h: 40, label: 'Words carved in the table',
      onInteract(game) {
        const html = `<p>Knife-carved during some long boring watch:</p>
          <div class="parchment-note aged"><p>"The Serpent slithers in the moment the Boar lies down."</p></div>
          <p style="color:var(--text-dim); font-style:italic;">The Serpent's watch comes directly after the Boar's — no watch between.</p>`;
        game.journal.add('note_carving', { title: 'Table carving (Guard Room)', category: 'note', html });
        game.dialog({ title: 'Carved in the Tabletop', html });
      },
    });

    spots.push({
      id: 'letter', x: 915, y: 462, w: 130, h: 90, label: 'Unfinished letter',
      onInteract(game) {
        const html = `<div class="parchment-note"><div class="note-title">Unfinished letter</div>
          <p>"...my watch falls <strong>directly after the Stag's men come in</strong>, and I thank God I need
          not stand the Dead of Night, for that is when the dogs howl worst..."</p>
          <p style="text-align:right;">— Osric, of the <strong>Falcon</strong></p></div>`;
        game.journal.add('note_letter', { title: "Osric's letter (Guard Room)", category: 'note', html });
        game.dialog({ title: "Osric's Letter", html });
      },
    });

    spots.push({
      id: 'dice', x: 690, y: 470, w: 120, h: 60, label: 'Abandoned dice',
      onInteract(game) { game.say('Fives and threes, mid-game, cups still half full. They left in a hurry, and not for a drill.'); },
    });

    spots.push({
      id: 'hatch', x: 430, y: 770, w: 190, h: 70, label: 'Cistern hatch',
      onInteract(game) { game.say('The shaft you climbed. It only goes back down to the cell. Forward is the only direction that exists tonight.'); },
    });

    spots.push({
      id: 'sun2', x: 1300, y: 110, w: 130, h: 90, label: 'A carved sun',
      onInteract(game) {
        game.journal.add('sun2', { title: 'Guard Room — above the bolt rack', category: 'sun', sun: { rays: 3, letter: 'A' } });
        game.say('Scratched small above the bolt rack: a sun of three rays, and the letter A. The second mark on Edmund\'s road.');
      },
    });

    if (!state.inventory.includes('iron_crow') && !state.flags.guardroom_crowTaken) {
      spots.push({
        id: 'crow', x: 340, y: 470, w: 100, h: 180, label: 'Iron pry bar',
        onInteract(game) {
          game.setFlag('guardroom_crowTaken');
          game.addItem('iron_crow', { from: { x: 380, y: 560 } });
          game.refreshScene();
        },
      });
    }

    if (!state.inventory.includes('flint_steel') && !state.flags.guardroom_flintTaken) {
      spots.push({
        id: 'flint', x: 620, y: 478, w: 70, h: 60, label: 'Flint & steel',
        onInteract(game) {
          game.setFlag('guardroom_flintTaken');
          game.addItem('flint_steel', { from: { x: 650, y: 500 } });
          game.refreshScene();
        },
      });
    }

    if (!bolts) {
      spots.push({
        id: 'cabinet', x: 1190, y: 220, w: 310, h: 410, label: 'Armory cabinet — five bolts',
        onInteract(game) { openBoltPuzzle(game); },
      });
    } else if (!back) {
      spots.push({
        id: 'backpanel', x: 1190, y: 220, w: 310, h: 410, label: 'The back of the cabinet',
        onInteract(game) {
          if (game.selectedItem === 'iron_crow') {
            game.setFlag('guardroom_backdoorOpen');
            game.playSfx('creak');
            game.say('You drive the crow into the rusted seam and lean. With a shriek of old iron the false back tears open — stone stairs spiral down into the dark, breathing cold air.');
            game.selectedItem = null;
            game.refreshScene();
          } else {
            game.say('Empty pegs — every blade taken to the walls. But the draft... the back panel is a door, rusted shut at the seam. You\'d need iron to persuade it.');
          }
        },
      });
    } else {
      spots.push({
        id: 'stairs', x: 1210, y: 240, w: 280, h: 380, label: 'Stairs down',
        onInteract(game) {
          if (!state.inventory.includes('flint_steel') && !state.flags.guardroom_flintTaken) {
            game.say('A guard\'s fire-kit still sits on the table. Where you are going is dark, and fire is the cheapest friend there is.');
            return;
          }
          if (!game.journal.has('sun2')) {
            game.say('"Mark each sun along the road." You have not marked this room\'s — something small and gold is scratched above the bolt rack.');
            return;
          }
          game.completeRoom({ delay: 600 });
        },
      });
    }

    return spots;
  },

  hintContext(state) {
    return state.flags.guardroom_boltsOpen ? 'door' : 'bolts';
  },

  hints(state) {
    if (!state.flags.guardroom_boltsOpen) {
      return [
        { text: 'Four clues name five companies: the roster, the tally board, the tabletop, the letter. Whose watch is pinned down absolutely?', cost: 60 },
        { text: "The tusked one is the Boar — first watch. The Serpent follows him directly. Now: Falcon comes directly after Stag, and the Wolf can stand neither first nor last.", cost: 120 },
        { text: 'Draw the bolts: Boar, Serpent, Wolf, Stag, Falcon.', cost: 240 },
      ];
    }
    return [
      { text: 'That cold draft is coming from behind the empty weapon pegs.', cost: 60 },
      { text: 'The cabinet back is a false panel, rusted at the seam. You carry a bar of honest iron.', cost: 120 },
      { text: 'Click the iron crow in your satchel to hold it, then click the open cabinet.', cost: 240 },
    ];
  },
};

function openBoltPuzzle(game) {
  let progress = [];

  game.openPuzzle({
    id: 'guardroom_bolts',
    title: 'The Watch-Order Bolts',
    render(body, api) {
      body.innerHTML = `
        <p class="puzzle-desc">Five sliding bolts, each stamped with a company's beast.
        The roster says it plainly: <em>"bolts drawn as the watches pass."</em>
        Draw them in the order the five companies stand watch — one mistake and they all spring back.</p>
        <div class="puzzle-row" id="gr-bolts"></div>
        <div class="puzzle-feedback"></div>`;

      const row = body.querySelector('#gr-bolts');

      const shuffled = [BEASTS[3], BEASTS[0], BEASTS[4], BEASTS[2], BEASTS[1]]; // display order != solution
      for (const beast of shuffled) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.style.minWidth = '86px';
        tile.style.color = '#c9a227';
        tile.innerHTML = `
          <svg viewBox="0 0 48 48" width="44" height="44">${beast.glyph}</svg>
          <div style="font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:var(--text-dim); margin-top:4px;">${beast.name}</div>`;
        tile.addEventListener('click', () => {
          if (tile.classList.contains('correct-flash')) return;
          game.playSfx('click');
          if (ORDER[progress.length] === beast.key) {
            progress.push(beast.key);
            tile.classList.add('correct-flash');
            api.setFeedback(`${beast.name} drawn — ${progress.length} of 5.`, 'good');
            if (progress.length === 5) {
              game.setFlag('guardroom_boltsOpen');
              api.solved({ message: 'The last bolt slides home and the cabinet doors sag open... onto emptiness. Bare pegs. Every blade gone to the walls. But from behind the panel: a draft, cold as a river.' });
              game.refreshScene();
            }
          } else {
            progress = [];
            row.querySelectorAll('.tile').forEach(t => t.classList.remove('correct-flash'));
            api.fail('Springs snap — every bolt slams back. Wrong watch.');
          }
        });
        row.appendChild(tile);
      }
    },
  });
}
