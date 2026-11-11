"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Compass, Lightbulb, MessageCircle, Mountain, RotateCcw, Sprout, Target, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui";

/* Proposed badges — shown as examples only. No award rules exist yet, so nothing is "earned". */
const BADGES: { name: string; icon: LucideIcon; color: string; soft: string; how: string; where: string }[] = [
  { name: "Self-Discovery Explorer", icon: Compass, color: "#1f9d8a", soft: "bg-teal-soft", how: "Fill every page of Meet the Real You.", where: "Session 1" },
  { name: "Creative Thinker", icon: Lightbulb, color: "#e0a800", soft: "bg-sun-soft", how: "Bring a character to life in the Two Eyes Challenge.", where: "Session 1" },
  { name: "Focus Champion", icon: Target, color: "#2f7fc1", soft: "bg-sky", how: "Take on all three Focus Lock tests.", where: "Session 1" },
  { name: "Dream Builder", icon: Mountain, color: "#7b3fa0", soft: "bg-lilac", how: "Complete your SWOT and write 10 bucket-list dreams.", where: "Session 2" },
  { name: "Habit Hero", icon: Sprout, color: "#5aa832", soft: "bg-mint", how: "Finish your 21-Day Challenge without giving up.", where: "Session 2" },
  { name: "Courage Explorer", icon: MessageCircle, color: "#f7845e", soft: "bg-blush", how: "Take the Real-World Stranger Challenge.", where: "Session 4" },
];

function BadgeCard({ b, i }: { b: (typeof BADGES)[number]; i: number }) {
  const [flipped, setFlipped] = useState(false);
  const Icon = b.icon;
  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      aria-label={`${b.name} — example badge. ${flipped ? "Showing how to earn it" : "Tap to see how to earn it"}`}
      className="group h-60 w-full rounded-[1.75rem] [perspective:1000px] focus-visible:ring-4 focus-visible:ring-sun focus-visible:outline-none"
    >
      <motion.span
        className="relative block h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 18 }}
        whileHover={{ y: -6, rotate: i % 2 ? 1.5 : -1.5 }}
      >
        {/* front */}
        <span
          className={`absolute inset-0 flex flex-col items-center justify-center rounded-[1.75rem] border-2 border-ink p-4 text-center shadow-pop [backface-visibility:hidden] ${b.soft}`}
        >
          <span className="absolute top-3 right-3 rounded-full border-2 border-dashed border-ink/30 bg-white/80 px-2 py-0.5 text-[10px] font-bold tracking-widest text-ink-soft uppercase">
            Example
          </span>
          {/* medal */}
          <span className="relative">
            <span aria-hidden className="absolute -top-3 left-1/2 flex -translate-x-1/2 gap-1">
              <span className="h-6 w-3 -rotate-12 rounded-sm border-2 border-ink" style={{ background: b.color }} />
              <span className="h-6 w-3 rotate-12 rounded-sm border-2 border-ink bg-white" />
            </span>
            <motion.span
              className="relative grid h-24 w-24 place-items-center rounded-full border-[3px] border-ink text-white shadow-pop"
              style={{ background: `radial-gradient(circle at 35% 30%, #ffffff66, ${b.color} 55%)` }}
              animate={{ rotate: [0, -6, 6, 0] }}
              transition={{ type: "tween", duration: 4, repeat: Infinity, delay: i * 0.3 }}
            >
              <span className="absolute inset-2 rounded-full border-2 border-dashed border-white/60" />
              <Icon size={36} strokeWidth={2.4} />
            </motion.span>
          </span>
          <span className="mt-4 font-display text-lg leading-tight font-bold">{b.name}</span>
          <span className="mt-1 flex items-center gap-1 text-xs font-semibold text-ink-soft">
            <RotateCcw size={11} /> tap to flip
          </span>
        </span>
        {/* back */}
        <span
          className="absolute inset-0 flex flex-col items-center justify-center rounded-[1.75rem] border-2 border-ink p-5 text-center text-white shadow-pop [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{ background: b.color }}
        >
          <span className="text-[10px] font-bold tracking-widest uppercase opacity-80">How you could earn it</span>
          <span className="mt-2 font-display text-xl leading-snug font-bold">{b.how}</span>
          <span className="mt-3 rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold">{b.where}</span>
        </span>
      </motion.span>
    </button>
  );
}

export function Achievements() {
  return (
    <section id="achievements" className="relative overflow-hidden bg-cream">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-70" />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {["⭐", "🏅", "✨", "🎖️"].map((e, i) => (
          <span
            key={e}
            className={`absolute text-4xl opacity-40 ${i % 2 ? "animate-float" : "animate-float-slow"}`}
            style={{ left: `${[6, 88, 14, 80][i]}%`, top: `${[12, 18, 78, 72][i]}%` }}
          >
            {e}
          </span>
        ))}
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-display text-sm font-bold tracking-[0.2em] text-coral uppercase">Achievements & milestones</p>
          <h2 className="mt-3 text-5xl leading-tight font-bold sm:text-6xl">
            Little Wins. <span className="text-teal">Big Growth.</span>
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            A sneak peek at badges you could collect along the journey. Badges aren&apos;t switched on yet — these are examples
            of what&apos;s coming.
          </p>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-6">
          {BADGES.map((b, i) => (
            <Reveal key={b.name} delay={i * 0.06}>
              <BadgeCard b={b} i={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
