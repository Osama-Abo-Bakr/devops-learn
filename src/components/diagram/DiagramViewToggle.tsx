"use client";

import type { D3Variant } from "@/types";

interface DiagramViewToggleProps {
  d3Variant?: D3Variant;
  currentView: "reactflow" | "d3";
  onToggle: (view: "reactflow" | "d3") => void;
}

const D3_LABELS: Record<D3Variant, string> = {
  layerStack: "Layer View",
  forceGraph: "Topology View",
  tree: "Tree View",
  pipeline: "Flow View",
};

export default function DiagramViewToggle({
  d3Variant,
  currentView,
  onToggle,
}: DiagramViewToggleProps) {
  if (!d3Variant) return null;

  const d3Label = D3_LABELS[d3Variant];

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden inline-flex">
      <button
        onClick={() => onToggle("reactflow")}
        className={`text-xs px-3 py-1 ${
          currentView === "reactflow"
            ? "bg-blue-600 text-white"
            : "bg-gray-800 text-gray-400 hover:text-white"
        }`}
      >
        Interactive
      </button>
      <button
        onClick={() => onToggle("d3")}
        className={`text-xs px-3 py-1 ${
          currentView === "d3"
            ? "bg-blue-600 text-white"
            : "bg-gray-800 text-gray-400 hover:text-white"
        }`}
      >
        {d3Label}
      </button>
    </div>
  );
}