import { describe, it, expect } from "vitest";
import { executeCommand, executeCommandWithAnsi, matchCommand, validateTask } from "./CommandParser";
import type { CommandHandler } from "@/types";

function makeCommands(): Record<string, CommandHandler> {
  return {
    "docker ps": {
      output: () => "CONTAINER ID   IMAGE   NAMES",
    },
    "docker run": {
      output: (args: string[]) => `Container started with: ${args.join(" ")}`,
      stateChange: { containerCount: "1" },
      completesTasks: ["run-container"],
      validateArgs: (args: string[]) => args.includes("-d"),
    },
    "docker stop": {
      output: (args: string[]) => `Container ${args[0] || "?"} stopped`,
      completesTasks: ["stop-container"],
    },
    help: {
      output: () => "Available commands: docker ps, docker run, help",
    },
    clear: {
      output: "__CLEAR__",
    },
  };
}

describe("matchCommand", () => {
  const cmds = makeCommands();

  it("matches single-word commands", () => {
    const { command, args } = matchCommand("help", cmds);
    expect(command).toBe("help");
    expect(args).toEqual([]);
  });

  it("matches multi-word commands", () => {
    const { command, args } = matchCommand("docker ps", cmds);
    expect(command).toBe("docker ps");
    expect(args).toEqual([]);
  });

  it("passes remaining words as args", () => {
    const { command, args } = matchCommand("docker run -d nginx", cmds);
    expect(command).toBe("docker run");
    expect(args).toEqual(["-d", "nginx"]);
  });

  it("returns first word when no match", () => {
    const { command, args } = matchCommand("foobar baz", cmds);
    expect(command).toBe("foobar");
    expect(args).toEqual(["baz"]);
  });
});

describe("executeCommand", () => {
  const cmds = makeCommands();

  it("executes a matched command", () => {
    const { output } = executeCommand("docker ps", cmds, {});
    expect(output).toContain("CONTAINER ID");
  });

  it("applies state changes", () => {
    const { newState } = executeCommand("docker run -d nginx", cmds, {});
    expect(newState.containerCount).toBe("1");
  });

  it("returns not-found for unknown command", () => {
    const { output } = executeCommand("foobar", cmds, {});
    expect(output).toContain("command not found");
  });

  it("returns empty for empty input", () => {
    const { output } = executeCommand("", cmds, {});
    expect(output).toBe("");
  });

  it("passes args to function output", () => {
    const { output } = executeCommand("docker run -d nginx", cmds, {});
    expect(output).toContain("-d");
    expect(output).toContain("nginx");
  });
});

describe("executeCommandWithAnsi", () => {
  const cmds = makeCommands();

  it("returns both plain and ANSI output", () => {
    const { output, ansiOutput } = executeCommandWithAnsi("docker ps", cmds, {});
    expect(output).toContain("CONTAINER ID");
    expect(ansiOutput).toContain("CONTAINER ID");
  });

  it("colors not-found errors in red", () => {
    const { output, ansiOutput } = executeCommandWithAnsi("foobar", cmds, {});
    expect(output).toContain("command not found");
    expect(ansiOutput).toContain("\x1b[31m");
  });

  it("preserves __CLEAR__ signal", () => {
    const { output, ansiOutput } = executeCommandWithAnsi("clear", cmds, {});
    expect(output).toBe("__CLEAR__");
    expect(ansiOutput).toBe("__CLEAR__");
  });

  it("returns empty for empty input", () => {
    const { output, ansiOutput } = executeCommandWithAnsi("", cmds, {});
    expect(output).toBe("");
    expect(ansiOutput).toBe("");
  });

  it("applies state changes", () => {
    const { newState } = executeCommandWithAnsi("docker run -d nginx", cmds, { containerCount: "0" });
    expect(newState.containerCount).toBe("1");
  });
});

describe("validateTask", () => {
  const cmds = makeCommands();

  it("validates a task with matching command and valid args", () => {
    expect(validateTask("run-container", "docker run -d nginx", cmds)).toBe(true);
  });

  it("rejects when command matches but args fail validation", () => {
    expect(validateTask("run-container", "docker run nginx", cmds)).toBe(false);
  });

  it("rejects when command doesn't complete the task", () => {
    expect(validateTask("run-container", "docker ps", cmds)).toBe(false);
  });

  it("rejects unknown commands", () => {
    expect(validateTask("run-container", "foobar", cmds)).toBe(false);
  });

  it("validates task without validateArgs", () => {
    expect(validateTask("stop-container", "docker stop abc123", cmds)).toBe(true);
  });
});