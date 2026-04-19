import type { Quiz } from "@/types";

export const cicdBasicsQuiz: Quiz = {
  id: "cicd-basics-quiz",
  title: "CI/CD Basics Quiz",
  lessonSlug: "cicd-basics",
  questions: [
    {
      id: "q1",
      question: "What is Continuous Integration (CI)?",
      options: [
        "A practice where developers merge their code changes into a shared branch frequently, with automated builds and tests running on every merge",
        "A tool that automatically deploys code to production servers",
        "A method for running integration tests only before releases",
        "A way to manually integrate different software components",
      ],
      correctIndex: 0,
      explanation:
        "Continuous Integration is the practice of frequently merging code changes into a shared branch (often main), where each merge triggers an automated build and test cycle. This catches integration problems early, when they are cheapest to fix, rather than waiting for a big-bang merge at release time.",
    },
    {
      id: "q2",
      question: "What is Continuous Delivery?",
      options: [
        "Every code change is automatically deployed to production with no human intervention",
        "The practice of keeping code in a deployable state so that any build can be released to production at any time, with a manual approval gate before production",
        "A shipping logistics term borrowed for software development",
        "Running integration tests on a schedule rather than on every push",
      ],
      correctIndex: 1,
      explanation:
        "Continuous Delivery extends CI by ensuring that every successful build produces a release-ready artifact. The artifact is automatically deployed to staging, but a human must approve the final promotion to production. The key difference from Continuous Deployment is that manual gate before production.",
    },
    {
      id: "q3",
      question: "What distinguishes Continuous Deployment from Continuous Delivery?",
      options: [
        "Continuous Deployment requires manual approval before each production release",
        "Continuous Deployment means every change that passes all pipeline stages is automatically deployed to production without a manual gate",
        "There is no difference — the terms are interchangeable",
        "Continuous Deployment only applies to containerized applications",
      ],
      correctIndex: 1,
      explanation:
        "Continuous Deployment goes one step further than Continuous Delivery: every change that passes the automated pipeline (build, test, scan) is deployed to production automatically, with no manual approval. This requires strong automated testing and monitoring confidence. Continuous Delivery still has a human gate before production.",
    },
    {
      id: "q4",
      question: "What is a build artifact?",
      options: [
        "The source code committed to the repository",
        "A configuration file that defines the pipeline stages",
        "An immutable output of the build stage — such as a Docker image, JAR file, or compiled binary — that can be versioned and deployed",
        "A temporary log file generated during the build process",
      ],
      correctIndex: 2,
      explanation:
        "A build artifact is the immutable, versioned output of the build stage. It could be a Docker image, a JAR file, a compiled binary, or any deployable unit. Artifacts are stored in a registry and referenced by a unique tag (like a commit SHA). Immutability means the same artifact is promoted through staging to production without being rebuilt.",
    },
    {
      id: "q5",
      question: "Why should testing be automated in a CI pipeline?",
      options: [
        "Automated tests are slower but more thorough than manual tests",
        "Automated tests run on every change, catch bugs early, produce consistent results, and provide fast feedback — making it practical to test at the pace of development",
        "Automated testing eliminates the need for any manual QA",
        "Automated tests only need to be run before releases, not on every push",
      ],
      correctIndex: 1,
      explanation:
        "Automated tests in CI run on every code change, catching bugs before they reach downstream environments. They produce consistent, repeatable results without human variability. Fast feedback loops (minutes, not days) mean developers fix issues while the context is fresh. This does not eliminate manual QA — exploratory and usability testing still need humans — but automated tests handle the regression and integration checks.",
    },
    {
      id: "q6",
      question: "What typically triggers a CI pipeline to run?",
      options: [
        "Only manual execution by a team lead",
        "A scheduled daily batch job that builds all branches",
        "Events such as a push to a branch, an opened pull request, or a scheduled cron trigger",
        "Only when a release tag is created",
      ],
      correctIndex: 2,
      explanation:
        "CI pipelines are most commonly triggered by push events to a branch (any push or just main), pull request events (to validate before merge), and scheduled runs (for nightly builds or periodic checks). Some pipelines also trigger on tag creation for releases. The goal is to validate every change as early as possible.",
    },
    {
      id: "q7",
      question: "Which deployment strategy gradually routes a small percentage of traffic to the new version before a full rollout?",
      options: [
        "Blue-green deployment — switches all traffic at once between two identical environments",
        "Canary deployment — routes a small percentage of traffic to the new version first, then gradually increases it",
        "Rolling deployment — replaces old instances with new ones one at a time",
        "Recreate deployment — terminates all old instances before starting new ones",
      ],
      correctIndex: 1,
      explanation:
        "Canary deployment sends a small fraction of traffic (e.g., 5%) to the new version while monitoring for errors. If everything looks good, traffic is gradually increased. Blue-green switches all traffic at once between two environments. Rolling replaces instances one by one. Recreate stops all old instances before starting new ones. Each strategy trades off speed, risk, and resource cost differently.",
    },
    {
      id: "q8",
      question:
        "Your team merges code to the main branch once a week. Each merge takes a full day of manual integration work. What CI practice would help most?",
      options: [
        "Merge less frequently to reduce integration conflicts",
        "Merge more frequently (at least daily), automate the build to run on every push, and run the full test suite automatically so integration problems surface immediately",
        "Skip integration testing and rely on manual QA before releases",
        "Only allow senior developers to merge code",
      ],
      correctIndex: 1,
      explanation:
        "The core principle of CI is integrate early and often. Merging once a week means large, complex merges. Merging daily (or on every push) means smaller changes that are easier to integrate. Automating the build and tests means every change is validated immediately — no more day-long manual integration sessions. The longer you wait between merges, the harder and riskier integration becomes.",
    },
  ],
};