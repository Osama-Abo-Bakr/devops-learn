import { describe, it, expect } from "vitest";
import {
  createInitialState,
  executeDockerCommand,
  executeFilesystemCommand,
  type DockerSimulationState,
} from "./docker-simulation";

function freshState(): DockerSimulationState {
  return createInitialState();
}

function stripAnsi(s: string): string {
  return s.replace(/\x1b\[[0-9;]*m/g, "");
}

describe("createInitialState", () => {
  it("has default images", () => {
    const s = freshState();
    expect(s.images.size).toBe(6);
    const repos = [...s.images.values()].map((i) => i.repository);
    expect(repos).toContain("nginx");
    expect(repos).toContain("alpine");
    expect(repos).toContain("node");
  });

  it("has no containers", () => {
    const s = freshState();
    expect(s.containers.size).toBe(0);
  });

  it("has default filesystem", () => {
    const s = freshState();
    expect(s.filesystem.has("/home/user/Dockerfile")).toBe(true);
    expect(s.directories.has("/home/user")).toBe(true);
  });
});

describe("docker pull", () => {
  it("pulls a new image", () => {
    let s = freshState();
    const { output, newState } = executeDockerCommand(s, "docker pull", ["golang:1.21"]);
    expect(output).toContain("Pull complete");
    expect(output).toContain("golang:1.21");
    const golangImg = [...newState.images.values()].find(
      (i) => i.repository === "golang" && i.tag === "1.21",
    );
    expect(golangImg).toBeDefined();
  });

  it("reports already exists for existing image", () => {
    let s = freshState();
    const { output } = executeDockerCommand(s, "docker pull", ["nginx:latest"]);
    expect(output).toContain("Already exists");
  });

  it("shows usage with no args", () => {
    let s = freshState();
    const { output } = executeDockerCommand(s, "docker pull", []);
    expect(output).toContain("Usage");
  });
});

describe("docker run", () => {
  it("creates a running container", () => {
    let s = freshState();
    const { output, newState } = executeDockerCommand(s, "docker run", ["-d", "nginx"]);
    expect(newState.containers.size).toBe(1);
    const c = [...newState.containers.values()][0];
    expect(c.status).toBe("running");
    expect(c.image).toBe("nginx:latest");
  });

  it("returns container ID in detached mode", () => {
    let s = freshState();
    const { output, newState } = executeDockerCommand(s, "docker run", ["-d", "nginx"]);
    const c = [...newState.containers.values()][0];
    expect(output).toContain(c.id);
  });

  it("accepts --name flag", () => {
    let s = freshState();
    const { newState } = executeDockerCommand(s, "docker run", ["--name", "my-app", "nginx"]);
    const c = [...newState.containers.values()][0];
    expect(c.name).toBe("my-app");
  });

  it("auto-pulls missing image and creates container", () => {
    let s = freshState();
    const { output, newState } = executeDockerCommand(s, "docker run", ["ubuntu"]);
    expect(output).toContain("Downloaded newer image");
    expect(newState.containers.size).toBe(1);
  });
});

describe("docker ps", () => {
  it("shows only running containers by default", () => {
    let s = freshState();
    s = executeDockerCommand(s, "docker run", ["-d", "nginx"]).newState;
    const { output } = executeDockerCommand(s, "docker ps", []);
    expect(output).toContain("CONTAINER ID");
    expect(output).toContain("nginx:latest");
  });

  it("shows empty table when no running containers", () => {
    let s = freshState();
    const { output } = executeDockerCommand(s, "docker ps", []);
    expect(output).toContain("CONTAINER ID");
    expect(output).not.toMatch(/^[A-Z].*\n[a-f0-9]/m);
  });

  it("shows stopped containers with -a flag", () => {
    let s = freshState();
    s = executeDockerCommand(s, "docker run", ["-d", "nginx"]).newState;
    const container = [...s.containers.values()][0];
    s = executeDockerCommand(s, "docker stop", [container.id]).newState;
    const { output } = executeDockerCommand(s, "docker ps", ["-a"]);
    expect(output).toContain("Exited");
  });

  it("hides stopped containers without -a flag", () => {
    let s = freshState();
    s = executeDockerCommand(s, "docker run", ["-d", "nginx"]).newState;
    const container = [...s.containers.values()][0];
    s = executeDockerCommand(s, "docker stop", [container.id]).newState;
    const { output } = executeDockerCommand(s, "docker ps", []);
    expect(stripAnsi(output)).not.toContain("Exited");
  });
});

describe("docker stop", () => {
  it("stops a running container", () => {
    let s = freshState();
    s = executeDockerCommand(s, "docker run", ["-d", "nginx"]).newState;
    const c = [...s.containers.values()][0];
    const { output, newState } = executeDockerCommand(s, "docker stop", [c.id]);
    expect(newState.containers.get(c.id)!.status).toBe("stopped");
  });

  it("errors on nonexistent container", () => {
    let s = freshState();
    const { output } = executeDockerCommand(s, "docker stop", ["nonexistent"]);
    expect(output).toContain("No such container");
  });

  it("warns when container is not running", () => {
    let s = freshState();
    s = executeDockerCommand(s, "docker run", ["-d", "nginx"]).newState;
    const c = [...s.containers.values()][0];
    s = executeDockerCommand(s, "docker stop", [c.id]).newState;
    const { output } = executeDockerCommand(s, "docker stop", [c.id]);
    expect(output).toContain("not running");
  });
});

describe("docker rm", () => {
  it("removes a stopped container", () => {
    let s = freshState();
    s = executeDockerCommand(s, "docker run", ["-d", "nginx"]).newState;
    const c = [...s.containers.values()][0];
    s = executeDockerCommand(s, "docker stop", [c.id]).newState;
    const { newState } = executeDockerCommand(s, "docker rm", [c.id]);
    expect(newState.containers.size).toBe(0);
  });

  it("errors when removing a running container without -f", () => {
    let s = freshState();
    s = executeDockerCommand(s, "docker run", ["-d", "nginx"]).newState;
    const c = [...s.containers.values()][0];
    const { output } = executeDockerCommand(s, "docker rm", [c.id]);
    expect(output).toContain("cannot remove a running container");
  });

  it("force removes a running container with -f", () => {
    let s = freshState();
    s = executeDockerCommand(s, "docker run", ["-d", "nginx"]).newState;
    const c = [...s.containers.values()][0];
    const { newState } = executeDockerCommand(s, "docker rm", ["-f", c.id]);
    expect(newState.containers.size).toBe(0);
  });

  it("errors on nonexistent container", () => {
    let s = freshState();
    const { output } = executeDockerCommand(s, "docker rm", ["nonexistent"]);
    expect(output).toContain("No such container");
  });
});

describe("docker start", () => {
  it("starts a stopped container", () => {
    let s = freshState();
    s = executeDockerCommand(s, "docker run", ["-d", "nginx"]).newState;
    const c = [...s.containers.values()][0];
    s = executeDockerCommand(s, "docker stop", [c.id]).newState;
    const { newState } = executeDockerCommand(s, "docker start", [c.id]);
    expect(newState.containers.get(c.id)!.status).toBe("running");
  });

  it("errors on nonexistent container", () => {
    let s = freshState();
    const { output } = executeDockerCommand(s, "docker start", ["nonexistent"]);
    expect(output).toContain("No such container");
  });
});

describe("docker kill", () => {
  it("kills a running container", () => {
    let s = freshState();
    s = executeDockerCommand(s, "docker run", ["-d", "nginx"]).newState;
    const c = [...s.containers.values()][0];
    const { newState } = executeDockerCommand(s, "docker kill", [c.id]);
    expect(newState.containers.get(c.id)!.status).toBe("dead");
    expect(newState.containers.get(c.id)!.exitCode).toBe(137);
  });

  it("errors on nonexistent container", () => {
    let s = freshState();
    const { output } = executeDockerCommand(s, "docker kill", ["nonexistent"]);
    expect(output).toContain("No such container");
  });
});

describe("docker images", () => {
  it("lists available images", () => {
    let s = freshState();
    const { output } = executeDockerCommand(s, "docker images", []);
    expect(output).toContain("REPOSITORY");
    expect(output).toContain("nginx");
    expect(output).toContain("alpine");
  });
});

describe("docker logs", () => {
  it("shows container logs", () => {
    let s = freshState();
    s = executeDockerCommand(s, "docker run", ["-d", "nginx"]).newState;
    const c = [...s.containers.values()][0];
    const { output } = executeDockerCommand(s, "docker logs", [c.id]);
    expect(output).toContain("started");
  });

  it("errors on nonexistent container", () => {
    let s = freshState();
    const { output } = executeDockerCommand(s, "docker logs", ["nonexistent"]);
    expect(output).toContain("No such container");
  });
});

describe("docker exec", () => {
  it("errors on nonexistent container", () => {
    let s = freshState();
    const { output } = executeDockerCommand(s, "docker exec", ["nonexistent", "ls"]);
    expect(output).toContain("No such container");
  });

  it("errors on stopped container", () => {
    let s = freshState();
    s = executeDockerCommand(s, "docker run", ["-d", "nginx"]).newState;
    const c = [...s.containers.values()][0];
    s = executeDockerCommand(s, "docker stop", [c.id]).newState;
    const { output } = executeDockerCommand(s, "docker exec", [c.id, "ls"]);
    expect(output).toContain("not running");
  });

  it("succeeds on running container", () => {
    let s = freshState();
    s = executeDockerCommand(s, "docker run", ["-d", "nginx"]).newState;
    const c = [...s.containers.values()][0];
    const { output } = executeDockerCommand(s, "docker exec", [c.id, "ls"]);
    expect(output).toContain("Executing command");
  });
});

describe("docker compose", () => {
  it("docker compose up creates network and containers", () => {
    let s = freshState();
    const { output, newState } = executeDockerCommand(s, "docker compose up", []);
    expect(output).toContain("Running");
    expect(newState.networks.has("my-app_default")).toBe(true);
  });

  it("docker compose down removes network", () => {
    let s = freshState();
    s = executeDockerCommand(s, "docker compose up", []).newState;
    const { output, newState } = executeDockerCommand(s, "docker compose down", []);
    expect(output).toContain("Removing");
    expect(newState.networks.has("my-app_default")).toBe(false);
  });
});

describe("docker (no subcommand)", () => {
  it("shows usage help", () => {
    let s = freshState();
    const { output } = executeDockerCommand(s, "docker", []);
    expect(output).toContain("Usage: docker");
  });
});

describe("unknown docker command", () => {
  it("shows error for unknown subcommand", () => {
    let s = freshState();
    const { output } = executeDockerCommand(s, "docker foobar", []);
    expect(output).toContain("is not a docker command");
  });
});

describe("docker rmi", () => {
  it("removes an image", () => {
    let s = freshState();
    const { output, newState } = executeDockerCommand(s, "docker rmi", ["nginx"]);
    expect(output).toContain("Untagged");
    expect(newState.images.size).toBe(5);
  });

  it("errors on nonexistent image", () => {
    let s = freshState();
    const { output } = executeDockerCommand(s, "docker rmi", ["nonexistent"]);
    expect(output).toContain("No such image");
  });

  it("shows usage with no args", () => {
    let s = freshState();
    const { output } = executeDockerCommand(s, "docker rmi", []);
    expect(output).toContain("Usage");
  });
});

describe("docker inspect", () => {
  it("inspects a container", () => {
    let s = freshState();
    s = executeDockerCommand(s, "docker run", ["-d", "nginx"]).newState;
    const c = [...s.containers.values()][0];
    const { output } = executeDockerCommand(s, "docker inspect", [c.id]);
    expect(output).toContain("Id");
    expect(output).toContain("running");
  });

  it("inspects an image", () => {
    let s = freshState();
    const { output } = executeDockerCommand(s, "docker inspect", ["nginx:latest"]);
    expect(output).toContain("Repository");
  });

  it("errors on nonexistent object", () => {
    let s = freshState();
    const { output } = executeDockerCommand(s, "docker inspect", ["nonexistent"]);
    expect(output).toContain("No such object");
  });
});

describe("docker restart", () => {
  it("restarts a container", () => {
    let s = freshState();
    s = executeDockerCommand(s, "docker run", ["-d", "nginx"]).newState;
    const c = [...s.containers.values()][0];
    const { newState } = executeDockerCommand(s, "docker restart", [c.id]);
    expect(newState.containers.get(c.id)!.status).toBe("running");
  });
});

describe("docker build", () => {
  it("builds an image", () => {
    let s = freshState();
    const { output } = executeDockerCommand(s, "docker build", ["-t", "my-app:latest", "."]);
    expect(output).toContain("Successfully built");
    expect(output).toContain("my-app:latest");
  });
});

describe("docker search", () => {
  it("searches for images", () => {
    let s = freshState();
    const { output } = executeDockerCommand(s, "docker search", ["nginx"]);
    expect(output).toContain("NAME");
    expect(output).toContain("nginx");
  });
});

describe("docker version", () => {
  it("shows version info", () => {
    let s = freshState();
    const { output } = executeDockerCommand(s, "docker version", []);
    expect(output).toContain("Version");
    expect(output).toContain("25.0.3");
  });
});

describe("docker info", () => {
  it("shows system info", () => {
    let s = freshState();
    const { output } = executeDockerCommand(s, "docker info", []);
    expect(output).toContain("Containers");
    expect(output).toContain("Images");
  });
});

describe("docker network", () => {
  it("lists networks", () => {
    let s = freshState();
    const { output } = executeDockerCommand(s, "docker network", []);
    expect(output).toContain("Usage");
  });

  it("docker network ls lists networks", () => {
    let s = freshState();
    const { output } = executeDockerCommand(s, "docker network ls", []);
    expect(output).toContain("NETWORK ID");
  });

  it("docker network create adds network", () => {
    let s = freshState();
    const { newState } = executeDockerCommand(s, "docker network create", ["my-net"]);
    expect(newState.networks.has("my-net")).toBe(true);
  });

  it("docker network rm removes network", () => {
    let s = freshState();
    s = executeDockerCommand(s, "docker network create", ["my-net"]).newState;
    const { newState } = executeDockerCommand(s, "docker network rm", ["my-net"]);
    expect(newState.networks.has("my-net")).toBe(false);
  });
});

describe("docker volume", () => {
  it("shows usage with no subcommand", () => {
    let s = freshState();
    const { output } = executeDockerCommand(s, "docker volume", []);
    expect(output).toContain("Usage");
  });

  it("docker volume ls lists volumes", () => {
    let s = freshState();
    const { output } = executeDockerCommand(s, "docker volume ls", []);
    expect(output).toContain("VOLUME NAME");
  });
});

describe("docker system", () => {
  it("shows usage with no subcommand", () => {
    let s = freshState();
    const { output } = executeDockerCommand(s, "docker system", []);
    expect(output).toContain("Usage");
  });

  it("docker system df shows disk usage", () => {
    let s = freshState();
    const { output } = executeDockerCommand(s, "docker system df", []);
    expect(output).toContain("Images");
  });
});

describe("docker compose (extended)", () => {
  it("docker compose shows usage", () => {
    let s = freshState();
    const { output } = executeDockerCommand(s, "docker compose", []);
    expect(output).toContain("Usage");
  });

  it("docker compose build simulates build", () => {
    let s = freshState();
    const { output } = executeDockerCommand(s, "docker compose build", []);
    expect(output).toContain("Building");
  });

  it("docker compose ps lists services", () => {
    let s = freshState();
    const { output } = executeDockerCommand(s, "docker compose ps", []);
    expect(output).toContain("NAME");
  });
});

describe("docker login/logout", () => {
  it("docker login succeeds", () => {
    let s = freshState();
    const { output } = executeDockerCommand(s, "docker login", []);
    expect(output).toContain("Login Succeeded");
  });

  it("docker logout succeeds", () => {
    let s = freshState();
    const { output } = executeDockerCommand(s, "docker logout", []);
    expect(output).toContain("Removing login credentials");
  });
});

describe("filesystem commands", () => {
  it("ls lists directory contents", () => {
    const s = freshState();
    const result = executeFilesystemCommand(s, "ls", []);
    expect(result).not.toBeNull();
    expect(result!.output).toContain("Dockerfile");
    expect(result!.output).toContain("index.js");
  });

  it("ls errors on nonexistent directory", () => {
    const s = freshState();
    const result = executeFilesystemCommand(s, "ls", ["/nonexistent"]);
    expect(result).not.toBeNull();
    expect(result!.output).toContain("No such file or directory");
  });

  it("cd changes working directory", () => {
    let s = freshState();
    s = executeFilesystemCommand(s, "cd", ["/etc"]).newState;
    expect(s.cwd).toBe("/etc");
  });

  it("cd errors on nonexistent directory", () => {
    const s = freshState();
    const result = executeFilesystemCommand(s, "cd", ["/nonexistent"]);
    expect(result).not.toBeNull();
    expect(result!.output).toContain("no such file or directory");
  });

  it("cat reads file contents", () => {
    const s = freshState();
    const result = executeFilesystemCommand(s, "cat", ["Dockerfile"]);
    expect(result).not.toBeNull();
    expect(result!.output).toContain("FROM");
  });

  it("cat errors on nonexistent file", () => {
    const s = freshState();
    const result = executeFilesystemCommand(s, "cat", ["nonexistent.txt"]);
    expect(result).not.toBeNull();
    expect(result!.output).toContain("No such file");
  });

  it("pwd returns current directory", () => {
    const s = freshState();
    const result = executeFilesystemCommand(s, "pwd", []);
    expect(result).not.toBeNull();
    expect(result!.output).toBe("/home/user");
  });

  it("echo expands environment variables", () => {
    const s = freshState();
    const result = executeFilesystemCommand(s, "echo", ["$HOME"]);
    expect(result).not.toBeNull();
    expect(result!.output).toBe("/home/user");
  });

  it("returns null for unknown filesystem command", () => {
    const s = freshState();
    const result = executeFilesystemCommand(s, "rm", ["file.txt"]);
    expect(result).toBeNull();
  });
});

describe("state immutability", () => {
  it("does not mutate original state", () => {
    const s = freshState();
    const originalSize = s.containers.size;
    executeDockerCommand(s, "docker run", ["-d", "nginx"]);
    expect(s.containers.size).toBe(originalSize);
  });
});