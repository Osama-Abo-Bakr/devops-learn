"use client";

import { getDiagram, getChallenge, getQuiz } from "@/data";
import DiagramCanvas from "@/components/diagram/DiagramCanvas";
import TerminalSimulator from "@/components/terminal/TerminalSimulator";
import QuizComponent from "@/components/quiz/QuizComponent";

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

  return (
    <>
      {diagramConfig && (
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Interactive Diagram
          </h2>
          <DiagramCanvas config={diagramConfig} />
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