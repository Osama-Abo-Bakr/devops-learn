import type { DiagramConfig } from "@/types";

export const cicdAtScaleNetflixMeta: DiagramConfig = {
  id: "cicd-at-scale-netflix-meta",
  title: "CI/CD at Scale: Netflix & Meta",
  viewport: { x: -20, y: -20, zoom: 0.5 },
  d3Variant: "forceGraph",
  nodes: [
    // Netflix cluster
    { id: "gz-netflix", position: { x: 0, y: 0 }, data: { type: "groupZone", label: "Netflix (Spinnaker)" } },
    { id: "nfx-git", position: { x: 50, y: 60 }, data: { type: "container", label: "Netflix Git Monorepo", details: { description: "Hundreds of microservices in a monorepo", image: "git", status: "active" } } },
    { id: "nfx-build", position: { x: 50, y: 180 }, data: { type: "container", label: "Build Farm (100s agents)", details: { description: "Jenkins / Nebula build cluster — parallel artifact builds", image: "jenkins:latest", ports: ["8080"] } } },
    { id: "nfx-bake", position: { x: 230, y: 180 }, data: { type: "pipeline", label: "Bake Stage (AMI/Docker)", details: { description: "Spinnaker bakes immutable AMIs or Docker images" } } },
    { id: "nfx-spinnaker", position: { x: 230, y: 60 }, data: { type: "pipeline", label: "Spinnaker Orchestration", details: { description: "Manages deployment pipelines across all regions" } } },
    { id: "nfx-chaos", position: { x: 50, y: 320 }, data: { type: "security", label: "Chaos Monkey", details: { description: "Randomly terminates instances in prod to validate resilience", securityLevel: "high" } } },
    { id: "nfx-canary", position: { x: 230, y: 320 }, data: { type: "pod", label: "Canary Analysis (Kayenta)", details: { description: "Automated canary metric comparison — promotes or rolls back", image: "kayenta:latest", status: "canary" } } },
    { id: "nfx-prod-k8s", position: { x: 120, y: 440 }, data: { type: "container", label: "Prod K8s (1000s pods)", details: { description: "Multi-region Kubernetes clusters serving 250M+ subscribers", image: "nginx:latest", status: "running" } } },
    { id: "nfx-monitoring", position: { x: 50, y: 440 }, data: { type: "service", label: "Atlas Monitoring", details: { description: "Netflix's in-house time-series monitoring and alerting system", ports: ["9090"] } } },

    // Meta cluster
    { id: "gz-meta", position: { x: 650, y: 0 }, data: { type: "groupZone", label: "Meta (Continuous Deploy)" } },
    { id: "meta-git", position: { x: 700, y: 60 }, data: { type: "container", label: "Meta Monorepo", details: { description: "Massive monorepo — Facebook, Instagram, WhatsApp codebase", image: "git", status: "active" } } },
    { id: "meta-ci", position: { x: 700, y: 180 }, data: { type: "pipeline", label: "Buck2 Build System", details: { description: "Rust-based incremental build — 100x faster than Buck v1" } } },
    { id: "meta-feature-flag", position: { x: 880, y: 180 }, data: { type: "config", label: "Feature Flag Service", details: { description: "Gatekeeper — decouples deploy from release", configType: "configmap", config: { strategy: "gradual", monitoring: "real-time" } } } },
    { id: "meta-ab", position: { x: 880, y: 60 }, data: { type: "pipeline", label: "A/B Testing Gate", details: { description: "Statistical significance checks before wider rollout" } } },
    { id: "meta-deploy", position: { x: 700, y: 320 }, data: { type: "pod", label: "Gradual Rollout (FB Trench)", details: { description: "Binary push to 100k+ servers — region by region", image: "my-app:latest", status: "rolling out" } } },
    { id: "meta-prod", position: { x: 770, y: 440 }, data: { type: "container", label: "Prod Fleet (100k+ servers)", details: { description: "Bare-metal + VM fleet across global data centers", status: "running" } } },
    { id: "meta-monitoring", position: { x: 880, y: 440 }, data: { type: "service", label: "ODS Monitoring", details: { description: "On-Device Stats — real-time error reporting from billions of clients", ports: ["443"] } } },

    // Shared Principles
    { id: "gz-principles", position: { x: 300, y: 540 }, data: { type: "groupZone", label: "Shared Principles" } },
    { id: "shared-immutable", position: { x: 320, y: 600 }, data: { type: "config", label: "Immutable Artifacts", details: { description: "Build once, deploy everywhere — same artifact across all environments", configType: "configmap" } } },
    { id: "shared-observability", position: { x: 500, y: 600 }, data: { type: "container", label: "Full Observability", details: { description: "Metrics + logs + traces — see everything in production" } } },
    { id: "shared-rollback", position: { x: 410, y: 720 }, data: { type: "pipeline", label: "Instant Rollback", details: { description: "Automated rollback in seconds when error rate spikes" } } },
    { id: "shared-automation", position: { x: 410, y: 560 }, data: { type: "pipeline", label: "Zero-Touch Deploy", details: { description: "No human approval needed — fully automated pipeline" } } },
  ],
  edges: [
    // Netflix edges
    { id: "e-nfx-git-build", source: "nfx-git", target: "nfx-build", data: { type: "pipeline", label: "push triggers" } },
    { id: "e-nfx-build-bake", source: "nfx-build", target: "nfx-bake", data: { type: "pipeline", label: "build artifacts" } },
    { id: "e-nfx-bake-spin", source: "nfx-bake", target: "nfx-spinnaker", data: { type: "pipeline", label: "pipeline config" } },
    { id: "e-nfx-git-spin", source: "nfx-git", target: "nfx-spinnaker", data: { type: "pipeline", label: "pipeline definition" } },
    { id: "e-nfx-spin-canary", source: "nfx-spinnaker", target: "nfx-canary", data: { type: "pipeline", label: "canary stage" } },
    { id: "e-nfx-canary-chaos", source: "nfx-canary", target: "nfx-chaos", data: { type: "securityEdge", label: "fault injection" } },
    { id: "e-nfx-canary-prod", source: "nfx-canary", target: "nfx-prod-k8s", data: { type: "pipeline", label: "promote" } },
    { id: "e-nfx-prod-monitor", source: "nfx-prod-k8s", target: "nfx-monitoring", data: { type: "dataFlow", label: "metrics" } },
    // Meta edges
    { id: "e-meta-git-ci", source: "meta-git", target: "meta-ci", data: { type: "pipeline", label: "push triggers" } },
    { id: "e-meta-ci-flag", source: "meta-ci", target: "meta-feature-flag", data: { type: "pipeline", label: "build artifacts" } },
    { id: "e-meta-flag-ab", source: "meta-feature-flag", target: "meta-ab", data: { type: "pipeline", label: "gate evaluation" } },
    { id: "e-meta-ab-deploy", source: "meta-ab", target: "meta-deploy", data: { type: "pipeline", label: "gradual rollout" } },
    { id: "e-meta-deploy-prod", source: "meta-deploy", target: "meta-prod", data: { type: "pipeline", label: "expand fleet" } },
    { id: "e-meta-prod-monitor", source: "meta-prod", target: "meta-monitoring", data: { type: "dataFlow", label: "metrics" } },
    // Shared principles edges
    { id: "e-nfx-prod-shared-imm", source: "nfx-prod-k8s", target: "shared-immutable", data: { type: "copyFrom", label: "same pattern" } },
    { id: "e-meta-prod-shared-imm", source: "meta-prod", target: "shared-immutable", data: { type: "copyFrom", label: "same pattern" } },
    { id: "e-nfx-mon-shared-obs", source: "nfx-monitoring", target: "shared-observability", data: { type: "dataFlow", label: "observe" } },
    { id: "e-meta-mon-shared-obs", source: "meta-monitoring", target: "shared-observability", data: { type: "dataFlow", label: "observe" } },
    { id: "e-shared-rollback-nfx", source: "shared-rollback", target: "nfx-canary", data: { type: "pipeline", label: "rollback" } },
    { id: "e-shared-rollback-meta", source: "shared-rollback", target: "meta-deploy", data: { type: "pipeline", label: "rollback" } },
  ],
};