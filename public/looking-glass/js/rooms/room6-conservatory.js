// SCENE 6 — The Conservatory (split knowledge: plant tags x the gardener's note).
// Each of your five taps waters one bed — its plant is on a tag in YOUR room.
// Which plants want water is in the gardener's note on the OTHER side.
//   Waking taps: Fern Lily Thorn-apple Rose Moss -> OPEN OPEN SHUT OPEN SHUT
//   Glass  taps: Moss Orchid Hemlock Ivy Fern     -> SHUT OPEN SHUT OPEN OPEN
// Glass (P2) finds mirror-shard S (6).

import { getRole, isWaking, sideName, otherSideName } from '../role.js';
import { defs, backdrop, sideTag, sconce, tint } from '../glasskit.js';
import { dock, DOCK, shadow } from '../../../shared/js/scenekit.js';

const SLUG = 'consv';
const BEDS = { p1: ['Fern', 'Lily', 'Thorn-apple', 'Rose', 'Moss'], p2: ['Moss', 'Orchid', 'Hemlock', 'Ivy', 'Fern'] };
const THIRSTY = { p1: ['Fern', 'Rose', 'Lily'], p2: ['Orchid', 'Ivy', 'Fern'] };   // the gardener's note for each side
const MY_PATTERN = { p1: BEDS.p1.map(b => THIRSTY.p1.includes(b)), p2: BEDS.p2.map(b => THIRSTY.p2.includes(b)) };
// shown on THIS screen: the gardener's note for the OTHER side's beds
function noteFor(role) {
  const o = role === 'p1' ? 'p2' : 'p1';
  const dry = BEDS[o].filter(b => !THIRSTY[o].includes(b));
  return { water: THIRSTY[o], never: dry };
}
const fmtNote = (n) => `WATER the ${n.water.map(w => w.toLowerCase()).join(', the ')}. NEVER the ${n.never.map(w => w.toLowerCase()).join('; never the ')}.`;

// On the conservatory plate: the glazed double doors in the back arch are the
// far door; the floor starts below the step (about y 694), so the basin sits
// there; the fern's pot (rim about y 664) is left of it. The taps stand on the basin's near
// rim so they never hide the door.
const DOOR = { x: 711, y: 425, w: 120, h: 227 };
const POOL = { cx: 780, cy: 770, rx: 300, ry: 56 };
const TAP_X = [560, 670, 780, 890, 1000];
const rimY = x => POOL.cy + (POOL.ry + 8) * Math.sqrt(Math.max(0, 1 - ((x - POOL.cx) / (POOL.rx + 9)) ** 2));
const TAPS = { x: 500, y: 690, w: 560, h: 180 };
const SHARD = { x: 530, y: 596, w: 100, h: 90 };

function done(state) { return !!state.flags.conservatory_done; }

export default {
  id: 'conservatory',
  solution: role => MY_PATTERN[role].map(o => (o ? 'OPEN' : 'SHUT')).join(' '),
  lintStates: [{ label: 'solved', flags: { conservatory_done: true } }],
  get title() { return `${sideName()} · The Conservatory`; },
  get intro() {
    return 'A glass conservatory, moon or mirror-light pouring through the panes, a dry mirror-pool at its centre with five brass taps around the rim. Set them right and the pool fills and the far door unseals. Which taps run and which stay shut is in the gardener\'s note your partner carries, not here.';
  },

  scene(state) {
    const t = tint();
    const fin = done(state);
    const markHere = getRole() === 'p2' && !state.journal.some(e => e.id === 'shard_s');
    const v = [0, 1, 2, 3, 4].map(i => state.flags[`consv_v${i}`] ? true : false);
    const note = noteFor(getRole());
    const beds = BEDS[getRole()];
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}</defs>
      ${backdrop(SLUG)}
      ${sconce(SLUG, 478, 712, 'stand')}

      <!-- the far door: the glazed double doors in the back arch, sealed -->
      <g data-mount="wall">
        ${fin
          ? `<rect data-fx="light" x="${DOOR.x + DOOR.w / 2 - 14}" y="${DOOR.y + 6}" width="28" height="${DOOR.h - 8}" fill="${isWaking() ? 'rgba(255,207,138,0.35)' : 'rgba(201,214,230,0.35)'}" class="glow"/>
             <path d="M${DOOR.x + DOOR.w / 2 - 14} ${DOOR.y + 6} L${DOOR.x + 8} ${DOOR.y - 4} L${DOOR.x + 8} ${DOOR.y + DOOR.h + 6} L${DOOR.x + DOOR.w / 2 - 14} ${DOOR.y + DOOR.h} Z" fill="#0b0f14" opacity="0.55"/>`
          : `<rect x="${DOOR.x + 4}" y="${DOOR.y + DOOR.h * 0.52}" width="${DOOR.w - 8}" height="12" rx="3" fill="url(#sk_iron)" stroke="#0a0c10" stroke-width="2"/>
             <circle cx="${DOOR.x + DOOR.w / 2}" cy="${DOOR.y + DOOR.h * 0.52 + 6}" r="15" fill="url(#sk_brass)" stroke="#3a2a0c" stroke-width="2"/>
             <circle cx="${DOOR.x + DOOR.w / 2}" cy="${DOOR.y + DOOR.h * 0.52 + 6}" r="6" fill="none" stroke="#3a2a0c" stroke-width="2"/>`}
      </g>

      <!-- the mirror-pool: a stone basin on the floor, five taps on its near rim -->
      <g data-mount="floor">
        ${shadow(POOL.cx, POOL.cy + POOL.ry + 34, POOL.rx + 30, 16)}
        <path d="M${POOL.cx - POOL.rx - 18} ${POOL.cy} L${POOL.cx - POOL.rx - 18} ${POOL.cy + 30} A${POOL.rx + 18} ${POOL.ry + 16} 0 0 0 ${POOL.cx + POOL.rx + 18} ${POOL.cy + 30} L${POOL.cx + POOL.rx + 18} ${POOL.cy} Z" fill="url(#sk_stone)" stroke="#0d0f12" stroke-width="2"/>
        <path d="M${POOL.cx - POOL.rx - 18} ${POOL.cy} L${POOL.cx - POOL.rx - 18} ${POOL.cy + 30} A${POOL.rx + 18} ${POOL.ry + 16} 0 0 0 ${POOL.cx + POOL.rx + 18} ${POOL.cy + 30} L${POOL.cx + POOL.rx + 18} ${POOL.cy} Z" fill="#000" opacity="0.35"/>
        <ellipse cx="${POOL.cx}" cy="${POOL.cy}" rx="${POOL.rx + 18}" ry="${POOL.ry + 16}" fill="url(#sk_stone)" stroke="#0d0f12" stroke-width="2"/>
        <ellipse cx="${POOL.cx}" cy="${POOL.cy + 2}" rx="${POOL.rx}" ry="${POOL.ry}" fill="#0b0e13"/>
        ${fin
          ? `<ellipse data-fx="water" cx="${POOL.cx}" cy="${POOL.cy + 2}" rx="${POOL.rx - 4}" ry="${POOL.ry - 4}" fill="rgba(159,199,221,0.28)"/>
`
          : `<path d="M${POOL.cx - 120} ${POOL.cy - 10} l40 14 l30 -8 l50 18 M${POOL.cx + 60} ${POOL.cy - 30} l28 20 l40 -4" fill="none" stroke="#2a2f38" stroke-width="2"/>`}
        ${v.map((open, i) => {
          const x = TAP_X[i], b = rimY(x);
          return `
          <rect x="${x - 9}" y="${b - 74}" width="18" height="74" rx="4" fill="url(#sk_brass)" stroke="#3a2a0c" stroke-width="2"/>
          <path d="M${x} ${b - 72} q0 -22 -24 -22 l0 10" fill="none" stroke="#b08a3e" stroke-width="7" stroke-linecap="round"/>
          <circle cx="${x}" cy="${b - 44}" r="14" fill="${open ? '#8fd0c0' : '#5a5468'}" stroke="#0a0810" stroke-width="2"/>
          <line x1="${x - 10}" y1="${b - 44}" x2="${x + 10}" y2="${b - 44}" stroke="#0a0810" stroke-width="3" transform="rotate(${open ? 90 : 0} ${x} ${b - 44})"/>
          <text x="${x}" y="${b - 104}" text-anchor="middle" font-size="12" fill="${open ? '#8fd0c0' : '#9fa8bd'}" font-family="Consolas, monospace">${open ? 'OPEN' : 'SHUT'}</text>
          <rect x="${x - 44}" y="${b + 10}" width="88" height="24" rx="3" fill="url(#sk_brass)" stroke="#3a2a0c" stroke-width="1.5"/>
          <text x="${x}" y="${b + 27}" text-anchor="middle" font-size="12" fill="#2a1d05" font-family="Georgia, serif">${beds[i]}</text>`;
        }).join('')}
      </g>

      <!-- the gardener's note for the OTHER side's beds — in your pocket-book -->
      ${dock({ x: 1120, y: 180, w: 400, h: 150 }, `
        <text x="1320" y="214" text-anchor="middle" font-size="15" fill="#4a3a22" font-family="Georgia, serif" letter-spacing="1">GARDENER'S NOTE — ${otherSideName().toUpperCase()}</text>
        <text x="1320" y="250" text-anchor="middle" font-size="15" fill="#26221a" font-family="Georgia, serif">water: ${note.water.join(' · ')}</text>
        <text x="1320" y="278" text-anchor="middle" font-size="15" fill="#7a1f2b" font-family="Georgia, serif">never: ${note.never.join(' · ')}</text>
        <text x="1320" y="310" text-anchor="middle" font-size="12" fill="#6b5a3a" font-family="Consolas, monospace">read to your partner</text>`, { kind: 'notebook', title: 'POCKET-BOOK' })}

      ${markHere ? `
      <g class="beckon">
        <polygon points="558,668 566,626 588,618 602,644 596,668" fill="rgba(201,204,214,0.18)" stroke="#c9ccd6" stroke-width="2.5"/>
        <text x="581" y="652" text-anchor="middle" font-size="16" fill="#dfe6f2" font-family="Consolas, monospace" font-weight="bold">6</text>
      </g>` : ''}

      ${sideTag()}
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const role = getRole();

    spots.push({
      id: 'plaque', ...DOCK, label: `The gardener's note for ${otherSideName()}`,
      onInteract(game) {
        const note = noteFor(role);
        const html = `<div class="cipher"><div class="cipher-title">Gardener's note — ${otherSideName()}</div>
          <p style="text-align:center;font-size:18px;color:#f2ecdb;">${fmtNote(note)}</p></div>
          <div class="relay">This is for your <strong>partner's</strong> beds. Their taps carry plant tags you cannot see — read them the note; they will know which taps to run.</div>`;
        game.journal.add('note_tapplaque', { title: `Gardener's note (${otherSideName()})`, category: 'note', html });
        game.dialog({ title: "The Gardener's Note", html });
      },
    });

    if (role === 'p2' && !state.journal.some(e => e.id === 'shard_s')) {
      spots.push({
        id: 'shard_s', ...SHARD, label: 'A mirror-shard',
        onInteract(game) {
          game.journal.add('shard_s', { title: 'Conservatory — in the fern pot', category: 'sun', sun: { rays: 6, letter: 'S' } });
          game.say('Pushed into the soil of the fern\'s pot: a mirror-shard, numbered 6, letter S. The last one on your side. Kept.');
          game.refreshScene();
        },
      });
    }

    if (!done(state)) {
      spots.push({
        id: 'taps', ...TAPS, label: 'The five taps',
        onInteract(game) { openTaps(game); },
      });
    } else {
      spots.push({
        id: 'out', ...DOOR, label: 'The far door',
        onInteract(game) {
          if (role === 'p2' && !game.journal.has('shard_s')) { game.say('The last shard is in the fern\'s pot — take it before you go.'); return; }
          game.completeRoom({ delay: 600 });
        },
      });
    }

    return spots;
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: 'Each of your taps waters the bed on its tag. Which plants want water is in the gardener\'s note — on your partner\'s side.', cost: 60 },
      { text: 'Ask your partner to read you the gardener\'s note. Open the taps whose plant wants water; shut the rest.', cost: 120 },
      { text: isWaking() ? 'Waking taps: OPEN, OPEN, SHUT, OPEN, SHUT (fern, lily, rose run).' : 'Glass taps: SHUT, OPEN, SHUT, OPEN, OPEN (orchid, ivy, fern run).', cost: 240 },
    ];
  },
};

function openTaps(game) {
  const role = getRole();
  const target = MY_PATTERN[role];
  const v = [0, 1, 2, 3, 4].map(i => game.getFlag(`consv_v${i}`) ? true : false);

  game.openPuzzle({
    id: 'conservatory_taps',
    title: 'Set the Taps',
    render(body, api) {
      body.innerHTML = `
        <div class="puzzle-hero" style="background-image:url(art/pz-taps.webp)"></div>
        <p class="puzzle-desc">Open or shut each of the five taps to match your pool's pattern —
        drawn on your partner's plaque. Click a tap to flip it.</p>
        <div class="puzzle-row" id="cv-taps"></div>
        <div class="puzzle-row"><button class="btn btn-primary" id="cv-run">Fill the Pool</button></div>
        <div class="puzzle-feedback"></div>`;
      const row = body.querySelector('#cv-taps');
      const render = () => {
        row.innerHTML = '';
        v.forEach((open, i) => {
          const lever = document.createElement('div');
          lever.className = 'lever' + (open ? '' : ' down');
          lever.innerHTML = `<div class="lever-track"><div class="lever-knob"></div></div>
            <div class="lever-label">${i + 1}: ${open ? 'OPEN' : 'SHUT'}</div>`;
          lever.addEventListener('click', () => { v[i] = !v[i]; game.setFlag(`consv_v${i}`, v[i]); game.playSfx('click'); render(); });
          row.appendChild(lever);
        });
      };
      render();
      body.querySelector('#cv-run').addEventListener('click', () => {
        if (v.every((o, i) => o === target[i])) {
          game.setFlag('conservatory_done');
          game.playSfx('solve');
          api.solved({ message: 'Water climbs the pipes and the pool fills to a perfect still mirror. The far door sighs open on the last dark hall.' });
          game.refreshScene();
        } else {
          api.fail('The pool runs uneven — a tap is wrong. Recheck the plaque with your partner.');
        }
      });
    },
  });
}
