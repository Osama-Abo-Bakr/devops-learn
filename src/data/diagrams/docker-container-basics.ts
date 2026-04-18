import type { DiagramConfig } from "@/types";

export const dockerContainerBasics: DiagramConfig = {
  id: "docker-container-basics",
  title: "Docker Container Basics",
  viewport: { x: 0, y: 0, zoom: 0.8 },
  nodes: [
    {
      id: "host",
      position: { x: 300, y: 0 },
      data: {
        type: "container",
        label: "Host Machine",
        details: {
          description: "Your local machine running Docker",
        },
      },
    },
    {
      id: "docker-engine",
      position: { x: 300, y: 140 },
      data: {
        type: "network",
        label: "Docker Engine",
        details: {
          description: "Manages containers, images, and networks",
        },
      },
    },
    {
      id: "nginx-container",
      position: { x: 100, y: 300 },
      data: {
        type: "container",
        label: "nginx",
        details: {
          image: "nginx:latest",
          status: "Running",
          ports: ["8080:80"],
          env: { NGINX_PORT: "80" },
        },
      },
    },
    {
      id: "alpine-container",
      position: { x: 400, y: 300 },
      data: {
        type: "container",
        label: "alpine",
        details: {
          image: "alpine:3.19",
          status: "Running",
        },
      },
    },
    {
      id: "bridge-net",
      position: { x: 250, y: 460 },
      data: {
        type: "network",
        label: "bridge-net",
        details: {
          description: "Default bridge network connecting containers",
        },
      },
    },
    {
      id: "data-vol",
      position: { x: 100, y: 460 },
      data: {
        type: "volume",
        label: "html-data",
        details: {
          description: "Persistent storage for web content",
        },
      },
    },
  ],
  edges: [
    {
      id: "e-host-engine",
      source: "host",
      target: "docker-engine",
      data: { type: "dataFlow" },
    },
    {
      id: "e-engine-nginx",
      source: "docker-engine",
      target: "nginx-container",
      data: { type: "dataFlow", label: "manages" },
    },
    {
      id: "e-engine-alpine",
      source: "docker-engine",
      target: "alpine-container",
      data: { type: "dataFlow", label: "manages" },
    },
    {
      id: "e-nginx-net",
      source: "nginx-container",
      target: "bridge-net",
      data: { type: "network", label: "connected" },
    },
    {
      id: "e-alpine-net",
      source: "alpine-container",
      target: "bridge-net",
      data: { type: "network", label: "connected" },
    },
    {
      id: "e-nginx-volume",
      source: "nginx-container",
      target: "data-vol",
      data: { type: "volumeMount", label: "mounted at /usr/share/nginx/html" },
    },
  ],
  steps: [
    {
      nodeIds: ["host"],
      edgeIds: [],
      label: "Host Machine",
    },
    {
      nodeIds: ["docker-engine"],
      edgeIds: ["e-host-engine"],
      label: "Docker Engine",
    },
    {
      nodeIds: ["nginx-container", "alpine-container"],
      edgeIds: ["e-engine-nginx", "e-engine-alpine"],
      label: "Containers",
    },
    {
      nodeIds: ["bridge-net"],
      edgeIds: ["e-nginx-net", "e-alpine-net"],
      label: "Network",
    },
    {
      nodeIds: ["data-vol"],
      edgeIds: ["e-nginx-volume"],
      label: "Volumes",
    },
  ],
};