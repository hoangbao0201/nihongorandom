import type { Metadata } from "next";
import HomePage from "@/components/modules/HomePage";

export const metadata: Metadata = {
  title: "Minna N5 & N4 - Luyện Hiragana, Katakana & Từ vựng",
  description:
    "Ứng dụng web miễn phí học Minna no Nihongo N5 (bài 1-25) và N4 (bài 26-50), luyện Hiragana, Katakana, từ vựng và Kanji.",
};

export default function Page() {
  return <HomePage />;
}
