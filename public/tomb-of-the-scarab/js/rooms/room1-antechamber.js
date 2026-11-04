// ROOM 1 — The Antechamber. Tutorial difficulty.
// Puzzle: the sealed inner door has three glyph-dials. A painted procession
// tells the count: scarabs (5), lotus blossoms (3), ibis (2) -> 5 3 2.
// Reward: the first amulet (N, 2 beads).

function doorOpen(state) { return !!state.flags.ante_doorOpen; }

// little countable motifs, drawn so the player can literally count them
function scarab(x, y) {
  return `<g transform="translate(${x} ${y})">
    <ellipse cx="0" cy="0" rx="11" ry="14" fill="#3a2a12" stroke="#d4a72a" stroke-width="1.5"/>
    <line x1="0" y1="-12" x2="0" y2="12" stroke="#d4a72a" stroke-width="1.5"/>
    <circle cx="0" cy="-16" r="5" fill="#d4a72a"/></g>`;
}
function lotus(x, y) {
  return `<g transform="translate(${x} ${y})" fill="none" stroke="#5aa0d0" stroke-width="2.5">
    <path d="M0 8 L0 -14 M0 4 Q-14 -6 -12 -18 M0 4 Q14 -6 12 -18 M0 2 Q-7 -10 -5 -20 M0 2 Q7 -10 5 -20"/></g>`;
}
function ibis(x, y) {
  return `<g transform="translate(${x} ${y})" fill="#efe0b8" stroke="#a08a63" stroke-width="1">
    <ellipse cx="0" cy="0" rx="14" ry="7"/><circle cx="12" cy="-8" r="4"/>
    <path d="M15 -8 q10 2 12 12" fill="none" stroke="#a08a63" stroke-width="2"/>
    <path d="M-14 0 l-10 4 l8 3 z"/></g>`;
}

export default {
  id: 'antechamber',
  title: 'The Antechamber',
  intro: 'Dust settles where the entrance used to be. Behind you, a wall of fallen stone; ahead, a sealed inner door with three worn glyph-rings. The whole east wall is painted with a funeral procession, and a line of hieroglyphs runs beneath it like a caption waiting to be read.',

  scene(state) {
    const open = doorOpen(state);
    const amuletHere = open && !state.journal?.some?.(e => e.id === 'amulet_ante');
    const d = [state.flags.ante_d1 ?? 0, state.flags.ante_d2 ?? 0, state.flags.ante_d3 ?? 0];
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gd_ante_wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#2a1c0a"/><stop offset="0.6" stop-color="#3a2a12"/><stop offset="1" stop-color="#241705"/>
        </linearGradient>
        <radialGradient id="gd_ante_torch" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(255,178,77,0.5)"/><stop offset="1" stop-color="rgba(255,178,77,0)"/>
        </radialGradient>
      </defs>
      <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="art/antechamber.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="art/antechamber.mp4" type="video/mp4"/></video></foreignObject>

      <!-- torch, upper centre -->
      <g>
        <ellipse cx="800" cy="150" rx="300" ry="200" fill="url(#gd_ante_torch)" class="glow"/>
        <rect x="788" y="150" width="24" height="70" rx="6" fill="#4a3520"/>
        <path class="torch-flame" d="M800 84 Q822 118 806 152 Q800 160 794 152 Q778 118 800 84Z" fill="#ffb24d"/>
      </g>

      <!-- collapsed entrance (bottom-left, flavour) -->
      <path d="M40 620 L110 470 L250 520 L330 660 L300 860 L40 860 Z" fill="#20160a" stroke="#4a3520" stroke-width="4"/>
      <text x="185" y="770" text-anchor="middle" font-size="18" fill="#8a6d3c" font-style="italic" font-family="var(--serif, Georgia, serif)">the way you came &mdash; buried</text>

      <!-- procession murals: count these -->
      <rect x="380" y="250" width="820" height="200" rx="8" fill="#20160a" stroke="#4a3520" stroke-width="3"/>
      <text x="400" y="286" font-size="18" fill="#a08a63" font-family="var(--serif, Georgia, serif)">A funeral procession, painted in ochre and lapis</text>
      <!-- 5 scarabs -->
      <g>${[420, 462, 504, 546, 588].map(x => scarab(x, 360)).join('')}</g>
      <text x="504" y="418" text-anchor="middle" font-size="13" fill="#8a6d3c">scarabs</text>
      <!-- 3 lotus -->
      <g>${[700, 745, 790].map(x => lotus(x, 366)).join('')}</g>
      <text x="745" y="418" text-anchor="middle" font-size="13" fill="#8a6d3c">blossoms</text>
      <!-- 2 ibis -->
      <g>${[980, 1060].map(x => ibis(x, 360)).join('')}</g>
      <text x="1020" y="418" text-anchor="middle" font-size="13" fill="#8a6d3c">ibis</text>

      <!-- caption / inscription -->
      <g font-family="var(--serif, Georgia, serif)" fill="#efe0b8">
        <text x="390" y="500" font-size="23" font-style="italic">"Number the scarabs, then the blossoms, then the ibis:</text>
        <text x="390" y="532" font-size="23" font-style="italic">so speaks the door, and only so."</text>
      </g>

      <!-- sealed inner door, right -->
      <g>
        <rect x="1180" y="330" width="300" height="470" rx="10" fill="${open ? '#0a0703' : '#2a1c0a'}" stroke="#d4a72a" stroke-width="4"/>
        ${open
          ? `<rect x="1210" y="360" width="240" height="410" rx="6" fill="#050301"/>
             <text x="1330" y="580" text-anchor="middle" font-size="22" fill="#5aa0d0" font-style="italic" font-family="var(--serif, Georgia, serif)">open &mdash; a passage beyond</text>`
          : `<rect x="1210" y="360" width="240" height="120" rx="6" fill="#1a1206"/>
             <g font-family="var(--serif, Georgia, serif)" font-size="40" fill="#f2d774" text-anchor="middle">
               <text x="1270" y="440">${d[0]}</text><text x="1330" y="440">${d[1]}</text><text x="1390" y="440">${d[2]}</text>
             </g>
             <circle cx="1330" cy="600" r="34" fill="none" stroke="#d4a72a" stroke-width="4"/>
             ${Array.from({ length: 10 }, (_, i) => { const a = i / 10 * Math.PI * 2; return `<line x1="${1330 + Math.cos(a) * 40}" y1="${600 + Math.sin(a) * 40}" x2="${1330 + Math.cos(a) * 54}" y2="${600 + Math.sin(a) * 54}" stroke="#d4a72a" stroke-width="3" stroke-linecap="round"/>`; }).join('')}`}
      </g>

      <!-- amulet niche, revealed when open -->
      ${amuletHere ? `<g class="beckon">
        <rect x="470" y="620" width="120" height="150" rx="8" fill="#0a0703" stroke="#d4a72a" stroke-width="3"/>
        <g transform="translate(530 690)"><ellipse cx="0" cy="0" rx="22" ry="28" fill="#2f6fb0" stroke="#f2d774" stroke-width="3"/><line x1="0" y1="-26" x2="0" y2="26" stroke="#f2d774" stroke-width="2"/><circle cx="0" cy="-32" r="9" fill="#f2d774"/></g>
        <text x="530" y="756" text-anchor="middle" font-size="14" fill="#f2d774" font-family="var(--serif, Georgia, serif)">an amulet</text>
      </g>` : ''}

      <path d="M0 900 L0 850 Q800 890 1600 850 L1600 900 Z" fill="#050301"/>
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const open = doorOpen(state);

    spots.push({ id: 'scarabs', x: 400, y: 300, w: 200, h: 130, label: 'Painted scarabs',
      onInteract(game) { game.say('Sacred scarabs, rolling the sun before them. You count them twice: five.'); } });
    spots.push({ id: 'lotus', x: 680, y: 300, w: 150, h: 130, label: 'Painted blossoms',
      onInteract(game) { game.say('Lotus blossoms, opening for the morning. Three of them.'); } });
    spots.push({ id: 'ibis', x: 950, y: 300, w: 160, h: 130, label: 'Painted ibis',
      onInteract(game) { game.say('The ibis of Thoth, patron of scribes. Two birds, beak and all.'); } });
    spots.push({ id: 'caption', x: 385, y: 470, w: 640, h: 80, label: 'The inscription',
      onInteract(game) {
        game.journal.add('note_ante', { title: 'Antechamber door (the caption)', category: 'note',
          html: '<p>"Number the scarabs, then the blossoms, then the ibis: so speaks the door, and only so."</p>' });
        game.say('"Number the scarabs, then the blossoms, then the ibis." Three counts, in that order — copied to your palette.');
      } });
    spots.push({ id: 'rubble', x: 40, y: 460, w: 300, h: 400, label: 'The collapsed entrance',
      onInteract(game) { game.say('Tons of it. You could dig for a week and only run out of air faster. Forward is the only way.'); } });

    if (!open) {
      spots.push({ id: 'door', x: 1180, y: 330, w: 300, h: 470, label: 'Sealed door — three rings',
        onInteract(game) { openDoor(game); } });
    } else {
      if (!(state.journal || []).some(e => e.id === 'amulet_ante')) {
        spots.push({ id: 'amulet', x: 470, y: 620, w: 120, h: 150, label: 'An amulet in the niche',
          onInteract(game) {
            game.journal.add('amulet_ante', { title: 'Amulet of the Antechamber', category: 'sun', sun: { rays: 2, letter: 'N' } });
            game.say('An amulet of blue faience: two carved beads along its edge, and beneath them the letter N. The door hid it well.');
            game.refreshScene();
          } });
      }
      spots.push({ id: 'doorway', x: 1180, y: 330, w: 300, h: 470, label: 'The open passage',
        onInteract(game) {
          if (!game.journal.has('amulet_ante')) { game.say('An amulet rests in the niche the door uncovered. Take it before you go — the false door at the end will want it.'); return; }
          game.completeRoom({ delay: 600 });
        } });
    }
    return spots;
  },

  hints: [
    { text: 'The caption is a list of three things to count, in order. The door has three rings.', cost: 60 },
    { text: 'Count what is painted: the scarabs, then the blossoms, then the ibis. Set the rings to those three numbers in that order.', cost: 120 },
    { text: 'Five scarabs, three blossoms, two ibis: set the rings to 5, 3, 2.', cost: 240 },
  ],
};

function openDoor(game) {
  const v = [game.getFlag('ante_d1') ?? 0, game.getFlag('ante_d2') ?? 0, game.getFlag('ante_d3') ?? 0];
  game.openPuzzle({
    id: 'ante_door',
    title: 'The Sealed Door',
    render(body, api) {
      body.innerHTML = `
        <p class="puzzle-desc">Three glyph-rings, each numbered 0 through 9.
        <em>"Number the scarabs, then the blossoms, then the ibis."</em></p>
        <div class="puzzle-row" id="ante-dials"></div>
        <div class="puzzle-row"><button class="btn btn-primary" id="ante-try">Set the Rings</button></div>
        <div class="puzzle-feedback"></div>`;
      const row = body.querySelector('#ante-dials');
      v.forEach((val, i) => {
        const dial = document.createElement('div');
        dial.className = 'dial';
        dial.innerHTML = `<button class="dial-btn" data-d="1">&#9650;</button><div class="dial-face">${val}</div><button class="dial-btn" data-d="-1">&#9660;</button>`;
        const face = dial.querySelector('.dial-face');
        dial.querySelectorAll('.dial-btn').forEach(btn => btn.addEventListener('click', () => {
          v[i] = (v[i] + Number(btn.dataset.d) + 10) % 10;
          face.textContent = v[i];
          face.classList.remove('tick'); void face.offsetWidth; face.classList.add('tick');
          game.playSfx('click');
          game.setFlag(`ante_d${i + 1}`, v[i]);
        }));
        row.appendChild(dial);
      });
      body.querySelector('#ante-try').addEventListener('click', () => {
        if (v[0] === 5 && v[1] === 3 && v[2] === 2) {
          game.setFlag('ante_doorOpen');
          game.playSfx('stone');
          api.solved({ message: 'The rings seat with three deep clicks. Counterweights fall somewhere in the wall, and the door grinds inward — and behind it, a niche the door itself had been hiding.' });
          game.refreshScene();
        } else {
          api.fail('The rings grind and spring back. That is not the count the wall paints.');
        }
      });
    },
  });
}
