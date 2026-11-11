"use client";

import Link from "next/link";
import { motion, useScroll, useSpring } from "motion/react";

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span className="relative grid h-10 w-10 place-items-center rounded-2xl border-2 border-ink bg-sun font-display text-xl font-bold text-ink transition-transform group-hover:-rotate-12">
        u
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-ink bg-coral" />
      </span>
      <span className="font-display text-xl leading-none font-bold">
        Uki <span className="text-teal">Growth</span>
        <span className="block text-[11px] font-medium tracking-[0.2em] text-ink-soft uppercase">
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
            className="rounded-full border-2 border-ink bg-white px-4 py-1.5 transition hover:bg-sun"
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
