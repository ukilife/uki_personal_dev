"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { useLocalState, useStoredSnapshot } from "@/lib/useLocalState";
import { ButtonLink, PrivateBadge, Reveal, Stop } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";
import { SESSIONS, SESSION_FOUR_MISSIONS } from "@/lib/sessions";
import { COURAGE_FACES } from "./Hero";

const QUESTIONS = [
  { q: "How did I feel just before my first conversation?", ph: "My hands were shaking…" },
  { q: "Which moment will I remember most — and why?", ph: "When the shop owner said…" },
  { q: "How does what I heard connect to my own dream board?", ph: "She started small too, so I can…" },
];

const MISSIONS = [
  { n: "01", title: "Say thank you", text: "If you can, go back and thank the people you met — or write them a thank-you note in your journal.", emoji: "🙏", bg: "bg-sun-soft" },
  { n: "02", title: "One more stranger", text: "Have one more real conversation this week: a neighbour, an elder, a shopkeeper you see every day.", emoji: "👋", bg: "bg-blush" },
  { n: "03", title: "Interview your family", text: "Ask a parent or grandparent: “What was the hardest moment of your life, and how did you get through it?”", emoji: "🏡", bg: "bg-sky" },
  { n: "04", title: "Add it to your board", text: "Write the best piece of advice you heard today on your dream board.", emoji: "📌", bg: "bg-mint" },
];

export function Reflect() {
  const before = useStoredSnapshot<number | null>("s4-courage-before", null);
  const [after, setAfter] = useLocalState<number | null>("s4-courage-after", null);
  const [answers, setAnswers] = useLocalState<string[]>("s4-reflect", QUESTIONS.map(() => ""));
  const [saved, setDone] = useLocalState<boolean[]>("s4-missions", Array(SESSION_FOUR_MISSIONS).fill(false));
  const done = Array.from({ length: SESSION_FOUR_MISSIONS }, (_, i) => !!saved[i]);
  const grew = before !== null && after !== null ? after - before : null;

  const toggle = (i: number) => {
    const next = done.map((v, j) => (j === i ? !v : v));
    if (next.every(Boolean)) celebrate("big");
    setDone(next);
  };

  return (
    <Stop
      id="reflect"
      stop={8}
      kicker="Reflect & take home"
      tone="cream"
      title={
        <>
          You did the <span className="text-coral">scary thing.</span> 🦁
        </>
      }
      intro="Most people never stop to ask a stranger about their life. You did it twice in one hour. Take a minute to notice how that changed you."
      aside={<PrivateBadge />}
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] [&>*]:min-w-0">
        <Reveal>
          <div className="rounded-[2rem] border-2 border-ink bg-white p-5 shadow-pop sm:p-6">
            <p className="font-display text-xl font-bold">How brave do you feel NOW?</p>
            <div className="mt-3 flex justify-between gap-1" role="radiogroup" aria-label="Courage after the mission">
              {COURAGE_FACES.map((f, i) => (
                <button
                  key={f}
                  role="radio"
                  aria-checked={after === i}
                  aria-label={`${i + 1} of 5`}
                  onClick={() => {
                    if (before !== null && i > before) celebrate("small");
                    setAfter(i);
                  }}
                  className={`grid h-12 flex-1 place-items-center rounded-xl border-2 text-2xl transition ${
                    after === i ? "-translate-y-1 border-ink bg-sun shadow-pop" : "border-ink/15 hover:border-ink"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <AnimatePresence>
              {grew !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 flex items-center justify-center gap-4 rounded-2xl bg-ink p-4 text-cream"
                >
                  <span className="text-center">
                    <span className="block text-4xl">{COURAGE_FACES[before!]}</span>
                    <span className="text-xs">before</span>
                  </span>
                  <span className="font-display text-2xl text-sun">→</span>
                  <span className="text-center">
                    <span className="block text-4xl">{COURAGE_FACES[after!]}</span>
                    <span className="text-xs">after</span>
                  </span>
                  <span className="max-w-40 text-sm font-semibold">
                    {grew > 0 ? "Your courage grew! That's what doing the scary thing does." : grew === 0 ? "Steady! Courage grows a little more every time." : "Tough day? That's OK — you still went. That IS courage."}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="space-y-4">
            {QUESTIONS.map((q, i) => (
              <label key={q.q} className="block rounded-[1.5rem] border-2 border-ink bg-white p-4 shadow-pop">
                <span className="font-display text-lg font-bold">{q.q}</span>
                <textarea
                  value={answers[i] ?? ""}
                  onChange={(e) => setAnswers(QUESTIONS.map((_, j) => (j === i ? e.target.value : (answers[j] ?? ""))))}
                  rows={2}
                  maxLength={300}
                  placeholder={q.ph}
                  className="mt-2 w-full resize-y rounded-xl border-2 border-ink/20 bg-cream px-3 py-2 outline-none focus:border-ink focus:bg-white focus:ring-4 focus:ring-sun/50"
                />
              </label>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-14">
        <h3 className="text-4xl font-bold">
          Your missions <span className="text-coral">this week</span> 🎒
        </h3>
      </Reveal>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {MISSIONS.map((m, i) => (
          <Reveal key={m.n} delay={i * 0.08}>
            <div className={`relative flex h-full flex-col rounded-[2rem] border-2 border-ink p-6 shadow-pop ${m.bg}`}>
              <div className="flex items-start justify-between">
                <span className="text-5xl">{m.emoji}</span>
                <motion.button
                  onClick={() => toggle(i)}
                  whileTap={{ scale: 0.85 }}
                  aria-pressed={done[i]}
                  aria-label={`Mark mission ${m.n}, ${m.title}, as done`}
                  className={`grid h-10 w-10 place-items-center rounded-xl border-2 border-ink transition ${done[i] ? "bg-teal text-white" : "bg-white"}`}
                >
                  {done[i] && <Check size={22} strokeWidth={3} />}
                </motion.button>
              </div>
              <span className="mt-5 font-display text-sm font-bold text-ink/50">MISSION {m.n}</span>
              <h4 className={`text-2xl font-bold ${done[i] ? "line-through decoration-coral decoration-4" : ""}`}>{m.title}</h4>
              <p className="mt-2 text-ink-soft">{m.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-4 text-center text-sm font-semibold text-ink-soft">
        {done.filter(Boolean).length}/{SESSION_FOUR_MISSIONS} missions complete
      </p>

      {/* Journey finale */}
      <Reveal className="mt-16">
        <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-ink bg-ink p-8 text-cream shadow-pop-lg sm:p-12">
          <div className="pointer-events-none absolute inset-0 bg-dots opacity-20" />
          <div className="relative">
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold tracking-widest text-sun uppercase">
              The Unfold journey · 4 of 4
            </span>
            <p className="mt-4 max-w-3xl font-display text-4xl leading-tight font-bold sm:text-5xl">
              Four weeks ago you asked <span className="text-sun">“Who am I?”</span> Look how far you&apos;ve come.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {SESSIONS.map((s) => (
                <Link
                  key={s.number}
                  href={s.href ?? "/#journey"}
                  className="group rounded-2xl border-2 border-cream/20 p-4 transition hover:-translate-y-1 hover:border-sun"
                >
                  <span className="text-xs font-bold tracking-widest text-cream/60">SESSION {String(s.number).padStart(2, "0")}</span>
                  <span className="block font-display text-xl font-bold group-hover:text-sun">{s.title}</span>
                  <span className="block text-sm text-cream/70">{s.destination}</span>
                </Link>
              ))}
            </div>
            <p className="mt-8 max-w-2xl text-lg text-cream/80">
              You don&apos;t have to be perfect. Just keep unfolding — a new you, every week. 🌱
            </p>
            <ButtonLink href="/#journey" className="mt-6">
              Back to the journey map
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </Stop>
  );
}
