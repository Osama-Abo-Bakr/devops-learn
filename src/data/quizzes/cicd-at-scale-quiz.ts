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
  ],
};