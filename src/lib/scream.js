// Synthesized placeholder "AAAAAA" scream via Web Audio — no audio file needed.
// Built to sit in the same lane as a sustained "Ahhhhhh" yell that falls away at
// the end. Swap for a real <audio> clip later if you get a licensed one; call
// sites (playScream()) don't need to change.

let ctxSingleton = null;
function getCtx() {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!ctxSingleton) ctxSingleton = new Ctx();
  if (ctxSingleton.state === "suspended") ctxSingleton.resume();
  return ctxSingleton;
}

function makeDistortionCurve(amount = 30) {
  const n = 44100;
  const curve = new Float32Array(n);
  const deg = Math.PI / 180;
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

export function playScream(duration = 3.0) {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  const fallStart = now + duration - 0.7; // last 0.7s dives down, like falling into the mouth

  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.5, now + 0.08);
  master.gain.setValueAtTime(0.45, fallStart);
  master.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  master.connect(ctx.destination);

  const shaper = ctx.createWaveShaper();
  shaper.curve = makeDistortionCurve(22);
  shaper.oversample = "4x";
  shaper.connect(master);

  // Main sustained "AHHH" voice.
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(300, now);
  osc.frequency.linearRampToValueAtTime(480, now + 0.18);
  osc.frequency.setValueAtTime(480, fallStart);
  osc.frequency.exponentialRampToValueAtTime(85, now + duration);
  osc.connect(shaper);

  // Sub voice for body/crunch.
  const osc2 = ctx.createOscillator();
  osc2.type = "square";
  osc2.frequency.setValueAtTime(150, now);
  osc2.frequency.linearRampToValueAtTime(240, now + 0.18);
  osc2.frequency.setValueAtTime(240, fallStart);
  osc2.frequency.exponentialRampToValueAtTime(48, now + duration);
  const osc2Gain = ctx.createGain();
  osc2Gain.gain.value = 0.4;
  osc2.connect(osc2Gain).connect(shaper);

  // Vibrato wobble ("aaAAaaAA") sustained through the hold.
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 13;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 20;
  lfo.connect(lfoGain).connect(osc.frequency);

  [osc, osc2, lfo].forEach((o) => o.start(now));
  [osc, osc2, lfo].forEach((o) => o.stop(now + duration + 0.05));
}
