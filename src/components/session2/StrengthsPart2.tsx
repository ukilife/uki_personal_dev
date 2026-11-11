"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ArrowRight, Plus, X } from "lucide-react";
import { useLocalState, useStoredSnapshot } from "@/lib/useLocalState";
import { PrivateBadge, Reveal, Stop } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";
import { TEN_AND_TEN_EMPTY, type TenAndTenState } from "@/components/session1/TenAndTen";
import { POWERS, POWER_EMPTY, type PowerState } from "@/components/session1/Superpowers";

type Verdict = "fix" | "manage" | "accept";
type Bridge = { weak: string; strong: string; action: string };
export type StrengthsTwoState = {
  extraStrong: string[];
  extraWeak: string[];
  sort: Record<string, Verdict>;
  bridges: Bridge[];
};
export const STRENGTHS_TWO_EMPTY: StrengthsTwoState = {
  extraStrong: [],
  extraWeak: [],
  sort: {},
  bridges: [
    { weak: "", strong: "", action: "" },
    { weak: "", strong: "", action: "" },
    { weak: "", strong: "", action: "" },
  ],
};

const VERDICTS: { id: Verdict; label: string; emoji: string; on: string; tip: string }[] = [
  { id: "fix", label: "Fix it", emoji: "🔧", on: "bg-teal text-white", tip: "A skill I can practise and get better at." },
  { id: "manage", label: "Manage it", emoji: "🧭", on: "bg-sun", tip: "I can plan around it with tricks and tools." },
  { id: "accept", label: "Accept it", emoji: "🤝", on: "bg-lilac", tip: "Not that important for my goals — and that's OK." },
];

function AddOwn({ placeholder, onAdd }: { placeholder: string; onAdd: (v: string) => void }) {
  const [v, setV] = useState("");
  return (
    <form
      className="mt-3 flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (v.trim()) onAdd(v.trim());
        setV("");
      }}
    >
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        maxLength={60}
        placeholder={placeholder}
        aria-label={placeholder}
        className="min-w-0 flex-1 rounded-xl border-2 border-ink bg-white px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-sun/60"
      />
      <button type="submit" aria-label="Add" className="grid w-10 place-items-center rounded-xl border-2 border-ink bg-sun">
        <Plus size={16} />
      </button>
    </form>
  );
}

export function StrengthsPart2() {
  const [s, setS] = useLocalState<StrengthsTwoState>("s2-strengths", STRENGTHS_TWO_EMPTY);
  const ten = useStoredSnapshot<TenAndTenState>("s1-ten-and-ten", TEN_AND_TEN_EMPTY);
  const powers = useStoredSnapshot<PowerState>("s1-superpowers", POWER_EMPTY);

  const uniq = (xs: string[]) => [...new Set(xs.map((x) => x.trim()).filter(Boolean))];
  const strong = uniq([
    ...ten.strengths,
    ...powers.picked.map((id) => POWERS.find((p) => p.id === id)?.label ?? ""),
    ...s.extraStrong,
  ]);
  const weak = uniq([...ten.improve, ...s.extraWeak]);
  const sorted = weak.filter((w) => s.sort[w]).length;

  const setVerdict = (w: string, v: Verdict) =>
    setS((p) => {
      const sort = { ...p.sort, [w]: v };
      if (weak.length > 0 && weak.every((x) => sort[x]) && !weak.every((x) => p.sort[x])) celebrate("small");
      return { ...p, sort };
    });

  const setBridge = (i: number, patch: Partial<Bridge>) =>
    setS((p) => ({ ...p, bridges: p.bridges.map((b, j) => (j === i ? { ...b, ...patch } : b)) }));

  const select =
    "w-full min-w-0 rounded-xl border-2 border-ink bg-white px-3 py-2 text-sm font-semibold outline-none focus:ring-4 focus:ring-sun/60";

  return (
    <Stop
      id="strengths"
      stop={1}
      kicker="Strengths & weaknesses · Part 2"
      tone="cream"
      title={
        <>
          Your weaknesses aren&apos;t a <span className="text-coral">wall.</span> They&apos;re a{" "}
          <span className="text-teal">map.</span>
        </>
      }
      intro="Last week you listed what you're good at and what you want to improve. Now we decide what to DO about each one — and use your strengths to climb over your weaknesses."
      aside={<PrivateBadge />}
    >
      {/* Eye-opener */}
      <Reveal>
        <div className="mb-10 grid gap-4 md:grid-cols-3">
          {[
            ["😬", "Hiding a weakness", "doesn't make it go away. It just makes it louder in your head."],
            ["🔦", "Naming a weakness", "turns it from a feeling into a problem — and problems can be solved."],
            ["🌉", "Your strengths", "are the bridge. A good listener can learn faster. A creative mind can find new ways to study."],
          ].map(([e, t, b], i) => (
            <motion.div
              key={t}
              whileHover={{ y: -4, rotate: i === 1 ? 0 : i ? 1 : -1 }}
              className="rounded-[1.75rem] border-2 border-ink bg-white p-5 shadow-pop"
            >
              <span className="text-4xl">{e}</span>
              <p className="mt-2 font-display text-xl font-bold">{t}</p>
              <p className="text-ink-soft">{b}</p>
            </motion.div>
          ))}
        </div>
      </Reveal>

      {/* Step A: sort */}
      <Reveal>
        <div className="rounded-[2rem] border-2 border-ink bg-blush/60 p-5 shadow-pop sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-display text-sm font-bold tracking-[0.2em] text-coral uppercase">Step A · Sort it</p>
              <h3 className="mt-1 text-3xl font-bold">Fix it, manage it, or accept it?</h3>
            </div>
            {weak.length > 0 && (
              <span className="rounded-full border-2 border-ink bg-white px-3 py-1 font-display font-bold tabular-nums">
                {sorted}/{weak.length} sorted
              </span>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            {VERDICTS.map((v) => (
              <span key={v.id} className="rounded-full border-2 border-ink/20 bg-white px-3 py-1">
                {v.emoji} <b>{v.label}</b> — {v.tip}
              </span>
            ))}
          </div>

          {weak.length === 0 ? (
            <div className="mt-5 rounded-2xl border-2 border-dashed border-ink/30 bg-white/70 p-5">
              <p className="font-semibold">
                Your 10 + 10 list from Session 1 is empty on this device. Add a few things you want to improve:
              </p>
              <AddOwn
                placeholder="e.g. Being on time"
                onAdd={(v) => setS((p) => ({ ...p, extraWeak: [...p.extraWeak, v] }))}
              />
            </div>
          ) : (
            <ul className="mt-5 grid gap-3 md:grid-cols-2">
              {weak.map((w) => (
                <li key={w} className="flex flex-wrap items-center gap-2 rounded-2xl border-2 border-ink bg-white p-3">
                  <span className="min-w-0 flex-1 font-semibold">{w}</span>
                  <span className="flex gap-1" role="group" aria-label={`What to do about ${w}`}>
                    {VERDICTS.map((v) => {
                      const on = s.sort[w] === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => setVerdict(w, v.id)}
                          aria-pressed={on}
                          title={v.label}
                          className={`rounded-xl border-2 px-2 py-1 text-xs font-bold transition ${
                            on ? `border-ink ${v.on}` : "border-ink/15 hover:border-ink"
                          }`}
                        >
                          {v.emoji} <span className="hidden sm:inline">{v.label}</span>
                        </button>
                      );
                    })}
                  </span>
                  {s.extraWeak.includes(w) && (
                    <button
                      aria-label={`Remove ${w}`}
                      onClick={() => setS((p) => ({ ...p, extraWeak: p.extraWeak.filter((x) => x !== w) }))}
                      className="text-ink/40 hover:text-ink"
                    >
                      <X size={14} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          {weak.length > 0 && (
            <AddOwn placeholder="Add another one…" onAdd={(v) => setS((p) => ({ ...p, extraWeak: [...p.extraWeak, v] }))} />
          )}
        </div>
      </Reveal>

      {/* Step B: bridges */}
      <Reveal className="mt-8">
        <div className="rounded-[2rem] border-2 border-ink bg-teal-soft p-5 shadow-pop sm:p-7">
          <p className="font-display text-sm font-bold tracking-[0.2em] text-teal uppercase">Step B · Build a bridge</p>
          <h3 className="mt-1 text-3xl font-bold">Use a strength to beat a weakness 🌉</h3>
          <p className="mt-2 text-ink-soft">
            Pick a weakness you want to <b>fix</b> or <b>manage</b>. Which of your strengths could help? What will you actually do?
          </p>
          {strong.length === 0 && (
            <div className="mt-4 rounded-2xl border-2 border-dashed border-ink/30 bg-white/70 p-4">
              <p className="text-sm font-semibold">No strengths saved from Session 1 on this device — add some here:</p>
              <AddOwn
                placeholder="e.g. Good listener"
                onAdd={(v) => setS((p) => ({ ...p, extraStrong: [...p.extraStrong, v] }))}
              />
            </div>
          )}
          <div className="mt-5 space-y-4">
            {s.bridges.map((b, i) => {
              const ready = b.weak && b.strong && b.action.trim();
              return (
                <motion.div
                  key={i}
                  animate={ready ? { scale: [1, 1.02, 1] } : {}}
                  className={`grid items-center gap-2 rounded-2xl border-2 border-ink p-3 md:grid-cols-[1fr_auto_1fr_auto_1.4fr] ${
                    ready ? "bg-white" : "bg-white/60"
                  }`}
                >
                  <select
                    value={b.weak}
                    onChange={(e) => setBridge(i, { weak: e.target.value })}
                    aria-label={`Bridge ${i + 1}: weakness`}
                    className={select}
                  >
                    <option value="">🌱 Pick a weakness…</option>
                    {weak
                      .filter((w) => s.sort[w] !== "accept")
                      .map((w) => (
                        <option key={w}>{w}</option>
                      ))}
                  </select>
                  <span className="hidden text-center font-display text-sm font-bold text-ink-soft md:block">helped by</span>
                  <select
                    value={b.strong}
                    onChange={(e) => setBridge(i, { strong: e.target.value })}
                    aria-label={`Bridge ${i + 1}: strength`}
                    className={select}
                  >
                    <option value="">⭐ Pick a strength…</option>
                    {strong.map((w) => (
                      <option key={w}>{w}</option>
                    ))}
                  </select>
                  <ArrowRight className="mx-auto hidden md:block" size={18} />
                  <input
                    value={b.action}
                    onChange={(e) => setBridge(i, { action: e.target.value })}
                    maxLength={100}
                    placeholder="So this week I will…"
                    aria-label={`Bridge ${i + 1}: action`}
                    className={select + " font-normal"}
                  />
                </motion.div>
              );
            })}
          </div>
          <AnimatePresence>
            {s.bridges.some((b) => b.weak && b.strong && b.action.trim()) && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-5 rounded-2xl border-2 border-ink bg-ink p-4 text-center font-display text-lg text-cream"
              >
                That&apos;s the secret: you don&apos;t need to be strong everywhere. You need to{" "}
                <span className="text-sun">use what you&apos;ve got.</span> 💪
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </Stop>
  );
}
