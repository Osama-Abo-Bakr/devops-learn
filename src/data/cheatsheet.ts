export interface CheatsheetCommand {
  command: string;
  description: string;
  example: string;
}

export interface CheatsheetCategory {
  category: string;
  topic: "docker" | "compose" | "kubernetes";
  commands: CheatsheetCommand[];
}

export const cheatsheetData: CheatsheetCategory[] = [
  // Docker
  {
    category: "Container Management",
    topic: "docker",
    commands: [
      { command: "docker run", description: "Create and start a container", example: "docker run -d -p 8080:80 nginx" },
      { command: "docker ps", description: "List running containers", example: "docker ps -a" },
      { command: "docker stop", description: "Stop a running container", example: "docker stop my-container" },
      { command: "docker rm", description: "Remove a stopped container", example: "docker rm my-container" },
      { command: "docker exec", description: "Execute a command in a running container", example: "docker exec -it my-container sh" },
      { command: "docker logs", description: "View container logs", example: "docker logs -f my-container" },
    ],
  },
  {
    category: "Image Management",
    topic: "docker",
    commands: [
      { command: "docker pull", description: "Pull an image from a registry", example: "docker pull nginx:latest" },
      { command: "docker build", description: "Build an image from a Dockerfile", example: "docker build -t my-app ." },
      { command: "docker images", description: "List local images", example: "docker images" },
      { command: "docker rmi", description: "Remove an image", example: "docker rmi nginx:latest" },
      { command: "docker tag", description: "Tag an image", example: "docker tag my-app registry/my-app:v1" },
    ],
  },
  {
    category: "Volumes & Networks",
    topic: "docker",
    commands: [
      { command: "docker volume create", description: "Create a volume", example: "docker volume create my-data" },
      { command: "docker volume ls", description: "List volumes", example: "docker volume ls" },
      { command: "docker network create", description: "Create a network", example: "docker network create my-net" },
      { command: "docker network ls", description: "List networks", example: "docker network ls" },
    ],
  },
  // Compose
  {
    category: "Compose Basics",
    topic: "compose",
    commands: [
      { command: "docker compose up", description: "Start all services", example: "docker compose up -d" },
      { command: "docker compose down", description: "Stop and remove all containers", example: "docker compose down -v" },
      { command: "docker compose ps", description: "List running services", example: "docker compose ps" },
      { command: "docker compose logs", description: "View service logs", example: "docker compose logs -f web" },
      { command: "docker compose build", description: "Build or rebuild services", example: "docker compose build" },
    ],
  },
  {
    category: "Compose Configuration",
    topic: "compose",
    commands: [
      { command: "docker compose config", description: "Validate and view the compose file", example: "docker compose config" },
      { command: "docker compose exec", description: "Execute a command in a running service", example: "docker compose exec web sh" },
      { command: "docker compose run", description: "Run a one-off command", example: "docker compose run web python manage.py migrate" },
      { command: "docker compose scale", description: "Scale a service", example: "docker compose up --scale web=3" },
    ],
  },
  // Kubernetes
  {
    category: "Pods & Deployments",
    topic: "kubernetes",
    commands: [
      { command: "kubectl get pods", description: "List pods", example: "kubectl get pods -n my-namespace" },
      { command: "kubectl describe pod", description: "Show pod details", example: "kubectl describe pod my-pod" },
      { command: "kubectl create deployment", description: "Create a deployment", example: "kubectl create deployment nginx --image=nginx" },
      { command: "kubectl scale deployment", description: "Scale a deployment", example: "kubectl scale deployment nginx --replicas=3" },
      { command: "kubectl rollout", description: "Manage rollouts", example: "kubectl rollout status deployment/nginx" },
    ],
  },
  {
    category: "Services & Networking",
    topic: "kubernetes",
    commands: [
      { command: "kubectl expose", description: "Expose a deployment as a service", example: "kubectl expose deployment nginx --port=80 --type=LoadBalancer" },
      { command: "kubectl get services", description: "List services", example: "kubectl get svc" },
      { command: "kubectl get ingress", description: "List ingress resources", example: "kubectl get ingress" },
      { command: "kubectl port-forward", description: "Forward a local port to a pod", example: "kubectl port-forward pod/my-pod 8080:80" },
    ],
  },
  {
    category: "Config & Secrets",
    topic: "kubernetes",
    commands: [
      { command: "kubectl create configmap", description: "Create a ConfigMap", example: "kubectl create configmap my-config --from-literal=key=value" },
      { command: "kubectl create secret", description: "Create a secret", example: "kubectl create secret generic my-secret --from-literal=password=s3cur3" },
      { command: "kubectl apply -f", description: "Apply a configuration file", example: "kubectl apply -f deployment.yaml" },
      { command: "kubectl delete -f", description: "Delete resources from a file", example: "kubectl delete -f deployment.yaml" },
    ],
  },
];