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
import dockerImageLayersScene from "@/data/excalidraw/docker-image-layers";
import dockerVolumesNetworksScene from "@/data/excalidraw/docker-volumes-networks";
import dockerMultiStageBuildScene from "@/data/excalidraw/docker-multi-stage-build";
import dockerSecurityScene from "@/data/excalidraw/docker-security";
import dockerProductionPatternsScene from "@/data/excalidraw/docker-production-patterns";
import composeMultiServiceScene from "@/data/excalidraw/compose-multi-service";
import composeNetworksVolumesScene from "@/data/excalidraw/compose-networks-volumes";
import k8sPodsDeploymentsScene from "@/data/excalidraw/k8s-pods-deployments";
import k8sServicesIngressScene from "@/data/excalidraw/k8s-services-ingress";
import k8sConfigmapsSecretsScene from "@/data/excalidraw/k8s-configmaps-secrets";
import devopsCicdPipelineScene from "@/data/excalidraw/devops-cicd-pipeline";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const excalidrawScenes: Record<string, any> = {
  "docker-container-basics": dockerContainerBasicsScene,
  "docker-image-layers": dockerImageLayersScene,
  "docker-volumes-networks": dockerVolumesNetworksScene,
  "docker-multi-stage-build": dockerMultiStageBuildScene,
  "docker-security": dockerSecurityScene,
  "docker-production-patterns": dockerProductionPatternsScene,
  "compose-multi-service": composeMultiServiceScene,
  "compose-networks-volumes": composeNetworksVolumesScene,
  "k8s-pods-deployments": k8sPodsDeploymentsScene,
  "k8s-services-ingress": k8sServicesIngressScene,
  "k8s-configmaps-secrets": k8sConfigmapsSecretsScene,
  "devops-cicd-pipeline": devopsCicdPipelineScene,
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