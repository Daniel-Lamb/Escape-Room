# Trial by Jury — Design

**A social-deduction co-op for 4–8 players · sequel to The Wild Court · ~45 min.**
Group escape room, browser-native, no networking. Each player opens the game on
their own device and takes one of four witness roles; coordination is verbal.
Live at `public/trial-by-jury/`.

## Premise

The Court's fig-hoard was raided during the truce, and the old Sloth stands
accused — though the Sloth could no more climb the hoard wall than fly it. Four
animals witnessed the night from four vantages. The jury (the players) must
cross-examine, catch the **one witness who is lying to the bench**, and name the
**true thief**.

## Scope note

Quick-play / party scope (5 scenes), like The Vault. The "social deduction" is
delivered cooperatively and content-first (no hidden-traitor networking, which a
browser with no server can't enforce): the lie lives in the *case*, and the
players expose it by laying their half-accounts side by side. The payoff is a
two-part **verdict** meta.

## The mechanic — cross-examination as a cross-read

Same proven cyclic cross-read as The Vault, re-skinned as testimony. Four
witnesses in a ring:

```
Heron → Gecko → Boar → Parrot → Heron
```

Each scene, every witness has their own three-figure account to swear. The
figure your account is missing is **not** on your screen — only the witness
before you (PREV) saw it; your screen holds the figure the witness after you
(NEXT) is missing. So everyone cross-examines and everyone advances their own
save. Cover all four witnesses (double up if fewer than four play).

## Witnesses

| Key | Witness | Vantage | Note |
|-----|---------|---------|------|
| p1 | The Heron | watched from the river | |
| p2 | The Gecko | clung to the wall all night | **the liar** |
| p3 | The Boar | rooted below the fig-tree | |
| p4 | The Parrot | repeats all it hears | |

## Scenes & figures

| # | Scene | Heron | Gecko | Boar | Parrot | Exhibit |
|---|-------|-------|-------|------|--------|---------|
| 1 | The Fig-Tree | 428 | 173 | 905 | 651 | Heron #1="C" |
| 2 | The Truce-Stone | 380 | 749 | 216 | 524 | Gecko #2="R" |
| 3 | The Muddy Bank | 617 | 093 | 458 | 832 | Boar #3="O" |
| 4 | The Broken Bough | 254 | 806 | 371 | 149 | Parrot #4="W" |
| 5 | The Verdict (meta) | — | | | | — |

The lore in each scene quietly builds the case against the Crow (black feathers,
light clawed tracks up the wall, a snapped bough) and against the Gecko (swore
they never left the far bank — yet their prints are in the mud).

## Meta — the verdict

Every witness reaches the verdict bench. A bespoke two-part puzzle:

1. **Which witness lied?** — pick one of the four. Answer: **the Gecko** (p2).
2. **Name the thief.** — four letter-dials; the four exhibits spell, in order
   #1–#4, **C R O W**.

Both correct → **Guilty** verdict → victory. Each of the four exhibits is logged
by a different witness, so the name can't be spelled unless all four played.

## Gus

**A golden tamarin** — the same advocate from The Wild Court, now **clerk of the
court**, in a small robe with a brass bell. The diegetic reason the witnesses
(forbidden to confer directly) can pass a figure between them. Falls back to the
hand-authored SVG portrait. Hint tiers: *a rap of the bell* (−1:00) / *the point
of order* (−2:00) / *the plain finding* (−4:00).

## Framing

- **Victory — Verdict: Guilty / The Truce Holds.** Four half-truths laid honestly
  side by side leave a liar nowhere to stand.
- **Defeat — Mistrial / The Court Adjourns.** The accounts were all there, half
  in each of four mouths, but never laid side by side in time.

## Engine notes

- `js/role.js` — four witness roles, `NEXT`/`PREV` cycle, per-role save key.
- `js/jurykit.js` — procedural jungle-court backdrop, `roleTag`, K-slot
  `comboLock`, `evidenceCard`, and `buildRoom(cfg)` (the cross-examination
  factory). Default three-tier hints live here.
- Rooms 1–4 are `buildRoom({...})` data; room 5 (the verdict) is bespoke, with
  a witness-picker + letter-dials puzzle.
- Standing house rules honoured: Gus top-left reserve kept clear; narration in
  the bottom bar; three-tier hints on every account + the verdict; zero
  dependencies, hand-authored SVG; boot resumes with `loadState()`.
