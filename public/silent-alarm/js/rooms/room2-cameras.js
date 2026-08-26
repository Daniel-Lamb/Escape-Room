// SCENE 2 — The Camera Room / The Feed Matrix (four-way alignment).
// Each side aims four things; the four bearings for yours are on the OTHER screen.
//   Hand's four gallery cameras  = E, S, NW, N   = [2,4,7,0]  (shown on the Eye's aim-card)
//   Eye's four feed channels     = NE, SE, W, S  = [1,3,6,4]  (shown on the Hand's patch-card)
// The Eye (P2) lifts vault-pin a (position 1, digit 7).

import { getRole, isHand, roleName, otherRoleName } from '../role.js';
import { defs, backdrop, ambient, roleTag } from '../heistkit.js';

const SLUG = 'cam';
const PTS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
// This side's own correct four bearings (never shown here).
const MY_TARGET = { p1: [2, 4, 7, 0], p2: [1, 3, 6, 4] };
// The card shown on THIS screen is the OTHER side's target (to relay).
function cardFor(role) { return role === 'p1' ? MY_TARGET.p2 : MY_TARGET.p1; }
const fmt = (arr) => arr.map(i => PTS[i]).join(' · ');

function isAimed(state) { return !!state.flags.cameras_aimed; }

export default {
  id: 'cameras',
  get title() { return `${roleName()} · The Camera Room`; },
  get intro() {
    return isHand()
      ? 'The guards\' camera room. Four gallery cameras sweep the route you have to walk — you need every one turned to face its own blind corner. The four bearings are not on any label in here; they are on your partner\'s matrix. Read them your patch-card; set what they read you.'
      : 'Eight feeds up, four of them useless until you route the channels right — and the four bearings for your channels are not on your console. They are on a patch-card only The Hand can read, taped inside the camera room. Trade bearings, four for four.';
  },

  scene(state) {
    const done = isAimed(state);
    const pinHere = getRole() === 'p2' && !state.journal.some(e => e.id === 'pin_a');
    const relay = cardFor(getRole());
    const cur = [0, 1, 2, 3].map(i => state.flags[`cameras_a${i}`] ?? 0);

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}</defs>
      ${backdrop(SLUG)}

      <!-- the four aim indicators -->
      <g>
        ${cur.map((p, i) => {
          const x = 560 + i * 180, y = 640;
          const a = (p / 8) * Math.PI * 2 - Math.PI / 2;
          const ex = x + Math.cos(a) * 34, ey = y + Math.sin(a) * 34;
          const col = isHand() ? '#ff3b57' : '#7cffb2';
          return `<g>
            <circle cx="${x}" cy="${y}" r="42" fill="#0b141c" stroke="${col}" stroke-width="3"/>
            <line x1="${x}" y1="${y}" x2="${ex.toFixed(0)}" y2="${ey.toFixed(0)}" stroke="${col}" stroke-width="4" stroke-linecap="round"/>
            <circle cx="${x}" cy="${y}" r="5" fill="${col}"/>
            <text x="${x}" y="${y + 74}" text-anchor="middle" font-size="15" fill="#9fb2c2" font-family="Consolas, monospace">${isHand() ? 'CAM' : 'CH'} ${i + 1}</text>
            <text x="${x}" y="${y - 56}" text-anchor="middle" font-size="15" fill="${col}" font-family="Consolas, monospace">${PTS[p]}</text>
          </g>`;
        }).join('')}
      </g>

      <!-- the relay card (OTHER side's four bearings) -->
      <g>
        <rect x="1100" y="150" width="420" height="150" rx="8" fill="#0b141c" stroke="${isHand() ? '#c9a227' : '#7cffb2'}" stroke-width="4"/>
        <text x="1310" y="192" text-anchor="middle" font-size="15" fill="${isHand() ? '#8aa0b4' : '#4f9c78'}" font-family="Consolas, monospace" letter-spacing="2">${isHand() ? 'PATCH-CARD — FEED CHANNELS' : 'AIM-CARD — GALLERY CAMS'}</text>
        <text x="1310" y="244" text-anchor="middle" font-size="24" fill="${isHand() ? '#e8c85a' : '#eafff2'}" font-family="Consolas, monospace">${fmt(relay)}</text>
        <text x="1310" y="278" text-anchor="middle" font-size="12" fill="#7f8a99" font-family="Consolas, monospace">four bearings · read to your partner</text>
      </g>

      ${done ? `<text x="800" y="820" text-anchor="middle" font-size="18" fill="#8fe0a0" font-family="Consolas, monospace">${isHand() ? 'every corner covered — the route is dark' : 'all four channels routed — the feed is whole'}</text>` : ''}

      ${pinHere ? `
      <g class="beckon">
        <rect x="1050" y="620" width="40" height="60" rx="6" fill="rgba(87,214,230,0.08)" stroke="#57d6e6" stroke-width="3"/>
        <text x="1070" y="658" text-anchor="middle" font-size="20" fill="#7cffb2" font-family="Consolas, monospace" font-weight="bold">1</text>
      </g>` : ''}

      ${roleTag()}
      ${ambient(SLUG)}
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const done = isAimed(state);

    spots.push({
      id: 'card', x: 1100, y: 150, w: 420, h: 150, label: isHand() ? 'The feed patch-card' : 'The camera aim-card',
      onInteract(game) {
        const relay = cardFor(getRole());
        const html = `<div class="console-card"><div class="console-title">${isHand() ? 'Feed channels — patch-card' : 'Gallery cameras — aim-card'}</div>
          <p style="font-size:22px;color:#eafff2;text-align:center;letter-spacing:2px;">${fmt(relay)}</p>
          <p style="text-align:center;color:#7f8a99;">channel/cam 1 → 4</p></div>
          <div class="relay">These are your <strong>partner's</strong> four bearings. Read them in order; ask them to read you yours.</div>`;
        game.journal.add('note_card2', { title: isHand() ? 'Feed patch-card' : 'Camera aim-card', category: 'note', html });
        game.dialog({ title: isHand() ? 'The Patch-Card' : 'The Aim-Card', html });
      },
    });

    if (getRole() === 'p2') {
      spots.push({
        id: 'client2', x: 340, y: 150, w: 300, h: 120, label: "The Client's feed",
        onInteract(game) {
          const html = `<div class="client-feed">Guard rounds at :20 and :40. Ignore anything else you see on those feeds. Stay on my timing.</div>
            <div class="dossier"><div class="dossier-title">Your note</div><p>How does the Client know the round schedule to the minute? And what would there be to see that you should <em>ignore</em>?</p></div>`;
          game.journal.add('note_client2', { title: "Client — guard rounds", category: 'note', html });
          game.dialog({ title: "The Client Pings", html });
        },
      });
    } else {
      spots.push({
        id: 'monitors', x: 340, y: 150, w: 300, h: 120, label: 'The monitor bank',
        onInteract(game) { game.say(done ? 'Every corner of the route sits in a camera\'s blind spot now. You can walk it unseen.' : 'The monitors show your own route back to you — and the blind spots you need to hide in. Aim the cameras and the walk goes dark.'); },
      });
    }

    if (getRole() === 'p2' && !state.journal.some(e => e.id === 'pin_a')) {
      spots.push({
        id: 'pin_a', x: 1040, y: 610, w: 70, h: 90, label: 'A pin in the DVR metadata',
        onInteract(game) {
          game.journal.add('pin_a', { title: 'Recovered from the DVR', category: 'sun', sun: { rays: 1, letter: '7' } });
          game.say('Buried in the DVR\'s recovered metadata, a scrap of the vault firmware: position 1, digit 7. A vault-pin. Logged — you hold the odd positions, The Hand holds the even.');
          game.refreshScene();
        },
      });
    }

    if (!done) {
      spots.push({
        id: 'dials', x: 500, y: 560, w: 720, h: 220, label: isHand() ? 'The four camera dials' : 'The four channel dials',
        onInteract(game) { openDials(game); },
      });
    } else {
      spots.push({
        id: 'on', x: 500, y: 560, w: 720, h: 220, label: isHand() ? 'On toward the gallery' : 'The whole feed',
        onInteract(game) {
          if (getRole() === 'p2' && !game.journal.has('pin_a')) { game.say('There is a vault-pin in the DVR metadata — pull it before you move on.'); return; }
          game.completeRoom({ delay: 600 });
        },
      });
    }

    return spots;
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: 'Four things to aim, four bearings. The bearings for yours are drawn on your partner\'s screen, not yours — read them yours in return.', cost: 60 },
      { text: 'Read the four points on your card to your partner, in order; set the four they read you, 1 through 4.', cost: 120 },
      { text: isHand() ? 'Your cameras: E, S, NW, N.' : 'Your channels: NE, SE, W, S.', cost: 240 },
    ];
  },
};

function openDials(game) {
  const role = getRole();
  const target = MY_TARGET[role];
  const cur = [0, 1, 2, 3].map(i => game.getFlag(`cameras_a${i}`) ?? 0);

  game.openPuzzle({
    id: 'cameras_dials',
    title: isHand() ? 'Aim the Gallery Cameras' : 'Route the Feed Channels',
    render(body, api) {
      body.innerHTML = `
        <div class="puzzle-hero pz-cameras"></div>
        <p class="puzzle-desc">Cycle each of the four to the compass bearing your partner reads
        you (their card shows your four, in order). N · NE · E · SE · S · SW · W · NW.</p>
        <div class="puzzle-row" id="cam-dials"></div>
        <div class="puzzle-row"><button class="btn btn-primary" id="cam-go">${isHand() ? 'Lock the Aim' : 'Commit the Routing'}</button></div>
        <div class="puzzle-feedback"></div>`;
      const row = body.querySelector('#cam-dials');
      cur.forEach((v, i) => {
        const dial = document.createElement('div');
        dial.className = 'dial';
        dial.innerHTML = `
          <button class="dial-btn" data-d="1" aria-label="clockwise">&#9654;</button>
          <div class="dial-face" style="min-width:52px;">${PTS[v]}</div>
          <button class="dial-btn" data-d="-1" aria-label="counter">&#9664;</button>
          <div class="lever-label">${isHand() ? 'cam' : 'ch'} ${i + 1}</div>`;
        const face = dial.querySelector('.dial-face');
        dial.querySelectorAll('.dial-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            cur[i] = (cur[i] + Number(btn.dataset.d) + 8) % 8;
            face.textContent = PTS[cur[i]];
            face.classList.remove('tick'); void face.offsetWidth; face.classList.add('tick');
            game.playSfx('click');
            game.setFlag(`cameras_a${i}`, cur[i]);
          });
        });
        row.appendChild(dial);
      });
      body.querySelector('#cam-go').addEventListener('click', () => {
        if (cur.every((v, i) => v === target[i])) {
          game.setFlag('cameras_aimed');
          game.playSfx('unlock');
          api.solved({ message: isHand()
            ? 'Four cameras swing to their corners and the route between them falls into the dark. You can walk it now.'
            : 'The four channels snap into place and the feed knits whole — no gap, no dead angle. The Hand is covered.' });
          game.refreshScene();
        } else {
          api.fail('Not right yet — one or more bearings are off. Re-read them with your partner.');
        }
      });
    },
  });
}
