"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize } from "lucide-react";
import { useLocalState, useStoredSnapshot } from "@/lib/useLocalState";
import { useTimer } from "@/lib/useTimer";
import { TimerWidget } from "@/components/TimerWidget";
import { Reveal, Stop } from "@/components/ui";
import { INTERVIEW_EMPTY, type Interview } from "./state";

type Slide = { kicker: string; title: string; lines: [string, string][]; bg: string; emoji: string };

const t = (v: Interview, k: string) => (v[k] ?? "").trim();

export function Present() {
  const person = useStoredSnapshot<Interview>("s4-person", INTERVIEW_EMPTY);
  const biz = useStoredSnapshot<Interview>("s4-business", INTERVIEW_EMPTY);
  const [takeaway, setTakeaway] = useLocalState<string>("s4-takeaway", "");
  const [i, setI] = useState(0);
  const timer = useTimer({ mode: "down", seconds: 180 });
  const stage = useRef<HTMLDivElement>(null);

  const who = t(person, "name") || "someone new";
  const bizName = t(biz, "business") || "a local business";
  const slides: Slide[] = [
    {
      kicker: "Conversation 1",
      title: `I met ${who}`,
      emoji: "🧓",
      bg: "bg-blush",
      lines: [
        ["From", t(person, "from")],
        ["Age", t(person, "age")],
        ["Every day they", t(person, "work")],
      ],
    },
    {
      kicker: "Their hardest moment",
      title: "What life threw at them",
      emoji: "⛈️",
      bg: "bg-lilac",
      lines: [
        ["The hardship", t(person, "hardship")],
        ["How they overcame it", t(person, "overcome")],
      ],
    },
    {
      kicker: "What they taught me",
      title: "Life lessons",
      emoji: "💡",
      bg: "bg-sun-soft",
      lines: [
        ["Lessons from hard times", t(person, "lessons")],
        ["Their advice for me", t(person, "advice")],
      ],
    },
    {
      kicker: "Conversation 2",
      title: `Meet ${bizName}`,
      emoji: "🏪",
      bg: "bg-teal-soft",
      lines: [
        ["Owner", t(biz, "owner")],
        ["Running for", t(biz, "years")],
        ["How the idea came", t(biz, "idea")],
        ["How they started", t(biz, "start")],
      ],
    },
    {
      kicker: "Staying alive in business",
      title: "Competition & survival",
      emoji: "🛡️",
      bg: "bg-sky",
      lines: [
        ["Competition", t(biz, "competition")],
        ["How they survived hard times", t(biz, "survive")],
      ],
    },
    {
      kicker: "For a future entrepreneur",
      title: "Their advice for me",
      emoji: "🚀",
      bg: "bg-mint",
      lines: [["Advice", t(biz, "advice")]],
    },
    {
      kicker: "My takeaway",
      title: "What I'll carry with me",
      emoji: "🌱",
      bg: "bg-cream",
      lines: [["One thing I learned today", takeaway.trim()]],
    },
  ];
  const s = slides[i];
  const hasAny = Object.values(person).some((x) => x.trim()) || Object.values(biz).some((x) => x.trim());

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = stage.current;
      if (!el) return;
      const inView = document.fullscreenElement === el || el.matches(":focus-within");
      if (!inView) return;
      if (e.key === "ArrowRight") setI((x) => Math.min(slides.length - 1, x + 1));
      if (e.key === "ArrowLeft") setI((x) => Math.max(0, x - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slides.length]);

  return (
    <Stop
      id="present"
      stop={7}
      kicker="Present your findings"
      tone="sun"
      title={
        <>
          Back in class: <span className="text-coral">share the stories</span> 🎤
        </>
      }
      intro="Your slides build themselves from your interview notes. Add your own takeaway, then present in about 3 minutes — who you met, what they went through, and what you learned."
      aside={<TimerWidget timer={timer} label="talk time" presets={[120, 180, 240, 300]} />}
    >
      <Reveal>
        <label className="mb-5 block rounded-[1.5rem] border-2 border-ink bg-white p-4 shadow-pop">
          <span className="font-display text-lg font-bold">🌱 My takeaway — one thing I learned today</span>
          <input
            value={takeaway}
            onChange={(e) => setTakeaway(e.target.value)}
            maxLength={140}
            placeholder="Hard times don't last if you keep going."
            className="mt-2 w-full rounded-xl border-2 border-ink/25 bg-cream px-3 py-2 outline-none focus:border-ink focus:ring-4 focus:ring-sun/50"
          />
        </label>
        {!hasAny && (
          <p className="mb-4 rounded-2xl border-2 border-dashed border-ink/30 bg-white/70 p-3 text-sm font-semibold text-ink-soft">
            Your slides are empty — fill in your two interview cards above and they&apos;ll appear here.
          </p>
        )}

        <div ref={stage} tabIndex={0} aria-roledescription="slideshow" aria-label="My presentation" className="rounded-[2rem] outline-none focus-visible:ring-4 focus-visible:ring-ink/30">
          <div className="relative flex min-h-[26rem] flex-col overflow-hidden rounded-[2rem] border-4 border-ink bg-white shadow-pop-lg [:fullscreen_&]:h-screen [:fullscreen_&]:rounded-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
                className={`flex flex-1 flex-col justify-center p-6 sm:p-10 ${s.bg}`}
              >
                <p className="text-sm font-bold tracking-[0.2em] text-ink-soft uppercase">{s.kicker}</p>
                <h3 className="mt-1 flex items-center gap-3 text-4xl font-bold sm:text-5xl">
                  <span>{s.emoji}</span> {s.title}
                </h3>
                <dl className="mt-6 space-y-4">
                  {s.lines.map(([k, val]) => (
                    <div key={k}>
                      <dt className="text-xs font-bold tracking-widest text-ink-soft uppercase">{k}</dt>
                      <dd className={`font-display text-xl font-semibold sm:text-2xl ${val ? "" : "text-ink/25"}`}>{val || "— add it in your notes —"}</dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center justify-between gap-3 border-t-4 border-ink bg-ink px-4 py-3 text-cream">
              <button
                onClick={() => setI((x) => Math.max(0, x - 1))}
                disabled={i === 0}
                aria-label="Previous slide"
                className="grid h-10 w-10 place-items-center rounded-xl border-2 border-cream/30 disabled:opacity-30"
              >
                <ChevronLeft />
              </button>
              <div className="flex gap-1.5">
                {slides.map((_, k) => (
                  <button
                    key={k}
                    onClick={() => setI(k)}
                    aria-label={`Slide ${k + 1}`}
                    aria-current={k === i}
                    className={`h-2.5 rounded-full transition-all ${k === i ? "w-6 bg-sun" : "w-2.5 bg-cream/40"}`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => stage.current?.requestFullscreen?.()}
                  aria-label="Present full screen"
                  className="hidden h-10 w-10 place-items-center rounded-xl border-2 border-cream/30 sm:grid"
                >
                  <Maximize size={18} />
                </button>
                <button
                  onClick={() => setI((x) => Math.min(slides.length - 1, x + 1))}
                  disabled={i === slides.length - 1}
                  aria-label="Next slide"
                  className="grid h-10 w-10 place-items-center rounded-xl border-2 border-cream/30 disabled:opacity-30"
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-3 text-center text-sm text-ink-soft">Use ← → keys or the buttons. Full-screen works great on a projector.</p>
      </Reveal>

      <Reveal className="mt-10">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["🧍", "Stand tall", "Feet still, face the class, breathe."],
            ["📖", "Tell it as a story", "Who → what happened → how they got through → lesson."],
            ["🗣️", "Use their words", "One exact quote makes it real."],
            ["🙏", "Respect them", "Share only what they were happy for you to share."],
          ].map(([e, ti, d]) => (
            <div key={ti} className="rounded-2xl border-2 border-ink bg-white p-4 shadow-pop">
              <span className="text-2xl">{e}</span>
              <p className="font-display font-bold">{ti}</p>
              <p className="text-sm text-ink-soft">{d}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </Stop>
  );
}
