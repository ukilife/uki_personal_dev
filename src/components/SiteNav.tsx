"use client";

import Link from "next/link";
import { motion, useScroll, useSpring } from "motion/react";

/** Four petals unfolding from one seed — a new piece of you each week. */
const PETALS = [
  { fill: "#7b3fa0", cls: "rotate-[-50deg] group-hover:rotate-[-64deg]" },
  { fill: "#f7845e", cls: "rotate-[-17deg] group-hover:rotate-[-22deg]" },
  { fill: "#ffc93c", cls: "rotate-[17deg] group-hover:rotate-[22deg]" },
  { fill: "#1f9d8a", cls: "rotate-[50deg] group-hover:rotate-[64deg]" },
];

export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-2xl border-2 border-ink bg-white ${className}`}>
      <svg viewBox="0 0 40 40" className="h-[86%] w-[86%] overflow-visible" aria-hidden>
        {PETALS.map((p) => (
          <path
            key={p.fill}
            d="M20 33 C14.5 27 15 17 20 12 C25 17 25.5 27 20 33 Z"
            fill={p.fill}
            stroke="#23204e"
            strokeWidth="2"
            strokeLinejoin="round"
            className={`transition-[rotate] duration-300 [transform-box:view-box] [transform-origin:20px_33px] ${p.cls}`}
          />
        ))}
        <circle cx="20" cy="33" r="3.2" fill="#23204e" />
        <circle
          cx="20"
          cy="6"
          r="2.6"
          fill="#ffc93c"
          stroke="#23204e"
          strokeWidth="1.6"
          className="transition-transform duration-300 group-hover:-translate-y-1"
        />
      </svg>
    </span>
  );
}

export function Logo() {
  return (
    <Link href="/" aria-label="Unfold – Personal Development, home" className="group flex items-center gap-2.5">
      <LogoMark />
      <span className="font-display text-xl leading-none font-bold">
        <span className="text-teal">Un</span>fold
        <span className="block text-[9px] font-medium tracking-[0.14em] whitespace-nowrap text-ink-soft uppercase sm:text-[11px] sm:tracking-[0.2em]">
          Personal Development
        </span>
      </span>
    </Link>
  );
}

export function SiteNav({ sessionLabel }: { sessionLabel?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <header className="no-print sticky top-0 z-50 border-b-2 border-ink/10 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
        <Logo />
        <nav className="flex items-center gap-2 text-sm font-semibold">
          {sessionLabel && (
            <span className="hidden rounded-full bg-blush px-3 py-1.5 sm:inline">{sessionLabel}</span>
          )}
          <Link
            href="/#journey"
            className="rounded-full border-2 border-ink bg-white px-3 py-1.5 whitespace-nowrap transition hover:bg-sun sm:px-4"
          >
            Journey map
          </Link>
        </nav>
      </div>
      {sessionLabel && (
        <motion.div
          style={{ scaleX }}
          className="absolute bottom-[-2px] left-0 h-1 w-full origin-left bg-gradient-to-r from-coral via-sun to-teal"
        />
      )}
    </header>
  );
}
