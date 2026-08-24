// SCENE 2 — The Truce-Stone (the order of the night · cyclic cross-examination).
//   Heron 380 · Gecko 749 · Boar 216 · Parrot 524
// The Gecko logs exhibit #2 ("R").

import { buildRoom } from '../jurykit.js';

const intros = {
  p1: 'At the truce-stone the court fixes the hour of the theft, Heron. Your reckoning of it is missing a figure — another witness has it.',
  p2: 'The truce-stone marks when the peace was broken, Gecko. Your own count has a gap; only another saw that part. Trade.',
  p3: 'The order of the night is argued at the stone, Boar. What you missed, a fellow witness kept. Ask them.',
  p4: 'You of all should have the whole order, Parrot — but one figure slipped you. Another holds it. Speak.',
};

const lore = {
  p1: { label: 'The water-clock', title: 'The Water-Clock', html: `<div class="chartcard"><div class="chart-title">by the dripping stone</div><p>The court measures the night by a dripping stone. The theft fell between moon-high and the first bird — a window too short for a slow old Sloth to climb, strip a hoard, and be gone.</p></div>` },
  p2: { label: 'A pale tag', title: 'A Carved Tag', html: `<div class="chartcard"><div class="chart-title">wedged in the stone</div><p>A second fig-wood exhibit is wedged in a crack of the truce-stone. Log it — the four together spell the one who did this.</p></div>` },
  p3: { label: 'The scuffed moss', title: 'The Scuffed Moss', html: `<div class="chartcard"><div class="chart-title">around the base</div><p>The moss is scuffed in quick, light steps — nothing like the Sloth's slow drag. Whoever broke the truce moved fast and left light.</p></div>` },
  p4: { label: 'The repeated oath', title: 'The Repeated Oath', html: `<div class="chartcard"><div class="chart-title">what was sworn</div><p>Every witness swore true on the truce-stone at dawn. If the accounts still disagree, then one of the four who swore is lying to the bench.</p></div>` },
};

export default buildRoom({
  id: 'trucestone',
  slug: 'ts',
  lockLabel: 'Your Reckoning',
  codes: { p1: '380', p2: '749', p3: '216', p4: '524' },
  tokens: { p2: { pos: 2, letter: 'R' } },
  titleFor: () => 'The Truce-Stone',
  introFor: (r) => intros[r],
  loreFor: (r) => lore[r],
});
