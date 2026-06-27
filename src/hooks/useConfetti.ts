"use client";

import confetti from "canvas-confetti";
import { useCallback, useEffect, useRef } from "react";

const COLORS = ["#26ccff", "#a25afd", "#ff5e7e", "#88ff5a", "#fcff42", "#ffa62d", "#ff36ff"];
const HIRAGANA = ["あ", "い", "う", "え", "お"];
const KATAKANA = ["ア", "イ", "ウ", "エ", "オ"];
const FONT = '"Hiragino Kaku Gothic ProN", "Yu Gothic", "Noto Sans JP", sans-serif';

type ConfettiShape = confetti.Shape;

function buildShapes(chars: string[]): ConfettiShape[] {
  return chars.flatMap((char) =>
    COLORS.map((color) =>
      confetti.shapeFromText({
        text: char,
        color,
        fontFamily: FONT,
        scalar: 1,
      })
    )
  );
}

let cachedShapes: {
  hiragana: ConfettiShape[];
  katakana: ConfettiShape[];
  all: ConfettiShape[];
} | null = null;

function getShapes() {
  if (!cachedShapes) {
    const hiragana = buildShapes(HIRAGANA);
    const katakana = buildShapes(KATAKANA);
    cachedShapes = { hiragana, katakana, all: [...hiragana, ...katakana] };
  }
  return cachedShapes;
}

export function useConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confettiRef = useRef<ReturnType<typeof confetti.create> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    confettiRef.current = confetti.create(canvas, {
      disableForReducedMotion: true,
      resize: true,
    });

    return () => {
      confettiRef.current?.reset();
      confettiRef.current = null;
    };
  }, []);

  const fireConfetti = useCallback((useKatakanaOnly = false) => {
    const instance = confettiRef.current;
    if (!instance) return;

    const { katakana, all } = getShapes();
    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    const shapes = useKatakanaOnly ? katakana : all;
    const particleCount = isMobile ? 12 : 30;
    const spread = 55;
    const startVelocity = isMobile ? 24 : 40;
    const originY = 0.8;

    const opts = {
      particleCount,
      shapes,
      scalar: 2.4,
      spread,
      startVelocity,
      ticks: 100,
    };

    instance({ ...opts, angle: 60, origin: { x: 0, y: originY } });
    instance({ ...opts, angle: 120, origin: { x: 1, y: originY } });
  }, []);

  return { canvasRef, fireConfetti };
}
