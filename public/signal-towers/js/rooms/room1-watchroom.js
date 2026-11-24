// SCENE 1 — The Watch Room (tutorial · cross-read combination).
// Each tower's trap-hatch code is posted on the OTHER tower's wall.
//   West hatch = 3-7-1 (posted on the East wall / P2 screen)
//   East hatch = 5-2-8 (posted on the West wall / P1 screen)
// West (P1) also finds bearing-mark S (needle NE).

import { getRole, isWest, towerName, otherTowerName } from '../role.js';
import { defs, backdrop, rainOutside, interior, bearingOf, towerTag } from '../scenekit.js';
import { panel, shadow } from '../../../shared/js/scenekit.js';

const SLUG = 'watch';
// The code the OTHER tower's wall reveals (i.e. what THIS player reads to their partner).
const OTHER_CODE = { p1: '5 · 2 · 8', p2: '3 · 7 · 1' };   // West wall names EAST hatch; East wall names WEST hatch
// This tower's own hatch solution (never shown on this screen).
const MY_CODE = { p1: [3, 7, 1], p2: [5, 2, 8] };

// Inside the watch room: an arched window onto the storm (right of centre), the
// slate on the wall, the desk and stove on the floor, and the storm-hatch — an
// iron door at the foot of the stair — in the back wall with the newel beside it.
const FLOOR = 700;
const WIN = { x: 1010, y: 110, w: 360, h: 330 };
const SLATE = { x: 250, y: 200, w: 340, h: 180 };
const DESK_FOOT = 760;
const DOOR = { x: 650, y: 300, w: 270, h: 400 };
const DIALS_Y = 560;
const NEWEL = { x: 948, y: 450, w: 38 };
const MARK = { x: 922, y: 515, w: 90, h: 90 };

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
      ${interior(SLUG, { window: { ...WIN, shape: 'arch' }, floorY: FLOOR })}

      <!-- through the window: the Meridian's lamp, low and wild -->
      <g clip-path="url(#${SLUG}_win)">
        <circle cx="1270" cy="330" r="5" fill="#ffd27a" class="flicker"/>
        <circle cx="1270" cy="330" r="14" fill="rgba(255,210,122,0.25)" class="glow"/>
      </g>

      <!-- the slate on the wall: the OTHER tower's hatch code, chalked by the last keeper -->
      ${panel({ ...SLATE, material: 'slate', mount: 'nails', body: `
        <text x="${SLATE.x + SLATE.w / 2}" y="${SLATE.y + 44}" text-anchor="middle" font-size="19" fill="#c8d4dc" font-family="Consolas, monospace" letter-spacing="2">${otherTowerName().toUpperCase()} HATCH</text>
        <text x="${SLATE.x + SLATE.w / 2}" y="${SLATE.y + 116}" text-anchor="middle" font-size="50" fill="#eef2f4" font-family="Consolas, monospace" letter-spacing="8">${relayCode}</text>
        <text x="${SLATE.x + SLATE.w / 2}" y="${SLATE.y + 154}" text-anchor="middle" font-size="13" fill="#a9b6c0" font-family="Consolas, monospace">read this to your partner</text>` })}

      <!-- the watch desk, standing on the floor, with the log open on it -->
      <g data-mount="floor">
        ${shadow(400, DESK_FOOT + 4, 190, 12)}
        <rect x="236" y="604" width="26" height="${DESK_FOOT - 604}" fill="#38290f"/>
        <rect x="538" y="604" width="26" height="${DESK_FOOT - 604}" fill="#38290f"/>
        <rect x="220" y="586" width="360" height="26" rx="5" fill="url(#sk_wood)" stroke="#1c120a" stroke-width="2"/>
        ${shadow(375, 588, 90, 5, 0.5)}
        <rect x="300" y="548" width="150" height="40" rx="3" fill="#e8dcc0" stroke="#8a7a50" stroke-width="1.5"/>
        <line x1="375" y1="548" x2="375" y2="588" stroke="#8a7a50" stroke-width="2"/>
        <g stroke="#8a7a50" stroke-width="2"><line x1="312" y1="562" x2="364" y2="562"/><line x1="312" y1="574" x2="360" y2="574"/><line x1="386" y1="562" x2="438" y2="562"/></g>
      </g>

      <!-- cold stove on the floor, its flue up the wall -->
      <g data-mount="floor">
        ${shadow(1470, FLOOR + 50, 90, 12)}
        <rect x="1462" y="80" width="18" height="${FLOOR - 80 - 120}" fill="url(#sk_iron)"/>
        <rect x="1400" y="${FLOOR - 130}" width="140" height="170" rx="10" fill="url(#sk_iron)" stroke="#0c0f13" stroke-width="4"/>
        <circle cx="1470" cy="${FLOOR - 60}" r="24" fill="#0a0d11" stroke="#3a4656" stroke-width="5"/>
      </g>

      <!-- the storm-hatch: an iron door at the foot of the stair, three tide-dials on it -->
      ${open
        ? `<g data-mount="wall">
             <rect x="${DOOR.x}" y="${DOOR.y}" width="${DOOR.w}" height="${DOOR.h}" fill="#05070d"/>
             ${[0, 1, 2, 3, 4].map(i => `<rect x="${DOOR.x + 30 + i * 22}" y="${DOOR.y + DOOR.h - 40 - i * 60}" width="${DOOR.w - 60 - i * 44}" height="14" fill="#1a2029"/>`).join('')}
             <path d="M${DOOR.x + DOOR.w} ${DOOR.y} L${DOOR.x + DOOR.w + 40} ${DOOR.y - 14} L${DOOR.x + DOOR.w + 40} ${DOOR.y + DOOR.h + 12} L${DOOR.x + DOOR.w} ${DOOR.y + DOOR.h} Z" fill="url(#sk_iron)" stroke="#0c0f13" stroke-width="3"/>
           </g>`
        : panel({ ...DOOR, material: 'iron', mount: 'inset', body: `
            ${[0.25, 0.75].map(f => `<line x1="${DOOR.x + 8}" y1="${DOOR.y + DOOR.h * f}" x2="${DOOR.x + DOOR.w - 8}" y2="${DOOR.y + DOOR.h * f}" stroke="#0c0f13" stroke-width="6"/>`).join('')}
            <g font-family="Consolas, monospace" text-anchor="middle">
              <text x="${DOOR.x + DOOR.w / 2}" y="${DIALS_Y - 50}" font-size="15" fill="#9fc7dd">STORM-HATCH</text>
              ${[0, 1, 2].map(i => `
                <circle cx="${DOOR.x + DOOR.w / 2 + (i - 1) * 80}" cy="${DIALS_Y}" r="34" fill="#141c26" stroke="#c9a227" stroke-width="4"/>
                <text x="${DOOR.x + DOOR.w / 2 + (i - 1) * 80}" y="${DIALS_Y + 10}" font-size="30" fill="#e8c85a">${state.flags['watchroom_d' + i] ?? 0}</text>`).join('')}
            </g>` })}

      <!-- the stair newel beside the door -->
      <g data-mount="floor">
        <rect x="${NEWEL.x}" y="${NEWEL.y}" width="${NEWEL.w}" height="${FLOOR + 20 - NEWEL.y}" rx="4" fill="url(#sk_darkwood)" stroke="#0b0703" stroke-width="2"/>
        <rect x="${NEWEL.x - 6}" y="${NEWEL.y - 12}" width="${NEWEL.w + 12}" height="16" rx="4" fill="url(#sk_darkwood)" stroke="#0b0703" stroke-width="2"/>
      </g>

      ${markHere ? `
      <!-- bearing-mark S (West only) screwed to the newel -->
      <g class="beckon">
        <circle cx="${NEWEL.x + NEWEL.w / 2}" cy="560" r="20" fill="url(#sk_brass)" stroke="#c9a227" stroke-width="3"/>
        <text x="${NEWEL.x + NEWEL.w / 2}" y="567" text-anchor="middle" font-size="16" fill="#2a1d05" font-family="Consolas, monospace" font-weight="bold">${bearingOf(2)}</text>
      </g>` : ''}

      ${towerTag()}
      ${rainOutside(SLUG)}
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const open = hatchOpen(state);

    spots.push({
      id: 'plaque', ...SLATE, label: `${otherTowerName()} hatch code`,
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
      id: 'log', x: 230, y: 530, w: 300, h: 90, label: "The keeper's log",
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
      id: 'window', ...WIN, label: 'The storm window',
      onInteract(game) {
        game.say(isWest()
          ? 'Out past the Kestrel reefs, the Meridian\'s lamp swings low and wild. She has lost her rudder. She has not lost her nerve — not yet.'
          : 'Beyond Gannet Rock the Meridian wallows, her lamp guttering. Every wave sets her closer to the teeth of the bay.');
      },
    });

    spots.push({
      id: 'stove', x: 1400, y: FLOOR - 130, w: 140, h: 170, label: 'The cold stove',
      onInteract(game) { game.say('Dead coals. No time for a fire tonight — the fire that matters is a hundred feet up, and unlit.'); },
    });

    if (isWest() && !state.journal.some(e => e.id === 'mark_s')) {
      spots.push({
        id: 'mark_s', ...MARK, label: 'A brass bearing-mark',
        onInteract(game) {
          game.journal.add('mark_s', { title: 'West Tower — the stair newel', category: 'sun', sun: { rays: 2, letter: 'S' } });
          game.say(`A little brass compass-plate, screwed to the newel: its needle points ${bearingOf(2)}, and under it the letter S. One of six — and the crown at the top will want all of them.`);
          game.refreshScene();
        },
      });
    }

    if (!open) {
      spots.push({
        id: 'hatch', ...DOOR, label: 'Storm-hatch — three dials',
        onInteract(game) { openHatch(game); },
      });
    } else {
      spots.push({
        id: 'stair', ...DOOR, label: 'The stair up',
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
        <div class="puzzle-hero" style="background-image:url(art/pz-dials.webp)"></div>
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
