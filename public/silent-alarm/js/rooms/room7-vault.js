// SCENE 7 — The Vault / The Nightingale (finale + META + twist payoff).
// Both sides must enter the 6-digit master, spelled by all six vault-pins sorted
// by position (1..6): pos1=7 pos2=2 pos3=9 pos4=4 pos5=1 pos6=6 -> 729416.
// Each job file holds only three pins - Hand: positions 2,4,6 (=2,4,6);
// Eye: positions 1,3,5 (=7,9,1) - so the master needs both files.
// The Client's voice pushes 000000 (the frame). Trust the pins, not the voice.

import { getRole, isHand, roleName } from '../role.js';
import { defs, backdrop, ambient, roleTag } from '../heistkit.js';

const SLUG = 'vlt';
const ANSWER = '729416';
const CLIENT_CODE = '000000';

function won(state) { return !!state.flags.vault_open; }

export default {
  id: 'vault',
  get title() { return `${roleName()} · The Vault`; },
  get intro() {
    return isHand()
      ? 'The vault, and the Larkspur Nightingale on its stand behind the last door — a six-digit master between you and it. The Client\'s voice wants one number; your six pins spell another. You carry only three. Read them to your partner, take theirs, and set the master the pins make — not the one in your ear.'
      : 'The vault timelock is the last thing on your console — six digits, and Gus says the Client will spring their trap the instant it opens on the wrong one. You hold three pins; The Hand holds three. Pool them, order them, and override with the master the pins spell. Ignore the code the Client keeps pushing.';
  },

  scene(state) {
    const done = won(state);
    // this player's own three pins (from the file), sorted by position
    const mine = state.journal.filter(e => e.category === 'sun').sort((a, b) => a.sun.rays - b.sun.rays);

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}</defs>
      ${backdrop(SLUG)}

      <!-- the vault door / the Nightingale beyond -->
      <g>
        <circle cx="800" cy="330" r="140" fill="${done ? '#12303f' : '#141c26'}" stroke="#2b3d48" stroke-width="12"/>
        <circle cx="800" cy="330" r="150" fill="none" stroke="${done ? '#8fe0a0' : '#57d6e6'}" stroke-width="3" opacity="0.5"/>
        ${done
          ? `<g transform="translate(800 330)">
               <ellipse cx="0" cy="10" rx="30" ry="22" fill="#e8c85a"/>
               <circle cx="-6" cy="-16" r="16" fill="#e8c85a"/>
               <path d="M8 -18 l24 -8 l-18 16 z" fill="#c9a227"/>
               <circle cx="-10" cy="-18" r="3" fill="#141c26"/>
               <text y="70" text-anchor="middle" font-size="14" fill="#8fe0a0" font-family="Consolas, monospace">THE LARKSPUR NIGHTINGALE</text>
             </g>`
          : `<g font-family="Consolas, monospace" text-anchor="middle">
               <rect x="756" y="300" width="88" height="64" rx="8" fill="#0b141c" stroke="#c9a227" stroke-width="3"/>
               <text x="800" y="330" font-size="12" fill="#7f8a99">MASTER</text>
               <text x="800" y="352" font-size="20" fill="#e8c85a">6-DIGIT</text>
             </g>`}
      </g>

      <!-- the maker's plate (meta rule) -->
      <g>
        <rect x="1100" y="150" width="420" height="150" rx="8" fill="#0b141c" stroke="#c9a227" stroke-width="4"/>
        <text x="1310" y="190" text-anchor="middle" font-size="14" fill="#8aa0b4" font-family="Consolas, monospace" letter-spacing="2">THE MAKER'S PLATE</text>
        <text x="1310" y="228" text-anchor="middle" font-size="15" fill="#e8e2d4" font-family="Georgia, serif">"The master runs first pin</text>
        <text x="1310" y="252" text-anchor="middle" font-size="15" fill="#e8e2d4" font-family="Georgia, serif">to last — position one</text>
        <text x="1310" y="276" text-anchor="middle" font-size="15" fill="#e8e2d4" font-family="Georgia, serif">through six."</text>
      </g>

      <!-- this player's three pins on a rack (read these to your partner) -->
      <g>
        <rect x="120" y="600" width="470" height="200" rx="10" fill="#0b1a13" stroke="#7cffb2" stroke-width="3"/>
        <text x="355" y="640" text-anchor="middle" font-size="14" fill="#7cffb2" font-family="Consolas, monospace" letter-spacing="2">YOUR THREE PINS</text>
        ${mine.map((e, i) => `
          <g transform="translate(${190 + i * 130} 720)">
            <rect x="-16" y="-34" width="32" height="52" rx="7" fill="#20303a" stroke="#57d6e6" stroke-width="2"/>
            <text y="-4" text-anchor="middle" font-size="22" fill="#7cffb2" font-family="Consolas, monospace" font-weight="bold">${e.sun.letter}</text>
            <text y="34" text-anchor="middle" font-size="14" fill="#e8c85a" font-family="Consolas, monospace">pos ${e.sun.rays}</text>
          </g>`).join('')}
        <text x="355" y="790" text-anchor="middle" font-size="12" fill="#7f8a99" font-family="Consolas, monospace">read position + digit to your partner</text>
      </g>

      ${roleTag()}
      ${ambient(SLUG)}
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const done = won(state);

    spots.push({
      id: 'plate', x: 1100, y: 150, w: 420, h: 150, label: "The maker's plate",
      onInteract(game) {
        const html = `<div class="dossier"><div class="dossier-title">The maker's plate</div>
          <p>"The master runs first pin to last — <strong>position one through six</strong>."</p></div>
          <div class="relay">You hold three pins; your partner holds three. Read yours to each other, put all six in order by position (1 first), and set that six-digit master. Ignore the code the Client's voice is pushing.</div>`;
        game.journal.add('note_plate7', { title: "The maker's plate", category: 'note', html });
        game.dialog({ title: 'The Plate', html });
      },
    });

    spots.push({
      id: 'pins', x: 120, y: 600, w: 470, h: 200, label: 'Your three pins',
      onInteract(game) {
        const mine = game.state.journal.filter(e => e.category === 'sun').sort((a, b) => a.sun.rays - b.sun.rays);
        const list = mine.map(e => `position <b>${e.sun.rays}</b> = "<b>${e.sun.letter}</b>"`).join(' &nbsp; · &nbsp; ');
        const html = `<div class="console-card"><div class="console-title">${roleName()} — pins in your file</div>
          <p style="text-align:center;">${list || 'none yet'}</p></div>
          <div class="relay">Read these three to your partner and get their three. Sorted by position 1→6, all six are the master.</div>`;
        game.dialog({ title: 'Your Pins', html });
      },
    });

    spots.push({
      id: 'client7', x: 620, y: 620, w: 360, h: 120, label: "The Client's voice",
      onInteract(game) {
        game.say(done
          ? 'The Client is still talking to a code that never came. Somewhere a trip fires into a dead wire and nothing answers.'
          : 'The Client, fast and flat in your ear: "Enter zero-zero-zero-zero-zero-zero to release the case. Only that." Gus\'s ear goes flat. That is the trap. Set the pins instead.');
      },
    });

    if (!done) {
      spots.push({
        id: 'keypad', x: 700, y: 260, w: 200, h: 150, label: 'The master keypad',
        onInteract(game) { openVault(game); },
      });
    }

    return spots;
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: 'Six pins make the master; you carry only three. Your partner carries the other three — trade them.', cost: 60 },
      { text: 'Read each other your pins as "position, digit." Lay all six out by position, one first, and read off the six-digit number. Ignore the Client\'s code.', cost: 120 },
      { text: 'The master is 7-2-9-4-1-6.', cost: 240 },
    ];
  },
};

function openVault(game) {
  game.openPuzzle({
    id: 'vault_master',
    title: 'The Master Timelock',
    render(body, api) {
      body.innerHTML = `
        <p class="puzzle-desc">Pool all six pins — your three and your partner's — in order by
        position, one first. Enter the six-digit master. (Not the Client's code.)</p>
        <div class="puzzle-row">
          <input class="puzzle-input" id="vlt-code" maxlength="6" inputmode="numeric" autocomplete="off"
            placeholder="6 digits" style="letter-spacing:12px;text-align:center;width:260px;" />
        </div>
        <div class="puzzle-row"><button class="btn btn-primary" id="vlt-go">Override the Lock</button></div>
        <div class="puzzle-feedback"></div>`;
      const input = body.querySelector('#vlt-code');
      const submit = () => {
        const v = (input.value || '').trim();
        if (v === ANSWER) {
          game.setFlag('vault_open');
          game.playSfx('victory');
          game.refreshScene();
          game.say('The master takes. The vault sighs open on the Nightingale, and the silent alarm stays silent — the Client\'s trip firing into a wire Gus killed three rooms ago. You lift the bird, cold and singing to no one, and go the way the rat mapped.');
          game.completeRoom({ delay: 1800 });
        } else if (v === CLIENT_CODE) {
          api.fail('That is the Client\'s code — the trap. Gus killed their trip-wire, but do not hand them the frame. Set the master your six pins spell.');
        } else {
          api.fail('The lock holds — that is not the master. Pool all six pins with your partner, in position order.');
        }
      };
      body.querySelector('#vlt-go').addEventListener('click', submit);
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
    },
  });
}
