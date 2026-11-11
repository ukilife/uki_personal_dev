"use client";

import { motion } from "motion/react";
import { BellRing, Pause, Play, RotateCcw } from "lucide-react";
import { useLocalState } from "@/lib/useLocalState";
import { PrivateBadge, Reveal, Stop } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";
import { timerLabel, useTimer } from "@/lib/useTimer";

const PRESETS = [60, 120, 180, 300];
const STARTERS = ["I realised I am good at…", "I want to improve…", "Something that surprised me today…"];

export type CheckpointState = string[];

const onDone = () => celebrate("small");

export function Checkpoint() {
  const timer = useTimer({ mode: "down", seconds: 180, onAlarm: onDone });
  const [answers, setAnswers] = useLocalState<CheckpointState>("s1-checkpoint", ["", "", ""]);
  const { running, ringing, started, mode } = timer;

  const elapsed = Math.floor(timer.elapsed / 1000);
  const breathingIn = Math.floor(elapsed / 4) % 2 === 0;
  const pct = mode === "down" ? timer.progress : (elapsed % 60) / 60;

  return (
    <Stop
      id="checkpoint"
      stop={10}
      kicker="Checkpoint · Reflect"
      tone="ink"
      title={
        <>
          One thing I discovered <span className="text-sun">today…</span>
        </>
      }
      intro="A few calm minutes — pick how long, and the alarm tells you when time's up. No phones, no talking — just you and your thoughts. Breathe with the orb, then finish the sentences."
      aside={<PrivateBadge className="bg-white/90" />}
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
        <Reveal className="flex flex-col items-center">
          <div className="relative grid h-72 w-72 place-items-center">
            <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
              <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="3" />
              <motion.circle
                cx="50"
                cy="50"
                r="47"
                fill="none"
                stroke="#ffc93c"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 47}
                animate={{ strokeDashoffset: 2 * Math.PI * 47 * (1 - pct) }}
              />
            </svg>
            <motion.div
              className="grid place-items-center rounded-full bg-gradient-to-br from-teal to-sky-deep"
              animate={
                running
                  ? { width: breathingIn ? 220 : 120, height: breathingIn ? 220 : 120, opacity: 1 }
                  : { width: 150, height: 150, opacity: 0.85 }
              }
              transition={{ duration: running ? 4 : 0.6, ease: "easeInOut" }}
              style={{ boxShadow: "0 0 80px rgba(31,157,138,.55)" }}
            >
              <div className="text-center">
                <p className="font-display text-4xl font-bold tabular-nums">{timerLabel(timer)}</p>
                <p className="text-sm font-semibold text-cream/80">
                  {ringing ? "Time's up 🌿" : running ? (breathingIn ? "breathe in…" : "breathe out…") : "ready?"}
                </p>
              </div>
            </motion.div>
          </div>
          {!running && !ringing && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {PRESETS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    timer.setMode("down");
                    timer.setTarget(s);
                  }}
                  className={`rounded-full border-2 px-3 py-1 text-sm font-bold ${
                    mode === "down" && timer.target === s ? "border-sun bg-sun text-ink" : "border-white/25 hover:border-white/60"
                  }`}
                >
                  ⏳ {s / 60} min
                </button>
              ))}
              <button
                onClick={() => timer.setMode("up")}
                className={`rounded-full border-2 px-3 py-1 text-sm font-bold ${
                  mode === "up" ? "border-sun bg-sun text-ink" : "border-white/25 hover:border-white/60"
                }`}
              >
                ⏱ Stopwatch
              </button>
            </div>
          )}
          <div className="mt-4 flex gap-3">
            {ringing ? (
              <motion.button
                onClick={timer.reset}
                animate={{ rotate: [0, -4, 4, -4, 0] }}
                transition={{ type: "tween", duration: 0.6, repeat: Infinity, repeatDelay: 0.3 }}
                className="btn-pop flex items-center gap-2 rounded-2xl border-2 border-ink bg-coral px-5 py-3 font-display font-semibold text-white"
              >
                <BellRing size={18} /> Stop alarm
              </motion.button>
            ) : (
              <button
                onClick={timer.toggle}
                className="btn-pop flex items-center gap-2 rounded-2xl border-2 border-ink bg-sun px-5 py-3 font-display font-semibold text-ink"
              >
                {running ? <Pause size={18} /> : <Play size={18} />}
                {running
                  ? "Pause"
                  : started
                    ? "Resume"
                    : mode === "down"
                      ? `Start ${timer.target / 60} calm minute${timer.target === 60 ? "" : "s"}`
                      : "Start"}
              </button>
            )}
            {started && !ringing && (
              <button
                onClick={timer.reset}
                className="flex items-center gap-1 rounded-2xl border-2 border-white/30 px-4 text-sm font-semibold"
              >
                <RotateCcw size={16} /> Reset
              </button>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="space-y-4">
          {STARTERS.map((s, i) => (
            <label key={s} className="block rounded-3xl border-2 border-white/15 bg-white/5 p-4 transition focus-within:border-sun focus-within:bg-white/10">
              <span className="font-display text-lg font-semibold text-sun">{s}</span>
              <textarea
                value={answers[i] ?? ""}
                onChange={(e) => setAnswers((a) => a.map((v, j) => (j === i ? e.target.value : v)))}
                rows={2}
                maxLength={200}
                className="mt-1 w-full resize-none bg-transparent text-lg text-cream outline-none placeholder:text-cream/30"
                placeholder="…"
              />
            </label>
          ))}
          <p className="pt-2 font-display text-2xl leading-snug font-semibold">
            You don&apos;t have to be perfect.{" "}
            <span className="text-sun">You just have to keep growing.</span> 🌱
          </p>
        </Reveal>
      </div>
    </Stop>
  );
}
