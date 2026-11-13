"use client";

import { motion } from "motion/react";
import { ArrowDown, Trees } from "lucide-react";
import { useStoredSnapshot } from "@/lib/useLocalState";
import { Button, Pill } from "@/components/ui";
import { TEN_AND_TEN_EMPTY, type TenAndTenState } from "@/components/session1/TenAndTen";
import { BUCKET_EMPTY, type BucketState } from "@/components/session2/BucketList";
import { SWOT_EMPTY, type SwotState } from "@/components/session2/MySwot";

const PINS = [
  { label: "Dreams", emoji: "🌟", bg: "bg-sun", x: "6%", y: "8%", r: -6 },
  { label: "Values", emoji: "🧭", bg: "bg-sky", x: "56%", y: "4%", r: 5 },
  { label: "Personality", emoji: "🎭", bg: "bg-lilac", x: "30%", y: "38%", r: -2 },
  { label: "Strengths", emoji: "💪", bg: "bg-teal-soft", x: "4%", y: "66%", r: 4 },
  { label: "Future goals", emoji: "🎯", bg: "bg-blush", x: "56%", y: "64%", r: -5 },
];

export function Hero() {
  const ten = useStoredSnapshot<TenAndTenState>("s1-ten-and-ten", TEN_AND_TEN_EMPTY);
  const bucket = useStoredSnapshot<BucketState>("s2-bucket", BUCKET_EMPTY);
  const swot = useStoredSnapshot<SwotState>("s2-swot", SWOT_EMPTY);
  const packed = [
    [ten.strengths.filter((v) => v.trim()).length, "strengths"],
    [bucket.items?.length ?? 0, "bucket-list dreams"],
    [(["s", "w", "o", "t"] as const).reduce((a, k) => a + (swot[k] ?? []).filter((v) => v.trim()).length, 0), "SWOT notes"],
  ].filter(([n]) => (n as number) > 0);

  return (
    <section id="start" data-stop="start" className="relative overflow-hidden bg-mint">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-70" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-16 pb-24 sm:px-8 md:grid-cols-[1.1fr_1fr] md:pt-24 lg:pl-28">
        <div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Pill className="bg-white text-ink">
              <Trees size={14} /> Session 03 · The Vision Forest
            </Pill>
          </motion.div>
          <motion.h1
            className="mt-6 text-6xl leading-[0.95] font-bold sm:text-7xl md:text-8xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 90 }}
          >
            My <span className="squiggle">Dream</span> <span className="text-[#3f8a1f]">Board</span>
          </motion.h1>
          <motion.p
            className="mt-6 max-w-xl text-xl leading-relaxed text-ink-soft"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            You know <em className="font-semibold text-ink not-italic">who</em> you are. You know what it takes. Today you gather
            everything — dreams, values, personality, strengths and goals — into one picture of your future, then draw it for the
            classroom wall.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            <a href="#why">
              <Button variant="teal">
                Start building <ArrowDown size={18} />
              </Button>
            </a>
            <span className="text-sm font-medium text-ink-soft">10 stops · 5 pieces · 1 paper board</span>
          </motion.div>
          {packed.length > 0 && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 inline-flex rounded-2xl border-2 border-ink bg-white px-4 py-2 text-sm font-semibold shadow-pop"
            >
              🎒 Packed from Sessions 1 &amp; 2: {packed.map(([n, l]) => `${n} ${l}`).join(" · ")}
            </motion.p>
          )}
        </div>

        {/* cork board */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 80 }}
          className="relative mx-auto aspect-[4/3.4] w-full max-w-md rounded-[2rem] border-4 border-ink bg-[#d9a066] shadow-pop-lg"
          aria-hidden
        >
          <div className="absolute inset-3 rounded-[1.4rem] bg-[#e8b77f] [background-image:radial-gradient(#c98d52_1px,transparent_1.5px)] [background-size:10px_10px]" />
          {PINS.map((p, i) => (
            <motion.div
              key={p.label}
              className={`absolute w-[40%] rounded-xl border-2 border-ink p-2 text-center shadow-pop ${p.bg}`}
              style={{ left: p.x, top: p.y }}
              initial={{ opacity: 0, y: -30, rotate: 0 }}
              animate={{ opacity: 1, y: [0, -4, 0], rotate: p.r }}
              transition={{
                opacity: { delay: 0.6 + i * 0.2 },
                rotate: { delay: 0.6 + i * 0.2, type: "spring" },
                y: { type: "tween", delay: 0.6 + i * 0.2, duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-ink bg-coral" />
              <span className="block text-3xl">{p.emoji}</span>
              <span className="block font-display text-sm font-bold">{p.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="relative overflow-hidden border-y-2 border-ink bg-ink py-3 text-cream">
        <div className="flex w-max animate-marquee gap-8 font-display text-lg font-semibold whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-8">
              {[
                "See it. Believe it. Build it.",
                "✦ My dreams",
                "✦ My values",
                "✦ My personality",
                "✦ My strengths",
                "✦ My future goals",
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
