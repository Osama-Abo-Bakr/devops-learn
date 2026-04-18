import type { SkillNodeState, Topic } from "@/types";
import type { Node, Edge } from "@xyflow/react";

/** Data carried by a skill-tree node */
export interface SkillNodeData {
  [key: string]: unknown;
  label: string;
  slug: string;
  topic: Topic;
  level: "beginner" | "intermediate" | "advanced";
  state: SkillNodeState;
  quizScore: number | null;
  /** Emoji icon for the lesson */
  icon: string;
}

export type SkillTreeNode = Node<SkillNodeData, "skillNode">;

/** All lesson definitions for the skill tree (top-to-bottom order) */
const TREE_LESSONS: {
  slug: string;
  label: string;
  topic: Topic;
  level: "beginner" | "intermediate" | "advanced";
  icon: string;
}[] = [
  // Docker (6 lessons)
  { slug: "containers-101", label: "Containers 101", topic: "docker", level: "beginner", icon: "🐳" },
  { slug: "dockerfile-basics", label: "Dockerfile Basics", topic: "docker", level: "beginner", icon: "📝" },
  { slug: "volumes-networks", label: "Volumes & Networks", topic: "docker", level: "beginner", icon: "📂" },
  { slug: "multi-stage-builds", label: "Multi-Stage Builds", topic: "docker", level: "intermediate", icon: "🏗️" },
  { slug: "docker-security", label: "Docker Security", topic: "docker", level: "intermediate", icon: "🔒" },
  { slug: "production-patterns", label: "Production Patterns", topic: "docker", level: "advanced", icon: "🚀" },

  // Compose (5 lessons)
  { slug: "yaml-basics", label: "Compose YAML Basics", topic: "compose", level: "beginner", icon: "📄" },
  { slug: "multi-service", label: "Multi-Service Stacks", topic: "compose", level: "beginner", icon: "📦" },
  { slug: "compose-networks-volumes", label: "Networks & Volumes", topic: "compose", level: "intermediate", icon: "🔗" },
  { slug: "compose-env-scaling", label: "Env Vars & Scaling", topic: "compose", level: "intermediate", icon: "⚖️" },
  { slug: "compose-production", label: "Production Configs", topic: "compose", level: "advanced", icon: "🏭" },

  // Kubernetes (5 lessons)
  { slug: "pods-deployments", label: "Pods & Deployments", topic: "kubernetes", level: "beginner", icon: "☸️" },
  { slug: "services-ingress", label: "Services & Ingress", topic: "kubernetes", level: "beginner", icon: "🌐" },
  { slug: "configmaps-secrets", label: "ConfigMaps & Secrets", topic: "kubernetes", level: "intermediate", icon: "🔐" },
  { slug: "hpa-scaling", label: "HPA & Scaling", topic: "kubernetes", level: "intermediate", icon: "📈" },
  { slug: "rbac-network-policies", label: "RBAC & Network Policies", topic: "kubernetes", level: "advanced", icon: "🛡️" },

  // DevOps (4 lessons)
  { slug: "cicd-containers", label: "CI/CD with Containers", topic: "devops", level: "intermediate", icon: "🔄" },
  { slug: "helm-charts", label: "Helm Charts", topic: "devops", level: "intermediate", icon: "⛵" },
  { slug: "monitoring-observability", label: "Monitoring & Observability", topic: "devops", level: "advanced", icon: "📊" },
  { slug: "security-best-practices", label: "Security Best Practices", topic: "devops", level: "advanced", icon: "🛡️" },
];

/** Topic column positions (4 columns) */
const TOPIC_X: Record<Topic, number> = {
  docker: 200,
  compose: 450,
  kubernetes: 700,
  devops: 950,
};

/** Topic header emojis */
const TOPIC_HEADERS: Record<Topic, { label: string; icon: string }> = {
  docker: { label: "Docker Fundamentals", icon: "🐳" },
  compose: { label: "Docker Compose", icon: "📦" },
  kubernetes: { label: "Kubernetes Core", icon: "☸️" },
  devops: { label: "Advanced DevOps", icon: "🚀" },
};

const ROW_HEIGHT = 160;
const HEADER_Y = 60;

/** Build React Flow nodes with positions */
export function buildSkillTreeNodes(
  progress: Record<string, { status: string; quizBestScore: number | null }>,
): SkillTreeNode[] {
  const nodes: SkillTreeNode[] = [];

  // Topic header nodes
  for (const [topic, config] of Object.entries(TOPIC_HEADERS)) {
    nodes.push({
      id: `header-${topic}`,
      type: "skillNode",
      position: { x: TOPIC_X[topic as Topic], y: HEADER_Y },
      data: {
        label: config.label,
        slug: `header-${topic}`,
        topic: topic as Topic,
        level: "beginner",
        state: "completed" as SkillNodeState,
        quizScore: null,
        icon: config.icon,
      },
      draggable: false,
    });
  }

  // Lesson nodes — positioned within their topic column, top-to-bottom
  const topicLessons: Record<string, typeof TREE_LESSONS> = {};
  for (const lesson of TREE_LESSONS) {
    if (!topicLessons[lesson.topic]) topicLessons[lesson.topic] = [];
    topicLessons[lesson.topic].push(lesson);
  }

  for (const [topic, lessons] of Object.entries(topicLessons)) {
    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i];
      const lessonProgress = progress[lesson.slug];
      const state: SkillNodeState =
        lessonProgress?.status === "completed"
          ? "completed"
          : lessonProgress?.status === "in_progress"
            ? "available"
            : i === 0
              ? "available" // First lesson in each topic is always available
              : "locked";

      nodes.push({
        id: lesson.slug,
        type: "skillNode",
        position: {
          x: TOPIC_X[topic as Topic],
          y: HEADER_Y + 140 + i * ROW_HEIGHT,
        },
        data: {
          label: lesson.label,
          slug: lesson.slug,
          topic: lesson.topic,
          level: lesson.level,
          state,
          quizScore: lessonProgress?.quizBestScore ?? null,
          icon: lesson.icon,
        },
        draggable: false,
      });
    }
  }

  return nodes;
}

/** Unlock logic: a lesson is available if it's the first in its topic OR its prerequisite is completed */
function isLessonAvailable(
  slug: string,
  progress: Record<string, { status: string }>,
): boolean {
  const lessonIndex = TREE_LESSONS.findIndex((l) => l.slug === slug);
  if (lessonIndex === -1) return false;

  const lesson = TREE_LESSONS[lessonIndex];
  const topicLessons = TREE_LESSONS.filter((l) => l.topic === lesson.topic);
  const indexInTopic = topicLessons.indexOf(lesson);

  // DevOps requires K8s beginner lessons
  if (lesson.topic === "devops") {
    if (indexInTopic === 0) {
      // First DevOps lesson requires both K8s beginner lessons
      const k8sBeginner1 = progress["pods-deployments"]?.status === "completed";
      const k8sBeginner2 = progress["services-ingress"]?.status === "completed";
      return k8sBeginner1 && k8sBeginner2;
    }
    // Subsequent DevOps lessons require the previous DevOps lesson
    const prevSlug = topicLessons[indexInTopic - 1].slug;
    return progress[prevSlug]?.status === "completed";
  }

  // First lesson in each topic is always available
  if (indexInTopic === 0) return true;

  // Otherwise, previous lesson in topic must be completed
  const prevSlug = topicLessons[indexInTopic - 1].slug;
  return progress[prevSlug]?.status === "completed";
}

/** Build React Flow edges connecting nodes */
export function buildSkillTreeEdges(
  progress: Record<string, { status: string; quizBestScore: number | null }>,
): Edge[] {
  const edges: Edge[] = [];

  const topicLessons: Record<string, typeof TREE_LESSONS> = {};
  for (const lesson of TREE_LESSONS) {
    if (!topicLessons[lesson.topic]) topicLessons[lesson.topic] = [];
    topicLessons[lesson.topic].push(lesson);
  }

  // Vertical edges within each topic (previous → next)
  for (const [topic, lessons] of Object.entries(topicLessons)) {
    // Header → first lesson
    edges.push({
      id: `header-${topic}-to-${lessons[0].slug}`,
      source: `header-${topic}`,
      target: lessons[0].slug,
      type: "unlockEdge",
    });

    // Each lesson → next lesson
    for (let i = 0; i < lessons.length - 1; i++) {
      edges.push({
        id: `${lessons[i].slug}-to-${lessons[i + 1].slug}`,
        source: lessons[i].slug,
        target: lessons[i + 1].slug,
        type: "unlockEdge",
      });
    }
  }

  // Horizontal edges: K8s beginner → DevOps (prerequisites)
  edges.push({
    id: "pods-deployments-to-cicd-containers",
    source: "pods-deployments",
    target: "cicd-containers",
    type: "unlockEdge",
  });
  edges.push({
    id: "services-ingress-to-cicd-containers",
    source: "services-ingress",
    target: "cicd-containers",
    type: "unlockEdge",
  });

  // Horizontal edges: Docker → Compose (cross-reference)
  edges.push({
    id: "containers-101-to-yaml-basics",
    source: "containers-101",
    target: "yaml-basics",
    type: "unlockEdge",
  });

  return edges;
}

/** Re-calculate node states based on current progress */
export function computeNodeStates(
  progress: Record<string, { status: string; quizBestScore: number | null }>,
): SkillTreeNode[] {
  const nodes = buildSkillTreeNodes(progress);

  return nodes.map((node) => {
    if (node.id.startsWith("header-")) return node; // Headers stay completed

    const slug = node.data.slug;
    const lessonProgress = progress[slug];

    let state: SkillNodeState;
    if (lessonProgress?.status === "completed") {
      state = "completed";
    } else if (isLessonAvailable(slug, progress)) {
      state = "available";
    } else {
      state = "locked";
    }

    return {
      ...node,
      data: {
        ...node.data,
        state,
        quizScore: lessonProgress?.quizBestScore ?? null,
      },
    };
  });
}

export { TREE_LESSONS, TOPIC_X, ROW_HEIGHT, HEADER_Y };