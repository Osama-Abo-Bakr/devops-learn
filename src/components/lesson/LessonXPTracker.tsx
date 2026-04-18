"use client";

import { useEffect, useRef } from "react";
import { useProgress } from "@/context/ProgressContext";

export default function LessonXPTracker() {
  const { updateStreak, loaded } = useProgress();
  const streakUpdated = useRef(false);

  useEffect(() => {
    if (!loaded || streakUpdated.current) return;
    streakUpdated.current = true;
    updateStreak();
  }, [loaded, updateStreak]);

  return null;
}