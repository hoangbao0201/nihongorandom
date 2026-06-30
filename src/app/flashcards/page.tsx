import type { Metadata } from "next";
import Flashcards from "@/components/modules/Flashcards";

export const metadata: Metadata = {
  title: "Flashcards N5 — Từ vựng, Kanji, Bảng chữ cái",
  description:
    "Học Flashcard JLPT N5 Minna no Nihongo: từ vựng, Kanji, Hiragana/Katakana, số và thời gian. Lật thẻ, đánh dấu đã thuộc.",
};

export default function Page() {
  return <Flashcards />;
}
