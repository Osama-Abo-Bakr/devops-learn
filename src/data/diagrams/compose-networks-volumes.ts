import type { DiagramConfig } from "@/types";

export const composeNetworksVolumes: DiagramConfig = {
  id: "compose-networks-volumes",
  title: "Compose Networks and Volumes",
  viewport: { x: 0, y: 0, zoom: 0.65 },
  nodes: [
    {
      id: "frontend-net",
      position: { x: 0, y: 0 },
      data: {
        type: "groupZone",
        label: "frontend-net",
        details: {
          description: "Frontend network zone — public-facing services",
        },
      },
    },
    {
      id: "backend-net",
      position: { x: 0, y: 280 },
      data: {
        type: "groupZone",
        label: "backend-net",
        details: {
          description: "Backend network zone — internal services only",
        },
      },
    },
    {
      id: "web",
      position: { x: 200, y: 60 },
      data: {
        type: "container",
        label: "web",
        details: {
          image: "nginx:alpine",
          status: "Running",
          ports: ["8080:80"],
          description: "Sits in both frontend and backend networks",
        },
      },
    },
    {
      id: "api",
      position: { x: 100, y: 340 },
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
      position: { x: 350, y: 340 },
      data: {
        type: "container",
        label: "postgres",
        details: {
          image: "postgres:15",
          status: "Running",
        },
      },
    },
    {
      id: "redis",
      position: { x: 550, y: 340 },
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
      position: { x: 350, y: 490 },
      data: {
        type: "volume",
        label: "db-data",
        details: {
          description: "Persistent database storage",
        },
      },
    },
  ],
  edges: [
    {
      id: "e-web-frontend",
      source: "web",
      target: "frontend-net",
      data: { type: "network", label: "frontend zone" },
    },
    {
      id: "e-web-backend",
      source: "web",
      target: "backend-net",
      data: { type: "network", label: "backend zone" },
    },
    {
      id: "e-api-backend",
      source: "api",
      target: "backend-net",
      data: { type: "network", label: "backend only" },
    },
    {
      id: "e-db-backend",
      source: "db",
      target: "backend-net",
      data: { type: "network", label: "backend only" },
    },
    {
      id: "e-redis-backend",
      source: "redis",
      target: "backend-net",
      data: { type: "network", label: "backend only" },
    },
    {
      id: "e-web-api",
      source: "web",
      target: "api",
      data: { type: "dataFlow", label: "proxy_pass" },
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
      id: "e-db-vol",
      source: "db",
      target: "db-data",
      data: { type: "volumeMount", label: "mounted at /var/lib/postgresql/data" },
    },
  ],
  steps: [
    {
      nodeIds: ["frontend-net"],
      edgeIds: [],
      label: "Frontend Zone",
    },
    {
      nodeIds: ["web"],
      edgeIds: ["e-web-frontend"],
      label: "Web (spans both zones)",
    },
    {
      nodeIds: ["backend-net"],
      edgeIds: ["e-web-backend"],
      label: "Backend Zone",
    },
    {
      nodeIds: ["api", "db"],
      edgeIds: ["e-api-backend", "e-db-backend", "e-web-api", "e-api-db"],
      label: "API + Database",
    },
    {
      nodeIds: ["redis", "db-data"],
      edgeIds: ["e-redis-backend", "e-api-redis", "e-db-vol"],
      label: "Redis + Volume",
    },
  ],
  d3Variant: "forceGraph",
};