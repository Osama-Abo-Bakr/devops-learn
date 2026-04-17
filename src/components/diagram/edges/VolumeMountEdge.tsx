import { type EdgeProps, getBezierPath } from "@xyflow/react";

export default function VolumeMountEdge({
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
        stroke="#a855f7"
        strokeWidth={2}
        strokeDasharray="4 4"
      />
    </g>
  );
}