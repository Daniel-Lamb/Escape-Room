// DEEP SIX — boot, role selection & per-game configuration.
// Two-player asymmetric co-op: the player picks an end of the dive line
// (Diver = P1 on the wreck / Tender = P2 on the boat); every scene renders that
// role's variant. No networking — the co-op is enforced by design (each lock's
// answer lives on the other crew member's screen).

import { configureSave, hasSave, loadState, resetState } from '../../shared/js/state.js';
import { initEngine, startRun, teardown, retryCurrentRoom, game } from '../../shared/js/engine.js';
import { GUS } from './gus.js';
import { setRole, saveKeyForRole, isDiver } from './role.js';
import rooms from './rooms/index.js';

const $ = (sel) => document.querySelector(sel);

// A depth-mark journal card: a brass dive tag stamped with a fathom depth + letter.
function depthCard(e) {
  const depth = e.sun.rays;
  return `<svg viewBox="0 0 80 92" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="10" width="48" height="66" rx="7" fill="#33301f" stroke="#c9a227" stroke-width="2"/>
      <rect x="20" y="14" width="40" height="58" rx="5" fill="none" stroke="#8a7f3a" stroke-width="1"/>
      <circle cx="40" cy="22" r="4.4" fill="#0a0d11" stroke="#c9a227" stroke-width="1.4"/>
      <text x="40" y="48" text-anchor="middle" font-size="20" fill="#e8c85a"
        font-family="Consolas, monospace" font-weight="bold">${depth}</text>
      <text x="40" y="63" text-anchor="middle" font-size="9" fill="#9fb0a8"
        font-family="Consolas, monospace" letter-spacing="1">FATHOMS</text>
      <text x="40" y="88" text-anchor="middle" font-size="24" fill="#dfe9ec"
        font-family="Georgia, serif">${e.sun.letter}</text>
    </svg>
    <div class="journal-sun-cap">${depth} fathoms &middot; "${e.sun.letter}"</div>`;
}

const CONFIG = {
  gusForm: GUS,
  journalTitle: 'Dive Slate',
  journalEmpty: "The slate is clean so far. Every reading, chart, and codebook page you examine is copied here — and the brass depth-marks you recover. You will each hold only three: to spell the ascent word at the surface, you must read yours to your partner and theirs to you.",
  collectiblesTitle: 'Depth-Marks',
  renderCollectible: depthCard,
  collectibleToast: (e) => `Depth-mark recovered: ${e.sun.rays} fathoms — "${e.sun.letter}"`,
  collectibleSfx: 'bubble',
  // Two soundscapes: the Diver breathes on the wreck, the Tender listens topside.
  ambience: () => (isDiver() ? 'deep-diver' : 'deep-tender'),
  victory: {
    title: 'Surfaced',
    heading: 'You Break the Surface Together',
    story: `The ballast blows in a roar of silver, the ascent word holds the decompression
      valve open through every stop, and the black water pales to green, to grey, to the raw
      bright air. You break the surface together an arm's length from the Halcyon's rail — and
      between you, streaming water and forty years, the Cormorant's bell, her name raised green
      in the bronze. Not the strongbox the brief asked for. The other thing. The truth of her,
      back in the light at last: that she called into the dark for a bearing, and two lamps
      argued while she struck. Riding the swell as if he had raised the whole wreck himself, a
      harbor seal rolls once and barks — the crossing he has swum all night, and all the quiet
      years before it. Two ends of one line. One word passed along it. Ascend.`,
  },
  defeat: {
    title: 'The Line Goes Slack',
    heading: 'The Deep Keeps Its Own',
    story: `The minutes run out while the two of you are still guessing in the dark, and the
      dive line goes slack in the Tender's hands — the worst thing a tender can feel. Down on
      the Cormorant the lamp gutters and the cold comes in. Gus noses at the line, once, and
      turns for the surface alone. The bay has kept ships before. It is patient.`,
    retryLabel: 'Try This Depth Again (this scene, 15:00)',
    restartLabel: 'Dive the Wreck Again',
  },
  restartConfirm: 'Abandon this dive and start over? All progress on this end of the line will be lost.',
};

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  $(id).classList.remove('hidden');
}

/** Enter the game as a given role, resuming if that role has a save. */
function enterRole(role) {
  setRole(role);
  configureSave(saveKeyForRole());
  showScreen('#game-screen');
  if (hasSave()) { loadState(); startRun(true); }
  else { resetState(); startRun(false); }
}

function showRoleScreen() {
  toggleResume('diver', savedFor('p1'));
  toggleResume('tender', savedFor('p2'));
  showScreen('#role-screen');
}

function savedFor(role) {
  try {
    const raw = localStorage.getItem(`deep-six-${role}-save-v1`);
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
$('#pick-diver').addEventListener('click', () => enterRole('p1'));
$('#pick-tender').addEventListener('click', () => enterRole('p2'));

$('#btn-how').addEventListener('click', () => {
  game.dialog({
    title: 'How to Play — Two Crew',
    html: `
      <p><strong>This is a co-op game for two.</strong> Play on two devices (or two browser
      tabs). One of you is the <strong>Diver</strong> (Player 1), down on the wreck; the other
      is the <strong>Tender</strong> (Player 2), topside on the boat. Stay on a call or in the
      same room — you will be talking the whole time.</p>
      <p><strong>You each see only half.</strong> In every scene, the code, bearing, or reading
      that opens <em>your</em> lock is shown on <em>your partner's</em> screen — and theirs is
      on yours. Describe what you see out loud; that is the entire game.</p>
      <p><strong>One hour of air.</strong> When the clock reaches 00:00 the dive is lost. Both
      ends must finish for the two of you to surface.</p>
      <p><strong>Look at everything.</strong> Glowing regions can be examined; everything is
      recorded on your Dive Slate (top right), including the brass depth-marks — you will each
      hold only three, and the ascent word needs all six.</p>
      <p><strong>Gus.</strong> The harbor seal in the corner swims the line between you. Three
      hints per scene: a nudge (&minus;1:00), the bearing (&minus;2:00), the whole course
      (&minus;4:00). Paid hints stay readable free.</p>
      <p><strong>Progress saves automatically</strong>, separately for each end of the line.</p>`,
    buttons: [{ label: 'Back', class: 'btn-ghost' }, { label: 'Suit Up', class: 'btn-primary', onClick: showRoleScreen }],
  });
});
