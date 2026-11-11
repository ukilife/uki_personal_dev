"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bike, CookingPot, Car, Clapperboard, Drama, Flame, Globe, Heart, IceCreamCone, Languages, FaceGrinning, Lightbulb,
  MessageSquareX, Moon, Music, PawPrint, Rocket, Soup, Star, Tag, RotateCcw, Users,
  type LucideIcon,
} from "lucide-react";
import { useLocalState } from "@/lib/useLocalState";
import { Button, Reveal, Stop } from "@/components/ui";
import { TimerWidget } from "@/components/TimerWidget";
import { formatTime, useTimer } from "@/lib/useTimer";
import { celebrate } from "@/lib/celebrate";

const PROMPTS: { text: string; icon: LucideIcon; color: string }[] = [
  { text: "Has travelled to another country", icon: Globe, color: "bg-sky" },
  { text: "Can cook biryani", icon: Soup, color: "bg-sun-soft" },
  { text: "Is married", icon: Heart, color: "bg-blush" },
  { text: "Owns a car", icon: Car, color: "bg-teal-soft" },
  { text: "Has two sisters", icon: Users, color: "bg-lilac" },
  { text: "Once sent a message to the wrong person", icon: MessageSquareX, color: "bg-blush" },
  { text: "Likes ice cream", icon: IceCreamCone, color: "bg-sky" },
  { text: "Has a pet", icon: PawPrint, color: "bg-mint" },
  { text: "Can speak 3+ languages", icon: Languages, color: "bg-sun-soft" },
  { text: "Has laughed at the wrong time in public", icon: FaceGrinning, color: "bg-lilac" },
  { text: "Has cooked & burnt food", icon: CookingPot, color: "bg-sun-soft" },
  { text: "Can ride a motorbike", icon: Bike, color: "bg-teal-soft" },
  { text: "Has met a famous person", icon: Star, color: "bg-sky" },
  { text: "Can dance in front of the class", icon: Music, color: "bg-blush" },
  { text: "Has watched one movie 5+ times", icon: Clapperboard, color: "bg-mint" },
  { text: "Has an unusual nickname", icon: Tag, color: "bg-lilac" },
  { text: "Has fallen asleep in class", icon: Moon, color: "bg-sky" },
  { text: "Wants to start a business", icon: Rocket, color: "bg-sun-soft" },
  { text: "Can imitate a teacher or celebrity", icon: Drama, color: "bg-blush" },
  { text: "Likes spicy food", icon: Flame, color: "bg-teal-soft" },
];

const COLS = 5;
const ROWS = 4;
const LINES: number[][] = [
  ...Array.from({ length: ROWS }, (_, r) => Array.from({ length: COLS }, (_, c) => r * COLS + c)),
  ...Array.from({ length: COLS }, (_, c) => Array.from({ length: ROWS }, (_, r) => r * COLS + c)),
];

export function FindSomeone() {
  const [names, setNames] = useLocalState<string[]>("s1-find-someone", Array(20).fill(""));
  const [open, setOpen] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const timer = useTimer({ mode: "down", seconds: 300 });
  const { pause, reset } = timer;
  const celebrated = useRef<Set<string>>(new Set());

  const done = names.filter(Boolean).length;
  const completeLines = useMemo(() => LINES.filter((l) => l.every((i) => names[i])), [names]);
  const winning = useMemo(() => new Set(completeLines.flat()), [completeLines]);

  useEffect(() => {
    completeLines.forEach((l) => {
      const k = l.join("-");
      if (!celebrated.current.has(k)) {
        celebrated.current.add(k);
        celebrate("small");
      }
    });
    if (done === 20 && !celebrated.current.has("all")) {
      celebrated.current.add("all");
      celebrate("big");
      pause();
    }
  }, [completeLines, done, pause]);

  const save = () => {
    if (open === null) return;
    setNames((n) => n.map((v, i) => (i === open ? draft.trim() : v)));
    setOpen(null);
  };

  const tookTime = formatTime(timer.elapsed);

  return (
    <Stop
      id="find-someone"
      stop={3}
      kicker="Game 01 · Mingle"
      tone="sky"
      title={
        <>
          Find Someone <span className="text-sky-deep">Who…</span>
        </>
      }
      intro="Walk around, ask questions, and find a different person for each box. Tap a box to write their name. Complete a row or column for a mini-celebration — fill all 20 to win!"
      aside={<TimerWidget timer={timer} label="mingle timer" />}
    >
      <Reveal>
        <div className="mb-5 flex flex-wrap items-center gap-4">
          <div className="h-4 flex-1 overflow-hidden rounded-full border-2 border-ink bg-white">
            <motion.div
              className="h-full bg-gradient-to-r from-sky-deep via-teal to-sun"
              animate={{ width: `${(done / 20) * 100}%` }}
            />
          </div>
          <span className="font-display text-lg font-bold">{done}/20 found</span>
          <span className="rounded-full bg-sun px-3 py-1 text-sm font-bold">🏁 {completeLines.length} lines</span>
          <button
            onClick={() => {
              setNames(Array(20).fill(""));
              celebrated.current.clear();
              reset();
            }}
            className="flex items-center gap-1 text-sm font-semibold text-ink-soft hover:text-ink"
          >
            <RotateCcw size={14} /> New game
          </button>
        </div>
      </Reveal>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5">
        {PROMPTS.map((p, i) => {
          const Icon = p.icon;
          const filled = names[i];
          const win = winning.has(i);
          return (
            <motion.button
              key={p.text}
              initial={{ opacity: 0, scale: 0.85, rotate: i % 2 ? 2 : -2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 5) * 0.05 + Math.floor(i / 5) * 0.08, type: "spring", stiffness: 160 }}
              whileHover={{ y: -4, rotate: i % 2 ? 1.5 : -1.5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setOpen(i);
                setDraft(names[i] ?? "");
              }}
              className={`relative flex min-h-40 flex-col items-center justify-between gap-2 rounded-3xl border-2 border-ink p-3 text-center shadow-pop transition-colors ${
                filled ? (win ? "bg-sun" : "bg-white") : p.color
              }`}
            >
              <span className="absolute top-2 left-3 font-display text-xs font-bold text-ink/40">{i + 1}</span>
              <span
                className={`mt-2 grid h-12 w-12 place-items-center rounded-2xl border-2 border-ink ${
                  filled ? "bg-teal text-white" : "bg-white"
                }`}
              >
                <Icon size={24} strokeWidth={2.2} />
              </span>
              <span className="text-sm leading-snug font-semibold">{p.text}</span>
              <span
                className={`w-full truncate rounded-xl border-2 border-dashed px-2 py-1 font-display text-sm ${
                  filled ? "border-teal bg-teal-soft font-bold text-teal" : "border-ink/25 text-ink/40"
                }`}
              >
                {filled || "Name: ______"}
              </span>
              {filled && (
                <motion.span
                  initial={{ scale: 0, rotate: -40 }}
                  animate={{ scale: 1, rotate: -12 }}
                  className="absolute -top-3 -right-3 grid h-9 w-9 place-items-center rounded-full border-2 border-ink bg-coral text-lg text-white"
                >
                  ✓
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {done === 20 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8 rounded-3xl border-2 border-ink bg-ink p-6 text-center text-cream"
          >
            <p className="font-display text-3xl font-bold text-sun">Full card in {tookTime}! 🎉</p>
            <p className="mt-2 text-cream/80">
              Look how much you can learn about people in a few minutes. Now — how much do you know about{" "}
              <b>yourself</b>?
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* name modal */}
      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[60] grid place-items-center bg-ink/50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.form
              initial={{ scale: 0.8, y: 30, rotate: -3 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={(e) => {
                e.preventDefault();
                save();
              }}
              className="w-full max-w-sm rounded-[2rem] border-2 border-ink bg-white p-6 shadow-pop-lg"
            >
              <p className="text-xs font-bold tracking-widest text-ink-soft uppercase">Find someone who…</p>
              <h3 className="mt-1 text-2xl font-bold">{PROMPTS[open].text.toLowerCase()}</h3>
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={22}
                placeholder="Their name"
                className="mt-5 w-full rounded-2xl border-2 border-ink bg-cream px-4 py-3 text-lg outline-none focus:bg-white focus:ring-4 focus:ring-sun/60"
              />
              <p className="mt-2 text-xs text-ink-soft">
                💡 Ask a follow-up: <i>“Where? When? What happened?”</i>
              </p>
              <div className="mt-5 flex justify-end gap-2">
                {names[open] && (
                  <Button
                    variant="white"
                    onClick={() => {
                      setDraft("");
                      setNames((n) => n.map((v, i) => (i === open ? "" : v)));
                      setOpen(null);
                    }}
                  >
                    Clear
                  </Button>
                )}
                <Button type="submit" variant="teal">
                  <Lightbulb size={16} /> Save
                </Button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </Stop>
  );
}
