import type { DiagramConfig } from "@/types";

export const dockerSecurity: DiagramConfig = {
  id: "docker-security",
  title: "Docker Security — Defense in Depth",
  viewport: { x: 0, y: 0, zoom: 0.75 },
  nodes: [
    {
      id: "l1-kernel",
      position: { x: 150, y: 50 },
      data: {
        type: "security",
        label: "L1: Kernel",
        details: {
          description: "seccomp profiles, AppArmor policies, capability dropping",
          securityLevel: "kernel",
        },
      },
    },
    {
      id: "l2-network",
      position: { x: 150, y: 210 },
      data: {
        type: "security",
        label: "L2: Network",
        details: {
          description: "Network isolation, iptables rules, bridge restrictions",
          securityLevel: "network",
        },
      },
    },
    {
      id: "l3-image",
      position: { x: 150, y: 370 },
      data: {
        type: "security",
        label: "L3: Image",
        details: {
          description: "Image scanning, signing, trusted registries, minimal base",
          securityLevel: "image",
        },
      },
    },
    {
      id: "l4-runtime",
      position: { x: 150, y: 530 },
      data: {
        type: "security",
        label: "L4: Runtime",
        details: {
          description: "Non-root user, read-only filesystem, resource limits",
          securityLevel: "runtime",
        },
      },
    },
    {
      id: "app",
      position: { x: 450, y: 290 },
      data: {
        type: "container",
        label: "Your App",
        details: {
          description: "The running container protected by layered defenses",
          status: "Running",
        },
      },
    },
  ],
  edges: [
    {
      id: "e-l1-app",
      source: "l1-kernel",
      target: "app",
      data: { type: "securityEdge", label: "kernel containment" },
    },
    {
      id: "e-l2-app",
      source: "l2-network",
      target: "app",
      data: { type: "securityEdge", label: "network isolation" },
    },
    {
      id: "e-l3-app",
      source: "l3-image",
      target: "app",
      data: { type: "securityEdge", label: "image verification" },
    },
    {
      id: "e-l4-app",
      source: "l4-runtime",
      target: "app",
      data: { type: "securityEdge", label: "runtime constraints" },
    },
  ],
  steps: [
    {
      nodeIds: ["l1-kernel"],
      edgeIds: [],
      label: "L1: Kernel Security",
    },
    {
      nodeIds: ["l2-network"],
      edgeIds: [],
      label: "L2: Network Security",
    },
    {
      nodeIds: ["l3-image"],
      edgeIds: [],
      label: "L3: Image Security",
    },
    {
      nodeIds: ["l4-runtime"],
      edgeIds: [],
      label: "L4: Runtime Security",
    },
    {
      nodeIds: ["app"],
      edgeIds: ["e-l1-app", "e-l2-app", "e-l3-app", "e-l4-app"],
      label: "Your App — Protected",
    },
  ],
};