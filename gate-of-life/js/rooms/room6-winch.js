// CHAMBER 6 — The Great Winch. Peak 2.
// Puzzle: mechanical-advantage assembly. Free the brake (winch key), seat the
// crank (crank handle), then mount a geared drum (II / III / V) and a pulley
// block (I / II / IIII sheaves) so drum x block = XII exactly.
// Unique: III x IIII. Token 6 (fish-crest, "S") in the grease pit.

export default {
  id: 'winch',
  title: 'The Great Winch',
  intro: 'The winch gallery rises two storeys around the great capstan that hauls the western cage-lift, its ropes climbing into darkness toward a slot of white arena light, and everything about the machine says it would work perfectly if the fire had not eaten its rigging, its bars, and the man who loved it.',

  scene(state) {
    const brake = !!state.flags.winch_brakeFree;
    const crank = !!state.flags.winch_crankSet;
    const raised = !!state.flags.winch_raised;
    const drum = state.flags.winch_drum;   // 2 | 3 | 5 | undefined
    const block = state.flags.winch_block; // 1 | 2 | 4 | undefined

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gd_win_wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#1d1812"/>
          <stop offset="1" stop-color="#2e2519"/>
        </linearGradient>
        <linearGradient id="gd_win_floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#241c12"/>
          <stop offset="1" stop-color="#100c07"/>
        </linearGradient>
        <radialGradient id="gd_win_slot" cx="0.5" cy="0" r="1">
          <stop offset="0" stop-color="rgba(232,207,150,0.5)"/>
          <stop offset="1" stop-color="rgba(232,207,150,0)"/>
        </radialGradient>
        <radialGradient id="gd_win_torch" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(255,169,77,0.5)"/>
          <stop offset="1" stop-color="rgba(255,169,77,0)"/>
        </radialGradient>
      </defs>

      <rect width="1600" height="900" fill="url(#gd_win_wall)"/>

      <!-- high slot of arena light -->
      <rect x="1180" y="0" width="240" height="26" fill="#e8cf96" opacity="0.9" class="flicker"/>
      <polygon points="1180,26 1420,26 1360,420 1240,420" fill="url(#gd_win_slot)" class="moonbeam"/>

      <rect y="740" width="1600" height="160" fill="url(#gd_win_floor)"/>

      <!-- fire-scarred beams -->
      <g>
        <rect x="240" y="140" width="46" height="620" fill="#3a2d1c"/>
        <path d="M250 200 q14 40 -4 90 q18 30 2 80" stroke="#171209" stroke-width="10" fill="none" opacity="0.8"/>
        <rect x="240" y="140" width="46" height="120" fill="#171209" opacity="0.6"/>
        <!-- Felix's beam note -->
        <rect x="330" y="150" width="450" height="120" rx="6" fill="#2b2318" stroke="#453a2e" stroke-width="3"/>
        <g font-family="Palatino Linotype, Georgia, serif" fill="#c9b98f" text-anchor="middle">
          <text x="555" y="185" font-size="15" letter-spacing="2">THE WEST LIFT ASKS TWELVE MEN.</text>
          <text x="555" y="212" font-size="13" letter-spacing="1">A MAN AT THE CRANK IS ONE. DRVM TIMES BLOCK</text>
          <text x="555" y="238" font-size="13" letter-spacing="1">MVST MAKE THE TWELVE — NO LESS, NO MORE.</text>
        </g>
      </g>

      <!-- the great capstan/drum assembly -->
      <g>
        <rect x="760" y="300" width="34" height="460" fill="#453a2e"/>
        <!-- mounted geared drum -->
        ${drum
          ? `<g class="${raised ? 'spin slow' : ''}" style="transform-origin: 777px 420px;">
               <circle cx="777" cy="420" r="${52 + drum * 8}" fill="#6b4f2c" stroke="#241c12" stroke-width="6"/>
               ${[0, 60, 120].map(a => `<line x1="777" y1="${420 - 52 - drum * 8}" x2="777" y2="${420 + 52 + drum * 8}" stroke="#453a2e" stroke-width="8" transform="rotate(${a} 777 420)"/>`).join('')}
             </g>
             <text x="777" y="428" text-anchor="middle" font-size="22" fill="#e8dcc0"
               font-family="Palatino Linotype, Georgia, serif">${'I'.repeat(drum === 5 ? 0 : drum)}${drum === 5 ? 'V' : ''}</text>`
          : `<circle cx="777" cy="420" r="30" fill="#241c12" stroke="#453a2e" stroke-width="5" stroke-dasharray="8 6"/>`}
        <!-- crank socket -->
        ${crank
          ? `<path d="M810 560 L900 520 L900 470" fill="none" stroke="#6b4f2c" stroke-width="12" stroke-linecap="round"/>`
          : `<rect x="800" y="546" width="34" height="30" rx="4" fill="#171209" stroke="#453a2e" stroke-width="4" class="beckon"/>`}
        <!-- brake -->
        ${brake
          ? `<g><rect x="676" y="600" width="70" height="24" rx="6" fill="#5c5546" transform="rotate(-24 711 612)"/>
             <circle cx="700" cy="640" r="12" fill="#b8893a" stroke="#5c3a12" stroke-width="3"/></g>`
          : `<g class="beckon"><rect x="676" y="600" width="70" height="24" rx="6" fill="#5c5546"/>
             <rect x="694" y="606" width="14" height="12" rx="2" fill="#171209" stroke="#8a7f6a" stroke-width="2"/></g>`}
        <!-- ropes up the shaft, through the block -->
        ${block
          ? `<g>
               <rect x="${747 - 8}" y="120" width="${30 + block * 10}" height="${44 + block * 6}" rx="8" fill="#453a2e" stroke="#241c12" stroke-width="4"/>
               ${Array.from({ length: block }, (_, i) => `<circle cx="${755 + i * 12}" cy="${142 + block * 3}" r="5" fill="#8a7f6a"/>`).join('')}
               <line x1="770" y1="${164 + block * 6}" x2="777" y2="${420 - 52 - (drum || 0) * 8}" stroke="#8a6d34" stroke-width="5"/>
               <line x1="762" y1="120" x2="762" y2="0" stroke="#8a6d34" stroke-width="5"/>
             </g>`
          : `<line x1="777" y1="120" x2="777" y2="330" stroke="#3a2d1c" stroke-width="4" stroke-dasharray="10 8"/>`}
      </g>

      <!-- drum shelf -->
      <g>
        <rect x="300" y="640" width="330" height="18" rx="6" fill="#453a2e"/>
        ${[2, 3, 5].map((mark, i) => {
          const x = 350 + i * 105;
          const mounted = drum === mark;
          return mounted ? '' : `
          <g>
            <circle cx="${x}" cy="600" r="${26 + mark * 4}" fill="#6b4f2c" stroke="#241c12" stroke-width="5"/>
            <text x="${x}" y="${608}" text-anchor="middle" font-size="18" fill="#e8dcc0"
              font-family="Palatino Linotype, Georgia, serif">${mark === 5 ? 'V' : 'I'.repeat(mark)}</text>
          </g>`;
        }).join('')}
        <text x="465" y="690" text-anchor="middle" font-size="12" letter-spacing="3" fill="#8a7f6a"
          font-family="Palatino Linotype, Georgia, serif">TYMPANA</text>
      </g>

      <!-- block chest -->
      <g>
        <rect x="1130" y="620" width="310" height="120" rx="10" fill="#3a2d1c" stroke="#241c12" stroke-width="5"/>
        ${[1, 2, 4].map((sheaves, i) => {
          const x = 1170 + i * 95;
          const mounted = block === sheaves;
          return mounted ? '' : `
          <g>
            <rect x="${x}" y="650" width="${26 + sheaves * 10}" height="52" rx="8" fill="#453a2e" stroke="#241c12" stroke-width="3"/>
            ${Array.from({ length: sheaves }, (_, k) => `<circle cx="${x + 16 + k * 11}" cy="676" r="5" fill="#8a7f6a"/>`).join('')}
          </g>`;
        }).join('')}
        <text x="1285" y="770" text-anchor="middle" font-size="12" letter-spacing="3" fill="#8a7f6a"
          font-family="Palatino Linotype, Georgia, serif">TROCHLEAE</text>
      </g>

      <!-- the cage-lift platform -->
      <g>
        ${raised
          ? `<g>
               <rect x="1200" y="300" width="220" height="20" rx="5" fill="#6b4f2c"/>
               <line x1="1240" y1="300" x2="1240" y2="60" stroke="#8a6d34" stroke-width="4"/>
               <line x1="1380" y1="300" x2="1380" y2="60" stroke="#8a6d34" stroke-width="4"/>
             </g>`
          : `<g>
               <rect x="1200" y="700" width="220" height="20" rx="5" fill="#6b4f2c"/>
               <line x1="1240" y1="700" x2="1240" y2="60" stroke="#8a6d34" stroke-width="3" opacity="0.5"/>
               <line x1="1380" y1="700" x2="1380" y2="60" stroke="#8a6d34" stroke-width="3" opacity="0.5"/>
               <text x="1310" y="694" text-anchor="middle" font-size="12" fill="#8a7f6a"
                 font-family="Palatino Linotype, Georgia, serif">ONVS: CCCL</text>
             </g>`}
      </g>

      <!-- upper door (appears with the raised platform) -->
      <g>
        <path d="M1460 420 L1460 200 Q1520 170 1580 200 L1580 420 Z" fill="${raised ? '#171008' : '#241c12'}" stroke="#453a2e" stroke-width="6"/>
        ${raised ? `<text x="1520" y="320" text-anchor="middle" font-size="12" fill="#e8cf96" class="flicker"
          font-family="Palatino Linotype, Georgia, serif">the corridor</text>` : ''}
      </g>

      <!-- grease pit -->
      <g>
        <ellipse cx="960" cy="790" rx="120" ry="34" fill="#0f0c08"/>
        <ellipse cx="960" cy="786" rx="100" ry="26" fill="#171209"/>
        ${!state.journal.some(e => e.id === 'token6') ? `<circle cx="1000" cy="786" r="6" fill="#e8dcc0" class="beckon"/>` : ''}
      </g>

      <!-- winchmen's tally chalk (flavor) -->
      <g stroke="#8a7f6a" stroke-width="2.5" opacity="0.6">
        ${[0, 1, 2, 3].map(g2 => `
          <g>
            ${[0, 1, 2, 3].map(i => `<line x1="${1460 + g2 * 26}" y1="${480 + i * 4 - i * 0}" x2="${1460 + g2 * 26 + 16}" y2="${476 + i * 12}" transform="translate(0 ${0})"/>`).join('')}
          </g>`).join('')}
        <line x1="1456" y1="540" x2="1560" y2="480"/>
      </g>

      <!-- torch -->
      <g>
        <rect x="1080" y="330" width="12" height="58" rx="4" fill="#3a2b18"/>
        <ellipse cx="1086" cy="316" rx="40" ry="34" fill="url(#gd_win_torch)" class="glow"/>
        <path class="torch-flame" d="M1086 330 q11 -19 0 -34 q-11 15 0 34z" fill="#ffa94d"/>
      </g>

      <path d="M0 900 L0 866 Q800 904 1600 866 L1600 900 Z" fill="#0a0705"/>
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const brake = !!state.flags.winch_brakeFree;
    const crank = !!state.flags.winch_crankSet;
    const raised = !!state.flags.winch_raised;

    if (!brake) {
      spots.push({
        id: 'brake', x: 640, y: 580, w: 130, h: 90, label: 'The locked brake',
        onInteract(game) {
          if (game.selectedItem === 'winch_key') {
            game.useSelected();
            game.setFlag('winch_brakeFree');
            game.playSfx('unlock');
            game.say('The bronze key seats in the square socket and turns with a grinding sigh. The brake lever swings free — the key stays where it belongs now, part of the machine. MACHINAE indeed.');
            game.refreshScene();
          } else {
            game.say('The brake lever is pinned by a bronze lock with a square socket — a maintenance lock, made so no bored winch-boy could drop the lift for a joke. It wants its own key.');
          }
        },
      });
    }

    if (!crank) {
      spots.push({
        id: 'socket', x: 790, y: 530, w: 100, h: 80, label: 'The empty crank socket',
        onInteract(game) {
          if (game.selectedItem === 'crank_handle') {
            game.useSelected();
            game.setFlag('winch_crankSet');
            game.playSfx('stone');
            game.say('The capstan bar slides home into its socket as if it had only stepped out for air. The great winch has a handle again. Somewhere, Felix is insufferably pleased.');
            game.refreshScene();
          } else {
            game.say('The capstan\'s bar sockets stand empty — the fire took every handle. The socket is square-cut oak, sized for a bar you might find in a wreck.');
          }
        },
      });
    }

    spots.push({
      id: 'beamnote', x: 320, y: 140, w: 470, h: 140, label: "Felix's beam note",
      onInteract(game) {
        const html = `<span class="stone-cut">THE WEST LIFT ASKS TWELVE MEN.<br>
          A MAN AT THE CRANK IS ONE.<br>
          THE GEARED DRVM MVLTIPLIES HIM BY ITS MARK;<br>
          THE BLOCK MVLTIPLIES AGAIN BY ITS SHEAVES.<br>
          DRVM TIMES BLOCK MVST MAKE THE TWELVE —<br>
          NO LESS, OR SHE WILL NOT RISE;<br>
          NO MORE, FOR THE ROPE IS CVT TO HER LENGTH.</span>
          <p style="margin-top:10px;"><em>Cut into the beam in a carpenter's letters — Felix's
          arithmetic, left for whoever rigged her next.</em></p>`;
        game.journal.add('note_mechanica', { title: "Felix's beam note (Great Winch)", category: 'note', html });
        game.dialog({ title: 'The Beam Note', html });
      },
    });

    spots.push({
      id: 'drums', x: 290, y: 540, w: 350, h: 130, label: 'The drum shelf',
      onInteract(game) {
        const html = `<p>Three geared drums on the shelf, each cut with its mason's mark:</p>
          <p style="text-align:center;"><strong>II</strong> — two, says the mark &middot;
          <strong>III</strong> — three &middot; <strong>V</strong> — five.</p>
          <p><em>The mark is the drum's multiplying power: one turn of the crank becomes
          that many of rope.</em></p>`;
        game.journal.add('note_drums', { title: 'The geared drums (Great Winch)', category: 'note', html });
        game.dialog({ title: 'The Drum Shelf', html });
      },
    });

    spots.push({
      id: 'blocks', x: 1120, y: 610, w: 330, h: 140, label: 'The block chest',
      onInteract(game) {
        const html = `<p>Three pulley blocks in the chest. You count the sheaves aloud,
          because Felix would have:</p>
          <p style="text-align:center;"><strong>I</strong> — a single sheave &middot;
          <strong>II</strong> — a double &middot; <strong>IIII</strong> — four sheaves.</p>
          <p><em>Each sheave multiplies the pull again. Block times drum is the whole
          arithmetic of the machine.</em></p>`;
        game.journal.add('note_blocks', { title: 'The pulley blocks (Great Winch)', category: 'note', html });
        game.dialog({ title: 'The Block Chest', html });
      },
    });

    if (!raised) {
      spots.push({
        id: 'rigging', x: 700, y: 300, w: 170, h: 220, label: 'The rigging mounts',
        onInteract(game) { openRigging(game); },
      });
    }

    if (!state.journal.some(e => e.id === 'token6')) {
      spots.push({
        id: 'pit', x: 850, y: 750, w: 230, h: 90, label: 'The grease pit',
        onInteract(game) {
          game.journal.add('token6', {
            title: 'in the grease pit', category: 'sun',
            sun: { rays: 4, letter: 'S', emblem: 'fish-crest' },
          });
          game.say('Elbow-deep in a generation of grease, your fingers close on bone: a tessera. Wiped on your sleeve it shows a fish-crested helm and the letter S. Felix hid this one from everybody but a person willing to reach.');
        },
      });
    }

    spots.push({
      id: 'scars', x: 230, y: 130, w: 70, h: 630, label: 'Fire-scarred beam',
      onInteract(game) {
        game.say('The beam wears the fire like a healed wound — char scaled off, new timber scarfed in below. You wrote the report that said the western works needed twice the fire-watch. Somebody filed it. This is what filing looks like, twenty years on.');
      },
    });

    spots.push({
      id: 'chalk', x: 1440, y: 460, w: 150, h: 100, label: "Winchmen's tallies",
      onInteract(game) {
        game.say('Chalk tallies by the hundreds — lifts hauled, shifts survived, someone\'s persistent losing record at dice. Bored men count things. It is how the underworld keeps from becoming the underworld.');
      },
    });

    spots.push({
      id: 'platform', x: raised ? 1190 : 1190, y: raised ? 280 : 660, w: 240, h: raised ? 140 : 100,
      label: raised ? 'Ride up to the corridor' : 'The dead lift platform',
      onInteract(game) {
        if (!raised) {
          game.say('The western cage-lift, sitting dead on its blocks. ONVS: CCCL, says the frame — its rated burden, three hundred fifty librae. Gus steps onto the platform and sits, making the arithmetic personal.');
          return;
        }
        if (!game.journal.has('token6')) {
          game.say('"The pit," says Gus, glancing down at the grease. "Felix hid one where only the willing would reach. Be willing."');
          return;
        }
        game.say('You and an implausible quantity of lion ride the platform up through the shaft, past the winch\'s patient groan, to the corridor behind the western wall. Daylight leaks somewhere ahead.');
        game.completeRoom({ delay: 700 });
      },
    });

    return spots;
  },

  hintContext(state) {
    return (state.flags.winch_brakeFree && state.flags.winch_crankSet) ? 'ratio' : 'setup';
  },

  hints(state) {
    if (state.flags.winch_brakeFree && state.flags.winch_crankSet) {
      return [
        { text: 'Felix cut the lift\'s arithmetic into the beam: twelve men, one crank. The drum and the block do the multiplying.', cost: 60 },
        { text: 'Drum\'s mark times block\'s sheaves — exactly XII, no less, no more. Three drums, three blocks, one product lands on twelve.', cost: 120 },
        { text: 'Mount the III drum and the four-sheave block: three times four is twelve. Heave.', cost: 240 },
      ];
    }
    return [
      { text: 'She needs her brake freed and a bar to turn before any rigging matters — a key from an office, a handle from a wreck.', cost: 60 },
      { text: 'The bronze key\'s square end matches the brake socket; the capstan socket is cut for a bar like the one from the broken capstan below.', cost: 120 },
      { text: 'Hold the winch key and use it on the brake; hold the crank handle and use it on the capstan socket.', cost: 240 },
    ];
  },
};

function openRigging(game) {
  let drum = game.getFlag('winch_drum') || null;
  let block = game.getFlag('winch_block') || null;

  game.openPuzzle({
    id: 'winch_tackle',
    title: 'Rig the Great Winch',
    wide: true,
    render(body, api) {
      body.innerHTML = `
        <p class="puzzle-desc">The beam says it plainly: the lift asks TWELVE men, the
        crank gives ONE, and drum times block must make the twelve — no less, or she
        will not rise; no more, for the rope is cut to her length.</p>
        <div class="kit-cols">
          <div class="kit-col" id="win-drums"><div class="kit-col-title">Geared drum</div></div>
          <div class="kit-col" id="win-blocks"><div class="kit-col-title">Pulley block</div></div>
        </div>
        <div class="puzzle-row"><button class="btn btn-primary" id="win-heave">Heave</button></div>
        <div class="puzzle-feedback"></div>`;

      const mk = (colId, opts, cur, set) => {
        const col = body.querySelector(colId);
        for (const o of opts) {
          const el = document.createElement('button');
          el.className = 'kit-opt' + (cur === o.v ? ' on' : '');
          el.textContent = o.label;
          el.addEventListener('click', () => {
            set(o.v);
            col.querySelectorAll('.kit-opt').forEach(b => b.classList.remove('on'));
            el.classList.add('on');
            game.playSfx('stone');
          });
          col.appendChild(el);
        }
      };
      mk('#win-drums', [
        { v: 2, label: 'Drum II — two' },
        { v: 3, label: 'Drum III — three' },
        { v: 5, label: 'Drum V — five' },
      ], drum, v => { drum = v; game.setFlag('winch_drum', v); game.refreshScene(); });
      mk('#win-blocks', [
        { v: 1, label: 'Single sheave — I' },
        { v: 2, label: 'Double sheave — II' },
        { v: 4, label: 'Four sheaves — IIII' },
      ], block, v => { block = v; game.setFlag('winch_block', v); game.refreshScene(); });

      body.querySelector('#win-heave').addEventListener('click', () => {
        if (!game.getFlag('winch_brakeFree') || !game.getFlag('winch_crankSet')) {
          const missing = [];
          if (!game.getFlag('winch_brakeFree')) missing.push('her brake is still pinned');
          if (!game.getFlag('winch_crankSet')) missing.push('the capstan has no bar to turn');
          api.setFeedback(`You set your weight — and nothing. The machine declines politely: ${missing.join(', and ')}.`, 'bad');
          return;
        }
        if (!drum || !block) {
          api.setFeedback('The rigging mounts stand half-empty. Drum and block both, then heave.', 'bad');
          return;
        }
        const power = drum * block;
        if (power === 12) {
          game.setFlag('winch_raised');
          game.playSfx('unlock');
          api.solved({ message: 'Three times four is twelve, and twelve men\'s strength walks out of one crank and up the ropes. The drum turns, the block sings, and the western cage-lift rises off its blocks for the first time since the fire — grinding, complaining, working.' });
          game.refreshScene();
        } else if (power < 12) {
          api.fail('The platform shudders half a hand upward and settles back, unimpressed. Too few hands on the rope.');
        } else {
          api.fail('The drum spins sweet and easy — and the rope pays out and dangles, spent, a man\'s height short of the beam. The rope is cut to her length. Exactly twelve.');
        }
      });
    },
  });
}
