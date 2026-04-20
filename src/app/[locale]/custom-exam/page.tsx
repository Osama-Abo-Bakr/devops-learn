"use client";

import { useState } from "react";
import type { ExamConfig, CustomExam, Topic, Level } from "@/types";
import QuizComponent from "@/components/quiz/QuizComponent";
import ExamResults from "@/components/quiz/ExamResults";
import { addExamHistory } from "@/lib/exam-history";
import { useProgress } from "@/context/ProgressContext";
import modules from "@/data/modules";

const LEVEL_OPTIONS: { value: Level; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const COUNT_OPTIONS = [5, 10, 15, 20] as const;

const TIMER_OPTIONS = [
  { value: 0, label: "No timer" },
  { value: 30, label: "30s" },
  { value: 60, label: "60s" },
  { value: 90, label: "90s" },
];

export default function CustomExamPage() {
  const { addXP, updateStreak, getXPReward, loaded } = useProgress();
  const [phase, setPhase] = useState<
    "config" | "loading" | "exam" | "results"
  >("config");
  const [config, setConfig] = useState<ExamConfig>({
    topics: [],
    levels: ["beginner"],
    questionCount: 10,
  });
  const [selectedLessons, setSelectedLessons] = useState<Set<string>>(new Set());
  const [expandedModules, setExpandedModules] = useState<Set<Topic>>(new Set());
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [exam, setExam] = useState<CustomExam | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Build lesson lists per module, filtered by selected levels
  const moduleLessons = Object.values(modules).map((mod) => ({
    slug: mod.slug,
    title: mod.title,
    icon: mod.icon,
    lessons: mod.lessons
      .filter((l) => config.levels.includes(l.level) && l.quiz)
      .map((l) => ({ slug: l.slug, title: l.title, level: l.level })),
  }));

  // Count curated questions available from selected lessons
  const curatedCount = moduleLessons.reduce(
    (sum, mod) =>
      sum +
      mod.lessons.filter((l) => selectedLessons.has(l.slug)).length * 8,
    0,
  );

  function toggleLevel(level: Level) {
    setConfig((prev) => ({
      ...prev,
      levels: prev.levels.includes(level)
        ? prev.levels.filter((l) => l !== level)
        : [...prev.levels, level],
    }));
  }

  function toggleModule(topic: Topic) {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(topic)) next.delete(topic);
      else next.add(topic);
      return next;
    });
  }

  function toggleModuleAll(topic: Topic) {
    const mod = moduleLessons.find((m) => m.slug === topic);
    if (!mod) return;
    const lessonSlugs = mod.lessons.map((l) => l.slug);
    const allSelected = lessonSlugs.every((s) => selectedLessons.has(s));

    setSelectedLessons((prev) => {
      const next = new Set(prev);
      lessonSlugs.forEach((s) => (allSelected ? next.delete(s) : next.add(s)));
      return next;
    });

    setConfig((prev) => ({
      ...prev,
      topics: allSelected
        ? prev.topics.filter((t) => t !== topic)
        : prev.topics.includes(topic)
          ? prev.topics
          : [...prev.topics, topic],
    }));
  }

  function toggleLesson(slug: string, topic: Topic) {
    setSelectedLessons((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });

    // Ensure the topic is in config.topics when any lesson is selected
    if (!selectedLessons.has(slug) && !config.topics.includes(topic)) {
      setConfig((prev) => ({ ...prev, topics: [...prev.topics, topic] }));
    }
  }

  async function handleGenerate() {
    if (selectedLessons.size === 0 && config.topics.length === 0) return;

    setPhase("loading");
    setError(null);

    const payload = {
      ...config,
      lessonSlugs: Array.from(selectedLessons),
      timePerQuestion: timerSeconds || undefined,
    };

    try {
      const res = await fetch("/api/generate-exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to generate exam");
      }

      const data = await res.json();
      const curatedQuestions: unknown[] = data.curatedQuestions || [];
      const aiQuestions: unknown[] = data.questions || [];

      const allQuestions = [...curatedQuestions, ...aiQuestions];
      const sources: ("curated" | "ai")[] = [
        ...curatedQuestions.map(() => "curated" as const),
        ...aiQuestions.map(() => "ai" as const),
      ];

      // Fisher-Yates shuffle
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
            lessonSlug?: string;
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
      const levelLabel = config.levels
        .map((l) => l.charAt(0).toUpperCase() + l.slice(1))
        .join(", ");

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

  function handleExamComplete(examScore: number, examAnswers: (number | null)[]) {
    setScore(examScore);
    setAnswers(examAnswers);

    const passed = examScore >= 75;

    if (exam && loaded && passed) {
      addXP(getXPReward("examQuestion") * exam.questions.length);
      updateStreak();
    }

    if (exam) {
      addExamHistory({
        exam,
        answers: examAnswers,
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
        Pick lessons, choose difficulty, and test yourself with curated and AI-generated questions.
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

          {/* Lesson Selection */}
          <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
            <h2 className="mb-1 text-lg font-semibold text-white">
              Select Lessons
            </h2>
            <p className="mb-4 text-xs text-gray-500">
              Pick specific lessons or select all for a module. Curated questions come from selected lessons.
            </p>

            <div className="space-y-3">
              {moduleLessons.map((mod) => {
                const isExpanded = expandedModules.has(mod.slug);
                const modLessonSlugs = mod.lessons.map((l) => l.slug);
                const allSelected =
                  modLessonSlugs.length > 0 &&
                  modLessonSlugs.every((s) => selectedLessons.has(s));
                const someSelected = modLessonSlugs.some((s) =>
                  selectedLessons.has(s),
                );
                const selectedCount = modLessonSlugs.filter((s) =>
                  selectedLessons.has(s),
                ).length;

                return (
                  <div
                    key={mod.slug}
                    className="rounded-lg border border-gray-800 bg-gray-950"
                  >
                    <button
                      onClick={() => toggleModule(mod.slug)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          ref={(el) => {
                            if (el) el.indeterminate = someSelected && !allSelected;
                          }}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleModuleAll(mod.slug);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-white">
                          {mod.title}
                        </span>
                        {selectedCount > 0 && (
                          <span className="rounded-full bg-blue-600/20 px-2 py-0.5 text-xs text-blue-400">
                            {selectedCount}
                          </span>
                        )}
                      </div>
                      <svg
                        className={`h-4 w-4 text-gray-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-gray-800 px-4 py-2">
                        {mod.lessons.length === 0 ? (
                          <p className="py-2 text-xs text-gray-500">
                            No lessons at selected levels
                          </p>
                        ) : (
                          <div className="space-y-1">
                            {mod.lessons.map((lesson) => (
                              <label
                                key={lesson.slug}
                                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-gray-300 hover:bg-gray-800"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedLessons.has(lesson.slug)}
                                  onChange={() => toggleLesson(lesson.slug, mod.slug)}
                                  className="h-3.5 w-3.5 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
                                />
                                <span>{lesson.title}</span>
                                <span className="ml-auto text-xs text-gray-600">
                                  {lesson.level}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Level Filter */}
          <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
            <h2 className="mb-3 text-lg font-semibold text-white">
              Difficulty Levels
            </h2>
            <p className="mb-3 text-xs text-gray-500">
              Select one or more levels. Lessons above are filtered by your selection.
            </p>
            <div className="flex gap-3">
              {LEVEL_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => toggleLevel(value)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    config.levels.includes(value)
                      ? "border-blue-500 bg-blue-600/20 text-blue-400"
                      : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Question Count + Timer */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
              <h2 className="mb-3 text-sm font-semibold text-white">
                Questions
              </h2>
              <div className="flex gap-2">
                {COUNT_OPTIONS.map((count) => (
                  <button
                    key={count}
                    onClick={() =>
                      setConfig((prev) => ({ ...prev, questionCount: count }))
                    }
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                      config.questionCount === count
                        ? "border-blue-500 bg-blue-600/20 text-blue-400"
                        : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500 hover:text-white"
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
              {curatedCount > 0 && (
                <p className="mt-2 text-xs text-gray-500">
                  ~{Math.min(curatedCount, Math.ceil(config.questionCount * 0.5))} curated available
                </p>
              )}
            </div>

            <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
              <h2 className="mb-3 text-sm font-semibold text-white">
                Timer
              </h2>
              <div className="flex gap-2">
                {TIMER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setTimerSeconds(opt.value)}
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                      timerSeconds === opt.value
                        ? "border-blue-500 bg-blue-600/20 text-blue-400"
                        : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500 hover:text-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={selectedLessons.size === 0}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {selectedLessons.size === 0
              ? "Select at least one lesson"
              : `Generate Exam (${selectedLessons.size} lesson${selectedLessons.size > 1 ? "s" : ""})`}
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
          timePerQuestion={timerSeconds || undefined}
        />
      )}

      {/* Results Phase */}
      {phase === "results" && exam && (
        <ExamResults
          exam={exam}
          answers={answers}
          score={score}
          onRetake={handleRetake}
          onNewExam={handleNewExam}
          timerSeconds={timerSeconds}
        />
      )}
    </div>
  );
}