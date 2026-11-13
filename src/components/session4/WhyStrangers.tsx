"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { useStoredSnapshot } from "@/lib/useLocalState";
import { Reveal, Stop } from "@/components/ui";
import { ZONES_EMPTY, type ZonesState } from "@/components/session2/Challenge";
import { DREAMS_EMPTY, allDreams, type DreamsState } from "@/components/session3/state";

const FEARS = [
  { fear: "They'll ignore me.", truth: "Some might be busy — that's about their day, not about you. Smile, say thank you, try the next person." },
  { fear: "I won't know what to say.", truth: "You'll have a question card. You only need the first line — people LOVE talking about their own life." },
  { fear: "They'll think I'm weird.", truth: "Most adults are delighted a young person is curious about them. You might make their day." },
  { fear: "I'll get nervous and freeze.", truth: "Everyone does at first. Go in pairs, take a breath, and let your partner start the first one." },
  { fear: "Business owners are too busy.", truth: "Pick a quiet moment, ask for just 5 minutes, and buy something small if you can. Most will say yes." },
  { fear: "It won't teach me anything.", truth: "Every person has survived something you haven't yet. One sentence of advice can stay with you for life." },
];

function FearCard({ fear, truth, i }: { fear: string; truth: string; i: number }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      aria-label={flipped ? `Reality: ${truth}` : `Fear: ${fear}. Tap to see the reality.`}
      className="h-48 w-full rounded-[1.5rem] [perspective:1000px] focus-visible:ring-4 focus-visible:ring-sun focus-visible:outline-none"
    >
      <motion.span
        className="relative block h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 18 }}
        whileHover={{ y: -4, rotate: i % 2 ? 1 : -1 }}
      >
        <span className="absolute inset-0 flex flex-col items-center justify-center rounded-[1.5rem] border-2 border-ink bg-white p-4 text-center shadow-pop [backface-visibility:hidden]">
          <span className="text-3xl">😬</span>
          <span className="mt-2 font-display text-xl font-bold">“{fear}”</span>
          <span className="mt-2 text-xs font-bold text-ink/40">Tap to flip →</span>
        </span>
        <span className="absolute inset-0 flex flex-col items-center justify-center rounded-[1.5rem] border-2 border-ink bg-teal p-4 text-center text-white shadow-pop [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <span className="text-xs font-bold tracking-widest uppercase opacity-80">Reality</span>
          <span className="mt-1 font-semibold">{truth}</span>
        </span>
      </motion.span>
    </button>
  );
}

export function WhyStrangers() {
  const zones = useStoredSnapshot<ZonesState>("s2-zones", ZONES_EMPTY);
  const dreams = allDreams(useStoredSnapshot<DreamsState>("s3-dreams", DREAMS_EMPTY));
  return (
    <Stop
      id="why"
      stop={1}
      kicker="Why talk to strangers?"
      tone="cream"
      title={
        <>
          Every stranger is a <span className="text-coral">book</span> you haven&apos;t read yet 📖
        </>
      }
      intro="The person selling tea at the corner may have rebuilt their life three times. The shop owner down the road may have started with nothing. Their lessons are free — you just have to be brave enough to ask."
    >
      <Reveal>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.75rem] border-2 border-ink bg-sun-soft p-5 shadow-pop">
            <p className="font-display text-xl font-bold">🧗 Remember your Growth Zone?</p>
            <p className="mt-1 text-ink-soft">
              In Session 2 you learned that nothing grows in the comfort zone. Today you step into the growth zone — for real.
            </p>
            {zones.growth.trim() && (
              <p className="mt-3 rounded-xl bg-white px-3 py-2 text-sm">
                You wrote: <b>“{zones.growth.trim()}”</b> — today is practice for exactly that.
              </p>
            )}
          </div>
          <div className="rounded-[1.75rem] border-2 border-ink bg-mint p-5 shadow-pop">
            <p className="font-display text-xl font-bold">🌟 Someone has lived your dream</p>
            <p className="mt-1 text-ink-soft">
              Somewhere out there is a person who has already done part of what&apos;s on your dream board. Their advice is a shortcut.
            </p>
            {dreams.length > 0 && (
              <p className="mt-3 rounded-xl bg-white px-3 py-2 text-sm">
                Your board says: <b>{dreams.slice(0, 3).join(" · ")}</b>. Listen for anyone connected to these!
              </p>
            )}
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-12">
        <h3 className="text-3xl font-bold">Fear vs reality</h3>
        <p className="mt-1 text-ink-soft">Your brain will invent reasons not to do this. Flip each fear to see what really happens.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEARS.map((f, i) => (
            <FearCard key={f.fear} {...f} i={i} />
          ))}
        </div>
      </Reveal>
    </Stop>
  );
}
