"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { DiagramConfig } from "@/types";

interface DiagramStepBuilderProps {
  config: DiagramConfig;
  children: (
    filteredConfig: DiagramConfig,
    currentStep: number,
    totalSteps: number,
    stepLabel?: string
  ) => React.ReactNode;
}

export default function DiagramStepBuilder({
  config,
  children,
}: DiagramStepBuilderProps) {
  const steps = config.steps;
  const hasSteps = steps !== undefined && steps.length > 0;
  const totalSteps = hasSteps ? steps.length : 0;

  const [currentStep, setCurrentStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  // Auto-play: advance step every 2 seconds
  useEffect(() => {
    if (!autoPlay || !hasSteps) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= totalSteps - 1) {
          setAutoPlay(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [autoPlay, hasSteps, totalSteps]);

  const handlePrevious = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(totalSteps - 1, prev + 1));
  }, [totalSteps]);

  const toggleAutoPlay = useCallback(() => {
    setAutoPlay((prev) => !prev);
  }, []);

  // Compute filtered config by accumulating node/edge IDs from steps 0..currentStep
  const filteredConfig = useMemo(() => {
    if (!hasSteps) return config;

    const accumulatedNodeIds = new Set<string>();
    const accumulatedEdgeIds = new Set<string>();

    for (let i = 0; i <= currentStep; i++) {
      const step = steps![i];
      for (const nodeId of step.nodeIds) {
        accumulatedNodeIds.add(nodeId);
      }
      for (const edgeId of step.edgeIds) {
        accumulatedEdgeIds.add(edgeId);
      }
    }

    return {
      ...config,
      nodes: config.nodes.filter((n) => accumulatedNodeIds.has(n.id)),
      edges: config.edges.filter((e) => accumulatedEdgeIds.has(e.id)),
    };
  }, [config, currentStep, hasSteps, steps]);

  // No steps: pass full config, step number 1, total 1
  if (!hasSteps) {
    return <>{children(config, 1, 1)}</>;
  }

  const stepLabel = steps![currentStep]?.label;

  return (
    <div>
      {children(filteredConfig, currentStep + 1, totalSteps, stepLabel)}

      <div className="flex items-center gap-2 rounded-lg bg-gray-800 p-2 mt-2">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === totalSteps - 1}
          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
        <button
          onClick={toggleAutoPlay}
          className={`px-3 py-1 rounded text-sm ${
            autoPlay
              ? "bg-blue-600 hover:bg-blue-500 text-white"
              : "bg-gray-700 hover:bg-gray-600 text-white"
          }`}
        >
          {autoPlay ? "Pause" : "Auto-play"}
        </button>
        <span className="text-gray-400 text-sm ml-auto">
          Step {currentStep + 1} / {totalSteps}
        </span>
      </div>
    </div>
  );
}