"use client";

import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui";

/** Every game gets this: call onDone when a round ends so the hub can mark it played. */
export type GameProps = { onDone: (summary: string) => void };

export const now = () => performance.now();
export const chance = (p: number) => Math.random() < p;
export const rand = (a: number, b: number) => a + Math.random() * (b - a);
export const randInt = (a: number, b: number) => Math.floor(rand(a, b + 1));
export const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let audio: AudioContext | null = null;
/** A short soft tone (no sound files). Call from a tap so browsers allow audio. */
export function tone(freq: number, ms = 300) {
  if (typeof window === "undefined") return;
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    audio ??= new AC();
    if (audio.state === "suspended") void audio.resume();
    const t = audio.currentTime;
    const osc = audio.createOscillator();
    const g = audio.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + ms / 1000);
    osc.connect(g).connect(audio.destination);
    osc.start(t);
    osc.stop(t + ms / 1000 + 0.05);
  } catch {
    /* audio blocked — games still work silently */
  }
}

/** The big rounded play area every game sits in. */
export function Stage({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative flex min-h-[22rem] flex-col items-center justify-center overflow-hidden rounded-[1.75rem] border-2 border-ink bg-paper p-5 text-center sm:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

export function StartCard({ emoji, title, children, onStart, cta = "Start" }: { emoji: string; title: string; children?: ReactNode; onStart: () => void; cta?: string }) {
  return (
    <div className="max-w-md">
      <span className="text-6xl">{emoji}</span>
      <p className="mt-2 font-display text-2xl font-bold">{title}</p>
      {children && <div className="mt-2 text-ink-soft">{children}</div>}
      <Button className="mt-5" variant="grape" onClick={onStart}>
        {cta}
      </Button>
    </div>
  );
}

export function ResultCard({ emoji, title, children, onAgain }: { emoji: string; title: ReactNode; children?: ReactNode; onAgain: () => void }) {
  return (
    <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md">
      <span className="text-6xl">{emoji}</span>
      <p className="mt-2 font-display text-2xl font-bold">{title}</p>
      {children && <div className="mt-2 text-ink-soft">{children}</div>}
      <Button className="mt-5" variant="white" onClick={onAgain}>
        <RotateCcw size={16} /> Play again
      </Button>
    </motion.div>
  );
}

/** Small "Round 3/10 · Score 4" bar. */
export function Hud({ items }: { items: [string, ReactNode][] }) {
  return (
    <div className="absolute top-3 right-3 left-3 flex justify-between gap-2 text-sm font-bold">
      {items.map(([k, v]) => (
        <span key={k} className="rounded-full border-2 border-ink bg-white px-3 py-1">
          {k} <span className="tabular-nums">{v}</span>
        </span>
      ))}
    </div>
  );
}

export function Bar({ pct, className = "bg-grape" }: { pct: number; className?: string }) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full border-2 border-ink bg-white">
      <div className={`h-full transition-[width] duration-100 ${className}`} style={{ width: `${Math.max(0, Math.min(1, pct)) * 100}%` }} />
    </div>
  );
}
