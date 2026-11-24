// ROOM 1 — The Antechamber. Tutorial difficulty.
// Puzzle: the sealed inner door has three glyph-rings. A painted procession
// runs along the wall above it, walking toward the door behind a jackal-headed
// guide. The caption counts only those who walk BEHIND the guide: scarabs (5),
// blossoms (3), ibis (2) -> 5 3 2. (Counting everything gives 6 4 3 — the
// three figures striding ahead of the guide are heralds, not the dead's company.)
// Reward: the first amulet (scarab sign, N, 2 beads).

import { kitDefs, panel, shadow, plateHero } from '../../../shared/js/scenekit.js';

function doorOpen(state) { return !!state.flags.ante_doorOpen; }

// The procession, left to right; everyone walks right, toward the door.
const PROCESSION = ['lotus', 'scarab', 'scarab', 'ibis', 'lotus', 'scarab', 'scarab', 'scarab', 'lotus', 'ibis',
  'jackal', 'scarab', 'ibis', 'lotus'];
const GUIDE = PROCESSION.indexOf('jackal');
const behind = (kind) => PROCESSION.slice(0, GUIDE).filter(k => k === kind).length;   // 5, 3, 2
const ANSWER = [behind('scarab'), behind('lotus'), behind('ibis')];

// Layout — the plate (art/antechamber.webp): fallen rubble (left), the sealed
// door with painted reliefs either side, a frieze band above it, two torches.
const FRIEZE = { x: 636, y: 96, w: 836, h: 92 };
const CAPTION = { x: 690, y: 250, w: 296, h: 186 };
const DOOR = { x: 1002, y: 204, w: 196, h: 378 };
const NICHE = { x: 1252, y: 420, w: 118, h: 140 };

// little countable motifs, every one facing right (the way the procession walks)
function figure(kind, x, y) {
  switch (kind) {
    case 'scarab': return `<g transform="translate(${x} ${y})">
      <ellipse cx="0" cy="0" rx="11" ry="14" fill="#3a2a12" stroke="#d4a72a" stroke-width="1.5"/>
      <line x1="0" y1="-12" x2="0" y2="12" stroke="#d4a72a" stroke-width="1.5"/>
      <circle cx="0" cy="-16" r="5" fill="#d4a72a"/></g>`;
    case 'lotus': return `<g transform="translate(${x} ${y})" fill="none" stroke="#5aa0d0" stroke-width="2.5">
      <path d="M0 8 L0 -14 M0 4 Q-14 -6 -12 -18 M0 4 Q14 -6 12 -18 M0 2 Q-7 -10 -5 -20 M0 2 Q7 -10 5 -20"/></g>`;
    case 'ibis': return `<g transform="translate(${x} ${y})" fill="#efe0b8" stroke="#a08a63" stroke-width="1">
      <ellipse cx="0" cy="0" rx="14" ry="7"/><circle cx="12" cy="-8" r="4"/>
      <path d="M15 -8 q10 2 12 12" fill="none" stroke="#a08a63" stroke-width="2"/>
      <path d="M-14 0 l-10 4 l8 3 z"/></g>`;
    case 'jackal': return `<g transform="translate(${x} ${y - 6})">
      <rect x="-7" y="-4" width="14" height="30" rx="4" fill="#1a1206" stroke="#d4a72a" stroke-width="1.5"/>
      <path d="M-6 -4 L-4 -22 L0 -14 L8 -16 L16 -12 L6 -6 Z" fill="#1a1206" stroke="#d4a72a" stroke-width="1.5"/>
      <path d="M-4 -22 l-2 -8 l5 6 M2 -16 l1 -9 l3 8" stroke="#d4a72a" stroke-width="1.5" fill="none"/>
      <line x1="10" y1="2" x2="10" y2="30" stroke="#d4a72a" stroke-width="2"/></g>`;
  }
  return '';
}
function friezeFigures(x0, y, step) {
  return PROCESSION.map((k, i) => figure(k, x0 + i * step, y)).join('');
}

export default {
  id: 'antechamber',
  solution: ANSWER,
  title: 'The Antechamber',
  intro: 'Dust settles where the entrance used to be. Behind you, a wall of fallen stone; ahead, a sealed inner door with three worn glyph-rings. Along the wall above it walks a painted funeral procession, and beside the door a caption waits to be read.',
  lintStates: [{ label: 'open', flags: { ante_doorOpen: true } }],

  scene(state) {
    const open = doorOpen(state);
    const amuletHere = open && !state.journal?.some?.(e => e.id === 'amulet_ante');
    const d = [state.flags.ante_d1 ?? 0, state.flags.ante_d2 ?? 0, state.flags.ante_d3 ?? 0];
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${kitDefs()}
        <radialGradient id="gd_ante_torch" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(255,178,77,0.5)"/><stop offset="1" stop-color="rgba(255,178,77,0)"/>
        </radialGradient>
      </defs>
      <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="art/antechamber.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="art/antechamber.mp4" type="video/mp4"/></video></foreignObject>

      <!-- warmth over the plate's two torches -->
      <ellipse cx="168" cy="240" rx="160" ry="130" fill="url(#gd_ante_torch)" class="glow"/>
      <ellipse cx="1424" cy="260" rx="160" ry="130" fill="url(#gd_ante_torch)" class="glow"/>

      <!-- the procession, painted along the frieze band above the door: all walk right, toward it -->
      ${panel({ ...FRIEZE, material: 'sandstone', mount: 'inset', rx: 4, body: `
        <line x1="${FRIEZE.x + 14}" y1="${FRIEZE.y + 72}" x2="${FRIEZE.x + FRIEZE.w - 14}" y2="${FRIEZE.y + 72}" stroke="#6b4f22" stroke-width="2"/>
        ${friezeFigures(FRIEZE.x + 42, FRIEZE.y + 50, 58)}` })}

      <!-- the caption, painted on the relief panel left of the door -->
      ${panel({ ...CAPTION, material: 'sandstone', mount: 'inset', rx: 4, body: `
        <g font-family="var(--serif, Georgia, serif)" fill="#2e2210" font-style="italic" font-size="16.5">
          <text x="${CAPTION.x + 16}" y="${CAPTION.y + 34}">"The jackal leads the dead</text>
          <text x="${CAPTION.x + 16}" y="${CAPTION.y + 58}">to the door. Number those</text>
          <text x="${CAPTION.x + 16}" y="${CAPTION.y + 82}">who walk behind him —</text>
          <text x="${CAPTION.x + 16}" y="${CAPTION.y + 112}">the scarabs, then the</text>
          <text x="${CAPTION.x + 16}" y="${CAPTION.y + 136}">blossoms, then the ibis:</text>
          <text x="${CAPTION.x + 16}" y="${CAPTION.y + 166}">so speaks the door."</text>
        </g>` })}

      <!-- the sealed inner door (painted): its three glyph-rings set into the panel -->
      <g data-mount="bolts">
        ${open
          ? `<rect x="${DOOR.x + 4}" y="${DOOR.y + 4}" width="${DOOR.w - 8}" height="${DOOR.h - 8}" fill="#050301"/>
             <text x="${DOOR.x + DOOR.w / 2}" y="${DOOR.y + DOOR.h / 2}" text-anchor="middle" font-size="16" fill="#5aa0d0" font-style="italic" font-family="var(--serif, Georgia, serif)">a passage beyond</text>`
          : `<rect x="${DOOR.x + 20}" y="${DOOR.y + 70}" width="${DOOR.w - 40}" height="70" rx="6" fill="#1a1206" stroke="#d4a72a" stroke-width="3" filter="url(#sk_drop)"/>
             <g font-family="var(--serif, Georgia, serif)" font-size="38" fill="#f2d774" text-anchor="middle">
               ${d.map((v, i) => `<text x="${DOOR.x + 48 + i * 50}" y="${DOOR.y + 120}">${v}</text>`).join('')}
             </g>
             <circle cx="${DOOR.x + DOOR.w / 2}" cy="${DOOR.y + 250}" r="30" fill="none" stroke="#d4a72a" stroke-width="4"/>
             ${Array.from({ length: 10 }, (_, i) => { const a = i / 10 * Math.PI * 2; const cx = DOOR.x + DOOR.w / 2, cy = DOOR.y + 250; return `<line x1="${cx + Math.cos(a) * 36}" y1="${cy + Math.sin(a) * 36}" x2="${cx + Math.cos(a) * 48}" y2="${cy + Math.sin(a) * 48}" stroke="#d4a72a" stroke-width="3" stroke-linecap="round"/>`; }).join('')}`}
      </g>

      <!-- the niche the door hid, cut into the relief wall beside it -->
      ${open ? `<g data-mount="inset">
        <rect x="${NICHE.x - 6}" y="${NICHE.y - 6}" width="${NICHE.w + 12}" height="${NICHE.h + 12}" rx="8" fill="#000" opacity="0.5"/>
        <rect x="${NICHE.x}" y="${NICHE.y}" width="${NICHE.w}" height="${NICHE.h}" rx="6" fill="#0a0703" stroke="#d4a72a" stroke-width="2"/>
        ${amuletHere ? `<g class="beckon" transform="translate(${NICHE.x + NICHE.w / 2} ${NICHE.y + 74})"><ellipse cx="0" cy="0" rx="22" ry="28" fill="#2f6fb0" stroke="#f2d774" stroke-width="3"/><line x1="0" y1="-26" x2="0" y2="26" stroke="#f2d774" stroke-width="2"/><circle cx="0" cy="-32" r="9" fill="#f2d774"/></g>` : ''}
      </g>` : ''}

      <path d="M0 900 L0 850 Q800 890 1600 850 L1600 900 Z" fill="#050301"/>
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const open = doorOpen(state);

    spots.push({ id: 'procession', ...FRIEZE, label: 'The painted procession',
      onInteract(game) {
        const html = `<p>The dead walk to the door in a line of painted figures, everyone facing the way they go — right, toward the door. Among them strides a <strong>jackal-headed guide</strong>.</p>
          <svg viewBox="0 0 ${PROCESSION.length * 58 + 40} 80" style="width:100%;height:auto;background:#d2b483;border-radius:6px" xmlns="http://www.w3.org/2000/svg">
            <line x1="10" y1="62" x2="${PROCESSION.length * 58 + 30}" y2="62" stroke="#6b4f22" stroke-width="2"/>
            ${friezeFigures(36, 42, 58)}
            <path d="M${PROCESSION.length * 58 + 14} 42 l14 0 l-6 -6 m6 6 l-6 6" stroke="#2e2210" stroke-width="2" fill="none"/>
          </svg>
          <p style="color:var(--text-dim); font-style:italic; margin-top:8px;">You can count them here at leisure. The caption by the door says which of them to count.</p>`;
        game.journal.add('note_procession', { title: 'The painted procession (Antechamber)', category: 'note', html });
        game.dialog({ title: 'The Procession', wide: true, html });
      } });
    spots.push({ id: 'caption', ...CAPTION, label: 'The caption',
      onInteract(game) {
        game.journal.add('note_ante', { title: 'Antechamber door (the caption)', category: 'note',
          html: '<p>"The jackal leads the dead to the door. Number those who walk behind him — the scarabs, then the blossoms, then the ibis: so speaks the door."</p>' });
        game.say('"Number those who walk behind him." Not every figure, then — only the company that follows the jackal. Copied to your palette.');
      } });
    spots.push({ id: 'rubble', x: 140, y: 260, w: 520, h: 380, label: 'The collapsed entrance',
      onInteract(game) { game.say('Tons of it. You could dig for a week and only run out of air faster. Forward is the only way.'); } });

    if (!open) {
      spots.push({ id: 'door', x: DOOR.x, y: DOOR.y, w: DOOR.w, h: DOOR.h, label: 'Sealed door — three rings',
        onInteract(game) { openDoor(game); } });
    } else {
      if (!(state.journal || []).some(e => e.id === 'amulet_ante')) {
        spots.push({ id: 'amulet', x: NICHE.x - 4, y: NICHE.y - 4, w: NICHE.w + 8, h: NICHE.h + 8, label: 'An amulet in the niche',
          onInteract(game) {
            game.journal.add('amulet_ante', { title: 'Amulet of the Antechamber', category: 'sun', sign: 'scarab', sun: { rays: 2, letter: 'N' } });
            game.say('An amulet of blue faience, a scarab carved on its back: two beads along its edge, and the letter N. The door hid it well.');
            game.refreshScene();
          } });
      }
      spots.push({ id: 'doorway', x: DOOR.x, y: DOOR.y, w: DOOR.w, h: DOOR.h, label: 'The open passage',
        onInteract(game) {
          if (!game.journal.has('amulet_ante')) {
            game.journal.add('amulet_ante', { title: 'Amulet of the Antechamber', category: 'sun', sign: 'scarab', sun: { rays: 2, letter: 'N' } });
            game.say('On your way through you take the amulet from the niche: a scarab on its back, two beads, the letter N. The false door at the end will want it.');
            game.completeRoom({ delay: 3000 });
            return;
          }
          game.completeRoom({ delay: 600 });
        } });
    }
    return spots;
  },

  hints: [
    { text: 'The caption does not ask you to count every figure. Read who it counts — then find him in the procession.', cost: 60 },
    { text: 'The figures walk right, toward the door, so those BEHIND the jackal-headed guide are the ones to his left. Count only those: scarabs, then blossoms, then ibis.', cost: 120 },
    { text: `Behind the jackal: ${ANSWER[0]} scarabs, ${ANSWER[1]} blossoms, ${ANSWER[2]} ibis. Set the rings to ${ANSWER.join(', ')}.`, cost: 240 },
  ],
};

function openDoor(game) {
  const v = [game.getFlag('ante_d1') ?? 0, game.getFlag('ante_d2') ?? 0, game.getFlag('ante_d3') ?? 0];
  game.openPuzzle({
    id: 'ante_door',
    title: 'The Sealed Door',
    render(body, api) {
      body.innerHTML = `
        ${plateHero('art/antechamber.webp', { x: DOOR.x + DOOR.w / 2, y: DOOR.y + DOOR.h / 2 })}
        <p class="puzzle-desc">Three glyph-rings, each numbered 0 through 9.
        <em>"Number those who walk behind the jackal — the scarabs, then the blossoms, then the ibis."</em></p>
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
        if (v[0] === ANSWER[0] && v[1] === ANSWER[1] && v[2] === ANSWER[2]) {
          game.setFlag('ante_doorOpen');
          game.playSfx('stone');
          api.solved({ message: 'The rings seat with three deep clicks. Counterweights fall somewhere in the wall, and the door grinds inward — and beside it, a niche the door itself had been hiding.' });
          game.refreshScene();
        } else if (v[0] === PROCESSION.filter(k => k === 'scarab').length && v[1] === PROCESSION.filter(k => k === 'lotus').length) {
          api.fail('The rings grind and spring back. You counted the whole procession — the door wants only the company behind the guide.');
        } else {
          api.fail('The rings grind and spring back. That is not the count the caption asks for.');
        }
      });
    },
  });
}
