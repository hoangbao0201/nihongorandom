export interface ILuyendocItem {
  title: string;
  titleHtml: string;
  contentHtml: string;
}

export interface ILuyendocTabContent {
  introHtml: string;
  items: ILuyendocItem[];
}

const NUMBER_MARKER_RE = /<span[^>]*>([０-９0-9]+．)\s*<\/span>/g;
const TABLE_START_RE = /<table[^>]*class="table_ngang"/g;

function parseNumberedReadingItems(html: string): ILuyendocTabContent {
  const markers: { index: number; label: string }[] = [];

  for (const match of html.matchAll(NUMBER_MARKER_RE)) {
    if (match.index === undefined) continue;
    markers.push({ index: match.index, label: match[1] });
  }

  if (markers.length === 0) {
    return { introHtml: html.trim(), items: [] };
  }

  const introHtml = html.slice(0, markers[0].index).trim();
  const items = markers.map((marker, index) => {
    const end = markers[index + 1]?.index ?? html.length;
    return {
      title: marker.label,
      titleHtml: marker.label,
      contentHtml: html.slice(marker.index, end).trim(),
    };
  });

  return { introHtml, items };
}

function parseTableExerciseItems(html: string): ILuyendocTabContent {
  const tableStarts: number[] = [];

  for (const match of html.matchAll(TABLE_START_RE)) {
    if (match.index !== undefined) {
      tableStarts.push(match.index);
    }
  }

  if (tableStarts.length === 0) {
    return { introHtml: html.trim(), items: [] };
  }

  const introHtml =
    tableStarts[0] > 0 ? html.slice(0, tableStarts[0]).trim() : "";

  const items = tableStarts.map((start, index) => {
    const end = tableStarts[index + 1] ?? html.length;
    const chunk = html.slice(start, end).trim();
    const label =
      chunk.match(/>([０-９0-9]+．)</)?.[1] ?? `Bài ${index + 1}`;

    return {
      title: label,
      titleHtml: label,
      contentHtml: chunk,
    };
  });

  return { introHtml, items };
}

export function parseLuyendocTabContent(contentHtml: string): ILuyendocTabContent {
  if (contentHtml.includes('class="table_ngang"')) {
    return parseTableExerciseItems(contentHtml);
  }

  return parseNumberedReadingItems(contentHtml);
}
