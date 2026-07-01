import type { IN5KiemtraData, IN5QuizOption, IN5QuizQuestion } from "@/lib/n5Types";

export type QuizPhase = "active" | "submitted";

export interface FlatQuestion {
  key: string;
  displayNumber: number;
  sectionIndex: number;
  questionIndex: number;
  question: IN5QuizQuestion;
}

export function buildFlatQuestions(data: IN5KiemtraData): FlatQuestion[] {
  const items: FlatQuestion[] = [];
  let displayNumber = 0;

  data.sections.forEach((section, sectionIndex) => {
    section.questions.forEach((question, questionIndex) => {
      displayNumber += 1;
      items.push({
        key: `${sectionIndex}-${questionIndex}`,
        displayNumber,
        sectionIndex,
        questionIndex,
        question,
      });
    });
  });

  return items;
}

export function shuffleKeys(keys: string[]) {
  const next = [...keys];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function createOptionOrder(items: FlatQuestion[]) {
  return Object.fromEntries(
    items.map((item) => [item.key, item.question.options.map((option) => option.key)])
  );
}

export function orderOptions(question: IN5QuizQuestion, order: string[] | undefined) {
  const keys = order ?? question.options.map((option) => option.key);
  return keys
    .map((key) => question.options.find((option) => option.key === key))
    .filter((option): option is IN5QuizOption => Boolean(option));
}

export function navButtonClass(state: "empty" | "answered" | "correct" | "wrong") {
  switch (state) {
    case "answered":
      return "border-[var(--accent)]/60 bg-[var(--accent)]/20 text-[var(--accent-soft)]";
    case "correct":
      return "border-emerald-500/60 bg-emerald-500/20 text-emerald-300";
    case "wrong":
      return "border-red-500/60 bg-red-500/20 text-red-300";
    default:
      return "border-white/15 bg-white/[0.03] text-white/55 hover:border-white/30 hover:text-white/80";
  }
}

export function optionClass({
  checked,
  phase,
  showAnswers,
  isCorrectOption,
}: {
  checked: boolean;
  phase: QuizPhase;
  showAnswers: boolean;
  isCorrectOption: boolean;
}) {
  if (showAnswers && isCorrectOption) {
    return "border-emerald-500/60 bg-emerald-500/10";
  }

  if (phase === "submitted" && checked) {
    return isCorrectOption
      ? "border-emerald-500/60 bg-emerald-500/10"
      : "border-red-500/60 bg-red-500/10";
  }

  if (checked) {
    return "border-[var(--accent)]/50 bg-[var(--accent)]/10";
  }

  return "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]";
}
