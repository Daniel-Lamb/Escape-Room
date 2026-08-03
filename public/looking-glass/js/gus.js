// Gus's form for THE LOOKING GLASS: the black manor cat — the only creature who
// was never on just one side of the glass. He pads through mirrors as through
// open doors, and has decided both reflections are his responsibility.

export const GUS = {
  name: 'Gus',
  epithet: 'Gus — the manor cat, who crosses the glass as he pleases',
  form: 'cat',

  portrait(size = 'large') {
    const s = size === 'small' ? '_s' : '';
    return `
    <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id="gd_gusc_glow${s}" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stop-color="rgba(201,204,214,0.35)"/>
          <stop offset="1" stop-color="rgba(201,204,214,0)"/>
        </radialGradient>
        <linearGradient id="gd_gusc_body${s}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#2a2636"/>
          <stop offset="0.6" stop-color="#181524"/>
          <stop offset="1" stop-color="#0c0a14"/>
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="72" rx="52" ry="58" fill="url(#gd_gusc_glow${s})"/>
      <!-- the mirror seam he sits astride -->
      <line x1="60" y1="6" x2="60" y2="134" stroke="#9fa8bd" stroke-width="1.5" opacity="0.35" stroke-dasharray="3 5"/>
      <!-- tail curling across the seam -->
      <path d="M40 118 q-26 -6 -22 -34 q3 -18 20 -14 q-10 4 -11 15 q-1 16 15 22 z" fill="url(#gd_gusc_body${s})"/>
      <!-- body -->
      <path d="M60 58 q30 4 30 40 q0 26 -30 30 q-30 -4 -30 -30 q0 -36 30 -40 z" fill="url(#gd_gusc_body${s})" stroke="#0a0810" stroke-width="2"/>
      <!-- head -->
      <path d="M42 44 q0 -20 18 -22 q18 2 18 22 q0 20 -18 24 q-18 -4 -18 -24 z" fill="url(#gd_gusc_body${s})" stroke="#0a0810" stroke-width="2"/>
      <!-- ears -->
      <path d="M44 30 l-6 -20 16 10 z" fill="url(#gd_gusc_body${s})" stroke="#0a0810" stroke-width="1.5"/>
      <path d="M76 30 l6 -20 -16 10 z" fill="url(#gd_gusc_body${s})" stroke="#0a0810" stroke-width="1.5"/>
      <path d="M45 27 l-3 -11 8 6 z" fill="#5a4a52"/>
      <path d="M75 27 l3 -11 -8 6 z" fill="#5a4a52"/>
      <!-- eyes, green-gold -->
      <ellipse cx="52" cy="42" rx="6" ry="8" fill="#b7e04a"/>
      <ellipse cx="68" cy="42" rx="6" ry="8" fill="#b7e04a"/>
      <path d="M52 36 v12 M68 36 v12" stroke="#111" stroke-width="2.4"/>
      <circle cx="53.5" cy="39" r="1.4" fill="#fff" opacity="0.9"/>
      <circle cx="69.5" cy="39" r="1.4" fill="#fff" opacity="0.9"/>
      <!-- nose + muzzle -->
      <path d="M57 52 l6 0 -3 4 z" fill="#c98a9a"/>
      <path d="M60 56 v4 M60 58 q-5 3 -9 2 M60 58 q5 3 9 2" stroke="#0a0810" stroke-width="1.4" fill="none"/>
      <!-- whiskers, one catching a silver glint -->
      <g stroke="#c9ccd6" stroke-width="1" opacity="0.7">
        <line x1="50" y1="55" x2="28" y2="52"/><line x1="50" y1="58" x2="30" y2="60"/>
        <line x1="70" y1="55" x2="92" y2="52"/><line x1="70" y1="58" x2="90" y2="60"/>
      </g>
      <circle cx="28" cy="52" r="1.6" fill="#e8ebf2"/>
    </svg>`;
  },

  lines: {
    greetings: [
      'Mrrp. I am on both sides of the glass at once, which is the only sensible place to be. Ask.',
      'You are two halves of one reflection tonight. I am the seam between. What do you need carried across?',
      'I have watched this house from inside its mirrors for nine lives. Nothing here surprises me. Ask.',
      'Your partner sees what you cannot, and the reverse. I see the both of it. Speak.',
      'The glass thins at dawn. Best we not still be arguing then. How may I help?',
    ],
    stuck: 'Still batting at the same thread. Charming, but the mirror is not patient. Shall I spend your minutes?',
    noMore: 'That is everything this room whispers. The rest is between you and the other side of the glass.',
    tierNames: ['A slow blink', 'The scent of the path', 'The whole way through'],
    buyLabel: 'Coax the cat',
    farewell: 'I will be here, in the silver, where the warm spots are. Call when you need the crossing.',
  },
};
