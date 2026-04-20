import type { CustomExam } from "@/types";
import CelebrationEffect from "@/components/celebration/CelebrationEffect";
import { useState, useEffect } from "react";

interface ExamResultsProps {
  exam: CustomExam;
  answers: (number | null)[];
  score: number;
  onRetake: () => void;
  onNewExam: () => void;
  timerSeconds?: number;
}

export default function ExamResults({
  exam,
  answers,
  score,
  onRetake,
  onNewExam,
  timerSeconds,
}: ExamResultsProps) {
  const [celebrate, setCelebrate] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());

  const correct = answers.filter(
    (a, i) => a === exam.questions[i].correctIndex,
  ).length;
  const total = exam.questions.length;
  const unanswered = answers.filter((a) => a === null).length;

  const scoreColor =
    score >= 80
      ? "text-green-400"
      : score >= 50
        ? "text-blue-400"
        : "text-red-400";
  const scoreRing =
    score >= 80
      ? "border-green-500"
      : score >= 50
        ? "border-blue-500"
        : "border-red-500";
  const scoreLabel =
    score >= 80 ? "Excellent!" : score >= 50 ? "Good effort!" : "Keep learning!";
  const passed = score >= 75;

  useEffect(() => {
    if (passed) setCelebrate(true);
  }, [passed]);

  function toggleQuestion(index: number) {
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <>
      <CelebrationEffect trigger={celebrate} score={score} onDone={() => setCelebrate(false)} />
      <div className="space-y-6">
      {/* Score card */}
      <div className={`flex flex-col items-center gap-4 rounded-lg border p-8 ${passed ? "border-green-500/30 bg-gradient-to-b from-gray-900 to-green-950/20" : "border-gray-700 bg-gray-900"}`}>
        {passed && <span className="text-4xl">{score >= 90 ? "👑" : "🎉"}</span>}
        <div
          className={`flex h-28 w-28 items-center justify-center rounded-full border-4 ${scoreRing}`}
        >
          <span className={`text-3xl font-bold ${scoreColor}`}>{score}%</span>
        </div>
        <p className="text-lg font-semibold text-white">{scoreLabel}</p>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${passed ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"}`}>
          {passed ? "Pass" : "Fail"}
        </span>
        <div className="flex gap-4 text-sm text-gray-400">
          <span>{correct}/{total} correct</span>
          {unanswered > 0 && <span className="text-gray-500">{unanswered} timed out</span>}
        </div>
      </div>

      {/* Question review */}
      <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">
          Question Review
        </h3>
        <div className="space-y-3">
          {exam.questions.map((q, i) => {
            const isCorrect = answers[i] === q.correctIndex;
            const source = exam.sources[i];
            const isExpanded = expandedQuestions.has(i);

            return (
              <div
                key={q.id}
                className={`rounded-lg border p-4 ${
                  isCorrect
                    ? "border-green-800/50 bg-green-950/20"
                    : "border-red-800/50 bg-red-950/10"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          isCorrect ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {answers[i] === null ? "Timed out" : isCorrect ? "Correct" : "Incorrect"}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                          source === "curated"
                            ? "bg-blue-600/20 text-blue-400"
                            : "bg-purple-600/20 text-purple-400"
                        }`}
                      >
                        {source === "curated" ? "Curated" : "AI Generated"}
                      </span>
                    </div>
                    <p className="text-sm text-white">{q.question}</p>
                  </div>
                  <button
                    onClick={() => toggleQuestion(i)}
                    className="shrink-0 rounded p-1 text-gray-500 hover:bg-gray-800 hover:text-white"
                  >
                    <svg
                      className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-3 space-y-2 border-t border-gray-800 pt-3">
                    {!isCorrect && answers[i] !== null && (
                      <p className="text-xs text-red-400">
                        Your answer: {q.options[answers[i]!]}
                      </p>
                    )}
                    <p className="text-xs text-green-400">
                      Correct answer: {q.options[q.correctIndex]}
                    </p>
                    <p className="text-xs text-gray-400">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onRetake}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
        >
          Retake Exam
        </button>
        <button
          onClick={onNewExam}
          className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
        >
          New Exam
        </button>
      </div>
    </div>
    </>
  );
}