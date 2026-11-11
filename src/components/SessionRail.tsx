"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

type StopItem = { readonly id: string; readonly label: string; readonly emoji: string };

/** Floating left-hand journey rail: shows where you are in the session. */
export function SessionRail({ stops }: { stops: readonly StopItem[] }) {
  const [active, setActive] = useState(stops[0]?.id);
  const [visited, setVisited] = useState<Set<string>>(new Set([stops[0]?.id]));

  useEffect(() => {
    const els = stops.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = e.target.id;
            setActive(id);
            setVisited((v) => (v.has(id) ? v : new Set(v).add(id)));
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [stops]);

  const idx = stops.findIndex((s) => s.id === active);

  return (
    <>
      {/* desktop rail */}
      <nav
        aria-label="Session stops"
        className="no-print fixed top-1/2 left-4 z-40 hidden -translate-y-1/2 lg:block"
      >
        <div className="relative flex flex-col gap-2 rounded-full border-2 border-ink bg-white/90 p-2 shadow-pop backdrop-blur">
          <div className="absolute top-6 bottom-6 left-1/2 w-0.5 -translate-x-1/2 bg-ink/10" />
          <motion.div
            className="absolute top-6 bottom-6 left-[calc(50%-1px)] w-0.5 origin-top bg-coral"
            animate={{ scaleY: Math.max(idx, 0) / Math.max(stops.length - 1, 1) }}
          />
          {stops.map((s, i) => {
            const isActive = s.id === active;
            const done = visited.has(s.id);
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="group relative grid h-9 w-9 place-items-center"
                aria-current={isActive ? "step" : undefined}
              >
                <motion.span
                  animate={{ scale: isActive ? 1.15 : 1 }}
                  className={`relative z-10 grid h-9 w-9 place-items-center rounded-full border-2 text-base transition-colors ${
                    isActive
                      ? "border-ink bg-sun"
                      : done
                        ? "border-ink/40 bg-teal-soft"
                        : "border-transparent bg-cream grayscale"
                  }`}
                >
                  {s.emoji}
                </motion.span>
                <span className="pointer-events-none absolute left-12 rounded-xl bg-ink px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-cream opacity-0 transition group-hover:opacity-100">
                  {String(i + 1).padStart(2, "0")} · {s.label}
                </span>
              </a>
            );
          })}
        </div>
      </nav>

      {/* mobile chip */}
      <div className="no-print fixed right-3 bottom-3 z-40 lg:hidden">
        <a
          href={`#${stops[Math.min(idx + 1, stops.length - 1)].id}`}
          className="flex items-center gap-2 rounded-full border-2 border-ink bg-sun px-4 py-2 font-display text-sm font-semibold shadow-pop"
        >
          <span>{stops[idx]?.emoji}</span>
          {idx + 1}/{stops.length}
          <span className="text-ink-soft">· next ↓</span>
        </a>
      </div>
    </>
  );
}
