import Link from "next/link";
import type { ReactNode } from "react";
import PageBackground from "@/src/components/shared/PageBackground";

interface LessonPageShellProps {
  title: string;
  subtitle?: string;
  backHref: string;
  backLabel: string;
  children: ReactNode;
}

export default function LessonPageShell({
  title,
  subtitle,
  backHref,
  backLabel,
  children,
}: LessonPageShellProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <PageBackground variant="simple" />

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-5xl flex-col px-4 py-6 sm:px-6 sm:py-8">
        <header className="mb-6">
          <Link
            href={backHref}
            className="mb-4 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-[var(--accent-soft)]"
          >
            {/* <span aria-hidden="true">←</span> */}
            {backLabel}
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 text-sm text-[var(--muted)]">{subtitle}</p>
          ) : null}
        </header>

        {children}
      </main>
    </div>
  );
}
