"use client";

import { useRef } from "react";
import type { FlashcardItem } from "@/utils/flashcardDeck";

interface FlashcardProps {
  item: FlashcardItem;
  flipped: boolean;
  onFlip: () => void;
  onSpeak?: () => void;
  isSpeaking?: boolean;
  canSpeak?: boolean;
  interactive?: boolean;
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
  interactive = true,
}: FlashcardProps) {
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  const shown = flipped
    ? {
        text: item.back,
        lang: item.backLang,
        reading: item.backLang === "ja" ? item.reading : undefined,
      }
    : {
        text: item.front,
        lang: item.frontLang,
        reading: item.frontLang === "ja" ? item.reading : undefined,
      };

  return (
    <div
      className={`flashcard-scene relative h-full w-full ${flipped ? "is-flipped" : ""}`}
      onPointerDown={(event) => {
        if (!interactive) {
          return;
        }
        pointerStart.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerUp={(event) => {
        if (!interactive || !pointerStart.current) {
          return;
        }
        const dx = Math.abs(event.clientX - pointerStart.current.x);
        const dy = Math.abs(event.clientY - pointerStart.current.y);
        pointerStart.current = null;
        if (dx < 10 && dy < 10) {
          onFlip();
        }
      }}
      onPointerCancel={() => {
        pointerStart.current = null;
      }}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? "Lật thẻ" : undefined}
      onKeyDown={(event) => {
        if (!interactive) {
          return;
        }
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onFlip();
        }
      }}
    >
      {canSpeak && onSpeak ? (
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            onSpeak();
          }}
          aria-label="Phát âm"
          title="Phát âm"
          className={`absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 text-[var(--accent-soft)] transition-colors hover:bg-[var(--accent)]/25 ${
            isSpeaking ? "animate-pulse" : ""
          }`}
        >
          <SpeakerIcon />
        </button>
      ) : null}

      <div
        className={`flashcard-face rounded-2xl border border-white/10 ${
          flipped ? "flashcard-face-back" : ""
        }`}
      >
        <Face text={shown.text} lang={shown.lang} reading={shown.reading} />
      </div>
    </div>
  );
}
