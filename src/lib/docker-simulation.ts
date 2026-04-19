import { ANSI } from "./ansi-formatter";

// ============================================================
// Types
// ============================================================

export type ContainerStatus = "created" | "running" | "paused" | "stopped" | "dead";

export interface SimContainer {
  id: string;
  name: string;
  image: string;
  status: ContainerStatus;
  ports: string[];
  network: string;
  createdAt: number;
  exitCode: number | null;
  logs: string[];
}

export interface SimImage {
  id: string;
  repository: string;
  tag: string;
  size: string;
}

export interface DockerSimulationState {
  containers: Map<string, SimContainer>;
  images: Map<string, SimImage>;
  networks: Set<string>;
  cwd: string;
  env: Record<string, string>;
  filesystem: Map<string, string>;
  directories: Set<string>;
  counter: number;
}

// ============================================================
// Helpers
// ============================================================

function randomHex(len: number): string {
  const chars = "0123456789abcdef";
  let result = "";
  for (let i = 0; i < len; i++) result += chars[Math.floor(Math.random() * 16)];
  return result;
}

const ADJECTIVES = [
  "happy", "brave", "calm", "eager", "kind", "swift", "bold", "wise",
  "warm", "keen", "nice", "cool", "fair", "good", "pure", "safe",
];
const NOUNS = [
  "whale", "panda", "falcon", "tiger", "eagle", "otter", "raven", "wolf",
  "bear", "deer", "hawk", "lynx", "moose", "pony", "seal", "crane",
];

function autoName(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj}_${noun}`;
}

// ============================================================
// Initial State
// ============================================================

export function createInitialState(): DockerSimulationState {
  const images = new Map<string, SimImage>();
  const defaultImages: [string, string, string, string][] = [
    ["img_nginx", "nginx", "latest", "187 MB"],
    ["img_alpine", "alpine", "latest", "7.3 MB"],
    ["img_node", "node", "18", "1.1 GB"],
    ["img_python", "python", "3.11", "1.0 GB"],
    ["img_redis", "redis", "7", "130 MB"],
    ["img_postgres", "postgres", "16", "379 MB"],
  ];
  for (const [id, repo, tag, size] of defaultImages) {
    images.set(id, { id, repository: repo, tag, size });
  }

  const directories = new Set(["/home/user", "/home", "/etc", "/app"]);
  const filesystem = new Map<string, string>([
    ["/etc/hosts", "127.0.0.1 localhost\n::1 localhost"],
    ["/home/user/Dockerfile", `FROM node:18-alpine\nWORKDIR /app\nCOPY . .\nRUN npm ci\nCMD ["node", "server.js"]`],
    ["/home/user/index.js", `const http = require('http');\nhttp.createServer((req, res) => {\n  res.end('Hello World');\n}).listen(3000);`],
    ["/home/user/package.json", `{"name": "my-app", "version": "1.0.0", "scripts": {"start": "node index.js"}}`],
  ]);

  return {
    containers: new Map(),
    images,
    networks: new Set(["bridge", "host"]),
    cwd: "/home/user",
    env: { PATH: "/usr/local/bin:/usr/bin:/bin", HOME: "/home/user", USER: "user" },
    filesystem,
    directories,
    counter: 0,
  };
}

// ============================================================
// Command Execution
// ============================================================

export interface CommandResult {
  output: string;
  ansiOutput: string;
  newState: DockerSimulationState;
}

export function executeDockerCommand(
  state: DockerSimulationState,
  command: string,
  args: string[],
): CommandResult {
  const s = cloneState(state);
  s.counter++;

  let output = "";
  let ansiOutput = "";

  switch (command) {
    case "docker":
      output = dockerUsage();
      ansiOutput = dockerUsageAnsi();
      break;
    case "docker ps":
      ({ output, ansiOutput } = dockerPs(s, args));
      break;
    case "docker pull":
      ({ output, ansiOutput } = dockerPull(s, args));
      break;
    case "docker run":
      ({ output, ansiOutput } = dockerRun(s, args));
      break;
    case "docker stop":
      ({ output, ansiOutput } = dockerStop(s, args));
      break;
    case "docker rm":
      ({ output, ansiOutput } = dockerRm(s, args));
      break;
    case "docker start":
      ({ output, ansiOutput } = dockerStart(s, args));
      break;
    case "docker kill":
      ({ output, ansiOutput } = dockerKill(s, args));
      break;
    case "docker images":
      ({ output, ansiOutput } = dockerImages(s));
      break;
    case "docker logs":
      ({ output, ansiOutput } = dockerLogs(s, args));
      break;
    case "docker exec":
      ({ output, ansiOutput } = dockerExec(s, args));
      break;
    case "docker compose up":
      ({ output, ansiOutput } = dockerComposeUp(s, args));
      break;
    case "docker compose down":
      ({ output, ansiOutput } = dockerComposeDown(s, args));
      break;
    default:
      output = `docker: '${command.replace("docker ", "")}' is not a docker command.\nSee 'docker --help'`;
      ansiOutput = ANSI.red(output);
  }

  return { output, ansiOutput, newState: s };
}

export function executeFilesystemCommand(
  state: DockerSimulationState,
  command: string,
  args: string[],
): CommandResult | null {
  const s = cloneState(state);

  switch (command) {
    case "ls": {
      const target = args[0] ? resolvePath(s.cwd, args[0]) : s.cwd;
      if (!s.directories.has(target)) {
        return { output: `ls: cannot access '${args[0] || target}': No such file or directory`, ansiOutput: ANSI.red(`ls: cannot access '${args[0] || target}': No such file or directory`), newState: s };
      }
      const entries: string[] = [];
      for (const dir of s.directories) {
        if (dir.startsWith(target + "/") && !dir.slice(target.length + 1).includes("/")) {
          entries.push(dir.slice(target.length + 1) + "/");
        }
      }
      for (const [path] of s.filesystem) {
        if (path.startsWith(target + "/") && !path.slice(target.length + 1).includes("/")) {
          entries.push(path.slice(target.length + 1));
        }
      }
      const result = entries.join("  ") || "(empty)";
      return { output: result, ansiOutput: entries.map(e => e.endsWith("/") ? ANSI.bold(ANSI.cyan(e)) : e).join("  ") || "(empty)", newState: s };
    }
    case "cd": {
      const target = args[0] ? resolvePath(s.cwd, args[0]) : "/home/user";
      if (!s.directories.has(target)) {
        return { output: `cd: no such file or directory: ${args[0]}`, ansiOutput: ANSI.red(`cd: no such file or directory: ${args[0]}`), newState: s };
      }
      s.cwd = target;
      return { output: "", ansiOutput: "", newState: s };
    }
    case "cat": {
      if (args.length === 0) return { output: "Usage: cat [FILE]", ansiOutput: ANSI.yellow("Usage: cat [FILE]"), newState: s };
      const target = resolvePath(s.cwd, args[0]);
      const content = s.filesystem.get(target);
      if (content === undefined) {
        return { output: `cat: ${args[0]}: No such file or directory`, ansiOutput: ANSI.red(`cat: ${args[0]}: No such file or directory`), newState: s };
      }
      return { output: content, ansiOutput: content, newState: s };
    }
    case "pwd":
      return { output: s.cwd, ansiOutput: s.cwd, newState: s };
    case "echo": {
      const result = args.join(" ").replace(/\$([A-Z_]+)/g, (_, k) => s.env[k] || "");
      return { output: result, ansiOutput: result, newState: s };
    }
    default:
      return null;
  }
}

// ============================================================
// Docker Commands
// ============================================================

function dockerPs(s: DockerSimulationState, args: string[]): { output: string; ansiOutput: string } {
  const showAll = args.includes("-a");
  const header = "CONTAINER ID   IMAGE          STATUS       PORTS                  NAMES";
  const rows: string[] = [];
  const ansiRows: string[] = [];

  for (const c of s.containers.values()) {
    if (!showAll && c.status !== "running") continue;
    const status = c.status === "running" ? `Up ${timeAgo(c.createdAt, s.counter)}` :
                  c.status === "stopped" ? `Exited (${c.exitCode ?? 0}) ${timeAgo(c.createdAt, s.counter)}` :
                  c.status;
    const ports = c.ports.length > 0 ? c.ports.join(", ") : "";
    const row = `${c.id}   ${pad(c.image, 14)} ${pad(status, 13)} ${pad(ports, 22)} ${c.name}`;
    rows.push(row);

    const statusColor = c.status === "running" ? ANSI.green(status) :
                        c.status === "stopped" ? ANSI.red(status) :
                        ANSI.yellow(status);
    ansiRows.push(`${c.id}   ${pad(c.image, 14)} ${pad(statusColor, 38)} ${pad(ports, 22)} ${c.name}`);
  }

  const result = rows.length > 0 ? `${header}\n${rows.join("\n")}` : header;
  const ansiResult = ansiRows.length > 0 ? `${header}\n${ansiRows.join("\n")}` : header;
  return { output: result, ansiOutput: ansiResult };
}

function dockerPull(s: DockerSimulationState, args: string[]): { output: string; ansiOutput: string } {
  if (args.length === 0) return { output: "Usage: docker pull [IMAGE][:TAG]", ansiOutput: ANSI.yellow("Usage: docker pull [IMAGE][:TAG]") };

  const imageRef = args[0];
  const [repo, tag] = imageRef.includes(":") ? imageRef.split(":") : [imageRef, "latest"];

  const existing = [...s.images.values()].find(i => i.repository === repo && i.tag === tag);
  if (existing) {
    const msg = `${imageRef}: Already exists`;
    return { output: msg, ansiOutput: ANSI.dim(msg) };
  }

  const id = `img_${randomHex(8)}`;
  s.images.set(id, { id, repository: repo, tag, size: `${Math.floor(Math.random() * 500 + 5)} MB` });
  const msg = `${imageRef}: Pull complete\nDigest: sha256:${randomHex(32)}\nStatus: Downloaded newer image for ${imageRef}`;
  return { output: msg, ansiOutput: `${ANSI.cyan(imageRef + ":")} Pull complete\nDigest: sha256:${randomHex(32)}\nStatus: Downloaded newer image for ${imageRef}` };
}

function dockerRun(s: DockerSimulationState, args: string[]): { output: string; ansiOutput: string } {
  const hasD = args.includes("-d");
  const hasNameIdx = args.indexOf("--name");
  const name = hasNameIdx >= 0 && args[hasNameIdx + 1] ? args[hasNameIdx + 1] : autoName();

  const imageArg = args.filter(a => !a.startsWith("-")).pop() || "nginx";
  const imageRef = imageArg.includes(":") ? imageArg : `${imageArg}:latest`;
  const [repo, tag] = imageRef.split(":");

  let pullPrefix = "";
  let pullPrefixAnsi = "";

  const image = [...s.images.values()].find(i => i.repository === repo && i.tag === tag);
  if (!image) {
    pullPrefix = `Unable to find image '${imageRef}' locally\nPulling from docker.io/library/${repo}\nStatus: Downloaded newer image for ${imageRef}\n`;
    pullPrefixAnsi = `${ANSI.dim("Unable to find image '" + imageRef + "' locally")}\nPulling from docker.io/library/${repo}\nStatus: Downloaded newer image for ${imageRef}\n`;
    const newId = `img_${randomHex(8)}`;
    s.images.set(newId, { id: newId, repository: repo, tag, size: `${Math.floor(Math.random() * 500 + 5)} MB` });
  }

  const id = randomHex(12);
  const portArgs = args.filter(a => a.startsWith("-p"));
  const ports = portArgs.length > 0 ? portArgs.map(p => p.replace("-p", "").trim()) : [];

  const container: SimContainer = {
    id,
    name,
    image: imageRef,
    status: "running",
    ports,
    network: "bridge",
    createdAt: s.counter,
    exitCode: null,
    logs: [`[${timestamp()}] Container ${name} started`, `[${timestamp()}] Ready for connections`],
  };
  s.containers.set(id, container);

  const msg = hasD ? id : `Container ${name} started`;
  return { output: pullPrefix + msg, ansiOutput: pullPrefixAnsi + (hasD ? ANSI.green(id) : ANSI.green(msg)) };
}

function dockerStop(s: DockerSimulationState, args: string[]): { output: string; ansiOutput: string } {
  if (args.length === 0) return { output: "Usage: docker stop [CONTAINER]", ansiOutput: ANSI.yellow("Usage: docker stop [CONTAINER]") };

  const container = findContainer(s, args[0]);
  if (!container) {
    const msg = `Error response from daemon: No such container: ${args[0]}`;
    return { output: msg, ansiOutput: ANSI.red(msg) };
  }
  if (container.status !== "running") {
    const msg = `Container ${container.name} is not running (current status: ${container.status})`;
    return { output: msg, ansiOutput: ANSI.yellow(msg) };
  }

  container.status = "stopped";
  container.exitCode = 0;
  container.logs.push(`[${timestamp()}] Container ${container.name} stopped`);

  return { output: container.name, ansiOutput: ANSI.dim(container.name) };
}

function dockerRm(s: DockerSimulationState, args: string[]): { output: string; ansiOutput: string } {
  if (args.length === 0) return { output: "Usage: docker rm [CONTAINER]", ansiOutput: ANSI.yellow("Usage: docker rm [CONTAINER]") };

  const force = args.includes("-f");
  const idOrName = args.find(a => !a.startsWith("-")) || args[0];
  const container = findContainer(s, idOrName);
  if (!container) {
    const msg = `Error response from daemon: No such container: ${idOrName}`;
    return { output: msg, ansiOutput: ANSI.red(msg) };
  }

  if (container.status === "running" && !force) {
    const msg = `Error response from daemon: You cannot remove a running container. Stop the container before attempting removal or use -f`;
    return { output: msg, ansiOutput: ANSI.red(msg) };
  }

  s.containers.delete(container.id);
  return { output: container.name, ansiOutput: container.name };
}

function dockerStart(s: DockerSimulationState, args: string[]): { output: string; ansiOutput: string } {
  if (args.length === 0) return { output: "Usage: docker start [CONTAINER]", ansiOutput: ANSI.yellow("Usage: docker start [CONTAINER]") };

  const container = findContainer(s, args[0]);
  if (!container) {
    const msg = `Error response from daemon: No such container: ${args[0]}`;
    return { output: msg, ansiOutput: ANSI.red(msg) };
  }
  if (container.status === "running") {
    return { output: container.name, ansiOutput: ANSI.dim(container.name) };
  }

  container.status = "running";
  container.exitCode = null;
  container.logs.push(`[${timestamp()}] Container ${container.name} started`);
  return { output: container.name, ansiOutput: ANSI.green(container.name) };
}

function dockerKill(s: DockerSimulationState, args: string[]): { output: string; ansiOutput: string } {
  if (args.length === 0) return { output: "Usage: docker kill [CONTAINER]", ansiOutput: ANSI.yellow("Usage: docker kill [CONTAINER]") };

  const container = findContainer(s, args[0]);
  if (!container) {
    const msg = `Error response from daemon: No such container: ${args[0]}`;
    return { output: msg, ansiOutput: ANSI.red(msg) };
  }

  container.status = "dead";
  container.exitCode = 137;
  container.logs.push(`[${timestamp()}] Container ${container.name} killed (exit code 137)`);
  return { output: container.id, ansiOutput: ANSI.red(container.id) };
}

function dockerImages(s: DockerSimulationState): { output: string; ansiOutput: string } {
  const header = "REPOSITORY   TAG       IMAGE ID       SIZE";
  const rows: string[] = [];
  for (const img of s.images.values()) {
    rows.push(`${pad(img.repository, 12)} ${pad(img.tag, 9)} ${pad(img.id, 15)} ${img.size}`);
  }
  const result = rows.length > 0 ? `${header}\n${rows.join("\n")}` : header;
  return { output: result, ansiOutput: result };
}

function dockerLogs(s: DockerSimulationState, args: string[]): { output: string; ansiOutput: string } {
  if (args.length === 0) return { output: "Usage: docker logs [CONTAINER]", ansiOutput: ANSI.yellow("Usage: docker logs [CONTAINER]") };

  const container = findContainer(s, args[0]);
  if (!container) {
    const msg = `Error response from daemon: No such container: ${args[0]}`;
    return { output: msg, ansiOutput: ANSI.red(msg) };
  }

  const result = container.logs.join("\n") || "(no logs)";
  return { output: result, ansiOutput: result };
}

function dockerExec(s: DockerSimulationState, args: string[]): { output: string; ansiOutput: string } {
  if (args.length === 0) return { output: "Usage: docker exec [OPTIONS] CONTAINER COMMAND [ARGS...]", ansiOutput: ANSI.yellow("Usage: docker exec [OPTIONS] CONTAINER COMMAND [ARGS...]") };

  const containerName = args.filter(a => !a.startsWith("-"))[0];
  if (!containerName) return { output: "Usage: docker exec [OPTIONS] CONTAINER COMMAND [ARGS...]", ansiOutput: ANSI.yellow("Usage: docker exec [OPTIONS] CONTAINER COMMAND [ARGS...]") };

  const container = findContainer(s, containerName);
  if (!container) {
    const msg = `Error response from daemon: No such container: ${containerName}`;
    return { output: msg, ansiOutput: ANSI.red(msg) };
  }
  if (container.status !== "running") {
    const msg = `Error response from daemon: Container ${containerName} is not running`;
    return { output: msg, ansiOutput: ANSI.red(msg) };
  }

  return { output: `Executing command in container ${container.name}...`, ansiOutput: ANSI.green(`Executing command in container ${container.name}...`) };
}

function dockerComposeUp(s: DockerSimulationState, _args: string[]): { output: string; ansiOutput: string } {
  s.networks.add("my-app_default");
  const output = "[+] Running 3/3\n \u2713 Network my-app_default  Created\n \u2713 Container my-app-web-1  Started\n \u2713 Container my-app-db-1   Started";
  const ansiOutput = `[+] Running ${ANSI.green("3/3")}\n ${ANSI.green("\u2713")} Network my-app_default  Created\n ${ANSI.green("\u2713")} Container my-app-web-1  Started\n ${ANSI.green("\u2713")} Container my-app-db-1   Started`;
  return { output, ansiOutput };
}

function dockerComposeDown(s: DockerSimulationState, _args: string[]): { output: string; ansiOutput: string } {
  s.networks.delete("my-app_default");
  const output = "[+] Removing 3/3\n \u2713 Container my-app-web-1  Removed\n \u2713 Container my-app-db-1   Removed\n \u2713 Network my-app_default  Removed";
  const ansiOutput = `[+] Removing ${ANSI.green("3/3")}\n ${ANSI.green("\u2713")} Container my-app-web-1  Removed\n ${ANSI.green("\u2713")} Container my-app-db-1   Removed\n ${ANSI.green("\u2713")} Network my-app_default  Removed`;
  return { output, ansiOutput };
}

// ============================================================
// Usage Help
// ============================================================

export function dockerUsage(): string {
  return `Usage: docker [COMMAND]

Common commands:
  run       Run a container
  ps        List containers
  pull      Pull an image
  stop      Stop a container
  rm        Remove a container
  images    List images
  logs      View container logs
  exec      Execute command in container
  start     Start a stopped container
  kill      Kill a running container
  compose   Docker Compose

Type 'help' for full list.`;
}

function dockerUsageAnsi(): string {
  return `Usage: docker [COMMAND]

${ANSI.bold("Common commands:")}
  ${ANSI.cyan("run")}       Run a container
  ${ANSI.cyan("ps")}        List containers
  ${ANSI.cyan("pull")}      Pull an image
  ${ANSI.cyan("stop")}      Stop a container
  ${ANSI.cyan("rm")}        Remove a container
  ${ANSI.cyan("images")}    List images
  ${ANSI.cyan("logs")}      View container logs
  ${ANSI.cyan("exec")}      Execute command in container
  ${ANSI.cyan("start")}     Start a stopped container
  ${ANSI.cyan("kill")}      Kill a running container
  ${ANSI.cyan("compose")}   Docker Compose

Type '${ANSI.bold("help")}' for full list.`;
}

// ============================================================
// Internal Helpers
// ============================================================

function findContainer(s: DockerSimulationState, idOrName: string): SimContainer | undefined {
  return [...s.containers.values()].find(
    c => c.id === idOrName || c.id.startsWith(idOrName) || c.name === idOrName,
  );
}

function cloneState(s: DockerSimulationState): DockerSimulationState {
  return {
    containers: new Map([...s.containers.entries()].map(([k, v]) => [k, { ...v, logs: [...v.logs] }])),
    images: new Map([...s.images.entries()].map(([k, v]) => [k, { ...v }])),
    networks: new Set(s.networks),
    cwd: s.cwd,
    env: { ...s.env },
    filesystem: new Map(s.filesystem),
    directories: new Set(s.directories),
    counter: s.counter,
  };
}

function pad(str: string, len: number): string {
  // Strip ANSI codes for length calculation
  const stripped = str.replace(/\x1b\[[0-9;]*m/g, "");
  return str + " ".repeat(Math.max(0, len - stripped.length));
}

function timeAgo(createdAt: number, current: number): string {
  const diff = current - createdAt;
  if (diff <= 0) return "Up Less than a second";
  if (diff < 60) return `Up ${diff} seconds`;
  if (diff < 3600) return `Up ${Math.floor(diff / 60)} minutes`;
  return `Up ${Math.floor(diff / 3600)} hours`;
}

function timestamp(): string {
  return "2024-01-15 10:00:00";
}

function resolvePath(cwd: string, rel: string): string {
  if (rel.startsWith("/")) return rel;
  const parts = cwd.split("/").filter(Boolean);
  for (const seg of rel.split("/")) {
    if (seg === "..") parts.pop();
    else if (seg !== ".") parts.push(seg);
  }
  return "/" + parts.join("/");
}