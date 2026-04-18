import type { DiagramConfig } from "@/types";

export const composeEnvScaling: DiagramConfig = {
  id: "compose-env-scaling",
  title: "Compose Env Vars and Scaling",
  viewport: { x: 0, y: 0, zoom: 0.75 },
  nodes: [
    {
      id: "env-file",
      position: { x: 0, y: 100 },
      data: {
        type: "config",
        label: ".env file",
        details: {
          description: "Environment variables injected into Compose services",
          configType: "configmap",
          config: {
            APP_PORT: "3000",
            DB_HOST: "postgres",
            REPLICA_COUNT: "3",
          },
        },
      },
    },
    {
      id: "web-app",
      position: { x: 300, y: 100 },
      data: {
        type: "container",
        label: "web-app",
        details: {
          image: "node:20",
          status: "Running",
          description: "Primary web application instance",
          env: { APP_PORT: "3000" },
        },
      },
    },
    {
      id: "replica-1",
      position: { x: 300, y: 280 },
      data: {
        type: "container",
        label: "web-replica-1",
        details: {
          image: "node:20",
          status: "Running",
          description: "Scaled replica 1",
        },
      },
    },
    {
      id: "replica-2",
      position: { x: 500, y: 280 },
      data: {
        type: "container",
        label: "web-replica-2",
        details: {
          image: "node:20",
          status: "Running",
          description: "Scaled replica 2",
        },
      },
    },
    {
      id: "replica-3",
      position: { x: 700, y: 280 },
      data: {
        type: "container",
        label: "web-replica-3",
        details: {
          image: "node:20",
          status: "Running",
          description: "Scaled replica 3",
        },
      },
    },
  ],
  edges: [
    {
      id: "e-env-app",
      source: "env-file",
      target: "web-app",
      data: { type: "animatedDataFlow", label: "variable substitution" },
    },
    {
      id: "e-env-r1",
      source: "env-file",
      target: "replica-1",
      data: { type: "animatedDataFlow", label: "variable substitution" },
    },
    {
      id: "e-app-r1",
      source: "web-app",
      target: "replica-1",
      data: { type: "dataFlow", label: "scale up" },
    },
    {
      id: "e-app-r2",
      source: "web-app",
      target: "replica-2",
      data: { type: "dataFlow", label: "scale up" },
    },
    {
      id: "e-app-r3",
      source: "web-app",
      target: "replica-3",
      data: { type: "dataFlow", label: "scale up" },
    },
  ],
  steps: [
    {
      nodeIds: ["web-app"],
      edgeIds: [],
      label: "Web Application",
    },
    {
      nodeIds: ["env-file"],
      edgeIds: ["e-env-app"],
      label: "Environment Variables",
    },
    {
      nodeIds: ["replica-1", "replica-2", "replica-3"],
      edgeIds: ["e-env-r1", "e-app-r1", "e-app-r2", "e-app-r3"],
      label: "Scale Replicas",
    },
  ],
};