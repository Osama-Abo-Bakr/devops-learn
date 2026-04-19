"use client";

import { useEffect, useRef, useCallback } from "react";

interface XtermTerminalProps {
  onInput: (line: string) => void;
  prompt?: string;
  fontSize?: number;
}

export default function XtermTerminal({
  onInput,
  prompt = "$",
  fontSize = 14,
}: XtermTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<any>(null);
  const fitAddonRef = useRef<any>(null);
  const inputBuffer = useRef("");
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const onInputRef = useRef(onInput);
  onInputRef.current = onInput;
  const promptRef = useRef(prompt);
  promptRef.current = prompt;

  const writePrompt = useCallback(() => {
    const term = termRef.current;
    if (!term) return;
    term.write(`\r\n\x1b[32m${promptRef.current}\x1b[0m `);
  }, []);

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
        fontSize,
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
        convertEol: true,
      });

      fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(containerRef.current!);
      fitAddon.fit();

      term.write(`\x1b[32m${promptRef.current}\x1b[0m `);

      term.onData((data: string) => {
        switch (data) {
          case "\r": {
            const line = inputBuffer.current;
            historyRef.current.push(line);
            historyIndexRef.current = -1;
            inputBuffer.current = "";
            term.write("\r\n");
            onInputRef.current(line);
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
            writePrompt();
            break;
          }
          case "\x0c": {
            term.clear();
            term.write(`\x1b[32m${promptRef.current}\x1b[0m `);
            inputBuffer.current = "";
            break;
          }
          case "\x1b[A": {
            if (historyRef.current.length === 0) break;
            const newIndex =
              historyIndexRef.current === -1
                ? historyRef.current.length - 1
                : Math.max(0, historyIndexRef.current - 1);
            historyIndexRef.current = newIndex;
            const clearLen = inputBuffer.current.length;
            term.write(`\b${" ".repeat(clearLen)}\b`.repeat(clearLen > 0 ? 1 : 0));
            if (clearLen > 0) term.write(`\x1b[${clearLen}D\x1b[K`);
            const entry = historyRef.current[newIndex];
            inputBuffer.current = entry;
            term.write(entry);
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
  }, [fontSize, writePrompt]);

  useEffect(() => {
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = "https://cdn.jsdelivr.net/npm/@xterm/xterm@5/css/xterm.min.css";
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return <div ref={containerRef} className="h-full w-full" />;
}

export function writeToTerminal(term: any, text: string, prompt: string) {
  if (!term) return;
  if (text) {
    term.write(text);
    term.write("\r\n");
  }
  term.write(`\x1b[32m${prompt}\x1b[0m `);
}

export function clearTerminal(term: any, prompt: string) {
  if (!term) return;
  term.clear();
  term.write(`\x1b[32m${prompt}\x1b[0m `);
}