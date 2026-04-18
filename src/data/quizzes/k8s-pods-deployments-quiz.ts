import type { Quiz } from "@/types";

export const k8sPodsDeploymentsQuiz: Quiz = {
  id: "k8s-pods-deployments-quiz",
  title: "Kubernetes Pods & Deployments Quiz",
  lessonSlug: "pods-deployments",
  questions: [
    {
      id: "q1",
      question:
        "What is the smallest deployable unit in Kubernetes?",
      options: [
        "Deployment",
        "Node",
        "Pod",
        "Container",
      ],
      correctIndex: 2,
      explanation:
        "A Pod is the smallest deployable unit in Kubernetes. It encapsulates one or more containers that share the same network namespace and storage. You cannot deploy a bare container in Kubernetes — it must be wrapped in a Pod.",
    },
    {
      id: "q2",
      question:
        "What happens to a Pod when its containers crash or exit?",
      options: [
        "The Pod is automatically replaced by a new Pod with a new name",
        "The Pod restarts the containers inside the same Pod object",
        "The Deployment creates a new ReplicaSet",
        "The Pod is marked as Completed and is never restarted",
      ],
      correctIndex: 1,
      explanation:
        "A Pod is not replaced on container failure — the same Pod object restarts its containers based on the `restartPolicy` (default `Always`). A new Pod with a new name is only created when a Deployment replaces it (e.g., during a rolling update).",
    },
    {
      id: "q3",
      question:
        "What is the key difference between a Deployment and a ReplicaSet?",
      options: [
        "A ReplicaSet supports rolling updates; a Deployment does not",
        "A Deployment manages ReplicaSets and provides declarative rolling updates and rollbacks",
        "A Deployment can only manage one Pod; a ReplicaSet can manage many",
        "There is no difference — they are aliases for the same resource",
      ],
      correctIndex: 1,
      explanation:
        "A Deployment wraps a ReplicaSet and adds declarative update capabilities like rolling updates and rollbacks. When you update a Deployment's Pod template, it creates a new ReplicaSet and scales down the old one. Use `kubectl rollout undo deployment/<name>` to roll back.",
    },
    {
      id: "q4",
      question:
        "Which kubectl command scales a Deployment named `api` to 5 replicas?",
      options: [
        "kubectl scale deployment api --count=5",
        "kubectl resize deployment api --replicas=5",
        "kubectl scale deployment api --replicas=5",
        "kubectl update deployment api --size=5",
      ],
      correctIndex: 2,
      explanation:
        "Use `kubectl scale deployment <name> --replicas=<n>` to change the replica count. This updates the Deployment's `spec.replicas` field, and the controller reconciles the actual Pod count to match.",
    },
    {
      id: "q5",
      question:
        "During a rolling update, which field controls how many Pods can be unavailable at any time?",
      options: [
        "spec.strategy.rollingUpdate.maxSurge",
        "spec.strategy.rollingUpdate.maxUnavailable",
        "spec.replicas",
        "spec.minReadySeconds",
      ],
      correctIndex: 1,
      explanation:
        "`maxUnavailable` controls the maximum number or percentage of Pods that can be unavailable during the update. `maxSurge` controls how many extra Pods can be created above the desired count. Together they define the rolling update strategy. Default is `25%` for both.",
    },
  ],
};