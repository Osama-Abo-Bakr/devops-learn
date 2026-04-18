interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  fullHeight?: boolean;
}

export default function LoadingSpinner({
  message = "Loading...",
  size = "md",
  fullHeight = true,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-6 w-6 border",
    md: "h-10 w-10 border-2",
    lg: "h-14 w-14 border-3",
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${fullHeight ? "min-h-[300px]" : ""}`}>
      {/* Outer rotating ring */}
      <div className={`relative ${sizeClasses[size]} rounded-full border-gray-600 border-t-blue-500 animate-spin`}>
        {/* Inner pulsing ring */}
        <div className="absolute inset-0 rounded-full border border-gray-700/50 animate-pulse" />
        
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-1.5 w-1.5 rounded-full bg-blue-500/50 animate-pulse" />
        </div>
      </div>

      {message && (
        <div className="text-center">
          <p className="text-sm font-medium text-gray-300">{message}</p>
          <div className="mt-2 flex justify-center gap-1">
            <div className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
            <div className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: "0.1s" }} />
            <div className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: "0.2s" }} />
          </div>
        </div>
      )}
    </div>
  );
}
