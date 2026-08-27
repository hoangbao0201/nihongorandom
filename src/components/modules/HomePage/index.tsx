"use client";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Link from "next/link";
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

const LEVEL_OPTIONS = [
  {
    href: "/n5/lessons",
    code: "N5",
    title: "Minna sơ cấp 1",
    detail: "Bài 1 – 25",
  },
  {
    href: "/n4/lessons",
    code: "N4",
    title: "Minna sơ cấp 2",
    detail: "Bài 26 – 50",
  },
] as const;

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
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Nihongo Random
          </h1>
          <p className="mt-1 text-xs text-white/35">
            Chọn cấp độ bài học Minna no Nihongo
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {LEVEL_OPTIONS.map((level) => (
            <Link
              key={level.href}
              href={level.href}
              className="glass-panel group rounded-xl border border-white/8 p-5 transition-all duration-200 hover:border-[var(--accent)]/45 hover:shadow-[0_10px_36px_rgba(249,67,0,0.14)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-soft)]">
                {level.code}
              </p>
              <p className="mt-2 text-lg font-bold text-white group-hover:text-[var(--accent-soft)]">
                {level.title}
              </p>
              <p className="mt-1 text-sm text-white/45">{level.detail}</p>
              <span className="mt-4 inline-flex text-sm text-white/50 transition-colors group-hover:text-[var(--accent-soft)]">
                Vào bài học →
              </span>
            </Link>
          ))}
        </div>

        <div className="mb-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
            Luyện phản xạ
          </p>
          <p className="mt-1 text-xs text-white/30">
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
      </main>
    </div>
  );
}
