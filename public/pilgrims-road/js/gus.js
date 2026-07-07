// Gus's form for THE PILGRIM'S ROAD: Sir Gus, ghost of a Vayne Keep knight.
//
// Gus appears in EVERY escape room in this series; only his FORM changes with
// the theme (see shared/js/gus-core.js for the machinery). Re-theming him for
// a new game means writing a file like this one — name stays "Gus"; form,
// portrait, and voice lines change.

export const GUS = {
  name: 'Gus',
  epithet: 'Sir Gus, Knight of the Vayne — deceased, unbothered',
  form: 'ghost-knight',

  portrait(size = 'large') {
    const s = size === 'small';
    return `
    <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="gd_gus_helm${s ? '_s' : ''}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#c8d4e8"/>
          <stop offset="0.5" stop-color="#8fa0bd"/>
          <stop offset="1" stop-color="#5a6a88"/>
        </linearGradient>
        <linearGradient id="gd_gus_body${s ? '_s' : ''}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="rgba(174,191,221,0.75)"/>
          <stop offset="1" stop-color="rgba(174,191,221,0)"/>
        </linearGradient>
        <radialGradient id="gd_gus_glow${s ? '_s' : ''}" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0" stop-color="rgba(154,196,255,0.5)"/>
          <stop offset="1" stop-color="rgba(154,196,255,0)"/>
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="66" rx="56" ry="62" fill="url(#gd_gus_glow${s ? '_s' : ''})"/>
      <path d="M38 74 Q36 118 42 132 L50 122 L57 134 L64 122 L71 134 L78 122 L84 131 Q90 116 82 74 Z"
            fill="url(#gd_gus_body${s ? '_s' : ''})"/>
      <ellipse cx="36" cy="78" rx="12" ry="9" fill="#6d7d9c"/>
      <ellipse cx="84" cy="78" rx="12" ry="9" fill="#6d7d9c"/>
      <path d="M40 70 Q60 62 80 70 L82 96 Q60 106 38 96 Z" fill="#7f90b0" stroke="#4e5c78" stroke-width="1.5"/>
      <path d="M60 68 L60 100" stroke="#4e5c78" stroke-width="1.5"/>
      <path d="M40 30 Q40 12 60 12 Q80 12 80 30 L80 52 Q80 62 60 62 Q40 62 40 52 Z"
            fill="url(#gd_gus_helm${s ? '_s' : ''})" stroke="#43506b" stroke-width="2"/>
      <rect x="44" y="34" width="32" height="10" rx="5" fill="#1c2333"/>
      <circle cx="53" cy="39" r="3" fill="#9ac4ff"/>
      <circle cx="67" cy="39" r="3" fill="#9ac4ff"/>
      <circle cx="60" cy="52" r="1.6" fill="#43506b"/>
      <circle cx="54" cy="52" r="1.6" fill="#43506b"/>
      <circle cx="66" cy="52" r="1.6" fill="#43506b"/>
      <path d="M60 12 Q58 2 48 4 Q56 6 54 12 Q62 4 60 12" fill="#c9a227"/>
      <path d="M60 13 Q64 1 74 5 Q65 5 66 13 Z" fill="#e8c85a"/>
    </svg>`;
  },

  lines: {
    greetings: [
      'Hail, mapmaker. Still breathing? Splendid. Let us keep it that way.',
      'I have haunted this keep two hundred years. Ask me anything. Well — three things.',
      'Edmund was a friend. His road brought me peace; may it bring you a door.',
      'The living always stare at the wrong wall. Shall I point at the right one?',
      'I would open it for you myself, but my hands... you see the difficulty.',
    ],
    stuck: 'Stuck, are we? A whisper costs minutes — dawn listens when I speak. Choose wisely.',
    noMore: 'I have told you all I know of this chamber, friend. The rest is your fingers and your wits.',
    tierNames: ['A nudge', 'The method', 'The answer'],
    buyLabel: 'Whisper it',
    farewell: 'As you wish. I shall be by the wall. Being dead, I am very patient.',
  },
};
