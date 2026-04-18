"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { DiagramNodeData } from "@/types";
import MarkdownText from "../MarkdownText";

const configBorder: Record<string, string> = {
  configmap: "border-blue-500",
  secret: "border-red-500",
};

const mountBadge: Record<string, { label: string; color: string }> = {
  env: { label: "ENV", color: "bg-blue-500/20 text-blue-400" },
  file: { label: "FILE", color: "bg-green-500/20 text-green-400" },
  volume: { label: "VOL", color: "bg-purple-500/20 text-purple-400" },
};

export default function ConfigNode({ data }: NodeProps) {
  const nodeData = data as unknown as DiagramNodeData;
  const configType = nodeData.details?.configType ?? "configmap";
  const border = configBorder[configType] ?? "border-blue-500";
  const isSecret = configType === "secret";
  const mount = nodeData.details?.mountType;

  return (
    <div
      className={`relative min-w-[160px] rounded-lg border-2 ${border} bg-gray-900 p-3 shadow-lg`}
    >
      {/* Folded corner */}
      <div
        className={`absolute right-0 top-0 h-5 w-5 ${isSecret ? "border-red-400" : "border-blue-400"}`}
        style={{
          clipPath: "polygon(0 0, 100% 100%, 100% 0)",
          backgroundColor: isSecret ? "#7f1d1d" : "#1e3a5f",
        }}
      />
      <Handle type="target" position={Position.Top} className="!bg-blue-500" />
      <div className="flex items-center gap-2">
        <span className="text-lg">{isSecret ? "🔒" : "📄"}</span>
        <div>
          <div className="text-sm font-semibold text-white">
            {nodeData.label}
          </div>
          <div className="text-xs text-gray-400">{configType}</div>
        </div>
      </div>
      {nodeData.details?.description && (
        <MarkdownText content={nodeData.details.description} className="mt-1" />
      )}
      {mount && mountBadge[mount] && (
        <div className="mt-1">
          <span
            className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${mountBadge[mount].color}`}
          >
            {mountBadge[mount].label}
          </span>
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500" />
    </div>
  );
}