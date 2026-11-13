"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Eye, EyeOff, Shuffle } from "lucide-react";
import { useTimer } from "@/lib/useTimer";
import { TimerWidget } from "@/components/TimerWidget";
import { Button, Reveal, Stop } from "@/components/ui";

const PERSONAS = [
  { who: "Retired teacher, 68", emoji: "👵", kind: "person", secret: "Lost her husband young and raised 3 children alone while teaching. Lesson: education is the one thing nobody can take from you." },
  { who: "Tuk-tuk driver, 45", emoji: "🛺", kind: "person", secret: "Failed his O/Ls twice, worked abroad for 8 years to buy his tuk-tuk. Lesson: failure in school is not failure in life." },
  { who: "Fisherman, 52", emoji: "🎣", kind: "person", secret: "Survived a storm at sea that took his boat. Rebuilt with help from the village. Lesson: help others — one day you'll need them." },
  { who: "Young nurse, 26", emoji: "🩺", kind: "person", secret: "Was very shy at school and scared of speaking. Now talks to 50 patients a day. Lesson: courage is a muscle." },
  { who: "Bakery owner", emoji: "🥐", kind: "business", secret: "Started baking at home with one oven. Competes with a big supermarket by being fresh and knowing every customer's name." },
  { who: "Mobile phone shop owner", emoji: "📱", kind: "business", secret: "Started by repairing phones on a table outside a shop. Survived lockdown by doing home repairs. Advice: learn a skill people need." },
  { who: "Tailor shop owner", emoji: "🧵", kind: "business", secret: "Idea came from sewing school uniforms for neighbours. Lost customers to ready-made clothes, survived by doing alterations fast." },
  { who: "Vegetable stall owner", emoji: "🥕", kind: "business", secret: "Started with one basket. Wakes up at 4 am daily. Advice: discipline beats talent — show up every single day." },
];

export function Practice() {
  const [i, setI] = useState<number | null>(null);
  const [reveal, setReveal] = useState(false);
  const timer = useTimer({ mode: "down", seconds: 180 });
  const p = i === null ? null : PERSONAS[i];

  const draw = () => {
    let n = Math.floor(Math.random() * PERSONAS.length);
    if (n === i) n = (n + 1) % PERSONAS.length;
    setI(n);
    setReveal(false);
  };

  return (
    <Stop
      id="practice"
      stop={3}
      kicker="Practice round · pairs"
      tone="lilac"
      title={
        <>
          Rehearse before the <span className="text-grape">real thing</span> 🎭
        </>
      }
      intro="In pairs: one of you draws a character and secretly reads their backstory. The other is the interviewer — use an opener and dig for the story. 3 minutes, then swap."
      aside={<TimerWidget timer={timer} label="practice time" presets={[120, 180, 300]} />}
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] [&>*]:min-w-0">
        <Reveal>
          <div className="rounded-[2rem] border-2 border-ink bg-white p-6 text-center shadow-pop">
            <AnimatePresence mode="wait">
              {p ? (
                <motion.div key={i} initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: -90, opacity: 0 }}>
                  <span className="text-7xl">{p.emoji}</span>
                  <p className="mt-2 text-xs font-bold tracking-widest text-ink-soft uppercase">
                    {p.kind === "person" ? "A person" : "A business"}
                  </p>
                  <p className="font-display text-3xl font-bold">{p.who}</p>
                </motion.div>
              ) : (
                <motion.div key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <span className="text-7xl">🃏</span>
                  <p className="mt-2 font-display text-2xl font-bold">Draw a character</p>
                </motion.div>
              )}
            </AnimatePresence>
            <Button variant="grape" className="mt-5" onClick={draw}>
              <Shuffle size={18} /> {p ? "Draw another" : "Draw a card"}
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="h-full rounded-[2rem] border-2 border-ink bg-ink p-6 text-cream shadow-pop">
            <div className="flex items-center justify-between gap-3">
              <p className="font-display text-xl font-bold text-sun">🤫 Secret backstory (actor only!)</p>
              {p && (
                <button
                  onClick={() => setReveal((r) => !r)}
                  className="flex items-center gap-1.5 rounded-xl border-2 border-cream/30 px-3 py-1.5 text-sm font-bold hover:border-sun"
                >
                  {reveal ? <EyeOff size={16} /> : <Eye size={16} />} {reveal ? "Hide" : "Show"}
                </button>
              )}
            </div>
            <div className="mt-4 min-h-24 rounded-2xl bg-white/10 p-4">
              {!p ? (
                <p className="text-cream/60">Draw a card first.</p>
              ) : reveal ? (
                <p className="text-lg">{p.secret}</p>
              ) : (
                <p className="text-cream/60">Hidden — the interviewer shouldn&apos;t peek! 👀</p>
              )}
            </div>
            <p className="mt-5 font-display font-bold text-sun">Interviewer, your goal:</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-cream/85">
              <li>Use a polite opener and ask permission.</li>
              <li>Find the hardship and how they overcame it.</li>
              <li>{p?.kind === "business" ? "Find out how the idea started and how they beat competition." : "Get one piece of advice for you."}</li>
              <li>End with a thank-you.</li>
            </ul>
          </div>
        </Reveal>
      </div>
    </Stop>
  );
}
