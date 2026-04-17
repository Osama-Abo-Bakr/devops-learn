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

export function executeCommand(
  parsed: ParsedCommand,
  commands: Record<string, CommandHandler>,
  state: Record<string, string>,
): { output: string; newState: Record<string, string> } {
  const { command, args } = parsed;

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
  parsed: ParsedCommand,
  commands: Record<string, CommandHandler>,
): boolean {
  const handler = commands[parsed.command];
  if (!handler) return false;
  if (!handler.completesTasks) return false;
  if (!handler.completesTasks.includes(taskId)) return false;
  if (handler.validateArgs && !handler.validateArgs(parsed.args)) return false;
  return true;
}