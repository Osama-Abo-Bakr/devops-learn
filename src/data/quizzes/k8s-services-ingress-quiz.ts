import type { Quiz } from "@/types";

export const k8sServicesIngressQuiz: Quiz = {
  id: "k8s-services-ingress-quiz",
  title: "Kubernetes Services & Ingress Quiz",
  lessonSlug: "services-ingress",
  questions: [
    {
      id: "q1",
      question:
        "Which Service type exposes your app on a cluster-internal IP only?",
      options: [
        "NodePort",
        "LoadBalancer",
        "ExternalName",
        "ClusterIP",
      ],
      correctIndex: 3,
      explanation:
        "`ClusterIP` is the default Service type. It exposes the Service on a cluster-internal IP, making it reachable only from within the cluster. Use this for internal microservice communication.",
    },
    {
      id: "q2",
      question:
        "What does a Kubernetes Ingress resource do?",
      options: [
        "Creates a load balancer in the cloud provider",
        "Manages external access to Services, typically via HTTP/HTTPS path-based routing",
        "Assigns an external IP to every Pod",
        "Replaces the need for Services entirely",
      ],
      correctIndex: 1,
      explanation:
        "An Ingress manages external HTTP/HTTPS access to cluster Services. It can provide load balancing, SSL/TLS termination, and path-based routing (e.g., `/api` to one Service, `/web` to another). It requires an Ingress controller to function.",
    },
    {
      id: "q3",
      question:
        "How does an Ingress route traffic to `/api` to the `api-service` and `/web` to the `web-service`?",
      options: [
        "By using separate Ingress resources for each path",
        "By defining path rules with `path: /api` and `path: /web` in the same Ingress spec",
        "By setting different NodePort values for each Service",
        "By adding the `ingressPath` annotation to each Service",
      ],
      correctIndex: 1,
      explanation:
        "Path-based routing is configured in the Ingress spec under `http.paths`. Each entry specifies a `path` and a `backend` Service. Example: `path: /api` with `backend.service.name: api-service` and `path: /web` with `backend.service.name: web-service`.",
    },
    {
      id: "q4",
      question:
        "Where is TLS termination typically handled when using Ingress?",
      options: [
        "On each individual Pod via sidecar containers",
        "At the Ingress controller level using the TLS configuration in the Ingress resource",
        "On the kube-apiserver",
        "On the cloud provider's load balancer, never inside the cluster",
      ],
      correctIndex: 1,
      explanation:
        "TLS termination is handled by the Ingress controller using the TLS secret referenced in the Ingress resource's `tls` section. The secret contains the TLS certificate and key. Traffic between the Ingress controller and backend Services is typically unencrypted (HTTP).",
    },
    {
      id: "q5",
      question:
        "What happens if a Service's `selector` labels do not match any Pods?",
      options: [
        "Kubernetes creates new Pods automatically to match the selector",
        "The Service has no endpoints, and traffic is dropped with no backend available",
        "The Service falls back to the default backend defined in the cluster",
        "An error is thrown and the Service is not created",
      ],
      correctIndex: 1,
      explanation:
        "If a Service's `selector` does not match any Pod labels, the Service will have zero endpoints. Traffic sent to the Service's ClusterIP will be dropped because there are no backing Pods. You can verify with `kubectl get endpoints <service-name>`.",
    },
    {
      id: "q6",
      question:
        "You create a Service of type ClusterIP for your web application, but external clients cannot access it. You need HTTP routing with SSL termination for multiple services. What should you create?",
      options: [
        "Change the Service type to NodePort and expose each service on a separate port",
        "An Ingress resource with an Ingress controller (e.g., nginx-ingress) to provide HTTP/HTTPS routing, TLS termination, and name-based virtual hosting for multiple services behind a single IP",
        "A separate LoadBalancer Service for each application",
        "A NetworkPolicy to allow external traffic into the cluster",
      ],
      correctIndex: 1,
      explanation:
        "ClusterIP is only reachable inside the cluster. An Ingress resource, paired with an Ingress controller like nginx-ingress, provides external HTTP/HTTPS access with path-based routing, TLS termination, and host-based routing for multiple Services — all behind a single entry point IP. NodePort and LoadBalancer are alternatives but lack these Layer 7 features and don't scale well for multiple services.",
    },
  ],
};