// SCENE 5 — The Bell Loft (split rule + values).
// Each fog-bell's toll-count needs THIS tower's gauge numbers and the OTHER
// tower's rule. West: gauges 9,4 + rule "difference" -> 5. East: gauges 5,3 +
// rule "sum" -> 8. Each screen shows its own gauges and the OTHER tower's rule.
// West (P1) finds bearing-mark E (depth 6).

import { getRole, isWest, towerName, otherTowerName } from '../role.js';
import { defs, backdrop, rain, towerTag } from '../scenekit.js';

const SLUG = 'bell';
const MY_GAUGES = { p1: [9, 4], p2: [5, 3] };          // this tower's own two gauge numbers
const PLATE_RULE = { p1: 'the SUM', p2: 'the DIFFERENCE' }; // the OTHER tower's rule (shown here, relayed to partner)
const MY_ANSWER = { p1: 5, p2: 8 };                     // West = 9-4 (difference); East = 5+3 (sum)

function rung(state) { return !!state.flags.bellloft_rung; }

export default {
  id: 'bellloft',
  get title() { return `${towerName()} · The Bell Loft`; },
  get intro() {
    return 'The fog is closing and the Meridian needs the bell to know which side to pass. Your bell\'s toll-count comes from your own two gauges — but the RULE for what to do with them is posted in the other tower, and the rule for their bell is posted here.';
  },

  scene(state) {
    const done = rung(state);
    const markHere = isWest() && !state.journal.some(e => e.id === 'mark_e');
    const g = MY_GAUGES[getRole()];
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}</defs>
      ${backdrop(SLUG)}

      <!-- the great fog bell -->
      <g>
        <line x1="600" y1="150" x2="1000" y2="150" stroke="#2b3547" stroke-width="14"/>
        <path d="M700 170 q100 -30 200 0 l30 260 q-130 40 -260 0 z" fill="#7a5f18" stroke="#c9a227" stroke-width="5"/>
        <ellipse cx="800" cy="440" rx="140" ry="28" fill="#5b4a14"/>
        <line x1="800" y1="180" x2="800" y2="450" stroke="#3a2d0f" stroke-width="6"/>
        <circle cx="800" cy="460" r="18" fill="#3a2d0f"/>
        ${done ? `<g class="glow"><ellipse cx="800" cy="320" rx="230" ry="200" fill="rgba(255,230,166,0.10)"/></g>` : ''}
      </g>

      <!-- this tower's two gauges -->
      <g>
        <text x="290" y="520" text-anchor="middle" font-size="15" fill="#9fc7dd" font-family="Consolas, monospace">FATHOMS</text>
        <circle cx="290" cy="600" r="60" fill="#0e2032" stroke="#9fc7dd" stroke-width="5"/>
        <text x="290" y="614" text-anchor="middle" font-size="42" fill="#fff6df" font-family="Consolas, monospace">${g[0]}</text>
        <text x="470" y="520" text-anchor="middle" font-size="15" fill="#9fc7dd" font-family="Consolas, monospace">CHANNEL</text>
        <circle cx="470" cy="600" r="60" fill="#0e2032" stroke="#9fc7dd" stroke-width="5"/>
        <text x="470" y="614" text-anchor="middle" font-size="42" fill="#fff6df" font-family="Consolas, monospace">${g[1]}</text>
      </g>

      <!-- the rules plate: holds the OTHER tower's rule -->
      <g>
        <rect x="1080" y="520" width="420" height="150" rx="8" fill="#141c26" stroke="#c9a227" stroke-width="4"/>
        <text x="1290" y="562" text-anchor="middle" font-size="16" fill="#9fc7dd" font-family="Consolas, monospace" letter-spacing="2">${otherTowerName().toUpperCase()} BELL — RULE</text>
        <text x="1290" y="612" text-anchor="middle" font-size="26" fill="#e8c85a" font-family="Consolas, monospace">toll ${PLATE_RULE[getRole()]}</text>
        <text x="1290" y="648" text-anchor="middle" font-size="13" fill="#7f8a99" font-family="Consolas, monospace">of their two gauges — read to your partner</text>
      </g>

      <!-- the bell pull (toll indicator) -->
      <g>
        <rect x="720" y="700" width="160" height="120" rx="10" fill="${done ? '#12303f' : '#2b3547'}" stroke="#c9a227" stroke-width="5"/>
        <text x="800" y="748" text-anchor="middle" font-size="14" fill="#9fc7dd" font-family="Consolas, monospace">TOLLS SET</text>
        <text x="800" y="792" text-anchor="middle" font-size="34" fill="#e8c85a" font-family="Consolas, monospace">${done ? MY_ANSWER[getRole()] : (state.flags.bellloft_count ?? 0)}</text>
      </g>

      ${markHere ? `
      <g class="beckon">
        <circle cx="1050" cy="760" r="22" fill="rgba(201,162,39,0.08)" stroke="#c9a227" stroke-width="3"/>
        <text x="1050" y="768" text-anchor="middle" font-size="20" fill="#e8c85a" font-family="Consolas, monospace" font-weight="bold">6</text>
      </g>` : ''}

      ${towerTag()}
      ${rain(SLUG)}
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const done = rung(state);
    const g = MY_GAUGES[getRole()];

    spots.push({
      id: 'gauges', x: 220, y: 480, w: 330, h: 200, label: 'Your two gauges',
      onInteract(game) {
        const html = `<div class="chartcard"><div class="chart-title">${towerName()} gauges</div>
          <p>Fathoms: <b>${g[0]}</b> &nbsp; Channel: <b>${g[1]}</b></p></div>
          <div class="relay">These are YOUR numbers. The rule for what to do with them is on your partner's plate — ask them.</div>`;
        game.journal.add('note_gauges', { title: `${towerName()} gauges`, category: 'note', html });
        game.dialog({ title: 'The Gauges', html });
      },
    });

    spots.push({
      id: 'rule', x: 1080, y: 520, w: 420, h: 150, label: `${otherTowerName()} bell rule`,
      onInteract(game) {
        const html = `<div class="chartcard"><div class="chart-title">${otherTowerName()} bell — rule</div>
          <p>"Toll <b>${PLATE_RULE[getRole()]}</b> of the two gauges."</p></div>
          <div class="relay">This is your <strong>partner's</strong> rule, not yours. Read it to them — then ask them for yours.</div>`;
        game.journal.add('note_rule', { title: `${otherTowerName()} bell rule`, category: 'note', html });
        game.dialog({ title: 'The Bell Rule', html });
      },
    });

    if (isWest() && !state.journal.some(e => e.id === 'mark_e')) {
      spots.push({
        id: 'mark_e', x: 1010, y: 720, w: 90, h: 100, label: 'A brass bearing-mark',
        onInteract(game) {
          game.journal.add('mark_e', { title: 'West Tower — the bell yoke', category: 'sun', sun: { rays: 6, letter: 'E' } });
          game.say('Cast into the bell yoke: a brass mark, bearing 6, letter E. The inscription beside it: "Cast for two hands — one bell was never enough." Logged.');
          game.refreshScene();
        },
      });
    }

    if (!done) {
      spots.push({
        id: 'bell', x: 660, y: 170, w: 280, h: 300, label: 'The fog bell — set the tolls',
        onInteract(game) { openBell(game); },
      });
      spots.push({
        id: 'pull', x: 720, y: 700, w: 160, h: 120, label: 'The bell pull',
        onInteract(game) { openBell(game); },
      });
    } else {
      spots.push({
        id: 'up', x: 660, y: 170, w: 280, h: 300, label: 'The stair up',
        onInteract(game) {
          if (isWest() && !game.journal.has('mark_e')) { game.say('The bearing-mark is cast into the bell yoke — take it first.'); return; }
          game.completeRoom({ delay: 600 });
        },
      });
    }

    return spots;
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: 'Your gauges give two numbers; your rule is not here — it is on your partner\'s plate. Their rule is on yours. Trade a rule for a rule.', cost: 60 },
      { text: 'Read your partner the rule on your plate (it is theirs). Ask them the rule on their plate (it is yours), then apply it to YOUR two gauge numbers.', cost: 120 },
      { text: isWest() ? 'West rule is "difference": 9 − 4 = toll 5.' : 'East rule is "sum": 5 + 3 = toll 8.', cost: 240 },
    ];
  },
};

function openBell(game) {
  const answer = MY_ANSWER[getRole()];
  let count = game.getFlag('bellloft_count') ?? 0;
  game.openPuzzle({
    id: 'bellloft_bell',
    title: 'Set the Fog-Bell',
    render(body, api) {
      body.innerHTML = `
        <div class="puzzle-hero" style="background-image:url(art/pz-bell.webp)"></div>
        <p class="puzzle-desc">Set how many times the bell should toll, then sound it. The count
        comes from your two gauges and the rule your partner reads you.</p>
        <div class="puzzle-row">
          <div class="dial">
            <button class="dial-btn" data-d="1">&#9650;</button>
            <div class="dial-face" id="bl-face">${count}</div>
            <button class="dial-btn" data-d="-1">&#9660;</button>
            <div class="lever-label">tolls</div>
          </div>
        </div>
        <div class="puzzle-row"><button class="btn btn-primary" id="bl-ring">Toll the Bell</button></div>
        <div class="puzzle-feedback"></div>`;
      const face = body.querySelector('#bl-face');
      body.querySelectorAll('.dial-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          count = Math.max(0, Math.min(12, count + Number(btn.dataset.d)));
          face.textContent = String(count);
          face.classList.remove('tick'); void face.offsetWidth; face.classList.add('tick');
          game.playSfx('click');
          game.setFlag('bellloft_count', count);
        });
      });
      body.querySelector('#bl-ring').addEventListener('click', () => {
        if (count === answer) {
          game.setFlag('bellloft_rung');
          for (let i = 0; i < Math.min(count, 6); i++) game.playBell(300 + i * 40);
          api.solved({ message: 'The bell tolls out across the fog, deep and even, and an answering note drifts back from the far tower. The Meridian has her bearing.' });
          game.refreshScene();
        } else {
          api.fail('That count rings hollow — recheck your gauges against your partner\'s rule.');
        }
      });
    },
  });
}
