import { create } from "zustand"

// EDEN: The Four Rivers — game state (docs/DESIGN-EDEN.md, spec §14).
// Puzzle validation lives here, decoupled from visuals: scenes subscribe to
// state and to the event log, never the other way around.

export type RiverId = "pishon" | "gihon" | "hiddekel" | "euphrates"
export type AnimalId = "peacock" | "deer" | "dove" | "lion"
export type TabletId = "watcher" | "wanderer" | "messenger" | "dawn" | null
export type WingAngle = "outward" | "lowered" | "raised" | "east"
export type Ending = "exile" | "restoration" | null

export interface EdenEvent {
  type:
    | "RIVER_SOLVED"
    | "ANIMAL_NAMED"
    | "GROVE_SOLVED"
    | "LIGHT_SEAL_HIT"
    | "GATE_OPENED"
    | "FRUIT_TAKEN"
    | "FRUIT_RETURNED"
    | "SAPLING_WATERED"
    | "ENDING"
  detail?: string
}

export const RIVERS: RiverId[] = ["pishon", "gihon", "hiddekel", "euphrates"]
export const ANIMALS: AnimalId[] = ["peacock", "deer", "dove", "lion"]

// Correct answers
export const RIVER_SOLUTION: Record<RiverId, number> = {
  pishon: 1, // channel arm toward the golden vein
  gihon: 2, // water passes BENEATH the roots
  hiddekel: 0, // toward the sunrise marker (east)
  euphrates: 3, // through the reed marsh basin
}
export const GROVE_SOLUTION: Record<AnimalId, Exclude<TabletId, null>> = {
  peacock: "watcher",
  deer: "wanderer", // Gus — the Gentle Wanderer
  dove: "messenger",
  lion: "dawn",
}
export const GATE_SOLUTION: WingAngle[] = ["outward", "lowered", "raised", "east"] // panels 0..3 = peacock, deer, dove, lion

export const TABLET_NAMES: Record<Exclude<TabletId, null>, string> = {
  watcher: "The Crowned Watcher",
  wanderer: "The Gentle Wanderer",
  messenger: "The Messenger Above",
  dawn: "The Keeper of the Dawn",
}

const TABLET_CYCLE: TabletId[] = [null, "watcher", "wanderer", "messenger", "dawn"]
const WING_CYCLE: WingAngle[] = ["outward", "lowered", "raised", "east"]

export interface EdenState {
  // progression flags (spec §14)
  introComplete: boolean
  compassRecovered: boolean
  medallionDir: number // 0 N · 1 E · 2 S · 3 W — correct: 1 (east)
  shutterOpen: boolean
  riverOrientation: Record<RiverId, number>
  riverSolved: Record<RiverId, boolean>
  pedestalTablet: Record<AnimalId, TabletId>
  animalNamed: Record<AnimalId, boolean>
  groveSolved: boolean
  feathers: number
  prismHeld: boolean
  prismInserted: boolean
  guardianWingAngles: WingAngle[]
  gateOpened: boolean
  fruitHeld: boolean
  fruitTaken: boolean
  fruitReturned: boolean
  vessel: "none" | "empty" | "full"
  saplingWatered: boolean
  muralFragments: number
  endingUnlocked: Ending
  // hint economy (bloom instead of clock — see DESIGN-EDEN.md)
  hintsUsed: Record<string, number>
  bloomPenalty: number
  // presentation
  narration: string
  events: EdenEvent[]

  say: (text: string) => void
  emit: (e: EdenEvent) => void
  rotateMedallion: () => void
  toggleShutter: () => void
  useBellows: () => void
  rotateRiver: (r: RiverId) => void
  cycleTablet: (a: AnimalId) => void
  cycleWing: (i: number) => void
  takePrism: () => void
  insertPrism: () => void
  takeFruit: () => void
  returnFruit: () => void
  takeVessel: () => void
  fillVessel: () => void
  waterSapling: () => void
  placeInDepression: () => void
  collectMural: () => void
  buyHint: (ctx: string, tier: number) => void
}

export const riversAllSolved = (s: EdenState) => RIVERS.every((r) => s.riverSolved[r])

export const useEden = create<EdenState>((set, get) => ({
  introComplete: false,
  compassRecovered: false,
  medallionDir: 0,
  shutterOpen: false,
  riverOrientation: { pishon: 0, gihon: 0, hiddekel: 2, euphrates: 1 },
  riverSolved: { pishon: false, gihon: false, hiddekel: false, euphrates: false },
  pedestalTablet: { peacock: null, deer: null, dove: null, lion: null },
  animalNamed: { peacock: false, deer: false, dove: false, lion: false },
  groveSolved: false,
  feathers: 0,
  prismHeld: false,
  prismInserted: false,
  guardianWingAngles: ["raised", "outward", "east", "lowered"],
  gateOpened: false,
  fruitHeld: false,
  fruitTaken: false,
  fruitReturned: false,
  vessel: "none",
  saplingWatered: false,
  muralFragments: 0,
  endingUnlocked: null,
  hintsUsed: {},
  bloomPenalty: 0,
  narration: "",
  events: [],

  // Narration interrupts rather than queuing (series rule — see engine.js say()).
  say: (text) => set({ narration: text }),
  emit: (e) => set((s) => ({ events: [...s.events, e] })),

  rotateMedallion: () => {
    const s = get()
    const dir = (s.medallionDir + 1) % 4
    set({ medallionDir: dir })
    s.say(dir === 1 ? "The medallion arrow settles, pointing east — toward the reeds in the mural." : "The floor medallion grinds round a quarter turn.")
  },
  toggleShutter: () => {
    const s = get()
    set({ shutterOpen: !s.shutterOpen })
    s.say(!s.shutterOpen ? "The stone shutter slides open. A hard blade of morning light cuts across the dust." : "The shutter closes. The chamber dims.")
  },
  useBellows: () => {
    const s = get()
    if (s.compassRecovered) return s.say("The dust has already spoken.")
    if (s.medallionDir === 1 && s.shutterOpen) {
      set({ compassRecovered: true, introComplete: true })
      s.say("Dust rises through the light — and settles into grooves. Four rivers, circling a compass. The Eden Compass is yours.")
    } else {
      s.say("The dust scatters and settles. Nothing. The mural's reeds bend as if leaning somewhere...")
    }
  },

  rotateRiver: (r) => {
    const s = get()
    if (s.riverSolved[r]) return s.say("This channel already runs true.")
    if (!s.compassRecovered) return s.say("The mechanism is locked. Something in the vestibule comes first.")
    const o = (s.riverOrientation[r] + 1) % 4
    const solved = o === RIVER_SOLUTION[r]
    set({
      riverOrientation: { ...s.riverOrientation, [r]: o },
      riverSolved: { ...s.riverSolved, [r]: solved },
    })
    if (solved) {
      s.emit({ type: "RIVER_SOLVED", detail: r })
      const left = RIVERS.filter((x) => !get().riverSolved[x]).length
      s.say(
        left === 0
          ? "The last channel locks true — and the fountain ERUPTS. Four rivers race outward, and the world turns green behind them. Roots part to the north."
          : `Water surges down the ${r} channel. Moss chases it along the stone. ${left} river${left > 1 ? "s" : ""} still dry.`
      )
    } else {
      s.say("Stone grinds; the channel turns a quarter. Still dry.")
    }
  },

  cycleTablet: (a) => {
    const s = get()
    if (s.groveSolved) return
    const cur = TABLET_CYCLE.indexOf(s.pedestalTablet[a])
    const next = TABLET_CYCLE[(cur + 1) % TABLET_CYCLE.length]
    const tablets = { ...s.pedestalTablet, [a]: next }
    const named = Object.fromEntries(ANIMALS.map((x) => [x, tablets[x] === GROVE_SOLUTION[x]])) as Record<AnimalId, boolean>
    const all = ANIMALS.every((x) => named[x])
    set({ pedestalTablet: tablets, animalNamed: named, groveSolved: all, feathers: all ? 4 : s.feathers, prismHeld: all ? true : s.prismHeld })
    if (all) {
      ANIMALS.forEach((x) => s.emit({ type: "ANIMAL_NAMED", detail: x }))
      s.emit({ type: "GROVE_SOLVED" })
      s.say("Each creature bows to its true name. Four luminous feathers drift down — and in the pool, something bright: the Prism of First Light.")
    } else {
      s.say(next ? `The tablet reads: “${TABLET_NAMES[next as Exclude<TabletId, null>]}.”` : "You lift the tablet away.")
    }
  },

  cycleWing: (i) => {
    const s = get()
    if (s.gateOpened) return
    if (s.feathers < 4) return s.say("The wing mechanism is empty — it wants a feather it recognizes.")
    const angles = [...s.guardianWingAngles]
    angles[i] = WING_CYCLE[(WING_CYCLE.indexOf(angles[i]) + 1) % WING_CYCLE.length]
    set({ guardianWingAngles: angles })
    s.say(`The wing panel tilts ${angles[i]}.`)
  },
  takePrism: () => {
    /* prism auto-held on grove solve in MVP */
  },
  insertPrism: () => {
    const s = get()
    if (s.gateOpened) return
    if (!s.prismHeld) return s.say("An empty pedestal, cut for something many-sided.")
    if (!s.prismInserted) set({ prismInserted: true })
    const hits = s.guardianWingAngles.filter((a, i) => a === GATE_SOLUTION[i]).length
    for (let i = 0; i < hits; i++) s.emit({ type: "LIGHT_SEAL_HIT", detail: String(i) })
    if (hits === 4) {
      set({ gateOpened: true })
      s.emit({ type: "GATE_OPENED" })
      s.say("The sword completes its circle — four beams, four seals. The fire turns WHITE. The guardians bow their heads, and the gate opens through a wall of mist.")
    } else {
      s.say(`The sword sweeps round. ${hits} of 4 seals answer with light. The wings remember how their creatures stood.`)
    }
  },

  takeFruit: () => {
    const s = get()
    if (s.fruitHeld || s.fruitReturned) return
    set({ fruitHeld: true, fruitTaken: true })
    s.emit({ type: "FRUIT_TAKEN" })
    s.say("The fruit comes away with no resistance at all. Somewhere, a shadow slides along a branch. “Knowledge is already yours...”")
  },
  returnFruit: () => {
    const s = get()
    if (!s.fruitHeld) return
    set({ fruitHeld: false, fruitReturned: true })
    s.emit({ type: "FRUIT_RETURNED" })
    s.say("You set the fruit back on its branch. The tree exhales light. What is guarded must not be taken.")
  },
  takeVessel: () => {
    const s = get()
    if (s.vessel !== "none") return
    set({ vessel: "empty" })
    s.say("A plain clay vessel — Mara's, by the field markings. Empty.")
  },
  fillVessel: () => {
    const s = get()
    if (s.vessel === "none") return s.say("The spring is impossibly clear. You have nothing to carry it in.")
    if (s.vessel === "full") return s.say("The vessel is full.")
    set({ vessel: "full" })
    s.say("The vessel fills from the spring — water so clear it is only visible where it moves.")
  },
  waterSapling: () => {
    const s = get()
    if (s.saplingWatered) return
    if (s.vessel !== "full") return s.say("The sapling is dry to its roots. It needs water, and you have none to give.")
    set({ vessel: "empty", saplingWatered: true })
    s.emit({ type: "SAPLING_WATERED" })
    s.say("You water the dry sapling. New green moves along its stem. What is living must be restored.")
  },
  placeInDepression: () => {
    const s = get()
    if (s.endingUnlocked) return
    if (s.fruitHeld) {
      set({ endingUnlocked: "exile" })
      s.emit({ type: "ENDING", detail: "exile" })
      s.say("The fruit fits the hollow perfectly. The door opens — and the sky goes red. You found Eden. Eden rejected you.")
      return
    }
    if (s.fruitReturned && s.saplingWatered && s.vessel === "empty") {
      set({ endingUnlocked: "restoration" })
      s.emit({ type: "ENDING", detail: "restoration" })
      try {
        const key = "eden-save-v1-victory"
        const rec = JSON.parse(localStorage.getItem(key) || "{}")
        rec.completions = (rec.completions || 0) + 1
        rec.lastFinished = Date.now()
        localStorage.setItem(key, JSON.stringify(rec))
      } catch {
        /* storage unavailable */
      }
      s.say("You place the empty vessel in the hollow. Roots move like slow water, weaving a bridge. Some places are preserved by those willing to leave them.")
      return
    }
    s.say("The hollow waits. Given — restored — not taken... it opens to an empty hand.")
  },
  collectMural: () => {
    const s = get()
    set({ muralFragments: s.muralFragments + 1 })
    const lines = [
      "Mural fragment: “What is given may be received.”",
      "Mural fragment: “What is living must be restored.”",
      "Mural fragment: “What is guarded must not be taken.”",
      "Mural fragment: “The garden opens to an empty hand.”",
    ]
    s.say(lines[Math.min(s.muralFragments, 3)])
  },

  buyHint: (ctx, tier) => {
    const s = get()
    set({
      hintsUsed: { ...s.hintsUsed, [ctx]: Math.max(s.hintsUsed[ctx] || 0, tier + 1) },
      bloomPenalty: s.bloomPenalty + (tier + 1),
    })
  },
}))

// Gus — the Gentle Wanderer. Context-sensitive three-tier ladder (series contract).
export function gusContext(s: EdenState): { ctx: string; hints: [string, string, string] } {
  if (!s.compassRecovered)
    return {
      ctx: "vestibule",
      hints: [
        "The mural is a set of instructions, not a decoration. Reeds bend where breath goes.",
        "Sunrise, then breath: point the floor arrow east, open the eastern shutter, and only then work the bellows.",
        "Turn the medallion until its arrow faces the shuttered wall (east). Open that shutter. Squeeze the bellows into the light.",
      ],
    }
  if (!riversAllSolved(s))
    return {
      ctx: "rivers",
      hints: [
        "Each river tells you what it must touch. The walls are not decoration either.",
        "Turn each channel until its open arm faces that river's marker: the gold vein, beneath the roots, the sunrise stone, the reed basin.",
        "Pishon: arm to the gold. Gihon: arm low, under the roots. Hiddekel: arm east to the sun stone. Euphrates: arm to the reeds.",
      ],
    }
  if (!s.groveSolved)
    return {
      ctx: "grove",
      hints: [
        "Watch us. We each do one thing that is truly ours.",
        "The tail that opens for the sun is crowned. The one who walks the rivers, wanders. The one who flies at the gate carries word. The one dawn finds first, keeps it.",
        "Peacock: Crowned Watcher. The white deer (yes — me): Gentle Wanderer. Dove: Messenger Above. Lion: Keeper of the Dawn.",
      ],
    }
  if (!s.gateOpened)
    return {
      ctx: "gate",
      hints: [
        "The guardians hold their wings the way we held ourselves.",
        "Each wing copies its creature: the fan spread wide, the grazer's head low, the climb of flight, the gaze at sunrise.",
        "Panels in order: outward, lowered, raised, east. Then set the prism and let the sword finish one turn.",
      ],
    }
  return {
    ctx: "tree",
    hints: [
      "Everything this garden taught you, it taught you for here.",
      "You restored what was dry, returned what flowed, named without taking. The hollow is not asking for a prize.",
      "Return the fruit to its branch. Fill the vessel; water the sapling; and place the vessel — empty — into the hollow.",
    ],
  }
}
