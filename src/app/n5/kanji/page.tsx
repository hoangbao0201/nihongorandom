import type { Metadata } from "next";
import KanjiN5Page from "@/components/modules/KanjiN5Page";
import { getKanjiN5Rows } from "@/lib/kanjiN5";

export const metadata: Metadata = {
  title: "Kanji N5",
  description:
    "Bảng kanji N5 Minna no Nihongo - danh sách bộ kanji kèm âm Hán Việt và nghĩa tiếng Việt.",
  alternates: {
    canonical: "/n5/kanji",
  },
};

export default async function Page() {
  const rows = await getKanjiN5Rows();

  return <KanjiN5Page rows={rows} />;
}
