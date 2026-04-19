"use client";

import dynamic from "next/dynamic";
import type { CommandHandler } from "@/types";

const TerminalSimulator = dynamic(
  () => import("@/components/terminal/TerminalSimulator"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-lg border border-gray-700 bg-gray-950">
        <div className="animate-pulse text-gray-500">Loading terminal...</div>
      </div>
    ),
  },
);

const playgroundCommands: Record<string, CommandHandler> = {
  "kubectl get": {
    output: (args: string[]) => {
      if (args[0] === "pods") return "NAME                     READY   STATUS    RESTARTS   AGE\nnginx-deploy-abc123      1/1     Running   0          2h\nweb-app-def456          1/1     Running   0          1h";
      if (args[0] === "svc" || args[0] === "services") return "NAME         TYPE           EXTERNAL-IP   PORT(S)        AGE\nnginx-svc   LoadBalancer   10.0.0.1      80:30000/TCP   2h";
      return `Resource list for: ${args.join(" ")}`;
    },
  },
  "kubectl describe": {
    output: (args: string[]) => `Describing ${args.join(" ")}...\nName: ${args[1] || "resource"}\nStatus: Running`,
  },
  "kubectl apply": {
    output: () => "deployment.apps/nginx created",
  },
  help: {
    output: () => `Available commands:
  Docker: docker ps, docker images, docker run, docker stop, docker pull, docker exec, docker logs
  Docker Compose: docker compose up, docker compose down
  Filesystem: ls, cd, cat, pwd, echo
  Kubernetes: kubectl get, kubectl describe, kubectl apply
  Other: help, clear`,
  },
  clear: {
    output: "__CLEAR__",
  },
};

export default function PlaygroundPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Terminal Playground</h1>
        <p className="mt-2 text-gray-400">
          Practice Docker and Kubernetes commands freely. No challenges, no scoring
          — just explore. Docker commands use a stateful simulation engine.
        </p>
      </div>

      <TerminalSimulator
        commands={playgroundCommands}
        useSimulationEngine
        prompt="$"
      />
    </div>
  );
}