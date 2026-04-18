"use client";

import { useState } from "react";
import { getDiagram, getChallenge, getQuiz } from "@/data";
import DiagramCanvas from "@/components/diagram/DiagramCanvas";
import DiagramStepBuilder from "@/components/diagram/DiagramStepBuilder";
import DiagramViewToggle from "@/components/diagram/DiagramViewToggle";
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
  const [view, setView] = useState<"reactflow" | "d3">("reactflow");

  return (
    <>
      {diagramConfig && (
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Interactive Diagram
            </h2>
            <DiagramViewToggle
              d3Variant={diagramConfig.d3Variant}
              currentView={view}
              onToggle={setView}
            />
          </div>
          {view === "reactflow" ? (
            diagramConfig.steps && diagramConfig.steps.length > 0 ? (
              <DiagramStepBuilder config={diagramConfig}>
                {(filteredConfig, step, total, stepLabel) => (
                  <div>
                    <DiagramCanvas config={filteredConfig} />
                    <div className="mt-2 flex items-center justify-between rounded-lg bg-gray-800 px-3 py-2">
                      <div className="text-xs text-gray-400">
                        Step {step} / {total}
                        {stepLabel && (
                          <span className="ml-2 text-gray-500">
                            — {stepLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </DiagramStepBuilder>
            ) : (
              <DiagramCanvas config={diagramConfig} />
            )
          ) : (
            <div className="flex h-[500px] items-center justify-center rounded-lg border border-gray-700 bg-gray-900 text-gray-400">
              D3 view coming soon
            </div>
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