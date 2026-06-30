import KanjiList from "@/components/shared/KanjiList";
import type { IN5LuyenchuhanData } from "@/lib/n5Types";

export default function LuyenchuhanPartView({
  data,
}: {
  data: IN5LuyenchuhanData;
}) {
  const kanjis = data.kanjis ?? [];

  if (kanjis.length === 0) {
    return null;
  }

  return <KanjiList kanjis={kanjis} />;
}
