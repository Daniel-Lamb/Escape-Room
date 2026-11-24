// SCENE 3 — The Signal Gallery (flash decode; watcher + codebook).
// Each tower SEES a ship's flash sequence but holds the codebook for the OTHER
// ship. You read your flashes to your partner; they decode via their page.
//   West sees Meridian flashes [1,2,3,4] -> (East's Page A) -> "HOLD"  (West enters)
//   East sees vessel flashes  [2,3,1,4] -> (West's Page B) -> "TURN"  (East enters)
// West (P1) finds bearing-mark O (needle SE).

import { getRole, isWest, towerName, otherTowerName } from '../role.js';
import { defs, backdrop, rainOutside, interior, bearingOf, towerTag } from '../scenekit.js';
import { dock, DOCK, panel, shadow } from '../../../shared/js/scenekit.js';

const SLUG = 'sig';
const MY_FLASHES = { p1: [1, 2, 3, 4], p2: [2, 3, 1, 4] };  // what THIS tower sees (read to partner)
const MY_PAGE = {                                            // codebook page THIS tower holds (for partner)
  p1: { title: 'Codebook — Page B', map: { 1: 'R', 2: 'T', 3: 'U', 4: 'N' } },
  p2: { title: 'Codebook — Page A', map: { 1: 'H', 2: 'O', 3: 'L', 4: 'D' } },
};
const MY_ANSWER = { p1: 'HOLD', p2: 'TURN' };                // what THIS tower must enter

// The gallery: a wide window out to sea (the ship is seen only through it), the
// flash recorder chalked on the wall, the telescope on its tripod, the signal
// key on its desk, and the ladder up at the right. The codebook page is in the
// signal book.
const FLOOR = 700;
const WIN = { x: 120, y: 100, w: 880, h: 370 };
const BOARD = { x: 1070, y: 250, w: 400, h: 220 };
const SCOPE = { cx: 1110, top: 560 };
const KEY = { x: 600, y: 540, w: 300, h: 124 };
const DESK_FOOT = 790;
const LADDER = { x: 1500, y: 236, w: 84, h: 524 };
const MARK = { x: 1065, y: 470, w: 90, h: 90 };

function sent(state) { return !!state.flags.signalgallery_sent; }

function pips(counts) {
  return counts.map((n, i) => {
    const dots = Array.from({ length: n }, () => '<circle r="7" fill="#ffe6a6"/>');
    return `<div style="display:flex;align-items:center;gap:10px;margin:6px 0;">
      <span style="color:#7f8a99;font-family:Consolas,monospace;width:64px;">flash ${i + 1}</span>
      <svg width="${n * 26}" height="20" viewBox="0 0 ${n * 26} 20">
        ${dots.map((d, j) => `<g transform="translate(${13 + j * 26} 10)">${d}</g>`).join('')}
      </svg>
      <span style="color:#fff6df;font-family:Consolas,monospace;">= ${n}</span>
    </div>`;
  }).join('');
}

export default {
  id: 'signalgallery',
  get title() { return `${towerName()} · The Signal Gallery`; },
  get intro() {
    return isWest()
      ? 'The gallery windows face straight out to sea. The Meridian is flashing her lamp at you — a word, over and over — but the West codebook page for her signals is missing. You can count her flashes; your partner can read them.'
      : 'From the East gallery you can see a second lamp flashing off the point — a fishing lugger, caught out. You can count its flashes but cannot read them; your partner holds the page that can. And they need you to read the page you are holding.';
  },

  scene(state) {
    const done = sent(state);
    const markHere = isWest() && !state.journal.some(e => e.id === 'mark_o');
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}
        <style>@keyframes ${SLUG}_blink { 0%,44%{opacity:0.15} 50%,94%{opacity:1} 100%{opacity:0.15} } .${SLUG}_lamp{animation:${SLUG}_blink 1.1s steps(1) infinite;}</style>
      </defs>
      ${backdrop(SLUG)}
      ${interior(SLUG, { window: { ...WIN, shape: 'rect' }, floorY: FLOOR })}

      <!-- through the gallery window: the ship and her flashing lamp -->
      <g clip-path="url(#${SLUG}_win)">
        <path d="M300 400 q120 -30 300 0 l-30 44 q-120 20 -240 0 z" fill="#1c2431" stroke="#3a4656" stroke-width="4"/>
        <rect x="430" y="320" width="14" height="80" fill="#2b3547"/>
        <circle cx="437" cy="300" r="12" fill="#ffe6a6" class="${SLUG}_lamp"/>
        <circle cx="437" cy="300" r="26" fill="rgba(255,230,166,0.25)" class="${SLUG}_lamp"/>
      </g>

      <!-- the flash recorder: a chalkboard on the wall, this tower's counts -->
      ${panel({ ...BOARD, material: 'slate', mount: 'nails', body: `
        <text x="${BOARD.x + BOARD.w / 2}" y="${BOARD.y + 38}" text-anchor="middle" font-size="16" fill="#c8d4dc" font-family="Consolas, monospace" letter-spacing="2">FLASH RECORDER</text>
        ${MY_FLASHES[getRole()].map((n, i) => `
          <g transform="translate(${BOARD.x + 34} ${BOARD.y + 76 + i * 36})">
            <text x="0" y="6" font-size="14" fill="#a9b6c0" font-family="Consolas, monospace">grp ${i + 1}</text>
            ${Array.from({ length: n }, (_, j) => `<circle cx="${90 + j * 30}" cy="1" r="8" fill="#eef2f4"/>`).join('')}
            <text x="${90 + n * 30 + 14}" y="6" font-size="15" fill="#eef2f4" font-family="Consolas, monospace">= ${n}</text>
          </g>`).join('')}` })}

      <!-- the signal telescope on its tripod, aimed out to sea -->
      <g data-mount="floor">
        ${shadow(SCOPE.cx, FLOOR + 40, 90, 10)}
        <line x1="${SCOPE.cx}" y1="${SCOPE.top + 30}" x2="${SCOPE.cx - 70}" y2="${FLOOR + 40}" stroke="#3a2818" stroke-width="9" stroke-linecap="round"/>
        <line x1="${SCOPE.cx}" y1="${SCOPE.top + 30}" x2="${SCOPE.cx + 70}" y2="${FLOOR + 40}" stroke="#3a2818" stroke-width="9" stroke-linecap="round"/>
        <line x1="${SCOPE.cx}" y1="${SCOPE.top + 30}" x2="${SCOPE.cx + 8}" y2="${FLOOR + 30}" stroke="#24180d" stroke-width="8" stroke-linecap="round"/>
        <rect x="${SCOPE.cx - 22}" y="${SCOPE.top + 14}" width="44" height="26" rx="4" fill="url(#sk_iron)"/>
        <g transform="rotate(-14 ${SCOPE.cx} ${SCOPE.top})">
          <rect x="${SCOPE.cx - 150}" y="${SCOPE.top - 14}" width="190" height="28" rx="6" fill="url(#sk_brass)" stroke="#3a2a0c" stroke-width="2"/>
          <rect x="${SCOPE.cx - 170}" y="${SCOPE.top - 18}" width="26" height="36" rx="4" fill="url(#sk_brass)" stroke="#3a2a0c" stroke-width="2"/>
        </g>
      </g>

      <!-- the signal desk and its brass key (the word lock) -->
      <g data-mount="floor">
        ${shadow(790, DESK_FOOT + 4, 240, 12)}
        <rect x="${KEY.x - 40}" y="${KEY.y + KEY.h}" width="${KEY.w + 80}" height="22" rx="4" fill="url(#sk_wood)" stroke="#1c120a" stroke-width="2"/>
        <rect x="${KEY.x - 26}" y="${KEY.y + KEY.h + 22}" width="22" height="${DESK_FOOT - KEY.y - KEY.h - 22}" fill="#38290f"/>
        <rect x="${KEY.x + KEY.w + 4}" y="${KEY.y + KEY.h + 22}" width="22" height="${DESK_FOOT - KEY.y - KEY.h - 22}" fill="#38290f"/>
      </g>
      ${panel({ ...KEY, material: 'brass', mount: 'table', body: `
        <text x="${KEY.x + KEY.w / 2}" y="${KEY.y + 34}" text-anchor="middle" font-size="15" fill="#2a1d05" font-family="Consolas, monospace">SIGNAL KEY</text>
        <rect x="${KEY.x + 34}" y="${KEY.y + 48}" width="${KEY.w - 68}" height="44" rx="4" fill="#141c26"/>
        <text x="${KEY.x + KEY.w / 2}" y="${KEY.y + 80}" text-anchor="middle" font-size="26" fill="#e8c85a" font-family="Consolas, monospace" letter-spacing="6">${done ? MY_ANSWER[getRole()] : '_ _ _ _'}</text>
        <text x="${KEY.x + KEY.w / 2}" y="${KEY.y + 112}" text-anchor="middle" font-size="12" fill="#2a1d05" font-family="Consolas, monospace">${done ? 'acknowledged' : 'enter the decoded word'}</text>` })}

      <!-- the ladder up -->
      <g data-mount="floor">
        ${[LADDER.x + 12, LADDER.x + LADDER.w - 12].map(lx => `<rect x="${lx - 5}" y="${LADDER.y}" width="10" height="${LADDER.h}" fill="url(#sk_iron)"/>`).join('')}
        ${Array.from({ length: 9 }, (_, i) => `<rect x="${LADDER.x + 12}" y="${LADDER.y + 30 + i * 54}" width="${LADDER.w - 24}" height="7" fill="#3a414d"/>`).join('')}
        <rect x="${LADDER.x - 16}" y="0" width="${LADDER.w + 32}" height="${LADDER.y + 4}" fill="#0a0d12"/>
      </g>

      <!-- this tower's codebook page, in the signal book -->
      ${dock({ x: 0, y: 0, w: 300, h: 210 }, `
        <text x="150" y="36" text-anchor="middle" font-size="22" fill="#6b4f2c" font-family="Georgia, serif">${MY_PAGE[getRole()].title}</text>
        ${Object.entries(MY_PAGE[getRole()].map).map(([k, v], i) => `
          <text x="96" y="${78 + i * 32}" text-anchor="middle" font-size="20" fill="#26221a" font-family="Consolas, monospace">${k} flash${k === '1' ? '' : 'es'}</text>
          <text x="170" y="${78 + i * 32}" text-anchor="middle" font-size="18" fill="#6b5a3a" font-family="Georgia, serif">=</text>
          <text x="214" y="${78 + i * 32}" text-anchor="middle" font-size="24" fill="#26221a" font-family="Georgia, serif">${v}</text>`).join('')}`, { kind: 'notebook', title: 'SIGNAL BOOK' })}

      ${markHere ? `
      <g class="beckon">
        <circle cx="${MARK.x + 45}" cy="${MARK.y + 45}" r="20" fill="url(#sk_brass)" stroke="#c9a227" stroke-width="3"/>
        <text x="${MARK.x + 45}" y="${MARK.y + 51}" text-anchor="middle" font-size="16" fill="#2a1d05" font-family="Consolas, monospace" font-weight="bold">${bearingOf(4)}</text>
      </g>` : ''}

      ${towerTag()}
      ${rainOutside(SLUG)}
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const done = sent(state);
    const role = getRole();

    spots.push({
      id: 'flashes', ...BOARD, label: 'Flash recorder',
      onInteract(game) {
        const counts = MY_FLASHES[role];
        const html = `<div class="chartcard"><div class="chart-title">Recorded flashes — ${isWest() ? 'the Meridian' : 'the lugger'}</div>
          ${pips(counts)}
          </div>
          <div class="relay">You can count them but not read them. Read the four counts (<strong>${counts.join(', ')}</strong>) to your partner — their codebook page will turn them into your word.</div>`;
        game.journal.add('note_flashes', { title: 'Recorded flashes (your ship)', category: 'note', html });
        game.dialog({ title: 'The Flashes', html });
      },
    });

    spots.push({
      id: 'codebook', ...DOCK, label: 'The codebook page you hold',
      onInteract(game) {
        const page = MY_PAGE[role];
        const rows = Object.entries(page.map).map(([k, v]) =>
          `<tr><td style="padding:2px 18px;color:#fff6df;">${k} flashes</td><td style="padding:2px 18px;color:#e8c85a;">${v}</td></tr>`).join('');
        const html = `<div class="chartcard"><div class="chart-title">${page.title}</div>
          <table style="margin:0 auto;font-family:Consolas,monospace;font-size:16px;">${rows}</table></div>
          <div class="relay">This page decodes your <strong>partner's</strong> flashes, not yours. When they read you their counts, look each up and read them the letter — in order it spells their word.</div>`;
        game.journal.add('note_codebook', { title: page.title, category: 'note', html });
        game.dialog({ title: page.title, html });
      },
    });

    spots.push({
      id: 'ship', x: 280, y: 270, w: 340, h: 190, label: 'The ship in the storm',
      onInteract(game) {
        game.say(isWest()
          ? 'The Meridian, flashing the same word again and again. She is asking you something. You just cannot read it — but your partner can.'
          : 'A lugger off the point, flashing hard. Someone aboard knows the old code even if you do not.');
      },
    });

    if (isWest() && !state.journal.some(e => e.id === 'mark_o')) {
      spots.push({
        id: 'mark_o', ...MARK, label: 'A brass bearing-mark',
        onInteract(game) {
          game.journal.add('mark_o', { title: 'West Tower — by the telescope', category: 'sun', sun: { rays: 4, letter: 'O' } });
          game.say(`Bolted to the telescope's tripod head: a brass compass-plate, its needle pointing ${bearingOf(4)}, and the letter O. Logged.`);
          game.refreshScene();
        },
      });
    }

    if (!done) {
      spots.push({
        id: 'key', ...KEY, label: 'The signal key — enter the word',
        onInteract(game) { openKey(game); },
      });
    } else {
      spots.push({
        id: 'up', ...LADDER, label: 'The ladder up',
        onInteract(game) {
          if (isWest() && !game.journal.has('mark_o')) { game.say('A bearing-mark is bolted to the telescope tripod — take it before you climb.'); return; }
          game.completeRoom({ delay: 600 });
        },
      });
    }

    return spots;
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: 'You can see your ship\'s flashes but not read them. Your partner has the page for YOUR flashes; you have the page for THEIRS. Read your counts to them, and decode theirs for them.', cost: 60 },
      { text: 'Count each burst: four groups, four letters. Read your four counts aloud; your partner looks each up on their page and reads you the word. Do the same for them.', cost: 120 },
      { text: isWest() ? 'Your flashes decode to HOLD.' : 'Your flashes decode to TURN.', cost: 240 },
    ];
  },
};

function openKey(game) {
  const answer = MY_ANSWER[getRole()];
  game.openPuzzle({
    id: 'signalgallery_key',
    title: 'The Signal Key',
    render(body, api) {
      body.innerHTML = `
        <div class="puzzle-hero" style="background-image:url(art/pz-signal.webp)"></div>
        <p class="puzzle-desc">Read your recorded flash-counts to your partner. Their codebook
        page turns them into a four-letter word. Key it in here.</p>
        <div class="puzzle-row">
          <input class="puzzle-input" id="sg-word" maxlength="4" autocomplete="off"
            placeholder="4 letters" style="text-transform:uppercase;letter-spacing:8px;text-align:center;width:180px;" />
        </div>
        <div class="puzzle-row"><button class="btn btn-primary" id="sg-try">Key it In</button></div>
        <div class="puzzle-feedback"></div>`;
      const input = body.querySelector('#sg-word');
      const submit = () => {
        const v = (input.value || '').trim().toUpperCase();
        if (v === answer) {
          game.setFlag('signalgallery_sent');
          game.playSfx('solve');
          api.solved({ message: 'You key the word back and the ship\'s lamp answers with a single long, grateful flash. Message received.' });
          game.refreshScene();
        } else {
          api.fail('No answering flash. That is not the word — check the counts and the page with your partner.');
        }
      };
      body.querySelector('#sg-try').addEventListener('click', submit);
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
    },
  });
}
