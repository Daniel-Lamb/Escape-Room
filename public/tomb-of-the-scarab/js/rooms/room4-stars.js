// ROOM 4 — The Star Chamber (the ceiling of Nut).
// Puzzle: the star-dial carries TWO bright stars of equal size. The inscription
// says Sopdet "rises after Sah, the three who walk together": Sah is the tight
// row of three small stars, and Sopdet is the bright star right beside them
// (the decoy sits far round the ring). Turn until she stands under the eastern
// mark (rotation 3). Bringing the decoy bright star up (rotation 6) fails.
// Reward: amulet (star sign, K, 3 beads).

import { kitDefs, panel, shadow, wallDoor, plateHero } from '../../../shared/js/scenekit.js';

const SAH = 2;      // slot of Sah's three-star belt
const BRIGHT = 3;   // slot of Sopdet (rises right after Sah)
const DECOY = 6;    // the other bright star — not Sopdet
const SLOTS = 8;

function aligned(state) { return !!state.flags.stars_aligned; }

function brightStar() {
  return `<circle cx="0" cy="0" r="24" fill="rgba(232,200,90,0.26)"/>
    <circle cx="0" cy="0" r="9" fill="#f2d774"/>
    ${[0, 1, 2, 3].map(k => { const a = k * Math.PI / 2; return `<line x1="${Math.cos(a) * 6}" y1="${Math.sin(a) * 6}" x2="${Math.cos(a) * 18}" y2="${Math.sin(a) * 18}" stroke="#f2d774" stroke-width="3" stroke-linecap="round"/>`; }).join('')}`;
}

// one slot's star(s), at screen-angle for the given rotation, on a circle radius R
function starAt(i, r, R, cx, cy) {
  const ang = ((i - r) / SLOTS) * Math.PI * 2 - Math.PI / 2;
  const x = cx + Math.cos(ang) * R, y = cy + Math.sin(ang) * R;
  if (i === BRIGHT || i === DECOY) return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">${brightStar()}</g>`;
  if (i === SAH) {
    // three small stars in a tight row, along the ring
    const t = ang + Math.PI / 2;
    return [-1, 0, 1].map(k => `<circle cx="${(x + Math.cos(t) * k * 13).toFixed(1)}" cy="${(y + Math.sin(t) * k * 13).toFixed(1)}" r="4.5" fill="#cfe0f2"/>`).join('');
  }
  return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="#8fb4d8"/>`;
}

// Layout — the plate (art/stars.webp): Nut arches across the vault, painted
// side walls with candles, an arched back wall. The dial is set into the back
// wall; the way on is a slab in the right wall.
const DIAL = { cx: 810, cy: 512, R: 150 };
const CARVE = { x: 70, y: 600, w: 470, h: 120 };
const DOOR = { x1: 1384, y1: 450, h1: 240, x2: 1500, y2: 410, h2: 330 };

export default {
  id: 'stars',
  solution: `${['no', 'once', 'twice', 'three times', 'four times', 'five times', 'six times'][BRIGHT]} anticlockwise`,
  title: 'The Star Chamber',
  intro: 'The ceiling arches into the body of Nut, goddess of the sky, swallowing the stars each dusk to birth them at dawn. Set into the far wall turns a great bronze star-dial, and a single notch is cut into its eastern rim — a mark for one star, and one star only, to fill.',
  lintStates: [{ label: 'aligned', flags: { stars_aligned: true } }],

  scene(state) {
    const done = aligned(state);
    const amuletHere = done && !state.journal?.some?.(e => e.id === 'amulet_stars');
    const r = done ? BRIGHT : (state.flags.stars_r ?? 0);
    const D = DIAL;
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${kitDefs()}
        <radialGradient id="gd_st_dawn" cx="0.5" cy="0" r="0.7">
          <stop offset="0" stop-color="rgba(255,178,77,0.35)"/><stop offset="1" stop-color="rgba(255,178,77,0)"/>
        </radialGradient>
      </defs>
      <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="art/stars.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="art/stars.mp4" type="video/mp4"/></video></foreignObject>
      ${done ? '<rect x="0" y="0" width="1600" height="900" fill="url(#gd_st_dawn)" class="glow" data-fx="dawn"/>' : ''}

      <!-- the star-dial, a bronze disc set into the back wall -->
      <g data-mount="inset">
        <circle cx="${D.cx}" cy="${D.cy}" r="${D.R + 34}" fill="#000" opacity="0.5"/>
        <circle cx="${D.cx}" cy="${D.cy}" r="${D.R + 26}" fill="#0d1526" stroke="#8a6a15" stroke-width="6"/>
        <circle cx="${D.cx}" cy="${D.cy}" r="${D.R + 8}" fill="none" stroke="#3a2a12" stroke-width="2"/>
        <path d="M${D.cx} ${D.cy - D.R - 22} l-18 -30 l36 0 z" fill="#f2d774"/>
        ${Array.from({ length: SLOTS }, (_, i) => starAt(i, r, D.R, D.cx, D.cy)).join('')}
        <circle cx="${D.cx}" cy="${D.cy}" r="16" fill="#8a6a15"/>
        ${amuletHere ? `<g class="beckon" transform="translate(${D.cx} ${D.cy})"><ellipse cx="0" cy="0" rx="20" ry="26" fill="#2f6fb0" stroke="#f2d774" stroke-width="3"/><circle cx="0" cy="-30" r="8" fill="#f2d774"/></g>` : ''}
      </g>

      <!-- the inscription, cut into the painted left wall -->
      ${panel({ ...CARVE, material: 'sandstone', mount: 'inset', rx: 4, body: `
        <g font-family="var(--serif, Georgia, serif)" fill="#2e2210" font-style="italic" font-size="18">
          <text x="${CARVE.x + 16}" y="${CARVE.y + 32}">"Sopdet rises after Sah, the three who</text>
          <text x="${CARVE.x + 16}" y="${CARVE.y + 60}">walk together. When she stands beneath</text>
          <text x="${CARVE.x + 16}" y="${CARVE.y + 88}">the eastern mark, the way will open."</text>
        </g>` })}

      <!-- the way on: a stone slab in the right wall -->
      ${wallDoor({ ...DOOR, material: 'stone', open: done })}

      <path d="M0 900 L0 866 Q800 894 1600 866 L1600 900 Z" fill="#050301"/>
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const done = aligned(state);
    spots.push({ id: 'inscription', ...CARVE, label: 'The inscription',
      onInteract(game) {
        game.journal.add('note_stars', { title: 'The Star Chamber', category: 'note',
          html: '<p>"Sopdet rises after Sah, the three who walk together. When she stands beneath the eastern mark, the way will open."</p><p>Two stars on the dial shine equally bright. Only one of them keeps company with Sah\'s three.</p>' });
        game.say('"Sopdet rises after Sah, the three who walk together." Two bright stars on the dial — and only one follows the three. Copied to your palette.');
      } });
    spots.push({ id: 'nut', x: 400, y: 40, w: 800, h: 220, label: 'Nut, the sky',
      onInteract(game) { game.say('Nut arches overhead, star-swallower and star-mother. She births the sun each dawn from her mouth — the very trick you are trying to copy.'); } });

    if (!done) {
      spots.push({ id: 'dial', x: DIAL.cx - DIAL.R - 40, y: DIAL.cy - DIAL.R - 60, w: (DIAL.R + 40) * 2, h: (DIAL.R + 40) * 2 + 20, label: 'The bronze star-dial',
        onInteract(game) { openDial(game); } });
      spots.push({ id: 'slab', x: DOOR.x1, y: DOOR.y2, w: DOOR.x2 - DOOR.x1, h: DOOR.h2, label: 'A sealed slab',
        onInteract(game) { game.say('A slab of the same stone as the wall, fitted so close you could not slide a reed into the seam. The dial, surely, is its latch.'); } });
    } else {
      if (!(state.journal || []).some(e => e.id === 'amulet_stars')) {
        spots.push({ id: 'amulet', x: DIAL.cx - 60, y: DIAL.cy - 55, w: 120, h: 110, label: 'An amulet at the hub',
          onInteract(game) {
            game.journal.add('amulet_stars', { title: 'Amulet of the Stars', category: 'sun', sign: 'star', sun: { rays: 3, letter: 'K' } });
            game.say('Aligned, the dial\'s hub sprang open. Inside: an amulet with a star on its back, three beads, and the letter K.');
            game.refreshScene();
          } });
      }
      spots.push({ id: 'exit', x: DOOR.x1, y: DOOR.y2, w: DOOR.x2 - DOOR.x1, h: DOOR.h2, label: 'The passage on',
        onInteract(game) {
          if (!game.journal.has('amulet_stars')) {
            game.journal.add('amulet_stars', { title: 'Amulet of the Stars', category: 'sun', sign: 'star', sun: { rays: 3, letter: 'K' } });
            game.say('You lift the amulet from the dial\'s open hub as you go: a star on its back, three beads, the letter K.');
            game.completeRoom({ delay: 3000 });
            return;
          }
          game.completeRoom({ delay: 600 });
        } });
    }
    return spots;
  },

  hints: [
    { text: 'Two stars on the dial are equally bright. The inscription tells you which one is Sopdet — by who she follows.', cost: 60 },
    { text: 'Sah is the three small stars in a tight row. Sopdet is the bright star right beside them — the other bright star stands far off round the ring. Bring HER to the eastern mark.', cost: 120 },
    { text: 'From the start, turn the dial three times anticlockwise (↺): Sopdet, beside Sah\'s three stars, stands under the mark.', cost: 240 },
  ],
};

function openDial(game) {
  let r = game.getFlag('stars_r') ?? 0;
  const R = 120, cx = 170, cy = 150;
  game.openPuzzle({
    id: 'stars_dial',
    title: 'The Star-Dial',
    render(body, api) {
      body.innerHTML = `
        ${plateHero('art/stars.webp', { x: DIAL.cx, y: DIAL.cy })}
        <p class="puzzle-desc">Turn the heavens until <em>Sopdet</em> stands beneath the eastern mark. <em>"Sopdet rises after Sah, the three who walk together."</em></p>
        <div class="puzzle-row"><div id="st-dial"></div></div>
        <div class="puzzle-row">
          <button class="btn btn-ghost" id="st-ccw">&#8634; turn</button>
          <button class="btn btn-ghost" id="st-cw">turn &#8635;</button>
        </div>
        <div class="puzzle-row"><button class="btn btn-primary" id="st-try">Read the Sky</button></div>
        <div class="puzzle-feedback"></div>`;
      const holder = body.querySelector('#st-dial');
      const draw = () => {
        holder.innerHTML = `
          <svg viewBox="0 0 340 300" width="320" height="282" xmlns="http://www.w3.org/2000/svg">
            <circle cx="${cx}" cy="${cy}" r="${R + 22}" fill="#0d1526" stroke="#8a6a15" stroke-width="4"/>
            <path d="M${cx} ${cy - R - 20} l-16 -26 l32 0 z" fill="#f2d774"/>
            ${Array.from({ length: SLOTS }, (_, i) => starAt(i, r, R, cx, cy)).join('')}
            <circle cx="${cx}" cy="${cy}" r="12" fill="#8a6a15"/>
          </svg>`;
      };
      draw();
      const turn = (d) => { r = (r + d + SLOTS) % SLOTS; game.setFlag('stars_r', r); game.playSfx('click'); draw(); };
      // the arrows turn the dial the way they point
      body.querySelector('#st-cw').addEventListener('click', () => turn(-1));
      body.querySelector('#st-ccw').addEventListener('click', () => turn(1));
      body.querySelector('#st-try').addEventListener('click', () => {
        if (r === BRIGHT) {
          game.setFlag('stars_aligned');
          game.playSfx('unlock');
          api.solved({ message: 'Sopdet climbs to the mark, close on the heels of Sah, and a shaft of dawn-grey light falls through the ceiling onto the dial\'s hub, which clicks open. In the right wall, a slab sighs back.' });
          game.refreshScene();
        } else if (r === DECOY) {
          api.fail('A bright star stands at the mark — but not the one that follows the three. The sky stays shut.');
        } else {
          api.fail('No bright star sits on the mark. Keep turning.');
        }
      });
    },
  });
}
