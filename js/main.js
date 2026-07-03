// Boot: title screen wiring, save detection, run lifecycle.

import { hasSave, loadState, resetState, state } from './state.js';
import { initEngine, startRun, teardown, retryCurrentRoom, game } from './engine.js';
import rooms from './rooms/index.js';

const $ = (sel) => document.querySelector(sel);

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
