// SCENE 2 — The Silt Field (sonar overlay).
// The airlock is buried in the debris grid. The Tender's sonar shows which cell;
// the Diver digs it. The Diver's depth-sounder shows the gain the Tender must set.
//   Diver airlock cell = C4  (shown on the Tender's sonar)
//   Tender sonar gain  = 0-8-8 (shown on the Diver's sounder)
// Tender recovers depth-mark S (8 fathoms).

import { getRole, isDiver, isTender } from '../role.js';
import { defs, backdrop, ambient, roleTag, relayPlaque, markBeckon, lockPanel, comboLock, loreSpot } from '../divekit.js';

const SLUG = 'silt';
const MYCODE = { p1: 'C4', p2: '088' };   // p1 = Diver cell, p2 = Tender gain
const other = () => (getRole() === 'p1' ? 'p2' : 'p1');
const hasMark = (state) => state.journal.some(e => e.id === 'mark_s');

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
      ${relayPlaque(relay, label)}
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
    const forWhat = isDiver() ? 'sonar gain' : 'airlock cell';

    spots.push({
      id: 'relay', x: 556, y: 138, w: 488, h: 184, label: `The ${forWhat} (for your partner)`,
      onInteract(game) {
        const html = `<div class="chartcard"><div class="chart-title">${forWhat}</div>
          <p>Reading off your instrument, meant for the other:</p>
          <p style="font-size:30px;letter-spacing:8px;color:#eafffb;text-align:center;">${relay.split('').join(' ')}</p></div>
          <div class="relay">This is <strong>your partner's</strong> figure. Read it across the line.</div>`;
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
      { text: isDiver() ? 'You cannot tell the mounds apart from down there. Your partner\'s sonar names the exact cell — column then row. Ask.' : 'Your gain figure isn\'t on your set; it\'s on your diver\'s sounder. Ask them for it, and read them the airlock cell in return.', cost: 60 },
      { text: isDiver() ? 'Set the dig marker to the column letter and row number your tender reads off the sonar.' : 'Set the three gain figures your diver reads off the sounder; tell them the airlock cell (column, row).', cost: 120 },
      { text: isDiver() ? 'The airlock is at cell C-4.' : 'Your sonar gain is 0-8-8.', cost: 240 },
    ];
  },
};

function openLock(game) {
  const role = getRole();
  if (role === 'p1') {
    comboLock(game, {
      id: 'silt_lock', title: 'The Dig Marker',
      desc: 'Set the column letter and row number of the airlock. You cannot see which mound it is — but your tender\'s sonar can. Ask them for the cell.',
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
