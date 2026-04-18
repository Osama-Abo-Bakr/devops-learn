"use client";

import { useMemo, useCallback, useState } from "react";
import { ReactFlow, ReactFlowProvider, Background, Controls, type Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import SkillNode from "./SkillNode";
import UnlockEdge from "./UnlockEdge";
import {
  computeNodeStates,
  buildSkillTreeEdges,
  TOPIC_X,
} from "./skill-tree-data";
import { useProgress } from "@/context/ProgressContext";
import { getAllModules } from "@/data/modules";
import { getCompletionPercentage } from "@/lib/progress";

const nodeTypes = { skillNode: SkillNode };
const edgeTypes = { unlockEdge: UnlockEdge };

export default function SkillTreeCanvas() {
  const { progress, getCompletionPercentage } = useProgress();
  const [showReset, setShowReset] = useState(false);

  const modules = getAllModules();
  const allSlugs = modules.flatMap((m) => m.lessons.map((l) => l.slug));
  const completionPct = getCompletionPercentage(allSlugs);

  const nodes = useMemo(
    () => computeNodeStates(progress.lessons),
    [progress.lessons],
  );

  const edges = useMemo(() => {
    const baseEdges = buildSkillTreeEdges(progress.lessons);
    return baseEdges.map((e) => ({
      ...e,
      data: {
        ...e.data,
        completed:
          progress.lessons[e.source]?.status === "completed" ||
          e.source.startsWith("header-"),
      },
    }));
  }, [progress.lessons]);

  const handleReset = useCallback(() => {
    if (
      window.confirm(
        "Reset all progress? This will clear your XP, streak, badges, and lesson completion. This cannot be undone.",
      )
    ) {
      localStorage.removeItem("devops-learn-progress");
      window.location.reload();
    }
    setShowReset(false);
  }, []);

  const defaultViewport = { x: 0, y: 0, zoom: 0.65 };

  return (
    <ReactFlowProvider>
      <div className="flex h-full flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900/80 px-4 py-2 backdrop-blur">
          <div className="text-sm font-medium text-gray-300">
            {completionPct}% Complete
          </div>
          <button
            onClick={() => setShowReset(!showReset)}
            className="text-xs text-gray-500 hover:text-gray-300"
          >
            {showReset && (
              <span
                onClick={handleReset}
                className="mr-2 text-red-400 hover:text-red-300"
              >
                Confirm Reset
              </span>
            )}
            Reset Progress
          </button>
        </div>

        {/* Tree */}
        <div className="flex-1 bg-gray-950" style={{ minHeight: "70vh" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultViewport={defaultViewport}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            minZoom={0.3}
            maxZoom={1.5}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnDrag
            zoomOnScroll
            zoomOnPinch
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#1f2937" gap={40} />
            <Controls
              showInteractive={false}
              className="!border-gray-700 !bg-gray-800 [&>button]:!border-gray-700 [&>button]:!bg-gray-800 [&>button]:!fill-gray-400"
            />
          </ReactFlow>
        </div>
      </div>
    </ReactFlowProvider>
  );
}