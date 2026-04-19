"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { matchCommand, validateTask, executeCommandWithAnsi } from "./CommandParser";
import {
  createInitialState,
  executeDockerCommand,
  executeFilesystemCommand,
  type DockerSimulationState,
} from "@/lib/docker-simulation";
import { ANSI } from "@/lib/ansi-formatter";
import type { CommandHandler, ChallengeTask } from "@/types";

interface TerminalSimulatorProps {
  commands: Record<string, CommandHandler>;
  initialState?: Record<string, string>;
  prompt?: string;
  tasks?: ChallengeTask[];
  onTaskComplete?: (taskId: string) => void;
  onAllTasksComplete?: () => void;
  useSimulationEngine?: boolean;
}

const FS_COMMANDS = new Set(["ls", "cd", "cat", "pwd", "echo"]);

export default function TerminalSimulator({
  commands,
  initialState = {},
  prompt = "$",
  tasks = [],
  onTaskComplete,
  onAllTasksComplete,
  useSimulationEngine = false,
}: TerminalSimulatorProps) {
  const termRef = useRef<any>(null);
  const fitAddonRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputBuffer = useRef("");
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const completedTasksRef = useRef<Set<string>>(new Set());
  const allDoneFiredRef = useRef(false);
  const simStateRef = useRef<DockerSimulationState | null>(null);
  const cmdStateRef = useRef<Record<string, string>>(initialState);

  const [loaded, setLoaded] = useState(false);

  const promptStr = `\x1b[32m${prompt}\x1b[0m `;

  const writePrompt = useCallback(() => {
    const term = termRef.current;
    if (!term) return;
    term.write(`\r\n${promptStr}`);
  }, [promptStr]);

  const handleInput = useCallback(
    (line: string) => {
      const term = termRef.current;
      if (!term) return;

      if (line.trim() === "clear") {
        term.clear();
        term.write(promptStr);
        inputBuffer.current = "";
        return;
      }

      let output = "";
      let ansiOutput = "";

      if (useSimulationEngine) {
        const trimmed = line.trim();
        const parts = trimmed.split(/\s+/);
        const firstWord = parts[0];

        if (FS_COMMANDS.has(firstWord)) {
          if (!simStateRef.current) simStateRef.current = createInitialState();
          const result = executeFilesystemCommand(simStateRef.current, firstWord, parts.slice(1));
          if (result) {
            output = result.output;
            ansiOutput = result.ansiOutput;
            simStateRef.current = result.newState;
          }
        } else if (firstWord === "docker") {
          if (!simStateRef.current) simStateRef.current = createInitialState();
          const sub = parts[1];
          let dockerCmd: string;
          let dockerArgs: string[];
          const managementCmds = new Set(["compose", "network", "volume", "system", "image", "container"]);
          if (managementCmds.has(sub) && parts[2]) {
            dockerCmd = `docker ${sub} ${parts[2]}`;
            dockerArgs = parts.slice(3);
          } else if (sub) {
            dockerCmd = `docker ${sub}`;
            dockerArgs = parts.slice(2);
          } else {
            dockerCmd = "docker";
            dockerArgs = [];
          }
          const result = executeDockerCommand(simStateRef.current, dockerCmd, dockerArgs);
          output = result.output;
          ansiOutput = result.ansiOutput;
          simStateRef.current = result.newState;
        } else {
          const { command: cmd } = matchCommand(line, commands);
          const handler = commands[cmd];
          if (handler) {
            const result = executeCommandWithAnsi(line, commands, cmdStateRef.current);
            output = result.output;
            ansiOutput = result.ansiOutput;
            cmdStateRef.current = result.newState;
          } else if (!cmd) {
            term.write(promptStr);
            return;
          } else {
            const msg = `bash: ${cmd}: command not found. Type 'help' for available commands.`;
            output = msg;
            ansiOutput = ANSI.red(msg);
          }
        }
      } else {
        const result = executeCommandWithAnsi(line, commands, cmdStateRef.current);
        output = result.output;
        ansiOutput = result.ansiOutput;
        cmdStateRef.current = result.newState;
      }

      if (output && output !== "__CLEAR__") {
        term.write("\r\n");
        const text = (ansiOutput || output).replace(/\n/g, "\r\n");
        term.write(text);
      }

      // Task validation (works with both modes)
      if (tasks.length > 0) {
        const { command } = matchCommand(line, commands);
        const handler = commands[command];
        if (handler?.completesTasks) {
          for (const task of tasks) {
            if (completedTasksRef.current.has(task.id)) continue;
            if (validateTask(task.id, line, commands)) {
              completedTasksRef.current.add(task.id);
              onTaskComplete?.(task.id);
              term.write(`\r\n${ANSI.green("✅")} Task completed: ${ANSI.bold(task.instruction)}`);
            }
          }

          if (
            completedTasksRef.current.size === tasks.length &&
            !allDoneFiredRef.current
          ) {
            allDoneFiredRef.current = true;
            onAllTasksComplete?.();
          }
        }
      }

      term.write("\r\n");
      term.write(promptStr);
    },
    [commands, tasks, useSimulationEngine, promptStr, onTaskComplete, onAllTasksComplete],
  );

  const handleInputRef = useRef(handleInput);
  handleInputRef.current = handleInput;

  useEffect(() => {
    if (!containerRef.current) return;
    let term: any;
    let fitAddon: any;
    let disposed = false;

    const init = async () => {
      const [{ Terminal }, { FitAddon }] = await Promise.all([
        import("@xterm/xterm"),
        import("@xterm/addon-fit"),
      ]);

      if (disposed || !containerRef.current) return;

      term = new Terminal({
        fontSize: 14,
        fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', Menlo, Monaco, monospace",
        theme: {
          background: "#030712",
          foreground: "#d1d5db",
          cursor: "#4ade80",
          selectionBackground: "#374151",
          black: "#1f2937",
          red: "#f87171",
          green: "#4ade80",
          yellow: "#fbbf24",
          blue: "#60a5fa",
          magenta: "#c084fc",
          cyan: "#22d3ee",
          white: "#f3f4f6",
          brightBlack: "#4b5563",
          brightRed: "#fca5a5",
          brightGreen: "#86efac",
          brightYellow: "#fde68a",
          brightBlue: "#93c5fd",
          brightMagenta: "#d8b4fe",
          brightCyan: "#67e8f9",
          brightWhite: "#ffffff",
        },
        cursorBlink: true,
        cursorStyle: "block",
        scrollback: 1000,
        convertEol: false,
      });

      fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(containerRef.current!);

      setTimeout(() => {
        try { fitAddon.fit(); } catch {}
      }, 0);

      const welcomeMsg = useSimulationEngine
        ? `${ANSI.bold("DevOps Terminal")} — Docker simulation active. Type ${ANSI.cyan("help")} for commands.\r\n`
        : "";
      term.write(welcomeMsg);
      term.write(promptStr);

      term.onData((data: string) => {
        switch (data) {
          case "\r": {
            const line = inputBuffer.current;
            historyRef.current.push(line);
            historyIndexRef.current = -1;
            inputBuffer.current = "";
            handleInputRef.current(line);
            break;
          }
          case "\x7f": {
            if (inputBuffer.current.length > 0) {
              inputBuffer.current = inputBuffer.current.slice(0, -1);
              term.write("\b \b");
            }
            break;
          }
          case "\x03": {
            term.write("^C");
            inputBuffer.current = "";
            term.write(`\r\n${promptStr}`);
            break;
          }
          case "\x0c": {
            term.clear();
            term.write(promptStr);
            inputBuffer.current = "";
            break;
          }
          case "\x1b[A": {
            if (historyRef.current.length === 0) break;
            const newIndex =
              historyIndexRef.current === -1
                ? historyRef.current.length - 1
                : Math.max(0, historyIndexRef.current - 1);
            const clearLen = inputBuffer.current.length;
            if (clearLen > 0) term.write(`\x1b[${clearLen}D\x1b[K`);
            historyIndexRef.current = newIndex;
            inputBuffer.current = historyRef.current[newIndex];
            term.write(inputBuffer.current);
            break;
          }
          case "\x1b[B": {
            if (historyIndexRef.current === -1) break;
            const newIndex = historyIndexRef.current + 1;
            const clearLen = inputBuffer.current.length;
            if (clearLen > 0) term.write(`\x1b[${clearLen}D\x1b[K`);
            if (newIndex >= historyRef.current.length) {
              historyIndexRef.current = -1;
              inputBuffer.current = "";
            } else {
              historyIndexRef.current = newIndex;
              inputBuffer.current = historyRef.current[newIndex];
              term.write(inputBuffer.current);
            }
            break;
          }
          default: {
            if (data >= " " || data === "\t") {
              inputBuffer.current += data;
              term.write(data);
            }
          }
        }
      });

      termRef.current = term;
      fitAddonRef.current = fitAddon;
      setLoaded(true);
    };

    init();

    const observer = new ResizeObserver(() => {
      if (fitAddonRef.current) {
        try { fitAddonRef.current.fit(); } catch {}
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      disposed = true;
      observer.disconnect();
      if (term) term.dispose();
      termRef.current = null;
      fitAddonRef.current = null;
    };
  }, [promptStr, useSimulationEngine]);

  useEffect(() => {
    const existing = document.querySelector('link[data-xterm-css]');
    if (existing) return;
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = "https://cdn.jsdelivr.net/npm/@xterm/xterm@5/css/xterm.min.css";
    style.dataset.xtermCss = "true";
    document.head.appendChild(style);
  }, []);

  const completedCount = completedTasksRef.current.size;
  const allDone = tasks.length > 0 && completedCount === tasks.length;

  return (
    <div className="flex h-96 flex-col overflow-hidden rounded-lg border border-gray-700 bg-gray-950">
      <div className="flex items-center gap-2 border-b border-gray-700 bg-gray-900 px-4 py-2">
        <div className="h-3 w-3 rounded-full bg-red-500" />
        <div className="h-3 w-3 rounded-full bg-yellow-500" />
        <div className="h-3 w-3 rounded-full bg-green-500" />
        <span className="ml-2 text-xs text-gray-400">
          {useSimulationEngine ? "Docker Terminal" : "Terminal"}
        </span>
      </div>

      <div ref={containerRef} className="flex-1 min-h-0" />

      {tasks.length > 0 && (
        <div className="border-t border-gray-700 bg-gray-900 px-4 py-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>
              Tasks: {completedCount}/{tasks.length} completed
            </span>
            <span className="text-green-400">
              {allDone ? "All done!" : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}