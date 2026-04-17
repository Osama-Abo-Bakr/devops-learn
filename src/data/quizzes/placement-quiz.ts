import type { Quiz } from "@/types";

export const placementQuiz: Quiz = {
  id: "placement-quiz",
  title: "DevOps Level Placement Quiz",
  lessonSlug: "placement",
  questions: [
    {
      id: "pq1",
      question: "What is a Docker container?",
      options: [
        "A type of virtual machine",
        "A lightweight, standalone package that runs software consistently across environments",
        "A Docker image stored on disk",
        "A Kubernetes pod",
      ],
      correctIndex: 1,
      explanation:
        "A container is a lightweight, standalone package that includes everything needed to run software. It's not a VM — containers share the host kernel.",
    },
    {
      id: "pq2",
      question: "Which command starts a container in the background?",
      options: [
        "docker start -b nginx",
        "docker run -d nginx",
        "docker exec -d nginx",
        "docker create --bg nginx",
      ],
      correctIndex: 1,
      explanation: "The -d flag runs a container in detached (background) mode.",
    },
    {
      id: "pq3",
      question: "What does a Docker Compose file typically use for configuration?",
      options: [
        "JSON",
        "XML",
        "YAML",
        "TOML",
      ],
      correctIndex: 2,
      explanation:
        "Docker Compose files use YAML format (docker-compose.yml) to define services, networks, and volumes.",
    },
    {
      id: "pq4",
      question: "What is the smallest deployable unit in Kubernetes?",
      options: [
        "Container",
        "Pod",
        "Deployment",
        "Node",
      ],
      correctIndex: 1,
      explanation:
        "A Pod is the smallest deployable unit in Kubernetes. It contains one or more containers that share storage and network.",
    },
    {
      id: "pq5",
      question: "How do you persist data in Docker beyond a container's lifetime?",
      options: [
        "Use environment variables",
        "Use Docker volumes",
        "Restart the container regularly",
        "Use a larger container image",
      ],
      correctIndex: 1,
      explanation:
        "Docker volumes are the recommended way to persist data. They survive container restarts and removals.",
    },
    {
      id: "pq6",
      question: "What does `docker-compose up` do?",
      options: [
        "Updates Docker Compose to the latest version",
        "Builds, (re)creates, starts, and attaches to containers for all services",
        "Stops all running containers",
        "Deletes unused Docker images",
      ],
      correctIndex: 1,
      explanation:
        "`docker-compose up` builds images if needed, creates containers, starts them, and attaches to their output.",
    },
    {
      id: "pq7",
      question: "What Kubernetes object exposes pods to network traffic?",
      options: [
        "Pod",
        "ReplicaSet",
        "Service",
        "Namespace",
      ],
      correctIndex: 2,
      explanation:
        "A Service in Kubernetes exposes a set of pods to network traffic, providing a stable IP and DNS name.",
    },
    {
      id: "pq8",
      question: "What is a multi-stage build in Docker?",
      options: [
        "Running multiple containers at once",
        "Using multiple FROM instructions to create smaller final images",
        "Building images on multiple machines",
        "A CI/CD pipeline with Docker",
      ],
      correctIndex: 1,
      explanation:
        "Multi-stage builds use multiple FROM instructions to create intermediate build stages, then copy only needed artifacts to the final image, reducing image size.",
    },
    {
      id: "pq9",
      question: "What is a Kubernetes Ingress?",
      options: [
        "An internal service discovery mechanism",
        "An API object that manages external access to services (typically HTTP)",
        "A type of pod that handles networking",
        "A way to run containers inside Kubernetes",
      ],
      correctIndex: 1,
      explanation:
        "Ingress is an API object that provides HTTP/HTTPS routing, SSL termination, and name-based virtual hosting for services.",
    },
    {
      id: "pq10",
      question: "Which Docker command removes all stopped containers?",
      options: [
        "docker rm --all",
        "docker container prune",
        "docker clean",
        "docker system reset",
      ],
      correctIndex: 1,
      explanation:
        "`docker container prune` removes all stopped containers. `docker system prune` is broader and removes unused data.",
    },
  ],
};