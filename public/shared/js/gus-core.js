// @ts-check
// Gus core — the theme-agnostic companion machinery shared by every escape
// room in the series. Each game supplies a FORM (see e.g.
// pilgrims-road/js/gus.js): { name, epithet, form, portrait(size), lines }.
// The core owns the dock button, the dialog, and the paid hint-tier ladder:
// nudge (−1:00) → method (−2:00) → answer (−4:00), re-readable once paid.

/**
 * @typedef {Object} GusLines
 * @property {string[]} greetings
 * @property {string} noMore
 * @property {string} stuck
 * @property {string[]} tierNames
 * @property {string} [buyLabel]
 */

/**
 * A game's Gus identity. Machinery is shared; only this differs per game.
 * @typedef {Object} GusForm
 * @property {string} name
 * @property {string} epithet
 * @property {string} [form]
 * @property {(size: string) => string} portrait
 * @property {GusLines} lines
 */

/**
 * Everything the core needs from the engine, injected by initGus.
 * @typedef {Object} GusDeps
 * @property {GusForm} form
 * @property {() => import('./engine.js').RoomModule} getRoom
 * @property {() => import('./state.js').SaveState} getState
 * @property {(opts: object) => import('./engine.js').ModalHandle} dialog
 * @property {(seconds: number) => void} penalize
 * @property {() => void} save
 * @property {(name: string) => void} playSfx
 */

const TIER_COSTS = [60, 120, 240];

/** @type {GusDeps} */
let deps = /** @type {any} */ (null);
let greetIdx = 0;

/** @param {GusDeps} dependencies */
export function initGus(dependencies) {
  deps = dependencies;
  const dock = /** @type {HTMLElement} */ (document.getElementById('gus-dock'));
  dock.innerHTML = deps.form.portrait('small');
  dock.dataset.label = `Ask ${deps.form.name}`;
  dock.title = `${deps.form.epithet} — stuck? Ask ${deps.form.name}.`;
  dock.addEventListener('click', () => {
    deps.playSfx('hint');
    openGusDialog();
  });
}

/**
 * @param {import('./engine.js').RoomModule} room
 * @param {import('./state.js').SaveState} state
 * @returns {import('./engine.js').Hint[]}
 */
function resolveHints(room, state) {
  const h = typeof room.hints === 'function' ? room.hints(state) : room.hints;
  return h || [];
}

export function openGusDialog() {
  const GUS = deps.form;
  const room = deps.getRoom();
  const state = deps.getState();
  const hints = resolveHints(room, state);
  // context key lets a room present multiple hint ladders (e.g. door vs winch)
  const ctx = typeof room.hintContext === 'function' ? room.hintContext(state) : 'main';
  const usedKey = `${room.id}:${ctx}`;
  const used = state.hintsUsed[usedKey] || 0;

  const greeting = used === 0
    ? GUS.lines.greetings[greetIdx++ % GUS.lines.greetings.length]
    : (used >= hints.length ? GUS.lines.noMore : GUS.lines.stuck);

  const tiersHtml = hints.map((h, i) => {
    if (i < used) {
      return `<div class="gus-tier unlocked">
        <div class="gus-tier-name">${GUS.lines.tierNames[i] || `Hint ${i + 1}`} <span class="gus-tier-paid">paid</span></div>
        <div class="gus-tier-text">${escapeHtml(h.text)}</div>
      </div>`;
    }
    if (i === used) {
      const cost = h.cost ?? TIER_COSTS[Math.min(i, TIER_COSTS.length - 1)];
      return `<div class="gus-tier next">
        <div class="gus-tier-name">${GUS.lines.tierNames[i] || `Hint ${i + 1}`}</div>
        <button class="btn gus-tier-buy" data-tier="${i}" data-cost="${cost}">
          ${GUS.lines.buyLabel || 'Whisper it'} <span class="gus-cost">&minus;${Math.round(cost / 60)}:00</span>
        </button>
      </div>`;
    }
    return `<div class="gus-tier locked">
      <div class="gus-tier-name">${GUS.lines.tierNames[i] || `Hint ${i + 1}`} <span class="gus-tier-lock">&#128274;</span></div>
    </div>`;
  }).join('');

  const modal = deps.dialog({
    title: GUS.epithet,
    wide: false,
    html: `
      <div class="gus-dialog">
        <div class="gus-portrait">${GUS.portrait('large')}</div>
        <div class="gus-right">
          <p class="gus-speech">&ldquo;${escapeHtml(greeting)}&rdquo;</p>
          <div class="gus-tiers">${tiersHtml}</div>
        </div>
      </div>`,
  });

  const buyBtn = /** @type {HTMLButtonElement | null} */ (modal.card.querySelector('.gus-tier-buy'));
  if (buyBtn) {
    buyBtn.addEventListener('click', () => {
      const tier = Number(buyBtn.dataset.tier);
      const cost = Number(buyBtn.dataset.cost);
      state.hintsUsed[usedKey] = tier + 1;
      state.totalHints += 1;
      deps.penalize(cost);
      deps.save();
      deps.playSfx('hint');
      modal.close();
      openGusDialog();   // reopen showing the freshly unlocked tier
    });
  }
}

/** @param {*} s */
function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
