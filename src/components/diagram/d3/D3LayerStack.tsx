"use client";

import { useRef } from "react";
import * as d3 from "d3";
import type { DiagramConfig } from "@/types";
import { useD3Renderer } from "./useD3Renderer";

interface D3LayerStackProps {
  config: DiagramConfig;
}

const CACHE_COLORS: Record<string, string> = {
  hit: "#22c55e",
  miss: "#f59e0b",
  rebuild: "#ef4444",
};

export default function D3LayerStack({ config }: D3LayerStackProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useD3Renderer({
    svgRef,
    renderFn: (selection, width, height) => {
      selection.selectAll("*").remove();

      const nodes = config.nodes;
      if (nodes.length === 0) return;

      const padding = 40;
      const layerHeight = 52;
      const layerGap = 4;
      const totalStackHeight = nodes.length * layerHeight + (nodes.length - 1) * layerGap;
      const stackWidth = width - padding * 2;
      const startY = height - padding - layerHeight;

      // Invert node order: first node (base) at the bottom, last node (app) at the top
      const reversed = [...nodes].reverse();

      const g = selection.append("g");

      // Subtle horizontal divider lines between layers
      for (let i = 1; i < reversed.length; i++) {
        const lineY = startY - i * (layerHeight + layerGap) + layerHeight + layerGap / 2;
        g.append("line")
          .attr("x1", padding)
          .attr("x2", padding + stackWidth)
          .attr("y1", lineY)
          .attr("y2", lineY)
          .attr("stroke", "#374151")
          .attr("stroke-width", 1)
          .attr("stroke-dasharray", "4 3");
      }

      const layers = g
        .selectAll(".layer")
        .data(reversed)
        .enter()
        .append("g")
        .attr("class", "layer")
        .attr("opacity", 0);

      const idxForY = (_d: unknown, i: number) => startY - i * (layerHeight + layerGap);

      layers
        .append("rect")
        .attr("x", padding)
        .attr("y", idxForY)
        .attr("width", stackWidth)
        .attr("height", layerHeight)
        .attr("rx", 6)
        .attr("fill", "#1f2937")
        .attr("stroke", "#374151")
        .attr("stroke-width", 1);

      // Layer label
      layers
        .append("text")
        .attr("x", padding + 16)
        .attr("y", (_d: unknown, i: number) => idxForY(_d, i) + layerHeight / 2 + 5)
        .attr("fill", "#e5e7eb")
        .attr("font-size", 14)
        .attr("font-weight", 500)
        .attr("dominant-baseline", "middle")
        .text((d) => d.data.label);

      // Cache status badge
      layers.each(function (d) {
        const cacheStatus = d.data.details?.cacheStatus;
        if (!cacheStatus) return;
        const color = CACHE_COLORS[cacheStatus] ?? "#6b7280";
        const badgeX = padding + stackWidth - 70;
        const badgeY = idxForY(d, reversed.indexOf(d)) + layerHeight / 2;

        d3.select(this)
          .append("rect")
          .attr("x", badgeX)
          .attr("y", badgeY - 10)
          .attr("width", 54)
          .attr("height", 20)
          .attr("rx", 4)
          .attr("fill", color)
          .attr("opacity", 0.2);

        d3.select(this)
          .append("text")
          .attr("x", badgeX + 27)
          .attr("y", badgeY + 1)
          .attr("fill", color)
          .attr("font-size", 11)
          .attr("font-weight", 600)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .text(cacheStatus.toUpperCase());
      });

      // Staggered fade-in + slide-up animation
      layers
        .transition()
        .duration(400)
        .delay((_d: unknown, i: number) => i * 120)
        .attr("opacity", 1)
        .attr("transform", function (_d, i) {
          const y = idxForY(_d, i);
          return `translate(0, 0)`;
        })
        .on("start", function () {
          d3.select(this).attr(
            "transform",
            (_d: unknown, i: number) => `translate(0, 10)`
          );
        })
        .tween("slide", function (_d, i) {
          const yStart = 10;
          const yEnd = 0;
          return (t: number) => {
            const y = yStart + (yEnd - yStart) * t;
            d3.select(this).attr("transform", `translate(0, ${y})`);
          };
        });
    },
    deps: [config],
  });

  return (
    <div className="h-[500px] w-full rounded-lg border border-gray-700 bg-gray-950">
      <svg ref={svgRef} className="h-full w-full" />
    </div>
  );
}