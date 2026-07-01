"use client";

import { useEffect } from "react";

export interface StudyShortcutHandlers {
  onReplay?: () => void;
  onShowAnswer?: () => void;
  onSkip?: () => void;
  onFlip?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export interface StudyShortcutOptions {
  replay?: boolean;
  showAnswer?: boolean;
  skip?: boolean;
  flip?: boolean;
  prev?: boolean;
  next?: boolean;
}

export function formatStudyShortcutHints(options: StudyShortcutOptions): string {
  const parts: string[] = [];

  if (options.flip) {
    parts.push("Space lật thẻ");
  }
  if (options.prev || options.next) {
    parts.push("← / → chuyển thẻ");
  }
  if (options.replay) {
    parts.push("Alt + A phát lại");
  }
  if (options.showAnswer) {
    parts.push("Alt + E xem đáp án");
  }
  if (options.skip) {
    parts.push("Alt + R bỏ qua");
  }

  return parts.join(" · ");
}

export function useStudyShortcuts(
  handlers: StudyShortcutHandlers,
  options: StudyShortcutOptions = {}
) {
  const { onReplay, onShowAnswer, onSkip, onFlip, onPrev, onNext } = handlers;
  const {
    replay = false,
    showAnswer = false,
    skip = false,
    flip = false,
    prev = false,
    next = false,
  } = options;

  useEffect(() => {
    const enabled = replay || showAnswer || skip || flip || prev || next;
    if (!enabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      const isFormField =
        tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA";

      if (
        !isFormField &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey
      ) {
        if ((event.key === " " || event.code === "Space") && flip && onFlip) {
          event.preventDefault();
          onFlip();
          return;
        }
        if (event.key === "ArrowLeft" && prev && onPrev) {
          event.preventDefault();
          onPrev();
          return;
        }
        if (event.key === "ArrowRight" && next && onNext) {
          event.preventDefault();
          onNext();
          return;
        }
      }

      if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }

      const key = event.key.toLowerCase();

      if (key === "a" && replay && onReplay) {
        event.preventDefault();
        onReplay();
        return;
      }

      if (key === "e" && showAnswer && onShowAnswer) {
        event.preventDefault();
        onShowAnswer();
        return;
      }

      if (key === "r" && skip && onSkip) {
        event.preventDefault();
        onSkip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    onReplay,
    onShowAnswer,
    onSkip,
    onFlip,
    onPrev,
    onNext,
    replay,
    showAnswer,
    skip,
    flip,
    prev,
    next,
  ]);
}
