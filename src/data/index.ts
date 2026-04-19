import type { DiagramConfig, Challenge, Quiz } from "@/types";
import { dockerContainerBasics } from "./diagrams/docker-container-basics";
import { dockerImageLayers } from "./diagrams/docker-image-layers";
import { dockerVolumesNetworks } from "./diagrams/docker-volumes-networks";
import { dockerMultiStageBuild } from "./diagrams/docker-multi-stage-build";
import { dockerSecurity } from "./diagrams/docker-security";
import { dockerProductionPatterns } from "./diagrams/docker-production-patterns";
import { dockerTroubleshooting } from "./diagrams/docker-troubleshooting";
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
import { advancedCicdPipeline } from "./diagrams/advanced-cicd-pipeline";
import { cicdAtScaleNetflixMeta } from "./diagrams/cicd-at-scale-netflix-meta";
import { containerOrchestrationScale } from "./diagrams/container-orchestration-scale";
import { k8sStatefulsetsJobs } from "./diagrams/k8s-statefulsets-jobs";
import { dockerPsChallenge } from "./challenges/docker-ps-challenge";
import { dockerBasicsQuiz } from "./quizzes/docker-basics-quiz";
import { placementQuiz } from "./quizzes/placement-quiz";
import { dockerfileQuiz } from "./quizzes/dockerfile-quiz";
import { volumesNetworksQuiz } from "./quizzes/volumes-networks-quiz";
import { multiStageQuiz } from "./quizzes/multi-stage-quiz";
import { dockerSecurityQuiz } from "./quizzes/docker-security-quiz";
import { productionPatternsQuiz } from "./quizzes/production-patterns-quiz";
import { dockerTroubleshootingQuiz } from "./quizzes/docker-troubleshooting-quiz";
import { yamlBasicsQuiz } from "./quizzes/yaml-basics-quiz";
import { multiServiceQuiz } from "./quizzes/multi-service-quiz";
import { composeNetworksVolumesQuiz } from "./quizzes/compose-networks-volumes-quiz";
import { composeEnvScalingQuiz } from "./quizzes/compose-env-scaling-quiz";
import { composeProductionQuiz } from "./quizzes/compose-production-quiz";
import { k8sPodsDeploymentsQuiz } from "./quizzes/k8s-pods-deployments-quiz";
import { k8sServicesIngressQuiz } from "./quizzes/k8s-services-ingress-quiz";
import { k8sConfigmapsSecretsQuiz } from "./quizzes/k8s-configmaps-secrets-quiz";
import { hpaScalingQuiz } from "./quizzes/hpa-scaling-quiz";
import { rbacNetworkPoliciesQuiz } from "./quizzes/rbac-network-policies-quiz";
import { cicdQuiz } from "./quizzes/cicd-quiz";
import { helmQuiz } from "./quizzes/helm-quiz";
import { monitoringQuiz } from "./quizzes/monitoring-quiz";
import { securityBestPracticesQuiz } from "./quizzes/security-best-practices-quiz";
import { advancedCicdQuiz } from "./quizzes/advanced-cicd-quiz";
import { cicdAtScaleQuiz } from "./quizzes/cicd-at-scale-quiz";
import { containerOrchestrationScaleQuiz } from "./quizzes/container-orchestration-scale-quiz";
import { k8sStatefulsetsJobsQuiz } from "./quizzes/k8s-statefulsets-jobs-quiz";
import { gitopsArgocd } from "./diagrams/gitops-argocd";
import { infrastructureAsCode } from "./diagrams/infrastructure-as-code";
import { gitopsArgocdQuiz } from "./quizzes/gitops-argocd-quiz";
import { infrastructureAsCodeQuiz } from "./quizzes/infrastructure-as-code-quiz";

const diagramMap: Record<string, DiagramConfig> = {
  "docker-container-basics": dockerContainerBasics,
  "docker-image-layers": dockerImageLayers,
  "docker-volumes-networks": dockerVolumesNetworks,
  "docker-multi-stage-build": dockerMultiStageBuild,
  "docker-security": dockerSecurity,
  "docker-production-patterns": dockerProductionPatterns,
  "docker-troubleshooting": dockerTroubleshooting,
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
  "advanced-cicd-pipeline": advancedCicdPipeline,
  "cicd-at-scale-netflix-meta": cicdAtScaleNetflixMeta,
  "container-orchestration-scale": containerOrchestrationScale,
  "k8s-statefulsets-jobs": k8sStatefulsetsJobs,
  "gitops-argocd": gitopsArgocd,
  "infrastructure-as-code": infrastructureAsCode,
};

const challengeMap: Record<string, Challenge> = {
  "docker-ps-challenge": dockerPsChallenge,
};

const quizMap: Record<string, Quiz> = {
  "docker-basics-quiz": dockerBasicsQuiz,
  "placement-quiz": placementQuiz,
  "dockerfile-quiz": dockerfileQuiz,
  "volumes-networks-quiz": volumesNetworksQuiz,
  "multi-stage-quiz": multiStageQuiz,
  "docker-security-quiz": dockerSecurityQuiz,
  "production-patterns-quiz": productionPatternsQuiz,
  "docker-troubleshooting-quiz": dockerTroubleshootingQuiz,
  "yaml-basics-quiz": yamlBasicsQuiz,
  "multi-service-quiz": multiServiceQuiz,
  "compose-networks-volumes-quiz": composeNetworksVolumesQuiz,
  "compose-env-scaling-quiz": composeEnvScalingQuiz,
  "compose-production-quiz": composeProductionQuiz,
  "k8s-pods-deployments-quiz": k8sPodsDeploymentsQuiz,
  "k8s-services-ingress-quiz": k8sServicesIngressQuiz,
  "k8s-configmaps-secrets-quiz": k8sConfigmapsSecretsQuiz,
  "hpa-scaling-quiz": hpaScalingQuiz,
  "rbac-network-policies-quiz": rbacNetworkPoliciesQuiz,
  "cicd-quiz": cicdQuiz,
  "helm-quiz": helmQuiz,
  "monitoring-quiz": monitoringQuiz,
  "security-best-practices-quiz": securityBestPracticesQuiz,
  "advanced-cicd-quiz": advancedCicdQuiz,
  "cicd-at-scale-quiz": cicdAtScaleQuiz,
  "container-orchestration-scale-quiz": containerOrchestrationScaleQuiz,
  "k8s-statefulsets-jobs-quiz": k8sStatefulsetsJobsQuiz,
  "gitops-argocd-quiz": gitopsArgocdQuiz,
  "infrastructure-as-code-quiz": infrastructureAsCodeQuiz,
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