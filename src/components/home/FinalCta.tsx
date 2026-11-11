"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { ButtonLink, Reveal } from "@/components/ui";

const PIECES = [
  { e: "🪞", x: "8%", y: "18%", d: 5 },
  { e: "⛰️", x: "86%", y: "14%", d: 6 },
  { e: "🌳", x: "12%", y: "74%", d: 5.5 },
  { e: "🏙️", x: "84%", y: "70%", d: 6.5 },
  { e: "✨", x: "50%", y: "8%", d: 4 },
];

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-ink text-cream">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-20" />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {PIECES.map((p, i) => (
          <motion.span
            key={p.e}
            className="absolute hidden text-5xl sm:block"
            style={{ left: p.x, top: p.y }}
            animate={{ y: [0, -16, 0], rotate: [0, i % 2 ? 10 : -10, 0] }}
            transition={{ type: "tween", duration: p.d, repeat: Infinity, ease: "easeInOut" }}
          >
            {p.e}
          </motion.span>
        ))}
        <span className="absolute -bottom-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-sun/20 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-4xl px-4 py-28 text-center sm:px-8">
        <Reveal>
          <p className="font-display text-lg font-semibold text-sun">Who could you become six months from now?</p>
          <h2 className="mt-4 text-5xl leading-[1.02] font-bold sm:text-7xl">
            The Best Version of You Is Still <span className="squiggle text-sun">Unfolding.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-cream/80">
            Every discovery matters. Every small step counts. Your journey starts with one question:{" "}
            <b className="text-cream">Who am I?</b>
          </p>
          <motion.div
            className="mt-10 inline-block"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ type: "tween", duration: 2.2, repeat: Infinity }}
          >
            <ButtonLink href="/sessions/who-am-i" className="px-8 py-4 text-lg">
              Begin My Journey <ArrowRight size={20} />
            </ButtonLink>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
