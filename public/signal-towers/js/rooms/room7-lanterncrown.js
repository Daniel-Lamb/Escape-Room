// SCENE 7 — The Lantern Crown (finale + META).
// Both towers must set the beam to ASHORE, spelled by all six bearing-marks
// sorted by depth (1..6): A(1) S(2) H(3) O(4) R(5) E(6). Each keeper's log holds
// only three marks — West: S,O,E ; East: A,H,R — so the word needs both journals.

import { getRole, isWest, towerName } from '../role.js';
import { defs, backdrop, rain, beam, towerTag } from '../scenekit.js';

const SLUG = 'crown';
const ANSWER = 'ASHORE';

function won(state) { return !!state.flags.lanterncrown_set; }

export default {
  id: 'lanterncrown',
  get title() { return `${towerName()} · The Lantern Crown`; },
  get intro() {
    return 'The top of the tower, the beam alive at last — but out on the middle headland a false light burns red, dragging the Meridian toward the rocks. Only the true bearing, set on both towers at once, can drown it. Set the beam to the word your six marks spell — and you hold only three of them.';
  },

  scene(state) {
    const done = won(state);
    // this keeper's own three marks (from the log)
    const mine = state.journal.filter(e => e.category === 'sun').sort((a, b) => a.sun.rays - b.sun.rays);

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}</defs>
      ${backdrop(SLUG)}
      ${beam(SLUG, 800, 300, isWest() ? 22 : 158, 1100)}

      <!-- the false light on the middle headland -->
      <g>
        <path d="M720 470 q80 -26 160 0 l0 90 -160 0 z" fill="#141c26" opacity="0.85"/>
        ${done
          ? `<circle cx="800" cy="470" r="10" fill="#3a4656"/><text x="800" y="540" text-anchor="middle" font-size="14" fill="#7f8a99" font-family="Consolas, monospace">the false light drowns</text>`
          : `<circle cx="800" cy="470" r="12" fill="#e05252" class="flicker"/>
             <circle cx="800" cy="470" r="34" fill="rgba(224,82,82,0.28)" class="glow"/>
             <text x="800" y="560" text-anchor="middle" font-size="14" fill="#ff8f8f" font-family="Consolas, monospace">FALSE LIGHT — wreckers</text>`}
      </g>

      <!-- the Meridian, making for the channel -->
      <path d="M1120 640 q80 -22 200 0 l-22 40 q-90 16 -170 0 z" fill="#1c2431" stroke="#3a4656" stroke-width="4"/>
      <rect x="1210" y="580" width="12" height="60" fill="#2b3547"/>

      <!-- the meta plaque -->
      <g>
        <rect x="1120" y="150" width="400" height="150" rx="8" fill="#141c26" stroke="#c9a227" stroke-width="4"/>
        <text x="1320" y="192" text-anchor="middle" font-size="14" fill="#9fc7dd" font-family="Consolas, monospace" letter-spacing="2">THE LANTERN PLAQUE</text>
        <text x="1320" y="228" text-anchor="middle" font-size="15" fill="#e8dcc0" font-family="Georgia, serif">"Set the beam to the word the</text>
        <text x="1320" y="252" text-anchor="middle" font-size="15" fill="#e8dcc0" font-family="Georgia, serif">marks spell — shallowest</text>
        <text x="1320" y="276" text-anchor="middle" font-size="15" fill="#e8dcc0" font-family="Georgia, serif">bearing first."</text>
      </g>

      <!-- this keeper's three marks, on a little rack (read these to your partner) -->
      <g>
        <rect x="120" y="600" width="470" height="200" rx="10" fill="#0e2032" stroke="#9fc7dd" stroke-width="3"/>
        <text x="355" y="640" text-anchor="middle" font-size="14" fill="#9fc7dd" font-family="Consolas, monospace" letter-spacing="2">YOUR THREE MARKS</text>
        ${mine.map((e, i) => `
          <g transform="translate(${190 + i * 130} 720)">
            <circle r="34" fill="rgba(201,162,39,0.06)" stroke="#c9a227" stroke-width="2.5"/>
            <text y="-2" text-anchor="middle" font-size="22" fill="#e8c85a" font-family="Consolas, monospace" font-weight="bold">${e.sun.rays}</text>
            <text y="22" text-anchor="middle" font-size="20" fill="#e8dcc0" font-family="Georgia, serif">${e.sun.letter}</text>
          </g>`).join('')}
        <text x="355" y="790" text-anchor="middle" font-size="12" fill="#7f8a99" font-family="Consolas, monospace">read bearing + letter to your partner</text>
      </g>

      <!-- the beam-bearing wheel -->
      <g>
        <circle cx="800" cy="740" r="70" fill="${done ? '#12303f' : '#2b3547'}" stroke="#c9a227" stroke-width="6"/>
        <text x="800" y="735" text-anchor="middle" font-size="13" fill="#9fc7dd" font-family="Consolas, monospace">BEAM</text>
        <text x="800" y="758" text-anchor="middle" font-size="18" fill="#e8c85a" font-family="Consolas, monospace" letter-spacing="2">${done ? ANSWER : 'WHEEL'}</text>
      </g>

      ${towerTag()}
      ${rain(SLUG)}
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const done = won(state);

    spots.push({
      id: 'plaque', x: 1120, y: 150, w: 400, h: 150, label: 'The lantern plaque',
      onInteract(game) {
        const html = `<div class="logbook"><div class="log-title">The lantern plaque</div>
          <p>"Set the beam to the word the marks spell — <strong>shallowest bearing first</strong>."</p></div>
          <div class="relay">You hold only three marks. Your partner holds the other three. Read yours to each other, put all six in order by bearing (1 first), and set the word on both wheels.</div>`;
        game.journal.add('note_plaque7', { title: 'The lantern plaque', category: 'note', html });
        game.dialog({ title: 'The Plaque', html });
      },
    });

    spots.push({
      id: 'marks', x: 120, y: 600, w: 470, h: 200, label: 'Your three bearing-marks',
      onInteract(game) {
        const mine = game.state.journal.filter(e => e.category === 'sun').sort((a, b) => a.sun.rays - b.sun.rays);
        const list = mine.map(e => `bearing <b>${e.sun.rays}</b> = "<b>${e.sun.letter}</b>"`).join(' &nbsp; · &nbsp; ');
        const html = `<div class="chartcard"><div class="chart-title">${towerName()} — marks in your log</div>
          <p style="text-align:center;">${list || 'none yet'}</p></div>
          <div class="relay">Read these three to your partner and get their three. Sorted by bearing 1→6, all six spell the harbour word.</div>`;
        game.dialog({ title: 'Your Marks', html });
      },
    });

    spots.push({
      id: 'false', x: 700, y: 440, w: 200, h: 140, label: 'The false light',
      onInteract(game) {
        game.say(done
          ? 'The wreckers\' fire is a red smear on the water now, swallowed by two honest beams.'
          : 'A red light on the middle headland where no light should be — the wreckers, calling the Meridian onto the teeth. Outshine it.');
      },
    });

    if (!done) {
      spots.push({
        id: 'wheel', x: 720, y: 660, w: 160, h: 160, label: 'The beam-bearing wheel',
        onInteract(game) { openWheel(game); },
      });
    }

    return spots;
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: 'Six marks make the harbour word, but you carry only three. Your partner carries the other three — trade them.', cost: 60 },
      { text: 'Read each other your marks as "bearing, letter." Lay all six out by bearing, shallowest (1) first, and read off the word.', cost: 120 },
      { text: 'A(1) S(2) H(3) O(4) R(5) E(6) — set the wheel to ASHORE.', cost: 240 },
    ];
  },
};

function openWheel(game) {
  game.openPuzzle({
    id: 'lanterncrown_wheel',
    title: 'Set the Beam',
    render(body, api) {
      body.innerHTML = `
        <p class="puzzle-desc">Combine all six bearing-marks — your three and your partner's —
        in order by bearing, shallowest first. Set the word and throw the beam.</p>
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
        } else {
          api.fail('The beam wanders and the false light still burns — that is not the word. Pool all six marks with your partner.');
        }
      };
      body.querySelector('#cr-set').addEventListener('click', submit);
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
    },
  });
}
