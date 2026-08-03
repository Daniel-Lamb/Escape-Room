# The Looking Glass — Design Document

### A two-player asymmetric co-op escape room — free the reflection before the glass breaks at dawn

**Logline:** At midnight the Whitlock mirror pulls one of you through into its reversed
reflection of the manor. The other is still in the waking house. You are each other's
reflection — and everything the mirror shows is backwards. Seven rooms until dawn, and
every lock's answer is on the other side of the glass.

**Folder:** `looking-glass/` · **Series slot:** Room VI · Gothic manor / mirror-world ·
**Save keys:** `looking-glass-p1-save-v1`, `looking-glass-p2-save-v1`

---

## 1. The two-player model

Same architecture as *Twin Signal Towers* (no networking; role chosen at the title screen;
each room renders a per-role variant; each lock's answer lives on the partner's screen).
The theme makes the asymmetry literal: **Player 2 is inside the mirror, so their whole
world is reversed** — text reads backwards, the gallery hangs the wrong way round, numbers
run backwards. Files: `js/role.js` (roles `p1` = Waking Side, `p2` = Glass Side),
`js/glasskit.js` (role-tinted backdrop: warm candlelight for Waking, cold silver for Glass;
`mirrorWrite()` renders reversed text). Save is namespaced per role.

## 2. Story

**Setup.** Player 1 keeps **The Waking Side** — the real manor, warm and candle-lit. Player
2 is caught on **The Glass Side** — the same rooms seen from inside the mirror, silver and
reversed. You have **60 minutes**; at dawn the glass breaks and the one inside is lost
forever. Move through seven rooms — parlour, library, nursery, clock room, portrait gallery,
conservatory, and the mirror hall — trading what only your side can see, until you speak the
glass its true name and pull the reflection back through.

**The heart (not a twist).** Between the two of you moves **Gus, the black manor cat**, who
was never on only one side of the glass. He is the diegetic reason two reflections can
coordinate at all — and, at the end, the quiet proof that the house was always going to let
you both out, if you would only talk.

**Ending.** The six mirror-shards name the glass; the silver goes to water; the reflection
steps back into the room and Gus threads once between you through the open frame. Victory:
**THROUGH THE GLASS — The Glass Gives You Back.**

## 3. Gus's skin — the black cat
- **Epithet:** *"Gus — the manor cat, who crosses the glass as he pleases."*
- **Form:** a sleek black cat with green-gold eyes, sitting astride the mirror-seam.
- **Hint tiers:** `['A slow blink', 'The scent of the path', 'The whole way through']`.
  **buyLabel:** `Coax the cat`.

## 4. Global systems
Shared engine (60:00 timer, inventory, three-tier hints, auto-journal, autosave,
defeat-retry). Skin: journal **"Reflections"**; collectibles are **mirror-shards** (a
number + a letter); inventory label **"Pockets"**. Palette: candlelit indigo/charcoal with
silver (`#0c0a14`/`#141020`/`#1c1830`, silver `#c9ccd6`/`#e8ebf2`, candle `#ffcf8a`).

### The six mirror-shards (the reversed meta)
Each side finds only three. Sorted by number 1→6 they read **R-E-V-L-I-S** — and the glass
keeps its true name reversed, so you **turn it about** to **SILVER**.

| Shard | Room | Found by | Number | Letter |
|---|---|---|---|---|
| R | 1 Parlour | Waking (P1) | 1 | R |
| E | 2 Library | Glass (P2) | 2 | E |
| V | 3 Nursery | Waking (P1) | 3 | V |
| L | 4 Clock Room | Glass (P2) | 4 | L |
| I | 5 Gallery | Waking (P1) | 5 | I |
| S | 6 Conservatory | Glass (P2) | 6 | S |

Waking holds R(1), V(3), I(5); Glass holds E(2), L(4), S(6). Neither can spell it alone; the
finale accepts **SILVER** (the reverse of the pooled reading REVLIS).

## 5. The seven rooms (mechanic · Waking answer / Glass answer)

1. **The Parlour** — *mirror-writing relay* (tutorial). Your door-word is scratched
   backwards on your partner's far wall. **Waking: CANDLE / Glass: HEARTH.** Shard R → Waking.
2. **The Library** — *split cipher.* Each side's lock is a run of marks only the other side's
   diary page decodes. Waking marks ◆●▲■ → **MOTH**; Glass marks ★✚♦♥ → **VEIL**. Shard E → Glass.
3. **The Nursery** — *alignment.* Set four music-box figures to the animals on your partner's
   card. **Waking: Owl, Hare, Wren, Fox / Glass: Wren, Owl, Fox, Hare.** Shard V → Waking.
4. **The Clock Room** — *reversed number.* Your clock shows your partner's code, backwards.
   **Waking: 5271** (glass clock reads 1725) **/ Glass: 8064** (waking clock reads 4608).
   Shard L → Glass.
5. **The Portrait Gallery** — *split riddle, mirror-ordered.* Each side holds half the riddle;
   the keyed sitter fits both (a raven **and** mourning grey = the lady in grey). Both choose
   that portrait (positions differ; the Glass row is mirror-reversed). Shard I → Waking.
6. **The Conservatory** — *tap pattern.* Set five taps to the plan on your partner's plaque.
   **Waking: Open, Shut, Open, Open, Shut / Glass: Shut, Open, Open, Shut, Open.** Shard S → Glass.
7. **The Mirror Hall** — *finale meta.* Pool all six shards, sort 1→6 to read **REVLIS**, then
   turn it about: **SILVER**. Both enter SILVER; the glass opens.

## 6. Difficulty & pacing

| # | Room | Mechanic | Difficulty | Est. min |
|---|------|----------|------------|----------|
| 1 | Parlour | mirror-writing relay | ★☆☆☆☆ | 6 |
| 2 | Library | split cipher | ★★★☆☆ | 9 |
| 3 | Nursery | alignment | ★★☆☆☆ | 7 |
| 4 | Clock Room | reversed number | ★★☆☆☆ | 7 |
| 5 | Gallery | split riddle (mirrored) | ★★★☆☆ | 9 |
| 6 | Conservatory | tap pattern | ★★☆☆☆ | 7 |
| 7 | Mirror Hall | reversed meta word | ★★★☆☆ | 8 |
| | | | **Total** | **53** |

Seven asymmetric mechanics; none is solvable single-handed. Fairness matches the series:
wrong answers cost only hint-time, every clue journals and stays re-readable, and the meta is
derivable once both journals are pooled. Verified end to end: Waking full playthrough →
victory; Glass variants (opposite clues, own shards) confirmed.
