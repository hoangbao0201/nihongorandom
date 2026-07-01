import type { CSSProperties } from "react";
import type { LessonQuizQuestion } from "@/utils/lessonQuiz";

export interface QuizPromptSizing {
  fontSize: string;
  rubyReserve: string;
  rubySize: string;
  maxWidth: string;
  lineHeight: string;
}

function visibleLength(text: string): number {
  return [...text.replace(/\s/g, "")].length;
}

function longestVisibleLength(question: LessonQuizQuestion): number {
  return Math.max(visibleLength(question.promptText), 1);
}

export function getQuizPromptSizing(
  question: LessonQuizQuestion
): QuizPromptSizing {
  const length = longestVisibleLength(question);
  const isPhrase = question.itemId.startsWith("phrase-");
  const isVietnamesePrompt = question.promptLang === "vi";
  const hasHoverText = Boolean(question.promptHoverText?.trim());

  let minRem = 1.1;
  let vw = 4;
  let maxRem = 1.65;

  if (length <= 3 && !isPhrase) {
    minRem = 2.75;
    vw = 11;
    maxRem = 6;
  } else if (length <= 5) {
    minRem = 2.35;
    vw = 9.5;
    maxRem = 5;
  } else if (length <= 8) {
    minRem = 1.95;
    vw = 8;
    maxRem = 4.1;
  } else if (length <= 12) {
    minRem = 1.65;
    vw = 6.5;
    maxRem = 3.2;
  } else if (length <= 18) {
    minRem = 1.4;
    vw = 5.2;
    maxRem = 2.65;
  } else if (length <= 24) {
    minRem = 1.2;
    vw = 4.4;
    maxRem = 2.2;
  }

  if (isVietnamesePrompt) {
    minRem *= 0.88;
    maxRem *= 0.88;
  }

  if (isPhrase && length > 10) {
    minRem *= 0.92;
    maxRem *= 0.92;
  }

  const fontSize = `clamp(${minRem.toFixed(2)}rem, ${vw.toFixed(1)}vw, ${maxRem.toFixed(2)}rem)`;
  const reserveBase = maxRem * (hasHoverText ? 0.68 : 0);
  const rubyReserve = hasHoverText ? `${reserveBase.toFixed(2)}rem` : "0px";
  const rubySize = length > 12 ? "0.48em" : isPhrase ? "0.52em" : "0.6em";
  const maxWidth = isVietnamesePrompt
    ? "min(92vw, 28rem)"
    : length > 14
      ? "min(92vw, 22rem)"
      : length > 8
        ? "min(92vw, 26rem)"
        : "min(92vw, 32rem)";
  const lineHeight = length > 12 || isVietnamesePrompt ? "1.35" : "1.08";

  return {
    fontSize,
    rubyReserve,
    rubySize,
    maxWidth,
    lineHeight,
  };
}

export function quizPromptStyleVars(
  sizing: QuizPromptSizing
): CSSProperties {
  return {
    "--quiz-prompt-size": sizing.fontSize,
    "--quiz-ruby-reserve": sizing.rubyReserve,
    "--quiz-prompt-max-width": sizing.maxWidth,
    "--quiz-prompt-line-height": sizing.lineHeight,
    "--jp-ruby-size": sizing.rubySize,
  } as React.CSSProperties;
}
