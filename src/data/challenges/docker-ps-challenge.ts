import type { Challenge } from "@/types";

export const dockerPsChallenge: Challenge = {
  id: "docker-ps-challenge",
  title: "Docker Basics Challenge",
  lessonSlug: "containers-101",
  initialState: {
    containerCount: "0",
    nginxRunning: "false",
  },
  commands: {
    "docker ps": {
      output: () => {
        return `CONTAINER ID   IMAGE          STATUS       PORTS                  NAMES`;
      },
    },
    "docker pull": {
      output: (args: string[]) => {
        if (args.length === 0) return "Usage: docker pull [IMAGE]";
        return `Pulling ${args[0]}...\n${args[0]}: Pull complete\nDigest: sha256:abc123\nStatus: Downloaded newer image for ${args[0]}`;
      },
      stateChange: { imagePulled: "true" },
    },
    "docker run": {
      output: (args: string[]) => {
        const hasD = args.includes("-d");
        const hasP = args.some((a) => a.startsWith("-p"));
        const image = args.filter((a) => !a.startsWith("-"))[args.includes("-p") ? 2 : hasD ? 1 : 0] || args[args.length - 1];
        const name = image.includes("nginx") ? "nginx-server" : "container";
        if (hasD) {
          return `Container ${name} started in detached mode`;
        }
        return `Container ${name} started`;
      },
      stateChange: { containerCount: "1", nginxRunning: "true" },
      completesTasks: ["run-container"],
      validateArgs: (args: string[]) => args.includes("-d"),
    },
    "docker stop": {
      output: (args: string[]) => {
        if (args.length === 0) return "Usage: docker stop [CONTAINER]";
        return `Container ${args[0]} stopped`;
      },
      stateChange: { nginxRunning: "false" },
      completesTasks: ["stop-container"],
    },
    "docker rm": {
      output: (args: string[]) => {
        if (args.length === 0) return "Usage: docker rm [CONTAINER]";
        return `Container ${args[0]} removed`;
      },
    },
    "docker images": {
      output: () => {
        return `REPOSITORY   TAG       IMAGE ID       SIZE\nnginx        latest    abc123def456   187MB\nalpine       latest    789ghi012jkl   7.3MB`;
      },
    },
    help: {
      output: () => {
        return `Available commands:
  docker ps          - List running containers
  docker pull <img>  - Pull an image from Docker Hub
  docker run [flags] <img> - Run a container
  docker stop <id>   - Stop a container
  docker rm <id>     - Remove a container
  docker images      - List images
  help               - Show this help`;
      },
    },
  },
  tasks: [
    {
      id: "run-container",
      instruction: "Run an nginx container in detached mode with port 8080:80",
      validCommand: "docker run",
      validateArgs: (args: string[]) =>
        args.includes("-d") &&
        args.some((a) => a.includes("8080")) &&
        args.includes("nginx"),
      completed: false,
    },
    {
      id: "stop-container",
      instruction: "Stop the nginx container",
      validCommand: "docker stop",
      completed: false,
    },
  ],
};