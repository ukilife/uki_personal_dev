"use client";

import confetti from "canvas-confetti";

const COLORS = ["#ffc93c", "#f7845e", "#1f9d8a", "#2f7fc1", "#7b3fa0", "#fdd8d0"];

export function celebrate(intensity: "small" | "big" = "small") {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (intensity === "small") {
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 }, colors: COLORS, scalar: 0.9 });
    return;
  }
  const end = Date.now() + 1200;
  (function frame() {
    confetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0 }, colors: COLORS });
    confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1 }, colors: COLORS });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
