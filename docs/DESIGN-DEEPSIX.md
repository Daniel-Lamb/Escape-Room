# Deep Six — Design Doc

**Type:** two-player asymmetric co-op (the fourth live duo). **Length:** ~1 hour, 7
scenes. **Slug:** `deep-six`. Built to showcase mechanics players praise in
[PUZZLE-DESIGN-REFERENCE.md](PUZZLE-DESIGN-REFERENCE.md).

## Premise
A night salvage on the wreck of the *Cormorant*. **The Diver** (P1) is down on the hull
with a lamp and a finite line of air; **The Tender** (P2) is topside on the *Halcyon* at
the sonar, radio, chart, and winch. The dive umbilical is the diegetic reason they talk.
Every lock below is answered by an instrument above, and vice versa — neither can finish
alone. One hour of air.

## Roles & the asymmetry
- **Diver (P1):** the photoreal flooded wreck (video backdrops per scene). Physical
  locks — valves, mirrors, ballast, a coupled telegraph.
- **Tender (P2):** a procedural boat cabin — sonar scope, porthole, instrument panel
  (same across scenes, in the Silent Alarm "van stays procedural" tradition).
- Invariant: **no lock's answer is ever on the screen that must enter it.** Each end
  reads the other's code/reading/rule off its own instruments.

## Gus's skin
- **Name/epithet:** Gus — harbor seal, at home in both the deep and the deck.
- **Form:** `seal`. Photoreal cut-out portrait (`art/gus.webp`); SVG fallback in `gus.js`.
- **Voice:** the crossing-swimmer who carries what neither can carry alone; hint tiers
  *A nudge from the line / The bearing / The whole course*; buy label *Send Gus across*.

## Scene sequence (each a reference mechanic, each a cross-read)
1. **Descent Line** — cross-read combination (Diver hatch 629 / Tender winch 417). Tutorial.
2. **Silt Field** — sonar overlay (Diver digs cell C4 from the Tender's sonar / Tender sets gain 088 from the Diver's sounder).
3. **Flooded Corridor** — optics, mirror-beam (Diver mirrors 374 / Tender lamp bearing 195).
4. **Boiler Room** — pressure split-rule (you see your gauges, your rule is on the partner's screen: SUM→17 / GAP→05).
5. **Wireless Room** — morse-flash decode (your flashes, the partner's codebook: TIDE / DIVE).
6. **Machinery Space** — coupled mechanism (Diver's four pointers on three coupled levers → 1-2-2-1 / Tender winch load 12).
7. **The Ascent** — meta-puzzle finale.

## Meta-puzzle
Six brass **depth-marks**, each stamped a fathom depth + a letter. Each end recovers
three (Diver A/C/N in scenes 1/3/5; Tender S/E/D in scenes 2/4/6). At the surface, order
all six by fathom **shallowest first** — 5-A 8-S 11-C 14-E 17-N 20-D → **ASCEND** — and set
it on the decompression wheel. Clean, single sorting rule, telegraphed in scene 1's mark.

## Foreshadowing
Light-touch, as befits a puzzle-first co-op: the wreck is the *Cormorant*, the ship the
Signal Towers keepers failed to save — a quiet series thread, not a twist. No reveal beat
to plant; the emotional turn is simply the two of you surfacing together.

## Hint ladder (all 7 scenes, nudge/method/answer)
Every scene maps cleanly: nudge = "your answer is on your partner's screen, trade";
method = which instrument holds it / how to combine; answer = the literal code. The
finale's method is the sorting rule, its answer the word ASCEND.

## Layout notes
- Gus reserve (top-left 220×250) kept clear: relay plaque sits center-top (x 556, y 138),
  locks center-bottom (x 620, y 636), depth-marks far right (x 1108). No hotspot enters
  the reserve.
- Narration stays in `#narration-bar`; no scene overlays.
- Diver = video backdrop (`divekit.diverBackdrop`); Tender = procedural
  `tenderBackdrop`. Shared cross-read lock helper `comboLock` (digits/letters); the
  telegraph is a bespoke coupled-lever puzzle.

## Assets
Higgsfield: 7 photoreal underwater plates (Seedance 2.0 boomerang loops + WebP posters)
for the Diver; 1 harbor-seal Gus portrait (background-removed alpha WebP). Tender side is
hand-authored SVG. All in `public/deep-six/art/`.
