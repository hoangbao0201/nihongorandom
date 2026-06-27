import DropdownTranslation from "@/src/components/shared/DropdownTranslation";
import HtmlContent from "@/src/components/shared/HtmlContent";
import type { IN5ThamkhaoData, IN5ThamkhaoRow } from "@/src/lib/n5Types";

function getRowCells(row: IN5ThamkhaoRow, columnCount: number) {
  if (row.cells?.length) {
    return row.cells;
  }

  if (columnCount === 3) {
    return [
      { text: row.country ?? "", html: row.countryHtml ?? row.country ?? "" },
      { text: row.person ?? "", html: row.personHtml ?? row.person ?? "" },
      { text: row.language ?? "", html: row.languageHtml ?? row.language ?? "" },
    ];
  }

  return [
    { text: row.term ?? "", html: row.termHtml ?? row.term ?? "" },
    { text: row.meaning ?? "", html: row.meaningHtml ?? row.meaning ?? "" },
  ];
}

export default function ThamkhaoPartView({ data }: { data: IN5ThamkhaoData }) {
  return (
    <div className="space-y-10">
      {data.sections.map((section, sectionIndex) => {
        const columnCount = section.columns.length || 2;
        const isTwoColumnMeaningTable = columnCount === 2;

        return (
          <section key={sectionIndex} className="space-y-4">
            <div>
              <HtmlContent
                html={section.titleHtml || section.title}
                className="!text-xl !font-bold !text-white"
              />
              {section.introHtml ? (
                <HtmlContent html={section.introHtml} className="mt-2" />
              ) : null}
            </div>

            {section.rows.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-white/10">
                <table className="w-full min-w-[640px] text-left">
                  {section.columns.length > 0 ? (
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.04] text-xs uppercase tracking-wide text-[var(--muted)]">
                        {section.columns
                          .filter((_, columnIndex) => !(isTwoColumnMeaningTable && columnIndex === 1))
                          .map((column) => (
                            <th key={column} className="px-4 py-3">
                              {column}
                            </th>
                          ))}
                      </tr>
                    </thead>
                  ) : null}
                  <tbody>
                    {section.rows.map((row, rowIndex) => {
                      const cells = getRowCells(row, columnCount);

                      if (isTwoColumnMeaningTable) {
                        return (
                          <tr
                            key={rowIndex}
                            className="border-b border-white/6 hover:bg-white/[0.03]"
                          >
                            <td className="px-4 py-3 align-top">
                              <DropdownTranslation
                                original={cells[0]?.text}
                                originalHtml={cells[0]?.html}
                                translation={cells[1]?.text}
                                translationHtml={cells[1]?.html}
                                size="sm"
                                className="!p-0"
                              />
                            </td>
                          </tr>
                        );
                      }

                      return (
                        <tr
                          key={rowIndex}
                          className="border-b border-white/6 hover:bg-white/[0.03]"
                        >
                          {cells.map((cell, cellIndex) => (
                            <td key={cellIndex} className="px-4 py-3 align-top">
                              <HtmlContent html={cell.html || cell.text} />
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {isTwoColumnMeaningTable ? (
                  <p className="border-t border-white/8 px-4 py-2 text-xs text-white/35">
                    Bấm vào mục để xem nghĩa tiếng Việt
                  </p>
                ) : null}
              </div>
            ) : section.contentHtml ? (
              <HtmlContent html={section.contentHtml} className="glass-panel rounded-lg p-4" />
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
