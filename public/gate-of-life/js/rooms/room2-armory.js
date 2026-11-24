// CHAMBER 2 — The Armamentarium.
// Puzzle: dress the secutor dummy from mixed evidence — the mural (crestless
// chaser, griffin/sica, fish/net pairings), the drill-master's complaints
// (buckler=provocator, visor at the smith, net+trident not of this rack,
// spear=hoplomachus no brother), and wear-marks on the tall scutum.
// Answer: smooth helm · tall scutum · gladius.

import { registerItems } from '../../../shared/js/items.js';
import { kitDefs, shadow, wallDoor } from '../../../shared/js/scenekit.js';

registerItems({
  dolabra: {
    name: 'Dolabra',
    description: 'A legionary\'s pick-crowbar: axe-blade one side, pry-spike the other. The answer to most doors, given time.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 42 L30 14" stroke="#6b4f2c" stroke-width="5" stroke-linecap="round"/>
      <path d="M22 12 L36 8 L38 14 L28 18 Z" fill="#8a8f96" stroke="#3a3e44" stroke-width="1.5"/>
      <path d="M26 16 L18 6 L14 10 L22 18 Z" fill="#8a8f96" stroke="#3a3e44" stroke-width="1.5"/>
    </svg>`,
  },
  wool_rag: {
    name: 'Wool Rag',
    description: 'A fist of unwashed wool from the polishing bench. It wants to soak something up. That is its entire personality.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 26 q-4 -10 8 -12 q2 -8 12 -6 q10 -2 10 8 q8 4 2 12 q2 8 -8 10 q-6 6 -14 2 q-10 2 -10 -8 q-4 -2 0 -6z"
        fill="#cfc6b4" stroke="#8a7f6a" stroke-width="2"/>
      <path d="M18 22 q6 4 12 0 M16 30 q8 4 16 -2" stroke="#a8946c" stroke-width="1.6" fill="none"/>
    </svg>`,
  },
});

const HELMS = [
  { id: 'fish', label: 'Fish-crested bronze', art: 'art/arm-helm-fish.webp' },
  { id: 'griffin', label: 'Griffin-crested', art: 'art/arm-helm-griffin.webp' },
  { id: 'smooth', label: 'Smooth rounded, small eyeholes', art: 'art/arm-helm-smooth.webp' },
  { id: 'visor', label: 'Broad-brimmed, visored', art: 'art/arm-helm-visor.webp' },
];
const SHIELDS = [
  { id: 'scutum', label: 'Tall curved scutum', art: 'art/arm-shield-scutum.webp' },
  { id: 'square', label: 'Small square shield', art: 'art/arm-shield-square.webp' },
  { id: 'buckler', label: 'Round buckler', art: 'art/arm-shield-buckler.webp' },
  { id: 'net', label: 'Weighted net', art: 'art/arm-shield-net.webp' },
];
const WEAPONS = [
  { id: 'gladius', label: 'Straight short sword', art: 'art/arm-weap-gladius.webp' },
  { id: 'sica', label: 'Curved blade', art: 'art/arm-weap-sica.webp' },
  { id: 'trident', label: 'Trident', art: 'art/arm-weap-trident.webp' },
  { id: 'spear', label: 'Long spear', art: 'art/arm-weap-spear.webp' },
];

// id -> sprite, for the in-scene racks and the dressed dummy.
// the kit the inspection passes (the secutor's)
const RIGHT_KIT = { helm: 'smooth', shield: 'scutum', weapon: 'gladius' };
const KIT_ART = Object.fromEntries([...HELMS, ...SHIELDS, ...WEAPONS].map(k => [k.id, k.art]));

// Layout — the plate (art/armory.webp): a vaulted armoury with racks along both
// walls, wall torches, a plaster panel on the back wall, a practice-post in the
// middle of the floor, a whetstone wheel (right) and a bench (bottom-left).
const MURAL = { x: 640, y: 214, k: 0.68 };
const POST_DX = 12;
const TROUGH_DX = 230, TROUGH_DY = -70;
const DOOR = { x1: 1476, y1: 360, h1: 300, x2: 1590, y2: 316, h2: 400 };

export default {
  id: 'armory',
  solution: () => ['smooth', 'scutum', 'gladius'].filter(id => Object.values(RIGHT_KIT).includes(id)).map(id => ({ smooth: 'egg helm', scutum: 'scutum', gladius: 'gladius' })[id]),
  lintStates: [{ label: 'dressed', flags: { armory_dressed: true } }],
  title: 'The Armamentarium',
  intro: 'The armory runs long and vaulted under the stands, racked floor to arch with the iron trades of four kinds of dying, and at its center a practice dummy stands at attention wearing nothing but a wooden tag and an air of expectation.',

  scene(state) {
    const dressed = !!state.flags.armory_dressed;
    const lockerLooted = !!state.flags.armory_lockerLooted;

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${kitDefs()}
        <linearGradient id="gd_arm_wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#241f1a"/>
          <stop offset="1" stop-color="#332b23"/>
        </linearGradient>
        <linearGradient id="gd_arm_floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#2b2318"/>
          <stop offset="1" stop-color="#14100a"/>
        </linearGradient>
        <radialGradient id="gd_arm_torch" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(255,169,77,0.5)"/>
          <stop offset="1" stop-color="rgba(255,169,77,0)"/>
        </radialGradient>
        <linearGradient id="gd_arm_mural" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#3a3126"/>
          <stop offset="1" stop-color="#2b2318"/>
        </linearGradient>
      </defs>

      <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="art/armory.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="art/armory.mp4" type="video/mp4"/></video></foreignObject>

      <!-- warmth over the plate's painted wall-torches -->
      ${[[140, 330], [383, 420], [1447, 330], [1070, 440]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="60" ry="52" fill="url(#gd_arm_torch)" class="glow"/>`).join('')}

      <!-- the mural of the four brothers, painted into the plaster panel on the back wall -->
      <g data-mount="inset" transform="translate(${MURAL.x} ${MURAL.y}) scale(${MURAL.k}) translate(-620 -90)">
        <rect x="620" y="90" width="460" height="180" rx="8" fill="url(#gd_arm_mural)" stroke="#453a2e" stroke-width="4"/>
        ${[0, 1, 2, 3].map(i => {
          const x = 665 + i * 110;
          return `
          <g>
            <circle cx="${x + 20}" cy="150" r="18" fill="#8a7f6a"/>
            ${i === 0 ? `<path d="M${x + 6} 138 q14 -18 28 0" stroke="#c9a45f" stroke-width="5" fill="none"/><path d="M${x + 10} 128 q10 -8 20 0" stroke="#c9a45f" stroke-width="3" fill="none"/>` : ''}
            ${i === 1 ? `<path d="M${x + 8} 136 q6 -16 24 -8 l-6 8" stroke="#c9a45f" stroke-width="4" fill="none"/>` : ''}
            ${i === 3 ? `<path d="M${x + 2} 148 h36" stroke="#c9a45f" stroke-width="4"/>` : ''}
            <rect x="${x + 8}" y="170" width="24" height="46" rx="6" fill="#6b5a3a"/>
            <text x="${x + 20}" y="240" text-anchor="middle" font-size="16.9" fill="#c9b98f"
              font-family="Palatino Linotype, Georgia, serif">${['FISH', 'GRIFFIN', 'CHASER', 'NET-MAN'][i]}</text>
          </g>`;
        }).join('')}
        <text x="850" y="118" text-anchor="middle" font-size="16.9" fill="#cfc6b4" letter-spacing="4"
          font-family="Palatino Linotype, Georgia, serif">QVATTVOR FRATRES HARENAE</text>
      </g>

      <!-- helmet shelf, on iron brackets on the left wall (photoreal kit sprites) -->
      <g data-mount="bracket">
        ${[300, 520].map(x => `<path d="M${x} 397 L${x} 430 L${x + 26} 397 Z" fill="url(#sk_iron)" stroke="#111" stroke-width="1.5"/>`).join('')}
        <rect x="260" y="384" width="300" height="13" rx="6" fill="#3a3025"/>
        ${HELMS.map((h, i) => `<image href="${h.art}" x="${272 + i * 74}" y="298" width="66" height="92" preserveAspectRatio="xMidYMax meet"/>`).join('')}
      </g>

      <!-- shield rail, pegged into the right wall (photoreal kit sprites) -->
      <g data-mount="bracket">
        ${[1110, 1410].map(x => `<rect x="${x - 6}" y="292" width="12" height="28" rx="3" fill="#24262c"/>`).join('')}
        <rect x="1090" y="300" width="340" height="13" rx="6" fill="#3a3025"/>
        ${SHIELDS.map((s, i) => `<image href="${s.art}" x="${1100 + i * 86}" y="314" width="80" height="152" preserveAspectRatio="xMidYMin meet"/>`).join('')}
      </g>

      <!-- weapon rail, pegged into the left wall below the helmets (photoreal kit sprites) -->
      <g data-mount="bracket">
        ${[270, 550].map(x => `<rect x="${x - 6}" y="462" width="12" height="28" rx="3" fill="#24262c"/>`).join('')}
        <rect x="260" y="470" width="300" height="13" rx="6" fill="#3a3025"/>
        ${WEAPONS.map((w, i) => `<image href="${w.art}" x="${282 + i * 74}" y="484" width="58" height="150" preserveAspectRatio="xMidYMin meet"/>`).join('')}
      </g>

      <!-- the dummy: crossbar and head lashed to the painted practice-post at the centre of the floor -->
      <g data-mount="post" transform="translate(${POST_DX} 0)">
        <rect x="700" y="470" width="160" height="18" rx="8" fill="#6b4f2c"/>
        ${dressed
          ? `<image href="${KIT_ART.scutum}" x="688" y="430" width="104" height="182" preserveAspectRatio="xMidYMin meet"/>
             <image href="${KIT_ART.gladius}" x="826" y="470" width="46" height="150" preserveAspectRatio="xMidYMin meet"/>
             <image href="${KIT_ART.smooth}" x="740" y="352" width="80" height="90" preserveAspectRatio="xMidYMax meet"/>`
          : `<circle cx="780" cy="398" r="24" fill="#8a7f6a"/>
             <rect x="742" y="500" width="76" height="34" rx="6" fill="#e8dcc0" class="beckon"/>
             <text x="780" y="522" text-anchor="middle" font-size="15" fill="#5a4218"
               font-family="Palatino Linotype, Georgia, serif">SECVTOR</text>`}
      </g>

      <!-- drill-master's tablet on a stand -->
      <g data-mount="post">
        ${shadow(959, 682, 50, 8)}
        <rect x="950" y="560" width="18" height="120" fill="#453a2e"/>
        <rect x="905" y="500" width="110" height="76" rx="6" fill="#6b4f2c" transform="rotate(-8 960 538)"/>
        <rect x="915" y="508" width="90" height="60" rx="4" fill="#1d1812" transform="rotate(-8 960 538)"/>
      </g>

      <!-- the whetstone wheel is painted (right); its water-trough sits on the floor below it -->
      <g data-mount="floor" transform="translate(${TROUGH_DX} ${TROUGH_DY})">
        ${shadow(1255, 798, 130, 10)}
        <path d="M1140 780 h230 a12 12 0 0 1 -12 16 h-206 a12 12 0 0 1 -12 -16 z" fill="#453a2e"/>
        <ellipse cx="1255" cy="782" rx="100" ry="10" fill="#c9a45f" opacity="0.6"/>
        ${!state.journal.some(e => e.id === 'token2') ? `<circle cx="1290" cy="780" r="6" fill="#e8dcc0" class="beckon"/>` : ''}
      </g>

      <!-- maintenance locker, standing on the floor -->
      <g data-mount="floor">
        ${shadow(535, 822, 110, 10)}
        <rect x="440" y="690" width="190" height="130" rx="8" fill="#3a2d1c" stroke="#241f1a" stroke-width="5"/>
        ${dressed
          ? `<rect x="452" y="702" width="166" height="106" rx="5" fill="#171209"/>
             ${lockerLooted ? '' : `<path d="M480 780 L520 740" stroke="#8a8f96" stroke-width="6" stroke-linecap="round" class="beckon"/><path d="M545 760 q14 -10 28 0 q-6 12 -28 8z" fill="#cfc6b4" class="beckon"/>`}`
          : `<rect x="452" y="702" width="166" height="106" rx="5" fill="#2b2015"/>
             <path d="M525 690 v-30 q0 -18 -60 -22" stroke="#5c5546" stroke-width="8" fill="none"/>
             <circle cx="535" cy="748" r="10" fill="#171209" stroke="#5c5546" stroke-width="3"/>`}
      </g>

      <!-- practice sword rack (flavor), pegged to the left wall -->
      <g data-mount="bracket" transform="translate(-30 120)">
        <rect x="70" y="330" width="120" height="12" rx="5" fill="#453a2e"/>
        ${[92, 118, 144].map(x => `<path d="M${x} 342 v70 M${x - 7} 350 h14" stroke="#6b4f2c" stroke-width="5"/>`).join('')}
      </g>

      <!-- cold forge (flavor), on the floor beside the painted bench -->
      <g data-mount="floor" transform="translate(130 30)">
        ${shadow(150, 762, 100, 10)}
        <path d="M60 760 h180 l-20 -60 h-140 z" fill="#3a3126"/>
        <ellipse cx="150" cy="700" rx="55" ry="14" fill="#171209"/>
        <ellipse cx="150" cy="698" rx="30" ry="8" fill="#2b2318"/>
      </g>

      <!-- the far door, in the right wall: barred until the inspection passes -->
      ${wallDoor({ ...DOOR, open: dressed, barred: !dressed, label: dressed ? 'OPEN' : 'INSPECTION' })}
      <path d="M0 900 L0 862 Q800 906 1600 862 L1600 900 Z" fill="#0a0705"/>
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const dressed = !!state.flags.armory_dressed;

    spots.push({
      id: 'dummy', x: 690 + POST_DX, y: 380, w: 190, h: 310, label: dressed ? 'The dressed dummy' : 'The practice dummy',
      onInteract(game) {
        const html = `<div class="wax-tablet"><div class="tab-title">The wooden tag</div>
          <em class="tab-carve">SECVTOR — "the chaser", who follows the net-man.
          Dress him true for inspection.</em></div>`;
        game.journal.add('note_dummy', { title: "The dummy's tag (Armamentarium)", category: 'note', html });
        if (dressed) {
          game.say('The dummy stands correct to the last strap: egg-smooth helm, tall scutum, straight gladius. The inspection bell has nothing to say, which is how you know it approves.');
        } else {
          openDressing(game);
        }
      },
    });

    spots.push({
      id: 'mural', x: MURAL.x, y: MURAL.y, w: 460 * MURAL.k, h: 180 * MURAL.k, label: 'The mural of the four brothers',
      onInteract(game) {
        const html = `<div class="wax-tablet"><div class="tab-title">The mural's painted caption</div>
          <em class="tab-carve">Four brothers of the sand: the FISH-CREST fights the
          net-man; the GRIFFIN rides the curved knife; the CHASER wears no crest at all,
          that the net may find no hold on him.</em></div>`;
        game.journal.add('note_mural', { title: 'The four brothers (Armamentarium)', category: 'note', html });
        game.dialog({ title: 'The Four Brothers', html });
      },
    });

    spots.push({
      id: 'slate', x: 890, y: 490, w: 140, h: 190, label: "The drill-master's tablet",
      onInteract(game) {
        const html = `<div class="wax-tablet"><div class="tab-title">Complaints, again</div>
          <em class="tab-carve">The thraex has swapped his little square shield for the
          buckler — the buckler is the provocator's. The provocator's brimmed visor is at
          the smith for a new hinge — he drills bare-headed and complains. The net and
          trident are the net-man's own kit and belong to no rack of mine. The long spear
          is the hoplomachus's — he is no brother of this school, and his spear is
          mis-shelved.</em></div>`;
        game.journal.add('note_slate', { title: "Drill-master's complaints (Armamentarium)", category: 'note', html });
        game.dialog({ title: "The Drill-Master's Tablet", html });
      },
    });

    spots.push({
      id: 'helms', x: 250, y: 300, w: 320, h: 110, label: 'The helmet rack',
      onInteract(game) {
        game.say('Four pegs: a bronze helm crested with a fish; one crested with a griffin; one smooth as an egg, all curve and small eyeholes; and one broad-brimmed with a hinged visor, tagged for the smith.');
      },
    });

    spots.push({
      id: 'shields', x: 1080, y: 290, w: 360, h: 210, label: 'The shield rack',
      onInteract(game) {
        const html = `<p>A tall curved scutum, a small square shield, a round buckler —
          and an empty outline in chalk where a weighted net should hang.</p>
          <p><em>The scutum's grip is worn smooth by two different hands — one broad, one
          narrow. Two brothers share this pattern of shield.</em></p>`;
        game.journal.add('note_scutum', { title: 'Wear on the tall scutum (Armamentarium)', category: 'note', html });
        game.dialog({ title: 'The Shield Rack', html });
      },
    });

    spots.push({
      id: 'weapons', x: 250, y: 460, w: 320, h: 150, label: 'The weapon rack',
      onInteract(game) {
        game.say('A straight short sword, a curved blade, a trident, a long spear. The curved blade\'s rack hook has been bent into a griffin-beak curve by years of the same weight — somebody\'s habit, written in iron.');
      },
    });

    if (!state.journal.some(e => e.id === 'token2')) {
      spots.push({
        id: 'trough', x: 1130 + TROUGH_DX, y: 740 + TROUGH_DY, w: 230, h: 90, label: 'The whetstone trough',
        onInteract(game) {
          game.journal.add('token2', {
            title: 'in the whetstone trough', category: 'sun',
            sun: { rays: 1, letter: 'M', emblem: 'spear' },
          });
          game.say('Half-buried in the wet grinding-sand: a bone tessera. The scratched emblem is a long spear; the letter is M. Felix\'s hand again — patient, deliberate, hidden exactly where a bored winch-boy would never rake.');
        },
      });
    }

    if (dressed && !state.flags.armory_lockerLooted) {
      spots.push({
        id: 'locker', x: 430, y: 680, w: 210, h: 150, label: 'The maintenance locker',
        onInteract(game) {
          game.setFlag('armory_lockerLooted');
          game.addItem('dolabra', { from: { x: 500, y: 760 } });
          game.addItem('wool_rag', { from: { x: 560, y: 760 } });
          game.say('The release chain dropped the locker door with the inspection: inside, a legionary dolabra — pick, pry-bar, and argument-settler — and a fist of wool from the polishing bench. Salvage protocol. Felix would approve.');
          game.refreshScene();
        },
      });
    }

    spots.push({
      id: 'practice', x: 30, y: 440, w: 150, h: 100, label: 'Practice swords',
      onInteract(game) {
        game.say('Wooden swords for drill — every one dented, none of them a rudis. A real one is earned, not shelved. Somewhere a lanista keeps a ledger of who has earned what, and the ledger is the whole of the law down here.');
      },
    });

    spots.push({
      id: 'forge', x: 180, y: 720, w: 210, h: 100, label: 'The cold forge',
      onInteract(game) {
        game.say('The forge is cold and has been for years — since the fire closed the western works, nobody has trusted flame this side of the hypogeum. The anvil wears a skin of dust like it is embarrassed.');
      },
    });

    spots.push({
      id: 'door', x: 1470, y: 300, w: 128, h: 420, label: dressed ? 'To the shrine corridor' : 'The barred door',
      onInteract(game) {
        if (!dressed) {
          game.say('Barred from the far side, and the bar answers to the inspection bell. The dummy passes muster or nobody does. The tag on its chest is where you would start.');
          return;
        }
        if (!game.hasItem('dolabra') || !game.hasItem('wool_rag')) {
          game.say('The lion looks from you to the open locker and back, with the patience of a creature that has watched men forget things for twenty years. The dolabra and the wool come with us.');
          return;
        }
        if (!game.journal.has('token2')) {
          game.say('"The trough," says Gus, nosing toward the whetstone. "Bone does not glint like that on its own. Felix left it for you, not for the sand."');
          return;
        }
        game.say('The bar lifts on its counterweight and the corridor beyond breathes incense and old smoke — the shrine is close.');
        game.completeRoom({ delay: 700 });
      },
    });

    return spots;
  },

  hints: [
    { text: 'The dummy is dressed by rumor: a mural of four brothers, a drill-master who writes down every complaint, and wear-marks on the gear itself.', cost: 60 },
    { text: 'The chaser is the crestless one whose only crestless rival is at the smith; his shield he shares with a second pair of hands; his blade is whatever the complaints have not already given away.', cost: 120 },
    { text: 'Smooth egg helm, tall scutum, straight gladius. Sound the inspection.', cost: 240 },
  ],
};

function openDressing(game) {
  const pick = { helm: null, shield: null, weapon: null };

  game.openPuzzle({
    id: 'armory_dummy',
    title: 'Dress the Secutor',
    wide: true,
    render(body, api) {
      body.innerHTML = `
        <div class="puzzle-hero" style="background-image:url(art/pz-armory.webp)"></div>
        <p class="puzzle-desc">The tag says SECVTOR — "the chaser", who follows the
        net-man. The inspection bell knows his kit even if you don't yet. Choose one of
        each; the racks are labeled only by what the gear looks like.</p>
        <div class="kit-cols" id="arm-cols"></div>
        <div class="puzzle-row"><button class="btn btn-primary" id="arm-try">Sound the Inspection</button></div>
        <div class="puzzle-feedback"></div>`;

      const cols = body.querySelector('#arm-cols');
      const groups = [
        { key: 'helm', title: 'Helmet', opts: HELMS },
        { key: 'shield', title: 'Shield', opts: SHIELDS },
        { key: 'weapon', title: 'Weapon', opts: WEAPONS },
      ];
      for (const g of groups) {
        const col = document.createElement('div');
        col.className = 'kit-col';
        col.innerHTML = `<div class="kit-col-title">${g.title}</div>`;
        for (const opt of g.opts) {
          const el = document.createElement('button');
          el.className = 'kit-opt';
          el.innerHTML = `<img class="kit-opt-img" src="${opt.art}" alt="" draggable="false"><span>${opt.label}</span>`;
          el.addEventListener('click', () => {
            pick[g.key] = opt.id;
            col.querySelectorAll('.kit-opt').forEach(b => b.classList.remove('on'));
            el.classList.add('on');
            game.playSfx('click');
          });
          col.appendChild(el);
        }
        cols.appendChild(col);
      }

      body.querySelector('#arm-try').addEventListener('click', () => {
        if (!pick.helm || !pick.shield || !pick.weapon) {
          api.setFeedback('The dummy is missing pieces. The bell declines to embarrass you both.', 'bad');
          return;
        }
        if (Object.entries(RIGHT_KIT).every(([k, v]) => pick[k] === v)) {
          game.setFlag('armory_dressed');
          game.playSfx('bell');
          api.solved({ message: 'The inspection bell rings once, clean and satisfied, and somewhere in the wall a counterweight lets the door bar go. The locker under the bench drops open with the same clatter — maintenance passes muster too.' });
          game.refreshScene();
        } else {
          api.fail('The bell gives a flat, mocking clonk. Somewhere a drill-master is composing a complaint about you.');
        }
      });
    },
  });
}
