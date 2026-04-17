"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { LessonStatus, Level, ProgressState } from "@/types";

interface ProgressContextValue {
  progress: ProgressState;
  updateLessonStatus: (slug: string, status: LessonStatus) => void;
  updateQuizScore: (slug: string, score: number) => void;
  markChallengeCompleted: (slug: string) => void;
  setPlacementLevel: (level: Level) => void;
  getCompletionPercentage: (slugs: string[]) => number;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

function getEmptyProgress(): ProgressState {
  return {
    lessons: {},
    lastUpdated: new Date().toISOString(),
  };
}

function loadProgress(): ProgressState {
  if (typeof window === "undefined") return getEmptyProgress();
  try {
    const raw = localStorage.getItem("devops-learn-progress");
    if (!raw) return getEmptyProgress();
    return JSON.parse(raw) as ProgressState;
  } catch {
    return getEmptyProgress();
  }
}

function saveProgress(progress: ProgressState): void {
  if (typeof window === "undefined") return;
  progress.lastUpdated = new Date().toISOString();
  localStorage.setItem("devops-learn-progress", JSON.stringify(progress));
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(loadProgress);

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

  return (
    <ProgressContext.Provider
      value={{
        progress,
        updateLessonStatus,
        updateQuizScore,
        markChallengeCompleted,
        setPlacementLevel,
        getCompletionPercentage,
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