"use client";

import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import type { ReactNode } from "react";
import { useLocalState } from "@/lib/useLocalState";
import { PrivateBadge, Reveal, Stop } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";
import { INTERVIEW_EMPTY, answered, type Field, type Interview } from "./state";

type Props = {
  id: string;
  stop: number;
  storageKey: string;
  fields: Field[];
  kicker: string;
  title: ReactNode;
  intro: string;
  tone: "cream" | "sky" | "mint" | "sun" | "lilac" | "blush";
  accent: string;
  card: string;
  emoji: string;
};

export function InterviewCard({ id, stop, storageKey, fields, kicker, title, intro, tone, accent, card, emoji }: Props) {
  const [v, setV] = useLocalState<Interview>(storageKey, INTERVIEW_EMPTY);
  const required = fields.filter((f) => !f.optional);
  const reqDone = answered(required, v);
  const total = answered(fields, v);

  const set = (fid: string, val: string) => {
    const next = { ...v, [fid]: val };
    if (answered(required, next) === required.length && reqDone < required.length) celebrate("big");
    setV(next);
  };

  return (
    <Stop id={id} stop={stop} kicker={kicker} tone={tone} title={title} intro={intro} aside={<PrivateBadge />}>
      <Reveal>
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span className="rounded-full border-2 border-ink bg-white px-4 py-1.5 font-display font-bold tabular-nums">
            {emoji} {total}/{fields.length} noted
          </span>
          <div className="h-3 min-w-40 flex-1 overflow-hidden rounded-full border-2 border-ink bg-white">
            <motion.div className="h-full" style={{ background: accent }} animate={{ width: `${(reqDone / required.length) * 100}%` }} />
          </div>
          <span className="text-sm font-semibold text-ink-soft">Tip: jot key words during the chat, finish sentences afterwards.</span>
        </div>
      </Reveal>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((f, i) => {
          const filled = (v[f.id] ?? "").trim().length > 0;
          return (
            <Reveal key={f.id} delay={(i % 2) * 0.05} className={f.long ? "md:col-span-1" : ""}>
              <label className={`block h-full rounded-[1.5rem] border-2 border-ink p-4 shadow-pop ${filled ? card : "bg-white"}`}>
                <span className="flex items-start justify-between gap-2">
                  <span className="font-display text-lg font-bold">
                    {i + 1}. {f.label}
                    {f.optional && <span className="ml-1.5 text-xs font-semibold text-ink-soft">(optional)</span>}
                  </span>
                </span>
                <span className="mt-2 flex gap-2 rounded-xl rounded-bl-sm bg-cream px-3 py-2 text-sm">
                  <MessageCircle size={16} className="mt-0.5 shrink-0" style={{ color: accent }} />
                  <span>
                    <i>“{f.ask}”</i>
                    {f.followUp && <span className="mt-0.5 block text-ink-soft">↳ Follow-up: “{f.followUp}”</span>}
                  </span>
                </span>
                {f.long ? (
                  <textarea
                    value={v[f.id] ?? ""}
                    onChange={(e) => set(f.id, e.target.value)}
                    rows={3}
                    maxLength={500}
                    placeholder={`e.g. ${f.ph}`}
                    className="mt-3 w-full resize-y rounded-xl border-2 border-ink/25 bg-white px-3 py-2 outline-none focus:border-ink focus:ring-4 focus:ring-sun/50"
                  />
                ) : (
                  <input
                    value={v[f.id] ?? ""}
                    onChange={(e) => set(f.id, e.target.value)}
                    maxLength={80}
                    placeholder={`e.g. ${f.ph}`}
                    className="mt-3 w-full rounded-xl border-2 border-ink/25 bg-white px-3 py-2 outline-none focus:border-ink focus:ring-4 focus:ring-sun/50"
                  />
                )}
              </label>
            </Reveal>
          );
        })}
      </div>
    </Stop>
  );
}
