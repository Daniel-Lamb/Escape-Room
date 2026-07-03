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

- `viewBox="0 0 1600 900"`, `preserveAspectRatio="xMidYMid slice"`, no external refs, no `<image>`.
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

## Hotspot rules

- 6–10 hotspots per room. Mix: puzzle-critical, clue-bearing, and 2–3 pure-flavor
  (atmosphere responses via `game.say`) — flavor spots make scenes feel alive.
- Generous hit areas (min ~70×70 scene units). No pixel hunting: anything examinable
  should read as an object in the scene art.
- Re-derive hotspots from state: remove a hotspot once its item is taken, add new ones
  when flags unlock (`hotspots(state)` is re-queried on every `refreshScene()`).

## Difficulty & fairness (non-negotiable)

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
