"use client";

import { useState } from "react";
import { useProgress } from "@/context/ProgressContext";
import { XP_THRESHOLDS } from "@/lib/xp";
import { getLevelByXP } from "@/data/levels";
import BadgeDrawer from "./BadgeDrawer";

export default function StreakXPBar() {
  const { progress, getXPInfo, getBadges } = useProgress();
  const [showBadges, setShowBadges] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const xp = progress.xp ?? 0;
  const streak = progress.streak?.count ?? 0;
  const level = getLevelByXP(xp);
  const xpInfo = getXPInfo();
  const earnedBadges = getBadges();

  // Calculate XP progress within current level
  const currentLevelXP = level.xpRequired;
  const nextLevelXP = xpInfo.xpForNextLevel;
  const progressInLevel = xp - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;
  const progressPercent =
    nextLevelXP === Infinity ? 100 : Math.round((progressInLevel / xpNeeded) * 100);

  const streakMultiplier = streak >= 7 ? 2 : streak >= 3 ? 1.5 : 1;

  return (
    <>
      <div className="border-b border-gray-800 bg-gray-900/95 backdrop-blur">
        {/* Mobile: collapsed view */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:hidden">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm text-gray-300"
          >
            <span className="text-base">🔥</span>
            <span className="font-medium">{streak}</span>
            <span className="text-gray-500">|</span>
            <span className="text-xs font-medium text-blue-400">
              L{level.level}
            </span>
          </button>
          <button
            onClick={() => setShowBadges(true)}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-white"
          >
            <span>🏆</span>
            <span className="text-xs">{earnedBadges.length}/15</span>
          </button>
        </div>

        {/* Expanded mobile / Desktop view */}
        <div
          className={`mx-auto flex max-w-7xl items-center gap-4 px-4 py-2 sm:flex ${
            expanded ? "flex" : "hidden sm:flex"
          }`}
        >
          {/* Streak */}
          <div className="flex items-center gap-1.5 min-w-[80px]">
            <span className="text-lg">🔥</span>
            <div>
              <div className="text-sm font-bold text-white">{streak}</div>
              <div className="text-[10px] text-gray-500 leading-none">day streak</div>
            </div>
            {streakMultiplier > 1 && (
              <span className="ml-1 rounded bg-amber-500/20 px-1 text-[10px] font-bold text-amber-400">
                {streakMultiplier}x
              </span>
            )}
          </div>

          {/* Level + XP bar */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-xs font-medium text-white">
                L{level.level} {level.title}
              </span>
              <span className="text-[11px] text-gray-400">
                {xp}/{nextLevelXP === Infinity ? "MAX" : nextLevelXP} XP
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Badges button */}
          <button
            onClick={() => setShowBadges(true)}
            className="flex items-center gap-1.5 rounded-lg border border-gray-700 px-2.5 py-1.5 text-sm text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
          >
            <span>🏆</span>
            <span className="text-xs font-medium">{earnedBadges.length}/15</span>
          </button>
        </div>
      </div>

      <BadgeDrawer
        open={showBadges}
        onClose={() => setShowBadges(false)}
      />
    </>
  );
}