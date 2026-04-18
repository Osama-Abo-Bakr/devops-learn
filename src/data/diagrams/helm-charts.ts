import type { DiagramConfig } from "@/types";

export const helmCharts: DiagramConfig = {
  id: "helm-charts",
  title: "Helm Charts",
  viewport: { x: 0, y: 0, zoom: 0.75 },
  nodes: [
    {
      id: "helm-chart",
      position: { x: 250, y: 0 },
      data: {
        type: "container",
        label: "Helm Chart",
        details: {
          description: "A packaged Helm chart containing templates and defaults",
        },
      },
    },
    {
      id: "chart-yaml",
      position: { x: 0, y: 160 },
      data: {
        type: "config",
        label: "Chart.yaml",
        details: {
          description: "Chart metadata: name, version, appVersion, dependencies",
          configType: "configmap",
          config: {
            name: "my-app",
            version: "1.0.0",
            appVersion: "2.3.1",
          },
        },
      },
    },
    {
      id: "values-yaml",
      position: { x: 250, y: 160 },
      data: {
        type: "config",
        label: "values.yaml",
        details: {
          description: "Default configuration values used by templates",
          configType: "configmap",
          config: {
            replicaCount: "3",
            image: "my-app:2.3.1",
            service: "type: ClusterIP, port: 80",
          },
        },
      },
    },
    {
      id: "templates",
      position: { x: 500, y: 160 },
      data: {
        type: "config",
        label: "templates/",
        details: {
          description: "Go templates that generate Kubernetes manifests",
          configType: "configmap",
          config: {
            deployment: "deployment.yaml",
            service: "service.yaml",
            ingress: "ingress.yaml",
          },
        },
      },
    },
    {
      id: "release",
      position: { x: 250, y: 340 },
      data: {
        type: "container",
        label: "Release",
        details: {
          description: "A running instance of the chart in a cluster",
          status: "Deployed",
          config: {
            namespace: "production",
            revision: "1",
          },
        },
      },
    },
  ],
  edges: [
    {
      id: "e-chart-meta",
      source: "helm-chart",
      target: "chart-yaml",
      data: { type: "dataFlow", label: "metadata" },
    },
    {
      id: "e-chart-values",
      source: "helm-chart",
      target: "values-yaml",
      data: { type: "dataFlow", label: "defaults" },
    },
    {
      id: "e-chart-templates",
      source: "helm-chart",
      target: "templates",
      data: { type: "dataFlow", label: "manifests" },
    },
    {
      id: "e-templates-release",
      source: "templates",
      target: "release",
      data: { type: "animatedDataFlow", label: "helm install" },
    },
    {
      id: "e-values-release",
      source: "values-yaml",
      target: "release",
      data: { type: "dataFlow", label: "rendered values" },
    },
  ],
  steps: [
    {
      nodeIds: ["helm-chart"],
      edgeIds: [],
      label: "Helm Chart",
    },
    {
      nodeIds: ["templates", "values-yaml"],
      edgeIds: ["e-chart-templates", "e-chart-values"],
      label: "Templates + Values",
    },
    {
      nodeIds: ["chart-yaml"],
      edgeIds: ["e-chart-meta"],
      label: "Chart Metadata",
    },
    {
      nodeIds: ["release"],
      edgeIds: ["e-templates-release", "e-values-release"],
      label: "Release",
    },
  ],
};