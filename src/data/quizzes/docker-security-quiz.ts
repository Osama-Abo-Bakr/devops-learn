import type { Quiz } from "@/types";

export const dockerSecurityQuiz: Quiz = {
  id: "docker-security-quiz",
  title: "Docker Security Quiz",
  lessonSlug: "docker-security",
  questions: [
    {
      id: "q1",
      question: "Why should containers not run as the root user by default?",
      options: [
        "Root processes use more memory",
        "If a container is compromised, a root process gives the attacker root capabilities on the host",
        "Docker does not support root users inside containers",
        "Root processes cannot access environment variables",
      ],
      correctIndex: 1,
      explanation:
        "Running as root inside a container is dangerous because container namespaces share the host kernel. If an attacker escapes the container while running as root, they gain root-level access on the host. Use `USER <non-root-user>` in your Dockerfile to follow least-privilege principles.",
    },
    {
      id: "q2",
      question:
        "Which Dockerfile instruction creates a non-root user for the container process?",
      options: [
        "RUN adduser --disabled-password appuser && USER appuser",
        "ENV USER=appuser",
        "CMD --user appuser",
        "ENTRYPOINT [\"--user\", \"appuser\"]",
      ],
      correctIndex: 0,
      explanation:
        "The `USER` instruction sets the user for subsequent `RUN`, `CMD`, and `ENTRYPOINT` instructions. You typically create the user first with `RUN adduser` or `RUN useradd`, then switch to it with `USER appuser`. This ensures the container process runs as a non-root user.",
    },
    {
      id: "q3",
      question: "What does `docker scan` (or `docker scout`) do?",
      options: [
        "Scans the host OS for Docker vulnerabilities",
        "Scans container images for known CVE vulnerabilities in their packages",
        "Scans network traffic for malicious payloads",
        "Scans Docker logs for error patterns",
      ],
      correctIndex: 1,
      explanation:
        "Image scanning tools like `docker scout` analyze the packages and dependencies in an image against a CVE database to find known vulnerabilities. Regular scanning in CI/CD pipelines helps catch security issues before images reach production.",
    },
    {
      id: "q4",
      question: "Which `docker run` flag makes the container's filesystem read-only?",
      options: [
        "--readonly",
        "--read-only",
        "--fs-readonly",
        "--no-write",
      ],
      correctIndex: 1,
      explanation:
        "The `--read-only` flag mounts the container's root filesystem as read-only, preventing any writes to it. You can still write to tmpfs mounts (e.g. `--tmpfs /tmp`) for temporary data, which is a common pattern when using this flag.",
    },
    {
      id: "q5",
      question:
        "What is the purpose of dropping Linux capabilities in a container?",
      options: [
        "To reduce the container's memory usage",
        "To limit the container's kernel-level permissions to only what it needs, reducing the attack surface",
        "To prevent the container from accessing the network",
        "To force the container to use a specific CPU core",
      ],
      correctIndex: 1,
      explanation:
        "Linux capabilities break root privileges into fine-grained units. By default Docker drops many capabilities, but you can further restrict with `--cap-drop ALL` and add back only what's needed with `--cap-add`. For example, a web server likely doesn't need `CAP_SYS_ADMIN`.",
    },
  ],
};