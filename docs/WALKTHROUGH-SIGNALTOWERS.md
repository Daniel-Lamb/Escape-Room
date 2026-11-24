# Twin Signal Towers — Complete Walkthrough

> ⚠️ **Total spoilers**, both towers. This is a **two-player co-op**: West Tower = Player 1,
> East Tower = Player 2, on two screens. In every scene, what *your* lock needs is split:
> some of it is on your screen, the rest on *your partner's* — in the later scenes one of
> you holds the data and the other the rule for using it. Cards you read across are kept in
> your **signal book**, top right. Ask Gus (the storm petrel) if stuck; his third hint gives the
> answer outright.

Design doc: [DESIGN-SIGNALTOWERS.md](DESIGN-SIGNALTOWERS.md).

## How to run it
Open `signal-towers/` on **two** devices/tabs. One player picks **West Tower**, the other
**East Tower**. Stay on a call or in the same room. Play through the seven scenes together;
each tower advances when its own lock is solved.

## The six bearing-marks (the finale currency)
Each mark is a little brass compass plate: its needle points one way round the rose, with
a letter under it. Each keeper finds only three. Pool all six and sweep sunwise from north
(N, NE, E, SE, S, SW): **A S H O R E**.

| Needle | Letter | Scene | Found by |
|---|---|---|---|
| N | A | 2 Lamp Room (tray at the pedestal's foot) | East (P2) |
| NE | S | 1 Watch Room (stair newel) | West (P1) |
| E | H | 4 Chart Room (pinning the chart) | East (P2) |
| SE | O | 3 Signal Gallery (telescope tripod) | West (P1) |
| S | R | 6 Beam Engine (drive housing) | East (P2) |
| SW | E | 5 Bell Loft (bell headstock) | West (P1) |

West holds S(NE) O(SE) E(SW); East holds A(N) H(E) R(S).

---

## Scene 1 — The Watch Room (cross-read combination)
Your hatch code is on your partner's wall.
- **West wall** shows "EAST HATCH — 5 · 2 · 8" → West reads it to East. **East enters 5-2-8.**
- **East wall** shows "WEST HATCH — 3 · 7 · 1" → East reads it to West. **West enters 3-7-1.**
- West also takes bearing-mark **S (needle NE)** from the stair newel. Then both climb.

## Scene 2 — The Lamp Room (reef bearings × aiming rule)
Each of your four panels must throw its light clear of the reef it guards. The reefs round
your lamp are in your partner's signal book; your lamp's own brass plate says how to aim.
- **West rule:** the point OPPOSITE the reef. East reads West its reefs **SW, NW, E, N** →
  **West panels: NE, SE, W, S.**
- **East rule:** a quarter-turn SUNWISE of the reef. West reads East its reefs **N, E, SW, W** →
  **East panels: E, S, NW, N.**
- East takes bearing-mark **A (needle N)** from the tray at the lamp pedestal's foot. Both climb.

## Scene 3 — The Signal Gallery (flash decode)
You can see your ship's flashes but not read them; your partner holds the codebook page.
- **West** sees flashes **1, 2, 3, 4** → reads counts to East → East's Page A (1=H,2=O,3=L,4=D)
  → **West enters HOLD.**
- **East** sees flashes **2, 3, 1, 4** → reads counts to West → West's Page B (1=R,2=T,3=U,4=N)
  → **East enters TURN.**
- West takes bearing-mark **O (needle SE)** from the telescope tripod. Both climb.

## Scene 4 — The Chart Room (combine half-charts)
- **West** sees the rocks: Channels I and IV are fouled. **East** sees the depths: Channels
  II and IV are too shallow. The only channel both clear and deep is **Channel III**.
- Both select **Channel III**. East takes bearing-mark **H (needle E)** pinning the chart. Both climb.

## Scene 5 — The Bell Loft (split rule + values)
Your bell's toll-count = your gauges, using your partner's rule.
- **West** gauges 9 and 4; East's plate holds the West rule "difference" → **West tolls 5** (9−4).
- **East** gauges 5 and 3; West's plate holds the East rule "sum" → **East tolls 8** (5+3).
- West takes bearing-mark **E (needle SW)** from the bell headstock. Both climb.

## Scene 6 — The Beam Engine (line pressures × valve rule)
The towers share one pressure main, so your line pressures show only on your partner's
repeater (in their signal book). Your engine's plate gives the rule.
- **West rule:** open the EVEN readings. East reads West **24, 37, 18, 42, 51** →
  **West valves: OPEN, SHUT, OPEN, OPEN, SHUT.**
- **East rule:** open any reading ABOVE 30 lb. West reads East **22, 46, 38, 15, 33** →
  **East valves: SHUT, OPEN, OPEN, SHUT, OPEN.**
- East takes bearing-mark **R (needle S)** from the drive housing. Both climb.

## Scene 7 — The Lantern Crown (finale · meta)
The wreckers' false light burns; drown it by setting the beam to the harbour word.
- Read each other your three marks as "needle, letter". The plaque: sweep the beam
  sunwise from north. N:A, NE:S, E:H, SE:O, S:R, SW:E.
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
