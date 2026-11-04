// ROOM 4 — The Star Chamber (the ceiling of Nut).
// Puzzle: rotate the star-dial so Sopdet, the Dog Star (drawn large and bright),
// stands under the fixed eastern mark at the top. Aligned when rotation == 3.
// Reward: amulet (K, 3 beads).

const BRIGHT = 3;   // slot index of Sopdet
const SLOTS = 8;

function aligned(state) { return !!state.flags.stars_aligned; }

// one slot's star, at screen-angle for the given rotation, on a circle radius R
function starAt(i, r, R, cx, cy) {
  const ang = ((i - r) / SLOTS) * Math.PI * 2 - Math.PI / 2;
  const x = cx + Math.cos(ang) * R, y = cy + Math.sin(ang) * R;
  if (i === BRIGHT) {
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">
      <circle cx="0" cy="0" r="26" fill="rgba(232,200,90,0.28)"/>
      <circle cx="0" cy="0" r="9" fill="#f2d774"/>
      ${[0, 1, 2, 3].map(k => { const a = k * Math.PI / 2; return `<line x1="${Math.cos(a) * 6}" y1="${Math.sin(a) * 6}" x2="${Math.cos(a) * 18}" y2="${Math.sin(a) * 18}" stroke="#f2d774" stroke-width="3" stroke-linecap="round"/>`; }).join('')}
    </g>`;
  }
  return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="#8fb4d8"/>`;
}

export default {
  id: 'stars',
  title: 'The Star Chamber',
  intro: 'The ceiling arches into the body of Nut, goddess of the sky, swallowing the stars each dusk to birth them at dawn. Below her turns a great bronze star-dial, and a single notch is cut into the eastern rim — a mark for one star, and one star only, to fill.',

  scene(state) {
    const done = aligned(state);
    const amuletHere = done && !state.journal?.some?.(e => e.id === 'amulet_stars');
    const r = done ? BRIGHT : (state.flags.stars_r ?? 0);
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gd_st_sky" cx="0.5" cy="0.3" r="0.8">
          <stop offset="0" stop-color="#16223a"/><stop offset="1" stop-color="#0a0d18"/>
        </radialGradient>
        <radialGradient id="gd_st_dawn" cx="0.5" cy="0" r="0.7">
          <stop offset="0" stop-color="rgba(255,178,77,0.35)"/><stop offset="1" stop-color="rgba(255,178,77,0)"/>
        </radialGradient>
      </defs>
      <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="art/stars.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="art/stars.mp4" type="video/mp4"/></video></foreignObject>
      ${done ? '<rect x="0" y="0" width="1600" height="900" fill="url(#gd_st_dawn)" class="glow"/>' : ''}

      <!-- scattered ceiling stars -->
      ${[[200, 120], [420, 80], [900, 110], [1200, 90], [1420, 180], [120, 300], [1500, 380]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5" fill="#8fb4d8" opacity="0.8"/>`).join('')}

      <!-- the star-dial -->
      <g>
        <circle cx="820" cy="430" r="230" fill="#0d1526" stroke="#8a6a15" stroke-width="6"/>
        <circle cx="820" cy="430" r="210" fill="none" stroke="#3a2a12" stroke-width="2"/>
        <!-- fixed eastern mark at top -->
        <path d="M820 176 l-22 -40 l44 0 z" fill="#f2d774"/>
        <text x="820" y="120" text-anchor="middle" font-size="15" fill="#d4a72a" font-family="var(--serif, Georgia, serif)">the eastern mark</text>
        <!-- the stars on the ring -->
        ${Array.from({ length: SLOTS }, (_, i) => starAt(i, r, 205, 820, 430)).join('')}
        <circle cx="820" cy="430" r="16" fill="#8a6a15"/>
      </g>

      <!-- inscription -->
      <g font-family="var(--serif, Georgia, serif)" fill="#efe0b8">
        <text x="120" y="700" font-size="22" font-style="italic">"The way opens when the Dog Star, Sopdet,</text>
        <text x="120" y="730" font-size="22" font-style="italic">stands beneath the eastern mark."</text>
      </g>

      ${amuletHere ? `<g class="beckon" transform="translate(820 430)">
        <ellipse cx="0" cy="0" rx="22" ry="28" fill="#2f6fb0" stroke="#f2d774" stroke-width="3"/><line x1="0" y1="-26" x2="0" y2="26" stroke="#f2d774" stroke-width="2"/><circle cx="0" cy="-32" r="9" fill="#f2d774"/>
      </g>` : ''}

      <path d="M0 900 L0 866 Q800 894 1600 866 L1600 900 Z" fill="#050301"/>
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const done = aligned(state);
    spots.push({ id: 'inscription', x: 110, y: 670, w: 700, h: 80, label: 'The inscription',
      onInteract(game) {
        game.journal.add('note_stars', { title: 'The Star Chamber', category: 'note',
          html: '<p>"The way opens when the Dog Star, Sopdet, stands beneath the eastern mark." Sopdet is the brightest star on the dial.</p>' });
        game.say('"The way opens when the Dog Star, Sopdet, stands beneath the eastern mark." Sopdet is the one star that outshines the rest.');
      } });
    spots.push({ id: 'nut', x: 600, y: 20, w: 400, h: 120, label: 'Nut, the sky',
      onInteract(game) { game.say('Nut arches overhead, star-swallower and star-mother. She births the sun each dawn from her mouth — the very trick you are trying to copy.'); } });

    if (!done) {
      spots.push({ id: 'dial', x: 590, y: 210, w: 460, h: 440, label: 'The bronze star-dial',
        onInteract(game) { openDial(game); } });
    } else {
      if (!(state.journal || []).some(e => e.id === 'amulet_stars')) {
        spots.push({ id: 'amulet', x: 760, y: 380, w: 120, h: 110, label: 'An amulet at the hub',
          onInteract(game) {
            game.journal.add('amulet_stars', { title: 'Amulet of the Stars', category: 'sun', sun: { rays: 3, letter: 'K' } });
            game.say('Aligned, the dial\'s hub sprang open. Inside: an amulet with three beads, and the letter K.');
            game.refreshScene();
          } });
      }
      spots.push({ id: 'exit', x: 60, y: 300, w: 200, h: 420, label: 'The passage on',
        onInteract(game) {
          if (!game.journal.has('amulet_stars')) { game.say('The dial\'s hub has opened — take the amulet before you go.'); return; }
          game.completeRoom({ delay: 600 });
        } });
    }
    return spots;
  },

  hints: [
    { text: 'One star on the dial is far brighter and larger than the others — that is Sopdet, the Dog Star.', cost: 60 },
    { text: 'Turn the dial until that brightest star sits directly under the golden mark at the top.', cost: 120 },
    { text: 'Rotate the dial so Sopdet climbs to the very top notch, then read the sky. Three turns clockwise from the start.', cost: 240 },
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
        <p class="puzzle-desc">Turn the heavens until <em>Sopdet</em>, the bright Dog Star, stands beneath the eastern mark at the top.</p>
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
      body.querySelector('#st-cw').addEventListener('click', () => turn(1));
      body.querySelector('#st-ccw').addEventListener('click', () => turn(-1));
      body.querySelector('#st-try').addEventListener('click', () => {
        if (r === BRIGHT) {
          game.setFlag('stars_aligned');
          game.playSfx('unlock');
          api.solved({ message: 'Sopdet climbs to the mark, and a shaft of dawn-grey light falls straight through the ceiling onto the dial\'s hub, which clicks open.' });
          game.refreshScene();
        } else {
          api.fail('The bright star sits off the mark. Keep turning.');
        }
      });
    },
  });
}
