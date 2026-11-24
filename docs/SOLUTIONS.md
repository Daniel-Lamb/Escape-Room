# Escape Room Series — Puzzle Logic & Solutions

Full spoilers. **Generated from the room code** by `npm run docs:solutions`
(`tools/solutions-doc.mjs`) — edit the rooms, not this file. For each room: the
logic (the second hint tier) and the answer (the third tier, which `npm run
lint:rooms` checks against the answer the room's own code accepts). In the duo and
group games each role has its own ladder: one player holds the data, the other the rule.

Every game ends on a meta-puzzle built from the collectibles found along the way; the
order they spell is checked end to end by `npm run walk:rooms`.

---

## 1. The Pilgrim's Road (single-player, 7 rooms)

**1. The Oubliette**

- Count what the verse tells you to count: the crows in the chalk drawing, the rats in the chalk drawing, the chains on the wall. Three counts, three rings, same order. → **Seven crows, four rats, two chains: set the rings to VII, IV, II.**
- Collectible: **R** (7)

**2. The Guard Room**

- (1) The tusked one is the Boar — first watch. The Serpent follows him directly. Now: Falcon comes directly after Stag, and the Wolf can stand neither first nor last. → **Draw the bolts: Boar, Serpent, Wolf, Stag, Falcon.**
- (2) The cabinet back is a false panel, rusted at the seam. You carry a bar of honest iron. → **Click the iron crow in your satchel to hold it, then click the open cabinet.**
- Collectible: **A** (3)

**3. The Chapel**

- Order the bells by each saint's lilies, one to five. And one saint carries a shepherd's crook — the plaque gives him two turns: first AND last. → **Ring: Cuthbert, Edmund, Agnes, Dunstan, Brendan, then Cuthbert again — C, E, A, D, B, C.**
- Collectible: **U** (4)

**4. The Scriptorium**

- (1) You have carried wax since the cell, and fire-makings since the guard room. In your satchel: hold one, click the other. → **Combine the flint & steel with the candle stub to make a lit candle, then use it on the empty sconce by the middle desk.**
- (2) Line 2, word 4 of the Chronicle is 'no' — that's an N. Keep indexing; the five letters spell a direction you could follow. → **NORTH: 'no', 'Old', 'ravens', 'tunnel', 'hall'. Set the chest dials to N-O-R-T-H.**

**5. The Still-Room**

- (1) Low on the jar shelf, a parchment corner sticks out from behind a loose board. Then: hold one half in your satchel and click the other. → **Take the left half from behind the shelf board, combine the two halves, then click the kettle.**
- (2) Poppy three measures, valerian one, honey two. But look at your spoons: what measures exactly one? You have carried it since your cell. Then stir against the engraved sun-arrow, thrice. → **Papaver with the 3-notch spoon, Valeriana with your bent 1-notch spoon, Mel with the 2-notch spoon; stir counter-clockwise 3 times; light the hearth; pump until the FIRST whistle, then draw off.**
- Collectible: **A** (8)

**6. The Great Hall**

- (1) Feed the mastiff the drugged meat. Then the handles: the chapel oil was labeled "for the easing of hinges and of souls." → **Hold the drugged meat and click the dog. Then hold the holy oil and click the Wheel. Then the Wheel will turn.**
- (2) Only handle A moves the innermost ring, and only C moves the outermost. Count what those two rings still need — the middle rings take care of themselves. → **Two pulls of A, one pull of B, two pulls of C — in any order. Keystones up.**
- Collectible: **R** (5)

**7. The Gatehouse**

- (1) Ignore the order you found them in. The plaque gives the true order: "THE FEWEST RAYS SPEAK FIRST." Count each sun's rays and sort. → **3 rays A, 4 rays U, 5 rays R, 6 rays O, 7 rays R, 8 rays A — set the dials to AURORA. The dawn opens the door.**
- (2) The crank fills the socket, but the sheared pawl is the real problem. You have carried a bar of honest iron since the guard room. → **Use the crank handle on the socket, wedge the iron crow through the drum spokes, then crank — three full turns.**

**Collectibles pooled across the game, by number:** A U R O R A — the finale's entry above says how they are read.

---

## 2. Starfall Station (single-player, 7 rooms)

**1. Cryo Bay**

- A reads 4, B reads 7, D reads 2, and the stamped law says A + B = C + D. Solve for the cracked one. → **C = 4 + 7 − 2 = 9. Enter 4-7-9-2.**
- Collectible: **U** (6)

**2. Hydroponics Ring**

- The valves are seized — every tile turns CLOCKWISE only. Plan each tile's final facing before you spin past it; a straight has two useful facings, an elbow four. → **Route the middle row up and over the blocked center: right from the inlet, up at the second column, across the top, down at the far corner, out. Turn each tile until the highlighted flow reaches the return.**
- Collectible: **A** (3)

**3. Med Bay**

- (1) Four digits fluoresce: 2, 0, 8, 5. And a crewman who "never shuts up" about a lost station left his reasoning on his bunk. Find the year on a wall. → **The memorial reads AURORA STATION — LOST 2085. Enter 2085.**
- (2) Take the biogel and keycard, log the shard on the tray, then badge the core door. → **Hold nothing — just click the core access door with the keycard in your rig and shard 3 logged.**
- Collectible: **E** (5)

**4. AI Core**

- (1) Long, thin, magnetic. You pocketed exactly that in the cryo bay, under the impression it was junk. → **Hold the magnet stylus and click the breaker panel.**
- (2) D is poison: if D is up, one of the alarm's two right-hand terms fires no matter what C does. So the door's (C OR D) must be carried by C alone. → **A up, B down, C up, D down.**
- Collectible: **W** (2)

**5. Observation Deck**

- Translate glyph by glyph: triangle-dot is 12. Do the same for yaw and roll, then feed all three to attitude control. → **Pitch 12, yaw 284, roll 0.**
- Collectible: **K** (4)

**6. Reactor Control**

- (1) Metal slug, deep socket, live current. The cryo bay junk drawer already solved this for you. → **Hold the magnet stylus and click the bus panel.**
- (2) Fifty is the trap: 25+15+10 makes it with three cells — forbidden. Only one PAIR reaches fifty. Start there and the rest places itself. → **40+10 to life support, 25 alone to door servos, 15 alone to uplink pre-charge.**
- Collectible: **P** (7)

**7. Pod Bay**

- (1) What did it fail to find? Cross-check your own log: the blank pod, the 212-kilogram scale, the sealed med file, the empty core that "migrated to maintenance chassis 7". Now read your sleeve. → **Look at your hands. Then let Gus talk. The pod was never your door — the bulkhead behind the bay is.**
- (2) Thaw the frozen lines before you power them; power the bus before the gyros can fight the spin; null the tumble before the dish will hold a heading and raise the carrier; get RV-7's answer before you commit; the cell bursts last. → **THERMAL, POWER BUS, ATTITUDE, CARRIER, HANDSHAKE, BURST.**
- (3) The uplink array is through the rear bulkhead — the station's voice. You are going to become a sentence it says. → **Click the opened bulkhead at the back of the bay.**
- (4) Biogel mends the emitter. The capacitor powers it. The word is written in your six shards — the plaque on the console says how to order them: fewest wave-peaks speaks first. The direction is in your suit log, from the observation deck. → **Gel the emitter, seat the capacitor, type WAKEUP, set AZ 117 / EL 43. Then the console wants the cold-start sequence.**

**Collectibles pooled across the game, by number:** W A K E U P — the finale's entry above says how they are read.

---

## 3. The Wild Court (single-player, 7 rooms)

**1. The Sinkhole Nave**

- Sheathed claws and four toes is the cat; three round toes the tapir. And the third trace? Nothing WALKED there. What travels without feet? → **Left jaguar, middle tapir, right boa — the drag-line is a serpent's. The harpy and the monkey never passed this gate at all.**
- Collectible: **N**

**2. The Ferry Pool**

- The bird can never be left beside the kit OR the figs. Take the bird first; when you bring the second charge over, take the bird BACK with you. → **Bird over, return empty, kit over, bird back, figs over, return empty, bird over. Seven crossings.**

**3. The Painted Grove**

- Two laws kill two borders outright: tapir cannot touch tapir (Heights and Scar), and macaw cannot touch jaguar (Fern and River). Raze those crossings. Then make every outer ground count exactly three neighbours. → **Raze both cross-passes (Heights–Scar and River–Fern) and raise all four ring borders. Then judge it.**
- Collectible: **O**

**4. The Totem of Teeth**

- (1) The machete, on the strangler vines. → **Cut drum III free at the totem, then read the reliefs — they are meals, not decorations.**
- (2) Sky ate shadow-cat. Shadow-cat scorns singer and dancer, so its meal was the coil. Coil ate singer; singer ate dancer. → **Top to bottom: harpy, ocelot, boa, tree-frog, mantis.**

**5. The Morpho Gallery**

- Hold the amber lens to the mosaic to wake the left wing. Then mirror it: outer stays outer, top stays top — a reflection, not a copy. → **Top-outer azure teardrop, top-inner gold disc, mid-outer violet oval, mid-inner azure disc, low-outer gold teardrop, low-inner violet disc.**
- Collectible: **C**

**6. The Tithe Hall**

- (1) The snapped cord wants cordage. You have carried some since the pool. → **The vine cord, on the broken pan.**
- (2) Three against three: balance means the lie waits in the two you held back; a tilt means it hides on the LIGHTER side. Then one against one. → **Three against three, then one against one of the lighter group — and if those two balance, it is the third. The Scale never needs a third answer.**
- Collectible: **A**

**7. The Verdict Roots**

- (1) Everything strange you journaled — the compass, the bird with your voice, 1911 — was one fact wearing many masks. → **You were summoned. The trials were testimony. Touch the Speaking Stone and hear the verdict.**
- (2) As the totem eats: sky, shadow-cat, coil, singer, dancer. And the advocate insists on the last word. → **C-A-N-O-P-Y. Canopy.**
- (3) Spread your survey on the Stone. Wax and ochre knead into a seal — and a dead man's compass makes a fine straightedge. → **Map on the Stone; combine beeswax and ochre if you haven't; paste on the map; then walk out.**

**Collectibles pooled across the game** (unnumbered): N, P, O, Y, C, A — the finale's entry above says how they are read.

---

## 4. The Gate of Life (single-player, 7 rooms)

**1. The Carcer**

- Read the verse down the margin: the first letter of each line, top to bottom, five tumblers. → **A-R-E-N-A. And lever the drain with the strigil before you go.**

**2. The Armamentarium**

- The chaser is the crestless one whose only crestless rival is at the smith; his shield he shares with a second pair of hands; his blade is whatever the complaints have not already given away. → **Smooth egg helm, tall scutum, straight gladius. Sound the inspection.**
- Collectible: **M** (1)

**3. The Shrine of Nemesis**

- Fill the five, pour it into the three: what stays behind is two. The rest is bookkeeping. → **Fill V, pour into III (2 left in V), empty III, move the 2 across, refill V, top up III — the V holds exactly IIII. Pour it into the lamp.**
- Collectible: **I** (2)

**4. The Lanista's Tablinum**

- (1) Old tablets get re-waxed, not erased. Shave the wax with something a bathhouse would lend you. → **Hold the strigil and use it on the desk tablet: A-R-E-P-O, the second line.**
- (2) It reads the same four ways: the last row is the first row backward, the fourth is the second backward. → **SATOR / AREPO / TENET / OPERA / ROTAS.**

**5. The Hypogeum**

- (1) Something in your loculus throws light. Hold it, then touch the niche. → **Hold the bronze mirror and use it on the niche: it catches the light-blade and the plan reads clean.**
- (2) Follow the plan exactly, one instruction at a time. The wrong rooms are occupied, but the map remembers where you have been. → **Onward two. Turn right, onward two. Turn left, onward one. Turn right, onward one. The stair is the far corner.**
- Collectible: **O** (6)

**6. The Great Winch**

- (1) The bronze key's square end matches the brake socket; the capstan socket is cut for a bar like the one from the broken capstan below. → **Hold the winch key and use it on the brake; hold the crank handle and use it on the capstan socket.**
- (2) Drum's mark times block's sheaves — exactly XII, no less, no more. Three drums, three blocks, one product lands on twelve. → **Mount the III drum and the four-sheave block: three times four is twelve. Heave.**
- Collectible: **S** (4)

**7. The Porta Sanavivaria**

- (1) Soak the rag in the sacred oil — hold the one, touch the other, in your loculus. The dolabra was made for the bar and the bricks. → **Oiled rag on the hinge, dolabra on the bar, dolabra on the arch. Then read what the alcove holds.**
- (2) Read the programma, the water-clock, and Felix's note. The procession opens the day; the beasts run in the morning; at the sixth hour the condemned die; the pairs are matched in the afternoon — but never before the arms are proved sharp; the Gate of Life is the day's last mercy. → **Procession, beast-hunt, noon killings, arms proved, the pairs, the sparing — POMPA, VENATIO, MERIDIES, PROBATIO, MVNVS, MISSIO.**
- (3) Read Felix's tablet. Take the sword he earned. → **Take the rudis from the alcove, then open the gate — the order is already set.**

**Collectibles pooled across the game, by number:** M I S S I O — the finale's entry above says how they are read.

---

## 5. The Tomb of the Scarab (single-player, 5 rooms)

**1. The Antechamber**

- The figures walk right, toward the door, so those BEHIND the jackal-headed guide are the ones to his left. Count only those: scarabs, then blossoms, then ibis. → **Behind the jackal: 5 scarabs, 3 blossoms, 2 ibis. Set the rings to 5, 3, 2.**

**2. The Hall of the Scales**

- Exactly three stones from 1, 2, 4, 7 and 9 must total 13. Try the 9 first: could two others make up the last 4? → **The 2, the 4 and the 7. (With the 9, the other two would need to be 1 and 3 — there is no 3.)**

**3. The Scribe's Chamber**

- Signs face the start of their line. On the board they face left, so it reads left to right; in the cartouche the owl faces right, so the name starts at the right-hand end. → **Right to left: owl, reed, reed, loaf — M, A, A, T. Speak MAAT.**

**4. The Star Chamber**

- Sah is the three small stars in a tight row. Sopdet is the bright star right beside them — the other bright star stands far off round the ring. Bring HER to the eastern mark. → **From the start, turn the dial three times anticlockwise (↺): Sopdet, beside Sah's three stars, stands under the mark.**

**5. The Burial Chamber**

- Ibis: the Scribe's amulet. Scarab: the Antechamber's. Star: the Star Chamber's. Feather: the Hall of the Scales'. Read their letters in the hollows' order, left to right. → **A (ibis), N (scarab), K (star), H (feather): ANKH. The beads agree — one, two, three, four.**

**Collectibles pooled across the game, by number:** A N K H — the finale's entry above says how they are read.

---

## 6. Twin Signal Towers (two-player, 7 rooms)

Roles: West Tower = P1 · East Tower = P2.

**1. The Watch Room**

- *West Tower:* Read the code on your wall to your partner (it is theirs). Then set your three dials to the code they read back to you. → **Your West hatch is 3 - 7 - 1.**
- *West Tower:* Collectible: **S** (2)
- *East Tower:* Read the code on your wall to your partner (it is theirs). Then set your three dials to the code they read back to you. → **Your East hatch is 5 - 2 - 8.**

**2. The Lamp Room**

- *West Tower:* Get your four reef bearings from your partner, panels 1–4. Your plate says: set each panel to the point opposite its reef (N↔S, E↔W). → **West panels: NE, SE, W, S.**
- *East Tower:* Get your four reef bearings from your partner, panels 1–4. Your plate says: turn each a quarter sunwise from its reef (N→E, E→S, S→W, W→N). → **East panels: E, S, NW, N.**
- *East Tower:* Collectible: **A** (1)

**3. The Signal Gallery**

- *West Tower:* Count each burst: four groups, four letters. Read your four counts aloud; your partner looks each up on their page and reads you the word. Do the same for them. → **Your flashes decode to HOLD.**
- *West Tower:* Collectible: **O** (4)
- *East Tower:* Count each burst: four groups, four letters. Read your four counts aloud; your partner looks each up on their page and reads you the word. Do the same for them. → **Your flashes decode to TURN.**

**4. The Chart Room**

- *West Tower:* You can rule out the rock-fouled channels; ask your partner which of the rest are deep enough. → **The only channel both clear of rock AND deep enough is Channel III.**
- *East Tower:* You can rule out the shallow channels; ask your partner which of the rest are clear of rock. → **The only channel both clear of rock AND deep enough is Channel III.**
- *East Tower:* Collectible: **H** (3)

**5. The Bell Loft**

- *West Tower:* Read your partner the rule on your plate (it is theirs). Ask them the rule on their plate (it is yours), then apply it to YOUR two gauge numbers. → **West rule is "difference": 9 − 4 = toll 5.**
- *West Tower:* Collectible: **E** (6)
- *East Tower:* Read your partner the rule on your plate (it is theirs). Ask them the rule on their plate (it is yours), then apply it to YOUR two gauge numbers. → **East rule is "sum": 5 + 3 = toll 8.**

**6. The Beam Engine**

- *West Tower:* Ask your partner for your five line pressures, in order. Your plate: open the even readings, shut the odd. → **West valves: OPEN, SHUT, OPEN, OPEN, SHUT.**
- *East Tower:* Ask your partner for your five line pressures, in order. Your plate: open any reading above 30 lb, shut the rest. → **East valves: SHUT, OPEN, OPEN, SHUT, OPEN.**
- *East Tower:* Collectible: **R** (5)

**7. The Lantern Crown**

- *West Tower:* Read each other your marks as "needle, letter". Then go round the compass sunwise from north — N, NE, E, SE, S, SW — reading the letter at each point. → **N:A, NE:S, E:H, SE:O, S:R, SW:E — set the wheel to ASHORE.**
- *East Tower:* Read each other your marks as "needle, letter". Then go round the compass sunwise from north — N, NE, E, SE, S, SW — reading the letter at each point. → **N:A, NE:S, E:H, SE:O, S:R, SW:E — set the wheel to ASHORE.**

**Collectibles pooled across the game, by number:** A S H O R E — the finale's entry above says how they are read.

---

## 7. The Looking Glass (two-player, 7 rooms)

Roles: The Waking Side = P1 · The Glass Side = P2.

**1. The Parlour**

- *The Waking Side:* The backwards word on your wall is your PARTNER's. Read it to them; type the word they read from theirs. → **Your door-word is CANDLE.**
- *The Waking Side:* Collectible: **R** (1)
- *The Glass Side:* The backwards word on your wall is your PARTNER's. Read it to them; type the word they read from theirs. → **Your door-word is HEARTH.**

**2. The Library**

- *The Waking Side:* Four marks, four letters. Read your marks aloud; your partner looks each up on their page and reads you the word. Do the same for them. → **Your marks spell MOTH.**
- *The Glass Side:* Four marks, four letters. Read your marks aloud; your partner looks each up on their page and reads you the word. Do the same for them. → **Your marks spell VEIL.**
- *The Glass Side:* Collectible: **E** (2)

**3. The Nursery**

- *The Waking Side:* Their room is your mirror: what stands at your left stands at their right. Have them read you their card 1 to 4, then set it backwards — their 4th is your 1st. → **Waking figures: Owl, Hare, Wren, Fox.**
- *The Waking Side:* Collectible: **V** (3)
- *The Glass Side:* Their room is your mirror: what stands at your left stands at their right. Have them read you their card 1 to 4, then set it backwards — their 4th is your 1st. → **Glass figures: Wren, Owl, Fox, Hare.**

**4. The Clock Room**

- *The Waking Side:* Your clock face shows four digits, backwards, for your partner. When they read you theirs, write the digits in reverse order. → **Your hour is 5271 (the glass clock reads 1725 — reversed).**
- *The Glass Side:* Your clock face shows four digits, backwards, for your partner. When they read you theirs, write the digits in reverse order. → **Your hour is 8064 (the waking clock reads 4608 — reversed).**
- *The Glass Side:* Collectible: **L** (4)

**5. The Portrait Gallery**

- *The Waking Side:* Your half: the sitter holds a black bird — that is two of the five. Ask your partner's half to tell the two apart. → **It is the lady in mourning grey with a raven at her shoulder — choose that portrait.**
- *The Waking Side:* Collectible: **I** (5)
- *The Glass Side:* Your half: the sitter wears mourning grey — that is two of the five. Ask your partner's half to tell the two apart. → **It is the lady in mourning grey with a raven at her shoulder — choose that portrait.**

**6. The Conservatory**

- *The Waking Side:* Ask your partner to read you the gardener's note. Open the taps whose plant wants water; shut the rest. → **Waking taps: OPEN, OPEN, SHUT, OPEN, SHUT (fern, lily, rose run).**
- *The Glass Side:* Ask your partner to read you the gardener's note. Open the taps whose plant wants water; shut the rest. → **Glass taps: SHUT, OPEN, SHUT, OPEN, OPEN (orchid, ivy, fern run).**
- *The Glass Side:* Collectible: **S** (6)

**7. The Mirror Hall**

- *The Waking Side:* Lay all six shards out by number, 1 to 6 — that reads a word. The glass keeps its name backwards, so reverse it. → **In order the shards read R-E-V-L-I-S. Reversed: SILVER. Set the glass to SILVER.**
- *The Glass Side:* Lay all six shards out by number, 1 to 6 — that reads a word. The glass keeps its name backwards, so reverse it. → **In order the shards read R-E-V-L-I-S. Reversed: SILVER. Set the glass to SILVER.**

**Collectibles pooled across the game, by number:** R E V L I S — the finale's entry above says how they are read.

---

## 8. Silent Alarm (two-player, 7 rooms)

Roles: The Hand = P1 · The Eye = P2.

**1. The Service Door**

- *The Hand:* Four digits. Read the code on your screen aloud to your partner; set the four they read back on your keypad. → **Your door code is 5 - 1 - 9 - 3.**
- *The Hand:* Collectible: **2** (2)
- *The Eye:* Four digits. Read the code on your screen aloud to your partner; set the four they read back on your keypad. → **Your uplink code is 8 - 2 - 6 - 0.**

**2. The Camera Room**

- *The Hand:* Ask for your four logged bearings, then turn each a quarter-turn clockwise: N→E, NE→SE, E→S, SE→SW, S→W, SW→NW, W→N, NW→NE. → **Your cameras: SE, W, N, NE.**
- *The Eye:* Ask for your four logged bearings, then turn each a quarter-turn clockwise: N→E, NE→SE, E→S, SE→SW, S→W, SW→NW, W→N, NW→NE. → **Your channels: W, S, E, SW.**
- *The Eye:* Collectible: **7** (1)

**3. The Marble Gallery**

- *The Hand:* Count each burst: flashes, pause, flashes. Four groups, four letters. Your partner's page turns your counts into your word; your page turns theirs into theirs. → **Your word is SAFE.**
- *The Hand:* Collectible: **4** (4)
- *The Eye:* Count each burst: flashes, pause, flashes. Four groups, four letters. Your partner's page turns your counts into your word; your page turns theirs into theirs. → **Your word is DARK.**

**4. The Records Room**

- *The Hand:* You can see which are drilled decoys (I and IV). Ask your partner which the database calls "relocated." → **Box III — the only one on neither list.**
- *The Eye:* You can read which are "relocated" (II and IV). Ask your partner which are drilled decoys. → **Box III — the only one on neither list.**
- *The Eye:* Collectible: **9** (3)

**5. The Clock Hall**

- *The Hand:* Your plate holds the EYE's rule; your gauges hold the HAND's numbers — swap with your partner and apply what they read you. → **Set 6 (7 − 1).**
- *The Hand:* Collectible: **6** (6)
- *The Eye:* Your plate holds the HAND's rule; your readouts hold the EYE's numbers — swap and apply theirs. → **Set 7 (3 + 4).**

**6. The Power Room**

- *The Hand:* Ask for your five loads. Any circuit drawing MORE than 30 A goes DOWN; the rest stay UP — and 30 exactly is not more than 30. → **Your breakers: UP, DOWN, DOWN, UP, UP.**
- *The Eye:* Ask for your five loads. Any circuit drawing MORE than 30 A goes DOWN; the rest stay UP — and 30 exactly is not more than 30. → **Your breakers: DOWN, DOWN, UP, UP, DOWN.**
- *The Eye:* Collectible: **1** (5)

**7. The Vault**

- *The Hand:* Read each other your pins as "position, digit." Lay all six out by position, one first, and read off the six-digit number. Ignore the Client's code. → **The master is 7-2-9-4-1-6.**
- *The Eye:* Read each other your pins as "position, digit." Lay all six out by position, one first, and read off the six-digit number. Ignore the Client's code. → **The master is 7-2-9-4-1-6.**

**Collectibles pooled across the game, by number:** 7 2 9 4 1 6 — the finale's entry above says how they are read.

---

## 9. Deep Six (two-player, 7 rooms)

Roles: The Diver = P1 · The Tender = P2.

**1. The Deck Hatch**

- *The Diver:* Read the three-ring code on your screen to your partner (it is theirs). Then set your rings to the code they read back to you. → **Your deck hatch is 6 - 2 - 9.**
- *The Diver:* Collectible: **A** (5)
- *The Tender:* Read the three-ring code on your screen to your partner (it is theirs). Then set your rings to the code they read back to you. → **Your winch brake is 4 - 1 - 7.**

**2. The Buried Airlock**

- *The Diver:* Your brief: the airlock returns HARD and RINGING. Have your tender read the four contacts and pick the one that is both. Set column, then row. → **C-4 is the only contact that is both hard and ringing. Dig there.**
- *The Tender:* Set the three gain figures your diver reads off the sounder; read them all four contacts — cell, hard/soft, ringing/dull. → **Your sonar gain is 0-8-8.**
- *The Tender:* Collectible: **S** (8)

**3. The Mirrors**

- *The Diver:* Set the three mirror swivels to the angles on your tender's optical plan; read them the corridor bearing in return. → **Your mirrors are 3 - 7 - 4.**
- *The Diver:* Collectible: **C** (11)
- *The Tender:* Swing the lamp to the bearing your diver reads off the wall; read them the three mirror angles from your plan. → **Your lamp bearing is 1 - 9 - 5.**

**4. The Ballast**

- *The Diver:* Read your two gauges (12 and 5) to your tender; their panel says whether to add them or take the difference. Set that. → **Your rule is SUM: 12 + 5 = set 17.**
- *The Tender:* Read your two gauges (13 and 6) to your diver; their side says add or difference. Set that. → **Your rule is GAP: 13 − 6 = set 07.**
- *The Tender:* Collectible: **E** (14)

**5. The Wireless Key**

- *The Diver:* Read your four flash-counts to your partner; they decode with their page and read you the four-letter word. Enter it. → **Your word is TIDE.**
- *The Diver:* Collectible: **N** (17)
- *The Tender:* Read your four flash-counts to your partner; they decode with their page and read you the four-letter word. Enter it. → **Your word is DIVE.**

**6. The Engine Telegraph**

- *The Diver:* Lever A drives pointers 1&2, B drives 2&3, C drives 3&4. The target is 1-2-2-1. Work out how many pulls of each. → **Pull A once, B once, C once — that gives 1-2-2-1.**
- *The Tender:* Set the winch to the two-figure load your diver reads you. → **The winch load is 12.**
- *The Tender:* Collectible: **D** (20)

**7. The Ascent**

- *The Diver:* Lay all six marks in fathom order: 5, 8, 11, 14, 17, 20 — then read their letters straight down. → **5-A, 8-S, 11-C, 14-E, 17-N, 20-D → the word is ASCEND.**
- *The Tender:* Lay all six marks in fathom order: 5, 8, 11, 14, 17, 20 — then read their letters straight down. → **5-A, 8-S, 11-C, 14-E, 17-N, 20-D → the word is ASCEND.**

**Collectibles pooled across the game, by number:** A S C E N D — the finale's entry above says how they are read.

---

## 10. The Vault (4-player, 5 rooms)

Roles: The Cracker = P1 · The Wire = P2 · The Face = P3 · The Wheel = P4.

**1. Getting In**

- *The Cracker:* Read The Wheel nothing; ask them for your rule. Their screen says: "read the figures on your serial plate BACKWARDS". Apply it to your serial plate. → **Your Your Way In code is 3 - 1 - 7.**
- *The Cracker:* Collectible: **4** (1)
- *The Wire:* Read The Cracker nothing; ask them for your rule. Their screen says: "add ONE to every figure on your serial plate (9 turns to 0)". Apply it to your serial plate. → **Your Your Way In code is 5 - 2 - 8.**
- *The Wire:* Collectible: **7** (2)
- *The Face:* Read The Wire nothing; ask them for your rule. Their screen says: "SWAP the first and last figures of your serial plate". Apply it to your serial plate. → **Your Your Way In code is 9 - 4 - 6.**
- *The Wheel:* Read The Face nothing; ask them for your rule. Their screen says: "take ONE from every figure on your serial plate (0 turns to 9)". Apply it to your serial plate. → **Your Your Way In code is 1 - 7 - 5.**

**2. Killing the Alarms**

- *The Cracker:* Read The Wheel nothing; ask them for your rule. Their screen says: "add ONE to every figure on your serial plate (9 turns to 0)". Apply it to your serial plate. → **Your Your Cut-Out code is 4 - 8 - 2.**
- *The Wire:* Read The Cracker nothing; ask them for your rule. Their screen says: "SWAP the first and last figures of your serial plate". Apply it to your serial plate. → **Your Your Cut-Out code is 2 - 0 - 9.**
- *The Face:* Read The Wire nothing; ask them for your rule. Their screen says: "take ONE from every figure on your serial plate (0 turns to 9)". Apply it to your serial plate. → **Your Your Cut-Out code is 6 - 5 - 1.**
- *The Face:* Collectible: **1** (3)
- *The Wheel:* Read The Face nothing; ask them for your rule. Their screen says: "read the figures on your serial plate BACKWARDS". Apply it to your serial plate. → **Your Your Cut-Out code is 7 - 3 - 0.**
- *The Wheel:* Collectible: **9** (4)

**3. The Manager's Office**

- *The Cracker:* Read The Wheel nothing; ask them for your rule. Their screen says: "SWAP the first and last figures of your serial plate". Apply it to your serial plate. → **Your Your Lock code is 8 - 6 - 3.**
- *The Cracker:* Collectible: **3** (5)
- *The Wire:* Read The Cracker nothing; ask them for your rule. Their screen says: "take ONE from every figure on your serial plate (0 turns to 9)". Apply it to your serial plate. → **Your Your Lock code is 1 - 9 - 4.**
- *The Wire:* Collectible: **6** (6)
- *The Face:* Read The Wire nothing; ask them for your rule. Their screen says: "read the figures on your serial plate BACKWARDS". Apply it to your serial plate. → **Your Your Lock code is 5 - 0 - 7.**
- *The Wheel:* Read The Face nothing; ask them for your rule. Their screen says: "add ONE to every figure on your serial plate (9 turns to 0)". Apply it to your serial plate. → **Your Your Lock code is 6 - 2 - 8.**

**4. The Antechamber**

- *The Cracker:* Read The Wheel nothing; ask them for your rule. Their screen says: "take ONE from every figure on your serial plate (0 turns to 9)". Apply it to your serial plate. → **Your Your Gate code is 3 - 5 - 0.**
- *The Wire:* Read The Cracker nothing; ask them for your rule. Their screen says: "read the figures on your serial plate BACKWARDS". Apply it to your serial plate. → **Your Your Gate code is 7 - 1 - 2.**
- *The Face:* Read The Wire nothing; ask them for your rule. Their screen says: "add ONE to every figure on your serial plate (9 turns to 0)". Apply it to your serial plate. → **Your Your Gate code is 4 - 8 - 9.**
- *The Wheel:* Read The Face nothing; ask them for your rule. Their screen says: "SWAP the first and last figures of your serial plate". Apply it to your serial plate. → **Your Your Gate code is 2 - 0 - 5.**

**5. The Vault**

- *The Cracker:* The odd tumblers fall first, low to high, then the even: the chips go #1, #3, #5, then #2, #4, #6. Whoever holds each reads its digit. → **The master combination is 4 - 1 - 3 - 7 - 9 - 6.**
- *The Wire:* The odd tumblers fall first, low to high, then the even: the chips go #1, #3, #5, then #2, #4, #6. Whoever holds each reads its digit. → **The master combination is 4 - 1 - 3 - 7 - 9 - 6.**
- *The Face:* The odd tumblers fall first, low to high, then the even: the chips go #1, #3, #5, then #2, #4, #6. Whoever holds each reads its digit. → **The master combination is 4 - 1 - 3 - 7 - 9 - 6.**
- *The Wheel:* The odd tumblers fall first, low to high, then the even: the chips go #1, #3, #5, then #2, #4, #6. Whoever holds each reads its digit. → **The master combination is 4 - 1 - 3 - 7 - 9 - 6.**

**Collectibles pooled across the game, by number:** 4 7 1 9 3 6 — the finale's entry above says how they are read.

---

## 11. Trial by Jury (4-player, 5 rooms)

Roles: The Heron = P1 · The Gecko = P2 · The Boar = P3 · The Parrot = P4.

**1. The Fig-Tree**

- *The Heron:* Ask The Parrot for the bench's ruling on you: "you have the first and last counts the wrong way round — SWAP them". Apply it to your tally. → **The figure your account needs is 4 - 2 - 8.**
- *The Heron:* Collectible: **C** (1)
- *The Gecko:* Ask The Heron for the bench's ruling on you: "an echo doubled one of each — TAKE ONE from each count (0 turns to 9)". Apply it to your tally. → **The figure your account needs is 1 - 7 - 3.**
- *The Boar:* Ask The Gecko for the bench's ruling on you: "give your tally from the LAST thing you counted back to the first". Apply it to your tally. → **The figure your account needs is 9 - 0 - 5.**
- *The Parrot:* Ask The Boar for the bench's ruling on you: "the dark hid one of every kind — ADD ONE to each count (9 turns to 0)". Apply it to your tally. → **The figure your account needs is 6 - 5 - 1.**

**2. The Truce-Stone**

- *The Heron:* Ask The Parrot for the bench's ruling on you: "an echo doubled one of each — TAKE ONE from each count (0 turns to 9)". Apply it to your tally. → **The figure your account needs is 3 - 8 - 0.**
- *The Gecko:* Ask The Heron for the bench's ruling on you: "give your tally from the LAST thing you counted back to the first". Apply it to your tally. → **The figure your account needs is 7 - 4 - 9.**
- *The Gecko:* Collectible: **R** (2)
- *The Boar:* Ask The Gecko for the bench's ruling on you: "the dark hid one of every kind — ADD ONE to each count (9 turns to 0)". Apply it to your tally. → **The figure your account needs is 2 - 1 - 6.**
- *The Parrot:* Ask The Boar for the bench's ruling on you: "you have the first and last counts the wrong way round — SWAP them". Apply it to your tally. → **The figure your account needs is 5 - 2 - 4.**

**3. The Muddy Bank**

- *The Heron:* Ask The Parrot for the bench's ruling on you: "give your tally from the LAST thing you counted back to the first". Apply it to your tally. → **The figure your account needs is 6 - 1 - 7.**
- *The Gecko:* Ask The Heron for the bench's ruling on you: "the dark hid one of every kind — ADD ONE to each count (9 turns to 0)". Apply it to your tally. → **The figure your account needs is 0 - 9 - 3.**
- *The Boar:* Ask The Gecko for the bench's ruling on you: "you have the first and last counts the wrong way round — SWAP them". Apply it to your tally. → **The figure your account needs is 4 - 5 - 8.**
- *The Boar:* Collectible: **O** (3)
- *The Parrot:* Ask The Boar for the bench's ruling on you: "an echo doubled one of each — TAKE ONE from each count (0 turns to 9)". Apply it to your tally. → **The figure your account needs is 8 - 3 - 2.**

**4. The Broken Bough**

- *The Heron:* Ask The Parrot for the bench's ruling on you: "the dark hid one of every kind — ADD ONE to each count (9 turns to 0)". Apply it to your tally. → **The figure your account needs is 2 - 5 - 4.**
- *The Gecko:* Ask The Heron for the bench's ruling on you: "you have the first and last counts the wrong way round — SWAP them". Apply it to your tally. → **The figure your account needs is 8 - 0 - 6.**
- *The Boar:* Ask The Gecko for the bench's ruling on you: "an echo doubled one of each — TAKE ONE from each count (0 turns to 9)". Apply it to your tally. → **The figure your account needs is 3 - 7 - 1.**
- *The Parrot:* Ask The Boar for the bench's ruling on you: "give your tally from the LAST thing you counted back to the first". Apply it to your tally. → **The figure your account needs is 1 - 4 - 9.**
- *The Parrot:* Collectible: **W** (4)

**5. The Verdict**

- *The Heron:* Read your exhibits around the jury in order — #1, then #2, #3, #4 — to spell the thief. For the liar, recall whose prints were in the mud despite their sworn word. → **The liar is the Gecko. The exhibits spell CROW.**
- *The Gecko:* Read your exhibits around the jury in order — #1, then #2, #3, #4 — to spell the thief. For the liar, recall whose prints were in the mud despite their sworn word. → **The liar is the Gecko. The exhibits spell CROW.**
- *The Boar:* Read your exhibits around the jury in order — #1, then #2, #3, #4 — to spell the thief. For the liar, recall whose prints were in the mud despite their sworn word. → **The liar is the Gecko. The exhibits spell CROW.**
- *The Parrot:* Read your exhibits around the jury in order — #1, then #2, #3, #4 — to spell the thief. For the liar, recall whose prints were in the mud despite their sworn word. → **The liar is the Gecko. The exhibits spell CROW.**

**Collectibles pooled across the game, by number:** C R O W — the finale's entry above says how they are read.
