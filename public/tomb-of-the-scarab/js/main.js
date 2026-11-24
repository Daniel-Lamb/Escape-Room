// THE TOMB OF THE SCARAB — boot & per-game configuration.

import { configureSave, hasSave, loadState, resetState } from '../../shared/js/state.js';
import { initEngine, startRun, teardown, retryCurrentRoom, game } from '../../shared/js/engine.js';
import { GUS } from './gus.js';
import rooms from './rooms/index.js';

configureSave('tomb-of-the-scarab-save-v1');

const $ = (sel) => document.querySelector(sel);

const CONFIG = {
  assetBase: new URL('../', import.meta.url).href,   // <game>/ — makes art/ refs deploy-base-proof
  gusForm: GUS,
  journalTitle: "Scribe's Palette",
  journalEmpty: 'Blank papyrus, waiting. Every glyph you read, every weight and star and amulet you find, will be copied here — you will want it at the false door.',
  collectiblesTitle: 'The Amulets of the Rite',
  // Each amulet carries a sign (the chamber it came from), a bead count and a
  // letter. The false door's hollows are ordered by sign; the beads agree.
  collectibleToast: (e) => `Amulet copied to your palette: the ${e.sign || '?'} sign · ${e.sun.rays} bead${e.sun.rays === 1 ? '' : 's'} — "${e.sun.letter}"`,
  renderCollectible: (e) => `
    <svg viewBox="0 0 80 92" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="38" rx="22" ry="28" fill="#2f6fb0" stroke="#f2d774" stroke-width="2.5"/>
      ${Array.from({ length: e.sun.rays }, (_, i) => `<circle cx="${40 - (e.sun.rays - 1) * 7 + i * 14}" cy="14" r="4.5" fill="#f2d774"/>`).join('')}
      <text x="40" y="48" text-anchor="middle" font-size="22" fill="#fdf3cf" font-family="Palatino Linotype, Georgia, serif">${e.sun.letter}</text>
      <text x="40" y="86" text-anchor="middle" font-size="11" fill="#e8d9b0" font-family="Palatino Linotype, Georgia, serif">${e.sign || ''}</text>
    </svg>
    <div class="journal-sun-cap">${e.sun.rays} bead${e.sun.rays === 1 ? '' : 's'} &middot; ${e.sign ? `${e.sign} sign &middot; ` : ''}${e.title}</div>`,
  ambience: 'crypt',
  victory: {
    title: 'Come Forth by Day',
    heading: 'You Have Escaped',
    art: 'art/end-win.mp4',
    poster: 'art/end-win.webp',
    story: `You speak the sign of life, and the false door remembers what a door is for.
      Stone grinds inward on a shaft of raw dawn, and the trapped air of three thousand years
      goes out past you like a held breath let go. You climb into red desert light — alive,
      unrobbed of it — and behind you the scarab settles back onto a cold heart, its work done.`,
  },
  defeat: {
    title: 'The Tomb Keeps You',
    heading: 'The Air Runs Thin',
    art: 'art/end-lose.mp4',
    poster: 'art/end-lose.webp',
    story: `The lamp gutters, and the dark leans closer. The rites are unfinished, the false door
      stays a wall, and the tomb does what tombs are built to do. Yet against your ear, small and
      golden and unhurried, a voice: <em>"Not yet, little one. Breathe. We begin again — the walls
      have not moved, and neither, quite, have you."</em>`,
    retryLabel: 'Breathe Again (this chamber, 15:00)',
    restartLabel: 'Wake Again at the Entrance',
  },
  restartConfirm: 'Abandon these rites and wake again at the sealed entrance? Everything you have read will be lost.',
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
      title: 'Wake Anew?',
      html: '<p>A previous descent still lingers in the tomb\'s memory. Waking fresh will erase it.</p>',
      buttons: [
        { label: 'Continue Instead', class: 'btn-ghost', onClick: continueGame },
        { label: 'Wake Fresh', class: 'btn-primary', onClick: () => { resetState(); beginNewGame(); } },
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
      <p><strong>You are sealed in.</strong> The entrance has collapsed and the air is thin.
      Escape through five chambers by completing the burial rites the walls describe.</p>
      <p><strong>Look at everything.</strong> Move your cursor over each scene — glowing regions
      can be examined. Every puzzle is solvable from what is painted, carved, or weighed inside
      this tomb. No outside knowledge, no guessing.</p>
      <p><strong>Your palette.</strong> Items appear at the bottom. Click one to hold it, then click
      something in the scene to use it — or click a second item to combine the two.</p>
      <p><strong>Your journal.</strong> Every glyph and amulet you examine is copied to the Scribe's
      Palette (top right). Each amulet carries a count of beads and a letter — the false door will
      ask for them.</p>
      <p><strong>Gus.</strong> The golden scarab in the corner is Gus, set over the pharaoh's heart.
      He helps when you're stuck: a nudge (&minus;1:00), the method (&minus;2:00), the answer
      (&minus;4:00). Paid whispers stay readable for free.</p>
      <p><strong>Progress saves automatically.</strong> Close the page and return; the tomb waits.</p>`,
    buttons: [{ label: 'Understood', class: 'btn-primary' }],
  });
});

$('#btn-continue').classList.toggle('hidden', !hasSave());
