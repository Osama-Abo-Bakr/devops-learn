import Link from "next/link";
import LevelBadge from "@/components/progress/LevelBadge";
import type { Lesson, Topic } from "@/types";

interface LessonLayoutProps {
  lesson: Lesson;
  topic: Topic;
  children: React.ReactNode;
}

export default function LessonLayout({
  lesson,
  topic,
  children,
}: LessonLayoutProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/learn/${topic}`}
          className="mb-4 inline-block text-sm text-blue-400 hover:text-blue-300"
        >
          ← Back to {topic.charAt(0).toUpperCase() + topic.slice(1)} lessons
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-white">{lesson.title}</h1>
          <LevelBadge level={lesson.level} />
        </div>
        <div className="mt-2 flex items-center gap-4 text-sm text-gray-400">
          <span>{lesson.duration}</span>
          {lesson.diagram && <span>• Interactive Diagram</span>}
          {lesson.challenge && <span>• Terminal Challenge</span>}
          {lesson.quiz && <span>• Quiz</span>}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">{children}</div>

      {/* Navigation */}
      <div className="mt-12 flex items-center justify-between border-t border-gray-800 pt-6">
        <div>
          <Link
            href={`/learn/${topic}`}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            ← All {topic.charAt(0).toUpperCase() + topic.slice(1)} lessons
          </Link>
        </div>
      </div>
    </div>
  );
}