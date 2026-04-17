"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { SiDocker } from "react-icons/si";

interface Message {
  role: "user" | "assistant";
  text: string;
}

function SimpleMarkdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent = "";
  let codeLang = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <pre
            key={`code-${i}`}
            className="my-2 overflow-x-auto rounded bg-gray-950 p-3 text-xs"
          >
            <code>{codeContent.trimEnd()}</code>
          </pre>,
        );
        codeContent = "";
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLang = line.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent += line + "\n";
      continue;
    }

    // Headings
    if (line.startsWith("### ")) {
      elements.push(
        <h4 key={i} className="mt-3 mb-1 text-sm font-semibold text-blue-400">
          {line.slice(4)}
        </h4>,
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h3 key={i} className="mt-3 mb-1 text-base font-bold text-blue-300">
          {line.slice(3)}
        </h3>,
      );
    } else if (line.startsWith("# ")) {
      elements.push(
        <h2 key={i} className="mt-2 mb-1 text-lg font-bold text-white">
          {line.slice(2)}
        </h2>,
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <li key={i} className="ml-4 list-disc text-gray-300">
          {formatInline(line.slice(2))}
        </li>,
      );
    } else if (/^\d+\.\s/.test(line)) {
      const match = line.match(/^(\d+\.)\s(.*)$/);
      if (match) {
        elements.push(
          <li key={i} className="ml-4 list-decimal text-gray-300">
            {formatInline(match[2])}
          </li>,
        );
      }
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(
        <p key={i} className="text-gray-300">
          {formatInline(line)}
        </p>,
      );
    }
  }

  return <div className="space-y-0.5">{elements}</div>;
}

function formatInline(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="rounded bg-gray-800 px-1 text-green-400">
          {part.slice(1, -1)}
        </code>
      );
    }
    // Bold
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return boldParts.map((bp, j) => {
      if (bp.startsWith("**") && bp.endsWith("**")) {
        return (
          <strong key={`${i}-${j}`} className="font-semibold text-white">
            {bp.slice(2, -2)}
          </strong>
        );
      }
      return bp;
    });
  });
}

export default function AiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    const userMsg: Message = { role: "user", text };
    const history = [...messages, userMsg];
    setMessages(history);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages([...history, { role: "assistant", text: data.reply }]);
      } else {
        setMessages([
          ...history,
          { role: "assistant", text: "Sorry, something went wrong. Please try again." },
        ]);
      }
    } catch {
      setMessages([
        ...history,
        { role: "assistant", text: "Network error. Please check your connection." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const quickQuestions = [
    "What is a Docker container?",
    "Explain docker-compose",
    "What is a Kubernetes Pod?",
  ];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed right-5 bottom-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform hover:scale-105 ${open ? "hidden" : ""}`}
        aria-label="Open AI assistant"
      >
        <SiDocker className="h-6 w-6" />
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold">
          AI
        </span>
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed right-5 bottom-5 z-50 flex h-[560px] w-[420px] flex-col rounded-xl border border-gray-700 bg-gray-900 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-700 px-4 py-3">
            <div className="flex items-center gap-2">
              <SiDocker className="h-5 w-5 text-blue-400" />
              <span className="font-semibold text-white">DevOps AI Tutor</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-center text-sm text-gray-500">
                  Ask me anything about Docker, Kubernetes, or Compose!
                </p>
                <div className="space-y-2">
                  {quickQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setInput(q);
                      }}
                      className="block w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-750 hover:text-white"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`rounded-lg px-3 py-2 text-sm ${
                  msg.role === "user"
                    ? "ml-8 bg-blue-600 text-white"
                    : "mr-2 bg-gray-800 text-gray-200"
                }`}
              >
                {msg.role === "assistant" ? (
                  <SimpleMarkdown content={msg.text} />
                ) : (
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                )}
              </div>
            ))}
            {loading && (
              <div className="mr-2 rounded-lg bg-gray-800 px-3 py-2 text-sm text-gray-400">
                Thinking...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 border-t border-gray-700 p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Docker, K8s..."
              className="flex-1 rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}