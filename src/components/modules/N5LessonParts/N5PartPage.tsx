import LessonPageShell from "@/components/shared/LessonPageShell";
import N5PartRenderer from "@/components/modules/N5LessonParts/N5PartRenderer";
import type { IN5PartData, N5PartId } from "@/lib/n5Types";

interface N5PartPageProps {
  lessonNumber: number;
  partId: N5PartId;
  partLabel: string;
  data: IN5PartData;
  levelCode?: "N5" | "N4";
  basePath?: string;
}

export default function N5PartPage({
  lessonNumber,
  partId,
  partLabel,
  data,
  levelCode = "N5",
  basePath = "/n5/lessons",
}: N5PartPageProps) {
  return (
    <LessonPageShell
      title={partLabel}
      subtitle={`Bài ${lessonNumber} - Minna no Nihongo ${levelCode}`}
      backHref={`${basePath}/${lessonNumber}`}
      backLabel={`Về bài ${lessonNumber}`}
    >
      <N5PartRenderer partId={partId} data={data} />
    </LessonPageShell>
  );
}
