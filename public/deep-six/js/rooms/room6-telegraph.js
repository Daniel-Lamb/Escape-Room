// SCENE 6 — The Engine Telegraph (coupled mechanism).
// Diver: four pointers driven by three COUPLED levers (A moves 1&2, B moves 2&3,
// C moves 3&4). Match the target on the Tender's schematic -> A,B,C once each.
// Tender: set the winch to the load figure shown on the Diver's screen (12).
// Tender recovers depth-mark D (20 fathoms).

import { getRole, isDiver, isTender } from '../role.js';
import { defs, backdrop, ambient, roleTag, relayPlaque, markBeckon, lockPanel, comboLock, loreSpot } from '../divekit.js';

const SLUG = 'telegraph';
const TG_TARGET = [1, 2, 2, 1];              // the diver's coupled-pointer goal
const WINCH = '12';                          // the tender's winch load figure
const other = () => (getRole() === 'p1' ? 'p2' : 'p1');
// what THIS screen shows the partner: diver holds the winch load; tender holds the telegraph target
const relayFor = () => (isDiver() ? WINCH : TG_TARGET.join('·'));
const relayLabel = () => (isDiver() ? 'WINCH LOAD · topside' : 'TELEGRAPH TARGET · below');
const hasMark = (state) => state.journal.some(e => e.id === 'mark_d');

export default {
  id: 'telegraph',
  get title() { return isDiver() ? 'The Engine Telegraph' : 'The Winch'; },
  get intro() {
    return isDiver()
      ? 'The engine-order-telegraph still turns — but its four pointers are geared in pairs, so no lever moves just one. Walk them to the setting on your tender\'s schematic; the levers fight you the way coupled things do.'
      : 'The salvage winch will only bite at one load figure, and that figure is on your diver\'s gauge below. Set it, and read them the pointer target off your schematic in return.';
  },

  scene(state) {
    const open = !!state.flags.telegraph_open;
    const closed = isDiver()
      ? `<text x="800" y="700" text-anchor="middle" font-size="15" fill="#8fa3b8" font-family="Consolas, monospace">ENGINE TELEGRAPH · FOUR COUPLED POINTERS</text>
         ${[0, 1, 2, 3].map(i => `<circle cx="${700 + i * 66}" cy="748" r="26" fill="#101a26" stroke="#ffcf6a" stroke-width="3"/>`).join('')}`
      : `<text x="800" y="700" text-anchor="middle" font-size="15" fill="#8fa3b8" font-family="Consolas, monospace">WINCH LOAD · TWO FIGURES</text>
         ${[0, 1].map(i => `<circle cx="${760 + i * 80}" cy="748" r="28" fill="#101a26" stroke="#7cf0be" stroke-width="3"/>`).join('')}`;
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}</defs>
      ${backdrop(SLUG)}
      ${roleTag()}
      ${relayPlaque(relayFor(), relayLabel())}
      ${lockPanel(620, 636, open, isDiver() ? 'TELEGRAPH' : 'WINCH', closed)}
      ${isTender() && !hasMark(state) ? markBeckon(1108, 636, 20, 'D') : ''}
      ${ambient(SLUG)}
      <path d="M0 900 L0 862 Q800 905 1600 862 L1600 900 Z" fill="#02080c"/>
    </svg>`;
  },

  hotspots(state) {
    const open = !!state.flags.telegraph_open;
    const spots = [];
    const forWhat = isDiver() ? 'winch load' : 'telegraph target';

    spots.push({
      id: 'relay', x: 556, y: 138, w: 488, h: 184, label: `The ${forWhat} (for your partner)`,
      onInteract(game) {
        const html = `<div class="chartcard"><div class="chart-title">${forWhat}</div>
          <p>Read off your side, meant for the other:</p>
          <p style="font-size:30px;letter-spacing:6px;color:#eafffb;text-align:center;">${relayFor()}</p>
          ${isTender() ? '<p style="opacity:0.8">Four pointer positions, in order — 1, 2, 3, 4.</p>' : ''}</div>
          <div class="relay">This is <strong>your partner's</strong> figure. Read it across the line.</div>`;
        game.journal.add('telegraph_relay', { title: forWhat, category: 'note', html });
        game.dialog({ title: forWhat, html });
      },
    });

    spots.push(isDiver()
      ? loreSpot({ id: 'lore_bell', x: 240, y: 410, w: 250, h: 190, label: "The ship's bell", title: "The Cormorant's Bell",
          html: `<div class="logbook"><div class="log-title">still hung in the machinery space</div><p>Green with forty years, her name raised in the bronze: <strong>CORMORANT</strong>. You could bring her up — not the strongbox the brief wants, but this. The truth of her, back into the light. Gus noses at it, and for once the seal is still.</p></div>` })
      : loreSpot({ id: 'lore_log', x: 1214, y: 470, w: 240, h: 150, label: "The captain's log", title: "The Last Entry",
          html: `<div class="chartcard"><div class="chart-title">cormorant · master's log</div><p style="font-style:italic;">"Fog thick, both lights showing — and showing different. God help me choose the true one."</p><p style="opacity:0.8">The hand stops there. There is no next line.</p></div>` }));

    if (isTender() && !hasMark(state)) {
      spots.push({
        id: 'mark_d', x: 1108, y: 636, w: 92, h: 120, label: 'A depth-mark on the winch',
        onInteract(game) {
          game.journal.add('mark_d', { title: 'Winch drum — depth-mark', category: 'sun', sun: { rays: 20, letter: 'D' } });
          game.say('The deepest mark yet, wired to the winch drum: "20 fm", letter D. That is all six between you now.');
          game.refreshScene();
        },
      });
    }

    if (!open) {
      spots.push({
        id: 'lock', x: 620, y: 636, w: 360, h: 196, label: isDiver() ? 'The engine telegraph' : 'The winch',
        onInteract(game) { isDiver() ? openTelegraph(game) : openWinch(game); },
      });
    } else {
      spots.push({
        id: 'through', x: 620, y: 636, w: 360, h: 196, label: isDiver() ? 'Bulkhead clear' : 'Winch set',
        onInteract(game) {
          if (isTender() && !state.journal.some(e => e.id === 'mark_d')) { game.say('Take the last depth-mark off the winch first.'); return; }
          game.say(isDiver() ? 'The pointers hold and the last bulkhead grinds up. The ascent shaft is ahead.' : 'The winch bites true; the line is ready to haul. Time to bring your diver up.');
          game.completeRoom({ delay: 600 });
        },
      });
    }
    return spots;
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: isDiver() ? 'No lever moves one pointer alone — each drives two. Ask your tender for the four-pointer target and reason the presses out.' : 'Your winch load is on your diver\'s gauge, not yours. Ask them. Read them the four pointer positions in return.', cost: 60 },
      { text: isDiver() ? 'Lever A drives pointers 1&2, B drives 2&3, C drives 3&4. The target is 1-2-2-1. Work out how many pulls of each.' : 'Set the winch to the two-figure load your diver reads you.', cost: 120 },
      { text: isDiver() ? 'Pull A once, B once, C once — that gives 1-2-2-1.' : 'The winch load is 12.', cost: 240 },
    ];
  },
};

function openWinch(game) {
  comboLock(game, {
    id: 'telegraph_winch', title: 'The Winch',
    desc: 'Two figures. The load the winch will bite is on your diver\'s gauge, not yours. Ask them.',
    slots: [{ type: 'digit' }, { type: 'digit' }],
    target: WINCH, goLabel: 'Set the Load',
    solvedMsg: 'The winch takes up the load and holds it steady.',
    failMsg: 'The drum slips. Wrong load — check with your diver.',
    onSolve(g) { g.setFlag('telegraph_open'); g.refreshScene(); },
  });
}

function openTelegraph(game) {
  const p = [0, 0, 0, 0];
  const pairs = { A: [0, 1], B: [1, 2], C: [2, 3] };
  game.openPuzzle({
    id: 'telegraph_tg', title: 'The Engine Telegraph',
    render(body, api) {
      body.innerHTML = `
        <p class="puzzle-desc">Four pointers (each wraps 0–3), three <em>coupled</em> levers:
        <strong>A</strong> turns 1&amp;2, <strong>B</strong> turns 2&amp;3, <strong>C</strong> turns 3&amp;4.
        Walk them to the target on your tender's schematic — ask them for it.</p>
        <div class="puzzle-row" id="tg-ptr"></div>
        <div class="puzzle-row" id="tg-lev"></div>
        <div class="puzzle-feedback"></div>`;
      const ptr = body.querySelector('#tg-ptr');
      const draw = () => {
        ptr.innerHTML = p.map((v, i) => `<div class="dial"><div class="dial-face">${v}</div><div class="lever-label">${i + 1}</div></div>`).join('');
      };
      draw();
      const lev = body.querySelector('#tg-lev');
      ['A', 'B', 'C'].forEach(k => {
        const b = document.createElement('button');
        b.className = 'btn btn-primary';
        b.textContent = `Pull ${k}`;
        b.addEventListener('click', () => {
          pairs[k].forEach(i => { p[i] = (p[i] + 1) % 4; });
          draw();
          const face = ptr.querySelectorAll('.dial-face');
          pairs[k].forEach(i => { face[i].classList.remove('tick'); void face[i].offsetWidth; face[i].classList.add('tick'); });
          game.playSfx('click');
          if (p.join('') === TG_TARGET.join('')) {
            game.playSfx('unlock');
            api.solved({ message: 'The four pointers swing home together and the machinery-space bulkhead unseats.' });
            game.setFlag('telegraph_open');
            game.refreshScene();
          }
        });
        lev.appendChild(b);
      });
      const r = document.createElement('button');
      r.className = 'btn btn-ghost';
      r.textContent = 'Reset';
      r.addEventListener('click', () => { p.fill(0); draw(); });
      lev.appendChild(r);
    },
  });
}
