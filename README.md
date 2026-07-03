# 🏰 Escape Rooms

**A growing collection of hour-long, browser-native escape rooms** — one shared engine,
hand-authored SVG scenes, synthesized sound, zero dependencies, zero build step. And one
immortal companion: **Gus**, who appears in every room in a form to match the theme.

---

## 🎮 Room Select

> This table is the collection's source of truth. It will become a playable **dashboard**
> (a room-select hub at the repo root) once a second escape room lands — see
> [Roadmap](#-roadmap--the-dashboard) below.

| # | Escape Room | Theme | Gus's Form | Length | Difficulty | Status | Play |
|---|-------------|-------|------------|--------|------------|--------|------|
| **I** | **The Pilgrim's Road** | Medieval castle | 👻 Sir Gus, ghost-knight | ~60 min | Hard but fair | ✅ **Live** | [**▶ Play**](https://daniel-lamb.github.io/Escape-Room/) |
| II | *Untitled* | Animal kingdom | 🐒 Gus the monkey | ~60 min | — | 🗺️ Planned | — |
| III | *Untitled* | *(open slot)* | 🤖 ? | — | — | 💤 Someday | — |

<!--
Adding a room to this table:
| **N** | **Title** | Theme | Gus's form | ~length | difficulty | status emoji | play link |
Statuses: ✅ Live · 🚧 In progress · 🗺️ Planned · 💤 Someday
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

**Play**: [daniel-lamb.github.io/Escape-Room](https://daniel-lamb.github.io/Escape-Room/) —
or locally:

```bash
python -m http.server 4173   # then open http://localhost:4173
```

---

## 🗺️ Roadmap — the dashboard

When escape room **II** lands, the repo reorganizes into a hub-and-games layout, and the
Room Select table above becomes an actual clickable dashboard at the root URL:

```
/index.html          ← the dashboard: pick your escape room (art, status, best times)
/shared/             ← the engine: engine.js, state.js, items.js, audio.js, css/
/pilgrims-road/      ← Room I  (this game, moved intact)
/<room-two>/         ← Room II (new rooms/*.js modules + its own gus.js form)
```

Planned dashboard features: room cards with theme art and Gus's form for each, per-room
completion/best-time pulled from localStorage, and a locked "next room" teaser.
Until then, the root URL plays Room I directly.

---

## 📚 Docs

| Doc | What's in it |
|---|---|
| [docs/BUILD.md](docs/BUILD.md) | **How this was built** — engine architecture, Gus system, fairness gates, and the player progression (difficulty curve, item chain, the six suns) |
| [docs/DESIGN.md](docs/DESIGN.md) | Full design document — story, every puzzle spec with deduction-chain proofs of solvability |
| [docs/ROOM_CONTRACT.md](docs/ROOM_CONTRACT.md) | How to author a new room against the engine (start here for Room II) |
| [docs/WALKTHROUGH.md](docs/WALKTHROUGH.md) | ⚠️ Total spoilers — every solution |

## 🧱 Tech

Vanilla JS ES modules · hand-authored layered SVG scenes · CSS animation library ·
WebAudio synthesis · localStorage saves · GitHub Pages. No frameworks, no assets, no build.

---

Built with Claude Code. Designed by a multi-agent panel, implemented and
play-tested end-to-end in the browser.
