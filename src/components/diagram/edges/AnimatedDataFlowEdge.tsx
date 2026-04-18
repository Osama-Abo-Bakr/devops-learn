"use client";

import { type EdgeProps, getBezierPath } from "@xyflow/react";

export default function AnimatedDataFlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <g>
      {/* Static base path */}
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke="#3b82f6"
        strokeWidth={2}
        strokeDasharray="8 4"
      />
      {/* Animated overlay for flowing dash effect */}
      <path
        d={edgePath}
        fill="none"
        stroke="#3b82f6"
        strokeWidth={2}
        strokeDasharray="8 4"
        className="animate-flow-dash"
      />
      {/* Animated dot traveling along the path */}
      <circle r="3" fill="#3b82f6">
        <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
      </circle>
    </g>
  );
}