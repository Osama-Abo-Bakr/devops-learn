import type { Quiz } from "@/types";

export const versionControlOpsQuiz: Quiz = {
  id: "version-control-ops-quiz",
  title: "Version Control for Ops Quiz",
  lessonSlug: "version-control-ops",
  questions: [
    {
      id: "q1",
      question: "Why should operations teams use version control for their work?",
      options: [
        "Version control is only needed for application source code, not infrastructure",
        "Version control provides a complete audit trail of who changed what and when, enables rollback to any previous state, and allows collaboration without conflicts",
        "Version control automatically prevents all configuration errors",
        "Version control is only useful for tracking documentation changes",
      ],
      correctIndex: 1,
      explanation:
        "Version control gives ops teams the same benefits developers enjoy: a complete audit trail (who changed what, when, and why via commit messages), the ability to roll back to any previous state, and safe parallel collaboration through branching. When a production issue occurs, you can trace exactly which commit introduced the change.",
    },
    {
      id: "q2",
      question: "Which Git command records your staged changes with a descriptive message?",
      options: [
        "git push",
        "git add",
        "git commit",
        "git merge",
      ],
      correctIndex: 2,
      explanation:
        "git commit records staged changes (those added with git add) to the local repository with a descriptive message. git push sends those commits to a remote repository. git add stages changes for the next commit. git merge combines branches.",
    },
    {
      id: "q3",
      question: "What is the key difference between GitFlow and trunk-based development?",
      options: [
        "GitFlow uses long-lived feature branches and multiple supporting branches (develop, release, hotfix), while trunk-based development merges to main frequently with short-lived branches",
        "GitFlow is for small teams and trunk-based is for large teams",
        "GitFlow does not use branches at all",
        "Trunk-based development requires more branches than GitFlow",
      ],
      correctIndex: 0,
      explanation:
        "GitFlow uses several long-lived branches (main, develop, release, hotfix) and feature branches that live for days or weeks. Trunk-based development uses a single main branch (the trunk) with very short-lived feature branches (hours, not days) that are merged frequently. Trunk-based development aligns better with CI/CD because changes reach main faster.",
    },
    {
      id: "q4",
      question: "What happens during a pull request review process?",
      options: [
        "Code is automatically merged without any human review",
        "Team members review the proposed changes, CI checks run automatically, and the code is only merged after both human approval and passing automated checks",
        "Only the CI checks need to pass — human review is optional",
        "Pull requests are only used for documentation changes",
      ],
      correctIndex: 1,
      explanation:
        "A pull request opens the proposed changes for team review. Reviewers examine the code, suggest improvements, and request changes. Simultaneously, CI checks (build, test, lint, security scan) run automatically. The code merges only after both human approval and passing automated checks. This dual gate catches issues that automated checks alone might miss.",
    },
    {
      id: "q5",
      question: "What does 'infrastructure as repo' mean for ops teams?",
      options: [
        "Storing infrastructure code in a private repository that no one can access",
        "The principle that everything defining your infrastructure — configs, scripts, pipeline definitions, deployment manifests — should be stored in Git and managed like application code",
        "Only storing Docker Compose files in Git",
        "Keeping infrastructure documentation in a wiki instead of Git",
      ],
      correctIndex: 1,
      explanation:
        "Infrastructure as repo means storing all infrastructure definitions in version control: server configs, deployment scripts, CI/CD pipeline definitions, Kubernetes manifests, Terraform files, environment variables (non-secret), and runbooks. This makes changes reviewable, auditable, and reproducible. If everything is in Git, you can rebuild any environment from the repository.",
    },
    {
      id: "q6",
      question: "How does git blame help with operational audits?",
      options: [
        "It automatically blames the developer who introduced a bug",
        "It shows who changed each line of a file, when they changed it, and in which commit — creating a line-by-line audit trail",
        "It deletes old commit history to keep the repository clean",
        "It prevents developers from making changes without approval",
      ],
      correctIndex: 1,
      explanation:
        "git blame (or git annotate) shows the last modification for each line in a file: who made the change, when, and the associated commit hash. During an incident, you can quickly identify who introduced a specific configuration change and review the commit message for context. Combined with git log, this provides a complete audit trail.",
    },
    {
      id: "q7",
      question: "What is GitOps?",
      options: [
        "Using Git as the only tool for all DevOps tasks",
        "A practice where Git is the single source of truth for the desired state of infrastructure and applications, and an automated process continuously syncs the actual state to match",
        "A Git hosting platform like GitHub or GitLab",
        "The process of writing Git hooks for automated testing",
      ],
      correctIndex: 1,
      explanation:
        "GitOps uses Git as the single source of truth for declarative infrastructure and application definitions. When you push a change to Git, an automated reconciliation loop (like ArgoCD or Flux) detects the drift between the desired state in Git and the actual state in the cluster, and syncs them. This makes Git the operational control plane — if you want to change production, you change Git.",
    },
    {
      id: "q8",
      question:
        "An engineer manually changed a production config file on the server. The next deployment overwrote the change and caused an outage. How could version control have prevented this?",
      options: [
        "Version control would have automatically blocked the manual change on the server",
        "Storing configs in Git, deploying only through CI/CD, and using drift detection would ensure manual changes are visible, reviewable, and not silently overwritten",
        "The engineer should have used a different text editor",
        "Version control cannot help with this kind of problem",
      ],
      correctIndex: 1,
      explanation:
        "If all configuration changes are required to go through Git (via pull request and CI/CD deployment), the engineer would have proposed the change in a PR, it would have been reviewed and tested, then deployed through the pipeline. Any manual drift (changes made outside Git) would be detected by tools like ArgoCD, which alert on or automatically reconcile drift. The deployment would not silently overwrite an unknown change because the desired state in Git would already include it.",
    },
  ],
};