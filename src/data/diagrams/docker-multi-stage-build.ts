import type { DiagramConfig } from "@/types";

export const dockerMultiStageBuild: DiagramConfig = {
  id: "docker-multi-stage-build",
  title: "Docker Multi-Stage Build",
  viewport: { x: 0, y: 0, zoom: 0.75 },
  nodes: [
    {
      id: "build-stage",
      position: { x: 150, y: 50 },
      data: {
        type: "stage",
        label: "Build Stage",
        details: {
          description: "Full SDK with dev tools — not shipped",
          stageIndex: 1,
          config: {
            base: "node:20",
            steps: "npm install, tsc compile",
            size: "~1.2GB",
          },
        },
      },
    },
    {
      id: "runtime-stage",
      position: { x: 450, y: 50 },
      data: {
        type: "stage",
        label: "Runtime Stage",
        details: {
          description: "Minimal image — only what is needed to run",
          stageIndex: 2,
          config: {
            base: "alpine:3.19",
            steps: "COPY binary only",
            size: "~45MB",
          },
        },
      },
    },
    {
      id: "final-image",
      position: { x: 300, y: 210 },
      data: {
        type: "container",
        label: "Final Image: 45MB",
        details: {
          image: "my-app:latest",
          description: "Tiny production image with only the compiled binary",
          status: "Ready",
        },
      },
    },
  ],
  edges: [
    {
      id: "e-copy-from",
      source: "build-stage",
      target: "runtime-stage",
      data: { type: "copyFrom", label: "COPY --from=build /app/dist /app/dist" },
    },
    {
      id: "e-runtime-final",
      source: "runtime-stage",
      target: "final-image",
      data: { type: "dataFlow", label: "produces" },
    },
  ],
  steps: [
    {
      nodeIds: ["build-stage"],
      edgeIds: [],
      label: "Build Stage",
    },
    {
      nodeIds: ["runtime-stage"],
      edgeIds: [],
      label: "Runtime Stage",
    },
    {
      nodeIds: [],
      edgeIds: ["e-copy-from"],
      label: "COPY --from",
    },
    {
      nodeIds: ["final-image"],
      edgeIds: ["e-runtime-final"],
      label: "Final Image",
    },
  ],
};