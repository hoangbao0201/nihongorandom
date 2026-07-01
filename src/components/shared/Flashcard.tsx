"use client";

import type { FlashcardItem } from "@/utils/flashcardDeck";

interface FlashcardProps {
  item: FlashcardItem;
  flipped: boolean;
  onFlip: () => void;
  onSpeak?: () => void;
  isSpeaking?: boolean;
  canSpeak?: boolean;
}

function SpeakerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M3 10v4h4l5 5V5L7 10H3zm13.5 2a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12z" />
    </svg>
  );
}

function Face({
  text,
  lang,
  reading,
}: {
  text: string;
  lang: "ja" | "vi";
  reading?: string;
}) {
  const isJapanese = lang === "ja";
  return (
    <>
      <p
        lang={isJapanese ? "ja" : "vi"}
        className={`px-6 text-center text-4xl font-bold text-white sm:text-5xl ${
          isJapanese ? "font-jp" : ""
        }`}
      >
        {text}
      </p>
      {reading ? (
        <p lang="ja" className="mt-3 font-jp text-base text-[var(--accent-soft)]">
          {reading}
        </p>
      ) : null}
    </>
  );
}

export default function Flashcard({
  item,
  flipped,
  onFlip,
  onSpeak,
  isSpeaking,
  canSpeak,
}: FlashcardProps) {
  return (
    <div className="flashcard-scene relative h-64 w-full sm:h-72">
      {canSpeak && onSpeak ? (
        <button
          type="button"
          onClick={onSpeak}
          aria-label="Phát âm"
          title="Phát âm"
          className={`absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent-soft)] transition-colors hover:bg-[var(--accent)]/20 ${
            isSpeaking ? "animate-pulse" : ""
          }`}
        >
          <SpeakerIcon />
        </button>
      ) : null}

      <button
        type="button"
        onClick={onFlip}
        aria-label="Lật thẻ"
        className={`flashcard-inner block w-full appearance-none border-0 bg-transparent p-0 text-left ${
          flipped ? "is-flipped" : ""
        }`}
      >
        <span className="flashcard-face glass-panel rounded-2xl border border-white/8 bg-white/[0.03]">
          <Face
            text={item.front}
            lang={item.frontLang}
            reading={item.frontLang === "ja" ? item.reading : undefined}
          />
        </span>
        <span className="flashcard-face flashcard-face-back glass-panel rounded-2xl border border-white/8 bg-white/[0.05]">
          <Face
            text={item.back}
            lang={item.backLang}
            reading={item.backLang === "ja" ? item.reading : undefined}
          />
        </span>
      </button>
    </div>
  );
}
