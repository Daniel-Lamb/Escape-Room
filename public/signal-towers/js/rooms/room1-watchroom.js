// SCENE 1 — The Watch Room (tutorial · cross-read combination).
// Each tower's trap-hatch code is posted on the OTHER tower's wall.
//   West hatch = 3-7-1 (posted on the East wall / P2 screen)
//   East hatch = 5-2-8 (posted on the West wall / P1 screen)
// West (P1) also finds bearing-mark S (depth 2).

import { getRole, isWest, towerName, otherTowerName } from '../role.js';
import { defs, backdrop, rain, beam, towerTag } from '../scenekit.js';

const SLUG = 'watch';
// The code the OTHER tower's wall reveals (i.e. what THIS player reads to their partner).
const OTHER_CODE = { p1: '5 · 2 · 8', p2: '3 · 7 · 1' };   // West wall names EAST hatch; East wall names WEST hatch
// This tower's own hatch solution (never shown on this screen).
const MY_CODE = { p1: [3, 7, 1], p2: [5, 2, 8] };

function hatchOpen(state) { return !!state.flags.watchroom_hatchOpen; }

export default {
  id: 'watchroom',
  get title() { return `${towerName()} · The Watch Room`; },
  get intro() {
    return isWest()
      ? 'The West lamp is dead and the Meridian is already too close to the Kestrel reefs. The stair up is barred by the storm-hatch — and its code is nowhere in this room. Somewhere across the water, your partner is reading it off their wall right now.'
      : 'Gannet Rock shudders with every wave. The East lamp is cold, the stair-hatch locked, and the code for it is not written anywhere you can see. Your partner on the far headland can read it, though — if the two of you will only talk.';
  },

  scene(state) {
    const open = hatchOpen(state);
    const markHere = isWest() && !state.journal.some(e => e.id === 'mark_s');
    const relayCode = OTHER_CODE[getRole()];

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}</defs>
      ${backdrop(SLUG)}

      <!-- storm window with the distant ship's lamp -->
      <g>
        <rect x="1130" y="120" width="360" height="250" rx="6" fill="#0a1622" stroke="#3a4656" stroke-width="10"/>
        <line x1="1310" y1="120" x2="1310" y2="370" stroke="#3a4656" stroke-width="8"/>
        <line x1="1130" y1="245" x2="1490" y2="245" stroke="#3a4656" stroke-width="8"/>
        <circle cx="1400" cy="300" r="5" fill="#ffd27a" class="flicker"/>
        <circle cx="1400" cy="300" r="14" fill="rgba(255,210,122,0.25)" class="glow"/>
      </g>

      <!-- interior wall -->
      <rect x="0" y="360" width="1600" height="220" fill="url(#${SLUG}_stone)"/>

      <!-- the RELAY plaque: this tower's wall names the OTHER tower's hatch code -->
      <g>
        <rect x="600" y="150" width="380" height="180" rx="8" fill="#141c26" stroke="#c9a227" stroke-width="4"/>
        <text x="790" y="196" text-anchor="middle" font-size="20" fill="#9fc7dd"
          font-family="Consolas, monospace" letter-spacing="2">${otherTowerName().toUpperCase()} HATCH</text>
        <text x="790" y="270" text-anchor="middle" font-size="52" fill="#e8c85a"
          font-family="Consolas, monospace" letter-spacing="8">${relayCode}</text>
        <text x="790" y="308" text-anchor="middle" font-size="13" fill="#7f8a99"
          font-family="Consolas, monospace">read this to your partner</text>
      </g>

      <!-- watch desk + log (below the top-left reserve) -->
      <g>
        <rect x="230" y="600" width="340" height="30" rx="6" fill="#4a3a26"/>
        <rect x="255" y="630" width="26" height="150" fill="#38290f"/>
        <rect x="520" y="630" width="26" height="150" fill="#38290f"/>
        <rect x="300" y="560" width="150" height="48" rx="4" fill="#e8dcc0" transform="rotate(-3 375 584)"/>
        <g stroke="#8a7a50" stroke-width="2" transform="rotate(-3 375 584)">
          <line x1="312" y1="576" x2="438" y2="576"/><line x1="312" y1="588" x2="430" y2="588"/>
        </g>
      </g>

      <!-- cold stove (flavor) -->
      <g>
        <rect x="1320" y="600" width="150" height="180" rx="10" fill="#2b3547" stroke="#141c26" stroke-width="5"/>
        <circle cx="1395" cy="660" r="26" fill="#0a0d11" stroke="#3a4656" stroke-width="5"/>
        <rect x="1385" y="470" width="20" height="130" fill="#2b3547"/>
      </g>

      <!-- the trap-hatch with its 3-dial tide-lock -->
      <g>
        <rect x="640" y="660" width="320" height="170" rx="10" fill="${open ? '#05070d' : '#3a2d1c'}" stroke="#1c1610" stroke-width="6"/>
        ${open
          ? `<text x="800" y="760" text-anchor="middle" font-size="22" fill="#9fc7dd"
               font-family="Consolas, monospace">the stair rises into the dark</text>
             <path d="M700 830 l100 -120 l100 120 z" fill="#05070d"/>`
          : `<g font-family="Consolas, monospace" text-anchor="middle">
               <circle cx="720" cy="745" r="34" fill="#141c26" stroke="#c9a227" stroke-width="4"/>
               <circle cx="800" cy="745" r="34" fill="#141c26" stroke="#c9a227" stroke-width="4"/>
               <circle cx="880" cy="745" r="34" fill="#141c26" stroke="#c9a227" stroke-width="4"/>
               <text x="720" y="753" font-size="30" fill="#e8c85a">${state.flags.watchroom_d0 ?? 0}</text>
               <text x="800" y="753" font-size="30" fill="#e8c85a">${state.flags.watchroom_d1 ?? 0}</text>
               <text x="880" y="753" font-size="30" fill="#e8c85a">${state.flags.watchroom_d2 ?? 0}</text>
               <text x="800" y="700" font-size="15" fill="#7f8a99">STORM-HATCH</text>
             </g>`}
      </g>

      ${markHere ? `
      <!-- bearing-mark S (West only) on the stair newel -->
      <g class="beckon">
        <circle cx="1050" cy="700" r="22" fill="rgba(201,162,39,0.08)" stroke="#c9a227" stroke-width="3"/>
        <text x="1050" y="708" text-anchor="middle" font-size="20" fill="#e8c85a" font-family="Consolas, monospace" font-weight="bold">2</text>
        <text x="1050" y="742" text-anchor="middle" font-size="14" fill="#e8dcc0" font-family="Georgia, serif">brass mark</text>
      </g>` : ''}

      ${towerTag()}
      ${rain(SLUG)}
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const open = hatchOpen(state);

    spots.push({
      id: 'plaque', x: 600, y: 150, w: 380, h: 180, label: `${otherTowerName()} hatch code`,
      onInteract(game) {
        const code = OTHER_CODE[getRole()];
        const html = `<div class="chartcard"><div class="chart-title">${otherTowerName()} storm-hatch</div>
          <p>Chalked on your wall, in the last keeper's hand:</p>
          <p style="font-size:30px;letter-spacing:8px;color:#fff6df;text-align:center;">${code}</p></div>
          <div class="relay">This is <strong>your partner's</strong> hatch code, not yours. Read it to them.</div>`;
        game.journal.add('note_plaque_w', { title: `${otherTowerName()} hatch code`, category: 'note', html });
        game.dialog({ title: `${otherTowerName()} Hatch`, html });
      },
    });

    spots.push({
      id: 'log', x: 250, y: 545, w: 260, h: 90, label: "The keeper's log",
      onInteract(game) {
        const html = `<div class="logbook aged"><div class="log-title">Watch log — left open</div>
          <p>"…the night we lost the <em>Cormorant</em>, the two lights never once agreed.
          Gus flew himself ragged between us and it was not enough. One keeper to a tower is
          not enough. It wants two who will <strong>talk</strong>."</p></div>`;
        game.journal.add('note_cormorant', { title: 'Watch log — the Cormorant', category: 'note', html });
        game.dialog({ title: "The Keeper's Log", html });
      },
    });

    spots.push({
      id: 'window', x: 1130, y: 120, w: 360, h: 250, label: 'The storm window',
      onInteract(game) {
        game.say(isWest()
          ? 'Out past the Kestrel reefs, the Meridian\'s lamp swings low and wild. She has lost her rudder. She has not lost her nerve — not yet.'
          : 'Beyond Gannet Rock the Meridian wallows, her lamp guttering. Every wave sets her closer to the teeth of the bay.');
      },
    });

    spots.push({
      id: 'stove', x: 1320, y: 600, w: 150, h: 180, label: 'The cold stove',
      onInteract(game) { game.say('Dead coals. No time for a fire tonight — the fire that matters is a hundred feet up, and unlit.'); },
    });

    if (isWest() && !state.journal.some(e => e.id === 'mark_s')) {
      spots.push({
        id: 'mark_s', x: 1010, y: 660, w: 90, h: 100, label: 'A brass bearing-mark',
        onInteract(game) {
          game.journal.add('mark_s', { title: 'West Tower — the stair newel', category: 'sun', sun: { rays: 2, letter: 'S' } });
          game.say('A little brass compass-plate, screwed to the newel: bearing 2, and the letter S. One of six — and the crown at the top will want all of them.');
          game.refreshScene();
        },
      });
    }

    if (!open) {
      spots.push({
        id: 'hatch', x: 640, y: 660, w: 320, h: 170, label: 'Storm-hatch — three dials',
        onInteract(game) { openHatch(game); },
      });
    } else {
      spots.push({
        id: 'stair', x: 640, y: 660, w: 320, h: 170, label: 'The stair up',
        onInteract(game) {
          if (isWest() && !game.journal.has('mark_s')) {
            game.say('Before you climb — there is a brass bearing-mark on the newel post. Take it; you will need all six at the top.');
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
      { text: "Your hatch code isn't written anywhere in your own tower. But your wall names your PARTNER's hatch — so their wall names yours. Ask them.", cost: 60 },
      { text: 'Read the code on your wall to your partner (it is theirs). Then set your three dials to the code they read back to you.', cost: 120 },
      { text: isWest() ? 'Your West hatch is 3 - 7 - 1.' : 'Your East hatch is 5 - 2 - 8.', cost: 240 },
    ];
  },
};

function openHatch(game) {
  const role = getRole();
  const target = MY_CODE[role];
  const vals = [
    game.getFlag('watchroom_d0') ?? 0,
    game.getFlag('watchroom_d1') ?? 0,
    game.getFlag('watchroom_d2') ?? 0,
  ];

  game.openPuzzle({
    id: 'watchroom_hatch',
    title: 'The Storm-Hatch',
    render(body, api) {
      body.innerHTML = `
        <p class="puzzle-desc">Three brass dials, 0–9. This tower's code is <em>not</em> on your
        wall — it's on your partner's. Ask them what their wall says about the ${towerName()} hatch.</p>
        <div class="puzzle-row" id="wh-dials"></div>
        <div class="puzzle-row"><button class="btn btn-primary" id="wh-try">Throw the Bolt</button></div>
        <div class="puzzle-feedback"></div>`;
      const row = body.querySelector('#wh-dials');
      vals.forEach((v, i) => {
        const dial = document.createElement('div');
        dial.className = 'dial';
        dial.innerHTML = `
          <button class="dial-btn" data-d="1" aria-label="up">&#9650;</button>
          <div class="dial-face">${v}</div>
          <button class="dial-btn" data-d="-1" aria-label="down">&#9660;</button>`;
        const face = dial.querySelector('.dial-face');
        dial.querySelectorAll('.dial-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            vals[i] = (vals[i] + Number(btn.dataset.d) + 10) % 10;
            face.textContent = String(vals[i]);
            face.classList.remove('tick'); void face.offsetWidth; face.classList.add('tick');
            game.playSfx('click');
            game.setFlag(`watchroom_d${i}`, vals[i]);
          });
        });
        row.appendChild(dial);
      });
      body.querySelector('#wh-try').addEventListener('click', () => {
        if (vals[0] === target[0] && vals[1] === target[1] && vals[2] === target[2]) {
          game.setFlag('watchroom_hatchOpen');
          game.playSfx('unlock');
          api.solved({ message: 'The bolt shoots back and the hatch groans upward. Cold stair-air pours down. Your partner\'s voice was the key.' });
          game.refreshScene();
        } else {
          api.fail('The bolt holds. That is not this tower\'s code — check with your partner.');
        }
      });
    },
  });
}
