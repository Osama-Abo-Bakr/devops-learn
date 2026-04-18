"use client";

import { useEffect, useRef } from "react";
import { useProgress } from "@/context/ProgressContext";

export default function LessonXPTracker() {
  const { addXP, updateStreak, getXPReward } = useProgress();
  const awarded = useRef(false);

  useEffect(() => {
    if (!awarded.current) {
      awarded.current = true;
      addXP(getXPReward("lessonComplete"));
      updateStreak();
    }
  }, [addXP, updateStreak, getXPReward]);

  return null;
}