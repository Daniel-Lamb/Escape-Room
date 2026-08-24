// SCENE 3 — The Muddy Bank (the tracks · cyclic cross-examination).
//   Heron 617 · Gecko 093 · Boar 458 · Parrot 832
// The Boar logs exhibit #3 ("O").

import { buildRoom } from '../jurykit.js';

const intros = {
  p1: 'The tracks in the bank are counted now, Heron. Your tally is one figure short — another witness watched the same mud.',
  p2: 'The prints tell who came and went, Gecko — and your count of them has a hole only another can fill. Cross-check, and mind your story.',
  p3: 'This is your ground, Boar: the muddy bank, the prints. Yet even you missed a figure. A fellow witness kept it.',
  p4: 'You echoed the count of the tracks, Parrot, but lost a figure in the echo. Another holds it true.',
};

const lore = {
  p1: { label: 'The webbed prints', title: 'The Webbed Prints', html: `<div class="chartcard"><div class="chart-title">at the waterline</div><p>Your own long-toed prints, Heron, and beside them a set of sharp three-clawed marks — a climber's feet, not a Sloth's hooked paws.</p></div>` },
  p2: { label: 'A muddy tag', title: 'A Muddy Tag', html: `<div class="chartcard"><div class="chart-title">pressed in the clay</div><p>The third fig-wood exhibit, pressed into the clay. Enter it in the record; three named, one to go.</p></div>` },
  p3: { label: 'The drag-mark', title: 'The Drag-Mark', html: `<div class="chartcard"><div class="chart-title">what you smelled</div><p>The Sloth's slow drag runs to the tree and stops — it never reached the wall. But a light, clawed trail runs right up the stone and away with the figs. That trail is not the one on trial.</p></div>` },
  p4: { label: 'The false step', title: 'The False Step', html: `<div class="chartcard"><div class="chart-title">a story that limps</div><p>One witness swore they never left the far side all night — yet their prints are here in this mud, plain as day. A witness whose feet contradict their tongue is the witness to watch.</p></div>` },
};

export default buildRoom({
  id: 'muddybank',
  slug: 'mb',
  lockLabel: 'Your Tally',
  codes: { p1: '617', p2: '093', p3: '458', p4: '832' },
  tokens: { p3: { pos: 3, letter: 'O' } },
  titleFor: () => 'The Muddy Bank',
  introFor: (r) => intros[r],
  loreFor: (r) => lore[r],
});
