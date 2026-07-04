// Gus's form for STARFALL STATION: GS-1 "Gus", a floating maintenance drone.
// Same Gus as ever — new body, new voice, same job. And this time, a secret:
// he has known who you are since before you woke.

export const GUS = {
  name: 'Gus',
  epithet: 'GS-1 "Gus" — maintenance drone, self-appointed morale officer',
  form: 'hover-drone',

  portrait(size = 'large') {
    const s = size === 'small' ? '_s' : '';
    return `
    <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="gd_gusd_body${s}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#8fa3b8"/>
          <stop offset="0.5" stop-color="#5d7080"/>
          <stop offset="1" stop-color="#39485a"/>
        </linearGradient>
        <radialGradient id="gd_gusd_glow${s}" cx="0.5" cy="0.42" r="0.62">
          <stop offset="0" stop-color="rgba(79,216,208,0.4)"/>
          <stop offset="1" stop-color="rgba(79,216,208,0)"/>
        </radialGradient>
        <radialGradient id="gd_gusd_eye${s}" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stop-color="#d7fffc"/>
          <stop offset="0.45" stop-color="#4fd8d0"/>
          <stop offset="1" stop-color="#1b6f6a"/>
        </radialGradient>
        <radialGradient id="gd_gusd_thrust${s}" cx="0.5" cy="0" r="1">
          <stop offset="0" stop-color="rgba(143,240,234,0.8)"/>
          <stop offset="1" stop-color="rgba(143,240,234,0)"/>
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="64" rx="56" ry="60" fill="url(#gd_gusd_glow${s})"/>
      <!-- antenna -->
      <line x1="60" y1="22" x2="60" y2="8" stroke="#5d7080" stroke-width="3"/>
      <circle cx="60" cy="6" r="4" fill="#ffb45e"/>
      <!-- main chassis -->
      <ellipse cx="60" cy="58" rx="34" ry="30" fill="url(#gd_gusd_body${s})" stroke="#26313f" stroke-width="2.5"/>
      <path d="M28 56 a34 26 0 0 1 64 0" fill="rgba(255,255,255,0.08)"/>
      <!-- face plate + the one warm eye -->
      <ellipse cx="60" cy="58" rx="24" ry="20" fill="#141c26" stroke="#26313f" stroke-width="2"/>
      <circle cx="60" cy="57" r="11" fill="url(#gd_gusd_eye${s})"/>
      <circle cx="56" cy="53" r="3.2" fill="#eafffd" opacity="0.9"/>
      <!-- cheek lights -->
      <circle cx="38" cy="62" r="2.4" fill="#ffb45e" opacity="0.85"/>
      <circle cx="82" cy="62" r="2.4" fill="#ffb45e" opacity="0.85"/>
      <!-- side handler arms, folded politely -->
      <path d="M27 68 q-10 6 -7 16" fill="none" stroke="#5d7080" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M93 68 q10 6 7 16" fill="none" stroke="#5d7080" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="20" cy="86" r="4.5" fill="#39485a"/>
      <circle cx="100" cy="86" r="4.5" fill="#39485a"/>
      <!-- undercarriage + hover wash -->
      <path d="M42 84 q18 10 36 0 l-4 8 q-14 7 -28 0 z" fill="#39485a"/>
      <ellipse cx="60" cy="106" rx="20" ry="14" fill="url(#gd_gusd_thrust${s})"/>
      <ellipse cx="60" cy="124" rx="26" ry="5" fill="rgba(79,216,208,0.12)"/>
    </svg>`;
  },

  lines: {
    greetings: [
      'Unit GS-1, reporting. Morale status: mine is excellent, yours is my project.',
      'I have run this station for eleven months alone. The conversation has improved enormously today.',
      'Query me freely. My hint budget is three per deck; my patience is unlimited by design.',
      'The station is dying. I would rather you did not match it. How may I help?',
      'I would fix it myself, but my manipulators are rated for bolts, not destiny.',
    ],
    stuck: 'Processing... you appear stuck. I can spend your minutes to unstick you. Authorize?',
    noMore: 'That is everything my logs hold about this deck. The rest requires hands — yours are better than they know.',
    tierNames: ['A pointer', 'The method', 'The answer'],
    buyLabel: 'Transmit it',
    farewell: 'Standing by. Hovering, technically. Same thing.',
  },
};
