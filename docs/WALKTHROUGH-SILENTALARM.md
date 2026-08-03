# Silent Alarm — Walkthrough (spoilers)

A two-player asymmetric co-op heist. **The Hand** (Player 1) is inside the Larkspur Museum;
**The Eye** (Player 2) is in the van. Play on two screens and talk — every lock's answer is
on the *other* player's screen. Save is per role. Sixty minutes to the dawn shift.

Notation: **H** = what The Hand does, **E** = what The Eye does. Each scene, both must solve
their own lock; neither is solvable without the partner reading their screen aloud.

---

### Scene 1 — The Service Door / The Van (tutorial)
- **H** reads the alley box to E: **FEED UPLINK 8-2-6-0**. **E** enters **8 2 6 0** on the
  uplink to bring the feed live.
- **E** reads the door schematic to H: **SERVICE DOOR 5-1-9-3**. **H** enters **5 1 9 3** on
  the keypad.
- **H** takes the steel **pin b (position 2, digit 2)** from the strike-plate, then slips in.
- Examine the Client's brief for the file: *"do not open the inner case. — C."*

### Scene 2 — The Camera Room / The Feed Matrix
- 8-point bearings: N NE E SE S SW W NW.
- **H** reads the patch-card to E (the Eye's four channels): **NE, SE, W, S**. **E** routes
  the four channels to **NE SE W S** = `[1,3,6,4]`.
- **E** reads the aim-card to H (the Hand's four cameras): **E, S, NW, N**. **H** aims the
  four cameras to **E S NW N** = `[2,4,7,0]`.
- **E** takes **pin a (position 1, digit 7)** from the DVR metadata.
- Foreshadow (E): the Client knows the guard rounds to the minute and says *ignore anything
  else you see*.

### Scene 3 — The Marble Gallery / The Laser Grid (hardest)
- **H** reads the laser burst-counts to E: **1, 2, 3, 4**. **E** decodes on page A
  (1→S 2→A 3→F 4→E) → **SAFE**, and tells H. **H** enters **SAFE** to kill the grid.
- **E** reads the alarm blink-counts to H: **4, 1, 3, 2**. **H** decodes on page B
  (1→A 2→K 3→R 4→D) → **DARK**, and tells E. **E** enters **DARK** to silence the panel.
- **H** takes **pin d (position 4, digit 4)** from the statue plinth.
- Foreshadow (either): a guard's note — the bird is being taken *before an insurance audit*.

### Scene 4 — The Records Room / The Database
- Four boxes I–IV; one holds the vault key.
- **H** can rule out **I** and **IV** (drilled decoys). **E** can rule out **II** and **IV**
  ("relocated"). Pool both: only **III** survives. Both choose **box III**.
- **E** takes **pin c (position 3, digit 9)** from the decrypted manifest.
- Foreshadow (E): the Client — *"take the key, leave the ledger."*

### Scene 5 — The Clock Hall / The Automata
- **H**'s gauges read **9** and **4**; **E**'s plate says *"set the DIFFERENCE."* → **H sets
  5** (9 − 4).
- **E**'s readouts read **6** and **2**; **H**'s plate says *"set the SUM."* → **E sets 8**
  (6 + 2).
- **H** takes **pin f (position 6, digit 6)** from the pendulum bob.
- Foreshadow (either): the clockmaker's plate — *"a lock made for a pair, so no one man could
  ever take it alone."*

### Scene 6 — The Power Room / The Breakers (twist)
- **H** reads their schematic (the Eye's pattern) to E: **DOWN, UP, UP, DOWN, UP**. **E** sets
  those five relays.
- **E** reads their schematic (the Hand's pattern) to H: **UP, DOWN, UP, UP, DOWN**. **H**
  sets those five breakers.
- **E** takes **pin e (position 5, digit 1)** from the firmware dump.
- **Twist:** on cutting the ring, Gus reveals the Client's hidden trip-wire — the alarm is
  meant to fire *when the vault opens*, framing the crew. Gus has already chewed it dead.

### Scene 7 — The Vault / The Nightingale (finale + meta)
- Pool all six pins and sort by **position 1→6**:
  - E holds positions 1, 3, 5 = **7, 9, 1**.
  - H holds positions 2, 4, 6 = **2, 4, 6**.
  - Ordered 1→6: **7-2-9-4-1-6** = **729416**.
- **Both** enter **729416** on the master timelock. **Ignore** the Client's demanded code
  `000000` (the frame). The vault opens clean, the silent alarm stays silent, and the
  Nightingale is yours. → **CLEAN GETAWAY.**

---

**Fairness note.** Wrong answers only cost time via Gus's three hints (nudge −1:00, method
−2:00, answer −4:00); nothing ever locks out. Every clue journals to the Job File on first
examine and stays re-readable. The full master is derivable once both files are pooled. The
one hard rule: no lock's answer is ever visible on the screen that must enter it.
