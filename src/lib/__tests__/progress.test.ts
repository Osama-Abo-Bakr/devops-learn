import { describe, it, expect } from "vitest";
import type { ProgressState } from "@/types";

const STORAGE_KEY = "devops-learn-progress";

function getEmptyProgress(): ProgressState {
  return { lessons: {}, lastUpdated: new Date().toISOString() };
}

function parseProgress(raw: string | null): ProgressState {
  if (!raw) return getEmptyProgress();
  try {
    return JSON.parse(raw) as ProgressState;
  } catch {
    return getEmptyProgress();
  }
}

function serializeProgress(progress: ProgressState): string {
  progress.lastUpdated = new Date().toISOString();
  return JSON.stringify(progress);
}

describe("progress logic", () => {
  function updateLessonStatus(
    state: ProgressState,
    slug: string,
    status: "not_started" | "in_progress" | "completed",
  ): ProgressState {
    const existing = state.lessons[slug];
    return {
      ...state,
      lessons: {
        ...state.lessons,
        [slug]: {
          slug,
          status,
          quizBestScore: existing?.quizBestScore ?? null,
          challengeCompleted: existing?.challengeCompleted ?? false,
          updatedAt: new Date().toISOString(),
        },
      },
    };
  }

  function updateQuizScore(
    state: ProgressState,
    slug: string,
    score: number,
  ): ProgressState {
    const existing = state.lessons[slug];
    const currentBest = existing?.quizBestScore ?? null;
    const bestScore = currentBest !== null ? Math.max(currentBest, score) : score;

    return {
      ...state,
      lessons: {
        ...state.lessons,
        [slug]: {
          slug,
          status: existing?.status ?? "in_progress",
          quizBestScore: bestScore,
          challengeCompleted: existing?.challengeCompleted ?? false,
          updatedAt: new Date().toISOString(),
        },
      },
    };
  }

  function getCompletionPercentage(
    state: ProgressState,
    slugs: string[],
  ): number {
    if (slugs.length === 0) return 0;
    const completed = slugs.filter(
      (s) => state.lessons[s]?.status === "completed",
    ).length;
    return Math.round((completed / slugs.length) * 100);
  }

  it("starts with empty progress", () => {
    const progress = getEmptyProgress();
    expect(progress.lessons).toEqual({});
    expect(progress.placementLevel).toBeUndefined();
  });

  it("sets lesson status to in_progress", () => {
    const progress = updateLessonStatus(getEmptyProgress(), "test", "in_progress");
    expect(progress.lessons["test"].status).toBe("in_progress");
  });

  it("sets lesson status to completed", () => {
    const progress = updateLessonStatus(getEmptyProgress(), "test", "completed");
    expect(progress.lessons["test"].status).toBe("completed");
  });

  it("preserves quiz score when updating status", () => {
    let state = updateQuizScore(getEmptyProgress(), "test", 80);
    state = updateLessonStatus(state, "test", "completed");
    expect(state.lessons["test"].quizBestScore).toBe(80);
  });

  it("records and keeps best quiz score", () => {
    let state = updateQuizScore(getEmptyProgress(), "test", 60);
    state = updateQuizScore(state, "test", 80);
    expect(state.lessons["test"].quizBestScore).toBe(80);
  });

  it("does not lower the best score", () => {
    let state = updateQuizScore(getEmptyProgress(), "test", 90);
    state = updateQuizScore(state, "test", 70);
    expect(state.lessons["test"].quizBestScore).toBe(90);
  });

  it("marks challenge as completed", () => {
    let state = updateLessonStatus(getEmptyProgress(), "test", "in_progress");
    state = {
      ...state,
      lessons: {
        ...state.lessons,
        test: { ...state.lessons["test"], challengeCompleted: true },
      },
    };
    expect(state.lessons["test"].challengeCompleted).toBe(true);
  });

  it("returns null best score when no quiz attempted", () => {
    const state = getEmptyProgress();
    expect(state.lessons["nonexistent"]?.quizBestScore ?? null).toBeNull();
  });

  it("calculates 0% for empty lesson list", () => {
    expect(getCompletionPercentage(getEmptyProgress(), [])).toBe(0);
  });

  it("calculates 0% when no lessons completed", () => {
    expect(getCompletionPercentage(getEmptyProgress(), ["a", "b"])).toBe(0);
  });

  it("calculates 50% when half completed", () => {
    let state = updateLessonStatus(getEmptyProgress(), "a", "completed");
    state = updateLessonStatus(state, "b", "in_progress");
    expect(getCompletionPercentage(state, ["a", "b"])).toBe(50);
  });

  it("calculates 100% when all completed", () => {
    let state = updateLessonStatus(getEmptyProgress(), "a", "completed");
    state = updateLessonStatus(state, "b", "completed");
    expect(getCompletionPercentage(state, ["a", "b"])).toBe(100);
  });

  it("serializes and deserializes progress", () => {
    let state = updateLessonStatus(getEmptyProgress(), "test", "completed");
    state = updateQuizScore(state, "test", 85);
    const serialized = serializeProgress(state);
    const restored = parseProgress(serialized);
    expect(restored.lessons["test"].status).toBe("completed");
    expect(restored.lessons["test"].quizBestScore).toBe(85);
  });

  it("sets placement level", () => {
    const state = { ...getEmptyProgress(), placementLevel: "intermediate" as const };
    expect(state.placementLevel).toBe("intermediate");
  });
});