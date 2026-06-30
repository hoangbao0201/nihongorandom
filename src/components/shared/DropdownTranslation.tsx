"use client";

import { useState } from "react";
import HtmlContent from "@/components/shared/HtmlContent";

interface DropdownTranslationProps {
  original?: string;
  originalHtml?: string;
  translation?: string;
  translationHtml?: string;
  className?: string;
  originalClassName?: string;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASS = {
  sm: "n5-dropdown-trans--sm",
  md: "n5-dropdown-trans--md",
  lg: "n5-dropdown-trans--lg",
} as const;

export default function DropdownTranslation({
  original,
  originalHtml,
  translation,
  translationHtml,
  className = "",
  originalClassName = "",
  size = "md",
}: DropdownTranslationProps) {
  const [open, setOpen] = useState(false);
  const hasTranslation = Boolean(translation?.trim() || translationHtml?.trim());

  if (!hasTranslation) {
    return (
      <div className={`n5-dropdown-trans ${SIZE_CLASS[size]} ${className}`.trim()}>
        <div
          className={`jp-ruby n5-dropdown-trans__original font-jp ${originalClassName}`.trim()}
          lang="ja"
        >
          {originalHtml ? (
            <HtmlContent html={originalHtml} className="!text-inherit" />
          ) : (
            original
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`n5-dropdown-trans ${SIZE_CLASS[size]} ${open ? "is-open" : ""} ${className}`.trim()}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="n5-dropdown-trans__trigger"
      >
        <span
          className={`jp-ruby n5-dropdown-trans__original font-jp ${originalClassName}`.trim()}
          lang="ja"
        >
          {originalHtml ? (
            <HtmlContent html={originalHtml} className="!text-inherit" />
          ) : (
            original
          )}
        </span>
        <span className="n5-dropdown-trans__icon" aria-hidden>
          {open ? "▾" : "▸"}
        </span>
      </button>
      <div className="n5-dropdown-trans__panel">
        <div className="n5-dropdown-trans__panel-inner">
          {translationHtml ? (
            <HtmlContent html={translationHtml} className="!text-inherit" />
          ) : (
            translation
          )}
        </div>
      </div>
    </div>
  );
}
