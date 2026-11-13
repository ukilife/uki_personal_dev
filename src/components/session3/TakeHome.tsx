"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { useLocalState, useStoredSnapshot } from "@/lib/useLocalState";
import { ButtonLink, PrivateBadge, Reveal, Stop } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";
import { SESSION_THREE_MISSIONS } from "@/lib/sessions";
import { TWENTY_ONE_EMPTY, type TwentyOneState } from "@/components/session2/TwentyOneDays";
import { GOALS_EMPTY, type Goal } from "./state";

export function TakeHome() {
  const [saved, setDone] = useLocalState<boolean[]>("s3-missions", Array(SESSION_THREE_MISSIONS).fill(false));
  const done = Array.from({ length: SESSION_THREE_MISSIONS }, (_, i) => !!saved[i]);
  const goals = useStoredSnapshot<Goal[]>("s3-goals", GOALS_EMPTY);
  const t21 = useStoredSnapshot<TwentyOneState>("s2-21days", TWENTY_ONE_EMPTY);
  const firstStep = goals.find((g) => g.step.trim())?.step.trim();
  const days = (t21.days ?? []).filter(Boolean).length;

  const MISSIONS = [
    { n: "01", title: "See it every morning", text: "Take a photo of your dream board and make it your phone wallpaper — or keep a small copy by your bed.", emoji: "📸", bg: "bg-sun-soft" },
    {
      n: "02",
      title: "Take your first step",
      text: firstStep ? `You promised: “${firstStep}”. Do it before next session.` : "Do the first step of your 1-year goal before next session.",
      emoji: "👣",
      bg: "bg-mint",
    },
    { n: "03", title: "Share it at home", text: "Show your board (or its photo) to your family. Ask them about a dream THEY once had.", emoji: "🏡", bg: "bg-sky" },
    {
      n: "04",
      title: "Keep the chain",
      text: `Your 21-day challenge is still running${days ? ` — ${days}/21 days so far` : ""}. Don't break it now!`,
      emoji: "🔗",
      bg: "bg-lilac",
      href: "/sessions/discipline-and-dreams#21-days",
    },
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
      kicker="Take-home missions"
      tone="cream"
      title={
        <>
          Your missions <span className="text-coral">this week</span> 🎒
        </>
      }
      intro="A dream board on the wall is a start. A dream board you LOOK at and ACT on changes your life. Tick these off before Session 4."
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
                  className={`grid h-10 w-10 place-items-center rounded-xl border-2 border-ink transition ${done[i] ? "bg-teal text-white" : "bg-white"}`}
                >
                  {done[i] && <Check size={22} strokeWidth={3} />}
                </motion.button>
              </div>
              <span className="mt-5 font-display text-sm font-bold text-ink/50">MISSION {m.n}</span>
              <h3 className={`text-2xl font-bold ${done[i] ? "line-through decoration-coral decoration-4" : ""}`}>{m.title}</h3>
              <p className="mt-2 text-ink-soft">{m.text}</p>
              {m.href && (
                <a href={m.href} className="mt-auto pt-4 text-sm font-bold underline decoration-dashed underline-offset-4 hover:text-grape">
                  Open my tracker →
                </a>
              )}
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-4 text-center text-sm font-semibold text-ink-soft">
        {done.filter(Boolean).length}/{SESSION_THREE_MISSIONS} missions complete
      </p>

      <Reveal className="mt-16">
        <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-ink bg-coral p-8 text-white shadow-pop-lg sm:p-12">
          <div className="pointer-events-none absolute inset-0 bg-dots opacity-30" />
          <motion.div
            aria-hidden
            className="absolute -top-6 right-6 text-[9rem] opacity-30 sm:right-12"
            animate={{ y: [0, -14, 0], rotate: [0, 8, 0] }}
            transition={{ type: "tween", repeat: Infinity, duration: 5 }}
          >
            🏙️
          </motion.div>
          <div className="relative max-w-2xl">
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-widest uppercase">
              Next week · Session 04 · The Courage City
            </span>
            <p className="mt-4 font-display text-4xl leading-tight font-bold sm:text-5xl">
              What happens when you step outside your <span className="text-sun">comfort zone?</span>
            </p>
            <p className="mt-4 text-lg text-white/85">Your board shows where you&apos;re going. Next week, you find the courage to go there.</p>
            <ButtonLink href="/sessions/talk-to-a-stranger" className="mt-6">
              Go to Session 4
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </Stop>
  );
}
