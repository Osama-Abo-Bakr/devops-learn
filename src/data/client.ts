import type { DiagramConfig, Challenge, Quiz } from "@/types";

// Client-safe dynamic imports — each data file becomes its own chunk
// loaded only when needed, instead of bundling all data upfront.

const diagramLoaders: Record<string, () => Promise<Record<string, unknown>>> = {
  "docker-container-basics": () => import("./diagrams/docker-container-basics"),
  "docker-image-layers": () => import("./diagrams/docker-image-layers"),
  "docker-volumes-networks": () => import("./diagrams/docker-volumes-networks"),
  "docker-multi-stage-build": () => import("./diagrams/docker-multi-stage-build"),
  "docker-security": () => import("./diagrams/docker-security"),
  "docker-production-patterns": () => import("./diagrams/docker-production-patterns"),
  "docker-troubleshooting": () => import("./diagrams/docker-troubleshooting"),
  "compose-multi-service": () => import("./diagrams/compose-multi-service"),
  "compose-networks-volumes": () => import("./diagrams/compose-networks-volumes"),
  "k8s-pods-deployments": () => import("./diagrams/k8s-pods-deployments"),
  "k8s-services-ingress": () => import("./diagrams/k8s-services-ingress"),
  "k8s-configmaps-secrets": () => import("./diagrams/k8s-configmaps-secrets"),
  "devops-fundamentals": () => import("./diagrams/devops-fundamentals"),
  "devops-cicd-pipeline": () => import("./diagrams/devops-cicd-pipeline"),
  "yaml-basics": () => import("./diagrams/yaml-basics"),
  "compose-env-scaling": () => import("./diagrams/compose-env-scaling"),
  "compose-production": () => import("./diagrams/compose-production"),
  "hpa-scaling": () => import("./diagrams/hpa-scaling"),
  "rbac-network-policies": () => import("./diagrams/rbac-network-policies"),
  "helm-charts": () => import("./diagrams/helm-charts"),
  "monitoring-observability": () => import("./diagrams/monitoring-observability"),
  "security-best-practices": () => import("./diagrams/security-best-practices"),
  "advanced-cicd-pipeline": () => import("./diagrams/advanced-cicd-pipeline"),
  "cicd-at-scale-netflix-meta": () => import("./diagrams/cicd-at-scale-netflix-meta"),
  "container-orchestration-scale": () => import("./diagrams/container-orchestration-scale"),
  "k8s-statefulsets-jobs": () => import("./diagrams/k8s-statefulsets-jobs"),
  "gitops-argocd": () => import("./diagrams/gitops-argocd"),
  "infrastructure-as-code": () => import("./diagrams/infrastructure-as-code"),
  "cicd-basics": () => import("./diagrams/cicd-basics"),
  "version-control-ops": () => import("./diagrams/version-control-ops"),
};

const challengeLoaders: Record<string, () => Promise<Record<string, unknown>>> = {
  "docker-ps-challenge": () => import("./challenges/docker-ps-challenge"),
};

const quizLoaders: Record<string, () => Promise<Record<string, unknown>>> = {
  "docker-basics-quiz": () => import("./quizzes/docker-basics-quiz"),
  "placement-quiz": () => import("./quizzes/placement-quiz"),
  "dockerfile-quiz": () => import("./quizzes/dockerfile-quiz"),
  "volumes-networks-quiz": () => import("./quizzes/volumes-networks-quiz"),
  "multi-stage-quiz": () => import("./quizzes/multi-stage-quiz"),
  "docker-security-quiz": () => import("./quizzes/docker-security-quiz"),
  "production-patterns-quiz": () => import("./quizzes/production-patterns-quiz"),
  "docker-troubleshooting-quiz": () => import("./quizzes/docker-troubleshooting-quiz"),
  "yaml-basics-quiz": () => import("./quizzes/yaml-basics-quiz"),
  "multi-service-quiz": () => import("./quizzes/multi-service-quiz"),
  "compose-networks-volumes-quiz": () => import("./quizzes/compose-networks-volumes-quiz"),
  "compose-env-scaling-quiz": () => import("./quizzes/compose-env-scaling-quiz"),
  "compose-production-quiz": () => import("./quizzes/compose-production-quiz"),
  "k8s-pods-deployments-quiz": () => import("./quizzes/k8s-pods-deployments-quiz"),
  "k8s-services-ingress-quiz": () => import("./quizzes/k8s-services-ingress-quiz"),
  "k8s-configmaps-secrets-quiz": () => import("./quizzes/k8s-configmaps-secrets-quiz"),
  "hpa-scaling-quiz": () => import("./quizzes/hpa-scaling-quiz"),
  "rbac-network-policies-quiz": () => import("./quizzes/rbac-network-policies-quiz"),
  "devops-fundamentals-quiz": () => import("./quizzes/devops-fundamentals-quiz"),
  "cicd-quiz": () => import("./quizzes/cicd-quiz"),
  "helm-quiz": () => import("./quizzes/helm-quiz"),
  "monitoring-quiz": () => import("./quizzes/monitoring-quiz"),
  "security-best-practices-quiz": () => import("./quizzes/security-best-practices-quiz"),
  "advanced-cicd-quiz": () => import("./quizzes/advanced-cicd-quiz"),
  "cicd-at-scale-quiz": () => import("./quizzes/cicd-at-scale-quiz"),
  "container-orchestration-scale-quiz": () => import("./quizzes/container-orchestration-scale-quiz"),
  "k8s-statefulsets-jobs-quiz": () => import("./quizzes/k8s-statefulsets-jobs-quiz"),
  "gitops-argocd-quiz": () => import("./quizzes/gitops-argocd-quiz"),
  "infrastructure-as-code-quiz": () => import("./quizzes/infrastructure-as-code-quiz"),
  "cicd-basics-quiz": () => import("./quizzes/cicd-basics-quiz"),
  "version-control-ops-quiz": () => import("./quizzes/version-control-ops-quiz"),
};

export async function getDiagram(id: string): Promise<DiagramConfig | undefined> {
  const loader = diagramLoaders[id];
  if (!loader) return undefined;
  const mod = await loader();
  // Each diagram module exports a single named export matching its key
  const values = Object.values(mod);
  return values[0] as DiagramConfig;
}

export async function getChallenge(id: string): Promise<Challenge | undefined> {
  const loader = challengeLoaders[id];
  if (!loader) return undefined;
  const mod = await loader();
  const values = Object.values(mod);
  return values[0] as Challenge;
}

export async function getQuiz(id: string): Promise<Quiz | undefined> {
  const loader = quizLoaders[id];
  if (!loader) return undefined;
  const mod = await loader();
  const values = Object.values(mod);
  return values[0] as Quiz;
}