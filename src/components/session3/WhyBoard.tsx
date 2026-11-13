"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Reveal, Stop } from "@/components/ui";

const PIECES = [
  { id: "dreams", emoji: "🌟", name: "Dreams", q: "What do I want to see, do and become?", sam: "Design book covers · Visit Japan · Have my own art studio", bg: "bg-sun-soft" },
  { id: "values", emoji: "🧭", name: "Values", q: "What matters most to me — even when nobody is watching?", sam: "Creativity · Honesty · Family", bg: "bg-sky" },
  { id: "personality", emoji: "🎭", name: "Personality", q: "How am I wired? How do I think, work and recharge?", sam: "Calm · Curious · Detail-lover · Recharges alone", bg: "bg-lilac" },
  { id: "strengths", emoji: "💪", name: "Strengths", q: "What am I already good at that will carry me there?", sam: "Drawing · Patience · Noticing small details", bg: "bg-teal-soft" },
  { id: "goals", emoji: "🎯", name: "Future goals", q: "Which real steps turn my dreams into a plan?", sam: "1 yr: join the art club · 5 yrs: design diploma · 10 yrs: own studio", bg: "bg-blush" },
];

export function WhyBoard() {
  const [open, setOpen] = useState(PIECES[0].id);
  const p = PIECES.find((x) => x.id === open)!;
  return (
    <Stop
      id="why"
      stop={1}
      kicker="Why a dream board?"
      tone="cream"
      title={
        <>
          What you <span className="text-teal">see</span> every day, you <span className="text-coral">work towards.</span>
        </>
      }
      intro="A dream board is a picture of your future that you can look at every single day. It won't do the work for you — but it reminds you WHY you're doing the work."
    >
      <Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["👀", "It keeps your goals in sight", "Out of sight, out of mind. A board on the wall brings your dreams back into your head every day."],
            ["🧩", "It joins all the pieces", "Sessions 1 and 2 gave you strengths, a SWOT and a bucket list. Today they become one clear picture."],
            ["🔥", "It fuels your discipline", "On the hard days of your 21-day challenge, one look at your board reminds you what it's for."],
          ].map(([e, t, b], i) => (
            <motion.div key={t} whileHover={{ y: -4, rotate: i === 1 ? 0 : i ? 1 : -1 }} className="rounded-[1.75rem] border-2 border-ink bg-white p-5 shadow-pop">
              <span className="text-4xl">{e}</span>
              <p className="mt-2 font-display text-xl font-bold">{t}</p>
              <p className="text-ink-soft">{b}</p>
            </motion.div>
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-12">
        <h3 className="text-3xl font-bold">The 5 pieces of your board</h3>
        <p className="mt-1 text-ink-soft">Tap each piece. You&apos;ll also see Sam&apos;s answer — remember Sam, the artist from last week&apos;s SWOT?</p>
        <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
            {PIECES.map((x, i) => {
              const on = x.id === open;
              return (
                <button
                  key={x.id}
                  onClick={() => setOpen(x.id)}
                  aria-pressed={on}
                  className={`flex items-center gap-3 rounded-2xl border-2 border-ink p-3 text-left transition ${
                    on ? `-translate-y-1 shadow-pop ${x.bg}` : "bg-white hover:bg-cream"
                  }`}
                >
                  <span className="text-3xl">{x.emoji}</span>
                  <span>
                    <span className="block text-xs font-bold text-ink-soft">PIECE {i + 1}</span>
                    <span className="block font-display text-lg leading-tight font-bold">{x.name}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className={`rounded-[2rem] border-2 border-ink p-6 shadow-pop ${p.bg}`}
            >
              <span className="text-5xl">{p.emoji}</span>
              <h4 className="mt-2 text-3xl font-bold">{p.name}</h4>
              <p className="mt-1 font-display text-xl font-semibold">“{p.q}”</p>
              <div className="mt-5 rounded-2xl border-2 border-dashed border-ink/30 bg-white/80 p-4">
                <p className="text-xs font-bold tracking-widest text-ink-soft uppercase">🎨 Sam&apos;s board says</p>
                <p className="mt-1 font-semibold">{p.sam}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </Stop>
  );
}
