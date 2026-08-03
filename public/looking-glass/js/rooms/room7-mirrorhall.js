// SCENE 7 — The Mirror Hall (finale + META).
// The six shards, set in order 1..6, spell R-E-V-L-I-S. The glass keeps its true
// name reversed, so turn it about: SILVER. Each side holds only three shards
// (Waking: R,V,I ; Glass: E,L,S) — the word needs both journals.

import { getRole, isWaking, sideName } from '../role.js';
import { defs, backdrop, sideTag, sconce, tint } from '../glasskit.js';

const SLUG = 'hall';
const ANSWER = 'SILVER';

function done(state) { return !!state.flags.mirrorhall_done; }

export default {
  id: 'mirrorhall',
  get title() { return `${sideName()} · The Mirror Hall`; },
  get intro() {
    return 'The last hall, and the tallest mirror in the house — the twin of the one you woke beside, its frame ringed with six empty settings for shards. Set the word its shards spell and the glass will open, and the two of you can be one reflection again. But the glass keeps its name backwards, and you hold only half the shards.';
  },

  scene(state) {
    const t = tint();
    const fin = done(state);
    const mine = state.journal.filter(e => e.category === 'sun').sort((a, b) => a.sun.rays - b.sun.rays);
    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}</defs>
      ${backdrop(SLUG)}
      ${sconce(SLUG, 240, 300)}

      <!-- the great mirror -->
      <g>
        <rect x="600" y="150" width="400" height="560" rx="12" fill="none" stroke="${t.accentDim}" stroke-width="16"/>
        <rect x="622" y="172" width="356" height="516" fill="${fin ? 'rgba(255,207,138,0.10)' : 'rgba(159,168,189,0.06)'}"/>
        ${fin
          ? `<text x="800" y="440" text-anchor="middle" font-size="20" fill="${t.accent}" font-family="Georgia, serif">the silver goes to water</text>`
          : `<text x="800" y="440" text-anchor="middle" font-size="15" fill="${t.accentDim}" font-family="Georgia, serif" opacity="0.7">your friend, waiting</text>`}
        <!-- six shard settings around the frame -->
        ${[[600, 150], [1000, 150], [1000, 430], [1000, 710], [600, 710], [600, 430]].map(([x, y], i) =>
          `<circle cx="${x}" cy="${y}" r="12" fill="none" stroke="${t.accentDim}" stroke-width="3"/>`).join('')}
      </g>

      <!-- the plaque -->
      <g>
        <rect x="1120" y="200" width="400" height="170" rx="8" fill="${t.panel}" stroke="${t.accentDim}" stroke-width="3"/>
        <text x="1320" y="240" text-anchor="middle" font-size="14" fill="${t.accentDim}" font-family="Georgia, serif" letter-spacing="1">THE FRAME'S INSCRIPTION</text>
        <text x="1320" y="278" text-anchor="middle" font-size="15" fill="${t.ink}" font-family="Georgia, serif">"Set the shards in order, one to</text>
        <text x="1320" y="302" text-anchor="middle" font-size="15" fill="${t.ink}" font-family="Georgia, serif">six — then turn the word about,</text>
        <text x="1320" y="326" text-anchor="middle" font-size="15" fill="${t.ink}" font-family="Georgia, serif">for the glass keeps its name</text>
        <text x="1320" y="350" text-anchor="middle" font-size="15" fill="${t.ink}" font-family="Georgia, serif">reversed."</text>
      </g>

      <!-- this side's three shards -->
      <g>
        <rect x="120" y="560" width="440" height="200" rx="10" fill="${t.panel}" stroke="${t.accentDim}" stroke-width="3"/>
        <text x="340" y="600" text-anchor="middle" font-size="14" fill="${t.accentDim}" font-family="Georgia, serif" letter-spacing="1">YOUR THREE SHARDS</text>
        ${mine.map((e, i) => `
          <g transform="translate(${190 + i * 120} 680)">
            <polygon points="-30,-30 30,-34 34,4 16,44 -18,36 -32,-2" fill="rgba(201,204,214,0.08)" stroke="#c9ccd6" stroke-width="2"/>
            <text y="-4" text-anchor="middle" font-size="18" fill="#dfe6f2" font-family="Consolas, monospace" font-weight="bold">${e.sun.rays}</text>
            <text y="20" text-anchor="middle" font-size="18" fill="#e8ebf2" font-family="Georgia, serif">${e.sun.letter}</text>
          </g>`).join('')}
        <text x="340" y="748" text-anchor="middle" font-size="12" fill="#9fa8bd" font-family="Consolas, monospace">read number + letter to your partner</text>
      </g>

      ${sideTag()}
    </svg>`;
  },

  hotspots(state) {
    const spots = [];

    spots.push({
      id: 'plaque', x: 1120, y: 200, w: 400, h: 170, label: "The frame's inscription",
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
      id: 'shards', x: 120, y: 560, w: 440, h: 200, label: 'Your three shards',
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
        id: 'frame', x: 600, y: 150, w: 400, h: 560, label: 'The mirror-frame lock',
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
