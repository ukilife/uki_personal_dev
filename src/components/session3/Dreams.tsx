"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Plus, Star, X } from "lucide-react";
import { useLocalState, useStoredSnapshot } from "@/lib/useLocalState";
import { Button, PrivateBadge, Reveal, Stop } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";
import { BUCKET_EMPTY, type BucketState } from "@/components/session2/BucketList";
import { DREAMS_EMPTY, DREAMS_MAX, allDreams, type DreamsState } from "./state";

const STARTERS = [
  { lead: "I want to BECOME…", ph: "a doctor, an engineer, a chef…", emoji: "🧑‍🚀" },
  { lead: "I want to HAVE…", ph: "my own house, a small business…", emoji: "🏡" },
  { lead: "I want to EXPERIENCE…", ph: "living abroad, a mountain sunrise…", emoji: "🌄" },
  { lead: "I want to GIVE…", ph: "help to my parents, a school library…", emoji: "💛" },
];

export function Dreams() {
  const [s, setS] = useLocalState<DreamsState>("s3-dreams", DREAMS_EMPTY);
  const bucket = useStoredSnapshot<BucketState>("s2-bucket", BUCKET_EMPTY);
  const [drafts, setDrafts] = useState<string[]>(STARTERS.map(() => ""));
  const [full, setFull] = useState(false);

  const chosen = allDreams(s);
  const bucketTexts = (bucket.items ?? []).map((i) => i.text);

  const toggleBucket = (t: string) =>
    setS((p) => {
      if (p.picked.includes(t)) return { ...p, picked: p.picked.filter((x) => x !== t) };
      if (allDreams(p).length >= DREAMS_MAX) {
        setFull(true);
        window.setTimeout(() => setFull(false), 1600);
        return p;
      }
      if (allDreams(p).length + 1 === DREAMS_MAX) celebrate("small");
      return { ...p, picked: [...p.picked, t] };
    });

  const addOwn = (i: number) => {
    const t = drafts[i].trim();
    if (!t) return;
    const text = `${STARTERS[i].lead.replace("…", "").replace(/\b(BECOME|HAVE|EXPERIENCE|GIVE)\b/, (w) => w.toLowerCase())} ${t}`;
    if (chosen.length >= DREAMS_MAX) {
      setFull(true);
      window.setTimeout(() => setFull(false), 1600);
      return;
    }
    if (chosen.length + 1 === DREAMS_MAX) celebrate("small");
    setS((p) => ({ ...p, own: [...p.own, text] }));
    setDrafts((d) => d.map((x, j) => (j === i ? "" : x)));
  };

  return (
    <Stop
      id="dreams"
      stop={2}
      kicker="Piece 1 · My dreams"
      tone="sun"
      title={
        <>
          Dream so big it <span className="text-coral">scares</span> you a little 🌟
        </>
      }
      intro={`Choose up to ${DREAMS_MAX} dreams for your board. Start with your bucket list from Session 2, then add the big life dreams: who you want to become, what you want to have, experience and give.`}
      aside={<PrivateBadge />}
    >
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] [&>*]:min-w-0">
        <Reveal>
          <div className="rounded-[2rem] border-2 border-ink bg-white p-5 shadow-pop sm:p-6">
            <p className="font-display text-xl font-bold">🪣 From your bucket list</p>
            {bucketTexts.length === 0 ? (
              <p className="mt-2 text-ink-soft">
                Your Session 2 bucket list is empty on this device. No problem — write your dreams with the starters below.
              </p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {bucketTexts.map((t) => {
                  const on = s.picked.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => toggleBucket(t)}
                      aria-pressed={on}
                      className={`flex items-center gap-1.5 rounded-2xl border-2 px-3 py-2 text-left text-sm font-semibold transition ${
                        on ? "-translate-y-0.5 border-ink bg-sun shadow-pop" : "border-ink/20 bg-cream hover:border-ink"
                      }`}
                    >
                      <Star size={14} className={on ? "fill-ink" : ""} /> {t}
                    </button>
                  );
                })}
              </div>
            )}

            <p className="mt-6 font-display text-xl font-bold">✍️ Big life dreams</p>
            <div className="mt-3 space-y-3">
              {STARTERS.map((st, i) => (
                <form
                  key={st.lead}
                  onSubmit={(e) => {
                    e.preventDefault();
                    addOwn(i);
                  }}
                  className="flex flex-wrap items-center gap-2 rounded-2xl border-2 border-ink/15 bg-cream p-2 sm:flex-nowrap"
                >
                  <span className="shrink-0 px-1 font-display font-bold">
                    {st.emoji} {st.lead}
                  </span>
                  <input
                    value={drafts[i]}
                    onChange={(e) => setDrafts((d) => d.map((x, j) => (j === i ? e.target.value : x)))}
                    maxLength={60}
                    placeholder={st.ph}
                    aria-label={st.lead}
                    className="min-w-0 flex-1 rounded-xl border-2 border-ink bg-white px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-sun/60"
                  />
                  <Button type="submit" variant="coral" className="px-3 py-2">
                    <Plus size={16} />
                  </Button>
                </form>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <motion.div
            animate={full ? { x: [0, -8, 8, -4, 0] } : { x: 0 }}
            transition={{ type: "tween", duration: 0.35 }}
            className="rounded-[2rem] border-4 border-ink bg-ink p-5 text-cream shadow-pop-lg sm:p-6"
          >
            <div className="flex items-center justify-between">
              <p className="font-display text-2xl font-bold text-sun">My board dreams</p>
              <span className="rounded-full bg-sun px-3 py-1 font-display font-bold text-ink tabular-nums">
                {chosen.length}/{DREAMS_MAX}
              </span>
            </div>
            {full && <p className="mt-2 text-sm font-semibold text-coral">Board is full — remove one to add another.</p>}
            {chosen.length === 0 ? (
              <p className="mt-6 text-center text-cream/60">⭐ Star a bucket-list dream or write a big one…</p>
            ) : (
              <ol className="mt-4 space-y-2">
                <AnimatePresence initial={false}>
                  {chosen.map((d, i) => (
                    <motion.li
                      key={d}
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      className="flex items-center gap-3 rounded-2xl bg-white/10 p-3"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sun font-display font-bold text-ink">{i + 1}</span>
                      <span className="min-w-0 flex-1 font-semibold">{d}</span>
                      <button
                        aria-label={`Remove “${d}”`}
                        onClick={() => setS((p) => ({ picked: p.picked.filter((x) => x !== d), own: p.own.filter((x) => x !== d) }))}
                        className="text-cream/50 hover:text-cream"
                      >
                        <X size={16} />
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ol>
            )}
          </motion.div>
        </Reveal>
      </div>
    </Stop>
  );
}
