// TRIAL 2 — The Ferry Pool. River-crossing (predator/prey ferry logic).
// Charges: ocelot kit, macaw fledgling, net of river-figs. The coracle bears
// you + ONE charge. Left alone on a departed bank, kit eats bird and bird eats
// figs. Rules are LEARNED by examining the charges. Solution (7 crossings):
// bird over, back empty, kit over, bird BACK, figs over, back empty, bird over.
// Produces: vine_cord (near post, any time). Token 2 (MANTIS, "P") on the
// far-bank post, reachable once you stand on the far bank. Foreshadow: the
// fledgling repeats, in YOUR recorded voice, "Quadrant nine. Mark the big kapok."

import { registerItems } from '../../../shared/js/items.js';
import { kitDefs, panel, shadow } from '../../../shared/js/scenekit.js';

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

// who eats whom when left alone on a bank (crossRiver refuses either)
const EATS = [['kit', 'bird'], ['bird', 'figs']];
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

// Layout — read off the plate (art/ferrypool.webp): the near shore's stone
// ledges on the left, the far shore and its steps on the right, the pool between.
const POST_N = { x: 548, top: 500, base: 620 };
const POST_F = { x: 1262, top: 430, base: 540 };
const CARVE = { x: 1284, y: 440, w: 140, h: 64 };
const STAIRS = { x: 1384, y: 524, w: 200, h: 136 };
// where each charge stands on each shore, and where the coracle rides
const NEAR_SLOTS = { kit: [420, 586], bird: [310, 560], figs: [220, 600] };
const FAR_SLOTS = { kit: [1112, 522], bird: [1192, 500], figs: [1032, 544] };
const CORACLE = { near: [640, 660], far: [1070, 660] };

export default {
  id: 'ferrypool',
  solution: () => {
    // the fewest crossings that get all three over with nothing eaten
    const who = ['kit', 'bird', 'figs'], key = (s) => `${s.me}|${who.map(w => s[w]).join('')}`;
    const safe = (s) => EATS.every(([a, b]) => !(s[a] === s[b] && s[a] !== s.me));
    let frontier = [{ me: 0, kit: 0, bird: 0, figs: 0 }], seen = new Set([key(frontier[0])]);
    for (let n = 1; n < 12; n++) {
      const next = [];
      for (const s of frontier) for (const take of [null, ...who.filter(w => s[w] === s.me)]) {
        const t = { ...s, me: 1 - s.me }; if (take) t[take] = t.me;
        if (!safe(t) || seen.has(key(t))) continue;
        if (who.every(w => t[w] === 1)) return [`${['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'][n]} crossings`];
        seen.add(key(t)); next.push(t);
      }
      frontier = next;
    }
    return ['no safe crossing'];
  },
  lintStates: [{ label: 'solved', flags: { ferrypool_ferried: true, ferrypool_playerFar: true }, inventory: ['vine_cord'] }],
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
    const nearSlots = NEAR_SLOTS;
    const farSlots  = FAR_SLOTS;
    const coracleCenter = pFar ? CORACLE.far : CORACLE.near;
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
        ${kitDefs()}
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

      <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="art/ferrypool.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="art/ferrypool.mp4" type="video/mp4"/></video></foreignObject>


      <!-- the black pool -->
      <!-- pool surface supplied by the plate -->
      <g stroke="#1c3a2c" stroke-width="2" fill="none" opacity="0.5">
        <path d="M200 600 Q800 576 1400 604" style="animation: ferry_shine 6s ease-in-out infinite"/>
        <path d="M120 680 Q800 654 1500 686" style="animation: ferry_shine 7s ease-in-out infinite; animation-delay:-2s"/>
        <path d="M260 764 Q800 740 1360 770" style="animation: ferry_shine 8s ease-in-out infinite; animation-delay:-4s"/>
      </g>

      <!-- the shores, the ledges and the far steps are painted in the plate (near shore left, far shore right) -->
      <!-- the pulley line, strung between the two ferry posts -->
      <line x1="${POST_N.x}" y1="${POST_N.top}" x2="${POST_F.x}" y2="${POST_F.top}" stroke="#4a3626" stroke-width="4"/>
      <line x1="${POST_N.x}" y1="${POST_N.top + 8}" x2="${POST_F.x}" y2="${POST_F.top + 8}" stroke="#5aa552" stroke-width="2" opacity="0.6"/>
      <!-- near post, driven into the near ledge -->
      <g data-mount="floor">
        ${shadow(POST_N.x, POST_N.base, 22, 5)}
        <rect x="${POST_N.x - 10}" y="${POST_N.top}" width="20" height="${POST_N.base - POST_N.top}" rx="4" fill="#4a3626" stroke="#2a1e14" stroke-width="2"/>
        <circle cx="${POST_N.x}" cy="${POST_N.top}" r="12" fill="none" stroke="#6b4f37" stroke-width="4"/>
        ${cordHere ? `<g class="beckon"><path d="M${POST_N.x - 26} ${POST_N.top + 48} q-10 14 2 26 q12 -6 8 -20" fill="none" stroke="#5aa552" stroke-width="4" stroke-linecap="round"/><circle cx="${POST_N.x - 22}" cy="${POST_N.top + 76}" r="4" fill="#3f7a37"/></g>` : ''}
      </g>
      <!-- far post, on the far ledge, with its carved plank nailed beside it -->
      <g data-mount="floor">
        ${shadow(POST_F.x, POST_F.base, 22, 5)}
        <rect x="${POST_F.x - 10}" y="${POST_F.top}" width="20" height="${POST_F.base - POST_F.top}" rx="4" fill="#4a3626" stroke="#2a1e14" stroke-width="2"/>
        <circle cx="${POST_F.x}" cy="${POST_F.top}" r="12" fill="none" stroke="#6b4f37" stroke-width="4"/>
      </g>
      ${panel({ ...CARVE, material: 'darkwood', mount: 'nails', rx: 4, body: `
        <path d="M${CARVE.x + 16} ${CARVE.y + 20} h${CARVE.w - 32} M${CARVE.x + 16} ${CARVE.y + 34} h${CARVE.w - 42} M${CARVE.x + 16} ${CARVE.y + 48} h${CARVE.w - 34}" stroke="#9fd48a" stroke-width="2" opacity="0.55"/>` })}
      ${tokenHere ? `
        <g class="beckon">
          <circle cx="${POST_F.x}" cy="${POST_F.top - 18}" r="16" fill="#6b4f37" stroke="#d1a53f" stroke-width="2.5"/>
          <path d="M${POST_F.x} ${POST_F.top - 28} L${POST_F.x} ${POST_F.top - 8} M${POST_F.x} ${POST_F.top - 22} q-6 1 -8 -4 M${POST_F.x} ${POST_F.top - 22} q6 1 8 -4 M${POST_F.x} ${POST_F.top - 8} l-4 5 M${POST_F.x} ${POST_F.top - 8} l4 5"
            stroke="#ffe08a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
          <text x="${POST_F.x}" y="${POST_F.top - 37}" text-anchor="middle" font-size="11" fill="#ffe08a" font-family="Palatino Linotype, Georgia, serif">P</text>
        </g>` : ''}
      <!-- the coracle (photoreal reed boat) -->
      <g>
        <ellipse cx="${coracleCenter[0]}" cy="${coracleCenter[1] + 10}" rx="86" ry="18" fill="#0a1a12" opacity="0.6"/>
        <image href="art/ferry-coracle.webp" x="${coracleCenter[0] - 92}" y="${coracleCenter[1] - 46}" width="184" height="127" preserveAspectRatio="xMidYMid meet"/>
        <line x1="${coracleCenter[0]}" y1="${coracleCenter[1] - 14}" x2="${pFar ? POST_F.x : POST_N.x}" y2="${pFar ? POST_F.top + 8 : POST_N.top + 8}" stroke="#5aa552" stroke-width="2"/>
        <!-- the ferryman marker (you) -->
        <circle cx="${coracleCenter[0] + (pFar ? 40 : -40)}" cy="${coracleCenter[1] - 18}" r="7" fill="#9ce08a" opacity="0.9" class="glow"/>
      </g>

      <!-- the three charges -->
      ${drawCharge('figs')}
      ${drawCharge('kit')}
      ${drawCharge('bird')}

      <!-- the far steps (painted): a curtain of strangler vine across them until the crossing is done -->
      <g data-mount="wall">
        ${ferried
          ? `<text x="${STAIRS.x + STAIRS.w / 2}" y="${STAIRS.y - 10}" text-anchor="middle" font-size="14" fill="#9ce08a" class="flicker" font-family="Palatino Linotype, Georgia, serif">the stairs rise</text>`
          : `${Array.from({ length: 9 }, (_, i) => `<path d="M${STAIRS.x + 10 + i * 24} ${STAIRS.y} q${i % 2 ? 10 : -10} ${STAIRS.h / 2} 0 ${STAIRS.h}" stroke="#2f4a26" stroke-width="7" fill="none" stroke-linecap="round"/>`).join('')}
             <text x="${STAIRS.x + STAIRS.w / 2}" y="${STAIRS.y - 10}" text-anchor="middle" font-size="12" fill="#8fa37a" font-family="Palatino Linotype, Georgia, serif" paint-order="stroke" stroke="#05100a" stroke-width="3">sealed</text>`}
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
        id: 'cord', x: POST_N.x - 70, y: POST_N.top + 30, w: 90, h: 80, label: 'A coiled vine cord',
        onInteract(game) {
          game.setFlag('ferrypool_cordTaken');
          game.addItem('vine_cord', { from: { x: POST_N.x - 22, y: POST_N.top + 62 } });
          game.say('You coil the coracle\'s spare tow-line over your shoulder — a double-braid of liana, stronger than rope has any right to be. "Take everything that is not nailed down," Gus advises. "Advocate\'s privilege. Also, general good practice."');
          game.refreshScene();
        },
      });
    }

    // --- the ferry-post carving (rules of capacity) ---
    spots.push({
      id: 'postcarving', x: CARVE.x - 4, y: CARVE.y - 6, w: CARVE.w + 8, h: CARVE.h + 12, label: 'The ferry-post carving',
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
        const c = pFar ? CORACLE.far : CORACLE.near;
        return [c[0] - 44, c[1] - 26 - 40, 88, 90];
      }
      const b = bank(f, who);
      const s = (b === 'far' ? FAR_SLOTS : NEAR_SLOTS)[who];
      return [s[0] - 44, s[1] - 44, 88, 92];
    };
    ['kit', 'bird', 'figs'].forEach(who => { const [x, y, w, h] = place(who); chargeSpot(who, x, y, w, h); });

    // --- the coracle / pulley: cross ---
    const cc = pFar ? CORACLE.far : CORACLE.near;
    spots.push({
      id: 'coracle', x: cc[0] - 90, y: cc[1] - 50, w: 180, h: 110, label: 'The coracle',
      onInteract(game) { crossRiver(game); },
    });

    // --- the far-bank token (reachable only from the far bank) ---
    if (!(state.journal || []).some(e => e.id === 'token2')) {
      spots.push({
        id: 'token2', x: POST_F.x - 32, y: POST_F.top - 60, w: 64, h: 60, label: 'A disc on the far post',
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
      id: 'stairs', plate: 'the stone stairs', x: STAIRS.x, y: STAIRS.y, w: STAIRS.w, h: STAIRS.h, label: ferried ? 'The far stairs' : 'The sealed stairs',
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

  if (has(EATS[0][0]) && has(EATS[0][1])) {
    game.playSfx('wrong');
    game.say('You push off — and the kit\'s ears flatten, its whole body pouring toward the fledgling. You haul the coracle back to the bank just in time, heart going like a trapped moth. The Court counts what ARRIVES, and a half-eaten macaw arrives as nothing.');
    return;
  }
  if (has(EATS[1][0]) && has(EATS[1][1])) {
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
