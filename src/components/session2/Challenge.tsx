"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useLocalState } from "@/lib/useLocalState";
import { PrivateBadge, Reveal, Stop } from "@/components/ui";

type ZoneId = "comfort" | "growth" | "panic";
export type ZonesState = Record<ZoneId, string>;
export const ZONES_EMPTY: ZonesState = { comfort: "", growth: "", panic: "" };

const ZONES: { id: ZoneId; name: string; emoji: string; fill: string; r: number; feel: string; text: string; prompt: string; ph: string }[] = [
  {
    id: "panic",
    name: "Panic Zone",
    emoji: "😱",
    fill: "#fdd8d0",
    r: 48,
    feel: "Too much, too fast",
    text: "Way too far, too soon — you freeze and learn nothing. Don't jump here. Grow your way towards it.",
    prompt: "Something that feels way too scary right now",
    ph: "Giving a speech to the whole school",
  },
  {
    id: "growth",
    name: "Growth Zone",
    emoji: "🧗",
    fill: "#ffc93c",
    r: 33,
    feel: "Hard, but possible",
    text: "Your heart beats a bit faster. You might mess up. THIS is where you learn, get stronger and become a new you.",
    prompt: "A challenge I'll take on this month",
    ph: "Asking a question in class",
  },
  {
    id: "comfort",
    name: "Comfort Zone",
    emoji: "🛋️",
    fill: "#c7ecd9",
    r: 18,
    feel: "Safe and easy",
    text: "Everything feels familiar. Nice for resting — but nothing grows here. Stay too long and life gets small.",
    prompt: "Something that's easy for me now",
    ph: "Chatting with my best friend",
  },
];

export function Challenge() {
  const [active, setActive] = useState<ZoneId>("growth");
  const [mine, setMine] = useLocalState<ZonesState>("s2-zones", ZONES_EMPTY);
  const z = ZONES.find((x) => x.id === active)!;

  return (
    <Stop
      id="challenge"
      stop={5}
      kicker="The importance of challenge"
      tone="sky"
      title={
        <>
          Nothing grows in the <span className="text-teal">comfort zone.</span>
        </>
      }
      intro="Muscles get stronger only when you push them a little past easy. Your brain is the same: every hard thing you learn builds new connections. Challenge isn't a punishment — it's how you grow."
      aside={<PrivateBadge />}
    >
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <Reveal className="mx-auto w-full max-w-md">
          <svg viewBox="0 0 100 100" className="w-full" role="group" aria-label="Comfort, growth and panic zones">
            {ZONES.map((zone) => (
              <motion.circle
                key={zone.id}
                cx="50"
                cy="50"
                r={zone.r}
                fill={zone.fill}
                stroke="#23204e"
                strokeWidth={active === zone.id ? 1.6 : 0.8}
                className="cursor-pointer outline-none"
                tabIndex={0}
                role="button"
                aria-label={zone.name}
                aria-pressed={active === zone.id}
                onClick={() => setActive(zone.id)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setActive(zone.id))}
                animate={{ scale: active === zone.id ? 1.03 : 1 }}
                style={{ transformOrigin: "50px 50px" }}
              />
            ))}
            <text x="50" y="52" textAnchor="middle" fontSize="5" fontWeight="700" fill="#23204e" pointerEvents="none">
              🛋️ Comfort
            </text>
            <text x="50" y="25" textAnchor="middle" fontSize="5" fontWeight="700" fill="#23204e" pointerEvents="none">
              🧗 Growth
            </text>
            <text x="50" y="8.5" textAnchor="middle" fontSize="4.6" fontWeight="700" fill="#23204e" pointerEvents="none">
              😱 Panic
            </text>
          </svg>
          <p className="mt-2 text-center text-sm text-ink-soft">Tap a zone</p>
        </Reveal>

        <Reveal delay={0.1}>
          <AnimatePresence mode="wait">
            <motion.div
              key={z.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="rounded-[2rem] border-2 border-ink p-6 shadow-pop"
              style={{ background: z.fill }}
            >
              <span className="text-5xl">{z.emoji}</span>
              <h3 className="mt-2 text-3xl font-bold">{z.name}</h3>
              <p className="font-display text-lg font-semibold text-ink-soft">{z.feel}</p>
              <p className="mt-3 text-lg">{z.text}</p>
            </motion.div>
          </AnimatePresence>
          <blockquote className="mt-6 border-l-4 border-ink pl-4 font-display text-xl font-semibold">
            “A ship in harbour is safe, but that is not what ships are built for.”
            <span className="mt-1 block text-sm font-normal text-ink-soft">— John A. Shedd</span>
          </blockquote>
        </Reveal>
      </div>

      <Reveal className="mt-12">
        <h3 className="text-3xl font-bold">Map your own zones</h3>
        <p className="mt-1 text-ink-soft">One thing for each zone. Your growth-zone challenge could become your 21-day challenge!</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[...ZONES].reverse().map((zone) => (
            <label key={zone.id} className="block rounded-[1.75rem] border-2 border-ink p-5 shadow-pop" style={{ background: zone.fill }}>
              <span className="font-display text-xl font-bold">
                {zone.emoji} {zone.name}
              </span>
              <span className="mt-1 block text-sm text-ink-soft">{zone.prompt}</span>
              <textarea
                value={mine[zone.id]}
                onChange={(e) => setMine((p) => ({ ...p, [zone.id]: e.target.value }))}
                rows={2}
                maxLength={120}
                placeholder={`e.g. ${zone.ph}`}
                className="mt-3 w-full resize-none rounded-xl border-2 border-ink bg-white/90 px-3 py-2 outline-none focus:ring-4 focus:ring-ink/20"
              />
            </label>
          ))}
        </div>
      </Reveal>
    </Stop>
  );
}
