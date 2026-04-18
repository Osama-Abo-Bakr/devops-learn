import type { Quiz } from "@/types";

export const cicdQuiz: Quiz = {
  id: "cicd-quiz",
  title: "CI/CD & Containers Quiz",
  lessonSlug: "cicd-containers",
  questions: [
    {
      id: "q1",
      question:
        "What is the correct order of stages in a typical CI/CD pipeline for containerized applications?",
      options: [
        "Deploy -> Build -> Test -> Release",
        "Build -> Test -> Push -> Deploy",
        "Test -> Build -> Deploy -> Push",
        "Push -> Build -> Test -> Deploy",
      ],
      correctIndex: 1,
      explanation:
        "A typical CI/CD pipeline for containers is: Build (create the Docker image), Test (run unit/integration tests against the image), Push (upload the tested image to a container registry), Deploy (update the cluster to use the new image). This ensures only tested images reach Production.",
    },
    {
      id: "q2",
      question:
        "In a CI pipeline, why should you use Docker multi-stage builds for creating images?",
      options: [
        "Multi-stage builds produce smaller, more secure images by excluding build tools and dependencies from the final image",
        "Multi-stage builds are required by Docker Hub",
        "Multi-stage builds make the build faster by parallelizing stages",
        "Multi-stage builds allow running multiple tests simultaneously",
      ],
      correctIndex: 0,
      explanation:
        "Multi-stage builds let you use a build stage with compilers and dev dependencies, then copy only the compiled artifacts to a slim runtime stage. The final image excludes build tools, reducing attack surface and image size. Example: `FROM node:20 AS build` then `FROM node:20-alpine AS runtime` with `COPY --from=build`.",
    },
    {
      id: "q3",
      question:
        "In GitHub Actions, which key defines the container image to use for a job?",
      options: [
        "runs.image",
        "container",
        "runner",
        "docker.image",
      ],
      correctIndex: 1,
      explanation:
        "In GitHub Actions, the `container` key on a job specifies the Docker image to run the job in. Example: `container: node:20-alpine`. You can also use `container: { image: node:20-alpine, env: { NODE_ENV: test } }` for more configuration options.",
    },
    {
      id: "q4",
      question:
        "What is the benefit of pushing container images to a registry during CI?",
      options: [
        "It is the only way to build Docker images",
        "It makes images available for deployment to any environment and enables versioned, reproducible deployments",
        "It automatically deploys the image to Production",
        "It replaces the need for a Kubernetes cluster",
      ],
      correctIndex: 1,
      explanation:
        "Pushing images to a registry (e.g., Docker Hub, ECR, GCR) makes them available for pull from any environment — dev, staging, or production. Tagging with the commit SHA or semantic version ensures reproducible deployments. Kubernetes nodes pull images from the registry during Pod creation.",
    },
    {
      id: "q5",
      question:
        "Which image tagging strategy is recommended for Production deployments?",
      options: [
        "Always use the `latest` tag for simplicity",
        "Use mutable tags like `v1` that can be updated to point to new images",
        "Use immutable tags based on the commit SHA or full semantic version (e.g., `sha-abc1234` or `v1.2.3`)",
        "Do not tag images at all — use the image ID",
      ],
      correctIndex: 2,
      explanation:
        "Use immutable tags (commit SHA or full semver) for Production. The `latest` tag is mutable — it can point to different images over time, making rollbacks difficult and deployments non-reproducible. A tag like `sha-abc1234` guarantees you always get the exact same image.",
    },
  ],
};