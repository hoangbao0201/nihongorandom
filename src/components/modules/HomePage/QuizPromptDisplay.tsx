import {
  getQuizPromptSizing,
  quizPromptStyleVars,
} from "@/utils/quizPromptSizing";
import type { LessonQuizQuestion } from "@/utils/lessonQuiz";

export default function QuizPromptDisplay({
  question,
}: {
  question: LessonQuizQuestion;
}) {
  const sizing = getQuizPromptSizing(question);
  const style = quizPromptStyleVars(sizing);
  const isJapanese = question.promptLang === "ja";

  if (question.contentType === "kanji") {
    return (
      <div
        className={`quiz-prompt group ${question.promptHoverText ? "cursor-default" : ""}`}
        style={style}
      >
        <div className="quiz-prompt__ruby-slot" aria-hidden={!question.promptHoverText}>
          {question.promptHoverText ? (
            <p className="quiz-prompt__hover-text font-jp" lang="ja">
              {question.promptHoverText}
            </p>
          ) : null}
        </div>
        <p
          className="quiz-prompt__main animate-fade-up font-jp font-bold text-white drop-shadow-[0_0_40px_rgba(249,67,0,0.25)]"
          lang="ja"
        >
          {question.promptText}
        </p>
      </div>
    );
  }

  return (
    <div className="quiz-prompt" style={style}>
      <p
        className={`quiz-prompt__main animate-fade-up font-bold text-white drop-shadow-[0_0_40px_rgba(249,67,0,0.25)] ${
          isJapanese ? "font-jp" : ""
        }`}
        lang={isJapanese ? "ja" : "vi"}
      >
        {question.promptText}
      </p>
    </div>
  );
}
