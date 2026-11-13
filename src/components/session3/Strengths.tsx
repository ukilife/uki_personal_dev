"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useLocalState, useStoredSnapshot } from "@/lib/useLocalState";
import { Button, PrivateBadge, Reveal, Stop } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";
import { TEN_AND_TEN_EMPTY, type TenAndTenState } from "@/components/session1/TenAndTen";
import { POWERS, POWER_EMPTY, type PowerState } from "@/components/session1/Superpowers";
import { THEIR_EYES_EMPTY, othersSee, type TheirEyesState } from "@/components/session1/TheirEyes";
import { SWOT_EMPTY, type SwotState } from "@/components/session2/MySwot";
import { STRENGTHS_EMPTY, allStrengths, type StrengthsState } from "./state";

const MAX = 5;

export function Strengths() {
  const [s, setS] = useLocalState<StrengthsState>("s3-strengths", STRENGTHS_EMPTY);
  const ten = useStoredSnapshot<TenAndTenState>("s1-ten-and-ten", TEN_AND_TEN_EMPTY);
  const powers = useStoredSnapshot<PowerState>("s1-superpowers", POWER_EMPTY);
  const eyes = useStoredSnapshot<TheirEyesState>("s1-their-eyes", THEIR_EYES_EMPTY);
  const swot = useStoredSnapshot<SwotState>("s2-swot", SWOT_EMPTY);
  const [draft, setDraft] = useState("");
  const [full, setFull] = useState(false);

  const groups = [
    { from: "My superpowers (S1)", tone: "bg-sky", items: powers.picked.map((id) => POWERS.find((p) => p.id === id)?.label ?? "") },
    { from: "Others see in me (S1)", tone: "bg-blush", items: othersSee(eyes) },
    { from: "My 10 strengths (S1)", tone: "bg-teal-soft", items: ten.strengths },
    { from: "My SWOT strengths (S2)", tone: "bg-sun-soft", items: swot.s ?? [] },
  ]
    .map((g) => ({ ...g, items: [...new Set(g.items.map((x) => x.trim()).filter(Boolean))] }))
    .filter((g) => g.items.length);

  const chosen = allStrengths(s);

  const add = (t: string, own = false) =>
    setS((p) => {
      const cur = allStrengths(p);
      if (cur.includes(t)) return own ? p : { ...p, picked: p.picked.filter((x) => x !== t), own: p.own.filter((x) => x !== t) };
      if (cur.length >= MAX) {
        setFull(true);
        window.setTimeout(() => setFull(false), 1500);
        return p;
      }
      if (cur.length + 1 === MAX) celebrate("small");
      return own ? { ...p, own: [...p.own, t] } : { ...p, picked: [...p.picked, t] };
    });

  return (
    <Stop
      id="strengths"
      stop={5}
      kicker="Piece 4 · My strengths"
      tone="mint"
      title={
        <>
          The <span className="text-teal">fuel</span> for your dreams 💪
        </>
      }
      intro="You've been collecting strengths for two weeks — from yourself, from 5 people around you and from your SWOT. Now choose the 5 that will carry you towards your dreams."
      aside={<PrivateBadge />}
    >
      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] [&>*]:min-w-0">
        <Reveal>
          {groups.length === 0 ? (
            <div className="rounded-[2rem] border-2 border-dashed border-ink/30 bg-white/70 p-6">
              <p className="font-semibold">
                No saved strengths from Sessions 1 or 2 on this device. Type your strengths below — think about what people thank you for.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {groups.map((g) => (
                <div key={g.from} className={`rounded-[1.5rem] border-2 border-ink p-4 ${g.tone}`}>
                  <p className="text-xs font-bold tracking-widest text-ink-soft uppercase">{g.from}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {g.items.map((t) => {
                      const on = chosen.includes(t);
                      return (
                        <button
                          key={t}
                          onClick={() => add(t)}
                          aria-pressed={on}
                          className={`rounded-full border-2 px-3 py-1.5 text-sm font-semibold transition ${
                            on ? "-translate-y-0.5 border-ink bg-teal text-white shadow-pop" : "border-ink/20 bg-white hover:border-ink"
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (draft.trim()) add(draft.trim(), true);
              setDraft("");
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={40}
              placeholder="Add a strength of your own…"
              aria-label="Add a strength of your own"
              className="min-w-0 flex-1 rounded-2xl border-2 border-ink bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-sun/60"
            />
            <Button type="submit" variant="teal">
              <Plus size={18} />
            </Button>
          </form>
        </Reveal>

        <Reveal delay={0.1}>
          <motion.div
            animate={full ? { x: [0, -8, 8, -4, 0] } : { x: 0 }}
            transition={{ type: "tween", duration: 0.35 }}
            className="rounded-[2rem] border-4 border-ink bg-white p-5 shadow-pop-lg sm:p-6"
          >
            <div className="flex items-center justify-between">
              <p className="font-display text-2xl font-bold">My top 5</p>
              <span className="rounded-full border-2 border-ink bg-sun px-3 py-0.5 font-display font-bold">
                {chosen.length}/{MAX}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              {Array.from({ length: MAX }).map((_, i) => (
                <div key={i} className="flex h-12 items-center gap-3 rounded-2xl border-2 border-dashed border-ink/25 px-3">
                  <span className="text-xl">{["🥇", "🥈", "🥉", "🏅", "🏅"][i]}</span>
                  <AnimatePresence mode="wait">
                    {chosen[i] ? (
                      <motion.span
                        key={chosen[i]}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex min-w-0 flex-1 items-center justify-between font-display text-lg font-bold"
                      >
                        <span className="truncate">{chosen[i]}</span>
                        <button
                          aria-label={`Remove ${chosen[i]}`}
                          onClick={() => setS((p) => ({ picked: p.picked.filter((x) => x !== chosen[i]), own: p.own.filter((x) => x !== chosen[i]) }))}
                          className="text-ink/40 hover:text-ink"
                        >
                          <X size={16} />
                        </button>
                      </motion.span>
                    ) : (
                      <span key="empty" className="text-sm text-ink/30">
                        empty
                      </span>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
            {full && <p className="mt-3 text-sm font-semibold text-coral">Only 5 fit — remove one to swap.</p>}
          </motion.div>
        </Reveal>
      </div>
    </Stop>
  );
}
