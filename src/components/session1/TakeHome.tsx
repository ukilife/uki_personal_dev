"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Check, Download, Lock, Trash2 } from "lucide-react";
import { clearJourney, useLocalState, useStoredSnapshot } from "@/lib/useLocalState";
import { Button, Reveal, Stop } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";
import { REAL_YOU_EMPTY, type RealYou } from "./RealYou";
import { POWERS, POWER_EMPTY, type PowerState } from "./Superpowers";
import { NOT_YET_EMPTY, type NotYetState } from "./NotYet";

const MISSIONS = [
  {
    n: "01",
    title: "About Me page",
    text: "Write one page about yourself in your Growth Journal — use everything you discovered today.",
    emoji: "📝",
    bg: "bg-sun-soft",
  },
  {
    n: "02",
    title: "Through Their Eyes",
    text: "Ask two people: “What are my top 3 strengths?” and “What's one thing I could improve?”",
    emoji: "👀",
    bg: "bg-sky",
  },
  {
    n: "03",
    title: "7-Page Challenge",
    text: "Read 7 pages of any book this week — and note one idea that stuck with you.",
    emoji: "📚",
    bg: "bg-mint",
  },
];

function wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number) {
  const words = text.split(" ");
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, y);
      line = w;
      y += lh;
    } else line = test;
  }
  if (line) ctx.fillText(line, x, y);
  return y + lh;
}

export function TakeHome() {
  const [done, setDone] = useLocalState<boolean[]>("s1-missions", [false, false, false]);
  const words = useStoredSnapshot<string[]>("s1-mirror-words", []);
  const realYou = useStoredSnapshot<RealYou>("s1-real-you", REAL_YOU_EMPTY);
  const powers = useStoredSnapshot<PowerState>("s1-superpowers", POWER_EMPTY);
  const notYet = useStoredSnapshot<NotYetState>("s1-not-yet", NOT_YET_EMPTY);

  const proud = POWERS.find((p) => p.id === powers.proud);
  const powerLabels = powers.picked.map((id) => POWERS.find((p) => p.id === id)?.label).filter(Boolean) as string[];
  const loves = realYou.passions.filter((v) => v.trim());
  const growing = notYet.chosen !== null ? notYet.weak[notYet.chosen] : "";

  const toggle = (i: number) => {
    setDone((d) => {
      const next = d.map((v, j) => (j === i ? !v : v));
      if (next.every(Boolean)) celebrate("big");
      return next;
    });
  };

  const downloadCard = () => {
    const W = 1080;
    const H = 1350;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const x = c.getContext("2d")!;
    x.fillStyle = "#fff8ec";
    x.fillRect(0, 0, W, H);
    x.fillStyle = "#dceefb";
    x.fillRect(0, 0, W, 330);
    x.fillStyle = "#23204e";
    x.font = "700 92px Fredoka, sans-serif";
    x.fillText("Who am I?", 80, 170);
    x.font = "500 34px Lexend, sans-serif";
    x.fillStyle = "#4a4775";
    x.fillText(powers.alias ? `aka ${powers.alias}` : "Uki Growth Journey · Session 01", 80, 240);
    let y = 420;
    const block = (title: string, body: string, color: string) => {
      if (!body) return;
      x.fillStyle = color;
      x.beginPath();
      x.roundRect(80, y - 44, 18, 18, 6);
      x.fill();
      x.fillStyle = "#4a4775";
      x.font = "600 26px Lexend, sans-serif";
      x.fillText(title.toUpperCase(), 116, y - 26);
      x.fillStyle = "#23204e";
      x.font = "600 44px Fredoka, sans-serif";
      y = wrap(x, body, 80, y + 30, W - 160, 56) + 40;
    };
    block("In three words", words.join(" · "), "#f7845e");
    block("I love", loves.join(", "), "#ffc93c");
    block("My superpowers", powerLabels.join(", "), "#2f7fc1");
    block("Proudest of", proud?.label ?? "", "#7b3fa0");
    block("Growing (not yet!)", growing, "#1f9d8a");
    x.fillStyle = "#23204e";
    x.fillRect(0, H - 120, W, 120);
    x.fillStyle = "#ffc93c";
    x.font = "600 34px Fredoka, sans-serif";
    x.fillText("You don't have to be perfect. Just keep growing. 🌱", 80, H - 50);
    const a = document.createElement("a");
    a.href = c.toDataURL("image/png");
    a.download = "who-am-i-card.png";
    a.click();
  };

  const missionsDone = done.filter(Boolean).length;

  return (
    <Stop
      id="take-home"
      stop={11}
      kicker="Take-home missions"
      tone="cream"
      title={
        <>
          Your missions <span className="text-coral">this week</span> 🎒
        </>
      }
      intro="The session ends here — the journey doesn't. Complete these before Session 2 and tick them off as you go."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {MISSIONS.map((m, i) => (
          <Reveal key={m.n} delay={i * 0.08}>
            <motion.button
              onClick={() => toggle(i)}
              whileHover={{ y: -6, rotate: i === 1 ? 0 : i === 0 ? -1 : 1 }}
              whileTap={{ scale: 0.97 }}
              className={`relative flex h-full w-full flex-col rounded-[2rem] border-2 border-ink p-6 text-left shadow-pop ${m.bg}`}
            >
              <div className="flex items-start justify-between">
                <span className="text-5xl">{m.emoji}</span>
                <span
                  className={`grid h-10 w-10 place-items-center rounded-xl border-2 border-ink transition ${
                    done[i] ? "bg-teal text-white" : "bg-white"
                  }`}
                >
                  {done[i] && <Check size={22} strokeWidth={3} />}
                </span>
              </div>
              <span className="mt-5 font-display text-sm font-bold text-ink/50">MISSION {m.n}</span>
              <h3 className={`text-2xl font-bold ${done[i] ? "line-through decoration-coral decoration-4" : ""}`}>{m.title}</h3>
              <p className="mt-2 text-ink-soft">{m.text}</p>
            </motion.button>
          </Reveal>
        ))}
      </div>
      <p className="mt-4 text-center text-sm font-semibold text-ink-soft">{missionsDone}/3 missions complete</p>

      {/* Who am I card */}
      <div className="mt-14 grid items-center gap-8 lg:grid-cols-2">
        <Reveal>
          <h3 className="text-4xl font-bold">Your “Who Am I?” card</h3>
          <p className="mt-3 text-lg text-ink-soft">
            Built automatically from everything you shared today. Save it — and see how much it changes by the end of the journey.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={downloadCard} variant="coral">
              <Download size={18} /> Save as image
            </Button>
            <Button
              variant="white"
              onClick={() => {
                if (window.confirm("Clear everything you've written in Session 1 on this device? This can't be undone.")) {
                  clearJourney();
                  window.location.reload();
                }
              }}
            >
              <Trash2 size={18} /> Clear my answers
            </Button>
          </div>
          <p className="mt-3 text-xs text-ink-soft">Using a shared computer? Clear your answers before you leave.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <motion.div
            initial={{ rotate: 3 }}
            whileHover={{ rotate: 0, scale: 1.02 }}
            className="overflow-hidden rounded-[2rem] border-4 border-ink bg-cream shadow-pop-lg"
          >
            <div className="bg-sky px-6 pt-6 pb-5">
              <p className="font-display text-5xl font-bold">Who am I?</p>
              <p className="mt-1 text-ink-soft">{powers.alias ? `aka ${powers.alias}` : "Uki Growth Journey · Session 01"}</p>
            </div>
            <dl className="space-y-4 p-6">
              {[
                ["In three words", words.join(" · "), "bg-coral"],
                ["I love", loves.join(", "), "bg-sun"],
                ["My superpowers", powerLabels.join(", "), "bg-sky-deep"],
                ["Proudest of", proud ? `👑 ${proud.label}` : "", "bg-grape"],
                ["Growing (not yet!)", growing, "bg-teal"],
              ].map(([k, v, c]) => (
                <div key={k}>
                  <dt className="flex items-center gap-2 text-xs font-bold tracking-widest text-ink-soft uppercase">
                    <span className={`h-3 w-3 rounded ${c}`} />
                    {k}
                  </dt>
                  <dd className={`mt-0.5 font-display text-xl font-semibold ${v ? "" : "text-ink/25"}`}>
                    {v || "— fill this in above —"}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="bg-ink px-6 py-4 font-display text-sun">You don&apos;t have to be perfect. Just keep growing. 🌱</div>
          </motion.div>
        </Reveal>
      </div>

      {/* Session 2 teaser */}
      <Reveal className="mt-16">
        <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-ink bg-teal p-8 text-white shadow-pop-lg sm:p-12">
          <div className="pointer-events-none absolute inset-0 bg-dots opacity-30" />
          <motion.div
            aria-hidden
            className="absolute -top-6 right-6 text-[9rem] opacity-30 sm:right-12"
            animate={{ y: [0, -14, 0], rotate: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
          >
            🚀
          </motion.div>
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-widest uppercase">
              <Lock size={12} /> Next week · Session 02
            </span>
            <p className="mt-4 font-display text-4xl leading-tight font-bold sm:text-5xl">
              What if your dreams could become <span className="text-sun">real goals?</span>
            </p>
            <p className="mt-4 text-lg text-white/85">Bring your missions. Your next adventure awaits.</p>
            <Link href="/#journey" className="mt-6 inline-block">
              <Button>See the journey map</Button>
            </Link>
          </div>
        </div>
      </Reveal>
    </Stop>
  );
}
