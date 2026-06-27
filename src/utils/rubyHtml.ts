export type TuvungSectionKind = "main" | "renshyuu" | "kaiwa" | "other";

export function getTuvungSectionKind(section: {
  key: string;
  label: string | null;
}): TuvungSectionKind {
  if (section.key === "main") {
    return "main";
  }
  if (section.label?.includes("れんしゅう")) {
    return "renshyuu";
  }
  if (section.label?.includes("かいわ")) {
    return "kaiwa";
  }
  return "other";
}

export function extractRubyReadings(html: string): string {
  return html.replace(/<ruby\b[^>]*>([\s\S]*?)<\/ruby>/gi, (_, inner: string) => {
    const rtMatch = inner.match(/<rt[^>]*>([\s\S]*?)<\/rt>/i);
    if (rtMatch) {
      return rtMatch[1];
    }

    return inner.replace(/<[^>]+>/g, "");
  });
}

export function extractRubyKanji(html: string): string {
  return html.replace(/<ruby\b[^>]*>([\s\S]*?)<\/ruby>/gi, (_, inner: string) => {
    const withoutRtRp = inner
      .replace(/<rp[\s\S]*?<\/rp>/gi, "")
      .replace(/<rt[\s\S]*?<\/rt>/gi, "");

    return withoutRtRp.replace(/<[^>]+>/g, "");
  });
}

export function htmlToPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildJapaneseDisplay(
  textHtml: string,
  sectionKind: TuvungSectionKind,
  useKanji: boolean
): string {
  const transformed = useKanji
    ? extractRubyKanji(textHtml)
    : extractRubyReadings(textHtml);

  let text = htmlToPlainText(transformed.replace(/<br\s*\/?>/gi, " "));

  if (!useKanji && sectionKind === "kaiwa") {
    text = text.replace(/\s+/g, "");
  }

  return text;
}
