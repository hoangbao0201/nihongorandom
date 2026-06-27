import HtmlContent from "@/src/components/shared/HtmlContent";
import type { IN5HantuData } from "@/src/lib/n5Types";

export default function HantuPartView({ data }: { data: IN5HantuData }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full min-w-[640px] text-left">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.04] text-xs uppercase tracking-wide text-[var(--muted)]">
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Hán tự</th>
            <th className="px-4 py-3">Âm Hán</th>
            <th className="px-4 py-3">Cách đọc (Kana)</th>
          </tr>
        </thead>
        <tbody>
          {data.entries.map((entry) => (
            <tr
              key={entry.index}
              className="border-b border-white/6 hover:bg-white/[0.03]"
            >
              <td className="px-4 py-3 text-sm text-white/50">{entry.index}</td>
              <td className="px-4 py-3">
                <HtmlContent
                  html={entry.kanjiHtml || entry.kanji}
                  className="font-jp !text-lg !text-white"
                />
              </td>
              <td className="px-4 py-3 text-sm text-white/85">
                {entry.sinoVietnamese}
              </td>
              <td className="px-4 py-3">
                <HtmlContent
                  html={entry.kanaHtml || entry.kana}
                  className="font-jp !text-base !text-[var(--accent-soft)]"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
