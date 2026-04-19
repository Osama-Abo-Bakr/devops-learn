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
    {
      id: "q6",
      question:
        "Your Node.js container exits unexpectedly when you run `docker stop`. The logs show the app received SIGTERM but didn't shut down. What is the most likely cause?",
      options: [
        "The Node.js process is running as PID 1 inside the container, and Node.js does not handle PID-1 signal behavior correctly — use `--init` or tini as the init process",
        "The container's memory limit was exceeded, causing the OOM killer to terminate it",
        "Docker sends SIGKILL instead of SIGTERM when you use `docker stop`",
        "Node.js cannot run inside Docker containers without special kernel flags",
      ],
      correctIndex: 0,
      explanation:
        "When a container runs a single process, that process becomes PID 1 (init). The Linux kernel treats PID 1 differently — it does not forward signals to child processes by default, and Node.js does not implement init-like signal handling. When `docker stop` sends SIGTERM, the Node.js process (as PID 1) may not handle it properly. The fix is to use `--init` flag or `tini` as the init process, which properly forwards signals to the application.",
    },
    {
      id: "q7",
      question:
        "What happens after Docker sends SIGTERM to a container and the `--stop-timeout` period expires?",
      options: [
        "Docker sends a second SIGTERM with a higher priority",
        "Docker sends SIGKILL to force-terminate the container",
        "Docker restarts the container automatically",
        "Docker suspends the container and saves its state to disk",
      ],
      correctIndex: 1,
      explanation:
        "When you run `docker stop`, Docker sends SIGTERM to the container. If the container does not exit within the `--stop-timeout` (default 10 seconds), Docker sends SIGKILL to force-terminate it. This two-phase shutdown gives applications a chance to clean up (close connections, flush buffers) but ensures containers cannot hang indefinitely. Set `--stop-timeout` in `docker run` or the `stop_timeout` property in `docker-compose.yml` to adjust this value.",
    },
    {
      id: "q8",
      question:
        "In the Dockerfile instruction `HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD curl -f http://localhost:8080/`, what does each flag control?",
      options: [
        "interval: how long the health check runs; timeout: max retries; start-period: time between checks; retries: seconds before unhealthy",
        "interval: time between health checks; timeout: max time a single check can take; start-period: grace period before checks count; retries: consecutive failures before marking unhealthy",
        "interval: container startup delay; timeout: total health check duration; start-period: time to wait before first check; retries: number of parallel check threads",
        "interval: CPU check frequency; timeout: memory limit; start-period: network warm-up; retries: image pull attempts",
      ],
      correctIndex: 1,
      explanation:
        "In a HEALTHCHECK instruction: `--interval` sets how often the check runs (default 30s), `--timeout` is the maximum time a single check can take before it is considered a failure (default 30s), `--start-period` provides a grace period where failures don't count toward the retry limit (default 0s), and `--retries` is the number of consecutive failures needed to mark the container as unhealthy (default 3). The `--start-period` is especially important for applications that need time to initialize before they can respond to health checks.",
    },
  ],
};