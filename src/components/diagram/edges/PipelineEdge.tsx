"use client";

import { type EdgeProps, getSmoothStepPath } from "@xyflow/react";

export default function PipelineEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <g>
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke="#06b6d4"
        strokeWidth={2}
        strokeDasharray="6 6"
        className="animate-flow-dash"
        markerEnd="url(#pipeline-arrow)"
      />
      <defs>
        <marker
          id="pipeline-arrow"
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="5"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 Z" fill="#06b6d4" />
        </marker>
      </defs>
    </g>
  );
}