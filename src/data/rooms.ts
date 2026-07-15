// The dashboard is driven entirely by this data. Adding a room is one object.
//
// This extends the schema sketched in docs/MIGRATION.md to match what a card
// actually renders: the kicker line ("Room I · Medieval"), the distinct Gus
// companion chip, and — for live rooms — the CTA label, save key, and the
// "unplayed" status text. The art field names an SVG in src/svg/<art>.svg.

export type Mode = 'single' | 'duo' | 'group';

export interface Room {
  id: string; // also the folder slug for live rooms and the art file name
  mode: Mode;
  status: 'live' | 'concept';
  kicker: string; // the card-num line, e.g. "Room I · Medieval"
  title: string;
  blurb: string;
  chips: string[]; // plain chips (the Gus companion chip is separate)
  gusChip: string; // rendered with the highlighted .gus treatment
  art: string; // src/svg/<art>.svg

  // Live rooms only:
  href?: string; // relative, host-agnostic — 'pilgrims-road/'
  cta?: string; // enter-button label, e.g. "Enter the Keep"
  saveKey?: string; // localStorage key the game writes, e.g. 'pilgrims-road-save-v1'
  freshText?: string; // status line before the room has been played
}

export interface Section {
  mode: Mode;
  title: string;
  sub: string;
  count?: string; // omit to derive "<n> rooms · live" from the room list
}

export const rooms: Room[] = [
  {
    id: 'pilgrims-road',
    mode: 'single',
    status: 'live',
    kicker: 'Room I · Medieval',
    title: "The Pilgrim's Road",
    blurb:
      "Condemned at dawn in Vayne Keep, you find a dead monk's trail of carved suns — and one hour to finish the road he died building.",
    chips: ['1 player', '7 chambers', '~60 min'],
    gusChip: '👻 Sir Gus, ghost-knight',
    art: 'pilgrims-road',
    href: 'pilgrims-road/',
    cta: 'Enter the Keep',
    saveKey: 'pilgrims-road-save-v1',
    freshText: 'Unplayed — the cell waits.',
  },
  {
    id: 'starfall-station',
    mode: 'single',
    status: 'live',
    kicker: 'Room II · Futurist',
    title: 'Starfall Station',
    blurb:
      'You wake alone on a dying orbital station, sixty minutes from re-entry. The crew is gone, the AI core is empty, and something about your own reflection is... unavailable.',
    chips: ['1 player', '7 decks', 'Twist ending'],
    gusChip: '🤖 GS-1 "Gus", drone',
    art: 'starfall-station',
    href: 'starfall-station/',
    cta: 'Board the Station',
    saveKey: 'starfall-station-save-v1',
    freshText: 'Unplayed — the cryo bay hums.',
  },
  {
    id: 'wild-court',
    mode: 'single',
    status: 'live',
    kicker: 'Room III · Animal Kingdom',
    title: 'The Wild Court',
    blurb:
      'You fell into a jungle that appears on no map — because the tribunal that lives there summons its own witnesses. Seven trials to nightfall, and your advocate has a tail.',
    chips: ['1 player', '7 trials', 'Verdict twist'],
    gusChip: '🐒 Gus, tamarin advocate',
    art: 'wild-court',
    href: 'wild-court/',
    cta: 'Enter the Green',
    saveKey: 'wild-court-save-v1',
    freshText: 'Unplayed — the Court is in session.',
  },
  {
    id: 'gate-of-life',
    mode: 'single',
    status: 'live',
    kicker: 'Room IV · Ancient Rome',
    title: 'The Gate of Life',
    blurb:
      'Condemned to the midday games beneath the Colosseum, you find six bone tokens left by a man the guards say a lion ate. The lion disagrees.',
    chips: ['1 player', '7 chambers', 'Hard but fair'],
    gusChip: '🦁 Gus, the Emperor’s lion',
    art: 'gate-of-life',
    href: 'gate-of-life/',
    cta: 'Enter the Hypogeum',
    saveKey: 'gate-of-life-save-v1',
    freshText: 'Unplayed — the carcer waits.',
  },
  // Room V (EDEN: The Four Rivers) is live at /eden/ but unlisted while the
  // greybox is playtested — restore its card here when it's ready to show.
  {
    id: 'two-keys-one-door',
    mode: 'duo',
    status: 'concept',
    kicker: 'Duo · Asymmetric',
    title: 'Two Keys, One Door',
    blurb:
      'Two players, two screens, one lock. Each of you sees half the truth — and the door opens only when you trust the half you cannot see.',
    chips: ['2 players', 'Split screen'],
    gusChip: 'Gus, referee',
    art: 'two-keys-one-door',
  },
  {
    id: 'blind-cartographer',
    mode: 'duo',
    status: 'concept',
    kicker: 'Duo · Guide & Ghost',
    title: 'The Blind Cartographer',
    blurb:
      'One of you holds the only map. The other walks the dark and never sees it. Nightfall comes for whoever stops talking first.',
    chips: ['2 players', 'Voice co-op'],
    gusChip: 'Gus, unreliable narrator',
    art: 'blind-cartographer',
  },
  {
    id: 'the-vault',
    mode: 'group',
    status: 'concept',
    kicker: 'Group · 3–6 players',
    title: 'The Vault',
    blurb:
      "Six pairs of hands, one time-locked vault, and exactly enough rope for everyone to hang the plan. Split the roles. Don't split the party.",
    chips: ['3–6 players', 'Roles'],
    gusChip: 'Gus, quartermaster',
    art: 'the-vault',
  },
  {
    id: 'trial-by-jury',
    mode: 'group',
    status: 'concept',
    kicker: 'Group · Social deduction',
    title: 'Trial by Jury',
    blurb:
      'The Wild Court reconvenes — and this time the jury is you. One of you is lying to the bench. The verdict escapes the room; the wrong verdict keeps it.',
    chips: ['4–8 players', 'Hidden roles'],
    gusChip: '🐒 Gus, presiding',
    art: 'trial-by-jury',
  },
];

export const sections: Section[] = [
  {
    mode: 'single',
    title: 'Single-player',
    sub: 'One player, one hour, one companion. Every room is hand-built, strictly fair, and playable start to finish today.',
  },
  {
    mode: 'duo',
    title: 'For Duos',
    sub: 'Co-op rooms built for two — asymmetric information, shared locks, and a companion who plays favourites.',
    count: 'In development',
  },
  {
    mode: 'group',
    title: 'For Groups',
    sub: 'Party-sized rooms for three to six — roles, sabotage, and a verdict that needs a quorum.',
    count: 'In development',
  },
];

export const liveRooms = rooms.filter((r) => r.status === 'live');
