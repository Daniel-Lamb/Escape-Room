# Puzzle Design Reference — mechanics players actually loved

A design reference for inventing new puzzles in this series, built from what real
players and designers praise (and hate) in **r/escaperooms**. Each mechanic below is
paired with *why* it lands and *how to build it in our engine* (browser SVG scenes,
decoupled hotspot layer, item-combining, `state.flags`, modal `openPuzzle`, Gus hint
tiers, per-game meta word).

> **Sourcing:** compiled from ~16 r/escaperooms discussion threads ("most clever /
> creative / memorable / interesting puzzle," "best physical puzzles," "two-player
> puzzles," "worst puzzle"). Full comment text is not directly fetchable, so this
> synthesizes the community's recurring answers and the specific standouts people
> called out. Thread links in the appendix.

---

## How to use this

Each entry: **Mechanic** → **Why it lands** (the player-stated reason) → **Build it here**
(our primitives) → **Seed** (a concrete puzzle idea for a future room). Our engine is
digital, so physical mechanics are translated to their information-equivalent — the
*reasoning* is what players remember, not the hardware.

Golden rule players repeat constantly: **every key must be in the room, and the "aha"
must come from thinking, not from knowing.** No outside knowledge, no pixel-hunting.

---

## Part 1 — Mechanics players called clever

### 1. Light & optics
- **Mechanic.** Aim a beam (laser pointer) through mirrors/prisms to hit a target;
  rotate walls to bounce it; drop a prism to split one beam into several that fire off
  into different rooms; shine a flashlight into a hole to trigger something (a sensor).
  UV/blacklight reveals invisible ink that vanishes when the light moves off it;
  a "blurry box" whose clue only resolves through a lens/liquid.
- **Why it lands.** Cause-and-effect is instant and physical; the room visibly *reacts*.
  Directional light makes players move their bodies and see the space differently.
- **Build it here.** A draggable beam vector in an `openPuzzle` SVG; mirrors are
  rotatable `<line>` segments, the beam is recomputed on each rotation and must land on
  a target hotspot. UV ink = a second `<text>` layer at `opacity:0` revealed while a
  "held" flashlight item hovers a region (toggle a `state.flag`, `mix-blend-mode:screen`
  on a dark render). Blurry clue = a CSS `filter:blur()` that clears when the lens item
  is applied.
- **Seed.** A dark vault: hold the lantern over each wall panel to reveal one glyph of a
  code that only exists under the light; the panels must be read in the order the beam
  can physically reach them.

### 2. Physics made visible (resonance, fluid, pressure)
- **Mechanic.** A **Chladni plate** — vibrate a salt-covered plate at set frequencies and
  the salt jumps into a symbol at each resonant frequency. **Water displacement** — an
  item sits in a deep box out of reach; pour water in (funnel + bottle) until it floats
  up. **Pneumatics** — connect a bicycle pump to a wall socket and pump to raise a
  column / fill a tank. Flashlight-into-hole *fills a fishtank*.
- **Why it lands.** An abstract quantity (frequency, volume, pressure) becomes a picture
  you can read. It feels like discovering a law of nature, not reading a label.
- **Build it here.** A slider/dial in a modal maps a value to a revealed pattern: at the
  correct value the SVG "salt" snaps into a glyph (swap the `<path>`); wrong values show
  scatter. Water = a `<rect>` whose height animates up as you "pour," floating an
  `<image>` prop to a reachable hotspot when it crosses a threshold.
- **Seed.** Tune a resonance dial across five frequencies; each correct frequency stamps
  one rune into the plate; the runes, in ascending-frequency order, are the door word.

### 3. Spatial reveals & room transformation
- **Mechanic.** Solve a puzzle and a **hidden wall slides open** so cleverly you never
  saw the seam; a prop that looks fixed (a toilet, a bookcase) **moves away from the
  wall** to expose a crawlway; the **lights cut out and come back on a changed room**;
  stumbling into a fully-dressed themed chamber (an Egyptian tomb) as the door seals.
- **Why it lands.** The *space itself* is the reward. It reframes what players thought the
  room was — the strongest "memory-forging" beat people cite.
- **Build it here.** State-driven scene swaps are free for us: a solved flag re-renders
  `scene()` with a new wall panel gone and a new region + hotspots exposed (this is
  exactly how our rooms already open grates/doors). "Lights out → different room" = a
  full-scene transition (`scene-enter`) into a re-dressed variant of the same coordinates.
- **Seed.** A study whose fireplace is decorative — until you set the mantel clock to a
  time from an earlier clue; the hearth rotates (re-render) into a passage with the next
  room's first hotspot.

### 4. Layered / overlay information
- **Mechanic.** Two **transparencies** that mean nothing alone but form a message when
  aligned; a transparency laid over a **live camera image on a TV** until the marks line
  up; a map overlaid on another map so only the shared feature (a river bend, a channel)
  matters.
- **Why it lands.** Each half is deliberately incomplete; the solve is the moment of
  superposition. Great for splitting a clue across places — or across *players*.
- **Build it here.** Two SVG layers with the same viewBox; the player drags/rotates one
  (`transform`) until registration marks coincide, revealing a combined `<text>`. For the
  duo games this is the native trick: each screen holds one transparency (see §8).
- **Seed.** A star-chart on the wall + a pierced metal plate you can slide over it;
  only when a notch sits on the pole star do the visible stars spell a constellation name.

### 5. Sound & signal
- **Mechanic.** Tune a **radio** across the band; at the right frequency it plays **morse**
  that decodes to a number; buttons that each emit a distinct tone you must replay in
  order; an audio file hiding a code. Community caveat: the **morse/cipher key must be in
  the room** — never assume players know morse.
- **Why it lands.** Adds a non-visual channel; rewards careful listening; the "signal
  hiding in noise" reveal is satisfying.
- **Build it here.** We already synthesize Web Audio. A dial scrubs a value; within a
  tolerance window a tone/morse loop plays (`playSfx`); a visible morse key sits in-scene.
  Tone-memory = light-up buttons (Simon-style) with `playSfx` per press.
- **Seed.** A distress beacon: sweep the dial, catch the carrier, count the long/short
  pulses against the wall's morse card → a bearing that feeds the finale.

### 6. Arrangement, sorting & sequence
- **Mechanic.** Drop **colored balls into the right holes/socks**; align **cogs and levers**
  so pointers meet; place **objects on marked spots** so their lines/beams converge;
  order items by a hidden property.
- **Why it lands.** Tactile, low-reading, universally accessible; the "click into place"
  gives a clean success signal.
- **Build it here.** Drag-drop SVG tokens onto target slots; success when every token's
  `data-slot` matches; coupled mechanisms (our Great Hall wheel, where one lever turns
  two rings) are a proven favorite — a small system of overlapping effects to reason out.
- **Seed.** Five weight-pans and a beam: hang the tokens so the beam balances; the pan
  order that balances spells the code (a physics constraint, not trial-and-error).

### 7. Observation & deduction (use with care)
- **Mechanic.** Hidden-in-plain-sight messages, count-the-things, restore-the-senses
  (touch/taste/smell/see then infer), cipher wheels. Players love a *sharp* deduction and
  resent a *tedious* one.
- **Why it lands.** The pure "I noticed what others missed" hit — when the clue set is
  small and the logic is tight.
- **Build it here.** Our counting/logic-grid locks (Oubliette counts, Guard-Room ordering)
  are this category. Keep the input space small; make the clue diegetic.
- **Watch out.** "Find 20 objects with symbols" and a 20-minute cipher-wheel are the most
  complained-about puzzles. Cap decode length; prefer *one* clever read over many rote ones.

### 8. Teamwork & asymmetric co-op ⭐ (our duo line)
- **Mechanic.** Buttons across the room that must be pressed **simultaneously**; a group
  **split so they can't see or hear each other** and must describe; passing an object
  between two sealed cells (nail clippers through a shared toilet). The recurring praise:
  *"a lock made for a pair, so no one person could take it alone."*
- **Why it lands.** Forces communication; each player is necessary; the solve is a shared
  win. This is exactly our Signal Towers / Looking Glass / Silent Alarm design.
- **Build it here.** One screen holds the clue that unlocks the *other* screen's lock
  (never your own). Variations to mine: simultaneous action (both press within a window),
  one describes a shape/orientation the other sets, transparency halves (§4) split across
  screens, or a value one player computes with a rule only the partner can see.
- **Seed.** A two-part combination where each player sees three of six dials and the rule
  ("mine are the even positions") only on the partner's wall — neither can enter it alone.

### 9. Theme-and-variation escalation
- **Mechanic.** Each successive puzzle is **the same mechanic, harder** — a variation, not
  a brand-new gimmick every time.
- **Why it lands.** Players learn a language then get tested on it; the ramp feels fair and
  builds mastery instead of resetting the learning curve each lock.
- **Build it here.** Introduce a mechanic in room 1 at tutorial difficulty, reprise it in a
  later room with an added constraint (a modifier rule, a coupled element, a reversal).
- **Seed.** A cipher taught plainly early, then reused where one substitution is *wrong on
  purpose* and a second clue tells you which — the same skill, a twist.

### 10. Story-integrated meta
- **Mechanic.** A **meta-puzzle that only assembles once every room is done**, tied to the
  narrative — collectibles that spell a word, a final combination built from six earlier
  finds. Players call story+meta "cohesive and extremely satisfying."
- **Why it lands.** Turns seven separate locks into one arc; the ending pays off attention
  paid throughout.
- **Build it here.** This is our sun/shard/token/tessera/bearing/shard/pin system already —
  auto-journal a collectible per room, order them by a stated rule in the finale.
- **Seed.** Keep varying the *ordering rule* (fewest rays, wave-peaks, marcher order,
  bearing, reverse-the-word) so the meta tests a fresh idea each game.

---

## Part 2 — Principles that make a puzzle land

- **Engineer the "Aha!"** People rave about the *insight* beat: minutes of thought → a
  sudden reframe → the lock clicks. Design toward one clean click per lock, not a grind.
- **Signpost ruthlessly.** The #1 complaint is not knowing *what a clue is for* or *where
  an answer goes*. Make it obvious which lock a clue serves; make solved state visible.
- **Be fair / self-contained.** Every key, code, and cipher alphabet lives in the room.
  No trivia, no morse-by-heart, no guessing.
- **Prefer non-linear / open flow** once there are more than 3–4 puzzles: parallel tracks
  that converge on the finale beat linear "one drawer unlocks the next drawer" chains.
- **Confirm success loudly.** "We solved it but nothing happened" ruins trust; every solve
  needs an unmistakable reaction (sound, reveal, re-render).
- **Red herrings sparingly.** A little misdirection is fun; a room full of used-once junk
  is exhausting. If everything is a clue, signposting collapses.
- **Mind the solve rate.** Designers target a difficulty where most groups finish with
  effort; a puzzle only ~10–20% solve unaided is a hint-tier problem — which is what Gus
  is for.
- **Keep the story legible.** Players resent leaving unsure "what the story even was."
  The meta and the narrative should reinforce each other.

---

## Part 3 — Anti-patterns to avoid (player-hated)

- **No signposting** — clue with no indicated purpose or destination lock.
- **Lock-heavy non-sequitur** — a 4-digit lock on a drawer with a clue that connects to it
  only by convention; padlocks strung in a line with no logic between them.
- **Tedious hunts** — "find 20 near-identical objects with symbols"; searching as content.
- **Outside knowledge required** — morse/semaphore/obscure trivia with no in-room key.
- **Overlong single decode** — a 20-minute cipher-wheel grind on one code.
- **Unclear screen clues** — instructions on a TV that aren't self-explanatory.
- **Dead-end feedback** — correct answer, no reaction; players re-solve what they solved.
- **"All items used exactly once" confusion** — players assume it; don't quietly break it
  without signaling.

---

## Part 4 — Physical → our-engine adaptation cheat-sheet

| Physical mechanic players loved | Our-engine equivalent |
|---|---|
| Mirror/laser beam alignment | Rotatable `<line>` mirrors in a modal; recompute beam, hit a target hotspot |
| Prism splits beam to many rooms | One solve sets several `state.flags`, lighting up multiple regions/rooms |
| UV blacklight invisible ink | Hidden `<text>` at `opacity:0`, revealed while the "held" light item hovers a region |
| Blurry-until-lens clue | `filter:blur()` on the SVG group, cleared when the lens item is applied |
| Chladni salt / resonance | Dial→value; at resonance swap scatter `<path>` for a glyph `<path>` |
| Water displacement to float an item | Animated `<rect>` height; float an `<image>` prop past a threshold to expose a hotspot |
| Pneumatic pump raises a column | Repeated-click accumulator flag driving a rising `<rect>`/prop |
| Hidden sliding wall / room change | Re-render `scene()` on a flag with the panel gone + new hotspots (already core) |
| Transparency overlay alignment | Two same-viewBox SVG layers; drag/rotate one to registration → combined text |
| Radio-tuned morse | Web Audio tone/morse in a tolerance window on a dial; morse key visible in-scene |
| Colored balls into holes / sorting | Drag-drop tokens to slots; success when all `data-slot` match |
| Cogs & levers coupled mechanism | Levers that each mutate two adjacent rings (our Great-Hall pattern) |
| Simultaneous multi-button (teamwork) | Two screens must trigger within a shared time window |
| Split team can't see/hear | Each screen shows the clue that opens the *other* screen's lock (our duo core) |
| Pass item between sealed cells | A "hand-off" state one player sets that unlocks the partner's next step |
| Themed chamber immersive reveal | Full-scene transition into a re-dressed variant (photoreal plate + `scene-enter`) |

---

## Appendix — source threads (r/escaperooms)

- What is the craziest, most creative thing you've seen? — `/comments/17ilbnw`
- What's the most clever thing an escape room you've been in did? — `/comments/16r3zpr`
- What was the most interesting puzzle you ever had to solve? — `/comments/em5zz2`
- What's the most memorable puzzle you have ever done? — `/comments/w83mcj`
- What are your favourite escape room puzzles? — `/comments/1o7m8d8`
- Best or worst puzzle you have seen (and why) — `/comments/10juvvk`
- Best physical puzzles — `/comments/nb5qa1`
- Unique puzzles and ideas for an escape room — `/comments/17h3ylk`
- Worst puzzle you've encountered (design/logic/execution) — anti-pattern thread

Plus category searches on r/escaperooms for UV/invisible-ink, mirror/laser, transparency
overlays, morse/audio, weight/balance, and two-player communication puzzles.
