"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Lightbulb, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";
import { Bar, Hud, ResultCard, Stage, StartCard, pick, rand, randInt, shuffle, type GameProps, now } from "./kit";

/* ---------------- 7. Pattern Breaker (Logical thinking) ---------------- */

type Pattern = { terms: (number | string)[]; answer: number | string; rule: string };

function makePattern(level: number): Pattern {
  const kinds = level < 2 ? ["add", "sub"] : level < 4 ? ["add", "mul", "alt", "sub"] : ["mul", "alt", "square", "fib", "grow", "shape"];
  const k = pick(kinds);
  switch (k) {
    case "add": {
      const a = randInt(1, 20), d = randInt(2, 9);
      return { terms: [0, 1, 2, 3, 4].map((i) => a + i * d), answer: a + 5 * d, rule: `Add ${d} each time` };
    }
    case "sub": {
      const d = randInt(2, 8), a = randInt(40, 70);
      return { terms: [0, 1, 2, 3, 4].map((i) => a - i * d), answer: a - 5 * d, rule: `Subtract ${d} each time` };
    }
    case "mul": {
      const a = randInt(1, 4), r = pick([2, 3]);
      return { terms: [0, 1, 2, 3, 4].map((i) => a * r ** i), answer: a * r ** 5, rule: `Multiply by ${r} each time` };
    }
    case "alt": {
      const a = randInt(1, 10), p = randInt(3, 9), q = randInt(1, 4);
      const t = [a];
      for (let i = 1; i < 6; i++) t.push(t[i - 1] + (i % 2 ? p : -q));
      return { terms: t.slice(0, 5), answer: t[5], rule: `Add ${p}, subtract ${q}, repeat` };
    }
    case "square": {
      const s = randInt(1, 4);
      return { terms: [0, 1, 2, 3, 4].map((i) => (s + i) ** 2), answer: (s + 5) ** 2, rule: "Square numbers: 1×1, 2×2, 3×3…" };
    }
    case "fib": {
      const t = [randInt(1, 3), randInt(1, 4)];
      for (let i = 2; i < 6; i++) t.push(t[i - 1] + t[i - 2]);
      return { terms: t.slice(0, 5), answer: t[5], rule: "Add the two numbers before" };
    }
    case "grow": {
      const a = randInt(1, 10);
      const t = [a];
      for (let i = 1; i < 6; i++) t.push(t[i - 1] + i);
      return { terms: t.slice(0, 5), answer: t[5], rule: "Add 1, then 2, then 3… the jump grows" };
    }
    default: {
      const set = pick([["🔺", "🔵", "🔵"], ["⭐", "⭐", "🌙"], ["🟥", "🟨", "🟩"], ["🍎", "🍌", "🍎", "🍇"]]);
      const t = [...Array(6).keys()].map((i) => set[i % set.length]);
      return { terms: t.slice(0, 5), answer: t[5], rule: `The group ${set.join(" ")} repeats` };
    }
  }
}

function optionsFor(p: Pattern): (number | string)[] {
  if (typeof p.answer === "string") {
    const seen = Array.from(new Set(p.terms.map(String))).filter((x) => x !== p.answer);
    const extra = shuffle(["🔺", "🔵", "⭐", "🌙", "🟥", "🟨", "🟩", "🍎", "🍌", "🍇"]).filter((x) => x !== p.answer && !seen.includes(x));
    return shuffle([p.answer, ...[...seen, ...extra].slice(0, 3)]);
  }
  const a = p.answer;
  const set = new Set<number>([a]);
  const deltas = shuffle([1, -1, 2, -2, 3, 4, -3, 5, 10, -5]);
  for (const d of deltas) {
    if (set.size >= 4) break;
    set.add(a + d);
  }
  return shuffle([...set]);
}

const PATTERN_ROUNDS = 8;

export function PatternBreaker({ onDone }: GameProps) {
  const [round, setRound] = useState(-1);
  const [score, setScore] = useState(0);
  const [p, setP] = useState<Pattern | null>(null);
  const [opts, setOpts] = useState<(number | string)[]>([]);
  const [chosen, setChosen] = useState<number | string | null>(null);

  const load = (r: number) => {
    const np = makePattern(r);
    setP(np);
    setOpts(optionsFor(np));
    setChosen(null);
    setRound(r);
  };
  const begin = () => { setScore(0); load(0); };
  const choose = (o: number | string) => {
    if (chosen !== null || !p) return;
    setChosen(o);
    if (o === p.answer) setScore((s) => s + 1);
  };
  const next = () => {
    if (round + 1 >= PATTERN_ROUNDS) {
      setRound(PATTERN_ROUNDS);
      if (score >= 6) celebrate();
      onDone(`${score}/${PATTERN_ROUNDS} patterns cracked`);
    } else load(round + 1);
  };

  return (
    <Stage>
      {round === -1 && (
        <StartCard emoji="🔢" title="Crack the hidden rule" onStart={begin}>
          Every sequence follows a rule. Find it, and the next item is easy.
        </StartCard>
      )}
      {round >= 0 && round < PATTERN_ROUNDS && p && (
        <>
          <Hud items={[["Pattern", `${round + 1}/${PATTERN_ROUNDS}`], ["Cracked", score]]} />
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {p.terms.map((t, i) => (
              <motion.span
                key={`${round}-${i}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                className="grid h-14 min-w-14 place-items-center rounded-2xl border-2 border-ink bg-white px-2 font-display text-2xl font-bold sm:h-16 sm:min-w-16 sm:text-3xl"
              >
                {t}
              </motion.span>
            ))}
            <span className="grid h-14 min-w-14 place-items-center rounded-2xl border-2 border-dashed border-ink bg-sun-soft font-display text-2xl font-bold sm:h-16 sm:min-w-16">
              {chosen === null ? "?" : p.answer}
            </span>
          </div>
          <div className="mt-6 grid w-full max-w-md grid-cols-2 gap-3 sm:grid-cols-4">
            {opts.map((o) => (
              <button
                key={String(o)}
                onClick={() => choose(o)}
                className={`btn-pop rounded-2xl border-2 border-ink py-3 font-display text-2xl font-bold ${
                  chosen === null ? "bg-white" : o === p.answer ? "bg-teal text-white" : o === chosen ? "bg-berry text-white" : "bg-white opacity-50"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
          {chosen !== null && (
            <div className="mt-5">
              <p className="font-semibold">{chosen === p.answer ? "✅ Cracked it!" : "❌ Not quite."} Rule: <b>{p.rule}</b></p>
              <Button className="mt-3" variant="teal" onClick={next}>
                Next <ArrowRight size={16} />
              </Button>
            </div>
          )}
        </>
      )}
      {round >= PATTERN_ROUNDS && (
        <ResultCard emoji="🧠" title={`${score} / ${PATTERN_ROUNDS} patterns cracked`} onAgain={begin}>
          Logical thinkers look for the <b>rule</b>, not the answer. Once you see the rule, everything clicks.
        </ResultCard>
      )}
    </Stage>
  );
}

/* ---------------- 8. Rule Switch (Flexibility) ---------------- */

type SwitchCard = { shape: "●" | "▲"; colour: "orange" | "blue" };
const SWITCH_CARDS = 24;

export function RuleSwitch({ onDone }: GameProps) {
  const [phase, setPhase] = useState<"idle" | "play" | "done">("idle");
  const [rule, setRule] = useState<"COLOUR" | "SHAPE">("COLOUR");
  const [card, setCard] = useState<SwitchCard>({ shape: "●", colour: "orange" });
  const [n, setN] = useState(0);
  const [score, setScore] = useState(0);
  const [flash, setFlash] = useState<"good" | "bad" | null>(null);
  const [switched, setSwitched] = useState(false);
  const untilSwitch = useRef(4);
  const t0 = useRef(0);
  const [secs, setSecs] = useState(0);

  const newCard = (): SwitchCard => ({ shape: pick(["●", "▲"] as const), colour: pick(["orange", "blue"] as const) });
  const begin = () => {
    setN(0);
    setScore(0);
    setRule(pick(["COLOUR", "SHAPE"] as const));
    untilSwitch.current = randInt(3, 5);
    setCard(newCard());
    t0.current = now();
    setPhase("play");
  };
  const answer = useCallback(
    (side: "L" | "R") => {
      if (phase !== "play") return;
      const correct = rule === "COLOUR" ? (card.colour === "orange" ? "L" : "R") : card.shape === "●" ? "L" : "R";
      const ok = side === correct;
      setFlash(ok ? "good" : "bad");
      window.setTimeout(() => setFlash(null), 160);
      const s = score + (ok ? 1 : 0);
      setScore(s);
      if (n + 1 >= SWITCH_CARDS) {
        const t = (now() - t0.current) / 1000;
        setSecs(t);
        setPhase("done");
        if (s >= 21) celebrate();
        onDone(`${s}/${SWITCH_CARDS} in ${t.toFixed(1)}s`);
        return;
      }
      setN(n + 1);
      untilSwitch.current -= 1;
      if (untilSwitch.current <= 0) {
        setRule((r) => (r === "COLOUR" ? "SHAPE" : "COLOUR"));
        untilSwitch.current = randInt(2, 6);
        setSwitched(true);
        window.setTimeout(() => setSwitched(false), 700);
      }
      setCard(newCard());
    },
    [phase, rule, card, score, n, onDone],
  );

  useEffect(() => {
    if (phase !== "play") return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") answer("L");
      if (e.key === "ArrowRight") answer("R");
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [phase, answer]);

  const left = rule === "COLOUR" ? "🟠 Orange" : "● Circle";
  const right = rule === "COLOUR" ? "🔵 Blue" : "▲ Triangle";

  return (
    <Stage className={flash === "good" ? "bg-teal-soft" : flash === "bad" ? "bg-blush" : ""}>
      {phase === "idle" && (
        <StartCard emoji="🔀" title="Follow the rule — until it changes" onStart={begin}>
          Sort each card LEFT or RIGHT. Watch the rule at the top: it switches between <b>COLOUR</b> and <b>SHAPE</b> without warning. (Arrow keys work too.)
        </StartCard>
      )}
      {phase === "play" && (
        <>
          <Hud items={[["Card", `${n + 1}/${SWITCH_CARDS}`], ["Score", score]]} />
          <motion.p
            key={rule}
            initial={{ scale: 1.4 }}
            animate={{ scale: 1 }}
            className={`mt-8 rounded-full border-2 border-ink px-5 py-2 font-display text-xl font-bold ${switched ? "bg-sun" : "bg-white"}`}
          >
            Sort by {rule} {switched && "— SWITCH!"}
          </motion.p>
          <motion.div
            key={n}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="my-6 font-display text-8xl leading-none"
            style={{ color: card.colour === "orange" ? "#f7845e" : "#2f7fc1" }}
          >
            {card.shape}
          </motion.div>
          <div className="grid w-full max-w-md grid-cols-2 gap-3">
            <button onClick={() => answer("L")} className="btn-pop flex items-center justify-center gap-2 rounded-2xl border-2 border-ink bg-white py-4 font-display text-lg font-bold">
              <ArrowLeft size={18} /> {left}
            </button>
            <button onClick={() => answer("R")} className="btn-pop flex items-center justify-center gap-2 rounded-2xl border-2 border-ink bg-white py-4 font-display text-lg font-bold">
              {right} <ArrowRight size={18} />
            </button>
          </div>
        </>
      )}
      {phase === "done" && (
        <ResultCard emoji={score >= 21 ? "🤸" : "🔄"} title={`${score} / ${SWITCH_CARDS} in ${secs.toFixed(1)}s`} onAgain={begin}>
          Did you slow down right after each switch? That pause is your brain letting go of the old rule. Flexible people make that pause shorter.
        </ResultCard>
      )}
    </Stage>
  );
}

/* ---------------- 9. Brain Sprint (Quick thinking) ---------------- */

const SPRINT_SECS = 45;
type Sum = { q: string; a: number; opts: number[] };

function makeSum(): Sum {
  const kind = pick(["+", "-", "×", "+", "-"]);
  let a: number, b: number, ans: number;
  if (kind === "+") { a = randInt(5, 60); b = randInt(3, 40); ans = a + b; }
  else if (kind === "-") { a = randInt(20, 90); b = randInt(3, a - 5); ans = a - b; }
  else { a = randInt(2, 12); b = randInt(2, 9); ans = a * b; }
  const opts = new Set([ans]);
  while (opts.size < 3) opts.add(ans + pick([-10, -2, -1, 1, 2, 10, kind === "×" ? a : 3]));
  return { q: `${a} ${kind} ${b}`, a: ans, opts: shuffle([...opts]) };
}

export function BrainSprint({ onDone }: GameProps) {
  const [phase, setPhase] = useState<"idle" | "play" | "done">("idle");
  const [sum, setSum] = useState<Sum>(() => ({ q: "", a: 0, opts: [] }));
  const [score, setScore] = useState(0);
  const [tries, setTries] = useState(0);
  const [left, setLeft] = useState(SPRINT_SECS);
  const [flash, setFlash] = useState<"good" | "bad" | null>(null);
  const scoreRef = useRef(0);
  const triesRef = useRef(0);

  useEffect(() => {
    if (phase !== "play") return;
    const t0 = now();
    const iv = window.setInterval(() => {
      const l = SPRINT_SECS - (now() - t0) / 1000;
      setLeft(l);
      if (l <= 0) {
        window.clearInterval(iv);
        setPhase("done");
        if (scoreRef.current >= 15) celebrate();
        onDone(`${scoreRef.current} correct of ${triesRef.current}`);
      }
    }, 100);
    return () => window.clearInterval(iv);
  }, [phase, onDone]);

  const begin = () => {
    scoreRef.current = 0;
    triesRef.current = 0;
    setScore(0);
    setTries(0);
    setLeft(SPRINT_SECS);
    setSum(makeSum());
    setPhase("play");
  };
  const answer = (o: number) => {
    const ok = o === sum.a;
    if (ok) scoreRef.current += 1;
    triesRef.current += 1;
    setScore(scoreRef.current);
    setTries(triesRef.current);
    setFlash(ok ? "good" : "bad");
    window.setTimeout(() => setFlash(null), 150);
    setSum(makeSum());
  };

  return (
    <Stage className={flash === "good" ? "bg-teal-soft" : flash === "bad" ? "bg-blush" : ""}>
      {phase === "idle" && (
        <StartCard emoji="⚡" title={`${SPRINT_SECS} seconds of quick maths`} onStart={begin} cta="Go!">
          Tap the right answer as fast as you can. Wrong answers don&apos;t lose points — but they waste time!
        </StartCard>
      )}
      {phase === "play" && (
        <>
          <Hud items={[["⏱", `${Math.ceil(left)}s`], ["Score", score]]} />
          <div className="mt-6 w-full max-w-md"><Bar pct={left / SPRINT_SECS} className="bg-coral" /></div>
          <motion.p key={sum.q + tries} initial={{ scale: 0.7 }} animate={{ scale: 1 }} className="my-8 font-display text-6xl font-bold sm:text-7xl">
            {sum.q}
          </motion.p>
          <div className="grid w-full max-w-md grid-cols-3 gap-3">
            {sum.opts.map((o) => (
              <button key={o} onClick={() => answer(o)} className="btn-pop rounded-2xl border-2 border-ink bg-white py-4 font-display text-3xl font-bold">
                {o}
              </button>
            ))}
          </div>
        </>
      )}
      {phase === "done" && (
        <ResultCard emoji={score >= 15 ? "🚀" : "⚡"} title={`${score} correct (${tries ? Math.round((score / tries) * 100) : 0}% accuracy)`} onAgain={begin}>
          Play again and try to beat your score. Quick thinking grows every time you train it.
        </ResultCard>
      )}
    </Stage>
  );
}

/* ---------------- 15. 100 Uses (Creativity) ---------------- */

const OBJECTS = ["🧱 a brick", "🥄 a spoon", "🧦 a sock", "📎 a paper clip", "🪣 a bucket", "🥫 an empty can", "📰 a newspaper", "🪢 a rope", "🧻 a toilet roll tube", "🎈 a balloon", "🪥 a toothbrush", "📦 a cardboard box"];
const USES_SECS = 60;

export function HundredUses({ onDone }: GameProps) {
  const [phase, setPhase] = useState<"idle" | "play" | "done">("idle");
  const [obj, setObj] = useState(OBJECTS[0]);
  const [ideas, setIdeas] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [left, setLeft] = useState(USES_SECS);
  const ideasRef = useRef<string[]>([]);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phase !== "play") return;
    const t0 = now();
    const iv = window.setInterval(() => {
      const l = USES_SECS - (now() - t0) / 1000;
      setLeft(l);
      if (l <= 0) {
        window.clearInterval(iv);
        setPhase("done");
        if (ideasRef.current.length >= 8) celebrate();
        onDone(`${ideasRef.current.length} ideas`);
      }
    }, 200);
    return () => window.clearInterval(iv);
  }, [phase, onDone]);

  const begin = () => {
    setObj(pick(OBJECTS));
    ideasRef.current = [];
    setIdeas([]);
    setText("");
    setLeft(USES_SECS);
    setPhase("play");
    window.setTimeout(() => input.current?.focus(), 50);
  };
  const add = () => {
    const t = text.trim();
    if (!t) return;
    ideasRef.current = [...ideasRef.current, t];
    setIdeas(ideasRef.current);
    setText("");
    input.current?.focus();
  };

  return (
    <Stage>
      {phase === "idle" && (
        <StartCard emoji="🧠" title="How many uses in 60 seconds?" onStart={begin}>
          You&apos;ll get an everyday object. Type every use you can imagine — silly, wild, clever. <b>Quantity first!</b> (In class, shout ideas and let the teacher type.)
        </StartCard>
      )}
      {phase !== "idle" && (
        <>
          <Hud items={[["⏱", `${Math.max(0, Math.ceil(left))}s`], ["Ideas", ideas.length]]} />
          <p className="mt-8 text-sm font-bold tracking-widest text-ink-soft uppercase">Your object</p>
          <p className="font-display text-4xl font-bold sm:text-5xl">{obj}</p>
          {phase === "play" && (
            <form
              className="mt-5 flex w-full max-w-md gap-2"
              onSubmit={(e) => { e.preventDefault(); add(); }}
            >
              <input
                ref={input}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. a doorstop…"
                className="min-w-0 flex-1 rounded-2xl border-2 border-ink bg-white px-4 py-3 text-lg outline-none focus:ring-4 focus:ring-sun/60"
              />
              <Button type="submit" variant="teal" className="px-4"><Plus size={18} /></Button>
            </form>
          )}
          <div className="mt-4 flex max-h-40 w-full max-w-xl flex-wrap justify-center gap-2 overflow-y-auto">
            <AnimatePresence>
              {ideas.map((i, k) => (
                <motion.span key={k} initial={{ scale: 0 }} animate={{ scale: 1 }} className="rounded-full border-2 border-ink bg-sun-soft px-3 py-1 text-sm font-semibold">
                  {i}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          {phase === "done" && (
            <div className="mt-5">
              <p className="font-display text-2xl font-bold">{ideas.length} ideas! {ideas.length >= 8 ? "🌟" : "💡"}</p>
              <p className="text-ink-soft">Most people stop at 5. Your best idea usually comes <b>after</b> the easy ones run out.</p>
              <Button className="mt-3" variant="white" onClick={begin}>New object</Button>
            </div>
          )}
        </>
      )}
    </Stage>
  );
}

/* ---------------- 16. Riddle Room (Curiosity) ---------------- */

const RIDDLES = [
  { q: "What has keys but can't open a single lock?", hint: "You might type on it… or play music on it.", a: "A piano (or a keyboard)" },
  { q: "The more you take, the more you leave behind. What am I?", hint: "Think about walking on a beach.", a: "Footsteps" },
  { q: "What gets wetter the more it dries?", hint: "You use it after a shower.", a: "A towel" },
  { q: "I have cities but no houses, rivers but no water, forests but no trees. What am I?", hint: "Teachers hang me on the wall in geography.", a: "A map" },
  { q: "What can you catch but never throw?", hint: "It makes you sneeze.", a: "A cold" },
  { q: "A man pushes his car to a hotel and tells the owner he's bankrupt. Why?", hint: "It's not a real car… it's a little game piece.", a: "He's playing a board game!" },
  { q: "What has a neck but no head, and wears a cap?", hint: "You drink from it.", a: "A bottle" },
  { q: "What goes up but never comes down?", hint: "Everyone has one, and it changes every year.", a: "Your age" },
  { q: "If you have me, you want to share me. If you share me, you don't have me. What am I?", hint: "Whisper, whisper…", a: "A secret" },
  { q: "A rooster lays an egg on top of a sloped roof. Which side does it roll down?", hint: "Read the question again… carefully.", a: "Neither — roosters don't lay eggs!" },
  { q: "What is full of holes but still holds water?", hint: "It's in the kitchen sink.", a: "A sponge" },
  { q: "How many months have 28 days?", hint: "Don't just think of February.", a: "All 12 of them!" },
  { q: "What has one eye but can't see?", hint: "You thread it.", a: "A needle" },
  { q: "Forward I am heavy, backward I am not. What am I?", hint: "Spell me backwards.", a: "A TON (backwards: NOT)" },
];

export function RiddleRoom({ onDone }: GameProps) {
  const order = useMemo(() => shuffle(RIDDLES), []);
  const [i, setI] = useState(0);
  const [hint, setHint] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [seen, setSeen] = useState(0);
  const r = order[i % order.length];

  const show = () => {
    setReveal(true);
    const s = seen + 1;
    setSeen(s);
    if (s === 3) onDone(`${s} riddles solved together`);
  };
  const next = () => { setI(i + 1); setHint(false); setReveal(false); };

  return (
    <Stage className="bg-ink text-cream">
      <span className="absolute top-4 left-4 rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-sun">
        Riddle {(i % order.length) + 1} / {order.length}
      </span>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl">
          <p className="font-display text-3xl leading-snug font-bold sm:text-4xl">{r.q}</p>
          {hint && <p className="mt-5 text-lg text-sun">💡 {r.hint}</p>}
          {reveal && (
            <motion.p initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="mt-6 inline-block rounded-2xl bg-sun px-5 py-3 font-display text-2xl font-bold text-ink">
              {r.a}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {!hint && !reveal && <Button variant="white" onClick={() => setHint(true)}><Lightbulb size={16} /> Hint</Button>}
        {!reveal && <Button variant="sun" onClick={show}><Eye size={16} /> Reveal</Button>}
        <Button variant="teal" onClick={next}>Next riddle <ArrowRight size={16} /></Button>
      </div>
      <p className="mt-6 text-sm text-cream/60">Let everyone guess before you reveal. Ask: “What made you think that?”</p>
    </Stage>
  );
}

/* ---------------- 17. Good Guess (Good judgement) ---------------- */

const GUESS_ROUNDS = 5;

export function GoodGuess({ onDone }: GameProps) {
  const [phase, setPhase] = useState<"idle" | "flash" | "guess" | "result" | "done">("idle");
  const [round, setRound] = useState(0);
  const [dots, setDots] = useState<{ x: number; y: number; c: string }[]>([]);
  const [guess, setGuess] = useState("");
  const [errors, setErrors] = useState<number[]>([]);
  const timer = useRef<number | null>(null);
  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  const startRound = (r: number) => {
    const n = randInt(12 + r * 12, 30 + r * 25);
    setDots([...Array(n)].map(() => ({ x: rand(3, 95), y: rand(5, 92), c: pick(["#f7845e", "#2f7fc1", "#1f9d8a", "#7b3fa0", "#e0a800"]) })));
    setGuess("");
    setRound(r);
    setPhase("flash");
    timer.current = window.setTimeout(() => setPhase("guess"), 1800);
  };
  const begin = () => { setErrors([]); startRound(0); };
  const submit = () => {
    const g = parseInt(guess, 10);
    if (Number.isNaN(g)) return;
    const err = Math.abs(g - dots.length) / dots.length;
    const all = [...errors, err];
    setErrors(all);
    setPhase("result");
    if (err <= 0.1) celebrate();
  };
  const next = () => {
    if (round + 1 >= GUESS_ROUNDS) {
      setPhase("done");
      const avg = errors.reduce((a, b) => a + b, 0) / errors.length;
      onDone(`average ${Math.round(avg * 100)}% off`);
    } else startRound(round + 1);
  };
  const last = errors[errors.length - 1] ?? 0;
  const avg = errors.length ? errors.reduce((a, b) => a + b, 0) / errors.length : 0;

  return (
    <Stage>
      {phase === "idle" && (
        <StartCard emoji="🫙" title="No counting — just judge" onStart={begin}>
          Dots appear for under 2 seconds. Estimate how many. Within 10% is excellent!
        </StartCard>
      )}
      {(phase === "flash" || phase === "guess" || phase === "result") && (
        <>
          <Hud items={[["Round", `${round + 1}/${GUESS_ROUNDS}`], ["", phase === "flash" ? "👀" : "🤔"]]} />
          <div className="relative mt-8 h-48 w-full max-w-lg rounded-2xl border-2 border-ink bg-white sm:h-56">
            {(phase === "flash" || phase === "result") &&
              dots.map((d, k) => (
                <span key={k} className="absolute h-3 w-3 rounded-full" style={{ left: `${d.x}%`, top: `${d.y}%`, background: d.c }} />
              ))}
            {phase === "guess" && <p className="grid h-full place-items-center font-display text-2xl font-bold text-ink-soft">How many dots?</p>}
          </div>
          {phase === "guess" && (
            <form className="mt-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); submit(); }}>
              <input
                autoFocus
                inputMode="numeric"
                value={guess}
                onChange={(e) => setGuess(e.target.value.replace(/\D/g, ""))}
                className="w-32 rounded-2xl border-2 border-ink bg-white px-4 py-3 text-center font-display text-2xl font-bold outline-none focus:ring-4 focus:ring-sun/60"
                placeholder="?"
              />
              <Button type="submit" variant="teal">Guess</Button>
            </form>
          )}
          {phase === "result" && (
            <div className="mt-4">
              <p className="font-display text-xl font-bold">
                There were {dots.length}. You said {guess}. {last <= 0.1 ? "🎯 Excellent!" : last <= 0.25 ? "👍 Close!" : "🙂 Adjust and try again"}
              </p>
              <Button className="mt-3" variant="teal" onClick={next}>{round + 1 >= GUESS_ROUNDS ? "See result" : "Next"} <ArrowRight size={16} /></Button>
            </div>
          )}
        </>
      )}
      {phase === "done" && (
        <ResultCard emoji="⚖️" title={`On average you were ${Math.round(avg * 100)}% off`} onAgain={begin}>
          Good judgement improves with feedback. Did each guess teach you something for the next one?
        </ResultCard>
      )}
    </Stage>
  );
}
