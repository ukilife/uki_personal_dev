"use client";

import { AnimatePresence, motion, type TargetAndTransition } from "motion/react";
import { useMemo, useState } from "react";
import { Eye, EyeOff, RotateCcw, Shuffle, UserPlus } from "lucide-react";
import { useLocalState } from "@/lib/useLocalState";
import { Button, Reveal, Stop } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";

const ADJ: Record<string, string[]> = {
  a: ["Awesome", "Adventurous", "Artistic", "Amazing"],
  b: ["Brave", "Bubbly", "Bold", "Brilliant"],
  c: ["Creative", "Cheerful", "Curious", "Calm"],
  d: ["Dynamic", "Daring", "Dreamy", "Determined"],
  e: ["Energetic", "Epic", "Easygoing", "Eager"],
  f: ["Fearless", "Funny", "Friendly", "Fabulous"],
  g: ["Gentle", "Genius", "Glowing", "Groovy"],
  h: ["Happy", "Helpful", "Heroic", "Honest"],
  i: ["Inventive", "Inspiring", "Incredible", "Iconic"],
  j: ["Jolly", "Joyful", "Jazzy", "Just"],
  k: ["Kind", "Keen", "Kooky", "Knowledgeable"],
  l: ["Lively", "Loyal", "Lucky", "Legendary"],
  m: ["Mighty", "Magical", "Mindful", "Marvellous"],
  n: ["Nice", "Noble", "Nimble", "Neat"],
  o: ["Optimistic", "Original", "Outgoing", "Outstanding"],
  p: ["Positive", "Playful", "Patient", "Powerful"],
  q: ["Quick", "Quirky", "Quiet", "Quality"],
  r: ["Radiant", "Resilient", "Rockstar", "Relaxed"],
  s: ["Smart", "Sunny", "Superb", "Spontaneous"],
  t: ["Talented", "Thoughtful", "Tremendous", "Trusty"],
  u: ["Unique", "Upbeat", "Unstoppable", "Unreal"],
  v: ["Vibrant", "Victorious", "Vivid", "Valiant"],
  w: ["Wise", "Wonderful", "Witty", "Wild"],
  x: ["Xtra", "X-factor", "Xcellent", "Xciting"],
  y: ["Youthful", "Yummy", "Yes-minded", "Young-at-heart"],
  z: ["Zesty", "Zen", "Zippy", "Zany"],
};

const ACTIONS: { id: string; label: string; emoji: string; anim: TargetAndTransition }[] = [
  { id: "jump", label: "Jump", emoji: "🦘", anim: { y: [0, -40, 0], transition: { duration: 0.6, repeat: Infinity, repeatDelay: 0.4 } } },
  { id: "wave", label: "Wave", emoji: "👋", anim: { rotate: [0, 25, -10, 25, 0], transition: { duration: 1, repeat: Infinity, repeatDelay: 0.3 } } },
  { id: "spin", label: "Spin", emoji: "🌀", anim: { rotate: [0, 360], transition: { duration: 1.1, repeat: Infinity, ease: "linear" } } },
  { id: "flex", label: "Flex", emoji: "💪", anim: { scale: [1, 1.35, 1], transition: { duration: 0.8, repeat: Infinity, repeatDelay: 0.3 } } },
  { id: "bow", label: "Bow", emoji: "🙇", anim: { rotate: [0, 30, 0], originY: 1, transition: { duration: 1.2, repeat: Infinity } } },
  { id: "dance", label: "Dance", emoji: "💃", anim: { x: [0, -14, 14, 0], rotate: [0, -10, 10, 0], transition: { duration: 0.9, repeat: Infinity } } },
  { id: "clap", label: "Clap", emoji: "👏", anim: { scale: [1, 0.8, 1.15, 1], transition: { duration: 0.5, repeat: Infinity } } },
  { id: "thumbs", label: "Thumbs up", emoji: "👍", anim: { y: [0, -10, 0], rotate: [0, -15, 0], transition: { duration: 0.8, repeat: Infinity } } },
];

type Person = { name: string; word: string; action: string };

export function NameChain() {
  const [name, setName] = useState("");
  const [word, setWord] = useState("");
  const [action, setAction] = useState(ACTIONS[0].id);
  const [chain, setChain] = useLocalState<Person[]>("s1-name-chain", []);
  const [memory, setMemory] = useState(false);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  const letter = name.trim()[0]?.toLowerCase() ?? "";
  const suggestions = useMemo(() => ADJ[letter] ?? [], [letter]);
  const act = ACTIONS.find((a) => a.id === action)!;
  const display = word && name ? `${word} ${name.trim()}!` : name ? `____ ${name.trim()}!` : "Dynamic Dinesh!";

  const addToChain = () => {
    if (!name.trim() || !word.trim()) return;
    setChain((c) => [...c, { name: name.trim(), word: word.trim(), action }]);
    setName("");
    setWord("");
    celebrate("small");
  };

  return (
    <Stop
      id="name-chain"
      stop={2}
      kicker="Icebreaker · Name Chain"
      tone="cream"
      title={
        <>
          Say it. Act it. <span className="text-coral">Chain it.</span>
        </>
      }
      intro="Say your name with ONE word that describes you, add an action, then repeat everyone before you. The chain grows… can the group remember everyone?"
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        {/* Builder */}
        <Reveal className="rounded-[2rem] border-2 border-ink bg-white p-6 shadow-pop-lg sm:p-8">
          <ol className="space-y-6">
            <li>
              <label className="font-display text-sm font-semibold tracking-wider text-ink-soft uppercase">
                <span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-sun text-ink">1</span>
                Your first name
              </label>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setWord("");
                }}
                maxLength={18}
                placeholder="e.g. Dinesh"
                className="mt-2 w-full rounded-2xl border-2 border-ink bg-cream px-4 py-3 text-lg outline-none focus:bg-white focus:ring-4 focus:ring-sun/60"
              />
            </li>
            <li>
              <label className="font-display text-sm font-semibold tracking-wider text-ink-soft uppercase">
                <span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-blush text-ink">2</span>
                One word that describes you
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setWord(s)}
                    className={`rounded-full border-2 px-3 py-1 text-sm font-semibold transition ${
                      word === s ? "border-ink bg-coral text-white" : "border-ink/20 bg-cream hover:border-ink"
                    }`}
                  >
                    {s}
                  </button>
                ))}
                {letter && suggestions.length > 0 && (
                  <button
                    onClick={() => setWord(suggestions[Math.floor(Math.random() * suggestions.length)])}
                    className="flex items-center gap-1 rounded-full px-2 py-1 text-sm text-ink-soft hover:text-ink"
                    title="Random pick"
                  >
                    <Shuffle size={14} />
                  </button>
                )}
              </div>
              <input
                value={word}
                onChange={(e) => setWord(e.target.value)}
                maxLength={16}
                placeholder={letter ? `…or your own ${letter.toUpperCase()}-word` : "Type your name first"}
                className="mt-2 w-full rounded-2xl border-2 border-ink bg-cream px-4 py-3 outline-none focus:bg-white focus:ring-4 focus:ring-sun/60"
              />
              <p className="mt-1.5 text-xs text-ink-soft">Bonus points if it starts with the same letter as your name.</p>
            </li>
            <li>
              <span className="font-display text-sm font-semibold tracking-wider text-ink-soft uppercase">
                <span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-teal-soft text-ink">3</span>
                Add an action
              </span>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {ACTIONS.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setAction(a.id)}
                    className={`flex flex-col items-center rounded-2xl border-2 py-2 text-xs font-semibold transition ${
                      action === a.id ? "border-ink bg-sun" : "border-ink/15 bg-cream hover:border-ink"
                    }`}
                  >
                    <span className="text-2xl">{a.emoji}</span>
                    {a.label}
                  </button>
                ))}
              </div>
            </li>
          </ol>
        </Reveal>

        {/* Stage */}
        <Reveal delay={0.1} className="flex flex-col gap-6">
          <div className="relative grid min-h-64 place-items-center overflow-hidden rounded-[2rem] border-2 border-ink bg-ink p-8 text-center text-cream shadow-pop-lg">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,201,60,0.35),transparent_60%)]" />
            <div>
              <motion.div key={action} animate={act.anim} className="inline-block text-7xl">
                {act.emoji}
              </motion.div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={display}
                  initial={{ opacity: 0, y: 14, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -14 }}
                  className="mt-4 font-display text-4xl font-bold text-sun sm:text-5xl"
                >
                  {display}
                </motion.p>
              </AnimatePresence>
              <p className="mt-2 text-sm text-cream/60">*does a {act.label.toLowerCase()}*</p>
            </div>
            <span className="absolute top-4 left-4 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wider uppercase">
              🎤 On stage
            </span>
          </div>
          <Button onClick={addToChain} disabled={!name.trim() || !word.trim()} variant="teal" className="self-start">
            <UserPlus size={18} /> Add me to the chain
          </Button>

          {/* Chain */}
          <div className="rounded-[2rem] border-2 border-ink bg-sun-soft p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xl font-bold">
                The chain <span className="text-ink-soft">({chain.length})</span>
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setMemory((m) => !m);
                    setRevealed(new Set());
                  }}
                  disabled={chain.length < 2}
                  className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-white px-3 py-1 text-sm font-semibold disabled:opacity-40"
                >
                  {memory ? <Eye size={14} /> : <EyeOff size={14} />}
                  {memory ? "Show all" : "Memory test"}
                </button>
                {chain.length > 0 && (
                  <button
                    onClick={() => setChain([])}
                    className="flex items-center gap-1 rounded-full px-2 py-1 text-sm text-ink-soft hover:text-ink"
                  >
                    <RotateCcw size={14} /> Reset
                  </button>
                )}
              </div>
            </div>
            {chain.length === 0 ? (
              <p className="text-sm text-ink-soft">
                Facilitator tip: add each person as they go. Then hit <b>Memory test</b> and see who can recall the
                whole chain!
              </p>
            ) : (
              <div className="flex flex-wrap items-center gap-1">
                {chain.map((p, i) => {
                  const a = ACTIONS.find((x) => x.id === p.action);
                  const hidden = memory && !revealed.has(i);
                  return (
                    <div key={i} className="flex items-center gap-1">
                      <motion.button
                        layout
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, rotateY: hidden ? 180 : 0 }}
                        onClick={() => memory && setRevealed((r) => new Set(r).add(i))}
                        className={`rounded-2xl border-2 border-ink px-3 py-2 text-left text-sm font-semibold ${
                          hidden ? "bg-ink text-cream" : "bg-white"
                        }`}
                      >
                        {hidden ? (
                          <span style={{ display: "inline-block", transform: "rotateY(180deg)" }}>❓ #{i + 1}</span>
                        ) : (
                          <>
                            {a?.emoji} {p.word} {p.name}
                          </>
                        )}
                      </motion.button>
                      {i < chain.length - 1 && <span className="text-ink/30">🔗</span>}
                    </div>
                  );
                })}
              </div>
            )}
            {memory && (
              <p className="mt-3 text-sm font-semibold text-ink-soft">
                Tap a card to check. Revealed {revealed.size}/{chain.length}
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </Stop>
  );
}
