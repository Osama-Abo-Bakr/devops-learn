import type { DiagramConfig } from "@/types";

export const devopsFundamentals: DiagramConfig = {
  id: "devops-fundamentals",
  title: "DevOps Fundamentals — The CI/CD Lifecycle",
  viewport: { x: 0, y: 0, zoom: 0.7 },
  nodes: [
    {
      id: "node-plan",
      position: { x: 80, y: 60 },
      data: {
        type: "pipeline",
        label: "Plan",
        details: {
          description:
            "Define requirements, set goals, and plan the iteration. Product and engineering collaborate on what to build next.",
          stageIndex: 1,
        },
      },
    },
    {
      id: "node-code",
      position: { x: 300, y: 60 },
      data: {
        type: "pipeline",
        label: "Code",
        details: {
          description:
            "Develop features and fixes. Use version control (Git), branching strategies, and code reviews.",
          stageIndex: 2,
        },
      },
    },
    {
      id: "node-build",
      position: { x: 520, y: 60 },
      data: {
        type: "pipeline",
        label: "Build",
        details: {
          description:
            "Compile source code, resolve dependencies, and produce an artifact (container image, binary, package).",
          stageIndex: 3,
        },
      },
    },
    {
      id: "node-test",
      position: { x: 740, y: 60 },
      data: {
        type: "pipeline",
        label: "Test",
        details: {
          description:
            "Run automated unit, integration, and end-to-end tests. Fast feedback catches bugs before they reach production.",
          stageIndex: 4,
        },
      },
    },
    {
      id: "node-release",
      position: { x: 740, y: 260 },
      data: {
        type: "pipeline",
        label: "Release",
        details: {
          description:
            "Package the tested artifact, tag it with a version, and prepare it for deployment. The release is ready but not yet live.",
          stageIndex: 5,
        },
      },
    },
    {
      id: "node-deploy",
      position: { x: 520, y: 260 },
      data: {
        type: "pipeline",
        label: "Deploy",
        details: {
          description:
            "Push the release to the target environment (staging or production). Automated deployments reduce risk and increase speed.",
          stageIndex: 6,
        },
      },
    },
    {
      id: "node-operate",
      position: { x: 300, y: 260 },
      data: {
        type: "pipeline",
        label: "Operate",
        details: {
          description:
            "Run and manage the application in production. Handle scaling, configuration, incident response, and day-to-day operations.",
          stageIndex: 7,
        },
      },
    },
    {
      id: "node-monitor",
      position: { x: 80, y: 260 },
      data: {
        type: "pipeline",
        label: "Monitor",
        details: {
          description:
            "Collect metrics, logs, and traces. Observe system health, user behavior, and error rates to detect issues early.",
          stageIndex: 8,
        },
      },
    },
    {
      id: "node-feedback",
      position: { x: 80, y: 430 },
      data: {
        type: "container",
        label: "Feedback Loop",
        details: {
          description:
            "Monitoring data feeds back into planning. Incidents, performance data, and user feedback shape the next iteration, closing the DevOps loop.",
        },
      },
    },
  ],
  edges: [
    {
      id: "e-plan-code",
      source: "node-plan",
      target: "node-code",
      data: { type: "pipeline", label: "requirements" },
    },
    {
      id: "e-code-build",
      source: "node-code",
      target: "node-build",
      data: { type: "pipeline", label: "source code" },
    },
    {
      id: "e-build-test",
      source: "node-build",
      target: "node-test",
      data: { type: "pipeline", label: "artifact" },
    },
    {
      id: "e-test-release",
      source: "node-test",
      target: "node-release",
      data: { type: "pipeline", label: "validated" },
    },
    {
      id: "e-release-deploy",
      source: "node-release",
      target: "node-deploy",
      data: { type: "pipeline", label: "versioned" },
    },
    {
      id: "e-deploy-operate",
      source: "node-deploy",
      target: "node-operate",
      data: { type: "pipeline", label: "live" },
    },
    {
      id: "e-operate-monitor",
      source: "node-operate",
      target: "node-monitor",
      data: { type: "pipeline", label: "metrics & logs" },
    },
    {
      id: "e-monitor-feedback",
      source: "node-monitor",
      target: "node-feedback",
      data: { type: "animatedDataFlow", label: "data & insights" },
    },
    {
      id: "e-feedback-plan",
      source: "node-feedback",
      target: "node-plan",
      data: { type: "animatedDataFlow", label: "informs next iteration" },
    },
  ],
  steps: [
    {
      nodeIds: ["node-plan", "node-code"],
      edgeIds: ["e-plan-code"],
      label: "1. Plan & Code",
    },
    {
      nodeIds: ["node-build", "node-test"],
      edgeIds: ["e-code-build", "e-build-test"],
      label: "2. Build & Test",
    },
    {
      nodeIds: ["node-release", "node-deploy"],
      edgeIds: ["e-test-release", "e-release-deploy"],
      label: "3. Release & Deploy",
    },
    {
      nodeIds: ["node-operate", "node-monitor", "node-feedback"],
      edgeIds: ["e-deploy-operate", "e-operate-monitor", "e-monitor-feedback", "e-feedback-plan"],
      label: "4. Operate & Monitor",
    },
  ],
  d3Variant: "pipeline",
};