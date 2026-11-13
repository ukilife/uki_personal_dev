"use client";

import { motion } from "motion/react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useLocalState, useStoredSnapshot } from "@/lib/useLocalState";
import { timerLabel, useTimer } from "@/lib/useTimer";
import { Button, Reveal, Stop } from "@/components/ui";
import { SAFETY } from "./Toolkit";

type MissionState = { partner: string; area: string; backBy: string };
const MISSION_EMPTY: MissionState = { partner: "", area: "", backBy: "" };

const MINUTES = 60;
/** wall-clock time `min` minutes from now, e.g. "10:45" */
const clockIn = (min: number) => new Date(Date.now() + min * 60_000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const PLAN = [
  { from: 0, to: 25, emoji: "🧓", t: "Find your person", d: "Opener → their story → hardship → how they overcame it → advice." },
  { from: 25, to: 50, emoji: "🏪", t: "Find your business", d: "Idea → first step → competition → hard times → advice for a future entrepreneur." },
  { from: 50, to: 60, emoji: "🏃", t: "Head back", d: "Walk back now. Fill in the gaps in your notes while it's fresh." },
];

export function Mission() {
  const [m, setM] = useLocalState<MissionState>("s4-mission", MISSION_EMPTY);
  const safety = useStoredSnapshot<boolean[]>("s4-safety", []);
  const safeOk = SAFETY.every((_, i) => safety[i]);
  const timer = useTimer({ mode: "down", seconds: MINUTES * 60 });
  const minsIn = (timer.elapsed / 60000) | 0;
  const phase = PLAN.findIndex((p) => minsIn >= p.from && minsIn < p.to);

  const go = () => {
    if (!timer.started) setM((p) => ({ ...p, backBy: clockIn(MINUTES) }));
    timer.toggle();
  };

  const field = "mt-1 w-full rounded-xl border-2 border-ink bg-white px-3 py-2 outline-none focus:ring-4 focus:ring-sun/60";

  return (
    <Stop
      id="mission"
      stop={4}
      kicker="The real-world mission"
      tone="ink"
      title={
        <>
          One hour. Two conversations. <span className="text-sun">Go.</span> ⏱️
        </>
      }
      intro="Walk around with your partner, talk to ONE person about their life and ONE business owner about their journey. When the alarm rings, come back — you'll present what you found."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] [&>*]:min-w-0">
        <Reveal>
          <div className="rounded-[2rem] border-2 border-cream/25 bg-white/5 p-5">
            <p className="font-display text-xl font-bold text-sun">Before you leave</p>
            <label className="mt-3 block text-sm font-semibold">
              My partner
              <input value={m.partner} onChange={(e) => setM((p) => ({ ...p, partner: e.target.value }))} maxLength={30} placeholder="Name" className={field + " text-ink"} />
            </label>
            <label className="mt-3 block text-sm font-semibold">
              Our area
              <input
                value={m.area}
                onChange={(e) => setM((p) => ({ ...p, area: e.target.value }))}
                maxLength={50}
                placeholder="e.g. Main street market, bus stand"
                className={field + " text-ink"}
              />
            </label>
            <p className={`mt-4 rounded-xl px-3 py-2 text-sm font-semibold ${safeOk ? "bg-teal text-white" : "bg-coral/90 text-white"}`}>
              {safeOk ? "🛡️ Safety promise made." : "🛡️ Tick all the safety promises in the Toolkit before you go."}
            </p>
            <div className="mt-5 space-y-2">
              {PLAN.map((p, i) => (
                <div
                  key={p.t}
                  className={`flex gap-3 rounded-2xl border-2 p-3 transition ${
                    timer.started && phase === i ? "border-sun bg-sun text-ink" : "border-cream/20"
                  }`}
                >
                  <span className="text-2xl">{p.emoji}</span>
                  <span>
                    <span className="block text-xs font-bold opacity-70">
                      MIN {p.from}–{p.to}
                    </span>
                    <span className="block font-display font-bold">{p.t}</span>
                    <span className={`block text-sm ${timer.started && phase === i ? "" : "text-cream/70"}`}>{p.d}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <motion.div
            animate={timer.ringing ? { rotate: [0, -2, 2, -2, 2, 0] } : { rotate: 0 }}
            transition={timer.ringing ? { type: "tween", duration: 0.6, repeat: Infinity } : { duration: 0.2 }}
            className={`rounded-[2.5rem] border-4 border-ink p-6 text-center text-ink shadow-pop-lg sm:p-8 ${timer.ringing ? "bg-coral" : "bg-cream"}`}
          >
            <p className="font-display text-sm font-bold tracking-[0.2em] text-ink-soft uppercase">Mission clock</p>
            <p className="mt-2 font-display text-7xl font-bold tabular-nums sm:text-8xl" aria-live="polite">
              {timer.ringing ? "00:00" : timerLabel(timer)}
            </p>
            <div className="mx-auto mt-4 h-4 max-w-sm overflow-hidden rounded-full border-2 border-ink bg-white">
              <div className="h-full bg-coral transition-[width]" style={{ width: `${timer.progress * 100}%` }} />
            </div>
            {m.backBy && timer.started && <p className="mt-4 font-display text-2xl font-bold">Be back by {m.backBy} 🏫</p>}
            {timer.ringing && <p className="mt-2 font-display text-xl font-bold">⏰ Time&apos;s up — head back and get ready to present!</p>}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {timer.ringing ? (
                <Button
                  variant="ink"
                  onClick={() => {
                    timer.dismiss();
                    timer.reset();
                  }}
                >
                  Stop alarm
                </Button>
              ) : (
                <Button variant="coral" onClick={go} className="px-8 py-4 text-lg">
                  {timer.running ? <Pause size={20} /> : <Play size={20} />}
                  {timer.running ? "Pause" : timer.started ? "Resume" : `Start the ${MINUTES}-minute mission`}
                </Button>
              )}
              {timer.started && !timer.ringing && (
                <Button
                  variant="white"
                  onClick={() => {
                    if (window.confirm("Reset the mission clock?")) {
                      timer.reset();
                      setM((p) => ({ ...p, backBy: "" }));
                    }
                  }}
                >
                  <RotateCcw size={18} /> Reset
                </Button>
              )}
            </div>
            <p className="mt-4 text-xs text-ink-soft">Keep this page open — the alarm rings at zero. Your notes go in the cards below.</p>
          </motion.div>
        </Reveal>
      </div>
    </Stop>
  );
}
