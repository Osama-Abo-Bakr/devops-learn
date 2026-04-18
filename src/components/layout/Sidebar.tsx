"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAllModules } from "@/data/modules";
import type { Topic } from "@/types";

interface SidebarProps {
  topic: Topic;
}

const topicLessons = getAllModules();

const levelIcons: Record<string, string> = {
  beginner: "🌱",
  intermediate: "📈",
  advanced: "🚀",
};

export default function Sidebar({ topic }: SidebarProps) {
  const pathname = usePathname();
  const moduleData = topicLessons.find((m) => m.slug === topic);

  if (!moduleData) return null;

  const beginnerLessons = moduleData.lessons.filter((l) => l.level === "beginner");
  const intermediateLessons = moduleData.lessons.filter((l) => l.level === "intermediate");
  const advancedLessons = moduleData.lessons.filter((l) => l.level === "advanced");

  const renderSection = (title: string, level: string, lessons: typeof beginnerLessons) => {
    if (lessons.length === 0) return null;
    return (
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2 px-3">
          <span className="text-lg">{levelIcons[level]}</span>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            {title}
          </h3>
          <span className="ml-auto inline-block rounded-full bg-gray-800/50 px-2 py-0.5 text-xs font-medium text-gray-500">
            {lessons.length}
          </span>
        </div>
        <ul className="space-y-1">
          {lessons.map((lesson) => {
            const href = `/learn/${topic}/${lesson.slug}`;
            const isActive = pathname === href;
            return (
              <li key={lesson.slug}>
                <Link
                  href={href}
                  className={`group relative block rounded-lg px-4 py-2.5 text-sm transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600/30 to-cyan-600/20 text-blue-300 shadow-lg shadow-blue-600/10"
                      : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`text-xs transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>→</span>
                    {lesson.title}
                  </span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400"></div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <aside className="hidden w-72 shrink-0 border-r border-gray-800/50 bg-gradient-to-b from-gray-900 to-gray-800/50 lg:block">
      <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white">
              {moduleData.title}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {moduleData.lessons.length} lessons
            </p>
          </div>
          
          {renderSection("Beginner", "beginner", beginnerLessons)}
          {renderSection("Intermediate", "intermediate", intermediateLessons)}
          {renderSection("Advanced", "advanced", advancedLessons)}
        </div>
      </div>
    </aside>
  );
}
