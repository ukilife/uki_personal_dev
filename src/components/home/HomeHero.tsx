"use client";

import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { ArrowDown, ArrowRight, Flame, Lightbulb, Search, Sparkles, Sprout, Star, type LucideIcon } from "lucide-react";
import { ButtonLink, Pill } from "@/components/ui";
import { SESSIONS } from "@/lib/sessions";

const INK = "#23204e";

const BUBBLES: { icon: LucideIcon; label: string; color: string; x: string; y: string; d: number; depth: number }[] = [
  { icon: Lightbulb, label: "ideas", color: "#e0a800", x: "4%", y: "14%", d: 4.5, depth: 26 },
  { icon: Flame, label: "confidence", color: "#f7845e", x: "70%", y: "2%", d: 5.2, depth: 18 },
  { icon: Star, label: "dreams", color: "#7b3fa0", x: "80%", y: "44%", d: 4.8, depth: 30 },
  { icon: Sprout, label: "growth", color: "#1f9d8a", x: "2%", y: "88%", d: 5.6, depth: 22 },
  { icon: Search, label: "discovery", color: "#2f7fc1", x: "62%", y: "80%", d: 5, depth: 14 },
];

const SPARKS = [
  [70, 70, 6, 0],
  [330, 60, 5, 0.6],
  [356, 210, 7, 1.1],
  [52, 230, 5, 1.6],
  [250, 30, 4, 0.3],
  [300, 330, 5, 2],
];

function Bubble({ b, mx, my }: { b: (typeof BUBBLES)[number]; mx: MotionValue<number>; my: MotionValue<number> }) {
  const x = useTransform(mx, (v) => v * -b.depth);
  const y = useTransform(my, (v) => v * -b.depth);
  const Icon = b.icon;
  return (
    <motion.div className="absolute" style={{ left: b.x, top: b.y, x, y }}>
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0, y: [0, -10, 0] }}
        transition={{
          scale: { type: "spring", delay: 0.4 + b.d / 20 },
          rotate: { delay: 0.4 },
          y: { type: "tween", repeat: Infinity, duration: b.d, ease: "easeInOut" },
        }}
        whileHover={{ scale: 1.12, rotate: -6 }}
        className="flex items-center gap-1.5 rounded-2xl border-2 border-ink bg-white px-2.5 py-1.5 shadow-pop sm:px-3 sm:py-2"
      >
        <Icon size={18} color={b.color} strokeWidth={2.5} />
        <span className="font-display text-xs font-semibold sm:text-sm">{b.label}</span>
      </motion.div>
    </motion.div>
  );
}

/** A student standing on a winding, magical path that leads to a glowing doorway. */
function PathScene({ px, py }: { px: MotionValue<number>; py: MotionValue<number> }) {
  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="hero-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff8ec" />
          <stop offset="55%" stopColor="#ffc93c" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffc93c" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* sky backdrop */}
      <circle cx="200" cy="200" r="182" fill="#dceefb" stroke={INK} strokeWidth="4" />
      <path d="M40 270 Q 110 220 200 250 T 362 236 L 362 300 Q 200 420 40 300 Z" fill="#e2f1d9" />
      <path d="M70 300 Q 160 262 240 288 T 344 280" stroke="#b9df9f" strokeWidth="10" fill="none" strokeLinecap="round" />

      {/* glowing doorway at the end of the path */}
      <motion.circle
        cx="292"
        cy="104"
        r="62"
        fill="url(#hero-glow)"
        animate={{ r: [56, 66, 56], opacity: [0.75, 1, 0.75] }}
        transition={{ type: "tween", duration: 3.2, repeat: Infinity }}
      />
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={{ rotate: 360 }}
        transition={{ type: "tween", ease: "linear", duration: 30, repeat: Infinity }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1="292"
            y1="40"
            x2="292"
            y2="54"
            stroke="#ffc93c"
            strokeWidth="4"
            strokeLinecap="round"
            transform={`rotate(${i * 30} 292 104)`}
          />
        ))}
      </motion.g>
      <path d="M268 132 V 96 a24 24 0 0 1 48 0 V 132 Z" fill="#7b3fa0" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M276 132 V 98 a16 16 0 0 1 32 0 V 132 Z" fill="#fff8ec" />
      <motion.text
        x="292"
        y="122"
        textAnchor="middle"
        fontSize="22"
        fontWeight="700"
        fill="#7b3fa0"
        fontFamily="Fredoka, sans-serif"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ type: "tween", duration: 2, repeat: Infinity }}
      >
        ?
      </motion.text>

      {/* the winding path */}
      <path d="M130 400 C 120 330, 250 320, 220 250 S 270 170, 292 134" stroke={INK} strokeWidth="44" fill="none" strokeLinecap="round" />
      <path d="M130 400 C 120 330, 250 320, 220 250 S 270 170, 292 134" stroke="#fff8ec" strokeWidth="36" fill="none" strokeLinecap="round" />
      <motion.path
        d="M130 400 C 120 330, 250 320, 220 250 S 270 170, 292 134"
        stroke="#ffc93c"
        strokeWidth="4"
        strokeDasharray="10 12"
        fill="none"
        strokeLinecap="round"
        animate={{ strokeDashoffset: [0, -44] }}
        transition={{ type: "tween", ease: "linear", duration: 1.6, repeat: Infinity }}
      />
      {/* four session milestones along the path */}
      {[
        [154, 336],
        [214, 290],
        [232, 214],
        [270, 168],
      ].map(([x, y], i) => (
        <motion.g
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8 + i * 0.2, type: "spring" }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <circle cx={x} cy={y} r="10" fill={SESSIONS[i].color} stroke={INK} strokeWidth="3" />
          <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" fontFamily="Fredoka, sans-serif">
            {i + 1}
          </text>
        </motion.g>
      ))}

      {/* sparkles */}
      {SPARKS.map(([x, y, r, delay], i) => (
        <motion.path
          key={i}
          d={`M${x} ${y - r} L${x + r * 0.3} ${y - r * 0.3} L${x + r} ${y} L${x + r * 0.3} ${y + r * 0.3} L${x} ${y + r} L${x - r * 0.3} ${y + r * 0.3} L${x - r} ${y} L${x - r * 0.3} ${y - r * 0.3} Z`}
          fill={i % 2 ? "#f7845e" : "#ffc93c"}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          animate={{ scale: [0.5, 1.2, 0.5], rotate: [0, 45, 0] }}
          transition={{ type: "tween", duration: 2.6, repeat: Infinity, delay }}
        />
      ))}

      {/* the student, standing at the start of the trail */}
      <g transform="translate(-48 0)">
      <motion.g animate={{ y: [0, -5, 0] }} transition={{ type: "tween", duration: 2.4, repeat: Infinity, ease: "easeInOut" }}>
        <ellipse cx="146" cy="352" rx="30" ry="7" fill={INK} opacity="0.15" />
        {/* legs */}
        <path d="M136 316 L132 348 M156 316 L162 346" stroke={INK} strokeWidth="9" strokeLinecap="round" />
        <path d="M126 350 h12 M158 348 h12" stroke="#f7845e" strokeWidth="8" strokeLinecap="round" />
        {/* backpack */}
        <rect x="112" y="262" width="22" height="40" rx="9" fill="#ffc93c" stroke={INK} strokeWidth="3.5" />
        {/* hoodie */}
        <path d="M124 320 C 120 286, 128 262, 146 260 C 166 262, 174 286, 170 320 Z" fill="#1f9d8a" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M140 296 h14" stroke="#d5f2ec" strokeWidth="3" strokeLinecap="round" />
        {/* pointing arm — toward the doorway */}
        <motion.path
          d="M164 276 C 180 266, 190 252, 198 240"
          stroke="#1f9d8a"
          strokeWidth="11"
          strokeLinecap="round"
          fill="none"
          animate={{ rotate: [0, -6, 0] }}
          style={{ transformBox: "fill-box", transformOrigin: "left bottom" }}
          transition={{ type: "tween", duration: 2.4, repeat: Infinity }}
        />
        <circle cx="200" cy="237" r="7" fill="#ffd9b8" stroke={INK} strokeWidth="3" />
        {/* head */}
        <circle cx="147" cy="236" r="26" fill="#ffd9b8" stroke={INK} strokeWidth="3.5" />
        <path d="M121 232 C 120 208, 172 204, 173 230 C 162 220, 136 218, 121 232 Z" fill={INK} />
        {/* curious eyes follow the pointer */}
        {[137, 158].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="240" r="7" fill="#fff" stroke={INK} strokeWidth="2.5" />
            <motion.circle cx={cx} cy="240" r="3.5" fill={INK} style={{ x: px, y: py }} />
          </g>
        ))}
        <path d="M140 252 q7 6 14 0" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      </motion.g>
      </g>
    </svg>
  );
}

export function HomeHero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 15 });
  const sy = useSpring(my, { stiffness: 60, damping: 15 });
  const px = useTransform(sx, (v) => v * 6);
  const py = useTransform(sy, (v) => v * 5);

  return (
    <section
      className="relative overflow-hidden bg-sky"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      {/* soft floating shapes */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute -top-10 -left-10 h-56 w-56 animate-float-slow rounded-full bg-sun/30 blur-2xl" />
        <span className="absolute right-[-60px] bottom-10 h-72 w-72 animate-float rounded-full bg-lilac blur-2xl" />
        <span className="absolute bottom-[-40px] left-1/3 h-40 w-40 animate-float-slow rounded-full bg-teal/20 blur-2xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pt-14 pb-24 sm:px-8 md:grid-cols-[1.1fr_1fr] md:pt-20">
        <div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Pill className="bg-white text-ink">
              <Sparkles size={14} /> Unfold – Personal Development
            </Pill>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 80 }}
            className="mt-6 text-5xl leading-[0.98] font-bold sm:text-7xl"
          >
            Every Week, <span className="squiggle">Unfold</span> a New <span className="text-coral">You.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 max-w-xl text-xl leading-relaxed text-ink-soft"
          >
            Who are you? What makes you unique? What are you capable of becoming?{" "}
            <b className="text-ink">Your adventure of self-discovery begins here.</b>
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <ButtonLink href="/sessions/who-am-i">
              Start My Journey <ArrowRight size={18} />
            </ButtonLink>
            <ButtonLink href="#journey" variant="white">
              Explore the Journey <ArrowDown size={18} />
            </ButtonLink>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-sm font-semibold text-ink-soft"
          >
            🧭 4 destinations · 🎮 games & challenges · 📔 your private Growth Journal
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 90 }}
          className="relative mx-auto aspect-square w-full max-w-md"
        >
          <PathScene px={px} py={py} />
          {BUBBLES.map((b) => (
            <Bubble key={b.label} b={b} mx={sx} my={sy} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
