"use client";

import { useState } from "react";

interface N5AccordionItemProps {
  title: string;
  titleHtml?: string;
  compact?: boolean;
  dashed?: boolean;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export default function N5AccordionItem({
  title,
  titleHtml,
  compact = false,
  dashed = false,
  defaultOpen = false,
  children,
}: N5AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={`overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] ${
        dashed ? "border-dashed border-white/15" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-3 text-left transition-colors hover:bg-white/[0.03] ${
          compact ? "px-3 py-2.5" : "px-4 py-3"
        } ${open ? "bg-[var(--accent)]/8" : ""}`}
      >
        {titleHtml ? (
          <span
            className={`font-semibold text-white ${compact ? "text-sm" : "text-base"}`}
            dangerouslySetInnerHTML={{ __html: titleHtml }}
          />
        ) : (
          <span
            className={`font-semibold text-white ${compact ? "text-sm" : "text-base"}`}
          >
            {title}
          </span>
        )}
        <span className="shrink-0 text-sm text-[var(--muted)]">{open ? "−" : "+"}</span>
      </button>
      {open ? (
        <div
          className={`border-t border-white/8 ${compact ? "px-3 py-3" : "px-4 py-4"}`}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
