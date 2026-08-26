// DECK 7 — Pod Bay → Uplink Array. THE TWIST + META.
// Phase 1: the escape pod rejects you (NO ORGANIC SIGNATURE), then saves
// itself. The reveal: you are E. Voss (instance 2) in maintenance chassis
// MC-7. Phase 2: the uplink — biogel the emitter, seat the capacitor, speak
// the passphrase the shards spell (peaks ascending: W-A-K-E-U-P), align the
// dish to RV-7 (AZ 117 / EL 43, from the observation deck).
// Phase 3 (the finale escape): the array has been dark eleven months and
// must be woken in a STRICT cold-start order or the one-shot cell is wasted.
// Throw the six ignition steps in the true engineering order, deduced from
// the cold-start placard, the dish-gimbal caution, and Gus's comms note:
//   THERMAL -> POWER -> ATTITUDE -> CARRIER -> HANDSHAKE -> BURST
// (thaw the lines, main bus on, null the tumble, RF carrier up, RV-7
//  answers, fire the cell). A wrong order trips the breaker and springs the
//  whole sequence back. Then Gus asks to come, and you transmit.

// The six cold-start steps. `name` is on the console key; `gloss` is the plain
// meaning the evidence teaches — no jargon knowledge required to order them.
const IGNITION = [
  { id: 'thermal',   name: 'THERMAL',   gloss: 'thaw the lines' },
  { id: 'power',     name: 'POWER BUS', gloss: 'main bus on' },
  { id: 'attitude',  name: 'ATTITUDE',  gloss: 'null the tumble' },
  { id: 'carrier',   name: 'CARRIER',   gloss: 'RF carrier up' },
  { id: 'handshake', name: 'HANDSHAKE', gloss: 'RV-7 answers' },
  { id: 'burst',     name: 'BURST',     gloss: 'fire the cell' },
];
// How the keys sit on the console before you touch them — scrambled, not the answer.
const IGN_TRAY = ['carrier', 'burst', 'thermal', 'handshake', 'power', 'attitude'];
// The true cold-start order, cold array to committed signal.
const IGN_SOLUTION = ['thermal', 'power', 'attitude', 'carrier', 'handshake', 'burst'];

export default {
  id: 'podbay',
  title: 'Pod Bay',
  intro: 'One escape pod left, prepped and patient in its cradle, running lights breathing green. Sixty meters of open deck between you and it. "Elin," says Gus behind you, in a voice with no jokes left in it at all. "Before you scan — remember that I stayed."',

  scene(state) {
    return state.flags.podbay_inArray ? arrayScene(state) : podScene(state);
  },

  hotspots(state) {
    return state.flags.podbay_inArray ? arraySpots(state) : podSpots(state);
  },

  hintContext(state) {
    if (state.flags.podbay_inArray) {
      const prepped = state.flags.array_emitter && state.flags.array_cap
        && state.flags.array_pass && state.flags.array_aligned;
      return prepped ? 'ignition' : 'uplink';
    }
    return state.flags.podbay_revealed ? 'go' : 'pod';
  },

  hints(state) {
    if (!state.flags.podbay_inArray) {
      if (!state.flags.podbay_revealed) {
        return [
          { text: 'The scanner is not broken. Scanners rarely are. Consider instead that it is telling the truth.', cost: 60 },
          { text: 'What did it fail to find? Cross-check your own log: the blank pod, the 212-kilogram scale, the sealed med file, the empty core that "migrated to maintenance chassis 7". Now read your sleeve.', cost: 120 },
          { text: 'Look at your hands. Then let Gus talk. The pod was never your door — the bulkhead behind the bay is.', cost: 240 },
        ];
      }
      return [
        { text: 'The pod bay is finished with you, and honestly it was never that into you. The rear bulkhead has opened.', cost: 60 },
        { text: 'The uplink array is through the rear bulkhead — the station\'s voice. You are going to become a sentence it says.', cost: 120 },
        { text: 'Click the opened bulkhead at the back of the bay.', cost: 240 },
      ];
    }
    const prepped = state.flags.array_emitter && state.flags.array_cap
      && state.flags.array_pass && state.flags.array_aligned;
    if (prepped) {
      return [
        { text: 'The array is built, but eleven months cold. It has to be woken in the right order or the one-shot cell is wasted. The cold-start placard on the console, the caution on the dish gimbal, and Gus\'s comms note hold the whole sequence between them.', cost: 60 },
        { text: 'Thaw the frozen lines before you power them; power the bus before the gyros can fight the spin; null the tumble before the dish will hold a heading and raise the carrier; get RV-7\'s answer before you commit; the cell bursts last.', cost: 120 },
        { text: 'THERMAL, POWER BUS, ATTITUDE, CARRIER, HANDSHAKE, BURST.', cost: 240 },
      ];
    }
    return [
      { text: 'Four sockets, in effect: mend, power, speak, aim. The emitter is cracked, the charge slot is empty, the console wants a word, the dish wants a direction.', cost: 60 },
      { text: 'Biogel mends the emitter. The capacitor powers it. The word is written in your six shards — the plaque on the console says how to order them: fewest wave-peaks speaks first. The direction is in your suit log, from the observation deck.', cost: 120 },
      { text: 'Gel the emitter, seat the capacitor, type WAKEUP, set AZ 117 / EL 43. Then the console wants the cold-start sequence.', cost: 240 },
    ];
  },
};

/* ================= PHASE 1 — the pod bay ================= */

function podScene(state) {
  const scanned = !!state.flags.podbay_scan1;
  const gone = !!state.flags.podbay_podGone;
  const revealed = !!state.flags.podbay_revealed;

  return `
  <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gd_pb_wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#0f1219"/>
        <stop offset="1" stop-color="#1c202c"/>
      </linearGradient>
      <radialGradient id="gd_pb_burn" cx="0.5" cy="1" r="1">
        <stop offset="0" stop-color="rgba(255,120,50,0.4)"/>
        <stop offset="0.5" stop-color="rgba(255,120,50,0.1)"/>
        <stop offset="1" stop-color="rgba(255,120,50,0)"/>
      </radialGradient>
    </defs>

    <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="art/podbay.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="art/podbay.mp4" type="video/mp4"/></video></foreignObject>

    <!-- launch doors / the burn beyond -->
    <g>
      <rect x="500" y="90" width="620" height="420" rx="16" fill="#04070d" stroke="#26313f" stroke-width="10"/>
      <rect x="500" y="90" width="620" height="420" rx="16" fill="url(#gd_pb_burn)" class="flicker"/>
      ${gone ? `<path d="M700 380 Q900 260 1080 160" stroke="rgba(255,180,94,0.7)" stroke-width="5" fill="none" stroke-dasharray="6 14"/>
        <text x="810" y="470" text-anchor="middle" font-size="13" fill="#5d7080" font-family="Consolas, monospace">POD AWAY — UNOCCUPIED</text>` : ''}
    </g>

    <!-- the pod (until it saves itself) -->
    ${gone ? '' : `
    <g>
      <ellipse cx="810" cy="600" rx="180" ry="26" fill="#0a0d13"/>
      <path d="M680 590 Q680 440 810 430 Q940 440 940 590 Q875 620 810 620 Q745 620 680 590 Z"
        fill="#2b3547" stroke="#39485a" stroke-width="5"/>
      <ellipse cx="810" cy="500" rx="52" ry="64" fill="#101b28" stroke="#4fd8d0" stroke-width="2.5"/>
      <g class="flicker">
        <circle cx="700" cy="575" r="5" fill="#7bc47f"/>
        <circle cx="920" cy="575" r="5" fill="#7bc47f"/>
      </g>
      <text x="810" y="655" text-anchor="middle" font-size="12" fill="#5d7080" font-family="Consolas, monospace">POD 1 — PREFLIGHT COMPLETE · AWAITING OCCUPANT</text>
    </g>`}

    <!-- biometric arch -->
    <g>
      <path d="M340 640 L340 300 Q420 240 500 300 L500 640" fill="none" stroke="${scanned ? '#e05252' : '#4fd8d0'}" stroke-width="10" class="${scanned ? 'flicker' : ''}"/>
      <rect x="360" y="330" width="120" height="44" rx="8" fill="#0d1a26" stroke="#2b3547" stroke-width="3"/>
      <text x="420" y="349" text-anchor="middle" font-size="10" fill="${scanned ? '#ff8f8f' : '#8fa3b8'}" font-family="Consolas, monospace">${scanned ? 'NO ORGANIC' : 'BIOMETRIC'}</text>
      <text x="420" y="364" text-anchor="middle" font-size="10" fill="${scanned ? '#ff8f8f' : '#8fa3b8'}" font-family="Consolas, monospace">${scanned ? 'SIGNATURE' : 'GATE'}</text>
    </g>

    <!-- dark viewport that finally shows a reflection -->
    <g>
      <rect x="90" y="150" width="200" height="300" rx="14" fill="#03050a" stroke="#26313f" stroke-width="6"/>
      ${revealed || gone ? `
        <g opacity="0.55">
          <ellipse cx="190" cy="290" rx="40" ry="34" fill="none" stroke="#8fa3b8" stroke-width="3"/>
          <circle cx="190" cy="286" r="9" fill="none" stroke="#4fd8d0" stroke-width="2.5"/>
          <line x1="190" y1="252" x2="190" y2="238" stroke="#8fa3b8" stroke-width="2.5"/>
          <circle cx="190" cy="235" r="3" fill="#ffb45e"/>
          <path d="M152 306 q-8 5 -6 13 M228 306 q8 5 6 13" stroke="#8fa3b8" stroke-width="3" fill="none"/>
        </g>
        <text x="190" y="420" text-anchor="middle" font-size="11" fill="#5d7080" font-family="Consolas, monospace">hello, MC-7</text>`
      : `<text x="190" y="310" text-anchor="middle" font-size="11" fill="#3a4556" font-family="Consolas, monospace">— glare —</text>`}
    </g>

    <!-- rear bulkhead to the array -->
    <g>
      <path d="M1400 640 L1400 330 Q1470 280 1540 330 L1540 640 Z" fill="${revealed ? '#0b131e' : '#161a24'}" stroke="#26313f" stroke-width="8"/>
      ${revealed
        ? `<text x="1470" y="480" text-anchor="middle" font-size="12" fill="#4fd8d0" font-family="Consolas, monospace" class="flicker">UPLINK ARRAY →</text>`
        : `<text x="1470" y="480" text-anchor="middle" font-size="11" fill="#3a4556" font-family="Consolas, monospace">MAINTENANCE ONLY</text>`}
    </g>

    <path d="M0 900 L0 860 Q800 905 1600 860 L1600 900 Z" fill="#04070d"/>
  </svg>`;
}

function podSpots(state) {
  const scanned = !!state.flags.podbay_scan1;
  const gone = !!state.flags.podbay_podGone;
  const revealed = !!state.flags.podbay_revealed;
  const spots = [];

  if (!gone) {
    spots.push({
      id: 'pod', x: 660, y: 420, w: 300, h: 220, label: 'The escape pod',
      onInteract(game) {
        if (!scanned) {
          game.setFlag('podbay_scan1');
          game.playSfx('wrong');
          game.say('You step through the arch. It sweeps you head to toe, twice, the second pass slower — almost puzzled. Then, in red: SCANNING… NO ORGANIC SIGNATURE DETECTED. OCCUPANT REJECTED. HAVE A PLEASANT DAY.');
          game.refreshScene();
        } else {
          game.setFlag('podbay_podGone');
          game.playSfx('stone');
          game.say('You try again — and the pod decides. Clamps release, the launch doors iris, and POD 1 punches out into the burn-tinged dark. Empty. Saving itself, because its one job is to save an occupant, and as far as it can tell... there isn\'t one.');
          game.refreshScene();
        }
      },
    });
  }

  spots.push({
    id: 'arch', x: 330, y: 280, w: 190, h: 360, label: 'Biometric arch',
    onInteract(game) {
      game.say(scanned
        ? 'NO ORGANIC SIGNATURE DETECTED, the arch repeats, patient as arithmetic. It is not malfunctioning. Nothing on this station has been malfunctioning. That is the problem.'
        : 'A standard biometric gate: pulse, tissue density, DNA sniff. Formality, really. You walk through gates like this your whole life without thinking. You are, suddenly, thinking.');
    },
  });

  if (gone && !revealed) {
    spots.push({
      id: 'hands', x: 600, y: 660, w: 400, h: 160, label: 'Your hands',
      onInteract(game) { revealSequence(game); },
    });
  }

  spots.push({
    id: 'window', x: 80, y: 255, w: 220, h: 205, label: 'The dark viewport',
    onInteract(game) {
      if (revealed || gone) {
        game.say('The reflection looks back: a maintenance chassis, drone-framed, one warm optic where you have been assuming eyes. It raises a hand when you do. Of course it does.');
      } else {
        game.say('Dark glass. You lean in and the glare slides across it, hiding you the way it has hidden you in every surface on this station. Every single one. All night.');
      }
    },
  });

  spots.push({
    id: 'bulkhead', x: 1390, y: 320, w: 160, h: 320, label: revealed ? 'To the uplink array' : 'Rear bulkhead',
    onInteract(game) {
      if (!revealed) {
        game.say('MAINTENANCE ONLY. The lock reads your suit and, oddly, hesitates — like it is politely pretending not to recognize you.');
        return;
      }
      game.setFlag('podbay_inArray');
      game.playSfx('unlock');
      game.say('The maintenance bulkhead opens for you instantly — it always would have. Beyond, the uplink array climbs into the dark: the station\'s voice, waiting for something worth saying.');
      game.refreshScene();
    },
  });

  return spots;
}

function revealSequence(game) {
  game.playSfx('hint');
  game.dialog({
    title: 'Your Hands',
    wide: true,
    html: `
      <div class="datapad corrupt" style="max-width:560px;">
        <div class="pad-title">— look —</div>
        Gloves you have not once taken off. A grip that never tires. Fingers that felt no cold
        in the cryo bay, no heat by the reactor. You peel the glove back.<br><br>
        Alloy. Articulated. Beautiful, in the way honest machines are.<br><br>
        <span class="pad-warn">The scale said 212 kilograms. The pod said no organic signature.
        The manifest said VOSS, E. — DECEASED, BACKUP COMPLETE. The core said MIGRATED →
        MAINTENANCE CHASSIS 7. Your sleeve says MC-7.</span><br><br>
        The shards were never someone else's memories.
      </div>
      <p style="margin-top:14px; font-style:italic; color:var(--text-dim);">Gus drifts around
      to where your eyes are, so you do not have to turn.</p>
      <div class="datapad" style="max-width:560px;">
        <div class="pad-title">GS-1 "GUS"</div>
        "Eleven months ago Dr. Elin Voss finished her backup and asked me two things.
        Keep the instance safe. And wake her with the word she chose — when there was a way out.<br><br>
        The evacuation took the pods. But it left the array. You built me a voice once, Elin,
        when the crew slept. Let the station return the favor: we will make you a signal.<br><br>
        I did not want you to wake alone. So I stayed."
      </div>`,
    buttons: [
      {
        label: 'Stand up. Finish this.',
        class: 'btn-primary',
        onClick: () => {
          game.setFlag('podbay_revealed');
          game.playSfx('solve');
          game.say('You flex the hand that has carried you through seven decks. It is a good hand. It was always a good hand. The rear bulkhead — MAINTENANCE ONLY — slides open behind you, and you understand, at last, that it was never keeping you out. It was waiting for you to know you belonged through it.');
          game.refreshScene();
        },
      },
    ],
  });
}

/* ================= PHASE 2 — the uplink array ================= */

function arrayScene(state) {
  const gel = !!state.flags.array_emitter;
  const cap = !!state.flags.array_cap;
  const pass = !!state.flags.array_pass;
  const aligned = !!state.flags.array_aligned;
  const launched = !!state.flags.array_launched;
  const prepped = gel && cap && pass && aligned;
  const az = state.flags.array_az ?? 0;
  const el = state.flags.array_el ?? 0;

  return `
  <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gd_ua_sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#03050c"/>
        <stop offset="0.6" stop-color="#0a1220"/>
        <stop offset="1" stop-color="#2a1a14"/>
      </linearGradient>
      <radialGradient id="gd_ua_burn" cx="0.5" cy="1" r="1">
        <stop offset="0" stop-color="rgba(255,120,50,0.55)"/>
        <stop offset="0.5" stop-color="rgba(255,120,50,0.15)"/>
        <stop offset="1" stop-color="rgba(255,120,50,0)"/>
      </radialGradient>
    </defs>

    <!-- open to space through the array frame; re-entry glow rising -->
    <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="art/uplink.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="art/uplink.mp4" type="video/mp4"/></video></foreignObject>
    <!-- RV-7, a patient chip of light -->
    <circle cx="1310" cy="180" r="4" fill="#8ff0ea" class="flicker"/>
    <text x="1310" y="158" text-anchor="middle" font-size="11" fill="#4fd8d0" font-family="Consolas, monospace">RV-7</text>

    <!-- framework beams over the re-entry glow (deck now supplied by the plate) -->
    <g stroke="#1c2430" stroke-width="14" fill="none" opacity="0.9">
      <path d="M100 640 L260 120 M500 640 L420 120 M420 120 L260 120"/>
      <path d="M1500 640 L1380 200"/>
    </g>

    <!-- the dish (photoreal) -->
    <g style="transform: rotate(${aligned ? -16 : -5}deg); transform-origin: 780px 440px; transition: transform 1.2s cubic-bezier(0.22,1,0.36,1);">
      <image href="art/array-dish.webp" x="574" y="214" width="412" height="300" preserveAspectRatio="xMidYMin slice"/>
      <!-- the emitter head (biogel target) -->
      <circle cx="780" cy="238" r="26" fill="#101b28" stroke="${gel ? '#7bc47f' : '#e05252'}" stroke-width="4" class="${gel ? '' : 'flicker'}"/>
      ${gel
        ? `<circle cx="780" cy="238" r="12" fill="rgba(123,196,127,0.5)" class="glow fast"/>`
        : `<path d="M766 226 L794 250 M788 224 L776 238" stroke="#e05252" stroke-width="2.5"/>`}
    </g>
    <rect x="748" y="450" width="64" height="200" fill="rgba(28,36,48,0.55)"/>

    <!-- console -->
    <g>
      <rect x="1060" y="560" width="440" height="230" rx="14" fill="#141c26" stroke="${pass && cap && gel ? '#7bc47f' : '#2b3547'}" stroke-width="4"/>
      <text x="1280" y="592" text-anchor="middle" font-size="14" fill="#8fa3b8" letter-spacing="2" font-family="Consolas, monospace">UPLINK CONTROL</text>
      <text x="1280" y="614" text-anchor="middle" font-size="10.5" fill="#4fd8d0" font-family="Consolas, monospace">"SIX SHARDS MAKE THE WORD. THE FEWEST PEAKS SPEAK FIRST."</text>
      <g font-family="Consolas, monospace" font-size="12">
        <text x="1090" y="648" fill="${gel ? '#7bc47f' : '#ff8f8f'}">${gel ? '✓' : '✗'} EMITTER ${gel ? 'MENDED' : 'CRACKED'}</text>
        <text x="1090" y="674" fill="${cap ? '#7bc47f' : '#ff8f8f'}">${cap ? '✓' : '✗'} CHARGE ${cap ? 'SEATED' : 'EMPTY'}</text>
        <text x="1090" y="700" fill="${pass ? '#7bc47f' : '#ff8f8f'}">${pass ? '✓' : '✗'} PASSPHRASE ${pass ? 'ACCEPTED' : 'REQUIRED'}</text>
        <text x="1090" y="726" fill="${aligned ? '#7bc47f' : '#ff8f8f'}">${aligned ? '✓' : '✗'} DISH ${aligned ? 'LOCKED: AZ 117 · EL 43' : `AZ ${az} · EL ${el}`}</text>
      </g>
      ${prepped
        ? `<rect x="1150" y="742" width="260" height="38" rx="9" fill="rgba(79,216,208,0.18)" stroke="#4fd8d0" stroke-width="2.5" class="beckon"/>
           <text x="1280" y="767" text-anchor="middle" font-size="15" fill="#8ff0ea" font-family="Consolas, monospace">${launched ? '▶ TRANSMIT' : '▶ BEGIN COLD-START'}</text>`
        : ''}
    </g>

    <!-- COLD-START PLACARD: bolted above the console (order rules) -->
    <g>
      <rect x="1080" y="470" width="200" height="74" rx="8" fill="#0d1a26" stroke="#4fd8d0" stroke-width="2.5"/>
      <text x="1180" y="492" text-anchor="middle" font-size="11" letter-spacing="2" fill="#4fd8d0" font-family="Consolas, monospace">COLD-START</text>
      ${[506, 520, 534].map((y, i) =>
        `<line x1="1096" y1="${y}" x2="${1250 - i * 22}" y2="${y}" stroke="#39485a" stroke-width="3"/>`).join('')}
    </g>

    <!-- DISH-GIMBAL CAUTION: a yellow label on the mast base -->
    <g>
      <rect x="560" y="470" width="150" height="74" rx="8" fill="#241a10" stroke="#ffb45e" stroke-width="2.5"/>
      <text x="635" y="492" text-anchor="middle" font-size="10" letter-spacing="1" fill="#ffb45e" font-family="Consolas, monospace">⚠ GIMBAL</text>
      ${[506, 520, 534].map((y, i) =>
        `<line x1="576" y1="${y}" x2="${694 - i * 18}" y2="${y}" stroke="#5a4426" stroke-width="3"/>`).join('')}
    </g>

    <!-- GUS'S COMMS NOTE: a taped datapad, upper-left deck -->
    <g transform="rotate(-3 425 340)">
      <rect x="330" y="300" width="190" height="80" rx="6" fill="#101b28" stroke="#5d7080" stroke-width="2.5"/>
      <text x="425" y="322" text-anchor="middle" font-size="10" letter-spacing="1" fill="#8fa3b8" font-family="Consolas, monospace">— GS-1 "GUS" —</text>
      ${[336, 350, 364].map((y, i) =>
        `<line x1="346" y1="${y}" x2="${500 - i * 20}" y2="${y}" stroke="#39485a" stroke-width="3"/>`).join('')}
    </g>

    <!-- capacitor socket -->
    <g>
      <rect x="620" y="660" width="120" height="110" rx="10" fill="#141c26" stroke="${cap ? '#7bc47f' : '#ffb45e'}" stroke-width="4" class="${cap ? '' : 'beckon'}"/>
      ${cap
        ? `<rect x="656" y="682" width="48" height="62" rx="8" fill="#1c2734" stroke="#ffb45e" stroke-width="3"/>
           <path d="M674 698 L688 716 L678 716 L686 732" stroke="#ffb45e" stroke-width="3" fill="none"/>`
        : `<rect x="656" y="682" width="48" height="62" rx="8" fill="#04070d" stroke="#39485a" stroke-width="3" stroke-dasharray="6 5"/>`}
      <text x="680" y="792" text-anchor="middle" font-size="10" fill="#5d7080" font-family="Consolas, monospace">CHARGE SOCKET</text>
    </g>

    <path d="M0 900 L0 862 Q800 905 1600 862 L1600 900 Z" fill="#04070d"/>
  </svg>`;
}

function arraySpots(state) {
  const gel = !!state.flags.array_emitter;
  const cap = !!state.flags.array_cap;
  const pass = !!state.flags.array_pass;
  const aligned = !!state.flags.array_aligned;
  const spots = [];

  spots.push({
    id: 'emitter', x: 640, y: 150, w: 280, h: 200, label: gel ? 'The emitter (mended)' : 'The emitter — cracked',
    onInteract(game) {
      if (gel) { game.say('The biogel has set into the crack like green glass. Organic-derived conductive medium, the label said. There is a joke in there. You are not ready to laugh at it yet.'); return; }
      if (game.selectedItem === 'biogel') {
        game.useSelected();
        game.setFlag('array_emitter');
        game.playSfx('pour');
        game.say('You work the biogel into the fracture and it knits, conductive and glad. "For dermal grafts and emitter repair," you quote. Gus, softly: "The med bay always did stock for both kinds of body."');
        game.refreshScene();
      } else {
        game.say('The emitter head is cracked through — micrometeorite, probably, the same strike that doomed the orbit. It needs a conductive filler. Something the med bay would stock.');
      }
    },
  });

  spots.push({
    id: 'socket', x: 610, y: 650, w: 140, h: 130, label: cap ? 'Charge socket (seated)' : 'Charge socket — empty',
    onInteract(game) {
      if (cap) { game.say('The capacitor sits seated and humming, counting down to its one great shout.'); return; }
      if (game.selectedItem === 'charged_capacitor') {
        game.useSelected();
        game.setFlag('array_cap');
        game.playSfx('unlock');
        game.say('The capacitor slides home and the whole array wakes around you — rib lights climbing the frame, the dish motors testing their range like a bird checking its wings.');
        game.refreshScene();
      } else {
        game.say('An empty charge socket, big enough for one fist-sized cell. The reactor\'s pre-charge bus cooked exactly one of those, and you carried it here.');
      }
    },
  });

  spots.push({
    id: 'console', x: 1050, y: 550, w: 460, h: 250, label: 'Uplink control',
    onInteract(game) {
      if (gel && cap && pass && aligned) {
        if (game.getFlag('array_launched')) doTransmit(game);
        else openIgnition(game);
        return;
      }
      if (!pass) { openPassphrase(game); return; }
      if (!aligned) { openAlignment(game); return; }
      game.say('The console ticks through its checklist and points, politely, at whatever is still red.');
    },
  });

  spots.push({
    id: 'placard', x: 1080, y: 470, w: 200, h: 74, label: 'Cold-start placard',
    onInteract(game) {
      const html = `<div class="datapad"><div class="pad-title">EMERGENCY UPLINK — COLD-START</div>
        This array has been dark since the evacuation. Bring it up <strong>in order</strong>
        or the pre-charge cell is spent for nothing.<br><br>
        &bull; <strong>THAW before you POWER</strong> — a frozen line cracks under load. Begin
        with the coolant bleed; nothing precedes it.<br>
        &bull; The cell <strong>BURSTS last</strong>. It fires exactly once.</div>`;
      game.journal.add('note_coldstart', { title: 'Cold-start placard (Uplink Array)', category: 'note', html });
      game.dialog({ title: 'Cold-Start Placard', html });
    },
  });

  spots.push({
    id: 'gimbal', x: 560, y: 470, w: 150, h: 74, label: 'Dish-gimbal caution',
    onInteract(game) {
      const html = `<div class="datapad"><div class="pad-title">⚠ GIMBAL CAUTION</div>
        The dish will <strong>not hold a heading while the station tumbles</strong>. Null the
        station's attitude <strong>before</strong> you raise the RF carrier — a carrier on a
        rolling platform only sprays the sky.</div>`;
      game.journal.add('note_gimbal', { title: 'Dish-gimbal caution (Uplink Array)', category: 'note', html });
      game.dialog({ title: 'Gimbal Caution', html });
    },
  });

  spots.push({
    id: 'commsnote', x: 330, y: 300, w: 190, h: 80, label: "Gus's comms note",
    onInteract(game) {
      const html = `<div class="datapad"><div class="pad-title">GS-1 "GUS" — comms note</div>
        "I ran the cold-start a hundred times in simulation while you slept, Elin.<br><br>
        No bus, no gyros — <strong>power before you fight the spin</strong>. And never commit
        the burst to a carrier RV-7 has not answered: <strong>carrier, then handshake, then
        send</strong>."</div>`;
      game.journal.add('note_gus_comms', { title: "Gus's comms note (Uplink Array)", category: 'note', html });
      game.dialog({ title: "Gus's Comms Note", html });
    },
  });

  spots.push({
    id: 'rv7', x: 1240, y: 130, w: 150, h: 90, label: 'RV-7, holding',
    onInteract(game) {
      game.say('The rescue ship holds its patient distance beyond the debris field. "WE ARE LISTENING," its beacon repeats. They knew, you realize. They have known what kind of rescue this would be since before they set out.');
    },
  });

  spots.push({
    id: 'burn', x: 200, y: 560, w: 350, h: 200, label: 'The burn below',
    onInteract(game) {
      game.say('The horizon is properly on fire now — a long orange blade where the atmosphere has begun tasting the station\'s lowest antennas. Minutes, not hours. It is a spectacular view. You would rather admire it from farther away.');
    },
  });

  return spots;
}

function openPassphrase(game) {
  const shards = game.state.journal.filter(e => e.category === 'sun');

  game.openPuzzle({
    id: 'array_pass',
    title: 'Voiceprint Passphrase',
    render(body, api) {
      body.innerHTML = `
        <p class="puzzle-desc">The console holds a sealed instruction, eleven months old:
        <em>"Wake her with the word she chose."</em> Then, etched beneath —
        <strong style="color:#4fd8d0;">"SIX SHARDS MAKE THE WORD. THE FEWEST PEAKS SPEAK FIRST."</strong><br>
        Your suit log holds ${shards.length} of 6 shards${shards.length < 6 ? ' — some are missing' : ''}.</p>
        <div class="puzzle-row">
          <input class="puzzle-input" id="ua-pass" maxlength="12" autocomplete="off"
            style="min-width: 240px; text-transform: uppercase;" placeholder="······"/>
        </div>
        <div class="puzzle-row"><button class="btn btn-primary" id="ua-speak">Speak the Word</button></div>
        <div class="puzzle-feedback"></div>
        <p style="text-align:center; margin-top:8px; font-size:13px; color:var(--text-dim);">
          (Your <strong>Suit Log</strong> — top right — shows every shard's wave-peaks and letter.)</p>`;

      const input = body.querySelector('#ua-pass');
      const trySpeak = () => {
        const word = input.value.trim().toUpperCase().replace(/[^A-Z]/g, '');
        if (word === 'WAKEUP') {
          game.setFlag('array_pass');
          game.playSfx('solve');
          api.solved({ message: 'PASSPHRASE ACCEPTED, says the console — and then, because she programmed it herself eleven months ago, it adds: "Good morning, Elin."' });
          game.refreshScene();
        } else {
          api.fail('VOICEPRINT REJECTED. Not the word you chose.');
        }
      };
      body.querySelector('#ua-speak').addEventListener('click', trySpeak);
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') trySpeak(); });
      setTimeout(() => input.focus(), 400);
    },
  });
}

function openAlignment(game) {
  const vals = {
    az: game.getFlag('array_az') ?? 0,
    el: game.getFlag('array_el') ?? 0,
  };
  const MAX = { az: 360, el: 90 };

  game.openPuzzle({
    id: 'array_align',
    title: 'Dish Alignment',
    render(body, api) {
      function draw() {
        body.innerHTML = `
          <p class="puzzle-desc">The dish will hold one heading through the burn — it has to be
          the right one. Somewhere out there, RV-7 is holding still and listening.
          Your suit log knows exactly where.</p>
          <div class="puzzle-row" style="gap:40px;">
            ${['az', 'el'].map(axis => `
              <div style="text-align:center;">
                <div class="lever-label" style="margin-bottom:6px;">${axis === 'az' ? 'AZIMUTH' : 'ELEVATION'}</div>
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
            <button class="btn btn-primary" id="ua-lock">Lock Heading</button>
          </div>
          <div class="puzzle-feedback"></div>`;

        body.querySelectorAll('[data-axis]').forEach(b => b.addEventListener('click', () => {
          const axis = b.dataset.axis;
          const max = MAX[axis];
          vals[axis] = ((vals[axis] + Number(b.dataset.d)) % max + max) % max;
          game.setFlag(`array_${axis}`, vals[axis]);
          const face = body.querySelector(`[data-face="${axis}"]`);
          face.textContent = vals[axis];
          face.classList.remove('tick'); void face.offsetWidth; face.classList.add('tick');
          game.playSfx('click');
        }));

        body.querySelector('#ua-lock').addEventListener('click', () => {
          if (vals.az === 117 && vals.el === 43) {
            game.setFlag('array_aligned');
            game.playSfx('stone');
            api.solved({ message: 'The dish swings up and locks — AZ 117, EL 43 — and immediately the receive light flutters: RV-7\'s carrier, loud and close and waiting. They really are listening.' });
            game.refreshScene();
          } else {
            api.fail('The dish sweeps static. Nobody home on that heading.');
          }
        });
      }
      draw();
    },
  });
}

function openIgnition(game) {
  // order = step ids placed left-to-right into the six sequence slots.
  let order = [];

  game.openPuzzle({
    id: 'array_ignition',
    title: 'Cold-Start Sequence',
    wide: true,
    render(body, api) {
      body.innerHTML = `
        <p class="puzzle-desc">The array is built, but eleven months cold — and the pre-charge
        cell fires <em>once</em>. The console will not transmit until you run the emergency
        cold-start <strong>in its true order</strong>. Seat the six steps in sequence; a wrong
        order trips the breaker and springs the whole bank. The cold-start placard, the gimbal
        caution, and Gus's comms note tell you the order between them.</p>
        <div class="seq-slots" id="ign-slots"></div>
        <div class="seq-tray" id="ign-tray"></div>
        <div class="puzzle-row"><button class="btn btn-primary" id="ign-run">Run the Sequence</button></div>
        <div class="puzzle-feedback"></div>`;

      const slotsEl = body.querySelector('#ign-slots');
      const trayEl = body.querySelector('#ign-tray');
      const step = (id) => IGNITION.find(s => s.id === id);

      function draw() {
        slotsEl.innerHTML = '';
        for (let i = 0; i < 6; i++) {
          const id = order[i];
          const slot = document.createElement('div');
          slot.className = 'seq-slot' + (id ? ' filled' : '');
          if (id) {
            const s = step(id);
            slot.innerHTML = `<span class="seq-ord">${i + 1}</span>
              <span class="seq-name">${s.name}</span><span class="seq-gloss">${s.gloss}</span>`;
            slot.title = 'Pull this step back';
            slot.addEventListener('click', () => { order.splice(i, 1); game.playSfx('click'); draw(); });
          } else {
            slot.innerHTML = `<span class="seq-ord">${i + 1}</span><span class="seq-gloss">—</span>`;
          }
          slotsEl.appendChild(slot);
        }
        trayEl.innerHTML = '';
        for (const id of IGN_TRAY) {
          if (order.includes(id)) continue;
          const s = step(id);
          const chip = document.createElement('button');
          chip.className = 'seq-chip';
          chip.innerHTML = `<span class="seq-name">${s.name}</span><span class="seq-gloss">${s.gloss}</span>`;
          chip.addEventListener('click', () => {
            if (order.length >= 6) return;
            order.push(id);
            game.playSfx('click');
            draw();
          });
          trayEl.appendChild(chip);
        }
      }
      draw();

      body.querySelector('#ign-run').addEventListener('click', () => {
        if (order.length < 6) {
          api.setFeedback('Six steps, six slots. The sequence is incomplete — the console will not arm.', 'bad');
          return;
        }
        const correct = order.every((id, i) => id === IGN_SOLUTION[i]);
        if (correct) {
          game.setFlag('array_launched');
          game.playSfx('solve');
          api.solved({ message: 'The array wakes in order — lines thawing, bus closing, the tumble bleeding off until the dish holds dead still, the carrier climbing, and then, clean and close, RV-7\'s handshake. Every light on the console goes green at once. The cell is armed for its one shout.' });
          game.refreshScene();
          setTimeout(() => doTransmit(game), 1100);
        } else {
          order = [];
          draw();
          api.fail('A breaker trips somewhere in the frame and the whole sequence springs back to cold. Out of order — you will spend the one shot on nothing. Read the placard, the gimbal, and Gus again.');
        }
      });
    },
  });
}

function doTransmit(game) {
  game.dialog({
    title: 'One Last Thing',
    html: `
      <div class="gus-dialog">
        <div class="gus-portrait" style="flex: 0 0 100px;">
          <svg viewBox="0 0 120 140" style="width:100px;">
            <circle cx="60" cy="58" r="34" fill="#5d7080"/>
            <ellipse cx="60" cy="58" rx="24" ry="20" fill="#141c26"/>
            <circle cx="60" cy="57" r="11" fill="#4fd8d0"/>
            <circle cx="56" cy="53" r="3.2" fill="#eafffd"/>
            <line x1="60" y1="22" x2="60" y2="10" stroke="#5d7080" stroke-width="3"/>
            <circle cx="60" cy="8" r="4" fill="#ffb45e"/>
          </svg>
        </div>
        <div class="gus-right">
          <p class="gus-speech">"The buffer has room for two signals, Elin. I have... never asked
          anyone for anything. Machines don't. But I have been alone on this station for eleven
          months, and I find that I would rather not be alone on it for the last eleven minutes."</p>
          <p class="gus-speech" style="font-size:14px; opacity:0.85;">"May I come with you?"</p>
        </div>
      </div>`,
    buttons: [
      {
        label: 'Slot his core in beside yours',
        class: 'btn-primary',
        onClick: () => {
          game.playSfx('victory');
          game.say('Gus\'s core clicks into the buffer beside yours — warm, familiar, humming the maintenance hymn he thinks nobody notices. You put your alloy hand on the TRANSMIT key. Below, the sky is fire. Ahead, someone is listening. You press it.');
          setTimeout(() => game.completeRoom({ delay: 400 }), 2600);
        },
      },
    ],
  });
}
