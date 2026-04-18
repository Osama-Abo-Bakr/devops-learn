import type { Quiz } from "@/types";

export const securityBestPracticesQuiz: Quiz = {
  id: "security-best-practices-quiz",
  title: "Security Best Practices Quiz",
  lessonSlug: "security-best-practices",
  questions: [
    {
      id: "q1",
      question:
        "What is an SBOM and why is it important for container security?",
      options: [
        "A Secure Binary Object Model — a runtime security policy",
        "A Software Bill of Materials — a list of all components and dependencies in an image, used to track vulnerabilities",
        "A System Baseline Operations Manual — a document for compliance audits",
        "A Secure Build Orchestrator Module — a tool for signing images",
      ],
      correctIndex: 1,
      explanation:
        "An SBOM (Software Bill of Materials) is a machine-readable list of all packages, libraries, and dependencies in a container image. Tools like `syft` generate SBOMs, and `grype` scans them for known CVEs. SBOMs are critical for supply chain security — they let you quickly determine if a newly disclosed vulnerability affects your images.",
    },
    {
      id: "q2",
      question:
        "Which tool scans container images for known vulnerabilities?",
      options: [
        "cosign",
        "Trivy",
        "helm",
        "kubectl",
      ],
      correctIndex: 1,
      explanation:
        "`Trivy` is a vulnerability scanner for container images, filesystems, and repositories. Run `trivy image nginx:latest` to scan for CVEs. Other options include `Grype` (from Anchore) and `Snyk Container`. Integrate scanning into CI pipelines to block vulnerable images before they reach the registry.",
    },
    {
      id: "q3",
      question:
        "What is the purpose of image signing with tools like cosign or notation?",
      options: [
        "To compress the image size for faster pulls",
        "To verify that an image was built by a trusted source and has not been tampered with",
        "To encrypt the image layers so only authorized users can pull them",
        "To automatically update the image to the latest version",
      ],
      correctIndex: 1,
      explanation:
        "Image signing creates a cryptographic signature that proves an image was built by a trusted source and has not been altered. `cosign` (from Sigstore) and `notation` (from Notary v2) sign images and store signatures in the registry. Admission controllers like `Kyverno` or `Gatekeeper` can enforce that only signed images are deployed.",
    },
    {
      id: "q4",
      question:
        "What is the role of an admission controller in Kubernetes security?",
      options: [
        "It manages network traffic between Pods",
        "It intercepts API requests to the kube-apiserver and can validate or mutate objects before they are persisted",
        "It provides runtime monitoring of container processes",
        "It encrypts data at rest in etcd",
      ],
      correctIndex: 1,
      explanation:
        "Admission controllers are plugins that intercept requests to the Kubernetes API server before objects are created or updated. They can validate (reject non-compliant resources) or mutate (modify resources to meet policy). Examples: `LimitRanger` (enforce resource limits), `PodSecurity` (restrict security contexts), and custom controllers via `ValidatingWebhookConfiguration` and `MutatingWebhookConfiguration`.",
    },
    {
      id: "q5",
      question:
        "Which practice is part of runtime security for containers?",
      options: [
        "Scanning images at build time only",
        "Monitoring process execution and syscall activity inside running containers to detect anomalous behavior",
        "Signing images with cosign before pushing",
        "Generating SBOMs during CI builds",
      ],
      correctIndex: 1,
      explanation:
        "Runtime security monitors live container behavior — process execution, syscalls, network connections, and file access — to detect anomalies like reverse shells, privilege escalation, or unexpected binary execution. Tools like `Falco` use kernel-level probes (eBPF or kernel module) to generate alerts on suspicious activity. Build-time scanning and signing are supply chain security, not runtime security.",
    },
  ],
};