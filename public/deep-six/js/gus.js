// Gus's form for DEEP SIX: a harbor seal — the one soul at home in both the
// deep and the deck. Same Gus, new whiskers. He slips down the dive line to the
// wreck and surfaces at the boat, carrying what neither of you can carry alone.

export const GUS = {
  name: 'Gus',
  epithet: 'Gus — harbor seal, at home in both the deep and the deck',
  form: 'seal',
  art: new URL('../art/gus.webp', import.meta.url).href,   // photoreal cut-out portrait

  portrait(size = 'large') {
    const s = size === 'small' ? '_s' : '';
    return `
    <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id="gd_guss_glow${s}" cx="0.5" cy="0.44" r="0.62">
          <stop offset="0" stop-color="rgba(120,214,214,0.4)"/>
          <stop offset="1" stop-color="rgba(120,214,214,0)"/>
        </radialGradient>
        <linearGradient id="gd_guss_body${s}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#8a97a6"/>
          <stop offset="0.55" stop-color="#5f6d7d"/>
          <stop offset="1" stop-color="#3a4654"/>
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="70" rx="54" ry="58" fill="url(#gd_guss_glow${s})"/>
      <!-- fore-flippers -->
      <path d="M44 104 q-16 8 -22 22 q14 -4 22 -10 z" fill="#4a5766"/>
      <path d="M76 104 q16 8 22 22 q-14 -4 -22 -10 z" fill="#4a5766"/>
      <!-- body -->
      <path d="M60 44 q26 4 26 40 q0 26 -26 32 q-26 -6 -26 -32 q0 -36 26 -40 z"
        fill="url(#gd_guss_body${s})" stroke="#2b3644" stroke-width="2"/>
      <!-- head -->
      <ellipse cx="60" cy="52" rx="26" ry="24" fill="url(#gd_guss_body${s})" stroke="#2b3644" stroke-width="2"/>
      <!-- muzzle -->
      <ellipse cx="60" cy="62" rx="15" ry="12" fill="#9aa7b4"/>
      <ellipse cx="60" cy="66" rx="6" ry="4.5" fill="#1c2530"/>
      <!-- big dark eyes -->
      <circle cx="50" cy="49" r="6.5" fill="#141b22"/>
      <circle cx="70" cy="49" r="6.5" fill="#141b22"/>
      <circle cx="52" cy="47" r="2" fill="#dff2f2" opacity="0.9"/>
      <circle cx="72" cy="47" r="2" fill="#dff2f2" opacity="0.9"/>
      <!-- whiskers -->
      <g stroke="#c7d2da" stroke-width="1" opacity="0.7" stroke-linecap="round">
        <line x1="48" y1="62" x2="28" y2="60"/><line x1="48" y1="65" x2="30" y2="68"/>
        <line x1="72" y1="62" x2="92" y2="60"/><line x1="72" y1="65" x2="90" y2="68"/>
      </g>
    </svg>`;
  },

  lines: {
    greetings: [
      "Wreck's cold and the line's long — but I swim it both ways. Whatever you need carried up or down, ask.",
      'One diver below, one hand above, one seal between. That is the whole crew. Speak.',
      'Your partner can read the half you cannot. I read the water in between. What has you stuck?',
      "I cannot turn a valve with a flipper, but I can carry a number across the line. Tell me what you need.",
      'The tide waits for no one and neither does your air. Ask, and let us not dawdle.',
    ],
    stuck: 'Still circling the same shadow. I can spend your minutes to pull you off it — shall I?',
    noMore: 'That is the whole of what this depth holds. The rest is between you and the other end of the line.',
    tierNames: ['A nudge from the line', 'The bearing', 'The whole course'],
    buyLabel: 'Send Gus across',
    farewell: 'I will be on the line, halfway between you both. Call when you need the crossing.',
  },
};
