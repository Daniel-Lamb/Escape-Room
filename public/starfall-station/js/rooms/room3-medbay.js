// DECK 3 — Crew Quarters & Med Bay.
// Puzzle: med locker keypad. UV lamp reveals prints on 2, 0, 8, 5; Ibarra's
// datapad says he sets every code to the year Aurora Station was lost; the
// corridor memorial reads "AURORA STATION — LOST 2085". Code: 2085.
// Foreshadows: crew manifest (VOSS deceased, backup complete), the 212 kg scale.

import { registerItems } from '../../../shared/js/items.js';
import { kitDefs, panel, shadow } from '../../../shared/js/scenekit.js';

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

// Layout — read off the plate (art/medbay.webp). Shared with hotspots().
const BUNKS = [
  { name: 'OKAFOR', x: 30, y: 356, w: 120, s: 1 },
  { name: 'IBARRA', x: 30, y: 520, w: 120, s: 1 },
  { name: 'CHEN', x: 200, y: 330, w: 96, s: 0.85 },
  { name: 'DELACROIX-SAND', x: 200, y: 500, w: 120, s: 0.8 },
];
const FOLD = { x: 360, y: 300, w: 70, h: 250 };
const PAD = { x: 60, y: 560 };
const MEM = { x: 518, y: 150, w: 150, h: 184 };
const MAN = { x: 900, y: 64, w: 300, h: 166 };
const LOCK = { x: 986, y: 256, w: 228, h: 240 };
const KEY = { x: 1124, y: 320 };
const SCALE = { cx: 1092, top: 600, base: 712 };
const TRAY = { x: 1390, y: 494 };
const CORE = { x: 1216, y: 230, w: 76, h: 440 };
const R = {
  datapad:   { x: PAD.x - 20, y: PAD.y - 20, w: 120, h: 90 },
  memorial:  { x: MEM.x - 6, y: MEM.y - 6, w: MEM.w + 12, h: MEM.h + 12 },
  sixthbunk: { x: FOLD.x - 10, y: FOLD.y, w: FOLD.w + 20, h: FOLD.h + 60 },
  manifest:  { x: MAN.x, y: MAN.y, w: MAN.w, h: MAN.h },
  scale:     { x: SCALE.cx - 90, y: SCALE.top - 10, w: 180, h: 170 },
  shard3:    { x: TRAY.x + 40, y: TRAY.y - 20, w: 90, h: 70 },
  locker:    { x: LOCK.x, y: LOCK.y, w: LOCK.w, h: LOCK.h },
  coredoor:  { x: CORE.x, y: CORE.y, w: CORE.w, h: CORE.h },
};

export default {
  id: 'medbay',
  lintStates: [{ label: 'uv', flags: { med_uvOnPad: true } }, { label: 'open', flags: { med_lockerOpen: true } }],
  title: 'Crew Quarters · Med Bay',
  intro: 'Bunks like emptied envelopes, and beyond the divider, the med bay\'s instruments sleep under dust covers. Five people lived here. The sixth bunk is folded flat, its nameplate unscrewed — recently enough that the screws still sit in a neat little row on the shelf.',

  scene(state) {
    const uv = !!state.flags.med_uvOnPad;
    const open = !!state.flags.med_lockerOpen;
    const taken = !!state.flags.med_lockerTaken;

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${kitDefs()}
        <linearGradient id="gd_md_wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#161723"/>
          <stop offset="1" stop-color="#232434"/>
        </linearGradient>
        <radialGradient id="gd_md_uv" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(122,95,208,0.5)"/>
          <stop offset="1" stop-color="rgba(122,95,208,0)"/>
        </radialGradient>
      </defs>

      <!-- background plate: crew bunks (left), a column of crew lockers, then through the hatch the
           med bay — wall cabinets, a terminal door, counter, monitors, a floor scale. -->
      <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="art/medbay.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="art/medbay.mp4" type="video/mp4"/></video></foreignObject>

      <!-- nameplates clipped to the bunk rails -->
      ${BUNKS.map(b => `
      <g data-mount="bolts">
        <rect x="${b.x}" y="${b.y}" width="${b.w}" height="${18 * b.s}" rx="3" fill="#1d1e2c" stroke="#3f4a63" stroke-width="1.2"/>
        <text x="${b.x + b.w / 2}" y="${b.y + 13 * b.s}" text-anchor="middle" font-size="${14.5 * b.s}" fill="#8fa3b8" font-family="Consolas, monospace">${b.name}</text>
      </g>`).join('')}

      <!-- the sixth bunk, folded up flat against the wall and strapped -->
      <g data-mount="wall">
        <rect x="${FOLD.x}" y="${FOLD.y}" width="${FOLD.w}" height="${FOLD.h}" rx="6" fill="url(#sk_steel)" stroke="#0f1217" stroke-width="3"/>
        ${[0.3, 0.7].map(t => `<rect x="${FOLD.x - 4}" y="${FOLD.y + FOLD.h * t}" width="${FOLD.w + 8}" height="8" rx="2" fill="#2a2f38"/>`).join('')}
        <g fill="#5d7080">${[0, 1, 2, 3].map(k => `<circle cx="${FOLD.x + FOLD.w / 2}" cy="${FOLD.y + FOLD.h + 14 + k * 12}" r="2.5"/>`).join('')}</g>
      </g>

      <!-- Ibarra's datapad, left on his bunk -->
      <g class="beckon" data-mount="table">
        ${shadow(PAD.x + 36, PAD.y + 44, 40, 6, 0.6)}
        <rect x="${PAD.x}" y="${PAD.y}" width="72" height="44" rx="6" fill="#0d1a26" stroke="#4fd8d0" stroke-width="2" transform="rotate(-6 ${PAD.x + 36} ${PAD.y + 22})"/>
        <g stroke="#2f9e97" stroke-width="2" transform="rotate(-6 ${PAD.x + 36} ${PAD.y + 22})">
          <line x1="${PAD.x + 10}" y1="${PAD.y + 12}" x2="${PAD.x + 58}" y2="${PAD.y + 12}"/><line x1="${PAD.x + 10}" y1="${PAD.y + 22}" x2="${PAD.x + 52}" y2="${PAD.y + 22}"/><line x1="${PAD.x + 10}" y1="${PAD.y + 32}" x2="${PAD.x + 46}" y2="${PAD.y + 32}"/>
        </g>
      </g>

      <!-- memorial plaque, bolted to the upper door of the crew lockers -->
      ${panel({ ...MEM, material: 'steel', mount: 'bolts', body: `
        <circle cx="${MEM.x + MEM.w / 2}" cy="${MEM.y + 56}" r="24" fill="none" stroke="#bfc8da" stroke-width="3"/>
        ${[0, 1, 2, 3, 4].map(k => { const a = (k / 5) * Math.PI * 2 - Math.PI / 2; const cx = MEM.x + MEM.w / 2, cy = MEM.y + 56; return `<line x1="${cx + Math.cos(a) * 28}" y1="${cy + Math.sin(a) * 28}" x2="${cx + Math.cos(a) * 36}" y2="${cy + Math.sin(a) * 36}" stroke="#bfc8da" stroke-width="2.5"/>`; }).join('')}
        <text x="${MEM.x + MEM.w / 2}" y="${MEM.y + 118}" text-anchor="middle" font-size="12.5" fill="#dbe7f3" font-family="Consolas, monospace">AURORA STATION</text>
        <text x="${MEM.x + MEM.w / 2}" y="${MEM.y + 138}" text-anchor="middle" font-size="12.5" fill="#dbe7f3" font-family="Consolas, monospace">LOST 2085</text>
        <text x="${MEM.x + MEM.w / 2}" y="${MEM.y + 162}" text-anchor="middle" font-size="11.5" fill="#9fb0c4" font-family="Consolas, monospace">forty-one souls · remembered</text>` })}

      <!-- crew manifest, on a screen bolted to the med-bay wall above the cabinets -->
      ${panel({ ...MAN, material: 'glass', mount: 'bolts', rx: 8, body: `
        <text x="${MAN.x + MAN.w / 2}" y="${MAN.y + 28}" text-anchor="middle" font-size="13" fill="#4fd8d0" font-family="Consolas, monospace">CREW MANIFEST</text>
        ${['OKAFOR — EVAC ✓', 'IBARRA — EVAC ✓', 'CHEN — EVAC ✓', 'DELACROIX — EVAC ✓', 'SANDOVAL — EVAC ✓'].map((t, i) =>
          `<text x="${MAN.x + 18}" y="${MAN.y + 50 + i * 18}" font-size="11.5" fill="#7bc47f" font-family="Consolas, monospace">${t}</text>`).join('')}
        <text x="${MAN.x + 18}" y="${MAN.y + 148}" font-size="11.5" fill="#ff8f8f" font-family="Consolas, monospace" class="flicker">VOSS, E. — DECEASED · BACKUP: COMPLETE</text>` })}

      <!-- the med locker: the painted wall cabinets, with a keypad on the right door -->
      <g data-mount="wall">
        ${open ? `
          <rect x="${LOCK.x}" y="${LOCK.y}" width="${LOCK.w}" height="${LOCK.h}" rx="6" fill="rgba(6,10,16,0.86)"/>
          ${taken ? '' : `<g class="beckon">
            <rect x="${LOCK.x + 40}" y="${LOCK.y + 90}" width="34" height="52" rx="6" fill="none" stroke="#7bc47f" stroke-width="3"/>
            <rect x="${LOCK.x + 110}" y="${LOCK.y + 100}" width="48" height="30" rx="4" fill="#1d3a63" stroke="#4a7cb5" stroke-width="2"/>
          </g>`}`
        : `
          <rect x="${KEY.x}" y="${KEY.y}" width="80" height="100" rx="8" fill="#101a26" stroke="${uv ? '#7a5fd0' : '#39485a'}" stroke-width="3"/>
          ${uv ? `<ellipse cx="${KEY.x + 40}" cy="${KEY.y + 50}" rx="70" ry="80" fill="url(#gd_md_uv)"/>` : ''}
          ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, i) => {
            const col = i % 3, row = Math.floor(i / 3);
            const x = KEY.x + 14 + col * 26, y = KEY.y + 18 + row * 22;
            const hot = uv && [2, 0, 8, 5].includes(d);
            return `<text x="${x}" y="${y}" font-size="13" text-anchor="middle" font-family="Consolas, monospace"
              fill="${hot ? '#c9a6ff' : '#5d7080'}" ${hot ? 'class="flicker"' : ''}>${d}</text>`;
          }).join('')}
          <text x="${KEY.x + 40}" y="${KEY.y + 122}" text-anchor="middle" font-size="11.5" fill="#26313f" font-family="Consolas, monospace">MED LOCKER</text>`}
      </g>

      <!-- the floor scale (painted) and its readout on a slim post -->
      <g data-mount="post">
        <rect x="${SCALE.cx - 3}" y="${SCALE.top + 34}" width="6" height="${SCALE.base - SCALE.top - 34}" fill="#9aa7b8"/>
        <rect x="${SCALE.cx - 62}" y="${SCALE.top}" width="124" height="36" rx="6" fill="#141c26" stroke="#3a4656" stroke-width="2"/>
        <text x="${SCALE.cx}" y="${SCALE.top + 24}" text-anchor="middle" font-size="14" fill="#ffb45e" font-family="Consolas, monospace" class="flicker">212.4 KG ?</text>
      </g>

      <!-- the neural-lab tray, set on the counter, shard 3 in its cradle -->
      <g data-mount="table">
        ${shadow(TRAY.x + 90, TRAY.y + 40, 96, 8, 0.6)}
        <rect x="${TRAY.x}" y="${TRAY.y}" width="180" height="38" rx="6" fill="#141c26" stroke="#2b3547" stroke-width="3"/>
        <rect x="${TRAY.x + 70}" y="${TRAY.y + 6}" width="26" height="26" rx="4" fill="#101a26" stroke="#2f9e97" stroke-width="2" class="beckon"/>
        <text x="${TRAY.x + 83}" y="${TRAY.y + 24}" text-anchor="middle" font-size="13" fill="#4fd8d0">▮</text>
        <text x="${TRAY.x + 90}" y="${TRAY.y + 60}" text-anchor="middle" font-size="11.5" fill="#26313f" font-family="Consolas, monospace">NEURAL LAB — SEALED</text>
      </g>

      <!-- core access: the painted terminal door, its badge reader lit blue -->
      <g data-mount="wall">
        <rect x="${CORE.x + 10}" y="${CORE.y + 96}" width="26" height="40" rx="4" fill="#101a26" stroke="#4a7cb5" stroke-width="2" class="beckon"/>
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
      id: 'datapad', ...R.datapad, label: "Ibarra's datapad",
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
      id: 'memorial', ...R.memorial, label: 'Memorial plaque',
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
      id: 'sixthbunk', ...R.sixthbunk, label: 'The folded bunk',
      onInteract(game) {
        game.say('The sixth bunk, folded flat, nameplate gone. Four screws in a tidy row — removed by someone who kept their hands busy so the rest of them wouldn\'t shake.');
      },
    });

    spots.push({
      id: 'manifest', ...R.manifest, label: 'Crew manifest',
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
      id: 'scale', ...R.scale, label: 'Med scale',
      onInteract(game) {
        game.say('You step on the med scale out of habit. It reads 212.4 kilograms, then politely offers to recalibrate itself, because clearly one of you is broken.');
      },
    });

    spots.push({
      id: 'shard3', ...R.shard3, label: 'A shard on the tray',
      onInteract(game) {
        game.journal.add('shard3', { title: 'Med Bay — the neural-lab tray', category: 'sun', sun: { rays: 5, letter: 'E' } });
        game.say('A memory shard on the sealed neural lab\'s tray: —a hospital bed; a voice, gentle and terrible: "the body won\'t make the year, Elin"— You hold it a long moment before the suit logs it.');
      },
    });

    if (!open) {
      spots.push({
        id: 'locker', ...R.locker, label: 'Med locker — keypad',
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
        id: 'locker_open', ...R.locker, label: 'Inside the locker',
        onInteract(game) {
          game.setFlag('med_lockerTaken');
          game.addItem('biogel', { from: { x: LOCK.x + 57, y: LOCK.y + 116 }, silent: true });
          game.addItem('keycard_blue', { from: { x: LOCK.x + 134, y: LOCK.y + 115 }, silent: true });
          game.say('Inside: a biogel canister — "organic-derived conductive medium" — and Chen\'s blue keycard, CORE ACCESS stamped across it. She left it behind. On purpose, you suspect.');
          game.refreshScene();
        },
      });
    }

    spots.push({
      id: 'coredoor', plate: 'the core access door', ...R.coredoor, label: 'Core access door',
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
          <div class="puzzle-hero" style="background-image:url(art/pz-medbay.webp)"></div>
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
