import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { DiagramNodeData } from "@/types";
import MarkdownText from "../MarkdownText";

export default function PodNode({ data }: NodeProps) {
  const nodeData = data as unknown as DiagramNodeData;
  return (
    <div className="min-w-[180px] rounded-lg border-2 border-green-500 bg-gray-900 p-3 shadow-lg">
      <Handle type="target" position={Position.Top} className="!bg-green-500" />
      <div className="flex items-center gap-2">
        <span className="text-lg">☸️</span>
        <div className="text-sm font-semibold text-white">{nodeData.label}</div>
      </div>
      {nodeData.details?.description && (
        <MarkdownText content={nodeData.details.description} className="mt-1" />
      )}
      {nodeData.details?.image && (
        <div className="mt-1 text-xs text-gray-400">
          Image: <code className="rounded bg-gray-800 px-1 font-mono text-cyan-400 text-[11px]">{nodeData.details.image}</code>
        </div>
      )}
      {nodeData.details?.env && Object.keys(nodeData.details.env).length > 0 && (
        <div className="mt-1 space-y-0.5">
          {Object.entries(nodeData.details.env).map(([k, v]) => (
            <div key={k} className="text-[11px] text-gray-400">
              <code className="text-amber-400">{k}</code>=<code className="text-gray-300">{v}</code>
            </div>
          ))}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-green-500" />
    </div>
  );
}