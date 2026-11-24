// Dev-only contact sheet: every room of one game (and every lintState a room
// declares), rendered side by side with its hotspots outlined, so the whole
// layout of a game can be checked by eye in one screen. Same gate as the
// engine's room jumper: local hosts, or an explicit ?dev.
//
//   shared/dev/sheet.html?game=pilgrims-road&role=p1&outline=1
//
// &bare=1 marks, in dashed red, any hotspot with nothing drawn by the scene
// under it (the props, panels, labels and sprites under it cover less than a
// sixth of it) and lists them at the top. Those sit only on the background
// plate: each one must point at something the plate itself paints (a fireplace,
// a doorway), never at empty wall or sky, and say so with `plate: '<feature>'`.
// The report lists every declared plate feature too. &bare=review adds a crop of
// the plate under each undeclared one, to check it by eye before declaring it.

const params = new URLSearchParams(location.search);
const LOCAL = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) || location.hostname.endsWith('.localhost');

const GAMES = ['pilgrims-road', 'starfall-station', 'wild-court', 'gate-of-life', 'tomb-of-the-scarab',
  'signal-towers', 'looking-glass', 'silent-alarm', 'deep-six', 'the-vault', 'trial-by-jury'];
const ROLE_KEYS = {
  'signal-towers': ['signal-towers-role', 2], 'looking-glass': ['looking-glass-role', 2],
  'silent-alarm': ['silent-alarm-role', 2], 'deep-six': ['deep-six-role', 2],
  'the-vault': ['the-vault-role', 4], 'trial-by-jury': ['trial-by-jury-role', 4],
};

const game = GAMES.includes(params.get('game')) ? params.get('game') : GAMES[0];
const role = params.get('role') || 'p1';
const outline = params.get('outline') !== '0';
const bare = ['1', 'review'].includes(params.get('bare'));
const review = params.get('bare') === 'review';

function header() {
  const h = document.createElement('header');
  const roles = ROLE_KEYS[game] ? Array.from({ length: ROLE_KEYS[game][1] }, (_, i) => `p${i + 1}`) : [];
  h.innerHTML = `
    <strong>Contact sheet</strong>
    <select id="g">${GAMES.map(g => `<option ${g === game ? 'selected' : ''}>${g}</option>`).join('')}</select>
    ${roles.length ? `<select id="r">${roles.map(r => `<option ${r === role ? 'selected' : ''}>${r}</option>`).join('')}</select>` : ''}
    <label><input type="checkbox" id="o" ${outline ? 'checked' : ''}/> hotspots</label>`;
  const go = () => {
    const q = new URLSearchParams({ game: h.querySelector('#g').value, outline: h.querySelector('#o').checked ? '1' : '0' });
    const r = h.querySelector('#r');
    if (r) q.set('role', r.value);
    if (bare) q.set('bare', params.get('bare'));
    location.search = q.toString();
  };
  h.querySelectorAll('select, input').forEach(el => el.addEventListener('change', go));
  document.body.prepend(h);
}

// Scenes use repo-relative hrefs ("art/x.webp") resolved against the game page;
// rebase them onto the game folder, and show a looping plate as its poster.
function rebase(svg) {
  const base = `../../${game}/`;
  return svg
    .replace(/<video\b[^>]*poster="([^"]+)"[^>]*>[\s\S]*?<\/video>/g,
      (_, poster) => `<img xmlns="http://www.w3.org/1999/xhtml" src="${/^(https?:|\/)/.test(poster) ? '' : base}${poster}" style="width:100%;height:100%;object-fit:cover;display:block"/>`)
    .replace(/(href|src)="(?!https?:|data:|#|\/|\.\.\/)([^"]+)"/g, (_, attr, p) => `${attr}="${base}${p}"`);
}

function card(title, sub, svg, spots) {
  const c = document.createElement('section');
  c.className = 'card';
  c.innerHTML = `<h2>${title} <small>${sub}</small></h2><div class="frame">${rebase(svg)}<div class="gus"></div></div>`;
  const frame = c.querySelector('.frame');
  for (const s of spots) {
    const d = document.createElement('div');
    d.className = 'hs';
    Object.assign(d.style, { left: `${s.x / 16}%`, top: `${s.y / 9}%`, width: `${s.w / 16}%`, height: `${s.h / 9}%` });
    d.innerHTML = `<span>${s.id}</span>`;
    frame.appendChild(d);
  }
  return c;
}

// Scene-space box of a drawn element (through any transforms it sits inside).
function sceneBox(svg, el) {
  let b;
  try { b = el.getBBox(); } catch { return null; }
  if (!b.width && !b.height) return null;
  const m = svg.getScreenCTM().inverse().multiply(el.getScreenCTM());
  const pts = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]]
    .map(([x, y]) => new DOMPoint(x, y).matrixTransform(m));
  const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
  return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
}
const overlap = (a, b) =>
  Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));

/** Hotspots of a rendered card with no scene art under them. */
function bareSpots(card, spots, { declared = false } = {}) {
  const svg = card.querySelector('.frame > svg');
  if (!svg) return [];
  // pieces of art, and whole drawn props (a mounted group or a glinting collectible
  // counts by its outline, so a small mark of thin lines still registers)
  const boxes = [...svg.querySelectorAll('rect, circle, ellipse, path, polygon, polyline, line, text, image, g[data-mount], g.beckon')]
    .filter(el => !el.closest('foreignObject, [data-fx], defs, clipPath, mask, .gus'))
    .map(el => sceneBox(svg, el))
    .filter(b => b && b.w * b.h < 1600 * 900 * 0.6);   // full-frame walls and tints are not props
  // covered when the drawn pieces under it add up to a sixth of its area, or
  // when the hotspot declares the painted feature it points at (plate: '…')
  return spots.filter(s => (declared || !s.plate) && boxes.reduce((a, b) => a + overlap(b, s), 0) < (s.w * s.h) / 6);
}

/**
 * &bare=review: for each hotspot that has nothing drawn under it, the patch of
 * plate it sits on (with a margin, the hotspot outlined: red when undeclared,
 * blue with its `plate:` feature when declared), so each can be checked against
 * what the plate actually paints there.
 */
function reviewCrops(cards) {
  const wrap = document.createElement('div');
  wrap.id = 'bare-review';
  wrap.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px;margin-bottom:14px';
  const seen = new Set();
  for (const { c, spots, where } of cards) {
    const svg = c.querySelector('.frame > svg');
    const plate = svg?.querySelector('foreignObject img')?.getAttribute('src') ||
      [...(svg?.querySelectorAll('image') || [])].find(i => Number(i.getAttribute('width')) >= 1500)?.getAttribute('href');
    for (const sp of bareSpots(c, spots, { declared: true })) {
      const key = `${where.split(' @')[0]}/${sp.id}`;
      if (seen.has(key) || !plate) continue;
      seen.add(key);
      const m = 50, x0 = Math.max(0, sp.x - m), y0 = Math.max(0, sp.y - m);
      const x1 = Math.min(1600, sp.x + sp.w + m), y1 = Math.min(900, sp.y + sp.h + m);
      const k = Math.min(250 / (x1 - x0), 170 / (y1 - y0));
      const fig = document.createElement('figure');
      fig.className = 'crop';
      fig.dataset.key = key;
      fig.style.cssText = 'margin:0;background:#151826;border:1px solid #262a3d;border-radius:8px;padding:6px';
      fig.innerHTML = `<div style="position:relative;width:${(x1 - x0) * k}px;height:${(y1 - y0) * k}px;background:url(${plate}) ${-x0 * k}px ${-y0 * k}px / ${1600 * k}px ${900 * k}px no-repeat">
          <div style="position:absolute;left:${(sp.x - x0) * k}px;top:${(sp.y - y0) * k}px;width:${sp.w * k}px;height:${sp.h * k}px;outline:2px dashed ${sp.plate ? '#4dd2ff' : '#ff4d4d'}"></div></div>
        <figcaption style="font:11px/1.3 ui-monospace,monospace;color:#c8ccda;margin-top:4px">${key}<br><span style="color:#8a90a8">${sp.label || ''}</span>${sp.plate ? `<br><span style="color:#4dd2ff">plate: ${sp.plate}</span>` : ''}</figcaption>`;
      wrap.appendChild(fig);
    }
  }
  return wrap;
}

async function run() {
  if (!LOCAL && !params.has('dev')) {
    document.body.innerHTML = '<p class="blocked">The contact sheet is a local development tool.</p>';
    return;
  }
  if (ROLE_KEYS[game]) try { localStorage.setItem(ROLE_KEYS[game][0], role); } catch { /* private mode */ }
  const skin = document.createElement('link');
  skin.rel = 'stylesheet';
  skin.href = `../../${game}/skin.css`;
  document.head.appendChild(skin);
  header();
  if (!outline) document.body.classList.add('no-outline');
  const grid = document.createElement('div');
  grid.className = 'grid';
  document.body.appendChild(grid);
  const rooms = (await import(`../../${game}/js/rooms/index.js`)).default;
  const only = params.get('room');
  const cards = [];
  rooms.forEach((room, i) => {
    if (only && only !== room.id && only !== String(i + 1)) return;
    const states = [{ label: 'fresh', flags: {}, inventory: [] }, ...(room.lintStates || [])];
    for (const st of states) {
      const state = { currentRoom: i, timeLeft: 3600, journal: [], hintsUsed: {}, started: true, flags: { ...(st.flags || {}) }, inventory: [...(st.inventory || [])] };
      let svg = '', spots = [];
      try { svg = room.scene(state); } catch (e) { svg = `<svg viewBox="0 0 1600 900"><text x="40" y="80" fill="red" font-size="40">${e.message}</text></svg>`; }
      try { spots = room.hotspots(state) || []; } catch { spots = []; }
      const title = typeof room.title === 'function' ? room.title(state) : room.title;
      const c = card(`${i + 1}. ${title || room.id}`, st.label === 'fresh' ? room.id : `${room.id} @ ${st.label}`, svg, spots);
      grid.appendChild(c);
      if (bare) cards.push({ c, spots, where: `${room.id}${st.label === 'fresh' ? '' : ` @ ${st.label}`}` });
    }
  });
  if (bare) {
    const lines = [], declared = new Map();
    for (const { c, spots, where } of cards) {
      const b = bareSpots(c, spots);
      b.forEach(s => [...c.querySelectorAll('.hs')].find(d => d.textContent === s.id)?.classList.add('bare'));
      if (b.length) lines.push(`${where}: ${b.map(s => s.id).join(', ')}`);
      for (const s of spots) if (s.plate) declared.set(`${where.split(' @')[0]}/${s.id}`, s.plate);
    }
    if (review) grid.before(reviewCrops(cards));
    const rep = document.createElement('div');
    rep.id = 'bare-report';
    const plates = declared.size
      ? `\n\nOn painted plate features (${declared.size}, declared with plate:):\n${[...declared].map(([k, v]) => `${k} → ${v}`).join('\n')}`
      : '';
    rep.textContent = (lines.length
      ? `On the plate only, undeclared (check each points at something the plate paints, then declare it):\n${lines.join('\n')}`
      : 'Every hotspot has scene art under it, or names the plate feature it points at.') + plates;
    grid.before(rep);
  }
}

run();
