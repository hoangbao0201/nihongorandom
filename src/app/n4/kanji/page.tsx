import type { Metadata } from "next";
import KanjiN5Page from "@/components/modules/KanjiN5Page";
import { getKanjiN4Rows } from "@/lib/kanjiN4";

export const metadata: Metadata = {
  title: "Kanji N4",
  description:
    "Bảng kanji N4 Minna no Nihongo (bài 26-50) - danh sách bộ kanji kèm âm Hán Việt và nghĩa tiếng Việt.",
  alternates: {
    canonical: "/n4/kanji",
  },
};

export default async function Page() {
  const rows = await getKanjiN4Rows();

  return (
    <KanjiN5Page
      rows={rows}
      title="Kanji N4"
      subtitle={`${rows.length} chữ - Minna no Nihongo N4 (bài 26-50)`}
      backHref="/n4/lessons"
      backLabel="Danh sách bài học"
    />
  );
}
