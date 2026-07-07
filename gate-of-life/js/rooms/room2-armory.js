// CHAMBER 2 — The Armamentarium.
// Puzzle: dress the secutor dummy from mixed evidence — the mural (crestless
// chaser, griffin/sica, fish/net pairings), the drill-master's complaints
// (buckler=provocator, visor at the smith, net+trident not of this rack,
// spear=hoplomachus no brother), and wear-marks on the tall scutum.
// Answer: smooth helm · tall scutum · gladius.

import { registerItems } from '../../../shared/js/items.js';

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
  { id: 'fish', label: 'Fish-crested bronze' },
  { id: 'griffin', label: 'Griffin-crested' },
  { id: 'smooth', label: 'Smooth rounded, small eyeholes' },
  { id: 'visor', label: 'Broad-brimmed, visored' },
];
const SHIELDS = [
  { id: 'scutum', label: 'Tall curved scutum' },
  { id: 'square', label: 'Small square shield' },
  { id: 'buckler', label: 'Round buckler' },
  { id: 'net', label: 'Weighted net' },
];
const WEAPONS = [
  { id: 'gladius', label: 'Straight short sword' },
  { id: 'sica', label: 'Curved blade' },
  { id: 'trident', label: 'Trident' },
  { id: 'spear', label: 'Long spear' },
];

export default {
  id: 'armory',
  title: 'The Armamentarium',
  intro: 'The armory runs long and vaulted under the stands, racked floor to arch with the iron trades of four kinds of dying, and at its center a practice dummy stands at attention wearing nothing but a wooden tag and an air of expectation.',

  scene(state) {
    const dressed = !!state.flags.armory_dressed;
    const lockerLooted = !!state.flags.armory_lockerLooted;

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
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

      <rect width="1600" height="640" fill="url(#gd_arm_wall)"/>
      <!-- vault ribs -->
      <g stroke="#171209" stroke-width="10" fill="none" opacity="0.8">
        <path d="M0 200 Q400 40 800 200"/>
        <path d="M800 200 Q1200 40 1600 200"/>
      </g>
      <rect y="640" width="1600" height="260" fill="url(#gd_arm_floor)"/>

      <!-- torches -->
      ${[240, 1360].map(x => `
      <g>
        <rect x="${x - 7}" y="330" width="14" height="64" rx="4" fill="#3a2b18"/>
        <ellipse cx="${x}" cy="314" rx="42" ry="36" fill="url(#gd_arm_torch)" class="glow"/>
        <path class="torch-flame" d="M${x} 330 q12 -20 0 -36 q-12 16 0 36z" fill="#ffa94d"/>
        <path class="torch-flame" d="M${x} 328 q6 -11 0 -20 q-6 9 0 20z" fill="#ffd9a0"/>
      </g>`).join('')}

      <!-- the mural of the four brothers, upper center -->
      <g>
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
            <text x="${x + 20}" y="238" text-anchor="middle" font-size="11" fill="#c9b98f"
              font-family="Palatino Linotype, Georgia, serif">${['FISH', 'GRIFFIN', 'CHASER', 'NET-MAN'][i]}</text>
          </g>`;
        }).join('')}
        <text x="850" y="118" text-anchor="middle" font-size="14" fill="#cfc6b4" letter-spacing="4"
          font-family="Palatino Linotype, Georgia, serif">QVATTVOR FRATRES HARENAE</text>
      </g>

      <!-- helmet rack, left -->
      <g>
        <rect x="260" y="310" width="300" height="16" rx="6" fill="#453a2e"/>
        ${[0, 1, 2, 3].map(i => {
          const x = 290 + i * 72;
          return `
          <g>
            <path d="M${x} 386 v-16 a20 22 0 0 1 40 0 v16 z" fill="#8a8f96" stroke="#3a3e44" stroke-width="3"/>
            ${i === 0 ? `<path d="M${x + 2} 356 q18 -22 36 0" stroke="#c9a227" stroke-width="5" fill="none"/>` : ''}
            ${i === 1 ? `<path d="M${x + 6} 354 q8 -18 28 -10 l-8 10" stroke="#c9a227" stroke-width="4" fill="none"/>` : ''}
            ${i === 2 ? `<circle cx="${x + 13}" cy="372" r="3" fill="#241f1a"/><circle cx="${x + 27}" cy="372" r="3" fill="#241f1a"/>` : ''}
            ${i === 3 ? `<path d="M${x - 6} 366 h52" stroke="#8a8f96" stroke-width="5"/><rect x="${x + 8}" y="366" width="24" height="12" rx="3" fill="#5c6068"/>` : ''}
          </g>`;
        }).join('')}
      </g>

      <!-- shield rack, right -->
      <g>
        <rect x="1090" y="300" width="340" height="16" rx="6" fill="#453a2e"/>
        <rect x="1104" y="326" width="64" height="150" rx="16" fill="#8e2f35" stroke="#3a1215" stroke-width="4"/>
        <line x1="1136" y1="326" x2="1136" y2="476" stroke="#c9a227" stroke-width="4"/>
        <rect x="1194" y="342" width="66" height="66" rx="8" fill="#5a4426" stroke="#2b2015" stroke-width="4"/>
        <circle cx="1318" cy="380" r="38" fill="#6b5a3a" stroke="#2b2015" stroke-width="4"/>
        <circle cx="1318" cy="380" r="9" fill="#c9a227"/>
        <path d="M1370 330 q40 30 22 92 q-30 10 -44 -14 q-12 -40 6 -74 z" fill="none" stroke="#8a7f6a" stroke-width="3" stroke-dasharray="6 5"/>
      </g>

      <!-- weapon rack, left lower -->
      <g>
        <rect x="260" y="470" width="300" height="14" rx="6" fill="#453a2e"/>
        <path d="M300 484 l0 96" stroke="#8a8f96" stroke-width="8"/>
        <path d="M292 484 h16 l-8 -18 z" fill="#8a8f96"/>
        <path d="M370 484 q18 40 -4 92" stroke="#8a8f96" stroke-width="7" fill="none"/>
        <path d="M448 484 v96 M436 484 l12 -20 l12 20 M424 492 h48" stroke="#8a8f96" stroke-width="5" fill="none"/>
        <path d="M522 484 v110" stroke="#6b4f2c" stroke-width="6"/>
        <path d="M516 484 h12 l-6 -26 z" fill="#8a8f96"/>
      </g>

      <!-- the dummy, center -->
      <g>
        <rect x="770" y="420" width="20" height="260" rx="8" fill="#6b4f2c"/>
        <rect x="700" y="470" width="160" height="18" rx="8" fill="#6b4f2c"/>
        ${dressed
          ? `<path d="M756 420 v-14 a24 26 0 0 1 48 0 v14 z" fill="#8a8f96" stroke="#3a3e44" stroke-width="3"/>
             <circle cx="772" cy="404" r="3" fill="#241f1a"/><circle cx="788" cy="404" r="3" fill="#241f1a"/>
             <rect x="690" y="440" width="58" height="140" rx="14" fill="#8e2f35" stroke="#3a1215" stroke-width="4"/>
             <line x1="719" y1="440" x2="719" y2="580" stroke="#c9a227" stroke-width="3"/>
             <path d="M846 480 l30 60" stroke="#8a8f96" stroke-width="7" stroke-linecap="round"/>
             <path d="M840 472 h16 l-8 -18 z" fill="#8a8f96"/>`
          : `<circle cx="780" cy="398" r="24" fill="#8a7f6a"/>
             <rect x="742" y="500" width="76" height="34" rx="6" fill="#e8dcc0" class="beckon"/>
             <text x="780" y="522" text-anchor="middle" font-size="15" fill="#5a4218"
               font-family="Palatino Linotype, Georgia, serif">SECVTOR</text>`}
      </g>

      <!-- drill-master's tablet on a stand -->
      <g>
        <rect x="950" y="560" width="18" height="120" fill="#453a2e"/>
        <rect x="905" y="500" width="110" height="76" rx="6" fill="#6b4f2c" transform="rotate(-8 960 538)"/>
        <rect x="915" y="508" width="90" height="60" rx="4" fill="#1d1812" transform="rotate(-8 960 538)"/>
      </g>

      <!-- whetstone wheel + trough -->
      <g>
        <circle cx="1250" cy="720" r="58" fill="#5c5546" stroke="#2b2318" stroke-width="6"/>
        <circle cx="1250" cy="720" r="10" fill="#2b2318"/>
        <path d="M1140 780 h230 a12 12 0 0 1 -12 16 h-206 a12 12 0 0 1 -12 -16 z" fill="#453a2e"/>
        <ellipse cx="1255" cy="782" rx="100" ry="10" fill="#c9a45f" opacity="0.6"/>
        ${!state.journal.some(e => e.id === 'token2') ? `<circle cx="1290" cy="780" r="6" fill="#e8dcc0" class="beckon"/>` : ''}
      </g>

      <!-- maintenance locker -->
      <g>
        <rect x="440" y="690" width="190" height="130" rx="8" fill="#3a2d1c" stroke="#241f1a" stroke-width="5"/>
        ${dressed
          ? `<rect x="452" y="702" width="166" height="106" rx="5" fill="#171209"/>
             ${lockerLooted ? '' : `<path d="M480 780 L520 740" stroke="#8a8f96" stroke-width="6" stroke-linecap="round" class="beckon"/><path d="M545 760 q14 -10 28 0 q-6 12 -28 8z" fill="#cfc6b4" class="beckon"/>`}`
          : `<rect x="452" y="702" width="166" height="106" rx="5" fill="#2b2015"/>
             <path d="M525 690 v-30 q0 -18 -60 -22" stroke="#5c5546" stroke-width="8" fill="none"/>
             <circle cx="535" cy="748" r="10" fill="#171209" stroke="#5c5546" stroke-width="3"/>`}
      </g>

      <!-- practice sword rack (flavor) -->
      <g>
        <rect x="70" y="330" width="120" height="12" rx="5" fill="#453a2e"/>
        ${[92, 118, 144].map(x => `<path d="M${x} 342 v70 M${x - 7} 350 h14" stroke="#6b4f2c" stroke-width="5"/>`).join('')}
      </g>

      <!-- cold forge (flavor) -->
      <g>
        <path d="M60 760 h180 l-20 -60 h-140 z" fill="#3a3126"/>
        <ellipse cx="150" cy="700" rx="55" ry="14" fill="#171209"/>
        <ellipse cx="150" cy="698" rx="30" ry="8" fill="#2b2318"/>
      </g>

      <!-- barred far door -->
      <g>
        <path d="M1460 640 L1460 330 Q1530 290 1596 330 L1596 640 Z" fill="${dressed ? '#0f0c08' : '#2b2015'}" stroke="#241f1a" stroke-width="7"/>
        ${dressed
          ? `<text x="1528" y="470" text-anchor="middle" font-size="13" fill="#e8cf96" class="flicker"
               font-family="Palatino Linotype, Georgia, serif">open</text>`
          : `<line x1="1452" y1="470" x2="1600" y2="470" stroke="#5c5546" stroke-width="14"/>
             <text x="1528" y="440" text-anchor="middle" font-size="12" fill="#8a7f6a"
               font-family="Palatino Linotype, Georgia, serif">INSPECTION</text>`}
      </g>

      <path d="M0 900 L0 862 Q800 906 1600 862 L1600 900 Z" fill="#0a0705"/>
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const dressed = !!state.flags.armory_dressed;

    spots.push({
      id: 'dummy', x: 690, y: 380, w: 190, h: 310, label: dressed ? 'The dressed dummy' : 'The practice dummy',
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
      id: 'mural', x: 620, y: 250, w: 460, h: 60, label: 'The mural of the four brothers',
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
        id: 'trough', x: 1130, y: 740, w: 250, h: 90, label: 'The whetstone trough',
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
      id: 'practice', x: 60, y: 320, w: 150, h: 100, label: 'Practice swords',
      onInteract(game) {
        game.say('Wooden swords for drill — every one dented, none of them a rudis. A real one is earned, not shelved. Somewhere a lanista keeps a ledger of who has earned what, and the ledger is the whole of the law down here.');
      },
    });

    spots.push({
      id: 'forge', x: 50, y: 690, w: 210, h: 100, label: 'The cold forge',
      onInteract(game) {
        game.say('The forge is cold and has been for years — since the fire closed the western works, nobody has trusted flame this side of the hypogeum. The anvil wears a skin of dust like it is embarrassed.');
      },
    });

    spots.push({
      id: 'door', x: 1450, y: 320, w: 148, h: 330, label: dressed ? 'To the shrine corridor' : 'The barred door',
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
          el.textContent = opt.label;
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
        if (pick.helm === 'smooth' && pick.shield === 'scutum' && pick.weapon === 'gladius') {
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
