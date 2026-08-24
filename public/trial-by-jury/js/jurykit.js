// Shared SVG fragments + the cross-examination room factory for TRIAL BY JURY.
// Hand-authored procedural art (no external assets): an overgrown jungle
// tribunal in green stone and canopy light. buildRoom() stamps the standard
// four-witness scene for whatever witness this browser is: your own account
// (a lock), the detail your screen holds for the NEXT witness, an optional
// carved evidence-token to enter into the record, and a thing to examine.

import { getRole, roleName, nextName, ROLES, NEXT, PREV } from './role.js';

/* ---------- palette / defs ---------- */
export function defs(slug) {
  return `
    <linearGradient id="${slug}_canopy" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#122a17"/><stop offset="0.6" stop-color="#0d1f12"/><stop offset="1" stop-color="#08140b"/>
    </linearGradient>
    <linearGradient id="${slug}_ground" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#10190d"/><stop offset="1" stop-color="#070c06"/>
    </linearGradient>
    <linearGradient id="${slug}_stone" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#5a6b4a"/><stop offset="0.5" stop-color="#40503a"/><stop offset="1" stop-color="#2c3826"/>
    </linearGradient>
    <radialGradient id="${slug}_shaft" cx="0.5" cy="0.1" r="0.7">
      <stop offset="0" stop-color="rgba(210,240,150,0.22)"/><stop offset="1" stop-color="rgba(210,240,150,0)"/>
    </radialGradient>
    <radialGradient id="${slug}_glow" cx="0.5" cy="0.4" r="0.6">
      <stop offset="0" stop-color="rgba(230,200,90,0.30)"/><stop offset="1" stop-color="rgba(230,200,90,0)"/>
    </radialGradient>`;
}

/** Full-frame procedural backdrop: an overgrown jungle court in green light. */
export function backdrop(slug) {
  return `
    <rect x="0" y="0" width="1600" height="640" fill="url(#${slug}_canopy)"/>
    <rect x="0" y="600" width="1600" height="300" fill="url(#${slug}_ground)"/>
    <!-- light shafts through the canopy -->
    <polygon points="520,0 640,0 470,600 300,600" fill="url(#${slug}_shaft)"/>
    <polygon points="1000,0 1120,0 1260,600 1080,600" fill="url(#${slug}_shaft)"/>
    <!-- vine-wrapped stone pillars flanking the court -->
    <g fill="url(#${slug}_stone)" stroke="#0a1408" stroke-width="4">
      <rect x="70" y="120" width="90" height="500" rx="8"/>
      <rect x="1440" y="120" width="90" height="500" rx="8"/>
    </g>
    <g stroke="#2f5a2a" stroke-width="6" fill="none" opacity="0.6" stroke-linecap="round">
      <path d="M115 130 q-30 90 6 180 q30 80 -6 170"/>
      <path d="M1485 130 q30 90 -6 180 q-30 80 6 170"/>
    </g>
    <ellipse cx="800" cy="150" rx="520" ry="150" fill="url(#${slug}_glow)" opacity="0.5"/>`;
}

/** Witness-identity tag, top-centre (clear of the top-left Gus reserve). */
export function roleTag() {
  const r = ROLES[getRole()];
  return `
    <g font-family="Georgia, serif" text-anchor="middle" paint-order="stroke" stroke="#08140b" stroke-linejoin="round">
      <text x="800" y="46" font-size="24" fill="#e6d16a" letter-spacing="3" stroke-width="5">${r.name.toUpperCase()}</text>
      <text x="800" y="70" font-size="14" fill="#a9c98f" letter-spacing="2" opacity="0.9" stroke-width="4" font-family="Consolas, monospace">${r.station}</text>
    </g>`;
}

/**
 * A K-slot combination lock (digits 0-9 or letters A-Z). Your slot values must
 * match the figure the witness before you reads off their screen.
 * opts: { id, title, desc, slots, target, goLabel?, solvedMsg, failMsg?, onSolve?(game) }
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
        <div class="puzzle-row"><button class="btn btn-primary" id="cl-go">${opts.goLabel || 'Enter It'}</button></div>
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
          api.fail(opts.failMsg || 'The court murmurs — that is not what the record shows. Cross-check with the witness who holds it.');
        }
      });
    },
  });
}

/** Journal card for a carved evidence-token (position + letter). */
export function evidenceCard(e) {
  const pos = e.sun.rays, letter = e.sun.letter;
  return `<svg viewBox="0 0 80 92" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="12" width="44" height="52" rx="6" fill="#3a2f18" stroke="#8a6f34" stroke-width="2.5"/>
      <rect x="24" y="18" width="32" height="40" rx="3" fill="none" stroke="#5f4d24" stroke-width="1.4"/>
      <text x="40" y="50" text-anchor="middle" font-size="26" fill="#e6d16a"
        font-family="Georgia, serif" font-weight="bold">${letter}</text>
      <text x="40" y="82" text-anchor="middle" font-size="18" fill="#cbe0a8"
        font-family="Consolas, monospace">#${pos}</text>
    </svg>
    <div class="journal-sun-cap">exhibit ${pos} &middot; "${letter}"</div>`;
}

/* ---------- the standard cross-examination scene ---------- */

const dialFlags = (slug) => [`${slug}_d0`, `${slug}_d1`, `${slug}_d2`];

function lockSvg(slug, open, label, state) {
  if (open) {
    return `<g>
      <rect x="620" y="600" width="360" height="210" rx="12" fill="#0a1408" stroke="#2f5a2a" stroke-width="6"/>
      <text x="800" y="712" text-anchor="middle" font-size="20" fill="#9fe08a"
        font-family="Georgia, serif" class="flicker">${label} — SWORN</text>
    </g>`;
  }
  const d = dialFlags(slug).map(k => state.flags[k] ?? 0);
  return `<g text-anchor="middle">
    <rect x="620" y="600" width="360" height="210" rx="12" fill="rgba(20,34,18,0.92)" stroke="#40503a" stroke-width="6"/>
    <text x="800" y="648" font-size="15" fill="#a9c98f" font-family="Consolas, monospace">${label}</text>
    ${[0, 1, 2].map(i => `
      <circle cx="${700 + i * 100}" cy="720" r="40" fill="#10190d" stroke="#8a6f34" stroke-width="4"/>
      <text x="${700 + i * 100}" y="732" font-size="34" fill="#e6d16a" font-family="Consolas, monospace">${d[i]}</text>`).join('')}
  </g>`;
}

function defaultHints(cfg, role) {
  return [
    { text: "Your own account has a gap the court can see. The missing figure is not on your screen — it is with another witness. Work out which.", cost: 60 },
    { text: `${roleName(PREV[role])} saw the part you missed; you hold the part ${nextName(role)} missed. Trade — read them theirs, and enter what they read you.`, cost: 120 },
    { text: `The figure your account needs is ${cfg.codes[role].split('').join(' - ')}.`, cost: 240 },
  ];
}

/**
 * Stamp out a standard cross-examination room for the current witness.
 * cfg: {
 *   id, slug, lockLabel,
 *   titleFor(role)->str, introFor(role)->str,
 *   codes: { p1,p2,p3,p4 }              // each witness's own figure (string)
 *   tokens: { p1?:{pos,letter}, ... }   // witnesses who log an exhibit here
 *   loreFor(role)->{title, html, label?},
 *   hints?(role)->[{text,cost},...]
 * }
 */
export function buildRoom(cfg) {
  const { id, slug } = cfg;
  const tokenId = (role) => `${slug}_ex_${role}`;
  const isOpen = (state) => !!state.flags[`${slug}_open`];

  return {
    id,
    get title() { return cfg.titleFor(getRole()); },
    get intro() { return cfg.introFor(getRole()); },

    scene(state) {
      const role = getRole();
      const open = isOpen(state);
      const relayCode = cfg.codes[NEXT[role]];
      const relayFor = nextName(role);
      const token = cfg.tokens && cfg.tokens[role];
      const showToken = token && !state.journal.some(e => e.id === tokenId(role));

      return `
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>${defs(slug)}</defs>
        ${backdrop(slug)}
        ${roleTag()}

        <!-- RELAY: your screen holds the figure that completes ${relayFor}'s account -->
        <g>
          <rect x="556" y="150" width="488" height="176" rx="10" fill="rgba(10,20,11,0.9)" stroke="#8a6f34" stroke-width="3"/>
          <text x="800" y="192" text-anchor="middle" font-size="16" fill="#a9c98f"
            font-family="Consolas, monospace" letter-spacing="2">${relayFor.toUpperCase()} — MISSING FIGURE</text>
          <text x="800" y="256" text-anchor="middle" font-size="46" fill="#e6d16a"
            font-family="Consolas, monospace" letter-spacing="10">${relayCode.split('').join(' ')}</text>
          <text x="800" y="300" text-anchor="middle" font-size="13" fill="#7f9a72"
            font-family="Consolas, monospace">read this to that witness</text>
        </g>

        ${lockSvg(slug, open, cfg.lockLabel, state)}

        <!-- something to examine, right side -->
        <g>
          <rect x="1180" y="360" width="300" height="150" rx="8" fill="#152413" stroke="#40503a" stroke-width="4"/>
          <circle cx="1330" cy="425" r="26" fill="url(#${slug}_glow)"/>
          <text x="1330" y="495" text-anchor="middle" font-size="13" fill="#a9c98f" font-family="Consolas, monospace">examine</text>
        </g>

        ${showToken ? `
        <g class="beckon">
          <rect x="272" y="612" width="56" height="66" rx="6" fill="#3a2f18" stroke="#8a6f34" stroke-width="4"/>
          <circle cx="300" cy="645" r="46" fill="rgba(230,200,90,0.10)"/>
          <text x="300" y="655" text-anchor="middle" font-size="24" fill="#e6d16a" font-family="Georgia, serif" font-weight="bold">${token.letter}</text>
          <text x="300" y="702" text-anchor="middle" font-size="13" fill="#cbe0a8" font-family="Georgia, serif">carved tag</text>
        </g>` : ''}
      </svg>`;
    },

    hotspots(state) {
      const role = getRole();
      const spots = [];
      const open = isOpen(state);
      const relayCode = cfg.codes[NEXT[role]];
      const relayFor = nextName(role);

      spots.push({
        id: 'relay', x: 556, y: 150, w: 488, h: 176, label: `The figure ${relayFor}'s account is missing`,
        onInteract(game) {
          const html = `<div class="chartcard"><div class="chart-title">${relayFor} — missing figure</div>
            <p>Plain on your side of the night, and nowhere on theirs:</p>
            <p style="font-size:30px;letter-spacing:8px;color:#f2ffe0;text-align:center;">${relayCode.split('').join(' · ')}</p></div>
            <div class="relay">This completes <strong>${relayFor}'s</strong> account, not yours. Read it across to them.</div>`;
          game.journal.add(`${slug}_relay`, { title: `${relayFor}'s missing figure`, category: 'note', html });
          game.dialog({ title: `Cross-examine ${relayFor}`, html });
        },
      });

      const lore = cfg.loreFor(role);
      spots.push({
        id: 'lore', x: 1180, y: 360, w: 300, h: 150, label: lore.label || 'Examine',
        onInteract(game) {
          game.journal.add(`${slug}_lore`, { title: lore.title, category: 'note', html: lore.html });
          game.dialog({ title: lore.title, html: lore.html });
        },
      });

      const token = cfg.tokens && cfg.tokens[role];
      if (token && !state.journal.some(e => e.id === tokenId(role))) {
        spots.push({
          id: 'token', x: 250, y: 600, w: 110, h: 120, label: 'A carved evidence-tag',
          onInteract(game) {
            game.journal.add(tokenId(role), { title: `Exhibit #${token.pos}`, category: 'sun', sun: { rays: token.pos, letter: token.letter } });
            game.say(`A tag carved from fig-wood, marked #${token.pos} and the letter ${token.letter}. Four such exhibits name the true thief — enter them in order at the verdict.`);
            game.refreshScene();
          },
        });
      }

      if (!open) {
        spots.push({
          id: 'lock', x: 620, y: 600, w: 360, h: 210, label: `${cfg.lockLabel} — three figures`,
          onInteract(game) {
            const holder = roleName(PREV[role]);
            comboLock(game, {
              id: `${slug}_lock`,
              title: cfg.lockLabel,
              desc: `Three figures. The detail your account is missing is <em>not</em> on your screen &mdash; only <strong>${holder}</strong> saw it. Ask them what their screen says your account needs.`,
              slots: [{ type: 'digit' }, { type: 'digit' }, { type: 'digit' }],
              target: cfg.codes[role],
              goLabel: 'Swear It',
              solvedMsg: cfg.solvedMsg || 'The record squares. The court moves on.',
              onSolve(g) { g.setFlag(`${slug}_open`); g.refreshScene(); },
            });
          },
        });
      } else {
        spots.push({
          id: 'through', x: 620, y: 600, w: 360, h: 210, label: 'Call the next witness',
          onInteract(game) {
            if (token && !state.journal.some(e => e.id === tokenId(role))) {
              game.say('Enter the carved tag on your left into the record before the court moves on — the verdict will want all four.');
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
