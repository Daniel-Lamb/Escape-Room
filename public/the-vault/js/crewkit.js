// Shared SVG fragments + the cross-read room factory for THE VAULT.
// Hand-authored procedural art (no external assets): a cool steel-and-brass
// bank interior, keyed per scene by a slug so ids never collide. buildRoom()
// stamps out the standard four-handed scene for whatever role this browser is:
// your own lock, the relay panel that holds the NEXT crewmate's code, an
// optional tumbler-chip to pocket, and a thing to examine.

import { getRole, roleName, nextName, ROLES, NEXT, PREV } from './role.js';

// Photoreal plates live in <game>/art/<slug>.webp; resolve against this
// module's URL so they load under Pages/Vercel/localhost alike.
const ART = new URL('../art/', import.meta.url).href;
export function art(file) { return `${ART}${file}`; }

/* ---------- palette / defs ---------- */
export function defs(slug) {
  return `
    <linearGradient id="${slug}_wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1b2330"/><stop offset="0.6" stop-color="#121821"/><stop offset="1" stop-color="#0b0f16"/>
    </linearGradient>
    <linearGradient id="${slug}_floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0e131b"/><stop offset="1" stop-color="#05070b"/>
    </linearGradient>
    <linearGradient id="${slug}_steel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#3a4656"/><stop offset="0.5" stop-color="#586878"/><stop offset="1" stop-color="#2b3547"/>
    </linearGradient>
    <radialGradient id="${slug}_glow" cx="0.5" cy="0.4" r="0.6">
      <stop offset="0" stop-color="rgba(120,240,190,0.22)"/><stop offset="1" stop-color="rgba(120,240,190,0)"/>
    </radialGradient>
    <radialGradient id="${slug}_amber" cx="0.5" cy="0.4" r="0.6">
      <stop offset="0" stop-color="rgba(255,206,120,0.30)"/><stop offset="1" stop-color="rgba(255,206,120,0)"/>
    </radialGradient>`;
}

/** Full-frame photoreal plate + a soft work-lamp bloom (kept for warmth). */
export function backdrop(slug) {
  return `
    <image href="${ART}${slug}.webp" x="0" y="0" width="1600" height="900" preserveAspectRatio="xMidYMid slice"/>
    <ellipse cx="800" cy="150" rx="520" ry="150" fill="url(#${slug}_amber)" opacity="0.3"/>`;
}

/** Role-identity tag, top-centre (clear of the top-left Gus reserve). */
export function roleTag() {
  const r = ROLES[getRole()];
  return `
    <g font-family="Consolas, monospace" text-anchor="middle" paint-order="stroke" stroke="#05070b" stroke-linejoin="round">
      <text x="800" y="46" font-size="24" fill="#7cf0be" letter-spacing="5" stroke-width="5">${r.name.toUpperCase()}</text>
      <text x="800" y="70" font-size="14" fill="#8fb6c4" letter-spacing="3" opacity="0.85" stroke-width="4">${r.station.toUpperCase()}</text>
    </g>`;
}

/**
 * A K-slot combination lock (digits 0-9 or letters A-Z). Your slot values must
 * match the code your crewmate reads off their screen.
 * opts: { id, title, desc, slots:[{type:'digit'|'letter', label?}], target,
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
          api.fail(opts.failMsg || 'It holds. That is not your code — check with the crewmate who holds it.');
        }
      });
    },
  });
}

/** Journal card for a brass tumbler-chip collectible (position + digit). */
export function chipCard(e) {
  const pos = e.sun.rays, digit = e.sun.letter;
  return `<svg viewBox="0 0 80 92" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="38" r="26" fill="#241c08" stroke="#c9a227" stroke-width="2.5"/>
      <circle cx="40" cy="38" r="20" fill="none" stroke="#7a5f18" stroke-width="1.4"/>
      <text x="40" y="48" text-anchor="middle" font-size="26" fill="#e8c85a"
        font-family="Consolas, monospace" font-weight="bold">${digit}</text>
      <text x="40" y="82" text-anchor="middle" font-size="20" fill="#e8dcc0"
        font-family="Georgia, serif">#${pos}</text>
    </svg>
    <div class="journal-sun-cap">tumbler ${pos} &middot; "${digit}"</div>`;
}

/* ---------- the standard cross-read scene ---------- */

// Default three-tier hints for a cross-read lock, if a room doesn't override.
function defaultHints(cfg, role) {
  return [
    { text: "Your lock's code is written nowhere on your own screen — it is on a crewmate's. Work out whose, and ask them.", cost: 60 },
    { text: `${roleName(PREV[role])} holds your code; you hold ${nextName(role)}'s. Trade — read them theirs, and set your dials to what they read you.`, cost: 120 },
    { text: `Your ${cfg.lockLabel} code is ${cfg.codes[role].split('').join(' - ')}.`, cost: 240 },
  ];
}

function lockSvg(slug, open, label) {
  if (open) {
    return `<g>
      <rect x="620" y="600" width="360" height="210" rx="12" fill="#05070d" stroke="#123a2c" stroke-width="6"/>
      <text x="800" y="712" text-anchor="middle" font-size="20" fill="#7cf0be"
        font-family="Consolas, monospace" class="flicker">${label} — OPEN</text>
    </g>`;
  }
  // Photoreal brass combination panel; the engraved name-plate carries the label.
  // (The dials on the plate are decorative — the real code is set in the modal.)
  return `<g font-family="Consolas, monospace" text-anchor="middle">
    <image href="${art('lock-panel.webp')}" x="620" y="600" width="360" height="210" preserveAspectRatio="xMidYMid meet"/>
    <text x="800" y="666" font-size="14" fill="#241c08" letter-spacing="1">${label}</text>
  </g>`;
}

/**
 * Stamp out a standard cross-read room for the current role.
 * cfg: {
 *   id, slug, lockLabel,
 *   titleFor(role)->str, introFor(role)->str,
 *   codes: { p1,p2,p3,p4 }  // each role's own 3-digit lock answer (string)
 *   relayName(role)->str,   // display name of whose code THIS screen shows (== nextName by default)
 *   chips: { p1?:{pos,digit}, ... }  // roles that pocket a chip in this scene
 *   loreFor(role)->{title, html},
 *   hints(role)->[{text,cost},...]
 * }
 */
export function buildRoom(cfg) {
  const { id, slug } = cfg;
  const chipId = (role) => `${slug}_chip_${role}`;
  const isOpen = (state) => !!state.flags[`${slug}_open`];
  const myChip = () => cfg.chips && cfg.chips[getRole()];
  const hasChip = (state) => state.journal.some(e => e.id === chipId(getRole()));

  return {
    id,
    get title() { return cfg.titleFor(getRole()); },
    get intro() { return cfg.introFor(getRole()); },

    scene(state) {
      const role = getRole();
      const open = isOpen(state);
      const relayCode = cfg.codes[NEXT[role]];
      const relayFor = cfg.relayName ? cfg.relayName(role) : nextName(role);
      const chip = myChip();
      const showChip = chip && !hasChip(state);

      return `
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>${defs(slug)}</defs>
        ${backdrop(slug)}
        ${roleTag()}

        <!-- RELAY: your screen holds the code that opens ${relayFor}'s lock -->
        <g>
          <rect x="556" y="150" width="488" height="176" rx="10" fill="rgba(6,12,18,0.9)" stroke="#c9a227" stroke-width="3"/>
          <text x="800" y="192" text-anchor="middle" font-size="16" fill="#9fc7dd"
            font-family="Consolas, monospace" letter-spacing="2">${relayFor.toUpperCase()} — LOCK CODE</text>
          <text x="800" y="256" text-anchor="middle" font-size="46" fill="#e8c85a"
            font-family="Consolas, monospace" letter-spacing="10">${relayCode.split('').join(' ')}</text>
          <text x="800" y="300" text-anchor="middle" font-size="13" fill="#7f8a99"
            font-family="Consolas, monospace">read this to your crewmate</text>
        </g>

        ${lockSvg(slug, open, cfg.lockLabel, state)}

        <!-- something to examine, right side -->
        <g>
          <rect x="1180" y="360" width="300" height="150" rx="8" fill="#141c26" stroke="#2b3547" stroke-width="4"/>
          <rect x="1200" y="380" width="260" height="90" rx="4" fill="#0a1622"/>
          <circle cx="1330" cy="425" r="26" fill="url(#${slug}_glow)"/>
          <text x="1330" y="495" text-anchor="middle" font-size="13" fill="#8fb6c4" font-family="Consolas, monospace">examine</text>
        </g>

        ${showChip ? `
        <g class="beckon">
          <circle cx="300" cy="640" r="30" fill="#241c08" stroke="#c9a227" stroke-width="4"/>
          <circle cx="300" cy="640" r="46" fill="rgba(201,162,39,0.10)"/>
          <text x="300" y="650" text-anchor="middle" font-size="24" fill="#e8c85a" font-family="Consolas, monospace" font-weight="bold">${chip.digit}</text>
          <text x="300" y="700" text-anchor="middle" font-size="13" fill="#e8dcc0" font-family="Georgia, serif">brass chip</text>
        </g>` : ''}
      </svg>`;
    },

    hotspots(state) {
      const role = getRole();
      const spots = [];
      const open = isOpen(state);
      const relayCode = cfg.codes[NEXT[role]];
      const relayFor = cfg.relayName ? cfg.relayName(role) : nextName(role);

      spots.push({
        id: 'relay', x: 556, y: 150, w: 488, h: 176, label: `${relayFor}'s lock code (for your crewmate)`,
        onInteract(game) {
          const html = `<div class="chartcard"><div class="chart-title">${relayFor} — lock code</div>
            <p>On your screen, meant for their lock:</p>
            <p style="font-size:30px;letter-spacing:8px;color:#eafffb;text-align:center;">${relayCode.split('').join(' · ')}</p></div>
            <div class="relay">This is <strong>your crewmate's</strong> code, not yours. Read it across to them.</div>`;
          game.journal.add(`${slug}_relay`, { title: `${relayFor}'s code`, category: 'note', html });
          game.dialog({ title: `${relayFor}'s Lock`, html });
        },
      });

      const lore = cfg.loreFor(role);
      spots.push({
        id: 'lore', x: 1180, y: 360, w: 300, h: 150, label: lore.label || 'Take a look',
        onInteract(game) {
          game.journal.add(`${slug}_lore`, { title: lore.title, category: 'note', html: lore.html });
          game.dialog({ title: lore.title, html: lore.html });
        },
      });

      const chip = cfg.chips && cfg.chips[role];
      if (chip && !state.journal.some(e => e.id === chipId(role))) {
        spots.push({
          id: 'chip', x: 250, y: 590, w: 110, h: 120, label: 'A brass tumbler-chip',
          onInteract(game) {
            game.journal.add(chipId(role), { title: `Tumbler-chip #${chip.pos}`, category: 'sun', sun: { rays: chip.pos, letter: chip.digit } });
            game.say(`A brass tumbler-chip, stamped #${chip.pos} and the number ${chip.digit}. Six of them set the vault's own combination — pool them at the end, in order.`);
            game.refreshScene();
          },
        });
      }

      if (!open) {
        spots.push({
          id: 'lock', x: 620, y: 600, w: 360, h: 210, label: `${cfg.lockLabel} — three dials`,
          onInteract(game) {
            const holder = roleName(PREV[role]);
            comboLock(game, {
              id: `${slug}_lock`,
              title: cfg.lockLabel,
              desc: `Three dials, 0&ndash;9. Your code is <em>not</em> on your screen &mdash; it is on <strong>${holder}</strong>'s. Ask them what their screen says about your lock.`,
              slots: [{ type: 'digit' }, { type: 'digit' }, { type: 'digit' }],
              target: cfg.codes[role],
              goLabel: 'Throw It',
              solvedMsg: cfg.solvedMsg || 'The bolt drops. Your crewmate\'s voice was the key.',
              onSolve(g) { g.setFlag(`${slug}_open`); g.refreshScene(); },
            });
          },
        });
      } else {
        spots.push({
          id: 'through', x: 620, y: 600, w: 360, h: 210, label: 'Move up',
          onInteract(game) {
            if (chip && !state.journal.some(e => e.id === chipId(role))) {
              game.say('Pocket the brass chip on your left before you move — the vault will want all six.');
              return;
            }
            game.completeRoom({ delay: 600 });
          },
        });
      }

      return spots;
    },

    hintContext() { return getRole(); },
    hints() { return cfg.hints ? cfg.hints(getRole()) : defaultHints(cfg, getRole()); },
  };
}
