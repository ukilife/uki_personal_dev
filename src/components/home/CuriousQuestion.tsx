"use client";

import { motion } from "motion/react";

const TONES = {
  sun: { bg: "bg-sun", text: "text-ink", glyph: "text-ink/10" },
  teal: { bg: "bg-teal", text: "text-white", glyph: "text-white/15" },
  lilac: { bg: "bg-lilac", text: "text-ink", glyph: "text-grape/15" },
  ink: { bg: "bg-ink", text: "text-cream", glyph: "text-sun/15" },
  coral: { bg: "bg-coral", text: "text-white", glyph: "text-white/20" },
} as const;

/** A short, thought-provoking question that pops in word by word between sections. */
export function CuriousQuestion({ q, emoji, tone = "sun" }: { q: string; emoji: string; tone?: keyof typeof TONES }) {
  const t = TONES[tone];
  const words = q.split(" ");
  return (
    <section aria-label="A question to think about" className={`relative overflow-hidden border-y-2 border-ink ${t.bg}`}>
      <div aria-hidden className={`pointer-events-none absolute inset-0 font-display font-bold ${t.glyph}`}>
        <span className="absolute top-2 left-[6%] animate-float text-8xl">?</span>
        <span className="absolute right-[8%] bottom-0 animate-float-slow text-9xl">?</span>
        <span className="absolute top-1/3 right-[30%] hidden animate-float text-6xl sm:block">?</span>
      </div>
      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-14 text-center sm:py-16">
        <motion.span
          aria-hidden
          className="text-4xl sm:text-5xl"
          initial={{ scale: 0, rotate: -30 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          {emoji}
        </motion.span>
        <p className={`font-display text-3xl leading-tight font-bold sm:text-5xl ${t.text}`}>
          {words.map((w, i) => (
            <motion.span
              key={i}
              className="mr-[0.25em] inline-block"
              initial={{ opacity: 0, y: 24, rotate: i % 2 ? 4 : -4 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06, type: "spring", stiffness: 180, damping: 14 }}
            >
              {w}
            </motion.span>
          ))}
        </p>
      </div>
    </section>
  );
}
