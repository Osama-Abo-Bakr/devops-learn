import Link from "next/link";
import type { Module } from "@/types";
import LevelBadge from "./LevelBadge";
import ProgressBar from "./ProgressBar";

const moduleIcons: Record<string, string> = {
  docker: "🐳",
  compose: "📦",
  kubernetes: "☸️",
  devops: "🚀",
};

const moduleColors: Record<string, { bg: string; border: string; icon: string }> = {
  docker: { bg: "from-blue-600/10 to-blue-500/5", border: "hover:border-blue-500/50", icon: "bg-blue-500/10" },
  compose: { bg: "from-purple-600/10 to-purple-500/5", border: "hover:border-purple-500/50", icon: "bg-purple-500/10" },
  kubernetes: { bg: "from-cyan-600/10 to-cyan-500/5", border: "hover:border-cyan-500/50", icon: "bg-cyan-500/10" },
  devops: { bg: "from-orange-600/10 to-orange-500/5", border: "hover:border-orange-500/50", icon: "bg-orange-500/10" },
};

interface ModuleCardProps {
  module: Module;
  completionPercentage: number;
}

export default function ModuleCard({
  module,
  completionPercentage,
}: ModuleCardProps) {
  const levels = [...new Set(module.lessons.map((l) => l.level))];
  const colors = moduleColors[module.slug] || moduleColors.docker;

  return (
    <Link
      href={`/learn/${module.slug}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-gray-800/50 bg-gradient-to-br ${colors.bg} bg-gray-900 p-6 transition-all duration-300 ${colors.border} hover:bg-gray-800/50 hover:shadow-xl hover:shadow-blue-600/10`}
    >
      {/* Hover gradient effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-5"></div>

      <div className="relative">
        <div className="mb-4 flex items-start justify-between">
          <div className={`rounded-lg ${colors.icon} p-3 text-3xl`}>
            {moduleIcons[module.slug] ?? "📚"}
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-gray-500">{module.lessons.length}</p>
            <p className="text-xs text-gray-400">lessons</p>
          </div>
        </div>

        <h3 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-blue-400">
          {module.title}
        </h3>

        <p className="mb-4 flex-1 text-sm text-gray-400 line-clamp-2">{module.description}</p>

        <div className="mb-4 flex flex-wrap gap-2">
          {levels.map((level) => (
            <LevelBadge key={level} level={level} />
          ))}
        </div>

        <div className="space-y-2 border-t border-gray-800/50 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Progress</span>
            <span className="text-xs font-semibold text-blue-400">{completionPercentage}%</span>
          </div>
          <ProgressBar percentage={completionPercentage} />
        </div>
      </div>
    </Link>
  );
}
