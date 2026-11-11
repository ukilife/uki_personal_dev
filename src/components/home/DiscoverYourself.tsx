"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, MessageCircle, Sprout, Star, Zap, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui";

const CARDS: {
  title: string;
  q: string;
  href: string;
  where: string;
  icon: LucideIcon;
  orbit: string[];
  accent: string;
  bg: string;
  iconBg: string;
}[] = [
  {
    title: "My Strengths",
    q: "What makes me awesome?",
    href: "/sessions/who-am-i#superpowers",
    where: "Session 1 · Superpowers",
    icon: Zap,
    orbit: ["💪", "🎨", "🧠"],
    accent: "#e0a800",
    bg: "bg-sun-soft",
    iconBg: "bg-sun",
  },
  {
    title: "My Dreams",
    q: "What do I want to become?",
    href: "#session-2",
    where: "Session 2 · The Dream Mountain",
    icon: Star,
    orbit: ["🚀", "🔭", "✨"],
    accent: "#7b3fa0",
    bg: "bg-lilac",
    iconBg: "bg-grape",
  },
  {
    title: "My Habits",
    q: "What am I doing every day?",
    href: "#session-3",
    where: "Session 3 · The Habit Forest",
    icon: Sprout,
    orbit: ["⏰", "📅", "🌳"],
    accent: "#1f9d8a",
    bg: "bg-mint",
    iconBg: "bg-teal",
  },
  {
    title: "My Courage",
    q: "What new thing am I ready to try?",
    href: "#session-4",
    where: "Session 4 · The Courage City",
    icon: MessageCircle,
    orbit: ["👋", "🗣️", "🦁"],
    accent: "#f7845e",
    bg: "bg-blush",
    iconBg: "bg-coral",
  },
];

const ORBIT_POS = [
  { rest: { x: -54, y: -34, scale: 0.85 }, hover: { x: -64, y: -50, scale: 1.1 } },
  { rest: { x: 54, y: -36, scale: 0.85 }, hover: { x: 64, y: -52, scale: 1.1 } },
  { rest: { x: 50, y: 40, scale: 0.85 }, hover: { x: 62, y: 50, scale: 1.1 } },
];

export function DiscoverYourself() {
  return (
    <section id="discover" className="relative overflow-hidden bg-paper">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="font-display text-sm font-bold tracking-[0.2em] text-teal uppercase">Discover yourself</p>
          <h2 className="mt-3 text-5xl leading-tight font-bold sm:text-6xl">
            There&apos;s More to You Than You <span className="text-coral">Think!</span>
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            Every strength, every dream and every challenge reveals another piece of who you are.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c, i) => {
            const Icon = c.icon;
            return (
              <Reveal key={c.title} delay={i * 0.08}>
                <motion.div initial="rest" whileHover="hover" whileFocus="hover" animate="rest" className="h-full">
                  <Link
                    href={c.href}
                    className={`group relative flex h-full flex-col overflow-hidden rounded-[2rem] border-2 border-ink p-6 shadow-pop transition-transform hover:-translate-y-1.5 focus-visible:-translate-y-1.5 focus-visible:ring-4 focus-visible:ring-ink/30 focus-visible:outline-none ${c.bg}`}
                  >
                    {/* illustration */}
                    <div className="relative mx-auto my-4 grid h-36 w-36 place-items-center">
                      <motion.span
                        aria-hidden
                        className="absolute inset-3 rounded-full border-2 border-dashed border-ink/20"
                        variants={{ rest: { rotate: 0 }, hover: { rotate: 90 } }}
                        transition={{ type: "tween", duration: 0.8 }}
                      />
                      <motion.span
                        variants={{ rest: { scale: 1, rotate: 0 }, hover: { scale: 1.12, rotate: i % 2 ? 8 : -8 } }}
                        transition={{ type: "spring", stiffness: 260, damping: 12 }}
                        className={`grid h-20 w-20 place-items-center rounded-3xl border-2 border-ink text-white shadow-pop ${c.iconBg}`}
                      >
                        <Icon size={38} strokeWidth={2.2} />
                      </motion.span>
                      {c.orbit.map((e, k) => (
                        <motion.span
                          key={e}
                          aria-hidden
                          className="absolute top-1/2 left-1/2 -mt-4 -ml-4 text-3xl"
                          variants={ORBIT_POS[k]}
                          transition={{ type: "spring", stiffness: 200, damping: 12, delay: k * 0.04 }}
                        >
                          {e}
                        </motion.span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-bold">{c.title}</h3>
                    <p className="mt-1 font-display text-lg font-semibold" style={{ color: c.accent }}>
                      “{c.q}”
                    </p>
                    <span className="mt-auto flex items-center gap-1 pt-5 text-sm font-semibold text-ink-soft group-hover:text-ink">
                      {c.where} <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
