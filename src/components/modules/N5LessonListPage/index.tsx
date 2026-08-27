import Link from "next/link";
import LessonPageShell from "@/components/shared/LessonPageShell";
import type { IN5LessonListItem } from "@/lib/n5Lesson";

interface N5LessonListPageProps {
  lessons: IN5LessonListItem[];
  levelCode?: "N5" | "N4";
  title?: string;
  subtitle?: string;
  basePath?: string;
  kanjiHref?: string | null;
  kanjiLabel?: string;
}

export default function N5LessonListPage({
  lessons,
  levelCode = "N5",
  title = "Minna no Nihongo N5",
  subtitle = "25 bài học - chọn bài để xem các phần",
  basePath = "/n5/lessons",
  kanjiHref = "/n5/kanji",
  kanjiLabel = "Bảng Kanji N5",
}: N5LessonListPageProps) {
  return (
    <LessonPageShell
      title={title}
      subtitle={subtitle}
      backHref="/"
      backLabel="Về trang chủ"
    >
      {kanjiHref ? (
        <div className="mb-4">
          <Link
            href={kanjiHref}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            {kanjiLabel}
          </Link>
        </div>
      ) : null}

      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-8">
        {lessons.map((lesson) => {
          const cardClass = `glass-panel group rounded-lg p-4 transition-all duration-200 ${
            lesson.hasContent
              ? "hover:border-[var(--accent)]/40 hover:shadow-[0_8px_32px_rgba(249,67,0,0.12)]"
              : "opacity-40"
          }`;

          const cardBody = (
            <>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-soft)]">
                Bài {lesson.index}
              </p>
              <p className="mt-0.5 text-[10px] text-white/25">{levelCode}</p>
              {lesson.hasContent ? (
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {lesson.partCount} phần
                </p>
              ) : null}
            </>
          );

          if (!lesson.hasContent) {
            return (
              <div key={lesson.index} className={cardClass}>
                {cardBody}
              </div>
            );
          }

          return (
            <Link
              key={lesson.index}
              href={`${basePath}/${lesson.index}`}
              className={cardClass}
            >
              {cardBody}
            </Link>
          );
        })}
      </div>
    </LessonPageShell>
  );
}
