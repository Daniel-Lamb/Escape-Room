// SCENE 7 — The Lantern Crown (finale + META).
// Each bearing-mark is a compass plate whose needle points one way round the
// rose. Sweep the beam sunwise from north and read the letters as it passes:
// N:A  NE:S  E:H  SE:O  S:R  SW:E  -> ASHORE. Each keeper's log holds only three
// marks — West: S,O,E ; East: A,H,R — so the word needs both journals.

import { getRole, isWest, towerName } from '../role.js';
import { defs, backdrop, rainOutside, interior, beam, bearingOf, compassPlate, towerTag } from '../scenekit.js';
import { dock, DOCK, panel, shadow } from '../../../shared/js/scenekit.js';

const SLUG = 'crown';
const ANSWER = 'ASHORE';

// The crown: glazing all round (the false light and the Meridian are seen only
// through it), the great lamp on its pedestal, the plaque on the wall below the
// glass, and the beam-training wheel on its post. The marks are in the signal book.
const FLOOR = 760;
const LAMP = { cx: 470, cy: 300 };
const PLAQUE = { x: 1040, y: 640, w: 420, h: 100 };
const WHEEL = { cx: 800, cy: 700 };
const WHEEL_SPOT = { x: 712, y: 612, w: 176, h: 176 };

function won(state) { return !!state.flags.lanterncrown_set; }

export default {
  id: 'lanterncrown',
  get title() { return `${towerName()} · The Lantern Crown`; },
  get intro() {
    return 'The top of the tower, the beam alive at last — but out on the middle headland a false light burns red, dragging the Meridian toward the rocks. Only the true bearing, set on both towers at once, can drown it. Sweep the beam round your six compass-marks and set the word they spell — and you hold only three of them.';
  },

  scene(state) {
    const done = won(state);
    // this keeper's own three marks (from the log)
    const mine = state.journal.filter(e => e.category === 'sun').sort((a, b) => a.sun.rays - b.sun.rays);

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}</defs>
      ${backdrop(SLUG)}
      ${interior(SLUG, { window: { x: 110, y: 90, w: 1380, h: 540, shape: 'band' }, floorY: FLOOR, panes: 6 })}

      <g clip-path="url(#${SLUG}_win)">
        <!-- the false light on the middle headland -->
        <path d="M720 470 q80 -26 160 0 l0 90 -160 0 z" fill="#141c26" opacity="0.85"/>
        ${done
          ? `<circle cx="800" cy="470" r="10" fill="#3a4656"/><text x="800" y="540" text-anchor="middle" font-size="14" fill="#7f8a99" font-family="Consolas, monospace">the false light drowns</text>`
          : `<circle cx="800" cy="470" r="12" fill="#e05252" class="flicker"/>
             <circle cx="800" cy="470" r="34" fill="rgba(224,82,82,0.28)" class="glow"/>
             <text x="800" y="584" text-anchor="middle" font-size="14" fill="#ff8f8f" font-family="Consolas, monospace">FALSE LIGHT — wreckers</text>`}
        <!-- the Meridian, making for the channel -->
        <path d="M1120 560 q80 -22 200 0 l-22 40 q-90 16 -170 0 z" fill="#1c2431" stroke="#3a4656" stroke-width="4"/>
        <rect x="1210" y="500" width="12" height="60" fill="#2b3547"/>
      </g>
      ${beam(SLUG, LAMP.cx, LAMP.cy, isWest() ? 22 : 158, 1100)}

      <!-- the great lamp on its pedestal -->
      <g data-mount="floor">
        ${shadow(LAMP.cx, FLOOR + 22, 110, 12)}
        <rect x="${LAMP.cx - 40}" y="${LAMP.cy + 90}" width="80" height="${FLOOR - LAMP.cy - 80}" fill="url(#sk_iron)" stroke="#0c0f13" stroke-width="3"/>
        <rect x="${LAMP.cx - 90}" y="${FLOOR - 10}" width="180" height="32" rx="5" fill="url(#sk_iron)" stroke="#0c0f13" stroke-width="3"/>
        <path d="M${LAMP.cx - 70} ${LAMP.cy + 100} L${LAMP.cx - 62} ${LAMP.cy - 50} Q${LAMP.cx} ${LAMP.cy - 120} ${LAMP.cx + 62} ${LAMP.cy - 50} L${LAMP.cx + 70} ${LAMP.cy + 100} Z" fill="url(#sk_brass)" stroke="#3a2a0c" stroke-width="3"/>
        <circle cx="${LAMP.cx}" cy="${LAMP.cy}" r="34" fill="#ffe6a6" class="glow"/>
      </g>

      <!-- the lantern plaque, bolted to the wall below the glazing -->
      ${panel({ ...PLAQUE, material: 'brass', mount: 'bolts', body: `
        <text x="${PLAQUE.x + PLAQUE.w / 2}" y="${PLAQUE.y + 28}" text-anchor="middle" font-size="13" fill="#2a1d05" font-family="Consolas, monospace" letter-spacing="2">THE LANTERN PLAQUE</text>
        <text x="${PLAQUE.x + PLAQUE.w / 2}" y="${PLAQUE.y + 56}" text-anchor="middle" font-size="15" fill="#2a1d05" font-family="Georgia, serif">"Sweep the beam sunwise from north,</text>
        <text x="${PLAQUE.x + PLAQUE.w / 2}" y="${PLAQUE.y + 80}" text-anchor="middle" font-size="15" fill="#2a1d05" font-family="Georgia, serif">and read each mark as the light finds it."</text>` })}

      <!-- the beam-training wheel on its post -->
      <g data-mount="post">
        ${shadow(WHEEL.cx, FLOOR + 110, 70, 10)}
        <rect x="${WHEEL.cx - 10}" y="${WHEEL.cy}" width="20" height="${FLOOR + 106 - WHEEL.cy}" fill="url(#sk_iron)"/>
        ${[0, 45, 90, 135].map(a => `<line x1="${WHEEL.cx - 84 * Math.cos(a * Math.PI / 180)}" y1="${WHEEL.cy - 84 * Math.sin(a * Math.PI / 180)}" x2="${WHEEL.cx + 84 * Math.cos(a * Math.PI / 180)}" y2="${WHEEL.cy + 84 * Math.sin(a * Math.PI / 180)}" stroke="#6b4a24" stroke-width="10" stroke-linecap="round"/>`).join('')}
        <circle cx="${WHEEL.cx}" cy="${WHEEL.cy}" r="66" fill="none" stroke="#6b4a24" stroke-width="12"/>
        <circle cx="${WHEEL.cx}" cy="${WHEEL.cy}" r="40" fill="${done ? '#12303f' : '#2b3547'}" stroke="#c9a227" stroke-width="4"/>
        <text x="${WHEEL.cx}" y="${WHEEL.cy - 4}" text-anchor="middle" font-size="12" fill="#9fc7dd" font-family="Consolas, monospace">BEAM</text>
        <text x="${WHEEL.cx}" y="${WHEEL.cy + 16}" text-anchor="middle" font-size="14" fill="#e8c85a" font-family="Consolas, monospace" letter-spacing="1">${done ? ANSWER : 'SET'}</text>
      </g>

      <!-- this keeper's three marks, in the signal book (read these to your partner) -->
      ${dock({ x: 0, y: 0, w: 420, h: 200 }, `
        ${mine.map((e, i) => `
          <g transform="translate(${76 + i * 134} 84)">${compassPlate(e.sun.rays, e.sun.letter, 50)}</g>`).join('') || '<text x="210" y="96" text-anchor="middle" font-size="22" fill="#6b5a3a" font-family="Georgia, serif">no marks yet</text>'}
        <text x="210" y="190" text-anchor="middle" font-size="18" fill="#6b5a3a" font-family="Consolas, monospace">read needle + letter to your partner</text>`, { kind: 'notebook', title: 'SIGNAL BOOK' })}

      ${towerTag()}
      ${rainOutside(SLUG)}
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const done = won(state);

    spots.push({
      id: 'plaque', ...PLAQUE, label: 'The lantern plaque',
      onInteract(game) {
        const html = `<div class="logbook"><div class="log-title">The lantern plaque</div>
          <p>"Sweep the beam <strong>sunwise from north</strong>, and read each mark as the light finds it."</p></div>
          <div class="relay">Each mark's needle points one way round the compass. You hold three; your partner holds three. Read each other "needle, letter", then go round the rose from north — N, NE, E, SE, S, SW — and read the six letters. Set that word on both wheels.</div>`;
        game.journal.add('note_plaque7', { title: 'The lantern plaque', category: 'note', html });
        game.dialog({ title: 'The Plaque', html });
      },
    });

    spots.push({
      id: 'marks', ...DOCK, label: 'Your three bearing-marks',
      onInteract(game) {
        const mine = game.state.journal.filter(e => e.category === 'sun').sort((a, b) => a.sun.rays - b.sun.rays);
        const list = mine.map(e => `needle <b>${bearingOf(e.sun.rays)}</b> = "<b>${e.sun.letter}</b>"`).join(' &nbsp; · &nbsp; ');
        const html = `<div class="chartcard"><div class="chart-title">${towerName()} — marks in your log</div>
          <p style="text-align:center;">${list || 'none yet'}</p></div>
          <div class="relay">Read these three to your partner and get their three. Swept sunwise from north, all six spell the harbour word.</div>`;
        game.dialog({ title: 'Your Marks', html });
      },
    });

    spots.push({
      id: 'false', x: 700, y: 430, w: 200, h: 160, label: 'The false light',
      onInteract(game) {
        game.say(done
          ? 'The wreckers\' fire is a red smear on the water now, swallowed by two honest beams.'
          : 'A red light on the middle headland where no light should be — the wreckers, calling the Meridian onto the teeth. Outshine it.');
      },
    });

    if (!done) {
      spots.push({
        id: 'wheel', ...WHEEL_SPOT, label: 'The beam-bearing wheel',
        onInteract(game) { openWheel(game); },
      });
    }

    return spots;
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: 'Six marks make the harbour word, but you carry only three. Your partner carries the other three — trade them.', cost: 60 },
      { text: 'Read each other your marks as "needle, letter". Then go round the compass sunwise from north — N, NE, E, SE, S, SW — reading the letter at each point.', cost: 120 },
      { text: 'N:A, NE:S, E:H, SE:O, S:R, SW:E — set the wheel to ASHORE.', cost: 240 },
    ];
  },
};

function openWheel(game) {
  game.openPuzzle({
    id: 'lanterncrown_wheel',
    title: 'Set the Beam',
    render(body, api) {
      body.innerHTML = `
        <div class="puzzle-hero" style="background-image:url(art/pz-crown.webp)"></div>
        <p class="puzzle-desc">Pool all six marks — your three and your partner's — and sweep the
        beam sunwise from north, reading each mark's letter as its needle comes round. Set the word.</p>
        <div class="puzzle-row">
          <input class="puzzle-input" id="cr-word" maxlength="6" autocomplete="off"
            placeholder="6 letters" style="text-transform:uppercase;letter-spacing:8px;text-align:center;width:240px;" />
        </div>
        <div class="puzzle-row"><button class="btn btn-primary" id="cr-set">Throw the Beam</button></div>
        <div class="puzzle-feedback"></div>`;
      const input = body.querySelector('#cr-word');
      const submit = () => {
        const v = (input.value || '').trim().toUpperCase();
        if (v === ANSWER) {
          game.setFlag('lanterncrown_set');
          game.playSfx('victory');
          game.refreshScene();
          game.say('The beam swings onto the true bearing and the false light drowns in gold. Out on the black water, a storm petrel wheels once between the towers — the crossing Gus has flown all night, carrying the word neither of you could speak alone.');
          game.completeRoom({ delay: 1600 });
        } else if (v === 'EROHSA') {
          api.fail('The beam swept widdershins. Sunwise from north is N, NE, E, SE, S, SW — go round the other way.');
        } else {
          api.fail('The beam wanders and the false light still burns — that is not the word. Pool all six marks with your partner.');
        }
      };
      body.querySelector('#cr-set').addEventListener('click', submit);
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
    },
  });
}
