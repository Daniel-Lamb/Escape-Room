// CHAMBER 1 — The Carcer. Tutorial difficulty.
// Puzzle: Felix's verse is an acrostic — line initials spell ARENA — and the
// door's letter-lock has five tumblers cycling A E N R S V.
// Teaches item-on-hotspot: the strigil levers the drain grate -> tessera 1
// (egg-helm, "S").

import { registerItems } from '../../../shared/js/items.js';

registerItems({
  strigil: {
    name: 'Strigil',
    description: 'A bent bronze scraper for sluicing oil and grime off skin. Bathhouse junk. Flat, though. And strong.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 40 L22 22 Q26 12 36 10 Q40 10 39 14 Q34 16 30 24 L18 42 Z"
        fill="#b8893a" stroke="#5c3a12" stroke-width="2" stroke-linejoin="round"/>
      <path d="M24 22 Q28 13 36 11" stroke="#e8d0a0" stroke-width="1.5" fill="none"/>
      <rect x="10" y="38" width="10" height="6" rx="3" fill="#6b4f2c"/>
    </svg>`,
  },
});

const RING_LETTERS = ['A', 'E', 'N', 'R', 'S', 'V'];

export default {
  id: 'carcer',
  title: 'The Carcer',
  intro: 'You wake in straw that is not yours, in a cell the turnkey called "the old carcer" with the satisfaction of a man shelving a problem, and through the floor comes the long breathing roar of eighty thousand people who have come to watch the games that end, at midday, with you.',

  scene(state) {
    const lockOpen = !!state.flags.carcer_lockOpen;
    const grateOpen = !!state.flags.carcer_grateOpen;
    const strigilHere = !state.flags.carcer_strigilTaken;

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gd_car_wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#241f1a"/>
          <stop offset="1" stop-color="#332b23"/>
        </linearGradient>
        <linearGradient id="gd_car_floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#2b2318"/>
          <stop offset="1" stop-color="#171209"/>
        </linearGradient>
        <radialGradient id="gd_car_shaft" cx="0.5" cy="0" r="1">
          <stop offset="0" stop-color="rgba(232,207,150,0.35)"/>
          <stop offset="1" stop-color="rgba(232,207,150,0)"/>
        </radialGradient>
        <radialGradient id="gd_car_torch" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(255,169,77,0.55)"/>
          <stop offset="1" stop-color="rgba(255,169,77,0)"/>
        </radialGradient>
      </defs>

      <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="art/carcer.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="art/carcer.mp4" type="video/mp4"/></video></foreignObject>

      <!-- barred slit window + daylight shaft are painted into the plate (upper right);
           the window hotspot below points at it. -->


      <!-- torch beside the door -->
      <g>
        <rect x="1090" y="300" width="14" height="70" rx="4" fill="#3a2b18"/>
        <ellipse cx="1097" cy="282" rx="46" ry="40" fill="url(#gd_car_torch)" class="glow"/>
        <path class="torch-flame" d="M1097 300 q13 -22 0 -40 q-13 18 0 40z" fill="#ffa94d"/>
        <path class="torch-flame" d="M1097 298 q7 -13 0 -24 q-7 11 0 24z" fill="#ffd9a0"/>
      </g>

      <!-- Felix's verse wall, left-center (art only; hotspot sits below the reserve) -->
      <g opacity="0.9">
        <rect x="300" y="270" width="330" height="260" rx="6" fill="#2b241c"/>
        ${[300, 336, 372, 408, 444].map((y, i) => `
          <text x="320" y="${y + 26}" font-size="17" fill="#c9b98f" opacity="0.8"
            font-family="Palatino Linotype, Georgia, serif" font-style="italic">${
              ['All my days I counted grains…', 'Remember: sand forgets…', 'Every door they locked…', 'Nothing holds the man…', 'Ask the walls…'][i]
            }</text>`).join('')}
        <text x="560" y="516" font-size="16" fill="#c9a227" font-family="Palatino Linotype, Georgia, serif" font-style="italic">— F.</text>
      </g>

      <!-- manacles on the wall -->
      <g stroke="#453a2e" stroke-width="7" fill="none">
        <path d="M760 320 q0 40 -24 56"/>
        <path d="M820 320 q0 40 24 56"/>
        <circle cx="732" cy="386" r="17"/>
        <circle cx="848" cy="386" r="17"/>
      </g>

      <!-- the door: iron-strapped oak with the merchant's letter-lock (photoreal sprite) -->
      <g>
        ${lockOpen
          ? `<path d="M1180 662 L1180 300 Q1290 244 1400 300 L1400 662 Z" fill="#0b0906" stroke="#241f1a" stroke-width="6"/>
             <path d="M1202 662 L1202 322 Q1290 272 1378 322 L1378 662" fill="none" stroke="rgba(232,207,150,0.28)" stroke-width="3"/>
             <text x="1290" y="486" text-anchor="middle" font-size="15" fill="#e8cf96" class="flicker"
               font-family="Palatino Linotype, Georgia, serif">ajar</text>`
          : `<image href="art/car-door.webp" x="1174" y="284" width="246" height="382" preserveAspectRatio="xMidYMid meet"/>
             <g class="beckon"><ellipse cx="1298" cy="474" rx="40" ry="40" fill="url(#gd_car_torch)"/></g>`}
      </g>

      <!-- straw pallet, lower left (photoreal sprite) -->
      <g>
        <image href="art/car-pallet.webp" x="108" y="694" width="360" height="150" preserveAspectRatio="xMidYMid meet"/>
        ${strigilHere ? `<g class="beckon"><path d="M300 742 L332 720 Q340 714 346 716" stroke="#d8b46a" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="300" cy="744" r="5" fill="#e8d0a0"/></g>` : ''}
      </g>

      <!-- drain grate, lower middle-right (photoreal sprite) -->
      <g>
        ${grateOpen
          ? `<ellipse cx="915" cy="774" rx="86" ry="30" fill="#050302"/>
             <image href="art/car-grate.webp" x="948" y="700" width="150" height="120" transform="rotate(-22 1023 760)" preserveAspectRatio="xMidYMid meet"/>`
          : `<image href="art/car-grate.webp" x="812" y="712" width="206" height="122" preserveAspectRatio="xMidYMid meet"/>`}
      </g>

      <!-- old small bones in the far corner -->
      <g stroke="#cfc6b4" stroke-width="4" stroke-linecap="round" opacity="0.7">
        <path d="M80 620 l44 12 M100 644 l40 -6 M136 626 l16 18"/>
        <circle cx="70" cy="616" r="7" fill="#cfc6b4" stroke="none"/>
      </g>

      <!-- sand sifting from the planks above -->
      <g fill="#c9a45f" opacity="0.35">
        <circle cx="620" cy="120" r="2" class="float"/>
        <circle cx="660" cy="200" r="1.6" class="float" style="animation-delay:-2s"/>
        <circle cx="588" cy="260" r="1.4" class="float" style="animation-delay:-4s"/>
      </g>

      <path d="M0 900 L0 862 Q800 906 1600 862 L1600 900 Z" fill="#0a0705"/>
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const lockOpen = !!state.flags.carcer_lockOpen;

    spots.push({
      id: 'verse', x: 290, y: 260, w: 350, h: 280, label: "A verse in the plaster",
      onInteract(game) {
        const html = `<div class="wax-tablet"><div class="tab-title">Scratched deep in the plaster</div>
          <em class="tab-carve">
          <strong>A</strong>ll my days I counted grains instead of hours.<br>
          <strong>R</strong>emember: sand forgets each man it swallows.<br>
          <strong>E</strong>very door they locked, I learned the hinges of.<br>
          <strong>N</strong>othing holds the man the sand has taught.<br>
          <strong>A</strong>sk the walls; the walls were paid to answer.<br><br>
          — F. <span style="opacity:0.75">Read me down the margin.</span></em></div>`;
        game.journal.add('note_verse', { title: "Felix's verse (Carcer)", category: 'note', html });
        game.dialog({ title: 'The Verse on the Wall', html });
      },
    });

    if (!state.flags.carcer_strigilTaken) {
      spots.push({
        id: 'pallet', x: 110, y: 690, w: 350, h: 130, label: 'The straw pallet',
        onInteract(game) {
          game.setFlag('carcer_strigilTaken');
          game.addItem('strigil', { from: { x: 370, y: 730 } });
          game.say('Under the straw, a bent bronze strigil — the thing a bathhouse lends you to scrape yourself clean. Junk. Flat, strong junk. It comes with you.');
          game.refreshScene();
        },
      });
    }

    if (!state.journal.some(e => e.id === 'token1')) {
      spots.push({
        id: 'drain', x: 810, y: 720, w: 210, h: 110, label: 'The drain grate',
        onInteract(game) {
          if (game.selectedItem === 'strigil') {
            game.setFlag('carcer_grateOpen');
            game.playSfx('stone');
            game.journal.add('token1', {
              title: 'under the carcer drain', category: 'sun',
              sun: { rays: 3, letter: 'S', emblem: 'egg-helm' },
            });
            game.say('The strigil slides into the seam and the grate levers up. Wedged beneath: a bone tessera — a gladiator\'s name-token. The scratched emblem is a smooth egg-helm; the letter, in a carpenter\'s neat hand, is S. Felix never left a marker where a guard would sweep.');
            game.refreshScene();
          } else {
            game.say('An iron grate, seated flush. Your fingers find no purchase in the seam — something flat and strong might. There is a glint of bone down in the dark of it.');
          }
        },
      });
    }

    spots.push({
      id: 'window', x: 1160, y: 60, w: 260, h: 150, label: 'The barred window',
      onInteract(game) {
        game.say('High and barred, and through it the sky and the roar. The sun is climbing. When it stands straight overhead, the lifts come down for the condemned — you drew the schedule yourself, in better days.');
      },
    });

    spots.push({
      id: 'manacles', x: 700, y: 290, w: 180, h: 130, label: 'Old manacles',
      onInteract(game) {
        game.say('Rusted open, mercifully. Whoever wore these last has been gone a long time. The wall around them is polished smooth at shoulder height, the way stone gets when a man leans and waits.');
      },
    });

    spots.push({
      id: 'bones', x: 40, y: 570, w: 150, h: 110, label: 'Small bones',
      onInteract(game) {
        game.say('Old bones in the corner — too small for a man. A dog\'s, by the jaw. Beyond the bars, the lion gives you a long, offended look, as if to say: you counted.');
      },
    });

    spots.push({
      id: 'door', x: 1170, y: 290, w: 240, h: 380,
      label: lockOpen ? 'The open door' : 'The chained door',
      onInteract(game) {
        if (!lockOpen) { openLetterLock(game); return; }
        if (!game.hasItem('strigil')) {
          game.say('A memory that sounds like a site-foreman: nothing unbolted stays behind. The straw is still hiding something flat and useful.');
          return;
        }
        if (!game.journal.has('token1')) {
          game.say('The lion pads into the doorway and sits, immovable as paperwork. "The drain. Felix never left a marker where a guard would sweep." You could argue with a lion. You elect not to.');
          return;
        }
        game.say('The old door swings on hinges Felix once oiled, into the torch-dark of the armory corridor.');
        game.completeRoom({ delay: 700 });
      },
    });

    return spots;
  },

  onEnter(game) {
    if (!game.getFlag('carcer_gusMet')) {
      game.setFlag('carcer_gusMet');
      game.say('Something enormous pads past the bars and settles outside your cell: a lion, old and vast, one ear ragged. "You may call me Gus," he says, as if lions say things, which apparently they do. "You knew Felix\'s work. He built that door. Read the wall and it will open." He is not an escaped lion, he adds; he is a lion whose paperwork is wrong.');
    }
  },

  hints: [
    { text: 'The lock wants a word and the wall wants a reader — that verse is signed by a man who opened this door before you.', cost: 60 },
    { text: 'Read the verse down the margin: the first letter of each line, top to bottom, five tumblers.', cost: 120 },
    { text: 'A-R-E-N-A. And lever the drain with the strigil before you go.', cost: 240 },
  ],
};

function openLetterLock(game) {
  const values = [0, 0, 0, 0, 0];

  game.openPuzzle({
    id: 'carcer_lock',
    title: 'The Letter-Lock',
    render(body, api) {
      body.innerHTML = `
        <p class="puzzle-desc">A merchant's letter-lock, won at dice and chained here by a
        turnkey who cannot read — which the man who set its word was counting on. Five
        tumblers; click one to slide it to its next letter.</p>
        <div class="ring-row" id="car-rings"></div>
        <div class="puzzle-row"><button class="btn btn-primary" id="car-try">Pull the Chain</button></div>
        <div class="puzzle-feedback"></div>`;

      const row = body.querySelector('#car-rings');
      values.forEach((v, i) => {
        const ring = document.createElement('button');
        ring.className = 'ring';
        ring.textContent = RING_LETTERS[v];
        ring.addEventListener('click', () => {
          values[i] = (values[i] + 1) % RING_LETTERS.length;
          ring.textContent = RING_LETTERS[values[i]];
          ring.classList.remove('tick'); void ring.offsetWidth; ring.classList.add('tick');
          game.playSfx('click');
        });
        row.appendChild(ring);
      });

      body.querySelector('#car-try').addEventListener('click', () => {
        const word = values.map(v => RING_LETTERS[v]).join('');
        if (word === 'ARENA') {
          game.setFlag('carcer_lockOpen');
          game.playSfx('unlock');
          api.solved({ message: 'The tumblers seat with five small sighs and the chain runs out of the staples like a startled snake. "There," says the lion, not looking up. "Felix\'s favorite joke. The word for sand opens the way out of it."' });
          game.refreshScene();
        } else {
          api.fail('The tumblers bind. The word is wrong, and the chain knows it.');
        }
      });
    },
  });
}
