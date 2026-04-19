import type { Quiz } from "@/types";

export const infrastructureAsCodeQuiz: Quiz = {
  id: "infrastructure-as-code-quiz",
  title: "Infrastructure as Code Quiz",
  lessonSlug: "infrastructure-as-code",
  questions: [
    {
      id: "q1",
      question:
        "Which of the following are key benefits of Infrastructure as Code? (Choose the best answer)",
      options: [
        "Faster manual console clicks, visual dashboards, and fewer teams",
        "Reproducibility, version control, audit trail, and automation",
        "Removing the need for cloud providers entirely",
        "Eliminating the need for any configuration files",
      ],
      correctIndex: 1,
      explanation:
        "IaC provides reproducibility (same code = same infrastructure every time), version control (infrastructure changes are tracked in git), audit trail (who changed what and when), and automation (CI/CD pipelines apply changes automatically). These benefits eliminate configuration drift and manual errors that come from clicking through cloud consoles.",
    },
    {
      id: "q2",
      question:
        "What is the primary difference between declarative and imperative approaches to IaC?",
      options: [
        "Declarative IaC specifies *what* the desired state should be; imperative IaC specifies *how* to reach that state step by step",
        "Declarative IaC uses loops and conditionals; imperative IaC uses YAML only",
        "Declarative IaC is always faster; imperative IaC is always safer",
        "There is no practical difference — both produce identical results in all cases",
      ],
      correctIndex: 0,
      explanation:
        "Declarative IaC (Terraform, Pulumi) describes the *desired end state*: 'I want 3 EC2 instances in this VPC.' The tool figures out how to get there. Imperative IaC (shell scripts, boto3) describes the *steps*: 'create a VPC, then create a subnet, then launch 3 instances.' Declarative tools can reconcile drift automatically; imperative scripts may break if run twice or if the environment changes between runs.",
    },
    {
      id: "q3",
      question:
        "Your team runs `terraform apply` from two terminals simultaneously. One fails with 'Error acquiring the state lock'. What happened?",
      options: [
        "Terraform has a bug that needs to be reported",
        "The state file is corrupted and must be deleted and recreated",
        "State locking prevented concurrent modifications — one apply acquired the lock and the second was blocked to avoid corrupting the state",
        "You need to upgrade your Terraform version to support parallel execution",
      ],
      correctIndex: 2,
      explanation:
        "Terraform uses state locking (via DynamoDB for S3 backends, or native locking in Consul/GCS) to prevent concurrent operations that could corrupt the state file. When two applies run simultaneously, the first acquires the lock and the second fails with a lock error. This is a safety feature, not a bug. The solution is to wait for the first operation to complete, or in rare cases of stale locks, use `terraform force-unlock` after verifying the other operation is truly finished.",
    },
    {
      id: "q4",
      question:
        "In Terraform, what is the purpose of modules and how do you version them?",
      options: [
        "Modules are just files in the same directory — versioning is not supported",
        "Modules are reusable packages of Terraform configuration referenced via `source` with version constraints (e.g., `?ref=v2.1.0`), and they accept input variables and produce output values",
        "Modules are deprecated — Terraform recommends putting all resources in a single file",
        "Modules can only be used within the same organization and require a paid Terraform Cloud license",
      ],
      correctIndex: 1,
      explanation:
        "Terraform modules are reusable packages of configuration. You reference them with `source` (local path, Git repo, or Terraform Registry) and pin versions with `?ref=v2.1.0`. Modules accept `variable` inputs and produce `output` values, enabling composition: a VPC module creates networking, an EKS module creates a cluster, and your root module wires them together. The Terraform Registry hosts thousands of community modules.",
    },
    {
      id: "q5",
      question:
        "When should you choose Pulumi over Terraform for infrastructure as code?",
      options: [
        "Always — Pulumi is strictly superior to Terraform in every way",
        "Never — Terraform is the only industry-standard IaC tool",
        "When you need real programming language features (loops, conditionals, classes, testing frameworks) or imperative escape hatches, and your team is more comfortable with TypeScript/Python/Go than HCL",
        "Only when you are deploying to a single cloud provider",
      ],
      correctIndex: 2,
      explanation:
        "Pulumi lets you write infrastructure code in TypeScript, Python, Go, and other real languages. This gives you native loops, conditionals, classes, unit testing with standard frameworks, and imperative escape hatches when declarative-only approaches fall short. Choose Pulumi when your team prefers real languages over HCL, needs complex logic, or wants to test infrastructure code like application code. Choose Terraform when HCL's simplicity and the massive ecosystem of providers/modules meets your needs.",
    },
    {
      id: "q6",
      question:
        "Which Terraform module is used to provision a managed Kubernetes cluster on AWS, and how does it differ from managing EKS manually?",
      options: [
        "The `aws_eks_cluster` resource alone is enough — modules are unnecessary for EKS",
        "The `terraform-aws-modules/eks/aws` module provisions the cluster, node groups, IAM roles, VPC CNI, and CoreDNS in one module call, versus manually creating dozens of separate resources",
        "EKS cannot be managed with Terraform — you must use eksctl or the AWS Console",
        "You must write a custom module from scratch for every EKS deployment",
      ],
      correctIndex: 1,
      explanation:
        "The `terraform-aws-modules/eks/aws` module encapsulates the complexity of provisioning EKS: it creates the cluster, managed node groups, IAM roles and policies, VPC CNI configuration, CoreDNS addons, and more. Manually, you would need to create dozens of separate `aws_eks_cluster`, `aws_eks_node_group`, `aws_iam_role`, `aws_iam_role_policy_attachment`, and other resources. Similar modules exist for AKS (`terraform-azurerm/aks`) and GKE (`terraform-google-modules/kubernetes-engine`).",
    },
    {
      id: "q7",
      question:
        "You run `terraform plan` and it shows '1 resource will be updated in-place' even though no one on your team made any changes. What happened and what should you do?",
      options: [
        "Terraform is broken — run `terraform state rm` to fix it",
        "Configuration drift occurred — someone made a manual change in the AWS Console, and `terraform plan` detected the difference between actual state and declared state. Run `terraform apply` to reconcile",
        "This is a false positive — always ignore plan output if you did not change the code",
        "You need to delete the state file and re-import all resources",
      ],
      correctIndex: 1,
      explanation:
        "This is configuration drift: someone manually changed a resource (e.g., increased an instance type in the AWS Console) without updating the Terraform code. `terraform plan` compares the desired state (your .tf files) against the actual state (what exists in the cloud) and shows the difference. Running `terraform apply` reconciles the actual state back to the declared state. To prevent future drift, restrict console access and enforce all changes through IaC and CI/CD.",
    },
    {
      id: "q8",
      question:
        "Which of the following are Terraform state management best practices?",
      options: [
        "Store state locally on your laptop, commit .tfstate to git, and let everyone apply from their own machine",
        "Use remote state backends (S3, GCS), enable state locking (DynamoDB), apply least-privilege IAM policies, and isolate environments with workspaces or separate configurations",
        "Disable state locking for better performance and share a single state file across dev, staging, and production",
        "Only use local state — remote backends add unnecessary complexity",
      ],
      correctIndex: 1,
      explanation:
        "Best practices for Terraform state: (1) Store state remotely (S3 + DynamoDB for AWS, GCS for GCP) so the team shares a single source of truth. (2) Enable state locking to prevent concurrent applies from corrupting state. (3) Apply least-privilege IAM policies — state files contain sensitive outputs like database passwords. (4) Isolate environments using separate state files (workspaces or directory-based separation) so a mistake in dev does not destroy production. Never commit .tfstate files to git — they contain secrets and create merge conflicts.",
    },
  ],
};