import type { DiagramConfig } from "@/types";

export const k8sPodsDeployments: DiagramConfig = {
  id: "k8s-pods-deployments",
  title: "Kubernetes Pods and Deployments",
  nodes: [
    {
      id: "deployment",
      position: { x: 250, y: 0 },
      data: {
        type: "service",
        label: "Deployment",
        details: { description: "Manages replica set and rolling updates" },
      },
    },
    {
      id: "pod1",
      position: { x: 100, y: 150 },
      data: {
        type: "pod",
        label: "Pod 1",
        details: { description: "nginx container", image: "nginx:alpine", status: "Running" },
      },
    },
    {
      id: "pod2",
      position: { x: 250, y: 150 },
      data: {
        type: "pod",
        label: "Pod 2",
        details: { description: "nginx container", image: "nginx:alpine", status: "Running" },
      },
    },
    {
      id: "pod3",
      position: { x: 400, y: 150 },
      data: {
        type: "pod",
        label: "Pod 3",
        details: { description: "nginx container", image: "nginx:alpine", status: "Running" },
      },
    },
    {
      id: "service",
      position: { x: 250, y: 300 },
      data: {
        type: "service",
        label: "Service (ClusterIP)",
        details: { description: "Routes traffic to pods", ports: ["80"] },
      },
    },
  ],
  edges: [
    { id: "e-dep-p1", source: "deployment", target: "pod1", data: { type: "dataFlow", label: "manages" } },
    { id: "e-dep-p2", source: "deployment", target: "pod2", data: { type: "dataFlow", label: "manages" } },
    { id: "e-dep-p3", source: "deployment", target: "pod3", data: { type: "dataFlow", label: "manages" } },
    { id: "e-p1-svc", source: "pod1", target: "service", data: { type: "network", label: "traffic" } },
    { id: "e-p2-svc", source: "pod2", target: "service", data: { type: "network", label: "traffic" } },
    { id: "e-p3-svc", source: "pod3", target: "service", data: { type: "network", label: "traffic" } },
  ],
};