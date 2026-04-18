interface CalloutProps {
  children: React.ReactNode;
}

export default function Callout({ children }: CalloutProps) {
  // Check if children starts with a callout keyword
  const text = extractText(children);
  const match = text.match(/^(Tip|Warning|Note|Important|Caution)[:.]\s*/i);
  const type = match ? match[1].toLowerCase() : null;
  const restText = match ? text.slice(match[0].length) : null;

  const styles: Record<string, string> = {
    tip: "border-green-500/50 bg-green-500/5 text-green-300",
    warning: "border-amber-500/50 bg-amber-500/5 text-amber-300",
    note: "border-blue-500/50 bg-blue-500/5 text-blue-300",
    important: "border-purple-500/50 bg-purple-500/5 text-purple-300",
    caution: "border-red-500/50 bg-red-500/5 text-red-300",
  };

  const icons: Record<string, string> = {
    tip: "\u{1F4A1}",
    warning: "\u26A0\uFE0F",
    note: "\u{1F4DD}",
    important: "\u{1F514}",
    caution: "\u{1F6D1}",
  };

  if (type && styles[type]) {
    return (
      <div className={`my-4 flex gap-3 rounded-lg border-l-4 p-4 ${styles[type]}`}>
        <span className="text-lg shrink-0">{icons[type]}</span>
        <div className="flex-1 min-w-0">
          <div className="mb-1 text-sm font-semibold capitalize text-white">{type}</div>
          <div className="text-sm leading-relaxed [&_p]:mb-0 [&_code]:rounded [&_code]:bg-gray-800 [&_code]:px-1 [&_code]:font-mono [&_code]:text-cyan-400 [&_code]:text-xs">
            {restText ? <p>{restText}</p> : children}
          </div>
        </div>
      </div>
    );
  }

  // Default blockquote styling
  return (
    <blockquote className="my-4 border-l-4 border-gray-600 bg-gray-900/50 p-4 text-sm italic text-gray-400 [&_p]:mb-0">
      {children}
    </blockquote>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return extractText((node as any).props.children);
  }
  return "";
}