import fs from "fs";
import path from "path";
import type { Locale, Lesson } from "@/types";

const contentDir = path.join(process.cwd(), "content");

export function getLessonContent(
  locale: Locale,
  topic: string,
  slug: string,
): string | null {
  const filePath = path.join(contentDir, locale, topic, `${slug}.mdx`);
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

export function getLessonSlugs(
  locale: Locale,
  topic: string,
): string[] {
  const topicDir = path.join(contentDir, locale, topic);
  try {
    const files = fs.readdirSync(topicDir);
    return files
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => f.replace(/\.mdx$/, ""));
  } catch {
    return [];
  }
}

export function parseFrontmatter(raw: string): Record<string, string> {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const frontmatter: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const [key, ...rest] = line.split(":");
    if (key && rest.length) {
      frontmatter[key.trim()] = rest.join(":").trim();
    }
  }
  return frontmatter;
}

export function getContentBody(raw: string): string {
  const match = raw.match(/^---\n[\s\S]*?\n---\n?/);
  return match ? raw.slice(match[0].length) : raw;
}