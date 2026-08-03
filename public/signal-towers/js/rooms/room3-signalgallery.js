// SCENE 3 — The Signal Gallery (flash decode; watcher + codebook).
// Each tower SEES a ship's flash sequence but holds the codebook for the OTHER
// ship. You read your flashes to your partner; they decode via their page.
//   West sees Meridian flashes [1,2,3,4] -> (East's Page A) -> "HOLD"  (West enters)
//   East sees vessel flashes  [2,3,1,4] -> (West's Page B) -> "TURN"  (East enters)
// West (P1) finds bearing-mark O (depth 4).

import { getRole, isWest, towerName, otherTowerName } from '../role.js';
import { defs, backdrop, rain, towerTag } from '../scenekit.js';

const SLUG = 'sig';
const MY_FLASHES = { p1: [1, 2, 3, 4], p2: [2, 3, 1, 4] };  // what THIS tower sees (read to partner)
const MY_PAGE = {                                            // codebook page THIS tower holds (for partner)
  p1: { title: 'Codebook — Page B', map: { 1: 'R', 2: 'T', 3: 'U', 4: 'N' } },
  p2: { title: 'Codebook — Page A', map: { 1: 'H', 2: 'O', 3: 'L', 4: 'D' } },
};
const MY_ANSWER = { p1: 'HOLD', p2: 'TURN' };                // what THIS tower must enter

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

      <!-- gallery window frame -->
      <rect x="120" y="120" width="900" height="360" rx="8" fill="none" stroke="#3a4656" stroke-width="14"/>
      <line x1="570" y1="120" x2="570" y2="480" stroke="#3a4656" stroke-width="8"/>

      <!-- the ship + its flashing lamp -->
      <g>
        <path d="M300 400 q120 -30 300 0 l-30 44 q-120 20 -240 0 z" fill="#1c2431" stroke="#3a4656" stroke-width="4"/>
        <rect x="430" y="320" width="14" height="80" fill="#2b3547"/>
        <circle cx="437" cy="300" r="12" fill="#ffe6a6" class="${SLUG}_lamp"/>
        <circle cx="437" cy="300" r="26" fill="rgba(255,230,166,0.25)" class="${SLUG}_lamp"/>
      </g>

      <!-- flash recorder board (this tower's counts) -->
      <g>
        <rect x="1080" y="150" width="440" height="230" rx="8" fill="#0e2032" stroke="#9fc7dd" stroke-width="3"/>
        <text x="1300" y="192" text-anchor="middle" font-size="16" fill="#9fc7dd" font-family="Consolas, monospace" letter-spacing="2">FLASH RECORDER</text>
        ${MY_FLASHES[getRole()].map((n, i) => `
          <g transform="translate(1120 ${230 + i * 34})">
            <text x="0" y="6" font-size="14" fill="#7f8a99" font-family="Consolas, monospace">grp ${i + 1}</text>
            ${Array.from({ length: n }, (_, j) => `<circle cx="${90 + j * 30}" cy="1" r="8" fill="#ffe6a6"/>`).join('')}
            <text x="${90 + n * 30 + 14}" y="6" font-size="15" fill="#fff6df" font-family="Consolas, monospace">= ${n}</text>
          </g>`).join('')}
      </g>

      <!-- codebook on a stand (the page THIS tower holds) -->
      <g>
        <rect x="240" y="600" width="300" height="200" rx="8" fill="#efe6cf" transform="rotate(-2 390 700)"/>
        <text x="390" y="650" text-anchor="middle" font-size="18" fill="#6b4f2c" font-family="Georgia, serif" transform="rotate(-2 390 700)">${MY_PAGE[getRole()].title}</text>
        <text x="390" y="690" text-anchor="middle" font-size="13" fill="#33291a" font-family="Georgia, serif" transform="rotate(-2 390 700)">count → letter</text>
      </g>

      <!-- the brass signal key (word lock) -->
      <g>
        <rect x="640" y="640" width="300" height="170" rx="10" fill="${done ? '#12303f' : '#2b3547'}" stroke="#c9a227" stroke-width="5"/>
        <text x="790" y="700" text-anchor="middle" font-size="16" fill="#9fc7dd" font-family="Consolas, monospace">SIGNAL KEY</text>
        <text x="790" y="748" text-anchor="middle" font-size="26" fill="#e8c85a" font-family="Consolas, monospace" letter-spacing="6">
          ${done ? MY_ANSWER[getRole()] : '_ _ _ _'}</text>
        <text x="790" y="784" text-anchor="middle" font-size="12" fill="#7f8a99" font-family="Consolas, monospace">${done ? 'acknowledged' : 'enter the decoded word'}</text>
      </g>

      ${markHere ? `
      <g class="beckon">
        <circle cx="1050" cy="720" r="22" fill="rgba(201,162,39,0.08)" stroke="#c9a227" stroke-width="3"/>
        <text x="1050" y="728" text-anchor="middle" font-size="20" fill="#e8c85a" font-family="Consolas, monospace" font-weight="bold">4</text>
        <text x="1050" y="762" text-anchor="middle" font-size="14" fill="#e8dcc0" font-family="Georgia, serif">brass mark</text>
      </g>` : ''}

      ${towerTag()}
      ${rain(SLUG)}
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const done = sent(state);
    const role = getRole();

    spots.push({
      id: 'flashes', x: 1080, y: 150, w: 440, h: 230, label: 'Flash recorder',
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
      id: 'codebook', x: 240, y: 600, w: 300, h: 200, label: 'The codebook page you hold',
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
      id: 'ship', x: 120, y: 260, w: 440, h: 220, label: 'The ship in the storm',
      onInteract(game) {
        game.say(isWest()
          ? 'The Meridian, flashing the same word again and again. She is asking you something. You just cannot read it — but your partner can.'
          : 'A lugger off the point, flashing hard. Someone aboard knows the old code even if you do not.');
      },
    });

    if (isWest() && !state.journal.some(e => e.id === 'mark_o')) {
      spots.push({
        id: 'mark_o', x: 1010, y: 680, w: 90, h: 100, label: 'A brass bearing-mark',
        onInteract(game) {
          game.journal.add('mark_o', { title: 'West Tower — by the telescope', category: 'sun', sun: { rays: 4, letter: 'O' } });
          game.say('Bolted beside the signal telescope: a brass mark, bearing 4, letter O. Logged.');
          game.refreshScene();
        },
      });
    }

    if (!done) {
      spots.push({
        id: 'key', x: 640, y: 640, w: 300, h: 170, label: 'The signal key — enter the word',
        onInteract(game) { openKey(game); },
      });
    } else {
      spots.push({
        id: 'up', x: 640, y: 640, w: 300, h: 170, label: 'The stair up',
        onInteract(game) {
          if (isWest() && !game.journal.has('mark_o')) { game.say('A bearing-mark sits by the telescope — take it before you climb.'); return; }
          game.completeRoom({ delay: 600 });
        },
      });
    }

    return spots;
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: 'You can see your ship\'s flashes but not read them. Your partner holds the page for YOUR flashes; you hold the page for THEIRS. Read your counts to them, and decode theirs for them.', cost: 60 },
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
