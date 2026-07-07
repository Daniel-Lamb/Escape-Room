// TRIAL 5 — The Morpho Gallery. Breather: mirror-symmetry mosaic completion.
// The great morpho mosaic's LEFT wing is intact but faded; use the amber lens
// on it to blaze it back (flag morpho_wingRevealed). The RIGHT wing has six
// empty sockets (3 rows x inner/outer); complete it as the left wing's
// reflection. Correct: top-outer azure teardrop, top-inner gold disc,
// mid-outer violet oval, mid-inner azure disc, low-outer gold teardrop,
// low-inner violet disc. Decoys: red disc, green teardrop, azure square.
// Produces: beeswax_lump. Registers the beeswax+ochre -> oath_seal_paste combo
// and the oath_seal_paste item. Token 5 (HARPY, "C") in a mosaic niche.
// Foreshadow: the border procession (humans led in under carved scales).

import { registerItems, registerCombos } from '../../../shared/js/items.js';

registerItems({
  beeswax_lump: {
    name: 'Beeswax Lump',
    description: 'A warm gold knuckle of wild comb-wax, sweet and pliant, still faintly humming with the memory of the hive. It wants to be pressed into the shape of something that matters.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 20 Q10 34 20 40 Q34 42 36 28 Q38 16 26 12 Q16 10 14 20 Z" fill="#e8c85a" stroke="#a8842a" stroke-width="2"/>
      <path d="M20 22 l4 -3 l4 3 l-2 5 l-4 0 z" fill="#c9a227" opacity="0.7"/>
      <path d="M26 30 l3 -2 l3 2 l-1 4 l-4 0 z" fill="#c9a227" opacity="0.6"/>
      <circle cx="18" cy="30" r="2" fill="#fff2c0" opacity="0.8"/>
    </svg>`,
  },
  oath_seal_paste: {
    name: 'Oath-Seal Paste',
    description: 'Beeswax kneaded warm with red ochre until the two are one — the grove\'s sealing-wax, for oaths and boundary-lines. It smells, exactly and unmistakably, like a promise.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 20 Q10 34 20 40 Q34 42 36 28 Q38 16 26 12 Q16 10 14 20 Z" fill="#c97a3a" stroke="#7d3a12" stroke-width="2"/>
      <path d="M18 22 Q24 18 30 22 Q26 28 20 28 Q18 24 18 22 Z" fill="#e8c85a" opacity="0.65"/>
      <circle cx="26" cy="32" r="3" fill="#a3541f"/>
      <circle cx="19" cy="31" r="1.6" fill="#fff2c0" opacity="0.7"/>
    </svg>`,
  },
});

// beeswax + ochre -> oath-seal paste (usable from here on; live game-wide at boot)
registerCombos([
  {
    pair: ['beeswax_lump', 'ochre_pot'],
    onCombine(game) {
      game.removeItem('beeswax_lump');
      game.removeItem('ochre_pot');
      game.addItem('oath_seal_paste', { silent: true });
      game.journal.add('note_oathseal', {
        title: 'Oath-seal paste (made)', category: 'note',
        html: `<div class="leaf-tablet"><div class="leaf-title">Kneaded into one</div>
          Beeswax worked warm with red ochre until they are a single russet paste — the grove's
          sealing-wax. <em>"An oath-seal? You would make a fine notary,"</em> Gus observes.
          <em>"Hold that thought. And the paste."</em></div>`,
      });
      game.say('You knead the ochre into the soft wax until the two will not come apart again — a warm russet paste that smells, exactly, like a promise. "An oath-seal?" says Gus, ears pricking. "You would make a fine notary, Marlowe. Hold that thought. And the paste."');
    },
  },
]);

// solution: socket key -> required tessera id. keys are row(t/m/l)+col(o/i).
const SOCKETS = ['to', 'ti', 'mo', 'mi', 'lo', 'li'];
const SOLUTION = {
  to: 'azure_teardrop', ti: 'gold_disc',
  mo: 'violet_oval',    mi: 'azure_disc',
  lo: 'gold_teardrop',  li: 'violet_disc',
};
const SOCKET_LABEL = {
  to: 'top · outer', ti: 'top · inner', mo: 'mid · outer',
  mi: 'mid · inner', lo: 'low · outer', li: 'low · inner',
};
// tray: the six correct + three decoys
const TRAY = ['azure_teardrop', 'gold_disc', 'violet_oval', 'azure_disc', 'gold_teardrop', 'violet_disc', 'red_disc', 'green_teardrop', 'azure_square'];

const TCOLOR = { azure: '#4a90d9', gold: '#e8c85a', violet: '#9b6fc9', red: '#c0392b', green: '#5aa552' };
function tessera(id, size = 34, flip = false) {
  const [color, shape] = id.split('_');
  const c = TCOLOR[color];
  const t = flip ? `transform="scale(-1,1) translate(-${size},0)"` : '';
  const cx = size / 2, cy = size / 2;
  let body = '';
  if (shape === 'disc') body = `<circle cx="${cx}" cy="${cy}" r="${size * 0.34}" fill="${c}"/>`;
  else if (shape === 'square') body = `<rect x="${cx - size * 0.3}" y="${cy - size * 0.3}" width="${size * 0.6}" height="${size * 0.6}" rx="2" fill="${c}"/>`;
  else if (shape === 'oval') body = `<ellipse cx="${cx}" cy="${cy}" rx="${size * 0.38}" ry="${size * 0.24}" fill="${c}" transform="rotate(-24 ${cx} ${cy})"/>`;
  else body = `<path d="M${cx} ${cy - size * 0.36} Q${cx + size * 0.3} ${cy} ${cx} ${cy + size * 0.34} Q${cx - size * 0.3} ${cy} ${cx} ${cy - size * 0.36} Z" fill="${c}"/>`; // teardrop
  return `<g ${t}>${body}<circle cx="${cx - size * 0.12}" cy="${cy - size * 0.12}" r="${size * 0.05}" fill="#fff" opacity="0.5"/></g>`;
}

function placementsFrom(flags) {
  try {
    const o = JSON.parse(flags.morpho_place || '{}');
    return (o && typeof o === 'object') ? o : {};
  } catch { return {}; }
}

export default {
  id: 'morpho',
  title: 'The Morpho Gallery',
  intro: 'The totem\'s door lets you into an apse washed in a pale, sourceless light, where the whole end wall is a single vast mosaic of a morpho butterfly — one wing blazing blue, the other half-finished, its empty sockets waiting like missing teeth — and a hundred living morphos drift through the still air as though the wall exhales them.',

  scene(state) {
    const revealed = !!state.flags.morpho_wingRevealed;
    const solved = !!state.flags.morpho_solved;
    const waxHere = !state.flags.morpho_waxTaken;
    const tokenHere = !(state.journal || []).some(e => e.id === 'token5');
    const place = placementsFrom(state.flags);

    // right-wing socket screen coords (in the scene)
    const RS = { to: [980, 350], ti: [900, 360], mo: [1000, 450], mi: [905, 450], lo: [980, 545], li: [900, 535] };
    const LS = { to: [620, 350], ti: [700, 360], mo: [600, 450], mi: [695, 450], lo: [620, 545], li: [700, 535] };

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gd_morph_air" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#0e1c12"/>
          <stop offset="0.5" stop-color="#13251a"/>
          <stop offset="1" stop-color="#1c3324"/>
        </linearGradient>
        <linearGradient id="gd_morph_floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#1d301f"/>
          <stop offset="1" stop-color="#070d08"/>
        </linearGradient>
        <radialGradient id="gd_morph_apse" cx="0.5" cy="0.4" r="0.7">
          <stop offset="0" stop-color="rgba(203,230,255,0.28)"/>
          <stop offset="0.6" stop-color="rgba(159,212,168,0.10)"/>
          <stop offset="1" stop-color="rgba(159,212,168,0)"/>
        </radialGradient>
        <linearGradient id="gd_morph_wingL" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${revealed ? '#2f6fb0' : '#2a3630'}"/>
          <stop offset="1" stop-color="${revealed ? '#4a90d9' : '#354339'}"/>
        </linearGradient>
        <linearGradient id="gd_morph_wingR" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#2a3630"/>
          <stop offset="1" stop-color="#354339"/>
        </linearGradient>
        <linearGradient id="gd_morph_beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="rgba(203,230,255,0.22)"/>
          <stop offset="1" stop-color="rgba(203,230,255,0)"/>
        </linearGradient>
      </defs>
      <style>
        @keyframes morph_flit1 { 0%{transform:translate(0,0) rotate(0);} 50%{transform:translate(40px,-30px) rotate(8deg);} 100%{transform:translate(0,0) rotate(0);} }
        @keyframes morph_flit2 { 0%{transform:translate(0,0) rotate(0);} 50%{transform:translate(-34px,26px) rotate(-10deg);} 100%{transform:translate(0,0) rotate(0);} }
        @keyframes morph_flap { 0%,100%{transform:scaleX(1);} 50%{transform:scaleX(0.72);} }
      </style>

      <rect width="1600" height="660" fill="url(#gd_morph_air)"/>
      <rect y="660" width="1600" height="240" fill="url(#gd_morph_floor)"/>

      <!-- the apse arch + its pale light -->
      <path d="M300 660 L300 300 Q800 60 1300 300 L1300 660 Z" fill="#16281a" opacity="0.6"/>
      <ellipse cx="800" cy="440" rx="520" ry="380" fill="url(#gd_morph_apse)"/>
      <polygon points="700,10 900,10 1000,660 600,660" fill="url(#gd_morph_beam)" class="moonbeam"/>

      <!-- the mosaic border: the procession of defendants (foreshadow) -->
      <g opacity="0.9">
        <rect x="330" y="150" width="940" height="70" rx="6" fill="#2e3a2c" stroke="#1c2718" stroke-width="3"/>
        ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
          const x = 388 + i * 118;
          return `
          <!-- an animal leading a human, a scale carved above the human -->
          <path d="M${x - 30} 205 q6 -22 22 -20 q10 1 8 10 l-6 2 q2 6 -4 8 z" fill="#141f15"/>
          <circle cx="${x + 6}" cy="182" r="7" fill="#141f15"/>
          <rect x="${x + 2}" y="189" width="8" height="18" rx="2" fill="#141f15"/>
          <path d="M${x + 2} 168 l4 -6 l4 6" fill="none" stroke="#d1a53f" stroke-width="1.6"/>
          <line x1="${x + 6}" y1="162" x2="${x + 6}" y2="168" stroke="#d1a53f" stroke-width="1.4"/>
          <path d="M${x} 164 h12" stroke="#d1a53f" stroke-width="1.4"/>`;
        }).join('')}
      </g>

      <!-- the great morpho mosaic: body + two wings -->
      <g>
        <!-- body -->
        <ellipse cx="800" cy="450" rx="26" ry="130" fill="#1c2417" stroke="#0e1c12" stroke-width="3"/>
        <circle cx="800" cy="322" r="24" fill="#1c2417" stroke="#0e1c12" stroke-width="3"/>
        <path d="M792 306 Q772 276 756 282 M808 306 Q828 276 844 282" stroke="#0e1c12" stroke-width="3" fill="none"/>

        <!-- LEFT wing (the key: intact, faded until the lens) -->
        <g style="transform-origin:800px 450px; ${solved ? '' : 'animation: morph_flap 6s ease-in-out infinite;'}">
          <path d="M780 340 Q560 250 470 360 Q430 470 540 540 Q660 600 782 560 Z"
            fill="url(#gd_morph_wingL)" stroke="#0e1c12" stroke-width="4" opacity="${revealed ? 1 : 0.5}"/>
          <path d="M780 340 Q560 250 470 360" stroke="${revealed ? '#8fc0f0' : '#4a5a48'}" stroke-width="3" fill="none" opacity="0.7"/>
          ${SOCKETS.map(k => {
            const [x, y] = LS[k];
            return `<g opacity="${revealed ? 1 : 0.35}">${revealed
              ? `<g transform="translate(${x - 17},${y - 17})">${tessera(SOLUTION[k], 34, true)}</g>`
              : `<circle cx="${x}" cy="${y}" r="13" fill="#2a3630" stroke="#4a5a48" stroke-width="2"/>`}</g>`;
          }).join('')}
        </g>

        <!-- RIGHT wing (the sockets to fill) -->
        <g style="transform-origin:800px 450px; ${solved ? '' : 'animation: morph_flap 6s ease-in-out infinite; animation-delay:-3s;'}">
          <path d="M820 340 Q1040 250 1130 360 Q1170 470 1060 540 Q940 600 818 560 Z"
            fill="url(#gd_morph_wingR)" stroke="#0e1c12" stroke-width="4"/>
          <path d="M820 340 Q1040 250 1130 360" stroke="#4a5a48" stroke-width="3" fill="none" opacity="0.7"/>
          ${SOCKETS.map(k => {
            const [x, y] = RS[k];
            const filled = place[k];
            return filled
              ? `<g transform="translate(${x - 17},${y - 17})">${tessera(filled, 34, false)}</g>`
              : `<circle cx="${x}" cy="${y}" r="13" fill="#101a12" stroke="#5aa552" stroke-width="2" stroke-dasharray="3 3" opacity="0.8"/>`;
          }).join('')}
        </g>

        ${solved ? `
          <ellipse cx="800" cy="450" rx="360" ry="260" fill="url(#gd_morph_apse)" class="glow"/>
          <text x="800" y="640" text-anchor="middle" font-size="14" fill="#9ce08a" class="flicker"
            font-family="Palatino Linotype, Georgia, serif">the wing unfolds — the way is through</text>` : ''}
      </g>

      <!-- the wild bees' comb at the apse edge -->
      ${waxHere ? `
      <g class="sway">
        <path d="M250 300 Q244 340 262 360 Q292 366 300 330 Q304 300 280 288 Q260 282 250 300 Z" fill="#c9a227" stroke="#8a6a24" stroke-width="3"/>
        <g fill="#a8842a" opacity="0.7">
          <path d="M262 316 l6 -4 l6 4 l-2 7 l-8 0 z"/><path d="M276 328 l5 -3 l5 3 l-2 6 l-6 0 z"/>
        </g>
        <circle cx="255" cy="292" r="2.4" fill="#ffe08a" class="glow fast"/>
      </g>` : ''}

      <!-- the mosaic niche with token 5 -->
      ${tokenHere ? `
      <g class="beckon">
        <rect x="1330" y="430" width="70" height="96" rx="8" fill="#101a12" stroke="#2e3a2c" stroke-width="3"/>
        <circle cx="1365" cy="470" r="17" fill="#6b4f37" stroke="#d1a53f" stroke-width="2.5"/>
        <path d="M1365 460 l-6 -8 l0 8 M1365 460 l6 -8 l0 8 M1358 470 q-6 3 -8 8 M1372 470 q6 3 8 8"
          stroke="#ffe08a" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <text x="1365" y="500" text-anchor="middle" font-size="11" fill="#ffe08a" font-family="Palatino Linotype, Georgia, serif">C</text>
      </g>` : ''}

      <!-- live morphos drifting -->
      <g style="animation: morph_flit1 14s ease-in-out infinite">
        <g style="transform-origin:center; animation: morph_flap 0.9s ease-in-out infinite">
          <path d="M430 240 Q414 232 418 248 Q426 252 434 246 Z" fill="#4a90d9"/>
          <path d="M436 246 Q452 232 456 248 Q446 254 438 248 Z" fill="#4a90d9"/>
        </g>
      </g>
      <g style="animation: morph_flit2 17s ease-in-out infinite">
        <g style="transform-origin:center; animation: morph_flap 1.1s ease-in-out infinite">
          <path d="M1180 600 Q1164 592 1168 608 Q1176 612 1184 606 Z" fill="#4a90d9"/>
          <path d="M1186 606 Q1202 592 1206 608 Q1196 614 1188 608 Z" fill="#4a90d9"/>
        </g>
      </g>
      <circle cx="560" cy="620" r="4" fill="#ffe08a" class="glow fast"/>
      <circle cx="1080" cy="250" r="3.5" fill="#ffe08a" class="glow fast"/>

      <!-- ground fog -->
      <ellipse cx="500" cy="852" rx="420" ry="42" fill="rgba(159,212,168,0.06)" class="fog"/>
      <ellipse cx="1160" cy="864" rx="440" ry="46" fill="rgba(159,212,168,0.05)" class="fog reverse"/>

      <path d="M0 900 L0 858 Q800 902 1600 858 L1600 900 Z" fill="#070d08"/>
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const revealed = !!state.flags.morpho_wingRevealed;
    const solved = !!state.flags.morpho_solved;

    // the mosaic: lens-reveal, then the mirror puzzle
    spots.push({
      id: 'mosaic', x: 470, y: 300, w: 660, h: 300, label: solved ? 'The morpho, whole' : 'The morpho mosaic',
      onInteract(game) {
        if (game.getFlag('morpho_solved')) {
          game.say('The two wings hold each other in perfect reflection, blue answering blue — and the whole wall stands folded open behind them like something that has just decided to fly.');
          return;
        }
        if (!game.getFlag('morpho_wingRevealed') && game.selectedItem === 'amber_lens') {
          game.setFlag('morpho_wingRevealed');
          game.playSfx('page');
          game.say('You raise the amber lens to the faded left wing and the whole gallery pours through it — the dead grey tesserae drink the gathered light and blaze back into colour: azure, gold, and violet, laid in a pattern that has been waiting a century to be read.');
          game.refreshScene();
          return;
        }
        openMosaicPuzzle(game);
      },
    });

    // the wild comb -> beeswax
    if (!state.flags.morpho_waxTaken) {
      spots.push({
        id: 'comb', x: 236, y: 280, w: 90, h: 100, label: 'A wild bees\' comb',
        onInteract(game) {
          game.setFlag('morpho_waxTaken');
          game.addItem('beeswax_lump', { from: { x: 276, y: 324 } });
          game.say('You break off a knuckle of wild comb — warm, gold, and pliant, the bees long moved on. It wants to be pressed into the shape of something that matters. Gus eyes it thoughtfully but, for once, keeps his own counsel.');
          game.refreshScene();
        },
      });
    }

    // the border procession (foreshadow + Gus interjection = earnable mid-game reveal)
    spots.push({
      id: 'border', x: 330, y: 150, w: 940, h: 72, label: 'The mosaic border',
      onInteract(game) {
        const html = `<div class="leaf-tablet"><div class="leaf-title">The border procession</div>
          Around the whole mosaic runs a procession in tile: <strong>animals leading human figures
          INTO the temple.</strong> And over each human, small and unmistakable, a carved
          <strong>scale.</strong> <em>Not prisoners. Defendants.</em></div>`;
        game.journal.add('note_procession', { title: 'The border procession (Morpho Gallery)', category: 'note', html });
        game.dialog({ title: 'The Border', html });
        game.say('You follow the border and the pattern resolves into a procession: animals leading people into this temple, and a little carved scale hung over every human head. Not prisoners being dragged. Defendants being brought to trial. Gus watches you understand it. "I did tell you," he says quietly. "Advocate. Accused. I have never once been speaking in metaphor, Marlowe."');
      },
    });

    // token 5
    if (!(state.journal || []).some(e => e.id === 'token5')) {
      spots.push({
        id: 'token5', x: 1326, y: 428, w: 78, h: 100, label: 'A disc in a niche',
        onInteract(game) {
          game.journal.add('token5', { title: 'Court token — the mosaic niche', category: 'sun', sun: { creature: 'harpy', letter: 'C' } });
          game.say('In a niche beside the mosaic, a carved disc: a harpy eagle, crested and fierce, above the letter C. "Exhibit five," says Gus. "The sky itself. You will want it very soon, and in a very particular order."');
          game.refreshScene();
        },
      });
    }

    // flavor: the drifting morphos
    spots.push({
      id: 'morphos', x: 380, y: 560, w: 260, h: 120, label: 'The living morphos',
      onInteract(game) {
        game.say('Real morphos drift through the apse, the exact impossible blue of the mosaic, as if some had peeled themselves off the wall and thought better of stillness. When one lands on your sleeve and opens its wings, both halves match perfectly. The wall, you realize, is only asking you to do the same.');
      },
    });

    // the way through (once solved)
    spots.push({
      id: 'exit', x: 700, y: 320, w: 200, h: 300, label: solved ? 'Through the folded wing' : 'The mosaic wall',
      onInteract(game) {
        if (!game.getFlag('morpho_solved')) {
          game.say('The mosaic is a wall until it is a wing. Complete the right side as the left\'s true reflection and it will unfold — grove-logic again, and again perfectly consistent.');
          return;
        }
        if (!game.hasItem('beeswax_lump') && !game.hasItem('oath_seal_paste')) {
          game.say('Gus plants himself at the fold. "The comb-wax, counsel — or whatever you have made of it. An oath at the end of this wants a seal, and a seal wants wax. Take it before we go."');
          return;
        }
        if (!game.journal.has('token5')) {
          game.say('Gus points his tail at the niche. "The harpy token, Marlowe. The sky. Sixth-to-last thing you will need, and the Court counts them all. Fetch it."');
          return;
        }
        game.say('You step through the folded wing into a close torch-dark, and somewhere ahead gold catches the last of the light — a great many small golden things, laid out and waiting to be weighed.');
        game.completeRoom({ delay: 700 });
      },
    });

    return spots;
  },

  hints: [
    { text: 'The right wing wants to be the left wing\'s reflection — but the left has faded almost to nothing. Something in your satchel gathers light.', cost: 60 },
    { text: 'Hold the amber lens to the mosaic to wake the left wing. Then mirror it: outer stays outer, top stays top — a reflection, not a copy.', cost: 120 },
    { text: 'Top-outer azure teardrop, top-inner gold disc, mid-outer violet oval, mid-inner azure disc, low-outer gold teardrop, low-inner violet disc.', cost: 240 },
  ],
};

function openMosaicPuzzle(game) {
  game.openPuzzle({
    id: 'morpho_mirror',
    title: 'The Morpho\'s Wing',
    wide: true,
    onCleanup() { game.refreshScene(); },
    render(body, api) {
      let picked = null;   // tray index currently held

      const revealed = () => !!game.getFlag('morpho_wingRevealed');

      body.innerHTML = `
        <p class="puzzle-desc">The left wing is the key; the right wing is yours to finish. Set each
        socket so the right wing becomes the left's <em>reflection</em> — outer stays outer, top stays
        top. ${'' /* key faded warning inserted below */}<span id="mo-warn"></span></p>
        <div class="puzzle-row"><svg id="mo-svg" viewBox="0 0 640 300" width="100%" style="max-width:600px" xmlns="http://www.w3.org/2000/svg"></svg></div>
        <div class="puzzle-row" id="mo-tray" style="flex-wrap:wrap; max-width:520px; margin:0 auto;"></div>
        <div class="puzzle-row"><button class="btn btn-primary" id="mo-wake">Wake the Wing</button></div>
        <div class="puzzle-feedback"></div>`;

      // socket coords within the modal svg
      const RS = { to: [400, 70], ti: [330, 78], mo: [418, 150], mi: [336, 150], lo: [400, 228], li: [330, 220] };
      const LS = { to: [240, 70], ti: [310, 78], mo: [222, 150], mi: [304, 150], lo: [240, 228], li: [310, 220] };

      const trayUsed = () => {
        const place = placementsFrom(game.state.flags);
        return new Set(Object.values(place));
      };

      function paintSvg() {
        const place = placementsFrom(game.state.flags);
        const rev = revealed();
        const keyCell = (k) => {
          const [x, y] = LS[k];
          if (!rev) return `<circle cx="${x}" cy="${y}" r="15" fill="#2a3630" stroke="#4a5a48" stroke-width="2"/>`;
          return `<g transform="translate(${x - 17},${y - 17})">${tessera(SOLUTION[k], 34, true)}</g>`;
        };
        const socketCell = (k) => {
          const [x, y] = RS[k];
          const filled = place[k];
          const inner = filled
            ? `<g transform="translate(${x - 17},${y - 17})">${tessera(filled, 34, false)}</g>`
            : `<circle cx="${x}" cy="${y}" r="15" fill="#101a12" stroke="#5aa552" stroke-width="2" stroke-dasharray="3 3"/>`;
          return `<g data-sock="${k}" style="cursor:pointer">${inner}
            <text x="${x}" y="${y + 30}" text-anchor="middle" font-size="8" fill="#9fb37e"
              font-family="Palatino Linotype, Georgia, serif">${SOCKET_LABEL[k]}</text></g>`;
        };
        const svg = body.querySelector('#mo-svg');
        svg.innerHTML = `
          <path d="M300 40 Q120 -6 60 90 Q34 190 150 240 Q250 276 300 250 Z" fill="${rev ? '#2f6fb0' : '#2a3630'}" opacity="${rev ? 0.55 : 0.4}" stroke="#0e1c12" stroke-width="2"/>
          <path d="M340 40 Q520 -6 580 90 Q606 190 490 240 Q390 276 340 250 Z" fill="#2a3630" opacity="0.4" stroke="#0e1c12" stroke-width="2"/>
          <ellipse cx="320" cy="150" rx="14" ry="120" fill="#1c2417"/>
          <text x="150" y="20" text-anchor="middle" font-size="10" fill="#9fb37e" font-family="Palatino Linotype, Georgia, serif" opacity="0.7">the key (mirror me)</text>
          <text x="490" y="20" text-anchor="middle" font-size="10" fill="#9ce08a" font-family="Palatino Linotype, Georgia, serif" opacity="0.7">your wing</text>
          ${SOCKETS.map(keyCell).join('')}
          ${SOCKETS.map(socketCell).join('')}`;
        svg.querySelectorAll('[data-sock]').forEach(el => {
          el.addEventListener('click', () => onSocket(el.dataset.sock));
        });
        body.querySelector('#mo-warn').textContent = rev ? '' : ' The key has faded to grey — hold the amber lens to the mosaic in the gallery to wake it first.';
      }

      function paintTray() {
        const used = trayUsed();
        const tray = body.querySelector('#mo-tray');
        tray.innerHTML = TRAY.map((id, i) => {
          if (used.has(id)) return '';
          const on = picked === i ? 'box-shadow:0 0 0 2px #9ce08a, 0 0 14px rgba(156,224,138,0.4);' : '';
          return `<div data-tray="${i}" class="tile" style="min-width:52px; min-height:52px; padding:6px; ${on}">
            <svg viewBox="0 0 34 34" width="34" height="34">${tessera(id, 34, false)}</svg></div>`;
        }).join('');
        tray.querySelectorAll('[data-tray]').forEach(el => {
          el.addEventListener('click', () => {
            picked = (picked === Number(el.dataset.tray)) ? null : Number(el.dataset.tray);
            game.playSfx('click');
            paintTray();
          });
        });
      }

      function onSocket(k) {
        const place = placementsFrom(game.state.flags);
        if (place[k]) {
          // return the tessera to the tray
          delete place[k];
          game.setFlag('morpho_place', JSON.stringify(place));
          picked = null;
          game.playSfx('click');
          paintSvg(); paintTray();
          return;
        }
        if (picked === null) { api.setFeedback('Pick a tessera from the tray first, then a socket.', ''); return; }
        place[k] = TRAY[picked];
        game.setFlag('morpho_place', JSON.stringify(place));
        picked = null;
        game.playSfx('click');
        paintSvg(); paintTray();
      }

      paintSvg(); paintTray();

      body.querySelector('#mo-wake').addEventListener('click', () => {
        const place = placementsFrom(game.state.flags);
        if (Object.keys(place).length < 6) { api.fail('The wing is unfinished — every socket wants a tessera before it can wake.'); return; }
        const wrong = SOCKETS.find(k => place[k] !== SOLUTION[k]);
        if (wrong) { api.fail('The wing shudders and stays flat. Somewhere it is a copy where it should be a reflection — read the key again, outer for outer.'); return; }
        game.setFlag('morpho_solved');
        game.playSfx('stone');
        game.journal.add('note_wing', {
          title: 'The wing completed (Morpho Gallery)', category: 'note',
          html: `<div class="leaf-tablet"><div class="leaf-title">Reflected true</div>
            The right wing set as the left's mirror: azure and gold and violet answering across the
            body, outer to outer, top to top. The mosaic wall unfolded like a thing taking flight.
            <em>A surveyor's eye for symmetry, Gus called it. You suspect it was just paying
            attention.</em></div>`,
        });
        api.solved({ message: 'The last tessera seats and the two wings match — blue for blue, gold for gold — and the whole mosaic wall unfolds along the morpho\'s body like a wing opening, onto the dark beyond. "Reflected, not copied," says Gus, satisfied. "The difference is the entire art. Do keep it in mind."' });
        game.refreshScene();
      });
    },
  });
}
