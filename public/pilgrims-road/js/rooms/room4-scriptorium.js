// ROOM 4 — The Scriptorium. Hardest single room (peak 1).
// Gated by light: the lit candle must be placed in the desk sconce.
// Puzzle: the Chronicle Cipher — 2:4, 5:1, 1:6, 7:3, 3:2 (line:word, first
// letter) in "A Chronicle of the House of Vayne" -> N-O-R-T-H on the chest dials.

import { registerItems } from '../../../shared/js/items.js';
import { kitDefs, shadow } from '../../../shared/js/scenekit.js';

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

// Layout — read off the plate (art/scriptorium.webp): stair arch (left), small
// desk, big desk with its wall sconce, chest (right), wall shelves (top right).
const SCONCE = { cx: 1026, cy: 418 };
const PEN = { cx: 1140, cy: 640 };
const CHEST = { x: 1300, y: 600, w: 290 };
const DOOR = 'M140 625 L140 262 Q212 150 286 262 L286 625 Z';
const R = {
  sconce:  { x: 972, y: 350, w: 110, h: 110 },
  shelf:   { x: 770, y: 30, w: 640, h: 190 },
  desks:   { x: 380, y: 440, w: 380, h: 220 },
  pencase: { x: 1080, y: 596, w: 130, h: 80 },
  chest:   { x: 1296, y: 580, w: 300, h: 230 },
  stair:   { x: 140, y: 256, w: 146, h: 370 },
};

export default {
  id: 'scriptorium',
  lintStates: [{ label: 'lit', flags: { scriptorium_candleLit: true } }, { label: 'open', flags: { scriptorium_candleLit: true, scriptorium_chestOpen: true } }],
  title: 'The Scriptorium',
  intro: 'The silver key lets you into a long room of sloped desks and the smell of oak-gall ink. It is very dark — the moon does not reach here. Somewhere in this room, forty years ago, Brother Edmund wrote things he never sent.',

  scene(state) {
    const lit = !!state.flags.scriptorium_candleLit;
    const chestOpen = !!state.flags.scriptorium_chestOpen;
    const taken = !!state.flags.scriptorium_chestTaken;

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${kitDefs()}
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

      <!-- background plate (generated, lit state); the darkness scrim below dims it until the candle is lit -->
      <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="art/scriptorium.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="art/scriptorium.mp4" type="video/mp4"/></video></foreignObject>

      <!-- the six great tomes, standing on the plate's middle wall-shelf -->
      <image href="art/sc-shelf.webp" x="760" y="-112" width="652" height="337" preserveAspectRatio="xMidYMid meet"/>

      <!-- the painted wall candles are cold: only the one you bring will burn -->
      <path d="M38 352 q7 -6 14 0 l0 18 -14 0 z" fill="#1a1410" opacity="0.9"/>
      <circle cx="${SCONCE.cx}" cy="${SCONCE.cy - 8}" r="22" fill="#0b0908" opacity="0.92"/>

      <!-- the desk sconce on the wall above the big desk (candle target) -->
      <g data-mount="bracket">
        <path d="M${SCONCE.cx - 18} ${SCONCE.cy + 14} q0 -16 18 -16 q18 0 18 16 l-6 8 -24 0 z" fill="url(#sk_brass)" stroke="#4f3b10" stroke-width="1.5"/>
        <path d="M${SCONCE.cx + 18} ${SCONCE.cy + 18} q22 0 22 -22" fill="none" stroke="#3a2a08" stroke-width="4"/>
        ${lit ? `
          <rect x="${SCONCE.cx - 7}" y="${SCONCE.cy - 22}" width="14" height="24" rx="3" fill="#e8d9b0"/>
          <path class="torch-flame fast" d="M${SCONCE.cx} ${SCONCE.cy - 52} q10 12 0 26 q-10 -14 0 -26z" fill="#ffd9a0"/>
          <ellipse cx="${SCONCE.cx - 80}" cy="${SCONCE.cy + 120}" rx="460" ry="280" fill="url(#gd_sc_pool)" class="glow"/>`
        : ''}
      </g>

      <!-- raven-quill pen case, lying on the big desk beside the inkhorns -->
      <g data-mount="table" transform="rotate(-8 ${PEN.cx} ${PEN.cy})">
        ${shadow(PEN.cx, PEN.cy + 12, 52, 7, 0.7)}
        <rect x="${PEN.cx - 46}" y="${PEN.cy - 8}" width="92" height="20" rx="4" fill="url(#sk_darkwood)" stroke="#120b05" stroke-width="2"/>
        ${[0, 1, 2].map(i => `<path d="M${PEN.cx - 30 + i * 12} ${PEN.cy - 6} q20 -24 52 -30 q-20 12 -48 32z" fill="#121318" stroke="#2e3240" stroke-width="1"/>`).join('')}
      </g>

      <!-- Edmund's chest (painted, right): five letter dials set in its front, lid raised once solved -->
      <g data-mount="floor">
        ${chestOpen ? `
          <path d="M${CHEST.x} ${CHEST.y} L${CHEST.x + CHEST.w} ${CHEST.y - 10} L${CHEST.x + CHEST.w - 20} ${CHEST.y - 118} L${CHEST.x + 14} ${CHEST.y - 104} Z" fill="url(#sk_darkwood)" stroke="#0e0905" stroke-width="3"/>
          <path d="M${CHEST.x + 8} ${CHEST.y + 2} L${CHEST.x + CHEST.w - 8} ${CHEST.y - 8} L${CHEST.x + CHEST.w - 22} ${CHEST.y + 34} L${CHEST.x + 20} ${CHEST.y + 42} Z" fill="#0c0912"/>
          ${taken ? '' : `<g class="beckon">
            <rect x="${CHEST.x + 50}" y="${CHEST.y + 6}" width="60" height="30" rx="3" fill="#e8d9b0" transform="rotate(-6 ${CHEST.x + 80} ${CHEST.y + 20})"/>
            <circle cx="${CHEST.x + 180}" cy="${CHEST.y + 20}" r="13" fill="none" stroke="#c9a227" stroke-width="4"/>
          </g>`}`
        : `
          <rect x="${CHEST.x + 28}" y="${CHEST.y + 70}" width="206" height="46" rx="8" fill="#241a10" stroke="#57432a" stroke-width="3" transform="rotate(-3 ${CHEST.x + 131} ${CHEST.y + 93})"/>
          <g font-family="Palatino Linotype, Georgia, serif" font-size="26" fill="#c9a227" text-anchor="middle" transform="rotate(-3 ${CHEST.x + 131} ${CHEST.y + 93})">
            ${[0, 1, 2, 3, 4].map(i =>
              `<text x="${CHEST.x + 49 + i * 41}" y="${CHEST.y + 102}">${ALPHA[(state.flags[`scriptorium_d${i}`] ?? 0)]}</text>`).join('')}
          </g>`}
      </g>

      <!-- the stair door, hung in the painted arch on the left -->
      <g data-mount="wall">
        <clipPath id="clip_sc_door"><path d="${DOOR}"/></clipPath>
        <image href="art/sc-door.webp" x="120" y="150" width="184" height="480" preserveAspectRatio="xMidYMid slice" clip-path="url(#clip_sc_door)"/>
        <path d="${DOOR}" fill="none" stroke="#120b05" stroke-width="5"/>
      </g>

      ${lit ? '' : `
      <!-- darkness: the room before the candle -->
      <rect width="1600" height="900" fill="rgba(4,3,10,0.78)"/>
      <ellipse cx="212" cy="420" rx="200" ry="280" fill="rgba(20,18,34,0.35)"/>
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
      id: 'sconce', ...R.sconce, label: lit ? 'Your candle' : 'Empty desk sconce',
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
        id: 'dark_desks', plate: 'the writing desks', ...R.desks, label: 'Writing desks',
        onInteract(game) { game.say('Vellum, ink horns, a pen case — all of it drowned in dark. You need light before this room will talk.'); },
      });
      spots.push({
        id: 'dark_shelf', ...R.shelf, label: 'High shelf',
        onInteract(game) { game.say('Heavy shapes of books, spines unreadable in the gloom.'); },
      });
    } else {
      spots.push({
        id: 'pencase', ...R.pencase, label: 'Raven-quill pen case',
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
        id: 'shelf', ...R.shelf, label: 'Six great tomes',
        onInteract(game) { openShelf(game); },
      });

      spots.push({
        id: 'desks', ...R.desks, label: 'The copying desks',
        onInteract(game) { game.say('Half-finished psalters, initials never gilded. The pestilence emptied these benches long before you were born.'); },
      });

      if (!chestOpen) {
        spots.push({
          id: 'chest', ...R.chest, label: "Edmund's chest — five letter dials",
          onInteract(game) { openChestPuzzle(game); },
        });
      } else if (!taken) {
        spots.push({
          id: 'chest_open', ...R.chest, label: 'Inside the chest',
          onInteract(game) {
            game.setFlag('scriptorium_chestTaken');
            game.addItem('still_key', { from: { x: 1480, y: 620 }, silent: true });
            game.addItem('recipe_right', { from: { x: 1380, y: 620 }, silent: true });
            game.addItem('edmund_confession', { from: { x: 1430, y: 610 }, silent: true });
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
          id: 'chest_done', ...R.chest, label: "Edmund's chest",
          onInteract(game) { game.say('Empty now, but for forty years of patience.'); },
        });
      }
    }

    spots.push({
      id: 'stairdoor', ...R.stair, label: 'Stair door',
      onInteract(game) {
        if (game.hasItem('still_key')) {
          if (!game.journal.has('sun4')) {
            game.journal.add('sun4', { title: 'Scriptorium — the illuminated O', category: 'sun', sun: { rays: 6, letter: 'O' } });
            game.say('Before you go you thumb the Chronicle open once more: the great illuminated O is a sun of six rays. You copy it — "mark each sun along the road" — and take the stair down.');
            game.completeRoom({ delay: 3000 });
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
        <div class="puzzle-hero" style="background-image:url(art/pz-dials.webp)"></div>
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
