# EDEN: The Four Rivers — design & implementation plan

Room V of the series: a cinematic **3D** escape room (React Three Fiber) about finding
the Garden of Eden. The player follows archaeologist Dr. Mara Veyne's research to the
eastern boundary of Eden; the way in collapses; the only way out is to **restore** the
garden — four rivers, the creatures' names, the angelic gate — and pass a final moral
test: *prove you understand preservation rather than possession.*

The user's full specification (premise, pillars, spatial layout, puzzle graph, all
puzzle specs, endings, layered environmental system, asset inventory, audio plan,
Higgsfield pipeline + prompt pack, browser implementation notes, performance strategy,
hint tiers, production roadmap, MVP cut) is canonical. This doc records the **series
reconciliation**, the **MVP scope actually being built**, and the **implementation
contract** (state machine + events).

---

## Deviations from the series house rules (explicit, user-driven)

| House rule | Status in EDEN |
|---|---|
| Zero deps, no build step, hand-authored SVG | **Waived for this room.** EDEN is 3D: React Three Fiber + drei + zustand, living at `/eden/` inside the Astro app. The four SVG games are untouched. |
| Gus is the persistent hint companion | **Kept — re-themed.** See below. The doc's firefly/journal/compass hint tiers become Gus's three-tier ladder. |
| Gus docks top-left | Adapted: 3D room, so Gus is a *creature in the world* (as in Wild Court / Gate of Life) plus a top-left HUD dock for summoning him. |
| Narration in the bottom bar | Kept: subtitles/narration render in a bottom DOM strip over the canvas, never floating mid-scene. |
| Hint tiers (−1:00/−2:00/−4:00) | EDEN's stated design has no countdown clock (50–70 min untimed). Tiers instead cost **"bloom"** — the garden dims slightly per paid hint (cosmetic penalty, tracked for the ending stinger). Tier ladder and re-readability unchanged. |

## Gus in Eden

- **Form:** the **white deer** — *"Gus, the Gentle Wanderer."*
- He is one of the four creatures of the Naming Grove (precedent: tamarin-Gus is part of
  Wild Court's food chain; lion-Gus sits outside the carcer). His pedestal naming is part
  of the grove puzzle.
- **Behavior as hint machinery:** Tier 1 (nudge) — Gus walks toward the relevant
  mechanism and looks back. Tier 2 (method) — he leads you along the path the solution
  takes (the doc's "compass ghost animation" becomes Gus pacing it out). Tier 3 (answer)
  — he performs/marks the exact interaction. The doc's ambient tier-1 cues (fireflies
  gathering, carvings glowing) stay as free attention cues *below* the ladder.
- **Sample lines:** greeting *"You walk like someone who lost something. Everyone here
  did, once."* · nudge label *"A glance"* · method *"The way of it"* · answer *"The
  whole path"* · buyLabel *"Follow me"*.

---

## MVP scope (this build — the doc's §18 cut, compressed)

Greybox first (doc §17 Phase 1–2): primitive geometry, flat colors, full puzzle chain,
no final art. ~25 minutes of play.

**Scenes:** Exile Vestibule → River Rotunda (hub) → Naming Grove → Angelic Gate →
Inner Eden (Tree of Choice). *Living Sanctuary, secret seeds / Gardener ending, and the
per-branch river biomes are deferred* (per the doc's own MVP).

**Puzzle chain (MVP):**
1. **Breath Into Dust** (tutorial): rotate the floor medallion to EAST, open the eastern
   shutter, work the bellows → dust reveals the four-rivers map → **Eden Compass**.
2. **The Four Rivers** (combined MVP form): each of the four channels has a 4-way
   rotation; the correct orientation is readable from that river's symbol wall
   (Pishon/gold, Gihon/roots-below, Hiddekel/sunrise-east, Euphrates/reeds). All four
   correct → fountain erupts, seals rise, Grove opens. Wrong branch resets only itself.
3. **The Grove of Names**: four creatures (peacock, **white deer = Gus**, dove, lion)
   each display one observable behavior; place the right tablet (Crowned Watcher /
   Gentle Wanderer / Messenger Above / Keeper of the Dawn) on each pedestal → four
   luminous **feathers**.
4. **The Angelic Gate**: slot the four feathers, set each guardian wing panel to the
   angle encoded by that animal's behavior (peacock=outward, deer=lowered, dove=raised,
   lion=east), insert the **Prism** (MVP: found in the Grove pool), watch one sword
   rotation — all four seals lit → gate opens.
5. **The Tree of Choice**: the fruit can be taken (**Exile ending** — garden petrifies)
   or returned + fill the vessel + water the sapling + place the **empty** vessel
   (**Restoration ending**). Mural fragments collected en route spell the rule:
   *"The garden opens to an empty hand."*

**Endings in MVP:** Exile + Restoration. (Gardener ending = post-MVP.)

## Implementation contract

- **Stack:** Astro page `src/pages/eden.astro` → React island `src/components/eden/`
  (`client:only`). deps: `three`, `@react-three/fiber`, `@react-three/drei`, `zustand`.
- **Interaction:** WASD + pointer-lock look, raycast click on interactables (hover
  outline), bottom narration strip, inventory chips, Gus dock top-left.
- **State (zustand, doc §14 names):** `introComplete, compassRecovered,
  riverPishonSolved, riverGihonSolved, riverHiddekelSolved, riverEuphratesSolved,
  animalPeacockNamed, animalDeerNamed, animalDoveNamed, animalLionNamed,
  guardianWingAngles[4], prismInserted, gateOpened, fruitTaken, fruitReturned,
  saplingWatered, endingUnlocked` (+ `hintsUsed`, `bloomPenalty`).
- **Events:** `RIVER_SOLVED, ANIMAL_NAMED, LIGHT_SEAL_HIT, GATE_OPENED, FRUIT_RETURNED,
  SAPLING_WATERED, ENDING` — cinematic/audio reactions subscribe to these; puzzle
  validation never depends on visuals.
- **Save:** localStorage `eden-save-v1` (same dashboard victory-record contract:
  `eden-save-v1-victory`).

## Higgsfield pipeline (doc §11–13)

Higgsfield generates **style frames, looping background plates, and cinematics — never
collision geometry**. Every generation uses the doc's §12 global style lock verbatim.
Starter batch for review (user-approved in-session): **A. River Rotunda hero frame**
(the art bible anchor) and **C. background waterfall loop** (first 2.5D plate).
Remaining prompt pack (B, D–I) generates after greybox cameras are locked, per §17
Phase 5. Plates land in `public/eden/plates/`.

## Dashboard integration

One object in `src/data/rooms.ts` (mode `single`, art `eden`, chip "3D · greybox"),
plus a hand-authored `src/svg/eden.svg` card art (garden gate through leaves, in the
series' card style).
