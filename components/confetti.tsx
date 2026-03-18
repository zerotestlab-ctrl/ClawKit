"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

const COLORS = ["#22c55e", "#16a34a", "#f59e0b", "#8b5cf6"];

export function ConfettiTrigger() {
  useEffect(() => {
    const end = Date.now() + 2500;
    (function frame() {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: COLORS });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: COLORS });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);
  return null;
}

export function fireConfetti() {
  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: COLORS });
}
