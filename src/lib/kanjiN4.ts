import {
  loadN4PartContent,
  N4_LESSON_FROM,
  N4_LESSON_TO,
} from "@/lib/n4Lesson";
import type { KanjiN5Row } from "@/lib/kanjiTypes";
import { isLuyenchuhanData } from "@/lib/n5Guards";

export type { KanjiItem, KanjiN5Row } from "@/lib/kanjiTypes";

export async function getKanjiN4Rows(): Promise<KanjiN5Row[]> {
  const rows: KanjiN5Row[] = [];
  const seen = new Set<string>();

  for (
    let lessonNumber = N4_LESSON_FROM;
    lessonNumber <= N4_LESSON_TO;
    lessonNumber++
  ) {
    const raw = await loadN4PartContent(lessonNumber, "luyenchuhan");
    const data = isLuyenchuhanData(raw) ? raw : null;
    if (!data?.kanjis?.length) {
      continue;
    }

    for (const kanji of data.kanjis) {
      const character = kanji.character?.trim();
      if (!character || seen.has(character)) {
        continue;
      }

      seen.add(character);
      rows.push({
        index: rows.length + 1,
        character,
        sinoVietnameseWord: kanji.sinoVietnameseWord?.trim() || "—",
        mean: kanji.mean?.trim() || "—",
      });
    }
  }

  return rows;
}
