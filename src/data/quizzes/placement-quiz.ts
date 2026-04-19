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
    {
      id: "pq11",
      question:
        "How does Docker allow containers on the same custom network to communicate?",
      options: [
        "By IP address only",
        "By container name as a DNS hostname",
        "By sharing the same IP address",
        "Through the host's localhost",
      ],
      correctIndex: 1,
      explanation:
        "Docker's built-in DNS resolves container names to IPs on custom networks, so containers can communicate using each other's names instead of hardcoding IPs.",
    },
    {
      id: "pq12",
      question:
        "Which flag drops all Linux capabilities from a container and adds back only the ones it needs?",
      options: [
        "--security-opt no-new-privileges",
        "--cap-drop ALL --cap-add NET_BIND_SERVICE",
        "--privileged=false",
        "--isolation hyperv",
      ],
      correctIndex: 1,
      explanation:
        "`--cap-drop ALL` removes all kernel capabilities, then `--cap-add` adds back only what's needed. This follows the principle of least privilege, reducing the container's attack surface.",
    },
    {
      id: "pq13",
      question:
        "Which .dockerignore pattern excludes all .md files but keeps README.md?",
      options: [
        "*.md",
        "*.md\n!README.md",
        "README.md",
        "docs/**/*.md",
      ],
      correctIndex: 1,
      explanation:
        "In .dockerignore, `*.md` excludes all markdown files, and `!README.md` adds an exception to keep README.md. Lines starting with `!` negate previous patterns.",
    },
    {
      id: "pq14",
      question: "What is the purpose of docker-compose.override.yml?",
      options: [
        "It replaces docker-compose.yml entirely",
        "It provides local environment overrides that are merged with docker-compose.yml",
        "It disables all services in the compose file",
        "It enforces production-only settings",
      ],
      correctIndex: 1,
      explanation:
        "docker-compose.override.yml is automatically merged with docker-compose.yml for local development. You can add volume mounts, env vars, or command overrides without modifying the main file.",
    },
    {
      id: "pq15",
      question:
        "In a docker-compose.yml, what does the healthcheck configuration `test: [\"CMD\", \"curl\", \"-f\", \"http://localhost:8080/health\"]` do?",
      options: [
        "It runs a one-time check before the container starts",
        "It periodically checks if the service is healthy and marks the container as unhealthy on failure",
        "It replaces the container's CMD with the health check command",
        "It sends health data to Docker Hub",
      ],
      correctIndex: 1,
      explanation:
        "Compose healthchecks run periodically (every 30s by default) to verify the service is responsive. If the check fails `retries` times, the container is marked unhealthy. Other services using `depends_on: condition: service_healthy` will wait.",
    },
    {
      id: "pq16",
      question:
        "In Docker Compose, what does `depends_on: { db: { condition: service_healthy } }` ensure?",
      options: [
        "The db service starts before the dependent service AND is passing its health check",
        "The db service has a health check defined",
        "The dependent service connects to the db service",
        "The db service is restarted if it crashes",
      ],
      correctIndex: 0,
      explanation:
        "The long-form `depends_on` with `condition: service_healthy` ensures the dependent service waits until db is not just started, but also passing its health check. Without this, the app might start before the database is ready to accept connections.",
    },
    {
      id: "pq17",
      question:
        "What is the key difference between a StatefulSet and a Deployment?",
      options: [
        "StatefulSets use replicas; Deployments do not",
        "StatefulSets provide stable network identities and persistent storage per pod; Deployments do not",
        "StatefulSets can only run one replica; Deployments run many",
        "Deployments are for production; StatefulSets are for testing",
      ],
      correctIndex: 1,
      explanation:
        "StatefulSets give each pod a stable hostname (pod-0, pod-1) and a persistent volume that stays with it across reschedules. Deployments treat all pods as identical and interchangeable.",
    },
    {
      id: "pq18",
      question:
        "What does a Kubernetes Ingress resource do?",
      options: [
        "It creates pods inside the cluster",
        "It manages external HTTP/HTTPS access to services with routing rules and TLS termination",
        "It monitors cluster health",
        "It stores configuration data for containers",
      ],
      correctIndex: 1,
      explanation:
        "Ingress provides HTTP/HTTPS routing rules, path-based routing, TLS termination, and name-based virtual hosting. It requires an Ingress controller (like nginx-ingress) to actually process the rules.",
    },
    {
      id: "pq19",
      question:
        "What is the primary benefit of a CI/CD pipeline for containerized applications?",
      options: [
        "It eliminates the need for testing",
        "It automates building, testing, and deploying container images, reducing manual errors and enabling rapid delivery",
        "It replaces Docker with a custom build system",
        "It only works with Kubernetes",
      ],
      correctIndex: 1,
      explanation:
        "CI/CD pipelines automate the entire delivery process — from code commit through build, test, security scanning, and deployment. This reduces human error, ensures consistency, and enables rapid, reliable releases.",
    },
    {
      id: "pq20",
      question: "What is the core principle of GitOps?",
      options: [
        "All code must be written in Git",
        "Git is the single source of truth for declarative infrastructure and applications, with automated sync to the target environment",
        "Developers must use GitHub exclusively",
        "Git replaces all configuration files with code",
      ],
      correctIndex: 1,
      explanation:
        "GitOps uses Git as the single source of truth. Desired state is declared in Git, and automated agents (like ArgoCD) continuously sync the live environment to match. Any drift is detected and reconciled.",
    },
    {
      id: "pq21",
      question:
        "Your team runs a web application in Docker. After a server reboot, all containers are stopped and the web app is offline. What should you have configured to prevent this?",
      options: [
        "Use `docker start --restart=always`",
        "Set `restart: unless-stopped` in the container run command or Compose file",
        "Run containers in privileged mode",
        "Store container state in a volume",
      ],
      correctIndex: 1,
      explanation:
        "`restart: unless-stopped` or `restart: always` ensures Docker restarts the container automatically after daemon restart or server reboot. The `unless-stopped` variant means it won't restart if you manually stopped it.",
    },
    {
      id: "pq22",
      question:
        "A Kubernetes Deployment creates 3 pods, but `kubectl get pods` shows 2 running and 1 in `ImagePullBackOff` state. What is the most likely cause?",
      options: [
        "The cluster has insufficient CPU resources",
        "The container image doesn't exist or credentials are missing to pull from a private registry",
        "The Service is not pointing to the pods",
        "The Ingress controller is down",
      ],
      correctIndex: 1,
      explanation:
        "`ImagePullBackOff` means Kubernetes cannot pull the container image — either the image name is wrong, the registry requires authentication (missing imagePullSecrets), or the image tag doesn't exist.",
    },
  ]
};