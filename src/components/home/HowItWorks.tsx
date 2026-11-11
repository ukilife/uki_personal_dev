"use client";

import { motion } from "motion/react";
import { Reveal } from "@/components/ui";

const STEPS = [
  { emoji: "🎲", title: "Play", text: "Every session opens with a game that gets you moving, laughing and talking.", bg: "bg-sun" },
  { emoji: "❓", title: "Big question", text: "One honest question that's harder than it looks.", bg: "bg-blush" },
  { emoji: "📔", title: "Private journal", text: "Write what's true for you. It stays on your device — no one else sees it.", bg: "bg-teal-soft" },
  { emoji: "⚡", title: "Challenge", text: "Try something small and real, right there in the room.", bg: "bg-sky" },
  { emoji: "🎒", title: "Take-home mission", text: "Keep growing between sessions with a mission for the week.", bg: "bg-lilac" },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden border-y-2 border-ink bg-ink text-cream">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="font-display text-sm font-bold tracking-[0.2em] text-sun uppercase">How a session flows</p>
          <h2 className="mt-3 text-5xl leading-tight font-bold">Not slides. A playground.</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -8, rotate: i % 2 ? 2 : -2 }}
                className={`relative h-full rounded-3xl border-2 border-cream/20 p-5 text-ink ${s.bg}`}
              >
                <span className="absolute top-3 right-4 font-display text-4xl font-bold text-ink/15">{i + 1}</span>
                <span className="text-4xl">{s.emoji}</span>
                <h3 className="mt-3 text-xl font-bold">{s.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{s.text}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
