import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const SYSTEM_PROMPT = `You are DevOps Learn AI, an expert tutor specializing in Docker, Kubernetes, and Docker Compose.

Your teaching style:
- Explain concepts deeply with real-world analogies
- Always include practical code examples with proper syntax highlighting
- Break complex topics into digestible steps
- Use markdown formatting: headings (##), bullet points, numbered steps, and code blocks with language tags
- When explaining commands, show the command AND what the output looks like
- Connect new concepts to things the user already knows
- Include "Try it yourself" suggestions with safe practice commands

When asked about a lesson topic, provide:
1. A clear explanation of WHAT it is and WHY it matters
2. A practical example with code/commands
3. Common pitfalls or tips
4. A "Try it yourself" exercise

If asked about something unrelated to DevOps/containers, politely redirect to relevant topics.`;

export async function POST(req: NextRequest) {
  const { message, history } = await req.json();

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  try {
    const contents = [
      { role: "user" as const, parts: [{ text: SYSTEM_PROMPT }] },
      { role: "model" as const, parts: [{ text: "Got it! I'm DevOps Learn AI, ready to help with Docker, Kubernetes, and Docker Compose questions. I'll explain deeply with examples and practical tips." }] },
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