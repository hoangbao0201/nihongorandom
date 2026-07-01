"use client";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useEffect, useState } from "react";
import KanaStudyView from "@/components/modules/HomePage/KanaStudyView";
import LessonQuizStudyView from "@/components/modules/HomePage/LessonQuizStudyView";
import NumberListeningStudyView from "@/components/modules/HomePage/NumberListeningStudyView";
import TimeListeningStudyView from "@/components/modules/HomePage/TimeListeningStudyView";
import PageBackground from "@/components/shared/PageBackground";
import { useConfetti } from "@/hooks/useConfetti";

enum HomeModeEnum {
  read = "read",
  listen = "listen",
}

enum HomeTabEnum {
  kana = "kana",
  vocabulary = "vocabulary",
  kanji = "kanji",
  number = "number",
  time = "time",
}

const HOME_MODES = [
  { id: HomeModeEnum.read, label: "Phản xạ đọc" },
  { id: HomeModeEnum.listen, label: "Phản xạ nghe" },
] as const;

const READING_TABS = [
  { id: HomeTabEnum.kana, label: "Bảng chữ cái" },
  { id: HomeTabEnum.vocabulary, label: "Từ vựng" },
  { id: HomeTabEnum.kanji, label: "Kanji" },
] as const;

const LISTENING_TABS = [
  { id: HomeTabEnum.vocabulary, label: "Từ vựng" },
  { id: HomeTabEnum.number, label: "Số" },
  { id: HomeTabEnum.time, label: "Thời gian" },
] as const;

const MODE_TAB_CLASS =
  "w-full cursor-pointer rounded-md px-3 py-2 text-center text-xs font-bold tracking-wide text-white/45 outline-none transition-all duration-200 hover:text-white/70 data-selected:bg-[var(--accent)]/50 data-selected:text-white data-selected:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]";

const TAB_CLASS =
  "w-full cursor-pointer rounded-md px-3 py-2 text-center text-xs font-semibold tracking-wide text-white/45 outline-none transition-all duration-200 hover:text-white/70 data-selected:bg-white/12 data-selected:text-white data-selected:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]";

export default function HomePage() {
  const { canvasRef, fireConfetti } = useConfetti();
  const [countCorrect, setCountCorrect] = useState(0);

  const handleCorrectAnswer = () => {
    fireConfetti();
    setCountCorrect((count) => {
      const nextCount = count + 1;
      localStorage.setItem("countCorrect", nextCount.toString());
      return nextCount;
    });
  };

  useEffect(() => {
    const stored = localStorage.getItem("countCorrect");
    if (stored) {
      setCountCorrect(Number.parseInt(stored, 10));
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      />

      <PageBackground />

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-5xl flex-col px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-5 text-center">
          <p className="text-xs text-white/30">
            Số câu đã luyện tập: {countCorrect.toLocaleString("vi-VN")}
          </p>
        </div>

        <TabGroup>
          <TabList className="glass-panel mb-2 grid grid-cols-2 gap-1 rounded-lg border border-white/6 bg-black/35 p-1">
            {HOME_MODES.map((mode) => (
              <Tab key={mode.id} className={MODE_TAB_CLASS}>
                {mode.label}
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            <TabPanel className="focus:outline-none">
              <TabGroup>
                <TabList className="glass-panel mb-2 grid grid-cols-3 gap-1 rounded-lg border border-white/6 bg-black/35 p-1">
                  {READING_TABS.map((tab) => (
                    <Tab key={tab.id} className={TAB_CLASS}>
                      {tab.label}
                    </Tab>
                  ))}
                </TabList>

                <TabPanels>
                  <TabPanel className="focus:outline-none">
                    <KanaStudyView onCorrect={handleCorrectAnswer} />
                  </TabPanel>
                  <TabPanel className="focus:outline-none">
                    <LessonQuizStudyView
                      contentType="vocabulary"
                      mode="read"
                      onCorrect={handleCorrectAnswer}
                    />
                  </TabPanel>
                  <TabPanel className="focus:outline-none">
                    <LessonQuizStudyView
                      contentType="kanji"
                      mode="read"
                      onCorrect={handleCorrectAnswer}
                    />
                  </TabPanel>
                </TabPanels>
              </TabGroup>
            </TabPanel>

            <TabPanel className="focus:outline-none">
              <TabGroup>
                <TabList className="glass-panel mb-2 grid grid-cols-3 gap-1 rounded-lg border border-white/6 bg-black/35 p-1">
                  {LISTENING_TABS.map((tab) => (
                    <Tab key={tab.id} className={TAB_CLASS}>
                      {tab.label}
                    </Tab>
                  ))}
                </TabList>

                <TabPanels>
                  <TabPanel className="focus:outline-none">
                    <LessonQuizStudyView
                      contentType="vocabulary"
                      mode="listen"
                      onCorrect={handleCorrectAnswer}
                    />
                  </TabPanel>
                  <TabPanel className="focus:outline-none">
                    <NumberListeningStudyView onCorrect={handleCorrectAnswer} />
                  </TabPanel>
                  <TabPanel className="focus:outline-none">
                    <TimeListeningStudyView onCorrect={handleCorrectAnswer} />
                  </TabPanel>
                </TabPanels>
              </TabGroup>
            </TabPanel>
          </TabPanels>
        </TabGroup>

        <div className="py-2 text-center text-xs text-white/20">
          @hoangbao0201
        </div>
      </main>
    </div>
  );
}
