// THE GATE OF LIFE — boot & per-game configuration.

import { configureSave, hasSave, loadState, resetState } from '../../shared/js/state.js';
import { initEngine, startRun, teardown, retryCurrentRoom, game } from '../../shared/js/engine.js';
import { GUS } from './gus.js';
import rooms from './rooms/index.js';

configureSave('gate-of-life-save-v1');

const $ = (sel) => document.querySelector(sel);

// Small emblem glyphs scratched into the bone tesserae. Line-work in
// wax-dark browns on ivory; each reads at ~40px.
const EMBLEMS = {
  spear: `<path d="M22 58 L48 20 M48 20 l-2 10 M48 20 l-10 2" stroke="#6b5a3a" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
  net: `<path d="M20 24 q15 -8 30 0 M18 34 h34 M20 44 q15 8 30 0 M26 20 v30 M35 18 v34 M44 20 v30" stroke="#6b5a3a" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,
  'egg-helm': `<path d="M23 48 v-12 a12 14 0 0 1 24 0 v12 z" fill="none" stroke="#6b5a3a" stroke-width="3.5" stroke-linejoin="round"/><circle cx="30" cy="38" r="2.4" fill="#6b5a3a"/><circle cx="40" cy="38" r="2.4" fill="#6b5a3a"/>`,
  'fish-crest': `<path d="M18 38 q12 -12 26 0 q-12 12 -26 0 z M44 38 l8 -7 v14 z" fill="none" stroke="#6b5a3a" stroke-width="3" stroke-linejoin="round"/><circle cx="26" cy="37" r="2" fill="#6b5a3a"/>`,
  griffin: `<path d="M24 52 q-4 -16 8 -24 q4 -8 14 -6 l-4 6 l8 2 q-2 6 -10 6 q10 8 2 16" fill="none" stroke="#6b5a3a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="41" cy="27" r="1.8" fill="#6b5a3a"/>`,
  palm: `<path d="M35 56 V30 M35 32 q-12 -10 -16 -2 q10 0 16 4 M35 32 q12 -10 16 -2 q-10 0 -16 4 M35 26 q-8 -12 -2 -16 q2 8 4 14 M35 26 q8 -12 2 -16 q-2 8 -4 14" stroke="#6b5a3a" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
};

// bone-tessera journal card: ivory tablet + class emblem + Felix's letter
function tesseraCard(e) {
  const glyph = EMBLEMS[e.sun.emblem] || '';
  return `<svg viewBox="0 0 80 92" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="4" width="46" height="62" rx="8" fill="#e8dcc0" stroke="#a8946c" stroke-width="2"/>
      <rect x="16" y="8" width="38" height="54" rx="6" fill="none" stroke="#c9b98f" stroke-width="1"/>
      <g transform="translate(1,3)">${glyph}</g>
      <text x="40" y="88" text-anchor="middle" font-size="22" fill="#e8dcc0"
        font-family="Palatino Linotype, Georgia, serif">${e.sun.letter}</text>
    </svg>
    <div class="journal-sun-cap">the ${e.sun.emblem.replace('-', ' ')} &middot; ${e.title}</div>`;
}

const CONFIG = {
  gusForm: GUS,
  journalTitle: 'Wax Tablets',
  journalEmpty: 'The wax is smooth, waiting. Every inscription, ledger, plan, and bone tessera you examine is pressed here automatically. The tesserae matter more than they look like they should.',
  collectiblesTitle: 'Bone Tesserae',
  renderCollectible: tesseraCard,
  collectibleToast: (e) => `Bone tessera pocketed: the ${e.sun.emblem.replace('-', ' ')} — "${e.sun.letter}"`,
  victory: {
    title: 'Missio',
    heading: 'MISSIO — GRANTED',
    story: `The Gate of Life swings into white daylight and roar, and you walk out of the
      Colosseum through the door built for the spared. The festival crowd parts around a
      lion the way crowds do; nobody stops a man the games have already killed. Felix's
      rudis rides in your belt — earned, even if no lanista signed it. Somewhere above,
      the trumpets call the midday show to sand that will not have you. Beside you, an
      unhurried voice: <em>"Well walked. Felix always said the door would work. He was
      never wrong about doors."</em>`,
  },
  defeat: {
    title: 'The Lift Comes Down',
    heading: 'The Sand Calls',
    story: `Torchlight, and the escort, and the cage-lift rising toward a white square of
      roaring daylight. The machine runs sweetly — you designed it, after all. From the
      dark below, a lion's low voice, unhurried as ever: <em>"Wrong door. We will try
      the other one."</em>`,
    retryLabel: 'Slip the Escort (this chamber, 15:00)',
    restartLabel: 'Wake Again in the Carcer',
  },
  restartConfirm: 'Abandon this escape and wake again in the straw of the carcer? All progress will be lost.',
};

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  $(id).classList.remove('hidden');
}

function beginNewGame() {
  showScreen('#game-screen');
  startRun(false);
}

function continueGame() {
  const loaded = loadState();
  if (!loaded) { beginNewGame(); return; }
  showScreen('#game-screen');
  startRun(true);
}

function backToTitle() {
  teardown();
  showScreen('#title-screen');
  $('#btn-continue').classList.toggle('hidden', !hasSave());
}

initEngine(rooms, {
  config: CONFIG,
  onEnd(action) {
    teardown();
    if (action === 'restart') {
      resetState();
      beginNewGame();
    } else if (action === 'retry') {
      retryCurrentRoom();
    } else {
      backToTitle();
    }
  },
});

$('#btn-new-game').addEventListener('click', () => {
  if (hasSave()) {
    game.dialog({
      title: 'Begin Again?',
      html: '<p>An earlier escape is still scratched in the wax. Starting fresh will smooth it over.</p>',
      buttons: [
        { label: 'Continue Instead', class: 'btn-ghost', onClick: continueGame },
        { label: 'Fresh Start', class: 'btn-primary', onClick: () => { resetState(); beginNewGame(); } },
      ],
    });
  } else {
    beginNewGame();
  }
});

$('#btn-continue').addEventListener('click', continueGame);

$('#btn-how').addEventListener('click', () => {
  game.dialog({
    title: 'How to Play',
    html: `
      <p><strong>You have one hour.</strong> At midday the lifts come down for the
      condemned — that is you. Cross seven chambers of the Colosseum's underworld and
      leave through a door nobody remembers.</p>
      <p><strong>Look at everything.</strong> Glowing regions can be examined. Every
      puzzle is solvable from what the stones show you — no Latin lessons, no history
      degree, no guessing.</p>
      <p><strong>Your loculus.</strong> Collected gear sits at the bottom. Click an item
      to hold it, then click something in the scene to use it there — or click a second
      item to combine the two.</p>
      <p><strong>Your wax tablets.</strong> Every inscription, ledger, and bone tessera
      you examine is recorded (top right). The tesserae are not souvenirs.</p>
      <p><strong>Gus.</strong> The lion in the corner is Gus — same Gus as every room,
      new teeth. Three growls per chamber: a twitch of the tail (&minus;1:00), the stalk
      (&minus;2:00), the pounce (&minus;4:00). Paid growls stay readable free.</p>
      <p><strong>Progress saves automatically.</strong> The games run long. Not forever
      — but long.</p>`,
    buttons: [{ label: 'Understood', class: 'btn-primary' }],
  });
});

$('#btn-continue').classList.toggle('hidden', !hasSave());
