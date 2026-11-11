"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  BookOpen, Brain, Crown, Ear, Hammer, HeartHandshake, Hourglass, FaceGrinning, Lightbulb, Megaphone, Palette, Puzzle,
  Shield, Sparkles, Users, type LucideIcon,
} from "lucide-react";
import { useLocalState } from "@/lib/useLocalState";
import { PrivateBadge, Reveal, Stop } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";

export const POWERS: { id: string; label: string; icon: LucideIcon; color: string }[] = [
  { id: "helping", label: "Helping others", icon: HeartHandshake, color: "#f7845e" },
  { id: "solving", label: "Solving problems", icon: Puzzle, color: "#2f7fc1" },
  { id: "creative", label: "Being creative", icon: Palette, color: "#7b3fa0" },
  { id: "listening", label: "Listening carefully", icon: Ear, color: "#1f9d8a" },
  { id: "learning", label: "Learning quickly", icon: Brain, color: "#d9345b" },
  { id: "patient", label: "Staying patient", icon: Hourglass, color: "#5aa832" },
  { id: "funny", label: "Making people laugh", icon: FaceGrinning, color: "#e0a400" },
  { id: "leading", label: "Leading a team", icon: Users, color: "#2f7fc1" },
  { id: "ideas", label: "Big ideas", icon: Lightbulb, color: "#f7845e" },
  { id: "building", label: "Building & fixing", icon: Hammer, color: "#8b5a2b" },
  { id: "speaking", label: "Speaking up", icon: Megaphone, color: "#d9345b" },
  { id: "loyal", label: "Being loyal", icon: Shield, color: "#1f9d8a" },
  { id: "curious", label: "Staying curious", icon: BookOpen, color: "#7b3fa0" },
  { id: "positive", label: "Staying positive", icon: Sparkles, color: "#e0a400" },
];

export type PowerState = { picked: string[]; proud: string | null; alias: string };
export const POWER_EMPTY: PowerState = { picked: [], proud: null, alias: "" };

export function Superpowers() {
  const [s, setS] = useLocalState<PowerState>("s1-superpowers", POWER_EMPTY);
  const [shake, setShake] = useState<string | null>(null);

  const toggle = (id: string) => {
    setS((p) => {
      if (p.picked.includes(id)) {
        return { ...p, picked: p.picked.filter((x) => x !== id), proud: p.proud === id ? null : p.proud };
      }
      if (p.picked.length >= 5) {
        setShake(id);
        setTimeout(() => setShake(null), 400);
        return p;
      }
      const next = { ...p, picked: [...p.picked, id] };
      if (next.picked.length === 5) celebrate("small");
      return next;
    });
  };

  const proud = POWERS.find((p) => p.id === s.proud);
  const picked = s.picked.map((id) => POWERS.find((p) => p.id === id)!).filter(Boolean);

  return (
    <Stop
      id="superpowers"
      stop={8}
      kicker="Mission · Strengths"
      tone="sky"
      title={
        <>
          Discover your <span className="text-sky-deep">superpowers</span> ⚡
        </>
      }
      intro="Everyone has strengths — some loud, some quiet. Pick your top 5, then crown the one that makes you MOST proud."
      aside={<PrivateBadge />}
    >
      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <Reveal>
          <div className="mb-3 flex items-center justify-between">
            <p className="font-display text-lg font-bold">Tap to pick ({s.picked.length}/5)</p>
            {s.picked.length > 0 && (
              <button onClick={() => setS(POWER_EMPTY)} className="text-sm font-semibold text-ink-soft hover:text-ink">
                Reset
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {POWERS.map((p, i) => {
              const on = s.picked.includes(p.id);
              const isProud = s.proud === p.id;
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  animate={shake === p.id ? { x: [0, -8, 8, -5, 5, 0] } : {}}
                  className="relative"
                >
                  <button
                    onClick={() => toggle(p.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left transition-all ${
                      on ? "-translate-y-1 border-ink bg-white shadow-pop" : "border-ink/15 bg-white/60 hover:border-ink/60"
                    }`}
                  >
                    <span
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border-2 border-ink text-white transition"
                      style={{ background: on ? p.color : "#fff", color: on ? "#fff" : p.color }}
                    >
                      <p.icon size={20} />
                    </span>
                    <span className="text-sm leading-tight font-semibold">{p.label}</span>
                  </button>
                  {on && (
                    <button
                      onClick={() => setS((x) => ({ ...x, proud: isProud ? null : p.id }))}
                      title="Crown as proudest"
                      aria-label={`Crown ${p.label} as proudest`}
                      className={`absolute -top-3 -right-2 grid h-8 w-8 place-items-center rounded-full border-2 border-ink transition ${
                        isProud ? "scale-110 bg-sun" : "bg-white opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Crown size={16} />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-ink-soft">
            Tip: tap the 👑 on a picked card to crown your proudest strength.
          </p>
        </Reveal>

        {/* Trading card */}
        <Reveal delay={0.1} className="flex justify-center">
          <motion.div
            whileHover={{ rotateY: 8, rotateX: -4 }}
            style={{ transformPerspective: 900 }}
            className="relative w-full max-w-sm overflow-hidden rounded-[2rem] border-4 border-ink bg-gradient-to-b from-sun via-sun-soft to-white p-5 shadow-pop-lg"
          >
            <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-white/40 blur-2xl" />
            <div className="flex items-center justify-between">
              <span className="rounded-full border-2 border-ink bg-white px-3 py-1 text-xs font-bold tracking-widest uppercase">
                Hero card
              </span>
              <span className="font-display text-sm font-bold">#{String(s.picked.length * 7 + 1).padStart(3, "0")}</span>
            </div>
            <div className="relative mt-4 grid h-40 place-items-center rounded-3xl border-2 border-ink bg-ink">
              <AnimatePresence mode="wait">
                {proud ? (
                  <motion.div
                    key={proud.id}
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    className="text-center"
                  >
                    <span
                      className="mx-auto grid h-20 w-20 place-items-center rounded-full border-4 border-white text-white"
                      style={{ background: proud.color, boxShadow: `0 0 40px ${proud.color}` }}
                    >
                      <proud.icon size={38} />
                    </span>
                    <p className="mt-2 font-display text-sm font-semibold text-sun">👑 {proud.label}</p>
                  </motion.div>
                ) : (
                  <motion.p key="empty" className="px-6 text-center text-sm text-cream/70">
                    {s.picked.length < 5 ? "Pick 5 powers to charge this card…" : "Now crown your proudest one 👑"}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <input
              value={s.alias}
              onChange={(e) => setS((x) => ({ ...x, alias: e.target.value }))}
              maxLength={24}
              placeholder="Your hero name…"
              className="mt-4 w-full rounded-xl border-2 border-ink bg-white px-3 py-2 text-center font-display text-xl font-bold outline-none focus:ring-4 focus:ring-coral/40"
            />
            <div className="mt-4 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => {
                const p = picked[i];
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-24 truncate text-xs font-semibold">{p ? p.label : "— empty —"}</span>
                    <div className="h-3 flex-1 overflow-hidden rounded-full border-2 border-ink bg-white">
                      <motion.div
                        className="h-full"
                        style={{ background: p?.color ?? "transparent" }}
                        animate={{ width: p ? `${p.id === s.proud ? 100 : 62 + ((i * 9) % 30)}%` : "0%" }}
                        transition={{ type: "spring", stiffness: 80 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </Reveal>
      </div>
    </Stop>
  );
}
