// SCENE 3 — The Flooded Corridor (optics · mirror-beam cross-read).
// The Diver aims the dive-lamp through three tilting mirrors onto a photocell to
// unlatch the inner door; the mirror angles are on the Tender's optical schematic.
// The Tender swings the boat's signal lamp to a bearing painted in the corridor.
//   Diver mirror set = 3-7-4  (shown on the Tender's schematic)
//   Tender lamp bearing = 1-9-5 (shown on the Diver's corridor rose)
// Diver recovers depth-mark C (11 fathoms).

import { getRole, isDiver } from '../role.js';
import { defs, backdrop, ambient, roleTag, relayPlaque, markBeckon, lockPanel, comboLock, loreSpot, ART } from '../divekit.js';

const SLUG = 'lamp';
const MYCODE = { p1: '374', p2: '195' };   // p1 = Diver mirrors, p2 = Tender bearing
const other = () => (getRole() === 'p1' ? 'p2' : 'p1');
const hasMark = (state) => state.journal.some(e => e.id === 'mark_c');

export default {
  id: 'lamp',
  get title() { return isDiver() ? 'The Mirrors' : 'The Signal Lamp'; },
  get intro() {
    return isDiver()
      ? 'A black corridor, three cracked mirrors on swivels, and a dead photocell that latches the inner door. Your lamp is the only light — bounce it off the mirrors to wake the cell. The three angles are not written here; your tender has the optical plan.'
      : 'Your diver needs the boat\'s signal lamp swung to a set bearing to feed light down the shaft — the bearing is painted on the corridor wall where only they can read it. And their mirror angles are here on your optical schematic, waiting to be read down.';
  },

  scene(state) {
    const open = !!state.flags.lamp_open;
    const relay = MYCODE[other()];
    const label = isDiver() ? 'SIGNAL-LAMP BEARING · topside' : 'MIRROR ANGLES · below';
    const lockLabel = isDiver() ? 'MIRROR ANGLES' : 'LAMP BEARING';
    const closed = `<text x="800" y="700" text-anchor="middle" font-size="15" fill="#8fa3b8" font-family="Consolas, monospace">${isDiver() ? 'THREE MIRROR SWIVELS' : 'BEARING · THREE FIGURES'}</text>
      ${[0, 1, 2].map(i => `<circle cx="${720 + i * 80}" cy="748" r="28" fill="#101a26" stroke="${isDiver() ? '#ffcf6a' : '#7cf0be'}" stroke-width="3"/>`).join('')}`;
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}</defs>
      ${backdrop(SLUG)}
      ${roleTag()}
      ${relayPlaque(relay, label)}
      ${lockPanel(620, 636, open, lockLabel, closed)}
      ${isDiver() && !hasMark(state) ? markBeckon(1108, 636, 11, 'C') : ''}
      ${isDiver() ? `<ellipse cx="192" cy="706" rx="160" ry="130" fill="url(#${SLUG}_lamp)"/><image href="${ART}lamp.webp" x="88" y="612" width="208" height="188" preserveAspectRatio="xMidYMid meet"/>` : ''}
      ${ambient(SLUG)}
      <path d="M0 900 L0 862 Q800 905 1600 862 L1600 900 Z" fill="#02080c"/>
    </svg>`;
  },

  hotspots(state) {
    const open = !!state.flags.lamp_open;
    const spots = [];
    const relay = MYCODE[other()];
    const forWhat = isDiver() ? 'signal-lamp bearing' : 'mirror angles';

    spots.push({
      id: 'relay', x: 556, y: 138, w: 488, h: 184, label: `The ${forWhat} (for your partner)`,
      onInteract(game) {
        const html = `<div class="chartcard"><div class="chart-title">${forWhat}</div>
          <p>${isDiver() ? 'Painted on the corridor wall, for the boat above:' : 'Marked on your optical plan, for the diver below:'}</p>
          <p style="font-size:30px;letter-spacing:8px;color:#eafffb;text-align:center;">${relay.split('').join(' · ')}</p></div>
          <div class="relay">This is <strong>your partner's</strong> setting. Read it across the line.</div>`;
        game.journal.add('lamp_relay', { title: forWhat, category: 'note', html });
        game.dialog({ title: forWhat, html });
      },
    });

    if (isDiver()) {
      spots.push(loreSpot({ id: 'lore_watch', x: 240, y: 410, w: 250, h: 190, label: 'A passenger cabin', title: 'The Stopped Watch',
        html: `<div class="logbook"><div class="log-title">a cabin, mirror still whole</div><p>On the shelf, a gentleman's pocket-watch, stopped at <strong>3:14</strong> — the hour she struck. Someone wound it that morning, not knowing it would be the last turn of the key.</p></div>` }));
    }

    if (isDiver() && !hasMark(state)) {
      spots.push({
        id: 'mark_c', x: 1108, y: 636, w: 92, h: 120, label: 'A depth-mark on the bulkhead',
        onInteract(game) {
          game.journal.add('mark_c', { title: 'Corridor bulkhead — depth-mark', category: 'sun', sun: { rays: 11, letter: 'C' } });
          game.say('Screwed to the bulkhead beside the cell: a brass mark, "11 fm", letter C. Take it.');
          game.refreshScene();
        },
      });
    }

    if (!open) {
      spots.push({
        id: 'lock', x: 620, y: 636, w: 360, h: 196, label: isDiver() ? 'The mirror swivels' : 'The lamp bearing wheel',
        onInteract(game) { openLock(game); },
      });
    } else {
      spots.push({
        id: 'through', x: 620, y: 636, w: 360, h: 196, label: isDiver() ? 'Through the latched door' : 'Lamp holding',
        onInteract(game) {
          if (isDiver() && !state.journal.some(e => e.id === 'mark_c')) { game.say('Take the depth-mark by the cell before you go on.'); return; }
          game.say(isDiver() ? 'The beam walks across the three mirrors and the photocell glows awake; the inner door unlatches.' : 'You hold the lamp on the bearing and the shaft below fills with light. Your diver is through.');
          game.completeRoom({ delay: 600 });
        },
      });
    }
    return spots;
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: 'The setting that opens your side is on your partner\'s screen; yours is on theirs. Trade them.', cost: 60 },
      { text: isDiver() ? 'Set the three mirror swivels to the angles on your tender\'s optical plan; read them the corridor bearing in return.' : 'Swing the lamp to the bearing your diver reads off the wall; read them the three mirror angles from your plan.', cost: 120 },
      { text: isDiver() ? 'Your mirrors are 3 - 7 - 4.' : 'Your lamp bearing is 1 - 9 - 5.', cost: 240 },
    ];
  },
};

function openLock(game) {
  const role = getRole();
  comboLock(game, {
    id: 'lamp_lock',
    title: role === 'p1' ? 'The Mirror Swivels' : 'The Signal Lamp',
    desc: role === 'p1'
      ? 'Three swivels, 0–9. The angles are on your tender\'s optical plan, not here. Ask them.'
      : 'Swing the lamp: three figures of bearing. The bearing is painted where only your diver can read it. Ask them.',
    slots: [{ type: 'digit' }, { type: 'digit' }, { type: 'digit' }],
    target: MYCODE[role], goLabel: role === 'p1' ? 'Bounce the Beam' : 'Swing the Lamp',
    solvedMsg: role === 'p1' ? 'The beam threads all three mirrors and the cell wakes with a green blink.' : 'The lamp locks onto the bearing; light pours down the shaft.',
    failMsg: 'The light falls short. That is not it — check with your partner.',
    onSolve(g) { g.setFlag('lamp_open'); g.refreshScene(); },
  });
}
