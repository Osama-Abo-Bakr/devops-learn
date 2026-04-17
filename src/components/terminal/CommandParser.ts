import type { CommandHandler } from "@/types";

export interface ParsedCommand {
  command: string;
  args: string[];
  raw: string;
}

export function parseCommand(input: string): ParsedCommand {
  const trimmed = input.trim();
  if (!trimmed) {
    return { command: "", args: [], raw: trimmed };
  }

  const parts = trimmed.split(/\s+/);
  const command = parts[0];
  const args = parts.slice(1);

  return { command, args, raw: trimmed };
}

export function matchCommand(
  input: string,
  commands: Record<string, CommandHandler>,
): { command: string; args: string[] } {
  const trimmed = input.trim();
  if (!trimmed) return { command: "", args: [] };

  const parts = trimmed.split(/\s+/);

  // Try longest multi-word match first (3-word, 2-word, 1-word)
  for (let len = Math.min(3, parts.length); len >= 1; len--) {
    const candidate = parts.slice(0, len).join(" ");
    if (commands[candidate]) {
      return {
        command: candidate,
        args: parts.slice(len),
      };
    }
  }

  // No match found — return first word as command for error message
  return { command: parts[0], args: parts.slice(1) };
}

export function executeCommand(
  input: string,
  commands: Record<string, CommandHandler>,
  state: Record<string, string>,
): { output: string; newState: Record<string, string> } {
  const { command, args } = matchCommand(input, commands);

  if (!command) {
    return { output: "", newState: state };
  }

  const handler = commands[command];

  if (!handler) {
    return {
      output: `bash: ${command}: command not found. Type 'help' for available commands.`,
      newState: state,
    };
  }

  const output =
    typeof handler.output === "function" ? handler.output(args) : handler.output;
  const newState = handler.stateChange
    ? { ...state, ...handler.stateChange }
    : state;

  return { output, newState };
}

export function validateTask(
  taskId: string,
  input: string,
  commands: Record<string, CommandHandler>,
): boolean {
  const { command } = matchCommand(input, commands);
  const handler = commands[command];
  if (!handler) return false;
  if (!handler.completesTasks) return false;
  if (!handler.completesTasks.includes(taskId)) return false;

  const parts = input.trim().split(/\s+/);
  const commandWords = command.split(/\s+/).length;
  const args = parts.slice(commandWords);

  if (handler.validateArgs && !handler.validateArgs(args)) return false;
  return true;
}