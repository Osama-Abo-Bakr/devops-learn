import { cheatsheetData } from "../cheatsheet";

describe("cheatsheet data", () => {
  test("has all four topics", () => {
    const topics = new Set(cheatsheetData.map((c) => c.topic));
    expect(topics.has("docker")).toBe(true);
    expect(topics.has("compose")).toBe(true);
    expect(topics.has("kubernetes")).toBe(true);
    expect(topics.has("devops")).toBe(true);
  });

  test("every command has required fields", () => {
    cheatsheetData.forEach((cat) => {
      expect(cat.category).toBeTruthy();
      cat.commands.forEach((cmd) => {
        expect(cmd.command).toBeTruthy();
        expect(cmd.description).toBeTruthy();
        expect(cmd.example).toBeTruthy();
      });
    });
  });

  test("docker has 6+ categories", () => {
    const dockerCats = cheatsheetData.filter((c) => c.topic === "docker");
    expect(dockerCats.length).toBeGreaterThanOrEqual(6);
  });

  test("compose has 3+ categories", () => {
    const composeCats = cheatsheetData.filter((c) => c.topic === "compose");
    expect(composeCats.length).toBeGreaterThanOrEqual(3);
  });

  test("kubernetes has 5+ categories", () => {
    const k8sCats = cheatsheetData.filter((c) => c.topic === "kubernetes");
    expect(k8sCats.length).toBeGreaterThanOrEqual(5);
  });
});