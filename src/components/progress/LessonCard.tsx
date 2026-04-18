"use client";

import Link from "next/link";
import type { Lesson, Topic } from "@/types";
import { useProgress } from "@/context/ProgressContext";
import LevelBadge from "./LevelBadge";

interface LessonCardProps {
  lesson: Lesson;
  topic: Topic;
}

export default function LessonCard({ lesson, topic }: LessonCardProps) {
  const { progress, loaded } = useProgress();
  const lessonProgress = loaded ? progress.lessons[lesson.slug] : undefined;
  const status = lessonProgress?.status ?? "not_started";
  const quizScore = lessonProgress?.quizBestScore;

  const statusIcon =
    status === "completed" ? (
      <span className="text-green-400" title="Completed">✅</span>
    ) : status === "in_progress" ? (
      <span className="text-yellow-400" title="In progress">🔄</span>
    ) : (
      <span className="text-gray-600" title="Not started">⬜</span>
    );

  return (
    <Link
      href={`/learn/${topic}/${lesson.slug}`}
      className="block rounded-lg border border-gray-800 bg-gray-900 p-4 transition-colors hover:border-blue-500/50 hover:bg-gray-800"
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-white">{lesson.title}</h3>
            {statusIcon}
          </div>
          <p className="mt-1 text-sm text-gray-400">
            {lesson.description}
          </p>
          {quizScore !== null && quizScore !== undefined && (
            <p className="mt-1 text-xs text-blue-400">
              Best score: {quizScore}%
            </p>
          )}
        </div>
        <div className="ml-4 flex shrink-0 items-center gap-2 text-sm text-gray-500">
          <span>{lesson.duration}</span>
          <span>→</span>
        </div>
      </div>
    </Link>
  );
}