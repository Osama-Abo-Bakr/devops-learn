import type { Quiz } from "@/types";

export const rbacNetworkPoliciesQuiz: Quiz = {
  id: "rbac-network-policies-quiz",
  title: "RBAC & Network Policies Quiz",
  lessonSlug: "rbac-network-policies",
  questions: [
    {
      id: "q1",
      question:
        "What is the difference between a Role and a ClusterRole in Kubernetes RBAC?",
      options: [
        "A Role grants write permissions; a ClusterRole grants read-only permissions",
        "A Role is namespace-scoped; a ClusterRole is cluster-scoped",
        "A Role is for ServiceAccounts; a ClusterRole is for Users",
        "A Role can only define one rule; a ClusterRole can define many",
      ],
      correctIndex: 1,
      explanation:
        "A `Role` is namespace-scoped — it defines permissions within a single namespace. A `ClusterRole` is cluster-scoped — it can define permissions on cluster-wide resources (like nodes) or be bound across all namespaces via a `ClusterRoleBinding`.",
    },
    {
      id: "q2",
      question:
        "What does a RoleBinding do?",
      options: [
        "Creates a new Role with default permissions",
        "Binds a Role or ClusterRole to subjects (users, groups, or ServiceAccounts) within a namespace",
        "Defines network traffic rules between Pods",
        "Creates a new ServiceAccount and assigns it to a Deployment",
      ],
      correctIndex: 1,
      explanation:
        "A `RoleBinding` binds a `Role` (or `ClusterRole`) to subjects within a specific namespace. Use `ClusterRoleBinding` to bind a `ClusterRole` across all namespaces. The subject can be a `User`, `Group`, or `ServiceAccount`.",
    },
    {
      id: "q3",
      question:
        "In a NetworkPolicy, what does the `ingress` section control?",
      options: [
        "Outgoing traffic from the selected Pods",
        "Incoming traffic to the selected Pods",
        "Both incoming and outgoing traffic",
        "Traffic between the cluster and external services",
      ],
      correctIndex: 1,
      explanation:
        "The `ingress` section controls incoming traffic TO the Pods selected by the policy's `podSelector`. The `egress` section controls outgoing traffic FROM those Pods. If both are defined, the policy applies to both directions. If a NetworkPolicy has no `ingress` section, all ingress traffic is allowed (unless another policy restricts it).",
    },
    {
      id: "q4",
      question:
        "What happens when a Pod is selected by a NetworkPolicy but no rules are defined in the policy?",
      options: [
        "All traffic to and from the Pod is allowed",
        "All traffic to and from the Pod is denied — the policy acts as a deny-all rule",
        "Only DNS traffic is allowed",
        "The NetworkPolicy is ignored and has no effect",
      ],
      correctIndex: 1,
      explanation:
        "If a Pod is selected by a NetworkPolicy but the policy defines no `ingress` or `egress` rules (or defines empty rule arrays), all traffic in those directions is denied. This is the foundation of the default-deny pattern: apply a policy with no rules to block all traffic, then add allow rules as needed.",
    },
    {
      id: "q5",
      question:
        "Which RBAC best practice should you follow for Production clusters?",
      options: [
        "Grant cluster-admin to all developers for convenience",
        "Use the default ServiceAccount with elevated permissions",
        "Apply the principle of least privilege — grant only the specific permissions needed for each ServiceAccount",
        "Disable RBAC entirely to simplify cluster management",
      ],
      correctIndex: 2,
      explanation:
        "Follow the principle of least privilege: create dedicated ServiceAccounts for each workload, bind narrow Roles with only the permissions needed, and avoid using `cluster-admin` or wildcard (`*`) verbs and resources. Audit RBAC with `kubectl auth can-i --list` to verify what a ServiceAccount can actually do.",
    },
  ],
};