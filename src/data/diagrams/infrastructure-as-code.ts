import type { DiagramConfig } from "@/types";

export const infrastructureAsCode: DiagramConfig = {
  id: "infrastructure-as-code",
  title: "Infrastructure as Code — Terraform & Pulumi",
  viewport: { x: 0, y: 0, zoom: 0.65 },
  nodes: [
    // Left: IaC Code
    {
      id: "terraform-code",
      position: { x: 50, y: 80 },
      data: {
        type: "pipeline",
        label: "Terraform (HCL)",
        details: {
          description: "Declarative infrastructure definitions using HashiCorp Configuration Language",
          config: {
            file: "main.tf",
            syntax: "HCL",
            paradigm: "declarative",
          },
        },
      },
    },
    {
      id: "pulumi-code",
      position: { x: 50, y: 230 },
      data: {
        type: "pipeline",
        label: "Pulumi (TypeScript)",
        details: {
          description: "Infrastructure definitions using real programming languages with imperative escape hatches",
          config: {
            file: "index.ts",
            syntax: "TypeScript / Python / Go",
            paradigm: "declarative + imperative",
          },
        },
      },
    },
    // Center: State Backend
    {
      id: "state-backend",
      position: { x: 350, y: 50 },
      data: {
        type: "config",
        label: "State Backend",
        details: {
          description: "Remote state storage with locking to prevent concurrent modifications",
          configType: "configmap",
          config: {
            backend: "S3 + DynamoDB",
            purpose: "track real-world resources",
            locking: "DynamoDB state lock",
          },
        },
      },
    },
    {
      id: "drift-detection",
      position: { x: 350, y: 200 },
      data: {
        type: "pipeline",
        label: "Drift Detection",
        details: {
          description: "Detects when real infrastructure diverges from declared state",
          config: {
            command: "terraform plan",
            action: "show drift, reconcile",
          },
        },
      },
    },
    // Right: Cloud Provider APIs + Infrastructure
    {
      id: "cloud-api",
      position: { x: 650, y: 50 },
      data: {
        type: "service",
        label: "Cloud Provider APIs",
        details: {
          description: "Provider plugins translate IaC definitions into API calls (AWS, GCP, Azure)",
          config: {
            aws: "AWS Provider",
            gcp: "GCP Provider",
            azure: "Azurerm Provider",
          },
        },
      },
    },
    {
      id: "vpc",
      position: { x: 850, y: 50 },
      data: {
        type: "service",
        label: "VPC",
        details: {
          description: "Virtual Private Cloud with subnets, route tables, and security groups",
          config: {
            cidr: "10.0.0.0/16",
            subnets: "3 AZs",
          },
        },
      },
    },
    {
      id: "eks-cluster",
      position: { x: 850, y: 170 },
      data: {
        type: "container",
        label: "EKS Cluster",
        details: {
          description: "Managed Kubernetes cluster provisioned via Terraform EKS module",
          config: {
            version: "1.29",
            nodeGroups: "2 (m5.large)",
          },
        },
      },
    },
    {
      id: "rds",
      position: { x: 850, y: 290 },
      data: {
        type: "service",
        label: "RDS Instance",
        details: {
          description: "Managed relational database with automated backups and failover",
          config: {
            engine: "PostgreSQL 16",
            instance: "db.r6g.large",
          },
        },
      },
    },
    {
      id: "s3-bucket",
      position: { x: 650, y: 370 },
      data: {
        type: "config",
        label: "S3 Bucket",
        details: {
          description: "Object storage for state files, logs, and static assets",
          configType: "configmap",
          config: {
            name: "my-app-state",
            versioning: "enabled",
          },
        },
      },
    },
    {
      id: "iam-roles",
      position: { x: 850, y: 410 },
      data: {
        type: "security",
        label: "IAM Roles",
        details: {
          description: "Least-privilege IAM roles for services and CI/CD pipelines",
          securityLevel: "least-privilege",
          config: {
            role: "eks-node-role",
            policy: "read-only + ECR pull",
          },
        },
      },
    },
    // Bottom: Plan -> Apply -> Destroy cycle
    {
      id: "terraform-plan",
      position: { x: 150, y: 420 },
      data: {
        type: "pipeline",
        label: "terraform plan",
        details: {
          description: "Preview changes before applying — shows what will be created, changed, or destroyed",
          config: {
            action: "dry-run diff",
            output: "execution plan",
          },
        },
      },
    },
    {
      id: "terraform-apply",
      position: { x: 350, y: 420 },
      data: {
        type: "pipeline",
        label: "terraform apply",
        details: {
          description: "Apply changes to reach the desired state — creates, updates, or deletes resources",
          config: {
            action: "reconcile to desired state",
            output: "state file updated",
          },
        },
      },
    },
    {
      id: "terraform-destroy",
      position: { x: 550, y: 420 },
      data: {
        type: "pipeline",
        label: "terraform destroy",
        details: {
          description: "Tear down all managed infrastructure — used for cleanup or environment teardown",
          config: {
            action: "remove all resources",
            output: "state file emptied",
          },
        },
      },
    },
  ],
  edges: [
    // Code to state backend
    {
      id: "e-tf-state",
      source: "terraform-code",
      target: "state-backend",
      data: { type: "dataFlow", label: "reads/writes state" },
    },
    {
      id: "e-pulumi-state",
      source: "pulumi-code",
      target: "state-backend",
      data: { type: "dataFlow", label: "reads/writes state" },
    },
    // State backend to drift detection
    {
      id: "e-state-drift",
      source: "state-backend",
      target: "drift-detection",
      data: { type: "dataFlow", label: "compare desired vs actual" },
    },
    // State backend to cloud APIs
    {
      id: "e-state-api",
      source: "state-backend",
      target: "cloud-api",
      data: { type: "dataFlow", label: "reconcile" },
    },
    // Cloud APIs to infrastructure
    {
      id: "e-api-vpc",
      source: "cloud-api",
      target: "vpc",
      data: { type: "dataFlow", label: "provision" },
    },
    {
      id: "e-api-eks",
      source: "cloud-api",
      target: "eks-cluster",
      data: { type: "dataFlow", label: "provision" },
    },
    {
      id: "e-api-rds",
      source: "cloud-api",
      target: "rds",
      data: { type: "dataFlow", label: "provision" },
    },
    {
      id: "e-api-s3",
      source: "cloud-api",
      target: "s3-bucket",
      data: { type: "dataFlow", label: "provision" },
    },
    {
      id: "e-api-iam",
      source: "cloud-api",
      target: "iam-roles",
      data: { type: "dataFlow", label: "provision" },
    },
    // Drift to cloud API
    {
      id: "e-drift-api",
      source: "drift-detection",
      target: "cloud-api",
      data: { type: "dataFlow", label: "drift detected" },
    },
    // Plan -> Apply -> Destroy cycle
    {
      id: "e-plan-apply",
      source: "terraform-plan",
      target: "terraform-apply",
      data: { type: "pipeline", label: "approved plan" },
    },
    {
      id: "e-apply-destroy",
      source: "terraform-apply",
      target: "terraform-destroy",
      data: { type: "pipeline", label: "teardown" },
    },
  ],
  steps: [
    { nodeIds: ["terraform-code", "pulumi-code"], edgeIds: [], label: "IaC Code" },
    { nodeIds: ["state-backend"], edgeIds: ["e-tf-state", "e-pulumi-state"], label: "State Backend" },
    { nodeIds: ["terraform-plan", "terraform-apply", "terraform-destroy"], edgeIds: ["e-plan-apply", "e-apply-destroy"], label: "Plan → Apply" },
    { nodeIds: ["cloud-api", "vpc", "eks-cluster", "rds", "s3-bucket", "iam-roles"], edgeIds: ["e-state-api", "e-api-vpc", "e-api-eks", "e-api-rds", "e-api-s3", "e-api-iam"], label: "Cloud Infrastructure" },
    { nodeIds: ["drift-detection"], edgeIds: ["e-state-drift", "e-drift-api"], label: "Drift Detection" },
  ],
  d3Variant: "forceGraph",
};