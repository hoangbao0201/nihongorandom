"use client";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import PageBackground from "@/components/shared/PageBackground";
import {
  FLASHCARD_TABS,
  FLASHCARD_TAB_CLASS,
  FlashcardTabId,
} from "@/components/modules/Flashcards/flashcardConstants";
import LessonFlashcardView from "@/components/modules/Flashcards/LessonFlashcardView";
import KanaFlashcardView from "@/components/modules/Flashcards/KanaFlashcardView";
import GeneratedFlashcardView from "@/components/modules/Flashcards/GeneratedFlashcardView";

export default function Flashcards() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <PageBackground />

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-5xl flex-col px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-5 text-center">
          <h1 className="text-lg font-bold text-white">Flashcards N5</h1>
          <p className="mt-1 text-xs text-white/30">
            Lật thẻ để ôn — đánh dấu thẻ đã thuộc
          </p>
        </div>

        <TabGroup>
          <TabList className="glass-panel mb-3 grid grid-cols-3 gap-1 rounded-lg border border-white/6 bg-black/35 p-1 sm:grid-cols-5">
            {FLASHCARD_TABS.map((tab) => (
              <Tab key={tab.id} className={FLASHCARD_TAB_CLASS}>
                {tab.label}
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            {FLASHCARD_TABS.map((tab) => (
              <TabPanel key={tab.id} className="focus:outline-none">
                {tab.id === FlashcardTabId.vocabulary ? (
                  <LessonFlashcardView contentType="vocabulary" />
                ) : tab.id === FlashcardTabId.kanji ? (
                  <LessonFlashcardView contentType="kanji" />
                ) : tab.id === FlashcardTabId.kana ? (
                  <KanaFlashcardView />
                ) : tab.id === FlashcardTabId.number ? (
                  <GeneratedFlashcardView mode="number" />
                ) : (
                  <GeneratedFlashcardView mode="time" />
                )}
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>

        <div className="py-2 text-center text-xs text-white/20">
          @hoangbao0201
        </div>
      </main>
    </div>
  );
}
