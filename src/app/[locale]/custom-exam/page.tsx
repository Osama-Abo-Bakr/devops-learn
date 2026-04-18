"use client";

import { useState } from "react";
import type { ExamConfig, CustomExam, Topic, Level } from "@/types";
import QuizComponent from "@/components/quiz/QuizComponent";
import ExamResults from "@/components/quiz/ExamResults";
import { addExamHistory } from "@/lib/exam-history";

const TOPIC_OPTIONS: { value: Topic; label: string; icon: string }[] = [
  { value: "docker", label: "Docker", icon: "🐳" },
  { value: "compose", label: "Compose", icon: "📦" },
  { value: "kubernetes", label: "Kubernetes", icon: "☸️" },
  { value: "devops", label: "DevOps", icon: "🚀" },
];

const LEVEL_OPTIONS: { value: Level; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const COUNT_OPTIONS = [5, 10, 15, 20] as const;

export default function CustomExamPage() {
  const [phase, setPhase] = useState<
    "config" | "loading" | "exam" | "results"
  >("config");
  const [config, setConfig] = useState<ExamConfig>({
    topics: [],
    level: "beginner",
    questionCount: 10,
  });
  const [exam, setExam] = useState<CustomExam | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [error, setError] = useState<string | null>(null);

  const devopsBeginnerWarning =
    config.topics.length === 1 &&
    config.topics[0] === "devops" &&
    config.level === "beginner";

  function toggleTopic(topic: Topic) {
    setConfig((prev) => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter((t) => t !== topic)
        : [...prev.topics, topic],
    }));
  }

  async function handleGenerate() {
    if (config.topics.length === 0) return;

    setPhase("loading");
    setError(null);

    try {
      const res = await fetch("/api/generate-exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to generate exam");
      }

      const data = await res.json();
      const curatedQuestions: unknown[] = data.curatedQuestions || [];
      const aiQuestions: unknown[] = data.questions || [];

      // Combine curated + AI, then shuffle (Fisher-Yates)
      const allQuestions = [...curatedQuestions, ...aiQuestions];
      const sources: ("curated" | "ai")[] = [
        ...curatedQuestions.map(() => "curated" as const),
        ...aiQuestions.map(() => "ai" as const),
      ];

      const indices = allQuestions.map((_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }

      const shuffledQuestions = indices.map((i) => allQuestions[i]);
      const shuffledSources = indices.map((i) => sources[i]);

      const finalQuestions = shuffledQuestions.map(
        (q: unknown, i: number) => {
          const question = q as {
            id: string;
            question: string;
            options: string[];
            correctIndex: number;
            explanation: string;
          };
          return {
            ...question,
            id: question.id.startsWith("ai-")
              ? question.id
              : `c-${question.id}-${i}`,
          };
        },
      );

      const topicLabels = config.topics
        .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
        .join(" + ");
      const levelLabel =
        config.level.charAt(0).toUpperCase() + config.level.slice(1);

      setExam({
        id: `exam-${Date.now()}`,
        title: `Custom Exam: ${topicLabels} (${levelLabel})`,
        config,
        questions: finalQuestions,
        sources: shuffledSources,
        createdAt: new Date().toISOString(),
      });
      setPhase("exam");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate exam",
      );
      setPhase("config");
    }
  }

  function handleExamComplete(examScore: number) {
    setScore(examScore);

    if (exam) {
      const correctCount = exam.questions.filter(
        (_, i) => answers[i] === exam.questions[i].correctIndex,
      ).length;
      // Initialize answers if not tracked
      const finalAnswers =
        answers.length === exam.questions.length
          ? answers
          : exam.questions.map(() => null);

      addExamHistory({
        exam,
        answers: finalAnswers,
        score: examScore,
        completedAt: new Date().toISOString(),
      });
    }

    setPhase("results");
  }

  function handleRetake() {
    setPhase("loading");
    setAnswers([]);
    setScore(0);
    handleGenerate();
  }

  function handleNewExam() {
    setPhase("config");
    setExam(null);
    setAnswers([]);
    setScore(0);
    setError(null);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-white">
        Make Your Own Exam
      </h1>
      <p className="mb-8 text-gray-400">
        Configure a custom exam and test your DevOps knowledge with a mix of
        curated and AI-generated questions.
      </p>

      {/* Config Phase */}
      {phase === "config" && (
        <div className="space-y-6">
          {error && (
            <div className="rounded-lg border border-red-800 bg-red-900/20 p-4 text-sm text-red-400">
              {error}
              <button
                onClick={handleGenerate}
                className="ml-3 underline hover:text-red-300"
              >
                Retry
              </button>
            </div>
          )}

          {/* Topic Selection */}
          <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
            <h2 className="mb-3 text-lg font-semibold text-white">
              Select Topics
            </h2>
            <div className="flex flex-wrap gap-3">
              {TOPIC_OPTIONS.map(({ value, label, icon }) => (
                <button
                  key={value}
                  onClick={() => toggleTopic(value)}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                    config.topics.includes(value)
                      ? "border-blue-500 bg-blue-600/20 text-blue-400"
                      : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500 hover:text-white"
                  }`}
                >
                  <span>{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Level Selection */}
          <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
            <h2 className="mb-3 text-lg font-semibold text-white">
              Difficulty Level
            </h2>
            <div className="flex gap-3">
              {LEVEL_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() =>
                    setConfig((prev) => ({ ...prev, level: value }))
                  }
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    config.level === value
                      ? "border-blue-500 bg-blue-600/20 text-blue-400"
                      : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {devopsBeginnerWarning && (
              <p className="mt-3 text-xs text-amber-400">
                DevOps has no beginner lessons — all questions will be
                AI-generated.
              </p>
            )}
          </div>

          {/* Question Count */}
          <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
            <h2 className="mb-3 text-lg font-semibold text-white">
              Number of Questions
            </h2>
            <div className="flex gap-3">
              {COUNT_OPTIONS.map((count) => (
                <button
                  key={count}
                  onClick={() =>
                    setConfig((prev) => ({ ...prev, questionCount: count }))
                  }
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                    config.questionCount === count
                      ? "border-blue-500 bg-blue-600/20 text-blue-400"
                      : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500 hover:text-white"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={config.topics.length === 0}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Generate Exam
          </button>
        </div>
      )}

      {/* Loading Phase */}
      {phase === "loading" && (
        <div className="flex flex-col items-center gap-6 py-16">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-700 border-t-blue-500" />
          <p className="text-lg font-medium text-white">
            Generating your exam...
          </p>
          <p className="text-sm text-gray-400">
            Mixing curated questions with AI-generated ones
          </p>
          {/* Skeleton preview */}
          <div className="w-full max-w-lg space-y-3">
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-800" />
            <div className="h-10 w-full animate-pulse rounded bg-gray-800" />
            <div className="h-10 w-full animate-pulse rounded bg-gray-800" />
            <div className="h-10 w-full animate-pulse rounded bg-gray-800" />
            <div className="h-10 w-full animate-pulse rounded bg-gray-800" />
          </div>
        </div>
      )}

      {/* Exam Phase */}
      {phase === "exam" && exam && (
        <QuizComponent
          questions={exam.questions}
          title={exam.title}
          onComplete={handleExamComplete}
        />
      )}

      {/* Results Phase */}
      {phase === "results" && exam && (
        <ExamResults
          exam={exam}
          answers={answers.length === exam.questions.length ? answers : exam.questions.map(() => null)}
          score={score}
          onRetake={handleRetake}
          onNewExam={handleNewExam}
        />
      )}
    </div>
  );
}