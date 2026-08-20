// SCENE 1 — The Descent Line (tutorial · cross-read combination).
// Each end's lock code is shown on the OTHER end's screen.
//   Diver's deck hatch = 6-2-9   (shown on the Tender's screen)
//   Tender's winch brake = 4-1-7 (shown on the Diver's screen)
// Diver also recovers depth-mark A (5 fathoms).

import { getRole, isDiver } from '../role.js';
import { defs, backdrop, ambient, roleTag, relayPlaque, markBeckon, lockPanel, comboLock, loreSpot } from '../divekit.js';

const SLUG = 'descent';
const MYCODE = { p1: '629', p2: '417' };   // p1 = Diver hatch, p2 = Tender winch
const other = () => (getRole() === 'p1' ? 'p2' : 'p1');
const hasMark = (state) => state.journal.some(e => e.id === 'mark_a');

export default {
  id: 'descent',
  get title() { return isDiver() ? 'The Deck Hatch' : 'The Winch Brake'; },
  get intro() {
    return isDiver()
      ? 'You touch down on the Cormorant\'s foredeck in a slow cloud of silt. The deck hatch to the wreck is dogged shut by a three-ring valve — and the release code is not stamped anywhere down here. Topside, your tender is reading it off the winch log right now.'
      : 'The Halcyon rolls at anchor over the wreck. The winch that holds your diver\'s line is locked by a three-ring brake, and its code is nowhere on your console — but the deck hatch code your diver needs is right here on the log. Talk to each other.';
  },

  scene(state) {
    const open = !!state.flags.descent_open;
    const relay = MYCODE[other()];       // the partner's code — you read it to them
    const label = isDiver() ? 'WINCH BRAKE · topside' : 'DECK HATCH · below';
    const lockLabel = isDiver() ? 'DECK HATCH' : 'WINCH BRAKE';
    const closed = `
      <text x="800" y="700" text-anchor="middle" font-size="15" fill="#8fa3b8" font-family="Consolas, monospace">${lockLabel} · THREE-RING CODE</text>
      ${[0, 1, 2].map(i => `<circle cx="${720 + i * 80}" cy="745" r="30" fill="#101a26" stroke="#c9a227" stroke-width="3"/>`).join('')}`;
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}</defs>
      ${backdrop(SLUG)}
      ${roleTag()}
      ${relayPlaque(relay, label)}
      ${lockPanel(620, 636, open, lockLabel, closed)}
      ${isDiver() && !hasMark(state) ? markBeckon(1108, 636, 5, 'A') : ''}
      ${ambient(SLUG)}
      <path d="M0 900 L0 862 Q800 905 1600 862 L1600 900 Z" fill="#02080c"/>
    </svg>`;
  },

  hotspots(state) {
    const open = !!state.flags.descent_open;
    const spots = [];
    const relay = MYCODE[other()];
    const label = isDiver() ? 'winch brake' : 'deck hatch';

    spots.push({
      id: 'relay', x: 556, y: 138, w: 488, h: 184, label: `The ${label} code (for your partner)`,
      onInteract(game) {
        const html = `<div class="chartcard"><div class="chart-title">${label} release</div>
          <p>Stamped on your side, meant for the other:</p>
          <p style="font-size:30px;letter-spacing:8px;color:#eafffb;text-align:center;">${relay.split('').join(' · ')}</p></div>
          <div class="relay">This is <strong>your partner's</strong> code, not yours. Read it across the line.</div>`;
        game.journal.add('descent_relay', { title: `${label} code`, category: 'note', html });
        game.dialog({ title: `The ${label} code`, html });
      },
    });

    spots.push(isDiver()
      ? loreSpot({ id: 'lore_hull', x: 240, y: 410, w: 250, h: 190, label: 'The hull nameplate', title: 'The Cormorant',
          html: `<div class="logbook"><div class="log-title">the hull</div><p>The plating under your fins is lettered in flaking white: <strong>S.S. CORMORANT</strong>. You knew the name before you read it — every keeper on this coast does. She went down forty years back, the night the two lights could not agree on a bearing.</p></div>` })
      : loreSpot({ id: 'lore_brief', x: 1214, y: 470, w: 240, h: 150, label: 'The salvage brief', title: 'The Salvage Brief',
          html: `<div class="chartcard"><div class="chart-title">job order</div><p>Recover the strongbox from the wreck designated <strong>CORMORANT</strong> — lost off the Kestrel reefs, forty years gone.</p><p style="opacity:0.8">Nothing in it about the forty-two who went down with her. The old hands on the quay just call it "the night the lights disagreed."</p></div>` }));

    if (isDiver() && !hasMark(state)) {
      spots.push({
        id: 'mark_a', x: 1108, y: 636, w: 92, h: 120, label: 'A brass depth-mark on the line',
        onInteract(game) {
          game.journal.add('mark_a', { title: 'Descent line — depth-mark', category: 'sun', sun: { rays: 5, letter: 'A' } });
          game.say('A brass tag wired to the descent line: stamped "5 fm" and the letter A. One of six — the ascent word at the surface will want them all, in fathom order.');
          game.refreshScene();
        },
      });
    }

    if (!open) {
      spots.push({
        id: 'lock', x: 620, y: 636, w: 360, h: 196, label: isDiver() ? 'Deck-hatch valve' : 'Winch brake',
        onInteract(game) { openLock(game); },
      });
    } else {
      spots.push({
        id: 'through', x: 620, y: 636, w: 360, h: 196, label: isDiver() ? 'Into the wreck' : 'Line paid out',
        onInteract(game) {
          if (isDiver() && !state.journal.some(e => e.id === 'mark_a')) {
            game.say('Take the brass depth-mark off the line before you go below — you will need all six at the top.');
            return;
          }
          game.say(isDiver() ? 'The hatch swings down into the black interior. You follow the line in.' : 'The brake releases; the line runs free and your diver drops into the wreck. You pay it out steadily.');
          game.completeRoom({ delay: 600 });
        },
      });
    }
    return spots;
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: 'Your own code is not on your screen. But your screen holds your PARTNER\'s code — so their screen holds yours. Ask them.', cost: 60 },
      { text: 'Read the three-ring code on your screen to your partner (it is theirs). Then set your rings to the code they read back to you.', cost: 120 },
      { text: isDiver() ? 'Your deck hatch is 6 - 2 - 9.' : 'Your winch brake is 4 - 1 - 7.', cost: 240 },
    ];
  },
};

function openLock(game) {
  const role = getRole();
  comboLock(game, {
    id: 'descent_lock',
    title: role === 'p1' ? 'Deck-Hatch Valve' : 'Winch Brake',
    desc: `Three brass rings, 0–9. This code is <em>not</em> on your screen — it is on your partner's. Ask them for the ${role === 'p1' ? 'DECK HATCH' : 'WINCH BRAKE'} code.`,
    slots: [{ type: 'digit' }, { type: 'digit' }, { type: 'digit' }],
    target: MYCODE[role],
    goLabel: 'Throw It',
    solvedMsg: role === 'p1' ? 'The rings line up and the hatch bolt drops away with a dull clang you feel in your teeth.' : 'The brake lets go; the drum turns sweet and free. Your diver is on the way down.',
    failMsg: 'It holds. That is not this side\'s code — check with your partner.',
    onSolve(g) { g.setFlag('descent_open'); g.refreshScene(); },
  });
}
