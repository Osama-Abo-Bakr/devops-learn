import type { Quiz } from "@/types";

export const k8sStatefulsetsJobsQuiz: Quiz = {
  id: "k8s-statefulsets-jobs-quiz",
  title: "StatefulSets and Jobs Quiz",
  lessonSlug: "statefulsets-jobs",
  questions: [
    {
      id: "q1",
      question:
        "When should you use a StatefulSet instead of a Deployment?",
      options: [
        "When you need horizontal scaling for a stateless web application",
        "When each replica needs a stable network identity and its own persistent storage",
        "When you want faster rollout speed with RollingUpdate strategy",
        "When you only need a single replica of your application",
      ],
      correctIndex: 1,
      explanation:
        "StatefulSets are designed for workloads that require stable network identities (predictable DNS names like pod-0, pod-1), ordered deployment and scaling, and individual persistent storage per replica via volumeClaimTemplates. Deployments are for stateless workloads where replicas are interchangeable.",
    },
    {
      id: "q2",
      question:
        "What is the difference between OrderedReady and Parallel pod management policies in a StatefulSet?",
      options: [
        "OrderedReady creates Pods sequentially and waits for each to be Ready; Parallel creates all Pods simultaneously",
        "OrderedReady creates Pods simultaneously; Parallel creates them one at a time",
        "OrderedReady only works with 2 replicas; Parallel works with any number",
        "There is no difference — both policies behave identically in practice",
      ],
      correctIndex: 0,
      explanation:
        "With `OrderedReady` (the default), the StatefulSet controller creates pod-0, waits until it is Running and Ready, then creates pod-1, and so on. With `Parallel`, all Pods are created simultaneously without waiting for previous ones to become Ready. Parallel is useful when you don't need ordered startup, such as for distributed data stores that can bootstrap independently.",
    },
    {
      id: "q3",
      question:
        "What does setting `clusterIP: None` on a Service do for a StatefulSet?",
      options: [
        "It disables the Service entirely so no traffic can reach the Pods",
        "It creates a Headless Service that returns the Pod IPs directly, enabling stable DNS names like stateful-app-0.headless-svc.namespace.svc.cluster.local",
        "It assigns a random external IP to each Pod in the StatefulSet",
        "It changes the Service type from ClusterIP to NodePort automatically",
      ],
      correctIndex: 1,
      explanation:
        "A Headless Service (`clusterIP: None`) does not allocate a virtual IP. Instead, DNS queries for the Service return the individual Pod IPs. For StatefulSets, this means each Pod gets a stable DNS name following the pattern `<pod-name>.<headless-service>.<namespace>.svc.cluster.local`. This is essential for stateful applications like databases where peers need to address each other by name.",
    },
    {
      id: "q4",
      question:
        "What is the purpose of `volumeClaimTemplates` in a StatefulSet?",
      options: [
        "It shares a single PersistentVolumeClaim across all replicas",
        "It creates one PersistentVolumeClaim per replica, each bound to its own PersistentVolume, providing dedicated storage for every Pod",
        "It automatically deletes PersistentVolumes when a Pod is terminated",
        "It creates ConfigMaps from volume templates for the StatefulSet",
      ],
      correctIndex: 1,
      explanation:
        "Each replica in a StatefulSet gets its own PersistentVolumeClaim created from `volumeClaimTemplates`. When pod-0 is created, PVC `data-stateful-app-0` is created; for pod-1, `data-stateful-app-1`, and so on. This ensures each Pod has dedicated storage that persists across Pod restarts and rescheduling, which is critical for databases and other stateful applications.",
    },
    {
      id: "q5",
      question:
        "In a Job spec, what do `completions` and `parallelism` control?",
      options: [
        "completions sets how many times a single Pod retries on failure; parallelism sets how many containers run per Pod",
        "completions sets the total number of successful Pod runs needed; parallelism sets how many Pods run concurrently",
        "completions sets the total number of Pods the Job can create; parallelism sets the maximum CPU cores per Pod",
        "completions sets the timeout for the Job; parallelism sets the number of Jobs created",
      ],
      correctIndex: 1,
      explanation:
        "`completions` defines the total number of successful Pod runs the Job needs. `parallelism` defines how many Pods the Job runs at the same time. For example, `completions: 6, parallelism: 2` means the Job needs 6 successful completions and will run up to 2 Pods at a time. When `parallelism` equals `completions`, all Pods start simultaneously.",
    },
    {
      id: "q6",
      question:
        "What does the schedule field `0 2 * * *` mean in a CronJob?",
      options: [
        "Every 2 minutes",
        "At 2:00 AM every day",
        "At 2:00 PM on the 1st of every month",
        "Every 2 hours",
      ],
      correctIndex: 1,
      explanation:
        "CronJob schedules use standard cron format: `minute hour day-of-month month day-of-week`. `0 2 * * *` means minute=0, hour=2, and `*` for every day-of-month, month, and day-of-week. So it runs at 2:00 AM every single day. Remember: `*/5 * * * *` would mean every 5 minutes, and `0 */2 * * *` would mean every 2 hours.",
    },
    {
      id: "q7",
      question:
        "How does a Job handle Pod failures when `restartPolicy` is set to `Never` vs `OnFailure`?",
      options: [
        "Both recreate the Pod on the same node when it fails",
        "With Never, the Job creates a new Pod on potentially a different node; with OnFailure, Kubernetes restarts the same Pod container in place",
        "With Never, the Job is marked as failed immediately; with OnFailure, it retries up to backoffLimit times on the same Pod",
        "Neither policy allows retries — both rely on backoffLimit to handle failures",
      ],
      correctIndex: 1,
      explanation:
        "When `restartPolicy: Never`, a failed Pod is not restarted. Instead, the Job controller creates a brand new Pod (potentially on a different node). When `restartPolicy: OnFailure`, the same Pod's container is restarted in place. The `backoffLimit` controls the total number of retries regardless of restartPolicy — once exceeded, the Job is marked as failed.",
    },
    {
      id: "q8",
      question:
        "You have a Deployment running a PostgreSQL database with 3 replicas, but the replicas keep corrupting data because they all write to the same PVC. What must you change to migrate to a StatefulSet?",
      options: [
        "Just change `kind: Deployment` to `kind: StatefulSet` — everything else stays the same",
        "Change to a StatefulSet, add a Headless Service (clusterIP: None), add volumeClaimTemplates, and ensure the app supports leader-follower topology or only one replica writes at a time",
        "Add a PersistentVolume to the Deployment and set replicas to 1",
        "Use a HorizontalPodAutoscaler with a shared PVC instead",
      ],
      correctIndex: 1,
      explanation:
        "Migrating from a Deployment to a StatefulSet requires: (1) Creating a Headless Service with `clusterIP: None` referenced via `serviceName` so Pods get stable DNS names. (2) Adding `volumeClaimTemplates` so each replica gets its own PVC instead of sharing one. (3) Ensuring the application itself supports distributed topology — for PostgreSQL, you typically need a primary that accepts writes and replicas that only read. A StatefulSet provides the infrastructure for stable identity and storage, but the application must also handle distributed coordination.",
    },
  ],
};