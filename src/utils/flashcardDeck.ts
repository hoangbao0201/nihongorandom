import { CHARACTER_DATASETS, type ICharacter } from "@/config/kana";
import { statKey, type LessonQuizPoolItem } from "@/utils/lessonQuiz";

export type FlashcardDirection = "jp-to-vi" | "vi-to-jp";

export type KanaSet =
  | "hiragana"
  | "hiragana-contracted"
  | "katakana"
  | "katakana-contracted";

export const KANA_SETS: { id: KanaSet; label: string }[] = [
  { id: "hiragana", label: "Hiragana" },
  { id: "hiragana-contracted", label: "Hiragana (âm ghép)" },
  { id: "katakana", label: "Katakana" },
  { id: "katakana-contracted", label: "Katakana (âm ghép)" },
];

export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  frontLang: "ja" | "vi";
  backLang: "ja" | "vi";
  reading?: string;
  speakText?: string;
}

export function buildLessonFlashcards(
  poolItems: LessonQuizPoolItem[],
  direction: FlashcardDirection
): FlashcardItem[] {
  return poolItems.map((item) => {
    const id = statKey(item);
    if (direction === "vi-to-jp") {
      return {
        id,
        front: item.meaningLabel,
        back: item.japaneseText,
        frontLang: "vi",
        backLang: "ja",
        reading: item.promptHoverText,
        speakText: item.japaneseText,
      };
    }
    return {
      id,
      front: item.japaneseText,
      back: item.meaningLabel,
      frontLang: "ja",
      backLang: "vi",
      reading: item.promptHoverText,
      speakText: item.japaneseText,
    };
  });
}

export function buildKanaFlashcards(sets: KanaSet[]): FlashcardItem[] {
  return sets.flatMap((set) => {
    const dataset: ICharacter[] = CHARACTER_DATASETS[set] ?? [];
    return dataset.map((character) => ({
      id: `kana::${set}::${character.display}`,
      front: character.display,
      back: character.answer,
      frontLang: "ja" as const,
      backLang: "vi" as const,
      speakText: character.display,
    }));
  });
}
