// Shared SVG fragments + puzzle helpers for DEEP SIX. Two visual worlds keyed to
// the role: The Diver sees the photoreal flooded wreck (video backdrop); The
// Tender sees the boat cabin — sonar scope, instrument panel, and a porthole with
// the dive line dropping away. Every id/keyframe is prefixed by a per-scene slug.

import { isDiver, roleName } from './role.js';

// Photoreal diver backdrops live in <game>/art/<slug>.{webp,mp4}; resolve against
// this module's URL so they work on Pages/Vercel/localhost alike.
export const ART = new URL('../art/', import.meta.url).href;

/** Common gradient + keyframe defs. Call once inside <defs>. */
export function defs(slug) {
  return `
    <linearGradient id="${slug}_water" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0a2230"/><stop offset="0.6" stop-color="#07161f"/><stop offset="1" stop-color="#040c12"/>
    </linearGradient>
    <linearGradient id="${slug}_deck" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0c1a22"/><stop offset="1" stop-color="#050d12"/>
    </linearGradient>
    <radialGradient id="${slug}_lamp" cx="0.5" cy="0.4" r="0.55">
      <stop offset="0" stop-color="rgba(255,224,150,0.5)"/>
      <stop offset="0.5" stop-color="rgba(255,210,120,0.16)"/>
      <stop offset="1" stop-color="rgba(255,210,120,0)"/>
    </radialGradient>
    <radialGradient id="${slug}_sonar" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="rgba(120,240,190,0.30)"/>
      <stop offset="1" stop-color="rgba(120,240,190,0)"/>
    </radialGradient>
    <style>
      @keyframes ${slug}_rise { 0% { transform: translateY(30px); opacity: 0; } 12% { opacity: 0.55; } 100% { transform: translateY(-620px); opacity: 0; } }
      .${slug}_bub { animation: ${slug}_rise 7s linear infinite; }
      @keyframes ${slug}_sweep { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      .${slug}_sw { transform-origin: 360px 380px; animation: ${slug}_sweep 4s linear infinite; }
    </style>`;
}

/** Role-appropriate full-frame backdrop. */
export function backdrop(slug) {
  return isDiver() ? diverBackdrop(slug) : tenderBackdrop(slug);
}

function diverBackdrop(slug) {
  return `<foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="${ART}${slug}.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="${ART}${slug}.mp4" type="video/mp4"/></video></foreignObject>`;
}

/** The Tender's boat-cabin instrument backdrop (procedural, shared by all scenes). */
function tenderBackdrop(slug) {
  return `
    <rect x="0" y="0" width="1600" height="900" fill="url(#${slug}_deck)"/>
    <g stroke="#0a1620" stroke-width="6" opacity="0.6">
      <line x1="0" y1="150" x2="1600" y2="150"/><line x1="0" y1="660" x2="1600" y2="660"/>
      <line x1="540" y1="0" x2="540" y2="660"/><line x1="1080" y1="0" x2="1080" y2="660"/>
    </g>
    <!-- porthole to the night sea; the dive line drops away -->
    <g>
      <circle cx="1330" cy="300" r="150" fill="#03121a" stroke="#20323f" stroke-width="12"/>
      <circle cx="1330" cy="300" r="150" fill="none" stroke="rgba(120,240,190,0.15)" stroke-width="3"/>
      <line x1="1330" y1="170" x2="1330" y2="450" stroke="#3a4a52" stroke-width="4" stroke-dasharray="2 11" opacity="0.7"/>
      ${[210, 258, 312, 372].map((y, i) => `<circle cx="${1322 + (i % 2) * 14}" cy="${y}" r="2.6" fill="#7cf0be" class="${slug}_bub" style="animation-delay:-${i}s"/>`).join('')}
    </g>
    <!-- the sonar scope -->
    <g>
      <circle cx="360" cy="380" r="150" fill="#031712" stroke="#123a2c" stroke-width="10"/>
      <circle cx="360" cy="380" r="150" fill="url(#${slug}_sonar)"/>
      <g stroke="#1c5a44" stroke-width="1.5" opacity="0.55" fill="none">
        <circle cx="360" cy="380" r="52"/><circle cx="360" cy="380" r="102"/>
        <line x1="210" y1="380" x2="510" y2="380"/><line x1="360" y1="230" x2="360" y2="530"/>
      </g>
      <line x1="360" y1="380" x2="360" y2="238" stroke="#7cf0be" stroke-width="2.5" opacity="0.5" class="${slug}_sw"/>
    </g>
    <!-- console shelf -->
    <rect x="0" y="704" width="1600" height="196" fill="#060f14"/>
    <rect x="0" y="704" width="1600" height="12" fill="#12303a"/>`;
}

/** Ambient overlay: rising bubbles for the diver; the cabin stays still. */
export function ambient(slug) {
  if (!isDiver()) return '';
  let b = '';
  for (let i = 0; i < 16; i++) {
    const x = (i * 101 + 40) % 1600;
    b += `<circle cx="${x}" cy="${800 + (i % 4) * 22}" r="${2 + (i % 3)}" fill="#bfe9ff" opacity="0.4" class="${slug}_bub" style="animation-delay:-${(i * 0.45).toFixed(1)}s"/>`;
  }
  return `<g aria-hidden="true">${b}</g>`;
}

/** Role-identity tag, top-centre (clear of the top-left Gus reserve). */
export function roleTag() {
  const col = isDiver() ? '#ffe6a6' : '#7cf0be';
  const sub = isDiver() ? 'THE WRECK OF THE CORMORANT' : 'TOPSIDE · THE HALCYON';
  return `
    <g font-family="Consolas, monospace" text-anchor="middle" paint-order="stroke" stroke="#02080c" stroke-linejoin="round">
      <text x="800" y="46" font-size="24" fill="${col}" letter-spacing="6" stroke-width="5">${roleName().toUpperCase()}</text>
      <text x="800" y="70" font-size="15" fill="#8fbfc4" letter-spacing="3" opacity="0.9" stroke-width="4">${sub}</text>
    </g>`;
}

/** The cross-screen relay plaque: the reading THIS screen holds for the partner. */
export function relayPlaque(code, label) {
  return `<g>
    <rect x="556" y="138" width="488" height="184" rx="10" fill="rgba(5,18,24,0.86)" stroke="#c9a227" stroke-width="3"/>
    <text x="800" y="180" text-anchor="middle" font-size="16" fill="#9fc7dd"
      font-family="Consolas, monospace" letter-spacing="2">${label}</text>
    <text x="800" y="252" text-anchor="middle" font-size="46" fill="#e8c85a"
      font-family="Consolas, monospace" letter-spacing="8">${code}</text>
    <text x="800" y="298" text-anchor="middle" font-size="13" fill="#7f8a99"
      font-family="Consolas, monospace">read this to your partner</text>
  </g>`;
}

/** A beckoning brass depth-mark waiting to be recovered — photoreal tag with the
 *  fathom depth + letter stamped on (values kept as SVG, never baked into the art). */
export function markBeckon(x, y, depth, letter) {
  return depthTag(x, y, depth, letter, true);
}

/** The shared brass depth-tag renderer (used in-scene and on the finale row). */
export function depthTag(x, y, depth, letter, beckon) {
  return `<g class="${beckon ? 'beckon' : ''}">
    <image href="${ART}mark-tag.webp" x="${x + 7}" y="${y}" width="78" height="120" preserveAspectRatio="xMidYMid meet"/>
    <text x="${x + 46}" y="${y + 60}" text-anchor="middle" font-size="23" fill="#241c08"
      font-family="Consolas, monospace" font-weight="bold" paint-order="stroke" stroke="#d8c98a" stroke-width="0.8">${depth}</text>
    <text x="${x + 46}" y="${y + 73}" text-anchor="middle" font-size="8" fill="#3a2f12"
      font-family="Consolas, monospace" letter-spacing="1">FATHOMS</text>
    <text x="${x + 46}" y="${y + 101}" text-anchor="middle" font-size="22" fill="#241c08"
      font-family="Georgia, serif" paint-order="stroke" stroke="#d8c98a" stroke-width="0.8">${letter}</text>
  </g>`;
}

/** A framed lock panel; shows the RELEASED state when open, else the given contents. */
export function lockPanel(x, y, open, label, contents) {
  return `<g>
    <rect x="${x}" y="${y}" width="360" height="196" rx="12"
      fill="${open ? 'rgba(4,12,16,0.55)' : 'rgba(9,26,32,0.9)'}" stroke="#2b3547" stroke-width="5"/>
    ${open
      ? `<text x="${x + 180}" y="${y + 108}" text-anchor="middle" font-size="20" fill="#7cf0be"
           font-family="Consolas, monospace" class="flicker">${label} — RELEASED</text>`
      : contents}
  </g>`;
}

/**
 * A non-gating "examine" hotspot that journals a bit of the Cormorant's story.
 * opts: { id, x, y, w, h, label, title, html }. Optional `once` flag suppressed
 * once journaled is handled by the room (this just adds + shows).
 */
export function loreSpot(opts) {
  return {
    id: opts.id, x: opts.x, y: opts.y, w: opts.w, h: opts.h, label: opts.label,
    onInteract(game) {
      game.journal.add(opts.id, { title: opts.title, category: 'note', html: opts.html });
      game.dialog({ title: opts.title, html: opts.html });
    },
  };
}

/**
 * A K-slot combination lock (digits 0-9 or letters A-Z), the workhorse of this
 * game: your slot values must match the code your PARTNER reads off their screen.
 * opts: { id, title, desc, slots:[{type:'digit'|'letter', label?}], target:string,
 *         goLabel?, solvedMsg, failMsg?, onSolve?(game) }
 */
export function comboLock(game, opts) {
  const slots = opts.slots;
  const vals = slots.map(() => 0);
  const modOf = (s) => (s.type === 'letter' ? 26 : 10);
  const glyph = (s, v) => (s.type === 'letter' ? String.fromCharCode(65 + (v % 26)) : String(v % 10));
  const current = () => slots.map((s, i) => glyph(s, vals[i])).join('');

  game.openPuzzle({
    id: opts.id,
    title: opts.title,
    render(body, api) {
      body.innerHTML = `
        <p class="puzzle-desc">${opts.desc}</p>
        <div class="puzzle-row" id="cl-dials"></div>
        <div class="puzzle-row"><button class="btn btn-primary" id="cl-go">${opts.goLabel || 'Set It'}</button></div>
        <div class="puzzle-feedback"></div>`;
      const row = body.querySelector('#cl-dials');
      slots.forEach((s, i) => {
        const dial = document.createElement('div');
        dial.className = 'dial';
        dial.innerHTML = `
          <button class="dial-btn" data-d="1" aria-label="up">&#9650;</button>
          <div class="dial-face">${glyph(s, vals[i])}</div>
          <button class="dial-btn" data-d="-1" aria-label="down">&#9660;</button>
          ${s.label ? `<div class="lever-label">${s.label}</div>` : ''}`;
        const face = dial.querySelector('.dial-face');
        dial.querySelectorAll('.dial-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            vals[i] = (vals[i] + Number(btn.dataset.d) + modOf(s)) % modOf(s);
            face.textContent = glyph(s, vals[i]);
            face.classList.remove('tick'); void face.offsetWidth; face.classList.add('tick');
            game.playSfx('click');
          });
        });
        row.appendChild(dial);
      });
      body.querySelector('#cl-go').addEventListener('click', () => {
        if (current() === opts.target) {
          game.playSfx('unlock');
          api.solved({ message: opts.solvedMsg });
          if (opts.onSolve) opts.onSolve(game);
        } else {
          api.fail(opts.failMsg || 'That is not it — check the reading with your partner.');
        }
      });
    },
  });
}
