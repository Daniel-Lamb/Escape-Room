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

import { kitDefs, panel, shadow } from '../../../shared/js/scenekit.js';

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

// Layout — read off the plates. Pod bay (art/podbay.webp): pod + cradle left,
// hull port behind it, octagonal porthole, rear bulkhead doors centre, the
// scanner arch right. Uplink (art/uplink.webp): dish + tower left, the planet's
// burning limb across the right; a gantry deck is drawn across the foreground.
const PB = {
  pod: { cx: 356, cy: 470, rx: 262, ry: 170 },
  port: { x: 100, y: 288, w: 140, h: 200 },
  oct: 'M612 276 L688 276 L716 304 L716 460 L688 488 L612 488 L584 460 L584 304 Z',
  win: { cx: 650, cy: 382 },
  doors: { x: 790, y: 240, w: 410, h: 320 },
  arch: { x: 1276, y: 238, w: 224, h: 376 },
};
const UA = {
  rv7: { x: 1400, y: 250 },
  emit: { x: 534, y: 284 },
  gimbal: { x: 320, y: 610, w: 160, h: 70 },
  note: { x: 620, y: 620, w: 180, h: 80 },
  socket: { x: 840, y: 662 },
  placard: { x: 1080, y: 440, w: 200, h: 76 },
  con: { x: 1040, y: 560, w: 440, h: 214 },
};

export default {
  id: 'podbay',
  lintStates: [
    { label: 'launched', flags: { podbay_inArray: true, array_emitter: true, array_cap: true, array_pass: true, array_aligned: true, array_launched: true } },
    { label: 'revealed', flags: { podbay_scan1: true, podbay_podGone: true, podbay_revealed: true } },
    { label: 'array', flags: { podbay_inArray: true } },
    { label: 'array-ready', flags: { podbay_inArray: true, array_emitter: true, array_cap: true, array_pass: true, array_aligned: true } },
  ],
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
      ${kitDefs()}
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

    <!-- background plate: escape pod on its cradle (left), an octagonal porthole, the rear
         bulkhead doors (centre), a free-standing scanner arch and hull windows (right) -->
    <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="art/podbay.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="art/podbay.mp4" type="video/mp4"/></video></foreignObject>

    <!-- the burn beyond, seen through the hull port behind the pod's cradle -->
    <rect x="${PB.port.x}" y="${PB.port.y}" width="${PB.port.w}" height="${PB.port.h}" rx="14" fill="url(#gd_pb_burn)" class="flicker" data-fx="glow"/>

    <!-- the escape pod (painted) on its cradle; once it saves itself, an empty cradle in the dark -->
    ${gone ? `
      <g data-fx="mask">
        <ellipse cx="${PB.pod.cx}" cy="${PB.pod.cy}" rx="${PB.pod.rx * 1.15}" ry="${PB.pod.ry * 1.15}" fill="url(#sk_shadow)"/>
        <ellipse cx="${PB.pod.cx}" cy="${PB.pod.cy - 10}" rx="${PB.pod.rx * 0.92}" ry="${PB.pod.ry * 0.86}" fill="#07090e" opacity="0.88"/>
        ${[-120, -40, 40, 120].map(dx => `<line x1="${PB.pod.cx + dx}" y1="600" x2="${PB.pod.cx + dx * 0.8}" y2="560" stroke="#2b3547" stroke-width="6"/>`).join('')}
        <path d="M${PB.pod.cx - 220} 612 L${PB.pod.cx + 220} 612" stroke="#2b3547" stroke-width="8"/>
        <path d="M${PB.pod.cx - 150} 360 Q${PB.pod.cx - 300} 300 ${PB.port.x + 40} ${PB.port.y + 60}" stroke="rgba(255,180,94,0.7)" stroke-width="5" fill="none" stroke-dasharray="6 14"/>
      </g>` : ''}
    ${panel({ x: PB.pod.cx - 200, y: 652, w: 400, h: 34, material: 'steel', mount: 'bolts', rx: 5, body: `
      <text x="${PB.pod.cx}" y="674" text-anchor="middle" font-size="11.5" fill="${gone ? '#9fb0c4' : '#cfd8e3'}" font-family="Consolas, monospace">${gone ? 'POD 1 — AWAY · UNOCCUPIED' : 'POD 1 — PREFLIGHT COMPLETE · AWAITING OCCUPANT'}</text>` })}

    <!-- the biometric arch: the painted scanner frame (right); its readout on the crossbar -->
    <g data-mount="bolts">
      ${[PB.arch.x + 18, PB.arch.x + PB.arch.w - 18].map(x => `<rect x="${x - 4}" y="${PB.arch.y + 70}" width="8" height="${PB.arch.h - 110}" rx="3" fill="${scanned ? '#e05252' : '#4fd8d0'}" opacity="0.55" class="${scanned ? 'flicker' : ''}"/>`).join('')}
      <rect x="${PB.arch.x + PB.arch.w / 2 - 62}" y="${PB.arch.y + 18}" width="124" height="44" rx="8" fill="#0d1a26" stroke="#2b3547" stroke-width="3"/>
      <text x="${PB.arch.x + PB.arch.w / 2}" y="${PB.arch.y + 37}" text-anchor="middle" font-size="11.5" fill="${scanned ? '#ff8f8f' : '#8fa3b8'}" font-family="Consolas, monospace">${scanned ? 'NO ORGANIC' : 'BIOMETRIC'}</text>
      <text x="${PB.arch.x + PB.arch.w / 2}" y="${PB.arch.y + 52}" text-anchor="middle" font-size="11.5" fill="${scanned ? '#ff8f8f' : '#8fa3b8'}" font-family="Consolas, monospace">${scanned ? 'SIGNATURE' : 'GATE'}</text>
    </g>

    <!-- the octagonal porthole beside the pod: dark glass that, at last, shows a reflection -->
    <g data-mount="inset">
      <path d="${PB.oct}" fill="#03050a" opacity="0.9"/>
      ${revealed || gone ? `
        <g opacity="0.6" transform="translate(${PB.win.cx - 190} ${PB.win.cy - 290}) scale(1)">
          <ellipse cx="190" cy="290" rx="34" ry="30" fill="none" stroke="#8fa3b8" stroke-width="3"/>
          <circle cx="190" cy="286" r="8" fill="none" stroke="#4fd8d0" stroke-width="2.5"/>
          <line x1="190" y1="258" x2="190" y2="246" stroke="#8fa3b8" stroke-width="2.5"/>
          <circle cx="190" cy="243" r="3" fill="#ffb45e"/>
        </g>
        <text x="${PB.win.cx}" y="${PB.win.cy + 78}" text-anchor="middle" font-size="11" fill="#8fa3b8" font-family="Consolas, monospace">hello, MC-7</text>`
      : `<text x="${PB.win.cx}" y="${PB.win.cy + 4}" text-anchor="middle" font-size="11" fill="#3a4556" font-family="Consolas, monospace">— glare —</text>`}
    </g>

    <!-- the rear bulkhead (the painted centre doors), a stencilled plate above it -->
    <g data-mount="wall">
      ${revealed ? `<rect x="${PB.doors.x + PB.doors.w / 2 - 6}" y="${PB.doors.y + 10}" width="12" height="${PB.doors.h - 20}" fill="#4fd8d0" opacity="0.5" class="flicker"/>` : ''}
      ${panel({ x: PB.doors.x + PB.doors.w / 2 - 90, y: PB.doors.y - 46, w: 180, h: 34, material: 'steel', mount: 'bolts', rx: 4, body: `
        <text x="${PB.doors.x + PB.doors.w / 2}" y="${PB.doors.y - 24}" text-anchor="middle" font-size="11" fill="${revealed ? '#4fd8d0' : '#9fb0c4'}" font-family="Consolas, monospace" ${revealed ? 'class="flicker"' : ''}>${revealed ? 'UPLINK ARRAY →' : 'MAINTENANCE ONLY'}</text>` })}
    </g>

    <!-- your own gloved hands, at the bottom of your view -->
    <g data-mount="hud">
      <path d="M640 900 Q660 820 720 806 Q760 800 770 840 L780 900 Z" fill="#2a3442" stroke="#121820" stroke-width="3"/>
      <path d="M960 900 Q940 820 880 806 Q840 800 830 840 L820 900 Z" fill="#2a3442" stroke="#121820" stroke-width="3"/>
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
      id: 'pod', x: 100, y: 300, w: 510, h: 340, label: 'The escape pod',
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
    id: 'arch', x: PB.arch.x, y: PB.arch.y, w: PB.arch.w, h: PB.arch.h, label: 'Biometric arch',
    onInteract(game) {
      game.say(scanned
        ? 'NO ORGANIC SIGNATURE DETECTED, the arch repeats, patient as arithmetic. It is not malfunctioning. Nothing on this station has been malfunctioning. That is the problem.'
        : 'A standard biometric gate: pulse, tissue density, DNA sniff. Formality, really. You walk through gates like this your whole life without thinking. You are, suddenly, thinking.');
    },
  });

  if (gone && !revealed) {
    spots.push({
      id: 'hands', x: 630, y: 790, w: 340, h: 110, label: 'Your hands',
      onInteract(game) { revealSequence(game); },
    });
  }

  spots.push({
    id: 'window', x: 580, y: 270, w: 140, h: 224, label: 'The dark viewport',
    onInteract(game) {
      if (revealed || gone) {
        game.say('The reflection looks back: a maintenance chassis, drone-framed, one warm optic where you have been assuming eyes. It raises a hand when you do. Of course it does.');
      } else {
        game.say('Dark glass. You lean in and the glare slides across it, hiding you the way it has hidden you in every surface on this station. Every single one. All night.');
      }
    },
  });

  spots.push({
    id: 'bulkhead', ...PB.doors, label: revealed ? 'To the uplink array' : 'Rear bulkhead',
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
      ${kitDefs()}
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
    <circle cx="${UA.rv7.x}" cy="${UA.rv7.y}" r="4" fill="#8ff0ea" class="flicker"/>
    <text x="${UA.rv7.x}" y="${UA.rv7.y - 22}" text-anchor="middle" font-size="11" fill="#4fd8d0" font-family="Consolas, monospace">RV-7</text>

    <!-- the dish is painted (left); its emitter is the feed horn at the focus. Once aligned, a lock line to RV-7 -->
    ${aligned ? `<line x1="${UA.emit.x}" y1="${UA.emit.y}" x2="${UA.rv7.x}" y2="${UA.rv7.y}" stroke="#4fd8d0" stroke-width="2" stroke-dasharray="4 10" opacity="0.6" class="flicker"/>` : ''}
    <g data-mount="bolts">
      <circle cx="${UA.emit.x}" cy="${UA.emit.y}" r="22" fill="#101b28" stroke="${gel ? '#7bc47f' : '#e05252'}" stroke-width="4" class="${gel ? '' : 'flicker'}"/>
      ${gel
        ? `<circle cx="${UA.emit.x}" cy="${UA.emit.y}" r="10" fill="rgba(123,196,127,0.5)" class="glow fast"/>`
        : `<path d="M${UA.emit.x - 12} ${UA.emit.y - 10} L${UA.emit.x + 12} ${UA.emit.y + 12} M${UA.emit.x + 8} ${UA.emit.y - 12} L${UA.emit.x - 4} ${UA.emit.y + 2}" stroke="#e05252" stroke-width="2.5"/>`}
    </g>

    <!-- the gantry deck: grating and railing out from the dish tower across the foreground -->
    <g data-mount="floor">
      <path d="M0 772 L1600 772 L1600 900 L0 900 Z" fill="#0c1018"/>
      ${Array.from({ length: 24 }, (_, i) => `<line x1="${i * 70}" y1="772" x2="${i * 70 - 40}" y2="900" stroke="#1a2230" stroke-width="3"/>`).join('')}
      <line x1="0" y1="772" x2="1600" y2="772" stroke="#2b3547" stroke-width="5"/>
      <line x1="560" y1="712" x2="1600" y2="712" stroke="#3a4556" stroke-width="5"/>
      ${[560, 760, 960, 1160, 1360, 1560].map(x => `<line x1="${x}" y1="712" x2="${x}" y2="772" stroke="#3a4556" stroke-width="5"/>`).join('')}
    </g>

    <!-- dish-gimbal caution, bolted to the mast base -->
    ${panel({ ...UA.gimbal, material: 'steel', mount: 'bolts', rx: 6, body: `
      <rect x="${UA.gimbal.x + 6}" y="${UA.gimbal.y + 6}" width="${UA.gimbal.w - 12}" height="${UA.gimbal.h - 12}" rx="4" fill="#241a10" stroke="#ffb45e" stroke-width="2"/>
      <text x="${UA.gimbal.x + UA.gimbal.w / 2}" y="${UA.gimbal.y + 28}" text-anchor="middle" font-size="11.5" letter-spacing="1" fill="#ffb45e" font-family="Consolas, monospace">⚠ GIMBAL</text>
      ${[42, 54].map((dy, i) => `<line x1="${UA.gimbal.x + 18}" y1="${UA.gimbal.y + dy}" x2="${UA.gimbal.x + UA.gimbal.w - 22 - i * 16}" y2="${UA.gimbal.y + dy}" stroke="#5a4426" stroke-width="3"/>`).join('')}` })}

    <!-- Gus's comms note: a datapad taped to the railing -->
    ${panel({ ...UA.note, material: 'glass', mount: 'pinned', tilt: -3, body: `
      <g transform="rotate(-3 ${UA.note.x + UA.note.w / 2} ${UA.note.y + UA.note.h / 2})">
        <text x="${UA.note.x + UA.note.w / 2}" y="${UA.note.y + 24}" text-anchor="middle" font-size="11.5" letter-spacing="1" fill="#8fa3b8" font-family="Consolas, monospace">— GS-1 "GUS" —</text>
        ${[38, 52, 66].map((dy, i) => `<line x1="${UA.note.x + 16}" y1="${UA.note.y + dy}" x2="${UA.note.x + UA.note.w - 20 - i * 20}" y2="${UA.note.y + dy}" stroke="#39485a" stroke-width="3"/>`).join('')}
      </g>` })}

    <!-- capacitor socket: a junction box standing on the grating -->
    <g data-mount="floor">
      ${shadow(UA.socket.x + 60, UA.socket.y + 112, 70, 9)}
      <rect x="${UA.socket.x}" y="${UA.socket.y}" width="120" height="110" rx="10" fill="#141c26" stroke="${cap ? '#7bc47f' : '#ffb45e'}" stroke-width="4" class="${cap ? '' : 'beckon'}"/>
      ${cap
        ? `<rect x="${UA.socket.x + 36}" y="${UA.socket.y + 22}" width="48" height="62" rx="8" fill="#1c2734" stroke="#ffb45e" stroke-width="3"/>
           <path d="M${UA.socket.x + 54} ${UA.socket.y + 38} L${UA.socket.x + 68} ${UA.socket.y + 56} L${UA.socket.x + 58} ${UA.socket.y + 56} L${UA.socket.x + 66} ${UA.socket.y + 72}" stroke="#ffb45e" stroke-width="3" fill="none"/>`
        : `<rect x="${UA.socket.x + 36}" y="${UA.socket.y + 22}" width="48" height="62" rx="8" fill="#04070d" stroke="#39485a" stroke-width="3" stroke-dasharray="6 5"/>`}
      <text x="${UA.socket.x + 60}" y="${UA.socket.y + 100}" text-anchor="middle" font-size="11.5" fill="#9fb0c4" font-family="Consolas, monospace">CHARGE SOCKET</text>
    </g>

    <!-- the cold-start placard, on its own post above the console -->
    ${panel({ ...UA.placard, material: 'glass', mount: 'post', floorY: UA.con.y, rx: 8, body: `
      <text x="${UA.placard.x + UA.placard.w / 2}" y="${UA.placard.y + 22}" text-anchor="middle" font-size="11" letter-spacing="2" fill="#4fd8d0" font-family="Consolas, monospace">COLD-START</text>
      ${[36, 50, 64].map((dy, i) => `<line x1="${UA.placard.x + 16}" y1="${UA.placard.y + dy}" x2="${UA.placard.x + UA.placard.w - 30 - i * 22}" y2="${UA.placard.y + dy}" stroke="#39485a" stroke-width="3"/>`).join('')}` })}

    <!-- uplink control: a console standing on the gantry -->
    ${panel({ ...UA.con, material: 'steel', mount: 'console', floorY: 860, rx: 14, body: `
      <rect x="${UA.con.x + 4}" y="${UA.con.y + 4}" width="${UA.con.w - 8}" height="${UA.con.h - 8}" rx="12" fill="none" stroke="${pass && cap && gel ? '#7bc47f' : '#2b3547'}" stroke-width="3"/>
      <text x="${UA.con.x + UA.con.w / 2}" y="${UA.con.y + 30}" text-anchor="middle" font-size="14" fill="#cfd8e3" letter-spacing="2" font-family="Consolas, monospace">UPLINK CONTROL</text>
      <text x="${UA.con.x + UA.con.w / 2}" y="${UA.con.y + 50}" text-anchor="middle" font-size="11.5" fill="#4fd8d0" font-family="Consolas, monospace">"SIX SHARDS MAKE THE WORD. THE FEWEST PEAKS SPEAK FIRST."</text>
      <g font-family="Consolas, monospace" font-size="12">
        <text x="${UA.con.x + 30}" y="${UA.con.y + 82}" fill="${gel ? '#7bc47f' : '#ff8f8f'}">${gel ? '✓' : '✗'} EMITTER ${gel ? 'MENDED' : 'CRACKED'}</text>
        <text x="${UA.con.x + 30}" y="${UA.con.y + 106}" fill="${cap ? '#7bc47f' : '#ff8f8f'}">${cap ? '✓' : '✗'} CHARGE ${cap ? 'SEATED' : 'EMPTY'}</text>
        <text x="${UA.con.x + 30}" y="${UA.con.y + 130}" fill="${pass ? '#7bc47f' : '#ff8f8f'}">${pass ? '✓' : '✗'} PASSPHRASE ${pass ? 'ACCEPTED' : 'REQUIRED'}</text>
        <text x="${UA.con.x + 30}" y="${UA.con.y + 154}" fill="${aligned ? '#7bc47f' : '#ff8f8f'}">${aligned ? '✓' : '✗'} DISH ${aligned ? 'LOCKED: AZ 117 · EL 43' : `AZ ${az} · EL ${el}`}</text>
      </g>
      ${prepped
        ? `<rect x="${UA.con.x + 90}" y="${UA.con.y + 168}" width="260" height="34" rx="9" fill="rgba(79,216,208,0.18)" stroke="#4fd8d0" stroke-width="2.5" class="beckon"/>
           <text x="${UA.con.x + 220}" y="${UA.con.y + 191}" text-anchor="middle" font-size="15" fill="#8ff0ea" font-family="Consolas, monospace">${launched ? '▶ TRANSMIT' : '▶ BEGIN COLD-START'}</text>`
        : ''}` })}

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
    id: 'emitter', x: UA.emit.x - 90, y: UA.emit.y - 90, w: 180, h: 180, label: gel ? 'The emitter (mended)' : 'The emitter — cracked',
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
    id: 'socket', x: UA.socket.x - 10, y: UA.socket.y - 10, w: 140, h: 130, label: cap ? 'Charge socket (seated)' : 'Charge socket — empty',
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
    id: 'console', x: UA.con.x - 6, y: UA.con.y - 6, w: UA.con.w + 12, h: UA.con.h + 12, label: 'Uplink control',
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
    id: 'placard', ...UA.placard, label: 'Cold-start placard',
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
    id: 'gimbal', ...UA.gimbal, label: 'Dish-gimbal caution',
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
    id: 'commsnote', ...UA.note, label: "Gus's comms note",
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
    id: 'rv7', x: UA.rv7.x - 75, y: UA.rv7.y - 60, w: 150, h: 110, label: 'RV-7, holding',
    onInteract(game) {
      game.say('The rescue ship holds its patient distance beyond the debris field. "WE ARE LISTENING," its beacon repeats. They knew, you realize. They have known what kind of rescue this would be since before they set out.');
    },
  });

  spots.push({
    id: 'burn', x: 1490, y: 590, w: 110, h: 116, label: 'The burn below',
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
        <div class="puzzle-hero" style="background-image:url(art/pz-uplink.webp)"></div>
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
          <div class="puzzle-hero" style="background-image:url(art/pz-uplink.webp)"></div>
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
        <div class="puzzle-hero" style="background-image:url(art/pz-uplink.webp)"></div>
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
