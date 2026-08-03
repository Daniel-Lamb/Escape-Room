// SCENE 6 — The Beam Engine Room (valve pattern).
// Each engine's five-valve pattern is drawn on the OTHER tower's schematic.
//   West pattern: O C O O C   East pattern: C O O C O
// East (P2) finds bearing-mark R (depth 5).

import { getRole, isWest, towerName, otherTowerName } from '../role.js';
import { defs, backdrop, rain, towerTag } from '../scenekit.js';

const SLUG = 'beam';
// this tower's own correct valve pattern (true = OPEN)
const MY_PATTERN = { p1: [true, false, true, true, false], p2: [false, true, true, false, true] };
// the schematic shown on THIS screen is the OTHER tower's pattern (to relay)
function schematicFor(role) { return role === 'p1' ? MY_PATTERN.p2 : MY_PATTERN.p1; }
const fmt = (arr) => arr.map(o => o ? 'OPEN' : 'SHUT').join(' · ');

function running(state) { return !!state.flags.beamengine_running; }

export default {
  id: 'beamengine',
  get title() { return `${towerName()} · The Beam Engine`; },
  get intro() {
    return 'Below the lamp, the clockwork that swings the beam has stalled — its paraffin-pressure valves all shut. The correct pattern of open and shut valves for this engine is drawn on the other tower\'s schematic, and theirs on yours.';
  },

  scene(state) {
    const on = running(state);
    const markHere = getRole() === 'p2' && !state.journal.some(e => e.id === 'mark_r');
    const sch = schematicFor(getRole());
    const v = [0, 1, 2, 3, 4].map(i => state.flags[`beamengine_v${i}`] ? true : false);

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}
        <style>@keyframes ${SLUG}_spin{to{transform:rotate(360deg)}} .${SLUG}_gov{transform-origin:390px 300px;animation:${SLUG}_spin 3.2s linear infinite;}</style>
      </defs>
      ${backdrop(SLUG)}

      <!-- the governor / weight-drive -->
      <g>
        <circle cx="390" cy="300" r="20" fill="#2b3547" stroke="#c9a227" stroke-width="4"/>
        <g class="${on ? SLUG + '_gov' : ''}">
          <line x1="390" y1="300" x2="300" y2="220" stroke="#8a7f6a" stroke-width="6"/>
          <line x1="390" y1="300" x2="480" y2="220" stroke="#8a7f6a" stroke-width="6"/>
          <circle cx="300" cy="220" r="18" fill="#3a4656"/>
          <circle cx="480" cy="220" r="18" fill="#3a4656"/>
        </g>
        <text x="390" y="380" text-anchor="middle" font-size="13" fill="#7f8a99" font-family="Consolas, monospace">GOVERNOR</text>
      </g>

      <!-- pressure gauge -->
      <g>
        <circle cx="700" cy="280" r="56" fill="#0e2032" stroke="#9fc7dd" stroke-width="5"/>
        <line x1="700" y1="280" x2="${on ? 742 : 668}" y2="${on ? 250 : 262}" stroke="#e8c85a" stroke-width="4"/>
        <text x="700" y="360" text-anchor="middle" font-size="12" fill="#7f8a99" font-family="Consolas, monospace">PRESSURE</text>
      </g>

      <!-- five valves (levers) -->
      <g>
        ${v.map((open, i) => {
          const x = 640 + i * 130;
          return `<g>
            <rect x="${x - 22}" y="560" width="44" height="140" rx="10" fill="#1c2431" stroke="#3a4656" stroke-width="3"/>
            <circle cx="${x}" cy="${open ? 590 : 670}" r="20" fill="${open ? '#8fe0a0' : '#5b6b7d'}" stroke="#141c26" stroke-width="3"/>
            <text x="${x}" y="740" text-anchor="middle" font-size="13" fill="#9fc7dd" font-family="Consolas, monospace">${i + 1}</text>
            <text x="${x}" y="540" text-anchor="middle" font-size="12" fill="${open ? '#8fe0a0' : '#7f8a99'}" font-family="Consolas, monospace">${open ? 'OPEN' : 'SHUT'}</text>
          </g>`;
        }).join('')}
      </g>

      <!-- the schematic (OTHER tower's valve pattern) -->
      <g>
        <rect x="1120" y="150" width="400" height="150" rx="8" fill="#141c26" stroke="#c9a227" stroke-width="4"/>
        <text x="1320" y="192" text-anchor="middle" font-size="15" fill="#9fc7dd" font-family="Consolas, monospace" letter-spacing="2">${otherTowerName().toUpperCase()} SCHEMATIC</text>
        <text x="1320" y="244" text-anchor="middle" font-size="19" fill="#e8c85a" font-family="Consolas, monospace">${fmt(sch)}</text>
        <text x="1320" y="278" text-anchor="middle" font-size="12" fill="#7f8a99" font-family="Consolas, monospace">valves 1–5 · read to your partner</text>
      </g>

      ${on ? `<text x="800" y="820" text-anchor="middle" font-size="18" fill="#8fe0a0" font-family="Consolas, monospace">the beam swings — the light lives</text>` : ''}

      ${markHere ? `
      <g class="beckon">
        <circle cx="1050" cy="620" r="22" fill="rgba(201,162,39,0.08)" stroke="#c9a227" stroke-width="3"/>
        <text x="1050" y="628" text-anchor="middle" font-size="20" fill="#e8c85a" font-family="Consolas, monospace" font-weight="bold">5</text>
      </g>` : ''}

      ${towerTag()}
      ${rain(SLUG)}
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const on = running(state);

    spots.push({
      id: 'schematic', x: 1120, y: 150, w: 400, h: 150, label: `${otherTowerName()} schematic`,
      onInteract(game) {
        const sch = schematicFor(getRole());
        const html = `<div class="chartcard"><div class="chart-title">${otherTowerName()} valve schematic</div>
          <p style="font-size:18px;color:#fff6df;text-align:center;letter-spacing:2px;">${fmt(sch)}</p>
          <p style="text-align:center;color:#7f8a99;">valves 1 → 5</p></div>
          <div class="relay">This is your <strong>partner's</strong> engine pattern. Read them the five valves in order; ask them to read you yours.</div>`;
        game.journal.add('note_schematic', { title: `${otherTowerName()} valve schematic`, category: 'note', html });
        game.dialog({ title: 'The Schematic', html });
      },
    });

    spots.push({
      id: 'governor', x: 280, y: 200, w: 220, h: 200, label: 'The governor',
      onInteract(game) { game.say(on ? 'The weights fly out and the beam sweeps steady and true.' : 'The governor hangs dead. Open the right valves and pressure will spin it.'); },
    });

    if (getRole() === 'p2' && !state.journal.some(e => e.id === 'mark_r')) {
      spots.push({
        id: 'mark_r', x: 1010, y: 580, w: 90, h: 100, label: 'A brass bearing-mark',
        onInteract(game) {
          game.journal.add('mark_r', { title: 'East Tower — the governor housing', category: 'sun', sun: { rays: 5, letter: 'R' } });
          game.say('Screwed to the governor housing: a brass mark, bearing 5, letter R. Logged.');
          game.refreshScene();
        },
      });
    }

    if (!on) {
      spots.push({
        id: 'valves', x: 600, y: 520, w: 620, h: 240, label: 'The five valves',
        onInteract(game) { openValves(game); },
      });
    } else {
      spots.push({
        id: 'up', x: 600, y: 520, w: 620, h: 240, label: 'The stair up to the crown',
        onInteract(game) {
          if (getRole() === 'p2' && !game.journal.has('mark_r')) { game.say('There is a bearing-mark on the governor housing — take it before you climb.'); return; }
          game.completeRoom({ delay: 600 });
        },
      });
    }

    return spots;
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: 'The valve pattern for your engine is not on your schematic — yours holds your partner\'s. So theirs holds yours. Trade patterns.', cost: 60 },
      { text: 'Five valves, each OPEN or SHUT. Read the five on your schematic to your partner, in order; set the five they read you.', cost: 120 },
      { text: isWest() ? 'West valves: OPEN, SHUT, OPEN, OPEN, SHUT.' : 'East valves: SHUT, OPEN, OPEN, SHUT, OPEN.', cost: 240 },
    ];
  },
};

function openValves(game) {
  const role = getRole();
  const target = MY_PATTERN[role];
  const v = [0, 1, 2, 3, 4].map(i => game.getFlag(`beamengine_v${i}`) ? true : false);

  game.openPuzzle({
    id: 'beamengine_valves',
    title: 'Set the Pressure Valves',
    render(body, api) {
      body.innerHTML = `
        <p class="puzzle-desc">Open or shut each of the five valves to match your engine's pattern —
        which is drawn on your partner's schematic. Click a valve to flip it.</p>
        <div class="puzzle-row" id="be-valves"></div>
        <div class="puzzle-row"><button class="btn btn-primary" id="be-run">Engage the Drive</button></div>
        <div class="puzzle-feedback"></div>`;
      const row = body.querySelector('#be-valves');
      const render = () => {
        row.innerHTML = '';
        v.forEach((open, i) => {
          const lever = document.createElement('div');
          lever.className = 'lever' + (open ? '' : ' down');
          lever.innerHTML = `
            <div class="lever-track"><div class="lever-knob"></div></div>
            <div class="lever-label">${i + 1}: ${open ? 'OPEN' : 'SHUT'}</div>`;
          lever.addEventListener('click', () => {
            v[i] = !v[i];
            game.setFlag(`beamengine_v${i}`, v[i]);
            game.playSfx('click');
            render();
          });
          row.appendChild(lever);
        });
      };
      render();
      body.querySelector('#be-run').addEventListener('click', () => {
        if (v.every((o, i) => o === target[i])) {
          game.setFlag('beamengine_running');
          game.playSfx('unlock');
          api.solved({ message: 'Pressure surges, the governor spins up, and the great beam begins to sweep. Your light is alive.' });
          game.refreshScene();
        } else {
          api.fail('The drive coughs and stalls — one or more valves are wrong. Recheck with your partner.');
        }
      });
    },
  });
}
