// SCENE 5 — The Vault (meta · pool the six tumbler-chips).
// Every station sees the same time-locked door. Across the heist the crew
// pocketed six brass tumbler-chips, each stamped with a position (1-6) and a
// digit. The time-lock's engraving says the ODD tumblers fall first, low to high,
// then the EVEN: 1,3,5,2,4,6 -> 4 1 3 7 9 6 (straight 1->6 would be 471936).
// This is the last room, so opening it wins the game for whoever throws it.

import { getRole, roleName } from '../role.js';
import { defs, backdrop, roleTag, comboLock, art } from '../crewkit.js';

const SLUG = 'vault';
const COMBO = '413796';

function isOpen(state) { return !!state.flags.vault_open; }

export default {
  id: 'vault',
  get title() { return `${roleName()} · The Vault`; },
  get intro() {
    return 'This is it — the time-locked door, six numbered dials, and the clock still running. No one crewmate has the whole combination: it is spread across the six brass tumbler-chips you all pocketed. Read your chips to each other, put them in the order the time-lock itself demands, and set the wheel together.';
  },

  scene(state) {
    const open = isOpen(state);
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}</defs>
      ${backdrop(SLUG)}
      ${roleTag()}

      <!-- the vault door (photoreal plate; the wheel and bolt-work are part of the image) -->
      <g>
        <image href="${art('vault-door.webp')}" x="570" y="200" width="460" height="460" preserveAspectRatio="xMidYMid meet"/>
        ${open
          ? `<circle cx="800" cy="430" r="150" fill="#05070d"/>
             <text x="800" y="438" text-anchor="middle" font-size="26" fill="#7cf0be" font-family="Consolas, monospace" class="flicker">OPEN</text>`
          : ''}
      </g>

      <!-- six dials -->
      <g font-family="Consolas, monospace" text-anchor="middle">
        <rect x="500" y="684" width="600" height="160" rx="12" fill="url(#sk_steel)" stroke="#0f1217" stroke-width="3" data-mount="bolts"/>
        <text x="800" y="708" font-size="14" fill="#e8dcc0">"THE ODD TUMBLERS FALL FIRST, LOW TO HIGH — THEN THE EVEN."</text>
        ${[0, 1, 2, 3, 4, 5].map(i => `
          <circle cx="${560 + i * 96}" cy="770" r="34" fill="#0c1a22" stroke="#c9a227" stroke-width="3"/>
          <text x="${560 + i * 96}" y="780" font-size="28" fill="#e8c85a">${state.flags[`vault_d${i}`] ?? 0}</text>
          <text x="${560 + i * 96}" y="824" font-size="12" fill="#cfd8e3">${['I', 'II', 'III', 'IV', 'V', 'VI'][i]}</text>`).join('')}
      </g>
    </svg>`;
  },

  hotspots(state) {
    const open = isOpen(state);
    if (open) return [];
    return [{
      id: 'vault', x: 560, y: 210, w: 480, h: 600, label: 'The vault door — six dials',
      onInteract(game) {
        comboLock(game, {
          id: 'vault_lock',
          title: 'The Master Time-Lock',
          desc: 'Six dials, 0&ndash;9. No one of you has the whole code &mdash; it is stamped across the six brass tumbler-chips. The engraving says how they fall: <em>the odd tumblers first, low to high &mdash; then the even.</em>',
          slots: [
            { type: 'digit', label: 'I' }, { type: 'digit', label: 'II' }, { type: 'digit', label: 'III' },
            { type: 'digit', label: 'IV' }, { type: 'digit', label: 'V' }, { type: 'digit', label: 'VI' },
          ],
          target: COMBO,
          goLabel: 'Throw the Wheel',
          solvedMsg: 'Six tumblers fall as one. The wheel spins free and the door sighs open on a room full of quiet money.',
          failMsg: 'The wheel won\'t turn. Straight one-through-six is not how this lock falls — read the engraving, and pool the chips again.',
          onSolve(g) {
            g.setFlag('vault_open');
            g.refreshScene();
            g.completeRoom({ delay: 900 });
          },
        });
      },
    }];
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: 'The six figures are spread across the brass chips the crew pocketed — each stamped with a tumbler number and a digit. But read the time-lock\'s engraving before you lay them out one through six.', cost: 60 },
      { text: 'The odd tumblers fall first, low to high, then the even: the chips go #1, #3, #5, then #2, #4, #6. Whoever holds each reads its digit.', cost: 120 },
      { text: `The master combination is ${COMBO.split('').join(' - ')}.`, cost: 240 },
    ];
  },
};
