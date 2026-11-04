// Gus's form for THE TOMB OF THE SCARAB: the heart-scarab, a golden beetle
// spirit set over the pharaoh's heart to guide the dead through the dark.
//
// Same Gus, new skin (see shared/js/gus-core.js). Name stays "Gus"; form,
// portrait, and voice lines change.

export const GUS = {
  name: 'Gus',
  epithet: 'Gus, the heart-scarab — set to guide the dead, oddly fond of the living',
  form: 'heart-scarab',

  portrait(size = 'large') {
    const s = size === 'small';
    const id = s ? '_s' : '';
    return `
    <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id="sc_glow${id}" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stop-color="rgba(232,200,90,0.55)"/>
          <stop offset="1" stop-color="rgba(232,200,90,0)"/>
        </radialGradient>
        <linearGradient id="sc_shell${id}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#f2d774"/>
          <stop offset="0.5" stop-color="#d4a72a"/>
          <stop offset="1" stop-color="#8a6a15"/>
        </linearGradient>
        <linearGradient id="sc_head${id}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#e8c85a"/>
          <stop offset="1" stop-color="#a07d1c"/>
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="70" rx="54" ry="60" fill="url(#sc_glow${id})"/>
      <!-- legs -->
      <g stroke="#7a5c12" stroke-width="4" stroke-linecap="round" fill="none">
        <path d="M40 66 L16 52 M40 84 L14 84 M42 100 L20 116"/>
        <path d="M80 66 L104 52 M80 84 L106 84 M78 100 L100 116"/>
      </g>
      <!-- carapace -->
      <ellipse cx="60" cy="86" rx="30" ry="38" fill="url(#sc_shell${id})" stroke="#6b520f" stroke-width="2"/>
      <line x1="60" y1="52" x2="60" y2="120" stroke="#6b520f" stroke-width="2.5"/>
      <path d="M40 66 Q60 60 80 66" fill="none" stroke="#6b520f" stroke-width="2"/>
      <path d="M38 92 Q60 88 82 92" fill="none" stroke="#6b520f" stroke-width="1.5" opacity="0.7"/>
      <!-- pronotum / head with the sun disc it rolls -->
      <path d="M44 52 Q60 40 76 52 Q60 60 44 52 Z" fill="url(#sc_head${id})" stroke="#6b520f" stroke-width="2"/>
      <circle cx="60" cy="40" r="10" fill="#e8c85a" stroke="#a07d1c" stroke-width="2"/>
      <circle cx="60" cy="40" r="10" fill="url(#sc_glow${id})"/>
      <!-- eyes -->
      <circle cx="50" cy="54" r="2.4" fill="#2b1c05"/>
      <circle cx="70" cy="54" r="2.4" fill="#2b1c05"/>
    </svg>`;
  },

  lines: {
    greetings: [
      'Awake, then, and breathing — how novel. Most who lie here have given that up.',
      'I am the beetle set over the pharaoh\'s heart. You are not the pharaoh. Curious.',
      'Three whispers I may give, no more — the tomb counts them against your air.',
      'The dead came forth by day. So may you, if you read the walls and not your fear.',
      'I have rolled the sun across a thousand nights. One tomb is a small thing to me.',
    ],
    stuck: 'Stuck in the dark? A whisper costs you breath — the tomb is patient, and the air is not. Choose.',
    noMore: 'That is all the wall will tell you here, little one. The rest is your eyes and your steady hands.',
    tierNames: ['A nudge', 'The method', 'The answer'],
    buyLabel: 'Whisper it',
    farewell: 'As you like. I shall be here, on the heart, where I have always been.',
  },
};
