import type { DiagramConfig } from "@/types";

export const yamlBasics: DiagramConfig = {
  id: "yaml-basics",
  title: "Compose YAML Basics",
  viewport: { x: 0, y: 0, zoom: 0.75 },
  nodes: [
    {
      id: "compose-file",
      position: { x: 300, y: 50 },
      data: {
        type: "container",
        label: "docker-compose.yml",
        details: {
          description: "Root Compose file defining the entire stack",
        },
      },
    },
    {
      id: "services",
      position: { x: 100, y: 210 },
      data: {
        type: "container",
        label: "services:",
        details: {
          description: "Defines containers to run (web, api, db, etc.)",
          config: {
            required: "yes",
            example: "web: image: nginx:alpine",
          },
        },
      },
    },
    {
      id: "volumes",
      position: { x: 300, y: 210 },
      data: {
        type: "container",
        label: "volumes:",
        details: {
          description: "Named volumes for persistent data",
          config: {
            required: "no",
            example: "db-data: driver: local",
          },
        },
      },
    },
    {
      id: "networks",
      position: { x: 500, y: 210 },
      data: {
        type: "container",
        label: "networks:",
        details: {
          description: "Custom networks for service isolation",
          config: {
            required: "no",
            example: "app-net: driver: bridge",
          },
        },
      },
    },
    {
      id: "configs",
      position: { x: 300, y: 370 },
      data: {
        type: "config",
        label: "configs: / secrets:",
        details: {
          description: "Configuration files and sensitive data injection",
          configType: "configmap",
          config: {
            required: "no",
            example: "nginx-config: file: ./nginx.conf",
          },
        },
      },
    },
  ],
  edges: [
    {
      id: "e-file-services",
      source: "compose-file",
      target: "services",
      data: { type: "dataFlow", label: "defines" },
    },
    {
      id: "e-file-volumes",
      source: "compose-file",
      target: "volumes",
      data: { type: "dataFlow", label: "defines" },
    },
    {
      id: "e-file-networks",
      source: "compose-file",
      target: "networks",
      data: { type: "dataFlow", label: "defines" },
    },
    {
      id: "e-file-configs",
      source: "compose-file",
      target: "configs",
      data: { type: "dataFlow", label: "defines" },
    },
  ],
  steps: [
    {
      nodeIds: ["compose-file"],
      edgeIds: [],
      label: "Compose File",
    },
    {
      nodeIds: ["services"],
      edgeIds: ["e-file-services"],
      label: "Services Section",
    },
    {
      nodeIds: ["volumes"],
      edgeIds: ["e-file-volumes"],
      label: "Volumes Section",
    },
    {
      nodeIds: ["networks"],
      edgeIds: ["e-file-networks"],
      label: "Networks Section",
    },
    {
      nodeIds: ["configs"],
      edgeIds: ["e-file-configs"],
      label: "Configs and Secrets",
    },
  ],
};