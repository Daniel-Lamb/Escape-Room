// ROOM 2 — The Guard Room.
// Puzzle: the Watch-Order Bolts — five beast-stamped bolts drawn in the order
// the companies stand watch: Boar -> Serpent -> Wolf -> Stag -> Falcon.
// Then: pry the concealed door behind the cabinet with the iron crow.

import { registerItems, registerCombos } from '../../../shared/js/items.js';
import { kitDefs, shadow } from '../../../shared/js/scenekit.js';

registerItems({
  iron_crow: {
    name: 'Iron Crow',
    description: 'A prying bar, heavy and honest. Doors respect it.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 40 L34 12 q4 -5 8 -1 q3 4 -2 7 l-4 2" fill="none" stroke="#7d8494" stroke-width="5" stroke-linecap="round"/>
      <path d="M12 40 l-3 -6 6 -1 z" fill="#7d8494"/>
    </svg>`,
  },
  flint_steel: {
    name: 'Flint & Steel',
    description: 'A striker and a good grey flint. Fire, whenever you ask for it.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 30 q6 -12 18 -10 q-2 10 -12 14 q-5 1 -6 -4z" fill="#8b8878"/>
      <path d="M28 14 q10 2 10 12 q0 8 -8 10" fill="none" stroke="#a9b0c0" stroke-width="4" stroke-linecap="round"/>
      <g stroke="#ffd9a0" stroke-width="2" stroke-linecap="round">
        <line x1="30" y1="28" x2="34" y2="24"/><line x1="33" y1="31" x2="38" y2="29"/>
      </g>
    </svg>`,
  },
  lit_candle: {
    name: 'Lit Candle',
    description: 'A private, portable star. Guard the flame.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="20" width="12" height="18" rx="2" fill="#e8d9b0"/>
      <line x1="24" y1="20" x2="24" y2="15" stroke="#4a4a4a" stroke-width="2"/>
      <path d="M24 4 q6 8 0 12 q-6 -4 0 -12" fill="#ffa94d"/>
      <path d="M24 8 q3 5 0 8 q-3 -3 0 -8" fill="#ffd9a0"/>
      <rect x="14" y="38" width="20" height="4" rx="2" fill="#8a6d1c"/>
    </svg>`,
  },
});

registerCombos([
  {
    pair: ['flint_steel', 'candle_stub'],
    onCombine(game) {
      game.removeItem('candle_stub');
      game.addItem('lit_candle', { silent: true });
      game.playSfx('hint');
      game.say('You strike sparks into the blackened wick. It catches — a small, defiant flame. The dark backs off a pace.');
    },
  },
]);

const BEASTS = [
  { key: 'boar',    name: 'Boar',    glyph: `<path d="M8 26 q2 -12 16 -12 q10 0 12 8 l6 -2 -2 7 q2 3 -1 6 q-4 5 -15 5 q-14 0 -16 -12z" fill="none" stroke="currentColor" stroke-width="3"/><path d="M36 22 q5 -1 6 -6" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="20" cy="22" r="2" fill="currentColor"/>` },
  { key: 'stag',    name: 'Stag',    glyph: `<path d="M24 22 q-2 12 0 20 M24 22 q-8 -2 -10 -12 m10 12 q8 -2 10 -12 M14 12 q-4 2 -8 0 m8 0 q0 -6 -4 -8 M34 12 q4 2 8 0 m-8 0 q0 -6 4 -8" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="24" cy="28" r="5" fill="none" stroke="currentColor" stroke-width="3"/>` },
  { key: 'wolf',    name: 'Wolf',    glyph: `<path d="M10 34 q0 -14 10 -18 l-2 -8 8 6 8 -6 -2 8 q10 4 10 18 q-8 -6 -16 -6 q-8 0 -16 6z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><circle cx="19" cy="26" r="2" fill="currentColor"/><circle cx="29" cy="26" r="2" fill="currentColor"/>` },
  { key: 'falcon',  name: 'Falcon',  glyph: `<path d="M24 8 q14 6 16 22 q-8 -4 -12 -2 l4 12 -8 -6 -8 6 4 -12 q-4 -2 -12 2 q2 -16 16 -22z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>` },
  { key: 'serpent', name: 'Serpent', glyph: `<path d="M12 10 q16 0 16 9 t-16 9 q16 0 16 9 l-4 4 m4 -4 l4 -2 M12 10 l-2 -4 m2 4 l-4 2" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" fill-rule="evenodd"/>` },
];
const ORDER = ['boar', 'serpent', 'wolf', 'stag', 'falcon'];

// Layout — read off the plate (art/guardroom.webp) and shared with hotspots().
// TABLE is the painted tabletop as a perspective quad: back-left, back-right,
// front-right, front-left. tableAt(u, v) maps (0..1 across, 0..1 back→front).
const TABLE = { bl: [646, 540], br: [940, 536], fr: [1132, 630], fl: [764, 656] };
function tableAt(u, v) {
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const back = lerp(TABLE.bl, TABLE.br, u), front = lerp(TABLE.fl, TABLE.fr, u);
  const p = lerp(back, front, v);
  return [Math.round(p[0]), Math.round(p[1])];
}
const CUP = { door: 'M1212 240 L1486 204 L1486 756 L1212 700 Z' };
const SUN2 = { cx: 1300, cy: 152 };
const R = {
  roster:  { x: 648, y: 236, w: 150, h: 196 },
  tally:   { x: 40, y: 280, w: 160, h: 160 },
  carving: { x: 760, y: 626, w: 380, h: 64 },
  letter:  { x: 970, y: 560, w: 140, h: 80 },
  dice:    { x: 800, y: 548, w: 90, h: 64 },
  flint:   { x: 720, y: 570, w: 80, h: 64 },
  crow:    { x: 360, y: 610, w: 90, h: 190 },
  hatch:   { x: 420, y: 740, w: 210, h: 110 },
  sun2:    { x: 1250, y: 112, w: 130, h: 90 },
  cabinet: { x: 1110, y: 214, w: 380, h: 520 },
};

export default {
  id: 'guardroom',
  solution: ORDER,
  lintStates: [
    { label: 'bolts', flags: { guardroom_boltsOpen: true } },
    { label: 'back', flags: { guardroom_boltsOpen: true, guardroom_backdoorOpen: true, guardroom_crowTaken: true, guardroom_flintTaken: true } },
  ],
  title: "The Guard Room",
  intro: 'You haul yourself out of the cistern shaft into warmth: a low timbered room, a banked brazier, dice abandoned mid-game. The garrison has gone to the walls — all of them. Something has the castle holding its breath tonight.',

  scene(state) {
    const bolts = !!state.flags.guardroom_boltsOpen;
    const back = !!state.flags.guardroom_backdoorOpen;
    const crowHere = !state.inventory.includes('iron_crow') && !state.flags.guardroom_crowTaken;
    const flintHere = !state.inventory.includes('flint_steel') && !state.flags.guardroom_flintTaken;

    // The plate paints the room: brazier (left), archway to the battlements,
    // wall torch, a trestle table in perspective, and the iron-bound armory
    // cupboard against the right wall. Props sit on those; nothing is redrawn.
    const T = (u, v) => tableAt(u, v);
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${kitDefs()}
        <radialGradient id="gd_gr_brazier" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(255,140,60,0.5)"/>
          <stop offset="0.5" stop-color="rgba(255,140,60,0.18)"/>
          <stop offset="1" stop-color="rgba(255,140,60,0)"/>
        </radialGradient>
      </defs>

      <!-- background plate (generated) -->
      <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="art/guardroom.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="art/guardroom.mp4" type="video/mp4"/></video></foreignObject>

      <!-- warmth over the painted brazier -->
      <ellipse cx="250" cy="690" rx="230" ry="150" fill="url(#gd_gr_brazier)" class="glow"/>

      <!-- duty roster, pinned to the back wall between the archway and the torch -->
      <g data-mount="pinned">
        <image href="art/gr-roster.webp" x="${R.roster.x}" y="${R.roster.y}" width="${R.roster.w}" height="${R.roster.h}" preserveAspectRatio="none" transform="rotate(-2 ${R.roster.x + R.roster.w / 2} ${R.roster.y + 110})" filter="url(#sk_drop)"/>
        <g font-family="Palatino Linotype, Georgia, serif" fill="#3a2c14" transform="rotate(-2 ${R.roster.x + R.roster.w / 2} ${R.roster.y + 110})">
          <text x="${R.roster.x + R.roster.w / 2}" y="${R.roster.y + 42}" font-size="17" text-anchor="middle" font-weight="bold">DUTY ROSTER</text>
          <line x1="${R.roster.x + 22}" y1="${R.roster.y + 52}" x2="${R.roster.x + R.roster.w - 22}" y2="${R.roster.y + 52}" stroke="#4a3a1c" stroke-width="2"/>
          ${['Dusk', 'Evensong', 'Dead of Night', 'Cock-crow', 'Dawn'].map((w, i) =>
            `<text x="${R.roster.x + 22}" y="${R.roster.y + 80 + i * 24}" font-size="14">${w} ......</text>`).join('')}
        </g>
        <circle cx="${R.roster.x + R.roster.w / 2}" cy="${R.roster.y + 12}" r="5" fill="#2a2620"/>
      </g>

      <!-- slate tally board, hung on a cord from a nail on the left wall -->
      <g data-mount="hook">
        <path d="M${R.tally.x + 40} ${R.tally.y + 14} L${R.tally.x + R.tally.w / 2} ${R.tally.y - 26} L${R.tally.x + R.tally.w - 40} ${R.tally.y + 14}" fill="none" stroke="#3b2d1c" stroke-width="3"/>
        <circle cx="${R.tally.x + R.tally.w / 2}" cy="${R.tally.y - 26}" r="5" fill="#2a2620"/>
        <image href="art/gr-slate.webp" x="${R.tally.x}" y="${R.tally.y}" width="${R.tally.w}" height="${R.tally.h}" preserveAspectRatio="xMidYMid meet" filter="url(#sk_drop)"/>
        <g stroke="#eef2f6" stroke-width="3" opacity="0.9" stroke-linecap="round">
          ${[0, 1, 2].map(r => [0, 1, 2, 3].map(c =>
            `<line x1="${R.tally.x + 38 + c * 24}" y1="${R.tally.y + 42 + r * 40}" x2="${R.tally.x + 38 + c * 24}" y2="${R.tally.y + 66 + r * 40}"/>`).join('')).join('')}
          <line x1="${R.tally.x + 32}" y1="${R.tally.y + 66}" x2="${R.tally.x + 114}" y2="${R.tally.y + 42}"/>
        </g>
      </g>

      <!-- iron crow, leaning against the archway's left jamb -->
      ${crowHere ? `
      <g data-mount="floor">
        ${shadow(404, 792, 40, 8)}
        <image href="art/gr-crow.webp" x="372" y="612" width="60" height="180" preserveAspectRatio="xMidYMid meet" transform="rotate(9 402 792)" class="beckon"/>
      </g>` : ''}

      <!-- on the painted tabletop (perspective): dice, cups, an unfinished letter, the fire-kit -->
      <g data-mount="table">
        ${shadow(...T(0.3, 0.45), 26, 6, 0.6)}
        <rect x="${T(0.3, 0.45)[0] - 14}" y="${T(0.3, 0.45)[1] - 20}" width="22" height="20" rx="4" fill="#e8d9b0"/>
        <circle cx="${T(0.3, 0.45)[0] - 3}" cy="${T(0.3, 0.45)[1] - 10}" r="2.4" fill="#2b2015"/>
        <rect x="${T(0.3, 0.45)[0] + 12}" y="${T(0.3, 0.45)[1] - 17}" width="19" height="18" rx="4" fill="#e8d9b0" transform="rotate(14 ${T(0.3, 0.45)[0] + 21} ${T(0.3, 0.45)[1] - 8})"/>
        <g fill="#2b2015"><circle cx="${T(0.3, 0.45)[0] + 17}" cy="${T(0.3, 0.45)[1] - 12}" r="2"/><circle cx="${T(0.3, 0.45)[0] + 25}" cy="${T(0.3, 0.45)[1] - 4}" r="2"/></g>
        ${[[0.55, 0.25], [0.64, 0.35]].map(([u, v]) => { const [x, y] = T(u, v); return `${shadow(x + 12, y, 20, 5, 0.6)}<path d="M${x} ${y - 38} l24 0 -4 38 -16 0 z" fill="#6b5330" stroke="#2a1f12" stroke-width="1.5"/><ellipse cx="${x + 12}" cy="${y - 38}" rx="12" ry="3" fill="#3a2a16"/>`; }).join('')}
        ${(() => { const [x, y] = T(0.78, 0.55); return `
          <g transform="rotate(-12 ${x} ${y})">
            ${shadow(x, y + 4, 56, 7, 0.5)}
            <rect x="${x - 50}" y="${y - 22}" width="100" height="46" rx="3" fill="url(#sk_parch)" stroke="#7d6538" stroke-width="1"/>
            <g stroke="#8a7a50" stroke-width="2"><line x1="${x - 40}" y1="${y - 10}" x2="${x + 36}" y2="${y - 10}"/><line x1="${x - 40}" y1="${y}" x2="${x + 30}" y2="${y}"/><line x1="${x - 40}" y1="${y + 10}" x2="${x + 10}" y2="${y + 10}"/></g>
            <path d="M${x + 30} ${y - 6} q22 -20 38 -22 q-8 14 -28 28z" fill="#cfd4de"/>
          </g>`; })()}
        ${flintHere ? (() => { const [x, y] = T(0.12, 0.6); return `${shadow(x, y + 4, 40, 7, 0.6)}<image href="art/gr-flint.webp" x="${x - 40}" y="${y - 30}" width="80" height="50" preserveAspectRatio="xMidYMid meet" class="beckon"/>`; })() : ''}
      </g>

      <!-- knife-carved words along the table's front edge -->
      <text x="0" y="0" font-size="14" fill="#1a120a" font-style="italic" opacity="0.85"
        font-family="Palatino Linotype, Georgia, serif" text-anchor="middle"
        transform="translate(${(TABLE.fl[0] + TABLE.fr[0]) / 2} ${(TABLE.fl[1] + TABLE.fr[1]) / 2 + 16}) rotate(${Math.atan2(TABLE.fr[1] - TABLE.fl[1], TABLE.fr[0] - TABLE.fl[0]) * 180 / Math.PI})">"the serpent slithers in the moment the boar lies down"</text>

      <!-- the armory cupboard (painted): five beast bolts riveted down its right door -->
      ${back ? `
        <g data-mount="wall">
          <path d="${CUP.door}" fill="#05070d"/>
          <path d="${CUP.door}" fill="none" stroke="#3c4152" stroke-width="4"/>
          <g stroke="#2b3242" stroke-width="7" opacity="0.9">
            ${[0, 1, 2, 3, 4].map(i => `<line x1="${1236 + i * 4}" y1="${640 - i * 70}" x2="${1460 - i * 4}" y2="${600 - i * 70}"/>`).join('')}
          </g>
          <ellipse cx="1350" cy="420" rx="70" ry="34" fill="rgba(154,196,255,0.07)" class="fog"/>
        </g>`
      : bolts ? `
        <g data-mount="wall">
          <path d="${CUP.door}" fill="#120d08"/>
          ${[0, 1, 2, 3].map(i => `<circle cx="${1250 + i * 64}" cy="${330 - i * 7}" r="7" fill="#4a3a26"/><circle cx="${1250 + i * 64}" cy="${470 - i * 7}" r="7" fill="#4a3a26"/>`).join('')}
          <text x="1350" y="600" font-size="18" fill="#8b8878" text-anchor="middle" font-style="italic" transform="rotate(-5 1350 600)"
            font-family="Palatino Linotype, Georgia, serif">empty pegs — a cold draft</text>
        </g>`
      : `
        <g data-mount="bolts">
          ${BEASTS.map((b, i) => `
            <g transform="translate(1250 ${292 + i * 72}) skewY(-6)">
              <rect x="0" y="0" width="200" height="46" rx="6" fill="url(#sk_iron)" stroke="#0e0f12" stroke-width="3" filter="url(#sk_drop)"/>
              <rect x="8" y="9" width="116" height="28" rx="5" fill="#57606f" stroke="#2a2e36" stroke-width="2"/>
              <circle cx="10" cy="23" r="4" fill="#1d2027"/><circle cx="190" cy="23" r="4" fill="#1d2027"/>
              <g transform="translate(142 2) scale(0.88)" color="#c9a227">${b.glyph}</g>
            </g>`).join('')}
        </g>`}

      <!-- sun-mark #2: three rays scratched small into the wall above the cupboard, gilt in the cuts -->
      <g class="beckon" data-mount="inset">
        ${[0, 1, 2].map(i => {
          const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
          return `<line x1="${SUN2.cx + Math.cos(a) * 12}" y1="${SUN2.cy + Math.sin(a) * 12}" x2="${SUN2.cx + Math.cos(a) * 28}" y2="${SUN2.cy + Math.sin(a) * 28}" stroke="#e8c85a" stroke-width="3" stroke-linecap="round"/>`;
        }).join('')}
        <circle cx="${SUN2.cx}" cy="${SUN2.cy}" r="9" fill="none" stroke="#e8c85a" stroke-width="3"/>
        <text x="${SUN2.cx + 40}" y="${SUN2.cy + 8}" font-size="22" fill="#e8c85a" font-family="Palatino Linotype, Georgia, serif">A</text>
      </g>

      <!-- the cistern trapdoor you climbed through, lid thrown back on the boards -->
      <g data-mount="floor">
        <path d="M440 800 L600 796 L620 842 L424 848 Z" fill="#05070d"/>
        <path d="M440 800 L600 796 L620 842 L424 848 Z" fill="none" stroke="#2a2118" stroke-width="4"/>
        <path d="M440 800 L600 796 L590 742 L452 744 Z" fill="url(#sk_darkwood)" stroke="#1a120a" stroke-width="3"/>
        <circle cx="521" cy="766" r="9" fill="none" stroke="#5d6270" stroke-width="3"/>
      </g>

      <path d="M0 900 L0 856 Q800 910 1600 856 L1600 900 Z" fill="#05070d"/>
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const bolts = !!state.flags.guardroom_boltsOpen;
    const back = !!state.flags.guardroom_backdoorOpen;

    spots.push({
      id: 'roster', ...R.roster, label: 'Duty roster',
      onInteract(game) {
        const html = `<div class="parchment-note"><div class="note-title">Duty Roster</div>
          <p>"Five companies, five watches: <strong>Dusk, Evensong, Dead of Night, Cock-crow, Dawn.</strong>
          Bolts drawn as the watches pass."</p>
          <p>Below, in a sergeant's hand: <em>"The Wolf stands neither the first watch nor the last."</em></p></div>`;
        game.journal.add('note_roster', { title: 'Duty roster (Guard Room)', category: 'note', html });
        game.dialog({ title: 'The Duty Roster', html });
      },
    });

    spots.push({
      id: 'tally', ...R.tally, label: 'Slate tally board',
      onInteract(game) {
        const html = `<p>Chalk tallies, and one line pressed hard enough to score the slate:</p>
          <div class="parchment-note aged"><p>"First watch to the company of <strong>the tusked</strong>."</p></div>`;
        game.journal.add('note_tally', { title: 'Tally board (Guard Room)', category: 'note', html });
        game.dialog({ title: 'The Tally Board', html });
      },
    });

    spots.push({
      id: 'carving', ...R.carving, label: 'Words carved in the table',
      onInteract(game) {
        const html = `<p>Knife-carved during some long boring watch:</p>
          <div class="parchment-note aged"><p>"The Serpent slithers in the moment the Boar lies down."</p></div>
          <p style="color:var(--text-dim); font-style:italic;">The Serpent's watch comes directly after the Boar's — no watch between.</p>`;
        game.journal.add('note_carving', { title: 'Table carving (Guard Room)', category: 'note', html });
        game.dialog({ title: 'Carved in the Tabletop', html });
      },
    });

    spots.push({
      id: 'letter', ...R.letter, label: 'Unfinished letter',
      onInteract(game) {
        const html = `<div class="parchment-note"><div class="note-title">Unfinished letter</div>
          <p>"...my watch falls <strong>directly after the Stag's men come in</strong>, and I thank God I need
          not stand the Dead of Night, for that is when the dogs howl worst..."</p>
          <p style="text-align:right;">— Osric, of the <strong>Falcon</strong></p></div>`;
        game.journal.add('note_letter', { title: "Osric's letter (Guard Room)", category: 'note', html });
        game.dialog({ title: "Osric's Letter", html });
      },
    });

    spots.push({
      id: 'dice', ...R.dice, label: 'Abandoned dice',
      onInteract(game) { game.say('Fives and threes, mid-game, cups still half full. They left in a hurry, and not for a drill.'); },
    });

    spots.push({
      id: 'hatch', ...R.hatch, label: 'Cistern hatch',
      onInteract(game) { game.say('The shaft you climbed. It only goes back down to the cell. Forward is the only direction that exists tonight.'); },
    });

    spots.push({
      id: 'sun2', ...R.sun2, label: 'A carved sun',
      onInteract(game) {
        game.journal.add('sun2', { title: 'Guard Room — above the bolt rack', category: 'sun', sun: { rays: 3, letter: 'A' } });
        game.say('Scratched small above the armory cupboard: a sun of three rays, and the letter A. The second mark on Edmund\'s road.');
      },
    });

    if (!state.inventory.includes('iron_crow') && !state.flags.guardroom_crowTaken) {
      spots.push({
        id: 'crow', ...R.crow, label: 'Iron pry bar',
        onInteract(game) {
          game.setFlag('guardroom_crowTaken');
          game.addItem('iron_crow', { from: { x: 402, y: 700 } });
          game.refreshScene();
        },
      });
    }

    if (!state.inventory.includes('flint_steel') && !state.flags.guardroom_flintTaken) {
      spots.push({
        id: 'flint', ...R.flint, label: 'Flint & steel',
        onInteract(game) {
          game.setFlag('guardroom_flintTaken');
          game.addItem('flint_steel', { from: { x: 760, y: 600 } });
          game.refreshScene();
        },
      });
    }

    if (!bolts) {
      spots.push({
        id: 'cabinet', ...R.cabinet, label: 'Armory cabinet — five bolts',
        onInteract(game) { openBoltPuzzle(game); },
      });
    } else if (!back) {
      spots.push({
        id: 'backpanel', ...R.cabinet, label: 'The back of the cabinet',
        onInteract(game) {
          if (game.selectedItem === 'iron_crow') {
            game.setFlag('guardroom_backdoorOpen');
            game.playSfx('creak');
            game.say('You drive the crow into the rusted seam and lean. With a shriek of old iron the false back tears open — stone stairs spiral down into the dark, breathing cold air.');
            game.selectedItem = null;
            game.refreshScene();
          } else {
            game.say('Empty pegs — every blade taken to the walls. But the draft... the back panel is a door, rusted shut at the seam. You\'d need iron to persuade it.');
          }
        },
      });
    } else {
      spots.push({
        id: 'stairs', ...R.cabinet, label: 'Stairs down',
        onInteract(game) {
          if (!state.inventory.includes('flint_steel') && !state.flags.guardroom_flintTaken) {
            // Where you are going is dark: you pocket the guard's fire-kit on the way past.
            game.setFlag('guardroom_flintTaken');
            game.addItem('flint_steel', { from: { x: 760, y: 600 }, silent: true });
          }
          if (!game.journal.has('sun2')) {
            game.journal.add('sun2', { title: 'Guard Room — above the bolt rack', category: 'sun', sun: { rays: 3, letter: 'A' } });
            game.say('On your way out, gold catches your eye above the bolt rack: a sun of three rays and the letter A. You copy it into your journal — "mark each sun along the road."');
            game.completeRoom({ delay: 3000 });
            return;
          }
          game.completeRoom({ delay: 600 });
        },
      });
    }

    return spots;
  },

  hintContext(state) {
    return state.flags.guardroom_boltsOpen ? 'door' : 'bolts';
  },

  hints(state) {
    if (!state.flags.guardroom_boltsOpen) {
      return [
        { text: 'Four clues name five companies: the roster, the tally board, the tabletop, the letter. Whose watch is pinned down absolutely?', cost: 60 },
        { text: "The tusked one is the Boar — first watch. The Serpent follows him directly. Now: Falcon comes directly after Stag, and the Wolf can stand neither first nor last.", cost: 120 },
        { text: 'Draw the bolts: Boar, Serpent, Wolf, Stag, Falcon.', cost: 240 },
      ];
    }
    return [
      { text: 'That cold draft is coming from behind the empty weapon pegs.', cost: 60 },
      { text: 'The cabinet back is a false panel, rusted at the seam. You carry a bar of honest iron.', cost: 120 },
      { text: 'Click the iron crow in your satchel to hold it, then click the open cabinet.', cost: 240 },
    ];
  },
};

function openBoltPuzzle(game) {
  let progress = [];

  game.openPuzzle({
    id: 'guardroom_bolts',
    title: 'The Watch-Order Bolts',
    render(body, api) {
      body.innerHTML = `
        <div class="puzzle-hero" style="background-image:url(art/pz-bolts.webp)"></div>
        <p class="puzzle-desc">Five sliding bolts, each stamped with a company's beast.
        The roster says it plainly: <em>"bolts drawn as the watches pass."</em>
        Draw them in the order the five companies stand watch — one mistake and they all spring back.</p>
        <div class="puzzle-row" id="gr-bolts"></div>
        <div class="puzzle-feedback"></div>`;

      const row = body.querySelector('#gr-bolts');

      const shuffled = [BEASTS[3], BEASTS[0], BEASTS[4], BEASTS[2], BEASTS[1]]; // display order != solution
      for (const beast of shuffled) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.style.minWidth = '86px';
        tile.style.color = '#c9a227';
        tile.innerHTML = `
          <svg viewBox="0 0 48 48" width="44" height="44">${beast.glyph}</svg>
          <div style="font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:var(--text-dim); margin-top:4px;">${beast.name}</div>`;
        tile.addEventListener('click', () => {
          if (tile.classList.contains('correct-flash')) return;
          game.playSfx('click');
          if (ORDER[progress.length] === beast.key) {
            progress.push(beast.key);
            tile.classList.add('correct-flash');
            api.setFeedback(`${beast.name} drawn — ${progress.length} of 5.`, 'good');
            if (progress.length === 5) {
              game.setFlag('guardroom_boltsOpen');
              api.solved({ message: 'The last bolt slides home and the cabinet doors sag open... onto emptiness. Bare pegs. Every blade gone to the walls. But from behind the panel: a draft, cold as a river.' });
              game.refreshScene();
            }
          } else {
            progress = [];
            row.querySelectorAll('.tile').forEach(t => t.classList.remove('correct-flash'));
            api.fail('Springs snap — every bolt slams back. Wrong watch.');
          }
        });
        row.appendChild(tile);
      }
    },
  });
}
