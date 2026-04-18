import type { Badge } from "@/types";
import { badges } from "@/data/badges";

interface BadgeCardProps {
  badge: Badge;
  earned: boolean;
  unlockedAt?: string;
}

export default function BadgeCard({ badge, earned, unlockedAt }: BadgeCardProps) {
  return (
    <div
      className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-all ${
        earned
          ? "border-gray-600 bg-gray-800/80"
          : "border-gray-800 bg-gray-900/40 opacity-50"
      }`}
    >
      <span className={`text-2xl ${earned ? "" : "grayscale"}`}>
        {earned ? badge.icon : "🔒"}
      </span>
      <div>
        <div className={`text-xs font-medium ${earned ? "text-white" : "text-gray-600"}`}>
          {badge.name}
        </div>
        <div className="text-[10px] text-gray-500">{badge.condition}</div>
      </div>
      {earned && unlockedAt && (
        <div className="text-[9px] text-gray-600">
          {new Date(unlockedAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}