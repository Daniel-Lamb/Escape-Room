// THE VAULT — boot, role selection & per-game configuration.
// A four-handed co-op heist: each player opens the game on their own device and
// picks a station. Every scene each player has their own lock, and the code that
// opens it is on the crewmate-before-you's screen. No networking; the co-op is
// enforced by the cross-read.

import { configureSave, hasSave, loadState, resetState } from '../../shared/js/state.js';
import { initEngine, startRun, teardown, retryCurrentRoom, game } from '../../shared/js/engine.js';
import { GUS } from './gus.js';
import { setRole, saveKeyForRole, ROLES } from './role.js';
import { chipCard } from './crewkit.js';
import rooms from './rooms/index.js';

const $ = (sel) => document.querySelector(sel);

const CONFIG = {
  gusForm: GUS,
  journalTitle: 'The Job File',
  ambience: 'heist',
  collectibleSfx: 'clank',
  journalEmpty: 'The file is thin so far. Every code you read, cabinet you crack, and thing you examine is logged here — and the brass tumbler-chips you pocket. You will each hold only a couple: the vault at the end wants all six, in order.',
  collectiblesTitle: 'Tumbler-Chips',
  renderCollectible: chipCard,
  collectibleToast: (e) => `Tumbler-chip pocketed: #${e.sun.rays} — "${e.sun.letter}"`,
  victory: {
    title: 'Clean Getaway',
    heading: 'The Door Comes Open',
    story: `Six tumblers drop as one and the wheel spins sweet and free. The vault sighs open
      on more quiet money than any of you will admit to counting, and every camera in the
      building is still watching a loop of an empty room. You did not crack this by being the
      best cracker, or the best wire, or the best face at the desk — you cracked it because
      not one of you could see your own numbers, and you trusted the crewmate who could.
      Somewhere in the wall-void a ferret slips out ahead of you toward the alley and the cold
      morning. Split it four ways. Nobody talks. Clean getaway.`,
  },
  defeat: {
    title: 'Caught',
    heading: 'The Time-Lock Re-Arms',
    story: `The clock beats you to it. The vault's own time-lock rolls over, the bolts seat
      themselves for the night, and somewhere above a patrol car finally loops back around
      the block. The plan was never short a good hand — it was short a minute, and a word
      that didn't get read across in time. Gus is already gone. You should be too.`,
    retryLabel: 'Run This Room Again (15:00)',
    restartLabel: 'Case It From the Top',
  },
  restartConfirm: 'Walk away and case the whole job again? All progress at this station will be lost.',
};

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  $(id).classList.remove('hidden');
}

/** Enter the heist as a given station, resuming if that station has a save. */
function enterStation(role) {
  setRole(role);
  configureSave(saveKeyForRole());
  showScreen('#game-screen');
  if (hasSave()) { loadState(); startRun(true); }
  else { resetState(); startRun(false); }
}

function savedFor(role) {
  try {
    const raw = localStorage.getItem(`the-vault-${role}-save-v1`);
    if (!raw) return false;
    const st = JSON.parse(raw);
    return st && st.started && !st.finished;
  } catch { return false; }
}

function showRoleScreen() {
  Object.keys(ROLES).forEach(role => {
    const el = document.querySelector(`.role-card-resume[data-resume="${role}"]`);
    if (el) el.classList.toggle('hidden', !savedFor(role));
  });
  showScreen('#role-screen');
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
Object.keys(ROLES).forEach(role => {
  const btn = document.querySelector(`#pick-${role}`);
  if (btn) btn.addEventListener('click', () => enterStation(role));
});

$('#btn-how').addEventListener('click', () => {
  game.dialog({
    title: 'How to Play — Four Hands',
    html: `
      <p><strong>This is a co-op heist for a crew.</strong> Play on separate devices (or
      separate browser tabs) and stay on a call or in the same room — you will be talking the
      whole time. Four stations: <strong>the Cracker</strong>, <strong>the Wire</strong>,
      <strong>the Face</strong>, and <strong>the Wheel</strong>. With four of you it's one
      each; with three, one player runs two stations; with five or six, ride shotgun on the
      busy ones. Every station must be covered.</p>
      <p><strong>You each see only half.</strong> In every scene you have your own lock &mdash;
      and the code that opens it is <em>not</em> on your screen. It is on the screen of the
      crewmate before you in the cycle. Read your screen's code to the crewmate it belongs to,
      and set your own dials to what the crew reads back to you.</p>
      <p><strong>Pocket the brass chips.</strong> Six tumbler-chips are scattered through the
      job, each stamped with a place (1&ndash;6) and a digit. They spread out among you &mdash;
      at the vault you pool all six, in order, for the master combination.</p>
      <p><strong>One hour</strong>, then the vault's time-lock re-arms and the night is over.</p>
      <p><strong>Gus</strong> is the crew's ferret, in the corner. Three hints per scene: a
      chitter (&minus;1:00), the tip-off (&minus;2:00), the whole score (&minus;4:00).</p>
      <p><strong>Progress saves automatically</strong>, separately for each station.</p>`,
    buttons: [{ label: 'Back', class: 'btn-ghost' }, { label: 'Pick a Station', class: 'btn-primary', onClick: showRoleScreen }],
  });
});
