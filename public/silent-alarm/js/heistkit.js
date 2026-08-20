// Shared SVG fragments for Silent Alarm scenes. Two visual worlds keyed to the
// role: The Hand sees the museum interior (marble, spotlights, red laser lines,
// drifting dust); The Eye sees the van cabin and a wall of green console monitors
// (phosphor schematics + scanline flicker). Keeps the seven scenes consistent.
// Every id/keyframe is prefixed by a per-scene slug so nothing collides.

import { roleName, isHand } from './role.js';

// Photoreal animated backdrops live in <game>/art/<slug>.{webp,mp4}; resolve
// against this module's URL so they work on Pages/Vercel/localhost alike.
const ART = new URL('../art/', import.meta.url).href;

/** Common gradient + keyframe defs. Call once inside <defs>. */
export function defs(slug) {
  return `
    <linearGradient id="${slug}_hallSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#05070a"/>
      <stop offset="0.55" stop-color="#0b1118"/>
      <stop offset="1" stop-color="#12202b"/>
    </linearGradient>
    <linearGradient id="${slug}_marble" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1a2430"/>
      <stop offset="1" stop-color="#080c11"/>
    </linearGradient>
    <linearGradient id="${slug}_van" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#060d0a"/>
      <stop offset="0.6" stop-color="#08110d"/>
      <stop offset="1" stop-color="#0c1a14"/>
    </linearGradient>
    <linearGradient id="${slug}_console" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0c1a14"/>
      <stop offset="1" stop-color="#05100b"/>
    </linearGradient>
    <radialGradient id="${slug}_spot" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="rgba(255,230,166,0.5)"/>
      <stop offset="0.5" stop-color="rgba(255,230,166,0.14)"/>
      <stop offset="1" stop-color="rgba(255,230,166,0)"/>
    </radialGradient>
    <radialGradient id="${slug}_greenglow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="rgba(124,255,178,0.4)"/>
      <stop offset="1" stop-color="rgba(124,255,178,0)"/>
    </radialGradient>
    <style>
      @keyframes ${slug}_scan { 0% { transform: translateY(-6px); } 100% { transform: translateY(6px); } }
      .${slug}_sc { animation: ${slug}_scan 3.4s linear infinite alternate; }
      @keyframes ${slug}_laze { 0%,100% { opacity: 0.5; } 50% { opacity: 0.95; } }
      .${slug}_lz { animation: ${slug}_laze 2.6s ease-in-out infinite; }
    </style>`;
}

/** Museum-interior backdrop (The Hand). */
function hallBackdrop(slug) {
  return `
    <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="${ART}${slug}.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="${ART}${slug}.mp4" type="video/mp4"/></video></foreignObject>
    <ellipse cx="250" cy="120" rx="120" ry="150" fill="url(#${slug}_spot)" opacity="0.4"/>
    <ellipse cx="1350" cy="120" rx="120" ry="150" fill="url(#${slug}_spot)" opacity="0.4"/>`;
}

/** Van cabin + wall of green monitors (The Eye). */
function vanBackdrop(slug) {
  let monitors = '';
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 4; c++) {
      const x = 120 + c * 190, y = 90 + r * 200;
      monitors += `
        <rect x="${x}" y="${y}" width="168" height="170" rx="6" fill="#04120c"
          stroke="#1c3a2c" stroke-width="3"/>
        <rect x="${x + 8}" y="${y + 8}" width="152" height="154" rx="3" fill="url(#${slug}_console)"/>
        <g stroke="#153a29" stroke-width="1" opacity="0.6">
          ${[0, 1, 2, 3].map(i => `<line x1="${x + 8}" y1="${y + 40 + i * 34}" x2="${x + 160}" y2="${y + 40 + i * 34}"/>`).join('')}
        </g>`;
    }
  }
  return `
    <rect x="0" y="0" width="1600" height="900" fill="url(#${slug}_van)"/>
    <!-- console wall -->
    <rect x="80" y="60" width="960" height="440" rx="10" fill="#050f0a" stroke="#123324" stroke-width="4"/>
    ${monitors}
    <!-- windscreen with wet city glow on the right -->
    <rect x="1080" y="60" width="460" height="440" rx="14" fill="#060f14" stroke="#123324" stroke-width="4"/>
    <g opacity="0.5">
      ${[1140, 1250, 1360, 1470].map((x, i) => `<circle cx="${x}" cy="${180 + (i % 2) * 120}" r="${5 + (i % 3)}" fill="#57d6e6" class="flicker"/>`).join('')}
      ${[1180, 1300, 1420].map((x, i) => `<rect x="${x}" y="${260 + i * 30}" width="60" height="10" rx="4" fill="rgba(224,52,75,0.5)"/>`).join('')}
    </g>
    <!-- dashboard shelf -->
    <rect x="0" y="500" width="1600" height="400" fill="#060d0a"/>
    <rect x="0" y="500" width="1600" height="14" fill="#0e1f17"/>`;
}

/** Backdrop for the current role's world. */
export function backdrop(slug) {
  return isHand() ? hallBackdrop(slug) : vanBackdrop(slug);
}

/** Red laser-line overlay (The Hand's signature ambient). */
function lasers(slug) {
  const lines = [];
  for (let i = 0; i < 5; i++) {
    const y = 300 + i * 120;
    lines.push(`<line x1="0" y1="${y}" x2="1600" y2="${y - 40}" class="${slug}_lz"/>`);
  }
  return `<g stroke="#ff3b57" stroke-width="2" opacity="0.5" stroke-linecap="round"
    filter="drop-shadow(0 0 4px rgba(255,59,87,0.7))">${lines.join('')}</g>`;
}

/** Green scanline overlay (The Eye's signature ambient). */
function scanlines(slug) {
  const lines = [];
  for (let y = 70; y < 500; y += 5) lines.push(`<line x1="80" y1="${y}" x2="1040" y2="${y}"/>`);
  return `<g class="${slug}_sc" stroke="#7cffb2" stroke-width="0.6" opacity="0.06">${lines.join('')}</g>`;
}

/** The role-appropriate ambient overlay. */
export function ambient(slug) {
  return isHand() ? lasers(slug) : scanlines(slug);
}

/** Role-identity tag, top-centre (clear of the top-left Gus reserve). */
export function roleTag() {
  const sub = isHand() ? 'Larkspur Museum · inside' : 'The van · overwatch';
  const col = isHand() ? '#ffe6a6' : '#7cffb2';
  const sc = isHand() ? '#8aa0b4' : '#4f9c78';
  return `
    <g font-family="Consolas, monospace" text-anchor="middle">
      <text x="800" y="46" font-size="24" fill="${col}" letter-spacing="6">${roleName().toUpperCase()}</text>
      <text x="800" y="70" font-size="15" fill="${sc}" letter-spacing="3" opacity="0.85">${sub.toUpperCase()}</text>
    </g>`;
}
