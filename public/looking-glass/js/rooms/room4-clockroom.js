// SCENE 4 — The Clock Room (reversed number; the mirror runs it backwards).
// Your clock shows your PARTNER's code, reversed. You read it; they reverse it.
//   Waking clock shows 4608 -> Glass reverses -> 8064  (Glass enters)
//   Glass clock shows 1725  -> Waking reverses -> 5271  (Waking enters)
// Glass (P2) finds mirror-shard L (4).

import { getRole, isWaking, sideName, otherSideName } from '../role.js';
import { defs, backdrop, sideTag, sconce, tint } from '../glasskit.js';

const SLUG = 'clock';
const SHOWN = { p1: '4608', p2: '1725' };     // this clock's reading = partner's answer, reversed
const MY_ANSWER = { p1: '5271', p2: '8064' };  // this side's own code

function done(state) { return !!state.flags.clockroom_done; }

export default {
  id: 'clockroom',
  get title() { return `${sideName()} · The Clock Room`; },
  get intro() {
    return 'A long room full of clocks, all stopped at different wrong hours. One tall clock still glows a number in its face — but this is the mirror\'s house, and the mirror runs numbers backwards. Read yours to your partner; they must turn it about. And so must you, with theirs.';
  },

  scene(state) {
    const t = tint();
    const fin = done(state);
    const markHere = getRole() === 'p2' && !state.journal.some(e => e.id === 'shard_l');
    const shown = SHOWN[getRole()];
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}</defs>
      ${backdrop(SLUG)}
      ${sconce(SLUG, 240, 300)}

      <!-- other stopped clocks (flavor) -->
      <g opacity="0.5">
        ${[[430, 250], [1230, 250], [1360, 470]].map(([x, y]) =>
          `<circle cx="${x}" cy="${y}" r="46" fill="${t.panel}" stroke="${t.accentDim}" stroke-width="4"/>
           <line x1="${x}" y1="${y}" x2="${x + 24}" y2="${y - 10}" stroke="${t.accentDim}" stroke-width="3"/>
           <line x1="${x}" y1="${y}" x2="${x - 6}" y2="${y + 26}" stroke="${t.accentDim}" stroke-width="3"/>`).join('')}
      </g>

      <!-- the tall glowing clock -->
      <g>
        <rect x="700" y="230" width="200" height="560" rx="14" fill="${t.wall1}" stroke="${t.accentDim}" stroke-width="6"/>
        <circle cx="800" cy="330" r="72" fill="${t.panel}" stroke="${t.accentDim}" stroke-width="4"/>
        <text x="800" y="342" text-anchor="middle" font-size="40" fill="${t.accent}" font-family="Consolas, monospace" letter-spacing="4">${shown}</text>
        <rect x="740" y="470" width="120" height="200" rx="6" fill="${fin ? '#0a0810' : t.panel}" stroke="${t.accentDim}" stroke-width="3"/>
        ${fin
          ? `<text x="800" y="580" text-anchor="middle" font-size="16" fill="${t.accent}" font-family="Georgia, serif">it strikes,</text><text x="800" y="602" text-anchor="middle" font-size="16" fill="${t.accent}" font-family="Georgia, serif">and opens</text>`
          : `<text x="800" y="560" text-anchor="middle" font-size="14" fill="#9fa8bd" font-family="Consolas, monospace">SET THE HOUR</text>
             <text x="800" y="596" text-anchor="middle" font-size="26" fill="${t.accent}" font-family="Consolas, monospace" letter-spacing="4">${state.flags.clockroom_set || '____'}</text>`}
      </g>

      ${markHere ? `
      <g class="beckon">
        <polygon points="1030,700 1075,692 1082,736 1060,770 1028,760 1020,724" fill="rgba(201,204,214,0.10)" stroke="#c9ccd6" stroke-width="2.5"/>
        <text x="1050" y="736" text-anchor="middle" font-size="18" fill="#dfe6f2" font-family="Consolas, monospace" font-weight="bold">4</text>
      </g>` : ''}

      ${sideTag()}
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const role = getRole();

    spots.push({
      id: 'face', x: 700, y: 260, w: 200, h: 150, label: 'The glowing clock face',
      onInteract(game) {
        const shown = SHOWN[role];
        const html = `<div class="cipher"><div class="cipher-title">The clock face</div>
          <p style="text-align:center;font-size:40px;letter-spacing:8px;color:#f2ecdb;">${shown}</p></div>
          <div class="relay">The mirror shows this <strong>backwards</strong>. It is your partner's number — read the four digits to them exactly as shown; they will reverse it.</div>`;
        game.journal.add('note_clockface', { title: 'The clock face (backwards)', category: 'note', html });
        game.dialog({ title: 'The Clock Face', html });
      },
    });

    if (role === 'p2' && !state.journal.some(e => e.id === 'shard_l')) {
      spots.push({
        id: 'shard_l', x: 1010, y: 690, w: 90, h: 110, label: 'A mirror-shard',
        onInteract(game) {
          game.journal.add('shard_l', { title: 'Clock Room — behind the pendulum', category: 'sun', sun: { rays: 4, letter: 'L' } });
          game.say('Caught behind a dead pendulum: a mirror-shard, numbered 4, letter L. Kept.');
          game.refreshScene();
        },
      });
    }

    if (!done(state)) {
      spots.push({
        id: 'set', x: 740, y: 470, w: 120, h: 200, label: 'Set the hour',
        onInteract(game) { openClock(game); },
      });
    } else {
      spots.push({
        id: 'out', x: 700, y: 230, w: 200, h: 560, label: 'The clock-case passage',
        onInteract(game) {
          if (role === 'p2' && !game.journal.has('shard_l')) { game.say('A shard sits behind the pendulum — take it before you go.'); return; }
          game.completeRoom({ delay: 600 });
        },
      });
    }

    return spots;
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: 'The number on your clock is your partner\'s, and the mirror shows it reversed. Read yours to them; ask for theirs and reverse it.', cost: 60 },
      { text: 'Your clock face shows four digits, backwards, for your partner. When they read you theirs, write the digits in reverse order.', cost: 120 },
      { text: isWaking() ? 'Your hour is 5271 (the glass clock reads 1725 — reversed).' : 'Your hour is 8064 (the waking clock reads 4608 — reversed).', cost: 240 },
    ];
  },
};

function openClock(game) {
  const answer = MY_ANSWER[getRole()];
  game.openPuzzle({
    id: 'clockroom_set',
    title: 'Set the Hour',
    render(body, api) {
      body.innerHTML = `
        <div class="puzzle-hero" style="background-image:url(art/pz-clock.webp)"></div>
        <p class="puzzle-desc">Your number is on your partner's clock face — but the mirror shows
        it backwards, so reverse what they read you. Set the four digits.</p>
        <div class="puzzle-row">
          <input class="puzzle-input" id="ck-num" maxlength="4" inputmode="numeric" autocomplete="off"
            placeholder="4 digits" style="letter-spacing:10px;text-align:center;width:180px;" />
        </div>
        <div class="puzzle-row"><button class="btn btn-primary" id="ck-try">Strike the Hour</button></div>
        <div class="puzzle-feedback"></div>`;
      const input = body.querySelector('#ck-num');
      const submit = () => {
        const v = (input.value || '').trim();
        game.setFlag('clockroom_set', v.padEnd(4, '_').slice(0, 4));
        if (v === answer) {
          game.setFlag('clockroom_done');
          game.playSfx('unlock');
          api.solved({ message: 'The clock shudders, strikes an impossible hour, and the whole case swings out on its side like a door.' });
          game.refreshScene();
        } else {
          api.fail('The clock will not strike. Re-read your partner\'s face — and remember to reverse it.');
          game.refreshScene();
        }
      };
      body.querySelector('#ck-try').addEventListener('click', submit);
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
    },
  });
}
