import type {
  IN5HantuData,
  IN5TuvungData,
} from "@/src/lib/n5Types";
import {
  buildJapaneseDisplay,
  getTuvungSectionKind,
  htmlToPlainText,
} from "@/src/utils/rubyHtml";

export type LessonQuizContentType = "vocabulary" | "kanji";

export type VocabularyQuizDirection = "vi-to-jp" | "jp-to-vi";

export interface VocabularyQuizOptions {
  useKanji: boolean;
  direction: VocabularyQuizDirection;
}

export const DEFAULT_VOCABULARY_QUIZ_OPTIONS: VocabularyQuizOptions = {
  useKanji: false,
  direction: "vi-to-jp",
};

export interface LessonQuizChoice {
  id: string;
  label: string;
}

export interface LessonQuizQuestion {
  contentType: LessonQuizContentType;
  lessonNumber: number;
  itemId: string;
  promptText: string;
  promptLang?: "ja" | "vi";
  choiceLang?: "ja" | "vi";
  promptHoverText?: string;
  imageUrl?: string;
  correctAnswer: string;
  choices: LessonQuizChoice[];
}

interface LessonQuizPoolItem {
  contentType: LessonQuizContentType;
  lessonNumber: number;
  itemId: string;
  japaneseText: string;
  meaningLabel: string;
  promptHoverText?: string;
}

/** Keys mark items already used as the correct answer in the current cycle. */
export type LessonQuizStatsMap = Record<string, 1>;

const LESSON_COUNT = 25;

function unwrapModule<T>(mod: T | { default: T }): T {
  if (mod && typeof mod === "object" && "default" in mod) {
    return (mod as { default: T }).default;
  }
  return mod as T;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

async function loadPool(
  lessonNumber: number,
  contentType: LessonQuizContentType,
  vocabOptions: VocabularyQuizOptions = DEFAULT_VOCABULARY_QUIZ_OPTIONS
): Promise<LessonQuizPoolItem[]> {
  try {
    if (contentType === "vocabulary") {
      const module = await import(
        `@/src/data/n5/${lessonNumber}/tuvung-b${lessonNumber}.json`
      );
      const data = unwrapModule<IN5TuvungData>(module);
      const pool: LessonQuizPoolItem[] = [];

      for (const section of data.sections) {
        const sectionKind = getTuvungSectionKind(section);

        for (const item of section.items) {
          if (item.kind === "divider") {
            continue;
          }

          const meaningLabel = htmlToPlainText(item.meaning ?? "");
          if (!meaningLabel) {
            continue;
          }

          if (item.kind === "entry") {
            if (sectionKind !== "main") {
              continue;
            }

            const word = item.word?.trim();
            const kanji = item.kanji?.trim();

            if (!word && !kanji) {
              continue;
            }

            const japaneseText = vocabOptions.useKanji ? kanji || word! : word!;

            pool.push({
              contentType: "vocabulary",
              lessonNumber,
              itemId: `entry-${section.key}-${item.index}`,
              japaneseText,
              meaningLabel,
            });
            continue;
          }

          if (sectionKind === "main") {
            continue;
          }

          const textHtml = item.textHtml?.trim() || item.text?.trim();
          if (!textHtml) {
            continue;
          }

          const japaneseText = buildJapaneseDisplay(
            textHtml,
            sectionKind,
            vocabOptions.useKanji
          );

          if (!japaneseText) {
            continue;
          }

          pool.push({
            contentType: "vocabulary",
            lessonNumber,
            itemId: `phrase-${section.key}-${item.index}`,
            japaneseText,
            meaningLabel,
          });
        }
      }

      return pool;
    }

    const module = await import(
      `@/src/data/n5/${lessonNumber}/hantu-b${lessonNumber}.json`
    );
    const data = unwrapModule<IN5HantuData>(module);

    return data.entries.flatMap((item) => {
      const meaningLabel = item.sinoVietnamese?.trim();
      const japaneseText = item.kanji?.trim();
      if (!meaningLabel || !japaneseText) {
        return [];
      }

      return [
        {
          contentType: "kanji" as const,
          lessonNumber,
          itemId: `hantu-${item.index}`,
          japaneseText,
          meaningLabel,
          promptHoverText: item.kana?.trim() || undefined,
        },
      ];
    });
  } catch {
    return [];
  }
}

function statKey(item: LessonQuizPoolItem) {
  return `${item.contentType}::${item.lessonNumber}::${item.itemId}`;
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function pickDistinctChoices(
  pool: LessonQuizPoolItem[],
  questionItem: LessonQuizPoolItem,
  pickLabel: (item: LessonQuizPoolItem) => string
): LessonQuizPoolItem[] | null {
  const questionKey = statKey(questionItem);
  const others = shuffle(pool.filter((item) => statKey(item) !== questionKey));

  const selected: LessonQuizPoolItem[] = [questionItem];
  const usedLabels = new Set([pickLabel(questionItem)]);

  for (const item of others) {
    const label = pickLabel(item);
    if (usedLabels.has(label)) {
      continue;
    }

    usedLabels.add(label);
    selected.push(item);

    if (selected.length >= 4) {
      break;
    }
  }

  return selected.length >= 4 ? selected : null;
}

function buildQuestionFromPool(
  pool: LessonQuizPoolItem[],
  questionItem: LessonQuizPoolItem,
  direction: VocabularyQuizDirection = "jp-to-vi"
): LessonQuizQuestion | null {
  if (pool.length < 4) {
    return null;
  }

  if (questionItem.contentType === "kanji") {
    const selected = pickDistinctChoices(pool, questionItem, (item) => item.meaningLabel);
    if (!selected) {
      return null;
    }

    const choices = shuffle(
      selected.map((item) => ({
        id: item.itemId,
        label: item.meaningLabel,
      }))
    );

    return {
      contentType: "kanji",
      lessonNumber: questionItem.lessonNumber,
      itemId: questionItem.itemId,
      promptText: questionItem.japaneseText,
      promptLang: "ja",
      choiceLang: "vi",
      promptHoverText: questionItem.promptHoverText,
      correctAnswer: questionItem.meaningLabel,
      choices,
    };
  }

  const isViToJp = direction === "vi-to-jp";
  const pickLabel = (item: LessonQuizPoolItem) =>
    isViToJp ? item.japaneseText : item.meaningLabel;

  const selected = pickDistinctChoices(pool, questionItem, pickLabel);
  if (!selected) {
    return null;
  }

  const choices = shuffle(
    selected.map((item) => ({
      id: item.itemId,
      label: pickLabel(item),
    }))
  );

  return {
    contentType: "vocabulary",
    lessonNumber: questionItem.lessonNumber,
    itemId: questionItem.itemId,
    promptText: isViToJp ? questionItem.meaningLabel : questionItem.japaneseText,
    promptLang: isViToJp ? "vi" : "ja",
    choiceLang: isViToJp ? "ja" : "vi",
    correctAnswer: pickLabel(questionItem),
    choices,
  };
}

function clearUsedCorrectAnswers(
  stats: LessonQuizStatsMap,
  contentType: LessonQuizContentType,
  lessonNumbers: number[]
): LessonQuizStatsMap {
  const lessonSet = new Set(lessonNumbers);
  const nextStats = { ...stats };

  for (const key of Object.keys(nextStats)) {
    if (!key.startsWith(`${contentType}::`)) {
      continue;
    }

    const lessonNumber = Number(key.split("::")[1]);
    if (lessonSet.has(lessonNumber)) {
      delete nextStats[key];
    }
  }

  return nextStats;
}

async function tryBuildQuestionFromLessons(
  lessonNumbers: number[],
  contentType: LessonQuizContentType,
  stats: LessonQuizStatsMap,
  vocabOptions: VocabularyQuizOptions = DEFAULT_VOCABULARY_QUIZ_OPTIONS
): Promise<{
  question: LessonQuizQuestion | null;
  stats: LessonQuizStatsMap;
} | null> {
  const direction =
    contentType === "vocabulary" ? vocabOptions.direction : "jp-to-vi";

  for (const lessonNumber of shuffle(lessonNumbers)) {
    const pool = await loadPool(lessonNumber, contentType, vocabOptions);
    if (pool.length < 4) {
      continue;
    }

    const unusedItems = pool.filter((item) => !stats[statKey(item)]);
    if (unusedItems.length === 0) {
      continue;
    }

    const questionItem = pickRandom(unusedItems);
    const question = buildQuestionFromPool(pool, questionItem, direction);
    if (!question) {
      continue;
    }

    return {
      question,
      stats: {
        ...stats,
        [statKey(questionItem)]: 1,
      },
    };
  }

  return null;
}

export async function buildLessonQuizQuestion(
  lessonNumbers: number[],
  contentType: LessonQuizContentType,
  stats: LessonQuizStatsMap = {},
  vocabOptions: VocabularyQuizOptions = DEFAULT_VOCABULARY_QUIZ_OPTIONS
): Promise<{
  question: LessonQuizQuestion | null;
  stats: LessonQuizStatsMap;
}> {
  if (lessonNumbers.length === 0) {
    return { question: null, stats };
  }

  const firstAttempt = await tryBuildQuestionFromLessons(
    lessonNumbers,
    contentType,
    stats,
    vocabOptions
  );
  if (firstAttempt) {
    return firstAttempt;
  }

  const resetStats = clearUsedCorrectAnswers(
    stats,
    contentType,
    lessonNumbers
  );
  const secondAttempt = await tryBuildQuestionFromLessons(
    lessonNumbers,
    contentType,
    resetStats,
    vocabOptions
  );

  return secondAttempt ?? { question: null, stats: resetStats };
}

export async function lessonHasQuizData(
  lessonNumber: number,
  contentType: LessonQuizContentType,
  vocabOptions: VocabularyQuizOptions = DEFAULT_VOCABULARY_QUIZ_OPTIONS
): Promise<boolean> {
  const pool = await loadPool(lessonNumber, contentType, vocabOptions);
  return pool.length >= 4;
}

export { LESSON_COUNT };
