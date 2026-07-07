// THE WILD COURT — boot & per-game configuration.

import { configureSave, hasSave, loadState, resetState } from '../../shared/js/state.js';
import { initEngine, startRun, teardown, retryCurrentRoom, game } from '../../shared/js/engine.js';
import { GUS } from './gus.js';
import rooms from './rooms/index.js';

configureSave('wild-court-save-v1');

const $ = (sel) => document.querySelector(sel);

// court-token journal card: carved wood disc, creature face carved in, letter beneath
const TOKEN_GLYPHS = {
  harpy: `<path d="M40 30 q-12 -10 -20 -2 q8 0 10 6 q-14 -2 -18 8 q10 -3 14 2 M40 30 q12 -10 20 -2 q-8 0 -10 6 q14 -2 18 8 q-10 -3 -14 2 M40 28 l0 16 M36 46 l4 -4 l4 4"
    fill="none" stroke="#2c1e12" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`,
  ocelot: `<circle cx="40" cy="38" r="12" fill="none" stroke="#2c1e12" stroke-width="2.6"/>
    <path d="M31 30 l-3 -8 l8 4 M49 30 l3 -8 l-8 4" fill="none" stroke="#2c1e12" stroke-width="2.6" stroke-linejoin="round"/>
    <circle cx="36" cy="36" r="1.6" fill="#2c1e12"/><circle cx="44" cy="36" r="1.6" fill="#2c1e12"/>
    <path d="M37 43 q3 2 6 0" fill="none" stroke="#2c1e12" stroke-width="2"/>`,
  boa: `<path d="M24 46 q8 -8 16 0 q8 8 16 0 q4 -4 2 -10" fill="none" stroke="#2c1e12" stroke-width="3" stroke-linecap="round"/>
    <circle cx="58" cy="34" r="3.4" fill="#2c1e12"/>`,
  'tree-frog': `<ellipse cx="40" cy="40" rx="13" ry="10" fill="none" stroke="#2c1e12" stroke-width="2.6"/>
    <circle cx="33" cy="30" r="4.6" fill="none" stroke="#2c1e12" stroke-width="2.6"/>
    <circle cx="47" cy="30" r="4.6" fill="none" stroke="#2c1e12" stroke-width="2.6"/>
    <circle cx="33" cy="30" r="1.5" fill="#2c1e12"/><circle cx="47" cy="30" r="1.5" fill="#2c1e12"/>`,
  mantis: `<path d="M40 24 l0 22 M40 30 q-8 2 -10 -6 M40 30 q8 2 10 -6 M40 46 l-6 6 M40 46 l6 6"
    fill="none" stroke="#2c1e12" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M36 22 l8 0 l-4 -6 z" fill="#2c1e12"/>`,
  tamarin: `<circle cx="40" cy="38" r="9" fill="none" stroke="#2c1e12" stroke-width="2.6"/>
    ${[...Array(9)].map((_, i) => {
      const a = (i / 9) * Math.PI * 2 - Math.PI / 2;
      return `<line x1="${(40 + Math.cos(a) * 11).toFixed(1)}" y1="${(38 + Math.sin(a) * 11).toFixed(1)}" x2="${(40 + Math.cos(a) * 16).toFixed(1)}" y2="${(38 + Math.sin(a) * 16).toFixed(1)}" stroke="#2c1e12" stroke-width="2.2" stroke-linecap="round"/>`;
    }).join('')}
    <circle cx="37" cy="36" r="1.5" fill="#2c1e12"/><circle cx="43" cy="36" r="1.5" fill="#2c1e12"/>
    <path d="M37 42 q3 2 6 0" fill="none" stroke="#2c1e12" stroke-width="1.8"/>`,
};

function tokenCard(e) {
  const glyph = TOKEN_GLYPHS[e.sun.creature] || '';
  return `<svg viewBox="0 0 80 92" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="36" r="27" fill="#6b4f37" stroke="#4a3626" stroke-width="3"/>
      <circle cx="40" cy="36" r="22" fill="none" stroke="#4a3626" stroke-width="1.4" opacity="0.7"/>
      ${glyph}
      <text x="40" y="86" text-anchor="middle" font-size="24" fill="#e4f0d0"
        font-family="Palatino Linotype, Georgia, serif">${e.sun.letter}</text>
    </svg>
    <div class="journal-sun-cap">the ${e.sun.creature} &middot; ${e.title}</div>`;
}

const CONFIG = {
  gusForm: GUS,
  journalTitle: 'Field Journal',
  journalEmpty: 'Blank pages. Every print, law, mural, and court token you examine is copied here automatically. The tokens are not souvenirs — they are spelling something.',
  collectiblesTitle: 'Court Tokens',
  renderCollectible: tokenCard,
  collectibleToast: (e) => `Court token strung: the ${e.sun.creature} — "${e.sun.letter}"`,
  victory: {
    title: 'The Verdict',
    heading: 'The Court Rules in Your Favor',
    story: `The root-doors part onto a corridor of green dark, ten thousand fireflies
      holding it open, and you walk out of the valley as the last light goes. Weeks later,
      the Ashford Timber Concession quietly abandons Quadrant Nine — the filed survey shows
      flood-swamp and worthless scree, sealed in ochre and wax by its own surveyor.
      And some mornings, on your windowsill: two river-figs, and a scatter of small,
      five-fingered prints. <em>"Told you that you'd be magnificent,"</em> says no one,
      in a voice like a very smug advocate. The collar, for the record, stays exactly
      where it belongs.`,
  },
  defeat: {
    title: 'Nightfall',
    heading: 'The Court Adjourns',
    story: `The fireflies rise all at once, like a verdict being read in a language of
      light, and the dark comes down through the canopy with the sound of ten thousand
      small things going still. A warm weight lands on your shoulder — and then, very
      quietly, Gus takes off his little woven collar and sets it on a root.
      <em>"Court is adjourned,"</em> he says softly. <em>"But appeals are heard —
      the Wild Court is patient, Marlowe. It has been patient since 1911."</em>`,
    retryLabel: 'Appeal the Verdict (this trial, 15:00)',
    restartLabel: 'Stand Trial Again (from the sinkhole)',
  },
  restartConfirm: 'Walk back to the sinkhole and stand trial from the beginning? All progress will be lost.',
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
      title: 'Stand Trial Again?',
      html: '<p>A hearing is already in session — the Court remembers where you left off. Starting fresh will strike that testimony from the record.</p>',
      buttons: [
        { label: 'Continue Instead', class: 'btn-ghost', onClick: continueGame },
        { label: 'Fresh Trial', class: 'btn-primary', onClick: () => { resetState(); beginNewGame(); } },
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
      <p><strong>You have one hour.</strong> The Wild Court adjourns at nightfall; at 00:00
      the verdict goes against you. Pass seven trials and reach the open air.</p>
      <p><strong>Look at everything.</strong> Glowing regions can be examined. Every puzzle
      is solvable from what the jungle shows you — no outside knowledge, no guessing.</p>
      <p><strong>Your satchel.</strong> Collected gear sits at the bottom. Click an item to
      hold it, then click something in the scene to use it there — or click a second item to
      combine the two.</p>
      <p><strong>Your field journal.</strong> Every print, law, mural, and court token you
      examine is recorded (top right). The tokens are not optional souvenirs.</p>
      <p><strong>Gus.</strong> The golden tamarin in the corner is your court-appointed
      advocate — same Gus, new fur. Three counsels per trial: a nudge (&minus;1:00), the
      method (&minus;2:00), the answer (&minus;4:00). Paid ones stay readable free.</p>
      <p><strong>Progress saves automatically.</strong> The Court waits. It is very good
      at waiting.</p>`,
    buttons: [{ label: 'Understood', class: 'btn-primary' }],
  });
});

$('#btn-continue').classList.toggle('hidden', !hasSave());
