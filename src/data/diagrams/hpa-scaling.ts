import type { DiagramConfig } from "@/types";

export const hpaScaling: DiagramConfig = {
  id: "hpa-scaling",
  title: "HPA and Scaling",
  viewport: { x: 0, y: 0, zoom: 0.75 },
  nodes: [
    {
      id: "metrics-server",
      position: { x: 100, y: 50 },
      data: {
        type: "service",
        label: "metrics-server",
        details: {
          description: "Provides CPU/memory usage metrics to the HPA controller",
          ports: ["443"],
        },
      },
    },
    {
      id: "hpa",
      position: { x: 350, y: 50 },
      data: {
        type: "pod",
        label: "HPA Controller",
        details: {
          description: "Watches metrics and scales pods up/down based on thresholds",
          config: {
            minReplicas: "2",
            maxReplicas: "10",
            targetCPU: "80%",
          },
        },
      },
    },
    {
      id: "pod-1",
      position: { x: 100, y: 210 },
      data: {
        type: "pod",
        label: "app-pod-1",
        details: {
          image: "my-app:1.0",
          status: "Running",
          description: "Current running pod (below threshold)",
        },
      },
    },
    {
      id: "pod-2",
      position: { x: 300, y: 210 },
      data: {
        type: "pod",
        label: "app-pod-2",
        details: {
          image: "my-app:1.0",
          status: "Running",
          description: "Current running pod (below threshold)",
        },
      },
    },
    {
      id: "pod-3",
      position: { x: 500, y: 210 },
      data: {
        type: "pod",
        label: "app-pod-3",
        details: {
          image: "my-app:1.0",
          status: "Pending",
          description: "New pod created by scale-up event (CPU > 80%)",
        },
      },
    },
  ],
  edges: [
    {
      id: "e-metrics-hpa",
      source: "metrics-server",
      target: "hpa",
      data: { type: "animatedDataFlow", label: "CPU/memory metrics" },
    },
    {
      id: "e-hpa-p1",
      source: "hpa",
      target: "pod-1",
      data: { type: "dataFlow", label: "manages" },
    },
    {
      id: "e-hpa-p2",
      source: "hpa",
      target: "pod-2",
      data: { type: "dataFlow", label: "manages" },
    },
    {
      id: "e-hpa-p3",
      source: "hpa",
      target: "pod-3",
      data: { type: "dataFlow", label: "scale up" },
    },
  ],
  steps: [
    {
      nodeIds: ["metrics-server"],
      edgeIds: [],
      label: "Metrics Server",
    },
    {
      nodeIds: ["hpa"],
      edgeIds: ["e-metrics-hpa"],
      label: "HPA Controller",
    },
    {
      nodeIds: ["pod-1", "pod-2"],
      edgeIds: ["e-hpa-p1", "e-hpa-p2"],
      label: "Current Pods",
    },
    {
      nodeIds: ["pod-3"],
      edgeIds: ["e-hpa-p3"],
      label: "Scale Up",
    },
  ],
};