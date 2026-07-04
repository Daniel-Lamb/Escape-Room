// ROOM 7 — The Gatehouse: the Pilgrim's Gate. META.
// Phase 1: six letter dials on the north door. The six journaled sun-marks,
// sorted by ray count ascending (3,4,5,6,7,8), spell A-U-R-O-R-A.
// Phase 2: the water-gate winch — crank in the socket, iron crow through the
// spokes as a pawl, three full turns. Then the mere, and the dawn.

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default {
  id: 'gatehouse',
  title: 'The Gatehouse',
  intro: 'The stair spits you into the winch chamber of the gatehouse. Above, through the murder-holes, boots and low voices — the main gate is watched, and the watchers sound awake. But in the north wall, low and half-forgotten, a stone door waits under a carved sun.',

  scene(state) {
    return state.flags.gatehouse_doorOpen ? tunnelScene(state) : chamberScene(state);
  },

  hotspots(state) {
    return state.flags.gatehouse_doorOpen ? tunnelSpots(state) : chamberSpots(state);
  },

  hintContext(state) {
    return state.flags.gatehouse_doorOpen ? 'winch' : 'door';
  },

  hints(state) {
    if (!state.flags.gatehouse_doorOpen) {
      return [
        { text: 'Your journal has been keeping count for you all night. Six dials on the door; six suns on the road.', cost: 60 },
        { text: 'Ignore the order you found them in. The plaque gives the true order: "THE FEWEST RAYS SPEAK FIRST." Count each sun\'s rays and sort.', cost: 120 },
        { text: '3 rays A, 4 rays U, 5 rays R, 6 rays O, 7 rays R, 8 rays A — set the dials to AURORA. The dawn opens the door.', cost: 240 },
      ];
    }
    return [
      { text: 'The drum spins back the moment you let go — something must hold what you win.', cost: 60 },
      { text: 'The crank fills the socket, but the sheared pawl is the real problem. You have carried a bar of honest iron since the guard room.', cost: 120 },
      { text: 'Use the crank handle on the socket, wedge the iron crow through the drum spokes, then crank — three full turns.', cost: 240 },
    ];
  },
};

/* ================= PHASE 1 — the winch chamber ================= */

function chamberScene(state) {
  return `
  <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gd_gt_wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#141120"/>
        <stop offset="1" stop-color="#26222f"/>
      </linearGradient>
      <radialGradient id="gd_gt_torch" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="rgba(255,169,77,0.5)"/>
        <stop offset="1" stop-color="rgba(255,169,77,0)"/>
      </radialGradient>
    </defs>

    <rect width="1600" height="640" fill="url(#gd_gt_wall)"/>
    <g stroke="#0b0812" stroke-width="5" opacity="0.8" fill="none">
      ${[100, 200, 300, 400, 500].map(y => `<line x1="0" y1="${y}" x2="1600" y2="${y}"/>`).join('')}
      ${[220, 540, 860, 1180, 1500].map((x, i) => `<line x1="${x + (i % 2) * 40}" y1="${(i % 2) * 100}" x2="${x + (i % 2) * 40}" y2="640"/>`).join('')}
    </g>
    <rect y="640" width="1600" height="260" fill="#131019"/>

    <!-- murder-holes above -->
    ${[400, 700, 1000].map(x => `
      <ellipse cx="${x}" cy="46" rx="54" ry="20" fill="#05070d"/>
      <ellipse cx="${x}" cy="46" rx="54" ry="20" fill="none" stroke="#2b2233" stroke-width="5"/>`).join('')}

    <!-- torch -->
    <g>
      <ellipse cx="180" cy="240" rx="220" ry="160" fill="url(#gd_gt_torch)" class="glow"/>
      <rect x="167" y="240" width="24" height="80" rx="6" fill="#4a3520"/>
      <path class="torch-flame" d="M179 170 Q200 202 186 236 Q179 244 172 236 Q158 202 179 170Z" fill="#ffa94d"/>
      <path class="torch-flame fast" d="M179 192 Q189 210 182 232 Q179 236 176 232 Q169 210 179 192Z" fill="#ffd9a0"/>
    </g>

    <!-- the great windlass (main gate - the trap) -->
    <g>
      <circle cx="620" cy="480" r="120" fill="#241f2d" stroke="#3a3e4f" stroke-width="10"/>
      ${[0, 45, 90, 135].map(a => `<line x1="${620 - 110 * Math.cos(a * Math.PI / 180)}" y1="${480 - 110 * Math.sin(a * Math.PI / 180)}"
        x2="${620 + 110 * Math.cos(a * Math.PI / 180)}" y2="${480 + 110 * Math.sin(a * Math.PI / 180)}" stroke="#3a3e4f" stroke-width="14"/>`).join('')}
      <circle cx="620" cy="480" r="26" fill="#2a2d3a" stroke="#565b6c" stroke-width="6"/>
      <path d="M620 360 L620 60 M700 400 L940 60" stroke="#565b6c" stroke-width="10" fill="none"/>
      <rect x="540" y="620" width="160" height="40" rx="8" fill="#241f2d"/>
      <text x="620" y="700" text-anchor="middle" font-size="15" fill="#7a1f2b" font-style="italic"
        font-family="Palatino Linotype, Georgia, serif">the main gate — watched</text>
    </g>

    <!-- north door with sun relief and six dials -->
    <g>
      <path d="M1150 640 L1150 340 Q1270 250 1390 340 L1390 640 Z" fill="#1c1824" stroke="#3a3e4f" stroke-width="9"/>
      <!-- sun relief -->
      <g class="beckon">
        <circle cx="1270" cy="310" r="26" fill="none" stroke="#c9a227" stroke-width="5"/>
        ${Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return `<line x1="${1270 + Math.cos(a) * 33}" y1="${310 + Math.sin(a) * 33}"
                        x2="${1270 + Math.cos(a) * 46}" y2="${310 + Math.sin(a) * 46}"
                        stroke="#c9a227" stroke-width="4" stroke-linecap="round"/>`;
        }).join('')}
      </g>
      <!-- chiseled plaque -->
      <rect x="1163" y="380" width="214" height="64" rx="5" fill="#26222f" stroke="#3a3e4f" stroke-width="3"/>
      <text x="1270" y="406" text-anchor="middle" font-size="14" fill="#b9bfcf" letter-spacing="1"
        font-family="Palatino Linotype, Georgia, serif">SIX SUNS LIGHT</text>
      <text x="1270" y="424" text-anchor="middle" font-size="14" fill="#b9bfcf" letter-spacing="1"
        font-family="Palatino Linotype, Georgia, serif">THE PILGRIM'S ROAD.</text>
      <text x="1270" y="440" text-anchor="middle" font-size="13" fill="#c9a227" letter-spacing="1"
        font-family="Palatino Linotype, Georgia, serif">THE FEWEST RAYS SPEAK FIRST.</text>
      <!-- six brass dials -->
      <rect x="1163" y="470" width="214" height="56" rx="8" fill="#241a10" stroke="#57432a" stroke-width="3"/>
      <g font-family="Palatino Linotype, Georgia, serif" font-size="24" fill="#c9a227" text-anchor="middle">
        ${[0, 1, 2, 3, 4, 5].map(i =>
          `<text x="${1182 + i * 36}" y="508">${ALPHA[(state.flags[`gatehouse_d${i}`] ?? 0)]}</text>`).join('')}
      </g>
    </g>

    <!-- fog crawling the floor -->
    <ellipse cx="500" cy="850" rx="480" ry="60" fill="rgba(154,196,255,0.05)" class="fog"/>
    <ellipse cx="1200" cy="870" rx="420" ry="55" fill="rgba(154,196,255,0.04)" class="fog reverse"/>

    <path d="M0 900 L0 856 Q800 906 1600 856 L1600 900 Z" fill="#05070d"/>
  </svg>`;
}

function chamberSpots(state) {
  return [
    {
      id: 'windlass', x: 480, y: 350, w: 290, h: 320, label: 'The great windlass',
      onInteract(game) {
        game.say('Through the murder-holes: boots, low voices, the creak of a crossbow being kept company. Raise the main gate and the first thing through it will be you, feet first. The Pilgrim\'s Road was never the front door.');
      },
    },
    {
      id: 'holes', x: 330, y: 10, w: 740, h: 80, label: 'Murder-holes',
      onInteract(game) {
        game.say('"...at first light, and not a breath before," says a voice above, bored and close. You stop breathing for a while.');
      },
    },
    {
      id: 'relief', x: 1210, y: 250, w: 130, h: 110, label: 'The sun relief',
      onInteract(game) {
        game.say('A great sun of many rays, carved deep — the door\'s own crown. No letter beneath this one. This sun is not a clue; it is the destination.');
      },
    },
    {
      id: 'plaque7', x: 1163, y: 372, w: 214, h: 76, label: 'Chiseled plaque',
      onInteract(game) {
        const html = `<div class="parchment-note aged"><p>"SIX SUNS LIGHT THE PILGRIM'S ROAD.<br>THE FEWEST RAYS SPEAK FIRST."</p></div>`;
        game.journal.add('note_gateplaque', { title: 'The gate plaque (Gatehouse)', category: 'note', html });
        game.dialog({ title: 'The Plaque', html });
      },
    },
    {
      id: 'dials', x: 1150, y: 455, w: 240, h: 90, label: 'Six brass dials',
      onInteract(game) { openDoorPuzzle(game); },
    },
  ];
}

function openDoorPuzzle(game) {
  const values = [0, 1, 2, 3, 4, 5].map(i => game.getFlag(`gatehouse_d${i}`) ?? 0);
  const sunsFound = game.state.journal.filter(e => e.category === 'sun').length;

  game.openPuzzle({
    id: 'gatehouse_door',
    title: "The Pilgrim's Gate",
    wide: true,
    render(body, api) {
      body.innerHTML = `
        <p class="puzzle-desc">Six brass letter dials ring the low north door.
        <em>"Six suns light the pilgrim's road. The fewest rays speak first."</em>
        ${sunsFound < 6
          ? `<br><strong style="color:var(--danger);">Your journal holds only ${sunsFound} of the six suns.</strong> Edmund's verse said it from the first wall: <em>mark each sun along the road.</em>`
          : 'Your journal holds all six suns of the road. Sort them as the plaque commands.'}</p>
        <div class="puzzle-row" id="gt-dials"></div>
        <div class="puzzle-row"><button class="btn btn-primary" id="gt-try">Set the Word</button></div>
        <div class="puzzle-feedback"></div>
        <p style="text-align:center; margin-top:10px; font-size:13.5px; color:var(--text-dim);">
          (Open your <strong>Journal</strong> from the top bar to see every sun you sketched — rays and letters.)</p>`;

      const row = body.querySelector('#gt-dials');
      values.forEach((v, i) => {
        const dial = document.createElement('div');
        dial.className = 'dial';
        dial.innerHTML = `
          <button class="dial-btn" data-d="1">&#9650;</button>
          <div class="dial-face">${ALPHA[v]}</div>
          <button class="dial-btn" data-d="-1">&#9660;</button>`;
        const face = dial.querySelector('.dial-face');
        dial.querySelectorAll('.dial-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            values[i] = (values[i] + Number(btn.dataset.d) + 26) % 26;
            face.textContent = ALPHA[values[i]];
            face.classList.remove('tick'); void face.offsetWidth; face.classList.add('tick');
            game.playSfx('click');
            game.setFlag(`gatehouse_d${i}`, values[i]);
          });
        });
        row.appendChild(dial);
      });

      body.querySelector('#gt-try').addEventListener('click', () => {
        const word = values.map(v => ALPHA[v]).join('');
        if (word === 'AURORA') {
          game.setFlag('gatehouse_doorOpen');
          game.playSfx('unlock');
          api.solved({ message: 'AURORA — the dawn itself, spelled out of forty years of patience. The bar lifts inside the stone. North, just as Edmund spelled it: the low door swings into a brick tunnel that smells of the mere.' });
          setTimeout(() => game.refreshScene(), 900);
        } else {
          api.fail('The dials sit dead. Not the word the suns spell.');
        }
      });
    },
  });
}

/* ================= PHASE 2 — the tunnel & water-gate ================= */

function tunnelScene(state) {
  const crankIn = !!state.flags.gatehouse_crankIn;
  const pawlIn = !!state.flags.gatehouse_pawlIn;
  const turns = state.flags.gatehouse_turns ?? 0;
  const gateLift = Math.min(turns, 3) * 46;

  return `
  <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gd_tn_wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#100d18"/>
        <stop offset="1" stop-color="#241e28"/>
      </linearGradient>
      <linearGradient id="gd_tn_dawn" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="rgba(120,140,170,0.4)"/>
        <stop offset="1" stop-color="rgba(65,83,111,0.15)"/>
      </linearGradient>
      <linearGradient id="gd_tn_water" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#131c2c"/>
        <stop offset="1" stop-color="#060a14"/>
      </linearGradient>
    </defs>

    <rect width="1600" height="900" fill="url(#gd_tn_wall)"/>
    <!-- brick tunnel walls converging toward the water-gate -->
    <g stroke="#0a0810" stroke-width="4" opacity="0.85" fill="none">
      ${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${i * 90} 0 Q${420 + i * 60} ${180 + i * 30} ${380 + i * 105} 900" />`).join('')}
      ${[140, 260, 380, 500].map(y => `<path d="M0 ${y} Q700 ${y + 60} 900 ${y + 140}"/>`).join('')}
    </g>
    <path d="M0 0 L0 900 L330 900 Q240 420 520 130 L380 0 Z" fill="#0c0912" opacity="0.75"/>

    <!-- the water-gate: portcullis grate into the mere -->
    <g>
      <path d="M900 900 L900 300 Q1150 170 1400 300 L1400 900 Z" fill="url(#gd_tn_water)"/>
      <path d="M900 900 L900 300 Q1150 170 1400 300 L1400 900" fill="none" stroke="#3a3e4f" stroke-width="12"/>
      <!-- dawn-grey light leaking through -->
      <path d="M920 320 Q1150 200 1380 320 L1380 560 L920 560 Z" fill="url(#gd_tn_dawn)" class="moonbeam"/>
      <!-- water -->
      <rect x="900" y="640" width="500" height="260" fill="#0c1626"/>
      <g class="shimmer">
        ${[670, 700, 730].map((y, i) => `<path d="M910 ${y} q60 -8 120 0 t120 0 t120 0 t120 0" stroke="rgba(174,191,221,0.35)" stroke-width="3" fill="none"/>`).join('')}
      </g>
      <!-- the grate itself, lifting with each turn -->
      <g style="transform: translateY(${-gateLift}px); transition: transform 0.9s cubic-bezier(0.22,1,0.36,1);">
        ${[960, 1030, 1100, 1170, 1240, 1310].map(x => `<line x1="${x}" y1="300" x2="${x}" y2="880" stroke="#2b3242" stroke-width="16"/>`).join('')}
        ${[360, 460, 560, 660, 760].map(y => `<line x1="920" y1="${y}" x2="1385" y2="${y}" stroke="#2b3242" stroke-width="12"/>`).join('')}
        ${[960, 1030, 1100, 1170, 1240, 1310].map(x => `<path d="M${x - 7} 880 l7 14 l7 -14 z" fill="#2b3242"/>`).join('')}
      </g>
    </g>

    <!-- the small winch -->
    <g>
      <rect x="560" y="560" width="240" height="34" rx="8" fill="#38290f"/>
      <rect x="580" y="594" width="26" height="180" fill="#241a10"/>
      <rect x="750" y="594" width="26" height="180" fill="#241a10"/>
      <!-- drum with spokes -->
      <g id="gt_drum" style="transform-origin: 680px 500px; transform: rotate(${turns * 120}deg); transition: transform 0.9s cubic-bezier(0.22,1,0.36,1);">
        <circle cx="680" cy="500" r="64" fill="#241f2d" stroke="#565b6c" stroke-width="8"/>
        ${[0, 60, 120].map(a => `<line x1="${680 - 56 * Math.cos(a * Math.PI / 180)}" y1="${500 - 56 * Math.sin(a * Math.PI / 180)}"
           x2="${680 + 56 * Math.cos(a * Math.PI / 180)}" y2="${500 + 56 * Math.sin(a * Math.PI / 180)}" stroke="#565b6c" stroke-width="10"/>`).join('')}
      </g>
      <path d="M744 500 Q830 460 900 430" stroke="#565b6c" stroke-width="8" fill="none"/>
      <!-- socket / crank -->
      ${crankIn
        ? `<g><rect x="666" y="486" width="28" height="28" fill="#3a3e4f"/>
             <path d="M680 500 L680 430 L740 430" fill="none" stroke="#7d8494" stroke-width="12" stroke-linecap="square"/>
             <rect x="734" y="420" width="20" height="20" rx="4" fill="#57432a"/></g>`
        : `<rect x="666" y="486" width="28" height="28" fill="#05070d" stroke="#565b6c" stroke-width="4" class="beckon"/>`}
      <!-- pawl slot / crow -->
      ${pawlIn
        ? `<path d="M600 560 L648 522" stroke="#7d8494" stroke-width="11" stroke-linecap="round"/>`
        : `<g><path d="M596 540 q10 -6 22 -4" stroke="#7a1f2b" stroke-width="6" fill="none"/>
             <text x="600" y="586" font-size="13" fill="#8b8878" font-style="italic"
               font-family="Palatino Linotype, Georgia, serif">the pawl is sheared</text></g>`}
    </g>

    <!-- carved sun over the tunnel mouth behind you -->
    <g opacity="0.65">
      <circle cx="180" cy="140" r="18" fill="none" stroke="#c9a227" stroke-width="3"/>
      ${Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return `<line x1="${180 + Math.cos(a) * 23}" y1="${140 + Math.sin(a) * 23}"
                      x2="${180 + Math.cos(a) * 32}" y2="${140 + Math.sin(a) * 32}"
                      stroke="#c9a227" stroke-width="3" stroke-linecap="round"/>`;
      }).join('')}
    </g>

    <ellipse cx="700" cy="860" rx="520" ry="50" fill="rgba(154,196,255,0.05)" class="fog"/>
    <path d="M0 900 L0 866 Q800 908 1600 866 L1600 900 Z" fill="#05070d"/>
  </svg>`;
}

function tunnelSpots(state) {
  const crankIn = !!state.flags.gatehouse_crankIn;
  const pawlIn = !!state.flags.gatehouse_pawlIn;
  const spots = [];

  spots.push({
    id: 'water', x: 950, y: 620, w: 420, h: 240, label: 'The mere',
    onInteract(game) {
      game.say('Black water, cold as a ledger. On the far side of it: reeds, a bank, a world. Only the grate stands between you and a very persuasive swim.');
    },
  });

  spots.push({
    id: 'socket', x: 630, y: 420, w: 130, h: 120, label: crankIn ? 'The crank' : 'Empty square socket',
    onInteract(game) {
      if (!crankIn) {
        if (game.selectedItem === 'crank_handle') {
          game.useSelected();
          game.setFlag('gatehouse_crankIn');
          game.playSfx('unlock');
          game.say('The crank seats into the square socket with a click like a knuckle. "You will want this," he said. You did.');
          game.refreshScene();
        } else {
          game.say('A small winch with an empty square socket. Somewhere, a crank is missing — or was carried off by a thoughtful ghost of a man and left where you would find it.');
        }
      } else if (!pawlIn) {
        game.playSfx('creak');
        game.say('You crank — the grate stirs, the chain sings — and the moment you breathe, the drum spins back and drops it all. The pawl is sheared. Something must hold the drum.');
      } else {
        turnWinch(game);
      }
    },
  });

  spots.push({
    id: 'pawl', x: 560, y: 500, w: 110, h: 110, label: pawlIn ? 'Your iron crow, holding' : 'Sheared pawl slot',
    onInteract(game) {
      if (pawlIn) { game.say('The crow sits wedged through the spokes, flat tongue in the pawl slot, holding every turn you win. Best travelling companion you ever had.'); return; }
      if (game.selectedItem === 'iron_crow') {
        game.useSelected();
        game.setFlag('gatehouse_pawlIn');
        game.playSfx('stone');
        game.say('The crow\'s flat tongue drops through the spokes into the pawl slot like it was forged for the job. The drum tests it once — and holds.');
        game.refreshScene();
      } else {
        game.say('The ratchet pawl is snapped clean off — the drum will not hold a turn. The slot is flat and narrow. Flat and narrow like... something you have carried since the guard room.');
      }
    },
  });

  spots.push({
    id: 'grate', x: 920, y: 300, w: 470, h: 300, label: 'The water-gate',
    onInteract(game) {
      const turns = game.getFlag('gatehouse_turns') ?? 0;
      if (turns >= 3) return;
      game.say(crankIn && pawlIn
        ? 'Iron bars, forty years shut. The winch is rigged — crank it.'
        : 'Iron bars into black water. They will move for the winch or not at all.');
    },
  });

  spots.push({
    id: 'back', x: 60, y: 80, w: 260, h: 700, label: 'The tunnel behind',
    onInteract(game) {
      game.say('Back there: the keep, the rope, the morning shift. Ahead: water. It is not a difficult comparison.');
    },
  });

  return spots;
}

function turnWinch(game) {
  const turns = (game.getFlag('gatehouse_turns') ?? 0) + 1;
  game.setFlag('gatehouse_turns', turns);
  game.playSfx('creak');
  game.refreshScene();

  if (turns === 1) {
    game.say('One full turn — the grate lifts a hand\'s width, and the crow holds it. Water slaps the bars, curious.');
  } else if (turns === 2) {
    game.say('Two — the gap is a forearm now. Grey light leaks under the grate. The sky is running out of night.');
  } else if (turns >= 3) {
    game.say('Three — the grate stands open. Cold air, reed-smell, the first birds. Edmund\'s road runs straight into the water, and you take it at a run.');
    setTimeout(() => game.completeRoom({ delay: 400 }), 1600);
  }
}
