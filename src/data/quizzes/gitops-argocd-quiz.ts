import type { Quiz } from "@/types";

export const gitopsArgocdQuiz: Quiz = {
  id: "gitops-argocd-quiz",
  title: "GitOps and ArgoCD Quiz",
  lessonSlug: "gitops-argocd",
  questions: [
    {
      id: "q1",
      question:
        "What are the four core principles of GitOps?",
      options: [
        "Imperative commands, manual deployments, pushed from CI, and ad-hoc monitoring",
        "Declarative configuration, versioned and immutable, pulled automatically, and continuously reconciled",
        "Centralized scripts, binary artifacts, pushed via SSH, and periodically synced",
        "Infrastructure as Code, mutable state, manual approval gates, and event-driven triggers",
      ],
      correctIndex: 1,
      explanation:
        "The four GitOps principles are: (1) **Declarative** — system config is described declaratively, (2) **Versioned and immutable** — desired state is stored in Git with full history, (3) **Pulled automatically** — software agents pull changes from Git rather than CI pushing them, and (4) **Continuously reconciled** — agents continuously compare actual vs desired state and correct drift.",
    },
    {
      id: "q2",
      question:
        "In an ArgoCD Application CRD, what do the `source` and `destination` fields define?",
      options: [
        "`source` defines the Git branch and `destination` defines the ArgoCD project",
        "`source` defines the Docker image and `destination` defines the deployment strategy",
        "`source` defines the Git repo + path (desired state) and `destination` defines the target cluster + namespace (where to deploy)",
        "`source` defines the Helm values and `destination` defines the resource limits",
      ],
      correctIndex: 2,
      explanation:
        "The Application CRD has two key fields: `source` specifies where to find the desired state (Git repo URL, path, revision, and optionally Helm values or Kustomize overlays), while `destination` specifies where to deploy it (cluster URL or name, and namespace). ArgoCD continuously compares the source (desired state) against the destination (live state).",
    },
    {
      id: "q3",
      question:
        "What is the App-of-Apps pattern in ArgoCD?",
      options: [
        "Running multiple ArgoCD instances in different namespaces",
        "A single parent Application that manages other child Applications, enabling bulk management of many apps",
        "Deploying one application across multiple clusters simultaneously",
        "Using ArgoCD to manage itself through a self-referential Application",
      ],
      correctIndex: 1,
      explanation:
        "The App-of-Apps pattern defines one parent Application whose source points to a directory of Application manifests. When ArgoCD syncs the parent, it creates child Applications for each manifest found. This lets you manage dozens of applications as a group, apply consistent sync policies, and organize multi-app deployments from a single Git path.",
    },
    {
      id: "q4",
      question:
        "What happens when ArgoCD detects that a cluster's live state has drifted from the Git desired state and `automated.selfHeal` is enabled?",
      options: [
        "ArgoCD sends an alert and waits for manual approval before syncing",
        "ArgoCD automatically re-applies the Git state to bring the cluster back to the desired configuration",
        "ArgoCD marks the application as OutOfSync but takes no action until the next scheduled sync window",
        "ArgoCD deletes the drifted resources and recreates them from scratch",
      ],
      correctIndex: 1,
      explanation:
        "When `selfHeal` is enabled in the sync policy, ArgoCD detects the drift (OutOfSync status) and automatically triggers a sync to re-apply the Git state, bringing the cluster back to the desired configuration. Without selfHeal, ArgoCD would only report the drift and require a manual sync. The `prune` option controls whether ArgoCD removes resources that exist in the cluster but are absent from Git.",
    },
    {
      id: "q5",
      question:
        "How does Argo Rollouts extend ArgoCD for progressive delivery?",
      options: [
        "It replaces ArgoCD's sync engine with a canary-aware reconciler",
        "It provides the Rollout CRD with canary and blue-green strategies, metric analysis, and automated promotion/rollback",
        "It adds a new sync wave type called 'progressive' that gradually increases replica counts",
        "It integrates Prometheus alerts directly into ArgoCD's Application CRD",
      ],
      correctIndex: 1,
      explanation:
        "Argo Rollouts is a separate controller that introduces the `Rollout` CRD (a replacement for `Deployment`). It supports canary strategies (route a percentage of traffic to the new version, analyze metrics, then promote or rollback) and blue-green strategies. Metric analysis can query Prometheus, Datadog, or other providers during a canary phase to decide whether to promote or abort. This goes beyond ArgoCD's sync capabilities, which are declarative and do not natively support canary traffic shifting.",
    },
    {
      id: "q6",
      question:
        "How does ArgoCD manage deployments to multiple Kubernetes clusters?",
      options: [
        "ArgoCD can only manage the cluster it is installed on — use one instance per cluster",
        "ArgoCD uses the `destination` field in Application CRDs, referencing cluster names registered via `argocd cluster add`",
        "ArgoCD deploys a lightweight agent on each target cluster that pulls manifests from Git",
        "Multi-cluster support requires a separate ArgoCD project for each cluster",
      ],
      correctIndex: 1,
      explanation:
        "ArgoCD registers external clusters using `argocd cluster add <context>`, which stores the cluster credentials in a Kubernetes Secret. Applications then reference these clusters by name or server URL in their `destination` field. A single ArgoCD instance can manage dozens of clusters. ArgoCD does not deploy agents — the controller directly communicates with target clusters using stored kubeconfig credentials.",
    },
    {
      id: "q7",
      question:
        "What are sync waves and hooks in ArgoCD, and how are they configured?",
      options: [
        "Sync waves are the number of replicas to scale up; hooks are webhook URLs called after each sync",
        "Sync waves order resource syncing into phases (wave 0, 1, 2...); hooks (PreSync, Sync, PostSync, SyncFail) run custom jobs at specific phases",
        "Sync waves control the Git branch checkout order; hooks are Git pre-commit hooks that validate manifests",
        "Sync waves determine which ArgoCD instance syncs first; hooks are Kubernetes admission controllers",
      ],
      correctIndex: 1,
      explanation:
        "Sync waves are configured via the `argocd.argoproj.io/sync-wave` annotation on resources (e.g., `argocd.argoproj.io/sync-wave: \"0\"`). Resources in wave 0 are synced first, then wave 1, and so on. Hooks are configured via the `argocd.argoproj.io/hook` annotation and can be `PreSync`, `Sync`, `PostSync`, or `SyncFail`. For example, a PreSync hook can run a database migration Job before the Deployment is synced. This enables ordered, safe rollouts.",
    },
    {
      id: "q8",
      question:
        "Your ArgoCD dashboard shows an Application with status OutOfSync. The Git repo contains 3 replicas, but the cluster has 5 pods running. What are the correct troubleshooting steps?",
      options: [
        "Delete the application and recreate it — ArgoCD cannot recover from drift",
        "Check `argocd app diff` to see what changed, verify sync policy (selfHeal), check if someone used `kubectl apply` manually, then either enable selfHeal or run `argocd app sync`",
        "Restart the ArgoCD controller pod — OutOfSync always means the controller is broken",
        "Change the Git manifest to match the cluster state (set replicas to 5) — the cluster is the source of truth in GitOps",
      ],
      correctIndex: 1,
      explanation:
        "OutOfSync means the live cluster state differs from Git. The correct troubleshooting flow: (1) Run `argocd app diff <app>` to see exactly what diverged, (2) Check if automated sync with selfHeal is enabled — if so, ArgoCD should auto-correct, (3) Investigate whether someone made a manual change via `kubectl apply` or `kubectl scale` (which GitOps considers drift), (4) If selfHeal is off, run `argocd app sync <app>` to re-apply Git state. Never modify Git to match drift — Git is the source of truth in GitOps.",
    },
  ],
};