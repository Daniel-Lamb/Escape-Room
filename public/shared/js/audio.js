// WebAudio synth — every sound is generated, zero asset files.
// Public API: init(), toggleMute() -> muted, playSfx(name), startAmbience(), stopAmbience()

let ctx = null;
let master = null;
let muted = false;
let ambienceNodes = [];
let dripTimer = null;

function ensureCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.8;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function init() { ensureCtx(); }

export function isMuted() { return muted; }

export function toggleMute() {
  muted = !muted;
  if (master) master.gain.setTargetAtTime(muted ? 0 : 0.8, ctx.currentTime, 0.05);
  return muted;
}

/* ---------- building blocks ---------- */

function env(gainNode, t0, attack, peak, decay) {
  const g = gainNode.gain;
  g.setValueAtTime(0.0001, t0);
  g.exponentialRampToValueAtTime(peak, t0 + attack);
  g.exponentialRampToValueAtTime(0.0001, t0 + attack + decay);
}

function tone(freq, type, t0, attack, peak, decay, detune = 0, dest = null) {
  const c = ensureCtx();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  osc.detune.value = detune;
  env(g, t0, attack, peak, decay);
  osc.connect(g).connect(dest || master);
  osc.start(t0);
  osc.stop(t0 + attack + decay + 0.05);
  return osc;
}

function noiseBuffer(seconds = 1) {
  const c = ensureCtx();
  const buf = c.createBuffer(1, c.sampleRate * seconds, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

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
  src.connect(f).connect(g).connect(master);
  src.start(t0);
  src.stop(t0 + attack + decay + 0.1);
}

/* ---------- sfx ---------- */

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
    osc.connect(g).connect(master);
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
    osc.connect(f).connect(g).connect(master);
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

export function playSfx(name, opt) {
  if (muted) return;
  try {
    const c = ensureCtx();
    const fn = SFX[name];
    if (fn) fn(c.currentTime + 0.001, opt);
  } catch { /* audio blocked — never break gameplay */ }
}

// Play a bell at a specific pitch (used by musical puzzles)
export function playBell(freq) {
  if (muted) return;
  try {
    const c = ensureCtx();
    SFX.bell(c.currentTime + 0.001, freq);
  } catch { /* ignore */ }
}

/* ---------- ambience: wind + occasional drips ---------- */

export function startAmbience() {
  try {
    const c = ensureCtx();
    stopAmbience();

    // wind: looped brown-ish noise through a wandering lowpass
    const src = c.createBufferSource();
    const buf = c.createBuffer(1, c.sampleRate * 4, c.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
    src.buffer = buf;
    src.loop = true;

    const filter = c.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 320;

    const g = c.createGain();
    g.gain.value = 0.05;

    const lfo = c.createOscillator();
    const lfoGain = c.createGain();
    lfo.frequency.value = 0.07;
    lfoGain.gain.value = 0.028;
    lfo.connect(lfoGain).connect(g.gain);

    src.connect(filter).connect(g).connect(master);
    src.start();
    lfo.start();
    ambienceNodes = [src, lfo];

    // random echoing drips
    const drip = () => {
      if (!muted && ctx) {
        const t = ctx.currentTime + 0.001;
        const f = 1400 + Math.random() * 1600;
        tone(f, 'sine', t, 0.002, 0.05, 0.2);
        tone(f * 0.6, 'sine', t + 0.18, 0.002, 0.02, 0.4);
      }
      dripTimer = setTimeout(drip, 4000 + Math.random() * 9000);
    };
    dripTimer = setTimeout(drip, 3000);
  } catch { /* ignore */ }
}

export function stopAmbience() {
  ambienceNodes.forEach(n => { try { n.stop(); } catch { /* already stopped */ } });
  ambienceNodes = [];
  if (dripTimer) { clearTimeout(dripTimer); dripTimer = null; }
}
