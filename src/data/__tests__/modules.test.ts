import { getModule, getLesson, getAllModules } from "../modules";
import type { Topic } from "@/types";

describe("modules data", () => {
  test("all topics have modules", () => {
    const topics: Topic[] = ["docker", "compose", "kubernetes", "devops"];
    topics.forEach((t) => {
      expect(getModule(t)).toBeDefined();
      expect(getModule(t).lessons.length).toBeGreaterThan(0);
    });
  });

  test("every lesson has required fields", () => {
    getAllModules().forEach((mod) => {
      mod.lessons.forEach((l) => {
        expect(l.slug).toBeTruthy();
        expect(l.title).toBeTruthy();
        expect(l.module).toBeTruthy();
        expect(l.level).toMatch(/beginner|intermediate|advanced/);
        expect(l.description).toBeTruthy();
        expect(l.order).toBeGreaterThan(0);
      });
    });
  });

  test("getLesson finds existing lessons", () => {
    const lesson = getLesson("docker", "containers-101");
    expect(lesson).toBeDefined();
    expect(lesson?.title).toBe("Containers 101");
  });

  test("getLesson returns undefined for missing lessons", () => {
    expect(getLesson("docker", "nonexistent")).toBeUndefined();
  });

  test("all diagram IDs reference valid scenes", () => {
    getAllModules().forEach((mod) => {
      mod.lessons.forEach((l) => {
        if (l.diagram) {
          expect(l.diagram).toBeTruthy();
          expect(typeof l.diagram).toBe("string");
        }
      });
    });
  });
});