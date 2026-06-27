import LessonPageShell from "@/src/components/shared/LessonPageShell";
import N5PartRenderer from "@/src/components/modules/N5LessonParts/N5PartRenderer";
import type { IN5PartData, N5PartId } from "@/src/lib/n5Types";

interface N5PartPageProps {
  lessonNumber: number;
  partId: N5PartId;
  partLabel: string;
  data: IN5PartData;
}

export default function N5PartPage({
  lessonNumber,
  partId,
  partLabel,
  data,
}: N5PartPageProps) {
  return (
    <LessonPageShell
      title={partLabel}
      subtitle={`Bài ${lessonNumber} — Minna no Nihongo N5`}
      backHref={`/n5/lessons/${lessonNumber}`}
      backLabel={`Về bài ${lessonNumber}`}
    >
      <N5PartRenderer partId={partId} data={data} />
    </LessonPageShell>
  );
}
