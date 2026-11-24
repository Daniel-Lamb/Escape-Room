// ROOM 6 — The Great Hall. Peak 2.
// Sub-step 1: drugged meat for the mastiff, holy oil for the rust-seized handles.
// Sub-step 2: the Wheel of Vayne — four coupled rings, three handles.
// A turns rings 1+2, B turns 2+3, C turns 3+4, each pull +90° clockwise.
// Start offsets [2,1,1,2] (quarter-turns still needed: 2,3,3,2).
// Unique fix: A x2, B x1, C x2 in any order. Invariant o1-o2+o3-o4 ≡ 0 (mod 4)
// means no reachable state is unsolvable.

import { registerItems } from '../../../shared/js/items.js';
import { kitDefs, panel, shadow } from '../../../shared/js/scenekit.js';

registerItems({
  crank_handle: {
    name: 'Gatehouse Crank Handle',
    description: 'A square-socket crank, forge-heavy. Chalk on the haft: "You will want this. — E."',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 38 L10 24 L24 24 L24 12 L38 12" fill="none" stroke="#7d8494" stroke-width="5" stroke-linecap="square"/>
      <rect x="34" y="8" width="9" height="9" fill="#7d8494"/>
      <rect x="6" y="36" width="9" height="7" rx="2" fill="#57432a"/>
    </svg>`,
  },
});

const RINGS = [110, 160, 210, 260];        // radii
const START = [2, 1, 1, 2];                // initial offsets (quarter-turns, 0 = aligned)
const COUPLING = { A: [0, 1], B: [1, 2], C: [2, 3] };
// the pulls that bring every ring home (each ring needs (4 - START) quarter-turns)
function pullsNeeded() {
  const need = START.map(s => (4 - s) % 4);
  const a = need[0], b = (need[1] - a + 4) % 4, c = need[3];
  return { A: a, B: b, C: c };
}
const WORDS = ['no', 'one', 'two', 'three'];

// Layout — shared by scene() and hotspots(); surfaces come from art/greathall.webp
// (back wall x 940-1380, dais from x 1200 at y 560, arras on the right wall).
const WHEEL = { cx: 1290, cy: 430, floorY: 610 };
const R = {
  windows: { x: 230, y: 160, w: 230, h: 300 },
  fresco:  { x: 950, y: 186, w: 250, h: 190 },
  wheel:   { x: 1170, y: 300, w: 240, h: 250 },
  plaque:  { x: 1196, y: 556, w: 188, h: 60 },
  sun6:    { x: 1040, y: 700, w: 130, h: 90 },
  hearths: { x: 400, y: 560, w: 380, h: 120 },
  crank:   { x: 1494, y: 250, w: 100, h: 130 },
  stair:   { x: 1494, y: 390, w: 100, h: 180 },
};

// The four quarters of the arms of Vayne, drawn around each quadrant's centre.
function frescoIcons(f) {
  const qw = f.w / 2 - 28, qh = f.h / 2 - 34;
  const c = [
    [f.x + 22 + qw / 2, f.y + 18 + qh / 2], [f.x + f.w / 2 + 6 + qw / 2, f.y + 18 + qh / 2],
    [f.x + 22 + qw / 2, f.y + f.h / 2 - 8 + qh / 2], [f.x + f.w / 2 + 6 + qw / 2, f.y + f.h / 2 - 8 + qh / 2],
  ];
  const icon = [
    '<rect x="-12" y="-14" width="24" height="30"/><path d="M-12 -14 l5 -9 14 0 5 9"/>',
    '<path d="M-17 4 q12 -18 28 -12 q-7 3 -7 8 l12 2 -15 5 q-3 8 -18 -3z"/>',
    '<circle cx="-9" cy="-6" r="8"/><path d="M-3 0 l18 15 m-6 -8 l6 -5 m-1 9 l6 -5"/>',
    '<circle cx="9" cy="-8" r="6" fill="#e8d9b0"/><line x1="3" y1="-3" x2="-15" y2="14"/>',
  ];
  return c.map(([x, y], i) => `<g transform="translate(${x} ${y})" stroke="#e8d9b0" stroke-width="3" fill="none" opacity="0.9">${icon[i]}</g>`).join('');
}

function offsets(state) {
  return [0, 1, 2, 3].map(i => state.flags[`greathall_g${i}`] ?? START[i]);
}
function aligned(state) {
  return offsets(state).every(o => o % 4 === 0);
}

export default {
  id: 'greathall',
  solution: Object.entries(pullsNeeded()).map(([h, n]) => `${WORDS[n]} pull${n === 1 ? '' : 's'} of ${h}`),
  lintStates: [{ label: 'gears oiled', flags: { greathall_dogAsleep: true, greathall_oiled: true } },
    { label: 'open', flags: { greathall_dogAsleep: true, greathall_oiled: true, greathall_tapestryOpen: true } }],
  title: 'The Great Hall',
  intro: 'The Great Hall of Vayne: twin hearths banked to embers, banners breathing in the draft, and windows tall as trees — through which the sky has turned the grey-blue of a blade. Near the dais, chained, something enormous lifts its head.',

  scene(state) {
    const dogAsleep = !!state.flags.greathall_dogAsleep;
    const oiled = !!state.flags.greathall_oiled;
    const open = !!state.flags.greathall_tapestryOpen;
    const crankTaken = !!state.flags.greathall_crankTaken;
    const offs = offsets(state);

    const W = WHEEL;
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${kitDefs()}
        <radialGradient id="gd_gh_coals" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(255,120,50,0.4)"/>
          <stop offset="1" stop-color="rgba(255,120,50,0)"/>
        </radialGradient>
      </defs>

      <!-- background plate (generated): tall windows, two fire-pits under hoods, plain back wall,
           the dais steps (right) and the arras on the right wall. Everything below hangs on those. -->
      <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="art/greathall.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="art/greathall.mp4" type="video/mp4"/></video></foreignObject>

      <!-- warm breath over the painted fire-pits -->
      <ellipse cx="600" cy="630" rx="220" ry="80" fill="url(#gd_gh_coals)" class="glow"/>
      <ellipse cx="895" cy="565" rx="110" ry="40" fill="url(#gd_gh_coals)" class="glow"/>

      <!-- the arms of Vayne, a fresco cut into the plaster of the back wall -->
      ${panel({ ...R.fresco, material: 'stone', mount: 'inset', body: `
        <rect x="${R.fresco.x + 22}" y="${R.fresco.y + 18}" width="${R.fresco.w / 2 - 28}" height="${R.fresco.h / 2 - 34}" fill="#3f4a63"/>
        <rect x="${R.fresco.x + R.fresco.w / 2 + 6}" y="${R.fresco.y + 18}" width="${R.fresco.w / 2 - 28}" height="${R.fresco.h / 2 - 34}" fill="#503a44"/>
        <rect x="${R.fresco.x + 22}" y="${R.fresco.y + R.fresco.h / 2 - 8}" width="${R.fresco.w / 2 - 28}" height="${R.fresco.h / 2 - 34}" fill="#4a4434"/>
        <rect x="${R.fresco.x + R.fresco.w / 2 + 6}" y="${R.fresco.y + R.fresco.h / 2 - 8}" width="${R.fresco.w / 2 - 28}" height="${R.fresco.h / 2 - 34}" fill="#37474a"/>
        ${frescoIcons(R.fresco)}
        <text x="${R.fresco.x + R.fresco.w / 2}" y="${R.fresco.y + R.fresco.h - 14}" text-anchor="middle" font-size="11" fill="#2c2418" letter-spacing="1"
          font-family="Palatino Linotype, Georgia, serif">TURRIS · CORVUS · CLAVIS · STELLA</text>` })}

      <!-- the arras on the right wall (painted in the plate) — parted once the Wheel turns -->
      ${open ? `
        <g data-mount="wall">
          <path d="M1490 70 L1600 10 L1600 640 L1490 575 Z" fill="#05070d"/>
          <path d="M1490 70 L1600 10 L1600 640 L1490 575" fill="none" stroke="#3a3e4f" stroke-width="5"/>
          ${[0, 1, 2, 3, 4].map(i => `<line x1="${1500 + i * 20}" y1="${470 + i * 14}" x2="${1500 + i * 20}" y2="${484 + i * 14}" stroke="#2a2d3a" stroke-width="5"/>`).join('')}
          <path d="M1490 70 q30 120 0 250 q-26 130 0 255 l-36 -4 q20 -126 0 -250 q-22 -126 0 -246 z" fill="#4a3340" stroke="#2a1d24" stroke-width="2"/>
          ${crankTaken ? '' : `<g class="beckon">
            <circle cx="1528" cy="330" r="5" fill="#57432a"/>
            <path d="M1528 330 L1528 304 L1552 304 L1552 284 L1574 284" fill="none" stroke="#7d8494" stroke-width="8" stroke-linecap="square"/>
          </g>`}
        </g>` : ''}

      <!-- the Wheel of Vayne, on its stone plinth at the head of the dais -->
      <g data-mount="post">
        ${shadow(W.cx, W.floorY, 150, 18)}
        <path d="M${W.cx - 130} ${W.floorY} L${W.cx + 130} ${W.floorY} L${W.cx + 112} ${W.cy + 40} L${W.cx - 112} ${W.cy + 40} Z" fill="url(#sk_stone)" stroke="#2c2418" stroke-width="3"/>
        <rect x="${W.cx - 118}" y="${W.cy - 112}" width="236" height="160" rx="10" fill="#2a2620" stroke="#2c2418" stroke-width="3"/>
        <g transform="translate(${W.cx} ${W.cy - 30}) scale(0.72)">
          ${[46, 66, 86].map((r, i) => `
            <g style="transform: rotate(${(offs[i] % 4) * 90}deg); transform-origin: 0 0; transition: transform 0.6s cubic-bezier(0.34,1.56,0.64,1);">
              <circle r="${r}" fill="none" stroke="${offs[i] % 4 === 0 ? '#c9a227' : '#5a5f73'}" stroke-width="8"/>
              <path d="M0 ${-r - 5} L8 ${-r + 9} L-8 ${-r + 9} Z" fill="${offs[i] % 4 === 0 ? '#e8c85a' : '#8b8878'}"/>
            </g>`).join('')}
          <g style="transform: rotate(${(offs[3] % 4) * 90}deg); transform-origin: 0 0; transition: transform 0.6s cubic-bezier(0.34,1.56,0.64,1);">
            <circle r="102" fill="none" stroke="${offs[3] % 4 === 0 ? '#c9a227' : '#5a5f73'}" stroke-width="8"/>
            <path d="M0 -107 L8 -91 L-8 -91 Z" fill="${offs[3] % 4 === 0 ? '#e8c85a' : '#8b8878'}"/>
          </g>
          <circle r="18" fill="#2a2d3a" stroke="#c9a227" stroke-width="3"/>
        </g>
        <!-- the three handles, A B C, set into the plinth below the Wheel -->
        ${['A', 'B', 'C'].map((h, i) => `
          <g>
            <rect x="${W.cx - 66 + i * 66 - 6}" y="${W.cy + 54}" width="12" height="34" rx="4" fill="${oiled ? '#7d8494' : '#6b4a2e'}"/>
            <circle cx="${W.cx - 66 + i * 66}" cy="${W.cy + 52}" r="10" fill="${oiled ? '#9aa1b0' : '#7a5232'}"/>
            <text x="${W.cx - 66 + i * 66}" y="${W.cy + 106}" text-anchor="middle" font-size="14" fill="#2c2418" font-family="Palatino Linotype, Georgia, serif">${h}</text>
          </g>`).join('')}
      </g>

      <!-- brass plaque fixed to the plinth's foot -->
      ${panel({ ...R.plaque, material: 'brass', mount: 'bolts', rx: 4, body: `
        <text x="${R.plaque.x + R.plaque.w / 2}" y="${R.plaque.y + 26}" text-anchor="middle" font-size="12" fill="#2a1d05"
          font-family="Palatino Linotype, Georgia, serif">NO HAND TURNS</text>
        <text x="${R.plaque.x + R.plaque.w / 2}" y="${R.plaque.y + 44}" text-anchor="middle" font-size="12" fill="#2a1d05"
          font-family="Palatino Linotype, Georgia, serif">ONE WHEEL ALONE</text>` })}

      <!-- sun-mark #6: brass inlaid flat in the flagstones before the dais -->
      <g class="beckon">
        <ellipse cx="1090" cy="742" rx="14" ry="6" fill="none" stroke="#c9a227" stroke-width="3"/>
        ${[0, 1, 2, 3, 4].map(i => {
          const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
          return `<line x1="${1090 + Math.cos(a) * 19}" y1="${742 + Math.sin(a) * 8}"
                        x2="${1090 + Math.cos(a) * 30}" y2="${742 + Math.sin(a) * 13}"
                        stroke="#c9a227" stroke-width="3" stroke-linecap="round"/>`;
        }).join('')}
        <text x="1130" y="752" font-size="19" fill="#c9a227" font-family="Palatino Linotype, Georgia, serif">R</text>
      </g>

      <!-- the mastiff (photoreal), chained to an iron ring in the dais step -->
      <g>
        <circle cx="1214" cy="640" r="9" fill="none" stroke="#565b6c" stroke-width="4"/>
        ${dogAsleep ? `
          ${shadow(884, 812, 132, 24)}
          <image href="art/gh-dog-asleep.webp" x="760" y="702" width="244" height="119" preserveAspectRatio="xMidYMid meet"/>
          <g font-family="Palatino Linotype, Georgia, serif" fill="#565b6c">
            <text x="1006" y="704" font-size="26" class="float">z</text>
            <text x="1028" y="676" font-size="20" class="float" style="animation-delay:0.6s">z</text>
          </g>`
        : `
          ${shadow(888, 776, 122, 24)}
          <image href="art/gh-dog-awake.webp" x="756" y="606" width="266" height="170" preserveAspectRatio="xMidYMid meet"/>`}
        <path d="M${dogAsleep ? 940 : 986} ${dogAsleep ? 720 : 660} Q1100 700 1206 642" stroke="#565b6c" stroke-width="6" fill="none" opacity="0.8"/>
      </g>

      <path d="M0 900 L0 856 Q800 906 1600 856 L1600 900 Z" fill="#05070d"/>
    </svg>`;
  },

  hotspots(state) {
    const dogAsleep = !!state.flags.greathall_dogAsleep;
    const oiled = !!state.flags.greathall_oiled;
    const open = !!state.flags.greathall_tapestryOpen;
    const crankTaken = !!state.flags.greathall_crankTaken;
    const spots = [];

    spots.push({
      id: 'windows', plate: 'the tall lancet windows', ...R.windows, label: 'The tall windows',
      onInteract(game) { game.say('The sky over the curtain wall is no longer black. It is the colour of a drawn blade, and it is getting paler while you stand here.'); },
    });

    spots.push({
      id: 'fresco', ...R.fresco, label: 'The gallery fresco',
      onInteract(game) {
        const html = `<p>The arms of Vayne, painted when the paint had money behind it — <strong>quarterly</strong>:</p>
          <ul style="line-height:2; margin-left:20px;">
            <li>Top-left: a <strong>tower</strong> <em>(TURRIS)</em></li>
            <li>Top-right: a <strong>raven</strong> <em>(CORVUS)</em></li>
            <li>Bottom-left: a <strong>key</strong> <em>(CLAVIS)</em></li>
            <li>Bottom-right: a <strong>comet</strong> <em>(STELLA)</em></li>
          </ul>
          <p style="color:var(--text-dim); font-style:italic;">This is what the Wheel's rings should assemble, quadrant by quadrant — every keystone pointing true north, up.</p>`;
        game.journal.add('note_fresco', { title: 'The fresco — arms of Vayne', category: 'note', html });
        game.dialog({ title: 'The Arms of Vayne', html });
      },
    });

    spots.push({
      id: 'dog', x: 770, y: dogAsleep ? 690 : 620, w: 250, h: 160, label: dogAsleep ? 'The mastiff (snoring)' : 'The mastiff (awake)',
      onInteract(game) {
        if (dogAsleep) { game.say('The mastiff snores like a mill. Whatever it dreams of, it is winning.'); return; }
        if (game.selectedItem === 'drugged_meat') {
          game.useSelected();
          game.setFlag('greathall_dogAsleep');
          game.playSfx('pickup');
          game.say('You lob the shank. One chomp, two — a vast yawn — and the mastiff folds up like a dropped cloak, snoring in poppy-scented peace.');
          game.refreshScene();
        } else {
          game.say('It rises as you step closer, silent now, which is worse than the growl. Between you and the dais it is simply a wall with teeth. It looks... hungry.');
        }
      },
    });

    spots.push({
      id: 'sun6', ...R.sun6, label: 'Brass inlay in the floor',
      onInteract(game) {
        game.journal.add('sun6', { title: 'Great Hall — beneath the Wheel', category: 'sun', sun: { rays: 5, letter: 'R' } });
        game.say('Set brass into the flagstones beneath the Wheel: a sun of five rays, and the letter R. The sixth mark — Edmund\'s road runs through this hall.');
      },
    });

    spots.push({
      id: 'plaque', ...R.plaque, label: 'Wheel plaque',
      onInteract(game) {
        const html = `<div class="parchment-note"><p>"NO HAND TURNS ONE WHEEL ALONE."</p></div>
          <p style="color:var(--text-dim); font-style:italic; margin-top:10px;">Each handle below the Wheel is geared to two rings at once. Watch what a pull moves.</p>`;
        game.journal.add('note_wheelplaque', { title: 'Wheel plaque (Great Hall)', category: 'note', html });
        game.dialog({ title: 'The Plaque', html });
      },
    });

    if (!open) {
      spots.push({
        id: 'wheel', ...R.wheel, label: 'The Wheel of Vayne',
        onInteract(game) {
          if (!dogAsleep) { game.say('You take one step toward the dais and the mastiff stands up. Perhaps solve the dog before the wheel.'); return; }
          if (!oiled) {
            if (game.selectedItem === 'holy_oil') {
              game.useSelected();
              game.setFlag('greathall_oiled');
              game.playSfx('pour');
              game.say('You anoint the gear trains — "for the easing of hinges and of souls." The rust lets go with a sigh. The handles will answer now.');
              game.refreshScene();
            } else {
              game.say('The gears are furred with rust; the handles might as well be carved on. They want oil — and you carry some blessed for exactly this kind of mercy.');
            }
            return;
          }
          openWheelPuzzle(game);
        },
      });
    } else {
      if (!crankTaken) {
        spots.push({
          id: 'crank', ...R.crank, label: 'Crank on a peg',
          onInteract(game) {
            game.setFlag('greathall_crankTaken');
            game.addItem('crank_handle', { from: { x: 1545, y: 300 } });
            game.say('A crank handle on a peg, chalked in a hand you know by now: "You will want this. — E." You take it. You believe him.');
            game.refreshScene();
          },
        });
      }
      spots.push({
        id: 'stair', ...R.stair, label: 'The hidden stair',
        onInteract(game) {
          if (!game.hasItem('crank_handle') && !state.flags.greathall_crankTaken) {
            game.say('The stair corkscrews down into the gatehouse dark. On the peg behind the arras, something metal waits with a chalk note.');
          } else if (!game.journal.has('sun6')) {
            game.journal.add('sun6', { title: 'Great Hall — beneath the Wheel', category: 'sun', sun: { rays: 5, letter: 'R' } });
            game.say('Brass glints in the flagstones as you cross to the stair: a sun of five rays, and the letter R. You copy it — the sixth mark — and go down toward the gatehouse.');
            game.completeRoom({ delay: 3000 });
          } else {
            game.say('Down, then — through the wall\'s cold marrow, toward the gatehouse. The road is nearly finished.');
            game.completeRoom({ delay: 900 });
          }
        },
      });
    }

    spots.push({
      id: 'hearths', ...R.hearths, label: 'Banked fire-pits',
      onInteract(game) { game.say('Coals banked for a morning the kitchen staff expect to be busy. An execution puts appetite in a garrison.'); },
    });

    return spots;
  },

  hintContext(state) {
    if (!state.flags.greathall_dogAsleep || !state.flags.greathall_oiled) return 'approach';
    return 'wheel';
  },

  hints(state) {
    if (!state.flags.greathall_dogAsleep || !state.flags.greathall_oiled) {
      return [
        { text: 'Two guardians hold the dais: one is hungry, one is rusted. You have brewed for the first and been blessed for the second.', cost: 60 },
        { text: 'Feed the mastiff the drugged meat. Then the handles: the chapel oil was labeled "for the easing of hinges and of souls."', cost: 120 },
        { text: 'Hold the drugged meat and click the dog. Then hold the holy oil and click the Wheel. Then the Wheel will turn.', cost: 240 },
      ];
    }
    return [
      { text: 'Pull each handle once and just watch. Which rings answer to which handle? The plaque already warned you: no hand turns one wheel alone.', cost: 60 },
      { text: 'Only handle A moves the innermost ring, and only C moves the outermost. Count what those two rings still need — the middle rings take care of themselves.', cost: 120 },
      { text: 'Two pulls of A, one pull of B, two pulls of C — in any order. Keystones up.', cost: 240 },
    ];
  },
};

/* ---------------- the wheel interface ---------------- */

const CHARGES = ['🗼', '🐦', '🗝', '☄'];

function openWheelPuzzle(game) {
  game.openPuzzle({
    id: 'greathall_wheel',
    title: 'The Wheel of Vayne',
    wide: true,
    render(body, api) {
      body.innerHTML = `
        <div class="puzzle-hero" style="background-image:url(art/pz-marble.webp)"></div>
        <p class="puzzle-desc">Four marble rings, each carrying a quarter of the arms of Vayne.
        Aligned, every keystone points up and the fresco's arms assemble.
        Three bronze handles below — and <em>no hand turns one wheel alone</em>.</p>
        <div style="display:flex; justify-content:center;">
          <svg id="gh-wheel" viewBox="-300 -300 600 600" style="width:min(58vw,380px); height:auto;">
            ${[0, 1, 2, 3].map(i => `
              <g id="gh-ring-${i}" style="transform-origin: 0 0; transition: transform 0.55s cubic-bezier(0.34,1.56,0.64,1);">
                <circle r="${RINGS[i]}" fill="none" stroke="#5a5f73" stroke-width="20" opacity="0.85"/>
                <path d="M0 ${-RINGS[i] - 12} L14 ${-RINGS[i] + 14} L-14 ${-RINGS[i] + 14} Z" fill="#8b8878"/>
                <text y="${-RINGS[i] + 7}" text-anchor="middle" font-size="20" fill="#e8d9b0">${CHARGES[i]}</text>
              </g>`).join('')}
            <circle r="52" fill="#1c1f2b" stroke="#c9a227" stroke-width="4"/>
            <text id="gh-center" y="9" text-anchor="middle" font-size="26" fill="#c9a227"
              font-family="Palatino Linotype, Georgia, serif">?</text>
          </svg>
        </div>
        <div class="puzzle-row" style="gap:26px; margin-top:16px;">
          ${['A', 'B', 'C'].map(h => `
            <div class="lever" data-handle="${h}">
              <div class="lever-track"><div class="lever-knob"></div></div>
              <div class="lever-label">Handle ${h}</div>
            </div>`).join('')}
        </div>
        <div class="puzzle-feedback"></div>`;

      function paint(withPulse) {
        const offs = offsets(game.state);
        offs.forEach((o, i) => {
          const ring = body.querySelector(`#gh-ring-${i}`);
          ring.style.transform = `rotate(${o * 90}deg)`;
          ring.querySelector('circle').setAttribute('stroke', o % 4 === 0 ? '#c9a227' : '#5a5f73');
          ring.querySelector('path').setAttribute('fill', o % 4 === 0 ? '#e8c85a' : '#8b8878');
        });
        if (withPulse) game.playSfx('stone');
      }

      // ensure starting offsets are persisted once
      [0, 1, 2, 3].forEach(i => {
        if (game.getFlag(`greathall_g${i}`) === undefined) game.setFlag(`greathall_g${i}`, START[i]);
      });
      paint(false);

      body.querySelectorAll('.lever').forEach(lever => {
        lever.addEventListener('click', () => {
          lever.classList.add('down');
          setTimeout(() => lever.classList.remove('down'), 420);
          const [a, b] = COUPLING[lever.dataset.handle];
          game.setFlag(`greathall_g${a}`, ((game.getFlag(`greathall_g${a}`) ?? START[a]) + 1) % 4);
          game.setFlag(`greathall_g${b}`, ((game.getFlag(`greathall_g${b}`) ?? START[b]) + 1) % 4);
          paint(true);
          api.setFeedback(`Handle ${lever.dataset.handle} — two rings answer, grinding a quarter-turn together.`, '');

          if (aligned(game.state)) {
            body.querySelector('#gh-center').textContent = '✦';
            game.setFlag('greathall_tapestryOpen');
            setTimeout(() => {
              api.solved({ message: 'Tower, raven, key, comet — the arms of Vayne assemble and the whole wall shudders. Behind the tapestry, stone grinds aside: a hidden stair, breathing cold river-smell.' });
              game.refreshScene();
            }, 700);
          }
        });
      });
    },
  });
}
