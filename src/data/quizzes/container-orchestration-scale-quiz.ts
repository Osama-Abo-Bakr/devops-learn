import type { Quiz } from "@/types";

export const containerOrchestrationScaleQuiz: Quiz = {
  id: "container-orchestration-scale-quiz",
  title: "Container Orchestration at Scale Quiz",
  lessonSlug: "container-orchestration-scale",
  questions: [
    {
      id: "orch-q1",
      question: "Why is a service mesh (e.g., Istio) used in multi-cluster Kubernetes setups?",
      options: [
        "To replace Kubernetes Services entirely",
        "To provide cross-cluster traffic management, mTLS, and observability without code changes",
        "To make pods run faster by caching network requests",
        "To eliminate the need for Ingress controllers",
      ],
      correctIndex: 1,
      explanation: "A service mesh provides cross-cluster communication, mutual TLS encryption, traffic management (retries, circuit breaking), and observability (distributed tracing) — all as infrastructure concerns without modifying application code.",
    },
    {
      id: "orch-q2",
      question: "Which pattern is used for cross-cluster service discovery in multi-cluster Kubernetes deployments?",
      options: [
        "Each cluster maintains its own etcd and never shares service information",
        "Global DNS with consistent domain naming (e.g., service.namespace.cluster.local) combined with service mesh federation to resolve services across clusters",
        "Manually updating /etc/hosts files in every pod to point to remote services",
        "Using a single shared API server that all clusters connect to",
      ],
      correctIndex: 1,
      explanation:
        "Cross-cluster service discovery relies on global DNS records that resolve service names across clusters (e.g., using external-dns or multi-cluster DNS). Service mesh federation (like Istio multi-cluster) extends this by enabling automatic cross-cluster traffic routing, load balancing, and mTLS between services in different clusters without manual DNS or network configuration.",
    },
    {
      id: "orch-q3",
      question: "How does Istio's sidecar injection work, and what is the difference between automatic and manual injection?",
      options: [
        "Automatic injection adds the sidecar at build time; manual injection adds it during pod scheduling",
        "Automatic injection uses a mutating webhook to inject the Envoy sidecar into pods at creation time based on namespace labels; manual injection uses `istioctl kube-inject` to modify the pod spec before applying it",
        "There is no difference — both require modifying the Dockerfile",
        "Automatic injection requires annotating every pod; manual injection requires only a cluster-level config map",
      ],
      correctIndex: 1,
      explanation:
        "Istio's automatic sidecar injection uses a Kubernetes mutating admission webhook. When a namespace is labeled with `istio-injection=enabled`, the webhook intercepts pod creation requests and injects the Envoy sidecar container into the pod spec. Manual injection uses `istioctl kube-inject -f deployment.yaml` to modify the YAML before applying it. Automatic injection is preferred for production as it ensures no pods are accidentally created without the sidecar.",
    },
    {
      id: "orch-q4",
      question: "What is the purpose of the PersistentVolume + PersistentVolumeClaim pattern?",
      options: [
        "To make pods stateless and easier to restart",
        "To decouple storage lifecycle from pod lifecycle so data survives pod restarts",
        "To increase pod startup speed by pre-loading data",
        "To share the same volume across all pods in a namespace",
      ],
      correctIndex: 1,
      explanation: "PVs represent actual storage (EBS, GCE PD, NFS). PVCs are requests for storage. The PV/PVC pattern decouples storage from pods — when a pod is deleted and recreated, the PVC rebinds to the same PV, preserving data.",
    },
    {
      id: "orch-q5",
      question: "What is the difference between active-passive and active-active multi-cluster architectures?",
      options: [
        "Active-passive uses 2 clusters; active-active uses 3 or more",
        "Active-passive routes traffic to the DR cluster only on failure; active-active serves from both clusters simultaneously",
        "Active-passive is cheaper; active-active is more secure",
        "There is no practical difference — both handle traffic the same way",
      ],
      correctIndex: 1,
      explanation: "In active-passive, one cluster handles all traffic while the other stands by for failover. In active-active, both clusters serve traffic simultaneously (often with geo-routing), providing lower latency and higher availability at the cost of complexity.",
    },
    {
      id: "orch-q6",
      question:
        "You need to route 90% of traffic to v1 and 10% to v2 of your service in Istio. Which resource do you configure?",
      options: [
        "A Kubernetes Service with weighted endpoints",
        "An Istio VirtualService with weight-based routing rules",
        "An Istio DestinationRule with traffic splitting annotations",
        "A Kubernetes Ingress with canary-weight annotations",
      ],
      correctIndex: 1,
      explanation:
        "In Istio, traffic splitting is configured in the VirtualService resource using the `weight` field on route destinations. You define multiple `route` entries for the same host, each pointing to a different subset (defined in the DestinationRule) with assigned weights that must sum to 100. DestinationRule defines the subsets (e.g., v1, v2) based on labels, while the VirtualService controls the routing percentages.",
    },
    {
      id: "orch-q7",
      question:
        "What is the role of KubeFed (Kubernetes Federation) in multi-cluster architectures?",
      options: [
        "It replaces the Kubernetes API server with a federated control plane",
        "It provides a single control plane to manage multiple Kubernetes clusters, enabling federated resource distribution, cross-cluster service discovery, and workload placement",
        "It encrypts all traffic between clusters using mTLS",
        "It merges multiple clusters into a single logical cluster with shared etcd",
      ],
      correctIndex: 1,
      explanation:
        "KubeFed (Kubernetes Federation v2) provides a higher-level control plane that manages resources across multiple Kubernetes clusters. It enables federated deployment (distributing workloads across clusters), cross-cluster DNS for service discovery, and replica scheduling policies. An alternative approach is shared-ingress multi-cluster, where a global ingress controller routes traffic to the nearest healthy cluster. KubeFed was archived as a CNCF sandbox project, but the pattern of federated multi-cluster management remains relevant.",
    },
    {
      id: "orch-q8",
      question:
        "How does dynamic PV provisioning with a StorageClass work in Kubernetes?",
      options: [
        "An administrator must manually create PersistentVolumes for each PVC before pods can start",
        "A StorageClass defines a provisioner (e.g., AWS EBS, GCE PD) and parameters; when a PVC references the StorageClass, the provisioner automatically creates a PersistentVolume",
        "StorageClass creates PersistentVolumes at cluster startup regardless of PVCs",
        "Dynamic provisioning only works with local storage on the node",
      ],
      correctIndex: 1,
      explanation:
        "Dynamic provisioning eliminates the need for administrators to pre-create PersistentVolumes. A StorageClass specifies a storage provisioner (e.g., `kubernetes.io/aws-ebs` for AWS EBS, `kubernetes.io/gce-pd` for GCE Persistent Disks) along with parameters like volume type and IOPS. When a PVC references a StorageClass via `storageClassName`, the provisioner automatically creates the underlying storage resource and a matching PersistentVolume, binding it to the PVC. This on-demand approach scales storage management efficiently.",
    },
  ],
};