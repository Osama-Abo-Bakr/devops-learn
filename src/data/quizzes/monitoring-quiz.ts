import type { Quiz } from "@/types";

export const monitoringQuiz: Quiz = {
  id: "monitoring-quiz",
  title: "Monitoring & Observability Quiz",
  lessonSlug: "monitoring-observability",
  questions: [
    {
      id: "q1",
      question:
        "What are the three pillars of observability?",
      options: [
        "Monitoring, alerting, and dashboards",
        "Metrics, logs, and traces",
        "CPU, memory, and disk I/O",
        "Health checks, readiness probes, and liveness probes",
      ],
      correctIndex: 1,
      explanation:
        "The three pillars of observability are Metrics (numeric time-series data like CPU usage), Logs (discrete event records with timestamps), and Traces (request flow across distributed services). Together they provide a complete picture of system behavior for debugging and understanding production systems.",
    },
    {
      id: "q2",
      question:
        "Which Prometheus metric type is used to track a value that can only go up (like total HTTP requests)?",
      options: [
        "Gauge",
        "Counter",
        "Histogram",
        "Summary",
      ],
      correctIndex: 1,
      explanation:
        "A `Counter` is a cumulative metric that only increases (or resets to zero on restart). Use it for total requests, errors, or bytes processed. To get a rate, use `rate(http_requests_total[5m])` in PromQL. A `Gauge` can go up or down (e.g., current temperature). `Histogram` and `Summary` observe distributions.",
    },
    {
      id: "q3",
      question:
        "In Grafana, what is the difference between a dashboard and a panel?",
      options: [
        "A dashboard is a visualization; a panel is a data source",
        "A dashboard is a collection of panels arranged in a grid; a panel is a single visualization (chart, table, or stat)",
        "A dashboard queries Prometheus; a panel queries Loki",
        "They are the same thing with different names",
      ],
      correctIndex: 1,
      explanation:
        "A Grafana dashboard is a page containing multiple panels arranged in a grid layout. Each panel is a single visualization — a graph, single stat, table, heatmap, etc. — backed by a query to a data source (Prometheus, Loki, etc.). Dashboards can use template variables for dynamic filtering.",
    },
    {
      id: "q4",
      question:
        "What is Loki and how does it differ from Elasticsearch/ELK for log aggregation?",
      options: [
        "Loki indexes the full log content; ELK only indexes metadata",
        "Loki only indexes labels (metadata) and stores log content as compressed chunks; ELK indexes the full text of logs",
        "Loki cannot query logs — it only stores them",
        "Loki is a drop-in replacement for Prometheus",
      ],
      correctIndex: 1,
      explanation:
        "Loki is a log aggregation system inspired by Prometheus. It only indexes labels (key-value pairs attached to log streams) and stores log content as compressed chunks in object storage. This makes it much cheaper and simpler than ELK, which creates inverted indexes on the full log text. Use LogQL to query: `{app=\"api\"} |= \"error\"`.",
    },
    {
      id: "q5",
      question:
        "How does distributed tracing with Jaeger help debug microservice issues?",
      options: [
        "It replaces the need for logs and metrics",
        "It tracks a single request's path across multiple services, showing timing and context at each hop",
        "It only monitors CPU usage across services",
        "It automatically fixes performance bottlenecks",
      ],
      correctIndex: 1,
      explanation:
        "Distributed tracing tracks a request as it flows through multiple services. Each service adds a `span` to the trace with timing and metadata. Jaeger visualizes the full trace as a waterfall diagram, making it easy to identify which service is slow or failing. Use OpenTelemetry for instrumentation: it auto-generates spans and exports to Jaeger.",
    },
  ],
};