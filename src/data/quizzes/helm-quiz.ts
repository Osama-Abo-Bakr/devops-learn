import type { Quiz } from "@/types";

export const helmQuiz: Quiz = {
  id: "helm-quiz",
  title: "Helm Charts Quiz",
  lessonSlug: "helm-charts",
  questions: [
    {
      id: "q1",
      question:
        "Which file in a Helm chart contains the chart's metadata such as name, version, and dependencies?",
      options: [
        "values.yaml",
        "Chart.yaml",
        "templates/deployment.yaml",
        ".helmignore",
      ],
      correctIndex: 1,
      explanation:
        "`Chart.yaml` contains metadata: `apiVersion` (v2 for Helm 3), `name`, `version`, `appVersion`, `description`, and optional `dependencies` (which replace the old `requirements.yaml`). `values.yaml` holds default configuration values, and `templates/` contains the Kubernetes manifests.",
    },
    {
      id: "q2",
      question:
        "What does `helm upgrade --install` do?",
      options: [
        "Uninstalls the release and reinstalls it from scratch",
        "Installs the release if it does not exist; upgrades it if it does",
        "Only upgrades an existing release — fails if the release is not found",
        "Creates a new release with a different name every time",
      ],
      correctIndex: 1,
      explanation:
        "`helm upgrade --install <release> <chart>` is idempotent: it installs the release if it does not exist, or upgrades it if it does. This is the standard pattern for CI/CD pipelines where you want a single command that works for both first-time deploys and updates.",
    },
    {
      id: "q3",
      question:
        "How do you override a value in `values.yaml` when running `helm install`?",
      options: [
        "Edit the `values.yaml` file directly before installing",
        "Use the `--set` flag (e.g., `--set replicaCount=5`) or the `-f` flag to pass a custom values file",
        "Use the `--override` flag with a JSON patch",
        "You cannot override values at install time",
      ],
      correctIndex: 1,
      explanation:
        "Use `--set key=value` to override individual values (e.g., `--set image.tag=v2.0`) or `-f custom-values.yaml` to override with an entire file. The precedence is: defaults in `values.yaml`, then `-f` files (last one wins), then `--set` flags (highest priority).",
    },
    {
      id: "q4",
      question:
        "How do you roll back a Helm release to its previous version?",
      options: [
        "helm uninstall <release> && helm install <release> <chart>",
        "helm rollback <release> [revision]",
        "helm upgrade --rollback <release>",
        "helm history <release> --revert",
      ],
      correctIndex: 1,
      explanation:
        "Use `helm rollback <release> [revision]` to roll back. Without a revision number, it rolls back to the previous release. Use `helm history <release>` to see all revisions and their statuses. Helm 3 stores release history as secrets in the namespace.",
    },
    {
      id: "q5",
      question:
        "In a Helm template, how do you reference a value from `values.yaml`?",
      options: [
        "`${values.replicaCount}`",
        "`{{ .Values.replicaCount }}`",
        "`$(values.replicaCount)`",
        "`%values.replicaCount%`",
      ],
      correctIndex: 1,
      explanation:
        "Helm uses Go templating syntax: `{{ .Values.replicaCount }}` references the `replicaCount` key from `values.yaml`. Other common objects include `.Chart` (metadata from `Chart.yaml`), `.Release` (release info), and `.Capabilities` (cluster capabilities). Pipe to functions like `{{ .Values.image.tag | default .Chart.AppVersion }}` for defaults.",
    },
  ],
};