// Shared SVG fragments + puzzle helpers for DEEP SIX. Two visual worlds keyed to
// the role: The Diver sees the photoreal flooded wreck (video backdrop); The
// Tender sees the photoreal boat cabin — sonar scope, instrument shelf, and a
// porthole onto the night sea. Every id/keyframe is prefixed by a per-scene slug.

import { isDiver, isTender, roleName } from './role.js';
import { kitDefs, dock, DOCK, panel } from '../../shared/js/scenekit.js';

export { DOCK };

// Photoreal diver backdrops live in <game>/art/<slug>.{webp,mp4}; resolve against
// this module's URL so they work on Pages/Vercel/localhost alike.
export const ART = new URL('../art/', import.meta.url).href;

/** Common gradient + keyframe defs. Call once inside <defs>. */
export function defs(slug) {
  return `${kitDefs()}
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

/** The Tender's boat-cabin backdrop: a photoreal salvage-cabin plate (riveted
 *  bulkhead, brass pipes, a dressed instrument shelf), with the PPI sonar scope
 *  and the night-sea porthole dropped in as photoreal cut-outs. The scope keeps
 *  its live sweep + glow as an SVG overlay so it still reads as a running set.
 *  Shared by all tender scenes; every element sits clear of the tender hotspots
 *  (relay 556-1044/y138-322, lock 620-980, gauges/mark/lore 1108-1454). */
function tenderBackdrop(slug) {
  return `
    <image href="${ART}tender-cabin.webp" x="0" y="0" width="1600" height="900" preserveAspectRatio="xMidYMid slice"/>
    <!-- the sonar scope: photoreal bezel, with the live sweep + glow on top -->
    <g>
      <image href="${ART}ppi.webp" x="190" y="219" width="340" height="321" preserveAspectRatio="xMidYMid meet"/>
      <circle cx="360" cy="380" r="116" fill="url(#${slug}_sonar)"/>
      <line x1="360" y1="380" x2="360" y2="270" stroke="#7cf0be" stroke-width="2.5" opacity="0.5" class="${slug}_sw"/>
    </g>
    <!-- porthole onto the black night sea, upper right -->
    <image href="${ART}porthole.webp" x="1165" y="132" width="330" height="336" preserveAspectRatio="xMidYMid meet"/>`;
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

/** The cross-screen relay: the reading THIS screen holds for the partner. It is
 *  not part of the wreck or the cabin — it is on your own dive slate (diver) or
 *  radio log (tender), docked at the frame edge. Hotspot: DOCK. */
export function relayPlaque(code, label) {
  const from = { x: 556, y: 138, w: 488, h: 184 };
  return dock(from, `
    <text x="800" y="180" text-anchor="middle" font-size="16" fill="#9fc7dd"
      font-family="Consolas, monospace" letter-spacing="2">${label}</text>
    <text x="800" y="252" text-anchor="middle" font-size="46" fill="#e8c85a"
      font-family="Consolas, monospace" letter-spacing="8">${code}</text>
    <text x="800" y="298" text-anchor="middle" font-size="13" fill="#9fb0c4"
      font-family="Consolas, monospace">read this to your partner</text>`,
    { kind: isDiver() ? 'tablet' : 'radio', title: isDiver() ? 'DIVE SLATE' : 'RADIO LOG' });
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
    <text x="${x + 46}" y="${y + 75}" text-anchor="middle" font-size="11.5" fill="#3a2f12"
      font-family="Consolas, monospace" letter-spacing="1">FATHOMS</text>
    <text x="${x + 46}" y="${y + 101}" text-anchor="middle" font-size="22" fill="#241c08"
      font-family="Georgia, serif" paint-order="stroke" stroke="#d8c98a" stroke-width="0.8">${letter}</text>
  </g>`;
}

/** A lock, bolted to the hull plating (diver) or the cabin bulkhead (tender);
 *  shows the RELEASED state when open, else the given contents. */
export function lockPanel(x, y, open, label, contents) {
  return panel({ x, y, w: 360, h: 196, material: 'steel', mount: 'bolts', rx: 12, body: `
    <rect x="${x + 10}" y="${y + 10}" width="340" height="176" rx="8" fill="${open ? '#04090c' : '#08161c'}"/>
    ${open
      ? `<text x="${x + 180}" y="${y + 108}" text-anchor="middle" font-size="20" fill="#7cf0be"
           font-family="Consolas, monospace" class="flicker">${label} — RELEASED</text>`
      : contents}` });
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
        <div class="puzzle-hero" style="background-image:url(art/pz-lock.webp)"></div>
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
          // The Tender's instruments answer with a sonar chirp; the Diver's
          // physical locks give the mechanical unlock.
          game.playSfx(opts.solveSfx || (isTender() ? 'sonar' : 'unlock'));
          api.solved({ message: opts.solvedMsg });
          if (opts.onSolve) opts.onSolve(game);
        } else {
          api.fail(opts.failMsg || 'That is not it — check the reading with your partner.');
        }
      });
    },
  });
}

/*
 * What each lore hotspot is about, drawn where it sits. The diver's lore spot
 * is always the patch of wreck at 240,410 (250×190), the tender's the end of
 * the equipment table at 1214,470 (240×150); each thing is mounted on what is
 * there — the hull rail, the silt, the stokehold deck, the table.
 */
const LORE_AT = { diver: { x: 240, y: 410, w: 250, h: 190 }, tender: { x: 1214, y: 470, w: 240, h: 150 } };
// The diver's lore props sit in the murky water, so they take the water's colour.
const MURK = `<filter id="dv_murk" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.5 0.12 0.06 0 0  0.08 0.58 0.16 0 0.03  0.08 0.16 0.52 0 0.05  0 0 0 1 0"/></filter>`;
export function loreArt(id) {
  const art = loreBody(id);
  return art && !/^lore_(brief|manifest|log)$/.test(id) ? `<g filter="url(#dv_murk)">${MURK}${art}</g>` : art;
}
function loreBody(id) {
  const D = LORE_AT.diver, T = LORE_AT.tender;
  const sh = (cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${Math.max(6, rx * 0.16)}" fill="#000" opacity="0.5"/>`;
  switch (id) {
    case 'lore_hull':   // the ship's nameplate, torn from the rail and propped on the deck
      return panel({ x: D.x + 38, y: D.y + 96, w: 180, h: 68, material: 'brass', mount: 'table', tilt: -7, body: `
        <text x="${D.x + 128}" y="${D.y + 137}" text-anchor="middle" font-size="20" fill="#2a1d05" font-family="Georgia, serif" letter-spacing="2" transform="rotate(-7 ${D.x + 128} ${D.y + 130})">CORMORANT</text>
        <rect data-fx="verdigris" x="${D.x + 38}" y="${D.y + 96}" width="180" height="68" rx="6" fill="#3f8f78" opacity="0.35" transform="rotate(-7 ${D.x + 128} ${D.y + 130})"/>
        ${[[54, 106], [200, 112], [62, 150]].map(([dx, dy]) => `<circle cx="${D.x + dx}" cy="${D.y + dy}" r="5" fill="#c9c0a8" opacity="0.7"/>`).join('')}` });
    case 'lore_effects':   // a passenger's case, half sunk in the silt
      return `<g data-mount="floor">${sh(D.x + 125, D.y + 168, 100)}
        <rect x="${D.x + 55}" y="${D.y + 96}" width="140" height="70" rx="8" fill="#4a3320" stroke="#1c120a" stroke-width="3" transform="rotate(-8 ${D.x + 125} ${D.y + 130})"/>
        <rect x="${D.x + 60}" y="${D.y + 104}" width="130" height="10" fill="#b08a3e" opacity="0.8" transform="rotate(-8 ${D.x + 125} ${D.y + 130})"/>
        <path d="M${D.x} ${D.y + 184} Q${D.x + 60} ${D.y + 128} ${D.x + 125} ${D.y + 150} Q${D.x + 190} ${D.y + 132} ${D.x + 250} ${D.y + 186} Z" fill="#3b4636" opacity="0.6"/>
        <path d="M${D.x + 20} ${D.y + 186} Q${D.x + 70} ${D.y + 146} ${D.x + 125} ${D.y + 160} Q${D.x + 180} ${D.y + 148} ${D.x + 232} ${D.y + 188} Z" fill="#46523f" opacity="0.85"/>
      </g>`;
    case 'lore_stokers':   // the stokers' post: a shovel against the bunker, a coal scuttle
      return `<g data-mount="floor">${sh(D.x + 125, D.y + 180, 110)}
        <path d="M${D.x + 60} ${D.y + 180} L${D.x + 92} ${D.y + 40}" stroke="#3a2818" stroke-width="9" stroke-linecap="round"/>
        <path d="M${D.x + 40} ${D.y + 182} L${D.x + 86} ${D.y + 182} L${D.x + 80} ${D.y + 140} L${D.x + 48} ${D.y + 140} Z" fill="url(#sk_iron)" stroke="#0c0f13" stroke-width="2"/>
        <path d="M${D.x + 120} ${D.y + 180} L${D.x + 220} ${D.y + 180} L${D.x + 206} ${D.y + 110} L${D.x + 134} ${D.y + 110} Z" fill="url(#sk_iron)" stroke="#0c0f13" stroke-width="3"/>
        <ellipse cx="${D.x + 170}" cy="${D.y + 112}" rx="38" ry="9" fill="#141414"/>
        ${[0, 1, 2, 3].map(i => `<circle cx="${D.x + 150 + i * 13}" cy="${D.y + 108 - (i % 2) * 4}" r="7" fill="#1e1e1e"/>`).join('')}
      </g>`;
    case 'lore_lastmsg':   // the outgoing message pad, clipped to its board on the ledge
      return panel({ x: D.x + 50, y: D.y + 40, w: 150, h: 126, material: 'paper', mount: 'table', tilt: -6, body: `
        <rect x="${D.x + 100}" y="${D.y + 34}" width="50" height="14" rx="3" fill="url(#sk_steel)" transform="rotate(-6 ${D.x + 125} ${D.y + 103})"/>
        <text x="${D.x + 125}" y="${D.y + 76}" text-anchor="middle" font-size="15" fill="#3a2f12" font-family="Consolas, monospace" transform="rotate(-6 ${D.x + 125} ${D.y + 103})">OUTGOING</text>
        ${[0, 1, 2, 3].map(i => `<line x1="${D.x + 66}" y1="${D.y + 96 + i * 16}" x2="${D.x + 184 - (i % 2) * 30}" y2="${D.y + 96 + i * 16}" stroke="#6b5a3a" stroke-width="2" transform="rotate(-6 ${D.x + 125} ${D.y + 103})"/>`).join('')}` });
    case 'lore_brief':   // the salvage brief, in its folder on the table
    case 'lore_manifest':   // the passenger manifest, a ledger open on the table
    case 'lore_log': {   // the captain's log, closed on the table
      const title = { lore_brief: 'SALVAGE BRIEF', lore_manifest: 'MANIFEST', lore_log: 'LOG' }[id];
      const mat = id === 'lore_log' ? 'darkwood' : id === 'lore_brief' ? 'parchment' : 'paper';
      return panel({ x: T.x + 30, y: T.y + 40, w: 180, h: 96, material: mat, mount: 'table', tilt: -4, body: `
        <text x="${T.x + 120}" y="${T.y + 94}" text-anchor="middle" font-size="16" fill="${id === 'lore_log' ? '#e8d9b0' : '#3a2f12'}" font-family="Georgia, serif" letter-spacing="2" transform="rotate(-4 ${T.x + 120} ${T.y + 88})">${title}</text>
        ${id === 'lore_manifest' ? `<line x1="${T.x + 120}" y1="${T.y + 44}" x2="${T.x + 120}" y2="${T.y + 132}" stroke="#8a7446" stroke-width="2" transform="rotate(-4 ${T.x + 120} ${T.y + 88})"/>` : ''}` });
    }
    default:
      return '';
  }
}
