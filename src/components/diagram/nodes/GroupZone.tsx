"use client";

import { type NodeProps } from "@xyflow/react";
import type { DiagramNodeData } from "@/types";

export default function GroupZone({ data }: NodeProps) {
  const nodeData = data as unknown as DiagramNodeData;

  return (
    <div className="min-h-[80px] min-w-[200px] rounded-lg border-2 border-dashed border-amber-500/30 bg-amber-500/5 p-3">
      <div className="text-xs font-bold uppercase tracking-wider text-amber-500/60">
        {nodeData.label}
      </div>
    </div>
  );
}