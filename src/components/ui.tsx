"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  ...rest
}: { children: ReactNode; delay?: number; y?: number; className?: string } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function Pill({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.12em] ${className}`}
    >
      {children}
    </span>
  );
}

type SectionProps = {
  id: string;
  stop: number;
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  tone?: "cream" | "sky" | "mint" | "sun" | "lilac" | "blush" | "ink";
  kickerClass?: string;
  aside?: ReactNode;
};

const TONES: Record<NonNullable<SectionProps["tone"]>, string> = {
  cream: "bg-cream",
  sky: "bg-sky",
  mint: "bg-mint",
  sun: "bg-sun-soft",
  lilac: "bg-lilac",
  blush: "bg-blush/60",
  ink: "bg-ink text-cream",
};

/** A "stop" on the session journey: numbered badge + kicker + big title. */
export function Stop({ id, stop, kicker, title, intro, children, tone = "cream", kickerClass, aside }: SectionProps) {
  const dark = tone === "ink";
  return (
    <section id={id} data-stop={id} className={`relative scroll-mt-20 overflow-hidden ${TONES[tone]}`}>
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-60" />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-8 md:py-28 lg:pl-28">
        <Reveal className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <span
                className={`font-display grid h-11 w-11 place-items-center rounded-2xl text-lg font-bold ${
                  dark ? "bg-sun text-ink" : "bg-ink text-sun"
                }`}
              >
                {String(stop).padStart(2, "0")}
              </span>
              <Pill className={kickerClass ?? (dark ? "bg-white/10 text-sun" : "bg-blush text-ink")}>{kicker}</Pill>
            </div>
            <h2 className="text-4xl leading-[1.05] font-bold sm:text-5xl md:text-6xl">{title}</h2>
            {intro && (
              <p className={`mt-5 max-w-2xl text-lg leading-relaxed ${dark ? "text-cream/80" : "text-ink-soft"}`}>
                {intro}
              </p>
            )}
          </div>
          {aside}
        </Reveal>
        {children}
      </div>
    </section>
  );
}

export function Button({
  children,
  onClick,
  variant = "sun",
  className = "",
  disabled,
  type = "button",
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "sun" | "teal" | "coral" | "white" | "ink" | "grape";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  title?: string;
}) {
  const v = {
    sun: "bg-sun text-ink",
    teal: "bg-teal text-white",
    coral: "bg-coral text-white",
    white: "bg-white text-ink",
    ink: "bg-ink text-cream",
    grape: "bg-grape text-white",
  }[variant];
  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`btn-pop font-display inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-ink px-5 py-3 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 ${v} ${className}`}
    >
      {children}
    </button>
  );
}

export function PrivateBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border-2 border-dashed border-ink/30 bg-white/70 px-3 py-1 text-xs font-semibold text-ink-soft ${className}`}
      title="Saved only in this browser. Nobody else can see it."
    >
      🔒 Private · saved on this device only
    </span>
  );
}
