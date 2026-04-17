import { type EdgeProps, getBezierPath } from "@xyflow/react";

export default function DataFlowEdge({
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
        stroke="#3b82f6"
        strokeWidth={2}
        strokeDasharray="8 4"
        className="animate-dash"
      />
    </g>
  );
}