"use client";

import { useCallback, useEffect, useState } from "react";
import FlashcardDeck from "@/components/modules/Flashcards/FlashcardDeck";
import {
  buildNumberFlashcards,
  buildTimeFlashcards,
  NUMBER_RANGE_OPTIONS,
  type FlashcardItem,
  type NumberRangeOption,
} from "@/utils/flashcardDeck";

const SESSION_SIZE = 20;

interface GeneratedFlashcardViewProps {
  mode: "number" | "time";
}

export default function GeneratedFlashcardView({
  mode,
}: GeneratedFlashcardViewProps) {
  const [range, setRange] = useState<NumberRangeOption>("number-1-10");
  const [items, setItems] = useState<FlashcardItem[]>([]);

  const regenerate = useCallback(() => {
    if (mode === "number") {
      setItems(buildNumberFlashcards(range, SESSION_SIZE));
    } else {
      setItems(buildTimeFlashcards(SESSION_SIZE));
    }
  }, [mode, range]);

  useEffect(() => {
    regenerate();
  }, [regenerate]);

  return (
    <>
      <aside className="glass-panel mb-2 flex flex-wrap items-center justify-between gap-3 rounded-lg p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent-soft)]">
          {mode === "number" ? "Số" : "Thời gian"}
        </p>
        <div className="flex items-center gap-2">
          {mode === "number" ? (
            <select
              value={range}
              onChange={(event) =>
                setRange(event.target.value as NumberRangeOption)
              }
              aria-label="Phạm vi số"
              className="cursor-pointer rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white outline-none transition-colors hover:border-white/20"
            >
              {NUMBER_RANGE_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : null}
          <button
            type="button"
            onClick={regenerate}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white"
          >
            Bộ thẻ mới
          </button>
        </div>
      </aside>

      <FlashcardDeck
        items={items}
        canMark={false}
        emptyHint="Nhấn “Bộ thẻ mới” để tạo thẻ."
      />
    </>
  );
}
