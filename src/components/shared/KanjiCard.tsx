import HtmlContent from "@/src/components/shared/HtmlContent";
import type { KanjiItem } from "@/src/lib/kanjiTypes";

function hasMeaningfulHtml(html: string) {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  return text.length > 0;
}

export default function KanjiCard({ kanji }: { kanji: KanjiItem }) {
  const hasDescription = hasMeaningfulHtml(kanji.reminiscentDescription ?? "");
  const hasExamples = hasMeaningfulHtml(kanji.examples ?? "");

  return (
    <article className="kanji-card glass-panel overflow-hidden rounded-lg">
      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex shrink-0 flex-col items-center gap-4 sm:w-36">
            <p
              className="font-jp text-5xl font-bold leading-none text-white"
              lang="ja"
            >
              {kanji.character}
            </p>
            {kanji.reminiscentImageUrl ? (
              <div className="w-full rounded-lg border border-white/10 bg-white p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={kanji.reminiscentImageUrl}
                  alt={`Gợi nhớ chữ ${kanji.character}`}
                  className="mx-auto block h-28 w-full max-w-[7rem] object-contain"
                  loading="lazy"
                />
              </div>
            ) : null}
          </div>

          <div className="min-w-0 flex-1 space-y-2 text-sm">
            <p>
              <span className="text-[var(--muted)]">Âm Hán: </span>
              <span className="text-white/90">{kanji.sinoVietnameseWord}</span>
            </p>
            <p>
              <span className="text-[var(--muted)]">Nghĩa: </span>
              <span className="text-white/90">{kanji.mean}</span>
            </p>
            {kanji.kunReading ? (
              <p>
                <span className="text-[var(--muted)]">Kun: </span>
                <span className="font-jp text-[var(--accent-soft)]" lang="ja">
                  {kanji.kunReading}
                </span>
              </p>
            ) : null}
            {kanji.onReading ? (
              <p>
                <span className="text-[var(--muted)]">On: </span>
                <span className="font-jp text-[var(--accent-soft)]" lang="ja">
                  {kanji.onReading}
                </span>
              </p>
            ) : null}
          </div>
        </div>

        {hasDescription ? (
          <div className="mt-5 border-t border-white/8 pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Gợi nhớ
            </p>
            <HtmlContent
              html={kanji.reminiscentDescription ?? ""}
              className="!text-white/75"
            />
          </div>
        ) : null}
      </div>

      {hasExamples ? (
        <div className="border-t border-white/8 px-4 py-3 sm:px-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Ví dụ
          </p>
          <HtmlContent html={kanji.examples ?? ""} />
        </div>
      ) : null}
    </article>
  );
}
