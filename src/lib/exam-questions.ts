import { getQuiz } from "@/data";
import modules from "@/data/modules";
import type { Topic, Level, QuizQuestion } from "@/types";

export function getCuratedQuestions(
  topics: Topic[],
  level: Level,
  maxCount: number,
): QuizQuestion[] {
  const pool: QuizQuestion[] = [];

  for (const topic of topics) {
    const mod = modules[topic];
    const lessons = mod.lessons.filter((l) => l.level === level && l.quiz);
    for (const lesson of lessons) {
      const quiz = getQuiz(lesson.quiz!);
      if (quiz) pool.push(...quiz.questions);
    }
  }

  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, maxCount);
}