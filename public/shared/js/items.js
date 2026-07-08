// @ts-check
// Item registry. Core defines nothing — each room module registers the items
// it introduces via registerItems() at module load, so room files stay
// self-contained and can be authored independently.

/**
 * @typedef {Object} ItemDef
 * @property {string} name
 * @property {string} icon         inline SVG markup, viewBox 0 0 48 48
 * @property {string} description  shown when the item is examined in inventory
 */

/**
 * A combination recipe: clicking inventory item B while holding item A.
 * onCombine is responsible for removing/adding items and narrating.
 * @typedef {Object} ComboDef
 * @property {[string, string]} pair
 * @property {(game: import('./engine.js').GameAPI, held: string, other: string) => void} onCombine
 */

/** @type {Record<string, ItemDef>} */
export const ITEMS = {};

/** @param {Record<string, ItemDef>} defs */
export function registerItems(defs) {
  for (const [id, def] of Object.entries(defs)) {
    if (ITEMS[id]) console.warn(`item id collision: ${id}`);
    ITEMS[id] = def;
  }
}

/** @type {ComboDef[]} */
const COMBOS = [];

/** @param {ComboDef[]} defs */
export function registerCombos(defs) {
  COMBOS.push(...defs);
}

/**
 * @param {string} a
 * @param {string} b
 * @returns {ComboDef | null}
 */
export function getCombo(a, b) {
  return COMBOS.find(c =>
    (c.pair[0] === a && c.pair[1] === b) || (c.pair[0] === b && c.pair[1] === a)
  ) || null;
}

/**
 * @param {string} id
 * @returns {ItemDef}
 */
export function getItem(id) {
  return ITEMS[id] || {
    name: id,
    description: 'A mysterious object.',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="16" fill="none" stroke="#c9a227" stroke-width="2"/>
      <text x="24" y="30" text-anchor="middle" font-size="20" fill="#c9a227">?</text>
    </svg>`,
  };
}
