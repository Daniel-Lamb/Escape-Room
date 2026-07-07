// TRIAL 6 — The Tithe Hall. Peak 2: counterfeit weighing under a query budget.
// Eight golden cacao pods (tallies I–VIII), one hollow: true pods weigh 10, the
// hollow 7. The Scale answers TWICE per rite, then sleeps; every rite-start
// (modal open, "Begin the rite anew", wrong present) re-lays the hollow pod as
// SEQ[riteCount % 8], SEQ = [6,3,8,1,5,2,7,4] — the first-ever rite is pod VI.
// Step 1: restring the broken pan with the vine cord (tithehall_scaleStrung).
// Token 6 (OCELOT, "A") on the offering table. Vance's compass: foreshadow AND
// takeable item. Exit gate: hollow pod + Vance's compass + token 6.

import { registerItems } from '../../../shared/js/items.js';

registerItems({
  vance_compass: {
    name: 'Vance\'s Compass',
    description: 'Brass, heavy, needle long since still. Engraved: T. VANCE — 1911. The founding survey was never filed; the surveyor was never found.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="4" width="8" height="7" rx="2" fill="#a07c2c"/>
      <circle cx="24" cy="8" r="2.5" fill="none" stroke="#7a5a20" stroke-width="1.5"/>
      <circle cx="24" cy="27" r="17" fill="#d1a53f" stroke="#7a5a20" stroke-width="2.5"/>
      <circle cx="24" cy="27" r="11.5" fill="#e4f0d0"/>
      <path d="M24 17.5 L27 27 L24 36.5 L21 27 Z" fill="#8a2f2f"/>
      <path d="M24 17.5 L27 27 L21 27 Z" fill="#b34040"/>
      <circle cx="24" cy="27" r="2" fill="#4a3626"/>
      <path d="M13 38 L17 34 M35 38 L31 34" stroke="#7a5a20" stroke-width="1.5"/>
    </svg>`,
  },
  hollow_pod: {
    name: 'The Hollow Pod',
    description: 'Gold over air — the lie, kept as evidence. Lighter than truth by exactly three measures.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="24" cy="27" rx="13" ry="17" fill="#d1a53f" stroke="#8a6a24" stroke-width="2"/>
      <path d="M18 13 Q13 27 18 41 M30 13 Q35 27 30 41" stroke="#8a6a24" stroke-width="1.5" fill="none"/>
      <path d="M24 10 L24 44" stroke="#8a6a24" stroke-width="1.5"/>
      <path d="M24 10 Q22 5 17 5" stroke="#5aa552" stroke-width="2.5" fill="none"/>
      <ellipse cx="19.5" cy="19" rx="3" ry="5" fill="#ffe08a" opacity="0.75"/>
      <path d="M27 22 L30 28 L27 34" stroke="#7a5a20" stroke-width="1" fill="none"/>
    </svg>`,
  },
});

const SEQ = [6, 3, 8, 1, 5, 2, 7, 4];
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
const PODX = [920, 970, 1020, 1070, 1120, 1170, 1220, 1270];

export default {
  id: 'tithehall',
  title: 'The Tithe Hall',
  intro: 'The great wing folds shut behind you on a long hall of green-black stone: an offering table set with eight golden cacao pods, and a bronze scale taller than you holding out one pan like an open palm — the other dangles from a snapped cord — while Gus paces the plinth already talking: "The Scale of Truth, counsel. Mind your questions. It only answers two."',

  scene(state) {
    const strung = !!state.flags.tithehall_scaleStrung;
    const solved = !!state.flags.tithehall_solved;
    const compassHere = !state.flags.tithehall_compassTaken;
    const tokenHere = !state.flags.tithehall_tokenTaken;

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gd_tithehall_wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#0e1c12"/>
          <stop offset="0.55" stop-color="#16281a"/>
          <stop offset="1" stop-color="#223a26"/>
        </linearGradient>
        <linearGradient id="gd_tithehall_floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#1d301f"/>
          <stop offset="1" stop-color="#070d08"/>
        </linearGradient>
        <radialGradient id="gd_tithehall_pod" cx="0.35" cy="0.3" r="1">
          <stop offset="0" stop-color="#ffe08a"/>
          <stop offset="0.5" stop-color="#d1a53f"/>
          <stop offset="1" stop-color="#8a6a24"/>
        </radialGradient>
        <linearGradient id="gd_tithehall_bronze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#d1a53f"/>
          <stop offset="1" stop-color="#7a5a20"/>
        </linearGradient>
        <linearGradient id="gd_tithehall_wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#6b4f37"/>
          <stop offset="1" stop-color="#4a3626"/>
        </linearGradient>
        <linearGradient id="gd_tithehall_stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#3f4a3c"/>
          <stop offset="1" stop-color="#2e3a2c"/>
        </linearGradient>
        <radialGradient id="gd_tithehall_pool" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(159,212,168,0.14)"/>
          <stop offset="1" stop-color="rgba(159,212,168,0)"/>
        </radialGradient>
      </defs>
      <style>
        @keyframes tithehall_drift { from { transform: translate(0, 0); } to { transform: translate(30px, -22px); } }
        .tithehall-mote { animation: tithehall_drift 8s ease-in-out infinite alternate; }
      </style>

      <!-- back wall and floor -->
      <rect width="1600" height="660" fill="url(#gd_tithehall_wall)"/>
      <g stroke="#0b140c" stroke-width="3" opacity="0.6">
        ${[130, 270, 410, 550].map(y => `<line x1="0" y1="${y}" x2="1600" y2="${y}"/>`).join('')}
        ${[160, 480, 800, 1140, 1500].map(x => `<line x1="${x}" y1="0" x2="${x}" y2="660"/>`).join('')}
      </g>
      <rect y="660" width="1600" height="240" fill="url(#gd_tithehall_floor)"/>
      <g stroke="#070d08" stroke-width="3" opacity="0.7">
        ${[706, 770, 842].map(y => `<line x1="0" y1="${y}" x2="1600" y2="${y}"/>`).join('')}
        <line x1="380" y1="706" x2="340" y2="900"/><line x1="900" y1="706" x2="940" y2="900"/><line x1="1300" y1="706" x2="1360" y2="900"/>
      </g>

      <!-- canopy breach, hanging roots -->
      <path d="M560 0 L1000 0 L952 44 L862 66 L742 74 L638 52 Z" fill="#070d08"/>
      <ellipse cx="620" cy="42" rx="46" ry="16" fill="#16281a" transform="rotate(-14 620 42)"/>
      <ellipse cx="960" cy="36" rx="52" ry="15" fill="#16281a" transform="rotate(11 960 36)"/>
      <path d="M702 62 Q690 142 708 212" stroke="#223a26" stroke-width="6" fill="none" class="sway slow"/>
      <path d="M842 68 Q856 152 840 226" stroke="#1d301f" stroke-width="5" fill="none" class="sway slow"/>
      <path d="M772 72 Q766 120 776 158" stroke="#223a26" stroke-width="4" fill="none" class="sway"/>

      <!-- tithe frieze: the procession of bearers -->
      <g opacity="0.92">
        <rect x="300" y="148" width="345" height="88" fill="#2e3a2c" stroke="#1c2718" stroke-width="3"/>
        <line x1="314" y1="164" x2="631" y2="164" stroke="#1c2718" stroke-width="2"/>
        ${[335, 390, 445, 500, 555, 610].map((x, i) => `
          <path d="M${x - 13} 214 Q${x} ${188 + (i % 2) * 6} ${x + 13} 214 Z" fill="#141f15"/>
          <path d="M${x - 9} ${196 + (i % 2) * 4} L${x - 6} ${188 + (i % 2) * 4} M${x + 9} ${196 + (i % 2) * 4} L${x + 6} ${188 + (i % 2) * 4}" stroke="#141f15" stroke-width="3"/>
          <circle cx="${x + 22}" cy="206" r="${6 - i * 0.5}" fill="#d1a53f" opacity="0.55"/>`).join('')}
      </g>

      <!-- columns -->
      ${[240, 1080].map(cx => `
      <g>
        <rect x="${cx}" y="96" width="72" height="564" fill="url(#gd_tithehall_stone)" stroke="#1c2718" stroke-width="3"/>
        ${[190, 290, 390, 490, 590].map(y => `<line x1="${cx}" y1="${y}" x2="${cx + 72}" y2="${y}" stroke="#1c2718" stroke-width="2" opacity="0.8"/>`).join('')}
        <path d="M${cx + 10} 96 Q${cx - 6} 300 ${cx + 16} 520 Q${cx + 22} 600 ${cx + 6} 660" stroke="#4a3626" stroke-width="7" fill="none" opacity="0.85"/>
        <path d="M${cx + 52} 140 Q${cx + 66} 340 ${cx + 48} 560" stroke="#3a2a1c" stroke-width="5" fill="none" opacity="0.7"/>
      </g>`).join('')}

      <!-- the far door -->
      <g>
        <rect x="1240" y="240" width="230" height="420" fill="#1c2718"/>
        <circle cx="1355" cy="216" r="17" fill="#2e3a2c" stroke="#1c2718" stroke-width="3"/>
        <path d="M1344 206 L1348 197 L1352 205 M1358 205 L1362 197 L1366 206" stroke="#1c2718" stroke-width="3" fill="none"/>
        ${solved ? `
        <rect x="1256" y="256" width="198" height="404" fill="#070d08"/>
        <path d="M1256 256 L1206 296 L1206 690 L1256 660 Z" fill="url(#gd_tithehall_stone)" stroke="#1c2718" stroke-width="3"/>
        <circle cx="1231" cy="420" r="18" fill="none" stroke="#2e3a2c" stroke-width="4"/>
        <circle cx="1340" cy="380" r="3.5" fill="#ffe08a" class="glow fast"/>
        <circle cx="1408" cy="470" r="3" fill="#ffe08a" class="glow fast"/>
        <polygon points="1256,660 1454,660 1512,772 1206,772" fill="rgba(156,224,138,0.06)"/>
        <rect x="1480" y="436" width="24" height="228" rx="6" fill="url(#gd_tithehall_bronze)" transform="rotate(13 1492 664)"/>` : `
        <rect x="1256" y="256" width="198" height="404" fill="url(#gd_tithehall_stone)" stroke="#1c2718" stroke-width="4"/>
        <line x1="1355" y1="256" x2="1355" y2="660" stroke="#1c2718" stroke-width="5"/>
        <circle cx="1305" cy="352" r="26" fill="none" stroke="#263122" stroke-width="5"/>
        <circle cx="1405" cy="352" r="26" fill="none" stroke="#263122" stroke-width="5"/>
        <rect x="1218" y="426" width="274" height="28" rx="6" fill="url(#gd_tithehall_bronze)" stroke="#5c4418" stroke-width="3"/>
        <rect x="1230" y="418" width="20" height="44" rx="4" fill="#7a5a20"/>
        <rect x="1460" y="418" width="20" height="44" rx="4" fill="#7a5a20"/>`}
      </g>

      <!-- the Scale of Truth -->
      <g>
        <rect x="455" y="548" width="310" height="16" rx="4" fill="url(#gd_tithehall_stone)" stroke="#1c2718" stroke-width="2"/>
        <rect x="470" y="564" width="280" height="106" fill="url(#gd_tithehall_stone)" stroke="#1c2718" stroke-width="3"/>
        <text x="610" y="600" text-anchor="middle" font-size="16" fill="#9fd4a8" opacity="0.7" letter-spacing="3"
          font-family="Palatino Linotype, Georgia, serif">ONE TITHE IS HOLLOW</text>
        <text x="610" y="626" text-anchor="middle" font-size="12" fill="#9fd4a8" opacity="0.45" letter-spacing="2"
          font-family="Palatino Linotype, Georgia, serif">THE SCALE ANSWERS TWICE · PRESENT THE LIE</text>
        ${[488, 560, 632, 704].map(x => `<line x1="${x}" y1="648" x2="${x + 44}" y2="648" stroke="#263122" stroke-width="3"/>`).join('')}
        <rect x="600" y="252" width="20" height="300" rx="5" fill="url(#gd_tithehall_bronze)" stroke="#5c4418" stroke-width="2"/>
        <rect x="440" y="246" width="340" height="10" rx="5" fill="url(#gd_tithehall_bronze)"/>
        <circle cx="610" cy="250" r="12" fill="#d1a53f" stroke="#7a5a20" stroke-width="3"/>
        ${strung && !solved ? '<circle cx="610" cy="250" r="20" fill="none" stroke="rgba(255,224,138,0.35)" stroke-width="2" class="glow"/>' : ''}
        <circle cx="455" cy="251" r="6" fill="#8a6a24"/>
        <circle cx="765" cy="251" r="6" fill="#8a6a24"/>
        <!-- left pan: bronze chains, intact -->
        <line x1="455" y1="257" x2="425" y2="412" stroke="#d1a53f" stroke-width="2.5"/>
        <line x1="455" y1="257" x2="485" y2="412" stroke="#d1a53f" stroke-width="2.5"/>
        <path d="M413 412 Q455 440 497 412" fill="#8a6a24" stroke="#d1a53f" stroke-width="2"/>
        <ellipse cx="455" cy="412" rx="42" ry="6" fill="#d1a53f" opacity="0.8"/>
        ${strung ? `
        <!-- right pan: restrung with vine cord -->
        <line x1="765" y1="257" x2="735" y2="412" stroke="#5aa552" stroke-width="3"/>
        <line x1="765" y1="257" x2="795" y2="412" stroke="#5aa552" stroke-width="3"/>
        <line x1="765" y1="257" x2="765" y2="414" stroke="#5aa552" stroke-width="2.5"/>
        <circle cx="765" cy="260" r="4" fill="#3f7a37"/>
        <path d="M723 412 Q765 440 807 412" fill="#8a6a24" stroke="#d1a53f" stroke-width="2"/>
        <ellipse cx="765" cy="412" rx="42" ry="6" fill="#d1a53f" opacity="0.8"/>` : `
        <!-- right pan: snapped cord, dish fallen on the plinth -->
        <path d="M765 257 Q770 278 762 300" stroke="#8a6a24" stroke-width="3" fill="none"/>
        <path d="M762 300 L756 312 M762 300 L765 314 M762 300 L770 310" stroke="#8a6a24" stroke-width="2"/>
        <g class="beckon">
          <ellipse cx="700" cy="542" rx="40" ry="9" fill="#8a6a24" stroke="#d1a53f" stroke-width="2" transform="rotate(-9 700 542)"/>
          <path d="M668 534 Q660 522 666 510" stroke="#8a6a24" stroke-width="2.5" fill="none"/>
        </g>`}
      </g>

      <!-- the offering table -->
      <g>
        <rect x="830" y="626" width="620" height="22" rx="6" fill="url(#gd_tithehall_wood)" stroke="#2a1e14" stroke-width="3"/>
        <rect x="842" y="648" width="596" height="58" fill="#4a3626" stroke="#2a1e14" stroke-width="3"/>
        <rect x="856" y="706" width="26" height="82" fill="#3a2a1c"/>
        <rect x="1398" y="706" width="26" height="82" fill="#3a2a1c"/>
        ${PODX.map((x, i) => `<text x="${x}" y="684" text-anchor="middle" font-size="16" fill="#e4f0d0" opacity="0.7"
          font-family="Palatino Linotype, Georgia, serif">${ROMAN[i]}</text>`).join('')}
        ${solved
          ? PODX.map(x => `<ellipse cx="${x}" cy="637" rx="20" ry="8" fill="#0b140c" stroke="#2a1e14" stroke-width="2"/>`).join('')
          : PODX.map(x => `
          <g>
            <ellipse cx="${x}" cy="602" rx="19" ry="25" fill="url(#gd_tithehall_pod)" stroke="#8a6a24" stroke-width="2"/>
            <path d="M${x - 8} 584 Q${x - 13} 602 ${x - 8} 620 M${x + 8} 584 Q${x + 13} 602 ${x + 8} 620" stroke="#8a6a24" stroke-width="1.5" fill="none" opacity="0.8"/>
            <ellipse cx="${x - 6}" cy="590" rx="3" ry="6" fill="#ffe08a" opacity="0.5"/>
            <circle cx="${x}" cy="576" r="2.5" fill="#5aa552"/>
          </g>`).join('')}
        ${tokenHere ? `
        <g class="beckon">
          <circle cx="865" cy="608" r="17" fill="#6b4f37" stroke="#d1a53f" stroke-width="2.5"/>
          <path d="M855 597 L858 589 L862 596 M868 596 L872 589 L875 597" stroke="#d1a53f" stroke-width="2" fill="none"/>
          <circle cx="859" cy="603" r="1.6" fill="#ffe08a"/>
          <circle cx="871" cy="603" r="1.6" fill="#ffe08a"/>
          <text x="865" y="619" text-anchor="middle" font-size="11" fill="#ffe08a" font-family="Palatino Linotype, Georgia, serif">A</text>
        </g>` : ''}
        ${compassHere ? `
        <g class="beckon">
          <circle cx="1385" cy="606" r="15" fill="url(#gd_tithehall_bronze)" stroke="#5c4418" stroke-width="2"/>
          <circle cx="1385" cy="606" r="9" fill="#e4f0d0"/>
          <path d="M1385 599 L1388 606 L1385 613 L1382 606 Z" fill="#8a2f2f"/>
        </g>` : ''}
      </g>

      <!-- older offerings, front-left -->
      <g>
        <path d="M240 788 Q246 830 320 830 Q394 830 400 788 L390 758 L250 758 Z" fill="url(#gd_tithehall_wood)" stroke="#2a1e14" stroke-width="3"/>
        <path d="M252 776 Q320 792 388 776 M248 796 Q320 812 392 796" stroke="#2a1e14" stroke-width="2" fill="none" opacity="0.8"/>
        ${[0, 72, 144, 216, 288].map(a => `<ellipse cx="${282 + 9 * Math.cos(a * Math.PI / 180)}" cy="${746 + 9 * Math.sin(a * Math.PI / 180)}" rx="7" ry="4" fill="#c96fb0" opacity="0.85" transform="rotate(${a} ${282 + 9 * Math.cos(a * Math.PI / 180)} ${746 + 9 * Math.sin(a * Math.PI / 180)})"/>`).join('')}
        <circle cx="282" cy="746" r="3.5" fill="#ffe08a"/>
        <path d="M336 754 Q356 730 372 736 Q360 752 340 758 Z" fill="#d1a53f" opacity="0.9"/>
        <path d="M344 752 Q360 736 368 738" stroke="#9fd4a8" stroke-width="1.5" fill="none"/>
        <circle cx="314" cy="754" r="6" fill="#9fd4a8" opacity="0.9"/>
      </g>

      <!-- ground fog -->
      <ellipse cx="420" cy="852" rx="430" ry="44" fill="rgba(159,212,168,0.06)" class="fog"/>
      <ellipse cx="1180" cy="872" rx="480" ry="50" fill="rgba(159,212,168,0.05)" class="fog reverse"/>

      <!-- the canopy light-shaft, and its pool on the floor -->
      <polygon points="640,10 880,10 700,668 420,668" fill="rgba(159,212,168,0.10)" class="moonbeam"/>
      <ellipse cx="560" cy="668" rx="220" ry="34" fill="url(#gd_tithehall_pool)"/>

      <!-- firefly motes -->
      <g class="tithehall-mote"><circle cx="382" cy="520" r="4" fill="#ffe08a" class="glow fast"/></g>
      <g class="tithehall-mote" style="animation-delay: -3.2s"><circle cx="1012" cy="452" r="3.5" fill="#ffe08a" class="glow fast"/></g>
      <g class="tithehall-mote" style="animation-delay: -5.6s"><circle cx="1196" cy="712" r="4" fill="#ffe08a" class="glow fast"/></g>

      <path d="M0 900 L0 856 Q800 902 1600 856 L1600 900 Z" fill="#070d08"/>
    </svg>`;
  },

  hotspots(state) {
    const solved = !!state.flags.tithehall_solved;
    const spots = [];

    spots.push({
      id: 'scale', x: 430, y: 252, w: 350, h: 292, label: 'The Scale of Truth',
      onInteract(game) {
        if (game.getFlag('tithehall_solved')) {
          game.say('The Scale rests level above the emptied table, swaying by a hair, like something breathing in its sleep. It has said its two words and it will not be saying more.');
          return;
        }
        if (!game.getFlag('tithehall_scaleStrung')) {
          if (game.selectedItem === 'vine_cord') {
            game.useSelected();
            game.setFlag('tithehall_scaleStrung');
            game.playSfx('creak');
            game.say('You braid the vine cord through the pan\'s bronze rings — ferry-knots, the only kind you still trust — and the pan swings level for the first time in a long century. The whole scale seems to inhale.');
            game.refreshScene();
          } else {
            game.say('Bronze gone green with patience. One pan hangs true; the other lies on the plinth, its cord snapped to frayed whiskers. Gus: "The Scale of Truth will not testify one-handed, counsel. It wants cordage."');
          }
          return;
        }
        openScaleRite(game);
      },
    });

    spots.push({
      id: 'law', x: 465, y: 552, w: 290, h: 122, label: 'The carved law',
      onInteract(game) {
        const html = `<div class="leaf-tablet carved"><div class="leaf-title">The Law of the Tithe</div>
          "One tithe among the eight is hollow — gold over air, lighter than truth. The Scale answers
          TWICE, then sleeps. Each time the rite begins anew, unseen hands re-lay the tithe. The Court
          hears no accusation before the Scale has spoken. Present the lie."</div>`;
        game.journal.add('note_tithelaw', { title: 'The Law of the Tithe (Tithe Hall)', category: 'note', html });
        game.dialog({ title: 'The Carved Law', html });
      },
    });

    spots.push({
      id: 'tithes', x: 902, y: 560, w: 400, h: 108, label: solved ? 'The emptied table' : 'The eight golden tithes',
      onInteract(game) {
        if (game.getFlag('tithehall_solved')) {
          game.say('Eight carved sockets where the tithes sat. Seven pods sank into the stone the moment the lie left the table — accepted, presumably, wherever tithes go.');
          return;
        }
        const html = `<div class="leaf-tablet"><div class="leaf-title">The Eight Tithes (Tithe Hall)</div>
          Eight golden cacao pods, each above its carved tally — <strong>I through VIII</strong>.
          Identical to the eye, identical to the fingertip. You heft two and your hands learn nothing;
          the difference the law promises is too fine for flesh. <em>Only the Scale can taste it.</em></div>`;
        game.journal.add('note_tithes', { title: 'The eight tithes (Tithe Hall)', category: 'note', html });
        game.dialog({ title: 'The Offering Table', html });
      },
    });

    if (!state.flags.tithehall_tokenTaken) {
      spots.push({
        id: 'token6', x: 808, y: 570, w: 92, h: 92, label: 'A carved wood disc',
        onInteract(game) {
          if (game.journal.has('token6')) return;
          game.setFlag('tithehall_tokenTaken');
          game.journal.add('token6', { title: 'Court token — the ocelot', category: 'sun', sun: { creature: 'ocelot', letter: 'A' } });
          game.say('Among the offerings, a small carved disc: the shadow-cat\'s face, and beneath it a single letter — A. It goes into the field journal with the weight of something official.');
          game.refreshScene();
        },
      });
    }

    if (!state.flags.tithehall_compassTaken) {
      spots.push({
        id: 'vance_compass', x: 1338, y: 562, w: 96, h: 94, label: 'A brass compass among the offerings',
        onInteract(game) {
          game.setFlag('tithehall_compassTaken');
          game.journal.add('note_vance', {
            title: 'Vance\'s compass (Tithe Hall)', category: 'note',
            html: `<div class="leaf-tablet"><div class="leaf-title">Among the Offerings</div>
              A brass surveyor's compass, engraved <strong>T. VANCE — 1911</strong>. The Ashford
              concession's founding survey — the one that was never filed, by the surveyor who was
              never found. Its needle is dead still. <em>So, you notice, is yours.</em></div>`,
          });
          game.addItem('vance_compass', { from: { x: 1385, y: 606 } });
          game.say('You pocket the dead man\'s compass. It feels less like theft than like inheritance. Gus turns the name over like a stone: "My predecessor\'s client. Keep it, counsel — the Court remembers its docket."');
          game.refreshScene();
        },
      });
    }

    spots.push({
      id: 'door', x: 1240, y: 250, w: 225, h: 300, label: solved ? 'The unbarred door' : 'The barred door',
      onInteract(game) {
        if (!game.getFlag('tithehall_solved')) {
          game.say('A door built for something that does not knock, barred with a bronze beam thicker than your leg. Above it, an ocelot is carved mid-yawn. The hall is holding its breath until the lie is presented — the bar makes that clear without moving at all.');
          return;
        }
        if (!game.journal.has('token6')) {
          game.say('Gus swings onto the doorframe, polite and immovable. "The ocelot\'s token still sits on that table, and the Court counts what leaves this hall. Your testimony is incomplete, counsel — fetch it."');
          return;
        }
        if (!game.hasItem('vance_compass')) {
          game.say('Gus does not move from the threshold. "There is a dead man\'s compass on that table with your profession engraved on it. The docket says it comes with us. Trust your advocate."');
          return;
        }
        if (!game.hasItem('hollow_pod')) {
          game.say('Gus flicks his tail toward the table. "The lie is evidence, counsel, and evidence travels with the advocate\'s office. Which is to say: your satchel."');
          return;
        }
        game.say('The unbarred door swings on hinges the size of your forearm — onto firefly-lit dark, and the sound of a very large, very patient audience settling in.');
        game.completeRoom({ delay: 700 });
      },
    });

    spots.push({
      id: 'breach', x: 600, y: 20, w: 280, h: 165, label: 'The canopy breach',
      onInteract(game) {
        game.say('Far overhead the canopy is torn just enough to let one shaft of dusk lean into the hall. Motes ride it like they paid for seats. Somewhere up there is the sky you fell out of.');
      },
    });

    spots.push({
      id: 'frieze', x: 305, y: 148, w: 240, h: 90, label: 'The tithe frieze',
      onInteract(game) {
        game.say('A wall carving: animals in procession, each bearing a pod to the table — jaguar, tapir, ocelot, down to a mantis dragging one twice its size. Every tithe accounted for. The Court has always kept books.');
      },
    });

    spots.push({
      id: 'offerings', x: 230, y: 705, w: 180, h: 120, label: 'Older offerings',
      onInteract(game) {
        game.say('Older offerings crowd a basket by the wall: orchids gone papery, banded feathers, a jade bead worn smooth. Nothing here was cheap for whoever carried it in. The Court does not appraise — it remembers.');
      },
    });

    return spots;
  },

  hintContext(state) {
    return state.flags.tithehall_scaleStrung ? 'weigh' : 'string';
  },

  hints(state) {
    if (!state.flags.tithehall_scaleStrung) {
      return [
        { text: 'A scale with one pan is just a gallows for fruit.', cost: 60 },
        { text: 'The snapped cord wants cordage. You have carried some since the pool.', cost: 120 },
        { text: 'The vine cord, on the broken pan.', cost: 240 },
      ];
    }
    return [
      { text: 'Eight pods, two questions, and the tithe re-laid whenever the rite restarts. Split them so every answer teaches you something.', cost: 60 },
      { text: 'Three against three: balance means the lie waits in the two you held back; a tilt means it hides on the LIGHTER side. Then one against one.', cost: 120 },
      { text: 'Three against three, then one against one of the lighter group — and if those two balance, it is the third. The Scale never needs a third answer.', cost: 240 },
    ];
  },
};

// ---------------------------------------------------------------------------
// The rite of the Scale. Persistent: tithehall_riteCount (int), tithehall_solved.
// Weighing state and pan placements are modal-local; every rite-start re-lays
// the hollow pod as SEQ[riteCount % 8] and increments riteCount.
// ---------------------------------------------------------------------------
function openScaleRite(game) {
  game.openPuzzle({
    id: 'tithehall_scale',
    title: 'The Scale of Truth',
    wide: true,
    render(body, api) {
      let hollow = 0;        // tally number of the hollow pod, this rite
      let weighsLeft = 2;
      let weighed = false;   // at least one weighing this rite
      let accuseMode = false;
      let accused = 0;
      let placements = {};

      body.innerHTML = `
        <style>
          #th-pods { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
          .th-tile { width: 66px; padding: 8px 4px; text-align: center; cursor: pointer; user-select: none; }
          .th-tally { font-size: 20px; font-weight: 700; font-family: "Palatino Linotype", Georgia, serif; }
          .th-where { font-size: 10px; opacity: 0.7; letter-spacing: 0.08em; text-transform: uppercase; margin-top: 3px; }
          .th-tile.th-onpan .th-where { color: #ffe08a; opacity: 1; }
          .th-tile.th-accuse { outline: 2px solid #c96fb0; }
          #th-beam, .th-pan { transition: transform 0.9s cubic-bezier(0.25, 0.9, 0.35, 1.12); }
        </style>
        <p class="puzzle-desc">Eight tithes; one is gold over air. The Scale answers <strong>twice</strong>,
          then sleeps — and whenever the rite begins anew, unseen hands re-lay the lie. Click a tithe to
          move it: table, left pan, right pan. When you are certain, present the lie to the Court.</p>
        <div class="puzzle-row">
          <svg viewBox="0 0 560 250" width="100%" style="max-width: 520px" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="gd_tithehall_mpod" cx="0.35" cy="0.3" r="1">
                <stop offset="0" stop-color="#ffe08a"/><stop offset="1" stop-color="#a07c2c"/>
              </radialGradient>
            </defs>
            <rect x="245" y="230" width="70" height="12" rx="4" fill="#7a5a20"/>
            <rect x="272" y="60" width="16" height="172" rx="5" fill="#a07c2c"/>
            <g id="th-beam" style="transform-origin: 280px 56px;">
              <rect x="110" y="51" width="340" height="9" rx="4" fill="#d1a53f"/>
              <circle cx="120" cy="56" r="5" fill="#8a6a24"/><circle cx="440" cy="56" r="5" fill="#8a6a24"/>
            </g>
            <circle cx="280" cy="56" r="9" fill="#d1a53f" stroke="#7a5a20" stroke-width="2"/>
            <g id="th-panL" class="th-pan">
              <line x1="120" y1="58" x2="94" y2="152" stroke="#d1a53f" stroke-width="2"/>
              <line x1="120" y1="58" x2="146" y2="152" stroke="#d1a53f" stroke-width="2"/>
              <g id="th-podsL"></g>
              <path d="M86 152 Q120 180 154 152" fill="#8a6a24" stroke="#d1a53f" stroke-width="2"/>
            </g>
            <g id="th-panR" class="th-pan">
              <line x1="440" y1="58" x2="414" y2="152" stroke="#5aa552" stroke-width="2.5"/>
              <line x1="440" y1="58" x2="466" y2="152" stroke="#5aa552" stroke-width="2.5"/>
              <g id="th-podsR"></g>
              <path d="M406 152 Q440 180 474 152" fill="#8a6a24" stroke="#d1a53f" stroke-width="2"/>
            </g>
          </svg>
        </div>
        <div class="puzzle-row" id="th-pods"></div>
        <div class="puzzle-row">
          <button class="btn btn-primary" id="th-weigh"></button>
          <button class="btn" id="th-present"></button>
          <button class="btn" id="th-anew">Begin the rite anew</button>
        </div>
        <div class="puzzle-row" id="th-confirm" style="display: none; align-items: center; gap: 10px;">
          <span id="th-accusal" style="font-style: italic;"></span>
          <button class="btn btn-primary" id="th-yes">Present it</button>
          <button class="btn" id="th-no">Recant</button>
        </div>
        <div class="puzzle-feedback"></div>`;

      const $ = sel => body.querySelector(sel);
      const inPan = side => Object.keys(placements).map(Number).filter(p => placements[p] === side);
      const panWeight = side => inPan(side).reduce((sum, p) => sum + (p === hollow ? 7 : 10), 0);

      const setPose = (angle, dy) => {
        $('#th-beam').style.transform = `rotate(${angle}deg)`;
        $('#th-panL').style.transform = `translateY(${dy}px)`;
        $('#th-panR').style.transform = `translateY(${-dy}px)`;
      };

      const drawPanPods = () => {
        [['left', '#th-podsL', 120], ['right', '#th-podsR', 440]].forEach(([side, sel, cx]) => {
          const pods = inPan(side);
          const gap = pods.length > 4 ? 13 : 20;
          $(sel).innerHTML = pods.map((p, i) => {
            const x = cx - ((pods.length - 1) * gap) / 2 + i * gap;
            return `<circle cx="${x}" cy="148" r="9" fill="url(#gd_tithehall_mpod)" stroke="#8a6a24"/>
              <text x="${x}" y="151" text-anchor="middle" font-size="8" font-weight="700" fill="#4a3626">${ROMAN[p - 1]}</text>`;
          }).join('');
        });
      };

      const drawTiles = () => {
        const row = $('#th-pods');
        row.innerHTML = '';
        for (let p = 1; p <= 8; p++) {
          const where = placements[p];
          const tile = document.createElement('div');
          tile.className = 'tile th-tile' + (where !== 'table' ? ' th-onpan' : '') + (accuseMode ? ' th-accuse' : '');
          tile.innerHTML = `<div class="th-tally">${ROMAN[p - 1]}</div>
            <div class="th-where">${where === 'table' ? 'table' : where + ' pan'}</div>`;
          tile.addEventListener('click', () => onPod(p));
          row.appendChild(tile);
        }
        drawPanPods();
      };

      const drawButtons = () => {
        const weighBtn = $('#th-weigh');
        weighBtn.textContent = weighsLeft === 2 ? 'Weigh — two answers remain'
          : weighsLeft === 1 ? 'Weigh — one answer remains' : 'The Scale sleeps';
        weighBtn.disabled = weighsLeft === 0;
        $('#th-present').textContent = accuseMode ? 'Recant' : 'Present the lie';
        $('#th-present').disabled = !weighed;
      };

      const hideConfirm = () => { $('#th-confirm').style.display = 'none'; accused = 0; };

      // Every rite-start re-lays the tithe and spends one count, forever.
      const startRite = () => {
        const count = Number(game.getFlag('tithehall_riteCount')) || 0;
        hollow = SEQ[count % 8];
        game.setFlag('tithehall_riteCount', count + 1);
        weighsLeft = 2; weighed = false; accuseMode = false;
        placements = {};
        for (let p = 1; p <= 8; p++) placements[p] = 'table';
        setPose(0, 0); hideConfirm(); drawTiles(); drawButtons();
      };

      const onPod = p => {
        if (accuseMode) {
          accused = p;
          $('#th-accusal').textContent = `Present tithe ${ROMAN[p - 1]} as the lie?`;
          $('#th-confirm').style.display = 'flex';
          game.playSfx('click');
          return;
        }
        placements[p] = placements[p] === 'table' ? 'left' : placements[p] === 'left' ? 'right' : 'table';
        setPose(0, 0);
        game.playSfx('click');
        drawTiles();
      };

      $('#th-weigh').addEventListener('click', () => {
        if (weighsLeft <= 0) return;
        weighsLeft -= 1; weighed = true;
        const lw = panWeight('left'), rw = panWeight('right');
        const nothingAboard = !inPan('left').length && !inPan('right').length;
        if (lw === rw) { setPose(0, 0); game.playSfx('bell'); }
        else if (lw > rw) { setPose(-7, 20); game.playSfx('creak'); }
        else { setPose(7, -20); game.playSfx('creak'); }
        api.setFeedback(nothingAboard
          ? 'The empty pans hang level. The Scale answers what it is asked — and that was one of your two.'
          : lw === rw ? 'The beam settles dead level.'
            : `The ${lw < rw ? 'left' : 'right'} pan rises — lighter than what it faces.`, '');
        drawButtons();
      });

      $('#th-present').addEventListener('click', () => {
        if (!weighed) return;
        accuseMode = !accuseMode;
        if (!accuseMode) hideConfirm();
        api.setFeedback(accuseMode ? 'Point to the tithe you accuse.' : '', '');
        drawTiles(); drawButtons();
      });

      $('#th-anew').addEventListener('click', () => {
        game.playSfx('page');
        startRite();
        api.setFeedback('Unseen hands pass over the table. The tithe is re-laid; the Scale wakes.', '');
      });

      $('#th-no').addEventListener('click', () => { hideConfirm(); game.playSfx('click'); });

      $('#th-yes').addEventListener('click', () => {
        if (!accused) return;
        if (accused === hollow) {
          game.setFlag('tithehall_solved');
          game.addItem('hollow_pod', { from: { x: 1095, y: 602 } });
          game.journal.add('tithehall_verdict', {
            title: 'The Scale\'s verdict (Tithe Hall)', category: 'note',
            html: `<div class="leaf-tablet"><div class="leaf-title">The Scale's Verdict</div>
              Two honest answers were enough. The hollow tithe — <strong>gold over air, lighter than
              truth</strong> — stands found. The seven true pods sank into the offering table as one,
              and the far door is unbarred. The lie stays in your satchel, <em>kept as evidence</em>.</div>`,
          });
          api.solved({ message: `You set tithe ${ROMAN[accused - 1]} before the Court, and the hall exhales. The seven true pods sink into the stone as one; across the hall the great bar lifts of its own weight. Gus, quietly: "Counsel presents the lie. The Court accepts. THAT is how testimony is done."` });
          game.refreshScene();
        } else {
          startRite();
          api.fail('The hall goes very quiet. The Court does not blink. Unseen hands re-lay the tithe.');
        }
      });

      startRite();
    },
  });
}
