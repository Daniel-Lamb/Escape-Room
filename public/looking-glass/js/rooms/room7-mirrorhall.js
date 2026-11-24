// SCENE 7 — The Mirror Hall (finale + META).
// The six shards, set in order 1..6, spell R-E-V-L-I-S. The glass keeps its true
// name reversed, so turn it about: SILVER. Each side holds only three shards
// (Waking: R,V,I ; Glass: E,L,S) — the word needs both journals.

import { getRole, isWaking, sideName } from '../role.js';
import { defs, backdrop, sideTag, mirrorGlass, sconce, tint } from '../glasskit.js';
import { dock, DOCK, panel, shadow } from '../../../shared/js/scenekit.js';

const SLUG = 'hall';
const ANSWER = 'SILVER';

// The great mirror stands free in the middle of the hall (the plate's mirrors
// line the walls): glass, gilt frame, a plinth carrying the inscription.
const GLASS = { x: 662, y: 132, w: 276, h: 456 };
const FRAME = { x: 640, y: 110, w: 320, h: 500 };
const BASE = { x: 612, y: 610, w: 376, h: 92 };
const PLAQUE = { x: 630, y: 620, w: 340, h: 72 };
const SETTINGS = [[650, 120], [950, 120], [960, 360], [950, 600], [650, 600], [640, 360]];

function done(state) { return !!state.flags.mirrorhall_done; }

export default {
  id: 'mirrorhall',
  lintStates: [{ label: 'solved', flags: { mirrorhall_done: true } }],
  get title() { return `${sideName()} · The Mirror Hall`; },
  get intro() {
    return 'The last hall, lined with mirrors, and standing free in the middle of it the tallest mirror in the house — the twin of the one you woke beside, its frame ringed with six empty settings for shards. Set the word its shards spell and the glass will open, and the two of you can be one reflection again. But the glass keeps its name backwards, and you hold only half the shards.';
  },

  scene(state) {
    const t = tint();
    const fin = done(state);
    const mine = state.journal.filter(e => e.category === 'sun').sort((a, b) => a.sun.rays - b.sun.rays);
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}</defs>
      ${backdrop(SLUG)}
      ${sconce(SLUG, 1300, 682, 'stand')}

      <!-- the great mirror, standing free in the middle of the hall on its plinth -->
      <g data-mount="floor">
        ${shadow(800, BASE.y + BASE.h + 4, 230, 14)}
        <rect x="${BASE.x}" y="${BASE.y}" width="${BASE.w}" height="${BASE.h}" rx="6" fill="url(#sk_darkwood)" stroke="#0b0703" stroke-width="3"/>
        <rect x="${GLASS.x - 22}" y="${GLASS.y - 22}" width="${GLASS.w + 44}" height="${GLASS.h + 44}" rx="14" fill="url(#sk_brass)" stroke="#3a2a0c" stroke-width="3" filter="url(#sk_drop)"/>
        ${mirrorGlass(GLASS.x, GLASS.y, GLASS.w, GLASS.h, { open: fin })}
        ${fin ? `<text x="800" y="380" text-anchor="middle" font-size="20" fill="${t.accent}" font-family="Georgia, serif">the silver goes to water</text>` : ''}
        <!-- six empty shard settings round the frame -->
        ${SETTINGS.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11" fill="#140f06" stroke="#3a2a0c" stroke-width="3"/>`).join('')}
      </g>

      <!-- the inscription, a brass plate on the plinth -->
      ${panel({ ...PLAQUE, material: 'brass', mount: 'bolts', rx: 4, body: `
        <text x="800" y="${PLAQUE.y + 24}" text-anchor="middle" font-size="13" fill="#2a1d05" font-family="Georgia, serif" font-style="italic">"Set the shards in order, one to six —</text>
        <text x="800" y="${PLAQUE.y + 42}" text-anchor="middle" font-size="13" fill="#2a1d05" font-family="Georgia, serif" font-style="italic">then turn the word about, for the</text>
        <text x="800" y="${PLAQUE.y + 60}" text-anchor="middle" font-size="13" fill="#2a1d05" font-family="Georgia, serif" font-style="italic">glass keeps its name reversed."</text>` })}

      <!-- this side's three shards, in the pocket-book -->
      ${dock({ x: 0, y: 0, w: 440, h: 200 }, `
        ${mine.map((e, i) => `
          <g transform="translate(${80 + i * 140} 82)">
            <polygon points="-40,-44 40,-48 46,6 22,58 -24,48 -42,-2" fill="#dfe3ea" stroke="#6b7484" stroke-width="2.5"/>
            <text y="-6" text-anchor="middle" font-size="26" fill="#26221a" font-family="Consolas, monospace" font-weight="bold">${e.sun.rays}</text>
            <text y="30" text-anchor="middle" font-size="28" fill="#26221a" font-family="Georgia, serif">${e.sun.letter}</text>
          </g>`).join('') || '<text x="220" y="96" text-anchor="middle" font-size="22" fill="#6b5a3a" font-family="Georgia, serif">no shards yet</text>'}
        <text x="220" y="186" text-anchor="middle" font-size="20" fill="#6b5a3a" font-family="Georgia, serif">read number + letter to your partner</text>`, { kind: 'notebook', title: 'POCKET-BOOK' })}

      ${sideTag()}
    </svg>`;
  },

  hotspots(state) {
    const spots = [];

    spots.push({
      id: 'plaque', ...PLAQUE, label: "The frame's inscription",
      onInteract(game) {
        const html = `<div class="manor-note"><div class="note-head">The frame's inscription</div>
          <p>"Set the shards in order, one to six — then <strong>turn the word about</strong>, for
          the glass keeps its true name reversed."</p></div>
          <div class="relay">You hold three shards; your partner holds three. Read yours to each other, lay all six out by number 1→6 to read a word, then reverse it — that reversed word opens the glass.</div>`;
        game.journal.add('note_frameplaque', { title: "The mirror-frame inscription", category: 'note', html });
        game.dialog({ title: 'The Inscription', html });
      },
    });

    spots.push({
      id: 'shards', ...DOCK, label: 'Your three shards',
      onInteract(game) {
        const mine = game.state.journal.filter(e => e.category === 'sun').sort((a, b) => a.sun.rays - b.sun.rays);
        const list = mine.map(e => `number <b>${e.sun.rays}</b> = "<b>${e.sun.letter}</b>"`).join(' &nbsp; · &nbsp; ');
        const html = `<div class="cipher"><div class="cipher-title">${sideName()} — shards in your Reflections</div>
          <p style="text-align:center;">${list || 'none yet'}</p></div>
          <div class="relay">Read these three to your partner and get their three. In order 1→6 they read a word — then turn it about.</div>`;
        game.dialog({ title: 'Your Shards', html });
      },
    });

    if (!done(state)) {
      spots.push({
        id: 'frame', ...FRAME, label: 'The mirror-frame lock',
        onInteract(game) { openFrame(game); },
      });
    }

    return spots;
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: 'Six shards make the word; you carry three, your partner carries three. Trade them all.', cost: 60 },
      { text: 'Lay all six shards out by number, 1 to 6 — that reads a word. The glass keeps its name backwards, so reverse it.', cost: 120 },
      { text: 'In order the shards read R-E-V-L-I-S. Reversed: SILVER. Set the glass to SILVER.', cost: 240 },
    ];
  },
};

function openFrame(game) {
  game.openPuzzle({
    id: 'mirrorhall_frame',
    title: 'Name the Glass',
    render(body, api) {
      body.innerHTML = `
        <div class="puzzle-hero" style="background-image:url(art/pz-mirror.webp)"></div>
        <p class="puzzle-desc">Pool all six shards with your partner, set them in order 1→6 to read a
        word, then turn it about — the glass keeps its name reversed. Speak the true name.</p>
        <div class="puzzle-row">
          <input class="puzzle-input" id="mh-word" maxlength="6" autocomplete="off"
            placeholder="the true name" style="text-transform:uppercase;letter-spacing:8px;text-align:center;width:240px;" />
        </div>
        <div class="puzzle-row"><button class="btn btn-primary" id="mh-set">Open the Glass</button></div>
        <div class="puzzle-feedback"></div>`;
      const input = body.querySelector('#mh-word');
      const submit = () => {
        const v = (input.value || '').trim().toUpperCase();
        if (v === ANSWER) {
          game.setFlag('mirrorhall_done');
          game.playSfx('victory');
          game.refreshScene();
          game.say('You speak the glass its own true name and the silver softens to water. A black cat threads once between the two of you through the open frame, purring, insufferably pleased.');
          game.completeRoom({ delay: 1600 });
        } else if (v === 'REVLIS') {
          api.fail('That is the word the shards read — but the glass keeps its name reversed. Turn it about.');
        } else {
          api.fail('The glass stays hard. Pool all six shards, in order, and remember to reverse the word.');
        }
      };
      body.querySelector('#mh-set').addEventListener('click', submit);
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
    },
  });
}
