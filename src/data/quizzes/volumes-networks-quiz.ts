import type { Quiz } from "@/types";

export const volumesNetworksQuiz: Quiz = {
  id: "volumes-networks-quiz",
  title: "Volumes & Networks Quiz",
  lessonSlug: "volumes-networks",
  questions: [
    {
      id: "q1",
      question:
        "What is the key difference between a bind mount and a Docker volume?",
      options: [
        "Bind mounts are faster; volumes are more reliable",
        "Bind mounts mount a host directory; volumes are managed by Docker and stored in Docker's storage area",
        "Volumes can only be used with Linux containers; bind mounts work on all OS",
        "There is no difference; they are interchangeable",
      ],
      correctIndex: 1,
      explanation:
        "Bind mounts map a specific host path (e.g. `-v /host/data:/container/data`) and depend on the host filesystem structure. Volumes are managed entirely by Docker (stored under `/var/lib/docker/volumes/`) and are the recommended approach for persistence in production.",
    },
    {
      id: "q2",
      question: "Which Docker network driver is the default for standalone containers?",
      options: [
        "host",
        "overlay",
        "bridge",
        "macvlan",
      ],
      correctIndex: 2,
      explanation:
        "The `bridge` driver is the default network type for standalone containers. Containers on the same bridge network can communicate using container names as hostnames. The `overlay` driver is used for multi-host communication in Swarm.",
    },
    {
      id: "q3",
      question: "How do you publish a container's port 8080 to the host's port 80?",
      options: [
        "docker run --publish 80:8080 nginx",
        "docker run --port 8080:80 nginx",
        "docker run -p 8080:80 nginx",
        "docker run --expose 80:8080 nginx",
      ],
      correctIndex: 0,
      explanation:
        "The `-p` (or `--publish`) flag maps host ports to container ports in `HOST:CONTAINER` format. So `-p 80:8080` maps the host's port 80 to the container's port 8080. Note the order — host port comes first.",
    },
    {
      id: "q4",
      question: "What happens to a named volume's data when its last container is removed?",
      options: [
        "The data is automatically deleted",
        "The data is preserved because named volumes persist independently of containers",
        "The data is backed up to Docker Hub",
        "The volume is converted to a bind mount",
      ],
      correctIndex: 1,
      explanation:
        "Named volumes persist even after containers are removed. They are only deleted explicitly with `docker volume rm` or `docker volume prune`. Anonymous volumes, by contrast, are removed when their container is deleted with the `-v` flag.",
    },
    {
      id: "q5",
      question: "Which flag allows two containers to share the same network namespace?",
      options: [
        "--network bridge",
        "--network host",
        "--network container:other_container",
        "--network shared",
      ],
      correctIndex: 2,
      explanation:
        "The `--network container:other_container` flag joins a new container to the network namespace of an existing container. They share the same IP address and port space, useful for sidecar patterns where two containers must communicate over `localhost`.",
    },
  ],
};