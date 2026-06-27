"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import HtmlContent from "@/src/components/shared/HtmlContent";
import type { IN5KiemtraData, IN5QuizOption, IN5QuizQuestion } from "@/src/lib/n5Types";

type QuizPhase = "active" | "submitted";

interface FlatQuestion {
  key: string;
  displayNumber: number;
  sectionIndex: number;
  questionIndex: number;
  question: IN5QuizQuestion;
}

function buildFlatQuestions(data: IN5KiemtraData): FlatQuestion[] {
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

function shuffleKeys(keys: string[]) {
  const next = [...keys];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function createOptionOrder(items: FlatQuestion[]) {
  return Object.fromEntries(
    items.map((item) => [item.key, item.question.options.map((option) => option.key)])
  );
}

function orderOptions(question: IN5QuizQuestion, order: string[] | undefined) {
  const keys = order ?? question.options.map((option) => option.key);
  return keys
    .map((key) => question.options.find((option) => option.key === key))
    .filter((option): option is IN5QuizOption => Boolean(option));
}

function navButtonClass(state: "empty" | "answered" | "correct" | "wrong") {
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

function optionClass({
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

export default function KiemtraPartView({ data }: { data: IN5KiemtraData }) {
  const flatQuestions = useMemo(() => buildFlatQuestions(data), [data]);
  const questionRefs = useRef<Record<string, HTMLElement | null>>({});

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<QuizPhase>("active");
  const [showAnswers, setShowAnswers] = useState(false);
  const [scoreMessage, setScoreMessage] = useState<string | null>(null);
  const [shuffleNonce, setShuffleNonce] = useState(0);

  const optionOrder = useMemo(() => {
    const base = createOptionOrder(flatQuestions);
    if (shuffleNonce === 0) {
      return base;
    }

    return Object.fromEntries(
      flatQuestions.map((item) => [
        item.key,
        shuffleKeys(item.question.options.map((option) => option.key)),
      ])
    );
  }, [flatQuestions, shuffleNonce]);

  useEffect(() => {
    setAnswers({});
    setPhase("active");
    setShowAnswers(false);
    setScoreMessage(null);
    setShuffleNonce(0);
  }, [data.lesson]);

  const totalGradable = flatQuestions.filter((item) => item.question.correctKey).length;

  function getNavState(item: FlatQuestion): "empty" | "answered" | "correct" | "wrong" {
    const selected = answers[item.key];

    if (phase === "submitted" && item.question.correctKey) {
      if (!selected) return "wrong";
      return selected === item.question.correctKey ? "correct" : "wrong";
    }

    return selected ? "answered" : "empty";
  }

  function scrollToQuestion(key: string) {
    questionRefs.current[key]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleSubmit() {
    let correctCount = 0;

    for (const item of flatQuestions) {
      const { correctKey } = item.question;
      if (!correctKey) continue;
      if (answers[item.key] === correctKey) {
        correctCount += 1;
      }
    }

    const total = totalGradable || flatQuestions.length;
    setPhase("submitted");
    setShowAnswers(false);
    setScoreMessage(`Bạn trả lời đúng: ${correctCount}/${total} câu`);
  }

  function handleReset() {
    setAnswers({});
    setPhase("active");
    setShowAnswers(false);
    setScoreMessage(null);
    setShuffleNonce((nonce) => nonce + 1);
  }

  function handleShowAnswers() {
    if (phase !== "submitted") return;
    setShowAnswers(true);
  }

  const canShowAnswers = phase === "submitted" && totalGradable > 0;
  const locked = phase === "submitted";

  return (
    <div className="space-y-6">
      <div className="glass-panel sticky top-2 z-20 space-y-3 rounded-lg border border-white/10 p-4">
        <div className="flex flex-wrap gap-1.5">
          {flatQuestions.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => scrollToQuestion(item.key)}
              className={`h-9 min-w-9 rounded-md border px-2 text-sm font-semibold transition-colors ${navButtonClass(getNavState(item))}`}
              aria-label={`Câu ${item.displayNumber}`}
            >
              {item.displayNumber}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={locked}
            className="rounded-md bg-red-600/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Kết quả
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-md bg-emerald-600/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Làm lại
          </button>
          <button
            type="button"
            onClick={handleShowAnswers}
            disabled={!canShowAnswers || showAnswers}
            className="rounded-md bg-[var(--accent)]/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Đáp án
          </button>
          {scoreMessage ? (
            <p className="text-sm font-medium text-white/85">{scoreMessage}</p>
          ) : null}
        </div>
      </div>

      {data.sections.map((section, sectionIndex) => (
        <section key={sectionIndex} className="space-y-5">
          {section.title ? (
            <h2 className="text-xl font-bold text-white">{section.title}</h2>
          ) : null}

          {section.questions.map((question, questionIndex) => {
            const flat = flatQuestions.find(
              (item) =>
                item.sectionIndex === sectionIndex && item.questionIndex === questionIndex
            );
            if (!flat) return null;

            const questionKey = flat.key;
            const selectedKey = answers[questionKey];
            const options = orderOptions(question, optionOrder[questionKey]);

            return (
              <article
                key={questionKey}
                ref={(node) => {
                  questionRefs.current[questionKey] = node;
                }}
                id={`kiemtra-q-${questionKey}`}
                className="glass-panel scroll-mt-36 rounded-lg p-5"
              >
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="rounded bg-white/10 px-2 py-1 text-xs font-semibold text-white/70">
                    Câu {flat.displayNumber}
                  </span>
                  {question.label ? (
                    <span className="rounded bg-[var(--accent)]/20 px-2 py-1 text-xs font-semibold text-[var(--accent-soft)]">
                      {question.label}
                    </span>
                  ) : null}
                  <div className="font-jp text-lg text-white" lang="ja">
                    {question.promptHtml ? (
                      <HtmlContent html={question.promptHtml} className="!text-lg !text-white" />
                    ) : (
                      question.prompt
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {options.map((option) => {
                    const inputId = `${questionKey}-${option.key}`;
                    const checked = selectedKey === option.key;
                    const isCorrectOption = question.correctKey === option.key;

                    return (
                      <label
                        key={option.key}
                        htmlFor={inputId}
                        className={`flex items-start gap-3 rounded-md border px-4 py-3 transition-colors ${
                          locked ? "cursor-default" : "cursor-pointer"
                        } ${optionClass({
                          checked,
                          phase,
                          showAnswers,
                          isCorrectOption,
                        })}`}
                      >
                        <input
                          id={inputId}
                          type="radio"
                          name={questionKey}
                          checked={checked}
                          disabled={locked}
                          onChange={() =>
                            setAnswers((current) => ({
                              ...current,
                              [questionKey]: option.key,
                            }))
                          }
                          className="mt-1"
                        />
                        <span className="text-sm text-white/90">{option.text}</span>
                        {showAnswers && isCorrectOption ? (
                          <span className="ml-auto text-xs font-semibold text-emerald-300">
                            Đáp án
                          </span>
                        ) : null}
                      </label>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </section>
      ))}
    </div>
  );
}
