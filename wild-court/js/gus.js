// Gus's form for THE WILD COURT: Gus the golden tamarin, advocate for the
// accused. Same Gus as ever — new fur, new title, same job. He was appointed
// to your case before you ever fell, and he takes it very seriously.

export const GUS = {
  name: 'Gus',
  epithet: 'Gus — golden tamarin, advocate for the accused',
  form: 'golden-tamarin',

  portrait(size = 'large') {
    const s = size === 'small' ? '_s' : '';
    return `
    <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id="gd_gusm_glow${s}" cx="0.5" cy="0.42" r="0.62">
          <stop offset="0" stop-color="rgba(255,224,138,0.4)"/>
          <stop offset="1" stop-color="rgba(255,224,138,0)"/>
        </radialGradient>
        <radialGradient id="gd_gusm_mane${s}" cx="0.5" cy="0.45" r="0.65">
          <stop offset="0" stop-color="#f5c65a"/>
          <stop offset="0.6" stop-color="#d1a53f"/>
          <stop offset="1" stop-color="#9a6f24"/>
        </radialGradient>
        <linearGradient id="gd_gusm_face${s}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#6b4f37"/>
          <stop offset="1" stop-color="#4a3626"/>
        </linearGradient>
        <radialGradient id="gd_gusm_eye${s}" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stop-color="#ffe9b0"/>
          <stop offset="0.45" stop-color="#d1a53f"/>
          <stop offset="1" stop-color="#5c4014"/>
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="64" rx="56" ry="60" fill="url(#gd_gusm_glow${s})"/>
      <!-- tail: a long confident question mark -->
      <path d="M78 118 q30 -2 32 -26 q2 -20 -14 -24 q-10 -2 -12 8 q-2 9 7 10"
        fill="none" stroke="#d1a53f" stroke-width="7" stroke-linecap="round"/>
      <path d="M78 118 q30 -2 32 -26 q2 -20 -14 -24"
        fill="none" stroke="#9a6f24" stroke-width="2.5" stroke-linecap="round" opacity="0.5"/>
      <!-- body, small and upright: counsel at the bar -->
      <ellipse cx="58" cy="106" rx="24" ry="22" fill="url(#gd_gusm_mane${s})"/>
      <!-- hands, clasped like a barrister about to speak -->
      <ellipse cx="52" cy="112" rx="6" ry="5" fill="#4a3626"/>
      <ellipse cx="64" cy="112" rx="6" ry="5" fill="#4a3626"/>
      <!-- the famous mane: layered golden petals -->
      <g fill="url(#gd_gusm_mane${s})">
        <ellipse cx="60" cy="52" rx="34" ry="32"/>
        <ellipse cx="32" cy="50" rx="12" ry="16" transform="rotate(-24 32 50)"/>
        <ellipse cx="88" cy="50" rx="12" ry="16" transform="rotate(24 88 50)"/>
        <ellipse cx="38" cy="30" rx="11" ry="14" transform="rotate(-38 38 30)"/>
        <ellipse cx="82" cy="30" rx="11" ry="14" transform="rotate(38 82 30)"/>
        <ellipse cx="60" cy="22" rx="12" ry="13"/>
      </g>
      <g fill="#9a6f24" opacity="0.35">
        <path d="M34 62 q6 -4 4 -12" stroke="#9a6f24" stroke-width="2" fill="none"/>
        <path d="M86 62 q-6 -4 -4 -12" stroke="#9a6f24" stroke-width="2" fill="none"/>
        <path d="M46 24 q4 6 12 6" stroke="#9a6f24" stroke-width="2" fill="none"/>
      </g>
      <!-- bare tamarin face inside the mane -->
      <ellipse cx="60" cy="54" rx="19" ry="21" fill="url(#gd_gusm_face${s})"/>
      <!-- brow tuft -->
      <path d="M48 40 q12 -8 24 0 q-12 -3 -24 0z" fill="#f5c65a"/>
      <!-- eyes: large, amber, entirely too knowing -->
      <circle cx="52" cy="52" r="6" fill="url(#gd_gusm_eye${s})"/>
      <circle cx="68" cy="52" r="6" fill="url(#gd_gusm_eye${s})"/>
      <circle cx="53.5" cy="50" r="1.8" fill="#fff6d8"/>
      <circle cx="69.5" cy="50" r="1.8" fill="#fff6d8"/>
      <circle cx="52" cy="53" r="2.6" fill="#1c1208"/>
      <circle cx="68" cy="53" r="2.6" fill="#1c1208"/>
      <!-- muzzle -->
      <ellipse cx="60" cy="64" rx="9" ry="7" fill="#7d5c40"/>
      <path d="M57 61 q3 2 6 0" stroke="#2c1e12" stroke-width="1.6" fill="none"/>
      <path d="M54 67 q6 5 12 0" stroke="#2c1e12" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <!-- the tiny woven collar he is unreasonably proud of -->
      <path d="M42 78 q18 10 36 0 l-1.5 6 q-16 8 -33 0 z" fill="#3f7a37"/>
      <g fill="#ffe08a">
        <circle cx="50" cy="81.5" r="1.6"/><circle cx="60" cy="83.5" r="1.6"/><circle cx="70" cy="81.5" r="1.6"/>
      </g>
    </svg>`;
  },

  lines: {
    greetings: [
      'Gus, golden tamarin, advocate for the accused. That is you. Do try to look innocent.',
      'I have represented ocelots, orchids, and one extremely guilty boa. You are my first surveyor.',
      'Three counsels per chamber — the Court bills in minutes, not bananas. I asked.',
      'I staked this collar on taking your case. The collar, Marlowe. Do you grasp the gravity.',
      'The Court is watching, so stand up straight and let your advocate do the chattering.',
    ],
    stuck: 'You have the look of a defendant in need of counsel. Counsel costs minutes off the docket. Shall I?',
    noMore: 'That is every counsel I may offer on this chamber — the rest, the Court insists, must be your own testimony.',
    tierNames: ['A nudge', 'The method', 'The answer'],
    buyLabel: 'Chitter it',
    farewell: 'I will be right here, grooming my mane and believing in you.',
  },
};
