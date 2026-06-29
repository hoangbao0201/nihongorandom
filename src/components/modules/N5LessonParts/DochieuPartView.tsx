"use client";

import { useMemo } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import InteractiveLessonHtml from "@/components/shared/InteractiveLessonHtml";
import N5AccordionItem from "@/components/modules/N5LessonParts/shared/N5AccordionItem";
import N5BlockRenderer from "@/components/modules/N5LessonParts/N5BlockRenderer";
import { splitContentParts } from "@/lib/parseNguphapSlides";
import type { IN5DochieuData, IN5DochieuSection } from "@/lib/n5Types";

const MAIN_TAB_CLASS =
  "w-full cursor-pointer rounded-md px-4 py-3 text-center text-sm font-bold tracking-wide text-white/45 outline-none transition-all duration-200 hover:text-white/70 data-selected:bg-[var(--accent)]/50 data-selected:text-white data-selected:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]";

const VNJP_BASE = "https://www.vnjpclub.com";

function resolveMediaUrl(src: string) {
  if (src.startsWith("http")) return src;
  return `${VNJP_BASE}${src.startsWith("/") ? src : `/${src}`}`;
}

function rewriteRelativeUrls(html: string) {
  return html.replace(/(src|href)="(\/[^"]+)"/gi, (_, attr, path) => {
    return `${attr}="${resolveMediaUrl(path)}"`;
  });
}

function stripLegacyToolbar(html: string) {
  return html
    .replace(/<div class="vnjp-minnasc-toolbar">[\s\S]*?<\/div>/gi, "")
    .replace(/<div class="playwrap">[\s\S]*?<\/div>/gi, "")
    .replace(/<audio[\s\S]*?<\/audio>/gi, "")
    .trim();
}

function tabListClass(count: number) {
  if (count >= 3) return "sm:grid-cols-3";
  if (count === 2) return "sm:grid-cols-2";
  return "sm:grid-cols-1";
}

function isVocabSection(section: IN5DochieuSection) {
  return section.id === "tab1" || section.title === "Từ vựng";
}

function DochieuHtmlBlock({ html }: { html: string }) {
  const cleanedHtml = rewriteRelativeUrls(stripLegacyToolbar(html));

  if (!cleanedHtml) {
    return null;
  }

  return (
    <InteractiveLessonHtml html={cleanedHtml} className="dochieu-content" />
  );
}

function DochieuReadingContent({ html }: { html: string }) {
  const parts = splitContentParts(html);

  if (parts.length === 0) {
    return <DochieuHtmlBlock html={html} />;
  }

  return (
    <div className="space-y-3">
      {parts.map((part, index) =>
        part.kind === "html" ? (
          <DochieuHtmlBlock key={`html-${index}`} html={part.html} />
        ) : (
          <N5AccordionItem
            key={`slide-${index}`}
            title={part.slide.title}
            titleHtml={part.slide.titleHtml}
            compact
            dashed={part.slide.isAnswer}
          >
            <DochieuReadingContent html={part.slide.contentHtml} />
          </N5AccordionItem>
        )
      )}
    </div>
  );
}

function DochieuSectionPanel({ section }: { section: IN5DochieuSection }) {
  if (section.contentHtml.trim()) {
    return <DochieuReadingContent html={section.contentHtml} />;
  }

  if (section.blocks?.length) {
    return <N5BlockRenderer blocks={section.blocks} />;
  }

  return null;
}

export default function DochieuPartView({ data }: { data: IN5DochieuData }) {
  const sections = useMemo(
    () => data.sections.filter((section) => !isVocabSection(section)),
    [data.sections]
  );

  if (sections.length === 0) {
    return null;
  }

  if (sections.length === 1) {
    return <DochieuSectionPanel section={sections[0]} />;
  }

  return (
    <TabGroup>
      <TabList
        className={`glass-panel mb-4 grid grid-cols-1 gap-1 rounded-lg border border-white/6 bg-black/35 p-1 ${tabListClass(sections.length)}`}
      >
        {sections.map((section) => (
          <Tab key={section.id} className={MAIN_TAB_CLASS}>
            {section.title || section.id}
          </Tab>
        ))}
      </TabList>

      <TabPanels>
        {sections.map((section) => (
          <TabPanel key={section.id} className="focus:outline-none">
            <DochieuSectionPanel section={section} />
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}
