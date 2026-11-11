"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { ArrowRight, Building, Check, MapPin, Mountain, TreePalm, Trees, X, type LucideIcon } from "lucide-react";
import { SESSIONS, type SceneId, type SessionMeta } from "@/lib/sessions";
import { useJourneyStates, type SessionState } from "@/lib/progress";
import { celebrate } from "@/lib/celebrate";
import { Button, ButtonLink, Reveal } from "@/components/ui";
import { Scene } from "./Scenes";

const PLACE_ICON: Record<SceneId, LucideIcon> = { island: TreePalm, mountain: Mountain, forest: Trees, city: Building };
const pad = (n: number) => String(n).padStart(2, "0");

// one celebration per completed destination per visit
const celebrated = new Set<number>();

function StateBadge({ state }: { state: SessionState }) {
  if (state === "completed")
    return (
      <span className="inline-flex items-center gap-1 rounded-full border-2 border-ink bg-teal px-2.5 py-0.5 text-xs font-bold text-white">
        <Check size={12} strokeWidth={3} /> Completed
      </span>
    );
  if (state === "current")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-sun px-2.5 py-0.5 text-xs font-bold">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-coral" />
        </span>
        Current stop
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full border-2 border-dashed border-ink/40 bg-white px-2.5 py-0.5 text-xs font-bold text-ink-soft">
      Coming up next
    </span>
  );
}

/* the big, clickable illustrated milestone */
function Milestone({ s, state, onOpen, small }: { s: SessionMeta; state: SessionState; onOpen: () => void; small?: boolean }) {
  const label = `Session ${s.number}: ${s.destination} — ${s.cta}`;
  const inner = (
    <motion.span
      whileHover={{ scale: 1.05, rotate: s.number % 2 ? -2 : 2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 260, damping: 16 }}
      className="relative block"
    >
      {state === "current" && (
        <>
          <motion.span
            aria-hidden
            className="absolute -inset-3 rounded-full"
            style={{ boxShadow: `0 0 0 6px ${s.color}55, 0 0 50px 12px ${s.color}66` }}
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.98, 1.03, 0.98] }}
            transition={{ type: "tween", duration: 2.4, repeat: Infinity }}
          />
          <motion.span
            aria-hidden
            className="absolute -top-9 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border-2 border-ink bg-white px-3 py-1 font-display text-xs font-bold whitespace-nowrap shadow-pop"
            animate={{ y: [0, -5, 0] }}
            transition={{ type: "tween", duration: 1.8, repeat: Infinity }}
          >
            <MapPin size={12} className="text-coral" /> You are here
          </motion.span>
        </>
      )}
      <span
        className={`relative block overflow-hidden rounded-full border-4 border-ink bg-white shadow-pop-lg transition duration-300 ${
          small ? "h-40 w-40" : "h-56 w-56 lg:h-64 lg:w-64"
        } ${state === "upcoming" ? "saturate-[.55] group-hover:saturate-100 group-focus-visible:saturate-100" : ""}`}
      >
        <Scene id={s.scene} />
      </span>
      {!small && (
        <span
          className="absolute top-2 -left-2 grid h-12 w-12 place-items-center rounded-2xl border-2 border-ink font-display text-lg font-bold text-white shadow-pop"
          style={{ background: s.color }}
        >
          {pad(s.number)}
        </span>
      )}
      {state === "completed" && (
        <motion.span
          initial={{ scale: 0, rotate: -40 }}
          whileInView={{ scale: 1, rotate: -10 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 260, damping: 12 }}
          className="absolute -right-1 bottom-3 grid h-12 w-12 place-items-center rounded-full border-2 border-ink bg-teal text-white shadow-pop"
        >
          <Check size={24} strokeWidth={3.5} />
        </motion.span>
      )}
    </motion.span>
  );
  const cls = "group inline-block rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sun focus-visible:ring-offset-4";
  return s.href ? (
    <Link href={s.href} aria-label={label} className={cls}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onOpen} aria-label={label} aria-haspopup="dialog" className={cls}>
      {inner}
    </button>
  );
}

function Destination({ s, i, state, onOpen }: { s: SessionMeta; i: number; state: SessionState; onOpen: () => void }) {
  const flip = i % 2 === 1;
  const Icon = PLACE_ICON[s.scene];
  return (
    <li id={`session-${s.number}`} className="relative scroll-mt-24 pl-16 md:pl-0">
      {/* mobile rail marker */}
      <span
        aria-hidden
        className={`absolute top-1 left-0 grid h-12 w-12 place-items-center rounded-2xl border-2 border-ink font-display text-lg font-bold text-white md:hidden ${
          state === "upcoming" ? "opacity-70" : ""
        }`}
        style={{ background: s.color }}
      >
        {state === "completed" ? <Check size={22} strokeWidth={3} /> : pad(s.number)}
      </span>

      <div className="grid items-center gap-6 md:grid-cols-2 md:gap-14">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
          onViewportEnter={() => {
            if (state === "completed" && !celebrated.has(s.number)) {
              celebrated.add(s.number);
              celebrate("small");
            }
          }}
          className={`flex justify-center pt-8 md:pt-0 ${flip ? "md:order-2" : ""}`}
        >
          <span className="hidden md:block">
            <Milestone s={s} state={state} onOpen={onOpen} />
          </span>
          <span className="md:hidden">
            <Milestone s={s} state={state} onOpen={onOpen} small />
          </span>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, x: flip ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={`relative rounded-[2rem] border-2 border-ink p-5 shadow-pop sm:p-7 ${
            state === "upcoming" ? "bg-white/80" : "bg-white"
          }`}
        >
          <span aria-hidden className="absolute inset-x-6 -top-[3px] h-1.5 rounded-b-full" style={{ background: s.color }} />
          <div className="flex flex-wrap items-center gap-2">
            <StateBadge state={state} />
            <span className="text-xs font-bold tracking-widest text-ink-soft uppercase">Session {pad(s.number)}</span>
          </div>
          <p className="mt-3 flex items-center gap-2 font-display text-sm font-bold tracking-[0.15em] uppercase" style={{ color: s.color }}>
            <Icon size={16} /> {s.destination}
          </p>
          <h3 className="mt-1 text-3xl leading-tight font-bold sm:text-4xl">{s.headline}</h3>
          <p className="mt-3 text-lg text-ink-soft">{s.description}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Activities">
            {s.activities.map((a) => (
              <li key={a} className={`rounded-full border-2 border-ink/10 px-2.5 py-1 text-xs font-semibold ${s.soft}`}>
                {a}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            {s.href ? (
              <ButtonLink href={s.href} variant="ink" style={{ background: s.color, color: "#fff" }}>
                {s.cta} <ArrowRight size={18} />
              </ButtonLink>
            ) : (
              <button
                type="button"
                onClick={onOpen}
                aria-haspopup="dialog"
                className="btn-pop inline-flex items-center gap-2 rounded-2xl border-2 border-ink px-5 py-3 font-display font-semibold text-white focus-visible:ring-4 focus-visible:ring-sun/70 focus-visible:outline-none"
                style={{ background: s.color }}
              >
                {s.cta} <ArrowRight size={18} />
              </button>
            )}
          </div>
        </motion.article>
      </div>
    </li>
  );
}

/* a stretch of trail between two destinations — draws itself as you scroll */
function Trail({ toRight, color }: { toRight: boolean; color: string }) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const len = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });
  // viewBox roughly matches the real box (≈1000 × 128) so strokes stay round
  const d = toRight ? "M250 -20 C 250 80, 750 48, 750 148" : "M750 -20 C 750 80, 250 48, 250 148";
  return (
    <li ref={ref} aria-hidden className="relative hidden h-32 md:block">
      <svg viewBox="0 0 1000 128" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
        <path d={d} fill="none" stroke="#23204e" strokeOpacity=".08" strokeWidth="26" strokeLinecap="round" />
        <motion.path d={d} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" style={{ pathLength: len }} />
      </svg>
      <motion.span
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl"
        animate={{ rotate: [0, 15, -15, 0], y: [0, -4, 0] }}
        transition={{ type: "tween", duration: 3, repeat: Infinity }}
      >
        👣
      </motion.span>
    </li>
  );
}

/* polished introduction for sessions that don't have their own page yet */
function SessionIntro({ s, state, onClose }: { s: SessionMeta; state: SessionState; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-ink/60 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-intro-title"
        initial={{ scale: 0.85, y: 40, rotate: -2 }}
        animate={{ scale: 1, y: 0, rotate: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative my-8 w-full max-w-2xl overflow-hidden rounded-[2.5rem] border-2 border-ink bg-cream shadow-pop-lg"
      >
        <button
          autoFocus
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 grid h-10 w-10 place-items-center rounded-xl border-2 border-ink bg-white focus-visible:ring-4 focus-visible:ring-sun focus-visible:outline-none"
        >
          <X size={18} />
        </button>
        <div className={`flex items-center gap-5 p-6 pr-16 sm:p-8 ${s.soft}`}>
          <span className="block h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-ink bg-white sm:h-36 sm:w-36">
            <Scene id={s.scene} />
          </span>
          <div>
            <StateBadge state={state} />
            <p className="mt-2 font-display text-sm font-bold tracking-[0.15em] uppercase" style={{ color: s.color }}>
              Session {pad(s.number)} · {s.destination}
            </p>
            <h3 id="session-intro-title" className="mt-1 text-3xl leading-tight font-bold">
              {s.headline}
            </h3>
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <p className="text-lg text-ink-soft">{s.description}</p>
          <p className="mt-5 font-display text-sm font-bold tracking-widest text-ink-soft uppercase">What you&apos;ll explore</p>
          <ol className="mt-3 grid gap-2 sm:grid-cols-2">
            {s.activities.map((a, i) => (
              <li key={a} className="flex items-center gap-3 rounded-2xl border-2 border-ink/10 bg-white px-3 py-2 font-semibold">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg font-display text-sm text-white" style={{ background: s.color }}>
                  {i + 1}
                </span>
                {a}
              </li>
            ))}
          </ol>
          <p className="mt-6 rounded-2xl border-2 border-dashed border-ink/25 bg-white/70 p-4 text-sm text-ink-soft">
            🗺️ This destination&apos;s interactive page opens when your class arrives here. Until then — stay curious and keep
            exploring Session 1.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/sessions/who-am-i" variant="sun">
              Continue my journey <ArrowRight size={18} />
            </ButtonLink>
            <Button variant="white" onClick={onClose}>
              Back to the map
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function JourneyMap() {
  const states = useJourneyStates();
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  const show = (i: number) => {
    opener.current = document.activeElement as HTMLElement | null;
    setOpen(i);
  };
  const close = () => {
    setOpen(null);
    opener.current?.focus();
  };

  return (
    <section id="journey" className="relative scroll-mt-16 overflow-hidden bg-cream">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-70" />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute top-40 -left-24 h-72 w-72 animate-float-slow rounded-full bg-sun/25 blur-3xl" />
        <span className="absolute top-1/2 -right-24 h-80 w-80 animate-float rounded-full bg-lilac blur-3xl" />
        <span className="absolute bottom-20 left-1/4 h-64 w-64 animate-float-slow rounded-full bg-mint blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="font-display text-sm font-bold tracking-[0.2em] text-coral uppercase">The Unfold Journey</p>
          <h2 className="mt-3 text-5xl leading-tight font-bold sm:text-6xl">
            Four destinations. <span className="squiggle">One adventure:</span> you.
          </h2>
          <p className="mt-4 text-lg text-ink-soft">Follow the trail. Every stop reveals a new piece of who you are.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2" aria-label="Map key">
            <StateBadge state="completed" />
            <StateBadge state="current" />
            <StateBadge state="upcoming" />
          </div>
          <p className="mt-3 text-xs text-ink-soft">
            Progress comes from this device only — Session 1 shows ✓ once all its take-home missions are ticked.
          </p>
        </Reveal>

        <ol className="relative mt-20 space-y-12 md:space-y-0">
          {/* mobile trail */}
          <span aria-hidden className="absolute top-6 bottom-6 left-[22px] w-0 border-l-4 border-dashed border-ink/20 md:hidden" />
          {SESSIONS.map((s, i) => (
            <Fragment key={s.slug}>
              <Destination s={s} i={i} state={states[i]} onOpen={() => show(i)} />
              {i < SESSIONS.length - 1 && <Trail toRight={i % 2 === 0} color={SESSIONS[i + 1].color} />}
            </Fragment>
          ))}
        </ol>

        <Reveal className="mt-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-5 py-2 font-display text-lg font-semibold shadow-pop">
            🏁 …and at the end of the trail? A version of you that you haven&apos;t met yet.
          </span>
        </Reveal>
      </div>

      <AnimatePresence>
        {open !== null && <SessionIntro s={SESSIONS[open]} state={states[open]} onClose={close} />}
      </AnimatePresence>
    </section>
  );
}
