# Twin Signal Towers — Complete Walkthrough

> ⚠️ **Total spoilers**, both towers. This is a **two-player co-op**: West Tower = Player 1,
> East Tower = Player 2, on two screens. In every scene the answer to *your* lock is shown
> on *your partner's* screen — so the "solution" for each side is something you must hear
> from the other player. Ask Gus (the storm petrel) if stuck; his third hint gives the
> answer outright.

Design doc: [DESIGN-SIGNALTOWERS.md](DESIGN-SIGNALTOWERS.md).

## How to run it
Open `signal-towers/` on **two** devices/tabs. One player picks **West Tower**, the other
**East Tower**. Stay on a call or in the same room. Play through the seven scenes together;
each tower advances when its own lock is solved.

## The six bearing-marks (the finale currency)
Each keeper finds only three. Pool all six and sort by bearing (1→6): **A S H O R E**.

| Bearing | Letter | Scene | Found by |
|---|---|---|---|
| 1 | A | 2 Lamp Room | East (P2) |
| 2 | S | 1 Watch Room | West (P1) |
| 3 | H | 4 Chart Room | East (P2) |
| 4 | O | 3 Signal Gallery | West (P1) |
| 5 | R | 6 Beam Engine | East (P2) |
| 6 | E | 5 Bell Loft | West (P1) |

West holds S(2) O(4) E(6); East holds A(1) H(3) R(5).

---

## Scene 1 — The Watch Room (cross-read combination)
Your hatch code is on your partner's wall.
- **West wall** shows "EAST HATCH — 5 · 2 · 8" → West reads it to East. **East enters 5-2-8.**
- **East wall** shows "WEST HATCH — 3 · 7 · 1" → East reads it to West. **West enters 3-7-1.**
- West also takes bearing-mark **S (2)** from the stair newel. Then both climb.

## Scene 2 — The Lamp Room (rotation alignment)
Turn your four Fresnel panels to the bearings on your partner's lamp-card.
- **West panels: NE, SE, W, S** (read off the West lamp-card that East is holding).
- **East panels: E, S, NW, N** (read off the East lamp-card that West is holding).
- East takes bearing-mark **A (1)** from the lamp tray. Both climb.

## Scene 3 — The Signal Gallery (flash decode)
You can see your ship's flashes but not read them; your partner holds the codebook page.
- **West** sees flashes **1, 2, 3, 4** → reads counts to East → East's Page A (1=H,2=O,3=L,4=D)
  → **West enters HOLD.**
- **East** sees flashes **2, 3, 1, 4** → reads counts to West → West's Page B (1=R,2=T,3=U,4=N)
  → **East enters TURN.**
- West takes bearing-mark **O (4)** by the telescope. Both climb.

## Scene 4 — The Chart Room (combine half-charts)
- **West** sees the rocks: Channels I and IV are fouled. **East** sees the depths: Channels
  II and IV are too shallow. The only channel both clear and deep is **Channel III**.
- Both select **Channel III**. East takes bearing-mark **H (3)** pinning the chart. Both climb.

## Scene 5 — The Bell Loft (split rule + values)
Your bell's toll-count = your gauges, using your partner's rule.
- **West** gauges 9 and 4; East's plate holds the West rule "difference" → **West tolls 5** (9−4).
- **East** gauges 5 and 3; West's plate holds the East rule "sum" → **East tolls 8** (5+3).
- West takes bearing-mark **E (6)** from the bell yoke. Both climb.

## Scene 6 — The Beam Engine (valve pattern)
Set your five valves to the pattern on your partner's schematic.
- **West valves: OPEN, SHUT, OPEN, OPEN, SHUT.**
- **East valves: SHUT, OPEN, OPEN, SHUT, OPEN.**
- East takes bearing-mark **R (5)** from the governor housing. Both climb.

## Scene 7 — The Lantern Crown (finale · meta)
The wreckers' false light burns; drown it by setting the beam to the harbour word.
- Read each other your three marks. All six, sorted by bearing 1→6: A, S, H, O, R, E.
- Both enter **ASHORE** on the beam-bearing wheel.
- Both beams swing onto the channel, the false light drowns, the Meridian makes harbour.
  **SAFE HARBOUR.**

## Quick answer key
| Scene | West (P1) | East (P2) |
|---|---|---|
| 1 Watch Room | hatch **371** | hatch **528** |
| 2 Lamp Room | **NE, SE, W, S** | **E, S, NW, N** |
| 3 Signal Gallery | **HOLD** | **TURN** |
| 4 Chart Room | **Channel III** | **Channel III** |
| 5 Bell Loft | toll **5** | toll **8** |
| 6 Beam Engine | **O,S,O,O,S** | **S,O,O,S,O** |
| 7 Lantern Crown | **ASHORE** | **ASHORE** |
