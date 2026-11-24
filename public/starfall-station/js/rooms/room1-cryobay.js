// DECK 1 — Cryo Bay. Tutorial difficulty.
// Puzzle: the thaw-lock keypad. Gauges A=4, B=7, D=2; C is cracked.
// Manifold law "A + B = C + D" -> C = 9. Code: 4-7-9-2.
// Foreshadows: blank pod nameplate (integrity 0%), MC-7 sleeve, glare-hidden
// reflection. Shard 1 (6 peaks, "U") sits in your own pod's data slot.

import { registerItems } from '../../../shared/js/items.js';
import { kitDefs, panel, shadow } from '../../../shared/js/scenekit.js';

registerItems({
  magnet_stylus: {
    name: 'Magnet Stylus',
    description: 'A magnetized pick-up tool from someone\'s kit. Looks like junk. Feels like junk. Hm.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 38 L32 12" stroke="#8fa3b8" stroke-width="4" stroke-linecap="round"/>
      <path d="M30 8 L38 16 L34 20 L26 12 Z" fill="#e05252"/>
      <path d="M33 9 L37 13" stroke="#d7e8ff" stroke-width="2"/>
      <circle cx="12" cy="38" r="3.5" fill="#39485a"/>
    </svg>`,
  },
});

const GAUGES = { a: 4, b: 7, d: 2 };   // c is cracked; law gives 9

// Layout — read off the plate (art/cryobay.webp): viewport on the left, the pod
// row receding along the right wall (the blue-lit pod is yours), bulkhead at
// the far end of the row. Shared by scene() and hotspots().
const CREW = [
  { name: 'OKAFOR, J.', x: 1376, y: 668, s: 1.0 },
  { name: 'IBARRA, M.', x: 866, y: 596, s: 0.8 },
  { name: 'CHEN, R.', x: 716, y: 572, s: 0.68 },
];
const MY = { cx: 1094, top: 318, base: 628 };
const SLOT = { x: 1186, y: 450 };
const DOOR = { x: 520, y: 380, w: 78, h: 150 };
const CON = { x: 110, y: 594, w: 400, h: 156 };
const gaugeX = i => CON.x + 62 + i * 92;
const TOOL = { x: 560, y: 712, w: 170, h: 112 };
const R = {
  mypod:    { x: 1000, y: 300, w: 180, h: 330 },
  shard1:   { x: 1172, y: 430, w: 64, h: 84 },
  sleeve:   { x: 0, y: 770, w: 210, h: 130 },
  pods:     { x: 620, y: 300, w: 370, h: 320 },
  manifold: { x: CON.x, y: CON.y, w: CON.w, h: 60 },
  drawer:   { x: TOOL.x - 4, y: TOOL.y - 10, w: TOOL.w + 8, h: TOOL.h + 20 },
  viewport: { x: 20, y: 256, w: 470, h: 300 },
  door:     { x: 498, y: 350, w: 122, h: 230 },
};

export default {
  id: 'cryobay',
  lintStates: [{ label: 'thawed', flags: { cryobay_doorOpen: true, cryobay_stylusTaken: true, cryobay_wipedA: true, cryobay_wipedB: true, cryobay_wipedD: true } }],
  title: 'Cryo Bay',
  intro: 'Cold light. Colder floor. You are standing in the cryo bay of Starfall Station with no memory of standing up, while a voice you somehow know says: "There you are. Do not be alarmed by the alarms." Every pod but yours is open and empty. Through the viewport, a planet takes up too much of the sky.',

  scene(state) {
    const wa = !!state.flags.cryobay_wipedA;
    const wb = !!state.flags.cryobay_wipedB;
    const wd = !!state.flags.cryobay_wipedD;
    const stylusHere = !state.flags.cryobay_stylusTaken;
    const unlocked = !!state.flags.cryobay_doorOpen;

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${kitDefs()}
        <linearGradient id="gd_cb_wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#131b28"/>
          <stop offset="1" stop-color="#1e2a3c"/>
        </linearGradient>
        <linearGradient id="gd_cb_floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#182231"/>
          <stop offset="1" stop-color="#0b111c"/>
        </linearGradient>
        <radialGradient id="gd_cb_planet" cx="0.4" cy="0.35" r="0.9">
          <stop offset="0" stop-color="#4a7cb5"/>
          <stop offset="0.55" stop-color="#25476f"/>
          <stop offset="1" stop-color="#102338"/>
        </radialGradient>
        <linearGradient id="gd_cb_pod" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#3a4c62"/>
          <stop offset="1" stop-color="#22303f"/>
        </linearGradient>
        <radialGradient id="gd_cb_cool" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(79,216,208,0.35)"/>
          <stop offset="1" stop-color="rgba(79,216,208,0)"/>
        </radialGradient>
      </defs>

      <!-- background plate: the viewport (left), a row of stasis pods receding along the right wall
           (yours is the blue-lit one), open deck floor. Everything below is fixed to those. -->
      <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="art/cryobay.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="art/cryobay.mp4" type="video/mp4"/></video></foreignObject>

      <!-- crew nameplates, bolted to the plinths of the painted pods (smaller as they recede) -->
      ${CREW.map(c => `
      <g data-mount="bolts">
        <rect x="${c.x - 52 * c.s}" y="${c.y}" width="${104 * c.s}" height="${22 * c.s}" rx="${4 * c.s}" fill="#0d141c" stroke="rgba(79,216,208,0.35)" stroke-width="1.2"/>
        <text x="${c.x}" y="${c.y + 15 * c.s}" text-anchor="middle" font-size="${17 * c.s}" fill="#c3d2e0" font-family="Consolas, monospace">${c.name}</text>
        <text x="${c.x}" y="${c.y - 150 * c.s}" text-anchor="middle" font-size="${16.9 * c.s}" fill="#8ff0ea" opacity="0.85"
          font-family="Consolas, monospace" paint-order="stroke" stroke="#04070d" stroke-width="3">EVACUATED</text>
      </g>`).join('')}

      <!-- YOUR pod: the blue-lit one. Fogged glass, blank plate, a data slot on its frame -->
      <g data-mount="bolts">
        <ellipse cx="${MY.cx}" cy="${MY.base + 6}" rx="110" ry="18" fill="url(#gd_cb_cool)" class="glow"/>
        <rect x="${MY.cx - 62}" y="${MY.top}" width="124" height="${MY.base - MY.top - 40}" rx="30" fill="rgba(221,236,255,0.14)"/>
        <rect x="${MY.cx - 46}" y="${MY.base - 8}" width="92" height="20" rx="4" fill="#0d141c" stroke="rgba(79,216,208,0.4)" stroke-width="1.2"/>
        <text x="${MY.cx}" y="${MY.base + 7}" text-anchor="middle" font-size="13" fill="#8399a8" font-family="Consolas, monospace">———</text>
        <rect x="${SLOT.x}" y="${SLOT.y}" width="24" height="44" rx="4" fill="#0d1720" stroke="#2f9e97" stroke-width="2" class="beckon"/>
        <text x="${SLOT.x + 12}" y="${SLOT.y + 29}" text-anchor="middle" font-size="16" fill="#4fd8d0">▮</text>
      </g>

      <!-- the bulkhead at the far end of the pod row, ringed by its amber thaw-lock -->
      <g data-mount="wall">
        <rect x="${DOOR.x}" y="${DOOR.y}" width="${DOOR.w}" height="${DOOR.h}" rx="8" fill="${unlocked ? '#020407' : 'url(#sk_steel)'}" stroke="${unlocked ? '#4fd8d0' : '#ffb45e'}" stroke-width="3" opacity="0.95"/>
        ${unlocked
          ? `<text x="${DOOR.x + DOOR.w / 2}" y="${DOOR.y + DOOR.h / 2}" text-anchor="middle" font-size="13" fill="#4fd8d0" font-family="Consolas, monospace" class="flicker">OPEN</text>`
          : `<line x1="${DOOR.x + DOOR.w / 2}" y1="${DOOR.y + 6}" x2="${DOOR.x + DOOR.w / 2}" y2="${DOOR.y + DOOR.h - 6}" stroke="#0f1217" stroke-width="3"/>
             <circle cx="${DOOR.x + DOOR.w / 2}" cy="${DOOR.y + DOOR.h * 0.45}" r="17" fill="#101a26" stroke="#ffb45e" stroke-width="2.5" class="beckon"/>
             <text x="${DOOR.x + DOOR.w / 2}" y="${DOOR.y + DOOR.h * 0.45 + 4}" text-anchor="middle" font-size="11.5" fill="#ffb45e" font-family="Consolas, monospace">THAW</text>
             <text x="${DOOR.x + DOOR.w / 2}" y="${DOOR.y + DOOR.h + 18}" text-anchor="middle" font-size="11" fill="#8fa3b8" font-family="Consolas, monospace" paint-order="stroke" stroke="#04070d" stroke-width="3">CODE = A·B·C·D</text>`}
      </g>

      <!-- coolant manifold: a console standing on the deck in front of the viewport -->
      ${panel({ ...CON, material: 'steel', mount: 'console', floorY: 884, body: `
        <text x="${CON.x + CON.w / 2}" y="${CON.y + 26}" text-anchor="middle" font-size="15" fill="#8fa3b8" letter-spacing="2" font-family="Consolas, monospace">COOLANT MANIFOLD</text>
        <text x="${CON.x + CON.w / 2}" y="${CON.y + 47}" text-anchor="middle" font-size="13" fill="#4fd8d0" font-family="Consolas, monospace">PRESSURE LAW: A + B = C + D</text>
        ${['a', 'b', 'c', 'd'].map((g, i) => {
          const cx = gaugeX(i), cy = CON.y + 108;
          const wiped = g === 'a' ? wa : g === 'b' ? wb : g === 'd' ? wd : false;
          const cracked = g === 'c';
          return `
          <g>
            <text x="${cx}" y="${cy - 32}" text-anchor="middle" font-size="13" fill="#8fa3b8" font-family="Consolas, monospace">${g.toUpperCase()}</text>
            <circle cx="${cx}" cy="${cy}" r="24" fill="#0d141f" stroke="${cracked ? '#e05252' : '#39485a'}" stroke-width="3"/>
            ${cracked
              ? `<path d="M${cx - 14} ${cy - 14} L${cx + 4} ${cy + 4} L${cx - 4} ${cy + 12} M${cx + 8} ${cy - 16} L${cx + 2} ${cy - 4}" stroke="#e05252" stroke-width="2" fill="none"/>
                 <text x="${cx}" y="${cy + 38}" text-anchor="middle" font-size="11.5" fill="#e05252" font-family="Consolas, monospace">CRACKED</text>`
              : wiped
                ? `<text x="${cx}" y="${cy + 7}" text-anchor="middle" font-size="20" fill="#8ff0ea" font-family="Consolas, monospace">${GAUGES[g]}</text>`
                : `<circle cx="${cx}" cy="${cy}" r="20" fill="rgba(215,232,255,0.28)"/>
                   <text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="11.5" fill="#5d7080" font-family="Consolas, monospace">FROST</text>`}
          </g>`;
        }).join('')}` })}

      <!-- tool chest on the deck: two drawers, the top one ajar -->
      <g data-mount="floor">
        ${shadow(TOOL.x + TOOL.w / 2, TOOL.y + TOOL.h, TOOL.w * 0.6, 12)}
        <rect x="${TOOL.x}" y="${TOOL.y}" width="${TOOL.w}" height="${TOOL.h}" rx="8" fill="url(#sk_steel)" stroke="#0f1217" stroke-width="3"/>
        <rect x="${TOOL.x + 12}" y="${TOOL.y + 16}" width="${TOOL.w - 24}" height="34" rx="4" fill="#1c222b" stroke="#4fd8d0" stroke-opacity="0.35" stroke-width="1.5"/>
        <rect x="${TOOL.x + 12}" y="${TOOL.y + 62}" width="${TOOL.w - 24}" height="34" rx="4" fill="#1c222b" stroke="#2a313b" stroke-width="1.5"/>
        <rect x="${TOOL.x + TOOL.w / 2 - 22}" y="${TOOL.y + 74}" width="44" height="8" rx="3" fill="#5c6675"/>
        ${stylusHere ? `<g class="beckon"><path d="M${TOOL.x + 50} ${TOOL.y + 30} L${TOOL.x + 104} ${TOOL.y + 22}" stroke="#a8b6c8" stroke-width="4" stroke-linecap="round"/><rect x="${TOOL.x + 100}" y="${TOOL.y + 16}" width="10" height="10" rx="2" fill="#e05252"/></g>` : ''}
      </g>

      <!-- your own suit sleeve, at the bottom-left edge of your view -->
      <g data-mount="hud">
        <path d="M0 772 Q92 752 176 812 L210 900 L0 900 Z" fill="#2a3442" stroke="#121820" stroke-width="3"/>
        <path d="M150 800 L194 900" stroke="#4fd8d0" stroke-opacity="0.35" stroke-width="5"/>
        <text x="62" y="842" font-size="22" fill="#c3d2e0" opacity="0.8" font-family="Consolas, monospace" transform="rotate(-8 62 842)">MC-7</text>
      </g>

      <path d="M0 900 L0 860 Q800 905 1600 860 L1600 900 Z" fill="#04070d"/>
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const unlocked = !!state.flags.cryobay_doorOpen;

    spots.push({
      id: 'mypod', ...R.mypod, label: 'Your cryopod',
      onInteract(game) {
        const html = `<div class="datapad"><div class="pad-title">Pod 04 — Status</div>
          OCCUPANT: ——— <br>
          TISSUE INTEGRITY: <span class="pad-bad">0%</span><br>
          LAST CYCLE: <span class="pad-warn">332 days ago</span><br>
          NOTE: nameplate returned to fabricator, unengraved.</div>
          <p style="margin-top:12px; color:var(--text-dim); font-style:italic;">Zero percent. Odd
          reading for a pod you apparently just climbed out of. The fogged glass catches the light —
          the glare hides you.</p>`;
        game.journal.add('note_mypod', { title: 'Pod 04 status (Cryo Bay)', category: 'note', html });
        game.dialog({ title: 'Your Pod', html });
      },
    });

    spots.push({
      id: 'shard1', ...R.shard1, label: 'Something in the data slot',
      onInteract(game) {
        game.journal.add('shard1', { title: 'Cryo Bay — your pod\'s data slot', category: 'sun', sun: { rays: 6, letter: 'U' } });
        game.say('A memory shard, seated in YOUR pod\'s data slot. As your glove closes on it: —cold gel, electrodes, a hand that is not quite yours signing a consent form— The suit logs it before you can decide not to.');
      },
    });

    spots.push({
      id: 'sleeve', ...R.sleeve, label: 'Your sleeve',
      onInteract(game) {
        game.say('Stenciled on your suit sleeve: MC-7. Not your initials. Not standard med-suit issue either. You file it under "later."');
      },
    });

    spots.push({
      id: 'pods', ...R.pods, label: 'The crew pods',
      onInteract(game) {
        game.say('Okafor, Ibarra, Chen — all pods open, all cycled out clean. EVACUATED, says each one, in the tone machines use for "gone without you."');
      },
    });

    ['a', 'b', 'c', 'd'].forEach((g, i) => {
      spots.push({
        id: `gauge_${g}`, x: gaugeX(i) - 40, y: CON.y + 64, w: 80, h: 86, label: `Gauge ${g.toUpperCase()}`,
        onInteract(game) {
          if (g === 'c') {
            game.journal.add('note_gaugec', {
              title: 'Gauge C (Cryo Bay)', category: 'note',
              html: '<p>Gauge C: glass cracked, needle dead. But the manifold stamps its own law above the dials: <strong>A + B = C + D</strong>.</p>',
            });
            game.say('Gauge C is cracked — needle flat, glass starred. Whatever it read, it isn\'t saying. The manifold\'s stamped law might say it for them.');
          } else {
            const flag = `cryobay_wiped${g.toUpperCase()}`;
            if (!game.getFlag(flag)) {
              game.setFlag(flag);
              game.playSfx('page');
              game.say(`You wipe the frost from gauge ${g.toUpperCase()}: it reads ${GAUGES[g]}.`);
              game.refreshScene();
            } else {
              game.say(`Gauge ${g.toUpperCase()} reads ${GAUGES[g]}, steady.`);
            }
            game.journal.add(`note_gauge${g}`, {
              title: `Gauge ${g.toUpperCase()} (Cryo Bay)`, category: 'note',
              html: `<p>Gauge ${g.toUpperCase()} reads <strong>${GAUGES[g]}</strong>.</p>`,
            });
          }
        },
      });
    });

    spots.push({
      id: 'manifold', ...R.manifold, label: 'Manifold plate',
      onInteract(game) {
        const html = `<div class="datapad"><div class="pad-title">Coolant manifold</div>
          PRESSURE LAW: <strong>A + B = C + D</strong><br>
          <span style="opacity:0.7">— stamped at manufacture, honored ever since.</span></div>`;
        game.journal.add('note_law', { title: 'Pressure law (Cryo Bay)', category: 'note', html });
        game.dialog({ title: 'The Manifold', html });
      },
    });

    if (!state.flags.cryobay_stylusTaken) {
      spots.push({
        id: 'drawer', ...R.drawer, label: 'Tool drawer',
        onInteract(game) {
          game.setFlag('cryobay_stylusTaken');
          game.addItem('magnet_stylus', { from: { x: TOOL.x + 80, y: TOOL.y + 26 } });
          game.say('A magnet stylus — the tool you grab when a screw drops somewhere unforgivable. Junk, probably. Salvage protocol says take it anyway.');
          game.refreshScene();
        },
      });
    }

    spots.push({
      id: 'viewport', plate: 'the viewport', ...R.viewport, label: 'The viewport',
      onInteract(game) {
        game.say('The planet fills half the glass, and the horizon has a faint orange fringe it should not have. That fringe is where orbits go to die. Yours is on the schedule.');
      },
    });

    if (!unlocked) {
      spots.push({
        id: 'door', ...R.door, label: 'Bulkhead — thaw lock',
        onInteract(game) { openThawLock(game); },
      });
    } else {
      spots.push({
        id: 'door_open', ...R.door, label: 'To Hydroponics',
        onInteract(game) {
          if (!state.flags.cryobay_stylusTaken) {
            game.say('Salvage protocol, says a memory that doesn\'t feel like yours: anything unbolted comes with you. The tool drawer is still shut.');
            return;
          }
          if (!game.journal.has('shard1')) {
            game.say('Gus drifts between you and the door, polite but immovable: "The shard in your pod slot. Take it. Trust me — or trust yourself. Same thing, arguably."');
            return;
          }
          game.say('The bulkhead breathes open onto the green dark of the hydroponics ring.');
          game.completeRoom({ delay: 700 });
        },
      });
    }

    return spots;
  },

  hints: [
    { text: 'The thaw code is the four gauges, in the order printed under the lock. Wipe the frost. One gauge will not cooperate — the manifold plate compensates.', cost: 60 },
    { text: 'A reads 4, B reads 7, D reads 2, and the stamped law says A + B = C + D. Solve for the cracked one.', cost: 120 },
    { text: 'C = 4 + 7 − 2 = 9. Enter 4-7-9-2.', cost: 240 },
  ],
};

function openThawLock(game) {
  const values = [0, 0, 0, 0];

  game.openPuzzle({
    id: 'cryobay_thaw',
    title: 'Thaw-Lock Interlock',
    render(body, api) {
      body.innerHTML = `
        <div class="puzzle-hero" style="background-image:url(art/pz-cryo.webp)"></div>
        <p class="puzzle-desc">The cryo safety interlock sealed every bulkhead when the bay
        went cold. Release code = the four coolant gauges, A·B·C·D — assuming all four
        can still be read. Which is a bold assumption for gauge C.</p>
        <div class="puzzle-row" id="cb-dials"></div>
        <div class="puzzle-row"><button class="btn btn-primary" id="cb-try">Release Interlock</button></div>
        <div class="puzzle-feedback"></div>`;

      const row = body.querySelector('#cb-dials');
      ['A', 'B', 'C', 'D'].forEach((label, i) => {
        const dial = document.createElement('div');
        dial.className = 'dial';
        dial.innerHTML = `
          <button class="dial-btn" data-d="1">&#9650;</button>
          <div class="dial-face">0</div>
          <button class="dial-btn" data-d="-1">&#9660;</button>
          <div class="lever-label">${label}</div>`;
        const face = dial.querySelector('.dial-face');
        dial.querySelectorAll('.dial-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            values[i] = (values[i] + Number(btn.dataset.d) + 10) % 10;
            face.textContent = values[i];
            face.classList.remove('tick'); void face.offsetWidth; face.classList.add('tick');
            game.playSfx('click');
          });
        });
        row.appendChild(dial);
      });

      body.querySelector('#cb-try').addEventListener('click', () => {
        if (values.join('') === '4792') {
          game.setFlag('cryobay_doorOpen');
          game.playSfx('unlock');
          api.solved({ message: 'The interlock spins down with a falling chord and the bulkhead unseals. "See?" says Gus, entirely too pleased. "Barely dead at all."' });
          game.refreshScene();
        } else {
          api.fail('INTERLOCK: CODE REJECTED. The gauges disagree with you.');
        }
      });
    },
  });
}
