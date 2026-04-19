"use client";

import { useState, useCallback } from "react";
import { getDiagram, getChallenge, getQuiz } from "@/data";
import DiagramCanvas from "@/components/diagram/DiagramCanvas";
import DiagramStepBuilder from "@/components/diagram/DiagramStepBuilder";
import DiagramViewToggle from "@/components/diagram/DiagramViewToggle";
import D3LayerStack from "@/components/diagram/d3/D3LayerStack";
import D3ForceGraph from "@/components/diagram/d3/D3ForceGraph";
import D3TreeLayout from "@/components/diagram/d3/D3TreeLayout";
import D3PipelineFlow from "@/components/diagram/d3/D3PipelineFlow";
import TerminalSimulator from "@/components/terminal/TerminalSimulator";
import QuizComponent from "@/components/quiz/QuizComponent";
import { useProgress } from "@/context/ProgressContext";

interface LessonInteractiveProps {
  diagramId?: string;
  challengeId?: string;
  quizId?: string;
  lessonSlug: string;
}

export default function LessonInteractive({
  diagramId,
  challengeId,
  quizId,
  lessonSlug,
}: LessonInteractiveProps) {
  const {
    updateLessonStatus,
    updateQuizScore,
    markChallengeCompleted,
    addXP,
    updateStreak,
    getXPReward,
    loaded,
  } = useProgress();

  const diagramConfig = diagramId ? getDiagram(diagramId) : undefined;
  const challengeConfig = challengeId ? getChallenge(challengeId) : undefined;
  const quizConfig = quizId ? getQuiz(quizId) : undefined;
  const [view, setView] = useState<"reactflow" | "d3">("reactflow");

  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [lessonMarkedComplete, setLessonMarkedComplete] = useState(false);
  const [challengeDone, setChallengeDone] = useState(false);

  const tryMarkComplete = useCallback(
    (qScore: number | null) => {
      if (lessonMarkedComplete) return;

      const quizPassed = qScore !== null && qScore >= 70;

      if (quizPassed) {
        setLessonMarkedComplete(true);
        if (loaded) {
          updateLessonStatus(lessonSlug, "completed");
          addXP(getXPReward("lessonComplete"));
          updateStreak();
        }
      }
    },
    [
      lessonMarkedComplete,
      lessonSlug,
      loaded,
      updateLessonStatus,
      addXP,
      getXPReward,
      updateStreak,
    ],
  );

  const handleQuizComplete = useCallback(
    (score: number) => {
      setQuizScore(score);
      if (loaded) {
        updateQuizScore(lessonSlug, score);
      }
      tryMarkComplete(score);
    },
    [lessonSlug, loaded, updateQuizScore, tryMarkComplete],
  );

  const handleAllTasksComplete = useCallback(() => {
    setChallengeDone(true);
    if (loaded) {
      markChallengeCompleted(lessonSlug);
      addXP(getXPReward("challengeComplete"));
      updateStreak();
    }
  }, [
    lessonSlug,
    loaded,
    markChallengeCompleted,
    addXP,
    getXPReward,
    updateStreak,
  ]);

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
            <>
              {diagramConfig.d3Variant === "layerStack" && <D3LayerStack config={diagramConfig} />}
              {diagramConfig.d3Variant === "forceGraph" && <D3ForceGraph config={diagramConfig} />}
              {diagramConfig.d3Variant === "tree" && <D3TreeLayout config={diagramConfig} />}
              {diagramConfig.d3Variant === "pipeline" && <D3PipelineFlow config={diagramConfig} />}
            </>
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
            onAllTasksComplete={handleAllTasksComplete}
          />
        </section>
      )}

      {quizConfig && (
        <section className="mt-8">
          <QuizComponent
            questions={quizConfig.questions}
            title={quizConfig.title}
            onComplete={handleQuizComplete}
          />
        </section>
      )}
    </>
  );
}