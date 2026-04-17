import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { DiagramNodeData } from "@/types";

export default function ServiceNode({ data }: NodeProps) {
  const nodeData = data as unknown as DiagramNodeData;
  return (
    <div className="min-w-[180px] rounded-lg border-2 border-orange-500 bg-gray-900 p-3 shadow-lg">
      <Handle type="target" position={Position.Top} className="!bg-orange-500" />
      <div className="flex items-center gap-2">
        <span className="text-lg">🌐</span>
        <div>
          <div className="text-sm font-semibold text-white">{nodeData.label}</div>
          {nodeData.details?.ports && nodeData.details.ports.length > 0 && (
            <div className="text-xs text-gray-400">
              Ports: {nodeData.details.ports.join(", ")}
            </div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-orange-500" />
    </div>
  );
}