// SCENE 4 — The Boiler Room (pressure · split-rule cross-read).
// You can read your OWN two gauges, but the RULE that turns them into a setting is
// on your partner's screen.
//   Diver ballast  = his gauges 12 & 5, rule SUM  -> 17   (rule shown on Tender's screen)
//   Tender pump    = her gauges 9 & 4, rule GAP  -> 05   (rule shown on Diver's screen)
// Tender recovers depth-mark E (14 fathoms).

import { getRole, isDiver, isTender } from '../role.js';
import { defs, backdrop, ambient, roleTag, relayPlaque, markBeckon, lockPanel, comboLock } from '../divekit.js';

const SLUG = 'boiler';
const GAUGES = { p1: [12, 5], p2: [9, 4] };
const RULE = { p1: 'SUM', p2: 'GAP' };       // this role's own rule (held on partner's screen)
const MYCODE = { p1: '17', p2: '05' };
const other = () => (getRole() === 'p1' ? 'p2' : 'p1');
const hasMark = (state) => state.journal.some(e => e.id === 'mark_e');

export default {
  id: 'boiler',
  get title() { return isDiver() ? 'The Boiler Room · The Ballast' : 'The Halcyon · The Compressor'; },
  get intro() {
    return isDiver()
      ? 'The flooded boiler room. To lift the next bulkhead you must set the ballast to a figure worked from your two pressure gauges — but the RULE for working it (add them? their difference?) is stamped on your tender\'s panel, not yours.'
      : 'The deck compressor feeds your diver\'s air, and it needs a setting worked from your two dial gauges — but which working, sum or difference, is stamped on your diver\'s side, not here. Trade rules and readings.';
  },

  scene(state) {
    const open = !!state.flags.boiler_open;
    const relay = RULE[other()];                 // the partner's rule, for you to read to them
    const g = GAUGES[getRole()];
    const label = isDiver() ? 'BALLAST RULE · topside' : 'PUMP RULE · below';
    const lockLabel = isDiver() ? 'BALLAST' : 'COMPRESSOR';
    const closed = `<text x="800" y="700" text-anchor="middle" font-size="15" fill="#8fa3b8" font-family="Consolas, monospace">${lockLabel} · TWO FIGURES</text>
      ${[0, 1].map(i => `<circle cx="${760 + i * 80}" cy="748" r="28" fill="#101a26" stroke="#ffcf6a" stroke-width="3"/>`).join('')}`;
    // this role's own two gauges (visible)
    const gauges = `<g>
      ${[0, 1].map(i => `<g>
        <circle cx="${1180 + i * 130}" cy="360" r="46" fill="#0c1a22" stroke="#3a4656" stroke-width="4"/>
        <text x="${1180 + i * 130}" y="372" text-anchor="middle" font-size="34" fill="#eafffb" font-family="Consolas, monospace">${g[i]}</text>
      </g>`).join('')}
      <text x="1245" y="440" text-anchor="middle" font-size="13" fill="#8fa3b8" font-family="Consolas, monospace">YOUR GAUGES</text>
    </g>`;
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}</defs>
      ${backdrop(SLUG)}
      ${roleTag()}
      ${relayPlaque(relay, label)}
      ${gauges}
      ${lockPanel(620, 636, open, lockLabel, closed)}
      ${isTender() && !hasMark(state) ? markBeckon(1108, 636, 14, 'E') : ''}
      ${ambient(SLUG)}
      <path d="M0 900 L0 862 Q800 905 1600 862 L1600 900 Z" fill="#02080c"/>
    </svg>`;
  },

  hotspots(state) {
    const open = !!state.flags.boiler_open;
    const spots = [];
    const relay = RULE[other()];
    const g = GAUGES[getRole()];
    const forWhat = isDiver() ? 'ballast rule' : 'pump rule';

    spots.push({
      id: 'relay', x: 556, y: 138, w: 488, h: 184, label: `The ${forWhat} (for your partner)`,
      onInteract(game) {
        const meaning = relay === 'SUM' ? 'add your two gauges together' : 'the difference between your two gauges (larger minus smaller)';
        const html = `<div class="chartcard"><div class="chart-title">${forWhat}</div>
          <p>Stamped on your side, for the other to use:</p>
          <p style="font-size:30px;letter-spacing:8px;color:#eafffb;text-align:center;">${relay}</p>
          <p style="opacity:0.8">${relay} = ${meaning}.</p></div>
          <div class="relay">This is <strong>your partner's</strong> rule. Read it across the line.</div>`;
        game.journal.add('boiler_relay', { title: forWhat, category: 'note', html });
        game.dialog({ title: forWhat, html });
      },
    });

    spots.push({
      id: 'gauges', x: 1130, y: 314, w: 250, h: 140, label: 'Your two pressure gauges',
      onInteract(game) {
        game.say(`Your two gauges read ${g[0]} and ${g[1]}. The rule for combining them is on your partner's screen — read them these numbers and let them tell you the setting.`);
      },
    });

    if (isTender() && !hasMark(state)) {
      spots.push({
        id: 'mark_e', x: 1108, y: 636, w: 92, h: 120, label: 'A depth-mark on the compressor',
        onInteract(game) {
          game.journal.add('mark_e', { title: 'Compressor housing — depth-mark', category: 'sun', sun: { rays: 14, letter: 'E' } });
          game.say('A brass mark bolted to the compressor: "14 fm", letter E. Pocket it.');
          game.refreshScene();
        },
      });
    }

    if (!open) {
      spots.push({ id: 'lock', x: 620, y: 636, w: 360, h: 196, label: isDiver() ? 'The ballast dial' : 'The compressor dial', onInteract(game) { openLock(game); } });
    } else {
      spots.push({
        id: 'through', x: 620, y: 636, w: 360, h: 196, label: isDiver() ? 'Bulkhead rising' : 'Air steady',
        onInteract(game) {
          if (isTender() && !state.journal.some(e => e.id === 'mark_e')) { game.say('Take the depth-mark off the compressor first.'); return; }
          game.say(isDiver() ? 'The ballast blows down and the bulkhead lifts on a groan of old steel.' : 'The compressor settles into a steady beat; your diver\'s bubbles run clean.');
          game.completeRoom({ delay: 600 });
        },
      });
    }
    return spots;
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: 'You can see your own two gauges, but not the rule for them. Your partner\'s screen has your rule; yours has theirs. Trade.', cost: 60 },
      { text: isDiver() ? 'Read your two gauges (12 and 5) to your tender; their panel says whether to add them or take the difference. Set that.' : 'Read your two gauges (9 and 4) to your diver; their side says add or difference. Set that.', cost: 120 },
      { text: isDiver() ? 'Your rule is SUM: 12 + 5 = set 17.' : 'Your rule is GAP: 9 − 4 = set 05.', cost: 240 },
    ];
  },
};

function openLock(game) {
  const role = getRole();
  comboLock(game, {
    id: 'boiler_lock',
    title: role === 'p1' ? 'The Ballast Dial' : 'The Compressor Dial',
    desc: 'Two figures. Read your own gauges to your partner; their screen holds the rule (add, or difference) that turns them into this setting.',
    slots: [{ type: 'digit' }, { type: 'digit' }],
    target: MYCODE[role], goLabel: 'Set It',
    solvedMsg: role === 'p1' ? 'The ballast answers and the pressure comes right.' : 'The compressor answers and the air-line steadies.',
    failMsg: 'Wrong pressure. Re-check the rule with your partner.',
    onSolve(g) { g.setFlag('boiler_open'); g.refreshScene(); },
  });
}
