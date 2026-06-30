"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CHARACTER_DATASETS, ICharacter } from "@/config/kana";
import {
  buildNumberQuestion,
  isNumberOption,
  normalizeSpaces,
} from "@/utils/numberQuestion";
import { pickLeastSeenExcludingHighest } from "@/utils/leastSeenPick";
import {
  formatStudyShortcutHints,
  useStudyShortcuts,
} from "@/hooks/useStudyShortcuts";

const KANA_OPTIONS = [
  { id: "hiragana", label: "hiragana" },
  { id: "hiragana-contracted", label: "hiragana âm ghép" },
  { id: "katakana", label: "katakana" },
  { id: "katakana-contracted", label: "katakana âm ghép" },
  { id: "number-1-10", label: "số < 10" },
  { id: "number-10-20", label: "số < 20" },
  { id: "number-20-100", label: "số < 100" },
  { id: "number-100-1000", label: "số < 1.000" },
  { id: "number-1000-10000", label: "số < 10.000" },
  { id: "number-10000-100000", label: "số < 100.000" },
  { id: "number-100000-1000000", label: "số < 1.000.000" },
  { id: "number-1000000-10000000", label: "số < 1.000.000.000" },
] as const;

interface IAnswerStat {
  answer: string;
  count: number;
  type: string;
}

type AnswerStatsMap = Record<string, IAnswerStat>;

interface KanaStudyViewProps {
  onCorrect: () => void;
}

export default function KanaStudyView({ onCorrect }: KanaStudyViewProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isShowAnswer, setIsShowAnswer] = useState(false);
  const [value, setValue] = useState("");
  const [charKey, setCharKey] = useState(0);
  const [question, setQuestion] = useState<ICharacter | null>(null);
  const [currentOptionId, setCurrentOptionId] = useState<string | null>(null);
  const [answerStats, setAnswerStats] = useState<AnswerStatsMap>({});

  const activeOptionIds = selectedOptions.filter((id) => {
    if (isNumberOption(id)) return true;
    return (CHARACTER_DATASETS[id]?.length ?? 0) > 0;
  });
  const hasPlayablePool = activeOptionIds.length > 0;

  const handleNewQuestion = useCallback(
    (statsOverride?: AnswerStatsMap) => {
      const stats = statsOverride ?? answerStats;
      const activeIds = selectedOptions.filter((id) => {
        if (isNumberOption(id)) return true;
        return (CHARACTER_DATASETS[id]?.length ?? 0) > 0;
      });

      if (activeIds.length === 0) {
        setQuestion(null);
        setCurrentOptionId(null);
        return;
      }

      const optionId = activeIds[Math.floor(Math.random() * activeIds.length)];

      if (isNumberOption(optionId)) {
        const nextQuestion = buildNumberQuestion(optionId);
        if (!nextQuestion) {
          setQuestion(null);
          setCurrentOptionId(null);
          return;
        }
        setQuestion(nextQuestion);
        setCurrentOptionId(optionId);
        setCharKey((key) => key + 1);
        return;
      }

      const pool = CHARACTER_DATASETS[optionId];
      const nextQuestion = pickLeastSeenExcludingHighest(pool, (character) =>
        stats[`${optionId}::${character.answer}`]?.count ?? 0
      );

      setQuestion(nextQuestion);
      setCurrentOptionId(optionId);
      setCharKey((key) => key + 1);
    },
    [selectedOptions, answerStats]
  );

  useEffect(() => {
    if (!hasPlayablePool) {
      setQuestion(null);
      return;
    }
    handleNewQuestion();
  }, [hasPlayablePool, handleNewQuestion]);

  const handleShowAnswer = useCallback(() => {
    if (question) {
      setIsShowAnswer(true);
    }
  }, [question]);

  const handleSkip = useCallback(() => {
    setIsShowAnswer(false);
    setValue("");
    handleNewQuestion();
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [handleNewQuestion]);

  const shortcutOptions = {
    showAnswer: Boolean(question),
    skip: Boolean(question),
  };

  useStudyShortcuts(
    {
      onShowAnswer: handleShowAnswer,
      onSkip: handleSkip,
    },
    shortcutOptions
  );

  const checkAnswer = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const normalized = normalizeSpaces(newValue);
    if (
      question?.answer &&
      normalizeSpaces(question.answer) === normalized
    ) {
      setValue("");
      setIsShowAnswer(false);
      onCorrect();

      let nextStats = answerStats;
      if (question && currentOptionId) {
        const key = `${currentOptionId}::${question.answer}`;
        const previous = answerStats[key];
        nextStats = {
          ...answerStats,
          [key]: {
            answer: question.answer,
            type: currentOptionId,
            count: (previous?.count ?? 0) + 1,
          },
        };
        setAnswerStats(nextStats);
      }

      handleNewQuestion(nextStats);
    } else {
      setValue(newValue);
    }
  };

  return (
    <>
      <aside className="glass-panel mb-2 flex flex-col rounded-lg p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--accent-soft)]">
          Bảng chữ cái
        </p>
        <div className="grid grid-cols-2 gap-2 focus:outline-none lg:grid-cols-6 md:grid-cols-4">
          {KANA_OPTIONS.map((option) => {
            const checked = selectedOptions.includes(option.id);
            const hasData =
              (CHARACTER_DATASETS[option.id]?.length ?? 0) > 0 ||
              isNumberOption(option.id);

            return (
              <div key={option.id} className="flex items-center gap-2">
                <input
                  id={option.id}
                  type="checkbox"
                  checked={checked}
                  disabled={!hasData}
                  className="script-toggle peer sr-only"
                  onChange={() =>
                    setSelectedOptions((previous) =>
                      checked
                        ? previous.filter((item) => item !== option.id)
                        : [...previous, option.id]
                    )
                  }
                />
                <label
                  htmlFor={option.id}
                  className={`flex flex-1 cursor-pointer select-none items-center justify-center gap-3 rounded-lg border border-white/8 bg-[var(--surface)] px-2 py-2 text-center text-xs font-medium transition-all duration-200 ${
                    hasData
                      ? "text-white hover:border-white/15 hover:bg-white/[0.06]"
                      : "cursor-not-allowed text-white/20"
                  }`}
                >
                  {option.label}
                </label>
              </div>
            );
          })}
        </div>
      </aside>

      <section className="glass-panel flex min-h-[420px] flex-col rounded-lg p-5 sm:min-h-[480px]">
        {!hasPlayablePool ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="animate-float mb-6 font-jp text-7xl text-white/10 sm:text-8xl">
              日本
            </div>
            <p className="max-w-xs text-sm text-[var(--muted)]">
              Chọn ít nhất một bảng để{" "}
              <span className="text-[var(--accent-soft)]">bắt đầu luyện tập</span>
            </p>
          </div>
        ) : (
          <div className="flex flex-1 flex-col">
            <div className="relative flex flex-1 items-center justify-center py-4">
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-40 w-40 rounded-full bg-[var(--accent)]/10 blur-3xl sm:h-52 sm:w-52" />
              </div>
              <p
                key={charKey}
                className="animate-fade-up relative text-[clamp(5rem,18vw,9rem)] font-bold leading-none text-white drop-shadow-[0_0_40px_rgba(249,67,0,0.25)]"
                aria-live="polite"
              >
                {question?.display}
              </p>
            </div>

            <div className="mt-auto space-y-3">
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={checkAnswer}
                placeholder="Nhập romaji (vd: ka, shi, kya...)"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                aria-label="Nhập romaji"
                className="study-input w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2 text-center text-white outline-none transition-all duration-200 placeholder:text-white/25 focus:border-[var(--accent)]/50"
              />

              <p className="text-xs text-white/30">
                Tắt gõ tiếng Việt để có trải nghiệm tốt hơn
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

              <p className="text-center text-xs text-white/25">
                {formatStudyShortcutHints(shortcutOptions)}
              </p>

              {isShowAnswer && question ? (
                <div
                  key={`answer-${charKey}`}
                  className="animate-fade-up rounded-lg border border-[var(--success)]/30 bg-[var(--success)]/10 px-4 py-3 text-center"
                >
                  <span className="text-xs uppercase tracking-wider text-[var(--success)]/80">
                    Đáp án
                  </span>
                  <p className="mt-0.5 text-xl font-semibold text-white">
                    {question.answer}
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
