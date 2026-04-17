import type { LessonProgress, LessonStatus, Level, ProgressState } from "@/types";

const STORAGE_KEY = "devops-learn-progress";

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function getEmptyProgress(): ProgressState {
  return {
    lessons: {},
    lastUpdated: new Date().toISOString(),
  };
}

export function getProgress(): ProgressState {
  const storage = getStorage();
  if (!storage) return getEmptyProgress();

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return getEmptyProgress();
    return JSON.parse(raw) as ProgressState;
  } catch {
    return getEmptyProgress();
  }
}

function saveProgress(progress: ProgressState): void {
  const storage = getStorage();
  if (!storage) return;

  progress.lastUpdated = new Date().toISOString();
  storage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function updateLessonStatus(
  slug: string,
  status: LessonStatus,
): ProgressState {
  const progress = getProgress();
  const existing = progress.lessons[slug];

  progress.lessons[slug] = {
    slug,
    status,
    quizBestScore: existing?.quizBestScore ?? null,
    challengeCompleted: existing?.challengeCompleted ?? false,
    updatedAt: new Date().toISOString(),
  };

  saveProgress(progress);
  return progress;
}

export function updateQuizScore(
  slug: string,
  score: number,
): ProgressState {
  const progress = getProgress();
  const existing = progress.lessons[slug];

  const currentBest = existing?.quizBestScore;
  const bestScore = currentBest !== null ? Math.max(currentBest, score) : score;

  progress.lessons[slug] = {
    slug,
    status: existing?.status ?? "in_progress",
    quizBestScore: bestScore,
    challengeCompleted: existing?.challengeCompleted ?? false,
    updatedAt: new Date().toISOString(),
  };

  saveProgress(progress);
  return progress;
}

export function markChallengeCompleted(slug: string): ProgressState {
  const progress = getProgress();
  const existing = progress.lessons[slug];

  progress.lessons[slug] = {
    slug,
    status: existing?.status ?? "in_progress",
    quizBestScore: existing?.quizBestScore ?? null,
    challengeCompleted: true,
    updatedAt: new Date().toISOString(),
  };

  saveProgress(progress);
  return progress;
}

export function getQuizBestScore(slug: string): number | null {
  return getProgress().lessons[slug]?.quizBestScore ?? null;
}

export function getLessonStatus(slug: string): LessonStatus {
  return getProgress().lessons[slug]?.status ?? "not_started";
}

export function setPlacementLevel(level: Level): ProgressState {
  const progress = getProgress();
  progress.placementLevel = level;
  saveProgress(progress);
  return progress;
}

export function getPlacementLevel(): Level | undefined {
  return getProgress().placementLevel;
}

export function getCompletionPercentage(slugs: string[]): number {
  if (slugs.length === 0) return 0;
  const progress = getProgress();
  const completed = slugs.filter(
    (s) => progress.lessons[s]?.status === "completed",
  ).length;
  return Math.round((completed / slugs.length) * 100);
}