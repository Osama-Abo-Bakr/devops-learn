"use client";

import Link from "next/link";
import type { Module } from "@/types";
import LevelBadge from "./LevelBadge";
import ProgressBar from "./ProgressBar";
import { useProgress } from "@/context/ProgressContext";

const moduleIcons: Record<string, string> = {
  docker: "🐳",
  compose: "📦",
  kubernetes: "☸️",
  devops: "🚀",
};

interface ModuleCardProps {
  module: Module;
}

export default function ModuleCard({ module }: ModuleCardProps) {
  const { progress, getCompletionPercentage } = useProgress();
  const completionPercentage = getCompletionPercentage(
    module.lessons.map((l) => l.slug),
  );
  const levels = [...new Set(module.lessons.map((l) => l.level))];

  return (
    <Link
      href={`/learn/${module.slug}`}
      className="group flex flex-col rounded-xl border border-gray-800 bg-gray-900 p-6 transition-all hover:border-blue-500/50 hover:bg-gray-800/80"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="text-3xl">{moduleIcons[module.slug] ?? "📚"}</span>
        <div>
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-400">
            {module.title}
          </h3>
          <p className="text-sm text-gray-400">{module.lessons.length} lessons</p>
        </div>
      </div>

      <p className="mb-4 flex-1 text-sm text-gray-400">{module.description}</p>

      <div className="mb-3 flex flex-wrap gap-2">
        {levels.map((level) => (
          <LevelBadge key={level} level={level} />
        ))}
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Progress</span>
          <span>{completionPercentage}%</span>
        </div>
        <ProgressBar percentage={completionPercentage} />
      </div>
    </Link>
  );
}