# Twin Signal Towers — Design Document

### A two-player asymmetric co-op escape room — guide the *Meridian* through Wreckers' Bay before the tide turns

**Logline:** Two lighthouse keepers on opposite headlands have one hour to rebuild the
storm-scrambled signal chain across their twin towers and steer a foundering cargo ship
through the one safe channel — and neither keeper can see what the other can. Every lock's
answer is on the *other* keeper's screen.

**Folder:** `signal-towers/` · **Series slot:** Room V · Maritime / storm-coast ·
**Save keys:** `signal-towers-p1-save-v1`, `signal-towers-p2-save-v1` (namespaced by role)

---

## 1. The two-player model (the defining feature)

**No hosting, no networking.** After the title screen the player chooses a tower:
**West Tower = Player 1** or **East Tower = Player 2**. The choice is stored in
`localStorage['signal-towers-role']` and every room module renders a different variant of
each scene depending on the role (`js/role.js` → `getRole()`). Two people play on two
devices (or two browser tabs) and **talk to each other** — over the room, on a call,
whatever. The game never sends data between them; the co-op is enforced *by design*:

- **Mutual dependency every scene.** Each tower has its own lock. The information needed to
  open the West lock is only ever displayed on the East screen, and vice versa. You
  physically cannot solve your side without your partner telling you what they see, and
  they can't solve theirs without you.
- **Both players are always active.** No "one plays, one reads." Each keeper has a puzzle
  to operate on their own screen in every scene.
- **Independent progression, natural lockstep.** Each instance advances when *its* keeper
  solves *their* lock. Because neither lock is solvable alone, the two players stay in sync
  without any shared state.
- **The finale needs both journals.** The six collectible bearing-marks are split three and
  three between the towers; the meta word can only be assembled by reading all six aloud.

Save is namespaced per role so both towers can be played/tested on one machine without
collision. `hintContext` is role-prefixed for the same reason.

---

## 2. Story

**Setup.** A black-water night on a wrecking coast. Two lighthouses face each other across
the mouth of **Wreckers' Bay**: the **West Tower on Kestrel Point** (Player 1) and the
**East Tower on Gannet Rock** (Player 2). The cargo ship **Meridian** has lost her rudder
and is being driven onto the reefs. The towers' coordinated signal system — designed so the
two lights always work as one — was scrambled by a lightning strike, and each tower holds
only half of what's needed. You have **60 minutes** until the tide turns and the Meridian
breaks up. Climb both towers, rebuild the signal chain scene by scene, and light the safe
channel together.

**The quiet reveal (Scene 7).** Between the towers flies **Gus, a storm petrel** — the one
soul who crosses the water between the two lights, and has since long before you. The logs
tell it plainly if you read them: the last time these towers failed to agree, a ship called
the *Cormorant* was lost, and the keeper who raised Gus from a fledgling never forgave the
silence between the lights. This is not a rug-pull — it's the emotional payoff. Tonight,
for the first time in years, two keepers act as one, and the petrel carries the word
between you that finally makes the twin lights speak together.

**Ending.** Both beams swing onto the safe-channel bearing, the wreckers' false light on
the middle headland is drowned out, and the Meridian steers through into harbour.
Victory screen: **SAFE HARBOUR.**

**Defeat (00:00).** The tide turns; the false light wins; the Meridian strikes the reef.
Retry the current watch (15:00) with progress kept, or start the night over.

---

## 3. Gus's skin — the storm petrel

- **Name / epithet:** `Gus` — *"Gus — storm petrel, the only soul who flies between the two
  lights."*
- **Form:** `petrel` — a small dark seabird with a white rump, forked tail, quick bright
  eye; he shelters in whichever tower you're in and flits to the other with your messages.
  He is the diegetic reason two keepers can coordinate at all — and the game's heart.
- **Portrait (SVG, `js/gus.js`):** dark slate body (`#3a4656`→`#1c2431`), white rump band,
  pale underwing, one bright amber eye (`#ffcf6a`), wind-swept wings; a faint lamp-glow
  halo. Reads clearly at ~64px in the dock.
- **Voice:** salt-weathered, warm, wry; talks about wind and bearings; never rushes you.
- **Hint tiers:** `['A flutter of warning', 'The bearing', 'The whole course']`.
  **buyLabel:** `Whistle him over`.
- **Sample greetings:** *"Wind's backing westerly. I'll carry what you need across —
  ask."* / *"Two towers, one bird. I've done this longer than either of you. Speak."* /
  *"Your partner sees half of it. I see the flight between. What's stuck?"*

---

## 4. Global systems

Identical shared engine (60:00 timer, satchel/inventory, item combining, three-tier Gus
hints, auto-journal, autosave, defeat-retry). Skin differences:

- **Journal:** *"Keeper's Log."* Collectibles are **bearing-marks** — small brass
  compass-rose plates, each with a **needle** on one of the eight points and a **letter**
  (`sun: { rays: <1–6>, letter }`; `rays` is the mark's place sunwise from north and is
  drawn as the needle — `bearingOf()` / `compassPlate()` in `js/scenekit.js`).
- **Inventory label:** *"Oilskin"* (a keeper's pocket).
- **Palette (scene authoring):** storm night. Sea/sky `#0a1622`/`#0e2436`/`#123049`,
  deep shadow `#05080f`, wet stone `#2b3547`/`#1c2431`, brass `#c9a227`/`#e8c85a`,
  **lamp-beam warm `#ffe6a6`/`#ffcf6a`**, cold spray `#9fc7dd`, danger-red beacon
  `#e05252`, chart parchment `#e8dcc0`. Signature look: the **sweeping lamp-beam**
  (a long translucent warm wedge, class `moonbeam` recolored) + **rain streaks** +
  spray; each tower's own lamp is the light source (torch-flame class on the flame).
- **Documents:** `.logbook` class (skin.css) — a keeper's log page (aged cream over dark),
  `.log-title` inner heading; `.chartcard` for chart/diagram clues.

### The six bearing-marks (split meta currency)

Each mark is a small brass compass plate: a needle pointing one way round the rose, and a
letter. (Internally each still carries a number 1–6, which is its place sunwise from north.)

| Mark | Scene | Tower (who finds it) | Needle | Letter |
|---|---|---|---|---|
| A | 2 Lamp Room | East (P2) | N | A |
| S | 1 Watch Room | West (P1) | NE | S |
| H | 4 Chart Room | East (P2) | E | H |
| O | 3 Signal Gallery | West (P1) | SE | O |
| R | 6 Beam Engine | East (P2) | S | R |
| E | 5 Bell Loft | West (P1) | SW | E |

**West (P1) journal:** S(NE), O(SE), E(SW). **East (P2) journal:** A(N), H(E), R(S).
Neither can spell the word alone. Swept sunwise from north — N, NE, E, SE, S, SW — the
letters read **A-S-H-O-R-E** = **ASHORE**. Scene 7's beam-lock (on both screens) accepts
**ASHORE**. Rule on the lantern plaque: *"Sweep the beam sunwise from north, and read each
mark as the light finds it."* — a lighthouse rule, where the old one ("shallowest bearing
first") asked players to sort numbers.

### Item chain
This game leans on *information* asymmetry rather than physical item hand-offs, so the
inventory is light. Items are per-tower and never need to cross (they can't). Each tower
picks up small tools it uses on its own side (e.g., the West brass key for its own lamp
housing). No cross-tower item dependencies — those would be unsolvable without networking.

---

## 5. The seven scenes

Room ids / flag prefixes, in order: `watchroom`, `lamproom`, `signalgallery`, `chartroom`,
`bellloft`, `beamengine`, `lanterncrown`. Every room's `scene()`, `hotspots()`, `title`
(getter), `intro` (getter), and `hints`/`hintContext` branch on `getRole()`. **Keep all
hotspots out of the top-left 220×250 reserve** (Gus docks there). Prefix all SVG
gradient/animation ids with the room slug + role (`gd_watch_w_`, `gd_watch_e_`).

Each scene below lists the **West (P1)** and **East (P2)** halves and the exact solutions.

---

### SCENE 1 — The Watch Room (tutorial · cross-read combination)

Both keepers wake their tower's ground-floor watch room; the trap-hatch to the stair up is
held by a 3-digit **brass tide-lock**. **Your hatch's code is posted on the *other* tower's
wall.**

- **West (P1) wall** shows a chalked plate: *"EAST HATCH — 5 · 2 · 8."* (P1 reads this to
  P2.) West's own hatch code is **3-7-1** — not visible to P1; it's on the East wall.
- **East (P2) wall** shows: *"WEST HATCH — 3 · 7 · 1."* (P2 reads this to P1.) East's own
  hatch is **5-2-8**, posted on the West wall.
- **Puzzle (both):** a 3-dial 0–9 tide-lock. P1 sets **3-7-1**; P2 sets **5-2-8**.
- **Bearing-mark:** West (P1) finds mark **S (needle NE)** on a brass plate at the West lamp
  base. (East gets no mark this scene.)
- **Foreshadow:** the watch-desk **log** (both towers, journaled): *"…the night we lost the
  Cormorant, the two lights never once agreed. Gus flew himself ragged between us and it was
  not enough. One keeper each is not enough. It wants two who will talk."*
- **Flavor:** the storm window (the Meridian's distant lamp), the cold stove, the oilskins.
- **Hints (each role):** ① *"Your hatch code isn't in your tower. Ask the other keeper what
  their wall says about your hatch."* ② *"West wall names the EAST hatch; East wall names
  the WEST hatch. Read yours to your partner; set what they read to you."* ③ P1: *"3-7-1."*
  / P2: *"5-2-8."*

---

### SCENE 2 — The Lamp Room (reef bearings × aiming rule)

The great lamp is dark; its four **prism panels** must be turned before the beam will
throw — each aimed **clear of the reef it guards**. Split knowledge: the reef bearings for
a lamp are in the **other** tower's signal book; the rule for aiming away from a reef is on
**this** lamp's own brass plate. (It used to be straight dictation of the four answers.)

- 8-point index: 0=N,1=NE,2=E,3=SE,4=S,5=SW,6=W,7=NW.
- **West rule (on P1's lamp):** set each panel to the point **opposite** its reef. West
  reefs (in P2's signal book): **SW, NW, E, N** → West panels **NE, SE, W, S** = `[1,3,6,4]`.
- **East rule (on P2's lamp):** a **quarter-turn sunwise** of the reef. East reefs (in P1's
  signal book): **N, E, SW, W** → East panels **E, S, NW, N** = `[2,4,7,0]`.
- **Staging:** the lantern room — glazing all round (the other tower's light across the
  bay), the lens on its pedestal with the four panel dials on its control plate, the rule
  plate on the wall, the paraffin tank on the floor, the ladder up.
- **Bearing-mark:** East (P2) finds mark **A (needle N)** in the tray at the pedestal's foot.
- **Hints:** ① *"Your lamp's plate tells you how to aim a panel from the reef it guards. The
  reefs round your lamp are in your partner's signal book."* ② the role's rule, spelled out
  (N↔S, E↔W / N→E, E→S, S→W, W→N). ③ P1: *"NE, SE, W, S."* / P2: *"E, S, NW, N."*

---

### SCENE 3 — The Signal Gallery (flash decode — one watches, one reads the book)

The Meridian and a second vessel are flashing distress signals. **One keeper can see the
flashes; the other holds the codebook that translates them.** Both directions at once.

- **West (P1):** *sees* the **Meridian's flashes** (an animated signal lamp + a static
  "recorded flashes" readout of the pip-counts) but has **no codebook for them**. Recorded
  counts (Meridian) = `[1, 2, 3, 4]`. West also *holds* **Codebook Page B** (for the East
  signal).
- **East (P2):** *sees* the **second vessel's flashes**, recorded counts = `[2, 3, 1, 4]`,
  but has no codebook for them. East *holds* **Codebook Page A** (for the Meridian).
- **Page A (East holds):** `1→H, 2→O, 3→L, 4→D`. Meridian counts `[1,2,3,4]` → **HOLD**.
  → P1 reads counts to P2, P2 decodes **HOLD**, tells P1; **P1 enters HOLD.**
- **Page B (West holds):** `1→R, 2→T, 3→U, 4→N`. Second-vessel counts `[2,3,1,4]` →
  **TURN**. → P2 reads counts to P1, P1 decodes **TURN**, tells P2; **P2 enters TURN.**
- **Puzzle (both):** read the flash counts aloud, partner decodes via their page, enter the
  4-letter word (text input, canonicalized).
- **Bearing-mark:** West (P1) finds mark **O (needle SE)** on the signal telescope's tripod.
- **Foreshadow:** the codebook flyleaf (journaled): *"Kept by the keepers of both lights.
  A page torn to each tower, so neither could ever signal alone. — for Gus, who carries the
  rest."*
- **Hints:** ① *"You can see the flashes; you can't read them. Your partner has the book —
  read them the counts."* ② *"Count each burst: how many flashes, then a pause, then the
  next. Four groups, four letters. Your partner's page turns counts into a word."*
  ③ P1: *"HOLD."* / P2: *"TURN."*

---

### SCENE 4 — The Chart Room (combine half-charts to plot the channel)

Choose the safe channel through the bay. **One chart shows the rocks; the other shows the
depths. Only together do they name the safe channel.**

- Four candidate channels: **I, II, III, IV.**
- **West (P1) chart** (rocks, no soundings): Channel **I** strikes a reef; Channel **IV**
  strikes a reef. (II and III look clear of rock to P1.)
- **East (P2) chart** (depth soundings, rocks fogged): Channel **II** is too shallow (dries
  at low water); Channel **IV** is too shallow. (I and III are deep enough to P2.)
- **Only Channel III** is both rock-free (P1) and deep enough (P2). Each keeper must
  eliminate using their half + the partner's half; both select **III**.
- **Puzzle (both):** pick the safe channel (I–IV) and confirm. Correct = **III**.
- **Bearing-mark:** East (P2) finds mark **H (needle E)** pinned to the chart table.
- **Flavor:** dividers and parallel rules, the barometer, a cold cup of tea.
- **Hints:** ① *"You can only see half the bay. Your partner sees the half you can't."*
  ② P1: *"You can spot the rocks; ask your partner which channels are deep enough."* /
  P2: *"You can read the depths; ask your partner which channels are clear of rock."*
  ③ *"Channel III — the only one both clear and deep."*

---

### SCENE 5 — The Bell Loft (fog signal · split rule + values)

Sound the fog bell so the Meridian knows which way to pass. **Your bell's toll-count needs
a rule from one screen and the numbers from the other.**

- **West bell (P1 solves):** P1's own gauges read **fathoms 9, channel 4**. The *rule* is
  on **P2's plate**: *"Toll the DIFFERENCE of the two gauges."* → 9 − 4 = **5**.
- **East bell (P2 solves):** P2's own gauges read **5 and 3**. The *rule* is on **P1's
  plate**: *"Toll the SUM of the two gauges."* → 5 + 3 = **8**.
- **Puzzle (both):** set a toll-count dial (0–12) and sound the bell. P1 = **5**; P2 = **8**.
- **Bearing-mark:** West (P1) finds mark **E (needle SW)** cast into the bell's headstock.
- **Foreshadow:** bell inscription (journaled): *"Cast for two hands. One bell was never
  enough to be heard across the bay."*
- **Hints:** ① *"Your gauges give numbers; your partner's plate gives the rule for what to
  do with them (or the reverse). Trade."* ② P1: *"Your plate holds the EAST rule; your
  gauges hold the WEST numbers — swap with your partner."* ③ P1: *"Toll 5 (9 − 4)."* /
  P2: *"Toll 8 (5 + 3)."*

---

### SCENE 6 — The Beam Engine Room (line pressures × valve rule)

Restore each rotating beam's paraffin-pressure drive by setting five valves. The towers
share one pressure main, so **each tower's repeater reads the other engine's five line
pressures** (copied into that tower's signal book); **each engine's own plate gives the
rule** for which lines to open. (It used to be straight dictation of the pattern.)

- Five valves per tower, each **OPEN** or **SHUT** (the `.lever` UI, `down` = shut).
- **West rule:** open every line reading an **even** number of pounds. West pressures (on
  P2's repeater): **24, 37, 18, 42, 51** → `O S O O S`.
- **East rule:** open every line reading **above 30 lb**. East pressures (on P1's
  repeater): **22, 46, 38, 15, 33** → `S O O S O`.
- **Staging:** the engine room — a porthole on the storm, the clockwork drive standing on
  the floor with its governor on top, the main gauge on its standpipe, the rule plate on
  the wall, the five valves on a manifold carried on two stands, the ladder up.
- **Bearing-mark:** East (P2) finds mark **R (needle S)** on the drive housing.
- **Hints:** ① *"Your engine's plate says which lines to open — but your line pressures
  only show on your partner's repeater."* ② the role's rule, spelled out. ③ P1: *"OPEN,
  SHUT, OPEN, OPEN, SHUT."* / P2: *"SHUT, OPEN, OPEN, SHUT, OPEN."*

---

### SCENE 7 — The Lantern Crown (finale + META)

Both beams live; but a **wreckers' false light** burns on the middle headland, pulling the
Meridian onto the rocks. Overpower it: set each tower's beam to the safe-channel bearing by
entering the harbour word — **the word the six bearing-marks spell.**

- **The meta lock (both screens):** the beam-training wheel on its post. Plaque: *"Sweep
  the beam sunwise from north, and read each mark as the light finds it."* Going round the
  rose: N:A, NE:S, E:H, SE:O, S:R, SW:E → **ASHORE**. (Entering it widdershins, EROHSA,
  gets a nudge to go round the other way.)
- **The asymmetric crux:** each keeper's log holds only **three** marks (P1: S,O,E; P2:
  A,H,R). Neither can spell ASHORE alone — they read their three marks (needle + letter) to
  each other, sweep them round the compass, and both enter **ASHORE**.
- **Payoff:** on solve, both beams swing onto the channel, the false light drowns, the
  Meridian steers through. Gus's reveal plays (the petrel who has carried the word between
  the lights since before you; tonight two keepers finally spoke as one). `completeRoom` →
  victory: **SAFE HARBOUR.**
- **Hints:** ① *"Six marks make the word; you only carry three. Your partner carries the
  other three."* ② *"Read each other your marks as needle and letter, then go round the compass
  sunwise from north."* ③ *"N:A, NE:S, E:H, SE:O, S:R, SW:E — ASHORE."*

---

## 6. Difficulty & pacing

| # | Scene | Mechanic | Difficulty | Est. min |
|---|-------|----------|------------|----------|
| 1 | Watch Room | cross-read combination (tutorial) | ★☆☆☆☆ | 6 |
| 2 | Lamp Room | rotation alignment | ★★☆☆☆ | 8 |
| 3 | Signal Gallery | flash decode (watcher + book) | ★★★☆☆ | 10 |
| 4 | Chart Room | half-chart deduction | ★★★☆☆ | 8 |
| 5 | Bell Loft | split rule + values arithmetic | ★★★☆☆ | 8 |
| 6 | Beam Engine | valve pattern | ★★☆☆☆ | 7 |
| 7 | Lantern Crown | split-journal meta word | ★★★☆☆ | 9 |
| | | | **Total** | **56** |

**Seven mechanics, all asymmetric.** None is solvable single-handed: every scene forces
both keepers to describe their screen to the other. Fairness rules match the series: wrong
answers cost only time via hints (never lockout), every clue journals on first examine and
stays re-readable, and the meta is fully derivable once both keepers pool their journals.
The one hard two-player rule enforced in code: **no lock's answer is ever visible on the
screen that must enter it.**

## 7. Assets needed (hand-authored SVG — none auto-generated)

All visuals are hand-authored SVG built directly in the room modules (as with every game in
the series); no Higgsfield/asset-tool generation. New art authored in code:
Gus's storm-petrel portrait (`js/gus.js`), a per-scene West and East background variant
(14 scene states total), the sweeping lamp-beam + rain overlay, the brass tide-lock /
Fresnel dials / flash-lamp / chart / bell / valve / beam-wheel puzzle props, and the
brass bearing-mark collectible card (`renderCollectible` in `main.js`). If you later want
photographic plates, this game slots straight into the `docs/upgrade/` pipeline.
