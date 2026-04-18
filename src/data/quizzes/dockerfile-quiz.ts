import type { Quiz } from "@/types";

export const dockerfileQuiz: Quiz = {
  id: "dockerfile-quiz",
  title: "Dockerfile Quiz",
  lessonSlug: "dockerfile-basics",
  questions: [
    {
      id: "q1",
      question: "Which instruction must appear as the first line in a Dockerfile?",
      options: [
        "RUN",
        "CMD",
        "FROM",
        "WORKDIR",
      ],
      correctIndex: 2,
      explanation:
        "`FROM` must be the first instruction in a Dockerfile (except for ARG statements before it). It specifies the base image that all subsequent instructions build on, e.g. `FROM node:20-alpine`.",
    },
    {
      id: "q2",
      question:
        "What is the difference between COPY and ADD in a Dockerfile?",
      options: [
        "COPY can only copy from the host; ADD can also copy from URLs and auto-extract tar archives",
        "ADD is the recommended instruction; COPY is deprecated",
        "They are identical and interchangeable",
        "ADD copies files into the image; COPY copies files at runtime",
      ],
      correctIndex: 0,
      explanation:
        "`COPY` copies files from the host into the image. `ADD` does the same but also supports remote URLs and auto-extracts compressed archives. Best practice is to prefer `COPY` unless you specifically need the extra features of `ADD`.",
    },
    {
      id: "q3",
      question: "How does Docker layer caching work during a build?",
      options: [
        "Every layer is rebuilt on every build",
        "Layers are cached; if an instruction and its context haven't changed, Docker reuses the cached layer",
        "Only the FROM instruction is cached",
        "Caching only works with Alpine base images",
      ],
      correctIndex: 1,
      explanation:
        "Docker caches each layer created by an instruction. If the instruction and all preceding layers are unchanged, Docker reuses the cached layer instead of rebuilding it. This is why ordering instructions from least to most frequently changing maximizes cache hits.",
    },
    {
      id: "q4",
      question:
        "What does the .dockerignore file do?",
      options: [
        "It specifies which containers to ignore during `docker ps`",
        "It lists files and directories to exclude from the build context sent to the Docker daemon",
        "It tells Docker which images to ignore during `docker pull`",
        "It defines environment variables to ignore in the container",
      ],
      correctIndex: 1,
      explanation:
        "`.dockerignore` works like `.gitignore` — it excludes files and directories from the build context, reducing the size sent to the daemon and preventing sensitive files (like `.env` or `node_modules`) from being included in the build.",
    },
    {
      id: "q5",
      question:
        "What is the correct syntax to build a Docker image from a Dockerfile with a custom tag?",
      options: [
        "docker build --name myapp:v1 .",
        "docker build -t myapp:v1 .",
        "docker create -t myapp:v1 .",
        "docker image build --tag=myapp:v1",
      ],
      correctIndex: 1,
      explanation:
        "`docker build -t myapp:v1 .` builds an image from the Dockerfile in the current directory (`.`) and tags it as `myapp:v1`. The `-t` flag (or `--tag`) assigns a name and optional tag to the image.",
    },
  ],
};