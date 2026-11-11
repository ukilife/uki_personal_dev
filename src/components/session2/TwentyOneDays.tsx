"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, ExternalLink } from "lucide-react";
import { useLocalState } from "@/lib/useLocalState";
import { PrivateBadge, Reveal, Stop } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";

export const MINERVA_URL = "https://minerva-90.vercel.app/";

export type TwentyOneState = { habit: string; when: string; start: string; days: boolean[] };
export const TWENTY_ONE_EMPTY: TwentyOneState = { habit: "", when: "", start: "", days: Array(21).fill(false) };

const IDEAS = [
  ["📚", "Read 7 pages"],
  ["💪", "20 push-ups"],
  ["📵", "No phone after 9 pm"],
  ["⏰", "Wake up at 6 am"],
  ["💧", "Drink 8 glasses of water"],
  ["✍️", "Write 3 lines in my journal"],
  ["🎸", "Practise a skill for 15 minutes"],
  ["🛏️", "Make my bed every morning"],
  ["🪙", "Save a little money every day"],
  ["🙏", "Say thank you to one person"],
];

const PHASES = [
  { days: "Days 1–7", name: "The Hard Start", emoji: "😤", text: "Everything in you wants to skip. This is where most people quit. Just show up." },
  { days: "Days 8–14", name: "The Wobble", emoji: "🌊", text: "The excitement is gone. Do it anyway — even a tiny version counts." },
  { days: "Days 15–21", name: "The Click", emoji: "🔓", text: "It starts to feel normal. Missing a day feels strange. That's a habit forming." },
];

export function TwentyOneDays() {
  const [s, setS] = useLocalState<TwentyOneState>("s2-21days", TWENTY_ONE_EMPTY);
  const days = Array.from({ length: 21 }, (_, i) => !!s.days[i]);
  const done = days.filter(Boolean).length;
  let streak = 0;
  for (const d of days) streak = d ? streak + 1 : 0;

  const toggle = (i: number) => {
    const next = days.map((v, j) => (j === i ? !v : v));
    const n = next.filter(Boolean).length;
    if (n === 21 && done < 21) celebrate("big");
    else if (n > done && [7, 14].includes(n)) celebrate("small");
    setS((p) => ({ ...p, days: next }));
  };

  return (
    <Stop
      id="21-days"
      stop={4}
      kicker="The 21-day challenge"
      tone="mint"
      title={
        <>
          One small thing. <span className="text-teal">21 days</span> in a row.
        </>
      }
      intro="Talking about discipline is easy. Now let's practise it. Pick ONE small habit and do it every day for 21 days — enough time to get through the hard part and feel it start to click."
      aside={<PrivateBadge />}
    >
      <Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {PHASES.map((p, i) => (
            <motion.div
              key={p.name}
              whileHover={{ y: -4 }}
              className="relative rounded-[1.75rem] border-2 border-ink bg-white p-5 shadow-pop"
            >
              <span className="absolute -top-3 left-5 rounded-full border-2 border-ink bg-sun px-2.5 py-0.5 text-xs font-bold">
                {p.days}
              </span>
              <span className="text-4xl">{p.emoji}</span>
              <p className="mt-1 font-display text-xl font-bold">
                {i + 1}. {p.name}
              </p>
              <p className="text-ink-soft">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </Reveal>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        {/* pick + pledge */}
        <Reveal>
          <h3 className="text-3xl font-bold">1 · Pick your challenge</h3>
          <p className="mt-1 text-ink-soft">Small enough to do on your worst day. Tap an idea or write your own.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {IDEAS.map(([e, t]) => {
              const on = s.habit === t;
              return (
                <button
                  key={t}
                  onClick={() => setS((p) => ({ ...p, habit: t }))}
                  aria-pressed={on}
                  className={`rounded-full border-2 px-3 py-1.5 text-sm font-semibold transition ${
                    on ? "border-ink bg-teal text-white" : "border-ink/20 bg-white hover:border-ink"
                  }`}
                >
                  {e} {t}
                </button>
              );
            })}
          </div>
          <div className="mt-6 rounded-[2rem] border-2 border-ink bg-white p-5 shadow-pop">
            <p className="font-display text-sm font-bold tracking-[0.2em] text-grape uppercase">2 · My pledge</p>
            <div className="mt-3 space-y-3 text-lg">
              <label className="block">
                <span className="font-semibold">Every day for 21 days, I will…</span>
                <input
                  value={s.habit}
                  onChange={(e) => setS((p) => ({ ...p, habit: e.target.value }))}
                  maxLength={60}
                  placeholder="read 7 pages"
                  className="mt-1 w-full border-b-2 border-dashed border-ink/30 bg-transparent py-1 font-display text-2xl font-bold outline-none focus:border-solid focus:border-ink"
                />
              </label>
              <label className="block">
                <span className="font-semibold">When? (time or trigger)</span>
                <input
                  value={s.when}
                  onChange={(e) => setS((p) => ({ ...p, when: e.target.value }))}
                  maxLength={60}
                  placeholder="right after dinner"
                  className="mt-1 w-full border-b-2 border-dashed border-ink/30 bg-transparent py-1 outline-none focus:border-solid focus:border-ink"
                />
              </label>
              <label className="block">
                <span className="font-semibold">Starting on</span>
                <input
                  type="date"
                  value={s.start}
                  onChange={(e) => setS((p) => ({ ...p, start: e.target.value }))}
                  className="mt-1 block rounded-xl border-2 border-ink bg-cream px-3 py-1.5 outline-none focus:ring-4 focus:ring-sun/60"
                />
              </label>
            </div>
          </div>
        </Reveal>

        {/* tracker */}
        <Reveal delay={0.1}>
          <h3 className="text-3xl font-bold">3 · Tick it off</h3>
          <p className="mt-1 text-ink-soft">One tick per day. Missed one? Don&apos;t break the chain twice — just start again tomorrow.</p>
          <div className="mt-4 rounded-[2rem] border-2 border-ink bg-white p-5 shadow-pop">
            <p className="font-display text-xl font-bold">{s.habit ? `“${s.habit}”` : "Your challenge"}</p>
            <div className="mt-4 grid grid-cols-7 gap-2">
              {days.map((d, i) => (
                <motion.button
                  key={i}
                  onClick={() => toggle(i)}
                  whileTap={{ scale: 0.85 }}
                  aria-pressed={d}
                  aria-label={`Day ${i + 1}${d ? ", done" : ""}`}
                  className={`relative grid aspect-square place-items-center rounded-xl border-2 font-display font-bold transition ${
                    d ? "border-ink bg-teal text-white" : i % 7 === 6 ? "border-ink/40 bg-sun-soft" : "border-ink/20 bg-cream hover:border-ink"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {d ? (
                      <motion.span key="c" initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }}>
                        <Check size={20} strokeWidth={3} />
                      </motion.span>
                    ) : (
                      <motion.span key="n">{i + 1}</motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-sm font-bold">
              <span className="rounded-full border-2 border-ink bg-sun px-3 py-1">{done}/21 days</span>
              <span className="rounded-full border-2 border-ink bg-white px-3 py-1">🔥 Current streak: {streak}</span>
            </div>
          </div>

          <div className="mt-5 rounded-[2rem] border-2 border-ink bg-grape p-5 text-white shadow-pop">
            <p className="font-display text-xl font-bold">Want a proper tracker?</p>
            <p className="mt-1 text-white/85">
              <b>The Minerva</b> is a free daily planner, journal and habit tracker — it has streak grids and a spot for a new skill
              practised for 21 days. Use it on your phone so your challenge goes everywhere with you.
            </p>
            <a
              href={MINERVA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pop mt-4 inline-flex items-center gap-2 rounded-2xl border-2 border-ink bg-sun px-5 py-3 font-display font-semibold text-ink"
            >
              Open The Minerva <ExternalLink size={16} />
            </a>
            <p className="mt-2 text-xs text-white/70">Opens a separate website in a new tab. It needs its own free account.</p>
          </div>
        </Reveal>
      </div>
    </Stop>
  );
}
