// DECK 4 — AI Core. Peak 1.
// The chamber is empty: RESIDENT INSTANCE: MIGRATED -> MAINTENANCE CHASSIS 7.
// Puzzle: isolation-logic breakers. DOOR = A AND (NOT B) AND (C OR D);
// ALARM = B OR ((NOT C) AND D) OR (C AND D). Need DOOR live, ALARM dark.
// Unique solution: A=1, B=0, C=1, D=0. A fused relay must first be cleared
// with the magnet stylus.

import { kitDefs, panel, shadow } from '../../../shared/js/scenekit.js';
// Layout — read off the plate (art/aicore.webp): server racks along both walls,
// a round pedestal with cradle arms centre, the emitter ring above it.
const PED = { cx: 800, top: 622 };
const SHARD = { x: 900, y: 590 };
const READ = { x: 700, y: 676, w: 200, h: 56 };
const BRK = { x: 1084, y: 250, w: 160, h: 330 };
const SCH = { x: 372, y: 140, w: 330, h: 110 };
const BH = { x: 440, y: 330, w: 160, h: 310 };
const R = {
  cradle:    { x: 640, y: 520, w: 240, h: 150 },
  shard4:    { x: SHARD.x - 18, y: SHARD.y - 16, w: 64, h: 70 },
  schematic: { x: SCH.x, y: SCH.y, w: SCH.w, h: SCH.h },
  racks:     { x: 1260, y: 200, w: 320, h: 440 },
  breakers:  { x: BRK.x - 6, y: BRK.y - 6, w: BRK.w + 12, h: BRK.h + 12 },
  bulkhead:  { x: BH.x - 6, y: BH.y, w: BH.w + 12, h: BH.h },
};

export default {
  id: 'aicore',
  solution: () => {
    // the one switch setting the core's own logic accepts: door live, alarm dark
    for (let m = 0; m < 16; m++) {
      const sw = [0, 1, 2, 3].map(i => !!(m & (1 << i)));
      const { door, alarm } = evalLogic(sw);
      if (door && !alarm) return sw.map((on, i) => `${'ABCD'[i]} ${on ? 'up' : 'down'}`);
    }
    return ['no setting opens the core'];
  },
  lintStates: [{ label: 'cleared', flags: { core_relayCleared: true, core_sw0: true, core_sw2: true } }, { label: 'open', flags: { core_relayCleared: true, core_doorOpen: true } }],
  title: 'AI Core',
  intro: 'The core chamber should be the loudest room on the station — a mind\'s worth of coolant and light. It is a cathedral of dead racks around an empty cradle. "This is where the resident intelligence lived," says Gus, quieter than you have ever heard a machine be. "Before."',

  scene(state) {
    const cleared = !!state.flags.core_relayCleared;
    const solved = !!state.flags.core_doorOpen;
    const sw = [0, 1, 2, 3].map(i => !!state.flags[`core_sw${i}`]);

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${kitDefs()}
        <linearGradient id="gd_ac_wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#0e1119"/>
          <stop offset="1" stop-color="#191d2c"/>
        </linearGradient>
        <radialGradient id="gd_ac_cradle" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(79,216,208,0.14)"/>
          <stop offset="1" stop-color="rgba(79,216,208,0)"/>
        </radialGradient>
      </defs>

      <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="art/aicore.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="art/aicore.mp4" type="video/mp4"/></video></foreignObject>

      <!-- the painted racks are dead; a failing LED or two still flickers on their faces -->
      ${[[90, 300], [210, 380], [300, 460], [1300, 330], [1420, 410], [1520, 300]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="#e05252" class="flicker" opacity="0.85"/>`).join('')}

      <!-- the empty cradle: socket and shard on the painted pedestal, readout bolted to its face -->
      <g data-mount="table">
        <ellipse cx="${PED.cx}" cy="${PED.top}" rx="220" ry="60" fill="url(#gd_ac_cradle)" class="glow"/>
        <rect x="${PED.cx - 30}" y="${PED.top - 14}" width="60" height="22" rx="6" fill="#04070d" stroke="#2f9e97" stroke-width="2" opacity="0.95"/>
        <rect x="${SHARD.x}" y="${SHARD.y}" width="24" height="34" rx="4" fill="#101a26" stroke="#2f9e97" stroke-width="2" class="beckon"/>
        <text x="${SHARD.x + 12}" y="${SHARD.y + 23}" text-anchor="middle" font-size="13" fill="#4fd8d0">▮</text>
      </g>
      ${panel({ ...READ, material: 'glass', mount: 'bolts', rx: 6, body: `
        <text x="${READ.x + READ.w / 2}" y="${READ.y + 24}" text-anchor="middle" font-size="11" fill="#ff8f8f" font-family="Consolas, monospace" class="flicker">RESIDENT INSTANCE: MIGRATED</text>
        <text x="${READ.x + READ.w / 2}" y="${READ.y + 42}" text-anchor="middle" font-size="11" fill="#ffb45e" font-family="Consolas, monospace">→ MAINTENANCE CHASSIS 7</text>` })}

      <!-- the isolation breakers: a cabinet bolted to the right-hand pillar -->
      ${panel({ ...BRK, material: 'steel', mount: 'bolts', body: `
        <rect x="${BRK.x + 4}" y="${BRK.y + 4}" width="${BRK.w - 8}" height="${BRK.h - 8}" rx="8" fill="none" stroke="${solved ? '#7bc47f' : cleared ? '#4fd8d0' : '#ffb45e'}" stroke-width="3" class="${solved ? '' : 'beckon'}"/>
        <text x="${BRK.x + BRK.w / 2}" y="${BRK.y + 30}" text-anchor="middle" font-size="11.5" fill="#cfd8e3" font-family="Consolas, monospace">ISOLATION LOGIC</text>
        ${['A', 'B', 'C', 'D'].map((l, i) => `
          <g>
            <rect x="${BRK.x + 18}" y="${BRK.y + 46 + i * 60}" width="50" height="42" rx="6" fill="#0c0f18" stroke="#26313f" stroke-width="2"/>
            <rect x="${BRK.x + 24}" y="${sw[i] ? BRK.y + 50 + i * 60 : BRK.y + 68 + i * 60}" width="38" height="18" rx="4" fill="${sw[i] ? '#4fd8d0' : '#39485a'}"/>
            <text x="${BRK.x + 82}" y="${BRK.y + 73 + i * 60}" font-size="15" fill="#cfd8e3" font-family="Consolas, monospace">${l} ${sw[i] ? '=1' : '=0'}</text>
          </g>`).join('')}
        ${cleared ? '' : `<g><circle cx="${BRK.x + BRK.w / 2}" cy="${BRK.y + BRK.h - 40}" r="12" fill="#0c0f18" stroke="#e05252" stroke-width="3"/><path d="M${BRK.x + BRK.w / 2 - 8} ${BRK.y + BRK.h - 48} l16 16 m0 -16 l-16 16" stroke="#e05252" stroke-width="2.5"/><text x="${BRK.x + BRK.w / 2}" y="${BRK.y + BRK.h - 14}" text-anchor="middle" font-size="11.5" fill="#e05252" font-family="Consolas, monospace">RELAY FUSED</text></g>`}` })}

      <!-- the logic, etched into a steel plate bolted above the far bulkhead -->
      ${panel({ ...SCH, material: 'steel', mount: 'bolts', body: `
        <text x="${SCH.x + SCH.w / 2}" y="${SCH.y + 32}" text-anchor="middle" font-size="12.5" fill="#4fd8d0" font-family="Consolas, monospace">DOOR = A ∧ ¬B ∧ (C ∨ D)</text>
        <text x="${SCH.x + SCH.w / 2}" y="${SCH.y + 56}" text-anchor="middle" font-size="12.5" fill="#ff8f8f" font-family="Consolas, monospace">ALARM = B ∨ (¬C ∧ D) ∨ (C ∧ D)</text>
        <text x="${SCH.x + SCH.w / 2}" y="${SCH.y + 86}" text-anchor="middle" font-size="11.5" fill="#9fb0c4" font-family="Consolas, monospace">door LIVE · alarm DARK — underlined twice</text>` })}

      <!-- the far bulkhead, between the left racks and the pedestal -->
      <g data-mount="wall">
        <path d="M${BH.x} ${BH.y + BH.h} L${BH.x} ${BH.y + 50} Q${BH.x + BH.w / 2} ${BH.y - 10} ${BH.x + BH.w} ${BH.y + 50} L${BH.x + BH.w} ${BH.y + BH.h} Z" fill="${solved ? '#0b131e' : 'url(#sk_steel)'}" stroke="#26313f" stroke-width="7"/>
        ${solved
          ? `<text x="${BH.x + BH.w / 2}" y="${BH.y + BH.h / 2}" text-anchor="middle" font-size="13" fill="#7bc47f" font-family="Consolas, monospace" class="flicker">RELEASED</text>`
          : `<circle cx="${BH.x + BH.w / 2}" cy="${BH.y + BH.h / 2}" r="20" fill="#0c0f18" stroke="#e05252" stroke-width="4"/>
             <rect x="${BH.x + BH.w / 2 - 8}" y="${BH.y + BH.h / 2 - 8}" width="16" height="16" rx="3" fill="#e05252" opacity="0.8"/>`}
        ${shadow(BH.x + BH.w / 2, BH.y + BH.h, BH.w * 0.6, 10)}
      </g>

      <path d="M0 900 L0 860 Q800 905 1600 860 L1600 900 Z" fill="#04070d"/>
    </svg>`;
  },

  hotspots(state) {
    const cleared = !!state.flags.core_relayCleared;
    const solved = !!state.flags.core_doorOpen;
    const spots = [];

    spots.push({
      id: 'cradle', ...R.cradle, label: 'The empty cradle',
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
      id: 'shard4', ...R.shard4, label: 'A shard by the socket',
      onInteract(game) {
        game.journal.add('shard4', { title: 'AI Core — the cradle socket', category: 'sun', sun: { rays: 2, letter: 'W' } });
        game.say('A memory shard, left beside the empty socket like a flower on a grave: —the upload chair, counting backward from ten, reaching seven— The count never finishes. You know, somehow, that it never got to finish.');
      },
    });

    spots.push({
      id: 'schematic', ...R.schematic, label: 'Etched schematic',
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
      id: 'racks', plate: 'the server racks', ...R.racks, label: 'Dead racks',
      onInteract(game) {
        game.say('Rack after rack, cold as a filing cabinet. Enough silicon to hold a mind — and none of it holding one. The emptiness here is specific. Curated, almost.');
      },
    });

    spots.push({
      id: 'breakers', ...R.breakers, label: cleared ? 'Isolation breakers' : 'Breakers — relay fused',
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
      id: 'bulkhead', ...R.bulkhead, label: solved ? 'Bulkhead — released' : 'Far bulkhead — sealed',
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
        <div class="puzzle-hero" style="background-image:url(art/pz-breakers.webp)"></div>
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
