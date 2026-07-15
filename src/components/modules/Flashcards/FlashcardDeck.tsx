"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { EffectCards } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Flashcard from "@/components/shared/Flashcard";
import { useConfetti } from "@/hooks/useConfetti";
import { useJapaneseSpeech } from "@/hooks/useJapaneseSpeech";
import {
  formatStudyShortcutHints,
  useStudyShortcuts,
} from "@/hooks/useStudyShortcuts";
import type { FlashcardItem } from "@/utils/flashcardDeck";

import "swiper/css";
import "swiper/css/effect-cards";

interface FlashcardDeckProps {
  items: FlashcardItem[];
  emptyHint?: string;
}

function shuffleItems(items: FlashcardItem[]): FlashcardItem[] {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index--) {
    const swap = Math.floor(Math.random() * (index + 1));
    [next[index], next[swap]] = [next[swap], next[index]];
  }
  return next;
}

export default function FlashcardDeck({
  items,
  emptyHint = "Chưa có thẻ nào. Hãy chọn nội dung để bắt đầu.",
}: FlashcardDeckProps) {
  const [deck, setDeck] = useState<FlashcardItem[]>([]);
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [deckKey, setDeckKey] = useState(0);
  const celebratedRef = useRef(false);
  const swiperRef = useRef<SwiperType | null>(null);

  const { canvasRef, fireConfetti } = useConfetti();
  const { speak, cancel, isReady, isSpeaking } = useJapaneseSpeech();

  const idsKey = useMemo(() => items.map((item) => item.id).join("|"), [items]);
  const prevIdsKeyRef = useRef<string | null>(null);

  const rebuild = useCallback(() => {
    setDeck(shuffleItems(items));
    setPos(0);
    setFlipped(false);
    setDeckKey((value) => value + 1);
    celebratedRef.current = false;
    cancel();
  }, [items, cancel]);

  useEffect(() => {
    if (prevIdsKeyRef.current === idsKey) {
      return;
    }
    prevIdsKeyRef.current = idsKey;
    rebuild();
  }, [idsKey, rebuild]);

  const current = deck[pos];

  const speakCurrent = useCallback(() => {
    if (!current?.speakText || !isReady) {
      return;
    }
    speak(current.speakText);
  }, [current, isReady, speak]);

  const handleFlip = useCallback(() => {
    setFlipped((value) => !value);
  }, []);

  const goNext = useCallback(() => {
    const swiper = swiperRef.current;
    if (!swiper || swiper.isEnd) {
      return;
    }
    cancel();
    setFlipped(false);
    swiper.slideNext();
  }, [cancel]);

  const goPrev = useCallback(() => {
    const swiper = swiperRef.current;
    if (!swiper || swiper.isBeginning) {
      return;
    }
    cancel();
    setFlipped(false);
    swiper.slidePrev();
  }, [cancel]);

  useEffect(() => {
    if (!celebratedRef.current && deck.length > 0 && pos === deck.length - 1) {
      celebratedRef.current = true;
      fireConfetti();
    }
  }, [pos, deck.length, fireConfetti]);

  const shortcutOptions = {
    flip: Boolean(current),
    prev: pos > 0,
    next: deck.length > 0 && pos < deck.length - 1,
  };

  useStudyShortcuts(
    { onFlip: handleFlip, onPrev: goPrev, onNext: goNext },
    shortcutOptions
  );

  if (deck.length === 0) {
    return (
      <section className="glass-panel flex min-h-[420px] flex-col items-center justify-center gap-4 rounded-lg p-5 text-center sm:min-h-[480px]">
        <p className="max-w-xs text-sm text-[var(--muted)]">{emptyHint}</p>
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

      <div className="mb-3 flex items-center justify-between gap-2 text-xs text-white/40">
        <span>
          Thẻ {pos + 1} / {deck.length}
        </span>
        <span className="text-white/25">Vuốt để chuyển thẻ</span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-all duration-200"
          style={{ width: `${((pos + 1) / deck.length) * 100}%` }}
        />
      </div>

      <div className="flashcard-swiper-wrap flex flex-1 flex-col items-center justify-center py-6">
        <Swiper
          key={deckKey}
          modules={[EffectCards]}
          effect="cards"
          grabCursor
          preventClicks={false}
          preventClicksPropagation={false}
          className="flashcard-swiper"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            cancel();
            setFlipped(false);
            setPos(swiper.activeIndex);
          }}
          cardsEffect={{
            perSlideOffset: 10,
            perSlideRotate: 3,
            rotate: true,
            slideShadows: true,
          }}
        >
          {deck.map((item, index) => {
            const isActive = index === pos;
            return (
              <SwiperSlide key={item.id}>
                {isActive ? (
                  <Flashcard
                    item={item}
                    flipped={flipped}
                    onFlip={handleFlip}
                    onSpeak={speakCurrent}
                    isSpeaking={isSpeaking}
                    canSpeak={Boolean(item.speakText)}
                  />
                ) : (
                  <div className="flashcard-blank" aria-hidden />
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

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
          disabled={pos >= deck.length - 1}
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-[var(--muted)] transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white disabled:opacity-40"
        >
          Sau →
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={rebuild}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white"
        >
          Trộn thẻ
        </button>
      </div>

      <p className="mt-3 text-center text-[11px] text-white/25">
        {formatStudyShortcutHints(shortcutOptions)}
      </p>
    </section>
  );
}
