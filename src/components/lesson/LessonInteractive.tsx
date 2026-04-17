"use client";

import dynamic from "next/dynamic";
import { getDiagram, getChallenge, getQuiz } from "@/data";
import DiagramCanvas from "@/components/diagram/DiagramCanvas";
import TerminalSimulator from "@/components/terminal/TerminalSimulator";
import QuizComponent from "@/components/quiz/QuizComponent";

const ExcalidrawViewer = dynamic(
  () => import("@/components/diagram/ExcalidrawViewer"),
  { ssr: false },
);

import dockerContainerBasicsScene from "@/data/excalidraw/docker-container-basics";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const excalidrawScenes: Record<string, any> = {
  "docker-container-basics": dockerContainerBasicsScene,
};

interface LessonInteractiveProps {
  diagramId?: string;
  challengeId?: string;
  quizId?: string;
}

export default function LessonInteractive({
  diagramId,
  challengeId,
  quizId,
}: LessonInteractiveProps) {
  const diagramConfig = diagramId ? getDiagram(diagramId) : undefined;
  const challengeConfig = challengeId ? getChallenge(challengeId) : undefined;
  const quizConfig = quizId ? getQuiz(quizId) : undefined;
  const excalidrawScene = diagramId ? excalidrawScenes[diagramId] : undefined;

  return (
    <>
      {(diagramConfig || excalidrawScene) && (
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Interactive Diagram
          </h2>
          {excalidrawScene ? (
            <ExcalidrawViewer
              scene={excalidrawScene}
              title={diagramConfig?.title ?? "Diagram"}
            />
          ) : (
            diagramConfig && <DiagramCanvas config={diagramConfig} />
          )}
        </section>
      )}

      {challengeConfig && (
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Try It Yourself
          </h2>
          <TerminalSimulator
            commands={challengeConfig.commands}
            initialState={challengeConfig.initialState}
            tasks={challengeConfig.tasks}
          />
        </section>
      )}

      {quizConfig && (
        <section className="mt-8">
          <QuizComponent
            questions={quizConfig.questions}
            title={quizConfig.title}
          />
        </section>
      )}
    </>
  );
}