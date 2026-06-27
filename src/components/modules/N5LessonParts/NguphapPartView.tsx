"use client";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useState } from "react";
import InteractiveLessonHtml from "@/src/components/shared/InteractiveLessonHtml";
import type { IN5TabSectionsData } from "@/src/lib/n5Types";
import {
  parseSlidesAtLevel,
  splitContentParts,
  type IN5ParsedSlide,
} from "@/src/lib/parseNguphapSlides";

const MAIN_TAB_CLASS =
  "w-full cursor-pointer rounded-md px-4 py-3 text-center text-sm font-bold tracking-wide text-white/45 outline-none transition-all duration-200 hover:text-white/70 data-selected:bg-[var(--accent)]/50 data-selected:text-white data-selected:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]";

function SlideContent({ html }: { html: string }) {
  const parts = splitContentParts(html);

  if (parts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {parts.map((part, index) =>
        part.kind === "html" ? (
          <InteractiveLessonHtml
            key={`html-${index}`}
            html={part.html}
            className="nguphap-content"
          />
        ) : (
          <SlideAccordionItem key={`slide-${index}`} slide={part.slide} compact />
        )
      )}
    </div>
  );
}

function SlideAccordionItem({
  slide,
  compact = false,
}: {
  slide: IN5ParsedSlide;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] ${
        slide.isAnswer ? "border-dashed border-white/15" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-3 text-left transition-colors hover:bg-white/[0.03] ${
          compact ? "px-3 py-2.5" : "px-4 py-3"
        } ${open ? "bg-[var(--accent)]/8" : ""}`}
      >
        <span
          className={`font-semibold text-white ${compact ? "text-sm" : "text-base"}`}
          dangerouslySetInnerHTML={{ __html: slide.titleHtml || slide.title }}
        />
        <span className="shrink-0 text-sm text-[var(--muted)]">{open ? "−" : "+"}</span>
      </button>
      {open ? (
        <div
          className={`border-t border-white/8 ${compact ? "px-3 py-3" : "px-4 py-4"}`}
        >
          <SlideContent html={slide.contentHtml} />
        </div>
      ) : null}
    </div>
  );
}

function NguphapTabPanel({ contentHtml }: { contentHtml: string }) {
  const slides = parseSlidesAtLevel(contentHtml).filter((slide) => !slide.isAnswer);

  if (slides.length === 0) {
    return (
      <InteractiveLessonHtml html={contentHtml} className="nguphap-content glass-panel rounded-lg p-4" />
    );
  }

  return (
    <div className="space-y-2">
      {slides.map((slide, index) => (
        <SlideAccordionItem key={`${slide.title}-${index}`} slide={slide} />
      ))}
    </div>
  );
}

export default function NguphapPartView({ data }: { data: IN5TabSectionsData }) {
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
            <NguphapTabPanel contentHtml={section.contentHtml} />
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}
