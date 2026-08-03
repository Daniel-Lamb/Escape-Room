// SCENE 5 — The Portrait Gallery (split riddle; the Glass side is mirror-ordered).
// Each side holds half the riddle naming the keyed portrait:
//   Waking half: "holds a black bird" -> {raven_red, raven_grey}
//   Glass  half: "wears mourning grey" -> {skull_grey, raven_grey}
// Only RAVEN_GREY satisfies both. Both must choose it (by content; positions differ).
// Waking (P1) finds mirror-shard I (5).

import { getRole, isWaking, sideName } from '../role.js';
import { defs, backdrop, sideTag, sconce, tint } from '../glasskit.js';

const SLUG = 'gallery';
const KEYED = 'raven_grey';
const PORTRAITS = [
  { id: 'rose', name: 'Lady with a white rose', emblem: '🌹' },
  { id: 'raven_red', name: 'Lady in red, a raven at her wrist', emblem: '🐦‍⬛' },
  { id: 'skull_grey', name: 'Grey monk with a skull', emblem: '💀' },
  { id: 'raven_grey', name: 'Lady in mourning grey, a raven at her shoulder', emblem: '🐦‍⬛' },
  { id: 'key', name: 'Gentleman with a brass key', emblem: '🗝️' },
];
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
  get title() { return `${sideName()} · The Portrait Gallery`; },
  get intro() {
    return 'A gallery of Whitlock ancestors, five faces in heavy frames, and one frame that is really a door — its keyhole hidden in a painting. A brass plate tells half of who the sitter is. Only half. Your partner\'s gallery holds the other half, and in the glass the whole row hangs the wrong way round.';
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
      ${sconce(SLUG, 240, 300)}

      <!-- five portraits -->
      ${row.map((p, i) => {
        const x = 300 + i * 210;
        const keyed = fin && p.id === KEYED;
        return `<g>
          <rect x="${x - 78}" y="200" width="156" height="200" rx="6" fill="${keyed ? 'rgba(255,207,138,0.10)' : t.panel}" stroke="${t.accentDim}" stroke-width="6"/>
          <text x="${x}" y="310" text-anchor="middle" font-size="46">${p.emblem}</text>
          <text x="${x}" y="430" text-anchor="middle" font-size="12" fill="#9fa8bd" font-family="Consolas, monospace">${i + 1}</text>
          ${keyed ? `<circle cx="${x + 50}" cy="360" r="8" fill="${t.accent}"/>` : ''}
        </g>`;
      }).join('')}

      <!-- the riddle half-plate -->
      <g>
        <rect x="520" y="600" width="560" height="120" rx="8" fill="${t.panel}" stroke="${t.accentDim}" stroke-width="3"/>
        <text x="800" y="642" text-anchor="middle" font-size="14" fill="${t.accentDim}" font-family="Georgia, serif" letter-spacing="1">THE BRASS PLATE — HALF A RIDDLE</text>
        <text x="800" y="684" text-anchor="middle" font-size="20" fill="${t.ink}" font-family="Georgia, serif">${MY_HALF[getRole()]}</text>
      </g>

      ${markHere ? `
      <g class="beckon">
        <polygon points="1330,600 1375,592 1382,636 1360,670 1328,660 1320,624" fill="rgba(201,204,214,0.10)" stroke="#c9ccd6" stroke-width="2.5"/>
        <text x="1350" y="636" text-anchor="middle" font-size="18" fill="#dfe6f2" font-family="Consolas, monospace" font-weight="bold">5</text>
      </g>` : ''}

      ${sideTag()}
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const t = tint();
    const row = ordered();

    spots.push({
      id: 'plate', x: 520, y: 600, w: 560, h: 120, label: 'The brass plate (half a riddle)',
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
        id: 'shard_i', x: 1310, y: 590, w: 90, h: 100, label: 'A mirror-shard',
        onInteract(game) {
          game.journal.add('shard_i', { title: 'Gallery — behind a frame', category: 'sun', sun: { rays: 5, letter: 'I' } });
          game.say('Wedged behind a crooked frame: a mirror-shard, numbered 5, letter I. Kept.');
          game.refreshScene();
        },
      });
    }

    if (!done(state)) {
      // each portrait is clickable; choosing the keyed one solves
      row.forEach((p, i) => {
        const x = 300 + i * 210;
        spots.push({
          id: `p_${p.id}`, x: x - 78, y: 200, w: 156, h: 200, label: p.name,
          onInteract(game) {
            if (p.id === KEYED) {
              game.setFlag('gallery_done');
              game.playSfx('unlock');
              game.say('Your fingers find the hidden keyhole in the frame. It turns — and the whole portrait swings back on the passage behind it.');
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
        id: 'out', x: 300 - 78, y: 200, w: 1050, h: 200, label: 'The portrait passage',
        onInteract(game) {
          if (isWaking() && !game.journal.has('shard_i')) { game.say('A shard is wedged behind one of the frames — take it before you go.'); return; }
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
