// Two-player role: which side of the job this browser is playing.
// 'p1' = The Hand (inside the museum), 'p2' = The Eye (the van / overwatch).
// The choice lives in localStorage so it survives reloads and is independent of
// the save-state lifecycle (resetState never wipes it). Rooms branch on getRole().

const ROLE_KEY = 'silent-alarm-role';

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

export function isHand() { return getRole() === 'p1'; }
export function isEye() { return getRole() === 'p2'; }

/** Human role name for the current player. */
export function roleName() { return isHand() ? 'The Hand' : 'The Eye'; }
export function otherRoleName() { return isHand() ? 'The Eye' : 'The Hand'; }

/** Save key namespaced by role, so both sides can be played on one machine. */
export function saveKeyForRole() { return `silent-alarm-${getRole()}-save-v1`; }
