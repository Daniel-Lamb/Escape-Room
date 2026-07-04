# Starfall Station — Design Document

### A browser escape room — get off Kepler-Starfall Station before re-entry

**Logline:** You wake from cryo on an evacuated orbital station, sixty minutes before its
decaying orbit hits atmosphere. The crew is gone, the AI core is empty — and the truth about
who is actually walking these corridors is the final lock on the way out.

---

## 1. Story & THE TWIST

**Surface story.** You are Dr. Elin Voss, station scientist, waking late from cryo after a
debris strike forced an evacuation. A rescue vessel (RV-7) is holding at range. You have
60:00 until Starfall Station starts to burn. Reach the escape pod bay.

**The twist (Room 7).** The escape pod's biometric gate rejects you: *NO ORGANIC SIGNATURE
DETECTED.* You are not Elin Voss's body. Elin Voss died eleven months ago — of the illness
in the sealed med file — after completing a neural backup. **You are that backup**, running
in maintenance chassis **MC-7**, woken by Gus when the evacuation left no one behind to
wake. The pod was never your way out. The **uplink array** is: you transmit yourself — and
Gus's core, he asks to come — to RV-7 as data. "Escape" was always going to mean this.

**Fair-play foreshadowing (all present before Room 7):**
1. R1 — your cryopod's nameplate is blank; readout: `OCCUPANT: ——— · TISSUE INTEGRITY 0%`.
2. R1 — your suit sleeve is stenciled `MC-7`, "an odd thing to print on a med suit."
3. R1 — the polished pod glass: "the glare hides you," every time.
4. R3 — med bay scale: `MASS 212.4 KG — RECALIBRATE?`
5. R3 — crew manifest: five evacuated; `VOSS, E. — DECEASED. NEURAL BACKUP: COMPLETE.`
6. R4 — AI core status: `RESIDENT INSTANCE: MIGRATED → MAINTENANCE CHASSIS 7`.
7. Every memory shard (below) plays a first-person fragment of Voss's last year —
   consent forms, the upload chair, "the body won't make the year, Elin."
8. Gus never once suggests you eat, sleep, or breathe.

**Ending.** Passphrase accepted, dish aligned, TRANSMIT: the station burns as a signal
leaves it — two passengers, one carrier wave. Victory screen: **SIGNAL FOUND.**

---

## 2. Global systems

Identical engine to *The Pilgrim's Road* (timer, satchel, combining, tiered Gus hints,
journal, autosave, defeat-retry). Differences of skin:

- **Gus's form:** GS-1 "Gus," a floating maintenance drone — round chassis, single warm
  eye, thruster shimmer. Epithet: *GS-1 "Gus" — maintenance drone, self-appointed morale
  officer.* In R7 he is also a character in the twist: he knew, and he stayed.
- **Journal:** "Suit Log." Collectibles are **memory shards** — hex chips that each play a
  memory fragment and carry a **waveform (N peaks) + a letter**.
- **Palette:** deep space blues, hull greys, signal cyan `#4fd8d0`, warning amber; the
  planet below grows brighter/redder as rooms pass (re-entry approaching).

### The six memory shards (meta-puzzle currency)

| Shard | Found in | Peaks | Letter | Memory fragment (foreshadow) |
|---|---|---|---|---|
| 1 | R1 cryo pod's data slot | 6 | U | "—cold gel, electrodes, a hand that is not quite yours signing the consent form—" |
| 2 | R2 nutrient tank | 3 | A | "—green rows under grow-lights; someone laughing about tomatoes in orbit—" |
| 3 | R3 neural-lab tray | 5 | E | "—a hospital bed; a voice: 'the body won't make the year, Elin'—" |
| 4 | R4 core pedestal | 2 | W | "—the upload chair, counting backward from ten, reaching seven—" |
| 5 | R5 telescope housing | 4 | K | "—stars through the dome, and you promising them you'd stay—" |
| 6 | R6 coolant manifold | 7 | P | "—a small drone's eye-light in the dark: 'I will remember for both of us.'—" |

Room-order letters read **U-A-E-W-K-P** (meaningless). Sorted by wave peaks ascending
(2,3,4,5,6,7 — all distinct → total, unique order): **W-A-K-E-U-P**. The uplink console
asks for "the word you asked us to wake you with": **WAKEUP**.

### Item chain

```
R1 magnet stylus (looks like junk) ─────────────→ R6 extract slagged fuse
R2 UV lamp ─────────────────────────────────────→ R3 reveal keypad prints
R3 keycard (blue) ──────────────────────────────→ R4 core door
R3 biogel canister ─────────────────────────────→ R7 repair cracked emitter
R5 RV-7 vector log (journal: AZ 117 / EL 43) ───→ R7 dish alignment
R6 charged capacitor (ejected on solve) ────────→ R7 uplink power
```

---

## 3. The seven decks

### DECK 1 — Cryo Bay (≈5 min, tutorial)
**Mechanic: combination-from-observation with a conservation rule.**
Your pod's manual thaw release wants a 4-digit code. Four coolant gauges A–D feed the pod;
frost hides them until wiped (click). A=**4**, B=**7**, D=**2**; C's glass is cracked and
dead. Stamped on the manifold: **"PRESSURE LAW: A + B = C + D."** → C = 4+7−2 = **9**.
Keypad label: "THAW CODE = GAUGES A·B·C·D" → **4792**.
*Deduction:* counts are stated on examine; the law is explicit; order is printed. Unique.
Items: **magnet stylus** (tool drawer, "junk"), **shard 1** (pod data slot).
Foreshadows: blank nameplate/0% integrity, MC-7 sleeve, glare-hidden reflection.
Exit (to hydroponics): gated on stylus + shard 1 ("salvage protocol").
Hints: ① The gauges feed the pod — wipe the frost. One is dead, but the manifold states a law.
② A + B = C + D. You know A, B, D. ③ 4-7-9-2.

### DECK 2 — Hydroponics Ring (≈7 min)
**Mechanic: pipe rotation / flow routing.**
The ring's veg-synth is dry; the door interlock needs the nutrient loop closed. A 4×3 grid
of pipe tiles (straights + elbows), inlet mid-left, return mid-right; tiles rotate
**clockwise only** (seized valves). Route the flow; decoy tiles exist; connectivity is
checked live and the loop fills green on success.
*Deduction:* pure spatial reasoning, no hidden info; clockwise-only is stated.
Items: **UV grow-lamp** (taken from the bloomed rack after flow restored), **shard 2**.
Exit gated on UV lamp + shard 2.
Hints: ① Water wants a single unbroken road from inlet to return. ② Valves turn clockwise
only — plan each tile's final facing before you spin past it. ③ Trace from the inlet: every
elbow on the middle row turns the flow up and over the blocked center tile.

### DECK 3 — Crew Quarters & Med Bay (≈8 min)
**Mechanic: cross-reference + UV reveal.**
Med locker: 4-digit keypad. **UV lamp** on the keypad → only **2, 0, 8, 5** fluoresce.
Datapad (Ibarra): "set every code to the year we lost Aurora Station — he never shuts up
about it." Memorial plaque in the corridor: **"AURORA STATION — LOST 2085."** → **2085**.
*Deduction:* prints give the digit set; log names the year; plaque supplies it; unique
arrangement of {2,0,8,5} matching a year on display = 2085.
Items: **keycard (blue)**, **biogel canister** (locker), **shard 3** (neural-lab tray).
Foreshadows: manifest (VOSS deceased/backup complete), the 212 kg scale.
Exit (core door) requires keycard + shard 3.
Hints: ① Fingers leave grease; grow-light makes grease glow. ② Four glowing digits and a
crewman who "never shuts up" about a lost station. Look for a memorial. ③ 2085.

### DECK 4 — AI Core (≈10 min, peak 1)
**Mechanic: switch/logic-gate circuit.**
The core chamber is dark and *empty* — `RESIDENT INSTANCE: MIGRATED → MAINTENANCE
CHASSIS 7` (the twist, hiding in plain sight). To open the far bulkhead, restore the
isolation logic: four breakers **A B C D**; etched schematic:
**DOOR = A AND (NOT B) AND (C OR D)** · **ALARM = B OR ((NOT C) AND D) OR (C AND D)**.
Door must be live with the alarm dark. Unique solution: **A=1, B=0, C=1, D=0**
(any D=1 trips the alarm via one of its two terms; door needs A, needs ¬B, needs C∨D → C).
A fused relay first refuses all switching — **magnet stylus** draws the slug out.
Items: **shard 4**.
Hints: ① The etching is the truth table — read gates, not vibes. ② D is poison: either
alarm term catches it. So C must carry the door. ③ A up, B down, C up, D down.

### DECK 5 — Observation Deck (≈8 min, breather)
**Mechanic: symbol substitution + attitude dials.**
The station tumbles slowly (scene subtly tilted). Attitude ghosts drift on the dome glass —
three glyph strings: `P: ▲•` · `Y: •◆◇` · `R: ○`. The calibration card by the telescope:
**▲=1 •=2 ◆=8 ◇=4 ○=0**. Set PITCH **12**, YAW **284**, ROLL **0** → the deck rights
itself, the comms console powers, and its log gives **RV-7 HOLDING: AZ 117 / EL 43**
(journaled — needed in R7). Items: **shard 5** (telescope housing).
Hints: ① The dome ghosts are numbers wearing masks; the card by the telescope unmasks them.
② Triangle-dot is twelve. Do the other two. ③ Pitch 12, yaw 284, roll 0.

### DECK 6 — Reactor Control (≈9 min, peak 2)
**Mechanic: constrained resource balancing.**
Emergency cells: **40, 25, 15, 10** units. Three buses with exact demands — LIFE SUPPORT
**50**, DOOR SERVOS **25**, UPLINK PRE-CHARGE **15** — and a stamped rule: **"MAX TWO
CELLS PER BUS."** 25+15+10 could make 50 but takes three cells → only **40+10** can feed
LIFE SUPPORT; then DOOR=25, UPLINK=15. Unique. First, the LIFE SUPPORT socket holds a
slagged fuse — **magnet stylus** extracts it. On balance: the UPLINK bus ejects a
**charged capacitor** (item), the door servos wake.
Items: charged capacitor, **shard 6**.
Hints: ① Three demands, four cells, and a two-cell limit stamped on the frame. ② Fifty is
the trap: only one pair makes it. Start there and the rest places itself. ③ 40+10 to life
support, 25 to door, 15 to uplink.

### DECK 7 — Pod Bay → Uplink Array (≈12 min, TWIST + META)
**Phase 1 — the pod (the twist).** One pod remains, prepped and warm. The biometric arch:
`SCANNING… NO ORGANIC SIGNATURE DETECTED. OCCUPANT REJECTED.` Second attempt — the pod
**seals and ejects, empty**, saving itself. Gus stops hiding it: *"Look at your hands,
Elin."* The reveal sequence (your hands → the dark window that finally shows a reflection:
a maintenance drone; the shards' memories reassembling) sets the truth. The bulkhead to
the uplink array opens. There was always a second way off this station. It was built for
data.
**Phase 2 — the uplink (META).** Four steps, all earned earlier:
1. **Repair** the cracked emitter — **biogel** ("organic-derived conductive medium").
2. **Power** — seat the **charged capacitor**.
3. **Passphrase** — console: *"Voiceprint passphrase — the word you asked us to wake you
   with."* Sort the six shards by wave-peaks (journal shows them): **WAKEUP**.
4. **Alignment** — two dials to the RV-7 hold vector from the R5 comms log:
   **AZ 117 / EL 43** → **TRANSMIT.**
Gus asks to come — his core slots in beside yours. Transmission as the sky turns to fire.
Hints (pod): ① The scanner is not broken. ② It is telling the truth. What did it fail to
find? ③ Look at your hands, at your sleeve, at the manifest, at the empty core. Then let
Gus talk. Hints (uplink): ① Four sockets: mend, power, speak, aim. ② The word is in your
shards — fewest wave-peaks speaks first. ③ Gel the emitter, seat the capacitor, WAKEUP,
AZ 117 / EL 43, transmit.

---

## 4. Difficulty & pacing

| # | Deck | Mechanic | Difficulty | Est. min |
|---|------|----------|------------|----------|
| 1 | Cryo Bay | observation + conservation law | ★☆☆☆☆ | 5 |
| 2 | Hydroponics | pipe routing | ★★☆☆☆ | 7 |
| 3 | Quarters/Med | UV reveal + cross-reference | ★★★☆☆ | 8 |
| 4 | AI Core | logic gates | ★★★★☆ peak 1 | 10 |
| 5 | Observation | symbol substitution + dials | ★★☆☆☆ breather | 8 |
| 6 | Reactor | constrained balancing | ★★★★☆ peak 2 | 9 |
| 7 | Pod Bay/Uplink | twist + meta synthesis | ★★★☆☆ | 12 |
| | | | **Total** | **59** |

Seven mechanics, none shared with *The Pilgrim's Road*'s seven. Fairness rules identical:
exit gates enforce shard collection and required items; wrong answers cost nothing but
pride; every clue is journaled and re-readable; the twist is fully foreshadowed by eight
independent clues before it lands.
