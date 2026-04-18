import type { DiagramConfig } from "@/types";

export const devopsCicdPipeline: DiagramConfig = {
  id: "devops-cicd-pipeline",
  title: "CI/CD Pipeline with Containers",
  viewport: { x: 0, y: 0, zoom: 0.7 },
  nodes: [
    {
      id: "stage-push",
      position: { x: 0, y: 100 },
      data: {
        type: "pipeline",
        label: "Code Push",
        details: {
          description: "Developer pushes code to Git repository",
          stageIndex: 1,
        },
      },
    },
    {
      id: "stage-build",
      position: { x: 200, y: 100 },
      data: {
        type: "pipeline",
        label: "Build Image",
        details: {
          description: "docker build creates container image from Dockerfile",
          stageIndex: 2,
        },
      },
    },
    {
      id: "stage-test",
      position: { x: 400, y: 100 },
      data: {
        type: "pipeline",
        label: "Run Tests",
        details: {
          description: "Unit tests, integration tests inside containers",
          stageIndex: 3,
        },
      },
    },
    {
      id: "stage-scan",
      position: { x: 600, y: 100 },
      data: {
        type: "pipeline",
        label: "Scan CVEs",
        details: {
          description: "Trivy/Grype vulnerability scanning on image",
          stageIndex: 4,
        },
      },
    },
    {
      id: "stage-registry",
      position: { x: 800, y: 100 },
      data: {
        type: "pipeline",
        label: "Push Registry",
        details: {
          description: "docker push to container registry (Docker Hub / ECR / GCR)",
          stageIndex: 5,
        },
      },
    },
    {
      id: "stage-deploy",
      position: { x: 1000, y: 100 },
      data: {
        type: "pipeline",
        label: "Deploy",
        details: {
          description: "kubectl apply / helm upgrade to target cluster",
          stageIndex: 6,
        },
      },
    },
  ],
  edges: [
    {
      id: "e-push-build",
      source: "stage-push",
      target: "stage-build",
      data: { type: "pipeline", label: "trigger" },
    },
    {
      id: "e-build-test",
      source: "stage-build",
      target: "stage-test",
      data: { type: "pipeline", label: "on success" },
    },
    {
      id: "e-test-scan",
      source: "stage-test",
      target: "stage-scan",
      data: { type: "pipeline", label: "on pass" },
    },
    {
      id: "e-scan-registry",
      source: "stage-scan",
      target: "stage-registry",
      data: { type: "pipeline", label: "no critical CVEs" },
    },
    {
      id: "e-registry-deploy",
      source: "stage-registry",
      target: "stage-deploy",
      data: { type: "pipeline", label: "tagged image" },
    },
  ],
  steps: [
    {
      nodeIds: ["stage-push"],
      edgeIds: [],
      label: "1. Code Push",
    },
    {
      nodeIds: ["stage-build"],
      edgeIds: ["e-push-build"],
      label: "2. Build Image",
    },
    {
      nodeIds: ["stage-test"],
      edgeIds: ["e-build-test"],
      label: "3. Run Tests",
    },
    {
      nodeIds: ["stage-scan"],
      edgeIds: ["e-test-scan"],
      label: "4. Scan CVEs",
    },
    {
      nodeIds: ["stage-registry"],
      edgeIds: ["e-scan-registry"],
      label: "5. Push Registry",
    },
    {
      nodeIds: ["stage-deploy"],
      edgeIds: ["e-registry-deploy"],
      label: "6. Deploy",
    },
  ],
  d3Variant: "pipeline",
};