"use client";

import { useState } from "react";
import AudioPlayButton from "@/components/shared/AudioPlayButton";
import DropdownTranslation from "@/components/shared/DropdownTranslation";
import HtmlContent from "@/components/shared/HtmlContent";
import InteractiveLessonHtml from "@/components/shared/InteractiveLessonHtml";
import type {
  IN5ContentBlock,
  IN5DialogueRow,
  IN5TudichBlock,
} from "@/lib/n5Types";

function TudichLine({ block }: { block: IN5TudichBlock }) {
  return (
    <DropdownTranslation
      original={block.japanese}
      originalHtml={block.japaneseHtml}
      translation={block.vietnamese}
      translationHtml={block.vietnameseHtml}
      size="md"
    />
  );
}

function DialogueBlock({ rows }: { rows: IN5DialogueRow[] }) {
  return (
    <div className="space-y-1">
      {rows.map((row, index) => (
        <div key={index} className="flex gap-3 sm:gap-4">
          {row.speaker ? (
            <div className="w-24 shrink-0 pt-2 text-xs font-semibold text-[var(--accent-soft)] sm:w-28">
              {row.speakerHtml ? (
                <HtmlContent html={row.speakerHtml} className="!text-xs" />
              ) : (
                row.speaker
              )}
            </div>
          ) : (
            <div className="w-24 shrink-0 sm:w-28" />
          )}
          <div className="min-w-0 flex-1 space-y-1">
            {row.lines.map((line, lineIndex) => (
              <TudichLine key={lineIndex} block={line} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SlideBlock({
  block,
}: {
  block: Extract<IN5ContentBlock, { kind: "slide" }>;
}) {
  const [open, setOpen] = useState(block.variant !== "collapsible");

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.02]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.03]"
      >
        <span className="font-semibold text-white">
          {block.titleHtml ? (
            <HtmlContent html={block.titleHtml} className="!inline !text-white" />
          ) : (
            block.title
          )}
        </span>
        <span className="text-sm text-[var(--muted)]">{open ? "−" : "+"}</span>
      </button>
      {open ? (
        <div className="space-y-3 border-t border-white/8 px-4 py-4">
          <N5BlockRenderer blocks={block.blocks} />
        </div>
      ) : null}
    </div>
  );
}

export default function N5BlockRenderer({
  blocks,
}: {
  blocks: IN5ContentBlock[];
}) {
  if (!blocks?.length) {
    return null;
  }

  return (
    <div className="space-y-3">
      {blocks.map((block, index) => {
        switch (block.kind) {
          case "tudich":
            return <TudichLine key={index} block={block} />;
          case "dialogue":
            return <DialogueBlock key={index} rows={block.rows} />;
          case "slide":
            return <SlideBlock key={index} block={block} />;
          case "audio":
            return (
              <div key={index} className="w-full">
                <AudioPlayButton src={block.url} variant="player" />
              </div>
            );
          case "image":
            return (
              <figure key={index} className="overflow-hidden rounded-lg">
                {block.linkUrl ? (
                  <a href={block.linkUrl} target="_blank" rel="noreferrer noopener">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={block.url}
                      alt=""
                      className="max-w-full rounded-lg border border-white/10"
                    />
                  </a>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={block.url}
                    alt=""
                    className="max-w-full rounded-lg border border-white/10"
                  />
                )}
              </figure>
            );
          case "heading":
            return (
              <div key={index}>
                {block.textHtml ? (
                  <HtmlContent html={block.textHtml} className="!text-lg !text-white" />
                ) : (
                  <h3 className="text-lg font-bold text-white">{block.text}</h3>
                )}
              </div>
            );
          case "table":
          case "html":
            return (
              <InteractiveLessonHtml
                key={index}
                html={block.contentHtml}
                className="glass-panel rounded-lg p-4"
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
