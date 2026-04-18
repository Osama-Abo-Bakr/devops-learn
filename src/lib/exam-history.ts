import type { ExamHistoryEntry } from "@/types";

const STORAGE_KEY = "devops-learn-exam-history";
const MAX_ENTRIES = 50;

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export function getExamHistory(): ExamHistoryEntry[] {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ExamHistoryEntry[];
  } catch {
    return [];
  }
}

export function addExamHistory(entry: ExamHistoryEntry): void {
  const storage = getStorage();
  if (!storage) return;

  try {
    const history = getExamHistory();
    history.unshift(entry);
    if (history.length > MAX_ENTRIES) history.length = MAX_ENTRIES;
    storage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // localStorage full or unavailable — skip silently
  }
}

export function clearExamHistory(): void {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(STORAGE_KEY);
}