# The Wild Court — Trial-by-Trial Upgrade Spec

Jungle-temple escape (series Room III). You are **Marlowe Reyes**, a survey cartographer
who fell through a sinkhole into a lost temple where the animals hold court. Seven trials
until the canopy door, before nightfall (60 min). Source: `public/wild-court/`. Full
logic: [../DESIGN-WILDCOURT.md](../DESIGN-WILDCOURT.md); solutions:
[../WALKTHROUGH-WILDCOURT.md](../WALKTHROUGH-WILDCOURT.md).

**The twist (Trial 7).** The sinkhole was a **summons** — the Court tried you, and every
trial was testimony. Gus (your golden-tamarin advocate) told you his job in his first
breath; the reveal adds the stakes: the valley lives only while it stays off the map, so
the verdict costs your survey — redrawn into worthless swamp, sealed, and sworn.

**Meta thread.** Six **court tokens** (a creature face + a letter), journaled across
Trials 1–6. The order is **not** a count-sort — it's cross-trial: the T4 food-chain
(harpy, ocelot, boa, tree-frog, mantis) orders five tokens, and the tamarin (Gus) speaks
last → **C-A-N-O-P-Y**. The Speaking Stone asks for "the word that shelters every clan":
**CANOPY**.

### Art direction (lock once, reuse for all 7 trials)
Root-swallowed jungle temple, understory dusk. Palette: understory greens `#0e1c12`/
`#16281a`/`#223a26`, deep shadow `#070d08`, bark `#4a3626`/`#6b4f37`, old stone `#3f4a3c`/
`#2e3a2c`, firefly warm `#ffe08a`/`#d1a53f`, moon-through-canopy `#9fd4a8`, orchid accent
`#c96fb0`. **Signature look (replaces torches):** every scene gets at least one slanting
**canopy light-shaft** (`moonbeam`), **2–3 drifting firefly motes**, ground fog, swaying
fronds. Light-reveal via carried item is a franchise signature (here: the **amber lens**).

### Item chain (unchanged)
machete (T1) → T4 cut strangler vines · survey map (T1, story) → T7 · vine cord (T2) →
T6 restring the Scale · ochre pot (T3) + beeswax (T5) → **oath-seal paste** → T7 seal ·
amber lens (T4) → T5 reveal faded wing · Vance's compass (T6) → T7 straightedge · hollow
pod (T6) → T7 present the lie.

---

## Trial 1 — The Sinkhole Nave
**Tutorial · negative-evidence track reading · ~5 min · [room1-sinkhole.js](../../public/wild-court/js/rooms/room1-sinkhole.js)**

### Logic
A root-gate with three sockets, each beside an ancient trace: left = 4-toed pug mark, no
claw tips; middle = 3 broad round toes; right = **a smooth drag-line, no print at all**.
Your own field-guide page (in the mud) keys them: sheathed claws + 4 toes = **JAGUAR**;
3 round toes = **TAPIR**; no footprint = **BOA** (the answer from absence). Decoys HARPY
and MONKEY explicitly eliminated. Solution: **JAGUAR · TAPIR · BOA**.

### Visible elements
| Element | Anchor | Notes |
|---|---|---|
| Coin of sky, far above | 600,20 440×90 | evening light |
| Great light-shaft down the nave | center | `moonbeam` |
| Roots pouring down walls, hanging ferns | walls | `sway` |
| Rim blazes (grown-over cuts) | 1130,140 170×140 | foreshadow (bark closed) |
| Harpy talon-scar | 200,410 130×150 | flavor foreshadow of T4 apex |
| Fallen satchel + survey map | 296,720 160×100 | item |
| Half-buried machete (glint in mud) | 950,700 200×140 | item |
| Root-gate + 3 trace-sockets | 1290,300 270×400 | closed/open; **token 1** in lintel (1400,250) |
| Torn field-guide page (in mud) | 590,760 120×90 | the puzzle key |
| Compass (needle spinning) | 470,600 120×110 | foreshadow |
| Fireflies + ground fog | overlay | signature |

### Interactive elements
**Hotspots:** `fieldguide` 590,760,120,90 (key) · `machete` 950,700,200,140 (item) ·
`satchel` 296,720,160,100 (map) → `satchel_empty` · `compass` 470,600,120,110
(foreshadow) · `blazes` 1130,140,170,140 (foreshadow) · `talon` 200,410,130,150 (flavor)
· `sky` 600,20,440,90 (flavor) · `gate` 1290,300,270,400 (→ puzzle) → `gate_open` (exit)
· `token1` 1400,250,64,60 (collectible: BOA "N").
**Items:** Bone-Handled Machete, Your Survey Map.
**Puzzle "The Gate of Passage":** three `.dial` columns (each captioned by its trace)
cycling JAGUAR/TAPIR/HARPY/BOA/MONKEY → JAGUAR/TAPIR/BOA.

### Upgrade plan
- **Background plate:** the bottom of a fern-choked sinkhole inside a ruined temple nave —
  a ragged coin of evening sky far overhead, roots pouring down the walls like frozen
  waterfalls, a great slanting light-shaft, mud floor.
- **Prop sprites:** the three preserved **track traces** in mud-brick (must read clearly:
  4-toed pug mark, clover tapir print, smooth drag-line/no-print); the root-gate with
  three glyph sockets; token 1 (carved wood disc, boa face, "N") in the lintel; the
  field-guide page (legible key); machete glinting; fallen satchel; the spinning compass;
  the harpy talon-scar (foreshadow).
- **Interaction upgrade:** the gate as three stone dials that cycle carved creature
  glyphs, each socket paired to its trace; grinding open on the correct triad. The
  "absence" answer (drag-line = boa) is the teaching moment — make the empty trace read
  as deliberately blank, not missing art.

---

## Trial 2 — The Ferry Pool
**★★ · river-crossing logic · ~7 min · [room2-ferrypool.js](../../public/wild-court/js/rooms/room2-ferrypool.js)**

### Logic
Classic predator/prey crossing. A coracle carries you + **one** charge. Rules learned by
examining the charges: the **ocelot kit** eyes the **macaw fledgling**; the fledgling
sidles toward the **figs**. Solution (7 crossings): bird over → return → kit over → **bird
back** → figs over → return → bird over. The fledgling's first click plays a foreshadow
(it repeats, in *your* recorded voice, "Quadrant nine…"). Restring item (vine cord) here.

### Visible elements
| Element | Anchor | Notes |
|---|---|---|
| Roots + arch overhead, canopy light-shaft | top | |
| The black pool | 700,560 300×120 | ground fog on water |
| Near bank (left) + far ledge (right) | | |
| Pulley line + near/far posts | | ferry-post carving plate (1236,508) |
| Coracle on the vine pulley | dynamic (cc) | moves with state |
| Three charges: kit / bird / figs | near bank | render at near/far/coracle |
| Braided vine cord (on near post) | 410,588 90×90 | item |
| **Token 2** (MANTIS "P") on far post | 1180,430 64×60 | gated to far bank |
| Stairs up from far ledge | right | exit |
| Fireflies + fog | overlay | |

### Interactive elements
**Hotspots:** `cord` 410,588,90,90 (item) · `postcarving` 1236,508,160,80 (ferry law) ·
charge hotspots (kit/bird/figs — dynamic) · `coracle` (cross) · `token2` 1180,430,64,60
· `pool` 700,560,300,120 (flavor). State in flags (`ferrypool_pos_*`, `playerFar`,
`ferried`).
**Items:** Braided Vine Cord.
**Puzzle:** in-scene state machine (no modal) — click charges to load/unload, click
coracle to cross; violation on a departed bank aborts the crossing (no penalty).

### Upgrade plan
- **Background plate:** a flooded temple gallery — a black still pool crossed by a vine
  pulley line, a reed coracle, near bank and far stone ledge, a slanting light-shaft.
- **Prop sprites:** the coracle (positioned along the pulley as it crosses); the three
  charges as characterful creatures (ocelot kit, macaw fledgling, net of river-figs),
  each with near/aboard/far positions; the ferry-post carving (the law); vine cord;
  token 2; ground fog drifting on the water.
- **Interaction upgrade:** this puzzle is **already in-scene** (not a modal) — lean in.
  Make loading a charge into the coracle and hauling the pulley a tactile, animated
  crossing; the near-miss ("the kit's ears flatten — you haul back just in time") a
  visible lunge. Crisp creature art + smooth coracle motion turn a logic puzzle into a
  little scene.

---

## Trial 3 — The Painted Grove
**★★★ · territory border surgery · ~8 min · [room3-paintedgrove.js](../../public/wild-court/js/rooms/room3-paintedgrove.js)**

### Logic
A bark map divides the valley into five grounds, each wearing a fixed clan mark
(CROWN=tree-frog, RIVER=jaguar, HEIGHTS=tapir, SCAR=tapir, FERN=macaw). Six toggleable
border segments; the Crown's four borders are fixed. Carved laws: no clan borders its own
mark; macaw won't border jaguar; each ground keeps exactly 3 neighbors. Solution: **raze
Heights–Scar and River–Fern; raise all four ring borders.** (You redraw the map — a
rehearsal for the finale.)

### Visible elements
| Element | Anchor | Notes |
|---|---|---|
| Colonnade of painted trunks | walls | |
| Two clan murals (upper wall) | 470,118 300×124 | the fixed marks |
| Three carved laws (leaning slab) | 1050,250 220×240 | |
| Bark map on stone easel | center | the puzzle surface; light-shaft on it |
| Pigment shelf (left of easel) | ~356,566 | ochre pot + token 3 |
| Ochre pigment pot (sealed 5th pot) | 510,500 80×90 | item |
| **Token 3** (TREE-FROG "O") | 356,566 74×70 | on pigment shelf |
| Old handprint (flavor) | 1320,540 90×60 | |
| Fireflies + spores + fog | overlay | |

### Interactive elements
**Hotspots:** map/easel (→ puzzle, foreshadow: "this is YOUR valley") · `murals`
470,118,300,124 (clan marks) · `laws` 1050,250,220,240 (the rules) · `ochre`
510,500,80,90 (item) · `token3` 356,566,74,70 · `handprint` 1320,540,90,60 (flavor).
**Items:** Ochre Pigment Pot.
**Puzzle "The Bark Map":** wide SVG modal — five grounds with fixed marks; click a border
segment to raise/raze boundary stones; Judge-stone submits; fail names the first broken law.

### Upgrade plan
- **Background plate:** a grove of painted temple trunks (a colonnade), a great stone
  easel bearing a bark map, a pigment shelf, a light-shaft falling on the easel.
- **Prop sprites:** the **bark map** as the hero asset — five painted territory grounds,
  each with its clan mark (tree-frog/jaguar/tapir/tapir/macaw), boundary-stone lines
  between them (raised/razed states); the two clan murals; the carved-law slab (legible);
  the ochre pot; token 3.
- **Interaction upgrade:** the map puzzle becomes a real cartographer's surface — click a
  border to raise/raze its stones (paint flows, stones set), the map visibly "at war" vs
  "at peace," the Judge-stone lighting up on the valid configuration. Border surgery is
  the surveyor's craft and rehearses the finale — make the redraw feel like drawing.

---

## Trial 4 — The Totem of Teeth
**★★★★ peak 1 · food-web path assembly · ~9 min · [room4-totem.js](../../public/wild-court/js/rooms/room4-totem.js)**

### Logic
A five-drum totem; the column facing the dais is what the Court reads. **Drum III is
lashed by strangler vines — cut with the machete first.** Four evidence reliefs (remains,
not statements) give four meals: harpy ate ocelot (fur in the sky-nest); boa ate tree-frog
(shed skin's shape); tree-frog ate mantis (wing on its tongue); ocelot ate boa (coil-bones
in its den, and *nothing else* — the load-bearing negative). Dais line: "read sky downward,
each takes the meal beneath, no face twice." Solution top→bottom: **HARPY / OCELOT / BOA /
TREE-FROG / MANTIS**. On solve the amber eye (lens) drops and **token 4 (TAMARIN "Y")**
clatters down.

### Visible elements
| Element | Anchor | Notes |
|---|---|---|
| Walls, floor, roots, torn canopy breach | full | breach over the dais |
| Canopy light-shaft on the dais | center | |
| Relief A — sky-nest | 240,150 180×160 | harpy→ocelot evidence |
| Relief B — shed skin | 140,470 190×170 | boa→tree-frog |
| Relief C — singer's meal | 940,260 180×150 | tree-frog→mantis |
| Relief D — shadow-cat's den | 940,460 180×160 | ocelot→boa (+ negative) |
| Stone door in toothed frame | 1190,260 250×450 | closed/open |
| Tooth-marks on doorframe | 1470,290 120×180 | flavor |
| Dais + reading-line | 850,706 280×110 | |
| The totem (5 drums) | 605,130 250×535 | drum III vine-wrapped (575,370) |
| Amber eye (the crown) | on totem | → amber lens on solve |
| Fireflies + fog | overlay | |

### Interactive elements
**Hotspots:** `relief_a/b/c/d` (evidence) · `dais` 850,706,280,110 (reading rule) ·
`carving` 600,670,260,100 (foreshadow: human figure) · `totem` 605,130,250,535 (→ puzzle)
· `vines` 575,370,310,120 (machete use) · `toothmarks` 1470,290,120,180 (flavor) · `door`
1190,260,250,450 (→ open) · `token4` 1005,682,100,90 (post-solve).
**Items:** Amber Lens (drops on solve).
**Puzzle "The Totem of Teeth":** five rotatable drum rows (creature pictogram + kenning);
drum III disabled until vines cut → HARPY/OCELOT/BOA/TREE-FROG/MANTIS.

### Upgrade plan
- **Background plate:** a tall torchless hall, a torn-canopy breach spilling light onto a
  dais, a sealed stone door in a tooth-gouged frame, roots down the walls.
- **Prop sprites:** the five-drum **totem** (each drum a rotatable barrel of five carved
  creature faces; drum III wrapped in strangler vines until cut); the four **evidence
  reliefs** (each a distinct carved scene of remains — the negative-clue den must clearly
  show coil-bones and *only* those); the amber eye/lens on the crown; token 4; the stone
  door (closed/open).
- **Interaction upgrade:** drums that physically rotate (carved faces turning to the dais
  line), the machete-on-vines beat freeing drum III with a slash, the amber eye dropping
  and door grinding open on the correct column. Peak puzzle — the reliefs are the clue set;
  render them as readable little dioramas so the food-web is deducible, not guessed.

---

## Trial 5 — The Morpho Gallery
**★★ breather · mirror-symmetry mosaic · ~6 min · [room5-morpho.js](../../public/wild-court/js/rooms/room5-morpho.js)**

### Logic
A great morpho-butterfly mosaic: the left wing intact but **faded** (use the **amber lens**
to reveal it), the right wing missing six tesserae. Mirror the left wing into the right
(outer stays outer, top stays top — a reflection, not a copy). Combine **beeswax + ochre →
oath-seal paste** here (Gus's notary quip; needed in T7). Foreshadow: the border procession
(animals leading human "defendants," a scale over each — the earnable mid-game reveal).

### Visible elements
| Element | Anchor | Notes |
|---|---|---|
| Apse arch + pale light | top | |
| Mosaic border (procession) | 330,150 940×72 | foreshadow (defendants + scales) |
| Great morpho mosaic: body + two wings | center | left faded, right = sockets |
| Wild bees' comb (apse edge) | 236,280 90×100 | beeswax item |
| Mosaic niche + **token 5** (HARPY "C") | 1326,428 78×100 | |
| Live morphos drifting | 380,560 260×120 | flavor |
| Ground fog | overlay | |

### Interactive elements
**Hotspots:** mosaic (→ puzzle; lens reveal) · `comb` 236,280,90,100 (beeswax) · `border`
330,150,940,72 (foreshadow) · `token5` 1326,428,78,100 · `morphos` 380,560,260,120 (flavor).
**Items:** Beeswax Lump, Oath-Seal Paste (combo: beeswax + ochre pot).
**Puzzle "The Morpho's Wing":** 3×2 tessera grid per wing; amber lens reveals the left-wing
key; click-to-swap tesserae into the right-wing sockets (mirror placement).

### Upgrade plan
- **Background plate:** a pale-lit apse with a vast morpho-butterfly mosaic filling the end
  wall, a mosaic border running around it, drifting live blue morphos.
- **Prop sprites:** the **morpho mosaic** — a faded left wing that blazes into color when
  the amber lens passes over it, a right wing of six empty sockets; the loose tesserae
  (six correct: azure/gold/violet teardrops, discs, oval + three decoys — all visually
  distinct); the mosaic border procession (foreshadow, keep the scales-over-humans
  readable); the bees' comb; token 5.
- **Interaction upgrade:** the **lens-reveal** is the signature franchise beat — sweep the
  amber lens and the faded wing lights up. Then a satisfying tessera-placement (drag +
  snap, mirrored so a correct placement looks like a true reflection), the whole wall
  unfolding like a wing on solve. Breather room — the reveal + the wing-unfold do the work.

---

## Trial 6 — The Tithe Hall
**★★★★ peak 2 · counterfeit weighing under a query budget · ~9 min · [room6-tithehall.js](../../public/wild-court/js/rooms/room6-tithehall.js)**

### Logic
Eight golden cacao pods (tallies I–VIII); one is **hollow** (lighter). The Scale of Truth
answers **twice, then sleeps**, and every rite re-lays the tithe. First restring the broken
pan with the **vine cord**. Intended path: weigh I·II·III vs IV·V·VI, then one vs one of
the lighter group → present the lie. Correct present → keep the **hollow pod** (evidence).
Also here: **Vance's brass compass** (1911, foreshadow + takeable anti-herring).

### Visible elements
| Element | Anchor | Notes |
|---|---|---|
| Back wall, floor, columns | full | |
| Canopy breach + hanging roots | 600,20 280×165 | light-shaft |
| Tithe frieze (procession of bearers) | 305,148 240×90 | |
| The Scale of Truth | 430,252 350×292 | pan states: intact / restrung / snapped |
| Offering table (8 pods I–VIII) | center | the tithes |
| Older offerings (front-left) | 230,705 180×120 | Vance's compass among them |
| **Token 6** (OCELOT "A") | 808,570 92×92 | on the offering table |
| Vance's compass | 1338,562 96×94 | item (1911) |
| Ground fog + firefly motes | overlay | |

### Interactive elements
**Hotspots:** `scale` 430,252,350,292 (→ restring + puzzle) · `law` 465,552,290,122
(the rite rules) · offering table (8 tithes) · `token6` 808,570,92,92 · `vance_compass`
1338,562,96,94 (item) · `breach` 600,20,280,165 (flavor) · `frieze` 305,148,240,90
(flavor) · `offerings` 230,705,180,120 (flavor).
**Items:** Vance's Compass, The Hollow Pod.
**Puzzle "The Scale of Truth":** restring with vine cord (item-on-hotspot), then a
weighing modal — 8 pod tiles onto two pans, WEIGH (2 answers), "Begin the rite anew"
(re-lays), "Present the lie."

### Upgrade plan
- **Background plate:** a long temple hall, a great bronze balance scale (one pan hanging
  by a snapped cord), an offering table of golden pods, columns, a canopy breach.
- **Prop sprites:** the **Scale of Truth** (snapped / restrung / weighing states); eight
  golden cacao pods numbered I–VIII (the hollow one identical-looking); the carved law
  (legible); Vance's 1911 brass compass; token 6; older offerings.
- **Interaction upgrade:** restring the pan with the vine cord (visible knot), then a
  tactile weighing rite — set pods on the pans, the beam actually tips toward the heavier
  side, the "two answers then sleeps" budget shown, wrong accusations re-laying the pods.
  Peak puzzle — the honest tipping-beam animation is what makes the deduction fair and fun.

---

## Trial 7 — The Verdict Roots (TWIST + META)
**★★★ · verdict rite (cross-trial synthesis) · ~10 min · [room7-verdict.js](../../public/wild-court/js/rooms/room7-verdict.js)**

### Logic
A root amphitheater; the Court assembled; the Speaking Stone at center; the only exit the
sealed root-doors. **Phase 1 (reveal):** the Stone lights — you were summoned; the trials
were testimony; Gus staked his collar; the valley lives only off the map. **Phase 2 (rite,
in order):** (1) place the **hollow pod** (truth from seeming); (2) speak the word — order
the tokens by the T4 food-chain + tamarin last → **CANOPY**; (3) spread your **survey map**,
apply the **oath-seal paste**, redraw the false contours against **Vance's compass** edge,
press the seal; (4) the root-doors part into a firefly corridor → victory: **THE COURT
RULES IN YOUR FAVOR.**

### Visible elements
| Element | Anchor | Notes |
|---|---|---|
| Night sky + moon through canopy | top | |
| Canopy masses + flanking trunks | sides | |
| Root amphitheater (three tiers) | mid | |
| The root-doors | center-right | sealed / open |
| The Court assembled (6 watchers, eye-glints) | around | macaw, jaguar, tapir, harpy (1150,50), boa (1455,365), mantis |
| The dais + Speaking Stone | center | the rite surface |
| The rite carved on the dais | 700,676 280×78 | pod / word / map / way |
| Ten thousand firefly jurors | 620,300 320×110 | the crowd |
| Ground fog + foreground fronds + light-shafts | overlay | |

### Interactive elements
**Hotspots:** `rite_carvings` 700,676,280,78 (the rite) · `harpy_crown` 1150,50,210,130
· `gallery_left` 250,150,330,400 (the watching Court) · `boa_coil` 1455,365,135,240 ·
`jurors` 620,300,320,110. The Stone / root-doors drive the reveal + rite dialog sequence.
**Puzzle:** the four-step rite (place pod → speak CANOPY → seal map w/ paste + Vance
compass → walk out), enforced in order via flags (`verdict_revealed`, `_podPlaced`,
`_wordSpoken`, `_mapPlaced`, `_mapSealed`).

### Upgrade plan
- **Background plate:** a root amphitheater under an open night canopy — sweeping root
  tiers, vast sealed root-doors, moon through the leaves, a firefly haze; the Speaking
  Stone on a central dais. This is the game's establishing shot — make it awe-scale.
- **Prop sprites:** the **six assembled watchers** as glinting-eyed silhouettes in their
  perches (macaw high-left, jaguar on a bough, tapir low, harpy crowning the doors, boa
  coiled, mantis front-row); the Speaking Stone (carvings dark → firefly-lit on the
  reveal); the survey map spread on the Stone; the oath-seal press; the root-doors (sealed
  → parted into a green firefly corridor).
- **Interaction upgrade:** the rite as a solemn, ordered ceremony on the Stone — place the
  hollow pod, speak CANOPY (letter rings or text), spread + seal the map (the redraw beat
  with Vance's compass as straightedge), then the doors opening on the walk to freedom.
  The finale carries the twist and the emotional payoff (Gus's collar) — the assembled-
  Court plate and the firefly-corridor exit deserve the most polish in the game.
