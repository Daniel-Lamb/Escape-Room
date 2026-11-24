// SCENE 2 — The Library (split cipher; two mirror-halves of a diary).
// Each side's lock word is a run of symbols only the OTHER side's page decodes.
//   Waking code ◆●▲■ -> (Glass's Page A) -> MOTH   (Waking enters)
//   Glass  code ★✚♦♥ -> (Waking's Page B) -> VEIL   (Glass enters)
// Glass (P2) finds mirror-shard E (2).

import { getRole, isWaking, sideName, otherSideName } from '../role.js';
import { defs, backdrop, sideTag, sconce, tint } from '../glasskit.js';
import { dock, DOCK, panel } from '../../../shared/js/scenekit.js';

const SLUG = 'library';
const MY_CODE = { p1: ['◆', '●', '▲', '■'], p2: ['★', '✚', '♦', '♥'] };   // this side's coded word (relay to partner)
const MY_PAGE = {                                                          // page THIS side holds (decodes partner's code)
  p1: { title: 'Diary — Page B', map: { '★': 'V', '✚': 'E', '♦': 'I', '♥': 'L' } },
  p2: { title: 'Diary — Page A', map: { '◆': 'M', '●': 'O', '▲': 'T', '■': 'H' } },
};
const MY_ANSWER = { p1: 'MOTH', p2: 'VEIL' };

// On the library plate: the first bookcase bay (left of the ladder) is the
// hidden door; the tumblers are set into it. The diary page lives in the
// pocket-book; the shard is slipped into the book stack on the reading table.
const BAY = { x: 104, y: 260, w: 150, h: 506 };
const LOCK = { x: 112, y: 372, w: 134, h: 330 };
const PAGE = { x: 0, y: 0, w: 320, h: 210 };
const SHARD = { x: 1150, y: 560, w: 90, h: 95 };

function done(state) { return !!state.flags.library_done; }

export default {
  id: 'library',
  lintStates: [{ label: 'solved', flags: { library_done: true } }],
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
      ${sconce(SLUG, 697, 446)}

      <!-- the mark-lock: four tumblers set into the left-hand bookcase, which is the door -->
      ${fin ? `
      <g data-mount="wall">
        <rect x="${BAY.x}" y="${BAY.y}" width="${BAY.w}" height="${BAY.h}" fill="#050308"/>
        <rect data-fx="light" x="${BAY.x + 10}" y="${BAY.y + 20}" width="${BAY.w - 20}" height="${BAY.h - 30}" fill="${isWaking() ? 'rgba(255,207,138,0.08)' : 'rgba(159,168,189,0.10)'}"/>
        <path d="M${BAY.x + BAY.w} ${BAY.y} L${BAY.x + BAY.w + 46} ${BAY.y - 24} L${BAY.x + BAY.w + 46} ${BAY.y + BAY.h + 26} L${BAY.x + BAY.w} ${BAY.y + BAY.h} Z" fill="url(#sk_darkwood)" stroke="#0b0703" stroke-width="3"/>
      </g>` : panel({ ...LOCK, material: 'brass', mount: 'bolts', body: `
        <text x="${LOCK.x + LOCK.w / 2}" y="${LOCK.y + 30}" text-anchor="middle" font-size="13" fill="#2a1d05" font-family="Georgia, serif" letter-spacing="1">MARK-LOCK</text>
        ${code.map((m, i) => `
          <rect x="${LOCK.x + 30}" y="${LOCK.y + 48 + i * 68}" width="${LOCK.w - 46}" height="54" rx="5" fill="#140f06" stroke="#4f3b10" stroke-width="2"/>
          <text x="${LOCK.x + 17}" y="${LOCK.y + 80 + i * 68}" text-anchor="middle" font-size="13" fill="#2a1d05" font-family="Consolas, monospace">${i + 1}</text>
          <text x="${LOCK.x + 30 + (LOCK.w - 46) / 2}" y="${LOCK.y + 87 + i * 68}" text-anchor="middle" font-size="34" fill="${t.accent}">${m}</text>`).join('')}` })}

      <!-- the diary page this side holds, in the pocket-book -->
      ${dock(PAGE, `
        <text x="${PAGE.x + PAGE.w / 2}" y="${PAGE.y + 34}" text-anchor="middle" font-size="22" fill="#6b4f2c" font-family="Georgia, serif">${MY_PAGE[getRole()].title}</text>
        ${Object.entries(MY_PAGE[getRole()].map).map(([k, v], i) => `
          <text x="${PAGE.x + 110}" y="${PAGE.y + 74 + i * 34}" text-anchor="middle" font-size="26" fill="#26221a">${k}</text>
          <text x="${PAGE.x + 160}" y="${PAGE.y + 72 + i * 34}" text-anchor="middle" font-size="18" fill="#6b5a3a" font-family="Georgia, serif">=</text>
          <text x="${PAGE.x + 210}" y="${PAGE.y + 74 + i * 34}" text-anchor="middle" font-size="26" fill="#26221a" font-family="Georgia, serif">${v}</text>`).join('')}`, { kind: 'notebook', title: 'POCKET-BOOK' })}

      ${markHere ? `
      <g class="beckon">
        <polygon points="1180,632 1185,586 1203,576 1216,598 1211,632" fill="rgba(201,204,214,0.14)" stroke="#c9ccd6" stroke-width="2.5"/>
        <text x="1198" y="616" text-anchor="middle" font-size="16" fill="#dfe6f2" font-family="Consolas, monospace" font-weight="bold">2</text>
      </g>` : ''}

      ${sideTag()}
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const t = tint();
    const role = getRole();

    if (!done(state)) {
      spots.push({
        id: 'lock', ...LOCK, label: 'The mark-lock',
        onInteract(game) { openLock(game); },
      });
    }

    spots.push({
      id: 'diary', ...DOCK, label: 'The diary page you hold',
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
        id: 'shard_e', ...SHARD, label: 'A mirror-shard',
        onInteract(game) {
          game.journal.add('shard_e', { title: 'Library — in the reading-table books', category: 'sun', sun: { rays: 2, letter: 'E' } });
          game.say('A mirror-shard, slipped into a book on the reading table like a bookmark: numbered 2, letter E. Kept.');
          game.refreshScene();
        },
      });
    }

    if (done(state)) {
      spots.push({
        id: 'out', ...BAY, label: 'The bookcase passage',
        onInteract(game) {
          if (role === 'p2' && !game.journal.has('shard_e')) { game.say('A shard is tucked into the books on the reading table — take it before you go.'); return; }
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
  const code = MY_CODE[getRole()];
  game.journal.add('note_marks', { title: 'The lock marks (your word)', category: 'note', html: `<div class="cipher"><div class="cipher-title">The lock's marks</div>
    <p style="text-align:center;font-size:34px;letter-spacing:10px;color:#f2ecdb;">${code.join(' ')}</p></div>
    <div class="relay">Your half of the diary decodes your <strong>partner's</strong> marks, not these. Read these four to your partner; their page turns them into your word.</div>` });
  game.openPuzzle({
    id: 'library_lock',
    title: 'The Mark-Lock',
    render(body, api) {
      body.innerHTML = `
        <div class="puzzle-hero" style="background-image:url(art/pz-diary.webp)"></div>
        <p class="puzzle-desc">Read the lock's marks to your partner; their diary page turns them
        into a four-letter word. Set it here.</p>
        <p style="text-align:center;font-size:34px;letter-spacing:12px;color:#f2ecdb;margin:4px 0 10px;">${code.join(' ')}</p>
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
          api.solved({ message: 'The tumblers glow and sink, and the whole bookcase bay swings back on a hidden hinge, breathing cold hall-air.' });
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
