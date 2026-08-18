# Master Asset List — Escape-Room Art Refinement

The living checklist for turning every room photoreal. Check items off as they're
generated + wired. Rules and pipeline live in [REFINEMENT-PLAN.md](REFINEMENT-PLAN.md);
per-game element coordinates live in the per-game specs
([pilgrims-road](pilgrims-road.md) · [gate-of-life](gate-of-life.md) ·
[starfall-station](starfall-station.md) · [wild-court](wild-court.md)).

## Legend

**Status:** `[x]` done & wired · `[~]` generated, not wired · `[ ]` to do · `♻` reuse existing asset

**Technique** (how the element becomes real art):
- **BG** — background plate (empty environment `<image>`, replaces the scene's bg block)
- **CUT** — photoreal alpha cut-out (generate on plain grey → `remove_background` → trim → alpha WebP)
- **BLEND** — line-art / chalk / drawing (generate white-on-black → WebP → wire with `mix-blend-mode:screen`; do **not** run background-removal on line art, it ghosts thin strokes)
- **MAT+SVG** — photoreal material (parchment, slate, screen bezel) as a cut-out, with load-bearing **text/counts kept as an SVG overlay** on top
- **SVG** — keep as crisp SVG (dynamic readouts, live numerals, anything whose exact value changes with state)
- **R** — reuse an already-generated sprite (e.g. one carved-sun serves all six sun-marks)

**States / phases** = the distinct art a single element needs across its interaction (open/closed, lit/dark, taken/not-taken, dressed/undressed, seated/pried, etc.). Each listed state is its own sprite unless it can reuse another.

**Rules that always apply:** verify load-bearing **counts** by eye and regenerate if wrong; never bake load-bearing **text/numbers** into an image (overlay SVG); run the programmatic overlap check so **no element covers another**; keep hotspot coords + puzzle checks untouched; convert everything to WebP (plate <250 KB, sprite <120 KB); prefix filenames per room (`oub-`, `gr-`, …).

---

## Progress summary

| Game | Backgrounds | Elements | Gus portrait |
|---|---|---|---|
| The Pilgrim's Road | ✅ 8/8 (animated video) | 🔵 3/7 rooms (1–3 fully done) | ☐ |
| The Gate of Life | ✅ 7/7 (animated video) | ☐ | ☐ |
| Starfall Station | ✅ 7/8 (animated video; room 5 Observation kept procedural — its view is a live tilt/attitude mechanic) | ☐ | ☐ |
| The Wild Court | ✅ 7/7 (animated video) | ☐ | ☐ |
| Signal Towers (duo) | ☐ 0/14 | ☐ | ☐ |
| The Looking Glass (duo) | ☐ 0/14 | ☐ | ☐ |
| Silent Alarm (duo) | ☐ 0/14 | ☐ | ☐ |
| Eden (3D) | — separate pipeline — | | |

---

## The plan (how to keep generating)

Work **game by game, room by room**, backgrounds already done first where possible, then elements. Per room, one pass:

1. **Read** the room's `scene()` + the per-game spec row → list its elements and every state each needs.
2. **Batch-generate** that room's elements (`generate_image_batch`, GPT Image 2, 16:9 or aspect-matched, plain grey bg for cut-outs / white-on-black for line art). Verify load-bearing counts by eye; regen if off.
3. **Process:** `remove_background` (cut-outs only) → `sharp` trim + alpha WebP.
4. **Wire** each `<image>` at its hotspot anchor, gated by the same `state.flags` / inventory checks, one sprite per state variant. Keep SVG overlays for live text/numerals.
5. **Verify:** `node --check` → `npm run build` → in-browser (all 200, blend applied, **overlap check = NONE**, 0 console errors, each state renders).
6. **Tick the boxes here**, then move on. Commit per game.

Also per game: upgrade **Gus's portrait** (`js/gus.js`) to match the new fidelity, and generate any **collectible** art once and reuse (sun-marks, shards, tesserae, tokens).

Sequencing: **Pilgrim's Road** (finish 3–7) → **Gate of Life** → **Starfall** → **Wild Court** → **duos** → Eden last (3D, different tooling).

---

## 1 · The Pilgrim's Road  (medieval)

Art dir: cold blue-grey stone, warm torch amber, gold, parchment. Folder `public/pilgrims-road/art/`.

**Backgrounds — ✅ all done + ANIMATED:** all 8 plates are now **looping video backgrounds** (Seedance 2.0 image-to-video from each plate → ffmpeg boomerang seamless loop + compress, 168–439 KB mp4 each). Wired as a `<foreignObject><video autoplay loop muted playsinline poster="…webp">` bg layer (the WebP is the poster fallback). `[x]` oubliette · `[x]` guardroom · `[x]` chapel · `[x]` scriptorium (lit) · `[x]` stillroom · `[x]` greathall · `[x]` gatehouse · `[x]` gatehouse-tunnel. Verified playing in-browser (readyState 4, advancing, props static on top).
**Collectible — `[x]` carved sun `oub-sun.webp`** (♻ reused for all 6 sun-marks, letter overlaid in SVG).

### Room 1 — The Oubliette  ✅ COMPLETE
- `[x]` Drain grate — **states: closed (numerals on top) / open (swung aside)** — CUT + SVG numerals
- `[x]` Candle stub (item, hides when taken) — CUT
- `[x]` Bread board + loaf (item; spoon overlay) — CUT
- `[x]` Gallows mural — **7 crows (count verified)** — BLEND
- `[x]` Rats mural — **4 rats (verified)** — BLEND
- `[x]` Kneeling monk mural — BLEND
- `[x]` Wall chains — **2 shackles (verified)** — CUT
- `[x]` Sun-mark #1 ("R") — R (carved sun) + SVG letter

### Room 2 — The Guard Room  ✅ COMPLETE
- `[x]` Iron crow (item) — CUT
- `[x]` Flint & steel (item) — CUT
- `[x]` Duty roster (5 watches, load-bearing) — MAT+SVG (parchment + text)
- `[x]` Slate tally board (load-bearing count) — MAT+SVG (slate + tallies)
- `[x]` Sun-mark #2 ("A") — R + SVG letter
- `[ ]` Armory cabinet + **5 beast bolts** (boar/stag/wolf/falcon/serpent — each identifiable; **states: bolted / empty-pegs / false-back-open**) — CUT set (also serve the puzzle-modal tiles) — *deferred, puzzle hero*
- `[ ]` Trestle-table clutter (dice, cups, unfinished letter, quill) — CUT/optional flavor
- `[ ]` Carved tabletop words (load-bearing clue) — keep SVG

### Room 3 — The Chapel  ✅ COMPLETE
- `[x]` Stained-glass window — **5 saint panels (Cuthbert 1+crook+sheep, Edmund 2, Agnes 3, Dunstan 4, Brendan 5)** — generated 5 consistent stained-glass panels, clipped into the lancet arches with SVG leading; **AI lily counts are ambiguous so the load-bearing count is an authoritative white SVG lily-marker (1·2·3·4·5) on each panel** — verified 15 total glyphs = 1+2+3+4+5
- `[x]` 5 hand bells on rope pulls (one bell sprite ♻ x5; cast tone-letters C/E/A/D/B kept legible) — CUT + SVG letters
- `[x]` Brass plaque ("SING AS THE LILIES BLOOM") — MAT+SVG (stretched brass + verse overlay)
- `[x]` Bronze reliquary — **states: locked / open** — CUT (2 sprites)
- `[x]` Silver key (item) + holy-oil vial (item) — CUT (revealed inside the open reliquary)
- `[x]` Sun-mark #3 ("U") — R (carved sun) + SVG letter
- `[ ]` Votive candle cluster (flavor) — kept as SVG effect (glow)

### Room 4 — The Scriptorium
- `[~]` Background has **two states: dark (scrim over lit plate — done) / lit**; consider a dedicated dark plate later
- `[ ]` Six tomes with **distinct spine emblems** (comet-and-tower Chronicle must be identifiable) — CUT set
- `[ ]` Cipher strip (`2:4 · 5:1 …`, load-bearing) — MAT+SVG
- `[ ]` Chronicle open page — 8 red-numbered lines + illuminated gold "O" = sun-mark #4 (load-bearing) — MAT+SVG
- `[ ]` Desk sconce — **states: unlit / lit** — CUT + glow
- `[ ]` Edmund's chest + 5 letter dials — **states: closed / open** — CUT + SVG dials
- `[ ]` Items inside: still-room key, torn recipe (right) — CUT

### Room 5 — The Still-Room
- `[ ]` 7 labeled clay jars (**CICUTA must read as the danger jar**) — CUT + SVG labels
- `[ ]` Herbal chart (pictures + glosses, load-bearing) — MAT+SVG
- `[ ]` Copper kettle + stir-dial (clockwise sun-arrow) — **states: cold / lit / brewed** — CUT + SVG
- `[ ]` Bellows — CUT
- `[ ]` Spoon rack (empty 1-notch hook — reuses R1 bent spoon) — CUT
- `[ ]` Hanging meat shank (item) — CUT
- `[ ]` Loose shelf board (hides recipe-left) — **states: in place / removed** — CUT
- `[ ]` Sun-mark #5 ("A", branded on mantel) — R + SVG letter

### Room 6 — The Great Hall
- `[ ]` Wheel of Vayne — 4 concentric heraldic rings + 3 handles — **states rotate per solve** — CUT rings (rotatable) — puzzle hero
- `[ ]` Gallery fresco (tower/raven/key/comet — the arms reference, load-bearing) — CUT/MAT
- `[ ]` Sleeping mastiff — **states: alert / drugged-asleep** — CUT
- `[ ]` Plaque ("NO HAND TURNS ONE WHEEL ALONE") — MAT+SVG
- `[ ]` Crank handle on peg (item) — CUT
- `[ ]` Sun-mark #6 ("R", brass floor inlay) — R + SVG letter
- `[ ]` Twin hearths / tall pre-dawn windows — kept from plate (drop doubled SVG if any)

### Room 7 — The Gatehouse (finale, 2 phases)
- `[ ]` North door + sun relief + **6 letter-dials** (AURORA, load-bearing) — CUT + SVG dials
- `[ ]` Great windlass (main-gate trap) — CUT
- `[ ]` Murder-holes (overhead) — CUT/keep
- `[ ]` Phase 2 tunnel: water-gate winch drum — **states: crank-out / crank-in / pawl-in / cranked (grate lifting ×3)** — CUT + SVG
- `[ ]` Iron crow reused as pawl (♻ R2 crow) — R
- *(no sun here — the 6 collected suns spell AURORA)*

---

## 2 · The Gate of Life  (ancient Rome)  — folder `public/gate-of-life/art/`

Art dir: travertine stone, torch amber, imperial crimson, brass/gold, bone ivory. Collectible: **6 bone tesserae** (emblem + letter) — generate 1 ivory-tessera template, overlay emblem+letter (♻). Note the finale now uses the **Ordo** bolt-bank (recent rework).

### Chamber 1 — The Carcer
- `[ ]` BG: dank Roman cell, barred slit window w/ daylight shaft, iron-strapped oak door, straw, torch
- `[ ]` Letter-lock — **5 vertical sliding tumblers** (ARENA; deliberately not rings) — CUT + SVG letters
- `[ ]` Felix's verse in plaster (ARENA down the margin, load-bearing) — MAT+SVG
- `[ ]` Drain grate — **states: seated / levered ajar** — CUT
- `[ ]` Strigil (item, in straw) — CUT
- `[ ]` Tessera 1 (egg-helm, "S") — R + overlay
- `[ ]` Manacles + small bones (flavor) — CUT

### Chamber 2 — The Armamentarium
- `[ ]` BG: long vaulted armory, racks, whetstone wheel, high mural, torches
- `[ ]` **12 kit pieces** — 4 helms (fish/griffin/egg/visored) · 4 shields (scutum/square/buckler/net) · 4 weapons (gladius/sica/trident/spear) — each identifiable — CUT set (double as puzzle tiles)
- `[ ]` Practice dummy — **states: undressed / correctly dressed** — CUT
- `[ ]` Mural of four brothers (legible clue) — MAT+SVG
- `[ ]` Drill-master's wax tablet — MAT+SVG
- `[ ]` Maintenance locker — **states: closed / open** — CUT
- `[ ]` Dolabra + wool rag (items, from locker) — CUT
- `[ ]` Tessera 2 (spear, "M", in trough) — R + overlay

### Chamber 3 — The Shrine of Nemesis
- `[ ]` BG: torch-lit shrine, Nemesis statue (folded wings), altar, votive shelves, charm doorway
- `[ ]` 2 jugs (stamped V / III) + amphora — CUT + SVG stamps
- `[ ]` Votive lamp — **states: dark / bloomed** — CUT + glow
- `[ ]` Nemesis statue — **wheel at sandal turns on solve** — CUT
- `[ ]` Bronze mirror (item) + votive pile — CUT
- `[ ]` Votive tablets (one crooked hides tessera 3) — CUT
- `[ ]` Sower's charm (S A T O R, load-bearing, feeds R4) — MAT+SVG
- `[ ]` Opened niche + oil flask (item) — CUT
- `[ ]` Tessera 3 (net, "I") — R + overlay

### Chamber 4 — The Lanista's Tablinum
- `[ ]` BG: cramped office, desk w/ wax tablets + abacus, cutaway amphitheatre fresco, scroll shelves, bronze strongroom door
- `[ ]` 5×5 letter frame on strongroom door (fixed TENET row) — CUT + SVG tiles
- `[ ]` Re-waxed desk tablet — **states: blank wax / scraped→AREPO** — MAT+SVG
- `[ ]` Bronze letter tiles (SATOR square, legible) — CUT/SVG
- `[ ]` Fresco (your stolen drawings) — MAT
- `[ ]` Strongroom interior — **states: closed / open** (winch key, ledger, tessera 4) — CUT
- `[ ]` Tessera 4 (griffin, "I") — R + overlay

### Chamber 5 — The Hypogeum
- `[ ]` BG: cage-tunnel lattice under the arena, planking ceiling w/ sand + light-blades, Lion Gate, Gus's cage
- `[ ]` Lion Gate (maze mouth) — CUT
- `[ ]` Felix's chalk plan — **states: smudged / mirror-revealed (legible)** — BLEND + reveal
- `[ ]` Bronze mirror in use — CUT
- `[ ]` Gus's cage + name board "GVSTVS" — MAT+SVG
- `[ ]` Broken capstan + crank handle (item) — CUT
- `[ ]` Overhead lift machinery — CUT
- `[ ]` Tessera 5 (palm, "O", under trough) — R + overlay
- `[ ]` Maze grid (modal) — CUT tiles

### Chamber 6 — The Great Winch
- `[ ]` BG: double-height winch gallery, geared capstan + drum, ropes up into dark, cage-lift, fire-scarred beams, drum shelf + block chest
- `[ ]` Capstan/drum assembly — **states: brake locked / freed / socket empty / crank-seated** — CUT + SVG
- `[ ]` 3 geared drums (II/III/V) — CUT + SVG marks
- `[ ]` 3 pulley blocks (**countable sheaves 1/2/4**, load-bearing) — CUT
- `[ ]` Cage-lift platform — **states: down / raised** — CUT
- `[ ]` Felix's beam note (legible arithmetic) — MAT+SVG
- `[ ]` Tessera 6 (fish-crest, "S", grease pit) — R + overlay

### Chamber 7 — The Porta Sanavivaria (finale)
- `[ ]` BG: torch-dark corridor → huge double Gate of Life, daylight in seams (destination shot)
- `[ ]` Gate — **states: closed / cracked / swung open into daylight** — CUT
- `[ ]` Seized hinge — **states: rusted / oiled-shining** — CUT
- `[ ]` Great bar — **states: rusted in seat / pried upright** — CUT
- `[ ]` Ordo bolt-bank — **6 event-bolts, states: set / thrown** (recent rework — the finale lock) — CUT + SVG
- `[ ]` Procession frieze (6 carved marchers, readable, meta key) — MAT/CUT
- `[ ]` Half-bricked arch — **states: bricked / opened (lamplit alcove)** — CUT
- `[ ]` Felix's remains (bones in apron, folded tools, finished rudis, last tablet — emotional centerpiece) — CUT
- `[ ]` Evidence props (programma placard, clepsydra, ordo-note — load-bearing) — MAT+SVG
- `[ ]` Fallen palm garlands (flavor) — CUT

---

## 3 · Starfall Station  (sci-fi)  — folder `public/starfall-station/art/`

Art dir: cold cyan/steel, warm re-entry orange, deep space. Collectible: **6 memory shards** (hex chip, N wave-peaks + letter) — 1 shard template, overlay peaks+letter (♻).

### Deck 1 — Cryo Bay
- `[ ]` BG: cold cryo bay, open glass pods, emergency strips, viewport w/ planet close
- `[ ]` Your cryopod + **blank nameplate** (foreshadow, keep legible-blank) — CUT + SVG
- `[ ]` 4 coolant gauges — **states: frosted / wiped (A/B/D = 4/7/2, C cracked)** — CUT + SVG
- `[ ]` Manifold plate "A + B = C + D" (load-bearing) — MAT+SVG
- `[ ]` Tool drawer + magnet stylus (item) — CUT
- `[ ]` MC-7 suit sleeve (foreshadow) — CUT + SVG (⚠ left edge near Gus reserve)
- `[ ]` Bulkhead door + keypad — **states: locked / open** — CUT
- `[ ]` Shard 1 (6 peaks, "U") — R + overlay

### Deck 2 — Hydroponics Ring
- `[ ]` BG: curved ring, grow racks (dead brown / blooming green), central valve panel, exit iris
- `[ ]` Pipe tiles (straights/elbows/decoys) — CUT set (rotate 90° CW)
- `[ ]` Grow racks — **states: dead / bloomed (green flow on solve)** — CUT
- `[ ]` Nutrient tank — CUT
- `[ ]` UV grow-lamp (item) — CUT
- `[ ]` Shard 2 (3 peaks, "A") — R + overlay

### Deck 3 — Crew Quarters & Med Bay
- `[ ]` BG: split crew quarters + clinical med bay
- `[ ]` Ibarra's datapad (legible log) — MAT+SVG
- `[ ]` Memorial plaque (AURORA STATION LOST 2085, load-bearing) — MAT+SVG
- `[ ]` Crew-manifest screen (VOSS … DECEASED / NEURAL BACKUP COMPLETE — foreshadow) — MAT+SVG
- `[ ]` Med scale reading 212.4 KG (twist clue) — CUT + SVG
- `[ ]` Folded sixth bunk (foreshadow) — CUT
- `[ ]` Med locker + keypad — **states: locked / open (biogel + keycard)** — CUT
- `[ ]` UV lamp reveal on keypad (prints fluoresce → 2085) — CUT + glow
- `[ ]` Shard 3 (5 peaks, "E") — R + overlay

### Deck 4 — AI Core
- `[ ]` BG: dark AI core, dead server banks, central empty cradle, cyan glows
- `[ ]` Empty cradle + pedestal readout (MIGRATED → CHASSIS 7 — twist, legible) — CUT + SVG
- `[ ]` Breaker panel — **4 switches (states toggle) + DOOR/ALARM indicator lamps** — CUT + SVG
- `[ ]` Etched wall schematic (2 boolean equations, load-bearing) — MAT+SVG
- `[ ]` Fused relay + magnet-stylus interaction — CUT
- `[ ]` Shard 4 (2 peaks, "W") — R + overlay

### Deck 5 — Observation Deck
- `[ ]` BG: dome onto starfield + glowing planet limb, ribs, telescope, consoles — **render at a slight tilt** (rights on solve)
- `[ ]` Attitude ghosts (▲•, •◆◇, ○ glyph strings, load-bearing) — BLEND/SVG
- `[ ]` Calibration card (substitution key, legible) — MAT+SVG
- `[ ]` 3 attitude dials — **spin to PITCH 12 / YAW 284 / ROLL 0** — CUT + SVG
- `[ ]` Telescope + housing — CUT
- `[ ]` Comms console screen (RV-7 vector AZ 117/EL 43, legible) — MAT+SVG
- `[ ]` Whole deck — **states: tilted / upright** (bg swap on solve)
- `[ ]` Shard 5 (4 peaks, "K") — R + overlay

### Deck 6 — Reactor Control
- `[ ]` BG: glowing toroidal reactor, control pit + bus panel, cell rack, servo door
- `[ ]` Reactor torus (pulsing centerpiece) — CUT + glow
- `[ ]` 4 power cells + bus sockets — **states: empty / seated (each bus shows demand)** — CUT + SVG
- `[ ]` Slagged fuse + magnet-stylus — CUT
- `[ ]` Charged capacitor (item, ejected on solve) — CUT
- `[ ]` Shard 6 (7 peaks, "P") — R + overlay

### Deck 7 — Pod Bay → Uplink Array (finale, 2 phases + twist)
- `[ ]` BG ×2: (1) pod bay w/ one prepped escape pod + biometric arch; (2) uplink array open to space, dish, re-entry glow
- `[ ]` Escape pod — **states: prepped / sealed-ejected-empty** — CUT
- `[ ]` Biometric arch — **states: scan cyan / reject red** — CUT + glow
- `[ ]` Dark viewport reflection (MC-7 reveal — the twist) — CUT
- `[ ]` Emitter head — **states: cracked / gel-mended** — CUT
- `[ ]` Charge socket — **states: empty / capacitor-seated** — CUT
- `[ ]` Dish — **states: unaligned / locked (AZ117/EL43)** — CUT
- `[ ]` Uplink console + **cold-start ignition sequence** (recent rework — 6 step-keys) — CUT + SVG
- `[ ]` Cold-start evidence (placard, gimbal caution, Gus comms note — load-bearing) — MAT+SVG
- `[ ]` RV-7 chip of light + burn horizon (flavor) — CUT/effect

---

## 4 · The Wild Court  (jungle tribunal)  — folder `public/wild-court/art/`

Art dir: deep greens, canopy light-shafts, bone/ivory, painted ochre. Collectible: **6 court tokens** (creature + letter) — 1 template, overlay (♻).

### Trial 1 — The Sinkhole Nave
- `[ ]` BG: fern-choked sinkhole in a ruined temple nave
- `[ ]` 3 track traces in mud-brick (must read clearly, load-bearing) — MAT/CUT
- `[ ]` Gate — **3 stone dials cycling carved creature faces** — CUT + SVG
- `[ ]` Machete + survey map (items) — CUT
- `[ ]` Token 1 — R + overlay

### Trial 2 — The Ferry Pool
- `[ ]` BG: flooded gallery, black pool, vine-pulley
- `[ ]` Coracle (positioned along pulley as it crosses; in-scene puzzle) — CUT, multiple positions
- `[ ]` 3 creatures to ferry (predator/prey) — CUT set
- `[ ]` Vine cord (item) — CUT
- `[ ]` Token 2 — R + overlay

### Trial 3 — The Painted Grove
- `[ ]` BG: colonnade of painted trunks, great stone
- `[ ]` **Bark map** (hero) — 5 painted territory grounds (load-bearing) — MAT/CUT
- `[ ]` Ochre pot (item) — CUT
- `[ ]` Token 3 — R + overlay

### Trial 4 — The Totem of Teeth
- `[ ]` BG: tall hall, torn-canopy breach, dais
- `[ ]` 5-drum totem — **each drum rotatable, 5 carved faces (load-bearing food-web)** — CUT + SVG
- `[ ]` Token 4 — R + overlay

### Trial 5 — The Morpho Gallery
- `[ ]` BG: pale apse, vast morpho-butterfly mosaic
- `[ ]` Morpho mosaic — **states: faded / blazing color (lens-reveal)** — CUT + reveal
- `[ ]` Amber lens (item, the reveal tool) — CUT
- `[ ]` Mirror-mosaic symmetry pieces — CUT set
- `[ ]` Token 5 — R + overlay

### Trial 6 — The Tithe Hall
- `[ ]` BG: long hall, great bronze balance scale
- `[ ]` Scale of Truth — **states: snapped / restrung / weighing** — CUT
- `[ ]` 8 tithe weights / offerings (counterfeit-weighing, load-bearing) — CUT set
- `[ ]` Beeswax lump + oath-seal-paste (items/combo) — CUT
- `[ ]` Token 6 — R + overlay

### Trial 7 — The Verdict Roots (finale + twist)
- `[ ]` BG: root amphitheater under open night canopy
- `[ ]` 6 assembled watchers (glinting-eye silhouettes in niches, ordered food-chain = CANOPY) — CUT set
- `[ ]` Verdict Stone + rite tokens (ordered placement) — CUT
- `[ ]` Gus = golden tamarin (advocate) — see Gus portraits

---

## 5 · Duo games  (two-player, 7 scenes × 2 role variants each)

No per-element spec yet — enumerate each from its room files when reached. Baseline per game = **14 background plates** (a West/East or role-A/role-B variant per scene) + the puzzle props per scene + the split collectibles. Coarse checklist for now; expand per scene on arrival.

- **Signal Towers** (`public/signal-towers/`) — maritime, storm night. `[ ]` 14 tower-interior plates (West Kestrel Pt / East Gannet Rock per scene) · `[ ]` per-scene props (tide-lock dials, Fresnel prism panels, signal lamp, half-charts, fog bell, valves, beam-wheel) · `[ ]` 6 brass bearing-marks (template ♻) · `[ ]` Gus = storm petrel.
- **The Looking Glass** (`public/looking-glass/`) — gothic manor mirror. `[ ]` 14 plates (real manor warm / mirror-world reversed cool-silver per scene) · `[ ]` per-scene props (mirror-writing relays, cipher, figures, reversed clock, gallery, tap-pattern, meta) · `[ ]` 6 mirror-shards (template ♻) · `[ ]` Gus = black manor cat.
- **Silent Alarm** (`public/silent-alarm/`) — neon-noir heist. `[ ]` 14 plates (museum-interior for The Hand / green-console van for The Eye per scene) · `[ ]` per-scene props (keypads, laser grid, camera feeds, schematics, breakers, vault) · `[ ]` 6 vault-pins (template ♻) · `[ ]` Gus = museum rat.

---

## 6 · Shared — Gus portraits (per game, in `js/gus.js`)

`[ ]` Pilgrim's Road — (medieval companion) · `[ ]` Gate of Life — old Colosseum lion "Gustus" · `[ ]` Starfall — GS-1 drone · `[ ]` Wild Court — golden tamarin · `[ ]` Signal Towers — storm petrel · `[ ]` Looking Glass — black cat · `[ ]` Silent Alarm — museum rat. Each: one portrait sprite (dock reads at ~64 px), matching the game palette.

## 7 · Eden (3D)

React Three Fiber greybox — **different pipeline** (models/textures, not 2D plates). Out of scope for this 2D-sprite pass; handle separately if/when the greybox graduates to a real art pass.

---

### Reusable-template shortcuts (generate once, overlay per instance)
- **Sun-marks ×6** → 1 carved sun (`oub-sun.webp`, ✅) + SVG letter
- **Bone tesserae ×6** → 1 ivory tessera + emblem/letter overlay
- **Memory shards ×6** → 1 hex chip + peaks/letter overlay
- **Court tokens ×6 / bearing-marks / mirror-shards / vault-pins** → 1 template each + overlay

This cuts the collectible workload from ~36 generations to ~5 templates.
