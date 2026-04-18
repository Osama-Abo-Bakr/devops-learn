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
      url: "https://www.youtube.com/watch?v=GjnupPAuT8g",
      type: "video",
      source: "Fireship",
    },
    {
      title: "Learn Docker in 2 Hours",
      url: "https://www.youtube.com/watch?v=5_n8f1Qbh1E",
      type: "video",
      source: "TechWorld with Nana",
    },
    {
      title: "Docker Networking — Complete Guide",
      url: "https://www.youtube.com/watch?v=OU6xwh0c8s4",
      type: "video",
      source: "Bret Fisher",
    },
    // Articles
    {
      title: "Docker Container: An Ultimate Guide",
      url: "https://medium.com/swlh/a-complete-guide-to-docker-9d6715f3c830",
      type: "article",
      source: "Medium",
    },
    {
      title: "Docker Multi-Stage Builds in Practice",
      url: "https://medium.com/swlh/docker-multi-stage-builds-for-production-8b1c297bf43a",
      type: "article",
      source: "Medium",
    },
    {
      title: "Docker Security Best Practices",
      url: "https://medium.com/swlh/docker-security-best-practices-9e45657a7a7e",
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
      title: "Docker Compose Tutorial — Full Course",
      url: "https://www.youtube.com/watch?v=DM65QlJLqhg",
      type: "video",
      source: "FreeCodeCamp",
    },
    {
      title: "Docker Compose in 12 Minutes",
      url: "https://www.youtube.com/watch?v=Qw9zlQkX3Ls",
      type: "video",
      source: "TechLab",
    },
    {
      title: "Docker Compose for Dev and Prod",
      url: "https://www.youtube.com/watch?v=4jHB2q3VpUQ",
      type: "video",
      source: "Bret Fisher",
    },
    // Articles
    {
      title: "Docker Compose: A Gentle Intro",
      url: "https://medium.com/swlh/docker-compose-a-gentle-intro-cc7eb7f8b3d9",
      type: "article",
      source: "Medium",
    },
    {
      title: "Multi-Stage Builds and Docker Compose",
      url: "https://medium.com/swlh/docker-compose-for-development-6fc5eb6e5bb3",
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
      title: "Kubernetes Tutorial for Beginners — Full Course",
      url: "https://www.youtube.com/watch?v=X48VuDVv0do",
      type: "video",
      source: "FreeCodeCamp",
    },
    {
      title: "Kubernetes in 100 Seconds",
      url: "https://www.youtube.com/watch?v=PziYJ8D-QbQ",
      type: "video",
      source: "Fireship",
    },
    {
      title: "Kubernetes Explained in 5 Minutes",
      url: "https://www.youtube.com/watch?v=4q47tByfo2o",
      type: "video",
      source: "TechWorld with Nana",
    },
    {
      title: "Kubernetes Services and Ingress Explained",
      url: "https://www.youtube.com/watch?v=5L2v3s6KdDM",
      type: "video",
      source: "TechWorld with Nana",
    },
    // Articles
    {
      title: "Kubernetes: An Ultimate Guide for Beginners",
      url: "https://medium.com/swlh/kubernetes-a-complete-guide-for-beginners-8c8c4e7f7c4d",
      type: "article",
      source: "Medium",
    },
    {
      title: "Kubernetes RBAC Explained",
      url: "https://medium.com/swlh/kubernetes-rbac-explained-8c7f8c7f8c7f",
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
      url: "https://kube.academy/",
      type: "course",
      source: "VMware",
    },
  ],

  devops: [
    // Videos
    {
      title: "DevOps Engineering Course for Beginners",
      url: "https://www.youtube.com/watch?v=5K1R5mQmWc4",
      type: "video",
      source: "FreeCodeCamp",
    },
    {
      title: "CI/CD Pipeline Explained",
      url: "https://www.youtube.com/watch?v=scEDqtr3NJo",
      type: "video",
      source: "TechWorld with Nana",
    },
    {
      title: "Helm Charts Tutorial for Beginners",
      url: "https://www.youtube.com/watch?v=5jt78eqQMCU",
      type: "video",
      source: "FreeCodeCamp",
    },
    {
      title: "Prometheus + Grafana — Full Monitoring Stack",
      url: "https://www.youtube.com/watch?v=7gDfbW7M5Yc",
      type: "video",
      source: "TechWorld with Nana",
    },
    // Articles
    {
      title: "CI/CD with Docker and GitHub Actions",
      url: "https://medium.com/swlh/ci-cd-with-docker-and-github-actions-7c8f3c8f3c8f",
      type: "article",
      source: "Medium",
    },
    {
      title: "Helm Charts: A Complete Guide",
      url: "https://medium.com/swlh/helm-charts-a-complete-guide-8c8f4e7f7c4d",
      type: "article",
      source: "Medium",
    },
    {
      title: "Container Security Best Practices",
      url: "https://medium.com/swlh/container-security-best-practices-8c8f4e7f7c4d",
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