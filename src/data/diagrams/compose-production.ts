import type { DiagramConfig } from "@/types";

export const composeProduction: DiagramConfig = {
  id: "compose-production",
  title: "Compose Production Configs",
  viewport: { x: 0, y: 0, zoom: 0.75 },
  nodes: [
    {
      id: "base-file",
      position: { x: 100, y: 50 },
      data: {
        type: "config",
        label: "docker-compose.yml",
        details: {
          description: "Base configuration shared across all environments",
          configType: "configmap",
          config: {
            services: "web, api, db",
            volumes: "db-data",
            networks: "app-net",
          },
        },
      },
    },
    {
      id: "override-file",
      position: { x: 350, y: 50 },
      data: {
        type: "config",
        label: "docker-compose.override.yml",
        details: {
          description: "Development overrides — bind mounts, debug ports, hot reload",
          configType: "configmap",
          config: {
            volumes: "./src:/app/src (bind mount)",
            ports: "9229:9229 (debug)",
            command: "npm run dev",
          },
        },
      },
    },
    {
      id: "prod-file",
      position: { x: 350, y: 290 },
      data: {
        type: "config",
        label: "docker-compose.prod.yml",
        details: {
          description: "Production overrides — resource limits, health checks, restart policies",
          configType: "configmap",
          config: {
            restart: "unless-stopped",
            deploy: "resources: limits: cpus: 1, memory: 512m",
            healthcheck: "curl -f http://localhost:3000/healthz",
          },
        },
      },
    },
    {
      id: "merged-config",
      position: { x: 600, y: 170 },
      data: {
        type: "container",
        label: "Merged Config",
        details: {
          description: "Result of merging base + environment-specific overrides",
          status: "Active",
          config: {
            dev: "base + override",
            prod: "base + prod",
          },
        },
      },
    },
  ],
  edges: [
    {
      id: "e-base-merged",
      source: "base-file",
      target: "merged-config",
      data: { type: "dataFlow", label: "base layer" },
    },
    {
      id: "e-override-merged",
      source: "override-file",
      target: "merged-config",
      data: { type: "dataFlow", label: "dev overrides" },
    },
    {
      id: "e-prod-merged",
      source: "prod-file",
      target: "merged-config",
      data: { type: "dataFlow", label: "prod overrides" },
    },
  ],
  steps: [
    {
      nodeIds: ["base-file"],
      edgeIds: [],
      label: "Base Compose File",
    },
    {
      nodeIds: ["override-file"],
      edgeIds: [],
      label: "Dev Override",
    },
    {
      nodeIds: ["prod-file"],
      edgeIds: [],
      label: "Prod Override",
    },
    {
      nodeIds: ["merged-config"],
      edgeIds: ["e-base-merged", "e-override-merged", "e-prod-merged"],
      label: "Merged Result",
    },
  ],
};