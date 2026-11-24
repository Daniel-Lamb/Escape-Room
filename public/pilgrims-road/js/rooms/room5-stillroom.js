// ROOM 5 — The Still-Room.
// Puzzle: brew the Draught of Deep Sleep. Papaver x3, Valeriana x1 (the bent
// one-notch spoon from Room 1), Mel x2; stir widdershins (counter-clockwise,
// the dial's sun-arrow points clockwise) exactly 3 times; light the hearth;
// bellows until the kettle sings ONCE, then draw off.

import { registerItems, registerCombos } from '../../../shared/js/items.js';
import { kitDefs, panel, shadow, grounded } from '../../../shared/js/scenekit.js';

registerItems({
  recipe_left: {
    name: 'Torn Recipe (left half)',
    description: 'The left half of a herbalist\'s recipe. The riddling names survive; the measures are torn away.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 8 L34 8 L30 14 L35 20 L30 26 L35 32 L31 40 L12 40 Z" fill="#e8d9b0"/>
      <g stroke="#8a7a50" stroke-width="2"><line x1="16" y1="16" x2="28" y2="16"/><line x1="16" y1="23" x2="27" y2="23"/><line x1="16" y1="30" x2="26" y2="30"/></g>
    </svg>`,
  },
  full_recipe: {
    name: 'Draught Recipe (whole)',
    description: 'Both halves joined: "A Draught of Deep Sleep." The tear lines up like it was only ever resting.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="6" width="28" height="36" rx="2" fill="#e8d9b0"/>
      <path d="M24 6 L24 42" stroke="#c9b88a" stroke-width="1.5" stroke-dasharray="3 2"/>
      <g stroke="#8a7a50" stroke-width="2"><line x1="15" y1="14" x2="33" y2="14"/><line x1="15" y1="21" x2="33" y2="21"/><line x1="15" y1="28" x2="31" y2="28"/><line x1="15" y1="35" x2="28" y2="35"/></g>
    </svg>`,
  },
  meat_shank: {
    name: 'Dried Meat Shank',
    description: 'Hard as a bell clapper, but a dog would not care.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 34 Q10 20 22 14 Q34 8 38 18 Q41 26 30 30 Q20 34 20 40 Z" fill="#8a4a3c"/>
      <circle cx="16" cy="38" r="6" fill="none" stroke="#d9c493" stroke-width="4"/>
    </svg>`,
  },
  sleeping_draught: {
    name: 'Sleeping Draught',
    description: 'Pale as moonlight, smelling of poppies and honey. Deep sleep — with waking.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 6 h10 v10 q9 5 9 15 q0 11 -14 11 q-14 0 -14 -11 q0 -10 9 -15 z" fill="none" stroke="#aebfdd" stroke-width="3"/>
      <path d="M13 30 q11 -7 22 0 q-1 9 -11 9 q-10 0 -11 -9z" fill="#cfe0ff" opacity="0.8"/>
      <rect x="18" y="2" width="12" height="5" rx="2" fill="#6d7d9c"/>
    </svg>`,
  },
  drugged_meat: {
    name: 'Drugged Meat',
    description: 'Supper for something with too many teeth. Sweet dreams included.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 34 Q10 20 22 14 Q34 8 38 18 Q41 26 30 30 Q20 34 20 40 Z" fill="#8a4a3c"/>
      <circle cx="16" cy="38" r="6" fill="none" stroke="#d9c493" stroke-width="4"/>
      <g fill="#cfe0ff"><circle cx="28" cy="18" r="2"/><circle cx="33" cy="22" r="1.6"/><circle cx="24" cy="22" r="1.4"/></g>
    </svg>`,
  },
});

registerCombos([
  {
    pair: ['recipe_left', 'recipe_right'],
    onCombine(game) {
      game.removeItem('recipe_left');
      game.removeItem('recipe_right');
      game.addItem('full_recipe', { silent: true });
      game.playSfx('page');
      const html = `<div class="parchment-note"><div class="note-title">A Draught of Deep Sleep</div>
        <p>"Three measures of the flower that guards dreams;<br>
        one measure of the root that reeks of old boots;<br>
        two measures of the bees' gold.<br>
        Stir thrice widdershins; then fire beneath,<br>
        until the kettle sings once — <strong>no more</strong>.<br>
        Touch not the hemlock: that sleep has no waking."</p></div>`;
      game.journal.add('note_recipe', { title: 'The Draught of Deep Sleep (recipe)', category: 'note', html });
      game.dialog({ title: 'The Recipe, Whole', html });
    },
  },
  {
    pair: ['sleeping_draught', 'meat_shank'],
    onCombine(game) {
      game.removeItem('sleeping_draught');
      game.removeItem('meat_shank');
      game.addItem('drugged_meat', { silent: true });
      game.playSfx('pour');
      game.say('You soak the shank until it stops drinking. Somewhere above you, something with a big voice is going to sleep very well tonight.');
    },
  },
]);

const JARS = [
  { key: 'papaver',    label: 'PAPAVER' },
  { key: 'valeriana',  label: 'VALERIANA' },
  { key: 'mel',        label: 'MEL' },
  { key: 'cicuta',     label: 'CICUTA' },
  { key: 'artemisia',  label: 'ARTEMISIA' },
  { key: 'urtica',     label: 'URTICA' },
  { key: 'mandragora', label: 'MANDRAGORA' },
];
const NEEDED = { papaver: 3, valeriana: 1, mel: 2 };

// Layout — one rectangle per object, shared by scene() and hotspots().
// Shelf lines and the hearth come from the plate (art/stillroom.webp).
const SHELF_TOP = 272, SHELF_MID = 344, SHELF_LOW = 432;
const R = {
  chart:  { x: 104, y: 282, w: 284, h: 292 },
  spoons: { x: 930, y: 560, w: 210, h: 110 },
  meat:   { x: 1234, y: 70, w: 96, h: 190 },
  board:  { x: 1100, y: 396, w: 120, h: 70 },
  kettle: { x: 540, y: 470, w: 250, h: 230 },
  stair:  { x: 1400, y: 250, w: 190, h: 470 },
  sun5:   { x: 650, y: 418, w: 110, h: 64 },
};
const DIAL = { cx: 566, cy: 378 };
const SUN = { cx: 684, cy: 450 };

export default {
  id: 'stillroom',
  solution: Object.keys(NEEDED).map(k => k[0].toUpperCase() + k.slice(1)),
  lintStates: [{ label: 'recipe whole', flags: { stillroom_leftTaken: true, stillroom_meatTaken: true }, inventory: ['full_recipe', 'meat_shank', 'bent_spoon'] },
    { label: 'lit', flags: { stillroom_hearthLit: true, stillroom_leftTaken: true, stillroom_meatTaken: true, stillroom_brewed: true }, inventory: ['drugged_meat'] }],
  title: 'The Still-Room',
  intro: 'A vaulted cellar under the kitchens: cold hearth, copper kettle, and a wall of labeled jars — the physicker\'s garden, bottled. Rosemary, dust, and under it all a smell you know from the night they arrested you: valerian, like old boots.',

  scene(state) {
    const leftTaken = !!state.flags.stillroom_leftTaken;
    const meatTaken = !!state.flags.stillroom_meatTaken;
    const brewed = !!state.flags.stillroom_brewed;
    const hearthLit = !!state.flags.stillroom_hearthLit;

    // Every prop sits on something the plate paints: jars on the niche shelves
    // (right), the chart pinned to the bare left wall, spoons on the bench rail,
    // the kettle hung in the hearth over the painted cauldron, the dial and the
    // sun-brand on the hood, the bellows on the hearthstone.
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${kitDefs()}
        <radialGradient id="gd_st_hearth" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(255,150,70,0.6)"/>
          <stop offset="0.55" stop-color="rgba(255,150,70,0.2)"/>
          <stop offset="1" stop-color="rgba(255,150,70,0)"/>
        </radialGradient>
        <radialGradient id="gd_st_cold" cx="0.5" cy="0.6" r="0.5">
          <stop offset="0" stop-color="rgba(4,4,6,0.75)"/>
          <stop offset="1" stop-color="rgba(4,4,6,0)"/>
        </radialGradient>
      </defs>

      <!-- background plate (generated): vaulted cellar, hooded hearth, niche shelves, bench, stair -->
      <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="art/stillroom.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="art/stillroom.mp4" type="video/mp4"/></video></foreignObject>

      <!-- jars on the plate's niche shelves: four above, three below -->
      ${JARS.slice(0, 4).map((j, i) => jarSvg(958 + i * 66, SHELF_TOP, j.label)).join('')}
      ${JARS.slice(4).map((j, i) => jarSvg(978 + i * 70, SHELF_MID, j.label)).join('')}

      <!-- the lowest shelf's loose end-board, with a parchment corner behind it -->
      <g data-mount="bracket">
        <rect x="${R.board.x + 8}" y="${SHELF_LOW - 6}" width="${R.board.w - 16}" height="14" rx="2" fill="url(#sk_wood)" stroke="#1c120a" stroke-width="2" transform="rotate(-4 ${R.board.x + R.board.w / 2} ${SHELF_LOW})"/>
        ${leftTaken ? '' : `<path class="beckon" d="M${R.board.x + 30} ${SHELF_LOW - 4} l30 -22 10 20 -30 10 z" fill="#e8d9b0" stroke="#8a7446" stroke-width="1.5"/>`}
      </g>

      <!-- herbal chart, pinned to the bare stone of the left wall -->
      ${panel({ ...R.chart, material: 'parchment', mount: 'nails', tilt: -1.5, body: `
        <g font-family="Palatino Linotype, Georgia, serif" fill="#3b2a12" transform="rotate(-1.5 ${R.chart.x + R.chart.w / 2} ${R.chart.y + R.chart.h / 2})">
          <text x="${R.chart.x + R.chart.w / 2}" y="${R.chart.y + 38}" font-size="19" text-anchor="middle" font-weight="bold">HORTUS SICCUS</text>
          ${['Papaver — the dreaming flower', 'Valeriana — root, foul as old boots', 'Mel — the bees’ gold',
             'Cicuta — hemlock. DEATH.', 'Artemisia — wormwood, bitter', 'Urtica — nettle', 'Mandragora — screams when pulled']
            .map((t, i) => `<text x="${R.chart.x + 18}" y="${R.chart.y + 68 + i * 26}" font-size="13.5">${t}</text>`).join('')}
          <text x="${R.chart.x + 18}" y="${R.chart.y + R.chart.h - 18}" font-size="12.5" font-style="italic">Widdershins: against the sun.</text>
        </g>` })}

      <!-- spoon rail along the bench apron: a 2-notch and a 3-notch spoon, and one empty hook -->
      <g data-mount="bracket">
        <rect x="${R.spoons.x}" y="${R.spoons.y + 10}" width="${R.spoons.w}" height="10" rx="4" fill="url(#sk_iron)" stroke="#111" stroke-width="1.5"/>
        ${[R.spoons.x + 6, R.spoons.x + R.spoons.w - 6].map(bx => `<rect x="${bx - 4}" y="${R.spoons.y + 4}" width="8" height="20" rx="2" fill="#24262c"/>`).join('')}
        ${[[R.spoons.x + 60, 2], [R.spoons.x + 120, 3]].map(([sx, n]) => `
          <g stroke="#a3a393" stroke-width="5" fill="none" stroke-linecap="round">
            <path d="M${sx} ${R.spoons.y + 20} l0 48"/>
            <ellipse cx="${sx}" cy="${R.spoons.y + 82}" rx="9" ry="13"/>
            ${Array.from({ length: n }, (_, k) => `<line x1="${sx - 6}" y1="${R.spoons.y + 34 + k * 8}" x2="${sx + 6}" y2="${R.spoons.y + 34 + k * 8}" stroke-width="2.5"/>`).join('')}
          </g>`).join('')}
        <path d="M${R.spoons.x + 180} ${R.spoons.y + 20} q0 12 8 12" fill="none" stroke="#57432a" stroke-width="4" stroke-linecap="round"/>
      </g>

      <!-- hanging meat shank on a ceiling hook (photoreal, twine included) -->
      ${meatTaken ? `<path d="M${R.meat.x + 46} 0 L${R.meat.x + 46} 60 q0 14 -10 14" fill="none" stroke="#3b3f48" stroke-width="4"/>` : `
      <g class="sway" data-mount="hook">
        <image href="art/st-meat.webp" x="${R.meat.x - 4}" y="0" width="${R.meat.w}" height="246" preserveAspectRatio="xMidYMid meet"/>
      </g>`}

      <!-- the hearth: dark & cold until lit; the kettle hangs from the crane chain inside -->
      <g>
        ${hearthLit ? `
          <ellipse cx="660" cy="640" rx="240" ry="150" fill="url(#gd_st_hearth)" class="glow"/>
          <g class="torch-flame">
            <path d="M620 682 q10 -50 40 -60 q30 10 40 60 z" fill="#ffa94d"/>
            <path d="M638 682 q8 -30 22 -36 q14 6 22 36 z" fill="#ffd9a0"/>
          </g>` : `
          <ellipse cx="664" cy="640" rx="120" ry="70" fill="url(#gd_st_cold)"/>
          <g stroke="#2b2233" stroke-width="8" stroke-linecap="round">
            <line x1="612" y1="684" x2="702" y2="672"/><line x1="636" y1="672" x2="720" y2="686"/>
          </g>`}
        <!-- crane chain from the hood throat to the kettle bail -->
        <line x1="650" y1="472" x2="650" y2="560" stroke="#3b3f48" stroke-width="4" stroke-dasharray="7 4"/>
        <image href="art/st-kettle.webp" x="572" y="548" width="156" height="140" preserveAspectRatio="xMidYMid meet"/>
        ${brewed ? `<g class="float"><path d="M640 560 q6 -18 0 -34 M662 564 q8 -20 2 -38" stroke="rgba(207,224,255,0.5)" stroke-width="4" fill="none" stroke-linecap="round"/></g>` : ''}
      </g>

      <!-- stirring dial: a brass roundel bolted to the hood face, arrow engraved sunwise -->
      <g data-mount="bolts">
        <circle cx="${DIAL.cx}" cy="${DIAL.cy}" r="34" fill="url(#sk_brass)" stroke="#4f3b10" stroke-width="3" filter="url(#sk_drop)"/>
        <path d="M${DIAL.cx} ${DIAL.cy - 22} a22 22 0 1 1 -16 38" fill="none" stroke="#3a2a08" stroke-width="3"/>
        <path d="M${DIAL.cx - 16} ${DIAL.cy + 16} l-8 2 6 -8 z" fill="#3a2a08"/>
        <circle cx="${DIAL.cx}" cy="${DIAL.cy}" r="5" fill="#3a2a08"/>
        ${[[-26, -26], [26, -26], [-26, 26], [26, 26]].map(([dx, dy]) => `<circle cx="${DIAL.cx + dx * 0.9}" cy="${DIAL.cy + dy * 0.9}" r="3" fill="#2a1d05"/>`).join('')}
      </g>

      <!-- sun-mark #5, branded into the hearth lintel -->
      <g class="beckon">
        <circle cx="${SUN.cx}" cy="${SUN.cy}" r="10" fill="none" stroke="#c9a227" stroke-width="2.5"/>
        ${Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return `<line x1="${SUN.cx + Math.cos(a) * 13}" y1="${SUN.cy + Math.sin(a) * 13}"
                        x2="${SUN.cx + Math.cos(a) * 21}" y2="${SUN.cy + Math.sin(a) * 21}"
                        stroke="#c9a227" stroke-width="2.5" stroke-linecap="round"/>`;
        }).join('')}
        <text x="${SUN.cx + 30}" y="${SUN.cy + 7}" font-size="18" fill="#c9a227" font-family="Palatino Linotype, Georgia, serif">A</text>
      </g>

      <!-- bellows, leaning on the hearthstone by the right jamb -->
      ${grounded({ cx: 836, baseY: 722, w: 130, body: `<image href="art/st-bellows.webp" x="764" y="636" width="146" height="96" preserveAspectRatio="xMidYMid meet" transform="rotate(-14 836 684)"/>` })}

      <path d="M0 900 L0 856 Q800 906 1600 856 L1600 900 Z" fill="#05070d"/>
    </svg>`;

    function jarSvg(x, shelfY, label) {
      // Photoreal jar standing on a plate shelf; the load-bearing label stays an SVG overlay.
      return `
      <g data-mount="shelf">
        ${shadow(x + 24, shelfY - 1, 24, 5, 0.6)}
        <image href="art/st-jar.webp" x="${x}" y="${shelfY - 62}" width="48" height="62" preserveAspectRatio="xMidYMid meet"/>
        <rect x="${x - 3}" y="${shelfY - 38}" width="54" height="18" rx="2" fill="#e8d9b0" stroke="#8a7446" stroke-width="0.8"/>
        <text x="${x + 24}" y="${shelfY - 24.5}" font-size="11.5" text-anchor="middle" fill="#3b2a12"${label.length > 6 ? ' textLength="50" lengthAdjust="spacingAndGlyphs"' : ''}
          font-family="Palatino Linotype, Georgia, serif" font-weight="bold">${label}</text>
      </g>`;
    }
  },

  hotspots(state) {
    const spots = [];
    const brewed = !!state.flags.stillroom_brewed;

    spots.push({
      id: 'chart', ...R.chart, label: 'Herbal chart',
      onInteract(game) {
        const html = `<div class="parchment-note"><div class="note-title">Hortus Siccus — the dried garden</div>
          <ul style="line-height:1.9; margin-left: 18px;">
            <li><strong>Papaver</strong> — the dreaming flower</li>
            <li><strong>Valeriana</strong> — a root, foul as old boots</li>
            <li><strong>Mel</strong> — the bees' gold</li>
            <li><strong>Cicuta</strong> — hemlock. <strong style="color:#7a1f2b;">DEATH.</strong></li>
            <li><strong>Artemisia</strong> — wormwood, bitter</li>
            <li><strong>Urtica</strong> — nettle</li>
            <li><strong>Mandragora</strong> — screams when pulled</li>
          </ul>
          <p style="margin-top:8px; font-style:italic;">Margin note: "Widdershins: against the sun."</p></div>`;
        game.journal.add('note_chart', { title: 'Herbal chart (Still-Room)', category: 'note', html });
        game.dialog({ title: 'The Herbal Chart', html });
      },
    });

    spots.push({
      id: 'spoons', ...R.spoons, label: 'Dosing spoons',
      onInteract(game) {
        const html = `<p>A rack of dosing spoons — the physicker's law: <strong>notches are measures</strong>.
          A two-notch spoon and a three-notch spoon hang here. The first hook is <strong>empty</strong>.</p>
          <p style="color:var(--text-dim); font-style:italic;">A one-notch spoon is missing... a worn spoon,
          one notch filed in the bowl. You have seen that spoon. You own that spoon.</p>`;
        game.journal.add('note_spoons', { title: 'The dosing spoons (Still-Room)', category: 'note', html });
        game.dialog({ title: 'The Spoon Rack', html });
      },
    });

    if (!state.flags.stillroom_leftTaken) {
      spots.push({
        id: 'board', ...R.board, label: 'Loose shelf board',
        onInteract(game) {
          game.setFlag('stillroom_leftTaken');
          game.addItem('recipe_left', { from: { x: R.board.x + 50, y: SHELF_LOW - 14 } });
          game.say('Behind the loose board: the left half of a torn recipe, hidden the way you hide something you mean to come back for.');
          game.refreshScene();
        },
      });
    }

    if (!state.flags.stillroom_meatTaken) {
      spots.push({
        id: 'meat', ...R.meat, label: 'Dried meat shank',
        onInteract(game) {
          game.setFlag('stillroom_meatTaken');
          game.addItem('meat_shank', { from: { x: R.meat.x + 48, y: R.meat.y + 90 } });
          game.refreshScene();
        },
      });
    }

    spots.push({
      id: 'sun5', ...R.sun5, label: 'A branded sun',
      onInteract(game) {
        game.journal.add('sun5', { title: 'Still-Room — the hearth lintel', category: 'sun', sun: { rays: 8, letter: 'A' } });
        game.say('Branded into the hearth lintel, right where a brewer\'s eyes would rest: a sun of eight rays, and the letter A.');
      },
    });

    spots.push({
      id: 'kettle', ...R.kettle, label: brewed ? 'The kettle (spent)' : 'Copper kettle',
      onInteract(game) {
        if (brewed) { game.say('The kettle still smells of poppies and honey. Its work is done.'); return; }
        if (!game.hasItem('full_recipe')) {
          if (game.hasItem('recipe_left') && game.hasItem('recipe_right')) {
            game.say('You have two halves of one recipe. In your satchel: hold one half, then click the other.');
          } else {
            game.say('The kettle waits for a recipe you only half own. The right half names measures; the left half must be here somewhere — brewers hide their best pages.');
          }
          return;
        }
        openBrewPuzzle(game);
      },
    });

    spots.push({
      id: 'stair', plate: 'the stone stair', ...R.stair, label: 'Stairs up',
      onInteract(game) {
        if (game.hasItem('drugged_meat')) {
          if (!game.journal.has('sun5')) {
            game.journal.add('sun5', { title: 'Still-Room — the hearth lintel', category: 'sun', sun: { rays: 8, letter: 'A' } });
            game.say('At the stair foot you look back once: branded in the hearth lintel, a sun of eight rays and the letter A. Copied. Meat in hand, you climb toward the growling dark of the Great Hall.');
            game.completeRoom({ delay: 3000 });
            return;
          }
          game.say('Meat in hand, you climb toward the growling dark of the Great Hall.');
          game.completeRoom({ delay: 900 });
        } else if (game.hasItem('sleeping_draught') && game.hasItem('meat_shank')) {
          game.say('From above: a low growl, patient as debt. You have the draught and you have the meat — a wiser combination than climbing empty-handed. Combine them in your satchel.');
        } else {
          game.say('From the top of the stair comes a growl that owns whatever room it lives in. Climbing up with empty hands feels like volunteering.');
        }
      },
    });

    return spots;
  },

  hintContext(state) {
    return (state.flags.stillroom_brewed || !state.inventory.includes('recipe_right') ? 'brew' : (state.inventory.includes('full_recipe') ? 'brew' : 'recipe'));
  },

  hints(state) {
    if (!state.inventory.includes('full_recipe') && !state.flags.stillroom_brewed) {
      return [
        { text: 'You carry half a recipe from Edmund\'s chest. Halves want wholes — and brewers hide their best pages close to the work.', cost: 60 },
        { text: 'Low on the jar shelf, a parchment corner sticks out from behind a loose board. Then: hold one half in your satchel and click the other.', cost: 120 },
        { text: 'Take the left half from behind the shelf board, combine the two halves, then click the kettle.', cost: 240 },
      ];
    }
    return [
      { text: 'Three lists join into one: the recipe\'s riddles, the chart\'s plain glosses, the jar labels. And "widdershins" is defined on the chart — check the dial\'s engraved arrow.', cost: 60 },
      { text: 'Poppy three measures, valerian one, honey two. But look at your spoons: what measures exactly one? You have carried it since your cell. Then stir against the engraved sun-arrow, thrice.', cost: 120 },
      { text: 'Papaver with the 3-notch spoon, Valeriana with your bent 1-notch spoon, Mel with the 2-notch spoon; stir counter-clockwise 3 times; light the hearth; pump until the FIRST whistle, then draw off.', cost: 240 },
    ];
  },
};

/* ---------------- the brewing interface ---------------- */

function openBrewPuzzle(game) {
  // stage: 'mix' -> 'stir' -> 'fire' -> done
  let added = { papaver: 0, valeriana: 0, mel: 0 };
  let stirs = 0;
  let pumps = 0;
  let stage = 'mix';
  let selectedJar = null;

  game.openPuzzle({
    id: 'stillroom_brew',
    title: 'The Copper Kettle',
    wide: true,
    render(body, api) {
      const hasBent = game.hasItem('bent_spoon');

      function mixDone() {
        return added.papaver === 3 && added.valeriana === 1 && added.mel === 2;
      }

      function resetAll(msg) {
        added = { papaver: 0, valeriana: 0, mel: 0 };
        stirs = 0; pumps = 0; stage = 'mix'; selectedJar = null;
        game.playSfx('pour');
        draw();
        api.fail(msg);
      }

      function draw() {
        body.innerHTML = `
          <div class="puzzle-hero" style="background-image:url(art/pz-alchemy.webp)"></div>
          <p class="puzzle-desc">${stage === 'mix'
            ? 'The recipe wants three ingredients in exact measure. Choose a jar, then a spoon. The jars are plentiful — a ruined mix costs only pride.'
            : stage === 'stir'
              ? 'The mix sits heavy and dark. <em>"Stir thrice widdershins."</em> The dial\'s engraved sun-arrow points clockwise — with the sun.'
              : 'The mix has turned pale as moonlight. <em>"Fire beneath, until the kettle sings once — no more."</em>'}</p>

          ${stage === 'mix' ? `
          <div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:center; margin-bottom:14px;">
            ${JARS.map(j => `<button class="tile" data-jar="${j.key}" style="min-width:106px; min-height:52px; ${selectedJar === j.key ? 'border-color: var(--gold-bright); box-shadow: 0 0 14px rgba(232,200,90,0.3);' : ''}">
              <span style="font-size:12px; letter-spacing:0.12em;">${j.label}</span></button>`).join('')}
          </div>
          <div class="puzzle-row">
            ${hasBent ? '<button class="btn" data-spoon="1">Bent spoon &middot; 1 notch</button>' : ''}
            <button class="btn" data-spoon="2">Rack spoon &middot; 2 notches</button>
            <button class="btn" data-spoon="3">Rack spoon &middot; 3 notches</button>
          </div>
          <div class="puzzle-row" style="gap:24px; color:var(--text-dim); font-size:14px;">
            <span>Poppy: <strong style="color:var(--parchment);">${added.papaver}</strong>/3</span>
            <span>Valerian: <strong style="color:var(--parchment);">${added.valeriana}</strong>/1</span>
            <span>Honey: <strong style="color:var(--parchment);">${added.mel}</strong>/2</span>
          </div>
          ${mixDone() ? '<div class="puzzle-row"><button class="btn btn-primary" data-act="tostir">The mix is measured — take the paddle</button></div>' : ''}
          ` : ''}

          ${stage === 'stir' ? `
          <div class="puzzle-row" style="gap:20px;">
            <button class="btn" data-act="cw">Stir with the sun &#8635;</button>
            <button class="btn" data-act="ccw">Stir against the sun &#8634;</button>
          </div>
          <div class="puzzle-row" style="color:var(--text-dim); font-size:14px;">Stirs against the sun: <strong style="color:var(--parchment); margin-left:6px;">${stirs}</strong> / 3</div>
          ` : ''}

          ${stage === 'fire' ? `
          <div class="puzzle-row" style="gap:20px;">
            ${pumps === 0 && !game.getFlag('stillroom_hearthLit') ? '<button class="btn btn-primary" data-act="light">Strike the flint — light the hearth</button>' : `
              <button class="btn" data-act="pump">Pump the bellows</button>
              ${pumps >= 3 ? '<button class="btn btn-primary" data-act="draw">Draw off the draught</button>' : ''}`}
          </div>
          <div class="puzzle-row" style="color:var(--text-dim); font-size:14px; min-height:20px;">
            ${pumps === 0 ? '' : pumps === 1 ? 'The coals take; the copper ticks as it warms.' : pumps === 2 ? 'Steam curls from the spout. Almost.' : '<strong style="color:var(--gold-bright);">The kettle sings — one high clear note.</strong> "...once — no more."'}
          </div>
          ` : ''}

          <div class="puzzle-feedback"></div>`;

        // wire stage controls
        body.querySelectorAll('[data-jar]').forEach(b => b.addEventListener('click', () => {
          selectedJar = b.dataset.jar; game.playSfx('click'); draw();
        }));
        body.querySelectorAll('[data-spoon]').forEach(b => b.addEventListener('click', () => {
          if (!selectedJar) { api.setFeedback('Choose a jar first.', ''); return; }
          const n = Number(b.dataset.spoon);
          if (selectedJar === 'cicuta') {
            resetAll('The hemlock hisses black the instant it touches copper. You pour the ruin away, hands shaking. "That sleep has no waking."');
            return;
          }
          if (!(selectedJar in NEEDED)) {
            resetAll('The mix curdles grey and stinking. Not that jar. You pour it away and begin again.');
            return;
          }
          if (added[selectedJar] + n > NEEDED[selectedJar]) {
            game.playSfx('wrong');
            api.setFeedback('The spoon hovers... too much. The recipe wants finer measure than that.', 'bad');
            return;
          }
          added[selectedJar] += n;
          game.playSfx('pour');
          api.setFeedback('It settles into the mix.', 'good');
          draw();
        }));
        body.querySelectorAll('[data-act]').forEach(b => b.addEventListener('click', () => {
          const act = b.dataset.act;
          if (act === 'tostir') { stage = 'stir'; game.playSfx('click'); draw(); }
          else if (act === 'cw') {
            resetAll('You stir with the sun — the mix seizes like mortar. Widdershins meant the other way. Pour, and begin again.');
          }
          else if (act === 'ccw') {
            stirs += 1; game.playSfx('pour');
            if (stirs === 3) { stage = 'fire'; draw(); }
            else if (stirs > 3) { resetAll('One stir too many — it curdles. Thrice means thrice.'); }
            else draw();
          }
          else if (act === 'light') {
            if (!game.hasItem('flint_steel')) { api.setFeedback('You have nothing to strike fire with.', 'bad'); return; }
            game.setFlag('stillroom_hearthLit');
            game.playSfx('stone');
            pumps = 0; draw();
            api.setFeedback('Sparks catch in the kindling. Now: air.', 'good');
            game.refreshScene();
          }
          else if (act === 'pump') {
            pumps += 1;
            game.playSfx('click');
            if (pumps === 3) game.playBell(1568); // the kettle sings — G6
            if (pumps > 3) {
              resetAll('You pump again past the song — the draught boils over and scorches. "Once — no more," it said. Begin again.');
              return;
            }
            draw();
          }
          else if (act === 'draw') {
            game.setFlag('stillroom_brewed');
            game.addItem('sleeping_draught', { silent: true });
            api.solved({ message: 'You draw off a flask of something pale as moonlight, smelling of poppies and honey. The Draught of Deep Sleep — brewed right on the first singing.' });
            game.refreshScene();
          }
        }));
      }

      draw();
    },
  });
}
