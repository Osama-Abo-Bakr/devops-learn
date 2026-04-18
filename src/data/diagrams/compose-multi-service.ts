import type { DiagramConfig } from "@/types";

export const composeMultiService: DiagramConfig = {
  id: "compose-multi-service",
  title: "Docker Compose Multi-Service",
  viewport: { x: 0, y: 0, zoom: 0.75 },
  nodes: [
    {
      id: "web",
      position: { x: 300, y: 50 },
      data: {
        type: "container",
        label: "web",
        details: {
          image: "nginx:alpine",
          status: "Running",
          ports: ["8080:80"],
        },
      },
    },
    {
      id: "api",
      position: { x: 300, y: 210 },
      data: {
        type: "container",
        label: "api",
        details: {
          image: "node:20",
          status: "Running",
          ports: ["3000:3000"],
        },
      },
    },
    {
      id: "db",
      position: { x: 150, y: 370 },
      data: {
        type: "container",
        label: "postgres",
        details: {
          image: "postgres:15",
          status: "Running",
          ports: ["5432:5432"],
        },
      },
    },
    {
      id: "redis",
      position: { x: 450, y: 370 },
      data: {
        type: "container",
        label: "redis",
        details: {
          image: "redis:7",
          status: "Running",
        },
      },
    },
    {
      id: "db-data",
      position: { x: 150, y: 530 },
      data: {
        type: "volume",
        label: "db-data",
        details: {
          description: "Persistent database storage volume",
        },
      },
    },
    {
      id: "app-net",
      position: { x: 300, y: 530 },
      data: {
        type: "network",
        label: "app-net",
        details: {
          description: "Custom bridge network for service discovery",
        },
      },
    },
  ],
  edges: [
    {
      id: "e-web-api",
      source: "web",
      target: "api",
      data: { type: "dataFlow", label: "proxy_pass :3000" },
    },
    {
      id: "e-api-db",
      source: "api",
      target: "db",
      data: { type: "dataFlow", label: "5432" },
    },
    {
      id: "e-api-redis",
      source: "api",
      target: "redis",
      data: { type: "dataFlow", label: "6379" },
    },
    {
      id: "e-web-net",
      source: "web",
      target: "app-net",
      data: { type: "network", label: "connected" },
    },
    {
      id: "e-api-net",
      source: "api",
      target: "app-net",
      data: { type: "network", label: "connected" },
    },
    {
      id: "e-db-net",
      source: "db",
      target: "app-net",
      data: { type: "network", label: "connected" },
    },
    {
      id: "e-redis-net",
      source: "redis",
      target: "app-net",
      data: { type: "network", label: "connected" },
    },
    {
      id: "e-db-vol",
      source: "db",
      target: "db-data",
      data: { type: "volumeMount", label: "mounted at /var/lib/postgresql/data" },
    },
  ],
  steps: [
    {
      nodeIds: ["app-net"],
      edgeIds: [],
      label: "Shared Network",
    },
    {
      nodeIds: ["web"],
      edgeIds: ["e-web-net"],
      label: "Web Service",
    },
    {
      nodeIds: ["api"],
      edgeIds: ["e-web-api", "e-api-net"],
      label: "API Service",
    },
    {
      nodeIds: ["db", "db-data"],
      edgeIds: ["e-api-db", "e-db-net", "e-db-vol"],
      label: "DB + Volume",
    },
    {
      nodeIds: ["redis"],
      edgeIds: ["e-api-redis", "e-redis-net"],
      label: "Redis Cache",
    },
  ],
};