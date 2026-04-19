import type { Quiz } from "@/types";

export const cicdAtScaleQuiz: Quiz = {
  id: "cicd-at-scale-quiz",
  title: "CI/CD at Scale Quiz",
  lessonSlug: "cicd-at-scale-netflix-meta",
  questions: [
    {
      id: "scale-q1",
      question: "What does Spinnaker's 'bake' stage do?",
      options: [
        "Compiles source code into a binary",
        "Produces immutable deployment artifacts like AMIs or Docker images",
        "Runs automated integration tests against staging",
        "Deploys the application to a canary cluster",
      ],
      correctIndex: 1,
      explanation: "The bake stage takes build artifacts and produces immutable deployment images (AMIs for EC2, Docker images for containers). This ensures the exact same artifact traverses all pipeline stages without modification.",
    },
    {
      id: "scale-q2",
      question: "Why does Netflix integrate Chaos Monkey into their deployment pipeline?",
      options: [
        "To generate load for performance testing",
        "To validate resilience of new deployments by inducing random failures",
        "To slow down deployments and prevent accidental rollouts",
        "To test rollback mechanisms by deleting all pods",
      ],
      correctIndex: 1,
      explanation: "Chaos Monkey randomly terminates instances in production to ensure services can handle failures gracefully. Running it during/after deployment validates that the new version is resilient to instance failures.",
    },
    {
      id: "scale-q3",
      question: "How does Meta's feature flag approach (Gatekeeper) decouple deployment from release?",
      options: [
        "Feature flags make builds faster by skipping unused code",
        "Code is deployed to production but hidden behind flags — visibility is controlled separately",
        "Feature flags automatically revert broken code",
        "Flags replace the need for CI pipelines entirely",
      ],
      correctIndex: 1,
      explanation: "Feature flags allow code to be deployed to 100% of servers without being visible to users. Product teams can then gradually enable features for specific user segments, enabling rapid deployment with controlled release.",
    },
    {
      id: "scale-q4",
      question: "What does Kayenta do in Netflix's canary analysis?",
      options: [
        "It generates Docker images for canary pods",
        "It performs automated metric comparison between canary and baseline to decide promote or rollback",
        "It sends Slack notifications when canary fails",
        "It creates the Kubernetes canary deployment manifest",
      ],
      correctIndex: 1,
      explanation: "Kayenta is Netflix's automated canary analysis service. It compares metrics (latency, error rate, CPU, etc.) between the canary and baseline deployments using statistical methods to determine if the canary is healthy enough to promote.",
    },
    {
      id: "scale-q5",
      question: "What principle do Netflix and Meta's CI/CD systems both share?",
      options: [
        "Both require manual approval for every deployment",
        "Both use the same build system (Jenkins)",
        "Immutable artifacts + automated rollback + full observability",
        "Both deploy only during off-peak hours (midnight-6am)",
      ],
      correctIndex: 2,
      explanation: "Despite different architectures (Netflix: K8s + Spinnaker, Meta: bare-metal + custom tools), both share: immutable artifacts (same image goes everywhere), automated rollback (instant on failure), and full observability (metrics/logs/traces to detect problems fast).",
    },
    {
      id: "scale-q6",
      question: "What is a key design principle of Meta's Buck2 build system?",
      options: [
        "It builds all targets sequentially to guarantee correctness",
        "It uses distributed caching and incremental builds so that only changed inputs trigger rebuilds across large monorepos",
        "It replaces CI/CD pipelines entirely by running builds locally on every developer's machine",
        "It requires a full rebuild of the monorepo on every commit to ensure consistency",
      ],
      correctIndex: 1,
      explanation:
        "Buck2 is Meta's open-source build system designed for massive monorepos. It uses a fine-grained dependency graph to enable incremental builds — only the targets affected by a change are rebuilt. Distributed caching (via cache servers) means that if a target was already built by another engineer or CI job, the result is downloaded instead of rebuilt. This makes builds fast at scale, where full rebuilds would be infeasible.",
    },
    {
      id: "scale-q7",
      question:
        "Meta wants to roll out a new feature to 1% of users, then 5%, then 25%, then 100%. Which system manages this progressive rollout?",
      options: [
        "Spinnaker's canary analysis stage with configurable percentages",
        "FB Trench (Gatekeeper) — a feature gating system that controls gradual rollouts based on user segments and percentages",
        "Kubernetes HPA scaling replicas proportionally to traffic percentage",
        "Jenkins pipeline with manual approval gates at each percentage threshold",
      ],
      correctIndex: 1,
      explanation:
        "FB Trench (also known as Gatekeeper) is Meta's internal feature gating and gradual rollout system. It allows product teams to deploy code to 100% of servers but expose features to a controlled percentage of users — starting at 1% and progressively increasing to 100%. This decouples deployment from release and enables quick rollback by turning off the gate, without reverting code. This is distinct from canary deployments (which shift infrastructure traffic) — Trench gates features at the application level.",
    },
    {
      id: "scale-q8",
      question: "How does Netflix's Atlas monitoring system integrate with their CI/CD pipeline?",
      options: [
        "Atlas only stores metrics for post-incident review and is not connected to the deployment pipeline",
        "Atlas feeds real-time application metrics into automated deployment decisions — Kayenta compares canary vs. baseline metrics from Atlas to determine whether to promote or rollback",
        "Atlas replaces the need for CI testing by monitoring production traffic instead",
        "Atlas generates Docker images based on metric thresholds",
      ],
      correctIndex: 1,
      explanation:
        "Netflix's Atlas is a high-resolution dimensional time-series data store that collects metrics from all services. In the CI/CD pipeline, Kayenta (Netflix's automated canary analysis tool) queries Atlas for metrics like error rates, latency percentiles, and CPU usage from both the canary and baseline deployments. It uses statistical analysis on these Atlas metrics to decide whether the canary is healthy enough to promote or should be rolled back. This metrics-driven approach means deployment decisions are based on objective production data, not manual judgment.",
    },
  ],
};