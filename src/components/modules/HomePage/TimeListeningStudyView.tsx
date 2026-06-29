"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ListeningPrompt from "@/components/shared/ListeningPrompt";
import { useJapaneseSpeech } from "@/hooks/useJapaneseSpeech";
import {
  formatStudyShortcutHints,
  useStudyShortcuts,
} from "@/hooks/useStudyShortcuts";
import {
  buildListeningTimeQuestion,
  normalizeTimeAnswer,
  type ListeningTimeQuestion,
} from "@/utils/timeQuestion";

interface TimeListeningStudyViewProps {
  onCorrect: () => void;
}

export default function TimeListeningStudyView({
  onCorrect,
}: TimeListeningStudyViewProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [question, setQuestion] = useState<ListeningTimeQuestion | null>(null);
  const [questionKey, setQuestionKey] = useState(0);
  const [value, setValue] = useState("");
  const [isShowAnswer, setIsShowAnswer] = useState(false);
  const { speak, cancel, isReady, isSpeaking } = useJapaneseSpeech();

  const handleNewQuestion = useCallback(() => {
    const nextQuestion = buildListeningTimeQuestion();
    setQuestion(nextQuestion);
    setQuestionKey((key) => key + 1);
    setValue("");
    setIsShowAnswer(false);
  }, []);

  const playCurrentQuestion = useCallback(() => {
    if (!question?.speakText || !isReady) {
      return;
    }

    speak(question.speakText);
  }, [question, speak, isReady]);

  useEffect(() => {
    handleNewQuestion();
  }, [handleNewQuestion]);

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
    const normalized = normalizeTimeAnswer(newValue);

    if (question && normalized === question.display) {
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
    <section className="glass-panel flex min-h-[420px] flex-col rounded-lg p-5 sm:min-h-[480px]">
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
              hint="Nghe và nhập thời gian"
              shortcutHints={formatStudyShortcutHints(shortcutOptions)}
            />
          </div>
        </div>

        <div className="mt-auto space-y-3">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={checkAnswer}
            placeholder="Nhập thời gian (vd: 5h30, 12h8)"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Nhập thời gian"
            className="study-input w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2 text-center text-white outline-none transition-all duration-200 placeholder:text-white/25 focus:border-[var(--accent)]/50"
          />

          <p className="text-center text-xs text-white/30">
            Điền theo dạng{" "}
            <span className="text-white/50">giờ</span>
            <span className="text-[var(--accent-soft)]">h</span>
            <span className="text-white/50">phút</span> — ví dụ{" "}
            <span className="text-white/50">5h30</span>,{" "}
            <span className="text-white/50">12h8</span>
          </p>

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
    </section>
  );
}
