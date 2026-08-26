// SCENE 4 — The Records Room / The Database (half-info deduction).
// Four safe-deposit boxes I-IV; one holds the real vault key.
//   Hand's physical view rules out I and IV (drilled decoys).
//   Eye's database rules out II and IV ("contents relocated").
//   Only box III survives both. Both select III.
// The Eye (P2) lifts vault-pin c (position 3, digit 9).

import { getRole, isHand, roleName, otherRoleName } from '../role.js';
import { defs, backdrop, ambient, roleTag } from '../heistkit.js';

const SLUG = 'rec';
const BOXES = ['I', 'II', 'III', 'IV'];
const ANSWER = 'III';
// What THIS player can rule out (and reads to their partner).
const MY_OUT = {
  p1: { boxes: ['I', 'IV'], why: 'drilled and re-sealed — decoys' },
  p2: { boxes: ['II', 'IV'], why: 'flagged "contents relocated"' },
};

function isSolved(state) { return !!state.flags.records_solved; }

export default {
  id: 'records',
  get title() { return `${roleName()} · The Records Room`; },
  get intro() {
    return isHand()
      ? 'The records room: four safe-deposit boxes, one of them holding the vault key. You can see which have been drilled and faked — but not which are simply empty. Your partner\'s database knows that half. Rule out yours, hear out theirs, and only one box is left.'
      : 'The building\'s deposit database is open on your console. You can see which boxes were quietly emptied weeks ago — but not which have been tampered with in the flesh. The Hand can see that half. Cross both lists; one box survives.';
  },

  scene(state) {
    const done = isSolved(state);
    const pinHere = getRole() === 'p2' && !state.journal.some(e => e.id === 'pin_c');
    const out = MY_OUT[getRole()].boxes;

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}</defs>
      ${backdrop(SLUG)}

      <!-- the four boxes -->
      <g font-family="Consolas, monospace" text-anchor="middle">
        ${BOXES.map((b, i) => {
          const x = 470 + i * 200, y = 560;
          const ruled = out.includes(b);
          const chosen = done && b === ANSWER;
          const col = chosen ? '#8fe0a0' : ruled ? '#ff6b6b' : (isHand() ? '#c9a227' : '#7cffb2');
          return `<g>
            <rect x="${x - 70}" y="${y}" width="140" height="150" rx="8" fill="#0b141c" stroke="${col}" stroke-width="3" opacity="${ruled ? 0.5 : 1}"/>
            <circle cx="${x}" cy="${y + 60}" r="12" fill="none" stroke="${col}" stroke-width="3"/>
            <text x="${x}" y="${y + 118}" font-size="26" fill="${col}">${b}</text>
            ${ruled ? `<line x1="${x - 70}" y1="${y}" x2="${x + 70}" y2="${y + 150}" stroke="#ff6b6b" stroke-width="3" opacity="0.7"/>` : ''}
            ${chosen ? `<text x="${x}" y="${y - 14}" font-size="13" fill="#8fe0a0">KEY</text>` : ''}
          </g>`;
        }).join('')}
      </g>

      <!-- this player's own eliminations, posted (read these to the partner) -->
      <g>
        <rect x="1080" y="160" width="440" height="150" rx="8" fill="#0b141c" stroke="${isHand() ? '#c9a227' : '#7cffb2'}" stroke-width="4"/>
        <text x="1300" y="200" text-anchor="middle" font-size="14" fill="${isHand() ? '#8aa0b4' : '#4f9c78'}" font-family="Consolas, monospace" letter-spacing="2">${isHand() ? 'YOUR EYES — ruled out' : 'DATABASE — ruled out'}</text>
        <text x="1300" y="252" text-anchor="middle" font-size="26" fill="#ff8f8f" font-family="Consolas, monospace" letter-spacing="4">${out.join('  &  ')}</text>
        <text x="1300" y="288" text-anchor="middle" font-size="12" fill="#7f8a99" font-family="Consolas, monospace">${MY_OUT[getRole()].why} · tell your partner</text>
      </g>

      ${done ? `<text x="800" y="800" text-anchor="middle" font-size="18" fill="#8fe0a0" font-family="Consolas, monospace">box III — the vault key is in your hand</text>` : ''}

      ${pinHere ? `
      <g class="beckon">
        <rect x="1050" y="600" width="40" height="60" rx="6" fill="rgba(87,214,230,0.08)" stroke="#57d6e6" stroke-width="3"/>
        <text x="1070" y="638" text-anchor="middle" font-size="20" fill="#7cffb2" font-family="Consolas, monospace" font-weight="bold">3</text>
      </g>` : ''}

      ${roleTag()}
      ${ambient(SLUG)}
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const done = isSolved(state);

    spots.push({
      id: 'mine', x: 1080, y: 160, w: 440, h: 150, label: isHand() ? 'What you can see' : 'The database flags',
      onInteract(game) {
        const o = MY_OUT[getRole()];
        const html = `<div class="console-card"><div class="console-title">${isHand() ? 'Boxes you can rule out' : 'Boxes the database rules out'}</div>
          <p style="text-align:center;font-size:22px;color:#ff8f8f;letter-spacing:4px;">${o.boxes.join('  &nbsp; ')}</p>
          <p style="text-align:center;">${o.why}</p></div>
          <div class="relay">You can only rule out these. Read them to your partner and ask which <strong>they</strong> rule out. The box neither of you names is the one.</div>`;
        game.journal.add('note_rec4', { title: isHand() ? 'Boxes ruled out (physical)' : 'Boxes ruled out (database)', category: 'note', html });
        game.dialog({ title: 'Your Half', html });
      },
    });

    if (getRole() === 'p2') {
      spots.push({
        id: 'client4', x: 340, y: 160, w: 300, h: 120, label: "The Client's feed",
        onInteract(game) {
          const html = `<div class="client-feed">Box III. Take the key. Leave the ledger — don't touch the ledger.</div>
            <div class="dossier"><div class="dossier-title">Your note</div><p>The Client already knows it's box III. And why leave the ledger — the one record of who owns the Nightingale? What's in it they don't want walking out?</p></div>`;
          game.journal.add('note_client4', { title: 'Client — leave the ledger', category: 'note', html });
          game.dialog({ title: 'The Client Pings', html });
        },
      });
    } else {
      spots.push({
        id: 'ledger', x: 340, y: 160, w: 300, h: 120, label: 'A heavy ledger',
        onInteract(game) { game.say('An old provenance ledger, chained to the desk. Names, dates, sales — who really owns what in this building. Worth reading. Worth taking, maybe.'); },
      });
    }

    if (getRole() === 'p2' && !state.journal.some(e => e.id === 'pin_c')) {
      spots.push({
        id: 'pin_c', x: 1040, y: 590, w: 70, h: 90, label: 'A pin on the manifest',
        onInteract(game) {
          game.journal.add('pin_c', { title: 'Decrypted manifest line', category: 'sun', sun: { rays: 3, letter: '9' } });
          game.say('A decrypted manifest line coughs up more than box flags: position 3, digit 9 — a vault-pin. Logged.');
          game.refreshScene();
        },
      });
    }

    if (!done) {
      spots.push({
        id: 'boxes', x: 400, y: 540, w: 800, h: 190, label: 'The four boxes',
        onInteract(game) { openBoxes(game); },
      });
    } else {
      spots.push({
        id: 'onward', x: 400, y: 540, w: 800, h: 190, label: isHand() ? 'On with the key' : 'On to the clock hall',
        onInteract(game) {
          if (getRole() === 'p2' && !game.journal.has('pin_c')) { game.say('There is a vault-pin on the manifest — pull it before you move on.'); return; }
          game.completeRoom({ delay: 600 });
        },
      });
    }

    return spots;
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: 'You can only rule out half the boxes. Your partner rules out a different half. The box neither of you names is the key.', cost: 60 },
      { text: isHand() ? 'You can see which are drilled decoys (I and IV). Ask your partner which the database calls "relocated."' : 'You can read which are "relocated" (II and IV). Ask your partner which are drilled decoys.', cost: 120 },
      { text: 'Box III — the only one on neither list.', cost: 240 },
    ];
  },
};

function openBoxes(game) {
  let picked = null;
  game.openPuzzle({
    id: 'records_boxes',
    title: 'Which Box Holds the Key?',
    render(body, api) {
      body.innerHTML = `
        <div class="puzzle-hero pz-deposit"></div>
        <p class="puzzle-desc">Cross your ruled-out boxes with your partner's. Choose the one
        box neither of you ruled out, and open it.</p>
        <div class="puzzle-row" id="rec-opts"></div>
        <div class="puzzle-row"><button class="btn btn-primary" id="rec-go">Open It</button></div>
        <div class="puzzle-feedback"></div>`;
      const row = body.querySelector('#rec-opts');
      BOXES.forEach(b => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-ghost';
        btn.style.minWidth = '64px';
        btn.textContent = b;
        btn.addEventListener('click', () => {
          picked = b;
          row.querySelectorAll('.btn').forEach(x => x.classList.remove('btn-primary'));
          btn.classList.add('btn-primary');
          game.playSfx('click');
        });
        row.appendChild(btn);
      });
      body.querySelector('#rec-go').addEventListener('click', () => {
        if (picked === ANSWER) {
          game.setFlag('records_solved');
          game.playSfx('unlock');
          api.solved({ message: isHand()
            ? 'Box III swings open on the vault key, cold and toothy. The decoys stay shut behind you.'
            : 'The database confirms box III as you watch The Hand crack it — the only box neither list condemned. Key\'s in play.' });
          game.refreshScene();
        } else if (picked) {
          api.fail(`Box ${picked} is on someone's ruled-out list. Recheck both halves with your partner.`);
        } else {
          api.fail('Pick a box first.');
        }
      });
    },
  });
}
