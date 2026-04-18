import { getLevelByXP } from "@/data/levels";
import type { ProgressState } from "@/types";

/** XP rewards for each action */
export const XP_REWARDS = {
  lessonComplete: 50,
  quizPass: 30,
  quizHighScore: 20, // bonus for 90%+
  challengeComplete: 40,
  dailyFirstAction: 10,
  examQuestion: 15,
} as const;

/** Add XP to progress state, applying streak multiplier if applicable */
export function addXP(
  progress: ProgressState,
  amount: number,
): { progress: ProgressState; xpGained: number } {
  const multiplier = getStreakMultiplier(progress);
  const xpGained = Math.round(amount * multiplier);

  progress.xp = (progress.xp ?? 0) + xpGained;
  progress.lastUpdated = new Date().toISOString();

  return { progress, xpGained };
}

/** Calculate streak multiplier based on current streak count */
export function getStreakMultiplier(progress: ProgressState): number {
  const streak = progress.streak?.count ?? 0;
  if (streak >= 7) return 2;
  if (streak >= 3) return 1.5;
  return 1;
}

/** Update streak — call on any user action. Returns updated progress. */
export function updateStreak(progress: ProgressState): ProgressState {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const streak = progress.streak ?? { count: 0, lastActionDate: null };

  if (streak.lastActionDate === today) {
    // Already acted today, no change
    return progress;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  const newCount =
    streak.lastActionDate === yesterdayStr ? streak.count + 1 : 1;

  progress.streak = { count: newCount, lastActionDate: today };
  progress.lastUpdated = new Date().toISOString();

  return progress;
}

/** Get current level info based on XP */
export function getCurrentLevel(progress: ProgressState) {
  const xp = progress.xp ?? 0;
  const level = getLevelByXP(xp);
  const nextLevelIndex = level.level; // levels array is 0-indexed
  const nextLevel =
    nextLevelIndex < 10
      ? { level: nextLevelIndex + 1, xpRequired: 0, title: "" }
      : null;

  // Import levels dynamically to avoid circular deps
  return {
    current: level,
    xp,
    xpForNextLevel: nextLevelIndex < 10
      ? [100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5000, Infinity][nextLevelIndex]
      : Infinity,
    progressInLevel: xp - level.xpRequired,
  };
}

/** Check which badges should be unlocked based on current progress */
export function checkBadges(progress: ProgressState): string[] {
  const earned = new Set(progress.badges ?? []);
  const newlyEarned: string[] = [];

  const totalCompleted = Object.values(progress.lessons).filter(
    (l) => l.status === "completed",
  ).length;

  const dockerBeginnerCompleted = [
    "containers-101",
    "dockerfile-basics",
    "volumes-networks",
  ].every(
    (s) => progress.lessons[s]?.status === "completed",
  );

  const composeCompleted = [
    "yaml-basics",
    "multi-service-stacks",
    "compose-networks-volumes",
    "env-scaling",
    "compose-production",
  ].every(
    (s) => progress.lessons[s]?.status === "completed",
  );

  const k8sCompleted = [
    "pods-deployments",
    "services-ingress",
    "configmaps-secrets",
    "hpa-scaling",
    "rbac-network-policies",
  ].every(
    (s) => progress.lessons[s]?.status === "completed",
  );

  const devopsCompleted = [
    "cicd-containers",
    "helm-charts",
    "monitoring-observability",
    "security-best-practices",
  ].every(
    (s) => progress.lessons[s]?.status === "completed",
  );

  const anyQuizHighScore = Object.values(progress.lessons).some(
    (l) => l.quizBestScore !== null && l.quizBestScore >= 90,
  );

  const anyQuizPerfect = Object.values(progress.lessons).some(
    (l) => l.quizBestScore === 100,
  );

  const anyChallengeCompleted = Object.values(progress.lessons).some(
    (l) => l.challengeCompleted,
  );

  const badgeChecks: [string, boolean][] = [
    ["first-steps", totalCompleted >= 1],
    ["container-rookie", dockerBeginnerCompleted],
    ["compose-up", composeCompleted],
    ["pod-master", k8sCompleted],
    ["pipeline-builder", devopsCompleted],
    ["full-stack", totalCompleted >= 20],
    ["quiz-ace", anyQuizHighScore],
    ["perfect-score", anyQuizPerfect],
    ["streak-starter", (progress.streak?.count ?? 0) >= 3],
    ["streak-blazer", (progress.streak?.count ?? 0) >= 7],
    ["streak-inferno", (progress.streak?.count ?? 0) >= 30],
    ["terminal-hero", anyChallengeCompleted],
    ["level-10", (progress.xp ?? 0) >= 5000],
  ];

  for (const [badgeId, condition] of badgeChecks) {
    if (condition && !earned.has(badgeId)) {
      newlyEarned.push(badgeId);
    }
  }

  return newlyEarned;
}

/** XP needed for each level transition (for progress bar) */
export const XP_THRESHOLDS = [
  0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5000,
];