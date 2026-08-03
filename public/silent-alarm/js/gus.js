// Gus's form for SILENT ALARM: a museum rat — the one soul who has run these
// walls for years, who moves between the front-of-house The Hand walks and the
// service guts The Eye reads on the schematic. Same Gus, new whiskers. He is the
// reason the crew has any blueprints at all: he mapped the place.

export const GUS = {
  name: 'Gus',
  epithet: "Gus — museum rat, the one who's cased every duct in the building",
  form: 'rat',

  portrait(size = 'large') {
    const s = size === 'small' ? '_s' : '';
    return `
    <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id="gd_gusr_glow${s}" cx="0.5" cy="0.45" r="0.62">
          <stop offset="0" stop-color="rgba(124,255,178,0.34)"/>
          <stop offset="1" stop-color="rgba(124,255,178,0)"/>
        </radialGradient>
        <linearGradient id="gd_gusr_body${s}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#39424e"/>
          <stop offset="0.55" stop-color="#2b333d"/>
          <stop offset="1" stop-color="#141a20"/>
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="70" rx="54" ry="56" fill="url(#gd_gusr_glow${s})"/>
      <!-- long curled tail -->
      <path d="M30 96 q-20 8 -22 -8 q-2 -14 14 -14 q10 0 12 8" fill="none"
        stroke="#c98a94" stroke-width="4.5" stroke-linecap="round" opacity="0.9"/>
      <!-- haunch + body -->
      <path d="M44 62 q-18 6 -18 26 q0 22 26 26 q30 4 44 -14 q10 -14 -2 -30
        q-14 -18 -50 -8 z" fill="url(#gd_gusr_body${s})" stroke="#0e1319" stroke-width="2"/>
      <!-- pale belly -->
      <path d="M40 92 q18 14 44 8 q-6 12 -26 12 q-18 0 -22 -14 z" fill="#9aa6ae" opacity="0.55"/>
      <!-- head, pointed snout to the right -->
      <path d="M78 60 q26 2 34 18 q4 8 -2 14 q-10 8 -24 4 q-16 -4 -18 -20 q-1 -14 10 -16 z"
        fill="url(#gd_gusr_body${s})" stroke="#0e1319" stroke-width="2"/>
      <!-- big round ear -->
      <circle cx="74" cy="50" r="15" fill="#2b333d" stroke="#0e1319" stroke-width="2"/>
      <circle cx="74" cy="50" r="8" fill="#b57f88" opacity="0.7"/>
      <!-- eye, bright cyan-white -->
      <circle cx="98" cy="72" r="4.6" fill="#dffbef"/>
      <circle cx="99.4" cy="70.6" r="1.7" fill="#7cffb2"/>
      <!-- pink nose -->
      <circle cx="115" cy="86" r="3.4" fill="#e0949e"/>
      <!-- whiskers -->
      <g stroke="#c7cdd3" stroke-width="1.1" opacity="0.75" stroke-linecap="round">
        <line x1="112" y1="86" x2="132" y2="78"/>
        <line x1="112" y1="88" x2="133" y2="90"/>
        <line x1="112" y1="90" x2="131" y2="102"/>
      </g>
    </svg>`;
  },

  lines: {
    greetings: [
      "I've run these walls for years. Whatever's got you stuck, I've chewed past it before — ask.",
      'Two of you, one me. You see the front, they see the back; I see the ducts between. Talk to each other.',
      "Your partner can see the half you can't. I can see the wiring under both. What has you stuck?",
      "I can't turn a dial with a paw, but I can tell you where the wire runs. What do you need?",
      "The men who hired you lie. You two don't have to. Ask, and let's get you paid and gone.",
    ],
    stuck: 'Still gnawing the same corner. I can spend your minutes to get you off it — want me to?',
    noMore: "That's the whole of what this room holds. The rest is between you and your partner now.",
    tierNames: ['A twitch of the whiskers', 'The wire to pull', 'The whole score'],
    buyLabel: 'Send Gus in',
    farewell: "I'll be in the vent, out of the light. Call when you need the ducts read.",
  },
};
