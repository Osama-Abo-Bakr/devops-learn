import Link from "next/link";
import LevelBadge from "@/components/progress/LevelBadge";
import type { Lesson, Topic } from "@/types";

interface LessonLayoutProps {
  lesson: Lesson;
  topic: Topic;
  children: React.ReactNode;
}

const topicColors: Record<string, string> = {
  docker: "text-blue-400",
  compose: "text-purple-400",
  kubernetes: "text-cyan-400",
  devops: "text-orange-400",
};

export default function LessonLayout({
  lesson,
  topic,
  children,
}: LessonLayoutProps) {
  const topicTitle = topic.charAt(0).toUpperCase() + topic.slice(1);
  const topicColor = topicColors[topic] || "text-blue-400";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-sm">
        <Link
          href="/"
          className="text-gray-400 transition-colors hover:text-white"
        >
          Home
        </Link>
        <span className="text-gray-600">→</span>
        <Link
          href={`/learn/${topic}`}
          className={`transition-colors hover:text-white ${topicColor}`}
        >
          {topicTitle}
        </Link>
        <span className="text-gray-600">→</span>
        <span className="text-white">{lesson.title}</span>
      </div>

      {/* Header */}
      <div className="relative mb-12 rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900 to-gray-800 p-8">
        <div className="relative z-10">
          <div className="mb-4 flex items-center gap-3">
            <h1 className="text-4xl font-bold text-white">{lesson.title}</h1>
            <LevelBadge level={lesson.level} />
          </div>

          <p className="mb-6 text-gray-400">{lesson.description || `Master ${lesson.title} with interactive examples and hands-on practice.`}</p>

          {/* Lesson Meta */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-gray-800/50 px-4 py-2 text-sm text-gray-300">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {lesson.duration}
            </div>
            
            {lesson.diagram && (
              <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
                <span>📊</span>
                Interactive Diagram
              </div>
            )}
            
            {lesson.challenge && (
              <div className="flex items-center gap-2 rounded-lg bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
                <span>💻</span>
                Terminal Challenge
              </div>
            )}
            
            {lesson.quiz && (
              <div className="flex items-center gap-2 rounded-lg bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
                <span>📝</span>
                Quiz
              </div>
            )}
          </div>
        </div>

        {/* Background gradient */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/5 to-cyan-600/5 opacity-0"></div>
      </div>

      {/* Content */}
      <div className="space-y-12">{children}</div>

      {/* Navigation */}
      <div className="mt-16 border-t border-gray-800/50 pt-8">
        <Link
          href={`/learn/${topic}`}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900/50 px-6 py-3 font-medium text-gray-300 transition-all duration-300 hover:border-blue-500/50 hover:bg-gray-800/50 hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to {topicTitle} lessons
        </Link>
      </div>
    </div>
  );
}
