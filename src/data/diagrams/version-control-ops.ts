import type { DiagramConfig } from "@/types";

export const versionControlOps: DiagramConfig = {
  id: "version-control-ops",
  title: "Version Control for Ops — Git-Based Workflow",
  viewport: { x: 0, y: 0, zoom: 0.75 },
  nodes: [
    {
      id: "node-dev-local",
      position: { x: 50, y: 200 },
      data: {
        type: "container",
        label: "Dev Local",
        details: {
          description:
            "The developer's local workstation where changes are made, staged with git add, and committed with git commit.",
          stageIndex: 0,
        },
      },
    },
    {
      id: "node-feature-branch",
      position: { x: 250, y: 200 },
      data: {
        type: "pipeline",
        label: "Feature Branch",
        details: {
          description:
            "An isolated branch for a specific change. Allows parallel work without affecting the main codebase until review is complete.",
          stageIndex: 0,
        },
      },
    },
    {
      id: "node-pull-request",
      position: { x: 460, y: 200 },
      data: {
        type: "pipeline",
        label: "Pull Request",
        details: {
          description:
            "A proposed change visible to the team. Enables code review, discussion, and automated CI checks before merging.",
          stageIndex: 1,
        },
      },
    },
    {
      id: "node-ci-pipeline",
      position: { x: 670, y: 120 },
      data: {
        type: "pipeline",
        label: "CI Pipeline",
        details: {
          description:
            "Automated checks triggered by the PR: linting, unit tests, integration tests, and security scanning.",
          stageIndex: 1,
        },
      },
    },
    {
      id: "node-main-branch",
      position: { x: 670, y: 290 },
      data: {
        type: "pipeline",
        label: "Main Branch",
        details: {
          description:
            "The stable, production-ready branch. After PR approval and passing CI, changes merge here. This is the single source of truth.",
          stageIndex: 2,
        },
      },
    },
    {
      id: "node-deploy-pipeline",
      position: { x: 880, y: 200 },
      data: {
        type: "pipeline",
        label: "Deploy Pipeline",
        details: {
          description:
            "Triggered on merge to main. Builds the artifact, pushes to registry, and deploys through environments.",
          stageIndex: 3,
        },
      },
    },
    {
      id: "node-staging",
      position: { x: 1080, y: 120 },
      data: {
        type: "service",
        label: "Staging",
        details: {
          description:
            "Pre-production environment for final validation. Mirrors production configuration for realistic testing.",
          stageIndex: 3,
        },
      },
    },
    {
      id: "node-production",
      position: { x: 1080, y: 290 },
      data: {
        type: "service",
        label: "Production",
        details: {
          description:
            "The live environment. In GitOps, the desired state in Git is automatically synced to production by a reconciliation loop.",
          stageIndex: 3,
        },
      },
    },
  ],
  edges: [
    {
      id: "e-dev-branch",
      source: "node-dev-local",
      target: "node-feature-branch",
      data: { type: "pipeline", label: "git push" },
    },
    {
      id: "e-branch-pr",
      source: "node-feature-branch",
      target: "node-pull-request",
      data: { type: "pipeline", label: "open PR" },
    },
    {
      id: "e-pr-ci",
      source: "node-pull-request",
      target: "node-ci-pipeline",
      data: { type: "pipeline", label: "triggers" },
    },
    {
      id: "e-ci-main",
      source: "node-ci-pipeline",
      target: "node-main-branch",
      data: { type: "pipeline", label: "approved & merged" },
    },
    {
      id: "e-pr-main",
      source: "node-pull-request",
      target: "node-main-branch",
      data: { type: "pipeline", label: "merge on approval" },
    },
    {
      id: "e-main-deploy",
      source: "node-main-branch",
      target: "node-deploy-pipeline",
      data: { type: "pipeline", label: "triggers deploy" },
    },
    {
      id: "e-deploy-staging",
      source: "node-deploy-pipeline",
      target: "node-staging",
      data: { type: "pipeline", label: "deploy" },
    },
    {
      id: "e-staging-prod",
      source: "node-staging",
      target: "node-production",
      data: { type: "pipeline", label: "promote", animated: true },
    },
  ],
  steps: [
    {
      nodeIds: ["node-dev-local", "node-feature-branch"],
      edgeIds: ["e-dev-branch"],
      label: "Developer & Branch",
    },
    {
      nodeIds: ["node-pull-request", "node-ci-pipeline"],
      edgeIds: ["e-branch-pr", "e-pr-ci"],
      label: "Pull Request & CI",
    },
    {
      nodeIds: ["node-main-branch"],
      edgeIds: ["e-ci-main", "e-pr-main"],
      label: "Main Branch",
    },
    {
      nodeIds: ["node-deploy-pipeline", "node-staging", "node-production"],
      edgeIds: ["e-main-deploy", "e-deploy-staging", "e-staging-prod"],
      label: "Deploy Pipeline",
    },
  ],
  d3Variant: "pipeline",
};