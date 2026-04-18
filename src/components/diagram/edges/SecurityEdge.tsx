"use client";

import { type EdgeProps, getBezierPath } from "@xyflow/react";

export default function SecurityEdge({
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
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke="#ef4444"
        strokeWidth={2}
        strokeDasharray="4 4"
        markerEnd="url(#security-arrow)"
      />
      <defs>
        <marker
          id="security-arrow"
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="5"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 Z" fill="#ef4444" />
        </marker>
      </defs>
    </g>
  );
}