// TRIAL 3 — The Painted Grove. Territory BORDER SURGERY: the clan marks are
// fixed; you redraw the borders. Five grounds: CROWN(tree-frog, center),
// RIVER(jaguar), HEIGHTS(tapir), FERN(macaw), SCAR(tapir). The Crown's four
// borders are fixed. Six toggleable segments: ring (River-Heights, Heights-Fern,
// Fern-Scar, Scar-River) + cross-passes (Heights-Scar, River-Fern).
// Laws: A no clan borders its own mark; C macaw never borders jaguar; D each
// outer ground keeps exactly 3 neighbors (Crown binds to all).
// Solution: all four ring segments RAISED, both cross-passes RAZED. Unique.
// Produces: ochre_pot. Token 3 (TREE-FROG, "O") on the pigment shelf.

import { registerItems } from '../../../shared/js/items.js';

registerItems({
  ochre_pot: {
    name: 'Ochre Pigment Pot',
    description: 'A sealed gourd of red ochre, ground fine and mixed with tree-gum — the deep rust the grove uses to paint its laws. It would take a mark, or seal one. It smells of iron and old ceremony.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 18 Q12 40 24 42 Q36 40 34 18 Z" fill="#a3541f" stroke="#5c2e0e" stroke-width="2"/>
      <ellipse cx="24" cy="18" rx="10" ry="4" fill="#7d3a12" stroke="#5c2e0e" stroke-width="1.5"/>
      <path d="M18 26 Q24 30 30 26" stroke="#c97a3a" stroke-width="1.6" fill="none" opacity="0.8"/>
      <ellipse cx="24" cy="14" rx="6" ry="3" fill="#4a3626"/>
      <circle cx="20" cy="34" r="2" fill="#c97a3a" opacity="0.7"/>
    </svg>`,
  },
});

// ground -> clan mark (fixed, painted)
const MARK = { crown: 'tree-frog', river: 'jaguar', heights: 'tapir', fern: 'macaw', scar: 'tapir' };
const GROUND_NAME = { crown: 'CANOPY CROWN', river: 'RIVER', heights: 'KAPOK HEIGHTS', fern: 'FERN DEEP', scar: 'STONE SCAR' };

// toggleable segments: key -> [groundA, groundB]. rh/hf/fs/sr = ring; hs/rf = cross-passes.
const SEG = {
  rh: ['river', 'heights'], hf: ['heights', 'fern'], fs: ['fern', 'scar'], sr: ['scar', 'river'],
  hs: ['heights', 'scar'], rf: ['river', 'fern'],
};
// Crown's four fixed borders (always raised)
const CROWN_BORDERS = ['river', 'heights', 'fern', 'scar'];
const WAR_MAP = { rh: true, hf: false, fs: true, sr: false, hs: true, rf: true };
const SOLUTION = { rh: true, hf: true, fs: true, sr: true, hs: false, rf: false };

function segsFrom(flags) {
  const raw = flags && flags.paintedgrove_segs;
  if (typeof raw === 'string' && /^[01]{6}$/.test(raw)) {
    const keys = ['rh', 'hf', 'fs', 'sr', 'hs', 'rf'];
    const o = {};
    keys.forEach((k, i) => { o[k] = raw[i] === '1'; });
    return o;
  }
  return { ...WAR_MAP };
}
function segsToStr(s) { return ['rh', 'hf', 'fs', 'sr', 'hs', 'rf'].map(k => s[k] ? '1' : '0').join(''); }

// neighbours of a ground under a given segment state (includes fixed Crown links)
function neighbours(g, s) {
  const n = new Set();
  if (g === 'crown') { CROWN_BORDERS.forEach(x => n.add(x)); return n; }
  n.add('crown'); // every outer ground borders the Crown (fixed)
  for (const [k, [a, b]] of Object.entries(SEG)) {
    if (!s[k]) continue;
    if (a === g) n.add(b);
    if (b === g) n.add(a);
  }
  return n;
}

export default {
  id: 'paintedgrove',
  title: 'The Painted Grove',
  intro: 'The stairs bring you up into a colonnade of painted trunks, every one daubed with clan-marks in ochre and green, and at the heart of them a great slab of bark stands on a stone easel — a map of the valley, cut into five grounds, its borders drawn in boundary-stones that someone, long ago, arranged into a quarrel.',

  scene(state) {
    const solved = !!state.flags.paintedgrove_solved;
    const potHere = !state.flags.paintedgrove_potTaken;
    const tokenHere = !(state.journal || []).some(e => e.id === 'token3');

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gd_grove_air" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#0e1c12"/>
          <stop offset="0.5" stop-color="#16281a"/>
          <stop offset="1" stop-color="#223a26"/>
        </linearGradient>
        <linearGradient id="gd_grove_floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#1d301f"/>
          <stop offset="1" stop-color="#070d08"/>
        </linearGradient>
        <linearGradient id="gd_grove_trunk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#2c2014"/>
          <stop offset="0.5" stop-color="#4a3626"/>
          <stop offset="1" stop-color="#2c2014"/>
        </linearGradient>
        <linearGradient id="gd_grove_bark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#7a5f3c"/>
          <stop offset="1" stop-color="#5a4428"/>
        </linearGradient>
        <linearGradient id="gd_grove_beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="rgba(159,212,168,0.26)"/>
          <stop offset="1" stop-color="rgba(159,212,168,0)"/>
        </linearGradient>
      </defs>
      <style>
        @keyframes grove_spore1 { 0%,100% { transform: translate(0,0);} 50% { transform: translate(16px,-22px);} }
        @keyframes grove_spore2 { 0%,100% { transform: translate(0,0);} 50% { transform: translate(-18px,-14px);} }
      </style>

      <rect width="1600" height="660" fill="url(#gd_grove_air)"/>
      <rect y="660" width="1600" height="240" fill="url(#gd_grove_floor)"/>

      <!-- painted trunks in a colonnade -->
      ${[120, 300, 1300, 1490].map((x, i) => `
        <g>
          <rect x="${x}" y="90" width="72" height="640" rx="10" fill="url(#gd_grove_trunk)"/>
          <path d="M${x + 12} 120 Q${x - 4} 380 ${x + 16} 640" stroke="#2c2014" stroke-width="4" fill="none" opacity="0.6"/>
          <g fill="none" stroke="${['#c96fb0', '#5aa552', '#d1a53f', '#c0392b'][i]}" stroke-width="4" opacity="0.8">
            <circle cx="${x + 36}" cy="${260 + i * 30}" r="16"/>
            <path d="M${x + 22} ${320 + i * 20} q14 -10 28 0"/>
          </g>
        </g>`).join('')}

      <!-- the canopy light-shaft onto the easel -->
      <polygon points="640,10 960,10 1040,700 560,700" fill="url(#gd_grove_beam)" class="moonbeam"/>

      <!-- the two clan murals, upper wall (fixed marks; hotspot area kept clear of top-left) -->
      <g>
        <rect x="470" y="120" width="300" height="120" rx="8" fill="#2e3a2c" stroke="#070d08" stroke-width="3" opacity="0.9"/>
        <text x="620" y="146" text-anchor="middle" font-size="13" fill="#9fb37e" letter-spacing="2"
          font-family="Palatino Linotype, Georgia, serif">THE GROUNDS AND THEIR MARKS</text>
        ${[['CROWN', 'tree-frog', '#5aa552'], ['RIVER', 'jaguar', '#d1a53f'], ['HEIGHTS', 'tapir', '#9fb37e']].map((m, i) =>
          `<text x="${500 + i * 92}" y="180" text-anchor="middle" font-size="11" fill="${m[2]}"
            font-family="Palatino Linotype, Georgia, serif">${m[0]}</text>
           <text x="${500 + i * 92}" y="200" text-anchor="middle" font-size="10" fill="#c3d3a0" font-style="italic">${m[1]}</text>`).join('')}
        ${[['FERN', 'macaw', '#c0392b'], ['SCAR', 'tapir', '#9fb37e']].map((m, i) =>
          `<text x="${560 + i * 92}" y="224" text-anchor="middle" font-size="11" fill="${m[2]}"
            font-family="Palatino Linotype, Georgia, serif">${m[0]}</text>
           <text x="${560 + i * 92}" y="222" text-anchor="middle" font-size="0">${m[1]}</text>`).join('')}
        <text x="606" y="224" text-anchor="middle" font-size="10" fill="#c3d3a0" font-style="italic">macaw</text>
        <text x="698" y="224" text-anchor="middle" font-size="10" fill="#c3d3a0" font-style="italic">tapir</text>
      </g>

      <!-- the three carved laws on a leaning slab (right) -->
      <g>
        <rect x="1050" y="250" width="210" height="230" rx="8" fill="#2e3a2c" stroke="#070d08" stroke-width="4" transform="rotate(3 1155 365)"/>
        <g transform="rotate(3 1155 365)" fill="#9fb37e" font-family="Palatino Linotype, Georgia, serif" opacity="0.8">
          <text x="1155" y="288" text-anchor="middle" font-size="12" letter-spacing="1">THE LAWS OF GROUND</text>
          <line x1="1075" y1="300" x2="1235" y2="300" stroke="#5aa552" stroke-width="1.5"/>
          <text x="1075" y="330" font-size="11">A · none share a</text>
          <text x="1075" y="348" font-size="11">   neighbour's mark</text>
          <text x="1075" y="384" font-size="11">C · macaw shuns</text>
          <text x="1075" y="402" font-size="11">   the jaguar</text>
          <text x="1075" y="438" font-size="11">D · three neighbours</text>
          <text x="1075" y="456" font-size="11">   each; Crown, all</text>
        </g>
      </g>

      <!-- THE BARK MAP on its easel -->
      <g>
        <path d="M700 720 L740 470 M900 720 L860 470" stroke="#4a3626" stroke-width="14" stroke-linecap="round"/>
        <rect x="640" y="300" width="320" height="300" rx="14" fill="url(#gd_grove_bark)" stroke="#3a2a1c" stroke-width="6"/>
        <rect x="662" y="322" width="276" height="256" rx="10" fill="#2e3a2c" opacity="0.5"/>
        ${solved
          ? `<circle cx="800" cy="450" r="34" fill="#3f7a37" opacity="0.6"/>
             <text x="800" y="360" text-anchor="middle" font-size="13" fill="#9ce08a" class="flicker"
               font-family="Palatino Linotype, Georgia, serif">the grove is at peace</text>
             ${['#d1a53f', '#9fb37e', '#c0392b', '#9fb37e'].map((c, i) => {
               const a = (i / 4) * Math.PI * 2 - Math.PI / 2;
               return `<circle cx="${800 + Math.cos(a) * 84}" cy="${450 + Math.sin(a) * 78}" r="20" fill="${c}" opacity="0.5"/>`;
             }).join('')}`
          : `<text x="800" y="356" text-anchor="middle" font-size="12" fill="#c0392b" opacity="0.8"
               font-family="Palatino Linotype, Georgia, serif">the war map</text>
             <circle cx="800" cy="452" r="26" fill="#3f7a37" opacity="0.5"/>
             ${['#d1a53f', '#9fb37e', '#c0392b', '#9fb37e'].map((c, i) => {
               const a = (i / 4) * Math.PI * 2 - Math.PI / 2;
               return `<circle cx="${800 + Math.cos(a) * 78}" cy="${452 + Math.sin(a) * 74}" r="18" fill="${c}" opacity="0.45"/>`;
             }).join('')}
             <path d="M726 400 L874 504 M726 504 L874 400" stroke="#c0392b" stroke-width="3" opacity="0.5" stroke-dasharray="6 5"/>`}
      </g>

      <!-- the pigment shelf (left of the easel) -->
      <g>
        <rect x="360" y="560" width="200" height="18" rx="5" fill="#4a3626" stroke="#2c2014" stroke-width="3"/>
        <rect x="372" y="500" width="180" height="62" rx="6" fill="#3a2a1c" opacity="0.7"/>
        ${[400, 448, 496].map((x, i) => `
          <path d="M${x - 12} 520 Q${x - 14} 556 ${x} 558 Q${x + 14} 556 ${x + 12} 520 Z"
            fill="${['#5aa552', '#d1a53f', '#c96fb0'][i]}" stroke="#2c2014" stroke-width="2"/>
          <ellipse cx="${x}" cy="520" rx="12" ry="4" fill="#2c2014"/>`).join('')}
        ${potHere ? `
        <g class="beckon">
          <path d="M528 516 Q526 556 540 558 Q554 556 552 516 Z" fill="#a3541f" stroke="#5c2e0e" stroke-width="2"/>
          <ellipse cx="540" cy="516" rx="12" ry="4" fill="#7d3a12"/>
        </g>` : ''}
        ${tokenHere ? `
        <g class="beckon">
          <circle cx="392" cy="588" r="16" fill="#6b4f37" stroke="#d1a53f" stroke-width="2.5"/>
          <ellipse cx="392" cy="590" rx="8" ry="6" fill="none" stroke="#ffe08a" stroke-width="1.6"/>
          <circle cx="387" cy="585" r="2.5" fill="none" stroke="#ffe08a" stroke-width="1.4"/>
          <circle cx="397" cy="585" r="2.5" fill="none" stroke="#ffe08a" stroke-width="1.4"/>
          <text x="392" y="612" text-anchor="middle" font-size="11" fill="#ffe08a" font-family="Palatino Linotype, Georgia, serif">O</text>
        </g>` : ''}
      </g>

      <!-- pigment-stained handprint, far too old (flavor) -->
      <g opacity="0.4">
        <path d="M1350 560 q-6 -18 4 -22 q4 10 2 18 M1360 556 q0 -20 8 -20 q2 12 -2 20 M1372 558 q4 -18 12 -14 q0 12 -6 18 M1344 566 q-12 -6 -12 2 q8 4 14 2 M1348 560 Q1360 590 1378 566 Z"
          fill="#a3541f"/>
      </g>

      <!-- fireflies + spores -->
      <g style="animation: grove_spore1 12s ease-in-out infinite"><circle cx="500" cy="380" r="3.5" fill="#ffe08a" class="glow fast"/></g>
      <g style="animation: grove_spore2 14s ease-in-out infinite"><circle cx="1080" cy="600" r="4" fill="#ffe08a" class="glow fast"/></g>
      <g style="animation: grove_spore1 11s ease-in-out infinite; animation-delay:-4s"><circle cx="980" cy="300" r="3" fill="#e4f0d0" opacity="0.6" class="glow fast"/></g>

      <!-- ground fog -->
      <ellipse cx="500" cy="850" rx="420" ry="42" fill="rgba(159,212,168,0.06)" class="fog"/>
      <ellipse cx="1150" cy="864" rx="440" ry="46" fill="rgba(159,212,168,0.05)" class="fog reverse"/>

      <path d="M0 900 L0 858 Q800 902 1600 858 L1600 900 Z" fill="#070d08"/>
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const solved = !!state.flags.paintedgrove_solved;

    spots.push({
      id: 'easel', x: 640, y: 300, w: 320, h: 300, label: solved ? 'The bark map, at peace' : 'The bark map',
      onInteract(game) {
        if (game.getFlag('paintedgrove_solved')) {
          game.say('The boundary-stones rest where you set them: every ground at faith with three neighbours, no mark touching its like, the macaw and the jaguar kept a full ground apart. The painted valley holds its breath and, for the first time in a long age, is not arguing.');
          return;
        }
        // first look at the map itself = the foreshadow
        if (!game.journal.has('note_barkmap')) {
          game.journal.add('note_barkmap', {
            title: 'The bark map (Painted Grove)', category: 'note',
            html: `<div class="leaf-tablet"><div class="leaf-title">Field note — the map</div>
              You lean close to the painted valley and your stomach drops: <strong>this is YOUR
              valley.</strong> The same river bend. The same stone scar. The same five grounds you
              spent three days walking — painted here in ochre <em>under moss older than the
              concession itself.</em> Someone mapped Quadrant Nine long before Ashford ever named it.</div>`,
          });
        }
        openBorderPuzzle(game);
      },
    });

    spots.push({
      id: 'murals', x: 470, y: 118, w: 300, h: 124, label: 'The clan murals',
      onInteract(game) {
        const html = `<div class="leaf-tablet"><div class="leaf-title">The grounds and their marks</div>
          The murals name each ground's clan, painted and permanent:<br>
          <strong>Canopy Crown</strong> — the tree-frog.<br>
          <strong>River</strong> — the jaguar.<br>
          <strong>Kapok Heights</strong> — the tapir.<br>
          <strong>Fern Deep</strong> — the macaw.<br>
          <strong>Stone Scar</strong> — the tapir.<br>
          <em>The marks are not in dispute. Only the borders between them are.</em></div>`;
        game.journal.add('note_marks', { title: 'The clan marks (Painted Grove)', category: 'note', html });
        game.dialog({ title: 'The Clan Murals', html });
      },
    });

    spots.push({
      id: 'laws', x: 1050, y: 250, w: 220, h: 240, label: 'The carved laws of ground',
      onInteract(game) {
        const html = `<div class="leaf-tablet carved"><div class="leaf-title">The Laws of Ground</div>
          <strong>Law A.</strong> "No clan abides its neighbour's mark — bordering grounds never share."<br><br>
          <strong>Law C.</strong> "The macaw will not roost beside the jaguar."<br><br>
          <strong>Law D.</strong> "Each ground keeps faith with three neighbours — no more, no fewer.
          The Crown is bound to all."</div>`;
        game.journal.add('note_lawsofground', { title: 'The laws of ground (Painted Grove)', category: 'note', html });
        game.dialog({ title: 'The Laws of Ground', html });
      },
    });

    if (!state.flags.paintedgrove_potTaken) {
      spots.push({
        id: 'ochre', x: 510, y: 500, w: 80, h: 90, label: 'A sealed ochre pot',
        onInteract(game) {
          game.setFlag('paintedgrove_potTaken');
          game.addItem('ochre_pot', { from: { x: 540, y: 536 } });
          game.say('A sealed gourd of red ochre — the pigment the grove paints its laws in. You pocket it. "The colour of oaths and boundary-lines," Gus notes. "It will matter. Most things down here do, eventually and inconveniently."');
          game.refreshScene();
        },
      });
    }

    if (!(state.journal || []).some(e => e.id === 'token3')) {
      spots.push({
        id: 'token3', x: 356, y: 566, w: 74, h: 70, label: 'A disc on the pigment shelf',
        onInteract(game) {
          game.journal.add('token3', { title: 'Court token — the pigment shelf', category: 'sun', sun: { creature: 'tree-frog', letter: 'O' } });
          game.say('Tucked among the pigment pots, a carved disc: a tree-frog\'s wide-eyed face above the letter O. "Exhibit three," says Gus. "The Crown\'s own mark, you\'ll notice. The tree-frog sits at the centre of everything here. Remember that."');
          game.refreshScene();
        },
      });
    }

    spots.push({
      id: 'handprint', x: 1320, y: 540, w: 90, h: 60, label: 'A handprint on the trunk',
      onInteract(game) {
        game.say('A pigment-stained handprint on the bark — ochre gone brown with age, the fingers a little too long, the thumb set a little too wide. Whoever pressed it here painted these laws, and did so a very long time before anyone thought to call this Quadrant Nine.');
      },
    });

    // exit is the parted trunks, available once solved
    spots.push({
      id: 'exit', x: 1280, y: 300, w: 120, h: 380, label: solved ? 'The parted trunks' : 'The colonnade',
      onInteract(game) {
        if (!game.getFlag('paintedgrove_solved')) {
          game.say('The painted trunks stand shoulder to shoulder, and they do not part for a valley still at war with itself. Set the borders right on the bark map and the grove will open the way — grove-logic, but consistent.');
          return;
        }
        if (!game.hasItem('ochre_pot')) {
          game.say('Gus points to the pigment shelf. "The ochre, counsel. The colour of oaths — and you will be swearing one before this is over. Take it."');
          return;
        }
        if (!game.journal.has('token3')) {
          game.say('Gus will not let you pass. "The tree-frog token, on the shelf. The Crown\'s own mark. We do not leave the centre of the argument lying on a shelf, Marlowe."');
          return;
        }
        game.say('With the valley at peace on the bark, two painted trunks lean apart like a held-open door, and beyond them a torchless hall waits, dominated by something tall and toothed.');
        game.completeRoom({ delay: 700 });
      },
    });

    return spots;
  },

  hints: [
    { text: 'The marks are already painted and they are not wrong — the BORDERS are. Boundary-stones between grounds can be raised or razed; the Crown\'s four are fixed.', cost: 60 },
    { text: 'Two laws kill two borders outright: tapir cannot touch tapir (Heights and Scar), and macaw cannot touch jaguar (Fern and River). Raze those crossings. Then make every outer ground count exactly three neighbours.', cost: 120 },
    { text: 'Raze both cross-passes (Heights–Scar and River–Fern) and raise all four ring borders. Then judge it.', cost: 240 },
  ],
};

function openBorderPuzzle(game) {
  game.openPuzzle({
    id: 'paintedgrove_map',
    title: 'The Bark Map',
    wide: true,
    onCleanup() { game.refreshScene(); },
    render(body, api) {
      // node screen positions in a 720x470 board
      const P = {
        crown: [360, 235], river: [360, 66], heights: [612, 235], fern: [360, 404], scar: [108, 235],
      };
      const markColor = { 'tree-frog': '#5aa552', jaguar: '#d1a53f', tapir: '#9fb37e', macaw: '#c0392b' };

      body.innerHTML = `
        <p class="puzzle-desc">The clans are painted and fixed. Redraw the <em>borders</em>: click a
        boundary line to raise it (a border stands) or raze it (the grounds no longer touch). The
        Crown's four borders are carved fast. Obey the three laws, then judge the ground.</p>
        <div class="puzzle-row"><svg id="pg-svg" viewBox="0 0 720 470" width="100%" style="max-width:560px" xmlns="http://www.w3.org/2000/svg"></svg></div>
        <div class="puzzle-row"><button class="btn btn-primary" id="pg-judge">Judge the Ground</button>
          <button class="btn" id="pg-reset">Restore the war map</button></div>
        <div class="puzzle-feedback"></div>`;

      const svg = body.querySelector('#pg-svg');

      // curved cross-pass paths (bow around the Crown)
      const crossPath = {
        hs: `M${P.heights[0]} ${P.heights[1]} Q360 ${P.heights[1] + 120} ${P.scar[0]} ${P.scar[1]}`,
        rf: `M${P.river[0]} ${P.river[1]} Q${P.river[0] + 150} 235 ${P.fern[0]} ${P.fern[1]}`,
      };

      function paint() {
        const s = segsFrom(game.state.flags);
        const line = (x1, y1, x2, y2, on, key) =>
          `<line data-seg="${key}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
             stroke="${on ? '#e8c85a' : '#c0392b'}" stroke-width="${on ? 8 : 4}"
             stroke-dasharray="${on ? '0' : '7 7'}" stroke-linecap="round"
             style="cursor:pointer" opacity="${on ? 0.95 : 0.55}"/>`;
        const crossLine = (key, on) =>
          `<path data-seg="${key}" d="${crossPath[key]}" fill="none"
             stroke="${on ? '#e8c85a' : '#c0392b'}" stroke-width="${on ? 8 : 4}"
             stroke-dasharray="${on ? '0' : '7 7'}" stroke-linecap="round"
             style="cursor:pointer" opacity="${on ? 0.95 : 0.55}"/>`;

        const fixedSpoke = (g) =>
          `<line x1="${P.crown[0]}" y1="${P.crown[1]}" x2="${P[g][0]}" y2="${P[g][1]}"
             stroke="#8a7a44" stroke-width="6" stroke-linecap="round" opacity="0.85"/>`;

        const node = (g) => {
          const [x, y] = P[g];
          const isCrown = g === 'crown';
          return `<g>
            <circle cx="${x}" cy="${y}" r="${isCrown ? 46 : 40}" fill="#2e3a2c" stroke="${markColor[MARK[g]]}" stroke-width="4"/>
            <circle cx="${x}" cy="${y}" r="${isCrown ? 38 : 32}" fill="${markColor[MARK[g]]}" opacity="0.18"/>
            <text x="${x}" y="${y - 4}" text-anchor="middle" font-size="11" fill="#e4f0d0"
              font-family="Palatino Linotype, Georgia, serif" font-weight="700">${GROUND_NAME[g].split(' ').pop()}</text>
            <text x="${x}" y="${y + 12}" text-anchor="middle" font-size="10" fill="${markColor[MARK[g]]}"
              font-family="Palatino Linotype, Georgia, serif" font-style="italic">${MARK[g]}</text>
          </g>`;
        };

        svg.innerHTML = `
          <!-- fixed crown spokes -->
          ${CROWN_BORDERS.map(fixedSpoke).join('')}
          <!-- cross-passes (drawn under ring) -->
          ${crossLine('hs', s.hs)}
          ${crossLine('rf', s.rf)}
          <!-- ring borders -->
          ${line(P.river[0], P.river[1], P.heights[0], P.heights[1], s.rh, 'rh')}
          ${line(P.heights[0], P.heights[1], P.fern[0], P.fern[1], s.hf, 'hf')}
          ${line(P.fern[0], P.fern[1], P.scar[0], P.scar[1], s.fs, 'fs')}
          ${line(P.scar[0], P.scar[1], P.river[0], P.river[1], s.sr, 'sr')}
          <!-- nodes on top -->
          ${['river', 'heights', 'fern', 'scar', 'crown'].map(node).join('')}`;

        svg.querySelectorAll('[data-seg]').forEach(el => {
          el.addEventListener('click', () => {
            const k = el.dataset.seg;
            const cur = segsFrom(game.state.flags);
            cur[k] = !cur[k];
            game.setFlag('paintedgrove_segs', segsToStr(cur));
            game.playSfx('click');
            paint();
          });
        });
      }
      paint();

      body.querySelector('#pg-reset').addEventListener('click', () => {
        game.setFlag('paintedgrove_segs', segsToStr(WAR_MAP));
        game.playSfx('page');
        paint();
        api.setFeedback('The boundary-stones fall back into their old quarrel.', '');
      });

      body.querySelector('#pg-judge').addEventListener('click', () => {
        const s = segsFrom(game.state.flags);
        // Law A: no raised border shares a mark (check ring + cross + fixed crown borders)
        const allBorders = [
          ...Object.entries(SEG).filter(([k]) => s[k]).map(([, pair]) => pair),
          ...CROWN_BORDERS.map(g => ['crown', g]),
        ];
        const shared = allBorders.find(([a, b]) => MARK[a] === MARK[b]);
        if (shared) { api.fail('Two grounds wear one mark across a shared border — the grove stirs, uneasy. No clan abides its neighbour\'s mark.'); return; }
        // Law C: macaw (fern) must not border jaguar (river)
        if (s.rf) { api.fail('The macaw shrieks at the hunter across the line. Fern Deep must not border the River while one wears feathers and the other wears claws.'); return; }
        // Law D: each outer ground exactly 3 neighbours
        const bad = CROWN_BORDERS.find(g => neighbours(g, s).size !== 3);
        if (bad) { api.fail(`${GROUND_NAME[bad]} keeps faith with the wrong number of neighbours — the law asks for three, no more and no fewer.`); return; }

        game.setFlag('paintedgrove_solved');
        game.playSfx('stone');
        game.journal.add('note_grovepeace', {
          title: 'The grove at peace (Painted Grove)', category: 'note',
          html: `<div class="leaf-tablet"><div class="leaf-title">Redrawn</div>
            The borders redrawn: ring raised all round, both cross-passes razed. Every ground keeps
            three neighbours, no mark touches its like, and the macaw and the jaguar are kept a full
            ground apart. <em>You did what a surveyor does — you moved the lines and left the land
            alone. Remember the feeling. You will do it once more, and it will cost more.</em></div>`,
        });
        api.solved({ message: 'You raze the two cross-passes and raise the ring entire, and the whole bark map seems to unclench — boundary-stones settling into a peace they have not known in an age. "Elegantly surveyed," says Gus, with the particular warmth of a professional watching another do the job right. "You redrew the border and never touched the land. Hold onto that. It is the whole trick of the last trial, though I am not supposed to say so."' });
        game.refreshScene();
      });
    },
  });
}
