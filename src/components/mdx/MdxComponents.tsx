import DiagramCanvas from "@/components/diagram/DiagramCanvas";
import TerminalSimulator from "@/components/terminal/TerminalSimulator";
import QuizComponent from "@/components/quiz/QuizComponent";
import type { DiagramConfig } from "@/types";
import type { Quiz } from "@/types";
import type { CommandHandler } from "@/types";
import type { ChallengeTask } from "@/types";

interface DiagramProps {
  config: DiagramConfig;
}

interface TerminalProps {
  commands: Record<string, CommandHandler>;
  initialState?: Record<string, string>;
  prompt?: string;
  tasks?: ChallengeTask[];
  onTaskComplete?: (taskId: string) => void;
}

interface QuizProps {
  questions: import("@/types").QuizQuestion[];
  title: string;
  onComplete?: (score: number) => void;
}

export const mdxComponents = {
  Diagram: ({ config }: DiagramProps) => <DiagramCanvas config={config} />,
  Terminal: ({ commands, initialState, prompt, tasks, onTaskComplete }: TerminalProps) => (
    <TerminalSimulator
      commands={commands}
      initialState={initialState}
      prompt={prompt}
      tasks={tasks}
      onTaskComplete={onTaskComplete}
    />
  ),
  Quiz: ({ questions, title, onComplete }: QuizProps) => (
    <QuizComponent questions={questions} title={title} onComplete={onComplete} />
  ),
};