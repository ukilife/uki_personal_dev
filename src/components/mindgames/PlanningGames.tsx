"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Delete, Lightbulb, Play, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";
import { Hud, ResultCard, Stage, StartCard, pick, randInt, type GameProps, now } from "./kit";

/* ---------------- 4. Tower Shift (Planning) ---------------- */

const DISC_COLOURS = ["bg-coral", "bg-sun", "bg-teal", "bg-sky-deep", "bg-grape"];

export function TowerShift({ onDone }: GameProps) {
  const [discs, setDiscs] = useState(0);
  const [pegs, setPegs] = useState<number[][]>([[], [], []]);
  const [held, setHeld] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [shake, setShake] = useState<number | null>(null);

  const begin = (n: number) => {
    setDiscs(n);
    setPegs([[...Array(n).keys()].map((i) => n - i), [], []]); // bottom → top, bigger number = bigger disc
    setHeld(null);
    setMoves(0);
    setWon(false);
  };
  const tapPeg = (p: number) => {
    if (won) return;
    if (held === null) {
      if (pegs[p].length) setHeld(p);
      return;
    }
    if (held === p) return setHeld(null);
    const disc = pegs[held][pegs[held].length - 1];
    const top = pegs[p][pegs[p].length - 1];
    if (top !== undefined && top < disc) {
      setShake(p);
      window.setTimeout(() => setShake(null), 400);
      setHeld(null);
      return;
    }
    const np = pegs.map((x) => [...x]);
    np[held].pop();
    np[p].push(disc);
    setPegs(np);
    setHeld(null);
    const m = moves + 1;
    setMoves(m);
    if (np[2].length === discs) {
      setWon(true);
      if (m === 2 ** discs - 1) celebrate("big");
      else celebrate();
      onDone(`${discs} discs in ${m} moves (best ${2 ** discs - 1})`);
    }
  };
  const best = 2 ** discs - 1;

  return (
    <Stage>
      {discs === 0 && (
        <div className="max-w-md">
          <span className="text-6xl">🗼</span>
          <p className="mt-2 font-display text-2xl font-bold">Move the tower to the last peg</p>
          <p className="mt-2 text-ink-soft">One disc at a time. A bigger disc can never sit on a smaller one. Tap a peg to lift, tap another to drop.</p>
          <div className="mt-5 flex justify-center gap-3">
            <Button variant="teal" onClick={() => begin(3)}>3 discs</Button>
            <Button variant="grape" onClick={() => begin(4)}>4 discs</Button>
            <Button variant="coral" onClick={() => begin(5)}>5 discs</Button>
          </div>
        </div>
      )}
      {discs > 0 && (
        <>
          <Hud items={[["Moves", moves], ["Best possible", best]]} />
          <div className="mt-10 grid w-full max-w-2xl grid-cols-3 gap-2 sm:gap-4">
            {pegs.map((peg, p) => (
              <motion.button
                key={p}
                onClick={() => tapPeg(p)}
                animate={shake === p ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
                aria-label={`peg ${p + 1}`}
                className={`relative flex h-56 flex-col-reverse items-center rounded-2xl border-2 pb-2 transition ${held === p ? "border-ink bg-sun-soft" : "border-transparent hover:bg-sky/50"}`}
              >
                <span className="absolute bottom-2 h-[85%] w-2 rounded-full bg-ink/70" />
                <span className="absolute bottom-0 h-2 w-full rounded-full bg-ink" />
                {peg.map((d, i) => (
                  <motion.span
                    layout
                    key={d}
                    animate={{ y: held === p && i === peg.length - 1 ? -18 : 0 }}
                    className={`relative z-10 mb-0.5 h-6 rounded-full border-2 border-ink ${DISC_COLOURS[(d - 1) % DISC_COLOURS.length]}`}
                    style={{ width: `${25 + (d / discs) * 70}%` }}
                  />
                ))}
              </motion.button>
            ))}
          </div>
          <p className="mt-3 text-sm text-ink-soft">{held !== null ? "Now tap where it should go." : "Tap a peg to lift its top disc."}</p>
          {won ? (
            <div className="mt-4">
              <p className="font-display text-2xl font-bold">
                Done in {moves} moves! {moves === best ? "🏆 Perfect plan!" : `(The perfect plan takes ${best}.)`}
              </p>
              <div className="mt-3 flex justify-center gap-2">
                <Button variant="white" onClick={() => begin(discs)}><RotateCcw size={16} /> Again</Button>
                {discs < 5 && <Button variant="grape" onClick={() => begin(discs + 1)}>Try {discs + 1} discs</Button>}
              </div>
            </div>
          ) : (
            <button onClick={() => begin(discs)} className="mt-3 text-sm font-semibold text-ink-soft underline">Restart</button>
          )}
        </>
      )}
    </Stage>
  );
}

/* ---------------- 5. Robot Route (Step-by-step thinking) ---------------- */

const LEVELS = [
  ["S..#..", ".#.#..", ".#...#", ".####.", "......", "#.#..G"],
  ["S.#...", "..#.#.", "#...#.", ".##.#.", "....#G", "......"],
  ["..#..G", "#.#.#.", "S.#.#.", ".#..#.", "...#..", "......"],
];
type Dir = "U" | "D" | "L" | "R";
const DIRS: Record<Dir, [number, number]> = { U: [-1, 0], D: [1, 0], L: [0, -1], R: [0, 1] };
const DIR_ICON = { U: ArrowUp, D: ArrowDown, L: ArrowLeft, R: ArrowRight };

function findCell(level: string[], ch: string): [number, number] {
  for (let r = 0; r < level.length; r++) {
    const c = level[r].indexOf(ch);
    if (c >= 0) return [r, c];
  }
  return [0, 0];
}

export function RobotRoute({ onDone }: GameProps) {
  const [lv, setLv] = useState(0);
  const [prog, setProg] = useState<Dir[]>([]);
  const [pos, setPos] = useState<[number, number]>(() => findCell(LEVELS[0], "S"));
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(-1);
  const [result, setResult] = useState<null | "win" | "crash" | "short">(null);
  const [tries, setTries] = useState(1);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const level = LEVELS[lv];
  const reset = (keepProg = true) => {
    timers.current.forEach((t) => window.clearTimeout(t));
    setPos(findCell(level, "S"));
    setStep(-1);
    setRunning(false);
    setResult(null);
    if (!keepProg) setProg([]);
  };
  const add = (d: Dir) => { if (!running && prog.length < 24) { setResult(null); setPos(findCell(level, "S")); setProg([...prog, d]); } };
  const run = () => {
    if (!prog.length) return;
    reset();
    setRunning(true);
    let [r, c] = findCell(level, "S");
    let i = 0;
    for (; i < prog.length; i++) {
      const [dr, dc] = DIRS[prog[i]];
      r += dr;
      c += dc;
      const crash = r < 0 || c < 0 || r >= 6 || c >= 6 || level[r][c] === "#";
      const idx = i;
      const p: [number, number] = [r, c];
      timers.current.push(window.setTimeout(() => { setStep(idx); if (!crash) setPos(p); }, 450 * (i + 1)));
      if (crash) {
        timers.current.push(window.setTimeout(() => { setResult("crash"); setRunning(false); }, 450 * (i + 1) + 100));
        return;
      }
      if (level[r][c] === "G") {
        const moves = i + 1;
        timers.current.push(window.setTimeout(() => {
          setResult("win");
          setRunning(false);
          celebrate();
          if (lv === LEVELS.length - 1) onDone(`all ${LEVELS.length} routes, ${tries} tries on the last`);
        }, 450 * moves + 100));
        return;
      }
    }
    timers.current.push(window.setTimeout(() => { setResult("short"); setRunning(false); }, 450 * i + 100));
  };
  const nextLevel = () => {
    const n = (lv + 1) % LEVELS.length;
    setLv(n);
    setProg([]);
    setPos(findCell(LEVELS[n], "S"));
    setStep(-1);
    setResult(null);
    setTries(1);
  };

  return (
    <Stage className="!justify-start">
      <Hud items={[["Route", `${lv + 1}/${LEVELS.length}`], ["Steps", prog.length]]} />
      <div className="mt-10 flex w-full flex-col items-center gap-5 md:flex-row md:items-start md:justify-center">
        <div className="grid w-64 grid-cols-6 gap-1 rounded-2xl border-2 border-ink bg-mint p-1.5 sm:w-72">
          {level.flatMap((row, r) =>
            row.split("").map((ch, c) => {
              const here = pos[0] === r && pos[1] === c;
              return (
                <div key={`${r}-${c}`} className={`grid aspect-square place-items-center rounded-md text-xl ${ch === "#" ? "bg-ink/80" : "bg-white"}`}>
                  {here ? (result === "crash" ? "💥" : "🤖") : ch === "G" ? "⭐" : ch === "#" ? "🪨" : ""}
                </div>
              );
            }),
          )}
        </div>
        <div className="w-full max-w-xs">
          <p className="text-left text-sm font-bold text-ink-soft">Your program</p>
          <div className="mt-1 flex min-h-14 flex-wrap gap-1 rounded-2xl border-2 border-dashed border-ink/40 bg-white p-2">
            {prog.length === 0 && <span className="text-sm text-ink-soft">Tap arrows to add steps…</span>}
            {prog.map((d, i) => {
              const I = DIR_ICON[d];
              return (
                <span key={i} className={`grid h-8 w-8 place-items-center rounded-lg border-2 border-ink ${i === step ? (result === "crash" ? "bg-berry text-white" : "bg-sun") : "bg-sky"}`}>
                  <I size={16} />
                </span>
              );
            })}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <span />
            <button onClick={() => add("U")} className="btn-pop grid h-12 place-items-center rounded-xl border-2 border-ink bg-white" aria-label="up"><ArrowUp /></button>
            <span />
            <button onClick={() => add("L")} className="btn-pop grid h-12 place-items-center rounded-xl border-2 border-ink bg-white" aria-label="left"><ArrowLeft /></button>
            <button onClick={() => add("D")} className="btn-pop grid h-12 place-items-center rounded-xl border-2 border-ink bg-white" aria-label="down"><ArrowDown /></button>
            <button onClick={() => add("R")} className="btn-pop grid h-12 place-items-center rounded-xl border-2 border-ink bg-white" aria-label="right"><ArrowRight /></button>
          </div>
          <div className="mt-3 flex gap-2">
            <Button variant="teal" className="flex-1" onClick={run} disabled={running || !prog.length}><Play size={16} /> Run</Button>
            <Button variant="white" className="px-3" onClick={() => !running && setProg(prog.slice(0, -1))} title="Undo"><Delete size={16} /></Button>
            <Button variant="white" className="px-3" onClick={() => reset(false)} title="Clear"><Trash2 size={16} /></Button>
          </div>
        </div>
      </div>
      {result && (
        <div className="mt-5">
          {result === "win" && (
            <>
              <p className="font-display text-xl font-bold">⭐ Your plan worked{prog.length ? "" : ""}!</p>
              <Button className="mt-2" variant="grape" onClick={nextLevel}>{lv === LEVELS.length - 1 ? "Play from route 1" : "Next route"} <ArrowRight size={16} /></Button>
            </>
          )}
          {result === "crash" && <p className="font-display text-lg font-bold">💥 Crash at step {step + 1}! Fix that step and run again.</p>}
          {result === "short" && <p className="font-display text-lg font-bold">🤔 The robot stopped before the star. Add more steps.</p>}
          {result !== "win" && (
            <button onClick={() => { reset(); setTries(tries + 1); }} className="mt-1 text-sm font-semibold underline">Back to start</button>
          )}
        </div>
      )}
    </Stage>
  );
}

/* ---------------- 10. Weigh It Up (Problem solving) ---------------- */

const PUZZLES = [
  { clues: ["🍎 + 🍎 = 10", "🍎 + 🍌 = 8"], ask: "🍌 = ?", a: 3, hint: "Start with the first line: two apples make 10, so one apple is…" },
  { clues: ["🐱 + 🐱 + 🐱 = 15", "🐱 + 🐶 = 12"], ask: "🐶 = ?", a: 7, hint: "Three cats = 15. So one cat = 5." },
  { clues: ["⭐ × ⭐ = 16", "⭐ + 🌙 = 10"], ask: "🌙 = ?", a: 6, hint: "Which number times itself makes 16?" },
  { clues: ["🚗 + 🚗 = 20", "🚗 − 🚲 = 6"], ask: "🚲 + 🚗 = ?", a: 14, hint: "Find the car first, then the bike." },
  { clues: ["🎈 + 🎈 + 🎈 = 12", "🎁 + 🎈 = 10"], ask: "🎁 × 🎈 = ?", a: 24, hint: "One balloon is 4. What's left for the gift?" },
  { clues: ["🐝 + 🌻 = 9", "🐝 − 🌻 = 1"], ask: "🐝 = ?", a: 5, hint: "Two numbers that add to 9 and are 1 apart." },
  { clues: ["🍕 + 🍕 + 🍩 = 17", "🍕 + 🍩 = 11"], ask: "🍩 = ?", a: 5, hint: "Compare the two lines. What's the only difference?" },
  { clues: ["🍉 + 🍉 + 🍇 = 13", "🍇 + 🍇 + 🍉 = 11"], ask: "🍉 = ?", a: 5, hint: "Add both lines: 3 melons + 3 grapes = 24, so one melon + one grape = 8." },
];

export function WeighItUp({ onDone }: GameProps) {
  const [i, setI] = useState(-1);
  const [val, setVal] = useState("");
  const [state, setState] = useState<"ask" | "right" | "wrong">("ask");
  const [hint, setHint] = useState(false);
  const [firstTry, setFirstTry] = useState(0);
  const [missed, setMissed] = useState(false);

  const p = PUZZLES[i];
  const load = (n: number) => { setI(n); setVal(""); setState("ask"); setHint(false); setMissed(false); };
  const check = () => {
    if (!val) return;
    if (parseInt(val, 10) === p.a) {
      setState("right");
      if (!missed && !hint) setFirstTry((f) => f + 1);
    } else {
      setState("wrong");
      setMissed(true);
    }
  };
  const next = () => {
    if (i + 1 >= PUZZLES.length) {
      setI(PUZZLES.length);
      celebrate();
      onDone(`${firstTry}/${PUZZLES.length} solved first try`);
    } else load(i + 1);
  };

  return (
    <Stage>
      {i === -1 && (
        <StartCard emoji="⚖️" title="Picture puzzles" onStart={() => { setFirstTry(0); load(0); }}>
          Each picture stands for a number. Use the clues you <b>know</b> to unlock the one you don&apos;t.
        </StartCard>
      )}
      {i >= 0 && i < PUZZLES.length && p && (
        <>
          <Hud items={[["Puzzle", `${i + 1}/${PUZZLES.length}`], ["First try", firstTry]]} />
          <div className="mt-8 space-y-2">
            {p.clues.map((c) => (
              <p key={c} className="rounded-2xl border-2 border-ink bg-white px-6 py-2 font-display text-3xl font-bold sm:text-4xl">{c}</p>
            ))}
            <p className="rounded-2xl border-2 border-ink bg-sun px-6 py-2 font-display text-3xl font-bold sm:text-4xl">{p.ask}</p>
          </div>
          {state !== "right" ? (
            <form className="mt-5 flex flex-wrap justify-center gap-2" onSubmit={(e) => { e.preventDefault(); check(); }}>
              <input
                value={val}
                inputMode="numeric"
                onChange={(e) => { setVal(e.target.value.replace(/\D/g, "")); setState("ask"); }}
                className={`w-28 rounded-2xl border-2 border-ink px-4 py-3 text-center font-display text-2xl font-bold outline-none ${state === "wrong" ? "bg-blush" : "bg-white"}`}
                placeholder="?"
              />
              <Button type="submit" variant="teal">Check</Button>
              {!hint && <Button variant="white" onClick={() => setHint(true)}><Lightbulb size={16} /> Hint</Button>}
            </form>
          ) : (
            <div className="mt-5">
              <p className="font-display text-2xl font-bold">✅ {p.ask.replace("?", String(p.a))}</p>
              <Button className="mt-3" variant="grape" onClick={next}>{i + 1 >= PUZZLES.length ? "Finish" : "Next puzzle"} <ArrowRight size={16} /></Button>
            </div>
          )}
          {state === "wrong" && <p className="mt-2 font-semibold text-berry">Not yet — check each clue again.</p>}
          {hint && state !== "right" && <p className="mt-3 text-ink-soft">💡 {p.hint}</p>}
        </>
      )}
      {i >= PUZZLES.length && (
        <ResultCard emoji="🧮" title={`${firstTry} of ${PUZZLES.length} solved on the first try`} onAgain={() => { setFirstTry(0); load(0); }}>
          Every puzzle started the same way: find the one thing you can be sure of, then build from it.
        </ResultCard>
      )}
    </Stage>
  );
}

/* ---------------- 14. Ripple Lights (Cause & effect) ---------------- */

const RIPPLE_LEVELS = [
  { n: 3, presses: 2 },
  { n: 3, presses: 3 },
  { n: 4, presses: 3 },
  { n: 4, presses: 5 },
];

function press(board: boolean[], n: number, i: number) {
  const b = [...board];
  const r = Math.floor(i / n), c = i % n;
  for (const [dr, dc] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const rr = r + dr, cc = c + dc;
    if (rr >= 0 && cc >= 0 && rr < n && cc < n) b[rr * n + cc] = !b[rr * n + cc];
  }
  return b;
}

export function RippleLights({ onDone }: GameProps) {
  const [lv, setLv] = useState(-1);
  const [board, setBoard] = useState<boolean[]>([]);
  const [start, setStart] = useState<boolean[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const load = (l: number) => {
    const { n, presses } = RIPPLE_LEVELS[l];
    let b: boolean[] = [];
    do {
      b = Array(n * n).fill(false);
      const used = new Set<number>();
      while (used.size < presses) used.add(randInt(0, n * n - 1));
      used.forEach((i) => (b = press(b, n, i)));
    } while (b.every((x) => !x));
    setLv(l);
    setBoard(b);
    setStart(b);
    setMoves(0);
    setWon(false);
  };
  const n = lv >= 0 ? RIPPLE_LEVELS[lv].n : 3;
  const tap = (i: number) => {
    if (won) return;
    const b = press(board, n, i);
    setBoard(b);
    setMoves(moves + 1);
    if (b.every((x) => !x)) {
      setWon(true);
      celebrate();
      if (lv === RIPPLE_LEVELS.length - 1) onDone(`all ${RIPPLE_LEVELS.length} boards cleared`);
    }
  };

  return (
    <Stage>
      {lv === -1 && (
        <StartCard emoji="💡" title="Switch every light off" onStart={() => load(0)}>
          Each tap flips that light <b>and its neighbours</b> (up, down, left, right). Think before you tap!
        </StartCard>
      )}
      {lv >= 0 && (
        <>
          <Hud items={[["Board", `${lv + 1}/${RIPPLE_LEVELS.length}`], ["Taps", moves]]} />
          <p className="mt-8 mb-3 text-sm text-ink-soft">Can be solved in {RIPPLE_LEVELS[lv].presses} taps or fewer.</p>
          <div className="grid w-full max-w-xs gap-2" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
            {board.map((on, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.9 }}
                onClick={() => tap(i)}
                aria-label={`light ${i + 1} ${on ? "on" : "off"}`}
                className={`aspect-square rounded-2xl border-2 border-ink text-3xl transition-colors ${on ? "bg-sun shadow-[0_0_24px_rgba(255,201,60,0.9)]" : "bg-ink/80"}`}
              >
                {on ? "💡" : ""}
              </motion.button>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {won ? (
              lv < RIPPLE_LEVELS.length - 1 ? (
                <Button variant="grape" onClick={() => load(lv + 1)}>All dark! Next board <ArrowRight size={16} /></Button>
              ) : (
                <ResultCard emoji="🌑" title="All boards cleared!" onAgain={() => load(0)}>
                  You learned to predict the ripples before tapping. That&apos;s cause-and-effect thinking.
                </ResultCard>
              )
            ) : (
              <>
                <Button variant="white" onClick={() => { setBoard(start); setMoves(0); }}><RotateCcw size={16} /> Reset board</Button>
                <Button variant="white" onClick={() => load(lv)}>New board</Button>
              </>
            )}
          </div>
        </>
      )}
    </Stage>
  );
}

/* ---------------- 20. Slide Puzzle (Persistence) ---------------- */

const SOLVED = [1, 2, 3, 4, 5, 6, 7, 8, 0];
function neighbours(i: number) {
  const r = Math.floor(i / 3), c = i % 3;
  return [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].filter(([a, b]) => a >= 0 && b >= 0 && a < 3 && b < 3).map(([a, b]) => a * 3 + b);
}
function scramble(steps: number): number[] {
  const t = [...SOLVED];
  let blank = 8, prev = -1;
  for (let s = 0; s < steps; s++) {
    const opts = neighbours(blank).filter((x) => x !== prev);
    const nxt = pick(opts);
    [t[blank], t[nxt]] = [t[nxt], t[blank]];
    prev = blank;
    blank = nxt;
  }
  return t.join() === SOLVED.join() ? scramble(steps) : t;
}

export function SlidePuzzle({ onDone }: GameProps) {
  const [tiles, setTiles] = useState<number[] | null>(null);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [secs, setSecs] = useState(0);
  const t0 = useRef(0);

  useEffect(() => {
    if (!tiles || won) return;
    const iv = window.setInterval(() => setSecs(Math.floor((now() - t0.current) / 1000)), 500);
    return () => window.clearInterval(iv);
  }, [tiles, won]);

  const begin = (steps: number) => {
    setTiles(scramble(steps));
    setMoves(0);
    setWon(false);
    setSecs(0);
    t0.current = now();
  };
  const tap = (i: number) => {
    if (!tiles || won) return;
    const blank = tiles.indexOf(0);
    if (!neighbours(blank).includes(i)) return;
    const t = [...tiles];
    [t[blank], t[i]] = [t[i], t[blank]];
    setTiles(t);
    setMoves(moves + 1);
    if (t.join() === SOLVED.join()) {
      setWon(true);
      celebrate("big");
      onDone(`solved in ${moves + 1} moves`);
    }
  };

  return (
    <Stage>
      {!tiles && (
        <div className="max-w-md">
          <span className="text-6xl">🧱</span>
          <p className="mt-2 font-display text-2xl font-bold">Put the tiles in order, 1 to 8</p>
          <p className="mt-2 text-ink-soft">Tap a tile next to the gap to slide it. It will look messier before it gets better — keep going!</p>
          <div className="mt-5 flex justify-center gap-3">
            <Button variant="teal" onClick={() => begin(18)}>Warm-up</Button>
            <Button variant="grape" onClick={() => begin(60)}>Real challenge</Button>
          </div>
        </div>
      )}
      {tiles && (
        <>
          <Hud items={[["Moves", moves], ["⏱", `${secs}s`]]} />
          <div className="mt-8 grid w-64 grid-cols-3 gap-2 rounded-2xl border-2 border-ink bg-ink/10 p-2 sm:w-72">
            {tiles.map((v, i) => (
              <motion.button
                layout
                key={v}
                onClick={() => tap(i)}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                className={`grid aspect-square place-items-center rounded-xl font-display text-4xl font-bold ${v === 0 ? "invisible" : `border-2 border-ink ${won ? "bg-teal text-white" : v === i + 1 ? "bg-sun" : "bg-white"}`}`}
              >
                {v || ""}
              </motion.button>
            ))}
          </div>
          {won ? (
            <div className="mt-5">
              <p className="font-display text-2xl font-bold">Solved in {moves} moves! 🏆</p>
              <p className="text-ink-soft">You kept going even when it looked worse. That&apos;s persistence.</p>
              <div className="mt-3 flex justify-center gap-2">
                <Button variant="white" onClick={() => begin(18)}>Warm-up</Button>
                <Button variant="grape" onClick={() => begin(60)}>Real challenge</Button>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-ink-soft">Tip: solve the top row first, then the left column. Then the rest is small. Yellow = in the right spot.</p>
          )}
        </>
      )}
    </Stage>
  );
}
