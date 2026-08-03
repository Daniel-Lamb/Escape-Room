// SCENE 5 — The Clock Hall / The Automata (split rule + values arithmetic).
// Your numbers are on your screen; the rule for them is on your partner's plate.
//   Hand's gauges 9 & 4; Eye's plate says DIFFERENCE  -> Hand sets 5
//   Eye's readouts 6 & 2; Hand's plate says SUM        -> Eye sets 8
// The Hand (P1) lifts vault-pin f (position 6, digit 6).

import { getRole, isHand, roleName, otherRoleName } from '../role.js';
import { defs, backdrop, ambient, roleTag } from '../heistkit.js';

const SLUG = 'clk';
const MY_NUMBERS = { p1: [9, 4], p2: [6, 2] };       // this side's own two dials
const MY_ANSWER = { p1: 5, p2: 8 };                  // own numbers under the partner's rule
const RELAY_RULE = { p1: 'SUM', p2: 'DIFFERENCE' };  // the plate I hold = the rule for the PARTNER's numbers

function isSolved(state) { return !!state.flags.clockhall_solved; }

export default {
  id: 'clockhall',
  get title() { return `${roleName()} · The Clock Hall`; },
  get intro() {
    return isHand()
      ? 'The clock hall, where the Nightingale\'s twin automaton drives a great pendulum lock. Two gauges give you two numbers — but not what to do with them. The rule is engraved on a plate your partner is holding. Read them yours; do what they read you.'
      : 'On the console, the pendulum lock shows as a damper you have to set. Two readouts give you two numbers; the rule that turns them into the setting is on a plate only The Hand can see. Trade: your numbers for their rule, their numbers for your rule.';
  },

  scene(state) {
    const done = isSolved(state);
    const pinHere = isHand() && !state.journal.some(e => e.id === 'pin_f');
    const nums = MY_NUMBERS[getRole()];
    const relayRule = RELAY_RULE[getRole()];
    const val = state.flags.clockhall_val ?? 0;

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}
        <style>@keyframes ${SLUG}_sw{0%,100%{transform:rotate(-9deg)}50%{transform:rotate(9deg)}} .${SLUG}_pend{transform-origin:800px 210px;animation:${SLUG}_sw 2.6s ease-in-out infinite;}</style>
      </defs>
      ${backdrop(SLUG)}

      <!-- the pendulum (Hand) / a stylised damper gauge (Eye) -->
      <g class="${done ? '' : SLUG + '_pend'}">
        <line x1="800" y1="210" x2="800" y2="470" stroke="#5c6b52" stroke-width="6"/>
        <circle cx="800" cy="500" r="34" fill="${isHand() ? '#2b3d48' : '#0b1a13'}" stroke="${isHand() ? '#c9a227' : '#7cffb2'}" stroke-width="4"/>
      </g>
      <circle cx="800" cy="210" r="10" fill="#8a7f6a"/>

      <!-- your two numbers -->
      <g font-family="Consolas, monospace" text-anchor="middle">
        ${nums.map((n, i) => `
          <circle cx="${540 + i * 130}" cy="600" r="48" fill="#0b141c" stroke="#57d6e6" stroke-width="3"/>
          <text x="${540 + i * 130}" y="612" font-size="34" fill="#eafff2">${n}</text>
          <text x="${540 + i * 130}" y="672" font-size="12" fill="#7f8a99">${isHand() ? 'GAUGE' : 'READOUT'} ${i + 1}</text>`).join('')}
      </g>

      <!-- the plate you hold: the rule for your PARTNER's numbers -->
      <g>
        <rect x="1100" y="170" width="420" height="140" rx="8" fill="#0b141c" stroke="${isHand() ? '#c9a227' : '#7cffb2'}" stroke-width="4"/>
        <text x="1310" y="212" text-anchor="middle" font-size="14" fill="${isHand() ? '#8aa0b4' : '#4f9c78'}" font-family="Consolas, monospace" letter-spacing="2">ENGRAVED PLATE</text>
        <text x="1310" y="262" text-anchor="middle" font-size="30" fill="#e8e2d4" font-family="Georgia, serif" letter-spacing="3">set the ${relayRule}</text>
        <text x="1310" y="294" text-anchor="middle" font-size="12" fill="#7f8a99" font-family="Consolas, monospace">this rule is for your partner's numbers · read it to them</text>
      </g>

      <!-- the setting dial -->
      <g font-family="Consolas, monospace" text-anchor="middle">
        <rect x="720" y="700" width="160" height="90" rx="10" fill="#0b141c" stroke="#c9a227" stroke-width="3"/>
        <text x="800" y="730" font-size="12" fill="#7f8a99">${isHand() ? 'PENDULUM COUNT' : 'DAMPER VALUE'}</text>
        <text x="800" y="772" font-size="34" fill="#e8c85a">${val}</text>
      </g>

      ${done ? `<text x="800" y="840" text-anchor="middle" font-size="18" fill="#8fe0a0" font-family="Consolas, monospace">${isHand() ? 'the pendulum stills — the lock gives' : 'the damper holds — the lock reads open'}</text>` : ''}

      ${pinHere ? `
      <g class="beckon">
        <rect x="1050" y="590" width="40" height="60" rx="6" fill="rgba(87,214,230,0.08)" stroke="#57d6e6" stroke-width="3"/>
        <text x="1070" y="628" text-anchor="middle" font-size="20" fill="#7cffb2" font-family="Consolas, monospace" font-weight="bold">6</text>
      </g>` : ''}

      ${roleTag()}
      ${ambient(SLUG)}
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const done = isSolved(state);

    spots.push({
      id: 'nums', x: 480, y: 550, w: 320, h: 150, label: isHand() ? 'Your two gauges' : 'Your two readouts',
      onInteract(game) {
        const nums = MY_NUMBERS[getRole()];
        const html = `<div class="console-card"><div class="console-title">${isHand() ? 'Gauges' : 'Readouts'}</div>
          <p style="text-align:center;font-size:30px;color:#eafff2;letter-spacing:8px;">${nums.join(' &nbsp; ')}</p></div>
          <div class="relay">These are your numbers — but not what to do with them. Ask your partner what their plate says to do; the plate you hold is for <strong>their</strong> numbers.</div>`;
        game.journal.add('note_nums5', { title: isHand() ? 'Clock-hall gauges' : 'Damper readouts', category: 'note', html });
        game.dialog({ title: 'Your Numbers', html });
      },
    });

    spots.push({
      id: 'plate', x: 1100, y: 170, w: 420, h: 140, label: 'The engraved plate',
      onInteract(game) {
        const rule = RELAY_RULE[getRole()];
        const html = `<div class="dossier"><div class="dossier-title">Engraved plate</div>
          <p style="text-align:center;font-size:22px;">"Set the <strong>${rule}</strong>."</p></div>
          <div class="relay">This rule is for your <strong>partner's</strong> two numbers, not yours. Read it to them; ask them what their plate says for yours.</div>`;
        game.journal.add('note_plate5', { title: `Engraved plate — ${rule}`, category: 'note', html });
        game.dialog({ title: 'The Plate', html });
      },
    });

    spots.push({
      id: 'automaton', x: 720, y: 300, w: 160, h: 200, label: isHand() ? 'The twin automaton' : 'The pendulum feed',
      onInteract(game) {
        const html = `<div class="dossier"><div class="dossier-title">Clockmaker's plate — the twin bird</div>
          <p>"Two hands, one hour. A lock made for a pair, so no one man could ever take it alone."</p></div>
          <div class="relay">The maker built this for two. So is the vault below. Remember it.</div>`;
        game.journal.add('note_maker5', { title: "Clockmaker's plate", category: 'note', html });
        game.dialog({ title: 'The Automaton', html });
      },
    });

    if (isHand() && !state.journal.some(e => e.id === 'pin_f')) {
      spots.push({
        id: 'pin_f', x: 1040, y: 580, w: 70, h: 90, label: 'A pin in the pendulum bob',
        onInteract(game) {
          game.journal.add('pin_f', { title: 'Cast into the pendulum bob', category: 'sun', sun: { rays: 6, letter: '6' } });
          game.say('Cast right into the brass of the pendulum bob: position 6, digit 6 — a vault-pin. That is your third. Your partner holds the other three.');
          game.refreshScene();
        },
      });
    }

    if (!done) {
      spots.push({
        id: 'dial', x: 700, y: 690, w: 200, h: 110, label: isHand() ? 'Set the pendulum count' : 'Set the damper value',
        onInteract(game) { openValue(game); },
      });
    } else {
      spots.push({
        id: 'onward', x: 700, y: 690, w: 200, h: 110, label: 'On, deeper',
        onInteract(game) {
          if (isHand() && !game.journal.has('pin_f')) { game.say('There is a vault-pin cast into the pendulum bob — take it before you go on.'); return; }
          game.completeRoom({ delay: 600 });
        },
      });
    }

    return spots;
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: 'Your gauges give the numbers; your partner\'s plate gives the rule for them. And the plate you hold is the rule for their numbers. Trade.', cost: 60 },
      { text: isHand() ? 'Your plate holds the EYE\'s rule; your gauges hold the HAND\'s numbers — swap with your partner and apply what they read you.' : 'Your plate holds the HAND\'s rule; your readouts hold the EYE\'s numbers — swap and apply theirs.', cost: 120 },
      { text: isHand() ? 'Set 5 (9 − 4).' : 'Set 8 (6 + 2).', cost: 240 },
    ];
  },
};

function openValue(game) {
  const target = MY_ANSWER[getRole()];
  let val = game.getFlag('clockhall_val') ?? 0;

  game.openPuzzle({
    id: 'clockhall_value',
    title: isHand() ? 'The Pendulum Lock' : 'The Damper',
    render(body, api) {
      body.innerHTML = `
        <p class="puzzle-desc">Set the dial (0–12). Your two numbers are on your screen; the rule
        for them is on your partner's plate. Ask them, then set the result.</p>
        <div class="puzzle-row"><div class="dial">
          <button class="dial-btn" data-d="1" aria-label="up">&#9650;</button>
          <div class="dial-face" id="clk-face">${val}</div>
          <button class="dial-btn" data-d="-1" aria-label="down">&#9660;</button>
        </div></div>
        <div class="puzzle-row"><button class="btn btn-primary" id="clk-go">${isHand() ? 'Still the Pendulum' : 'Hold the Damper'}</button></div>
        <div class="puzzle-feedback"></div>`;
      const face = body.querySelector('#clk-face');
      body.querySelectorAll('.dial-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          val = (val + Number(btn.dataset.d) + 13) % 13;
          face.textContent = String(val);
          face.classList.remove('tick'); void face.offsetWidth; face.classList.add('tick');
          game.playSfx('click');
          game.setFlag('clockhall_val', val);
        });
      });
      body.querySelector('#clk-go').addEventListener('click', () => {
        if (val === target) {
          game.setFlag('clockhall_solved');
          game.playBell(523);
          api.solved({ message: isHand()
            ? 'The pendulum slows, and slows, and stops dead on the beat — and somewhere in the wall a lock lets go with a chime.'
            : 'The damper takes and the pendulum reads still on your console; the lock registers open. A clean, single chime.' });
          game.refreshScene();
        } else {
          api.fail('The lock doesn\'t give — that isn\'t the setting. Recheck your numbers against your partner\'s rule.');
        }
      });
    },
  });
}
