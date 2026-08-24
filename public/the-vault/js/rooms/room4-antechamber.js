// SCENE 4 — The Antechamber (cyclic cross-read; last gate before the vault).
//   Cracker 350 · Wire 712 · Face 489 · Wheel 205
// No chips here — the six tumbler-chips are already out among the crew.

import { buildRoom } from '../crewkit.js';

const intros = {
  p1: 'The cage in front of the vault is yours to open — a three-dial gate. Your figures are on a crewmate\'s screen. Last cross-read before the door.',
  p2: 'The last shutter drops on your closet monitors and a three-dial override holds it. The code is on a crewmate\'s screen, not yours.',
  p3: 'A steel turnstile bars the antechamber. Its release is three dials, and the setting is on someone else\'s side. Ask.',
  p4: 'The loading cage between you and the others needs a three-dial code — held, as ever, on a crewmate\'s screen.',
};

const lore = {
  p1: { label: 'The cage', title: 'The Cage', html: `<div class="chartcard"><div class="chart-title">brass and bar</div><p>Beyond it, the vault door — a black wheel taller than you are, and six numbered dials waiting. Everything you pocketed comes due there.</p></div>` },
  p2: { label: 'The monitors', title: 'The Monitors', html: `<div class="chartcard"><div class="chart-title">closet bank</div><p>Every camera loops clean. The only clock still honest is the time-lock, and it is not on your side.</p></div>` },
  p3: { label: 'The turnstile', title: 'The Turnstile', html: `<div class="chartcard"><div class="chart-title">last habit</div><p>The manager's note, half-burned in the bin: "…and for pity's sake tell no one their own numbers." You wonder if they'd have laughed at how well it worked against them.</p></div>` },
  p4: { label: 'The loading cage', title: 'Loading Cage', html: `<div class="chartcard"><div class="chart-title">your last lock</div><p>Past it, the crew and the vault. Get this open and it comes down to six brass chips and one wheel.</p></div>` },
};

export default buildRoom({
  id: 'antechamber',
  slug: 'an',
  lockLabel: 'Your Gate',
  codes: { p1: '350', p2: '712', p3: '489', p4: '205' },
  titleFor: () => 'The Antechamber',
  introFor: (r) => intros[r],
  loreFor: (r) => lore[r],
});
