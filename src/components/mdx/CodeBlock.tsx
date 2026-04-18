"use client";

import { useRef, useState, useCallback } from "react";

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  ["data-language"]?: string;
  ["data-theme"]?: string;
}

export default function CodeBlock({ children, className, ...rest }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);

  const language = className?.replace("language-", "") || rest["data-language"] || "";
  const langLabel = getLangLabel(language);

  const handleCopy = useCallback(() => {
    const code = codeRef.current?.textContent || "";
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  return (
    <div className="group relative my-4 overflow-hidden rounded-lg border border-gray-700 bg-gray-950">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400">{langLabel}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <svg className="h-3.5 w-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div ref={codeRef} className="overflow-x-auto p-4 text-sm leading-relaxed [&>code]:block">
        {children}
      </div>
    </div>
  );
}

function getLangLabel(lang: string): string {
  const labels: Record<string, string> = {
    bash: "Bash",
    sh: "Shell",
    shell: "Shell",
    dockerfile: "Dockerfile",
    yaml: "YAML",
    yml: "YAML",
    json: "JSON",
    python: "Python",
    py: "Python",
    javascript: "JavaScript",
    js: "JavaScript",
    typescript: "TypeScript",
    ts: "TypeScript",
    go: "Go",
    sql: "SQL",
    nginx: "Nginx",
    dockercompose: "Docker Compose",
    plaintext: "Text",
    text: "Text",
  };
  return labels[lang?.toLowerCase()] || lang || "Code";
}