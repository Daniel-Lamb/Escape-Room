// TRIAL BY JURY — boot, role selection & per-game configuration.
// A social-deduction co-op for a jury: each player opens the game on their own
// device and takes one of four witness roles. Every scene each witness has their
// own account to swear, and the figure it lacks is on the witness-before-you's
// screen. Cross-examine, catch the liar, and name the thief at the verdict.

import { configureSave, hasSave, loadState, resetState } from '../../shared/js/state.js';
import { initEngine, startRun, teardown, retryCurrentRoom, game } from '../../shared/js/engine.js';
import { GUS } from './gus.js';
import { setRole, saveKeyForRole, ROLES } from './role.js';
import { evidenceCard } from './jurykit.js';
import rooms from './rooms/index.js';

const $ = (sel) => document.querySelector(sel);

const CONFIG = {
  gusForm: GUS,
  journalTitle: 'The Court Record',
  ambience: 'jungle',
  collectibleSfx: 'chirp',
  journalEmpty: 'The record is bare so far. Every figure you swear, every thing you examine, and each account you cross-check is entered here — and the four carved exhibits. You will each log only one: the four together, in order, name the thief.',
  collectiblesTitle: 'Exhibits',
  renderCollectible: evidenceCard,
  collectibleToast: (e) => `Exhibit entered: #${e.sun.rays} — "${e.sun.letter}"`,
  victory: {
    title: 'Verdict: Guilty',
    heading: 'The Truce Holds',
    story: `The court rises as one. The old Sloth, who could no more climb that wall than fly it,
      is cleared and led back to the sun. The Gecko's oath — that they never left the far bank —
      is struck from the record, their own prints in the mud giving them the lie. And the Crow,
      who came over the broken bough on light claws between moon-high and first bird, is named
      thief before the whole jungle. You did not reach this by any one of you knowing the whole
      night; you reached it because four half-truths, laid honestly side by side, leave a liar
      nowhere to stand. A golden tamarin rings the bell to close the session. The truce holds
      another year.`,
  },
  defeat: {
    title: 'Mistrial',
    heading: 'The Court Adjourns',
    story: `The light fails through the canopy and the court must rise with the question still
      open. Somewhere a Crow preens a black feather it will not be asked about, and an innocent
      Sloth waits on a verdict that did not come. The accounts were all there, half in each of
      four mouths — but they were never laid side by side in time. The Wild Court adjourns.`,
    retryLabel: 'Re-hear This Testimony (15:00)',
    restartLabel: 'Call the Trial Anew',
  },
  restartConfirm: 'Adjourn and call the whole trial anew? All progress at this witness stand will be lost.',
};

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  $(id).classList.remove('hidden');
}

/** Take the stand as a given witness, resuming if that witness has a save. */
function takeStand(role) {
  setRole(role);
  configureSave(saveKeyForRole());
  showScreen('#game-screen');
  if (hasSave()) { loadState(); startRun(true); }
  else { resetState(); startRun(false); }
}

function savedFor(role) {
  try {
    const raw = localStorage.getItem(`trial-by-jury-${role}-save-v1`);
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
  if (btn) btn.addEventListener('click', () => takeStand(role));
});

$('#btn-how').addEventListener('click', () => {
  game.dialog({
    title: 'How to Play — The Jury',
    html: `
      <p><strong>This is a social-deduction co-op for a jury.</strong> Play on separate devices
      (or separate browser tabs) and stay on a call or in the same room &mdash; you will be
      talking the whole time. Four witnesses: <strong>the Heron</strong>, <strong>the
      Gecko</strong>, <strong>the Boar</strong>, and <strong>the Parrot</strong>. With four of
      you it's one each; with three, one speaks for two; with more, seat the extra jurors beside
      a witness. Cover all four.</p>
      <p><strong>You each saw only your own night.</strong> In every scene your account is
      missing one figure &mdash; and that figure is <em>not</em> on your screen. It is on the
      screen of the witness who spoke before you. Read your screen's figure to the witness it
      belongs to, and swear your own account to what the court reads back.</p>
      <p><strong>Catch the liar.</strong> One of the four witnesses is lying to the bench. As the
      accounts square up, the lie stops fitting. Watch the lore for whose story the evidence
      contradicts.</p>
      <p><strong>Enter the exhibits.</strong> Four carved fig-wood tags are found through the
      trial, each marked with a place (1&ndash;4) and a letter. In order they spell the true
      thief &mdash; you bring both the liar and the name to the verdict.</p>
      <p><strong>One hour</strong>, then the court must adjourn with the question open.</p>
      <p><strong>Gus</strong> is the court's tamarin clerk, in the corner. Three hints per scene:
      a rap of the bell (&minus;1:00), the point of order (&minus;2:00), the plain finding
      (&minus;4:00).</p>
      <p><strong>Progress saves automatically</strong>, separately for each witness.</p>`,
    buttons: [{ label: 'Back', class: 'btn-ghost' }, { label: 'Take the Stand', class: 'btn-primary', onClick: showRoleScreen }],
  });
});
