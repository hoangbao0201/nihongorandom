"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ListeningPrompt from "@/components/shared/ListeningPrompt";
import { useJapaneseSpeech } from "@/hooks/useJapaneseSpeech";
import {
  formatStudyShortcutHints,
  useStudyShortcuts,
} from "@/hooks/useStudyShortcuts";
import {
  buildLessonQuizQuestion,
  DEFAULT_VOCABULARY_QUIZ_OPTIONS,
  lessonHasQuizData,
  LESSON_COUNT,
  type LessonQuizContentType,
  type LessonQuizQuestion,
  type LessonQuizStatsMap,
  type VocabularyQuizDirection,
  type VocabularyQuizOptions,
} from "@/utils/lessonQuiz";
import {
  getQuizPromptSizing,
  quizPromptStyleVars,
} from "@/utils/quizPromptSizing";

const CONTENT_META: Record<
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

type LessonQuizStudyMode = "read" | "listen";

interface LessonQuizStudyViewProps {
  contentType: LessonQuizContentType;
  mode?: LessonQuizStudyMode;
  onCorrect: () => void;
}

const OPTION_BUTTON_CLASS =
  "flex-1 cursor-pointer rounded-md px-2 py-1.5 text-center text-xs font-semibold tracking-wide text-white/45 outline-none transition-all duration-200 hover:text-white/70";

function QuizPromptDisplay({
  question,
}: {
  question: LessonQuizQuestion;
}) {
  const sizing = getQuizPromptSizing(question);
  const style = quizPromptStyleVars(sizing);
  const isJapanese = question.promptLang === "ja";

  if (question.contentType === "kanji") {
    return (
      <div
        className={`quiz-prompt group ${question.promptHoverText ? "cursor-default" : ""}`}
        style={style}
      >
        <div className="quiz-prompt__ruby-slot" aria-hidden={!question.promptHoverText}>
          {question.promptHoverText ? (
            <p className="quiz-prompt__hover-text font-jp" lang="ja">
              {question.promptHoverText}
            </p>
          ) : null}
        </div>
        <p
          className="quiz-prompt__main animate-fade-up font-jp font-bold text-white drop-shadow-[0_0_40px_rgba(249,67,0,0.25)]"
          lang="ja"
        >
          {question.promptText}
        </p>
      </div>
    );
  }

  return (
    <div className="quiz-prompt" style={style}>
      <p
        className={`quiz-prompt__main animate-fade-up font-bold text-white drop-shadow-[0_0_40px_rgba(249,67,0,0.25)] ${
          isJapanese ? "font-jp" : ""
        }`}
        lang={isJapanese ? "ja" : "vi"}
      >
        {question.promptText}
      </p>
    </div>
  );
}

export default function LessonQuizStudyView({
  contentType,
  mode = "read",
  onCorrect,
}: LessonQuizStudyViewProps) {
  const meta = CONTENT_META[contentType];
  const [selectedLessons, setSelectedLessons] = useState<number[]>([]);
  const [lessonAvailability, setLessonAvailability] = useState<
    Record<number, boolean>
  >({});
  const [vocabDirection, setVocabDirection] = useState<VocabularyQuizDirection>(
    DEFAULT_VOCABULARY_QUIZ_OPTIONS.direction
  );
  const [useKanji, setUseKanji] = useState(DEFAULT_VOCABULARY_QUIZ_OPTIONS.useKanji);
  const [question, setQuestion] = useState<LessonQuizQuestion | null>(null);
  const [questionKey, setQuestionKey] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const quizStatsRef = useRef<LessonQuizStatsMap>({});
  const { speak, cancel, isReady, isSpeaking } = useJapaneseSpeech();

  const vocabOptions = useMemo<VocabularyQuizOptions>(
    () => ({
      useKanji,
      direction: mode === "listen" ? "jp-to-vi" : vocabDirection,
    }),
    [useKanji, vocabDirection, mode]
  );

  const showVocabReadOptions =
    contentType === "vocabulary" && mode === "read";

  const hasPlayableSettings = selectedLessons.length > 0;

  useEffect(() => {
    let cancelled = false;

    async function loadAvailability() {
      const nextAvailability: Record<number, boolean> = {};

      await Promise.all(
        Array.from({ length: LESSON_COUNT }, async (_, index) => {
          const lessonNumber = index + 1;
          nextAvailability[lessonNumber] = await lessonHasQuizData(
            lessonNumber,
            contentType,
            vocabOptions
          );
        })
      );

      if (!cancelled) {
        setLessonAvailability(nextAvailability);
      }
    }

    loadAvailability();
    return () => {
      cancelled = true;
    };
  }, [contentType, vocabOptions]);

  const handleNewQuestion = useCallback(
    async (statsOverride?: LessonQuizStatsMap) => {
      if (!hasPlayableSettings) {
        setQuestion(null);
        return;
      }

      setIsLoadingQuestion(true);
      setSelectedChoice(null);

      const { question: nextQuestion, stats: nextStats } =
        await buildLessonQuizQuestion(
          selectedLessons,
          contentType,
          statsOverride ?? quizStatsRef.current,
          vocabOptions
        );

      quizStatsRef.current = nextStats;
      setQuestion(nextQuestion);
      setQuestionKey((key) => key + 1);
      setIsLoadingQuestion(false);
    },
    [hasPlayableSettings, selectedLessons, contentType, vocabOptions]
  );

  useEffect(() => {
    quizStatsRef.current = {};
  }, [vocabOptions]);

  useEffect(() => {
    if (!hasPlayableSettings) {
      setQuestion(null);
      return;
    }
    handleNewQuestion();
  }, [hasPlayableSettings, handleNewQuestion]);

  const playCurrentQuestion = useCallback(() => {
    if (!question?.promptText || !isReady) {
      return;
    }

    if (question.promptLang === "vi") {
      return;
    }

    speak(question.promptText);
  }, [question, speak, isReady]);

  useEffect(() => {
    if (mode !== "listen" || !question?.promptText || !isReady) {
      return;
    }

    const timer = window.setTimeout(() => {
      playCurrentQuestion();
    }, 200);

    return () => window.clearTimeout(timer);
  }, [mode, question, questionKey, playCurrentQuestion, isReady]);

  const handleSkip = useCallback(() => {
    cancel();
    handleNewQuestion();
  }, [cancel, handleNewQuestion]);

  const listenShortcutOptions = {
    replay: mode === "listen" && Boolean(question?.promptText) && isReady,
    skip: Boolean(question) && !isLoadingQuestion,
  };

  useStudyShortcuts(
    {
      onReplay: playCurrentQuestion,
      onSkip: handleSkip,
    },
    listenShortcutOptions
  );

  const handleSelectChoice = (choiceLabel: string) => {
    if (!question || selectedChoice) {
      return;
    }

    setSelectedChoice(choiceLabel);

    if (choiceLabel === question.correctAnswer) {
      onCorrect();
      setTimeout(() => {
        handleNewQuestion();
      }, 600);
    }
  };

  return (
    <>
      <aside className="glass-panel mb-2 flex flex-col rounded-lg p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--accent-soft)]">
          {meta.asideTitle}
        </p>

        <div className="grid grid-cols-5 gap-1 sm:grid-cols-8 md:grid-cols-12">
          {Array.from({ length: LESSON_COUNT }, (_, index) => {
            const lessonNumber = index + 1;
            const checked = selectedLessons.includes(lessonNumber);
            const hasData = lessonAvailability[lessonNumber] ?? false;

            return (
              <div key={lessonNumber} className="flex items-center gap-2">
                <input
                  id={`${contentType}-lesson-${lessonNumber}`}
                  type="checkbox"
                  checked={checked}
                  disabled={!hasData}
                  className="script-toggle peer sr-only"
                  onChange={() =>
                    setSelectedLessons((previous) =>
                      checked
                        ? previous.filter((lesson) => lesson !== lessonNumber)
                        : [...previous, lessonNumber]
                    )
                  }
                />
                <label
                  htmlFor={`${contentType}-lesson-${lessonNumber}`}
                  className={`flex flex-1 cursor-pointer select-none items-center justify-center rounded-lg border border-white/8 bg-[var(--surface)] px-1 py-2 text-center text-xs font-medium transition-all duration-200 ${
                    hasData
                      ? "text-white hover:border-white/15 hover:bg-white/[0.06]"
                      : "cursor-not-allowed text-white/20"
                  }`}
                >
                  B{lessonNumber}
                  {!hasData ? (
                    <span className="sr-only"> (chưa có dữ liệu)</span>
                  ) : null}
                </label>
              </div>
            );
          })}
        </div>

        {showVocabReadOptions ? (
          <div className="mt-3 space-y-2 border-t border-white/8 pt-3">
            <div className="grid grid-cols-2 gap-1 rounded-lg border border-white/6 bg-black/35 p-1">
              <button
                type="button"
                onClick={() => setVocabDirection("vi-to-jp")}
                className={`${OPTION_BUTTON_CLASS} ${
                  vocabDirection === "vi-to-jp"
                    ? "bg-[var(--accent)]/50 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                    : ""
                }`}
              >
                VI → JP
              </button>
              <button
                type="button"
                onClick={() => setVocabDirection("jp-to-vi")}
                className={`${OPTION_BUTTON_CLASS} ${
                  vocabDirection === "jp-to-vi"
                    ? "bg-[var(--accent)]/50 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                    : ""
                }`}
              >
                JP → VI
              </button>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-xs text-white/70">
              <input
                type="checkbox"
                checked={useKanji}
                onChange={(event) => setUseKanji(event.target.checked)}
                className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-[var(--accent)]"
              />
              Dùng kanji
            </label>
          </div>
        ) : null}
      </aside>

      <section className="glass-panel flex min-h-[420px] flex-col rounded-lg p-5 sm:min-h-[480px]">
        {!hasPlayableSettings ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="animate-float mb-6 font-jp text-7xl text-white/10 sm:text-8xl">
              {meta.emptyGlyph}
            </div>
            <p className="max-w-xs text-sm text-[var(--muted)]">
              Chọn ít nhất một bài để{" "}
              <span className="text-[var(--accent-soft)]">bắt đầu</span>
            </p>
          </div>
        ) : isLoadingQuestion && !question ? (
          <div className="flex flex-1 items-center justify-center text-sm text-[var(--muted)]">
            Đang tải câu hỏi...
          </div>
        ) : !question ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="max-w-sm text-sm text-[var(--muted)]">
              Không đủ dữ liệu (cần ít nhất 4 mục) cho bộ đã chọn. Thử bài
              khác.
            </p>
            <button
              type="button"
              onClick={() => handleNewQuestion()}
              className="mt-4 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/20 hover:bg-white/10"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <div key={questionKey} className="flex flex-1 flex-col">
            <p className="text-center text-xs text-white/40">
              Bài {question.lessonNumber} · {meta.contentLabel}
            </p>

            <div className="relative flex min-h-[220px] flex-1 flex-col items-center justify-center gap-4 px-2 py-4 sm:min-h-[260px]">
              {mode === "listen" ? (
                <ListeningPrompt
                  onPlay={playCurrentQuestion}
                  isPlaying={isSpeaking}
                  isLoading={!isReady}
                  hint="Nghe và chọn nghĩa đúng"
                  shortcutHints={formatStudyShortcutHints(listenShortcutOptions)}
                />
              ) : (
                <QuizPromptDisplay question={question} />
              )}
            </div>

            <div className="mt-auto grid grid-cols-1 gap-2 sm:grid-cols-2">
              {question.choices.map((choice) => {
                const isSelected = selectedChoice === choice.label;
                const isCorrect = choice.label === question.correctAnswer;
                const isJapaneseChoice = question.choiceLang === "ja";
                let choiceClass =
                  "rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-medium text-white transition-colors hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed";

                if (selectedChoice) {
                  if (isCorrect) {
                    choiceClass =
                      "rounded-lg border border-[var(--success)]/50 bg-[var(--success)]/15 px-4 py-3 text-left text-sm font-semibold text-white disabled:cursor-not-allowed";
                  } else if (isSelected) {
                    choiceClass =
                      "rounded-lg border border-red-500/50 bg-red-500/15 px-4 py-3 text-left text-sm font-medium text-white disabled:cursor-not-allowed";
                  } else {
                    choiceClass =
                      "rounded-lg border border-white/8 bg-white/[0.03] px-4 py-3 text-left text-sm text-white/40 disabled:cursor-not-allowed";
                  }
                }

                return (
                  <button
                    key={choice.id}
                    type="button"
                    disabled={Boolean(selectedChoice)}
                    onClick={() => handleSelectChoice(choice.label)}
                    className={`${choiceClass} ${isJapaneseChoice ? "font-jp" : ""}`}
                    lang={isJapaneseChoice ? "ja" : "vi"}
                  >
                    {choice.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={handleSkip}
                disabled={isLoadingQuestion}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-[var(--muted)] transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white disabled:opacity-40"
              >
                Bỏ qua
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
