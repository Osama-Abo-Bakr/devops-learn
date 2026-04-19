"use client";

import { useEffect, useState, useCallback } from "react";
import confetti from "canvas-confetti";

const motivationalMessages = {
  perfect: [
    "Perfect Score! You're a genius! 🏆",
    "Flawless! Nothing gets past you! 🌟",
    "100%! Absolute mastery! 👑",
  ],
  excellent: [
    "Excellent work! You crushed it! 🎉",
    "Outstanding! You know your stuff! 💪",
    "Brilliant performance! Keep it up! 🔥",
  ],
  good: [
    "Great job! You passed! ✨",
    "Well done! You're making progress! 🚀",
    "Nice work! Keep learning! 📚",
  ],
  badge: [
    "New Badge Unlocked! 🏅",
    "Achievement Unlocked! ⭐",
    "You earned a new badge! 🎖️",
  ],
};

function getRandomMessage(category: keyof typeof motivationalMessages): string {
  const messages = motivationalMessages[category];
  return messages[Math.floor(Math.random() * messages.length)];
}

interface CelebrationEffectProps {
  trigger: boolean;
  score?: number;
  newBadges?: string[];
  xpGained?: number;
  onDone?: () => void;
}

export default function CelebrationEffect({
  trigger,
  score,
  newBadges,
  xpGained,
  onDone,
}: CelebrationEffectProps) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [showBadges, setShowBadges] = useState(false);

  const fireConfetti = useCallback(() => {
    const isPerfect = score === 100;

    // First burst - center
    confetti({
      particleCount: isPerfect ? 150 : 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"],
    });

    // Second burst - delayed, sides
    setTimeout(() => {
      confetti({
        particleCount: isPerfect ? 100 : 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#3b82f6", "#8b5cf6", "#10b981"],
      });
      confetti({
        particleCount: isPerfect ? 100 : 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#f59e0b", "#ef4444", "#10b981"],
      });
    }, 250);

    // Perfect score gets a third burst
    if (isPerfect) {
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 100,
          origin: { y: 0.4 },
          colors: ["#fbbf24", "#f59e0b", "#fcd34d"],
        });
      }, 500);
    }
  }, [score]);

  useEffect(() => {
    if (!trigger) return;

    const category = score === 100 ? "perfect" : score !== undefined && score >= 80 ? "excellent" : "good";
    setMessage(getRandomMessage(category));
    setVisible(true);
    fireConfetti();

    if (newBadges && newBadges.length > 0) {
      setTimeout(() => setShowBadges(true), 1200);
    }

    const timer = setTimeout(() => {
      setVisible(false);
      setShowBadges(false);
      onDone?.();
    }, 4500);

    return () => clearTimeout(timer);
  }, [trigger, score, newBadges, fireConfetti, onDone]);

  if (!visible) return null;

  const isPass = score === undefined || score >= 70;
  if (!isPass) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="animate-bounce-in rounded-2xl border border-green-500/30 bg-gradient-to-b from-gray-900/95 to-gray-950/95 p-8 text-center shadow-2xl shadow-green-500/20 backdrop-blur-sm pointer-events-auto">
        <div className="mb-3 text-5xl">
          {score === 100 ? "👑" : score !== undefined && score >= 80 ? "🏆" : "🎉"}
        </div>
        <p className="mb-2 text-2xl font-bold text-white">{message}</p>
        {score !== undefined && (
          <p className="mb-4 text-lg font-semibold text-green-400">{score}% Score</p>
        )}
        {xpGained !== undefined && xpGained > 0 && (
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1">
            <span className="text-sm text-blue-400">+{xpGained} XP</span>
          </div>
        )}
        {showBadges && newBadges && newBadges.length > 0 && (
          <div className="mt-3 space-y-2">
            {newBadges.map((badge) => (
              <div
                key={badge}
                className="animate-fade-in-up inline-flex items-center gap-2 rounded-full bg-purple-500/20 px-4 py-1.5"
              >
                <span className="text-lg">🏅</span>
                <span className="text-sm font-medium text-purple-300">
                  {getRandomMessage("badge")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}