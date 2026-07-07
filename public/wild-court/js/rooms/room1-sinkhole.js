// TRIAL 1 — The Sinkhole Nave. Tutorial: track reading with negative evidence.
// Three root-gate sockets, each beside a preserved trace; each socket cycles
// five clan glyphs (JAGUAR, TAPIR, HARPY, BOA, MONKEY). The field-guide page is
// the key. Left = four toes no claw tips = JAGUAR; middle = three round toes =
// TAPIR; right = a drag-line, no footprint at all = BOA (the answer from
// ABSENCE). Produces: machete, survey_map. Token 1 (BOA, "N") on the lintel.
// Foreshadows: the spun compass, the healed-over rim blazes.

import { registerItems } from '../../../shared/js/items.js';

registerItems({
  machete: {
    name: 'Bone-Handled Machete',
    description: 'A working blade with a handle of yellowed bone, worn to the shape of a hand that is not yours. It came down the sinkhole with you, or it was always here. You would rather not decide which.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 40 L18 32 L40 8 Q43 6 43 10 L24 34 L16 42 Z" fill="#c9d2b0" stroke="#3a4632" stroke-width="1.6"/>
      <path d="M18 32 L38 11" stroke="#eef4da" stroke-width="1.4" opacity="0.7"/>
      <rect x="7" y="37" width="11" height="7" rx="3" transform="rotate(-45 12 40)" fill="#e4dcc0" stroke="#8a7a52" stroke-width="1.4"/>
      <circle cx="9" cy="43" r="1.4" fill="#8a7a52"/>
    </svg>`,
  },
  survey_map: {
    name: 'Your Survey Map',
    description: 'Three days of your best work: Quadrant Nine, the river bend, the stone scar, the big kapok circled in red. Worth good money to the concession. Worth more, you are beginning to suspect, unmade.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="9" width="32" height="30" rx="2" fill="#e4f0d0" stroke="#9fb37e" stroke-width="1.6"/>
      <path d="M12 12 L12 36 M20 10 L20 38 M36 12 L36 36" stroke="#c3d3a0" stroke-width="1" opacity="0.7"/>
      <path d="M11 20 Q20 15 28 22 T40 20" stroke="#6b4f37" stroke-width="1.4" fill="none"/>
      <path d="M13 30 Q22 26 30 31" stroke="#6b4f37" stroke-width="1.2" fill="none" opacity="0.8"/>
      <circle cx="30" cy="22" r="3" fill="none" stroke="#a3541f" stroke-width="1.6"/>
      <path d="M30 19 L30 25 M27 22 L33 22" stroke="#a3541f" stroke-width="1"/>
    </svg>`,
  },
});

// Clan glyphs the sockets cycle. Solution: JAGUAR(0), TAPIR(1), BOA(3).
const CLANS = ['JAGUAR', 'TAPIR', 'HARPY', 'BOA', 'MONKEY'];
const SOLUTION = [0, 1, 3];
const TRACE_LABEL = ['the four-toed pug mark', 'the three round toes', 'the smooth drag-line'];

export default {
  id: 'sinkhole',
  title: 'The Sinkhole Nave',
  intro: 'You come to at the bottom of the world: a fern-choked sinkhole that is also, impossibly, a room — a ruined stone nave with roots pouring down its walls like frozen waterfalls, a ragged coin of evening sky far, far above, and a small golden monkey in a woven collar watching you with the frank professional interest of someone reading a case file.',

  scene(state) {
    const open = !!state.flags.sinkhole_gateOpen;
    const macheteHere = !state.flags.sinkhole_macheteTaken;
    const mapHere = !state.flags.sinkhole_mapTaken;
    const tokenHere = !(state.journal || []).some(e => e.id === 'token1');
    const socks = socketsFrom(state.flags);

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gd_sink_wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#0e1c12"/>
          <stop offset="0.5" stop-color="#16281a"/>
          <stop offset="1" stop-color="#223a26"/>
        </linearGradient>
        <linearGradient id="gd_sink_floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#1d301f"/>
          <stop offset="1" stop-color="#070d08"/>
        </linearGradient>
        <radialGradient id="gd_sink_sky" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="#9fd4a8"/>
          <stop offset="0.5" stop-color="rgba(159,212,168,0.35)"/>
          <stop offset="1" stop-color="rgba(159,212,168,0)"/>
        </radialGradient>
        <linearGradient id="gd_sink_beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="rgba(159,212,168,0.28)"/>
          <stop offset="1" stop-color="rgba(159,212,168,0)"/>
        </linearGradient>
        <linearGradient id="gd_sink_gate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#3f4a3c"/>
          <stop offset="1" stop-color="#2e3a2c"/>
        </linearGradient>
        <linearGradient id="gd_sink_mud" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#6b5535"/>
          <stop offset="1" stop-color="#4a3a22"/>
        </linearGradient>
      </defs>
      <style>
        @keyframes sink_drift_a { 0%,100% { transform: translate(0,0); } 50% { transform: translate(22px,-18px); } }
        @keyframes sink_drift_b { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-26px,14px); } }
      </style>

      <rect width="1600" height="660" fill="url(#gd_sink_wall)"/>
      <rect y="660" width="1600" height="240" fill="url(#gd_sink_floor)"/>

      <!-- the coin of sky, far above -->
      <ellipse cx="820" cy="30" rx="240" ry="60" fill="url(#gd_sink_sky)"/>
      <ellipse cx="820" cy="26" rx="150" ry="34" fill="#9fd4a8" opacity="0.45" class="flicker"/>
      <!-- the great light-shaft down the nave -->
      <polygon points="690,20 950,20 1120,700 560,700" fill="url(#gd_sink_beam)" class="moonbeam"/>

      <!-- roots pouring down the walls -->
      <g stroke-linecap="round" fill="none">
        <path d="M120 0 Q150 220 96 430 Q78 560 132 660" stroke="#4a3626" stroke-width="22"/>
        <path d="M120 0 Q150 220 96 430" stroke="#6b4f37" stroke-width="7" opacity="0.7"/>
        <path d="M250 0 Q214 180 262 360 Q286 500 232 660" stroke="#4a3626" stroke-width="14"/>
        <path d="M1500 0 Q1548 220 1494 440 Q1470 560 1520 660" stroke="#4a3626" stroke-width="20"/>
        <path d="M1360 0 Q1332 160 1372 340 Q1392 470 1352 660" stroke="#4a3626" stroke-width="12"/>
        <path d="M1360 0 Q1332 160 1372 340" stroke="#6b4f37" stroke-width="5" opacity="0.6"/>
      </g>
      <!-- hanging ferns -->
      <g class="sway slow" fill="#16281a">
        <path d="M300 120 q-16 70 6 128 q28 -56 8 -126 z"/>
        <path d="M1300 150 q18 60 -6 120 q-26 -50 -6 -118 z"/>
      </g>

      <!-- the rim blazes, high on the near wall: cuts grown smooth -->
      <g>
        <rect x="1140" y="150" width="150" height="120" rx="8" fill="#2e3a2c" stroke="#070d08" stroke-width="3" opacity="0.8"/>
        <path d="M1170 180 q8 22 -2 62 M1210 176 q6 26 -2 66 M1250 182 q8 20 0 58"
          stroke="#3f5a3a" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.7"/>
        <path d="M1170 180 q8 22 -2 62 M1210 176 q6 26 -2 66"
          stroke="#5aa552" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.5"/>
      </g>

      <!-- the harpy talon-scar (flavor foreshadow of T4's apex) -->
      <g stroke="#9fb37e" stroke-width="5" stroke-linecap="round" opacity="0.6">
        <path d="M250 430 L296 520 M250 430 L214 528 M250 430 L250 540"/>
        <path d="M226 470 L272 470"/>
      </g>

      <!-- the fallen satchel + your survey map -->
      <g>
        <path d="M300 792 Q306 748 372 748 Q438 748 444 792 L432 762 L312 762 Z" fill="url(#gd_sink_mud)" stroke="#2a1e14" stroke-width="3"/>
        <path d="M312 764 Q372 780 432 764" stroke="#2a1e14" stroke-width="2" fill="none" opacity="0.8"/>
        <path d="M330 748 Q372 726 414 748" fill="none" stroke="#4a3a22" stroke-width="4"/>
        ${mapHere
          ? `<g class="beckon"><rect x="344" y="726" width="60" height="40" rx="2" fill="#e4f0d0" stroke="#9fb37e" stroke-width="2" transform="rotate(-8 374 746)"/>
             <path d="M352 742 Q372 734 392 742" stroke="#6b4f37" stroke-width="1.4" fill="none" transform="rotate(-8 374 746)"/></g>`
          : ''}
      </g>

      <!-- the half-buried machete, glinting in the mud -->
      ${macheteHere
        ? `<g class="beckon">
            <path d="M980 800 L1010 772 L1096 700 Q1104 696 1102 706 L1024 776 L998 804 Z"
              fill="#c9d2b0" stroke="#3a4632" stroke-width="2"/>
            <rect x="968" y="792" width="26" height="15" rx="5" transform="rotate(-42 981 800)" fill="#e4dcc0" stroke="#8a7a52" stroke-width="2"/>
            <ellipse cx="1030" cy="792" rx="70" ry="12" fill="#0b120a" opacity="0.4"/>
          </g>`
        : ''}

      <!-- the root-gate, east wall, with three trace-sockets -->
      <g>
        <path d="M1300 700 L1300 300 Q1420 236 1560 300 L1560 700 Z" fill="url(#gd_sink_gate)" stroke="#070d08" stroke-width="6"/>
        ${open
          ? `<path d="M1320 700 L1320 320 Q1430 264 1540 320 L1540 700" fill="#070d08"/>
             <ellipse cx="1430" cy="520" rx="90" ry="150" fill="url(#gd_sink_sky)" opacity="0.4" class="glow"/>
             <text x="1430" y="300" text-anchor="middle" font-size="16" fill="#9ce08a" class="flicker"
               font-family="Palatino Linotype, Georgia, serif">the gate stands open</text>`
          : `<line x1="1430" y1="300" x2="1430" y2="700" stroke="#070d08" stroke-width="4" opacity="0.6"/>
             ${socks.map((g, i) => {
               const x = 1360 + i * 70;
               return `
               <g>
                 <rect x="${x - 26}" y="430" width="52" height="60" rx="6" fill="#241a10" stroke="#4a3626" stroke-width="2"/>
                 <g transform="translate(${x}, 460)">${socketTraceIcon(i)}</g>
                 <rect x="${x - 26}" y="500" width="52" height="30" rx="5" fill="#2e3a2c" stroke="#5aa552" stroke-width="1.5"/>
                 <text x="${x}" y="520" text-anchor="middle" font-size="10" fill="#9ce08a"
                   font-family="Palatino Linotype, Georgia, serif">${CLANS[g].slice(0, 5)}</text>
               </g>`;
             }).join('')}`}
        <!-- token 1 set into the lintel -->
        ${tokenHere
          ? `<g class="beckon">
              <circle cx="1430" cy="272" r="17" fill="#6b4f37" stroke="#d1a53f" stroke-width="2.5"/>
              <path d="M1418 276 q6 -6 12 0 q6 6 12 0" fill="none" stroke="#ffe08a" stroke-width="2" stroke-linecap="round"/>
              <circle cx="1443" cy="264" r="2.4" fill="#ffe08a"/>
              <text x="1430" y="298" text-anchor="middle" font-size="11" fill="#ffe08a"
                font-family="Palatino Linotype, Georgia, serif">N</text>
            </g>`
          : ''}
      </g>

      <!-- the torn field-guide page, in the mud -->
      <g class="sway" style="transform-origin: 640px 800px;">
        <rect x="600" y="770" width="88" height="60" rx="2" fill="#e4dcc0" stroke="#b9a878" stroke-width="2" transform="rotate(6 644 800)"/>
        <path d="M612 786 h64 M612 796 h58 M612 806 h62 M612 816 h40" stroke="#9a8a5c" stroke-width="1.4" transform="rotate(6 644 800)"/>
      </g>

      <!-- fireflies -->
      <g style="animation: sink_drift_a 10s ease-in-out infinite"><circle cx="520" cy="440" r="4" fill="#ffe08a" class="glow fast"/></g>
      <g style="animation: sink_drift_b 13s ease-in-out infinite"><circle cx="1120" cy="360" r="3.5" fill="#ffe08a" class="glow fast"/></g>
      <g style="animation: sink_drift_a 11s ease-in-out infinite; animation-delay:-4s"><circle cx="900" cy="560" r="4" fill="#ffe08a" class="glow fast"/></g>

      <!-- ground fog -->
      <ellipse cx="500" cy="852" rx="420" ry="44" fill="rgba(159,212,168,0.06)" class="fog"/>
      <ellipse cx="1200" cy="862" rx="420" ry="46" fill="rgba(159,212,168,0.05)" class="fog reverse"/>

      <path d="M0 900 L0 856 Q800 902 1600 856 L1600 900 Z" fill="#070d08"/>
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const open = !!state.flags.sinkhole_gateOpen;

    spots.push({
      id: 'fieldguide', x: 590, y: 760, w: 120, h: 90, label: 'A torn field-guide page',
      onInteract(game) {
        const html = `<div class="leaf-tablet"><div class="leaf-title">Torn from your field guide</div>
          <em>Jaguar:</em> four toes, <strong>no claw tips showing</strong> — claws sheathed when walking.<br>
          <em>Tapir:</em> three broad round toes, like a clover.<br>
          <em>Boa:</em> leaves no footprint at all — only a smooth drag-line in soft ground.<br>
          <em>Harpy eagle:</em> a two-lobed talon cross, deeper at the rear.</div>
          <p style="margin-top:12px; color:var(--text-dim); font-style:italic;">Your own handwriting,
          waterlogged but legible. Pity you didn't write the part about not falling into sinkholes.</p>`;
        game.journal.add('note_fieldguide', { title: 'Field-guide page (Sinkhole Nave)', category: 'note', html });
        game.dialog({ title: 'The Field-Guide Page', html });
      },
    });

    if (!state.flags.sinkhole_macheteTaken) {
      spots.push({
        id: 'machete', x: 950, y: 700, w: 200, h: 140, label: 'A blade in the mud',
        onInteract(game) {
          game.setFlag('sinkhole_macheteTaken');
          game.addItem('machete', { from: { x: 1030, y: 770 } });
          game.say('A bone-handled machete, half-swallowed by the mud. The handle fits your grip like it was waiting for it. Gus watches you take it. "Good. Counsel who cannot cut to the point is no counsel at all."');
          game.refreshScene();
        },
      });
    }

    if (!state.flags.sinkhole_mapTaken) {
      spots.push({
        id: 'satchel', x: 296, y: 720, w: 160, h: 100, label: 'Your fallen satchel',
        onInteract(game) {
          game.setFlag('sinkhole_mapTaken');
          game.addItem('survey_map', { from: { x: 374, y: 746 } });
          game.journal.add('note_survey', {
            title: 'Your survey map (Sinkhole Nave)', category: 'note',
            html: `<div class="leaf-tablet"><div class="leaf-title">Quadrant Nine — draft</div>
              Your survey of Quadrant Nine: the river bend, the stone scar, the big kapok circled
              in red where the concession wants its first cut. Three days' work. The valley that
              appears on no other chart — because, it will turn out, no other chart is allowed.</div>`,
          });
          game.say('Your satchel, and inside it the survey — Quadrant Nine, the big kapok marked for felling. You sling it back on out of habit. Somewhere above, a company is waiting for this map. They are going to be disappointed.');
          game.refreshScene();
        },
      });
    } else {
      spots.push({
        id: 'satchel_empty', x: 296, y: 720, w: 160, h: 100, label: 'Your emptied satchel',
        onInteract(game) {
          game.say('Emptied now, mud-soaked, familiar. It has carried chains and stakes and other people\'s ambitions across three valleys. This is the first time it has carried you into anything it could not carry you out of.');
        },
      });
    }

    spots.push({
      id: 'compass', x: 470, y: 600, w: 120, h: 110, label: 'Your compass',
      onInteract(game) {
        game.journal.add('note_compass', {
          title: 'Your compass (Sinkhole Nave)', category: 'note',
          html: `<div class="leaf-tablet"><div class="leaf-title">The needle</div>
            Your surveyor's compass. The needle has not pointed north — has not pointed anywhere —
            <strong>since the ground took you.</strong> It turns slow and steady, like it is looking
            for something the poles cannot offer. <em>You tell yourself it is the iron in the stone.</em></div>`,
        });
        game.say('You check your compass out of pure reflex. The needle drifts in a slow circle, north to nowhere, and has done since you fell. Iron in the rock, you tell yourself. You are a good surveyor and a poor liar.');
      },
    });

    spots.push({
      id: 'blazes', x: 1130, y: 140, w: 170, h: 140, label: 'Blazes on the rim',
      onInteract(game) {
        game.journal.add('note_blazes', {
          title: 'The rim blazes (Sinkhole Nave)', category: 'note',
          html: `<div class="leaf-tablet"><div class="leaf-title">Yesterday's cuts</div>
            The trail-blazes you cut into the trees yesterday are visible on the sinkhole rim above —
            and they are <strong>grown over.</strong> Bark closed smooth across each hatchet mark,
            the way bark closes over years, not hours. <em>You cut those yesterday. You are certain
            you cut those yesterday.</em></div>`,
        });
        game.say('High on the rim you can see the blazes you cut yesterday to mark your way back — and the bark has grown smooth over every one of them, healed like the cuts were seasons old. You were here yesterday. The trees disagree.');
      },
    });

    spots.push({
      id: 'talon', x: 200, y: 410, w: 130, h: 150, label: 'A scar in the stone',
      onInteract(game) {
        game.say('Four gouges rake the wall — a two-lobed cross, deeper at the rear. A talon-mark, your field guide would say, and far too high for anything that should be underground. Nothing at the gate matches it. Somewhere in this place, though, something does.');
      },
    });

    spots.push({
      id: 'sky', x: 600, y: 20, w: 440, h: 90, label: 'The coin of sky',
      onInteract(game) {
        game.say('The sky is a ragged coin thrown a very long way up, going the bruised gold of evening. Sixty feet of root and stone between you and it, and not one of them offering a foothold. The way out is not up. The way out, Gus assures you, is a matter of testimony.');
      },
    });

    if (!open) {
      spots.push({
        id: 'gate', x: 1290, y: 300, w: 270, h: 400, label: 'The root-gate',
        onInteract(game) { openGatePuzzle(game); },
      });
    } else {
      spots.push({
        id: 'gate_open', x: 1290, y: 300, w: 270, h: 400, label: 'The open gate',
        onInteract(game) {
          if (!game.hasItem('machete')) {
            game.say('Gus steps neatly between you and the gap. "The blade, counsel. A surveyor without a machete is a tourist, and the valley ahead does not accommodate tourists."');
            return;
          }
          if (!game.hasItem('survey_map')) {
            game.say('Gus taps your empty satchel-strap with one small hand. "Your map, Marlowe. A surveyor without a map is just a trespasser — and the Court, I promise you, dislikes trespassers even more than it dislikes surveyors."');
            return;
          }
          if (!game.journal.has('token1')) {
            game.say('Gus points his tail at the lintel, where the carved disc still sits. "The Court struck a token for this trial. It goes in the journal or we do not go on. I don\'t make the rules. I do, however, quote them constantly."');
            return;
          }
          game.say('The root-gate grinds inward on itself, root unknotting from root, onto the black shine of a flooded gallery.');
          game.completeRoom({ delay: 700 });
        },
      });
    }

    if (!(state.journal || []).some(e => e.id === 'token1')) {
      spots.push({
        id: 'token1', x: 1400, y: 250, w: 64, h: 60, label: 'A disc in the lintel',
        onInteract(game) {
          game.journal.add('token1', { title: 'Court token — the gate lintel', category: 'sun', sun: { creature: 'boa', letter: 'N' } });
          game.say('Set into the gate\'s lintel: a carved wood disc, a boa\'s coiled face above the letter N. It comes loose into your palm with the click of something meant to be found. "Exhibit one," says Gus, pleased. "Do keep track. There will, in a manner of speaking, be a spelling test."');
          game.refreshScene();
        },
      });
    }

    return spots;
  },

  onEnter(game) {
    if (!game.getFlag('sinkhole_gusMet')) {
      game.setFlag('sinkhole_gusMet');
      game.say('The monkey inclines his head. "Gus. Golden tamarin, advocate for the accused — and the accused, Marlowe, is you. No, do not thank me yet. Thank me at the open air, if we reach it. We have until nightfall and seven trials, and your first witness is that gate. Read the ground it remembers."');
    }
  },

  hints: [
    { text: 'The gate asks who passed before you. Your own field guide fell with you — read it against the three traces.', cost: 60 },
    { text: 'Sheathed claws and four toes is the cat; three round toes the tapir. And the third trace? Nothing WALKED there. What travels without feet?', cost: 120 },
    { text: 'Left jaguar, middle tapir, right boa — the drag-line is a serpent\'s. The harpy and the monkey never passed this gate at all.', cost: 240 },
  ],
};

// --- socket state helpers (persisted as a 3-char digit string) ---
function socketsFrom(flags) {
  const raw = flags && flags.sinkhole_sockets;
  return (typeof raw === 'string' && /^[0-4]{3}$/.test(raw))
    ? raw.split('').map(Number)
    : [0, 0, 0];
}

// small carved trace icons for the three sockets (drawn around a 0,0 origin)
function socketTraceIcon(i) {
  const S = `fill="none" stroke="#9fb37e" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"`;
  if (i === 0) return `<g ${S}>
    <ellipse cx="0" cy="4" rx="9" ry="7"/>
    <circle cx="-7" cy="-8" r="3"/><circle cx="-2" cy="-11" r="3"/><circle cx="3" cy="-11" r="3"/><circle cx="8" cy="-8" r="3"/>
  </g>`;
  if (i === 1) return `<g ${S}>
    <path d="M0 8 Q-11 2 -8 -8 Q0 -3 0 6 Q0 -3 8 -8 Q11 2 0 8 Z"/>
    <path d="M-4 -6 Q0 -12 4 -6" />
  </g>`;
  return `<g ${S}><path d="M-11 10 Q-2 2 0 -4 Q2 -10 10 -12" stroke-width="3"/></g>`;
}

function openGatePuzzle(game) {
  game.openPuzzle({
    id: 'sinkhole_gate',
    title: 'The Gate of Passage',
    wide: true,
    onCleanup() { game.refreshScene(); },
    render(body, api) {
      body.innerHTML = `
        <p class="puzzle-desc">Three sockets in the root-gate, each beside a trace the old mud
        preserved. Name the clan that left each — the gate opens only for walkers it remembers.
        Your field guide named their signs. <em>One trace is the absence of a trace.</em></p>
        <div id="sink-cols" style="display:flex; gap:20px; justify-content:center; flex-wrap:wrap; margin:14px 0;"></div>
        <div class="puzzle-row"><button class="btn btn-primary" id="sink-try">Name the Walkers</button></div>
        <div class="puzzle-feedback"></div>`;

      const cols = body.querySelector('#sink-cols');
      const TRACE_DESC = [
        'A four-toed pug mark — and no claw tips at all.',
        'Three broad, round toes, splayed like a clover.',
        'No print. A smooth, unbroken drag-line in the mud.',
      ];

      function paint() {
        const s = socketsFrom(game.state.flags);
        cols.innerHTML = s.map((g, i) => `
          <div style="width:180px; text-align:center; padding:10px 8px; border-radius:12px;
            border:1px solid rgba(107,79,55,0.8); background:rgba(74,54,38,0.30);">
            <div style="font-size:12px; font-style:italic; opacity:0.8; min-height:48px; margin-bottom:8px;">${TRACE_DESC[i]}</div>
            <div class="dial">
              <button class="dial-btn" data-col="${i}" data-d="1">&#9650;</button>
              <div class="dial-face" style="font-size:16px; letter-spacing:0.06em;">${CLANS[g]}</div>
              <button class="dial-btn" data-col="${i}" data-d="-1">&#9660;</button>
              <div class="lever-label">${['left', 'middle', 'right'][i]} socket</div>
            </div>
          </div>`).join('');
        cols.querySelectorAll('button[data-col]').forEach(btn => {
          btn.addEventListener('click', () => {
            const i = Number(btn.dataset.col);
            const next = socketsFrom(game.state.flags);
            next[i] = (next[i] + Number(btn.dataset.d) + 5) % 5;
            game.setFlag('sinkhole_sockets', next.join(''));
            game.playSfx('click');
            const face = cols.querySelectorAll('.dial-face')[i];
            face.classList.remove('tick'); void face.offsetWidth; face.classList.add('tick');
            paint();
          });
        });
      }
      paint();

      body.querySelector('#sink-try').addEventListener('click', () => {
        const s = socketsFrom(game.state.flags);
        if (s.join('') === SOLUTION.join('')) {
          game.setFlag('sinkhole_gateOpen');
          game.playSfx('stone');
          api.solved({ message: 'The three glyphs seat with a sound like a held breath let go, and the root-gate remembers being a door. "Jaguar walks, tapir walks, and the serpent leaves only the memory of moving," says Gus. "Well read, counsel. Absence is evidence too — do try to remember that. It comes up again."' });
          game.refreshScene();
        } else {
          api.fail('The gate does not know these walkers. Somewhere in your three names is a creature that never passed this way.');
        }
      });
    },
  });
}
