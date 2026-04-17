"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAllModules } from "@/data/modules";
import type { Topic } from "@/types";

interface SidebarProps {
  topic: Topic;
}

const topicLessons = getAllModules();

export default function Sidebar({ topic }: SidebarProps) {
  const pathname = usePathname();
  const moduleData = topicLessons.find((m) => m.slug === topic);

  if (!moduleData) return null;

  const beginnerLessons = moduleData.lessons.filter((l) => l.level === "beginner");
  const intermediateLessons = moduleData.lessons.filter((l) => l.level === "intermediate");
  const advancedLessons = moduleData.lessons.filter((l) => l.level === "advanced");

  const renderSection = (title: string, lessons: typeof beginnerLessons) => {
    if (lessons.length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          {title}
        </h3>
        <ul className="space-y-1">
          {lessons.map((lesson) => {
            const href = `/learn/${topic}/${lesson.slug}`;
            const isActive = pathname === href;
            return (
              <li key={lesson.slug}>
                <Link
                  href={href}
                  className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-blue-600/20 text-blue-400"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {lesson.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <aside className="hidden w-64 shrink-0 border-r border-gray-800 bg-gray-950 lg:block">
      <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-4">
        <h2 className="mb-4 px-3 text-lg font-semibold text-white">
          {moduleData.title}
        </h2>
        {renderSection("Beginner", beginnerLessons)}
        {renderSection("Intermediate", intermediateLessons)}
        {renderSection("Advanced", advancedLessons)}
      </div>
    </aside>
  );
}