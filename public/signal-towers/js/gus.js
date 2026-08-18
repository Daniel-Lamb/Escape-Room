// Gus's form for TWIN SIGNAL TOWERS: a storm petrel — the one soul who flies
// between the two lights. Same Gus, new wings. He is the diegetic reason two
// keepers on two headlands can coordinate at all.

export const GUS = {
  name: 'Gus',
  epithet: 'Gus — storm petrel, the only soul who flies between the two lights',
  form: 'petrel',
  art: new URL('../art/gus.webp', import.meta.url).href,   // photoreal cut-out portrait

  portrait(size = 'large') {
    const s = size === 'small' ? '_s' : '';
    return `
    <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id="gd_gusp_glow${s}" cx="0.5" cy="0.42" r="0.62">
          <stop offset="0" stop-color="rgba(255,214,140,0.42)"/>
          <stop offset="1" stop-color="rgba(255,214,140,0)"/>
        </radialGradient>
        <linearGradient id="gd_gusp_body${s}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#4a5769"/>
          <stop offset="0.55" stop-color="#2f3a49"/>
          <stop offset="1" stop-color="#1c2431"/>
        </linearGradient>
        <linearGradient id="gd_gusp_wing${s}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#3a4656"/>
          <stop offset="1" stop-color="#141c26"/>
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="66" rx="54" ry="58" fill="url(#gd_gusp_glow${s})"/>
      <!-- far wing, swept back -->
      <path d="M62 62 q34 -20 52 -6 q-20 10 -34 20 q-12 8 -22 4 z" fill="url(#gd_gusp_wing${s})" opacity="0.85"/>
      <!-- tail, forked -->
      <path d="M52 92 q-14 14 -26 20 q10 -2 18 -6 q-2 8 -8 16 q12 -8 20 -20 z" fill="url(#gd_gusp_body${s})"/>
      <!-- body -->
      <path d="M60 40 q22 6 22 34 q0 22 -22 30 q-22 -8 -22 -30 q0 -28 22 -34 z" fill="url(#gd_gusp_body${s})" stroke="#12181f" stroke-width="2"/>
      <!-- white rump band (the petrel's tell) -->
      <path d="M42 82 q18 8 36 0 q-4 8 -18 9 q-14 -1 -18 -9 z" fill="#e9eef4" opacity="0.9"/>
      <!-- near wing, raised -->
      <path d="M58 58 q-30 -26 -50 -18 q18 6 30 18 q-14 -2 -24 2 q20 6 34 12 q8 4 12 -2 z" fill="url(#gd_gusp_wing${s})"/>
      <!-- head -->
      <circle cx="62" cy="42" r="15" fill="url(#gd_gusp_body${s})" stroke="#12181f" stroke-width="2"/>
      <!-- eye, bright amber -->
      <circle cx="66" cy="40" r="4.6" fill="#ffcf6a"/>
      <circle cx="67.4" cy="38.6" r="1.6" fill="#fff6df"/>
      <!-- hooked beak -->
      <path d="M76 42 q10 1 13 5 q-5 2 -12 2 q-2 3 -6 2 q3 -6 5 -11 z" fill="#20262e"/>
      <circle cx="86" cy="46" r="1.2" fill="#0a0d11"/>
    </svg>`;
  },

  lines: {
    greetings: [
      "Wind's backing westerly and the Meridian's low in the water. I carry what you need across — ask.",
      'Two towers, one bird. I have flown this crossing longer than either of you has kept a light. Speak.',
      'Your partner sees the half you cannot. I see the flight between. What has you stuck?',
      "I cannot pull a lever with a wing, but I can carry a bearing. Tell me what you need to know.",
      'The lights have to agree tonight. They did not, once. Ask, and let us do better.',
    ],
    stuck: 'Still circling the same rock. I can spend your minutes to lift you off it — shall I?',
    noMore: 'That is the whole of what this room holds. The rest is between you and your partner now.',
    tierNames: ['A flutter of warning', 'The bearing', 'The whole course'],
    buyLabel: 'Whistle him over',
    farewell: 'I will be on the rail, out of the rain. Mostly. Call when you need the crossing.',
  },
};
