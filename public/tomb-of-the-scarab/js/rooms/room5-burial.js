// ROOM 5 — The Burial Chamber. META + finale.
// The false door asks for the sign of life. Four amulet-hollows are cut into its
// panel, each carved with a sign — ibis, scarab, star, feather — and each of
// your amulets bears the sign of the chamber it came from. Lay them in their
// hollows and the letters read A-N-K-H. (The bead counts, 1-2-3-4, agree: the
// hollows are also cut smallest to largest.) Speak ANKH and come forth by day.

import { kitDefs, panel, shadow, plateHero } from '../../../shared/js/scenekit.js';

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const WORD = 'ANKH';
const HOLLOWS = ['ibis', 'scarab', 'star', 'feather'];   // left to right on the false door

// the four signs, drawn centred at (0,0) in ~a 40px box
function sign(name, ink = '#d4a72a') {
  switch (name) {
    case 'ibis': return `<g fill="none" stroke="${ink}" stroke-width="2.4" stroke-linecap="round"><ellipse cx="-2" cy="4" rx="10" ry="6"/><path d="M7 1 q6 -10 2 -16 q-2 -4 -6 -2"/><path d="M3 -17 q-8 4 -10 14"/><path d="M-4 10 l-2 10 M2 10 l2 10"/></g>`;
    case 'scarab': return `<g fill="none" stroke="${ink}" stroke-width="2.4"><ellipse cx="0" cy="3" rx="9" ry="12"/><line x1="0" y1="-8" x2="0" y2="15"/><circle cx="0" cy="-12" r="4"/><path d="M-9 0 l-7 -4 M9 0 l7 -4 M-9 8 l-7 4 M9 8 l7 4"/></g>`;
    case 'star': return `<g fill="none" stroke="${ink}" stroke-width="2.4" stroke-linecap="round"><path d="M0 -16 L0 16 M-16 0 L16 0 M-11 -11 L11 11 M-11 11 L11 -11"/><circle cx="0" cy="0" r="4" fill="${ink}"/></g>`;
    case 'feather': return `<g fill="none" stroke="${ink}" stroke-width="2.4"><path d="M0 18 Q-10 0 0 -18 Q10 0 0 18 Z"/><line x1="0" y1="-14" x2="0" y2="18"/></g>`;
  }
  return '';
}

// Layout — the plate (art/burial.webp): a carved false door (centre) under a deep
// lintel, painted walls, candelabra. The sarcophagus lies on the floor left.
const FD = { x: 700, y: 320, w: 220, h: 360 };        // the painted false door
const LINTEL = { x: 640, y: 208, w: 340, h: 56 };     // the letter rings on the lintel
const PLAQUE = { x: 1110, y: 240, w: 380, h: 170 };
const SARC = { x: 170, y: 640, w: 400, h: 150 };
const hollowX = (i) => FD.x + 32 + i * 52;
const HOLLOW_Y = FD.y + 56;

export default {
  id: 'burial',
  title: 'The Burial Chamber',
  intro: 'The last chamber, and the greatest. A stone sarcophagus lies open and long empty on the floor; the far wall is a false door, carved for a soul to pass and for nothing else. Four brass letter-rings ring its lintel, four little hollows are cut into its face, and a plaque on the wall waits to be obeyed.',

  scene(state) {
    const d = [0, 1, 2, 3].map(i => state.flags[`burial_d${i}`] ?? 0);
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${kitDefs()}
        <radialGradient id="gd_bu_torch" cx="0.5" cy="0.4" r="0.5">
          <stop offset="0" stop-color="rgba(255,178,77,0.45)"/><stop offset="1" stop-color="rgba(255,178,77,0)"/>
        </radialGradient>
      </defs>
      <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="art/burial.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="art/burial.mp4" type="video/mp4"/></video></foreignObject>
      <ellipse cx="810" cy="400" rx="360" ry="260" fill="url(#gd_bu_torch)" class="glow"/>

      <!-- the four brass letter-rings, set into the painted lintel -->
      ${panel({ ...LINTEL, material: 'iron', mount: 'bolts', rx: 6, body: `
        <g font-family="var(--serif, Georgia, serif)" font-size="28" fill="#f2d774" text-anchor="middle">
          ${d.map((v, i) => `<circle cx="${hollowX(i) + 8}" cy="${LINTEL.y + LINTEL.h / 2}" r="21" fill="#241a10" stroke="#8a6a15" stroke-width="2"/>
            <text x="${hollowX(i) + 8}" y="${LINTEL.y + LINTEL.h / 2 + 10}">${ALPHA[v]}</text>`).join('')}
        </g>` })}

      <!-- four amulet-hollows cut into the false door's face, each carved with its sign, smallest first -->
      <g data-mount="inset">
        ${HOLLOWS.map((s, i) => {
          const x = hollowX(i) + 8, ry = 20 + i * 3;
          return `<ellipse cx="${x}" cy="${HOLLOW_Y}" rx="${ry * 0.78}" ry="${ry}" fill="#0a0703" stroke="#8a6a15" stroke-width="2"/>
            <g transform="translate(${x} ${HOLLOW_Y + ry + 26}) scale(0.8)">${sign(s, '#d4a72a')}</g>`;
        }).join('')}
      </g>

      <!-- the plaque, cut into the painted right wall -->
      ${panel({ ...PLAQUE, material: 'sandstone', mount: 'inset', rx: 4, body: `
        <g font-family="var(--serif, Georgia, serif)" fill="#2e2210" font-style="italic">
          <text x="${PLAQUE.x + 18}" y="${PLAQUE.y + 36}" font-size="19">"Speak the sign of life, and the door</text>
          <text x="${PLAQUE.x + 18}" y="${PLAQUE.y + 64}" font-size="19">will remember it is a door.</text>
          <text x="${PLAQUE.x + 18}" y="${PLAQUE.y + 104}" font-size="17" fill="#5c3a08">Let each charm lie in the hollow</text>
          <text x="${PLAQUE.x + 18}" y="${PLAQUE.y + 130}" font-size="17" fill="#5c3a08">that bears its sign, and read."</text>
        </g>` })}

      <!-- the sarcophagus, lying open on the floor -->
      <g data-mount="floor">
        ${shadow(SARC.x + SARC.w / 2, SARC.y + SARC.h + 6, SARC.w * 0.6, 16)}
        <rect x="${SARC.x}" y="${SARC.y}" width="${SARC.w}" height="${SARC.h}" rx="20" fill="url(#sk_basalt)" stroke="#8a6a15" stroke-width="4"/>
        <rect x="${SARC.x + 24}" y="${SARC.y + 20}" width="${SARC.w - 48}" height="${SARC.h - 50}" rx="14" fill="#0a0703"/>
        <path d="M${SARC.x + SARC.w + 8} ${SARC.y - 30} L${SARC.x + SARC.w + 60} ${SARC.y + SARC.h} L${SARC.x + SARC.w + 30} ${SARC.y + SARC.h + 6} L${SARC.x + SARC.w - 16} ${SARC.y - 22} Z" fill="url(#sk_basalt)" stroke="#8a6a15" stroke-width="3"/>
      </g>

      <path d="M0 900 L0 856 Q800 894 1600 856 L1600 900 Z" fill="#050301"/>
    </svg>`;
  },

  hotspots() {
    return [
      { id: 'sarcophagus', x: SARC.x, y: SARC.y - 30, w: SARC.w + 70, h: SARC.h + 40, label: 'The sarcophagus',
        onInteract(game) { game.say('Empty — robbed centuries ago, or never filled. Either way, the way out was never meant to be up through the lid, but through the false door in the wall.'); } },
      { id: 'plaque', ...PLAQUE, label: 'The plaque',
        onInteract(game) {
          game.journal.add('note_falsedoor', { title: 'The false door (the plaque)', category: 'note',
            html: '<p>"Speak the sign of life, and the door will remember it is a door. Let each charm lie in the hollow that bears its sign, and read."</p><p>The hollows on the false door, left to right: <strong>ibis · scarab · star · feather</strong>.</p>' });
          game.dialog({ title: 'The Plaque', html: '<div class="parchment-note aged"><p>"Speak the sign of life, and the door will remember it is a door.<br><strong>Let each charm lie in the hollow that bears its sign, and read.</strong>"</p></div><p style="margin-top:12px;color:var(--text-dim);font-style:italic;">Four hollows on the false door, each carved with a sign. Each of your amulets bears the sign of the chamber that kept it.</p>' });
        } },
      { id: 'door', x: LINTEL.x, y: LINTEL.y, w: LINTEL.w, h: FD.y + FD.h - LINTEL.y, label: 'The false door — hollows and rings',
        onInteract(game) { openDoor(game); } },
    ];
  },

  hints: [
    { text: 'The false door wants the "sign of life" spoken. Its four hollows each bear a sign — and so does each of your amulets.', cost: 60 },
    { text: 'Ibis: the Scribe\'s amulet. Scarab: the Antechamber\'s. Star: the Star Chamber\'s. Feather: the Hall of the Scales\'. Read their letters in the hollows\' order, left to right.', cost: 120 },
    { text: 'A (ibis), N (scarab), K (star), H (feather): ANKH. The beads agree — one, two, three, four.', cost: 240 },
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
        ${plateHero('art/burial.webp', { x: FD.x + FD.w / 2, y: FD.y + FD.h / 2 })}
        <p class="puzzle-desc">Four hollows, each carved with a sign, and beneath each a brass letter-ring. <em>"Let each charm lie in the hollow that bears its sign, and read."</em>
        ${amulets.length < 4
          ? `<br><strong style="color:var(--danger);">Your palette holds only ${amulets.length} of the four amulets.</strong> Each chamber kept one.`
          : 'Your palette holds all four amulets.'}</p>
        <div class="puzzle-row" style="gap:22px;">
          ${HOLLOWS.map(s => `<svg viewBox="-30 -30 60 60" width="60" height="60" xmlns="http://www.w3.org/2000/svg"><circle r="26" fill="#160f05" stroke="#8a6a15" stroke-width="2"/>${sign(s)}</svg>`).join('')}
        </div>
        <div class="puzzle-row" id="bu-dials"></div>
        <div class="puzzle-row"><button class="btn btn-primary" id="bu-try">Speak the Sign</button></div>
        <div class="puzzle-feedback"></div>
        <p style="text-align:center; margin-top:10px; font-size:13.5px; color:var(--text-dim);">
          ${amulets.map(e => `${e.sign || '?'} &rarr; <strong>${e.sun.letter}</strong>`).join(' &middot; ') || 'Open your <strong>Journal</strong> to see each amulet\'s sign and letter.'}</p>`;
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
          api.fail('The rings sit dead in the stone. Lay each amulet in the hollow that bears its sign, and read again.');
        }
      });
    },
  });
}
