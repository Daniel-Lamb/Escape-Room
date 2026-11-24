// ROOM 2 — The Hall of the Scales. The weighing of the heart.
// Puzzle: balance Ma'at's scale. The stone heart weighs 13 deben. The feather's
// pan has THREE CUPS and none may stand empty, so exactly three weight-stones
// from {1,2,4,7,9} must total 13. Unique: 2 + 4 + 7. (With the 9 in, two more
// stones would have to make 4 — and 1+3 needs a 3 that isn't there; 4+9 alone
// leaves a cup empty.)
// Reward: amulet (feather sign, H, 4 beads).

import { kitDefs, panel, shadow, pedestal, plateHero } from '../../../shared/js/scenekit.js';

const HEART = 13;
const STONES = [1, 2, 4, 7, 9];
const CUPS = 3;

function balanced(state) { return !!state.flags.scales_balanced; }

// Layout — the plate (art/scales.webp): a hypostyle hall, columns either side,
// standing braziers, a doorway at the far end of the aisle, reliefs on the
// left wall. The balance stands on a pedestal in the aisle, left of centre.
const SCALE = { cx: 600, beamY: 330, topY: 600, floorY: 800 };
const TABLE = { x: 1000, y: 690, w: 250 };
const MAAT = { cx: 1400, cy: 330 };
const CARVE = { x: 60, y: 560, w: 470, h: 130 };
const EXIT = { x: 792, y: 430, w: 116, h: 140 };

export default {
  id: 'scales',
  solution: () => {
    // the CUPS stones that weigh exactly the heart
    const pick = (from, n, sum) => (n === 0 ? (sum === 0 ? [] : null) : from.reduce((hit, s, i) => hit || ((r) => r && [s, ...r])(pick(from.slice(i + 1), n - 1, sum - s)), null));
    return (pick(STONES, CUPS, HEART) || ['no stones balance the heart']).map(String);
  },
  title: 'The Hall of the Scales',
  intro: 'A long hall of columns, and in its aisle a great balance of black granite — the scale of Ma\'at, on which the dead are weighed. One pan holds a carved stone heart; the other hangs empty and high, three little cups cut into it. A stone table of weights waits beside it.',
  lintStates: [{ label: 'balanced', flags: { scales_balanced: true } }],

  scene(state) {
    const done = balanced(state);
    const amuletHere = done && !state.journal?.some?.(e => e.id === 'amulet_scales');
    const tilt = done ? 0 : -12;   // the heart (left) hangs heavy until balanced
    const S = SCALE;
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${kitDefs()}
        <radialGradient id="gd_sc_torch" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(255,178,77,0.4)"/><stop offset="1" stop-color="rgba(255,178,77,0)"/>
        </radialGradient>
      </defs>
      <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="art/scales.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="art/scales.mp4" type="video/mp4"/></video></foreignObject>
      <ellipse cx="260" cy="480" rx="160" ry="130" fill="url(#gd_sc_torch)" class="glow"/>
      <ellipse cx="1300" cy="480" rx="160" ry="130" fill="url(#gd_sc_torch)" class="glow"/>

      <!-- Ma'at with her feather, carved in relief on the great right-hand column -->
      <g data-mount="inset" transform="translate(${MAAT.cx} ${MAAT.cy})">
        <ellipse cx="0" cy="0" rx="54" ry="118" fill="#000" opacity="0.35"/>
        <path d="M-18 100 L-14 -40 Q0 -70 14 -40 L18 100 Z" fill="#3a2a12" stroke="#d4a72a" stroke-width="2"/>
        <circle cx="0" cy="-58" r="14" fill="#3a2a12" stroke="#d4a72a" stroke-width="2"/>
        <path d="M6 -72 Q22 -110 10 -128 Q2 -100 6 -72Z" fill="#5aa0d0" stroke="#d4a72a" stroke-width="1"/>
        <path d="M14 -20 l36 -20" stroke="#d4a72a" stroke-width="3"/>
      </g>

      <!-- the balance of Ma'at on its granite pedestal in the aisle -->
      ${pedestal({ cx: S.cx, topY: S.topY, floorY: S.floorY, w: 170, material: 'basalt' })}
      <g data-mount="post">
        <rect x="${S.cx - 8}" y="${S.beamY}" width="16" height="${S.topY - S.beamY}" fill="#2a2a2f"/>
        <g transform="translate(${S.cx} ${S.beamY}) rotate(${tilt})">
          <rect x="-240" y="-8" width="480" height="16" rx="6" fill="#3a3a40"/>
          <circle cx="0" cy="0" r="12" fill="#d4a72a"/>
          <!-- left pan: the heart -->
          <line x1="-220" y1="0" x2="-220" y2="70" stroke="#555" stroke-width="3"/>
          <path d="M-280 70 a60 22 0 0 0 120 0 z" fill="#3a3a40"/>
          <path d="M-220 40 q-22 -26 -44 -4 q-10 14 44 40 q54 -26 44 -40 q-22 -22 -44 4z" fill="#7a1f2b" stroke="#d4a72a" stroke-width="1.5"/>
          <!-- right pan: the feather's pan, three cups cut in it -->
          <line x1="220" y1="0" x2="220" y2="70" stroke="#555" stroke-width="3"/>
          <path d="M160 70 a60 22 0 0 0 120 0 z" fill="#3a3a40"/>
          ${[-34, 0, 34].map((dx, i) => `
            <ellipse cx="${220 + dx}" cy="74" rx="13" ry="6" fill="#141418" stroke="#d4a72a" stroke-width="1.2"/>
            ${done ? `<rect x="${220 + dx - 9}" y="58" width="18" height="14" rx="3" fill="#d4a72a"/>` : ''}`).join('')}
        </g>
        ${amuletHere ? `<g class="beckon">
          <rect x="${S.cx - 50}" y="${S.topY + 70}" width="100" height="70" rx="6" fill="#0a0703" stroke="#d4a72a" stroke-width="3"/>
          <g transform="translate(${S.cx} ${S.topY + 104})"><ellipse cx="0" cy="0" rx="18" ry="24" fill="#2f6fb0" stroke="#f2d774" stroke-width="3"/><circle cx="0" cy="-28" r="7" fill="#f2d774"/></g>
        </g>` : ''}
      </g>

      <!-- the carved truth, cut into the reliefs of the left wall -->
      ${panel({ ...CARVE, material: 'sandstone', mount: 'inset', rx: 4, body: `
        <g font-family="var(--serif, Georgia, serif)" fill="#2e2210" font-style="italic">
          <text x="${CARVE.x + 18}" y="${CARVE.y + 34}" font-size="19">"The heart weighs thirteen deben.</text>
          <text x="${CARVE.x + 18}" y="${CARVE.y + 66}" font-size="19">Three cups has the feather's pan, and none</text>
          <text x="${CARVE.x + 18}" y="${CARVE.y + 98}" font-size="19">stands empty. Make the feather its equal."</text>
        </g>` })}

      <!-- the weight-stones on a low stone table beside the scale -->
      <g data-mount="floor">
        ${shadow(TABLE.x + TABLE.w / 2, TABLE.y + 92, TABLE.w * 0.55, 10)}
        ${[TABLE.x + 20, TABLE.x + TABLE.w - 34].map(x => `<rect x="${x}" y="${TABLE.y + 12}" width="14" height="80" fill="url(#sk_basalt)"/>`).join('')}
        <rect x="${TABLE.x}" y="${TABLE.y}" width="${TABLE.w}" height="16" rx="3" fill="url(#sk_basalt)" stroke="#14130f" stroke-width="2"/>
        ${STONES.map((w, i) => `<g transform="translate(${TABLE.x + 26 + i * 48} ${TABLE.y - 16})"><rect x="-20" y="-16" width="40" height="32" rx="5" fill="#3a2a12" stroke="#d4a72a" stroke-width="1.5"/><text x="0" y="6" text-anchor="middle" font-size="17" fill="#f2d774" font-family="var(--serif, Georgia, serif)">${w}</text></g>`).join('')}
      </g>

      <path d="M0 900 L0 856 Q800 894 1600 856 L1600 900 Z" fill="#050301"/>
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const done = balanced(state);
    spots.push({ id: 'inscription', ...CARVE, label: 'The carved truth',
      onInteract(game) {
        game.journal.add('note_scales', { title: 'The Hall of the Scales', category: 'note',
          html: '<p>"The heart weighs thirteen deben. Three cups has the feather\'s pan, and none stands empty. Make the feather its equal."</p>' });
        game.say('"Three cups has the feather\'s pan, and none stands empty." Thirteen exactly — and in exactly three stones. Copied to your palette.');
      } });
    spots.push({ id: 'maat', x: MAAT.cx - 70, y: MAAT.cy - 140, w: 140, h: 260, label: 'Ma\'at and her feather',
      onInteract(game) { game.say('Ma\'at, truth herself, holds out the feather your weights must match. She does not look like she grades on a curve.'); } });

    if (!done) {
      spots.push({ id: 'scale', x: SCALE.cx - 270, y: SCALE.beamY - 50, w: 450, h: SCALE.floorY - SCALE.beamY + 50, label: 'The balance of Ma\'at',
        onInteract(game) { openScale(game); } });
      spots.push({ id: 'shelf', x: TABLE.x - 10, y: TABLE.y - 50, w: TABLE.w + 20, h: 150, label: 'The weight-stones',
        onInteract(game) { openScale(game); } });
    } else {
      if (!(state.journal || []).some(e => e.id === 'amulet_scales')) {
        spots.push({ id: 'amulet', x: SCALE.cx - 60, y: SCALE.topY + 60, w: 120, h: 90, label: 'An amulet in the base',
          onInteract(game) {
            game.journal.add('amulet_scales', { title: 'Amulet of the Scales', category: 'sun', sign: 'feather', sun: { rays: 4, letter: 'H' } });
            game.say('The balanced beam unlatched a drawer in the granite base. Inside: an amulet with a feather on its back, four beads along it, and the letter H.');
            game.refreshScene();
          } });
      }
      spots.push({ id: 'exit', ...EXIT, label: 'The doorway at the end of the hall',
        onInteract(game) {
          if (!game.journal.has('amulet_scales')) {
            game.journal.add('amulet_scales', { title: 'Amulet of the Scales', category: 'sun', sign: 'feather', sun: { rays: 4, letter: 'H' } });
            game.say('You stoop to the opened drawer on your way past and take its amulet: a feather on its back, four beads, the letter H.');
            game.completeRoom({ delay: 3000 });
            return;
          }
          game.completeRoom({ delay: 600 });
        } });
    }
    return spots;
  },

  hints: [
    { text: 'Balance means equal — thirteen deben. But read the carving again: the feather\'s pan has three cups, and none may stand empty.', cost: 60 },
    { text: 'Exactly three stones from 1, 2, 4, 7 and 9 must total 13. Try the 9 first: could two others make up the last 4?', cost: 120 },
    { text: 'The 2, the 4 and the 7. (With the 9, the other two would need to be 1 and 3 — there is no 3.)', cost: 240 },
  ],
};

function openScale(game) {
  const on = new Set(game.getFlag('scales_on') || []);
  game.openPuzzle({
    id: 'scales_balance',
    title: 'The Weighing of the Heart',
    render(body, api) {
      body.innerHTML = `
        ${plateHero('art/scales.webp', { x: SCALE.cx, y: (SCALE.beamY + SCALE.topY) / 2 })}
        <p class="puzzle-desc">The stone heart weighs <strong>${HEART} deben</strong>. The feather's pan has
        <strong>${CUPS} cups</strong> — set one stone in each, so the three together are the heart's equal.</p>
        <div class="puzzle-row" id="sc-stones"></div>
        <p style="text-align:center; font-size:22px; margin:6px 0;">Cups filled: <strong id="sc-cups">0</strong> / ${CUPS} &nbsp;·&nbsp; On the pan: <strong id="sc-total">0</strong> / ${HEART} deben</p>
        <p style="text-align:center; font-style:italic; color:var(--text-dim);" id="sc-tilt">The beam hangs heavy toward the heart.</p>
        <div class="puzzle-feedback"></div>`;
      const row = body.querySelector('#sc-stones');
      const totalEl = body.querySelector('#sc-total');
      const cupsEl = body.querySelector('#sc-cups');
      const tiltEl = body.querySelector('#sc-tilt');
      const sum = () => [...on].reduce((a, b) => a + b, 0);
      const refresh = () => {
        const s = sum();
        totalEl.textContent = s;
        cupsEl.textContent = on.size;
        tiltEl.textContent = s === HEART ? 'The beam floats level.'
          : s < HEART ? 'The beam hangs heavy toward the heart.' : 'The pan drops — too much weight.';
        game.setFlag('scales_on', [...on]);
      };
      const buttons = [];
      STONES.forEach(w => {
        const b = document.createElement('button');
        b.className = 'btn btn-ghost';
        b.style.minWidth = '64px';
        const paint = () => { b.textContent = `${w}${on.has(w) ? ' ✓' : ''}`; b.classList.toggle('btn-primary', on.has(w)); };
        paint();
        b.addEventListener('click', () => {
          if (!on.has(w) && on.size >= CUPS) { api.setFeedback('All three cups are full — lift a stone out first.', 'bad'); return; }
          on.has(w) ? on.delete(w) : on.add(w);
          api.setFeedback('', '');
          paint(); refresh(); game.playSfx('click');
        });
        buttons.push(b);
        row.appendChild(b);
      });
      refresh();
      const foot = document.createElement('div');
      foot.className = 'puzzle-row';
      foot.innerHTML = `<button class="btn btn-primary" id="sc-try">Read the Beam</button>`;
      body.appendChild(foot);
      body.querySelector('#sc-try').addEventListener('click', () => {
        if (sum() === HEART && on.size === CUPS) {
          game.setFlag('scales_balanced');
          game.playSfx('unlock');
          api.solved({ message: 'Three cups, three stones, and the beam swings, wavers, and settles dead level. Truth is satisfied. In the granite base, a drawer slides open.' });
          game.refreshScene();
        } else if (sum() === HEART) {
          api.fail('The beam is level — but a cup stands empty, and Ma\'at will not accept a feather half-dressed.');
        } else {
          api.fail(sum() < HEART ? 'The heart still outweighs the feather.' : 'Too heavy — the feather flies up.');
        }
      });
    },
  });
}
