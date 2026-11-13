"use client";

import { motion } from "motion/react";
import { useLocalState, useStoredSnapshot } from "@/lib/useLocalState";
import { PrivateBadge, Reveal, Stop } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";
import { DREAMS_EMPTY, GOALS_EMPTY, allDreams, type DreamsState, type Goal, type Horizon } from "./state";

const HORIZONS: { by: Horizon; emoji: string; bg: string; hint: string }[] = [
  { by: "1 year", emoji: "🌱", bg: "bg-mint", hint: "Something you can finish by this time next year." },
  { by: "5 years", emoji: "🌿", bg: "bg-sun-soft", hint: "A big milestone — a course, a skill, a place." },
  { by: "10 years", emoji: "🌳", bg: "bg-sky", hint: "Where you want to stand when you're grown up." },
];

const EXAMPLES = [
  ["Become a doctor", "Score an A in Biology by the end of next year", "Revise one Biology chapter every Sunday"],
  ["Visit Japan", "Save Rs. 500 every month for 5 years", "Open a savings box tonight"],
  ["Have my own studio", "Finish a design diploma by age 20", "Draw for 15 minutes every day"],
];

export function Goals() {
  const [goals, setGoals] = useLocalState<Goal[]>("s3-goals", GOALS_EMPTY);
  const dreams = allDreams(useStoredSnapshot<DreamsState>("s3-dreams", DREAMS_EMPTY));
  const list = HORIZONS.map((h, i) => goals[i] ?? { ...GOALS_EMPTY[i], by: h.by });
  const ready = list.filter((g) => g.goal.trim() && g.step.trim()).length;

  const set = (i: number, patch: Partial<Goal>) => {
    const next = list.map((g, j) => (j === i ? { ...g, ...patch } : g));
    const nextReady = next.filter((g) => g.goal.trim() && g.step.trim()).length;
    if (nextReady === 3 && ready < 3) celebrate("big");
    setGoals(next);
  };

  const field =
    "mt-1 w-full rounded-xl border-2 border-ink/25 bg-white px-3 py-2 outline-none focus:border-ink focus:ring-4 focus:ring-sun/50";

  return (
    <Stop
      id="goals"
      stop={6}
      kicker="Piece 5 · My future goals"
      tone="cream"
      title={
        <>
          A goal is a dream with a <span className="text-coral">deadline</span> 🎯
        </>
      }
      intro="A dream says WHERE you want to go. A goal says exactly WHAT you'll achieve and BY WHEN. A first step says what you'll do THIS WEEK. Turn your dreams into three goals: 1 year, 5 years and 10 years from now."
      aside={<PrivateBadge />}
    >
      <Reveal>
        <div className="overflow-x-auto rounded-[1.75rem] border-2 border-ink bg-white shadow-pop">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-ink text-cream">
              <tr>
                <th className="px-4 py-2.5">🌟 Dream</th>
                <th className="px-4 py-2.5">🎯 Goal (what + by when)</th>
                <th className="px-4 py-2.5">👣 First step this week</th>
              </tr>
            </thead>
            <tbody>
              {EXAMPLES.map(([d, g, s]) => (
                <tr key={d} className="border-t-2 border-ink/10">
                  <td className="px-4 py-2.5 font-semibold">{d}</td>
                  <td className="px-4 py-2.5">{g}</td>
                  <td className="px-4 py-2.5">{s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <div className="relative mt-10">
        <div className="absolute top-8 right-[16%] left-[16%] hidden h-1 rounded-full bg-gradient-to-r from-teal via-sun to-sky-deep md:block" />
        <div className="grid gap-5 md:grid-cols-3">
          {HORIZONS.map((h, i) => {
            const g = list[i];
            const done = g.goal.trim() && g.step.trim();
            return (
              <Reveal key={h.by} delay={i * 0.08}>
                <div className="relative">
                  <motion.span
                    animate={done ? { scale: [1, 1.2, 1] } : {}}
                    className={`relative z-10 mx-auto grid h-16 w-16 place-items-center rounded-full border-4 border-ink text-3xl ${
                      done ? "bg-sun" : "bg-white"
                    }`}
                  >
                    {h.emoji}
                  </motion.span>
                  <div className={`mt-3 rounded-[1.75rem] border-2 border-ink p-5 shadow-pop ${h.bg}`}>
                    <p className="text-center font-display text-2xl font-bold">In {h.by}</p>
                    <p className="text-center text-sm text-ink-soft">{h.hint}</p>
                    <label className="mt-4 block text-sm font-bold">
                      Which dream?
                      <select value={g.dream} onChange={(e) => set(i, { dream: e.target.value })} className={field + " font-semibold"}>
                        <option value="">{dreams.length ? "Pick a board dream…" : "Add dreams in Piece 1 first…"}</option>
                        {dreams.map((d) => (
                          <option key={d}>{d}</option>
                        ))}
                      </select>
                    </label>
                    <label className="mt-3 block text-sm font-bold">
                      My goal
                      <textarea
                        value={g.goal}
                        onChange={(e) => set(i, { goal: e.target.value })}
                        rows={2}
                        maxLength={120}
                        placeholder="What exactly, and by when?"
                        className={field + " resize-none font-normal"}
                      />
                    </label>
                    <label className="mt-3 block text-sm font-bold">
                      First step this week
                      <input
                        value={g.step}
                        onChange={(e) => set(i, { step: e.target.value })}
                        maxLength={80}
                        placeholder="Tiny and doable…"
                        className={field + " font-normal"}
                      />
                    </label>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
      <p className="mt-5 text-center text-sm font-semibold text-ink-soft">
        {ready}/3 goals ready · Tip: your 1-year first step could be your next 21-day challenge!
      </p>
    </Stop>
  );
}
