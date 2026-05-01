import fs from "fs";
import path from "path";
import { unstable_cache } from "next/cache";
import type { Locale } from "@/types";

const contentDir = path.join(process.cwd(), "content");
const REVALIDATE = 3600; // 1 hour

export function readLessonContent(
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

function readLessonSlugs(locale: Locale, topic: string): string[] {
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

export const getLessonContent = unstable_cache(
  async (locale: Locale, topic: string, slug: string) =>
    readLessonContent(locale, topic, slug),
  ["lesson-content"],
  { revalidate: REVALIDATE },
);

export const getLessonSlugs = unstable_cache(
  async (locale: Locale, topic: string) => readLessonSlugs(locale, topic),
  ["lesson-slugs"],
  { revalidate: REVALIDATE },
);

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