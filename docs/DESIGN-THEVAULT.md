# The Vault — Design

**Room V of the series · a co-op heist for 3–6 players · ~45 min.**
Group escape room, browser-native, no networking. Each player opens the game on
their own device and takes one of four crew stations; coordination is verbal, as
in the duo games. Live at `public/the-vault/`.

## Scope note

Built at the **quick-play / party scope** (5 scenes) rather than the 7-scene
solo length — a group game wants to move, and four people coordinating four
locks per scene already fills the hour. Meta is a single clean pooled-combo at
the vault.

## The cross-read, generalised to a crew

The duo games are a symmetric 1↔1 cross-read (each keeper holds the other's
answer). The Vault generalises this to a **cycle of four**:

```
Cracker → Wire → Face → Wheel → Cracker
```

In every scene each station has its **own** three-dial lock. The code that opens
your lock is shown on the screen of the crewmate **before** you in the cycle
(PREV), and your screen shows the code for the crewmate **after** you (NEXT). So
everyone is always both asking and answering, and everyone progresses their own
save by solving their own lock — no passive players.

Three players cover four stations by doubling up (two tabs); five or six ride
shotgun on the busy stations. Every station must be fielded or a lock in the ring
has no holder.

## Roles

| Key | Role | Station |
|-----|------|---------|
| p1 | The Cracker | the vault door |
| p2 | The Wire | the security closet |
| p3 | The Face | the manager's floor |
| p4 | The Wheel | the van, across the street |

## Scenes & codes

Each scene, `codes[role]` is that station's own lock answer (held on PREV's
screen). Chips are the meta collectibles.

| # | Scene | Cracker | Wire | Face | Wheel | Chips found |
|---|-------|---------|------|------|-------|-------------|
| 1 | Getting In | 317 | 528 | 946 | 175 | Cracker #1="4", Wire #2="7" |
| 2 | Killing the Alarms | 482 | 209 | 651 | 730 | Face #3="1", Wheel #4="9" |
| 3 | The Manager's Office | 863 | 194 | 507 | 628 | Cracker #5="3", Wire #6="6" |
| 4 | The Antechamber | 350 | 712 | 489 | 205 | — |
| 5 | The Vault (meta) | — pooled — | | | | — |

## Meta — the master time-lock

Six brass **tumbler-chips** are pocketed across scenes 1–3, each stamped with a
position (1–6) and a digit. Ordered 1→6 they spell the master combination
**4 7 1 9 3 6**. At the vault every station sees the same six-dial lock; the crew
reads their chips aloud, in order, and sets the wheel together. Opening it wins.

The chips distribute so all four stations pocket at least one (Cracker ×2, Wire
×2, Face ×1, Wheel ×1) — the vault cannot be opened unless every station played.

## Gus

**A ferret** — the crew's quartermaster, who slips through ducts and wall-voids
carrying tips between stations (the diegetic reason four people on four screens
can coordinate). Falls back to the hand-authored SVG portrait (no photoreal
asset). Hint tiers: *a chitter* (−1:00) / *the tip-off* (−2:00) / *the whole
score* (−4:00). Default cross-read hints per lock: "your code is on a crewmate's
screen" → "PREV holds yours, you hold NEXT's" → your literal code.

## Framing

- **Victory — Clean Getaway / The Door Comes Open.** You cracked it not by being
  the best at any one station but because none of you could see your own numbers
  and trusted the crewmate who could.
- **Defeat — Caught / The Time-Lock Re-Arms.** The vault's own 60-minute
  time-lock rolls over and seats the bolts for the night.

## Engine notes

- `js/role.js` — four roles, `NEXT`/`PREV` cycle, per-role save key.
- `js/crewkit.js` — procedural steel-and-teal backdrop, `roleTag`, K-slot
  `comboLock`, `chipCard`, and `buildRoom(cfg)` which stamps the standard
  cross-read scene for the current role (relay panel + own lock + optional chip +
  lore). Default three-tier hints live here.
- Rooms 1–4 are `buildRoom({...})` data; room 5 (the vault) is bespoke.
- Standing house rules honoured: Gus top-left reserve kept clear (lock centre,
  chip at x=250 / y=590, lore right); narration in the bottom bar; three-tier
  hints on every lock; zero dependencies, hand-authored SVG.
- Boot uses `loadState(); startRun(true)` on resume (the signal-towers template
  it was cloned from omits `loadState()`, a latent resume bug fixed here).
