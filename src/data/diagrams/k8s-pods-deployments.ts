import type { DiagramConfig } from "@/types";

export const k8sPodsDeployments: DiagramConfig = {
  id: "k8s-pods-deployments",
  title: "Kubernetes Pods and Deployments",
  viewport: { x: 0, y: 0, zoom: 0.8 },
  nodes: [
    {
      id: "deployment",
      position: { x: 250, y: 0 },
      data: {
        type: "pod",
        label: "Deployment",
        details: {
          description: "Manages ReplicaSet and rolling updates",
        },
      },
    },
    {
      id: "replicaset",
      position: { x: 250, y: 150 },
      data: {
        type: "pod",
        label: "ReplicaSet",
        details: {
          description: "Ensures 3 replicas of nginx are running",
          config: { replicas: "3" },
        },
      },
    },
    {
      id: "pod-1",
      position: { x: 50, y: 320 },
      data: {
        type: "pod",
        label: "nginx-pod-1",
        details: {
          image: "nginx:alpine",
          status: "Running",
          description: "Pod replica 1 of 3",
        },
      },
    },
    {
      id: "pod-2",
      position: { x: 250, y: 320 },
      data: {
        type: "pod",
        label: "nginx-pod-2",
        details: {
          image: "nginx:alpine",
          status: "Running",
          description: "Pod replica 2 of 3",
        },
      },
    },
    {
      id: "pod-3",
      position: { x: 450, y: 320 },
      data: {
        type: "pod",
        label: "nginx-pod-3",
        details: {
          image: "nginx:alpine",
          status: "Running",
          description: "Pod replica 3 of 3",
        },
      },
    },
  ],
  edges: [
    {
      id: "e-dep-rs",
      source: "deployment",
      target: "replicaset",
      data: { type: "animatedDataFlow", label: "manages" },
    },
    {
      id: "e-rs-p1",
      source: "replicaset",
      target: "pod-1",
      data: { type: "animatedDataFlow", label: "owns" },
    },
    {
      id: "e-rs-p2",
      source: "replicaset",
      target: "pod-2",
      data: { type: "animatedDataFlow", label: "owns" },
    },
    {
      id: "e-rs-p3",
      source: "replicaset",
      target: "pod-3",
      data: { type: "animatedDataFlow", label: "owns" },
    },
  ],
  steps: [
    {
      nodeIds: ["deployment"],
      edgeIds: [],
      label: "Deployment",
    },
    {
      nodeIds: ["replicaset"],
      edgeIds: ["e-dep-rs"],
      label: "ReplicaSet",
    },
    {
      nodeIds: ["pod-1"],
      edgeIds: ["e-rs-p1"],
      label: "Pod 1",
    },
    {
      nodeIds: ["pod-2"],
      edgeIds: ["e-rs-p2"],
      label: "Pod 2",
    },
    {
      nodeIds: ["pod-3"],
      edgeIds: ["e-rs-p3"],
      label: "Pod 3",
    },
  ],
  d3Variant: "tree",
};