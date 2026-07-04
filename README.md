# 🏰 Escape Rooms

**A growing collection of hour-long, browser-native escape rooms** — one shared engine,
hand-authored SVG scenes, synthesized sound, zero dependencies, zero build step. And one
immortal companion: **Gus**, who appears in every room in a form to match the theme.

---

## 🎮 Room Select

**The dashboard is live:** [**daniel-lamb.github.io/Escape-Room**](https://daniel-lamb.github.io/Escape-Room/)
— pick your room, see your progress and best times (saved locally per game).

| # | Escape Room | Theme | Gus's Form | Length | Difficulty | Status | Play |
|---|-------------|-------|------------|--------|------------|--------|------|
| **I** | **The Pilgrim's Road** | Medieval castle | 👻 Sir Gus, ghost-knight | ~60 min | Hard but fair | ✅ **Live** | [**▶ Play**](https://daniel-lamb.github.io/Escape-Room/pilgrims-road/) |
| **II** | **Starfall Station** | Futurist / sci-fi | 🤖 GS-1 "Gus", maintenance drone | ~60 min | Intricate · **twist ending** | ✅ **Live** | [**▶ Play**](https://daniel-lamb.github.io/Escape-Room/starfall-station/) |
| III | *The Wild Court* | Animal kingdom | 🐒 Gus the monkey | ~60 min | — | 🗺️ In design | — |
| IV | *Untitled* | *(open slot)* | ? | — | — | 💤 Someday | — |

<!--
Adding a room to this table:
| **N** | **Title** | Theme | Gus's form | ~length | difficulty | status emoji | play link |
Statuses: ✅ Live · 🚧 In progress · 🗺️ In design · 💤 Someday
Then: new /<room-slug>/ folder (copy a game's index.html + skin.css + js/gus.js form +
js/main.js config + js/rooms/*), and a new card in the root index.html dashboard.
-->

---

## 🛡️ Gus — your companion in every room

Every escape room in this collection ships with **Gus**, the help button made flesh
(well — made *something*). He floats in the corner of every scene; click him when stuck.

- **Three whispers per puzzle**, escalating: *a nudge* (−1:00) → *the method* (−2:00) →
  *the answer* (−4:00). Costs come off the escape timer, so help is a real trade-off.
- Paid whispers stay **re-readable free, forever**.
- Same Gus, different body: his name never changes, his form always matches the theme.
  His entire identity lives in one file per game (`js/gus.js`) — portrait, epithet,
  voice lines — so re-theming him for a new room touches nothing else.

---

## 🕯️ Room I — The Pilgrim's Road *(live)*

You are Aldric of Marden, a cartographer arrested for "spying" on the walls of Vayne Keep.
At dawn they hang you. Forty years ago, Brother Edmund found a way out — and left a trail
of carved suns for whoever followed. **Seven chambers. One hour. Mark each sun along the road.**

- **7 puzzle mechanics, no repeats**: observation-combination, constraint logic, musical
  carillon (real synthesized bell tones), book cipher, recipe brewing, coupled gears, and
  a finale meta-puzzle assembled from clues journaled across all six earlier rooms.
- **Difficult but strictly fair**: every solution is derivable from in-game clues alone —
  no outside knowledge, no pixel-hunting. Wrong answers never cost time.
- **The Pilgrim's Journal** auto-copies every verse, roster, recipe, and carved sun you
  examine. You will want it at the end.
- Flickering torchlight, drifting embers, spring-eased modals, typewriter narration —
  and every sound synthesized live with WebAudio. **Zero asset files.**
- Autosaves; if dawn catches you, *Rise again* retries the chamber with progress intact.

**Play**: [daniel-lamb.github.io/Escape-Room/pilgrims-road](https://daniel-lamb.github.io/Escape-Room/pilgrims-road/) —
or locally from the repo root:

```bash
python -m http.server 4173   # dashboard at http://localhost:4173
```

---

## 🛰️ Room II — Starfall Station *(live)*

You wake from cryo on an evacuated orbital station, sixty minutes before its decaying
orbit hits atmosphere. The crew is gone. The AI core is empty. The scale in the med bay
thinks you weigh 212 kilograms, and every reflective surface on the station has
"glare." **Seven decks. One hour. And a truth waiting at the escape pod.**

- **7 new puzzle mechanics** (none shared with Room I): conservation-law observation,
  pipe-flow routing, UV-reveal cross-referencing, logic gates, symbol substitution,
  constrained resource balancing — and a finale that reassembles the six **memory
  shards** you collected into a single word.
- **A fair-play twist ending** foreshadowed by eight independent clues from Deck 1
  onward. No spoilers here; the walkthrough has them all.
- Gus is a **floating maintenance drone** this time (`starfall-station/js/gus.js`) —
  same name, same tiered hints, new chassis, and a bigger part in the story than he
  lets on.
- Futurist skin over the same shared engine: signal-cyan palette, datapad documents,
  monospace instruments, planet-below-the-viewport dread.

## 🏗️ Repo layout (hub-and-games)

```
/index.html          ← the DASHBOARD: room select, per-game status & best times
/shared/             ← the engine: engine.js, state.js, items.js, audio.js, gus-core.js, css/
/pilgrims-road/      ← Room I  — medieval  (index.html, js/gus.js form, js/rooms/*)
/starfall-station/   ← Room II — futurist  (index.html, skin.css, js/gus.js form, js/rooms/*)
```

Adding Room III = a new game folder (shell + skin + Gus form + room modules + boot
config) plus one card on the dashboard. The engine, hint tiers, journal, timer, and
save system come free.

---

## 📚 Docs

| Doc | What's in it |
|---|---|
| [docs/BUILD.md](docs/BUILD.md) | **How Room I was built** — engine architecture, Gus system, fairness gates, player progression (difficulty curve, item chain, the six suns) |
| [docs/DESIGN.md](docs/DESIGN.md) | Room I design — story, every puzzle spec with deduction-chain proofs |
| [docs/DESIGN-STARFALL.md](docs/DESIGN-STARFALL.md) | Room II design — the twist and its eight foreshadows, memory shards, all seven deck specs |
| [docs/ROOM_CONTRACT.md](docs/ROOM_CONTRACT.md) | How to author a new room against the engine (start here for Room III) |
| [docs/WALKTHROUGH.md](docs/WALKTHROUGH.md) | ⚠️ Room I spoilers — every solution |
| [docs/WALKTHROUGH-STARFALL.md](docs/WALKTHROUGH-STARFALL.md) | ⚠️ Room II spoilers — every solution *and the ending* |

## 🧱 Tech

Vanilla JS ES modules · hand-authored layered SVG scenes · CSS animation library ·
WebAudio synthesis · localStorage saves · GitHub Pages. No frameworks, no assets, no build.

---

Built with Claude Code. Designed by a multi-agent panel, implemented and
play-tested end-to-end in the browser.
