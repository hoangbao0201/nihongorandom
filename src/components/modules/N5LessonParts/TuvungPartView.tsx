import AudioPlayButton from "@/src/components/shared/AudioPlayButton";
import HtmlContent from "@/src/components/shared/HtmlContent";
import type {
  IN5TuvungData,
  IN5TuvungEntry,
  IN5TuvungItem,
  IN5TuvungPhrase,
} from "@/src/lib/n5Types";

function EntryRow({ item }: { item: IN5TuvungEntry }) {
  return (
    <tr className="border-b border-white/6 hover:bg-white/[0.03]">
      <td className="px-3 py-3 text-center text-sm text-white/50">{item.index}</td>
      <td className="px-3 py-3">
        <p className="font-jp text-base text-white" lang="ja">
          {item.word}
        </p>
      </td>
      <td className="px-3 py-3">
        {item.kanji ? (
          <div className="jp-ruby font-jp text-base text-[var(--accent-soft)]" lang="ja">
            <HtmlContent
              html={item.kanjiHtml || item.kanji}
              className="!text-[var(--accent-soft)]"
            />
          </div>
        ) : (
          <span className="text-white/25">—</span>
        )}
      </td>
      <td className="px-3 py-3 text-sm text-white/80">{item.sinoVietnamese || "—"}</td>
      <td className="px-3 py-3">
        {item.audio ? (
          <AudioPlayButton src={item.audio} variant="button" />
        ) : (
          <span className="text-white/25">—</span>
        )}
      </td>
      <td className="px-3 py-3 text-sm text-white/90">{item.meaning || "—"}</td>
    </tr>
  );
}

function PhraseRow({ item }: { item: IN5TuvungPhrase }) {
  return (
    <tr className="border-b border-white/6 hover:bg-white/[0.03]">
      <td className="px-3 py-3 text-center text-sm text-white/50">{item.index}</td>
      <td className="px-3 py-3">
        <div className="jp-ruby font-jp text-base text-white" lang="ja">
          <HtmlContent html={item.textHtml || item.text} className="!text-white" />
        </div>
      </td>
      <td className="px-3 py-3 text-white/25">—</td>
      <td className="px-3 py-3 text-white/25">—</td>
      <td className="px-3 py-3">
        {item.audio ? (
          <AudioPlayButton src={item.audio} variant="button" />
        ) : (
          <span className="text-white/25">—</span>
        )}
      </td>
      <td className="px-3 py-3 text-sm text-white/90">{item.meaning || "—"}</td>
    </tr>
  );
}

function TuvungTable({ items }: { items: IN5TuvungItem[] }) {
  const rows = items.filter(
    (item) => item.kind === "entry" || item.kind === "phrase"
  );

  if (rows.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full min-w-[760px] text-left">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.04] text-xs uppercase tracking-wide text-[var(--muted)]">
            <th className="px-3 py-3">#</th>
            <th className="px-3 py-3">Từ vựng</th>
            <th className="px-3 py-3">Hán tự</th>
            <th className="px-3 py-3">Âm Hán</th>
            <th className="px-3 py-3">Phát âm</th>
            <th className="px-3 py-3">Dịch</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) =>
            item.kind === "entry" ? (
              <EntryRow key={item.index} item={item} />
            ) : (
              <PhraseRow key={item.index} item={item} />
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function TuvungPartView({ data }: { data: IN5TuvungData }) {
  return (
    <div className="space-y-8">
      {data.sections.map((section) => (
        <section key={section.key} className="space-y-4">
          {section.labelHtml || section.label ? (
            <div className="border-b border-white/10 pb-2">
              {section.labelHtml ? (
                <HtmlContent html={section.labelHtml} className="!text-lg !text-white" />
              ) : (
                <h2 className="text-lg font-bold text-white">{section.label}</h2>
              )}
            </div>
          ) : null}
          <TuvungTable items={section.items} />
        </section>
      ))}
    </div>
  );
}
