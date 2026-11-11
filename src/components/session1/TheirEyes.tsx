"use client";

import { motion } from "motion/react";
import { useLocalState } from "@/lib/useLocalState";
import { PrivateBadge, Reveal } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";

export type Answer = { who: string; strength: string; improve: string };
export type TheirEyesState = Answer[];
export const THEIR_EYES_EMPTY: TheirEyesState = Array.from({ length: 5 }, () => ({ who: "", strength: "", improve: "" }));

const TINTS = ["bg-sky", "bg-sun-soft", "bg-mint", "bg-lilac", "bg-blush"];
const WHO_HINTS = ["A family member", "A close friend", "A teacher / mentor", "A classmate", "Someone surprising"];

/** Collects strengths seen by others into a short list (for the Who Am I card). */
export function othersSee(s: TheirEyesState) {
  const seen = new Map<string, string>();
  s.forEach((a) =>
    a.strength
      .split(/[,/&]| and /i)
      .map((x) => x.trim())
      .filter(Boolean)
      .forEach((x) => seen.has(x.toLowerCase()) || seen.set(x.toLowerCase(), x)),
  );
  return [...seen.values()].slice(0, 6);
}

export function TheirEyes() {
  const [s, setS] = useLocalState<TheirEyesState>("s1-their-eyes", THEIR_EYES_EMPTY);
  const done = s.filter((a) => a.who.trim() && a.strength.trim()).length;

  const update = (i: number, k: keyof Answer, v: string) => {
    const next = s.map((a, j) => (j === i ? { ...a, [k]: v } : a));
    const now = next.filter((a) => a.who.trim() && a.strength.trim()).length;
    if (now === 5 && done < 5) celebrate("big");
    setS(next);
  };

  return (
    <div className="mt-14">
      <Reveal className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="font-display text-sm font-bold tracking-[0.2em] text-sky-deep uppercase">Mission 02 · Through Their Eyes</p>
          <h3 className="mt-2 text-4xl font-bold">
            Ask <span className="text-coral">5 people</span> 👀
          </h3>
          <p className="mt-2 text-lg text-ink-soft">
            Others often see strengths we can&apos;t. Ask 5 different people two questions — and write down exactly what they say.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold">
            <span className="rounded-full border-2 border-ink bg-white px-3 py-1">❶ “What are my top 3 strengths?”</span>
            <span className="rounded-full border-2 border-ink bg-white px-3 py-1">❷ “What&apos;s one thing I could improve?”</span>
          </div>
        </div>
        <div className="flex flex-col items-start gap-2 md:items-end">
          <PrivateBadge />
          <div className="flex items-center gap-1.5">
            {s.map((a, i) => (
              <motion.span
                key={i}
                animate={{ scale: a.who.trim() && a.strength.trim() ? 1 : 0.8 }}
                className={`grid h-9 w-9 place-items-center rounded-full border-2 border-ink text-lg ${
                  a.who.trim() && a.strength.trim() ? "bg-teal" : "bg-white"
                }`}
              >
                {a.who.trim() && a.strength.trim() ? "👁️" : <span className="text-xs font-bold text-ink/40">{i + 1}</span>}
              </motion.span>
            ))}
            <span className="ml-1 font-display font-bold">{done}/5</span>
          </div>
        </div>
      </Reveal>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {s.map((a, i) => (
          <Reveal key={i} delay={i * 0.06}>
            <div className={`flex h-full flex-col gap-2 rounded-[1.75rem] border-2 border-ink p-4 shadow-pop ${TINTS[i]}`}>
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border-2 border-ink bg-white font-display font-bold">
                  {i + 1}
                </span>
                <input
                  value={a.who}
                  onChange={(e) => update(i, "who", e.target.value)}
                  maxLength={30}
                  placeholder={WHO_HINTS[i]}
                  aria-label={`Person ${i + 1}`}
                  className="w-full min-w-0 border-b-2 border-dashed border-ink/30 bg-transparent py-1 font-display font-semibold outline-none placeholder:text-ink/35 focus:border-solid focus:border-ink"
                />
              </div>
              <label className="mt-1 text-[10px] font-bold tracking-widest text-ink-soft uppercase">💪 Strengths they see</label>
              <textarea
                value={a.strength}
                onChange={(e) => update(i, "strength", e.target.value)}
                rows={2}
                maxLength={120}
                placeholder="kind, creative, calm…"
                className="w-full resize-none rounded-xl border-2 border-ink/15 bg-white/70 px-2 py-1.5 text-sm outline-none focus:border-ink"
              />
              <label className="text-[10px] font-bold tracking-widest text-ink-soft uppercase">🌱 One thing to improve</label>
              <textarea
                value={a.improve}
                onChange={(e) => update(i, "improve", e.target.value)}
                rows={2}
                maxLength={120}
                placeholder="be on time…"
                className="w-full resize-none rounded-xl border-2 border-ink/15 bg-white/70 px-2 py-1.5 text-sm outline-none focus:border-ink"
              />
            </div>
          </Reveal>
        ))}
      </div>
      {done === 5 && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 rounded-2xl border-2 border-ink bg-ink p-4 text-center font-display text-lg text-cream"
        >
          5 pairs of eyes! 🎉 Did anyone name a strength <span className="text-sun">you didn&apos;t see in yourself?</span> Circle it —
          that&apos;s a hidden superpower.
        </motion.p>
      )}
    </div>
  );
}
