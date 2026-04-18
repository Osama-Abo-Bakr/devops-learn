"use client";

import { useEffect, useRef } from "react";
import { useProgress } from "@/context/ProgressContext";

interface LessonXPTrackerProps {
  lessonSlug: string;
}

export default function LessonXPTracker({ lessonSlug }: LessonXPTrackerProps) {
  const { addXP, updateStreak, getXPReward, loaded } = useProgress();
  const awarded = useRef(false);

  useEffect(() => {
    if (!loaded || awarded.current) return;
    awarded.current = true;
    addXP(getXPReward("lessonComplete"));
    updateStreak();
  }, [loaded, addXP, updateStreak, getXPReward, lessonSlug]);

  return null;
}