import KanjiCard from "@/components/shared/KanjiCard";
import type { KanjiItem } from "@/lib/kanjiTypes";

export default function KanjiList({ kanjis }: { kanjis: KanjiItem[] }) {
  return (
    <div className="grid gap-4">
      {kanjis.map((kanji) => (
        <KanjiCard key={`${kanji.index}-${kanji.character}`} kanji={kanji} />
      ))}
    </div>
  );
}
