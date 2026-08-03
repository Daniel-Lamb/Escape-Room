// Two-player role: which tower this browser is playing.
// 'p1' = West Tower (Kestrel Point), 'p2' = East Tower (Gannet Rock).
// The choice lives in localStorage so it survives reloads and is independent of
// the save-state lifecycle (resetState never wipes it). Rooms branch on getRole().

const ROLE_KEY = 'signal-towers-role';

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

export function isWest() { return getRole() === 'p1'; }
export function isEast() { return getRole() === 'p2'; }

/** Human tower name for the current role. */
export function towerName() { return isWest() ? 'West Tower' : 'East Tower'; }
export function otherTowerName() { return isWest() ? 'East Tower' : 'West Tower'; }

/** Save key namespaced by role, so both towers can be played on one machine. */
export function saveKeyForRole() { return `signal-towers-${getRole()}-save-v1`; }
