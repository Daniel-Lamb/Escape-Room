// TRIAL BY JURY — which witness of the Wild Court this browser is playing.
// The fig-hoard was raided during the truce and the old Sloth stands accused.
// Four animals witnessed the night from four vantages; the jury (all of you)
// must cross-examine, catch the one witness who is lying, and name the real
// thief. No networking — you each see only your own account, and the detail
// that completes it is on the screen of the witness who spoke before you
// (Heron -> Gecko -> Boar -> Parrot -> Heron).
//
// Four witnesses. With four of you it's one each; with three, one player speaks
// for two; with more, sit the extra jurors beside a witness. Cover all four.

const ROLE_KEY = 'trial-by-jury-role';

/** @typedef {'p1'|'p2'|'p3'|'p4'} Role */

export const ROLES = {
  p1: { key: 'p1', name: 'The Heron', station: 'who watched from the river', badge: 'Player 1' },
  p2: { key: 'p2', name: 'The Gecko', station: 'who clung to the wall all night', badge: 'Player 2' },
  p3: { key: 'p3', name: 'The Boar', station: 'who rooted below the fig-tree', badge: 'Player 3' },
  p4: { key: 'p4', name: 'The Parrot', station: 'who repeats all it hears', badge: 'Player 4' },
};

// The cross-examination cycle: the detail your account is missing is on the
// screen of the witness who spoke before you (PREV); your screen completes the
// account of the witness after you (NEXT).
export const NEXT = { p1: 'p2', p2: 'p3', p3: 'p4', p4: 'p1' };
export const PREV = { p1: 'p4', p2: 'p1', p3: 'p2', p4: 'p3' };

/** @type {Role|null} */
let cached = null;

/** @param {Role} r */
export function setRole(r) {
  cached = r;
  try { localStorage.setItem(ROLE_KEY, r); } catch { /* private mode */ }
}

/** @returns {Role} */
export function getRole() {
  if (cached) return cached;
  try {
    const r = /** @type {Role} */ (localStorage.getItem(ROLE_KEY));
    if (ROLES[r]) { cached = r; return r; }
  } catch { /* private mode */ }
  return 'p1';
}

export function roleName(r = getRole()) { return ROLES[r].name; }
export function nextName(r = getRole()) { return ROLES[NEXT[r]].name; }

/** Save key namespaced by role, so every witness can be played on one machine. */
export function saveKeyForRole() { return `trial-by-jury-${getRole()}-save-v1`; }
