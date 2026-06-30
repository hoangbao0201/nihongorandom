"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Luyện tập", match: (path: string) => path === "/" },
  {
    href: "/n5/lessons",
    label: "Bài học",
    match: (path: string) => path.startsWith("/n5/lessons"),
  },
  {
    href: "/n5/kanji",
    label: "Kanji N5",
    match: (path: string) => path.startsWith("/n5/kanji"),
  },
  {
    href: "/flashcards",
    label: "Flashcards",
    match: (path: string) => path.startsWith("/flashcards"),
  },
] as const;

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/6 bg-[rgba(12,15,20,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="shrink-0 transition-opacity hover:opacity-90"
          aria-label="Nihongo Random — về trang chủ"
        >
          <Image
          unoptimized
            src="/images/logo.png"
            alt="Nihongo Random"
            width={160}
            height={160}
            className="h-14 w-auto"
            priority
          />
        </Link>

        <nav
          aria-label="Điều hướng chính"
          className="flex items-center gap-1 sm:gap-1.5"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = item.match(pathname);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors sm:px-3 sm:text-sm ${
                  isActive
                    ? "bg-[var(--accent)]/20 text-[var(--accent-soft)]"
                    : "text-white/55 hover:bg-white/6 hover:text-white/85"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
