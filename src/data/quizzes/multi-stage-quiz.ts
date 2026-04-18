import type { Quiz } from "@/types";

export const multiStageQuiz: Quiz = {
  id: "multi-stage-quiz",
  title: "Multi-Stage Builds Quiz",
  lessonSlug: "multi-stage-builds",
  questions: [
    {
      id: "q1",
      question: "What is the primary benefit of a multi-stage Docker build?",
      options: [
        "It speeds up the build process by using parallel stages",
        "It reduces the final image size by copying only needed artifacts from build stages",
        "It allows running multiple containers from a single Dockerfile",
        "It enables building images for multiple architectures at once",
      ],
      correctIndex: 1,
      explanation:
        "Multi-stage builds use multiple `FROM` instructions to create separate stages — typically a build stage with SDKs and compilers, and a slim runtime stage. Only the artifacts copied via `COPY --from` end up in the final image, drastically reducing its size.",
    },
    {
      id: "q2",
      question: "How do you copy an artifact from a previous build stage into the final stage?",
      options: [
        "COPY --source=builder /app/build /app/build",
        "ADD --from=builder /app/build /app/build",
        "COPY --from=builder /app/build /app/build",
        "PULL --stage=builder /app/build /app/build",
      ],
      correctIndex: 2,
      explanation:
        "`COPY --from=builder /app/build /app/build` copies files from the stage named `builder` (referenced by name or numeric index) into the current stage. This is the standard syntax for passing artifacts between stages in a multi-stage build.",
    },
    {
      id: "q3",
      question:
        "Why are Alpine-based images commonly used as the final stage in multi-stage builds?",
      options: [
        "Alpine includes a full package manager for installing dependencies at runtime",
        "Alpine images are very small (~5 MB) and include only minimal utilities, reducing the final image footprint",
        "Alpine is the only Linux distro that supports multi-stage builds",
        "Alpine automatically optimizes Docker layer caching",
      ],
      correctIndex: 1,
      explanation:
        "Alpine Linux uses `musl` libc and `BusyBox`, resulting in images as small as ~5 MB. This makes it ideal for the final runtime stage. However, be aware of `musl` vs `glibc` compatibility issues with some packages.",
    },
    {
      id: "q4",
      question: "What is the effect of naming a build stage with `AS` in a Dockerfile?",
      options: [
        "It creates an alias for the image in Docker Hub",
        "It allows you to reference the stage by name in `COPY --from` instead of its numeric index",
        "It changes the order in which stages are built",
        "It automatically exports the stage as a separate image",
      ],
      correctIndex: 1,
      explanation:
        "Naming a stage with `FROM node:20 AS builder` lets you reference it by name: `COPY --from=builder ...`. This is more readable and resilient than numeric indices, which break if you reorder stages.",
    },
    {
      id: "q5",
      question:
        "In a multi-stage build, which `FROM` instruction determines the base of the final image?",
      options: [
        "The first `FROM` instruction in the Dockerfile",
        "The last `FROM` instruction in the Dockerfile",
        "The `FROM` instruction with the largest image",
        "It depends on the `--target` flag used during `docker build`",
      ],
      correctIndex: 3,
      explanation:
        "By default the last `FROM` instruction defines the final image. However, you can use `docker build --target <stage>` to stop at a specific stage, making any named stage the final image. This is useful for debugging intermediate build stages.",
    },
  ],
};