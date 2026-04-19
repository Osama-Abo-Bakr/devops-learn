import type { DiagramConfig } from "@/types";

export const cicdBasics: DiagramConfig = {
  id: "cicd-basics",
  title: "CI/CD Basics — From Code to Production",
  viewport: { x: 0, y: 0, zoom: 0.75 },
  nodes: [
    {
      id: "node-code-commit",
      position: { x: 50, y: 200 },
      data: {
        type: "pipeline",
        label: "Code Commit",
        details: {
          description:
            "A developer pushes code changes to a shared Git repository. This event triggers the CI pipeline automatically.",
          stageIndex: 0,
        },
      },
    },
    {
      id: "node-ci-server",
      position: { x: 230, y: 200 },
      data: {
        type: "container",
        label: "CI Server",
        details: {
          description:
            "The CI server (GitHub Actions, GitLab CI, Jenkins) detects the push, checks out the code, and orchestrates the pipeline stages.",
          stageIndex: 0,
        },
      },
    },
    {
      id: "node-build",
      position: { x: 430, y: 120 },
      data: {
        type: "pipeline",
        label: "Build",
        details: {
          description:
            "Compiles source code, resolves dependencies, and produces a runnable artifact (e.g., Docker image, JAR file).",
          stageIndex: 1,
        },
      },
    },
    {
      id: "node-unit-tests",
      position: { x: 430, y: 220 },
      data: {
        type: "pipeline",
        label: "Unit Tests",
        details: {
          description:
            "Runs automated unit tests to verify individual functions and components work correctly in isolation.",
          stageIndex: 1,
        },
      },
    },
    {
      id: "node-integration-tests",
      position: { x: 430, y: 310 },
      data: {
        type: "pipeline",
        label: "Integration Tests",
        details: {
          description:
            "Tests how multiple components work together — API endpoints, database connections, and service interactions.",
          stageIndex: 1,
        },
      },
    },
    {
      id: "node-artifact-registry",
      position: { x: 640, y: 200 },
      data: {
        type: "container",
        label: "Artifact Registry",
        details: {
          description:
            "Stores immutable, versioned build artifacts (Docker images, packages). Examples: Docker Hub, AWS ECR, GitHub Container Registry.",
          stageIndex: 2,
        },
      },
    },
    {
      id: "node-cd-pipeline",
      position: { x: 850, y: 200 },
      data: {
        type: "pipeline",
        label: "CD Pipeline",
        details: {
          description:
            "The Continuous Delivery/Deployment pipeline picks up the artifact and deploys it through environments toward production.",
          stageIndex: 3,
        },
      },
    },
    {
      id: "node-staging",
      position: { x: 1050, y: 120 },
      data: {
        type: "service",
        label: "Staging",
        details: {
          description:
            "A pre-production environment that mirrors production. Used for final validation, smoke tests, and manual approval gates.",
          stageIndex: 3,
        },
      },
    },
    {
      id: "node-production",
      position: { x: 1050, y: 290 },
      data: {
        type: "service",
        label: "Production",
        details: {
          description:
            "The live environment serving real users. Continuous Deployment promotes here automatically; Continuous Delivery requires a manual approval.",
          stageIndex: 3,
        },
      },
    },
  ],
  edges: [
    {
      id: "e-commit-ci",
      source: "node-code-commit",
      target: "node-ci-server",
      data: { type: "pipeline", label: "trigger" },
    },
    {
      id: "e-ci-build",
      source: "node-ci-server",
      target: "node-build",
      data: { type: "pipeline", label: "start pipeline" },
    },
    {
      id: "e-build-unit",
      source: "node-build",
      target: "node-unit-tests",
      data: { type: "pipeline", label: "on success" },
    },
    {
      id: "e-unit-integration",
      source: "node-unit-tests",
      target: "node-integration-tests",
      data: { type: "pipeline", label: "on pass" },
    },
    {
      id: "e-integration-registry",
      source: "node-integration-tests",
      target: "node-artifact-registry",
      data: { type: "pipeline", label: "push artifact" },
    },
    {
      id: "e-registry-cd",
      source: "node-artifact-registry",
      target: "node-cd-pipeline",
      data: { type: "pipeline", label: "new version" },
    },
    {
      id: "e-cd-staging",
      source: "node-cd-pipeline",
      target: "node-staging",
      data: { type: "pipeline", label: "deploy" },
    },
    {
      id: "e-staging-production",
      source: "node-staging",
      target: "node-production",
      data: { type: "pipeline", label: "promote", animated: true },
    },
  ],
  steps: [
    {
      nodeIds: ["node-code-commit", "node-ci-server"],
      edgeIds: ["e-commit-ci"],
      label: "Code Commit",
    },
    {
      nodeIds: ["node-build", "node-unit-tests", "node-integration-tests"],
      edgeIds: ["e-ci-build", "e-build-unit", "e-unit-integration"],
      label: "Build & Test",
    },
    {
      nodeIds: ["node-artifact-registry"],
      edgeIds: ["e-integration-registry"],
      label: "Artifact Registry",
    },
    {
      nodeIds: ["node-cd-pipeline", "node-staging", "node-production"],
      edgeIds: ["e-registry-cd", "e-cd-staging", "e-staging-production"],
      label: "Deploy",
    },
  ],
  d3Variant: "pipeline",
};