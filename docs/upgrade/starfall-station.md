# Starfall Station — Deck-by-Deck Upgrade Spec

Sci-fi station escape (series Room II). You are **Dr. Elin Voss**, woken from cryo on
an evacuated orbital station with 60 minutes before its decaying orbit hits atmosphere.
Source: `public/starfall-station/`. Full logic: [../DESIGN-STARFALL.md](../DESIGN-STARFALL.md);
solutions: [../WALKTHROUGH-STARFALL.md](../WALKTHROUGH-STARFALL.md).

**The twist (Deck 7).** The escape pod rejects you: *NO ORGANIC SIGNATURE DETECTED.*
You are Voss's **neural backup** running in maintenance chassis **MC-7** — Voss's body
died 11 months ago. The pod was never the way out; the **uplink array** is. You transmit
yourself (and Gus) to the rescue ship as data. Fully foreshadowed by 8 clues before it
lands (blank nameplate, MC-7 sleeve, the 212 kg scale, the manifest, the migrated core,
the shard memories).

**Meta thread.** Six **memory shards** (a waveform of N peaks + a letter) are journaled
across Decks 1–6. Sorted by peak count they spell **WAKEUP** — the uplink passphrase,
"the word you asked us to wake you with."

### Art direction (lock once, reuse for all 7 decks)
Evacuated orbital station interior, cool and clinical, emergency lighting. Palette: deep
space blues, hull greys, **signal cyan `#4fd8d0`**, warning amber. Recurring hero shot:
the **planet below through a viewport, growing brighter and redder** deck by deck as
re-entry approaches (a built-in tension meter — make it visibly hotter in later decks).
Empty, powered-down, humming. Keep cyan HUD glows and drifting-particle effects as
overlays.

### Item chain (unchanged)
magnet stylus (D1, "junk") → D4 relay slug + D6 slagged fuse · UV lamp (D2) → D3 keypad
prints · blue keycard (D3) → D4 core door · biogel (D3) → D7 cracked emitter · RV-7
vector log AZ117/EL43 (D5) → D7 dish · charged capacitor (D6) → D7 uplink power.

---

## Deck 1 — Cryo Bay
**Tutorial · observation + conservation law · ~5 min · [room1-cryobay.js](../../public/starfall-station/js/rooms/room1-cryobay.js)**

### Logic
Your pod's manual thaw needs a 4-digit code. Four coolant gauges A–D, frosted; wipe to
read A=**4**, B=**7**, D=**2**; C's glass is cracked/dead. Manifold rule:
**A + B = C + D** → C = 9. Keypad label "THAW CODE = GAUGES A·B·C·D" → **4792**. Exit
gated on the magnet stylus + shard 1. Foreshadow-heavy: blank nameplate, MC-7 sleeve,
glare-hidden reflection.

### Visible elements
| Element | Anchor | Notes |
|---|---|---|
| Viewport with planet (too close) | 1120,110 380×280 | tension meter; brightest = danger |
| Row of open empty crew pods | 110,260 620×360 | |
| Your pod (fogged glass, **blank plate**) | 780,250 200×380 | data slot w/ shard |
| Data slot + **shard 1** (6 peaks, "U") | 945,405 60×80 | |
| Coolant gauges A–D + manifold | 1080,460 360×62 | frost hides values; C cracked |
| Tool drawer | 60,680 200×100 | magnet stylus |
| Bulkhead door + thaw-lock keypad | 410,340 140×290 | closed/open |
| Emergency strip lighting | edges | amber pulse |
| Your sleeve (**MC-7 stencil**) | 20,380 90×120 | foreshadow |

### Interactive elements
**Hotspots:** `mypod` 780,250,200,380 (clue: OCCUPANT ———, 0% integrity) · `shard1`
945,405,60,80 · `sleeve` 20,380,90,120 (foreshadow — note: edges Gus reserve; keep art
here non-clickable-elsewhere) · `pods` 110,260,620,360 (gauge C clue) · `manifold`
1080,460,360,62 (pressure law) · `drawer` 60,680,200,100 (item) · `viewport`
1120,110,380,280 (flavor/tension) · `door` 410,340,140,290 (→ puzzle) → `door_open` (exit).
**Items:** Magnet Stylus, shard 1.
**Puzzle "Thaw-Lock Interlock":** four-gauge readout + keypad → 4792.

### Upgrade plan
- **Background plate:** cold cryo bay, a row of open glass pods, emergency strip
  lighting, a big viewport with the planet ominously close. Your pod (center-right) fogged.
- **Prop sprites:** your cryopod with a **blank nameplate** (foreshadow — keep legible-blank);
  the four coolant gauges (frosted vs wiped states — A/B/D show 4/7/2, C cracked); the
  manifold plate stamped "A + B = C + D"; the tool drawer + magnet stylus; the MC-7
  sleeve; shard 1 (hex chip, cyan glow) in the data slot; the bulkhead door + keypad.
- **Interaction upgrade:** gauges you physically wipe (drag to clear frost); a real
  keypad with a thaw-lock readout. The pod-glass reflection that "hides you" is a key
  foreshadow — make the glare deliberate.
- **Note:** `sleeve` hotspot at x20,y380 sits at the left edge under Gus's reserve zone;
  when recomposing art, keep the MC-7 stencil readable but ensure nothing else clickable
  intrudes on the top-left 220×250.

---

## Deck 2 — Hydroponics Ring
**★★ · pipe routing · ~7 min · [room2-hydroponics.js](../../public/starfall-station/js/rooms/room2-hydroponics.js)**

### Logic
Route the nutrient loop: a 4×3 grid of pipe tiles (straights + elbows), inlet mid-left,
return mid-right, **tiles rotate clockwise only** (seized valves). Decoys exist; the
loop fills green when connected. Restoring flow blooms a rack → take the UV grow-lamp.
Exit gated on UV lamp + shard 2.

### Visible elements
| Element | Anchor | Notes |
|---|---|---|
| Grow racks (dead / blooming) | mid | grow-light tubes |
| Nutrient tank + **shard 2** (3 peaks, "A") | 870,285 60×75 | |
| Pipe access panel (the puzzle) | center | 4×3 rotatable grid |
| Exit iris | | |
| UV grow-lamp | 460,200 220×60 | item after flow restored |

### Interactive elements
**Hotspots:** `shard2` 870,285,60,75 · `lamp` 460,200,220,60 (item, appears after solve).
Panel → puzzle; iris → exit.
**Items:** UV Grow-Lamp, shard 2.
**Puzzle "Nutrient Loop Junction":** rotate pipe tiles (clockwise only) to connect
inlet→return; live connectivity check, loop fills green.

### Upgrade plan
- **Background plate:** curved hydroponics ring — rows of grow racks (some dead brown,
  some blooming green under grow-lights), a central pipe/valve access panel, an exit iris.
- **Prop sprites:** the pipe tiles (straights, elbows, decoys) as real conduit segments;
  the nutrient tank + shard 2; the UV grow-lamp; the bloomed vs dead racks (state change
  on solve); green nutrient flowing through the completed loop.
- **Interaction upgrade:** the pipe grid becomes a tactile plumbing panel — tiles that
  rotate 90° clockwise with a valve-clunk, glowing green as flow completes, the seized-
  valve (clockwise-only) constraint made physical. This is a spatial puzzle; crisp pipe
  art and a satisfying "flow fills" animation carry it.

---

## Deck 3 — Crew Quarters & Med Bay
**★★★ · UV reveal + cross-reference · ~8 min · [room3-medbay.js](../../public/starfall-station/js/rooms/room3-medbay.js)**

### Logic
Med locker keypad: shine the **UV lamp** on it → only **2, 0, 8, 5** fluoresce (finger
grease). Ibarra's datapad: "set every code to the year we lost Aurora Station." Memorial
plaque: "AURORA STATION — LOST 2085." → **2085**. Locker yields blue keycard + biogel.
Foreshadow-heavy: manifest (VOSS deceased / backup complete), the 212 kg scale.

### Visible elements
| Element | Anchor | Notes |
|---|---|---|
| Bunks (quarters side) | left | five + one **folded sixth bunk** |
| Ibarra's datapad on his bunk | ~ | clue |
| Memorial plaque | 610,140 170×210 | "LOST 2085" |
| Crew manifest screen | 850,130 320×220 | VOSS DECEASED / BACKUP COMPLETE (foreshadow) |
| Med scale | 860,550 180×90 | MASS 212.4 KG (foreshadow) |
| Neural-lab tray + **shard 3** (5 peaks, "E") | 1145,510 90×70 | |
| Med locker + keypad | 1330,230 210×400 | closed/open |
| Core access door | 1545,290 55×360 | exit |

### Interactive elements
**Hotspots:** `ibarra` (datapad clue) · `memorial` 610,140,170,210 (year clue) ·
`sixthbunk` 180,540,200,100 (foreshadow flavor) · `manifest` 850,130,320,220 (foreshadow)
· `scale` 860,550,180,90 (foreshadow) · `shard3` 1145,510,90,70 · `locker`
1330,230,210,400 (→ puzzle) → `locker_open` (items) · `coredoor` 1545,290,55,360 (exit).
**Items:** Blue Keycard, Biogel Canister, shard 3.
**Puzzle "Med Locker":** UV-reveal keypad + year cross-reference → 2085.

### Upgrade plan
- **Background plate:** split space — crew quarters (bunks, personal clutter) and a
  clinical med bay (locker, scale, neural-lab tray, screens).
- **Prop sprites:** Ibarra's datapad (legible log); memorial plaque; crew manifest
  screen (VOSS ... DECEASED / NEURAL BACKUP: COMPLETE — foreshadow, keep readable); med
  scale reading 212.4 KG; the folded sixth bunk; med locker + keypad; shard 3.
- **Interaction upgrade:** the UV-reveal is the star beat — hold the UV lamp over the
  keypad and the four greasy digits fluoresce. Make the lamp sweep reveal prints
  dynamically; keypad accepts 2085. This is the franchise "light-reveal via carried
  item" signature (candle → UV lamp → amber lens) — lean into it.

---

## Deck 4 — AI Core
**★★★★ peak 1 · logic gates · ~10 min · [room4-aicore.js](../../public/starfall-station/js/rooms/room4-aicore.js)**

### Logic
The core is dark and **empty** — status "RESIDENT INSTANCE: MIGRATED → MAINTENANCE
CHASSIS 7" (the twist hiding in plain sight). Restore isolation logic: four breakers
A/B/C/D; etched schematic **DOOR = A AND (NOT B) AND (C OR D)**, **ALARM = B OR ((NOT C)
AND D) OR (C AND D)**. Door live, alarm dark → **A=1, B=0, C=1, D=0**. A fused relay
first refuses all switching — draw the slug with the **magnet stylus**.

### Visible elements
| Element | Anchor | Notes |
|---|---|---|
| Dead server racks (curving around) | 240,150 390×470 | |
| Empty AI cradle + socket | 640,420 320×160 | pedestal readout = twist clue |
| **Shard 4** (2 peaks, "W") by the socket | 895,485 55×65 | |
| Breaker panel (A/B/C/D) | ~ | the puzzle |
| Etched wall schematic | 1120,70 350×130 | the truth table |
| Far bulkhead | ~ | exit |

### Interactive elements
**Hotspots:** `cradle` 640,420,320,160 (twist clue: migrated → chassis 7) · `shard4`
895,485,55,65 · `schematic` 1120,70,350,130 (gate logic) · `racks` 240,150,390,470
(flavor). Breaker panel → puzzle.
**Items:** shard 4 (magnet stylus consumed on the relay slug).
**Puzzle "Isolation Breakers":** four toggles A/B/C/D against the etched gate logic →
A up, B down, C up, D down.

### Upgrade plan
- **Background plate:** dark AI core chamber, curving banks of dead server racks, a
  central empty cradle where a mind used to plug in, cyan status glows.
- **Prop sprites:** the empty cradle with a pedestal readout screen (MIGRATED → CHASSIS 7
  — the twist clue, keep legible); the breaker panel with four physical switches; the
  etched wall schematic (the two boolean equations — must be readable, it's the puzzle
  key); shard 4; the fused relay + magnet-stylus interaction.
- **Interaction upgrade:** the breakers as real levers that throw with a heavy clunk;
  live DOOR/ALARM indicator lamps that update as you toggle (so players can reason
  against the gates), the alarm flashing red on a wrong combo. This is a peak logic
  puzzle — a clear, legible schematic and responsive indicator lamps make it fair and
  satisfying.

---

## Deck 5 — Observation Deck
**★★ breather · symbol substitution + dials · ~8 min · [room5-observation.js](../../public/starfall-station/js/rooms/room5-observation.js)**

### Logic
The station tumbles (scene subtly tilted). Attitude "ghosts" drift on the dome glass:
`P: ▲•` · `Y: •◆◇` · `R: ○`. Calibration card: **▲=1 •=2 ◆=8 ◇=4 ○=0**. Set PITCH **12**,
YAW **284**, ROLL **0** → the deck rights itself, comms powers, log gives **RV-7 HOLDING:
AZ 117 / EL 43** (journaled, needed in D7).

### Visible elements
| Element | Anchor | Notes |
|---|---|---|
| Dome + space + planet limb (entry heat) | top | glowing faintly |
| Attitude ghosts (glyph HUD on glass) | 320,110 930×150 | the cipher strings |
| Dome ribs | | |
| Deck floor (doesn't tilt — you do) | mid | subtle rotation |
| Telescope + housing + **shard 5** (4 peaks, "K") | 200,490 / 272,588 | |
| Calibration card (clipped to mount) | 350,565 150×120 | the substitution key |
| Attitude console | ~ | pitch/yaw/roll dials |
| Comms console | 1110,650 320×170 | RV-7 vector log |
| Companionway down | 1490,380 110×260 | exit |

### Interactive elements
**Hotspots:** `ghosts` 320,110,930,150 (cipher) · `card` 350,565,150,120 (key) · `shard5`
272,588,55,60 · `telescope` 200,490,240,110 · `comms` 1110,650,320,170 (vector log) ·
`exit` 1490,380,110,260. Attitude console → puzzle.
**Items:** shard 5. (Journal note: RV-7 vector AZ 117 / EL 43.)
**Puzzle "Attitude Control":** three dials PITCH/YAW/ROLL, decode glyphs via the card →
12 / 284 / 0.

### Upgrade plan
- **Background plate:** observation dome — curved glass onto starfield and the glowing
  planet limb (entry heat), dome ribs, a telescope, consoles. Render the whole scene at
  a **slight tilt** to sell the tumble (righting on solve).
- **Prop sprites:** the drifting **attitude ghosts** (translucent glyph strings on the
  glass — ▲•, •◆◇, ○); the calibration card (the substitution key, legible); telescope +
  housing + shard 5; comms console screen (RV-7 vector, keep legible for the journal).
- **Interaction upgrade:** three real attitude dials that spin to numbers; the ghosts as
  animated HUD projections that resolve as you enter the right values; the whole deck
  rotating upright on solve (a great, cheap wow-moment). Breather room — the tilt gimmick
  + a clean starfield plate do the heavy lifting.

---

## Deck 6 — Reactor Control
**★★★★ peak 2 · constrained resource balancing · ~9 min · [room6-reactor.js](../../public/starfall-station/js/rooms/room6-reactor.js)**

### Logic
Emergency cells **40, 25, 15, 10**; three buses with exact demands — LIFE SUPPORT **50**,
DOOR SERVOS **25**, UPLINK PRE-CHARGE **15** — and "MAX TWO CELLS PER BUS." Only **40+10**
makes 50; then 25→door, 15→uplink. The LIFE SUPPORT socket holds a slagged fuse — extract
with the **magnet stylus**. On balance the uplink bus ejects a **charged capacitor**.

### Visible elements
| Element | Anchor | Notes |
|---|---|---|
| Reactor torus | 520,130 560×340 | the hero object; glowing |
| Coolant manifold + **shard 6** (7 peaks, "P") | 205,455 60×70 | |
| Control pit: bus panel | mid | three buses w/ demands |
| Emergency cell rack (40/25/15/10) | 1070,110 460×150 | |
| Servo door | 117 | exit |

### Interactive elements
**Hotspots:** `torus` 520,130,560,340 (flavor/atmosphere) · `shard6` 205,455,60,70 ·
`rack` 1070,110,460,150 (cell demands clue). Bus panel → puzzle.
**Items:** Charged Capacitor, shard 6.
**Puzzle "Emergency Power Distribution":** assign the four cells across three buses under
the 2-cell limit → 40+10 / 25 / 15.

### Upgrade plan
- **Background plate:** reactor control — a glowing toroidal reactor dominating the room,
  a control pit with a bus distribution panel, a rack of emergency cells, a servo door.
- **Prop sprites:** the reactor torus (pulsing energy — the room's centerpiece); the four
  emergency cells (labeled 40/25/15/10, draggable); the three bus sockets (labeled with
  demands 50/25/15); the coolant manifold + shard 6; the slagged fuse + magnet-stylus
  extraction; the ejected charged capacitor.
- **Interaction upgrade:** drag cells into bus sockets, each bus showing its demand and
  filling/turning green (or rejecting a third cell per the limit); the LIFE SUPPORT
  socket blocked by a visible slagged fuse until the stylus pulls it. Peak puzzle — make
  the demand math legible and the capacitor eject with a physical clunk.

---

## Deck 7 — Pod Bay → Uplink Array (TWIST + META)
**★★★ · twist + meta synthesis · ~12 min · [room7-podbay.js](../../public/starfall-station/js/rooms/room7-podbay.js)**

### Logic
**Phase 1 (pod / twist):** the biometric arch scans and rejects you — *NO ORGANIC
SIGNATURE DETECTED*; the pod seals and ejects **empty**, saving itself. Gus: "Look at
your hands, Elin." The reveal (your hands → the dark viewport that finally shows a
reflection: a maintenance drone → the shards' memories reassembling) opens the bulkhead
to the uplink array. **Phase 2 (uplink / meta):** (1) repair the cracked emitter with
**biogel**; (2) power it with the **charged capacitor**; (3) passphrase — sort shards by
wave-peaks → **WAKEUP**; (4) align the dish to the RV-7 vector **AZ 117 / EL 43** →
TRANSMIT. Gus asks to come; his core slots in beside yours. Victory: **SIGNAL FOUND.**

### Visible elements
| Element | Anchor | Notes |
|---|---|---|
| Launch doors / the burn beyond | top | |
| The escape pod (until it ejects) | 660,420 300×220 | seals empty after reject |
| Biometric arch | 330,280 190×360 | the reject scanner |
| Dark viewport (finally shows a reflection) | 80,255 220×205 | the reveal |
| Rear bulkhead to the array | | opens post-reveal |
| **(array scene)** uplink console | 1050,550 460×250 | the four steps |
| RV-7 (chip of light) | 1240,130 150×90 | the target |
| The burn below (re-entry glow) | 200,560 350×200 | rising fire |
| Dish + emitter head + capacitor socket | 287–317 | mend/power targets |

### Interactive elements
**Hotspots (pod bay):** `pod` 660,420,300,220 (→ biometric reject → twist) · `arch`
330,280,190,360 · `hands` 600,660,400,160 (reveal: "Your Hands" modal) · `window`
80,255,220,205 (reveal: reflection).
**Hotspots (array):** `console` 1050,550,460,250 (→ uplink steps) · `rv7`
1240,130,150,90 · `burn` 200,560,350,200.
**Puzzles:** "Voiceprint Passphrase" (shards by peaks → WAKEUP) · "Dish Alignment"
(AZ 117 / EL 43) · "One Last Thing" (slot Gus's core beside yours).

### Upgrade plan
- **Background plates (two):** (1) the pod bay — one warm prepped escape pod, a
  biometric arch, a dark viewport; (2) the uplink array — open to space through the
  array frame, RV-7 a distant chip of light, the planet's re-entry glow rising below
  (hottest/reddest of the whole game — the countdown made visual).
- **Prop sprites:** the escape pod (prepped → sealed/ejected empty); the biometric arch
  with its scan/reject readout; the dark viewport that resolves into a **drone reflection**
  (the reveal — this is the emotional centerpiece); the uplink console with four sockets
  (mend/power/speak/aim); the cracked dish emitter (repaired w/ biogel); the capacitor
  socket; Gus's core chip.
- **Interaction upgrade:** the reject scan and empty-pod ejection as a scripted beat; the
  "look at your hands / the reflection" reveal as a slow, deliberate sequence (not a
  modal to click past); then the uplink as four earned steps — gel the emitter, seat the
  capacitor, enter WAKEUP on a voiceprint pad, align two dials to AZ/EL, TRANSMIT as the
  sky turns to fire. This finale carries the twist — the reflection art and the
  transmit-as-station-burns ending deserve the most polish in the game.
