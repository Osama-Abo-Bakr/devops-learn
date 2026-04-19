import type { Quiz } from "@/types";

export const advancedCicdQuiz: Quiz = {
  id: "advanced-cicd-quiz",
  title: "Advanced CI/CD Pipelines Quiz",
  lessonSlug: "advanced-cicd-pipelines",
  questions: [
    {
      id: "aq1",
      question: "What is the primary purpose of an approval gate in a multi-stage CI/CD pipeline?",
      options: [
        "Speed up the pipeline by skipping unnecessary stages",
        "Enforce manual review and sign-off before deploying to sensitive environments",
        "Automatically run additional test suites",
        "Reduce the number of required build agents",
      ],
      correctIndex: 1,
      explanation: "Approval gates require human sign-off before proceeding to staging or production, ensuring compliance with change management policies and reducing risk of deploying unreviewed code.",
    },
    {
      id: "aq2",
      question: "In a canary deployment, what happens when the error rate exceeds the defined threshold?",
      options: [
        "The canary is promoted to full production immediately",
        "An alert is sent to Slack but deployment continues",
        "The system automatically rolls back to the previous stable version",
        "The canary is paused and waits for manual intervention",
      ],
      correctIndex: 2,
      explanation: "Automated canary deployments (e.g., Argo Rollouts, Flagger) monitor error rates and automatically roll back when thresholds are exceeded, preventing bad code from reaching full production.",
    },
    {
      id: "aq3",
      question: "What is the key difference between blue/green and canary deployment strategies?",
      options: [
        "Blue/green uses container orchestration while canary uses VMs",
        "Blue/green switches all traffic instantly between two environments; canary shifts traffic gradually",
        "Canary deployments are faster because they skip testing",
        "Blue/green is only for microservices; canary is for monoliths",
      ],
      correctIndex: 1,
      explanation: "Blue/green deploys maintain two identical environments and switch all traffic at once (instant cutover). Canary deploys route a small percentage of traffic to the new version and gradually increase it while monitoring health.",
    },
    {
      id: "aq4",
      question: "Why do parallel pipeline jobs improve overall CI/CD efficiency?",
      options: [
        "They reduce the number of test cases needed",
        "They allow independent stages to run concurrently, reducing wall-clock time",
        "They eliminate the need for a build agent",
        "They automatically merge code changes faster",
      ],
      correctIndex: 1,
      explanation: "When stages have no dependencies on each other (e.g., unit tests, integration tests, and security scans can all run on the same built artifact), running them in parallel reduces the total pipeline duration from the sum of all stages to the duration of the slowest single stage.",
    },
    {
      id: "aq5",
      question: "What is the most reliable rollback strategy when using a container registry in production?",
      options: [
        "Revert the git commit and rebuild from scratch",
        "Redeploy the previous immutable image tag from the registry",
        "SSH into production servers and manually fix the issue",
        "Delete the failed deployment and let the CI pipeline re-trigger",
      ],
      correctIndex: 1,
      explanation: "Immutable container images mean the previous working version is always available in the registry. Redeploying the previous tag is instant and deterministic — no rebuild needed, no risk of different build output.",
    },
  ],
};