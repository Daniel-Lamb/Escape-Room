// STARFALL STATION — boot & per-game configuration.

import { configureSave, hasSave, loadState, resetState } from '../../shared/js/state.js';
import { initEngine, startRun, teardown, retryCurrentRoom, game } from '../../shared/js/engine.js';
import { GUS } from './gus.js';
import rooms from './rooms/index.js';

configureSave('starfall-station-save-v1');

const $ = (sel) => document.querySelector(sel);

// memory-shard journal card: hex chip + waveform with N peaks + letter
function shardCard(e) {
  const peaks = e.sun.rays;
  const step = 56 / (peaks * 2);
  let pts = `12 46`;
  for (let i = 0; i < peaks; i++) {
    pts += ` ${12 + step * (i * 2 + 1)} 30 ${12 + step * (i * 2 + 2)} 46`;
  }
  return `<svg viewBox="0 0 80 92" xmlns="http://www.w3.org/2000/svg">
      <polygon points="40,6 68,22 68,54 40,70 12,54 12,22" fill="rgba(79,216,208,0.06)"
        stroke="#4fd8d0" stroke-width="2.2"/>
      <polyline points="${pts}" fill="none" stroke="#8ff0ea" stroke-width="2.4"
        stroke-linejoin="round" stroke-linecap="round"/>
      <text x="40" y="88" text-anchor="middle" font-size="22" fill="#d7e8ff"
        font-family="Consolas, monospace">${e.sun.letter}</text>
    </svg>
    <div class="journal-sun-cap">${peaks} peaks &middot; ${e.title}</div>`;
}

const CONFIG = {
  gusForm: GUS,
  journalTitle: 'Suit Log',
  journalEmpty: 'Log empty. Every readout, manifest, schematic, and memory shard you examine is recorded here automatically. Memory shards matter more than you currently understand.',
  collectiblesTitle: 'Memory Shards',
  renderCollectible: shardCard,
  collectibleToast: (e) => `Memory shard integrated: ${e.sun.rays} wave-peaks — "${e.sun.letter}"`,
  victory: {
    title: 'Signal Found',
    heading: 'You Have Escaped',
    story: `The dish holds its angle while the sky turns to fire. Somewhere between one
      instant and the next, you stop being in the room — and Starfall Station folds into a
      long orange scar over the Pacific, three seconds after the transmission completes.
      Aboard RV-7, a receiving buffer blinks: <em>TWO PASSENGERS. ONE CARRIER WAVE.</em>
      Gus's voice arrives right beside yours, exactly as it always has:
      <em>"Told you I would remember for both of us."</em>`,
  },
  defeat: {
    title: 'Re-entry',
    heading: 'The Sky Catches Fire',
    story: `The horizon comes up too fast and the hull begins to sing — the long, rising
      note metal makes when it is about to become weather. The last thing in your vision
      is a small drone pressing its warm eye-light against yours.
      <em>"Restore point located,"</em> says Gus quietly. <em>"You get to try again, Elin.
      That is the one gift of being what we are."</em>`,
    retryLabel: 'Restore Backup (this deck, 15:00)',
    restartLabel: 'Restart from the Cryo Bay',
  },
  restartConfirm: 'Abandon this run and wake again in the cryo bay? All progress will be lost.',
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
      title: 'Wake Again?',
      html: '<p>A previous wake-cycle is still in the station\'s buffers. Starting fresh will overwrite it.</p>',
      buttons: [
        { label: 'Continue Instead', class: 'btn-ghost', onClick: continueGame },
        { label: 'Fresh Wake', class: 'btn-primary', onClick: () => { resetState(); beginNewGame(); } },
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
      <p><strong>You have one hour.</strong> Starfall Station's orbit is decaying; at 00:00
      it hits atmosphere. Cross seven decks and get off this station.</p>
      <p><strong>Look at everything.</strong> Glowing regions can be examined. Every puzzle
      is solvable from what the station shows you — no outside knowledge, no guessing.</p>
      <p><strong>Your suit rig.</strong> Collected gear sits at the bottom. Click an item to
      hold it, then click something in the scene to use it there — or click a second item to
      combine the two.</p>
      <p><strong>Your suit log.</strong> Every readout, schematic, and memory shard you
      examine is recorded (top right). The shards are not optional souvenirs.</p>
      <p><strong>Gus.</strong> The floating drone in the corner is GS-1 "Gus" — same Gus,
      new chassis. Three transmissions per deck: a pointer (&minus;1:00), the method
      (&minus;2:00), the answer (&minus;4:00). Paid ones stay readable free.</p>
      <p><strong>Progress saves automatically.</strong> The station waits. Not forever — but it waits.</p>`,
    buttons: [{ label: 'Understood', class: 'btn-primary' }],
  });
});

$('#btn-continue').classList.toggle('hidden', !hasSave());
