"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Check, Plus, Shuffle, X } from "lucide-react";
import { useLocalState } from "@/lib/useLocalState";
import { Button, PrivateBadge, Reveal, Stop } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";

const CATS = [
  { id: "explore", label: "Explore", emoji: "🌍", bg: "bg-sky" },
  { id: "learn", label: "Learn", emoji: "🧠", bg: "bg-lilac" },
  { id: "create", label: "Create", emoji: "🎨", bg: "bg-sun-soft" },
  { id: "dare", label: "Dare", emoji: "🦁", bg: "bg-blush" },
  { id: "give", label: "Give", emoji: "💛", bg: "bg-mint" },
] as const;
type Cat = (typeof CATS)[number]["id"];

const SPARKS: Record<Cat, string[]> = {
  explore: ["See the sunrise from a mountain top", "Visit another country", "Camp under the stars", "Ride a train across the country"],
  learn: ["Learn to swim", "Speak a new language", "Learn to code an app", "Read 50 books"],
  create: ["Write a short story", "Build something with my hands", "Start a YouTube channel", "Cook a full meal for my family"],
  dare: ["Give a speech on stage", "Try an adventure sport", "Talk to someone I admire", "Run a 5K race"],
  give: ["Teach someone a skill", "Volunteer for a cause", "Plant 10 trees", "Make my parents proud"],
};

type Item = { id: number; text: string; cat: Cat; done: boolean };
export type BucketState = { items: Item[]; next: number };
export const BUCKET_EMPTY: BucketState = { items: [], next: 1 };
export const BUCKET_GOAL = 10;

export function BucketList() {
  const [s, setS] = useLocalState<BucketState>("s2-bucket", BUCKET_EMPTY);
  const [draft, setDraft] = useState("");
  const [cat, setCat] = useState<Cat>("explore");
  const [spark, setSpark] = useState<string | null>(null);

  const add = (text: string, c: Cat = cat) => {
    const t = text.trim();
    if (!t || s.items.some((i) => i.text.toLowerCase() === t.toLowerCase())) return;
    if (s.items.length + 1 === BUCKET_GOAL) celebrate("big");
    setS((p) => ({ items: [...p.items, { id: p.next, text: t, cat: c, done: false }], next: p.next + 1 }));
  };

  const shuffle = () => {
    const pool = SPARKS[cat].filter((x) => !s.items.some((i) => i.text === x));
    setSpark(pool.length ? pool[Math.floor(Math.random() * pool.length)] : null);
  };

  const n = s.items.length;

  return (
    <Stop
      id="bucket-list"
      stop={8}
      kicker="My bucket list"
      tone="blush"
      title={
        <>
          Dream <span className="text-coral">BIG.</span> Write it down. 🪣
        </>
      }
      intro="A bucket list is everything you want to see, learn, create and try in your life. Writing a dream down is the first step to making it real — and discipline is how you tick it off."
      aside={<PrivateBadge />}
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] [&>*]:min-w-0">
        <Reveal>
          <div className="rounded-[2rem] border-2 border-ink bg-white p-5 shadow-pop sm:p-6">
            <p className="font-display text-lg font-bold">Pick a type of dream</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {CATS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCat(c.id);
                    setSpark(null);
                  }}
                  aria-pressed={cat === c.id}
                  className={`rounded-full border-2 px-3 py-1.5 text-sm font-bold transition ${
                    cat === c.id ? `border-ink ${c.bg} -translate-y-0.5 shadow-pop` : "border-ink/20 hover:border-ink"
                  }`}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
            <form
              className="mt-4 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                add(draft);
                setDraft("");
              }}
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={80}
                placeholder="Before I'm 30, I want to…"
                aria-label="New bucket list dream"
                className="min-w-0 flex-1 rounded-2xl border-2 border-ink bg-cream px-4 py-3 outline-none focus:bg-white focus:ring-4 focus:ring-sun/60"
              />
              <Button type="submit" variant="coral">
                <Plus size={18} /> Add
              </Button>
            </form>

            <div className="mt-5 rounded-2xl border-2 border-dashed border-ink/30 bg-cream p-4">
              <p className="text-sm font-semibold text-ink-soft">Stuck? Get a spark of inspiration:</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Button variant="white" onClick={shuffle} className="px-3 py-2 text-sm">
                  <Shuffle size={16} /> Spark me
                </Button>
                <AnimatePresence mode="wait">
                  {spark && (
                    <motion.button
                      key={spark}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => {
                        add(spark);
                        setSpark(null);
                      }}
                      className="rounded-xl border-2 border-ink bg-sun px-3 py-2 text-left text-sm font-semibold"
                    >
                      + {spark}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex justify-between text-sm font-bold">
                <span>{n >= BUCKET_GOAL ? "Bucket full of dreams! 🎉" : `Aim for at least ${BUCKET_GOAL}`}</span>
                <span className="tabular-nums">
                  {Math.min(n, BUCKET_GOAL)}/{BUCKET_GOAL}
                </span>
              </div>
              <div className="mt-1 h-4 overflow-hidden rounded-full border-2 border-ink bg-white">
                <motion.div className="h-full bg-coral" animate={{ width: `${Math.min(1, n / BUCKET_GOAL) * 100}%` }} />
              </div>
            </div>
          </div>
        </Reveal>

        {/* The bucket */}
        <Reveal delay={0.1}>
          <div className="relative">
            <div className="rounded-b-[3rem] rounded-t-xl border-4 border-ink bg-white p-5 shadow-pop-lg sm:p-6">
              <div className="-mx-5 -mt-5 mb-4 h-4 rounded-t-lg border-b-4 border-ink bg-sun sm:-mx-6 sm:-mt-6" />
              {n === 0 ? (
                <div className="grid h-56 place-items-center text-center text-ink-soft">
                  <p>
                    <span className="text-5xl">🪣</span>
                    <br />
                    Your bucket is empty. What do you want to do in your life?
                  </p>
                </div>
              ) : (
                <ul className="space-y-2">
                  <AnimatePresence initial={false}>
                    {s.items.map((it) => {
                      const c = CATS.find((x) => x.id === it.cat)!;
                      return (
                        <motion.li
                          key={it.id}
                          layout
                          initial={{ opacity: 0, y: -24 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 40 }}
                          className={`flex items-center gap-2 rounded-2xl border-2 border-ink p-2 pl-3 ${c.bg}`}
                        >
                          <span aria-hidden>{c.emoji}</span>
                          <span className={`min-w-0 flex-1 font-semibold ${it.done ? "line-through decoration-coral decoration-2 opacity-60" : ""}`}>
                            {it.text}
                          </span>
                          <button
                            onClick={() => {
                              if (!it.done) celebrate("small");
                              setS((p) => ({ ...p, items: p.items.map((x) => (x.id === it.id ? { ...x, done: !x.done } : x)) }));
                            }}
                            aria-pressed={it.done}
                            aria-label={`Mark “${it.text}” as done`}
                            className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border-2 border-ink ${it.done ? "bg-teal text-white" : "bg-white"}`}
                          >
                            {it.done && <Check size={16} strokeWidth={3} />}
                          </button>
                          <button
                            onClick={() => setS((p) => ({ ...p, items: p.items.filter((x) => x.id !== it.id) }))}
                            aria-label={`Remove “${it.text}”`}
                            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink/40 hover:bg-white hover:text-ink"
                          >
                            <X size={14} />
                          </button>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </div>
            <p className="mt-4 text-center text-sm text-ink-soft">
              Tick a dream when it comes true. Look back at this list in a year — you&apos;ll be surprised.
            </p>
          </div>
        </Reveal>
      </div>
    </Stop>
  );
}
