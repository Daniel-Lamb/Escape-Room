# Room Module Contract

Every room is one ES module in `js/rooms/roomN-<id>.js`. The engine (`js/engine.js`)
loads rooms in order from `js/rooms/index.js`. Rooms interact with the game **only**
through the `game` API object passed into callbacks. Read `js/rooms/room1-oubliette.js`
as the reference implementation before writing a room.

## Module shape

```js
import { registerItems } from '../items.js';

registerItems({
  my_item_id: {
    name: 'Iron Key',
    description: 'Cold, heavy, smells of rust.',   // shown when held
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">...</svg>`,
  },
});

export default {
  id: 'guardroom',              // unique slug, used for hint tracking
  title: 'The Gaoler\'s Post',  // shown in HUD
  intro: 'One long sentence of arrival narration, typed out on entry.',

  // Full SVG scene. MUST use viewBox="0 0 1600 900" and
  // preserveAspectRatio="xMidYMid slice". Render from current state —
  // e.g. hide a key that was already taken (check flags/inventory).
  scene(state) { return `<svg viewBox="0 0 1600 900" ...>...</svg>`; },

  // Interactive regions in SCENE coordinates (x right 0-1600, y down 0-900).
  // Return different sets depending on state to reveal/remove interactions.
  hotspots(state) {
    return [
      { id: 'door', x: 640, y: 210, w: 320, h: 480, label: 'Iron door',
        onInteract(game) { /* ... */ } },
    ];
  },

  // Exactly 3 hints, delivered by Gus the companion:
  // nudge (-1:00) -> method (-2:00) -> exact answer (-4:00).
  // May be a function(state) for context-dependent ladders; pair with
  // hintContext(state) returning a key so paid tiers track per-context.
  hints: [
    { text: 'Nudge...', cost: 60 },
    { text: 'The method...', cost: 120 },
    { text: 'The exact answer...', cost: 240 },
  ],
  // hintContext(state) { return state.flags.myroom_doorOpen ? 'winch' : 'door'; },

  onEnter(game) {},   // optional, runs after scene render on entry
};
```

## The `game` API

| Call | Effect |
|---|---|
| `game.state` | live state: `.inventory`, `.flags`, `.timeLeft`, `.currentRoom` |
| `game.say(text)` | queue typewriter narration line (click card to advance) |
| `game.addItem(id, {from: {x, y}})` | add item; `from` (scene coords) plays fly-to-satchel animation |
| `game.hasItem(id)` / `game.removeItem(id)` | inventory checks |
| `game.selectedItem` | item id the player is holding, or `null` — check this in `onInteract` for "use item on X" |
| `game.useSelected()` | consume held item (removes it), returns its id |
| `game.setFlag(k, v)` / `game.getFlag(k)` | persistent per-run flags. Namespace keys with your room id: `'guardroom_gateOpen'` |
| `game.journal.add(id, {title, category, html, sun})` | log a clue. `category: 'note'` with `html` for documents (re-readable forever); `category: 'sun'` with `sun: {rays, letter}` for sun-marks. Call on FIRST examine of every clue-bearing object |
| `game.journal.has(id)` | check whether already journaled |
| `registerCombos([{pair: [a, b], onCombine(game)}])` | (from `items.js`) item+item combination recipes; `onCombine` removes/adds items and narrates |
| `game.refreshScene()` | re-render `scene()` + `hotspots()` after state changed |
| `game.dialog({title, html, wide, buttons})` | examine/note modal. Use `.parchment-note` markup for found documents |
| `game.openPuzzle({id, title, wide, render(body, api), onCleanup})` | puzzle modal — see below |
| `game.completeRoom()` | rumble + unlock sound, then auto-advance to next room (~1.4s). Call exactly once |
| `game.penalize(seconds, reason)` | subtract time (use sparingly — bad guesses in-puzzle should just `api.fail()`) |
| `game.playSfx(name)` | `click pickup unlock wrong solve hint page stone creak pour bell victory` |
| `game.playBell(freqHz)` | pitched bell strike (for musical puzzles) |

## Puzzle modals

```js
game.openPuzzle({
  id: 'guardroom_cipher',
  title: 'The Duty Roster',
  render(body, api) {
    body.innerHTML = `
      <p class="puzzle-desc">Explain the interface diegetically.</p>
      ...inputs...
      <div class="puzzle-row"><button class="btn btn-primary" id="try">Attempt</button></div>
      <div class="puzzle-feedback"></div>`;
    body.querySelector('#try').addEventListener('click', () => {
      if (correct) {
        game.setFlag('guardroom_solved');
        api.solved({ message: 'The lock gives way with a satisfying clunk.' });
        game.refreshScene();
      } else {
        api.fail('The mechanism refuses.');   // shake + wrong sfx + feedback text
      }
    });
  },
});
```

`api`: `close()`, `solved({message})` (plays fanfare, closes), `fail(msg)` (shake + buzz),
`setFeedback(msg, 'bad'|'good'|'')`.

**Wrong answers must never soft-lock or end the puzzle** — the player retries freely.
Puzzles must be fully re-openable: never assume the modal persists.

## Ready-made puzzle UI (css/main.css)

- `.puzzle-desc`, `.puzzle-row`, `.puzzle-feedback` — layout & feedback
- `.puzzle-input` — styled text input
- `.dial` + `.dial-btn` + `.dial-face` — up/down rotating dial (build: btn up, face, btn down; add class `tick` to face on change for pop animation)
- `.tile` (+ `.dragging`, `.slot-target`, `.correct-flash`) — arrangeable tiles. Implement reordering with click-to-swap (click tile A, click tile B) — simpler and touch-friendly; do NOT rely on HTML5 drag-and-drop
- `.lever` / `.lever-track` / `.lever-knob` / `.lever-label` — toggle `.down` class on `.lever`
- `.parchment-note` (+ inner `.note-title`) — documents; add `.aged` for older texts

## SVG scene authoring rules

- `viewBox="0 0 1600 900"`, `preserveAspectRatio="xMidYMid slice"`. **`<image>` layers are now allowed** (visual & interaction upgrade, see [upgrade/README.md](upgrade/README.md)): a room may reference a generated background plate at `<game>/art/<room>.*` as the first `<image>` layer, with state-driven prop sprites and the light effects kept on top. Use repo-relative `href` (e.g. `art/oubliette.jpg`) so it resolves under both the Pages `/Escape-Room/` base and the Vercel root. Purely-procedural scenes remain valid; keep the composition rules below regardless of whether the background is a plate or synthesized.
- Layered depth: background wall → mid furniture → foreground props → light effects last.
- **Palette:** stone `#1c1f2b` `#2a2d3a` `#3a3e4f`, shadows `#0b0e1a`, torch warmth `#ffa94d` `#e07b2a`, gold accents `#c9a227`, parchment `#e8d9b0`, moonlight `#aebfdd`.
- Use `<defs>` gradients generously (radial for light pools, linear for walls/floors). Prefix every gradient/filter id with your room slug (`gd_guardroom_wall`) — scenes share the DOM over a session and ids must not collide.
- Animation classes available on any SVG element (from css/animations.css):
  `torch-flame` (flame wobble; needs shape with base at bottom), `glow` / `glow fast`,
  `flicker`, `moonbeam`, `float`, `sway` / `sway slow`, `fog` / `fog reverse`,
  `spin` / `spin ccw` / `spin slow`, `shimmer`, `beckon`.
- You may embed a `<style>` block INSIDE your svg for room-specific keyframes; prefix
  animation names with your room slug to avoid collisions.
- Every torch/candle: flame shape with `class="torch-flame"` + radial-gradient glow
  ellipse with `class="glow"`. This is the signature look — do not skip it.
- Scene must visually change when meaningful state changes (door opens, item taken:
  check `state.flags` / `state.inventory` inside `scene()` and render accordingly).
- Text inside scenes: `font-family="Palatino Linotype, Georgia, serif"`.

## Placement — nothing floats

Background plates were painted separately from the props, so a prop drawn at an old
coordinate will hover in front of the wrong thing. Every prop must sit on something
the player can believe holds it.

- **Map props to the plate.** Measure the plate's features: wall panels, mantels,
  tables, shelves, doorways, floor line. Draw each prop onto one of them, and put the
  coordinates in named constants at the top of the room (`const MIRROR = {…}`). The
  art and the hotspot both spread the same constant, so they can't drift apart.
- **Mount through `shared/js/scenekit.js`.** `panel({ …rect, material, mount })`
  gives boards, plates, cards and lock faces the hardware that holds them. Mounts:
  `nails`, `pinned`, `hook`, `chains`, `bolts`, `bracket`, `inset`, `easel`, `post`,
  `table`, `arm`, `console`. Use `grounded()` for things on the floor with a contact
  shadow, `shelf()`, `pedestal()`, `wallDoor()` for a door in a side wall in
  perspective, and `shadow()`. Each helper marks its group `data-mount`.
- **Lighting is not a prop.** Glows, washes, glass sheen and water get `data-fx`, so
  the lint doesn't read them as floating panels.
- **Relays dock (duo and group games).** A portable card the player reads to a
  partner (a codebook page, a note, a schematic) docks in the player's kit at the
  top-right `DOCK` via `dock(fromRect, inner, { kind, title })`. Its hotspot spreads
  `...DOCK` and opens the full card. Fixed things (a plate on the wall, writing on a
  slate) stay mounted where they are.
- **A hotspot on the plate alone names what it points at.** Where a hotspot has no
  drawn prop under it (a fireplace, a window, a doorway the plate paints), declare the
  feature on the hotspot: `{ id: 'hearth', plate: 'the fireplace', … }`. The contact
  sheet's `&bare=1` report flags any hotspot with neither art nor a `plate:`, and
  `&bare=review` crops the plate under each one so it can be checked before declaring.
- **Exterior plates get interiors.** If the plate shows the outside but the room is
  inside (Signal Towers), draw the interior shell over it, with the plate visible only
  through a window (`interior()` in `signal-towers/js/scenekit.js`).

## Puzzle-modal header

Every puzzle modal opens on a `.puzzle-hero` band. Use the game's dedicated `art/pz-*.webp`
when it has one; otherwise cut it from the room's plate with
`plateHero('art/<room>.webp', { x, y }, zoom)` (scene coordinates of the thing being worked).

Controls inside the modal use the shared classes (`.dial`, `.dial-btn`, `.tile`,
`.lever-track`, `.btn`, `.puzzle-input`) so they take the skin's `--chrome-*` metal; a
game-specific control sets at least its own background, border and `font: inherit`.
Text in a modal, including SVG text after the SVG is scaled to the modal, is 11px or more.
`/shared/dev/modals.html?all=1` checks all of this for every modal of every game; add
`&w=375&h=812` (a phone held upright) or `&w=812&h=375` (on its side) to check them as a phone
shows them, which also requires every tappable thing to be at least 24px. Rows of controls
must fit a ~300px-wide modal body (let text wrap; never let buttons shrink). A wide drawing
whose labels drop under 11px on a phone held upright gets a "turn your phone sideways" line
automatically (`shared/js/phone.js`); it must pass when the phone is on its side.

## Hotspot rules

- **Later hotspots stack on top** (the engine appends them in order). Push a
  collectible after the machine or table it sits on. A hotspot wholly under a later
  one can never be clicked; the lint reports it as `HIDDEN`.

- **Gus's reserve zone (series rule): keep the TOP-LEFT ~220×250 scene units free of
  hotspots.** Gus always docks top-left of the scene; narration always renders in its
  own bar BELOW the scene (never overlaying it). Flavor art may extend into the zone,
  but nothing clickable should.
- 6–10 hotspots per room. Mix: puzzle-critical, clue-bearing, and 2–3 pure-flavor
  (atmosphere responses via `game.say`) — flavor spots make scenes feel alive.
- Generous hit areas (min ~70×70 scene units). No pixel hunting: anything examinable
  should read as an object in the scene art.
- Re-derive hotspots from state: remove a hotspot once its item is taken, add new ones
  when flags unlock (`hotspots(state)` is re-queried on every `refreshScene()`).

## Difficulty & fairness (non-negotiable)

- **Hints:** exactly three tiers. The first nudges and never contains the answer. The
  last states the answer the code accepts, and the lint checks it against the room's
  answer constants or its declared `solution`.
- **Split knowledge (duo and group games):** prefer data on one screen and the rule on
  the other (a reef bearing plus an aiming rule; line pressures plus a valve rule) over
  plain dictation of the answer.

- The full deduction chain must exist in-scene: clue objects + a way to notice they
  matter. Follow the DESIGN.md spec for your room exactly — exact solutions, exact
  clue text.
- First-time examine of any clue-bearing object must give complete information
  (players must never need to revisit a modal they can no longer reopen — keep all
  clue modals reopenable).
- Solutions must be checkable in code without ambiguity (canonicalize: trim,
  lowercase, strip spaces for text answers).
- On solve: set your flag, `api.solved(...)`, `game.refreshScene()`, and gate
  `game.completeRoom()` behind the final interaction described in DESIGN.md.
