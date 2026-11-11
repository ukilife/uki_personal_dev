"use client";

import { AnimatePresence, motion, useAnimationControls } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Hand, Minus, Play, Plus, RotateCcw, Trophy } from "lucide-react";
import { Button, Reveal, Stop } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";

const BUTTONS = 5;
type TeamId = "blue" | "red";
const TEAM = {
  blue: { name: "Team Blue", bg: "bg-sky-deep", soft: "bg-sky", hex: "#2f7fc1", pass: "a", drop: "q" },
  red: { name: "Team Red", bg: "bg-berry", soft: "bg-blush", hex: "#d9345b", pass: "l", drop: "p" },
} as const;

function SewingButton({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <circle cx="16" cy="16" r="14" fill={color} stroke="#23204e" strokeWidth="2.5" />
      <circle cx="16" cy="16" r="9" fill="none" stroke="#23204e" strokeOpacity=".35" strokeWidth="1.5" />
      {[
        [12.5, 12.5],
        [19.5, 12.5],
        [12.5, 19.5],
        [19.5, 19.5],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="1.9" fill="#23204e" />
      ))}
    </svg>
  );
}

export function ButtonChallenge() {
  const [players, setPlayers] = useState(6);
  const [progress, setProgress] = useState<Record<TeamId, number>>({ blue: 0, red: 0 });
  const [drops, setDrops] = useState<Record<TeamId, number>>({ blue: 0, red: 0 });
  const [frozen, setFrozen] = useState<Record<TeamId, boolean>>({ blue: false, red: false });
  const [running, setRunning] = useState(false);
  const [ms, setMs] = useState(0);
  const [winner, setWinner] = useState<TeamId | null>(null);
  const start = useRef(0);
  const blueCtl = useAnimationControls();
  const redCtl = useAnimationControls();

  const passesPerButton = players - 1;
  const goal = BUTTONS * passesPerButton;

  const pass = useCallback(
    (t: TeamId) => {
      if (!running || winner || frozen[t]) return;
      setProgress((p) => {
        const next = Math.min(p[t] + 1, goal);
        if (next === goal) {
          setWinner(t);
          setRunning(false);
          celebrate("big");
        }
        return { ...p, [t]: next };
      });
    },
    [running, winner, frozen, goal],
  );

  const drop = useCallback(
    (t: TeamId) => {
      if (!running || winner) return;
      setDrops((d) => ({ ...d, [t]: d[t] + 1 }));
      setFrozen((f) => ({ ...f, [t]: true }));
      (t === "blue" ? blueCtl : redCtl).start({ x: [0, -12, 12, -8, 8, 0], transition: { duration: 0.45 } });
      setTimeout(() => setFrozen((f) => ({ ...f, [t]: false })), 1500);
    },
    [running, winner, blueCtl, redCtl],
  );

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setMs(Date.now() - start.current), 100);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT" || (e.target as HTMLElement)?.tagName === "TEXTAREA") return;
      const k = e.key.toLowerCase();
      if (k === TEAM.blue.pass) pass("blue");
      if (k === TEAM.red.pass) pass("red");
      if (k === TEAM.blue.drop) drop("blue");
      if (k === TEAM.red.drop) drop("red");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pass, drop]);

  const reset = () => {
    setProgress({ blue: 0, red: 0 });
    setDrops({ blue: 0, red: 0 });
    setFrozen({ blue: false, red: false });
    setWinner(null);
    setRunning(false);
    setMs(0);
  };

  const go = () => {
    reset();
    start.current = Date.now();
    setRunning(true);
  };

  const time = `${Math.floor(ms / 60000)}:${String(Math.floor((ms / 1000) % 60)).padStart(2, "0")}.${Math.floor((ms % 1000) / 100)}`;

  return (
    <Stop
      id="button-challenge"
      stop={6}
      kicker="Game 03 · Team race"
      tone="sun"
      title={
        <>
          The <span className="text-sky-deep">Button</span> <span className="text-berry">Challenge</span>
        </>
      }
      intro="Two teams. Five buttons. Fingers only! Pass every button down your line — drop one and you pick it up and keep going. First team to finish wins."
    >
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* rules + setup */}
        <Reveal className="flex flex-col gap-4">
          <div className="rounded-3xl border-2 border-ink bg-white p-5">
            <p className="font-display text-sm font-bold tracking-widest text-ink-soft uppercase">How to play</p>
            <ol className="mt-3 space-y-3 text-sm">
              {[
                ["👥", "Split into Team Blue and Team Red, standing in a line."],
                ["🤏", "Pass the buttons using your fingers only."],
                ["😬", "Dropped it? Pick it up and continue."],
                ["🏆", "First team to pass all 5 buttons wins!"],
              ].map(([e, t]) => (
                <li key={t} className="flex gap-3">
                  <span className="text-xl">{e}</span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-3xl border-2 border-ink bg-white p-5">
            <p className="font-display text-sm font-bold tracking-widest text-ink-soft uppercase">Players per team</p>
            <div className="mt-3 flex items-center justify-between">
              <button
                aria-label="Fewer players"
                onClick={() => !running && setPlayers((p) => Math.max(3, p - 1))}
                className="grid h-10 w-10 place-items-center rounded-xl border-2 border-ink bg-cream"
              >
                <Minus size={18} />
              </button>
              <span className="font-display text-4xl font-bold">{players}</span>
              <button
                aria-label="More players"
                onClick={() => !running && setPlayers((p) => Math.min(12, p + 1))}
                className="grid h-10 w-10 place-items-center rounded-xl border-2 border-ink bg-cream"
              >
                <Plus size={18} />
              </button>
            </div>
            <p className="mt-4 text-xs text-ink-soft">
              Facilitator keys: <kbd className="rounded bg-sky px-1.5 font-bold">A</kbd> Blue pass ·{" "}
              <kbd className="rounded bg-sky px-1.5 font-bold">Q</kbd> Blue drop ·{" "}
              <kbd className="rounded bg-blush px-1.5 font-bold">L</kbd> Red pass ·{" "}
              <kbd className="rounded bg-blush px-1.5 font-bold">P</kbd> Red drop
            </p>
          </div>
        </Reveal>

        {/* arena */}
        <Reveal delay={0.1} className="relative rounded-[2rem] border-2 border-ink bg-white p-5 shadow-pop-lg sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="font-display text-5xl font-bold tabular-nums">{time}</div>
            <div className="flex gap-2">
              {!running && !winner && (
                <Button onClick={go} variant="teal">
                  <Play size={18} /> {ms ? "Restart" : "3, 2, 1… Go!"}
                </Button>
              )}
              {(running || winner || ms > 0) && (
                <Button onClick={reset} variant="white">
                  <RotateCcw size={18} /> Reset
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-5">
            {(["blue", "red"] as TeamId[]).map((t) => {
              const T = TEAM[t];
              const p = progress[t];
              const delivered = Math.floor(p / passesPerButton);
              const pos = p === goal ? passesPerButton : p % passesPerButton;
              return (
                <motion.div
                  key={t}
                  animate={t === "blue" ? blueCtl : redCtl}
                  className={`rounded-3xl border-2 border-ink p-4 ${T.soft} ${winner && winner !== t ? "opacity-50" : ""}`}
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <span className={`rounded-full px-3 py-1 font-display font-bold text-white ${T.bg}`}>{T.name}</span>
                    <span className="flex items-center gap-1">
                      {Array.from({ length: BUTTONS }).map((_, i) => (
                        <motion.span
                          key={i}
                          animate={{ scale: i < delivered ? 1 : 0.75, opacity: i < delivered ? 1 : 0.3 }}
                        >
                          <SewingButton color={T.hex} size={22} />
                        </motion.span>
                      ))}
                      <span className="ml-2 text-xs font-semibold text-ink-soft">drops: {drops[t]}</span>
                    </span>
                  </div>
                  {/* the line of players */}
                  <div className="relative flex items-center justify-between px-1 py-3">
                    <div className="absolute inset-x-4 top-1/2 h-1 -translate-y-1/2 rounded-full bg-ink/10" />
                    {Array.from({ length: players }).map((_, i) => (
                      <span
                        key={i}
                        className={`relative z-0 grid h-9 w-9 place-items-center rounded-full border-2 border-ink text-sm sm:h-10 sm:w-10 ${
                          i <= pos ? "bg-white" : "bg-white/50"
                        }`}
                      >
                        {i === 0 ? "🙂" : i === players - 1 ? "🥳" : "🙂"}
                      </span>
                    ))}
                    {p < goal && (
                      <div className="pointer-events-none absolute inset-y-0 right-[22px] left-[22px]">
                        <motion.span
                          className="absolute top-1/2 z-10 -mt-[15px] -ml-[15px]"
                          animate={{
                            left: `${(pos / passesPerButton) * 100}%`,
                            rotate: frozen[t] ? 200 : pos * 120,
                            y: frozen[t] ? 26 : -22,
                          }}
                          transition={{ type: "spring", stiffness: 260, damping: 18 }}
                        >
                          <SewingButton color={T.hex} size={30} />
                        </motion.span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                    <button
                      onClick={() => pass(t)}
                      disabled={!running || !!winner || frozen[t]}
                      className={`btn-pop rounded-2xl border-2 border-ink py-3 font-display text-lg font-bold text-white disabled:opacity-40 ${T.bg}`}
                    >
                      {frozen[t] ? "Pick it up… 🫳" : "Pass! →"}
                    </button>
                    <button
                      onClick={() => drop(t)}
                      disabled={!running || !!winner}
                      className="flex items-center gap-1 rounded-2xl border-2 border-ink bg-white px-4 font-semibold disabled:opacity-40"
                    >
                      <Hand size={16} /> Dropped!
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <AnimatePresence>
            {winner && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 grid place-items-center rounded-[2rem] bg-ink/85 p-6 text-center text-cream backdrop-blur-sm"
              >
                <div>
                  <motion.div animate={{ rotate: [0, -10, 10, 0], y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
                    <Trophy size={72} className="mx-auto text-sun" />
                  </motion.div>
                  <p className="mt-3 font-display text-5xl font-bold" style={{ color: TEAM[winner].hex === "#2f7fc1" ? "#8cc8f5" : "#ff9db3" }}>
                    {TEAM[winner].name} wins!
                  </p>
                  <p className="mt-2 text-cream/80">
                    in {time} with {drops[winner]} drop{drops[winner] === 1 ? "" : "s"}
                  </p>
                  <p className="mx-auto mt-5 max-w-sm text-lg">
                    Quick reflection: <b className="text-sun">what helped your team stay focused?</b> Hold that thought…
                  </p>
                  <div className="mt-5 flex justify-center gap-2">
                    <Button onClick={go}>Rematch</Button>
                    <a href="#attention">
                      <Button variant="white">Next stop →</Button>
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </Stop>
  );
}
