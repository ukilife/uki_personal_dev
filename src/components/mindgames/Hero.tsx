"use client";

import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { ButtonLink, Pill, Reveal } from "@/components/ui";
import { BOSS_COUNT, MIND_GAMES } from "@/lib/mindGames";

const FLOATERS = ["🎨", "🧩", "🗼", "🤖", "⚖️", "💡", "🫧", "🧠", "🔀", "⏱️"];

export function MindGamesHero() {
  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-ink text-cream">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-20" />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {FLOATERS.map((e, i) => (
          <motion.span
            key={e}
            className="absolute hidden text-4xl sm:block"
            style={{ left: `${i % 2 ? 84 + (i % 3) * 4 : 3 + (i % 3) * 4}%`, top: `${8 + Math.floor(i / 2) * 18}%`, opacity: 0.55 }}
            animate={{ y: [0, -14, 0], rotate: [0, i % 2 ? 12 : -12, 0] }}
            transition={{ type: "tween", duration: 5 + (i % 4), repeat: Infinity, ease: "easeInOut" }}
          >
            {e}
          </motion.span>
        ))}
      </div>
      <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-8 md:py-28">
        <Reveal>
          <Pill className="bg-white/10 text-sun">Brain breaks · between lessons</Pill>
          <h1 className="mt-5 text-5xl leading-[1.02] font-bold sm:text-7xl">
            Mind <span className="squiggle text-sun">Games</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-cream/80">
            Feeling sleepy in class? Wake your brain up with {MIND_GAMES.length} games — including {BOSS_COUNT} harder{" "}
            <b className="text-sun">🔥 Brain Boss</b> challenges. Each one is fun — and each one secretly trains a
            real quality like <b className="text-cream">focus</b>, <b className="text-cream">planning</b>, <b className="text-cream">patience</b> or{" "}
            <b className="text-cream">teamwork</b>.
          </p>
          <div className="mt-9">
            <ButtonLink href="#games" className="px-7 py-4 text-lg">
              Choose a game <ArrowDown size={20} />
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const STEPS = [
  { e: "⏰", t: "2–5 minutes", d: "Use a game whenever energy drops — between lessons, after lunch, before a test.", bg: "bg-sun" },
  { e: "🎮", t: "Play", d: "On the projector for the whole class, or on one device for a pair or small group.", bg: "bg-sky" },
  { e: "✨", t: "Name the skill", d: "Every game shows the quality it trains. Say it out loud: “That was focus.”", bg: "bg-blush" },
  { e: "💬", t: "Talk for 1 minute", d: "Ask the ‘Talk about it’ question. That’s where the game turns into a lesson.", bg: "bg-mint" },
];

export function HowToUse() {
  return (
    <section className="border-b-2 border-ink bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-8">
        <Reveal>
          <p className="font-display text-sm font-bold tracking-[0.2em] text-grape uppercase">For teachers & students</p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Not just games — a 4-step brain break</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.06}>
              <div className={`h-full rounded-3xl border-2 border-ink p-5 ${s.bg}`}>
                <span className="text-3xl">{s.e}</span>
                <h3 className="mt-2 text-xl font-bold">
                  {i + 1}. {s.t}
                </h3>
                <p className="mt-1 text-sm text-ink-soft">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
