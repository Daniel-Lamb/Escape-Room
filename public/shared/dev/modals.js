// Dev-only puzzle-modal gallery: every puzzle modal of one game (and role),
// opened the way a player opens it and rendered with the game's real CSS, each
// one checked for the series' modal rules. Same gate as the contact sheet.
//
//   shared/dev/modals.html?game=the-vault&role=p2
//   shared/dev/modals.html?all=1     every game and role, one summary table
//   shared/dev/modals.html?all=1&w=375&h=812   …as a phone shows them (adds a 24px tap-size check)
//
// To find the modals it clicks every hotspot of every room in every state the
// room declares (fresh + lintStates), with nothing held and then with each held
// item, and follows the buttons of any dialog that opens. Each puzzle it reaches
// is rendered and checked:
//   - a header band (.puzzle-hero) whose image actually loads;
//   - a title in the modal head;
//   - every control styled: no browser-default buttons or inputs, and the R4
//     chrome (gradient metal) on dials, dial buttons, tiles and lever tracks;
//   - nothing wider than the modal (no sideways scroll);
//   - no text under 11px.

const params = new URLSearchParams(location.search);
const LOCAL = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) || location.hostname.endsWith('.localhost');
const HERE = new URL('./', import.meta.url);
import { noteSmallDrawing } from '../js/phone.js';

const GAMES = ['pilgrims-road', 'starfall-station', 'wild-court', 'gate-of-life', 'tomb-of-the-scarab',
  'signal-towers', 'looking-glass', 'silent-alarm', 'deep-six', 'the-vault', 'trial-by-jury'];
const ROLE_KEYS = {
  'signal-towers': ['signal-towers-role', 2], 'looking-glass': ['looking-glass-role', 2],
  'silent-alarm': ['silent-alarm-role', 2], 'deep-six': ['deep-six-role', 2],
  'the-vault': ['the-vault-role', 4], 'trial-by-jury': ['trial-by-jury-role', 4],
};
const rolesOf = g => (ROLE_KEYS[g] ? Array.from({ length: ROLE_KEYS[g][1] }, (_, i) => `p${i + 1}`) : [null]);

const game = GAMES.includes(params.get('game')) ? params.get('game') : GAMES[0];
const role = params.get('role') || (ROLE_KEYS[game] ? 'p1' : null);

const sleep = ms => new Promise(r => setTimeout(r, ms));
const clone = o => JSON.parse(JSON.stringify(o));

// ------------------------------------------------------------------ capture
function stubGame(state, found) {
  const handle = () => ({ close() {}, card: document.createElement('div'), body: document.createElement('div') });
  const g = {
    state, selectedItem: null,
    say() {}, clearSay() {}, refreshScene() {}, completeRoom() {}, penalize() {}, playSfx() {}, playBell() {},
    addItem(id) { if (!state.inventory.includes(id)) state.inventory.push(id); },
    hasItem: id => state.inventory.includes(id),
    removeItem(id) { state.inventory = state.inventory.filter(i => i !== id); },
    useSelected() { const s = g.selectedItem; g.selectedItem = null; return s; },
    setFlag(k, v = true) { state.flags[k] = v; },
    getFlag: k => state.flags[k],
    journal: {
      add(id, e) { if (!state.journal.some(x => x.id === id)) state.journal.push({ id, ...e }); },
      has: id => state.journal.some(e => e.id === id),
    },
    dialog(opts) { found.dialogs.push(opts); return handle(); },
    openPuzzle(def) { found.puzzles.push(def); return handle(); },
  };
  return new Proxy(g, { get: (t, p) => (p in t ? t[p] : () => undefined) });
}

/** Run fn with timers fired at once (bounded), so a delayed openPuzzle is caught. */
function eager(fn) {
  const real = window.setTimeout;
  let n = 0;
  // @ts-ignore — dev shim
  window.setTimeout = (f, _ms, ...a) => { if (n++ < 200 && typeof f === 'function') try { f(...a); } catch { /* ignore */ } return 0; };
  try { fn(); } catch { /* a DOM-only path */ } finally { window.setTimeout = real; }
}

function puzzlesOf(room, i) {
  const out = new Map();
  const states = [{ label: 'fresh', flags: {}, inventory: [] }, ...(room.lintStates || [])];
  for (const st of states) {
    const base = {
      currentRoom: i, timeLeft: 3600, hintsUsed: {}, started: true,
      flags: { ...(st.flags || {}) }, inventory: [...(st.inventory || [])],
      journal: (st.journal || []).map(e => (typeof e === 'string' ? { id: e, title: e, category: 'note' } : e)),
    };
    let spots = [];
    try { spots = room.hotspots(clone(base)) || []; } catch { continue; }
    for (const s of spots) {
      for (const held of [null, ...base.inventory]) {
        const state = clone(base);
        const found = { dialogs: [], puzzles: [] };
        const g = stubGame(state, found);
        g.selectedItem = held;
        eager(() => {
          const live = (room.hotspots(state) || []).find(x => x.id === s.id);
          live?.onInteract?.(g);
        });
        for (const d of found.dialogs) for (const b of d.buttons || []) if (b.onClick) eager(() => b.onClick());
        for (const def of found.puzzles) {
          const key = def.id || def.title || `${s.id}`;
          if (!out.has(key)) out.set(key, { def, where: `${room.id}/${s.id} @ ${st.label}${held ? ` holding ${held}` : ''}` });
        }
      }
    }
  }
  return [...out.values()];
}

// ------------------------------------------------------------------- render
function renderModal(cellParent, room, { def, where }) {
  const cell = document.createElement('div');
  cell.className = 'cell';
  const card = document.createElement('div');
  card.className = 'modal-card show' + (def.wide !== false ? ' wide' : '');
  card.innerHTML = `
    <div class="modal-head"><span class="modal-title"></span><button class="modal-close" aria-label="close">&#10005;</button></div>
    <div class="modal-body"></div>`;
  card.querySelector('.modal-title').textContent = def.title || '';
  const body = card.querySelector('.modal-body');
  cell.innerHTML = `<div class="tag">${room.id} · ${def.id || def.title || '?'} <span style="opacity:.7">(${where})</span></div>`;
  cell.appendChild(card);
  cellParent.appendChild(cell);
  const api = {
    close() {}, solved() {}, fail() {},
    setFeedback(msg, cls = '') { const fb = card.querySelector('.puzzle-feedback'); if (fb) { fb.textContent = msg; fb.className = `puzzle-feedback ${cls}`; } },
  };
  let error = null;
  try { def.render(body, api); } catch (e) { error = e.message; }
  try { noteSmallDrawing(body); } catch { /* render failed */ }   // as the engine does on a phone held upright
  return { cell, card, body, error, room: room.id, id: def.id || def.title, where };
}

// -------------------------------------------------------------------- check
const UA_BG = ['rgb(239, 239, 239)', 'rgb(240, 240, 240)', 'rgb(233, 233, 237)', 'rgb(255, 255, 255)'];
const CHROME = '.dial, .dial-btn, .tile, .lever-track';

function loads(src) {
  return new Promise(res => { const im = new Image(); im.onload = () => res(im.naturalWidth > 0); im.onerror = () => res(false); im.src = src; });
}

async function check(m) {
  const fails = [];
  if (m.error) fails.push(`render threw: ${m.error}`);
  if (!m.card.querySelector('.modal-title').textContent.trim()) fails.push('no title');
  const hero = m.body.querySelector('.puzzle-hero');
  if (!hero) fails.push('no header band');
  else {
    const bg = getComputedStyle(hero).backgroundImage;
    const src = hero.tagName === 'IMG' ? hero.currentSrc || hero.src : (/url\("?([^")]+)"?\)/.exec(bg) || [])[1];
    if (!src) fails.push('header band has no image');
    else if (!(await loads(src))) fails.push(`header image fails to load: ${src.replace(location.origin, '')}`);
  }
  let controls = 0, styled = 0;
  for (const el of m.body.querySelectorAll('button, input, select, textarea')) {
    if (el.closest('[hidden]') || getComputedStyle(el).display === 'none') continue;
    controls++;
    const cs = getComputedStyle(el);
    const uaFace = UA_BG.includes(cs.backgroundColor) && cs.backgroundImage === 'none' && /outset|inset/.test(cs.borderTopStyle);
    // the browser's 13.33px control font, on text the control shows itself (not in styled children)
    const ownText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) || el.tagName === 'INPUT';
    const uaFont = ownText && cs.fontSize === '13.3333px';
    if (uaFace || uaFont) fails.push(`browser-default ${el.tagName.toLowerCase()}${el.className ? `.${String(el.className).split(' ')[0]}` : ''} "${(el.textContent || el.value || '').trim().slice(0, 16)}"`);
    else styled++;
  }
  for (const el of m.body.querySelectorAll(CHROME)) {
    if (el.matches('.slot-target')) continue;   // an empty socket is drawn flat and dashed on purpose
    controls++;
    if (!/gradient/.test(getComputedStyle(el).backgroundImage)) fails.push(`no chrome on .${String(el.className).split(' ')[0]}`);
    else styled++;
  }
  if (m.body.scrollWidth > m.body.clientWidth + 2) fails.push(`content ${m.body.scrollWidth - m.body.clientWidth}px wider than the modal`);
  // rendered size: SVG text scales with its drawing, so apply the SVG's scale
  const px = el => {
    const f = parseFloat(getComputedStyle(el).fontSize);
    const svg = el.closest('svg');
    return svg?.getScreenCTM ? f * Math.abs(svg.getScreenCTM()?.a || 1) : f;
  };
  const tiny = [...m.body.querySelectorAll('*')].find(el => {
    if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && px(el) < 11;
  });
  // a drawing too small to read on a phone held upright carries the turn-sideways line: counted, not failed
  const hinted = !!tiny && !!m.body.querySelector('.puzzle-rotate-hint') && getComputedStyle(m.body.querySelector('.puzzle-rotate-hint')).display !== 'none';
  if (tiny && !hinted) fails.push(`text under 11px: "${tiny.textContent.trim().slice(0, 20)}" (${px(tiny).toFixed(1)}px)`);
  // on a phone, everything tappable is at least 24px (WCAG 2.5.8): buttons and
  // inputs, and clickable parts of a drawing (the outermost element with a hand cursor)
  if (innerWidth <= 900) {
    const tappable = [...m.body.querySelectorAll('*')].filter(el => {
      if (el.matches('button, input, select, textarea')) return true;
      return getComputedStyle(el).cursor === 'pointer' && getComputedStyle(el.parentElement).cursor !== 'pointer';
    });
    const small = tappable.filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && Math.min(r.width, r.height) < 24; });
    if (small.length) {
      const r = small[0].getBoundingClientRect();
      const name = (small[0].getAttribute('aria-label') || small[0].textContent || small[0].tagName).trim().replace(/\s+/g, ' ').slice(0, 16);
      fails.push(`${small.length} tap target${small.length > 1 ? 's' : ''} under 24px, e.g. "${name}" (${Math.round(r.width)}x${Math.round(r.height)})`);
    }
  }
  if (fails.length) m.cell.classList.add('fail');
  m.cell.querySelector('.tag').insertAdjacentHTML('beforeend', fails.length ? `<br>✗ ${fails.join('<br>✗ ')}` : ' ✓');
  if (hinted) m.cell.querySelector('.tag').insertAdjacentHTML('beforeend', ' · turn-sideways line shown');
  return { ...m, fails, controls, styled, hero: !!hero, hinted };
}

// --------------------------------------------------------------------- page
function header() {
  const h = document.createElement('header');
  h.innerHTML = `<strong>Puzzle modals</strong>
    <select id="g">${GAMES.map(g => `<option ${g === game ? 'selected' : ''}>${g}</option>`).join('')}</select>
    ${ROLE_KEYS[game] ? `<select id="r">${rolesOf(game).map(r => `<option ${r === role ? 'selected' : ''}>${r}</option>`).join('')}</select>` : ''}
    <a href="?all=1" style="color:#8ab4ff">all games</a>`;
  const go = () => { const q = new URLSearchParams({ game: h.querySelector('#g').value }); const r = h.querySelector('#r'); if (r && h.querySelector('#g').value === game) q.set('role', r.value); location.search = q.toString(); };
  h.querySelectorAll('select').forEach(el => el.addEventListener('change', go));
  document.body.prepend(h);
}

function css(href) {
  return new Promise(res => { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; l.onload = l.onerror = res; document.head.appendChild(l); });
}

async function runGame() {
  if (role) try { localStorage.setItem(ROLE_KEYS[game][0], role); } catch { /* private mode */ }
  // puzzle markup uses game-relative paths (art/pz-*.webp), as on the game page
  const b = document.createElement('base');
  b.href = new URL(`../../${game}/`, HERE).href;
  document.head.prepend(b);
  await Promise.all([css(new URL('../css/main.css', HERE).href), css(new URL('../css/animations.css', HERE).href),
    css(new URL(`../../${game}/skin.css`, HERE).href)]);
  header();
  const report = document.createElement('div');
  report.id = 'report';
  report.textContent = 'Opening every puzzle…';
  const gallery = document.createElement('div');
  gallery.className = 'gallery';
  document.body.append(report, gallery);

  const rooms = (await import(new URL(`../../${game}/js/rooms/index.js`, HERE).href)).default;
  const shown = [];
  rooms.forEach((room, i) => { for (const p of puzzlesOf(room, i)) shown.push(renderModal(gallery, room, p)); });
  await sleep(400);   // fonts, skin, late layout
  const results = [];
  for (const m of shown) results.push(await check(m));

  const bad = results.filter(r => r.fails.length);
  const roomsWith = new Set(results.map(r => r.room));
  const silent = rooms.filter(r => !roomsWith.has(r.id)).map(r => r.id);
  const summary = {
    game, role, puzzles: results.length, heroes: results.filter(r => r.hero).length,
    controls: results.reduce((a, r) => a + r.controls, 0), styled: results.reduce((a, r) => a + r.styled, 0),
    failing: bad.length, roomsWithout: silent, hinted: results.filter(r => r.hinted).map(r => `${r.room}/${r.id}`),
    fails: bad.map(r => `${r.room}/${r.id}: ${r.fails.join('; ')}`),
  };
  report.className = bad.length ? 'bad' : '';
  report.textContent = `${game}${role ? ` ${role}` : ''}: ${summary.puzzles} puzzle modals in ${roomsWith.size}/${rooms.length} rooms · `
    + `${summary.heroes}/${summary.puzzles} header bands load · ${summary.styled}/${summary.controls} controls styled · `
    + `${bad.length} failing${silent.length ? `\nRooms with no puzzle modal reached: ${silent.join(', ')}` : ''}`
    + (bad.length ? `\n\n${summary.fails.join('\n')}` : '');
  window.__modalSummary = summary;
  if (window.parent !== window) window.parent.postMessage({ modalSummary: summary }, location.origin);
}

async function runAll() {
  document.body.insertAdjacentHTML('afterbegin', '<header><strong>Puzzle modals — every game and role</strong></header><div id="report">Running…</div><table><thead><tr><th>game</th><th>role</th><th>modals</th><th>header bands</th><th>controls styled</th><th>failing</th><th>rooms with none</th></tr></thead><tbody></tbody></table>');
  const tbody = document.querySelector('tbody');
  const all = [];
  for (const g of GAMES) for (const r of rolesOf(g)) {
    const f = document.createElement('iframe');
    const got = new Promise(res => {
      const on = e => { if (e.source === f.contentWindow && e.data?.modalSummary) { removeEventListener('message', on); res(e.data.modalSummary); } };
      addEventListener('message', on);
      setTimeout(() => res({ game: g, role: r, puzzles: 0, heroes: 0, controls: 0, styled: 0, failing: 1, roomsWithout: [], fails: ['timed out'] }), 30000);
    });
    f.src = `modals.html?game=${g}${r ? `&role=${r}` : ''}`;
    // &w=375&h=812 checks every modal as a phone shows it
    if (params.get('w')) Object.assign(f.style, { width: `${+params.get('w')}px`, height: `${+params.get('h') || 812}px` });
    document.body.appendChild(f);
    const s = await got;
    f.remove();
    all.push(s);
    const cls = v => (v ? ' class="bad"' : '');
    tbody.insertAdjacentHTML('beforeend', `<tr><td><a href="?game=${g}${r ? `&role=${r}` : ''}" style="color:#8ab4ff">${g}</a></td><td>${r || '—'}</td><td>${s.puzzles}</td>`
      + `<td${cls(s.heroes < s.puzzles)}>${s.heroes}/${s.puzzles}</td><td${cls(s.styled < s.controls)}>${s.styled}/${s.controls}</td>`
      + `<td${cls(s.failing)}>${s.failing}</td><td>${s.roomsWithout.join(', ')}</td></tr>`);
  }
  const t = all.reduce((a, s) => ({ p: a.p + s.puzzles, h: a.h + s.heroes, c: a.c + s.controls, s: a.s + s.styled, f: a.f + s.failing }), { p: 0, h: 0, c: 0, s: 0, f: 0 });
  const hinted = [...new Set(all.flatMap(s => (s.hinted || []).map(x => `${s.game} ${x}`)))];
  const rep = document.getElementById('report');
  rep.className = t.f ? 'bad' : '';
  rep.textContent = `${all.length} game/role views: ${t.p} puzzle modals · ${t.h}/${t.p} header bands load · ${t.s}/${t.c} controls styled · ${t.f} failing`
    + (t.f ? `\n\n${all.flatMap(s => s.fails.map(x => `${s.game}${s.role ? ` ${s.role}` : ''} ${x}`)).join('\n')}` : '')
    + (hinted.length ? `\n\nToo small to read held upright; shows the turn-sideways line (${hinted.length}):\n${hinted.join('\n')}` : '');
  window.__modalSummaryAll = all;
}

if (!LOCAL && !params.has('dev')) document.body.innerHTML = '<p class="blocked">The modal gallery is a local development tool.</p>';
else if (params.has('all')) runAll();
else runGame();
