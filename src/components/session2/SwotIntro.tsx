"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button, Reveal, Stop } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";

export type SwotKey = "s" | "w" | "o" | "t";

export const SWOT: { key: SwotKey; letter: string; name: string; side: string; bg: string; ink: string; qs: string[] }[] = [
  {
    key: "s",
    letter: "S",
    name: "Strengths",
    side: "Inside you · helps you",
    bg: "bg-teal-soft",
    ink: "text-teal",
    qs: ["What am I good at?", "What do people praise me for?", "What do I have that others don't?"],
  },
  {
    key: "w",
    letter: "W",
    name: "Weaknesses",
    side: "Inside you · holds you back",
    bg: "bg-blush",
    ink: "text-coral",
    qs: ["What do I avoid doing?", "Which habits waste my time?", "What do others do better than me?"],
  },
  {
    key: "o",
    letter: "O",
    name: "Opportunities",
    side: "Around you · helps you",
    bg: "bg-sun-soft",
    ink: "text-[#b88600]",
    qs: ["Who could teach or help me?", "What classes, clubs or events can I join?", "What free tools or courses can I use?"],
  },
  {
    key: "t",
    letter: "T",
    name: "Threats",
    side: "Around you · gets in the way",
    bg: "bg-lilac",
    ink: "text-grape",
    qs: ["What distracts me?", "Who or what pulls me down?", "What could stop my plans?"],
  },
];

const SAM = [
  { text: "Sam is great at drawing", a: "s" },
  { text: "Sam's phone takes 5 hours a day", a: "t" },
  { text: "There's a free art club after school", a: "o" },
  { text: "Sam gives up quickly when it gets hard", a: "w" },
  { text: "Sam's cousin is a graphic designer", a: "o" },
  { text: "Sam is shy to show work to others", a: "w" },
  { text: "Sam's friends say art is a waste of time", a: "t" },
  { text: "Sam is patient with small details", a: "s" },
] as const;

function SortSam() {
  const [answers, setAnswers] = useState<(SwotKey | null)[]>(SAM.map(() => null));
  const [picked, setPicked] = useState<number | null>(0);
  const [wrong, setWrong] = useState<SwotKey | null>(null);
  const left = answers.filter((a) => a === null).length;

  const place = (k: SwotKey) => {
    if (picked === null) return;
    if (SAM[picked].a !== k) {
      setWrong(k);
      window.setTimeout(() => setWrong(null), 450);
      return;
    }
    const next = answers.map((a, i) => (i === picked ? k : a));
    setAnswers(next);
    const nextIdx = next.findIndex((a) => a === null);
    setPicked(nextIdx === -1 ? null : nextIdx);
    if (nextIdx === -1) celebrate("small");
  };

  return (
    <div className="rounded-[2rem] border-2 border-ink bg-white p-5 shadow-pop sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-sm font-bold tracking-[0.2em] text-grape uppercase">Practice round</p>
          <h3 className="mt-1 text-3xl font-bold">Sort Sam&apos;s SWOT 🎨</h3>
          <p className="text-ink-soft">Sam dreams of becoming an artist. Tap a fact, then tap the box it belongs in.</p>
        </div>
        <span className="rounded-full border-2 border-ink bg-sun px-3 py-1 font-display font-bold">
          {SAM.length - left}/{SAM.length}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {SAM.map((f, i) =>
          answers[i] ? null : (
            <button
              key={f.text}
              onClick={() => setPicked(i)}
              aria-pressed={picked === i}
              className={`rounded-2xl border-2 px-3 py-2 text-sm font-semibold transition ${
                picked === i ? "-translate-y-0.5 border-ink bg-ink text-cream shadow-pop" : "border-ink/25 bg-cream hover:border-ink"
              }`}
            >
              {f.text}
            </button>
          ),
        )}
        {left === 0 && (
          <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-ink bg-ink p-4 text-cream">
            <p className="font-display text-lg">
              All sorted! Notice: Sam&apos;s <span className="text-sun">strength + opportunity</span> (drawing + free art club) is the
              best next move.
            </p>
            <Button
              variant="white"
              onClick={() => {
                setAnswers(SAM.map(() => null));
                setPicked(0);
              }}
            >
              <RotateCcw size={16} /> Again
            </Button>
          </div>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {SWOT.map((q) => (
          <motion.button
            key={q.key}
            onClick={() => place(q.key)}
            animate={wrong === q.key ? { x: [0, -8, 8, -4, 0] } : { x: 0 }}
            transition={{ type: "tween", duration: 0.35 }}
            disabled={picked === null}
            className={`min-h-28 rounded-2xl border-2 border-ink p-3 text-left transition enabled:hover:-translate-y-0.5 ${q.bg} ${
              wrong === q.key ? "ring-4 ring-coral" : ""
            }`}
          >
            <span className={`font-display text-lg font-bold ${q.ink}`}>
              {q.letter} · {q.name}
            </span>
            <span className="mt-1 flex flex-col gap-1">
              <AnimatePresence>
                {SAM.map((f, i) =>
                  answers[i] === q.key ? (
                    <motion.span
                      key={f.text}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-lg bg-white/80 px-2 py-1 text-xs font-semibold"
                    >
                      {f.text}
                    </motion.span>
                  ) : null,
                )}
              </AnimatePresence>
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export function SwotIntro() {
  const [open, setOpen] = useState<SwotKey | null>(null);
  return (
    <Stop
      id="swot-intro"
      stop={6}
      kicker="SWOT analysis · Intro"
      tone="cream"
      title={
        <>
          Your personal <span className="text-grape">GPS</span> 🧩
        </>
      }
      intro="Before you climb a mountain, you check your gear and the weather. A SWOT does the same for your life: two boxes about YOU, two boxes about the world AROUND you."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <div>
            <div className="mb-2 grid grid-cols-2 gap-3 text-center text-xs font-bold tracking-widest text-ink-soft uppercase">
              <span>👍 Helps me</span>
              <span>👎 Holds me back</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[SWOT[0], SWOT[1], SWOT[2], SWOT[3]].map((q) => {
                const on = open === q.key;
                return (
                  <motion.button
                    key={q.key}
                    layout
                    onClick={() => setOpen(on ? null : q.key)}
                    aria-expanded={on}
                    className={`rounded-[1.5rem] border-2 border-ink p-4 text-left shadow-pop ${q.bg}`}
                  >
                    <span className={`font-display text-6xl leading-none font-bold ${q.ink}`}>{q.letter}</span>
                    <span className="mt-1 block font-display text-xl font-bold">{q.name}</span>
                    <span className="block text-xs font-semibold text-ink-soft">{q.side}</span>
                    <AnimatePresence initial={false}>
                      {on ? (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-2 list-disc space-y-1 overflow-hidden pl-4 text-sm"
                        >
                          {q.qs.map((x) => (
                            <li key={x}>{x}</li>
                          ))}
                        </motion.ul>
                      ) : (
                        <span className="mt-2 block text-xs font-bold text-ink/50">Tap for questions →</span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          </div>
          <p className="mt-5 rounded-2xl border-2 border-dashed border-ink/30 bg-white p-4 text-ink-soft">
            💡 The magic trick: use your <b className="text-teal">Strengths</b> to grab <b className="text-[#b88600]">Opportunities</b>,
            and fix the <b className="text-coral">Weaknesses</b> that make you easy prey for <b className="text-grape">Threats</b>.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <SortSam />
        </Reveal>
      </div>
    </Stop>
  );
}
