# Escape-Room Art Refinement — Plan & Rules

The program for turning every room from procedural SVG into professional, photoreal
imagery **without changing any puzzle logic**. This extends
[README.md](README.md) (the architecture) and the per-game specs with a concrete
rule-set and a repeatable per-room process. Read the README first for *how* a room
is drawn; this file is *how we refine one*.

## Goal

For **each escape room (each game)**: replace flat procedural art with realistic,
high-quality images — a photoreal **background plate**, photoreal **interactive
elements** (the things you click, take, and solve), upgraded **puzzle-modal chrome**,
and kept **ambient effects** — shipped in a **web-optimized format** that loads fast.
Puzzle solutions, hotspot coordinates, and state machines stay byte-for-byte identical
unless the owner asks otherwise.

## The layer model (per scene)

Every `scene(state)` returns the same 1600×900 SVG, now composed of stacked layers:

1. **Background plate** — one photoreal `<image>` of the empty environment (walls,
   floor, architecture, fixed structure). Replaces the scene's procedural background
   block only.
2. **Interactive / state sprites** — a photoreal transparent-PNG→WebP cutout for each
   object that (a) changes with state, (b) can be taken/used, or (c) is a puzzle
   mechanism or collectible. Positioned at the object's existing `{x,y,w,h}`, gated by
   the same `state.flags` / `state.inventory` checks.
3. **Ambient effects** — the existing `torch-flame`, `glow`, `moonbeam`, `fog`, ember
   particles, kept as animated overlays on top. They cost nothing and sell the mood.

Hotspots (`hotspots()`) and every `openPuzzle()` check are untouched.

---

## RULES

**R1 — Format & performance.** All generated art ships as **WebP** (quality ~85 via
`sharp`; the project already depends on it). Convert every PNG the generator returns,
delete the PNG, reference the `.webp`. Targets: **background plate < ~250 KB**, prop
sprite **< ~120 KB**, **whole room < ~600 KB**. (Reference: Pilgrim's Road plates came
in at 57–124 KB each; the entire game's backgrounds total 768 KB.) Store under
`public/<game>/art/`; reference with a **repo-relative** `href` (`art/<name>.webp`) so
it resolves under both the Pages `/Escape-Room/` base and the Vercel root.

**R2 — Backgrounds.** Generate an **empty** environment: no people, no text/letters/
numbers, and keep the zones where load-bearing props sit **plain and dark** so overlays
stay legible. Compose to the spec's anchors (light source, furniture) so the kept props
land in the right place. In code, replace **only** the procedural background block (the
full-frame wall/floor rects and their texture groups); keep every prop, document,
puzzle element, and effect. If a painted fixture conflicts with a load-bearing SVG prop
(e.g. a painted window under the chapel's stained glass), **regenerate the plate with
that fixture removed** rather than fight the overlap.

**R3 — Interactive elements (photoreal).** For each interactive/collectible/puzzle
object, generate a **photoreal transparent sprite** and render it as its own `<image>`
at the object's anchor, gated by the same flag/inventory logic. Priority order:
items you take → doors/grates/mechanisms that change state → puzzle pieces (tiles,
bolts, dials, tokens) → collectibles (suns/shards/tesserae). **Load-bearing detail must
stay unambiguous** — countable things keep their exact count; labeled things keep
legible labels; a "danger" object still reads as danger.

**R4 — Puzzle-modal chrome.** Upgrade the *presentation* inside `openPuzzle(render)` —
flat `.dial`/`.tile`/`.ring` become rendered art (real rotating dials, engraved bolts,
sprite tiles) — while the **solved/fail check stays identical**. Reuse the same sprite
art as the in-scene props.

**R5 — Effects & light.** Keep `torch-flame`/`glow`/`moonbeam`/`fog`/embers as animated
overlays. **Drop the flat drawn fixture body** (torch bracket, brazier bowl) that the
plate now paints, but **keep its glow** radial for animated warmth. Never leave a flat
vector fixture sitting on top of a photoreal one.

**R6 — Reserve zone.** Keep the top-left **220×250** free of hotspots (Gus docks
there). Background art may extend under it; nothing clickable may.

**R7 — Verification (per room).** `node --check` the module → `npm run build` clean →
in-browser: plate returns **200**, every hotspot still present, **0 console errors**,
and each state variant renders (open/closed, lit/dark, taken/not). Screenshots aren't
available in this headless env, so verify structurally + serve the raw plate for a human
eye at each game's checkpoint.

**R8 — Style lock (per game).** Fix one art-direction prompt suffix per game (palette +
mood, from its DESIGN doc / `skin.css`) and reuse it for **every** plate and sprite so
the seven rooms read as one world. Generator: **GPT Image 2** (`gpt_image_2`) is the
current reliable path — 16:9, ~2 credits/image, fast; `nano_banana_pro` is higher-end
but was queue-wedged. Upgrade **Gus's portrait** (`js/gus.js`) to match each game too.

**R9 — Pilot then scale.** Prove the pipeline on one room per game (background + one
interactive sprite + one modal) before generating the rest, and pause for a human style
check at each game boundary. Commit per game.

---

## Per-room process (the loop)

For each room in a game:

1. Read the room's `scene()`; identify the background block and the interactive props +
   their anchors (the per-game spec lists them).
2. Generate the **background plate** (R2) → convert to WebP (R1) → replace the
   background block with the `<image>`; trim redundant flat fixtures, keep glows (R5).
3. Generate **interactive-element sprites** (R3) → WebP → render each at its anchor,
   gated by existing state; handle multi-state props (open/closed, lit/dark).
4. Upgrade the **puzzle modal** chrome if it's a peak room (R4).
5. **Verify** (R7). Fix or regenerate anything that conflicts.

Then, per game: upgrade Gus's portrait, run a full build, spot-check in-browser, commit.

## Sequencing across games

1. **The Pilgrim's Road** — backgrounds DONE (7 rooms + tunnel, WebP). Interactive
   sprites + modal chrome next.
2. **The Gate of Life** — shares the warm torch-lit palette.
3. **Starfall Station** — cool sci-fi, distinct palette.
4. **The Wild Court** — greens, most bespoke.
5. **Duo games** (Signal Towers, Looking Glass, Silent Alarm) — two role-variant scenes
   each.

Backgrounds-first within each game (biggest jump for least effort), then interactive
elements, then the peak-room modal chrome.

## Status

| Game | Backgrounds | Interactive sprites | Modal chrome | Gus portrait |
|---|---|---|---|---|
| Pilgrim's Road | ✅ 7 rooms + tunnel (WebP, verified) | ⏳ next | ⏳ | ⏳ |
| Gate of Life | ⏳ | ⏳ | ⏳ | ⏳ |
| Starfall Station | ⏳ | ⏳ | ⏳ | ⏳ |
| Wild Court | ⏳ | ⏳ | ⏳ | ⏳ |
| Duo games (×3) | ⏳ | ⏳ | ⏳ | ⏳ |

## Asset pipeline (mechanics)

- Generate: `generate_image` / `generate_image_batch` (GPT Image 2, 16:9). Backgrounds
  prompt "empty … no text no people"; sprites prompt "single object, transparent/plain
  background, centered".
- Convert: `sharp(input).webp({quality:85}).toFile(out)`; delete the PNG.
- Wire: edit the room module's `scene()` per R2/R3/R5; never touch `hotspots()` coords or
  `openPuzzle()` checks.
- Relaxed contract: `ROOM_CONTRACT.md` now permits `<image>` layers (done).
