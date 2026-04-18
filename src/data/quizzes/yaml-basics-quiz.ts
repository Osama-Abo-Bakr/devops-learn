import type { Quiz } from "@/types";

export const yamlBasicsQuiz: Quiz = {
  id: "yaml-basics-quiz",
  title: "YAML Basics Quiz",
  lessonSlug: "yaml-basics",
  questions: [
    {
      id: "q1",
      question: "Which top-level keys does a docker-compose.yml file typically contain?",
      options: [
        "containers, storage, routing",
        "services, volumes, networks",
        "apps, data, connections",
        "images, mounts, ports",
      ],
      correctIndex: 1,
      explanation:
        "A `docker-compose.yml` file has three top-level keys: `services` (defines containers), `volumes` (defines named storage), and `networks` (defines custom networks). Only `services` is required; `volumes` and `networks` are optional.",
    },
    {
      id: "q2",
      question: "How do you define an environment variable in a Compose service?",
      options: [
        "vars:\n  - DB_HOST=mysql",
        "env:\n  DB_HOST: mysql",
        "environment:\n  DB_HOST: mysql",
        "config:\n  DB_HOST: mysql",
      ],
      correctIndex: 2,
      explanation:
        "The `environment` key sets environment variables for a service. You can use the map syntax (`DB_HOST: mysql`) or the list syntax (`- DB_HOST=mysql`). The map syntax is generally more readable.",
    },
    {
      id: "q3",
      question: "What is the correct syntax for mapping port 80 on the host to port 3000 in the container using Compose?",
      options: [
        "ports: \"80:3000\"",
        "ports:\n  - \"80:3000\"",
        "port_map: 80->3000",
        "expose:\n  - 80:3000",
      ],
      correctIndex: 1,
      explanation:
        "In Compose, port mappings are defined under `ports` as a list of strings in `HOST:CONTAINER` format. `expose` is different — it only exposes ports to linked containers without publishing them to the host.",
    },
    {
      id: "q4",
      question: "What does indentation represent in YAML?",
      options: [
        "Code comments",
        "Line numbering",
        "Nesting and hierarchy of data structures",
        "String formatting",
      ],
      correctIndex: 2,
      explanation:
        "In YAML, indentation (spaces, not tabs) defines the structure and nesting of data. Items at the same indentation level are siblings; deeper indentation means a child of the item above. This is why incorrect indentation breaks YAML parsing.",
    },
    {
      id: "q5",
      question:
        "How do you reference a variable from the host environment or a `.env` file in docker-compose.yml?",
      options: [
        "${VAR_NAME}",
        "$VAR_NAME",
        "{{VAR_NAME}}",
        "%VAR_NAME%",
      ],
      correctIndex: 0,
      explanation:
        "Compose uses `${VAR_NAME}` syntax for variable interpolation. Values are resolved from the shell environment or a `.env` file in the same directory. Use `$${VAR_NAME}` to escape and include a literal `$` in the value.",
    },
  ],
};