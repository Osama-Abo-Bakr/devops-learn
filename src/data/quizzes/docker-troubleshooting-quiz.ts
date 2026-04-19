import type { Quiz } from "@/types";

export const dockerTroubleshootingQuiz: Quiz = {
  id: "docker-troubleshooting-quiz",
  title: "Docker Troubleshooting Quiz",
  lessonSlug: "docker-troubleshooting",
  questions: [
    {
      id: "q1",
      question:
        "When should you use `docker logs` versus `docker inspect` to diagnose a container issue?",
      options: [
        "Use `docker inspect` to see application errors; use `docker logs` to check resource limits",
        "Use `docker logs` to see application stdout/stderr output; use `docker inspect` to check container configuration, state, and metadata",
        "They are interchangeable — both show the same information in different formats",
        "Use `docker logs` for running containers only; use `docker inspect` for stopped containers only",
      ],
      correctIndex: 1,
      explanation:
        "`docker logs` streams the stdout/stderr output that your application writes, making it ideal for application errors and log messages. `docker inspect` returns low-level configuration and state metadata (IP address, exit code, mounts, environment variables, resource limits) — information the application itself never writes to logs. Use both together for a complete picture.",
    },
    {
      id: "q2",
      question:
        "Which of the following is a common cause of Docker build failures?",
      options: [
        "Running too many containers on the host",
        "A `.dockerignore` file that excludes required source files, or a `COPY` instruction referencing a path that doesn't exist in the build context",
        "Using `EXPOSE` in the Dockerfile without publishing the port with `-p`",
        "Setting `HEALTHCHECK` in the Dockerfile",
      ],
      correctIndex: 1,
      explanation:
        "Build failures commonly stem from context issues: a `.dockerignore` that's too aggressive can exclude files your `COPY` needs, and referencing a path that doesn't exist in the build context causes the build to fail immediately. Option C (`EXPOSE` without `-p`) doesn't cause build failures — `EXPOSE` is documentation-only. Option D is also valid Dockerfile syntax.",
    },
    {
      id: "q3",
      question:
        "A container exits with code 137. What does this mean and how do you diagnose it?",
      options: [
        "The application exited normally with a success code — no action needed",
        "The container received SIGTERM and shut down gracefully",
        "The container was killed by the OOM killer (Out of Memory); check `docker inspect` for `OOMKilled: true` and increase memory limits or fix memory leaks",
        "The container encountered a segmentation fault — check for unsafe pointer operations in the code",
      ],
      correctIndex: 2,
      explanation:
        "Exit code 137 = 128 + 9 (SIGKILL). When the host's OOM killer terminates a container, it sends SIGKILL. You can confirm by running `docker inspect <container> | grep OOMKilled` — if `true`, the container exceeded its memory limit. Solutions include increasing `--memory`, fixing memory leaks in the application, or tuning garbage collection settings.",
    },
    {
      id: "q4",
      question:
        "How do you troubleshoot DNS resolution failures between containers on a custom Docker network?",
      options: [
        "Restart the Docker daemon and rebuild all images",
        "Use `docker network inspect <network>` to verify containers are attached, check IP assignments, and confirm the embedded DNS server is resolving container names correctly",
        "Add a `--dns` flag to every container and manually specify the host's DNS server",
        "Switch all containers to use the default bridge network, which has automatic DNS resolution",
      ],
      correctIndex: 1,
      explanation:
        "`docker network inspect <network>` shows which containers are connected, their assigned IPs, and the network's DNS configuration. On user-defined networks, Docker provides automatic DNS resolution using container names — but containers must actually be on the same network. The default bridge network does NOT support automatic DNS by name, so option D would make the problem worse.",
    },
    {
      id: "q5",
      question:
        "A container keeps getting OOMKilled. Which `docker run` flags help prevent this, and how do you verify the current limits?",
      options: [
        "Use `--cpus` to limit CPU; verify with `docker stats` — memory is unlimited by default and doesn't need limits",
        "Use `--memory` and `--memory-reservation` to set limits; verify with `docker inspect --format '{{.HostConfig.Memory}}' <container>` or `docker stats`",
        "Use `--oom-score-adj` to prevent the OOM killer from targeting your container",
        "Set `DOCKER_OOM_DISABLE=1` as an environment variable when running the container",
      ],
      correctIndex: 1,
      explanation:
        "`--memory` sets a hard memory limit (the OOM killer triggers when exceeded), while `--memory-reservation` sets a soft limit (Docker attempts to reclaim memory when the host is under pressure). Verify with `docker inspect --format '{{.HostConfig.Memory}}' <container>` to see the configured limit in bytes, or use `docker stats` to see live memory usage. Option C (`--oom-score-adj`) only adjusts the OOM killer's priority — it doesn't prevent OOM kills entirely. Option D is not a real Docker feature.",
    },
    {
      id: "q6",
      question:
        "Your Docker build context is 2 GB and builds are slow. What commands help you understand and reclaim disk space?",
      options: [
        "`docker system df` to see disk usage breakdown, then `docker system prune` to remove unused images, containers, networks, and build cache",
        "`docker image ls` followed by `docker rmi $(docker images -q)` to delete all images",
        "`docker volume ls` followed by `docker volume rm $(docker volume ls -q)` to delete all volumes",
        "There is no way to check Docker disk usage — you must manually inspect `/var/lib/docker`",
      ],
      correctIndex: 0,
      explanation:
        "`docker system df` shows a breakdown of disk usage across images, containers, build cache, and volumes. `docker system prune` removes stopped containers, unused networks, dangling images, and build cache. For a deeper clean, `docker system prune -a` also removes all images not referenced by running containers. Options B and C are destructive and could remove images or data you still need.",
    },
    {
      id: "q7",
      question:
        "You need to debug a running container's filesystem and extract a log file. Which commands achieve this?",
      options: [
        "Use `docker cp <container>:/var/log/app.log ./app.log` to copy the file out, and `docker exec -it <container> /bin/sh` to explore the filesystem interactively",
        "Use `docker export <container> | tar -x app.log` — there is no `docker cp` command",
        "Use `docker logs --extract /var/log/app.log <container>` to get the file and `docker shell <container>` to explore",
        "You cannot access a running container's filesystem — you must stop it first and commit it to a new image",
      ],
      correctIndex: 0,
      explanation:
        "`docker cp` copies files between the host and a container without stopping it: `docker cp <container>:/path ./local-path`. `docker exec -it <container> /bin/sh` (or `/bin/bash` if available) opens an interactive shell inside the running container. These are the two primary tools for interactive debugging. Option C describes nonexistent commands. Option D is incorrect — you can access a running container's filesystem.",
    },
    {
      id: "q8",
      question:
        "A container in your Compose stack keeps restarting every 10 seconds. Walk through the correct diagnostic steps:",
      options: [
        "Delete the container and recreate it — if it restarts, the image is corrupted and you need to pull a fresh copy",
        "Run `docker logs --tail 50 <container>` to see the crash output, `docker inspect --format '{{.State.ExitCode}}' <container>` to get the exit code, check `OOMKilled` status, and review `restart: always` policy — then fix the root cause (missing env vars, failed health check, etc.)",
        "Set `restart: \"no\"` in docker-compose.yml and the container will stop crashing — that solves the problem",
        "Add `tty: true` and `stdin_open: true` to the service in docker-compose.yml to keep the container running",
      ],
      correctIndex: 1,
      explanation:
        "A restart loop means the container starts, fails, and the restart policy brings it back. The diagnostic workflow is: (1) check logs for the error message, (2) check the exit code to understand why it stopped, (3) verify OOM status, (4) review restart policy to confirm it's intentional. Common root causes include missing environment variables, failed health checks, incorrect entrypoints, and application crashes. Option A is a blunt approach that doesn't diagnose the problem. Option C masks the symptom. Option D might keep a container alive artificially but doesn't fix the underlying issue.",
    },
  ],
};