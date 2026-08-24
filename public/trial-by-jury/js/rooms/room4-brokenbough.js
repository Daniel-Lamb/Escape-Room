// SCENE 4 — The Broken Bough (how the thief got in · last cross-examination).
//   Heron 254 · Gecko 806 · Boar 371 · Parrot 149
// The Parrot logs exhibit #4 ("W"). After this, the verdict.

import { buildRoom } from '../jurykit.js';

const intros = {
  p1: 'The broken bough over the wall is measured, Heron. Your reading is a figure short — another witness saw the drop.',
  p2: 'The bough is how the hoard was reached, Gecko — over the wall, not up it. Your account of it has a gap. Fill it, carefully.',
  p3: 'From below you heard the bough go, Boar, but missed a figure of it. A fellow witness kept the count.',
  p4: 'The last of it is yours to square, Parrot: the broken bough, the way in. One figure escaped you — another holds it. Then the court decides.',
};

const lore = {
  p1: { label: 'The snapped bough', title: 'The Snapped Bough', html: `<div class="chartcard"><div class="chart-title">above the wall</div><p>A fig-bough snapped clean and swinging — a light body dropped from it onto the hoard. No Sloth could reach the bough, let alone ride it down.</p></div>` },
  p2: { label: 'A high tag', title: 'A High Tag', html: `<div class="chartcard"><div class="chart-title">snagged on the bough</div><p>The fourth and last exhibit, snagged where the bough broke. Enter it — four exhibits now, and a name spelled out for the bench.</p></div>` },
  p3: { label: 'The fallen figs', title: 'The Fallen Figs', html: `<div class="chartcard"><div class="chart-title">under the wall</div><p>Figs dropped in a hurry, and among them one more black feather. The thief has wings and a bad habit of leaving them behind.</p></div>` },
  p4: { label: 'The whole story', title: 'The Whole Story', html: `<div class="chartcard"><div class="chart-title">what it all says</div><p>A climber with claws and black feathers, over the wall by the bough, fast and light, between moon-high and first bird. And one witness who swore they never left the far bank — with their prints in the mud. You have your liar, and your thief. Take them to the verdict.</p></div>` },
};

export default buildRoom({
  id: 'brokenbough',
  slug: 'bb',
  lockLabel: 'Your Reading',
  codes: { p1: '254', p2: '806', p3: '371', p4: '149' },
  tokens: { p4: { pos: 4, letter: 'W' } },
  titleFor: () => 'The Broken Bough',
  introFor: (r) => intros[r],
  loreFor: (r) => lore[r],
});
