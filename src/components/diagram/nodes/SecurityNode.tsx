"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { DiagramNodeData } from "@/types";
import MarkdownText from "../MarkdownText";

const accentMap: Record<string, string> = {
  L1: "bg-red-500",
  L2: "bg-orange-500",
  L3: "bg-amber-500",
  L4: "bg-yellow-500",
};

export default function SecurityNode({ data }: NodeProps) {
  const nodeData = data as unknown as DiagramNodeData;
  const securityLevel = nodeData.details?.securityLevel ?? "L1";
  const levelKey = securityLevel.split(":")[0]?.trim() ?? "L1";
  const accent = accentMap[levelKey] ?? "bg-red-500";

  return (
    <div className="flex min-w-[180px] overflow-hidden rounded-lg border-2 border-red-500/50 bg-gray-900 shadow-lg">
      <div className={`w-1 shrink-0 ${accent}`} />
      <div className="flex-1 p-3">
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-red-500"
        />
        <div className="flex items-center gap-2">
          <span className="text-lg">🔒</span>
          <div>
            <div className="text-sm font-semibold text-white">
              {nodeData.label}
            </div>
            {nodeData.details?.securityLevel && (
              <div className="text-xs text-gray-400">
                {nodeData.details.securityLevel}
              </div>
            )}
            {nodeData.details?.description && (
              <MarkdownText content={nodeData.details.description} className="mt-1" />
            )}
          </div>
        </div>
        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-red-500"
        />
      </div>
    </div>
  );
}