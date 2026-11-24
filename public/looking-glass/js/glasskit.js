// Shared SVG fragments for The Looking Glass. The Waking Side (p1) renders warm
// and candle-lit; the Glass Side (p2) renders cool, silvered, and desaturated —
// the same manor seen from inside the mirror. Every id/keyframe is slug-prefixed.

import { sideName, isWaking } from './role.js';
import { kitDefs } from '../../shared/js/scenekit.js';

// Photoreal animated backdrops live in <game>/art/<slug>.{webp,mp4}; resolve
// against this module's URL so they work on Pages/Vercel/localhost alike.
const ART = new URL('../art/', import.meta.url).href;

/** Role tint palette. */
export function tint() {
  return isWaking()
    ? { wall1: '#241c30', wall2: '#160f22', floor: '#120c1c', accent: '#ffcf8a', accentDim: '#e0a84a', ink: '#e8dcc0', panel: '#1c1830' }
    : { wall1: '#1a2230', wall2: '#0e1622', floor: '#0a1018', accent: '#c9ccd6', accentDim: '#9fa8bd', ink: '#dfe6f2', panel: '#12182400' };
}

export function defs(slug) {
  const t = tint();
  const [g0, g1, g2] = isWaking() ? ['#6a7488', '#252b38', '#465064'] : ['#7a6440', '#2e2416', '#58462a'];
  return `${kitDefs()}
    <linearGradient id="lg_mirror" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${g0}"/><stop offset="0.55" stop-color="${g1}"/><stop offset="1" stop-color="${g2}"/>
    </linearGradient>
    <linearGradient id="${slug}_wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${t.wall1}"/><stop offset="1" stop-color="${t.wall2}"/>
    </linearGradient>
    <linearGradient id="${slug}_floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${t.wall2}"/><stop offset="1" stop-color="${t.floor}"/>
    </linearGradient>
    <radialGradient id="${slug}_light" cx="0.5" cy="0.4" r="0.6">
      <stop offset="0" stop-color="${isWaking() ? 'rgba(255,207,138,0.30)' : 'rgba(201,204,214,0.16)'}"/>
      <stop offset="1" stop-color="transparent"/>
    </radialGradient>`;
}

/** Manor-room backdrop (wall + floor + a wainscot line), role-tinted. */
export function backdrop(slug) {
  // Same manor plate for both sides; the Glass side is desaturated + cool-washed,
  // the Waking side warm-washed — the real-vs-mirror asymmetry, preserved.
  const glass = !isWaking();
  const vfilter = glass ? 'filter:grayscale(0.5) brightness(0.88);' : '';
  return `
    <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="${ART}${slug}.webp" style="width:100%;height:100%;object-fit:cover;display:block;${vfilter}"><source src="${ART}${slug}.mp4" type="video/mp4"/></video></foreignObject>
    <rect x="0" y="0" width="1600" height="900" fill="${glass ? '#123049' : '#3a220c'}" opacity="${glass ? 0.3 : 0.15}"/>
    <ellipse cx="800" cy="360" rx="620" ry="360" fill="url(#${slug}_light)"/>`;
}

/** Side-identity tag, top-centre (clear of the top-left Gus reserve). */
export function sideTag(x = 800) {
  const t = tint();
  const sub = isWaking() ? 'the real manor' : 'inside the mirror';
  return `
    <g font-family="Georgia, serif" text-anchor="middle">
      <text x="${x}" y="46" font-size="24" fill="${t.accent}" letter-spacing="5">${sideName().toUpperCase()}</text>
      <text x="${x}" y="70" font-size="14" fill="${t.accentDim}" letter-spacing="3" opacity="0.85">${sub.toUpperCase()}</text>
    </g>`;
}

/**
 * Silvered glass for a mirror's opening: the sheen, and — unless the mirror has
 * opened — the faint figure of your friend on the other side.
 */
export function mirrorGlass(x, y, w, h, { figure = true, open = false } = {}) {
  const ghost = isWaking() ? '#d6dbe6' : '#ffd9a0';
  const cx = x + w / 2, head = y + Math.min(110, h * 0.3);
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="url(#lg_mirror)" stroke="#1d1608" stroke-width="2"/>
    <g data-fx="glass">
      ${open ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="rgba(255,207,138,0.22)" class="glow"/>` : ''}
      <path d="M${x + w * 0.12} ${y + h} L${x + w * 0.62} ${y}" stroke="#fff" stroke-opacity="0.10" stroke-width="${w * 0.12}"/>
      <path d="M${x + w * 0.45} ${y + h} L${x + w * 0.9} ${y + h * 0.1}" stroke="#fff" stroke-opacity="0.06" stroke-width="${w * 0.05}"/>
      ${figure && !open ? `<g opacity="0.3" fill="${ghost}">
        <ellipse cx="${cx}" cy="${head}" rx="${w * 0.1}" ry="${w * 0.12}"/>
        <path d="M${x + w * 0.16} ${y + h} Q${x + w * 0.2} ${head + w * 0.2} ${cx} ${head + w * 0.17} Q${x + w * 0.8} ${head + w * 0.2} ${x + w * 0.84} ${y + h} Z"/>
      </g>` : ''}
    </g>`;
}

/**
 * Render text as mirror-writing (flipped horizontally) centred at x. The true,
 * readable word is what the OTHER side reads normally — this is the Waking/Glass
 * asymmetry made literal.
 */
export function mirrorWrite(text, x, y, size = 40, fill = '#e8dcc0') {
  return `<g transform="translate(${2 * x},0) scale(-1,1)">
    <text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" fill="${fill}"
      font-family="Georgia, serif" letter-spacing="6">${text}</text>
  </g>`;
}

/**
 * A candle (waking) or a cold silver sconce (glass) as the light source.
 * (x, y) is the top of the candle. mount 'bracket' hangs it on a wall plate
 * below; 'stand' puts it in a candlestick whose foot rests at y + 58.
 */
export function sconce(slug, x, y, mount = 'bracket') {
  const metal = isWaking() ? '#b08a3e' : '#8d95a6';
  const holder = mount === 'stand'
    ? `<ellipse cx="${x}" cy="${y + 60}" rx="22" ry="5" fill="#000" opacity="0.45"/>
       <path d="M${x - 16} ${y + 58} Q${x} ${y + 48} ${x + 16} ${y + 58} Z" fill="${metal}"/>
       <rect x="${x - 3}" y="${y + 38}" width="6" height="16" fill="${metal}"/>
       <ellipse cx="${x}" cy="${y + 36}" rx="13" ry="4" fill="${metal}"/>`
    : `<ellipse cx="${x}" cy="${y + 72}" rx="9" ry="20" fill="${metal}" stroke="#1a140c" stroke-width="2"/>
       <path d="M${x} ${y + 64} Q${x - 14} ${y + 50} ${x} ${y + 38}" fill="none" stroke="${metal}" stroke-width="4"/>
       <ellipse cx="${x}" cy="${y + 36}" rx="13" ry="4" fill="${metal}"/>`;
  const flame = isWaking()
    ? `<rect x="${x - 6}" y="${y}" width="12" height="34" rx="3" fill="#e8dcc0"/>
      <path class="torch-flame" d="M${x} ${y - 26} q10 14 3 30 q-3 6 -3 6 q0 0 -3 -6 q-7 -16 3 -30z" fill="#ffcf8a"/>
      <ellipse cx="${x}" cy="${y - 10}" rx="60" ry="60" fill="rgba(255,207,138,0.18)" class="glow" data-fx="light"/>`
    : `<rect x="${x - 6}" y="${y}" width="12" height="34" rx="3" fill="#9fa8bd"/>
      <circle cx="${x}" cy="${y - 8}" r="7" fill="#c9ccd6" class="flicker"/>
      <ellipse cx="${x}" cy="${y - 8}" rx="46" ry="46" fill="rgba(201,204,214,0.12)" class="glow" data-fx="light"/>`;
  return `<g data-mount="${mount}">${holder}${flame}</g>`;
}
