"use client";

import { useProgress } from "@/context/ProgressContext";
import { badges } from "@/data/badges";
import BadgeCard from "./BadgeCard";

interface BadgeDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function BadgeDrawer({ open, onClose }: BadgeDrawerProps) {
  const { getBadges } = useProgress();
  const earnedIds = new Set(getBadges());

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-full w-[350px] overflow-y-auto border-l border-gray-800 bg-gray-950 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Badges</h2>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-700 px-2 py-1 text-sm text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Progress ring */}
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/20 text-lg font-bold text-blue-400">
            {earnedIds.size}
          </div>
          <div>
            <div className="text-sm font-medium text-white">
              {earnedIds.size} / {badges.length} Earned
            </div>
            <div className="text-xs text-gray-500">
              {earnedIds.size === badges.length
                ? "All badges collected! 🎉"
                : `${badges.length - earnedIds.size} badges remaining`}
            </div>
          </div>
        </div>

        {/* Badge grid */}
        <div className="grid grid-cols-3 gap-2">
          {badges.map((badge) => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              earned={earnedIds.has(badge.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
}