"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Check, Shuffle } from "lucide-react";
import { useLocalState } from "@/lib/useLocalState";
import { Button, Reveal, Stop } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";

const OPENERS = [
  "Excuse me, sorry to disturb you. I'm a student doing a school project about life lessons — could I ask you a few questions? It takes 5 minutes.",
  "Hello! We're students learning from people in our town. You look like someone with a story — would you mind if we chatted for a few minutes?",
  "Good morning! I'm working on a personal development project. Could I ask what life has taught you? Only if you have a few minutes.",
  "Hi! I'm planning to start my own business one day. Could I ask you a few questions about how you started yours?",
];

const LISTEN = [
  ["👀", "Eye contact & a smile", "Show them you're really listening."],
  ["🤐", "Don't interrupt", "Silence is OK. Often the best part comes after a pause."],
  ["🔁", "Ask “and then?”", "Follow-up questions turn short answers into stories."],
  ["📝", "Note key words only", "Write 2–3 words, then fill in details right after."],
  ["💛", "Be gentle with pain", "If they get emotional, say “thank you for sharing” — never push."],
  ["🙏", "Always say thank you", "End with: “Thank you — I'll remember this.”"],
];

export const SAFETY = [
  "I'll stay with my partner or group the whole time.",
  "I'll only talk to people in busy, public places.",
  "I won't get into any vehicle or go inside anyone's home.",
  "I won't share my phone number, address or social media.",
  "If someone says no or seems uncomfortable, I'll politely move on.",
  "I'll stay inside the area my teacher agreed and be back on time.",
  "If anything feels wrong, I'll leave and tell my teacher right away.",
];

export function Toolkit() {
  const [k, setK] = useState(0);
  const [safe, setSafe] = useLocalState<boolean[]>("s4-safety", SAFETY.map(() => false));
  const ticks = SAFETY.map((_, i) => !!safe[i]);
  const all = ticks.every(Boolean);

  return (
    <Stop
      id="toolkit"
      stop={2}
      kicker="Conversation toolkit"
      tone="sky"
      title={
        <>
          How to start, listen — and stay <span className="text-teal">safe</span> 🧰
        </>
      }
      intro="Brave doesn't mean careless. Pack these three tools before you walk out the door."
    >
      <div className="grid gap-6 lg:grid-cols-3 [&>*]:min-w-0">
        <Reveal>
          <div className="h-full rounded-[2rem] border-2 border-ink bg-white p-5 shadow-pop">
            <p className="font-display text-2xl font-bold">1 · Start 👋</p>
            <p className="mt-1 text-sm text-ink-soft">Say who you are, why you&apos;re asking, and how long it takes. Then ASK permission.</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={k}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 rounded-2xl rounded-bl-sm border-2 border-ink bg-sun-soft p-4 font-display text-lg leading-snug font-semibold"
              >
                “{OPENERS[k]}”
              </motion.p>
            </AnimatePresence>
            <Button variant="white" className="mt-4 px-3 py-2 text-sm" onClick={() => setK((x) => (x + 1) % OPENERS.length)}>
              <Shuffle size={16} /> Another opener
            </Button>
            <p className="mt-4 text-sm text-ink-soft">
              💡 Name and age are <b>optional</b> — only ask if they seem comfortable, and accept “I&apos;d rather not”.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="h-full rounded-[2rem] border-2 border-ink bg-white p-5 shadow-pop">
            <p className="font-display text-2xl font-bold">2 · Listen 👂</p>
            <ul className="mt-3 space-y-2.5">
              {LISTEN.map(([e, t, d]) => (
                <li key={t} className="flex gap-3">
                  <span className="text-2xl">{e}</span>
                  <span>
                    <b className="block">{t}</b>
                    <span className="text-sm text-ink-soft">{d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className={`h-full rounded-[2rem] border-2 border-ink p-5 shadow-pop ${all ? "bg-teal-soft" : "bg-white"}`}>
            <div className="flex items-center justify-between">
              <p className="font-display text-2xl font-bold">3 · Stay safe 🛡️</p>
              <span className="rounded-full border-2 border-ink bg-white px-2.5 py-0.5 font-display text-sm font-bold">
                {ticks.filter(Boolean).length}/{SAFETY.length}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-soft">Tick each one as your promise.</p>
            <ul className="mt-3 space-y-2">
              {SAFETY.map((s, i) => (
                <li key={s}>
                  <button
                    onClick={() => {
                      const next = ticks.map((v, j) => (j === i ? !v : v));
                      if (next.every(Boolean) && !all) celebrate("small");
                      setSafe(next);
                    }}
                    aria-pressed={ticks[i]}
                    className="flex w-full items-start gap-2.5 text-left text-sm"
                  >
                    <span
                      className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 border-ink ${ticks[i] ? "bg-teal text-white" : "bg-white"}`}
                    >
                      {ticks[i] && <Check size={12} strokeWidth={3} />}
                    </span>
                    <span className={ticks[i] ? "font-semibold" : ""}>{s}</span>
                  </button>
                </li>
              ))}
            </ul>
            {all && <p className="mt-3 font-display font-bold text-teal">Safety promise made. You&apos;re ready. ✅</p>}
          </div>
        </Reveal>
      </div>
    </Stop>
  );
}
