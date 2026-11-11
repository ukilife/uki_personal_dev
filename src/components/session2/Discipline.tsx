"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Reveal, Stop } from "@/components/ui";

/** Motivation: big spikes, deep dips. Discipline: small, steady, always up. */
const DAYS = 30;
const motivation = (d: number) => 55 + 38 * Math.sin(d / 2.1) * Math.exp(-d / 40) - d * 0.9;
const discipline = (d: number) => 8 + d * 2.6;

const toPath = (f: (d: number) => number) =>
  Array.from(
    { length: DAYS + 1 },
    // rounded so server and client produce the exact same string (no hydration mismatch)
    (_, d) => `${d === 0 ? "M" : "L"}${Math.round((d / DAYS) * 300)} ${(100 - Math.max(0, Math.min(100, f(d)))).toFixed(1)}`,
  ).join(" ");

export function Discipline() {
  const [days, setDays] = useState(100);
  const better = Math.pow(1.01, days);
  const worse = Math.pow(0.99, days);

  return (
    <Stop
      id="discipline"
      stop={2}
      kicker="The importance of discipline"
      tone="ink"
      title={
        <>
          Motivation gets you started. <span className="text-sun">Discipline</span> keeps you going.
        </>
      }
      intro="Motivation is a feeling — it comes and goes like the weather. Discipline is a decision: doing what you said you'd do, even when you don't feel like it."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Chart */}
        <Reveal>
          <div className="rounded-[2rem] border-2 border-cream/30 bg-white/5 p-5 sm:p-6">
            <p className="font-display text-lg font-bold">30 days of trying to get fit 🏃</p>
            <svg viewBox="-4 -6 312 116" className="mt-4 w-full overflow-visible" role="img" aria-label="Motivation rises and falls over 30 days while discipline climbs steadily">
              {[0, 50, 100].map((y) => (
                <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="#fff8ec" strokeOpacity="0.12" strokeDasharray="3 4" />
              ))}
              <motion.path
                d={toPath(motivation)}
                fill="none"
                stroke="#f7845e"
                strokeWidth="3.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
              />
              <motion.path
                d={toPath(discipline)}
                fill="none"
                stroke="#ffc93c"
                strokeWidth="3.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2.2, delay: 0.4, ease: "easeInOut" }}
              />
              <text x="4" y="8" fill="#f7845e" fontSize="9" fontWeight="700">Motivation</text>
              <text x="236" y="16" fill="#ffc93c" fontSize="9" fontWeight="700">Discipline</text>
              <text x="0" y="112" fill="#fff8ec" fillOpacity="0.6" fontSize="7">Day 1</text>
              <text x="282" y="112" fill="#fff8ec" fillOpacity="0.6" fontSize="7">Day 30</text>
            </svg>
            <ul className="mt-5 space-y-2 text-cream/85">
              <li>
                <b className="text-coral">Day 1:</b> “I&apos;m SO ready!” 🔥 Motivation is sky-high.
              </li>
              <li>
                <b className="text-coral">Day 6:</b> Rainy, tired, phone is calling. Motivation crashes. Most people quit here.
              </li>
              <li>
                <b className="text-sun">Discipline:</b> shows up anyway — 10 minutes, not perfect, but done. Day after day, it adds up.
              </li>
            </ul>
          </div>
        </Reveal>

        {/* 1% rule */}
        <Reveal delay={0.1}>
          <div className="h-full rounded-[2rem] border-2 border-ink bg-cream p-5 text-ink shadow-pop sm:p-6">
            <p className="font-display text-sm font-bold tracking-[0.2em] text-grape uppercase">Eye-opener · The 1% rule</p>
            <h3 className="mt-1 text-3xl font-bold">What does 1% a day really do?</h3>
            <label className="mt-5 block">
              <span className="flex justify-between font-semibold">
                <span>Number of days</span>
                <span className="font-display text-xl tabular-nums">{days}</span>
              </span>
              <input
                type="range"
                min={1}
                max={365}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="mt-2 w-full accent-grape"
              />
            </label>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border-2 border-ink bg-teal-soft p-4 text-center">
                <p className="text-sm font-semibold">1% better every day</p>
                <motion.p key={days} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="font-display text-4xl font-bold text-teal tabular-nums">
                  ×{better.toFixed(better < 10 ? 2 : 1)}
                </motion.p>
              </div>
              <div className="rounded-2xl border-2 border-ink bg-blush p-4 text-center">
                <p className="text-sm font-semibold">1% worse every day</p>
                <motion.p key={-days} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="font-display text-4xl font-bold text-coral tabular-nums">
                  ×{worse.toFixed(2)}
                </motion.p>
              </div>
            </div>
            <p className="mt-4 text-ink-soft">
              {days >= 300 ? (
                <>
                  After a year, tiny daily discipline makes you about <b className="text-ink">{Math.round(better)} times</b> better. Skipping a
                  little every day leaves almost nothing. 🤯
                </>
              ) : (
                <>Drag the slider to 365 and watch what small, boring, daily choices do over one year.</>
              )}
            </p>
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["🪥", "You already have discipline", "You brush your teeth even when you don't feel like it. That's discipline — just aim it at your dreams."],
            ["🧱", "Discipline is built, not born", "Start tiny. 5 minutes of reading beats a 2-hour plan you never start."],
            ["🕊️", "Discipline = freedom", "The student who studies a little every day doesn't panic the night before the exam."],
          ].map(([e, t, b]) => (
            <div key={t} className="rounded-[1.75rem] border-2 border-cream/25 bg-white/5 p-5">
              <span className="text-3xl">{e}</span>
              <p className="mt-2 font-display text-xl font-bold text-sun">{t}</p>
              <p className="text-cream/80">{b}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </Stop>
  );
}
