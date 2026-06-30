"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ListeningPrompt from "@/components/shared/ListeningPrompt";
import { useJapaneseSpeech } from "@/hooks/useJapaneseSpeech";
import {
  formatStudyShortcutHints,
  useStudyShortcuts,
} from "@/hooks/useStudyShortcuts";
import {
  buildListeningNumberQuestion,
  LISTENING_DIGIT_PLACES,
  normalizeNumberAnswer,
  type ListeningDigitPlaceId,
  type ListeningNumberQuestion,
} from "@/utils/numberQuestion";

interface NumberListeningStudyViewProps {
  onCorrect: () => void;
}

export default function NumberListeningStudyView({
  onCorrect,
}: NumberListeningStudyViewProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedPlaces, setSelectedPlaces] = useState<ListeningDigitPlaceId[]>(
    []
  );
  const [question, setQuestion] = useState<ListeningNumberQuestion | null>(
    null
  );
  const [questionKey, setQuestionKey] = useState(0);
  const [value, setValue] = useState("");
  const [isShowAnswer, setIsShowAnswer] = useState(false);
  const { speak, cancel, isReady, isSpeaking } = useJapaneseSpeech();

  const hasPlayableSettings = selectedPlaces.length > 0;

  const handleNewQuestion = useCallback(() => {
    if (!hasPlayableSettings) {
      setQuestion(null);
      return;
    }

    const nextQuestion = buildListeningNumberQuestion(selectedPlaces);
    setQuestion(nextQuestion);
    setQuestionKey((key) => key + 1);
    setValue("");
    setIsShowAnswer(false);
  }, [hasPlayableSettings, selectedPlaces]);

  const playCurrentQuestion = useCallback(() => {
    if (!question?.speakText || !isReady) {
      return;
    }

    speak(question.speakText);
  }, [question, speak, isReady]);

  useEffect(() => {
    if (!hasPlayableSettings) {
      setQuestion(null);
      return;
    }

    handleNewQuestion();
  }, [hasPlayableSettings, handleNewQuestion]);

  useEffect(() => {
    if (!question?.speakText || !isReady) {
      return;
    }

    const timer = window.setTimeout(() => {
      playCurrentQuestion();
    }, 200);

    return () => window.clearTimeout(timer);
  }, [question, questionKey, playCurrentQuestion, isReady]);

  const handleShowAnswer = useCallback(() => {
    if (question) {
      setIsShowAnswer(true);
    }
  }, [question]);

  const handleSkip = useCallback(() => {
    cancel();
    handleNewQuestion();
    window.setTimeout(() => inputRef.current?.focus(), 50);
  }, [cancel, handleNewQuestion]);

  const shortcutOptions = {
    replay: Boolean(question?.speakText) && isReady,
    showAnswer: Boolean(question),
    skip: Boolean(question),
  };

  useStudyShortcuts(
    {
      onReplay: playCurrentQuestion,
      onShowAnswer: handleShowAnswer,
      onSkip: handleSkip,
    },
    shortcutOptions
  );

  const checkAnswer = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    if (
      question &&
      normalizeNumberAnswer(newValue) === question.value.toString()
    ) {
      setValue("");
      setIsShowAnswer(false);
      onCorrect();
      handleNewQuestion();
      window.setTimeout(() => inputRef.current?.focus(), 50);
      return;
    }

    setValue(newValue);
  };

  return (
    <>
      <aside className="glass-panel mb-2 flex flex-col rounded-lg p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--accent-soft)]">
          Hàng số
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {LISTENING_DIGIT_PLACES.map((place) => {
            const checked = selectedPlaces.includes(place.id);

            return (
              <div key={place.id} className="flex items-center gap-2">
                <input
                  id={`listening-number-${place.id}`}
                  type="checkbox"
                  checked={checked}
                  className="script-toggle peer sr-only"
                  onChange={() =>
                    setSelectedPlaces((previous) =>
                      checked
                        ? previous.filter((item) => item !== place.id)
                        : [...previous, place.id]
                    )
                  }
                />
                <label
                  htmlFor={`listening-number-${place.id}`}
                  className="flex flex-1 cursor-pointer select-none items-center justify-center rounded-lg border border-white/8 bg-[var(--surface)] px-2 py-2 text-center text-xs font-medium text-white transition-all duration-200 hover:border-white/15 hover:bg-white/[0.06]"
                >
                  {place.label}
                </label>
              </div>
            );
          })}
        </div>
      </aside>

      <section className="glass-panel flex min-h-[420px] flex-col rounded-lg p-5 sm:min-h-[480px]">
        {!hasPlayableSettings ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="animate-float mb-6 font-jp text-7xl text-white/10 sm:text-8xl">
              数
            </div>
            <p className="max-w-xs text-sm text-[var(--muted)]">
              Chọn ít nhất một hàng số để{" "}
              <span className="text-[var(--accent-soft)]">bắt đầu</span>
            </p>
          </div>
        ) : (
          <div className="flex flex-1 flex-col">
            <div className="relative flex flex-1 items-center justify-center py-4">
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-40 w-40 rounded-full bg-[var(--accent)]/10 blur-3xl sm:h-52 sm:w-52" />
              </div>
              <div key={questionKey} className="animate-fade-up relative">
                <ListeningPrompt
                  onPlay={playCurrentQuestion}
                  isPlaying={isSpeaking}
                  isLoading={!isReady}
                  hint="Nghe và nhập kết quả"
                  shortcutHints={formatStudyShortcutHints(shortcutOptions)}
                />
              </div>
            </div>

            <div className="mt-auto space-y-3">
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                value={value}
                onChange={checkAnswer}
                placeholder="Nhập số (vd: 10005)"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                aria-label="Nhập kết quả"
                className="study-input w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2 text-center text-white outline-none transition-all duration-200 placeholder:text-white/25 focus:border-[var(--accent)]/50"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleShowAnswer}
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-[var(--muted)] transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  Xem đáp án
                </button>
                <button
                  type="button"
                  onClick={handleSkip}
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-[var(--muted)] transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  Bỏ qua
                </button>
              </div>

              {isShowAnswer && question ? (
                <div
                  key={`answer-${questionKey}`}
                  className="animate-fade-up rounded-lg border border-[var(--success)]/30 bg-[var(--success)]/10 px-4 py-3 text-center"
                >
                  <span className="text-xs uppercase tracking-wider text-[var(--success)]/80">
                    Đáp án
                  </span>
                  <p className="mt-0.5 text-xl font-semibold text-white">
                    {question.display}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
