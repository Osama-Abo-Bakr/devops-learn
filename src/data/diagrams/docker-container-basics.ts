import type { DiagramConfig } from "@/types";

export const dockerContainerBasics: DiagramConfig = {
  id: "docker-container-basics",
  title: "Docker Container Basics",
  viewport: { x: 0, y: 0, zoom: 0.8 },
  nodes: [
    {
      id: "host",
      position: { x: 250, y: 0 },
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
      position: { x: 250, y: 120 },
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
      position: { x: 100, y: 280 },
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
      id: "data-volume",
      position: { x: 400, y: 280 },
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
      id: "e-nginx-volume",
      source: "nginx-container",
      target: "data-volume",
      data: { type: "volumeMount", label: "mounted at /usr/share/nginx/html" },
    },
  ],
};