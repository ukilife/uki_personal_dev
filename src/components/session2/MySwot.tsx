"use client";

import { motion } from "motion/react";
import { Download, Import, Plus, X } from "lucide-react";
import { useLocalState, useStoredSnapshot } from "@/lib/useLocalState";
import { Button, PrivateBadge, Reveal, Stop } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";
import { TEN_AND_TEN_EMPTY, type TenAndTenState } from "@/components/session1/TenAndTen";
import { POWERS, POWER_EMPTY, type PowerState } from "@/components/session1/Superpowers";
import { STRENGTHS_TWO_EMPTY, type StrengthsTwoState } from "./StrengthsPart2";
import { SWOT, type SwotKey } from "./SwotIntro";

export type SwotState = Record<SwotKey, string[]> & { move: string };
export const SWOT_EMPTY: SwotState = { s: ["", "", ""], w: ["", "", ""], o: ["", "", ""], t: ["", "", ""], move: "" };

const MAX = 8;
const IDEAS: Record<SwotKey, string[]> = {
  s: [],
  w: [],
  o: ["A teacher I can ask for help", "Free online courses", "School clubs", "A family member with skills", "Library books", "Weekend workshops"],
  t: ["Too much phone time", "Friends who pull me off track", "Fear of what others think", "Not enough sleep", "Exam pressure", "Money is tight"],
};

const HEX: Record<SwotKey, [string, string]> = {
  s: ["#c7ecd9", "#1f9d8a"],
  w: ["#fdd8d0", "#f7845e"],
  o: ["#fff1c9", "#b88600"],
  t: ["#e6dcf6", "#7b3fa0"],
};

export function MySwot() {
  const [s, setS] = useLocalState<SwotState>("s2-swot", SWOT_EMPTY);
  const ten = useStoredSnapshot<TenAndTenState>("s1-ten-and-ten", TEN_AND_TEN_EMPTY);
  const powers = useStoredSnapshot<PowerState>("s1-superpowers", POWER_EMPTY);
  const part2 = useStoredSnapshot<StrengthsTwoState>("s2-strengths", STRENGTHS_TWO_EMPTY);

  const filled = (k: SwotKey) => (s[k] ?? []).filter((v) => v.trim()).length;
  const complete = SWOT.every((q) => filled(q.key) >= 3);

  const write = (k: SwotKey, items: string[]) => {
    const next = { ...s, [k]: items };
    const nowDone = SWOT.every((q) => next[q.key].filter((v) => v.trim()).length >= 3);
    if (nowDone && !complete) celebrate("big");
    setS(next);
  };

  const addTo = (k: SwotKey, v: string) => {
    const list = s[k];
    if (list.some((x) => x.trim() === v)) return;
    const empty = list.findIndex((x) => !x.trim());
    if (empty >= 0) write(k, list.map((x, i) => (i === empty ? v : x)));
    else if (list.length < MAX) write(k, [...list, v]);
  };

  const strengthsFromS1 = [
    ...ten.strengths.filter((v) => v.trim()),
    ...powers.picked.map((id) => POWERS.find((p) => p.id === id)?.label ?? ""),
  ];
  const weakFromS1 = ten.improve
    .concat(part2.extraWeak)
    .filter((v) => v.trim() && part2.sort[v] !== "accept");
  const canImport = strengthsFromS1.length + weakFromS1.length > 0;

  const importS1 = () => {
    const merge = (cur: string[], add: string[]) => {
      const out = [...new Set([...cur.filter((x) => x.trim()), ...add.map((x) => x.trim()).filter(Boolean)])].slice(0, MAX);
      return out.length >= 3 ? out : [...out, ...Array(3 - out.length).fill("")];
    };
    setS((p) => ({ ...p, s: merge(p.s, strengthsFromS1), w: merge(p.w, weakFromS1) }));
  };

  const download = () => {
    const W = 1080;
    const H = 1350;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const x = c.getContext("2d")!;
    x.fillStyle = "#fff8ec";
    x.fillRect(0, 0, W, H);
    x.fillStyle = "#23204e";
    x.font = "700 80px Fredoka, sans-serif";
    x.fillText("My SWOT", 60, 120);
    x.font = "500 30px Lexend, sans-serif";
    x.fillStyle = "#4a4775";
    x.fillText("Unfold · Session 02", 60, 170);
    const boxW = (W - 60 * 2 - 30) / 2;
    const boxH = 470;
    SWOT.forEach((q, i) => {
      const bx = 60 + (i % 2) * (boxW + 30);
      const by = 220 + Math.floor(i / 2) * (boxH + 30);
      x.fillStyle = HEX[q.key][0];
      x.strokeStyle = "#23204e";
      x.lineWidth = 4;
      x.beginPath();
      x.roundRect(bx, by, boxW, boxH, 36);
      x.fill();
      x.stroke();
      x.fillStyle = HEX[q.key][1];
      x.font = "700 48px Fredoka, sans-serif";
      x.fillText(`${q.letter} · ${q.name}`, bx + 32, by + 70);
      x.fillStyle = "#23204e";
      x.font = "500 30px Lexend, sans-serif";
      s[q.key]
        .filter((v) => v.trim())
        .slice(0, 8)
        .forEach((v, j) => {
          const t = v.length > 30 ? v.slice(0, 29) + "…" : v;
          x.fillText(`• ${t}`, bx + 32, by + 130 + j * 42);
        });
    });
    x.fillStyle = "#23204e";
    x.fillRect(0, H - 110, W, 110);
    x.fillStyle = "#ffc93c";
    x.font = "600 32px Fredoka, sans-serif";
    x.fillText(s.move.trim() ? `My best move: ${s.move.trim()}`.slice(0, 58) : "Know yourself. Plan your climb. ⛰️", 60, H - 45);
    const a = document.createElement("a");
    a.href = c.toDataURL("image/png");
    a.download = "my-swot.png";
    a.click();
  };

  return (
    <Stop
      id="my-swot"
      stop={7}
      kicker="Complete your own SWOT"
      tone="lilac"
      title={
        <>
          Now it&apos;s <span className="text-grape">your</span> turn 🗺️
        </>
      }
      intro="At least 3 in every box. Be honest — nobody sees this but you. Your strengths and weaknesses from Session 1 can come along with one tap."
      aside={<PrivateBadge />}
    >
      {canImport && (
        <Reveal className="mb-6">
          <Button variant="white" onClick={importS1}>
            <Import size={18} /> Bring in my Session 1 strengths &amp; weaknesses
          </Button>
        </Reveal>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {SWOT.map((q, qi) => {
          const items = s[q.key] ?? [];
          const n = filled(q.key);
          return (
            <Reveal key={q.key} delay={qi * 0.06}>
              <div className={`h-full rounded-[2rem] border-2 border-ink p-5 shadow-pop ${q.bg}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className={`font-display text-3xl font-bold ${q.ink}`}>
                      {q.letter} · {q.name}
                    </p>
                    <p className="text-sm text-ink-soft">{q.qs[0]}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border-2 border-ink px-3 py-1 font-display font-bold tabular-nums ${
                      n >= 3 ? "bg-sun" : "bg-white"
                    }`}
                  >
                    {n}/3{n >= 3 && " ✓"}
                  </span>
                </div>
                <ol className="mt-3 space-y-1.5">
                  {items.map((v, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className={`w-5 shrink-0 text-right font-display font-bold ${v.trim() ? "" : "text-ink/30"}`}>{i + 1}</span>
                      <input
                        value={v}
                        onChange={(e) => write(q.key, items.map((x, j) => (j === i ? e.target.value : x)))}
                        maxLength={60}
                        placeholder={q.qs[i % q.qs.length]}
                        aria-label={`${q.name} ${i + 1}`}
                        className="w-full min-w-0 border-b-2 border-dashed border-ink/25 bg-transparent px-1 py-1.5 outline-none placeholder:text-ink/35 focus:border-solid focus:border-ink"
                      />
                      {items.length > 3 && (
                        <button
                          aria-label="Remove line"
                          onClick={() => write(q.key, items.filter((_, j) => j !== i))}
                          className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-ink/40 hover:bg-white hover:text-ink"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </li>
                  ))}
                </ol>
                {items.length < MAX && (
                  <button
                    onClick={() => write(q.key, [...items, ""])}
                    className="mt-3 flex items-center gap-1.5 rounded-xl border-2 border-dashed border-ink/30 px-3 py-1.5 text-sm font-semibold text-ink-soft hover:border-ink hover:text-ink"
                  >
                    <Plus size={14} /> Add one more
                  </button>
                )}
                {IDEAS[q.key].length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {IDEAS[q.key]
                      .filter((idea) => !items.includes(idea))
                      .map((idea) => (
                        <button
                          key={idea}
                          onClick={() => addTo(q.key, idea)}
                          className="rounded-full border border-ink/25 bg-white/70 px-2.5 py-1 text-xs font-semibold hover:border-ink"
                        >
                          + {idea}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal className="mt-8">
        <div className="grid items-center gap-5 rounded-[2rem] border-2 border-ink bg-ink p-5 text-cream shadow-pop sm:p-7 md:grid-cols-[1fr_auto]">
          <label className="block">
            <span className="font-display text-xl font-bold text-sun">My best move ⭐</span>
            <span className="block text-cream/75">Which strength will you use to grab which opportunity?</span>
            <input
              value={s.move}
              onChange={(e) => setS((p) => ({ ...p, move: e.target.value }))}
              maxLength={80}
              placeholder="Use my drawing skills to join the art club"
              className="mt-3 w-full rounded-xl border-2 border-cream/30 bg-white/10 px-4 py-3 text-lg text-cream outline-none placeholder:text-cream/40 focus:border-sun"
            />
          </label>
          <motion.div whileHover={{ rotate: -2 }}>
            <Button onClick={download} variant="sun" disabled={!SWOT.some((q) => filled(q.key) > 0)}>
              <Download size={18} /> Save my SWOT
            </Button>
          </motion.div>
        </div>
      </Reveal>
    </Stop>
  );
}
