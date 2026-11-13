"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { useLocalState } from "@/lib/useLocalState";
import { useTimer } from "@/lib/useTimer";
import { TimerWidget } from "@/components/TimerWidget";
import { Reveal, Stop } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";

const KIT = [
  ["📄", "A3 or chart paper"],
  ["✏️", "Pencil & eraser"],
  ["🖍️", "Colour pencils / markers"],
  ["✂️", "Scissors & glue (optional)"],
  ["📰", "Old magazines (optional)"],
  ["📏", "Ruler"],
];

const STEPS = [
  { t: "Sketch the layout", d: "Lightly in pencil: your name & motto in the centre, 5 zones around it — dreams, values, personality, strengths, goals.", e: "✏️" },
  { t: "Draw, don't just write", d: "A stethoscope for “doctor”, a plane for “travel”, a heart for “family”. Pictures stick in your mind longer than words.", e: "🎨" },
  { t: "Make your dreams the biggest", d: "Your dreams are the heart of the board. Give them the most space and the brightest colours.", e: "🌟" },
  { t: "Add your goals with dates", d: "Write your 1-, 5- and 10-year goals clearly — with WHEN. That's what turns a poster into a plan.", e: "🎯" },
  { t: "Colour it in & sign it", d: "Finish with colour, then sign and date it. This is a promise to future you.", e: "✍️" },
];

const GALLERY = [
  { t: "Put it on the wall", d: "Place your board in the classroom where you'll see it every week.", e: "📌" },
  { t: "Gallery walk", d: "Walk around quietly and look at everyone's boards. Notice dreams that surprise you.", e: "🚶" },
  { t: "Share with a partner", d: "Tell one person: one dream, the value behind it, and your first step this week.", e: "🗣️" },
  { t: "Leave a kind note", d: "Stick a note on 2 boards: “I believe you can ___ because ___.”", e: "💌" },
];

type StepItem = { t: string; d: string; e: string };

function Card({ s, n, on, onToggle }: { s: StepItem; n: string; on: boolean; onToggle: () => void }) {
  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.98 }}
      aria-pressed={on}
      className={`flex w-full items-start gap-3 rounded-2xl border-2 border-ink p-4 text-left transition ${on ? "bg-teal-soft" : "bg-white hover:-translate-y-0.5"}`}
    >
      <span className="text-3xl">{s.e}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-bold text-ink-soft">{n}</span>
        <span className={`block font-display text-lg font-bold ${on ? "line-through decoration-coral decoration-2" : ""}`}>{s.t}</span>
        <span className="block text-sm text-ink-soft">{s.d}</span>
      </span>
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border-2 border-ink ${on ? "bg-teal text-white" : "bg-white"}`}>
        {on && <Check size={18} strokeWidth={3} />}
      </span>
    </motion.button>
  );
}

export function PaperBoard() {
  const timer = useTimer({ mode: "down", seconds: 30 * 60 });
  const [done, setDone] = useLocalState<boolean[]>("s3-paper", Array(STEPS.length + GALLERY.length).fill(false));
  const ticks = Array.from({ length: STEPS.length + GALLERY.length }, (_, i) => !!done[i]);

  const toggle = (i: number) => {
    const next = ticks.map((v, j) => (j === i ? !v : v));
    if (next.every(Boolean)) celebrate("big");
    else if (!ticks[i]) celebrate("small");
    setDone(next);
  };

  return (
    <Stop
      id="paper"
      stop={8}
      kicker="Draw it on paper"
      tone="blush"
      title={
        <>
          Pencils out. Make it <span className="text-coral">real.</span> 🖍️
        </>
      }
      intro="Screens are for planning — your real dream board lives on paper, on the classroom wall. Follow the steps, use your saved plan as a guide, and tick each step as you finish."
      aside={<TimerWidget timer={timer} label="drawing time" presets={[900, 1200, 1800, 2400]} />}
    >
      <Reveal>
        <div className="flex flex-wrap gap-2">
          <span className="font-display font-bold">You&apos;ll need:</span>
          {KIT.map(([e, t]) => (
            <span key={t} className="rounded-full border-2 border-ink/20 bg-white px-3 py-1 text-sm font-semibold">
              {e} {t}
            </span>
          ))}
        </div>
      </Reveal>

      <div className="mt-8 grid gap-8 lg:grid-cols-2 [&>*]:min-w-0">
        <Reveal>
          <h3 className="text-3xl font-bold">Make your board</h3>
          <div className="mt-4 space-y-3">
            {STEPS.map((s, i) => (
              <Card key={s.t} s={s} n={`STEP ${i + 1}`} on={ticks[i]} onToggle={() => toggle(i)} />
            ))}
          </div>
          {/* layout sketch */}
          <div className="mt-5 rounded-2xl border-2 border-dashed border-ink/40 bg-white/70 p-4" aria-hidden>
            <p className="mb-2 text-xs font-bold tracking-widest text-ink-soft uppercase">Suggested layout</p>
            <div className="grid aspect-[1.41] grid-cols-3 grid-rows-3 gap-1.5 text-center text-xs font-bold">
              <span className="row-span-2 grid place-items-center rounded-lg bg-sun-soft">🌟 Dreams</span>
              <span className="grid place-items-center rounded-lg bg-sky">🧭 Values</span>
              <span className="row-span-2 grid place-items-center rounded-lg bg-teal-soft">💪 Strengths</span>
              <span className="grid place-items-center rounded-lg bg-ink text-sun">Name + motto</span>
              <span className="col-span-2 grid place-items-center rounded-lg bg-lilac">🎭 Personality</span>
              <span className="grid place-items-center rounded-lg bg-blush">🎯 Goals</span>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h3 className="text-3xl font-bold">Then: the classroom gallery</h3>
          <div className="mt-4 space-y-3">
            {GALLERY.map((s, i) => (
              <Card key={s.t} s={s} n={`GALLERY ${i + 1}`} on={ticks[STEPS.length + i]} onToggle={() => toggle(STEPS.length + i)} />
            ))}
          </div>
          <div className="mt-5 rounded-[2rem] border-2 border-ink bg-ink p-5 text-center text-cream shadow-pop">
            <p className="font-display text-2xl font-bold">
              A wall full of dreams is a room full of <span className="text-sun">possibility.</span>
            </p>
            <p className="mt-2 text-cream/75">Every week you walk past it, your board reminds you why you show up.</p>
          </div>
        </Reveal>
      </div>
    </Stop>
  );
}
