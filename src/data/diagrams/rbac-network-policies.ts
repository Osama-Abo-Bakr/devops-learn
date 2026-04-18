import type { DiagramConfig } from "@/types";

export const rbacNetworkPolicies: DiagramConfig = {
  id: "rbac-network-policies",
  title: "RBAC and Network Policies",
  viewport: { x: 0, y: 0, zoom: 0.7 },
  nodes: [
    {
      id: "user",
      position: { x: 250, y: 0 },
      data: {
        type: "container",
        label: "User / SA",
        details: {
          description: "User or ServiceAccount requesting API access",
        },
      },
    },
    {
      id: "role",
      position: { x: 50, y: 150 },
      data: {
        type: "pod",
        label: "Role",
        details: {
          description: "Defines permissions within a namespace (verbs + resources)",
          config: {
            verbs: "get, list, watch",
            resources: "pods, deployments",
          },
        },
      },
    },
    {
      id: "rolebinding",
      position: { x: 450, y: 150 },
      data: {
        type: "pod",
        label: "RoleBinding",
        details: {
          description: "Binds a Role to a User/ServiceAccount",
          config: {
            subjects: "user:developer",
            roleRef: "Role: pod-reader",
          },
        },
      },
    },
    {
      id: "netpol",
      position: { x: 250, y: 300 },
      data: {
        type: "pod",
        label: "NetworkPolicy",
        details: {
          description: "Restricts pod-to-pod network traffic by labels",
          config: {
            ingress: "from: frontend only",
            egress: "to: db on port 5432",
          },
        },
      },
    },
    {
      id: "frontend-pod",
      position: { x: 50, y: 450 },
      data: {
        type: "container",
        label: "frontend-pod",
        details: {
          image: "nginx:alpine",
          status: "Running",
          description: "Allowed to talk to backend by NetworkPolicy",
        },
      },
    },
    {
      id: "backend-pod",
      position: { x: 450, y: 450 },
      data: {
        type: "container",
        label: "backend-pod",
        details: {
          image: "node:20",
          status: "Running",
          description: "Accepts traffic only from frontend pods",
        },
      },
    },
  ],
  edges: [
    {
      id: "e-user-role",
      source: "user",
      target: "role",
      data: { type: "securityEdge", label: "checks permissions" },
    },
    {
      id: "e-role-binding",
      source: "role",
      target: "rolebinding",
      data: { type: "dataFlow", label: "referenced by" },
    },
    {
      id: "e-binding-user",
      source: "rolebinding",
      target: "user",
      data: { type: "dataFlow", label: "binds to" },
    },
    {
      id: "e-netpol-fe",
      source: "netpol",
      target: "frontend-pod",
      data: { type: "securityEdge", label: "allows egress" },
    },
    {
      id: "e-netpol-be",
      source: "netpol",
      target: "backend-pod",
      data: { type: "securityEdge", label: "allows ingress" },
    },
    {
      id: "e-fe-be",
      source: "frontend-pod",
      target: "backend-pod",
      data: { type: "dataFlow", label: "permitted traffic" },
    },
  ],
  steps: [
    {
      nodeIds: ["user"],
      edgeIds: [],
      label: "User / ServiceAccount",
    },
    {
      nodeIds: ["role", "rolebinding"],
      edgeIds: ["e-user-role", "e-role-binding", "e-binding-user"],
      label: "Role + RoleBinding",
    },
    {
      nodeIds: ["frontend-pod", "backend-pod"],
      edgeIds: ["e-fe-be"],
      label: "Pods",
    },
    {
      nodeIds: ["netpol"],
      edgeIds: ["e-netpol-fe", "e-netpol-be"],
      label: "NetworkPolicy",
    },
  ],
};