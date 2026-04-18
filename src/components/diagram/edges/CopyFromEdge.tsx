"use client";

import { type EdgeProps, getBezierPath } from "@xyflow/react";

export default function CopyFromEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
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
        stroke="#a855f7"
        strokeWidth={2}
        strokeDasharray="6 3"
      />
      <g transform={`translate(${labelX}, ${labelY})`}>
        <rect
          x="-22"
          y="-8"
          width="44"
          height="16"
          rx="4"
          fill="#1e1b2e"
          stroke="#a855f7"
          strokeWidth="1"
        />
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fill="#a855f7"
          fontSize="9"
          fontWeight="bold"
        >
          COPY
        </text>
      </g>
    </g>
  );
}