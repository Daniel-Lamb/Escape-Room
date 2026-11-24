// Shared SVG fragments for Twin Signal Towers scenes: storm backdrop, rain,
// lamp-beam wedge, and the tower-identity tag. Keeps the seven scenes consistent.
// Every id/keyframe is prefixed by a per-scene slug so nothing collides.

import { towerName, isWest } from './role.js';
import { kitDefs, shadow } from '../../shared/js/scenekit.js';

// Photoreal animated backdrops live in <game>/art/<slug>.{webp,mp4}; resolve
// against this module's URL so they work on Pages/Vercel/localhost alike.
const ART = new URL('../art/', import.meta.url).href;

/** Common gradient defs. Call once inside <defs>. */
export function defs(slug) {
  return `${kitDefs()}
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
    <foreignObject x="0" y="0" width="1600" height="900"><video xmlns="http://www.w3.org/1999/xhtml" autoplay loop muted playsinline poster="${ART}${slug}.webp" style="width:100%;height:100%;object-fit:cover;display:block;"><source src="${ART}${slug}.mp4" type="video/mp4"/></video></foreignObject>`;
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

/**
 * The inside of a tower room, drawn over the storm plate: a curved whitewashed
 * stone wall with one window cut through it (the plate shows only there), a
 * plank floor from floorY down, and a stone sill under the window to stand
 * things on. Every prop in a room mounts on this wall, this floor or that sill.
 *
 * window.shape: 'rect' (four-pane casement), 'arch' (round-headed), 'round'
 * (porthole), 'band' (the lantern gallery's continuous glazing).
 * @param {string} slug
 * @param {{window: {x:number,y:number,w:number,h:number,shape?:'rect'|'arch'|'round'|'band'}, floorY?: number, panes?: number}} o
 */
export function interior(slug, o) {
  const { x, y, w, h, shape = 'rect' } = o.window;
  const floorY = o.floorY ?? 720;
  const r = Math.min(w, h) / 2;
  const hole = shape === 'round'
    ? `M${x + w / 2 - r} ${y + h / 2} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0 Z`
    : shape === 'arch'
      ? `M${x} ${y + h} L${x} ${y + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} L${x + w} ${y + h} Z`
      : `M${x} ${y} L${x + w} ${y} L${x + w} ${y + h} L${x} ${y + h} Z`;
  const courses = [];
  for (let cy = 70; cy < floorY; cy += 64) {
    const bow = 18 * Math.sign(cy - 430) * Math.min(1, Math.abs(cy - 430) / 300);
    courses.push(`<path d="M0 ${cy} Q800 ${cy - bow} 1600 ${cy}" fill="none" stroke="#000" stroke-opacity="0.22" stroke-width="2"/>`);
    const off = (cy / 64) % 2 ? 0 : 90;
    for (let jx = off; jx < 1600; jx += 180) courses.push(`<line x1="${jx}" y1="${cy}" x2="${jx}" y2="${cy + 64}" stroke="#000" stroke-opacity="0.14" stroke-width="2"/>`);
  }
  const planks = [];
  for (let i = -8; i <= 8; i++) planks.push(`<line x1="${800 + i * 60}" y1="${floorY}" x2="${800 + i * 210}" y2="900" stroke="#000" stroke-opacity="0.35" stroke-width="2"/>`);
  for (const py of [floorY + 40, floorY + 95, floorY + 165]) if (py < 900) planks.push(`<line x1="0" y1="${py}" x2="1600" y2="${py}" stroke="#000" stroke-opacity="0.18" stroke-width="1.5"/>`);
  const bars = shape === 'round'
    ? `<circle cx="${x + w / 2}" cy="${y + h / 2}" r="${r}" fill="none" stroke="#2a3342" stroke-width="16"/>
       ${[0, 45, 90, 135].map(a => `<line x1="${x + w / 2 - r * Math.cos(a * Math.PI / 180)}" y1="${y + h / 2 - r * Math.sin(a * Math.PI / 180)}" x2="${x + w / 2 + r * Math.cos(a * Math.PI / 180)}" y2="${y + h / 2 + r * Math.sin(a * Math.PI / 180)}" stroke="#2a3342" stroke-width="5"/>`).join('')}`
    : shape === 'band'
      ? `${Array.from({ length: (o.panes || 6) - 1 }, (_, i) => `<line x1="${x + (w / (o.panes || 6)) * (i + 1)}" y1="${y}" x2="${x + (w / (o.panes || 6)) * (i + 1)}" y2="${y + h}" stroke="#2a3342" stroke-width="12"/>`).join('')}
         <line x1="${x}" y1="${y + h * 0.5}" x2="${x + w}" y2="${y + h * 0.5}" stroke="#2a3342" stroke-width="6"/>
         <path d="${hole}" fill="none" stroke="#2a3342" stroke-width="16"/>`
      : `<line x1="${x + w / 2}" y1="${shape === 'arch' ? y : y}" x2="${x + w / 2}" y2="${y + h}" stroke="#2a3342" stroke-width="9"/>
         <line x1="${x}" y1="${y + h * (shape === 'arch' ? 0.62 : 0.5)}" x2="${x + w}" y2="${y + h * (shape === 'arch' ? 0.62 : 0.5)}" stroke="#2a3342" stroke-width="7"/>
         <path d="${hole}" fill="none" stroke="#2a3342" stroke-width="16"/>`;
  return `
    <defs>
      <clipPath id="${slug}_win"><path d="${hole}"/></clipPath>
      <mask id="${slug}_wallmask" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="900">
        <rect x="0" y="0" width="1600" height="${floorY}" fill="#fff"/><path d="${hole}" fill="#000"/>
      </mask>
      <linearGradient id="${slug}_wall" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#14181f"/><stop offset="0.5" stop-color="#2e3540"/><stop offset="1" stop-color="#14181f"/>
      </linearGradient>
      <radialGradient id="${slug}_winlight" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0.45" stop-color="#9fc7dd" stop-opacity="0.07"/><stop offset="1" stop-color="#9fc7dd" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="${slug}_floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#2a2117"/><stop offset="1" stop-color="#120d08"/>
      </linearGradient>
    </defs>
    <g data-mount="room">
      <path d="M0 0 H1600 V${floorY} H0 Z ${hole}" fill="url(#${slug}_wall)" fill-rule="evenodd"/>
      <g mask="url(#${slug}_wallmask)">${courses.join('')}</g>
      <path d="${hole}" fill="none" stroke="#0a0d12" stroke-width="30" stroke-opacity="0.6"/>
      <rect x="0" y="${floorY}" width="1600" height="${900 - floorY}" fill="url(#${slug}_floor)"/>
      ${planks.join('')}
      <rect x="0" y="${floorY - 14}" width="1600" height="16" fill="#0f1217"/>
      <ellipse data-fx="light" cx="${x + w / 2}" cy="${y + h / 2}" rx="${w * 0.95}" ry="${h * 0.9}" fill="url(#${slug}_winlight)"/>
      ${bars}
      ${shape === 'round' ? '' : `<rect x="${x - 22}" y="${y + h}" width="${w + 44}" height="22" rx="3" fill="url(#sk_stone)" stroke="#0c0f13" stroke-width="2"/>
      ${shadow(x + w / 2, y + h + 30, w * 0.55, 8, 0.45)}`}
    </g>`;
}

/** Rain, but only beyond the glass. */
export function rainOutside(slug) {
  return `<g clip-path="url(#${slug}_win)">${rain(slug)}</g>`;
}

/**
 * The six bearing-marks are compass plates. Each one's needle points one way
 * round the rose — mark 1 north, then sunwise — and the crown sweeps the beam
 * from north to read their letters in order.
 */
export const BEARINGS = ['', 'N', 'NE', 'E', 'SE', 'S', 'SW'];
export function bearingOf(n) { return BEARINGS[n] || '?'; }

/** A bearing-mark as drawn: a brass compass plate, needle on its bearing, letter below. */
export function compassPlate(n, letter, r = 40) {
  const a = (n - 1) * 45;
  return `<circle r="${r}" fill="url(#sk_brass)" stroke="#3a2a0c" stroke-width="2.5"/>
    <circle r="${r * 0.78}" fill="#efe6cf" stroke="#6b5a3a" stroke-width="1.5"/>
    <text y="${-r * 0.5}" text-anchor="middle" font-size="${r * 0.28}" fill="#6b5a3a" font-family="Consolas, monospace">N</text>
    <path d="M0 ${-r * 0.7} L${r * 0.12} 0 L0 ${r * 0.18} L${-r * 0.12} 0 Z" fill="#7a1f2b" transform="rotate(${a})"/>
    <circle r="${r * 0.08}" fill="#26221a"/>
    <text y="${r * 0.62}" text-anchor="middle" font-size="${r * 0.36}" fill="#26221a" font-family="Consolas, monospace" font-weight="bold">${bearingOf(n)}</text>
    <text y="${r + r * 0.62}" text-anchor="middle" font-size="${r * 0.6}" fill="#26221a" font-family="Georgia, serif">${letter}</text>`;
}
