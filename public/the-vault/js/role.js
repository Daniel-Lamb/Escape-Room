// THE VAULT — which station of the crew this browser is playing.
// A four-handed heist: everyone opens the game on their own device and picks a
// role. There is no networking — the co-op is enforced by design. In every scene
// each player has their own lock, and the code that opens it is shown on the
// NEXT player's screen (a cycle: Cracker → Wire → Face → Wheel → Cracker). You
// solve your lock by asking the crewmate whose screen holds your code.
//
// Four roles. With four of you it's one each; with three, one player runs two
// stations (two browser tabs); with five or six, ride shotgun on the busy ones.

const ROLE_KEY = 'the-vault-role';

/** @typedef {'p1'|'p2'|'p3'|'p4'} Role */

export const ROLES = {
  p1: { key: 'p1', name: 'The Cracker', station: 'the vault door', badge: 'Player 1' },
  p2: { key: 'p2', name: 'The Wire', station: 'the security closet', badge: 'Player 2' },
  p3: { key: 'p3', name: 'The Face', station: "the manager's floor", badge: 'Player 3' },
  p4: { key: 'p4', name: 'The Wheel', station: 'the van, across the street', badge: 'Player 4' },
};

// The cross-read cycle: your code is shown on NEXT[you]'s screen; you hold
// (and read out) the code for the crewmate NEXT[you] in turn.
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
export function roleStation(r = getRole()) { return ROLES[r].station; }
export function nextName(r = getRole()) { return ROLES[NEXT[r]].name; }

/** Save key namespaced by role, so every station can be played on one machine. */
export function saveKeyForRole() { return `the-vault-${getRole()}-save-v1`; }
