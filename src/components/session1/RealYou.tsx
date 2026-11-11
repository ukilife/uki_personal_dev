"use client";

import { motion } from "motion/react";
import { Feather, Heart, ShieldQuestionMark, Star, type LucideIcon } from "lucide-react";
import { useLocalState } from "@/lib/useLocalState";
import { PrivateBadge, Reveal, Stop } from "@/components/ui";

export type RealYou = { passions: string[]; talents: string[]; fear: string[]; admire: string[] };
export const REAL_YOU_EMPTY: RealYou = {
  passions: ["", "", ""],
  talents: ["", "", ""],
  fear: ["", "", ""],
  admire: ["", "", ""],
};

const CARDS: {
  key: keyof RealYou;
  title: string;
  prompt: string;
  icon: LucideIcon;
  bg: string;
  accent: string;
  placeholder: string[];
}[] = [
  {
    key: "passions",
    title: "Passions",
    prompt: "3 things I love",
    icon: Heart,
    bg: "bg-sun-soft",
    accent: "bg-sun",
    placeholder: ["Late-night music", "Football with friends", "Making people laugh"],
  },
  {
    key: "talents",
    title: "Talents",
    prompt: "3 things I'm good at",
    icon: Star,
    bg: "bg-teal-soft",
    accent: "bg-teal text-white",
    placeholder: ["Fixing things", "Listening", "Drawing"],
  },
  {
    key: "fear",
    title: "Honesty",
    prompt: "3 things I'm afraid of",
    icon: ShieldQuestionMark,
    bg: "bg-blush",
    accent: "bg-coral text-white",
    placeholder: ["Be honest — only you can see this", "Something that makes me nervous", "A fear I'd love to beat one day"],
  },
  {
    key: "admire",
    title: "Inspiration",
    prompt: "3 people I admire (and why)",
    icon: Feather,
    bg: "bg-lilac",
    accent: "bg-grape text-white",
    placeholder: ["My grandmother, because…", "A teacher or coach, because…", "Someone famous, because…"],
  },
];

export function RealYouJournal() {
  const [data, setData] = useLocalState<RealYou>("s1-real-you", REAL_YOU_EMPTY);
  // older saves had 1 line for honesty/inspiration — always read N lines per card
  const lines = (k: keyof RealYou, n: number) => Array.from({ length: n }, (_, j) => data[k]?.[j] ?? "");
  const filled = CARDS.reduce((n, c) => n + lines(c.key, c.placeholder.length).filter((v) => v.trim()).length, 0);
  const total = CARDS.reduce((n, c) => n + c.placeholder.length, 0);

  return (
    <Stop
      id="real-you"
      stop={5}
      kicker="Growth Journal · Page 1"
      tone="cream"
      title={
        <>
          Meet the <span className="squiggle">Real You</span>
        </>
      }
      intro="No comparisons. No right or wrong answers. Just YOU. Take a quiet moment and fill your first journal page."
      aside={<PrivateBadge />}
    >
      <div className="relative">
        {/* binder rings */}
        <div className="pointer-events-none absolute top-0 bottom-0 left-1/2 hidden -translate-x-1/2 flex-col justify-around md:flex">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="h-5 w-10 rounded-full border-4 border-ink/70 bg-cream" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 md:gap-x-16">
          {CARDS.map((c, ci) => {
            const Icon = c.icon;
            const done = lines(c.key, c.placeholder.length).every((v) => v.trim());
            return (
              <Reveal key={c.key} delay={ci * 0.08}>
                <motion.div
                  whileHover={{ rotate: ci % 2 ? 0.6 : -0.6 }}
                  className={`relative h-full rounded-[2rem] border-2 border-ink p-6 shadow-pop ${c.bg}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`grid h-12 w-12 place-items-center rounded-2xl border-2 border-ink ${c.accent}`}>
                      <Icon size={22} />
                    </span>
                    <div>
                      <h3 className="text-2xl font-bold">{c.title}</h3>
                      <p className="text-sm font-medium text-ink-soft">{c.prompt}</p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-3">
                    {c.placeholder.map((ph, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="font-display w-5 text-right text-lg font-bold text-ink/30">{i + 1}</span>
                        <input
                          value={data[c.key]?.[i] ?? ""}
                          onChange={(e) =>
                            setData((d) => ({
                              ...d,
                              [c.key]: Array.from({ length: c.placeholder.length }, (_, j) =>
                                j === i ? e.target.value : (d[c.key]?.[j] ?? ""),
                              ),
                            }))
                          }
                          maxLength={80}
                          placeholder={ph}
                          className="w-full border-b-2 border-dashed border-ink/30 bg-transparent px-1 py-2 text-lg outline-none placeholder:text-ink/30 focus:border-solid focus:border-ink"
                        />
                      </div>
                    ))}
                  </div>
                  {done && (
                    <motion.span
                      initial={{ scale: 2, opacity: 0, rotate: 20 }}
                      animate={{ scale: 1, opacity: 1, rotate: -12 }}
                      transition={{ type: "spring", stiffness: 250, damping: 12 }}
                      className="absolute -top-4 -right-3 rounded-xl border-2 border-ink bg-white px-3 py-1 font-display text-sm font-bold text-teal"
                    >
                      ✓ that&apos;s you!
                    </motion.span>
                  )}
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
      <Reveal className="mt-8 flex flex-wrap items-center gap-4">
        <div className="flex gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <motion.span
              key={i}
              animate={{ scale: i < filled ? 1 : 0.7 }}
              className={`h-3 w-3 rounded-full border-2 border-ink ${i < filled ? "bg-coral" : "bg-white"}`}
            />
          ))}
        </div>
        <p className="text-sm font-semibold text-ink-soft">
          {filled === total ? "Page complete. Your creator is starting to show. ✨" : `${filled}/${total} lines written`}
        </p>
      </Reveal>
    </Stop>
  );
}
