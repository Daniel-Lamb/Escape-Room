// DECK 1 — Cryo Bay. Tutorial difficulty.
// Puzzle: the thaw-lock keypad. Gauges A=4, B=7, D=2; C is cracked.
// Manifold law "A + B = C + D" -> C = 9. Code: 4-7-9-2.
// Foreshadows: blank pod nameplate (integrity 0%), MC-7 sleeve, glare-hidden
// reflection. Shard 1 (6 peaks, "U") sits in your own pod's data slot.

import { registerItems } from '../../../shared/js/items.js';

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

export default {
  id: 'cryobay',
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

      <rect width="1600" height="640" fill="url(#gd_cb_wall)"/>
      <g stroke="#0c1420" stroke-width="4" opacity="0.8">
        ${[110, 240, 380, 520].map(y => `<line x1="0" y1="${y}" x2="1600" y2="${y}"/>`).join('')}
        ${[300, 640, 980, 1320].map(x => `<line x1="${x}" y1="0" x2="${x}" y2="640"/>`).join('')}
      </g>
      <rect y="640" width="1600" height="260" fill="url(#gd_cb_floor)"/>
      <g stroke="#0a0f18" stroke-width="3" opacity="0.7">
        ${[690, 760, 835].map(y => `<line x1="0" y1="${y}" x2="1600" y2="${y}"/>`).join('')}
      </g>

      <!-- viewport with the planet, too close -->
      <g>
        <ellipse cx="1310" cy="250" rx="200" ry="150" fill="#04070d"/>
        <circle cx="1310" cy="420" r="260" fill="url(#gd_cb_planet)"/>
        <path d="M1130 330 Q1310 260 1490 330" stroke="rgba(255,180,94,0.5)" stroke-width="3" fill="none" class="flicker"/>
        <ellipse cx="1310" cy="250" rx="200" ry="150" fill="none" stroke="#2b3547" stroke-width="14"/>
        <ellipse cx="1310" cy="250" rx="200" ry="150" fill="none" stroke="rgba(79,216,208,0.25)" stroke-width="3"/>
      </g>

      <!-- row of open, empty pods -->
      ${[120, 340, 560].map((x, i) => `
      <g opacity="0.9">
        <path d="M${x} 600 L${x} 300 Q${x + 80} 250 ${x + 160} 300 L${x + 160} 600 Z" fill="url(#gd_cb_pod)" stroke="#141c26" stroke-width="4"/>
        <path d="M${x + 18} 580 L${x + 18} 320 Q${x + 80} 282 ${x + 142} 320 L${x + 142} 580 Z" fill="#0d141f"/>
        <rect x="${x + 30}" y="608" width="100" height="20" rx="4" fill="#22303f"/>
        <text x="${x + 80}" y="623" text-anchor="middle" font-size="13" fill="#8fa3b8"
          font-family="Consolas, monospace">${['OKAFOR, J.', 'IBARRA, M.', 'CHEN, R.'][i]}</text>
        <text x="${x + 80}" y="360" text-anchor="middle" font-size="12" fill="#4fd8d0" opacity="0.65"
          font-family="Consolas, monospace">EVACUATED</text>
      </g>`).join('')}

      <!-- YOUR pod: glass fogged, plate blank -->
      <g>
        <ellipse cx="880" cy="600" rx="120" ry="20" fill="url(#gd_cb_cool)" class="glow"/>
        <path d="M790 600 L790 280 Q880 220 970 280 L970 600 Z" fill="url(#gd_cb_pod)" stroke="#141c26" stroke-width="5"/>
        <path d="M808 580 L808 300 Q880 250 952 300 L952 580 Z" fill="#101b28"/>
        <path d="M812 320 Q860 280 948 340 L948 560 L900 580 Z" fill="rgba(215,232,255,0.09)"/>
        <rect x="830" y="608" width="100" height="20" rx="4" fill="#22303f"/>
        <text x="880" y="623" text-anchor="middle" font-size="13" fill="#5d7080"
          font-family="Consolas, monospace">———</text>
        <!-- data slot with shard -->
        ${state.journal && state.journal.some ? '' : ''}
        <rect x="955" y="420" width="26" height="46" rx="4" fill="#141c26" stroke="#2f9e97" stroke-width="2" class="${'beckon'}"/>
        <text x="968" y="450" text-anchor="middle" font-size="16" fill="#4fd8d0">▮</text>
      </g>

      <!-- coolant gauges + manifold -->
      <g>
        <rect x="1080" y="470" width="360" height="150" rx="10" fill="#16222f" stroke="#2b3547" stroke-width="4"/>
        <text x="1260" y="497" text-anchor="middle" font-size="15" fill="#8fa3b8" letter-spacing="2"
          font-family="Consolas, monospace">COOLANT MANIFOLD</text>
        <text x="1260" y="518" text-anchor="middle" font-size="13" fill="#4fd8d0"
          font-family="Consolas, monospace">PRESSURE LAW: A + B = C + D</text>
        ${['a', 'b', 'c', 'd'].map((g, i) => {
          const x = 1112 + i * 82;
          const wiped = g === 'a' ? wa : g === 'b' ? wb : g === 'd' ? wd : false;
          const cracked = g === 'c';
          return `
          <g>
            <circle cx="${x + 26}" cy="566" r="26" fill="#0d141f" stroke="${cracked ? '#e05252' : '#39485a'}" stroke-width="3"/>
            ${cracked
              ? `<path d="M${x + 12} 552 L${x + 30} 570 L${x + 22} 578 M${x + 34} 550 L${x + 28} 562" stroke="#e05252" stroke-width="2" fill="none"/>
                 <text x="${x + 26}" y="600" text-anchor="middle" font-size="11" fill="#e05252" font-family="Consolas, monospace">CRACKED</text>`
              : wiped
                ? `<text x="${x + 26}" y="573" text-anchor="middle" font-size="20" fill="#8ff0ea" font-family="Consolas, monospace">${GAUGES[g]}</text>`
                : `<circle cx="${x + 26}" cy="566" r="22" fill="rgba(215,232,255,0.28)"/>
                   <text x="${x + 26}" y="571" text-anchor="middle" font-size="10" fill="#5d7080" font-family="Consolas, monospace">FROST</text>`}
            <text x="${x + 26}" y="536" text-anchor="middle" font-size="13" fill="#8fa3b8" font-family="Consolas, monospace">${g.toUpperCase()}</text>
          </g>`;
        }).join('')}
      </g>

      <!-- tool drawer -->
      <g>
        <rect x="70" y="690" width="180" height="80" rx="8" fill="#1c2734" stroke="#2b3547" stroke-width="3"/>
        <rect x="90" y="710" width="140" height="16" rx="4" fill="#101a26"/>
        <rect x="90" y="736" width="140" height="16" rx="4" fill="#101a26"/>
        ${stylusHere ? `<g class="beckon"><path d="M120 744 L156 736" stroke="#8fa3b8" stroke-width="3" stroke-linecap="round"/><rect x="152" y="731" width="9" height="9" rx="2" fill="#e05252"/></g>` : ''}
      </g>

      <!-- bulkhead door with thaw-lock keypad -->
      <g>
        <path d="M400 640 L400 330 Q480 270 560 330 L560 640 Z" fill="${unlocked ? '#0b131e' : '#1a2431'}" stroke="#2b3547" stroke-width="8"/>
        ${unlocked
          ? `<path d="M420 640 L420 350 Q480 305 540 350 L540 640" fill="none" stroke="rgba(79,216,208,0.35)" stroke-width="3"/>
             <text x="480" y="480" text-anchor="middle" font-size="14" fill="#4fd8d0" font-family="Consolas, monospace" class="flicker">OPEN</text>`
          : `<circle cx="480" cy="470" r="34" fill="#101a26" stroke="#ffb45e" stroke-width="3" class="beckon"/>
             <text x="480" y="463" text-anchor="middle" font-size="10" fill="#ffb45e" font-family="Consolas, monospace">THAW</text>
             <text x="480" y="477" text-anchor="middle" font-size="10" fill="#ffb45e" font-family="Consolas, monospace">LOCK</text>
             <text x="480" y="530" text-anchor="middle" font-size="11" fill="#8fa3b8" font-family="Consolas, monospace">CODE = A·B·C·D</text>`}
      </g>

      <!-- emergency strip lighting -->
      <rect x="0" y="632" width="1600" height="6" fill="#e05252" opacity="0.5" class="flicker"/>

      <path d="M0 900 L0 860 Q800 905 1600 860 L1600 900 Z" fill="#04070d"/>
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const unlocked = !!state.flags.cryobay_doorOpen;

    spots.push({
      id: 'mypod', x: 780, y: 250, w: 200, h: 380, label: 'Your cryopod',
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
      id: 'shard1', x: 945, y: 405, w: 60, h: 80, label: 'Something in the data slot',
      onInteract(game) {
        game.journal.add('shard1', { title: 'Cryo Bay — your pod\'s data slot', category: 'sun', sun: { rays: 6, letter: 'U' } });
        game.say('A memory shard, seated in YOUR pod\'s data slot. As your glove closes on it: —cold gel, electrodes, a hand that is not quite yours signing a consent form— The suit logs it before you can decide not to.');
      },
    });

    spots.push({
      id: 'sleeve', x: 20, y: 380, w: 90, h: 120, label: 'Your sleeve',
      onInteract(game) {
        game.say('Stenciled on your suit sleeve: MC-7. Not your initials. Not standard med-suit issue either. You file it under "later."');
      },
    });

    spots.push({
      id: 'pods', x: 110, y: 260, w: 620, h: 360, label: 'The crew pods',
      onInteract(game) {
        game.say('Okafor, Ibarra, Chen — all pods open, all cycled out clean. EVACUATED, says each one, in the tone machines use for "gone without you."');
      },
    });

    ['a', 'b', 'c', 'd'].forEach((g, i) => {
      spots.push({
        id: `gauge_${g}`, x: 1100 + i * 82, y: 530, w: 76, h: 80, label: `Gauge ${g.toUpperCase()}`,
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
      id: 'manifold', x: 1080, y: 460, w: 360, h: 62, label: 'Manifold plate',
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
        id: 'drawer', x: 60, y: 680, w: 200, h: 100, label: 'Tool drawer',
        onInteract(game) {
          game.setFlag('cryobay_stylusTaken');
          game.addItem('magnet_stylus', { from: { x: 150, y: 740 } });
          game.say('A magnet stylus — the tool you grab when a screw drops somewhere unforgivable. Junk, probably. Salvage protocol says take it anyway.');
          game.refreshScene();
        },
      });
    }

    spots.push({
      id: 'viewport', x: 1120, y: 110, w: 380, h: 280, label: 'The viewport',
      onInteract(game) {
        game.say('The planet fills half the glass, and the horizon has a faint orange fringe it should not have. That fringe is where orbits go to die. Yours is on the schedule.');
      },
    });

    if (!unlocked) {
      spots.push({
        id: 'door', x: 410, y: 340, w: 140, h: 290, label: 'Bulkhead — thaw lock',
        onInteract(game) { openThawLock(game); },
      });
    } else {
      spots.push({
        id: 'door_open', x: 410, y: 340, w: 140, h: 290, label: 'To Hydroponics',
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
