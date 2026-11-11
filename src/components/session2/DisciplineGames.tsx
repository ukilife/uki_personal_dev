"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Hand, Hourglass, RotateCcw, Signpost } from "lucide-react";
import { Button, Reveal, Stop } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";

const now = () => performance.now();
const rand = (a: number, b: number) => a + Math.random() * (b - a);

/* ---------------- Game 1: Wait for It ---------------- */

const WAIT_SECONDS = 20;
const LURES = ["Grab ⭐ now!", "Just one peek 👀", "New message 📱", "Free ⭐ — tap!", "Skip the wait ⏩", "You deserve it 🍩"];
type Lure = { id: number; x: number; y: number; text: string };

function WaitForIt() {
  const [phase, setPhase] = useState<"idle" | "waiting" | "won" | "grabbed">("idle");
  const [elapsed, setElapsed] = useState(0);
  const [lures, setLures] = useState<Lure[]>([]);
  const timers = useRef<number[]>([]);
  const start = useRef(0);

  const stopAll = () => {
    timers.current.forEach((t) => window.clearInterval(t));
    timers.current = [];
    setLures([]);
  };
  useEffect(() => () => timers.current.forEach((t) => window.clearInterval(t)), []);

  const begin = () => {
    stopAll();
    setPhase("waiting");
    setElapsed(0);
    start.current = now();
    let id = 0;
    timers.current.push(
      window.setInterval(() => {
        const e = (now() - start.current) / 1000;
        setElapsed(e);
        if (e >= WAIT_SECONDS) {
          stopAll();
          setPhase("won");
          celebrate("big");
        }
      }, 100),
      window.setInterval(() => {
        const lure = { id: id++, x: rand(4, 64), y: rand(6, 74), text: LURES[Math.floor(Math.random() * LURES.length)] };
        setLures((p) => [...p.slice(-2), lure]);
      }, 1800),
    );
  };

  const grab = () => {
    if (phase !== "waiting") return;
    stopAll();
    setPhase("grabbed");
  };

  const pct = Math.min(1, elapsed / WAIT_SECONDS);

  return (
    <div>
      <p className="text-ink-soft">
        You can have <b className="text-ink">1 star right now</b> — or wait {WAIT_SECONDS} seconds and get <b className="text-ink">3 stars</b>.
        Sounds easy? Temptations will pop up while you wait. Don&apos;t touch them!
      </p>
      <div className="relative mt-5 h-72 overflow-hidden rounded-[1.75rem] border-2 border-ink bg-sun-soft">
        <AnimatePresence>
          {phase === "waiting" &&
            lures.map((l) => (
              <motion.button
                key={l.id}
                onClick={grab}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: [0, -4, 4, 0] }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ rotate: { type: "tween", repeat: Infinity, duration: 0.6 } }}
                className="absolute z-10 rounded-2xl border-2 border-ink bg-coral px-3 py-2 font-display text-sm font-bold whitespace-nowrap text-white shadow-pop"
                style={{ left: `${l.x}%`, top: `${l.y}%` }}
              >
                {l.text}
              </motion.button>
            ))}
        </AnimatePresence>

        <div className="absolute inset-0 grid place-items-center p-6 text-center">
          {phase === "idle" && (
            <div>
              <span className="text-6xl">⭐</span>
              <p className="mt-2 font-display text-xl font-bold">Ready to test your self-control?</p>
              <Button className="mt-4" onClick={begin} variant="grape">
                Start waiting
              </Button>
            </div>
          )}
          {phase === "waiting" && (
            <div className="w-full max-w-xs">
              <p className="font-display text-6xl font-bold tabular-nums">{Math.max(0, WAIT_SECONDS - Math.floor(elapsed))}</p>
              <div className="mt-3 h-4 overflow-hidden rounded-full border-2 border-ink bg-white">
                <div className="h-full bg-grape" style={{ width: `${pct * 100}%` }} />
              </div>
              <button onClick={grab} className="mt-4 rounded-xl border-2 border-ink bg-white px-4 py-2 text-sm font-bold">
                I give up — give me 1 ⭐
              </button>
            </div>
          )}
          {phase === "won" && (
            <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }}>
              <span className="text-6xl">⭐⭐⭐</span>
              <p className="mt-2 font-display text-2xl font-bold">You waited. You won 3 stars!</p>
              <p className="text-ink-soft">That&apos;s discipline: choosing what you want MOST over what you want NOW.</p>
              <Button className="mt-4" variant="white" onClick={begin}>
                <RotateCcw size={16} /> Again
              </Button>
            </motion.div>
          )}
          {phase === "grabbed" && (
            <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }}>
              <span className="text-6xl">⭐</span>
              <p className="mt-2 font-display text-2xl font-bold">Got you at {elapsed.toFixed(1)}s! Just 1 star.</p>
              <p className="text-ink-soft">Your phone, snacks and “just 5 more minutes” work exactly like this. Try again?</p>
              <Button className="mt-4" variant="grape" onClick={begin}>
                <RotateCcw size={16} /> Try again
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Game 2: Go / Stop ---------------- */

const ROUNDS = 20;
type Trial = { go: boolean; tapped: boolean; rt?: number };

function GoStop() {
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [show, setShow] = useState<null | boolean>(null); // null = blank, true = go, false = stop
  const [trials, setTrials] = useState<Trial[]>([]);
  const [flash, setFlash] = useState<"good" | "bad" | null>(null);
  const t = useRef<number | null>(null);
  const shownAt = useRef(0);
  const current = useRef<Trial | null>(null);
  const count = useRef(0);

  const clear = () => {
    if (t.current) window.clearTimeout(t.current);
  };
  useEffect(() => clear, []);

  const begin = () => {
    clear();
    count.current = 0;
    setTrials([]);
    setPhase("running");
    const step = () => {
      setShow(null);
      if (count.current >= ROUNDS) {
        setPhase("done");
        return;
      }
      t.current = window.setTimeout(() => {
        const go = Math.random() < 0.7;
        current.current = { go, tapped: false };
        shownAt.current = now();
        setShow(go);
        t.current = window.setTimeout(() => {
          const tr = current.current!;
          current.current = null;
          count.current += 1;
          setTrials((p) => [...p, tr]);
          if (tr.go && !tr.tapped) setFlash("bad");
          step();
        }, 750);
      }, rand(450, 1100));
    };
    step();
  };

  const tap = useCallback(() => {
    const tr = current.current;
    if (!tr) {
      setFlash("bad");
      return;
    }
    if (tr.tapped) return;
    tr.tapped = true;
    tr.rt = now() - shownAt.current;
    setFlash(tr.go ? "good" : "bad");
  }, []);

  useEffect(() => {
    if (phase !== "running") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        tap();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, tap]);

  useEffect(() => {
    if (!flash) return;
    const id = window.setTimeout(() => setFlash(null), 250);
    return () => window.clearTimeout(id);
  }, [flash]);

  const correct = trials.filter((x) => x.go === x.tapped).length;
  const stops = trials.filter((x) => !x.go);
  const held = stops.filter((x) => !x.tapped).length;
  const rts = trials.filter((x) => x.go && x.tapped && x.rt).map((x) => x.rt!);
  const avg = rts.length ? Math.round(rts.reduce((a, b) => a + b, 0) / rts.length) : 0;

  useEffect(() => {
    if (phase === "done" && correct >= ROUNDS - 2) celebrate("small");
  }, [phase, correct]);

  return (
    <div>
      <p className="text-ink-soft">
        Tap (or press <kbd className="rounded border border-ink/30 bg-white px-1">Space</kbd>) as fast as you can when you see{" "}
        <b className="text-teal">GREEN</b>. When you see <b className="text-coral">RED — STOP!</b> Don&apos;t tap. Your fingers will want to.
        That&apos;s the point.
      </p>
      <motion.button
        type="button"
        onClick={phase === "running" ? tap : begin}
        animate={flash === "bad" ? { x: [0, -8, 8, -4, 0] } : { x: 0 }}
        transition={{ type: "tween", duration: 0.25 }}
        className={`relative mt-5 grid h-72 w-full place-items-center overflow-hidden rounded-[1.75rem] border-2 border-ink transition-colors ${
          flash === "good" ? "bg-teal-soft" : flash === "bad" ? "bg-blush" : "bg-sky"
        }`}
        aria-label={phase === "running" ? "Tap on green" : "Start Go / Stop"}
      >
        {phase === "idle" && (
          <span>
            <span className="text-6xl">🚦</span>
            <span className="mt-2 block font-display text-xl font-bold">Tap to start · {ROUNDS} rounds</span>
          </span>
        )}
        {phase === "running" && (
          <>
            <span className="absolute top-3 right-4 font-display font-bold tabular-nums">
              {Math.min(trials.length + 1, ROUNDS)}/{ROUNDS}
            </span>
            <AnimatePresence mode="wait">
              {show !== null ? (
                <motion.span
                  key={trials.length}
                  initial={{ scale: 0.4 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className={`grid h-36 w-36 place-items-center rounded-full border-4 border-ink font-display text-2xl font-bold text-white ${
                    show ? "bg-teal" : "bg-coral"
                  }`}
                >
                  {show ? "GO" : "STOP"}
                </motion.span>
              ) : (
                <motion.span key="blank" className="font-display text-4xl text-ink/30">
                  +
                </motion.span>
              )}
            </AnimatePresence>
          </>
        )}
        {phase === "done" && (
          <span className="px-6">
            <span className="block font-display text-5xl font-bold">
              {correct}/{ROUNDS}
            </span>
            <span className="mt-1 block font-semibold">
              Stopped {held} of {stops.length} reds{avg ? ` · average reaction ${avg} ms` : ""}
            </span>
            <span className="mt-2 block text-ink-soft">
              {held === stops.length ? "Perfect brakes! 🛑 You control your impulses." : "Your “brakes” are a muscle. Every round makes them stronger."}
            </span>
            <span className="mt-3 inline-flex items-center gap-1 rounded-xl border-2 border-ink bg-white px-3 py-1.5 font-display text-sm font-bold">
              <RotateCcw size={14} /> Tap to play again
            </span>
          </span>
        )}
      </motion.button>
    </div>
  );
}

/* ---------------- Game 3: Easy or Right? ---------------- */

const CHOICES = [
  { q: "It's 9 pm. Homework is due tomorrow. Your friends are online.", easy: "Game “just for 10 minutes”", right: "Homework first, game after", fun: 2, future: 2 },
  { q: "Your alarm goes off at 6 am for your morning walk.", easy: "Snooze… and snooze again", right: "Feet on the floor right away", fun: 1, future: 2 },
  { q: "You have 20 free minutes on the bus.", easy: "Scroll short videos", right: "Read 7 pages of your book", fun: 2, future: 2 },
  { q: "Your friend asks you to bunk the extra class.", easy: "“Sure, let's go!”", right: "“Not today — after class?”", fun: 2, future: 3 },
  { q: "You got your exam marks back and they're low.", easy: "Hide the paper and forget it", right: "Check every mistake once", fun: 1, future: 3 },
  { q: "Your pocket money just arrived.", easy: "Spend it all today", right: "Save half for your goal", fun: 2, future: 2 },
  { q: "You promised yourself 30 minutes of practice.", easy: "“I'll do double tomorrow”", right: "Do 30 minutes, even badly", fun: 1, future: 3 },
  { q: "It's midnight. You're watching one more episode.", easy: "Autoplay the next one", right: "Phone down, sleep", fun: 2, future: 2 },
];

function EasyOrRight() {
  const [picks, setPicks] = useState<("easy" | "right")[]>([]);
  const i = picks.length;
  const done = i >= CHOICES.length;
  const fun = picks.reduce((a, p, k) => a + (p === "easy" ? CHOICES[k].fun : 0), 0);
  const future = picks.reduce((a, p, k) => a + (p === "right" ? CHOICES[k].future : -1), 0);
  const maxFuture = CHOICES.reduce((a, c) => a + c.future, 0);
  const rights = picks.filter((p) => p === "right").length;

  const pick = (p: "easy" | "right") => {
    const next = [...picks, p];
    if (next.length === CHOICES.length && next.filter((x) => x === "right").length >= 6) celebrate("small");
    setPicks(next);
  };

  return (
    <div>
      <p className="text-ink-soft">
        Eight everyday moments. Be honest — pick what you would <b className="text-ink">really</b> do. Watch what happens to “Fun right
        now” and “Future you”.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {[
          ["😄 Fun right now", fun, 16, "bg-coral"],
          ["🚀 Future you", Math.max(0, future), maxFuture, "bg-teal"],
        ].map(([label, v, max, c]) => (
          <div key={label as string}>
            <p className="text-sm font-bold">{label}</p>
            <div className="mt-1 h-4 overflow-hidden rounded-full border-2 border-ink bg-white">
              <motion.div className={`h-full ${c}`} animate={{ width: `${Math.min(1, (v as number) / (max as number)) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 min-h-56 rounded-[1.75rem] border-2 border-ink bg-mint p-5 sm:p-6">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <p className="text-sm font-bold text-ink-soft">
                Moment {i + 1} of {CHOICES.length}
              </p>
              <p className="mt-1 font-display text-2xl font-bold">{CHOICES[i].q}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {/* swap sides every other moment so the "right" answer isn't always in the same spot */}
                {(i % 2
                  ? ([["right", CHOICES[i].right], ["easy", CHOICES[i].easy]] as const)
                  : ([["easy", CHOICES[i].easy], ["right", CHOICES[i].right]] as const)
                ).map(([k, text]) => (
                    <button
                      key={k}
                      onClick={() => pick(k)}
                      className="rounded-2xl border-2 border-ink bg-white p-4 text-left font-semibold transition hover:-translate-y-1 hover:shadow-pop"
                    >
                      {text}
                    </button>
                  ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="end" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <p className="font-display text-3xl font-bold">
                You chose the right thing {rights} of {CHOICES.length} times.
              </p>
              <p className="mt-2 text-ink-soft">
                {rights >= 6
                  ? "Future you is going to say thank you. 🙌 Notice: the right choice was rarely the fun one in the moment."
                  : "Fun now felt good — but future you got left behind. Which ONE moment will you change this week?"}
              </p>
              <Button className="mt-4" variant="white" onClick={() => setPicks([])}>
                <RotateCcw size={16} /> Play again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------------- Section ---------------- */

const GAMES = [
  { id: "wait", label: "Wait for It", icon: Hourglass, sub: "Delayed rewards", el: <WaitForIt /> },
  { id: "go", label: "Go / Stop", icon: Hand, sub: "Impulse brakes", el: <GoStop /> },
  { id: "choice", label: "Easy or Right?", icon: Signpost, sub: "Daily choices", el: <EasyOrRight /> },
];

export function DisciplineGames() {
  const [tab, setTab] = useState(GAMES[0].id);
  const game = GAMES.find((g) => g.id === tab)!;
  return (
    <Stop
      id="discipline-games"
      stop={3}
      kicker="Discipline games"
      tone="sun"
      title={
        <>
          Train your <span className="text-grape">self-control</span> 🎮
        </>
      }
      intro="Discipline is a muscle. These three games each train a different part of it: waiting for something better, stopping yourself in time, and choosing right when easy is right there."
    >
      <Reveal>
        <div role="tablist" aria-label="Discipline games" className="grid gap-2 sm:grid-cols-3">
          {GAMES.map((g, k) => {
            const on = g.id === tab;
            return (
              <button
                key={g.id}
                role="tab"
                aria-selected={on}
                onClick={() => setTab(g.id)}
                className={`flex items-center gap-3 rounded-2xl border-2 border-ink p-3 text-left transition ${
                  on ? "-translate-y-1 bg-white shadow-pop" : "bg-white/50 hover:bg-white"
                }`}
              >
                <span className={`grid h-11 w-11 place-items-center rounded-xl border-2 border-ink ${on ? "bg-grape text-white" : "bg-cream"}`}>
                  <g.icon size={20} />
                </span>
                <span>
                  <span className="block text-xs font-bold text-ink-soft">GAME {k + 1}</span>
                  <span className="block font-display text-lg leading-tight font-bold">{g.label}</span>
                  <span className="block text-xs text-ink-soft">{g.sub}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div role="tabpanel" className="mt-6 rounded-[2rem] border-2 border-ink bg-white p-5 shadow-pop sm:p-7">
          <h3 className="mb-2 text-3xl font-bold">{game.label}</h3>
          {/* keyed so switching tabs resets the game cleanly */}
          <div key={game.id}>{game.el}</div>
        </div>
      </Reveal>
    </Stop>
  );
}
