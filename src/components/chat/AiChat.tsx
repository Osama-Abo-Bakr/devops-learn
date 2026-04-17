"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { SiDocker } from "react-icons/si";

interface Message {
  role: "user" | "assistant";
  text: string;
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

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed right-5 bottom-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform hover:scale-105 ${open ? "hidden" : ""}`}
        aria-label="Open AI assistant"
      >
        <SiDocker className="h-6 w-6" />
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed right-5 bottom-5 z-50 flex h-[520px] w-[380px] flex-col rounded-xl border border-gray-700 bg-gray-900 shadow-2xl">
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
              <p className="text-center text-sm text-gray-500">
                Ask me anything about Docker, Kubernetes, or Docker Compose!
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`rounded-lg px-3 py-2 text-sm ${
                  msg.role === "user"
                    ? "ml-8 bg-blue-600 text-white"
                    : "mr-8 bg-gray-800 text-gray-200"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
            ))}
            {loading && (
              <div className="mr-8 rounded-lg bg-gray-800 px-3 py-2 text-sm text-gray-400">
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