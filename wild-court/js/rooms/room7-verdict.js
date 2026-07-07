// TRIAL 7 — The Verdict Roots. Finale: TWIST + META RITE.
// Phase 1: first click on the Speaking Stone or the root-doors plays the reveal —
//   the summons, Gus's stake (the collar), the price (the valley lives only while
//   it stays off the map), the foreshadow review, the early-knowledge branch.
// Phase 2: four-step rite enforced in order on the Speaking Stone:
//   1. THE LIE  — hollow pod placed (consumed)            -> verdict_podPlaced
//   2. THE WORD — text entry, trim+lowercase === 'canopy'  -> verdict_wordSpoken
//   3. THE MAP  — survey map spread (consumed)             -> verdict_mapPlaced
//        then oath-seal paste applied (consumed)           -> verdict_mapSealed
//   4. THE WAY  — root-doors part; walking through -> completeRoom -> victory.
// Registers NO items. Consumes hollow_pod, survey_map, oath_seal_paste;
// vance_compass stays in the satchel as the narrated straightedge.

const SIL = '#060b06';                       // silhouette ink for the watching Court
const frac = (x) => x - Math.floor(x);

// ten thousand fireflies, deterministically seated
const FLIES = Array.from({ length: 84 }, (_, i) => {
  const rx = frac(Math.sin((i + 1) * 12.9898) * 43758.5453);
  const ry = frac(Math.sin((i + 1) * 78.233) * 24634.6345);
  const rr = frac(Math.sin((i + 1) * 39.425) * 11369.83);
  const band = i % 3;
  return {
    x: Math.round(30 + rx * 1540),
    y: band === 0 ? Math.round(28 + ry * 250)      // high in the canopy gaps
      : band === 1 ? Math.round(290 + ry * 250)    // banked along the tiers
      : Math.round(555 + ry * 250),                // drifting low over the fog
    r: +(0.8 + rr * 1.6).toFixed(1),
    o: +(0.15 + rr * 0.5).toFixed(2),
  };
});

// the corridor's fireflies, once THE WAY stands open
const WAY_FLIES = Array.from({ length: 14 }, (_, i) => {
  const t = i / 13;
  const rx = frac(Math.sin((i + 7) * 91.7) * 4375.85);
  return {
    x: Math.round(1255 + (rx - 0.5) * 2 * (140 * (1 - t * 0.62))),
    y: Math.round(640 - t * 370),
    r: +(0.8 + frac(Math.sin((i + 3) * 7.31) * 999.13) * 1.5).toFixed(1),
    o: +(0.35 + t * 0.4).toFixed(2),
  };
});

const WORD_RULE = '&ldquo;The Court speaks as the totem eats &mdash; sky first, then all it '
  + 'feeds. The advocate speaks last. Speak the word that shelters every clan.&rdquo;';

function carved(title, text) {
  return `<div class="leaf-tablet carved"><div class="leaf-title">${title}</div>${text}</div>`;
}

function riteStep(flags) {
  if (!flags.verdict_revealed) return 'reveal';
  if (!flags.verdict_podPlaced) return 'lie';
  if (!flags.verdict_wordSpoken) return 'word';
  return 'seal';
}

const HINTS = {
  reveal: [
    { text: 'The doors are not locked. They are waiting. Let the Stone speak first.', cost: 60 },
    { text: 'Everything strange you journaled — the compass, the bird with your voice, 1911 — was one fact wearing many masks.', cost: 120 },
    { text: 'You were summoned. The trials were testimony. Touch the Speaking Stone and hear the verdict.', cost: 240 },
  ],
  lie: [
    { text: 'The Stone asks first for proof you can tell truth from seeming.', cost: 60 },
    { text: 'You carry the only lie ever weighed and found out.', cost: 120 },
    { text: 'The hollow pod, on the Stone.', cost: 240 },
  ],
  word: [
    { text: 'The word is already in your journal — the tokens have been spelling it all along. The Stone tells you their order.', cost: 60 },
    { text: 'As the totem eats: sky, shadow-cat, coil, singer, dancer. And the advocate insists on the last word.', cost: 120 },
    { text: 'C-A-N-O-P-Y. Canopy.', cost: 240 },
  ],
  seal: [
    { text: 'What remains: the map, and the seal to swear it by.', cost: 60 },
    { text: 'Spread your survey on the Stone. Wax and ochre knead into a seal — and a dead man\'s compass makes a fine straightedge.', cost: 120 },
    { text: 'Map on the Stone; combine beeswax and ochre if you haven\'t; paste on the map; then walk out.', cost: 240 },
  ],
};

let walkingOut = false;   // session-local guard: completeRoom fires exactly once

export default {
  id: 'verdict',
  title: 'The Verdict Roots',
  intro: 'The last passage does not open into another chamber — it opens into a courtroom: a root amphitheater beneath the open night canopy, tiers banked with ten thousand fireflies sitting still as a sworn jury, six pairs of eyes catching the green moonlight from bough and coil and leaf, vast root-doors sealed at the far end, and at the center, waiting with the patience of something that has waited since 1911, a single carved stone.',

  scene(state) {
    const f = state.flags;
    const revealed = !!f.verdict_revealed;
    const pod = !!f.verdict_podPlaced;
    const word = !!f.verdict_wordSpoken;
    const mapPlaced = !!f.verdict_mapPlaced;
    const sealed = !!f.verdict_mapSealed;
    const eyeO = word ? 1 : 0.75;
    const flyBoost = word ? 0.25 : 0;

    const eye = (x, y, r = 2.8) =>
      `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffe08a" opacity="${eyeO}" class="glow fast"/>`;

    const glyph = (x, on, inner, halfColor = null) => {
      const stroke = on ? '#ffe08a' : (halfColor || '#55654f');
      return `<g stroke="${stroke}" fill="none" stroke-width="2.4" stroke-linecap="round"
        opacity="${on ? 0.95 : halfColor ? 0.8 : 0.5}" ${on ? 'class="glow"' : ''}>${inner}</g>`;
    };

    // the vast root-doors: sealed weave, or parted onto the green corridor
    const doorLeavesSealed = () => {
      const strand = (x) => {
        const yTop = 182 + (Math.abs(x - 1255) / 170) * 118;
        return `<path d="M${x} 662 Q${x - 12} ${Math.round((662 + yTop) / 2)} ${x} ${yTop}"
            stroke="#4a3626" stroke-width="16" fill="none" stroke-linecap="round"/>
          <path d="M${x} 662 Q${x - 12} ${Math.round((662 + yTop) / 2)} ${x} ${yTop}"
            stroke="#2c1e12" stroke-width="5" fill="none"/>
          <circle cx="${x - 4}" cy="${Math.round(yTop + (662 - yTop) * 0.38)}" r="6" fill="#3a2a1c"/>`;
      };
      return `
        <path d="M1086 662 L1086 300 Q1086 192 1255 172 Q1424 192 1424 300 L1424 662 Z" fill="url(#gd_verdict_door)"/>
        ${[1108, 1136, 1164, 1192, 1220].map(strand).join('')}
        ${[1290, 1318, 1346, 1374, 1402].map(strand).join('')}
        ${[560, 430, 310].map(y => `
          <path d="M1092 ${y} Q1172 ${y - 16} 1250 ${y}" stroke="#3a2a1c" stroke-width="12" fill="none" stroke-linecap="round"/>
          <path d="M1260 ${y} Q1338 ${y - 16} 1418 ${y}" stroke="#3a2a1c" stroke-width="12" fill="none" stroke-linecap="round"/>`).join('')}
        <line x1="1255" y1="182" x2="1255" y2="662" stroke="#0a0604" stroke-width="8"/>
        <circle cx="1255" cy="430" r="34" fill="#2c1e12" stroke="#4a3626" stroke-width="5"/>
        <path d="M1255 430 m-18 0 a18 18 0 1 1 12 17" fill="none" stroke="#4a3626" stroke-width="4"/>
        ${revealed ? `<line x1="1255" y1="190" x2="1255" y2="655" stroke="#ffe08a" stroke-width="3" opacity="0.3" class="glow"/>` : ''}`;
    };

    const doorWayOpen = () => `
      <path d="M1086 662 L1086 300 Q1086 192 1255 172 Q1424 192 1424 300 L1424 662 Z" fill="url(#gd_verdict_way)"/>
      ${[0.78, 0.58, 0.4].map(s => `
        <path d="M${Math.round(1255 - 169 * s)} 662 L${Math.round(1255 - 169 * s)} ${Math.round(660 - 340 * s)}
          Q1255 ${Math.round(660 - 470 * s)} ${Math.round(1255 + 169 * s)} ${Math.round(660 - 340 * s)}
          L${Math.round(1255 + 169 * s)} 662" fill="none" stroke="rgba(10,20,12,0.5)" stroke-width="${(12 * s + 4).toFixed(1)}"/>`).join('')}
      <path d="M1150 662 L1218 460 L1292 460 L1360 662 Z" fill="rgba(234,255,220,0.22)"/>
      ${WAY_FLIES.map(m => `<circle cx="${m.x}" cy="${m.y}" r="${m.r}" fill="#ffe08a" opacity="${m.o}"/>`).join('')}
      <g>
        ${[1096, 1112, 1128].map((x, i) => `<path d="M${x} 662 Q${x - 22} 420 ${x - 8} ${240 + i * 22}" stroke="#4a3626" stroke-width="${14 - i * 3}" fill="none" stroke-linecap="round"/>`).join('')}
        ${[1414, 1398, 1382].map((x, i) => `<path d="M${x} 662 Q${x + 22} 420 ${x + 8} ${240 + i * 22}" stroke="#4a3626" stroke-width="${14 - i * 3}" fill="none" stroke-linecap="round"/>`).join('')}
      </g>
      <polygon points="1120,662 1390,662 1530,880 1000,880" fill="rgba(159,212,168,0.10)" class="shimmer"/>`;

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <style>
        @keyframes verdict_drift1 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(14px,-18px); } }
        @keyframes verdict_drift2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-16px,-10px); } }
        @keyframes verdict_pulse  { 0%,100% { opacity: 0.55; } 50% { opacity: 1; } }
        .verdict-fly1  { animation: verdict_drift1 11s ease-in-out infinite; }
        .verdict-fly2  { animation: verdict_drift2 14s ease-in-out infinite; }
        .verdict-carve { animation: verdict_pulse 3.4s ease-in-out infinite; }
      </style>
      <defs>
        <linearGradient id="gd_verdict_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#050a06"/>
          <stop offset="0.55" stop-color="#0e1c12"/>
          <stop offset="1" stop-color="#16281a"/>
        </linearGradient>
        <radialGradient id="gd_verdict_moon" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(159,212,168,0.5)"/>
          <stop offset="1" stop-color="rgba(159,212,168,0)"/>
        </radialGradient>
        <linearGradient id="gd_verdict_ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#16281a"/>
          <stop offset="1" stop-color="#070d08"/>
        </linearGradient>
        <linearGradient id="gd_verdict_stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#4a5a46"/>
          <stop offset="0.35" stop-color="#3f4a3c"/>
          <stop offset="1" stop-color="#2e3a2c"/>
        </linearGradient>
        <linearGradient id="gd_verdict_door" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#241709"/>
          <stop offset="1" stop-color="#170e06"/>
        </linearGradient>
        <radialGradient id="gd_verdict_way" cx="0.5" cy="0.62" r="0.75">
          <stop offset="0" stop-color="#eaffdc"/>
          <stop offset="0.3" stop-color="#b7e8a8"/>
          <stop offset="0.65" stop-color="#4f7a4a"/>
          <stop offset="1" stop-color="#142415"/>
        </radialGradient>
        <linearGradient id="gd_verdict_beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="rgba(159,212,168,0.16)"/>
          <stop offset="1" stop-color="rgba(159,212,168,0)"/>
        </linearGradient>
        <radialGradient id="gd_verdict_stoneglow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(255,224,138,0.22)"/>
          <stop offset="1" stop-color="rgba(255,224,138,0)"/>
        </radialGradient>
        <radialGradient id="gd_verdict_mote" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="#fff6d8"/>
          <stop offset="0.5" stop-color="#ffe08a"/>
          <stop offset="1" stop-color="rgba(255,224,138,0)"/>
        </radialGradient>
      </defs>

      <!-- night sky, moon through the canopy -->
      <rect width="1600" height="900" fill="url(#gd_verdict_sky)"/>
      <circle cx="990" cy="118" r="150" fill="url(#gd_verdict_moon)"/>
      <circle cx="990" cy="118" r="46" fill="#9fd4a8" opacity="0.28"/>

      <!-- canopy masses and flanking trunks -->
      <path d="M0 0 L1600 0 L1600 118 Q1500 88 1440 128 Q1380 78 1300 116 Q1240 68 1150 106
        Q1080 58 1000 94 Q930 128 860 90 Q800 58 720 98 Q650 128 580 86 Q520 58 440 102
        Q370 128 300 90 Q230 60 150 106 Q80 128 0 94 Z" fill="#070d08"/>
      <path d="M0 0 L1600 0 L1600 74 Q1420 40 1240 66 Q1040 30 860 60 Q660 28 460 62 Q240 34 0 60 Z" fill="#0b140c" opacity="0.85"/>
      <path d="M28 0 Q60 200 40 480 L112 480 Q86 220 118 0 Z" fill="#101a10"/>
      <path d="M1556 0 Q1582 240 1566 520 L1600 520 L1600 0 Z" fill="#0c150c"/>
      <g class="sway slow">
        <path d="M520 0 Q514 74 524 148" stroke="#223a26" stroke-width="4" fill="none"/>
        <ellipse cx="521" cy="86" rx="5" ry="13" fill="#16281a"/>
        <ellipse cx="526" cy="132" rx="5" ry="13" fill="#16281a"/>
      </g>
      <g class="sway slow">
        <path d="M132 0 Q140 90 128 190" stroke="#223a26" stroke-width="4" fill="none"/>
        <ellipse cx="136" cy="104" rx="6" ry="15" fill="#16281a"/>
        <ellipse cx="129" cy="168" rx="6" ry="15" fill="#16281a"/>
      </g>

      <!-- the root amphitheater: three sweeping tiers -->
      <path d="M0 470 Q800 350 1600 470 L1600 532 Q800 412 0 532 Z" fill="#0d1810"/>
      <path d="M0 546 Q800 436 1600 546 L1600 616 Q800 506 0 616 Z" fill="#122015"/>
      <path d="M0 626 Q800 522 1600 626 L1600 706 Q800 602 0 706 Z" fill="#16281a"/>
      <path d="M0 470 Q800 350 1600 470" stroke="#4a3626" stroke-width="3" opacity="0.3" fill="none"/>
      <path d="M0 546 Q800 436 1600 546" stroke="#4a3626" stroke-width="3" opacity="0.3" fill="none"/>
      <path d="M0 626 Q800 522 1600 626" stroke="#4a3626" stroke-width="3" opacity="0.3" fill="none"/>

      <!-- ground -->
      <rect y="680" width="1600" height="220" fill="url(#gd_verdict_ground)"/>
      <ellipse cx="420" cy="770" rx="180" ry="26" fill="#223a26" opacity="0.35"/>
      <ellipse cx="1240" cy="800" rx="220" ry="30" fill="#223a26" opacity="0.3"/>

      <!-- THE ROOT-DOORS -->
      <g>
        ${sealed ? doorWayOpen() : doorLeavesSealed()}
        <path d="M1070 672 L1070 300 Q1070 172 1255 150 Q1440 172 1440 300 L1440 672"
          fill="none" stroke="#3a2a1c" stroke-width="34" stroke-linecap="round"/>
        <path d="M1070 672 L1070 300 Q1070 172 1255 150 Q1440 172 1440 300 L1440 672"
          fill="none" stroke="#4a3626" stroke-width="20"/>
        <circle cx="1082" cy="380" r="7" fill="#223a26" opacity="0.8"/>
        <circle cx="1432" cy="330" r="7" fill="#223a26" opacity="0.8"/>
        <circle cx="1160" cy="176" r="6" fill="#223a26" opacity="0.8"/>
      </g>

      <!-- THE COURT, ASSEMBLED: six watchers, eye-glints lit -->
      <!-- macaw, perched high left -->
      <path d="M296 212 Q360 198 428 202" stroke="#3a2a1c" stroke-width="9" fill="none" stroke-linecap="round"/>
      <path d="M356 206 Q344 186 352 164 Q358 148 372 146 Q384 145 388 156 Q394 150 398 156 Q395 162 388 164
        Q392 176 384 192 Q378 202 370 206 Z" fill="${SIL}"/>
      <path d="M362 204 Q356 240 348 264" stroke="${SIL}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M369 205 Q367 242 363 268" stroke="${SIL}" stroke-width="4.6" fill="none" stroke-linecap="round"/>
      ${eye(374, 157, 2.6)}
      <!-- jaguar, along the bough -->
      <path d="M140 352 Q400 306 640 336" stroke="#3a2a1c" stroke-width="26" fill="none" stroke-linecap="round"/>
      <path d="M140 348 Q400 302 640 332" stroke="#4a3626" stroke-width="9" fill="none" opacity="0.6"/>
      <path d="M310 322 Q314 296 352 290 Q372 286 396 290 Q416 272 434 276 L438 264 L448 262 L452 272
        L462 270 L468 278 Q486 282 490 298 Q492 312 476 316 Q450 322 424 318 Q380 326 340 324 Q316 326 310 322 Z" fill="${SIL}"/>
      <path d="M312 320 Q286 366 300 408 Q306 426 322 420" stroke="${SIL}" stroke-width="9" fill="none" stroke-linecap="round"/>
      ${eye(455, 288, 3)} ${eye(468, 290, 3)}
      <!-- tapir, on the low tier -->
      <path d="M300 654 Q298 622 330 612 Q360 604 396 610 Q424 614 434 630 Q446 634 452 644 Q456 652 448 656
        L442 664 Q436 668 432 662 Q420 668 396 668 L390 676 L382 676 L380 668 L336 668 L332 676 L324 676
        L322 666 Q304 664 300 654 Z" fill="${SIL}"/>
      <path d="M334 612 L330 600 L342 606 Z" fill="${SIL}"/>
      <path d="M356 608 L354 596 L366 602 Z" fill="${SIL}"/>
      ${eye(418, 632, 2.6)}
      <!-- harpy, crowning the doors -->
      <path d="M1230 150 Q1226 112 1240 92 Q1250 80 1258 78 L1254 66 L1260 58 L1264 70 L1270 58 L1276 67
        L1271 79 Q1284 84 1290 96 Q1300 114 1294 150 Z" fill="${SIL}"/>
      <path d="M1240 92 Q1230 94 1235 101 Q1241 99 1242 94 Z" fill="${SIL}"/>
      <path d="M1228 110 Q1214 132 1222 152 L1234 150 Q1226 130 1234 112 Z" fill="${SIL}"/>
      <path d="M1296 110 Q1310 132 1302 152 L1290 150 Q1298 130 1290 112 Z" fill="${SIL}"/>
      <path d="M1244 150 l-4 8 M1252 150 l0 9 M1276 150 l4 8" stroke="${SIL}" stroke-width="3" stroke-linecap="round"/>
      ${eye(1252, 88, 2.6)} ${eye(1268, 88, 2.6)}
      <!-- boa, coiled on the root -->
      <path d="M1544 690 Q1528 520 1538 346" stroke="#3a2a1c" stroke-width="24" fill="none" stroke-linecap="round"/>
      <ellipse cx="1536" cy="566" rx="44" ry="15" fill="${SIL}"/>
      <ellipse cx="1534" cy="538" rx="40" ry="14" fill="${SIL}"/>
      <ellipse cx="1536" cy="511" rx="35" ry="13" fill="${SIL}"/>
      <ellipse cx="1533" cy="487" rx="29" ry="12" fill="${SIL}"/>
      <path d="M1522 482 Q1498 462 1506 438 Q1510 428 1520 428" stroke="${SIL}" stroke-width="11" fill="none" stroke-linecap="round"/>
      <ellipse cx="1524" cy="427" rx="13" ry="8" fill="${SIL}"/>
      ${eye(1519, 424, 1.8)} ${eye(1529, 424, 1.8)}
      <!-- mantis, front row on its leaf -->
      <ellipse cx="1008" cy="668" rx="58" ry="18" fill="#274a2c" transform="rotate(-8 1008 668)"/>
      <path d="M956 676 Q1008 656 1060 662" stroke="#1b331f" stroke-width="2" fill="none"/>
      <path d="M986 656 Q998 648 1012 650" stroke="${SIL}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M1012 650 L1020 638" stroke="${SIL}" stroke-width="3.4" stroke-linecap="round"/>
      <path d="M1017 636 L1027 638 L1021 628 Z" fill="${SIL}"/>
      <path d="M1018 642 Q1008 636 1010 628 M1021 643 Q1014 634 1018 626" stroke="${SIL}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M1006 651 L1002 660 M1014 651 L1013 660" stroke="${SIL}" stroke-width="2" stroke-linecap="round"/>
      ${eye(1019, 633, 1.5)} ${eye(1024, 634, 1.5)}

      <!-- the dais and THE SPEAKING STONE -->
      <ellipse cx="830" cy="690" rx="270" ry="50" fill="#2e3a2c" stroke="#202b1e" stroke-width="4"/>
      <ellipse cx="830" cy="684" rx="224" ry="38" fill="#38473a" opacity="0.7"/>
      ${revealed ? `<ellipse cx="835" cy="560" rx="200" ry="130" fill="url(#gd_verdict_stoneglow)" class="glow"/>` : ''}
      <ellipse cx="836" cy="512" rx="112" ry="26" fill="#4d5f49"/>
      <path d="M724 512 L730 640 Q836 668 942 640 L948 512 Q836 540 724 512 Z" fill="url(#gd_verdict_stone)" stroke="#25301f" stroke-width="3"/>
      ${[560, 585, 610].map(y => `
        <path d="M752 ${y} q11 -6 22 0 t22 0 t22 0 t22 0 t22 0 t22 0 t22 0"
          fill="none" stroke-width="2.6" stroke-linecap="round"
          ${revealed ? `stroke="#ffe08a" class="verdict-carve"` : `stroke="#4d5c48" opacity="0.5"`}/>`).join('')}
      ${pod ? `<g>
        <ellipse cx="782" cy="505" rx="15" ry="10" fill="#d1a53f" stroke="#9a6f24" stroke-width="2"/>
        <path d="M772 501 Q782 496 792 501" stroke="#ffe9b0" stroke-width="1.6" fill="none"/>
        <ellipse cx="782" cy="505" rx="22" ry="15" fill="url(#gd_verdict_mote)" opacity="0.35"/>
      </g>` : ''}
      ${mapPlaced ? `<g transform="rotate(-3 865 507)">
        <rect x="800" y="486" width="150" height="42" rx="3" fill="#e4f0d0" stroke="#b9c79b" stroke-width="2"/>
        <path d="M810 512 Q840 496 872 508 T932 504" stroke="#6b4f37" stroke-width="1.6" fill="none"/>
        <path d="M814 520 Q850 506 886 516 T942 512" stroke="#6b4f37" stroke-width="1.4" fill="none" opacity="0.8"/>
        <circle cx="876" cy="502" r="3" fill="#5aa552"/>
        ${sealed ? `
          <path d="M812 496 q10 6 20 2 q10 -4 20 2 q10 6 20 2 q10 -4 20 2 q10 6 20 2" stroke="#46655a" stroke-width="1.8" fill="none"/>
          <path d="M818 526 q12 -6 24 -2 q12 4 24 -2 q12 -6 24 -2 q12 4 24 -2" stroke="#46655a" stroke-width="1.8" fill="none"/>
          <path d="M826 502 l6 6 m0 -6 l-6 6 M902 514 l6 6 m0 -6 l-6 6" stroke="#4f5c48" stroke-width="1.4"/>
          <circle cx="932" cy="520" r="9" fill="#a3541f" stroke="#7d3a12" stroke-width="2"/>
          <circle cx="932" cy="520" r="4" fill="none" stroke="#e2b06a" stroke-width="1.2" opacity="0.85"/>
          <circle cx="932" cy="520" r="15" fill="url(#gd_verdict_mote)" opacity="0.3"/>` : ''}
      </g>` : ''}
      <!-- the rite, carved on the dais: pod / word / map / way -->
      ${glyph(740, pod, `<ellipse cx="740" cy="710" rx="9" ry="6.5"/><path d="M736 710 L744 710"/>`)}
      ${glyph(795, word, `<circle cx="795" cy="712" r="3"/><path d="M800 706 q5 6 0 12 M804 703 q7 9 0 18"/>`)}
      ${glyph(860, sealed, `<rect x="852" y="704" width="16" height="12" rx="1"/><path d="M852 710 Q860 706 868 710"/>`,
        mapPlaced ? '#d1a53f' : null)}
      ${glyph(915, sealed, `<path d="M908 718 L908 708 Q915 700 922 708 L922 718"/>`)}

      <!-- ground fog -->
      <ellipse cx="420" cy="796" rx="430" ry="58" fill="rgba(159,212,168,0.05)" class="fog"/>
      <ellipse cx="1160" cy="826" rx="480" ry="62" fill="rgba(159,212,168,0.07)" class="fog reverse"/>
      <ellipse cx="820" cy="748" rx="330" ry="42" fill="rgba(159,212,168,0.04)" class="fog"/>

      <!-- foreground fronds -->
      <g class="sway slow">
        <path d="M-10 900 Q40 780 20 690 Q60 770 60 830 Q90 750 80 700 Q110 780 100 850 Q130 800 140 760 L150 900 Z" fill="#08110a"/>
      </g>
      <g class="sway slow">
        <path d="M1610 900 Q1560 790 1580 700 Q1540 780 1540 840 Q1510 760 1520 710 Q1490 790 1500 856 Q1470 810 1460 770 L1450 900 Z" fill="#08110a"/>
      </g>

      <!-- ten thousand jurors: the firefly banks -->
      <g class="verdict-fly1">
        ${FLIES.filter((_, i) => i % 2 === 0).map(m =>
          `<circle cx="${m.x}" cy="${m.y}" r="${m.r}" fill="#ffe08a" opacity="${Math.min(0.95, m.o + flyBoost)}"/>`).join('')}
      </g>
      <g class="verdict-fly2">
        ${FLIES.filter((_, i) => i % 2 === 1).map(m =>
          `<circle cx="${m.x}" cy="${m.y}" r="${m.r}" fill="#ffe08a" opacity="${Math.min(0.95, m.o + flyBoost)}"/>`).join('')}
      </g>
      <circle cx="520" cy="340" r="5" fill="url(#gd_verdict_mote)" class="glow fast"/>
      <circle cx="905" cy="248" r="5" fill="url(#gd_verdict_mote)" class="glow fast"/>
      <circle cx="1180" cy="726" r="4.4" fill="url(#gd_verdict_mote)" class="glow fast"/>

      <!-- canopy light-shafts, last -->
      <polygon points="690,-10 850,-10 1010,640 750,640" fill="url(#gd_verdict_beam)" class="moonbeam"/>
      <polygon points="1210,-10 1290,-10 1420,540 1300,540" fill="url(#gd_verdict_beam)" class="moonbeam" opacity="0.6"/>

      <path d="M0 900 L0 864 Q800 906 1600 864 L1600 900 Z" fill="#04070d"/>
    </svg>`;
  },

  hotspots(state) {
    const f = state.flags;
    const spots = [];

    spots.push({
      id: 'stone', x: 690, y: 430, w: 300, h: 240,
      label: f.verdict_revealed ? 'The Speaking Stone' : 'The carved stone',
      onInteract(game) { stoneInteract(game); },
    });

    spots.push({
      id: 'doors', x: 1070, y: 210, w: 360, h: 440,
      label: f.verdict_mapSealed ? 'THE WAY — the green corridor' : 'The root-doors',
      onInteract(game) { doorsInteract(game); },
    });

    if (f.verdict_revealed) {
      spots.push({
        id: 'rite_carvings', x: 700, y: 676, w: 280, h: 78, label: 'The rite, carved',
        onInteract(game) {
          game.dialog({
            title: 'The Rite of Verdict',
            html: carved('Carved into the dais',
              '&ldquo;FIRST, THE LIE &mdash; SHOW THE COURT YOU KNOW TRUTH FROM SEEMING.<br>'
              + 'SECOND, THE WORD &mdash; SPEAK WHAT SHELTERS EVERY CLAN.<br>'
              + 'THIRD, THE MAP &mdash; LAY IT DOWN AND SWEAR IT FALSE, UNDER SEAL.<br>'
              + 'LAST, THE WAY.&rdquo;')
              + '<p style="margin-top:10px; color:var(--text-dim); font-style:italic;">Four glyphs '
              + 'beneath the words — a pod, a mouth mid-word, a folded map, an open arch — each waiting '
              + 'to be lit. The mantis, an arm\'s length away on its leaf, has the best seat in the '
              + 'chamber and clearly knows it.</p>',
          });
        },
      });
    }

    spots.push({
      id: 'harpy_crown', x: 1150, y: 50, w: 210, h: 130, label: 'The harpy, highest',
      onInteract(game) {
        game.journal.add('verdict_gallery', {
          title: 'The Court in session (Verdict Roots)', category: 'note',
          html: `<div class="leaf-tablet"><div class="leaf-title">Field note — the gallery</div>
            The harpy has taken the crown of the doors — the highest seat in the chamber, and no one
            disputes it. <em>Of course:</em> the Court reads from the sky downward. And somewhere below
            everything else sits an advocate who insists on having the last word.</div>`,
        });
        game.say('The harpy watches from the crown of the doors, higher than everything but the canopy itself. The Court reads from the sky downward — you remember the dais at the totem saying so, and the harpy clearly agrees with the seating chart.');
      },
    });

    spots.push({
      id: 'gallery_left', x: 250, y: 150, w: 330, h: 400, label: 'The watching Court',
      onInteract(game) {
        game.say('The jaguar lies along the bough, tail swinging the slow metronome of someone with all night. On the branch above, the macaw — the fledgling from the pool, you\'d swear, grown a foot taller in confidence. Below them the tapir stands in the fog like patient furniture. Nobody blinks. Courts don\'t.');
      },
    });

    spots.push({
      id: 'boa_coil', x: 1455, y: 365, w: 135, h: 240, label: 'The boa, coiled',
      onInteract(game) {
        game.say('The boa is wound around a root thicker than you are, chin resting on its own topmost coil, and it regards you with the unhurried attention of something that has already measured you twice. From the Court\'s perspective, that is probably just due diligence.');
      },
    });

    spots.push({
      id: 'jurors', x: 620, y: 300, w: 320, h: 110, label: 'The firefly jurors',
      onInteract(game) {
        game.say('Ten thousand fireflies bank the tiers, and they are not swarming — they are SEATED. When you shift your weight, the light shifts with you, the way a gallery turns its heads. You resist the urge to straighten your shirt. You straighten it anyway.');
      },
    });

    return spots;
  },

  hints(state) { return HINTS[riteStep(state.flags)]; },
  hintContext(state) { return riteStep(state.flags); },

  onEnter(game) {
    const f = game.state.flags;
    if (!f.verdict_revealed) {
      game.say('Gus — who has had counsel for every cobweb, every puddle, and one unflattering echo — says nothing at all. He straightens his collar. Twice.');
    } else if (!f.verdict_mapSealed) {
      game.say('The rite stands exactly where you left it. The Stone remembers; stones are extremely good at that.');
    }
  },
};

/* ============================================================
   PHASE 1 — THE REVEAL
   ============================================================ */

function playReveal(game) {
  game.setFlag('verdict_revealed');
  game.playSfx('stone');
  game.refreshScene();

  // everything the dialogs say is journaled up front — nothing here is missable
  game.journal.add('verdict_summons', {
    title: 'The Summons (Verdict Roots)', category: 'note',
    html: carved('The Speaking Stone',
      '&ldquo;THE COURT OF THE WILD CALLS THE MAKER OF MAPS. THE TRIAL IS NOT BEGINNING. '
      + 'THE TRIAL IS ENDING &mdash; TESTIMONY WAS TAKEN AT THE GATE, THE POOL, THE GROVE, '
      + 'THE TOTEM, THE WING, AND THE SCALE.&rdquo;'),
  });
  game.journal.add('verdict_price', {
    title: 'The Price of the Verdict', category: 'note',
    html: carved('The Speaking Stone', '&ldquo;THE VALLEY LIVES ONLY WHILE IT STAYS OFF THE MAP.&rdquo;')
      + '<p style="margin-top:10px;">Gus petitioned the Court to summon a mapmaker rather than answer '
      + 'the concession the old way, and staked his advocate\'s collar on a human passing testimony. '
      + 'He did not know the price. Neither did you. The price is the survey.</p>',
  });
  game.journal.add('verdict_rite', {
    title: 'The Rite of Verdict', category: 'note',
    html: carved('Carved into the dais',
      '&ldquo;FIRST, THE LIE &mdash; SHOW THE COURT YOU KNOW TRUTH FROM SEEMING.<br>'
      + 'SECOND, THE WORD &mdash; SPEAK WHAT SHELTERS EVERY CLAN.<br>'
      + 'THIRD, THE MAP &mdash; LAY IT DOWN AND SWEAR IT FALSE, UNDER SEAL.<br>'
      + 'LAST, THE WAY.&rdquo;'),
  });

  // players who examined T5's procession mosaic earned the reveal early
  const knewAlready = game.state.journal.some(e =>
    /procession|defendant/i.test(`${e.title || ''} ${e.html || ''}`));

  const d4 = () => game.dialog({
    title: 'The Record',
    html: `<p>You think of everything the journal has been quietly holding: a compass that has spun
        since the ground took you. Trail-blazes healed over as if years had passed in a night. A
        fledgling that begs in your own recorded voice. A bark map of <em>your</em> valley under moss
        older than the concession. The newest carving on the Totem of Teeth — a human figure, satchel
        and measuring chain, the cuts still pale. A procession of humans led in under carved scales.
        And a brass compass on a tithe table: <strong>T. VANCE — 1911</strong>. Survey never filed.
        Surveyor never either.</p>
      <p style="margin-top:10px;"><em>${knewAlready
        ? '"You knew. Good. Then let us finish it properly."'
        : '"It has all been in the record since the gate, Marlowe. Consult it whenever you like — the Court is nothing if not fair. Infuriatingly, relentlessly fair."'}</em>
        &mdash; Gus, quietly, from the top of the Stone.</p>`,
    buttons: [{
      label: 'Hear the rite', class: 'btn-primary',
      onClick: () => game.dialog({
        title: 'The Rite of Verdict',
        html: carved('The dais carvings, filling with light',
          '&ldquo;FIRST, THE LIE &mdash; SHOW THE COURT YOU KNOW TRUTH FROM SEEMING.<br>'
          + 'SECOND, THE WORD &mdash; SPEAK WHAT SHELTERS EVERY CLAN.<br>'
          + 'THIRD, THE MAP &mdash; LAY IT DOWN AND SWEAR IT FALSE, UNDER SEAL.<br>'
          + 'LAST, THE WAY.&rdquo;'),
        buttons: [{
          label: 'Approach the Stone', class: 'btn-primary',
          onClick: () => {
            game.refreshScene();
            game.say('Gus hops down and takes up position at your side, small and straight-backed, counsel at the bar. "On your feet, then. Four steps between my client and the open air — and I will be objecting LOUDLY if the Court rushes any of them."');
          },
        }],
      }),
    }],
  });

  const d3 = () => game.dialog({
    title: 'The Price',
    html: carved('The Speaking Stone', '&ldquo;THE VALLEY LIVES ONLY WHILE IT STAYS OFF THE MAP.&rdquo;')
      + `<p style="margin-top:10px;">Gus goes very still on top of the Stone. The mane, for once,
        does not fluff.</p>
      <p><em>"...That part,"</em> he says quietly, <em>"I did not know. The Court does not tell the
        advocate the sentence. Only the docket. Your survey, Marlowe — the price of the verdict is the
        thing you came here to make. It lands on both of us at once, and I am sorry, and I would
        petition again tomorrow."</em></p>`,
    buttons: [{ label: 'The trials — all of it was testimony?', class: 'btn-primary', onClick: d4 }],
  });

  const d2 = () => game.dialog({
    title: 'Counsel\'s Confession',
    html: `<p>Gus climbs the Speaking Stone — deliberately, formally, an advocate approaching the
        bench — and turns to face you with his little collar squared.</p>
      <p><em>"Advocate for the accused. I told you in my first breath, and I have never once been
        speaking in metaphor. In 1911 the concession sent a surveyor, and the valley answered the old
        way. Ask Vance how the old way went — oh, you cannot. That is how the old way went."</em></p>
      <p><em>"So when your company's chains came back, I petitioned the Court: summon a mapmaker
        instead. Let a human stand testimony. The Court asked what I would stake on a human. I staked
        the collar."</em> He touches it, once. <em>"The collar, Marlowe. Do you finally grasp the
        gravity."</em></p>`,
    buttons: [{ label: 'And the price?', class: 'btn-primary', onClick: d3 }],
  });

  game.playSfx('bell');
  game.dialog({
    title: 'The Speaking Stone',
    html: `<p>The carvings fill with firefly light as you watch — letter by letter, line by line,
        like something reading itself awake.</p>`
      + carved('The Speaking Stone',
        '&ldquo;THE COURT OF THE WILD CALLS THE MAKER OF MAPS. THE TRIAL IS NOT BEGINNING. '
        + 'THE TRIAL IS ENDING &mdash; TESTIMONY WAS TAKEN AT THE GATE, THE POOL, THE GROVE, '
        + 'THE TOTEM, THE WING, AND THE SCALE.&rdquo;'),
    buttons: [{ label: 'Testimony—?', class: 'btn-primary', onClick: d2 }],
  });
}

/* ============================================================
   PHASE 2 — THE RITE, IN ORDER, ON THE STONE
   ============================================================ */

function stoneInteract(game) {
  const f = game.state.flags;

  if (!f.verdict_revealed) { playReveal(game); return; }

  // STEP 1 — THE LIE
  if (!f.verdict_podPlaced) {
    if (game.selectedItem === 'hollow_pod') {
      game.useSelected();
      game.setFlag('verdict_podPlaced');
      game.playSfx('stone');
      game.refreshScene();
      game.say('You set the hollow pod on the Speaking Stone — gold over air, the lie kept as evidence — and the carvings brighten around it like a court leaning forward. FIRST, THE LIE: entered into the record.');
    } else if (game.selectedItem) {
      game.say('The Stone does not warm to it. FIRST, THE LIE — the Court wants proof you can tell truth from seeming, and you are holding the wrong exhibit.');
    } else {
      game.dialog({
        title: 'First: The Lie',
        html: carved('The Speaking Stone',
          '&ldquo;FIRST, THE LIE. SHOW THE COURT YOU KNOW TRUTH FROM SEEMING.&rdquo;')
          + '<p style="margin-top:10px; color:var(--text-dim); font-style:italic;">A shallow socket '
          + 'the size of a cacao pod has opened in the stone\'s top. You have carried exactly one '
          + 'proven falsehood out of the Tithe Hall.</p>',
      });
    }
    return;
  }

  // STEP 2 — THE WORD
  if (!f.verdict_wordSpoken) {
    if (game.selectedItem) {
      game.say('Not yet — SECOND IS THE WORD. The Stone waits to hear, not to hold. Empty your hands and speak.');
      return;
    }
    openWordPuzzle(game);
    return;
  }

  // STEP 3a — THE MAP
  if (!f.verdict_mapPlaced) {
    if (game.selectedItem === 'survey_map') {
      game.useSelected();
      game.setFlag('verdict_mapPlaced');
      game.playSfx('page');
      game.refreshScene();
      game.say('You unroll the quadrant-nine survey across the Speaking Stone — three days of your best work, the river bend, the stone scar, the big kapok marked — and the whole Court exhales at the sight of itself, drawn. Gus does not look away. Neither do you.');
    } else if (game.selectedItem === 'oath_seal_paste') {
      game.say('The seal is patient; oaths need something to swear on. THIRD, THE MAP — lay the survey down first.');
    } else if (game.selectedItem) {
      game.say('The Stone shifts its light, unimpressed. THIRD, THE MAP — it asks for the thing you came into this valley to make.');
    } else {
      game.dialog({
        title: 'Third: The Map',
        html: carved('The Speaking Stone',
          '&ldquo;THIRD, THE MAP. LAY IT DOWN AND SWEAR IT FALSE, UNDER SEAL.&rdquo;')
          + '<p style="margin-top:10px; color:var(--text-dim); font-style:italic;">Your survey has '
          + 'ridden in your satchel since the sinkhole. It weighs nothing. It has never weighed more.</p>',
      });
    }
    return;
  }

  // STEP 3b — THE SEAL
  if (!f.verdict_mapSealed) {
    if (game.selectedItem === 'oath_seal_paste') {
      game.useSelected();
      game.setFlag('verdict_mapSealed');
      game.refreshScene();
      sealBeat(game);
    } else if (game.selectedItem === 'beeswax_lump' || game.selectedItem === 'ochre_pot') {
      game.say('The Stone\'s carving is particular: "wax and ochre, made one." Raw makings won\'t swear an oath — knead them together in your satchel first, one held over the other.');
    } else if (game.selectedItem === 'vance_compass') {
      game.say('You lay the brass edge along your contours. A fine straightedge — the finest thing Vance left. But the redraw is sworn in with the seal: wax and ochre, made one.');
    } else if (game.selectedItem) {
      game.say('Not that. The survey lies spread and waiting; what the Stone asks for now is the seal — wax and ochre, made one.');
    } else {
      game.dialog({
        title: 'Swear It False',
        html: carved('The Speaking Stone', '&ldquo;SWEAR IT FALSE. WAX AND OCHRE, MADE ONE.&rdquo;')
          + '<p style="margin-top:10px; color:var(--text-dim); font-style:italic;">The survey waits '
          + 'on the stone. False contours want a straightedge, and an oath wants a seal — beeswax and '
          + 'ochre, kneaded into one, if you have not already made it so.</p>',
      });
    }
    return;
  }

  // the record, complete
  game.say('The Stone is quiet now — the pod, the word, the sealed lie of a map. The record is complete, and the only thing left standing between you and the night air is standing open.');
}

function openWordPuzzle(game) {
  game.journal.add('verdict_wordrule', {
    title: 'The Stone\'s rule (Verdict Roots)', category: 'note',
    html: carved('Carved on the Speaking Stone', WORD_RULE),
  });

  game.openPuzzle({
    id: 'verdict_word',
    title: 'Second: The Word',
    wide: false,
    render(body, api) {
      body.innerHTML = `
        ${carved('Carved on the Speaking Stone', WORD_RULE)}
        <p class="puzzle-desc">Six court tokens ride in your journal, each a creature and a letter.
          The totem's order stands in the record: sky downward. And the advocate — the Court's own
          golden-maned exception — speaks last.</p>
        <div class="puzzle-row"><input class="puzzle-input" id="vd-word" maxlength="24"
          placeholder="the word" autocomplete="off" spellcheck="false"/></div>
        <div class="puzzle-row"><button class="btn btn-primary" id="vd-speak">Speak It</button></div>
        <div class="puzzle-feedback"></div>`;

      const input = body.querySelector('#vd-word');
      const attempt = () => {
        const v = (input.value || '').trim().toLowerCase();
        if (!v) { api.setFeedback('The Court waits. Silence is not a word.', 'bad'); return; }
        if (v === 'canopy') {
          game.setFlag('verdict_wordSpoken');
          api.solved({ message: '"CANOPY," you say — and ten thousand fireflies pulse once, all together, bright as noon for a single heartbeat. The word that shelters every clan. SECOND, THE WORD: entered into the record.' });
          game.refreshScene();
        } else {
          api.fail('The fireflies dim by one polite degree. That is not the word the tokens have been spelling.');
        }
      };
      body.querySelector('#vd-speak').addEventListener('click', attempt);
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') attempt(); });
      setTimeout(() => input.focus(), 60);
    },
  });
}

function sealBeat(game) {
  game.playSfx('pour');
  game.journal.add('verdict_sealed', {
    title: 'The survey, redrawn and sealed', category: 'note',
    html: `<div class="leaf-tablet"><div class="leaf-title">Field note — the last entry</div>
      Quadrant Nine, redrawn false against Vance's compass edge and sealed in ochre and wax:
      flood-swamp, scree, mosquito-water. Nothing worth felling. Nothing worth the freight.
      The truest lie you will ever draw.</div>`,
  });
  game.dialog({
    title: 'The Redraw',
    html: `<p>You spread your palm flat on three days of your best work — the truest map you have
        ever made — and then you take out Vance's brass compass and do the worst work of your career,
        beautifully.</p>
      <p>The dead man's edge makes a fine straightedge. You rule the false contours against it, stroke
        by stroke: the river unbent into useless meanders, the good timber slopes buried under scree,
        the great kapok drowned in a flood-swamp that has never existed and now always will. Quadrant
        Nine becomes mosquito-water and worthless stone — nothing worth felling, nothing worth the
        freight.</p>
      <p>Then the ochre-wax, kneaded warm between your palms, pressed into the corner. The seal takes
        the whorl of your thumb like a signature.</p>
      ${carved('The Speaking Stone', '&ldquo;SO SWORN. SO SEALED. THE VALLEY STAYS OFF THE MAP.&rdquo;')}
      <p style="margin-top:10px;"><em>"For the record,"</em> says Gus, somewhere near your elbow and
        suspiciously hoarse, <em>"my client falsifies survey documents magnificently. And the Court
        will note that the collar stays ON."</em></p>`,
    buttons: [{
      label: 'Face the doors', class: 'btn-primary',
      onClick: () => {
        game.playSfx('creak');
        game.say('A sound like a forest deciding — root by root, knot by knot, the vast doors unweave themselves and part onto a corridor of green light, ten thousand fireflies holding it open. LAST, THE WAY.');
      },
    }],
  });
}

/* ============================================================
   THE WAY OUT
   ============================================================ */

function doorsInteract(game) {
  const f = game.state.flags;

  if (!f.verdict_revealed) { playReveal(game); return; }

  if (!f.verdict_mapSealed) {
    const owed = !f.verdict_podPlaced ? 'the lie'
      : !f.verdict_wordSpoken ? 'the word'
      : 'the map, sworn false and sealed';
    game.say(`Gus swings up onto the door-roots and hangs there like a very small, very immovable bailiff. "Objection. The rite is incomplete — the Court has not received ${owed}. The Stone, counsel. We finish this properly or not at all."`);
    return;
  }

  if (walkingOut) return;
  walkingOut = true;
  game.say('You walk into the green corridor with your advocate riding your shoulder, ten thousand fireflies holding the way open — and the Wild Court, its verdict paid in full, lets you go.');
  game.completeRoom({ delay: 700 });
}
