import type { Metadata } from "next";
import HomePage from "@/src/components/modules/HomePage";

export const metadata: Metadata = {
  title: "Luyện Hiragana, Katakana & Từ vựng N5",
  description:
    "Ứng dụng web miễn phí luyện Hiragana, Katakana, từ vựng và Kanji N5 Minna no Nihongo.",
};

export default function Page() {
  return <HomePage />;
}
