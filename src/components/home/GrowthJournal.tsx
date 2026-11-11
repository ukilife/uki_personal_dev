"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ArrowRight, BookOpen, CalendarCheck, Lock, NotebookPen, PenLine, Scale, Target, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui";
import { useStoredSnapshot } from "@/lib/useLocalState";
import { hasContent } from "@/lib/progress";

type Tab = {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  prompt: string;
  /** what lives here */
  inside: string[];
  /** existing page, or the session it arrives with */
  href?: string;
  arrives?: string;
  /** localStorage keys (Session 1) that hold this page's answers */
  keys?: string[];
};

const TABS: Tab[] = [
  {
    id: "about",
    label: "About Me",
    icon: PenLine,
    color: "#ffc93c",
    prompt: "Passions, talents, honest fears and the people who inspire you.",
    inside: ["Meet the Real You", "Your 3-word mirror", "About Me page mission"],
    href: "/sessions/who-am-i#real-you",
    keys: ["s1-real-you", "s1-mirror-words"],
  },
  {
    id: "sw",
    label: "Strengths & Weaknesses",
    icon: Scale,
    color: "#1f9d8a",
    prompt: "Your superpowers — and the skills that just aren't there… YET.",
    inside: ["Superpower hero card", "“Not YET” list", "10 + 10 List"],
    href: "/sessions/who-am-i#superpowers",
    keys: ["s1-superpowers", "s1-not-yet", "s1-ten-and-ten"],
  },
  {
    id: "goals",
    label: "My Goals",
    icon: Target,
    color: "#7b3fa0",
    prompt: "Your SWOT map, your best move and the bucket list of your life.",
    inside: ["My SWOT", "My best move", "Bucket List"],
    href: "/sessions/discipline-and-dreams#my-swot",
    keys: ["s2-swot", "s2-bucket"],
  },
  {
    id: "reflect",
    label: "Personal Reflections",
    icon: NotebookPen,
    color: "#2f7fc1",
    prompt: "Quiet minutes to notice what you discovered today.",
    inside: ["“One thing I discovered today…”", "Calm-minutes checkpoint", "Figure Yourself worksheet"],
    href: "/sessions/who-am-i#checkpoint",
    keys: ["s1-checkpoint", "s2-figure-yourself"],
  },
  {
    id: "homework",
    label: "Homework & Reading",
    icon: BookOpen,
    color: "#f7845e",
    prompt: "Your take-home missions, including the 7-Page Challenge.",
    inside: ["Weekly missions", "Ask 5 People", "7-Page Challenge"],
    href: "/sessions/who-am-i#take-home",
    keys: ["s1-missions", "s1-their-eyes", "s2-missions"],
  },
  {
    id: "habits",
    label: "Habit Tracker",
    icon: CalendarCheck,
    color: "#5aa832",
    prompt: "Twenty-one days, one small habit, one tick at a time.",
    inside: ["21-Day Challenge", "Comfort-zone map", "Habit Loop (Session 3)"],
    href: "/sessions/discipline-and-dreams#21-days",
    keys: ["s2-21days", "s2-zones"],
  },
];

/** Reads this device's saved answers for one journal page (no fake data). */
function useStarted(keys: string[] = []) {
  const a = useStoredSnapshot<unknown>(keys[0] ?? "-", null);
  const b = useStoredSnapshot<unknown>(keys[1] ?? "-", null);
  const c = useStoredSnapshot<unknown>(keys[2] ?? "-", null);
  return keys.length > 0 && [a, b, c].some(hasContent);
}

function Page({ tab }: { tab: Tab }) {
  const started = useStarted(tab.keys);
  const Icon = tab.icon;
  return (
    <motion.div
      key={tab.id}
      initial={{ rotateY: -70, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      exit={{ rotateY: 50, opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: "left center" }}
      className="relative h-full p-6 sm:p-8"
    >
      {/* ruled lines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{ backgroundImage: "repeating-linear-gradient(transparent 0 31px, #dceefb 31px 33px)", backgroundPosition: "0 72px" }}
      />
      <div aria-hidden className="pointer-events-none absolute top-0 bottom-0 left-10 w-0.5 bg-coral/40" />
      <div className="relative pl-6">
        <span className="grid h-12 w-12 place-items-center rounded-2xl border-2 border-ink text-white" style={{ background: tab.color }}>
          <Icon size={22} />
        </span>
        <h3 className="mt-4 text-3xl font-bold">{tab.label}</h3>
        <p className="mt-2 text-lg text-ink-soft">{tab.prompt}</p>
        <ul className="mt-4 space-y-1.5">
          {tab.inside.map((x) => (
            <li key={x} className="flex items-center gap-2 font-display text-lg">
              <span className="h-2 w-2 rounded-full" style={{ background: tab.color }} /> {x}
            </li>
          ))}
        </ul>
        <div className="mt-6">
          {tab.href ? (
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={tab.href}
                className="btn-pop inline-flex items-center gap-2 rounded-2xl border-2 border-ink bg-ink px-4 py-2.5 font-display font-semibold text-cream focus-visible:ring-4 focus-visible:ring-sun focus-visible:outline-none"
              >
                Open this page <ArrowRight size={16} />
              </Link>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${started ? "bg-teal-soft text-teal" : "bg-cream text-ink-soft"}`}>
                {started ? "✏️ You've started this page" : "Not started yet"}
              </span>
            </div>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-2xl border-2 border-dashed border-ink/30 px-4 py-2.5 text-sm font-semibold text-ink-soft">
              <Lock size={14} /> Opens with {tab.arrives}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function GrowthJournal() {
  const [active, setActive] = useState(0);
  const tab = TABS[active];

  return (
    <section id="journal" className="relative overflow-hidden bg-lilac">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-60" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <p className="font-display text-sm font-bold tracking-[0.2em] text-grape uppercase">My Growth Journal</p>
          <h2 className="mt-3 text-5xl leading-tight font-bold sm:text-6xl">
            Your Story Is Still Being <span className="squiggle">Written.</span>
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            Capture your discoveries, reflect on your experiences and see how your thoughts and confidence develop along the way.
          </p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-dashed border-ink/30 bg-white/70 px-3 py-1 text-xs font-semibold text-ink-soft">
            🔒 Private · your answers stay on this device
          </p>
        </Reveal>

        <Reveal delay={0.1} className="[perspective:1600px]">
          <div className="relative">
            {/* the notebook */}
            <div className="relative min-h-[26rem] rounded-[2rem] border-2 border-ink bg-paper shadow-pop-lg sm:mr-28">
              {/* spine rings */}
              <div aria-hidden className="absolute top-6 bottom-6 -left-3 flex flex-col justify-around">
                {Array.from({ length: 7 }).map((_, i) => (
                  <span key={i} className="h-3 w-7 rounded-full border-[3px] border-ink bg-lilac" />
                ))}
              </div>
              <div className="overflow-hidden rounded-[2rem]" style={{ perspective: 1200 }}>
                <AnimatePresence mode="wait">
                  <Page key={tab.id} tab={tab} />
                </AnimatePresence>
              </div>

              {/* cover that swings open the first time you see it */}
              <motion.div
                aria-hidden
                initial={{ rotateY: 0 }}
                whileInView={{ rotateY: -165 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.65, 0, 0.35, 1] }}
                style={{ transformOrigin: "left center", backfaceVisibility: "hidden" }}
                className="pointer-events-none absolute inset-0 grid place-items-center rounded-[2rem] border-2 border-ink bg-grape text-center text-white"
              >
                <div>
                  <p className="text-6xl">📔</p>
                  <p className="mt-3 font-display text-3xl font-bold">My Growth Journal</p>
                  <p className="mt-1 text-white/80">Unfold</p>
                </div>
              </motion.div>
            </div>

            {/* colourful tabs */}
            <div
              role="tablist"
              aria-label="Journal sections"
              className="mt-4 flex flex-wrap gap-2 sm:absolute sm:top-6 sm:right-0 sm:mt-0 sm:w-32 sm:flex-col"
            >
              {TABS.map((t, i) => (
                <motion.button
                  key={t.id}
                  role="tab"
                  aria-selected={i === active}
                  onClick={() => setActive(i)}
                  whileHover={{ x: -4 }}
                  className={`rounded-xl border-2 border-ink px-3 py-1.5 text-left font-display text-sm leading-tight font-semibold transition sm:rounded-l-none sm:rounded-r-xl ${
                    i === active ? "text-white shadow-pop" : "bg-white text-ink"
                  } focus-visible:ring-4 focus-visible:ring-sun focus-visible:outline-none`}
                  style={i === active ? { background: t.color } : { borderLeftColor: t.color, borderLeftWidth: 6 }}
                >
                  {t.label}
                </motion.button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
