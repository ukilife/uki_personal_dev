"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { useLocalState, useStoredSnapshot } from "@/lib/useLocalState";
import { ButtonLink, PrivateBadge, Reveal, Stop } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";
import { SESSION_TWO_MISSIONS } from "@/lib/sessions";
import { TWENTY_ONE_EMPTY, type TwentyOneState } from "./TwentyOneDays";
import { SWOT_EMPTY, type SwotState } from "./MySwot";
import { BUCKET_EMPTY, BUCKET_GOAL, type BucketState } from "./BucketList";

const QUESTIONS = [
  { q: "When do I feel most like myself?", ph: "When I'm…" },
  { q: "What makes me lose track of time?", ph: "Hours disappear when I…" },
  { q: "What do people often come to me for?", ph: "Friends ask me to…" },
  { q: "What am I afraid of — and is that fear protecting me or stopping me?", ph: "I'm scared of…" },
  { q: "What would I try if I knew I couldn't fail?", ph: "I would…" },
  { q: "Which habit is quietly shaping my future — for better or worse?", ph: "Every day I…" },
  { q: "Who do I want to be in 5 years?", ph: "In 5 years I am…" },
  { q: "One thing I'll STOP, one I'll START, one I'll CONTINUE.", ph: "Stop… Start… Continue…" },
];

export function FigureYourself() {
  const [answers, setAnswers] = useLocalState<string[]>("s2-figure-yourself", QUESTIONS.map(() => ""));
  const [saved, setDone] = useLocalState<boolean[]>("s2-missions", Array(SESSION_TWO_MISSIONS).fill(false));
  const done = Array.from({ length: SESSION_TWO_MISSIONS }, (_, i) => !!saved[i]);

  const t21 = useStoredSnapshot<TwentyOneState>("s2-21days", TWENTY_ONE_EMPTY);
  const swot = useStoredSnapshot<SwotState>("s2-swot", SWOT_EMPTY);
  const bucket = useStoredSnapshot<BucketState>("s2-bucket", BUCKET_EMPTY);

  const answered = QUESTIONS.filter((_, i) => (answers[i] ?? "").trim()).length;
  const days = (t21.days ?? []).filter(Boolean).length;
  const swotBoxes = (["s", "w", "o", "t"] as const).filter((k) => (swot[k] ?? []).filter((v) => v.trim()).length >= 3).length;

  const MISSIONS = [
    { n: "01", title: "Figure Yourself", text: "Answer all 8 questions below — at home, somewhere quiet, with total honesty.", emoji: "🪞", bg: "bg-sun-soft", status: `${answered}/8 answered` },
    { n: "02", title: "Keep the chain", text: "Do your 21-day challenge every single day and tick it off.", emoji: "📅", bg: "bg-mint", status: `${days}/21 days`, href: "#21-days" },
    { n: "03", title: "Finish your SWOT", text: "At least 3 in every box. Save it as an image and look at it often.", emoji: "🗺️", bg: "bg-lilac", status: `${swotBoxes}/4 boxes`, href: "#my-swot" },
    { n: "04", title: "Fill your bucket", text: `Grow your bucket list to at least ${BUCKET_GOAL} dreams. Ask your family about theirs too!`, emoji: "🪣", bg: "bg-blush", status: `${bucket.items?.length ?? 0}/${BUCKET_GOAL} dreams`, href: "#bucket-list" },
  ];

  const toggle = (i: number) => {
    const next = done.map((v, j) => (j === i ? !v : v));
    if (next.every(Boolean)) celebrate("big");
    setDone(next);
  };

  return (
    <Stop
      id="take-home"
      stop={9}
      kicker="Homework · Figure Yourself"
      tone="cream"
      title={
        <>
          Your missions <span className="text-coral">this week</span> 🎒
        </>
      }
      intro="Complete these before Session 3 and tick them off as you go. The progress numbers come straight from what you've filled in on this device."
      aside={<PrivateBadge />}
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                  className={`grid h-10 w-10 place-items-center rounded-xl border-2 border-ink transition ${
                    done[i] ? "bg-teal text-white" : "bg-white"
                  }`}
                >
                  {done[i] && <Check size={22} strokeWidth={3} />}
                </motion.button>
              </div>
              <span className="mt-5 font-display text-sm font-bold text-ink/50">MISSION {m.n}</span>
              <h3 className={`text-2xl font-bold ${done[i] ? "line-through decoration-coral decoration-4" : ""}`}>{m.title}</h3>
              <p className="mt-2 text-ink-soft">{m.text}</p>
              <span className="mt-auto pt-4 text-sm font-bold">
                {m.href ? (
                  <a href={m.href} className="underline decoration-dashed underline-offset-4 hover:text-grape">
                    {m.status} →
                  </a>
                ) : (
                  m.status
                )}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-4 text-center text-sm font-semibold text-ink-soft">
        {done.filter(Boolean).length}/{SESSION_TWO_MISSIONS} missions complete
      </p>

      {/* Worksheet */}
      <Reveal className="mt-14">
        <div className="rounded-[2.5rem] border-4 border-ink bg-white p-5 shadow-pop-lg sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-display text-sm font-bold tracking-[0.2em] text-grape uppercase">Mission 01 · Worksheet</p>
              <h3 className="mt-1 text-4xl font-bold">Figure Yourself 🪞</h3>
              <p className="mt-1 text-ink-soft">No right answers. Short is fine. Honest is everything.</p>
            </div>
            <span className="rounded-full border-2 border-ink bg-sun px-3 py-1 font-display font-bold tabular-nums">{answered}/8</span>
          </div>
          <ol className="mt-6 grid gap-5 md:grid-cols-2">
            {QUESTIONS.map((q, i) => (
              <li key={q.q}>
                <label className="block">
                  <span className="flex gap-2 font-display text-lg leading-snug font-bold">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-ink text-sm text-sun">{i + 1}</span>
                    {q.q}
                  </span>
                  <textarea
                    value={answers[i] ?? ""}
                    onChange={(e) => {
                      const next = QUESTIONS.map((_, j) => (j === i ? e.target.value : (answers[j] ?? "")));
                      if (next.every((a) => a.trim()) && answered < 8) celebrate("small");
                      setAnswers(next);
                    }}
                    rows={3}
                    maxLength={400}
                    placeholder={q.ph}
                    className="mt-2 w-full resize-y rounded-2xl border-2 border-ink/20 bg-cream px-4 py-3 outline-none focus:border-ink focus:bg-white focus:ring-4 focus:ring-sun/50"
                  />
                </label>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      {/* Next session teaser */}
      <Reveal className="mt-16">
        <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-ink bg-[#5aa832] p-8 text-white shadow-pop-lg sm:p-12">
          <div className="pointer-events-none absolute inset-0 bg-dots opacity-30" />
          <motion.div
            aria-hidden
            className="absolute -top-6 right-6 text-[9rem] opacity-30 sm:right-12"
            animate={{ y: [0, -14, 0], rotate: [0, 8, 0] }}
            transition={{ type: "tween", repeat: Infinity, duration: 5 }}
          >
            🌳
          </motion.div>
          <div className="relative max-w-2xl">
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-widest uppercase">
              Next week · Session 03 · The Habit Forest
            </span>
            <p className="mt-4 font-display text-4xl leading-tight font-bold sm:text-5xl">
              Can small habits change your <span className="text-sun">future?</span>
            </p>
            <p className="mt-4 text-lg text-white/85">Bring your missions — and your 21-day streak.</p>
            <ButtonLink href="/#journey" className="mt-6">
              See the journey map
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </Stop>
  );
}
