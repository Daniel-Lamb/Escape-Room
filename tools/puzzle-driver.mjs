// A small stand-in DOM, enough to render a room's puzzle modal under Node and
// work its controls, so the walk can prove a finale actually finishes when it
// is given the right answer. Used by room-walk.
//
//   drivePuzzle(def, { answers, done })
//
// renders def into a fake modal body and tries, in turn:
//   text    type each answer the room declares into its input(s), press Enter,
//           then press the primary button
//   dials   every combination of the .dial controls (each stepped with its
//           "+1" button), pressing the primary button at each
//   levers  every on/off combination of the .lever controls
// and reports which one made done() true. It never needs to know the answer
// for dials or levers — it proves *some* setting finishes the game, which is
// what "no soft-lock" means; room-lint checks separately that the hints name it.

const VOID = new Set(['input', 'img', 'br', 'hr', 'meta', 'link', 'source', 'col', 'wbr']);

class El {
  constructor(tag = 'div', attrs = {}) {
    this.tagName = tag.toUpperCase();
    this.attrs = { ...attrs };
    this.children = [];
    this.parent = null;
    this.listeners = {};
    this.style = {};
    this._text = '';
    this.value = attrs.value ?? '';
    this.disabled = 'disabled' in attrs;
    this.checked = 'checked' in attrs;
  }
  get id() { return this.attrs.id || ''; }
  set id(v) { this.attrs.id = v; }
  get className() { return this.attrs.class || ''; }
  set className(v) { this.attrs.class = v; }
  get dataset() {
    const el = this;
    return new Proxy({}, {
      get: (_, k) => el.attrs[`data-${String(k).replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)}`],
      set: (_, k, v) => { el.attrs[`data-${String(k).replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)}`] = String(v); return true; },
    });
  }
  get classList() {
    const el = this;
    const list = () => el.className.split(/\s+/).filter(Boolean);
    return {
      add: (...c) => { el.className = [...new Set([...list(), ...c])].join(' '); },
      remove: (...c) => { el.className = list().filter(x => !c.includes(x)).join(' '); },
      toggle: (c, force) => { const on = force ?? !list().includes(c); on ? el.classList.add(c) : el.classList.remove(c); return on; },
      contains: c => list().includes(c),
    };
  }
  get offsetWidth() { return 0; }
  get textContent() { return this._text + this.children.map(c => c.textContent).join(''); }
  set textContent(v) { this._text = String(v); this.children = []; }
  get innerText() { return this.textContent; }
  set innerHTML(html) { this.children = []; this._text = ''; parseInto(this, String(html)); }
  get innerHTML() { return ''; }
  setAttribute(k, v) { this.attrs[k] = String(v); if (k === 'value') this.value = String(v); }
  getAttribute(k) { return this.attrs[k] ?? null; }
  hasAttribute(k) { return k in this.attrs; }
  removeAttribute(k) { delete this.attrs[k]; }
  appendChild(c) { if (c.parent) c.remove(); c.parent = this; this.children.push(c); return c; }
  append(...cs) { cs.forEach(c => (typeof c === 'string' ? (this._text += c) : this.appendChild(c))); }
  prepend(...cs) { cs.reverse().forEach(c => { c.parent = this; this.children.unshift(c); }); }
  insertAdjacentHTML(_, html) { const tmp = new El(); tmp.innerHTML = html; tmp.children.forEach(c => this.appendChild(c)); }
  replaceChildren(...cs) { this.children = []; this.append(...cs); }
  remove() { if (this.parent) this.parent.children = this.parent.children.filter(c => c !== this); this.parent = null; }
  focus() {} blur() {} select() {} scrollIntoView() {}
  getBoundingClientRect() { return { x: 0, y: 0, width: 0, height: 0, left: 0, top: 0, right: 0, bottom: 0 }; }
  addEventListener(t, f) { (this.listeners[t] ||= []).push(f); }
  removeEventListener(t, f) { this.listeners[t] = (this.listeners[t] || []).filter(x => x !== f); }
  dispatch(type, extra = {}) {
    const ev = { type, target: this, key: extra.key, preventDefault() {}, stopPropagation() { this._stop = true; }, ...extra };
    for (let n = this; n && !ev._stop; n = n.parent) {
      ev.currentTarget = n;
      for (const f of n.listeners[type] || []) f.call(n, ev);
    }
  }
  click() { if (!this.disabled) this.dispatch('click'); }
  closest(sel) { for (let n = this; n; n = n.parent) if (matches(n, sel)) return n; return null; }
  matches(sel) { return matches(this, sel); }
  querySelectorAll(sel) {
    const out = [];
    const walk = n => { for (const c of n.children) { if (sel.split(',').some(s => matchesPath(c, s.trim(), this))) out.push(c); walk(c); } };
    walk(this);
    return out;
  }
  querySelector(sel) { return this.querySelectorAll(sel)[0] || null; }
}

function parseInto(root, html) {
  const tag = /<(\/?)([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>|([^<]+)/g;
  const stack = [root];
  let m;
  while ((m = tag.exec(html))) {
    const top = stack[stack.length - 1];
    if (m[5] != null) { top._text += m[5].replace(/&nbsp;/g, ' ').replace(/&[a-z]+;|&#\d+;/g, ''); continue; }
    const [, close, name, rawAttrs, selfClose] = m;
    if (close) { while (stack.length > 1 && stack.pop().tagName !== name.toUpperCase()); continue; }
    const attrs = {};
    for (const a of rawAttrs.matchAll(/([\w:-]+)(?:\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) attrs[a[1]] = a[3] ?? a[4] ?? a[5] ?? '';
    const el = new El(name, attrs);
    top.appendChild(el);
    if (!selfClose && !VOID.has(name.toLowerCase()) && name.toLowerCase() !== 'svg') stack.push(el);
    if (name.toLowerCase() === 'svg') { // skip svg innards
      const end = html.indexOf('</svg>', tag.lastIndex);
      tag.lastIndex = end < 0 ? html.length : end + 6;
    }
  }
}

function matches(el, compound) {
  const m = /^([a-zA-Z][\w-]*)?((?:[#.][\w-]+|\[[^\]]+\])*)$/.exec(compound.trim());
  if (!m) return false;
  if (m[1] && el.tagName !== m[1].toUpperCase()) return false;
  for (const part of m[2].match(/[#.][\w-]+|\[[^\]]+\]/g) || []) {
    if (part[0] === '#' && el.id !== part.slice(1)) return false;
    if (part[0] === '.' && !el.classList.contains(part.slice(1))) return false;
    if (part[0] === '[') {
      const [, k, v] = /^\[([\w-]+)(?:="?([^"\]]*)"?)?\]$/.exec(part) || [];
      if (!k || !(k in el.attrs)) return false;
      if (v != null && el.attrs[k] !== v) return false;
    }
  }
  return true;
}

function matchesPath(el, sel, scope) {
  const parts = sel.split(/\s+/).filter(Boolean);
  if (!matches(el, parts[parts.length - 1])) return false;
  let n = el.parent, i = parts.length - 2;
  while (i >= 0 && n && n !== scope.parent) { if (matches(n, parts[i])) i--; n = n.parent; }
  return i < 0;
}

/** Install a minimal `document` (createElement etc.) for puzzle code. */
export function installFakeDocument() {
  const body = new El('body');
  globalThis.document = { createElement: t => new El(t), body, querySelector: s => body.querySelector(s), querySelectorAll: s => body.querySelectorAll(s), addEventListener() {}, removeEventListener() {} };
  globalThis.requestAnimationFrame ||= f => f(0);
}

const primaryButton = body => body.querySelector('.btn-primary') || body.querySelectorAll('button').find(b => !/reset|clear|close|cancel/i.test(b.textContent));

function render(def) {
  const body = new El('div');
  const api = { close() {}, solved() {}, fail() {}, setFeedback() {} };
  def.render(body, api);
  return body;
}

/**
 * @returns {{ ok: boolean, how: string }}
 */
export function drivePuzzle(def, opts) {
  // a solve often finishes the room on a timer (after the "solved" flourish):
  // run timers at once while working the puzzle
  const realTimeout = globalThis.setTimeout;
  globalThis.setTimeout = /** @type {any} */ ((f, _ms, ...a) => { try { f(...a); } catch { /* DOM-only */ } return 0; });
  try { return work(def, opts); } finally { globalThis.setTimeout = realTimeout; }
}

// A choice puzzle (pick a witness, a suspect…) is worked once per choice, with
// the rest of its controls tried under each.
function work(def, opts) {
  const probe = render(def);
  const isChoice = b => !b.classList.contains('dial-btn') && !b.classList.contains('btn-primary') && !b.closest('.dial') && !b.closest('.lever')
    && !/reset|clear|close|cancel/i.test(b.textContent);
  const choices = probe.querySelectorAll('button').filter(isChoice);
  if (choices.length >= 2 && choices.length <= 12) {
    for (let c = 0; c < choices.length; c++) {
      const r = workControls(def, opts, body => body.querySelectorAll('button').filter(isChoice)[c]?.click());
      if (r.ok) return { ok: true, how: `chose "${choices[c].textContent.trim()}", ${r.how}` };
    }
  }
  return workControls(def, opts, () => {});
}

function workControls(def, { answers = [], done }, pick) {
  const renderP = () => { const b = render(def); pick(b); return b; };
  // text answers
  let body = renderP();
  const inputs = body.querySelectorAll('input').filter(i => !/checkbox|radio|range|hidden/.test(i.attrs.type || ''));
  if (inputs.length) {
    for (const ans of answers) {
      body = renderP();
      const ins = body.querySelectorAll('input').filter(i => !/checkbox|radio|range|hidden/.test(i.attrs.type || ''));
      const parts = ins.length > 1 && ans.replace(/\s/g, '').length === ins.length ? ans.replace(/\s/g, '').split('') : [ans];
      ins.forEach((i, k) => { i.value = parts[k] ?? parts[0]; i.dispatch('input'); });
      ins[ins.length - 1].dispatch('keydown', { key: 'Enter' });
      if (done()) return { ok: true, how: `typed "${ans}"` };
      primaryButton(body)?.click();
      if (done()) return { ok: true, how: `typed "${ans}"` };
    }
  }
  // dials: every combination
  body = renderP();
  const dials = body.querySelectorAll('.dial');
  if (dials.length) {
    const up = d => d.querySelector('.dial-btn[data-d="1"]') || d.querySelector('.dial-btn') || d.querySelector('button');
    const face = d => (d.querySelector('.dial-face') || d).textContent.trim();
    const sizes = dials.map(d => {
      const seen = [face(d)];
      for (let k = 0; k < 40; k++) { up(d)?.click(); const f = face(d); if (f === seen[0]) break; seen.push(f); }
      return seen.length;
    });
    // a declared answer with one character per dial: dial it straight in
    for (const ans of answers) {
      const chars = String(ans).replace(/[\s·-]/g, '').toUpperCase().split('');
      if (chars.length !== dials.length) continue;
      body = renderP();
      const ds = body.querySelectorAll('.dial');
      let ok = true;
      ds.forEach((d, k) => {
        for (let t = 0; t < 40 && face(d).toUpperCase() !== chars[k]; t++) up(d)?.click();
        if (face(d).toUpperCase() !== chars[k]) ok = false;
      });
      if (!ok) continue;
      primaryButton(body)?.click();
      if (done()) return { ok: true, how: `dialled "${ans}"` };
    }
    body = renderP();
    const fresh = body.querySelectorAll('.dial');
    fresh.forEach((d, k) => { dials[k] = d; });
    const total = sizes.reduce((a, b) => a * b, 1);
    if (total <= 300000) {
      // each dial is back at its start after measuring; step them like an odometer
      const btn = primaryButton(body);
      const idx = sizes.map(() => 0);
      for (let c = 0; c < total; c++) {
        btn?.click();
        if (done()) return { ok: true, how: `dials at ${dials.map(face).join(' ')}` };
        for (let k = 0; k < dials.length; k++) {
          up(dials[k])?.click();
          if (++idx[k] < sizes[k]) break;
          idx[k] = 0;
        }
      }
    }
  }
  // levers: every on/off combination
  body = renderP();
  const levers = body.querySelectorAll('.lever');
  if (levers.length && levers.length <= 12) {
    for (let mask = 0; mask < 1 << levers.length; mask++) {
      body = renderP();
      const ls = body.querySelectorAll('.lever');
      ls.forEach((l, k) => { if (mask & (1 << k)) l.click(); });
      primaryButton(body)?.click();
      if (done()) return { ok: true, how: 'levers' };
    }
  }
  return { ok: false, how: inputs.length ? 'no declared answer opened it' : dials.length ? 'no dial setting opened it' : 'no control it could work' };
}
