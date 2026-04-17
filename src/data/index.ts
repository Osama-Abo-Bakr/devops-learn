import type { DiagramConfig, Challenge, Quiz } from "@/types";
import { dockerContainerBasics } from "./diagrams/docker-container-basics";
import { dockerImageLayers } from "./diagrams/docker-image-layers";
import { k8sPodsDeployments } from "./diagrams/k8s-pods-deployments";
import { dockerPsChallenge } from "./challenges/docker-ps-challenge";
import { dockerBasicsQuiz } from "./quizzes/docker-basics-quiz";
import { placementQuiz } from "./quizzes/placement-quiz";

const diagramMap: Record<string, DiagramConfig> = {
  "docker-container-basics": dockerContainerBasics,
  "docker-image-layers": dockerImageLayers,
  "k8s-pods-deployments": k8sPodsDeployments,
  "docker-volumes-networks": {
    id: "docker-volumes-networks",
    title: "Docker Volumes and Networks",
    nodes: [
      {
        id: "host",
        position: { x: 250, y: 0 },
        data: { type: "container", label: "Host Machine", details: { description: "Your local machine" } },
      },
      {
        id: "bridge-net",
        position: { x: 250, y: 120 },
        data: { type: "network", label: "bridge network", details: { description: "Default Docker network" } },
      },
      {
        id: "web",
        position: { x: 100, y: 260 },
        data: { type: "container", label: "web-app", details: { image: "node:20", status: "Running", ports: ["3000:3000"] } },
      },
      {
        id: "db",
        position: { x: 400, y: 260 },
        data: { type: "container", label: "postgres", details: { image: "postgres:15", status: "Running", ports: ["5432:5432"] } },
      },
      {
        id: "data-vol",
        position: { x: 400, y: 420 },
        data: { type: "volume", label: "pg-data", details: { description: "Persistent database storage" } },
      },
    ],
    edges: [
      { id: "e-host-net", source: "host", target: "bridge-net", data: { type: "dataFlow" } },
      { id: "e-net-web", source: "bridge-net", target: "web", data: { type: "network" } },
      { id: "e-net-db", source: "bridge-net", target: "db", data: { type: "network" } },
      { id: "e-db-vol", source: "db", target: "data-vol", data: { type: "volumeMount", label: "mounted at /var/lib/postgresql/data" } },
    ],
  },
  "compose-multi-service": {
    id: "compose-multi-service",
    title: "Docker Compose Multi-Service",
    nodes: [
      {
        id: "web",
        position: { x: 250, y: 0 },
        data: { type: "container", label: "web", details: { image: "nginx:alpine", status: "Running", ports: ["8080:80"] } },
      },
      {
        id: "api",
        position: { x: 250, y: 150 },
        data: { type: "container", label: "api", details: { image: "node:20", status: "Running", ports: ["3000:3000"] } },
      },
      {
        id: "db",
        position: { x: 100, y: 300 },
        data: { type: "container", label: "postgres", details: { image: "postgres:15", status: "Running" } },
      },
      {
        id: "cache",
        position: { x: 400, y: 300 },
        data: { type: "container", label: "redis", details: { image: "redis:7", status: "Running" } },
      },
      {
        id: "app-net",
        position: { x: 250, y: 450 },
        data: { type: "network", label: "app-network", details: { description: "Custom bridge network" } },
      },
    ],
    edges: [
      { id: "e-web-api", source: "web", target: "api", data: { type: "dataFlow", label: "proxy_pass" } },
      { id: "e-api-db", source: "api", target: "db", data: { type: "dataFlow", label: "5432" } },
      { id: "e-api-cache", source: "api", target: "cache", data: { type: "dataFlow", label: "6379" } },
      { id: "e-db-net", source: "db", target: "app-net", data: { type: "network" } },
      { id: "e-cache-net", source: "cache", target: "app-net", data: { type: "network" } },
    ],
  },
  "k8s-services-ingress": {
    id: "k8s-services-ingress",
    title: "Kubernetes Services and Ingress",
    nodes: [
      {
        id: "ingress",
        position: { x: 250, y: 0 },
        data: { type: "service", label: "Ingress", details: { description: "HTTP routing and SSL termination", ports: ["80", "443"] } },
      },
      {
        id: "svc",
        position: { x: 250, y: 150 },
        data: { type: "service", label: "Service (ClusterIP)", details: { description: "Routes traffic to pods", ports: ["80"] } },
      },
      {
        id: "pod1",
        position: { x: 150, y: 300 },
        data: { type: "pod", label: "Pod 1", details: { image: "nginx:alpine", status: "Running" } },
      },
      {
        id: "pod2",
        position: { x: 350, y: 300 },
        data: { type: "pod", label: "Pod 2", details: { image: "nginx:alpine", status: "Running" } },
      },
    ],
    edges: [
      { id: "e-ing-svc", source: "ingress", target: "svc", data: { type: "dataFlow", label: "HTTP/HTTPS" } },
      { id: "e-svc-p1", source: "svc", target: "pod1", data: { type: "network" } },
      { id: "e-svc-p2", source: "svc", target: "pod2", data: { type: "network" } },
    ],
  },
};

const challengeMap: Record<string, Challenge> = {
  "docker-ps-challenge": dockerPsChallenge,
};

const quizMap: Record<string, Quiz> = {
  "docker-basics-quiz": dockerBasicsQuiz,
  "placement-quiz": placementQuiz,
};

export function getDiagram(id: string): DiagramConfig | undefined {
  return diagramMap[id];
}

export function getChallenge(id: string): Challenge | undefined {
  return challengeMap[id];
}

export function getQuiz(id: string): Quiz | undefined {
  return quizMap[id];
}