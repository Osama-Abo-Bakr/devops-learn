import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { getQuiz } from "@/data/index";
import modules from "@/data/modules";
import { getLessonContent, getContentBody } from "@/lib/content";
import { rateLimit } from "@/lib/rate-limit";
import type { Topic, Level, QuizQuestion } from "@/types";

const examLimiter = rateLimit({ windowMs: 86_400_000, maxRequests: 5 });

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const EXAM_SYSTEM_PROMPT = `You are a DevOps exam generator. Generate multiple-choice questions about DevOps topics.

REQUIREMENTS:
- Each question MUST have exactly 4 options.
- Each question MUST have a correctIndex (0-based index of the correct option, 0-3).
- Each question MUST have an explanation (1-3 sentences).
- Each question MUST have a unique id starting with "ai-" followed by a number.
- Vary the question types across these categories:
  1. CONCEPT: "What does X do?" or "What is the purpose of X?"
  2. WRITE COMMAND: "What command would you use to [goal]?" — all 4 options are commands.
  3. SELECT BEST COMMAND: "Which is the best command to [goal]?" — 4 similar commands, one is correct.
  4. TROUBLESHOOT: "A container/pod/service fails with error X. What's the most likely cause?"
  5. IDENTIFY OUTPUT: "What does \`command\` show for [scenario]?" — options describe different outputs.
- Distribute question types roughly evenly. Aim for at least 2 different types.
- Questions must be technically accurate and consistent with the reference material.
- Do NOT repeat questions from the reference material.

Respond with ONLY a JSON array. No markdown, no explanation, no code fences. Format:
[
  {
    "id": "ai-1",
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "correctIndex": 0,
    "explanation": "..."
  }
]`;

function collectCuratedQuestions(
  topics: Topic[],
  levels: Level[],
  lessonSlugs?: string[],
): QuizQuestion[] {
  const pool: QuizQuestion[] = [];
  for (const topic of topics) {
    const mod = modules[topic];
    let lessons = mod.lessons.filter(
      (l) => levels.includes(l.level) && l.quiz,
    );
    if (lessonSlugs && lessonSlugs.length > 0) {
      lessons = lessons.filter((l) => lessonSlugs.includes(l.slug));
    }
    for (const lesson of lessons) {
      const quiz = getQuiz(lesson.quiz!);
      if (quiz) pool.push(...quiz.questions);
    }
  }
  return pool;
}

function collectLessonContent(
  topics: Topic[],
  levels: Level[],
  lessonSlugs?: string[],
): string {
  let content = "";
  for (const topic of topics) {
    const mod = modules[topic];
    let lessons = mod.lessons.filter((l) => levels.includes(l.level));
    if (lessonSlugs && lessonSlugs.length > 0) {
      lessons = lessons.filter((l) => lessonSlugs.includes(l.slug));
    }
    for (const lesson of lessons) {
      const raw = getLessonContent("en", topic, lesson.slug);
      if (raw) {
        const body = getContentBody(raw);
        content += body.slice(0, 1500) + "\n---\n";
      }
    }
  }
  return content.slice(0, 4000);
}

function validateAiQuestions(data: unknown): QuizQuestion[] {
  if (!Array.isArray(data)) throw new Error("Response is not an array");
  return data.map((q, i) => {
    if (!q || typeof q !== "object") throw new Error(`Question ${i} is not an object`);
    if (typeof q.question !== "string") throw new Error(`Question ${i} missing question`);
    if (!Array.isArray(q.options) || q.options.length !== 4)
      throw new Error(`Question ${i} must have exactly 4 options`);
    if (typeof q.correctIndex !== "number" || q.correctIndex < 0 || q.correctIndex > 3)
      throw new Error(`Question ${i} correctIndex must be 0-3`);
    if (typeof q.explanation !== "string") throw new Error(`Question ${i} missing explanation`);
    return {
      id: q.id || `ai-${i + 1}`,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
    };
  });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
  const { allowed, remaining } = examLimiter(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait a moment." },
      { status: 429, headers: { "X-RateLimit-Remaining": String(remaining) } },
    );
  }

  try {
    const body = await req.json();
    const { topics, levels, questionCount, lessonSlugs } = body as {
      topics: Topic[];
      levels: Level[];
      questionCount: 5 | 10 | 15 | 20;
      lessonSlugs?: string[];
    };

    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      return NextResponse.json({ error: "At least one topic is required" }, { status: 400 });
    }
    if (!Array.isArray(levels) || levels.length === 0) {
      return NextResponse.json({ error: "At least one level is required" }, { status: 400 });
    }
    if (![5, 10, 15, 20].includes(questionCount)) {
      return NextResponse.json({ error: "Invalid questionCount" }, { status: 400 });
    }

    // Collect curated questions
    const curatedPool = collectCuratedQuestions(topics, levels, lessonSlugs);
    const curatedCount = Math.min(
      Math.ceil(questionCount * 0.5),
      curatedPool.length,
    );
    const shuffledCurated = [...curatedPool].sort(() => 0.5 - Math.random());
    const selectedCurated = shuffledCurated.slice(0, curatedCount);

    const aiCount = questionCount - curatedCount;

    // If no AI questions needed, return early
    if (aiCount === 0) {
      return NextResponse.json({
        questions: [],
        curatedQuestions: selectedCurated,
      });
    }

    // Collect lesson content for grounding
    const contentRef = collectLessonContent(topics, levels, lessonSlugs);
    const topicLabels = topics
      .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
      .join(", ");
    const levelLabels = levels
      .map((l) => l.charAt(0).toUpperCase() + l.slice(1))
      .join(", ");

    const userPrompt = `Generate exactly ${aiCount} multiple-choice questions about: ${topicLabels}
Difficulty level(s): ${levelLabels}

${
  contentRef
    ? `REFERENCE MATERIAL from the curriculum:\n${contentRef}\n`
    : ""
}Generate exactly ${aiCount} questions now. Remember: JSON array only, no markdown.`;

    const contents = [
      { role: "user" as const, parts: [{ text: EXAM_SYSTEM_PROMPT }] },
      {
        role: "model" as const,
        parts: [
          {
            text: "I will generate exam questions as a JSON array with varied question types.",
          },
        ],
      },
      { role: "user" as const, parts: [{ text: userPrompt }] },
    ];

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents,
    });

    const text = response.text ?? "";
    // Strip markdown code fences if present
    const cleaned = text
      .replace(/^```(?:json)?\s*\n?/m, "")
      .replace(/\n?```\s*$/m, "")
      .trim();

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "AI returned invalid JSON. Please try again." },
        { status: 500 },
      );
    }

    const aiQuestions = validateAiQuestions(parsed);

    return NextResponse.json({
      questions: aiQuestions,
      curatedQuestions: selectedCurated,
    });
  } catch (error) {
    console.error("Generate exam error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate exam";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}