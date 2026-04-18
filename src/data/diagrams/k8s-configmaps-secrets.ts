import type { DiagramConfig } from "@/types";

export const k8sConfigmapsSecrets: DiagramConfig = {
  id: "k8s-configmaps-secrets",
  title: "Kubernetes ConfigMaps and Secrets",
  viewport: { x: 0, y: 0, zoom: 0.75 },
  nodes: [
    {
      id: "app-pod",
      position: { x: 300, y: 210 },
      data: {
        type: "pod",
        label: "app-pod",
        details: {
          image: "my-app:1.0",
          status: "Running",
          description: "Application pod receiving configuration",
        },
      },
    },
    {
      id: "app-config",
      position: { x: 100, y: 50 },
      data: {
        type: "config",
        label: "app-config",
        details: {
          description: "ConfigMap with application settings",
          configType: "configmap",
          config: {
            LOG_LEVEL: "info",
            APP_PORT: "3000",
            DB_HOST: "postgres.internal",
          },
        },
      },
    },
    {
      id: "db-creds",
      position: { x: 500, y: 50 },
      data: {
        type: "config",
        label: "db-creds",
        details: {
          description: "Secret with sensitive database credentials",
          configType: "secret",
          config: {
            DB_USER: "admin",
            DB_PASSWORD: "*****",
            DB_SSL_CERT: "*****",
          },
        },
      },
    },
    {
      id: "config-volume",
      position: { x: 100, y: 370 },
      data: {
        type: "volume",
        label: "config-volume",
        details: {
          description: "Mounted as files at /etc/config/",
          mountType: "volume",
        },
      },
    },
  ],
  edges: [
    {
      id: "e-config-pod-env",
      source: "app-config",
      target: "app-pod",
      data: { type: "dataFlow", label: "env vars", protocol: "as environment variables" },
    },
    {
      id: "e-secret-pod-file",
      source: "db-creds",
      target: "app-pod",
      data: { type: "dataFlow", label: "file mount", protocol: "as mounted files" },
    },
    {
      id: "e-config-vol",
      source: "app-config",
      target: "config-volume",
      data: { type: "volumeMount", label: "projects to volume" },
    },
    {
      id: "e-vol-pod",
      source: "config-volume",
      target: "app-pod",
      data: { type: "volumeMount", label: "mounted at /etc/config/" },
    },
  ],
  steps: [
    {
      nodeIds: ["app-pod"],
      edgeIds: [],
      label: "Application Pod",
    },
    {
      nodeIds: ["app-config"],
      edgeIds: ["e-config-pod-env"],
      label: "ConfigMap",
    },
    {
      nodeIds: ["db-creds"],
      edgeIds: ["e-secret-pod-file"],
      label: "Secret",
    },
    {
      nodeIds: ["config-volume"],
      edgeIds: ["e-config-vol", "e-vol-pod"],
      label: "Mount Paths",
    },
  ],
};