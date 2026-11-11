"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Lock, Play } from "lucide-react";
import { SESSIONS } from "@/lib/sessions";
import { Reveal } from "@/components/ui";

// node positions on a 1000 x 1000 board (percent-friendly)
const NODES = [
  { x: 18, y: 12 },
  { x: 70, y: 28 },
  { x: 26, y: 48 },
  { x: 74, y: 68 },
  { x: 34, y: 88 },
];
const PATH = "M180 120 C 480 60, 780 120, 700 280 S 180 340, 260 480 S 800 560, 740 680 S 260 760, 340 880";

export function JourneyMap() {
  return (
    <section id="journey" className="relative scroll-mt-16 overflow-hidden bg-cream">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-70" />
      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="font-display text-sm font-bold tracking-[0.2em] text-coral uppercase">The journey map</p>
          <h2 className="mt-3 text-5xl leading-tight font-bold sm:text-6xl">One session. One page. One step closer to you.</h2>
          <p className="mt-4 text-lg text-ink-soft">New stops unlock as the journey goes on. Where will it take you?</p>
        </Reveal>

        <div className="relative mx-auto mt-12 aspect-[1/1.25] w-full max-w-3xl sm:aspect-square">
          <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <path d={PATH} fill="none" stroke="#23204e" strokeOpacity=".08" strokeWidth="44" strokeLinecap="round" />
            <motion.path
              d={PATH}
              fill="none"
              stroke="#23204e"
              strokeWidth="5"
              strokeDasharray="4 18"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
            />
          </svg>

          {SESSIONS.map((s, i) => {
            const n = NODES[i];
            const open = s.status === "open";
            const card = (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.35, type: "spring", stiffness: 140 }}
                whileHover={open ? { scale: 1.05, rotate: -1 } : { rotate: 3, scale: 1.02 }}
                className={`relative w-44 rounded-3xl border-2 border-ink p-4 sm:w-60 ${
                  open ? "bg-white shadow-pop-lg" : s.status === "next" ? "bg-white/90 shadow-pop" : "bg-white/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-2 border-ink font-display text-xl font-bold text-white"
                    style={{ background: s.status === "locked" ? "#c9c6dd" : s.color }}
                  >
                    {s.status === "locked" ? <Lock size={18} /> : String(s.number).padStart(2, "0")}
                    {open && (
                      <motion.span
                        className="absolute inset-0 rounded-2xl border-2"
                        style={{ borderColor: s.color }}
                        animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.6 }}
                      />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold tracking-widest text-ink-soft uppercase">
                      Session {s.number} · {open ? "open now" : s.status === "next" ? "next week" : "locked"}
                    </p>
                    <p className="truncate font-display text-lg font-bold sm:text-xl">{s.title}</p>
                  </div>
                </div>
                <p className="mt-2 hidden text-sm text-ink-soft sm:block">{s.question}</p>
                {open && (
                  <span className="mt-3 flex items-center gap-1.5 font-display text-sm font-bold text-coral">
                    <Play size={14} fill="currentColor" /> Enter session
                  </span>
                )}
              </motion.div>
            );
            return (
              <div
                key={s.slug}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
              >
                {open ? (
                  <Link href={`/sessions/${s.slug}`} aria-label={`Open Session ${s.number}: ${s.title}`}>
                    {card}
                  </Link>
                ) : (
                  card
                )}
              </div>
            );
          })}
          <motion.span
            className="absolute text-4xl"
            style={{ left: "6%", top: "1%" }}
            animate={{ y: [0, -8, 0], rotate: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            aria-hidden
          >
            📍
          </motion.span>
          <span className="absolute right-[6%] bottom-0 text-5xl" aria-hidden>
            🏁
          </span>
        </div>
      </div>
    </section>
  );
}
