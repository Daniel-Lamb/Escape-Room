# Escape Room — project instructions for Claude

A series of hour-long, browser-native escape rooms. One shared engine, hand-authored
SVG scenes, synthesized Web Audio, zero runtime dependencies. Four games are **LIVE**,
each 7 sub-rooms. Deployed to GitHub Pages (`daniel-lamb.github.io/Escape-Room`) and
Vercel. Repo: `Daniel-Lamb/Escape-Room`.

## Layout & source of truth
- **Games:** `public/<game>/` — `pilgrims-road` (medieval, Room I), `starfall-station`
  (sci-fi + twist, Room II), `wild-court` (jungle + verdict twist, Room III),
  `gate-of-life` (Rome/Colosseum, Room IV). **Edit `public/`, never `dist/`** (`dist/`
  is the built copy).
- **Each game:** `js/rooms/roomN-*.js` (one ES module per sub-room), `js/gus.js` (the
  re-themeable companion), `skin.css`, `index.html`.
- **Shared engine:** `public/shared/js/` (`engine.js`, `state.js`, `items.js`,
  `gus-core.js`, `audio.js`) + `public/shared/css/`.
- **Room dashboard:** `src/` (Astro + TS + Tailwind).
- **Room authoring contract:** [docs/ROOM_CONTRACT.md](docs/ROOM_CONTRACT.md). Design
  docs and walkthroughs per game in [docs/](docs/).

## How a room works (essential)
A room module exports `scene(state)` → an inline SVG string (`viewBox="0 0 1600 900"`,
`preserveAspectRatio="xMidYMid slice"`) and `hotspots(state)` → clickable rectangles in
the **same 1600×900 space**, rendered in a *separate overlay layer* keyed only to those
coordinates. **The visual layer and the interaction layer are fully decoupled** — art
and hotspots share nothing but the coordinate grid. Puzzles run in `openPuzzle(...)`
modals. All game logic flows through the `game` API object passed into callbacks.

## Standing UI rules (series-wide)
- **Gus reserve zone:** keep the top-left **220×250** scene units free of anything
  clickable — Gus (the companion) docks there in every game.
- **Narration** always renders in its own bar **below** the scene, never overlaying the
  art.
- Every torch/candle uses `torch-flame` + `glow`; drifting embers/particles and (jungle)
  canopy light-shafts are the signature ambient overlays.

## ⭐ Active initiative: the visual & interaction upgrade
The owner is replacing the procedural-SVG art and CSS-primitive puzzles with
higher-quality, professional imagery and richer interactions **without changing puzzle
logic**. The full plan lives in **[docs/upgrade/](docs/upgrade/)**:

- [docs/upgrade/README.md](docs/upgrade/README.md) — the architecture + asset pipeline.
  **Read this first.** Key point: because art and hotspots are decoupled, you replace a
  room's art by composing `<image>` layers in `scene()` (background plate + state-driven
  prop sprites) and keeping the existing hotspot coordinates — the puzzle code is
  untouched. This requires **relaxing the current "no `<image>`" rule** in
  `docs/ROOM_CONTRACT.md` (self-imposed, not a technical limit).
- Per-game specs (logic + every visible element + every interactive element with exact
  coordinates + per-element replacement plan):
  [pilgrims-road](docs/upgrade/pilgrims-road.md) ·
  [starfall-station](docs/upgrade/starfall-station.md) ·
  [wild-court](docs/upgrade/wild-court.md) ·
  [gate-of-life](docs/upgrade/gate-of-life.md).
- **Suggested first pilot:** Pilgrim's Road Room 1 (The Oubliette) — proves the full
  pipeline end-to-end before scaling.

When working on the upgrade, consult the relevant per-game spec for the exact
coordinates and per-element target, and keep every puzzle's solution and every hotspot's
`onInteract` logic unchanged unless the owner asks otherwise.
