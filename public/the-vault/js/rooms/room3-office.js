// SCENE 3 — The Manager's Office (cyclic cross-read).
//   Cracker 863 · Wire 194 · Face 507 · Wheel 628
// Cracker pockets tumbler-chip #5 ("3"); Wire pockets #6 ("6").

import { buildRoom } from '../crewkit.js';

const intros = {
  p1: 'A wall-drill jig is bolted over the stair vault, keyed to a three-figure setting. Your setting is on a crewmate\'s screen — ask.',
  p2: 'A locked patch-cabinet stands between you and the camera loop. Its code sits on someone else\'s screen. Talk.',
  p3: 'You made it to the manager\'s office. The desk safe is yours to crack — but its code was mailed to a crewmate, not to you.',
  p4: 'The manager\'s car is in your lot with a lockbox on the mirror. Its code is on a crewmate\'s screen; you hold theirs.',
};

const lore = {
  p1: { label: 'The drill jig', title: 'Drill Jig', html: `<div class="chartcard"><div class="chart-title">borrowed tooling</div><p>A brass chip is caught in the jig's tray, stamped and forgotten by the last crew. Take it — the vault wants six, in order.</p></div>` },
  p2: { label: 'The patch cabinet', title: 'Patch Cabinet', html: `<div class="chartcard"><div class="chart-title">camera trunk</div><p>Loop the feed here and the office goes blind for the Face. A chip sits on the shelf inside — pocket it; you'll need all six at the door.</p></div>` },
  p3: { label: "The manager's desk", title: "Manager's Desk", html: `<div class="chartcard"><div class="chart-title">what people keep</div><p>A framed photo, a good pen, and a habit of writing nothing down — which is exactly why the safe code went to a colleague's screen and not to a note in this drawer.</p></div>` },
  p4: { label: 'The lockbox', title: 'Mirror Lockbox', html: `<div class="chartcard"><div class="chart-title">on the wing mirror</div><p>A valet box, the kind that trusts a code more than a face. Yours to open once a crewmate reads you the figures.</p></div>` },
};

export default buildRoom({
  id: 'office',
  slug: 'of',
  lockLabel: 'Your Lock',
  codes: { p1: '863', p2: '194', p3: '507', p4: '628' },
  chips: { p1: { pos: 5, digit: '3' }, p2: { pos: 6, digit: '6' } },
  titleFor: () => "The Manager's Office",
  introFor: (r) => intros[r],
  loreFor: (r) => lore[r],
});
