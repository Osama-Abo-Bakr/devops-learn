import type { CustomExam } from "@/types";

interface ExamResultsProps {
  exam: CustomExam;
  answers: (number | null)[];
  score: number;
  onRetake: () => void;
  onNewExam: () => void;
}

export default function ExamResults({
  exam,
  answers,
  score,
  onRetake,
  onNewExam,
}: ExamResultsProps) {
  const correct = answers.filter(
    (a, i) => a === exam.questions[i].correctIndex,
  ).length;
  const total = exam.questions.length;

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

  return (
    <div className="space-y-6">
      {/* Score card */}
      <div className="flex flex-col items-center gap-4 rounded-lg border border-gray-700 bg-gray-900 p-8">
        <div
          className={`flex h-28 w-28 items-center justify-center rounded-full border-4 ${scoreRing}`}
        >
          <span className={`text-3xl font-bold ${scoreColor}`}>{score}%</span>
        </div>
        <p className="text-lg font-semibold text-white">{scoreLabel}</p>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${passed ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"}`}>
          {passed ? "Pass" : "Fail"}
        </span>
        <p className="text-sm text-gray-400">
          {correct} correct out of {total} questions
        </p>
      </div>

      {/* Question review */}
      <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">
          Question Review
        </h3>
        <div className="space-y-4">
          {exam.questions.map((q, i) => {
            const isCorrect = answers[i] === q.correctIndex;
            const source = exam.sources[i];

            return (
              <div
                key={q.id}
                className="rounded-lg border border-gray-800 bg-gray-950 p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={`text-sm font-medium ${
                      isCorrect ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {isCorrect ? "Correct" : "Incorrect"}
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
                <p className="mb-1 text-sm text-white">{q.question}</p>
                {!isCorrect && (
                  <p className="mb-1 text-xs text-gray-400">
                    Your answer: {answers[i] !== null ? q.options[answers[i]!] : "Skipped"}
                  </p>
                )}
                <p className="text-xs text-gray-400">
                  Correct: {q.options[q.correctIndex]}
                </p>
                <p className="mt-2 text-xs text-gray-500">{q.explanation}</p>
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
  );
}