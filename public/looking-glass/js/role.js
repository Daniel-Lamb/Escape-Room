// Two-player role for The Looking Glass. 'p1' = The Waking Side (the real manor);
// 'p2' = The Glass Side (inside the mirror, a reversed reflection). Stored in
// localStorage, independent of the save lifecycle. Rooms branch on getRole().

const ROLE_KEY = 'looking-glass-role';

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

export function isWaking() { return getRole() === 'p1'; }
export function isGlass() { return getRole() === 'p2'; }

export function sideName() { return isWaking() ? 'The Waking Side' : 'The Glass Side'; }
export function otherSideName() { return isWaking() ? 'The Glass Side' : 'The Waking Side'; }

export function saveKeyForRole() { return `looking-glass-${getRole()}-save-v1`; }
