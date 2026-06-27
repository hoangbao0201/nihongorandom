import Link from "next/link";
import LessonPageShell from "@/src/components/shared/LessonPageShell";
import {
  getN5PartLabel,
  type IN5LessonPart,
} from "@/src/lib/n5Lesson";

interface N5LessonDetailPageProps {
  lessonNumber: number;
  parts: IN5LessonPart[];
}

export default function N5LessonDetailPage({
  lessonNumber,
  parts,
}: N5LessonDetailPageProps) {
  return (
    <LessonPageShell
      title={`Bài ${lessonNumber}`}
      subtitle={`${parts.length} phần — Minna no Nihongo N5`}
      backHref="/n5/lessons"
      backLabel="Danh sách bài học"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {parts.map((part, index) => (
            <Link
              key={part.id}
              href={`/n5/lessons/${lessonNumber}/${part.id}`}
              className="glass-panel group rounded-lg p-5 transition-all duration-200 hover:border-[var(--accent)]/40 hover:shadow-[0_8px_32px_rgba(249,67,0,0.12)]"
            >
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-soft)]">
              Phần {index + 1}
            </p>
            <h2 className="mt-2 text-lg font-bold text-white group-hover:text-[var(--accent-soft)]">
              {getN5PartLabel(part)}
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{part.label}</p>
            <span className="mt-4 inline-flex text-sm text-white/50 transition-colors group-hover:text-[var(--accent-soft)]">
              Xem nội dung
            </span>
          </Link>
        ))}
      </div>
    </LessonPageShell>
  );
}
