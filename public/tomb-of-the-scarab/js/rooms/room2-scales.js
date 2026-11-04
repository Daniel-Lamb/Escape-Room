// ROOM 2 — The Hall of the Scales. The weighing of the heart.
// Puzzle: balance Ma'at's scale. The stone heart weighs 13 deben; lay weight-
// stones {1,2,4,7,9} on the empty pan until they total exactly 13.
// Reward: amulet (H, 4 beads).

const HEART = 13;
const STONES = [1, 2, 4, 7, 9];

function balanced(state) { return !!state.flags.scales_balanced; }

export default {
  id: 'scales',
  title: 'The Hall of the Scales',
  intro: 'A long hall, and at its heart a great balance of black granite — the scale of Ma\'at, on which the dead are weighed. One pan holds a carved stone heart; the other hangs empty and high. A shelf of weight-stones waits beneath a line of carved truth.',

  scene(state) {
    const done = balanced(state);
    const amuletHere = done && !state.journal?.some?.(e => e.id === 'amulet_scales');
    const tilt = done ? 0 : 12;
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gd_sc_wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#241705"/><stop offset="0.6" stop-color="#38280f"/><stop offset="1" stop-color="#1c1206"/>
        </linearGradient>
        <radialGradient id="gd_sc_torch" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(255,178,77,0.4)"/><stop offset="1" stop-color="rgba(255,178,77,0)"/>
        </radialGradient>
      </defs>
      <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="art/scales.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="art/scales.mp4" type="video/mp4"/></video></foreignObject>
      <ellipse cx="820" cy="120" rx="360" ry="200" fill="url(#gd_sc_torch)" class="glow"/>

      <!-- Ma'at with her feather (mural, right) -->
      <g transform="translate(1300 300)">
        <ellipse cx="0" cy="0" rx="60" ry="120" fill="#20160a" stroke="#4a3520" stroke-width="3"/>
        <path d="M0 -80 Q-16 -30 0 20 Q16 -30 0 -80Z" fill="#5aa0d0" opacity="0.8"/>
        <text x="0" y="150" text-anchor="middle" font-size="15" fill="#8a6d3c" font-family="var(--serif, Georgia, serif)">Ma'at, and her feather of truth</text>
      </g>

      <!-- the balance -->
      <g transform="translate(700 300)">
        <rect x="-8" y="0" width="16" height="360" fill="#2a2a2f"/>
        <polygon points="-40,360 40,360 24,420 -24,420" fill="#2a2a2f"/>
        <!-- beam tilts toward the heavier (heart) side until balanced -->
        <g transform="rotate(${tilt})">
          <rect x="-260" y="-8" width="520" height="16" rx="6" fill="#3a3a40"/>
          <!-- left pan: the heart -->
          <line x1="-240" y1="0" x2="-240" y2="70" stroke="#555" stroke-width="3"/>
          <path d="M-300 70 a60 22 0 0 0 120 0 z" fill="#3a3a40"/>
          <path d="M-240 40 q-22 -26 -44 -4 q-10 14 44 40 q54 -26 44 -40 q-22 -22 -44 4z" fill="#7a1f2b" stroke="#d4a72a" stroke-width="1.5"/>
          <text x="-240" y="112" text-anchor="middle" font-size="14" fill="#c78" font-family="var(--serif, Georgia, serif)">the heart</text>
          <!-- right pan: your weights -->
          <line x1="240" y1="0" x2="240" y2="70" stroke="#555" stroke-width="3"/>
          <path d="M180 70 a60 22 0 0 0 120 0 z" fill="#3a3a40"/>
          ${done ? `<g>${[-24, 0, 24].map((dx, i) => `<rect x="${210 + i * 20 - 10}" y="44" width="18" height="14" rx="3" fill="#d4a72a"/>`).join('')}</g>` : ''}
        </g>
      </g>

      <!-- inscription -->
      <g font-family="var(--serif, Georgia, serif)" fill="#efe0b8">
        <text x="120" y="640" font-size="23" font-style="italic">"The heart weighs thirteen deben.</text>
        <text x="120" y="672" font-size="23" font-style="italic">Make the feather its equal, no more and no less."</text>
      </g>

      <!-- weight-stone shelf (bottom right) -->
      <g transform="translate(1140 700)">
        <rect x="-20" y="-20" width="380" height="90" rx="8" fill="#20160a" stroke="#4a3520" stroke-width="3"/>
        ${STONES.map((w, i) => `<g transform="translate(${i * 72 + 20} 24)"><rect x="-24" y="-20" width="48" height="40" rx="5" fill="#3a2a12" stroke="#d4a72a" stroke-width="1.5"/><text x="0" y="6" text-anchor="middle" font-size="18" fill="#f2d774" font-family="var(--serif, Georgia, serif)">${w}</text></g>`).join('')}
      </g>

      <!-- amulet, revealed when balanced (in the opened base of the scale) -->
      ${amuletHere ? `<g class="beckon" transform="translate(700 760)">
        <rect x="-60" y="-40" width="120" height="90" rx="8" fill="#0a0703" stroke="#d4a72a" stroke-width="3"/>
        <g transform="translate(0 10)"><ellipse cx="0" cy="0" rx="20" ry="26" fill="#2f6fb0" stroke="#f2d774" stroke-width="3"/><line x1="0" y1="-24" x2="0" y2="24" stroke="#f2d774" stroke-width="2"/><circle cx="0" cy="-30" r="8" fill="#f2d774"/></g>
      </g>` : ''}

      <path d="M0 900 L0 856 Q800 894 1600 856 L1600 900 Z" fill="#050301"/>
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const done = balanced(state);
    spots.push({ id: 'inscription', x: 110, y: 610, w: 700, h: 80, label: 'The carved truth',
      onInteract(game) {
        game.journal.add('note_scales', { title: 'The Hall of the Scales', category: 'note',
          html: '<p>"The heart weighs thirteen deben. Make the feather its equal, no more and no less."</p>' });
        game.say('"The heart weighs thirteen deben. Make the feather its equal." Thirteen, exactly — copied to your palette.');
      } });
    spots.push({ id: 'maat', x: 1240, y: 250, w: 140, h: 220, label: 'Ma\'at and her feather',
      onInteract(game) { game.say('Ma\'at, truth herself, holds out the feather your weights must match. She does not look like she grades on a curve.'); } });

    if (!done) {
      spots.push({ id: 'scale', x: 440, y: 300, w: 520, h: 340, label: 'The balance of Ma\'at',
        onInteract(game) { openScale(game); } });
      spots.push({ id: 'shelf', x: 1120, y: 680, w: 380, h: 110, label: 'The weight-stones',
        onInteract(game) { openScale(game); } });
    } else {
      if (!(state.journal || []).some(e => e.id === 'amulet_scales')) {
        spots.push({ id: 'amulet', x: 640, y: 720, w: 120, h: 100, label: 'An amulet in the base',
          onInteract(game) {
            game.journal.add('amulet_scales', { title: 'Amulet of the Scales', category: 'sun', sun: { rays: 4, letter: 'H' } });
            game.say('The balanced beam unlatched a drawer in the granite base. Inside: an amulet with four beads carved along it, and the letter H.');
            game.refreshScene();
          } });
      }
      spots.push({ id: 'exit', x: 60, y: 300, w: 220, h: 420, label: 'The passage on',
        onInteract(game) {
          if (!game.journal.has('amulet_scales')) { game.say('The scale\'s base has opened. Take the amulet inside before you move on.'); return; }
          game.completeRoom({ delay: 600 });
        } });
    }
    return spots;
  },

  hints: [
    { text: 'Balance means equal. The heart weighs thirteen; your stones must total the same.', cost: 60 },
    { text: 'You have stones of 1, 2, 4, 7 and 9. Choose a set of them that adds up to exactly 13.', cost: 120 },
    { text: 'Lay the 9 and the 4 on the empty pan (or 7 + 4 + 2). Either totals 13 and the beam goes level.', cost: 240 },
  ],
};

function openScale(game) {
  const on = new Set(game.getFlag('scales_on') || []);
  game.openPuzzle({
    id: 'scales_balance',
    title: 'The Weighing of the Heart',
    render(body, api) {
      body.innerHTML = `
        <p class="puzzle-desc">The stone heart weighs <strong>${HEART} deben</strong>. Lay weight-stones on the
        empty pan until they total exactly that &mdash; no more, no less.</p>
        <div class="puzzle-row" id="sc-stones"></div>
        <p style="text-align:center; font-size:22px; margin:6px 0;">On the pan: <strong id="sc-total">0</strong> / ${HEART} deben</p>
        <p style="text-align:center; font-style:italic; color:var(--text-dim);" id="sc-tilt">The beam hangs heavy toward the heart.</p>
        <div class="puzzle-feedback"></div>`;
      const row = body.querySelector('#sc-stones');
      const totalEl = body.querySelector('#sc-total');
      const tiltEl = body.querySelector('#sc-tilt');
      const sum = () => [...on].reduce((a, b) => a + b, 0);
      const refresh = () => {
        const s = sum();
        totalEl.textContent = s;
        tiltEl.textContent = s === HEART ? 'The beam floats perfectly level.'
          : s < HEART ? 'The beam hangs heavy toward the heart.' : 'The pan drops — too much weight.';
        game.setFlag('scales_on', [...on]);
      };
      STONES.forEach(w => {
        const b = document.createElement('button');
        b.className = 'btn btn-ghost';
        b.style.minWidth = '64px';
        const paint = () => { b.textContent = `${w}${on.has(w) ? ' ✓' : ''}`; b.classList.toggle('btn-primary', on.has(w)); };
        paint();
        b.addEventListener('click', () => {
          on.has(w) ? on.delete(w) : on.add(w);
          paint(); refresh(); game.playSfx('click');
        });
        row.appendChild(b);
      });
      refresh();
      const foot = document.createElement('div');
      foot.className = 'puzzle-row';
      foot.innerHTML = `<button class="btn btn-primary" id="sc-try">Read the Beam</button>`;
      body.appendChild(foot);
      body.querySelector('#sc-try').addEventListener('click', () => {
        if (sum() === HEART) {
          game.setFlag('scales_balanced');
          game.playSfx('unlock');
          api.solved({ message: 'The beam swings, wavers, and settles dead level. Truth is satisfied. In the granite base, a drawer slides open.' });
          game.refreshScene();
        } else {
          api.fail(sum() < HEART ? 'The heart still outweighs the feather. Add more.' : 'Too heavy — the feather flies up. Take some away.');
        }
      });
    },
  });
}
