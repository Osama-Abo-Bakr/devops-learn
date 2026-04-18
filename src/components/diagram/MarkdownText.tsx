"use client";

interface MarkdownTextProps {
  content: string;
  className?: string;
}

export default function MarkdownText({ content, className = "" }: MarkdownTextProps) {
  const lines = content.split("\n");

  return (
    <div className={className}>
      {lines.map((line, i) => {
        const trimmed = line.trim();

        if (!trimmed) return <div key={i} className="h-1" />;

        if (trimmed.startsWith("### "))
          return (
            <div key={i} className="text-xs font-medium text-gray-400 mt-1">
              {renderInline(trimmed.slice(4))}
            </div>
          );

        if (trimmed.startsWith("## "))
          return (
            <div key={i} className="text-sm font-bold text-white mt-1.5">
              {renderInline(trimmed.slice(3))}
            </div>
          );

        if (trimmed.startsWith("# "))
          return (
            <div key={i} className="text-base font-bold text-white">
              {renderInline(trimmed.slice(2))}
            </div>
          );

        if (trimmed.startsWith("- "))
          return (
            <div key={i} className="flex gap-1.5 text-xs text-gray-300">
              <span className="text-gray-500">•</span>
              <span>{renderInline(trimmed.slice(2))}</span>
            </div>
          );

        if (trimmed.startsWith("> "))
          return (
            <div key={i} className="border-l-2 border-gray-600 pl-2 text-xs text-gray-400 italic">
              {renderInline(trimmed.slice(2))}
            </div>
          );

        return (
          <div key={i} className="text-xs text-gray-300">
            {renderInline(trimmed)}
          </div>
        );
      })}
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining) {
    const codeMatch = remaining.match(/^(.*?)`([^`]+)`/);
    const boldMatch = remaining.match(/^(.*?)\*\*([^*]+)\*\*/);

    let match = codeMatch;
    let type: "code" | "bold" = "code";

    if (boldMatch && (!codeMatch || boldMatch[1].length < codeMatch[1].length)) {
      match = boldMatch;
      type = "bold";
    }

    if (!match) {
      parts.push(remaining);
      break;
    }

    if (match[1]) parts.push(match[1]);

    if (type === "code") {
      parts.push(
        <code
          key={key++}
          className="rounded bg-gray-800 px-1 py-0.5 font-mono text-cyan-400 text-[11px]"
        >
          {match[2]}
        </code>
      );
    } else {
      parts.push(
        <span key={key++} className="font-semibold text-white">
          {match[2]}
        </span>
      );
    }

    remaining = remaining.slice(match[0].length);
  }

  return parts;
}