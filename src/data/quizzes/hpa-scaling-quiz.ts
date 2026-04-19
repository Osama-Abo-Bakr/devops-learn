import type { Quiz } from "@/types";

export const hpaScalingQuiz: Quiz = {
  id: "hpa-scaling-quiz",
  title: "HPA & Autoscaling Quiz",
  lessonSlug: "hpa-scaling",
  questions: [
    {
      id: "q1",
      question:
        "What must be installed in the cluster for the HorizontalPodAutoscaler to use CPU and memory metrics?",
      options: [
        "Prometheus Operator",
        "metrics-server",
        "kube-state-metrics",
        "cAdvisor",
      ],
      correctIndex: 1,
      explanation:
        "The `metrics-server` aggregates CPU and memory usage data from the kubelet's cAdvisor. The HPA queries the metrics API (provided by metrics-server) to make scaling decisions. Without it, `kubectl top pods` and HPA CPU/memory metrics will not work.",
    },
    {
      id: "q2",
      question:
        "In an HPA manifest, what do `minReplicas` and `maxReplicas` control?",
      options: [
        "The number of Pods the HPA creates on startup and shutdown",
        "The lower and upper bounds for the replica count — the HPA will never scale below `minReplicas` or above `maxReplicas`",
        "The desired and backup replica counts",
        "The minimum and maximum CPU percentages before scaling",
      ],
      correctIndex: 1,
      explanation:
        "`minReplicas` is the floor and `maxReplicas` is the ceiling for the replica count. The HPA calculates the desired replicas based on the target metric but always clamps the result within these bounds. If current replicas equals `maxReplicas`, no scale-up occurs even if the metric exceeds the target.",
    },
    {
      id: "q3",
      question:
        "An HPA targets 50% CPU utilization. The current utilization is 100% with 2 replicas. How many replicas will the HPA request?",
      options: [
        "3 replicas",
        "4 replicas",
        "6 replicas",
        "8 replicas",
      ],
      correctIndex: 1,
      explanation:
        "The HPA formula is: `desiredReplicas = ceil(currentReplicas * (currentMetric / desiredMetric))`. So `ceil(2 * (100 / 50)) = ceil(4) = 4`. The HPA doubles the replicas to bring utilization down to the 50% target.",
    },
    {
      id: "q4",
      question:
        "Which HPA behavior setting prevents rapid scale-down during traffic fluctuations?",
      options: [
        "scaleTargetRef",
        "stabilizationWindowSeconds",
        "minReadySeconds",
        "resourcePolicy",
      ],
      correctIndex: 1,
      explanation:
        "`stabilizationWindowSeconds` in the HPA `behavior.scaleDown` section defines a window during which the HPA remembers the highest recent replica count and avoids scaling down. Default is 300 seconds (5 minutes). This prevents flapping — rapid scale-up/scale-down cycles during short traffic spikes.",
    },
    {
      id: "q5",
      question:
        "How do you configure the HPA to scale based on a custom Prometheus metric?",
      options: [
        "Set the HPA `metrics` type to `External` with a Prometheus query",
        "Install the Prometheus Adapter and use `metrics` type `Pods` or `Object` with the custom metric",
        "Set `spec.customMetrics` in the HPA manifest",
        "Use `kubectl autoscale` with the `--prometheus-query` flag",
      ],
      correctIndex: 1,
      explanation:
        "To scale on custom Prometheus metrics, install the `prometheus-adapter` which exposes custom metrics via the Kubernetes metrics API. Then reference them in the HPA under `metrics` with type `Pods` (for per-Pod metrics) or `Object` (for per-resource metrics). The adapter translates Prometheus queries into the metrics API format.",
    },
    {
      id: "q6",
      question:
        "Your HPA is configured with `minReplicas: 2`, `maxReplicas: 10`, and `targetCPUUtilization: 70%`. Your application suddenly gets a traffic spike. CPU goes to 85% on all pods, but the HPA only scales from 2 to 3 replicas instead of scaling more aggressively. Why?",
      options: [
        "The HPA is misconfigured — it should have scaled to at least 5 replicas",
        "HPA calculates desired replicas as `currentReplicas * (currentMetric / targetMetric)`, so `2 * (85/70) ≈ 2.4` which rounds up to 3. It scales gradually and will re-evaluate after the stabilization window",
        "The metrics-server is not returning accurate CPU data and needs to be restarted",
        "maxReplicas is set too low, preventing further scaling",
      ],
      correctIndex: 1,
      explanation:
        "The HPA formula is `desiredReplicas = ceil(currentReplicas * (currentMetric / desiredMetric))`. With 2 replicas at 85% CPU targeting 70%, the calculation is `ceil(2 * (85/70)) = ceil(2.43) = 3`. The HPA scales gradually — after the stabilization window (default 5 minutes for scale-down), it will re-evaluate. If CPU remains high, it will scale again. This prevents over-provisioning from transient spikes.",
    },
  ],
};