import type { Badge } from "@/types";

/** Human-readable condition labels (for reference / type safety) */
export type BadgeCondition =
  | "Complete 1 lesson"
  | "Complete all Docker beginner lessons"
  | "Complete all Compose lessons"
  | "Complete all K8s lessons"
  | "Complete all DevOps lessons"
  | "Complete all 20 lessons"
  | "Score 90%+ on any quiz"
  | "Score 100% on any quiz"
  | "3-day streak"
  | "7-day streak"
  | "30-day streak"
  | "Complete a custom exam"
  | "Complete a terminal challenge"
  | "Visit all 4 topic pages"
  | "Reach max level";

export const badges: Badge[] = [
  {
    id: "first-steps",
    name: "First Steps",
    icon: "\u{1F680}",
    condition: "Complete 1 lesson",
  },
  {
    id: "container-rookie",
    name: "Container Rookie",
    icon: "\u{1F433}",
    condition: "Complete all Docker beginner lessons",
  },
  {
    id: "compose-up",
    name: "Compose Up",
    icon: "\u{1F4E6}",
    condition: "Complete all Compose lessons",
  },
  {
    id: "pod-master",
    name: "Pod Master",
    icon: "\u{2638}\u{FE0F}",
    condition: "Complete all K8s lessons",
  },
  {
    id: "pipeline-builder",
    name: "Pipeline Builder",
    icon: "\u{1F527}",
    condition: "Complete all DevOps lessons",
  },
  {
    id: "full-stack",
    name: "Full Stack",
    icon: "\u{1F3C6}",
    condition: "Complete all 20 lessons",
  },
  {
    id: "quiz-ace",
    name: "Quiz Ace",
    icon: "\u{1F3AF}",
    condition: "Score 90%+ on any quiz",
  },
  {
    id: "perfect-score",
    name: "Perfect Score",
    icon: "\u{1F4AF}",
    condition: "Score 100% on any quiz",
  },
  {
    id: "streak-starter",
    name: "Streak Starter",
    icon: "\u{1F525}",
    condition: "3-day streak",
  },
  {
    id: "streak-blazer",
    name: "Streak Blazer",
    icon: "\u{26A1}",
    condition: "7-day streak",
  },
  {
    id: "streak-inferno",
    name: "Streak Inferno",
    icon: "\u{1F30B}",
    condition: "30-day streak",
  },
  {
    id: "exam-cracker",
    name: "Exam Cracker",
    icon: "\u{1F4DD}",
    condition: "Complete a custom exam",
  },
  {
    id: "terminal-hero",
    name: "Terminal Hero",
    icon: "\u{1F4BB}",
    condition: "Complete a terminal challenge",
  },
  {
    id: "explorer",
    name: "Explorer",
    icon: "\u{1F9ED}",
    condition: "Visit all 4 topic pages",
  },
  {
    id: "level-10",
    name: "Level 10",
    icon: "\u{1F451}",
    condition: "Reach max level",
  },
];

/** Look up a badge by its unique id */
export function getBadgeById(id: string): Badge | undefined {
  return badges.find((b) => b.id === id);
}