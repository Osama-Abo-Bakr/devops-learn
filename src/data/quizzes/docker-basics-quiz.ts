import type { Quiz } from "@/types";

export const dockerBasicsQuiz: Quiz = {
  id: "docker-basics-quiz",
  title: "Docker Basics Quiz",
  lessonSlug: "containers-101",
  questions: [
    {
      id: "q1",
      question: "What is a Docker container?",
      options: [
        "A virtual machine running Linux",
        "A lightweight, standalone package that includes everything needed to run a piece of software",
        "A Docker image stored on disk",
        "A Kubernetes pod",
      ],
      correctIndex: 1,
      explanation:
        "A container is a lightweight, standalone package that includes code, runtime, system tools, libraries, and settings — everything needed to run software. Unlike VMs, containers share the host OS kernel.",
    },
    {
      id: "q2",
      question: "Which command lists all running Docker containers?",
      options: ["docker list", "docker ps", "docker containers", "docker show"],
      correctIndex: 1,
      explanation:
        "`docker ps` lists running containers. Add `-a` to see all containers including stopped ones. The name `ps` comes from the Unix process listing command.",
    },
    {
      id: "q3",
      question: "What is the difference between a Docker image and a container?",
      options: [
        "They are the same thing",
        "An image is a read-only template; a container is a running instance of an image",
        "An image is a running process; a container is a stored file",
        "Images are for Docker; containers are for Kubernetes",
      ],
      correctIndex: 1,
      explanation:
        "An image is a read-only template with instructions for creating a Docker container. A container is a runnable instance of an image — you can create multiple containers from the same image.",
    },
    {
      id: "q4",
      question: "What does `docker pull nginx` do?",
      options: [
        "Starts an nginx container",
        "Downloads the nginx image from Docker Hub to your local machine",
        "Deletes the nginx image",
        "Updates the nginx container",
      ],
      correctIndex: 1,
      explanation:
        "`docker pull` downloads an image from a registry (like Docker Hub) to your local machine. It does not start a container — you'd use `docker run` for that.",
    },
    {
      id: "q5",
      question: "Which flag runs a container in the background (detached mode)?",
      options: ["-i", "-t", "-d", "-b"],
      correctIndex: 2,
      explanation:
        "The `-d` flag runs a container in detached mode (in the background). Common combinations include `-it` for interactive mode and `-dit` for detached interactive with a TTY.",
    },
    {
      id: "q6",
      question:
        "You run `docker run -d -p 8080:80 nginx` but get a 'port already in use' error. Another container is already using port 8080 on the host. What is the best solution?",
      options: [
        "Restart Docker to free up port 8080",
        "Change the host port mapping (e.g., `-p 8081:80`) or stop the conflicting container",
        "Use `-p 80:8080` to reverse the port order",
        "Add the `--port-force` flag to override the conflict",
      ],
      correctIndex: 1,
      explanation:
        "The `-p` flag uses `HOST:CONTAINER` format, so `-p 8080:80` maps host port 8080 to container port 80. If another process or container already occupies host port 8080, you can either map to a different host port (e.g., `-p 8081:80`) or stop the conflicting container. The container port (80) must stay the same — only the host side can change.",
    },
  ],
};