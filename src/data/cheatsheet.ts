export interface CheatsheetCommand {
  command: string;
  description: string;
  example: string;
}

export interface CheatsheetCategory {
  category: string;
  topic: "docker" | "compose" | "kubernetes" | "devops";
  commands: CheatsheetCommand[];
}

export const cheatsheetData: CheatsheetCategory[] = [
  // Docker — Container Management
  {
    category: "Container Management",
    topic: "docker",
    commands: [
      { command: "docker run", description: "Create and start a container", example: "docker run -d -p 8080:80 --name web nginx" },
      { command: "docker ps", description: "List running containers", example: "docker ps -a" },
      { command: "docker stop", description: "Stop a running container", example: "docker stop my-container" },
      { command: "docker start", description: "Start a stopped container", example: "docker start my-container" },
      { command: "docker restart", description: "Restart a container", example: "docker restart my-container" },
      { command: "docker rm", description: "Remove a stopped container", example: "docker rm -f my-container" },
      { command: "docker exec", description: "Execute a command in a running container", example: "docker exec -it my-container sh" },
      { command: "docker logs", description: "View container logs", example: "docker logs -f --tail 100 my-container" },
      { command: "docker inspect", description: "Detailed container info (JSON)", example: "docker inspect my-container" },
      { command: "docker top", description: "Show processes in a container", example: "docker top my-container" },
      { command: "docker stats", description: "Live resource usage stats", example: "docker stats" },
      { command: "docker cp", description: "Copy files between host and container", example: "docker cp file.txt my-container:/app/" },
      { command: "docker rename", description: "Rename a container", example: "docker rename old-name new-name" },
      { command: "docker update", description: "Update container resource limits", example: "docker update --memory 512m my-container" },
    ],
  },
  {
    category: "Image Management",
    topic: "docker",
    commands: [
      { command: "docker pull", description: "Pull an image from a registry", example: "docker pull nginx:1.25-alpine" },
      { command: "docker build", description: "Build an image from a Dockerfile", example: "docker build -t my-app:v1 ." },
      { command: "docker images", description: "List local images", example: "docker images --filter dangling=true" },
      { command: "docker rmi", description: "Remove an image", example: "docker rmi nginx:latest" },
      { command: "docker tag", description: "Tag an image for a registry", example: "docker tag my-app:v1 registry.io/my-app:v1" },
      { command: "docker push", description: "Push an image to a registry", example: "docker push registry.io/my-app:v1" },
      { command: "docker save", description: "Save image to tar archive", example: "docker save -o app.tar my-app:v1" },
      { command: "docker load", description: "Load image from tar archive", example: "docker load -i app.tar" },
      { command: "docker history", description: "Show image layer history", example: "docker history my-app:v1" },
      { command: "docker image prune", description: "Remove unused images", example: "docker image prune -a" },
    ],
  },
  {
    category: "Volumes & Data",
    topic: "docker",
    commands: [
      { command: "docker volume create", description: "Create a named volume", example: "docker volume create pg-data" },
      { command: "docker volume ls", description: "List all volumes", example: "docker volume ls" },
      { command: "docker volume inspect", description: "Volume details and mount path", example: "docker volume inspect pg-data" },
      { command: "docker volume rm", description: "Remove a volume", example: "docker volume rm pg-data" },
      { command: "docker volume prune", description: "Remove all unused volumes", example: "docker volume prune" },
    ],
  },
  {
    category: "Networks",
    topic: "docker",
    commands: [
      { command: "docker network create", description: "Create a custom network", example: "docker network create --driver bridge my-net" },
      { command: "docker network ls", description: "List networks", example: "docker network ls" },
      { command: "docker network inspect", description: "Network details and connected containers", example: "docker network inspect bridge" },
      { command: "docker network connect", description: "Connect a container to a network", example: "docker network connect my-net my-container" },
      { command: "docker network disconnect", description: "Disconnect container from network", example: "docker network disconnect my-net my-container" },
      { command: "docker network prune", description: "Remove unused networks", example: "docker network prune" },
    ],
  },
  {
    category: "Dockerfile & Build",
    topic: "docker",
    commands: [
      { command: "docker build", description: "Build image from Dockerfile", example: "docker build -t app:latest --no-cache ." },
      { command: "docker build --build-arg", description: "Build with build arguments", example: "docker build --build-arg NODE_ENV=prod -t app ." },
      { command: "docker build --target", description: "Build specific stage (multi-stage)", example: "docker build --target builder -t app-builder ." },
      { command: "docker buildx build", description: "Build with BuildKit (multi-platform)", example: "docker buildx build --platform linux/amd64,linux/arm64 -t app ." },
    ],
  },
  {
    category: "System & Cleanup",
    topic: "docker",
    commands: [
      { command: "docker system df", description: "Show disk usage", example: "docker system df -v" },
      { command: "docker system prune", description: "Remove unused data", example: "docker system prune -a --volumes" },
      { command: "docker info", description: "Display system info", example: "docker info" },
      { command: "docker version", description: "Show Docker version", example: "docker version" },
    ],
  },

  // Docker Compose
  {
    category: "Compose Lifecycle",
    topic: "compose",
    commands: [
      { command: "docker compose up", description: "Start all services", example: "docker compose up -d" },
      { command: "docker compose down", description: "Stop and remove containers", example: "docker compose down -v --rmi all" },
      { command: "docker compose start", description: "Start stopped services", example: "docker compose start" },
      { command: "docker compose stop", description: "Stop running services", example: "docker compose stop" },
      { command: "docker compose restart", description: "Restart services", example: "docker compose restart web" },
      { command: "docker compose pause", description: "Pause services", example: "docker compose pause db" },
      { command: "docker compose unpause", description: "Unpause services", example: "docker compose unpause db" },
    ],
  },
  {
    category: "Compose Operations",
    topic: "compose",
    commands: [
      { command: "docker compose ps", description: "List running services", example: "docker compose ps" },
      { command: "docker compose logs", description: "View service logs", example: "docker compose logs -f --tail 50 web" },
      { command: "docker compose exec", description: "Run command in running service", example: "docker compose exec web sh" },
      { command: "docker compose run", description: "Run a one-off command", example: "docker compose run --rm web python manage.py migrate" },
      { command: "docker compose build", description: "Build or rebuild services", example: "docker compose build --no-cache" },
      { command: "docker compose pull", description: "Pull service images", example: "docker compose pull" },
      { command: "docker compose config", description: "Validate and view compose file", example: "docker compose config" },
      { command: "docker compose top", description: "Show processes in services", example: "docker compose top" },
    ],
  },
  {
    category: "Compose Scaling & Env",
    topic: "compose",
    commands: [
      { command: "docker compose up --scale", description: "Scale a service", example: "docker compose up -d --scale web=3" },
      { command: "docker compose --env-file", description: "Use a custom env file", example: "docker compose --env-file .env.prod up" },
      { command: "docker compose -f", description: "Use multiple compose files", example: "docker compose -f docker-compose.yml -f docker-compose.prod.yml up" },
    ],
  },

  // Kubernetes
  {
    category: "Pods & Workloads",
    topic: "kubernetes",
    commands: [
      { command: "kubectl get pods", description: "List pods", example: "kubectl get pods -o wide -n my-ns" },
      { command: "kubectl describe pod", description: "Show pod details and events", example: "kubectl describe pod my-pod -n my-ns" },
      { command: "kubectl delete pod", description: "Delete a pod", example: "kubectl delete pod my-pod --grace-period=0" },
      { command: "kubectl logs", description: "View pod logs", example: "kubectl logs -f my-pod -c sidecar" },
      { command: "kubectl exec", description: "Execute command in pod", example: "kubectl exec -it my-pod -- sh" },
      { command: "kubectl cp", description: "Copy files to/from pod", example: "kubectl cp my-pod:/app/log.txt ./log.txt" },
      { command: "kubectl port-forward", description: "Forward local port to pod", example: "kubectl port-forward pod/my-pod 8080:80" },
    ],
  },
  {
    category: "Deployments & Rollouts",
    topic: "kubernetes",
    commands: [
      { command: "kubectl create deployment", description: "Create a deployment", example: "kubectl create deployment nginx --image=nginx --replicas=3" },
      { command: "kubectl scale deployment", description: "Scale a deployment", example: "kubectl scale deployment nginx --replicas=5" },
      { command: "kubectl set image", description: "Update container image", example: "kubectl set image deployment/nginx nginx=nginx:1.25" },
      { command: "kubectl rollout status", description: "Check rollout status", example: "kubectl rollout status deployment/nginx" },
      { command: "kubectl rollout history", description: "View rollout history", example: "kubectl rollout history deployment/nginx" },
      { command: "kubectl rollout undo", description: "Rollback to previous version", example: "kubectl rollout undo deployment/nginx" },
      { command: "kubectl rollout restart", description: "Restart a deployment", example: "kubectl rollout restart deployment/nginx" },
      { command: "kubectl get deployments", description: "List deployments", example: "kubectl get deploy -A" },
    ],
  },
  {
    category: "Services & Networking",
    topic: "kubernetes",
    commands: [
      { command: "kubectl expose", description: "Expose deployment as a service", example: "kubectl expose deployment nginx --port=80 --type=LoadBalancer" },
      { command: "kubectl get services", description: "List services", example: "kubectl get svc -o wide" },
      { command: "kubectl get ingress", description: "List ingress resources", example: "kubectl get ingress" },
      { command: "kubectl describe svc", description: "Show service details", example: "kubectl describe svc nginx-svc" },
    ],
  },
  {
    category: "Config & Secrets",
    topic: "kubernetes",
    commands: [
      { command: "kubectl create configmap", description: "Create a ConfigMap", example: "kubectl create configmap app-config --from-literal=DB_HOST=db" },
      { command: "kubectl create secret generic", description: "Create a secret", example: "kubectl create secret generic db-creds --from-literal=password=s3cur3" },
      { command: "kubectl get configmaps", description: "List ConfigMaps", example: "kubectl get cm" },
      { command: "kubectl get secrets", description: "List secrets", example: "kubectl get secrets" },
    ],
  },
  {
    category: "Namespaces & Context",
    topic: "kubernetes",
    commands: [
      { command: "kubectl get namespaces", description: "List namespaces", example: "kubectl get ns" },
      { command: "kubectl create namespace", description: "Create a namespace", example: "kubectl create namespace staging" },
      { command: "kubectl config get-contexts", description: "List kubeconfig contexts", example: "kubectl config get-contexts" },
      { command: "kubectl config use-context", description: "Switch active context", example: "kubectl config use-context prod-cluster" },
      { command: "kubectl api-resources", description: "List available API resources", example: "kubectl api-resources" },
    ],
  },
  {
    category: "Apply & Manage",
    topic: "kubernetes",
    commands: [
      { command: "kubectl apply -f", description: "Apply a manifest file", example: "kubectl apply -f deployment.yaml" },
      { command: "kubectl delete -f", description: "Delete resources from file", example: "kubectl delete -f deployment.yaml" },
      { command: "kubectl get all", description: "List all resources in namespace", example: "kubectl get all -n my-ns" },
      { command: "kubectl explain", description: "Show resource field docs", example: "kubectl explain pod.spec.containers" },
      { command: "kubectl diff -f", description: "Preview changes before applying", example: "kubectl diff -f deployment.yaml" },
    ],
  },
  {
    category: "HPA & Autoscaling",
    topic: "kubernetes",
    commands: [
      { command: "kubectl autoscale", description: "Create horizontal pod autoscaler", example: "kubectl autoscale deployment web --min=2 --max=10 --cpu-percent=80" },
      { command: "kubectl get hpa", description: "List autoscalers", example: "kubectl get hpa" },
    ],
  },

  // DevOps / CI-CD
  {
    category: "CI/CD & Pipeline",
    topic: "devops",
    commands: [
      { command: "docker buildx", description: "Multi-platform build with BuildKit", example: "docker buildx build --push -t app:v1 --platform linux/amd64,linux/arm64 ." },
      { command: "docker scan", description: "Scan image for vulnerabilities", example: "docker scan my-app:latest" },
      { command: "docker sbom", description: "Generate Software Bill of Materials", example: "docker sbom my-app:latest" },
    ],
  },
  {
    category: "Monitoring & Debug",
    topic: "devops",
    commands: [
      { command: "docker events", description: "Stream Docker daemon events", example: "docker events --filter type=container" },
      { command: "kubectl top pods", description: "Show pod resource usage", example: "kubectl top pods -n my-ns" },
      { command: "kubectl top nodes", description: "Show node resource usage", example: "kubectl top nodes" },
      { command: "kubectl get events", description: "List cluster events", example: "kubectl get events --sort-by=.lastTimestamp" },
    ],
  },
];