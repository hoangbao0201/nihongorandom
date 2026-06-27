"use client";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import AudioPlayButton from "@/src/components/shared/AudioPlayButton";
import InteractiveLessonHtml from "@/src/components/shared/InteractiveLessonHtml";
import N5AccordionItem from "@/src/components/modules/N5LessonParts/shared/N5AccordionItem";
import { parseSlidesAtLevel, splitContentParts } from "@/src/lib/parseNguphapSlides";
import type { IN5TabSectionsData } from "@/src/lib/n5Types";

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

function extractAudioUrls(html: string) {
  const urls: string[] = [];

  for (const match of html.matchAll(/<audio[^>]*src="([^"]+)"/gi)) {
    urls.push(resolveMediaUrl(match[1]));
  }

  for (const match of html.matchAll(/<source[^>]*src="([^"]+)"/gi)) {
    urls.push(resolveMediaUrl(match[1]));
  }

  return [...new Set(urls)];
}

function stripAudioMarkup(html: string) {
  return html
    .replace(/<div class="playwrap">[\s\S]*?<\/div>/gi, "")
    .replace(/<audio[\s\S]*?<\/audio>/gi, "")
    .trim();
}

function BaitapHtmlBlock({ html }: { html: string }) {
  const audioUrls = extractAudioUrls(html);
  const cleanedHtml = rewriteRelativeUrls(stripAudioMarkup(html));

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
        <InteractiveLessonHtml html={cleanedHtml} className="baitap-content" />
      ) : null}
    </div>
  );
}

function BaitapSlideContent({ html }: { html: string }) {
  const parts = splitContentParts(html);

  if (parts.length === 0) {
    return <BaitapHtmlBlock html={html} />;
  }

  return (
    <div className="space-y-3">
      {parts.map((part, index) =>
        part.kind === "html" ? (
          <BaitapHtmlBlock key={`html-${index}`} html={part.html} />
        ) : (
          <N5AccordionItem
            key={`slide-${index}`}
            title={part.slide.title}
            titleHtml={part.slide.titleHtml}
            compact
            dashed={part.slide.isAnswer}
          >
            <BaitapSlideContent html={part.slide.contentHtml} />
          </N5AccordionItem>
        )
      )}
    </div>
  );
}

function BaitapTabPanel({ contentHtml }: { contentHtml: string }) {
  const slides = parseSlidesAtLevel(contentHtml).filter((slide) => !slide.isAnswer);

  if (slides.length === 0) {
    return <BaitapHtmlBlock html={contentHtml} />;
  }

  return (
    <div className="space-y-2">
      {slides.map((slide, index) => (
        <N5AccordionItem
          key={`${slide.title}-${index}`}
          title={slide.title}
          titleHtml={slide.titleHtml}
        >
          <BaitapSlideContent html={slide.contentHtml} />
        </N5AccordionItem>
      ))}
    </div>
  );
}

export default function BaitapPartView({ data }: { data: IN5TabSectionsData }) {
  if (data.sections.length === 0) {
    return null;
  }

  return (
    <TabGroup>
      <TabList className="glass-panel mb-4 grid gap-1 rounded-lg border border-white/6 bg-black/35 p-1 sm:grid-cols-2">
        {data.sections.map((section) => (
          <Tab key={section.id} className={MAIN_TAB_CLASS}>
            {section.title || section.id}
          </Tab>
        ))}
      </TabList>

      <TabPanels>
        {data.sections.map((section) => (
          <TabPanel key={section.id} className="focus:outline-none">
            <BaitapTabPanel contentHtml={section.contentHtml} />
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}
