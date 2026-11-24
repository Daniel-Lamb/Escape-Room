// SCENE 3 — The Nursery (alignment through the mirror).
// The OTHER side's card shows your four figures as they stand in THEIR nursery —
// and their nursery is your mirror image, so the card reads right-to-left for
// you. The plate on your own music box says so. Reverse what you are read.
//   Waking figures: Owl, Hare, Wren, Fox     Glass figures: Wren, Owl, Fox, Hare
// Waking (P1) finds mirror-shard V (3).

import { getRole, isWaking, sideName, otherSideName } from '../role.js';
import { defs, backdrop, sideTag, sconce, tint } from '../glasskit.js';
import { dock, DOCK, shadow } from '../../../shared/js/scenekit.js';

const SLUG = 'nursery';
const ANIMALS = ['Owl', 'Fox', 'Hare', 'Wren'];
const TARGET = { p1: [0, 2, 3, 1], p2: [3, 0, 1, 2] };   // this side's own correct figures
// shown here = the partner's figures as they stand in THIS (mirrored) room: reversed
function cardFor(role) { return [...(role === 'p1' ? TARGET.p2 : TARGET.p1)].reverse(); }

function done(state) { return !!state.flags.nursery_done; }

export default {
  id: 'nursery',
  solution: role => TARGET[role].map(i => ANIMALS[i]),
  lintStates: [{ label: 'solved', flags: { nursery_done: true } }],
  get title() { return `${sideName()} · The Nursery`; },
  get intro() {
    return 'A child\'s nursery, dust on the rocking-horse, a music box with four little carved figures that turn. It will play — and unlock the toy-cupboard passage — only when the figures face the right way. That order is painted on the card in the other room, not this one.';
  },

  scene(state) {
    const t = tint();
    const fin = done(state);
    const markHere = isWaking() && !state.journal.some(e => e.id === 'shard_v');
    const card = cardFor(getRole());
    const f = [state.flags.nursery_f0 ?? 0, state.flags.nursery_f1 ?? 0, state.flags.nursery_f2 ?? 0, state.flags.nursery_f3 ?? 0];

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}</defs>
      ${backdrop(SLUG)}
      ${sconce(SLUG, 160, 392, 'stand')}

      <!-- the music box + four figures, on its little table, with its plate -->
      <g data-mount="table">
        ${shadow(800, 770, 280, 16)}
        ${[600, 1000].map(x => `<rect x="${x - 8}" y="680" width="16" height="90" rx="3" fill="${t.wall1}" stroke="${t.accentDim}" stroke-width="2"/>`).join('')}
        <rect x="560" y="560" width="480" height="120" rx="12" fill="${t.panel}" stroke="${t.accentDim}" stroke-width="5"/>
        <rect x="660" y="686" width="280" height="30" rx="4" fill="url(#sk_brass)" stroke="#4f3b10" stroke-width="1.5"/>
        <text x="800" y="706" text-anchor="middle" font-size="12.5" fill="#2a1d05" font-family="Georgia, serif" font-style="italic">"what stands at your left stands at the glass's right"</text>
        ${f.map((v, i) => `
          <g transform="translate(${640 + i * 110} 560)">
            <circle r="42" fill="${fin ? 'rgba(255,207,138,0.10)' : '#1a1626'}" stroke="${t.accentDim}" stroke-width="3"/>
            <text y="7" text-anchor="middle" font-size="16" fill="${t.accent}" font-family="Georgia, serif">${ANIMALS[v]}</text>
            <text y="66" text-anchor="middle" font-size="12" fill="#9fa8bd" font-family="Consolas, monospace">${i + 1}</text>
          </g>`).join('')}
      </g>

      <!-- the partner's card (as their figures stand in THIS room) — in your pocket-book -->
      ${dock({ x: 1120, y: 170, w: 380, h: 230 }, `
        <text x="1310" y="212" text-anchor="middle" font-size="15" fill="#4a3a22" font-family="Georgia, serif" letter-spacing="1">${otherSideName().toUpperCase()} — AS THEY STAND HERE</text>
        ${card.map((v, i) => `
          <g transform="translate(${1180 + i * 84} 300)">
            <circle r="32" fill="#efe6cf" stroke="#6b5a3a" stroke-width="2.5"/>
            <text y="6" text-anchor="middle" font-size="14" fill="#26221a" font-family="Georgia, serif">${ANIMALS[v]}</text>
            <text y="52" text-anchor="middle" font-size="12" fill="#6b5a3a" font-family="Consolas, monospace">${i + 1}</text>
          </g>`).join('')}
        <text x="1310" y="384" text-anchor="middle" font-size="12" fill="#6b5a3a" font-family="Consolas, monospace">read these four to your partner, 1 to 4</text>`, { kind: 'notebook', title: 'POCKET-BOOK' })}

      ${markHere ? `
      <g class="beckon">
        <polygon points="1030,700 1075,692 1082,736 1060,770 1028,760 1020,724" fill="rgba(201,204,214,0.10)" stroke="#c9ccd6" stroke-width="2.5"/>
        <text x="1050" y="736" text-anchor="middle" font-size="18" fill="#dfe6f2" font-family="Consolas, monospace" font-weight="bold">3</text>
      </g>` : ''}

      ${sideTag()}
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const role = getRole();

    spots.push({
      id: 'card', ...DOCK, label: `${otherSideName()}'s figures, as they stand here`,
      onInteract(game) {
        const card = cardFor(role);
        const html = `<div class="cipher"><div class="cipher-title">${otherSideName()} — music-box card</div>
          <p style="text-align:center;font-size:20px;color:#f2ecdb;">${card.map(v => ANIMALS[v]).join(' &nbsp; ')}</p></div>
          <div class="relay">These are your <strong>partner's</strong> four figures as they stand in <em>this</em> room — but this room is their mirror. Read them across, 1 to 4; their music-box plate tells them what to do with it.</div>`;
        game.journal.add('note_boxcard', { title: `${otherSideName()} music-box card`, category: 'note', html });
        game.dialog({ title: 'The Music-Box Card', html });
      },
    });

    if (role === 'p1' && !state.journal.some(e => e.id === 'shard_v')) {
      spots.push({
        id: 'shard_v', x: 1010, y: 680, w: 90, h: 110, label: 'A mirror-shard',
        onInteract(game) {
          game.journal.add('shard_v', { title: 'Nursery — in the toy chest', category: 'sun', sun: { rays: 3, letter: 'V' } });
          game.say('Down among the wooden blocks: a mirror-shard, numbered 3, letter V. Kept.');
          game.refreshScene();
        },
      });
    }

    if (!done(state)) {
      spots.push({
        id: 'box', x: 560, y: 540, w: 480, h: 150, label: 'The music box — four figures',
        onInteract(game) { openBox(game); },
      });
    } else {
      spots.push({
        id: 'out', x: 560, y: 540, w: 480, h: 150, label: 'The toy-cupboard passage',
        onInteract(game) {
          if (role === 'p1' && !game.journal.has('shard_v')) { game.say('A shard is in the toy chest — take it before you go on.'); return; }
          game.completeRoom({ delay: 600 });
        },
      });
    }

    return spots;
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: 'Your partner\'s card shows your four figures — as they stand in THEIR room. Read the plate on your own music box.', cost: 60 },
      { text: 'Their room is your mirror: what stands at your left stands at their right. Have them read you their card 1 to 4, then set it backwards — their 4th is your 1st.', cost: 120 },
      { text: isWaking() ? 'Waking figures: Owl, Hare, Wren, Fox.' : 'Glass figures: Wren, Owl, Fox, Hare.', cost: 240 },
    ];
  },
};

function openBox(game) {
  const role = getRole();
  const target = TARGET[role];
  const f = [game.getFlag('nursery_f0') ?? 0, game.getFlag('nursery_f1') ?? 0, game.getFlag('nursery_f2') ?? 0, game.getFlag('nursery_f3') ?? 0];

  game.openPuzzle({
    id: 'nursery_box',
    title: 'Wind the Music Box',
    render(body, api) {
      body.innerHTML = `
        <div class="puzzle-hero" style="background-image:url(art/pz-nursery.webp)"></div>
        <p class="puzzle-desc">Turn each figure to the right animal. Your order is on your partner's
        card — ask them to read you figures 1 through 4.</p>
        <div class="puzzle-row" id="nu-dials"></div>
        <div class="puzzle-row"><button class="btn btn-primary" id="nu-try">Wind It</button></div>
        <div class="puzzle-feedback"></div>`;
      const row = body.querySelector('#nu-dials');
      f.forEach((v, i) => {
        const dial = document.createElement('div');
        dial.className = 'dial';
        dial.innerHTML = `
          <button class="dial-btn" data-d="1">&#8635;</button>
          <div class="dial-face" style="font-size:16px;">${ANIMALS[v]}</div>
          <button class="dial-btn" data-d="-1">&#8634;</button>
          <div class="lever-label">figure ${i + 1}</div>`;
        const face = dial.querySelector('.dial-face');
        dial.querySelectorAll('.dial-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            f[i] = (f[i] + Number(btn.dataset.d) + 4) % 4;
            face.textContent = ANIMALS[f[i]];
            face.classList.remove('tick'); void face.offsetWidth; face.classList.add('tick');
            game.playSfx('click');
            game.setFlag(`nursery_f${i}`, f[i]);
          });
        });
        row.appendChild(dial);
      });
      body.querySelector('#nu-try').addEventListener('click', () => {
        if (f.every((v, i) => v === target[i])) {
          game.setFlag('nursery_done');
          game.playSfx('solve');
          api.solved({ message: 'The box chimes a small crooked tune and the toy-cupboard clicks and yawns open into the passage beyond.' });
          game.refreshScene();
        } else {
          api.fail('The tune jams — a figure faces the wrong way. Check the card with your partner.');
        }
      });
    },
  });
}
