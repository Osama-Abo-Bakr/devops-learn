"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { DiagramNodeData } from "@/types";
import MarkdownText from "../MarkdownText";

export default function StageNode({ data }: NodeProps) {
  const nodeData = data as unknown as DiagramNodeData;
  const isBuildStage =
    nodeData.label.toLowerCase().includes("build") ||
    nodeData.details?.config?.stageType === "build";

  const borderClass = isBuildStage
    ? "border-blue-500/50 border-dashed"
    : "border-green-500/50 border-solid";

  const configEntries = nodeData.details?.config
    ? Object.entries(nodeData.details.config)
    : [];

  return (
    <div
      className={`min-h-[120px] min-w-[240px] rounded-lg border-2 ${borderClass} bg-gray-900/50 p-4`}
    >
      <Handle type="target" position={Position.Top} className="!bg-blue-500" />
      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
        {nodeData.label}
      </div>
      {configEntries.length > 0 && (
        <ul className="space-y-0.5">
          {configEntries.map(([key, value]) => (
            <li key={key} className="text-xs text-gray-400">
              <code className="text-cyan-400">{key}</code>
              <span className="text-gray-500">: </span>
              <span>{value}</span>
            </li>
          ))}
        </ul>
      )}
      {nodeData.details?.description && (
        <MarkdownText content={nodeData.details.description} className="mt-1" />
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-blue-500"
      />
    </div>
  );
}