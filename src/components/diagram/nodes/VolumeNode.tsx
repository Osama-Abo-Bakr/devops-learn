import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { DiagramNodeData } from "@/types";

export default function VolumeNode({ data }: NodeProps) {
  const nodeData = data as unknown as DiagramNodeData;
  return (
    <div className="min-w-[140px] rounded-lg border-2 border-purple-500 bg-gray-900 p-3 shadow-lg">
      <Handle type="target" position={Position.Top} className="!bg-purple-500" />
      <div className="flex items-center gap-2">
        <span className="text-lg">💾</span>
        <div>
          <div className="text-sm font-semibold text-white">{nodeData.label}</div>
          {nodeData.details?.description && (
            <div className="text-xs text-gray-400">{nodeData.details.description}</div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-purple-500" />
    </div>
  );
}