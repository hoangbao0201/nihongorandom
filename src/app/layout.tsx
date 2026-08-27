import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

import ProviderLayout from "../components/layouts/ProviderLayout";
import SiteFooter from "../components/layouts/SiteFooter";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-jp",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nihongo Random",
    template: "%s | Nihongo Random",
  },
  description:
    "Luyện Hiragana, Katakana, từ vựng và Kanji Minna no Nihongo N5 (bài 1-25) và N4 (bài 26-50).",
  verification: {
    google: "76ssyt9K2wjE9jPIux7RKLMczOSAN8_i92W5nJwwj7c",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansJP.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ProviderLayout>{children}</ProviderLayout>
        <SiteFooter />
      </body>
    </html>
  );
}
