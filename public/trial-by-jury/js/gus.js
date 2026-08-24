// Gus's form for TRIAL BY JURY: a golden tamarin — the same advocate from The
// Wild Court, now grown into clerk of the court. He carries a word between
// witnesses where the rules forbid them to confer directly. Same Gus, a robe of
// office and a small brass bell.

export const GUS = {
  name: 'Gus',
  epithet: 'Gus — golden tamarin, now clerk of the Wild Court',
  form: 'tamarin',

  portrait(size = 'large') {
    const s = size === 'small' ? '_s' : '';
    return `
    <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id="gd_gust_glow${s}" cx="0.5" cy="0.42" r="0.62">
          <stop offset="0" stop-color="rgba(230,209,106,0.4)"/>
          <stop offset="1" stop-color="rgba(230,209,106,0)"/>
        </radialGradient>
        <linearGradient id="gd_gust_fur${s}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#f0c65a"/>
          <stop offset="0.6" stop-color="#d99a2f"/>
          <stop offset="1" stop-color="#a56a1c"/>
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="66" rx="52" ry="56" fill="url(#gd_gust_glow${s})"/>
      <!-- mane -->
      <circle cx="60" cy="52" r="34" fill="url(#gd_gust_fur${s})" opacity="0.55"/>
      <!-- body -->
      <path d="M60 46 q20 6 20 34 q0 24 -20 30 q-20 -6 -20 -30 q0 -28 20 -34 z" fill="url(#gd_gust_fur${s})" stroke="#7a4e14" stroke-width="2"/>
      <!-- little clerk's robe -->
      <path d="M42 80 q18 10 36 0 l4 26 q-22 12 -44 0 z" fill="#2c3826" stroke="#1a2416" stroke-width="1.5"/>
      <!-- face -->
      <circle cx="60" cy="46" r="18" fill="#3a2a16"/>
      <ellipse cx="60" cy="48" rx="12" ry="13" fill="#e9d9b8"/>
      <!-- eyes -->
      <circle cx="54" cy="46" r="3" fill="#20140a"/>
      <circle cx="66" cy="46" r="3" fill="#20140a"/>
      <circle cx="54.8" cy="45" r="1" fill="#fff"/>
      <circle cx="66.8" cy="45" r="1" fill="#fff"/>
      <!-- nose/mouth -->
      <path d="M60 52 q-3 4 0 6 q3 -2 0 -6z" fill="#5a3a1c"/>
      <!-- brass bell in paw -->
      <path d="M40 96 q-6 0 -6 6 q0 5 6 5 q6 0 6 -5 q0 -6 -6 -6z" fill="#c9a227" stroke="#7a5f18" stroke-width="1.2"/>
      <circle cx="40" cy="109" r="1.6" fill="#7a5f18"/>
    </svg>`;
  },

  lines: {
    greetings: [
      'The rules forbid you witnesses to confer — so the court appoints me to carry a word between you. What does your account lack?',
      'I advocated once in these trees; now I keep the record. Tell me where your story has a hole and I will find who saw it.',
      'A witness sees only their own night. The bench sees all four at once — as, in a way, do I. Ask.',
      'One of the four of you is lying. I may not say which, but I can carry the truths that box the liar in. Speak.',
      'Ring the bell and I attend. What figure has slipped your account?',
    ],
    stuck: 'The court will wait a moment while I fetch you the thread you have dropped — shall I?',
    noMore: 'That is all this part of the trial holds. The rest is testimony — talk it through with your fellow witnesses.',
    tierNames: ['A rap of the bell', 'The point of order', 'The plain finding'],
    buyLabel: 'Ring for the clerk',
    farewell: 'I return to the record. Ring when the trial turns on you again.',
  },
};
