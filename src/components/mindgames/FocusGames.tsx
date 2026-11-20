"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { celebrate } from "@/lib/celebrate";
import { Bar, Hud, ResultCard, Stage, StartCard, pick, randInt, shuffle, tone, type GameProps, now, chance } from "./kit";

/* ---------------- 1. Colour Clash (Focus) ---------------- */

const COLOURS = [
  { name: "RED", hex: "#d9345b" },
  { name: "BLUE", hex: "#2f7fc1" },
  { name: "GREEN", hex: "#3e9a2c" },
  { name: "YELLOW", hex: "#e0a800" },
] as const;
const CLASH_ROUNDS = 20;

export function ColourClash({ onDone }: GameProps) {
  const [phase, setPhase] = useState<"idle" | "play" | "done">("idle");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [card, setCard] = useState({ word: 0, ink: 1 });
  const [flash, setFlash] = useState<"good" | "bad" | null>(null);
  const started = useRef(0);
  const [secs, setSecs] = useState(0);

  const next = () => {
    const word = randInt(0, 3);
    let ink = randInt(0, 3);
    if (chance(0.8)) while (ink === word) ink = randInt(0, 3);
    setCard({ word, ink });
  };
  const begin = () => {
    setRound(0);
    setScore(0);
    started.current = now();
    setPhase("play");
    next();
  };
  const answer = (i: number) => {
    const ok = i === card.ink;
    setFlash(ok ? "good" : "bad");
    window.setTimeout(() => setFlash(null), 180);
    const s = score + (ok ? 1 : 0);
    setScore(s);
    if (round + 1 >= CLASH_ROUNDS) {
      const t = (now() - started.current) / 1000;
      setSecs(t);
      setPhase("done");
      if (s >= 17) celebrate();
      onDone(`${s}/${CLASH_ROUNDS} in ${t.toFixed(1)}s`);
    } else {
      setRound(round + 1);
      next();
    }
  };

  return (
    <Stage className={flash === "good" ? "bg-teal-soft" : flash === "bad" ? "bg-blush" : ""}>
      {phase === "idle" && (
        <StartCard emoji="🎨" title="Tap the INK colour" onStart={begin}>
          If you see <b style={{ color: COLOURS[1].hex }}>RED</b>, the answer is <b>BLUE</b>. Ignore what the word says!
        </StartCard>
      )}
      {phase === "play" && (
        <>
          <Hud items={[["Round", `${round + 1}/${CLASH_ROUNDS}`], ["Score", score]]} />
          <motion.p
            key={round}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-display text-6xl font-bold sm:text-8xl"
            style={{ color: COLOURS[card.ink].hex }}
          >
            {COLOURS[card.word].name}
          </motion.p>
          <div className="mt-8 grid w-full max-w-md grid-cols-2 gap-3">
            {COLOURS.map((c, i) => (
              <button
                key={c.name}
                onClick={() => answer(i)}
                className="btn-pop rounded-2xl border-2 border-ink bg-white py-4 font-display text-xl font-bold text-ink"
              >
                {c.name}
              </button>
            ))}
          </div>
        </>
      )}
      {phase === "done" && (
        <ResultCard emoji={score >= 17 ? "🎯" : "🌀"} title={`${score} / ${CLASH_ROUNDS} in ${secs.toFixed(1)}s`} onAgain={begin}>
          {score >= 17
            ? "Laser focus! You ignored the loud word and saw what really mattered."
            : "Your brain reads words automatically — that's why it's hard. Slow down a little and try again."}
        </ResultCard>
      )}
    </Stage>
  );
}

/* ---------------- 2. Flash Grid (Memory) ---------------- */

export function FlashGrid({ onDone }: GameProps) {
  const [phase, setPhase] = useState<"idle" | "show" | "input" | "over">("idle");
  const [level, setLevel] = useState(1);
  const [target, setTarget] = useState<number[]>([]);
  const [picked, setPicked] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number | null>(null);
  const timer = useRef<number | null>(null);
  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  const size = level >= 6 ? 5 : 4;
  const startLevel = (lv: number) => {
    const n = lv >= 6 ? 25 : 16;
    const t = shuffle([...Array(n).keys()]).slice(0, lv + 2);
    setLevel(lv);
    setTarget(t);
    setPicked([]);
    setWrong(null);
    setPhase("show");
    timer.current = window.setTimeout(() => setPhase("input"), 1100 + lv * 120);
  };
  const tap = (i: number) => {
    if (phase !== "input" || picked.includes(i)) return;
    if (!target.includes(i)) {
      setWrong(i);
      setPhase("over");
      onDone(`reached level ${level}`);
      return;
    }
    const p = [...picked, i];
    setPicked(p);
    if (p.length === target.length) {
      if (level >= 5) celebrate();
      timer.current = window.setTimeout(() => startLevel(level + 1), 600);
    }
  };

  return (
    <Stage>
      {phase === "idle" && (
        <StartCard emoji="🧩" title="Remember the glowing tiles" onStart={() => startLevel(1)}>
          Tip: don&apos;t remember each tile — see the <b>shape</b> they make.
        </StartCard>
      )}
      {phase !== "idle" && (
        <>
          <Hud items={[["Level", level], ["Tiles", target.length]]} />
          <p className="mt-8 mb-4 font-display text-lg font-bold">
            {phase === "show" ? "👀 Memorise…" : phase === "input" ? `Tap the tiles (${picked.length}/${target.length})` : "Oops!"}
          </p>
          <div className="grid w-full max-w-xs gap-2" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
            {[...Array(size * size).keys()].map((i) => {
              const lit = (phase === "show" && target.includes(i)) || picked.includes(i) || (phase === "over" && target.includes(i));
              return (
                <button
                  key={i}
                  onClick={() => tap(i)}
                  aria-label={`tile ${i + 1}`}
                  className={`aspect-square rounded-xl border-2 border-ink transition-colors ${
                    wrong === i ? "bg-berry" : lit ? (phase === "over" && !picked.includes(i) ? "bg-sun/60" : "bg-sky-deep") : "bg-white hover:bg-sky"
                  }`}
                />
              );
            })}
          </div>
          {phase === "over" && (
            <div className="mt-5">
              <p className="font-display text-xl font-bold">You reached level {level}! 🧠</p>
              <p className="text-sm text-ink-soft">Most people hold about 7 things at once. Chunking beats that limit.</p>
              <button onClick={() => startLevel(1)} className="btn-pop mt-3 rounded-2xl border-2 border-ink bg-white px-4 py-2 font-display font-semibold">
                Play again
              </button>
            </div>
          )}
        </>
      )}
    </Stage>
  );
}

/* ---------------- 3. Echo Chain (Concentration) ---------------- */

const PADS = [
  { bg: "bg-coral", lit: "bg-[#ffb59c]", f: 330 },
  { bg: "bg-sky-deep", lit: "bg-[#8cc4f0]", f: 392 },
  { bg: "bg-teal", lit: "bg-[#7fe0cf]", f: 494 },
  { bg: "bg-sun", lit: "bg-[#fff0a8]", f: 587 },
];

export function EchoChain({ onDone }: GameProps) {
  const [phase, setPhase] = useState<"idle" | "watch" | "input" | "over">("idle");
  const [seq, setSeq] = useState<number[]>([]);
  const [step, setStep] = useState(0);
  const [lit, setLit] = useState<number | null>(null);
  const timers = useRef<number[]>([]);
  const clear = () => { timers.current.forEach((t) => window.clearTimeout(t)); timers.current = []; };
  useEffect(() => clear, []);

  const play = (s: number[]) => {
    clear();
    setPhase("watch");
    const gap = Math.max(380, 650 - s.length * 20);
    s.forEach((p, i) => {
      timers.current.push(
        window.setTimeout(() => { setLit(p); tone(PADS[p].f, gap * 0.7); }, 500 + i * gap),
        window.setTimeout(() => setLit(null), 500 + i * gap + gap * 0.65),
      );
    });
    timers.current.push(window.setTimeout(() => { setStep(0); setPhase("input"); }, 500 + s.length * gap));
  };
  const begin = () => { const s = [randInt(0, 3)]; setSeq(s); play(s); };
  const press = (p: number) => {
    if (phase !== "input") return;
    tone(PADS[p].f, 220);
    setLit(p);
    timers.current.push(window.setTimeout(() => setLit(null), 180));
    if (p !== seq[step]) {
      tone(140, 500);
      setPhase("over");
      onDone(`chain of ${seq.length - 1}`);
      return;
    }
    if (step + 1 === seq.length) {
      const s = [...seq, randInt(0, 3)];
      setSeq(s);
      if (s.length === 9) celebrate();
      timers.current.push(window.setTimeout(() => play(s), 700));
    } else setStep(step + 1);
  };

  return (
    <Stage>
      {phase === "idle" && (
        <StartCard emoji="🔔" title="Watch, listen, repeat" onStart={begin}>
          Turn the sound on. Each round adds one more bell to the chain.
        </StartCard>
      )}
      {phase !== "idle" && (
        <>
          <Hud items={[["Chain", seq.length], ["", phase === "watch" ? "👀 Watch" : phase === "input" ? "👆 Your turn" : "🔚"]]} />
          <div className="mt-8 grid w-64 grid-cols-2 gap-3 sm:w-72">
            {PADS.map((p, i) => (
              <button
                key={i}
                onClick={() => press(i)}
                aria-label={`bell ${i + 1}`}
                className={`aspect-square rounded-3xl border-2 border-ink transition-all ${lit === i ? `${p.lit} scale-95 shadow-[0_0_30px_rgba(255,255,255,0.9)]` : p.bg}`}
              />
            ))}
          </div>
          {phase === "over" && (
            <div className="mt-5">
              <p className="font-display text-xl font-bold">You held a chain of {seq.length - 1}! 🔗</p>
              <p className="text-sm text-ink-soft">Every link needed your full attention. That&apos;s concentration.</p>
              <button onClick={begin} className="btn-pop mt-3 rounded-2xl border-2 border-ink bg-white px-4 py-2 font-display font-semibold">
                Play again
              </button>
            </div>
          )}
        </>
      )}
    </Stage>
  );
}

/* ---------------- 6. Spot the Change (Observation) ---------------- */

const POOL = ["🍎", "🚗", "🐱", "⚽", "🌵", "🎸", "📚", "🦋", "🍕", "🚀", "🐢", "🌙", "🎈", "🔑", "🧢", "🍩", "🐝", "🌻", "⏰", "🎲", "🐙", "🍉", "✏️", "🦊", "🧸", "🚲", "🍔", "🐧", "🌈", "🎁"];
const SPOT_ROUNDS = 6;

export function SpotTheChange({ onDone }: GameProps) {
  const [phase, setPhase] = useState<"idle" | "study" | "blank" | "find" | "reveal" | "done">("idle");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [grid, setGrid] = useState<string[]>([]);
  const [changed, setChanged] = useState({ i: 0, to: "" });
  const [tapped, setTapped] = useState<number | null>(null);
  const [left, setLeft] = useState(0);
  const timers = useRef<number[]>([]);
  const clear = () => { timers.current.forEach((t) => window.clearTimeout(t)); timers.current = []; };
  useEffect(() => clear, []);

  const studyMs = (r: number) => Math.max(2500, 5000 - r * 450);
  const startRound = (r: number) => {
    clear();
    const n = r >= 3 ? 20 : 16;
    const items = shuffle(POOL);
    const g = items.slice(0, n);
    const to = pick(items.slice(n));
    setGrid(g);
    setChanged({ i: randInt(0, n - 1), to });
    setTapped(null);
    setRound(r);
    setPhase("study");
    const ms = studyMs(r);
    setLeft(ms);
    const t0 = now();
    const iv = window.setInterval(() => setLeft(ms - (now() - t0)), 100);
    timers.current.push(
      window.setTimeout(() => { window.clearInterval(iv); setPhase("blank"); }, ms),
      window.setTimeout(() => setPhase("find"), ms + 700),
    );
    timers.current.push(iv as unknown as number);
  };
  const tap = (i: number) => {
    if (phase !== "find") return;
    setTapped(i);
    const ok = i === changed.i;
    const s = score + (ok ? 1 : 0);
    setScore(s);
    setPhase("reveal");
    timers.current.push(
      window.setTimeout(() => {
        if (round + 1 >= SPOT_ROUNDS) {
          setPhase("done");
          if (s >= 5) celebrate();
          onDone(`${s}/${SPOT_ROUNDS} spotted`);
        } else startRound(round + 1);
      }, 1400),
    );
  };
  const begin = () => { setScore(0); startRound(0); };
  const cols = grid.length === 20 ? 5 : 4;

  return (
    <Stage>
      {phase === "idle" && (
        <StartCard emoji="🔍" title="Study, blink, spot" onStart={begin}>
          Memorise the grid. It vanishes for a moment and <b>one picture changes</b>. Find it!
        </StartCard>
      )}
      {phase !== "idle" && phase !== "done" && (
        <>
          <Hud items={[["Round", `${round + 1}/${SPOT_ROUNDS}`], ["Spotted", score]]} />
          <p className="mt-8 mb-3 font-display text-lg font-bold">
            {phase === "study" ? "👀 Study the grid" : phase === "blank" ? "😑 Blink…" : phase === "find" ? "What changed? Tap it!" : tapped === changed.i ? "✅ Sharp eyes!" : "❌ It was this one"}
          </p>
          {phase === "study" && <div className="mb-3 w-full max-w-xs"><Bar pct={left / studyMs(round)} className="bg-teal" /></div>}
          <div className="grid w-full max-w-sm gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {grid.map((e, i) => {
              const show = phase === "study" ? e : phase === "blank" ? "" : i === changed.i ? changed.to : e;
              const hl = phase === "reveal" && i === changed.i ? "bg-sun" : phase === "reveal" && i === tapped ? "bg-blush" : "bg-white";
              return (
                <button key={i} onClick={() => tap(i)} className={`grid aspect-square place-items-center rounded-xl border-2 border-ink text-3xl ${hl}`}>
                  {show}
                </button>
              );
            })}
          </div>
        </>
      )}
      {phase === "done" && (
        <ResultCard emoji={score >= 5 ? "🦉" : "👓"} title={`You spotted ${score} of ${SPOT_ROUNDS}`} onAgain={begin}>
          {score >= 5 ? "Owl eyes! You observed on purpose." : "Try scanning row by row next time instead of looking everywhere at once."}
        </ResultCard>
      )}
    </Stage>
  );
}
