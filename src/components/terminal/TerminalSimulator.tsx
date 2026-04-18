"use client";

import { useState, useRef, useCallback, type KeyboardEvent } from "react";
import { executeCommand, validateTask } from "./CommandParser";
import type { CommandHandler, ChallengeTask } from "@/types";

interface TerminalLine {
  type: "input" | "output";
  content: string;
}

interface TerminalSimulatorProps {
  commands: Record<string, CommandHandler>;
  initialState?: Record<string, string>;
  prompt?: string;
  tasks?: ChallengeTask[];
  onTaskComplete?: (taskId: string) => void;
  onAllTasksComplete?: () => void;
}

export default function TerminalSimulator({
  commands,
  initialState = {},
  prompt = "$",
  tasks = [],
  onTaskComplete,
  onAllTasksComplete,
}: TerminalSimulatorProps) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [state, setState] = useState(initialState);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const allDoneFired = useRef(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleCommand = useCallback(() => {
    if (!input.trim()) return;

    const newLines: TerminalLine[] = [{ type: "input", content: `${prompt} ${input}` }];
    const { output, newState } = executeCommand(input, commands, state);

    if (output) {
      newLines.push({ type: "output", content: output });
    }

    // Check task completion
    if (tasks.length > 0) {
      const updatedCompleted = new Set(completedTasks);
      for (const task of tasks) {
        if (updatedCompleted.has(task.id)) continue;
        if (validateTask(task.id, input, commands)) {
          updatedCompleted.add(task.id);
          onTaskComplete?.(task.id);
          newLines.push({
            type: "output",
            content: `✅ Task completed: ${task.instruction}`,
          });
        }
      }
      setCompletedTasks(updatedCompleted);

      // Fire onAllTasksComplete once when all tasks are done
      if (
        updatedCompleted.size === tasks.length &&
        !allDoneFired.current
      ) {
        allDoneFired.current = true;
        onAllTasksComplete?.();
      }
    }

    setLines((prev) => [...prev, ...newLines]);
    setState(newState);
    setHistory((prev) => [...prev, input]);
    setHistoryIndex(-1);
    setInput("");
  }, [input, commands, state, prompt, tasks, completedTasks, onTaskComplete, onAllTasksComplete]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleCommand();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (history.length === 0) return;
        const newIndex =
          historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
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
    <div
      className="flex h-96 flex-col overflow-hidden rounded-lg border border-gray-700 bg-gray-950"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-700 bg-gray-900 px-4 py-2">
        <div className="h-3 w-3 rounded-full bg-red-500" />
        <div className="h-3 w-3 rounded-full bg-yellow-500" />
        <div className="h-3 w-3 rounded-full bg-green-500" />
        <span className="ml-2 text-xs text-gray-400">Terminal</span>
      </div>

      {/* Output */}
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

        {/* Input line */}
        <div className="flex items-center text-green-400">
          <span className="shrink-0">{prompt}&nbsp;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent font-mono text-sm text-green-400 outline-none caret-green-400"
            spellCheck={false}
            autoComplete="off"
            autoFocus
          />
        </div>
      </div>

      {/* Task progress */}
      {tasks.length > 0 && (
        <div className="border-t border-gray-700 bg-gray-900 px-4 py-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>
              Tasks: {completedTasks.size}/{tasks.length} completed
            </span>
            <span className="text-green-400">
              {completedTasks.size === tasks.length ? "All done!" : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}