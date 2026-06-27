"use client";

interface ListeningPromptProps {
  onPlay: () => void;
  hint?: string;
  isPlaying?: boolean;
  isLoading?: boolean;
  shortcutHints?: string;
}

export default function ListeningPrompt({
  onPlay,
  hint = "Nghe và trả lời",
  isPlaying = false,
  isLoading = false,
  shortcutHints,
}: ListeningPromptProps) {
  const hintText = isLoading ? "Đang khởi tạo âm thanh..." : hint;

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={onPlay}
        disabled={isLoading}
        aria-label={isLoading ? "Đang khởi tạo âm thanh" : "Phát âm thanh"}
        aria-busy={isLoading}
        className="group relative flex h-28 w-28 items-center justify-center rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 transition-all duration-200 hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/20 disabled:cursor-wait disabled:opacity-70 sm:h-32 sm:w-32"
      >
        <span className="pointer-events-none absolute inset-0 rounded-full bg-[var(--accent)]/20 blur-xl transition-opacity group-hover:opacity-80 group-disabled:opacity-50" />
        {isLoading ? (
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="relative h-10 w-10 animate-spin text-[var(--accent-soft)]"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={`relative h-12 w-12 text-[var(--accent-soft)] transition-transform duration-200 group-hover:scale-110 ${
              isPlaying ? "animate-pulse" : ""
            }`}
            fill="currentColor"
          >
            <path d="M3 10v4h4l5 5V5L7 10H3zm13.5 2c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z" />
          </svg>
        )}
      </button>
      <p className="text-sm text-[var(--muted)]">{hintText}</p>
      {shortcutHints ? (
        <p className="text-xs text-white/25">{shortcutHints}</p>
      ) : null}
    </div>
  );
}
