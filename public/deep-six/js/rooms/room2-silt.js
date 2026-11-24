// SCENE 2 — The Silt Field (sonar overlay).
// The airlock is buried in the debris grid. SPLIT KNOWLEDGE: the Tender's sonar
// lists four hard/soft, ringing/dull contacts but cannot say which is the
// airlock; the Diver's salvage brief says the airlock rings HARD and HOLLOW but
// the Diver cannot hear the sonar. Only C4 is both.
// The Diver's depth-sounder shows the gain the Tender must set.
//   Diver airlock cell = C4  (deduced: brief on the Diver's slate x contacts on the Tender's sonar)
//   Tender sonar gain  = 0-8-8 (shown on the Diver's sounder)
// Tender recovers depth-mark S (8 fathoms).

import { getRole, isDiver, isTender } from '../role.js';
import { defs, backdrop, ambient, roleTag, markBeckon, lockPanel, comboLock, loreSpot, DOCK } from '../divekit.js';
import { dock } from '../../../shared/js/scenekit.js';

const SLUG = 'silt';
const MYCODE = { p1: 'C4', p2: '088' };   // p1 = Diver cell, p2 = Tender gain
const other = () => (getRole() === 'p1' ? 'p2' : 'p1');
const hasMark = (state) => state.journal.some(e => e.id === 'mark_s');
// The Tender's sonar contacts — only one is hard AND ringing (hollow).
const CONTACTS = [['B2', 'soft', 'dull'], ['C4', 'hard', 'ringing'], ['E3', 'hard', 'dull'], ['F1', 'soft', 'ringing']];
const BRIEF = 'The airlock ring is steel with an air pocket behind it: on sonar it returns HARD and RINGING (hollow).';

export default {
  id: 'silt',
  get title() { return isDiver() ? 'The Buried Airlock' : 'The Sonar'; },
  get intro() {
    return isDiver()
      ? 'Beyond the hatch the deck falls away into a debris field of silt mounds, any one of which could hide the airlock into the hull. From down here they all look the same. Your tender\'s sonar can tell them apart.'
      : 'Your sonar paints the wreck in soft green returns, and one hard echo marks the airlock your diver needs — cell and all. But your set has gone soft; the gain figure to sharpen it is on your diver\'s sounder, not yours.';
  },

  scene(state) {
    const open = !!state.flags.silt_open;
    const relay = MYCODE[other()];
    const label = isDiver() ? 'SONAR GAIN · topside' : 'AIRLOCK CELL · below';
    const lockLabel = isDiver() ? 'AIRLOCK GRID' : 'SONAR GAIN';
    const closed = isDiver()
      ? `<text x="800" y="700" text-anchor="middle" font-size="15" fill="#8fa3b8" font-family="Consolas, monospace">DIG MARKER · COLUMN &amp; ROW</text>
         <rect x="700" y="720" width="70" height="52" rx="6" fill="#101a26" stroke="#c9a227" stroke-width="3"/>
         <rect x="800" y="720" width="70" height="52" rx="6" fill="#101a26" stroke="#c9a227" stroke-width="3"/>`
      : `<text x="800" y="700" text-anchor="middle" font-size="15" fill="#8fa3b8" font-family="Consolas, monospace">GAIN · THREE FIGURES</text>
         ${[0, 1, 2].map(i => `<circle cx="${720 + i * 80}" cy="748" r="28" fill="#101a26" stroke="#7cf0be" stroke-width="3"/>`).join('')}`;
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}</defs>
      ${backdrop(SLUG)}
      ${roleTag()}
      ${isDiver()
        ? dock({ x: 556, y: 138, w: 488, h: 184 }, `
            <text x="800" y="172" text-anchor="middle" font-size="16" fill="#9fc7dd" font-family="Consolas, monospace" letter-spacing="2">${label}</text>
            <text x="800" y="226" text-anchor="middle" font-size="42" fill="#e8c85a" font-family="Consolas, monospace" letter-spacing="8">${relay.split('').join(' ')}</text>
            <line x1="580" y1="246" x2="1020" y2="246" stroke="#2f4a55" stroke-width="2"/>
            <text x="800" y="274" text-anchor="middle" font-size="15" fill="#eafffb" font-family="Consolas, monospace">BRIEF: airlock returns HARD + RINGING</text>
            <text x="800" y="302" text-anchor="middle" font-size="12" fill="#9fb0c4" font-family="Consolas, monospace">gain is for topside · brief is for you</text>`,
            { kind: 'tablet', title: 'DIVE SLATE' })
        : dock({ x: 556, y: 138, w: 488, h: 184 }, `
            <text x="800" y="168" text-anchor="middle" font-size="16" fill="#9fc7dd" font-family="Consolas, monospace" letter-spacing="2">SONAR CONTACTS · below</text>
            ${CONTACTS.map(([c, h, r], i) => `<text x="620" y="${204 + i * 28}" font-size="19" fill="#eafffb" font-family="Consolas, monospace">${c}  ${h.padEnd(5)}  ${r}</text>`).join('')}
            <text x="800" y="316" text-anchor="middle" font-size="12" fill="#9fb0c4" font-family="Consolas, monospace">which is the airlock? your diver knows</text>`,
            { kind: 'radio', title: 'RADIO LOG' })}
      ${lockPanel(620, 636, open, lockLabel, closed)}
      ${isTender() && !hasMark(state) ? markBeckon(1108, 636, 8, 'S') : ''}
      ${ambient(SLUG)}
      <path d="M0 900 L0 862 Q800 905 1600 862 L1600 900 Z" fill="#02080c"/>
    </svg>`;
  },

  hotspots(state) {
    const open = !!state.flags.silt_open;
    const spots = [];
    const relay = MYCODE[other()];
    const forWhat = isDiver() ? 'sonar gain + your brief' : 'sonar contacts';

    spots.push({
      id: 'relay', ...DOCK, label: `The ${forWhat} (for your partner)`,
      onInteract(game) {
        const html = isDiver()
          ? `<div class="chartcard"><div class="chart-title">sonar gain · for topside</div>
              <p style="font-size:30px;letter-spacing:8px;color:#eafffb;text-align:center;">${relay.split('').join(' ')}</p></div>
              <div class="relay">This is <strong>your partner's</strong> figure. Read it up the line.</div>
              <div class="chartcard" style="margin-top:10px"><div class="chart-title">salvage brief · yours</div><p>${BRIEF}</p></div>`
          : `<div class="chartcard"><div class="chart-title">sonar contacts · the debris field</div>
              ${CONTACTS.map(([c, h, r]) => `<p style="font-family:Consolas,monospace;font-size:18px;">${c} — ${h}, ${r}</p>`).join('')}</div>
              <div class="relay">One of these is the airlock. You can hear them all; only <strong>your diver</strong> knows what an airlock sounds like. Read them the list.</div>`;
        game.journal.add('silt_relay', { title: `${forWhat}`, category: 'note', html });
        game.dialog({ title: forWhat, html });
      },
    });

    spots.push(isDiver()
      ? loreSpot({ id: 'lore_effects', x: 240, y: 410, w: 250, h: 190, label: "Something in the silt", title: 'What the Silt Holds',
          html: `<div class="logbook"><div class="log-title">the debris field</div><p>Half-buried where your lamp falls: a child's shoe, a cabin trunk sprung open, a comb still threaded with hair. Forty-two were aboard the Cormorant. The brief only wants the strongbox. It does not mention them.</p></div>` })
      : loreSpot({ id: 'lore_manifest', x: 1214, y: 470, w: 240, h: 150, label: 'The passenger manifest', title: 'The Manifest',
          html: `<div class="chartcard"><div class="chart-title">cormorant · souls aboard</div><p><strong>42</strong> listed — crew and passengers.</p><p style="opacity:0.8">Eleven names are struck through in a different ink, added later, by a hand that already knew.</p></div>` }));

    if (isTender() && !hasMark(state)) {
      spots.push({
        id: 'mark_s', x: 1108, y: 636, w: 92, h: 120, label: 'A depth-mark pinned to the chart',
        onInteract(game) {
          game.journal.add('mark_s', { title: 'Sonar chart — depth-mark', category: 'sun', sun: { rays: 8, letter: 'S' } });
          game.say('A brass depth-mark pinned to the old chart: "8 fm", letter S. Pocket it — the ascent word needs all six.');
          game.refreshScene();
        },
      });
    }

    if (!open) {
      spots.push({
        id: 'lock', x: 620, y: 636, w: 360, h: 196, label: isDiver() ? 'The dig marker' : 'The gain dial',
        onInteract(game) { openLock(game); },
      });
    } else {
      spots.push({
        id: 'through', x: 620, y: 636, w: 360, h: 196, label: isDiver() ? 'Into the airlock' : 'Sonar sharp',
        onInteract(game) {
          if (isTender() && !state.journal.some(e => e.id === 'mark_s')) {
            game.say('Take the depth-mark off the chart first — all six spell the way up.');
            return;
          }
          game.say(isDiver() ? 'You fan away the silt and the airlock ring appears; the hatch cycles you inside.' : 'The return snaps into focus — the airlock, dead centre. Your diver is through.');
          game.completeRoom({ delay: 600 });
        },
      });
    }
    return spots;
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: isDiver() ? 'You cannot tell the mounds apart from down there — but your slate says what the airlock sounds like on sonar, and your tender can hear every mound.' : 'Your gain figure is on your diver\'s sounder. In return, read them every contact on your sonar — they know what the airlock sounds like; you don\'t.', cost: 60 },
      { text: isDiver() ? 'Your brief: the airlock returns HARD and RINGING. Have your tender read the four contacts and pick the one that is both. Set column, then row.' : 'Set the three gain figures your diver reads off the sounder; read them all four contacts — cell, hard/soft, ringing/dull.', cost: 120 },
      { text: isDiver() ? 'C-4 is the only contact that is both hard and ringing. Dig there.' : 'Your sonar gain is 0-8-8.', cost: 240 },
    ];
  },
};

function openLock(game) {
  const role = getRole();
  if (role === 'p1') {
    comboLock(game, {
      id: 'silt_lock', title: 'The Dig Marker',
      desc: 'Set the column letter and row number of the airlock. Your brief says how it sounds; your tender\'s sonar can hear every mound. Put the two together.',
      slots: [{ type: 'letter', label: 'col' }, { type: 'digit', label: 'row' }],
      target: 'C4', goLabel: 'Dig Here',
      solvedMsg: 'The marker bites into the right mound and the airlock ring shrugs off its silt.',
      failMsg: 'Only more silt. That is not the cell — check the sonar with your partner.',
      onSolve(g) { g.setFlag('silt_open'); g.refreshScene(); },
    });
  } else {
    comboLock(game, {
      id: 'silt_lock', title: 'Sonar Gain',
      desc: 'Set the three gain figures to sharpen the return. The figure is on your diver\'s depth-sounder, not your set. Ask them.',
      slots: [{ type: 'digit' }, { type: 'digit' }, { type: 'digit' }],
      target: '088', goLabel: 'Tune',
      solvedMsg: 'The green mush resolves into a hard clean echo — the airlock, exactly where you told them.',
      failMsg: 'Still fuzz. That is not the gain — check the sounder with your partner.',
      onSolve(g) { g.setFlag('silt_open'); g.refreshScene(); },
    });
  }
}
