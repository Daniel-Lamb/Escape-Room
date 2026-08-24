// SCENE 1 — The Fig-Tree (the scene of the raid · cyclic cross-examination).
//   Heron 428 · Gecko 173 · Boar 905 · Parrot 651
// The Heron logs exhibit #1 ("C").

import { buildRoom } from '../jurykit.js';

const intros = {
  p1: 'You watched the fig-tree from the river all night, Heron. Your account is nearly whole — but one figure you never quite saw. Another witness did. The court is listening.',
  p2: 'You clung to the wall above the hoard, Gecko, and saw more than most. Yet your own account has a gap only another witness can fill. Speak, and cross-check.',
  p3: 'You rooted below the fig-tree, Boar, nose to the ground. What you missed overhead, another saw. Trade what you know.',
  p4: 'You repeat all you hear, Parrot, but even you lost a figure in the dark. Another witness kept it. Ask, and give what they lack in return.',
};

const lore = {
  p1: { label: 'The river reeds', title: 'The River Reeds', html: `<div class="chartcard"><div class="chart-title">what the water showed</div><p>A carved fig-wood tag drifts against the reeds — the first of the court's exhibits. Enter it into the record; four of them will name the thief.</p></div>` },
  p2: { label: 'The hoard wall', title: 'The Hoard Wall', html: `<div class="chartcard"><div class="chart-title">from the wall</div><p>The figs were stacked to the third course of stone at dusk. By dawn the top two courses were gone — and the old Sloth cannot climb past the first.</p></div>` },
  p3: { label: 'The tree roots', title: 'The Tree Roots', html: `<div class="chartcard"><div class="chart-title">nose to the ground</div><p>Fig-pulp trodden into the mud, and a single black feather caught in a root. Sloths have no feathers. Someone else was under this tree.</p></div>` },
  p4: { label: 'The night calls', title: 'The Night Calls', html: `<div class="chartcard"><div class="chart-title">what the dark said</div><p>"Three calls before moonset," you recall, "then a rasp on the wall, then wings." The court will want the order of it, later — keep it straight.</p></div>` },
};

export default buildRoom({
  id: 'figtree',
  slug: 'ft',
  lockLabel: 'Your Account',
  codes: { p1: '428', p2: '173', p3: '905', p4: '651' },
  tokens: { p1: { pos: 1, letter: 'C' } },
  titleFor: () => 'The Fig-Tree',
  introFor: (r) => intros[r],
  loreFor: (r) => lore[r],
});
