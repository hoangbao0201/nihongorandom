"use client";

import { useEffect } from "react";

export interface StudyShortcutHandlers {
  onReplay?: () => void;
  onShowAnswer?: () => void;
  onSkip?: () => void;
}

export interface StudyShortcutOptions {
  replay?: boolean;
  showAnswer?: boolean;
  skip?: boolean;
}

export function formatStudyShortcutHints(options: StudyShortcutOptions): string {
  const parts: string[] = [];

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
  const { onReplay, onShowAnswer, onSkip } = handlers;
  const { replay = false, showAnswer = false, skip = false } = options;

  useEffect(() => {
    const enabled = replay || showAnswer || skip;
    if (!enabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
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
  }, [onReplay, onShowAnswer, onSkip, replay, showAnswer, skip]);
}
