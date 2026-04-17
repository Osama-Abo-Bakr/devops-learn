interface ProgressBarProps {
  percentage: number;
  className?: string;
}

export default function ProgressBar({
  percentage,
  className = "",
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percentage));

  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-gray-800 ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}