interface ProgressBarProps {
  percentage: number;
  className?: string;
  showLabel?: boolean;
  variant?: "default" | "compact";
}

export default function ProgressBar({
  percentage,
  className = "",
  showLabel = false,
  variant = "default",
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percentage));
  const isComplete = clamped === 100;

  return (
    <div className={className}>
      <div className={`relative w-full overflow-hidden rounded-full ${variant === "compact" ? "h-1.5" : "h-2.5"} bg-gray-800/50 backdrop-blur`}>
        {/* Background animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800/0 via-gray-700/30 to-gray-800/0"></div>

        {/* Progress fill */}
        <div
          className={`relative h-full rounded-full transition-all duration-500 ${
            isComplete
              ? "bg-gradient-to-r from-green-500 via-emerald-400 to-green-500"
              : "bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 shadow-lg shadow-blue-500/30"
          }`}
          style={{ width: `${clamped}%` }}
        >
          {/* Shimmer effect */}
          {clamped > 0 && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          )}
        </div>

        {/* Completion indicator */}
        {isComplete && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-green-400">✓</span>
          </div>
        )}
      </div>

      {/* Label */}
      {showLabel && (
        <div className="mt-1 flex justify-between text-xs">
          <span className="text-gray-400">Progress</span>
          <span className={`font-semibold ${isComplete ? "text-green-400" : "text-blue-400"}`}>
            {clamped}%
          </span>
        </div>
      )}
    </div>
  );
}
