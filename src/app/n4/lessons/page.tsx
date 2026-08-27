import type { Metadata } from "next";
import N5LessonListPage from "@/components/modules/N5LessonListPage";
import { getN4LessonList } from "@/lib/n4Lesson";

export const metadata: Metadata = {
  title: "Bài học N4",
  description:
    "Danh sách bài 26-50 Minna no Nihongo N4 - từ vựng, ngữ pháp, hội thoại và các phần luyện tập.",
  alternates: {
    canonical: "/n4/lessons",
  },
};

export default async function Page() {
  const lessons = await getN4LessonList();

  return (
    <N5LessonListPage
      lessons={lessons}
      levelCode="N4"
      title="Minna no Nihongo N4"
      subtitle="Bài 26-50 - chọn bài để xem các phần"
      basePath="/n4/lessons"
      kanjiHref="/n4/kanji"
      kanjiLabel="Bảng Kanji N4"
    />
  );
}
