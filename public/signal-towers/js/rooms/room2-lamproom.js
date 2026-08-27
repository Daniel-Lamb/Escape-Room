// SCENE 2 — The Lamp Room (rotation alignment).
// Each lamp's four Fresnel panels must point to bearings drawn on the OTHER
// tower's lamp-card. West target [NE,SE,W,S]; East target [E,S,NW,N].
// East (P2) finds bearing-mark A (depth 1).

import { getRole, isWest, towerName, otherTowerName } from '../role.js';
import { defs, backdrop, rain, beam, towerTag } from '../scenekit.js';

const SLUG = 'lamp';
const PTS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
const TARGET = { p1: [1, 3, 6, 4], p2: [2, 4, 7, 0] };   // this tower's own correct bearings
// The card visible on THIS screen shows the OTHER tower's target (for the partner to read).
function cardFor(role) { return role === 'p1' ? TARGET.p2 : TARGET.p1; }

function lit(state) { return !!state.flags.lamproom_lit; }

export default {
  id: 'lamproom',
  get title() { return `${towerName()} · The Lamp Room`; },
  get intro() {
    return 'Up the winding stair, the great lamp waits — cold. Its four prism panels have spun loose in the wind and must be trued to the right bearings before the beam will throw. The bearings for this lamp are drawn on the card you are holding for the other tower — and yours are on theirs.';
  },

  scene(state) {
    const on = lit(state);
    const markHere = getRole() === 'p2' && !state.journal.some(e => e.id === 'mark_a');
    const card = cardFor(getRole());
    const p = [
      state.flags.lamproom_p0 ?? 0, state.flags.lamproom_p1 ?? 0,
      state.flags.lamproom_p2 ?? 0, state.flags.lamproom_p3 ?? 0,
    ];

    // four prism panels around the lamp, each rotated to its current bearing
    const panel = (i, cx, cy) => {
      const ang = (p[i] / 8) * 360;
      return `<g transform="translate(${cx} ${cy}) rotate(${ang})">
        <rect x="-46" y="-14" width="92" height="28" rx="5" fill="#1c2431" stroke="#9fc7dd" stroke-width="2.5" opacity="0.9"/>
        <path d="M-46 0 L46 0" stroke="#cfe4f0" stroke-width="2"/>
        <path d="M40 0 l-12 -6 l0 12 z" fill="#e8c85a"/>
        <text x="0" y="26" text-anchor="middle" font-size="14" fill="#9fc7dd" font-family="Consolas, monospace" transform="rotate(${-ang})">${PTS[p[i]]}</text>
      </g>`;
    };

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}</defs>
      ${backdrop(SLUG)}
      ${on ? beam(SLUG, 800, 430, isWest() ? 20 : 160) : ''}

      <!-- lamp room glass drum -->
      <ellipse cx="800" cy="470" rx="330" ry="330" fill="rgba(159,199,221,0.04)" stroke="#3a4656" stroke-width="10"/>
      <!-- the flame core -->
      ${on
        ? `<circle cx="800" cy="440" r="44" fill="#ffe6a6" class="glow"/>
           <path class="torch-flame" d="M800 396 q24 30 10 74 q-5 12 -10 12 q-5 0 -10 -12 q-14 -44 10 -74z" fill="#ffcf6a"/>`
        : `<circle cx="800" cy="440" r="30" fill="#141c26" stroke="#3a4656" stroke-width="4"/>`}

      <!-- four prism panels -->
      ${panel(0, 800, 250)}
      ${panel(1, 1010, 460)}
      ${panel(2, 800, 660)}
      ${panel(3, 590, 460)}

      <!-- paraffin reservoir (flavor) -->
      <g>
        <rect x="300" y="700" width="150" height="120" rx="10" fill="#2b3547" stroke="#141c26" stroke-width="5"/>
        <rect x="330" y="720" width="90" height="60" fill="#3a2d1c"/>
        <text x="375" y="757" text-anchor="middle" font-size="13" fill="#9fc7dd" font-family="Consolas, monospace">PARAFFIN</text>
      </g>

      <!-- the lamp-card for the OTHER tower (this player relays it) -->
      <g>
        <rect x="1150" y="150" width="360" height="230" rx="8" fill="#0e2032" stroke="#9fc7dd" stroke-width="3"/>
        <text x="1330" y="192" text-anchor="middle" font-size="17" fill="#9fc7dd" font-family="Consolas, monospace" letter-spacing="2">${otherTowerName().toUpperCase()} LAMP-CARD</text>
        ${card.map((v, i) => `
          <g transform="translate(${1200 + i * 78} 280)">
            <circle r="30" fill="#141c26" stroke="#c9a227" stroke-width="2.5"/>
            <text y="7" text-anchor="middle" font-size="20" fill="#e8c85a" font-family="Consolas, monospace">${PTS[v]}</text>
            <text y="52" text-anchor="middle" font-size="13" fill="#7f8a99" font-family="Consolas, monospace">${i + 1}</text>
          </g>`).join('')}
        <text x="1330" y="360" text-anchor="middle" font-size="12" fill="#7f8a99" font-family="Consolas, monospace">read these four to your partner</text>
      </g>

      ${markHere ? `
      <g class="beckon">
        <circle cx="1050" cy="740" r="22" fill="rgba(201,162,39,0.08)" stroke="#c9a227" stroke-width="3"/>
        <text x="1050" y="748" text-anchor="middle" font-size="20" fill="#e8c85a" font-family="Consolas, monospace" font-weight="bold">1</text>
        <text x="1050" y="782" text-anchor="middle" font-size="14" fill="#e8dcc0" font-family="Georgia, serif">brass mark</text>
      </g>` : ''}

      ${towerTag()}
      ${rain(SLUG)}
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const on = lit(state);

    spots.push({
      id: 'card', x: 1150, y: 150, w: 360, h: 230, label: `${otherTowerName()} lamp-card`,
      onInteract(game) {
        const card = cardFor(getRole());
        const html = `<div class="chartcard"><div class="chart-title">${otherTowerName()} lamp bearings</div>
          <p>Panels 1–4, in order:</p>
          <p style="font-size:24px;letter-spacing:4px;color:#fff6df;text-align:center;">${card.map(v => PTS[v]).join(' &nbsp; ')}</p></div>
          <div class="relay">These are your <strong>partner's</strong> lamp bearings. Read them the four points, in order.</div>`;
        game.journal.add('note_lampcard', { title: `${otherTowerName()} lamp-card`, category: 'note', html });
        game.dialog({ title: `${otherTowerName()} Lamp-Card`, html });
      },
    });

    spots.push({
      id: 'reservoir', x: 300, y: 700, w: 150, h: 120, label: 'Paraffin reservoir',
      onInteract(game) { game.say('Full, pressurised, ready. The lamp will burn the moment the panels are trued.'); },
    });

    spots.push({
      id: 'flame', x: 700, y: 360, w: 200, h: 220, label: on ? 'The lit lamp' : 'The dark lamp',
      onInteract(game) {
        if (on) game.say('The mantle roars white-gold and the panels catch it and throw it out to sea. A real light at last.');
        else game.say('Cold mantle, loose panels. True the four prisms to their bearings and it will light.');
      },
    });

    if (getRole() === 'p2' && !state.journal.some(e => e.id === 'mark_a')) {
      spots.push({
        id: 'mark_a', x: 1010, y: 700, w: 90, h: 100, label: 'A brass bearing-mark',
        onInteract(game) {
          game.journal.add('mark_a', { title: 'East Tower — the lamp tray', category: 'sun', sun: { rays: 1, letter: 'A' } });
          game.say('In the lamp-housing tray: a brass bearing-plate, bearing 1, letter A. Into the log it goes.');
          game.refreshScene();
        },
      });
    }

    if (!on) {
      spots.push({
        id: 'panels', x: 560, y: 220, w: 480, h: 480, label: 'The four prism panels',
        onInteract(game) { openPanels(game); },
      });
    } else {
      spots.push({
        id: 'up', x: 560, y: 220, w: 480, h: 480, label: 'The stair up to the gallery',
        onInteract(game) {
          if (getRole() === 'p2' && !game.journal.has('mark_a')) {
            game.say('There is a bearing-mark in the lamp tray — pocket it before you climb.');
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
      { text: 'Four panels, four bearings. Your own bearings are not on your card — your card holds your PARTNER\'s. So theirs holds yours. Trade.', cost: 60 },
      { text: 'Read the four compass points on your lamp-card to your partner, in order 1–4. Set the four the partner reads to you.', cost: 120 },
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
        <p class="puzzle-desc">Turn each of the four panels to its bearing. Your bearings are on
        your partner's lamp-card — ask them to read you panels 1 through 4.</p>
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
          api.fail('The beam scatters — one or more panels are off their bearing. Check the card with your partner.');
        }
      });
    },
  });
}
