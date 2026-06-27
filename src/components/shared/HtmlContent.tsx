interface HtmlContentProps {
  html: string;
  className?: string;
}

export default function HtmlContent({ html, className = "" }: HtmlContentProps) {
  if (!html?.trim()) {
    return null;
  }

  return (
    <div
      className={`lesson-html md:text-lg text-sm jp-ruby leading-relaxed text-white/80 [&_span]:text-inherit [&_strong]:text-white [&_table]:w-full [&_td]:border [&_td]:border-white/10 [&_td]:p-2 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
