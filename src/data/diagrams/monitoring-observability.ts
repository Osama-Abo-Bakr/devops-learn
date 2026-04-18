import type { DiagramConfig } from "@/types";

export const monitoringObservability: DiagramConfig = {
  id: "monitoring-observability",
  title: "Monitoring and Observability",
  viewport: { x: 0, y: 0, zoom: 0.65 },
  nodes: [
    {
      id: "app",
      position: { x: 0, y: 100 },
      data: {
        type: "container",
        label: "Your App",
        details: {
          description: "Instrumented application exposing /metrics endpoint",
          status: "Running",
          ports: ["3000"],
        },
      },
    },
    {
      id: "prometheus",
      position: { x: 250, y: 100 },
      data: {
        type: "container",
        label: "Prometheus",
        details: {
          description: "Scrapes and stores time-series metrics from targets",
          image: "prom/prometheus:latest",
          ports: ["9090"],
        },
      },
    },
    {
      id: "grafana",
      position: { x: 250, y: 0 },
      data: {
        type: "container",
        label: "Grafana",
        details: {
          description: "Dashboards and visualization of Prometheus metrics",
          image: "grafana/grafana:latest",
          ports: ["3000"],
        },
      },
    },
    {
      id: "alertmanager",
      position: { x: 500, y: 0 },
      data: {
        type: "container",
        label: "Alertmanager",
        details: {
          description: "Routes alerts from Prometheus to Slack/PagerDuty/email",
          image: "prom/alertmanager:latest",
          ports: ["9093"],
        },
      },
    },
    {
      id: "loki",
      position: { x: 500, y: 200 },
      data: {
        type: "container",
        label: "Loki",
        details: {
          description: "Log aggregation system — collect and query container logs",
          image: "grafana/loki:latest",
          ports: ["3100"],
        },
      },
    },
    {
      id: "jaeger",
      position: { x: 250, y: 300 },
      data: {
        type: "container",
        label: "Jaeger",
        details: {
          description: "Distributed tracing — track requests across microservices",
          image: "jaegertracing/all-in-one:latest",
          ports: ["16686"],
        },
      },
    },
  ],
  edges: [
    {
      id: "e-app-prom",
      source: "app",
      target: "prometheus",
      data: { type: "animatedDataFlow", label: "scrape /metrics" },
    },
    {
      id: "e-prom-grafana",
      source: "prometheus",
      target: "grafana",
      data: { type: "dataFlow", label: "query metrics" },
    },
    {
      id: "e-prom-alert",
      source: "prometheus",
      target: "alertmanager",
      data: { type: "dataFlow", label: "fire alerts" },
    },
    {
      id: "e-app-loki",
      source: "app",
      target: "loki",
      data: { type: "dataFlow", label: "push logs" },
    },
    {
      id: "e-loki-grafana",
      source: "loki",
      target: "grafana",
      data: { type: "dataFlow", label: "query logs" },
    },
    {
      id: "e-app-jaeger",
      source: "app",
      target: "jaeger",
      data: { type: "dataFlow", label: "push traces" },
    },
    {
      id: "e-jaeger-grafana",
      source: "jaeger",
      target: "grafana",
      data: { type: "dataFlow", label: "query traces" },
    },
  ],
  steps: [
    {
      nodeIds: ["app"],
      edgeIds: [],
      label: "Your Application",
    },
    {
      nodeIds: ["prometheus"],
      edgeIds: ["e-app-prom"],
      label: "Prometheus",
    },
    {
      nodeIds: ["grafana", "alertmanager"],
      edgeIds: ["e-prom-grafana", "e-prom-alert"],
      label: "Grafana + Alertmanager",
    },
    {
      nodeIds: ["loki", "jaeger"],
      edgeIds: ["e-app-loki", "e-loki-grafana", "e-app-jaeger", "e-jaeger-grafana"],
      label: "Loki + Jaeger",
    },
  ],
};