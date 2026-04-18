"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { DiagramNodeData } from "@/types";
import MarkdownText from "../MarkdownText";

export default function IngressNode({ data }: NodeProps) {
  const nodeData = data as unknown as DiagramNodeData;

  return (
    <div className="flex min-w-[180px] flex-col items-center">
      <div className="h-0 w-0 border-l-[12px] border-r-[12px] border-t-[10px] border-l-transparent border-r-transparent border-t-amber-500" />
      <div className="w-full rounded-b-lg border-2 border-t-0 border-amber-500 bg-gray-900 p-3 shadow-lg">
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-amber-500"
        />
        <div className="flex items-center gap-2">
          <span className="text-lg">🌐</span>
          <div>
            <div className="text-sm font-semibold text-white">
              {nodeData.label}
            </div>
            {nodeData.details?.ports && nodeData.details.ports.length > 0 && (
              <div className="text-xs text-gray-400">
                Ports: {nodeData.details.ports.join(", ")}
              </div>
            )}
          </div>
        </div>
        {nodeData.details?.description && (
          <MarkdownText content={nodeData.details.description} className="mt-1" />
        )}
        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-amber-500"
        />
      </div>
    </div>
  );
}