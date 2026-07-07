// CHAMBER 3 — The Shrine of Nemesis.
// Puzzle: the classic jug rite — measure exactly IIII heminae with jugs of
// V and III, poured into the lamp in one breath. Also introduces the SATOR
// charm (row 1) that Chamber 4 needs, the bronze mirror, the oil flask, and
// the wool_rag+oil_flask -> oiled_rag combo (registered here; Gus seeds it).

import { registerItems, registerCombos } from '../../../shared/js/items.js';

registerItems({
  bronze_mirror: {
    name: 'Bronze Mirror',
    description: 'A votive hand-mirror, polished to a warm shine. It throws light better than it flatters faces.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="19" r="13" fill="#d1a53f" stroke="#6b4514" stroke-width="2.5"/>
      <circle cx="24" cy="19" r="9" fill="#f0dfae"/>
      <path d="M20 14 q3 -3 7 -1" stroke="#fff6dd" stroke-width="2" fill="none"/>
      <rect x="21" y="32" width="6" height="12" rx="3" fill="#8a5a1c"/>
    </svg>`,
  },
  oil_flask: {
    name: 'Flask of Sacred Oil',
    description: 'Temple oil, stoppered. Slippery, sanctified, and — Felix would note — excellent for hinges, if only it would stay where you put it.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 14 h8 l3 8 q7 6 5 14 q-2 8 -12 8 q-10 0 -12 -8 q-2 -8 5 -14 z"
        fill="#8a5a1c" stroke="#3a2b18" stroke-width="2.5"/>
      <path d="M17 34 q7 5 14 0" stroke="#d1a53f" stroke-width="2" fill="none"/>
      <rect x="21" y="6" width="6" height="9" rx="2" fill="#6b4f2c"/>
    </svg>`,
  },
  oiled_rag: {
    name: 'Oiled Rag',
    description: 'The wool has drunk the sacred oil to its heart. It will hold the oil against anything you press it to. Felix\'s trick.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 26 q-4 -10 8 -12 q2 -8 12 -6 q10 -2 10 8 q8 4 2 12 q2 8 -8 10 q-6 6 -14 2 q-10 2 -10 -8 q-4 -2 0 -6z"
        fill="#a97a28" stroke="#5c3a12" stroke-width="2"/>
      <path d="M18 22 q6 4 12 0 M16 30 q8 4 16 -2" stroke="#d1a53f" stroke-width="1.8" fill="none"/>
      <circle cx="34" cy="34" r="2.4" fill="#e8c85a" opacity="0.8"/>
    </svg>`,
  },
});

registerCombos([
  {
    pair: ['wool_rag', 'oil_flask'],
    onCombine(game) {
      game.removeItem('wool_rag');
      game.removeItem('oil_flask');
      game.addItem('oiled_rag', { silent: true });
      game.say('You work the wool into the flask\'s mouth until it has drunk the sacred oil to its heart. An oiled rag — oil that stays where you press it. "There it is," says Gus, approving. "Felix\'s trick exactly."');
    },
  },
]);

export default {
  id: 'shrine',
  title: 'The Shrine of Nemesis',
  intro: 'The corridor opens into a low shrine thick with dead incense, where Nemesis — wings folded, wheel at her sandal, scourge at her belt — watches a cold lamp with the expression of a goddess who has been kept waiting, and the door behind her altar has no intention of opening for a man who owes her a libation.',

  scene(state) {
    const done = !!state.flags.shrine_riteDone;
    const mirrorHere = !state.flags.shrine_mirrorTaken;
    const flaskHere = done && !state.flags.shrine_flaskTaken;

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gd_shr_wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#241d16"/>
          <stop offset="1" stop-color="#332a1f"/>
        </linearGradient>
        <linearGradient id="gd_shr_floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#2b2216"/>
          <stop offset="1" stop-color="#14100a"/>
        </linearGradient>
        <radialGradient id="gd_shr_lamp" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(255,190,90,0.75)"/>
          <stop offset="1" stop-color="rgba(255,190,90,0)"/>
        </radialGradient>
        <linearGradient id="gd_shr_statue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#cfc6b4"/>
          <stop offset="1" stop-color="#8a7f6a"/>
        </linearGradient>
      </defs>

      <rect width="1600" height="650" fill="url(#gd_shr_wall)"/>
      <g stroke="#171209" stroke-width="5" opacity="0.7">
        ${[140, 280, 420].map(y => `<line x1="0" y1="${y}" x2="1600" y2="${y}"/>`).join('')}
      </g>
      <rect y="650" width="1600" height="250" fill="url(#gd_shr_floor)"/>

      <!-- Nemesis -->
      <g>
        <ellipse cx="800" cy="640" rx="150" ry="20" fill="#171209"/>
        <rect x="740" y="560" width="120" height="80" rx="8" fill="#5c5546"/>
        <path d="M760 560 q40 -220 40 -280 q0 -40 40 -40 q30 0 30 36 q0 70 30 284 z" fill="url(#gd_shr_statue)"/>
        <circle cx="822" cy="230" r="34" fill="url(#gd_shr_statue)"/>
        <path d="M792 216 q-8 -26 14 -38 M852 216 q8 -26 -14 -38" stroke="#8a7f6a" stroke-width="6" fill="none"/>
        <!-- folded wings -->
        <path d="M760 300 q-70 30 -60 160 q40 -20 62 -60 z" fill="#a8a08c"/>
        <path d="M884 300 q70 30 60 160 q-40 -20 -62 -60 z" fill="#a8a08c"/>
        <!-- the wheel at her sandal: turns when the rite is done -->
        <g class="${done ? 'spin slow' : ''}" style="transform-origin: 742px 610px; transform-box: initial;">
          <circle cx="742" cy="610" r="34" fill="none" stroke="#c9a227" stroke-width="6"/>
          ${[0, 45, 90, 135].map(a => `<line x1="742" y1="576" x2="742" y2="644" stroke="#c9a227" stroke-width="4" transform="rotate(${a} 742 610)"/>`).join('')}
        </g>
      </g>

      <!-- the great lamp -->
      <g>
        <rect x="1010" y="470" width="16" height="170" fill="#453a2e"/>
        <path d="M960 470 q58 -26 116 0 l-14 26 q-44 16 -88 0 z" fill="#6b5a3a" stroke="#2b2015" stroke-width="4"/>
        ${done
          ? `<ellipse cx="1018" cy="440" rx="80" ry="66" fill="url(#gd_shr_lamp)" class="glow"/>
             <path class="torch-flame" d="M1018 462 q18 -30 0 -54 q-18 24 0 54z" fill="#ffa94d"/>
             <path class="torch-flame" d="M1018 458 q9 -16 0 -30 q-9 14 0 30z" fill="#ffd9a0"/>`
          : `<ellipse cx="1018" cy="466" rx="22" ry="7" fill="#171209"/>
             <path d="M1012 462 q6 -8 12 0" stroke="#453a2e" stroke-width="3" fill="none"/>`}
      </g>

      <!-- altar with inscription -->
      <g>
        <rect x="620" y="680" width="360" height="90" rx="10" fill="#5c5546" stroke="#2b2318" stroke-width="4"/>
        <rect x="640" y="700" width="320" height="50" rx="4" fill="#453a2e"/>
        <text x="800" y="722" text-anchor="middle" font-size="15" fill="#e8dcc0" letter-spacing="2"
          font-family="Palatino Linotype, Georgia, serif">NEMESIS · MENSVRAM PAREM</text>
        <text x="800" y="742" text-anchor="middle" font-size="13" fill="#c9b98f" letter-spacing="1"
          font-family="Palatino Linotype, Georgia, serif">IIII HEMINAE · VNO SPIRITV</text>
      </g>

      <!-- vessels: amphora + jugs -->
      <g>
        <path d="M400 560 q-24 60 0 130 q14 34 46 34 q32 0 46 -34 q24 -70 0 -130 q-10 -26 -46 -26 q-36 0 -46 26z" fill="#8e5a2a" stroke="#3a2412" stroke-width="4"/>
        <path d="M414 548 q-10 -22 10 -28 M478 548 q10 -22 -10 -28" stroke="#3a2412" stroke-width="6" fill="none"/>
        <rect x="530" y="640" width="52" height="76" rx="10" fill="#a97a28" stroke="#4a3210" stroke-width="4"/>
        <text x="556" y="686" text-anchor="middle" font-size="20" fill="#f0dfae" font-family="Palatino Linotype, Georgia, serif">V</text>
        <rect x="300" y="656" width="44" height="60" rx="9" fill="#8e5a2a" stroke="#3a2412" stroke-width="4"/>
        <text x="322" y="694" text-anchor="middle" font-size="17" fill="#f0dfae" font-family="Palatino Linotype, Georgia, serif">III</text>
      </g>

      <!-- votive pile with the mirror -->
      <g>
        <ellipse cx="280" cy="560" rx="110" ry="28" fill="#3a3126"/>
        <path d="M210 552 l30 -12 l16 10 M300 546 l26 -8 M330 556 l24 -12" stroke="#8a7f6a" stroke-width="5" stroke-linecap="round"/>
        ${mirrorHere ? `<g class="beckon"><circle cx="268" cy="536" r="16" fill="#d1a53f" stroke="#6b4514" stroke-width="3"/><circle cx="268" cy="536" r="10" fill="#f0dfae"/></g>` : ''}
      </g>

      <!-- votive tablets on the wall, one crooked -->
      <g>
        ${[1180, 1260, 1340].map((x, i) => `
          <rect x="${x}" y="300" width="64" height="86" rx="5" fill="#6b4f2c" stroke="#2b2015" stroke-width="3"
            ${i === 1 ? 'transform="rotate(7 1292 343)"' : ''}/>
          <rect x="${x + 8}" y="310" width="48" height="66" rx="3" fill="#1d1812"
            ${i === 1 ? 'transform="rotate(7 1292 343)"' : ''}/>`).join('')}
      </g>

      <!-- doorway + charm plaster + passage door -->
      <g>
        <path d="M1440 650 L1440 330 Q1510 292 1580 330 L1580 650 Z" fill="${done ? '#0f0c08' : '#2b2015'}" stroke="#241f1a" stroke-width="7"/>
        ${done
          ? `<text x="1510" y="480" text-anchor="middle" font-size="13" fill="#e8cf96" class="flicker"
               font-family="Palatino Linotype, Georgia, serif">unbarred</text>`
          : `<line x1="1432" y1="470" x2="1588" y2="470" stroke="#5c5546" stroke-width="13"/>`}
        <!-- the charm scratched on the plaster beside the door -->
        <g opacity="0.9">
          <rect x="1290" y="470" width="120" height="130" rx="4" fill="#3a3126"/>
          <text x="1350" y="500" text-anchor="middle" font-size="18" letter-spacing="6" fill="#c9b98f"
            font-family="Palatino Linotype, Georgia, serif">SATOR</text>
          ${[518, 540, 562, 584].map(y => `<line x1="1306" y1="${y}" x2="1394" y2="${y}" stroke="#57493a" stroke-width="8" opacity="0.6"/>`).join('')}
        </g>
      </g>

      <!-- niche under the statue (opens with the rite) -->
      ${done ? `
      <g>
        <rect x="756" y="576" width="88" height="56" rx="6" fill="#0f0c08"/>
        ${flaskHere ? `<g class="beckon"><path d="M792 606 h12 l4 10 q4 8 -10 8 q-14 0 -10 -8 z" fill="#8a5a1c"/><rect x="795" y="596" width="6" height="10" rx="2" fill="#6b4f2c"/></g>` : ''}
      </g>` : ''}

      <!-- scratched prayers (flavor) -->
      <g opacity="0.55">
        <text x="180" y="720" font-size="13" fill="#8a7f6a" font-style="italic"
          font-family="Palatino Linotype, Georgia, serif">NEMESIS LET IT BE QVICK</text>
        <text x="150" y="746" font-size="13" fill="#8a7f6a" font-style="italic"
          font-family="Palatino Linotype, Georgia, serif">OR LET IT BE HIM</text>
      </g>

      <!-- cold brazier (flavor) -->
      <g>
        <circle cx="1180" cy="740" r="40" fill="#3a3126" stroke="#171209" stroke-width="4"/>
        <path d="M1150 776 l-10 40 M1210 776 l10 40 M1180 780 v40" stroke="#3a3126" stroke-width="7"/>
        <ellipse cx="1180" cy="736" rx="26" ry="8" fill="#171209"/>
      </g>

      <path d="M0 900 L0 862 Q800 906 1600 862 L1600 900 Z" fill="#0a0705"/>
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const done = !!state.flags.shrine_riteDone;

    spots.push({
      id: 'rite', x: 610, y: 670, w: 380, h: 110, label: 'The altar inscription',
      onInteract(game) {
        const html = `<span class="stone-cut">NEMESIS TAKES THE EVEN MEASVRE:<br>
          IIII HEMINAE OF OIL — <em>four</em> —<br>POVRED IN ONE BREATH.<br>NO MORE, NO LESS.</span>`;
        game.journal.add('note_rite', { title: 'The rite of Nemesis (Shrine)', category: 'note', html });
        game.dialog({ title: 'The Altar', html });
      },
    });

    spots.push({
      id: 'lamp', x: 940, y: 380, w: 160, h: 260, label: done ? 'The burning lamp' : 'The cold lamp',
      onInteract(game) {
        if (done) {
          game.say('The lamp burns steady and pleased. Nemesis\'s wheel turns at her sandal, slow as a held grudge released.');
        } else {
          openPourRite(game);
        }
      },
    });

    spots.push({
      id: 'vessels', x: 290, y: 530, w: 300, h: 200, label: 'The amphora and jugs',
      onInteract(game) {
        game.say('A temple amphora of oil, effectively bottomless, and two jugs: bronze stamped V — five heminae — and clay stamped III — three. Neither has a mark inside. Whoever measures four with these will have earned it.');
      },
    });

    if (!state.flags.shrine_mirrorTaken) {
      spots.push({
        id: 'votives', x: 180, y: 500, w: 220, h: 90, label: 'The votive pile',
        onInteract(game) {
          game.setFlag('shrine_mirrorTaken');
          game.addItem('bronze_mirror', { from: { x: 268, y: 536 } });
          game.say('Among the offerings — combs, dice, a child\'s sandal — a bronze hand-mirror, polished to a warm shine. The goddess of due measure will not miss one mirror. Probably.');
          game.refreshScene();
        },
      });
    }

    if (!state.journal.some(e => e.id === 'token3')) {
      spots.push({
        id: 'tablets', x: 1170, y: 290, w: 250, h: 110, label: 'The votive tablets',
        onInteract(game) {
          game.journal.add('token3', {
            title: 'behind the votive tablets', category: 'sun',
            sun: { rays: 2, letter: 'I', emblem: 'net' },
          });
          game.say('One tablet hangs crooked, proud of the wall — and Felix was a carpenter; nothing he touched hung crooked by accident. Behind it: a bone tessera. The emblem is a weighted net; the letter is I.');
        },
      });
    }

    spots.push({
      id: 'charm', x: 1280, y: 460, w: 140, h: 150, label: 'A charm on the plaster',
      onInteract(game) {
        const html = `<p>Scratched into the doorway plaster, mostly worn away:</p>
          <span class="stone-cut">S A T O R<br><span style="opacity:0.35">— — — — —<br>— — — — —<br>— — — — —<br>— — — — —</span></span>
          <p><em>The Sower's square — merchants scratch it on doorposts against ill luck.
          It reads the same four ways. Only the first line survives here.</em></p>`;
        game.journal.add('note_charm', { title: "The Sower's charm (Shrine doorway)", category: 'note', html });
        game.dialog({ title: 'The Doorpost Charm', html });
      },
    });

    if (done && !state.flags.shrine_flaskTaken) {
      spots.push({
        id: 'niche', x: 746, y: 566, w: 110, h: 80, label: 'The opened niche',
        onInteract(game) {
          game.setFlag('shrine_flaskTaken');
          game.addItem('oil_flask', { from: { x: 800, y: 606 } });
          game.say('In the niche, a stoppered flask, filled from the amphora — the goddess shares with those who measure honestly. Gus noses at it once: "Felix used to soak rags in that for the hinges. The rag you are carrying would drink it happily."');
          game.refreshScene();
        },
      });
    }

    spots.push({
      id: 'statue', x: 700, y: 260, w: 200, h: 280, label: 'Nemesis',
      onInteract(game) {
        game.say('Nemesis, lady of due measure, who gives every man exactly what he is owed. Gus regards her from the doorway with narrow professional distaste and stays out of scourge-reach. Some rivalries are older than paperwork.');
      },
    });

    spots.push({
      id: 'prayers', x: 120, y: 690, w: 260, h: 80, label: 'Scratched prayers',
      onInteract(game) {
        game.say('Generations of gladiators\' handwriting, all of it hurried: NEMESIS, LET IT BE QUICK OR LET IT BE HIM. Nobody prays down here for glory. They pray for arithmetic.');
      },
    });

    spots.push({
      id: 'brazier', x: 1120, y: 700, w: 130, h: 120, label: 'The cold brazier',
      onInteract(game) {
        game.say('Cold ash, years old. Since the fire in the western works, flame is rationed down here like mercy.');
      },
    });

    spots.push({
      id: 'door', x: 1430, y: 320, w: 160, h: 340, label: done ? 'To the lanista\'s tablinum' : 'The barred passage',
      onInteract(game) {
        if (!done) {
          game.say('The bar behind the altar is the goddess\'s own: it lifts when her lamp is lit, and not before. The inscription on the altar names her price.');
          return;
        }
        if (!game.hasItem('bronze_mirror')) {
          game.say('Gus glances back at the votive pile. "The mirror. Where we are going, the light does not reach the walls that matter."');
          return;
        }
        if (!game.hasItem('oil_flask') && !game.hasItem('oiled_rag')) {
          game.say('"The niche," says Gus. "The goddess filled a flask for you. Refusing a goddess\'s gift is how men end up in registers."');
          return;
        }
        if (!game.journal.has('token3')) {
          game.say('"The votive wall," says Gus. "The crooked tablet. Felix was a carpenter; nothing he touched hung crooked by accident."');
          return;
        }
        if (!game.journal.has('note_charm')) {
          game.say('"The doorpost," says Gus, not moving. "Felix copied that charm for a reason. Read it before we leave the light."');
          return;
        }
        game.say('The passage exhales the smell of ink, wax, and counted money: the lanista\'s tablinum is ahead.');
        game.completeRoom({ delay: 700 });
      },
    });

    return spots;
  },

  hints: [
    { text: 'The goddess counts heminae; the jugs only know V and III. You may pour between them as often as you like — she minds waste, not tidiness.', cost: 60 },
    { text: 'Fill the five, pour it into the three: what stays behind is two. The rest is bookkeeping.', cost: 120 },
    { text: 'Fill V, pour into III (2 left in V), empty III, move the 2 across, refill V, top up III — the V holds exactly IIII. Pour it into the lamp.', cost: 240 },
  ],
};

function openPourRite(game) {
  let v = 0, iii = 0;

  game.openPuzzle({
    id: 'shrine_lamp',
    title: 'The Libation',
    render(body, api) {
      body.innerHTML = `
        <p class="puzzle-desc">IIII heminae — four — poured in one breath, from one
        vessel. The amphora never runs dry; the jugs know only their own brims. Emptied
        oil returns to the amphora: the goddess minds waste, not tidiness.</p>
        <div class="jug-row">
          <div class="jug"><div class="jug-vessel"><div class="jug-oil" id="shr-oil5"></div></div>
            <div class="jug-cap">BRONZE · V</div><div class="jug-amt" id="shr-amt5">0</div></div>
          <div class="jug"><div class="jug-vessel" style="height:80px;"><div class="jug-oil" id="shr-oil3"></div></div>
            <div class="jug-cap">CLAY · III</div><div class="jug-amt" id="shr-amt3">0</div></div>
        </div>
        <div class="puzzle-row">
          <button class="btn" id="shr-fill5">Fill V</button>
          <button class="btn" id="shr-fill3">Fill III</button>
          <button class="btn" id="shr-53">Pour V &rarr; III</button>
          <button class="btn" id="shr-35">Pour III &rarr; V</button>
          <button class="btn" id="shr-e5">Empty V</button>
          <button class="btn" id="shr-e3">Empty III</button>
        </div>
        <div class="puzzle-row">
          <button class="btn btn-primary" id="shr-lamp5">Pour V into the Lamp</button>
          <button class="btn btn-primary" id="shr-lamp3">Pour III into the Lamp</button>
        </div>
        <div class="puzzle-feedback"></div>`;

      const paint = () => {
        body.querySelector('#shr-oil5').style.height = `${(v / 5) * 100}%`;
        body.querySelector('#shr-oil3').style.height = `${(iii / 3) * 100}%`;
        body.querySelector('#shr-amt5').textContent = v;
        body.querySelector('#shr-amt3').textContent = iii;
      };
      const act = (fn) => () => { fn(); game.playSfx('pour'); paint(); };

      body.querySelector('#shr-fill5').addEventListener('click', act(() => { v = 5; }));
      body.querySelector('#shr-fill3').addEventListener('click', act(() => { iii = 3; }));
      body.querySelector('#shr-53').addEventListener('click', act(() => {
        const t = Math.min(v, 3 - iii); v -= t; iii += t;
      }));
      body.querySelector('#shr-35').addEventListener('click', act(() => {
        const t = Math.min(iii, 5 - v); iii -= t; v += t;
      }));
      body.querySelector('#shr-e5').addEventListener('click', act(() => { v = 0; }));
      body.querySelector('#shr-e3').addEventListener('click', act(() => { iii = 0; }));

      const tryLamp = (amt, clear) => {
        if (amt === 4) {
          game.setFlag('shrine_riteDone');
          clear();
          game.playSfx('solve');
          api.solved({ message: 'Four heminae, one breath. The wick takes the oil like a secret and blooms; the wheel at Nemesis\'s sandal begins, very slowly, to turn — and under the statue a niche grinds open while the passage bar lifts behind the altar.' });
          game.refreshScene();
        } else {
          api.fail('The wick gutters and drowns — the basin tips the spurned offering back into your jug. The goddess takes the even measure or none.');
        }
      };
      body.querySelector('#shr-lamp5').addEventListener('click', () => tryLamp(v, () => { v = 0; paint(); }));
      body.querySelector('#shr-lamp3').addEventListener('click', () => tryLamp(iii, () => { iii = 0; paint(); }));
    },
  });
}
