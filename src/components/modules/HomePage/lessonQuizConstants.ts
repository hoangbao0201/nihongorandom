import type { LessonQuizContentType } from "@/utils/lessonQuiz";

export const CONTENT_META: Record<
  LessonQuizContentType,
  { asideTitle: string; emptyGlyph: string; contentLabel: string }
> = {
  vocabulary: {
    asideTitle: "Từ vựng",
    emptyGlyph: "語",
    contentLabel: "Từ vựng",
  },
  kanji: {
    asideTitle: "Kanji",
    emptyGlyph: "漢",
    contentLabel: "Kanji",
  },
};

export type LessonQuizStudyMode = "read" | "listen";

export const OPTION_BUTTON_CLASS =
  "flex-1 cursor-pointer rounded-md px-2 py-1.5 text-center text-xs font-semibold tracking-wide text-white/45 outline-none transition-all duration-200 hover:text-white/70";
