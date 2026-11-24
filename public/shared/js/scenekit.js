// @ts-check
// Scene kit — physical mounting for everything a room draws on top of its
// background plate.
//
// The series rule (docs/ROOM_CONTRACT.md, "Placement"): nothing floats. Every
// clue card, lock, plaque, screen or prop is either painted into the plate or
// drawn with what holds it up — nails into a wall, chains from a beam, bolts
// into a bulkhead, an easel or post down to the floor, a bracket, a recess cut
// into stone — plus the shadow it throws. These helpers draw that hardware so a
// room only says *where* a thing is and *how* it is held.
//
// Every helper wraps its output in <g data-mount="…">; tools/room-lint.mjs
// treats any large translucent panel outside such a group as a floating-UI bug.
//
// Usage inside scene(state):
//   import { kitDefs, panel, shadow } from '../../../shared/js/scenekit.js';
//   `<svg …><defs>${kitDefs()}</defs> …
//      ${panel({ ...RECT.roster, material: 'parchment', mount: 'nails', body: '…' })}`
// and in hotspots(state) reuse the same rectangle: { id: 'roster', ...RECT.roster }.

/** Shared gradients + filters. Include once per scene, inside <defs>. */
export function kitDefs() {
  return `
    <radialGradient id="sk_shadow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#000" stop-opacity="0.7"/>
      <stop offset="0.6" stop-color="#000" stop-opacity="0.3"/>
      <stop offset="1" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="sk_wood" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#5a3f24"/><stop offset="0.5" stop-color="#46301b"/><stop offset="1" stop-color="#352313"/>
    </linearGradient>
    <linearGradient id="sk_darkwood" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3a2817"/><stop offset="1" stop-color="#21160c"/>
    </linearGradient>
    <linearGradient id="sk_brass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#d9b65a"/><stop offset="0.45" stop-color="#a7822e"/><stop offset="1" stop-color="#6e531a"/>
    </linearGradient>
    <linearGradient id="sk_iron" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#4a4e5a"/><stop offset="1" stop-color="#23262e"/>
    </linearGradient>
    <linearGradient id="sk_steel" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#5c6675"/><stop offset="0.5" stop-color="#363d49"/><stop offset="1" stop-color="#1c2028"/>
    </linearGradient>
    <linearGradient id="sk_parch" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#eadbb2"/><stop offset="0.7" stop-color="#d8c393"/><stop offset="1" stop-color="#bfa874"/>
    </linearGradient>
    <linearGradient id="sk_slate" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2b2f36"/><stop offset="1" stop-color="#1a1d22"/>
    </linearGradient>
    <linearGradient id="sk_stone" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8d7d63"/><stop offset="1" stop-color="#5e5242"/>
    </linearGradient>
    <linearGradient id="sk_basalt" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3a3932"/><stop offset="1" stop-color="#1c1b16"/>
    </linearGradient>
    <linearGradient id="sk_sandstone" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#b89a68"/><stop offset="1" stop-color="#806640"/>
    </linearGradient>
    <linearGradient id="sk_moss" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#4f5a3a"/><stop offset="1" stop-color="#2c3322"/>
    </linearGradient>
    <linearGradient id="sk_glass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0d1a24"/><stop offset="1" stop-color="#060b11"/>
    </linearGradient>
    <linearGradient id="sk_paper" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f1ead8"/><stop offset="1" stop-color="#d9cfb6"/>
    </linearGradient>
    <filter id="sk_drop" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="8" stdDeviation="7" flood-color="#000" flood-opacity="0.6"/>
    </filter>
    <filter id="sk_inset" x="-5%" y="-5%" width="110%" height="110%">
      <feOffset dx="0" dy="3"/><feGaussianBlur stdDeviation="3" result="o"/>
      <feComposite in="SourceGraphic" in2="o" operator="over"/>
    </filter>`;
}

/**
 * Soft contact shadow where something meets a surface.
 * @param {number} cx @param {number} cy @param {number} rx @param {number} [ry] @param {number} [opacity]
 */
export function shadow(cx, cy, rx, ry = Math.max(6, rx * 0.16), opacity = 0.75) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#sk_shadow)" opacity="${opacity}"/>`;
}

/** @typedef {'wood'|'darkwood'|'brass'|'iron'|'steel'|'parchment'|'paper'|'slate'|'stone'|'basalt'|'sandstone'|'moss'|'glass'} Material */

/** @type {Record<Material, {fill: string, edge: string, inner: string, text: string}>} */
const MAT = {
  wood:      { fill: 'url(#sk_wood)',      edge: '#22160b', inner: '#6b4c2c', text: '#f1e2bf' },
  darkwood:  { fill: 'url(#sk_darkwood)',  edge: '#120b05', inner: '#4a3320', text: '#ead8b0' },
  brass:     { fill: 'url(#sk_brass)',     edge: '#4f3b10', inner: '#e8c96e', text: '#2a1d05' },
  iron:      { fill: 'url(#sk_iron)',      edge: '#121418', inner: '#5d6270', text: '#d9dde6' },
  steel:     { fill: 'url(#sk_steel)',     edge: '#0f1217', inner: '#7a8696', text: '#dbe7f3' },
  parchment: { fill: 'url(#sk_parch)',     edge: '#7d6538', inner: '#f3e7c4', text: '#3b2a12' },
  paper:     { fill: 'url(#sk_paper)',     edge: '#8e8673', inner: '#fbf6e9', text: '#26221a' },
  slate:     { fill: 'url(#sk_slate)',     edge: '#0d0f12', inner: '#3d434c', text: '#e4e7ea' },
  stone:     { fill: 'url(#sk_stone)',     edge: '#3a3226', inner: '#a8977a', text: '#2c2418' },
  basalt:    { fill: 'url(#sk_basalt)',    edge: '#14130f', inner: '#6b6a5c', text: '#d9d6c4' },
  sandstone: { fill: 'url(#sk_sandstone)', edge: '#4a3920', inner: '#d2b483', text: '#2e2210' },
  moss:      { fill: 'url(#sk_moss)',      edge: '#161b10', inner: '#6b7850', text: '#e6ecd2' },
  glass:     { fill: 'url(#sk_glass)',     edge: '#05080c', inner: '#2a3a48', text: '#bfe9ff' },
};

export function materialText(/** @type {Material} */ m) { return (MAT[m] || MAT.wood).text; }

/** @param {number} x @param {number} y @param {number} [r] */
const nail = (x, y, r = 5) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#2a2620"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${r * 0.4}" fill="#8a8476"/>`;
/** @param {number} x @param {number} y @param {number} [r] */
const bolt = (x, y, r = 6) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#1d2027" stroke="#6b7484" stroke-width="1.5"/><line x1="${x - r * 0.55}" y1="${y}" x2="${x + r * 0.55}" y2="${y}" stroke="#6b7484" stroke-width="1.5"/>`;

/** @param {number} x1 @param {number} y1 @param {number} x2 @param {number} y2 */
function chain(x1, y1, x2, y2) {
  const n = Math.max(2, Math.round(Math.hypot(x2 - x1, y2 - y1) / 14));
  let s = '';
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t;
    s += i % 2
      ? `<rect x="${x - 2.5}" y="${y - 7}" width="5" height="14" rx="2.5" fill="none" stroke="#5d6270" stroke-width="2.5"/>`
      : `<ellipse cx="${x}" cy="${y}" rx="5" ry="7.5" fill="none" stroke="#7a7f8c" stroke-width="2.5"/>`;
  }
  return s;
}

/**
 * A board / plaque / card / sign / lock-face, with the hardware that holds it.
 *
 * mount:
 *   'nails'   — nailed flat to the wall behind it (corner nails)
 *   'pinned'  — a sheet pinned at the top (parchment / paper on a wall or door)
 *   'hook'    — hangs from a single wall nail on a cord
 *   'chains'  — hangs on two chains from a beam/ceiling at anchorY
 *   'bolts'   — bolted plate (metal on stone, bulkheads, machinery)
 *   'bracket' — sits on two iron wall-brackets
 *   'inset'   — cut into the wall: recessed, with a shadowed lip
 *   'easel'   — stands on an easel down to floorY
 *   'post'    — on a single post / pedestal down to floorY
 *   'table'   — propped on a surface at its bottom edge (back strut + contact shadow)
 *   'arm'     — a screen on an articulated wall arm (sci-fi)
 *   'console' — a screen set into a console body that stands on floorY
 *
 * @param {{x:number,y:number,w:number,h:number, material?: Material, mount?: string,
 *   anchorY?: number, floorY?: number, side?: 'left'|'right', body?: string, rx?: number,
 *   glow?: string, cls?: string, tilt?: number}} o
 */
export function panel(o) {
  const { x, y, w, h, material = 'wood', mount = 'nails', body = '', glow, cls = '', tilt = 0 } = o;
  const m = MAT[material] || MAT.wood;
  const rx = o.rx ?? (material === 'parchment' || material === 'paper' ? 2 : 6);
  const floorY = o.floorY ?? Math.min(890, y + h + 160);
  const anchorY = o.anchorY ?? Math.max(0, y - 120);
  const cx = x + w / 2;
  let behind = '', front = '', under = '';

  switch (mount) {
    case 'nails':
      front = nail(x + 12, y + 12) + nail(x + w - 12, y + 12) + nail(x + 12, y + h - 12) + nail(x + w - 12, y + h - 12);
      break;
    case 'pinned':
      front = `<circle cx="${cx}" cy="${y + 10}" r="6" fill="#7a2a1e"/><circle cx="${cx - 2}" cy="${y + 8}" r="2" fill="#d98b7a"/>`;
      break;
    case 'hook':
      behind = `<path d="M${x + w * 0.2} ${y + 4} L${cx} ${y - 34} L${x + w * 0.8} ${y + 4}" fill="none" stroke="#3b2d1c" stroke-width="3"/>`;
      front = nail(cx, y - 34, 5);
      break;
    case 'chains':
      behind = chain(x + w * 0.15, anchorY, x + w * 0.15, y + 6) + chain(x + w * 0.85, anchorY, x + w * 0.85, y + 6);
      front = `<circle cx="${x + w * 0.15}" cy="${y + 6}" r="4" fill="#5d6270"/><circle cx="${x + w * 0.85}" cy="${y + 6}" r="4" fill="#5d6270"/>`;
      break;
    case 'bolts':
      front = bolt(x + 12, y + 12) + bolt(x + w - 12, y + 12) + bolt(x + 12, y + h - 12) + bolt(x + w - 12, y + h - 12);
      break;
    case 'bracket': {
      const bw = Math.min(46, w * 0.18);
      under = [x + w * 0.2, x + w * 0.8].map(bx => {
        const d = bx < cx ? 1 : -1;
        return `<path d="M${bx} ${y + h} L${bx} ${y + h + bw} L${bx + d * bw * 0.7} ${y + h} Z" fill="url(#sk_iron)" stroke="#111" stroke-width="2"/>
          <path d="M${bx + d * 4} ${y + h + bw * 0.25} Q${bx + d * bw * 0.25} ${y + h + bw * 0.3} ${bx + d * bw * 0.45} ${y + h + 3}" fill="none" stroke="#111" stroke-width="2"/>`;
      }).join('');
      break;
    }
    case 'inset':
      behind = `<rect x="${x - 10}" y="${y - 10}" width="${w + 20}" height="${h + 20}" rx="${rx + 4}" fill="#000" opacity="0.55"/>
        <rect x="${x - 6}" y="${y - 6}" width="${w + 12}" height="${h + 12}" rx="${rx + 2}" fill="none" stroke="#000" stroke-opacity="0.5" stroke-width="5"/>`;
      break;
    case 'easel': {
      const top = y + h * 0.35;
      under = `${shadow(cx, floorY, w * 0.55)}
        <line x1="${x + w * 0.2}" y1="${top}" x2="${x + w * 0.05}" y2="${floorY}" stroke="#3a2818" stroke-width="11" stroke-linecap="round"/>
        <line x1="${x + w * 0.8}" y1="${top}" x2="${x + w * 0.95}" y2="${floorY}" stroke="#3a2818" stroke-width="11" stroke-linecap="round"/>
        <line x1="${cx}" y1="${y + 10}" x2="${cx + 8}" y2="${floorY - 6}" stroke="#24180d" stroke-width="9" stroke-linecap="round"/>
        <rect x="${x - 8}" y="${y + h - 4}" width="${w + 16}" height="14" rx="3" fill="#4a3320" stroke="#24180d" stroke-width="2"/>`;
      break;
    }
    case 'post':
      under = `${shadow(cx, floorY, Math.max(40, w * 0.3))}
        <rect x="${cx - 9}" y="${y + h - 4}" width="18" height="${floorY - (y + h) + 4}" fill="url(#sk_iron)"/>
        <path d="M${cx - 38} ${floorY} L${cx + 38} ${floorY} L${cx + 24} ${floorY - 16} L${cx - 24} ${floorY - 16} Z" fill="url(#sk_iron)"/>`;
      break;
    case 'table':
      under = `${shadow(cx, y + h + 4, w * 0.55, 9)}
        <line x1="${cx}" y1="${y + h * 0.3}" x2="${cx + w * 0.12}" y2="${y + h + 2}" stroke="#1b140c" stroke-width="7" stroke-linecap="round"/>`;
      break;
    case 'arm': {
      const side = o.side || (cx < 800 ? 'left' : 'right');
      const wx = side === 'left' ? x - 70 : x + w + 70, ax = side === 'left' ? x + 10 : x + w - 10;
      behind = `<rect x="${wx - 10}" y="${y + h / 2 - 34}" width="20" height="68" rx="4" fill="url(#sk_steel)"/>
        <path d="M${wx} ${y + h / 2} L${(wx + ax) / 2} ${y + h / 2 - 22} L${ax} ${y + h / 2}" fill="none" stroke="#3a414d" stroke-width="10" stroke-linejoin="round"/>
        ${bolt(wx, y + h / 2 - 22, 4)}${bolt(wx, y + h / 2 + 22, 4)}`;
      break;
    }
    case 'console':
      under = `${shadow(cx, floorY, w * 0.6)}
        <path d="M${x + w * 0.12} ${y + h - 6} L${x + w * 0.88} ${y + h - 6} L${x + w * 0.8} ${floorY} L${x + w * 0.2} ${floorY} Z" fill="url(#sk_steel)" stroke="#0f1217" stroke-width="3"/>
        <rect x="${x + w * 0.3}" y="${(y + h + floorY) / 2}" width="${w * 0.4}" height="6" rx="3" fill="#3fd0ff" opacity="0.5"/>`;
      break;
    default:
      break;
  }

  const lit = glow ? `<rect x="${x - 14}" y="${y - 14}" width="${w + 28}" height="${h + 28}" rx="${rx + 10}" fill="${glow}" opacity="0.18" class="glow"/>` : '';
  const face = `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${m.fill}" stroke="${m.edge}" stroke-width="3"/>
    <rect x="${x + 5}" y="${y + 5}" width="${w - 10}" height="${h - 10}" rx="${Math.max(1, rx - 2)}" fill="none" stroke="${m.inner}" stroke-opacity="0.45" stroke-width="1.5"/>`;
  const rot = tilt ? ` transform="rotate(${tilt} ${cx} ${y + h / 2})"` : '';
  return `<g data-mount="${mount}" class="${cls}">${under}${behind}${lit}<g filter="url(#sk_drop)"${rot}>${face}</g><g${rot}>${body}${front}</g></g>`;
}

/**
 * Something that stands on the floor or a surface (a sprite or drawn prop),
 * with its contact shadow. `baseY` is where it touches down.
 * @param {{cx:number, baseY:number, w:number, body:string, mount?: string}} o
 */
export function grounded({ cx, baseY, w, body, mount = 'floor' }) {
  return `<g data-mount="${mount}">${shadow(cx, baseY, w * 0.55)}${body}</g>`;
}

/**
 * A wall shelf with two brackets; things then stand on y.
 * @param {{x:number, y:number, w:number, depth?:number}} o
 */
export function shelf({ x, y, w, depth = 16 }) {
  return `<g data-mount="bracket">
    ${shadow(x + w / 2, y + depth + 10, w * 0.5, 8, 0.5)}
    <rect x="${x}" y="${y}" width="${w}" height="${depth}" rx="3" fill="url(#sk_wood)" stroke="#1c120a" stroke-width="2"/>
    ${[x + 30, x + w - 30].map(bx => `<path d="M${bx} ${y + depth} l0 34 M${bx} ${y + depth + 34} q0 -30 24 -34" fill="none" stroke="#24262c" stroke-width="6" stroke-linecap="round"/>`).join('')}
  </g>`;
}

/**
 * A pedestal / stand for a free-standing object (a scale, a dial, a bust).
 * @param {{cx:number, topY:number, floorY:number, w?:number, material?: Material}} o
 */
export function pedestal({ cx, topY, floorY, w = 120, material = 'stone' }) {
  const m = MAT[/** @type {Material} */ (material)] || MAT.stone;
  return `<g data-mount="post">
    ${shadow(cx, floorY, w * 0.75)}
    <rect x="${cx - w / 2}" y="${floorY - 26}" width="${w}" height="26" rx="4" fill="${m.fill}" stroke="${m.edge}" stroke-width="2"/>
    <rect x="${cx - w * 0.32}" y="${topY + 16}" width="${w * 0.64}" height="${floorY - 26 - topY - 16}" fill="${m.fill}" stroke="${m.edge}" stroke-width="2"/>
    <rect x="${cx - w * 0.48}" y="${topY}" width="${w * 0.96}" height="18" rx="4" fill="${m.fill}" stroke="${m.edge}" stroke-width="2"/>
  </g>`;
}

/**
 * The player's own kit, docked to the frame edge — for the duo/group relay
 * cards (the earpiece, the case-file, the field radio). It is not *in* the
 * room, so it lives at the screen edge, styled as a device in hand.
 * @param {{x:number,y:number,w:number,h:number, kind?: 'radio'|'notebook'|'tablet', body?: string, title?: string}} o
 */
export function kit({ x, y, w, h, kind = 'notebook', body = '', title = '' }) {
  const head = title ? `<text x="${x + w / 2}" y="${y + 26}" text-anchor="middle" font-size="14" letter-spacing="2"
      font-family="Palatino Linotype, Georgia, serif" fill="${kind === 'notebook' ? '#4a3a22' : '#9fe3ff'}">${title}</text>` : '';
  const shell = kind === 'notebook'
    ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="url(#sk_paper)" stroke="#6b5a3a" stroke-width="3"/>
       ${Array.from({ length: Math.floor(w / 34) }, (_, i) => `<ellipse cx="${x + 20 + i * 34}" cy="${y}" rx="6" ry="10" fill="none" stroke="#3b3f48" stroke-width="3"/>`).join('')}
       ${Array.from({ length: Math.floor((h - 40) / 26) }, (_, i) => `<line x1="${x + 14}" y1="${y + 46 + i * 26}" x2="${x + w - 14}" y2="${y + 46 + i * 26}" stroke="#9fb3c8" stroke-opacity="0.35"/>`).join('')}`
    : `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${kind === 'radio' ? 14 : 18}" fill="#14181f" stroke="#3a414d" stroke-width="4"/>
       <rect x="${x + 12}" y="${y + 12}" width="${w - 24}" height="${h - 24}" rx="8" fill="url(#sk_glass)" stroke="#223040" stroke-width="2"/>
       ${kind === 'radio' ? `<rect x="${x + w - 30}" y="${y - 46}" width="10" height="50" rx="4" fill="#2a2f38"/>` : ''}`;
  return `<g data-mount="hud"><g filter="url(#sk_drop)">${shell}</g>${head}${body}</g>`;
}

/**
 * A door set into a side wall, drawn in perspective: the near edge (x2) is
 * taller than the far edge (x1). Closed: planks, iron straps, a ring. Barred:
 * a beam across it. Open: a dark doorway with the leaf swung in. `label`
 * goes on a small plaque above the door.
 * @param {{x1:number, y1:number, h1:number, x2:number, y2:number, h2:number,
 *   open?: boolean, barred?: boolean, label?: string, labelColor?: string, material?: 'wood'|'iron'|'stone'}} o
 */
export function wallDoor(o) {
  const { x1, y1, h1, x2, y2, h2, open = false, barred = false, label = '', labelColor = '#d8c79c', material = 'wood' } = o;
  const quad = `M${x1} ${y1} L${x2} ${y2} L${x2} ${y2 + h2} L${x1} ${y1 + h1} Z`;
  /** @param {number} t @param {number} v @returns {[number, number]} */
  const at = (t, v) => [x1 + (x2 - x1) * t, (y1 + h1 * v) + ((y2 + h2 * v) - (y1 + h1 * v)) * t];
  const fill = material === 'iron' ? 'url(#sk_iron)' : material === 'stone' ? 'url(#sk_basalt)' : 'url(#sk_darkwood)';
  const midL = at(0, 0.5), midR = at(1, 0.5);
  let body;
  if (open) {
    body = `<path d="${quad}" fill="#030304"/>
      <path d="M${x2} ${y2} L${x2 + (x2 - x1) * 0.35} ${y2 - 10} L${x2 + (x2 - x1) * 0.35} ${y2 + h2 + 14} L${x2} ${y2 + h2} Z" fill="${fill}" stroke="#0b0703" stroke-width="3"/>`;
  } else {
    const straps = [0.18, 0.5, 0.82].map(v => { const [ax, ay] = at(0, v), [bx, by] = at(1, v); return `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="#1d1a16" stroke-width="7"/>`; }).join('');
    const planks = [0.25, 0.5, 0.75].map(t => { const [ax, ay] = at(t, 0), [bx, by] = at(t, 1); return `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="#000" stroke-opacity="0.35" stroke-width="3"/>`; }).join('');
    const [rx, ry] = at(0.2, 0.52);
    body = `<path d="${quad}" fill="${fill}" stroke="#0b0703" stroke-width="5"/>${planks}${straps}
      <circle cx="${rx}" cy="${ry}" r="${Math.max(6, h1 * 0.025)}" fill="none" stroke="#7d8494" stroke-width="3"/>
      ${barred ? `<line x1="${midL[0] - 14}" y1="${midL[1]}" x2="${midR[0] + 10}" y2="${midR[1]}" stroke="#5c5546" stroke-width="14" stroke-linecap="round"/>` : ''}`;
  }
  const plaque = label ? (() => {
    const [px, py] = at(0.5, 0);
    return `<rect x="${px - 60}" y="${py - 40}" width="120" height="26" rx="4" fill="url(#sk_brass)" stroke="#4f3b10" stroke-width="2"/>
      <text x="${px}" y="${py - 22}" text-anchor="middle" font-size="12" fill="#2a1d05" font-family="Palatino Linotype, Georgia, serif">${label}</text>`;
  })() : '';
  return `<g data-mount="wall">${body}<path d="${quad}" fill="none" stroke="#000" stroke-opacity="0.6" stroke-width="8"/>${plaque}${shadow((x1 + x2) / 2, Math.max(y1 + h1, y2 + h2), (x2 - x1) * 0.7, 9, 0.6)}</g>`;
}

/**
 * Where the player's own kit docks: the top-right corner of the frame, the same
 * in every duo and group game, so the partner channel is always in one place.
 */
export const DOCK = { x: 1296, y: 20, w: 288, h: 196 };

/**
 * Re-home a relay card (the code or rule your PARTNER needs) from the middle of
 * the room into the player's own kit, docked at the frame edge. `from` is the
 * card's original rectangle; its inner SVG (drawn in absolute coordinates) is
 * scaled and moved to fit the dock. The card's own background is replaced by
 * the device shell.
 * @param {{x:number,y:number,w:number,h:number}} from
 * @param {string} inner   the card's contents, without its old background rect
 * @param {{kind?: 'radio'|'notebook'|'tablet', title?: string}} [opts]
 */
export function dock(from, inner, opts = {}) {
  const D = DOCK;
  const pad = 14, top = opts.title ? 26 : 8;
  const k = Math.min((D.w - pad * 2) / from.w, (D.h - top - pad) / from.h, 1);
  const tx = D.x + (D.w - from.w * k) / 2 - from.x * k;
  const ty = D.y + top + (D.h - top - pad - from.h * k) / 2 - from.y * k;
  return kit({ ...D, kind: opts.kind || 'tablet', title: opts.title || '', body: `<g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${k.toFixed(3)})">${inner}</g>` });
}

/**
 * A puzzle-modal header cut from the room's own plate: the standard
 * .puzzle-hero band, zoomed in and centred on the scene point the puzzle is
 * about (the door, the scales, the dial), so a game without dedicated puzzle
 * art still opens each modal on the thing being worked.
 * @param {string} src   the plate image (as the page resolves it)
 * @param {{x:number, y:number}} [at]  scene coordinates (1600×900) to centre on
 * @param {number} [zoom]  how much wider than the band the plate is drawn
 */
export function plateHero(src, at = { x: 800, y: 450 }, zoom = 1.7) {
  const px = Math.min(100, Math.max(0, at.x / 16)).toFixed(1);
  const py = Math.min(100, Math.max(0, at.y / 9)).toFixed(1);
  return `<div class="puzzle-hero" style="background-image:url(${src}); background-size:${Math.round(zoom * 100)}% auto; background-position:${px}% ${py}%"></div>`;
}
