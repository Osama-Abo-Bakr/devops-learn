"use client";

import { useRef } from "react";
import * as d3 from "d3";
import type { DiagramConfig, DiagramNodeType } from "@/types";
import { useD3Renderer } from "./useD3Renderer";

interface D3ForceGraphProps {
  config: DiagramConfig;
}

const TYPE_COLORS: Record<DiagramNodeType, string> = {
  container: "#06b6d4",
  service: "#3b82f6",
  network: "#f59e0b",
  volume: "#22c55e",
  pod: "#a855f7",
  layer: "#6366f1",
  pipeline: "#ec4899",
  security: "#f43f5e",
  ingress: "#f97316",
  config: "#8b5cf6",
  stage: "#14b8a6",
  groupZone: "#6b7280",
};

interface SimNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: DiagramNodeType;
  connections: number;
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  edgeLabel?: string;
}

export default function D3ForceGraph({ config }: D3ForceGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useD3Renderer({
    svgRef,
    renderFn: (selection, width, height) => {
      selection.selectAll("*").remove();

      const nodes = config.nodes;
      const edges = config.edges;
      if (nodes.length === 0) return;

      // Count connections per node
      const connectionCount: Record<string, number> = {};
      nodes.forEach((n) => {
        connectionCount[n.id] = 0;
      });
      edges.forEach((e) => {
        connectionCount[e.source] = (connectionCount[e.source] || 0) + 1;
        connectionCount[e.target] = (connectionCount[e.target] || 0) + 1;
      });

      const simNodes: SimNode[] = nodes.map((n) => ({
        id: n.id,
        label: n.data.label,
        type: n.data.type,
        connections: connectionCount[n.id] || 0,
      }));

      const simLinks: SimLink[] = edges.map((e) => ({
        source: e.source,
        target: e.target,
        edgeLabel: e.data.label,
      }));

      // Zoom container
      const g = selection.append("g");

      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.3, 4])
        .on("zoom", (event) => {
          g.attr("transform", event.transform);
        });

      selection.call(zoom);

      // Dash animation CSS
      selection.append("style").text(`
        @keyframes dash-flow {
          to { stroke-dashoffset: -20; }
        }
        .dash-animated {
          animation: dash-flow 1s linear infinite;
        }
      `);

      // Links
      const link = g
        .append("g")
        .selectAll("line")
        .data(simLinks)
        .enter()
        .append("line")
        .attr("stroke", "#4b5563")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "6 4")
        .attr("class", "dash-animated");

      // Link labels
      const linkLabel = g
        .append("g")
        .selectAll("text")
        .data(simLinks.filter((l) => l.edgeLabel))
        .enter()
        .append("text")
        .attr("fill", "#9ca3af")
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .text((d) => d.edgeLabel ?? "");

      // Nodes
      const node = g
        .append("g")
        .selectAll(".node")
        .data(simNodes)
        .enter()
        .append("g")
        .attr("class", "node");

      const radiusScale = d3
        .scaleSqrt()
        .domain([0, d3.max(simNodes, (d) => d.connections) || 1])
        .range([14, 32]);

      node
        .append("circle")
        .attr("r", (d) => radiusScale(d.connections))
        .attr("fill", "#1f2937")
        .attr("stroke", (d) => TYPE_COLORS[d.type] || "#6b7280")
        .attr("stroke-width", 2);

      node
        .append("text")
        .attr("dy", (d) => radiusScale(d.connections) + 14)
        .attr("text-anchor", "middle")
        .attr("fill", "#e5e7eb")
        .attr("font-size", 11)
        .attr("font-weight", 500)
        .text((d) => d.label);

      // Fade in animation
      node.attr("opacity", 0).transition().duration(500).delay(300).attr("opacity", 1);

      // Force simulation
      const simulation = d3
        .forceSimulation(simNodes)
        .force(
          "link",
          d3
            .forceLink<SimNode, SimLink>(simLinks)
            .id((d) => d.id)
            .distance(100)
        )
        .force("charge", d3.forceManyBody().strength(-200))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide<SimNode>().radius((d) => radiusScale(d.connections) + 8))
        .on("tick", () => {
          link
            .attr("x1", (d) => (d.source as SimNode).x!)
            .attr("y1", (d) => (d.source as SimNode).y!)
            .attr("x2", (d) => (d.target as SimNode).x!)
            .attr("y2", (d) => (d.target as SimNode).y!);

          linkLabel
            .attr("x", (d) => ((d.source as SimNode).x! + (d.target as SimNode).x!) / 2)
            .attr("y", (d) => ((d.source as SimNode).y! + (d.target as SimNode).y!) / 2 - 6);

          node.attr("transform", (d) => `translate(${d.x},${d.y})`);
        });

      // Drag behavior
      const drag = d3
        .drag<SVGGElement, SimNode>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        });

      node.call(drag as unknown as (selection: d3.Selection<SVGGElement, SimNode, SVGGElement, unknown>) => void);
    },
    deps: [config],
  });

  return (
    <div className="h-[500px] w-full rounded-lg border border-gray-700 bg-gray-950">
      <svg ref={svgRef} className="h-full w-full" />
    </div>
  );
}