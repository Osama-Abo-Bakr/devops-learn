import type { DiagramConfig } from "@/types";

export const advancedCicdPipeline: DiagramConfig = {
  id: "advanced-cicd-pipeline",
  title: "Advanced CI/CD Pipeline",
  viewport: { x: -50, y: -30, zoom: 0.6 },
  d3Variant: "pipeline",
  nodes: [
    // Dev Environment
    { id: "gz-dev", position: { x: 0, y: 0 }, data: { type: "groupZone", label: "Dev Environment" } },
    { id: "git-repo", position: { x: 50, y: 60 }, data: { type: "container", label: "Git Repository", details: { description: "Source code repository (GitHub / GitLab)", image: "git", status: "active" } } },
    { id: "webhook", position: { x: 230, y: 60 }, data: { type: "pipeline", label: "Webhook Trigger", details: { description: "CI server receives push/PR event" } } },
    { id: "build-agent", position: { x: 410, y: 60 }, data: { type: "container", label: "Build Agent", details: { description: "Docker-in-Docker build runner", image: "jenkins/agent:latest", ports: ["2375"] } } },
    { id: "unit-test", position: { x: 230, y: 180 }, data: { type: "pipeline", label: "Unit Tests", details: { description: "Fast isolated tests (jest, pytest, go test)" } } },
    { id: "integ-test", position: { x: 410, y: 180 }, data: { type: "pipeline", label: "Integration Tests", details: { description: "Service-to-service contract tests" } } },
    { id: "sec-scan", position: { x: 590, y: 180 }, data: { type: "security", label: "Security Scan", details: { description: "SAST + DAST + dependency scan (Trivy, Snyk)", securityLevel: "critical" } } },
    { id: "registry", position: { x: 590, y: 60 }, data: { type: "container", label: "Container Registry", details: { description: "ECR / GCR / Docker Hub", image: "registry:2", ports: ["443"] } } },

    // Staging Environment
    { id: "gz-staging", position: { x: 0, y: 300 }, data: { type: "groupZone", label: "Staging Environment" } },
    { id: "approval", position: { x: 230, y: 360 }, data: { type: "stage", label: "Approval Gate", details: { description: "Manual sign-off before staging deployment (compliance / change management)" } } },
    { id: "staging-deploy", position: { x: 410, y: 360 }, data: { type: "pod", label: "Staging Deploy", details: { description: "Helm upgrade --install to staging namespace", image: "my-app:staging", status: "running" } } },
    { id: "staging-svc", position: { x: 590, y: 360 }, data: { type: "service", label: "staging-svc", details: { description: "ClusterIP service for smoke tests", ports: ["8080"] } } },

    // Production
    { id: "gz-prod", position: { x: 0, y: 560 }, data: { type: "groupZone", label: "Production" } },
    { id: "ingress-prod", position: { x: 50, y: 620 }, data: { type: "ingress", label: "Ingress Controller", details: { description: "NGINX Ingress with TLS termination", ports: ["443"] } } },
    { id: "canary", position: { x: 230, y: 620 }, data: { type: "pod", label: "Canary Deploy (5%)", details: { description: "Argo Rollouts canary — 5% traffic, monitor error rate", image: "my-app:canary", status: "canary" } } },
    { id: "prod-deploy", position: { x: 410, y: 620 }, data: { type: "pod", label: "Production Deploy", details: { description: "Stable production pods serving 95%+ traffic", image: "my-app:prod", status: "running" } } },
    { id: "prod-svc", position: { x: 590, y: 620 }, data: { type: "service", label: "prod-svc (LB)", details: { description: "LoadBalancer service routing to canary + stable", ports: ["80", "443"] } } },
    { id: "rollback", position: { x: 50, y: 760 }, data: { type: "pipeline", label: "Rollback Trigger", details: { description: "Automatic rollback: pull previous image tag, scale up stable, scale down canary" } } },
  ],
  edges: [
    { id: "e-git-webhook", source: "git-repo", target: "webhook", data: { type: "pipeline", label: "push event" } },
    { id: "e-webhook-build", source: "webhook", target: "build-agent", data: { type: "pipeline", label: "trigger" } },
    { id: "e-build-unit", source: "build-agent", target: "unit-test", data: { type: "pipeline", label: "parallel" } },
    { id: "e-build-integ", source: "build-agent", target: "integ-test", data: { type: "pipeline", label: "parallel" } },
    { id: "e-build-sec", source: "build-agent", target: "sec-scan", data: { type: "securityEdge", label: "scan" } },
    { id: "e-unit-registry", source: "unit-test", target: "registry", data: { type: "pipeline", label: "pass" } },
    { id: "e-integ-registry", source: "integ-test", target: "registry", data: { type: "pipeline", label: "pass" } },
    { id: "e-sec-registry", source: "sec-scan", target: "registry", data: { type: "pipeline", label: "no critical CVEs" } },
    { id: "e-registry-approval", source: "registry", target: "approval", data: { type: "pipeline", label: "validated image" } },
    { id: "e-approval-staging", source: "approval", target: "staging-deploy", data: { type: "pipeline", label: "approved" } },
    { id: "e-staging-svc", source: "staging-deploy", target: "staging-svc", data: { type: "dataFlow", label: "expose" } },
    { id: "e-approval-canary", source: "approval", target: "canary", data: { type: "pipeline", label: "canary release" } },
    { id: "e-canary-prod", source: "canary", target: "prod-deploy", data: { type: "pipeline", label: "metrics OK" } },
    { id: "e-prod-svc", source: "prod-deploy", target: "prod-svc", data: { type: "dataFlow", label: "expose" } },
    { id: "e-ingress-prod", source: "ingress-prod", target: "prod-svc", data: { type: "dataFlow", label: "route traffic" } },
    { id: "e-canary-rollback", source: "canary", target: "rollback", data: { type: "securityEdge", label: "error rate > 1%" } },
    { id: "e-rollback-prod", source: "rollback", target: "prod-deploy", data: { type: "pipeline", label: "redeploy previous tag" } },
    { id: "e-rollback-registry", source: "rollback", target: "registry", data: { type: "pipeline", label: "pull previous tag" } },
    { id: "e-staging-smoke", source: "staging-svc", target: "approval", data: { type: "dataFlow", label: "smoke test pass" } },
    { id: "e-prod-canary", source: "prod-deploy", target: "canary", data: { type: "animatedDataFlow", label: "canary monitoring" } },
    { id: "e-git-rollback", source: "git-repo", target: "rollback", data: { type: "pipeline", label: "revert commit" } },
  ],
};