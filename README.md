# The Pilgrim's Road 🏰

**An hour-long medieval castle escape room that runs entirely in your browser.**

You are Aldric of Marden, a journeyman cartographer arrested for "spying" on the walls
of Vayne Keep. At dawn they hang you. But forty years ago another prisoner — Brother
Edmund — found a way out, and he left a trail of carved suns for whoever followed.

**Seven chambers. One hour. Mark each sun along the road.**

## Play

Static site, zero dependencies, zero build step:

```bash
python -m http.server 4173
# then open http://localhost:4173
```

or just enable GitHub Pages on this repo and play at the published URL.

## The game

- **7 phases** through the castle: the Oubliette → the Guard Room → the Chapel →
  the Scriptorium → the Still-Room → the Great Hall → the Gatehouse.
- **7 distinct puzzle mechanics**: observation-combination, constraint logic, musical
  sequence, book cipher, recipe mixing, coupled-gear mechanics, and a final
  meta-puzzle assembled from clues you journaled across all six earlier rooms.
- **Difficult but strictly fair**: every solution is derivable from in-game clues
  alone. No outside knowledge, no guessing, no pixel-hunting. Wrong answers never
  cost time — they just clunk, hiss, or ring flat.
- **60-minute countdown** to dawn. Only hints cost time.
- **Sir Gus**, your companion: the ghost of a Vayne Keep knight who haunts the corner
  of every scene. Three whispers per chamber — *a nudge* (−1:00), *the method*
  (−2:00), *the answer* (−4:00). Paid whispers stay re-readable free. Gus returns in
  every escape room in this series; only his form changes with the theme
  (see `js/gus.js` — swap the portrait, form, and voice lines; his name is always Gus).
- **The Pilgrim's Journal** auto-copies every verse, roster, recipe, and carved sun
  you examine — you will want it at the end.
- **Modern, sleek presentation**: hand-authored layered SVG scenes, flickering
  torchlight, drifting embers, spring-eased modals, typewriter narration, item
  fly-to-satchel animation — and every sound (bells, locks, wind, drips) synthesized
  live with WebAudio. Zero asset files.
- **Autosaves** to localStorage; close the tab and the castle waits. If dawn catches
  you, "Rise again" retries the current chamber with your progress intact.

## Repo layout

```
index.html            shell: title screen, HUD, stage, satchel
css/main.css          layout, UI, puzzle primitives (dials, tiles, levers, parchment)
css/animations.css    the animation library (torch-flame, glow, fog, sway, ...)
js/engine.js          scene/hotspot renderer, timer, inventory, journal, modals
js/gus.js             Gus the companion — re-theme him here for future rooms
js/audio.js           WebAudio synth: sfx, bells, wind + drip ambience
js/state.js           one-blob game state + localStorage persistence
js/items.js           item + combination registries
js/rooms/room*.js     the seven chambers (scene SVG, hotspots, puzzle, hints)
docs/DESIGN.md        full design document (story, puzzles, deduction chains)
docs/WALKTHROUGH.md   ⚠ complete spoilers — every solution
docs/ROOM_CONTRACT.md how to author a new room against the engine
```

## Spoiler policy

Stuck? Ask Gus — that's what he's for, and tier 3 literally tells you the answer.
If you must, [docs/WALKTHROUGH.md](docs/WALKTHROUGH.md) contains every solution.

---

Built with Claude Code. The design document was produced by a multi-agent
design panel; the engine, art, and rooms were then implemented and
play-tested end-to-end in the browser.
