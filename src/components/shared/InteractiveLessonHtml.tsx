"use client";

import { useEffect, useRef } from "react";
import HtmlContent from "@/components/shared/HtmlContent";

interface InteractiveLessonHtmlProps {
  html: string;
  className?: string;
}

export default function InteractiveLessonHtml({
  html,
  className = "",
}: InteractiveLessonHtmlProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const tudich = target?.closest(".tudich");
      if (!tudich || !root.contains(tudich)) return;
      if (!tudich.querySelector(".kqdich, .nddich")) return;

      event.preventDefault();
      tudich.classList.toggle("is-open");
    };

    root.addEventListener("click", handleClick);
    return () => root.removeEventListener("click", handleClick);
  }, [html]);

  return (
    <div ref={rootRef}>
      <HtmlContent html={html} className={className} />
    </div>
  );
}
