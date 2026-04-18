// ============================================================
// DevOps Visual Learn — Core Type Definitions
// ============================================================

/** Difficulty level for lessons and modules */
export type Level = "beginner" | "intermediate" | "advanced";

/** Topic areas available in the platform */
export type Topic = "docker" | "compose" | "kubernetes" | "devops";

/** Supported locales */
export type Locale = "en" | "ar";

// -----------------------------------------------------------
// Lesson
// -----------------------------------------------------------

/** A single lesson within a module */
export interface Lesson {
  /** Human-readable title */
  title: string;
  /** URL-safe identifier, e.g. "containers-101" */
  slug: string;
  /** Which topic this lesson belongs to */
  module: Topic;
  /** Difficulty level */
  level: Level;
  /** Estimated duration, e.g. "30 min" */
  duration: string;
  /** Reference key to a DiagramConfig, e.g. "docker-container-basics" */
  diagram?: string;
  /** Reference key to a Challenge, e.g. "docker-ps-challenge" */
  challenge?: string;
  /** Reference key to a Quiz, e.g. "docker-basics-quiz" */
  quiz?: string;
  /** Short description for cards and metadata */
  description: string;
  /** Sort order within the module level */
  order: number;
}

// -----------------------------------------------------------
// Module
// -----------------------------------------------------------

/** A topic module (Docker, Compose, Kubernetes, DevOps) */
export interface Module {
  /** Machine key, e.g. "docker" */
  slug: Topic;
  /** Display name, e.g. "Docker Fundamentals" */
  title: string;
  /** Short description */
  description: string;
  /** Icon key for rendering */
  icon: string;
  /** Available levels in this module */
  levels: Level[];
  /** All lessons in this module */
  lessons: Lesson[];
}

// -----------------------------------------------------------
// Quiz
// -----------------------------------------------------------

/** A single multiple-choice question */
export interface QuizQuestion {
  /** Unique question ID within the quiz */
  id: string;
  /** The question text */
  question: string;
  /** Answer options */
  options: string[];
  /** Index of the correct option in the options array */
  correctIndex: number;
  /** Explanation shown after answering */
  explanation: string;
}

/** A quiz associated with a lesson */
export interface Quiz {
  /** Unique quiz key, e.g. "docker-basics-quiz" */
  id: string;
  /** Display title */
  title: string;
  /** Which lesson this quiz belongs to */
  lessonSlug: string;
  /** Ordered list of questions */
  questions: QuizQuestion[];
}

// -----------------------------------------------------------
// Challenge (Terminal)
// -----------------------------------------------------------

/** A single task within a terminal challenge */
export interface ChallengeTask {
  /** Unique task ID */
  id: string;
  /** Instruction shown to the user, e.g. "Stop the nginx container" */
  instruction: string;
  /** A command or pattern that completes this task */
  validCommand: string;
  /** Optional: more complex validation that checks command arguments */
  validateArgs?: (args: string[]) => boolean;
  /** Whether this task has been completed */
  completed: boolean;
}

/** A terminal challenge associated with a lesson */
export interface Challenge {
  /** Unique challenge key, e.g. "docker-ps-challenge" */
  id: string;
  /** Display title */
  title: string;
  /** Which lesson this challenge belongs to */
  lessonSlug: string;
  /** Initial simulated filesystem / container state (key-value) */
  initialState: Record<string, string>;
  /** Mapping of valid commands to their simulated output */
  commands: Record<string, CommandHandler>;
  /** Ordered tasks the user must complete */
  tasks: ChallengeTask[];
}

/** Handler for a simulated terminal command */
export interface CommandHandler {
  /** The output to display */
  output: string | ((args: string[]) => string);
  /** Optional: state changes after running this command */
  stateChange?: Record<string, string>;
  /** Optional: task IDs this command completes */
  completesTasks?: string[];
  /** Optional: validate args before marking task as complete */
  validateArgs?: (args: string[]) => boolean;
}

// -----------------------------------------------------------
// Diagram (React Flow)
// -----------------------------------------------------------

/** Node type discriminators for diagram nodes */
export type DiagramNodeType =
  | "container"
  | "pod"
  | "service"
  | "volume"
  | "network"
  | "layer"
  | "pipeline"
  | "security"
  | "ingress"
  | "config"
  | "stage"
  | "groupZone";

/** Data carried by a diagram node */
export interface DiagramNodeData {
  /** Node type discriminator */
  type: DiagramNodeType;
  /** Display label */
  label: string;
  /** Detailed information shown in sidebar on click */
  details?: {
    description?: string;
    ports?: string[];
    env?: Record<string, string>;
    image?: string;
    status?: string;
    config?: Record<string, string>;
    cacheStatus?: "hit" | "miss" | "rebuild";
    securityLevel?: string;
    configType?: "configmap" | "secret";
    mountType?: "env" | "file" | "volume";
    stageIndex?: number;
  };
}

/** Edge type discriminators */
export type DiagramEdgeType =
  | "dataFlow"
  | "volumeMount"
  | "network"
  | "animatedDataFlow"
  | "pipeline"
  | "securityEdge"
  | "copyFrom";

/** Data carried by a diagram edge */
export interface DiagramEdgeData {
  [key: string]: unknown;
  /** Edge type discriminator */
  type: DiagramEdgeType;
  /** Label shown on hover */
  label?: string;
  /** Protocol or port info */
  protocol?: string;
  /** Whether to animate the edge */
  animated?: boolean;
}

/** A single step in progressive diagram building */
export interface DiagramStep {
  /** Node IDs revealed at this step */
  nodeIds: string[];
  /** Edge IDs revealed at this step */
  edgeIds: string[];
  /** Step label shown to the user */
  label?: string;
}

/** D3 alternate visualization type */
export type D3Variant = "layerStack" | "forceGraph" | "tree" | "pipeline";

/** Full React Flow diagram configuration */
export interface DiagramConfig {
  /** Unique diagram key, e.g. "docker-container-basics" */
  id: string;
  /** Display title */
  title: string;
  /** Initial viewport settings */
  viewport?: {
    x: number;
    y: number;
    zoom: number;
  };
  /** Nodes in the diagram */
  nodes: DiagramNode[];
  /** Edges connecting nodes */
  edges: DiagramEdge[];
  /** Progressive building steps (nodes/edges revealed incrementally) */
  steps?: DiagramStep[];
  /** Available D3 alternate visualization */
  d3Variant?: D3Variant;
}

/** A single node in a diagram */
export interface DiagramNode {
  id: string;
  position: { x: number; y: number };
  data: DiagramNodeData;
}

/** A single edge in a diagram */
export interface DiagramEdge {
  id: string;
  source: string;
  target: string;
  data: DiagramEdgeData;
}

// -----------------------------------------------------------
// Progress Tracking
// -----------------------------------------------------------

/** Status of a single lesson */
export type LessonStatus = "not_started" | "in_progress" | "completed";

/** Progress for a single lesson */
export interface LessonProgress {
  /** Lesson slug */
  slug: string;
  /** Current status */
  status: LessonStatus;
  /** Best quiz score (0-100), null if not attempted */
  quizBestScore: number | null;
  /** Whether the terminal challenge is completed */
  challengeCompleted: boolean;
  /** ISO timestamp when the lesson was last updated */
  updatedAt: string;
}

/** Overall progress state stored in localStorage */
export interface ProgressState {
  /** Per-lesson progress, keyed by lesson slug */
  lessons: Record<string, LessonProgress>;
  /** Result of the placement quiz, if taken */
  placementLevel?: Level;
  /** ISO timestamp of last progress update */
  lastUpdated: string;
}

// -----------------------------------------------------------
// Custom Exam
// -----------------------------------------------------------

/** Configuration for generating a custom exam */
export interface ExamConfig {
  /** Which topics to include */
  topics: Topic[];
  /** Difficulty level */
  level: Level;
  /** Number of questions total */
  questionCount: 5 | 10 | 15 | 20;
}

/** A generated custom exam with mixed curated + AI questions */
export interface CustomExam {
  /** Unique exam ID for history tracking */
  id: string;
  /** Display title */
  title: string;
  /** The config used to generate this exam */
  config: ExamConfig;
  /** All questions, curated + AI, shuffled */
  questions: QuizQuestion[];
  /** Per-question source tracking for results display */
  sources: ("curated" | "ai")[];
  /** ISO timestamp of generation */
  createdAt: string;
}

/** A completed exam result stored in history */
export interface ExamHistoryEntry {
  /** The exam that was taken */
  exam: CustomExam;
  /** User's selected answer index per question (null = skipped) */
  answers: (number | null)[];
  /** Score as percentage 0-100 */
  score: number;
  /** ISO timestamp of completion */
  completedAt: string;
}

// -----------------------------------------------------------
// Gamification — Badges & Levels
// -----------------------------------------------------------

/** Lock state of a skill-node on the roadmap */
export type SkillNodeState = "locked" | "available" | "completed";

/** A badge awarded for completing a specific milestone */
export interface Badge {
  id: string;
  name: string;
  icon: string;
  condition: string;
}

/** An XP-based progression level */
export interface XPLevel {
  level: number;
  xpRequired: number;
  title: string;
}