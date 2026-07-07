// TRIAL 2 — The Ferry Pool. River-crossing (predator/prey ferry logic).
// Charges: ocelot kit, macaw fledgling, net of river-figs. The coracle bears
// you + ONE charge. Left alone on a departed bank, kit eats bird and bird eats
// figs. Rules are LEARNED by examining the charges. Solution (7 crossings):
// bird over, back empty, kit over, bird BACK, figs over, back empty, bird over.
// Produces: vine_cord (near post, any time). Token 2 (MANTIS, "P") on the
// far-bank post, reachable once you stand on the far bank. Foreshadow: the
// fledgling repeats, in YOUR recorded voice, "Quadrant nine. Mark the big kapok."

import { registerItems } from '../../../shared/js/items.js';

registerItems({
  vine_cord: {
    name: 'Braided Vine Cord',
    description: 'A double-braided length of liana, supple and stronger than it looks — the coracle\'s spare tow-line. Good for a ferry, a snare, or restringing something that has hung broken for a hundred years.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 10 Q30 16 18 24 Q6 32 24 38" fill="none" stroke="#5aa552" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M18 10 Q36 16 24 24 Q12 32 30 38" fill="none" stroke="#3f7a37" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="24" cy="38" r="3.5" fill="#4a3626"/>
      <circle cx="15" cy="10" r="2.5" fill="#3f7a37"/>
    </svg>`,
  },
});

const CHARGES = {
  kit:  { name: 'the ocelot kit',    short: 'kit' },
  bird: { name: 'the macaw fledgling', short: 'bird' },
  figs: { name: 'the net of river-figs', short: 'figs' },
};

function pos(flags, who) {
  const v = flags[`ferrypool_pos_${who}`];
  return (v === 'far' || v === 'coracle') ? v : 'near';
}
function playerFar(flags) { return !!flags.ferrypool_playerFar; }
// which bank a charge actually sits on (coracle rides with the player)
function bank(flags, who) {
  const p = pos(flags, who);
  return p === 'coracle' ? (playerFar(flags) ? 'far' : 'near') : p;
}

export default {
  id: 'ferrypool',
  title: 'The Ferry Pool',
  intro: 'The gate lets you out onto the lip of a black flooded gallery, still as poured glass, and on the near shore three small charges wait to be taken across: an ocelot kit, a scarlet macaw fledgling, and a net of river-figs — while a reed coracle rides a vine pulley-line to a far ledge, and Gus reads the carving on the ferry post with the grim relish of a man who has done this the hard way.',

  scene(state) {
    const f = state.flags;
    const pFar = playerFar(f);
    const ferried = !!f.ferrypool_ferried;
    const cordHere = !f.ferrypool_cordTaken;
    const tokenHere = !(state.journal || []).some(e => e.id === 'token2');

    // charge sprite at a given center
    const charge = (who, cx, cy) => {
      if (who === 'kit') return `
        <g transform="translate(${cx},${cy})">
          <ellipse cx="0" cy="8" rx="20" ry="13" fill="#c98a3f" stroke="#7a5222" stroke-width="2"/>
          <circle cx="-14" cy="-6" r="12" fill="#c98a3f" stroke="#7a5222" stroke-width="2"/>
          <path d="M-22 -14 l-2 -8 l7 4 M-8 -15 l2 -8 l-7 5" fill="#c98a3f" stroke="#7a5222" stroke-width="1.5"/>
          <circle cx="-18" cy="-7" r="1.6" fill="#2c1e12"/><circle cx="-10" cy="-7" r="1.6" fill="#2c1e12"/>
          <path d="M-16 -2 q2 2 4 0" stroke="#2c1e12" stroke-width="1.4" fill="none"/>
          <g fill="#7a5222"><circle cx="4" cy="4" r="1.8"/><circle cx="12" cy="8" r="1.8"/><circle cx="6" cy="12" r="1.8"/></g>
          <path d="M18 6 q12 -2 14 -12" fill="none" stroke="#c98a3f" stroke-width="4" stroke-linecap="round"/>
        </g>`;
      if (who === 'bird') return `
        <g transform="translate(${cx},${cy})">
          <ellipse cx="0" cy="6" rx="14" ry="18" fill="#c0392b" stroke="#7a1f16" stroke-width="2"/>
          <path d="M10 -2 Q24 0 22 14 Q14 12 10 6 Z" fill="#2f6fb0"/>
          <path d="M-8 8 Q-20 12 -18 22 Q-10 18 -6 12 Z" fill="#e0a52e"/>
          <circle cx="-2" cy="-12" r="9" fill="#c0392b" stroke="#7a1f16" stroke-width="2"/>
          <circle cx="-4" cy="-13" r="1.7" fill="#f5f0dd"/><circle cx="-4" cy="-13" r="0.9" fill="#1c1208"/>
          <path d="M-10 -12 q-8 1 -8 5 q6 0 9 -2 z" fill="#2c2418"/>
        </g>`;
      return `
        <g transform="translate(${cx},${cy})">
          <path d="M-18 -6 Q-22 16 0 20 Q22 16 18 -6 Z" fill="none" stroke="#6b5535" stroke-width="2"/>
          <path d="M-14 -2 L14 -2 M-16 6 L16 6 M-12 14 L12 14 M-6 -6 L-2 20 M6 -6 L2 20" stroke="#6b5535" stroke-width="1.4" opacity="0.8"/>
          <circle cx="-6" cy="2" r="6" fill="#6a8a3a"/><circle cx="7" cy="0" r="6.5" fill="#84a648"/>
          <circle cx="0" cy="11" r="6" fill="#6a8a3a"/><circle cx="-9" cy="12" r="4.5" fill="#84a648"/>
          <path d="M-18 -6 q6 -8 18 -7 q12 -1 18 7" fill="none" stroke="#5aa552" stroke-width="2.5"/>
        </g>`;
    };

    // where each charge draws
    const nearSlots = { kit: [430, 690], bird: [560, 700], figs: [300, 720] };
    const farSlots  = { kit: [1210, 470], bird: [1320, 470], figs: [1120, 486] };
    const coracleCenter = pFar ? [1180, 604] : [560, 604];
    const coracleSlot = [coracleCenter[0], coracleCenter[1] - 26];

    const drawCharge = (who) => {
      const p = pos(f, who);
      if (p === 'coracle') return charge(who, coracleSlot[0], coracleSlot[1]);
      const b = bank(f, who);
      const [x, y] = b === 'far' ? farSlots[who] : nearSlots[who];
      return charge(who, x, y);
    };

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gd_ferry_wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#070d08"/>
          <stop offset="0.5" stop-color="#0e1c12"/>
          <stop offset="1" stop-color="#16281a"/>
        </linearGradient>
        <linearGradient id="gd_ferry_water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#0c1a14"/>
          <stop offset="0.5" stop-color="#0a2018"/>
          <stop offset="1" stop-color="#061510"/>
        </linearGradient>
        <linearGradient id="gd_ferry_ledge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#3f4a3c"/>
          <stop offset="1" stop-color="#1c2718"/>
        </linearGradient>
        <linearGradient id="gd_ferry_beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="rgba(159,212,168,0.22)"/>
          <stop offset="1" stop-color="rgba(159,212,168,0)"/>
        </linearGradient>
        <linearGradient id="gd_ferry_reed" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#8a7a44"/>
          <stop offset="1" stop-color="#5c4e28"/>
        </linearGradient>
      </defs>
      <style>
        @keyframes ferry_shine { 0%,100% { opacity:0.35; } 50% { opacity:0.7; } }
        @keyframes ferry_fly1 { 0%,100% { transform: translate(0,0);} 50% { transform: translate(20px,-16px);} }
        @keyframes ferry_fly2 { 0%,100% { transform: translate(0,0);} 50% { transform: translate(-22px,12px);} }
      </style>

      <rect width="1600" height="520" fill="url(#gd_ferry_wall)"/>

      <!-- roots + arch overhead -->
      <g stroke-linecap="round" fill="none">
        <path d="M0 60 Q400 130 800 92 Q1200 130 1600 66" stroke="#3a2a1c" stroke-width="30"/>
        <path d="M0 60 Q400 130 800 92 Q1200 130 1600 66" stroke="#4a3626" stroke-width="12" opacity="0.6"/>
        <path d="M140 0 Q170 160 120 320" stroke="#4a3626" stroke-width="16"/>
        <path d="M1470 0 Q1440 160 1492 330" stroke="#4a3626" stroke-width="16"/>
      </g>
      <g class="sway slow" fill="#16281a">
        <path d="M360 96 q-14 66 6 120 q26 -52 8 -118 z"/>
        <path d="M1240 108 q16 58 -6 116 q-24 -48 -6 -114 z"/>
      </g>

      <!-- the canopy light-shaft -->
      <polygon points="700,10 900,10 1030,540 560,540" fill="url(#gd_ferry_beam)" class="moonbeam"/>

      <!-- the black pool -->
      <rect y="520" width="1600" height="380" fill="url(#gd_ferry_water)"/>
      <g stroke="#1c3a2c" stroke-width="2" fill="none" opacity="0.5">
        <path d="M200 600 Q800 576 1400 604" style="animation: ferry_shine 6s ease-in-out infinite"/>
        <path d="M120 680 Q800 654 1500 686" style="animation: ferry_shine 7s ease-in-out infinite; animation-delay:-2s"/>
        <path d="M260 764 Q800 740 1360 770" style="animation: ferry_shine 8s ease-in-out infinite; animation-delay:-4s"/>
      </g>
      <ellipse cx="820" cy="612" rx="260" ry="20" fill="#9fd4a8" opacity="0.06" style="animation: ferry_shine 5s ease-in-out infinite"/>

      <!-- near bank (left) -->
      <path d="M0 640 Q300 616 660 660 L680 900 L0 900 Z" fill="url(#gd_ferry_ledge)"/>
      <path d="M0 640 Q300 616 660 660" stroke="#5aa552" stroke-width="3" fill="none" opacity="0.3"/>

      <!-- far ledge (right) -->
      <path d="M1060 520 Q1320 500 1600 528 L1600 720 Q1320 700 1060 716 Z" fill="url(#gd_ferry_ledge)"/>
      <path d="M1060 520 Q1320 500 1600 528" stroke="#5aa552" stroke-width="3" fill="none" opacity="0.3"/>

      <!-- the pulley line + posts -->
      <line x1="470" y1="548" x2="1210" y2="470" stroke="#4a3626" stroke-width="4"/>
      <line x1="470" y1="558" x2="1210" y2="480" stroke="#5aa552" stroke-width="2" opacity="0.6"/>
      <!-- near post + far post -->
      <g>
        <rect x="452" y="548" width="20" height="120" rx="4" fill="#4a3626"/>
        <circle cx="462" cy="548" r="12" fill="none" stroke="#6b4f37" stroke-width="4"/>
        ${cordHere ? `<g class="beckon"><path d="M436 596 q-10 14 2 26 q12 -6 8 -20" fill="none" stroke="#5aa552" stroke-width="4" stroke-linecap="round"/><circle cx="440" cy="624" r="4" fill="#3f7a37"/></g>` : ''}
      </g>
      <g>
        <rect x="1200" y="470" width="20" height="120" rx="4" fill="#4a3626"/>
        <circle cx="1210" cy="470" r="12" fill="none" stroke="#6b4f37" stroke-width="4"/>
        <!-- ferry-post carving plate -->
        <rect x="1240" y="512" width="150" height="70" rx="6" fill="#2e3a2c" stroke="#1c2718" stroke-width="3"/>
        <path d="M1256 530 h118 M1256 544 h108 M1256 558 h116" stroke="#5aa552" stroke-width="2" opacity="0.5"/>
        ${tokenHere ? `
        <g class="beckon">
          <circle cx="1210" cy="452" r="16" fill="#6b4f37" stroke="#d1a53f" stroke-width="2.5"/>
          <path d="M1210 442 L1210 462 M1210 448 q-6 1 -8 -4 M1210 448 q6 1 8 -4 M1210 462 l-4 5 M1210 462 l4 5"
            stroke="#ffe08a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
          <text x="1210" y="437" text-anchor="middle" font-size="11" fill="#ffe08a" font-family="Palatino Linotype, Georgia, serif">P</text>
        </g>` : ''}
      </g>

      <!-- the coracle -->
      <g>
        <ellipse cx="${coracleCenter[0]}" cy="${coracleCenter[1] + 8}" rx="86" ry="20" fill="#0a1a12" opacity="0.6"/>
        <path d="M${coracleCenter[0] - 82} ${coracleCenter[1]} Q${coracleCenter[0]} ${coracleCenter[1] + 40} ${coracleCenter[0] + 82} ${coracleCenter[1]}
          Q${coracleCenter[0] + 60} ${coracleCenter[1] - 16} ${coracleCenter[0]} ${coracleCenter[1] - 14}
          Q${coracleCenter[0] - 60} ${coracleCenter[1] - 16} ${coracleCenter[0] - 82} ${coracleCenter[1]} Z"
          fill="url(#gd_ferry_reed)" stroke="#3a3018" stroke-width="3"/>
        <path d="M${coracleCenter[0] - 66} ${coracleCenter[1] - 2} Q${coracleCenter[0]} ${coracleCenter[1] + 24} ${coracleCenter[0] + 66} ${coracleCenter[1] - 2}"
          fill="none" stroke="#3a3018" stroke-width="2" opacity="0.7"/>
        <line x1="${coracleCenter[0]}" y1="${coracleCenter[1] - 14}" x2="${pFar ? 1210 : 462}" y2="${pFar ? 476 : 554}" stroke="#5aa552" stroke-width="2"/>
        <!-- the ferryman marker (you) -->
        <circle cx="${coracleCenter[0] + (pFar ? 40 : -40)}" cy="${coracleCenter[1] - 18}" r="7" fill="#9ce08a" opacity="0.9" class="glow"/>
      </g>

      <!-- the three charges -->
      ${drawCharge('figs')}
      ${drawCharge('kit')}
      ${drawCharge('bird')}

      <!-- stairs up from the far ledge -->
      <g>
        <path d="M1440 520 L1600 520 L1600 380 L1520 380 L1520 448 L1440 448 Z" fill="${ferried ? '#0a140d' : '#243020'}" stroke="#1c2718" stroke-width="3"/>
        ${ferried
          ? `<g stroke="#5aa552" stroke-width="4" opacity="0.6">
               <line x1="1456" y1="500" x2="1584" y2="500"/><line x1="1470" y1="470" x2="1584" y2="470"/><line x1="1470" y1="440" x2="1560" y2="440"/><line x1="1470" y1="410" x2="1560" y2="410"/></g>
             <text x="1520" y="360" text-anchor="middle" font-size="14" fill="#9ce08a" class="flicker" font-family="Palatino Linotype, Georgia, serif">the stairs rise</text>`
          : `<text x="1520" y="470" text-anchor="middle" font-size="12" fill="#5c6a4c" font-family="Palatino Linotype, Georgia, serif">sealed</text>`}
      </g>

      <!-- fireflies -->
      <g style="animation: ferry_fly1 11s ease-in-out infinite"><circle cx="900" cy="300" r="4" fill="#ffe08a" class="glow fast"/></g>
      <g style="animation: ferry_fly2 13s ease-in-out infinite"><circle cx="1080" cy="380" r="3.5" fill="#ffe08a" class="glow fast"/></g>
      <g style="animation: ferry_fly1 12s ease-in-out infinite; animation-delay:-5s"><circle cx="360" cy="520" r="3.5" fill="#ffe08a" class="glow fast"/></g>

      <!-- ground fog on the water -->
      <ellipse cx="600" cy="620" rx="460" ry="34" fill="rgba(159,212,168,0.05)" class="fog"/>
      <ellipse cx="1100" cy="700" rx="440" ry="30" fill="rgba(159,212,168,0.05)" class="fog reverse"/>

      <path d="M0 900 L0 858 Q800 900 1600 858 L1600 900 Z" fill="#05100a"/>
    </svg>`;
  },

  hotspots(state) {
    const f = state.flags;
    const spots = [];
    const pFar = playerFar(f);
    const ferried = !!f.ferrypool_ferried;

    // --- the vine cord (near post) ---
    if (!f.ferrypool_cordTaken) {
      spots.push({
        id: 'cord', x: 410, y: 588, w: 90, h: 90, label: 'A coiled vine cord',
        onInteract(game) {
          game.setFlag('ferrypool_cordTaken');
          game.addItem('vine_cord', { from: { x: 440, y: 612 } });
          game.say('You coil the coracle\'s spare tow-line over your shoulder — a double-braid of liana, stronger than rope has any right to be. "Take everything that is not nailed down," Gus advises. "Advocate\'s privilege. Also, general good practice."');
          game.refreshScene();
        },
      });
    }

    // --- the ferry-post carving (rules of capacity) ---
    spots.push({
      id: 'postcarving', x: 1236, y: 508, w: 160, h: 80, label: 'The ferry-post carving',
      onInteract(game) {
        const html = `<div class="leaf-tablet carved"><div class="leaf-title">Carved on the ferry post</div>
          "The coracle bears the ferryman and ONE charge. The Court counts what arrives."</div>`;
        game.journal.add('note_ferrylaw', { title: 'The ferry law (Ferry Pool)', category: 'note', html });
        game.dialog({ title: 'The Ferry Post', html });
      },
    });

    // --- the three charges: examine to learn natures; click to load/unload ---
    const chargeSpot = (who, x, y, w, h) => {
      const b = bank(f, who);
      const p = pos(f, who);
      const here = (p === 'coracle') || (b === (pFar ? 'far' : 'near'));
      spots.push({
        id: `charge_${who}`, x, y, w, h,
        label: CHARGES[who].name.replace(/^the /, ''),
        onInteract(game) {
          // the fledgling's first-ever click plays the foreshadow instead
          if (who === 'bird' && !game.getFlag('ferrypool_birdHeard')) {
            game.setFlag('ferrypool_birdHeard');
            game.journal.add('note_birdvoice', {
              title: 'The fledgling\'s voice (Ferry Pool)', category: 'note',
              html: `<div class="leaf-tablet"><div class="leaf-title">In your own voice</div>
                The macaw fledgling cocks its head and repeats, in a voice that is unmistakably
                <strong>yours</strong>, caught on some recording you never made:
                <em>"Quadrant nine. Mark the big kapok. Good money in this valley."</em></div>`,
            });
            game.say('The fledgling opens its beak and your own voice comes out, tinny and exact: "Quadrant nine. Mark the big kapok. Good money in this valley." You have never said that where a bird could hear it. You are almost sure. Gus watches you very carefully and says, for once, nothing.');
            return;
          }
          handleCharge(game, who, here);
        },
      });
    };
    // draw hotspots wherever each charge currently is
    const place = (who) => {
      const p = pos(f, who);
      if (p === 'coracle') {
        const cc = pFar ? [1180, 578] : [560, 578];
        return [cc[0] - 44, cc[1] - 40, 88, 90];
      }
      const b = bank(f, who);
      if (b === 'far') {
        const s = { kit: [1210, 470], bird: [1320, 470], figs: [1120, 486] }[who];
        return [s[0] - 44, s[1] - 44, 92, 96];
      }
      const s = { kit: [430, 690], bird: [560, 700], figs: [300, 720] }[who];
      return [s[0] - 44, s[1] - 44, 92, 100];
    };
    ['kit', 'bird', 'figs'].forEach(who => { const [x, y, w, h] = place(who); chargeSpot(who, x, y, w, h); });

    // --- the coracle / pulley: cross ---
    const cc = pFar ? [1180, 604] : [560, 604];
    spots.push({
      id: 'coracle', x: cc[0] - 90, y: cc[1] - 50, w: 180, h: 110, label: 'The coracle',
      onInteract(game) { crossRiver(game); },
    });

    // --- the far-bank token (reachable only from the far bank) ---
    if (!(state.journal || []).some(e => e.id === 'token2')) {
      spots.push({
        id: 'token2', x: 1180, y: 430, w: 64, h: 60, label: 'A disc on the far post',
        onInteract(game) {
          if (!playerFar(game.state.flags)) {
            game.say('A carved disc hangs from the far-bank post, a mantis face just catching the light. It is on the wrong side of a great deal of black water. You will have to be standing over there to take it.');
            return;
          }
          game.journal.add('token2', { title: 'Court token — the far-bank post', category: 'sun', sun: { creature: 'mantis', letter: 'P' } });
          game.say('You lift the disc from the far post: a mantis at prayer, and beneath it the letter P. "Exhibit two," murmurs Gus, riding your shoulder now. "The Court does keep a tidy docket."');
          game.refreshScene();
        },
      });
    }

    // --- the stairs (exit) ---
    spots.push({
      id: 'stairs', x: 1500, y: 380, w: 100, h: 160, label: ferried ? 'The far stairs' : 'The sealed stairs',
      onInteract(game) {
        if (!game.getFlag('ferrypool_ferried')) {
          game.say('Stairs climb from the far ledge into a grove of painted trunks — but the way is sealed until all three charges stand safe on the far bank, delivered whole. The Court counts what arrives, and it is still counting.');
          return;
        }
        if (!playerFar(game.state.flags)) {
          game.say('The stairs are on the far ledge, and you are not. One more crossing, ferryman.');
          return;
        }
        if (!game.hasItem('vine_cord')) {
          game.say('Gus tugs your sleeve toward the near post. "The tow-line, counsel. We will want cordage before the night is out — trust your advocate and take it."');
          return;
        }
        if (!game.journal.has('token2')) {
          game.say('Gus flicks his tail at the far post. "The mantis token, Marlowe. On the post beside you. The Court counts what leaves as carefully as what arrives."');
          return;
        }
        game.say('All three charges safe, all three delivered whole — the stairs unseal with a sigh of settling stone, and you climb toward the green light of a painted grove.');
        game.completeRoom({ delay: 700 });
      },
    });

    // --- flavor: the pool, the far grove glimpsed ---
    spots.push({
      id: 'pool', x: 700, y: 560, w: 300, h: 120, label: 'The black pool',
      onInteract(game) {
        game.say('The water is black and patient and gives nothing back but your own reflection, wavering — a surveyor in a place that is not on any survey. Something long moves under the surface, unhurried, and decides you are not yet its business.');
      },
    });

    return spots;
  },

  hints: [
    { text: 'Watch what watches what — examine each charge and it tells you its nature. The coracle takes only one at a time, so something will have to ride twice.', cost: 60 },
    { text: 'The bird can never be left beside the kit OR the figs. Take the bird first; when you bring the second charge over, take the bird BACK with you.', cost: 120 },
    { text: 'Bird over, return empty, kit over, bird back, figs over, return empty, bird over. Seven crossings.', cost: 240 },
  ],
};

// examine-or-load handler for a charge
function handleCharge(game, who, here) {
  const f = game.state.flags;
  const p = pos(f, who);

  // aboard the coracle -> unload to the player's current bank
  if (p === 'coracle') {
    game.setFlag(`ferrypool_pos_${who}`, playerFar(f) ? 'far' : 'near');
    game.playSfx('click');
    if (!checkFerried(game)) {
      game.say(`You lift ${CHARGES[who].name} out of the coracle onto the ${playerFar(f) ? 'far' : 'near'} bank.`);
    }
    game.refreshScene();
    return;
  }

  // on the opposite bank -> can't reach
  if (!here) {
    game.say(`${cap(CHARGES[who].name)} is on the far side of the water. You cannot reach it from here — bring the coracle across first.`);
    return;
  }

  // on the player's bank -> load if coracle empty, else describe nature
  const aboard = ['kit', 'bird', 'figs'].find(w => pos(f, w) === 'coracle');
  if (aboard && aboard !== who) {
    describeNature(game, who);
    game.say(`The coracle already carries ${CHARGES[aboard].name}. It bears the ferryman and ONE charge — no more. Land that one first, or send it across.`);
    return;
  }
  // load it
  game.setFlag(`ferrypool_pos_${who}`, 'coracle');
  game.playSfx('click');
  describeNature(game, who);
  game.refreshScene();
}

function describeNature(game, who) {
  const key = `ferrypool_nature_${who}`;
  const first = !game.getFlag(key);
  if (first) game.setFlag(key);
  const lines = {
    kit: 'The ocelot kit settles in, watching the fledgling the way hunger watches a window. Left alone with the bird, it would not stay hungry long.',
    bird: 'The macaw fledgling hops aboard and immediately sidles toward the figs. Left alone with them, it would eat every one; left alone with the kit, it would BE eaten.',
    figs: 'The net of river-figs smells like temptation with a handle. Anything with a beak left beside them will help itself.',
  };
  if (first) {
    game.journal.add(`note_nature_${who}`, {
      title: `The nature of ${CHARGES[who].short} (Ferry Pool)`, category: 'note',
      html: `<div class="leaf-tablet"><div class="leaf-title">${cap(CHARGES[who].name)}</div>${lines[who]}</div>`,
    });
  }
  game.say(lines[who]);
}

function crossRiver(game) {
  const f = game.state.flags;
  const departed = playerFar(f) ? 'far' : 'near';
  // charges left behind on the bank we are leaving (coracle charge rides along)
  const left = ['kit', 'bird', 'figs'].filter(w => pos(f, w) !== 'coracle' && bank(f, w) === departed);
  const has = (w) => left.includes(w);

  if (has('kit') && has('bird')) {
    game.playSfx('wrong');
    game.say('You push off — and the kit\'s ears flatten, its whole body pouring toward the fledgling. You haul the coracle back to the bank just in time, heart going like a trapped moth. The Court counts what ARRIVES, and a half-eaten macaw arrives as nothing.');
    return;
  }
  if (has('bird') && has('figs')) {
    game.playSfx('wrong');
    game.say('The line goes taut — and behind you the fledgling is already burying its beak in the fig-net. You reverse hard and scatter it off before it can gorge. Leave the bird alone with temptation and there will be nothing to ferry but an empty net.');
    return;
  }

  game.setFlag('ferrypool_playerFar', !playerFar(f));
  game.playSfx('creak');
  if (!checkFerried(game)) {
    game.say(playerFar(game.state.flags)
      ? 'The coracle glides to the far ledge on its singing line.'
      : 'The coracle slides back to the near bank, empty-handed or otherwise.');
  }
  game.refreshScene();
}

// win the moment all three charges stand delivered on the far bank with you.
// checked after BOTH crossing and unloading (the last delivery is an unload).
function checkFerried(game) {
  const f = game.state.flags;
  if (f.ferrypool_ferried) return false;
  const allFar = ['kit', 'bird', 'figs'].every(w => pos(f, w) === 'far');
  if (!(allFar && playerFar(f))) return false;
  game.setFlag('ferrypool_ferried');
  game.journal.add('note_ferried', {
    title: 'All three delivered (Ferry Pool)', category: 'note',
    html: `<div class="leaf-tablet"><div class="leaf-title">The count</div>
      Kit, fledgling, and figs: all three safe on the far bank, delivered whole. The Court's
      first count comes out even. <em>"Competently ferried,"</em> Gus allows. <em>"The stairs
      acknowledge it."</em></div>`,
  });
  game.say('That is the last of them — kit, fledgling, and figs, all three safe on the far ledge and every one delivered whole. Behind you the black water lies flat and cheated. The far stairs unseal with a low grinding sigh.');
  return true;
}

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
