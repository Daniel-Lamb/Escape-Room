// TWIN SIGNAL TOWERS — boot, role selection & per-game configuration.
// Two-player asymmetric co-op: the player picks a tower (West = P1 / East = P2);
// every room renders that tower's variant. No networking — the co-op is enforced
// by design (each lock's answer lives on the other keeper's screen).

import { configureSave, hasSave, loadState, resetState } from '../../shared/js/state.js';
import { initEngine, startRun, teardown, retryCurrentRoom, game } from '../../shared/js/engine.js';
import { GUS } from './gus.js';
import { setRole, getRole, saveKeyForRole, towerName } from './role.js';
import rooms from './rooms/index.js';

const $ = (sel) => document.querySelector(sel);

// A bearing-mark journal card: brass compass-rose plate with a depth number + letter.
function bearingCard(e) {
  const depth = e.sun.rays;
  const cx = 40, cy = 34, r = 15;
  let ticks = '';
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const long = i % 2 === 0;
    ticks += `<line x1="${(cx + Math.cos(a) * (r - (long ? 6 : 3))).toFixed(1)}"
                     y1="${(cy + Math.sin(a) * (r - (long ? 6 : 3))).toFixed(1)}"
                     x2="${(cx + Math.cos(a) * r).toFixed(1)}"
                     y2="${(cy + Math.sin(a) * r).toFixed(1)}"
                     stroke="#c9a227" stroke-width="${long ? 2.2 : 1.3}" stroke-linecap="round"/>`;
  }
  return `<svg viewBox="0 0 80 92" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${cx}" cy="${cy}" r="${r + 4}" fill="none" stroke="#7a5f18" stroke-width="2"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="rgba(201,162,39,0.06)" stroke="#c9a227" stroke-width="1.6"/>
      ${ticks}
      <text x="${cx}" y="${cy + 7}" text-anchor="middle" font-size="19" fill="#e8c85a"
        font-family="Consolas, monospace" font-weight="bold">${depth}</text>
      <text x="${cx}" y="82" text-anchor="middle" font-size="26" fill="#e8dcc0"
        font-family="Georgia, serif">${e.sun.letter}</text>
    </svg>
    <div class="journal-sun-cap">bearing ${depth} &middot; "${e.sun.letter}"</div>`;
}

const CONFIG = {
  gusForm: GUS,
  journalTitle: "Keeper's Log",
  ambience: 'coast',
  journalEmpty: "The log is dry so far. Every reading, chart, and codebook page you examine is copied here — and the brass bearing-marks you find. You will each hold only half the marks: to spell the harbour word at the crown, you must read yours to your partner and theirs to you.",
  collectiblesTitle: 'Bearing-Marks',
  renderCollectible: bearingCard,
  collectibleToast: (e) => `Bearing-mark pocketed: depth ${e.sun.rays} — "${e.sun.letter}"`,
  victory: {
    title: 'Safe Harbour',
    heading: 'The Meridian Makes Port',
    story: `Both beams swing onto the channel as one, and the wreckers' false light gutters
      and drowns in honest gold. Out on the black water the Meridian answers her helm at
      last, slides between the reefs where you told her the water ran deep, and rounds into
      the lee of the harbour wall. Somewhere over the spray a storm petrel wheels once
      between the two towers — the crossing he has flown all night — and settles on the West
      rail as if he had always meant to. Two lights. Two keepers. One word carried between
      them. Ashore.`,
  },
  defeat: {
    title: 'The Tide Turns',
    heading: 'The Reef Takes Her',
    story: `The tide turns while the towers are still arguing in the dark, and the false
      light wins the Meridian's trust before you win the channel. You hear it before you see
      it — the long, wrong grind of a hull on rock. Gus lands on the sill, folds his wet
      wings, and looks at you with an old, patient eye. The bay has been patient too.`,
    retryLabel: 'Stand the Watch Again (this chamber, 15:00)',
    restartLabel: 'Begin the Night Over',
  },
  restartConfirm: 'Abandon this watch and begin the night over? All progress in this tower will be lost.',
};

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  $(id).classList.remove('hidden');
}

/** Enter the game as a given tower, resuming if that tower has a save. */
function enterTower(role) {
  setRole(role);
  configureSave(saveKeyForRole());
  showScreen('#game-screen');
  if (hasSave()) startRun(true);
  else { resetState(); startRun(false); }
}

function showRoleScreen() {
  // reflect any saved watch on each card
  const westSaved = savedFor('p1');
  const eastSaved = savedFor('p2');
  toggleResume('west', westSaved);
  toggleResume('east', eastSaved);
  showScreen('#role-screen');
}

function savedFor(role) {
  try {
    const raw = localStorage.getItem(`signal-towers-${role}-save-v1`);
    if (!raw) return false;
    const s = JSON.parse(raw);
    return s && s.started && !s.finished;
  } catch { return false; }
}

function toggleResume(which, on) {
  const el = document.querySelector(`.role-card-resume[data-resume="${which}"]`);
  if (el) el.classList.toggle('hidden', !on);
}

function backToTitle() {
  teardown();
  showScreen('#title-screen');
}

initEngine(rooms, {
  config: CONFIG,
  onEnd(action) {
    teardown();
    if (action === 'restart') {
      resetState();
      startRun(false);
      showScreen('#game-screen');
    } else if (action === 'retry') {
      retryCurrentRoom();
    } else {
      backToTitle();
    }
  },
});

$('#btn-begin').addEventListener('click', showRoleScreen);
$('#btn-role-back').addEventListener('click', backToTitle);
$('#pick-west').addEventListener('click', () => enterTower('p1'));
$('#pick-east').addEventListener('click', () => enterTower('p2'));

$('#btn-how').addEventListener('click', () => {
  game.dialog({
    title: 'How to Play — Two Keepers',
    html: `
      <p><strong>This is a co-op game for two.</strong> Play on two devices (or two browser
      tabs). One of you keeps the <strong>West Tower</strong> (Player 1); the other keeps the
      <strong>East Tower</strong> (Player 2). Stay on a call or in the same room — you will
      be talking the whole time.</p>
      <p><strong>You each see only half.</strong> In every scene, the code, bearing, or
      reading that opens <em>your</em> lock is shown on <em>your partner's</em> screen — and
      theirs is on yours. Describe what you see out loud; that is the entire game.</p>
      <p><strong>One hour.</strong> When the tide turns at 00:00 the Meridian is lost. Both
      towers must finish for the ship to reach harbour.</p>
      <p><strong>Look at everything.</strong> Glowing regions can be examined; everything is
      recorded in your Keeper's Log (top right), including the brass bearing-marks — you will
      each hold only three, and the final word needs all six.</p>
      <p><strong>Gus.</strong> The storm petrel in the corner flies between the towers. Three
      hints per scene: a flutter (&minus;1:00), the bearing (&minus;2:00), the whole course
      (&minus;4:00). Paid hints stay readable free.</p>
      <p><strong>Progress saves automatically</strong>, separately for each tower.</p>`,
    buttons: [{ label: 'Take a Watch', class: 'btn-primary', onClick: showRoleScreen }],
  });
});
