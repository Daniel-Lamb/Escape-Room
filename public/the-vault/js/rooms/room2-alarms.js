// SCENE 2 — Killing the Alarms (cyclic cross-read).
//   Cracker 482 · Wire 209 · Face 651 · Wheel 730
// Face pockets tumbler-chip #3 ("1"); Wheel pockets #4 ("9").

import { buildRoom } from '../crewkit.js';

const intros = {
  p1: 'Past the first door, a pressure-plate box guards the stack stair. Its cut-out code is on a crewmate\'s screen — get it before you step wrong.',
  p2: 'This is your scene: the main alarm panel, live and blinking. Its disarm code is on someone else\'s screen, though. Ask around fast.',
  p3: 'A motion sensor sweeps the lobby you have to cross. The bypass code isn\'t yours to see — a crewmate holds it.',
  p4: 'A silent trip-wire runs to your van\'s own relay box. Cut it wrong and you flag the lot of you. The code is on a crewmate\'s screen.',
};

const lore = {
  p1: { label: 'The pressure plate', title: 'Pressure Plate', html: `<div class="chartcard"><div class="chart-title">under the tread</div><p>A hair-trigger, but old. It answers to a three-figure cut-out — the same brand the Wire is staring at. Trade codes and it sleeps.</p></div>` },
  p2: { label: 'The alarm panel', title: 'Alarm Panel', html: `<div class="chartcard"><div class="chart-title">Meridian Trust · zone board</div><p>Every zone green but yours. Whoever wired this liked round habits: no code is ever kept in the room it guards.</p></div>` },
  p3: { label: 'The sensor head', title: 'Motion Sensor', html: `<div class="chartcard"><div class="chart-title">ceiling sweep</div><p>It ticks left, right, left. Between ticks there's a breath of dark — enough, once the bypass is in. The bypass is on a crewmate's screen.</p></div>` },
  p4: { label: 'The relay box', title: 'Van Relay', html: `<div class="chartcard"><div class="chart-title">under the dash</div><p>The trip-wire loops back here, to you. A brass chip is taped inside the lid — pocket it; the vault at the end will want six.</p></div>` },
};

export default buildRoom({
  id: 'alarms',
  slug: 'al',
  lockLabel: 'Your Cut-Out',
  codes: { p1: '482', p2: '209', p3: '651', p4: '730' },
  chips: { p3: { pos: 3, digit: '1' }, p4: { pos: 4, digit: '9' } },
  titleFor: () => 'Killing the Alarms',
  introFor: (r) => intros[r],
  loreFor: (r) => lore[r],
});
