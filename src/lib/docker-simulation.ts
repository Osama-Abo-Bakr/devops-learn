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
    case "docker rmi":
      ({ output, ansiOutput } = dockerRmi(s, args));
      break;
    case "docker inspect":
      ({ output, ansiOutput } = dockerInspect(s, args));
      break;
    case "docker restart":
      ({ output, ansiOutput } = dockerRestart(s, args));
      break;
    case "docker rename":
      ({ output, ansiOutput } = dockerRename(s, args));
      break;
    case "docker top":
      ({ output, ansiOutput } = dockerTop(s, args));
      break;
    case "docker stats":
      ({ output, ansiOutput } = dockerStats(s, args));
      break;
    case "docker port":
      ({ output, ansiOutput } = dockerPort(s, args));
      break;
    case "docker cp":
      ({ output, ansiOutput } = dockerCp(s, args));
      break;
    case "docker search":
      ({ output, ansiOutput } = dockerSearch(s, args));
      break;
    case "docker version":
      ({ output, ansiOutput } = dockerVersion());
      break;
    case "docker info":
      ({ output, ansiOutput } = dockerInfo(s));
      break;
    case "docker build":
      ({ output, ansiOutput } = dockerBuild(s, args));
      break;
    case "docker tag":
      ({ output, ansiOutput } = dockerTag(s, args));
      break;
    case "docker network":
      ({ output, ansiOutput } = dockerNetwork(s, args));
      break;
    case "docker network ls":
      ({ output, ansiOutput } = dockerNetwork(s, ["ls"]));
      break;
    case "docker network create":
      ({ output, ansiOutput } = dockerNetwork(s, ["create", ...args]));
      break;
    case "docker network rm":
      ({ output, ansiOutput } = dockerNetwork(s, ["rm", ...args]));
      break;
    case "docker network inspect":
      ({ output, ansiOutput } = dockerNetwork(s, ["inspect", ...args]));
      break;
    case "docker volume":
      ({ output, ansiOutput } = dockerVolume(s, args));
      break;
    case "docker volume ls":
      ({ output, ansiOutput } = dockerVolume(s, ["ls"]));
      break;
    case "docker volume create":
      ({ output, ansiOutput } = dockerVolume(s, ["create", ...args]));
      break;
    case "docker volume rm":
      ({ output, ansiOutput } = dockerVolume(s, ["rm", ...args]));
      break;
    case "docker volume inspect":
      ({ output, ansiOutput } = dockerVolume(s, ["inspect", ...args]));
      break;
    case "docker system":
      ({ output, ansiOutput } = dockerSystem(s, args));
      break;
    case "docker system df":
      ({ output, ansiOutput } = dockerSystem(s, ["df"]));
      break;
    case "docker system prune":
      ({ output, ansiOutput } = dockerSystem(s, ["prune"]));
      break;
    case "docker login":
      ({ output, ansiOutput } = dockerLogin());
      break;
    case "docker logout":
      ({ output, ansiOutput } = { output: "Removing login credentials for https://index.docker.io/v1/", ansiOutput: ANSI.dim("Removing login credentials for https://index.docker.io/v1/") });
      break;
    case "docker compose":
      ({ output, ansiOutput } = dockerComposeUsage());
      break;
    case "docker compose up":
      ({ output, ansiOutput } = dockerComposeUp(s, args));
      break;
    case "docker compose down":
      ({ output, ansiOutput } = dockerComposeDown(s, args));
      break;
    case "docker compose build":
      ({ output, ansiOutput } = dockerComposeBuild(s, args));
      break;
    case "docker compose ps":
      ({ output, ansiOutput } = dockerComposePs(s));
      break;
    case "docker compose logs":
      ({ output, ansiOutput } = dockerComposeLogs(s, args));
      break;
    case "docker compose exec":
      ({ output, ansiOutput } = dockerComposeExec(s, args));
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

function dockerComposeBuild(s: DockerSimulationState, _args: string[]): { output: string; ansiOutput: string } {
  const output = "[+] Building 2/2\n \u2713 Container my-app-web  Built\n \u2713 Container my-app-db   Built";
  const ansiOutput = `[+] Building ${ANSI.green("2/2")}\n ${ANSI.green("\u2713")} Container my-app-web  Built\n ${ANSI.green("\u2713")} Container my-app-db   Built`;
  return { output, ansiOutput };
}

function dockerComposePs(s: DockerSimulationState): { output: string; ansiOutput: string } {
  const header = "NAME           SERVICE   STATUS       PORTS";
  const rows = [
    `my-app-web-1   web       ${ANSI.green("Up")}          0.0.0.0:3000->3000/tcp`,
    `my-app-db-1    db        ${ANSI.green("Up")}          5432/tcp`,
  ];
  const plainRows = [
    "my-app-web-1   web       Up           0.0.0.0:3000->3000/tcp",
    "my-app-db-1    db        Up           5432/tcp",
  ];
  return { output: `${header}\n${plainRows.join("\n")}`, ansiOutput: `${header}\n${rows.join("\n")}` };
}

function dockerComposeLogs(s: DockerSimulationState, args: string[]): { output: string; ansiOutput: string } {
  const service = args[0] || "";
  const webLogs = `[web-1] Server started on port 3000\n[web-1] Ready for connections`;
  const dbLogs = `[db-1] PostgreSQL init process complete\n[db-1] database system is ready to accept connections`;
  if (service === "web") return { output: webLogs, ansiOutput: webLogs };
  if (service === "db") return { output: dbLogs, ansiOutput: dbLogs };
  return { output: `${webLogs}\n${dbLogs}`, ansiOutput: `${webLogs}\n${dbLogs}` };
}

function dockerComposeExec(s: DockerSimulationState, args: string[]): { output: string; ansiOutput: string } {
  if (args.length < 2) return { output: "Usage: docker compose exec SERVICE COMMAND", ansiOutput: ANSI.yellow("Usage: docker compose exec SERVICE COMMAND") };
  return { output: `Executing '${args.slice(1).join(" ")}' in ${args[0]}...`, ansiOutput: ANSI.green(`Executing '${args.slice(1).join(" ")}' in ${args[0]}...`) };
}

function dockerComposeUsage(): { output: string; ansiOutput: string } {
  const output = `Usage: docker compose [COMMAND]

Commands:
  up       Start services
  down     Stop and remove services
  build    Build or rebuild services
  ps       List containers
  logs     View output from containers
  exec     Execute a command in a running container`;

  const ansiOutput = `Usage: docker compose [COMMAND]

${ANSI.bold("Commands:")}
  ${ANSI.cyan("up")}       Start services
  ${ANSI.cyan("down")}     Stop and remove services
  ${ANSI.cyan("build")}    Build or rebuild services
  ${ANSI.cyan("ps")}       List containers
  ${ANSI.cyan("logs")}     View output from containers
  ${ANSI.cyan("exec")}     Execute a command in a running container`;

  return { output, ansiOutput };
}

function dockerRmi(s: DockerSimulationState, args: string[]): { output: string; ansiOutput: string } {
  if (args.length === 0) return { output: "Usage: docker rmi [IMAGE]", ansiOutput: ANSI.yellow("Usage: docker rmi [IMAGE]") };
  const force = args.includes("-f");
  const idOrRef = args.find(a => !a.startsWith("-")) || args[0];

  const image = [...s.images.values()].find(i => i.id === idOrRef || i.id.startsWith(idOrRef) || `${i.repository}:${i.tag}` === idOrRef || i.repository === idOrRef);
  if (!image) {
    const msg = `Error response from daemon: No such image: ${idOrRef}`;
    return { output: msg, ansiOutput: ANSI.red(msg) };
  }

  // Check if any running container uses this image
  const usedBy = [...s.containers.values()].find(c => c.image === `${image.repository}:${image.tag}` && c.status === "running");
  if (usedBy && !force) {
    const msg = `Error response from daemon: image is referenced by container ${usedBy.id}. Use -f to force`;
    return { output: msg, ansiOutput: ANSI.red(msg) };
  }

  s.images.delete(image.id);
  return { output: `Untagged: ${image.repository}:${image.tag}\nDeleted: ${image.id}`, ansiOutput: `${ANSI.dim("Untagged:")} ${image.repository}:${image.tag}\n${ANSI.dim("Deleted:")} ${image.id}` };
}

function dockerInspect(s: DockerSimulationState, args: string[]): { output: string; ansiOutput: string } {
  if (args.length === 0) return { output: "Usage: docker inspect [CONTAINER|IMAGE]", ansiOutput: ANSI.yellow("Usage: docker inspect [CONTAINER|IMAGE]") };

  const container = findContainer(s, args[0]);
  if (container) {
    const json = JSON.stringify([{
      Id: container.id,
      Name: container.name,
      Image: container.image,
      State: { Status: container.status, Running: container.status === "running", ExitCode: container.exitCode },
      NetworkSettings: { Networks: { [container.network]: {} } },
      Created: container.createdAt,
    }], null, 2);
    return { output: json, ansiOutput: json };
  }

  const image = [...s.images.values()].find(i => i.id === args[0] || i.id.startsWith(args[0]) || `${i.repository}:${i.tag}` === args[0]);
  if (image) {
    const json = JSON.stringify([{
      Id: image.id,
      Repository: image.repository,
      Tag: image.tag,
      Size: image.size,
    }], null, 2);
    return { output: json, ansiOutput: json };
  }

  const msg = `Error response from daemon: No such object: ${args[0]}`;
  return { output: msg, ansiOutput: ANSI.red(msg) };
}

function dockerRestart(s: DockerSimulationState, args: string[]): { output: string; ansiOutput: string } {
  if (args.length === 0) return { output: "Usage: docker restart [CONTAINER]", ansiOutput: ANSI.yellow("Usage: docker restart [CONTAINER]") };
  const container = findContainer(s, args[0]);
  if (!container) { const msg = `Error response from daemon: No such container: ${args[0]}`; return { output: msg, ansiOutput: ANSI.red(msg) }; }

  container.status = "running";
  container.exitCode = null;
  container.logs.push(`[${timestamp()}] Container ${container.name} restarted`);
  return { output: container.name, ansiOutput: ANSI.green(container.name) };
}

function dockerRename(s: DockerSimulationState, args: string[]): { output: string; ansiOutput: string } {
  if (args.length < 2) return { output: "Usage: docker rename OLD_NAME NEW_NAME", ansiOutput: ANSI.yellow("Usage: docker rename OLD_NAME NEW_NAME") };
  const container = findContainer(s, args[0]);
  if (!container) { const msg = `Error response from daemon: No such container: ${args[0]}`; return { output: msg, ansiOutput: ANSI.red(msg) }; }
  const oldName = container.name;
  container.name = args[1];
  return { output: `Renamed container ${oldName} to ${args[1]}`, ansiOutput: `Renamed container ${oldName} to ${ANSI.green(args[1])}` };
}

function dockerTop(s: DockerSimulationState, args: string[]): { output: string; ansiOutput: string } {
  if (args.length === 0) return { output: "Usage: docker top [CONTAINER]", ansiOutput: ANSI.yellow("Usage: docker top [CONTAINER]") };
  const container = findContainer(s, args[0]);
  if (!container) { const msg = `Error response from daemon: No such container: ${args[0]}`; return { output: msg, ansiOutput: ANSI.red(msg) }; }
  if (container.status !== "running") { const msg = `Container ${args[0]} is not running`; return { output: msg, ansiOutput: ANSI.red(msg) }; }

  const header = "UID    PID     PPID    C    STIME   TTY     TIME      CMD";
  const row = "root   1234    1       0    10:00   ?       00:00:01  node server.js";
  return { output: `${header}\n${row}`, ansiOutput: `${header}\n${row}` };
}

function dockerStats(s: DockerSimulationState, args: string[]): { output: string; ansiOutput: string } {
  const noStream = args.includes("--no-stream");
  const running = [...s.containers.values()].filter(c => c.status === "running");
  if (running.length === 0) return { output: "CONTAINER ID   NAME   CPU %   MEM USAGE / LIMIT   MEM %   NET I/O   BLOCK I/O   PIDS", ansiOutput: "CONTAINER ID   NAME   CPU %   MEM USAGE / LIMIT   MEM %   NET I/O   BLOCK I/O   PIDS" };

  const header = "CONTAINER ID   NAME           CPU %   MEM USAGE / LIMIT   MEM %   NET I/O         BLOCK I/O   PIDS";
  const rows = running.map(c => `${c.id}   ${pad(c.name, 14)} 0.${Math.floor(Math.random()*9)}%   ${Math.floor(Math.random()*100)}MiB / 512MiB   ${Math.floor(Math.random()*20)}%   ${Math.floor(Math.random()*10)}kB / ${Math.floor(Math.random()*5)}kB   0B / 0B     1`).join("\n");
  return { output: `${header}\n${rows}`, ansiOutput: `${header}\n${rows}` };
}

function dockerPort(s: DockerSimulationState, args: string[]): { output: string; ansiOutput: string } {
  if (args.length === 0) return { output: "Usage: docker port [CONTAINER]", ansiOutput: ANSI.yellow("Usage: docker port [CONTAINER]") };
  const container = findContainer(s, args[0]);
  if (!container) { const msg = `Error response from daemon: No such container: ${args[0]}`; return { output: msg, ansiOutput: ANSI.red(msg) }; }
  if (container.ports.length === 0) return { output: "(no ports)", ansiOutput: ANSI.dim("(no ports)") };
  const result = container.ports.join("\n");
  return { output: result, ansiOutput: result };
}

function dockerCp(s: DockerSimulationState, args: string[]): { output: string; ansiOutput: string } {
  if (args.length < 2) return { output: "Usage: docker cp [CONTAINER:]SRC_PATH [CONTAINER:]DEST_PATH", ansiOutput: ANSI.yellow("Usage: docker cp [CONTAINER:]SRC_PATH [CONTAINER:]DEST_PATH") };
  return { output: `Successfully copied ${args[0]} to ${args[1]}`, ansiOutput: ANSI.green(`Successfully copied ${args[0]} to ${args[1]}`) };
}

function dockerSearch(s: DockerSimulationState, args: string[]): { output: string; ansiOutput: string } {
  if (args.length === 0) return { output: "Usage: docker search [TERM]", ansiOutput: ANSI.yellow("Usage: docker search [TERM]") };
  const term = args[0].toLowerCase();
  const results = [
    { name: `${term}`, description: "Official Docker image", stars: 10000, official: true },
    { name: `${term}/alpine`, description: "Lightweight image", stars: 5000, official: false },
    { name: `bitnami/${term}`, description: "Bitnami Docker image", stars: 2000, official: false },
  ];
  const header = "NAME                 DESCRIPTION                             STARS   OFFICIAL";
  const rows = results.map(r => `${pad(r.name, 20)} ${pad(r.description, 40)} ${pad(String(r.stars), 7)} ${r.official ? "[OK]" : ""}`).join("\n");
  return { output: `${header}\n${rows}`, ansiOutput: `${header}\n${rows}` };
}

function dockerVersion(): { output: string; ansiOutput: string } {
  const output = `Client:
 Version:           25.0.3
 API version:       1.44
 Go version:        go1.21.6
 Git commit:        f417435
 Built:             Tue Feb 13 00:00:00 2024
 OS/Arch:           darwin/amd64
 Context:           default

Server:
 Engine:
  Version:          25.0.3
  API version:      1.44 (minimum version 1.24)
  Go version:       go1.21.6
  Git commit:       f417435
  Built:            Tue Feb 13 00:00:00 2024
  OS/Arch:          linux/amd64`;

  return { output, ansiOutput: output };
}

function dockerInfo(s: DockerSimulationState): { output: string; ansiOutput: string } {
  const running = [...s.containers.values()].filter(c => c.status === "running").length;
  const stopped = [...s.containers.values()].filter(c => c.status !== "running").length;
  const output = `Containers: ${s.containers.size}
 Running: ${running}
 Paused: 0
 Stopped: ${stopped}
Images: ${s.images.size}
Server Version: 25.0.3
Storage Driver: overlay2
Docker Root Dir: /var/lib/docker
Operating System: Docker Desktop
Kernel Version: 6.1.0-linux
Architecture: x86_64
CPUs: 4
Total Memory: 7.77GiB
Name: docker-desktop`;

  return { output, ansiOutput: output };
}

function dockerBuild(s: DockerSimulationState, args: string[]): { output: string; ansiOutput: string } {
  const tagIdx = args.indexOf("-t");
  const tag = tagIdx >= 0 && args[tagIdx + 1] ? args[tagIdx + 1] : "my-app:latest";
  const msg = `#1 [internal] load build definition from Dockerfile
#2 [internal] load .dockerignore
#3 [1/3] FROM node:18-alpine
#4 [2/3] COPY . /app
#5 [3/3] RUN npm install
#6 exporting to image
#7 writing image sha256:${randomHex(12)}
#8 naming to ${tag}

Successfully built ${randomHex(12)}
Successfully tagged ${tag}`;

  const ansiMsg = `#1 [internal] load build definition from Dockerfile
#2 [internal] load .dockerignore
#3 [1/3] FROM node:18-alpine
#4 [2/3] COPY . /app
#5 [3/3] RUN npm install
#6 exporting to image
#7 writing image sha256:${randomHex(12)}
#8 naming to ${tag}

${ANSI.green("Successfully built")} ${randomHex(12)}
${ANSI.green("Successfully tagged")} ${tag}`;

  return { output: msg, ansiOutput: ansiMsg };
}

function dockerTag(s: DockerSimulationState, args: string[]): { output: string; ansiOutput: string } {
  if (args.length < 2) return { output: "Usage: docker tag SOURCE_IMAGE[:TAG] TARGET_IMAGE[:TAG]", ansiOutput: ANSI.yellow("Usage: docker tag SOURCE_IMAGE[:TAG] TARGET_IMAGE[:TAG]") };
  return { output: `Tagged ${args[0]} as ${args[1]}`, ansiOutput: `${ANSI.green("Tagged")} ${args[0]} as ${args[1]}` };
}

function dockerNetwork(s: DockerSimulationState, args: string[]): { output: string; ansiOutput: string } {
  if (args.length === 0) return { output: "Usage: docker network [COMMAND]\n\nCommands: ls, create, rm, inspect", ansiOutput: ANSI.yellow("Usage: docker network [COMMAND]\n\nCommands: ls, create, rm, inspect") };

  const sub = args[0];
  switch (sub) {
    case "ls": {
      const header = "NETWORK ID   NAME              DRIVER   SCOPE";
      const rows = [...s.networks].map(n => `${randomHex(12)}   ${pad(n, 17)} bridge   local`).join("\n");
      return { output: `${header}\n${rows}`, ansiOutput: `${header}\n${rows}` };
    }
    case "create": {
      if (args.length < 2) return { output: "Usage: docker network create [NAME]", ansiOutput: ANSI.yellow("Usage: docker network create [NAME]") };
      s.networks.add(args[1]);
      return { output: `${randomHex(12)}`, ansiOutput: ANSI.green(randomHex(12)) };
    }
    case "rm": {
      if (args.length < 2) return { output: "Usage: docker network rm [NAME]", ansiOutput: ANSI.yellow("Usage: docker network rm [NAME]") };
      if (args[1] === "bridge" || args[1] === "host") { const msg = `Error: cannot remove default network '${args[1]}'`; return { output: msg, ansiOutput: ANSI.red(msg) }; }
      if (!s.networks.has(args[1])) { const msg = `Error: network ${args[1]} not found`; return { output: msg, ansiOutput: ANSI.red(msg) }; }
      s.networks.delete(args[1]);
      return { output: args[1], ansiOutput: args[1] };
    }
    case "inspect": {
      if (args.length < 2) return { output: "Usage: docker network inspect [NAME]", ansiOutput: ANSI.yellow("Usage: docker network inspect [NAME]") };
      const json = JSON.stringify([{ Name: args[1], Driver: "bridge", Scope: "local" }], null, 2);
      return { output: json, ansiOutput: json };
    }
    default:
      return { output: `docker network: unknown command '${sub}'`, ansiOutput: ANSI.red(`docker network: unknown command '${sub}'`) };
  }
}

function dockerVolume(s: DockerSimulationState, args: string[]): { output: string; ansiOutput: string } {
  if (args.length === 0) return { output: "Usage: docker volume [COMMAND]\n\nCommands: ls, create, rm, inspect", ansiOutput: ANSI.yellow("Usage: docker volume [COMMAND]\n\nCommands: ls, create, rm, inspect") };

  const sub = args[0];
  switch (sub) {
    case "ls":
      return { output: "DRIVER    VOLUME NAME\nlocal     my-app-data", ansiOutput: "DRIVER    VOLUME NAME\nlocal     my-app-data" };
    case "create": {
      const name = args[1] || `vol_${randomHex(6)}`;
      return { output: name, ansiOutput: ANSI.green(name) };
    }
    case "rm":
      return { output: args[1] || "Usage: docker volume rm [NAME]", ansiOutput: args[1] || ANSI.yellow("Usage: docker volume rm [NAME]") };
    case "inspect": {
      const json = JSON.stringify([{ Name: args[1] || "my-app-data", Driver: "local", Mountpoint: "/var/lib/docker/volumes/my-app-data/_data" }], null, 2);
      return { output: json, ansiOutput: json };
    }
    default:
      return { output: `docker volume: unknown command '${sub}'`, ansiOutput: ANSI.red(`docker volume: unknown command '${sub}'`) };
  }
}

function dockerSystem(s: DockerSimulationState, args: string[]): { output: string; ansiOutput: string } {
  if (args.length === 0) return { output: "Usage: docker system [COMMAND]\n\nCommands: df, info, prune", ansiOutput: ANSI.yellow("Usage: docker system [COMMAND]\n\nCommands: df, info, prune") };

  const sub = args[0];
  switch (sub) {
    case "df": {
      const output = `TYPE            TOTAL   ACTIVE  SIZE      RECLAIMABLE
Images          ${s.images.size}       ${Math.min(s.images.size, 2)}       ${(s.images.size * 200).toFixed(0)}MB     ${(s.images.size * 150).toFixed(0)}MB (75%)
Containers      ${s.containers.size}       ${[...s.containers.values()].filter(c => c.status === "running").length}       ${(s.containers.size * 10).toFixed(0)}MB      0B (0%)
Local Volumes   1       1       50MB      0B (0%)`;
      return { output, ansiOutput: output };
    }
    case "prune": {
      const removed = s.containers.size;
      for (const [id, c] of s.containers) {
        if (c.status !== "running") s.containers.delete(id);
      }
      const msg = `Deleted Containers:\n${removed} containers removed\nTotal reclaimed space: ${Math.floor(Math.random() * 500)}MB`;
      return { output: msg, ansiOutput: `${ANSI.green("Deleted Containers:")}\n${removed} containers removed\nTotal reclaimed space: ${Math.floor(Math.random() * 500)}MB` };
    }
    default: {
      const msg = `docker system: unknown command '${sub}'`;
      return { output: msg, ansiOutput: ANSI.red(msg) };
    }
  }
}

function dockerLogin(): { output: string; ansiOutput: string } {
  return { output: "Authenticating with existing credentials...\nLogin Succeeded", ansiOutput: `Authenticating with existing credentials...\n${ANSI.green("Login Succeeded")}` };
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
  rmi       Remove an image
  images    List images
  logs      View container logs
  exec      Execute command in container
  start     Start a stopped container
  restart   Restart a container
  kill      Kill a running container
  build     Build an image from a Dockerfile
  tag       Tag an image

Management commands:
  compose   Docker Compose
  network   Manage networks
  volume    Manage volumes
  system    Manage Docker

Other commands:
  inspect   Inspect container/image details
  search    Search Docker Hub for images
  port      List port mappings
  top       Display running processes
  stats     Container resource usage stats
  rename    Rename a container
  cp        Copy files between container/host
  version   Show Docker version
  info      Display system info
  login     Log in to a registry
  logout    Log out from a registry

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
  ${ANSI.cyan("rmi")}       Remove an image
  ${ANSI.cyan("images")}    List images
  ${ANSI.cyan("logs")}      View container logs
  ${ANSI.cyan("exec")}      Execute command in container
  ${ANSI.cyan("start")}     Start a stopped container
  ${ANSI.cyan("restart")}   Restart a container
  ${ANSI.cyan("kill")}      Kill a running container
  ${ANSI.cyan("build")}     Build an image from a Dockerfile
  ${ANSI.cyan("tag")}       Tag an image

${ANSI.bold("Management commands:")}
  ${ANSI.cyan("compose")}   Docker Compose
  ${ANSI.cyan("network")}   Manage networks
  ${ANSI.cyan("volume")}    Manage volumes
  ${ANSI.cyan("system")}    Manage Docker

${ANSI.bold("Other commands:")}
  ${ANSI.cyan("inspect")}   Inspect container/image details
  ${ANSI.cyan("search")}    Search Docker Hub for images
  ${ANSI.cyan("port")}      List port mappings
  ${ANSI.cyan("top")}       Display running processes
  ${ANSI.cyan("stats")}     Container resource usage stats
  ${ANSI.cyan("rename")}    Rename a container
  ${ANSI.cyan("cp")}        Copy files between container/host
  ${ANSI.cyan("version")}   Show Docker version
  ${ANSI.cyan("info")}      Display system info
  ${ANSI.cyan("login")}     Log in to a registry
  ${ANSI.cyan("logout")}    Log out from a registry

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