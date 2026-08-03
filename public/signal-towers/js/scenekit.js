// Shared SVG fragments for Twin Signal Towers scenes: storm backdrop, rain,
// lamp-beam wedge, and the tower-identity tag. Keeps the seven scenes consistent.
// Every id/keyframe is prefixed by a per-scene slug so nothing collides.

import { towerName, isWest } from './role.js';

/** Common gradient defs. Call once inside <defs>. */
export function defs(slug) {
  return `
    <linearGradient id="${slug}_sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#05080f"/>
      <stop offset="0.5" stop-color="#0a1622"/>
      <stop offset="1" stop-color="#0e2436"/>
    </linearGradient>
    <linearGradient id="${slug}_sea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0e2436"/>
      <stop offset="1" stop-color="#05101a"/>
    </linearGradient>
    <linearGradient id="${slug}_stone" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2b3547"/>
      <stop offset="1" stop-color="#141c26"/>
    </linearGradient>
    <radialGradient id="${slug}_lamp" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="rgba(255,230,166,0.55)"/>
      <stop offset="0.5" stop-color="rgba(255,207,106,0.2)"/>
      <stop offset="1" stop-color="rgba(255,207,106,0)"/>
    </radialGradient>
    <style>
      @keyframes ${slug}_rain { 0% { transform: translateY(-40px); } 100% { transform: translateY(40px); } }
      .${slug}_rl { animation: ${slug}_rain 0.5s linear infinite; }
    </style>`;
}

/** Storm sky + sea backdrop rect (full frame). */
export function backdrop(slug) {
  return `
    <rect x="0" y="0" width="1600" height="560" fill="url(#${slug}_sky)"/>
    <rect x="0" y="540" width="1600" height="360" fill="url(#${slug}_sea)"/>
    <!-- horizon whitecaps -->
    <g stroke="#9fc7dd" stroke-width="2" opacity="0.25" stroke-linecap="round">
      ${[560, 600, 650, 710, 780].map((y, i) =>
        `<path d="M${(i * 260) % 1600} ${y} q60 -8 120 0 t120 0 t120 0 t120 0" fill="none"/>`).join('')}
    </g>`;
}

/** Diagonal rain streaks over the whole scene. */
export function rain(slug) {
  const lines = [];
  for (let i = 0; i < 26; i++) {
    const x = (i * 63) % 1600;
    const y = (i * 137) % 560;
    lines.push(`<line x1="${x}" y1="${y}" x2="${x - 12}" y2="${y + 34}"/>`);
  }
  return `<g class="${slug}_rl" stroke="#bcd6e6" stroke-width="1.5" opacity="0.18" stroke-linecap="round">
    ${lines.join('')}
  </g>`;
}

/** A sweeping warm lamp-beam wedge from a lamp at (x,y) pointing at angleDeg. */
export function beam(slug, x, y, angleDeg, len = 900) {
  const a = (angleDeg * Math.PI) / 180;
  const spread = 0.16;
  const x1 = x + Math.cos(a - spread) * len, y1 = y + Math.sin(a - spread) * len;
  const x2 = x + Math.cos(a + spread) * len, y2 = y + Math.sin(a + spread) * len;
  return `<polygon points="${x},${y} ${x1.toFixed(0)},${y1.toFixed(0)} ${x2.toFixed(0)},${y2.toFixed(0)}"
    fill="rgba(255,230,166,0.10)"/>
    <ellipse cx="${x}" cy="${y}" rx="120" ry="120" fill="url(#${slug}_lamp)" class="glow"/>`;
}

/** Tower-identity tag, top-centre (clear of the top-left Gus reserve). */
export function towerTag() {
  const sub = isWest() ? 'Kestrel Point' : 'Gannet Rock';
  return `
    <g font-family="Consolas, monospace" text-anchor="middle">
      <text x="800" y="46" font-size="24" fill="#e8c85a" letter-spacing="6">${towerName().toUpperCase()}</text>
      <text x="800" y="70" font-size="15" fill="#9fc7dd" letter-spacing="3" opacity="0.8">${sub.toUpperCase()}</text>
    </g>`;
}
