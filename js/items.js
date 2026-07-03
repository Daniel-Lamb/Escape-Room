// Item registry. Core defines nothing — each room module registers the items
// it introduces via registerItems() at module load, so room files stay
// self-contained and can be authored independently.

export const ITEMS = {};

// def: { name: string, icon: string (inline SVG markup, viewBox 0 0 48 48),
//        description: string (shown when examined in inventory) }
export function registerItems(defs) {
  for (const [id, def] of Object.entries(defs)) {
    if (ITEMS[id]) console.warn(`item id collision: ${id}`);
    ITEMS[id] = def;
  }
}

// Combination recipes: clicking inventory item B while holding item A.
const COMBOS = [];

// defs: [{ pair: ['flint_steel', 'candle_stub'], onCombine(game) }]
// onCombine is responsible for removing/adding items and narrating.
export function registerCombos(defs) {
  COMBOS.push(...defs);
}

export function getCombo(a, b) {
  return COMBOS.find(c =>
    (c.pair[0] === a && c.pair[1] === b) || (c.pair[0] === b && c.pair[1] === a)
  ) || null;
}

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
