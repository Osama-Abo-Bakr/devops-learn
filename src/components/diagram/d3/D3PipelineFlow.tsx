"use client";

import { useRef, useState, useEffect } from "react";
import * as d3 from "d3";
import type { DiagramConfig } from "@/types";
import { useD3Renderer } from "./useD3Renderer";

interface D3PipelineFlowProps {
  config: DiagramConfig;
}

export default function D3PipelineFlow({ config }: D3PipelineFlowProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeStage, setActiveStage] = useState(0);

  const nodeCount = config.nodes.length;

  // Auto-advance through stages every 3 seconds
  useEffect(() => {
    if (nodeCount <= 1) return;
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % nodeCount);
    }, 3000);
    return () => clearInterval(timer);
  }, [nodeCount]);

  useD3Renderer({
    svgRef,
    renderFn: (selection, width, height) => {
      selection.selectAll("*").remove();

      const nodes = config.nodes;
      if (nodes.length === 0) return;

      const padding = 60;
      const nodeWidth = 120;
      const nodeHeight = 56;
      const nodeGap = 40;
      const totalWidth =
        nodes.length * nodeWidth + (nodes.length - 1) * nodeGap;
      const startX = Math.max(padding, (width - totalWidth) / 2);
      const centerY = height / 2;

      // CSS keyframes for flowing dashes
      selection
        .append("style")
        .text(`
        @keyframes flow-right {
          to { stroke-dashoffset: -24; }
        }
        .flow-dash {
          animation: flow-right 0.8s linear infinite;
        }
      `);

      const g = selection.append("g");

      // Draw connecting paths between stages
      for (let i = 0; i < nodes.length - 1; i++) {
        const x1 = startX + i * (nodeWidth + nodeGap) + nodeWidth;
        const x2 = startX + (i + 1) * (nodeWidth + nodeGap);
        const midX = (x1 + x2) / 2;

        // Path
        g.append("path")
          .attr(
            "d",
            `M${x1},${centerY} C${midX},${centerY} ${midX},${centerY} ${x2},${centerY}`
          )
          .attr("fill", "none")
          .attr("stroke", "#06b6d4")
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "8 4")
          .attr("class", "flow-dash")
          .attr("opacity", 0.6);

        // Arrowhead
        g.append("polygon")
          .attr(
            "points",
            `${x2 - 2},${centerY - 5} ${x2 - 2},${centerY + 5} ${x2 + 4},${centerY}`
          )
          .attr("fill", "#06b6d4")
          .attr("opacity", 0.6);
      }

      // Draw stage nodes
      const stageGroups = g
        .selectAll(".stage")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "stage")
        .attr(
          "transform",
          (_d, i) =>
            `translate(${startX + i * (nodeWidth + nodeGap)},${centerY - nodeHeight / 2})`
        );

      // Glow filter for active stage
      const defs = selection.append("defs");
      const filter = defs.append("filter").attr("id", "glow");
      filter
        .append("feGaussianBlur")
        .attr("stdDeviation", "4")
        .attr("result", "coloredBlur");
      const feMerge = filter.append("feMerge");
      feMerge.append("feMergeNode").attr("in", "coloredBlur");
      feMerge.append("feMergeNode").attr("in", "SourceGraphic");

      stageGroups
        .append("rect")
        .attr("width", nodeWidth)
        .attr("height", nodeHeight)
        .attr("rx", 10)
        .attr("fill", (_d, i) => (i === activeStage ? "#0e1629" : "#030712"))
        .attr("stroke", (_d, i) =>
          i === activeStage ? "#06b6d4" : "#1e293b"
        )
        .attr("stroke-width", (_d, i) => (i === activeStage ? 2 : 1))
        .attr("filter", (_d, i) =>
          i === activeStage ? "url(#glow)" : null
        );

      // Stage number
      stageGroups
        .append("text")
        .attr("x", nodeWidth / 2)
        .attr("y", nodeHeight / 2 - 6)
        .attr("text-anchor", "middle")
        .attr("fill", (_d, i) => (i === activeStage ? "#06b6d4" : "#6b7280"))
        .attr("font-size", 10)
        .attr("font-weight", 600)
        .text((_d, i) => `Stage ${i + 1}`);

      // Stage label
      stageGroups
        .append("text")
        .attr("x", nodeWidth / 2)
        .attr("y", nodeHeight / 2 + 10)
        .attr("text-anchor", "middle")
        .attr("fill", (_d, i) =>
          i === activeStage ? "#e5e7eb" : "#9ca3af"
        )
        .attr("font-size", 13)
        .attr("font-weight", (_d, i) => (i === activeStage ? 600 : 400))
        .text((d) => d.data.label);

      // Fade-in animation
      stageGroups
        .attr("opacity", 0)
        .transition()
        .duration(400)
        .delay((_d, i) => i * 150)
        .attr("opacity", 1);
    },
    deps: [config, activeStage],
  });

  return (
    <div className="h-[500px] w-full rounded-lg border border-gray-700 bg-gray-950">
      <svg ref={svgRef} className="h-full w-full" />
    </div>
  );
}