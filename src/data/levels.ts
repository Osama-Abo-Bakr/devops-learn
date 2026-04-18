import type { XPLevel } from "@/types";

export const levels: XPLevel[] = [
  { level: 1, xpRequired: 0, title: "Docker Trainee" },
  { level: 2, xpRequired: 100, title: "Container Operator" },
  { level: 3, xpRequired: 300, title: "Image Builder" },
  { level: 4, xpRequired: 600, title: "Compose Commander" },
  { level: 5, xpRequired: 1000, title: "Pod Pilot" },
  { level: 6, xpRequired: 1500, title: "Cluster Admin" },
  { level: 7, xpRequired: 2200, title: "Helm Navigator" },
  { level: 8, xpRequired: 3000, title: "CI/CD Architect" },
  { level: 9, xpRequired: 4000, title: "DevOps Engineer" },
  { level: 10, xpRequired: 5000, title: "Platform Overlord" },
];

/**
 * Return the highest XPLevel whose xpRequired is <= the given xp.
 * Always returns at least level 1 (0 XP).
 */
export function getLevelByXP(xp: number): XPLevel {
  let result = levels[0];
  for (const lvl of levels) {
    if (xp >= lvl.xpRequired) {
      result = lvl;
    } else {
      break;
    }
  }
  return result;
}