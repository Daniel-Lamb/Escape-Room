// SCENE 5 — The Vault (meta · pool the six tumbler-chips).
// Every station sees the same time-locked door. Across the heist the crew
// pocketed six brass tumbler-chips, each stamped with a position (1-6) and a
// digit. Ordered 1 -> 6 they spell the master combination: 4 7 1 9 3 6.
// This is the last room, so opening it wins the game for whoever throws it.

import { getRole, roleName } from '../role.js';
import { defs, backdrop, roleTag, comboLock } from '../crewkit.js';

const SLUG = 'vault';
const COMBO = '471936';

function isOpen(state) { return !!state.flags.vault_open; }

export default {
  id: 'vault',
  get title() { return `${roleName()} · The Vault`; },
  get intro() {
    return 'This is it — the time-locked door, six numbered dials, and the clock still running. No one crewmate has the whole combination: it is spread across the six brass tumbler-chips you all pocketed. Read your chips to each other, put them in order one through six, and set the wheel together.';
  },

  scene(state) {
    const open = isOpen(state);
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}</defs>
      ${backdrop(SLUG)}
      ${roleTag()}

      <!-- the vault door -->
      <g>
        <circle cx="800" cy="430" r="230" fill="url(#${SLUG}_steel)" stroke="#0a0e14" stroke-width="14"/>
        <circle cx="800" cy="430" r="230" fill="none" stroke="rgba(120,240,190,0.12)" stroke-width="3"/>
        <circle cx="800" cy="430" r="150" fill="#1b2330" stroke="#3a4656" stroke-width="10"/>
        <!-- spoked wheel -->
        <g stroke="#c9a227" stroke-width="10" stroke-linecap="round">
          ${[0, 60, 120, 180, 240, 300].map(a => {
            const r1 = 34, r2 = 132;
            const rad = a * Math.PI / 180;
            return `<line x1="${(800 + Math.cos(rad) * r1).toFixed(0)}" y1="${(430 + Math.sin(rad) * r1).toFixed(0)}" x2="${(800 + Math.cos(rad) * r2).toFixed(0)}" y2="${(430 + Math.sin(rad) * r2).toFixed(0)}"/>`;
          }).join('')}
        </g>
        <circle cx="800" cy="430" r="34" fill="#241c08" stroke="#c9a227" stroke-width="6"/>
        ${open
          ? `<circle cx="800" cy="430" r="150" fill="#05070d"/>
             <text x="800" y="438" text-anchor="middle" font-size="26" fill="#7cf0be" font-family="Consolas, monospace" class="flicker">OPEN</text>`
          : ''}
      </g>

      <!-- six dials -->
      <g font-family="Consolas, monospace" text-anchor="middle">
        <text x="800" y="712" font-size="15" fill="#8fb6c4">MASTER TIME-LOCK &middot; SIX FIGURES, IN ORDER</text>
        ${[0, 1, 2, 3, 4, 5].map(i => `
          <circle cx="${560 + i * 96}" cy="770" r="34" fill="#0c1a22" stroke="#c9a227" stroke-width="3"/>
          <text x="${560 + i * 96}" y="780" font-size="28" fill="#e8c85a">${state.flags[`vault_d${i}`] ?? 0}</text>
          <text x="${560 + i * 96}" y="822" font-size="12" fill="#7f8a99">#${i + 1}</text>`).join('')}
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
          desc: 'Six dials, 0&ndash;9. No one of you has the whole code &mdash; it is stamped across the six brass tumbler-chips. Read your chips aloud, order them one through six, and set the wheel.',
          slots: [
            { type: 'digit', label: '#1' }, { type: 'digit', label: '#2' }, { type: 'digit', label: '#3' },
            { type: 'digit', label: '#4' }, { type: 'digit', label: '#5' }, { type: 'digit', label: '#6' },
          ],
          target: COMBO,
          goLabel: 'Throw the Wheel',
          solvedMsg: 'Six tumblers fall as one. The wheel spins free and the door sighs open on a room full of quiet money.',
          failMsg: 'The wheel won\'t turn. A chip out of order, or a digit misheard — pool them again, one through six.',
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
      { text: 'The six figures are not on any one screen. Each brass chip you pocketed is stamped with its place in the order and one digit. Lay them out one through six.', cost: 60 },
      { text: 'Go around the crew: whoever holds chip #1 reads their digit, then #2, and so on to #6. Set the dials in that order.', cost: 120 },
      { text: `The master combination is ${COMBO.split('').join(' - ')}.`, cost: 240 },
    ];
  },
};
