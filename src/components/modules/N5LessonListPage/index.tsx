import Link from "next/link";
import LessonPageShell from "@/components/shared/LessonPageShell";
import type { IN5LessonListItem } from "@/lib/n5Lesson";

interface N5LessonListPageProps {
  lessons: IN5LessonListItem[];
}

export default function N5LessonListPage({ lessons }: N5LessonListPageProps) {
  return (
    <LessonPageShell
      title="Minna no Nihongo N5"
      subtitle="25 bài học — chọn bài để xem các phần"
      backHref="/"
      backLabel="Về trang chủ"
    >
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
              href={`/n5/lessons/${lesson.index}`}
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
