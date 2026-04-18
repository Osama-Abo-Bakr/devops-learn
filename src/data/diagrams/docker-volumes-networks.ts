import type { DiagramConfig } from "@/types";

export const dockerVolumesNetworks: DiagramConfig = {
  id: "docker-volumes-networks",
  title: "Docker Volumes and Networks",
  viewport: { x: 0, y: 0, zoom: 0.8 },
  nodes: [
    {
      id: "web-app",
      position: { x: 100, y: 100 },
      data: {
        type: "container",
        label: "web-app",
        details: {
          image: "node:20",
          status: "Running",
          ports: ["3000:3000"],
        },
      },
    },
    {
      id: "postgres",
      position: { x: 500, y: 100 },
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
      id: "app-data",
      position: { x: 500, y: 280 },
      data: {
        type: "volume",
        label: "app-data",
        details: {
          description: "Named volume for persistent database storage",
        },
      },
    },
    {
      id: "bind-mount",
      position: { x: 100, y: 280 },
      data: {
        type: "volume",
        label: "bind-mount",
        details: {
          description: "Bind mount from host ./src to container /app/src",
        },
      },
    },
    {
      id: "app-net",
      position: { x: 300, y: 0 },
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
      id: "e-web-net",
      source: "web-app",
      target: "app-net",
      data: { type: "network", label: "connected" },
    },
    {
      id: "e-db-net",
      source: "postgres",
      target: "app-net",
      data: { type: "network", label: "connected" },
    },
    {
      id: "e-db-vol",
      source: "postgres",
      target: "app-data",
      data: { type: "volumeMount", label: "mounted at /var/lib/postgresql/data" },
    },
    {
      id: "e-web-bind",
      source: "web-app",
      target: "bind-mount",
      data: { type: "volumeMount", label: "mounted at /app/src" },
    },
  ],
  steps: [
    {
      nodeIds: ["web-app"],
      edgeIds: [],
      label: "Web Application",
    },
    {
      nodeIds: ["app-net"],
      edgeIds: ["e-web-net"],
      label: "Network",
    },
    {
      nodeIds: ["postgres"],
      edgeIds: ["e-db-net"],
      label: "Database Container",
    },
    {
      nodeIds: ["app-data"],
      edgeIds: ["e-db-vol"],
      label: "Named Volume",
    },
    {
      nodeIds: ["bind-mount"],
      edgeIds: ["e-web-bind"],
      label: "Bind Mount",
    },
  ],
};