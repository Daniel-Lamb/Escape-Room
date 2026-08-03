// THE LOOKING GLASS — boot, role selection & per-game configuration.
// Two-player asymmetric co-op: P1 keeps The Waking Side (the real manor); P2 is
// on The Glass Side (inside the mirror, reversed). Each lock's answer is on the
// partner's screen. The finale word is spelled backwards by the glass.

import { configureSave, hasSave, loadState, resetState } from '../../shared/js/state.js';
import { initEngine, startRun, teardown, retryCurrentRoom, game } from '../../shared/js/engine.js';
import { GUS } from './gus.js';
import { setRole, saveKeyForRole } from './role.js';
import rooms from './rooms/index.js';

const $ = (sel) => document.querySelector(sel);

// A mirror-shard journal card: a jagged silvered shard bearing a number + letter.
function shardCard(e) {
  const n = e.sun.rays;
  return `<svg viewBox="0 0 80 92" xmlns="http://www.w3.org/2000/svg">
      <polygon points="16,10 60,4 70,40 52,84 20,72 8,38" fill="rgba(159,168,189,0.10)"
        stroke="#c9ccd6" stroke-width="2"/>
      <polygon points="16,10 60,4 40,44" fill="rgba(232,235,242,0.10)"/>
      <line x1="40" y1="44" x2="70" y2="40" stroke="#9fa8bd" stroke-width="1" opacity="0.6"/>
      <line x1="40" y1="44" x2="20" y2="72" stroke="#9fa8bd" stroke-width="1" opacity="0.6"/>
      <text x="40" y="40" text-anchor="middle" font-size="17" fill="#dfe6f2"
        font-family="Consolas, monospace" font-weight="bold">${n}</text>
      <text x="40" y="66" text-anchor="middle" font-size="22" fill="#e8ebf2"
        font-family="Georgia, serif">${e.sun.letter}</text>
    </svg>
    <div class="journal-sun-cap">shard ${n} &middot; "${e.sun.letter}"</div>`;
}

const CONFIG = {
  gusForm: GUS,
  journalTitle: 'Reflections',
  journalEmpty: "Nothing recorded yet. Every note, cipher, and reading you examine is copied here — and the mirror-shards you find. You will each hold only three shards: the glass keeps its true name reversed, so at the last you must pool all six, set them in order, and turn the word about.",
  collectiblesTitle: 'Mirror-Shards',
  renderCollectible: shardCard,
  collectibleToast: (e) => `Mirror-shard kept: number ${e.sun.rays} — "${e.sun.letter}"`,
  victory: {
    title: 'Through the Glass',
    heading: 'The Glass Gives You Back',
    story: `The mirror-frame runs cold, then warm, and the silver goes to water. On the Waking
      Side a hand reaches into the glass; on the Glass Side a hand reaches out — and they are
      the same two hands, meeting in the thin bright seam where a black cat has been sitting
      all along, unbothered, as if he had arranged the whole thing. The reflection steps back
      into the room. Dawn comes to an ordinary mirror. Somewhere in the house, Gus is already
      asleep in a warm square of it.`,
  },
  defeat: {
    title: 'Dawn',
    heading: 'The Glass Breaks',
    story: `The first grey light touches the mirror and the silver crazes over like ice on a
      pond in spring — a hundred hairline cracks, and behind them a face that is yours,
      receding. Gus presses one paw flat to the glass from the far side. <em>"Next time,"</em>
      he seems to say, <em>"talk faster."</em>`,
    retryLabel: 'Try This Room Again (15:00)',
    restartLabel: 'Begin the Night Over',
  },
  restartConfirm: 'Abandon this night and begin again? All progress on this side of the glass will be lost.',
};

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  $(id).classList.remove('hidden');
}

function enterSide(role) {
  setRole(role);
  configureSave(saveKeyForRole());
  showScreen('#game-screen');
  if (hasSave()) startRun(true);
  else { resetState(); startRun(false); }
}

function savedFor(role) {
  try {
    const raw = localStorage.getItem(`looking-glass-${role}-save-v1`);
    if (!raw) return false;
    const s = JSON.parse(raw);
    return s && s.started && !s.finished;
  } catch { return false; }
}

function toggleResume(which, on) {
  const el = document.querySelector(`.role-card-resume[data-resume="${which}"]`);
  if (el) el.classList.toggle('hidden', !on);
}

function showRoleScreen() {
  toggleResume('waking', savedFor('p1'));
  toggleResume('glass', savedFor('p2'));
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
$('#pick-waking').addEventListener('click', () => enterSide('p1'));
$('#pick-glass').addEventListener('click', () => enterSide('p2'));

$('#btn-how').addEventListener('click', () => {
  game.dialog({
    title: 'How to Play — Two Reflections',
    html: `
      <p><strong>A co-op game for two.</strong> Play on two devices. One of you keeps
      <strong>The Waking Side</strong> (Player 1, the real manor); the other is on
      <strong>The Glass Side</strong> (Player 2, inside the mirror, where everything is
      reversed). Stay on a call — you will be talking the whole time.</p>
      <p><strong>You each see only half.</strong> In every room, the word, number, or reading
      that opens <em>your</em> lock is shown on <em>your partner's</em> screen. The mirror
      shows things backwards, so read carefully and describe exactly what you see.</p>
      <p><strong>One hour.</strong> At dawn the glass breaks and the one inside is lost. Both
      sides must finish for the reflection to come home.</p>
      <p><strong>Look at everything.</strong> Glowing regions can be examined; all of it is
      recorded in your Reflections (top right), including the mirror-shards — you each hold
      only three, and the last word needs all six.</p>
      <p><strong>Gus.</strong> The black cat in the corner walks through mirrors as through
      doors. Three hints per room: a slow blink (&minus;1:00), the scent of the path
      (&minus;2:00), the whole way through (&minus;4:00). Paid hints stay readable free.</p>
      <p><strong>Progress saves automatically</strong>, separately for each side.</p>`,
    buttons: [{ label: 'Step to the Glass', class: 'btn-primary', onClick: showRoleScreen }],
  });
});
