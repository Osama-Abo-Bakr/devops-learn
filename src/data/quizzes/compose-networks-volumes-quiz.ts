import type { Quiz } from "@/types";

export const composeNetworksVolumesQuiz: Quiz = {
  id: "compose-networks-volumes-quiz",
  title: "Compose Networks & Volumes Quiz",
  lessonSlug: "compose-networks-volumes",
  questions: [
    {
      id: "q1",
      question: "How do you define a named volume in a docker-compose.yml file?",
      options: [
        "data:\n  type: storage",
        "volumes:\n  data:",
        "storage:\n  - data",
        "mounts:\n  data: {}",
      ],
      correctIndex: 1,
      explanation:
        "Named volumes are defined under the top-level `volumes` key. A simple `data:` declaration creates a named volume called `data`. You can then reference it in a service with `volumes:\n  - data:/path/in/container`.",
    },
    {
      id: "q2",
      question:
        "What does the `driver` option specify when defining a volume or network in Compose?",
      options: [
        "The container runtime (e.g., runc, kata)",
        "The storage or network backend (e.g., `local`, `bridge`, `overlay`)",
        "The programming language runtime for the service",
        "The Docker daemon version to use",
      ],
      correctIndex: 1,
      explanation:
        "The `driver` option selects the backend implementation. For volumes, `local` (default) stores data on the host. For networks, `bridge` (default for single-host) or `overlay` (for Swarm multi-host) controls how connectivity is provided.",
    },
    {
      id: "q3",
      question:
        "How do you attach a service to multiple networks in Compose?",
      options: [
        "network: frontend, backend",
        "networks:\n  - frontend\n  - backend",
        "network_mode:\n  - frontend\n  - backend",
        "connect:\n  - frontend\n  - backend",
      ],
      correctIndex: 1,
      explanation:
        "Under a service, use the `networks` key (plural) with a list of network names. The service will be attached to all listed networks, enabling communication with services on each network while keeping those networks isolated from each other.",
    },
    {
      id: "q4",
      question: "What happens when you mount a named volume to a path that already has data in the container image?",
      options: [
        "The existing data in the image is deleted",
        "The existing data from the image is copied into the volume on first mount, then the volume content persists",
        "Mounting fails with an error",
        "The container uses the image data and ignores the volume",
      ],
      correctIndex: 1,
      explanation:
        "When a named volume is first mounted to a non-empty directory in the container, Docker copies the image's content into the volume. After that, the volume content takes precedence. This is useful for preserving initial config files or default data. Bind mounts do NOT copy — they simply overlay the host path.",
    },
    {
      id: "q5",
      question:
        "How do you isolate two groups of services so they cannot communicate with each other?",
      options: [
        "Use different image tags for each group",
        "Place each group on a separate custom network; services can only resolve names on their own network(s)",
        "Set `internal: true` on each service",
        "Use `depends_on` to create a firewall rule",
      ],
      correctIndex: 1,
      explanation:
        "Docker networks provide isolation by default — services on different networks cannot resolve each other's names or communicate directly. By placing groups on separate custom networks, you enforce network boundaries. To allow cross-group communication, explicitly add the service to both networks.",
    },
  ],
};