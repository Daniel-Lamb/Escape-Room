// SCENE 6 — The Beam Engine Room (split knowledge: line pressures x valve rule).
// The towers share one pressure main, so each tower's repeater reads the OTHER
// engine's five line pressures (in this tower's signal book, to read across).
// Each engine's own plate gives the rule for which lines to open.
//   West rule: open the EVEN readings.     West lines 24 37 18 42 51 -> O C O O C
//   East rule: open readings ABOVE 30 lb.  East lines 22 46 38 15 33 -> C O O C O
// East (P2) finds bearing-mark R (the south plate).

import { getRole, isWest, towerName, otherTowerName } from '../role.js';
import { defs, backdrop, rainOutside, interior, bearingOf, towerTag } from '../scenekit.js';
import { dock, DOCK, panel, shadow } from '../../../shared/js/scenekit.js';

const SLUG = 'beam';
// this tower's own correct valve pattern (true = OPEN)
const MY_PATTERN = { p1: [true, false, true, true, false], p2: [false, true, true, false, true] };
// each engine's five line pressures (lb), as its partner's repeater reads them
const PRESSURES = { p1: [24, 37, 18, 42, 51], p2: [22, 46, 38, 15, 33] };
const RULE = {
  p1: { test: n => n % 2 === 0, text: ['Open every line whose gauge', 'reads an EVEN number of pounds.', 'Shut the odd.'] },
  p2: { test: n => n > 30, text: ['Open every line whose gauge', 'reads ABOVE 30 lb.', 'Shut the rest.'] },
};
// the repeater page in THIS tower's signal book shows the OTHER engine's pressures
function repeaterFor(role) { return role === 'p1' ? PRESSURES.p2 : PRESSURES.p1; }

// The engine room: a porthole onto the storm, the clockwork drive standing on
// the floor with its governor on top, the pressure gauge and this engine's rule
// plate on the wall, the five valves on a manifold pipe on stands, a ladder up.
const FLOOR = 760;
const GOV = { cx: 390, cy: 300 };
const DRIVE = { x: 260, y: 360, w: 260, h: 400 };
const GAUGE = { cx: 640, cy: 330 };
const RULEPLATE = { x: 750, y: 300, w: 360, h: 140 };
const PIPE_Y = 640;
const VALVES = { x: 590, y: 520, w: 630, h: 200 };
const LADDER = { x: 1490, y: 236, w: 84, h: 580 };
const MARK = { x: 345, y: 480, w: 90, h: 90 };

function running(state) { return !!state.flags.beamengine_running; }

export default {
  id: 'beamengine',
  solution: role => MY_PATTERN[role].map(o => (o ? 'OPEN' : 'SHUT')).join(' '),
  get title() { return `${towerName()} · The Beam Engine`; },
  get intro() {
    return 'Below the lamp, the clockwork that swings the beam has stalled — its paraffin-pressure valves all shut. This engine\'s plate says which lines to open, but the towers share one pressure main: your own line pressures read only on the other tower\'s repeater, and theirs on yours.';
  },

  scene(state) {
    const on = running(state);
    const markHere = getRole() === 'p2' && !state.journal.some(e => e.id === 'mark_r');
    const rep = repeaterFor(getRole());
    const v = [0, 1, 2, 3, 4].map(i => state.flags[`beamengine_v${i}`] ? true : false);

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}
        <style>@keyframes ${SLUG}_spin{to{transform:rotate(360deg)}} .${SLUG}_gov{transform-origin:${GOV.cx}px ${GOV.cy}px;animation:${SLUG}_spin 3.2s linear infinite;}</style>
      </defs>
      ${backdrop(SLUG)}
      ${interior(SLUG, { window: { x: 1150, y: 260, w: 230, h: 230, shape: 'round' }, floorY: FLOOR })}

      <!-- the clockwork drive, standing on the floor, its governor on top -->
      <g data-mount="floor">
        ${shadow(DRIVE.x + DRIVE.w / 2, FLOOR + 30, DRIVE.w * 0.6, 12)}
        <rect x="${DRIVE.x}" y="${DRIVE.y}" width="${DRIVE.w}" height="${FLOOR + 24 - DRIVE.y}" rx="8" fill="url(#sk_iron)" stroke="#0c0f13" stroke-width="4"/>
        ${[0, 1, 2].map(i => `<circle cx="${DRIVE.x + 70 + i * 60}" cy="${DRIVE.y + 230}" r="${22 + (i % 2) * 8}" fill="none" stroke="#5d6270" stroke-width="5"/>`).join('')}
        <rect x="${GOV.cx - 8}" y="${GOV.cy}" width="16" height="${DRIVE.y - GOV.cy}" fill="#5d6270"/>
        <circle cx="${GOV.cx}" cy="${GOV.cy}" r="20" fill="#2b3547" stroke="#c9a227" stroke-width="4"/>
        <g class="${on ? SLUG + '_gov' : ''}">
          <line x1="${GOV.cx}" y1="${GOV.cy}" x2="${GOV.cx - 90}" y2="${GOV.cy - 80}" stroke="#8a7f6a" stroke-width="6"/>
          <line x1="${GOV.cx}" y1="${GOV.cy}" x2="${GOV.cx + 90}" y2="${GOV.cy - 80}" stroke="#8a7f6a" stroke-width="6"/>
          <circle cx="${GOV.cx - 90}" cy="${GOV.cy - 80}" r="18" fill="#3a4656"/>
          <circle cx="${GOV.cx + 90}" cy="${GOV.cy - 80}" r="18" fill="#3a4656"/>
        </g>
        <text x="${GOV.cx}" y="${DRIVE.y + 40}" text-anchor="middle" font-size="13" fill="#9fc7dd" font-family="Consolas, monospace">GOVERNOR</text>
      </g>

      <!-- the pressure gauge on its standpipe -->
      <g data-mount="pipe">
        <rect x="${GAUGE.cx - 7}" y="${GAUGE.cy + 50}" width="14" height="${PIPE_Y - GAUGE.cy - 50}" fill="url(#sk_steel)"/>
        <circle cx="${GAUGE.cx}" cy="${GAUGE.cy}" r="56" fill="#0e2032" stroke="#9fc7dd" stroke-width="5"/>
        <line x1="${GAUGE.cx}" y1="${GAUGE.cy}" x2="${on ? GAUGE.cx + 42 : GAUGE.cx - 32}" y2="${on ? GAUGE.cy - 30 : GAUGE.cy - 18}" stroke="#e8c85a" stroke-width="4"/>
        <text x="${GAUGE.cx}" y="${GAUGE.cy + 34}" text-anchor="middle" font-size="12" fill="#9fc7dd" font-family="Consolas, monospace">MAIN</text>
      </g>

      <!-- this engine's own valve rule -->
      ${panel({ ...RULEPLATE, material: 'brass', mount: 'bolts', body: `
        <text x="${RULEPLATE.x + RULEPLATE.w / 2}" y="${RULEPLATE.y + 30}" text-anchor="middle" font-size="14" fill="#2a1d05" font-family="Consolas, monospace" letter-spacing="1">${towerName().toUpperCase()} ENGINE — VALVE RULE</text>
        ${RULE[getRole()].text.map((line, i) => `<text x="${RULEPLATE.x + RULEPLATE.w / 2}" y="${RULEPLATE.y + 62 + i * 24}" text-anchor="middle" font-size="16" fill="#2a1d05" font-family="Georgia, serif">${line}</text>`).join('')}` })}

      <!-- five valves on the manifold, the pipe on two stands -->
      <g data-mount="floor">
        ${[VALVES.x + 20, VALVES.x + VALVES.w - 20].map(lx => `<rect x="${lx - 9}" y="${PIPE_Y}" width="18" height="${FLOOR + 20 - PIPE_Y}" fill="url(#sk_iron)"/>${shadow(lx, FLOOR + 22, 40, 6)}`).join('')}
        <rect x="${VALVES.x}" y="${PIPE_Y - 14}" width="${VALVES.w}" height="28" rx="12" fill="url(#sk_steel)" stroke="#0c0f13" stroke-width="3"/>
        ${v.map((open, i) => {
          const x = 640 + i * 130;
          return `
          <rect x="${x - 20}" y="${PIPE_Y - 30}" width="40" height="60" rx="8" fill="#1c2431" stroke="#3a4656" stroke-width="3"/>
          <line x1="${x}" y1="${PIPE_Y - 20}" x2="${open ? x : x + 52}" y2="${open ? PIPE_Y - 84 : PIPE_Y - 20}" stroke="${open ? '#8fe0a0' : '#5b6b7d'}" stroke-width="9" stroke-linecap="round"/>
          <circle cx="${x}" cy="${PIPE_Y - 20}" r="9" fill="#141c26"/>
          <text x="${x}" y="${PIPE_Y + 56}" text-anchor="middle" font-size="14" fill="#9fc7dd" font-family="Consolas, monospace">${i + 1}</text>
          <text x="${x}" y="${PIPE_Y - 96}" text-anchor="middle" font-size="12" fill="${open ? '#8fe0a0' : '#7f8a99'}" font-family="Consolas, monospace">${open ? 'OPEN' : 'SHUT'}</text>`;
        }).join('')}
      </g>

      <!-- the ladder up to the crown -->
      <g data-mount="floor">
        ${[LADDER.x + 12, LADDER.x + LADDER.w - 12].map(lx => `<rect x="${lx - 5}" y="${LADDER.y}" width="10" height="${LADDER.h}" fill="url(#sk_iron)"/>`).join('')}
        ${Array.from({ length: 11 }, (_, i) => `<rect x="${LADDER.x + 12}" y="${LADDER.y + 30 + i * 52}" width="${LADDER.w - 24}" height="7" fill="#3a414d"/>`).join('')}
        <rect x="${LADDER.x - 16}" y="0" width="${LADDER.w + 32}" height="${LADDER.y + 4}" fill="#0a0d12"/>
      </g>

      <!-- the OTHER engine's line pressures, copied from the repeater into the signal book -->
      ${dock({ x: 0, y: 0, w: 380, h: 200 }, `
        <text x="190" y="34" text-anchor="middle" font-size="18" fill="#4a3a22" font-family="Consolas, monospace" letter-spacing="1">${otherTowerName().toUpperCase()} — LINE PRESSURES</text>
        ${rep.map((n, i) => `
          <g transform="translate(${46 + i * 72} 104)">
            <circle r="30" fill="#efe6cf" stroke="#6b5a3a" stroke-width="2.5"/>
            <text y="8" text-anchor="middle" font-size="22" fill="#26221a" font-family="Consolas, monospace">${n}</text>
            <text y="54" text-anchor="middle" font-size="16" fill="#6b5a3a" font-family="Consolas, monospace">${i + 1}</text>
          </g>`).join('')}
        <text x="190" y="190" text-anchor="middle" font-size="16" fill="#6b5a3a" font-family="Consolas, monospace">lb · read lines 1–5 to your partner</text>`, { kind: 'notebook', title: 'SIGNAL BOOK' })}

      ${on ? `<text x="905" y="820" text-anchor="middle" font-size="18" fill="#8fe0a0" font-family="Consolas, monospace">the beam swings — the light lives</text>` : ''}

      ${markHere ? `
      <g class="beckon">
        <circle cx="${MARK.x + 45}" cy="${MARK.y + 45}" r="20" fill="url(#sk_brass)" stroke="#c9a227" stroke-width="3"/>
        <text x="${MARK.x + 45}" y="${MARK.y + 51}" text-anchor="middle" font-size="16" fill="#2a1d05" font-family="Consolas, monospace" font-weight="bold">${bearingOf(5)}</text>
      </g>` : ''}

      ${towerTag()}
      ${rainOutside(SLUG)}
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const on = running(state);

    spots.push({
      id: 'repeater', ...DOCK, label: `${otherTowerName()} line pressures`,
      onInteract(game) {
        const rep = repeaterFor(getRole());
        const html = `<div class="chartcard"><div class="chart-title">${otherTowerName()} engine — line pressures</div>
          <p style="font-size:22px;color:#fff6df;text-align:center;letter-spacing:3px;">${rep.join(' · ')}</p>
          <p style="text-align:center;color:#7f8a99;">lines 1 → 5, in pounds</p></div>
          <div class="relay">The shared main lets your repeater read your <strong>partner's</strong> engine. Read them the five pressures in order — their engine's plate says which lines to open.</div>`;
        game.journal.add('note_schematic', { title: `${otherTowerName()} line pressures`, category: 'note', html });
        game.dialog({ title: 'The Repeater', html });
      },
    });

    spots.push({
      id: 'rule', ...RULEPLATE, label: `${towerName()} engine — valve rule`,
      onInteract(game) {
        const html = `<div class="chartcard"><div class="chart-title">${towerName()} engine — valve rule</div>
          <p style="text-align:center;color:#fff6df;">${RULE[getRole()].text.join(' ')}</p></div>
          <div class="relay">Your own line pressures read only on your partner's repeater. Ask them for lines 1–5, then open or shut each by this rule.</div>`;
        game.journal.add('note_valverule', { title: `${towerName()} valve rule`, category: 'note', html });
        game.dialog({ title: 'Valve Rule', html });
      },
    });

    spots.push({
      id: 'governor', x: GOV.cx - 110, y: GOV.cy - 100, w: 220, h: 160, label: 'The governor',
      onInteract(game) { game.say(on ? 'The weights fly out and the beam sweeps steady and true.' : 'The governor hangs dead. Open the right valves and pressure will spin it.'); },
    });

    if (getRole() === 'p2' && !state.journal.some(e => e.id === 'mark_r')) {
      spots.push({
        id: 'mark_r', ...MARK, label: 'A brass bearing-mark',
        onInteract(game) {
          game.journal.add('mark_r', { title: 'East Tower — the governor housing', category: 'sun', sun: { rays: 5, letter: 'R' } });
          game.say(`Screwed to the drive housing below the governor: a brass compass-plate, its needle pointing ${bearingOf(5)}, and the letter R. Logged.`);
          game.refreshScene();
        },
      });
    }

    if (!on) {
      spots.push({
        id: 'valves', ...VALVES, label: 'The five valves',
        onInteract(game) { openValves(game); },
      });
    } else {
      spots.push({
        id: 'up', ...LADDER, label: 'The ladder up to the crown',
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
      { text: 'Your engine\'s plate says which lines to open — but your line pressures only show on your partner\'s repeater. Theirs show on yours.', cost: 60 },
      { text: isWest()
          ? 'Ask your partner for your five line pressures, in order. Your plate: open the even readings, shut the odd.'
          : 'Ask your partner for your five line pressures, in order. Your plate: open any reading above 30 lb, shut the rest.', cost: 120 },
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
        <div class="puzzle-hero" style="background-image:url(art/pz-valves.webp)"></div>
        <p class="puzzle-desc">Open or shut each of the five valves by your engine's rule plate,
        using the line pressures your partner reads you from their repeater. Click a valve to flip it.</p>
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
          api.fail('The drive coughs and stalls — one or more valves are wrong. Recheck the pressures with your partner, and your plate\'s rule.');
        }
      });
    },
  });
}
