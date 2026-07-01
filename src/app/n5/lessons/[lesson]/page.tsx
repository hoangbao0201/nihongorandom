import type { Metadata } from "next";
import { notFound } from "next/navigation";
import N5LessonDetailPage from "@/components/modules/N5LessonDetailPage";
import {
  loadN5LessonMenu,
  N5_LESSON_COUNT,
} from "@/lib/n5Lesson";

interface PageProps {
  params: Promise<{ lesson: string }>;
}

export async function generateStaticParams() {
  return Array.from({ length: N5_LESSON_COUNT }, (_, offset) => ({
    lesson: String(offset + 1),
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lesson } = await params;
  const lessonNumber = Number.parseInt(lesson, 10);

  if (!Number.isFinite(lessonNumber) || lessonNumber < 1) {
    return { title: "Bài học N5" };
  }

  return {
    title: `Bài ${lessonNumber} - N5`,
    description: `Các phần học bài ${lessonNumber} Minna no Nihongo N5.`,
    alternates: {
      canonical: `/n5/lessons/${lessonNumber}`,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { lesson } = await params;
  const lessonNumber = Number.parseInt(lesson, 10);

  if (
    !Number.isFinite(lessonNumber) ||
    lessonNumber < 1 ||
    lessonNumber > N5_LESSON_COUNT
  ) {
    notFound();
  }

  const menu = await loadN5LessonMenu(lessonNumber);
  if (!menu?.data?.length) {
    notFound();
  }

  return (
    <N5LessonDetailPage lessonNumber={lessonNumber} parts={menu.data} />
  );
}
