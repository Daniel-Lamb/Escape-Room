// Two-player role: which end of the dive line this browser is playing.
// 'p1' = The Diver (down on the wreck of the Cormorant),
// 'p2' = The Tender (topside on the salvage boat Halcyon).
// The choice lives in localStorage so it survives reloads and is independent of
// the save-state lifecycle (resetState never wipes it). Rooms branch on getRole().

const ROLE_KEY = 'deep-six-role';

/** @type {'p1' | 'p2' | null} */
let cached = null;

/** @param {'p1' | 'p2'} r */
export function setRole(r) {
  cached = r;
  try { localStorage.setItem(ROLE_KEY, r); } catch { /* private mode */ }
}

/** @returns {'p1' | 'p2'} */
export function getRole() {
  if (cached) return cached;
  try {
    const r = localStorage.getItem(ROLE_KEY);
    if (r === 'p1' || r === 'p2') { cached = r; return r; }
  } catch { /* private mode */ }
  return 'p1';
}

export function isDiver() { return getRole() === 'p1'; }
export function isTender() { return getRole() === 'p2'; }

/** Human role name for the current player. */
export function roleName() { return isDiver() ? 'The Diver' : 'The Tender'; }
export function otherRoleName() { return isDiver() ? 'The Tender' : 'The Diver'; }
export function roleSub() { return isDiver() ? 'on the wreck of the Cormorant' : 'topside · the Halcyon'; }

/** Save key namespaced by role, so both ends can be played on one machine. */
export function saveKeyForRole() { return `deep-six-${getRole()}-save-v1`; }
