# The Pilgrim's Road
### A browser escape room — escape Vayne Keep before dawn

**Logline:** A falsely condemned mapmaker has until first light to trace a dead monk's secret trail of carved suns through seven rooms of a medieval castle — out of the oubliette, up through the keep, and down the forgotten pilgrim's road beneath the moat.

---

## 1. Story

**Setup.** You are **Aldric of Marden**, a journeyman cartographer arrested for "spying" because you sketched the walls of Vayne Keep. At dusk you are thrown into the oubliette; at dawn you hang. Scratched into your cell wall you find the verses of **Brother Edmund**, a monk imprisoned here forty years ago — and beside them a small carved sun with a letter beneath it, and the words *"Mark each sun along the road."* Edmund found a way out. A mapmaker's eye can find it again. A 60-minute in-game countdown to dawn starts as the intro text finishes.

**Midpoint beat (end of Room 4, the Scriptorium).** Deciphering Edmund's book cipher opens his chest — and inside, beneath the key and the torn recipe, lies his unsent confession: Edmund was no criminal. He was the old castellan's brother, who smuggled condemned prisoners out along a hidden "pilgrim's road" — a tunnel beneath the moat (the Chronicle's own line 7: *"Beneath, a tunnel ran to the mere, sealed now with iron"*). When he was discovered, he was thrown into the same oubliette you woke in. He carved the suns for "whoever follows." From here on, you are not just escaping — you are finishing Edmund's road, and carrying his confession out with you.

**Ending (Room 7, the Gatehouse).** The six suns, ordered by their rays, spell the name of the thing you are racing: **AURORA** — the dawn. The sally-port bar lifts, the water-gate winch turns, and you slip into the black water of the mere as the sky turns grey. Epilogue text over the final scene: you surface on the far bank in the first true light, Edmund's confession dry inside your shirt. The dawn that was meant to kill you is the word that set you free. (If the timer expires instead: torchlight fills the room, the game shows time of capture and offers instant retry of the current room with all prior progress kept.)

---

## 2. Global systems

- **Timer:** 60:00 in-game countdown, always visible as a burning candle-clock in the HUD (wax level = time left). Wrong puzzle inputs never cost time; only hints do.
- **Hints:** every puzzle has 3 tiers — **Nudge (−1:00)**, **Strong hint (−2:00)**, **Near-solution (−4:00)**. Tiers must be taken in order. Costs deducted from the dawn timer.
- **Inventory:** bottom tray; items fly from scene to tray with spring easing. Drag item onto item to **combine**; drag item onto scene hotspot to **use**.
- **Pilgrim's Journal:** auto-logs every examined clue verbatim (verses, roster, recipe, chronicle page) and auto-sketches every sun-mark the moment its room's puzzle element is examined. Each sun-mark sits **on or beside a mandatory puzzle object**, so it cannot be missed — no pixel-hunting, no memory tax. Rooms also remain revisitable via a map screen.
- **No lockouts:** every puzzle state is resettable or (Room 6) mathematically always solvable. Wrong answers give a diegetic "clunk/hiss/discord" and reset.
- **Tech:** vanilla JS ES modules, static site (GitHub Pages). Scenes are layered hand-authored SVG (layer order: stone architecture → furniture/props → hotspot outlines → torch glow radial-gradient layer with 3–6 Hz flicker → ember particle layer). Bell tones and ambient drones via Web Audio oscillators (no assets). Palette: near-black blues `#0b1020`, stone greys `#2a2f3a`, torch ambers `#e8973a`/`#ffcf7a`, blood-red accents `#7a1f2b`. Room crossfades 600 ms; modals open with spring easing; narrative uses typewriter text.

### Item master list

| Item | Found | Used |
|---|---|---|
| Tallow candle stub | R1 | + flint & steel → **lit candle** (R4 reading, R5 hearth) |
| Bent dose-spoon (one notch) | R1 | R5 — the missing 1-measure spoon |
| Iron crow (pry bar) | R2 | R2→R3 barred door; R7 winch pawl |
| Flint & steel | R2 | combine with candle; light R5 hearth |
| Silver key | R3 | opens Scriptorium |
| Vial of holy oil | R3 | frees R6 crest-wheel gears |
| Still-room key (brass, pestle stamp) | R4 | opens Still-Room |
| Torn recipe, right half | R4 | + left half (R5) → full recipe |
| Sleeping draught | R5 (brewed) | + dried meat → **drugged meat** |
| Dried meat shank | R5 | drug the mastiff (R6) |
| Gatehouse crank handle | R6 | R7 water-gate winch |
| Edmund's confession | R4 | story item; carried to the end |

Red herrings are deliberately minimal and fair: the hemlock jar (explicitly labeled and warned against twice), the main-gate winch in R7 (audibly signposted as watched), and the bent spoon — which *looks* like junk and turns out to be essential (an anti-herring payoff).

---

## 3. The seven rooms

---

### ROOM 1 — The Oubliette (≈5 min, tutorial difficulty)

**Mechanic family: combination-from-observation (counting).**

**Visual (SVG):** A round stone pit lit by one guttering torch high above. Curved wall of rough ashlar blocks, straw floor, two rusted wall chains with empty shackles, a wooden bread board with a gnawed loaf. Three scratched murals on the wall (chalk-white strokes on dark stone): a gallows tree crowded with crows; rats ringing a loaf; a kneeling monk. Low in the shadow, an iron **drain grate** with three rotating numeral rings. Beside the grate: a carved seven-rayed sun with the letter **R**. Ember particles drift up past the torch.

**Items found:** tallow candle stub (in the straw, clearly glinting), bent dose-spoon (on the bread board — examine: *"a worn dose-spoon, its bowl marked with a single notch"*).

**Puzzle: Edmund's Verse Grate.** The grate has three brass rings, each engraved I–IX. Carved above it:

> *"Count the crows upon the gallows-tree,*
> *count the rats that share my bread,*
> *count the chains that held me to this stone —*
> *turn them so, and follow where I fled.*
> *Mark each sun along the road. — E."*

**Exact clues in scene:**
- Gallows mural: exactly **7** distinctly outlined crows (each is a hotspot; examining shows "seven crows" so counting is verifiable).
- Rat mural: exactly **4** rats around the loaf (examine: "four rats").
- The chains: **2** physical chain sets on the wall (examine: "two chains, two empty shackles").
- Sun-mark #1: **seven rays, letter R** (auto-journaled on examine).

**Solution:** rings set to **VII – IV – II**.

**Deduction chain:** (1) The verse names three countable things in a fixed order: crows, rats, chains. (2) The grate has exactly three rings, so verse order = ring order. (3) The murals/objects give unambiguous counts 7, 4, 2, each confirmed in examine text. (4) VII-IV-II is therefore forced; no other reading exists. The grate clanks open.

**Hints:** ① *"Edmund's verse is a list. The grate has three rings. Lists have an order."* ② *"Count what the verse tells you to count: the crows in the drawing, the rats in the drawing, the chains on the wall."* ③ *"Seven crows, four rats, two chains: set VII, IV, II."*

**Connects to next:** The drain crawlway rises through a dry cistern shaft; a rotted hatch opens upward into the corner of the guard room (crossfade + typewriter interstitial).

---

### ROOM 2 — The Guard Room (≈7 min)

**Mechanic family: constraint logic / ordering.**

**Visual (SVG):** Low timbered room, brazier glow. A trestle table with dice, cups, and an unfinished letter. A slate tally board by the door. A wall-mounted **duty roster** parchment. Words knife-carved into the tabletop. On the far wall, the armory cabinet sealed by **five sliding bolts**, each stamped with a beast: **Boar, Stag, Wolf, Falcon, Serpent**. Above the bolt rack, scratched small: a **three-rayed sun with the letter A** (sun-mark #2). A barred undercroft door in the north wall.

**Items found:** iron crow (leaning by the brazier), flint & steel (on the table). Combining flint & steel + candle stub → **lit candle**.

**Puzzle: The Watch-Order Bolts.** The five bolts must be drawn in the order the five companies stand watch. Wrong order at any point: all bolts spring back (no penalty).

**Exact clues in scene:**
1. **Roster header:** *"Five companies, five watches: Dusk, Evensong, Dead of Night, Cock-crow, Dawn. Bolts drawn as the watches pass."* And below: *"The Wolf stands neither the first watch nor the last."*
2. **Tally board:** *"First watch to the company of the tusked."*
3. **Table carving:** *"The Serpent slithers in the moment the Boar lies down"* (examine text clarifies: *the Serpent's watch comes directly after the Boar's*).
4. **Unfinished letter,** signed *"Osric, of the Falcon"*: *"…my watch falls directly after the Stag's men come in, and I thank God I need not stand the Dead of Night…"* (a consistent, confirming constraint).

**Solution:** slide bolts in order **Boar → Serpent → Wolf → Stag → Falcon**.

**Deduction chain:** (1) Tusked = Boar (the boar stamp shows tusks) → Boar = 1st. (2) Serpent directly after Boar → Serpent = 2nd. (3) Remaining watches 3–5 for Wolf, Stag, Falcon; Falcon is directly after Stag, so Stag/Falcon occupy (3,4) or (4,5). (4) If (3,4), Wolf takes 5th — forbidden ("neither first nor last"). So Stag = 4, Falcon = 5, Wolf = 3. Unique. Osric's letter cross-checks: Falcon (5th, Dawn) indeed avoids Dead of Night (3rd) — the Falcon literally greets the dawn, a thematic wink.

**Hints:** ① *"Four clues name five companies: roster, tally board, tabletop, letter. Whose watch is pinned down absolutely?"* ② *"Boar is first, Serpent second. Now: Stag and Falcon must be adjacent, and Wolf can't be last."* ③ *"Boar, Serpent, Wolf, Stag, Falcon."*

Inside the cabinet: nothing but empty weapon pegs and a draft of cold air from the undercroft door — the guards took every blade to the walls (story beat: the garrison expects trouble at dawn).

**Connects to next:** The undercroft door is barred by a rusted stile; **use iron crow** to pry it. Stone stairs descend to the chapel undercroft, then up into the chapel.

---

### ROOM 3 — The Chapel (≈8 min)

**Mechanic family: sequence / music.**

**Visual (SVG):** Narrow chapel, moon-blue light through a five-panel **stained-glass window**; votive candles; a lectern with a psalter; below the altar, a locked bronze **reliquary**. A wooden frame holds **five hand bells** on rope pulls, each cast with a saint's name and a single tone letter: **Cuthbert (C), Edmund (E), Agnes (A), Dunstan (D), Brendan (B)** (examine text: *"the old monks cast each bell with the note it sings"*). On the crypt-stair arch: a **four-rayed sun with the letter U** (sun-mark #3).

**Items found:** none until solved.

**Puzzle: The Lily Carillon.** Ring the bells in the right sequence; each pull sounds a real tone (Web Audio: C4, E4, A4, D4, B3). A wrong ring produces a flat discord and resets the sequence (no penalty).

**Exact clues in scene:**
- **Stained glass:** five saints, each named on a scroll banner in the glass, each holding lilies — **Cuthbert 1 lily, Edmund 2, Agnes 3, Dunstan 4, Brendan 5**. Cuthbert alone also holds a **shepherd's crook**. Every lily and the crook are distinct, examinable shapes; examine text states the counts.
- **Brass plaque beneath the window:** *"SING AS THE LILIES BLOOM; LET THE SHEPHERD SING FIRST AND LAST."*

**Solution:** ring **C, E, A, D, B, C** (six rings — Cuthbert, Edmund, Agnes, Dunstan, Brendan, Cuthbert).

**Deduction chain:** (1) Plaque rule 1: order of increasing lilies → Cuthbert(1), Edmund(2), Agnes(3), Dunstan(4), Brendan(5). (2) Plaque rule 2: the shepherd rings first *and last*; the window shows only Cuthbert with a crook. (3) Cuthbert is already first by lily count, so the only change is appending him again at the end: C-E-A-D-B-C. Unique; the final octave-feel resolution is the audible "aha." The reliquary clicks open.

**Hints:** ① *"The window is the hymn sheet. What differs between the five saints?"* ② *"Order the bells by each saint's lilies. One saint carries a crook — the plaque gives him two turns."* ③ *"Cuthbert, Edmund, Agnes, Dunstan, Brendan, Cuthbert — C E A D B C."*

**Reliquary contents:** **silver key** (tag: *"Scriptorium"*) and **vial of holy oil** (*"for the easing of hinges and of souls"*).

**Connects to next:** The silver key unlocks the scriptorium door across the cloister garth (interstitial: you cross open ground under a paling sky — first time-pressure story beat).

---

### ROOM 4 — The Scriptorium (≈10 min, hardest single room)

**Mechanic family: book / text cipher.** Gated by the **lit candle** — the room is unlit, and the chronicle's script is unreadable until the candle is used on the desk sconce (fair: examine text says *"too dark to read the small hand"*).

**Visual (SVG):** Sloped writing desks, ink horns, a raven-quill pen case, one high shelf of six massive tomes, and Brother Edmund's iron-banded **chest** with five brass **letter dials**. Candlelight pool animates across the vellum when the candle is placed.

**Items found:** cipher strip (in the pen case), Edmund's chest contents after solving.

**Puzzle: The Chronicle Cipher.**

**Exact clues in scene:**
- **Cipher strip** (in the pen case): *"2:4 · 5:1 · 1:6 · 7:3 · 3:2 — line, then word; the first letter of each is the way."* Below, a small sketch of a **comet above a tower**, and the initial *"E."*
- **The shelf:** six tomes with spine emblems (ship, grail, boar, comet-and-tower, harp, wheel). Only the comet-and-tower tome — *A Chronicle of the House of Vayne* — opens; the rest are damp-rotted (*"the pages have swollen into a single brick"* — explicit, fair dead ends).
- **The chronicle page**, eight lines, numbered in red chapter numerals (numbering is diegetic and visible):

> 1. In the year of the ravens, Aldwin raised these walls.
> 2. Seven long winters no stone was spared for the keep.
> 3. His hall he filled with song and silver.
> 4. Then came the pestilence, and the bells fell silent.
> 5. Old grudges gathered like storm-crows about the towers.
> 6. Brother fought brother upon the frozen moat.
> 7. Beneath, a tunnel ran to the mere, sealed now with iron.
> 8. Pray, stranger, that dawn finds you far from Vayne.

- **Sun-mark #4 is embedded in the puzzle itself:** the illuminated capital **O** of line 5 ("Old grudges…") is painted as a golden **six-rayed sun** — unmissable, auto-journaled when the page is read.

**Solution:** 2:4 = "no" → **N**; 5:1 = "Old" → **O**; 1:6 = "ravens" → **R**; 7:3 = "tunnel" → **T**; 3:2 = "hall" → **H**. Chest dials: **N-O-R-T-H**.

**Deduction chain:** (1) The strip's emblem sketch matches exactly one openable book — the Chronicle. (2) The strip states the scheme outright ("line, then word; first letter"), so the work is careful indexing, not scheme-guessing. (3) Each index resolves to exactly one word (lines are short; red numerals remove line-count ambiguity; punctuation never splits a word). (4) NORTH is a real word — self-confirming before the dials are even touched — and it is *true*: the sally port lies in the north wall, which the game confirms later for a delayed second "aha."

**Hints:** ① *"The strip tells you everything: a book marked by a comet and a tower, and pairs that mean line-then-word."* ② *"Line 2, word 4 is 'no' — that's an N. Keep counting; the five letters make a word you could follow."* ③ *"NORTH: 'no', 'Old', 'ravens', 'tunnel', 'hall'."*

**Chest contents:** **still-room key** (brass, pestle stamp), **torn recipe — right half**, and **Edmund's confession** (midpoint story beat plays as typewriter text; line 7's tunnel is now your explicit goal).

**Connects to next:** The brass key opens a stair door behind the desks, descending to the still-room beneath the kitchens.

---

### ROOM 5 — The Still-Room (≈9 min)

**Mechanic family: mixing / recipe (with identification sub-logic).**

**Visual (SVG):** Vaulted cellar; copper kettle on a cold hearth with bellows; shelf of labeled clay jars — **Papaver, Valeriana, Mel, Cicuta, Artemisia, Urtica, Mandragora**; a painted **herbal chart** on the wall; a rack with **two dosing spoons** (two-notch and three-notch — the one-notch hook is empty); a **dried meat shank** on a ceiling hook; the corner of a parchment sticking out from behind a loose shelf board (clickable, clearly rendered). Branded into the mantel beam: an **eight-rayed sun with the letter A** (sun-mark #5) — directly above the mandatory hearth.

**Items found:** torn recipe — left half (behind the shelf board); dried meat shank; the brewed **sleeping draught**.

**Puzzle: The Draught of Deep Sleep.** Combine recipe halves in inventory to read:

> *"A DRAUGHT OF DEEP SLEEP.*
> *Three measures of the flower that guards dreams;*
> *one measure of the root that reeks of old boots;*
> *two measures of the bees' gold.*
> *Stir thrice widdershins; then fire beneath, until the kettle sings once — no more.*
> *Touch not the hemlock: that sleep has no waking."*

**Exact supporting clues:**
- **Herbal chart** (pictures + plain glosses, so no Latin knowledge needed): *"Papaver — the dreaming flower. Valeriana — a root, foul as old boots. Mel — the bees' gold. Cicuta — hemlock, DEATH. Artemisia — wormwood, bitter. Urtica — nettle. Mandragora — screams when pulled."* Margin note: *"Widdershins: against the sun."* The kettle's stir dial is engraved with a **sun arrow pointing clockwise** — so widdershins = counter-clockwise, fully defined in-game.
- **Spoons:** doses are fixed per spoon (notches = measures). The one-notch spoon is missing from the rack — it is the **bent spoon from Room 1** (its single notch was called out in its examine text).

**Solution (exact):** Papaver ×3 measures (one 3-notch scoop, or three 1-notch scoops), Valeriana ×1 (the bent one-notch spoon — the 2- and 3-notch spoons refuse: "too much"), Mel ×2 (one 2-notch scoop) → stir counter-clockwise exactly 3 clicks → light hearth (flint & steel) → pump bellows until the first whistle, then stop. Any error: the mix hisses black and pours away; jars are plentiful, no penalty.

**Deduction chain:** (1) Recipe riddles → chart glosses → jar labels is a closed three-link chain with exactly one jar per riddle. (2) Quantities are explicit; the spoon-notch system makes them enforceable, and the missing one-notch spoon is provably the Room 1 spoon (matching notch description). (3) "Widdershins" is defined on the chart and disambiguated by the engraved sun arrow. (4) "Sings once — no more" maps to the single-whistle stop. Every step is forced. Combine draught + meat shank → **drugged meat**.

**Hints:** ① *"Riddle names, chart glosses, jar labels — three lists that join into one."* ② *"Poppy three, valerian one, honey two. But look at your spoons: what measures 'one'? You've carried it since your cell."* ③ *"3-scoop Papaver, bent-spoon Valeriana, 2-scoop Mel; stir counter-clockwise 3 times; heat to the first whistle."*

**Connects to next:** The cellar stair rises into the Great Hall; a low growl is heard before the crossfade.

---

### ROOM 6 — The Great Hall (≈9 min)

**Mechanic family: mechanical / spatial (coupled-gear alignment).**

**Visual (SVG):** Vast hall, twin hearths banked to coals, moonlight through tall windows (the sky visibly lightening — time-pressure beat). A sleeping-but-alert **mastiff** chained near the dais tapestry. Above the dais, the **Wheel of Vayne**: four concentric marble rings, each carrying four quarter-fragments of heraldic charges, turned by three bronze handles **A, B, C** below. A faded **fresco** on the gallery wall shows the true arms. Beneath the wheel, inlaid in the flagstones: a brass **five-rayed sun with the letter R** (sun-mark #6). Behind the wheel's tapestry: the hidden stair.

**Items found:** gatehouse **crank handle** (revealed in the alcove behind the tapestry after solving).

**Puzzle: The Wheel of Vayne.** Two sub-steps.

*Sub-step 1 — the dog and the grease.* Approaching the dais wakes the mastiff (blocking, not lethal). **Use drugged meat** → the dog eats and sleeps. The handles are then found rust-seized (*"the gears are furred with rust"*): **use holy oil** → the wheel turns freely. (Both items were foreshadowed with explicit purpose text at pickup.)

*Sub-step 2 — the coupled rings.* 
- **Fresco reference:** the arms quarterly — top-left **tower**, top-right **raven**, bottom-left **key**, bottom-right **comet**, with the charges also pictured beside the words *TURRIS · CORVUS · CLAVIS · STELLA* (pictures carry the meaning; the Latin is decoration).
- **Plaque on the wheel:** *"NO HAND TURNS ONE WHEEL ALONE."*
- **Mechanism (exact):** each handle pull rotates two adjacent rings +90° clockwise, and pulls cannot be reversed: **A → rings 1+2; B → rings 2+3; C → rings 3+4.** Start state: ring 1 needs **2** quarter-turns to align, ring 2 needs **3**, ring 3 needs **3**, ring 4 needs **2** (the misalignment is visually obvious — charge fragments jut into wrong quadrants).

**Solution:** **A ×2, B ×1, C ×2** — in any order (pulls commute), minimum five pulls. Rings align; each quadrant assembles its charge matching the fresco; the tapestry door grinds open.

**Deduction chain:** (1) Experimentation is safe and reveals the couplings in three pulls (each handle visibly moves exactly two rings). (2) Ring 1 is moved *only* by A → A must be pulled exactly 2 (mod 4). (3) Ring 4 is moved only by C → C = 2. (4) Ring 2 = A + B → B = 3 − 2 = 1. (5) Check ring 3: B + C = 1 + 2 = 3 ✓. The solution is forced by the two "end" rings — a clean pincer deduction. **Design invariant:** any sequence of pulls preserves the alternating-sum condition (n1 − n2 + n3 − n4 ≡ 0 mod 4), so the puzzle is *always* solvable from any state the player can reach — experimentation can never brick it.

**Hints:** ① *"Pull each handle once and just watch. Which rings answer to which handle?"* ② *"Only handle A moves the innermost ring, and only C moves the outermost. Count what those two rings still need — the middle takes care of itself."* ③ *"Two pulls of A, one of B, two of C — any order."*

**Connects to next:** The hidden stair behind the tapestry corkscrews down into the gatehouse winch room. The crank handle hangs on a peg in the stair alcove with a chalk note in Edmund's hand: *"You will want this. — E."*

---

### ROOM 7 — The Gatehouse: The Pilgrim's Gate (≈10 min, META)

**Mechanic family: meta-synthesis (cross-room clue reassembly) + mechanical finisher.**

**Visual (SVG):** Winch chamber: the great portcullis windlass and chains at center (boots and voices audible through the murder-holes above — examine: *"the main gate is watched; raising it means death"* — the signposted, fair wrong path). In the **north** wall: a low stone door under a carved sun relief, ringed by **six brass letter dials (A–Z)**. Chiseled plaque:

> *"SIX SUNS LIGHT THE PILGRIM'S ROAD.*
> *THE FEWEST RAYS SPEAK FIRST."*

**The meta puzzle: The Six Suns.** It reuses, exactly, these earlier-room clues (all auto-sketched in the Pilgrim's Journal with their ray-counts and letters):

| Sun-mark | Room | Placement | Rays | Letter |
|---|---|---|---|---|
| #1 | R1 Oubliette | beside the drain grate | 7 | R |
| #2 | R2 Guard Room | above the bolt rack | 3 | A |
| #3 | R3 Chapel | crypt-stair arch | 4 | U |
| #4 | R4 Scriptorium | illuminated capital "O", line 5 | 6 | O |
| #5 | R5 Still-Room | branded on the hearth mantel | 8 | A |
| #6 | R6 Great Hall | floor mosaic under the wheel | 5 | R |

In room order the letters read **R-A-U-O-A-R** — meaningless, so simply recalling the trail is not enough; the plaque's rule must be applied. It also reuses: the Room 1 verse's standing instruction *"mark each sun along the road"* (which taught the player to care); Chronicle line 7 (*the tunnel to the mere* — this door is that tunnel); and the Room 4 password **NORTH** (the door is in the north wall — the game notes it: *"North, just as Edmund spelled it"* — the delayed payoff).

**Solution:** sort by ray count ascending — 3:**A**, 4:**U**, 5:**R**, 6:**O**, 7:**R**, 8:**A** → dials set to **A-U-R-O-R-A**. The word is the dawn itself: the final thematic "aha," discovered rather than required (no outside knowledge needed — the ordering rule alone produces it; recognizing the meaning is pure reward). The bar lifts.

**Deduction chain:** (1) Six dials + plaque's "six suns" → the six journaled marks are the alphabet of the answer. (2) "Fewest rays speak first" is an explicit, single-valued sorting rule; ray counts 3–8 are all distinct, so the ordering is total and unique. (3) Mapping sorted marks to dials left-to-right is forced by convention established on the Room 4 chest (dials read left to right there, too). One answer exists.

**Mechanical finisher (sub-step):** beyond the door, a brick tunnel ends at a **water-gate grate** into the mere. A small winch has an empty square socket and a snapped ratchet pawl (examine: *"the pawl is sheared — the drum will not hold"*). **Insert crank handle** into the socket; **wedge the iron crow** through the drum spokes as a pawl (the game hints physically: the crow's flat tongue matches the pawl slot). Crank three full turns — the grate rises, black water glimmers, dawn-grey light leaks down the shaft. You dive. Ending plays.

**Hints (meta):** ① *"Your journal has been keeping count for you. Six dials, six suns."* ② *"Ignore the order you found them in. The plaque tells you the true order: count each sun's rays."* ③ *"3-A, 4-U, 5-R, 6-O, 7-R, 8-A: AURORA — the dawn opens the door."*
**Hints (winch):** ① *"The drum spins back — something must hold it."* ② *"You've carried a bar of iron since the guard room."* ③ *"Crank in the socket, iron crow through the spokes, three turns."*

---

## 4. Difficulty curve & pacing notes

| # | Room | Mechanic family | Difficulty | Est. minutes |
|---|---|---|---|---|
| 1 | Oubliette | counting → combination | ★☆☆☆☆ tutorial | 5 |
| 2 | Guard Room | constraint logic / ordering | ★★☆☆☆ | 7 |
| 3 | Chapel | sequence / music | ★★★☆☆ | 8 |
| 4 | Scriptorium | book / text cipher | ★★★★☆ peak 1 | 10 |
| 5 | Still-Room | mixing / recipe | ★★★☆☆ breather-with-teeth | 9 |
| 6 | Great Hall | mechanical / spatial | ★★★★☆ peak 2 | 9 |
| 7 | Gatehouse | meta-synthesis + mechanical | ★★★☆☆ (feels easy *if* journal used — earned mastery) | 10 |
| | | | **Total** | **58** (+~2 min interstitials ≈ 60) |

- **Seven distinct mechanic families** (requirement: ≥5): counting-combination, constraint ordering, music sequence, book cipher, recipe mixing, coupled-gear spatial, meta-sort cipher. No two rooms share a core verb.
- **Shape:** gentle on-ramp (R1 teaches examine/journal/inventory in one forced loop), twin difficulty peaks at R4 and R6 separated by the more procedural R5, then R7 converts accumulated diligence into speed — the meta *feels* like a victory lap precisely because the journal did the collecting, which is the intended emotional design: the last "aha" (AURORA = dawn) lands on theme, not on grind.
- **Calibration levers (tune in playtest):** R4 is the intended hint-spender; if median players stall >12 min, surface Nudge ① automatically for free at 12 min in that room only. R6's couplings can be made discoverable faster by animating gear-teeth glints on first pull.
- **Fairness guarantees:** every count/label is confirmed in examine text (no pixel counting); all cipher schemes are stated diegetically; wrong inputs cost nothing but time spent; R6 is provably unbrickable; all sun-marks sit on mandatory puzzle objects and auto-journal; the only "traps" (hemlock, main gate) are labeled as such before they can be triggered.