// Touch hit areas for small hotspots.
//
// On a phone the 1600x900 scene is drawn ~460px wide (on its side) or ~355px
// (upright), so a 60-unit hotspot is a 13–17px target. On touch screens the
// engine gives each small hotspot an invisible larger hit area (a ::before on
// the button, see .hotspot::before in main.css). The art, the outline and the
// label stay where they are.
//
// The hit area only grows into free space: on each side by at most GROW scene
// units, and at most half the gap to the nearest hotspot that side, so two
// neighbours split the space between them and neither can take the other's
// taps. It never enters the Gus corner or leaves the scene, and if any grown
// area would still touch another hotspot's area, that hotspot keeps its own
// rectangle. Pure: scene coordinates in, per-side growth out.

/** @typedef {{ x: number, y: number, w: number, h: number }} Rect */
/** @typedef {{ l: number, r: number, t: number, b: number }} Growth */

export const SMALL = 110;               // short side under this (scene units) counts as small
export const GROW = 30;                 // most a side may grow (~8.5px on a phone held sideways)
export const GUS_ZONE = { x: 0, y: 0, w: 220, h: 250 };
const NONE = /** @type {Growth} */ ({ l: 0, r: 0, t: 0, b: 0 });

/** @param {Rect} a @param {Rect} b */
const meets = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
/** @param {Rect} s @param {Growth} g @returns {Rect} */
export const grown = (s, g) => ({ x: s.x - g.l, y: s.y - g.t, w: s.w + g.l + g.r, h: s.h + g.t + g.b });

/**
 * Per-side growth for each hotspot (scene units, same order as `spots`).
 * @param {Rect[]} spots
 * @returns {Growth[]}
 */
export function touchGrowth(spots) {
  const out = spots.map((s, i) => {
    if (Math.min(s.w, s.h) >= SMALL) return NONE;
    // an intentionally stacked hotspot keeps its own rectangle
    if (spots.some((o, j) => j !== i && meets(s, o))) return NONE;
    let l = Math.min(GROW, s.x), r = Math.min(GROW, 1600 - (s.x + s.w));
    let t = Math.min(GROW, s.y), b = Math.min(GROW, 900 - (s.y + s.h));
    for (const [j, o] of spots.entries()) {
      if (j === i) continue;
      const rowmate = o.y < s.y + s.h && s.y < o.y + o.h;   // shares some height: a side neighbour
      const colmate = o.x < s.x + s.w && s.x < o.x + o.w;   // shares some width: above or below
      if (rowmate && o.x + o.w <= s.x) l = Math.min(l, (s.x - (o.x + o.w)) / 2);
      if (rowmate && o.x >= s.x + s.w) r = Math.min(r, (o.x - (s.x + s.w)) / 2);
      if (colmate && o.y + o.h <= s.y) t = Math.min(t, (s.y - (o.y + o.h)) / 2);
      if (colmate && o.y >= s.y + s.h) b = Math.min(b, (o.y - (s.y + s.h)) / 2);
    }
    /** @type {Growth} */
    let g = { l: Math.max(0, l), r: Math.max(0, r), t: Math.max(0, t), b: Math.max(0, b) };
    // keep out of Gus's corner: give up the side that would reach into it
    if (meets(grown(s, g), GUS_ZONE)) {
      if (s.x >= GUS_ZONE.x + GUS_ZONE.w) g = { ...g, l: Math.min(g.l, s.x - (GUS_ZONE.x + GUS_ZONE.w)) };
      if (meets(grown(s, g), GUS_ZONE) && s.y >= GUS_ZONE.y + GUS_ZONE.h) g = { ...g, t: Math.min(g.t, s.y - (GUS_ZONE.y + GUS_ZONE.h)) };
      if (meets(grown(s, g), GUS_ZONE)) g = NONE;
    }
    return g;
  });
  // corners can still meet a diagonal neighbour's grown area: drop growth for both
  const areas = spots.map((s, i) => grown(s, out[i]));
  for (let i = 0; i < spots.length; i++) for (let j = i + 1; j < spots.length; j++) {
    if (out[i] === NONE && out[j] === NONE) continue;
    if (meets(areas[i], areas[j]) && !meets(spots[i], spots[j])) {
      out[i] = NONE; out[j] = NONE;
    }
  }
  // dropping one pair can't create a new meeting (areas only shrank), so one pass is enough
  return out;
}
