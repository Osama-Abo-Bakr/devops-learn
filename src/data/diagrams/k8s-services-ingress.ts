import type { DiagramConfig } from "@/types";

export const k8sServicesIngress: DiagramConfig = {
  id: "k8s-services-ingress",
  title: "Kubernetes Services and Ingress",
  viewport: { x: 0, y: 0, zoom: 0.75 },
  nodes: [
    {
      id: "internet",
      position: { x: 300, y: 50 },
      data: {
        type: "container",
        label: "Internet / Traffic",
        details: {
          description: "External HTTP/HTTPS traffic from users",
        },
      },
    },
    {
      id: "ingress-ctrl",
      position: { x: 300, y: 210 },
      data: {
        type: "ingress",
        label: "Ingress Controller",
        details: {
          description: "Routes traffic based on host/path rules",
          ports: ["80", "443"],
          config: {
            "web.example.com": "web-svc",
            "api.example.com": "api-svc",
          },
        },
      },
    },
    {
      id: "web-svc",
      position: { x: 150, y: 370 },
      data: {
        type: "service",
        label: "web-svc (ClusterIP)",
        details: {
          description: "Routes traffic to web pods",
          ports: ["80"],
        },
      },
    },
    {
      id: "api-svc",
      position: { x: 450, y: 370 },
      data: {
        type: "service",
        label: "api-svc (ClusterIP)",
        details: {
          description: "Routes traffic to API pods",
          ports: ["3000"],
        },
      },
    },
    {
      id: "web-pod-1",
      position: { x: 80, y: 530 },
      data: {
        type: "pod",
        label: "web-pod-1",
        details: {
          image: "nginx:alpine",
          status: "Running",
        },
      },
    },
    {
      id: "web-pod-2",
      position: { x: 220, y: 530 },
      data: {
        type: "pod",
        label: "web-pod-2",
        details: {
          image: "nginx:alpine",
          status: "Running",
        },
      },
    },
    {
      id: "api-pod-1",
      position: { x: 450, y: 530 },
      data: {
        type: "pod",
        label: "api-pod-1",
        details: {
          image: "node:20",
          status: "Running",
        },
      },
    },
  ],
  edges: [
    {
      id: "e-inet-ing",
      source: "internet",
      target: "ingress-ctrl",
      data: { type: "animatedDataFlow", label: "HTTP/HTTPS" },
    },
    {
      id: "e-ing-web",
      source: "ingress-ctrl",
      target: "web-svc",
      data: { type: "dataFlow", label: "web.example.com" },
    },
    {
      id: "e-ing-api",
      source: "ingress-ctrl",
      target: "api-svc",
      data: { type: "dataFlow", label: "api.example.com" },
    },
    {
      id: "e-web-p1",
      source: "web-svc",
      target: "web-pod-1",
      data: { type: "dataFlow", label: "load balance" },
    },
    {
      id: "e-web-p2",
      source: "web-svc",
      target: "web-pod-2",
      data: { type: "dataFlow", label: "load balance" },
    },
    {
      id: "e-api-p1",
      source: "api-svc",
      target: "api-pod-1",
      data: { type: "dataFlow", label: "load balance" },
    },
  ],
  steps: [
    {
      nodeIds: ["internet"],
      edgeIds: [],
      label: "Internet Traffic",
    },
    {
      nodeIds: ["ingress-ctrl"],
      edgeIds: ["e-inet-ing"],
      label: "Ingress Controller",
    },
    {
      nodeIds: ["web-svc", "api-svc"],
      edgeIds: ["e-ing-web", "e-ing-api"],
      label: "ClusterIP Services",
    },
    {
      nodeIds: ["web-pod-1", "web-pod-2", "api-pod-1"],
      edgeIds: ["e-web-p1", "e-web-p2", "e-api-p1"],
      label: "Backend Pods",
    },
  ],
};