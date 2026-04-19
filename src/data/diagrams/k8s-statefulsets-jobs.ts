import type { DiagramConfig } from "@/types";

export const k8sStatefulsetsJobs: DiagramConfig = {
  id: "k8s-statefulsets-jobs",
  title: "Kubernetes StatefulSets & Jobs",
  viewport: { x: 0, y: 0, zoom: 0.65 },
  nodes: [
    // --- Left side: StatefulSet ---
    {
      id: "headless-svc",
      position: { x: 120, y: 50 },
      data: {
        type: "service",
        label: "Headless Service",
        details: {
          description:
            "A Service with clusterIP: None that provides stable DNS names for each Pod in the StatefulSet.",
          ports: ["5432"],
          config: {
            clusterIP: "None",
            "DNS pattern": "pod-0.headless-svc.ns.svc.cluster.local",
          },
        },
      },
    },
    {
      id: "sts-controller",
      position: { x: 120, y: 220 },
      data: {
        type: "pipeline",
        label: "StatefulSet Controller",
        details: {
          description:
            "Manages ordered creation, scaling, and updates of stateful Pods. Ensures pod-0 is Ready before creating pod-1.",
        },
      },
    },
    {
      id: "stateful-app-0",
      position: { x: 20, y: 420 },
      data: {
        type: "pod",
        label: "stateful-app-0",
        details: {
          description: "First replica with stable identity. Always index 0.",
          image: "postgres:16",
          status: "Running",
        },
      },
    },
    {
      id: "pvc-0",
      position: { x: 20, y: 600 },
      data: {
        type: "volume",
        label: "PVC data-0",
        details: {
          description:
            "Dedicated PersistentVolumeClaim for stateful-app-0. Created from volumeClaimTemplates.",
        },
      },
    },
    {
      id: "stateful-app-1",
      position: { x: 160, y: 420 },
      data: {
        type: "pod",
        label: "stateful-app-1",
        details: {
          description: "Second replica with stable identity. Always index 1.",
          image: "postgres:16",
          status: "Running",
        },
      },
    },
    {
      id: "pvc-1",
      position: { x: 160, y: 600 },
      data: {
        type: "volume",
        label: "PVC data-1",
        details: {
          description:
            "Dedicated PersistentVolumeClaim for stateful-app-1. Created from volumeClaimTemplates.",
        },
      },
    },
    {
      id: "stateful-app-2",
      position: { x: 300, y: 420 },
      data: {
        type: "pod",
        label: "stateful-app-2",
        details: {
          description: "Third replica with stable identity. Always index 2.",
          image: "postgres:16",
          status: "Running",
        },
      },
    },
    {
      id: "pvc-2",
      position: { x: 300, y: 600 },
      data: {
        type: "volume",
        label: "PVC data-2",
        details: {
          description:
            "Dedicated PersistentVolumeClaim for stateful-app-2. Created from volumeClaimTemplates.",
        },
      },
    },

    // --- Right side: Jobs / CronJobs ---
    {
      id: "cronjob",
      position: { x: 600, y: 50 },
      data: {
        type: "config",
        label: "CronJob",
        details: {
          description:
            "Creates Job objects on a recurring schedule using cron format (e.g. '*/5 * * * *').",
          config: {
            schedule: "0 2 * * *",
            concurrencyPolicy: "Forbid",
            successfulJobsHistoryLimit: "3",
          },
        },
      },
    },
    {
      id: "job-controller",
      position: { x: 600, y: 220 },
      data: {
        type: "pipeline",
        label: "Job Controller",
        details: {
          description:
            "Ensures the specified number of Pods complete successfully. Tracks completions and retries.",
        },
      },
    },
    {
      id: "batch-job",
      position: { x: 600, y: 380 },
      data: {
        type: "container",
        label: "Job (completions: 3)",
        details: {
          description:
            "A Job that requires 3 successful completions. Parallelism controls how many Pods run at once.",
          config: {
            completions: "3",
            parallelism: "1",
            backoffLimit: "6",
          },
        },
      },
    },
    {
      id: "job-pod-1",
      position: { x: 510, y: 540 },
      data: {
        type: "pod",
        label: "job-pod-1",
        details: {
          description: "First Pod created by the Job. Runs to completion.",
          image: "batch-task:v1",
          status: "Completed",
        },
      },
    },
    {
      id: "job-pod-2",
      position: { x: 630, y: 540 },
      data: {
        type: "pod",
        label: "job-pod-2",
        details: {
          description:
            "Second Pod created by the Job. Runs after pod-1 completes (parallelism: 1).",
          image: "batch-task:v1",
          status: "Running",
        },
      },
    },
    {
      id: "job-pod-3",
      position: { x: 750, y: 540 },
      data: {
        type: "pod",
        label: "job-pod-3",
        details: {
          description: "Third Pod. Will be created once pod-2 completes.",
          image: "batch-task:v1",
          status: "Pending",
        },
      },
    },
  ],
  edges: [
    // StatefulSet edges
    {
      id: "e-svc-sts",
      source: "headless-svc",
      target: "sts-controller",
      data: { type: "dataFlow", label: "governs" },
    },
    {
      id: "e-sts-p0",
      source: "sts-controller",
      target: "stateful-app-0",
      data: { type: "dataFlow", label: "ordered create" },
    },
    {
      id: "e-sts-p1",
      source: "sts-controller",
      target: "stateful-app-1",
      data: { type: "dataFlow", label: "ordered create" },
    },
    {
      id: "e-sts-p2",
      source: "sts-controller",
      target: "stateful-app-2",
      data: { type: "dataFlow", label: "ordered create" },
    },
    {
      id: "e-p0-v0",
      source: "stateful-app-0",
      target: "pvc-0",
      data: { type: "volumeMount", label: "mount" },
    },
    {
      id: "e-p1-v1",
      source: "stateful-app-1",
      target: "pvc-1",
      data: { type: "volumeMount", label: "mount" },
    },
    {
      id: "e-p2-v2",
      source: "stateful-app-2",
      target: "pvc-2",
      data: { type: "volumeMount", label: "mount" },
    },
    // Job edges
    {
      id: "e-cj-jc",
      source: "cronjob",
      target: "job-controller",
      data: { type: "dataFlow", label: "triggers" },
    },
    {
      id: "e-jc-job",
      source: "job-controller",
      target: "batch-job",
      data: { type: "dataFlow", label: "manages" },
    },
    {
      id: "e-job-p1",
      source: "batch-job",
      target: "job-pod-1",
      data: { type: "dataFlow", label: "completions" },
    },
    {
      id: "e-job-p2",
      source: "batch-job",
      target: "job-pod-2",
      data: { type: "dataFlow", label: "completions" },
    },
    {
      id: "e-job-p3",
      source: "batch-job",
      target: "job-pod-3",
      data: { type: "dataFlow", label: "completions" },
    },
  ],
  d3Variant: "forceGraph",
};