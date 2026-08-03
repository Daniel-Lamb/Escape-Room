# Silent Alarm — Design Document

### A two-player asymmetric co-op heist — steal the Larkspur Nightingale before the dawn shift, and don't trip the alarm that's listening

**Logline:** One thief is inside the Larkspur Museum with their hands on the locks; the
other is in a van across the street with the stolen schematics, the camera feeds, and the
building's whole nervous system on a green screen. Neither of you can see what the other
sees — and every code, bearing, and combination you need is on your partner's screen. You
have one hour until the six-o'clock guard change. The silent alarm never makes a sound; the
first you'd hear of it is the door locking behind you.

**Folder:** `silent-alarm/` · **Series slot:** Room VII (third duo) · Neon-noir heist ·
**Save keys:** `silent-alarm-p1-save-v1` (The Hand), `silent-alarm-p2-save-v1` (The Eye) —
namespaced by role.

---

## 1. The two-player model (the defining feature)

**No hosting, no networking.** After the title screen the player chooses a role: **The Hand
= Player 1** (inside the museum) or **The Eye = Player 2** (the van / overwatch). The choice
is stored in `localStorage['silent-alarm-role']`; every room module renders a different
variant of each scene depending on the role (`js/role.js` → `getRole()`). Two people play on
two devices (or two browser tabs) and **talk to each other** the whole time. The game never
sends data between the two instances; the co-op is enforced *by design*:

- **Two worlds, one location.** In every scene The Hand sees the *physical* room (marble,
  spotlights, red laser lines, brass locks) and The Eye sees the *same location as data* (the
  van cabin and a wall of green console monitors — schematics, camera matrix, database, the
  Client's chat feed). Each screen shows what the other's cannot.
- **Mutual dependency every scene.** Each role has its own lock. The information that opens
  The Hand's lock is only ever shown on The Eye's screen, and vice versa. You physically
  cannot solve your side without your partner reading you what they see.
- **Both players are always active.** No "one plays, one narrates." Each has a mechanism to
  operate on their own screen in every scene.
- **Independent progression, natural lockstep.** Each instance advances when *its* player
  solves *their* lock. Because neither lock is solvable alone, the two stay in sync without
  any shared state.
- **The finale needs both job files.** The six collectible vault-pins are split three and
  three; the master combination can only be assembled by reading all six aloud and ordering
  them together.

Save is namespaced per role so both roles can be played/tested on one machine without
collision. `hintContext` is role-prefixed for the same reason.

---

## 2. Story

**Setup.** A wet midnight in the museum district. The **Larkspur Museum of Art &
Antiquities** holds the **Larkspur Nightingale** — a jewelled clockwork bird, the only one of
its kind, and worth more than the building around it. A crew of two has one hour to take it:
**The Hand** goes in through the service dock and works down through the galleries to the
vault; **The Eye** sits in a van across the street with the building's whole security system
mirrored on a green console. The job was set up by a fixer known only as **the Client**, a
voice that feeds instructions to The Eye's screen. The building's real defence is not the
guards — it's the **silent alarm**, which if tripped locks every door and calls the precinct
without a sound. You have **60 minutes** until the 06:00 shift change. Work down through the
seven rooms, trade what only the other can see, and be gone before dawn.

**The twist (foreshadowed across the job, revealed at the Power Room).** The Client's
instructions never quite add up — *don't open the inner case, leave the ledger, ignore
anything else you see, take the key but not the evidence.* In the Power Room, **Gus** — the
museum rat who has run these walls for years and chewed behind every panel — finds a hidden
trip wired straight to the Client's own line. The Client means to trip the silent alarm the
instant the vault opens, framing the two of you and walking off with the Nightingale by a
separate door while you're locked inside. The heist is a set-up. This is not a rug-pull for
shock — it's the point: the whole game you have trusted a partner you can't see over a
building full of things telling you what to do. At the vault, the Client's voice demands one
code; your partner's three pins and your own three spell a different one. You choose each
other.

**Ending.** The vault opens on the master the pins spell, the silent alarm stays silent, the
Client's trip fires into a dead circuit Gus already gnawed through, and the Nightingale goes
into the bag. You leave by the duct route Gus mapped, not the door the Client left open.
Victory screen: **CLEAN GETAWAY.**

**Defeat (00:00).** The dawn shift comes on, or the alarm finally finds its voice. Every door
in the building locks at once. Retry the current room (15:00) with progress kept, or start
the night over. Defeat screen: **CAUGHT.**

---

## 3. Gus's skin — the museum rat

- **Name / epithet:** `Gus` — *"Gus — the museum rat who's cased every duct and wire in this
  building, and likes you two better than the men who own it."*
- **Form:** `rat` — a sleek dark rat with a pale belly, bright quick eye, long tail and a
  chewed ear; he lives in the walls, moves between the front-of-house The Hand walks and the
  service guts The Eye reads on the schematic, and he is the diegetic reason the crew has any
  blueprints at all (he mapped the place). Streetwise, dry, loyal.
- **Portrait (SVG, `js/gus.js`):** charcoal body (`#2b333d`→`#141a20`), pale grey underside,
  pink-grey ear and nose, one bright cyan-white eye, fine whiskers, long curled tail; a faint
  green console-glow halo. Reads clearly at ~64px in the dock.
- **Voice:** talks about ducts, wires, guard boots, and who not to trust; never rushes you.
- **Hint tiers:** `['A twitch of the whiskers', 'The wire to pull', 'The whole score']`.
  **buyLabel:** `Send Gus in`.
- **Sample greetings:** *"I've run these walls for years. Whatever's got you stuck, I've
  chewed past it before — ask."* / *"Two of you, one me. You see the front, they see the back;
  I see the ducts between. Talk to each other."* / *"The men who hired you lie. You two don't
  have to. What do you need?"*

---

## 4. Global systems

Identical shared engine (60:00 timer, three-tier Gus hints, auto-journal, autosave,
defeat-retry). Skin differences:

- **Journal:** *"The Job File."* Collectibles are **vault-pins** — small steel/brass tumbler
  pins, each stamped with a **position number (1–6)** and a **digit (0–9)** (`sun: { rays:
  <position>, letter: <digit-as-string> }`; `rays` rendered as the position numeral).
- **Inventory label:** *"Kit"* (the game is information-asymmetry only — no cross-role item
  hand-offs, which would be unsolvable without networking; the Kit stays light, as in Twin
  Signal Towers).
- **Palette (scene authoring):** neon-noir. **The Hand's world (museum interior):** marble
  `#e8e2d4`/`#cfc7b4`, deep shadow `#05070a`, wet charcoal `#0e141c`/`#12202b`, spotlight warm
  `#ffe6a6`, security-laser red `#ff3b57`/`#e0344b`, treasure gold `#e8c85a`/`#c9a227`. **The
  Eye's world (van + console):** phosphor green `#7cffb2`/`#2fbf71`, console dark
  `#08110d`/`#0c1a14`, camera-static grey `#6f7d86`, alert red `#ff3b57`, cyan UI `#57d6e6`.
  Signature look: **red laser lines + drifting dust motes** in The Hand's scenes; **green
  scanline flicker + phosphor drift** in The Eye's scenes (the two `ambient()` overlays).
- **Documents:** `.dossier` class (skin.css) — a manila job-file page (aged card over dark),
  `.dossier-title` inner heading; `.console-card` for the green schematic/feed clues; the
  cross-screen `.relay` callout (shared idiom) emphasises a clue is *for the partner*.

### The six vault-pins (split meta currency)

| Pin | Scene | Who finds it | Position | Digit |
|---|---|---|---|---|
| a | 2 Camera Room | Eye (P2) | 1 | 7 |
| b | 1 Service Door | Hand (P1) | 2 | 2 |
| c | 4 Records Room | Eye (P2) | 3 | 9 |
| d | 3 Marble Gallery | Hand (P1) | 4 | 4 |
| e | 6 Power Room | Eye (P2) | 5 | 1 |
| f | 5 Clock Hall | Hand (P1) | 6 | 6 |

**Hand (P1) job file:** positions 2 (=2), 4 (=4), 6 (=6). **Eye (P2) job file:** positions 1
(=7), 3 (=9), 5 (=1). Neither can order the combination alone. Combined and sorted by position
ascending (1→6): **7-2-9-4-1-6** = **729416**. Scene 7's vault timelock (on both screens)
accepts **729416**. Rule telegraphed on the maker's plate: *"THE MASTER RUNS FIRST PIN TO
LAST — POSITION ONE THROUGH SIX."*

### Item chain

Information asymmetry, not physical hand-offs. Items never cross roles (they can't, without
networking). No inventory items are required; the Kit stays empty by design.

---

## 5. The seven scenes

Room ids / flag prefixes, in order: `service`, `cameras`, `gallery`, `records`, `clockhall`,
`power`, `vault`. Every room's `scene()`, `hotspots()`, `title` (getter), `intro` (getter),
and `hints`/`hintContext` branch on `getRole()`. **Keep all hotspots out of the top-left
220×250 reserve** (Gus docks there). Prefix SVG ids with the room slug (`svc_…`, `cam_…`).

Each scene lists the **Hand (P1)** and **Eye (P2)** halves and the exact solutions. The
guiding rule, enforced in code: **no lock's answer is ever visible on the screen that must
enter it.**

---

### SCENE 1 — The Service Door / The Van (tutorial · cross-read combination)

The Hand is at the museum's service entrance; the door is a 4-digit keypad. The Eye is in the
van; the camera feed is dark until the uplink code is entered. **Your code is on the other's
screen.**

- **Hand's screen** shows the alley junction box, stencilled **"FEED UPLINK — 8 2 6 0"** (the
  Hand reads this to the Eye). The Hand's *own* door code is not shown here.
- **Eye's screen** shows the stolen door schematic, **"SERVICE DOOR — 5 1 9 3"** (the Eye
  reads this to the Hand). The Eye's *own* uplink code is not shown here.
- **Hand's lock:** 4-dial keypad. Enter **5 1 9 3** (read from the Eye).
- **Eye's lock:** 4-dial uplink. Enter **8 2 6 0** (read from the Hand).
- **Vault-pin:** Hand finds pin **b (position 2, digit 2)** etched on the door strike-plate.
- **Foreshadow #1** (both, journaled): the Client's brief — *"IN AND OUT. THE NIGHTINGALE
  ONLY. DO NOT OPEN THE INNER CASE. — C."*
- **Hints (each role):** ① *"Your code isn't on your own screen. What's stencilled/schematic'd
  on your screen is your PARTNER's code — read it to them and set what they read to you."*
  ② *"Four digits. Read the code on your screen aloud; set the four your partner reads back."*
  ③ Hand: *"5-1-9-3."* / Eye: *"8-2-6-0."*

---

### SCENE 2 — The Camera Room / The Feed Matrix (four-way alignment)

The Hand is in the guards' camera room; four gallery PTZ cameras must be aimed to their blind
corners. The Eye must route the four feed channels on the console. **Your four bearings are on
the other's screen.** 8-point index: 0=N,1=NE,2=E,3=SE,4=S,5=SW,6=W,7=NW.

- **Hand's screen** shows the console patch-card for the *Eye's* four channels =
  **NE, SE, W, S** = `[1,3,6,4]` (the Hand reads it to the Eye). The Hand aims their own four
  cameras to what the Eye reads.
- **Eye's screen** shows the aim-card for the *Hand's* four cameras =
  **E, S, NW, N** = `[2,4,7,0]` (the Eye reads it to the Hand). The Eye routes their own four
  channels to what the Hand reads.
- **Hand's lock:** four aim dials → `[2,4,7,0]`. **Eye's lock:** four routing dials →
  `[1,3,6,4]`.
- **Vault-pin:** Eye finds pin **a (position 1, digit 7)** in the DVR's recovered metadata.
- **Foreshadow #2** (Eye console): the Client — *"GUARD ROUNDS AT :20 AND :40. IGNORE ANYTHING
  ELSE YOU SEE ON THOSE FEEDS."* (How is the round schedule known to the minute? *Ignore
  anything else?*)
- **Hints:** ① *"Four things to aim; the four bearings for yours are drawn on your partner's
  screen, not yours."* ② *"Read the card on your screen to your partner; set the four points
  they read to you, in order."* ③ Hand: *"E, S, NW, N."* / Eye: *"NE, SE, W, S."*

---

### SCENE 3 — The Marble Gallery / The Laser Grid (decode — one sees, one reads the book)

A laser grid crosses the gallery floor. **One of you can see the beams; the other holds the
schematic that translates them into a safe word.** Both directions at once.

- **Hand** *sees* the laser beams flash in groups and counts the pips — **[1, 2, 3, 4]** — but
  has no map. The Hand *holds* the physical alarm-legend (page B) for the Eye's puzzle.
- **Eye** *sees* the alarm panel blink a sequence — counts **[4, 1, 3, 2]** — but can't map
  it. The Eye *holds* the grid schematic (page A) for the Hand's puzzle.
- **Page A (Eye holds):** `1→S, 2→A, 3→F, 4→E`. Hand's laser counts `[1,2,3,4]` → **SAFE**.
  → Hand reads counts to Eye, Eye decodes **SAFE**, tells Hand; **Hand enters SAFE** on the
  floor-path panel.
- **Page B (Hand holds):** `1→A, 2→K, 3→R, 4→D`. Eye's alarm counts `[4,1,3,2]` → **DARK**.
  → Eye reads counts to Hand, Hand decodes **DARK**, tells Eye; **Eye enters DARK** on the
  console.
- **Hand's lock:** enter **SAFE**. **Eye's lock:** enter **DARK**.
- **Vault-pin:** Hand finds pin **d (position 4, digit 4)** etched on a statue plinth.
- **Foreshadow #3** (both, journaled): a guard's dropped note — *"new owner wants the bird
  gone before the insurance audit."* (Is this theft, or an inside job?)
- **Hints:** ① *"You can see the flashes; you can't read them. Your partner has the book —
  read them the counts."* ② *"Count each burst: flashes, pause, flashes. Four groups, four
  letters. Your partner's page turns counts into a word."* ③ Hand: *"SAFE."* / Eye: *"DARK."*

---

### SCENE 4 — The Records Room / The Database (half-info deduction)

Four safe-deposit boxes (I–IV); one holds the real vault key. **You each can eliminate two —
but different two.**

- **Hand's physical view:** boxes **I** and **IV** have been drilled and re-sealed — decoys.
  Eliminate I, IV.
- **Eye's database:** boxes **II** and **IV** are flagged *"contents relocated."* Eliminate
  II, IV.
- **Only box III** survives both. Each must eliminate using their half plus the partner's;
  both select **III**.
- **Vault-pin:** Eye finds pin **c (position 3, digit 9)** on a decrypted manifest line.
- **Foreshadow #4** (Eye console): the Client — *"BOX III. TAKE THE KEY. LEAVE THE LEDGER."*
  (Why leave the evidence behind?)
- **Hints:** ① *"You can only rule out half the boxes. Your partner rules out the other half."*
  ② Hand: *"You can see which are drilled decoys; ask which are flagged 'relocated.'"* / Eye:
  *"You can read which are 'relocated'; ask which are drilled decoys."* ③ *"Box III — the only
  one neither of you ruled out."*

---

### SCENE 5 — The Clock Hall / The Automata (split rule + values arithmetic)

The Nightingale's twin automaton drives a pendulum lock; the console mirrors it as a damper.
**Your numbers are on your screen; the rule for them is on your partner's.**

- **Hand's lock (pendulum count):** the Hand's own two gauges read **9** and **4**. The *rule*
  is on the **Eye's plate**: *"set the DIFFERENCE."* → 9 − 4 = **5**.
- **Eye's lock (damper value):** the Eye's own two readouts read **6** and **2**. The *rule*
  is on the **Hand's plate**: *"set the SUM."* → 6 + 2 = **8**.
- **Hand sets 5; Eye sets 8.** (Clock chime = `playBell` on solve.)
- **Vault-pin:** Hand finds pin **f (position 6, digit 6)** cast into the pendulum bob.
- **Foreshadow #5** (both, journaled): the clockmaker's plate — *"Two hands, one hour. A lock
  made for a pair, so no one man could ever take it alone."*
- **Hints:** ① *"Your gauges give the numbers; your partner's plate gives the rule for them
  (or the reverse). Trade."* ② Hand: *"Your plate holds the EYE's rule; your gauges hold the
  HAND's numbers — swap."* ③ Hand: *"Set 5 (9 − 4)."* / Eye: *"Set 8 (6 + 2)."*

---

### SCENE 6 — The Power Room / The Breakers (5-lever pattern) + TWIST reveal

Kill the vault's outer alarm ring by setting five breakers. **Your pattern is on the other's
schematic.**

- Five breakers/relays per role, each **UP** (open) or **DOWN** (shut).
- **Hand's pattern** (drawn on the **Eye's schematic**): **UP, DOWN, UP, UP, DOWN**
  (`O C O O C`).
- **Eye's pattern** (drawn on the **Hand's schematic**): **DOWN, UP, UP, DOWN, UP**
  (`C O O C O`).
- **Vault-pin:** Eye finds pin **e (position 5, digit 1)** in the breaker-panel firmware dump.
- **The twist fires here.** On solve, Gus surfaces from behind the panel with the reveal
  (journaled): *"That wire doesn't go to the alarm. It goes OUT — to whoever's been talking in
  your ear. They mean to shut the door behind you the second the vault opens."* The Client's
  brief is recontextualised; the finale is now about ignoring the Client's code.
- **Hints:** ① *"The pattern for your breakers is on your partner's schematic, not yours."*
  ② *"Five breakers, up or down. Read your schematic to your partner; set what they read you."*
  ③ Hand: *"UP, DOWN, UP, UP, DOWN."* / Eye: *"DOWN, UP, UP, DOWN, UP."*

---

### SCENE 7 — The Vault / The Nightingale (finale + META + twist payoff)

The vault's inner timelock is a **6-digit master keypad** — the silent-alarm disarm. The
Client's voice demands a different code (`000000`, which trips the frame). Enter instead **the
number the six vault-pins spell.**

- **The meta lock (both screens):** a 6-digit keypad. Maker's plate: *"THE MASTER RUNS FIRST
  PIN TO LAST — POSITION ONE THROUGH SIX."* Sort all six pins by position (1→6): 7,2,9,4,1,6 →
  **729416**.
- **The asymmetric crux:** each job file holds only **three** pins (Hand: positions 2,4,6 =
  2,4,6; Eye: positions 1,3,5 = 7,9,1). Neither can order the combination alone — they read
  their three pins (position + digit) to each other, sort by position, and both enter
  **729416**.
- **Payoff:** the vault opens clean, the silent alarm stays silent, the Client's remote trip
  fires into the dead circuit Gus gnawed through, and the Nightingale goes into the bag. You
  leave by Gus's duct route, not the Client's door. `completeRoom` → victory: **CLEAN
  GETAWAY.**
- **Hints:** ① *"Six pins make the master; you carry only three. Your partner carries the
  other three."* ② *"Read your pins to each other — position and digit — then set all six in
  order, position one first. Ignore the code the Client's voice is pushing."* ③ *"7-2-9-4-1-6."*

---

## 6. Difficulty & pacing

| # | Scene | Mechanic | Difficulty | Est. min |
|---|-------|----------|------------|----------|
| 1 | Service Door | cross-read combination (tutorial) | ★☆☆☆☆ | 6 |
| 2 | Camera Room | four-way alignment | ★★☆☆☆ | 8 |
| 3 | Marble Gallery | flash decode (watcher + book) | ★★★☆☆ | 10 |
| 4 | Records Room | half-info deduction | ★★★☆☆ | 8 |
| 5 | Clock Hall | split rule + values arithmetic | ★★★☆☆ | 8 |
| 6 | Power Room | breaker pattern + twist reveal | ★★☆☆☆ | 7 |
| 7 | The Vault | split-file meta combination | ★★★☆☆ | 9 |
| | | | **Total** | **56** |

**Seven mechanics, all asymmetric.** None is solvable single-handed: every scene forces both
players to describe their screen to the other. Fairness rules match the series: wrong answers
cost only time via hints (never lockout), every clue journals on first examine and stays
re-readable, and the meta is fully derivable once both files are pooled. The one hard
two-player rule enforced in code: **no lock's answer is ever visible on the screen that must
enter it.** Twelve foreshadow beats (six Client/inside-job breadcrumbs + Gus's reveal + the
clockmaker/co-op motifs) plant the double-cross so it lands rather than shocks.

## 7. Assets needed (hand-authored SVG — none auto-generated)

All visuals are hand-authored SVG built directly in the room modules (as with every game in
the series); **no Higgsfield / asset-tool generation**. New art authored in code: Gus's rat
portrait (`js/gus.js`); a per-scene Hand (museum interior) and Eye (van + green console)
background variant (14 scene states total, via `js/heistkit.js`); the red laser-line + dust
overlay and the green scanline overlay; the keypad / aim-dial / laser-decode / box-select /
pendulum-gauge / breaker-lever / vault-keypad puzzle props; and the steel/brass vault-pin
collectible card (`renderCollectible` in `main.js`). If photographic plates are wanted later,
this game slots straight into the `docs/upgrade/` pipeline.
