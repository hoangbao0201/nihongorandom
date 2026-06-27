import KanjiCard from "@/src/components/shared/KanjiCard";
import type { KanjiItem } from "@/src/lib/kanjiTypes";

export default function KanjiList({ kanjis }: { kanjis: KanjiItem[] }) {
  return (
    <div className="grid gap-4">
      {kanjis.map((kanji) => (
        <KanjiCard key={`${kanji.index}-${kanji.character}`} kanji={kanji} />
      ))}
    </div>
  );
}
