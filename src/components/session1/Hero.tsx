"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ArrowDown, Sparkles, X } from "lucide-react";
import { useLocalState } from "@/lib/useLocalState";
import { Button, Pill } from "@/components/ui";

const MARKS = [
  { left: "6%", top: "18%", size: "text-6xl", delay: 0, color: "text-coral" },
  { left: "88%", top: "14%", size: "text-7xl", delay: 0.6, color: "text-teal" },
  { left: "80%", top: "70%", size: "text-5xl", delay: 1.2, color: "text-grape" },
  { left: "12%", top: "76%", size: "text-8xl", delay: 0.3, color: "text-sky-deep" },
  { left: "48%", top: "6%", size: "text-4xl", delay: 0.9, color: "text-sun" },
];

const BANNED = ["name", "age", "hometown", "from"];

export function Hero() {
  const [words, setWords] = useLocalState<string[]>("s1-mirror-words", []);
  const [draft, setDraft] = useState("");
  const [warn, setWarn] = useState("");

  const add = () => {
    const w = draft.trim();
    if (!w) return;
    if (/\d/.test(w) || BANNED.some((b) => w.toLowerCase().includes(b))) {
      setWarn("Sneaky! No names, ages or hometowns. Try a feeling, a habit, a vibe… ✨");
      return;
    }
    setWarn("");
    setWords((p) => [...p, w].slice(-3));
    setDraft("");
  };

  return (
    <section id="start" data-stop="start" className="relative overflow-hidden bg-sky">
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      {MARKS.map((m, i) => (
        <motion.span
          key={i}
          aria-hidden
          className={`pointer-events-none absolute font-display font-bold ${m.size} ${m.color} select-none`}
          style={{ left: m.left, top: m.top }}
          initial={{ opacity: 0, scale: 0.4, rotate: -30 }}
          animate={{ opacity: 0.9, scale: 1, rotate: 0, y: [0, -16, 0] }}
          transition={{
            opacity: { delay: m.delay, duration: 0.6 },
            scale: { delay: m.delay, type: "spring" },
            rotate: { delay: m.delay, type: "spring" },
            y: { delay: m.delay, duration: 5 + i, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          ?
        </motion.span>
      ))}

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-16 pb-24 sm:px-8 md:grid-cols-[1.15fr_1fr] md:pt-24 lg:pl-28">
        <div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Pill className="bg-white text-ink">
              <Sparkles size={14} /> Session 01 · Self-discovery
            </Pill>
          </motion.div>
          <motion.h1
            className="mt-6 text-6xl leading-[0.95] font-bold sm:text-7xl md:text-8xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 90 }}
          >
            Who am{" "}
            <span className="relative inline-block">
              <span className="squiggle">I</span>
              <motion.span
                className="inline-block text-coral"
                animate={{ rotate: [0, 14, -8, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.5 }}
              >
                ?
              </motion.span>
            </span>
          </motion.h1>
          <motion.p
            className="mt-6 max-w-xl text-xl leading-relaxed text-ink-soft"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Do you <em className="font-semibold text-ink not-italic">really</em> know yourself? Today you play,
            draw, race and reflect your way to the answer — one stop at a time.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            <a href="#name-chain">
              <Button>
                Start the journey <ArrowDown size={18} />
              </Button>
            </a>
            <span className="text-sm font-medium text-ink-soft">11 stops · 3 games · ~2 hours</span>
          </motion.div>
        </div>

        {/* The mirror */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.25, type: "spring", stiffness: 80 }}
          className="relative"
        >
          <div className="rounded-[2.5rem] border-2 border-ink bg-white p-6 shadow-pop-lg sm:p-8">
            <p className="font-display text-sm font-semibold tracking-[0.18em] text-coral uppercase">
              Warm-up challenge
            </p>
            <h3 className="mt-2 text-2xl leading-tight font-bold">
              Describe yourself in 3 words —
              <span className="text-ink-soft"> without your name, age or hometown.</span>
            </h3>

            <div className="relative mt-6 grid h-52 place-items-center overflow-hidden rounded-[2rem] border-2 border-dashed border-ink/25 bg-gradient-to-br from-sky via-white to-lilac">
              <motion.div
                aria-hidden
                className="absolute inset-y-0 w-16 -skew-x-12 bg-white/60 blur-sm"
                animate={{ x: ["-250%", "450%"] }}
                transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2 }}
              />
              {words.length === 0 ? (
                <div className="text-center">
                  <span className="text-5xl">🪞</span>
                  <p className="mt-2 text-sm text-ink-soft">Your mirror is waiting…</p>
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-3 p-4">
                  <AnimatePresence>
                    {words.map((w, i) => (
                      <motion.span
                        key={w + i}
                        layout
                        initial={{ opacity: 0, scale: 0, rotate: -20 }}
                        animate={{ opacity: 1, scale: 1, rotate: [-3, 3, -2][i % 3], y: [0, -6, 0] }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ y: { repeat: Infinity, duration: 3 + i, ease: "easeInOut" } }}
                        className={`group flex items-center gap-1.5 rounded-2xl border-2 border-ink px-4 py-2 font-display text-xl font-semibold ${
                          ["bg-sun", "bg-blush", "bg-teal-soft"][i % 3]
                        }`}
                      >
                        {w}
                        <button
                          aria-label={`Remove ${w}`}
                          onClick={() => setWords((p) => p.filter((_, j) => j !== i))}
                          className="opacity-40 hover:opacity-100"
                        >
                          <X size={14} />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <form
              className="mt-5 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                add();
              }}
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={20}
                placeholder={words.length >= 3 ? "Swap a word…" : `Word ${words.length + 1} of 3`}
                className="min-w-0 flex-1 rounded-2xl border-2 border-ink bg-cream px-4 py-3 outline-none focus:bg-white focus:ring-4 focus:ring-sun/60"
              />
              <Button type="submit" variant="coral">
                Add
              </Button>
            </form>
            <AnimatePresence>
              {warn && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 text-sm font-semibold text-berry"
                >
                  {warn}
                </motion.p>
              )}
            </AnimatePresence>
            {words.length === 3 && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-sm font-semibold text-teal"
              >
                Harder than it looks, right? That&apos;s exactly what today is about. 👇
              </motion.p>
            )}
          </div>
          <motion.div
            className="absolute -top-5 -left-5 rotate-[-8deg] rounded-2xl border-2 border-ink bg-sun px-3 py-1.5 font-display text-sm font-bold shadow-pop"
            animate={{ rotate: [-8, -3, -8] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            No right answers!
          </motion.div>
        </motion.div>
      </div>

      {/* marquee */}
      <div className="relative overflow-hidden border-y-2 border-ink bg-ink py-3 text-cream">
        <div className="flex w-max animate-marquee gap-8 font-display text-lg font-semibold whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-8">
              {[
                "Who am I?",
                "✦ What do I love?",
                "✦ What am I good at?",
                "✦ What scares me?",
                "✦ Who inspires me?",
                "✦ What's my superpower?",
                "✦ Not yet… but soon!",
                "✦",
              ].map((t) => (
                <span key={t + k}>{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
