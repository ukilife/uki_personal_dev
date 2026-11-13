"use client";

import { motion } from "motion/react";
import { ArrowDown, Building } from "lucide-react";
import { useLocalState } from "@/lib/useLocalState";
import { Button, Pill } from "@/components/ui";

export const COURAGE_FACES = ["😰", "😟", "😐", "🙂", "😎"];

const BUBBLES = [
  { t: "Hi! Can I ask you something?", x: "4%", y: "6%", bg: "bg-white" },
  { t: "What's your story?", x: "52%", y: "16%", bg: "bg-sun" },
  { t: "How did you start?", x: "10%", y: "44%", bg: "bg-teal-soft" },
  { t: "Any advice for me?", x: "50%", y: "56%", bg: "bg-lilac" },
];

export function Hero() {
  const [before, setBefore] = useLocalState<number | null>("s4-courage-before", null);
  return (
    <section id="start" data-stop="start" className="relative overflow-hidden bg-blush/70">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-70" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-16 pb-24 sm:px-8 md:grid-cols-[1.1fr_1fr] md:pt-24 lg:pl-28">
        <div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Pill className="bg-white text-ink">
              <Building size={14} /> Session 04 · The Courage City
            </Pill>
          </motion.div>
          <motion.h1
            className="mt-6 text-6xl leading-[0.95] font-bold sm:text-7xl md:text-8xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 90 }}
          >
            Talk to a <span className="squiggle text-coral">Stranger</span>
          </motion.h1>
          <motion.p
            className="mt-6 max-w-xl text-xl leading-relaxed text-ink-soft"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Every person you walk past has lived a whole life you know nothing about. Today you go out, ask, listen — and come
            back carrying their stories.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 grid max-w-lg grid-cols-3 gap-2 text-center"
          >
            {[
              ["🧓", "1 person", "their life story"],
              ["🏪", "1 business", "their journey"],
              ["⏱️", "60 min", "then present"],
            ].map(([e, t, s]) => (
              <div key={t} className="rounded-2xl border-2 border-ink bg-white p-3 shadow-pop">
                <span className="text-3xl">{e}</span>
                <p className="font-display font-bold">{t}</p>
                <p className="text-xs text-ink-soft">{s}</p>
              </div>
            ))}
          </motion.div>
          <motion.div className="mt-8 flex flex-wrap items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <a href="#why">
              <Button variant="coral">
                Find my courage <ArrowDown size={18} />
              </Button>
            </a>
          </motion.div>
        </div>

        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 80 }}
            className="relative mx-auto aspect-[4/3] w-full max-w-md"
            aria-hidden
          >
            <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full">
              <rect x="10" y="70" width="34" height="80" fill="#2f7fc1" stroke="#23204e" strokeWidth="2.5" />
              <rect x="44" y="92" width="30" height="58" fill="#ffc93c" stroke="#23204e" strokeWidth="2.5" />
              <rect x="80" y="54" width="36" height="96" fill="#7b3fa0" stroke="#23204e" strokeWidth="2.5" />
              <rect x="122" y="84" width="30" height="66" fill="#1f9d8a" stroke="#23204e" strokeWidth="2.5" />
              <rect x="152" y="66" width="38" height="84" fill="#f7845e" stroke="#23204e" strokeWidth="2.5" />
              {[16, 28, 86, 100, 158, 172].map((x, i) =>
                [80, 96, 112].map((y) => <rect key={`${i}-${y}`} x={x} y={y + (i % 2) * 4} width="7" height="8" fill="#fff8ec" opacity="0.85" />),
              )}
            </svg>
            {BUBBLES.map((b, i) => (
              <motion.span
                key={b.t}
                className={`absolute rounded-2xl rounded-bl-sm border-2 border-ink px-3 py-1.5 font-display text-sm font-bold whitespace-nowrap shadow-pop ${b.bg}`}
                style={{ left: b.x, top: b.y }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
                transition={{
                  opacity: { delay: 0.7 + i * 0.4 },
                  scale: { delay: 0.7 + i * 0.4, type: "spring" },
                  y: { type: "tween", delay: 0.7 + i * 0.4, duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" },
                }}
              >
                {b.t}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mx-auto mt-4 max-w-md rounded-[1.75rem] border-2 border-ink bg-white p-4 shadow-pop"
          >
            <p className="font-display font-bold">Right now, how brave do you feel about talking to a stranger?</p>
            <div className="mt-3 flex justify-between gap-1" role="radiogroup" aria-label="Courage before the mission">
              {COURAGE_FACES.map((f, i) => (
                <button
                  key={f}
                  role="radio"
                  aria-checked={before === i}
                  aria-label={`${i + 1} of 5`}
                  onClick={() => setBefore(i)}
                  className={`grid h-12 flex-1 place-items-center rounded-xl border-2 text-2xl transition ${
                    before === i ? "-translate-y-1 border-ink bg-sun shadow-pop" : "border-ink/15 hover:border-ink"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-ink-soft">We&apos;ll ask again at the end. 😉</p>
          </motion.div>
        </div>
      </div>

      <div className="relative overflow-hidden border-y-2 border-ink bg-ink py-3 text-cream">
        <div className="flex w-max animate-marquee gap-8 font-display text-lg font-semibold whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-8">
              {["Every person has a story", "✦ Ask", "✦ Listen", "✦ Learn", "✦ Share", "✦ Courage grows by doing", "✦"].map((t) => (
                <span key={t + k}>{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
