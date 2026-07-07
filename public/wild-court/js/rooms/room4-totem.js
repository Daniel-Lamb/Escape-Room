// TRIAL 4 — The Totem of Teeth. Peak 1.
// Puzzle: food-web path assembly from physical evidence. Five drums; the
// door-facing column is read sky-downward, each face taking the meal directly
// beneath it, no face speaking twice. Reliefs: A harpy→ocelot, B boa→tree-frog,
// C tree-frog→mantis, D (the load-bearing NEGATIVE) ocelot→boa and explicitly
// not frog/mantis. Solution: HARPY / OCELOT / BOA / TREE-FROG / MANTIS.
// Drum III is lashed in strangler vine until the machete is used on it
// (flag totem_vinesCut). On solve (flag totem_solved): amber lens drops from
// the eye, the stone door grinds open, the order note auto-journals
// ('totem_order' — the finale's meta depends on it), and token 4
// (TAMARIN, "Y") clatters from the crown onto the dais.

import { registerItems } from '../../../shared/js/items.js';

registerItems({
  amber_lens: {
    name: 'Amber Lens',
    description: 'The totem\'s eye — a palm-sized disc of deep amber, warm as something recently alive. Held up, it gathers the whole dim hall into one small golden room.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="17" fill="#4a3626"/>
      <circle cx="24" cy="24" r="14" fill="#8a6524"/>
      <circle cx="24" cy="24" r="11" fill="#d1a53f"/>
      <circle cx="24" cy="24" r="7" fill="#ffe08a"/>
      <path d="M17 18 Q21 13 27 15" stroke="#fff4cf" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <circle cx="27" cy="28" r="1.6" fill="#8a5a1f"/>
      <circle cx="24" cy="24" r="17" fill="none" stroke="#2c2014" stroke-width="2.5"/>
    </svg>`,
  },
});

// Order here IS the solution order (sky first): indexes 0..4.
const CREATURES = [
  { key: 'harpy',    name: 'HARPY',     kenning: 'the sky' },
  { key: 'ocelot',   name: 'OCELOT',    kenning: 'the shadow-cat' },
  { key: 'boa',      name: 'BOA',       kenning: 'the coil' },
  { key: 'treefrog', name: 'TREE-FROG', kenning: 'the singer' },
  { key: 'mantis',   name: 'MANTIS',    kenning: 'the dancer' },
];
// Initial door-facing column: TREE-FROG, MANTIS, HARPY, OCELOT, BOA.
// (No drum starts on its solution face; drum III starts jammed on HARPY.)
const START = [3, 4, 0, 1, 2];
const SOLUTION = [0, 1, 2, 3, 4];
const ROMAN = ['I', 'II', 'III', 'IV', 'V'];

function drumsFrom(flags) {
  const raw = flags && flags.totem_drums;
  return (typeof raw === 'string' && /^[0-4]{5}$/.test(raw))
    ? raw.split('').map(Number)
    : START.slice();
}

// One pictogram per creature, drawn in a 72x72 box. Used carved-pale in the
// scene medallions and in the puzzle modal's drum rows.
function creatureGlyph(key, tone = '#e4f0d0') {
  const S = `fill="none" stroke="${tone}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"`;
  switch (key) {
    case 'harpy': return `<g ${S}>
      <path d="M36 15 L27 4 M36 15 L36 2 M36 15 L45 4"/>
      <circle cx="36" cy="26" r="10"/>
      <path d="M38 30 Q46 33 42 41 L34 34"/>
      <circle cx="32" cy="24" r="2.2" fill="${tone}" stroke="none"/>
      <path d="M12 52 Q24 38 36 47 Q48 38 60 52"/>
      <path d="M30 62 L36 54 L42 62 M36 54 L36 65"/>
    </g>`;
    case 'ocelot': return `<g ${S}>
      <path d="M17 25 L21 10 L31 20 M55 25 L51 10 L41 20"/>
      <circle cx="36" cy="38" r="19"/>
      <circle cx="28" cy="34" r="2.2" fill="${tone}" stroke="none"/>
      <circle cx="44" cy="34" r="2.2" fill="${tone}" stroke="none"/>
      <path d="M33 43 L36 46 L39 43 M36 46 L36 50 M36 50 Q31 54 27 51 M36 50 Q41 54 45 51"/>
      <circle cx="21" cy="44" r="1.7" fill="${tone}" stroke="none"/>
      <circle cx="51" cy="44" r="1.7" fill="${tone}" stroke="none"/>
      <circle cx="25" cy="51" r="1.7" fill="${tone}" stroke="none"/>
      <circle cx="47" cy="51" r="1.7" fill="${tone}" stroke="none"/>
    </g>`;
    case 'boa': return `<g ${S}>
      <path d="M37 36 Q45 33 45 40 Q45 48 35 48 Q23 48 23 36 Q23 22 37 22 Q55 22 55 39 Q55 58 35 58"/>
      <circle cx="35" cy="58" r="3.2" fill="${tone}" stroke="none"/>
      <path d="M32 59 L25 64 M25 64 L23 61 M25 64 L28 67" stroke-width="2"/>
    </g>`;
    case 'treefrog': return `<g ${S}>
      <circle cx="27" cy="20" r="7"/>
      <circle cx="45" cy="20" r="7"/>
      <circle cx="27" cy="20" r="2.4" fill="${tone}" stroke="none"/>
      <circle cx="45" cy="20" r="2.4" fill="${tone}" stroke="none"/>
      <path d="M20 26 Q36 18 52 26 Q60 36 52 46 Q36 56 20 46 Q12 36 20 26 Z"/>
      <path d="M28 38 Q36 44 44 38"/>
      <path d="M22 46 Q14 54 9 58"/><circle cx="8" cy="59" r="3.4" fill="${tone}" stroke="none"/>
      <path d="M50 46 Q58 54 63 58"/><circle cx="64" cy="59" r="3.4" fill="${tone}" stroke="none"/>
    </g>`;
    case 'mantis': return `<g ${S}>
      <path d="M28 12 L44 12 L36 24 Z"/>
      <circle cx="30" cy="14" r="2" fill="${tone}" stroke="none"/>
      <circle cx="42" cy="14" r="2" fill="${tone}" stroke="none"/>
      <path d="M32 10 Q26 2 19 4 M40 10 Q46 2 53 4" stroke-width="2.5"/>
      <path d="M36 24 L36 42 Q36 56 29 64"/>
      <path d="M36 30 Q22 28 17 18 L12 25 M36 30 Q50 28 55 18 L60 25"/>
      <path d="M36 42 Q46 50 52 62" stroke-width="2.5"/>
    </g>`;
    default: return '';
  }
}

export default {
  id: 'totem',
  title: 'The Totem of Teeth',
  intro: 'The painted trunks close ranks behind you and the jungle goes courtroom-quiet: a tall torchless hall, one shaft of dusk-green light falling through the torn canopy onto a stone dais, and a totem of five carved drums glaring down a sealed stone door — every face on it, top to bottom, showing teeth.',

  scene(state) {
    const cut = !!state.flags.totem_vinesCut;
    const solved = !!state.flags.totem_solved;
    const tokenHere = solved && !(state.journal || []).some(e => e.id === 'token4');
    const col = drumsFrom(state.flags);

    const drums = col.map((face, i) => {
      const yt = 190 + i * 96;
      const cy = yt + 47;
      const lashed = i === 2 && !cut;
      return `
      <g>
        <rect x="615" y="${yt}" width="230" height="94" rx="10" fill="url(#gd_totem_wood)" stroke="#2c2014" stroke-width="4"/>
        <path d="M615 ${yt + 12} Q730 ${yt - 2} 845 ${yt + 12}" fill="none" stroke="#2c2014" stroke-width="3" opacity="0.6"/>
        ${[0, 1, 2, 3, 4, 5, 6].map(t =>
          `<path d="M${642 + t * 28} ${yt + 5} l7 11 l7 -11" fill="none" stroke="#e4f0d0" stroke-width="2" opacity="0.45"/>`).join('')}
        <text x="642" y="${yt + 30}" text-anchor="middle" font-size="17" fill="#9fb37e" opacity="0.75"
          font-family="Palatino Linotype, Georgia, serif">${ROMAN[i]}</text>
        <circle cx="655" cy="${cy + 14}" r="14" fill="#241a10" stroke="#2c2014" stroke-width="2" opacity="0.8"/>
        <circle cx="765" cy="${cy}" r="36" fill="#241a10" stroke="#e4f0d0" stroke-width="2" opacity="0.95"/>
        <g transform="translate(737, ${cy - 28}) scale(0.78)" opacity="${lashed ? 0.55 : 1}">${creatureGlyph(CREATURES[face].key)}</g>
      </g>`;
    }).join('');

    const vines = cut
      ? `<g fill="none" stroke="#5aa552" stroke-width="4" stroke-linecap="round" opacity="0.85">
          <path d="M606 400 q-14 8 -20 18"/>
          <path d="M856 406 q14 8 18 18"/>
          <path d="M640 764 q30 -14 62 0 q-32 12 -62 0" fill="#223a26" stroke-width="2.5"/>
        </g>`
      : `<g>
          <path d="M600 396 Q730 372 858 402 Q730 426 600 412 Z" fill="#16281a" opacity="0.92"/>
          <path d="M602 438 Q730 414 856 444 Q730 468 602 452 Z" fill="#16281a" opacity="0.92"/>
          <path d="M604 402 Q730 380 854 408" stroke="#5aa552" stroke-width="4" fill="none" stroke-linecap="round"/>
          <path d="M606 444 Q730 422 852 450" stroke="#5aa552" stroke-width="4" fill="none" stroke-linecap="round"/>
          <circle cx="850" cy="426" r="10" fill="#223a26" stroke="#5aa552" stroke-width="3"/>
          <g class="sway slow" fill="#223a26" stroke="#5aa552" stroke-width="1.5">
            <path d="M632 398 q-8 -14 4 -22 q10 12 -4 22 z"/>
            <path d="M792 446 q10 -12 22 -6 q-6 14 -22 6 z"/>
          </g>
        </g>`;

    const eye = solved
      ? `<circle cx="730" cy="152" r="15" fill="#1a1208" stroke="#2c2014" stroke-width="3"/>
         <path d="M720 146 q10 -6 20 0" fill="none" stroke="#0b0e08" stroke-width="3" opacity="0.8"/>`
      : `<circle cx="730" cy="152" r="15" fill="url(#gd_totem_amber)" stroke="#2c2014" stroke-width="3" class="glow"/>
         <path d="M724 146 q4 -4 9 -2" stroke="#fff4cf" stroke-width="2" fill="none" stroke-linecap="round"/>`;

    const door = solved
      ? `<rect x="1200" y="260" width="240" height="456" fill="#070d08"/>
         <ellipse cx="1320" cy="470" rx="110" ry="190" fill="url(#gd_totem_dawn)" class="glow"/>
         <g class="float" opacity="0.6">
           <path d="M1290 420 l-16 -10 q-8 10 0 16 z M1290 420 l16 -10 q8 10 0 16 z" fill="#e4f0d0"/>
         </g>
         <g class="float" opacity="0.4" style="animation-delay:-2.2s">
           <path d="M1352 522 l-12 -8 q-6 8 0 12 z M1352 522 l12 -8 q6 8 0 12 z" fill="#9fd4a8"/>
         </g>
         <rect x="1200" y="664" width="240" height="52" fill="url(#gd_totem_door)" stroke="#070d08" stroke-width="3"/>
         <line x1="1320" y1="664" x2="1320" y2="716" stroke="#070d08" stroke-width="3" opacity="0.7"/>`
      : `<rect x="1200" y="260" width="240" height="456" fill="url(#gd_totem_door)"/>
         <line x1="1320" y1="260" x2="1320" y2="716" stroke="#070d08" stroke-width="3" opacity="0.7"/>
         <g stroke="#9fb37e" stroke-width="3" fill="none" opacity="0.45">
           <path d="M1320 396 L1320 470 M1280 412 L1360 412"/>
           <path d="M1280 412 l-14 34 q14 12 28 0 z M1360 412 l-14 34 q14 12 28 0 z"/>
         </g>
         <g stroke="#070d08" stroke-width="2" opacity="0.5">
           <line x1="1200" y1="380" x2="1440" y2="380"/><line x1="1200" y1="560" x2="1440" y2="560"/>
         </g>`;

    const token = tokenHere
      ? `<g class="beckon">
          <ellipse cx="1058" cy="750" rx="28" ry="9" fill="rgba(255,224,138,0.30)" class="glow"/>
          <circle cx="1058" cy="734" r="16" fill="#6b4f37" stroke="#2c2014" stroke-width="3"/>
          <circle cx="1058" cy="734" r="16" fill="none" stroke="#d1a53f" stroke-width="1.5" opacity="0.75"/>
          <circle cx="1058" cy="729" r="5" fill="none" stroke="#ffe08a" stroke-width="1.6"/>
          <path d="M1052 725 q-3 -4 -1 -7 M1064 725 q3 -4 1 -7 M1051 731 q-4 1 -6 4 M1065 731 q4 1 6 4"
            stroke="#ffe08a" stroke-width="1.4" fill="none" stroke-linecap="round"/>
          <text x="1058" y="746" text-anchor="middle" font-size="9" fill="#ffe08a"
            font-family="Palatino Linotype, Georgia, serif">Y</text>
        </g>`
      : '';

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gd_totem_wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#070d08"/>
          <stop offset="0.45" stop-color="#0e1c12"/>
          <stop offset="1" stop-color="#16281a"/>
        </linearGradient>
        <linearGradient id="gd_totem_floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#16281a"/>
          <stop offset="1" stop-color="#070d08"/>
        </linearGradient>
        <linearGradient id="gd_totem_beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="rgba(159,212,168,0.30)"/>
          <stop offset="1" stop-color="rgba(159,212,168,0)"/>
        </linearGradient>
        <linearGradient id="gd_totem_wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#6b4f37"/>
          <stop offset="1" stop-color="#4a3626"/>
        </linearGradient>
        <linearGradient id="gd_totem_wood2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#4a3626"/>
          <stop offset="1" stop-color="#2c2014"/>
        </linearGradient>
        <linearGradient id="gd_totem_door" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#3f4a3c"/>
          <stop offset="1" stop-color="#2e3a2c"/>
        </linearGradient>
        <radialGradient id="gd_totem_amber" cx="0.4" cy="0.35" r="0.9">
          <stop offset="0" stop-color="#ffe08a"/>
          <stop offset="0.6" stop-color="#d1a53f"/>
          <stop offset="1" stop-color="#8a5a1f"/>
        </radialGradient>
        <radialGradient id="gd_totem_dawn" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(228,240,208,0.5)"/>
          <stop offset="0.6" stop-color="rgba(159,212,168,0.18)"/>
          <stop offset="1" stop-color="rgba(159,212,168,0)"/>
        </radialGradient>
        <radialGradient id="gd_totem_pool" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(159,212,168,0.28)"/>
          <stop offset="1" stop-color="rgba(159,212,168,0)"/>
        </radialGradient>
      </defs>
      <style>
        @keyframes totem_drift_a { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(26px, -20px); } }
        @keyframes totem_drift_b { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-32px, 14px); } }
        @keyframes totem_drift_c { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(18px, 26px); } }
      </style>

      <!-- walls & floor -->
      <rect width="1600" height="660" fill="url(#gd_totem_wall)"/>
      <g stroke="#070d08" stroke-width="3" opacity="0.45">
        <line x1="0" y1="170" x2="1600" y2="170"/><line x1="0" y1="330" x2="1600" y2="330"/>
        <line x1="0" y1="490" x2="1600" y2="490"/><line x1="0" y1="640" x2="1600" y2="640"/>
        <line x1="470" y1="170" x2="470" y2="330"/><line x1="1130" y1="330" x2="1130" y2="490"/>
        <line x1="360" y1="490" x2="360" y2="640"/><line x1="920" y1="170" x2="920" y2="330"/>
      </g>
      <rect y="640" width="1600" height="260" fill="url(#gd_totem_floor)"/>
      <g stroke="#070d08" stroke-width="3" opacity="0.6">
        <line x1="0" y1="700" x2="1600" y2="700"/><line x1="0" y1="780" x2="1600" y2="780"/>
        <line x1="0" y1="852" x2="1600" y2="852"/>
      </g>
      <ellipse cx="330" cy="700" rx="130" ry="18" fill="#223a26" opacity="0.5"/>
      <ellipse cx="1480" cy="800" rx="150" ry="22" fill="#223a26" opacity="0.4"/>

      <!-- roots pouring down the walls -->
      <g stroke-linecap="round" fill="none">
        <path d="M120 0 Q132 210 108 420 Q96 560 128 660" stroke="#4a3626" stroke-width="20"/>
        <path d="M120 0 Q132 210 108 420" stroke="#6b4f37" stroke-width="6" opacity="0.7"/>
        <path d="M192 0 Q172 160 198 330 Q214 480 186 660" stroke="#4a3626" stroke-width="13"/>
        <path d="M1560 0 Q1546 220 1566 430 Q1578 560 1552 660" stroke="#4a3626" stroke-width="16"/>
        <path d="M1560 0 Q1546 220 1566 430" stroke="#6b4f37" stroke-width="5" opacity="0.7"/>
      </g>

      <!-- torn canopy above; the breach over the dais -->
      <path d="M0 0 H1600 V70 Q1520 96 1420 74 Q1340 106 1250 70 L1010 84 Q950 62 870 90 Q760 116 640 82 Q520 108 400 78 Q300 100 180 76 Q90 98 0 74 Z" fill="#070d08"/>
      <ellipse cx="1120" cy="66" rx="170" ry="42" fill="#9fd4a8" opacity="0.28" class="flicker"/>
      <g class="sway slow" fill="#0e1c12">
        <path d="M150 58 q-12 72 8 132 q26 -58 6 -130 z"/>
        <path d="M212 68 q-4 56 14 100 q18 -48 0 -100 z"/>
      </g>
      <g class="sway slow" fill="#0e1c12" style="animation-delay:-2s">
        <path d="M1382 64 q-10 62 10 118 q22 -54 4 -116 z"/>
      </g>

      <!-- the canopy light-shaft, falling on the dais -->
      <polygon points="1005,62 1235,62 1160,790 858,790" fill="url(#gd_totem_beam)" class="moonbeam"/>

      <!-- relief A: the sky-nest (upper left wall) -->
      <g>
        <rect x="250" y="160" width="160" height="140" rx="8" fill="#2e3a2c" stroke="#070d08" stroke-width="4"/>
        <rect x="258" y="168" width="144" height="124" rx="6" fill="none" stroke="#3f4a3c" stroke-width="2"/>
        <g fill="none" stroke="#9fb37e" stroke-width="3" stroke-linecap="round" opacity="0.85">
          <path d="M268 262 Q330 236 392 262"/>
          <path d="M292 238 Q330 222 368 238 Q356 252 330 254 Q304 252 292 238 Z"/>
          <path d="M298 240 L318 232 M340 230 L362 240 M310 246 L346 244"/>
        </g>
        <g stroke="#d1a53f" stroke-width="2.5" stroke-linecap="round" fill="none">
          <path d="M326 236 q2 -8 6 -10 M332 238 q4 -7 9 -8 M322 238 q0 -7 3 -11"/>
        </g>
      </g>

      <!-- relief B: the shed skin (lower left wall) -->
      <g>
        <rect x="150" y="480" width="170" height="150" rx="8" fill="#2e3a2c" stroke="#070d08" stroke-width="4"/>
        <rect x="158" y="488" width="154" height="134" rx="6" fill="none" stroke="#3f4a3c" stroke-width="2"/>
        <g fill="none" stroke="#9fb37e" stroke-width="3" stroke-linecap="round" opacity="0.85">
          <path d="M166 608 Q200 590 214 562 Q228 532 260 528 Q296 526 304 502"/>
          <path d="M166 596 Q196 582 208 556 Q222 526 258 518 Q290 514 298 496"/>
          <ellipse cx="236" cy="542" rx="26" ry="18" transform="rotate(-18 236 542)"/>
          <path d="M180 598 l8 -6 M196 584 l8 -6 M212 568 l8 -8 M250 526 l4 -8 M268 522 l4 -8" stroke-width="2"/>
        </g>
        <circle cx="230" cy="540" r="1.8" fill="#9fb37e"/>
        <circle cx="240" cy="537" r="1.8" fill="#9fb37e"/>
      </g>

      <!-- relief C: the singer's meal (right wall, upper) -->
      <g>
        <rect x="950" y="270" width="160" height="130" rx="8" fill="#2e3a2c" stroke="#070d08" stroke-width="4"/>
        <rect x="958" y="278" width="144" height="114" rx="6" fill="none" stroke="#3f4a3c" stroke-width="2"/>
        <g fill="none" stroke="#9fb37e" stroke-width="3" stroke-linecap="round" opacity="0.85">
          <path d="M962 372 Q1020 344 1094 356 Q1040 384 962 372 Z"/>
          <path d="M1006 344 Q1022 330 1040 341 Q1047 352 1036 358 Q1018 362 1006 353 Z"/>
          <path d="M1040 348 Q1058 344 1070 332"/>
        </g>
        <circle cx="1032" cy="340" r="2.2" fill="#9fb37e"/>
        <path d="M1070 332 l9 -9 q5 7 -2 12 z" fill="#9fb37e" opacity="0.8"/>
      </g>

      <!-- relief D: the shadow-cat's den (right wall, lower) -->
      <g>
        <rect x="950" y="470" width="160" height="140" rx="8" fill="#2e3a2c" stroke="#070d08" stroke-width="4"/>
        <rect x="958" y="478" width="144" height="124" rx="6" fill="none" stroke="#3f4a3c" stroke-width="2"/>
        <path d="M974 596 Q974 548 1030 548 Q1086 548 1086 596 Z" fill="#070d08"/>
        <path d="M966 596 Q966 540 1030 540 Q1094 540 1094 596" fill="none" stroke="#9fb37e" stroke-width="3" opacity="0.85"/>
        <g stroke="#e4f0d0" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.8">
          <path d="M996 586 q10 -10 22 -6 M1032 590 q12 -8 24 -2 M1010 574 q8 -6 18 -4"/>
          <path d="M1002 592 l4 -3 M1044 592 l4 -3"/>
        </g>
        <g fill="#9fb37e" opacity="0.8">
          <circle cx="1068" cy="566" r="2"/><circle cx="1074" cy="562" r="2"/>
          <circle cx="1080" cy="566" r="2"/><circle cx="1074" cy="572" r="3"/>
        </g>
      </g>

      <!-- the stone door in its toothed frame -->
      <g>
        <rect x="1176" y="236" width="288" height="500" fill="#2e3a2c" stroke="#070d08" stroke-width="5"/>
        ${door}
        ${[0, 1, 2, 3, 4, 5, 6].map(t =>
          `<path d="M${1208 + t * 32} 260 l10 16 l10 -16" fill="#3f4a3c" stroke="#070d08" stroke-width="1.5"/>`).join('')}
        ${[0, 1, 2, 3, 4, 5, 6].map(t =>
          `<path d="M${1208 + t * 32} 716 l10 -16 l10 16" fill="#3f4a3c" stroke="#070d08" stroke-width="1.5"/>`).join('')}
      </g>

      <!-- tooth-marks gouged into the doorframe wall -->
      <g stroke="#9fb37e" stroke-width="4" stroke-linecap="round" opacity="0.65">
        <path d="M1489 316 L1509 424 M1511 310 L1531 420 M1533 306 L1553 414 M1555 302 L1573 408"/>
      </g>

      <!-- the dais, its light pool, and the carved reading-line -->
      <ellipse cx="1010" cy="758" rx="200" ry="40" fill="#3f4a3c" stroke="#2e3a2c" stroke-width="5"/>
      <ellipse cx="1010" cy="752" rx="184" ry="32" fill="#55624a" opacity="0.55"/>
      <ellipse cx="1010" cy="756" rx="190" ry="36" fill="url(#gd_totem_pool)" class="glow"/>
      <path d="M865 756 L1178 728" stroke="#9fd4a8" stroke-width="6" opacity="0.55" stroke-dasharray="20 12" class="shimmer"/>

      <!-- THE TOTEM -->
      <g>
        <rect x="600" y="668" width="260" height="92" rx="8" fill="url(#gd_totem_wood2)" stroke="#2c2014" stroke-width="4"/>
        <g stroke="#4a3626" stroke-width="2.5" fill="none" opacity="0.5">
          <circle cx="640" cy="700" r="10"/><circle cx="828" cy="712" r="9"/>
          <path d="M792 690 q8 10 0 20"/>
        </g>
        <!-- the newest carving: cuts still pale -->
        <g stroke="#eef4da" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.95">
          <circle cx="712" cy="696" r="8"/>
          <path d="M712 704 L712 734 M712 712 L698 722 M712 714 L728 720 M712 734 L702 752 M712 734 L722 752"/>
          <rect x="694" y="720" width="12" height="10" rx="2"/>
          <path d="M728 720 l9 5 l9 -5 l9 5 l9 -5 l9 5"/>
        </g>
        ${drums}
        ${vines}
        <!-- the crown and its amber eye -->
        <path d="M630 190 L630 138 Q680 112 730 118 Q780 112 830 138 L830 190 Z" fill="url(#gd_totem_wood2)" stroke="#2c2014" stroke-width="4"/>
        <path d="M648 138 L636 106 L670 126 Z" fill="#4a3626" stroke="#2c2014" stroke-width="3"/>
        <path d="M812 138 L824 106 L790 126 Z" fill="#4a3626" stroke="#2c2014" stroke-width="3"/>
        ${[0, 1, 2, 3, 4, 5].map(t =>
          `<path d="M${646 + t * 30} 186 l7 10 l7 -10" fill="none" stroke="#e4f0d0" stroke-width="2" opacity="0.45"/>`).join('')}
        ${eye}
      </g>

      ${token}

      <!-- fireflies -->
      <g style="animation: totem_drift_a 9s ease-in-out infinite"><circle cx="470" cy="500" r="4" fill="#ffe08a" class="glow fast"/></g>
      <g style="animation: totem_drift_b 12s ease-in-out infinite"><circle cx="1120" cy="330" r="3.5" fill="#ffe08a" class="glow fast"/></g>
      <g style="animation: totem_drift_c 10s ease-in-out infinite"><circle cx="900" cy="620" r="4" fill="#ffe08a" class="glow fast"/></g>

      <!-- ground fog -->
      <ellipse cx="420" cy="856" rx="340" ry="42" fill="rgba(159,212,168,0.07)" class="fog"/>
      <ellipse cx="1220" cy="846" rx="320" ry="38" fill="rgba(159,212,168,0.06)" class="fog reverse"/>

      <path d="M0 900 L0 856 Q800 902 1600 856 L1600 900 Z" fill="#070d08"/>
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const solved = !!state.flags.totem_solved;
    const tokenTaken = (state.journal || []).some(e => e.id === 'token4');

    spots.push({
      id: 'relief_a', x: 240, y: 150, w: 180, h: 160, label: 'Relief — the sky-nest',
      onInteract(game) {
        const html = `<div class="leaf-tablet carved"><div class="leaf-title">Relief A — the sky-nest</div>
          A high nest of woven bones, carved feather-fine. <em>"In the sky-nest, a tuft of golden
          shadow-cat fur."</em></div>
          <p style="margin-top:12px; color:var(--text-dim); font-style:italic;">Not decoration — remains.
          The jungle keeps its records the way it keeps everything: by what is left over.</p>`;
        game.journal.add('totem_reliefA', { title: 'Relief A — the sky-nest (Totem of Teeth)', category: 'note', html });
        game.dialog({ title: 'The Sky-Nest', html });
      },
    });

    spots.push({
      id: 'relief_b', x: 140, y: 470, w: 190, h: 170, label: 'Relief — the shed skin',
      onInteract(game) {
        const html = `<div class="leaf-tablet carved"><div class="leaf-title">Relief B — the cast skin</div>
          A serpent's shed skin, rendered scale by patient scale. <em>"The coil's shed skin bulges
          with a singer's shape."</em></div>
          <p style="margin-top:12px; color:var(--text-dim); font-style:italic;">The carver even gave the
          bulge two little eyes. Somebody here has a sense of humor. It is not a kind one.</p>`;
        game.journal.add('totem_reliefB', { title: 'Relief B — the cast skin (Totem of Teeth)', category: 'note', html });
        game.dialog({ title: 'The Cast Skin', html });
      },
    });

    spots.push({
      id: 'relief_c', x: 940, y: 260, w: 180, h: 150, label: 'Relief — the singer on the leaf',
      onInteract(game) {
        const html = `<div class="leaf-tablet carved"><div class="leaf-title">Relief C — the singer's meal</div>
          A frog on a leaf, mid-supper. <em>"On the singer's tongue, a dancer's wing."</em></div>
          <p style="margin-top:12px; color:var(--text-dim); font-style:italic;">Caught in stone at the exact
          moment nobody involved would have chosen to be remembered.</p>`;
        game.journal.add('totem_reliefC', { title: 'Relief C — the singer\'s meal (Totem of Teeth)', category: 'note', html });
        game.dialog({ title: 'The Singer\'s Meal', html });
      },
    });

    spots.push({
      id: 'relief_d', x: 940, y: 460, w: 180, h: 160, label: 'Relief — the shadow-cat\'s den',
      onInteract(game) {
        const html = `<div class="leaf-tablet carved"><div class="leaf-title">Relief D — the den</div>
          The shadow-cat's den, littered with leavings. <em>"Bones of the coil litter the shadow-cat's
          den — <span class="leaf-warn">but of singer and dancer, nothing. Too small beneath its
          hunger.</span>"</em></div>
          <p style="margin-top:12px; color:var(--text-dim); font-style:italic;">The carver spent as much
          care on what is absent from this den as on what is in it. Absences like that are usually
          the point.</p>`;
        game.journal.add('totem_reliefD', { title: 'Relief D — the shadow-cat\'s den (Totem of Teeth)', category: 'note', html });
        game.dialog({ title: 'The Shadow-Cat\'s Den', html });
      },
    });

    spots.push({
      id: 'dais', x: 850, y: 706, w: 280, h: 110, label: 'The moonlit dais',
      onInteract(game) {
        const html = `<div class="leaf-tablet carved"><div class="leaf-title">The Dais Line</div>
          <em>"The Court reads from the sky downward — each face takes the meal directly beneath it,
          and no face speaks twice."</em></div>
          <p style="margin-top:12px; color:var(--text-dim); font-style:italic;">The inlaid line runs true
          from the totem's base to the stone door, catching the canopy light like a bailiff's rail.
          Whatever column of faces stands over this line is the one that counts.</p>`;
        game.journal.add('totem_dais', { title: 'The dais line (Totem of Teeth)', category: 'note', html });
        game.dialog({ title: 'The Moonlit Dais', html });
      },
    });

    spots.push({
      id: 'carving', x: 600, y: 670, w: 260, h: 100, label: 'The totem\'s base',
      onInteract(game) {
        const html = `<div class="leaf-tablet carved"><div class="leaf-title">The Newest Carving</div>
          Low on the base, where the moss has not yet reached, the cuts still pale: <em>a human figure.
          Satchel. Measuring chain. The newest carving on the whole totem.</em></div>
          <p style="margin-top:12px; color:var(--text-dim); font-style:italic;">Every other face on this
          pillar has had centuries to darken. This one could have been cut last season. It could have
          been cut the day the ground opened.</p>`;
        game.journal.add('totem_carving', { title: 'The newest carving (Totem of Teeth)', category: 'note', html });
        game.dialog({ title: 'The Totem\'s Base', html });
      },
    });

    spots.push({
      id: 'totem', x: 605, y: 130, w: 250, h: 535, label: 'The totem drums',
      onInteract(game) {
        if (!game.getFlag('totem_vinesCut') && game.selectedItem === 'machete') {
          game.say('Gus clears his throat, which in a tamarin is a full-body event. "Blades go to bindings, counsel — the lashings on drum III, not the witness itself."');
          return;
        }
        if (game.getFlag('totem_solved')) {
          game.say('The drums rest in their spoken order — sky, shadow-cat, coil, singer, dancer — humming very faintly, like a jury that has already gone home.');
          return;
        }
        openTotemPuzzle(game);
      },
    });

    if (!state.flags.totem_vinesCut) {
      spots.push({
        id: 'vines', x: 575, y: 370, w: 310, h: 120, label: 'Strangler vines — drum III',
        onInteract(game) {
          if (game.selectedItem === 'machete') {
            game.setFlag('totem_vinesCut');
            game.playSfx('creak');
            game.say('The bone-handled machete goes through the strangler vine in three wet strokes, and drum III shrugs off its lashings like a witness finally taking the stand. "Objection sustained," says Gus.');
            game.refreshScene();
          } else {
            game.say('Strangler vine, wrist-thick and knotted like it means it, lashing drum III fast to its neighbors. You try a knot with your fingers. The knot wins on all counts.');
          }
        },
      });
    }

    spots.push({
      id: 'toothmarks', x: 1470, y: 290, w: 120, h: 180, label: 'Tooth-marks on the doorframe',
      onInteract(game) {
        game.say('Four long gouges rake the doorframe at shoulder height — shoulder height on something considerably better supplied with shoulders than you. The stone has healed smooth around them, which is not a thing stone does.');
      },
    });

    if (!solved) {
      spots.push({
        id: 'door', x: 1190, y: 260, w: 250, h: 450, label: 'The stone door',
        onInteract(game) {
          game.say('The stone door sits flush in its toothed frame, sealed the way verdicts are sealed. The totem stands square in front of it like a bailiff who knows you have not been called yet.');
        },
      });
    } else {
      spots.push({
        id: 'door_open', x: 1190, y: 260, w: 250, h: 450, label: 'The open way',
        onInteract(game) {
          if (!game.hasItem('amber_lens')) {
            game.say('Gus swings up between you and the doorway, blocking remarkably little of it and all of your conscience. "The totem surrendered its eye into evidence, counsel. We do not leave evidence."');
            return;
          }
          if (!game.journal.has('token4')) {
            game.say('Gus plants himself on the dais line, tail raised like a gavel. "The Court struck a token for this trial and it is lying right there on the dais, Marlowe. We do not walk out on exhibits."');
            return;
          }
          game.say('You step over the sunken slab into dawn-pale light — and the air ahead is full of slow blue wings.');
          game.completeRoom({ delay: 700 });
        },
      });
    }

    if (solved && !tokenTaken) {
      spots.push({
        id: 'token4', x: 1005, y: 682, w: 100, h: 90, label: 'A carved disc on the dais',
        onInteract(game) {
          game.journal.add('token4', { title: 'Court token — the totem crown', category: 'sun', sun: { creature: 'tamarin', letter: 'Y' } });
          game.playSfx('pickup');
          game.say('A court token, fallen from the crown: a small wood disc bearing a golden tamarin\'s face above the letter Y. Gus leans in, mane like a struck match. "That one is me. I insisted."');
          game.refreshScene();
        },
      });
    }

    return spots;
  },

  hintContext(state) { return state.flags.totem_vinesCut ? 'order' : 'vines'; },

  hints(state) {
    if (!state.flags.totem_vinesCut) {
      return [
        { text: 'The third drum is bound fast. Bound things want blades.', cost: 60 },
        { text: 'The machete, on the strangler vines.', cost: 120 },
        { text: 'Cut drum III free at the totem, then read the reliefs — they are meals, not decorations.', cost: 240 },
      ];
    }
    return [
      { text: 'Four reliefs, four meals — but one relief matters most for what it says did NOT happen. And the dais tells you how the Court reads.', cost: 60 },
      { text: 'Sky ate shadow-cat. Shadow-cat scorns singer and dancer, so its meal was the coil. Coil ate singer; singer ate dancer.', cost: 120 },
      { text: 'Top to bottom: harpy, ocelot, boa, tree-frog, mantis.', cost: 240 },
    ];
  },
};

function openTotemPuzzle(game) {
  game.openPuzzle({
    id: 'totem_drums',
    title: 'The Totem of Teeth',
    wide: true,
    onCleanup() { game.refreshScene(); },
    render(body, api) {
      body.innerHTML = `
        <p class="puzzle-desc">Five drums, five faces each — the sky, the shadow-cat, the coil,
        the singer, the dancer. The column facing the stone door is the one the Court reads,
        and the dais line is carved plain: <em>from the sky downward, each face takes the meal
        directly beneath it, and no face speaks twice.</em></p>
        <div id="totem-rows"></div>
        <div class="puzzle-row"><button class="btn btn-primary" id="totem-wake">Wake the Totem</button></div>
        <div class="puzzle-feedback"></div>`;

      const rows = body.querySelector('#totem-rows');

      const vineOverlay = `<g stroke="#5aa552" stroke-width="5" fill="none" opacity="0.9" stroke-linecap="round">
        <path d="M2 24 Q36 34 70 22"/><path d="M2 46 Q36 54 70 42"/>
        <path d="M52 20 q4 -8 10 -9" stroke-width="3"/></g>`;

      function rowHtml(i, faceIdx, cut) {
        const c = CREATURES[faceIdx];
        const lashed = i === 2 && !cut;
        const btnAttrs = lashed ? 'disabled style="opacity:0.35; cursor:not-allowed;"' : '';
        return `
        <div style="display:flex; align-items:center; gap:14px; margin:10px auto; max-width:500px; padding:8px 14px;
          border-radius:12px; border:1px solid ${lashed ? '#5aa552' : 'rgba(107,79,55,0.8)'};
          background:${lashed ? 'rgba(34,58,38,0.55)' : 'rgba(74,54,38,0.35)'};">
          <div style="width:32px; text-align:center; font-family:'Palatino Linotype', Georgia, serif; opacity:0.8;">${ROMAN[i]}</div>
          <button class="dial-btn" data-row="${i}" data-d="-1" ${btnAttrs}>&#9664;</button>
          <div style="flex:1; display:flex; align-items:center; gap:12px; justify-content:center;">
            <svg viewBox="0 0 72 72" width="52" height="52" xmlns="http://www.w3.org/2000/svg">
              <g opacity="${lashed ? 0.5 : 1}">${creatureGlyph(c.key)}</g>${lashed ? vineOverlay : ''}
            </svg>
            <div style="text-align:left; min-width:160px;">
              <div style="letter-spacing:0.1em; font-weight:700;">${c.name}</div>
              <div style="font-size:12px; opacity:0.7; font-style:italic;">${c.kenning}${lashed ? ' — lashed fast in strangler vine' : ''}</div>
            </div>
          </div>
          <button class="dial-btn" data-row="${i}" data-d="1" ${btnAttrs}>&#9654;</button>
        </div>`;
      }

      function paint() {
        const cut = !!game.getFlag('totem_vinesCut');
        const col = drumsFrom(game.state.flags);
        rows.innerHTML = col.map((face, i) => rowHtml(i, face, cut)).join('');
        rows.querySelectorAll('button[data-d]').forEach(btn => {
          btn.addEventListener('click', () => {
            const i = Number(btn.dataset.row);
            if (i === 2 && !game.getFlag('totem_vinesCut')) return;
            const next = drumsFrom(game.state.flags);
            next[i] = (next[i] + Number(btn.dataset.d) + 5) % 5;
            game.setFlag('totem_drums', next.join(''));
            game.playSfx('click');
            paint();
          });
        });
      }
      paint();

      body.querySelector('#totem-wake').addEventListener('click', () => {
        if (!game.getFlag('totem_vinesCut')) {
          api.fail('Drum III strains against its lashings.');
          return;
        }
        const col = drumsFrom(game.state.flags);
        if (new Set(col).size < 5) {
          api.fail('The dais line is carved plain — no face speaks twice — and your column repeats itself. The totem declines to be woken by perjury.');
          return;
        }
        if (col.join('') === SOLUTION.join('')) {
          game.setFlag('totem_solved');
          game.setFlag('totem_drums', SOLUTION.join(''));
          game.journal.add('totem_order', {
            title: 'The totem\'s order (Totem of Teeth)',
            category: 'note',
            html: `<div class="leaf-tablet"><div class="leaf-title">The Totem's Order</div>
              The totem's order, sky downward: <strong>harpy, ocelot, boa, tree-frog, mantis</strong>.</div>`,
          });
          game.playSfx('stone');
          game.addItem('amber_lens', { from: { x: 730, y: 152 } });
          api.solved({
            message: 'The five faces align and the totem WAKES — a rolling percussion of wood on wood that you feel in your molars. The amber eye drops from the crown into your palm, warm as a held breath; the stone door grinds down into the floor; and from the crown a small carved disc clatters onto the dais. "The Court accepts your reading of the docket," says Gus, tail curled with satisfaction. "Collect your exhibits, counsel."',
          });
          game.refreshScene();
        } else {
          api.fail('The drums grind through their teeth and go still. Somewhere in your column, a face is credited with a meal it never ate.');
        }
      });
    },
  });
}
