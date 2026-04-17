import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { DiagramNodeData } from "@/types";

export default function ContainerNode({ data }: NodeProps) {
  const nodeData = data as unknown as DiagramNodeData;
  return (
    <div className="min-w-[160px] rounded-lg border-2 border-blue-500 bg-gray-900 p-3 shadow-lg">
      <Handle type="target" position={Position.Top} className="!bg-blue-500" />
      <div className="flex items-center gap-2">
        <span className="text-lg">🐳</span>
        <div>
          <div className="text-sm font-semibold text-white">{nodeData.label}</div>
          {nodeData.details?.image && (
            <div className="text-xs text-gray-400">Image: {nodeData.details.image}</div>
          )}
          {nodeData.details?.status && (
            <div className="text-xs text-green-400">{nodeData.details.status}</div>
          )}
        </div>
      </div>
      {nodeData.details?.ports && nodeData.details.ports.length > 0 && (
        <div className="mt-2 text-xs text-gray-400">
          Ports: {nodeData.details.ports.join(", ")}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500" />
    </div>
  );
}