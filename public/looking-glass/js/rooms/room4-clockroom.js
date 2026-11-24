// SCENE 4 — The Clock Room (reversed number; the mirror runs it backwards).
// Your clock shows your PARTNER's code, reversed. You read it; they reverse it.
//   Waking clock shows 4608 -> Glass reverses -> 8064  (Glass enters)
//   Glass clock shows 1725  -> Waking reverses -> 5271  (Waking enters)
// Glass (P2) finds mirror-shard L (4).

import { getRole, isWaking, sideName, otherSideName } from '../role.js';
import { defs, backdrop, sideTag, sconce, tint } from '../glasskit.js';
import { panel } from '../../../shared/js/scenekit.js';

const SLUG = 'clock';
const SHOWN = { p1: '4608', p2: '1725' };     // this clock's reading = partner's answer, reversed
const MY_ANSWER = { p1: '5271', p2: '8064' };  // this side's own code

// The longcase clock is in the plate (right of centre): its dial, its glass
// pendulum door, the bob low in the case. The side tag moves left, off the dial.
const DIAL = { cx: 912, cy: 138 };
const FACE = { x: 850, y: 78, w: 124, h: 150 };
const CASE = { x: 882, y: 269, w: 113, h: 400 };
const SETPLATE = { x: 886, y: 300, w: 104, h: 80 };
const SET_SPOT = { x: 882, y: 269, w: 113, h: 250 };
const SHARD = { x: 905, y: 545, w: 95, h: 100 };

function done(state) { return !!state.flags.clockroom_done; }

export default {
  id: 'clockroom',
  lintStates: [{ label: 'solved', flags: { clockroom_done: true } }],
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
      ${sconce(SLUG, 750, 300)}

      <!-- the tall clock on the plate: a lit aperture across its dial shows the number -->
      <g data-mount="inset">
        <ellipse data-fx="light" cx="${DIAL.cx}" cy="${DIAL.cy + 20}" rx="56" ry="30" fill="${isWaking() ? 'rgba(255,207,138,0.16)' : 'rgba(201,204,214,0.14)'}" class="glow"/>
        <rect x="${DIAL.cx - 52}" y="${DIAL.cy + 4}" width="104" height="36" rx="5" fill="#0c0906" stroke="${t.accentDim}" stroke-width="2"/>
        <text x="${DIAL.cx}" y="${DIAL.cy + 31}" text-anchor="middle" font-size="26" fill="${t.accent}" font-family="Consolas, monospace" letter-spacing="3">${shown}</text>
      </g>

      ${fin ? `
      <!-- the case door swung out -->
      <g data-mount="wall">
        <rect x="${CASE.x}" y="${CASE.y}" width="${CASE.w}" height="${CASE.h}" fill="#040306"/>
        <rect data-fx="light" x="${CASE.x + 8}" y="${CASE.y + 8}" width="${CASE.w - 16}" height="${CASE.h - 16}" fill="${isWaking() ? 'rgba(255,207,138,0.07)' : 'rgba(159,168,189,0.09)'}"/>
        <path d="M${CASE.x + CASE.w} ${CASE.y} L${CASE.x + CASE.w + 44} ${CASE.y - 14} L${CASE.x + CASE.w + 44} ${CASE.y + CASE.h + 16} L${CASE.x + CASE.w} ${CASE.y + CASE.h} Z" fill="url(#sk_darkwood)" stroke="#0b0703" stroke-width="3"/>
      </g>` : panel({ ...SETPLATE, material: 'brass', mount: 'bolts', rx: 4, body: `
        <text x="${SETPLATE.x + SETPLATE.w / 2}" y="${SETPLATE.y + 24}" text-anchor="middle" font-size="12" fill="#2a1d05" font-family="Consolas, monospace">SET THE HOUR</text>
        <text x="${SETPLATE.x + SETPLATE.w / 2}" y="${SETPLATE.y + 60}" text-anchor="middle" font-size="22" fill="#2a1d05" font-family="Consolas, monospace" letter-spacing="3">${state.flags.clockroom_set || '____'}</text>` })}

      ${markHere ? `
      <g class="beckon">
        <polygon points="952,622 958,572 978,564 990,590 984,624" fill="rgba(201,204,214,0.14)" stroke="#c9ccd6" stroke-width="2.5"/>
        <text x="972" y="604" text-anchor="middle" font-size="16" fill="#dfe6f2" font-family="Consolas, monospace" font-weight="bold">4</text>
      </g>` : ''}

      ${sideTag(560)}
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const role = getRole();

    spots.push({
      id: 'face', ...FACE, label: 'The glowing clock face',
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
        id: 'shard_l', ...SHARD, label: 'A mirror-shard',
        onInteract(game) {
          game.journal.add('shard_l', { title: 'Clock Room — behind the pendulum', category: 'sun', sun: { rays: 4, letter: 'L' } });
          game.say('Caught behind a dead pendulum: a mirror-shard, numbered 4, letter L. Kept.');
          game.refreshScene();
        },
      });
    }

    if (!done(state)) {
      spots.push({
        id: 'set', ...SET_SPOT, label: 'Set the hour',
        onInteract(game) { openClock(game); },
      });
    } else {
      spots.push({
        id: 'out', ...SET_SPOT, label: 'The clock-case passage',
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
