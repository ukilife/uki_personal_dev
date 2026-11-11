"use client";

/** Tiny Web Audio alarm — no sound files needed. */
let ctx: AudioContext | null = null;
let out: GainNode | null = null;

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

/** Call from a click/tap so the browser allows sound later. */
export function primeAlarm() {
  const c = getCtx();
  if (c && c.state === "suspended") void c.resume();
}

/** Rings a cheerful "beep-beep-beep" pattern a few times. */
export function playAlarm(rounds = 4) {
  const c = getCtx();
  if (!c) return;
  stopAlarm();
  if (c.state === "suspended") void c.resume();
  const gain = c.createGain();
  gain.gain.value = 0.18;
  gain.connect(c.destination);
  out = gain;
  const t0 = c.currentTime + 0.05;
  for (let r = 0; r < rounds; r++) {
    for (let b = 0; b < 3; b++) {
      const start = t0 + r * 1 + b * 0.16;
      const osc = c.createOscillator();
      const env = c.createGain();
      osc.type = "square";
      osc.frequency.value = b === 2 ? 1320 : 990;
      env.gain.setValueAtTime(0, start);
      env.gain.linearRampToValueAtTime(1, start + 0.01);
      env.gain.setValueAtTime(1, start + 0.1);
      env.gain.linearRampToValueAtTime(0, start + 0.12);
      osc.connect(env).connect(gain);
      osc.start(start);
      osc.stop(start + 0.13);
    }
  }
}

export function stopAlarm() {
  if (out) {
    try {
      out.disconnect();
    } catch {
      /* already gone */
    }
    out = null;
  }
}
