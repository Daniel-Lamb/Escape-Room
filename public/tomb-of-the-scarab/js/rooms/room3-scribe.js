// ROOM 3 — The Scribe's Chamber. A hieroglyph cipher with a reading rule.
// The teaching-board gives a glyph->letter key and the scribes' first lesson:
// signs look toward the START of their line. The cabinet's cartouche shows, left
// to right, loaf · reed · reed · owl — and the owl faces RIGHT, so the name
// begins at the right-hand end: owl, reed, reed, loaf = M-A-A-T, the goddess of
// truth (whose scale you balanced one hall back). Read naively it is "TAAM".
// Reward: amulet (ibis sign, A, 1 bead).

import { kitDefs, panel, shadow, plateHero } from '../../../shared/js/scenekit.js';

const ANSWER = 'MAAT';

// stylised glyphs, each drawn centred at (0,0) in ~a 44px box. `facing` flips
// the creatures: the key draws them facing left (a left-to-right line); the
// cartouche draws its owl facing right.
function glyph(name, facing = 'left') {
  const flip = facing === 'right' ? ' transform="scale(-1 1)"' : '';
  switch (name) {
    case 'owl': return `<g fill="#d4a72a"${flip}>
      <ellipse cx="2" cy="6" rx="12" ry="16"/><path d="M8 12 l8 12 l-10 -4 z"/>
      <circle cx="-4" cy="-12" r="9"/><circle cx="-6" cy="-13" r="3.4" fill="#1c1206"/>
      <path d="M-13 -11 l-6 3 l6 1 z" fill="#1c1206"/></g>`;
    case 'reed': return `<g stroke="#d4a72a" stroke-width="3" fill="none" stroke-linecap="round"${flip}><line x1="0" y1="20" x2="0" y2="-14"/><path d="M0 -14 q-10 2 -12 -8"/></g>`;
    case 'loaf': return `<path d="M-15 12 a15 15 0 0 1 30 0 z" fill="#d4a72a"/>`;
    case 'water': return `<path d="M-16 0 q4 -8 8 0 t8 0 t8 0 t8 0" stroke="#5aa0d0" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    case 'mouth': return `<ellipse cx="0" cy="0" rx="16" ry="6" fill="none" stroke="#d4a72a" stroke-width="3"/>`;
    case 'chick': return `<g fill="#efe0b8" stroke="#a08a63" stroke-width="1"${flip}><ellipse cx="2" cy="4" rx="10" ry="8"/><circle cx="-8" cy="-6" r="5"/><path d="M-13 -6 l-5 2 l5 1 z" fill="#a08a63"/><line x1="6" y1="12" x2="6" y2="20" stroke="#a08a63" stroke-width="2"/><line x1="-2" y1="12" x2="-2" y2="20" stroke="#a08a63" stroke-width="2"/></g>`;
  }
  return '';
}
const KEY = [['owl', 'M'], ['reed', 'A'], ['loaf', 'T'], ['water', 'N'], ['mouth', 'R'], ['chick', 'W']];
// the cartouche, left to right as carved; the owl looks right
const CARTOUCHE = [['loaf', 'left'], ['reed', 'right'], ['reed', 'right'], ['owl', 'right']];

function open(state) { return !!state.flags.scribe_open; }

// Layout — the plate (art/scribe.webp): scroll shelves down both walls, a plain
// back wall. The teaching-board hangs on the back wall; the cabinet stands on
// the floor before it; a low doorway opens at the back wall's right end.
const BOARD = { x: 590, y: 140, w: 420, h: 290 };
const LINE = { x: 590, y: 448, w: 470, h: 40 };
const CAB = { x: 660, y: 520, w: 300, h: 250 };
const EXIT = { x: 1060, y: 300, w: 120, h: 262 };

export default {
  id: 'scribe',
  title: "The Scribe's Chamber",
  intro: 'A low chamber lined with shelves of rotted papyrus. On the back wall hangs a scribe\'s teaching-board — a key of glyphs and their sounds, and the first lesson every pupil learned. Before it stands a sealed cabinet, and on its face, ringed in a royal cartouche, four signs wait to be read aloud.',
  lintStates: [{ label: 'open', flags: { scribe_open: true } }],

  scene(state) {
    const done = open(state);
    const amuletHere = done && !state.journal?.some?.(e => e.id === 'amulet_scribe');
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${kitDefs()}
        <radialGradient id="gd_sb_torch" cx="0.5" cy="0.4" r="0.5">
          <stop offset="0" stop-color="rgba(255,178,77,0.4)"/><stop offset="1" stop-color="rgba(255,178,77,0)"/>
        </radialGradient>
      </defs>
      <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="art/scribe.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="art/scribe.mp4" type="video/mp4"/></video></foreignObject>
      <ellipse cx="800" cy="300" rx="420" ry="260" fill="url(#gd_sb_torch)" class="glow"/>

      <!-- the teaching-board, hung on the back wall -->
      ${panel({ ...BOARD, material: 'darkwood', mount: 'chains', anchorY: 40, body: `
        <text x="${BOARD.x + BOARD.w / 2}" y="${BOARD.y + 32}" text-anchor="middle" font-size="18" fill="#e8d6a8" font-family="var(--serif, Georgia, serif)">The scribe's key</text>
        <text x="${BOARD.x + BOARD.w / 2}" y="${BOARD.y + 56}" text-anchor="middle" font-size="13.5" fill="#d4a72a" font-style="italic" font-family="var(--serif, Georgia, serif)">"The signs look toward where the line begins."</text>
        ${KEY.map(([g, l], i) => { const col = i % 3, rowi = Math.floor(i / 3); const x = BOARD.x + 70 + col * 130, y = BOARD.y + 118 + rowi * 104; return `<g transform="translate(${x} ${y})">${glyph(g, 'left')}<text x="34" y="9" font-size="24" fill="#f2d774" font-family="var(--serif, Georgia, serif)">${l}</text></g>`; }).join('')}
        <path d="M${BOARD.x + 34} ${BOARD.y + BOARD.h - 22} l26 0 m-26 0 l8 -6 m-8 6 l8 6" stroke="#d4a72a" stroke-width="2" fill="none"/>
        <text x="${BOARD.x + 70}" y="${BOARD.y + BOARD.h - 17}" font-size="12" fill="#c9b98f" font-family="var(--serif, Georgia, serif)">this line: the signs face left, so it reads left to right</text>` })}

      <!-- the charge, painted on the wall between the board and the cabinet -->
      <g data-mount="inset" font-family="var(--serif, Georgia, serif)" font-style="italic">
        <text x="${LINE.x + 2}" y="${LINE.y + 27}" font-size="17" fill="#0a0703" opacity="0.7">"Read the name of the goddess of truth, and speak it to the cabinet."</text>
        <text x="${LINE.x}" y="${LINE.y + 25}" font-size="17" fill="#efe0b8" opacity="0.85">"Read the name of the goddess of truth, and speak it to the cabinet."</text>
      </g>

      <!-- the cartouche cabinet, standing on the floor -->
      <g data-mount="floor">
        ${shadow(CAB.x + CAB.w / 2, CAB.y + CAB.h, CAB.w * 0.6, 14)}
        <rect x="${CAB.x}" y="${CAB.y}" width="${CAB.w}" height="${CAB.h}" rx="8" fill="${done ? '#0a0703' : 'url(#sk_darkwood)'}" stroke="#d4a72a" stroke-width="4"/>
        ${done ? `<path d="M${CAB.x} ${CAB.y} L${CAB.x - 70} ${CAB.y + 14} L${CAB.x - 70} ${CAB.y + CAB.h + 10} L${CAB.x} ${CAB.y + CAB.h}" fill="url(#sk_darkwood)" stroke="#d4a72a" stroke-width="3"/>` : ''}
        <rect x="${CAB.x + 22}" y="${CAB.y + 34}" width="${CAB.w - 44}" height="80" rx="40" fill="#160f05" stroke="#d4a72a" stroke-width="3"/>
        <line x1="${CAB.x + CAB.w - 22}" y1="${CAB.y + 54}" x2="${CAB.x + CAB.w - 22}" y2="${CAB.y + 94}" stroke="#d4a72a" stroke-width="6"/>
        ${CARTOUCHE.map(([g, f], i) => `<g transform="translate(${CAB.x + 64 + i * 56} ${CAB.y + 74})">${glyph(g, f)}</g>`).join('')}
        ${done
          ? `<text x="${CAB.x + CAB.w / 2}" y="${CAB.y + 200}" text-anchor="middle" font-size="18" fill="#5aa0d0" font-style="italic" font-family="var(--serif, Georgia, serif)">the cabinet stands open</text>`
          : `<text x="${CAB.x + CAB.w / 2}" y="${CAB.y + 160}" text-anchor="middle" font-size="15" fill="#e8d6a8" font-family="var(--serif, Georgia, serif)">speak the name within</text>`}
        ${amuletHere ? `<g class="beckon" transform="translate(${CAB.x + CAB.w / 2} ${CAB.y + 150})">
          <ellipse cx="0" cy="0" rx="20" ry="26" fill="#2f6fb0" stroke="#f2d774" stroke-width="3"/><circle cx="0" cy="-30" r="8" fill="#f2d774"/></g>` : ''}
      </g>

      <!-- the low doorway at the back wall's right end: sealed by a stone slab until the name is spoken -->
      <g data-mount="wall">
        <rect x="${EXIT.x}" y="${EXIT.y}" width="${EXIT.w}" height="${EXIT.h}" rx="4" fill="${done ? '#050301' : 'url(#sk_sandstone)'}" stroke="#2e2210" stroke-width="4"/>
        ${shadow(EXIT.x + EXIT.w / 2, EXIT.y + EXIT.h, EXIT.w * 0.6, 8)}
      </g>

      <path d="M0 900 L0 860 Q800 892 1600 860 L1600 900 Z" fill="#050301"/>
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const done = open(state);
    spots.push({ id: 'key', ...BOARD, label: "The scribe's key",
      onInteract(game) {
        game.journal.add('note_key', { title: "The scribe's key (glyph sounds)", category: 'note',
          html: `<p>owl = <strong>M</strong>, reed = <strong>A</strong>, loaf = <strong>T</strong>, water = N, mouth = R, chick = W.</p>
            <p><strong>The first lesson:</strong> "The signs look toward where the line begins." On the board every bird faces left, so its lines read left to right.</p>` });
        game.say('A teaching-board: owl M, reed A, loaf T, water N, mouth R, chick W — and above them, the first lesson: the signs look toward where the line begins. Copied to your palette.');
      } });
    spots.push({ id: 'inscription', x: LINE.x, y: LINE.y - 12, w: LINE.w, h: 62, label: 'The painted charge',
      onInteract(game) { game.say('"Read the name of the goddess of truth, and speak it to the cabinet." You have already met her, one hall back, holding out a feather.'); } });

    if (!done) {
      spots.push({ id: 'cabinet', ...CAB, label: 'The cartouche cabinet',
        onInteract(game) { openCabinet(game); } });
      spots.push({ id: 'slab', ...EXIT, label: 'A sealed doorway',
        onInteract(game) { game.say('A stone slab fills the low doorway, its edges sealed with plaster that has never been broken. Something in this room is the key to it.'); } });
    } else {
      if (!(state.journal || []).some(e => e.id === 'amulet_scribe')) {
        spots.push({ id: 'amulet', x: CAB.x + CAB.w / 2 - 60, y: CAB.y + 100, w: 120, h: 110, label: 'An amulet within',
          onInteract(game) {
            game.journal.add('amulet_scribe', { title: 'Amulet of the Scribe', category: 'sun', sign: 'ibis', sun: { rays: 1, letter: 'A' } });
            game.say('Inside the cabinet, on a bed of linen: an amulet with Thoth\'s ibis on its back, a single bead, and the letter A.');
            game.refreshScene();
          } });
      }
      spots.push({ id: 'exit', ...EXIT, label: 'The passage on',
        onInteract(game) {
          if (!game.journal.has('amulet_scribe')) {
            game.journal.add('amulet_scribe', { title: 'Amulet of the Scribe', category: 'sun', sign: 'ibis', sun: { rays: 1, letter: 'A' } });
            game.say('You take the amulet from the open cabinet as you pass: the ibis on its back, one bead, the letter A.');
            game.completeRoom({ delay: 3000 });
            return;
          }
          game.completeRoom({ delay: 600 });
        } });
    }
    return spots;
  },

  hints: [
    { text: 'Read the four signs with the key — but look at which way the owl in the cartouche is facing, and remember the board\'s first lesson.', cost: 60 },
    { text: 'Signs face the start of their line. On the board they face left, so it reads left to right; in the cartouche the owl faces right, so the name starts at the right-hand end.', cost: 120 },
    { text: 'Right to left: owl, reed, reed, loaf — M, A, A, T. Speak MAAT.', cost: 240 },
  ],
};

function openCabinet(game) {
  game.openPuzzle({
    id: 'scribe_cabinet',
    title: 'The Cartouche Cabinet',
    render(body, api) {
      body.innerHTML = `
        ${plateHero('art/scribe.webp', { x: CAB.x + CAB.w / 2, y: CAB.y + CAB.h / 2 })}
        <p class="puzzle-desc">Four signs ringed in a cartouche, carved left to right as you see them. Read them with the scribe's key — and his first lesson — and speak the name.</p>
        <div class="puzzle-row" style="gap:6px;">
          <svg viewBox="0 0 300 70" width="300" height="70" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="6" width="296" height="58" rx="29" fill="#160f05" stroke="#d4a72a" stroke-width="2"/>
            ${CARTOUCHE.map(([g, f], i) => `<g transform="translate(${52 + i * 62} 35)">${glyph(g, f)}</g>`).join('')}
          </svg>
        </div>
        <p style="text-align:center; font-size:13px; color:var(--text-dim);">key: owl=M &middot; reed=A &middot; loaf=T &middot; water=N &middot; mouth=R &middot; chick=W<br>
          <em>"The signs look toward where the line begins."</em></p>
        <div class="puzzle-row">
          <input class="puzzle-input" id="sb-word" maxlength="6" placeholder="the name" autocomplete="off" style="text-transform:uppercase; text-align:center; letter-spacing:6px; width:200px;"/>
        </div>
        <div class="puzzle-row"><button class="btn btn-primary" id="sb-try">Speak It</button></div>
        <div class="puzzle-feedback"></div>`;
      const input = body.querySelector('#sb-word');
      const submit = () => {
        const said = (input.value || '').trim().toUpperCase();
        if (said === ANSWER) {
          game.setFlag('scribe_open');
          game.playSfx('unlock');
          api.solved({ message: 'You speak the name — MAAT — and the cabinet answers with a soft grind of stone, its face swinging wide. Across the room, the plaster round the doorway slab cracks.' });
          game.refreshScene();
        } else if (said === 'TAAM') {
          api.fail('You read it left to right. Look at the owl — which way is it facing?');
        } else {
          api.fail('The cabinet stays shut. That is not the name the signs spell.');
        }
      };
      body.querySelector('#sb-try').addEventListener('click', submit);
      input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
      setTimeout(() => input.focus(), 60);
    },
  });
}
