// ROOM 5 — The Still-Room.
// Puzzle: brew the Draught of Deep Sleep. Papaver x3, Valeriana x1 (the bent
// one-notch spoon from Room 1), Mel x2; stir widdershins (counter-clockwise,
// the dial's sun-arrow points clockwise) exactly 3 times; light the hearth;
// bellows until the kettle sings ONCE, then draw off.

import { registerItems, registerCombos } from '../../../shared/js/items.js';

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

export default {
  id: 'stillroom',
  title: 'The Still-Room',
  intro: 'A vaulted cellar under the kitchens: cold hearth, copper kettle, and a wall of labeled jars — the physicker\'s garden, bottled. Rosemary, dust, and under it all a smell you know from the night they arrested you: valerian, like old boots.',

  scene(state) {
    const leftTaken = !!state.flags.stillroom_leftTaken;
    const meatTaken = !!state.flags.stillroom_meatTaken;
    const brewed = !!state.flags.stillroom_brewed;
    const hearthLit = !!state.flags.stillroom_hearthLit;

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gd_st_wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#171420"/>
          <stop offset="1" stop-color="#262030"/>
        </linearGradient>
        <radialGradient id="gd_st_hearth" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(255,150,70,0.55)"/>
          <stop offset="0.55" stop-color="rgba(255,150,70,0.18)"/>
          <stop offset="1" stop-color="rgba(255,150,70,0)"/>
        </radialGradient>
      </defs>

      <rect width="1600" height="640" fill="url(#gd_st_wall)"/>
      <!-- vault ribs -->
      <g stroke="#0e0b15" stroke-width="26" fill="none" opacity="0.9">
        <path d="M0 240 Q400 60 800 240"/>
        <path d="M800 240 Q1200 60 1600 240"/>
      </g>
      <g stroke="#332b40" stroke-width="8" fill="none">
        <path d="M0 240 Q400 60 800 240"/>
        <path d="M800 240 Q1200 60 1600 240"/>
      </g>
      <rect y="640" width="1600" height="260" fill="#141019"/>
      <g stroke="#0a0810" stroke-width="4" opacity="0.7">
        ${[690, 760, 835].map(y => `<line x1="0" y1="${y}" x2="1600" y2="${y}"/>`).join('')}
      </g>

      <!-- jar shelf -->
      <g>
        <rect x="120" y="300" width="620" height="14" rx="4" fill="#38290f"/>
        <rect x="120" y="440" width="620" height="14" rx="4" fill="#38290f"/>
        ${JARS.slice(0, 4).map((j, i) => jarSvg(150 + i * 150, 300, j.label)).join('')}
        ${JARS.slice(4).map((j, i) => jarSvg(200 + i * 160, 440, j.label)).join('')}
        ${leftTaken ? '' : `
        <g class="beckon">
          <path d="M700 470 l34 -8 4 26 -30 6 z" fill="#e8d9b0" transform="rotate(8 718 480)"/>
        </g>`}
      </g>

      <!-- herbal chart -->
      <g class="sway slow">
        <rect x="880" y="180" width="300" height="290" rx="6" fill="#d9c493" transform="rotate(1.5 1030 325)"/>
        <g transform="rotate(1.5 1030 325)" font-family="Palatino Linotype, Georgia, serif" fill="#4a3a1c">
          <text x="1030" y="215" font-size="20" text-anchor="middle" font-weight="bold">HORTUS SICCUS</text>
          ${['Papaver — the dreaming flower', 'Valeriana — root, foul as old boots', 'Mel — the bees’ gold',
             'Cicuta — hemlock. DEATH.', 'Artemisia — wormwood, bitter', 'Urtica — nettle', 'Mandragora — screams when pulled']
            .map((t, i) => `<text x="900" y="${248 + i * 26}" font-size="14.5">${t}</text>`).join('')}
          <text x="900" y="446" font-size="13.5" font-style="italic">Widdershins: against the sun.</text>
        </g>
      </g>

      <!-- spoon rack: 2- and 3-notch, one empty hook -->
      <g>
        <rect x="1250" y="200" width="200" height="14" rx="4" fill="#38290f"/>
        <g stroke="#9a9a8a" stroke-width="5" fill="none" stroke-linecap="round">
          <path d="M1285 214 l0 60 m0 0 q-12 16 0 30 m-8 -46 l16 0 m-14 10 l12 0"/>
          <path d="M1355 214 l0 60 m0 0 q-12 16 0 30 m-8 -46 l16 0 m-14 8 l12 0 m-13 8 l14 0"/>
        </g>
        <circle cx="1420" cy="222" r="5" fill="#57432a"/>
        <text x="1420" y="266" font-size="13" fill="#8b8878" text-anchor="middle" font-style="italic"
          font-family="Palatino Linotype, Georgia, serif">an empty hook</text>
      </g>

      <!-- hanging meat shank -->
      ${meatTaken ? '' : `
      <g class="sway">
        <line x1="1310" y1="60" x2="1310" y2="140" stroke="#565b6c" stroke-width="5"/>
        <path d="M1310 140 q-8 -12 6 -14" fill="none" stroke="#9a9a8a" stroke-width="5"/>
        <path d="M1290 190 Q1284 160 1306 148 Q1330 136 1338 156 Q1344 172 1322 180 Q1302 188 1302 200 Z" fill="#8a4a3c"/>
      </g>`}

      <!-- hearth + kettle + bellows + mantel -->
      <g>
        <rect x="360" y="560" width="560" height="30" rx="6" fill="#3a3e4f"/>
        <path d="M400 590 L400 470 Q640 420 880 470 L880 590 Z" fill="#100d16"/>
        ${hearthLit ? `
          <ellipse cx="640" cy="560" rx="300" ry="160" fill="url(#gd_st_hearth)" class="glow"/>
          <g class="torch-flame">
            <path d="M600 585 q10 -50 40 -60 q30 10 40 60 z" fill="#ffa94d"/>
            <path d="M618 585 q8 -30 22 -36 q14 6 22 36 z" fill="#ffd9a0"/>
          </g>` : `
          <g stroke="#2b2233" stroke-width="8" stroke-linecap="round">
            <line x1="580" y1="580" x2="700" y2="566"/><line x1="620" y1="566" x2="720" y2="582"/>
          </g>`}
        <!-- kettle -->
        <path d="M560 470 Q560 380 660 380 Q760 380 760 470 L744 520 L576 520 Z" fill="#7a5a3c" stroke="#4a3520" stroke-width="4"/>
        <path d="M660 380 q0 -26 24 -30" fill="none" stroke="#4a3520" stroke-width="8" stroke-linecap="round"/>
        <path d="M756 430 q36 -6 40 -34" fill="none" stroke="#7a5a3c" stroke-width="12" stroke-linecap="round"/>
        <!-- stir dial with sun-arrow (clockwise) -->
        <circle cx="660" cy="452" r="26" fill="#4a3520"/>
        <circle cx="660" cy="452" r="26" fill="none" stroke="#c9a227" stroke-width="3"/>
        <path d="M660 430 a22 22 0 1 1 -16 38" fill="none" stroke="#c9a227" stroke-width="3"/>
        <path d="M644 468 l-8 2 6 -8 z" fill="#c9a227"/>
        <circle cx="660" cy="452" r="5" fill="#c9a227"/>
        <!-- bellows -->
        <g transform="translate(880 520) rotate(-18)">
          <path d="M0 0 L90 -14 L96 14 L10 24 Z" fill="#6b5330"/>
          <path d="M90 -14 L130 -2 L96 14 Z" fill="#4a3520"/>
          <line x1="10" y1="24" x2="-18" y2="42" stroke="#38290f" stroke-width="8" stroke-linecap="round"/>
        </g>
        <!-- mantel beam with sun-mark #5 -->
        <rect x="380" y="420" width="520" height="30" rx="4" fill="#38290f"/>
        <g class="beckon">
          <circle cx="640" cy="435" r="10" fill="none" stroke="#c9a227" stroke-width="2.5"/>
          ${Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return `<line x1="${640 + Math.cos(a) * 13}" y1="${435 + Math.sin(a) * 13}"
                          x2="${640 + Math.cos(a) * 21}" y2="${435 + Math.sin(a) * 21}"
                          stroke="#c9a227" stroke-width="2.5" stroke-linecap="round"/>`;
          }).join('')}
          <text x="672" y="443" font-size="18" fill="#c9a227" font-family="Palatino Linotype, Georgia, serif">A</text>
        </g>
        ${brewed ? `<g class="float"><path d="M640 340 q6 -18 0 -34 M660 344 q8 -20 2 -38" stroke="rgba(207,224,255,0.5)" stroke-width="4" fill="none" stroke-linecap="round"/></g>` : ''}
      </g>

      <!-- stair up to the great hall -->
      <g>
        <path d="M1460 640 L1600 640 L1600 300 L1520 300 L1520 380 L1490 380 L1490 460 L1460 460 Z" fill="#0c0912"/>
        <path d="M1460 640 L1460 460 L1490 460 L1490 380 L1520 380 L1520 300 L1600 300" fill="none" stroke="#3a3e4f" stroke-width="6"/>
      </g>

      <path d="M0 900 L0 856 Q800 906 1600 856 L1600 900 Z" fill="#05070d"/>
    </svg>`;

    function jarSvg(x, shelfY, label) {
      return `
      <g>
        <path d="M${x} ${shelfY - 8} q-14 -10 -14 -34 q0 -30 32 -30 q32 0 32 30 q0 24 -14 34 z" fill="#8a7a5c"/>
        <rect x="${x - 10}" y="${shelfY - 78}" width="56" height="12" rx="4" fill="#6b5c40"/>
        <rect x="${x - 8}" y="${shelfY - 44}" width="52" height="18" rx="3" fill="#e8d9b0"/>
        <text x="${x + 18}" y="${shelfY - 31}" font-size="10.5" text-anchor="middle" fill="#4a3a1c"
          font-family="Palatino Linotype, Georgia, serif" font-weight="bold">${label}</text>
      </g>`;
    }
  },

  hotspots(state) {
    const spots = [];
    const brewed = !!state.flags.stillroom_brewed;

    spots.push({
      id: 'chart', x: 870, y: 170, w: 320, h: 310, label: 'Herbal chart',
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
      id: 'spoons', x: 1240, y: 190, w: 220, h: 130, label: 'Dosing spoons',
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
        id: 'board', x: 680, y: 440, w: 90, h: 70, label: 'Loose shelf board',
        onInteract(game) {
          game.setFlag('stillroom_leftTaken');
          game.addItem('recipe_left', { from: { x: 718, y: 480 } });
          game.say('Behind the loose board: the left half of a torn recipe, hidden the way you hide something you mean to come back for.');
          game.refreshScene();
        },
      });
    }

    if (!state.flags.stillroom_meatTaken) {
      spots.push({
        id: 'meat', x: 1260, y: 120, w: 110, h: 100, label: 'Dried meat shank',
        onInteract(game) {
          game.setFlag('stillroom_meatTaken');
          game.addItem('meat_shank', { from: { x: 1310, y: 170 } });
          game.refreshScene();
        },
      });
    }

    spots.push({
      id: 'sun5', x: 600, y: 405, w: 110, h: 60, label: 'A branded sun',
      onInteract(game) {
        game.journal.add('sun5', { title: 'Still-Room — the hearth mantel', category: 'sun', sun: { rays: 8, letter: 'A' } });
        game.say('Branded into the mantel beam, right where a brewer\'s eyes would rest: a sun of eight rays, and the letter A.');
      },
    });

    spots.push({
      id: 'kettle', x: 480, y: 370, w: 330, h: 220, label: brewed ? 'The kettle (spent)' : 'Copper kettle',
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
      id: 'stair', x: 1450, y: 300, w: 150, h: 340, label: 'Stairs up',
      onInteract(game) {
        if (game.hasItem('drugged_meat')) {
          if (!game.journal.has('sun5')) {
            game.say('"Mark each sun along the road." A brand on the hearth mantel is still unsketched — right where a brewer\'s eyes would rest.');
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
