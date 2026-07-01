import type { Metadata } from "next";
import N5LessonListPage from "@/components/modules/N5LessonListPage";
import { getN5LessonList } from "@/lib/n5Lesson";

export const metadata: Metadata = {
  title: "Bài học N5",
  description:
    "Danh sách 25 bài Minna no Nihongo N5 - từ vựng, ngữ pháp, hội thoại và các phần luyện tập.",
  alternates: {
    canonical: "/n5/lessons",
  },
};

export default async function Page() {
  const lessons = await getN5LessonList();

  return <N5LessonListPage lessons={lessons} />;
}
