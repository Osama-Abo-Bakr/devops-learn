"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { SkillNodeData } from "./skill-tree-data";
import Link from "next/link";
import { useRouter } from "next/navigation";

const STATE_STYLES = {
  locked: {
    container: "border-gray-700 bg-gray-900/50 opacity-50",
    icon: "grayscale",
    title: "text-gray-500",
    badge: "bg-gray-800 text-gray-500",
    score: "text-gray-600",
  },
  available: {
    container: "border-blue-500/60 bg-gray-900 shadow-[0_0_12px_rgba(59,130,246,0.3)] animate-pulse",
    icon: "",
    title: "text-white",
    badge: "bg-blue-600/20 text-blue-400",
    score: "text-blue-400",
  },
  completed: {
    container: "border-green-500/70 bg-gray-900 shadow-[0_0_8px_rgba(34,197,94,0.2)]",
    icon: "",
    title: "text-white",
    badge: "bg-green-600/20 text-green-400",
    score: "text-green-400",
  },
};

const LEVEL_LABELS = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function SkillNode({ data, id }: NodeProps) {
  const nodeData = data as unknown as SkillNodeData;
  const router = useRouter();
  const styles = STATE_STYLES[nodeData.state];
  const isClickable = nodeData.state !== "locked";

  return (
    <div
      className={`group relative min-w-[180px] cursor-pointer rounded-xl border-2 p-3 transition-all duration-200 hover:scale-105 ${styles.container}`}
      onClick={() => {
        if (isClickable && !id.startsWith("header-")) {
          router.push(`/learn/${nodeData.topic}/${nodeData.slug}`);
        }
      }}
    >
      <Handle type="target" position={Position.Top} className="!h-2 !w-2 !border-0 !bg-gray-600" />
      <Handle type="source" position={Position.Bottom} className="!h-2 !w-2 !border-0 !bg-gray-600" />

      <div className="flex items-center gap-2">
        <span className={`text-xl ${styles.icon}`}>{nodeData.icon}</span>
        <div className="min-w-0 flex-1">
          <div className={`text-sm font-semibold leading-tight ${styles.title}`}>
            {nodeData.label}
          </div>
          <span className={`mt-0.5 inline-block rounded-full px-1.5 py-0.5 text-[10px] font-medium ${styles.badge}`}>
            {LEVEL_LABELS[nodeData.level]}
          </span>
        </div>
      </div>

      {nodeData.state === "completed" && nodeData.quizScore !== null && (
        <div className={`mt-1 text-right text-xs font-medium ${styles.score}`}>
          {nodeData.quizScore}%
        </div>
      )}

      {nodeData.state === "locked" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="text-2xl opacity-60">🔒</span>
        </div>
      )}

      {nodeData.state === "available" && (
        <div className="pointer-events-none absolute -right-1 -top-1">
          <span className="text-xs">✨</span>
        </div>
      )}
    </div>
  );
}