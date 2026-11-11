"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button, Pill } from "@/components/ui";

const STICKERS = [
  { t: "🧭", x: "54%", y: "6%", r: -12, d: 0.2 },
  { t: "⚡", x: "88%", y: "10%", r: 10, d: 0.4 },
  { t: "🌱", x: "90%", y: "72%", r: -8, d: 0.6 },
  { t: "🎯", x: "52%", y: "80%", r: 14, d: 0.8 },
];

export function HomeHero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 15 });
  const sy = useSpring(my, { stiffness: 60, damping: 15 });
  const tx = useTransform(sx, (v) => v * -20);
  const ty = useTransform(sy, (v) => v * -20);
  const pupilX = useTransform(sx, (v) => v * 9);
  const pupilY = useTransform(sy, (v) => v * 9);

  return (
    <section
      className="relative overflow-hidden bg-sky"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      <motion.div style={{ x: tx, y: ty }} className="pointer-events-none absolute inset-0">
        {STICKERS.map((s) => (
          <motion.span
            key={s.t}
            className="absolute grid h-16 w-16 place-items-center rounded-2xl border-2 border-ink bg-white text-3xl shadow-pop sm:h-20 sm:w-20 sm:text-4xl"
            style={{ left: s.x, top: s.y }}
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: s.r, y: [0, -12, 0] }}
            transition={{ scale: { delay: s.d, type: "spring" }, rotate: { delay: s.d }, y: { repeat: Infinity, duration: 5, delay: s.d } }}
          >
            {s.t}
          </motion.span>
        ))}
      </motion.div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pt-16 pb-28 sm:px-8 md:grid-cols-[1.2fr_1fr] md:pt-24">
        <div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Pill className="bg-white text-ink">
              <Sparkles size={14} /> Uki Personal Development
            </Pill>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 80 }}
            className="mt-6 text-5xl leading-[0.98] font-bold sm:text-7xl"
          >
            The most interesting person you&apos;ll meet this year is <span className="squiggle text-coral">you.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 max-w-xl text-xl leading-relaxed text-ink-soft"
          >
            A journey of games, challenges and honest questions — one session at a time — to figure out who you are and
            who you want to become.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link href="/sessions/who-am-i">
              <Button>
                Start Session 1 <ArrowRight size={18} />
              </Button>
            </Link>
            <a href="#journey">
              <Button variant="white">See the map</Button>
            </a>
          </motion.div>
        </div>

        {/* curious face: eyes follow you */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="relative mx-auto aspect-square w-full max-w-sm"
        >
          <motion.div
            className="absolute inset-0 rounded-[42%_58%_55%_45%/48%_42%_58%_52%] border-4 border-ink bg-sun shadow-pop-lg"
            animate={{ borderRadius: ["42% 58% 55% 45% / 48% 42% 58% 52%", "55% 45% 42% 58% / 52% 58% 42% 48%", "42% 58% 55% 45% / 48% 42% 58% 52%"] }}
            transition={{ repeat: Infinity, duration: 8 }}
          />
          <div className="absolute inset-0 grid place-items-center">
            <div className="flex gap-6">
              {[0, 1].map((i) => (
                <div key={i} className="grid h-24 w-24 place-items-center rounded-full border-4 border-ink bg-white">
                  <motion.div style={{ x: pupilX, y: pupilY }} className="relative h-10 w-10 rounded-full bg-ink">
                    <span className="absolute top-1.5 right-1.5 h-3 w-3 rounded-full bg-white" />
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
          <motion.div
            className="absolute bottom-[22%] left-1/2 h-6 w-16 -translate-x-1/2 rounded-b-full border-4 border-t-0 border-ink"
            animate={{ scaleX: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
          <motion.span
            className="absolute -top-2 right-4 rounded-2xl border-2 border-ink bg-white px-3 py-1.5 font-display font-semibold shadow-pop"
            animate={{ rotate: [6, -2, 6] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            who are you? 🤔
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}
