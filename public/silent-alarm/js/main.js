// SILENT ALARM — boot, role selection & per-game configuration.
// Two-player asymmetric co-op heist: the player picks a role (The Hand = P1,
// inside the museum / The Eye = P2, in the van); every room renders that role's
// variant. No networking — the co-op is enforced by design (each lock's answer
// lives on the other player's screen).

import { configureSave, hasSave, resetState } from '../../shared/js/state.js';
import { initEngine, startRun, teardown, retryCurrentRoom, game } from '../../shared/js/engine.js';
import { GUS } from './gus.js';
import { setRole, saveKeyForRole } from './role.js';
import rooms from './rooms/index.js';

const $ = (sel) => document.querySelector(sel);

// A vault-pin journal card: a steel/brass tumbler pin stamped with a position
// number (1-6) and a digit (0-9). Reuses the shared 'sun' collectible slot:
// sun.rays = position, sun.letter = the digit as a string.
function pinCard(e) {
  const pos = e.sun.rays;
  const digit = e.sun.letter;
  return `<svg viewBox="0 0 80 92" xmlns="http://www.w3.org/2000/svg">
      <!-- pin body -->
      <rect x="28" y="12" width="24" height="46" rx="7" fill="#20303a" stroke="#57d6e6" stroke-width="1.6"/>
      <rect x="33" y="18" width="14" height="34" rx="4" fill="rgba(87,214,230,0.08)"/>
      <!-- notched head -->
      <rect x="24" y="6" width="32" height="12" rx="3" fill="#2b3d48" stroke="#c9a227" stroke-width="1.4"/>
      <text x="40" y="42" text-anchor="middle" font-size="20" fill="#7cffb2"
        font-family="Consolas, monospace" font-weight="bold">${digit}</text>
      <!-- position collar -->
      <circle cx="40" cy="70" r="12" fill="none" stroke="#c9a227" stroke-width="1.6"/>
      <text x="40" y="75" text-anchor="middle" font-size="13" fill="#e8c85a"
        font-family="Consolas, monospace" font-weight="bold">${pos}</text>
    </svg>
    <div class="journal-sun-cap">pin ${pos} &middot; "${digit}"</div>`;
}

const CONFIG = {
  gusForm: GUS,
  journalTitle: 'The Job File',
  ambience: 'heist',
  journalEmpty: "The file is thin so far. Every code, schematic, feed, and note you examine is copied here — and the steel vault-pins you lift. You will each hold only three pins: to set the master combination at the vault, you must read yours to your partner and theirs to you.",
  collectiblesTitle: 'Vault-Pins',
  renderCollectible: pinCard,
  collectibleToast: (e) => `Vault-pin lifted: position ${e.sun.rays} — digit "${e.sun.letter}"`,
  victory: {
    title: 'Clean Getaway',
    heading: 'The Bird Flies',
    story: `The last door swings on the master your two files spelled, and the silent alarm
      stays exactly that — silent. Somewhere out past the loading dock a wire the Client laid
      trips into a circuit Gus gnawed dead three rooms ago, and nothing happens at all. The
      Larkspur Nightingale goes into the bag, cold and heavy and singing to no one. You leave
      the way the rat mapped, not the door left open for you. Two screens. Two players. One
      number neither of you could read alone. Gone before dawn, and clean.`,
  },
  defeat: {
    title: 'Caught',
    heading: 'Every Door Locks at Once',
    story: `The clock finds six before you find the number, and the building answers the only
      way it knows — every bolt throws at once, soft as a held breath, and the silent alarm
      finally has its voice. Down in the dark Gus goes still on the ducting, one bright eye on
      you, and waits. Whoever was talking in your ear has stopped. So, now, has the museum.`,
    retryLabel: 'Work This Room Again (15:00)',
    restartLabel: 'Start the Night Over',
  },
  restartConfirm: 'Walk away and start the whole job over? All progress on this side of the wire will be lost.',
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
  if (hasSave()) startRun(true);
  else { resetState(); startRun(false); }
}

function showRoleScreen() {
  toggleResume('hand', savedFor('p1'));
  toggleResume('eye', savedFor('p2'));
  showScreen('#role-screen');
}

function savedFor(role) {
  try {
    const raw = localStorage.getItem(`silent-alarm-${role}-save-v1`);
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
$('#pick-hand').addEventListener('click', () => enterRole('p1'));
$('#pick-eye').addEventListener('click', () => enterRole('p2'));

$('#btn-how').addEventListener('click', () => {
  game.dialog({
    title: 'How to Play — Two on the Wire',
    html: `
      <p><strong>This is a co-op game for two.</strong> Play on two devices (or two browser
      tabs). One of you is <strong>The Hand</strong> (Player 1), inside the museum with your
      hands on the locks; the other is <strong>The Eye</strong> (Player 2), in the van with
      the stolen schematics, the camera feeds, and the building's whole system on a green
      screen. Stay on a call or in the same room — you will be talking the whole time.</p>
      <p><strong>You each see only half.</strong> In every scene, the code, bearing, or reading
      that opens <em>your</em> lock is shown on <em>your partner's</em> screen — and theirs is
      on yours. Describe what you see out loud; that is the entire game.</p>
      <p><strong>One hour.</strong> When the dawn shift comes on at 00:00 the job is blown.
      Both sides must finish for the Nightingale to fly.</p>
      <p><strong>Look at everything.</strong> Glowing regions can be examined; everything is
      recorded in your Job File (top right), including the steel vault-pins — you will each
      hold only three, and the master combination needs all six.</p>
      <p><strong>Gus.</strong> The rat in the corner has run these walls for years. Three hints
      per scene: a twitch of the whiskers (&minus;1:00), the wire to pull (&minus;2:00), the
      whole score (&minus;4:00). Paid hints stay readable free.</p>
      <p><strong>Progress saves automatically</strong>, separately for each side.</p>`,
    buttons: [{ label: 'Take the Job', class: 'btn-primary', onClick: showRoleScreen }],
  });
});
