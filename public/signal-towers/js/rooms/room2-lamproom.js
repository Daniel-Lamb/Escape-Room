// SCENE 2 — The Lamp Room (split knowledge: reef bearings x aiming rule).
// Each lamp's four panels must throw their light AWAY from the reef each one
// guards. The reef bearings for a lamp are in the OTHER tower's signal book;
// the rule for turning a reef into a panel bearing is on this lamp's own plate.
//   West rule: the point OPPOSITE the reef.   West reefs SW NW E N -> NE SE W S
//   East rule: a quarter-turn SUNWISE.        East reefs N E SW W  -> E S NW N
// East (P2) finds bearing-mark A (the north plate).

import { getRole, isWest, towerName, otherTowerName } from '../role.js';
import { defs, backdrop, rainOutside, interior, beam, bearingOf, towerTag } from '../scenekit.js';
import { dock, DOCK, panel, shadow } from '../../../shared/js/scenekit.js';

const SLUG = 'lamp';
const PTS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
const TARGET = { p1: [1, 3, 6, 4], p2: [2, 4, 7, 0] };   // this tower's own correct bearings
const TURN = { p1: 4, p2: 2 };                            // eighths sunwise from reef to panel
const REEFS = { p1: TARGET.p1.map(v => (v - TURN.p1 + 8) % 8), p2: TARGET.p2.map(v => (v - TURN.p2 + 8) % 8) };
const RULE = {
  p1: ['Throw each panel AWAY from its reef:', 'set it to the point OPPOSITE the reef', '(N↔S, NE↔SW, E↔W, SE↔NW).'],
  p2: ['Throw each panel clear of its reef:', 'set it a QUARTER-TURN SUNWISE of the reef', '(N→E, E→S, S→W, W→N).'],
};
// The signal book on THIS screen holds the OTHER tower's reef bearings (for the partner to read).
function cardFor(role) { return role === 'p1' ? REEFS.p2 : REEFS.p1; }

// The lantern room: continuous glazing round the upper wall, the lens on its
// pedestal in the middle with the four panel dials on its control plate, the
// rule plate on the wall, the paraffin tank on the floor, the ladder up.
const FLOOR = 760;
const LENS = { x: 720, y: 190, w: 160, h: 250 };
const DIALS = { x: 620, y: 520, w: 360, h: 130 };
const RULEPLATE = { x: 1070, y: 530, w: 380, h: 120 };
const TANK = { x: 410, y: 640, w: 140, h: 120 };
const LADDER = { x: 240, y: 110, w: 100, h: 650 };
const MARK = { x: 838, y: 680, w: 90, h: 80 };

function lit(state) { return !!state.flags.lamproom_lit; }

export default {
  id: 'lamproom',
  solution: role => TARGET[role].map(v => PTS[v]),
  get title() { return `${towerName()} · The Lamp Room`; },
  get intro() {
    return 'Up the winding stair, the great lamp waits — cold. Its four prism panels have spun loose in the wind and must be trued before the beam will throw — each one aimed clear of the reef it guards. Your lamp\'s plate says how to aim; the reefs themselves are written in the other tower\'s signal book, and theirs in yours.';
  },

  scene(state) {
    const on = lit(state);
    const markHere = getRole() === 'p2' && !state.journal.some(e => e.id === 'mark_a');
    const card = cardFor(getRole());
    const p = [
      state.flags.lamproom_p0 ?? 0, state.flags.lamproom_p1 ?? 0,
      state.flags.lamproom_p2 ?? 0, state.flags.lamproom_p3 ?? 0,
    ];

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}</defs>
      ${backdrop(SLUG)}
      ${interior(SLUG, { window: { x: 110, y: 90, w: 1380, h: 380, shape: 'band' }, floorY: FLOOR, panes: 6 })}
      ${on ? beam(SLUG, 800, 300, isWest() ? 20 : 160) : ''}

      <!-- the iron ladder up through the hatch to the gallery -->
      <g data-mount="floor">
        ${[LADDER.x + 14, LADDER.x + LADDER.w - 14].map(lx => `<rect x="${lx - 5}" y="${LADDER.y}" width="10" height="${LADDER.h}" fill="url(#sk_iron)"/>`).join('')}
        ${Array.from({ length: 12 }, (_, i) => `<rect x="${LADDER.x + 14}" y="${LADDER.y + 30 + i * 52}" width="${LADDER.w - 28}" height="7" fill="#3a414d"/>`).join('')}
        <rect x="${LADDER.x - 20}" y="${LADDER.y - 20}" width="${LADDER.w + 40}" height="24" fill="#0a0d12"/>
      </g>

      <!-- paraffin tank on the floor, its feed pipe to the pedestal -->
      <g data-mount="floor">
        ${shadow(TANK.x + TANK.w / 2, FLOOR + 6, TANK.w * 0.6, 10)}
        <path d="M${TANK.x + TANK.w} ${FLOOR - 30} L760 ${FLOOR - 30}" stroke="#3a414d" stroke-width="10"/>
        <rect x="${TANK.x}" y="${TANK.y}" width="${TANK.w}" height="${TANK.h}" rx="12" fill="url(#sk_steel)" stroke="#0c0f13" stroke-width="4"/>
        <rect x="${TANK.x + 24}" y="${TANK.y + 34}" width="${TANK.w - 48}" height="34" rx="3" fill="url(#sk_brass)" stroke="#3a2a0c" stroke-width="1.5"/>
        <text x="${TANK.x + TANK.w / 2}" y="${TANK.y + 56}" text-anchor="middle" font-size="13" fill="#2a1d05" font-family="Consolas, monospace">PARAFFIN</text>
      </g>

      <!-- the lamp pedestal, the lens on top, the panel dials on its control plate -->
      <g data-mount="floor">
        ${shadow(800, FLOOR + 22, 130, 14)}
        <rect x="700" y="${FLOOR - 10}" width="200" height="34" rx="5" fill="url(#sk_iron)" stroke="#0c0f13" stroke-width="3"/>
        <rect x="755" y="${LENS.y + LENS.h - 10}" width="90" height="${FLOOR - LENS.y - LENS.h + 4}" fill="url(#sk_iron)" stroke="#0c0f13" stroke-width="3"/>
        <path d="M${LENS.x} ${LENS.y + LENS.h} L${LENS.x + 10} ${LENS.y + 60} Q800 ${LENS.y - 30} ${LENS.x + LENS.w - 10} ${LENS.y + 60} L${LENS.x + LENS.w} ${LENS.y + LENS.h} Z" fill="url(#sk_brass)" stroke="#3a2a0c" stroke-width="3"/>
        <path d="M${LENS.x + 16} ${LENS.y + LENS.h - 8} L${LENS.x + 24} ${LENS.y + 70} Q800 ${LENS.y - 6} ${LENS.x + LENS.w - 24} ${LENS.y + 70} L${LENS.x + LENS.w - 16} ${LENS.y + LENS.h - 8} Z" fill="${on ? 'rgba(255,230,166,0.35)' : 'rgba(159,199,221,0.12)'}" data-fx="glass"/>
        ${[0, 1, 2, 3, 4].map(i => `<line x1="${LENS.x + 18}" y1="${LENS.y + 90 + i * 30}" x2="${LENS.x + LENS.w - 18}" y2="${LENS.y + 90 + i * 30}" stroke="#cfe4f0" stroke-opacity="0.35" stroke-width="2"/>`).join('')}
        ${on
          ? `<circle cx="800" cy="${LENS.y + 140}" r="40" fill="#ffe6a6" class="glow"/>
             <path class="torch-flame" d="M800 ${LENS.y + 100} q24 30 10 66 q-5 12 -10 12 q-5 0 -10 -12 q-14 -36 10 -66z" fill="#ffcf6a"/>`
          : `<circle cx="800" cy="${LENS.y + 140}" r="24" fill="#141c26" stroke="#3a4656" stroke-width="4"/>`}
      </g>
      ${panel({ ...DIALS, material: 'brass', mount: 'bolts', body: p.map((v, i) => {
        const cx = DIALS.x + 60 + i * 80, cy = DIALS.y + 74, ang = (v / 8) * 360;
        return `<text x="${cx}" y="${DIALS.y + 26}" text-anchor="middle" font-size="12" fill="#2a1d05" font-family="Consolas, monospace">panel ${i + 1}</text>
          <circle cx="${cx}" cy="${cy}" r="32" fill="#141c26" stroke="#3a2a0c" stroke-width="3"/>
          <path d="M${cx} ${cy - 26} l-6 12 l12 0 z" fill="#e8c85a" transform="rotate(${ang} ${cx} ${cy})"/>
          <text x="${cx}" y="${cy + 7}" text-anchor="middle" font-size="17" fill="#e8c85a" font-family="Consolas, monospace">${PTS[v]}</text>`;
      }).join('') })}

      <!-- this lamp's own aiming rule, on a plate on the wall -->
      ${panel({ ...RULEPLATE, material: 'brass', mount: 'bolts', body: `
        <text x="${RULEPLATE.x + RULEPLATE.w / 2}" y="${RULEPLATE.y + 28}" text-anchor="middle" font-size="14" fill="#2a1d05" font-family="Consolas, monospace" letter-spacing="1">${towerName().toUpperCase()} LAMP — HOW TO AIM</text>
        ${RULE[getRole()].map((line, i) => `<text x="${RULEPLATE.x + RULEPLATE.w / 2}" y="${RULEPLATE.y + 56 + i * 22}" text-anchor="middle" font-size="${i === 2 ? 13 : 15}" fill="#2a1d05" font-family="Georgia, serif">${line}</text>`).join('')}` })}

      <!-- the OTHER tower's reef bearings, in your signal book -->
      ${dock({ x: 0, y: 0, w: 360, h: 210 }, `
        <text x="180" y="34" text-anchor="middle" font-size="18" fill="#4a3a22" font-family="Consolas, monospace" letter-spacing="1">${otherTowerName().toUpperCase()} — REEFS</text>
        ${card.map((v, i) => `
          <g transform="translate(${54 + i * 84} 110)">
            <circle r="32" fill="#efe6cf" stroke="#6b5a3a" stroke-width="2.5"/>
            <text y="8" text-anchor="middle" font-size="22" fill="#26221a" font-family="Consolas, monospace">${PTS[v]}</text>
            <text y="56" text-anchor="middle" font-size="16" fill="#6b5a3a" font-family="Consolas, monospace">${i + 1}</text>
          </g>`).join('')}
        <text x="180" y="200" text-anchor="middle" font-size="16" fill="#6b5a3a" font-family="Consolas, monospace">read panels 1–4 to your partner</text>`, { kind: 'notebook', title: 'SIGNAL BOOK' })}

      ${markHere ? `
      <g class="beckon">
        <circle cx="${MARK.x + 45}" cy="${MARK.y + 42}" r="20" fill="url(#sk_brass)" stroke="#c9a227" stroke-width="3"/>
        <text x="${MARK.x + 45}" y="${MARK.y + 48}" text-anchor="middle" font-size="16" fill="#2a1d05" font-family="Consolas, monospace" font-weight="bold">${bearingOf(1)}</text>
      </g>` : ''}

      ${towerTag()}
      ${rainOutside(SLUG)}
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const on = lit(state);

    spots.push({
      id: 'card', ...DOCK, label: `${otherTowerName()} reef bearings`,
      onInteract(game) {
        const card = cardFor(getRole());
        const html = `<div class="chartcard"><div class="chart-title">${otherTowerName()} lamp — the reef each panel guards</div>
          <p>Panels 1–4, in order:</p>
          <p style="font-size:24px;letter-spacing:4px;color:#fff6df;text-align:center;">${card.map(v => PTS[v]).join(' &nbsp; ')}</p></div>
          <div class="relay">These are the reefs round your <strong>partner's</strong> lamp. Read them the four points in order — their own lamp's plate tells them how to aim away from each.</div>`;
        game.journal.add('note_lampcard', { title: `${otherTowerName()} reef bearings`, category: 'note', html });
        game.dialog({ title: `${otherTowerName()} Reefs`, html });
      },
    });

    spots.push({
      id: 'rule', ...RULEPLATE, label: `${towerName()} lamp — how to aim`,
      onInteract(game) {
        const html = `<div class="chartcard"><div class="chart-title">${towerName()} lamp — how to aim</div>
          <p style="text-align:center;color:#fff6df;">${RULE[getRole()].join(' ')}</p></div>
          <div class="relay">The reefs round <strong>your</strong> lamp are in your partner's signal book. Ask for them, panels 1–4, and turn each by this rule.</div>`;
        game.journal.add('note_lamprule', { title: `${towerName()} lamp rule`, category: 'note', html });
        game.dialog({ title: 'How to Aim', html });
      },
    });

    spots.push({
      id: 'reservoir', ...TANK, label: 'Paraffin reservoir',
      onInteract(game) { game.say('Full, pressurised, ready. The lamp will burn the moment the panels are trued.'); },
    });

    spots.push({
      id: 'flame', ...LENS, label: on ? 'The lit lamp' : 'The dark lamp',
      onInteract(game) {
        if (on) game.say('The mantle roars white-gold and the panels catch it and throw it out to sea. A real light at last.');
        else game.say('Cold mantle, loose panels. True the four prisms to their bearings and it will light.');
      },
    });

    if (getRole() === 'p2' && !state.journal.some(e => e.id === 'mark_a')) {
      spots.push({
        id: 'mark_a', ...MARK, label: 'A brass bearing-mark',
        onInteract(game) {
          game.journal.add('mark_a', { title: 'East Tower — the lamp tray', category: 'sun', sun: { rays: 1, letter: 'A' } });
          game.say(`In the tray at the foot of the lamp pedestal: a brass compass-plate, its needle pointing ${bearingOf(1)}, and the letter A. Into the log it goes.`);
          game.refreshScene();
        },
      });
    }

    if (!on) {
      spots.push({
        id: 'panels', ...DIALS, label: 'The four panel dials',
        onInteract(game) { openPanels(game); },
      });
    } else {
      spots.push({
        id: 'up', ...LADDER, label: 'The ladder up to the gallery',
        onInteract(game) {
          if (getRole() === 'p2' && !game.journal.has('mark_a')) {
            game.say('There is a bearing-mark in the tray at the foot of the pedestal — pocket it before you climb.');
            return;
          }
          game.completeRoom({ delay: 600 });
        },
      });
    }

    return spots;
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: 'Your lamp\'s plate tells you how to aim a panel from the reef it guards. The reefs round your lamp are in your partner\'s signal book — and theirs are in yours.', cost: 60 },
      { text: isWest()
          ? 'Get your four reef bearings from your partner, panels 1–4. Your plate says: set each panel to the point opposite its reef (N↔S, E↔W).'
          : 'Get your four reef bearings from your partner, panels 1–4. Your plate says: turn each a quarter sunwise from its reef (N→E, E→S, S→W, W→N).', cost: 120 },
      { text: isWest() ? 'West panels: NE, SE, W, S.' : 'East panels: E, S, NW, N.', cost: 240 },
    ];
  },
};

function openPanels(game) {
  const role = getRole();
  const target = TARGET[role];
  const p = [
    game.getFlag('lamproom_p0') ?? 0, game.getFlag('lamproom_p1') ?? 0,
    game.getFlag('lamproom_p2') ?? 0, game.getFlag('lamproom_p3') ?? 0,
  ];

  game.openPuzzle({
    id: 'lamproom_panels',
    title: 'True the Prism Panels',
    render(body, api) {
      body.innerHTML = `
        <div class="puzzle-hero" style="background-image:url(art/pz-lamp.webp)"></div>
        <p class="puzzle-desc">Turn each panel to throw its light clear of its reef. Your partner
        has your four reef bearings; your lamp's plate says how to aim from each one.</p>
        <div class="puzzle-row" id="lp-dials"></div>
        <div class="puzzle-row"><button class="btn btn-primary" id="lp-try">Light the Lamp</button></div>
        <div class="puzzle-feedback"></div>`;
      const row = body.querySelector('#lp-dials');
      p.forEach((v, i) => {
        const dial = document.createElement('div');
        dial.className = 'dial';
        dial.innerHTML = `
          <button class="dial-btn" data-d="1" aria-label="turn right">&#8635;</button>
          <div class="dial-face">${PTS[v]}</div>
          <button class="dial-btn" data-d="-1" aria-label="turn left">&#8634;</button>
          <div class="lever-label">panel ${i + 1}</div>`;
        const face = dial.querySelector('.dial-face');
        dial.querySelectorAll('.dial-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            p[i] = (p[i] + Number(btn.dataset.d) + 8) % 8;
            face.textContent = PTS[p[i]];
            face.classList.remove('tick'); void face.offsetWidth; face.classList.add('tick');
            game.playSfx('click');
            game.setFlag(`lamproom_p${i}`, p[i]);
          });
        });
        row.appendChild(dial);
      });
      body.querySelector('#lp-try').addEventListener('click', () => {
        if (p.every((v, i) => v === target[i])) {
          game.setFlag('lamproom_lit');
          game.playSfx('solve');
          api.solved({ message: 'The four panels lock true, the mantle catches, and the beam leaps out across the black water.' });
          game.refreshScene();
        } else {
          api.fail('The beam scatters — one or more panels are off. Check the reef bearings with your partner, and apply your plate to each.');
        }
      });
    },
  });
}
