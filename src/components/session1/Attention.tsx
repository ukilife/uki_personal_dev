"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  Bell, Brain, Coffee, Hourglass, MessagesSquare, Smartphone, Target, Zap, CloudSun, ListChecks, RotateCcw, Timer,
} from "lucide-react";
import { Button, Reveal, Stop } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";
import { playAlarm, primeAlarm } from "@/lib/alarm";
import { timerLabel, useTimer } from "@/lib/useTimer";

const GAME_MS = 20000;
const POPUPS = [
  { text: "📱 23 new notifications!", cls: "bg-white" },
  { text: "💬 Psst… did you see that?!", cls: "bg-blush" },
  { text: "💭 What's for lunch?", cls: "bg-lilac" },
  { text: "⏰ Eh… do it later", cls: "bg-sun-soft" },
  { text: "🎮 One more level?", cls: "bg-teal-soft" },
  { text: "📸 Someone tagged you", cls: "bg-sky" },
];

type Popup = { id: number; text: string; cls: string; x: number; y: number };

function FocusGame() {
  const arena = useRef<HTMLDivElement>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const [phase, setPhase] = useState<"idle" | "play" | "done">("idle");
  const [target, setTarget] = useState({ x: 50, y: 50 });
  const [onTarget, setOnTarget] = useState(false);
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(GAME_MS);
  const [popups, setPopups] = useState<Popup[]>([]);

  useEffect(() => {
    if (phase !== "play") return;
    let raf = 0;
    let lastPopup = 0;
    let inside = 0;
    let total = 0;
    let prev = performance.now();
    const t0 = prev;
    const seed = Math.random() * 10;
    const tick = (now: number) => {
      const dt = now - prev;
      prev = now;
      const t = (now - t0) / 1000;
      const speed = 0.55 + t * 0.03;
      const x = 50 + 36 * Math.sin(t * speed * 1.3 + seed);
      const y = 50 + 34 * Math.sin(t * speed * 1.9 + seed * 2) * Math.cos(t * 0.4);
      setTarget({ x, y });
      const rect = arena.current?.getBoundingClientRect();
      let hit = false;
      if (rect && pointer.current) {
        const px = ((pointer.current.x - rect.left) / rect.width) * 100;
        const py = ((pointer.current.y - rect.top) / rect.height) * 100;
        const dx = ((px - x) / 100) * rect.width;
        const dy = ((py - y) / 100) * rect.height;
        hit = Math.hypot(dx, dy) < 44;
      }
      total += dt;
      if (hit) inside += dt;
      setOnTarget(hit);
      setScore(Math.round((inside / total) * 100));
      setLeft(Math.max(0, GAME_MS - (now - t0)));
      if (now - lastPopup > 1700) {
        lastPopup = now;
        const p = POPUPS[Math.floor(Math.random() * POPUPS.length)];
        const id = now;
        setPopups((ps) => [...ps.slice(-3), { id, ...p, x: 5 + Math.random() * 60, y: 5 + Math.random() * 75 }]);
      }
      if (now - t0 >= GAME_MS) {
        setPhase("done");
        setPopups([]);
        if (inside / total > 0.6) celebrate("small");
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const verdict =
    score >= 80 ? "Laser focus! 🔥 Superpower unlocked." : score >= 55 ? "Solid! The pull is real, but you held on. 💪" : "The distractions won this round… want a rematch? 😅";

  return (
    <div className="rounded-[2rem] border-2 border-ink bg-white p-4 shadow-pop-lg sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-xl font-bold">Focus Lock 🎯</p>
          <p className="text-sm text-ink-soft">Keep your finger / cursor on the orb for 20 seconds. Ignore everything else.</p>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl font-bold tabular-nums">{score}%</p>
          <p className="text-[10px] font-bold tracking-widest text-ink-soft uppercase">focus</p>
        </div>
      </div>
      <div
        ref={arena}
        onPointerMove={(e) => (pointer.current = { x: e.clientX, y: e.clientY })}
        onPointerDown={(e) => (pointer.current = { x: e.clientX, y: e.clientY })}
        onPointerLeave={() => (pointer.current = null)}
        className="relative aspect-[16/10] touch-none overflow-hidden rounded-3xl border-2 border-ink bg-ink bg-grid select-none"
      >
        {phase === "play" && (
          <>
            <div className="absolute inset-x-0 top-0 h-1.5 bg-white/10">
              <div className="h-full bg-sun" style={{ width: `${(left / GAME_MS) * 100}%` }} />
            </div>
            <div
              className="absolute -mt-9 -ml-9 grid h-18 w-18 place-items-center rounded-full transition-[background,box-shadow] duration-150"
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`,
                width: 72,
                height: 72,
                background: onTarget ? "radial-gradient(circle,#ffc93c,#f7845e)" : "radial-gradient(circle,#ffffff55,#ffffff11)",
                boxShadow: onTarget ? "0 0 40px 10px #ffc93c88" : "0 0 0 3px #ffffff55",
              }}
            >
              <Target className={onTarget ? "text-ink" : "text-white/70"} size={30} />
            </div>
            <AnimatePresence>
              {popups.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.6, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0, rotate: [-2, 2, -2] }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  className={`pointer-events-none absolute rounded-2xl border-2 border-ink px-3 py-2 text-xs font-semibold whitespace-nowrap shadow-pop sm:text-sm ${p.cls}`}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                  {p.text}
                </motion.div>
              ))}
            </AnimatePresence>
          </>
        )}
        {phase !== "play" && (
          <div className="absolute inset-0 grid place-items-center p-6 text-center text-cream">
            <div>
              {phase === "done" ? (
                <>
                  <p className="font-display text-6xl font-bold text-sun">{score}%</p>
                  <p className="mt-2 text-lg">{verdict}</p>
                </>
              ) : (
                <>
                  <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.6 }}>
                    <Target size={56} className="mx-auto text-sun" />
                  </motion.div>
                  <p className="mt-3 text-lg">Can you resist the pull?</p>
                </>
              )}
              <Button className="mt-5" onClick={() => setPhase("play")}>
                {phase === "done" ? "Try again" : "Start focus test"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────── Focus Lock · Test 2: Colour Clash (tap the INK colour, not the word) ───────── */

const INKS = [
  { name: "RED", hex: "#e2445f" },
  { name: "BLUE", hex: "#4a9be0" },
  { name: "GREEN", hex: "#2bb59f" },
  { name: "YELLOW", hex: "#ffc93c" },
];
const CLASH_MS = 20000;

function ColourClash() {
  const [phase, setPhase] = useState<"idle" | "play" | "done">("idle");
  const [card, setCard] = useState({ word: 0, ink: 1, n: 0 });
  const [right, setRight] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [left, setLeft] = useState(CLASH_MS);
  const [flash, setFlash] = useState<"ok" | "no" | null>(null);
  const startedAt = useRef(0);
  const score = useRef({ right: 0, wrong: 0 });

  const deal = () =>
    setCard((c) => {
      const word = Math.floor(Math.random() * INKS.length);
      let ink = Math.floor(Math.random() * INKS.length);
      // mostly mismatched — that's where the brain trips
      if (ink === word && Math.random() < 0.8) ink = (ink + 1 + Math.floor(Math.random() * 3)) % INKS.length;
      return { word, ink, n: c.n + 1 };
    });

  useEffect(() => {
    if (phase !== "play") return;
    const id = setInterval(() => {
      const l = Math.max(0, CLASH_MS - (Date.now() - startedAt.current));
      setLeft(l);
      if (l === 0) {
        setPhase("done");
        playAlarm(1);
        const { right: r, wrong: w } = score.current;
        if (r >= 15 && r / Math.max(1, r + w) >= 0.85) celebrate("small");
      }
    }, 100);
    return () => clearInterval(id);
  }, [phase]);

  const begin = () => {
    primeAlarm();
    score.current = { right: 0, wrong: 0 };
    setRight(0);
    setWrong(0);
    setLeft(CLASH_MS);
    startedAt.current = Date.now();
    deal();
    setPhase("play");
  };

  const answer = (i: number) => {
    if (phase !== "play") return;
    const ok = i === card.ink;
    if (ok) {
      score.current.right++;
      setRight((r) => r + 1);
    } else {
      score.current.wrong++;
      setWrong((w) => w + 1);
    }
    setFlash(ok ? "ok" : "no");
    setTimeout(() => setFlash(null), 180);
    deal();
  };

  const accuracy = right + wrong ? Math.round((right / (right + wrong)) * 100) : 0;
  const verdict =
    right >= 20 && accuracy >= 90
      ? "Brain boss! 🧠 You saw what's really there."
      : accuracy >= 75
        ? "Nice control — your brain wanted to read, you made it look. 💪"
        : "The words tricked you! Your brain loves autopilot… rematch? 😅";

  return (
    <div className="rounded-[2rem] border-2 border-ink bg-white p-4 shadow-pop-lg sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-xl font-bold">Colour Clash 🌈</p>
          <p className="text-sm text-ink-soft">
            Tap the <b>colour of the ink</b> — NOT the word. 20 seconds. Your brain will try to cheat.
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl font-bold tabular-nums">{right}</p>
          <p className="text-[10px] font-bold tracking-widest text-ink-soft uppercase">correct</p>
        </div>
      </div>
      <div
        className={`relative grid aspect-[16/10] place-items-center overflow-hidden rounded-3xl border-2 border-ink bg-ink bg-grid transition-shadow select-none ${
          flash === "ok" ? "shadow-[inset_0_0_0_6px_#2bb59f]" : flash === "no" ? "shadow-[inset_0_0_0_6px_#e2445f]" : ""
        }`}
      >
        {phase === "play" && (
          <>
            <div className="absolute inset-x-0 top-0 h-1.5 bg-white/10">
              <div className="h-full bg-sun" style={{ width: `${(left / CLASH_MS) * 100}%` }} />
            </div>
            <span className="absolute top-3 right-4 text-xs font-bold text-cream/60 tabular-nums">
              {Math.ceil(left / 1000)}s · ✗ {wrong}
            </span>
            <AnimatePresence mode="popLayout">
              <motion.p
                key={card.n}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.4, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="font-display text-6xl font-bold tracking-wide sm:text-8xl"
                style={{ color: INKS[card.ink].hex }}
              >
                {INKS[card.word].name}
              </motion.p>
            </AnimatePresence>
          </>
        )}
        {phase !== "play" && (
          <div className="p-6 text-center text-cream">
            {phase === "done" ? (
              <>
                <p className="font-display text-6xl font-bold text-sun">{right}</p>
                <p className="text-sm text-cream/70">
                  correct · {accuracy}% accuracy · {wrong} tricked
                </p>
                <p className="mt-2 text-lg">{verdict}</p>
              </>
            ) : (
              <>
                <p className="font-display text-5xl font-bold" style={{ color: INKS[1].hex }}>
                  RED
                </p>
                <p className="mt-2 text-sm text-cream/70">↑ the right answer here is BLUE</p>
              </>
            )}
            <Button className="mt-5" onClick={begin}>
              {phase === "done" ? "Try again" : "Start Colour Clash"}
            </Button>
          </div>
        )}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {INKS.map((c, i) => (
          <button
            key={c.name}
            onClick={() => answer(i)}
            disabled={phase !== "play"}
            className="btn-pop rounded-2xl border-2 border-ink bg-cream py-3 font-display text-lg font-bold disabled:opacity-40"
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function FocusLab() {
  const [test, setTest] = useState<1 | 2>(1);
  return (
    <div>
      <div className="mb-3 flex gap-2">
        {(
          [
            [1, "Test 1 · Orb Chase"],
            [2, "Test 2 · Colour Clash"],
          ] as const
        ).map(([n, label]) => (
          <button
            key={n}
            onClick={() => setTest(n)}
            aria-pressed={test === n}
            className={`rounded-full border-2 border-ink px-4 py-1.5 font-display text-sm font-bold transition ${
              test === n ? "bg-ink text-sun" : "bg-white hover:bg-sun-soft"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {test === 1 ? <FocusGame /> : <ColourClash />}
    </div>
  );
}

/* ───────── Bridge: focus → strengths → the life marathon ───────── */

function LifeMarathon() {
  const [revealed, setRevealed] = useState(false);
  const timer = useTimer({ mode: "down", seconds: 10, tick: 100, onAlarm: () => setRevealed(true) });
  const pct = revealed ? 1 : timer.progress;

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-ink bg-ink p-6 text-cream shadow-pop-lg sm:p-10">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-20" />
      <div className="relative">
        <p className="font-display text-sm font-bold tracking-[0.2em] text-sun uppercase">Focus on… what, exactly?</p>
        <h3 className="mt-2 max-w-3xl text-3xl leading-tight font-bold sm:text-5xl">
          Life isn&apos;t a sprint. It&apos;s a <span className="text-sun">marathon.</span> 🏃
        </h3>

        {/* the track */}
        <div className="relative mt-8 mb-2 h-16">
          <div className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 rounded-full bg-white/10" />
          <div
            className="absolute top-1/2 left-0 h-3 -translate-y-1/2 rounded-full bg-gradient-to-r from-teal via-sun to-coral transition-[width] duration-200"
            style={{ width: `${pct * 100}%` }}
          />
          {["Focus", "Strengths", "Weaknesses", "Finish 🏁"].map((m, i) => (
            <span
              key={m}
              className="absolute top-full -translate-x-1/2 text-[10px] font-bold tracking-widest whitespace-nowrap text-cream/60 uppercase sm:text-xs"
              style={{ left: `${8 + i * 28}%` }}
            >
              {m}
            </span>
          ))}
          <motion.span
            className="absolute top-1/2 -mt-6 -ml-5 text-4xl"
            animate={{ left: `${pct * 100}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 16 }}
          >
            <span className="inline-block -scale-x-100">🏃</span>
          </motion.span>
        </div>

        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div key="challenge" exit={{ opacity: 0, y: -10 }} className="mt-10 grid items-center gap-6 md:grid-cols-[1fr_auto]">
              <div>
                <p className="text-xl font-semibold sm:text-2xl">
                  Quick challenge: say <span className="text-sun">3 of your strengths</span> out loud.
                </p>
                <p className="mt-1 text-cream/70">You have 10 seconds. Easy… right?</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display text-5xl font-bold tabular-nums">{timerLabel(timer)}</span>
                {timer.running ? (
                  <Button variant="white" onClick={() => (timer.reset(), setRevealed(true))}>
                    I did it!
                  </Button>
                ) : (
                  <Button onClick={timer.start}>
                    <Timer size={18} /> Start 10 seconds
                  </Button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}
              className="mt-10"
            >
              <p className="text-lg text-cream/80">
                Now try naming 3 weaknesses… 🤔 Faster, wasn&apos;t it? Most of us can list our flaws in a heartbeat — and
                go quiet when asked what we&apos;re good at.
              </p>
              <p className="mt-5 font-display text-3xl leading-tight font-bold sm:text-5xl">
                You can&apos;t win a marathon running on strengths <span className="squiggle text-sun">you&apos;ve never named.</span>
              </p>
              <p className="mt-5 max-w-3xl text-lg text-cream/80">
                Focus gets you moving. But to go the distance, you need to know what you&apos;re running <b className="text-cream">on</b> —
                your strengths to push with — and what you need to <b className="text-cream">train</b> — your weaknesses. Let&apos;s
                find both.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#superpowers">
                  <Button>
                    <Zap size={18} /> Step 1: my strengths
                  </Button>
                </a>
                <a href="#not-yet">
                  <Button variant="white">🌱 Step 2: my weaknesses</Button>
                </a>
                <button
                  onClick={() => (timer.reset(), setRevealed(false))}
                  className="flex items-center gap-1 px-2 text-sm font-semibold text-cream/60 hover:text-cream"
                >
                  <RotateCcw size={14} /> again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const PULLS = [
  { icon: Bell, label: "Phone notifications" },
  { icon: MessagesSquare, label: "Side chatter" },
  { icon: CloudSun, label: "Wandering thoughts" },
  { icon: Hourglass, label: "Procrastination" },
];
const FOCUS = [
  { icon: Smartphone, label: "Put away distractions" },
  { icon: ListChecks, label: "Single-task flow" },
  { icon: Coffee, label: "Recharging breaks" },
];

function SuperpowerChoice() {
  const [chosen, setChosen] = useState(false);
  return (
    <div className="grid items-center gap-4 rounded-[2rem] border-2 border-ink bg-white p-5 shadow-pop md:grid-cols-[1fr_auto_1fr]">
      <div>
        <p className="mb-3 font-display text-sm font-bold tracking-widest text-berry uppercase">Distraction pulls</p>
        <div className="space-y-2">
          {PULLS.map((p, i) => (
            <motion.div
              key={p.label}
              animate={
                chosen
                  ? { opacity: 0.25, x: -10, filter: "grayscale(1)" }
                  : { opacity: 1, x: [0, 4, -3, 0], filter: "grayscale(0)" }
              }
              transition={chosen ? { duration: 0.4 } : { repeat: Infinity, duration: 2 + i * 0.4 }}
              className="flex items-center gap-3 rounded-2xl border-2 border-ink/15 bg-blush/60 px-3 py-2"
            >
              <p.icon size={18} />
              <span className="text-sm font-semibold">{p.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 py-4">
        <motion.button
          onClick={() => {
            setChosen((c) => !c);
            if (!chosen) celebrate("small");
          }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
          animate={chosen ? { rotate: 0 } : { rotate: [0, -4, 4, 0] }}
          transition={chosen ? {} : { repeat: Infinity, duration: 2.5 }}
          className={`grid h-32 w-32 place-items-center rounded-full border-4 border-ink font-display text-lg leading-tight font-bold shadow-pop ${
            chosen ? "bg-teal text-white" : "bg-sun"
          }`}
        >
          <span className="whitespace-pre-line">
            <Zap className="mx-auto mb-1" />
            {chosen ? "Focus\nchosen!" : "Choose\nfocus"}
          </span>
        </motion.button>
        <span className="text-xs font-semibold text-ink-soft">The superpower choice</span>
      </div>
      <div>
        <p className="mb-3 font-display text-sm font-bold tracking-widest text-teal uppercase">Focused mind</p>
        <div className="space-y-2">
          {FOCUS.map((f, i) => (
            <motion.div
              key={f.label}
              animate={chosen ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0.35, x: 10, scale: 0.97 }}
              transition={{ delay: chosen ? 0.15 * i : 0 }}
              className={`flex items-center gap-3 rounded-2xl border-2 px-3 py-2 ${
                chosen ? "border-ink bg-teal-soft" : "border-ink/15 bg-cream"
              }`}
            >
              <f.icon size={18} />
              <span className="text-sm font-semibold">{f.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Attention() {
  return (
    <Stop
      id="attention"
      stop={7}
      kicker="Big idea · Focus"
      tone="mint"
      kickerClass="bg-teal text-white"
      title={
        <>
          Your attention is your <span className="text-teal">superpower</span>
        </>
      }
      intro="Everything around you is designed to grab your attention. Choosing where it goes is a superpower — and like any power, it gets stronger with practice. Take both Focus Lock tests, then find out what your focus is really for."
    >
      <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <Reveal>
          <FocusLab />
        </Reveal>
        <Reveal delay={0.1} className="flex flex-col gap-5">
          <div className="rounded-[2rem] border-2 border-ink bg-ink p-6 text-cream">
            <Brain className="text-sun" size={32} />
            <p className="mt-3 font-display text-2xl font-bold">Remember the Button Challenge?</p>
            <ul className="mt-3 space-y-2 text-cream/85">
              <li>• When did your team drop a button?</li>
              <li>• What were you thinking about at that moment?</li>
              <li>• What helped you get back on track?</li>
            </ul>
          </div>
          <div className="rounded-[2rem] border-2 border-dashed border-ink/30 bg-white/70 p-5 text-sm leading-relaxed text-ink-soft">
            <b className="text-ink">Try this week:</b> pick ONE task, put your phone in another room, and work for 15 minutes.
            Then take a real break. Notice how it feels.
          </div>
        </Reveal>
      </div>
      <Reveal className="mt-8">
        <SuperpowerChoice />
      </Reveal>
      <Reveal className="mt-10">
        <LifeMarathon />
      </Reveal>
    </Stop>
  );
}
