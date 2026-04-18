import type { Quiz } from "@/types";

export const productionPatternsQuiz: Quiz = {
  id: "production-patterns-quiz",
  title: "Production Patterns Quiz",
  lessonSlug: "production-patterns",
  questions: [
    {
      id: "q1",
      question:
        "How do you define a health check in a Dockerfile for a web server listening on port 8080?",
      options: [
        "HEALTHCHECK curl http://localhost:8080",
        "HEALTHCHECK CMD curl -f http://localhost:8080/ || exit 1",
        "HEALTHCHECK --port=8080",
        "CMD healthcheck --url http://localhost:8080",
      ],
      correctIndex: 1,
      explanation:
        "The `HEALTHCHECK` instruction takes `CMD` followed by a command that returns 0 (healthy) or 1 (unhealthy). `HEALTHCHECK CMD curl -f http://localhost:8080/ || exit 1` uses `curl` with the `-f` flag (fail on HTTP errors) to check the endpoint.",
    },
    {
      id: "q2",
      question:
        "Which `docker run` flags set CPU and memory limits for a container?",
      options: [
        "--max-cpus=2 --max-memory=512m",
        "--cpus=2 --memory=512m",
        "--cpu-limit=2 --ram=512m",
        "--resource-cpu=2 --resource-mem=512m",
      ],
      correctIndex: 1,
      explanation:
        "`--cpus=2` limits the container to 2 CPU cores and `--memory=512m` limits memory to 512 megabytes. These flags prevent a single container from consuming all host resources, which is critical in production environments.",
    },
    {
      id: "q3",
      question:
        "What is the purpose of the STOPSIGNAL instruction in a Dockerfile?",
      options: [
        "It defines the signal that stops the container, allowing graceful shutdown of the application",
        "It sends a notification when the container starts",
        "It configures the container to stop automatically after a timeout",
        "It logs a warning when CPU usage is high",
      ],
      correctIndex: 0,
      explanation:
        "`STOPSIGNAL` defines the system signal sent to the container to stop it (default is `SIGTERM`). For apps that need a different signal to shut down gracefully — like Node.js apps that handle `SIGINT` — you can set `STOPSIGNAL SIGINT` to avoid forceful termination.",
    },
    {
      id: "q4",
      question:
        "Which restart policy ensures a container restarts only if it exits with a non-zero status?",
      options: [
        "--restart always",
        "--restart unless-stopped",
        "--restart on-failure",
        "--restart on-error",
      ],
      correctIndex: 2,
      explanation:
        "`--restart on-failure` restarts the container only when it exits with a non-zero code. `always` restarts regardless of exit code, and `unless-stopped` is like `always` but won't restart after the daemon restarts if you manually stopped the container.",
    },
    {
      id: "q5",
      question:
        "Why is log rotation important for production Docker containers?",
      options: [
        "It improves container startup time",
        "It prevents container logs from consuming all available disk space on the host",
        "It encrypts logs for security compliance",
        "It compresses logs to make them faster to search",
      ],
      correctIndex: 1,
      explanation:
        "Without log rotation, container logs (stored under `/var/lib/docker/containers/`) can grow unbounded and fill the host disk. Configure rotation with `--log-opt max-size=10m --log-opt max-file=3` to limit log file size and count, preventing disk exhaustion.",
    },
  ],
};