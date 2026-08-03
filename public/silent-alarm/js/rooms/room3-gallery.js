// SCENE 3 — The Marble Gallery / The Laser Grid (decode — one sees, one reads the book).
// Each player SEES flash-counts they can't map and HOLDS the page for the OTHER's flashes.
//   Hand sees laser counts [1,2,3,4]; Eye's page A {1:S,2:A,3:F,4:E} → Hand enters SAFE
//   Eye sees alarm counts [4,1,3,2]; Hand's page B {1:A,2:K,3:R,4:D} → Eye enters DARK
// The Hand (P1) lifts vault-pin d (position 4, digit 4).

import { getRole, isHand, roleName, otherRoleName } from '../role.js';
import { defs, backdrop, ambient, roleTag } from '../heistkit.js';

const SLUG = 'gal';
// What THIS player sees flashing (reads the counts to the partner).
const MY_COUNTS = { p1: [1, 2, 3, 4], p2: [4, 1, 3, 2] };
// The codebook page THIS player HOLDS (reads letters to the partner on request).
const MY_PAGE = {
  p1: { 1: 'A', 2: 'K', 3: 'R', 4: 'D' },   // Hand holds page B (for the Eye's alarm blinks)
  p2: { 1: 'S', 2: 'A', 3: 'F', 4: 'E' },   // Eye holds page A (for the Hand's laser flashes)
};
// What THIS player must enter (their own counts decoded via the PARTNER's page).
const MY_ANSWER = { p1: 'SAFE', p2: 'DARK' };

function isSolved(state) { return !!state.flags.gallery_solved; }

export default {
  id: 'gallery',
  get title() { return `${roleName()} · The Marble Gallery`; },
  get intro() {
    return isHand()
      ? 'The long marble gallery, and a grid of red laser between you and the far door. You can see the beams flash in bursts — but the map that turns those bursts into a safe path is on your partner\'s console. Read them the counts; they will read you the word.'
      : 'The alarm panel is chattering — a sequence of blinks you have no legend for. But the grid schematic on your console decodes the lasers The Hand is staring at. You each see a code you can\'t read and hold the book for the other\'s. Trade in both directions.';
  },

  scene(state) {
    const done = isSolved(state);
    const pinHere = isHand() && !state.journal.some(e => e.id === 'pin_d');
    const counts = MY_COUNTS[getRole()];
    const page = MY_PAGE[getRole()];

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}
        <style>@keyframes ${SLUG}_bl{0%,60%{opacity:1}61%,100%{opacity:0.15}} .${SLUG}_pip{animation:${SLUG}_bl 1.4s steps(1) infinite;}</style>
      </defs>
      ${backdrop(SLUG)}

      <!-- the thing THIS player watches flashing: laser emitter (Hand) or alarm LED (Eye) -->
      <g>
        <rect x="520" y="470" width="220" height="120" rx="10" fill="#0b141c" stroke="${isHand() ? '#ff3b57' : '#7cffb2'}" stroke-width="3"/>
        <text x="630" y="506" text-anchor="middle" font-size="13" fill="#7f8a99" font-family="Consolas, monospace">${isHand() ? 'LASER EMITTER' : 'ALARM PANEL'}</text>
        <circle cx="630" cy="550" r="16" fill="${isHand() ? '#ff3b57' : '#7cffb2'}" class="${SLUG}_pip"/>
      </g>

      <!-- recorded counts readout (static, what you read to your partner) -->
      <g>
        <rect x="500" y="620" width="260" height="130" rx="8" fill="#0b141c" stroke="#57d6e6" stroke-width="2"/>
        <text x="630" y="654" text-anchor="middle" font-size="13" fill="#8aa0b4" font-family="Consolas, monospace">RECORDED BURSTS</text>
        <text x="630" y="704" text-anchor="middle" font-size="30" fill="#eafff2" font-family="Consolas, monospace" letter-spacing="6">${counts.join('  ')}</text>
        <text x="630" y="734" text-anchor="middle" font-size="11" fill="#7f8a99" font-family="Consolas, monospace">flashes per burst · read to your partner</text>
      </g>

      <!-- the codebook page THIS player holds (for the OTHER's flashes) -->
      <g>
        <rect x="1080" y="150" width="440" height="200" rx="8" fill="#0b141c" stroke="${isHand() ? '#c9a227' : '#7cffb2'}" stroke-width="4"/>
        <text x="1300" y="190" text-anchor="middle" font-size="14" fill="${isHand() ? '#8aa0b4' : '#4f9c78'}" font-family="Consolas, monospace" letter-spacing="2">${isHand() ? 'ALARM LEGEND (page for the Eye)' : 'GRID SCHEMATIC (page for the Hand)'}</text>
        <g font-family="Consolas, monospace" text-anchor="middle" font-size="20" fill="#e8e2d4">
          ${[1, 2, 3, 4].map((n, i) => `<text x="${1140 + i * 105}" y="250">${n} → ${page[n]}</text>`).join('')}
        </g>
        <text x="1300" y="312" text-anchor="middle" font-size="12" fill="#7f8a99" font-family="Consolas, monospace">read a letter when your partner reads you a count</text>
      </g>

      ${done ? `<text x="800" y="820" text-anchor="middle" font-size="18" fill="#8fe0a0" font-family="Consolas, monospace">${isHand() ? 'the beams die — the floor is safe to cross' : 'the panel goes dark and quiet'}</text>` : ''}

      ${pinHere ? `
      <g class="beckon">
        <rect x="1050" y="600" width="40" height="60" rx="6" fill="rgba(87,214,230,0.08)" stroke="#57d6e6" stroke-width="3"/>
        <text x="1070" y="638" text-anchor="middle" font-size="20" fill="#7cffb2" font-family="Consolas, monospace" font-weight="bold">4</text>
      </g>` : ''}

      ${roleTag()}
      ${ambient(SLUG)}
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const done = isSolved(state);

    spots.push({
      id: 'counts', x: 500, y: 620, w: 260, h: 130, label: isHand() ? 'The laser bursts' : 'The alarm blinks',
      onInteract(game) {
        const counts = MY_COUNTS[getRole()];
        const html = `<div class="console-card"><div class="console-title">${isHand() ? 'Laser emitter — bursts' : 'Alarm panel — blinks'}</div>
          <p>Count the flashes in each burst, in order:</p>
          <p style="font-size:26px;letter-spacing:8px;color:#eafff2;text-align:center;">${counts.join('  ')}</p></div>
          <div class="relay">You can see these but can't read them. Read the four counts to your partner; their page turns them into your word.</div>`;
        game.journal.add('note_counts3', { title: isHand() ? 'Laser bursts' : 'Alarm blinks', category: 'note', html });
        game.dialog({ title: isHand() ? 'The Bursts' : 'The Blinks', html });
      },
    });

    spots.push({
      id: 'page', x: 1080, y: 150, w: 440, h: 200, label: isHand() ? 'The alarm legend' : 'The grid schematic',
      onInteract(game) {
        const page = MY_PAGE[getRole()];
        const rows = [1, 2, 3, 4].map(n => `${n} → <b>${page[n]}</b>`).join(' &nbsp; ');
        const html = `<div class="console-card"><div class="console-title">${isHand() ? 'Alarm legend — the Eye\'s page' : 'Grid schematic — the Hand\'s page'}</div>
          <p style="text-align:center;font-size:18px;">${rows}</p></div>
          <div class="relay">This page decodes your <strong>partner's</strong> flashes, not yours. When they read you a count, read them the letter.</div>`;
        game.journal.add('note_page3', { title: isHand() ? 'Alarm legend (page)' : 'Grid schematic (page)', category: 'note', html });
        game.dialog({ title: isHand() ? 'The Legend' : 'The Schematic', html });
      },
    });

    spots.push({
      id: 'floor', x: 300, y: 300, w: 200, h: 160, label: isHand() ? 'The laser grid' : 'The floor feed',
      onInteract(game) {
        game.say(done
          ? (isHand() ? 'The red web is gone; the marble is just marble again.' : 'The grid reads all-clear across The Hand\'s route.')
          : (isHand() ? 'A lattice of red beams, ankle to shoulder. One touched and the whole night is over. There is a safe way through — your partner can read it.' : 'The floor sensors show a live laser lattice on The Hand\'s side. The safe pattern is in the schematic.'));
      },
    });

    // the shared foreshadow: a guard's dropped note (either role can find it)
    spots.push({
      id: 'guardnote', x: 830, y: 470, w: 190, h: 120, label: 'A dropped note',
      onInteract(game) {
        const html = `<div class="dossier"><div class="dossier-title">Note — a guard's hand</div>
          <p>"new owner wants the bird gone before the insurance audit. told to look the other way sat night. easy money??"</p></div>
          <div class="relay">Stolen to order, before an audit? This might not be a burglary. Keep it in the file — tell your partner.</div>`;
        game.journal.add('note_guard3', { title: 'Guard\'s note — the audit', category: 'note', html });
        game.dialog({ title: 'The Dropped Note', html });
      },
    });

    if (isHand() && !state.journal.some(e => e.id === 'pin_d')) {
      spots.push({
        id: 'pin_d', x: 1040, y: 590, w: 70, h: 90, label: 'A pin on the plinth',
        onInteract(game) {
          game.journal.add('pin_d', { title: 'Statue plinth', category: 'sun', sun: { rays: 4, letter: '4' } });
          game.say('Screwed into the base of a plinth, where a guard would never look: a steel pin, position 4, digit 4. Logged.');
          game.refreshScene();
        },
      });
    }

    if (!done) {
      spots.push({
        id: 'enter', x: 500, y: 470, w: 260, h: 120, label: isHand() ? 'The path panel' : 'The alarm console',
        onInteract(game) { openDecode(game); },
      });
    } else {
      spots.push({
        id: 'cross', x: 500, y: 470, w: 260, h: 120, label: isHand() ? 'Cross the gallery' : 'The quiet panel',
        onInteract(game) {
          if (isHand() && !game.journal.has('pin_d')) { game.say('There is a pin on the plinth — take it before you cross.'); return; }
          game.completeRoom({ delay: 600 });
        },
      });
    }

    return spots;
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: 'You can see the flashes; you cannot read them. Your partner has the book for yours — read them the four counts, in order.', cost: 60 },
      { text: 'Count each burst: flashes, pause, flashes. Four groups, four letters. Your partner\'s page turns your counts into your word; your page turns theirs into theirs.', cost: 120 },
      { text: isHand() ? 'Your word is SAFE.' : 'Your word is DARK.', cost: 240 },
    ];
  },
};

function openDecode(game) {
  const answer = MY_ANSWER[getRole()];

  game.openPuzzle({
    id: 'gallery_decode',
    title: isHand() ? 'The Safe-Path Panel' : 'The Alarm Console',
    render(body, api) {
      body.innerHTML = `
        <p class="puzzle-desc">Read your four burst-counts to your partner. They decode them on
        their page and read you a four-letter word. Enter it.</p>
        <div class="puzzle-row">
          <input class="puzzle-input" id="gal-word" maxlength="4" autocomplete="off"
            placeholder="4 letters" style="text-transform:uppercase;letter-spacing:10px;text-align:center;width:200px;" />
        </div>
        <div class="puzzle-row"><button class="btn btn-primary" id="gal-go">${isHand() ? 'Kill the Grid' : 'Silence the Panel'}</button></div>
        <div class="puzzle-feedback"></div>`;
      const input = body.querySelector('#gal-word');
      const submit = () => {
        const v = (input.value || '').trim().toUpperCase();
        if (v === answer) {
          game.setFlag('gallery_solved');
          game.playSfx('unlock');
          api.solved({ message: isHand()
            ? 'You key the word and the laser grid folds away, beam by beam, into the dark. The marble is yours to cross.'
            : 'The word lands and the alarm panel drops quiet mid-chatter. Whatever it was about to do, it isn\'t doing it.' });
          game.refreshScene();
        } else {
          api.fail('That is not the word — recheck the counts and the page with your partner.');
        }
      };
      body.querySelector('#gal-go').addEventListener('click', submit);
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
    },
  });
}
