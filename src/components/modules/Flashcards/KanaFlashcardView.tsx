"use client";

import { useMemo, useState } from "react";
import FlashcardDeck from "@/components/modules/Flashcards/FlashcardDeck";
import { useFlashcardProgress } from "@/hooks/useFlashcardProgress";
import {
  buildKanaFlashcards,
  KANA_SETS,
  type KanaSet,
} from "@/utils/flashcardDeck";

export default function KanaFlashcardView() {
  const { isKnown, markKnown, markReview } = useFlashcardProgress();
  const [selectedSets, setSelectedSets] = useState<KanaSet[]>(["hiragana"]);

  const items = useMemo(
    () => buildKanaFlashcards(selectedSets),
    [selectedSets]
  );

  const toggleSet = (set: KanaSet) => {
    setSelectedSets((previous) =>
      previous.includes(set)
        ? previous.filter((value) => value !== set)
        : [...previous, set]
    );
  };

  return (
    <>
      <aside className="glass-panel mb-2 flex flex-col rounded-lg p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--accent-soft)]">
          Bảng chữ cái
        </p>
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
          {KANA_SETS.map((set) => {
            const checked = selectedSets.includes(set.id);
            return (
              <label
                key={set.id}
                className={`flex cursor-pointer select-none items-center justify-center rounded-lg border px-2 py-2 text-center text-xs font-medium transition-all duration-200 ${
                  checked
                    ? "border-[var(--accent)]/50 bg-[var(--accent)]/15 text-white"
                    : "border-white/8 bg-[var(--surface)] text-white/70 hover:border-white/15"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleSet(set.id)}
                  className="sr-only"
                />
                {set.label}
              </label>
            );
          })}
        </div>
      </aside>

      <FlashcardDeck
        items={items}
        canMark
        isKnown={isKnown}
        onMarkKnown={markKnown}
        onMarkReview={markReview}
        emptyHint="Chọn ít nhất một bảng chữ để bắt đầu."
      />
    </>
  );
}
