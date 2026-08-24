// Gus's form for THE VAULT: a ferret — the crew's quartermaster, who slips
// through ducts and wall-voids carrying tips, tools, and the odd brass chip
// between stations. Same Gus, new whiskers.

export const GUS = {
  name: 'Gus',
  epithet: 'Gus — the crew\'s ferret, quartermaster of the ducts',
  form: 'ferret',

  portrait(size = 'large') {
    const s = size === 'small' ? '_s' : '';
    return `
    <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id="gd_gusf_glow${s}" cx="0.5" cy="0.42" r="0.62">
          <stop offset="0" stop-color="rgba(120,240,190,0.34)"/>
          <stop offset="1" stop-color="rgba(120,240,190,0)"/>
        </radialGradient>
        <linearGradient id="gd_gusf_body${s}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#e6ddc9"/>
          <stop offset="0.6" stop-color="#c8bda2"/>
          <stop offset="1" stop-color="#8f8264"/>
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="66" rx="52" ry="56" fill="url(#gd_gusf_glow${s})"/>
      <!-- long sinuous body -->
      <path d="M60 44 q26 6 26 34 q0 26 -12 40 q-6 8 -14 8 q-10 0 -16 -10 q-8 -14 -8 -34 q0 -32 24 -38 z"
        fill="url(#gd_gusf_body${s})" stroke="#5f5540" stroke-width="2"/>
      <!-- bandit mask -->
      <path d="M46 40 q14 -8 28 0 q-2 8 -14 8 q-12 0 -14 -8 z" fill="#4a4030" opacity="0.85"/>
      <!-- head -->
      <ellipse cx="60" cy="36" rx="18" ry="15" fill="url(#gd_gusf_body${s})" stroke="#5f5540" stroke-width="2"/>
      <!-- ears -->
      <circle cx="47" cy="26" r="6" fill="#c8bda2" stroke="#5f5540" stroke-width="1.5"/>
      <circle cx="73" cy="26" r="6" fill="#c8bda2" stroke="#5f5540" stroke-width="1.5"/>
      <!-- eyes, dark and quick -->
      <circle cx="53" cy="35" r="3.4" fill="#20180c"/>
      <circle cx="67" cy="35" r="3.4" fill="#20180c"/>
      <circle cx="54" cy="34" r="1.1" fill="#fff6df"/>
      <circle cx="68" cy="34" r="1.1" fill="#fff6df"/>
      <!-- pink nose -->
      <path d="M60 41 l-4 -3 h8 z" fill="#7a4a4a"/>
      <!-- a brass chip clutched in the paw -->
      <circle cx="44" cy="92" r="8" fill="#241c08" stroke="#c9a227" stroke-width="2"/>
      <text x="44" y="96" text-anchor="middle" font-size="8" fill="#e8c85a" font-family="Consolas, monospace" font-weight="bold">#</text>
    </svg>`;
  },

  lines: {
    greetings: [
      'Ducts are clear, cameras are looping. What do you need carried, and to whom?',
      'Four hands tonight, and me between them. Tell me where you\'re stuck and I\'ll run word.',
      'Your code is somewhere on this job — just not in front of you. Say what you\'re on and I\'ll point you at whose screen holds it.',
      'I have squeezed through smaller gaps than this plan. Ask, and I\'ll fetch what a crewmate can\'t reach.',
      'One clock, one wheel, six chips. Lose the thread and I\'ll spend a minute to find it again — worth it?',
    ],
    stuck: 'Still nosing the same corner. I can burn a little time to shake it loose — shall I?',
    noMore: 'That is everything this room holds. The rest is between you and the crew now — talk.',
    tierNames: ['A chitter', 'The tip-off', 'The whole score'],
    buyLabel: 'Send the ferret',
    farewell: 'Back to the wall-void, then. Whistle low when you need the crossing.',
  },
};
