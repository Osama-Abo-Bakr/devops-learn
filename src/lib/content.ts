import fs from "fs";
import path from "path";
import type { Locale, Lesson } from "@/types";

const contentDir = path.join(process.cwd(), "content");

const contentCache = new Map<string, { data: string | null; ts: number }>();
const slugsCache = new Map<string, { data: string[]; ts: number }>();
const CACHE_TTL = 60_000; // 1 minute

export function getLessonContent(
  locale: Locale,
  topic: string,
  slug: string,
): string | null {
  const key = `${locale}/${topic}/${slug}`;
  const cached = contentCache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;

  const filePath = path.join(contentDir, locale, topic, `${slug}.mdx`);
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    contentCache.set(key, { data, ts: Date.now() });
    return data;
  } catch {
    contentCache.set(key, { data: null, ts: Date.now() });
    return null;
  }
}

export function getLessonSlugs(
  locale: Locale,
  topic: string,
): string[] {
  const key = `${locale}/${topic}`;
  const cached = slugsCache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;

  const topicDir = path.join(contentDir, locale, topic);
  try {
    const files = fs.readdirSync(topicDir);
    const data = files
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => f.replace(/\.mdx$/, ""));
    slugsCache.set(key, { data, ts: Date.now() });
    return data;
  } catch {
    slugsCache.set(key, { data: [], ts: Date.now() });
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