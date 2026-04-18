"use client";

import { type EdgeProps, getBezierPath } from "@xyflow/react";

interface AnimatedEdgeData {
  color?: string;
  animated?: boolean;
  [key: string]: unknown;
}

export default function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const color = (data as AnimatedEdgeData)?.color ?? "#3b82f6";
  const animated = (data as AnimatedEdgeData)?.animated ?? true;

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
      {/* Base path: solid stroke */}
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={color}
        strokeWidth={2}
      />

      {/* Overlay path: flowing dash animation */}
      {animated && (
        <>
          <path
            d={edgePath}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeDasharray="10 40"
            className="animate-flow-dash"
          />

          {/* Particle flowing along the path */}
          <circle r="3" fill={color}>
            <animateMotion
              dur="2s"
              repeatCount="indefinite"
              path={edgePath}
            />
          </circle>
        </>
      )}
    </g>
  );
}