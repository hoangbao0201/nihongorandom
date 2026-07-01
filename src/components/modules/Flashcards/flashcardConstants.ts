export enum FlashcardTabId {
  vocabulary = "vocabulary",
  kanji = "kanji",
  kana = "kana",
  number = "number",
  time = "time",
}

export const FLASHCARD_TABS = [
  { id: FlashcardTabId.vocabulary, label: "Từ vựng" },
  { id: FlashcardTabId.kanji, label: "Kanji" },
  { id: FlashcardTabId.kana, label: "Bảng chữ cái" },
  { id: FlashcardTabId.number, label: "Số" },
  { id: FlashcardTabId.time, label: "Thời gian" },
] as const;

export const FLASHCARD_TAB_CLASS =
  "w-full cursor-pointer rounded-md px-3 py-2 text-center text-xs font-semibold tracking-wide text-white/45 outline-none transition-all duration-200 hover:text-white/70 data-selected:bg-white/12 data-selected:text-white data-selected:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]";
