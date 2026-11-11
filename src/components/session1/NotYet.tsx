"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Footprints, Sprout } from "lucide-react";
import { useLocalState } from "@/lib/useLocalState";
import { PrivateBadge, Reveal, Stop } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";

const CHALLENGES = [
  { n: "01", cant: "“I'm afraid to speak.”", step: "Talk for 1 minute to a mirror (or your pet!)", emoji: "🪞" },
  { n: "02", cant: "“I lose focus.”", step: "Read for 10 minutes with your phone in another room", emoji: "📖" },
  { n: "03", cant: "“I give up too fast.”", step: "Try just ONE more time before you stop", emoji: "🔁" },
];

export type NotYetState = { weak: string[]; chosen: number | null; step: string; done: boolean };
export const NOT_YET_EMPTY: NotYetState = { weak: ["", "", ""], chosen: null, step: "", done: false };

function FlipCard({ c, i }: { c: (typeof CHALLENGES)[number]; i: number }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      onClick={() => setFlipped((f) => !f)}
      className="group relative h-56 w-full [perspective:1000px]"
      aria-label={`Challenge ${c.n}: tap to flip`}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        className="relative h-full w-full [transform-style:preserve-3d]"
      >
        <div className="absolute inset-0 flex flex-col justify-between rounded-[2rem] border-2 border-ink bg-white p-5 text-left shadow-pop [backface-visibility:hidden]">
          <span className="font-display text-sm font-bold text-ink/40">CHALLENGE {c.n}</span>
          <p className="font-display text-2xl leading-tight font-bold">{c.cant}</p>
          <span className="flex items-center gap-1 text-sm font-semibold text-coral">
            Tap to flip → <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}>↻</motion.span>
          </span>
        </div>
        <div className="absolute inset-0 flex flex-col justify-between rounded-[2rem] border-2 border-ink bg-teal p-5 text-left text-white shadow-pop [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="font-display text-sm font-bold text-white/70">THE “NOT YET” STEP</span>
          <span className="text-4xl">{c.emoji}</span>
          <p className="font-display text-xl leading-tight font-semibold">{c.step}</p>
        </div>
      </motion.div>
    </button>
  );
}

export function NotYet() {
  const [s, setS] = useLocalState<NotYetState>("s1-not-yet", NOT_YET_EMPTY);
  const [yet, setYet] = useState(false);

  return (
    <Stop
      id="not-yet"
      stop={9}
      kicker="Life marathon · Step 2 · Weaknesses"
      tone="blush"
      title={
        <>
          Your weakness is <span className="text-berry">not</span> your identity
        </>
      }
      intro="A weakness is just a skill that hasn't grown yet. Watch what happens when you change two little words…"
    >
      {/* I can't -> Not YET */}
      <Reveal className="mb-10 flex flex-col items-center gap-4">
        <button
          onClick={() => {
            setYet((y) => !y);
            if (!yet) celebrate("small");
          }}
          className="relative h-28 w-full max-w-xl overflow-hidden rounded-[2rem] border-4 border-ink bg-white shadow-pop-lg"
          aria-label="Transform I can't into Not yet"
        >
          <AnimatePresence mode="wait">
            {yet ? (
              <motion.span
                key="yet"
                initial={{ y: 60, opacity: 0, scale: 0.6 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -60, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 12 }}
                className="absolute inset-0 grid place-items-center bg-teal font-display text-5xl font-bold text-sun sm:text-6xl"
              >
                Not YET! 🌱
              </motion.span>
            ) : (
              <motion.span
                key="cant"
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -60, opacity: 0, rotate: -6 }}
                className="absolute inset-0 grid place-items-center font-display text-5xl font-bold text-ink/50 line-through decoration-berry decoration-4 sm:text-6xl"
              >
                “I can&apos;t.”
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <p className="text-sm font-semibold text-ink-soft">{yet ? "Feels different, right? Tap again to flip back." : "👆 Tap to transform"}</p>
      </Reveal>

      <div className="grid gap-5 md:grid-cols-3">
        {CHALLENGES.map((c, i) => (
          <Reveal key={c.n} delay={i * 0.08}>
            <FlipCard c={c} i={i} />
          </Reveal>
        ))}
      </div>

      {/* Your turn */}
      <Reveal className="mt-10 rounded-[2rem] border-2 border-ink bg-white p-6 shadow-pop-lg sm:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-3xl font-bold">Your turn</h3>
          <PrivateBadge />
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="font-semibold">
              <span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-sun text-sm">1</span>
              Write 3 things you find hard right now
            </p>
            <div className="mt-3 space-y-2">
              {s.weak.map((w, i) => {
                const chosen = s.chosen === i;
                return (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={w}
                      onChange={(e) => setS((x) => ({ ...x, weak: x.weak.map((v, j) => (j === i ? e.target.value : v)) }))}
                      maxLength={70}
                      placeholder={["e.g. Public speaking", "e.g. Waking up early", "e.g. Maths"][i]}
                      className={`w-full rounded-xl border-2 px-3 py-2.5 outline-none transition focus:ring-4 focus:ring-sun/50 ${
                        chosen ? "border-teal bg-teal-soft font-semibold" : "border-ink/25 bg-cream"
                      }`}
                    />
                    <button
                      disabled={!w.trim()}
                      onClick={() => setS((x) => ({ ...x, chosen: chosen ? null : i, done: false }))}
                      className={`shrink-0 rounded-xl border-2 px-3 py-2.5 text-sm font-bold transition disabled:opacity-30 ${
                        chosen ? "border-ink bg-teal text-white" : "border-ink/25 hover:border-ink"
                      }`}
                    >
                      {chosen ? "✓ This one" : "Pick"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <p className="font-semibold">
              <span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-sun text-sm">2</span>
              One tiny step you can take <u>today</u>
            </p>
            {s.chosen === null ? (
              <div className="mt-3 grid h-36 place-items-center rounded-2xl border-2 border-dashed border-ink/25 p-4 text-center text-sm text-ink-soft">
                Pick ONE weakness on the left to work on first.
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
                <div className="rounded-2xl bg-blush/70 px-4 py-3 text-sm">
                  <span className="font-semibold">“{s.weak[s.chosen]}”</span> → not yet… <b>but here&apos;s my first step:</b>
                </div>
                <textarea
                  value={s.step}
                  onChange={(e) => setS((x) => ({ ...x, step: e.target.value }))}
                  rows={3}
                  maxLength={160}
                  placeholder="Small enough to do in 10 minutes…"
                  className="mt-3 w-full resize-none rounded-xl border-2 border-ink/25 bg-cream px-3 py-2.5 outline-none focus:border-ink focus:ring-4 focus:ring-sun/50"
                />
                <button
                  disabled={!s.step.trim()}
                  onClick={() => {
                    setS((x) => ({ ...x, done: !x.done }));
                    if (!s.done) celebrate("small");
                  }}
                  className={`btn-pop mt-2 flex items-center gap-2 rounded-2xl border-2 border-ink px-4 py-2.5 font-display font-semibold disabled:opacity-40 ${
                    s.done ? "bg-teal text-white" : "bg-sun"
                  }`}
                >
                  {s.done ? <Sprout size={18} /> : <Footprints size={18} />}
                  {s.done ? "Step taken — you're growing!" : "I did my tiny step"}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </Reveal>
    </Stop>
  );
}
