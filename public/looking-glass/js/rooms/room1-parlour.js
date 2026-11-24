// SCENE 1 — The Parlour (tutorial · mirror-writing relay).
// Your door-word is written (mirror-reversed) on your PARTNER's wall.
//   Waking door-word = CANDLE (shown reversed on the Glass wall)
//   Glass  door-word = HEARTH (shown reversed on the Waking wall)
// Waking (P1) finds mirror-shard R (1).

import { getRole, isWaking, sideName, otherSideName } from '../role.js';
import { defs, backdrop, sideTag, mirrorWrite, mirrorGlass, sconce, tint } from '../glasskit.js';
import { panel, shadow, wallDoor } from '../../../shared/js/scenekit.js';

const SLUG = 'parlour';
const MIRROR_WORD_SHOWN = { p1: 'HEARTH', p2: 'CANDLE' };  // the PARTNER's word, shown reversed here
const MY_ANSWER = { p1: 'CANDLE', p2: 'HEARTH' };          // this side's own door-word

// Where things are on the parlour plate: the over-mantel (the portrait's place),
// the bare wainscot between the second window and the fireplace, the firebox,
// and the right-hand wall by the curtains (vanishing point about 800,450).
const MIRROR = { x: 945, y: 150, w: 170, h: 256 };
const PLAQUE = { x: 585, y: 305, w: 280, h: 160 };
const HEARTH = { x: 945, y: 485, w: 180, h: 160 };
const DOOR = { x1: 1445, y1: 250, h1: 529, x2: 1585, y2: 207, h2: 643 };
const DOOR_SPOT = { x: DOOR.x1, y: DOOR.y2, w: DOOR.x2 - DOOR.x1, h: DOOR.h2 };

function open(state) { return !!state.flags.parlour_open; }

export default {
  id: 'parlour',
  lintStates: [{ label: 'solved', flags: { parlour_open: true } }],
  get title() { return `${sideName()} · The Parlour`; },
  get intro() {
    return isWaking()
      ? 'You wake in the parlour to a fire gone cold and the great Whitlock mirror gone strange — for in it, where your reflection should stand, your friend is trapped. The door out is locked with a word, and the word is not written anywhere you can read it. But the mirror shows something on the far wall, backwards.'
      : 'You are inside the glass. The parlour is here too, but reversed and silver and wrong, and your friend stands in the warm version beyond the frame. The door out wants a word you cannot find on your side — though the far wall carries one, written backwards, meant for the other of you.';
  },

  scene(state) {
    const t = tint();
    const done = open(state);
    const markHere = isWaking() && !state.journal.some(e => e.id === 'shard_r');
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}</defs>
      ${backdrop(SLUG)}
      ${sconce(SLUG, 900, 582, 'stand')}

      <!-- the Whitlock mirror, standing on the mantel where the portrait hung -->
      <g data-mount="table">
        ${shadow(MIRROR.x + MIRROR.w / 2, MIRROR.y + MIRROR.h + 2, MIRROR.w * 0.55, 6)}
        <rect x="${MIRROR.x}" y="${MIRROR.y}" width="${MIRROR.w}" height="${MIRROR.h}" rx="10" fill="url(#sk_brass)" stroke="#3a2a0c" stroke-width="3" filter="url(#sk_drop)"/>
        ${mirrorGlass(MIRROR.x + 16, MIRROR.y + 16, MIRROR.w - 32, MIRROR.h - 32)}
      </g>

      <!-- the far-wall writing, scratched into the wainscot panel between window and hearth -->
      ${panel({ ...PLAQUE, material: 'darkwood', mount: 'inset', body: `
        <text x="${PLAQUE.x + PLAQUE.w / 2}" y="${PLAQUE.y + 34}" text-anchor="middle" font-size="13" fill="${t.accentDim}" font-family="Georgia, serif" letter-spacing="2">SCRATCHED ON THE FAR WALL</text>
        ${mirrorWrite(MIRROR_WORD_SHOWN[getRole()], PLAQUE.x + PLAQUE.w / 2, PLAQUE.y + 108, 44, t.ink)}` })}

      <!-- the door in the right-hand wall, its word-lock plate on the leaf -->
      ${wallDoor({ ...DOOR, open: done })}
      ${done ? '' : `
      <g transform="translate(1515 586) skewY(8) translate(-1515 -586)">
        ${panel({ x: 1463, y: 562, w: 104, h: 48, material: 'brass', mount: 'bolts', rx: 4, body: `
          <text x="1515" y="594" text-anchor="middle" font-size="19" fill="#2a1d05" font-family="Consolas, monospace" letter-spacing="3">${(state.flags.parlour_guess || '______')}</text>` })}
      </g>`}

      ${markHere ? `
      <g class="beckon">
        ${shadow(1051, 758, 30, 5)}
        <polygon points="1030,690 1075,682 1082,726 1060,760 1028,750 1020,714" fill="rgba(201,204,214,0.10)" stroke="#c9ccd6" stroke-width="2.5"/>
        <text x="1050" y="726" text-anchor="middle" font-size="18" fill="#dfe6f2" font-family="Consolas, monospace" font-weight="bold">1</text>
              </g>` : ''}

      ${sideTag()}
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const t = tint();

    spots.push({
      id: 'plaque', ...PLAQUE, label: 'Backwards writing on the far wall',
      onInteract(game) {
        const word = MIRROR_WORD_SHOWN[getRole()];
        const html = `<div class="cipher"><div class="cipher-title">Scratched on the far wall — backwards</div>
          <p style="text-align:center;"><span class="mirror-text">${word}</span></p>
          <p style="text-align:center;color:#9fa8bd;">held to a mirror, it reads a word</p></div>
          <div class="relay">This is your <strong>partner's</strong> door-word, shown reversed. Read it in the mirror and tell them the word.</div>`;
        game.journal.add('note_parlourword', { title: "Partner's door-word (backwards)", category: 'note', html });
        game.dialog({ title: 'The Far Wall', html });
      },
    });

    spots.push({
      id: 'mirror', ...MIRROR, label: 'The Whitlock mirror',
      onInteract(game) {
        game.say(isWaking()
          ? 'Your friend stands where your reflection should be, mouthing words you cannot hear through the glass. You will have to speak them aloud instead.'
          : 'Through the frame, the warm parlour — and your friend in it, safe, on the far side of the silver. For now.');
      },
    });

    spots.push({
      id: 'hearth', plate: 'the fireplace', ...HEARTH, label: 'The cold hearth',
      onInteract(game) { game.say('The fire is out and the clock has stopped. The whole house is holding its breath between one reflection and the other.'); },
    });

    if (isWaking() && !state.journal.some(e => e.id === 'shard_r')) {
      spots.push({
        id: 'shard_r', x: 1010, y: 670, w: 90, h: 110, label: 'A mirror-shard',
        onInteract(game) {
          game.journal.add('shard_r', { title: 'Parlour — by the hearth', category: 'sun', sun: { rays: 1, letter: 'R' } });
          game.say('A shard of the old mirror, edge worn smooth: numbered 1, and etched with the letter R. One of six — and the last lock will want them all, turned about.');
          game.refreshScene();
        },
      });
    }

    if (!open(state)) {
      spots.push({
        id: 'door', ...DOOR_SPOT, label: 'The door — a word-lock',
        onInteract(game) { openDoor(game); },
      });
    } else {
      spots.push({
        id: 'out', ...DOOR_SPOT, label: 'Through the door',
        onInteract(game) {
          if (isWaking() && !game.journal.has('shard_r')) { game.say('There is a mirror-shard by the hearth — take it before you leave the parlour.'); return; }
          game.completeRoom({ delay: 600 });
        },
      });
    }

    return spots;
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: 'Your door-word is not on your wall — it is on your partner\'s, written backwards. And theirs is on yours. Read the far-wall writing in a mirror and trade.', cost: 60 },
      { text: 'The backwards word on your wall is your PARTNER\'s. Read it to them; type the word they read from theirs.', cost: 120 },
      { text: isWaking() ? 'Your door-word is CANDLE.' : 'Your door-word is HEARTH.', cost: 240 },
    ];
  },
};

function openDoor(game) {
  const answer = MY_ANSWER[getRole()];
  game.openPuzzle({
    id: 'parlour_door',
    title: 'The Word-Lock',
    render(body, api) {
      body.innerHTML = `
        <div class="puzzle-hero" style="background-image:url(art/pz-door.webp)"></div>
        <p class="puzzle-desc">The door wants a word. It is written backwards on your partner's
        far wall — ask them to read it to you.</p>
        <div class="puzzle-row">
          <input class="puzzle-input" id="pl-word" maxlength="6" autocomplete="off"
            placeholder="the word" style="text-transform:uppercase;letter-spacing:8px;text-align:center;width:220px;" />
        </div>
        <div class="puzzle-row"><button class="btn btn-primary" id="pl-try">Speak It</button></div>
        <div class="puzzle-feedback"></div>`;
      const input = body.querySelector('#pl-word');
      const submit = () => {
        const v = (input.value || '').trim().toUpperCase();
        game.setFlag('parlour_guess', v.padEnd(6, '_').slice(0, 6));
        if (v === answer) {
          game.setFlag('parlour_open');
          game.playSfx('unlock');
          api.solved({ message: 'The word turns the lock like a key turning in water, and the door swings inward on the dark hall beyond.' });
          game.refreshScene();
        } else {
          api.fail('The lock holds. That is not the word — check the far wall with your partner.');
          game.refreshScene();
        }
      };
      body.querySelector('#pl-try').addEventListener('click', submit);
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
    },
  });
}
