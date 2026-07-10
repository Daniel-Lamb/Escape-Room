# 🏰 Escape Rooms

**A growing collection of hour-long, browser-native escape rooms** — one shared engine,
hand-authored SVG scenes, and synthesized sound. The four games are hand-authored with
**zero runtime dependencies** and served verbatim; the room-select dashboard is now an
**Astro + TypeScript + Tailwind** app that opens with a scroll-morph reveal and three
infinitely-scrolling rows of rooms. Output is still **100% static and free to host**.
And one immortal companion: **Gus**, who appears in every room in a form to match the theme.

---

## 🎮 Room Select

**The dashboard is live:** [**daniel-lamb.github.io/Escape-Room**](https://daniel-lamb.github.io/Escape-Room/)
— pick your room, see your progress and best times (saved locally per game).

| # | Escape Room | Theme | Gus's Form | Length | Difficulty | Status | Play |
|---|-------------|-------|------------|--------|------------|--------|------|
| **I** | **The Pilgrim's Road** | Medieval castle | 👻 Sir Gus, ghost-knight | ~60 min | Hard but fair | ✅ **Live** | [**▶ Play**](https://daniel-lamb.github.io/Escape-Room/pilgrims-road/) |
| **II** | **Starfall Station** | Futurist / sci-fi | 🤖 GS-1 "Gus", maintenance drone | ~60 min | Intricate · **twist ending** | ✅ **Live** | [**▶ Play**](https://daniel-lamb.github.io/Escape-Room/starfall-station/) |
| **III** | **The Wild Court** | Jungle / animal kingdom | 🐒 Gus, golden tamarin advocate | ~60 min | Intricate · **verdict twist** | ✅ **Live** | [**▶ Play**](https://daniel-lamb.github.io/Escape-Room/wild-court/) |
| **IV** | **The Gate of Life** | Ancient Rome / the Colosseum | 🦁 Gus, the Emperor's lion | ~60 min | Hard but fair | ✅ **Live** | [**▶ Play**](https://daniel-lamb.github.io/Escape-Room/gate-of-life/) |
| V | *Untitled* | *(open slot)* | ? | — | — | 💤 Someday | — |

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
or run the whole site locally:

```bash
npm install
npm run dev        # dashboard at http://localhost:4321
# or a production preview:
npm run build && npm run preview
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

## 🌿 Room III — The Wild Court *(live)*

You are Marlowe Reyes, contract surveyor for a timber concession, mapping a valley that
appears on no chart. The ground opens. You come to inside a root-swallowed temple where
the animals hold court, and a golden tamarin in a tiny woven collar introduces himself
as **your advocate** — and means it, literally. **Seven trials. One hour to nightfall.
And the verdict wants the one thing you came here to make.**

- **7 new puzzle mechanics** (none shared with Rooms I–II): negative-evidence track
  reading, a predator/prey river-crossing, territory **border surgery** on a bark map,
  food-web assembly from carved remains, mirror-symmetry mosaic completion, a
  counterfeit-tithe weighing under a two-answer budget — and a finale that orders your
  six **court tokens** by a food chain you proved three trials earlier to spell the word
  that shelters every clan.
- **A fair-play verdict twist** — the stakes are in Gus's first sentence, journaled eight
  ways, and earnable mid-game by a sharp-eyed player. The sinkhole was never an accident.
- Gus is a **golden tamarin, advocate for the accused** (`wild-court/js/gus.js`) — same
  name, same tiered counsel, new fur, and this time his little woven collar is on the
  line too.
- Jungle skin over the same shared engine: canopy light-shafts, firefly motes,
  leaf-tablet documents, a temple the roots never gave back.

## 🏛️ Room IV — The Gate of Life *(live)*

You are Aulus Pollio, architect of the Colosseum's underworks, condemned on a false
charge to die in the midday executions — sent up on the very lifts you designed. In the
old carcer you find a verse signed by Felix, the beast-carpenter the registers say a
lion ate a generation ago. The registers are wrong about the lion, too: he's sitting
outside your cell, and he remembers Felix. **Seven chambers. One hour to the midday
games. And the one word the crowd shouts when a life is to be spared.**

- **7 new puzzle mechanics** (none shared with Rooms I–III): an acrostic letter-lock,
  a gladiator-kit logic grid, the classic jug-measuring rite, the **SATOR square** (a
  real Roman palindromic charm, completed from clues you journal along the way), a
  guided maze through the beast tunnels, lever-and-tackle mechanical advantage on the
  great winch — and a finale that matches your six **bone tesserae** to a procession
  frieze to spell the sparing word.
- **Story beats instead of a rug-pull**: the lanista's ledger explains why Felix built
  a door out — and who the lion is. What's in the alcove by the gate is why this room
  is called what it's called.
- Gus is **an old Colosseum lion, retired by his own decision**
  (`gate-of-life/js/gus.js`) — same name, same tiered hints, new teeth. Everyone below
  assumes Gus is short for Augustus; Gus permits this.
- Roman skin over the same shared engine: torch-lit travertine, arena sand sifting
  through the arena floor above, wax-tablet documents, Latin inscriptions — and the
  Porta Sanavivaria, the real gate spared gladiators walked out of alive.

## 🏗️ Repo layout (Astro app + verbatim games)

```
escape-room/
├─ astro.config.mjs                ← static output; env-driven base (Vercel '/' · Pages '/Escape-Room/')
├─ src/
│  ├─ pages/index.astro            ← the dashboard, assembled from data
│  ├─ data/rooms.ts                ← the rooms as a typed array (drives the whole dashboard)
│  ├─ components/
│  │  ├─ RoomShowcase.tsx          ← the three infinite-marquee rows
│  │  └─ ui/scroll-morph-hero.tsx  ← the on-load intro (scatter → circle → rows → reveal)
│  └─ styles/                      ← the orange theme + tokens
└─ public/                         ← copied to the site root, served verbatim
   ├─ shared/                      ← the engine: engine.js, state.js, items.js, audio.js, gus-core.js, css/
   ├─ pilgrims-road/  starfall-station/  wild-court/  gate-of-life/   ← the four games, unchanged
```

The **games are untouched** — plain ES-module JS + hand-authored SVG + WebAudio under
`public/`, still zero-dependency and served as-is. Only the **dashboard** is built. Adding
a room is now **one object in `src/data/rooms.ts`** plus a game folder in `public/`; the
shared engine (hint tiers, journal, timer, save system) comes free. The engine is also
type-checked in place (`// @ts-check` + JSDoc): run `npm run check:engine`.

---

## 🧭 Roadmap — where we are, and what's next

**Where we are now.** Four rooms are **live and finished** — The Pilgrim's Road, Starfall
Station, The Wild Court, and The Gate of Life — all single-player, all hand-built on the
shared engine, deployed on **both GitHub Pages and Vercel** (git-connected, push-to-deploy).
The **Astro + TypeScript + Tailwind migration is done** (see [docs/MIGRATION.md](docs/MIGRATION.md)):
the dashboard is componentized and data-driven, the shared engine is type-checked in place,
and the room-select screen opens with a **scroll-morph intro** (the placards scatter → form
a circle → spread into three rows) that settles into three **infinitely-scrolling rows** of
16:9 room placards — one per player count. Output stays 100% static and free to host.

**What's next.**

1. **Duo rooms (2 players).** Local co-op with **no servers and no live calls**: each player
   picks Player 1 / 2 / 3, every browser runs the same deterministic game, and each role
   sees a *different slice* of the puzzle. To clear a stage you need details that live only
   in the **other** players' browsers — so you solve it by **talking**, and the puzzle
   itself keeps everyone in lockstep (no network needed to "progress at the same rate").
2. **Group rooms (3–6 players).** The same talk-don't-sync model at party scale — roles,
   distributed clues, a verdict that needs a quorum.

Because the multiplayer design never syncs over a network, **the whole series stays static,
serverless, and $0 to host — even once co-op ships.** See
[docs/MIGRATION.md](docs/MIGRATION.md) for the full architecture.

---

## 📚 Docs

| Doc | What's in it |
|---|---|
| [docs/BUILD.md](docs/BUILD.md) | **How Room I was built** — engine architecture, Gus system, fairness gates, player progression (difficulty curve, item chain, the six suns) |
| [docs/DESIGN.md](docs/DESIGN.md) | Room I design — story, every puzzle spec with deduction-chain proofs |
| [docs/DESIGN-STARFALL.md](docs/DESIGN-STARFALL.md) | Room II design — the twist and its eight foreshadows, memory shards, all seven deck specs |
| [docs/DESIGN-WILDCOURT.md](docs/DESIGN-WILDCOURT.md) | Room III design — the verdict twist, court tokens, all seven trial specs (post-adversarial-review revision) |
| [docs/DESIGN-GATEOFLIFE.md](docs/DESIGN-GATEOFLIFE.md) | Room IV design — the Felix/Gus story, bone tesserae, all seven chamber specs |
| [docs/ROOM_CONTRACT.md](docs/ROOM_CONTRACT.md) | How to author a new room against the engine |
| [docs/MIGRATION.md](docs/MIGRATION.md) | **Migration guide** — moving to Astro + Tailwind + TypeScript while staying static & free, plus the no-backend (talk-don't-sync) multiplayer architecture |
| [docs/WALKTHROUGH.md](docs/WALKTHROUGH.md) | ⚠️ Room I spoilers — every solution |
| [docs/WALKTHROUGH-STARFALL.md](docs/WALKTHROUGH-STARFALL.md) | ⚠️ Room II spoilers — every solution *and the ending* |
| [docs/WALKTHROUGH-WILDCOURT.md](docs/WALKTHROUGH-WILDCOURT.md) | ⚠️ Room III spoilers — every solution *and the verdict* |
| [docs/WALKTHROUGH-GATEOFLIFE.md](docs/WALKTHROUGH-GATEOFLIFE.md) | ⚠️ Room IV spoilers — every solution *and what's in the alcove* |

## 🧱 Tech

**Dashboard:** Astro (static output) · TypeScript (strict) · Tailwind v4 · React islands +
Framer Motion (the scroll-morph intro). **Games:** vanilla ES-module JS · hand-authored
layered SVG scenes · CSS animation library · WebAudio synthesis · `localStorage` saves —
still zero-dependency and served verbatim from `public/`. The shared engine is
`// @ts-check`-clean (`npm run check:engine`). **Hosting:** GitHub Pages + Vercel — static,
free, push-to-deploy. No backend, no assets.

---

Built with Claude Code. Designed by a multi-agent panel, implemented and
play-tested end-to-end in the browser.
