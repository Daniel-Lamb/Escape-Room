// ROOM 5 — The Burial Chamber. META + finale.
// The false door asks for the sign of life. The four amulets, sorted by bead
// count ascending (1,2,3,4), read A-N-K-H. Speak ANKH and come forth by day.

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const WORD = 'ANKH';

export default {
  id: 'burial',
  title: 'The Burial Chamber',
  intro: 'The last chamber, and the greatest. A stone sarcophagus lies open and long empty at its centre; the far wall is a false door, carved for a soul to pass and for nothing else. Four brass letter-rings ring its lintel, and a plaque beneath them waits to be obeyed.',

  scene(state) {
    const d = [0, 1, 2, 3].map(i => state.flags[`burial_d${i}`] ?? 0);
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gd_bu_wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#2a1c0a"/><stop offset="0.6" stop-color="#3a2a12"/><stop offset="1" stop-color="#1a1206"/>
        </linearGradient>
        <radialGradient id="gd_bu_torch" cx="0.5" cy="0.4" r="0.5">
          <stop offset="0" stop-color="rgba(255,178,77,0.45)"/><stop offset="1" stop-color="rgba(255,178,77,0)"/>
        </radialGradient>
      </defs>
      <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="art/burial.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="art/burial.mp4" type="video/mp4"/></video></foreignObject>
      <ellipse cx="800" cy="140" rx="360" ry="200" fill="url(#gd_bu_torch)" class="glow"/>

      <!-- sarcophagus, centre-low -->
      <g transform="translate(600 560)">
        <rect x="0" y="0" width="400" height="150" rx="20" fill="#2a2016" stroke="#8a6a15" stroke-width="4"/>
        <rect x="24" y="20" width="352" height="110" rx="14" fill="#0a0703"/>
        <ellipse cx="200" cy="40" rx="70" ry="20" fill="#3a2a12"/>
        <text x="200" y="196" text-anchor="middle" font-size="15" fill="#8a6d3c" font-style="italic" font-family="var(--serif, Georgia, serif)">the sarcophagus &mdash; open, and long empty</text>
      </g>

      <!-- the false door, right -->
      <g transform="translate(1160 250)">
        <rect x="0" y="0" width="320" height="520" rx="6" fill="#241705" stroke="#d4a72a" stroke-width="5"/>
        <rect x="34" y="60" width="252" height="430" rx="4" fill="#1a1206" stroke="#8a6a15" stroke-width="3"/>
        <rect x="70" y="120" width="180" height="330" rx="3" fill="#150e05" stroke="#6b520f" stroke-width="2"/>
        <!-- four brass rings on the lintel -->
        <rect x="34" y="14" width="252" height="42" rx="8" fill="#241a10" stroke="#57432a" stroke-width="2"/>
        <g font-family="var(--serif, Georgia, serif)" font-size="26" fill="#f2d774" text-anchor="middle">
          ${d.map((v, i) => `<text x="${74 + i * 58}" y="45">${ALPHA[v]}</text>`).join('')}
        </g>
        <!-- ankh carved on the door -->
        <g transform="translate(160 300)" stroke="#8a6a15" stroke-width="8" fill="none">
          <circle cx="0" cy="-40" r="26"/><line x1="0" y1="-14" x2="0" y2="70"/><line x1="-40" y1="6" x2="40" y2="6"/>
        </g>
      </g>

      <!-- plaque -->
      <g font-family="var(--serif, Georgia, serif)" fill="#efe0b8">
        <text x="120" y="300" font-size="24" font-style="italic">"Speak the sign of life,</text>
        <text x="120" y="334" font-size="24" font-style="italic">and the door will remember it is a door.</text>
        <text x="120" y="372" font-size="20" fill="#d4a72a">The fewest beads speak first."</text>
      </g>

      <path d="M0 900 L0 856 Q800 894 1600 856 L1600 900 Z" fill="#050301"/>
    </svg>`;
  },

  hotspots() {
    return [
      { id: 'sarcophagus', x: 600, y: 560, w: 400, h: 200, label: 'The sarcophagus',
        onInteract(game) { game.say('Empty — robbed centuries ago, or never filled. Either way, the way out was never meant to be up through the lid, but through the false door in the wall.'); } },
      { id: 'plaque', x: 110, y: 270, w: 700, h: 120, label: 'The plaque',
        onInteract(game) {
          game.journal.add('note_falsedoor', { title: 'The false door (the plaque)', category: 'note',
            html: '<p>"Speak the sign of life, and the door will remember it is a door. The fewest beads speak first."</p><p>The sign of life is the ankh. Order your four amulets by their bead-count, fewest first, and read the letters.</p>' });
          game.dialog({ title: 'The Plaque', html: '<div class="parchment-note aged"><p>"Speak the sign of life, and the door will remember it is a door.<br><strong>The fewest beads speak first.</strong>"</p></div><p style="margin-top:12px;color:var(--text-dim);font-style:italic;">Your four amulets each carry a count of beads and a letter. Sort them fewest-beads-first and read down the letters.</p>' });
        } },
      { id: 'door', x: 1160, y: 250, w: 320, h: 520, label: 'The false door — four rings',
        onInteract(game) { openDoor(game); } },
    ];
  },

  hints: [
    { text: 'The "sign of life" is the ankh. Your four amulets spell it — but only in the right order.', cost: 60 },
    { text: 'Open your journal. Each amulet has a bead-count. Sort them fewest beads to most, then read the letters top to bottom.', cost: 120 },
    { text: '1 bead A, 2 beads N, 3 beads K, 4 beads H. Set the rings to ANKH.', cost: 240 },
  ],
};

function openDoor(game) {
  const v = [0, 1, 2, 3].map(i => game.getFlag(`burial_d${i}`) ?? 0);
  const amulets = game.state.journal.filter(e => e.category === 'sun');
  game.openPuzzle({
    id: 'burial_door',
    title: 'The False Door',
    render(body, api) {
      body.innerHTML = `
        <p class="puzzle-desc">Four brass rings on the lintel. <em>"Speak the sign of life. The fewest beads speak first."</em>
        ${amulets.length < 4
          ? `<br><strong style="color:var(--danger);">Your palette holds only ${amulets.length} of the four amulets.</strong> Each chamber kept one.`
          : 'Your palette holds all four amulets. Sort them by bead-count and read the letters.'}</p>
        <div class="puzzle-row" id="bu-dials"></div>
        <div class="puzzle-row"><button class="btn btn-primary" id="bu-try">Speak the Sign</button></div>
        <div class="puzzle-feedback"></div>
        <p style="text-align:center; margin-top:10px; font-size:13.5px; color:var(--text-dim);">
          (Open your <strong>Journal</strong> from the top bar to see each amulet's beads and letter.)</p>`;
      const row = body.querySelector('#bu-dials');
      v.forEach((val, i) => {
        const dial = document.createElement('div');
        dial.className = 'dial';
        dial.innerHTML = `<button class="dial-btn" data-d="1">&#9650;</button><div class="dial-face">${ALPHA[val]}</div><button class="dial-btn" data-d="-1">&#9660;</button>`;
        const face = dial.querySelector('.dial-face');
        dial.querySelectorAll('.dial-btn').forEach(btn => btn.addEventListener('click', () => {
          v[i] = (v[i] + Number(btn.dataset.d) + 26) % 26;
          face.textContent = ALPHA[v[i]];
          face.classList.remove('tick'); void face.offsetWidth; face.classList.add('tick');
          game.playSfx('click');
          game.setFlag(`burial_d${i}`, v[i]);
        }));
        row.appendChild(dial);
      });
      body.querySelector('#bu-try').addEventListener('click', () => {
        const word = v.map(x => ALPHA[x]).join('');
        if (word === WORD) {
          game.setFlag('burial_open');
          game.playSfx('unlock');
          api.solved({ message: 'ANKH — the sign of life. Deep in the wall a counterweight the size of an ox lets go, and the false door swings inward on a blade of desert dawn.' });
          setTimeout(() => game.completeRoom({ delay: 400 }), 1300);
        } else {
          api.fail('The rings sit dead in the stone. That is not the sign the amulets spell.');
        }
      });
    },
  });
}
