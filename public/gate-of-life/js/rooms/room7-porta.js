// CHAMBER 7 — The Porta Sanavivaria. Finale.
// Phase 1 (the way): oiled rag on the seized hinge, dolabra on the bar seat,
// dolabra on the half-bricked arch -> Felix's alcove (rudis + last tablet).
// Phase 2 (the word): six letter rings under the procession frieze —
// match tessera emblems to the marchers -> MISSIO. Then open the gate.

import { registerItems } from '../../../shared/js/items.js';

registerItems({
  rudis: {
    name: "Felix's Rudis",
    description: 'A wooden sword, finished and balanced and never awarded. The freedom a man carves for himself when the ledger says no.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 40 L34 14" stroke="#b8893a" stroke-width="6" stroke-linecap="round"/>
      <path d="M34 14 L38 10" stroke="#d1a53f" stroke-width="6" stroke-linecap="round"/>
      <path d="M14 30 L22 38" stroke="#6b4f2c" stroke-width="5" stroke-linecap="round"/>
      <circle cx="11" cy="41" r="4" fill="#6b4f2c"/>
    </svg>`,
  },
});

const RING_LETTERS = ['A', 'C', 'E', 'F', 'I', 'L', 'M', 'N', 'O', 'R', 'S', 'T'];
const MARCHERS = ['spear-man', 'net-man', 'egg-helm', 'fish-crest', 'griffin-crest', 'palm-bearer'];

export default {
  id: 'porta',
  title: 'The Porta Sanavivaria',
  intro: 'The corridor behind the western wall runs straight at a pair of oak-and-iron doors taller than three men, bricked around and forgotten since the fire, with daylight standing in every seam and the crowd\'s roar coming through the stone like weather — the old Gate of Life, the door they open for the spared, and Felix\'s road ends at it.',

  scene(state) {
    const hinge = !!state.flags.porta_hingeOiled;
    const bar = !!state.flags.porta_barPried;
    const arch = !!state.flags.porta_archOpen;
    const word = !!state.flags.porta_wordSet;
    const rudisTaken = !!state.flags.porta_rudisTaken;

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gd_por_wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#241d15"/>
          <stop offset="1" stop-color="#332a1e"/>
        </linearGradient>
        <linearGradient id="gd_por_floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#2b2216"/>
          <stop offset="1" stop-color="#14100a"/>
        </linearGradient>
        <linearGradient id="gd_por_gate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#4a3820"/>
          <stop offset="1" stop-color="#332413"/>
        </linearGradient>
        <radialGradient id="gd_por_day" cx="0.5" cy="0.5" r="0.7">
          <stop offset="0" stop-color="rgba(255,244,214,0.95)"/>
          <stop offset="1" stop-color="rgba(255,244,214,0)"/>
        </radialGradient>
        <radialGradient id="gd_por_torch" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(255,169,77,0.5)"/>
          <stop offset="1" stop-color="rgba(255,169,77,0)"/>
        </radialGradient>
        <radialGradient id="gd_por_lamp" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(255,190,90,0.6)"/>
          <stop offset="1" stop-color="rgba(255,190,90,0)"/>
        </radialGradient>
      </defs>

      <rect width="1600" height="760" fill="url(#gd_por_wall)"/>
      <rect y="760" width="1600" height="140" fill="url(#gd_por_floor)"/>
      <g stroke="#171209" stroke-width="5" opacity="0.7">
        ${[160, 320, 480].map(y => `<line x1="0" y1="${y}" x2="1000" y2="${y}"/>`).join('')}
      </g>

      <!-- torches along the corridor -->
      ${[300, 700].map(x => `
      <g>
        <rect x="${x - 6}" y="360" width="12" height="56" rx="4" fill="#3a2b18"/>
        <ellipse cx="${x}" cy="346" rx="38" ry="32" fill="url(#gd_por_torch)" class="glow"/>
        <path class="torch-flame" d="M${x} 360 q10 -18 0 -32 q-10 14 0 32z" fill="#ffa94d"/>
      </g>`).join('')}

      <!-- THE GATE -->
      <g>
        <!-- daylight in the seams -->
        <rect x="1046" y="150" width="8" height="620" fill="#fff4d6" opacity="0.85" class="flicker"/>
        <rect x="1252" y="150" width="6" height="620" fill="#fff4d6" opacity="0.7" class="flicker"/>
        <rect x="1030" y="140" width="450" height="10" fill="#fff4d6" opacity="0.8"/>
        <ellipse cx="1255" cy="450" rx="330" ry="380" fill="url(#gd_por_day)" opacity="0.12"/>
        <!-- doors -->
        <rect x="1050" y="150" width="200" height="620" fill="url(#gd_por_gate)" stroke="#171209" stroke-width="7"/>
        <rect x="1258" y="150" width="200" height="620" fill="url(#gd_por_gate)" stroke="#171209" stroke-width="7"/>
        <!-- iron straps -->
        ${[220, 380, 540, 700].map(y => `
          <rect x="1050" y="${y}" width="200" height="20" fill="#453a2e"/>
          <rect x="1258" y="${y}" width="200" height="20" fill="#453a2e"/>`).join('')}
        <!-- the great bar -->
        ${bar
          ? `<rect x="1010" y="360" width="34" height="330" rx="8" fill="#5c4a2e" stroke="#241c12" stroke-width="4" transform="rotate(-8 1027 690)"/>`
          : `<rect x="1030" y="430" width="450" height="36" rx="8" fill="#5c4a2e" stroke="#241c12" stroke-width="4"/>
             <rect x="1006" y="418" width="44" height="60" rx="6" fill="#453a2e"/>`}
        <!-- the hinge -->
        <g>
          <rect x="1028" y="250" width="34" height="70" rx="6" fill="${hinge ? '#b8893a' : '#5c4a2e'}"/>
          ${hinge ? `<circle cx="1045" cy="285" r="7" fill="#e8c85a" class="glow"/>` : `<path d="M1032 320 q6 22 -2 40" stroke="#8e2f35" stroke-width="4" fill="none" opacity="0.8"/>`}
        </g>
        <!-- the wicket with six rings -->
        <g>
          <rect x="1150" y="500" width="210" height="180" rx="10" fill="#2b2015" stroke="#171209" stroke-width="5"/>
          ${[0, 1, 2, 3, 4, 5].map(i => {
            const x = 1168 + i * 30;
            const letters = word ? 'MISSIO' : '······';
            return `<rect x="${x}" y="560" width="26" height="42" rx="5" fill="#453a2e" stroke="#171209" stroke-width="2"/>
              <text x="${x + 13}" y="590" text-anchor="middle" font-size="${word ? 18 : 22}" fill="${word ? '#e8c85a' : '#8a7f6a'}"
                font-family="Palatino Linotype, Georgia, serif">${letters[i]}</text>`;
          }).join('')}
          ${word ? `<text x="1255" y="646" text-anchor="middle" font-size="12" fill="#e8cf96" class="flicker"
            font-family="Palatino Linotype, Georgia, serif">the wicket stands ready</text>` : ''}
        </g>
        <!-- the procession frieze above -->
        <g>
          <rect x="1060" y="60" width="390" height="80" rx="6" fill="#453a2e" stroke="#241c12" stroke-width="4"/>
          ${MARCHERS.map((m, i) => {
            const x = 1092 + i * 62;
            return `
            <g stroke="#cfc6b4" stroke-width="3" fill="none">
              <circle cx="${x}" cy="92" r="9" fill="#8a7f6a" stroke="none"/>
              <path d="M${x} 101 v18 M${x - 7} 108 h14"/>
              ${i === 0 ? `<path d="M${x + 10} 76 l8 -14 M${x + 16} 64 l4 6"/>` : ''}
              ${i === 1 ? `<path d="M${x + 8} 84 q8 6 2 16 M${x + 6} 88 h10 M${x + 8} 94 h8"/>` : ''}
              ${i === 2 ? `<path d="M${x - 8} 84 a9 9 0 0 1 16 0"/>` : ''}
              ${i === 3 ? `<path d="M${x - 8} 78 q8 -10 16 0"/>` : ''}
              ${i === 4 ? `<path d="M${x - 4} 76 q4 -10 12 -6 l-4 6"/>` : ''}
              ${i === 5 ? `<path d="M${x + 10} 74 v14 M${x + 10} 76 q-6 -6 -10 -2 M${x + 10} 76 q6 -6 10 -2"/>` : ''}
            </g>`;
          }).join('')}
          <text x="1255" y="156" text-anchor="middle" font-size="12" letter-spacing="2" fill="#c9b98f"
            font-family="Palatino Linotype, Georgia, serif">AS THEY MARCH, THEY SPEAK</text>
        </g>
      </g>

      <!-- the half-bricked arch / alcove -->
      <g>
        <path d="M360 760 L360 400 Q460 340 560 400 L560 760 Z" fill="#171209" stroke="#453a2e" stroke-width="7"/>
        ${arch
          ? `<ellipse cx="460" cy="560" rx="80" ry="120" fill="url(#gd_por_lamp)" opacity="0.5" class="glow"/>
             <!-- Felix: bones in a carpenter's apron, tools folded -->
             <g stroke="#cfc6b4" stroke-width="4" stroke-linecap="round" opacity="0.85">
               <circle cx="440" cy="600" r="12" fill="#cfc6b4" stroke="none"/>
               <path d="M440 616 q0 40 10 60 M420 640 l40 -6 M424 664 l34 -4"/>
             </g>
             <rect x="470" y="680" width="70" height="14" rx="4" fill="#6b4f2c"/>
             ${rudisTaken ? '' : `<g class="beckon"><path d="M492 640 L530 596" stroke="#b8893a" stroke-width="7" stroke-linecap="round"/><path d="M500 620 l14 14" stroke="#6b4f2c" stroke-width="5" stroke-linecap="round"/></g>`}
             <rect x="404" y="700" width="80" height="42" rx="4" fill="#6b4f2c" transform="rotate(-6 444 721)"/>`
          : `<g>
             ${[0, 1, 2, 3, 4, 5].map(r => [0, 1, 2].map(c => {
              const bx = 380 + c * 62 + (r % 2) * 30, by = 430 + r * 52;
              return bx < 540 ? `<rect x="${bx}" y="${by}" width="58" height="46" rx="3" fill="#5a4426" stroke="#2b2015" stroke-width="3"/>` : '';
            }).join('')).join('')}
             <text x="460" y="412" text-anchor="middle" font-size="11" fill="#8a7f6a" font-style="italic"
               font-family="Palatino Linotype, Georgia, serif">bricked in a hurry, a generation ago</text>
             </g>`}
      </g>

      <!-- spy-slit (flavor) -->
      <g>
        <rect x="700" y="290" width="120" height="26" rx="10" fill="#0f0c08"/>
        <rect x="706" y="296" width="108" height="14" rx="7" fill="#e8cf96" opacity="0.75" class="flicker"/>
      </g>

      <!-- fallen garlands (flavor) -->
      <g>
        <path d="M640 800 q40 -18 90 -4 q30 10 70 -2" stroke="#7a8f4a" stroke-width="7" fill="none" opacity="0.8"/>
        <path d="M700 786 q6 -12 16 -14 M760 792 q8 -10 18 -10" stroke="#7a8f4a" stroke-width="4" fill="none"/>
        <circle cx="682" cy="796" r="4" fill="#c9a227" opacity="0.8"/>
        <circle cx="794" cy="794" r="4" fill="#c9a227" opacity="0.8"/>
      </g>

      <path d="M0 900 L0 866 Q800 904 1600 866 L1600 900 Z" fill="#0a0705"/>
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const hinge = !!state.flags.porta_hingeOiled;
    const bar = !!state.flags.porta_barPried;
    const arch = !!state.flags.porta_archOpen;
    const word = !!state.flags.porta_wordSet;

    // The gate itself: always present — refusal checklist, then the final open.
    spots.push({
      id: 'gate', x: 1150, y: 170, w: 300, h: 300, label: 'The Gate of Life',
      onInteract(game) {
        const refusals = [];
        if (!hinge) refusals.push('the hinge weeps rust');
        if (!bar) refusals.push('the bar sleeps in its seat');
        if (!word) refusals.push('the wicket lock waits for a word');
        if (refusals.length) {
          game.say(`You set both palms against the oak. The gate refuses, politely, on the following grounds: ${refusals.join('; ')}. A door built by a carpenter argues like one — point by point.`);
          return;
        }
        if (!state.flags.porta_rudisTaken || !game.journal.has('note_felix')) {
          game.say('Gus plants himself in the doorway, all four hundred librae of him. "The alcove first. Both of us walked in here because of what is in that alcove."');
          return;
        }
        game.say('The bar is up, the hinge is silent, the word is set. You heave — and the Gate of Life swings into white daylight and roar, and the whole world is suddenly the smell of festival bread and eighty thousand people not looking at you.');
        game.completeRoom({ delay: 1000 });
      },
    });

    if (!hinge) {
      spots.push({
        id: 'hinge', x: 1010, y: 236, w: 90, h: 110, label: 'The seized hinge',
        onInteract(game) {
          if (game.selectedItem === 'oiled_rag') {
            game.useSelected();
            game.setFlag('porta_hingeOiled');
            game.playSfx('pour');
            game.say('You press the oiled rag to the pin and hold it there, the way Felix would have, until the wool gives its whole heart of oil into the rust. The hinge drinks, considers, and forgives.');
            game.refreshScene();
          } else if (game.selectedItem === 'wool_rag') {
            game.say('A dry rag alone will only polish the rust to a shine. It wants oil — and something to hold the oil against the pin.');
          } else if (game.selectedItem === 'oil_flask') {
            game.say('You tip a little oil at the pin and watch it run straight off, taking none of the rust with it. It needs something to hold the oil where it works. Wool, say. Combine them in your loculus — hold one, touch the other.');
          } else {
            game.say('The hinge weeps rust in long red streaks. Force it dry and the whole street will hear the scream. Oil that stays put would do it — oil, and something to hold the oil against the pin.');
          }
        },
      });
    }

    if (!bar) {
      spots.push({
        id: 'barseat', x: 1000, y: 410, w: 110, h: 100, label: 'The bar in its seat',
        onInteract(game) {
          if (game.selectedItem === 'dolabra') {
            game.setFlag('porta_barPried');
            game.playSfx('stone');
            game.say('The dolabra\'s spike bites under the bar and you lean until something older than you gives way. The great bar creaks up out of its rusted seat and stands on end, retired.');
            game.refreshScene();
          } else {
            game.say('The great bar has rusted into its seat — a generation of weather welded into one joint. Fingers will not argue with it. A pry-spike would.');
          }
        },
      });
    }

    spots.push({
      id: 'wicket', x: 1140, y: 490, w: 230, h: 200, label: word ? 'The wicket — MISSIO' : 'The wicket rings',
      onInteract(game) {
        if (word) {
          game.say('MISSIO, say the rings — the crowd\'s word, the sparing word. The wicket mechanism stands freed. The gate is waiting on you now, not the other way around.');
          return;
        }
        openWicket(game);
      },
    });

    spots.push({
      id: 'frieze', x: 1050, y: 50, w: 410, h: 120, label: 'The procession frieze',
      onInteract(game) {
        const html = `<p>Carved above the wicket, a procession — the pompa, marching
          left to right:</p>
          <span class="stone-cut">the SPEAR-MAN &middot; the NET-MAN &middot; the EGG-HELM<br>
          &middot; the FISH-CREST &middot; the GRIFFIN-CREST &middot; the PALM-BEARER</span>
          <p>And beneath, in a carpenter's letters rather than a mason's:</p>
          <span class="stone-cut">AS THEY MARCH, THEY SPEAK.</span>`;
        game.journal.add('note_frieze', { title: 'The procession frieze (Porta Sanavivaria)', category: 'note', html });
        game.dialog({ title: 'The Frieze', html });
      },
    });

    if (!arch) {
      spots.push({
        id: 'arch', x: 350, y: 390, w: 220, h: 370, label: 'The half-bricked arch',
        onInteract(game) {
          if (game.selectedItem === 'dolabra') {
            game.setFlag('porta_archOpen');
            game.playSfx('stone');
            game.say('The bricks were laid in a hurry by a man working alone, and the dolabra takes them down the same way — loose course by loose course — until lamp-black darkness opens behind them, and Gus makes a sound you have not heard from him before.');
            game.refreshScene();
          } else {
            game.say('An arch bricked shut in a hurry, a generation ago — the mortar slapdash, the coursing a carpenter\'s work, not a mason\'s. The dolabra was made for exactly this argument. Gus has gone very still beside you.');
          }
        },
      });
    } else {
      spots.push({
        id: 'alcove', x: 350, y: 390, w: 220, h: 370, label: "Felix's alcove",
        onInteract(game) {
          const html = `<div class="wax-tablet"><div class="tab-title">Felix's last tablet</div>
            <em class="tab-carve">I could have gone in September. The lion could not —
            they chain him above all season, and a door is no use to a friend on the
            wrong side of it. So I winter here.<br><br>
            If the fever wins and you are reading this: the lock is mine, the word is
            the one the crowd shouts when a life is to be spared. Take my sword — I
            earned it, even if no lanista signed it. And take the lion.<br><br>
            He answers to Gus.</em></div>`;
          game.journal.add('note_felix', { title: "Felix's last tablet (the alcove)", category: 'note', html });
          if (!game.getFlag('porta_rudisTaken')) {
            game.setFlag('porta_rudisTaken');
            game.addItem('rudis', { from: { x: 510, y: 620 }, silent: true });
            game.say('Bones in a carpenter\'s apron, tools folded beside them the way a tidy man leaves them at the end of a shift. Across his knees, a finished rudis — carved, balanced, never awarded. You take the sword and the tablet\'s words with it. Behind you, Gus lies down next to the bones and is, for a while, just an animal.');
          }
          game.dialog({ title: 'The Alcove', html });
          game.refreshScene();
        },
      });
    }

    spots.push({
      id: 'slit', x: 690, y: 280, w: 140, h: 60, label: 'The spy-slit',
      onInteract(game) {
        game.say('Through the slit: sand, sun, and the show mid-roar — a hunt, by the shapes of it, the crowd rising and falling like one animal breathing. That is the room you are not dying in today. It is a better view than most men get of their own funeral.');
      },
    });

    spots.push({
      id: 'garlands', x: 620, y: 760, w: 260, h: 80, label: 'Fallen garlands',
      onInteract(game) {
        game.say('Laurel and palm fronds, dried to paper, blown under the gate from triumphs past — thrown to the living on their way out. The palm is the victory token. Felix scratched one on a tessera, once, for a friend who could not carry it.');
      },
    });

    return spots;
  },

  hintContext(state) {
    const way = state.flags.porta_hingeOiled && state.flags.porta_barPried && state.flags.porta_archOpen;
    if (!way) return 'way';
    if (!state.flags.porta_wordSet) return 'word';
    return 'felix';
  },

  hints(state) {
    const ctx = this.hintContext(state);
    if (ctx === 'word') {
      return [
        { text: 'Six rings, six tesserae in your tablets — and six marchers carved above the wicket.', cost: 60 },
        { text: 'Match each tessera\'s emblem to its marcher, left to right. The parade gives the order.', cost: 120 },
        { text: 'M-I-S-S-I-O. The word the crowd shouts when a life is to be spared.', cost: 240 },
      ];
    }
    if (ctx === 'felix') {
      return [
        { text: 'The alcove is why this gate exists. Gus will not leave without what it holds.', cost: 60 },
        { text: 'Read Felix\'s tablet. Take the sword he earned.', cost: 120 },
        { text: 'Take the rudis from the alcove, then open the gate — the word is already set.', cost: 240 },
      ];
    }
    return [
      { text: 'Three refusals: a hinge that wants oil that stays put, a bar rusted to its seat, and bricks laid in a hurry a generation ago. Your loculus answers all three.', cost: 60 },
      { text: 'Soak the rag in the sacred oil — hold the one, touch the other, in your loculus. The dolabra was made for the bar and the bricks.', cost: 120 },
      { text: 'Oiled rag on the hinge, dolabra on the bar, dolabra on the arch. Then read what the alcove holds.', cost: 240 },
    ];
  },
};

function openWicket(game) {
  const values = [0, 0, 0, 0, 0, 0];

  game.openPuzzle({
    id: 'porta_word',
    title: "Felix's Letter-Lock",
    wide: true,
    render(body, api) {
      body.innerHTML = `
        <p class="puzzle-desc">Six rings on the wicket — a carpenter's lock, kin to the
        one on your cell door, but grown up. Above it the frieze marches: spear-man,
        net-man, egg-helm, fish-crest, griffin-crest, palm-bearer. <em>As they march,
        they speak.</em> Your tesserae are in your tablets.</p>
        <div class="ring-row" id="por-rings"></div>
        <div class="puzzle-row"><button class="btn btn-primary" id="por-try">Free the Wicket</button></div>
        <div class="puzzle-feedback"></div>`;

      const row = body.querySelector('#por-rings');
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

      body.querySelector('#por-try').addEventListener('click', () => {
        const word = values.map(v => RING_LETTERS[v]).join('');
        if (word === 'MISSIO') {
          game.setFlag('porta_wordSet');
          game.playSfx('unlock');
          api.solved({ message: 'The sixth ring seats and the whole mechanism lets go at once, with a sound like a verdict. MISSIO — the sparing word, the crowd\'s word, Felix\'s word. The wicket stands freed.' });
          game.refreshScene();
        } else {
          api.fail('The rings bind a half-turn short. That is not the word the crowd shouts.');
        }
      });
    },
  });
}
