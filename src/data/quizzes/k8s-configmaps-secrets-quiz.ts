import type { Quiz } from "@/types";

export const k8sConfigmapsSecretsQuiz: Quiz = {
  id: "k8s-configmaps-secrets-quiz",
  title: "Kubernetes ConfigMaps & Secrets Quiz",
  lessonSlug: "configmaps-secrets",
  questions: [
    {
      id: "q1",
      question:
        "Which command creates a ConfigMap from literal key-value pairs?",
      options: [
        "kubectl create configmap my-config --data=key=value",
        "kubectl create configmap my-config --from-literal=key=value",
        "kubectl apply configmap my-config --set key=value",
        "kubectl set configmap my-config --pair key=value",
      ],
      correctIndex: 1,
      explanation:
        "Use `kubectl create configmap <name> --from-literal=key=value` to create a ConfigMap from literal values. You can also use `--from-file=<path>` to load from a file or `--from-env-file=<path>` to load from an env file.",
    },
    {
      id: "q2",
      question:
        "What is the primary difference between a Secret and a ConfigMap?",
      options: [
        "Secrets are stored in etcd as plaintext; ConfigMaps are encrypted",
        "Secrets are designed for sensitive data and are base64-encoded; ConfigMaps are for non-sensitive configuration",
        "ConfigMaps cannot be mounted as volumes; Secrets can",
        "Secrets are namespace-scoped; ConfigMaps are cluster-scoped",
      ],
      correctIndex: 1,
      explanation:
        "Secrets store sensitive data (passwords, API keys, certificates) and are base64-encoded. ConfigMaps store non-sensitive configuration. Note that base64 is not encryption — enable encryption at rest in etcd for real security. Both are namespace-scoped and can be mounted as volumes or env vars.",
    },
    {
      id: "q3",
      question:
        "How do you mount a ConfigMap key as an environment variable in a Pod?",
      options: [
        "Add the ConfigMap name to the Pod's `spec.configMapRef` field",
        "Use `envFrom` with `configMapRef` for all keys, or `env` with `valueFrom.configMapKeyRef` for specific keys",
        "Set the `CONFIGMAP_ENV` annotation on the Pod",
        "Reference the ConfigMap in the container's `args` field",
      ],
      correctIndex: 1,
      explanation:
        "Use `envFrom` with `configMapRef` to inject all ConfigMap keys as env vars. Use `env` with `valueFrom.configMapKeyRef` to inject a specific key: `name: my-config`, `key: my-key`. The same patterns apply to Secrets using `secretRef` and `secretKeyRef`.",
    },
    {
      id: "q4",
      question:
        "Why are Secrets base64-encoded in Kubernetes?",
      options: [
        "To encrypt the data so it cannot be read by anyone",
        "To allow storing binary data (not just UTF-8 strings) and to differentiate Secret values from plain text in YAML manifests",
        "To reduce the size of the stored data",
        "Because Kubernetes requires all data fields to be base64-encoded",
      ],
      correctIndex: 1,
      explanation:
        "Base64 encoding allows Secrets to store binary data (like certificates) and distinguishes Secret values from plain text in YAML. It is NOT encryption. For real security, enable `--encryption-provider-config` on the API server to encrypt Secrets at rest in etcd, and restrict access with RBAC.",
    },
    {
      id: "q5",
      question:
        "What happens when you set `immutable: true` on a ConfigMap or Secret?",
      options: [
        "The resource can only be deleted, not updated — all data fields become read-only",
        "The resource is automatically encrypted at rest",
        "The resource is replicated to all namespaces",
        "The resource is deleted after 24 hours automatically",
      ],
      correctIndex: 0,
      explanation:
        "Setting `immutable: true` makes all data fields read-only. You cannot change the data — you must delete and recreate the resource. This improves performance because the kubelet does not need to watch for changes, and it protects against accidental modifications to critical configuration.",
    },
  ],
};