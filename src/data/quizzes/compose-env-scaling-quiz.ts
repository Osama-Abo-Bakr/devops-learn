import type { Quiz } from "@/types";

export const composeEnvScalingQuiz: Quiz = {
  id: "compose-env-scaling-quiz",
  title: "Compose Env & Scaling Quiz",
  lessonSlug: "compose-env-scaling",
  questions: [
    {
      id: "q1",
      question: "What file does Docker Compose automatically read for variable substitution?",
      options: [
        ".docker-env",
        ".env",
        "env.yml",
        "compose.env",
      ],
      correctIndex: 1,
      explanation:
        "Docker Compose automatically reads a `.env` file in the same directory as the Compose file. Variables defined there are available for `${VAR}` interpolation in `docker-compose.yml`. You can override this with the `--env-file` flag.",
    },
    {
      id: "q2",
      question:
        "How do you scale a Compose service to 3 replicas using the deploy key?",
      options: [
        "deploy:\n  instances: 3",
        "deploy:\n  replicas: 3",
        "scale:\n  count: 3",
        "replicas: 3",
      ],
      correctIndex: 1,
      explanation:
        "Under the `deploy` key, `replicas: 3` defines the number of container instances. This is the Compose Specification way and works with Docker Swarm. For standalone Compose, use `docker compose up --scale servicename=3` as a CLI alternative.",
    },
    {
      id: "q3",
      question: "What is the precedence order for environment variable values in Docker Compose?",
      options: [
        "Shell env > .env file > environment key in Compose > env_file",
        "environment key in Compose > Shell env > .env file > env_file",
        ".env file > Shell env > environment key in Compose > env_file",
        "env_file > environment key > .env file > Shell env",
      ],
      correctIndex: 1,
      explanation:
        "The `environment` key in the Compose file has the highest priority, overriding everything else. Next is the shell environment, then the `.env` file, and finally `env_file` entries. This hierarchy lets you set defaults in `.env` and override them in the Compose file or shell.",
    },
    {
      id: "q4",
      question: "What does the `env_file` key in a Compose service do?",
      options: [
        "It creates a new environment variable file inside the container",
        "It reads environment variables from the specified file and passes them to the container",
        "It encrypts environment variables before storing them",
        "It sets the file path for the service's configuration",
      ],
      correctIndex: 1,
      explanation:
        "The `env_file` key reads key-value pairs from a file (e.g., `env_file: .env.local`) and passes them as environment variables to the container. It's useful for separating config by environment (dev, staging, prod) into different files.",
    },
    {
      id: "q5",
      question:
        "When scaling a service with `docker compose up --scale web=3`, what must you ensure?",
      options: [
        "The service must have a `deploy.replicas` key set",
        "The service must use a named volume for persistence",
        "The service must not map a static host port, since multiple instances cannot share the same host port",
        "The service must have `restart: always` set",
      ],
      correctIndex: 2,
      explanation:
        "If a service maps a static host port (e.g., `ports: \"8080:80\"`), scaling it to 3 instances fails because all three would try to bind host port 8080. Either omit host-side port mapping (let Docker assign ephemeral ports) or use a reverse proxy to distribute traffic.",
    },
  ],
};