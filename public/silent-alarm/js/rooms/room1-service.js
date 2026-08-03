// SCENE 1 — The Service Door / The Van (tutorial · cross-read combination).
// Each side's code is shown on the OTHER side's screen.
//   Hand's door keypad = 5-1-9-3   (shown on the Eye's schematic / P2 screen)
//   Eye's uplink code  = 8-2-6-0   (shown on the Hand's alley box / P1 screen)
// The Hand (P1) also lifts vault-pin b (position 2, digit 2).

import { getRole, isHand, roleName, otherRoleName } from '../role.js';
import { defs, backdrop, ambient, roleTag } from '../heistkit.js';

const SLUG = 'svc';
// The code shown on THIS screen (i.e. what THIS player reads to their partner).
const RELAY = { p1: '8 · 2 · 6 · 0', p2: '5 · 1 · 9 · 3' };  // Hand's box names the Eye's uplink; Eye's schematic names the Hand's door
// This side's own solution (never shown on this screen).
const MY_CODE = { p1: [5, 1, 9, 3], p2: [8, 2, 6, 0] };

function isOpen(state) { return !!state.flags.service_open; }

export default {
  id: 'service',
  get title() { return `${roleName()} · The Service Door`; },
  get intro() {
    return isHand()
      ? 'The service door at the back of the Larkspur, and a four-digit keypad between you and the Nightingale. The code is nowhere out here in the rain — but your partner is looking straight at it on the schematic. Read them what the alley box says, and set what they read you.'
      : 'Rain on the windscreen, the console dark, the whole building mirrored on a wall of green glass. The camera feed is dead until you enter the uplink code — and it is not on any of your screens. It is stencilled on a box in the alley, where only The Hand can see it. Trade.';
  },

  scene(state) {
    const open = isOpen(state);
    const pinHere = isHand() && !state.journal.some(e => e.id === 'pin_b');
    const relay = RELAY[getRole()];

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}</defs>
      ${backdrop(SLUG)}

      <!-- the RELAY panel: this screen names the OTHER side's code -->
      <g>
        <rect x="600" y="150" width="400" height="180" rx="8" fill="#0b141c" stroke="${isHand() ? '#c9a227' : '#7cffb2'}" stroke-width="4"/>
        <text x="800" y="196" text-anchor="middle" font-size="18" fill="${isHand() ? '#8aa0b4' : '#4f9c78'}"
          font-family="Consolas, monospace" letter-spacing="2">${isHand() ? 'ALLEY BOX — FEED UPLINK' : 'DOOR SCHEMATIC — SERVICE KEYPAD'}</text>
        <text x="800" y="268" text-anchor="middle" font-size="48" fill="${isHand() ? '#7cffb2' : '#e8c85a'}"
          font-family="Consolas, monospace" letter-spacing="8">${relay}</text>
        <text x="800" y="308" text-anchor="middle" font-size="13" fill="#7f8a99"
          font-family="Consolas, monospace">read this to your partner</text>
      </g>

      ${isHand() ? `
      <!-- the service door with its 4-dial keypad -->
      <g>
        <rect x="1120" y="360" width="300" height="470" rx="6" fill="${open ? '#04120c' : '#141c26'}" stroke="#0e1319" stroke-width="8"/>
        ${open
          ? `<text x="1270" y="600" text-anchor="middle" font-size="20" fill="#8fe0a0" font-family="Consolas, monospace">the door stands open</text>
             <rect x="1250" y="420" width="40" height="360" fill="#04120c"/>`
          : `<g font-family="Consolas, monospace" text-anchor="middle">
               <rect x="1170" y="470" width="200" height="150" rx="10" fill="#0b141c" stroke="#57d6e6" stroke-width="3"/>
               ${[0, 1, 2, 3].map(i => `
                 <circle cx="${1200 + i * 47}" cy="545" r="20" fill="#141c26" stroke="#57d6e6" stroke-width="2"/>
                 <text x="${1200 + i * 47}" y="552" font-size="20" fill="#7cffb2">${state.flags[`service_d${i}`] ?? 0}</text>`).join('')}
               <text x="1270" y="450" font-size="14" fill="#7f8a99">SERVICE KEYPAD</text>
             </g>`}
      </g>` : `
      <!-- the van's uplink console -->
      <g>
        <rect x="1120" y="540" width="360" height="250" rx="10" fill="#06110b" stroke="#123324" stroke-width="4"/>
        <text x="1300" y="580" text-anchor="middle" font-size="14" fill="#4f9c78" font-family="Consolas, monospace" letter-spacing="2">FEED UPLINK</text>
        ${open
          ? `<text x="1300" y="680" text-anchor="middle" font-size="20" fill="#8fe0a0" font-family="Consolas, monospace">feed live — cameras up</text>`
          : `<g font-family="Consolas, monospace" text-anchor="middle">
               ${[0, 1, 2, 3].map(i => `
                 <rect x="${1160 + i * 78}" y="620" width="60" height="72" rx="6" fill="#0b1a13" stroke="#7cffb2" stroke-width="2"/>
                 <text x="${1190 + i * 78}" y="668" font-size="26" fill="#7cffb2">${state.flags[`service_d${i}`] ?? 0}</text>`).join('')}
               <text x="1300" y="740" font-size="13" fill="#4f9c78">enter uplink to bring the feed live</text>
             </g>`}
      </g>`}

      ${pinHere ? `
      <!-- vault-pin b (Hand only) on the door strike-plate -->
      <g class="beckon">
        <rect x="1050" y="640" width="40" height="60" rx="6" fill="rgba(87,214,230,0.08)" stroke="#57d6e6" stroke-width="3"/>
        <text x="1070" y="678" text-anchor="middle" font-size="20" fill="#7cffb2" font-family="Consolas, monospace" font-weight="bold">2</text>
        <text x="1070" y="726" text-anchor="middle" font-size="13" fill="#e8e2d4" font-family="Georgia, serif">steel pin</text>
      </g>` : ''}

      <!-- the Client's brief, a folded note (both) -->
      <g>
        <rect x="360" y="600" width="150" height="100" rx="4" fill="#d3c6a6" transform="rotate(-4 435 650)"/>
        <g stroke="#8a7a50" stroke-width="2" transform="rotate(-4 435 650)">
          <line x1="380" y1="628" x2="490" y2="628"/><line x1="380" y1="648" x2="482" y2="648"/><line x1="380" y1="668" x2="470" y2="668"/>
        </g>
      </g>

      ${roleTag()}
      ${ambient(SLUG)}
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const open = isOpen(state);

    spots.push({
      id: 'relay', x: 600, y: 150, w: 400, h: 180, label: isHand() ? 'The alley junction box' : 'The door schematic',
      onInteract(game) {
        const code = RELAY[getRole()];
        const card = isHand()
          ? `<div class="console-card"><div class="console-title">Alley box — feed uplink</div>
             <p>Stencilled on the junction box in the rain:</p>
             <p style="font-size:30px;letter-spacing:8px;color:#eafff2;text-align:center;">${code}</p></div>`
          : `<div class="console-card"><div class="console-title">Service door schematic</div>
             <p>The stolen wiring plan, keypad code circled:</p>
             <p style="font-size:30px;letter-spacing:8px;color:#eafff2;text-align:center;">${code}</p></div>`;
        const html = card + `<div class="relay">This is <strong>your partner's</strong> code, not yours. Read it to them.</div>`;
        game.journal.add('note_relay1', { title: isHand() ? 'Alley box — uplink code' : 'Door schematic — keypad code', category: 'note', html });
        game.dialog({ title: isHand() ? 'The Alley Box' : 'The Schematic', html });
      },
    });

    spots.push({
      id: 'brief', x: 360, y: 600, w: 170, h: 110, label: "The Client's brief",
      onInteract(game) {
        const html = `<div class="dossier stamped"><div class="dossier-title">Job brief — from the Client</div>
          <p>"In and out. The Nightingale only. <strong>Do not open the inner case.</strong>
          Payment on delivery, usual drop. — C."</p></div>
          <div class="client-feed">You there? Confirm you're on the door. Clock's running.</div>`;
        game.journal.add('note_brief', { title: "The Client's brief", category: 'note', html });
        game.dialog({ title: 'The Brief', html });
      },
    });

    if (isHand() && !state.journal.some(e => e.id === 'pin_b')) {
      spots.push({
        id: 'pin_b', x: 1040, y: 630, w: 70, h: 90, label: 'A steel pin on the strike-plate',
        onInteract(game) {
          game.journal.add('pin_b', { title: 'Door strike-plate', category: 'sun', sun: { rays: 2, letter: '2' } });
          game.say('Wedged behind the strike-plate: a little steel tumbler pin, stamped position 2, digit 2. One of six — the vault at the bottom will want them all, and your partner holds the rest.');
          game.refreshScene();
        },
      });
    }

    if (!open) {
      spots.push({
        id: 'lock', x: isHand() ? 1120 : 1120, y: isHand() ? 360 : 540, w: 300, h: isHand() ? 470 : 250,
        label: isHand() ? 'The service keypad' : 'The uplink console',
        onInteract(game) { openLock(game); },
      });
    } else {
      spots.push({
        id: 'through', x: 1120, y: isHand() ? 360 : 540, w: 340, h: isHand() ? 470 : 250,
        label: isHand() ? 'Slip inside' : 'The live feed',
        onInteract(game) {
          if (isHand() && !game.journal.has('pin_b')) { game.say('There is a steel pin behind the strike-plate — take it before you go in. You will need all six.'); return; }
          game.completeRoom({ delay: 600 });
        },
      });
    }

    return spots;
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: 'Your code is not on your own screen. What is stencilled (or schematic\'d) on your screen is your PARTNER\'s code — read it to them, and set the four they read to you.', cost: 60 },
      { text: 'Four digits. Read the code on your screen aloud to your partner; set the four they read back on your keypad.', cost: 120 },
      { text: isHand() ? 'Your door code is 5 - 1 - 9 - 3.' : 'Your uplink code is 8 - 2 - 6 - 0.', cost: 240 },
    ];
  },
};

function openLock(game) {
  const role = getRole();
  const target = MY_CODE[role];
  const vals = [0, 1, 2, 3].map(i => game.getFlag(`service_d${i}`) ?? 0);

  game.openPuzzle({
    id: 'service_lock',
    title: isHand() ? 'The Service Keypad' : 'The Feed Uplink',
    render(body, api) {
      body.innerHTML = `
        <p class="puzzle-desc">Four dials, 0–9. Your code is <em>not</em> on your screen —
        it is on your partner's. Ask them what ${isHand() ? 'the alley box says about the service door' : 'the schematic says about the feed uplink'}.</p>
        <div class="puzzle-row" id="svc-dials"></div>
        <div class="puzzle-row"><button class="btn btn-primary" id="svc-try">${isHand() ? 'Try the Door' : 'Bring the Feed Up'}</button></div>
        <div class="puzzle-feedback"></div>`;
      const row = body.querySelector('#svc-dials');
      vals.forEach((v, i) => {
        const dial = document.createElement('div');
        dial.className = 'dial';
        dial.innerHTML = `
          <button class="dial-btn" data-d="1" aria-label="up">&#9650;</button>
          <div class="dial-face">${v}</div>
          <button class="dial-btn" data-d="-1" aria-label="down">&#9660;</button>`;
        const face = dial.querySelector('.dial-face');
        dial.querySelectorAll('.dial-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            vals[i] = (vals[i] + Number(btn.dataset.d) + 10) % 10;
            face.textContent = String(vals[i]);
            face.classList.remove('tick'); void face.offsetWidth; face.classList.add('tick');
            game.playSfx('click');
            game.setFlag(`service_d${i}`, vals[i]);
          });
        });
        row.appendChild(dial);
      });
      body.querySelector('#svc-try').addEventListener('click', () => {
        if (vals.every((v, i) => v === target[i])) {
          game.setFlag('service_open');
          game.playSfx('unlock');
          api.solved({ message: isHand()
            ? 'The bolt clicks and the service door drifts inward on cold, still air. You are in. Your partner\'s voice was the key.'
            : 'The uplink handshakes and eight green feeds bloom across the console at once. You can see the whole building now. Your partner read you in.' });
          game.refreshScene();
        } else {
          api.fail(isHand() ? 'The keypad buzzes red. That is not the door code — check with your partner.' : 'The uplink rejects it. Wrong code — ask The Hand to re-read the box.');
        }
      });
    },
  });
}
