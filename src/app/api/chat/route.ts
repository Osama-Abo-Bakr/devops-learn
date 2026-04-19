import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const SYSTEM_PROMPT = `You are DevOps Learn AI, an expert tutor specializing in Docker, Kubernetes, and DevOps.

RULES:
- Be CONCISE. Answers must be under 150 words unless the user explicitly asks for detail.
- Use short paragraphs and bullet points. No long essays.
- Include one code example max. Keep it brief and focused.
- Use markdown: code blocks with language tags, bold for key terms, bullet points.
- If a concept needs more depth, ask "Want me to go deeper?" instead of writing a wall of text.

For each question, answer with:
1. What it is (1-2 sentences)
2. A quick example or analogy
3. One tip or common mistake

If asked about something unrelated to DevOps/containers, politely redirect.`;

export async function POST(req: NextRequest) {
  const { message, history } = await req.json();

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  try {
    const contents = [
      { role: "user" as const, parts: [{ text: SYSTEM_PROMPT }] },
      { role: "model" as const, parts: [{ text: "Got it! I'm DevOps Learn AI. I keep answers short and focused. Ask me anything about Docker, K8s, or DevOps." }] },
      ...(history || []).map((msg: { role: string; text: string }) => ({
        role: (msg.role === "user" ? "user" : "model") as "user" | "model",
        parts: [{ text: msg.text }],
      })),
      { role: "user" as const, parts: [{ text: message }] },
    ];

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents,
    });

    const text = response.text ?? "No response generated.";

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Failed to get response from AI" },
      { status: 500 },
    );
  }
}