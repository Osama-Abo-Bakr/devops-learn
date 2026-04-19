import { Module, Topic, Level } from "@/types";

const modules: Record<Topic, Module> = {
  docker: {
    slug: "docker",
    title: "Docker Fundamentals",
    description:
      "Learn containerization from scratch. Build, ship, and run applications in Docker containers.",
    icon: "docker",
    levels: ["beginner", "intermediate", "advanced"],
    lessons: [
      {
        slug: "containers-101",
        title: "Containers 101",
        module: "docker",
        level: "beginner",
        duration: "30 min",
        diagram: "docker-container-basics",
        challenge: "docker-ps-challenge",
        quiz: "docker-basics-quiz",
        description:
          "Understand what containers are, how they differ from VMs, and run your first container.",
        order: 1,
      },
      {
        slug: "dockerfile-basics",
        title: "Dockerfile Basics",
        module: "docker",
        level: "beginner",
        duration: "35 min",
        diagram: "docker-image-layers",
        quiz: "dockerfile-quiz",
        description:
          "Learn to write Dockerfiles, understand layer caching, and build custom images.",
        order: 2,
      },
      {
        slug: "volumes-networks",
        title: "Volumes and Networks",
        module: "docker",
        level: "beginner",
        duration: "40 min",
        diagram: "docker-volumes-networks",
        quiz: "volumes-networks-quiz",
        description:
          "Persist data with volumes and connect containers with Docker networks.",
        order: 3,
      },
      {
        slug: "multi-stage-builds",
        title: "Multi-Stage Builds",
        module: "docker",
        level: "intermediate",
        duration: "30 min",
        diagram: "docker-multi-stage-build",
        quiz: "multi-stage-quiz",
        description:
          "Optimize images with multi-stage builds and reduce final image size.",
        order: 4,
      },
      {
        slug: "docker-security",
        title: "Docker Security",
        module: "docker",
        level: "intermediate",
        duration: "35 min",
        diagram: "docker-security",
        quiz: "docker-security-quiz",
        description:
          "Secure your containers: least privilege, image scanning, and runtime protection.",
        order: 5,
      },
      {
        slug: "production-patterns",
        title: "Production Patterns",
        module: "docker",
        level: "advanced",
        duration: "45 min",
        diagram: "docker-production-patterns",
        quiz: "production-patterns-quiz",
        description:
          "Best practices for running containers in production: health checks, logging, and resource limits.",
        order: 6,
      },
      {
        slug: "docker-troubleshooting",
        title: "Docker Troubleshooting",
        module: "docker",
        level: "intermediate",
        duration: "35 min",
        diagram: "docker-troubleshooting",
        quiz: "docker-troubleshooting-quiz",
        description:
          "Diagnose and fix common Docker issues: build failures, runtime errors, networking problems, and performance debugging.",
        order: 7,
      },
    ],
  },

  compose: {
    slug: "compose",
    title: "Docker Compose",
    description:
      "Orchestrate multi-container applications with Docker Compose.",
    icon: "compose",
    levels: ["beginner", "intermediate", "advanced"],
    lessons: [
      {
        slug: "yaml-basics",
        title: "Compose YAML Basics",
        module: "compose",
        level: "beginner",
        duration: "25 min",
        diagram: "yaml-basics",
        quiz: "yaml-basics-quiz",
        description:
          "Write your first docker-compose.yml and understand the structure of Compose files.",
        order: 1,
      },
      {
        slug: "multi-service",
        title: "Multi-Service Stacks",
        module: "compose",
        level: "beginner",
        duration: "35 min",
        diagram: "compose-multi-service",
        quiz: "multi-service-quiz",
        description:
          "Connect multiple services: web app, database, and cache in a single stack.",
        order: 2,
      },
      {
        slug: "compose-networks-volumes",
        title: "Networks and Volumes",
        module: "compose",
        level: "intermediate",
        duration: "30 min",
        diagram: "compose-networks-volumes",
        quiz: "compose-networks-volumes-quiz",
        description:
          "Configure networks and volumes in Compose for service isolation and data persistence.",
        order: 3,
      },
      {
        slug: "compose-env-scaling",
        title: "Env Vars and Scaling",
        module: "compose",
        level: "intermediate",
        duration: "30 min",
        diagram: "compose-env-scaling",
        quiz: "compose-env-scaling-quiz",
        description:
          "Use .env files, variable substitution, and scale services horizontally.",
        order: 4,
      },
      {
        slug: "compose-production",
        title: "Production Configs",
        module: "compose",
        level: "advanced",
        duration: "40 min",
        diagram: "compose-production",
        quiz: "compose-production-quiz",
        description:
          "Override files, health checks, and deployment strategies for production Compose stacks.",
        order: 5,
      },
    ],
  },

  kubernetes: {
    slug: "kubernetes",
    title: "Kubernetes Core",
    description:
      "Master container orchestration with Kubernetes: pods, deployments, services, and more.",
    icon: "kubernetes",
    levels: ["beginner", "intermediate", "advanced"],
    lessons: [
      {
        slug: "pods-deployments",
        title: "Pods and Deployments",
        module: "kubernetes",
        level: "beginner",
        duration: "40 min",
        diagram: "k8s-pods-deployments",
        quiz: "k8s-pods-deployments-quiz",
        description:
          "Understand the smallest deployable unit in Kubernetes and manage replicas with Deployments.",
        order: 1,
      },
      {
        slug: "services-ingress",
        title: "Services and Ingress",
        module: "kubernetes",
        level: "beginner",
        duration: "35 min",
        diagram: "k8s-services-ingress",
        quiz: "k8s-services-ingress-quiz",
        description:
          "Expose your applications with Services and route external traffic with Ingress.",
        order: 2,
      },
      {
        slug: "configmaps-secrets",
        title: "ConfigMaps and Secrets",
        module: "kubernetes",
        level: "intermediate",
        duration: "30 min",
        diagram: "k8s-configmaps-secrets",
        quiz: "k8s-configmaps-secrets-quiz",
        description:
          "Decouple configuration from images and manage sensitive data with Secrets.",
        order: 3,
      },
      {
        slug: "hpa-scaling",
        title: "HPA and Scaling",
        module: "kubernetes",
        level: "intermediate",
        duration: "30 min",
        diagram: "hpa-scaling",
        quiz: "hpa-scaling-quiz",
        description:
          "Automatically scale your workloads with the Horizontal Pod Autoscaler.",
        order: 4,
      },
      {
        slug: "rbac-network-policies",
        title: "RBAC and Network Policies",
        module: "kubernetes",
        level: "advanced",
        duration: "45 min",
        diagram: "rbac-network-policies",
        quiz: "rbac-network-policies-quiz",
        description:
          "Control access with RBAC and restrict network traffic with NetworkPolicies.",
        order: 5,
      },
      {
        slug: "statefulsets-jobs",
        title: "StatefulSets and Jobs",
        module: "kubernetes",
        level: "advanced",
        duration: "40 min",
        diagram: "k8s-statefulsets-jobs",
        quiz: "k8s-statefulsets-jobs-quiz",
        description:
          "Run stateful workloads with StatefulSets and batch processes with Jobs and CronJobs.",
        order: 6,
      },
    ],
  },

  devops: {
    slug: "devops",
    title: "Advanced DevOps",
    description:
      "CI/CD pipelines, Helm charts, monitoring, and security best practices.",
    icon: "devops",
    levels: ["intermediate", "advanced"],
    lessons: [
      {
        slug: "cicd-containers",
        title: "CI/CD with Containers",
        module: "devops",
        level: "intermediate",
        duration: "40 min",
        diagram: "devops-cicd-pipeline",
        quiz: "cicd-quiz",
        description:
          "Build and deploy container images in CI/CD pipelines with GitHub Actions and GitLab CI.",
        order: 1,
      },
      {
        slug: "helm-charts",
        title: "Helm Charts",
        module: "devops",
        level: "intermediate",
        duration: "35 min",
        diagram: "helm-charts",
        quiz: "helm-quiz",
        description:
          "Package, template, and deploy Kubernetes applications with Helm.",
        order: 2,
      },
      {
        slug: "monitoring-observability",
        title: "Monitoring and Observability",
        module: "devops",
        level: "advanced",
        duration: "45 min",
        diagram: "monitoring-observability",
        quiz: "monitoring-quiz",
        description:
          "Set up Prometheus metrics, Grafana dashboards, and distributed tracing.",
        order: 3,
      },
      {
        slug: "security-best-practices",
        title: "Security Best Practices",
        module: "devops",
        level: "advanced",
        duration: "40 min",
        diagram: "security-best-practices",
        quiz: "security-best-practices-quiz",
        description:
          "Image signing, vulnerability scanning, runtime security, and supply chain hardening.",
        order: 4,
      },
      {
        slug: "advanced-cicd-pipelines",
        title: "Advanced CI/CD Pipelines",
        module: "devops",
        level: "advanced",
        duration: "50 min",
        diagram: "advanced-cicd-pipeline",
        quiz: "advanced-cicd-quiz",
        description:
          "Multi-stage pipelines, canary deployments, blue/green strategies, approval gates, and automated rollback.",
        order: 5,
      },
      {
        slug: "cicd-at-scale-netflix-meta",
        title: "CI/CD at Scale: Netflix & Meta",
        module: "devops",
        level: "advanced",
        duration: "45 min",
        diagram: "cicd-at-scale-netflix-meta",
        quiz: "cicd-at-scale-quiz",
        description:
          "How Netflix (Spinnaker, Chaos Monkey, Kayenta) and Meta (Buck2, Gatekeeper, FB Trench) deploy at massive scale.",
        order: 6,
      },
      {
        slug: "container-orchestration-scale",
        title: "Container Orchestration at Scale",
        module: "devops",
        level: "advanced",
        duration: "50 min",
        diagram: "container-orchestration-scale",
        quiz: "container-orchestration-scale-quiz",
        description:
          "Multi-cluster Kubernetes, service mesh, autoscaling, ConfigMaps, Secrets, and disaster recovery patterns.",
        order: 7,
      },
      {
        slug: "gitops-argocd",
        title: "GitOps and ArgoCD",
        module: "devops",
        level: "intermediate",
        duration: "40 min",
        diagram: "gitops-argocd",
        quiz: "gitops-argocd-quiz",
        description:
          "Declarative GitOps with ArgoCD: sync clusters from Git, handle drift, and manage multi-env deployments.",
        order: 8,
      },
      {
        slug: "infrastructure-as-code",
        title: "Infrastructure as Code",
        module: "devops",
        level: "intermediate",
        duration: "40 min",
        diagram: "infrastructure-as-code",
        quiz: "infrastructure-as-code-quiz",
        description:
          "Manage infrastructure declaratively with Terraform and Pulumi: state, modules, and container infrastructure.",
        order: 9,
      },
    ],
  },
};

export function getModule(slug: Topic): Module {
  return modules[slug];
}

export function getAllModules(): Module[] {
  return Object.values(modules);
}

export function getLessonsByLevel(
  topic: Topic,
  level: Level,
): Module["lessons"] {
  return modules[topic].lessons.filter((l) => l.level === level);
}

export function getLesson(topic: Topic, slug: string) {
  return modules[topic].lessons.find((l) => l.slug === slug);
}

export default modules;