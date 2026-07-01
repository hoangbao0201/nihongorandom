"use client";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import AudioPlayButton from "@/components/shared/AudioPlayButton";
import InteractiveLessonHtml from "@/components/shared/InteractiveLessonHtml";
import N5AccordionItem from "@/components/modules/N5LessonParts/shared/N5AccordionItem";
import { splitContentParts } from "@/lib/parseNguphapSlides";
import { parseLuyendocTabContent } from "@/lib/parseLuyendocItems";
import type { IN5TabSectionsData } from "@/lib/n5Types";

const MAIN_TAB_CLASS =
  "w-full cursor-pointer rounded-md px-4 py-3 text-center text-sm font-bold tracking-wide text-white/45 outline-none transition-all duration-200 hover:text-white/70 data-selected:bg-[var(--accent)]/50 data-selected:text-white data-selected:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]";

const VNJP_BASE = "https://www.vnjpclub.com";

function resolveAudioUrl(src: string) {
  if (src.startsWith("http")) return src;
  return `${VNJP_BASE}${src.startsWith("/") ? src : `/${src}`}`;
}

function extractAudioUrls(html: string) {
  const urls: string[] = [];

  for (const match of html.matchAll(/<audio[^>]*src="([^"]+)"/gi)) {
    urls.push(resolveAudioUrl(match[1]));
  }

  for (const match of html.matchAll(/<source[^>]*src="([^"]+)"/gi)) {
    urls.push(resolveAudioUrl(match[1]));
  }

  return [...new Set(urls)];
}

function stripAudioMarkup(html: string) {
  return html
    .replace(/<div class="playwrap">[\s\S]*?<\/div>/gi, "")
    .replace(/<audio[\s\S]*?<\/audio>/gi, "")
    .trim();
}

function tabListClass(count: number) {
  if (count >= 3) return "sm:grid-cols-3";
  if (count === 2) return "sm:grid-cols-2";
  return "sm:grid-cols-1";
}

function LuyendocHtmlBlock({ html }: { html: string }) {
  const audioUrls = extractAudioUrls(html);
  const cleanedHtml = stripAudioMarkup(html);

  if (!cleanedHtml && audioUrls.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {audioUrls.length > 0 ? (
        <div className="space-y-2">
          {audioUrls.map((url, index) => (
            <AudioPlayButton key={`${url}-${index}`} src={url} variant="player" />
          ))}
        </div>
      ) : null}
      {cleanedHtml ? (
        <InteractiveLessonHtml html={cleanedHtml} className="luyendoc-content" />
      ) : null}
    </div>
  );
}

function LuyendocItemContent({ html }: { html: string }) {
  const parts = splitContentParts(html);

  if (parts.length === 0) {
    return <LuyendocHtmlBlock html={html} />;
  }

  return (
    <div className="space-y-3">
      {parts.map((part, index) =>
        part.kind === "html" ? (
          <LuyendocHtmlBlock key={`html-${index}`} html={part.html} />
        ) : (
          <N5AccordionItem
            key={`slide-${index}`}
            title={part.slide.title}
            titleHtml={part.slide.titleHtml}
            compact
            dashed={part.slide.isAnswer}
          >
            <LuyendocItemContent html={part.slide.contentHtml} />
          </N5AccordionItem>
        )
      )}
    </div>
  );
}

function LuyendocTabPanel({ contentHtml }: { contentHtml: string }) {
  const { introHtml, items } = parseLuyendocTabContent(contentHtml);

  if (items.length === 0) {
    return <LuyendocHtmlBlock html={contentHtml} />;
  }

  return (
    <div className="space-y-4">
      {introHtml ? <LuyendocHtmlBlock html={introHtml} /> : null}

      <div className="space-y-2">
        {items.map((item, index) => (
          <N5AccordionItem
            key={`${item.title}-${index}`}
            title={item.title}
            titleHtml={item.titleHtml}
          >
            <LuyendocItemContent html={item.contentHtml} />
          </N5AccordionItem>
        ))}
      </div>
    </div>
  );
}

export default function LuyendocPartView({ data }: { data: IN5TabSectionsData }) {
  if (data.sections.length === 0) {
    return null;
  }

  return (
    <TabGroup>
      <TabList
        className={`glass-panel mb-4 grid grid-cols-1 gap-1 rounded-lg border border-white/6 bg-black/35 p-1 ${tabListClass(data.sections.length)}`}
      >
        {data.sections.map((section) => (
          <Tab key={section.id} className={MAIN_TAB_CLASS}>
            {section.title || section.id}
          </Tab>
        ))}
      </TabList>

      <TabPanels>
        {data.sections.map((section) => (
          <TabPanel key={section.id} className="focus:outline-none">
            <LuyendocTabPanel contentHtml={section.contentHtml} />
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}
