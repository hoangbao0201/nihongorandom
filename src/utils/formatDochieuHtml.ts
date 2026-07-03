const SENTENCE_CLASS = "dochieu-sentence";

function countTags(html: string, tag: string) {
  return (html.match(new RegExp(`<${tag}\\b`, "gi")) ?? []).length;
}

function countClosingTags(html: string, tag: string) {
  return (html.match(new RegExp(`</${tag}>`, "gi")) ?? []).length;
}

export function sanitizeDochieuFragment(html: string): string {
  if (!html?.trim()) {
    return "";
  }

  let cleaned = html
    .replace(/<!--END-->/gi, "")
    .replace(
      new RegExp(`<p class="${SENTENCE_CLASS}">(<(?:div|table|h[1-6])\\b[\\s\\S]*?)<\\/p>`, "gi"),
      "$1"
    )
    .replace(/<p class="dochieu-sentence">\s*<\/p>/gi, "")
    .trim();

  while (countClosingTags(cleaned, "div") > countTags(cleaned, "div")) {
    const next = cleaned.replace(/<\/div>\s*$/i, "").trim();
    if (next === cleaned) {
      break;
    }
    cleaned = next;
  }

  while (/^\s*<\/div>/i.test(cleaned)) {
    cleaned = cleaned.replace(/^\s*<\/div>/i, "").trim();
  }

  return cleaned;
}
