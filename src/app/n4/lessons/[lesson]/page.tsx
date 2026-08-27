import type { Metadata } from "next";
import { notFound } from "next/navigation";
import N5LessonDetailPage from "@/components/modules/N5LessonDetailPage";
import {
  isN4LessonNumber,
  loadN4LessonMenu,
  N4_LESSON_NUMBERS,
} from "@/lib/n4Lesson";

interface PageProps {
  params: Promise<{ lesson: string }>;
}

export async function generateStaticParams() {
  return N4_LESSON_NUMBERS.map((lesson) => ({
    lesson: String(lesson),
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lesson } = await params;
  const lessonNumber = Number.parseInt(lesson, 10);

  if (!Number.isFinite(lessonNumber) || lessonNumber < 1) {
    return { title: "Bài học N4" };
  }

  return {
    title: `Bài ${lessonNumber} - N4`,
    description: `Các phần học bài ${lessonNumber} Minna no Nihongo N4.`,
    alternates: {
      canonical: `/n4/lessons/${lessonNumber}`,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { lesson } = await params;
  const lessonNumber = Number.parseInt(lesson, 10);

  if (!isN4LessonNumber(lessonNumber)) {
    notFound();
  }

  const menu = await loadN4LessonMenu(lessonNumber);
  if (!menu?.data?.length) {
    notFound();
  }

  return (
    <N5LessonDetailPage
      lessonNumber={lessonNumber}
      parts={menu.data}
      levelCode="N4"
      basePath="/n4/lessons"
    />
  );
}
