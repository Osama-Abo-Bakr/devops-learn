import type { Level } from "@/types";

const levelStyles: Record<Level, string> = {
  beginner: "bg-green-600/20 text-green-400 border-green-600/30",
  intermediate:
    "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
  advanced: "bg-red-600/20 text-red-400 border-red-600/30",
};

const levelLabels: Record<Level, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

interface LevelBadgeProps {
  level: Level;
  className?: string;
}

export default function LevelBadge({ level, className = "" }: LevelBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${levelStyles[level]} ${className}`}
    >
      {levelLabels[level]}
    </span>
  );
}