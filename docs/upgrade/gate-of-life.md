# The Gate of Life — Chamber-by-Chamber Upgrade Spec

Ancient-Rome escape (series Room IV). You are **Aulus Pollio**, architect of the
Colosseum's underworks, condemned to the midday executions — following a dead
beast-carpenter's bone tesserae out through the fire-damaged works to the old **Porta
Sanavivaria** (the Gate of Life) in 60 minutes. Source: `public/gate-of-life/`. Full
logic: [../DESIGN-GATEOFLIFE.md](../DESIGN-GATEOFLIFE.md); solutions:
[../WALKTHROUGH-GATEOFLIFE.md](../WALKTHROUGH-GATEOFLIFE.md).

**No twist mechanic** — this game trades the rug-pull for an emotional payoff (Felix's
bones behind the arch; Gus is his lion). **Meta thread.** Six **bone tesserae** (a
gladiator emblem + a letter), journaled across Chambers 1–6. Matched to the R7
**procession frieze** (spear · net · egg-helm · fish-crest · griffin · palm), they spell
**MISSIO** — the crowd's cry to spare a life.

### Art direction (lock once, reuse for all 7 chambers)
Colosseum underworld, warm and torch-lit. Palette: stone `#241f1a`/`#332b23`/`#453a2e`,
deep shadow `#0f0c08`, torchlight `#ffa94d`/`#e07b2a` (**every torch keeps flame + glow**),
gold `#c9a227`, arena sand `#c9a45f`/`#e8cf96`, marble/travertine `#cfc6b4`/`#8a7f6a`,
imperial crimson `#8e2f35`, imperial purple `#5a2a52`, bone/ivory `#e8dcc0`. Recurring
motifs: **sand sifting between the ceiling planks**, dusty shafts of arena light from
above, crowd-roar implied by tiered vaults, SPQR/Latin inscriptions in serif. Keep torches
and warm embers as animated overlays.

### Item chain (with consumption — do not guess)
strigil (R1, "junk") → R1 drain + R4 scrape wax [KEPT] · dolabra (R2) → R7 bar + arch
[KEPT] · wool rag (R2) + oil flask (R3) → **oiled rag** → R7 hinge [combo + hinge CONSUME]
· bronze mirror (R3) → R5 chalk plan [KEPT] · winch key (R4) → R6 brake [CONSUMED, renders
seated] · crank handle (R5) → R6 capstan [CONSUMED, renders seated] · rudis (R7, story).
**Global rule:** any check for `wool_rag` or `oil_flask` must also accept `oiled_rag`.

---

## Chamber 1 — The Carcer
**Tutorial · acrostic + item-use · ~5 min · [room1-carcer.js](../../public/gate-of-life/js/rooms/room1-carcer.js)**

### Logic
The cell door is a merchant's **letter-lock** — five sliding tumblers (deliberately NOT
rings). Felix's five-line verse on the wall reads down the margin: initials spell **ARENA**
("Read me down the margin. — F."). Set A·R·E·N·A. Then: the floor **drain grate** is
finger-proof — **use the strigil** (bathhouse junk) to lever it → **token 1**. Teaches
acrostic + item-on-hotspot.

### Visible elements
| Element | Anchor | Notes |
|---|---|---|
| Stone coursing (cramped cell) | full | |
| Barred slit window (upper-right) | 1160,60 260×150 | daylight, dust, distant crowd |
| Torch beside the door | ~ | flame + glow (signature) |
| Felix's verse wall (left-center) | 82 | art only; hotspot below reserve |
| Manacles on the wall | 700,290 180×130 | flavor |
| Door: iron-strapped oak + letter-lock | right | chained / ajar |
| Straw pallet (lower-left) | 110,690 350×130 | strigil |
| Drain grate (lower middle-right) | 810,720 210×110 | finger-proof; **token 1** below |
| Old small bones (far corner) | 40,570 150×110 | flavor (a dog's) |
| Sand sifting from planks above | overlay | signature |

### Interactive elements
**Hotspots:** verse wall (→ `note_verse`) · door/letter-lock (→ puzzle, then exit) ·
`pallet` 110,690,350,130 (strigil) · `drain` 810,720,210,110 (strigil use → token 1) ·
`window` 1160,60,260,150 (flavor) · `manacles` 700,290,180,130 (flavor) · `bones`
40,570,150,110 (flavor).
**Items:** Strigil.
**Puzzle "The Letter-Lock":** five sliding tumblers cycling `A E N R S V` → ARENA.

### Upgrade plan
- **Background plate:** a cramped, dank Roman holding cell — rough stone coursing, a
  barred slit window high on the right leaking a dusty shaft of daylight, an
  iron-strapped oak door, straw on the floor, a torch by the door.
- **Prop sprites:** the **letter-lock** (five vertical sliding tumblers — deliberately NOT
  rings, so the first and last locks of the game look different); Felix's verse scratched
  in plaster (legible, ARENA readable down the margin); the drain grate (finger-proof →
  levered ajar); the strigil in the straw; token 1 (bone tessera, egg-helm emblem, "S");
  manacles; a few small bones.
- **Interaction upgrade:** tumblers that slide with a metallic scrape and lock on ARENA;
  the strigil-on-drain as the taught item-use beat (lever + grate lifts). Sand sifting
  from the ceiling planks + torch flame are the signature ambient overlays.

---

## Chamber 2 — The Armamentarium
**★★ · attribute assignment (mixed evidence) · ~7 min · [room2-armory.js](../../public/gate-of-life/js/rooms/room2-armory.js)**

### Logic
Dress the practice dummy as the **secutor** ("the chaser, who follows the net-man") for
inspection. Evidence is half written, half physical: a mural of four brothers, the
drill-master's complaint tablet, and wear-marks on the gear. Deduce **smooth egg-helm
(crestless) + tall scutum (worn by two hands) + straight gladius**. Solving drops the
maintenance locker → dolabra + wool rag. Token 2 (spear, "M") glints in the whetstone trough.

### Visible elements
| Element | Anchor | Notes |
|---|---|---|
| Long vaulted armory + ribs | full | torches |
| Mural of the four brothers (upper-center) | 620,250 460×60 | clue (right of x220, below y250) |
| Helmet rack (4 helms) | 250,300 320×110 | fish/griffin/smooth/visored |
| Shield rack (4) | 1080,290 360×210 | scutum/square/buckler/net |
| Weapon rack (4) | 250,460 320×150 | gladius/sica/trident/spear |
| The practice dummy (center) | center | undressed / dressed |
| Drill-master's tablet on a stand | ~ | complaints clue |
| Whetstone wheel + trough | 1130,740 250×90 | **token 2** in the sand |
| Maintenance locker | 430,680 210×150 | closed / open (items) |
| Practice swords + cold forge (flavor) | 60,320 / 50,690 | |
| Barred far door | | exit |

### Interactive elements
**Hotspots:** dummy + tag (→ puzzle) · `mural` 620,250,460,60 · drill-master tablet ·
`helms` 250,300,320,110 · `shields` 1080,290,360,210 (→ `note_scutum` wear) · `weapons`
250,460,320,150 · `trough` 1130,740,250,90 (token 2) · `locker` 430,680,210,150 (post-solve
items) · `practice` 60,320,150,100 (flavor) · `forge` 50,690,210,100 (flavor). Far door → exit.
**Items:** Dolabra, Wool Rag, token 2.
**Puzzle "Dress the Secutor":** three columns (helmet/shield/weapon, 4 options each) →
smooth egg-helm / tall scutum / gladius.

### Upgrade plan
- **Background plate:** a long vaulted armory — racks of helmets, shields, and weapons, a
  practice dummy center, a whetstone wheel, a mural high on the wall, torches.
- **Prop sprites:** the twelve pieces of gladiatorial kit (four helms, four shields, four
  weapons — each recognizable: fish-crest, griffin, smooth egg-helm, visored; scutum,
  square, buckler, net; gladius, sica, trident, spear); the **practice dummy** (undressed
  → correctly dressed); the mural of four brothers (legible clue); the drill-master's wax
  tablet; token 2 in the whetstone trough; the maintenance locker (closed/open).
- **Interaction upgrade:** the dummy-dressing puzzle as a real armor stand — click a helm/
  shield/weapon onto the dummy, the inspection bell mocking a wrong loadout, the locker
  chain dropping on a correct one. The kit sprites double as the puzzle options.

---

## Chamber 3 — The Shrine of Nemesis
**★★★ · jug measuring · ~7 min · [room3-shrine.js](../../public/gate-of-life/js/rooms/room3-shrine.js)**

### Logic
Nemesis takes **IIII heminae** of oil in one pour. Vessels: a bottomless amphora, a **V**
(5) jug, a **III** (3) jug, no interior marks. Pour between them to leave exactly 4 in a
jug, pour into the lamp. Wrong amount tips back (state preserved). Solve lights the lamp,
turns Nemesis's wheel, opens a niche → oil flask (taking it seeds Gus's "soak the rag"
line). Also: bronze mirror (votive pile), token 3 (behind the crooked votive tablet), and
the **Sower's charm** on the doorway (row 1: **S A T O R** — load-bearing for R4).

### Visible elements
| Element | Anchor | Notes |
|---|---|---|
| Shrine walls + Nemesis statue | 700,260 200×280 | folded wings; wheel at her sandal (turns on solve) |
| The great lamp | ~ | dark / lit |
| Altar + inscription | 610,670 380×110 | the rite (IIII heminae) |
| Vessels: amphora + V jug + III jug | 290,530 300×200 | the pour puzzle source |
| Votive pile (with mirror) | 180,500 220×90 | bronze mirror |
| Votive tablets (one crooked) | 1170,290 250×110 | **token 3** behind it |
| Doorway charm on plaster | 1280,460 140×150 | the SATOR charm (R4 key) |
| Niche under statue (opens on rite) | 746,566 110×80 | oil flask |
| Scratched prayers + cold brazier (flavor) | 120,690 / 1120,700 | |

### Interactive elements
**Hotspots:** `rite` 610,670,380,110 (altar inscription) · lamp (→ pour puzzle) ·
`vessels` 290,530,300,200 (jugs/amphora desc) · `votives` 180,500,220,90 (mirror) ·
`tablets` 1170,290,250,110 (token 3, crooked cue) · `charm` 1280,460,140,150 (`note_charm`)
· `niche` 746,566,110,80 (post-solve: oil flask) · `statue` 700,260,200,280 (flavor) ·
`prayers` 120,690,260,80 (flavor) · `brazier` 1120,700,130,120 (flavor).
**Items:** Bronze Mirror, Flask of Sacred Oil, Oiled Rag (combo: wool rag + oil flask).
**Puzzle "The Libation":** water-jug state display + Fill/Pour/Empty/Pour-into-Lamp
buttons → leave 4 in a jug, pour.

### Upgrade plan
- **Background plate:** a small torch-lit shrine — a statue of Nemesis with folded wings,
  a dark votive lamp, an altar, shelves of votive tablets, a doorway with a scratched charm.
- **Prop sprites:** the two jugs (stamped V and III) + the amphora; the lamp (dark → bloomed);
  Nemesis's statue (wheel at her sandal turning on solve); the votive pile with the bronze
  mirror; the votive tablets (one hanging crooked — token 3 behind it); the doorway
  **Sower's charm** (S A T O R legible — it feeds R4); the opened niche + oil flask.
- **Interaction upgrade:** the pour puzzle as tactile bronze vessels — fill from the
  amphora, pour V→III with visible oil levels, pour the exact 4 into the lamp (which
  blooms and turns the goddess's wheel). Wrong pours visibly tip back into the jug (the
  fail line says so). Classic measuring puzzle — legible oil levels make it fair.

---

## Chamber 4 — The Lanista's Tablinum
**★★★★ peak 1 · palindromic word square (SATOR) · ~10 min · [room4-tablinum.js](../../public/gate-of-life/js/rooms/room4-tablinum.js)**

### Logic
The strongroom door is a **5×5 letter frame** — set the Sower's square. Middle row fixed:
**TENET**. Plaque: "it reads by four roads" (same all four ways). Row 1 = **SATOR** (the R3
charm); Row 2 = **AREPO** — hidden under re-waxed tablet, **scrape it with the strigil**;
rows 4–5 derive by the four-ways rule = **OPERA / ROTAS**. Strongroom → winch key + token 4
+ the ledger (midpoint: Felix denied the rudis "too useful below"; the lion "to be
destroyed").

### Visible elements
| Element | Anchor | Notes |
|---|---|---|
| Cramped office; fresco (amphitheatre cutaway) | 610,70 440×190 | your stolen drawings |
| Oil lamp on the desk | ~ | |
| Desk + tablets + abacus | 300,490 240×110 | the re-waxed tablet |
| The re-waxed tablet (AREPO) | on desk | scrape w/ strigil |
| Abacus | 510,500 110×90 | flavor |
| Scroll shelves | 230,210 320×220 | flavor |
| Strongroom door + letter frame | right | closed / open (glints inside) |
| Corridor door | | exit |
| Strongbox (flavor) | near desk | |

### Interactive elements
**Hotspots:** `desk` 300,490,240,110 (strigil use → AREPO palimpsest) · square frame
(→ puzzle) · strongroom interior (post-solve: key + ledger + token 4) · `fresco`
610,70,440,190 (flavor) · `abacus` 510,500,110,90 (flavor) · `scrolls` 230,210,320,220
(flavor) · corridor door (exit).
**Items:** Winch Key, token 4, + the ledger (journal `note_ledger`).
**Puzzle "The Sower's Square":** 5×5 tile grid (row 3 fixed TENET) + letter tray →
SATOR/AREPO/TENET/OPERA/ROTAS.

### Upgrade plan
- **Background plate:** a cramped lanista's office — a desk with wax tablets and an abacus,
  a wall fresco of the amphitheatre in cutaway, scroll shelves, a bronze-framed strongroom
  door.
- **Prop sprites:** the **5×5 letter frame** on the strongroom door (fixed TENET row); the
  re-waxed desk tablet (blank wax → scraped to reveal AREPO); the letter tiles; the fresco
  (your stolen drawings); the strongroom interior (winch key, ledger, token 4).
- **Interaction upgrade:** the strigil-scrapes-wax beat (drag the strigil, wax shavings
  curl away, AREPO incised beneath) then the word-square as real bronze tiles clicking into
  the frame, the frame turning like a lock on the completed SATOR square. Peak puzzle —
  the palimpsest reveal + the four-ways symmetry are the "aha"; keep the tiles legible.

---

## Chamber 5 — The Hypogeum
**★★★ breather-with-teeth · guided maze traversal · ~8 min · [room5-hypogeum.js](../../public/gate-of-life/js/rooms/room5-hypogeum.js)**

### Logic
The beast level, dark except knife-blades of light. Felix's chalk plan (faded) is revealed
by **holding the bronze mirror on the niche** (throws a light-shaft): *"FROM THE LION GATE:
PERGE II · DEXTRA · PERGE II · SINISTRA · PERGE I · DEXTRA · PERGE I · THE STAIR."*
(Perge = onward; dextra = sword hand/right; sinistra = shield hand/left.) Navigate the 4×4
maze to D4. Wrong dens reset you to A1 (no time cost). Gus's old cage holds token 5; the
crank handle is in a broken capstan.

### Visible elements
| Element | Anchor | Notes |
|---|---|---|
| Arena floor as ceiling (planks + joists) | top | sand motes falling |
| Light blades through the planking | overlay | |
| Overhead lift machinery (flavor) | 620,150 460×140 | your own designs |
| Torch by the Lion Gate | ~ | flame + glow |
| The Lion Gate (maze mouth) | 350,420 220×340 | → maze |
| Niche + Felix's chalk plan | ~ | mirror-reveal; renders after seen |
| Gus's old cage (name board GVSTVS) | 135 | token 5 under the trough |
| Broken capstan | 780,650 190×140 | crank handle |
| Claw-grooved post + feed trough (flavor) | 230,350 / 50,700 | |
| Stair door (far right) | 171 | exit |

### Interactive elements
**Hotspots:** niche (mirror use → `note_plan`) · `gate` 350,420,220,340 (→ maze) · Gus's
cage (token 5 + name board) · `capstan` 780,650,190,140 (crank handle) · `machinery`
620,150,460,140 (flavor) · `clawpost` 230,350,90,410 (flavor) · `trough` 50,700,190,80
(flavor) · stair door (exit).
**Items:** Crank Handle, token 5.
**Puzzle "The Tunnels Beyond the Lion Gate":** top-down maze view + Sinistra/Perge/Dextra
buttons (relative turns); reach D4; dens reset to A1, revealed map persists.

### Upgrade plan
- **Background plate:** the Colosseum hypogeum — a lattice of cage-tunnels under the arena
  floor, the underside of the planking as a ceiling with sand sifting through, knife-blades
  of light, the Lion Gate, Gus's old cage.
- **Prop sprites:** the **Lion Gate** (maze mouth); Felix's chalk plan (smudged → revealed
  by the mirror's light-shaft, then rendered legibly); the bronze mirror in use; Gus's cage
  + name board "GVSTVS" + token 5 under the trough; the broken capstan + crank handle;
  overhead lift machinery.
- **Interaction upgrade:** the **mirror-reveal** of the chalk plan (franchise light-reveal
  signature) then a top-down maze the player walks with relative Perge/Dextra/Sinistra
  turns — visited cells staying lit across den-resets, wrong dens snapping you back with a
  growl. The maze is the mechanic; the mirror-reveal is the mood.

---

## Chamber 6 — The Great Winch
**★★★★ peak 2 · mechanical-advantage assembly · ~9 min · [room6-winch.js](../../public/gate-of-life/js/rooms/room6-winch.js)**

### Logic
The cage-lift's rigging was stripped. Setup: free the brake with the **winch key**; seat
the **crank handle** in the capstan. Felix's beam note: "drum × block must make TWELVE."
Drums marked **II / III / V**; blocks with **I / II / IIII** sheaves. Only **III drum ×
four-sheave block = 12**. Heave → the platform rises → upper door opens. Token 6 (fish-crest,
"S") in the grease pit.

### Visible elements
| Element | Anchor | Notes |
|---|---|---|
| High slot of arena light | top | |
| Fire-scarred beams (+ Felix's beam note) | 230,130 70×630 | the rigging arithmetic |
| Great capstan / drum assembly | mid | crank socket + brake |
| Drum shelf (II / III / V) | 290,540 350×130 | geared drums |
| Block chest (I / II / IIII) | 1120,610 330×140 | pulley blocks |
| Cage-lift platform | center | lowered / raised |
| Upper door (appears with raised platform) | 145 | exit |
| Grease pit | 850,750 230×90 | **token 6** |
| Winchmen's tally chalk + torch (flavor) | 159 / 168 | |

### Interactive elements
**Hotspots:** `brake` 640,580,130,90 (winch-key use) · `socket` 790,530,100,80
(crank-handle use) · beam note (`note_mechanica`) · `drums` 290,540,350,130 (marks) ·
`blocks` 1120,610,330,140 (sheaves) · rigging slots (→ mount/heave puzzle) · `pit`
850,750,230,90 (token 6) · `scars` 230,130,70,630 (flavor). Upper door/platform → exit.
**Items:** (winch key + crank consumed here), token 6.
**Puzzle "Rig the Great Winch":** two mount slots (drum + block); select drum (II/III/V)
and block (I/II/IIII); "Heave" checks drum × sheaves = 12.

### Upgrade plan
- **Background plate:** a double-height winch gallery — a great geared capstan and drum,
  ropes rising into darkness, a cage-lift platform, fire-scarred beams, a shelf of drums
  and a chest of pulley blocks.
- **Prop sprites:** the **capstan/drum assembly** (brake locked→freed with the seated
  key; empty→crank-seated socket); three geared drums marked II/III/V; three pulley blocks
  with visibly countable sheaves (1/2/4); the cage-lift platform (down→raised); Felix's
  beam note (legible arithmetic); token 6 in the grease pit.
- **Interaction upgrade:** mount a drum and a block into the rigging slots (they render
  seated), then "Heave" — a wrong ratio shuddering and settling, the exact 12 grinding the
  platform up with taut ropes and a mechanical rumble. Peak puzzle — the countable sheaves
  + geared-drum marks make the ×12 deducible; the rising platform is the reward.

---

## Chamber 7 — The Porta Sanavivaria (finale)
**★★★ · item synthesis + frieze-matched meta · ~9 min · [room7-porta.js](../../public/gate-of-life/js/rooms/room7-porta.js)**

### Logic
The gate corridor above ground. The Gate of Life refuses three ways (a free in-world
checklist on click): oil the **seized hinge** (with the **oiled rag**); pry the **bar**
(dolabra); open the **half-bricked arch** (dolabra) → **Felix's bones**, his tools, a
finished **rudis**, and his last tablet ("the word is the one the crowd shouts when a life
is spared… take the lion"). Then the wicket's **six-ring lock**: match the tesserae emblems
to the **procession frieze** above (spear · net · egg-helm · fish-crest · griffin · palm) →
**MISSIO**. Gus blocks the door until you take the rudis. Gate opens into daylight →
victory: **MISSIO — GRANTED.**

### Visible elements
| Element | Anchor | Notes |
|---|---|---|
| Torch-dark corridor | full | torches |
| THE GATE (oak, iron-bound, daylight in seams) | 1150,170 300×300 | closed → open at the very end |
| Iron straps, the great bar, the hinge | 1000,410 / 1010,236 | bar seat + seized hinge |
| The wicket + **six rings** | on the gate | the word lock |
| The procession frieze (above the wicket) | 1050,50 410×120 | spear/net/egg/fish/griffin/palm |
| The half-bricked arch / alcove | 350,390 220×370 | → Felix + rudis + tablet |
| Spy-slit (flavor) | 690,280 140×60 | the sand mid-roar |
| Fallen garlands (palm fronds) | 620,760 260×80 | echo token 5's emblem |

### Interactive elements
**Hotspots:** `gate` 1150,170,300,300 (always — checklist + final open) · `hinge`
1010,236,90,110 (oiled-rag use) · `barseat` 1000,410,110,100 (dolabra use) · wicket rings
(→ word puzzle) · `frieze` 1050,50,410,120 (`note_frieze`) · `arch` 350,390,220,370
(dolabra use) → alcove (rudis + `note_felix`) · `slit` 690,280,140,60 (flavor) · `garlands`
620,760,260,80 (flavor).
**Items:** Felix's Rudis (story).
**Puzzle "Felix's Letter-Lock":** six rings cycling `A C E F I L M N O R S T`; match
tesserae to the frieze → MISSIO.

### Upgrade plan
- **Background plate:** a torch-dark walled corridor ending at the huge double **Gate of
  Life** — oak, iron-bound, bricked around, daylight blazing in the seams, crowd-roar
  implied through the stone. This is the destination shot — make the daylight beckon.
- **Prop sprites:** the gate (closed → cracked → swung open into white daylight); the
  seized hinge (rusted → oiled/shining); the great bar (rusted in seat → pried upright);
  the **wicket six-ring lock**; the **procession frieze** (six carved marchers, matched to
  the tesserae — must be readable, it's the meta key); the half-bricked arch (bricked →
  opened, lamplit alcove); **Felix's remains** (bones in a carpenter's apron, folded
  tools, the finished rudis, his last tablet) — the emotional centerpiece; fallen palm
  garlands.
- **Interaction upgrade:** the three-item "way" beats (oiled rag on the hinge, dolabra on
  the bar and the arch) as tactile repairs; the six rings turning to MISSIO with a sound
  "like a verdict"; the arch opening on the alcove reveal (paced, not click-through — Gus
  won't leave without the rudis); the gate finally heaving open into daylight and roar.
  The finale carries the whole game's payoff — the alcove reveal and the daylight-opening
  gate deserve the most polish.
