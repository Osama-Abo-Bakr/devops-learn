"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { DiagramNodeData } from "@/types";
import MarkdownText from "../MarkdownText";

const stageIcons: Record<number, string> = {
  1: "\u{1F4E6}",
  2: "\u{1F528}",
  3: "\u{1F9EA}",
  4: "\u{1F50D}",
  5: "\u{1F4E4}",
  6: "\u{1F680}",
};

export default function PipelineNode({ data }: NodeProps) {
  const nodeData = data as unknown as DiagramNodeData;
  const stageIndex = nodeData.details?.stageIndex ?? 1;
  const icon = stageIcons[stageIndex] ?? "\u{1F4E6}";

  return (
    <div className="min-w-[160px] rounded-lg border-2 border-cyan-500 bg-gray-900 p-3 shadow-lg">
      <Handle type="target" position={Position.Left} className="!bg-cyan-500" />
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-bold text-cyan-400">
          {stageIndex}
        </span>
        <span className="text-lg">{icon}</span>
        <div className="text-sm font-semibold text-white">{nodeData.label}</div>
      </div>
      {nodeData.details?.description && (
        <MarkdownText content={nodeData.details.description} className="mt-1" />
      )}
      <Handle type="source" position={Position.Right} className="!bg-cyan-500" />
    </div>
  );
}