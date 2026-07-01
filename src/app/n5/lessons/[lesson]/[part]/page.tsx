import type { Metadata } from "next";
import { notFound } from "next/navigation";
import N5PartPage from "@/components/modules/N5LessonParts/N5PartPage";
import {
  getN5PartLabel,
  getPartFromMenu,
  isN5PartId,
  loadN5LessonMenu,
  loadN5PartContent,
  N5_LESSON_COUNT,
} from "@/lib/n5Lesson";
import type { N5PartId } from "@/lib/n5Types";

interface PageProps {
  params: Promise<{ lesson: string; part: string }>;
}

export async function generateStaticParams() {
  const params: { lesson: string; part: string }[] = [];

  for (let lesson = 1; lesson <= N5_LESSON_COUNT; lesson++) {
    const menu = await loadN5LessonMenu(lesson);
    if (!menu) continue;

    for (const item of menu.data) {
      params.push({
        lesson: String(lesson),
        part: item.id,
      });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lesson, part } = await params;
  const lessonNumber = Number.parseInt(lesson, 10);
  const menuPart = Number.isFinite(lessonNumber)
    ? await getPartFromMenu(lessonNumber, part)
    : null;

  const title = menuPart ? getN5PartLabel(menuPart) : part;

  return {
    title: `Bài ${lesson} — ${title}`,
    alternates: {
      canonical: `/n5/lessons/${lesson}/${part}`,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { lesson, part } = await params;
  const lessonNumber = Number.parseInt(lesson, 10);

  if (
    !Number.isFinite(lessonNumber) ||
    lessonNumber < 1 ||
    lessonNumber > N5_LESSON_COUNT ||
    !isN5PartId(part)
  ) {
    notFound();
  }

  const menuPart = await getPartFromMenu(lessonNumber, part);
  if (!menuPart) {
    notFound();
  }

  const data = await loadN5PartContent(lessonNumber, part as N5PartId);
  if (!data) {
    notFound();
  }

  return (
    <N5PartPage
      lessonNumber={lessonNumber}
      partId={part as N5PartId}
      partLabel={getN5PartLabel(menuPart)}
      data={data}
    />
  );
}
