"use client";

import { motion } from "motion/react";
import { Check, Download } from "lucide-react";
import { useLocalState, useStoredSnapshot } from "@/lib/useLocalState";
import { Button, PrivateBadge, Reveal, Stop } from "@/components/ui";
import {
  BOARD_EMPTY, DREAMS_EMPTY, GOALS_EMPTY, PERSONALITY_EMPTY, STRENGTHS_EMPTY, VALUES_EMPTY, allDreams, allStrengths,
  type BoardState, type DreamsState, type Goal, type PersonalityState, type StrengthsState, type ValuesState,
} from "./state";
import { SLIDERS, sliderSide } from "./Personality";
import { VALUES } from "./Values";

function wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number, maxLines = 3) {
  const words = text.split(" ");
  let line = "";
  let n = 0;
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, y);
      line = w;
      y += lh;
      if (++n >= maxLines - 1) break;
    } else line = test;
  }
  if (line) ctx.fillText(line, x, y);
  return y + lh;
}

type ZoneData = { key: string; title: string; items: string[]; bg: string; hex: string; href: string };

function Zone({ z, className = "" }: { z: ZoneData; className?: string }) {
  return (
    <a href={z.href} className={`block rounded-2xl border-2 border-ink p-3 transition hover:-translate-y-0.5 ${z.bg} ${className}`}>
      <p className="font-display font-bold">{z.title}</p>
      {z.items.length ? (
        <ul className="mt-1 space-y-0.5 text-sm">
          {z.items.slice(0, 6).map((it) => (
            <li key={it} className="truncate">
              • {it}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-sm text-ink/40">Empty — tap to fill ↑</p>
      )}
    </a>
  );
}

export function useBoardData() {
  const dreams = allDreams(useStoredSnapshot<DreamsState>("s3-dreams", DREAMS_EMPTY));
  const values = useStoredSnapshot<ValuesState>("s3-values", VALUES_EMPTY);
  const personality = useStoredSnapshot<PersonalityState>("s3-personality", PERSONALITY_EMPTY);
  const strengths = allStrengths(useStoredSnapshot<StrengthsState>("s3-strengths", STRENGTHS_EMPTY));
  const goals = useStoredSnapshot<Goal[]>("s3-goals", GOALS_EMPTY).filter((g) => g.goal.trim());
  const valueList = values.top.length ? values.top : values.picked.slice(0, 3);
  const traits = [
    ...personality.words,
    ...SLIDERS.flatMap((x) => {
      const label: string | undefined = sliderSide(x.id, personality.sliders[x.id])?.[1];
      return label && !label.startsWith("Both") ? [label] : [];
    }),
  ].slice(0, 6);
  return { dreams, valueList, traits, strengths, goals };
}

export function BoardPlanner() {
  const [b, setB] = useLocalState<BoardState>("s3-board", BOARD_EMPTY);
  const { dreams, valueList, traits, strengths, goals } = useBoardData();
  const vEmoji = (v: string) => VALUES.find(([n]) => n === v)?.[1] ?? "⭐";

  const zones: ZoneData[] = [
    { key: "dreams", title: "🌟 My dreams", items: dreams, bg: "bg-sun-soft", hex: "#fff1c9", href: "#dreams" },
    { key: "values", title: "🧭 My values", items: valueList.map((v) => `${vEmoji(v)} ${v}`), bg: "bg-sky", hex: "#dceefb", href: "#values" },
    { key: "personality", title: "🎭 My personality", items: traits, bg: "bg-lilac", hex: "#e6dcf6", href: "#personality" },
    { key: "strengths", title: "💪 My strengths", items: strengths, bg: "bg-teal-soft", hex: "#c7ecd9", href: "#strengths" },
    { key: "goals", title: "🎯 My future goals", items: goals.map((g) => `${g.by}: ${g.goal}`), bg: "bg-blush", hex: "#fdd8d0", href: "#goals" },
  ];
  const filled = zones.filter((z) => z.items.length).length;

  const download = () => {
    const W = 1600;
    const H = 1130;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const x = c.getContext("2d")!;
    x.fillStyle = "#fff8ec";
    x.fillRect(0, 0, W, H);
    // centre
    x.fillStyle = "#23204e";
    x.beginPath();
    x.roundRect(560, 400, 480, 330, 40);
    x.fill();
    x.textAlign = "center";
    x.fillStyle = "#ffc93c";
    x.font = "700 56px Fredoka, sans-serif";
    x.fillText(b.name.trim() || "My Dream Board", 800, 490);
    x.fillStyle = "#fff8ec";
    x.font = "500 30px Lexend, sans-serif";
    wrap(x, b.motto.trim() ? `“${b.motto.trim()}”` : "", 800, 550, 420, 40, 2);
    if (b.word.trim()) {
      x.fillStyle = "#ffc93c";
      x.font = "700 40px Fredoka, sans-serif";
      x.fillText(`✦ ${b.word.trim().toUpperCase()} ✦`, 800, 690);
    }
    x.textAlign = "left";
    const boxes = [
      [40, 40, 500, 520],
      [560, 40, 480, 340],
      [1060, 40, 500, 520],
      [40, 580, 500, 510],
      [1060, 580, 500, 510],
    ];
    const order = [zones[0], zones[1], zones[3], zones[2], zones[4]];
    order.forEach((z, i) => {
      const [bx, by, bw, bh] = boxes[i];
      x.fillStyle = z.hex;
      x.strokeStyle = "#23204e";
      x.lineWidth = 4;
      x.beginPath();
      x.roundRect(bx, by, bw, bh, 32);
      x.fill();
      x.stroke();
      x.fillStyle = "#23204e";
      x.font = "700 40px Fredoka, sans-serif";
      x.fillText(z.title, bx + 28, by + 62);
      x.font = "500 28px Lexend, sans-serif";
      let y = by + 115;
      z.items.slice(0, 6).forEach((it) => {
        y = wrap(x, `• ${it}`, bx + 28, y, bw - 56, 36, 2) + 4;
      });
    });
    // bottom centre
    x.fillStyle = "#4a4775";
    x.font = "500 26px Lexend, sans-serif";
    x.textAlign = "center";
    x.fillText("Unfold · Session 03 · My Dream Board", 800, 790);
    const a = document.createElement("a");
    a.href = c.toDataURL("image/png");
    a.download = "my-dream-board-plan.png";
    a.click();
  };

  const input =
    "mt-1 w-full rounded-xl border-2 border-ink bg-white px-3 py-2 outline-none focus:ring-4 focus:ring-sun/60";

  return (
    <Stop
      id="planner"
      stop={7}
      kicker="Board planner"
      tone="sun"
      title={
        <>
          Your board, <span className="text-coral">all in one place</span> 🗺️
        </>
      }
      intro="Everything you chose today has been gathered here automatically. Add your name, a motto and one word for the year — then use this plan as your guide when you draw your board on paper."
      aside={<PrivateBadge />}
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] [&>*]:min-w-0">
        <Reveal>
          <div className="rounded-[2rem] border-2 border-ink bg-white p-5 shadow-pop sm:p-6">
            <label className="block font-semibold">
              Name on my board
              <input value={b.name} onChange={(e) => setB((p) => ({ ...p, name: e.target.value }))} maxLength={24} placeholder="Your name or hero name" className={input} />
            </label>
            <label className="mt-4 block font-semibold">
              My motto
              <input
                value={b.motto}
                onChange={(e) => setB((p) => ({ ...p, motto: e.target.value }))}
                maxLength={60}
                placeholder="Small steps every day"
                className={input}
              />
            </label>
            <label className="mt-4 block font-semibold">
              My word for this year
              <input value={b.word} onChange={(e) => setB((p) => ({ ...p, word: e.target.value }))} maxLength={16} placeholder="Brave" className={input} />
            </label>
            <div className="mt-5 space-y-1.5">
              <p className="text-sm font-bold text-ink-soft">Ready to draw? ({filled}/5 pieces)</p>
              {zones.map((z) => (
                <a key={z.key} href={z.href} className="flex items-center gap-2 text-sm font-semibold hover:underline">
                  <span
                    className={`grid h-5 w-5 place-items-center rounded-md border-2 border-ink ${z.items.length ? "bg-teal text-white" : "bg-white"}`}
                  >
                    {z.items.length > 0 && <Check size={12} strokeWidth={3} />}
                  </span>
                  {z.title}
                </a>
              ))}
            </div>
            <Button onClick={download} variant="coral" className="mt-5 w-full" disabled={filled === 0}>
              <Download size={18} /> Save my plan as image
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <motion.div
            initial={{ rotate: 1 }}
            whileHover={{ rotate: 0 }}
            className="rounded-[2rem] border-4 border-ink bg-[#e8b77f] p-3 shadow-pop-lg sm:p-4"
          >
            <div className="grid gap-3 sm:grid-cols-3">
              <Zone z={zones[0]} className="sm:row-span-2" />
              <Zone z={zones[1]} />
              <Zone z={zones[3]} className="sm:row-span-2" />
              <div className="order-first grid place-items-center rounded-2xl border-2 border-ink bg-ink p-4 text-center text-cream sm:order-none">
                <div>
                  <p className="font-display text-2xl leading-tight font-bold text-sun">{b.name.trim() || "My Dream Board"}</p>
                  {b.motto.trim() && <p className="mt-1 text-sm">“{b.motto.trim()}”</p>}
                  {b.word.trim() && <p className="mt-2 font-display font-bold tracking-widest text-sun uppercase">✦ {b.word.trim()} ✦</p>}
                </div>
              </div>
              <Zone z={zones[2]} className="sm:col-span-2" />
              <Zone z={zones[4]} />
            </div>
          </motion.div>
        </Reveal>
      </div>
    </Stop>
  );
}
