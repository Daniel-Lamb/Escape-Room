// Shared SVG fragments for The Looking Glass. The Waking Side (p1) renders warm
// and candle-lit; the Glass Side (p2) renders cool, silvered, and desaturated —
// the same manor seen from inside the mirror. Every id/keyframe is slug-prefixed.

import { sideName, isWaking } from './role.js';

/** Role tint palette. */
export function tint() {
  return isWaking()
    ? { wall1: '#241c30', wall2: '#160f22', floor: '#120c1c', accent: '#ffcf8a', accentDim: '#e0a84a', ink: '#e8dcc0', panel: '#1c1830' }
    : { wall1: '#1a2230', wall2: '#0e1622', floor: '#0a1018', accent: '#c9ccd6', accentDim: '#9fa8bd', ink: '#dfe6f2', panel: '#12182400' };
}

export function defs(slug) {
  const t = tint();
  return `
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
  const t = tint();
  return `
    <rect x="0" y="0" width="1600" height="620" fill="url(#${slug}_wall)"/>
    <rect x="0" y="600" width="1600" height="300" fill="url(#${slug}_floor)"/>
    <rect x="0" y="596" width="1600" height="10" fill="${t.accentDim}" opacity="0.25"/>
    ${isWaking() ? '' : `<rect x="0" y="0" width="1600" height="900" fill="#7fb0b8" opacity="0.05"/>`}
    <ellipse cx="800" cy="360" rx="620" ry="360" fill="url(#${slug}_light)"/>`;
}

/** Side-identity tag, top-centre (clear of the top-left Gus reserve). */
export function sideTag() {
  const t = tint();
  const sub = isWaking() ? 'the real manor' : 'inside the mirror';
  return `
    <g font-family="Georgia, serif" text-anchor="middle">
      <text x="800" y="46" font-size="24" fill="${t.accent}" letter-spacing="5">${sideName().toUpperCase()}</text>
      <text x="800" y="70" font-size="14" fill="${t.accentDim}" letter-spacing="3" opacity="0.85">${sub.toUpperCase()}</text>
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

/** A candle (waking) or a cold silver sconce (glass) as the light source. */
export function sconce(slug, x, y) {
  if (isWaking()) {
    return `<g>
      <rect x="${x - 6}" y="${y}" width="12" height="34" rx="3" fill="#e8dcc0"/>
      <path class="torch-flame" d="M${x} ${y - 26} q10 14 3 30 q-3 6 -3 6 q0 0 -3 -6 q-7 -16 3 -30z" fill="#ffcf8a"/>
      <ellipse cx="${x}" cy="${y - 10}" rx="60" ry="60" fill="rgba(255,207,138,0.18)" class="glow"/>
    </g>`;
  }
  return `<g>
    <rect x="${x - 6}" y="${y}" width="12" height="34" rx="3" fill="#9fa8bd"/>
    <circle cx="${x}" cy="${y - 8}" r="7" fill="#c9ccd6" class="flicker"/>
    <ellipse cx="${x}" cy="${y - 8}" rx="46" ry="46" fill="rgba(201,204,214,0.12)" class="glow"/>
  </g>`;
}
