export interface IN5ParsedSlide {
  title: string;
  titleHtml: string;
  isAnswer: boolean;
  contentHtml: string;
  nestedSlides: IN5ParsedSlide[];
}

function stripHtml(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findSlideEnd(html: string, startIdx: number) {
  let depth = 0;
  let pos = startIdx;

  while (pos < html.length) {
    const nextOpen = html.indexOf("<div", pos);
    const nextClose = html.indexOf("</div>", pos);

    if (nextClose === -1) {
      return html.length;
    }

    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth += 1;
      pos = nextOpen + 4;
    } else {
      depth -= 1;
      pos = nextClose + 6;
      if (depth === 0) {
        return pos;
      }
    }
  }

  return html.length;
}

function parseSlideBlock(block: string): IN5ParsedSlide | null {
  const titleMatch = block.match(
    /<div class="slide-title([^"]*)">\s*<span>([\s\S]*?)<\/span>/
  );
  if (!titleMatch) return null;

  const isAnswer = Boolean(titleMatch[1]?.includes("sl2"));
  const titleHtml = titleMatch[2]?.trim() ?? "";
  const title = stripHtml(titleHtml);

  const contentOpen = block.search(/<div class="slide-content/);
  if (contentOpen === -1) {
    return {
      title,
      titleHtml,
      isAnswer,
      contentHtml: "",
      nestedSlides: [],
    };
  }

  const contentStart = block.indexOf(">", contentOpen) + 1;
  const rawContent = block.slice(contentStart).replace(/<\/div>\s*<\/div>\s*$/, "").trim();
  const nestedSlides = parseSlidesAtLevel(rawContent);

  return {
    title,
    titleHtml,
    isAnswer,
    contentHtml: rawContent,
    nestedSlides,
  };
}

export function parseSlidesAtLevel(html: string): IN5ParsedSlide[] {
  const slides: IN5ParsedSlide[] = [];
  let pos = 0;

  while (pos < html.length) {
    const start = html.indexOf('<div class="slide">', pos);
    if (start === -1) break;

    const end = findSlideEnd(html, start);
    const block = html.slice(start, end);
    const slide = parseSlideBlock(block);

    if (slide) {
      slides.push(slide);
    }

    pos = end;
  }

  return slides;
}

export type IN5SlideContentPart =
  | { kind: "html"; html: string }
  | { kind: "slide"; slide: IN5ParsedSlide };

export function splitContentParts(html: string): IN5SlideContentPart[] {
  const parts: IN5SlideContentPart[] = [];
  let pos = 0;

  while (pos < html.length) {
    const start = html.indexOf('<div class="slide">', pos);
    if (start === -1) {
      const tail = html.slice(pos).trim();
      if (tail) {
        parts.push({ kind: "html", html: tail });
      }
      break;
    }

    if (start > pos) {
      const chunk = html.slice(pos, start).trim();
      if (chunk) {
        parts.push({ kind: "html", html: chunk });
      }
    }

    const end = findSlideEnd(html, start);
    const block = html.slice(start, end);
    const slide = parseSlideBlock(block);
    if (slide) {
      parts.push({ kind: "slide", slide });
    }
    pos = end;
  }

  return parts;
}
