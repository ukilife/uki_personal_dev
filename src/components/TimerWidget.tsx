"use client";

import { motion } from "motion/react";
import { BellRing, Hourglass, Minus, Pause, Play, Plus, RotateCcw, Timer as TimerIcon } from "lucide-react";
import { timerLabel, type Timer } from "@/lib/useTimer";

const DEFAULT_PRESETS = [60, 120, 180, 300, 600];

/** Stopwatch ⇄ countdown with an alarm. Pair with `useTimer()`. */
export function TimerWidget({
  timer: t,
  label,
  presets = DEFAULT_PRESETS,
  className = "",
}: {
  timer: Timer;
  label: string;
  presets?: number[];
  className?: string;
}) {
  const down = t.mode === "down";
  const editable = down && !t.running && !t.ringing;

  return (
    <motion.div
      animate={t.ringing ? { rotate: [0, -3, 3, -3, 3, 0] } : { rotate: 0 }}
      transition={t.ringing ? { type: "tween", duration: 0.6, repeat: Infinity, repeatDelay: 0.3 } : { duration: 0.2 }}
      className={`w-full shrink-0 rounded-3xl border-2 border-ink p-3 text-ink shadow-pop sm:w-72 ${
        t.ringing ? "bg-coral" : "bg-white"
      } ${className}`}
    >
      {/* mode switch */}
      <div className="grid grid-cols-2 gap-1 rounded-2xl border-2 border-ink bg-cream p-1 text-xs font-bold">
        {(
          [
            ["up", "Stopwatch", TimerIcon],
            ["down", "Countdown", Hourglass],
          ] as const
        ).map(([m, name, Icon]) => (
          <button
            key={m}
            onClick={() => t.setMode(m)}
            aria-pressed={t.mode === m}
            className={`flex items-center justify-center gap-1 rounded-xl px-2 py-1.5 transition ${
              t.mode === m ? "bg-ink text-cream" : "text-ink-soft hover:bg-white"
            }`}
          >
            <Icon size={13} /> {name}
          </button>
        ))}
      </div>

      {/* time */}
      <div className="mt-2 flex items-center justify-between gap-2">
        {editable && (
          <button
            aria-label="Less time"
            onClick={() => t.setTarget(t.target - 30)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border-2 border-ink bg-cream"
          >
            <Minus size={16} />
          </button>
        )}
        <div className="min-w-0 flex-1 text-center">
          <p className={`font-display text-4xl font-bold tabular-nums ${t.ringing ? "text-white" : ""}`}>
            {t.ringing ? "Time's up!" : timerLabel(t)}
          </p>
          <p className={`text-[10px] font-semibold tracking-widest uppercase ${t.ringing ? "text-white/90" : "text-ink-soft"}`}>
            {t.ringing ? "⏰ alarm ringing" : label}
          </p>
        </div>
        {editable && (
          <button
            aria-label="More time"
            onClick={() => t.setTarget(t.target + 30)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border-2 border-ink bg-cream"
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {down && (
        <div className="mt-2 h-2 overflow-hidden rounded-full border border-ink/30 bg-cream">
          <div className="h-full bg-gradient-to-r from-teal via-sun to-coral transition-[width]" style={{ width: `${t.progress * 100}%` }} />
        </div>
      )}

      {editable && !t.ringing && (
        <div className="mt-2 flex flex-wrap justify-center gap-1">
          {presets.map((s) => (
            <button
              key={s}
              onClick={() => t.setTarget(s)}
              className={`rounded-full border-2 px-2 py-0.5 text-xs font-bold ${
                t.target === s ? "border-ink bg-sun" : "border-ink/20 bg-white hover:border-ink"
              }`}
            >
              {s >= 60 ? `${s / 60}m` : `${s}s`}
            </button>
          ))}
        </div>
      )}

      {/* controls */}
      <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
        {t.ringing ? (
          <button
            onClick={t.reset}
            className="btn-pop flex items-center justify-center gap-1.5 rounded-2xl border-2 border-ink bg-white px-3 py-2 font-display font-semibold"
          >
            <BellRing size={16} /> Stop alarm
          </button>
        ) : (
          <button
            onClick={t.toggle}
            className={`btn-pop flex items-center justify-center gap-1.5 rounded-2xl border-2 border-ink px-3 py-2 font-display font-semibold ${
              t.running ? "bg-coral text-white" : "bg-teal text-white"
            }`}
          >
            {t.running ? <Pause size={16} /> : <Play size={16} />}
            {t.running ? "Pause" : t.started ? "Resume" : "Go!"}
          </button>
        )}
        <button
          aria-label="Reset timer"
          title="Reset"
          onClick={t.reset}
          className="grid w-11 place-items-center rounded-2xl border-2 border-ink bg-white"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </motion.div>
  );
}
