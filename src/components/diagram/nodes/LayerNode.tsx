"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { DiagramNodeData } from "@/types";
import MarkdownText from "../MarkdownText";

const borderMap: Record<string, string> = {
  hit: "border-green-500",
  miss: "border-amber-500",
  rebuild: "border-red-500",
};

const badgeMap: Record<string, { label: string; color: string }> = {
  hit: { label: "CACHE HIT", color: "bg-green-500/20 text-green-400" },
  miss: { label: "MISS", color: "bg-amber-500/20 text-amber-400" },
  rebuild: { label: "REBUILD", color: "bg-red-500/20 text-red-400" },
};

export default function LayerNode({ data }: NodeProps) {
  const nodeData = data as unknown as DiagramNodeData;
  const cacheStatus = nodeData.details?.cacheStatus ?? "miss";
  const border = borderMap[cacheStatus] ?? "border-gray-700";
  const badge = badgeMap[cacheStatus];

  return (
    <div
      className={`min-w-[280px] rounded-lg border-2 ${border} bg-gray-900 p-3 shadow-lg`}
    >
      <Handle type="target" position={Position.Top} className="!bg-green-500" />
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-semibold text-white">{nodeData.label}</div>
        {badge && (
          <span
            className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${badge.color}`}
          >
            {badge.label}
          </span>
        )}
      </div>
      {nodeData.details?.description && (
        <MarkdownText content={nodeData.details.description} className="mt-1" />
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-green-500"
      />
    </div>
  );
}