import { describe, it, expect } from "vitest";
import { parseCommand, executeCommand, validateTask } from "../CommandParser";
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
    const parsed = parseCommand("ls");
    const { output, newState } = executeCommand(parsed, commands, {});
    expect(output).toContain("CONTAINER_ID");
    expect(newState).toEqual({});
  });

  it("executes a command with function output", () => {
    const parsed = parseCommand("run -d nginx");
    const { output, newState } = executeCommand(parsed, commands, {});
    expect(output).toContain("Running with args");
    expect(newState.runningContainer).toBe("true");
  });

  it("returns error for unknown command", () => {
    const parsed = parseCommand("unknown");
    const { output } = executeCommand(parsed, commands, {});
    expect(output).toContain("command not found");
  });

  it("returns empty output for empty command", () => {
    const parsed = parseCommand("");
    const { output } = executeCommand(parsed, commands, {});
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
    const parsed = parseCommand("run -d nginx");
    expect(validateTask("run-container", parsed, commands)).toBe(true);
  });

  it("rejects task for wrong command", () => {
    const parsed = parseCommand("run -d nginx");
    expect(validateTask("stop-container", parsed, commands)).toBe(false);
  });

  it("validates args when validateArgs is provided", () => {
    const parsed = parseCommand("stop nginx");
    expect(validateTask("stop-container", parsed, commands)).toBe(true);
  });

  it("rejects when validateArgs fails", () => {
    const parsed = parseCommand("stop apache");
    expect(validateTask("stop-container", parsed, commands)).toBe(false);
  });
});