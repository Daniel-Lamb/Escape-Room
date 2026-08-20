// SCENE 5 — The Wireless Room (signal · morse-flash decode).
// You see your own indicator flashing counts, but only your PARTNER'S codebook
// can turn them into a word. Symmetric, like Signal Gallery:
//   Diver flashes 3-2-1-4 -> Tender's Page A {1D,2I,3T,4E} -> TIDE (Diver enters)
//   Tender flashes 4-1-2-3 -> Diver's Page B {1I,2V,3E,4D} -> DIVE (Tender enters)
// Diver recovers depth-mark N (17 fathoms).

import { getRole, isDiver } from '../role.js';
import { defs, backdrop, ambient, roleTag, markBeckon, lockPanel, comboLock, loreSpot } from '../divekit.js';

const SLUG = 'wireless';
const FLASH = { p1: [3, 2, 1, 4], p2: [4, 1, 2, 3] };            // this role's own visible flashes
const PAGE = { p1: { 1: 'I', 2: 'V', 3: 'E', 4: 'D' },          // Diver holds Page B (decodes Tender's flashes -> DIVE)
               p2: { 1: 'D', 2: 'I', 3: 'T', 4: 'E' } };         // Tender holds Page A (decodes Diver's flashes -> TIDE)
const MYCODE = { p1: 'TIDE', p2: 'DIVE' };
const hasMark = (state) => state.journal.some(e => e.id === 'mark_n');

function codebookPanel(role) {
  const p = PAGE[role];
  const cells = [1, 2, 3, 4].map((n, i) => `<text x="${640 + i * 130}" y="256" text-anchor="middle" font-size="26" fill="#eafffb" font-family="Consolas, monospace">${n}→${p[n]}</text>`).join('');
  return `<g>
    <rect x="556" y="138" width="488" height="184" rx="10" fill="rgba(5,18,24,0.86)" stroke="#7cf0be" stroke-width="3"/>
    <text x="800" y="182" text-anchor="middle" font-size="16" fill="#9fc7dd" font-family="Consolas, monospace" letter-spacing="2">CODEBOOK · for your partner's flashes</text>
    ${cells}
    <text x="800" y="298" text-anchor="middle" font-size="13" fill="#7f8a99" font-family="Consolas, monospace">decode their counts, read them the word</text>
  </g>`;
}

function indicator(role) {
  const f = FLASH[role];
  const groups = f.map((c, gi) => {
    const cx = 640 + gi * 130;
    let pips = '';
    for (let k = 0; k < c; k++) pips += `<circle cx="${cx}" cy="${470 + k * 15}" r="5" fill="#ffcf6a" class="flicker"/>`;
    return `<g>${pips}<text x="${cx}" y="558" text-anchor="middle" font-size="12" fill="#8fa3b8" font-family="Consolas, monospace">${c}</text></g>`;
  }).join('');
  return `<g>
    <rect x="556" y="424" width="488" height="150" rx="8" fill="rgba(9,26,32,0.85)" stroke="#3a4656" stroke-width="3"/>
    <text x="800" y="452" text-anchor="middle" font-size="14" fill="#9fc7dd" font-family="Consolas, monospace">YOUR INDICATOR · read the counts to your partner</text>
    ${groups}
  </g>`;
}

export default {
  id: 'wireless',
  get title() { return isDiver() ? 'The Wireless Key' : 'The Radio'; },
  get intro() {
    return isDiver()
      ? 'The flooded wireless room still has power in one dead-man\'s circuit: an indicator flashing a pattern you can count but cannot read. Your tender holds the codebook. Read your counts up; decode theirs down.'
      : 'The set crackles with a pattern flashing on the panel — counts you can see but not read. Your diver holds the other codebook page. Read your counts down; decode theirs up.';
  },

  scene(state) {
    const open = !!state.flags.wireless_open;
    const role = getRole();
    const closed = `<text x="800" y="700" text-anchor="middle" font-size="15" fill="#8fa3b8" font-family="Consolas, monospace">${isDiver() ? 'KEY WORD · FOUR LETTERS' : 'CALL WORD · FOUR LETTERS'}</text>
      ${[0, 1, 2, 3].map(i => `<rect x="${680 + i * 60}" y="722" width="46" height="52" rx="6" fill="#101a26" stroke="#7cf0be" stroke-width="3"/>`).join('')}`;
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}</defs>
      ${backdrop(SLUG)}
      ${roleTag()}
      ${codebookPanel(role)}
      ${indicator(role)}
      ${lockPanel(620, 636, open, isDiver() ? 'KEY WORD' : 'CALL WORD', closed)}
      ${isDiver() && !hasMark(state) ? markBeckon(1108, 636, 17, 'N') : ''}
      ${ambient(SLUG)}
      <path d="M0 900 L0 862 Q800 905 1600 862 L1600 900 Z" fill="#02080c"/>
    </svg>`;
  },

  hotspots(state) {
    const open = !!state.flags.wireless_open;
    const role = getRole();
    const spots = [];

    spots.push({
      id: 'codebook', x: 556, y: 138, w: 488, h: 184, label: 'The codebook page (for your partner)',
      onInteract(game) {
        const p = PAGE[role];
        const rows = [1, 2, 3, 4].map(n => `${n} &rarr; ${p[n]}`).join(' &nbsp; ');
        const html = `<div class="chartcard"><div class="chart-title">codebook page</div>
          <p>Use this on the counts your PARTNER reads you, then read them the word:</p>
          <p style="font-size:22px;letter-spacing:4px;color:#eafffb;text-align:center;">${rows}</p></div>
          <div class="relay">Decode <strong>their</strong> flashes with this — your own word comes from their page.</div>`;
        game.journal.add('wireless_codebook', { title: 'Codebook page', category: 'note', html });
        game.dialog({ title: 'The Codebook', html });
      },
    });

    spots.push({
      id: 'flashes', x: 556, y: 424, w: 488, h: 150, label: 'Your flashing indicator',
      onInteract(game) {
        game.say(`Your indicator flashes ${FLASH[role].join(' - ')}. You cannot read it — read those counts to your partner and let their codebook turn them into your word.`);
      },
    });

    if (isDiver()) {
      spots.push(loreSpot({ id: 'lore_lastmsg', x: 240, y: 410, w: 250, h: 190, label: 'The outgoing message pad', title: 'The Last Message',
        html: `<div class="logbook"><div class="log-title">the wireless-man's hand, unfinished</div><p>The last message she ever sent still sits in the pad:</p><p style="text-align:center;font-size:17px;color:#eafffb;">"REQUEST BEARING —<br>WHICH LIGHT IS TRUE?"</p><p>And beneath it, in a fainter stroke, never sent: <em>no reply.</em></p><p style="opacity:0.85">Two lighthouses argued over her in the dark. By the time they agreed, the Cormorant was on the reef.</p></div>` }));
    }

    if (isDiver() && !hasMark(state)) {
      spots.push({
        id: 'mark_n', x: 1108, y: 636, w: 92, h: 120, label: 'A depth-mark on the set',
        onInteract(game) {
          game.journal.add('mark_n', { title: 'Wireless set — depth-mark', category: 'sun', sun: { rays: 17, letter: 'N' } });
          game.say('A brass mark screwed to the radio\'s case: "17 fm", letter N. Take it.');
          game.refreshScene();
        },
      });
    }

    if (!open) {
      spots.push({ id: 'lock', x: 620, y: 636, w: 360, h: 196, label: isDiver() ? 'The key word' : 'The call word', onInteract(game) { openLock(game); } });
    } else {
      spots.push({
        id: 'through', x: 620, y: 636, w: 360, h: 196, label: isDiver() ? 'Circuit open' : 'Contact made',
        onInteract(game) {
          if (isDiver() && !state.journal.some(e => e.id === 'mark_n')) { game.say('Take the depth-mark off the set first.'); return; }
          game.say(isDiver() ? 'The dead-man\'s circuit trips green; the aft door falls open.' : 'The set answers with a clean carrier; the two of you are through.');
          game.completeRoom({ delay: 600 });
        },
      });
    }
    return spots;
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: 'You can count your own flashes but not read them. Only your partner\'s codebook turns your counts into a word. Read yours up/down; decode theirs with your page.', cost: 60 },
      { text: 'Read your four flash-counts to your partner; they decode with their page and read you the four-letter word. Enter it.', cost: 120 },
      { text: isDiver() ? 'Your word is TIDE.' : 'Your word is DIVE.', cost: 240 },
    ];
  },
};

function openLock(game) {
  const role = getRole();
  comboLock(game, {
    id: 'wireless_lock',
    title: role === 'p1' ? 'The Key Word' : 'The Call Word',
    desc: 'Four letters. Read your flash-counts to your partner; their codebook turns them into this word.',
    slots: [{ type: 'letter' }, { type: 'letter' }, { type: 'letter' }, { type: 'letter' }],
    target: MYCODE[role], goLabel: 'Key It In',
    solvedMsg: role === 'p1' ? 'The word takes; the circuit closes with a spark in the black water.' : 'The word takes; the carrier locks and holds.',
    failMsg: 'Static. That is not the word — re-check the counts with your partner.',
    onSolve(g) { g.setFlag('wireless_open'); g.refreshScene(); },
  });
}
