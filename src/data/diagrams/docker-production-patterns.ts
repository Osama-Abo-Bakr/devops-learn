import type { DiagramConfig } from "@/types";

export const dockerProductionPatterns: DiagramConfig = {
  id: "docker-production-patterns",
  title: "Docker Production Patterns",
  viewport: { x: 0, y: 0, zoom: 0.7 },
  nodes: [
    {
      id: "prod-app",
      position: { x: 300, y: 150 },
      data: {
        type: "container",
        label: "Production App",
        details: {
          image: "my-app:1.0.0",
          status: "Running",
          description: "Containerized application running in production",
        },
      },
    },
    {
      id: "health-check",
      position: { x: 0, y: 0 },
      data: {
        type: "container",
        label: "Health Check",
        details: {
          description: "HEALTHCHECK instruction for liveness/readiness probes",
          config: {
            interval: "30s",
            timeout: "5s",
            retries: "3",
          },
        },
      },
    },
    {
      id: "log-rotation",
      position: { x: 300, y: 0 },
      data: {
        type: "container",
        label: "Log Rotation",
        details: {
          description: "JSON log driver with size limits and rotation",
          config: {
            "max-size": "10m",
            "max-file": "3",
          },
        },
      },
    },
    {
      id: "resource-limits",
      position: { x: 600, y: 0 },
      data: {
        type: "container",
        label: "Resource Limits",
        details: {
          description: "CPU and memory constraints to prevent runaway containers",
          config: {
            cpus: "1.0",
            memory: "512m",
          },
        },
      },
    },
    {
      id: "graceful-shutdown",
      position: { x: 300, y: 320 },
      data: {
        type: "container",
        label: "Graceful Shutdown",
        details: {
          description: "STOPSIGNAL + SIGTERM handler for clean exits",
          config: {
            stopTimeout: "30",
            stopSignal: "SIGTERM",
          },
        },
      },
    },
  ],
  edges: [
    {
      id: "e-health-app",
      source: "health-check",
      target: "prod-app",
      data: { type: "animatedDataFlow", label: "probes /healthz" },
    },
    {
      id: "e-log-app",
      source: "log-rotation",
      target: "prod-app",
      data: { type: "animatedDataFlow", label: "captures stdout" },
    },
    {
      id: "e-resource-app",
      source: "resource-limits",
      target: "prod-app",
      data: { type: "animatedDataFlow", label: "enforces limits" },
    },
    {
      id: "e-app-shutdown",
      source: "prod-app",
      target: "graceful-shutdown",
      data: { type: "animatedDataFlow", label: "SIGTERM handler" },
    },
  ],
  steps: [
    {
      nodeIds: ["prod-app"],
      edgeIds: [],
      label: "Production App",
    },
    {
      nodeIds: ["health-check"],
      edgeIds: ["e-health-app"],
      label: "Health Check",
    },
    {
      nodeIds: ["log-rotation"],
      edgeIds: ["e-log-app"],
      label: "Log Rotation",
    },
    {
      nodeIds: ["resource-limits"],
      edgeIds: ["e-resource-app"],
      label: "Resource Limits",
    },
    {
      nodeIds: ["graceful-shutdown"],
      edgeIds: ["e-app-shutdown"],
      label: "Graceful Shutdown",
    },
  ],
};