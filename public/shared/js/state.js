// @ts-check
// Central game state + persistence.
// All mutable progress lives here so saving/loading is one JSON blob.

/**
 * A journal entry. 'sun' entries are the per-game collectibles (the meta
 * puzzle); 'note' entries are plain narrative notes.
 * @typedef {Object} JournalEntry
 * @property {string} id
 * @property {string} [title]
 * @property {'sun' | 'note'} category
 * @property {string} [html]
 * @property {{ rays: number, letter: string }} [sun]
 */

/**
 * The entire persisted run — one JSON blob in localStorage under the save key.
 * @typedef {Object} SaveState
 * @property {number} version
 * @property {boolean} started
 * @property {boolean} finished
 * @property {number} currentRoom          index into the ordered room list
 * @property {number} timeLeft             seconds remaining on the clock
 * @property {string[]} inventory          item ids held
 * @property {Record<string, unknown>} flags
 * @property {JournalEntry[]} journal
 * @property {Record<string, number>} hintsUsed   "roomId:ctx" -> tiers consumed (0-3)
 * @property {number} totalHints
 * @property {number} penaltySeconds       accumulated hint/mistake costs (end stats)
 * @property {number | null} startedAt      wall-clock ms when the run began
 */

let SAVE_KEY = 'escape-room-save-v1';   // each game overrides via configureSave()
const SAVE_VERSION = 1;

// Called once by each game's main.js BEFORE any save/load operation.
/** @param {string} key */
export function configureSave(key) { SAVE_KEY = key; }
export function getSaveKey() { return SAVE_KEY; }

export const TOTAL_SECONDS = 60 * 60;

/** @returns {SaveState} */
export function freshState() {
  return {
    version: SAVE_VERSION,
    started: false,
    finished: false,
    currentRoom: 0,
    timeLeft: TOTAL_SECONDS,
    inventory: [],
    flags: {},
    journal: [],        // [{id, title, category: 'sun'|'note', html, sun:{rays,letter}}]
    hintsUsed: {},      // "roomId:ctx" -> number of hint tiers consumed (0-3)
    totalHints: 0,
    penaltySeconds: 0,  // accumulated hint/mistake costs, for end stats
    startedAt: null,    // wall-clock ms when run began (stats only)
  };
}

export let state = freshState();

export function resetState() {
  state = freshState();
  try { localStorage.removeItem(SAVE_KEY); } catch { /* private mode */ }
  return state;
}

export function saveState() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch { /* storage unavailable — play session still works */ }
}

export function hasSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const s = JSON.parse(raw);
    return s && s.version === SAVE_VERSION && s.started && !s.finished;
  } catch {
    return false;
  }
}

/** @returns {SaveState | null} */
export function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s || s.version !== SAVE_VERSION) return null;
    state = Object.assign(freshState(), s);
    return state;
  } catch {
    return null;
  }
}
