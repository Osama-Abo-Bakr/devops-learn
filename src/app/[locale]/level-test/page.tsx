"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const QuizComponent = dynamic(() => import("@/components/quiz/QuizComponent"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-blue-500" />
    </div>
  ),
});
import { placementQuiz } from "@/data/quizzes/placement-quiz";
import { useProgress } from "@/context/ProgressContext";
import type { Level } from "@/types";

function determineLevel(score: number): Level {
  if (score >= 80) return "advanced";
  if (score >= 50) return "intermediate";
  return "beginner";
}

const levelRecommendations: Record<Level, { modules: string[]; message: string }> = {
  beginner: {
    modules: ["docker"],
    message: "You're just getting started — begin with the Docker fundamentals!",
  },
  intermediate: {
    modules: ["docker", "compose", "kubernetes"],
    message: "You know the basics — jump into intermediate topics!",
  },
  advanced: {
    modules: ["kubernetes", "devops"],
    message: "You're ready for advanced concepts and production patterns!",
  },
};

export default function LevelTestPage() {
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState<{ level: Level; score: number } | null>(null);
  const { setPlacementLevel } = useProgress();
  const router = useRouter();

  function handleComplete(score: number) {
    const level = determineLevel(score);
    setPlacementLevel(level);
    setResult({ level, score });
  }

  if (result) {
    const recommendation = levelRecommendations[result.level];
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-gray-700 bg-gray-900 p-8 text-center">
          <h1 className="mb-4 text-3xl font-bold text-white">
            Your Recommended Level
          </h1>
          <div className="mb-6 inline-flex rounded-full bg-blue-600/20 px-4 py-2 text-2xl font-bold text-blue-400">
            {result.level.charAt(0).toUpperCase() + result.level.slice(1)}
          </div>
          <p className="mb-2 text-lg text-gray-300">
            You scored {result.score}%
          </p>
          <p className="mb-8 text-gray-400">{recommendation.message}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {recommendation.modules.map((mod) => (
              <button
                key={mod}
                onClick={() => router.push(`/learn/${mod}`)}
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-500"
              >
                Start {mod.charAt(0).toUpperCase() + mod.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={() => setResult(null)}
            className="mt-4 block w-full text-sm text-gray-500 hover:text-white"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-gray-700 bg-gray-900 p-8 text-center">
          <h1 className="mb-4 text-3xl font-bold text-white">Find Your Level</h1>
          <p className="mb-8 text-gray-400">
            Take this quick quiz to find out where you should start. 10 questions
            covering Docker, Compose, and Kubernetes basics.
          </p>
          <button
            onClick={() => setStarted(true)}
            className="rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition-colors hover:bg-blue-500"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <QuizComponent
        questions={placementQuiz.questions}
        title={placementQuiz.title}
        onComplete={handleComplete}
      />
    </div>
  );
}