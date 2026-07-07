# Migration Guide — Escape Rooms → Astro + Tailwind + TypeScript

How to take the series from a hand-authored, zero-build static site to an **Astro +
Tailwind + TypeScript** project **without losing static hosting, without paying a cent,
and without rewriting the games.** Incremental, reversible, and deployable to the same two
hosts it already lives on.

---

## TL;DR

- The **dashboard** (`index.html`) becomes an Astro app: real components, TypeScript,
  Tailwind, drop-in shadcn / 21st.dev React components, and Framer Motion for animation.
- The **four games stay exactly as they are**, served verbatim from `public/`. No rewrite.
- Output stays **100% static** → same free hosting on **Vercel** (push-to-deploy) and
  **GitHub Pages**. **No new cost.**
- **The future Duo / Group multiplayer is also fully static — no servers, no live calls.**
  See [Multiplayer architecture](#multiplayer-architecture--local-co-op-no-live-calls).
  This retires the old "multiplayer will need a backend" caveat.
- Migration is **incremental** (dashboard first, games later or never) and **reversible**
  (tag the pre-migration commit).

---

## Why migrate at all

The current stack is wonderful for what it is — but it has three ceilings the series keeps
bumping into:

1. **Copy-pasted markup.** Every room card is ~60 lines of duplicated HTML in one 900-line
   file. Adding a room means editing markup in several places. Components fix this: a room
   becomes one typed data object.
2. **The shadcn / 21st.dev ecosystem.** You keep handing over React components (the
   carousel, the animated cards). Today each one has to be hand-ported to vanilla. On this
   stack they become **copy-paste**, working as-is.
3. **Animation authoring.** Hand-rolled `IntersectionObserver` + manual `style.transform`
   juggling works, but spring physics, gesture handling, and enter/exit animations are far
   cleaner (and look more premium) with Framer Motion / Motion.

TypeScript on top of all this catches real bugs — especially in the games' shared engine
and save-state shapes.

---

## What does NOT change

- **Static output.** Astro compiles to plain HTML/CSS/JS. No server runtime.
- **Free hosting**, same two hosts, same `git push` → deploy flow.
- **The four games** (`pilgrims-road/`, `starfall-station/`, `wild-court/`,
  `gate-of-life/`), the shared engine, WebAudio, hand-authored SVG, and `localStorage`
  saves — untouched, moved verbatim into `public/`.
- **No backend, ever** — now including multiplayer (see below).

---

## Target stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | **Astro** (`output: 'static'`) | HTML-first, ships zero JS by default; `.astro` ≈ HTML with a TypeScript head |
| Language | **TypeScript** (strict) | types for room data, save state, engine |
| Styling | **Tailwind CSS** | + a small `tokens.css` for the orange theme + motion tokens |
| Interactive widgets | **React islands** via `@astrojs/react` | only the carousel + filter hydrate; everything else is static HTML |
| Components | **shadcn/ui** in `src/components/ui` | where pasted components land |
| Animation | **Framer Motion** (islands) and/or **Motion One** (`.astro`) | springs, `AnimatePresence`, layout animations |
| Transitions | Astro's built-in **view-transition router** | smooth filter/route changes, native |

---

## Target repo structure

```
escape-room/
├─ astro.config.mjs          # integrations, site, base, static output
├─ package.json              # NEW: deps + build scripts
├─ tsconfig.json
├─ src/
│  ├─ data/rooms.ts          # the rooms as a typed array (drives the dashboard)
│  ├─ components/
│  │  ├─ RoomCard.astro       # one card, rendered from data
│  │  ├─ Carousel.tsx         # the shadcn / 21st.dev carousel, as an island
│  │  ├─ ModeFilter.tsx       # the segmented filter island
│  │  └─ ui/                  # shadcn components
│  ├─ styles/tokens.css       # orange theme + motion tokens (durations, easings)
│  └─ pages/index.astro       # the dashboard — ~50 lines instead of ~900
└─ public/                   # served verbatim at the site root
   ├─ shared/                # the engine (unchanged)
   ├─ pilgrims-road/         # Room I  (unchanged)
   ├─ starfall-station/      # Room II (unchanged)
   ├─ wild-court/            # Room III (unchanged)
   └─ gate-of-life/          # Room IV (unchanged)
```

Astro copies everything in `public/` to the root of the build output, so
`public/wild-court/` is served at `/wild-court/` exactly as today. The games' relative
imports (`../shared/css/main.css`) keep resolving because the folder structure is
preserved.

---

## Migration phases

- **Phase 0 — Scaffold.** Stand up Astro around the existing site with nothing visibly
  different. Games in `public/`, dashboard temporarily copied in.
- **Phase 1 — Dashboard to components.** Turn the four cards into `rooms.ts` + a
  `RoomCard`, the carousel + filter into islands, port the theme to Tailwind/tokens.
- **Phase 2 — (optional, later) Engine to TypeScript.** Promote `shared/` into a typed
  module set. Only worth it once you want type safety across the games.
- **Phase 3 — (future) Multiplayer rooms.** Duo/Group rooms, built on the same static
  engine (see architecture below).

Phases 0–1 are one focused session. Phase 2+ are optional and independent.

---

## Step-by-step (Phases 0 + 1)

```bash
# 0. Safety net — tag the current, known-good static site
git tag pre-astro && git push --tags

# 1. Scaffold Astro in a temp dir, then merge in (choose "Empty", TypeScript: Strict)
npm create astro@latest -- --template minimal --typescript strict

# 2. Add integrations
npx astro add tailwind
npx astro add react

# 3. shadcn/ui (writes to src/components/ui, aliased "@/components/ui")
npx shadcn@latest init

# 4. Animation lib for the islands
npm i framer-motion        # or:  npm i motion   (Motion One, framework-agnostic)
```

Then:

5. **Move the games in.** `shared/`, `pilgrims-road/`, `starfall-station/`,
   `wild-court/`, `gate-of-life/` → `public/`. Verify each still loads at `/wild-court/`
   etc. (no code changes).
6. **Model the rooms** in `src/data/rooms.ts` (schema below).
7. **Build `RoomCard.astro`** (art slot + title + chips + status + Enter button) and
   **`src/pages/index.astro`** that maps `rooms` into the three sections.
8. **Drop in the carousel** as `Carousel.tsx` and mount it as an island:
   `<Carousel client:visible data={rooms} />`. The pasted shadcn component works as-is.
9. **Port the theme.** Move the orange palette + animations into `tokens.css` and Tailwind
   theme extensions; keep the aurora, embers, border-beam, shimmer title.
10. **Re-wire the live status + stat counters.** The `localStorage` reads (per-room
    progress/best time, total escapes) become a small client script or a tiny island.
11. **Configure** `astro.config.mjs` — `output: 'static'`, `site`, and `base` (see
    deployment note).
12. **Verify locally:** `npm run dev`, then `npm run build && npm run preview`. Click into
    each of the four games from the built output.

---

## Deployment — unchanged hosts, still free

### Vercel (primary)
- Vercel **auto-detects Astro**. Framework preset: *Astro*. Build command: `astro build`.
  Output dir: `dist`. **No adapter needed** for static output.
- The repo is already git-connected to the Vercel project, so **`git push` → build →
  deploy** is unchanged. The only difference vs today: Vercel now runs the build instead of
  copying raw files.
- **Cost: still $0.** Builds + static hosting are included on the Hobby (free) tier; a small
  Astro site builds in well under a minute and bandwidth is trivial. Nothing here triggers
  paid serverless usage.

### GitHub Pages (secondary)
- Add a build workflow (`withastro/action`) that runs `astro build` and publishes `dist/`.
- **Base-path gotcha:** GitHub Pages serves this repo under `/Escape-Room/`, while Vercel
  serves at `/`. Set `base: '/Escape-Room/'` + `site` in `astro.config.mjs` for the Pages
  build, and keep internal links **relative** (as they already are — `wild-court/`,
  `../shared/…`), which resolve correctly under both root and subpath. For any absolute
  link, use `import.meta.env.BASE_URL`.
- GitHub Pages + Actions on a public repo is **free**.

---

## Data model (`src/data/rooms.ts`)

```ts
export type Mode = 'single' | 'duo' | 'group';

export interface Room {
  id: string;                 // 'wild-court'
  title: string;              // 'The Wild Court'
  era: string;                // 'Animal Kingdom'
  mode: Mode;                 // which carousel it lives in
  players: string;            // '1 player' | '2 players' | '3–6 players'
  blurb: string;
  chips: string[];
  href: string;               // 'wild-court/'  (relative — host-agnostic)
  saveKey?: string;           // 'wild-court-save-v1'  (undefined for concept cards)
  status: 'live' | 'concept';
  accent: 'medieval' | 'scifi' | 'jungle' | 'roman' | 'ember';
}
```

Adding a room becomes **one object** in this array. The dashboard filters by `mode` into
the three carousels; concept cards get `status: 'concept'` and a "Coming soon" treatment.

---

## Multiplayer architecture — local co-op, no live calls

**This is the key design decision, and it keeps the whole project static forever.**

The Duo and Group rooms do **not** sync over a network. There are no WebSockets, no shared
server state, no accounts, no matchmaking. Every player runs the **same deterministic game
entirely in their own browser**; the only thing that "syncs" the players is **the players
talking to each other** (in the same room, or on a voice/video call they run themselves).

### How it works

1. Everyone opens the **same room URL** on their own device and picks a role — **Player 1,
   Player 2, Player 3…** (a select screen, or a `?p=2` URL param).
2. The room is **fully deterministic** — fixed data, no randomness (or an identical seed on
   every client). So Player 2's browser always shows *exactly* the clue Player 1 needs, on
   every device, every time.
3. Each role renders a **different slice** of the puzzle — **asymmetric information.** To
   advance from **Stage 1 → Stage 2**, Player 1 needs details that exist **only in Player 2
   and 3's browsers**, and vice versa. Nobody can solve their own gate alone.
4. Players **pool what's on their screens by talking**, work out the shared answer, and each
   enters it locally to advance.

### Why this needs no server, and stays "same rate"

- **Lockstep is enforced by the puzzle, not the network.** Because a stage's gate can only
  be solved by combining every player's view, no one can race ahead — the design keeps the
  humans in sync automatically. "Progress at the same rate" is a property of the *puzzle*,
  not of any syncing code.
- **No shared state to store**, so there is nothing for a backend to do. Each client is
  self-contained; the humans are the transport layer.
- **Determinism requirement:** everyone must be on the same deployed version — which is
  free, since it's the same static URL. (A version stamp in the room can warn if two players
  somehow differ.)

### Engine shape (Phase 3)

Extend the room contract so a room can define, per stage:

```
stage = {
  gate,                       // the single answer that advances everyone
  views: {                    // what each player SEES this stage — disjoint slices
    1: <player-1 clues>,
    2: <player-2 clues>,
    3: <player-3 clues>,
  },
}
```

The `gate` answer must be **underivable from any single `view`** and **derivable from the
union** of all views. A `role` (from the player-select screen) picks which `view` renders.
Same room module, parameterized by role — no new infrastructure.

### Cost impact

**Duo and Group rooms remain 100% static and $0.** The earlier "multiplayer will eventually
need a backend" note **does not apply to this design.** A backend would only be needed for a
*different* game — remote players with no shared voice channel who need each other's
on-screen actions pushed live. This design deliberately assumes players are together (in a
room or on a call) and communicate themselves, so it never needs one.

---

## Animation approach after migration

- **Motion tokens** — a small set of durations + easings (incl. spring-like curves) in
  `tokens.css` / the Tailwind theme, so everything speaks one motion language.
- **Framer Motion** on the islands — springs, `AnimatePresence` for enter/exit,
  `layout` for the filter re-flow, scroll-linked reveals. Replaces the hand-rolled
  observers/transforms with less, more robust code.
- **Astro view-transition router** for filter/route changes (native, no library).
- **`prefers-reduced-motion`** honored throughout (already the case).

---

## Risks & rollback

- **Adds a build step + `node_modules` + dependency upkeep.** A vanilla static site never
  breaks on its own; a framework app needs occasional maintenance (security bumps, major
  versions). Accept this consciously — it's the price of the tooling.
- **Half-and-half repo** (Astro dashboard + vanilla games in `public/`) until/unless the
  games are migrated in Phase 2. This is fine and fully functional.
- **Rollback is clean:** the site is tagged `pre-astro`. `git checkout pre-astro` (or revert
  the migration commit) restores the pure static site instantly, and both hosts serve it
  again with no build.

---

## Checklist

- [ ] `git tag pre-astro` (safety net)
- [ ] Scaffold Astro (minimal, TypeScript strict)
- [ ] `astro add tailwind` · `astro add react`
- [ ] `shadcn init`
- [ ] Install Framer Motion / Motion
- [ ] Move `shared/` + 4 game folders into `public/`; verify each still loads
- [ ] `src/data/rooms.ts` (typed room list)
- [ ] `RoomCard.astro` + `src/pages/index.astro` (three carousels)
- [ ] Carousel + filter as React islands
- [ ] Port orange theme + animations → Tailwind + `tokens.css`
- [ ] Re-wire `localStorage` status + stat counters
- [ ] `astro.config.mjs` (`output: 'static'`, `site`, `base`)
- [ ] `npm run build && npm run preview` — click into all four games
- [ ] Vercel: confirm auto-detected Astro build deploys (still free)
- [ ] GitHub Pages: add build Action, set `base: '/Escape-Room/'`
- [ ] Confirm both hosts live, all links + saves work
- [ ] Link this guide from the main `README.md`

---

*Bottom line: migrating changes the authoring experience (components, TypeScript, Tailwind,
first-class animation libraries) while keeping the deployment story identical — static,
free, push-to-deploy, on both Vercel and GitHub Pages — and, thanks to the talk-don't-sync
multiplayer design, it stays that way even once the Duo and Group rooms ship.*
