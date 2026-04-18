"use client";

import type { Lesson, Topic, Level } from "@/types";
import LevelBadge from "@/components/progress/LevelBadge";
import LessonCard from "@/components/progress/LessonCard";

interface ModuleLessonListProps {
  lessons: Lesson[];
  topic: Topic;
}

const LEVEL_ORDER: Level[] = ["beginner", "intermediate", "advanced"];

export default function ModuleLessonList({
  lessons,
  topic,
}: ModuleLessonListProps) {
  return (
    <div className="space-y-6">
      {LEVEL_ORDER.map((level) => {
        const levelLessons = lessons.filter((l) => l.level === level);
        if (levelLessons.length === 0) return null;

        return (
          <div key={level}>
            <div className="mb-3 flex items-center gap-2">
              <LevelBadge level={level} />
              <h2 className="text-lg font-semibold text-white capitalize">
                {level}
              </h2>
            </div>

            <div className="space-y-3">
              {levelLessons.map((lesson) => (
                <LessonCard
                  key={lesson.slug}
                  lesson={lesson}
                  topic={topic}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}