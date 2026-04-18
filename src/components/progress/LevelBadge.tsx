import type { Level } from "@/types";

const levelStyles: Record<Level, { bg: string; text: string; border: string; icon: string }> = {
  beginner: {
    bg: "bg-emerald-600/15",
    text: "text-emerald-300",
    border: "border-emerald-600/30",
    icon: "🌱",
  },
  intermediate: {
    bg: "bg-amber-600/15",
    text: "text-amber-300",
    border: "border-amber-600/30",
    icon: "📈",
  },
  advanced: {
    bg: "bg-rose-600/15",
    text: "text-rose-300",
    border: "border-rose-600/30",
    icon: "🚀",
  },
};

const levelLabels: Record<Level, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

interface LevelBadgeProps {
  level: Level;
  className?: string;
  showIcon?: boolean;
}

export default function LevelBadge({ level, className = "", showIcon = true }: LevelBadgeProps) {
  const styles = levelStyles[level];
  
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border backdrop-blur px-3 py-1 text-xs font-semibold transition-all duration-300 hover:shadow-lg ${styles.bg} ${styles.text} ${styles.border} border ${className}`}
    >
      {showIcon && <span className="text-sm">{styles.icon}</span>}
      {levelLabels[level]}
    </span>
  );
}
