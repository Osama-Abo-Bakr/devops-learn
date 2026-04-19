import type { DiagramConfig } from "@/types";

export const dockerTroubleshooting: DiagramConfig = {
  id: "docker-troubleshooting",
  title: "Docker Troubleshooting — Diagnostic Flow",
  viewport: { x: 0, y: 0, zoom: 0.7 },
  nodes: [
    {
      id: "problem-detected",
      position: { x: 400, y: 30 },
      data: {
        type: "pipeline",
        label: "Problem Detected",
        details: {
          description:
            "Something is wrong — container won't start, crashes, or behaves unexpectedly",
        },
      },
    },
    {
      id: "build-failure",
      position: { x: 100, y: 180 },
      data: {
        type: "pipeline",
        label: "Build Failure",
        details: {
          description:
            "Docker build fails due to errors in the Dockerfile or missing dependencies",
        },
      },
    },
    {
      id: "runtime-crash",
      position: { x: 400, y: 180 },
      data: {
        type: "pipeline",
        label: "Runtime Crash",
        details: {
          description:
            "Container starts but exits immediately or crashes during execution",
        },
      },
    },
    {
      id: "network-issue",
      position: { x: 700, y: 180 },
      data: {
        type: "pipeline",
        label: "Network Issue",
        details: {
          description:
            "Container runs but can't communicate with other containers or external services",
        },
      },
    },
    {
      id: "docker-logs",
      position: { x: 100, y: 360 },
      data: {
        type: "pipeline",
        label: "docker logs",
        details: {
          description:
            "View stdout/stderr output from a container. Use -f to follow, --since for time filtering.",
          config: {
            flags: "-f, --since, --tail, --timestamps",
          },
        },
      },
    },
    {
      id: "docker-inspect",
      position: { x: 400, y: 360 },
      data: {
        type: "pipeline",
        label: "docker inspect",
        details: {
          description:
            "Get detailed configuration and state metadata. Use --format to filter specific fields.",
          config: {
            flags: "--format, -s",
          },
        },
      },
    },
    {
      id: "docker-network-inspect",
      position: { x: 700, y: 360 },
      data: {
        type: "pipeline",
        label: "docker network inspect",
        details: {
          description:
            "Inspect network configuration, connected containers, IP assignments, and DNS settings.",
          config: {
            flags: "-v, --format",
          },
        },
      },
    },
    {
      id: "fix-dockerfile",
      position: { x: 100, y: 540 },
      data: {
        type: "container",
        label: "Fix Dockerfile",
        details: {
          description:
            "Correct layer ordering, fix COPY paths, update .dockerignore, resolve dependency issues",
          status: "Resolved",
        },
      },
    },
    {
      id: "adjust-resources",
      position: { x: 400, y: 540 },
      data: {
        type: "container",
        label: "Adjust Resources",
        details: {
          description:
            "Set memory/CPU limits, fix OOMKilled, adjust health checks, fix entrypoint",
          status: "Resolved",
        },
      },
    },
    {
      id: "fix-network-config",
      position: { x: 700, y: 540 },
      data: {
        type: "container",
        label: "Fix Network Config",
        details: {
          description:
            "Fix port mappings, DNS resolution, network drivers, container connectivity",
          status: "Resolved",
        },
      },
    },
    {
      id: "container-healthy",
      position: { x: 400, y: 700 },
      data: {
        type: "pipeline",
        label: "Container Healthy",
        details: {
          description:
            "Container is running correctly, passing health checks, and reachable on the network",
        },
      },
    },
  ],
  edges: [
    {
      id: "e-problem-build",
      source: "problem-detected",
      target: "build-failure",
      data: { type: "pipeline", label: "build error" },
    },
    {
      id: "e-problem-runtime",
      source: "problem-detected",
      target: "runtime-crash",
      data: { type: "pipeline", label: "exit code" },
    },
    {
      id: "e-problem-network",
      source: "problem-detected",
      target: "network-issue",
      data: { type: "pipeline", label: "connectivity" },
    },
    {
      id: "e-build-logs",
      source: "build-failure",
      target: "docker-logs",
      data: { type: "dataFlow", label: "examine output" },
    },
    {
      id: "e-runtime-inspect",
      source: "runtime-crash",
      target: "docker-inspect",
      data: { type: "dataFlow", label: "check state" },
    },
    {
      id: "e-network-inspect",
      source: "network-issue",
      target: "docker-network-inspect",
      data: { type: "dataFlow", label: "inspect network" },
    },
    {
      id: "e-logs-fix",
      source: "docker-logs",
      target: "fix-dockerfile",
      data: { type: "pipeline", label: "resolve" },
    },
    {
      id: "e-inspect-adjust",
      source: "docker-inspect",
      target: "adjust-resources",
      data: { type: "pipeline", label: "resolve" },
    },
    {
      id: "e-netinspect-fix",
      source: "docker-network-inspect",
      target: "fix-network-config",
      data: { type: "pipeline", label: "resolve" },
    },
    {
      id: "e-fix-healthy",
      source: "fix-dockerfile",
      target: "container-healthy",
      data: { type: "pipeline", label: "verified" },
    },
    {
      id: "e-adjust-healthy",
      source: "adjust-resources",
      target: "container-healthy",
      data: { type: "pipeline", label: "verified" },
    },
    {
      id: "e-netfix-healthy",
      source: "fix-network-config",
      target: "container-healthy",
      data: { type: "pipeline", label: "verified" },
    },
  ],
  steps: [
    { nodeIds: ["problem-detected"], edgeIds: [], label: "Problem Detected" },
    { nodeIds: ["build-failure", "runtime-crash", "network-issue"], edgeIds: ["e-problem-build", "e-problem-runtime", "e-problem-network"], label: "Classify the Problem" },
    { nodeIds: ["docker-logs", "docker-inspect", "docker-network-inspect"], edgeIds: ["e-build-logs", "e-runtime-inspect", "e-network-inspect"], label: "Run Diagnostic Tools" },
    { nodeIds: ["fix-dockerfile", "adjust-resources", "fix-network-config"], edgeIds: ["e-logs-fix", "e-inspect-adjust", "e-netinspect-fix"], label: "Apply the Fix" },
    { nodeIds: ["container-healthy"], edgeIds: ["e-fix-healthy", "e-adjust-healthy", "e-netfix-healthy"], label: "Container Healthy" },
  ],
  d3Variant: "pipeline",
};