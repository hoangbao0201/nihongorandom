import type { Metadata } from "next";
import { notFound } from "next/navigation";
import N5PartPage from "@/components/modules/N5LessonParts/N5PartPage";
import {
  getN4PartFromMenu,
  getN4PartLabel,
  isN4LessonNumber,
  isN4PartId,
  loadN4LessonMenu,
  loadN4PartContent,
  N4_LESSON_NUMBERS,
} from "@/lib/n4Lesson";
import type { N5PartId } from "@/lib/n5Types";

interface PageProps {
  params: Promise<{ lesson: string; part: string }>;
}

export async function generateStaticParams() {
  const params: { lesson: string; part: string }[] = [];

  for (const lesson of N4_LESSON_NUMBERS) {
    const menu = await loadN4LessonMenu(lesson);
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
    ? await getN4PartFromMenu(lessonNumber, part)
    : null;

  const title = menuPart ? getN4PartLabel(menuPart) : part;

  return {
    title: `Bài ${lesson} - ${title}`,
    alternates: {
      canonical: `/n4/lessons/${lesson}/${part}`,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { lesson, part } = await params;
  const lessonNumber = Number.parseInt(lesson, 10);

  if (!isN4LessonNumber(lessonNumber) || !isN4PartId(part)) {
    notFound();
  }

  const menuPart = await getN4PartFromMenu(lessonNumber, part);
  if (!menuPart) {
    notFound();
  }

  const data = await loadN4PartContent(lessonNumber, part as N5PartId);
  if (!data) {
    notFound();
  }

  return (
    <N5PartPage
      lessonNumber={lessonNumber}
      partId={part as N5PartId}
      partLabel={getN4PartLabel(menuPart)}
      data={data}
      levelCode="N4"
      basePath="/n4/lessons"
    />
  );
}
