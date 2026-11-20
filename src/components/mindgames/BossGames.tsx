"use client";

import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Delete, Eye, RotateCcw, Undo2 } from "lucide-react";
import { Button } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";
import { Bar, Hud, ResultCard, Stage, StartCard, chance, now, pick, randInt, shuffle, tone, type GameProps } from "./kit";

/* ---------------- 21. Two Back (Working memory) ---------------- */

const NB_ITEMS = ["🍎", "🚗", "🐱", "⚽", "🌵", "🎸", "🚀", "🐢"];
const NB_LENGTH = 24;

function makeNBack(n: number) {
  const s: string[] = [];
  for (let i = 0; i < NB_LENGTH; i++) {
    if (i >= n && chance(0.3)) s.push(s[i - n]);
    else {
      let x = pick(NB_ITEMS);
      while (i >= n && x === s[i - n]) x = pick(NB_ITEMS);
      s.push(x);
    }
  }
  return s;
}

export function TwoBack({ onDone }: GameProps) {
  const [n, setN] = useState(2);
  const [phase, setPhase] = useState<"idle" | "play" | "done">("idle");
  const [seq, setSeq] = useState<string[]>([]);
  const [i, setI] = useState(-1);
  const [visible, setVisible] = useState(false);
  const [stats, setStats] = useState({ hits: 0, misses: 0, false: 0 });
  const [flash, setFlash] = useState<"good" | "bad" | null>(null);
  const pressed = useRef(false);
  const statsRef = useRef({ hits: 0, misses: 0, false: 0 });
  const timers = useRef<number[]>([]);
  const clear = () => { timers.current.forEach((t) => window.clearTimeout(t)); timers.current = []; };
  useEffect(() => clear, []);

  const begin = (level: number) => {
    clear();
    const s = makeNBack(level);
    setN(level);
    setSeq(s);
    statsRef.current = { hits: 0, misses: 0, false: 0 };
    setStats(statsRef.current);
    setPhase("play");
    const show = (k: number) => {
      if (k > 0 && k - 1 >= level && s[k - 1] === s[k - 1 - level] && !pressed.current) {
        statsRef.current = { ...statsRef.current, misses: statsRef.current.misses + 1 };
        setStats(statsRef.current);
      }
      if (k >= NB_LENGTH) {
        setPhase("done");
        const { hits, misses } = statsRef.current;
        const total = hits + misses;
        if (total && hits / total >= 0.8 && statsRef.current.false <= 2) celebrate("big");
        onDone(`${level}-back: ${hits}/${total} matches, ${statsRef.current.false} false alarms`);
        return;
      }
      pressed.current = false;
      setI(k);
      setVisible(true);
      timers.current.push(window.setTimeout(() => setVisible(false), 1500));
      timers.current.push(window.setTimeout(() => show(k + 1), 2100));
    };
    timers.current.push(window.setTimeout(() => show(0), 600));
  };

  const match = useCallback(() => {
    if (phase !== "play" || pressed.current || i < 0) return;
    pressed.current = true;
    const isMatch = i >= n && seq[i] === seq[i - n];
    if (isMatch) statsRef.current = { ...statsRef.current, hits: statsRef.current.hits + 1 };
    else statsRef.current = { ...statsRef.current, false: statsRef.current.false + 1 };
    setStats(statsRef.current);
    setFlash(isMatch ? "good" : "bad");
    window.setTimeout(() => setFlash(null), 250);
  }, [phase, i, n, seq]);

  useEffect(() => {
    if (phase !== "play") return;
    const k = (e: KeyboardEvent) => { if (e.code === "Space") { e.preventDefault(); match(); } };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [phase, match]);

  const total = stats.hits + stats.misses;

  return (
    <Stage className={flash === "good" ? "bg-teal-soft" : flash === "bad" ? "bg-blush" : ""}>
      {phase === "idle" && (
        <div className="max-w-md">
          <span className="text-6xl">🔁</span>
          <p className="mt-2 font-display text-2xl font-bold">Same as two pictures ago?</p>
          <p className="mt-2 text-ink-soft">
            Example: 🍎 🚗 <b>🍎</b> ← MATCH! (same as two back). Press MATCH (or Space) only then. Don&apos;t press for anything else.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Button variant="teal" onClick={() => begin(1)}>Warm-up: One Back</Button>
            <Button variant="coral" onClick={() => begin(2)}>Two Back</Button>
            <Button variant="grape" onClick={() => begin(3)}>🔥 Three Back</Button>
          </div>
        </div>
      )}
      {phase === "play" && (
        <>
          <Hud items={[["Picture", `${Math.max(1, i + 1)}/${NB_LENGTH}`], [`${n}-back`, `✅ ${stats.hits}  ❌ ${stats.false}`]]} />
          <div className="mt-6 grid h-40 w-40 place-items-center rounded-3xl border-2 border-ink bg-white text-8xl">
            {visible && i >= 0 && (
              <motion.span key={i} initial={{ scale: 0.4 }} animate={{ scale: 1 }}>
                {seq[i]}
              </motion.span>
            )}
          </div>
          <Button className="mt-6 px-12 py-5 text-2xl" variant="grape" onClick={match}>MATCH</Button>
          <p className="mt-3 text-sm text-ink-soft">Keep saying the last {n} pictures in your head, like a moving window.</p>
        </>
      )}
      {phase === "done" && (
        <ResultCard emoji={total && stats.hits / total >= 0.8 ? "🧠" : "🔁"} title={`${stats.hits} of ${total} matches caught`} onAgain={() => setPhase("idle")}>
          {stats.false} false alarm{stats.false === 1 ? "" : "s"}, {stats.misses} missed. Scientists use this exact task to train working memory — every try makes it stronger.
        </ResultCard>
      )}
    </Stage>
  );
}

/* ---------------- 22. Safe Cracker (Deduction) ---------------- */

const SAFE_TRIES = 10;
type SafeGuess = { g: string; green: number; yellow: number };

export function SafeCracker({ onDone }: GameProps) {
  const [secret, setSecret] = useState("");
  const [guesses, setGuesses] = useState<SafeGuess[]>([]);
  const [cur, setCur] = useState("");
  const [state, setState] = useState<"idle" | "play" | "won" | "lost">("idle");

  const begin = () => {
    setSecret(shuffle(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]).slice(0, 4).join(""));
    setGuesses([]);
    setCur("");
    setState("play");
  };
  const press = (d: string) => { if (cur.length < 4 && !cur.includes(d)) setCur(cur + d); };
  const submit = () => {
    if (cur.length !== 4) return;
    let green = 0, yellow = 0;
    for (let k = 0; k < 4; k++) {
      if (cur[k] === secret[k]) green++;
      else if (secret.includes(cur[k])) yellow++;
    }
    const gs = [...guesses, { g: cur, green, yellow }];
    setGuesses(gs);
    setCur("");
    if (green === 4) {
      setState("won");
      celebrate("big");
      onDone(`cracked in ${gs.length} tries`);
    } else if (gs.length >= SAFE_TRIES) {
      setState("lost");
      onDone("safe stayed locked");
    } else tone(220 + green * 120, 150);
  };

  return (
    <Stage className="!justify-start">
      {state === "idle" ? (
        <div className="my-auto max-w-md">
          <StartCard emoji="🔐" title="Crack the 4-digit code" onStart={begin}>
            Four different digits. After each guess: <b>🟢</b> right digit in the right place, <b>🟡</b> right digit in the wrong place. You have {SAFE_TRIES} tries.
          </StartCard>
        </div>
      ) : (
        <>
          <Hud items={[["Tries", `${guesses.length}/${SAFE_TRIES}`], ["", state === "won" ? "🔓 Open!" : "🔒 Locked"]]} />
          <div className="mt-10 grid w-full max-w-3xl gap-5 md:grid-cols-2">
            <div className="max-h-80 space-y-1.5 overflow-y-auto rounded-2xl border-2 border-ink bg-white p-3">
              {guesses.length === 0 && <p className="text-sm text-ink-soft">Your guesses and clues appear here. Tip: start with 0123, then 4567.</p>}
              {guesses.map((g, k) => (
                <div key={k} className="flex items-center justify-between gap-2 rounded-xl bg-cream px-3 py-1.5">
                  <span className="text-xs font-bold text-ink-soft">#{k + 1}</span>
                  <span className="font-display text-2xl font-bold tracking-[0.3em]">{g.g}</span>
                  <span className="min-w-20 text-right text-lg">
                    {"🟢".repeat(g.green)}
                    {"🟡".repeat(g.yellow)}
                    {g.green + g.yellow === 0 && <span className="text-sm text-ink-soft">none</span>}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <div className="flex justify-center gap-2">
                {[0, 1, 2, 3].map((k) => (
                  <span key={k} className="grid h-14 w-12 place-items-center rounded-xl border-2 border-ink bg-sun-soft font-display text-3xl font-bold">
                    {state === "lost" ? secret[k] : cur[k] ?? ""}
                  </span>
                ))}
              </div>
              {state === "play" ? (
                <>
                  <div className="mt-3 grid grid-cols-5 gap-1.5">
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map((d) => (
                      <button
                        key={d}
                        onClick={() => press(d)}
                        disabled={cur.includes(d)}
                        className="btn-pop rounded-xl border-2 border-ink bg-white py-2.5 font-display text-xl font-bold disabled:opacity-30"
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button variant="white" className="px-3" onClick={() => setCur(cur.slice(0, -1))} title="Delete"><Delete size={18} /></Button>
                    <Button variant="teal" className="flex-1" onClick={submit} disabled={cur.length !== 4}>Try code</Button>
                  </div>
                </>
              ) : (
                <div className="mt-4">
                  <p className="font-display text-xl font-bold">
                    {state === "won" ? `🔓 Cracked in ${guesses.length} tries!` : `🔒 The code was ${secret}.`}
                  </p>
                  <p className="text-sm text-ink-soft">
                    {state === "won" ? "Great detectives use every clue — even the 'none' ones." : "Look back: which clue could have ruled out more digits?"}
                  </p>
                  <Button className="mt-3" variant="white" onClick={begin}><RotateCcw size={16} /> New safe</Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Stage>
  );
}

/* ---------------- 23. Mirror Mind (Spatial thinking) ---------------- */

type Cell = [number, number];
// pentominoes that are NOT symmetric — their mirror can never be reached by turning
const SHAPES: Cell[][] = [
  [[0, 0], [1, 0], [2, 0], [3, 0], [3, 1]], // L
  [[0, 1], [1, 1], [2, 1], [2, 0], [3, 0]], // N
  [[0, 0], [0, 1], [1, 0], [1, 1], [2, 0]], // P
  [[0, 1], [0, 2], [1, 0], [1, 1], [2, 1]], // F
  [[0, 1], [1, 0], [1, 1], [2, 1], [3, 1]], // Y
];
const rotate = (s: Cell[]): Cell[] => s.map(([r, c]) => [c, -r]);
const mirror = (s: Cell[]): Cell[] => s.map(([r, c]) => [r, -c]);
function normalise(s: Cell[]): Cell[] {
  const mr = Math.min(...s.map((x) => x[0])), mc = Math.min(...s.map((x) => x[1]));
  return s.map(([r, c]) => [r - mr, c - mc]);
}
const MM_ROUNDS = 15;

function ShapeView({ cells, color }: { cells: Cell[]; color: string }) {
  const set = new Set(cells.map(([r, c]) => `${r},${c}`));
  return (
    <div className="grid grid-cols-4 gap-1 rounded-2xl border-2 border-ink bg-white p-2">
      {[...Array(16).keys()].map((k) => (
        <span key={k} className="h-8 w-8 rounded-md sm:h-10 sm:w-10" style={{ background: set.has(`${Math.floor(k / 4)},${k % 4}`) ? color : "rgb(35 32 78 / 0.05)" }} />
      ))}
    </div>
  );
}

export function MirrorMind({ onDone }: GameProps) {
  const [phase, setPhase] = useState<"idle" | "play" | "done">("idle");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [pair, setPair] = useState<{ a: Cell[]; b: Cell[]; same: boolean }>({ a: [], b: [], same: true });
  const [flash, setFlash] = useState<"good" | "bad" | null>(null);
  const t0 = useRef(0);
  const [secs, setSecs] = useState(0);

  const newPair = () => {
    let a = pick(SHAPES);
    for (let k = randInt(0, 3); k > 0; k--) a = rotate(a);
    const same = chance(0.5);
    let b = same ? a : mirror(a);
    for (let k = randInt(1, 3); k > 0; k--) b = rotate(b);
    setPair({ a: normalise(a), b: normalise(b), same });
  };
  const begin = () => { setRound(0); setScore(0); t0.current = now(); setPhase("play"); newPair(); };
  const answer = (same: boolean) => {
    const ok = same === pair.same;
    setFlash(ok ? "good" : "bad");
    window.setTimeout(() => setFlash(null), 200);
    const s = score + (ok ? 1 : 0);
    setScore(s);
    if (round + 1 >= MM_ROUNDS) {
      const t = (now() - t0.current) / 1000;
      setSecs(t);
      setPhase("done");
      if (s >= 13) celebrate();
      onDone(`${s}/${MM_ROUNDS} in ${t.toFixed(1)}s`);
    } else { setRound(round + 1); newPair(); }
  };

  return (
    <Stage className={flash === "good" ? "bg-teal-soft" : flash === "bad" ? "bg-blush" : ""}>
      {phase === "idle" && (
        <StartCard emoji="🪞" title="Same shape — or a mirror twin?" onStart={begin}>
          The right shape is always <b>turned</b>. Decide if it&apos;s the same shape, or its mirror image (like your left and right hands).
        </StartCard>
      )}
      {phase === "play" && (
        <>
          <Hud items={[["Round", `${round + 1}/${MM_ROUNDS}`], ["Score", score]]} />
          <motion.div key={round} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <ShapeView cells={pair.a} color="#2f7fc1" />
            <span className="font-display text-3xl font-bold">→</span>
            <ShapeView cells={pair.b} color="#7b3fa0" />
          </motion.div>
          <div className="mt-6 grid w-full max-w-md grid-cols-2 gap-3">
            <button onClick={() => answer(true)} className="btn-pop rounded-2xl border-2 border-ink bg-white py-4 font-display text-xl font-bold">🔄 Same</button>
            <button onClick={() => answer(false)} className="btn-pop rounded-2xl border-2 border-ink bg-white py-4 font-display text-xl font-bold">🪞 Mirror</button>
          </div>
        </>
      )}
      {phase === "done" && (
        <ResultCard emoji={score >= 13 ? "🧭" : "🪞"} title={`${score} / ${MM_ROUNDS} in ${secs.toFixed(1)}s`} onAgain={begin}>
          Tip: find one special corner (like the short arm of an L) and track where it goes when the shape turns.
        </ResultCard>
      )}
    </Stage>
  );
}

/* ---------------- 24. Jug Logic (Strategic thinking) ---------------- */

const JUG_LEVELS = [
  { caps: [3, 5], target: 4, best: 6 },
  { caps: [4, 9], target: 6, best: 8 },
  { caps: [5, 7], target: 1, best: 8 },
];

function JugView({ amount, cap, label }: { amount: number; cap: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 overflow-hidden rounded-b-3xl rounded-t-lg border-4 border-ink bg-white sm:w-24" style={{ height: `${cap * 22 + 10}px` }}>
        <motion.div className="absolute bottom-0 w-full bg-sky-deep/80" animate={{ height: `${(amount / cap) * 100}%` }} transition={{ type: "spring", stiffness: 120, damping: 18 }} />
        {[...Array(cap - 1)].map((_, k) => (
          <span key={k} className="absolute right-0 h-0.5 w-3 bg-ink/30" style={{ bottom: `${((k + 1) / cap) * 100}%` }} />
        ))}
        <span className="absolute inset-0 grid place-items-center font-display text-3xl font-bold text-ink">{amount}</span>
      </div>
      <p className="mt-1 font-display font-bold">{label} · {cap} L</p>
    </div>
  );
}

export function JugLogic({ onDone }: GameProps) {
  const [lv, setLv] = useState(-1);
  const [jugs, setJugs] = useState([0, 0]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const level = JUG_LEVELS[Math.max(0, lv)];
  const load = (l: number) => { setLv(l); setJugs([0, 0]); setMoves(0); setWon(false); };
  const act = (fn: (j: number[], c: number[]) => number[]) => {
    if (won) return;
    const nj = fn([...jugs], level.caps);
    if (nj[0] === jugs[0] && nj[1] === jugs[1]) return;
    tone(300 + nj[0] * 30 + nj[1] * 20, 120);
    setJugs(nj);
    const m = moves + 1;
    setMoves(m);
    if (nj.includes(level.target)) {
      setWon(true);
      celebrate();
      if (lv === JUG_LEVELS.length - 1) onDone(`all ${JUG_LEVELS.length} levels`);
    }
  };
  const pour = (from: number, to: number) => (j: number[], c: number[]) => {
    const amt = Math.min(j[from], c[to] - j[to]);
    j[from] -= amt;
    j[to] += amt;
    return j;
  };

  return (
    <Stage>
      {lv === -1 ? (
        <StartCard emoji="🫗" title="Measure without markings" onStart={() => load(0)}>
          Two jugs with no lines on them and a tap. Fill, empty and pour to get <b>exactly</b> the target amount in one jug.
        </StartCard>
      ) : (
        <>
          <Hud items={[["Level", `${lv + 1}/${JUG_LEVELS.length}`], ["Moves", moves]]} />
          <p className="mt-8 rounded-full border-2 border-ink bg-sun px-5 py-1.5 font-display text-xl font-bold">Target: exactly {level.target} L</p>
          <div className="mt-5 flex items-end justify-center gap-10">
            <JugView amount={jugs[0]} cap={level.caps[0]} label="Jug A" />
            <JugView amount={jugs[1]} cap={level.caps[1]} label="Jug B" />
          </div>
          {!won ? (
            <div className="mt-5 grid w-full max-w-lg grid-cols-2 gap-2 sm:grid-cols-3">
              <Button variant="white" onClick={() => act((j, c) => { j[0] = c[0]; return j; })}>🚰 Fill A</Button>
              <Button variant="white" onClick={() => act((j, c) => { j[1] = c[1]; return j; })}>🚰 Fill B</Button>
              <Button variant="white" onClick={() => act(pour(0, 1))}>A → B</Button>
              <Button variant="white" onClick={() => act((j) => { j[0] = 0; return j; })}>🕳️ Empty A</Button>
              <Button variant="white" onClick={() => act((j) => { j[1] = 0; return j; })}>🕳️ Empty B</Button>
              <Button variant="white" onClick={() => act(pour(1, 0))}>B → A</Button>
            </div>
          ) : (
            <div className="mt-5">
              <p className="font-display text-2xl font-bold">💧 {level.target} litres in {moves} moves! {moves <= level.best ? "🏆 Expert!" : `(Can be done in ${level.best}.)`}</p>
              <div className="mt-3 flex justify-center gap-2">
                <Button variant="white" onClick={() => load(lv)}><RotateCcw size={16} /> Retry</Button>
                {lv < JUG_LEVELS.length - 1 && <Button variant="grape" onClick={() => load(lv + 1)}>Next level <ArrowRight size={16} /></Button>}
              </div>
            </div>
          )}
          {!won && <button onClick={() => load(lv)} className="mt-3 text-sm font-semibold underline">Start level again</button>}
        </>
      )}
    </Stage>
  );
}

/* ---------------- 25. River Run (Thinking ahead) ---------------- */

const CREW = [
  { id: "fox", e: "🦊", name: "Fox" },
  { id: "chicken", e: "🐔", name: "Chicken" },
  { id: "grain", e: "🌾", name: "Grain" },
] as const;
type Side = "L" | "R";
type CrewId = (typeof CREW)[number]["id"];

function danger(pos: Record<CrewId, Side>, farmer: Side): string | null {
  for (const side of ["L", "R"] as Side[]) {
    if (side === farmer) continue;
    if (pos.fox === side && pos.chicken === side) return "🦊 The fox ate the chicken!";
    if (pos.chicken === side && pos.grain === side) return "🐔 The chicken ate the grain!";
  }
  return null;
}

export function RiverRun({ onDone }: GameProps) {
  const start: Record<CrewId, Side> = { fox: "L", chicken: "L", grain: "L" };
  const [pos, setPos] = useState<Record<CrewId, Side>>(() => ({ ...start }));
  const [farmer, setFarmer] = useState<Side>("L");
  const [boat, setBoat] = useState<CrewId | null>(null);
  const [trips, setTrips] = useState(0);
  const [fail, setFail] = useState<string | null>(null);
  const [won, setWon] = useState(false);

  const reset = () => { setPos(start); setFarmer("L"); setBoat(null); setTrips(0); setFail(null); setWon(false); };
  const toggle = (id: CrewId) => {
    if (fail || won || pos[id] !== farmer) return;
    setBoat(boat === id ? null : id);
  };
  const cross = () => {
    if (fail || won) return;
    const to: Side = farmer === "L" ? "R" : "L";
    const np = { ...pos };
    if (boat) np[boat] = to;
    setPos(np);
    setFarmer(to);
    setBoat(null);
    const t = trips + 1;
    setTrips(t);
    const d = danger(np, to);
    if (d) { setFail(d); tone(140, 500); return; }
    if (np.fox === "R" && np.chicken === "R" && np.grain === "R") {
      setWon(true);
      celebrate("big");
      onDone(`crossed in ${t} trips`);
    }
  };

  const bank = (side: Side) => (
    <div className={`flex min-h-40 flex-1 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-ink p-2 ${side === "L" ? "bg-mint" : "bg-sun-soft"}`}>
      {farmer === side && <span className="text-4xl" title="You">🧑‍🌾</span>}
      <div className="flex flex-wrap justify-center gap-2">
        {CREW.filter((c) => pos[c.id] === side && boat !== c.id).map((c) => (
          <button key={c.id} onClick={() => toggle(c.id)} className="btn-pop rounded-xl border-2 border-ink bg-white px-2 py-1 text-3xl" title={`Put the ${c.name} in the boat`}>
            {c.e}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Stage>
      <Hud items={[["Trips", trips], ["Best", 7]]} />
      <p className="mt-8 max-w-xl text-sm text-ink-soft">
        Tap an animal on <b>your</b> side to load it, then cross. The boat holds you + one. Never leave 🦊 with 🐔, or 🐔 with 🌾, without you.
      </p>
      <div className="mt-4 flex w-full max-w-2xl items-stretch gap-2">
        {bank("L")}
        <div className="relative w-28 shrink-0 rounded-2xl border-2 border-ink bg-sky sm:w-36">
          <motion.div
            animate={{ left: farmer === "L" ? "4%" : "46%" }}
            transition={{ type: "spring", stiffness: 90, damping: 16 }}
            className="absolute top-1/2 -translate-y-1/2 text-center"
          >
            <span className="block text-3xl">{boat ? CREW.find((c) => c.id === boat)!.e : ""}</span>
            <button onClick={() => boat && setBoat(null)} className="text-4xl" aria-label="Boat">🛶</button>
          </motion.div>
        </div>
        {bank("R")}
      </div>
      {fail ? (
        <div className="mt-5">
          <p className="font-display text-2xl font-bold text-berry">{fail}</p>
          <p className="text-ink-soft">Before each trip, look at what you leave behind.</p>
          <Button className="mt-3" variant="white" onClick={reset}><RotateCcw size={16} /> Try again</Button>
        </div>
      ) : won ? (
        <div className="mt-5">
          <p className="font-display text-2xl font-bold">🎉 Everyone crossed safely in {trips} trips!</p>
          <p className="text-ink-soft">The secret: you had to bring the chicken <b>back</b>. Sometimes going backwards is the way forwards.</p>
          <Button className="mt-3" variant="white" onClick={reset}><RotateCcw size={16} /> Play again</Button>
        </div>
      ) : (
        <Button className="mt-5" variant="teal" onClick={cross}>
          {farmer === "L" ? <>Cross <ArrowRight size={16} /></> : <><ArrowLeft size={16} /> Cross back</>}
        </Button>
      )}
    </Stage>
  );
}

/* ---------------- 26. Truth or Lie (Critical thinking) ---------------- */

const LIE_PUZZLES = [
  {
    title: "The broken vase",
    rule: "Exactly ONE person is lying. Who broke the vase?",
    lines: ["Asha: “Ben broke it.”", "Ben: “Chen broke it.”", "Chen: “Ben is lying.”"],
    options: ["Asha", "Ben", "Chen"],
    answer: "Ben",
    why: "Test Ben: Asha is true, Ben's claim is false, Chen is true → only one liar ✅. Any other choice makes two people liars.",
  },
  {
    title: "The last cookie",
    rule: "Only ONE person is telling the truth. Who took the last cookie?",
    lines: ["Maya: “Leo took it.”", "Leo: “It wasn't me.”", "Sam: “It wasn't me.”"],
    options: ["Maya", "Leo", "Sam"],
    answer: "Sam",
    why: "If Sam took it: Maya is false, Leo is true, Sam is false → exactly one truth ✅. Leo or Maya would make two truths.",
  },
  {
    title: "The missing key",
    rule: "Exactly ONE person is lying. Who has the key?",
    lines: ["Ali: “I have it.”", "Bea: “Ali doesn't have it.”", "Cal: “Bea has it.”"],
    options: ["Ali", "Bea", "Cal"],
    answer: "Bea",
    why: "Ali and Bea say opposite things, so one of them is the liar — Cal must be honest. So Bea has it ✅ (and Ali is the liar).",
  },
  {
    title: "Truth-tellers and liars",
    rule: "On this island, everyone ALWAYS lies or ALWAYS tells the truth. Zara says: “Omar and I are both liars.”",
    lines: ["What are Zara and Omar?"],
    options: ["Both truth-tellers", "Zara lies, Omar is truthful", "Both liars", "Zara is truthful, Omar lies"],
    answer: "Zara lies, Omar is truthful",
    why: "A truth-teller could never say “I am a liar” — so Zara lies. Her sentence must be false, so they are NOT both liars → Omar tells the truth.",
  },
  {
    title: "The mixed-up boxes",
    rule: "Three boxes are labelled APPLES, ORANGES and MIXED. EVERY label is wrong. You may take out ONE fruit from ONE box, without looking inside.",
    lines: ["Which box should you pick from to fix every label?"],
    options: ["APPLES box", "ORANGES box", "MIXED box"],
    answer: "MIXED box",
    why: "The MIXED box can't be mixed — it's all one fruit. If you pull an apple, it's the apple box. Then the box labelled ORANGES can't be oranges or apples → mixed. The last one is oranges.",
  },
];

export function TruthOrLie({ onDone }: GameProps) {
  const [i, setI] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const p = LIE_PUZZLES[i];

  const choose = (o: string) => {
    if (chosen) return;
    setChosen(o);
    if (o === p.answer) { setScore((s) => s + 1); celebrate(); }
  };
  const next = () => {
    if (i + 1 >= LIE_PUZZLES.length) {
      setFinished(true);
      onDone(`${score}/${LIE_PUZZLES.length} cases solved`);
    } else { setI(i + 1); setChosen(null); }
  };
  const restart = () => { setI(0); setChosen(null); setScore(0); setFinished(false); };

  if (finished)
    return (
      <Stage>
        <ResultCard emoji="🕵️" title={`${score} of ${LIE_PUZZLES.length} cases solved`} onAgain={restart}>
          The trick every time: assume one answer is true, then check if the rule still holds. That&apos;s how critical thinkers test claims.
        </ResultCard>
      </Stage>
    );

  return (
    <Stage className="bg-ink text-cream">
      <Hud items={[["Case", `${i + 1}/${LIE_PUZZLES.length}`], ["Solved", score]]} />
      <div className="mt-10 w-full max-w-2xl">
        <p className="font-display text-sm font-bold tracking-[0.2em] text-sun uppercase">🕵️ {p.title}</p>
        <p className="mt-2 font-display text-xl font-semibold sm:text-2xl">{p.rule}</p>
        <div className="mt-4 space-y-2">
          {p.lines.map((l) => (
            <p key={l} className="rounded-2xl bg-white/10 px-4 py-2 text-lg">{l}</p>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {p.options.map((o) => (
            <button
              key={o}
              onClick={() => choose(o)}
              className={`btn-pop rounded-2xl border-2 border-ink px-4 py-2.5 font-display font-bold ${
                !chosen ? "bg-white text-ink" : o === p.answer ? "bg-teal text-white" : o === chosen ? "bg-berry text-white" : "bg-white/40 text-ink"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
        {chosen && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-2xl bg-sun p-4 text-left text-ink">
            <p className="font-display text-lg font-bold">{chosen === p.answer ? "✅ Case closed!" : `❌ It was: ${p.answer}`}</p>
            <p className="mt-1">{p.why}</p>
          </motion.div>
        )}
      </div>
      {chosen ? (
        <Button className="mt-5" variant="teal" onClick={next}>{i + 1 >= LIE_PUZZLES.length ? "Finish" : "Next case"} <ArrowRight size={16} /></Button>
      ) : (
        <p className="mt-5 text-sm text-cream/60">Class: discuss for 1 minute, then vote before tapping.</p>
      )}
    </Stage>
  );
}

/* ---------------- 27. Make 24 (Resourcefulness) ---------------- */

type Frac = { n: number; d: number };
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const frac = (n: number, d = 1): Frac => { const g = gcd(n, d) || 1; const s = d < 0 ? -1 : 1; return { n: (s * n) / g, d: (s * d) / g }; };
const show = (f: Frac) => (f.d === 1 ? String(f.n) : `${f.n}/${f.d}`);
const OPS = ["+", "−", "×", "÷"] as const;
function calc(a: Frac, b: Frac, op: (typeof OPS)[number]): Frac | null {
  if (op === "+") return frac(a.n * b.d + b.n * a.d, a.d * b.d);
  if (op === "−") return frac(a.n * b.d - b.n * a.d, a.d * b.d);
  if (op === "×") return frac(a.n * b.n, a.d * b.d);
  if (b.n === 0) return null;
  return frac(a.n * b.d, a.d * b.n);
}
const SETS = [
  { nums: [1, 2, 3, 4], sol: "1 × 2 × 3 × 4" },
  { nums: [1, 1, 4, 6], sol: "4 × 6 × 1 × 1" },
  { nums: [3, 3, 4, 8], sol: "3 × 8 × (4 − 3)" },
  { nums: [2, 3, 4, 5], sol: "4 × (5 + 3 − 2)" },
  { nums: [3, 4, 6, 8], sol: "(8 − 6) × 3 × 4" },
  { nums: [2, 5, 6, 7], sol: "6 × (7 − 5 + 2)" },
  { nums: [4, 5, 6, 7], sol: "(5 + 7) × (6 − 4)" },
  { nums: [4, 4, 6, 8], sol: "(8 − 6 + 4) × 4" },
  { nums: [1, 3, 4, 6], sol: "6 ÷ (1 − 3 ÷ 4)  🔥 boss level!" },
];

export function Make24({ onDone }: GameProps) {
  const [level, setLevel] = useState(-1);
  const [tiles, setTiles] = useState<(Frac | null)[]>([]);
  const [history, setHistory] = useState<(Frac | null)[][]>([]);
  const [sel, setSel] = useState<number | null>(null);
  const [op, setOp] = useState<(typeof OPS)[number] | null>(null);
  const [solved, setSolved] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [won, setWon] = useState(false);

  const load = (l: number) => {
    const s = SETS[l % SETS.length];
    setLevel(l);
    setTiles(shuffle(s.nums).map((n) => frac(n)));
    setHistory([]);
    setSel(null);
    setOp(null);
    setReveal(false);
    setWon(false);
  };
  const tapTile = (k: number) => {
    if (won || !tiles[k]) return;
    if (sel === null || op === null) { setSel(k === sel ? null : k); return; }
    if (k === sel) return;
    const r = calc(tiles[sel]!, tiles[k]!, op);
    if (!r) return;
    const nt = [...tiles];
    nt[sel] = null;
    nt[k] = r;
    setHistory([...history, tiles]);
    setTiles(nt);
    setSel(k);
    setOp(null);
    const left = nt.filter(Boolean);
    if (left.length === 1) {
      if (r.n === 24 && r.d === 1) {
        setWon(true);
        celebrate("big");
        const s = solved + 1;
        setSolved(s);
        if (s === 3) onDone(`${s} puzzles made 24`);
      } else tone(160, 400);
    }
  };
  const undo = () => {
    if (!history.length) return;
    setTiles(history[history.length - 1]);
    setHistory(history.slice(0, -1));
    setSel(null);
    setOp(null);
    setWon(false);
  };
  const left = tiles.filter(Boolean);
  const stuck = left.length === 1 && !won;

  return (
    <Stage>
      {level === -1 ? (
        <StartCard emoji="🎯" title="Use all four numbers to make 24" onStart={() => load(0)}>
          Tap a number, then <b>+ − × ÷</b>, then another number. They combine into one. Keep going until only <b>24</b> is left.
        </StartCard>
      ) : (
        <>
          <Hud items={[["Puzzle", `${(level % SETS.length) + 1}/${SETS.length}`], ["Solved", solved]]} />
          <div className="mt-10 grid w-full max-w-md grid-cols-2 gap-3 sm:grid-cols-4">
            {tiles.map((t, k) =>
              t ? (
                <motion.button
                  layout
                  key={k}
                  onClick={() => tapTile(k)}
                  className={`grid aspect-square place-items-center rounded-3xl border-2 border-ink font-display text-4xl font-bold ${
                    won && left.length === 1 ? "bg-teal text-white" : sel === k ? "bg-sun" : "bg-white"
                  }`}
                >
                  {show(t)}
                </motion.button>
              ) : (
                <span key={k} className="aspect-square rounded-3xl border-2 border-dashed border-ink/20" />
              ),
            )}
          </div>
          <div className="mt-4 flex gap-2">
            {OPS.map((o) => (
              <button
                key={o}
                onClick={() => sel !== null && setOp(o)}
                disabled={sel === null || won}
                className={`btn-pop h-14 w-14 rounded-2xl border-2 border-ink font-display text-3xl font-bold disabled:opacity-30 ${op === o ? "bg-grape text-white" : "bg-white"}`}
              >
                {o}
              </button>
            ))}
          </div>
          <p className="mt-3 h-6 font-semibold">
            {won ? "🎯 24! Brilliant!" : stuck ? `That makes ${show(left[0]!)} — undo and try another path.` : sel === null ? "Tap a number" : op === null ? "Now pick an operation" : "Now tap another number"}
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <Button variant="white" onClick={undo} disabled={!history.length || won}><Undo2 size={16} /> Undo</Button>
            <Button variant="white" onClick={() => load(level)}><RotateCcw size={16} /> Reset</Button>
            {!won && !reveal && <Button variant="white" onClick={() => setReveal(true)}><Eye size={16} /> Show a way</Button>}
            <Button variant="grape" onClick={() => load(level + 1)}>Next <ArrowRight size={16} /></Button>
          </div>
          {reveal && !won && <p className="mt-3 rounded-xl bg-sun-soft px-3 py-1.5 font-display font-bold">One way: {SETS[level % SETS.length].sol}</p>}
        </>
      )}
    </Stage>
  );
}

/* ---------------- 28. Chain Calc (Mental stamina) ---------------- */

type Step = { label: string; apply: (x: number) => number };

function makeChain(len: number) {
  let v = randInt(2, 12);
  const startV = v;
  const steps: Step[] = [];
  for (let k = 0; k < len; k++) {
    const options: Step[] = [];
    const a = randInt(2, 9);
    options.push({ label: `+ ${a}`, apply: (x) => x + a });
    if (v - a >= 0) options.push({ label: `− ${a}`, apply: (x) => x - a });
    if (v <= 25) { const m = randInt(2, 3); options.push({ label: `× ${m}`, apply: (x) => x * m }); }
    for (const dv of [2, 3, 4, 5]) if (v > 0 && v % dv === 0 && v / dv >= 2) options.push({ label: `÷ ${dv}`, apply: (x) => x / dv });
    const s = pick(options);
    v = s.apply(v);
    steps.push(s);
  }
  return { start: startV, steps, answer: v };
}

export function ChainCalc({ onDone }: GameProps) {
  const [level, setLevel] = useState(1);
  const [phase, setPhase] = useState<"idle" | "watch" | "answer" | "result">("idle");
  const [chain, setChain] = useState<{ start: number; steps: Step[]; answer: number }>({ start: 0, steps: [], answer: 0 });
  const [shown, setShown] = useState<string>("");
  const [k, setK] = useState(0);
  const [val, setVal] = useState("");
  const [best, setBest] = useState(0);
  const timers = useRef<number[]>([]);
  const clear = () => { timers.current.forEach((t) => window.clearTimeout(t)); timers.current = []; };
  useEffect(() => clear, []);

  const len = level + 3;
  const speed = Math.max(1100, 2000 - level * 100);
  const play = (lv: number) => {
    clear();
    const c = makeChain(lv + 3);
    setLevel(lv);
    setChain(c);
    setVal("");
    setPhase("watch");
    setShown(String(c.start));
    setK(0);
    const sp = Math.max(1100, 2000 - lv * 100);
    c.steps.forEach((s, idx) => {
      timers.current.push(window.setTimeout(() => { setShown(s.label); setK(idx + 1); tone(500, 80); }, sp * (idx + 1)));
    });
    timers.current.push(window.setTimeout(() => setPhase("answer"), sp * (c.steps.length + 1)));
  };
  const submit = () => {
    if (!val) return;
    setPhase("result");
    const ok = parseInt(val, 10) === chain.answer;
    const top = ok ? Math.max(best, level) : best;
    if (ok) celebrate();
    setBest(top);
    onDone(top ? `cleared a ${top + 3}-step chain` : "still training");
  };
  const right = parseInt(val, 10) === chain.answer;

  return (
    <Stage>
      {phase === "idle" && (
        <StartCard emoji="🧮" title="Keep the total in your head" onStart={() => play(1)}>
          A starting number, then steps flash one by one. No writing, no fingers! Each level adds a step and gets faster.
        </StartCard>
      )}
      {phase !== "idle" && (
        <>
          <Hud items={[["Level", level], ["Steps", len]]} />
          {phase === "watch" && (
            <>
              <p className="mt-6 text-sm font-bold tracking-widest text-ink-soft uppercase">{k === 0 ? "Start with" : `Step ${k} of ${len}`}</p>
              <motion.p key={`${k}-${shown}`} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="font-display text-8xl font-bold">
                {shown}
              </motion.p>
              <div className="mt-4 w-full max-w-xs"><Bar pct={k / len} className="bg-grape" /></div>
              <p className="mt-2 text-xs text-ink-soft">{(speed / 1000).toFixed(1)}s per step</p>
            </>
          )}
          {phase === "answer" && (
            <form className="mt-6" onSubmit={(e) => { e.preventDefault(); submit(); }}>
              <p className="font-display text-2xl font-bold">What&apos;s the total?</p>
              <div className="mt-3 flex justify-center gap-2">
                <input
                  autoFocus
                  inputMode="numeric"
                  value={val}
                  onChange={(e) => setVal(e.target.value.replace(/\D/g, ""))}
                  className="w-32 rounded-2xl border-2 border-ink bg-white px-4 py-3 text-center font-display text-3xl font-bold outline-none focus:ring-4 focus:ring-sun/60"
                />
                <Button type="submit" variant="teal">Check</Button>
              </div>
            </form>
          )}
          {phase === "result" && (
            <div className="mt-6">
              <p className="font-display text-3xl font-bold">{right ? "✅ Correct!" : `❌ It was ${chain.answer}`}</p>
              <p className="mt-2 text-ink-soft">
                {chain.start} {chain.steps.map((s) => s.label).join(" ")} = <b>{chain.answer}</b>
              </p>
              <div className="mt-4 flex justify-center gap-2">
                {right ? (
                  <Button variant="grape" onClick={() => play(level + 1)}>Level {level + 1} <ArrowRight size={16} /></Button>
                ) : (
                  <Button variant="white" onClick={() => play(Math.max(1, level - 1))}><RotateCcw size={16} /> Try again</Button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </Stage>
  );
}

/* ---------------- 29. Budget Boss (Prioritising) ---------------- */

type Item = { e: string; name: string; cost: number; pts: number };
const MISSIONS: { title: string; budget: number; unit: string; items: Item[] }[] = [
  {
    title: "🏝️ Stranded on an island — pack your 15 kg bag",
    budget: 15,
    unit: "kg",
    items: [
      { e: "💧", name: "Water", cost: 6, pts: 10 },
      { e: "🔪", name: "Pocket knife", cost: 1, pts: 7 },
      { e: "🔦", name: "Torch", cost: 2, pts: 5 },
      { e: "⛺", name: "Tent", cost: 7, pts: 8 },
      { e: "🥫", name: "Canned food", cost: 5, pts: 8 },
      { e: "🎣", name: "Fishing kit", cost: 2, pts: 6 },
      { e: "🩹", name: "First aid", cost: 2, pts: 7 },
      { e: "📱", name: "Phone (no signal)", cost: 1, pts: 1 },
      { e: "🔥", name: "Fire starter", cost: 1, pts: 8 },
      { e: "🎮", name: "Game console", cost: 3, pts: 1 },
    ],
  },
  {
    title: "🎉 Plan the class party — 100 coins",
    budget: 100,
    unit: "coins",
    items: [
      { e: "🍕", name: "Pizza", cost: 40, pts: 9 },
      { e: "🎵", name: "Speaker hire", cost: 25, pts: 7 },
      { e: "🎈", name: "Decorations", cost: 15, pts: 4 },
      { e: "🥤", name: "Drinks", cost: 20, pts: 8 },
      { e: "🎂", name: "Big cake", cost: 35, pts: 8 },
      { e: "🎁", name: "Prizes", cost: 20, pts: 6 },
      { e: "📸", name: "Photo booth", cost: 30, pts: 5 },
      { e: "🍿", name: "Popcorn", cost: 10, pts: 5 },
    ],
  },
  {
    title: "📚 Exam week — 10 free hours",
    budget: 10,
    unit: "hours",
    items: [
      { e: "➗", name: "Maths practice", cost: 3, pts: 9 },
      { e: "🔬", name: "Science revision", cost: 3, pts: 8 },
      { e: "😴", name: "Extra sleep", cost: 2, pts: 7 },
      { e: "📺", name: "TV series", cost: 3, pts: 2 },
      { e: "⚽", name: "Football", cost: 2, pts: 5 },
      { e: "📖", name: "English essay", cost: 2, pts: 6 },
      { e: "📱", name: "Scrolling", cost: 2, pts: 1 },
      { e: "🧘", name: "Walk & breathe", cost: 1, pts: 4 },
    ],
  },
];

function bestScore(items: Item[], budget: number) {
  let best = 0;
  for (let mask = 0; mask < 1 << items.length; mask++) {
    let c = 0, p = 0;
    for (let k = 0; k < items.length; k++) if (mask & (1 << k)) { c += items[k].cost; p += items[k].pts; }
    if (c <= budget && p > best) best = p;
  }
  return best;
}

export function BudgetBoss({ onDone }: GameProps) {
  const [m, setM] = useState(-1);
  const [picked, setPicked] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);

  const mission = MISSIONS[Math.max(0, m)];
  const cost = picked.reduce((s, k) => s + mission.items[k].cost, 0);
  const pts = picked.reduce((s, k) => s + mission.items[k].pts, 0);
  const best = m >= 0 ? bestScore(mission.items, mission.budget) : 0;

  const load = (k: number) => { setM(k); setPicked([]); setLocked(false); };
  const toggle = (k: number) => {
    if (locked) return;
    if (picked.includes(k)) setPicked(picked.filter((x) => x !== k));
    else if (cost + mission.items[k].cost <= mission.budget) setPicked([...picked, k]);
    else tone(160, 250);
  };
  const lock = () => {
    setLocked(true);
    if (pts === best) celebrate("big");
    if (m === MISSIONS.length - 1) onDone(`last mission: ${pts}/${best} points`);
  };

  return (
    <Stage className="!justify-start">
      {m === -1 ? (
        <div className="my-auto">
          <StartCard emoji="💰" title="You can't have it all" onStart={() => load(0)}>
            Three missions. Pick items within the limit to score the most points. Can you find the <b>best possible</b> plan?
          </StartCard>
        </div>
      ) : (
        <>
          <Hud items={[["Mission", `${m + 1}/${MISSIONS.length}`], ["Points", pts]]} />
          <p className="mt-10 font-display text-xl font-bold sm:text-2xl">{mission.title}</p>
          <div className="mt-3 w-full max-w-lg">
            <Bar pct={cost / mission.budget} className={cost === mission.budget ? "bg-teal" : "bg-sun"} />
            <p className="mt-1 text-sm font-semibold">Used {cost} / {mission.budget} {mission.unit}</p>
          </div>
          <div className="mt-4 grid w-full max-w-3xl grid-cols-2 gap-2 sm:grid-cols-4">
            {mission.items.map((it, k) => {
              const on = picked.includes(k);
              const tooMuch = !on && cost + it.cost > mission.budget;
              return (
                <button
                  key={it.name}
                  onClick={() => toggle(k)}
                  className={`rounded-2xl border-2 border-ink p-2 text-left transition ${on ? "bg-sun" : "bg-white"} ${tooMuch ? "opacity-40" : ""}`}
                >
                  <span className="text-2xl">{it.e}</span>
                  <span className="block text-sm leading-tight font-bold">{it.name}</span>
                  <span className="text-xs text-ink-soft">{it.cost} {mission.unit} · ⭐ {it.pts}</span>
                </button>
              );
            })}
          </div>
          {!locked ? (
            <Button className="mt-4" variant="teal" onClick={lock} disabled={!picked.length}>Lock in my plan</Button>
          ) : (
            <div className="mt-4">
              <p className="font-display text-2xl font-bold">
                {pts} / {best} points {pts === best ? "🏆 Perfect priorities!" : pts >= best * 0.85 ? "👍 Very close!" : "🤔 There's a better mix"}
              </p>
              <div className="mt-2 flex justify-center gap-2">
                {pts < best && <Button variant="white" onClick={() => setLocked(false)}>Improve it</Button>}
                {m < MISSIONS.length - 1 && <Button variant="grape" onClick={() => load(m + 1)}>Next mission <ArrowRight size={16} /></Button>}
                {m === MISSIONS.length - 1 && <Button variant="white" onClick={() => load(0)}><RotateCcw size={16} /> Start over</Button>}
              </div>
            </div>
          )}
        </>
      )}
    </Stage>
  );
}

/* ---------------- 30. Arrow Storm (Composure) ---------------- */

const STORM_ROUNDS = 30;
type Storm = { dir: "L" | "R"; flank: "L" | "R"; red: boolean };

export function ArrowStorm({ onDone }: GameProps) {
  const [phase, setPhase] = useState<"idle" | "play" | "done">("idle");
  const [trial, setTrial] = useState<Storm | null>(null);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [flash, setFlash] = useState<"good" | "bad" | null>(null);
  const [limit, setLimit] = useState(1600);
  const answered = useRef(false);
  const scoreRef = useRef(0);
  const timer = useRef<number | null>(null);
  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  function next(r: number) {
    if (r >= STORM_ROUNDS) {
      setPhase("done");
      setTrial(null);
      if (scoreRef.current >= 26) celebrate("big");
      onDone(`${scoreRef.current}/${STORM_ROUNDS} under pressure`);
      return;
    }
    const ms = Math.max(700, 1600 - Math.floor(r / 5) * 180);
    setLimit(ms);
    const dir = pick(["L", "R"] as const);
    setTrial({ dir, flank: chance(0.5) ? dir : dir === "L" ? "R" : "L", red: r >= 4 && chance(0.35) });
    setRound(r);
    answered.current = false;
    timer.current = window.setTimeout(() => {
      if (!answered.current) { setFlash("bad"); window.setTimeout(() => setFlash(null), 200); }
      answered.current = true;
      timer.current = window.setTimeout(() => next(r + 1), 250);
    }, ms);
  }

  function answer(side: "L" | "R") {
    if (phase !== "play" || !trial || answered.current) return;
    answered.current = true;
    const want = trial.red ? (trial.dir === "L" ? "R" : "L") : trial.dir;
    const ok = side === want;
    if (ok) { scoreRef.current += 1; setScore(scoreRef.current); }
    setFlash(ok ? "good" : "bad");
    window.setTimeout(() => setFlash(null), 180);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => next(round + 1), 250);
  }
  // keyboard always calls the latest answer() without re-binding every render
  const answerRef = useRef(answer);
  useEffect(() => { answerRef.current = answer; });

  useEffect(() => {
    if (phase !== "play") return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") answerRef.current("L");
      if (e.key === "ArrowRight") answerRef.current("R");
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [phase]);

  const begin = () => { scoreRef.current = 0; setScore(0); setPhase("play"); next(0); };
  const arrow = (d: "L" | "R") => (d === "L" ? "⬅" : "➡");

  return (
    <Stage className={flash === "good" ? "bg-teal-soft" : flash === "bad" ? "bg-blush" : ""}>
      {phase === "idle" && (
        <StartCard emoji="🌪️" title="Middle arrow only. Red = opposite." onStart={begin}>
          Press the way the <b>middle</b> arrow points (arrow keys work). If the arrows are <b className="text-berry">RED</b>, press the <b>opposite</b>. It speeds up every 5 rounds. Stay calm!
        </StartCard>
      )}
      {phase === "play" && trial && (
        <>
          <Hud items={[["Round", `${round + 1}/${STORM_ROUNDS}`], ["Score", score]]} />
          <p className="mt-6 text-xs font-bold text-ink-soft">{(limit / 1000).toFixed(1)}s per arrow</p>
          <motion.p
            key={round}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`my-6 font-display text-6xl tracking-widest sm:text-7xl ${trial.red ? "text-berry" : "text-ink"}`}
          >
            {arrow(trial.flank)}{arrow(trial.flank)}
            <span className="mx-1 inline-block rounded-xl border-2 border-dashed border-ink/30 px-1">{arrow(trial.dir)}</span>
            {arrow(trial.flank)}{arrow(trial.flank)}
          </motion.p>
          <div className="grid w-full max-w-md grid-cols-2 gap-3">
            <button onClick={() => answer("L")} className="btn-pop flex items-center justify-center rounded-2xl border-2 border-ink bg-white py-5"><ArrowLeft size={32} /></button>
            <button onClick={() => answer("R")} className="btn-pop flex items-center justify-center rounded-2xl border-2 border-ink bg-white py-5"><ArrowRight size={32} /></button>
          </div>
        </>
      )}
      {phase === "done" && (
        <ResultCard emoji={score >= 26 ? "🧊" : "🌪️"} title={`${score} / ${STORM_ROUNDS} in the storm`} onAgain={begin}>
          {score >= 26 ? "Ice cold! You stayed calm when it got fast." : "Pressure makes us rush. Try one slow breath before you start, and keep your eyes on the middle only."}
        </ResultCard>
      )}
    </Stage>
  );
}
