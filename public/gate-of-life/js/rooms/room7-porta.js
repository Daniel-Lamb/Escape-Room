// CHAMBER 7 — The Porta Sanavivaria. Finale.
// Phase 1 (the way): oiled rag on the seized hinge, dolabra on the bar seat,
// dolabra on the half-bricked arch -> Felix's alcove (rudis + last tablet).
// Phase 2 (the order): Felix wired the Gate of Life to a fail-safe — it opens
// only when the day is set in its true running order. Six interlocking bolts,
// each an office of the games; throw them in the correct CHRONOLOGICAL order of
// a Roman games-day, deduced from the programma, the water-clock, and Felix's
// own ordo-note. Any wrong order springs the whole bank.
//   POMPA -> VENATIO -> MERIDIES -> PROBATIO -> MVNVS -> MISSIO
// (procession, morning beast-hunt, noon executions, the arms proved sharp,
//  the afternoon pairs, the sparing that opens this very gate).

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

const MARCHERS = ['spear-man', 'net-man', 'egg-helm', 'fish-crest', 'griffin-crest', 'palm-bearer'];

// The six offices of the day. `name` is stamped on the bolt; `gloss` is the plain
// meaning the evidence teaches — no Latin needed to order them.
const EVENTS = [
  { id: 'pompa',    name: 'POMPA',    gloss: 'the procession' },
  { id: 'venatio',  name: 'VENATIO',  gloss: 'the beast-hunt' },
  { id: 'meridies', name: 'MERIDIES', gloss: 'the noon killings' },
  { id: 'probatio', name: 'PROBATIO', gloss: 'the arms proved' },
  { id: 'munus',    name: 'MVNVS',    gloss: 'the pairs fight' },
  { id: 'missio',   name: 'MISSIO',   gloss: 'the sparing' },
];
// How the bolts sit in the bank before you touch them — scrambled, not the answer.
const TRAY_ORDER = ['munus', 'pompa', 'missio', 'venatio', 'probatio', 'meridies'];
// The true running order of the day, dawn to dusk.
const SOLUTION = ['pompa', 'venatio', 'meridies', 'probatio', 'munus', 'missio'];

export default {
  id: 'porta',
  title: 'The Porta Sanavivaria',
  intro: 'The corridor behind the western wall runs straight at a pair of oak-and-iron doors taller than three men, bricked around and forgotten since the fire, with daylight standing in every seam and the crowd\'s roar coming through the stone like weather — the old Gate of Life, the door they open for the spared, and Felix\'s road ends at it.',

  scene(state) {
    const hinge = !!state.flags.porta_hingeOiled;
    const bar = !!state.flags.porta_barPried;
    const arch = !!state.flags.porta_archOpen;
    const ordo = !!state.flags.porta_ordoSet;
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

      <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="art/porta.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="art/porta.mp4" type="video/mp4"/></video></foreignObject>

      <!-- torches along the corridor -->
      ${[300, 700].map(x => `
      <g>
        <rect x="${x - 6}" y="360" width="12" height="56" rx="4" fill="#3a2b18"/>
        <ellipse cx="${x}" cy="346" rx="38" ry="32" fill="url(#gd_por_torch)" class="glow"/>
        <path class="torch-flame" d="M${x} 360 q10 -18 0 -32 q-10 14 0 32z" fill="#ffa94d"/>
      </g>`).join('')}

      <!-- THE PROGRAMMA: the painted games-bill, weathered (left wall) -->
      <g>
        <rect x="96" y="286" width="232" height="180" rx="6" fill="#3a3126" stroke="#5a4426" stroke-width="4"/>
        <rect x="106" y="296" width="212" height="160" rx="3" fill="#241c12"/>
        <text x="212" y="316" text-anchor="middle" font-size="12" letter-spacing="3" fill="#c9b98f"
          font-family="Palatino Linotype, Georgia, serif">PROGRAMMA</text>
        ${[334, 352, 370, 388, 406, 424, 442].map((y, i) =>
          `<line x1="118" y1="${y}" x2="${306 - (i % 3) * 34}" y2="${y}" stroke="#6b5a3a" stroke-width="3" opacity="${i % 4 === 0 ? 0.35 : 0.7}"/>`).join('')}
      </g>

      <!-- THE CLEPSYDRA: a water-clock with hour marks (centre-left) -->
      <g>
        <rect x="612" y="556" width="122" height="192" rx="10" fill="#2b2318" stroke="#453a2e" stroke-width="4"/>
        <rect x="640" y="576" width="66" height="150" rx="6" fill="#0f0c08" stroke="#3a3126" stroke-width="3"/>
        <rect x="640" y="656" width="66" height="70" rx="0" fill="#2f5c6b" opacity="0.7"/>
        <rect x="640" y="654" width="66" height="6" fill="#7fb4c4" opacity="0.6"/>
        ${[588, 610, 632, 654, 676, 698, 720].map((y, i) =>
          `<line x1="708" y1="${y}" x2="722" y2="${y}" stroke="#c9b98f" stroke-width="${i === 3 ? 3 : 1.6}"/>`).join('')}
        <text x="673" y="744" text-anchor="middle" font-size="11" letter-spacing="2" fill="#c9b98f"
          font-family="Palatino Linotype, Georgia, serif">HORAE</text>
      </g>

      <!-- FELIX'S ORDO-NOTE: a working scrawl nailed to a post (centre) -->
      <g transform="rotate(-4 958 620)">
        <rect x="884" y="562" width="150" height="118" rx="6" fill="#6b4f2c" stroke="#3a2b18" stroke-width="4"/>
        <rect x="893" y="571" width="132" height="100" rx="3" fill="#1d1812"/>
        <text x="959" y="592" text-anchor="middle" font-size="10" letter-spacing="2" fill="#a8946c"
          font-family="Palatino Linotype, Georgia, serif">— F.</text>
        ${[610, 628, 646].map((y, i) =>
          `<line x1="906" y1="${y}" x2="${1010 - i * 16}" y2="${y}" stroke="#8a7f6a" stroke-width="2.4" opacity="0.7"/>`).join('')}
      </g>

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
        <!-- THE EDITOR'S ORDO: the six-bolt bank -->
        <g>
          <rect x="1150" y="496" width="212" height="196" rx="10" fill="#2b2015" stroke="#171209" stroke-width="5"/>
          <text x="1256" y="520" text-anchor="middle" font-size="10" letter-spacing="3" fill="#c9b98f"
            font-family="Palatino Linotype, Georgia, serif">THE EDITOR'S ORDO</text>
          ${[0, 1, 2, 3, 4, 5].map(i => {
            const y = 534 + i * 25;
            const seatX = ordo ? 1300 : 1220;
            return `
            <g>
              <rect x="1168" y="${y}" width="176" height="15" rx="4" fill="#171209"/>
              <rect x="${seatX}" y="${y - 1}" width="42" height="17" rx="4"
                fill="${ordo ? '#d1a53f' : '#5c4a2e'}" stroke="#241c12" stroke-width="2"
                ${ordo ? 'class="glow"' : ''}/>
            </g>`;
          }).join('')}
          ${ordo
            ? `<text x="1256" y="686" text-anchor="middle" font-size="11" fill="#e8cf96" class="flicker"
                 font-family="Palatino Linotype, Georgia, serif">the day stands in order &middot; MISSIO</text>`
            : `<text x="1256" y="686" text-anchor="middle" font-size="11" fill="#8a7f6a"
                 font-family="Palatino Linotype, Georgia, serif">the day is out of true</text>`}
        </g>
        <!-- the procession frieze above (the pompa: the day's first office) -->
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
            font-family="Palatino Linotype, Georgia, serif">THE PROCESSION OPENS THE DAY</text>
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
          : `<image href="art/por-arch.webp" x="356" y="398" width="210" height="364" preserveAspectRatio="xMidYMax meet"/>
             <text x="460" y="412" text-anchor="middle" font-size="11" fill="#e8dcc0" font-style="italic"
               font-family="Palatino Linotype, Georgia, serif" paint-order="stroke" stroke="#171209" stroke-width="2.5">bricked in a hurry, a generation ago</text>`}
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
    const ordo = !!state.flags.porta_ordoSet;

    // The gate itself: always present — refusal checklist, then the final open.
    spots.push({
      id: 'gate', x: 1150, y: 170, w: 300, h: 300, label: 'The Gate of Life',
      onInteract(game) {
        const refusals = [];
        if (!hinge) refusals.push('the hinge weeps rust');
        if (!bar) refusals.push('the bar sleeps in its seat');
        if (!ordo) refusals.push('the ordo-bolts stand out of true');
        if (refusals.length) {
          game.say(`You set both palms against the oak. The gate refuses, politely, on the following grounds: ${refusals.join('; ')}. A door built by a carpenter argues like one — point by point.`);
          return;
        }
        if (!state.flags.porta_rudisTaken || !game.journal.has('note_felix')) {
          game.say('Gus plants himself in the doorway, all four hundred librae of him. "The alcove first. Both of us walked in here because of what is in that alcove."');
          return;
        }
        game.say('The bar is up, the hinge is silent, and the day is set in its true order — bolt by bolt, dawn to the sparing. You heave, and the Gate of Life swings into white daylight and roar, and the whole world is suddenly the smell of festival bread and eighty thousand people not looking at you.');
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

    // The ordo bolt-bank — the hard chronological lock that releases the gate.
    spots.push({
      id: 'ordo', x: 1150, y: 490, w: 212, h: 202, label: ordo ? 'The ordo — set in order' : 'The editor\'s ordo-bolts',
      onInteract(game) {
        if (ordo) {
          game.say('Six bolts thrown in the day\'s true order — procession, beasts, the noon sand, the proving, the pairs, and MISSIO last of all. Felix\'s fail-safe is satisfied. The gate is waiting on you now, not the other way around.');
          return;
        }
        openOrdo(game);
      },
    });

    // The programma: the painted games-bill (first / last / proving-before-pairs).
    spots.push({
      id: 'programma', x: 96, y: 286, w: 232, h: 180, label: 'The programma (games-bill)',
      onInteract(game) {
        const html = `<div class="wax-tablet"><div class="tab-title">The programma — the day's bill</div>
          <em class="tab-carve">…as the herald cries the order of the games:<br><br>
          FIRST the PROCESSION, for the god goes before all else…<br>
          …and the pairs are never matched until the iron is PROVED sharp — the
          proving stands next before the pairs…<br>
          …LAST, the Gate of Life, for the day's final mercy.</em></div>`;
        game.journal.add('note_programma', { title: 'The programma (Porta Sanavivaria)', category: 'note', html });
        game.dialog({ title: 'The Programma', html });
      },
    });

    // The clepsydra: water-clock hour marks (morning / noon / afternoon).
    spots.push({
      id: 'clepsydra', x: 612, y: 556, w: 122, h: 192, label: 'The water-clock',
      onInteract(game) {
        const html = `<div class="wax-tablet"><div class="tab-title">The clepsydra — marked by the hours</div>
          <em class="tab-carve">FIRST HOURS, in the cool of the morning: the BEASTS are loosed
          for the hunt.<br><br>
          THE SIXTH HOUR, when the stands empty for bread: the CONDEMNED are brought
          to the noon sand.<br><br>
          AFTER, while the shadows lean east: the PAIRS are matched.</em></div>`;
        game.journal.add('note_clepsydra', { title: 'The water-clock hours (Porta Sanavivaria)', category: 'note', html });
        game.dialog({ title: 'The Water-Clock', html });
      },
    });

    // Felix's ordo-note: the linchpin ("beasts before the bread, the bread before the blades").
    spots.push({
      id: 'ordonote', x: 884, y: 560, w: 150, h: 120, label: "Felix's ordo-note",
      onInteract(game) {
        const html = `<div class="wax-tablet"><div class="tab-title">Felix's working note, nailed to the post</div>
          <em class="tab-carve">The gate opens in the day's order or not at all — I built her
          that way so no fool springs the Life-door before its hour.<br><br>
          Beasts before the bread. The bread before the blades. Set them true and she
          lets go sweet. — F.</em></div>`;
        game.journal.add('note_ordo', { title: "Felix's ordo-note (Porta Sanavivaria)", category: 'note', html });
        game.dialog({ title: "Felix's Ordo-Note", html });
      },
    });

    spots.push({
      id: 'frieze', x: 1050, y: 50, w: 410, h: 120, label: 'The procession frieze',
      onInteract(game) {
        const html = `<p>Carved above the ordo-bank, a procession — the pompa, the marchers
          who open every games-day, left to right:</p>
          <span class="stone-cut">the SPEAR-MAN &middot; the NET-MAN &middot; the EGG-HELM<br>
          &middot; the FISH-CREST &middot; the GRIFFIN-CREST &middot; the PALM-BEARER</span>
          <p>And beneath, in a carpenter's letters rather than a mason's:</p>
          <span class="stone-cut">THE PROCESSION OPENS THE DAY.</span>`;
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
            If the fever wins and you are reading this: the lock is mine, the order is
            the day's own — dawn to the sparing — and the last bolt is the word the
            crowd shouts when a life is spared. Take my sword — I earned it, even if no
            lanista signed it. And take the lion.<br><br>
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
        game.say('Through the slit: sand, sun, and the show mid-roar — a hunt, by the shapes of it, the crowd rising and falling like one animal breathing. Morning still, then; the beasts are running. That is the room you are not dying in today.');
      },
    });

    spots.push({
      id: 'garlands', x: 620, y: 760, w: 260, h: 80, label: 'Fallen garlands',
      onInteract(game) {
        game.say('Laurel and palm fronds, dried to paper, blown under the gate from triumphs past — thrown to the living on their way out. The palm is the victory token, carried last in the parade and last out the gate. Felix scratched one on a tessera, once, for a friend who could not carry it.');
      },
    });

    return spots;
  },

  hintContext(state) {
    const way = state.flags.porta_hingeOiled && state.flags.porta_barPried && state.flags.porta_archOpen;
    if (!way) return 'way';
    if (!state.flags.porta_ordoSet) return 'ordo';
    return 'felix';
  },

  hints(state) {
    const ctx = this.hintContext(state);
    if (ctx === 'ordo') {
      return [
        { text: 'Six bolts, the six offices of a games-day. Felix wired the gate to open only when the day is set in its true running order — throw them in the order the day itself runs, dawn to dusk.', cost: 60 },
        { text: 'Read the programma, the water-clock, and Felix\'s note. The procession opens the day; the beasts run in the morning; at the sixth hour the condemned die; the pairs are matched in the afternoon — but never before the arms are proved sharp; the Gate of Life is the day\'s last mercy.', cost: 120 },
        { text: 'Procession, beast-hunt, noon killings, arms proved, the pairs, the sparing — POMPA, VENATIO, MERIDIES, PROBATIO, MVNVS, MISSIO.', cost: 240 },
      ];
    }
    if (ctx === 'felix') {
      return [
        { text: 'The alcove is why this gate exists. Gus will not leave without what it holds.', cost: 60 },
        { text: 'Read Felix\'s tablet. Take the sword he earned.', cost: 120 },
        { text: 'Take the rudis from the alcove, then open the gate — the order is already set.', cost: 240 },
      ];
    }
    return [
      { text: 'Three refusals: a hinge that wants oil that stays put, a bar rusted to its seat, and bricks laid in a hurry a generation ago. Your loculus answers all three.', cost: 60 },
      { text: 'Soak the rag in the sacred oil — hold the one, touch the other, in your loculus. The dolabra was made for the bar and the bricks.', cost: 120 },
      { text: 'Oiled rag on the hinge, dolabra on the bar, dolabra on the arch. Then read what the alcove holds.', cost: 240 },
    ];
  },
};

function openOrdo(game) {
  // order = event ids placed left-to-right into the six bolt-slots.
  let order = [];

  game.openPuzzle({
    id: 'porta_ordo',
    title: "The Editor's Ordo",
    wide: true,
    render(body, api) {
      body.innerHTML = `
        <div class="puzzle-hero" style="background-image:url(art/pz-porta.webp)"></div>
        <p class="puzzle-desc">Six iron bolts, each stamped with an office of the games.
        Felix wired the Gate of Life to a fail-safe: it opens only when the day is set in
        its <em>true running order</em>, dawn to dusk. Throw the bolts into the six seats
        in that order. The programma, the water-clock, and Felix's own note are on the
        walls — read them; any wrong order springs the whole bank.</p>
        <div class="ordo-slots" id="ordo-slots"></div>
        <div class="ordo-tray" id="ordo-tray"></div>
        <div class="puzzle-row"><button class="btn btn-primary" id="ordo-try">Throw the Bank</button></div>
        <div class="puzzle-feedback"></div>`;

      const slotsEl = body.querySelector('#ordo-slots');
      const trayEl = body.querySelector('#ordo-tray');
      const ev = (id) => EVENTS.find(e => e.id === id);

      function draw() {
        // six slots, filled left-to-right by `order`
        slotsEl.innerHTML = '';
        for (let i = 0; i < 6; i++) {
          const id = order[i];
          const slot = document.createElement('div');
          slot.className = 'ordo-slot' + (id ? ' filled' : '');
          if (id) {
            const e = ev(id);
            slot.innerHTML = `<span class="ord">${i + 1}</span>
              <span class="ordo-name">${e.name}</span><span class="ordo-gloss">${e.gloss}</span>`;
            slot.title = 'Pull this bolt back';
            slot.addEventListener('click', () => {
              order.splice(i, 1);
              game.playSfx('click');
              draw();
            });
          } else {
            slot.innerHTML = `<span class="ord">${i + 1}</span><span class="ordo-gloss">—</span>`;
          }
          slotsEl.appendChild(slot);
        }
        // tray: the bolts not yet seated, in their scrambled bank order
        trayEl.innerHTML = '';
        for (const id of TRAY_ORDER) {
          if (order.includes(id)) continue;
          const e = ev(id);
          const chip = document.createElement('button');
          chip.className = 'ordo-chip';
          chip.innerHTML = `<span class="ordo-name">${e.name}</span><span class="ordo-gloss">${e.gloss}</span>`;
          chip.addEventListener('click', () => {
            if (order.length >= 6) return;
            order.push(id);
            game.playSfx('click');
            draw();
          });
          trayEl.appendChild(chip);
        }
      }
      draw();

      body.querySelector('#ordo-try').addEventListener('click', () => {
        if (order.length < 6) {
          api.setFeedback('Six seats, six bolts. The bank is not full — the mechanism will not even try.', 'bad');
          return;
        }
        const correct = order.every((id, i) => id === SOLUTION[i]);
        if (correct) {
          game.setFlag('porta_ordoSet');
          game.playSfx('unlock');
          api.solved({ message: 'Bolt by bolt the day falls into its true order — the procession, the morning beasts, the noon sand, the arms proved sharp, the afternoon pairs — and the sixth bolt, MISSIO, seats home with a sound like a verdict. The whole bank lets go at once. The Gate of Life is waiting on you now.' });
          game.refreshScene();
        } else {
          order = [];
          draw();
          api.fail('The bank jams and springs back, every bolt at once — the day is out of true, and Felix\'s gate will not be hurried past its hours. Read the walls again.');
        }
      });
    },
  });
}
