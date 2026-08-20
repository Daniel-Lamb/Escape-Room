// SCENE 7 — The Ascent (finale · meta-puzzle).
// Pool all six depth-marks and sort by fathom depth, shallowest first:
//   5 A · 8 S · 11 C · 14 E · 17 N · 20 D  ->  ASCEND
// Each player holds only three; read them across the line. Both set the ascent
// word on the decompression wheel and break the surface together.

import { getRole, isDiver } from '../role.js';
import { defs, backdrop, ambient, roleTag, comboLock } from '../divekit.js';

const SLUG = 'ascent';
const MY_MARKS = {
  p1: [[5, 'A'], [11, 'C'], [17, 'N']],   // the Diver's three
  p2: [[8, 'S'], [14, 'E'], [20, 'D']],   // the Tender's three
};

export default {
  id: 'ascent',
  get title() { return isDiver() ? 'The Ascent' : 'Bring Them Up'; },
  get intro() {
    return isDiver()
      ? 'The shaft opens upward toward a far grey glow — the surface, and air. The decompression valve will only hold open for the ascent word: six letters, one per depth-mark, shallowest first. You hold three. Your tender holds the rest.'
      : 'You can see the diver\'s bubbles now, small and far below. The haul-up valve wants the ascent word before it will run: six letters from the six depth-marks, shallowest fathom first. Three are yours; three are theirs. Spell it together.';
  },

  scene(state) {
    const done = !!state.flags.ascent_open;
    const mine = MY_MARKS[getRole()];
    const marksRow = mine.map((m, i) => `<g>
      <rect x="${628 + i * 120}" y="432" width="96" height="118" rx="8" fill="rgba(201,162,39,0.10)" stroke="#c9a227" stroke-width="2.5"/>
      <text x="${676 + i * 120}" y="480" text-anchor="middle" font-size="24" fill="#e8c85a" font-family="Consolas, monospace" font-weight="bold">${m[0]}</text>
      <text x="${676 + i * 120}" y="496" text-anchor="middle" font-size="9" fill="#9fb0a8" font-family="Consolas, monospace">FM</text>
      <text x="${676 + i * 120}" y="534" text-anchor="middle" font-size="24" fill="#dfe9ec" font-family="Georgia, serif">${m[1]}</text>
    </g>`).join('');
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}</defs>
      ${backdrop(SLUG)}
      ${roleTag()}
      <!-- the rule plaque -->
      <g>
        <rect x="524" y="132" width="552" height="150" rx="10" fill="rgba(5,18,24,0.9)" stroke="#7cf0be" stroke-width="3"/>
        <text x="800" y="176" text-anchor="middle" font-size="19" fill="#eafffb" font-family="Consolas, monospace" letter-spacing="2">SIX MARKS · THE ASCENT WORD</text>
        <text x="800" y="214" text-anchor="middle" font-size="15" fill="#9fc7dd" font-family="Consolas, monospace">one letter per depth-mark — the shallowest fathom speaks first</text>
        <text x="800" y="250" text-anchor="middle" font-size="13" fill="#7f8a99" font-family="Consolas, monospace">you hold three; your partner holds three</text>
      </g>
      <!-- your three marks -->
      <text x="800" y="416" text-anchor="middle" font-size="14" fill="#8fa3b8" font-family="Consolas, monospace">YOUR DEPTH-MARKS · read them to your partner</text>
      ${marksRow}
      <!-- the decompression wheel -->
      <g>
        <rect x="600" y="628" width="400" height="200" rx="14" fill="${done ? 'rgba(4,12,16,0.55)' : 'rgba(9,26,32,0.9)'}" stroke="#2b3547" stroke-width="5"/>
        ${done
          ? `<text x="800" y="736" text-anchor="middle" font-size="22" fill="#7cf0be" font-family="Consolas, monospace" class="flicker">ASCENT VALVE — OPEN</text>`
          : `<text x="800" y="692" text-anchor="middle" font-size="15" fill="#8fa3b8" font-family="Consolas, monospace">DECOMPRESSION WHEEL · SIX LETTERS</text>
             ${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${648 + i * 52}" y="716" width="40" height="52" rx="6" fill="#101a26" stroke="#7cf0be" stroke-width="3"/>`).join('')}`}
      </g>
      ${ambient(SLUG)}
      <path d="M0 900 L0 862 Q800 905 1600 862 L1600 900 Z" fill="#02080c"/>
    </svg>`;
  },

  hotspots(state) {
    const done = !!state.flags.ascent_open;
    const mine = MY_MARKS[getRole()];
    const spots = [];

    spots.push({
      id: 'marks', x: 620, y: 428, w: 360, h: 126, label: 'Your depth-marks',
      onInteract(game) {
        const list = mine.map(m => `${m[0]} fm — ${m[1]}`).join('<br>');
        game.dialog({
          title: 'Your Depth-Marks',
          html: `<div class="chartcard"><div class="chart-title">the three you carry</div>
            <p style="font-size:20px;line-height:1.9;color:#eafffb;text-align:center;">${list}</p></div>
            <div class="relay">Read these to your partner and get their three. Order all six by fathom, shallowest first, and read the letters down.</div>`,
        });
      },
    });

    if (!done) {
      spots.push({ id: 'wheel', x: 600, y: 628, w: 400, h: 200, label: 'The decompression wheel', onInteract(game) { openWheel(game); } });
    } else {
      spots.push({
        id: 'surface', x: 600, y: 628, w: 400, h: 200, label: 'Break the surface',
        onInteract(game) {
          game.say(isDiver() ? 'You rise through the last of the dark toward the light and the air.' : 'The line comes up sweet and sure. You lean over the rail.');
          game.completeRoom({ delay: 800 });
        },
      });
    }
    return spots;
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: 'The wheel wants a six-letter word: one letter per depth-mark, ordered by fathom, shallowest first. You have three marks; your partner has three. Trade.', cost: 60 },
      { text: 'Lay all six marks in fathom order: 5, 8, 11, 14, 17, 20 — then read their letters straight down.', cost: 120 },
      { text: '5-A, 8-S, 11-C, 14-E, 17-N, 20-D → the word is ASCEND.', cost: 240 },
    ];
  },
};

function openWheel(game) {
  comboLock(game, {
    id: 'ascent_wheel',
    title: 'The Decompression Wheel',
    desc: 'Six letters — one per depth-mark, shallowest fathom first. Read your marks to your partner and theirs to you.',
    slots: [{ type: 'letter' }, { type: 'letter' }, { type: 'letter' }, { type: 'letter' }, { type: 'letter' }, { type: 'letter' }],
    target: 'ASCEND', goLabel: 'Open the Valve',
    solvedMsg: 'The word holds the valve open. Ballast blows in a roar of silver — you are going up.',
    failMsg: 'The valve stays shut. Re-check the order — shallowest fathom first — with your partner.',
    onSolve(g) { g.setFlag('ascent_open'); g.refreshScene(); },
  });
}
