import type { DiagramConfig } from "@/types";

export const gitopsArgocd: DiagramConfig = {
  id: "gitops-argocd",
  title: "GitOps with ArgoCD — Declarative Delivery",
  viewport: { x: 0, y: 0, zoom: 0.65 },
  nodes: [
    // Left: Source of Truth
    {
      id: "git-repo",
      position: { x: 50, y: 80 },
      data: {
        type: "container",
        label: "Git Repository",
        details: {
          description: "Single source of truth — all K8s manifests, Helm charts, and Kustomize overlays live here",
          status: "active",
        },
      },
    },
    {
      id: "ci-pipeline",
      position: { x: 50, y: 230 },
      data: {
        type: "pipeline",
        label: "CI Pipeline",
        details: {
          description: "Builds images, runs tests, pushes tags to Git — does NOT deploy directly",
        },
      },
    },
    {
      id: "container-registry",
      position: { x: 50, y: 380 },
      data: {
        type: "container",
        label: "Container Registry",
        details: {
          description: "ECR / GCR / Docker Hub — stores versioned container images",
          image: "registry:2",
          ports: ["443"],
        },
      },
    },

    // Center: ArgoCD Components
    {
      id: "argocd-api",
      position: { x: 350, y: 60 },
      data: {
        type: "service",
        label: "ArgoCD API Server",
        details: {
          description: "Serves the UI and CLI — handles user requests, auth, and app management",
          ports: ["8080"],
        },
      },
    },
    {
      id: "argocd-repo-server",
      position: { x: 350, y: 210 },
      data: {
        type: "service",
        label: "Repo Server",
        details: {
          description: "Clones Git repos, caches manifests, renders Helm/Kustomize templates",
        },
      },
    },
    {
      id: "argocd-controller",
      position: { x: 350, y: 370 },
      data: {
        type: "service",
        label: "Application Controller",
        details: {
          description: "Reconciliation loop — compares Git desired state vs cluster live state, triggers syncs",
        },
      },
    },

    // Right: K8s Clusters
    {
      id: "k8s-dev",
      position: { x: 670, y: 100 },
      data: {
        type: "service",
        label: "Dev Cluster",
        details: {
          description: "Development environment — auto-sync enabled, fast iteration",
          status: "Synced",
        },
      },
    },
    {
      id: "k8s-staging",
      position: { x: 670, y: 260 },
      data: {
        type: "service",
        label: "Staging Cluster",
        details: {
          description: "Pre-production — auto-sync with manual approval for prod promotion",
          status: "Synced",
        },
      },
    },
    {
      id: "k8s-prod",
      position: { x: 670, y: 420 },
      data: {
        type: "service",
        label: "Prod Cluster",
        details: {
          description: "Production — sync policy with self-heal and prune for reliability",
          status: "Synced",
        },
      },
    },

    // Bottom: Patterns and Loops
    {
      id: "app-of-apps",
      position: { x: 200, y: 550 },
      data: {
        type: "config",
        label: "App-of-Apps Pattern",
        details: {
          description: "One parent Application that creates and manages child Applications — enables bulk management",
          configType: "configmap",
          config: {
            parent: "apps/*.yaml",
            children: "api, web, worker",
          },
        },
      },
    },
    {
      id: "sync-loop",
      position: { x: 500, y: 550 },
      data: {
        type: "pipeline",
        label: "Sync Loop",
        details: {
          description: "Continuous reconciliation: detect drift → compare states → sync if OutOfSync",
        },
      },
    },
    {
      id: "drift-detection",
      position: { x: 350, y: 680 },
      data: {
        type: "security",
        label: "Drift Detection",
        details: {
          description: "Detects manual changes or external modifications that diverge from Git state",
          securityLevel: "warning",
        },
      },
    },
    {
      id: "auto-reconcile",
      position: { x: 620, y: 680 },
      data: {
        type: "pipeline",
        label: "Auto-Reconcile",
        details: {
          description: "Self-heal: automatically corrects drift by re-applying Git state to cluster",
        },
      },
    },
  ],
  edges: [
    // Left flow: Git → CI → Registry
    {
      id: "e-git-ci",
      source: "git-repo",
      target: "ci-pipeline",
      data: { type: "pipeline", label: "push trigger" },
    },
    {
      id: "e-ci-registry",
      source: "ci-pipeline",
      target: "container-registry",
      data: { type: "pipeline", label: "push image" },
    },
    // Git → ArgoCD components
    {
      id: "e-git-repo-server",
      source: "git-repo",
      target: "argocd-repo-server",
      data: { type: "dataFlow", label: "clone manifests" },
    },
    {
      id: "e-repo-server-controller",
      source: "argocd-repo-server",
      target: "argocd-controller",
      data: { type: "dataFlow", label: "rendered manifests" },
    },
    {
      id: "e-api-controller",
      source: "argocd-api",
      target: "argocd-controller",
      data: { type: "dataFlow", label: "sync commands" },
    },
    {
      id: "e-api-repo-server",
      source: "argocd-api",
      target: "argocd-repo-server",
      data: { type: "dataFlow", label: "refresh" },
    },
    // ArgoCD → K8s clusters
    {
      id: "e-controller-dev",
      source: "argocd-controller",
      target: "k8s-dev",
      data: { type: "animatedDataFlow", label: "sync" },
    },
    {
      id: "e-controller-staging",
      source: "argocd-controller",
      target: "k8s-staging",
      data: { type: "animatedDataFlow", label: "sync" },
    },
    {
      id: "e-controller-prod",
      source: "argocd-controller",
      target: "k8s-prod",
      data: { type: "animatedDataFlow", label: "sync" },
    },
    // Clusters → Controller (state feedback)
    {
      id: "e-dev-controller",
      source: "k8s-dev",
      target: "argocd-controller",
      data: { type: "dataFlow", label: "live state" },
    },
    {
      id: "e-staging-controller",
      source: "k8s-staging",
      target: "argocd-controller",
      data: { type: "dataFlow", label: "live state" },
    },
    {
      id: "e-prod-controller",
      source: "k8s-prod",
      target: "argocd-controller",
      data: { type: "dataFlow", label: "live state" },
    },
    // Bottom: patterns and loops
    {
      id: "e-app-of-apps-controller",
      source: "app-of-apps",
      target: "argocd-controller",
      data: { type: "dataFlow", label: "child apps" },
    },
    {
      id: "e-controller-sync-loop",
      source: "argocd-controller",
      target: "sync-loop",
      data: { type: "animatedDataFlow", label: "reconcile" },
    },
    {
      id: "e-sync-loop-drift",
      source: "sync-loop",
      target: "drift-detection",
      data: { type: "dataFlow", label: "compare states" },
    },
    {
      id: "e-drift-reconcile",
      source: "drift-detection",
      target: "auto-reconcile",
      data: { type: "pipeline", label: "drift found" },
    },
    {
      id: "e-reconcile-controller",
      source: "auto-reconcile",
      target: "argocd-controller",
      data: { type: "animatedDataFlow", label: "re-sync" },
    },
  ],
  d3Variant: "pipeline",
};