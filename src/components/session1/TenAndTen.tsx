"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef } from "react";
import { Plus, Sprout, Star, X } from "lucide-react";
import { useLocalState } from "@/lib/useLocalState";
import { PrivateBadge, Reveal } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";

const MIN = 10;
const MAX = 20;

export type TenAndTenState = { strengths: string[]; improve: string[] };
export const TEN_AND_TEN_EMPTY: TenAndTenState = {
  strengths: Array(MIN).fill(""),
  improve: Array(MIN).fill(""),
};

const COLUMNS = [
  {
    key: "strengths" as const,
    title: "My strengths",
    hint: "What am I good at? What do people thank me for?",
    icon: Star,
    bg: "bg-teal-soft",
    bar: "bg-teal",
    badge: "bg-teal text-white",
    examples: ["Patient", "Good listener", "Creative", "Hard-working", "Funny", "Loyal", "Fast learner", "Organised", "Brave", "Kind"],
  },
  {
    key: "improve" as const,
    title: "Things to improve",
    hint: "What's not there… YET? What would make life easier?",
    icon: Sprout,
    bg: "bg-blush",
    bar: "bg-coral",
    badge: "bg-coral text-white",
    examples: ["Waking up early", "Speaking up in class", "Saving money", "Being on time", "Less phone time", "Saying no", "Drinking water", "Finishing tasks", "Asking for help", "Staying calm"],
  },
];

export function TenAndTen() {
  const [s, setS] = useLocalState<TenAndTenState>("s1-ten-and-ten", TEN_AND_TEN_EMPTY);
  const celebrated = useRef(false);

  const list = (k: keyof TenAndTenState) => {
    const v = s[k] ?? [];
    return v.length >= MIN ? v : [...v, ...Array(MIN - v.length).fill("")];
  };
  const count = (k: keyof TenAndTenState) => list(k).filter((v) => v.trim()).length;
  const bothDone = count("strengths") >= MIN && count("improve") >= MIN;

  const write = (k: keyof TenAndTenState, items: string[]) => {
    const next = { ...s, strengths: list("strengths"), improve: list("improve"), [k]: items };
    const done = next.strengths.filter((v) => v.trim()).length >= MIN && next.improve.filter((v) => v.trim()).length >= MIN;
    if (done && !bothDone && !celebrated.current) {
      celebrated.current = true;
      celebrate("big");
    }
    setS(next);
  };

  return (
    <div className="mt-14">
      <Reveal className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="font-display text-sm font-bold tracking-[0.2em] text-grape uppercase">Mission 04 · The 10 + 10 List</p>
          <h3 className="mt-2 text-4xl font-bold">
            <span className="text-teal">10 strengths.</span> <span className="text-coral">10 things to improve.</span>
          </h3>
          <p className="mt-2 text-lg text-ink-soft">
            Minimum 10 of each — no skipping! The first few are easy. Numbers 7 to 10 are where you really start discovering
            yourself. 🔍
          </p>
        </div>
        <PrivateBadge />
      </Reveal>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {COLUMNS.map((c, ci) => {
          const items = list(c.key);
          const n = count(c.key);
          const Icon = c.icon;
          return (
            <Reveal key={c.key} delay={ci * 0.08}>
              <div className={`h-full rounded-[2rem] border-2 border-ink p-5 shadow-pop sm:p-6 ${c.bg}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`grid h-12 w-12 place-items-center rounded-2xl border-2 border-ink ${c.badge}`}>
                      <Icon size={22} />
                    </span>
                    <div>
                      <p className="font-display text-2xl font-bold">{c.title}</p>
                      <p className="text-sm text-ink-soft">{c.hint}</p>
                    </div>
                  </div>
                  <motion.span
                    key={n >= MIN ? "done" : "todo"}
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    className={`shrink-0 rounded-full border-2 border-ink px-3 py-1 font-display font-bold tabular-nums ${
                      n >= MIN ? "bg-sun" : "bg-white"
                    }`}
                  >
                    {n}/{MIN}
                    {n >= MIN && " ✓"}
                  </motion.span>
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full border-2 border-ink bg-white">
                  <motion.div className={`h-full ${c.bar}`} animate={{ width: `${Math.min(1, n / MIN) * 100}%` }} />
                </div>

                <ol className="mt-4 space-y-1.5">
                  <AnimatePresence initial={false}>
                    {items.map((v, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2"
                      >
                        <span
                          className={`w-7 shrink-0 text-right font-display text-lg font-bold ${
                            v.trim() ? "text-ink" : "text-ink/30"
                          }`}
                        >
                          {i + 1}
                        </span>
                        <input
                          value={v}
                          onChange={(e) => write(c.key, items.map((x, j) => (j === i ? e.target.value : x)))}
                          maxLength={60}
                          placeholder={i < c.examples.length ? `e.g. ${c.examples[i]}` : "One more…"}
                          aria-label={`${c.title} ${i + 1}`}
                          className="w-full min-w-0 border-b-2 border-dashed border-ink/25 bg-transparent px-1 py-1.5 outline-none placeholder:text-ink/30 focus:border-solid focus:border-ink"
                        />
                        {i >= MIN && (
                          <button
                            aria-label="Remove line"
                            onClick={() => write(c.key, items.filter((_, j) => j !== i))}
                            className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-ink/40 hover:bg-white hover:text-ink"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ol>

                {items.length < MAX && (
                  <button
                    onClick={() => write(c.key, [...items, ""])}
                    className="mt-3 flex items-center gap-1.5 rounded-xl border-2 border-dashed border-ink/30 px-3 py-1.5 text-sm font-semibold text-ink-soft hover:border-ink hover:text-ink"
                  >
                    <Plus size={14} /> Add one more
                  </button>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>

      <AnimatePresence>
        {bothDone && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-5 rounded-2xl border-2 border-ink bg-ink p-4 text-center font-display text-lg text-cream"
          >
            20 honest lines about yourself. 🎉 Now compare your strengths with what your <span className="text-sun">5 people</span>{" "}
            said — where do they match?
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
