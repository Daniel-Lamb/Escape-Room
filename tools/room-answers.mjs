// Shared by room-lint and room-walk: what a room's answer is, read from the
// room itself — its declared `solution` (a string, a list, or a function of the
// role), else the answer constants in its source (ANSWER, MY_ANSWER, SOLUTION,
// MYCODE, MY_CODE, COMBO, CODE, WORD), taking the current role's entry when the
// constant is keyed by role, else the literals its checks compare an entry
// against (`word === 'NORTH'`).

export const ANSWER_NAMES = ['ANSWER', 'MY_ANSWER', 'SOLUTION', 'MYCODE', 'MY_CODE', 'COMBO', 'CODE', 'WORD'];
export const norm = v => String(v).toUpperCase().replace(/[^A-Z0-9]/g, '');

// One answer, or several: a list of words is several answers; a list of
// digits or single letters is one answer spelled out.
export function flat(v) {
  if (typeof v === 'string' || typeof v === 'number') return [String(v)];
  if (Array.isArray(v) && v.every(x => typeof x === 'string' && x.length > 1)) return v;
  if (Array.isArray(v) && v.every(x => typeof x === 'string' || typeof x === 'number')) return [v.join('')];
  return [];
}

/** The room's answer(s) for this role, as strings. */
export function answersFor(room, role, src) {
  if (room.solution != null) {
    const v = typeof room.solution === 'function' ? room.solution(role) : room.solution;
    return [].concat(v).flatMap(x => flat(x));
  }
  const found = [];
  for (const name of ANSWER_NAMES) {
    const m = new RegExp(`\\bconst ${name}\\s*=\\s*([\\s\\S]*?);[ \\t]*(?://[^\\n]*)?\\n`).exec(src);
    if (!m) continue;
    let v;
    try { v = new Function(`return (${m[1]});`)(); } catch { continue; }
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      if (role && role in v) v = v[role]; else continue;
    }
    for (const f of flat(v)) if (norm(f).length >= 1) found.push(f);
  }
  // answers checked inline: `word === 'NORTH'`, `v === '5271'`
  if (!found.length) {
    for (const m of src.matchAll(/(?:\b\w+|\))\s*===\s*'([A-Z0-9][A-Z0-9 -]{2,})'/g)) {
      if (!found.includes(m[1])) found.push(m[1]);
    }
  }
  return found;
}

