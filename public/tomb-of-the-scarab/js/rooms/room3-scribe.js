// ROOM 3 — The Scribe's Chamber. A hieroglyph cipher.
// The wall gives a glyph->letter key; the cartouche cabinet shows four glyphs
// (owl, reed, reed, loaf) that spell M-A-A-T, the goddess of truth.
// Reward: amulet (A, 1 bead).

const ANSWER = 'MAAT';

// stylised glyphs, each drawn centred at (0,0) in ~a 44px box
function glyph(name) {
  switch (name) {
    case 'owl': return `<g fill="#d4a72a"><ellipse cx="0" cy="4" rx="13" ry="17"/><circle cx="-6" cy="-6" r="6" fill="#1c1206"/><circle cx="6" cy="-6" r="6" fill="#1c1206"/><circle cx="-6" cy="-6" r="2.5" fill="#d4a72a"/><circle cx="6" cy="-6" r="2.5" fill="#d4a72a"/><path d="M-2 0 l2 5 l2 -5z" fill="#1c1206"/></g>`;
    case 'reed': return `<g stroke="#d4a72a" stroke-width="3" fill="none" stroke-linecap="round"><line x1="0" y1="20" x2="0" y2="-14"/><path d="M0 -14 q10 2 12 -8"/></g>`;
    case 'loaf': return `<path d="M-15 12 a15 15 0 0 1 30 0 z" fill="#d4a72a"/>`;
    case 'water': return `<path d="M-16 0 q4 -8 8 0 t8 0 t8 0 t8 0" stroke="#5aa0d0" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    case 'mouth': return `<ellipse cx="0" cy="0" rx="16" ry="6" fill="none" stroke="#d4a72a" stroke-width="3"/>`;
    case 'chick': return `<g fill="#efe0b8" stroke="#a08a63" stroke-width="1"><ellipse cx="-2" cy="4" rx="10" ry="8"/><circle cx="8" cy="-6" r="5"/><line x1="-6" y1="12" x2="-6" y2="20" stroke="#a08a63" stroke-width="2"/><line x1="2" y1="12" x2="2" y2="20" stroke="#a08a63" stroke-width="2"/></g>`;
  }
  return '';
}
const KEY = [['owl', 'M'], ['reed', 'A'], ['loaf', 'T'], ['water', 'N'], ['mouth', 'R'], ['chick', 'W']];
const CARTOUCHE = ['owl', 'reed', 'reed', 'loaf'];

function open(state) { return !!state.flags.scribe_open; }

export default {
  id: 'scribe',
  title: "The Scribe's Chamber",
  intro: 'A low chamber lined with shelves of rotted papyrus. One wall is a scribe\'s teaching-board: a key of glyphs and their sounds. Set into the far wall is a sealed cabinet, and on its face, ringed in a royal cartouche, four signs wait to be read aloud.',

  scene(state) {
    const done = open(state);
    const amuletHere = done && !state.journal?.some?.(e => e.id === 'amulet_scribe');
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gd_sb_wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#2a1c0a"/><stop offset="1" stop-color="#1a1206"/>
        </linearGradient>
        <radialGradient id="gd_sb_torch" cx="0.5" cy="0.4" r="0.5">
          <stop offset="0" stop-color="rgba(255,178,77,0.4)"/><stop offset="1" stop-color="rgba(255,178,77,0)"/>
        </radialGradient>
      </defs>
      <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="art/scribe.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="art/scribe.mp4" type="video/mp4"/></video></foreignObject>
      <ellipse cx="500" cy="140" rx="320" ry="180" fill="url(#gd_sb_torch)" class="glow"/>

      <!-- the KEY board (centre-left) -->
      <g transform="translate(360 300)">
        <rect x="-40" y="-40" width="520" height="330" rx="10" fill="#20160a" stroke="#4a3520" stroke-width="3"/>
        <text x="220" y="-8" text-anchor="middle" font-size="20" fill="#a08a63" font-family="var(--serif, Georgia, serif)">The scribe's key</text>
        ${KEY.map(([g, l], i) => { const col = i % 3, rowi = Math.floor(i / 3); const x = 60 + col * 150, y = 60 + rowi * 130; return `<g transform="translate(${x} ${y})">${glyph(g)}<text x="42" y="8" font-size="26" fill="#f2d774" font-family="var(--serif, Georgia, serif)">${l}</text></g>`; }).join('')}
      </g>

      <!-- the cartouche cabinet (right) -->
      <g transform="translate(1120 300)">
        <rect x="-40" y="-40" width="380" height="440" rx="12" fill="${done ? '#0a0703' : '#2a1c0a'}" stroke="#d4a72a" stroke-width="4"/>
        <!-- cartouche ring -->
        <rect x="-10" y="20" width="320" height="90" rx="45" fill="#160f05" stroke="#d4a72a" stroke-width="3"/>
        <line x1="-10" y1="65" x2="-30" y2="65" stroke="#d4a72a" stroke-width="6"/>
        <g>${CARTOUCHE.map((g, i) => `<g transform="translate(${50 + i * 68} 65)">${glyph(g)}</g>`).join('')}</g>
        ${done
          ? `<text x="150" y="300" text-anchor="middle" font-size="22" fill="#5aa0d0" font-style="italic" font-family="var(--serif, Georgia, serif)">the cabinet stands open</text>`
          : `<text x="150" y="180" text-anchor="middle" font-size="16" fill="#a08a63" font-family="var(--serif, Georgia, serif)">speak the name within</text>`}
      </g>

      <!-- inscription -->
      <g font-family="var(--serif, Georgia, serif)" fill="#efe0b8">
        <text x="120" y="660" font-size="22" font-style="italic">"Read the name of the goddess of truth,</text>
        <text x="120" y="690" font-size="22" font-style="italic">and speak it to the cabinet."</text>
      </g>

      ${amuletHere ? `<g class="beckon" transform="translate(1270 640)">
        <ellipse cx="0" cy="0" rx="22" ry="28" fill="#2f6fb0" stroke="#f2d774" stroke-width="3"/><line x1="0" y1="-26" x2="0" y2="26" stroke="#f2d774" stroke-width="2"/><circle cx="0" cy="-32" r="9" fill="#f2d774"/>
      </g>` : ''}

      <path d="M0 900 L0 860 Q800 892 1600 860 L1600 900 Z" fill="#050301"/>
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const done = open(state);
    spots.push({ id: 'key', x: 320, y: 260, w: 520, h: 330, label: "The scribe's key",
      onInteract(game) {
        game.journal.add('note_key', { title: "The scribe's key (glyph sounds)", category: 'note',
          html: '<p>owl = <strong>M</strong>, reed = <strong>A</strong>, loaf = <strong>T</strong>, water = N, mouth = R, chick = W.</p>' });
        game.say('A teaching-board: owl says M, the reed says A, the loaf says T, water N, mouth R, chick W. Copied to your palette.');
      } });
    spots.push({ id: 'inscription', x: 110, y: 630, w: 640, h: 80, label: 'The inscription',
      onInteract(game) { game.say('"Read the name of the goddess of truth, and speak it to the cabinet." You have already met her, one hall back, holding out a feather.'); } });

    if (!done) {
      spots.push({ id: 'cabinet', x: 1080, y: 260, w: 380, h: 440, label: 'The cartouche cabinet',
        onInteract(game) { openCabinet(game); } });
    } else {
      if (!(state.journal || []).some(e => e.id === 'amulet_scribe')) {
        spots.push({ id: 'amulet', x: 1210, y: 600, w: 120, h: 120, label: 'An amulet within',
          onInteract(game) {
            game.journal.add('amulet_scribe', { title: 'Amulet of the Scribe', category: 'sun', sun: { rays: 1, letter: 'A' } });
            game.say('Inside the cabinet, on a bed of linen: an amulet with a single bead, and the letter A.');
            game.refreshScene();
          } });
      }
      spots.push({ id: 'exit', x: 60, y: 300, w: 200, h: 420, label: 'The passage on',
        onInteract(game) {
          if (!game.journal.has('amulet_scribe')) { game.say('The cabinet is open — take the amulet inside before you leave.'); return; }
          game.completeRoom({ delay: 600 });
        } });
    }
    return spots;
  },

  hints: [
    { text: 'The cabinet\'s cartouche is a word written in glyphs. The key on the other wall tells you each glyph\'s letter.', cost: 60 },
    { text: 'Read the four glyphs left to right with the key: owl, reed, reed, loaf. That spells the goddess of truth.', cost: 120 },
    { text: 'The name is MAAT. Type MAAT into the cabinet.', cost: 240 },
  ],
};

function openCabinet(game) {
  game.openPuzzle({
    id: 'scribe_cabinet',
    title: 'The Cartouche Cabinet',
    render(body, api) {
      body.innerHTML = `
        <p class="puzzle-desc">Four glyphs ringed in a cartouche. Read them with the scribe's key and speak the name.</p>
        <div class="puzzle-row" style="gap:6px;">
          <svg viewBox="0 0 300 70" width="300" height="70" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="6" width="296" height="58" rx="29" fill="#160f05" stroke="#d4a72a" stroke-width="2"/>
            ${CARTOUCHE.map((g, i) => `<g transform="translate(${52 + i * 62} 35)">${glyph(g)}</g>`).join('')}
          </svg>
        </div>
        <p style="text-align:center; font-size:13px; color:var(--text-dim);">key: owl=M &middot; reed=A &middot; loaf=T &middot; water=N &middot; mouth=R &middot; chick=W</p>
        <div class="puzzle-row">
          <input class="puzzle-input" id="sb-word" maxlength="6" placeholder="the name" autocomplete="off" style="text-transform:uppercase; text-align:center; letter-spacing:6px; width:200px;"/>
        </div>
        <div class="puzzle-row"><button class="btn btn-primary" id="sb-try">Speak It</button></div>
        <div class="puzzle-feedback"></div>`;
      const input = body.querySelector('#sb-word');
      const submit = () => {
        if ((input.value || '').trim().toUpperCase() === ANSWER) {
          game.setFlag('scribe_open');
          game.playSfx('unlock');
          api.solved({ message: 'You speak the name — MAAT — and the cabinet answers with a soft grind of stone, its face swinging wide.' });
          game.refreshScene();
        } else {
          api.fail('The cabinet stays shut. That is not the name the glyphs spell.');
        }
      };
      body.querySelector('#sb-try').addEventListener('click', submit);
      input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
      setTimeout(() => input.focus(), 60);
    },
  });
}
