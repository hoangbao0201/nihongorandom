"use client";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import KanaStudyView from "@/src/components/modules/HomePage/KanaStudyView";
import LessonQuizStudyView from "@/src/components/modules/HomePage/LessonQuizStudyView";
import NumberListeningStudyView from "@/src/components/modules/HomePage/NumberListeningStudyView";
import TimeListeningStudyView from "@/src/components/modules/HomePage/TimeListeningStudyView";
import PageBackground from "@/src/components/shared/PageBackground";
import { useConfetti } from "@/src/hooks/useConfetti";

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
  "w-full cursor-pointer rounded-md px-4 py-2.5 text-center text-sm font-bold tracking-wide text-white/45 outline-none transition-all duration-200 hover:text-white/70 data-selected:bg-[var(--accent)]/50 data-selected:text-white data-selected:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]";

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

      <main className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8 sm:px-6 sm:py-10">
        <header className="mb-5 text-center">
          <h1 className="text-xl font-extrabold uppercase tracking-tight">
            <span className="bg-linear-to-r from-[#fe9842] via-[#f94300] to-[#ff5e7e] bg-clip-text text-transparent">
              NIHONGO RANDOM V2
            </span>
          </h1>
          <p className="mt-2 text-xs text-white/30">
            Số câu đã luyện tập: {countCorrect.toLocaleString("vi-VN")}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/n5/lessons"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-4 py-2 text-sm font-semibold text-[var(--accent-soft)] transition-colors hover:bg-[var(--accent)]/20 hover:text-white"
            >
              Danh sách 25 bài học
            </Link>
            <Link
              href="/n5/kanji"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              Bảng Kanji N5
            </Link>
          </div>
        </header>

        <TabGroup>
          <TabList className="glass-panel mb-3 grid grid-cols-2 gap-1 rounded-lg border border-white/6 bg-black/35 p-1">
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
