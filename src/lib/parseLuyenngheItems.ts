export interface ILuyenngheItem {
  title: string;
  titleHtml: string;
  contentHtml: string;
}

export interface ILuyenngheTabContent {
  introHtml: string;
  items: ILuyenngheItem[];
}

const EXAMPLE_MARKER_RE = /<ruby>例<rp>/;
const SUB_ITEM_PATTERNS = [
  /<span[^>]*>([0-9０-９]+)\)<\/span>\s*<div class="playwrap"/g,
  /<strong>\s*<span>([0-9０-９]+)\)<\/span>\s*<\/strong>/g,
];

function findItemMarkers(html: string) {
  const markers: { index: number; label: string }[] = [];

  const exampleMatch = html.match(EXAMPLE_MARKER_RE);
  if (exampleMatch?.index !== undefined) {
    markers.push({ index: exampleMatch.index, label: "例" });
  }

  for (const pattern of SUB_ITEM_PATTERNS) {
    for (const match of html.matchAll(pattern)) {
      if (match.index === undefined) continue;
      markers.push({ index: match.index, label: `${match[1]})` });
    }
  }

  markers.sort((a, b) => a.index - b.index);

  return markers.filter(
    (marker, index) => index === 0 || marker.index !== markers[index - 1].index
  );
}

export function parseLuyenngheTabContent(contentHtml: string): ILuyenngheTabContent {
  const markers = findItemMarkers(contentHtml);

  if (markers.length === 0) {
    return { introHtml: contentHtml.trim(), items: [] };
  }

  const introHtml = contentHtml.slice(0, markers[0].index).trim();
  const items = markers.map((marker, index) => {
    const end = markers[index + 1]?.index ?? contentHtml.length;

    return {
      title: marker.label,
      titleHtml: marker.label,
      contentHtml: contentHtml.slice(marker.index, end).trim(),
    };
  });

  return { introHtml, items };
}

export function luyenngheSectionLabel(
  section: { id: string; title?: string | null; titleHtml?: string | null },
  index: number
) {
  if (section.title?.trim()) return section.title;
  if (section.titleHtml?.trim()) {
    return section.titleHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }

  const tabMatch = section.id.match(/^tab(\d+)$/);
  if (tabMatch) {
    return `Câu ${Number(tabMatch[1]) - 2}`;
  }

  return `Câu ${index + 1}`;
}
