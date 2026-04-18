"use client";

import { BaseEdge, getSmoothStepPath, type EdgeProps } from "@xyflow/react";

export default function UnlockEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 16,
  });

  const isCompleted = (data?.completed as boolean) ?? false;

  return (
    <g>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: isCompleted ? "#3b82f6" : "#374151",
          strokeWidth: isCompleted ? 2.5 : 1.5,
          strokeDasharray: isCompleted ? undefined : "6 4",
        }}
      />
      {isCompleted && (
        <circle r="3" fill="#3b82f6">
          <animateMotion dur="3s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}
    </g>
  );
}