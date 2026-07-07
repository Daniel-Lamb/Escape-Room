# The Wild Court — Design Document

### A browser escape room — win your verdict before the Court adjourns at nightfall

**Logline:** A survey cartographer for a timber concession falls through a sinkhole into a
lost temple-jungle where the animals hold court. Seven trials stand between you and the
canopy door — and the last thing the verdict demands is the one thing you came here to make.

> Revision 2 — after adversarial design review. Major changes from rev 1: T7 meta rederived
> through the T4 food chain (no more sort-by-count cipher), T4 rebuilt as evidence-based
> food-web path assembly (5 creatures), T3 inverted into border surgery, T6 re-lays the
> hollow pod every rite, Gus is a stakeholder rather than a secret-keeper, wax+ochre combo
> live from T5, `verdict_mapPlaced` flag added, Vance's compass is a takeable anti-herring.

---

## 1. Story & THE TWIST

**Surface story.** You are **Marlowe Reyes**, contract surveyor for the Ashford Timber
Concession, three days into mapping "Quadrant Nine" — a valley that appears on no chart.
The ground opens; you come to at the bottom of a fern-choked sinkhole inside a
root-swallowed temple. A golden tamarin in a tiny woven collar introduces himself as
**Gus, advocate for the accused** — and he means it literally, though you will assume
whimsy. You have until nightfall (60:00) to pass through seven chambers and reach open air.

**The twist (Trial 7).** The sinkhole was not an accident. The Wild Court — a genuine
tribunal of the valley's animals — **summoned** you, exactly as it summoned the
concession's first surveyor in 1911 (his brass compass still sits on the tithe table; his
survey was never filed). The seven chambers were never obstacles. They were **testimony**:
each trial demonstrated that you can read tracks, keep charges alive, honor territory,
know who eats whom, restore what is broken, and tell truth from seeming. **Gus is not a
keeper of this secret — he told you his job in his first breath.** What the reveal adds is
the STAKES: Gus petitioned the Court to summon a mapmaker rather than answer the
concession "the old way" (ask Vance how that went), and he staked his advocate's
commission — **the woven collar he is so proud of** — on a human passing testimony. The
price of the verdict lands on you both at once, and neither of you knew it in advance:
the valley lives only while it stays off the map. The canopy door costs your survey —
redrawn by your own hand into worthless swamp and scree, sealed with wax and ochre,
sworn on the word the tokens have been spelling all along.

**Fair-play foreshadowing (all present before Trial 7, all journaled):**
1. T1 — your compass needle has spun uselessly "since the ground took you."
2. T1 — the trail-blazes you cut yesterday, visible on the sinkhole rim, are already
   grown over — bark closed like the cuts were years old.
3. T2 — the macaw fledgling repeats, in YOUR recorded voice: *"Quadrant nine. Mark the
   big kapok. Good money in this valley."*
4. T3 — the painted bark map of clan territories is your survey valley — same river
   bend, same stone scar — under moss older than the concession itself.
5. T4 — the newest carving on the Totem of Teeth, cuts still pale: a human figure with
   a satchel and a measuring chain.
6. T5 — the mosaic border: a procession of human figures being led by animals INTO the
   temple — and over each human, a small carved scale. *Not prisoners. Defendants.*
   (If examined, Gus interjects: *"I did tell you. Advocate. Accused. I have never once
   been speaking in metaphor, Marlowe."* — the mid-game reveal is EARNABLE here.)
7. T6 — among the offerings: a brass surveyor's compass engraved **"T. VANCE — 1911"**
   (the concession's founding survey, never filed, surveyor "lost").
8. Gus's language is literal from minute one — "advocate for the accused," "counsels,"
   "testimony," "the docket" — and one greeting stakes it plainly: *"I staked this collar
   on taking your case. The collar, Marlowe. Do you grasp the gravity."*

**Ending.** Verdict rite complete, the amphitheater's root-doors part into a green
corridor lit by fireflies, and you walk out at dusk. Weeks later the concession abandons
Quadrant Nine — your filed map shows flood-swamp and worthless scree. On your windowsill,
some mornings: two river-figs, and small five-fingered prints. And the collar, for the
record, stays exactly where it belongs. Victory screen: **THE COURT RULES IN YOUR FAVOR.**

**Defeat (00:00).** Nightfall. The fireflies rise all at once like a verdict being read.
Gus quietly takes off his little collar and sets it on a root. *"Court is adjourned. But
appeals are heard — the Wild Court is patient, Marlowe. It has been patient since 1911."*

---

## 2. Global systems

Identical engine to the first two rooms (timer, satchel, combining, tiered Gus hints,
journal, autosave, defeat-retry). Differences of skin:

- **Gus's form:** **Gus the golden tamarin** — small monkey, extravagant golden mane,
  tiny woven collar (his advocate's commission — this matters), expressive tail.
  Epithet: *Gus — golden tamarin, advocate for the accused.* Hint buy label:
  **"Chitter it"**.
- **Journal:** **"Field Journal"**. Collectibles are **court tokens** — small carved wood
  discs, each bearing a **creature face + a letter** (see below; NOT ray/notch counts —
  that cipher belongs to the other two games). Inventory label: **"Satchel"**.
- **Palette (scene authoring):** understory greens `#0e1c12` `#16281a` `#223a26`,
  deep shadow `#070d08`, bark `#4a3626` `#6b4f37`, old stone `#3f4a3c` `#2e3a2c`,
  firefly warm `#ffe08a` `#d1a53f`, moon-through-canopy `#9fd4a8`, orchid accent
  `#c96fb0`, pale-leaf parchment `#e4f0d0`.
- **Signature look (replaces the torch/candle rule):** every scene gets at least one
  slanting **canopy light-shaft** (tall translucent polygon, class `moonbeam`) and
  **2–3 drifting firefly motes** (small `#ffe08a` circles, class `glow fast` or a
  room-local float animation). Ground fog (`fog`) and swaying fronds (`sway slow`)
  encouraged. Light-reveals via a carried item are a deliberate franchise signature
  (candle → UV lamp → amber lens).
- **Documents:** found writings use the `.leaf-tablet` class (authored in this game's
  `skin.css`; `.leaf-title` inner heading, `.carved` variant for stone-carved laws).

### The six court tokens (meta-puzzle currency)

Journal entries use `category: 'sun'` (the engine's collectible channel) with
`sun: { creature, letter }` — the game config's `renderCollectible` draws the creature
face + letter, and `collectibleToast` names the creature. **No numeric field is used.**

| Token | Found in | Creature face | Letter |
|---|---|---|---|
| 1 | T1 gate lintel | BOA | N |
| 2 | T2 far-bank ferry post | MANTIS | P |
| 3 | T3 pigment shelf | TREE-FROG | O |
| 4 | T4 totem crown (drops on solve) | TAMARIN | Y |
| 5 | T5 mosaic niche | HARPY | C |
| 6 | T6 offering table | OCELOT | A |

Room-order letters read **N-P-O-Y-C-A** (meaningless). The ordering rule is **not** a
count-sort — it is cross-trial synthesis: the Speaking Stone (T7) is carved with
*"The Court speaks as the totem eats — sky first, then all it feeds. The advocate speaks
last."* The T4 solution (journaled automatically on solve: *harpy, ocelot, boa,
tree-frog, mantis*) orders five tokens; the tamarin — Gus (*"That one is me. I
insisted."*) — goes last: **C-A-N-O-P-Y**. The Stone asks for *"the word that shelters
every clan"*: **CANOPY**. Solvable entirely from the journal (T4's order note + six
token cards + the Stone's carved rule, all journaled).

**Token invariant (fairness):** every token is an always-available hotspot from the
moment its location is reachable until journaled (`!game.journal.has(id)` guard), and it
must exist in EVERY scene-state variant of its room (gate open/closed, puzzle solved/not).

Every trial's exit is diegetically gated on that trial's token + the items later trials
require (Gus refuses to let you proceed "with your testimony incomplete").

### Item chain

```
T1 bone-handled machete ────────────→ T4 cut the strangler vines jamming drum III
T1 your survey map (story item) ────→ T7 the verdict demands it
T2 braided vine cord ───────────────→ T6 restring the Scale of Truth's broken pan
T3 ochre pigment pot ──────┐
T5 beeswax lump ───────────┴─ combine → OATH-SEAL PASTE ──→ T7 seal the redrawn map
T4 amber lens (the totem's eye) ────→ T5 reveal the faded left wing
T6 Vance's brass compass ───────────→ T7 the straightedge you redraw the map against
T6 the hollow pod (the lie) ────────→ T7 present the lie to the Court
```

**Combination recipe — REGISTER IN T5's MODULE (`room5-morpho.js`):** beeswax lump +
ochre pigment pot → **oath-seal paste**. All room modules load at boot via
`rooms/index.js`, so combos are live game-wide from import time; registering in T5 is
documentation of *when it becomes usable*, nothing more. The combine succeeds whenever
both are held (narrate: *"You knead ochre into soft wax. It smells like a promise."* +
Gus: *"An oath-seal? You would make a fine notary. Hold that thought."* — a free
foreshadow). **Because the raw wax can be consumed early, T5's exit gate MUST accept
`hasItem('beeswax_lump') || hasItem('oath_seal_paste')`** (same for any later check of
either ingredient).

**Vance's compass is the game's anti-herring** (the Pilgrim's-Road bent-spoon move): it
reads as pure memorabilia in T6 and turns out to be the straightedge of the finale.

### The seven mechanics (none shared with the prior 14)

negative-evidence track reading · river-crossing state puzzle · territory border surgery
(graph editing) · food-web path assembly from physical evidence · mirror-symmetry mosaic
completion · balance-scale counterfeit deduction under a query budget · verdict rite
(cross-trial meta-synthesis)

---

## 3. The seven trials

Room ids / flag prefixes, in order: `sinkhole`, `ferrypool`, `paintedgrove`, `totem`,
`morpho`, `tithehall`, `verdict`. **Keep all hotspots out of the top-left 220×250
scene-unit reserve zone (Gus docks there).** Prefix all SVG gradient/filter ids and
room-local animation names with the room slug.

---

### TRIAL 1 — The Sinkhole Nave (≈5 min, tutorial) — `room1-sinkhole.js`

**Mechanic: track reading with negative evidence.**

**Scene:** the bottom of a fern-choked sinkhole inside a ruined nave. A ragged circle of
evening sky far above; roots pour down the walls like frozen waterfalls. Your scattered
gear: a fallen satchel, a half-buried **machete** glinting in the mud. A stone
**root-gate** in the east wall with **three sockets**, each beside a trace preserved in
ancient mud-brick: left = a four-toed pug mark with no claw tips; middle = three broad
round toes; right = **a smooth, unbroken drag-line — no print at all**. Each socket
cycles five clan glyphs: JAGUAR, TAPIR, HARPY, BOA, MONKEY. Token 1 (BOA, "N") is set
into the gate lintel (collectible before AND after the gate opens — invariant).

**Items:** **bone-handled machete**; **your survey map** (from the satchel — story item;
examine journals it: the quadrant-nine draft, the big kapok marked). A torn page of
**your own field guide** lies in the mud — the puzzle key, auto-journaled on examine.

**Puzzle: the Gate of Passage** — `game.openPuzzle`, three dial columns (`.dial`
pattern), each captioned by its trace, cycling the five glyphs. Wrong → `api.fail`
("The gate does not know these walkers."). Solve → flag `sinkhole_gateOpen`,
`api.solved`, `refreshScene`.

**Exact clues (field-guide page, journaled verbatim):**
- *"Jaguar: four toes, NO claw tips showing — claws sheathed when walking."* → left = JAGUAR
- *"Tapir: three broad round toes, like a clover."* → middle = TAPIR
- *"Boa: leaves no footprint at all — only a smooth drag-line in soft ground."* → right = **BOA**
  (the answer that comes from ABSENCE — nothing walked there)
- *"Harpy eagle: a two-lobed talon cross, deeper at the rear."* (no such trace at the
  gate — kills the HARPY decoy; the talon-cross appears as a flavor wall-scar instead,
  foreshadowing T4's apex)
- Examining any trace notes *"far too large for any monkey"* (kills the MONKEY decoy).

**Solution:** JAGUAR · TAPIR · BOA. Unique; every distractor explicitly eliminated.

**Foreshadows (both auto-journaled):** your compass ("the needle has spun since the
ground took you"); the rim above ("yesterday's blazes on the kapok are... closed. Bark
grown smooth, like the cuts were years old").

**Flavor hotspots:** the sky circle, the root-falls, the harpy talon-scar on the wall,
the empty satchel after the map is taken.

**Exit gate:** machete + survey map + token 1. (Gus: *"Advocate's advice: a surveyor
without a map is just a trespasser, and the Court dislikes trespassers."*)

**Hints:** ① *"The gate asks who passed before you. Your own field guide fell with you —
read it against the traces."* ② *"Sheathed claws and four toes is the cat; three round
toes the tapir. And the third trace? Nothing WALKED there. What travels without feet?"*
③ *"Left jaguar, middle tapir, right boa — the drag-line is a serpent's."*

**Connects to next:** the root-gate grinds inward onto a flooded gallery.

---

### TRIAL 2 — The Ferry Pool (≈7 min) — `room2-ferrypool.js`

**Mechanic: river-crossing (predator/prey ferry logic), rules discovered by observation.**

**Scene:** a black flooded gallery; a reed **coracle** on a vine pulley line crosses to a
far ledge. On the near bank wait three charges: an **ocelot kit**, a **scarlet macaw
fledgling**, and a **net of river-figs**. The ferry post carving states only capacity and
stakes: *"The coracle bears the ferryman and ONE charge. The Court counts what arrives."*
The danger rules are learned by EXAMINING the charges (each journaled): the kit *"watches
the fledgling the way hunger watches a window"*; the fledgling *"keeps sidling toward the
figs"*; the figs *"smell like temptation with a handle."* Token 2 (MANTIS, "P") hangs on
the far-bank post — **hotspot gated on being on the far bank**, available until
collected regardless of puzzle state. The **braided vine cord** is coiled on the
near-bank post (take any time).

**Puzzle — in-scene, state in flags (this room's state model is contractual):**
- `ferrypool_pos_kit` / `ferrypool_pos_bird` / `ferrypool_pos_figs` ∈ `'near' | 'far' | 'coracle'`
- `ferrypool_playerFar` (bool), `ferrypool_ferried` (bool — set when all three are `'far'`;
  unseals the stairs)
- Click a charge on your bank → load it (if coracle empty; else diegetic "ONE charge")
  or unload if it's aboard. Click the coracle/pulley → cross. Every action mutates flags
  then `game.refreshScene()`.
- **Violation check on the bank being DEPARTED** (kit+bird together without you, or
  bird+figs together without you): the crossing does not happen — narrate the near-miss
  (*"the kit's ears flatten — you haul the ferry back just in time"*) + `wrong` sfx.
  No penalty, no reset; state is untouched.
- **Fledgling click conflict:** the FIRST-ever click on the fledgling plays the
  foreshadow (it repeats, in YOUR voice: *"Quadrant nine. Mark the big kapok. Good money
  in this valley."* — journaled, flag `ferrypool_birdHeard`); subsequent clicks
  load/unload.
- Near-bank charge hotspots sit below y=250 / right of x=220 (Gus reserve).

**Solution (7 crossings):** bird over → return empty → kit over → **bird back** → figs
over → return empty → bird over.

**Exit gate:** vine cord + token 2.

**Hints:** ① *"Watch what watches what — the charges tell you their natures if you look.
Something will have to ride twice."* ② *"The bird can never wait beside the kit OR the
figs. Take it first; when you bring the second charge over, take the bird BACK."*
③ *"Bird over, back empty, kit over, bird back, figs over, back empty, bird over."*

**Connects to next:** stairs rise from the far ledge into a grove of painted trunks.

---

### TRIAL 3 — The Painted Grove (≈8 min) — `room3-paintedgrove.js`

**Mechanic: territory BORDER SURGERY — the clans are fixed; you redraw the map.**
(This is what a surveyor does — and it rehearses the finale.)

**Scene:** a colonnade of painted trunks around a great **bark map** on a stone easel:
the valley cut into five grounds — **CANOPY CROWN** (center) and, in a ring, **RIVER**,
**KAPOK HEIGHTS**, **FERN DEEP**, **STONE SCAR**. Each ground already wears its painted
clan mark (fixed, from the murals): CROWN=TREE-FROG, RIVER=JAGUAR, HEIGHTS=TAPIR,
SCAR=TAPIR, FERN DEEP=MACAW. Between grounds run **boundary-stone lines** that can be
RAISED or RAZED. Token 3 (TREE-FROG, "O") on the pigment shelf; the **ochre pigment
pot** (a sealed fifth pot — an item) beside it.

**Border model:** the Crown's four borders (Crown–River, Crown–Heights, Crown–Fern,
Crown–Scar) are FIXED — carved: *"The Crown answers to all and is bound to all."* Six
toggleable segments: the ring **River–Heights, Heights–Fern, Fern–Scar, Scar–River** and
the two cross-passes **Heights–Scar** and **River–Fern**.
**Initial state (the "war map"):** cross-passes RAISED, and ring segments Heights–Fern
and Scar–River RAZED — i.e. tapir borders tapir, macaw borders jaguar: the laws scream.

**The carved laws (each journaled):**
- Law A: *"No clan abides its neighbor's mark — bordering grounds never share."*
- Law C: *"The macaw will not roost beside the jaguar."*
- Law D: *"Each ground keeps faith with three neighbors — no more, no fewer. The Crown
  is bound to all."*

**Puzzle — `game.openPuzzle` (wide) modal:** the five-ground map as inline SVG; click a
toggleable border segment to raise/raze its boundary stones (tick + visual); a
**Judge-stone** button submits. On fail, `api.fail` names the FIRST broken law
diegetically (*"Two grounds wear one mark across a shared border — the grove stirs"* /
*"The macaw shrieks at the hunter across the line"* / *"A ground keeps faith with the
wrong number of neighbors"*). Modal state is modal-local (contract-OK); on solve set
`paintedgrove_solved`, `api.solved`, `refreshScene` (the map repaints at peace).

**Solution (unique — proven):** all four ring segments RAISED, both cross-passes RAZED.
*Deduction:* Law A razes Heights–Scar (tapir|tapir); Law C razes River–Fern
(jaguar|macaw). Law D gives each outer ground exactly 2 non-Crown borders; with both
crosses dead, each outer ground's only candidates are its two ring segments → all four
ring segments must stand. Forced and unique.

**Foreshadow (journaled):** examine the map itself — *"The river bend. The stone scar.
This is YOUR valley — the one on your survey — painted under moss older than the
concession."*

**Flavor:** painted trunks, a pigment-stained handprint far too old, drifting spores.

**Exit gate:** ochre pot + token 3.

**Hints:** ① *"The marks are already painted and they are not wrong — the BORDERS are.
Boundary stones can be raised or razed."* ② *"Two laws kill two borders outright: tapir
cannot touch tapir, macaw cannot touch jaguar. Then count to three for every ground."*
③ *"Raze Heights–Scar and River–Fern; raise all four ring borders. Judge it."*

**Connects to next:** the painted trunks part onto a torchless hall dominated by a totem.

---

### TRIAL 4 — The Totem of Teeth (≈9 min, peak 1) — `room4-totem.js`

**Mechanic: food-web path assembly from physical evidence (with a load-bearing
negative clue).**

**Scene:** a tall hall; a **five-drum totem** before a sealed stone door. Each drum
carries five creature faces (HARPY "the sky", OCELOT "the shadow-cat", BOA "the coil",
TREE-FROG "the singer", MANTIS "the dancer") and rotates; the column facing the door
(marked by a moonlit dais line) is what the Court reads. **Drum III is lashed tight by
strangler vines** — machete on the vines (item-on-hotspot) sets `totem_vinesCut`; until
then the modal renders drum III vine-wrapped with rotate buttons disabled, and "Wake the
Totem" refuses: *"Drum III strains against its lashings."*

**The dais line (journaled, fixes reading direction AND no-duplicates):** *"The Court
reads from the sky downward — each face takes the meal directly beneath it, and no face
speaks twice."*

**Evidence reliefs (each journaled on examine — these are REMAINS, not statements):**
- Relief A: a high nest of woven bones — *"In the sky-nest, a tuft of golden
  shadow-cat fur."* → HARPY ate OCELOT
- Relief B: a cast serpent skin — *"The coil's shed skin bulges with a singer's
  shape."* → BOA ate TREE-FROG
- Relief C: a frog on a leaf — *"On the singer's tongue, a dancer's wing."* →
  TREE-FROG ate MANTIS
- Relief D (**the load-bearing negative**): the shadow-cat's den — *"Bones of the coil
  litter the shadow-cat's den — but of singer and dancer, nothing. Too small beneath its
  hunger."* → OCELOT ate BOA, and explicitly NOT frog/mantis (this is what seats the
  ocelot: its meal must be the coil).

**Puzzle — `game.openPuzzle` modal:** five wide drum rows (creature pictogram + kenning
name), ◀ ▶ rotate buttons cycling all five faces (duplicates possible — the dais line
forbids them diegetically). **Initial door-facing column: TREE-FROG, MANTIS, HARPY,
OCELOT, BOA** (no drum starts on its solution face; drum III starts jammed on HARPY —
wait, initial column drum III = HARPY per this list — and its solution face is BOA, so
the machete beat is never skippable). Attempt button: "Wake the Totem."

**Solution (unique):** HARPY / OCELOT / BOA / TREE-FROG / MANTIS, top to bottom.
*Deduction:* each adjacent pair must be an evidenced meal; the four reliefs give exactly
the four meals (H→O, O→B, B→F, F→M); relief D's negative clause is what forces O
directly above B (without it, "what does the shadow-cat eat?" is open and no complete
column can be assembled with confidence).

**On solve:** the totem's **amber eye** falls → `game.addItem('amber_lens', {from:
{totem eye coords}})` in the solved handler; the stone door grinds open; **token 4
(TAMARIN, "Y") clatters down from the crown onto the dais** — a new hotspot, present in
all post-solve scene variants until collected. On examining it Gus says: *"That one is
me. I insisted."* **Also auto-journal the solved order as a note** (`totem_order`):
*"The totem's order, sky downward: harpy, ocelot, boa, tree-frog, mantis."* (The finale's
meta depends on this journal entry.)

**Foreshadow (journaled):** the base carving, cuts still pale — *"a human figure.
Satchel. Measuring chain. The newest carving on the whole totem."*

**Flavor:** tooth-marks on the doorframe, the moonlit dais, the shed-skin relief detail.

**Exit gate:** amber lens + token 4.

**hintContext:** `s => s.flags.totem_vinesCut ? 'order' : 'vines'`
- vines ladder: ① *"The third drum is bound fast. Bound things want blades."* ② *"The
  machete, on the strangler vines."* ③ *"Cut drum III free at the totem, then read the
  reliefs — they are meals, not decorations."*
- order ladder: ① *"Four reliefs, four meals — but one relief matters most for what it
  says did NOT happen. And the dais tells you how the Court reads."* ② *"Sky ate
  shadow-cat. Shadow-cat scorns singer and dancer, so its meal was the coil. Coil ate
  singer; singer ate dancer."* ③ *"Top to bottom: harpy, ocelot, boa, tree-frog,
  mantis."*

**Connects to next:** beyond the door, dawn-pale light through a wall of wings.

---

### TRIAL 5 — The Morpho Gallery (≈6 min, breather) — `room5-morpho.js`

**Mechanic: mirror-symmetry mosaic completion.**

**Scene:** an apse washed in pale light. A great **morpho-butterfly mosaic** fills the
end wall — its LEFT wing intact but **faded almost to nothing**, its RIGHT wing missing
six tesserae (empty sockets). A stone tray holds nine loose tesserae. A wild **bees'
comb** hangs at the apse edge (**beeswax lump** — take any time). Token 5 (HARPY, "C")
in a mosaic niche.

**Step 1 — the lens:** use the **amber lens** on the mosaic → the left wing blazes back
into readable color (flag `morpho_wingRevealed`; the scene renders the lit wing from
then on). Opening the puzzle before this shows the key as grey blanks + narration
pointing at "something in your satchel that gathers light."

**Step 2 — the mirror — `game.openPuzzle` modal. Geometry (contractual):** each wing is
a **3-row × 2-column grid** — rows top/mid/low; columns **inner** (nearest the body) and
**outer** (wingtip). The left-wing key shows, per (row, column) cell, exactly the
tessera belonging to the corresponding right-wing socket, **drawn x-flipped** (the
reflection is visual; the (row, inner/outer) labels are what match). Directional shapes
**auto-mirror when socketed** so a correct placement always LOOKS like a true
reflection. Click a tray tessera → click a socket to place; click a placed tessera to
return it (click-to-swap, no drag). Attempt button: "Wake the Wing." Check = exact
identity match per socket.

**Tesserae (all visually distinct):** correct six — S1 top-outer **azure teardrop**
(points wingtip-ward), S2 top-inner **gold disc**, S3 mid-outer **violet oval** (tilted),
S4 mid-inner **azure disc**, S5 low-outer **gold teardrop**, S6 low-inner **violet
disc**. Decoys: red disc, green teardrop, azure square.

**On solve:** the whole mosaic wall unfolds like a wing — the way through
(`morpho_solved`).

**Combo (registered in THIS module):** beeswax lump + ochre pigment pot → **oath-seal
paste** (see section 2 — Gus's notary quip; T5 exit gate accepts wax OR paste).

**Foreshadow (journaled + Gus interjection):** the mosaic border — *"a procession:
animals leading human figures INTO the temple. Over each human, a small carved scale.
Not prisoners. Defendants."* Gus: *"I did tell you. Advocate. Accused. I have never once
been speaking in metaphor, Marlowe."*

**Flavor:** live morphos drifting, the comb's hum, a socketed pillar.

**Exit gate:** (beeswax lump OR oath-seal paste) + token 5.

**Hints:** ① *"The right wing wants to be the left wing's reflection — but the left has
faded. Something in your satchel gathers light."* ② *"Lens on the mosaic. Then mirror
it: outer stays outer, top stays top — a reflection, not a copy."* ③ *"Top-outer azure
teardrop, top-inner gold disc, mid-outer violet oval, mid-inner azure disc, low-outer
gold teardrop, low-inner violet disc."*

**Connects to next:** behind the wing, torch-dark and the glint of gold.

---

### TRIAL 6 — The Tithe Hall (≈9 min, peak 2) — `room6-tithehall.js`

**Mechanic: balance-scale counterfeit deduction under a query budget.**

**Scene:** a long hall; an offering table bearing **eight golden cacao pods** numbered in
carved tallies **I–VIII**, and the great bronze **Scale of Truth** — one pan hanging by a
snapped cord. Law carved beneath (journaled): *"One tithe among the eight is hollow —
gold over air, lighter than truth. The Scale answers TWICE, then sleeps. Each time the
rite begins anew, unseen hands re-lay the tithe. The Court hears no accusation before
the Scale has spoken. Present the lie."* Among the offerings: **Vance's brass compass**,
engraved **T. VANCE — 1911** (foreshadow, journaled, **and a takeable item** — reads as
memorabilia, pays off in T7). Token 6 (OCELOT, "A") on the offering table.

**Step 1:** restring the broken pan with the **braided vine cord** (item-on-hotspot,
flag `tithehall_scaleStrung`). The scale is unusable before this.

**Puzzle — `game.openPuzzle` modal. The rite model (contractual):**
- Persistent flags: `tithehall_scaleStrung`, `tithehall_riteCount` (int, starts 0),
  `tithehall_solved`. Weighing state and pan placements are **modal-local**.
- **Every rite-start re-lays the tithe:** hollow pod = `SEQ[riteCount % 8]` where
  `SEQ = [6, 3, 8, 1, 5, 2, 7, 4]` (tally numbers), then increment `riteCount`.
  Rite-starts are: opening the modal, pressing **"Begin the rite anew"**, and any wrong
  "Present the lie." (First-ever rite → pod **VI**, so scripted tests are
  deterministic.) True pods weigh 10, the hollow 7 — the simulation is honest for ANY
  pan contents (unequal counts included).
- UI: the 8 pods as tiles; click a pod to cycle **left pan → right pan → table**; a
  **WEIGH** button showing answers remaining (2 → 1 → "the Scale sleeps"); the visible
  **"Begin the rite anew"** reset (always available, free); **"Present the lie"** —
  enabled only after ≥1 weighing this rite — pick a pod → confirm.
- Wrong present: the hall goes silent; diegetic sting (*"The Court does not blink.
  Unseen hands re-lay the tithe."*); new rite; no time cost.
- Correct present: the seven true pods sink into the table; the far door unbars; the
  hollow pod stays in hand → item **the hollow pod** (*"gold over air — the lie, kept
  as evidence"*); flag `tithehall_solved`; journal the result.

**Intended path (first rite):** weigh I·II·III vs IV·V·VI → the right pan rises → lie
among IV/V/VI → weigh IV vs V → balance → present **VI**. (All information-sufficient
strategies work; insufficient ones dead-end into the free reset — which re-lays the
pods, so brute memory carries nothing across rites.)

**Exit gate:** hollow pod + Vance's compass + token 6.

**hintContext:** `s => s.flags.tithehall_scaleStrung ? 'weigh' : 'string'`
- string ladder: ① *"A scale with one pan is just a gallows for fruit."* ② *"The snapped
  cord wants cordage. You have carried some since the pool."* ③ *"The vine cord, on the
  broken pan."*
- weigh ladder: ① *"Eight pods, two questions, and the tithe re-laid whenever the rite
  restarts. Split them so every answer teaches you something."* ② *"Three against three:
  balance means the lie waits in the two you held back; a tilt means it hides on the
  LIGHTER side. Then one against one."* ③ *"Three against three, then one against one of
  the lighter group — and if those two balance, it is the third. The Scale never needs a
  third answer."* (Strategy-shaped — the pod moves between rites, so no hint names it.)

**Connects to next:** the unbarred door opens onto firefly-lit dark and the sound of a
very large, very patient audience.

---

### TRIAL 7 — The Verdict Roots (≈10 min, finale: TWIST + META) — `room7-verdict.js`

**Mechanic: verdict rite (cross-trial meta-synthesis).**

**Scene:** a root amphitheater under the open night canopy. The Court assembled — a
jaguar along a bough, a harpy above, tapir, macaw, boa coiled, mantis on a leaf, ten
thousand firefly jurors. Center: the **Speaking Stone**. The only exit: vast
**root-doors**, sealed.

**Phase 1 — the reveal** (first click on the root-doors or the Stone): the Stone's
carvings fill with firefly light: *"THE COURT OF THE WILD CALLS THE MAKER OF MAPS. THE
TRIAL IS NOT BEGINNING. THE TRIAL IS ENDING — TESTIMONY WAS TAKEN AT THE GATE, THE POOL,
THE GROVE, THE TOTEM, THE WING, AND THE SCALE."* Gus climbs onto the Stone and does his
actual job: he petitioned for a mapmaker to be SUMMONED rather than let the valley
answer the concession the old way — *"ask Vance how the old way went"* — and he staked
his collar on you. He did not know the price either; the Stone states it now: **the
valley lives only while it stays off the map.** Dialog sequence reviews the journaled
foreshadows. Flag `verdict_revealed`; the Stone then presents the rite. (Players who
examined T5's procession got here early — the reveal acknowledges it: Gus: *"You knew.
Good. Then let us finish it properly."* if `morpho` procession was journaled.)

**Phase 2 — the rite (four steps, enforced in order, on the Speaking Stone):**
1. **THE LIE** — place the **hollow pod** on the Stone (*"show the Court you know truth
   from seeming"*). Consumes the pod. Flag `verdict_podPlaced`.
2. **THE WORD** — the Stone's carving (journaled): *"The Court speaks as the totem eats —
   sky first, then all it feeds. The advocate speaks last. Speak the word that shelters
   every clan."* Text input, canonicalized (trim/lowercase): **canopy**. Derivation: the
   six tokens' creatures ordered by the journaled T4 chain (harpy C, ocelot A, boa N,
   tree-frog O, mantis P) + the tamarin (Y) last. Flag `verdict_wordSpoken`.
3. **THE MAP** — use **your survey map** on the Stone (consumed via `useSelected()`;
   flag **`verdict_mapPlaced`** — the scene renders the spread map on the Stone from
   this flag, so save/reload mid-step is safe). Then apply the **oath-seal paste**
   (combine wax + ochre if not already done; the Stone prompts: *"wax and ochre, made
   one"*). The redraw beat (dialog): you rule the false contours against **Vance's
   compass edge** — flood-swamp, scree, nothing worth felling — and press the
   ochre-wax seal. Consumes the paste. Flag `verdict_mapSealed`.
4. **THE WAY** — the root-doors part into a green firefly corridor. Walking through →
   `completeRoom` → victory.

**hintContext (four ladders, matched to the enforced step):**
`s => !s.flags.verdict_revealed ? 'reveal' : !s.flags.verdict_podPlaced ? 'lie' :
!s.flags.verdict_wordSpoken ? 'word' : 'seal'`
- reveal: ① *"The doors are not locked. They are waiting. Let the Stone speak first."*
  ② *"Everything strange you journaled — the compass, the bird with your voice, 1911 —
  was one fact wearing many masks."* ③ *"You were summoned. The trials were testimony.
  Touch the Speaking Stone and hear the verdict."*
- lie: ① *"The Stone asks first for proof you can tell truth from seeming."* ② *"You
  carry the only lie ever weighed and found out."* ③ *"The hollow pod, on the Stone."*
- word: ① *"The word is already in your journal — the tokens have been spelling it all
  along. The Stone tells you their order."* ② *"As the totem eats: sky, shadow-cat,
  coil, singer, dancer. And the advocate insists on the last word."* ③ *"C-A-N-O-P-Y.
  Canopy."*
- seal: ① *"What remains: the map, and the seal to swear it by."* ② *"Spread your survey
  on the Stone. Wax and ochre knead into a seal — and a dead man's compass makes a fine
  straightedge."* ③ *"Map on the Stone; combine beeswax and ochre if you haven't; paste
  on the map; then walk out."*

**Victory config:** title *"The Verdict"*, heading *"The Court Rules in Your Favor"*.
**Defeat config:** title *"Nightfall"*, heading *"The Court Adjourns"*, retry
*"Appeal the Verdict (this trial, 15:00)"*, restart *"Stand Trial Again (from the
sinkhole)"*.

---

## 4. Difficulty & pacing

| # | Trial | Mechanic | Difficulty | Ceiling min |
|---|------|----------|------------|----------|
| 1 | Sinkhole Nave | negative-evidence tracks | ★☆☆☆☆ | 5 |
| 2 | Ferry Pool | river-crossing logic | ★★☆☆☆ | 6 |
| 3 | Painted Grove | border surgery | ★★★☆☆ | 7 |
| 4 | Totem of Teeth | food-web assembly | ★★★★☆ peak 1 | 9 |
| 5 | Morpho Gallery | symmetry completion | ★★☆☆☆ breather | 6 |
| 6 | Tithe Hall | counterfeit weighing | ★★★★☆ peak 2 | 9 |
| 7 | Verdict Roots | twist + meta rite | ★★★☆☆ | 10 |
| | | | **Total (ceilings)** | **52** |

Estimates are generous ceilings, not medians — the 60:00 clock plus the 15:00 appeal
makes a first-run victory the norm, per series intent. Seven mechanics, none shared with
the prior fourteen. Fairness rules identical to the first two games: exit gates enforce
token collection and required items; wrong answers cost nothing but pride; every clue —
including all eight foreshadows — is journaled and re-readable; the twist's stakes are
stated in Gus's own introduction and earnable mid-game at T5; the T6 tithe re-lays
itself every rite (first rite deterministically VI, for testing); the meta word is
derivable from the journal alone.
