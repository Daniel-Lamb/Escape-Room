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
  how: string; // brief "how it works" shown in the header's (?) tooltip
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
      "You're locked in Vayne Keep with an hour until dawn. A dead monk left a trail of carved suns through the chambers; follow it to the way out.",
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
      "You wake alone on a failing orbital station, sixty minutes from re-entry. The crew is gone, the AI core is wiped, and your own reflection doesn't add up.",
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
      "You've fallen into a jungle that's on no map, where the animals hold court and you're the one on trial. Seven cases to clear before nightfall.",
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
      "Condemned to the midday games beneath the Colosseum, you pick up the trail of a man who vanished down here — six bone tokens, and a guard's story that a lion got him.",
    chips: ['1 player', '7 chambers', 'Hard but fair'],
    gusChip: '🦁 Gus, the Emperor’s lion',
    art: 'gate-of-life',
    href: 'gate-of-life/',
    cta: 'Enter the Hypogeum',
    saveKey: 'gate-of-life-save-v1',
    freshText: 'Unplayed — the carcer waits.',
  },
  {
    id: 'signal-towers',
    mode: 'duo',
    status: 'live',
    kicker: 'Duo · Asymmetric co-op',
    title: 'Twin Signal Towers',
    blurb:
      "Two keepers, two lighthouses, one ship going down offshore. You each see only half the coast, and every lock is answered on your partner's screen — so keep talking.",
    chips: ['2 players', '7 scenes', 'Two screens'],
    gusChip: '🐦 Gus, storm petrel',
    art: 'signal-towers',
    href: 'signal-towers/',
    cta: 'Take a Watch',
    saveKey: 'signal-towers-p1-save-v1',
    freshText: 'Unplayed — the lamps are cold.',
  },
  {
    id: 'looking-glass',
    mode: 'duo',
    status: 'live',
    kicker: 'Duo · Through the glass',
    title: 'The Looking Glass',
    blurb:
      "One of you is in the manor; the other is inside the mirror, where every room hangs reversed. Each side sees clues the other can't — trade them before dawn.",
    chips: ['2 players', '7 rooms', 'Reversed world'],
    gusChip: '🐈‍⬛ Gus, the manor cat',
    art: 'looking-glass',
    href: 'looking-glass/',
    cta: 'Step to the Glass',
    saveKey: 'looking-glass-p1-save-v1',
    freshText: 'Unplayed — the mirror waits.',
  },
  {
    id: 'silent-alarm',
    mode: 'duo',
    status: 'live',
    kicker: 'Duo · Two-screen heist',
    title: 'Silent Alarm',
    blurb:
      "One of you is inside the museum, hands on the locks; the other runs overwatch from the van with the schematics and the camera feeds. Every code is on your partner's screen, and you're on the clock before the alarm trips.",
    chips: ['2 players', '7 scenes', 'Two screens'],
    gusChip: '🐀 Gus, museum rat',
    art: 'silent-alarm',
    href: 'silent-alarm/',
    cta: 'Take the Job',
    saveKey: 'silent-alarm-p1-save-v1',
    freshText: 'Unplayed — the vault is cold.',
  },
  {
    id: 'deep-six',
    mode: 'duo',
    status: 'live',
    kicker: 'Duo · Deep-sea salvage',
    title: 'Deep Six',
    blurb:
      "One of you is down on the wreck of the Cormorant with a lamp and a shrinking supply of air; the other works the sonar, radio, and winch topside. Every lock below is answered by an instrument above, and the air won't last.",
    chips: ['2 players', '7 scenes', 'Two screens'],
    gusChip: '🦭 Gus, harbor seal',
    art: 'deep-six',
    href: 'deep-six/',
    cta: 'Suit Up',
    saveKey: 'deep-six-p1-save-v1',
    freshText: 'Unplayed — the line is coiled.',
  },
  {
    id: 'two-keys-one-door',
    mode: 'duo',
    status: 'concept',
    kicker: 'Duo · Asymmetric',
    title: 'Two Keys, One Door',
    blurb:
      'Two players, two screens, one lock. Each of you sees half of it, and the door opens only when you put both halves together.',
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
      'One of you holds the only map; the other walks the dark and never sees it. The only way out is to talk each other through it.',
    chips: ['2 players', 'Voice co-op'],
    gusChip: 'Gus, unreliable narrator',
    art: 'blind-cartographer',
  },
  {
    id: 'the-vault',
    mode: 'group',
    status: 'live',
    kicker: 'Group · 3–6 players',
    title: 'The Vault',
    blurb:
      'Three to six of you, one time-locked vault, and a lot of moving parts. Split the roles, share what only you can see, and crack it before the clock runs out.',
    chips: ['3–6 players', '5 scenes', 'Roles'],
    gusChip: '🦡 Gus, crew ferret',
    art: 'the-vault',
    href: 'the-vault/',
    cta: 'Pick a Station',
    saveKey: 'the-vault-p1-save-v1',
    freshText: 'Unplayed — the time-lock is armed.',
  },
  {
    id: 'trial-by-jury',
    mode: 'group',
    status: 'live',
    kicker: 'Group · Social deduction',
    title: 'Trial by Jury',
    blurb:
      'The Wild Court reconvenes, and this time the jury is you — but one of you is lying to the bench. The right verdict gets everyone out; the wrong one keeps you in.',
    chips: ['4–8 players', '5 scenes', 'Hidden roles'],
    gusChip: '🐒 Gus, court clerk',
    art: 'trial-by-jury',
    href: 'trial-by-jury/',
    cta: 'Take the Stand',
    saveKey: 'trial-by-jury-p1-save-v1',
    freshText: 'Unplayed — the court is in session.',
  },
];

export const sections: Section[] = [
  {
    mode: 'single',
    title: 'Single-player',
    sub: 'A single player and about an hour per room. Each one is hand-built, fair, and playable start to finish today.',
    how: 'Just you. Explore each scene, examine clues, and solve seven puzzles to escape before the hour runs out. Stuck? Gus, your companion, gives hints.',
  },
  {
    mode: 'duo',
    title: 'For Duos',
    sub: 'Co-op rooms for two: you each see half the room and talk each other through the locks. Four are live, with more on the way.',
    how: 'Two players, on two separate screens. Each of you picks a different role and sees only half the room — the code that opens your lock is shown on your partner’s screen, so you solve it by talking to each other.',
    count: '4 live · more soon',
  },
  {
    mode: 'group',
    title: 'For Groups',
    sub: 'Party rooms for three to eight players. Everyone takes a role and pools what only they can see. Two are live.',
    how: 'A party game for three to eight. Everyone takes a role and pools what they alone can see to crack shared locks and reach a group verdict before time runs out.',
    count: '2 live',
  },
];

export const liveRooms = rooms.filter((r) => r.status === 'live');
