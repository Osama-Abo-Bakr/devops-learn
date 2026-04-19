import { quizMap } from "../index";

describe("quiz validation", () => {
  const entries = Object.entries(quizMap);

  test("every quiz has a valid ID matching its map key", () => {
    entries.forEach(([key, quiz]) => {
      expect(quiz.id).toBe(key);
    });
  });

  test("every quiz has at least 5 questions", () => {
    entries.forEach(([key, quiz]) => {
      expect(quiz.questions.length).toBeGreaterThanOrEqual(5);
    });
  });

  test("every question has exactly 4 options", () => {
    entries.forEach(([key, quiz]) => {
      quiz.questions.forEach((q) => {
        expect(q.options.length).toBe(4);
      });
    });
  });

  test("correctIndex is within valid range (0-3)", () => {
    entries.forEach(([key, quiz]) => {
      quiz.questions.forEach((q) => {
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThanOrEqual(3);
      });
    });
  });

  test("no duplicate question IDs within a quiz", () => {
    entries.forEach(([key, quiz]) => {
      const ids = quiz.questions.map((q) => q.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });
  });

  test("all questions have non-empty explanations", () => {
    entries.forEach(([key, quiz]) => {
      quiz.questions.forEach((q) => {
        expect(q.explanation.length).toBeGreaterThan(10);
      });
    });
  });

  test("all questions have non-empty question text", () => {
    entries.forEach(([key, quiz]) => {
      quiz.questions.forEach((q) => {
        expect(q.question.length).toBeGreaterThan(10);
      });
    });
  });

  test("all options have non-empty text", () => {
    entries.forEach(([key, quiz]) => {
      quiz.questions.forEach((q) => {
        q.options.forEach((option, i) => {
          expect(option.length).toBeGreaterThan(0);
        });
      });
    });
  });

  test("every quiz has a lesson slug", () => {
    entries.forEach(([key, quiz]) => {
      expect(quiz.lessonSlug).toBeTruthy();
    });
  });

  test("every quiz has a title", () => {
    entries.forEach(([key, quiz]) => {
      expect(quiz.title).toBeTruthy();
    });
  });
});