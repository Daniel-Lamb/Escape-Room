// SCENE 2 — The Library (split cipher; two mirror-halves of a diary).
// Each side's lock word is a run of symbols only the OTHER side's page decodes.
//   Waking code ◆●▲■ -> (Glass's Page A) -> MOTH   (Waking enters)
//   Glass  code ★✚♦♥ -> (Waking's Page B) -> VEIL   (Glass enters)
// Glass (P2) finds mirror-shard E (2).

import { getRole, isWaking, sideName, otherSideName } from '../role.js';
import { defs, backdrop, sideTag, sconce, tint } from '../glasskit.js';

const SLUG = 'library';
const MY_CODE = { p1: ['◆', '●', '▲', '■'], p2: ['★', '✚', '♦', '♥'] };   // this side's coded word (relay to partner)
const MY_PAGE = {                                                          // page THIS side holds (decodes partner's code)
  p1: { title: 'Diary — Page B', map: { '★': 'V', '✚': 'E', '♦': 'I', '♥': 'L' } },
  p2: { title: 'Diary — Page A', map: { '◆': 'M', '●': 'O', '▲': 'T', '■': 'H' } },
};
const MY_ANSWER = { p1: 'MOTH', p2: 'VEIL' };

function done(state) { return !!state.flags.library_done; }

export default {
  id: 'library',
  get title() { return `${sideName()} · The Library`; },
  get intro() {
    return 'The library, floor to ceiling with books, and between two of them a lock cut with strange marks. A diary lies open — but only half of it is on your side of the glass. The other half is with your partner, and neither cipher reads without the other.';
  },

  scene(state) {
    const t = tint();
    const fin = done(state);
    const markHere = getRole() === 'p2' && !state.journal.some(e => e.id === 'shard_e');
    const code = MY_CODE[getRole()];
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}</defs>
      ${backdrop(SLUG)}
      ${sconce(SLUG, 240, 300)}

      <!-- bookshelves -->
      <g>
        ${[150, 250, 350, 450].map(y => `<rect x="1040" y="${y}" width="460" height="14" fill="${t.accentDim}" opacity="0.5"/>`).join('')}
        ${[0, 1, 2, 3].map(r => [0, 1, 2, 3, 4, 5, 6, 7].map(c =>
          `<rect x="${1055 + c * 56}" y="${160 + r * 100 - 66}" width="${28 + (c % 3) * 6}" height="66" fill="${['#3a2d44', '#2a2636', '#43324a', '#241c30'][c % 4]}"/>`).join('')).join('')}
      </g>

      <!-- the diary (the page THIS side holds) -->
      <g>
        <rect x="240" y="600" width="320" height="210" rx="6" fill="#efe6cf" transform="rotate(-2 400 705)"/>
        <text x="400" y="650" text-anchor="middle" font-size="18" fill="#6b4f2c" font-family="Georgia, serif" transform="rotate(-2 400 705)">${MY_PAGE[getRole()].title}</text>
        <text x="400" y="686" text-anchor="middle" font-size="13" fill="#33291a" font-family="Georgia, serif" transform="rotate(-2 400 705)">a key of marks</text>
      </g>

      <!-- the symbol-lock (this side's coded word) -->
      <g>
        <rect x="620" y="430" width="360" height="180" rx="10" fill="${fin ? '#0a0810' : t.panel}" stroke="${t.accentDim}" stroke-width="5"/>
        <text x="800" y="480" text-anchor="middle" font-size="15" fill="${t.accentDim}" font-family="Georgia, serif">THE MARK-LOCK</text>
        <text x="800" y="546" text-anchor="middle" font-size="46" fill="${t.accent}" letter-spacing="10">${code.join(' ')}</text>
        <text x="800" y="586" text-anchor="middle" font-size="12" fill="#9fa8bd" font-family="Consolas, monospace">${fin ? MY_ANSWER[getRole()] + ' — accepted' : 'read the marks to your partner'}</text>
      </g>

      ${markHere ? `
      <g class="beckon">
        <polygon points="1030,690 1075,682 1082,726 1060,760 1028,750 1020,714" fill="rgba(201,204,214,0.10)" stroke="#c9ccd6" stroke-width="2.5"/>
        <text x="1050" y="726" text-anchor="middle" font-size="18" fill="#dfe6f2" font-family="Consolas, monospace" font-weight="bold">2</text>
      </g>` : ''}

      ${sideTag()}
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const t = tint();
    const role = getRole();

    spots.push({
      id: 'lock', x: 620, y: 430, w: 360, h: 180, label: 'The mark-lock',
      onInteract(game) {
        if (done(state)) { game.say('The marks are answered; the shelf has already swung aside.'); return; }
        openLock(game);
      },
    });

    spots.push({
      id: 'code', x: 620, y: 500, w: 360, h: 90, label: 'The marks on the lock',
      onInteract(game) {
        const code = MY_CODE[role];
        const html = `<div class="cipher"><div class="cipher-title">The lock's marks</div>
          <p style="text-align:center;font-size:34px;letter-spacing:10px;color:#f2ecdb;">${code.join(' ')}</p></div>
          <div class="relay">You can't read these — your half of the diary decodes your <strong>partner's</strong> marks, not yours. Read these four marks to your partner; their page turns them into your word.</div>`;
        game.journal.add('note_marks', { title: 'The lock marks (your word)', category: 'note', html });
        game.dialog({ title: 'The Marks', html });
      },
    });

    spots.push({
      id: 'diary', x: 240, y: 600, w: 320, h: 210, label: 'The diary page you hold',
      onInteract(game) {
        const page = MY_PAGE[role];
        const rows = Object.entries(page.map).map(([k, v]) =>
          `<tr><td style="padding:3px 20px;color:#f2ecdb;font-size:22px;">${k}</td><td style="padding:3px 20px;color:#c9ccd6;">${v}</td></tr>`).join('');
        const html = `<div class="cipher"><div class="cipher-title">${page.title}</div>
          <table style="margin:0 auto;font-family:Consolas,monospace;">${rows}</table></div>
          <div class="relay">This decodes your <strong>partner's</strong> marks. When they read you four marks, look each up and read them the letters — in order it spells their word.</div>`;
        game.journal.add('note_diarypage', { title: page.title, category: 'note', html });
        game.dialog({ title: page.title, html });
      },
    });

    if (role === 'p2' && !state.journal.some(e => e.id === 'shard_e')) {
      spots.push({
        id: 'shard_e', x: 1010, y: 670, w: 90, h: 110, label: 'A mirror-shard',
        onInteract(game) {
          game.journal.add('shard_e', { title: 'Library — tucked in a spine', category: 'sun', sun: { rays: 2, letter: 'E' } });
          game.say('A mirror-shard, slipped into a book like a bookmark: numbered 2, letter E. Kept.');
          game.refreshScene();
        },
      });
    }

    if (done(state)) {
      spots.push({
        id: 'out', x: 1040, y: 150, w: 460, h: 400, label: 'The shelf-passage',
        onInteract(game) {
          if (role === 'p2' && !game.journal.has('shard_e')) { game.say('A shard is tucked into one of the spines — take it before you go.'); return; }
          game.completeRoom({ delay: 600 });
        },
      });
    }

    return spots;
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: 'Your half of the diary decodes your partner\'s marks, not your own. Read your four lock-marks to them; decode theirs for them.', cost: 60 },
      { text: 'Four marks, four letters. Read your marks aloud; your partner looks each up on their page and reads you the word. Do the same for them.', cost: 120 },
      { text: isWaking() ? 'Your marks spell MOTH.' : 'Your marks spell VEIL.', cost: 240 },
    ];
  },
};

function openLock(game) {
  const answer = MY_ANSWER[getRole()];
  game.openPuzzle({
    id: 'library_lock',
    title: 'The Mark-Lock',
    render(body, api) {
      body.innerHTML = `
        <div class="puzzle-hero" style="background-image:url(art/pz-diary.webp)"></div>
        <p class="puzzle-desc">Read the lock's marks to your partner; their diary page turns them
        into a four-letter word. Set it here.</p>
        <div class="puzzle-row">
          <input class="puzzle-input" id="lb-word" maxlength="4" autocomplete="off"
            placeholder="4 letters" style="text-transform:uppercase;letter-spacing:8px;text-align:center;width:180px;" />
        </div>
        <div class="puzzle-row"><button class="btn btn-primary" id="lb-try">Set the Word</button></div>
        <div class="puzzle-feedback"></div>`;
      const input = body.querySelector('#lb-word');
      const submit = () => {
        const v = (input.value || '').trim().toUpperCase();
        if (v === answer) {
          game.setFlag('library_done');
          game.playSfx('solve');
          api.solved({ message: 'The marks glow and sink, and a section of shelving swings back on a hidden hinge, breathing cold hall-air.' });
          game.refreshScene();
        } else {
          api.fail('The marks stay dark. Check the reading with your partner.');
        }
      };
      body.querySelector('#lb-try').addEventListener('click', submit);
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
    },
  });
}
