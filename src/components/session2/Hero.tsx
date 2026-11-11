"use client";

import { motion } from "motion/react";
import { ArrowDown, Mountain } from "lucide-react";
import { useStoredSnapshot } from "@/lib/useLocalState";
import { Button, Pill } from "@/components/ui";
import { TEN_AND_TEN_EMPTY, type TenAndTenState } from "@/components/session1/TenAndTen";

const CAMPS = [
  { y: 84, label: "Know your strengths", emoji: "⚖️" },
  { y: 66, label: "Discipline", emoji: "🧭" },
  { y: 48, label: "21 days", emoji: "📅" },
  { y: 30, label: "SWOT", emoji: "🧩" },
  { y: 12, label: "Your dreams", emoji: "🪣" },
];

export function Hero() {
  const ten = useStoredSnapshot<TenAndTenState>("s1-ten-and-ten", TEN_AND_TEN_EMPTY);
  const strengths = ten.strengths.filter((v) => v.trim()).length;
  const improve = ten.improve.filter((v) => v.trim()).length;

  return (
    <section id="start" data-stop="start" className="relative overflow-hidden bg-lilac">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-70" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-16 pb-24 sm:px-8 md:grid-cols-[1.15fr_1fr] md:pt-24 lg:pl-28">
        <div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Pill className="bg-white text-ink">
              <Mountain size={14} /> Session 02 · The Dream Mountain
            </Pill>
          </motion.div>
          <motion.h1
            className="mt-6 text-6xl leading-[0.95] font-bold sm:text-7xl md:text-8xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 90 }}
          >
            <span className="squiggle">Discipline</span> <span className="text-grape">&amp;</span>{" "}
            <span className="text-coral">Dreams</span>
          </motion.h1>
          <motion.p
            className="mt-6 max-w-xl text-xl leading-relaxed text-ink-soft"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Last week you found out <em className="font-semibold text-ink not-italic">who</em> you are. Today you find out
            how far you can go — and what it takes to get there.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            <a href="#strengths">
              <Button variant="grape">
                Start the climb <ArrowDown size={18} />
              </Button>
            </a>
            <span className="text-sm font-medium text-ink-soft">10 stops · 3 games · your own SWOT</span>
          </motion.div>
          {strengths + improve > 0 && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 inline-flex rounded-2xl border-2 border-ink bg-white px-4 py-2 text-sm font-semibold shadow-pop"
            >
              🎒 Packed from Session 1: {strengths} strengths · {improve} things to improve
            </motion.p>
          )}
        </div>

        {/* The mountain */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 80 }}
          className="relative mx-auto aspect-square w-full max-w-md"
          aria-hidden
        >
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
            <circle cx="78" cy="18" r="9" fill="#ffc93c" stroke="#23204e" strokeWidth="1.2" />
            <path d="M2 96 L40 22 L52 38 L60 28 L98 96 Z" fill="#c9b6ea" stroke="#23204e" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M40 22 L47 36 L42 33 L37 38 L34 33 Z" fill="#fff" stroke="#23204e" strokeWidth="1" strokeLinejoin="round" />
            <motion.path
              d="M30 92 C46 88 60 84 48 76 C36 68 44 64 56 58 C66 52 52 46 46 40 C42 36 44 30 42 24"
              fill="none"
              stroke="#23204e"
              strokeWidth="1.2"
              strokeDasharray="2 2.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.4, delay: 0.5, ease: "easeInOut" }}
            />
            <path d="M42 24 L42 12 L51 15 L42 18" fill="#f7845e" stroke="#23204e" strokeWidth="1" strokeLinejoin="round" />
          </svg>
          {CAMPS.map((c, i) => (
            <motion.span
              key={c.label}
              className="absolute flex items-center gap-1.5 rounded-full border-2 border-ink bg-white px-2.5 py-1 text-xs font-bold whitespace-nowrap shadow-pop"
              style={{ top: `${c.y}%`, left: i % 2 ? "58%" : "4%" }}
              initial={{ opacity: 0, x: i % 2 ? 20 : -20 }}
              animate={{ opacity: 1, x: 0, y: [0, -4, 0] }}
              transition={{
                opacity: { delay: 0.8 + i * 0.25 },
                x: { delay: 0.8 + i * 0.25 },
                y: { type: "tween", duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <span>{c.emoji}</span> {c.label}
            </motion.span>
          ))}
        </motion.div>
      </div>

      <div className="relative overflow-hidden border-y-2 border-ink bg-ink py-3 text-cream">
        <div className="flex w-max animate-marquee gap-8 font-display text-lg font-semibold whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-8">
              {[
                "Small steps, every day",
                "✦ Discipline beats motivation",
                "✦ 21 days to a new you",
                "✦ Know your SWOT",
                "✦ Dream it. Plan it. Do it.",
                "✦ Challenge = growth",
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
