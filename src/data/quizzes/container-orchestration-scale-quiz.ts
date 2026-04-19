import type { Quiz } from "@/types";

export const containerOrchestrationScaleQuiz: Quiz = {
  id: "container-orchestration-scale-quiz",
  title: "Container Orchestration at Scale Quiz",
  lessonSlug: "container-orchestration-scale",
  questions: [
    {
      id: "orch-q1",
      question: "Why is a service mesh (e.g., Istio) used in multi-cluster Kubernetes setups?",
      options: [
        "To replace Kubernetes Services entirely",
        "To provide cross-cluster traffic management, mTLS, and observability without code changes",
        "To make pods run faster by caching network requests",
        "To eliminate the need for Ingress controllers",
      ],
      correctIndex: 1,
      explanation: "A service mesh provides cross-cluster communication, mutual TLS encryption, traffic management (retries, circuit breaking), and observability (distributed tracing) — all as infrastructure concerns without modifying application code.",
    },
    {
      id: "orch-q2",
      question: "How does the Horizontal Pod Autoscaler (HPA) decide when to scale pods?",
      options: [
        "It checks the number of incoming HTTP requests every second",
        "It watches CPU/memory metrics from metrics-server and scales when thresholds are exceeded",
        "It scales based on the time of day (peak hours = more pods)",
        "It always maintains a fixed number of replicas",
      ],
      correctIndex: 1,
      explanation: "HPA queries the metrics-server for CPU and memory utilization. When average utilization exceeds the target threshold (e.g., 70% CPU), HPA increases replicas up to maxReplicas. When utilization drops, it scales down to minReplicas.",
    },
    {
      id: "orch-q3",
      question: "What is the key difference between ConfigMap and Secret mounting in Kubernetes?",
      options: [
        "ConfigMaps are stored on disk; Secrets are stored in memory only",
        "ConfigMaps are for non-sensitive configuration; Secrets are for credentials with base64 encoding and restricted access",
        "There is no difference — they are interchangeable",
        "Secrets can only be mounted as files; ConfigMaps can only be env vars",
      ],
      correctIndex: 1,
      explanation: "ConfigMaps store non-sensitive data (log levels, endpoints, feature flags). Secrets store sensitive data (DB passwords, API keys) with base64 encoding and can be restricted with RBAC. Both can be mounted as env vars, files, or volumes.",
    },
    {
      id: "orch-q4",
      question: "What is the purpose of the PersistentVolume + PersistentVolumeClaim pattern?",
      options: [
        "To make pods stateless and easier to restart",
        "To decouple storage lifecycle from pod lifecycle so data survives pod restarts",
        "To increase pod startup speed by pre-loading data",
        "To share the same volume across all pods in a namespace",
      ],
      correctIndex: 1,
      explanation: "PVs represent actual storage (EBS, GCE PD, NFS). PVCs are requests for storage. The PV/PVC pattern decouples storage from pods — when a pod is deleted and recreated, the PVC rebinds to the same PV, preserving data.",
    },
    {
      id: "orch-q5",
      question: "What is the difference between active-passive and active-active multi-cluster architectures?",
      options: [
        "Active-passive uses 2 clusters; active-active uses 3 or more",
        "Active-passive routes traffic to the DR cluster only on failure; active-active serves from both clusters simultaneously",
        "Active-passive is cheaper; active-active is more secure",
        "There is no practical difference — both handle traffic the same way",
      ],
      correctIndex: 1,
      explanation: "In active-passive, one cluster handles all traffic while the other stands by for failover. In active-active, both clusters serve traffic simultaneously (often with geo-routing), providing lower latency and higher availability at the cost of complexity.",
    },
  ],
};