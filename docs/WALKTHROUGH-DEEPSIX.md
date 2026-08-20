# Deep Six — Complete Walkthrough

> ⚠️ **Total spoilers**, both ends of the line. A **two-player asymmetric co-op**:
> The Diver = Player 1 (down on the wreck of the *Cormorant*), The Tender = Player 2
> (topside on the salvage boat *Halcyon*). Every lock's answer is on the other player's
> screen — so each "solution" is something you must hear from your partner. Ask Gus (the
> harbor seal) if stuck; his third hint gives the answer.

Design doc: [DESIGN-DEEPSIX.md](DESIGN-DEEPSIX.md).

## How to run it
Open `deep-six/` on **two** devices/tabs. One picks **The Diver**, the other **The
Tender**. Stay on a call. Play the seven scenes together; each end advances when its own
lock is solved. Saves are per role.

## The six depth-marks (the finale currency)
Each end recovers only three. Pool all six and sort by **fathom depth, shallowest
first**, to read the ascent word: **ASCEND**.

| Fathoms | Letter | Scene | Recovered by |
|---|---|---|---|
| 5 | A | 1 Descent Line | Diver |
| 8 | S | 2 Silt Field | Tender |
| 11 | C | 3 Flooded Corridor | Diver |
| 14 | E | 4 Boiler Room | Tender |
| 17 | N | 5 Wireless Room | Diver |
| 20 | D | 6 Machinery Space | Tender |

Diver holds A(5) C(11) N(17); Tender holds S(8) E(14) D(20).

---

## Scene 1 — The Descent Line (cross-read combination)
Each end's three-ring code is shown on the *other* end's screen.
- **Diver's screen** shows the **winch brake 4-1-7** → read to Tender. **Tender enters 4-1-7.**
- **Tender's screen** shows the **deck hatch 6-2-9** → read to Diver. **Diver enters 6-2-9.**
- Diver recovers depth-mark **A (5 fm)** from the line. Both go on.

## Scene 2 — The Silt Field (sonar overlay)
- **Tender's sonar** marks the buried airlock at cell **C-4** → read to Diver. **Diver sets the dig marker to C-4.**
- **Diver's sounder** reads the gain **0-8-8** → read to Tender. **Tender sets sonar gain 0-8-8.**
- Tender recovers depth-mark **S (8 fm)** from the chart. Both go on.

## Scene 3 — The Flooded Corridor (optics · mirror beam)
- **Tender's optical plan** shows the three mirror angles **3-7-4** → read to Diver. **Diver sets the mirror swivels 3-7-4** (the beam wakes the photocell).
- **Diver's corridor wall** shows the signal-lamp bearing **1-9-5** → read to Tender. **Tender swings the lamp to 1-9-5.**
- Diver recovers depth-mark **C (11 fm)** from the bulkhead. Both go on.

## Scene 4 — The Boiler Room (pressure · split-rule)
You can read your own two gauges, but your RULE is on your partner's screen.
- **Diver** gauges **12 & 5**; the **Diver's rule** (on the Tender's panel) is **SUM** → **Diver sets ballast 17** (12 + 5).
- **Tender** gauges **9 & 4**; the **Tender's rule** (on the Diver's panel) is **GAP** → **Tender sets pump 05** (9 − 4).
- Tender recovers depth-mark **E (14 fm)** from the compressor. Both go on.

## Scene 5 — The Wireless Room (morse-flash decode)
You can count your own flashes but only your partner's codebook reads them.
- **Diver** flashes **3-2-1-4** → Tender's Page A (1→D 2→I 3→T 4→E) → T,I,D,E → **Diver enters TIDE.**
- **Tender** flashes **4-1-2-3** → Diver's Page B (1→I 2→V 3→E 4→D) → **D,I,V,E** → **Tender enters DIVE.**
- Diver recovers depth-mark **N (17 fm)** from the set. Both go on.

## Scene 6 — The Machinery Space (coupled mechanism)
- **Diver's engine telegraph** has four pointers on three *coupled* levers (A turns 1&2,
  B turns 2&3, C turns 3&4). The **Tender's schematic** shows the target **1-2-2-1** →
  **Diver pulls A once, B once, C once.**
- **Diver's gauge** shows the winch load **12** → read to Tender. **Tender sets the winch to 12.**
- Tender recovers depth-mark **D (20 fm)** from the winch drum. Both go on.

## Scene 7 — The Ascent (finale · meta)
Read each other your three depth-marks. Order all six by fathom, shallowest first:
5-**A**, 8-**S**, 11-**C**, 14-**E**, 17-**N**, 20-**D** → **ASCEND**. Both set **ASCEND**
on the decompression wheel; the ballast blows and you break the surface together.
**SURFACED.**

## Quick answer key
| Scene | Diver (P1) | Tender (P2) |
|---|---|---|
| 1 Descent Line | hatch **629** | winch **417** |
| 2 Silt Field | dig cell **C4** | gain **088** |
| 3 Flooded Corridor | mirrors **374** | lamp **195** |
| 4 Boiler Room | ballast **17** (SUM of 12,5) | pump **05** (GAP of 9,4) |
| 5 Wireless Room | **TIDE** | **DIVE** |
| 6 Machinery Space | telegraph **A,B,C ×1** (1-2-2-1) | winch **12** |
| 7 Ascent | **ASCEND** | **ASCEND** |
