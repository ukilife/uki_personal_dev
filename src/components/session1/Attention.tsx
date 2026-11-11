"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Bell, Brain, Coffee, Hourglass, MessagesSquare, Smartphone, Target, Zap, CloudSun, ListChecks } from "lucide-react";
import { Button, Reveal, Stop } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";

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
      intro="Everything around you is designed to grab your attention. Choosing where it goes is a superpower — and like any power, it gets stronger with practice."
    >
      <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <Reveal>
          <FocusGame />
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
    </Stop>
  );
}
