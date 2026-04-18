import type { DiagramConfig } from "@/types";

export const securityBestPractices: DiagramConfig = {
  id: "security-best-practices",
  title: "Security Best Practices",
  viewport: { x: 0, y: 0, zoom: 0.75 },
  nodes: [
    {
      id: "source-code",
      position: { x: 50, y: 130 },
      data: {
        type: "container",
        label: "Source Code",
        details: {
          description: "Developer commits code to version control",
        },
      },
    },
    {
      id: "image-scanner",
      position: { x: 250, y: 130 },
      data: {
        type: "container",
        label: "Image Scanner",
        details: {
          description: "Trivy/Grype scans for known CVEs in dependencies",
          config: {
            scanner: "Trivy",
            severity: "CRITICAL,HIGH",
          },
        },
      },
    },
    {
      id: "image-signer",
      position: { x: 450, y: 130 },
      data: {
        type: "container",
        label: "Image Signer",
        details: {
          description: "Cosign/Notary signs the image for provenance verification",
          config: {
            tool: "Cosign",
            keyless: "fulcio + rekor",
          },
        },
      },
    },
    {
      id: "registry",
      position: { x: 650, y: 130 },
      data: {
        type: "container",
        label: "Registry",
        details: {
          description: "Trusted registry stores signed, scanned images",
          config: {
            registry: "ECR / GCR / Docker Hub",
            policy: "only signed images",
          },
        },
      },
    },
    {
      id: "runtime",
      position: { x: 650, y: 310 },
      data: {
        type: "security",
        label: "Runtime Protection",
        details: {
          description: "Falco/runtime security monitors container behavior in production",
          securityLevel: "runtime",
          config: {
            tool: "Falco",
            alerts: "suspicious process, file access, network",
          },
        },
      },
    },
  ],
  edges: [
    {
      id: "e-source-scanner",
      source: "source-code",
      target: "image-scanner",
      data: { type: "pipeline", label: "CI: build + scan" },
    },
    {
      id: "e-scanner-signer",
      source: "image-scanner",
      target: "image-signer",
      data: { type: "pipeline", label: "pass: no critical CVEs" },
    },
    {
      id: "e-signer-registry",
      source: "image-signer",
      target: "registry",
      data: { type: "pipeline", label: "signed image" },
    },
    {
      id: "e-runtime-registry",
      source: "runtime",
      target: "registry",
      data: { type: "securityEdge", label: "verifies pull policy" },
    },
  ],
  steps: [
    {
      nodeIds: ["source-code"],
      edgeIds: [],
      label: "Source Code",
    },
    {
      nodeIds: ["image-scanner"],
      edgeIds: ["e-source-scanner"],
      label: "Vulnerability Scan",
    },
    {
      nodeIds: ["image-signer"],
      edgeIds: ["e-scanner-signer"],
      label: "Image Signing",
    },
    {
      nodeIds: ["registry"],
      edgeIds: ["e-signer-registry"],
      label: "Push to Registry",
    },
    {
      nodeIds: ["runtime"],
      edgeIds: ["e-runtime-registry"],
      label: "Runtime Protection",
    },
  ],
};