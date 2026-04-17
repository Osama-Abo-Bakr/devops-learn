import { describe, it, expect } from "vitest";
import { parseCommand, executeCommand, validateTask, matchCommand } from "../CommandParser";
import type { CommandHandler } from "@/types";

describe("parseCommand", () => {
  it("parses a command with args", () => {
    const result = parseCommand("docker ps");
    expect(result.command).toBe("docker");
    expect(result.args).toEqual(["ps"]);
    expect(result.raw).toBe("docker ps");
  });

  it("parses a command with multiple args", () => {
    const result = parseCommand("docker run -d -p 8080:80 nginx");
    expect(result.command).toBe("docker");
    expect(result.args).toEqual(["run", "-d", "-p", "8080:80", "nginx"]);
  });

  it("handles empty input", () => {
    const result = parseCommand("");
    expect(result.command).toBe("");
    expect(result.args).toEqual([]);
  });

  it("handles whitespace-only input", () => {
    const result = parseCommand("   ");
    expect(result.command).toBe("");
    expect(result.args).toEqual([]);
  });
});

describe("matchCommand", () => {
  const commands: Record<string, CommandHandler> = {
    "docker ps": { output: "containers" },
    "docker run": { output: "started" },
    "docker compose up": { output: "running" },
    ls: { output: "files" },
  };

  it("matches single-word command", () => {
    const { command, args } = matchCommand("ls", commands);
    expect(command).toBe("ls");
    expect(args).toEqual([]);
  });

  it("matches two-word command", () => {
    const { command, args } = matchCommand("docker ps -a", commands);
    expect(command).toBe("docker ps");
    expect(args).toEqual(["-a"]);
  });

  it("matches three-word command", () => {
    const { command, args } = matchCommand("docker compose up -d", commands);
    expect(command).toBe("docker compose up");
    expect(args).toEqual(["-d"]);
  });

  it("falls back to first word for unknown commands", () => {
    const { command, args } = matchCommand("unknown arg1 arg2", commands);
    expect(command).toBe("unknown");
    expect(args).toEqual(["arg1", "arg2"]);
  });
});

describe("executeCommand", () => {
  const commands: Record<string, CommandHandler> = {
    ls: {
      output: "CONTAINER_ID   IMAGE   STATUS",
    },
    run: {
      output: (args: string[]) => `Running with args: ${args.join(" ")}`,
      stateChange: { runningContainer: "true" },
      completesTasks: ["run-container"],
    },
    help: {
      output: "Available commands: ls, run, help",
    },
  };

  it("executes a command with static output", () => {
    const { output, newState } = executeCommand("ls", commands, {});
    expect(output).toContain("CONTAINER_ID");
    expect(newState).toEqual({});
  });

  it("executes a command with function output", () => {
    const { output, newState } = executeCommand("run -d nginx", commands, {});
    expect(output).toContain("Running with args");
    expect(newState.runningContainer).toBe("true");
  });

  it("returns error for unknown command", () => {
    const { output } = executeCommand("unknown", commands, {});
    expect(output).toContain("command not found");
  });

  it("returns empty output for empty command", () => {
    const { output } = executeCommand("", commands, {});
    expect(output).toBe("");
  });
});

describe("validateTask", () => {
  const commands: Record<string, CommandHandler> = {
    run: {
      output: "container started",
      completesTasks: ["run-container"],
    },
    stop: {
      output: "container stopped",
      completesTasks: ["stop-container"],
      validateArgs: (args: string[]) => args.includes("nginx"),
    },
  };

  it("validates a task with matching command", () => {
    expect(validateTask("run-container", "run -d nginx", commands)).toBe(true);
  });

  it("rejects task for wrong command", () => {
    expect(validateTask("stop-container", "run -d nginx", commands)).toBe(false);
  });

  it("validates args when validateArgs is provided", () => {
    expect(validateTask("stop-container", "stop nginx", commands)).toBe(true);
  });

  it("rejects when validateArgs fails", () => {
    expect(validateTask("stop-container", "stop apache", commands)).toBe(false);
  });
});