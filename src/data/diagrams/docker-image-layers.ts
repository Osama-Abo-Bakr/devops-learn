import type { DiagramConfig } from "@/types";

export const dockerImageLayers: DiagramConfig = {
  id: "docker-image-layers",
  title: "Docker Image Layers",
  viewport: { x: 0, y: 0, zoom: 0.75 },
  nodes: [
    {
      id: "base-os",
      position: { x: 250, y: 50 },
      data: {
        type: "layer",
        label: "Base OS (alpine:3.19)",
        details: {
          description: "Minimal base OS layer — rarely changes",
          cacheStatus: "hit",
        },
      },
    },
    {
      id: "sys-libs",
      position: { x: 250, y: 210 },
      data: {
        type: "layer",
        label: "System Libraries",
        details: {
          description: "System packages and libraries — cached if deps unchanged",
          cacheStatus: "hit",
        },
      },
    },
    {
      id: "app-deps",
      position: { x: 250, y: 370 },
      data: {
        type: "layer",
        label: "App Dependencies",
        details: {
          description: "npm install — cache miss when package.json changes",
          cacheStatus: "miss",
        },
      },
    },
    {
      id: "app-code",
      position: { x: 250, y: 530 },
      data: {
        type: "layer",
        label: "App Code",
        details: {
          description: "COPY . . — rebuilds most often on every code change",
          cacheStatus: "rebuild",
        },
      },
    },
  ],
  edges: [
    {
      id: "e-base-libs",
      source: "base-os",
      target: "sys-libs",
      data: { type: "animatedDataFlow", label: "layered on" },
    },
    {
      id: "e-libs-deps",
      source: "sys-libs",
      target: "app-deps",
      data: { type: "animatedDataFlow", label: "layered on" },
    },
    {
      id: "e-deps-code",
      source: "app-deps",
      target: "app-code",
      data: { type: "animatedDataFlow", label: "layered on" },
    },
  ],
  steps: [
    {
      nodeIds: ["base-os"],
      edgeIds: [],
      label: "Base OS Layer",
    },
    {
      nodeIds: ["sys-libs"],
      edgeIds: ["e-base-libs"],
      label: "System Libraries",
    },
    {
      nodeIds: ["app-deps"],
      edgeIds: ["e-libs-deps"],
      label: "App Dependencies",
    },
    {
      nodeIds: ["app-code"],
      edgeIds: ["e-deps-code"],
      label: "Application Code",
    },
  ],
  d3Variant: "layerStack",
};