// SCENE 6 — The Conservatory (tap pattern; the plan is on the partner's plaque).
// Set your five fountain-taps to the pattern drawn on the OTHER side's plaque.
//   Waking: OPEN SHUT OPEN OPEN SHUT     Glass: SHUT OPEN OPEN SHUT OPEN
// Glass (P2) finds mirror-shard S (6).

import { getRole, isWaking, sideName, otherSideName } from '../role.js';
import { defs, backdrop, sideTag, sconce, tint } from '../glasskit.js';

const SLUG = 'consv';
const MY_PATTERN = { p1: [true, false, true, true, false], p2: [false, true, true, false, true] };
function plaqueFor(role) { return role === 'p1' ? MY_PATTERN.p2 : MY_PATTERN.p1; }
const fmt = (a) => a.map(o => o ? 'OPEN' : 'SHUT').join(' · ');

function done(state) { return !!state.flags.conservatory_done; }

export default {
  id: 'conservatory',
  get title() { return `${sideName()} · The Conservatory`; },
  get intro() {
    return 'A glass conservatory, moon or mirror-light pouring through the panes, a dry mirror-pool at its centre with five brass taps around the rim. Set them right and the pool fills and the far door unseals. Which taps run and which stay shut is drawn on the plaque in the other room, not this one.';
  },

  scene(state) {
    const t = tint();
    const fin = done(state);
    const markHere = getRole() === 'p2' && !state.journal.some(e => e.id === 'shard_s');
    const v = [0, 1, 2, 3, 4].map(i => state.flags[`consv_v${i}`] ? true : false);
    const sch = plaqueFor(getRole());
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}</defs>
      ${backdrop(SLUG)}
      ${sconce(SLUG, 240, 300)}

      <!-- the mirror-pool -->
      <ellipse cx="700" cy="640" rx="260" ry="90" fill="${fin ? 'rgba(159,199,221,0.16)' : '#0e1622'}" stroke="${t.accentDim}" stroke-width="5"/>
      ${fin ? `<text x="700" y="648" text-anchor="middle" font-size="16" fill="${t.accent}" font-family="Georgia, serif">the pool fills, still as a mirror</text>` : ''}

      <!-- five taps -->
      ${v.map((open, i) => {
        const x = 500 + i * 100;
        return `<g>
          <rect x="${x - 16}" y="440" width="32" height="90" rx="8" fill="${t.panel}" stroke="${t.accentDim}" stroke-width="3"/>
          <circle cx="${x}" cy="${open ? 456 : 512}" r="15" fill="${open ? '#8fd0c0' : '#5a5468'}" stroke="#0a0810" stroke-width="2"/>
          <text x="${x}" y="560" text-anchor="middle" font-size="12" fill="#9fa8bd" font-family="Consolas, monospace">${i + 1}</text>
          <text x="${x}" y="428" text-anchor="middle" font-size="11" fill="${open ? '#8fd0c0' : '#7f7a8a'}" font-family="Consolas, monospace">${open ? 'OPEN' : 'SHUT'}</text>
        </g>`;
      }).join('')}

      <!-- the partner's plaque -->
      <g>
        <rect x="1120" y="180" width="400" height="150" rx="8" fill="${t.panel}" stroke="${t.accentDim}" stroke-width="3"/>
        <text x="1320" y="222" text-anchor="middle" font-size="15" fill="${t.accentDim}" font-family="Georgia, serif" letter-spacing="1">${otherSideName().toUpperCase()} — TAP PLAQUE</text>
        <text x="1320" y="272" text-anchor="middle" font-size="18" fill="${t.accent}" font-family="Consolas, monospace">${fmt(sch)}</text>
        <text x="1320" y="306" text-anchor="middle" font-size="12" fill="#9fa8bd" font-family="Consolas, monospace">taps 1–5 · read to your partner</text>
      </g>

      ${markHere ? `
      <g class="beckon">
        <polygon points="1030,660 1075,652 1082,696 1060,730 1028,720 1020,684" fill="rgba(201,204,214,0.10)" stroke="#c9ccd6" stroke-width="2.5"/>
        <text x="1050" y="696" text-anchor="middle" font-size="18" fill="#dfe6f2" font-family="Consolas, monospace" font-weight="bold">6</text>
      </g>` : ''}

      ${sideTag()}
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const role = getRole();

    spots.push({
      id: 'plaque', x: 1120, y: 180, w: 400, h: 150, label: `${otherSideName()} tap plaque`,
      onInteract(game) {
        const sch = plaqueFor(role);
        const html = `<div class="cipher"><div class="cipher-title">${otherSideName()} — tap plaque</div>
          <p style="text-align:center;font-size:18px;color:#f2ecdb;letter-spacing:2px;">${fmt(sch)}</p>
          <p style="text-align:center;color:#9fa8bd;">taps 1 → 5</p></div>
          <div class="relay">This is your <strong>partner's</strong> tap pattern. Read them the five taps in order; ask them to read you yours.</div>`;
        game.journal.add('note_tapplaque', { title: `${otherSideName()} tap plaque`, category: 'note', html });
        game.dialog({ title: 'The Tap Plaque', html });
      },
    });

    if (role === 'p2' && !state.journal.some(e => e.id === 'shard_s')) {
      spots.push({
        id: 'shard_s', x: 1010, y: 640, w: 90, h: 100, label: 'A mirror-shard',
        onInteract(game) {
          game.journal.add('shard_s', { title: 'Conservatory — in the dry pool', category: 'sun', sun: { rays: 6, letter: 'S' } });
          game.say('At the bottom of the dry pool: a mirror-shard, numbered 6, letter S. The last one on your side. Kept.');
          game.refreshScene();
        },
      });
    }

    if (!done(state)) {
      spots.push({
        id: 'taps', x: 470, y: 420, w: 480, h: 150, label: 'The five taps',
        onInteract(game) { openTaps(game); },
      });
    } else {
      spots.push({
        id: 'out', x: 1000, y: 470, w: 300, h: 340, label: 'The far door',
        onInteract(game) {
          if (role === 'p2' && !game.journal.has('shard_s')) { game.say('The last shard is in the dry pool — take it before you go.'); return; }
          game.completeRoom({ delay: 600 });
        },
      });
    }

    return spots;
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: 'The tap pattern for your pool is on your partner\'s plaque, not yours. So theirs is on yours. Trade patterns.', cost: 60 },
      { text: 'Five taps, open or shut. Read the five on your plaque to your partner; set the five they read you.', cost: 120 },
      { text: isWaking() ? 'Waking taps: OPEN, SHUT, OPEN, OPEN, SHUT.' : 'Glass taps: SHUT, OPEN, OPEN, SHUT, OPEN.', cost: 240 },
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
