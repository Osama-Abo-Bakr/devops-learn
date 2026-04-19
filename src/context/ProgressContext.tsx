"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { LessonStatus, Level, ProgressState } from "@/types";
import {
  addXP as addXPLogic,
  updateStreak as updateStreakLogic,
  checkBadges,
  XP_REWARDS,
  getCurrentLevel,
  XP_THRESHOLDS,
} from "@/lib/xp";
import { getLevelByXP } from "@/data/levels";

interface ProgressContextValue {
  progress: ProgressState;
  loaded: boolean;
  updateLessonStatus: (slug: string, status: LessonStatus) => void;
  updateQuizScore: (slug: string, score: number) => void;
  markChallengeCompleted: (slug: string) => void;
  setPlacementLevel: (level: Level) => void;
  getCompletionPercentage: (slugs: string[]) => number;
  addXP: (amount: number) => number;
  updateStreak: () => void;
  getLevel: () => ReturnType<typeof getLevelByXP>;
  getXPInfo: () => {
    current: ReturnType<typeof getLevelByXP>;
    xp: number;
    xpForNextLevel: number;
    progressInLevel: number;
  };
  getBadges: () => string[];
  getXPReward: (key: keyof typeof XP_REWARDS) => number;
  recentBadges: string[];
  consumeRecentBadges: () => string[];
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

const STORAGE_KEY = "devops-learn-progress";

function getEmptyProgress(): ProgressState {
  return {
    lessons: {},
    lastUpdated: new Date().toISOString(),
  };
}

function loadProgress(): ProgressState {
  if (typeof window === "undefined") return getEmptyProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getEmptyProgress();
    return JSON.parse(raw) as ProgressState;
  } catch {
    return getEmptyProgress();
  }
}

function saveProgress(progress: ProgressState): void {
  if (typeof window === "undefined") return;
  progress.lastUpdated = new Date().toISOString();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage full
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  // Start with empty progress, then hydrate from localStorage in useEffect
  // to avoid SSR/client mismatch
  const [progress, setProgress] = useState<ProgressState>(getEmptyProgress);
  const [loaded, setLoaded] = useState(false);
  const [recentBadges, setRecentBadges] = useState<string[]>([]);

  // Hydrate progress from localStorage after mount
  useEffect(() => {
    const stored = loadProgress();
    setProgress(stored);
    setLoaded(true);
  }, []);

  const updateLessonStatus = useCallback(
    (slug: string, status: LessonStatus) => {
      setProgress((prev) => {
        const existing = prev.lessons[slug];
        const next = {
          ...prev,
          lessons: {
            ...prev.lessons,
            [slug]: {
              slug,
              status,
              quizBestScore: existing?.quizBestScore ?? null,
              challengeCompleted: existing?.challengeCompleted ?? false,
              updatedAt: new Date().toISOString(),
            },
          },
        };
        saveProgress(next);
        return next;
      });
    },
    [],
  );

  const updateQuizScore = useCallback((slug: string, score: number) => {
    setProgress((prev) => {
      const existing = prev.lessons[slug];
      const currentBest = existing?.quizBestScore ?? null;
      const bestScore = currentBest !== null ? Math.max(currentBest, score) : score;
      const next = {
        ...prev,
        lessons: {
          ...prev.lessons,
          [slug]: {
            slug,
            status: existing?.status ?? "in_progress",
            quizBestScore: bestScore,
            challengeCompleted: existing?.challengeCompleted ?? false,
            updatedAt: new Date().toISOString(),
          },
        },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const markChallengeCompleted = useCallback((slug: string) => {
    setProgress((prev) => {
      const existing = prev.lessons[slug];
      const next = {
        ...prev,
        lessons: {
          ...prev.lessons,
          [slug]: {
            slug,
            status: existing?.status ?? "in_progress",
            quizBestScore: existing?.quizBestScore ?? null,
            challengeCompleted: true,
            updatedAt: new Date().toISOString(),
          },
        },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const setPlacementLevel = useCallback((level: Level) => {
    setProgress((prev) => {
      const next = { ...prev, placementLevel: level };
      saveProgress(next);
      return next;
    });
  }, []);

  const getCompletionPercentage = useCallback(
    (slugs: string[]) => {
      if (slugs.length === 0) return 0;
      const completed = slugs.filter(
        (s) => progress.lessons[s]?.status === "completed",
      ).length;
      return Math.round((completed / slugs.length) * 100);
    },
    [progress],
  );

  const addXP = useCallback((amount: number): number => {
    let xpGained = 0;
    setProgress((prev) => {
      const result = addXPLogic({ ...prev, lessons: { ...prev.lessons } }, amount);
      xpGained = result.xpGained;
      // Check for new badges
      const newBadges = checkBadges(result.progress);
      if (newBadges.length > 0) {
        result.progress.badges = [
          ...(result.progress.badges ?? []),
          ...newBadges,
        ];
        setRecentBadges((prev) => [...prev, ...newBadges]);
      }
      saveProgress(result.progress);
      return result.progress;
    });
    return xpGained;
  }, []);

  const handleUpdateStreak = useCallback(() => {
    setProgress((prev) => {
      const next = updateStreakLogic({ ...prev, lessons: { ...prev.lessons } });
      // Check for streak badges
      const newBadges = checkBadges(next);
      if (newBadges.length > 0) {
        next.badges = [...(next.badges ?? []), ...newBadges];
        setRecentBadges((prev) => [...prev, ...newBadges]);
      }
      saveProgress(next);
      return next;
    });
  }, []);

  const getLevel = useCallback(() => {
    const xp = progress.xp ?? 0;
    return getLevelByXP(xp);
  }, [progress.xp]);

  const getXPInfo = useCallback(() => {
    return getCurrentLevel(progress);
  }, [progress]);

  const getBadges = useCallback(() => {
    return progress.badges ?? [];
  }, [progress.badges]);

  const getXPReward = useCallback((key: keyof typeof XP_REWARDS) => {
    return XP_REWARDS[key];
  }, []);

  const consumeRecentBadges = useCallback(() => {
    const badges = [...recentBadges];
    setRecentBadges([]);
    return badges;
  }, [recentBadges]);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        loaded,
        updateLessonStatus,
        updateQuizScore,
        markChallengeCompleted,
        setPlacementLevel,
        getCompletionPercentage,
        addXP,
        updateStreak: handleUpdateStreak,
        getLevel,
        getXPInfo,
        getBadges,
        getXPReward,
        recentBadges,
        consumeRecentBadges,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}

export { XP_REWARDS, XP_THRESHOLDS };