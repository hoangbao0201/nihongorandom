"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Flashcard from "@/components/shared/Flashcard";
import { useConfetti } from "@/hooks/useConfetti";
import { useJapaneseSpeech } from "@/hooks/useJapaneseSpeech";
import {
  formatStudyShortcutHints,
  useStudyShortcuts,
} from "@/hooks/useStudyShortcuts";
import type { FlashcardItem } from "@/utils/flashcardDeck";

interface FlashcardDeckProps {
  items: FlashcardItem[];
  canMark: boolean;
  isKnown?: (id: string) => boolean;
  onMarkKnown?: (id: string) => void;
  onMarkReview?: (id: string) => void;
  emptyHint?: string;
}

function shuffleIndices(length: number): number[] {
  const indices = Array.from({ length }, (_, index) => index);
  for (let index = indices.length - 1; index > 0; index--) {
    const swap = Math.floor(Math.random() * (index + 1));
    [indices[index], indices[swap]] = [indices[swap], indices[index]];
  }
  return indices;
}

export default function FlashcardDeck({
  items,
  canMark,
  isKnown,
  onMarkKnown,
  onMarkReview,
  emptyHint = "Chưa có thẻ nào. Hãy chọn nội dung để bắt đầu.",
}: FlashcardDeckProps) {
  const [filterUnknown, setFilterUnknown] = useState(false);
  const [order, setOrder] = useState<number[]>([]);
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const celebratedRef = useRef(false);

  const { canvasRef, fireConfetti } = useConfetti();
  const { speak, cancel, isReady, isSpeaking } = useJapaneseSpeech();

  const deck = useMemo(() => {
    if (canMark && filterUnknown && isKnown) {
      return items.filter((item) => !isKnown(item.id));
    }
    return items;
  }, [items, canMark, filterUnknown, isKnown]);

  const rebuild = useCallback(() => {
    setOrder(shuffleIndices(deck.length));
    setPos(0);
    setFlipped(false);
    celebratedRef.current = false;
  }, [deck]);

  useEffect(() => {
    rebuild();
  }, [rebuild]);

  const current = order.length > 0 ? deck[order[pos]] : undefined;

  const speakCurrent = useCallback(() => {
    if (!current?.speakText || !isReady) {
      return;
    }
    speak(current.speakText);
  }, [current, isReady, speak]);

  useEffect(() => {
    if (!current) {
      return;
    }
    const shownLang = flipped ? current.backLang : current.frontLang;
    if (shownLang !== "ja" || !current.speakText || !isReady) {
      return;
    }
    const timer = window.setTimeout(speakCurrent, 200);
    return () => window.clearTimeout(timer);
  }, [current, flipped, isReady, speakCurrent]);

  const handleFlip = useCallback(() => {
    setFlipped((value) => !value);
  }, []);

  const goNext = useCallback(() => {
    cancel();
    setFlipped(false);
    setPos((value) => (value >= order.length - 1 ? value : value + 1));
  }, [cancel, order.length]);

  const goPrev = useCallback(() => {
    cancel();
    setFlipped(false);
    setPos((value) => (value <= 0 ? value : value - 1));
  }, [cancel]);

  useEffect(() => {
    if (!celebratedRef.current && order.length > 0 && pos === order.length - 1) {
      celebratedRef.current = true;
      fireConfetti();
    }
  }, [pos, order, fireConfetti]);

  const shortcutOptions = {
    flip: Boolean(current),
    prev: pos > 0,
    next: order.length > 0 && pos < order.length - 1,
  };

  useStudyShortcuts(
    { onFlip: handleFlip, onPrev: goPrev, onNext: goNext },
    shortcutOptions
  );

  const handleMarkKnown = () => {
    if (current && onMarkKnown) {
      onMarkKnown(current.id);
    }
    goNext();
  };

  const handleMarkReview = () => {
    if (current && onMarkReview) {
      onMarkReview(current.id);
    }
    goNext();
  };

  const knownInDeck =
    canMark && isKnown ? items.filter((item) => isKnown(item.id)).length : 0;

  if (deck.length === 0) {
    return (
      <section className="glass-panel flex min-h-[420px] flex-col items-center justify-center gap-4 rounded-lg p-5 text-center sm:min-h-[480px]">
        <p className="max-w-xs text-sm text-[var(--muted)]">
          {filterUnknown ? "Bạn đã thuộc hết thẻ trong bộ này! 🎉" : emptyHint}
        </p>
        {filterUnknown ? (
          <button
            type="button"
            onClick={() => setFilterUnknown(false)}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/20 hover:bg-white/10"
          >
            Hiện lại tất cả
          </button>
        ) : null}
      </section>
    );
  }

  return (
    <section className="glass-panel flex min-h-[420px] flex-col rounded-lg p-5 sm:min-h-[480px]">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      />

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-white/40">
        <span>
          Thẻ {pos + 1} / {order.length}
        </span>
        {canMark ? (
          <span>
            Đã thuộc {knownInDeck} / {items.length}
          </span>
        ) : null}
      </div>

      {order.length > 0 ? (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all duration-200"
            style={{ width: `${((pos + 1) / order.length) * 100}%` }}
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col items-center justify-center py-5">
        {current ? (
          <Flashcard
            item={current}
            flipped={flipped}
            onFlip={handleFlip}
            onSpeak={speakCurrent}
            isSpeaking={isSpeaking}
            canSpeak={Boolean(current.speakText)}
          />
        ) : null}
      </div>

      {canMark ? (
        <div className="mb-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleMarkReview}
            className="rounded-lg border border-amber-400/40 bg-amber-400/10 px-4 py-2.5 text-sm font-semibold text-amber-200 transition-colors hover:bg-amber-400/20"
          >
            Ôn lại
          </button>
          <button
            type="button"
            onClick={handleMarkKnown}
            className="rounded-lg border border-[var(--success)]/50 bg-[var(--success)]/15 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--success)]/25"
          >
            Đã thuộc
          </button>
        </div>
      ) : null}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={goPrev}
          disabled={pos === 0}
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-[var(--muted)] transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white disabled:opacity-40"
        >
          ← Trước
        </button>
        <button
          type="button"
          onClick={handleFlip}
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/20 hover:bg-white/10"
        >
          Lật thẻ
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={pos >= order.length - 1}
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-[var(--muted)] transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white disabled:opacity-40"
        >
          Sau →
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={rebuild}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white"
        >
          Trộn thẻ
        </button>
        {canMark ? (
          <label className="flex cursor-pointer items-center gap-2 text-xs text-white/70">
            <input
              type="checkbox"
              checked={filterUnknown}
              onChange={(event) => setFilterUnknown(event.target.checked)}
              className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-[var(--accent)]"
            />
            Chỉ ôn thẻ chưa thuộc
          </label>
        ) : null}
      </div>

      <p className="mt-3 text-center text-[11px] text-white/25">
        {formatStudyShortcutHints(shortcutOptions)}
      </p>
    </section>
  );
}
