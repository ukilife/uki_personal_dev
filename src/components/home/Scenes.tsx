"use client";

import { motion } from "motion/react";
import type { SceneId } from "@/lib/sessions";

/* Small illustrated worlds for each journey destination (200 × 200). */

const INK = "#23204e";
const box = { transformBox: "fill-box", transformOrigin: "center" } as const;

function Bob({ children, d = 3, delay = 0, y = 6 }: { children: React.ReactNode; d?: number; delay?: number; y?: number }) {
  return (
    <motion.g animate={{ y: [0, -y, 0] }} transition={{ type: "tween", duration: d, repeat: Infinity, delay, ease: "easeInOut" }}>
      {children}
    </motion.g>
  );
}

function Twinkle({ x, y, r = 5, fill = "#ffc93c", delay = 0 }: { x: number; y: number; r?: number; fill?: string; delay?: number }) {
  return (
    <motion.path
      d={`M${x} ${y - r} L${x + r * 0.3} ${y - r * 0.3} L${x + r} ${y} L${x + r * 0.3} ${y + r * 0.3} L${x} ${y + r} L${x - r * 0.3} ${y + r * 0.3} L${x - r} ${y} L${x - r * 0.3} ${y - r * 0.3} Z`}
      fill={fill}
      style={box}
      animate={{ scale: [0.6, 1.15, 0.6], opacity: [0.5, 1, 0.5] }}
      transition={{ type: "tween", duration: 2.4, repeat: Infinity, delay }}
    />
  );
}

function Island() {
  return (
    <>
      <rect width="200" height="200" fill="#dceefb" />
      <circle cx="152" cy="44" r="15" fill="#ffc93c" stroke={INK} strokeWidth="3" />
      <rect y="128" width="200" height="72" fill="#8fd0e8" />
      <motion.path
        d="M10 150 q10 -6 20 0 t20 0 M120 165 q10 -6 20 0 t20 0 M60 182 q10 -6 20 0 t20 0"
        stroke="#fff"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        animate={{ x: [0, 8, 0] }}
        transition={{ type: "tween", duration: 4, repeat: Infinity }}
      />
      <ellipse cx="100" cy="134" rx="66" ry="20" fill="#fef0c0" stroke={INK} strokeWidth="3" />
      {/* palm */}
      <path d="M62 134 C 60 112, 66 96, 74 84" stroke="#8b5a2b" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M74 84 C 60 72, 44 76, 38 86 M74 84 C 70 66, 82 58, 94 60 M74 84 C 90 76, 104 84, 106 94 M74 84 C 62 86, 54 98, 56 108" stroke="#1f9d8a" strokeWidth="7" fill="none" strokeLinecap="round" />
      {/* mirror */}
      <rect x="128" y="112" width="6" height="18" rx="3" fill={INK} />
      <ellipse cx="131" cy="100" rx="14" ry="18" fill="#fff" stroke={INK} strokeWidth="3" />
      <path d="M125 92 l6 -5 M124 100 l11 -10" stroke="#8fd0e8" strokeWidth="3" strokeLinecap="round" />
      {/* magnifier */}
      <g transform="rotate(-20 100 120)">
        <circle cx="100" cy="116" r="9" fill="#dceefb" stroke={INK} strokeWidth="3" />
        <rect x="98" y="125" width="4" height="10" rx="2" fill={INK} />
      </g>
      {[
        [40, 56, "#f7845e", 0],
        [168, 92, "#7b3fa0", 0.6],
        [112, 38, "#1f9d8a", 1.2],
      ].map(([x, y, c, dl]) => (
        <Bob key={String(x)} delay={dl as number} y={7}>
          <text x={x as number} y={y as number} fontSize="24" fontWeight="700" fill={c as string} fontFamily="Fredoka, sans-serif" textAnchor="middle">
            ?
          </text>
        </Bob>
      ))}
    </>
  );
}

function Mountain() {
  return (
    <>
      <rect width="200" height="200" fill="#ece2fb" />
      <Twinkle x={30} y={36} />
      <Twinkle x={170} y={30} r={6} delay={0.8} />
      <Twinkle x={142} y={66} r={4} delay={1.4} fill="#fff" />
      <Twinkle x={52} y={78} r={4} delay={0.4} fill="#fff" />
      <path d="M-10 170 L58 92 L120 170 Z" fill="#b79ad6" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M40 172 L112 52 L190 172 Z" fill="#7b3fa0" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M96 78 L112 52 L128 78 L120 72 L112 80 L104 72 Z" fill="#fff" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      {/* zigzag trail to the summit */}
      <path d="M96 172 L130 150 L98 128 L124 106 L112 84" stroke="#ffc93c" strokeWidth="3" strokeDasharray="5 6" fill="none" strokeLinecap="round" />
      {/* flag */}
      <line x1="112" y1="52" x2="112" y2="26" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <motion.path
        d="M112 26 L134 32 L112 40 Z"
        fill="#f7845e"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="round"
        style={{ transformBox: "fill-box", transformOrigin: "left center" }}
        animate={{ scaleX: [1, 0.8, 1] }}
        transition={{ type: "tween", duration: 1.6, repeat: Infinity }}
      />
      {/* cloud */}
      <motion.g animate={{ x: [0, 12, 0] }} transition={{ type: "tween", duration: 6, repeat: Infinity }}>
        <path d="M18 120 a10 10 0 0 1 14 -10 a13 13 0 0 1 24 4 a9 9 0 0 1 2 18 h-36 a8 8 0 0 1 -4 -12 Z" fill="#fff" stroke={INK} strokeWidth="2.5" />
      </motion.g>
      {/* telescope */}
      <g transform="rotate(-28 160 160)">
        <rect x="140" y="152" width="40" height="11" rx="4" fill="#ffc93c" stroke={INK} strokeWidth="2.5" />
        <rect x="176" y="150" width="8" height="15" rx="2" fill="#2f7fc1" stroke={INK} strokeWidth="2.5" />
      </g>
      <path d="M156 168 L148 190 M160 168 L168 190" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <rect y="186" width="200" height="14" fill="#d5c4ef" />
    </>
  );
}

function Forest() {
  const tree = (x: number, s: number, c: string, delay: number) => (
    <g>
      <rect x={x - 3 * s} y={170 - 34 * s} width={6 * s} height={34 * s} rx={2} fill="#8b5a2b" stroke={INK} strokeWidth="2.5" />
      <motion.circle
        cx={x}
        cy={170 - 44 * s}
        r={20 * s}
        fill={c}
        stroke={INK}
        strokeWidth="3"
        style={box}
        animate={{ scale: [1, 1.07, 1] }}
        transition={{ type: "tween", duration: 3, repeat: Infinity, delay }}
      />
    </g>
  );
  return (
    <>
      <rect width="200" height="200" fill="#e2f1d9" />
      <circle cx="40" cy="40" r="13" fill="#ffc93c" stroke={INK} strokeWidth="3" />
      <ellipse cx="100" cy="182" rx="120" ry="26" fill="#b9df9f" stroke={INK} strokeWidth="3" />
      {tree(46, 0.7, "#8fd16a", 0)}
      {tree(98, 1, "#5aa832", 0.4)}
      {tree(154, 1.35, "#1f9d8a", 0.8)}
      {/* stepping stones with ticks */}
      {[
        [28, 186, true],
        [62, 180, true],
        [98, 184, true],
        [134, 180, false],
        [170, 186, false],
      ].map(([x, y, done]) => (
        <g key={String(x)}>
          <ellipse cx={x as number} cy={y as number} rx="12" ry="5" fill={done ? "#fff8ec" : "#d9d2c3"} stroke={INK} strokeWidth="2" />
          {done && <path d={`M${(x as number) - 4} ${y} l3 3 l5 -6`} stroke="#1f9d8a" strokeWidth="2.5" fill="none" strokeLinecap="round" />}
        </g>
      ))}
      {/* 21-day sign */}
      <rect x="120" y="128" width="4" height="30" fill="#8b5a2b" />
      <rect x="106" y="116" width="32" height="18" rx="4" fill="#fff" stroke={INK} strokeWidth="2.5" />
      <text x="122" y="129" fontSize="11" fontWeight="700" fill={INK} textAnchor="middle" fontFamily="Fredoka, sans-serif">
        21
      </text>
      {[
        [70, 60, 0],
        [130, 40, 1],
        [180, 90, 2],
      ].map(([x, y, dl]) => (
        <motion.path
          key={x}
          d={`M${x} ${y} q6 -8 12 0 q-6 8 -12 0 Z`}
          fill="#8fd16a"
          stroke={INK}
          strokeWidth="1.5"
          animate={{ y: [0, 18, 0], rotate: [0, 25, 0] }}
          style={box}
          transition={{ type: "tween", duration: 4, repeat: Infinity, delay: dl }}
        />
      ))}
    </>
  );
}

function City() {
  const windows = (x: number, y: number, cols: number, rows: number) =>
    Array.from({ length: cols * rows }, (_, i) => (
      <rect key={i} x={x + (i % cols) * 10} y={y + Math.floor(i / cols) * 12} width="5" height="7" rx="1" fill="#fff8ec" />
    ));
  return (
    <>
      <rect width="200" height="200" fill="#fdd8d0" />
      <rect x="14" y="78" width="40" height="100" fill="#2f7fc1" stroke={INK} strokeWidth="3" />
      {windows(21, 88, 3, 6)}
      <rect x="54" y="104" width="36" height="74" fill="#ffc93c" stroke={INK} strokeWidth="3" />
      {windows(61, 114, 3, 4)}
      <rect x="112" y="64" width="38" height="114" fill="#7b3fa0" stroke={INK} strokeWidth="3" />
      {windows(119, 74, 3, 7)}
      <rect x="150" y="96" width="38" height="82" fill="#1f9d8a" stroke={INK} strokeWidth="3" />
      {windows(157, 106, 3, 5)}
      <path d="M150 96 L169 80 L188 96 Z" fill="#f7845e" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <rect y="176" width="200" height="24" fill="#4a4775" />
      <path d="M8 188 h18 M40 188 h18 M72 188 h18 M104 188 h18 M136 188 h18 M168 188 h18" stroke="#ffc93c" strokeWidth="3" />
      {/* two people meeting */}
      <g>
        <circle cx="86" cy="150" r="7" fill="#ffd9b8" stroke={INK} strokeWidth="2.5" />
        <rect x="79" y="158" width="14" height="18" rx="6" fill="#f7845e" stroke={INK} strokeWidth="2.5" />
        <circle cx="112" cy="150" r="7" fill="#c98b62" stroke={INK} strokeWidth="2.5" />
        <rect x="105" y="158" width="14" height="18" rx="6" fill="#dceefb" stroke={INK} strokeWidth="2.5" />
      </g>
      {/* speech bubbles */}
      <motion.g style={box} animate={{ scale: [0.85, 1, 0.85] }} transition={{ type: "tween", duration: 2.2, repeat: Infinity }}>
        <rect x="52" y="112" width="34" height="20" rx="8" fill="#fff" stroke={INK} strokeWidth="2.5" />
        <path d="M74 132 l4 7 l2 -7" fill="#fff" stroke={INK} strokeWidth="2" />
        <text x="69" y="126" fontSize="10" fontWeight="700" textAnchor="middle" fill={INK} fontFamily="Fredoka, sans-serif">
          Hi!
        </text>
      </motion.g>
      <motion.g style={box} animate={{ scale: [1, 0.85, 1] }} transition={{ type: "tween", duration: 2.2, repeat: Infinity }}>
        <rect x="112" y="108" width="38" height="20" rx="8" fill="#fff" stroke={INK} strokeWidth="2.5" />
        <path d="M118 128 l-2 7 l6 -7" fill="#fff" stroke={INK} strokeWidth="2" />
        <circle cx="123" cy="118" r="2.2" fill={INK} />
        <circle cx="131" cy="118" r="2.2" fill={INK} />
        <circle cx="139" cy="118" r="2.2" fill={INK} />
      </motion.g>
      <Twinkle x={40} y={40} r={6} fill="#fff" />
      <Twinkle x={96} y={48} r={5} delay={0.7} />
      <Twinkle x={176} y={50} r={4} delay={1.3} fill="#fff" />
    </>
  );
}

const SCENES: Record<SceneId, () => React.ReactElement> = { island: Island, mountain: Mountain, forest: Forest, city: City };

export function Scene({ id, className = "" }: { id: SceneId; className?: string }) {
  const S = SCENES[id];
  return (
    <svg viewBox="0 0 200 200" className={`block h-full w-full ${className}`} aria-hidden>
      <S />
    </svg>
  );
}
