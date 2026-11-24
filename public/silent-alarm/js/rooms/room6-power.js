// SCENE 6 — The Power Room / The Breakers (5-lever pattern) + TWIST reveal.
// SPLIT KNOWLEDGE. The OTHER side's schematic shows the LOAD on each of your
// five circuits; YOUR placard holds the rule: trip (DOWN) any circuit drawing
// MORE than 30 A, leave the rest UP. (A load of exactly 30 stays UP.)
//   Hand loads 22 35 48 9 30  -> UP DOWN DOWN UP UP
//   Eye  loads 41 33 12 27 38 -> DOWN DOWN UP UP DOWN
// The Eye (P2) lifts vault-pin e (position 5, digit 1).
// On solve, Gus surfaces with the double-cross reveal (the Client's remote trip).

import { getRole, isHand, roleName, otherRoleName } from '../role.js';
import { dock, DOCK, panel } from '../../../shared/js/scenekit.js';
import { defs, backdrop, ambient, roleTag } from '../heistkit.js';

const SLUG = 'pow';
// this side's own correct pattern (true = UP / open)
const LIMIT = 30;
const LOADS = { p1: [22, 35, 48, 9, 30], p2: [41, 33, 12, 27, 38] };
const MY_PATTERN = { p1: LOADS.p1.map(a => a <= LIMIT), p2: LOADS.p2.map(a => a <= LIMIT) };
// the schematic shown on THIS screen is the OTHER side's pattern (to relay)
function schematicFor(role) { return role === 'p1' ? LOADS.p2 : LOADS.p1; }
const fmt = (arr) => arr.map(a => `${a}A`).join(' · ');

function isCut(state) { return !!state.flags.power_cut; }

export default {
  id: 'power',
  solution: role => MY_PATTERN[role].map(o => (o ? 'UP' : 'DOWN')).join(' '),
  get title() { return `${roleName()} · The Power Room`; },
  get intro() {
    return isHand()
      ? 'The power room under the vault. Kill the outer alarm ring here and the vault door is one number away. Five breakers, and the pattern for yours is drawn on your partner\'s schematic — as theirs is on yours.'
      : 'The breaker panel is live on your console. Five relays hold the vault\'s alarm ring; set them right and the ring drops. Your pattern is on The Hand\'s schematic; theirs is on yours. Read them across.';
  },

  scene(state) {
    const cut = isCut(state);
    const pinHere = getRole() === 'p2' && !state.journal.some(e => e.id === 'pin_e');
    const sch = schematicFor(getRole());
    const v = [0, 1, 2, 3, 4].map(i => state.flags[`power_b${i}`] ? true : false);

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}</defs>
      ${backdrop(SLUG)}

      <!-- the alarm-ring indicator -->
      <g>
        <circle cx="380" cy="330" r="60" fill="none" stroke="${cut ? '#3a4656' : '#ff3b57'}" stroke-width="8" ${cut ? '' : 'class="' + SLUG + '_lz"'}/>
        <text x="380" y="336" text-anchor="middle" font-size="14" fill="${cut ? '#7f8a99' : '#ff8f8f'}" font-family="Consolas, monospace">${cut ? 'RING DOWN' : 'ALARM RING'}</text>
        <text x="380" y="420" text-anchor="middle" font-size="12" fill="#7f8a99" font-family="Consolas, monospace">outer vault ring</text>
      </g>

      <!-- five breakers (levers) -->
      <g>
        ${v.map((up, i) => {
          const x = 620 + i * 120;
          return `<g>
            <rect x="${x - 22}" y="540" width="44" height="150" rx="10" fill="#0e141c" stroke="#2b3d48" stroke-width="3"/>
            <circle cx="${x}" cy="${up ? 570 : 660}" r="20" fill="${up ? '#8fe0a0' : '#5b6b7d'}" stroke="#0e1319" stroke-width="3"/>
            <text x="${x}" y="726" text-anchor="middle" font-size="13" fill="#9fb2c2" font-family="Consolas, monospace">${i + 1}</text>
            <text x="${x}" y="520" text-anchor="middle" font-size="12" fill="${up ? '#8fe0a0' : '#7f8a99'}" font-family="Consolas, monospace">${up ? 'UP' : 'DOWN'}</text>
          </g>`;
        }).join('')}
      </g>

      <!-- the schematic (OTHER side's breaker pattern) -->
      ${dock({ x: 1090, y: 150, w: 430, h: 150 }, `
        <text x="1305" y="192" text-anchor="middle" font-size="14" fill="${isHand() ? '#8aa0b4' : '#4f9c78'}" font-family="Consolas, monospace" letter-spacing="2">${otherRoleName().toUpperCase()} — CIRCUIT LOADS</text>
        <text x="1305" y="244" text-anchor="middle" font-size="19" fill="${isHand() ? '#e8c85a' : '#eafff2'}" font-family="Consolas, monospace">${fmt(sch)}</text>
        <text x="1305" y="278" text-anchor="middle" font-size="12" fill="#7f8a99" font-family="Consolas, monospace">loads on their 1–5 · read to your partner</text>`, { kind: isHand() ? 'tablet' : 'radio', title: isHand() ? 'EARPIECE' : 'VAN CONSOLE' })}

      <!-- your own breaker placard: the rule (the loads are on your partner's screen) -->
      ${panel({ x: 230, y: 470, w: 300, h: 110, material: 'iron', mount: 'bolts', rx: 6, body: `
        <text x="380" y="504" text-anchor="middle" font-size="13" fill="#e8e2d4" font-family="Consolas, monospace" letter-spacing="1">BREAKER PLACARD</text>
        <text x="380" y="530" text-anchor="middle" font-size="13" fill="#ffcf8a" font-family="Consolas, monospace">TRIP (DOWN) ANY CIRCUIT</text>
        <text x="380" y="552" text-anchor="middle" font-size="13" fill="#ffcf8a" font-family="Consolas, monospace">DRAWING MORE THAN 30 A</text>` })}

      ${cut ? `<text x="800" y="800" text-anchor="middle" font-size="18" fill="#8fe0a0" font-family="Consolas, monospace">the alarm ring is dead — the vault is one number away</text>` : ''}

      ${pinHere ? `
      <g class="beckon">
        <rect x="1050" y="600" width="40" height="60" rx="6" fill="rgba(87,214,230,0.08)" stroke="#57d6e6" stroke-width="3"/>
        <text x="1070" y="638" text-anchor="middle" font-size="20" fill="#7cffb2" font-family="Consolas, monospace" font-weight="bold">5</text>
      </g>` : ''}

      ${roleTag()}
      ${ambient(SLUG)}
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const cut = isCut(state);

    spots.push({
      id: 'schematic', ...DOCK, label: `${otherRoleName()} schematic`,
      onInteract(game) {
        const sch = schematicFor(getRole());
        const html = `<div class="console-card"><div class="console-title">${otherRoleName()} — circuit loads</div>
          <p style="font-size:18px;color:#eafff2;text-align:center;letter-spacing:2px;">${fmt(sch)}</p>
          <p style="text-align:center;color:#7f8a99;">their breakers 1 → 5</p></div>
          <div class="relay">These are the loads on your <strong>partner's</strong> circuits. Their placard says which to trip. Read them the five in order; ask them for yours.</div>`;
        game.journal.add('note_sch6', { title: `${otherRoleName()} circuit loads`, category: 'note', html });
        game.dialog({ title: 'The Schematic', html });
      },
    });

    spots.push({
      id: 'ring', x: 320, y: 270, w: 120, h: 120, label: 'The alarm ring',
      onInteract(game) { game.say(cut ? 'The outer ring is dead. Only the vault\'s inner lock is left between you and the bird.' : 'A live alarm ring around the whole vault. Cut it with the breakers and the door is next.'); },
    });


    spots.push({
      id: 'placard', x: 230, y: 470, w: 300, h: 110, label: 'The breaker placard',
      onInteract(game) {
        const html = `<div class="console-card"><div class="console-title">Breaker placard</div>
          <p>Trip (DOWN) any circuit drawing <strong>more than 30 A</strong>. Leave the rest UP.</p></div>
          <div class="relay">The loads on <strong>your</strong> five circuits are on your partner's screen.</div>`;
        game.journal.add('note_placard6', { title: 'Breaker placard — the 30 A rule', category: 'note', html });
        game.dialog({ title: 'The Placard', html });
      },
    });

    if (!cut) {
      spots.push({
        id: 'breakers', x: 590, y: 500, w: 620, h: 240, label: 'The five breakers',
        onInteract(game) { openBreakers(game); },
      });
    } else {
      spots.push({
        id: 'down', x: 590, y: 500, w: 620, h: 240, label: 'On to the vault',
        onInteract(game) {
          if (getRole() === 'p2' && !game.journal.has('pin_e')) { game.say('There is a vault-pin in the firmware dump — pull it before the vault.'); return; }
          game.completeRoom({ delay: 600 });
        },
      });
    }

    // collectibles last, so they sit on top of the machine they are in
    if (getRole() === 'p2' && !state.journal.some(e => e.id === 'pin_e')) {
      spots.push({
        id: 'pin_e', x: 1040, y: 590, w: 70, h: 90, label: 'A pin in the firmware dump',
        onInteract(game) {
          game.journal.add('pin_e', { title: 'Breaker firmware dump', category: 'sun', sun: { rays: 5, letter: '1' } });
          game.say('The breaker panel\'s firmware dump gives up one more secret: position 5, digit 1 — your third vault-pin. The Hand holds the other three.');
          game.refreshScene();
        },
      });
    }

    return spots;
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: 'Your placard says which circuits to trip; the loads on your circuits are on your partner\'s screen. Trade loads.', cost: 60 },
      { text: 'Ask for your five loads. Any circuit drawing MORE than 30 A goes DOWN; the rest stay UP — and 30 exactly is not more than 30.', cost: 120 },
      { text: isHand() ? 'Your breakers: UP, DOWN, DOWN, UP, UP.' : 'Your breakers: DOWN, DOWN, UP, UP, DOWN.', cost: 240 },
    ];
  },
};

function openBreakers(game) {
  const role = getRole();
  const target = MY_PATTERN[role];
  const v = [0, 1, 2, 3, 4].map(i => game.getFlag(`power_b${i}`) ? true : false);

  game.openPuzzle({
    id: 'power_breakers',
    title: 'Set the Breakers',
    render(body, api) {
      body.innerHTML = `
        <div class="puzzle-hero pz-breakers"></div>
        <p class="puzzle-desc">Your placard: <strong>trip (DOWN) any circuit drawing more than 30 A</strong>; leave the rest UP.
        The loads on your five are on your partner's screen. Click a breaker to flip it.</p>
        <div class="puzzle-row" id="pow-levers"></div>
        <div class="puzzle-row"><button class="btn btn-primary" id="pow-cut">Drop the Ring</button></div>
        <div class="puzzle-feedback"></div>`;
      const row = body.querySelector('#pow-levers');
      const render = () => {
        row.innerHTML = '';
        v.forEach((up, i) => {
          const lever = document.createElement('div');
          lever.className = 'lever' + (up ? '' : ' down');
          lever.innerHTML = `
            <div class="lever-track"><div class="lever-knob"></div></div>
            <div class="lever-label">${i + 1}: ${up ? 'UP' : 'DOWN'}</div>`;
          lever.addEventListener('click', () => {
            v[i] = !v[i];
            game.setFlag(`power_b${i}`, v[i]);
            game.playSfx('click');
            render();
          });
          row.appendChild(lever);
        });
      };
      render();
      body.querySelector('#pow-cut').addEventListener('click', () => {
        if (v.every((o, i) => o === target[i])) {
          game.setFlag('power_cut');
          game.playSfx('unlock');
          api.solved({ message: 'The alarm ring dies with a thump you feel in your teeth. And then Gus is there, on the panel, ear flat, telling you what he found behind it.' });
          game.refreshScene();
          revealTwist(game);
        } else {
          api.fail('The ring stays lit — one or more breakers are wrong. Recheck with your partner.');
        }
      });
    },
  });
}

function revealTwist(game) {
  setTimeout(() => {
    const html = `<div class="dossier stamped"><div class="dossier-title">Gus — behind the panel</div>
      <p>"That wire there — the fat one. It doesn't run to the alarm. It runs <strong>out</strong>,
      to whoever's been talking in your ear. It's a trip. The second that vault opens, they mean
      to throw it — set the alarm off with you inside, and walk out the front with the bird while
      the door locks behind you."</p></div>
      <div class="client-feed">You're nearly there. When the vault opens, enter the code I gave you. Only that code. Trust me.</div>
      <div class="relay">Don't. At the vault, ignore the Client's number. Set the master your six pins spell — and Gus already chewed their trip-wire dead.</div>`;
    game.journal.add('note_twist', { title: 'Gus — the set-up', category: 'note', html });
    game.dialog({ title: 'The Set-Up', html });
  }, 1200);
}
