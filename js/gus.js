// Gus — the companion who helps you when you're stuck.
//
// Gus appears in EVERY escape room in this series; only his FORM changes with
// the theme. Here he is Sir Gus, the ghost of a Vayne Keep knight. For an
// animal-kingdom room he might be Gus the monkey; for a space station, Gus the
// maintenance droid. The engine consumes only the GUS interface below —
// re-theming means editing this one file (name stays "Gus"; form, portrait,
// and voice lines change).
//
// Hint ladder (per room): tier 1 nudge (−1:00) → tier 2 method (−2:00) →
// tier 3 exact answer (−4:00). Paid tiers stay re-readable for free.

export const GUS = {
  name: 'Gus',
  epithet: 'Sir Gus, Knight of the Vayne — deceased, unbothered',
  form: 'ghost-knight',

  // Larger portrait used in his dialog; small variant used for the dock button.
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
      <!-- spectral body, fading to nothing -->
      <path d="M38 74 Q36 118 42 132 L50 122 L57 134 L64 122 L71 134 L78 122 L84 131 Q90 116 82 74 Z"
            fill="url(#gd_gus_body${s ? '_s' : ''})"/>
      <!-- pauldrons -->
      <ellipse cx="36" cy="78" rx="12" ry="9" fill="#6d7d9c"/>
      <ellipse cx="84" cy="78" rx="12" ry="9" fill="#6d7d9c"/>
      <!-- breastplate -->
      <path d="M40 70 Q60 62 80 70 L82 96 Q60 106 38 96 Z" fill="#7f90b0" stroke="#4e5c78" stroke-width="1.5"/>
      <path d="M60 68 L60 100" stroke="#4e5c78" stroke-width="1.5"/>
      <!-- helmet -->
      <path d="M40 30 Q40 12 60 12 Q80 12 80 30 L80 52 Q80 62 60 62 Q40 62 40 52 Z"
            fill="url(#gd_gus_helm${s ? '_s' : ''})" stroke="#43506b" stroke-width="2"/>
      <!-- visor slit: friendly glowing eyes -->
      <rect x="44" y="34" width="32" height="10" rx="5" fill="#1c2333"/>
      <circle cx="53" cy="39" r="3" fill="#9ac4ff"/>
      <circle cx="67" cy="39" r="3" fill="#9ac4ff"/>
      <!-- visor rivets & breath hole -->
      <circle cx="60" cy="52" r="1.6" fill="#43506b"/>
      <circle cx="54" cy="52" r="1.6" fill="#43506b"/>
      <circle cx="66" cy="52" r="1.6" fill="#43506b"/>
      <!-- plume -->
      <path d="M60 12 Q58 2 48 4 Q56 6 54 12 Q62 4 60 12" fill="#c9a227"/>
      <path d="M60 13 Q64 1 74 5 Q65 5 66 13 Z" fill="#e8c85a"/>
    </svg>`;
  },

  lines: {
    // shown when his dialog opens, rotating
    greetings: [
      'Hail, mapmaker. Still breathing? Splendid. Let us keep it that way.',
      'I have haunted this keep two hundred years. Ask me anything. Well — three things.',
      'Edmund was a friend. His road brought me peace; may it bring you a door.',
      'The living always stare at the wrong wall. Shall I point at the right one?',
      'I would open it for you myself, but my hands... you see the difficulty.',
    ],
    // before any hint is taken in a room
    stuck: 'Stuck, are we? A whisper costs minutes — dawn listens when I speak. Choose wisely.',
    // when all tiers for a room are spent
    noMore: 'I have told you all I know of this chamber, friend. The rest is your fingers and your wits.',
    // label shown on the paid-tier ladder
    tierNames: ['A nudge', 'The method', 'The answer'],
    // when the player declines
    farewell: 'As you wish. I shall be by the wall. Being dead, I am very patient.',
  },
};

/* ============================================================
   Engine-facing wiring (theme-agnostic below this line)
   ============================================================ */

const TIER_COSTS = [60, 120, 240];   // seconds: −1:00, −2:00, −4:00

let deps = null;   // { getRoom, getState, dialog, penalize, save, playSfx, toast }
let greetIdx = 0;

export function initGus(dependencies) {
  deps = dependencies;
  const dock = document.getElementById('gus-dock');
  dock.innerHTML = GUS.portrait('small');
  dock.addEventListener('click', () => {
    deps.playSfx('hint');
    openGusDialog();
  });
}

function resolveHints(room, state) {
  const h = typeof room.hints === 'function' ? room.hints(state) : room.hints;
  return h || [];
}

export function openGusDialog() {
  const room = deps.getRoom();
  const state = deps.getState();
  const hints = resolveHints(room, state);
  // context key lets a room present multiple hint ladders (e.g. R7 door vs winch)
  const ctx = typeof room.hintContext === 'function' ? room.hintContext(state) : 'main';
  const usedKey = `${room.id}:${ctx}`;
  const used = state.hintsUsed[usedKey] || 0;

  const greeting = used === 0
    ? GUS.lines.greetings[greetIdx++ % GUS.lines.greetings.length]
    : (used >= hints.length ? GUS.lines.noMore : GUS.lines.stuck);

  const tiersHtml = hints.map((h, i) => {
    if (i < used) {
      return `<div class="gus-tier unlocked">
        <div class="gus-tier-name">${GUS.lines.tierNames[i] || `Hint ${i + 1}`} <span class="gus-tier-paid">paid</span></div>
        <div class="gus-tier-text">${escapeHtml(h.text)}</div>
      </div>`;
    }
    if (i === used) {
      const cost = h.cost ?? TIER_COSTS[Math.min(i, TIER_COSTS.length - 1)];
      return `<div class="gus-tier next">
        <div class="gus-tier-name">${GUS.lines.tierNames[i] || `Hint ${i + 1}`}</div>
        <button class="btn gus-tier-buy" data-tier="${i}" data-cost="${cost}">
          Whisper it <span class="gus-cost">&minus;${Math.round(cost / 60)}:00</span>
        </button>
      </div>`;
    }
    return `<div class="gus-tier locked">
      <div class="gus-tier-name">${GUS.lines.tierNames[i] || `Hint ${i + 1}`} <span class="gus-tier-lock">&#128274;</span></div>
    </div>`;
  }).join('');

  const modal = deps.dialog({
    title: GUS.epithet,
    wide: false,
    html: `
      <div class="gus-dialog">
        <div class="gus-portrait">${GUS.portrait('large')}</div>
        <div class="gus-right">
          <p class="gus-speech">&ldquo;${escapeHtml(greeting)}&rdquo;</p>
          <div class="gus-tiers">${tiersHtml}</div>
        </div>
      </div>`,
  });

  const buyBtn = modal.card.querySelector('.gus-tier-buy');
  if (buyBtn) {
    buyBtn.addEventListener('click', () => {
      const tier = Number(buyBtn.dataset.tier);
      const cost = Number(buyBtn.dataset.cost);
      state.hintsUsed[usedKey] = tier + 1;
      state.totalHints += 1;
      deps.penalize(cost);
      deps.save();
      deps.playSfx('hint');
      modal.close();
      openGusDialog();   // reopen showing the freshly unlocked tier
    });
  }
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
