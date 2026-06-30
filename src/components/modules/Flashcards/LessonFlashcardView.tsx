"use client";

import { useEffect, useMemo, useState } from "react";
import { CONTENT_META } from "@/components/modules/HomePage/lessonQuizConstants";
import FlashcardDeck from "@/components/modules/Flashcards/FlashcardDeck";
import { useFlashcardProgress } from "@/hooks/useFlashcardProgress";
import {
  DEFAULT_VOCABULARY_QUIZ_OPTIONS,
  LESSON_COUNT,
  loadPool,
  type LessonQuizContentType,
  type VocabularyQuizDirection,
  type VocabularyQuizOptions,
} from "@/utils/lessonQuiz";
import {
  buildLessonFlashcards,
  type FlashcardDirection,
  type FlashcardItem,
} from "@/utils/flashcardDeck";

interface LessonFlashcardViewProps {
  contentType: Extract<LessonQuizContentType, "vocabulary" | "kanji">;
}

export default function LessonFlashcardView({
  contentType,
}: LessonFlashcardViewProps) {
  const meta = CONTENT_META[contentType];
  const { isKnown, markKnown, markReview } = useFlashcardProgress();

  const [selectedLessons, setSelectedLessons] = useState<number[]>([]);
  const [availability, setAvailability] = useState<Record<number, boolean>>({});
  const [direction, setDirection] = useState<FlashcardDirection>("jp-to-vi");
  const [useKanji, setUseKanji] = useState(
    DEFAULT_VOCABULARY_QUIZ_OPTIONS.useKanji
  );
  const [items, setItems] = useState<FlashcardItem[]>([]);

  const vocabOptions = useMemo<VocabularyQuizOptions>(
    () => ({
      useKanji,
      direction: "jp-to-vi" as VocabularyQuizDirection,
    }),
    [useKanji]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadAvailability() {
      const next: Record<number, boolean> = {};
      await Promise.all(
        Array.from({ length: LESSON_COUNT }, async (_, index) => {
          const lessonNumber = index + 1;
          const pool = await loadPool(lessonNumber, contentType, vocabOptions);
          next[lessonNumber] = pool.length > 0;
        })
      );
      if (!cancelled) {
        setAvailability(next);
      }
    }

    loadAvailability();
    return () => {
      cancelled = true;
    };
  }, [contentType, vocabOptions]);

  useEffect(() => {
    let cancelled = false;

    async function loadDeck() {
      if (selectedLessons.length === 0) {
        setItems([]);
        return;
      }

      const pools = await Promise.all(
        selectedLessons.map((lessonNumber) =>
          loadPool(lessonNumber, contentType, vocabOptions)
        )
      );

      if (cancelled) {
        return;
      }

      const poolItems = pools.flat();
      setItems(buildLessonFlashcards(poolItems, direction));
    }

    loadDeck();
    return () => {
      cancelled = true;
    };
  }, [selectedLessons, contentType, vocabOptions, direction]);

  const showVocabOptions = contentType === "vocabulary";

  return (
    <>
      <aside className="glass-panel mb-2 flex flex-col rounded-lg p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--accent-soft)]">
          {meta.asideTitle}
        </p>

        <div className="grid grid-cols-5 gap-1 sm:grid-cols-8 md:grid-cols-12">
          {Array.from({ length: LESSON_COUNT }, (_, index) => {
            const lessonNumber = index + 1;
            const checked = selectedLessons.includes(lessonNumber);
            const hasData = availability[lessonNumber] ?? false;

            return (
              <div key={lessonNumber} className="flex items-center gap-2">
                <input
                  id={`flashcard-${contentType}-lesson-${lessonNumber}`}
                  type="checkbox"
                  checked={checked}
                  disabled={!hasData}
                  className="script-toggle peer sr-only"
                  onChange={() =>
                    setSelectedLessons((previous) =>
                      checked
                        ? previous.filter((lesson) => lesson !== lessonNumber)
                        : [...previous, lessonNumber]
                    )
                  }
                />
                <label
                  htmlFor={`flashcard-${contentType}-lesson-${lessonNumber}`}
                  className={`flex flex-1 cursor-pointer select-none items-center justify-center rounded-lg border border-white/8 bg-[var(--surface)] px-1 py-2 text-center text-xs font-medium transition-all duration-200 ${
                    hasData
                      ? "text-white hover:border-white/15 hover:bg-white/[0.06]"
                      : "cursor-not-allowed text-white/20"
                  }`}
                >
                  B{lessonNumber}
                  {!hasData ? (
                    <span className="sr-only"> (chưa có dữ liệu)</span>
                  ) : null}
                </label>
              </div>
            );
          })}
        </div>

        <div className="mt-3 space-y-2 border-t border-white/8 pt-3">
          <div className="grid grid-cols-2 gap-1 rounded-lg border border-white/6 bg-black/35 p-1">
            <button
              type="button"
              onClick={() => setDirection("jp-to-vi")}
              className={`flex-1 cursor-pointer rounded-md px-2 py-1.5 text-center text-xs font-semibold tracking-wide outline-none transition-all duration-200 ${
                direction === "jp-to-vi"
                  ? "bg-[var(--accent)]/50 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                  : "text-white/45 hover:text-white/70"
              }`}
            >
              JP → VI
            </button>
            <button
              type="button"
              onClick={() => setDirection("vi-to-jp")}
              className={`flex-1 cursor-pointer rounded-md px-2 py-1.5 text-center text-xs font-semibold tracking-wide outline-none transition-all duration-200 ${
                direction === "vi-to-jp"
                  ? "bg-[var(--accent)]/50 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                  : "text-white/45 hover:text-white/70"
              }`}
            >
              VI → JP
            </button>
          </div>

          {showVocabOptions ? (
            <label className="flex cursor-pointer items-center gap-2 text-xs text-white/70">
              <input
                type="checkbox"
                checked={useKanji}
                onChange={(event) => setUseKanji(event.target.checked)}
                className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-[var(--accent)]"
              />
              Dùng kanji
            </label>
          ) : null}
        </div>
      </aside>

      <FlashcardDeck
        items={items}
        canMark
        isKnown={isKnown}
        onMarkKnown={markKnown}
        onMarkReview={markReview}
        emptyHint="Chọn ít nhất một bài để bắt đầu lật thẻ."
      />
    </>
  );
}
