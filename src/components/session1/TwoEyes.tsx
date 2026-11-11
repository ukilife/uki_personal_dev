"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Brush, Dices, Download, Eraser, Save, Trash2, Undo2 } from "lucide-react";
import { useLocalState } from "@/lib/useLocalState";
import { Button, Reveal, Stop } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";
import { TimerWidget } from "@/components/TimerWidget";
import { useTimer } from "@/lib/useTimer";

const W = 800;
const H = 600;
const EYES = [
  { x: 340, y: 250 },
  { x: 460, y: 250 },
];
const EYE_R = 34;
const PUPIL_R = 14;

const COLORS = ["#23204e", "#f7845e", "#1f9d8a", "#2f7fc1", "#ffc93c", "#7b3fa0", "#d9345b", "#5aa832", "#8b5a2b"];
const SIZES = [4, 9, 18];
const SPARKS = [
  "a sleepy dragon",
  "an alien chef",
  "a nervous superhero",
  "a robot who loves poetry",
  "a cat running for president",
  "a monster afraid of the dark",
  "your future self",
  "a cloud with a secret",
  "a cactus who wants hugs",
  "a pizza with a dream",
];

type Saved = { name: string; img: string };

function drawEyes(ctx: CanvasRenderingContext2D, look = { x: 0, y: 0 }) {
  EYES.forEach((e) => {
    ctx.beginPath();
    ctx.arc(e.x, e.y, EYE_R, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#23204e";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(e.x + look.x, e.y + look.y, PUPIL_R, 0, Math.PI * 2);
    ctx.fillStyle = "#23204e";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(e.x + look.x + 5, e.y + look.y - 5, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
  });
}

export function TwoEyes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const history = useRef<ImageData[]>([]);
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(SIZES[1]);
  const [eraser, setEraser] = useState(false);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [name, setName] = useState("");
  const [spark, setSpark] = useState<string | null>(null);
  const [gallery, setGallery] = useLocalState<Saved[]>("s1-two-eyes-gallery", []);
  const [canUndo, setCanUndo] = useState(false);
  const [blink, setBlink] = useState(false);
  const timer = useTimer({ mode: "down", seconds: 180 });

  // blink every few seconds — the eyes are alive!
  useEffect(() => {
    const t = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 160);
    }, 3800);
    return () => clearInterval(t);
  }, []);

  const ctx = () => canvasRef.current?.getContext("2d") ?? null;

  const clear = useCallback(() => {
    const c = ctx();
    if (!c) return;
    c.fillStyle = "#ffffff";
    c.fillRect(0, 0, W, H);
    history.current = [];
    setCanUndo(false);
  }, []);

  // paint the white background once on mount (canvas only — no React state)
  useEffect(() => {
    const c = ctx();
    if (!c) return;
    c.fillStyle = "#ffffff";
    c.fillRect(0, 0, W, H);
  }, []);

  const toCanvas = (e: React.PointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
  };

  const track = (e: React.PointerEvent) => {
    const p = toCanvas(e);
    const cx = (EYES[0].x + EYES[1].x) / 2;
    const dx = p.x - cx;
    const dy = p.y - EYES[0].y;
    const d = Math.hypot(dx, dy) || 1;
    const m = Math.min(EYE_R - PUPIL_R - 4, d / 12);
    setLook({ x: (dx / d) * m, y: (dy / d) * m });
  };

  const down = (e: React.PointerEvent) => {
    const c = ctx();
    if (!c) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    history.current.push(c.getImageData(0, 0, W, H));
    if (history.current.length > 25) history.current.shift();
    setCanUndo(true);
    drawing.current = true;
    last.current = toCanvas(e);
    move(e);
  };

  const move = (e: React.PointerEvent) => {
    track(e);
    if (!drawing.current) return;
    const c = ctx();
    if (!c || !last.current) return;
    const p = toCanvas(e);
    c.lineCap = "round";
    c.lineJoin = "round";
    c.strokeStyle = eraser ? "#ffffff" : color;
    c.lineWidth = eraser ? size * 2.5 : size;
    c.beginPath();
    c.moveTo(last.current.x, last.current.y);
    c.lineTo(p.x + 0.01, p.y);
    c.stroke();
    last.current = p;
  };

  const up = () => {
    drawing.current = false;
    last.current = null;
  };

  const undo = () => {
    const c = ctx();
    const prev = history.current.pop();
    if (c && prev) c.putImageData(prev, 0, 0);
    setCanUndo(history.current.length > 0);
  };

  const composite = (scale = 1) => {
    const src = canvasRef.current!;
    const out = document.createElement("canvas");
    out.width = W * scale;
    out.height = H * scale;
    const o = out.getContext("2d")!;
    o.scale(scale, scale);
    o.drawImage(src, 0, 0);
    drawEyes(o);
    if (name.trim()) {
      o.font = "600 36px Fredoka, sans-serif";
      o.fillStyle = "#23204e";
      o.textAlign = "center";
      o.fillText(name.trim(), W / 2, H - 30);
    }
    return out;
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = composite().toDataURL("image/png");
    a.download = `${name.trim() || "my-character"}.png`;
    a.click();
  };

  const saveToGallery = () => {
    const img = composite(0.45).toDataURL("image/jpeg", 0.8);
    setGallery((g) => [{ name: name.trim() || "Mystery creature", img }, ...g].slice(0, 6));
    celebrate("small");
  };

  return (
    <Stop
      id="two-eyes"
      stop={4}
      kicker="Game 02 · Creativity"
      tone="lilac"
      kickerClass="bg-grape text-white"
      title={
        <>
          The <span className="text-grape">Two Eyes</span> Challenge
        </>
      }
      intro="Here are two eyes. They're watching you… 👀 Draw ANY character around them — a person, animal, monster, robot, anything. Give it a name, then present it to the group."
      aside={<TimerWidget timer={timer} label="drawing time" />}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <Reveal>
          <div
            ref={wrapRef}
            className="relative overflow-hidden rounded-[2rem] border-2 border-ink bg-white shadow-pop-lg"
          >
            <canvas
              ref={canvasRef}
              width={W}
              height={H}
              onPointerDown={down}
              onPointerMove={move}
              onPointerUp={up}
              onPointerCancel={up}
              onPointerLeave={() => setLook({ x: 0, y: 0 })}
              className="block aspect-[4/3] w-full touch-none"
              style={{ cursor: eraser ? "cell" : "crosshair" }}
              aria-label="Drawing canvas"
            />
            {/* live eyes overlay */}
            <svg viewBox={`0 0 ${W} ${H}`} className="pointer-events-none absolute inset-0 h-full w-full">
              {EYES.map((e, i) => (
                <g key={i}>
                  <circle cx={e.x} cy={e.y} r={EYE_R} fill="#fff" stroke="#23204e" strokeWidth={5} />
                  <motion.g animate={{ x: look.x, y: look.y }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                    <circle cx={e.x} cy={e.y} r={PUPIL_R} fill="#23204e" />
                    <circle cx={e.x + 5} cy={e.y - 5} r={4} fill="#fff" />
                  </motion.g>
                  <motion.rect
                    x={e.x - EYE_R - 3}
                    width={EYE_R * 2 + 6}
                    y={e.y - EYE_R - 3}
                    fill="#23204e"
                    animate={{ height: blink ? EYE_R * 2 + 6 : 0 }}
                    transition={{ duration: 0.08 }}
                    rx={EYE_R}
                  />
                </g>
              ))}
            </svg>
            {name.trim() && (
              <div className="pointer-events-none absolute inset-x-0 bottom-4 text-center font-display text-2xl font-semibold sm:text-4xl">
                {name}
              </div>
            )}
            <AnimatePresence>
              {spark && (
                <motion.div
                  key={spark}
                  initial={{ y: -40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  className="absolute top-3 left-1/2 -translate-x-1/2 rounded-full border-2 border-ink bg-sun px-4 py-1.5 text-sm font-semibold whitespace-nowrap"
                >
                  Stuck? Try: <b>{spark}</b>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="flex flex-col gap-4">
          <div className="rounded-3xl border-2 border-ink bg-white p-4">
            <p className="mb-2 text-xs font-bold tracking-widest text-ink-soft uppercase">Colours</p>
            <div className="grid grid-cols-5 gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  aria-label={`Colour ${c}`}
                  onClick={() => {
                    setColor(c);
                    setEraser(false);
                  }}
                  className={`aspect-square rounded-full border-2 transition ${
                    color === c && !eraser ? "scale-110 border-ink ring-4 ring-sun" : "border-ink/30"
                  }`}
                  style={{ background: c }}
                />
              ))}
            </div>
            <p className="mt-4 mb-2 text-xs font-bold tracking-widest text-ink-soft uppercase">Brush</p>
            <div className="flex items-center gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  aria-label={`Brush size ${s}`}
                  className={`grid h-10 w-10 place-items-center rounded-xl border-2 ${
                    size === s ? "border-ink bg-sun" : "border-ink/20"
                  }`}
                >
                  <span className="rounded-full bg-ink" style={{ width: s + 2, height: s + 2 }} />
                </button>
              ))}
              <button
                onClick={() => setEraser((x) => !x)}
                aria-label="Eraser"
                className={`grid h-10 w-10 place-items-center rounded-xl border-2 ${
                  eraser ? "border-ink bg-blush" : "border-ink/20"
                }`}
              >
                {eraser ? <Eraser size={18} /> : <Brush size={18} />}
              </button>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={undo}
                disabled={!canUndo}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl border-2 border-ink/20 py-2 text-sm font-semibold hover:border-ink disabled:opacity-40"
              >
                <Undo2 size={16} /> Undo
              </button>
              <button
                onClick={clear}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl border-2 border-ink/20 py-2 text-sm font-semibold hover:border-ink"
              >
                <Trash2 size={16} /> Clear
              </button>
            </div>
          </div>

          <button
            onClick={() => setSpark(SPARKS[Math.floor(Math.random() * SPARKS.length)])}
            className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-ink/40 bg-white/60 py-3 text-sm font-semibold hover:border-ink"
          >
            <Dices size={18} /> Idea spark
          </button>

          <div className="rounded-3xl border-2 border-ink bg-white p-4">
            <label className="text-xs font-bold tracking-widest text-ink-soft uppercase" htmlFor="char-name">
              Name your character
            </label>
            <input
              id="char-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={24}
              placeholder="e.g. Sir Blinks-a-Lot"
              className="mt-2 w-full rounded-xl border-2 border-ink bg-cream px-3 py-2 outline-none focus:bg-white focus:ring-4 focus:ring-sun/60"
            />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="grape" onClick={saveToGallery} className="px-3 py-2 text-sm">
                <Save size={16} /> Keep
              </Button>
              <Button variant="white" onClick={download} className="px-3 py-2 text-sm">
                <Download size={16} /> PNG
              </Button>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_1.2fr]">
        <Reveal className="rounded-3xl border-2 border-ink bg-ink p-6 text-cream">
          <p className="font-display text-sm font-semibold tracking-widest text-sun uppercase">🎤 Presentation time</p>
          <ul className="mt-3 space-y-2 text-lg">
            <li>• Who is your character?</li>
            <li>• What&apos;s their personality?</li>
            <li>• What do they love — and fear?</li>
          </ul>
          <p className="mt-4 border-t border-white/15 pt-4 text-cream/80">
            You created a character. <b className="text-sun">Now let&apos;s discover its creator.</b> → next stop
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mb-3 font-display text-lg font-bold">Character gallery {gallery.length > 0 && `(${gallery.length})`}</p>
          {gallery.length === 0 ? (
            <div className="grid h-36 place-items-center rounded-3xl border-2 border-dashed border-ink/25 text-sm text-ink-soft">
              Hit “Keep” to pin your characters here.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {gallery.map((g, i) => (
                <motion.figure
                  key={g.img.slice(-40) + i}
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: [-3, 2, -2][i % 3] }}
                  whileHover={{ rotate: 0, scale: 1.05 }}
                  className="rounded-2xl border-2 border-ink bg-white p-1.5 pb-2 shadow-pop"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.img} alt={g.name} className="aspect-[4/3] w-full rounded-xl object-cover" />
                  <figcaption className="mt-1 truncate text-center font-display text-xs font-semibold">{g.name}</figcaption>
                </motion.figure>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </Stop>
  );
}
