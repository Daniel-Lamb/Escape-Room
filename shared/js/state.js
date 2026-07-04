// Central game state + persistence.
// All mutable progress lives here so saving/loading is one JSON blob.

let SAVE_KEY = 'escape-room-save-v1';   // each game overrides via configureSave()
const SAVE_VERSION = 1;

// Called once by each game's main.js BEFORE any save/load operation.
export function configureSave(key) { SAVE_KEY = key; }
export function getSaveKey() { return SAVE_KEY; }

export const TOTAL_SECONDS = 60 * 60;

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
