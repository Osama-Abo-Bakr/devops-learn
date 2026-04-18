"use client";

import { useState, useRef, useCallback, type KeyboardEvent } from "react";
import { executeCommand } from "@/components/terminal/CommandParser";
import type { CommandHandler } from "@/types";

const playgroundCommands: Record<string, CommandHandler> = {
  "docker ps": {
    output: "CONTAINER ID   IMAGE          STATUS       PORTS                  NAMES\nabc123def456   nginx:latest   Up 2 hours   0.0.0.0:8080->80/tcp   web-server",
  },
  "docker images": {
    output: "REPOSITORY   TAG       IMAGE ID       SIZE\nnginx        latest    abc123         187MB\nalpine       latest    def456         7.3MB\nnode         18        ghi789         1.1GB",
  },
  "docker run": {
    output: (args: string[]) => `Container started with args: ${args.join(" ")}`,
  },
  "docker stop": {
    output: (args: string[]) => args.length ? `Container ${args[0]} stopped` : "Usage: docker stop [CONTAINER]",
  },
  "docker pull": {
    output: (args: string[]) => args.length ? `Pulling ${args[0]}...\nDownloaded newer image for ${args[0]}` : "Usage: docker pull [IMAGE]",
  },
  "docker exec": {
    output: (args: string[]) => `Executing command in container...`,
  },
  "docker logs": {
    output: (args: string[]) => `[2024-01-15 10:00:00] Server started on port 80\n[2024-01-15 10:00:01] Ready for connections`,
  },
  "kubectl get": {
    output: (args: string[]) => {
      if (args[0] === "pods") return "NAME                     READY   STATUS    RESTARTS   AGE\nnginx-deploy-abc123      1/1     Running   0          2h\nweb-app-def456          1/1     Running   0          1h";
      if (args[0] === "svc" || args[0] === "services") return "NAME         TYPE           EXTERNAL-IP   PORT(S)        AGE\nnginx-svc   LoadBalancer   10.0.0.1      80:30000/TCP   2h";
      return `Resource list for: ${args.join(" ")}`;
    },
  },
  "kubectl describe": {
    output: (args: string[]) => `Describing ${args.join(" ")}...\nName: ${args[1] || "resource"}\nStatus: Running`,
  },
  "kubectl apply": {
    output: () => "deployment.apps/nginx created",
  },
  "docker compose up": {
    output: () => "[+] Running 3/3\n ✔ Network my-app_default  Created\n ✔ Container my-app-web-1   Started\n ✔ Container my-app-db-1   Started",
  },
  "docker compose down": {
    output: () => "[+] Removing 3/3\n ✔ Container my-app-web-1   Removed\n ✔ Container my-app-db-1   Removed\n ✔ Network my-app_default  Removed",
  },
  help: {
    output: () => `Available commands:
  Docker: docker ps, docker images, docker run, docker stop, docker pull, docker exec, docker logs
  Kubernetes: kubectl get, kubectl describe, kubectl apply
  Compose: docker compose up, docker compose down
  Other: help, clear`,
  },
  clear: {
    output: "__CLEAR__",
  },
};

interface TerminalLine {
  type: "input" | "output";
  content: string;
}

export default function PlaygroundPage() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", content: "Welcome to the DevOps Playground! Type 'help' for available commands." },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCommand = useCallback(() => {
    if (!input.trim()) return;

    const newLines: TerminalLine[] = [{ type: "input", content: `$ ${input}` }];
    if (input.trim().toLowerCase() === "clear") {
      setLines([]);
      setHistory((prev) => [...prev, input]);
      setHistoryIndex(-1);
      setInput("");
      return;
    }

    const { output } = executeCommand(input, playgroundCommands, {});
    if (output) {
      newLines.push({ type: "output", content: output });
    }

    setLines((prev) => [...prev, ...newLines]);
    setHistory((prev) => [...prev, input]);
    setHistoryIndex(-1);
    setInput("");
  }, [input]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleCommand();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (history.length === 0) return;
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex === -1) return;
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    },
    [handleCommand, history, historyIndex],
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Terminal Playground</h1>
        <p className="mt-2 text-gray-400">
          Practice Docker and Kubernetes commands freely. No challenges, no scoring
          — just explore.
        </p>
      </div>

      <div
        className="flex h-[500px] flex-col overflow-hidden rounded-lg border border-gray-700 bg-gray-950"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center gap-2 border-b border-gray-700 bg-gray-900 px-4 py-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
          <span className="ml-2 text-xs text-gray-400">Playground</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
          {lines.map((line, i) => (
            <div
              key={i}
              className={`whitespace-pre ${
                line.type === "input" ? "text-green-400" : "text-gray-300"
              }`}
            >
              {line.content.replace(/\t/g, "    ")}
            </div>
          ))}

          <div className="flex items-center text-green-400">
            <span className="shrink-0">$&nbsp;</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent font-mono text-sm text-green-400 outline-none"
              spellCheck={false}
              autoComplete="off"
              autoFocus
            />
          </div>
        </div>
      </div>
    </div>
  );
}