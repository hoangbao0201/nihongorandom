"use client";

const SEGMENT_BUTTON_CLASS =
  "flex min-w-[5rem] cursor-pointer items-center justify-center gap-2 rounded-md px-3 py-2 text-center text-xs font-semibold tracking-wide outline-none transition-all duration-200";

interface FuriganaToggleProps {
  showFurigana: boolean;
  onShowFuriganaChange: (value: boolean) => void;
}

function FuriganaPreview({ visible }: { visible: boolean }) {
  if (visible) {
    return (
      <span className="font-jp inline-flex flex-col items-center leading-none">
        <span className="text-[9px] font-medium text-[var(--accent-soft)]">かん</span>
        <span className="text-sm">漢</span>
      </span>
    );
  }

  return <span className="font-jp text-sm leading-none">漢</span>;
}

export default function FuriganaToggle({
  showFurigana,
  onShowFuriganaChange,
}: FuriganaToggleProps) {
  return (
    <div className="glass-panel mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/6 bg-black/35 px-3 py-2.5 sm:px-4">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--accent-soft)]">
          Furigana
        </p>
        <p className="font-jp mt-0.5 text-xs text-white/45">ふりがな</p>
      </div>

      <div
        className="grid shrink-0 grid-cols-2 gap-1 rounded-lg border border-white/6 bg-black/35 p-1"
        role="group"
        aria-label="Hiển thị furigana"
      >
        <button
          type="button"
          aria-pressed={showFurigana}
          onClick={() => onShowFuriganaChange(true)}
          className={`${SEGMENT_BUTTON_CLASS} ${
            showFurigana
              ? "bg-[var(--accent)]/50 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
              : "text-white/45 hover:text-white/70"
          }`}
        >
          {/* <FuriganaPreview visible /> */}
          <span>Hiện</span>
        </button>
        <button
          type="button"
          aria-pressed={!showFurigana}
          onClick={() => onShowFuriganaChange(false)}
          className={`${SEGMENT_BUTTON_CLASS} ${
            !showFurigana
              ? "bg-[var(--accent)]/50 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
              : "text-white/45 hover:text-white/70"
          }`}
        >
          {/* <FuriganaPreview visible={false} /> */}
          <span>Ẩn</span>
        </button>
      </div>
    </div>
  );
}
