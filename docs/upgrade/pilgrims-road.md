# The Pilgrim's Road — Room-by-Room Upgrade Spec

Medieval castle escape (series Room I). You are **Aldric of Marden**, a mapmaker
condemned to hang at dawn, following a dead monk's carved suns out of Vayne Keep in
60 minutes. Source: `public/pilgrims-road/`. Full narrative logic:
[../DESIGN.md](../DESIGN.md); solutions: [../WALKTHROUGH.md](../WALKTHROUGH.md).

**Meta thread.** Six **sun-marks** (rays + a letter) are journaled across Rooms 1–6.
Sorted by ray count they spell **AURORA** (the dawn), which opens the final door.
Every sun sits on a mandatory puzzle object so it can't be missed.

### Art direction (lock once, reuse for all 7 rooms)
Cold stone castle interior at night, torch-lit. Palette from `ROOM_CONTRACT.md`:
stone `#1c1f2b`/`#2a2d3a`/`#3a3e4f`, shadow `#0b0e1a`, torch warmth `#ffa94d`/`#e07b2a`,
gold `#c9a227`, parchment `#e8d9b0`, moonlight `#aebfdd`. Mood: damp, candle-lit,
oppressive but with a warm escape-ward glow. Keep the drifting embers and every
torch's flame+glow as animated overlays on top of the new plates.

### Item chain (unchanged by the upgrade)
candle stub (R1) + flint & steel (R2) → **lit candle** (R4) · bent spoon (R1) → R5
measure · iron crow (R2) → R2 door, R7 pawl · silver key & holy oil (R3) → R4 door,
R6 gears · still-room key + recipe-right (R4) → R5 · recipe halves → full recipe ·
draught + meat → drugged meat (R5) → R6 dog · crank handle (R6) → R7 winch.

---

## Room 1 — The Oubliette
**Tutorial · counting → combination · ~5 min · [room1-oubliette.js](../../public/pilgrims-road/js/rooms/room1-oubliette.js)**

### Logic
A round stone pit. Edmund's verse (scratched by the grate) names three countable
things in order — crows, rats, chains. The drain grate has three numeral rings (I–IX).
Count the murals: **7 crows**, **4 rats**, **2 chains**; set rings to **VII / IV / II**;
the grate opens. Exit is gated on taking both items and examining sun-mark #1. Teaches
examine → journal → inventory → combination-lock in one forced loop.
Solution: **VII, IV, II** (indices 6,3,1).

### Visible elements (SVG scene layers)
| Element | Anchor (1600×900) | Notes |
|---|---|---|
| Curved pit wall + ashlar courses | full 0,0–1600,640 | linear-gradient stone, curved block lines |
| Damp streaks | x≈310, x≈1210 | dark vertical washes |
| Straw floor | ellipse cx800 cy780 | radial gradient + straw strokes |
| Torch (high on wall) | cx800 cy120 | flame `torch-flame` + `glow`; signature light |
| Gallows mural — **7 crows** | ~250–470, 190–390 | chalk strokes; count must stay 7 |
| Rats mural — **4 rats + loaf** | ~1120–1380, 230–390 | chalk; count must stay 4 |
| Kneeling-monk mural | ~590–720, 260–390 | chalk, flavor |
| Wall chains — **2 shackles** | ~930–1110, 170–460 | `sway`; count must stay 2 |
| Verse text | x470 y500 | italic serif, "Count the crows…" |
| Drain grate + 3 numeral rings | cx700 cy742 | renders open/closed from `oubliette_grateOpen` |
| **Sun-mark #1** (7 rays, "R") | cx530 cy700 | `beckon`; gold |
| Bread board + loaf (+ spoon) | 1150–1370, 726–782 | spoon sprite while not taken |
| Candle stub in straw | ~452, 812 | `beckon`; hidden once taken |
| Foreground pit-lip shadow | y840–900 | vignette |

### Interactive elements
**Hotspots** (id · box · role): `verse` 440,440,560,130 (clue→journal) · `gallows`
250,190,260,200 (clue, "seven crows") · `rats` 1120,230,260,160 (clue, "four rats") ·
`monk` 590,260,130,130 (flavor) · `chains` 930,170,180,290 (clue, "two chains") ·
`sun1` 480,650,110,130 (collectible) · `candle` 410,780,120,90 (item) · `board`
1140,690,250,110 (item: spoon) · `torch` 720,20,160,200 (flavor) · `grate`
550,680,300,130 (→ puzzle; becomes `grate_open` = exit).
**Items:** Tallow Candle Stub, Bent Dose-Spoon (48×48 SVG icons).
**Puzzle "The Verse Grate":** three `.dial` columns cycling Roman I–IX; "Turn the
Rings" checks VII/IV/II.

### Upgrade plan
- **Background plate:** photoreal round oubliette — wet ashlar curving up into
  darkness, one high guttering torch, straw-strewn floor, deep vignette. Compose so
  the wall's mid-band is clear for the three murals and the lower-center holds the grate.
- **Prop sprites:** the three chalk murals as distinct hand-drawn/chalk-textured
  overlays (crows, rats+loaf, monk) — **the exact counts are load-bearing, keep 7/4/2
  clearly countable**; two hanging wall chains (with subtle sway); candle stub
  (glint); bread board + gnawed loaf + spoon; the sun-mark #1 as an incised gold
  carving; the grate as a metal disc with three engraved rotating rings (open-state art
  showing the black shaft below).
- **Interaction upgrade:** turn the modal `.dial`s into a real iron drain-lock — three
  concentric or side-by-side engraved brass rings that physically rotate on click, with
  a satisfying clunk and the counterweight/grate-swing animation on solve. Keep the
  VII/IV/II check.
- **Effects to keep:** torch flame + glow, drifting embers, the `beckon` pulse on the
  candle and sun so first-time players find them.

---

## Room 2 — The Guard Room
**★★ · constraint ordering · ~7 min · [room2-guardroom.js](../../public/pilgrims-road/js/rooms/room2-guardroom.js)**

### Logic
Draw five beast-stamped bolts in the order the companies stand watch. Four clues:
roster ("Wolf neither first nor last"), tally board ("first watch to the tusked"),
table carving ("Serpent directly after Boar"), Osric's letter ("Falcon directly after
Stag"). Deduce **Boar → Serpent → Wolf → Stag → Falcon**. Cabinet opens onto empty
pegs + a false back panel; **use the iron crow** to pry it. Two hint ladders
(`bolts` / `door`).

### Visible elements
| Element | Anchor | Notes |
|---|---|---|
| Timbered wall + beams + floor boards | full | linear gradients |
| Duty roster parchment | 285,180 190×240 | five watches listed; `sway` |
| Slate tally board | 60,200 160×200 | chalk tallies |
| Brazier (fire) | cx260 cy560 | `torch-flame` + `glow` + flicker embers |
| Iron crow leaning by brazier | ~360–402, 480–640 | sprite while not taken |
| Trestle table: dice, cups, letter, quill | 560–1060, 470–560 | props |
| Flint & steel on table | ~640, 488 | sprite while not taken |
| Knife-carved words on tabletop | x810 y546 | "the serpent slithers…" |
| Armory cabinet + **five beast bolts** | 1180,200 330×440 | Boar/Stag/Wolf/Falcon/Serpent glyphs; renders closed / empty-pegs / false-back-open |
| **Sun-mark #2** (3 rays, "A") | cx1345 cy150 | above bolt rack |
| Open cistern hatch (entry) | cx520 cy810 | flavor |

### Interactive elements
**Hotspots:** `roster` 280,170,210,260 · `tally` 60,250,180,160 · `carving`
640,524,360,40 · `letter` 915,462,130,90 · `dice` 690,470,120,60 (flavor) · `hatch`
430,770,190,70 (flavor) · `sun2` 1300,110,130,90 · `crow` 340,470,100,180 (item) ·
`flint` 620,478,70,60 (item) · `cabinet` 1190,220,310,410 (→ puzzle) → `backpanel`
(iron-crow use) → `stairs` (exit).
**Items:** Iron Crow, Flint & Steel, Lit Candle (combine flint + candle stub).
**Combo:** `flint_steel` + `candle_stub` → `lit_candle`.
**Puzzle "The Watch-Order Bolts":** five `.tile` beast bolts; click in the correct
watch order (Boar,Serpent,Wolf,Stag,Falcon); wrong click springs them all back.

### Upgrade plan
- **Background plate:** low timbered guardroom, banked brazier casting warm pool,
  abandoned dice game — the garrison left in a hurry. Keep the armory cabinet on the
  right wall, roster/tally on the left, table center.
- **Prop sprites:** the five brass **beast bolts** as crisp engraved metal (boar, stag,
  wolf, falcon, serpent crests — reuse as the puzzle tiles); duty-roster parchment and
  slate tally as legible documents; iron crow; flint & steel; sun-mark #2; the cabinet
  in three states (bolted / empty pegs / torn false-back with cold draft).
- **Interaction upgrade:** the bolt puzzle becomes five real sliding bolts on the
  cabinet face that physically slide when drawn in order and slam back together on a
  wrong pick. The beast crests are the same art as the scene bolts.

---

## Room 3 — The Chapel
**★★★ · music / sequence · ~8 min · [room3-chapel.js](../../public/pilgrims-road/js/rooms/room3-chapel.js)**

### Logic
Ring five saint bells in the order of the stained-glass saints' lily counts, with the
"shepherd" (Cuthbert, the only one with a crook) ringing first *and* last:
**C-E-A-D-B-C** (Cuthbert, Edmund, Agnes, Dunstan, Brendan, Cuthbert). Each pull sounds
a real Web Audio tone; wrong ring = discord + reset. Reliquary opens → silver key +
holy oil.

### Visible elements
| Element | Anchor | Notes |
|---|---|---|
| Chapel walls + moon-blue interior | full | |
| Five-panel stained-glass window | 320,70 ~790×290 | saints w/ lily counts 1–5, Cuthbert + crook; `moonbeam` through it |
| Brass plaque under window | 560,366 440×66 | "SING AS THE LILIES BLOOM…" |
| Bell frame — **5 hand bells** | ~ mid | each cast with tone letter C/E/A/D/B |
| Votive candles | 80,500 210×110 | `torch-flame` cluster |
| Lectern + psalter | 1265,480 | |
| Altar + bronze reliquary | 690,670 180×90 | locked / open states |
| Crypt-stair arch + **sun-mark #3** (4 rays, "U") | 90,310 | on the arch |

### Interactive elements
**Hotspots:** `window` 320,70,790,290 (clue, wide dialog) · `plaque` 560,366,440,66
(clue) · `candles` 80,500,210,110 (flavor) · `psalter` 1265,480,130,160 (flavor) ·
`sun3` 90,310,120,90 · `crypt` 66,380,150,250 (flavor) · `reliquary` 690,670,180,90
(→ puzzle) → `reliquary_open` (items) · `door` 1440,360,150,300 (exit).
**Items:** Silver Key, Vial of Holy Oil (from reliquary).
**Puzzle "The Lily Carillon":** five bell pulls, each plays a pitched tone
(`game.playBell`), sequence C-E-A-D-B-C.

### Upgrade plan
- **Background plate:** narrow gothic chapel, moon-blue light, votive glow, altar with
  reliquary. The stained-glass window is the hero asset.
- **Prop sprites:** the **stained-glass window** rendered as genuine leaded glass —
  five saint panels, each holding its distinct lily count (1–5), Cuthbert with a
  shepherd's crook; **counts and the crook are load-bearing, keep them unambiguous**.
  Five hand bells on rope pulls (each with its cast tone-letter); the brass plaque as
  legible engraving; bronze reliquary (locked/open) with silver key + holy oil inside;
  sun-mark #3 on the crypt arch.
- **Interaction upgrade:** bells that swing and rope-pulls that yank on click, with the
  existing Web Audio tones (keep `playBell`), a visible "ring log" of the sequence so
  far, and a resonant final-octave resolve on solve. This is the most musical puzzle —
  richer bell art + subtle glow-on-ring sells it.

---

## Room 4 — The Scriptorium
**★★★★ peak 1 · book cipher · ~10 min · [room4-scriptorium.js](../../public/pilgrims-road/js/rooms/room4-scriptorium.js)**

### Logic
The room is **dark and unreadable** until you combine flint + candle → lit candle and
use it on the desk sconce. Cipher strip (pen case): `2:4 · 5:1 · 1:6 · 7:3 · 3:2` =
"line, then word; first letter." Only the comet-and-tower tome (the Chronicle) opens;
its 8 numbered lines resolve to N-O-R-T-H. Chest dials → **NORTH**. Reading the page
journals sun-mark #4 (the illuminated capital "O" of line 5, 6 rays). Chest yields
still-room key, recipe-right, Edmund's confession (midpoint story beat).

### Visible elements
| Element | Anchor | Notes |
|---|---|---|
| Dark room (pre-candle) vs lit room | full | two visual states, gated on sconce |
| High shelf of **six tomes** | 480,40 640×140 | spine emblems: ship/grail/boar/comet-tower/harp/wheel |
| Sloped writing desks | 300,420 700×200 | |
| Ink horns + quills, pen case | ~880,430 | cipher strip inside |
| Desk sconce (candle target) | mid-desk | lights the room |
| Edmund's chest + **five letter dials** | 1240,550 290×190 | closed/open states |
| Stair door behind desks | 80,300 190×330 | exit |
| **Sun-mark #4** — illuminated "O" | inside Chronicle page | in-document, not a scene carving |

### Interactive elements
**Hotspots (dark state):** `dark_desks`, `dark_shelf`, `pencase` (cipher strip). After
lighting: `shelf` 480,40,640,140 (→ book puzzle, journals sun #4) · `desks`
280,430,360,160 · `chest_open` 1240,550,290,190 (contents) · `stairdoor` 80,300,190,330
(exit). Sconce is lit via held lit-candle.
**Items:** Still-Room Key, Torn Recipe (right half), + Edmund's Confession (journal).
**Puzzles:** "The High Shelf" (pick the openable Chronicle among six) → "The Chronicle"
(read the 8-line page) → "Edmund's Chest" (five letter dials → NORTH).

### Upgrade plan
- **Background plate:** two versions — a near-black scriptorium (only faint window
  moonlight) and a warm candle-lit version (vellum glowing on the desks). The
  dark→lit transition is a signature moment; render both plates and cross-fade when the
  sconce lights.
- **Prop sprites:** six great tomes with **distinct spine emblems** (the comet-and-tower
  Chronicle must be identifiable); the cipher strip as an aged parchment ribbon with the
  legible `2:4 · 5:1…` and comet sketch; the Chronicle's open page with 8 red-numbered
  lines and the **illuminated golden "O" (sun #4)** painted into line 5 — this must read
  as a sun; Edmund's iron-banded chest with five brass letter-dials (closed/open).
- **Interaction upgrade:** the chest's five dials as real rotating lettered barrels
  (A–Z) that lock in with a clunk on NORTH. The book-selection can become a shelf you
  click across, damp-swollen tomes refusing with a dull thud, the Chronicle creaking
  open. Present the cipher strip and page side-by-side in a wide modal so indexing is
  comfortable (this is the hardest room — reduce friction, not difficulty).

---

## Room 5 — The Still-Room
**★★★ · recipe mixing · ~9 min · [room5-stillroom.js](../../public/pilgrims-road/js/rooms/room5-stillroom.js)**

### Logic
Combine the two recipe halves to read the Draught of Deep Sleep. Using labeled jars +
the wall herbal chart: **Papaver ×3, Valeriana ×1, Mel ×2**; stir **counter-clockwise
3×** (the dial's sun-arrow points clockwise, "widdershins" = against it); light the
hearth (flint & steel); pump bellows to the **first whistle**, then stop. Never touch
Cicuta (hemlock — labeled trap). The "1-measure" spoon is the **bent spoon from Room 1**
(anti-herring). Combine draught + meat shank → drugged meat.

### Visible elements
| Element | Anchor | Notes |
|---|---|---|
| Vaulted cellar + ribs | full | |
| Jar shelf — 7 labeled jars | ~ upper | PAPAVER/VALERIANA/MEL/CICUTA/ARTEMISIA/URTICA/MANDRAGORA |
| Herbal chart (pictures + glosses) | 870,170 320×310 | plain-English glosses + "widdershins" note |
| Spoon rack (2- & 3-notch; 1 empty hook) | 1240,190 220×130 | |
| Hanging meat shank | 1260,120 110×100 | item |
| Hearth + copper kettle + bellows + mantel | ~ lower-mid | stir dial w/ clockwise sun-arrow |
| **Sun-mark #5** (8 rays, "A") | 600,405 | branded on mantel beam |
| Loose shelf board (hides recipe-left) | 680,440 90×70 | |
| Stair up | 1450,300 150×340 | exit |

### Interactive elements
**Hotspots:** `chart` 870,170,320,310 · `spoons` 1240,190,220,130 · `board`
680,440,90,70 (item: recipe-left) · `meat` 1260,120,110,100 (item) · `sun5`
600,405,110,60 · `stair` 1450,300,150,340 (exit). Kettle → puzzle.
**Items:** Torn Recipe (left half), Draught Recipe (whole), Dried Meat Shank, Sleeping
Draught, Drugged Meat.
**Puzzle "The Copper Kettle":** ingredient/measure selection + stir-direction + heat
to first whistle.

### Upgrade plan
- **Background plate:** vaulted stone still-room, cold hearth with copper kettle and
  bellows, shelves of clay apothecary jars, an illustrated herbal chart on the wall.
- **Prop sprites:** seven labeled clay jars (labels legible — **CICUTA must read as the
  danger jar**); the herbal chart as a genuine illuminated apothecary diagram; the spoon
  rack showing the empty 1-notch hook; hanging meat shank; copper kettle with an engraved
  stir-dial (clockwise sun-arrow); branded sun-mark #5 on the mantel; loose shelf board.
- **Interaction upgrade:** the brewing puzzle as a tactile bench — drag/scoop from jars
  with the correct spoon, a kettle you stir (drag counter-clockwise), a bellows you pump,
  with the mixture going black on error and the single kettle-whistle as the success
  cue. Keep the exact recipe.

---

## Room 6 — The Great Hall
**★★★★ peak 2 · coupled-gear spatial · ~9 min · [room6-greathall.js](../../public/pilgrims-road/js/rooms/room6-greathall.js)**

### Logic
Two sub-steps. (1) A mastiff blocks the dais — **use drugged meat** → it sleeps; the
Wheel's gears are rust-seized — **use holy oil** → they free. (2) The **Wheel of Vayne**:
handles A/B/C each rotate two adjacent rings +90°; rings need 2,3,3,2 quarter-turns;
solution **A×2, B×1, C×2** (any order). Fresco shows the true arms; plaque: "no hand
turns one wheel alone." Tapestry door opens; crank handle on the alcove peg.

### Visible elements
| Element | Anchor | Notes |
|---|---|---|
| Vast hall, tall windows (sky lightening) | 240,130 | time-pressure beat |
| Twin hearths (banked coals) | ~ mid | glow |
| Gallery fresco (tower/raven/key/comet) | 790,120 380×250 | the arms reference |
| Dais + Wheel of Vayne | 1230,90 250×230 | four concentric rings, handles A/B/C |
| Plaque under wheel | 1230,610 240×44 | "NO HAND TURNS ONE WHEEL ALONE" |
| **Sun-mark #6** (5 rays, "R") | 1040,700 | brass floor inlay under wheel |
| The mastiff | ~ dais | sleeping-but-alert; sleeps after drugged meat |
| Hidden stair + crank peg (post-solve) | 1390,340 / 1255,380 | |

### Interactive elements
**Hotspots:** `windows` 240,130,310,440 (flavor) · `fresco` 790,120,380,250 (clue) ·
`sun6` 1040,700,130,90 · `plaque` 1230,610,240,44 (clue) · `wheel` 1230,90,250,230
(→ dog/oil gating → puzzle) · `crank` 1255,380,130,160 (item) · `stair` 1390,340,110,250
(exit) · `hearths` 530,460,180,200 (flavor).
**Items:** Gatehouse Crank Handle.
**Puzzle "The Wheel of Vayne":** three handles A/B/C, each turning two rings; align four
heraldic quarters to the fresco; A×2 B×1 C×2.

### Upgrade plan
- **Background plate:** grand medieval hall, twin banked hearths, tall windows with a
  faintly greying pre-dawn sky, a heraldic wheel above the dais, a tapestry.
- **Prop sprites:** the sleeping **mastiff** (alert vs drugged states); the **Wheel of
  Vayne** — four concentric marble rings of heraldic quarter-charges (tower/raven/key/
  comet), three bronze handles; the gallery fresco showing the correct arms; the plaque;
  brass sun-mark #6 inlaid in the floor; the crank handle on its alcove peg with
  Edmund's chalk note.
- **Interaction upgrade:** the wheel as the star interaction — real concentric rings
  that rotate 90° with a geared grind when a handle is pulled, charge-fragments visibly
  snapping into alignment against the fresco. Animate a first-pull gear-teeth glint so
  players discover the couplings (the DESIGN doc flags this as a calibration lever).

---

## Room 7 — The Gatehouse (META + finisher)
**★★★ · meta-synthesis + mechanical · ~10 min · [room7-gatehouse.js](../../public/pilgrims-road/js/rooms/room7-gatehouse.js)**

### Logic
The great main-gate windlass is a **signposted trap** (watched through the murder-holes).
The real exit is the north door under a sun relief, ringed by six letter-dials. Plaque:
"SIX SUNS LIGHT THE PILGRIM'S ROAD. THE FEWEST RAYS SPEAK FIRST." Sort the journaled
suns by ray count → **A-U-R-O-R-A** (AURORA, the dawn). Beyond: a water-gate winch with a
snapped pawl — **insert crank handle**, **wedge the iron crow** through the drum spokes as
a pawl, crank 3×; the grate lifts; dive at dawn.

### Visible elements
| Element | Anchor | Notes |
|---|---|---|
| Winch chamber, murder-holes above | 330,10 740×80 | voices/boots audible |
| Torch | ~ | signature light |
| Great windlass (main gate — trap) | 480,350 290×320 | |
| North door + sun relief + **six dials** | 1150–1450 | relief 1210,250; plaque 1163,372; dials 1150,455 |
| Fog crawling floor | lower | `fog` |
| **(tunnel scene, post-door)** brick tunnel + water-gate grate + small winch | 920,300 / 60,270 | dawn-grey light, water shimmer, drum+socket+pawl |

### Interactive elements
**Hotspots (winch room):** `windlass` 480,350,290,320 (trap, flavor) · `holes`
330,10,740,80 (flavor) · `relief` 1210,250,130,110 (clue) · `plaque7` 1163,372,214,76
(clue) · `dials` 1150,455,240,90 (→ meta puzzle).
**Hotspots (tunnel):** `water` 950,620,420,240 · `grate` 920,300,470,300 (→ winch
finisher) · `back` 60,270,260,510.
**Puzzles:** "The Pilgrim's Gate" (six A–Z dials → AURORA) then the winch finisher
(crank into socket, iron crow through spokes, crank 3×).

### Upgrade plan
- **Background plates (two):** (1) the gatehouse winch chamber — massive portcullis
  windlass, murder-holes above leaking torchlight, the low north door with its carved
  sun relief; (2) the brick escape tunnel ending at the water-gate grate, black mere
  water, dawn-grey light seeping down.
- **Prop sprites:** the six brass letter-dials on the north door; the carved sun relief;
  the plaque; the great windlass (menacing, clearly "watched"); the small water-gate
  winch with its square socket, drum spokes, and sheared pawl; the rising grate (multiple
  positions as it cranks up).
- **Interaction upgrade:** the six dials as real rotating letter-barrels reading out
  A-U-R-O-R-A on solve; the winch finisher as a genuine two-item assembly (crank seats
  in the socket, iron crow wedges through the spokes) followed by a crank-and-rise
  animation and the final dive-to-freedom beat. This is the payoff room — the
  dawn-breaking light and rising water deserve the best plate work and a strong final
  animation.
