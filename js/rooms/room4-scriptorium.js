// ROOM 4 — The Scriptorium. Hardest single room (peak 1).
// Gated by light: the lit candle must be placed in the desk sconce.
// Puzzle: the Chronicle Cipher — 2:4, 5:1, 1:6, 7:3, 3:2 (line:word, first
// letter) in "A Chronicle of the House of Vayne" -> N-O-R-T-H on the chest dials.

import { registerItems } from '../items.js';

registerItems({
  still_key: {
    name: 'Still-Room Key',
    description: 'Brass, stamped with a pestle. It smells faintly of rosemary.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="14" r="8" fill="none" stroke="#c9a227" stroke-width="3"/>
      <path d="M20 20 L36 36 M30 30 l6 -3 M33 36 l6 -3" stroke="#c9a227" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="15" cy="14" r="2.5" fill="#c9a227"/>
    </svg>`,
  },
  recipe_right: {
    name: 'Torn Recipe (right half)',
    description: 'The right half of a recipe in a herbalist\'s hand. The measures survive; the title is torn away.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 8 L36 8 L36 40 L14 40 L18 34 L13 28 L18 22 L13 16 Z" fill="#e8d9b0"/>
      <g stroke="#8a7a50" stroke-width="2"><line x1="20" y1="16" x2="32" y2="16"/><line x1="20" y1="23" x2="32" y2="23"/><line x1="20" y1="30" x2="30" y2="30"/></g>
    </svg>`,
  },
  edmund_confession: {
    name: "Edmund's Confession",
    description: 'An unsent letter, forty years sealed. You will carry it out of this place, or neither of you leaves.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="12" width="28" height="24" rx="2" fill="#e8d9b0"/>
      <path d="M10 14 L24 26 L38 14" fill="none" stroke="#8a7a50" stroke-width="2"/>
      <circle cx="24" cy="27" r="5" fill="#7a1f2b"/>
    </svg>`,
  },
});

const TOMES = [
  { key: 'ship',  label: 'a ship' },
  { key: 'grail', label: 'a grail' },
  { key: 'boar',  label: 'a boar' },
  { key: 'comet', label: 'a comet above a tower' },
  { key: 'harp',  label: 'a harp' },
  { key: 'wheel', label: 'a wheel' },
];

const CHRONICLE = [
  'In the year of the ravens, Aldwin raised these walls.',
  'Seven long winters no stone was spared for the keep.',
  'His hall he filled with song and silver.',
  'Then came the pestilence, and the bells fell silent.',
  'Old grudges gathered like storm-crows about the towers.',
  'Brother fought brother upon the frozen moat.',
  'Beneath, a tunnel ran to the mere, sealed now with iron.',
  'Pray, stranger, that dawn finds you far from Vayne.',
];

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default {
  id: 'scriptorium',
  title: 'The Scriptorium',
  intro: 'The silver key lets you into a long room of sloped desks and the smell of oak-gall ink. It is very dark — the moon does not reach here. Somewhere in this room, forty years ago, Brother Edmund wrote things he never sent.',

  scene(state) {
    const lit = !!state.flags.scriptorium_candleLit;
    const chestOpen = !!state.flags.scriptorium_chestOpen;
    const taken = !!state.flags.scriptorium_chestTaken;

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gd_sc_wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#14111c"/>
          <stop offset="1" stop-color="#241f2d"/>
        </linearGradient>
        <radialGradient id="gd_sc_pool" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(255,200,120,0.5)"/>
          <stop offset="0.5" stop-color="rgba(255,180,100,0.16)"/>
          <stop offset="1" stop-color="rgba(255,180,100,0)"/>
        </radialGradient>
        <linearGradient id="gd_sc_desk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#4a3a26"/>
          <stop offset="1" stop-color="#2e2417"/>
        </linearGradient>
      </defs>

      <rect width="1600" height="620" fill="url(#gd_sc_wall)"/>
      <rect y="620" width="1600" height="280" fill="#171320"/>
      <g stroke="#0c0912" stroke-width="4" opacity="0.6">
        ${[670, 730, 800, 870].map(y => `<line x1="0" y1="${y}" x2="1600" y2="${y}"/>`).join('')}
      </g>

      <!-- high shelf of six tomes -->
      <g>
        <rect x="480" y="150" width="640" height="16" rx="4" fill="#3a2d1c"/>
        ${TOMES.map((t, i) => {
          const x = 500 + i * 102;
          const h = 96 + (i % 3) * 8;
          return `
          <g>
            <rect x="${x}" y="${150 - h}" width="72" height="${h}" rx="4"
              fill="${['#4a3040', '#2e3e50', '#503a2a', '#5a4a20', '#33402e', '#40303a'][i]}"
              stroke="#0c0912" stroke-width="3"/>
            ${t.key === 'comet'
              ? `<g stroke="#c9a227" stroke-width="3" fill="none">
                   <rect x="${x + 24}" y="${150 - h + 46}" width="24" height="30"/>
                   <path d="M${x + 24} ${150 - h + 46} l6 -8 12 0 6 8"/>
                   <circle cx="${x + 50}" cy="${150 - h + 22}" r="5" fill="#c9a227"/>
                   <line x1="${x + 44}" y1="${150 - h + 26}" x2="${x + 24}" y2="${150 - h + 38}"/>
                 </g>`
              : t.key === 'ship' ? `<path d="M${x + 20} ${150 - h + 60} q16 12 32 0 l-4 10 -24 0 z M${x + 36} ${150 - h + 58} l0 -26 14 16 z" fill="#8b8878"/>`
              : t.key === 'grail' ? `<path d="M${x + 26} ${150 - h + 40} q10 22 20 0 l-6 22 -8 0 z M${x + 30} ${150 - h + 68} l12 0" stroke="#8b8878" stroke-width="3" fill="none"/>`
              : t.key === 'boar' ? `<ellipse cx="${x + 36}" cy="${150 - h + 54}" rx="17" ry="10" fill="none" stroke="#8b8878" stroke-width="3"/><path d="M${x + 50} ${150 - h + 50} q5 -2 6 -7" stroke="#8b8878" stroke-width="3" fill="none"/>`
              : t.key === 'harp' ? `<path d="M${x + 26} ${150 - h + 70} q-4 -28 12 -34 q14 -4 10 10 M${x + 30} ${150 - h + 66} l0 -20 M${x + 37} ${150 - h + 64} l0 -22" stroke="#8b8878" stroke-width="2.5" fill="none"/>`
              : `<circle cx="${x + 36}" cy="${150 - h + 54}" r="14" fill="none" stroke="#8b8878" stroke-width="3"/><g stroke="#8b8878" stroke-width="2.5">${[0, 45, 90, 135].map(a => `<line x1="${x + 36 - 14 * Math.cos(a * Math.PI / 180)}" y1="${150 - h + 54 - 14 * Math.sin(a * Math.PI / 180)}" x2="${x + 36 + 14 * Math.cos(a * Math.PI / 180)}" y2="${150 - h + 54 + 14 * Math.sin(a * Math.PI / 180)}"/>`).join('')}</g>`}
          </g>`;
        }).join('')}
      </g>

      <!-- sloped writing desks -->
      ${[[260, 480], [640, 500], [1020, 480]].map(([x, y]) => `
      <g>
        <path d="M${x} ${y} L${x + 260} ${y - 40} L${x + 260} ${y + 30} L${x} ${y + 70} Z" fill="url(#gd_sc_desk)"/>
        <rect x="${x + 20}" y="${y + 60}" width="22" height="130" fill="#2e2417"/>
        <rect x="${x + 210}" y="${y + 20}" width="22" height="130" fill="#2e2417"/>
        <path d="M${x + 30} ${y - 2} L${x + 130} ${y - 18} L${x + 132} ${y + 14} L${x + 32} ${y + 30} Z" fill="#e8d9b0" opacity="0.9"/>
      </g>`).join('')}

      <!-- ink horns & quills on middle desk -->
      <path d="M780 470 q6 -18 18 -20 l2 12 q-8 4 -10 14 z" fill="#1c1610"/>
      <path d="M812 440 q22 -20 38 -22 q-10 16 -28 30z" fill="#cfd4de"/>

      <!-- pen case -->
      <rect x="900" y="455" width="90" height="26" rx="6" fill="#38290f" stroke="#1c1610" stroke-width="2" transform="rotate(-8 945 468)"/>

      <!-- desk sconce (candle target) -->
      <g>
        <path d="M700 380 q0 -18 16 -18 q16 0 16 18 l-6 8 -20 0 z" fill="#57432a"/>
        ${lit ? `
          <rect x="708" y="352" width="16" height="26" rx="3" fill="#e8d9b0"/>
          <path class="torch-flame fast" d="M716 322 q10 12 0 26 q-10 -14 0 -26z" fill="#ffd9a0"/>
          <ellipse cx="716" cy="420" rx="420" ry="240" fill="url(#gd_sc_pool)" class="glow"/>`
        : ''}
      </g>

      <!-- Edmund's chest with five letter dials -->
      <g>
        <rect x="1250" y="560" width="270" height="170" rx="12" fill="#3a2d1c" stroke="#1c1610" stroke-width="5"/>
        <path d="M1250 580 q135 -52 270 0 l0 -20 q-135 -46 -270 0 z" fill="#4a3a26"/>
        ${[0, 1, 2].map(i => `<rect x="${1270 + i * 90}" y="560" width="16" height="170" fill="#57432a"/>`).join('')}
        ${chestOpen ? `
          <rect x="1262" y="574" width="246" height="30" fill="#0c0912"/>
          ${taken ? '' : `<g class="beckon">
            <rect x="1300" y="640" width="60" height="40" rx="3" fill="#e8d9b0" transform="rotate(-6 1330 660)"/>
            <circle cx="1430" cy="660" r="14" fill="none" stroke="#c9a227" stroke-width="4"/>
          </g>`}`
        : `
          <rect x="1282" y="620" width="206" height="48" rx="8" fill="#241a10" stroke="#57432a" stroke-width="3"/>
          <g font-family="Palatino Linotype, Georgia, serif" font-size="26" fill="#c9a227" text-anchor="middle">
            ${[0, 1, 2, 3, 4].map(i =>
              `<text x="${1303 + i * 41}" y="653">${ALPHA[(state.flags[`scriptorium_d${i}`] ?? 0)]}</text>`).join('')}
          </g>`}
      </g>

      <!-- stair door behind the desks -->
      <g>
        <path d="M80 620 L80 330 Q170 250 260 330 L260 620 Z" fill="#241a10" stroke="#3a2d1c" stroke-width="8"/>
        <circle cx="230" cy="480" r="9" fill="#c9a227"/>
        <path d="M120 380 l100 0 M120 440 l100 0 M120 500 l100 0" stroke="#1c1610" stroke-width="5"/>
      </g>

      ${lit ? '' : `
      <!-- darkness: the room before the candle -->
      <rect width="1600" height="900" fill="rgba(4,3,10,0.78)"/>
      <ellipse cx="170" cy="475" rx="260" ry="300" fill="rgba(20,18,34,0.35)"/>
      <text x="800" y="80" text-anchor="middle" font-size="24" fill="#565b6c" font-style="italic"
        font-family="Palatino Linotype, Georgia, serif">too dark to read the small hand</text>`}

      <path d="M0 900 L0 856 Q800 906 1600 856 L1600 900 Z" fill="#05070d"/>
    </svg>`;
  },

  hotspots(state) {
    const lit = !!state.flags.scriptorium_candleLit;
    const chestOpen = !!state.flags.scriptorium_chestOpen;
    const taken = !!state.flags.scriptorium_chestTaken;
    const spots = [];

    spots.push({
      id: 'sconce', x: 660, y: 310, w: 120, h: 110, label: lit ? 'Your candle' : 'Empty desk sconce',
      onInteract(game) {
        if (lit) { game.say('Your small flame holds the dark at arm\'s length. Wax runs like the minutes.'); return; }
        if (game.selectedItem === 'lit_candle') {
          game.useSelected();
          game.setFlag('scriptorium_candleLit');
          game.playSfx('hint');
          game.say('You set the lit candle in the sconce. Light pools across the vellum like something poured — and the room\'s small hands begin to speak.');
          game.refreshScene();
        } else if (game.hasItem('candle_stub') && game.hasItem('flint_steel')) {
          game.say('An empty sconce, waiting. You have wax and you have fire-makings — marry them in your satchel, then bring the flame here.');
        } else if (game.hasItem('lit_candle')) {
          game.say('An empty sconce. Hold your lit candle, then set it here.');
        } else {
          game.say('An empty sconce, hungry for a candle you do not have.');
        }
      },
    });

    if (!lit) {
      spots.push({
        id: 'dark_desks', x: 300, y: 420, w: 700, h: 200, label: 'Writing desks',
        onInteract(game) { game.say('Vellum, ink horns, a pen case — all of it drowned in dark. You need light before this room will talk.'); },
      });
      spots.push({
        id: 'dark_shelf', x: 480, y: 40, w: 640, h: 140, label: 'High shelf',
        onInteract(game) { game.say('Heavy shapes of books, spines unreadable in the gloom.'); },
      });
    } else {
      spots.push({
        id: 'pencase', x: 880, y: 430, w: 130, h: 70, label: 'Raven-quill pen case',
        onInteract(game) {
          const html = `<div class="parchment-note aged"><div class="note-title">A strip of vellum, hidden under the quills</div>
            <p style="font-size:19px; letter-spacing:0.08em; text-align:center;">2:4 &middot; 5:1 &middot; 1:6 &middot; 7:3 &middot; 3:2</p>
            <p>"line, then word; the first letter of each is the way."</p>
            <p style="text-align:center;">✦ <em>beneath: a small sketch — a comet above a tower — and the initial</em> <strong>E.</strong></p></div>`;
          game.journal.add('note_cipherstrip', { title: 'Cipher strip (Scriptorium pen case)', category: 'note', html });
          game.dialog({ title: 'The Cipher Strip', html });
        },
      });

      spots.push({
        id: 'shelf', x: 480, y: 40, w: 640, h: 140, label: 'Six great tomes',
        onInteract(game) { openShelf(game); },
      });

      spots.push({
        id: 'desks', x: 280, y: 430, w: 360, h: 160, label: 'The copying desks',
        onInteract(game) { game.say('Half-finished psalters, initials never gilded. The pestilence emptied these benches long before you were born.'); },
      });

      if (!chestOpen) {
        spots.push({
          id: 'chest', x: 1240, y: 550, w: 290, h: 190, label: "Edmund's chest — five letter dials",
          onInteract(game) { openChestPuzzle(game); },
        });
      } else if (!taken) {
        spots.push({
          id: 'chest_open', x: 1240, y: 550, w: 290, h: 190, label: 'Inside the chest',
          onInteract(game) {
            game.setFlag('scriptorium_chestTaken');
            game.addItem('still_key', { from: { x: 1430, y: 660 }, silent: true });
            game.addItem('recipe_right', { from: { x: 1330, y: 660 }, silent: true });
            game.addItem('edmund_confession', { from: { x: 1380, y: 640 }, silent: true });
            const html = `<div class="parchment-note aged"><div class="note-title">The confession of Brother Edmund</div>
              <p>"I was no traitor. I was the castellan's own brother, and I smuggled the condemned out
              along the pilgrim's road — the tunnel beneath the mere, that the Chronicle still remembers.
              Nineteen souls the rope never got. When they caught me, they gave me the oubliette
              and let me grow old in it.</p>
              <p>I carve the suns for whoever follows. Finish the road.<br>— E."</p></div>`;
            game.journal.add('note_confession', { title: "Edmund's confession", category: 'note', html });
            game.dialog({
              title: 'Beneath the Key and the Recipe',
              html: html + `<p style="margin-top:12px;">A brass key stamped with a pestle. The right half of a torn recipe.
                And this letter — which you fold, very carefully, inside your shirt.</p>
                <p style="color:var(--text-dim); font-style:italic;">You are not just escaping any more. You are finishing Edmund's road.</p>`,
            });
            game.refreshScene();
          },
        });
      } else {
        spots.push({
          id: 'chest_done', x: 1240, y: 550, w: 290, h: 190, label: "Edmund's chest",
          onInteract(game) { game.say('Empty now, but for forty years of patience.'); },
        });
      }
    }

    spots.push({
      id: 'stairdoor', x: 80, y: 300, w: 190, h: 330, label: 'Stair door',
      onInteract(game) {
        if (game.hasItem('still_key')) {
          if (!game.journal.has('sun4')) {
            game.say('"Mark each sun along the road." You have not sketched this room\'s sun — it hides in paint, in the one book that still opens. Look at the Chronicle\'s illuminated letters.');
            return;
          }
          game.say('The pestle-stamped key turns. Stone steps corkscrew down toward a smell of cold ash and rosemary — the still-room beneath the kitchens.');
          game.completeRoom({ delay: 900 });
        } else {
          game.say('A narrow stair door, locked. The lock plate is stamped with a little brass pestle.');
        }
      },
    });

    return spots;
  },

  hintContext(state) {
    return state.flags.scriptorium_candleLit ? 'cipher' : 'dark';
  },

  hints(state) {
    if (!state.flags.scriptorium_candleLit) {
      return [
        { text: 'This room is a reading room. Nothing will speak until you bring light.', cost: 60 },
        { text: 'You have carried wax since the cell, and fire-makings since the guard room. In your satchel: hold one, click the other.', cost: 120 },
        { text: 'Combine the flint & steel with the candle stub to make a lit candle, then use it on the empty sconce by the middle desk.', cost: 240 },
      ];
    }
    return [
      { text: 'The strip tells you everything: a book marked by a comet and a tower, and number pairs that mean line, then word.', cost: 60 },
      { text: "Line 2, word 4 of the Chronicle is 'no' — that's an N. Keep indexing; the five letters spell a direction you could follow.", cost: 120 },
      { text: "NORTH: 'no', 'Old', 'ravens', 'tunnel', 'hall'. Set the chest dials to N-O-R-T-H.", cost: 240 },
    ];
  },
};

function openShelf(game) {
  game.dialog({
    title: 'The High Shelf',
    wide: true,
    html: `
      <p class="puzzle-desc">Six massive tomes, spines stamped in old gilt. Choose one to pull down.</p>
      <div class="puzzle-row">
        ${TOMES.map(t => `<button class="btn ${t.key === 'comet' ? '' : 'btn-ghost'}" data-tome="${t.key}"
          style="min-width:150px;">${t.label}</button>`).join('')}
      </div>`,
    onClose: null,
  }).card.querySelectorAll('[data-tome]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.tome === 'comet') {
        game.playSfx('page');
        openChronicle(game);
      } else {
        game.playSfx('wrong');
        game.say('You pull at it — the pages have swollen into a single damp brick. Forty winters of rot. Only one book here still opens.');
      }
    });
  });
}

function openChronicle(game) {
  game.journal.add('sun4', { title: 'Scriptorium — the illuminated O', category: 'sun', sun: { rays: 6, letter: 'O' } });
  const html = `
    <div class="parchment-note aged" style="max-width: 560px;">
      <div class="note-title">A Chronicle of the House of Vayne</div>
      <ol style="line-height: 2; margin-left: 20px;">
        ${CHRONICLE.map((l, i) => `<li value="${i + 1}" style="color:#7a1f2b;"><span style="color:#2b2015;">${
          i === 4 ? l.replace('Old', '<strong style="color:#8a6d1c; font-size:1.2em;">O</strong>ld') : l
        }</span></li>`).join('')}
      </ol>
      <p style="margin-top: 10px; font-size: 13px;">The chapter numerals are inked in red — the numbering is the monk's own.
      And the illuminated capital <strong>O</strong> of line five is painted as a golden sun of
      <strong>six rays</strong>... with a tiny <strong>O</strong> at its heart. Another of Edmund's marks —
      sketched into your journal.</p>
    </div>`;
  game.journal.add('note_chronicle', { title: 'The Chronicle of Vayne (page)', category: 'note', html });
  game.dialog({ title: 'The Chronicle', wide: true, html });
}

function openChestPuzzle(game) {
  const values = [0, 1, 2, 3, 4].map(i => game.getFlag(`scriptorium_d${i}`) ?? 0);

  game.openPuzzle({
    id: 'scriptorium_chest',
    title: "Edmund's Chest",
    render(body, api) {
      body.innerHTML = `
        <p class="puzzle-desc">Five brass letter dials, A to Z, set into iron banding.
        Dials read left to right, as all honest writing does.</p>
        <div class="puzzle-row" id="sc-dials"></div>
        <div class="puzzle-row"><button class="btn btn-primary" id="sc-try">Try the Hasp</button></div>
        <div class="puzzle-feedback"></div>`;

      const row = body.querySelector('#sc-dials');
      values.forEach((v, i) => {
        const dial = document.createElement('div');
        dial.className = 'dial';
        dial.innerHTML = `
          <button class="dial-btn" data-d="1">&#9650;</button>
          <div class="dial-face">${ALPHA[v]}</div>
          <button class="dial-btn" data-d="-1">&#9660;</button>`;
        const face = dial.querySelector('.dial-face');
        dial.querySelectorAll('.dial-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            values[i] = (values[i] + Number(btn.dataset.d) + 26) % 26;
            face.textContent = ALPHA[values[i]];
            face.classList.remove('tick'); void face.offsetWidth; face.classList.add('tick');
            game.playSfx('click');
            game.setFlag(`scriptorium_d${i}`, values[i]);
          });
        });
        row.appendChild(dial);
      });

      body.querySelector('#sc-try').addEventListener('click', () => {
        const word = values.map(v => ALPHA[v]).join('');
        if (word === 'NORTH') {
          game.setFlag('scriptorium_chestOpen');
          game.playSfx('unlock');
          api.solved({ message: 'N-O-R-T-H — the hasp falls open like it has been waiting to. North: hold the word. It is not done with you.' });
          game.refreshScene();
        } else {
          api.fail('The hasp holds. Wrong word.');
        }
      });
    },
  });
}
