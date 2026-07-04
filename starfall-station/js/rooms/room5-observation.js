// DECK 5 — Observation Deck. Breather.
// Puzzle: attitude ghosts on the dome show glyph strings; the calibration
// card translates: ▲=1 •=2 ◆=8 ◇=4 ○=0. Set PITCH 12 / YAW 284 / ROLL 0.
// Reward: deck rights itself, comms console powers -> RV-7 vector
// (AZ 117 / EL 43, journaled — required at the finale). Shard 5 (4 peaks, K).

const TARGET = { pitch: 12, yaw: 284, roll: 0 };

export default {
  id: 'observation',
  title: 'Observation Deck',
  intro: 'The dome opens onto everything: stars, the bruise-colored limb of the planet, and — if you look with the wrong part of you — the drop. The deck lists four degrees to port and your inner ear files a formal complaint. The station is tumbling, very slowly, like something asleep and dreaming badly.',

  scene(state) {
    const level = !!state.flags.obs_leveled;
    const tilt = level ? 0 : -4;

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gd_ob_space" cx="0.5" cy="0.3" r="1">
          <stop offset="0" stop-color="#070d1a"/>
          <stop offset="1" stop-color="#03050c"/>
        </radialGradient>
        <radialGradient id="gd_ob_planet" cx="0.4" cy="0.3" r="0.9">
          <stop offset="0" stop-color="#4a7cb5"/>
          <stop offset="0.55" stop-color="#25476f"/>
          <stop offset="1" stop-color="#0e2036"/>
        </radialGradient>
      </defs>

      <g style="transform: rotate(${tilt}deg); transform-origin: 800px 700px; transition: transform 1.4s cubic-bezier(0.22,1,0.36,1);">
        <!-- dome and space -->
        <rect x="-200" y="-100" width="2000" height="800" fill="url(#gd_ob_space)"/>
        ${[[180, 90], [420, 60], [700, 130], [980, 50], [1240, 110], [1450, 70], [320, 210], [880, 230], [1350, 250], [560, 300]]
          .map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${1 + (i % 3) * 0.5}" fill="#fff" opacity="${0.4 + (i % 4) * 0.15}" class="${i % 3 ? '' : 'flicker'}"/>`).join('')}
        <!-- planet limb, glowing faintly with entry heat -->
        <circle cx="800" cy="1180" r="620" fill="url(#gd_ob_planet)"/>
        <path d="M340 640 Q800 520 1260 640" stroke="rgba(255,140,70,0.5)" stroke-width="5" fill="none" class="flicker"/>

        <!-- attitude ghosts: glyph HUD projections drifting on the glass -->
        <g font-family="Consolas, monospace" class="float">
          <g opacity="0.85">
            <rect x="330" y="180" width="150" height="52" rx="8" fill="rgba(13,26,38,0.65)" stroke="rgba(79,216,208,0.45)" stroke-width="1.5"/>
            <text x="352" y="212" font-size="20" fill="#8ff0ea">P: ▲ •</text>
          </g>
          <g opacity="0.85">
            <rect x="700" y="120" width="180" height="52" rx="8" fill="rgba(13,26,38,0.65)" stroke="rgba(79,216,208,0.45)" stroke-width="1.5"/>
            <text x="722" y="152" font-size="20" fill="#8ff0ea">Y: • ◆ ◇</text>
          </g>
          <g opacity="0.85">
            <rect x="1120" y="200" width="120" height="52" rx="8" fill="rgba(13,26,38,0.65)" stroke="rgba(79,216,208,0.45)" stroke-width="1.5"/>
            <text x="1146" y="232" font-size="20" fill="#8ff0ea">R: ○</text>
          </g>
        </g>

        <!-- dome ribs -->
        ${[-500, -180, 140, 460, 780, 1100, 1420, 1740].map(x =>
          `<path d="M${x} 700 Q800 -240 ${1600 - x + 0} 700" stroke="#141c2a" stroke-width="16" fill="none" opacity="0.9"/>`).join('')}
      </g>

      <!-- deck floor (doesn't tilt with the view — you tilt WITH it, hence the ghosts) -->
      <rect y="640" width="1600" height="260" fill="#10141f"/>
      <g stroke="#0a0d15" stroke-width="3" opacity="0.7">
        ${[700, 770, 845].map(y => `<line x1="0" y1="${y}" x2="1600" y2="${y}"/>`).join('')}
      </g>

      <!-- telescope -->
      <g>
        <rect x="240" y="560" width="26" height="130" fill="#26313f"/>
        <g transform="rotate(-28 253 560)">
          <rect x="213" y="520" width="200" height="44" rx="18" fill="#2b3547" stroke="#39485a" stroke-width="3"/>
          <circle cx="410" cy="542" r="20" fill="#141c26" stroke="#4fd8d0" stroke-width="2.5"/>
        </g>
        <!-- shard 5 in the housing -->
        <rect x="286" y="600" width="24" height="34" rx="4" fill="#101a26" stroke="#2f9e97" stroke-width="2" class="beckon"/>
        <text x="298" y="623" text-anchor="middle" font-size="13" fill="#4fd8d0">▮</text>
      </g>

      <!-- calibration card, clipped to the telescope mount -->
      <g class="sway slow">
        <rect x="360" y="580" width="120" height="90" rx="6" fill="#d7e8ff" transform="rotate(4 420 625)"/>
        <g font-family="Consolas, monospace" font-size="13" fill="#1d3a63" transform="rotate(4 420 625)">
          <text x="376" y="602">▲=1  •=2</text>
          <text x="376" y="622">◆=8  ◇=4</text>
          <text x="376" y="642">○=0</text>
          <text x="376" y="662" font-size="9" fill="#5d7080">calibration — do not lose again</text>
        </g>
      </g>

      <!-- attitude console -->
      <g>
        <rect x="640" y="660" width="330" height="150" rx="12" fill="#141c26" stroke="${level ? '#7bc47f' : '#ffb45e'}" stroke-width="4" class="${level ? '' : 'beckon'}"/>
        <text x="805" y="690" text-anchor="middle" font-size="13" fill="#8fa3b8" font-family="Consolas, monospace">ATTITUDE CONTROL</text>
        ${['PITCH', 'YAW', 'ROLL'].map((l, i) => `
          <text x="${700 + i * 105}" y="726" text-anchor="middle" font-size="11" fill="#5d7080" font-family="Consolas, monospace">${l}</text>
          <rect x="${664 + i * 105}" y="736" width="72" height="34" rx="6" fill="#0c121c" stroke="#26313f" stroke-width="2"/>
          <text x="${700 + i * 105}" y="760" text-anchor="middle" font-size="17" fill="${level ? '#7bc47f' : '#8ff0ea'}"
            font-family="Consolas, monospace">${level ? [12, 284, 0][i] : ['—', '—', '—'][i]}</text>`).join('')}
      </g>

      <!-- comms console -->
      <g>
        <rect x="1120" y="660" width="300" height="150" rx="12" fill="#141c26" stroke="#2b3547" stroke-width="4"/>
        <text x="1270" y="690" text-anchor="middle" font-size="13" fill="#8fa3b8" font-family="Consolas, monospace">COMMS</text>
        ${level
          ? `<text x="1270" y="726" text-anchor="middle" font-size="12" fill="#7bc47f" font-family="Consolas, monospace" class="flicker">CARRIER DETECTED</text>
             <text x="1270" y="750" text-anchor="middle" font-size="12" fill="#8ff0ea" font-family="Consolas, monospace">RV-7 HOLDING</text>
             <text x="1270" y="774" text-anchor="middle" font-size="12" fill="#8ff0ea" font-family="Consolas, monospace">AZ 117 · EL 43</text>`
          : `<text x="1270" y="745" text-anchor="middle" font-size="12" fill="#5d7080" font-family="Consolas, monospace">NO SIGNAL — ANTENNA TUMBLING</text>`}
      </g>

      <path d="M0 900 L0 862 Q800 905 1600 862 L1600 900 Z" fill="#04070d"/>
    </svg>`;
  },

  hotspots(state) {
    const level = !!state.flags.obs_leveled;
    const spots = [];

    spots.push({
      id: 'ghosts', x: 320, y: 110, w: 930, h: 150, label: 'Attitude ghosts on the glass',
      onInteract(game) {
        const html = `<div class="datapad"><div class="pad-title">Attitude ghosts — dome HUD</div>
          P: ▲ •<br>Y: • ◆ ◇<br>R: ○<br>
          <span style="opacity:0.7">— the station's own dead-reckoning, projected in maintenance
          glyphs because the crew display firmware was "on the list to fix".</span></div>`;
        game.journal.add('note_ghosts', { title: 'Attitude ghosts (Observation)', category: 'note', html });
        game.dialog({ title: 'The Ghosts', html });
      },
    });

    spots.push({
      id: 'card', x: 350, y: 565, w: 150, h: 120, label: 'Calibration card',
      onInteract(game) {
        const html = `<div class="datapad"><div class="pad-title">Glyph calibration card</div>
          ▲ = 1 &nbsp; • = 2 &nbsp; ◆ = 8 &nbsp; ◇ = 4 &nbsp; ○ = 0<br>
          <span style="opacity:0.7">"calibration — do not lose again" — clipped to the telescope
          by someone who had, at least once, lost it.</span></div>`;
        game.journal.add('note_card', { title: 'Calibration card (Observation)', category: 'note', html });
        game.dialog({ title: 'The Card', html });
      },
    });

    spots.push({
      id: 'shard5', x: 272, y: 588, w: 55, h: 60, label: 'A shard in the housing',
      onInteract(game) {
        game.journal.add('shard5', { title: 'Observation — the telescope housing', category: 'sun', sun: { rays: 4, letter: 'K' } });
        game.say('A memory shard, wedged in the telescope housing: —stars through the dome, and you promising them you\'d stay— A promise someone kept in the strangest possible way.');
      },
    });

    spots.push({
      id: 'telescope', x: 200, y: 490, w: 240, h: 110, label: 'The telescope',
      onInteract(game) {
        game.say('Through the eyepiece: the rescue vessel, a patient chip of light holding its distance. It will not come closer. Debris field, probably. Or orders. Either way — you go to it, not it to you.');
      },
    });

    spots.push({
      id: 'attitude', x: 630, y: 650, w: 350, h: 170, label: level ? 'Attitude control (level)' : 'Attitude control',
      onInteract(game) {
        if (level) { game.say('PITCH 12, YAW 284, ROLL 0. The horizon sits where horizons should. Your inner ear withdraws its complaint.'); return; }
        openAttitudePuzzle(game);
      },
    });

    spots.push({
      id: 'comms', x: 1110, y: 650, w: 320, h: 170, label: 'Comms console',
      onInteract(game) {
        if (!level) { game.say('NO SIGNAL — ANTENNA TUMBLING, says the comms panel, with the weary patience of a machine that has said it many times to an empty room.'); return; }
        const html = `<div class="datapad"><div class="pad-title">Comms — carrier log</div>
          CARRIER DETECTED: RV-7 "TERN"<br>
          STATUS: HOLDING AT SAFE RANGE (debris field)<br>
          RELATIVE VECTOR: <strong>AZ 117 · EL 43</strong><br>
          MSG (repeating): "STARFALL, WE SEE YOU. UPLINK WINDOW OPEN. WE ARE LISTENING."</div>
          <p style="margin-top:10px; color:var(--text-dim); font-style:italic;">We are listening.
          Not "pods away when ready". Listening. As if they expect a transmission, not a passenger.
          You log the vector: AZ 117, EL 43.</p>`;
        game.journal.add('note_vector', { title: 'RV-7 hold vector — AZ 117 / EL 43', category: 'note', html });
        game.dialog({ title: 'The Carrier', html });
      },
    });

    spots.push({
      id: 'exit', x: 1490, y: 380, w: 110, h: 260, label: 'Companionway down',
      onInteract(game) {
        if (!level) { game.say('The companionway hatch refuses while the deck reads unsafe attitude. Machines are such sticklers when you are in a hurry.'); return; }
        if (!game.journal.has('note_vector')) { game.say('Gus tips toward the comms console. "The carrier log. Read it, log it. Where we are going, you will want that vector written down."'); return; }
        if (!game.journal.has('shard5')) { game.say('"Shard in the telescope housing," says Gus. "Fourth of six. I am told collecting things is soothing."'); return; }
        game.say('Down the companionway, toward the reactor\'s bass hum — the one part of Starfall Station that never stopped working.');
        game.completeRoom({ delay: 700 });
      },
    });

    return spots;
  },

  hints: [
    { text: 'The dome ghosts are numbers wearing masks, and the mask-maker left the key clipped to the telescope.', cost: 60 },
    { text: 'Translate glyph by glyph: triangle-dot is 12. Do the same for yaw and roll, then feed all three to attitude control.', cost: 120 },
    { text: 'Pitch 12, yaw 284, roll 0.', cost: 240 },
  ],
};

function openAttitudePuzzle(game) {
  const vals = {
    pitch: game.getFlag('obs_pitch') ?? 0,
    yaw: game.getFlag('obs_yaw') ?? 47,
    roll: game.getFlag('obs_roll') ?? 313,
  };
  const MAX = { pitch: 90, yaw: 360, roll: 360 };

  game.openPuzzle({
    id: 'obs_attitude',
    title: 'Attitude Control',
    wide: true,
    render(body, api) {
      function draw() {
        body.innerHTML = `
          <p class="puzzle-desc">Three axes, three thruster banks, one tumbling station.
          The dome ghosts know the correct attitude — they have been broadcasting it in
          maintenance glyphs the whole time.</p>
          <div class="puzzle-row" style="gap:30px;">
            ${['pitch', 'yaw', 'roll'].map(axis => `
              <div style="text-align:center;">
                <div class="lever-label" style="margin-bottom:6px;">${axis.toUpperCase()}</div>
                <div class="dial-face" style="width:84px; margin:0 auto;" data-face="${axis}">${vals[axis]}</div>
                <div class="puzzle-row" style="gap:6px; margin-top:8px;">
                  <button class="dial-btn" data-axis="${axis}" data-d="-10">−10</button>
                  <button class="dial-btn" data-axis="${axis}" data-d="-1">−1</button>
                  <button class="dial-btn" data-axis="${axis}" data-d="1">+1</button>
                  <button class="dial-btn" data-axis="${axis}" data-d="10">+10</button>
                </div>
              </div>`).join('')}
          </div>
          <div class="puzzle-row" style="margin-top:16px;">
            <button class="btn btn-primary" id="obs-fire">Fire Thrusters</button>
          </div>
          <div class="puzzle-feedback"></div>`;

        body.querySelectorAll('[data-axis]').forEach(b => b.addEventListener('click', () => {
          const axis = b.dataset.axis;
          const max = MAX[axis];
          vals[axis] = ((vals[axis] + Number(b.dataset.d)) % max + max) % max;
          game.setFlag(`obs_${axis}`, vals[axis]);
          const face = body.querySelector(`[data-face="${axis}"]`);
          face.textContent = vals[axis];
          face.classList.remove('tick'); void face.offsetWidth; face.classList.add('tick');
          game.playSfx('click');
        }));

        body.querySelector('#obs-fire').addEventListener('click', () => {
          if (vals.pitch === TARGET.pitch && vals.yaw === TARGET.yaw && vals.roll === TARGET.roll) {
            game.setFlag('obs_leveled');
            game.playSfx('stone');
            api.solved({ message: 'The thrusters cough in sequence and the whole deck swings gently level, stars settling into place like a shaken photograph forgiven. The comms console lights up mid-sentence: CARRIER DETECTED.' });
            game.refreshScene();
          } else {
            api.fail('The station lurches, complains, and settles back into its wrong lean. Not that attitude.');
          }
        });
      }
      draw();
    },
  });
}
