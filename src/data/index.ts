import type { DiagramConfig, Challenge, Quiz } from "@/types";
import { dockerContainerBasics } from "./diagrams/docker-container-basics";
import { dockerImageLayers } from "./diagrams/docker-image-layers";
import { dockerVolumesNetworks } from "./diagrams/docker-volumes-networks";
import { dockerMultiStageBuild } from "./diagrams/docker-multi-stage-build";
import { dockerSecurity } from "./diagrams/docker-security";
import { dockerProductionPatterns } from "./diagrams/docker-production-patterns";
import { composeMultiService } from "./diagrams/compose-multi-service";
import { composeNetworksVolumes } from "./diagrams/compose-networks-volumes";
import { k8sPodsDeployments } from "./diagrams/k8s-pods-deployments";
import { k8sServicesIngress } from "./diagrams/k8s-services-ingress";
import { k8sConfigmapsSecrets } from "./diagrams/k8s-configmaps-secrets";
import { devopsCicdPipeline } from "./diagrams/devops-cicd-pipeline";
import { yamlBasics } from "./diagrams/yaml-basics";
import { composeEnvScaling } from "./diagrams/compose-env-scaling";
import { composeProduction } from "./diagrams/compose-production";
import { hpaScaling } from "./diagrams/hpa-scaling";
import { rbacNetworkPolicies } from "./diagrams/rbac-network-policies";
import { helmCharts } from "./diagrams/helm-charts";
import { monitoringObservability } from "./diagrams/monitoring-observability";
import { securityBestPractices } from "./diagrams/security-best-practices";
import { dockerPsChallenge } from "./challenges/docker-ps-challenge";
import { dockerBasicsQuiz } from "./quizzes/docker-basics-quiz";
import { placementQuiz } from "./quizzes/placement-quiz";

const diagramMap: Record<string, DiagramConfig> = {
  "docker-container-basics": dockerContainerBasics,
  "docker-image-layers": dockerImageLayers,
  "docker-volumes-networks": dockerVolumesNetworks,
  "docker-multi-stage-build": dockerMultiStageBuild,
  "docker-security": dockerSecurity,
  "docker-production-patterns": dockerProductionPatterns,
  "compose-multi-service": composeMultiService,
  "compose-networks-volumes": composeNetworksVolumes,
  "k8s-pods-deployments": k8sPodsDeployments,
  "k8s-services-ingress": k8sServicesIngress,
  "k8s-configmaps-secrets": k8sConfigmapsSecrets,
  "devops-cicd-pipeline": devopsCicdPipeline,
  "yaml-basics": yamlBasics,
  "compose-env-scaling": composeEnvScaling,
  "compose-production": composeProduction,
  "hpa-scaling": hpaScaling,
  "rbac-network-policies": rbacNetworkPolicies,
  "helm-charts": helmCharts,
  "monitoring-observability": monitoringObservability,
  "security-best-practices": securityBestPractices,
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