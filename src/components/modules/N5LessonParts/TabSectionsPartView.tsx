import HtmlContent from "@/src/components/shared/HtmlContent";
import InteractiveLessonHtml from "@/src/components/shared/InteractiveLessonHtml";
import type { IN5TabSection } from "@/src/lib/n5Types";
import N5BlockRenderer from "@/src/components/modules/N5LessonParts/N5BlockRenderer";

interface TabSectionsPartViewProps {
  sections: IN5TabSection[];
}

export default function TabSectionsPartView({
  sections,
}: TabSectionsPartViewProps) {
  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <section key={section.id} className="space-y-4">
          {section.titleHtml || section.title ? (
            <div className="border-b border-white/10 pb-3">
              {section.titleHtml ? (
                <HtmlContent
                  html={section.titleHtml}
                  className="!text-xl !font-bold !text-white"
                />
              ) : (
                <h2 className="text-xl font-bold text-white">{section.title}</h2>
              )}
            </div>
          ) : null}

          {section.blocks?.length ? (
            <>
              <p className="text-xs text-white/35">
                Bấm vào câu tiếng Nhật để xem bản dịch
              </p>
              <N5BlockRenderer blocks={section.blocks} />
            </>
          ) : section.contentHtml ? (
            <InteractiveLessonHtml
              html={section.contentHtml}
              className="glass-panel rounded-lg p-4"
            />
          ) : null}
        </section>
      ))}
    </div>
  );
}
