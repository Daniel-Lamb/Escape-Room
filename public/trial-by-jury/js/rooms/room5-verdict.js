// SCENE 5 — The Verdict (meta · name the liar, name the thief).
// The four accounts, cross-examined, converge: one witness lied to the bench,
// and the four carved exhibits spell the real thief. This is the last room, so
// a true verdict wins the trial.
//   The liar:  the Gecko (p2) — swore they never left the far bank, prints say else.
//   The thief: CROW — spelled by exhibits #1-#4 (C-R-O-W), in order.

import { getRole, roleName, ROLES } from '../role.js';
import { defs, backdrop, roleTag } from '../jurykit.js';

const SLUG = 'verdict';
const LIAR = 'p2';
const CULPRIT = 'CROW';
const WITNESSES = ['p1', 'p2', 'p3', 'p4'];

function done(state) { return !!state.flags.verdict_done; }

export default {
  id: 'verdict',
  get title() { return `${roleName()} · The Verdict`; },
  get intro() {
    return 'The court falls quiet. Two questions decide it, and the jury is you. First: which of the four witnesses lied to the bench? Second: whose name do the four carved exhibits spell — the true thief? Read your exhibits to each other, in order, and deliver the verdict together.';
  },

  scene(state) {
    const finished = done(state);
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}</defs>
      ${backdrop(SLUG)}
      ${roleTag()}

      <!-- the great stone bench of the court -->
      <g>
        <rect x="440" y="300" width="720" height="120" rx="14" fill="url(#${SLUG}_stone)" stroke="#0a1408" stroke-width="8"/>
        <rect x="470" y="250" width="660" height="60" rx="10" fill="#2c3826" stroke="#0a1408" stroke-width="5"/>
        <text x="800" y="290" text-anchor="middle" font-size="26" fill="#e6d16a"
          font-family="Georgia, serif" letter-spacing="6">THE BENCH</text>
        <!-- scales of the court -->
        <g stroke="#8a6f34" stroke-width="5" fill="none">
          <line x1="800" y1="150" x2="800" y2="250"/>
          <line x1="700" y1="180" x2="900" y2="180"/>
          <path d="M700 180 l-24 44 h48 z" fill="#3a2f18"/>
          <path d="M900 180 l-24 44 h48 z" fill="#3a2f18"/>
        </g>
      </g>

      ${finished
        ? `<text x="800" y="600" text-anchor="middle" font-size="30" fill="#9fe08a" font-family="Georgia, serif" class="flicker">The court has spoken.</text>`
        : `<g>
             <rect x="600" y="560" width="400" height="150" rx="14" fill="rgba(20,34,18,0.92)" stroke="#8a6f34" stroke-width="5"/>
             <text x="800" y="628" text-anchor="middle" font-size="20" fill="#a9c98f" font-family="Georgia, serif">Deliver the Verdict</text>
             <text x="800" y="662" text-anchor="middle" font-size="14" fill="#7f9a72" font-family="Consolas, monospace">name the liar &middot; name the thief</text>
           </g>`}
    </svg>`;
  },

  hotspots(state) {
    if (done(state)) return [];
    return [{
      id: 'verdict', x: 600, y: 560, w: 400, h: 150, label: 'Deliver the verdict',
      onInteract(game) { openVerdict(game); },
    }];
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: 'Two answers. The liar is the one witness whose own account the evidence flatly contradicts — think who claimed to be somewhere the tracks say they were not. The thief is spelled by your four carved exhibits, in order #1 to #4.', cost: 60 },
      { text: 'Read your exhibits around the jury in order — #1, then #2, #3, #4 — to spell the thief. For the liar, recall whose prints were in the mud despite their sworn word.', cost: 120 },
      { text: `The liar is the Gecko. The exhibits spell ${CULPRIT}.`, cost: 240 },
    ];
  },
};

function openVerdict(game) {
  let chosenLiar = null;
  const vals = [0, 0, 0, 0]; // A-Z dials for the culprit name
  const letter = (v) => String.fromCharCode(65 + (v % 26));
  const nameNow = () => vals.map(letter).join('');

  game.openPuzzle({
    id: 'verdict_puzzle',
    title: 'The Verdict of the Court',
    render(body, api) {
      body.innerHTML = `
        <div class="puzzle-hero" style="background-image:url(art/pz-verdict.webp)"></div>
        <p class="puzzle-desc">The jury must answer twice. Choose the witness who lied to the bench, then set the four figures to the thief's name your exhibits spell (in order, #1&ndash;#4).</p>
        <p class="verdict-q">Which witness lied?</p>
        <div class="puzzle-row" id="vj-liar"></div>
        <p class="verdict-q">Name the thief</p>
        <div class="puzzle-row" id="vj-name"></div>
        <div class="puzzle-row"><button class="btn btn-primary" id="vj-go">Deliver the Verdict</button></div>
        <div class="puzzle-feedback"></div>`;

      const liarRow = body.querySelector('#vj-liar');
      WITNESSES.forEach(w => {
        const b = document.createElement('button');
        b.className = 'btn btn-ghost verdict-witness';
        b.textContent = ROLES[w].name;
        b.addEventListener('click', () => {
          chosenLiar = w;
          liarRow.querySelectorAll('.verdict-witness').forEach(x => x.classList.remove('chosen'));
          b.classList.add('chosen');
          game.playSfx('click');
        });
        liarRow.appendChild(b);
      });

      const nameRow = body.querySelector('#vj-name');
      vals.forEach((v, i) => {
        const dial = document.createElement('div');
        dial.className = 'dial';
        dial.innerHTML = `
          <button class="dial-btn" data-d="1" aria-label="up">&#9650;</button>
          <div class="dial-face">${letter(v)}</div>
          <button class="dial-btn" data-d="-1" aria-label="down">&#9660;</button>
          <div class="lever-label">#${i + 1}</div>`;
        const face = dial.querySelector('.dial-face');
        dial.querySelectorAll('.dial-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            vals[i] = (vals[i] + Number(btn.dataset.d) + 26) % 26;
            face.textContent = letter(vals[i]);
            face.classList.remove('tick'); void face.offsetWidth; face.classList.add('tick');
            game.playSfx('click');
          });
        });
        nameRow.appendChild(dial);
      });

      body.querySelector('#vj-go').addEventListener('click', () => {
        const liarOk = chosenLiar === LIAR;
        const nameOk = nameNow() === CULPRIT;
        if (liarOk && nameOk) {
          game.playSfx('unlock');
          api.solved({ message: 'The court rises as one. The old Sloth is cleared, the Gecko\'s false oath is struck from the record, and the Crow is named thief before the whole jungle.' });
          game.setFlag('verdict_done');
          game.refreshScene();
          game.completeRoom({ delay: 900 });
        } else if (!nameOk && liarOk) {
          api.fail('You have the liar — but that is not the name the exhibits spell. Read them again, #1 to #4.');
        } else if (nameOk && !liarOk) {
          api.fail('The right thief is named — but you have accused the wrong witness of lying. Whose story did the mud contradict?');
        } else {
          api.fail('The court is not satisfied. Reconsider both the liar and the thief.');
        }
      });
    },
  });
}
