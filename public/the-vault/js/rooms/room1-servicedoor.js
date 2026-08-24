// SCENE 1 — Getting In (tutorial · cyclic cross-read).
// Each station has its own three-dial lock; the code that opens it is shown on
// the screen of the crewmate BEFORE you in the cycle. Cracker→Wire→Face→Wheel→…
//   Cracker 317 · Wire 528 · Face 946 · Wheel 175
// Cracker pockets tumbler-chip #1 ("4"); Wire pockets #2 ("7").

import { buildRoom } from '../crewkit.js';

const intros = {
  p1: "You're first through the alley grille, at the old freight lock into the vault stack. Your own combination isn't stamped anywhere down here — but someone up the line can read it. Talk to the crew.",
  p2: "The security closet is a nest of wires and a keypad you can't yet open. Your code lives on a crewmate's screen, not yours. Start the chatter.",
  p3: "You're on the bank floor in a borrowed uniform, at the staff door to the back stair. The release code isn't on your side — ask the crew who can see it.",
  p4: "You're in the van with the block on every camera feed but one lock of your own to throw — the loading roller. Its code is on a crewmate's screen. Get them talking.",
};

const lore = {
  p1: { label: 'The old freight lock', title: 'Freight Lock', html: `<div class="chartcard"><div class="chart-title">scratched in the paint</div><p>Someone crewed this door before. A tally of four scratches, and under it: <em>"four hands or none."</em> Whoever tried it alone did not get in.</p></div>` },
  p2: { label: 'The wiring board', title: 'Wiring Board', html: `<div class="chartcard"><div class="chart-title">closet schematic</div><p>The trunk lines all run to one clock: the vault's own time-lock, sixty minutes on the dial. When it re-arms, the door won't open till morning. Move.</p></div>` },
  p3: { label: 'The staff notice', title: 'Staff Notice', html: `<div class="chartcard"><div class="chart-title">break-room memo</div><p>"Combinations rotate nightly and are <strong>never posted at the lock they open</strong> — see your section head." Tonight the section heads are each other.</p></div>` },
  p4: { label: 'The scanner', title: 'Radio Scanner', html: `<div class="chartcard"><div class="chart-title">patrol band</div><p>The beat car won't loop back for the better part of an hour. You have the window. You do not have it twice.</p></div>` },
};

export default buildRoom({
  id: 'servicedoor',
  slug: 'sd',
  lockLabel: 'Your Way In',
  codes: { p1: '317', p2: '528', p3: '946', p4: '175' },
  chips: { p1: { pos: 1, digit: '4' }, p2: { pos: 2, digit: '7' } },
  titleFor: () => 'Getting In',
  introFor: (r) => intros[r],
  loreFor: (r) => lore[r],
});
