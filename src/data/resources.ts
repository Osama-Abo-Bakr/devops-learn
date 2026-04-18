export type ResourceType = "video" | "article" | "docs" | "course";

export interface Resource {
  title: string;
  url: string;
  type: ResourceType;
  source: string;
}

export interface TopicResources {
  topic: string;
  resources: Resource[];
}

const resources: Record<string, Resource[]> = {
  docker: [
    // Videos
    {
      title: "Docker Tutorial for Beginners — Full Course",
      url: "https://www.youtube.com/watch?v=fqMOX6JJcbE",
      type: "video",
      source: "FreeCodeCamp",
    },
    {
      title: "Docker in 100 Seconds",
      url: "https://www.youtube.com/watch?v=Gjnup-PuquQ",
      type: "video",
      source: "Fireship",
    },
    {
      title: "Docker Tutorial for Beginners — Full Course (3 Hours)",
      url: "https://www.youtube.com/watch?v=3c-iBn73dDE",
      type: "video",
      source: "TechWorld with Nana",
    },
    {
      title: "Docker Networking — Deep Dive",
      url: "https://www.youtube.com/watch?v=ue7lfh9Bjb0",
      type: "video",
      source: "Bret Fisher",
    },
    // Articles
    {
      title: "The Ultimate Guide to Docker: How Containers Work",
      url: "https://medium.com/@kaveeshadilshankd23/the-ultimate-guide-to-docker-how-containers-work-and-why-developers-use-them-db66474abdb1",
      type: "article",
      source: "Medium",
    },
    {
      title: "Advanced Docker: Multi-Stage Builds and Image Optimization",
      url: "https://medium.com/@smahak59/advanced-docker-multi-stage-builds-and-image-optimization-3fc11a7ecf4c",
      type: "article",
      source: "Medium",
    },
    {
      title: "How to Make Your Docker Containers More Secure",
      url: "https://medium.com/@yves.soete_10721/how-to-make-your-docker-containers-more-secure-in-2024-3b7a4c012fb8",
      type: "article",
      source: "Medium",
    },
    {
      title: "Docker Official Documentation",
      url: "https://docs.docker.com/",
      type: "docs",
      source: "Docker",
    },
  ],

  compose: [
    // Videos
    {
      title: "Ultimate Docker Compose Tutorial",
      url: "https://www.youtube.com/watch?v=SXwC9fSwct8",
      type: "video",
      source: "FreeCodeCamp",
    },
    {
      title: "Docker Compose in 12 Minutes",
      url: "https://www.youtube.com/watch?v=Qw9zlE3t8Ko",
      type: "video",
      source: "Jake Wright",
    },
    {
      title: "Docker Compose for Dev and Prod",
      url: "https://www.youtube.com/watch?v=sY7yFFNBDxY",
      type: "video",
      source: "Bret Fisher",
    },
    // Articles
    {
      title: "Docker Compose: A Beginner's Guide to Multi-Tier Apps",
      url: "https://medium.com/@kenneth.oshogwe/docker-for-everyone-part-4-docker-compose-a-beginners-guide-to-running-multi-tier-applications-13f5cef1fc7e",
      type: "article",
      source: "Medium",
    },
    {
      title: "Docker & Docker Compose: Powerful Tools for Modern Development",
      url: "https://medium.com/@venkatsunilm/a-beginners-introduction-to-docker-6faa40afddb9",
      type: "article",
      source: "Medium",
    },
    {
      title: "Docker Compose Official Docs",
      url: "https://docs.docker.com/compose/",
      type: "docs",
      source: "Docker",
    },
  ],

  kubernetes: [
    // Videos
    {
      title: "Kubernetes Tutorial for Beginners — Full Course (4 Hours)",
      url: "https://www.youtube.com/watch?v=X48VuDVv0do",
      type: "video",
      source: "TechWorld with Nana",
    },
    {
      title: "Kubernetes in 100 Seconds",
      url: "https://www.youtube.com/watch?v=PziYflu8cB8",
      type: "video",
      source: "Fireship",
    },
    {
      title: "Kubernetes Course — Full Tutorial for Beginners",
      url: "https://www.youtube.com/watch?v=d6WC5n9G_sM",
      type: "video",
      source: "FreeCodeCamp",
    },
    {
      title: "Kubernetes Services Explained",
      url: "https://www.youtube.com/watch?v=T4Z7visMM4E",
      type: "video",
      source: "TechWorld with Nana",
    },
    // Articles
    {
      title: "Kubernetes: The Ultimate Guide for Beginners",
      url: "https://medium.com/@vvk.sharma.1210/kubernetes-the-ultimate-guide-for-beginners-42ac6859b675",
      type: "article",
      source: "Medium",
    },
    {
      title: "Kubernetes RBAC — A Gentle Introduction",
      url: "https://medium.com/@kumareshv/kubernetes-rbac-a-gentle-introduction-a9e8a35be3d4",
      type: "article",
      source: "Medium",
    },
    {
      title: "Kubernetes Official Documentation",
      url: "https://kubernetes.io/docs/",
      type: "docs",
      source: "Kubernetes",
    },
    {
      title: "Kubernetes Academy — Free Courses",
      url: "https://kube.academy/paths/kubernetes-core-concepts",
      type: "course",
      source: "VMware",
    },
  ],

  devops: [
    // Videos
    {
      title: "DevOps Engineering Course for Beginners",
      url: "https://www.youtube.com/watch?v=j5Zsa_eOXeY",
      type: "video",
      source: "FreeCodeCamp",
    },
    {
      title: "CI/CD Pipeline Explained",
      url: "https://www.youtube.com/watch?v=AknbizcLq4w",
      type: "video",
      source: "TechWorld with Nana",
    },
    {
      title: "What is Helm in Kubernetes?",
      url: "https://www.youtube.com/watch?v=IQxjkwRKtAc",
      type: "video",
      source: "That DevOps Guy",
    },
    {
      title: "Setup Prometheus Monitoring on Kubernetes",
      url: "https://www.youtube.com/watch?v=QoDqxm7ybLc",
      type: "video",
      source: "TechWorld with Nana",
    },
    // Articles
    {
      title: "Building a Production-Ready CI/CD Pipeline with Docker and GitHub Actions",
      url: "https://medium.com/@vokeogigbah/building-a-production-ready-ci-cd-pipeline-from-zero-to-docker-and-github-actions-707d9aa38db5",
      type: "article",
      source: "Medium",
    },
    {
      title: "Helm Chart Tutorial: Beginner to Expert Guide",
      url: "https://medium.com/@kaungmyatthwin/helm-chart-tutorial-beginner-to-expert-guide-66c8ac7824ee",
      type: "article",
      source: "Medium",
    },
    {
      title: "Docker Hardening Best Practices: Securing Containers in Production",
      url: "https://redfoxsecurity.medium.com/docker-hardening-best-practices-a-complete-guide-to-securing-containers-in-production-789b1a0c5afd",
      type: "article",
      source: "Medium",
    },
    {
      title: "Helm Official Documentation",
      url: "https://helm.sh/docs/",
      type: "docs",
      source: "Helm",
    },
  ],
};

export function getResourcesForTopic(topic: string): Resource[] {
  return resources[topic] || [];
}