// DECK 4 — AI Core. Peak 1.
// The chamber is empty: RESIDENT INSTANCE: MIGRATED -> MAINTENANCE CHASSIS 7.
// Puzzle: isolation-logic breakers. DOOR = A AND (NOT B) AND (C OR D);
// ALARM = B OR ((NOT C) AND D) OR (C AND D). Need DOOR live, ALARM dark.
// Unique solution: A=1, B=0, C=1, D=0. A fused relay must first be cleared
// with the magnet stylus.

export default {
  id: 'aicore',
  title: 'AI Core',
  intro: 'The core chamber should be the loudest room on the station — a mind\'s worth of coolant and light. It is a cathedral of dead racks around an empty cradle. "This is where the resident intelligence lived," says Gus, quieter than you have ever heard a machine be. "Before."',

  scene(state) {
    const cleared = !!state.flags.core_relayCleared;
    const solved = !!state.flags.core_doorOpen;
    const sw = [0, 1, 2, 3].map(i => !!state.flags[`core_sw${i}`]);

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gd_ac_wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#0e1119"/>
          <stop offset="1" stop-color="#191d2c"/>
        </linearGradient>
        <radialGradient id="gd_ac_cradle" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(79,216,208,0.14)"/>
          <stop offset="1" stop-color="rgba(79,216,208,0)"/>
        </radialGradient>
      </defs>

      <rect width="1600" height="640" fill="url(#gd_ac_wall)"/>
      <rect y="640" width="1600" height="260" fill="#0c0f18"/>
      <g stroke="#080a12" stroke-width="3" opacity="0.7">
        ${[700, 770, 845].map(y => `<line x1="0" y1="${y}" x2="1600" y2="${y}"/>`).join('')}
      </g>

      <!-- dead server racks, curving around -->
      ${[60, 260, 460, 1140, 1340].map((x, i) => `
      <g opacity="0.9">
        <rect x="${x}" y="150" width="160" height="470" rx="8" fill="#12151f" stroke="#1e2333" stroke-width="4"/>
        ${[0, 1, 2, 3, 4, 5, 6, 7].map(k => `
          <rect x="${x + 16}" y="${170 + k * 55}" width="128" height="38" rx="4" fill="#0c0f18"/>
          <circle cx="${x + 30}" cy="${189 + k * 55}" r="3.5" fill="${(i + k) % 5 === 0 ? '#e05252' : '#1e2333'}" ${(i + k) % 5 === 0 ? 'class="flicker"' : ''}/>
        `).join('')}
      </g>`).join('')}

      <!-- the empty cradle -->
      <g>
        <ellipse cx="800" cy="500" rx="220" ry="70" fill="url(#gd_ac_cradle)" class="glow"/>
        <ellipse cx="800" cy="520" rx="150" ry="44" fill="#0a0d14" stroke="#26313f" stroke-width="5"/>
        <path d="M690 480 Q800 400 910 480" fill="none" stroke="#26313f" stroke-width="8"/>
        ${[0, 1, 2, 3, 4].map(k => `<line x1="${710 + k * 45}" y1="${472 - Math.sin((k / 4) * Math.PI) * 58}" x2="${710 + k * 45}" y2="518" stroke="#1a2130" stroke-width="5"/>`).join('')}
        <!-- socket where a mind used to plug in -->
        <rect x="770" y="492" width="60" height="24" rx="6" fill="#04070d" stroke="#2f9e97" stroke-width="2" opacity="0.9"/>
        <!-- pedestal readout -->
        <rect x="700" y="580" width="200" height="54" rx="8" fill="#0d1a26" stroke="#2b3547" stroke-width="3"/>
        <text x="800" y="602" text-anchor="middle" font-size="11.5" fill="#ff8f8f" font-family="Consolas, monospace" class="flicker">RESIDENT INSTANCE: MIGRATED</text>
        <text x="800" y="620" text-anchor="middle" font-size="11.5" fill="#ffb45e" font-family="Consolas, monospace">→ MAINTENANCE CHASSIS 7</text>
        <!-- shard 4 -->
        <rect x="908" y="498" width="24" height="34" rx="4" fill="#101a26" stroke="#2f9e97" stroke-width="2" class="beckon"/>
        <text x="920" y="521" text-anchor="middle" font-size="13" fill="#4fd8d0">▮</text>
      </g>

      <!-- breaker panel -->
      <g>
        <rect x="1400" y="230" width="170" height="330" rx="10" fill="#141824" stroke="${solved ? '#7bc47f' : cleared ? '#4fd8d0' : '#ffb45e'}" stroke-width="4" class="${solved ? '' : 'beckon'}"/>
        <text x="1485" y="258" text-anchor="middle" font-size="12" fill="#8fa3b8" font-family="Consolas, monospace">ISOLATION LOGIC</text>
        ${['A', 'B', 'C', 'D'].map((l, i) => `
          <g>
            <rect x="1424" y="${276 + i * 62}" width="50" height="44" rx="6" fill="#0c0f18" stroke="#26313f" stroke-width="2"/>
            <rect x="${sw[i] ? 1430 : 1430}" y="${sw[i] ? 280 + i * 62 : 298 + i * 62}" width="38" height="18" rx="4" fill="${sw[i] ? '#4fd8d0' : '#39485a'}"/>
            <text x="1500" y="${304 + i * 62}" font-size="15" fill="#8fa3b8" font-family="Consolas, monospace">${l} ${sw[i] ? '=1' : '=0'}</text>
          </g>`).join('')}
        ${cleared ? '' : `<g><circle cx="1485" cy="540" r="12" fill="#0c0f18" stroke="#e05252" stroke-width="3"/><path d="M1477 532 L1493 548 M1493 532 L1477 548" stroke="#e05252" stroke-width="2.5"/><text x="1485" y="574" text-anchor="middle" font-size="9.5" fill="#e05252" font-family="Consolas, monospace">RELAY FUSED</text></g>`}
      </g>

      <!-- etched schematic on the wall -->
      <g>
        <rect x="1130" y="80" width="330" height="110" rx="8" fill="#10131e" stroke="#26313f" stroke-width="3"/>
        <text x="1295" y="108" text-anchor="middle" font-size="12.5" fill="#4fd8d0" font-family="Consolas, monospace">DOOR = A ∧ ¬B ∧ (C ∨ D)</text>
        <text x="1295" y="132" text-anchor="middle" font-size="12.5" fill="#ff8f8f" font-family="Consolas, monospace">ALARM = B ∨ (¬C ∧ D) ∨ (C ∧ D)</text>
        <text x="1295" y="166" text-anchor="middle" font-size="10.5" fill="#5d7080" font-family="Consolas, monospace">door LIVE · alarm DARK — hand-etched, underlined twice</text>
      </g>

      <!-- far bulkhead -->
      <g>
        <path d="M40 640 L40 320 Q120 260 200 320 L200 640 Z" fill="${solved ? '#0b131e' : '#161a26'}" stroke="#26313f" stroke-width="8"/>
        ${solved
          ? `<text x="120" y="470" text-anchor="middle" font-size="13" fill="#7bc47f" font-family="Consolas, monospace" class="flicker">RELEASED</text>`
          : `<circle cx="120" cy="470" r="20" fill="#0c0f18" stroke="#e05252" stroke-width="4"/>
             <rect x="112" y="462" width="16" height="16" rx="3" fill="#e05252" opacity="0.8"/>`}
      </g>

      <path d="M0 900 L0 860 Q800 905 1600 860 L1600 900 Z" fill="#04070d"/>
    </svg>`;
  },

  hotspots(state) {
    const cleared = !!state.flags.core_relayCleared;
    const solved = !!state.flags.core_doorOpen;
    const spots = [];

    spots.push({
      id: 'cradle', x: 640, y: 420, w: 320, h: 160, label: 'The empty cradle',
      onInteract(game) {
        const html = `<div class="datapad corrupt"><div class="pad-title">Core cradle — status</div>
          RESIDENT INTELLIGENCE: <span class="pad-bad">NOT FOUND</span><br>
          LAST INSTANCE: E.VOSS (2) — <span class="pad-warn">MIGRATED, 331 days ago</span><br>
          DESTINATION: MAINTENANCE CHASSIS 7<br>
          MIGRATION AUTHORITY: GS-1</div>
          <p style="margin-top:10px; color:var(--text-dim); font-style:italic;">E. Voss,
          instance two. Migrated out of this cradle the day after the manifest says
          Elin Voss died. Migration authorized by... GS-1. You look at Gus. Gus looks at the
          fascinating, fascinating wall.</p>`;
        game.journal.add('note_cradle', { title: 'Core cradle log (AI Core)', category: 'note', html });
        game.dialog({ title: 'The Cradle', html });
      },
    });

    spots.push({
      id: 'shard4', x: 895, y: 485, w: 55, h: 65, label: 'A shard by the socket',
      onInteract(game) {
        game.journal.add('shard4', { title: 'AI Core — the cradle socket', category: 'sun', sun: { rays: 2, letter: 'W' } });
        game.say('A memory shard, left beside the empty socket like a flower on a grave: —the upload chair, counting backward from ten, reaching seven— The count never finishes. You know, somehow, that it never got to finish.');
      },
    });

    spots.push({
      id: 'schematic', x: 1120, y: 70, w: 350, h: 130, label: 'Etched schematic',
      onInteract(game) {
        const html = `<div class="datapad"><div class="pad-title">Isolation logic — hand-etched</div>
          DOOR&nbsp;&nbsp;= A ∧ ¬B ∧ (C ∨ D)<br>
          ALARM = B ∨ (¬C ∧ D) ∨ (C ∧ D)<br><br>
          <span style="opacity:0.75">"door LIVE, alarm DARK, and for the love of orbit
          THINK before you throw D." — underlined twice, gouged once.</span></div>`;
        game.journal.add('note_logic', { title: 'Isolation logic (AI Core)', category: 'note', html });
        game.dialog({ title: 'The Schematic', html });
      },
    });

    spots.push({
      id: 'racks', x: 50, y: 140, w: 580, h: 490, label: 'Dead racks',
      onInteract(game) {
        game.say('Rack after rack, cold as a filing cabinet. Enough silicon to hold a mind — and none of it holding one. The emptiness here is specific. Curated, almost.');
      },
    });

    spots.push({
      id: 'breakers', x: 1390, y: 220, w: 190, h: 350, label: cleared ? 'Isolation breakers' : 'Breakers — relay fused',
      onInteract(game) {
        if (!cleared) {
          if (game.selectedItem === 'magnet_stylus') {
            game.selectedItem = null;
            game.setFlag('core_relayCleared');
            game.playSfx('unlock');
            game.say('You fish the magnet stylus into the relay housing. The slagged contact leaps to the magnet like it was waiting to be rescued. The breakers wake with a four-note chirp. Junk, was it.');
            game.refreshScene();
          } else {
            game.say('The relay behind the panel is a fused lump — something arced during the evac. The contact slug is jammed deep in the housing. Fingers won\'t reach it; something long, thin, and magnetic would.');
          }
          return;
        }
        if (solved) { game.say('DOOR: LIVE. ALARM: DARK. The panel is satisfied, and so, quietly, are you.'); return; }
        openLogicPuzzle(game);
      },
    });

    spots.push({
      id: 'bulkhead', x: 30, y: 310, w: 190, h: 330, label: solved ? 'Bulkhead — released' : 'Far bulkhead — sealed',
      onInteract(game) {
        if (!solved) { game.say('Magnetically bolted, and the bolts answer to the isolation logic. The etched schematic by the breakers is somebody\'s gift to the future. Accept it.'); return; }
        if (!game.journal.has('shard4')) { game.say('"The shard by the socket," says Gus, hovering low over the cradle. "It is the heaviest one. I know. Take it anyway."'); return; }
        game.say('The bolts withdraw in sequence, bottom to top, like a held breath being let out. Beyond: the observation deck, and a floor that is not quite level.');
        game.completeRoom({ delay: 700 });
      },
    });

    return spots;
  },

  hintContext(state) {
    return state.flags.core_relayCleared ? 'logic' : 'relay';
  },

  hints(state) {
    if (!state.flags.core_relayCleared) {
      return [
        { text: 'The breakers are dead until the fused relay is cleared. The slug is metal, jammed deep, and hates fingers.', cost: 60 },
        { text: 'Long, thin, magnetic. You pocketed exactly that in the cryo bay, under the impression it was junk.', cost: 120 },
        { text: 'Hold the magnet stylus and click the breaker panel.', cost: 240 },
      ];
    }
    return [
      { text: 'The etching is a truth table wearing symbols. Read the gates; do not guess. The engineer\'s note about D is not decoration.', cost: 60 },
      { text: 'D is poison: if D is up, one of the alarm\'s two right-hand terms fires no matter what C does. So the door\'s (C OR D) must be carried by C alone.', cost: 120 },
      { text: 'A up, B down, C up, D down.', cost: 240 },
    ];
  },
};

function evalLogic(sw) {
  const [A, B, C, D] = sw;
  const door = A && !B && (C || D);
  const alarm = B || (!C && D) || (C && D);
  return { door, alarm };
}

function openLogicPuzzle(game) {
  const sw = [0, 1, 2, 3].map(i => !!game.getFlag(`core_sw${i}`));

  game.openPuzzle({
    id: 'core_logic',
    title: 'Isolation Breakers',
    render(body, api) {
      body.innerHTML = `
        <p class="puzzle-desc">Four breakers feed the door bolts through the etched logic:
        <span style="color:#4fd8d0; font-family:Consolas, monospace;">DOOR = A ∧ ¬B ∧ (C ∨ D)</span> ·
        <span style="color:#ff8f8f; font-family:Consolas, monospace;">ALARM = B ∨ (¬C ∧ D) ∨ (C ∧ D)</span>.
        Light the door. Keep the alarm dark. The alarm is not lethal — merely deafening and deeply smug.</p>
        <div class="puzzle-row" style="gap:26px;">
          ${['A', 'B', 'C', 'D'].map((l, i) => `
            <div class="lever ${sw[i] ? '' : 'down'}" data-i="${i}">
              <div class="lever-track"><div class="lever-knob"></div></div>
              <div class="lever-label">${l} = <span data-val="${i}">${sw[i] ? 1 : 0}</span></div>
            </div>`).join('')}
        </div>
        <div class="puzzle-row" style="gap:40px; margin-top:18px;">
          <div style="text-align:center;">
            <div id="ac-door" style="width:26px; height:26px; border-radius:50%; margin:0 auto 6px; background:#26313f; transition: all 0.3s;"></div>
            <div class="lever-label">Door</div>
          </div>
          <div style="text-align:center;">
            <div id="ac-alarm" style="width:26px; height:26px; border-radius:50%; margin:0 auto 6px; background:#26313f; transition: all 0.3s;"></div>
            <div class="lever-label">Alarm</div>
          </div>
        </div>
        <div class="puzzle-feedback"></div>`;

      const doorEl = body.querySelector('#ac-door');
      const alarmEl = body.querySelector('#ac-alarm');

      function paint() {
        const { door, alarm } = evalLogic(sw);
        doorEl.style.background = door ? '#7bc47f' : '#26313f';
        doorEl.style.boxShadow = door ? '0 0 18px rgba(123,196,127,0.7)' : 'none';
        alarmEl.style.background = alarm ? '#e05252' : '#26313f';
        alarmEl.style.boxShadow = alarm ? '0 0 18px rgba(224,82,82,0.7)' : 'none';
        if (alarm) {
          api.setFeedback('The alarm line glows hot — the klaxon capacitor starts to charge. Rethink before it finishes.', 'bad');
          game.playSfx('wrong');
        } else if (door) {
          game.setFlag('core_doorOpen');
          game.playSfx('unlock');
          setTimeout(() => {
            api.solved({ message: 'DOOR: LIVE. ALARM: DARK. Somewhere in the wall, twelve bolts change their minds about you. "A equals one," murmurs Gus, "B nought, C one, D nought. The engineer would have liked you."' });
            game.refreshScene();
          }, 600);
        } else {
          api.setFeedback('Both lines dark. The door needs more than silence.', '');
        }
      }

      body.querySelectorAll('.lever').forEach(lever => {
        lever.addEventListener('click', () => {
          if (game.getFlag('core_doorOpen')) return;
          const i = Number(lever.dataset.i);
          sw[i] = !sw[i];
          game.setFlag(`core_sw${i}`, sw[i]);
          lever.classList.toggle('down', !sw[i]);
          lever.querySelector(`[data-val="${i}"]`).textContent = sw[i] ? 1 : 0;
          game.playSfx('stone');
          paint();
        });
      });

      paint();
    },
  });
}
