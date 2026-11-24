// Shared SVG fragments + the cross-read room factory for THE VAULT.
// Hand-authored procedural art (no external assets): a cool steel-and-brass
// bank interior, keyed per scene by a slug so ids never collide. buildRoom()
// stamps out the standard four-handed scene for whatever role this browser is:
// your own lock, the relay panel that holds the NEXT crewmate's code, an
// optional tumbler-chip to pocket, and a thing to examine.

import { getRole, roleName, nextName, ROLES, NEXT, PREV } from './role.js';
import { kitDefs, dock, DOCK, panel, shadow } from '../../shared/js/scenekit.js';

/* ---------- split knowledge: serial plate (yours) x rule (a crewmate's) ----------
 * No lock code is ever shown whole. Each station has a serial stamped on its
 * own plate; the RULE that turns that serial into the code is on the previous
 * crewmate's screen. Neither half opens anything alone. The rule rotates by
 * room and role so no two crewmates work the same way in the same scene. */
export const RULES = {
  reverse: { text: 'read the figures on your serial plate BACKWARDS', inverse: d => [...d].reverse().join('') },
  plus1:   { text: 'add ONE to every figure on your serial plate (9 turns to 0)', inverse: d => [...d].map(c => (Number(c) + 9) % 10).join('') },
  swap:    { text: 'SWAP the first and last figures of your serial plate', inverse: d => d[2] + d[1] + d[0] },
  minus1:  { text: 'take ONE from every figure on your serial plate (0 turns to 9)', inverse: d => [...d].map(c => (Number(c) + 1) % 10).join('') },
};
const RULE_ORDER = ['reverse', 'plus1', 'swap', 'minus1'];
export function ruleFor(roomIndex, role) {
  const i = (roomIndex + ['p1', 'p2', 'p3', 'p4'].indexOf(role)) % RULE_ORDER.length;
  return RULE_ORDER[i];
}
/** The serial stamped at a station: the code run backwards through its rule. */
export function serialFor(code, rule) {
  const d = RULES[rule].inverse(code);
  return d === code ? RULES.plus1.inverse(code) : d;
}
function effectiveRule(code, rule) { return RULES[rule].inverse(code) === code ? 'plus1' : rule; }

// Photoreal plates live in <game>/art/<slug>.webp; resolve against this
// module's URL so they load under Pages/Vercel/localhost alike.
const ART = new URL('../art/', import.meta.url).href;
export function art(file) { return `${ART}${file}`; }

/* ---------- palette / defs ---------- */
export function defs(slug) {
  return `${kitDefs()}
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
    { text: `Your lock's code is not written anywhere whole. Half of it is the serial stamped on YOUR lock; the other half — what to do with it — is on ${roleName(PREV[role])}'s screen.`, cost: 60 },
    { text: `Read ${roleName(PREV[role])} nothing; ask them for your rule. Their screen says: "${RULES[cfg.ruleOf(role)].text}". Apply it to your serial plate.`, cost: 120 },
    { text: `Your ${cfg.lockLabel} code is ${cfg.codes[role].split('').join(' - ')}.`, cost: 240 },
  ];
}

function lockSvg(slug, open, label, serial) {
  if (open) {
    return panel({ x: 620, y: 600, w: 360, h: 210, material: 'steel', mount: 'bolts', rx: 12, body: `
      <rect x="632" y="612" width="336" height="186" rx="8" fill="#05070d"/>
      <text x="800" y="712" text-anchor="middle" font-size="20" fill="#7cf0be"
        font-family="Consolas, monospace" class="flicker">${label} — OPEN</text>` });
  }
  // Photoreal brass combination panel, bolted to the wall; the engraved name-plate
  // carries the label, and a stamped serial tag is riveted beneath it.
  return `<g font-family="Consolas, monospace" text-anchor="middle" data-mount="bolts">
    ${shadow(800, 812, 190, 10, 0.6)}
    <image href="${art('lock-panel.webp')}" x="620" y="600" width="360" height="210" preserveAspectRatio="xMidYMid meet"/>
    <text x="800" y="666" font-size="14" fill="#241c08" letter-spacing="1">${label}</text>
    <rect x="730" y="814" width="140" height="34" rx="4" fill="url(#sk_brass)" stroke="#4f3b10" stroke-width="2"/>
    <circle cx="740" cy="831" r="3" fill="#2a1d05"/><circle cx="860" cy="831" r="3" fill="#2a1d05"/>
    <text x="800" y="838" font-size="17" fill="#241c08" letter-spacing="4">${serial.split('').join(' ')}</text>
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
  // which way each crewmate turns their serial into their code, in this scene
  cfg.ruleOf = (role) => effectiveRule(cfg.codes[role], ruleFor(cfg.index ?? 0, role));
  const serialOf = (role) => serialFor(cfg.codes[role], ruleFor(cfg.index ?? 0, role));
  const chipId = (role) => `${slug}_chip_${role}`;
  const isOpen = (state) => !!state.flags[`${slug}_open`];
  const myChip = () => cfg.chips && cfg.chips[getRole()];
  const hasChip = (state) => state.journal.some(e => e.id === chipId(getRole()));

  return {
    // the code this role's lock accepts (room-lint checks the last hint states it)
    solution: role => cfg.codes[role],
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

        <!-- RELAY: your crew radio holds the RULE for ${relayFor}'s lock (their serial is on their plate) -->
        ${dock({ x: 556, y: 150, w: 488, h: 176 }, `
          <text x="800" y="190" text-anchor="middle" font-size="16" fill="#9fc7dd"
            font-family="Consolas, monospace" letter-spacing="2">${relayFor.toUpperCase()} — LOCK RULE</text>
          <text x="800" y="232" text-anchor="middle" font-size="19" fill="#e8c85a" font-family="Consolas, monospace">${RULES[cfg.ruleOf(NEXT[role])].text.split(' ').slice(0, 4).join(' ')}</text>
          <text x="800" y="262" text-anchor="middle" font-size="19" fill="#e8c85a" font-family="Consolas, monospace">${RULES[cfg.ruleOf(NEXT[role])].text.split(' ').slice(4).join(' ')}</text>
          <text x="800" y="300" text-anchor="middle" font-size="13" fill="#9fb0c4"
            font-family="Consolas, monospace">read this to your crewmate</text>`, { kind: 'radio', title: 'CREW RADIO' })}

        ${lockSvg(slug, open, cfg.lockLabel, serialOf(role))}

        <!-- something to examine, bolted to the right-hand wall -->
        ${panel({ x: 1180, y: 360, w: 300, h: 150, material: 'steel', mount: 'bolts', rx: 8, body: `
          <rect x="1196" y="376" width="268" height="94" rx="4" fill="#0a1622"/>
          <circle cx="1330" cy="423" r="26" fill="url(#${slug}_glow)"/>
          <text x="1330" y="494" text-anchor="middle" font-size="13" fill="#cfd8e3" font-family="Consolas, monospace">${(cfg.loreFor(role).label || 'examine').toLowerCase()}</text>` })}

        ${showChip ? `
        <g class="beckon" data-mount="floor">
          ${shadow(300, 672, 44, 8)}
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
        id: 'relay', ...DOCK, label: `${relayFor}'s lock rule (for your crewmate)`,
        onInteract(game) {
          const rule = RULES[cfg.ruleOf(NEXT[role])].text;
          const html = `<div class="chartcard"><div class="chart-title">${relayFor} — lock rule</div>
            <p>Over your crew radio, meant for their lock:</p>
            <p style="font-size:20px;color:#eafffb;text-align:center;">“${rule}”</p></div>
            <div class="relay">This is <strong>your crewmate's</strong> rule. Their serial is stamped on their own lock — only the two halves together make the code.</div>`;
          game.journal.add(`${slug}_relay`, { title: `${relayFor}'s lock rule`, category: 'note', html });
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
              desc: `Three dials, 0&ndash;9. Your serial plate reads <strong>${serialOf(role).split('').join(' ')}</strong> &mdash; but the code is that serial worked by a rule, and the rule is on <strong>${holder}</strong>'s screen. Ask them.`,
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
              game.journal.add(chipId(role), { title: `Tumbler-chip #${chip.pos}`, category: 'sun', sun: { rays: chip.pos, letter: chip.digit } });
              game.say(`On your way you scoop up the brass tumbler-chip: #${chip.pos}, the number ${chip.digit}. The vault will want all six.`);
              game.completeRoom({ delay: 3000 });
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
