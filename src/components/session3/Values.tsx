"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Crown, RotateCcw } from "lucide-react";
import { useLocalState } from "@/lib/useLocalState";
import { PrivateBadge, Reveal, Stop } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";
import { VALUES_EMPTY, type ValuesState } from "./state";

export const VALUES: [string, string][] = [
  ["Family", "👨‍👩‍👧"], ["Honesty", "🤝"], ["Kindness", "💛"], ["Courage", "🦁"], ["Freedom", "🕊️"], ["Learning", "📚"],
  ["Creativity", "🎨"], ["Faith", "🙏"], ["Health", "🥦"], ["Friendship", "👯"], ["Respect", "🙌"], ["Hard work", "🛠️"],
  ["Fun", "🎉"], ["Adventure", "🧗"], ["Helping others", "🫶"], ["Success", "🏆"], ["Fairness", "⚖️"], ["Loyalty", "🛡️"],
  ["Peace", "🌿"], ["Leadership", "🧭"], ["Independence", "🚲"], ["Gratitude", "🌻"], ["Discipline", "⏰"], ["Nature", "🌳"],
];
const PICK = 10;
const TOP = 3;

export function Values() {
  const [s, setS] = useLocalState<ValuesState>("s3-values", VALUES_EMPTY);
  const [shake, setShake] = useState<string | null>(null);
  const round = s.picked.length >= PICK || s.top.length > 0 ? 2 : 1;

  const bump = (v: string) => {
    setShake(v);
    window.setTimeout(() => setShake(null), 400);
  };

  const togglePick = (v: string) => {
    setS((p) => {
      if (p.picked.includes(v)) return { picked: p.picked.filter((x) => x !== v), top: p.top.filter((x) => x !== v) };
      if (p.picked.length >= PICK) {
        bump(v);
        return p;
      }
      return { ...p, picked: [...p.picked, v] };
    });
  };

  const toggleTop = (v: string) => {
    setS((p) => {
      if (p.top.includes(v)) return { ...p, top: p.top.filter((x) => x !== v) };
      if (p.top.length >= TOP) {
        bump(v);
        return p;
      }
      const top = [...p.top, v];
      if (top.length === TOP) celebrate("big");
      return { ...p, top };
    });
  };

  const emoji = (v: string) => VALUES.find(([n]) => n === v)?.[1] ?? "⭐";

  return (
    <Stop
      id="values"
      stop={3}
      kicker="Piece 2 · My values"
      tone="sky"
      title={
        <>
          Your values are your <span className="text-sky-deep">compass</span> 🧭
        </>
      }
      intro="Values are what matter most to you — the things you'd stand up for. When you have a hard choice, your values point the way. Two rounds: pick 10, then keep only your top 3."
      aside={<PrivateBadge />}
    >
      <Reveal>
        <div className="mb-5 flex flex-wrap items-center gap-3">
          {[1, 2].map((r) => (
            <span
              key={r}
              className={`rounded-full border-2 px-4 py-1.5 font-display text-sm font-bold ${
                round === r ? "border-ink bg-sun" : "border-ink/20 bg-white text-ink-soft"
              }`}
            >
              Round {r}: {r === 1 ? `pick ${PICK} (${s.picked.length}/${PICK})` : `crown your top ${TOP} (${s.top.length}/${TOP})`}
            </span>
          ))}
          {s.picked.length > 0 && (
            <button onClick={() => setS(VALUES_EMPTY)} className="flex items-center gap-1 text-sm font-semibold text-ink-soft hover:text-ink">
              <RotateCcw size={14} /> Start over
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-6">
          {VALUES.map(([v, e], i) => {
            const on = s.picked.includes(v);
            const top = s.top.includes(v);
            const out = round === 2 && !on;
            return (
              <motion.div
                key={v}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.015 }}
                animate={shake === v ? { x: [0, -6, 6, -3, 0] } : {}}
                className="relative"
              >
                <button
                  onClick={() => (round === 2 && on ? toggleTop(v) : togglePick(v))}
                  aria-pressed={round === 2 ? top : on}
                  className={`flex w-full items-center gap-2 rounded-2xl border-2 p-2.5 text-left transition-all ${
                    top
                      ? "-translate-y-1 border-ink bg-sun shadow-pop"
                      : on
                        ? "border-ink bg-white shadow-pop"
                        : out
                          ? "border-ink/10 bg-white/40 opacity-50"
                          : "border-ink/15 bg-white/70 hover:border-ink/60"
                  }`}
                >
                  <span className="text-2xl">{e}</span>
                  <span className="text-sm leading-tight font-semibold">{v}</span>
                </button>
                {top && (
                  <span className="absolute -top-2.5 -right-1.5 grid h-7 w-7 place-items-center rounded-full border-2 border-ink bg-white">
                    <Crown size={14} />
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
        {round === 2 && s.top.length < TOP && (
          <p className="mt-4 font-semibold text-sky-deep">
            Tap your picked cards to crown your top {TOP}. Tough? That&apos;s the point — it shows what truly matters.
          </p>
        )}
      </Reveal>

      <AnimatePresence>
        {s.top.length === TOP && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8 rounded-[2rem] border-2 border-ink bg-ink p-6 text-center text-cream shadow-pop"
          >
            <p className="text-sm font-bold tracking-widest text-cream/70 uppercase">My compass</p>
            <p className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              {s.top.map((v, i) => (
                <span key={v}>
                  {i > 0 && <span className="text-sun"> · </span>}
                  {emoji(v)} {v}
                </span>
              ))}
            </p>
            <p className="mt-3 text-cream/75">Do your dreams match your values? If “Family” is on top, does your future include time for them?</p>
          </motion.div>
        )}
      </AnimatePresence>
    </Stop>
  );
}
