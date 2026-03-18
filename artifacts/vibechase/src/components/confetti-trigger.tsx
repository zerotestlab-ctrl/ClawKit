"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export function ConfettiTrigger() {
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ["#22c55e", "#16a34a", "#f59e0b", "#8b5cf6"];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  return null;
}

export function triggerConfetti() {
  const colors = ["#22c55e", "#16a34a", "#f59e0b", "#8b5cf6"];

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors,
  });
}
