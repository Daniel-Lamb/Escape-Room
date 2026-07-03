// ROOM 6 — The Great Hall. Peak 2.
// Sub-step 1: drugged meat for the mastiff, holy oil for the rust-seized handles.
// Sub-step 2: the Wheel of Vayne — four coupled rings, three handles.
// A turns rings 1+2, B turns 2+3, C turns 3+4, each pull +90° clockwise.
// Start offsets [2,1,1,2] (quarter-turns still needed: 2,3,3,2).
// Unique fix: A x2, B x1, C x2 in any order. Invariant o1-o2+o3-o4 ≡ 0 (mod 4)
// means no reachable state is unsolvable.

import { registerItems } from '../items.js';

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

function offsets(state) {
  return [0, 1, 2, 3].map(i => state.flags[`greathall_g${i}`] ?? START[i]);
}
function aligned(state) {
  return offsets(state).every(o => o % 4 === 0);
}

export default {
  id: 'greathall',
  title: 'The Great Hall',
  intro: 'The Great Hall of Vayne: twin hearths banked to embers, banners breathing in the draft, and windows tall as trees — through which the sky has turned the grey-blue of a blade. Near the dais, chained, something enormous lifts its head.',

  scene(state) {
    const dogAsleep = !!state.flags.greathall_dogAsleep;
    const oiled = !!state.flags.greathall_oiled;
    const open = !!state.flags.greathall_tapestryOpen;
    const crankTaken = !!state.flags.greathall_crankTaken;
    const offs = offsets(state);

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gd_gh_wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#151221"/>
          <stop offset="1" stop-color="#252033"/>
        </linearGradient>
        <linearGradient id="gd_gh_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#1a2138"/>
          <stop offset="0.7" stop-color="#2b3a55"/>
          <stop offset="1" stop-color="#41536f"/>
        </linearGradient>
        <radialGradient id="gd_gh_coals" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(255,120,50,0.4)"/>
          <stop offset="1" stop-color="rgba(255,120,50,0)"/>
        </radialGradient>
      </defs>

      <rect width="1600" height="660" fill="url(#gd_gh_wall)"/>
      <rect y="660" width="1600" height="240" fill="#161221"/>
      <g stroke="#0b0812" stroke-width="4" opacity="0.7">
        ${[700, 760, 830].map(y => `<line x1="0" y1="${y}" x2="1600" y2="${y}"/>`).join('')}
        ${[260, 620, 980, 1340].map(x => `<line x1="${x}" y1="660" x2="${x - 50}" y2="900"/>`).join('')}
      </g>

      <!-- tall windows, sky lightening -->
      ${[120, 420].map(x => `
      <g>
        <path d="M${x} 560 L${x} 180 Q${x + 60} 110 ${x + 120} 180 L${x + 120} 560 Z" fill="url(#gd_gh_sky)" class="moonbeam"/>
        <path d="M${x} 560 L${x} 180 Q${x + 60} 110 ${x + 120} 180 L${x + 120} 560 Z" fill="none" stroke="#0b0812" stroke-width="8"/>
        <line x1="${x + 60}" y1="130" x2="${x + 60}" y2="560" stroke="#0b0812" stroke-width="6"/>
        <line x1="${x}" y1="330" x2="${x + 120}" y2="330" stroke="#0b0812" stroke-width="6"/>
      </g>`).join('')}

      <!-- twin hearths -->
      ${[620, 1360].map(x => `
      <g>
        <rect x="${x - 90}" y="480" width="180" height="180" rx="8" fill="#100d16"/>
        <rect x="${x - 104}" y="470" width="208" height="18" rx="4" fill="#3a3e4f"/>
        <ellipse cx="${x}" cy="620" rx="140" ry="70" fill="url(#gd_gh_coals)" class="glow"/>
        ${[-40, -10, 24, 48].map((dx, i) => `<circle cx="${x + dx}" cy="${632 - (i % 2) * 10}" r="${7 + (i % 3)}" fill="#e07b2a" class="flicker" opacity="0.8"/>`).join('')}
      </g>`).join('')}

      <!-- gallery fresco -->
      <g>
        <rect x="800" y="130" width="360" height="230" rx="8" fill="#2e2838" stroke="#0b0812" stroke-width="5"/>
        <rect x="830" y="155" width="140" height="85" fill="#3f4a63"/>
        <rect x="990" y="155" width="140" height="85" fill="#503a44"/>
        <rect x="830" y="250" width="140" height="85" fill="#4a4434"/>
        <rect x="990" y="250" width="140" height="85" fill="#37474a"/>
        <!-- tower / raven / key / comet miniatures -->
        <g stroke="#e8d9b0" stroke-width="4" fill="none" opacity="0.9">
          <rect x="880" y="175" width="34" height="46"/><path d="M880 175 l6 -12 22 0 6 12"/>
          <path d="M1040 205 q14 -22 34 -14 q-8 4 -8 10 l14 2 -18 6 q-4 10 -22 8z"/>
          <circle cx="885" cy="282" r="11"/><path d="M894 290 l26 22 m-8 -12 l8 -6 m-2 12 l8 -6"/>
          <circle cx="1078" cy="272" r="8" fill="#e8d9b0"/><line x1="1070" y1="278" x2="1032" y2="310"/>
        </g>
        <text x="980" y="352" text-anchor="middle" font-size="15" fill="#8b8878" letter-spacing="2"
          font-family="Palatino Linotype, Georgia, serif">TURRIS &middot; CORVUS &middot; CLAVIS &middot; STELLA</text>
      </g>

      <!-- dais + wheel of vayne (miniature in scene; full view in puzzle) -->
      <g>
        <rect x="1130" y="600" width="470" height="60" rx="6" fill="#241f2d"/>
        ${open ? `
          <rect x="1250" y="330" width="230" height="270" fill="#05070d"/>
          <path d="M1250 330 L1480 330 L1480 600 L1250 600" fill="none" stroke="#3a3e4f" stroke-width="6"/>
          ${crankTaken ? '' : `<g class="beckon">
            <circle cx="1290" cy="470" r="5" fill="#57432a"/>
            <path d="M1290 470 L1290 440 L1320 440 L1320 415 L1350 415" fill="none" stroke="#7d8494" stroke-width="9" stroke-linecap="square"/>
            <text x="1320" y="520" font-size="14" fill="#cfd4de" text-anchor="middle" font-style="italic"
              font-family="Palatino Linotype, Georgia, serif">"You will want this. — E."</text>
          </g>`}
          <rect x="1130" y="330" width="120" height="270" fill="#3f2a33"/>
          <path d="M1130 330 q60 20 120 0 l0 270 q-60 -20 -120 0 z" fill="#4a3340"/>`
        : `
          <rect x="1180" y="300" width="340" height="300" fill="#4a3340"/>
          <path d="M1180 300 q170 30 340 0 l0 300 q-170 -30 -340 0 z" fill="#573a49" class="sway slow"/>
          <g stroke="#3f2a33" stroke-width="4" opacity="0.8">
            ${[340, 400, 460, 520].map(y => `<path d="M1190 ${y} q160 24 320 0"/>`).join('')}
          </g>`}
        <!-- the wheel above the dais -->
        <g transform="translate(1350 200)">
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
        <!-- plaque under wheel -->
        <rect x="1240" y="620" width="220" height="26" rx="4" fill="#8a6d1c"/>
        <text x="1350" y="638" text-anchor="middle" font-size="13" fill="#f4e9c8" letter-spacing="1"
          font-family="Palatino Linotype, Georgia, serif">NO HAND TURNS ONE WHEEL ALONE</text>
      </g>

      <!-- sun-mark #6: brass inlay in the floor -->
      <g class="beckon">
        <circle cx="1090" cy="740" r="12" fill="none" stroke="#c9a227" stroke-width="3"/>
        ${[0, 1, 2, 3, 4].map(i => {
          const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
          return `<line x1="${1090 + Math.cos(a) * 16}" y1="${740 + Math.sin(a) * 8 + 0}"
                        x2="${1090 + Math.cos(a) * 26}" y2="${740 + Math.sin(a) * 14}"
                        stroke="#c9a227" stroke-width="3" stroke-linecap="round"/>`;
        }).join('')}
        <text x="1126" y="750" font-size="19" fill="#c9a227" font-family="Palatino Linotype, Georgia, serif">R</text>
      </g>

      <!-- the mastiff -->
      <g>
        ${dogAsleep ? `
          <ellipse cx="880" cy="760" rx="120" ry="40" fill="#1c1824"/>
          <path d="M790 750 Q800 710 860 712 Q930 714 960 740 Q980 756 950 764 Q870 780 800 766 Q784 762 790 750z" fill="#2e2637"/>
          <ellipse cx="948" cy="736" rx="30" ry="22" fill="#2e2637"/>
          <g font-family="Palatino Linotype, Georgia, serif" fill="#565b6c">
            <text x="990" y="700" font-size="26" class="float">z</text>
            <text x="1012" y="672" font-size="20" class="float" style="animation-delay:0.6s">z</text>
          </g>`
        : `
          <ellipse cx="880" cy="770" rx="110" ry="30" fill="#0c0912"/>
          <path d="M800 760 Q796 690 852 668 Q900 650 940 672 Q986 656 990 626 Q1006 648 992 676 Q1006 690 1002 712 Q996 750 940 760 Q870 772 800 760z" fill="#231d2e"/>
          <circle cx="964" cy="668" r="4" fill="#e05252" class="flicker"/>
          <path d="M930 700 q20 10 40 4" stroke="#0c0912" stroke-width="4" fill="none"/>
          <path d="M846 700 l-12 60 M906 706 l6 58" stroke="#231d2e" stroke-width="16" stroke-linecap="round"/>`}
        <path d="M${dogAsleep ? 940 : 986} ${dogAsleep ? 720 : 660} Q1060 640 1130 616" stroke="#565b6c" stroke-width="6" fill="none" opacity="0.8"/>
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
      id: 'windows', x: 110, y: 110, w: 440, h: 460, label: 'The tall windows',
      onInteract(game) { game.say('The sky over the curtain wall is no longer black. It is the colour of a drawn blade, and it is getting paler while you stand here.'); },
    });

    spots.push({
      id: 'fresco', x: 790, y: 120, w: 380, h: 250, label: 'The gallery fresco',
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
      id: 'sun6', x: 1040, y: 700, w: 130, h: 90, label: 'Brass inlay in the floor',
      onInteract(game) {
        game.journal.add('sun6', { title: 'Great Hall — beneath the Wheel', category: 'sun', sun: { rays: 5, letter: 'R' } });
        game.say('Set brass into the flagstones beneath the Wheel: a sun of five rays, and the letter R. The sixth mark — Edmund\'s road runs through this hall.');
      },
    });

    spots.push({
      id: 'plaque', x: 1230, y: 610, w: 240, h: 44, label: 'Wheel plaque',
      onInteract(game) {
        const html = `<div class="parchment-note"><p>"NO HAND TURNS ONE WHEEL ALONE."</p></div>
          <p style="color:var(--text-dim); font-style:italic; margin-top:10px;">Each handle below the Wheel is geared to two rings at once. Watch what a pull moves.</p>`;
        game.journal.add('note_wheelplaque', { title: 'Wheel plaque (Great Hall)', category: 'note', html });
        game.dialog({ title: 'The Plaque', html });
      },
    });

    if (!open) {
      spots.push({
        id: 'wheel', x: 1230, y: 90, w: 250, h: 230, label: 'The Wheel of Vayne',
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
          id: 'crank', x: 1255, y: 380, w: 130, h: 160, label: 'Crank on a peg',
          onInteract(game) {
            game.setFlag('greathall_crankTaken');
            game.addItem('crank_handle', { from: { x: 1320, y: 440 } });
            game.say('A crank handle on a peg, chalked in a hand you know by now: "You will want this. — E." You take it. You believe him.');
            game.refreshScene();
          },
        });
      }
      spots.push({
        id: 'stair', x: 1390, y: 340, w: 110, h: 250, label: 'The hidden stair',
        onInteract(game) {
          if (!game.hasItem('crank_handle') && !state.flags.greathall_crankTaken) {
            game.say('The stair corkscrews down into the gatehouse dark. On the alcove peg beside it, something metal waits with a chalk note.');
          } else if (!game.journal.has('sun6')) {
            game.say('"Mark each sun along the road." Brass glints in the flagstones beneath the Wheel — the sixth sun, waiting for your journal.');
          } else {
            game.say('Down, then — through the wall\'s cold marrow, toward the gatehouse. The road is nearly finished.');
            game.completeRoom({ delay: 900 });
          }
        },
      });
    }

    spots.push({
      id: 'hearths', x: 530, y: 460, w: 180, h: 200, label: 'Banked hearth',
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
