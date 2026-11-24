// SCENE 5 — The Portrait Gallery (split riddle; the Glass side is mirror-ordered).
// Each side holds half the riddle naming the keyed portrait:
//   Waking half: "holds a black bird" -> {raven_red, raven_grey}
//   Glass  half: "wears mourning grey" -> {skull_grey, raven_grey}
// Only RAVEN_GREY satisfies both. Both must choose it (by content; positions differ).
// Waking (P1) finds mirror-shard I (5).

import { getRole, isWaking, sideName } from '../role.js';
import { defs, backdrop, sideTag, sconce, tint } from '../glasskit.js';
import { panel, shadow } from '../../../shared/js/scenekit.js';

const SLUG = 'gallery';
const KEYED = 'raven_grey';
// Each sitter is painted in the colour the riddle turns on, holding the thing it names.
const PORTRAITS = [
  { id: 'rose', name: 'Lady in white, with a white rose', emblem: '🌹', dress: '#e6dfcf', hood: false, at: [18, 44] },
  { id: 'raven_red', name: 'Lady in red, a raven at her wrist', emblem: '🐦‍⬛', dress: '#9a2222', hood: false, at: [26, 52] },
  { id: 'skull_grey', name: 'Monk in grey, holding a skull', emblem: '💀', dress: '#8a8c93', hood: true, at: [-22, 50] },
  { id: 'raven_grey', name: 'Lady in mourning grey, a raven at her shoulder', emblem: '🐦‍⬛', dress: '#8a8c93', hood: false, at: [34, 30] },
  { id: 'key', name: 'Gentleman in black, with a brass key', emblem: '🗝️', dress: '#211b16', hood: false, at: [22, 48] },
];

// The portraits hang on a five-leaf folding screen standing across the gallery
// (the plate's walls recede too steeply to hang five legible frames). One leaf
// is hinged as a door. The half-riddle is a brass label on a post in front.
const LEAF_W = 190, LEAF_TOP = 250, LEAF_FOOT = 790;
const leafX = i => 400 + i * 200;                       // leaf centre
const FRAME = { top: 286, w: 150, h: 196 };
const PLATE = { x: 600, y: 640, w: 400, h: 100 };
const SHARD = { x: 1305, y: 455, w: 100, h: 100 };

function portrait(p, cx) {
  const x = cx - FRAME.w / 2, y = FRAME.top, w = FRAME.w, h = FRAME.h;
  const bx = x + 12, by = y + 12, bw = w - 24, bh = h - 24, mid = cx, chin = by + 92;
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="url(#sk_brass)" stroke="#3a2a0c" stroke-width="3"/>
    <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="#1b1611"/>
    <path d="M${bx} ${by + bh} Q${mid - 50} ${chin + 8} ${mid} ${chin} Q${mid + 50} ${chin + 8} ${bx + bw} ${by + bh} Z" fill="${p.dress}"/>
    ${p.hood ? `<path d="M${mid - 34} ${chin + 6} Q${mid - 36} ${by + 26} ${mid} ${by + 22} Q${mid + 36} ${by + 26} ${mid + 34} ${chin + 6} Z" fill="${p.dress}"/>` : ''}
    <ellipse cx="${mid}" cy="${by + 64}" rx="18" ry="23" fill="#d6b08c"/>
    <text x="${mid + p.at[0]}" y="${chin + p.at[1]}" text-anchor="middle" font-size="32">${p.emblem}</text>`;
}
// this side's half of the riddle
const MY_HALF = {
  p1: 'The keyed sitter HOLDS A BLACK BIRD.',
  p2: 'The keyed sitter WEARS MOURNING GREY.',
};
// display order: the Glass side sees the gallery mirror-reversed
function ordered() { return isWaking() ? PORTRAITS : [...PORTRAITS].reverse(); }

function done(state) { return !!state.flags.gallery_done; }

export default {
  id: 'gallery',
  solution: KEYED.split('_'),
  lintStates: [{ label: 'solved', flags: { gallery_done: true } }],
  get title() { return `${sideName()} · The Portrait Gallery`; },
  get intro() {
    return 'A gallery of Whitlock ancestors, five faces in heavy frames hung on a tall folding screen across the hall — and one leaf of it is really a door, its keyhole hidden in a painting. A brass label tells half of who the sitter is. Only half. Your partner\'s gallery holds the other half, and in the glass the whole row hangs the wrong way round.';
  },

  scene(state) {
    const t = tint();
    const fin = done(state);
    const markHere = isWaking() && !state.journal.some(e => e.id === 'shard_i');
    const row = ordered();
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}</defs>
      ${backdrop(SLUG)}
      ${sconce(SLUG, 1550, 520)}

      <!-- the folding screen: five leaves on the floor, a portrait on each -->
      <g data-mount="floor">
        ${shadow(800, LEAF_FOOT + 6, 560, 14)}
        ${row.map((p, i) => {
          const cx = leafX(i);
          if (fin && p.id === KEYED) {
            return `<path d="M${cx + LEAF_W / 2} ${LEAF_TOP} L${cx + LEAF_W / 2 + 34} ${LEAF_TOP - 16} L${cx + LEAF_W / 2 + 34} ${LEAF_FOOT + 12} L${cx + LEAF_W / 2} ${LEAF_FOOT} Z" fill="url(#sk_darkwood)" stroke="#0b0703" stroke-width="3"/>
              <rect data-fx="light" x="${cx - LEAF_W / 2 + 10}" y="${LEAF_TOP + 10}" width="${LEAF_W - 20}" height="${LEAF_FOOT - LEAF_TOP - 20}" fill="${isWaking() ? 'rgba(255,207,138,0.07)' : 'rgba(159,168,189,0.09)'}"/>`;
          }
          return `
          <rect x="${cx - LEAF_W / 2}" y="${LEAF_TOP}" width="${LEAF_W}" height="${LEAF_FOOT - LEAF_TOP}" rx="4" fill="url(#sk_darkwood)" stroke="#0b0703" stroke-width="3"/>
          <rect x="${cx - LEAF_W / 2}" y="${LEAF_TOP}" width="${LEAF_W}" height="${LEAF_FOOT - LEAF_TOP}" fill="#000" opacity="${i % 2 ? 0.22 : 0}"/>
          <rect x="${cx - LEAF_W / 2 + 14}" y="${LEAF_FOOT - 230}" width="${LEAF_W - 28}" height="200" rx="3" fill="none" stroke="#000" stroke-opacity="0.45" stroke-width="3"/>
          ${[cx - LEAF_W / 2 + 18, cx + LEAF_W / 2 - 18].map(fx => `<rect x="${fx - 10}" y="${LEAF_FOOT}" width="20" height="10" rx="2" fill="#140d07"/>`).join('')}
          <line x1="${cx}" y1="${LEAF_TOP + 6}" x2="${cx}" y2="${FRAME.top}" stroke="#7d6a3e" stroke-width="2"/>
          ${portrait(p, cx)}
          <rect x="${cx - 16}" y="${FRAME.top + FRAME.h + 10}" width="32" height="22" rx="3" fill="url(#sk_brass)" stroke="#3a2a0c" stroke-width="1.5"/>
          <text x="${cx}" y="${FRAME.top + FRAME.h + 26}" text-anchor="middle" font-size="13" fill="#2a1d05" font-family="Consolas, monospace">${i + 1}</text>`;
        }).join('')}
      </g>

      <!-- the riddle half-plate, a brass label on a post in front of the screen -->
      ${panel({ ...PLATE, material: 'brass', mount: 'post', floorY: 870, body: `
        <text x="${PLATE.x + PLATE.w / 2}" y="${PLATE.y + 32}" text-anchor="middle" font-size="13" fill="#2a1d05" font-family="Georgia, serif" letter-spacing="1">HALF A RIDDLE</text>
        <text x="${PLATE.x + PLATE.w / 2}" y="${PLATE.y + 70}" text-anchor="middle" font-size="18" fill="#2a1d05" font-family="Georgia, serif">${MY_HALF[getRole()]}</text>` })}

      ${markHere ? `
      <g class="beckon">
        <polygon points="1326,470 1366,462 1380,500 1362,536 1330,528 1320,498" fill="rgba(201,204,214,0.14)" stroke="#c9ccd6" stroke-width="2.5"/>
        <text x="1350" y="506" text-anchor="middle" font-size="18" fill="#dfe6f2" font-family="Consolas, monospace" font-weight="bold">5</text>
      </g>` : ''}

      ${sideTag()}
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const t = tint();
    const row = ordered();

    spots.push({
      id: 'plate', ...PLATE, label: 'The brass plate (half a riddle)',
      onInteract(game) {
        const html = `<div class="cipher"><div class="cipher-title">The brass plate</div>
          <p style="text-align:center;color:#f2ecdb;font-size:18px;">"${MY_HALF[getRole()]}"</p></div>
          <div class="relay">This is only HALF the riddle. Your partner's plate holds the other half. Trade them — the keyed sitter is the one who fits BOTH.</div>`;
        game.journal.add('note_plate', { title: 'The gallery plate (half a riddle)', category: 'note', html });
        game.dialog({ title: 'The Brass Plate', html });
      },
    });

    if (isWaking() && !state.journal.some(e => e.id === 'shard_i')) {
      spots.push({
        id: 'shard_i', ...SHARD, label: 'A mirror-shard',
        onInteract(game) {
          game.journal.add('shard_i', { title: 'Gallery — behind a frame', category: 'sun', sun: { rays: 5, letter: 'I' } });
          game.say('Wedged behind the great portrait on the right-hand wall: a mirror-shard, numbered 5, letter I. Kept.');
          game.refreshScene();
        },
      });
    }

    if (!done(state)) {
      // each portrait is clickable; choosing the keyed one solves
      row.forEach((p, i) => {
        spots.push({
          id: `p_${p.id}`, x: leafX(i) - FRAME.w / 2, y: FRAME.top, w: FRAME.w, h: FRAME.h, label: p.name,
          onInteract(game) {
            if (p.id === KEYED) {
              game.setFlag('gallery_done');
              game.playSfx('unlock');
              game.say('Your fingers find the hidden keyhole in the frame. It turns — and that whole leaf of the screen swings back on its hinge, opening the gallery beyond.');
              game.refreshScene();
            } else {
              game.playSfx('wrong');
              game.say('No keyhole here. Compare both halves of the riddle with your partner before you choose.');
            }
          },
        });
      });
    } else {
      spots.push({
        id: 'out', x: leafX(row.findIndex(p => p.id === KEYED)) - LEAF_W / 2, y: LEAF_TOP, w: LEAF_W, h: PLATE.y - 12 - LEAF_TOP, label: 'The open leaf of the screen',
        onInteract(game) {
          if (isWaking() && !game.journal.has('shard_i')) { game.say('A shard is wedged behind the great portrait on the right-hand wall — take it before you go.'); return; }
          game.completeRoom({ delay: 600 });
        },
      });
    }

    return spots;
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: 'Your plate names only half the sitter. Your partner\'s names the other half. The keyed portrait is the one that fits BOTH clues.', cost: 60 },
      { text: isWaking()
          ? 'Your half: the sitter holds a black bird — that is two of the five. Ask your partner\'s half to tell the two apart.'
          : 'Your half: the sitter wears mourning grey — that is two of the five. Ask your partner\'s half to tell the two apart.', cost: 120 },
      { text: 'It is the lady in mourning grey with a raven at her shoulder — choose that portrait.', cost: 240 },
    ];
  },
};
