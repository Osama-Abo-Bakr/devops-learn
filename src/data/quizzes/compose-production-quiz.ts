import type { Quiz } from "@/types";

export const composeProductionQuiz: Quiz = {
  id: "compose-production-quiz",
  title: "Compose Production Quiz",
  lessonSlug: "compose-production",
  questions: [
    {
      id: "q1",
      question: "What is the purpose of `docker-compose.override.yml`?",
      options: [
        "It overrides Docker daemon settings",
        "It automatically merges with `docker-compose.yml` to add dev-specific settings without modifying the base file",
        "It replaces the main Compose file in production",
        "It overrides environment variables from the `.env` file",
      ],
      correctIndex: 1,
      explanation:
        "Docker Compose automatically reads both `docker-compose.yml` and `docker-compose.override.yml`, merging them. This lets you keep production config in the base file and add dev-specific settings (like volume mounts for hot-reload or debug flags) in the override, without duplicating the entire file.",
    },
    {
      id: "q2",
      question: "How do you specify a different Compose file when running `docker compose`?",
      options: [
        "docker compose --file=prod.yml up",
        "docker compose -f prod.yml up",
        "docker compose --config prod.yml up",
        "docker compose use prod.yml up",
      ],
      correctIndex: 1,
      explanation:
        "The `-f` flag specifies a Compose file. You can use it multiple times: `docker compose -f docker-compose.yml -f docker-compose.prod.yml up`. Files are merged in order, with later files overriding earlier ones.",
    },
    {
      id: "q3",
      question: "How do you define a health check for a service in docker-compose.yml?",
      options: [
        "healthcheck:\n  cmd: curl -f http://localhost/ || exit 1",
        "healthcheck:\n  test: [\"CMD\", \"curl\", \"-f\", \"http://localhost/\"]",
        "health:\n  check: curl http://localhost/",
        "liveness:\n  probe: curl http://localhost/",
      ],
      correctIndex: 1,
      explanation:
        "In Compose, `healthcheck` takes a `test` key. The `CMD` form (a list of strings) is preferred because it runs directly without a shell, avoiding shell-specific issues. You can also set `interval`, `timeout`, `retries`, and `start_period`.",
    },
    {
      id: "q4",
      question:
        "Which restart policy in Compose ensures a container always restarts unless it was explicitly stopped?",
      options: [
        "restart: on-failure",
        "restart: always",
        "restart: unless-stopped",
        "restart: never",
      ],
      correctIndex: 2,
      explanation:
        "`restart: unless-stopped` restarts the container regardless of exit code, but respects manual stops. Unlike `always`, it won't restart the container after a Docker daemon restart if you had manually stopped it. This is the recommended policy for most production services.",
    },
    {
      id: "q5",
      question: "What is a common pattern for separating production and development Compose configurations?",
      options: [
        "Use a single Compose file with extensive comments",
        "Keep a base `docker-compose.yml` and add `docker-compose.prod.yml` (or `docker-compose.override.yml` for dev), then compose with multiple `-f` flags",
        "Use environment variables to toggle every setting in one file",
        "Maintain separate repositories for each environment",
      ],
      correctIndex: 1,
      explanation:
        "The multi-file pattern keeps a shared base in `docker-compose.yml` and environment-specific overrides in separate files. For production, run `docker compose -f docker-compose.yml -f docker-compose.prod.yml up`. This avoids duplication and keeps each environment's differences explicit and version-controlled.",
    },
    {
      id: "q6",
      question:
        "Your production Compose stack keeps running even when the health check fails. You have `HEALTHCHECK` defined in the Dockerfile but the container never gets marked unhealthy. What is missing?",
      options: [
        "The Dockerfile `HEALTHCHECK` instruction is not supported in Compose — you must define it only in `docker-compose.yml`",
        "Compose health checks alone don't restart unhealthy containers — you need `restart: unless-stopped` or `restart: on-failure` combined with health checks, and optionally `depends_on` with `condition: service_healthy`",
        "You must add `--health-cmd` to the `docker compose up` command",
        "Health checks only work in Docker Swarm mode, not in standalone Compose",
      ],
      correctIndex: 1,
      explanation:
        "Defining a `HEALTHCHECK` in the Dockerfile (or `healthcheck` in Compose) tells Docker how to check container health, but it does not automatically restart unhealthy containers. You need a restart policy like `restart: unless-stopped` so that when the container becomes unhealthy and exits, Compose restarts it. Additionally, `depends_on` with `condition: service_healthy` ensures dependent services wait for healthy containers.",
    },
  ],
};