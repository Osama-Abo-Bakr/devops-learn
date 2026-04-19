import type { Quiz } from "@/types";

export const multiServiceQuiz: Quiz = {
  id: "multi-service-quiz",
  title: "Multi-Service Quiz",
  lessonSlug: "multi-service",
  questions: [
    {
      id: "q1",
      question:
        "What does the `depends_on` key do in a docker-compose service?",
      options: [
        "It ensures the dependent service is healthy before starting",
        "It expresses startup order and creates a dependency relationship between services",
        "It shares the same network namespace between services",
        "It automatically scales the dependent service",
      ],
      correctIndex: 1,
      explanation:
        "`depends_on` controls startup order — the listed services start before the current one. However, it does NOT wait for the service to be \"ready\" (e.g., a database accepting connections). For that, combine `depends_on` with `healthcheck` and the `condition: service_healthy` option.",
    },
    {
      id: "q2",
      question: "How do containers on the same Compose network discover each other?",
      options: [
        "By their IP addresses only",
        "By their container ID",
        "By their service name as DNS hostname",
        "By querying a central registry service",
      ],
      correctIndex: 2,
      explanation:
        "Docker's embedded DNS server resolves service names to container IPs on the same network. For example, if you have a `db` service, your `app` service can connect to it using the hostname `db` — no hardcoded IP addresses needed.",
    },
    {
      id: "q3",
      question:
        "What does `docker-compose up -d` do?",
      options: [
        "Updates all service images to the latest version",
        "Builds, creates, and starts all containers in the background",
        "Uploads the Compose file to Docker Hub",
        "Runs containers in debug mode",
      ],
      correctIndex: 1,
      explanation:
        "`docker-compose up -d` builds images (if needed), creates containers, and starts all services in detached (background) mode. Without `-d`, the command runs in the foreground and shows log output from all services.",
    },
    {
      id: "q4",
      question: "What is the effect of `docker-compose down`?",
      options: [
        "It pauses all running services",
        "It stops and removes containers, networks, and (optionally) volumes created by `up`",
        "It only stops containers without removing them",
        "It updates the docker-compose.yml file",
      ],
      correctIndex: 1,
      explanation:
        "`docker-compose down` stops and removes containers, networks, and the default network. Add `--volumes` to also remove named volumes, and `--rmi all` to remove images. Without these flags, volumes and images are preserved.",
    },
    {
      id: "q5",
      question: "When two Compose services need to communicate, what is the recommended approach?",
      options: [
        "Use the host network mode for both services",
        "Place them on the same custom network and reference by service name",
        "Hardcode each other's IP addresses in environment variables",
        "Use port forwarding through the host",
      ],
      correctIndex: 1,
      explanation:
        "The recommended approach is to define a custom network and assign both services to it. Docker's DNS lets them reach each other by service name. This avoids hardcoded IPs and keeps traffic off the host network, improving isolation and security.",
    },
    {
      id: "q6",
      question:
        "You start a Compose stack with `docker-compose up -d` but the web service keeps restarting. You check the logs and see 'Connection refused' to the database host. The database service is still starting up. What is the best solution?",
      options: [
        "Add a `restart: always` policy to the web service so it keeps retrying until the database is ready",
        "Use a shell script wrapper that sleeps for 30 seconds before starting the web container",
        "Use `depends_on` with `condition: service_healthy` so the web service waits until the database passes its health check before starting",
        "Hardcode the database IP address in the web service's environment variables",
      ],
      correctIndex: 2,
      explanation:
        "The plain `depends_on` key only controls startup order — it doesn't wait for the service to actually be ready. By adding `condition: service_healthy`, Compose waits until the database's health check passes before starting the web service. This requires defining a `healthcheck` on the database service (e.g., `test: [\"CMD\", \"pg_isready\", \"-U\", \"postgres\"]`). This is the robust way to handle service readiness in Compose, avoiding crashes caused by services starting before their dependencies are truly available.",
    },
  ],
};