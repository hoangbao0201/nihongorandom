import { CHARACTER_DATASETS, type ICharacter } from "@/config/kana";
import { buildListeningTimeQuestion } from "@/utils/timeQuestion";
import { buildNumberQuestion } from "@/utils/numberQuestion";
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

export const NUMBER_RANGE_OPTIONS = [
  { id: "number-1-10", label: "1 – 10" },
  { id: "number-10-20", label: "10 – 20" },
  { id: "number-20-100", label: "20 – 100" },
  { id: "number-100-1000", label: "100 – 1.000" },
  { id: "number-1000-10000", label: "1.000 – 10.000" },
  { id: "number-10000-100000", label: "10.000 – 100.000" },
  { id: "number-100000-1000000", label: "100.000 – 1.000.000" },
  { id: "number-1000000-10000000", label: "1.000.000 – 10.000.000" },
] as const;

export type NumberRangeOption = (typeof NUMBER_RANGE_OPTIONS)[number]["id"];

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

export function buildNumberFlashcards(
  optionId: NumberRangeOption,
  count: number
): FlashcardItem[] {
  const items: FlashcardItem[] = [];
  for (let index = 0; index < count; index++) {
    const question = buildNumberQuestion(optionId);
    if (!question) {
      continue;
    }
    items.push({
      id: `number::${optionId}::${index}`,
      front: question.display,
      back: question.answer,
      frontLang: "vi",
      backLang: "vi",
      speakText: question.display.replace(/,/g, ""),
    });
  }
  return items;
}

export function buildTimeFlashcards(count: number): FlashcardItem[] {
  const items: FlashcardItem[] = [];
  for (let index = 0; index < count; index++) {
    const question = buildListeningTimeQuestion();
    items.push({
      id: `time::session::${index}`,
      front: question.display,
      back: question.speakText,
      frontLang: "vi",
      backLang: "ja",
      speakText: question.speakText,
    });
  }
  return items;
}
