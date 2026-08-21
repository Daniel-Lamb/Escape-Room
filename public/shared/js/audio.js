// @ts-check
// WebAudio synth — every sound is generated, zero asset files.
// Public API: init(), toggleMute() -> muted, playSfx(name),
//   startAmbience(kind?) -> 'cave' (default) | 'deep-diver' | 'deep-tender', stopAmbience()

/** @type {AudioContext | null} */
let ctx = null;
/** @type {GainNode | null} */
let master = null;
let muted = false;
/** @type {AudioScheduledSourceNode[]} */
let ambienceNodes = [];
// Bumped on every stop; a scheduled ambience callback captures the value it was
// born under and no-ops (never rescheduling) once the generation moves on.
let ambienceGen = 0;

/** @returns {AudioContext} */
function ensureCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || /** @type {any} */ (window).webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.8;
    master.connect(ctx.destination);
  }
  const c = ctx; // set above; non-null from here
  if (c.state === 'suspended') c.resume();
  return c;
}

export function init() { ensureCtx(); }

export function isMuted() { return muted; }

export function toggleMute() {
  muted = !muted;
  if (master && ctx) master.gain.setTargetAtTime(muted ? 0 : 0.8, ctx.currentTime, 0.05);
  return muted;
}

/* ---------- building blocks ---------- */

/**
 * @param {GainNode} gainNode
 * @param {number} t0
 * @param {number} attack
 * @param {number} peak
 * @param {number} decay
 */
function env(gainNode, t0, attack, peak, decay) {
  const g = gainNode.gain;
  g.setValueAtTime(0.0001, t0);
  g.exponentialRampToValueAtTime(peak, t0 + attack);
  g.exponentialRampToValueAtTime(0.0001, t0 + attack + decay);
}

/**
 * @param {number} freq
 * @param {OscillatorType} type
 * @param {number} t0
 * @param {number} attack
 * @param {number} peak
 * @param {number} decay
 * @param {number} [detune]
 * @param {AudioNode | null} [dest]
 */
function tone(freq, type, t0, attack, peak, decay, detune = 0, dest = null) {
  const c = ensureCtx();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  osc.detune.value = detune;
  env(g, t0, attack, peak, decay);
  osc.connect(g).connect(dest || /** @type {GainNode} */ (master));
  osc.start(t0);
  osc.stop(t0 + attack + decay + 0.05);
  return osc;
}

/** @param {number} [seconds] */
function noiseBuffer(seconds = 1) {
  const c = ensureCtx();
  const buf = c.createBuffer(1, c.sampleRate * seconds, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

/**
 * @param {number} t0
 * @param {number} attack
 * @param {number} peak
 * @param {number} decay
 * @param {BiquadFilterType} filterType
 * @param {number} freq
 * @param {number} [q]
 */
function noiseBurst(t0, attack, peak, decay, filterType, freq, q = 1) {
  const c = ensureCtx();
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(attack + decay + 0.1);
  const f = c.createBiquadFilter();
  f.type = filterType;
  f.frequency.value = freq;
  f.Q.value = q;
  const g = c.createGain();
  env(g, t0, attack, peak, decay);
  src.connect(f).connect(g).connect(/** @type {GainNode} */ (master));
  src.start(t0);
  src.stop(t0 + attack + decay + 0.1);
}

/* ---------- sfx ---------- */

/** @type {Record<string, (t: number, opt?: number) => void>} */
const SFX = {
  click(t) {
    noiseBurst(t, 0.002, 0.12, 0.05, 'bandpass', 2600, 4);
  },
  pickup(t) {
    tone(660, 'sine', t, 0.008, 0.16, 0.12);
    tone(990, 'sine', t + 0.09, 0.008, 0.14, 0.16);
  },
  unlock(t) {
    noiseBurst(t, 0.004, 0.22, 0.09, 'bandpass', 1400, 6);
    tone(220, 'square', t + 0.06, 0.005, 0.1, 0.18);
    noiseBurst(t + 0.13, 0.004, 0.18, 0.2, 'bandpass', 700, 5);
  },
  wrong(t) {
    const c = ensureCtx();
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(95, t + 0.32);
    env(g, t, 0.01, 0.13, 0.34);
    osc.connect(g).connect(/** @type {GainNode} */ (master));
    osc.start(t); osc.stop(t + 0.4);
  },
  solve(t) {
    [392, 494, 587, 784].forEach((f, i) =>
      tone(f, 'triangle', t + i * 0.1, 0.01, 0.15, 0.35));
  },
  hint(t) {
    tone(880, 'sine', t, 0.01, 0.1, 0.5);
    tone(1320, 'sine', t + 0.02, 0.01, 0.05, 0.5);
  },
  page(t) {
    noiseBurst(t, 0.02, 0.09, 0.16, 'highpass', 1800, 0.8);
  },
  stone(t) {
    noiseBurst(t, 0.02, 0.28, 0.5, 'lowpass', 160, 0.7);
    tone(55, 'sine', t, 0.02, 0.2, 0.5);
  },
  bell(t, freq = 520) {
    // struck-bell: fundamental + inharmonic partials, long decay
    [1, 2.02, 2.94, 4.1].forEach((mult, i) =>
      tone(freq * mult, 'sine', t, 0.004, 0.16 / (i + 1), 1.6 - i * 0.25));
  },
  creak(t) {
    const c = ensureCtx();
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, t);
    osc.frequency.linearRampToValueAtTime(160, t + 0.4);
    osc.frequency.linearRampToValueAtTime(70, t + 0.9);
    const f = c.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = 300; f.Q.value = 9;
    env(g, t, 0.05, 0.09, 0.95);
    osc.connect(f).connect(g).connect(/** @type {GainNode} */ (master));
    osc.start(t); osc.stop(t + 1.1);
  },
  pour(t) {
    noiseBurst(t, 0.05, 0.1, 0.6, 'bandpass', 900, 1.2);
    noiseBurst(t + 0.1, 0.05, 0.07, 0.5, 'bandpass', 1500, 1.5);
  },
  victory(t) {
    [392, 523, 659, 784, 1046].forEach((f, i) =>
      tone(f, 'triangle', t + i * 0.13, 0.01, 0.16, 0.7));
    SFX.bell(t + 0.8, 784);
  },
};

/**
 * @param {string} name
 * @param {number} [opt]
 */
export function playSfx(name, opt) {
  if (muted) return;
  try {
    const c = ensureCtx();
    const fn = SFX[name];
    if (fn) fn(c.currentTime + 0.001, opt);
  } catch { /* audio blocked — never break gameplay */ }
}

// Play a bell at a specific pitch (used by musical puzzles)
/** @param {number} freq */
export function playBell(freq) {
  if (muted) return;
  try {
    const c = ensureCtx();
    SFX.bell(c.currentTime + 0.001, freq);
  } catch { /* ignore */ }
}

/* ---------- ambience ---------- */

/**
 * A looping filtered-noise bed. The source (and its LFO, if any) are tracked so
 * stopAmbience() can silence them.
 * @param {{ filterType?: BiquadFilterType, freq: number, gain: number,
 *   lfoRate?: number, lfoDepth?: number, q?: number, amp?: number, roughness?: number }} o
 */
function loopBed(o) {
  const c = ensureCtx();
  const m = /** @type {GainNode} */ (master);
  const src = c.createBufferSource();
  const buf = c.createBuffer(1, c.sampleRate * 4, c.sampleRate);
  const data = buf.getChannelData(0);
  const rough = o.roughness ?? 0.02;
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + rough * white) / (1 + rough);
    data[i] = last * (o.amp ?? 3.5);
  }
  src.buffer = buf;
  src.loop = true;

  const filter = c.createBiquadFilter();
  filter.type = o.filterType || 'lowpass';
  filter.frequency.value = o.freq;
  if (o.q) filter.Q.value = o.q;

  const g = c.createGain();
  g.gain.value = o.gain;

  if (o.lfoDepth) {
    const lfo = c.createOscillator();
    const lg = c.createGain();
    lfo.frequency.value = o.lfoRate ?? 0.07;
    lg.gain.value = o.lfoDepth;
    lfo.connect(lg).connect(g.gain);
    lfo.start();
    ambienceNodes.push(lfo);
  }
  src.connect(filter).connect(g).connect(m);
  src.start();
  ambienceNodes.push(src);
}

/**
 * Schedule a recurring randomised voice. The gen-guard turns any timeout that
 * fires after stopAmbience() into a silent no-op that does not reschedule.
 * @param {number} minMs
 * @param {number} maxMs
 * @param {(t: number) => void} fn
 * @param {number} [firstMs]
 */
function every(minMs, maxMs, fn, firstMs) {
  const gen = ambienceGen;
  const run = () => {
    if (gen !== ambienceGen) return;
    if (!muted && ctx) { try { fn(ctx.currentTime + 0.001); } catch { /* ignore */ } }
    setTimeout(run, minMs + Math.random() * (maxMs - minMs));
  };
  setTimeout(run, firstMs ?? minMs);
}

/* --- one-shot voices the beds draw on --- */

/** A short cluster of rising bubbles + a soft hiss: a diver's exhale.
 * @param {number} t @param {number} [n] @param {number} [vol] */
function bubbles(t, n = 5, vol = 0.035) {
  for (let i = 0; i < n; i++) {
    const f = 500 + Math.random() * 900;
    tone(f, 'sine', t + i * 0.05, 0.003, vol * (0.6 + Math.random() * 0.6), 0.12 + Math.random() * 0.1);
  }
  noiseBurst(t, 0.02, vol * 0.5, 0.3, 'bandpass', 1200, 0.8);
}

/** A long, low hull groan: steel settling under pressure.
 * @param {number} t @param {number} [vol] */
function groan(t, vol = 0.06) {
  const c = ensureCtx();
  const m = /** @type {GainNode} */ (master);
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(48, t);
  osc.frequency.linearRampToValueAtTime(78, t + 0.9);
  osc.frequency.linearRampToValueAtTime(40, t + 2.0);
  const f = c.createBiquadFilter();
  f.type = 'lowpass'; f.frequency.value = 220; f.Q.value = 6;
  env(g, t, 0.4, vol, 1.9);
  osc.connect(f).connect(g).connect(m);
  osc.start(t); osc.stop(t + 2.5);
}

/** A sonar return heard through the water: muffled, with a trailing echo.
 * @param {number} t @param {number} [vol] */
function farPing(t, vol = 0.04) {
  const c = ensureCtx();
  const m = /** @type {GainNode} */ (master);
  /** @type {(freq: number, delay: number, v: number, dec: number) => void} */
  const ping = (freq, delay, v, dec) => {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'sine'; o.frequency.value = freq;
    const f = c.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = 900;
    env(g, t + delay, 0.01, v, dec);
    o.connect(f).connect(g).connect(m);
    o.start(t + delay); o.stop(t + delay + dec + 0.1);
  };
  ping(760, 0, vol, 0.9);
  ping(1140, 0, vol * 0.4, 0.6);
  ping(700, 0.5, vol * 0.4, 1.2);
}

/** The console's own sonar sweep ping: clean, with a short echo tap.
 * @param {number} t @param {number} [vol] */
function sonarPing(t, vol = 0.05) {
  const c = ensureCtx();
  const m = /** @type {GainNode} */ (master);
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(1100, t);
  o.frequency.exponentialRampToValueAtTime(880, t + 0.12);
  env(g, t, 0.005, vol, 0.5);
  o.connect(g).connect(m);
  o.start(t); o.stop(t + 0.7);
  const o2 = c.createOscillator();
  const g2 = c.createGain();
  o2.type = 'sine'; o2.frequency.value = 880;
  env(g2, t + 0.28, 0.005, vol * 0.35, 0.6);
  o2.connect(g2).connect(m);
  o2.start(t + 0.28); o2.stop(t + 1.0);
}

/** A soft timber creak: the boat working in the swell.
 * @param {number} t @param {number} [vol] */
function creakSoft(t, vol = 0.045) {
  const c = ensureCtx();
  const m = /** @type {GainNode} */ (master);
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(70, t);
  o.frequency.linearRampToValueAtTime(120, t + 0.5);
  o.frequency.linearRampToValueAtTime(60, t + 1.0);
  const f = c.createBiquadFilter();
  f.type = 'bandpass'; f.frequency.value = 280; f.Q.value = 8;
  env(g, t, 0.06, vol, 0.9);
  o.connect(f).connect(g).connect(m);
  o.start(t); o.stop(t + 1.2);
}

/** A brief wash of radio static.
 * @param {number} t @param {number} [vol] */
function staticWhisper(t, vol = 0.03) {
  noiseBurst(t, 0.08, vol, 0.5, 'bandpass', 2200, 0.7);
  noiseBurst(t + 0.12, 0.05, vol * 0.6, 0.4, 'bandpass', 3000, 0.9);
}

/* --- per-theme beds --- */

// The original: cave wind through a wandering lowpass, with echoing drips.
function caveAmbience() {
  loopBed({ filterType: 'lowpass', freq: 320, gain: 0.05, lfoRate: 0.07, lfoDepth: 0.028 });
  every(4000, 13000, (t) => {
    const f = 1400 + Math.random() * 1600;
    tone(f, 'sine', t, 0.002, 0.05, 0.2);
    tone(f * 0.6, 'sine', t + 0.18, 0.002, 0.02, 0.4);
  }, 3000);
}

// The Diver: submerged. A low rumble bed, a slow regulator breath (a bandpass
// hiss swelling ~0.22 Hz), exhaled bubbles, the wreck groaning, and a distant
// sonar return heard through the water.
function deepDiverAmbience() {
  loopBed({ filterType: 'lowpass', freq: 170, gain: 0.05, lfoRate: 0.05, lfoDepth: 0.03, amp: 4 });
  loopBed({ filterType: 'bandpass', freq: 620, gain: 0.02, lfoRate: 0.22, lfoDepth: 0.02, q: 1.1, amp: 1, roughness: 0.5 });
  every(4200, 6000, (t) => bubbles(t, 5, 0.035), 3500);
  every(12000, 22000, (t) => groan(t, 0.06), 7000);
  every(8000, 14000, (t) => farPing(t, 0.04), 5000);
}

// The Tender: topside. An airy cabin tone, the sonar sweep ticking over about
// every four seconds (matching the scope on screen), the hull creaking, and a
// whisper of radio static.
function deepTenderAmbience() {
  loopBed({ filterType: 'lowpass', freq: 240, gain: 0.03, lfoRate: 0.06, lfoDepth: 0.015, amp: 3 });
  every(3900, 4300, (t) => sonarPing(t, 0.05), 1500);
  every(10000, 18000, (t) => creakSoft(t, 0.045), 6000);
  every(15000, 28000, (t) => staticWhisper(t, 0.03), 9000);
}

/** @type {Record<string, () => void>} */
const AMBIENCE = {
  cave: caveAmbience,
  'deep-diver': deepDiverAmbience,
  'deep-tender': deepTenderAmbience,
};

/** @param {string} [kind] */
export function startAmbience(kind = 'cave') {
  try {
    ensureCtx();
    stopAmbience();
    (AMBIENCE[kind] || AMBIENCE.cave)();
  } catch { /* ignore */ }
}

export function stopAmbience() {
  ambienceGen++;
  ambienceNodes.forEach(n => { try { n.stop(); } catch { /* already stopped */ } });
  ambienceNodes = [];
}
