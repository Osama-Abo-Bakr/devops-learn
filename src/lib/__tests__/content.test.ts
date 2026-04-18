import { getLessonContent, getContentBody, parseFrontmatter } from "../content";

describe("content utilities", () => {
  test("getLessonContent returns content for existing lesson", () => {
    const content = getLessonContent("en", "docker", "containers-101");
    expect(content).toBeTruthy();
    expect(content).toContain("---");
    expect(content).toContain("What Are Containers");
  });

  test("getLessonContent returns null for missing lesson", () => {
    const content = getLessonContent("en", "docker", "nonexistent-lesson");
    expect(content).toBeNull();
  });

  test("getContentBody strips frontmatter", () => {
    const raw = "---\ntitle: Test\n---\n# Hello";
    const body = getContentBody(raw);
    expect(body).toBe("# Hello");
  });

  test("getContentBody handles no frontmatter", () => {
    const raw = "# Hello";
    const body = getContentBody(raw);
    expect(body).toBe("# Hello");
  });

  test("parseFrontmatter extracts key-value pairs", () => {
    const raw = "---\ntitle: Test\nlevel: beginner\n---\nContent";
    const fm = parseFrontmatter(raw);
    expect(fm.title).toBe("Test");
    expect(fm.level).toBe("beginner");
  });

  test("parseFrontmatter returns empty object for no frontmatter", () => {
    const fm = parseFrontmatter("# No frontmatter");
    expect(Object.keys(fm).length).toBe(0);
  });
});