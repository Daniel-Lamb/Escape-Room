// Game engine: scene rendering, hotspots, typewriter narration, modals,
// inventory, timer, hints, transitions. Rooms interact ONLY through the
// exported `game` object — see docs/ROOM_CONTRACT.md.

import { state, saveState, resetState, getSaveKey, TOTAL_SECONDS } from './state.js';
import * as audio from './audio.js';
import { getItem, getCombo } from './items.js';
import { initGus } from './gus-core.js';

const $ = (sel) => document.querySelector(sel);

let rooms = [];               // ordered room modules
let cfg = null;               // per-game config passed to initEngine
let currentRoom = null;
let timerHandle = null;
let emberHandle = null;
let messageQueue = [];
let typing = false;
let typeHandle = null;
let hideHandle = null;
let onGameEnd = null;         // callback into main.js (show title screen etc.)

/* ============================================================
   PUBLIC GAME API (what room modules use)
   ============================================================ */

export const game = {
  get state() { return state; },
  selectedItem: null,

  /* ---- narration ---- */
  say(text) {
    messageQueue.push(text);
    if (!typing) nextMessage();
  },
  clearSay() {
    messageQueue = [];
    stopTyping();
    $('#message-card').classList.add('hidden');
  },

  /* ---- inventory ---- */
  addItem(id, opts = {}) {
    if (state.inventory.includes(id)) return;
    state.inventory.push(id);
    saveState();
    audio.playSfx('pickup');
    renderInventory(id);
    if (opts.from) flyToInventory(id, opts.from);
    const item = getItem(id);
    if (!opts.silent) game.say(`You take the ${item.name.toLowerCase()}.`);
  },
  hasItem(id) { return state.inventory.includes(id); },
  removeItem(id) {
    const i = state.inventory.indexOf(id);
    if (i >= 0) state.inventory.splice(i, 1);
    if (game.selectedItem === id) game.selectedItem = null;
    saveState();
    renderInventory();
  },
  useSelected() {
    if (game.selectedItem) {
      const id = game.selectedItem;
      game.removeItem(id);
      return id;
    }
    return null;
  },

  /* ---- flags ---- */
  setFlag(key, value = true) { state.flags[key] = value; saveState(); },
  getFlag(key) { return state.flags[key]; },

  /* ---- pilgrim's journal ---- */
  journal: {
    // entry: { title, category: 'sun'|'note', html?, sun?: {rays, letter} }
    add(id, entry) {
      if (state.journal.some(e => e.id === id)) return;
      state.journal.push({ id, ...entry });
      saveState();
      audio.playSfx('page');
      const btn = $('#btn-journal');
      btn.classList.remove('badge-pulse');
      void btn.offsetWidth;
      btn.classList.add('badge-pulse');
      toast(entry.category === 'sun'
        ? (cfg.collectibleToast
            ? cfg.collectibleToast(entry)
            : `Sun-mark sketched in your journal: ${entry.sun.rays} rays — "${entry.sun.letter}"`)
        : `Noted in your journal: ${entry.title}`);
    },
    has(id) { return state.journal.some(e => e.id === id); },
  },

  /* ---- scene ---- */
  refreshScene() { renderScene(false); },

  /* ---- modals ---- */

  // Simple narrative/examine modal. html may contain .parchment-note markup.
  dialog({ title, html, wide = false, buttons = null, onClose = null }) {
    return openModal({ title, html, wide, buttons, onClose });
  },

  // Puzzle modal. def: { id, title, wide?, render(body, api), onCleanup? }
  // api passed to render: { close(), solved(opts), fail(msg), setFeedback(msg, cls) }
  openPuzzle(def) {
    const modal = openModal({
      title: def.title,
      html: '',
      wide: def.wide !== false,
      onClose: def.onCleanup || null,
    });
    const api = {
      close: modal.close,
      solved(opts = {}) {
        audio.playSfx('solve');
        burst();
        modal.close();
        if (opts.message) game.say(opts.message);
        saveState();
      },
      fail(msg) {
        audio.playSfx('wrong');
        modal.card.classList.remove('shake');
        void modal.card.offsetWidth; // restart animation
        modal.card.classList.add('shake');
        if (msg) api.setFeedback(msg, 'bad');
      },
      setFeedback(msg, cls = '') {
        const fb = modal.card.querySelector('.puzzle-feedback');
        if (fb) {
          fb.textContent = msg;
          fb.className = `puzzle-feedback ${cls}`;
        }
      },
    };
    def.render(modal.body, api);
    return modal;
  },

  /* ---- progression ---- */
  completeRoom(opts = {}) {
    const idx = state.currentRoom;
    state.flags[`room${idx}_done`] = true;
    saveState();
    audio.playSfx('unlock');
    $('#scene-wrap').classList.add('rumble');
    setTimeout(() => $('#scene-wrap').classList.remove('rumble'), 800);

    const advance = () => {
      if (idx + 1 >= rooms.length) {
        victory();
      } else {
        transitionToRoom(idx + 1);
      }
    };
    if (opts.delay === 0) advance();
    else setTimeout(advance, opts.delay ?? 1400);
  },

  /* ---- time ---- */
  penalize(seconds, reason) {
    state.timeLeft = Math.max(0, state.timeLeft - seconds);
    state.penaltySeconds += seconds;
    saveState();
    updateTimerDisplay();
    if (reason) toast(`${reason}`, `−${Math.round(seconds / 60) || seconds + 's'} ${seconds >= 60 ? 'min' : ''}`);
  },

  /* ---- audio passthrough ---- */
  playSfx: audio.playSfx,
  playBell: audio.playBell,
};

/* ============================================================
   BOOT / ROOM FLOW
   ============================================================ */

// config: {
//   gusForm,                        // the GUS object from the game's gus.js
//   journalTitle, journalEmpty,     // journal modal title + empty-state text
//   collectiblesTitle,              // journal section header for 'sun' entries
//   renderCollectible(entry),       // card inner-html for a 'sun' entry
//   collectibleToast(entry),        // toast text when a 'sun' entry is added
//   victory: { title, heading, story },
//   defeat:  { title, heading, story, retryLabel, restartLabel },
//   restartConfirm,                 // text for the manual-restart dialog
// }
export function initEngine(roomModules, { onEnd, config }) {
  rooms = roomModules;
  onGameEnd = onEnd;
  cfg = config || {};

  initGus({
    form: cfg.gusForm,
    getRoom: () => currentRoom,
    getState: () => state,
    dialog: (opts) => game.dialog(opts),
    penalize: (s) => game.penalize(s),
    save: saveState,
    playSfx: audio.playSfx,
  });
  $('#btn-journal').addEventListener('click', openJournal);
  $('#btn-sound').addEventListener('click', () => {
    const muted = audio.toggleMute();
    $('#sound-icon').innerHTML = muted ? '&#215;' : '&#9834;';
    if (!muted) audio.startAmbience();
  });
  $('#btn-restart').addEventListener('click', confirmRestart);
  $('#message-card').addEventListener('click', () => {
    if (typing) skipTyping();
    else nextMessage();
  });
}

export function startRun(resumed = false) {
  if (!resumed) {
    resetState();
    state.started = true;
    state.startedAt = Date.now();
    saveState();
  }
  audio.init();
  audio.startAmbience();
  renderInventory();
  startTimer();
  startEmbers();
  enterRoom(state.currentRoom, true);
}

function enterRoom(idx, immediate = false) {
  state.currentRoom = idx;
  saveState();
  currentRoom = rooms[idx];
  game.selectedItem = null;

  $('#room-badge').textContent = `${romanNumeral(idx + 1)} / ${romanNumeral(rooms.length)}`;
  $('#room-title').textContent = currentRoom.title;

  renderScene(true);
  game.clearSay();
  if (currentRoom.intro && !state.flags[`room${idx}_introSeen`]) {
    state.flags[`room${idx}_introSeen`] = true;
    saveState();
    game.say(currentRoom.intro);
  }
  if (currentRoom.onEnter) currentRoom.onEnter(game);
}

function transitionToRoom(idx) {
  const fader = $('#fader');
  fader.classList.add('active');
  setTimeout(() => {
    enterRoom(idx);
    setTimeout(() => fader.classList.remove('active'), 150);
  }, 650);
}

/* ============================================================
   SCENE + HOTSPOTS
   ============================================================ */

function renderScene(withEntrance) {
  const sceneEl = $('#scene');
  sceneEl.innerHTML = currentRoom.scene(state);
  if (withEntrance) {
    sceneEl.classList.remove('scene-enter');
    void sceneEl.offsetWidth;
    sceneEl.classList.add('scene-enter');
  }
  renderHotspots();
}

function renderHotspots() {
  const layer = $('#hotspots');
  layer.innerHTML = '';
  const spots = currentRoom.hotspots(state) || [];
  for (const spot of spots) {
    const el = document.createElement('button');
    el.className = 'hotspot';
    el.dataset.label = spot.label || '';
    el.setAttribute('aria-label', spot.label || 'interact');
    // scene coordinates: 1600 x 900
    el.style.left = `${(spot.x / 1600) * 100}%`;
    el.style.top = `${(spot.y / 900) * 100}%`;
    el.style.width = `${(spot.w / 1600) * 100}%`;
    el.style.height = `${(spot.h / 900) * 100}%`;
    if (spot.y < 120) el.classList.add('label-below');
    el.addEventListener('click', () => {
      audio.playSfx('click');
      spot.onInteract(game);
    });
    layer.appendChild(el);
  }
}

/* ============================================================
   TYPEWRITER NARRATION
   ============================================================ */

function nextMessage() {
  const card = $('#message-card');
  if (hideHandle) { clearTimeout(hideHandle); hideHandle = null; }
  if (messageQueue.length === 0) {
    card.classList.add('hidden');
    return;
  }
  const text = messageQueue.shift();
  card.classList.remove('hidden', 'done');
  const target = $('#message-text');
  target.textContent = '';
  typing = true;
  let i = 0;
  const step = () => {
    if (i >= text.length) { finishTyping(); return; }
    target.textContent += text[i++];
    typeHandle = setTimeout(step, text[i - 1] === '.' ? 90 : 17);
  };
  typeHandle = setTimeout(step, 60);
  card.dataset.fullText = text;
}

function skipTyping() {
  const card = $('#message-card');
  stopTyping();
  $('#message-text').textContent = card.dataset.fullText || '';
  card.classList.add('done');
}

function finishTyping() {
  typing = false;
  $('#message-card').classList.add('done');
  // narration lives in its own bar below the scene (never covers it);
  // auto-advance after a comfortable read so the bar stays fresh
  if (hideHandle) clearTimeout(hideHandle);
  hideHandle = setTimeout(() => {
    if (!typing) nextMessage();
  }, 9000);
}

function stopTyping() {
  typing = false;
  if (typeHandle) { clearTimeout(typeHandle); typeHandle = null; }
}

/* ============================================================
   INVENTORY
   ============================================================ */

function renderInventory(justAddedId = null) {
  const slots = $('#inv-slots');
  slots.innerHTML = '';
  for (const id of state.inventory) {
    const item = getItem(id);
    const el = document.createElement('div');
    el.className = 'inv-item';
    el.dataset.name = item.name;
    el.innerHTML = item.icon;
    if (id === justAddedId) el.classList.add('just-added');
    if (id === game.selectedItem) el.classList.add('selected');
    el.addEventListener('click', () => {
      if (game.selectedItem === id) {
        game.selectedItem = null;
        renderInventory();
      } else if (game.selectedItem) {
        // holding A, clicked B -> try to combine
        const combo = getCombo(game.selectedItem, id);
        if (combo) {
          const held = game.selectedItem;
          game.selectedItem = null;
          combo.onCombine(game, held, id);
          renderInventory();
        } else {
          game.say('Those two want nothing to do with each other.');
          game.selectedItem = id;
          renderInventory();
        }
      } else {
        game.selectedItem = id;
        renderInventory();
        game.say(`${item.name} in hand. ${item.description}`);
      }
      audio.playSfx('click');
    });
    slots.appendChild(el);
  }
}

// animate an item icon flying from a scene point into the inventory bar
function flyToInventory(itemId, from) {
  const wrap = $('#scene-wrap').getBoundingClientRect();
  const startX = wrap.left + (from.x / 1600) * wrap.width;
  const startY = wrap.top + (from.y / 900) * wrap.height;
  const inv = $('#inventory').getBoundingClientRect();
  const endX = inv.left + 120;
  const endY = inv.top + inv.height / 2;

  const el = document.createElement('div');
  el.className = 'fly-item';
  el.innerHTML = getItem(itemId).icon;
  el.style.left = `${startX}px`;
  el.style.top = `${startY}px`;
  $('#fly-layer').appendChild(el);

  el.animate([
    { transform: 'translate(0,0) scale(1.4)', opacity: 1 },
    { transform: `translate(${(endX - startX) * 0.5}px, ${(endY - startY) * 0.3 - 60}px) scale(1.1)`, opacity: 1, offset: 0.55 },
    { transform: `translate(${endX - startX}px, ${endY - startY}px) scale(0.35)`, opacity: 0.2 },
  ], { duration: 750, easing: 'cubic-bezier(0.4, 0, 0.6, 1)' }).onfinish = () => el.remove();
}

/* ============================================================
   MODALS
   ============================================================ */

function openModal({ title, html, wide, buttons, onClose }) {
  const root = $('#modal-root');
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  const card = document.createElement('div');
  card.className = 'modal-card' + (wide ? ' wide' : '');

  card.innerHTML = `
    <div class="modal-head">
      <span class="modal-title"></span>
      <button class="modal-close" aria-label="close">&#10005;</button>
    </div>
    <div class="modal-body"></div>
  `;
  card.querySelector('.modal-title').textContent = title || '';
  const body = card.querySelector('.modal-body');
  if (typeof html === 'string') body.innerHTML = html;

  if (buttons && buttons.length) {
    const foot = document.createElement('div');
    foot.className = 'modal-foot';
    for (const b of buttons) {
      const btn = document.createElement('button');
      btn.className = `btn ${b.class || ''}`;
      btn.textContent = b.label;
      btn.addEventListener('click', () => {
        if (b.onClick) b.onClick();
        if (b.closes !== false) close();
      });
      foot.appendChild(btn);
    }
    card.appendChild(foot);
  }

  root.appendChild(backdrop);
  root.appendChild(card);
  requestAnimationFrame(() => {
    backdrop.classList.add('show');
    card.classList.add('show');
  });

  let closed = false;
  function close() {
    if (closed) return;
    closed = true;
    backdrop.classList.remove('show');
    card.classList.remove('show');
    setTimeout(() => { backdrop.remove(); card.remove(); }, 350);
    if (onClose) onClose();
  }
  backdrop.addEventListener('click', close);
  card.querySelector('.modal-close').addEventListener('click', close);

  return { close, card, body };
}

function burst() {
  const el = document.createElement('div');
  el.className = 'solve-burst';
  $('#scene-wrap').appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

/* ============================================================
   PILGRIM'S JOURNAL
   ============================================================ */

function sunSketch(rays, letter) {
  // small hand-sketched sun: circle + N rays + letter beneath
  const cx = 40, cy = 34, r = 13;
  let rayLines = '';
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2 - Math.PI / 2;
    const x1 = cx + Math.cos(a) * (r + 3), y1 = cy + Math.sin(a) * (r + 3);
    const x2 = cx + Math.cos(a) * (r + 12), y2 = cy + Math.sin(a) * (r + 12);
    rayLines += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#c9a227" stroke-width="2.4" stroke-linecap="round"/>`;
  }
  return `<svg viewBox="0 0 80 92" xmlns="http://www.w3.org/2000/svg">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#c9a227" stroke-width="2.6"/>
    ${rayLines}
    <text x="${cx}" y="82" text-anchor="middle" font-size="24" fill="#e8d9b0"
      font-family="Palatino Linotype, Georgia, serif">${letter}</text>
  </svg>`;
}

function defaultCollectibleCard(e) {
  return `${sunSketch(e.sun.rays, e.sun.letter)}
    <div class="journal-sun-cap">${e.sun.rays} rays &middot; ${e.title}</div>`;
}

function openJournal() {
  audio.playSfx('page');
  const suns = state.journal.filter(e => e.category === 'sun');
  const notes = state.journal.filter(e => e.category !== 'sun');
  const renderCard = cfg.renderCollectible || defaultCollectibleCard;

  const sunsHtml = suns.length
    ? `<div class="journal-section-title">${cfg.collectiblesTitle || 'The Suns of the Road'}</div>
       <div class="journal-suns">${suns.map(e =>
         `<div class="journal-sun" title="${e.title}">${renderCard(e)}</div>`).join('')}</div>`
    : '';

  const notesHtml = notes.length
    ? `<div class="journal-section-title">Notes &amp; Documents</div>` + notes.map(e =>
        `<details class="journal-entry"><summary>${e.title}</summary><div class="journal-entry-body">${e.html || ''}</div></details>`).join('')
    : '';

  game.dialog({
    title: cfg.journalTitle || 'Journal',
    wide: true,
    html: (suns.length || notes.length)
      ? sunsHtml + notesHtml
      : `<p style="font-style: italic; color: var(--text-dim);">${cfg.journalEmpty ||
         'Empty pages, waiting. Everything worth remembering will be copied here the moment you examine it.'}</p>`,
  });
}

let toastEl = null;
function toast(text, costLabel = '') {
  if (toastEl) toastEl.remove();
  toastEl = document.createElement('div');
  toastEl.className = 'toast';
  toastEl.innerHTML = `<span></span>${costLabel ? `<span class="toast-cost">${costLabel}</span>` : ''}`;
  toastEl.querySelector('span').textContent = text;
  document.body.appendChild(toastEl);
  const el = toastEl;
  setTimeout(() => {
    el.classList.add('leaving');
    setTimeout(() => el.remove(), 450);
  }, 5200);
}

/* ============================================================
   TIMER
   ============================================================ */

function startTimer() {
  stopTimer();
  updateTimerDisplay();
  timerHandle = setInterval(() => {
    state.timeLeft -= 1;
    if (state.timeLeft % 15 === 0) saveState();
    updateTimerDisplay();
    if (state.timeLeft <= 0) {
      stopTimer();
      defeat();
    }
  }, 1000);
}

function stopTimer() {
  if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
}

function updateTimerDisplay() {
  const t = Math.max(0, state.timeLeft);
  const m = Math.floor(t / 60);
  const s = t % 60;
  const el = $('#timer');
  el.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  el.classList.toggle('warn', t <= 600 && t > 300);
  el.classList.toggle('crit', t <= 300);
}

/* ============================================================
   EMBERS (ambient particles)
   ============================================================ */

function startEmbers() {
  stopEmbers();
  const layer = $('#embers');
  emberHandle = setInterval(() => {
    if (document.hidden || layer.childElementCount > 26) return;
    const e = document.createElement('div');
    e.className = 'ember';
    e.style.left = `${Math.random() * 100}%`;
    e.style.setProperty('--sz', `${2 + Math.random() * 3.5}px`);
    e.style.setProperty('--dur', `${5 + Math.random() * 6}s`);
    e.style.setProperty('--driftX', `${-40 + Math.random() * 80}px`);
    e.style.setProperty('--rise', `${45 + Math.random() * 45}vh`);
    e.style.setProperty('--peak', `${0.4 + Math.random() * 0.5}`);
    e.addEventListener('animationend', () => e.remove());
    layer.appendChild(e);
  }, 800);
}

function stopEmbers() {
  if (emberHandle) { clearInterval(emberHandle); emberHandle = null; }
}

/* ============================================================
   END STATES
   ============================================================ */

function victory() {
  stopTimer();
  state.finished = true;
  saveState();
  audio.playSfx('victory');

  const t = Math.max(0, state.timeLeft);
  const m = Math.floor(t / 60), s = t % 60;

  // record completion + best time for the series dashboard
  try {
    const key = `${getSaveKey()}-victory`;
    const rec = JSON.parse(localStorage.getItem(key) || '{}');
    rec.completions = (rec.completions || 0) + 1;
    rec.bestTimeLeft = Math.max(rec.bestTimeLeft || 0, t);
    rec.lastFinished = Date.now();
    localStorage.setItem(key, JSON.stringify(rec));
  } catch { /* storage unavailable */ }

  const v = cfg.victory || {};
  game.dialog({
    title: v.title || 'Freedom',
    html: `
      <div class="end-screen">
        <h2>${v.heading || 'You Have Escaped'}</h2>
        <p class="end-story">${v.story || ''}</p>
        <div class="end-stats">
          <div class="end-stat"><div class="num">${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}</div><div class="lbl">Time to spare</div></div>
          <div class="end-stat"><div class="num">${state.totalHints}</div><div class="lbl">Hints used</div></div>
          <div class="end-stat"><div class="num">${romanNumeral(rooms.length)}</div><div class="lbl">Chambers cleared</div></div>
        </div>
      </div>`,
    buttons: [
      { label: 'Escape Again', class: 'btn-primary', onClick: () => { if (onGameEnd) onGameEnd('restart'); } },
      { label: 'Return to Title', class: 'btn-ghost', onClick: () => { if (onGameEnd) onGameEnd('title'); } },
    ],
  });
}

function defeat() {
  state.finished = true;
  saveState();
  const fader = $('#fader');
  fader.classList.add('active');
  setTimeout(() => {
    fader.classList.remove('active');
    const d = cfg.defeat || {};
    game.dialog({
      title: d.title || 'Out of Time',
      html: `
        <div class="end-screen defeat">
          <h2>${d.heading || 'Time Runs Out'}</h2>
          <p class="end-story">${d.story || ''}</p>
        </div>`,
      buttons: [
        { label: d.retryLabel || 'Try Again (this chamber, 15:00)', class: 'btn-primary', onClick: () => { if (onGameEnd) onGameEnd('retry'); } },
        { label: d.restartLabel || 'Restart from the Beginning', class: 'btn-ghost', onClick: () => { if (onGameEnd) onGameEnd('restart'); } },
        { label: 'Give In', class: 'btn-ghost', onClick: () => { if (onGameEnd) onGameEnd('title'); } },
      ],
    });
  }, 900);
}

// Retry after defeat: keep all progress, fresh 15 minutes, same chamber.
export function retryCurrentRoom() {
  state.finished = false;
  state.timeLeft = 15 * 60;
  saveState();
  audio.startAmbience();
  startTimer();
  startEmbers();
  enterRoom(state.currentRoom, true);
}

function confirmRestart() {
  game.dialog({
    title: 'Start Over?',
    html: `<p>${cfg.restartConfirm || 'Abandon this escape and begin again? All progress will be lost.'}</p>`,
    buttons: [
      { label: 'Keep Going', class: 'btn-ghost' },
      { label: 'Restart', class: 'btn-danger', onClick: () => { if (onGameEnd) onGameEnd('restart'); } },
    ],
  });
}

/* ============================================================
   UTIL
   ============================================================ */

function romanNumeral(n) {
  const map = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let out = '';
  for (const [v, sym] of map) while (n >= v) { out += sym; n -= v; }
  return out;
}

export function teardown() {
  stopTimer();
  stopEmbers();
  audio.stopAmbience();
}
