import type { DiagramConfig } from "@/types";

export const dockerImageLayers: DiagramConfig = {
  id: "docker-image-layers",
  title: "Docker Image Layers",
  nodes: [
    {
      id: "base",
      position: { x: 200, y: 0 },
      data: {
        type: "container",
        label: "Base Layer (alpine)",
        details: { image: "alpine:3.19", description: "Minimal base OS layer" },
      },
    },
    {
      id: "deps",
      position: { x: 200, y: 120 },
      data: {
        type: "container",
        label: "Dependencies Layer",
        details: { description: "npm install — cached if package.json unchanged" },
      },
    },
    {
      id: "app",
      position: { x: 200, y: 240 },
      data: {
        type: "container",
        label: "Application Code",
        details: { description: "COPY . . — rebuilds most often" },
      },
    },
    {
      id: "final",
      position: { x: 200, y: 360 },
      data: {
        type: "container",
        label: "Final Image",
        details: { image: "my-app:latest", description: "Read-only layers combined" },
      },
    },
  ],
  edges: [
    { id: "e-base-deps", source: "base", target: "deps", data: { type: "dataFlow" } },
    { id: "e-deps-app", source: "deps", target: "app", data: { type: "dataFlow" } },
    { id: "e-app-final", source: "app", target: "final", data: { type: "dataFlow" } },
  ],
};