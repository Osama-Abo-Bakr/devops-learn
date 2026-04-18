import { matchCommand } from "../CommandParser";
import type { CommandHandler } from "@/types";

const commands: Record<string, CommandHandler> = {
  docker: { output: () => "docker usage" },
  "docker ps": { output: () => "CONTAINERS" },
  "docker run": { output: (args) => "run " + args.join(" ") },
  "docker compose up": { output: () => "compose up" },
  help: { output: () => "help text" },
};

describe("multi-word command matching", () => {
  test("bare docker matches", () => {
    const r = matchCommand("docker", commands);
    expect(r.command).toBe("docker");
  });

  test("docker ps matches", () => {
    const r = matchCommand("docker ps", commands);
    expect(r.command).toBe("docker ps");
  });

  test("docker compose up matches", () => {
    const r = matchCommand("docker compose up", commands);
    expect(r.command).toBe("docker compose up");
  });

  test("docker run -d nginx extracts args", () => {
    const r = matchCommand("docker run -d nginx", commands);
    expect(r.command).toBe("docker run");
    expect(r.args).toEqual(["-d", "nginx"]);
  });

  test("unknown command returns first word", () => {
    const r = matchCommand("kubectl get pods", commands);
    expect(r.command).toBe("kubectl");
  });
});