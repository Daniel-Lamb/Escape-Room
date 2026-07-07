// Gus's form for THE GATE OF LIFE: an old Colosseum lion who refuses to
// perform. Everyone below assumes Gus is short for Augustus; Gus permits
// this. Felix raised him from a cub. The paperwork says otherwise. The
// paperwork is wrong about a lot of things.

export const GUS = {
  name: 'Gus',
  epithet: 'Gustus — the Emperor\'s lion, retired by his own decision',
  form: 'lion',

  portrait(size = 'large') {
    const s = size === 'small' ? '_s' : '';
    return `
    <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id="gd_gusl_mane${s}" cx="0.5" cy="0.42" r="0.62">
          <stop offset="0" stop-color="#d1a53f"/>
          <stop offset="0.62" stop-color="#a97a28"/>
          <stop offset="1" stop-color="#8a5a1c"/>
        </radialGradient>
        <radialGradient id="gd_gusl_glow${s}" cx="0.5" cy="0.45" r="0.62">
          <stop offset="0" stop-color="rgba(255,207,106,0.35)"/>
          <stop offset="1" stop-color="rgba(255,207,106,0)"/>
        </radialGradient>
        <linearGradient id="gd_gusl_face${s}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#e0bd6e"/>
          <stop offset="1" stop-color="#b8893a"/>
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="66" rx="56" ry="60" fill="url(#gd_gusl_glow${s})"/>
      <!-- mane: ragged ring of tufts -->
      <path d="M60 12
        C74 12 82 18 90 24 C102 28 106 40 104 50 C112 58 110 72 104 80
        C106 92 98 102 88 106 C82 116 70 120 60 118
        C50 120 38 116 32 106 C22 102 14 92 16 80
        C10 72 8 58 16 50 C14 40 18 28 30 24 C38 18 46 12 60 12 Z"
        fill="url(#gd_gusl_mane${s})" stroke="#5c3a12" stroke-width="2.5"/>
      <!-- inner mane shadow -->
      <ellipse cx="60" cy="66" rx="35" ry="37" fill="#6b4514" opacity="0.55"/>
      <!-- ears: left whole, right torn -->
      <circle cx="34" cy="30" r="9" fill="#b8893a" stroke="#5c3a12" stroke-width="2"/>
      <circle cx="34" cy="31" r="4.5" fill="#7a5518"/>
      <path d="M80 24 l7 -4 l-2 7 l6 1 l-6 6 q-6 -2 -7 -6 z" fill="#b8893a" stroke="#5c3a12" stroke-width="2" stroke-linejoin="round"/>
      <!-- face -->
      <ellipse cx="60" cy="68" rx="28" ry="30" fill="url(#gd_gusl_face${s})" stroke="#5c3a12" stroke-width="2"/>
      <!-- brow scar -->
      <path d="M44 47 l10 6 M47 44 l4 8" stroke="#8a5a1c" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
      <!-- heavy-lidded amber eyes -->
      <path d="M42 58 q7 -5 14 0" fill="none" stroke="#5c3a12" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M64 58 q7 -5 14 0" fill="none" stroke="#5c3a12" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="49" cy="61" rx="5" ry="4" fill="#ffcf6a"/>
      <ellipse cx="71" cy="61" rx="5" ry="4" fill="#ffcf6a"/>
      <circle cx="49" cy="61" r="2" fill="#2b1a08"/>
      <circle cx="71" cy="61" r="2" fill="#2b1a08"/>
      <path d="M41 57 q8 -3 16 1 M63 58 q8 -4 16 -1" stroke="#8a5a1c" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
      <!-- muzzle -->
      <ellipse cx="60" cy="80" rx="15" ry="12" fill="#e8d0a0"/>
      <path d="M54 74 Q60 70 66 74 L63 79 Q60 82 57 79 Z" fill="#5c3a12"/>
      <path d="M60 81 L60 87 M60 87 Q54 93 48 89 M60 87 Q66 93 72 89" fill="none" stroke="#5c3a12" stroke-width="2" stroke-linecap="round"/>
      <!-- whiskers -->
      <path d="M45 82 q-10 -1 -16 -4 M45 86 q-10 2 -15 1 M75 82 q10 -1 16 -4 M75 86 q10 2 15 1"
        stroke="#e8dcc0" stroke-width="1.2" stroke-linecap="round" opacity="0.55"/>
      <!-- chin ruff -->
      <path d="M48 96 q12 8 24 0 l-4 9 q-8 5 -16 0 z" fill="#a97a28"/>
      <!-- resting paws under the mane, dignified -->
      <ellipse cx="42" cy="126" rx="14" ry="8" fill="#b8893a" stroke="#5c3a12" stroke-width="2"/>
      <ellipse cx="78" cy="126" rx="14" ry="8" fill="#b8893a" stroke="#5c3a12" stroke-width="2"/>
      <path d="M36 126 v5 M42 127 v5 M48 126 v5 M72 126 v5 M78 127 v5 M84 126 v5" stroke="#5c3a12" stroke-width="1.5"/>
      <!-- tail tip curled into view -->
      <path d="M96 122 q16 -2 14 -16" fill="none" stroke="#a97a28" stroke-width="4" stroke-linecap="round"/>
      <circle cx="110" cy="104" r="5" fill="#6b4514"/>
    </svg>`;
  },

  lines: {
    greetings: [
      'You may call me Gus. The Emperor calls me Gustus Ferox. The Emperor is not here.',
      'I have eaten precisely no one, whatever the register says. Standards.',
      'Felix built half these doors. I watched. Ask.',
      'You smell of ink and fear. The ink is more useful. Ask your question.',
      'I know every stone down here. Most of them are boring. Ask me about the other ones.',
    ],
    stuck: 'Still circling. I do this too, but I make it look intentional. Shall I spend your minutes?',
    noMore: 'That is the whole of what I know about this room. The rest wants hands. Mine are professionally unavailable.',
    tierNames: ['A twitch of the tail', 'The stalk', 'The pounce'],
    buyLabel: 'Growl it low',
    farewell: 'I will be here. Napping. Strategically.',
  },
};
