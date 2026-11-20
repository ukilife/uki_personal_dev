"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Minus, Plus, RotateCcw, Users } from "lucide-react";
import { Button } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";
import { Hud, ResultCard, Stage, StartCard, pick, shuffle, tone, type GameProps, now, chance } from "./kit";

/* ---------------- 11. Breathe Bubble (Calm) ---------------- */

const BOX = [
  { label: "Breathe in", scale: 1, secs: 4 },
  { label: "Hold", scale: 1, secs: 4 },
  { label: "Breathe out", scale: 0.45, secs: 4 },
  { label: "Hold", scale: 0.45, secs: 4 },
];
const BREATH_ROUNDS = 4;

function MoodScale({ value, set, label }: { value: number | null; set: (n: number) => void; label: string }) {
  return (
    <div>
      <p className="text-sm font-bold">{label}</p>
      <div className="mt-1 flex justify-center gap-1">
        {["😣", "😕", "😐", "🙂", "😌"].map((e, i) => (
          <button key={e} onClick={() => set(i)} className={`h-11 w-11 rounded-xl border-2 text-2xl ${value === i ? "border-ink bg-sun" : "border-transparent bg-white"}`}>
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}

export function BreatheBubble({ onDone }: GameProps) {
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0); // seconds since start
  const [done, setDone] = useState(false);
  const [before, setBefore] = useState<number | null>(null);
  const [after, setAfter] = useState<number | null>(null);

  const total = BREATH_ROUNDS * 16;
  useEffect(() => {
    if (!running) return;
    const t0 = now();
    const iv = window.setInterval(() => {
      const s = Math.floor((now() - t0) / 1000);
      setTick(s);
      if (s >= total) {
        window.clearInterval(iv);
        setRunning(false);
        setDone(true);
        tone(523, 900);
        onDone("4 rounds of box breathing");
      }
    }, 200);
    return () => window.clearInterval(iv);
  }, [running, total, onDone]);

  const inCycle = tick % 16;
  const phaseIdx = Math.min(3, Math.floor(inCycle / 4));
  const phase = BOX[phaseIdx];
  const count = 4 - (inCycle % 4);
  const round = Math.min(BREATH_ROUNDS, Math.floor(tick / 16) + 1);

  return (
    <Stage className="bg-sky">
      {!running && !done && (
        <div className="max-w-md">
          <span className="text-6xl">🫧</span>
          <p className="mt-2 font-display text-2xl font-bold">One minute to reset your brain</p>
          <p className="mt-2 text-ink-soft">Sit tall, feet on the floor. Breathe with the bubble: in for 4, hold for 4, out for 4, hold for 4.</p>
          <div className="mt-4"><MoodScale value={before} set={setBefore} label="How do you feel right now?" /></div>
          <Button className="mt-5" variant="teal" onClick={() => { setTick(0); setRunning(true); }}>Begin breathing</Button>
        </div>
      )}
      {running && (
        <>
          <Hud items={[["Round", `${round}/${BREATH_ROUNDS}`], ["", `${total - tick}s`]]} />
          <div className="relative grid h-72 w-72 place-items-center">
            <motion.div
              animate={{ scale: phase.scale }}
              transition={{ duration: phase.label === "Hold" ? 0.2 : 4, ease: "easeInOut" }}
              className="absolute h-64 w-64 rounded-full border-4 border-white bg-gradient-to-br from-teal/70 to-sky-deep/70 shadow-[0_0_60px_rgba(47,127,193,0.5)]"
            />
            <div className="relative text-white">
              <p className="font-display text-3xl font-bold drop-shadow">{phase.label}</p>
              <p className="font-display text-6xl font-bold drop-shadow">{count}</p>
            </div>
          </div>
          <button onClick={() => setRunning(false)} className="mt-2 text-sm font-semibold text-ink-soft underline">Stop</button>
        </>
      )}
      {done && (
        <div className="max-w-md">
          <span className="text-6xl">😌</span>
          <p className="mt-2 font-display text-2xl font-bold">Well done. Notice how you feel.</p>
          <div className="mt-4"><MoodScale value={after} set={setAfter} label="How do you feel now?" /></div>
          {before !== null && after !== null && (
            <p className="mt-3 font-semibold">{after > before ? "You calmed yourself down in one minute — that's a superpower you can use anywhere." : "Calm takes practice. Try it before your next test."}</p>
          )}
          <Button className="mt-4" variant="white" onClick={() => { setDone(false); setAfter(null); }}><RotateCcw size={16} /> Again</Button>
        </div>
      )}
    </Stage>
  );
}

/* ---------------- 12. Ten-Second Sense (Patience) ---------------- */

export function TenSecondSense({ onDone }: GameProps) {
  const [phase, setPhase] = useState<"idle" | "visible" | "hidden" | "result">("idle");
  const [shown, setShown] = useState(0);
  const [result, setResult] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const t0 = useRef(0);

  useEffect(() => {
    if (phase !== "visible") return;
    const iv = window.setInterval(() => {
      const s = (now() - t0.current) / 1000;
      setShown(s);
      if (s >= 3) setPhase("hidden");
    }, 30);
    return () => window.clearInterval(iv);
  }, [phase]);

  const begin = () => { t0.current = now(); setShown(0); setPhase("visible"); };
  const stop = () => {
    const s = (now() - t0.current) / 1000;
    setResult(s);
    const h = [...history, s];
    setHistory(h);
    setPhase("result");
    if (Math.abs(s - 10) <= 0.3) celebrate();
    onDone(`stopped at ${s.toFixed(2)}s`);
  };
  const diff = result - 10;

  return (
    <Stage>
      {phase === "idle" && (
        <StartCard emoji="⏱️" title="Stop at exactly 10.00 seconds" onStart={begin}>
          You&apos;ll see the timer for 3 seconds, then it hides. Keep counting in your head and press Stop at 10.
        </StartCard>
      )}
      {(phase === "visible" || phase === "hidden") && (
        <>
          <p className="font-display text-8xl font-bold tabular-nums">{phase === "visible" ? shown.toFixed(2) : "?.??"}</p>
          <p className="mt-2 text-ink-soft">{phase === "hidden" ? "Keep counting… stay patient…" : "Watch the rhythm…"}</p>
          <Button className="mt-6 px-10 py-5 text-2xl" variant="coral" onClick={stop}>STOP</Button>
        </>
      )}
      {phase === "result" && (
        <ResultCard
          emoji={Math.abs(diff) <= 0.3 ? "🎯" : diff < 0 ? "🐇" : "🐢"}
          title={<span className="tabular-nums">{result.toFixed(2)} seconds</span>}
          onAgain={begin}
        >
          {Math.abs(diff) <= 0.3
            ? "Incredible patience! Your inner clock is steady."
            : diff < 0
              ? `${Math.abs(diff).toFixed(2)}s too early. Your brain wanted to rush — most people do!`
              : `${diff.toFixed(2)}s too late. You held on a little long.`}
          {history.length > 1 && <p className="mt-2 text-sm">Your tries: {history.map((h) => h.toFixed(2)).join(" · ")}</p>}
        </ResultCard>
      )}
    </Stage>
  );
}

/* ---------------- 13. Captain Says (Self-control) ---------------- */

const ACTIONS = [
  { id: "star", label: "⭐ Star", cmd: "tap the STAR" },
  { id: "heart", label: "❤️ Heart", cmd: "tap the HEART" },
  { id: "moon", label: "🌙 Moon", cmd: "tap the MOON" },
  { id: "sun", label: "☀️ Sun", cmd: "tap the SUN" },
] as const;
const CAPTAIN_ROUNDS = 16;
type Order = { action: (typeof ACTIONS)[number]; captain: boolean; prefix: string };

export function CaptainSays({ onDone }: GameProps) {
  const [phase, setPhase] = useState<"idle" | "play" | "done">("idle");
  const [order, setOrder] = useState<Order | null>(null);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const answered = useRef(false);
  const timer = useRef<number | null>(null);
  const scoreRef = useRef(0);
  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  const showOrder = (r: number) => {
    if (r >= CAPTAIN_ROUNDS) {
      setPhase("done");
      setOrder(null);
      if (scoreRef.current >= 14) celebrate();
      onDone(`${scoreRef.current}/${CAPTAIN_ROUNDS} correct`);
      return;
    }
    const captain = chance(0.55);
    const prefix = captain ? "Captain says" : pick(["Quick!", "Now", "Please", "Go —", "Captain wants you to", "Everyone"]);
    setOrder({ action: pick(ACTIONS), captain, prefix });
    setRound(r);
    setFeedback(null);
    answered.current = false;
    const ms = Math.max(1300, 2200 - r * 50);
    timer.current = window.setTimeout(() => {
      if (!answered.current) {
        // no tap: correct only if the captain did NOT say so
        settle(!captain, captain ? "⏰ Too slow — the Captain said it!" : "🧊 Perfect freeze!");
      }
      timer.current = window.setTimeout(() => showOrder(r + 1), 700);
    }, ms);
  };
  const settle = (ok: boolean, msg: string) => {
    answered.current = true;
    if (ok) { scoreRef.current += 1; setScore(scoreRef.current); }
    setFeedback(msg);
  };
  const begin = () => { scoreRef.current = 0; setScore(0); setPhase("play"); showOrder(0); };
  const tap = (id: string) => {
    if (!order || answered.current) return;
    if (!order.captain) settle(false, "😬 The Captain didn't say!");
    else if (id !== order.action.id) settle(false, "❌ Wrong button");
    else settle(true, "✅ Yes, Captain!");
  };

  return (
    <Stage className={feedback?.startsWith("✅") || feedback?.startsWith("🧊") ? "bg-teal-soft" : feedback ? "bg-blush" : ""}>
      {phase === "idle" && (
        <StartCard emoji="🧑‍✈️" title="Only obey the Captain" onStart={begin}>
          Tap the button ONLY when the command starts with <b>“Captain says”</b>. Anything else — <b>freeze</b> and don&apos;t touch!
        </StartCard>
      )}
      {phase === "play" && order && (
        <>
          <Hud items={[["Order", `${round + 1}/${CAPTAIN_ROUNDS}`], ["Score", score]]} />
          <motion.p key={round} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-8 font-display text-3xl font-bold sm:text-5xl">
            {order.prefix} {order.action.cmd}!
          </motion.p>
          <p className="mt-2 h-7 font-display text-xl font-bold">{feedback}</p>
          <div className="mt-4 grid w-full max-w-md grid-cols-2 gap-3">
            {ACTIONS.map((a) => (
              <button key={a.id} onClick={() => tap(a.id)} className="btn-pop rounded-2xl border-2 border-ink bg-white py-4 font-display text-xl font-bold">
                {a.label}
              </button>
            ))}
          </div>
        </>
      )}
      {phase === "done" && (
        <ResultCard emoji={score >= 14 ? "🎖️" : "🧑‍✈️"} title={`${score} / ${CAPTAIN_ROUNDS} correct`} onAgain={begin}>
          The hard part wasn&apos;t tapping — it was <b>not</b> tapping. That pause before you act is self-control.
        </ResultCard>
      )}
    </Stage>
  );
}

/* ---------------- 18. Fork in the Road (Decision making) ---------------- */

const DILEMMAS = [
  {
    s: "It's 8 pm. You have a test tomorrow. Your friends invite you to an online game for 'just one hour'.",
    a: { t: "Play the game", now: "Fun for an hour 🎮", later: "One hour becomes three. You sleep late and blank in the test 😵" },
    b: { t: "Study first, play after", now: "Boring for a bit 📚", later: "You feel ready, sleep well, and still get 20 minutes of play 😎" },
  },
  {
    s: "You broke a friend's pencil case by accident. Nobody saw it.",
    a: { t: "Say nothing", now: "No awkward talk 😶", later: "Your friend blames someone else. You feel guilty every time you see it 😞" },
    b: { t: "Tell them and say sorry", now: "Awkward for a minute 😬", later: "They trust you more. You might even fix it together 🤝" },
  },
  {
    s: "A classmate offers you the answers to tomorrow's homework.",
    a: { t: "Copy them", now: "Homework done in 5 minutes ⚡", later: "In the exam, there's no one to copy from. You never learned it 📉" },
    b: { t: "Do it yourself, ask for help", now: "Takes 40 minutes 🕒", later: "You understand it, and the exam feels easier 📈" },
  },
  {
    s: "You're nervous about speaking at assembly. You could say you're sick.",
    a: { t: "Say you're sick", now: "Relief! No stage today 😮‍💨", later: "The fear grows bigger next time. You missed a chance to grow 🫥" },
    b: { t: "Do it, even nervous", now: "Shaky hands, fast heart 😰", later: "You did it! Next time is easier. Courage grows by using it 🦁" },
  },
  {
    s: "Someone in your group is being left out of every conversation.",
    a: { t: "Not my problem", now: "Nothing changes for you 🤷", later: "They feel invisible. The group becomes a place where anyone could be next 😔" },
    b: { t: "Invite them in", now: "A little uncomfortable 🙂", later: "You made someone's whole week better — and gained a friend 💛" },
  },
  {
    s: "You got your pocket money. There's a snack you want now, or you could save toward a bigger goal.",
    a: { t: "Spend it now", now: "Tasty! 🍫", later: "Gone in 5 minutes. The big goal feels far away 💸" },
    b: { t: "Save most, enjoy a little", now: "Slightly less fun today 🙃", later: "A few weeks later, you reach your goal 🎯" },
  },
];

export function ForkInTheRoad({ onDone }: GameProps) {
  const [order] = useState(() => shuffle(DILEMMAS));
  const [i, setI] = useState(0);
  const [choice, setChoice] = useState<"a" | "b" | null>(null);
  const [votes, setVotes] = useState({ a: 0, b: 0 });
  const [count, setCount] = useState(0);
  const d = order[i % order.length];
  const opts = (["a", "b"] as const);

  const pickPath = (k: "a" | "b") => {
    setChoice(k);
    const c = count + 1;
    setCount(c);
    if (c === 3) onDone(`${c} decisions explored`);
  };
  const next = () => { setI(i + 1); setChoice(null); setVotes({ a: 0, b: 0 }); };

  return (
    <Stage className="!justify-start">
      <Hud items={[["Situation", `${(i % order.length) + 1}/${order.length}`], ["", "Think: now AND later"]]} />
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-12 w-full max-w-3xl">
          <p className="font-display text-2xl leading-snug font-bold sm:text-3xl">{d.s}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {opts.map((k) => {
              const o = d[k];
              const chosen = choice === k;
              return (
                <div key={k} className={`rounded-3xl border-2 border-ink p-4 text-left transition ${chosen ? "bg-sun-soft" : choice ? "bg-white/60" : "bg-white"}`}>
                  <p className="font-display text-xl font-bold">{k === "a" ? "🅰️" : "🅱️"} {o.t}</p>
                  {!choice && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs font-bold text-ink-soft"><Users size={14} className="inline" /> Class votes</span>
                      <button onClick={() => setVotes({ ...votes, [k]: Math.max(0, votes[k] - 1) })} className="grid h-7 w-7 place-items-center rounded-lg border-2 border-ink bg-white"><Minus size={14} /></button>
                      <span className="w-6 text-center font-bold tabular-nums">{votes[k]}</span>
                      <button onClick={() => setVotes({ ...votes, [k]: votes[k] + 1 })} className="grid h-7 w-7 place-items-center rounded-lg border-2 border-ink bg-white"><Plus size={14} /></button>
                    </div>
                  )}
                  {choice ? (
                    <div className="mt-3 space-y-2 text-sm">
                      <p><b>Right now:</b> {o.now}</p>
                      <p><b>Later:</b> {o.later}</p>
                    </div>
                  ) : (
                    <Button className="mt-3 w-full" variant={k === "a" ? "coral" : "teal"} onClick={() => pickPath(k)}>Choose this path</Button>
                  )}
                </div>
              );
            })}
          </div>
          {choice && (
            <div className="mt-5 text-center">
              <p className="font-semibold text-ink-soft">Both paths are shown so you can compare. Which one would your future self thank you for?</p>
              <Button className="mt-3" variant="grape" onClick={next}>Next situation <ArrowRight size={16} /></Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </Stage>
  );
}

/* ---------------- 19. Count to Twenty (Teamwork) ---------------- */

export function CountToTwenty({ onDone }: GameProps) {
  const [n, setN] = useState(0);
  const [best, setBest] = useState(0);
  const [attempts, setAttempts] = useState(1);
  const [clash, setClash] = useState(false);
  const [won, setWon] = useState(false);
  const GOAL = 20;

  const up = () => {
    if (won) return;
    const v = n + 1;
    setN(v);
    tone(300 + v * 25, 150);
    if (v > best) setBest(v);
    if (v >= GOAL) {
      setWon(true);
      celebrate("big");
      onDone(`counted to ${GOAL} in ${attempts} attempt${attempts > 1 ? "s" : ""}`);
    }
  };
  const boom = () => {
    if (won) return;
    tone(140, 500);
    setClash(true);
    window.setTimeout(() => setClash(false), 900);
    setN(0);
    setAttempts(attempts + 1);
  };
  const reset = () => { setN(0); setBest(0); setAttempts(1); setWon(false); };

  return (
    <Stage className={clash ? "bg-blush" : won ? "bg-teal-soft" : "bg-sun-soft"}>
      <Hud items={[["Attempt", attempts], ["Best", best]]} />
      <p className="mt-8 max-w-xl text-ink-soft">
        Everyone stands. Anyone can say the next number — but if <b>two people speak at once</b>, back to 1! No pointing, no order, no plan. Teacher taps the buttons.
      </p>
      <AnimatePresence mode="popLayout">
        <motion.p
          key={`${n}-${attempts}`}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.6, opacity: 0 }}
          className="my-4 font-display text-[8rem] leading-none font-bold tabular-nums sm:text-[10rem]"
        >
          {clash ? "💥" : n}
        </motion.p>
      </AnimatePresence>
      <div className="mb-4 flex w-full max-w-md gap-1">
        {[...Array(GOAL)].map((_, i) => (
          <span key={i} className={`h-3 flex-1 rounded-full border border-ink/40 ${i < n ? "bg-teal" : "bg-white"}`} />
        ))}
      </div>
      {won ? (
        <div>
          <p className="font-display text-2xl font-bold">🎉 The whole class did it together!</p>
          <Button className="mt-3" variant="white" onClick={reset}><RotateCcw size={16} /> Play again</Button>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="teal" className="px-8 py-4 text-xl" onClick={up}><Plus size={20} /> Next number</Button>
          <Button variant="coral" className="px-8 py-4 text-xl" onClick={boom}>💥 Clash! Restart</Button>
        </div>
      )}
      <p className="mt-4 text-xs text-ink-soft">Shortcut idea: quiet students often save the game by waiting for the right moment.</p>
    </Stage>
  );
}
