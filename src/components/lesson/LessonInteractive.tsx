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

  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [challengeDone, setChallengeDone] = useState(false);
  const [lessonMarkedComplete, setLessonMarkedComplete] = useState(false);

  const tryMarkComplete = useCallback(
    (qScore: number | null, cDone: boolean) => {
      if (lessonMarkedComplete) return;

      const quizPassed = qScore !== null && qScore >= 70;
      const noChallenge = !challengeConfig;
      const challengeFinished = cDone;

      if (quizPassed && (noChallenge || challengeFinished)) {
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
      challengeConfig,
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
      setQuizCompleted(true);
      setQuizScore(score);
      if (loaded) {
        updateQuizScore(lessonSlug, score);
      }
      tryMarkComplete(score, challengeDone);
    },
    [lessonSlug, loaded, updateQuizScore, tryMarkComplete, challengeDone],
  );

  const handleTaskComplete = useCallback(
    (taskId: string) => {
      const totalTasks = challengeConfig?.tasks.length ?? 0;
      // We track challenge completion via a state counter
      // The TerminalSimulator fires onTaskComplete per task
      // We only mark the whole challenge done when all tasks complete
      // But for simplicity, on each task we check if all are done
    },
    [challengeConfig],
  );

  const handleAllTasksComplete = useCallback(() => {
    setChallengeDone(true);
    if (loaded) {
      markChallengeCompleted(lessonSlug);
      addXP(getXPReward("challengeComplete"));
      updateStreak();
    }
    tryMarkComplete(quizScore, true);
  }, [
    lessonSlug,
    loaded,
    markChallengeCompleted,
    addXP,
    getXPReward,
    updateStreak,
    tryMarkComplete,
    quizScore,
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