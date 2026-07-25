# Escape Room — Visual & Interaction Upgrade Guide

**Purpose.** These documents are the production bible for replacing the current
hand-authored SVG art and CSS-primitive puzzles with higher-quality, professional
imagery and richer interactions — **without breaking the puzzle logic**. Read this
file first; it explains *how* the engine draws a room and therefore *how* an
upgrade can drop in cleanly. Then use the per-game specs, which document every
room's logic, every visible element, every interactive element, and a per-element
replacement plan.

| Game (series slot) | Spec |
|---|---|
| The Pilgrim's Road — medieval (Room I) | [pilgrims-road.md](pilgrims-road.md) |
| Starfall Station — sci-fi, twist (Room II) | [starfall-station.md](starfall-station.md) |
| The Wild Court — jungle, verdict twist (Room III) | [wild-court.md](wild-court.md) |
| The Gate of Life — Rome / Colosseum (Room IV) | [gate-of-life.md](gate-of-life.md) |

Each game is one "escape room" experience made of **seven sub-rooms** (chambers /
decks / trials). Source of truth for all games is `public/<game>/`; `dist/` is the
built copy and should not be hand-edited.

---

## 1. How a room is drawn today (the thing you're upgrading)

Every room is one ES module (`public/<game>/js/rooms/roomN-*.js`) exporting:

- `scene(state)` → **a string of inline SVG** with `viewBox="0 0 1600 900"` and
  `preserveAspectRatio="xMidYMid slice"`. The engine injects it verbatim into
  `#scene` via `innerHTML` ([engine.js](../../public/shared/js/engine.js) `renderScene`).
- `hotspots(state)` → an array of clickable rectangles in **the same 1600×900
  coordinate space**. The engine renders them as `<button>`s in a *separate*
  overlay layer (`#hotspots`), converting each `{x,y,w,h}` to a percentage
  (`renderHotspots`). Their `onInteract(game)` callback drives all game logic.
- `hints`, `intro`, `onEnter`, item registrations, and `openPuzzle(...)` modal
  definitions.

**The single most important fact for this upgrade:** the *visual layer* (the SVG
returned by `scene()`) and the *interaction layer* (`hotspots()` + `openPuzzle()`)
are **already fully decoupled**. Hotspots are not children of the SVG — they float
over it in their own layer, keyed only to the shared 1600×900 grid. That means you
can replace all the art in a room and, as long as each interactive object stays at
its documented coordinates, **you never touch the puzzle code**.

The current `scene()` art is 100% procedural SVG (paths, gradients, CSS-animation
classes like `torch-flame`, `glow`, `moonbeam`, `fog`). The signature look — torch
flames, ember particles drifting up, moonbeams — is cheap and animated, and worth
*keeping as an overlay* even after the backgrounds become photographic.

### The rule you must relax

`docs/ROOM_CONTRACT.md` currently says scenes use **"no external refs, no
`<image>`."** This was a deliberate "zero asset files, everything synthesized"
constraint. It is self-imposed, not a technical limit — the engine simply injects
whatever string `scene()` returns, so `<image href="…">` works today. **The upgrade
is, at its core, the decision to relax that rule** and introduce an asset pipeline.
Update `ROOM_CONTRACT.md` and `docs/BUILD.md` when you do.

---

## 2. Recommended upgrade architecture

Keep the 1600×900 stage and the hotspot/effect layers. Change what fills the stage.
Each room becomes **three stacked layers** instead of one SVG blob:

1. **Background plate** — one high-resolution image of the static environment
   (walls, floor, architecture, fixed furniture), generated at 16:9. Drop it in as
   the first element of the SVG the room returns:
   ```html
   <image href="/assets/<game>/<room>/bg.avif" x="0" y="0" width="1600" height="900"
          preserveAspectRatio="xMidYMid slice"/>
   ```
   or, equivalently, as a CSS `background-image` on `#scene`. Either keeps the
   coordinate math identical.

2. **Prop / state sprites** — separate transparent PNG/WebP cutouts for every
   object that (a) appears or disappears with state, or (b) needs to read as a
   crisp, examinable thing: an item that can be taken, a door that opens, a grate
   that swings, a puzzle mechanism, a sun-mark/token. Render each as its own
   `<image>` positioned at the object's scene coordinates, still gated by the same
   `state.flags` / `state.inventory` checks the current SVG uses:
   ```js
   ${candleHere ? `<image href="/assets/pilgrims/oubliette/candle.png"
        x="410" y="780" width="120" height="90" class="beckon"/>` : ''}
   ```
   This preserves the "scene must visibly change when state changes" contract.

3. **Effect overlay** — keep the existing SVG/CSS light effects (torch glow,
   `glow`, `moonbeam`, `fog`, ember particles from the engine). Layer them last,
   over the plate and sprites. They cost nothing and sell the atmosphere. Optionally
   regenerate them as soft radial-gradient `<image>` glows if you want warmer light.

**Net effect:** `scene(state)` still returns an SVG string; it just composes
`<image>` layers instead of `<path>`s. `hotspots()` and every `openPuzzle()` are
untouched unless you deliberately move an object.

### Coordinate contract for the artist

Every per-game spec lists each object's `{x, y, w, h}` in 1600×900 space. When you
generate art, **compose to that layout** so objects land where the hotspots already
are. The two safe workflows:

- **Layout-locked (preferred, zero code change):** give the image generator the
  existing scene as a compositional reference and keep each object at its
  coordinates. Hotspots keep working as-is.
- **Art-first (freer, small code change):** let the artist compose freely, then
  update each hotspot's `{x,y,w,h}` (and any in-`scene()` sprite coords) to match.
  Mechanically trivial — the numbers live right there in `hotspots()`.

Remember the **Gus reserve zone**: keep the top-left **220×250** scene units free of
anything clickable (Gus the companion docks there). Background art may extend under
it; hotspots may not. Narration always renders in its own bar *below* the scene,
never over the art — so the bottom edge is safe for detail.

---

## 3. Upgrading the interactions (puzzle modals)

Puzzles run in `openPuzzle({ render(body, api) })` modals built from CSS primitives
in `public/shared/css/main.css`: `.dial`, `.tile`, `.lever`, `.puzzle-input`,
`.puzzle-row`, `.puzzle-feedback`. The logic (what counts as solved) lives in the
`render` callback and calls `api.solved()` / `api.fail()`.

To make interactions feel professional, upgrade the *presentation* inside `render()`
while keeping the *check* identical:

- Replace flat `.dial` glyphs with rendered dials/rings that actually rotate
  (CSS `transform: rotate`), with the real numerals/letters as textured labels.
- Replace `.tile` click-to-swap with art tiles (creature glyphs, beast bolts,
  tesserae) that carry the upgraded sprite art, with drag affordance and snap.
- Add sound and motion to the diegetic feedback (`api.fail` already shakes + buzzes;
  `api.solved` already bursts). Web Audio is synth-only today — richer one-shot SFX
  can be added to `public/shared/js/audio.js`.
- Where a puzzle is *in-scene* rather than modal (e.g. Wild Court's ferry, Starfall's
  pipe grid), the same layering applies: swap the SVG mechanism for sprite art and
  keep the flag-driven state machine.

Every per-game spec calls out, per room, which puzzle to lift from CSS-primitive to
custom art, and how — without changing the solution.

---

## 4. Suggested asset pipeline

- **Generator:** the connected Higgsfield / image tools (`generate_image`,
  GPT Image 2 for design/text-legible art, Nano Banana for reference-consistent
  props). For a consistent look across 7 rooms, lock a **style reference** per game
  (see each spec's "art direction" block) and reuse it for every plate and prop.
- **Dimensions:** backgrounds at **2560×1440** (16:9, downscales cleanly to the
  1600×900 stage and stays sharp on large monitors). Props as transparent PNG at
  ~2× their scene box, then exported to WebP/AVIF.
- **Format & perf:** ship **AVIF or WebP**; preload the current room's plate on
  entry; lazy-load the next room's during idle. Budget: keep each room's total image
  payload under ~1.5 MB. This replaces the current zero-download SVG, so add a
  loading state for the first paint.
- **Palette lock:** each game already has a defined palette (in its DESIGN doc and
  `skin.css`). Feed those hex values to the generator so new art matches the HUD,
  Gus's dock, the ember/particle color, and the existing `skin.css` accents.
- **Theming / Gus:** Gus's portrait lives in `public/<game>/js/gus.js` as its own
  SVG and re-themes per game — upgrade it alongside the rooms so the companion
  matches the new fidelity.

---

## 5. Recommended sequencing

1. **Pilot one room end-to-end** — do Pilgrim's Road **Room 1 (The Oubliette)**
   first. It is the tutorial, has the fewest moving parts, and proves the whole
   pipeline (background plate + a few state sprites + kept effects + one modal
   upgrade) before you scale.
2. **Backgrounds before props.** A photographic plate behind the existing SVG props
   already reads as a huge jump; ship that, then replace props room by room.
3. **Go game by game** so each game keeps a consistent style reference. Suggested
   order: Pilgrim's Road → Gate of Life (shares the warm torch-lit palette) →
   Starfall Station (cool, distinct) → Wild Court (greens, most bespoke).
4. **Upgrade the meta-puzzle rooms (Room 7 of each) last** — they reuse the
   collectibles/journal art (suns, shards, tokens, tesserae), so lock that
   collectible art earlier and the finale inherits it.

Per game, the "peak" rooms (marked ★★★★ in each spec) are where richer interaction
pays off most; the tutorial and breather rooms are where a strong background plate
does the most work for the least effort.
