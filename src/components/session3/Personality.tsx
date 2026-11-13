"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { useLocalState, useStoredSnapshot } from "@/lib/useLocalState";
import { PrivateBadge, Reveal, Stop } from "@/components/ui";
import { REAL_YOU_EMPTY, type RealYou } from "@/components/session1/RealYou";
import { PERSONALITY_EMPTY, type PersonalityState } from "./state";

export const SLIDERS = [
  { id: "energy", left: ["🔋", "Recharge alone"], right: ["🎉", "Recharge with people"] },
  { id: "plan", left: ["📋", "Planner"], right: ["🌊", "Go with the flow"] },
  { id: "think", left: ["🧠", "Head first"], right: ["❤️", "Heart first"] },
  { id: "focus", left: ["🔍", "Love details"], right: ["🔭", "Big-picture"] },
  { id: "work", left: ["🧘", "Work solo"], right: ["🤝", "Work in a team"] },
  { id: "pace", left: ["🐢", "Slow and steady"], right: ["⚡", "Fast and bold"] },
] as const;

const WORDS = [
  "Calm", "Cheerful", "Curious", "Determined", "Funny", "Gentle", "Honest", "Imaginative", "Loyal", "Organised",
  "Patient", "Playful", "Quiet", "Brave", "Caring", "Confident", "Thoughtful", "Energetic", "Friendly", "Practical",
];
export const WORD_MAX = 5;

/** "Recharge alone" / "Recharge with people" / "A bit of both" for one slider value. */
export function sliderSide(id: string, v: number | undefined) {
  const s = SLIDERS.find((x) => x.id === id)!;
  if (v === undefined) return null;
  if (v < 40) return s.left;
  if (v > 60) return s.right;
  return ["⚖️", `Both: ${s.left[1].toLowerCase()} & ${s.right[1].toLowerCase()}`] as const;
}

export function Personality() {
  const [s, setS] = useLocalState<PersonalityState>("s3-personality", PERSONALITY_EMPTY);
  const realYou = useStoredSnapshot<RealYou>("s1-real-you", REAL_YOU_EMPTY);
  const mirror = useStoredSnapshot<string[]>("s1-mirror-words", []);
  const [shake, setShake] = useState<string | null>(null);

  const past = [...mirror, ...realYou.talents].map((x) => x.trim()).filter(Boolean);
  const answered = SLIDERS.filter((x) => s.sliders[x.id] !== undefined).length;

  const toggleWord = (w: string) =>
    setS((p) => {
      if (p.words.includes(w)) return { ...p, words: p.words.filter((x) => x !== w) };
      if (p.words.length >= WORD_MAX) {
        setShake(w);
        window.setTimeout(() => setShake(null), 400);
        return p;
      }
      return { ...p, words: [...p.words, w] };
    });

  return (
    <Stop
      id="personality"
      stop={4}
      kicker="Piece 3 · My personality"
      tone="lilac"
      title={
        <>
          How are <span className="text-grape">you</span> wired? 🎭
        </>
      }
      intro="There's no good or bad personality — only YOURS. Knowing how you think, work and recharge helps you pick dreams and goals that fit you. This is a snapshot, not a label: people grow and change."
      aside={<PrivateBadge />}
    >
      <div className="grid gap-8 lg:grid-cols-2 [&>*]:min-w-0">
        <Reveal>
          <div className="rounded-[2rem] border-2 border-ink bg-white p-5 shadow-pop sm:p-6">
            <div className="flex items-center justify-between">
              <p className="font-display text-xl font-bold">Slide to where you are</p>
              <span className="rounded-full border-2 border-ink bg-sun px-3 py-0.5 font-display text-sm font-bold">{answered}/{SLIDERS.length}</span>
            </div>
            <div className="mt-4 space-y-5">
              {SLIDERS.map((x) => {
                const v = s.sliders[x.id];
                return (
                  <div key={x.id}>
                    <div className="flex justify-between text-sm font-semibold">
                      <span className={v !== undefined && v < 40 ? "text-grape" : ""}>
                        {x.left[0]} {x.left[1]}
                      </span>
                      <span className={v !== undefined && v > 60 ? "text-grape" : ""}>
                        {x.right[1]} {x.right[0]}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={v ?? 50}
                      onChange={(e) => setS((p) => ({ ...p, sliders: { ...p.sliders, [x.id]: Number(e.target.value) } }))}
                      aria-label={`${x.left[1]} or ${x.right[1]}`}
                      className={`mt-1 w-full accent-grape ${v === undefined ? "opacity-50" : ""}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-[2rem] border-2 border-ink bg-white p-5 shadow-pop sm:p-6">
            <div className="flex items-center justify-between">
              <p className="font-display text-xl font-bold">5 words that describe me</p>
              <span className="rounded-full border-2 border-ink bg-sun px-3 py-0.5 font-display text-sm font-bold">
                {s.words.length}/{WORD_MAX}
              </span>
            </div>
            {past.length > 0 && (
              <p className="mt-2 rounded-xl bg-lilac/60 px-3 py-2 text-sm">
                🪞 In Session 1 you described yourself as: <b>{past.slice(0, 6).join(", ")}</b>
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {[...new Set([...WORDS, ...s.words])].map((w) => {
                const on = s.words.includes(w);
                return (
                  <motion.button
                    key={w}
                    onClick={() => toggleWord(w)}
                    aria-pressed={on}
                    animate={shake === w ? { x: [0, -6, 6, -3, 0] } : { x: 0 }}
                    transition={{ type: "tween", duration: 0.3 }}
                    className={`rounded-full border-2 px-3 py-1.5 text-sm font-semibold transition ${
                      on ? "-translate-y-0.5 border-ink bg-grape text-white shadow-pop" : "border-ink/20 bg-cream hover:border-ink"
                    }`}
                  >
                    {w}
                  </motion.button>
                );
              })}
            </div>
            <form
              className="mt-3"
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.elements.namedItem("own") as HTMLInputElement;
                const w = input.value.trim();
                if (w && !s.words.includes(w)) toggleWord(w);
                input.value = "";
              }}
            >
              <input
                name="own"
                maxLength={20}
                placeholder="Missing a word? Type it + Enter"
                aria-label="Add your own personality word"
                className="w-full rounded-xl border-2 border-ink/30 bg-white px-3 py-2 text-sm outline-none focus:border-ink focus:ring-4 focus:ring-sun/50"
              />
            </form>
          </div>

          {(answered > 0 || s.words.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 rounded-[2rem] border-2 border-ink bg-grape p-5 text-white shadow-pop"
            >
              <p className="text-sm font-bold tracking-widest text-white/70 uppercase">My personality snapshot</p>
              <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                {SLIDERS.map((x) => {
                  const side = sliderSide(x.id, s.sliders[x.id]);
                  return side ? (
                    <li key={x.id} className="font-semibold">
                      {side[0]} {side[1]}
                    </li>
                  ) : null;
                })}
              </ul>
              {s.words.length > 0 && <p className="mt-3 font-display text-xl font-bold text-sun">{s.words.join(" · ")}</p>}
            </motion.div>
          )}
        </Reveal>
      </div>
    </Stop>
  );
}
