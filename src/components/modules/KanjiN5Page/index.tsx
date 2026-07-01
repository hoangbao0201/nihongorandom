import LessonPageShell from "@/components/shared/LessonPageShell";
import type { KanjiN5Row } from "@/lib/kanjiN5";

interface KanjiN5PageProps {
  rows: KanjiN5Row[];
}

export default function KanjiN5Page({ rows }: KanjiN5PageProps) {
  return (
    <LessonPageShell
      title="Kanji N5"
      subtitle={`${rows.length} chữ - Minna no Nihongo N5`}
      backHref="/"
      backLabel="Về trang chủ"
    >
      <div className="glass-panel overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03] text-left text-xs font-semibold uppercase tracking-wide text-[var(--accent-soft)]">
                <th className="w-8 px-4 py-3">STT</th>
                <th className="w-20 px-4 py-3">Bộ</th>
                <th className="px-4 py-3">Tên bộ</th>
                <th className="px-4 py-3">Nghĩa</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.character}
                  className="border-b border-white/6 transition-colors hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3 text-white/40">{row.index}</td>
                  <td
                    className="px-4 py-3 font-jp text-2xl font-bold text-white"
                    lang="ja"
                  >
                    {row.character}
                  </td>
                  <td className="px-4 py-3 text-white">
                    {row.sinoVietnameseWord}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">{row.mean}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </LessonPageShell>
  );
}
