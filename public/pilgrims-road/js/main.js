// THE PILGRIM'S ROAD — boot & per-game configuration.

import { configureSave, hasSave, loadState, resetState } from '../../shared/js/state.js';
import { initEngine, startRun, teardown, retryCurrentRoom, game } from '../../shared/js/engine.js';
import { GUS } from './gus.js';
import rooms from './rooms/index.js';

configureSave('pilgrims-road-save-v1');

const $ = (sel) => document.querySelector(sel);

const CONFIG = {
  gusForm: GUS,
  journalTitle: "Pilgrim's Journal",
  journalEmpty: 'Empty pages, waiting. Everything worth remembering — verses, rosters, recipes, and every carved sun you find — will be copied here the moment you examine it.',
  collectiblesTitle: 'The Suns of the Road',
  // default renderer (sun sketch) fits this game — no override needed
  victory: {
    title: 'Aurora',
    heading: 'You Have Escaped',
    story: `Black water closes over your head — then opens again into grey air and reeds.
      You surface on the far bank of the mere as the first true light touches the towers of
      Vayne Keep, Edmund's confession dry inside your shirt. The dawn that was meant to kill
      you is the word that set you free.`,
  },
  defeat: {
    title: 'Dawn',
    heading: 'The Bell Tolls',
    story: `Grey light spills through the arrow slits. Boots echo on stone — many of them,
      and unhurried, because they know exactly where you are. Yet as they drag you past a cold
      wall, a voice like wind through a visor whispers:
      <em>"The road is still open, friend. Slip them. I shall be waiting."</em>`,
    retryLabel: 'Rise Again (this chamber, 15:00)',
    restartLabel: 'Restart from the Cell',
  },
  restartConfirm: 'Abandon this escape and begin again from the first cell? All progress will be lost.',
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
      title: 'Begin Anew?',
      html: '<p>A previous escape attempt lingers in the castle\'s memory. Starting fresh will erase it.</p>',
      buttons: [
        { label: 'Continue Instead', class: 'btn-ghost', onClick: continueGame },
        { label: 'Start Fresh', class: 'btn-primary', onClick: () => { resetState(); beginNewGame(); } },
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
      <p><strong>You have one hour.</strong> At dawn they hang you. Escape through seven
      chambers of Vayne Keep by following Brother Edmund's trail of carved suns.</p>
      <p><strong>Look at everything.</strong> Move your cursor over each scene — glowing
      regions can be examined. Every puzzle is solvable from clues inside the castle.
      No outside knowledge, no guessing, no pixel-hunting.</p>
      <p><strong>Your satchel.</strong> Items appear at the bottom. Click an item to hold it,
      then click something in the scene to use it there — or click a second item to combine
      the two. Click the held item again to put it away.</p>
      <p><strong>Your journal.</strong> Every verse, roster, recipe, and carved sun you examine
      is copied into the Pilgrim's Journal (top right). You will want it at the end.</p>
      <p><strong>Gus.</strong> The ghostly knight in the corner of every room is Sir Gus — he
      helps when you're stuck. Three whispers per chamber: a nudge (&minus;1:00), the method
      (&minus;2:00), the answer (&minus;4:00). Paid whispers stay readable for free.</p>
      <p><strong>Progress saves automatically.</strong> Close the page and return; the castle waits.</p>`,
    buttons: [{ label: 'Understood', class: 'btn-primary' }],
  });
});

// surface Continue if a save exists
$('#btn-continue').classList.toggle('hidden', !hasSave());
