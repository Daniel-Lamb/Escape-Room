# The Build — How *The Pilgrim's Road* Was Made

This document explains two kinds of progression: how the **game was built** (architecture
and process), and how the **player progresses** through it (difficulty, items, and clues).
Read [DESIGN.md](DESIGN.md) for the full puzzle specs and [ROOM_CONTRACT.md](ROOM_CONTRACT.md)
to author a new room.

---

## Part 1 — The build process

### Phase 0: Design by competition

The design started as a multi-agent panel: three designers were briefed with the same hard
constraints (7 rooms, ~60 minutes, medieval castle, strictly-fair puzzles, vanilla JS + SVG,
no assets) but different priorities — narrative-first, puzzle-first, and motion/UX-first —
with judges scoring the results. The **puzzle-first design won by default and on merit**:
"The Pilgrim's Road," escape Vayne Keep by following Brother Edmund's trail of carved suns.
Its distinguishing feature is that every puzzle ships with a written **deduction chain** —
a proof that the solution follows from in-scene clues alone. That document became
[DESIGN.md](DESIGN.md), and the deduction chains became the implementation checklist.

### Phase 1: A design-agnostic engine

Everything that isn't a puzzle lives in a small engine (`js/engine.js` + support modules)
that knows nothing about castles:

| Module | Responsibility |
|---|---|
| `engine.js` | scene/hotspot rendering, typewriter narration, modals, inventory, journal, timer, transitions, end states |
| `state.js` | one JSON blob of all progress; autosave to localStorage |
| `items.js` | item registry + combination recipes (rooms register their own) |
| `audio.js` | WebAudio synth — sfx, pitched bells, wind + drip ambience; zero audio files |
| `gus.js` | the companion (see Phase 2) |
| `main.js` | title screen, save detection, run lifecycle |

Rooms are plug-ins: each `js/rooms/roomN-*.js` default-exports `{id, title, intro, scene(),
hotspots(), hints}` and talks to the game only through the documented `game` API. The scene
is a 1600×900 SVG string re-rendered from state; hotspots are invisible buttons positioned
in scene coordinates. This contract is what makes the **series** possible — a new escape
room is new room modules and a re-themed Gus, not a new engine.

The animation system is a CSS class library (`css/animations.css`): `torch-flame`, `glow`,
`moonbeam`, `fog`, `sway`, `spin`, `shimmer`, `beckon`. Room authors decorate SVG elements
with these classes and the theme stays visually consistent for free.

### Phase 2: Gus, the permanent companion

The hint system is a character, not a button. Gus floats in the corner of every scene;
clicking him opens a dialog with his portrait, a line of banter, and the current room's
**hint ladder**:

1. **A nudge** (−1:00) — points at the right objects, never the method
2. **The method** (−2:00) — the how, not the values
3. **The answer** (−4:00) — the exact solution, spelled out

Tiers unlock in order, cost time off the dawn clock, and stay re-readable free once paid.
Rooms with two puzzle phases expose context-dependent ladders (`hintContext(state)`), so
Gus always talks about the thing you're actually stuck on.

**The franchise rule:** Gus appears in every room of every future escape room in this
series. Only his *form* changes with the theme — here he is Sir Gus, ghost of a Vayne Keep
knight; an animal-kingdom room gets Gus the monkey; a space room gets Gus the droid. His
entire identity — name, epithet, form, portrait SVG, voice lines — lives in `js/gus.js`
behind one interface. Re-theming Gus is editing one file; the tier mechanics never change.

### Phase 3: The seven rooms

Rooms were implemented in order against DESIGN.md, each one exercising a different engine
capability so problems surfaced early: Room 1 proved pickups/dials/transitions, Room 2
proved item-on-hotspot use and combinations, Room 3 proved in-scene interactive elements
with live audio (real bell tones), Room 4 proved state-gated scenes (darkness), Room 5
proved multi-stage puzzle UIs, Room 6 proved persistent mechanical state with animated SVG,
and Room 7 proved the journal-driven meta-puzzle and the two-phase room pattern.

### Phase 4: Fairness gates

Fairness rules from the design were enforced in code, not left to hope:

- **No missable clues:** each room's exit is gated on journaling that room's sun-mark
  (Edmund nags you diegetically if you try to leave without it), so the finale is always
  solvable from the journal.
- **No missable items:** exits also gate on the items later rooms require (candle and
  spoon in Room 1, fire-kit in Room 2, reliquary contents in Room 3).
- **No lockouts:** wrong answers reset the attempt with a diegetic clunk/hiss/discord and
  never cost time; Room 6's gear system preserves an invariant that keeps every reachable
  state solvable.
- **Everything re-readable:** every examined document is copied verbatim into the journal.

### Phase 5: Verified by playing it

The finished game was play-tested end-to-end in a real browser with scripted interactions:
every pickup, every combination, every puzzle solved via its intended solution, through to
the victory screen — plus the failure paths (wrong answers shake and reset, hint purchases
charge the timer, save/continue restores mid-run). The playthrough caught one real bug
(the narration card could sit over hotspots and swallow clicks; it now auto-dismisses
after typing finishes) which was fixed and re-verified.

### Phase 6: Ship

Zero-dependency static site → GitHub Pages. No build step means the repo *is* the game.

---

## Part 2 — The player's progression

### Difficulty curve

| # | Room | Mechanic | Difficulty | ~Minutes |
|---|------|----------|------------|----------|
| I | The Oubliette | counting → combination | ★☆☆☆☆ tutorial | 5 |
| II | The Guard Room | constraint logic / ordering | ★★☆☆☆ | 7 |
| III | The Chapel | musical sequence | ★★★☆☆ | 8 |
| IV | The Scriptorium | book cipher | ★★★★☆ **peak 1** | 10 |
| V | The Still-Room | recipe / mixing | ★★★☆☆ breather-with-teeth | 9 |
| VI | The Great Hall | coupled-gear spatial | ★★★★☆ **peak 2** | 9 |
| VII | The Gatehouse | meta-synthesis + mechanical | ★★★☆☆ earned victory lap | 10 |

The shape is deliberate: a gentle on-ramp that teaches examine/journal/inventory in one
forced loop, twin peaks at IV and VI separated by the more procedural Still-Room, and a
finale that *feels* easy precisely because the journal did the collecting all along —
the last "aha" (the suns spell **AURORA**, the dawn you're racing) lands on theme, not grind.

### The item chain

Nothing in your satchel is decoration; everything is picked up rooms before it pays off:

```
R1 candle stub ──┐
R2 flint & steel ─┴→ lit candle ──────────────→ R4 (reading light)
R1 bent spoon (1 notch) ──────────────────────→ R5 (the missing measure)
R2 iron crow ──→ R2 (pry panel) ──────────────→ R7 (winch pawl)
R3 silver key ──→ R3 exit          R3 holy oil → R6 (rusted gears)
R4 still-room key → R5 entry
R4 recipe (right) ─┐
R5 recipe (left) ──┴→ full recipe → sleeping draught ─┐
R5 meat shank ────────────────────────────────────────┴→ drugged meat → R6 (mastiff)
R6 crank handle ──────────────────────────────────────→ R7 (water-gate winch)
R4 Edmund's confession ───────────────────────────────→ carried to the ending (story)
```

The bent spoon is the signature move: it *looks* like junk in Room 1 and turns out to be
the only legal way to measure "one" in Room 5 — an anti-red-herring payoff.

### The clue chain (the six suns)

Each room hides one carved sun **on or beside a mandatory puzzle object**, auto-sketched
into the journal with its ray count and letter:

| Found in | Rays | Letter |
|---|---|---|
| I — beside the drain grate | 7 | R |
| II — above the bolt rack | 3 | A |
| III — the crypt-stair arch | 4 | U |
| IV — the Chronicle's illuminated O | 6 | O |
| V — branded on the hearth mantel | 8 | A |
| VI — brass in the floor | 5 | R |

In room order they read R-A-U-O-A-R — meaningless, so memory alone can't shortcut the
finale. The gate plaque supplies the rule ("THE FEWEST RAYS SPEAK FIRST"), the ray counts
3–8 are all distinct so the sort is unique, and the answer is **AURORA**.

### The story beats

- **Setup (R1):** condemned at dawn; Edmund's verse teaches the game's one command —
  *mark each sun along the road.*
- **Midpoint (R4):** Edmund's confession reframes the escape — he smuggled the condemned
  out along this road and died imprisoned for it. You are finishing his work.
- **Ending (R7):** the word that opens the last door is the dawn itself; you carry his
  confession out. The thing meant to kill you sets you free.
