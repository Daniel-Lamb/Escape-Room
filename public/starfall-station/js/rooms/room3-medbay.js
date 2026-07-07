// DECK 3 — Crew Quarters & Med Bay.
// Puzzle: med locker keypad. UV lamp reveals prints on 2, 0, 8, 5; Ibarra's
// datapad says he sets every code to the year Aurora Station was lost; the
// corridor memorial reads "AURORA STATION — LOST 2085". Code: 2085.
// Foreshadows: crew manifest (VOSS deceased, backup complete), the 212 kg scale.

import { registerItems } from '../../../shared/js/items.js';

registerItems({
  keycard_blue: {
    name: 'Blue Keycard',
    description: 'CORE ACCESS — LEVEL 2. Chen\'s photo looks tired of the photographer.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="14" width="32" height="21" rx="4" fill="#1d3a63" stroke="#4a7cb5" stroke-width="2"/>
      <rect x="12" y="19" width="9" height="11" rx="2" fill="#8fa3b8"/>
      <g stroke="#4fd8d0" stroke-width="1.6"><line x1="25" y1="21" x2="36" y2="21"/><line x1="25" y1="26" x2="34" y2="26"/></g>
    </svg>`,
  },
  biogel: {
    name: 'Biogel Canister',
    description: '"Organic-derived conductive medium. For dermal grafts and emitter repair." Emitter repair?',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="10" width="20" height="30" rx="6" fill="none" stroke="#7bc47f" stroke-width="2.5"/>
      <rect x="17" y="22" width="14" height="15" rx="4" fill="rgba(123,196,127,0.5)"/>
      <rect x="18" y="5" width="12" height="6" rx="2" fill="#39485a"/>
    </svg>`,
  },
});

export default {
  id: 'medbay',
  title: 'Crew Quarters · Med Bay',
  intro: 'Bunks like emptied envelopes, and beyond the divider, the med bay\'s instruments sleep under dust covers. Five people lived here. The sixth bunk is folded flat, its nameplate unscrewed — recently enough that the screws still sit in a neat little row on the shelf.',

  scene(state) {
    const uv = !!state.flags.med_uvOnPad;
    const open = !!state.flags.med_lockerOpen;
    const taken = !!state.flags.med_lockerTaken;

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gd_md_wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#161723"/>
          <stop offset="1" stop-color="#232434"/>
        </linearGradient>
        <radialGradient id="gd_md_uv" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(122,95,208,0.5)"/>
          <stop offset="1" stop-color="rgba(122,95,208,0)"/>
        </radialGradient>
      </defs>

      <rect width="1600" height="640" fill="url(#gd_md_wall)"/>
      <rect y="640" width="1600" height="260" fill="#12131d"/>
      <g stroke="#0b0c14" stroke-width="3" opacity="0.7">
        ${[700, 770, 845].map(y => `<line x1="0" y1="${y}" x2="1600" y2="${y}"/>`).join('')}
      </g>
      <line x1="800" y1="60" x2="800" y2="640" stroke="#0b0c14" stroke-width="14"/>

      <!-- QUARTERS side: bunks -->
      ${[[90, 200], [90, 400], [430, 200], [430, 400]].map(([x, y], i) => `
      <g>
        <rect x="${x}" y="${y}" width="280" height="26" rx="6" fill="#2b2c3e"/>
        <rect x="${x}" y="${y + 26}" width="280" height="60" rx="8" fill="#1d1e2c"/>
        <rect x="${x + 14}" y="${y + 6}" width="70" height="14" rx="4" fill="#33344a"/>
        <text x="${x + 49}" y="${y + 17}" text-anchor="middle" font-size="10" fill="#8fa3b8"
          font-family="Consolas, monospace">${['OKAFOR', 'IBARRA', 'CHEN', 'DELACROIX-SAND'][i]}</text>
      </g>`).join('')}
      <!-- the folded sixth bunk -->
      <g>
        <rect x="260" y="560" width="280" height="20" rx="6" fill="#232435" transform="rotate(-70 270 570)"/>
        <g fill="#5d7080">${[0, 1, 2, 3].map(k => `<circle cx="${210 + k * 14}" cy="600" r="3"/>`).join('')}</g>
        <rect x="196" y="612" width="120" height="10" rx="3" fill="#1d1e2c"/>
      </g>
      <!-- ibarra's datapad on his bunk -->
      <g class="beckon">
        <rect x="150" y="440" width="70" height="46" rx="6" fill="#0d1a26" stroke="#4fd8d0" stroke-width="2" transform="rotate(-6 185 463)"/>
        <g stroke="#2f9e97" stroke-width="2" transform="rotate(-6 185 463)">
          <line x1="160" y1="454" x2="208" y2="454"/><line x1="160" y1="463" x2="202" y2="463"/><line x1="160" y1="472" x2="196" y2="472"/>
        </g>
      </g>

      <!-- memorial plaque -->
      <g>
        <rect x="620" y="150" width="150" height="190" rx="8" fill="#1d2333" stroke="#3f4a63" stroke-width="4"/>
        <circle cx="695" cy="205" r="26" fill="none" stroke="#8fa3b8" stroke-width="3"/>
        ${[0, 1, 2, 3, 4].map(k => { const a = (k / 5) * Math.PI * 2 - Math.PI / 2; return `<line x1="${695 + Math.cos(a) * 30}" y1="${205 + Math.sin(a) * 30}" x2="${695 + Math.cos(a) * 38}" y2="${205 + Math.sin(a) * 38}" stroke="#8fa3b8" stroke-width="2.5"/>`; }).join('')}
        <text x="695" y="268" text-anchor="middle" font-size="13" fill="#bfc8da" font-family="Consolas, monospace">AURORA STATION</text>
        <text x="695" y="288" text-anchor="middle" font-size="13" fill="#bfc8da" font-family="Consolas, monospace">LOST 2085</text>
        <text x="695" y="315" text-anchor="middle" font-size="10" fill="#5d7080" font-family="Consolas, monospace">forty-one souls · remembered</text>
      </g>

      <!-- MED BAY side -->
      <!-- manifest screen -->
      <g>
        <rect x="860" y="140" width="300" height="200" rx="10" fill="#0d1a26" stroke="#2b3547" stroke-width="4"/>
        <text x="1010" y="170" text-anchor="middle" font-size="14" fill="#4fd8d0" font-family="Consolas, monospace">CREW MANIFEST</text>
        ${['OKAFOR — EVAC ✓', 'IBARRA — EVAC ✓', 'CHEN — EVAC ✓', 'DELACROIX — EVAC ✓', 'SANDOVAL — EVAC ✓'].map((t, i) =>
          `<text x="880" y="${196 + i * 20}" font-size="11.5" fill="#7bc47f" font-family="Consolas, monospace">${t}</text>`).join('')}
        <text x="880" y="316" font-size="11.5" fill="#ff8f8f" font-family="Consolas, monospace" class="flicker">VOSS, E. — DECEASED · BACKUP: COMPLETE</text>
      </g>

      <!-- scale -->
      <g>
        <rect x="880" y="560" width="140" height="60" rx="8" fill="#1c2734" stroke="#2b3547" stroke-width="3"/>
        <rect x="870" y="616" width="160" height="14" rx="4" fill="#2b3547"/>
        <text x="950" y="596" text-anchor="middle" font-size="14" fill="#ffb45e" font-family="Consolas, monospace" class="flicker">212.4 KG ?</text>
      </g>

      <!-- neural lab tray with shard 3 -->
      <g>
        <rect x="1090" y="560" width="200" height="20" rx="6" fill="#26313f"/>
        <rect x="1110" y="520" width="160" height="40" rx="6" fill="#141c26" stroke="#2b3547" stroke-width="3"/>
        <rect x="1160" y="528" width="26" height="26" rx="4" fill="#101a26" stroke="#2f9e97" stroke-width="2" class="beckon"/>
        <text x="1173" y="546" text-anchor="middle" font-size="13" fill="#4fd8d0">▮</text>
        <text x="1190" y="600" text-anchor="middle" font-size="11" fill="#5d7080" font-family="Consolas, monospace">NEURAL LAB — SEALED</text>
      </g>

      <!-- med locker -->
      <g>
        <rect x="1330" y="240" width="200" height="380" rx="10" fill="#1c2734" stroke="#2b3547" stroke-width="5"/>
        ${open ? `
          <rect x="1346" y="256" width="168" height="348" fill="#0b121c"/>
          ${taken ? '' : `<g class="beckon">
            <rect x="1380" y="330" width="34" height="52" rx="6" fill="none" stroke="#7bc47f" stroke-width="3"/>
            <rect x="1440" y="336" width="48" height="30" rx="4" fill="#1d3a63" stroke="#4a7cb5" stroke-width="2"/>
          </g>`}`
        : `
          <rect x="1390" y="400" width="80" height="100" rx="8" fill="#101a26" stroke="${uv ? '#7a5fd0' : '#39485a'}" stroke-width="3"/>
          ${uv ? `<ellipse cx="1430" cy="450" rx="70" ry="80" fill="url(#gd_md_uv)"/>` : ''}
          ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, i) => {
            const col = i % 3, row = Math.floor(i / 3);
            const x = 1402 + col * 26, y = 416 + row * 22;
            const hot = uv && [2, 0, 8, 5].includes(d);
            return `<text x="${x}" y="${y}" font-size="13" text-anchor="middle" font-family="Consolas, monospace"
              fill="${hot ? '#c9a6ff' : '#5d7080'}" ${hot ? 'class="flicker"' : ''}>${d}</text>`;
          }).join('')}
          <text x="1430" y="530" text-anchor="middle" font-size="10" fill="#8fa3b8" font-family="Consolas, monospace">MED LOCKER</text>`}
      </g>

      <!-- exit: core door -->
      <g>
        <path d="M1560 640 L1560 300 L1600 300 L1600 640 Z" fill="#0b131e" stroke="#2b3547" stroke-width="6"/>
        <rect x="1566" y="440" width="26" height="40" rx="4" fill="#101a26" stroke="#4a7cb5" stroke-width="2"/>
      </g>

      <path d="M0 900 L0 860 Q800 905 1600 860 L1600 900 Z" fill="#04070d"/>
    </svg>`;
  },

  hotspots(state) {
    const uv = !!state.flags.med_uvOnPad;
    const open = !!state.flags.med_lockerOpen;
    const taken = !!state.flags.med_lockerTaken;
    const spots = [];

    spots.push({
      id: 'datapad', x: 130, y: 425, w: 110, h: 80, label: "Ibarra's datapad",
      onInteract(game) {
        const html = `<div class="datapad"><div class="pad-title">Personal log — M. Ibarra</div>
          "...Chen says using one code for everything will get me killed someday. I told her:
          it is not 'a code', it is <strong>the year we lost Aurora Station</strong>, and I will
          stop using it when people stop forgetting. She says I never shut up about it.
          Correct. Someone has to..."</div>`;
        game.journal.add('note_ibarra', { title: "Ibarra's log (Quarters)", category: 'note', html });
        game.dialog({ title: "Ibarra's Datapad", html });
      },
    });

    spots.push({
      id: 'memorial', x: 610, y: 140, w: 170, h: 210, label: 'Memorial plaque',
      onInteract(game) {
        const html = `<div class="datapad"><div class="pad-title">Memorial</div>
          AURORA STATION — <strong>LOST 2085</strong><br>
          forty-one souls · remembered</div>
          <p style="margin-top:10px; color:var(--text-dim); font-style:italic;">A five-rayed
          star etched above the words. Somebody polishes this. You can tell.</p>`;
        game.journal.add('note_memorial', { title: 'Aurora Station memorial', category: 'note', html });
        game.dialog({ title: 'The Memorial', html });
      },
    });

    spots.push({
      id: 'sixthbunk', x: 180, y: 540, w: 200, h: 100, label: 'The folded bunk',
      onInteract(game) {
        game.say('The sixth bunk, folded flat, nameplate gone. Four screws in a tidy row — removed by someone who kept their hands busy so the rest of them wouldn\'t shake.');
      },
    });

    spots.push({
      id: 'manifest', x: 850, y: 130, w: 320, h: 220, label: 'Crew manifest',
      onInteract(game) {
        const html = `<div class="datapad corrupt"><div class="pad-title">Crew manifest — final</div>
          OKAFOR, J. — EVACUATED ✓<br>IBARRA, M. — EVACUATED ✓<br>CHEN, R. — EVACUATED ✓<br>
          DELACROIX, A. — EVACUATED ✓<br>SANDOVAL, T. — EVACUATED ✓<br>
          <span class="pad-bad">VOSS, E. — DECEASED (332 days). NEURAL BACKUP: COMPLETE.<br>
          BACKUP CUSTODY: STATION RESIDENT INTELLIGENCE.</span></div>
          <p style="margin-top:10px; color:var(--text-dim); font-style:italic;">Six crew.
          Five evacuated. One... you read the line again. It does not change. Elin Voss —
          your name — died almost a year ago, and her backup was left in the station's care.
          The room is very quiet except for Gus, who has stopped humming.</p>`;
        game.journal.add('note_manifest', { title: 'Crew manifest (Med Bay)', category: 'note', html });
        game.dialog({ title: 'The Manifest', html });
      },
    });

    spots.push({
      id: 'scale', x: 860, y: 550, w: 180, h: 90, label: 'Med scale',
      onInteract(game) {
        game.say('You step on the med scale out of habit. It reads 212.4 kilograms, then politely offers to recalibrate itself, because clearly one of you is broken.');
      },
    });

    spots.push({
      id: 'shard3', x: 1145, y: 510, w: 90, h: 70, label: 'A shard on the tray',
      onInteract(game) {
        game.journal.add('shard3', { title: 'Med Bay — the neural-lab tray', category: 'sun', sun: { rays: 5, letter: 'E' } });
        game.say('A memory shard on the sealed neural lab\'s tray: —a hospital bed; a voice, gentle and terrible: "the body won\'t make the year, Elin"— You hold it a long moment before the suit logs it.');
      },
    });

    if (!open) {
      spots.push({
        id: 'locker', x: 1330, y: 230, w: 210, h: 400, label: 'Med locker — keypad',
        onInteract(game) {
          if (game.selectedItem === 'uv_lamp') {
            game.setFlag('med_uvOnPad');
            game.selectedItem = null;
            game.playSfx('hint');
            game.say('You sweep the blacklight across the keypad. Four digits fluoresce with eleven months of one man\'s fingertips: 2, 0, 8, 5. The rest are clean as denial.');
            game.refreshScene();
            return;
          }
          openLockerPad(game, uv);
        },
      });
    } else if (!taken) {
      spots.push({
        id: 'locker_open', x: 1330, y: 230, w: 210, h: 400, label: 'Inside the locker',
        onInteract(game) {
          game.setFlag('med_lockerTaken');
          game.addItem('biogel', { from: { x: 1397, y: 356 }, silent: true });
          game.addItem('keycard_blue', { from: { x: 1464, y: 351 }, silent: true });
          game.say('Inside: a biogel canister — "organic-derived conductive medium" — and Chen\'s blue keycard, CORE ACCESS stamped across it. She left it behind. On purpose, you suspect.');
          game.refreshScene();
        },
      });
    }

    spots.push({
      id: 'coredoor', x: 1545, y: 290, w: 55, h: 360, label: 'Core access door',
      onInteract(game) {
        if (!game.hasItem('keycard_blue')) {
          game.say('CORE ACCESS — LEVEL 2 REQUIRED, says the reader, in the blue font of bureaucracies that outlive their buildings.');
          return;
        }
        if (!game.journal.has('shard3')) {
          game.say('Gus hovers at the neural lab\'s tray. "One more shard here, Elin. This one is... please just take it."');
          return;
        }
        game.say('Chen\'s card turns the reader green. The corridor to the AI core hums downward, and the air gets colder in a way that has nothing to do with temperature.');
        game.completeRoom({ delay: 700 });
      },
    });

    return spots;
  },

  hintContext(state) {
    return state.flags.med_lockerOpen ? 'after' : 'locker';
  },

  hints(state) {
    if (!state.flags.med_lockerOpen) {
      return [
        { text: 'Fingers leave grease, and grease glows under grow-light. You are carrying exactly the right lamp for a keypad.', cost: 60 },
        { text: 'Four digits fluoresce: 2, 0, 8, 5. And a crewman who "never shuts up" about a lost station left his reasoning on his bunk. Find the year on a wall.', cost: 120 },
        { text: 'The memorial reads AURORA STATION — LOST 2085. Enter 2085.', cost: 240 },
      ];
    }
    return [
      { text: 'The locker gave you two things; the door wants one of them. The shard tray by the neural lab wants the other kind of attention.', cost: 60 },
      { text: 'Take the biogel and keycard, log the shard on the tray, then badge the core door.', cost: 120 },
      { text: 'Hold nothing — just click the core access door with the keycard in your rig and shard 3 logged.', cost: 240 },
    ];
  },
};

function openLockerPad(game, uvRevealed) {
  let entry = '';

  game.openPuzzle({
    id: 'med_locker',
    title: 'Med Locker',
    render(body, api) {
      function draw() {
        body.innerHTML = `
          <p class="puzzle-desc">${uvRevealed
            ? 'Under the blacklight, four keys glow with long use: <strong style="color:#c9a6ff;">2 · 0 · 8 · 5</strong>. The order is the story.'
            : 'A ten-key pad, wiped clean to the eye. To the eye.'}</p>
          <div class="puzzle-row">
            <div class="puzzle-input" style="min-width:150px; letter-spacing:0.4em;">${entry.padEnd(4, '·')}</div>
          </div>
          <div class="puzzle-row" style="max-width:240px; margin:14px auto; flex-wrap:wrap; gap:8px;">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(d => {
              const hot = uvRevealed && [2, 0, 8, 5].includes(d);
              return `<button class="dial-btn" data-k="${d}" style="width:64px; height:44px; font-size:17px; ${hot ? 'color:#c9a6ff; border-color:#7a5fd0; text-shadow:0 0 8px rgba(169,143,255,0.8);' : ''}">${d}</button>`;
            }).join('')}
            <button class="dial-btn" data-k="clr" style="width:64px; height:44px; font-size:12px;">CLR</button>
          </div>
          <div class="puzzle-feedback"></div>`;

        body.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => {
          game.playSfx('click');
          if (b.dataset.k === 'clr') { entry = ''; draw(); return; }
          if (entry.length >= 4) return;
          entry += b.dataset.k;
          draw();
          if (entry.length === 4) {
            if (entry === '2085') {
              game.setFlag('med_lockerOpen');
              game.playSfx('unlock');
              api.solved({ message: 'The locker sighs open on the year nobody here was allowed to forget. "Ibarra," says Gus fondly. "Predictable in all the ways that matter."' });
              game.refreshScene();
            } else {
              entry = '';
              api.fail('The pad blinks red twice — wrong year, wrong story.');
              setTimeout(draw, 500);
            }
          }
        }));
      }
      draw();
    },
  });
}
